---
title: "Medallion Architecture for AI Agent Memory Pipelines: PostgreSQL + Neo4j"
description: "The medallion architecture (bronze/silver/gold) applied to AI agent memory creates a progressive refinement pipeline that transforms raw conversational data into a curated,..."
date: "2025-12-24"
category: "AI Agent Memory Systems"
author: "QorSync AI Research Team"
readTime: "17 min read"
published: true
---

# Medallion Architecture for AI Agent Memory Pipelines: PostgreSQL + Neo4j

## Comprehensive Research Report

* * *

## 1\. Architecture Overview

The medallion architecture (bronze/silver/gold) applied to AI agent memory creates a progressive refinement pipeline that transforms raw conversational data into a curated, queryable knowledge graph. This is a natural fit for agent memory because conversations are inherently unstructured (bronze), contain extractable entities and relationships (silver), and can be synthesized into a persistent knowledge model (gold).

### Core Data Flow

`Conversations/Tool Outputs → [Bronze: PostgreSQL] → [Silver: PostgreSQL + Neo4j] → [Gold: Neo4j]      Raw ingestion            Append-only logs       Extracted entities/rels      Curated KG`

* * *

## 2\. Bronze Layer: Raw Conversation Logs (PostgreSQL)

### Purpose

Immutable, append-only storage of all raw agent interactions. This is the “source of truth” from which all downstream layers are derived. Nothing is discarded at this stage.

### Schema Design

`-- Core conversation storage CREATE TABLE bronze.conversations (     conversation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),     agent_id        TEXT NOT NULL,     session_id      UUID NOT NULL,     started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),     metadata        JSONB DEFAULT '{}'::jsonb );  CREATE TABLE bronze.messages (     message_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),     conversation_id UUID NOT NULL REFERENCES bronze.conversations(conversation_id),     sequence_num    INTEGER NOT NULL,     role            TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),     content         TEXT NOT NULL,     raw_payload     JSONB,          -- Full API response/request payload     token_count     INTEGER,     model_id        TEXT,     created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),     ingested_at     TIMESTAMPTZ NOT NULL DEFAULT now(),     checksum        TEXT NOT NULL,  -- SHA-256 for dedup     UNIQUE(conversation_id, sequence_num) );  -- Tool call/result tracking CREATE TABLE bronze.tool_events (     event_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),     message_id      UUID NOT NULL REFERENCES bronze.messages(message_id),     tool_name       TEXT NOT NULL,     tool_input      JSONB,     tool_output     JSONB,     duration_ms     INTEGER,     status          TEXT CHECK (status IN ('success', 'error', 'timeout')),     created_at      TIMESTAMPTZ NOT NULL DEFAULT now() );  -- Partitioning by month for manageability CREATE TABLE bronze.messages PARTITION BY RANGE (created_at); CREATE TABLE bronze.messages_2026_03 PARTITION OF bronze.messages     FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');`

### Best Practices for Bronze Ingestion

**1\. Append-only with checksums.** Never update bronze records. Use SHA-256 checksums for idempotent dedup so re-ingesting the same message is a no-op.

**2\. Use PostgreSQL partitioning.** Partition `bronze.messages` by time range (monthly). This gives you efficient range scans for reprocessing windows, fast partition drops for retention, and parallel vacuum per partition.

**3\. Write-ahead log (WAL) based CDC.** Use PostgreSQL logical replication or a CDC tool (Debezium, or the simpler `pg_logical` extension) to stream inserts from bronze into the silver processing pipeline. This decouples ingestion speed from transformation speed.

**4\. JSONB for schema flexibility.** Store the full raw API payload in `raw_payload JSONB`. This lets you re-extract fields later as your silver schema evolves without re-ingesting from external sources.

**5\. Watermark tracking for continuous ingestion.**

`CREATE TABLE bronze.ingestion_watermarks (     source_id       TEXT PRIMARY KEY,     last_offset     BIGINT NOT NULL,      -- Kafka offset, API cursor, etc.     last_timestamp  TIMESTAMPTZ NOT NULL,     updated_at      TIMESTAMPTZ NOT NULL DEFAULT now() );`

This pattern (common in Databricks/Delta Lake medallion implementations and documented in their 2024 engineering blog posts) tracks exactly where each source left off, enabling restart-safe continuous ingestion.

* * *

## 3\. Silver Layer: Extracted Entities & Relationships (PostgreSQL + Neo4j)

### Purpose

Structured extraction from raw conversations: named entities, relationships, facts, sentiments, and resolved references. This is where NLP/LLM extraction runs, and where data quality enforcement begins.

### ETL Pattern: Bronze-to-Silver Extraction

The silver transformation is the most complex step. It involves:

1.  **Entity extraction** (people, organizations, concepts, tools, code artifacts)
2.  **Relationship extraction** (user prefers X, project depends on Y)
3.  **Coreference resolution** (merging “the database”, “PostgreSQL”, “our DB” into one entity)
4.  **Temporal tagging** (when was this fact stated/valid)
5.  **Confidence scoring** (how certain is the extraction)

### Silver Schema in PostgreSQL (Relational Side)

`CREATE TABLE silver.entities (     entity_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),     entity_type     TEXT NOT NULL,  -- 'person', 'technology', 'concept', 'project', etc.     canonical_name  TEXT NOT NULL,     aliases         TEXT[] DEFAULT '{}',     properties      JSONB DEFAULT '{}'::jsonb,     confidence      FLOAT NOT NULL CHECK (confidence BETWEEN 0.0 AND 1.0),     source_messages UUID[] NOT NULL,  -- References to bronze.messages     first_seen_at   TIMESTAMPTZ NOT NULL,     last_seen_at    TIMESTAMPTZ NOT NULL,     extraction_model TEXT NOT NULL,   -- Which LLM/model extracted this     UNIQUE(entity_type, canonical_name) );  CREATE TABLE silver.relationships (     relationship_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),     source_entity   UUID NOT NULL REFERENCES silver.entities(entity_id),     target_entity   UUID NOT NULL REFERENCES silver.entities(entity_id),     relationship_type TEXT NOT NULL,  -- 'uses', 'prefers', 'depends_on', 'knows', etc.     properties      JSONB DEFAULT '{}'::jsonb,     confidence      FLOAT NOT NULL CHECK (confidence BETWEEN 0.0 AND 1.0),     valid_from      TIMESTAMPTZ,     valid_to        TIMESTAMPTZ,     -- NULL means still valid     source_messages UUID[] NOT NULL,     extracted_at    TIMESTAMPTZ NOT NULL DEFAULT now() );  CREATE TABLE silver.facts (     fact_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),     subject_entity  UUID REFERENCES silver.entities(entity_id),     predicate       TEXT NOT NULL,     object_value    TEXT NOT NULL,     object_entity   UUID REFERENCES silver.entities(entity_id),     confidence      FLOAT NOT NULL,     is_negation     BOOLEAN DEFAULT FALSE,     source_messages UUID[] NOT NULL,     stated_at       TIMESTAMPTZ NOT NULL,     superseded_by   UUID REFERENCES silver.facts(fact_id)  -- Fact evolution chain );`

### Silver in Neo4j (Graph Projection)

The silver entities and relationships are **dual-written** to Neo4j for graph traversal queries. This is not a replacement for PostgreSQL at this layer – PostgreSQL remains the relational backbone for joins, aggregations, and SQL-based quality checks. Neo4j provides the graph traversal capability.

`// Entity node creation (idempotent MERGE) MERGE (e:Entity {entity_id: $entity_id}) SET e.entity_type = $entity_type,     e.canonical_name = $canonical_name,     e.confidence = $confidence,     e.last_seen_at = datetime($last_seen_at),     e.extraction_model = $extraction_model // Add type-specific label WITH e CALL apoc.create.addLabels(e, [$entity_type]) YIELD node RETURN node;  // Relationship creation MATCH (s:Entity {entity_id: $source_entity}) MATCH (t:Entity {entity_id: $target_entity}) CALL apoc.merge.relationship(s, $relationship_type,      {relationship_id: $relationship_id},      {confidence: $confidence, valid_from: datetime($valid_from)},      t, {}) YIELD rel RETURN rel;`

### Extraction Pipeline Implementation

The recommended pattern (seen in production implementations by Langchain’s LangGraph memory, Mem0, and Zep – all of which evolved significantly in 2024-2025) is a **micro-batch extraction loop**:

`┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐ │ CDC Stream   │────▶│ Batch Window │────▶│ LLM Extract │────▶│ Quality Gate │ │ from Bronze  │     │ (30s/100msg) │     │ (structured) │     │ (validation) │ └─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘                                                                      │                                               ┌──────────────────────┤                                               ▼                      ▼                                       ┌──────────────┐      ┌──────────────┐                                       │ PostgreSQL    │      │ Dead Letter  │                                       │ silver.*      │      │ Queue        │                                       └──────────────┘      └──────────────┘                                               │                                               ▼                                       ┌──────────────┐                                       │ Neo4j Silver  │                                       │ (dual-write)  │                                       └──────────────┘`

**Key design decisions:**

**1\. Micro-batch, not streaming.** Pure event-at-a-time streaming is wasteful for LLM extraction because each API call has overhead. Batch 30-100 messages together (or a 30-second window, whichever comes first) and extract entities from the batch. This amortizes LLM call costs and allows cross-message coreference resolution within a batch.

**2\. Structured output for extraction.** Use the LLM’s structured output mode (e.g., `response_format` with JSON schema, or tool-calling with defined schemas) to force the model to return entities, relationships, and facts in a parseable format. Example prompt structure:

`Given these conversation messages, extract: 1. Entities: {name, type, aliases, properties} 2. Relationships: {source, target, type, properties, confidence}   3. Facts: {subject, predicate, object, confidence}  Return as JSON matching this schema: ...`

**3\. Dead-letter queue for extraction failures.** When the LLM returns unparseable output or validation fails, route to a DLQ table rather than blocking the pipeline. Reprocess periodically with retries/different prompts.

**4\. Idempotent upserts with conflict resolution.** Use PostgreSQL `ON CONFLICT` clauses and Neo4j `MERGE` to handle re-extraction gracefully:

`INSERT INTO silver.entities (entity_id, entity_type, canonical_name, confidence, ...) VALUES (...) ON CONFLICT (entity_type, canonical_name) DO UPDATE SET     confidence = GREATEST(silver.entities.confidence, EXCLUDED.confidence),     last_seen_at = GREATEST(silver.entities.last_seen_at, EXCLUDED.last_seen_at),     aliases = array_cat(silver.entities.aliases, EXCLUDED.aliases);`

### Data Quality Layer (Silver)

Data quality is the defining characteristic of the silver layer. Implement these checks:

`-- Quality check: orphan relationships (referencing non-existent entities) SELECT r.* FROM silver.relationships r LEFT JOIN silver.entities s ON r.source_entity = s.entity_id LEFT JOIN silver.entities t ON r.target_entity = t.entity_id WHERE s.entity_id IS NULL OR t.entity_id IS NULL;  -- Quality check: low-confidence entity proliferation SELECT entity_type, COUNT(*) as count, AVG(confidence) as avg_conf FROM silver.entities WHERE confidence < 0.5 GROUP BY entity_type HAVING COUNT(*) > 100;  -- Quality check: duplicate entities (fuzzy match candidates for merging) SELECT a.entity_id, b.entity_id, a.canonical_name, b.canonical_name,        similarity(a.canonical_name, b.canonical_name) as sim FROM silver.entities a, silver.entities b WHERE a.entity_type = b.entity_type   AND a.entity_id < b.entity_id   AND similarity(a.canonical_name, b.canonical_name) > 0.8;   -- Requires pg_trgm extension`

**Quality dimensions tracked:**

| Dimension | Check | Threshold |
| --- | --- | --- |
| Completeness | Entity has at least one source\_message | 100% |
| Confidence | Average extraction confidence | \> 0.7 for promotion |
| Uniqueness | No fuzzy duplicates above 0.85 similarity | 0 violations |
| Consistency | Relationship endpoints exist | 100% |
| Timeliness | Extraction latency from bronze ingestion | < 5 minutes |
| Provenance | Every silver record traces to bronze | 100% |

* * *

## 4\. Gold Layer: Curated Knowledge Graph (Neo4j)

### Purpose

The gold layer is the **production-serving** layer. It contains merged, deduplicated, high-confidence entities and relationships forming a coherent knowledge graph that agents query at runtime. This is Neo4j’s primary role.

### Gold Graph Model

`// Gold node types with strict schema // Person nodes CREATE CONSTRAINT gold_person_id IF NOT EXISTS FOR (p:Person) REQUIRE p.person_id IS UNIQUE;  // Technology nodes CREATE CONSTRAINT gold_tech_id IF NOT EXISTS FOR (t:Technology) REQUIRE t.tech_id IS UNIQUE;  // Concept nodes CREATE CONSTRAINT gold_concept_id IF NOT EXISTS FOR (c:Concept) REQUIRE c.concept_id IS UNIQUE;  // Project nodes CREATE CONSTRAINT gold_project_id IF NOT EXISTS FOR (p:Project) REQUIRE p.project_id IS UNIQUE;  // Preference nodes (captures user preferences as first-class citizens) CREATE CONSTRAINT gold_preference_id IF NOT EXISTS FOR (pr:Preference) REQUIRE pr.preference_id IS UNIQUE;`

**Gold node example (fully resolved):**

`(:Person {     person_id: "uuid-...",     name: "Dhawal",     role: "developer",     merged_from: ["silver-entity-1", "silver-entity-2"],  // Provenance     confidence: 0.95,     fact_count: 47,     last_interaction: datetime("2026-03-19T..."),     created_at: datetime("2026-01-15T..."),     version: 3   // Tracks how many times this node was updated }) -[:PREFERS {since: datetime("2026-02-01"), confidence: 0.92}]-> (:Technology {name: "PostgreSQL", category: "database"})  -[:WORKS_ON {role: "lead", confidence: 0.88}]-> (:Project {name: "Agent Memory Pipeline"})`

### Silver-to-Gold Promotion Pipeline

This is a **scheduled batch process** (not continuous) because gold curation requires global consistency checks that are expensive to run per-event.

`┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐ │ Silver        │────▶│ Entity       │────▶│ Conflict     │────▶│ Gold Neo4j   │ │ Candidates   │     │ Resolution   │     │ Resolution   │     │ (atomic tx)  │ │ (confidence  │     │ (merge dupes)│     │ (fact check) │     │              │ │  > 0.7)      │     │              │     │              │     │              │ └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘`

**Step 1: Candidate selection** – Query silver for entities/relationships with confidence above threshold and sufficient corroboration (seen in multiple messages or conversations).

`-- Promotion candidates: high confidence, multi-source corroboration SELECT entity_id, canonical_name, entity_type, confidence,        array_length(source_messages, 1) as source_count FROM silver.entities WHERE confidence >= 0.7   AND array_length(source_messages, 1) >= 2   AND entity_id NOT IN (       SELECT silver_entity_id FROM gold.promotion_log        WHERE promoted_at > now() - interval '1 hour'   );`

**Step 2: Entity resolution.** Merge silver entities that refer to the same real-world concept. This uses a combination of:  
\- Exact name matching  
\- Fuzzy string similarity (pg\_trgm)  
\- Alias overlap  
\- Co-occurrence in the same conversations  
\- LLM-assisted disambiguation for hard cases

**Step 3: Conflict resolution.** When facts contradict (e.g., “user prefers vim” vs “user prefers neovim”), apply these rules:  
\- **Recency wins** for preferences (most recent statement takes precedence)  
\- **Frequency wins** for factual claims (more mentions = more likely true)  
\- **Explicit negation overrides** (if user says “I no longer use X”, mark previous fact superseded)  
\- **Flag for human review** when automated resolution confidence is low

**Step 4: Atomic gold write.** Write to Neo4j in a single transaction:

`// Atomic gold update transaction CALL apoc.periodic.iterate(   "UNWIND $batch AS item RETURN item",   "MERGE (e:Entity {entity_id: item.entity_id})    SET e += item.properties    WITH e, item    UNWIND item.relationships AS rel    MATCH (t:Entity {entity_id: rel.target_id})    MERGE (e)-[r:RELATES_TO {type: rel.type}]->(t)    SET r += rel.properties",   {batchSize: 100, params: {batch: $promotionBatch}} );`

### Gold Layer Quality Enforcement

`// Gold quality: no orphan nodes (every node must have at least one relationship) MATCH (n) WHERE NOT (n)--() AND NOT n:Root RETURN n.entity_id, labels(n) AS types, n.name LIMIT 100;  // Gold quality: no duplicate edges MATCH (a)-[r1]->(b), (a)-[r2]->(b) WHERE type(r1) = type(r2) AND id(r1) < id(r2) RETURN a.name, type(r1), b.name, r1, r2;  // Gold quality: temporal consistency (valid_to < valid_from) MATCH ()-[r]->() WHERE r.valid_to IS NOT NULL AND r.valid_to < r.valid_from RETURN r;  // Gold quality: confidence floor MATCH (n) WHERE n.confidence < 0.7 RETURN count(n) AS below_threshold;`

* * *

## 5\. Production Architecture Patterns

### 5.1 Continuous Ingestion with Exactly-Once Semantics

The critical production concern is ensuring exactly-once processing from bronze through gold. The pattern that has emerged as standard (documented in Confluent and Databricks architectures, and adopted by memory-focused projects like Mem0 v0.2+ and Zep v2+) is:

`Agent Runtime      │      ▼ Message Queue (Redis Streams / Kafka)      │      ▼ Bronze Writer (idempotent, checksum-dedup)      │      ▼ PostgreSQL Bronze (CDC via logical replication)      │      ▼ Silver Processor (micro-batch, LLM extraction)      │      ├──▶ PostgreSQL Silver (relational, quality checks)      │      └──▶ Neo4j Silver (graph projection, dual-write)      │      ▼ (scheduled, e.g., every 15 minutes) Gold Promoter (entity resolution, conflict resolution)      │      ▼ Neo4j Gold (production-serving knowledge graph)      │      ▼ Agent Runtime (reads at query time)`

**Key infrastructure components:**

| Component | Recommended Technology | Role |
| --- | --- | --- |
| Message buffer | Redis Streams or Kafka | Decouple agent runtime from ingestion |
| Bronze DB | PostgreSQL 16+ (partitioned) | Append-only raw storage |
| CDC | Debezium or pg\_logical | Stream changes to silver processor |
| Silver processor | Python service (async) | LLM extraction, quality checks |
| Silver relational | PostgreSQL (same instance, different schema) | Entity/relationship tables |
| Silver/Gold graph | Neo4j 5.x | Graph storage and traversal |
| Scheduler | pg\_cron or Temporal | Gold promotion scheduling |
| Monitoring | Prometheus + Grafana | Pipeline health, latency, quality |

### 5.2 Backfill and Reprocessing

A key advantage of the medallion architecture is **reprocessability**. When your extraction model improves, you can reprocess bronze data through silver without losing the original data.

`-- Reprocessing pattern: mark silver records for re-extraction -- Step 1: Create a reprocessing job INSERT INTO silver.reprocessing_jobs (job_id, reason, bronze_start, bronze_end) VALUES (gen_random_uuid(), 'Model upgrade v2→v3', '2026-01-01', '2026-03-01');  -- Step 2: Soft-delete existing silver extractions for the window UPDATE silver.entities SET superseded_at = now(), superseded_by_job = $job_id WHERE first_seen_at BETWEEN '2026-01-01' AND '2026-03-01';  -- Step 3: Re-extract from bronze (the processor reads from bronze using the window) -- Step 4: New silver records are created with the new extraction_model tag -- Step 5: Gold promotion picks up the new silver records in its next cycle`

### 5.3 Query Patterns for Agent Runtime

The gold graph serves the agent at query time. Key query patterns:

`// 1. "What do I know about this user?" MATCH (u:Person {name: $user_name})-[r]->(target) WHERE r.confidence >= 0.7 RETURN u, type(r) AS relationship, r.confidence, target ORDER BY r.confidence DESC, r.last_updated DESC LIMIT 50;  // 2. "What technologies does this user prefer?" MATCH (u:Person {name: $user_name})-[:PREFERS]->(t:Technology) WHERE NOT EXISTS {     MATCH (u)-[n:STOPPED_USING]->(t)     WHERE n.since > u.last_interaction - duration('P90D') } RETURN t.name, t.category ORDER BY t.last_mentioned DESC;  // 3. "Find related context for this topic" MATCH (seed:Concept {name: $topic}) CALL apoc.path.subgraphNodes(seed, {     maxLevel: 3,     relationshipFilter: ">",     minLevel: 1 }) YIELD node RETURN node, labels(node), node.name, node.confidence ORDER BY node.confidence DESC LIMIT 30;  // 4. "Temporal query: what changed recently?" MATCH (n)-[r]->(m) WHERE r.last_updated > datetime() - duration('P7D') RETURN n.name, type(r), m.name, r.last_updated ORDER BY r.last_updated DESC;`

### 5.4 Memory Decay and Retention

Production systems need memory lifecycle management:

`-- Bronze retention: keep 12 months, archive to cold storage -- (implemented via partition dropping + pg_dump to S3)  -- Silver decay: reduce confidence of unseen entities over time UPDATE silver.entities SET confidence = confidence * 0.95  -- 5% decay per cycle WHERE last_seen_at < now() - interval '30 days'   AND confidence > 0.1;  -- Gold pruning: remove low-confidence nodes that have decayed below threshold -- (Run weekly)`

`// Neo4j gold pruning MATCH (n) WHERE n.confidence < 0.3   AND n.last_interaction < datetime() - duration('P90D') DETACH DELETE n;`

* * *

## 6\. Real-World Implementation Patterns (2024-2026)

### 6.1 Mem0 (2024-2025)

Mem0 (formerly OpenMemory) open-sourced a memory layer for AI agents. Their architecture evolved toward a medallion-like pattern:  
\- **Raw layer**: Stores full conversation history in PostgreSQL  
\- **Memory layer**: Uses LLM extraction to pull structured “memories” (similar to silver entities/facts)  
\- **Graph layer**: Added Neo4j integration in late 2024 for relationship-aware memory retrieval  
\- Key insight from their implementation: they found that **vector search alone was insufficient** for agent memory – graph-based retrieval of related entities significantly improved recall quality

### 6.2 Zep (2024-2025)

Zep’s memory server uses a similar tiered approach:  
\- Stores raw messages (bronze equivalent)  
\- Extracts entities and summaries asynchronously (silver equivalent)  
\- Builds a temporal knowledge graph (gold equivalent)  
\- Their production finding: **asynchronous extraction is critical** – extracting entities synchronously in the agent’s hot path added unacceptable latency (500ms-2s per turn)

### 6.3 LangGraph Memory (2025)

LangChain’s LangGraph introduced a memory store pattern:  
\- Uses PostgreSQL as the primary store  
\- Supports both “semantic memory” (vector-indexed) and “episodic memory” (structured events)  
\- Their approach emphasizes **namespaced memory** where different agents/components write to isolated namespaces but can read across them – a pattern well-suited to the medallion model where bronze is per-agent but gold is shared

### 6.4 Microsoft GraphRAG (2024-2025)

Microsoft Research’s GraphRAG framework demonstrated the value of:  
\- Building community-level summaries from entity graphs (similar to gold layer aggregations)  
\- Using hierarchical graph structures for multi-resolution retrieval  
\- Their finding: **graph-based retrieval outperformed vector-only retrieval by 30-70% on global queries** (questions requiring synthesis across many documents)

### 6.5 WhyHow Knowledge Graph Framework (2025)

WhyHow.AI released patterns for:  
\- Schema-guided entity extraction (enforcing an ontology at the silver layer)  
\- Triple validation before graph insertion  
\- Key insight: **defining your ontology upfront** (what entity types and relationship types exist) dramatically improves extraction quality vs. open-ended extraction

* * *

## 7\. Critical Implementation Recommendations

### 7.1 Start with a Defined Ontology

Do not allow open-ended entity/relationship extraction. Define your schema:

`ENTITY_TYPES = [     "person", "technology", "programming_language", "framework",     "concept", "project", "organization", "preference", "workflow" ]  RELATIONSHIP_TYPES = [     "uses", "prefers", "knows", "works_on", "depends_on",     "related_to", "supersedes", "contradicts", "part_of" ]`

This bounded ontology goes into your extraction prompts and is enforced at the silver quality gate.

### 7.2 Dual-Database Synchronization

The PostgreSQL-Neo4j synchronization is the trickiest operational concern. Recommendations:

-   **PostgreSQL is the source of truth** for silver. Neo4j silver is a projection.
-   **Neo4j is the source of truth** for gold. PostgreSQL gold (if you keep one) is a projection.
-   Use a **transactional outbox pattern**: write to PostgreSQL, then publish an event that triggers the Neo4j write. If Neo4j write fails, retry from the outbox.
-   Monitor sync lag as a key operational metric.

### 7.3 LLM Extraction Cost Management

Silver extraction is the most expensive operation (LLM API calls). Manage costs:

-   **Batch aggressively**: Send 50-100 messages per extraction call, not one at a time.
-   **Use smaller models for extraction**: Haiku-class models perform well for structured entity extraction at 10-20x lower cost than frontier models.
-   **Cache extraction results**: If the same conversation is reprocessed, check if bronze checksums match previously extracted records.
-   **Progressive extraction**: Extract entities on first pass, relationships on second pass only for high-confidence entities. This avoids wasting relationship extraction on entities that will be filtered out.

### 7.4 Versioning and Auditability

Every layer should maintain full provenance:

`Gold entity "PostgreSQL (Technology)"    ← merged from Silver entities [uuid-1, uuid-2, uuid-3]     ← extracted from Bronze messages [uuid-a, uuid-b, ..., uuid-f]       ← ingested from conversations [conv-1, conv-2]`

This chain enables debugging (“why does the agent think I prefer MySQL?”) and enables clean reprocessing when extraction quality improves.

### 7.5 Indexing Strategy

`-- PostgreSQL bronze CREATE INDEX idx_bronze_messages_conv_seq ON bronze.messages(conversation_id, sequence_num); CREATE INDEX idx_bronze_messages_created ON bronze.messages(created_at); CREATE INDEX idx_bronze_messages_checksum ON bronze.messages(checksum);  -- PostgreSQL silver CREATE INDEX idx_silver_entities_type_name ON silver.entities(entity_type, canonical_name); CREATE INDEX idx_silver_entities_confidence ON silver.entities(confidence) WHERE confidence >= 0.7; CREATE INDEX idx_silver_relationships_type ON silver.relationships(relationship_type); CREATE INDEX idx_silver_entities_gin_aliases ON silver.entities USING GIN(aliases);`

`-- Neo4j gold CREATE INDEX gold_entity_name FOR (n:Entity) ON (n.name); CREATE INDEX gold_entity_type FOR (n:Entity) ON (n.entity_type); CREATE INDEX gold_rel_confidence FOR ()-[r:RELATES_TO]-() ON (r.confidence); CREATE FULLTEXT INDEX gold_entity_search FOR (n:Entity) ON EACH [n.name, n.description];`

* * *

## 8\. Summary Decision Matrix

| Decision | Recommendation | Rationale |
| --- | --- | --- |
| Bronze storage | PostgreSQL (partitioned) | SQL for ad-hoc queries, partitions for retention |
| Silver relational | PostgreSQL (same instance) | Minimize infrastructure; SQL for quality checks |
| Silver graph | Neo4j (dual-write from PG) | Enable graph queries early for validation |
| Gold serving | Neo4j (primary) | Graph traversal is the dominant query pattern |
| Ingestion pattern | Append-only with CDC | Decoupled, reprocessable, exactly-once capable |
| Extraction model | Haiku-class, structured output | Cost-effective, reliable parsing |
| Extraction cadence | Micro-batch (30s / 100 messages) | Balance latency vs. cost vs. coreference quality |
| Gold promotion | Scheduled batch (every 15 min) | Global consistency requires batch checks |
| Entity resolution | Fuzzy + co-occurrence + LLM fallback | Multi-strategy catches more duplicates |
| Memory decay | Confidence decay + periodic pruning | Prevents unbounded graph growth |
| Reprocessing | Soft-delete silver, re-extract from bronze | Non-destructive, auditable |

This architecture provides a production-grade foundation for AI agent memory that is auditable (full bronze provenance), evolvable (reprocessable silver), and performant (curated gold graph for runtime queries).
