---
title: "Real-Time Memory Indexing System: Architecture & Implementation Guide"
description: "The goal is to build a system that:"
date: "2025-12-25"
category: "AI Agent Memory Systems"
author: "QorSync AI Research Team"
readTime: "18 min read"
published: true
---

# Real-Time Memory Indexing System: Architecture & Implementation Guide

## A Comprehensive Technical Report (2025–2026 State of the Art)

* * *

## 1\. Problem Statement

The goal is to build a system that:

1.  Ingests a continuous stream of conversation text (chat, voice transcripts, agent logs)
2.  Extracts named entities (people, orgs, concepts, timestamps) in real time
3.  Identifies relationships between those entities
4.  Writes the resulting triples into a knowledge graph
5.  Achieves **sub-second end-to-end latency** from message arrival to graph availability

This is the backbone of “memory” for AI agents, customer intelligence platforms, and conversational analytics.

* * *

## 2\. High-Level Architecture

`┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐ │ Conversation │───>│ Event Broker │───>│  NER + RelExt  │───>│  Graph Store │ │   Sources    │    │ (Kafka/Redis)│    │  (Stream Proc) │    │ (Neo4j/etc.) │ └─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘                          │                     │                      │                          │              ┌──────┴───────┐              │                          │              │  Entity Res.  │              │                          │              │  + Dedup      │              │                          │              └──────────────┘              │                          │                                            │                          └──────── Dead Letter Queue ─────────────────┘`

The pipeline has four stages: **Ingest**, **Extract**, **Resolve**, and **Persist**. Each is decoupled by an event broker, enabling independent scaling and fault isolation.

* * *

## 3\. Stage 1 — Streaming Ingestion

### 3.1 Apache Kafka (Recommended for Production)

Kafka remains the dominant choice for high-throughput, durable event streaming in 2025–2026.

**Why Kafka:**  
\- Partitioned topics allow parallel consumption keyed by conversation ID, preserving message order within a conversation.  
\- Consumer groups enable horizontal scaling of extraction workers.  
\- Log compaction provides replay capability for reprocessing after model upgrades.  
\- KRaft mode (GA since Kafka 3.5, mature by 2025) eliminates ZooKeeper dependency.

**Topic design:**

| Topic | Key | Value | Partitions |
| --- | --- | --- | --- |
| `conversations.raw` | `conversation_id` | `{text, timestamp, speaker, metadata}` | 32–128 |
| `entities.extracted` | `entity_id` | `{entity, type, source_msg, confidence}` | 32–128 |
| `relationships.extracted` | `relationship_id` | `{subject, predicate, object, confidence}` | 32–128 |
| `graph.commands` | `entity_id` | `{MERGE/CREATE command, payload}` | 16–64 |

**Latency profile:** Kafka producer with `acks=1` and `linger.ms=0` delivers single-digit millisecond publish latency. Consumer poll intervals of 10–50ms keep end-to-end broker overhead under 100ms.

### 3.2 Redis Streams (Alternative for Lower Scale)

Redis Streams are a lighter-weight option when:  
\- Throughput is under 100K messages/second  
\- You want simpler operations (no separate cluster to manage)  
\- You already have Redis in your stack

**Key Redis Streams features for this use case:**  
\- Consumer groups with `XREADGROUP` provide Kafka-like semantics  
\- `XACK` for at-least-once delivery  
\- Trimming with `MAXLEN` or `MINID` for memory management  
\- Sub-millisecond latency for small messages

**Trade-offs vs. Kafka:**  
\- No built-in log compaction or long-term retention  
\- Memory-bound (unless using Redis on Flash)  
\- Weaker durability guarantees under failure  
\- Less mature ecosystem for exactly-once semantics

**Recommendation:** Use Kafka for production systems handling >10K conversations/second or requiring replay. Use Redis Streams for prototyping, lower-scale deployments, or when latency requirements are extremely tight (<10ms total).

### 3.3 Schema and Serialization

Use **Apache Avro** or **Protobuf** with a schema registry (Confluent Schema Registry or Buf Schema Registry) for:  
\- Compact binary encoding (30–50% smaller than JSON)  
\- Schema evolution without breaking consumers  
\- Type safety across polyglot services

Example Protobuf schema:

`message ConversationMessage {   string conversation_id = 1;   string message_id = 2;   string speaker = 3;   string text = 4;   int64 timestamp_ms = 5;   map<string, string> metadata = 6; }  message ExtractedEntity {   string entity_id = 1;   string surface_form = 2;   string canonical_form = 3;   string entity_type = 4;  // PERSON, ORG, CONCEPT, DATE, etc.   float confidence = 5;   string source_message_id = 6;   int32 char_offset_start = 7;   int32 char_offset_end = 8; }  message ExtractedRelationship {   string relationship_id = 1;   string subject_entity_id = 2;   string predicate = 3;   string object_entity_id = 4;   float confidence = 5;   string source_message_id = 6; }`

* * *

## 4\. Stage 2 — Streaming NER (Named Entity Recognition)

### 4.1 Model Selection in 2025–2026

The landscape has shifted significantly. There are three viable tiers:

**Tier 1: Transformer-based NER models (Best latency, good accuracy)**

-   **GLiNER (2024–2025):** A generalist NER model that accepts arbitrary entity types as input — no fine-tuning needed for new domains. The `gliner-large-v2.1` model handles zero-shot NER with strong accuracy. Runs at 2–5ms per sentence on GPU.
-   **SpanMarker (with DeBERTa-v3-large):** State-of-the-art for span-based NER. Slightly slower (5–10ms/sentence) but more accurate for overlapping entities.
-   **LiteLLM + small LLMs for NER:** Using quantized 1B–3B parameter models (e.g., Phi-3-mini, Gemma-2B) with structured output for NER. Latency of 20–50ms/sentence but handles complex conversational NER better.

**Tier 2: Classical + Neural hybrid**

-   **spaCy v3.7+ with transformer pipelines:** The `en_core_web_trf` pipeline backed by RoBERTa provides a solid balance. Adding a custom `EntityRuler` for domain-specific entities (product names, internal jargon) brings precision above 90% for known domains.
-   **Stanza (Stanford NLP, 2025 release):** Strong multilingual support, good for international deployments.

**Tier 3: LLM-based extraction (Highest accuracy, higher latency)**

-   Calling an LLM (Claude Haiku, GPT-4o-mini) with structured output for entity and relationship extraction simultaneously. Latency: 100–500ms. Use this for complex or ambiguous inputs, with Tier 1 as the fast path.

**Recommended approach — Cascading architecture:**

`Message arrives     │     ├─── Fast path (95% of messages): GLiNER or spaCy     │    Latency: 2–10ms     │    Confidence threshold: 0.85     │     └─── Slow path (5% of messages, low confidence): LLM extraction          Latency: 100–300ms          Triggered when fast-path confidence < 0.85`

### 4.2 Streaming NER Implementation

The critical challenge is that NER models expect complete sentences, but conversation streams arrive token-by-token or message-by-message. Solutions:

**Sentence-boundary buffering:** Buffer tokens until a sentence boundary is detected (using a lightweight sentence segmenter like PySBD or spaCy’s sentencizer), then dispatch to NER.

**Sliding window with incremental output:** Maintain a window of the last N tokens. Run NER on each window, but only emit entities from the newly added tokens, using offset tracking to avoid duplicates.

**Implementation with Faust (Python stream processing):**

`import faust from gliner import GLiNER  app = faust.App('ner-processor', broker='kafka://localhost:9092')  raw_topic = app.topic('conversations.raw', value_type=ConversationMessage) entity_topic = app.topic('entities.extracted', value_type=ExtractedEntity)  model = GLiNER.from_pretrained("urchade/gliner_large-v2.1") ENTITY_LABELS = ["person", "organization", "location", "concept",                  "product", "date", "event"]  @app.agent(raw_topic, concurrency=8) async def extract_entities(messages):     async for msg in messages:         entities = model.predict_entities(             msg.text,             ENTITY_LABELS,             threshold=0.5         )         for ent in entities:             await entity_topic.send(                 key=generate_entity_id(ent["text"], ent["label"]),                 value=ExtractedEntity(                     surface_form=ent["text"],                     entity_type=ent["label"],                     confidence=ent["score"],                     source_message_id=msg.message_id,                     char_offset_start=ent["start"],                     char_offset_end=ent["end"],                 )             )`

### 4.3 GPU Serving for NER at Scale

For production, serve NER models behind a dedicated inference service:

-   **Triton Inference Server (NVIDIA):** Supports dynamic batching, which is critical — it accumulates requests over a short window (e.g., 5ms) and runs them as a single GPU batch, dramatically improving throughput.
-   **vLLM (for LLM-based NER):** Continuous batching and PagedAttention for efficient LLM inference.
-   **ONNX Runtime:** Export transformer NER models to ONNX for 2–3x speedup over PyTorch inference.

**Batching strategy:** Configure dynamic batching with max batch size 32 and max delay 5ms. This means a request waits at most 5ms for companions, then the batch runs in parallel. Net effect: per-request latency stays under 15ms while throughput increases 10–20x.

* * *

## 5\. Stage 3 — Relationship Extraction

### 5.1 Approaches

**Approach A: Joint entity-and-relation extraction**

Modern models extract entities and relationships in a single pass. Key options:

-   **UniRel / OneRel (2024–2025):** Unified frameworks that model entity-relation triples as a single structured prediction task. Faster than pipeline approaches (entity first, then relation).
-   **REBEL (Relation Extraction By End-to-end Language generation):** A seq2seq model (based on BART) that generates triples directly from text. Fine-tuned versions handle conversational text well.

**Approach B: LLM-based structured extraction**

For highest quality, prompt an LLM to extract triples with a constrained output schema:

`System: Extract all entity-relationship triples from the following conversation message. Output as JSON array of triples: [{"subject": ..., "predicate": ..., "object": ..., "confidence": ...}]  Predicates must be from: [works_at, knows, discussed, requested, decided, mentioned, located_in, created, owns, part_of]  User: "Sarah from Acme Corp told me they're acquiring DataFlow for $2B next quarter."`

Output:

`[   {"subject": "Sarah", "predicate": "works_at", "object": "Acme Corp", "confidence": 0.95},   {"subject": "Acme Corp", "predicate": "acquiring", "object": "DataFlow", "confidence": 0.92},   {"subject": "Acme Corp acquiring DataFlow", "predicate": "valued_at", "object": "$2B", "confidence": 0.88} ]`

**Approach C: Dependency-parse heuristics (fastest, least accurate)**

Parse the sentence, extract subject-verb-object triples from the dependency tree. Useful as a fast fallback. Libraries: spaCy’s `DependencyMatcher`, or the `textacy` library’s `extract.subject_verb_object_triples()`.

**Recommended:** Use Approach A (UniRel/REBEL) for the fast path. Fall back to Approach B (LLM) for messages flagged as complex or containing multiple clauses.

### 5.2 Conversational Coreference Resolution

Conversations are full of pronouns: “he said”, “they decided”, “it broke”. Without coreference resolution, your knowledge graph fills with dangling “he” and “it” nodes.

**Solutions:**  
\- **LingMess / s2e-coref (AllenNLP):** Fast coreference resolution models. Run over a conversation window (last 5–10 messages) to resolve pronouns to their antecedents.  
\- **Incremental coreference:** Maintain a “mention memory” per conversation. As each message arrives, resolve pronouns against the most recent entity mentions. This is a simplified but fast approach.  
\- **LLM-based resolution:** Include recent conversation history in the LLM prompt for the slow path, letting the LLM resolve references naturally.

### 5.3 Temporal and Confidence Tracking

Every triple should carry metadata:

`{   "subject": "Acme Corp",   "predicate": "acquiring",   "object": "DataFlow",   "confidence": 0.92,   "extracted_at": "2026-03-19T14:22:01Z",   "source_conversation": "conv_abc123",   "source_message": "msg_789",   "valid_from": "2026-03-19T14:22:01Z",   "valid_to": null,   "extraction_model": "rebel-large-v2",   "speaker": "user_42" }`

This enables temporal queries (“What did we know as of last Tuesday?”) and provenance tracking (“Where did this fact come from?”).

* * *

## 6\. Stage 4 — Entity Resolution and Deduplication

Before writing to the graph, you must resolve whether “Sarah”, “Sarah Chen”, and “S. Chen” are the same entity.

### 6.1 Techniques

**Blocking + Similarity:**  
1\. **Blocking:** Use phonetic hashing (Double Metaphone), character n-grams, or embedding similarity to generate candidate pairs. This avoids O(n^2) comparison.  
2\. **Similarity:** Compare candidates using a weighted combination of:  
\- String similarity (Jaro-Winkler, normalized Levenshtein)  
\- Embedding cosine similarity (sentence-transformers)  
\- Type compatibility (a PERSON cannot merge with an ORG)  
\- Co-occurrence context (entities appearing in the same conversation window)

**Dedicated tools:**  
\- **Dedupe.io (open source):** Python library for active-learning entity resolution.  
\- **Senzing:** Commercial entity resolution engine with real-time API, strong in production deployments.  
\- **Custom embedding index:** Maintain a FAISS or Qdrant index of entity embeddings. On each new entity, query the index for nearest neighbors and merge if similarity exceeds threshold.

### 6.2 Real-Time Resolution Pipeline

`New entity arrives     │     ├── Generate embedding (sentence-transformers, ~2ms)     │     ├── Query FAISS/Qdrant for top-5 neighbors (~1ms)     │     ├── Score candidates (string + embedding + context, ~1ms)     │     ├── If best_score > 0.9: MERGE (update canonical ID)     │   If 0.7 < best_score < 0.9: FLAG for human review     │   If best_score < 0.7: CREATE new entity     │     └── Update embedding index with new/merged entity`

Total latency for entity resolution: 5–10ms.

* * *

## 7\. Stage 5 — Knowledge Graph Storage and Update Patterns

### 7.1 Graph Database Selection

| Database | Best For | Write Latency | Query Latency | Scaling |
| --- | --- | --- | --- | --- |
| **Neo4j 5.x** | Complex traversals, mature ecosystem | 1–5ms (single write) | Sub-ms for 2-hop | Sharding via Fabric |
| **Amazon Neptune** | AWS-native, managed | 5–15ms | Low-ms | Auto-scaling |
| **Memgraph** | Real-time analytics, streaming | <1ms (in-memory) | Sub-ms | Single-node (fast) |
| **FalkorDB** (formerly RedisGraph) | Redis ecosystem, simple graphs | <1ms | Sub-ms | Redis Cluster |
| **TigerGraph** | Massive-scale analytics | 2–10ms | ms-level for deep traversals | Distributed native |
| **NebulaGraph** | Large-scale, open-source | 1–5ms | Low-ms | Distributed native |
| **Kuzu** | Embedded graphs, analytics | Sub-ms (embedded) | Sub-ms | Single-node |

**Recommendation for sub-second real-time use case:**

-   **Primary: Memgraph** — Purpose-built for streaming graph analytics. Supports Cypher, has built-in Kafka integration (STREAMS), and handles both writes and traversals with sub-millisecond latency since it is entirely in-memory. It also supports triggers (analogous to database triggers) that fire on graph mutations, enabling reactive downstream processing.
    
-   **Alternative: Neo4j 5.x** — More mature ecosystem, better tooling, larger community. Write latency is slightly higher but well within the sub-second budget. Use write-through batching (accumulate 10–50ms of writes, execute in a single transaction) to improve throughput.
    
-   **For embedded/edge: Kuzu** — If the system runs as a single process (e.g., a personal AI agent), Kuzu provides an embedded graph database with excellent performance and no network overhead.
    

### 7.2 Graph Schema Design

`// Node types (:Person {id, canonical_name, aliases[], first_seen, last_seen, mention_count}) (:Organization {id, canonical_name, aliases[], first_seen, last_seen}) (:Concept {id, canonical_name, description, first_seen, last_seen}) (:Conversation {id, started_at, participants[], channel}) (:Message {id, text, timestamp, speaker}) (:Event {id, description, event_date, first_mentioned})  // Core relationship types (:Person)-[:WORKS_AT {since, confidence}]->(:Organization) (:Person)-[:KNOWS {context, confidence}]->(:Person) (:Entity)-[:MENTIONED_IN {offset, confidence}]->(:Message) (:Message)-[:PART_OF]->(:Conversation) (:Entity)-[:RELATED_TO {predicate, confidence}]->(:Entity)`

### 7.3 Graph Update Patterns

**Pattern 1: MERGE-based idempotent writes (recommended)**

`// Idempotent entity upsert MERGE (e:Person {id: $entity_id}) ON CREATE SET   e.canonical_name = $name,   e.first_seen = $timestamp,   e.last_seen = $timestamp,   e.mention_count = 1 ON MATCH SET   e.last_seen = $timestamp,   e.mention_count = e.mention_count + 1  // Idempotent relationship upsert MATCH (s {id: $subject_id}), (o {id: $object_id}) MERGE (s)-[r:RELATED_TO {predicate: $predicate}]->(o) ON CREATE SET   r.confidence = $confidence,   r.first_seen = $timestamp,   r.last_seen = $timestamp,   r.mention_count = 1 ON MATCH SET   r.confidence = CASE     WHEN $confidence > r.confidence THEN $confidence     ELSE r.confidence   END,   r.last_seen = $timestamp,   r.mention_count = r.mention_count + 1`

MERGE ensures at-least-once delivery semantics from Kafka do not create duplicate nodes or edges.

**Pattern 2: Micro-batched writes**

Accumulate graph commands over a 10–50ms window and execute them in a single transaction. This reduces transaction overhead and improves throughput by 5–10x while adding only 10–50ms to latency (still well within the sub-second budget).

`class GraphBatchWriter:     def __init__(self, driver, batch_interval_ms=20, max_batch_size=100):         self.driver = driver         self.batch_interval_ms = batch_interval_ms         self.max_batch_size = max_batch_size         self.buffer = []         self._schedule_flush()      async def add_command(self, cypher, params):         self.buffer.append((cypher, params))         if len(self.buffer) >= self.max_batch_size:             await self._flush()      async def _flush(self):         if not self.buffer:             return         commands = self.buffer[:]         self.buffer.clear()         async with self.driver.session() as session:             async with session.begin_transaction() as tx:                 for cypher, params in commands:                     await tx.run(cypher, params)                 await tx.commit()`

**Pattern 3: Event-sourced graph with temporal versioning**

Store every graph mutation as an event. The current graph state is a materialized view of the event log. This enables:  
\- Time-travel queries (“What did the graph look like last week?”)  
\- Reprocessing (replay events after model upgrade)  
\- Audit trail

`Kafka topic: graph.events   ├── {type: "NODE_CREATED", node_type: "Person", id: "...", props: {...}}   ├── {type: "NODE_UPDATED", id: "...", changes: {...}}   ├── {type: "EDGE_CREATED", from: "...", to: "...", rel_type: "...", props: {...}}   └── {type: "EDGE_DELETED", from: "...", to: "...", rel_type: "..."}`

A graph materializer consumes this topic and applies mutations to the graph database.

* * *

## 8\. End-to-End Event-Driven Architecture

### 8.1 Full Pipeline with Latency Budget

`Component              Target Latency   Cumulative ─────────────────────  ──────────────   ────────── Kafka produce              5ms             5ms Kafka consume             15ms            20ms NER (fast path)            5ms            25ms Relationship extract      10ms            35ms Entity resolution         10ms            45ms Kafka produce (results)    5ms            50ms Kafka consume (graph)     15ms            65ms Graph MERGE write         10ms            75ms ─────────────────────  ──────────────   ────────── Total (fast path)                     ~75ms (p50) Total (slow path/LLM)               ~350ms (p50)`

This is comfortably within the sub-second requirement.

### 8.2 Stream Processing Frameworks

| Framework | Language | Best For | Kafka Integration |
| --- | --- | --- | --- |
| **Faust** | Python | Python-native, async | Native |
| **Apache Flink** | Java/Python | Stateful stream processing, windowing | Excellent |
| **Kafka Streams** | Java/Kotlin | JVM-native, no separate cluster | Built-in |
| **Quix Streams** | Python | Lightweight Python streaming | Good |
| **Bytewax** | Python (Rust core) | Pythonic, high-perf | Good |
| **RisingWave** | SQL | Streaming SQL, materialized views | Excellent |

**Recommendation:**

-   For Python ML teams: **Bytewax** or **Faust**. Bytewax is newer (2024–2025) and has a Rust core for better performance, with a clean Python API for defining dataflows.
-   For Java/JVM teams: **Kafka Streams** for simplicity, **Flink** for complex windowing or stateful logic.
-   For SQL-oriented teams: **RisingWave** lets you define the entire extraction-to-graph pipeline as streaming SQL with materialized views.

### 8.3 Error Handling and Dead Letter Queues

Every stage should route failed messages to a dead letter topic:

`conversations.raw ──> ner-processor ──> entities.extracted                            │                            └──> conversations.raw.dlq                                 (messages that failed NER)`

DLQ messages include the original message, the error, and a retry count. A separate retry service reprocesses DLQ messages with exponential backoff.

### 8.4 Backpressure Management

-   **Kafka consumer:** Use `max.poll.records` and `max.poll.interval.ms` to control how many messages a consumer processes per poll.
-   **GPU inference:** Use a semaphore or token bucket to limit concurrent inference requests, preventing GPU OOM.
-   **Graph writes:** If the graph database is slow, buffer writes in an in-memory queue with a configurable high-water mark. When the mark is hit, pause the upstream Kafka consumer (Kafka natively supports this via `pause()`/`resume()`).

* * *

## 9\. Production Deployment

### 9.1 Containerization and Orchestration

`# docker-compose for development; Kubernetes for production services:   kafka:     image: confluentinc/cp-kafka:7.7     # KRaft mode, no ZooKeeper    ner-worker:     image: memory-indexer/ner-worker:latest     deploy:       replicas: 4       resources:         reservations:           devices:             - driver: nvidia               count: 1               capabilities: [gpu]     environment:       KAFKA_BROKERS: kafka:9092       NER_MODEL: gliner_large-v2.1       NER_BATCH_SIZE: 32       NER_CONFIDENCE_THRESHOLD: 0.5    entity-resolver:     image: memory-indexer/entity-resolver:latest     deploy:       replicas: 2     environment:       EMBEDDING_INDEX_URL: http://qdrant:6333    graph-writer:     image: memory-indexer/graph-writer:latest     deploy:       replicas: 2     environment:       NEO4J_URI: bolt://neo4j:7687       BATCH_INTERVAL_MS: 20       MAX_BATCH_SIZE: 100    memgraph:     image: memgraph/memgraph:2.16     ports:       - "7687:7687"`

### 9.2 Kubernetes Deployment Considerations

-   **GPU scheduling:** Use NVIDIA GPU Operator and node selectors to schedule NER workers on GPU nodes. Use `nvidia.com/gpu: 1` as a resource limit.
-   **Horizontal Pod Autoscaler (HPA):** Scale NER workers based on Kafka consumer lag (custom metric from Prometheus).
-   **Pod Disruption Budgets:** Ensure at least N-1 NER workers are always running during rolling updates.
-   **Topology spread:** Spread Kafka consumer pods across availability zones for fault tolerance.

### 9.3 Monitoring and Observability

**Key metrics to track:**

| Metric | Target | Alert Threshold |
| --- | --- | --- |
| End-to-end latency (p99) | <500ms | \>1000ms |
| Kafka consumer lag | <100 messages | \>1000 messages |
| NER throughput (msgs/sec) | \>1000/worker | <500/worker |
| Entity resolution accuracy | \>95% | <90% |
| Graph write latency (p99) | <50ms | \>200ms |
| DLQ message count | <0.1% of total | \>1% of total |
| GPU utilization | 60–80% | <30% (over-provisioned) or >95% (bottleneck) |

**Stack:** Prometheus + Grafana for metrics, OpenTelemetry for distributed tracing (trace a message from ingestion through to graph write), structured logging with correlation IDs.

### 9.4 Scaling Considerations

**Horizontal scaling levers:**  
\- More Kafka partitions = more parallel consumers (up to 1 consumer per partition)  
\- More NER worker replicas (each with its own GPU)  
\- Graph write sharding: partition writes by entity type or hash(entity\_id)

**Vertical scaling:**  
\- Larger GPU (A100 -> H100) for higher NER batch throughput  
\- More RAM for in-memory graph databases (Memgraph, FalkorDB)

**Expected throughput at various scales:**

| Scale | Messages/sec | NER Workers | Graph DB | Infra Cost (est.) |
| --- | --- | --- | --- | --- |
| Small (startup) | 100–1K | 1 GPU (T4) | Memgraph (8GB) | $500–1K/mo |
| Medium (product) | 1K–10K | 4 GPUs (A10G) | Neo4j cluster (3 nodes) | $3K–8K/mo |
| Large (platform) | 10K–100K | 16+ GPUs (A100) | TigerGraph / NebulaGraph | $20K–50K/mo |

* * *

## 10\. Advanced Patterns

### 10.1 Incremental Graph Embeddings

After updating the graph, recompute node embeddings incrementally (not from scratch). Use **GraphSAGE** or **node2vec** in an incremental mode: when a node or edge changes, only recompute embeddings for the affected node and its K-hop neighborhood. Libraries: **PyG (PyTorch Geometric)** and **DGL** both support mini-batch inference for this.

These embeddings power:  
\- Semantic search over the knowledge graph  
\- Anomaly detection (sudden embedding shift = unusual relationship)  
\- Link prediction (suggest likely but unobserved relationships)

### 10.2 Conflict Resolution and Truth Maintenance

When two extractions contradict each other:

1.  **Recency bias:** More recent statements override older ones (update `valid_to` on the old triple).
2.  **Confidence weighting:** Higher-confidence extractions win.
3.  **Source authority:** Statements from verified sources outrank those from unverified ones.
4.  **Human-in-the-loop:** Flag contradictions above a threshold for human review.

Implement this as a “truth maintenance” module that runs before graph writes.

### 10.3 Hybrid Retrieval: Graph + Vector

For downstream consumption (e.g., by an AI agent), combine:  
\- **Graph traversal** for structured queries: “Who does Sarah work with?”  
\- **Vector similarity** for semantic queries: “What do we know about cloud migration?”  
\- **Graph-enhanced RAG:** Use the knowledge graph to expand retrieval context — retrieve relevant entities, traverse their neighborhoods, and include that context in the prompt.

This is the **GraphRAG** pattern, popularized by Microsoft Research in 2024 and widely adopted by 2025–2026. Key implementations: LlamaIndex’s `KnowledgeGraphIndex`, LangChain’s `GraphCypherQAChain`, and Microsoft’s open-source `graphrag` library.

### 10.4 Privacy and Data Governance

-   **PII detection:** Run a PII detector (e.g., Presidio) before NER to mask or tag sensitive entities.
-   **Access control:** Use graph database RBAC (Neo4j supports property-level security) to restrict who can see which entities.
-   **Right to erasure:** Tag all nodes/edges with `source_conversation`. Deleting a conversation triggers cascading deletion of all derived entities and relationships (unless they were corroborated by other conversations).
-   **Data retention policies:** Use TTL on graph nodes/edges. Memgraph and Neo4j both support TTL-based expiration.

* * *

## 11\. Reference Implementation: Technology Stack Summary

| Layer | Recommended Choice | Alternatives |
| --- | --- | --- |
| Event Broker | Apache Kafka (KRaft) | Redis Streams, Redpanda |
| Schema Registry | Confluent Schema Registry | Buf, Apicurio |
| Stream Processing | Bytewax (Python) | Faust, Flink, Kafka Streams |
| NER Model | GLiNER (fast path) | SpanMarker, spaCy-trf |
| Relation Extraction | REBEL / UniRel | LLM-based (slow path) |
| Coreference | LingMess / s2e-coref | LLM-based (in slow path) |
| Entity Resolution | Custom (FAISS + Jaro-Winkler) | Senzing, Dedupe.io |
| Embedding Index | Qdrant | FAISS, Milvus, Pinecone |
| Graph Database | Memgraph (real-time) or Neo4j 5.x (general) | FalkorDB, NebulaGraph, Kuzu |
| Model Serving | Triton Inference Server | vLLM (for LLM path), ONNX Runtime |
| Orchestration | Kubernetes | Docker Compose (dev) |
| Monitoring | Prometheus + Grafana + OpenTelemetry | Datadog, New Relic |

* * *

## 12\. Key Takeaways

1.  **Decouple every stage with an event broker.** Kafka topics between NER, entity resolution, and graph writing allow each stage to scale, fail, and upgrade independently.
    
2.  **Use a two-tier extraction strategy.** Fast-path (GLiNER/spaCy, <10ms) for most messages; slow-path (LLM, ~300ms) for ambiguous ones. This keeps p50 latency low while maintaining accuracy.
    
3.  **Entity resolution is the hardest problem.** Invest heavily here — a graph full of duplicates is worse than no graph at all. Use embedding similarity + string similarity + co-occurrence context.
    
4.  **MERGE-based idempotent writes** are essential for correctness with at-least-once delivery. Never use CREATE when MERGE will do.
    
5.  **Micro-batch graph writes** (10–50ms windows) dramatically improve throughput with negligible latency impact.
    
6.  **Budget your latency explicitly.** The 75ms fast-path budget above shows that sub-second is achievable with careful engineering. Measure and alert on p99 end-to-end latency.
    
7.  **Memgraph deserves serious evaluation** for real-time graph use cases — its native streaming integration and in-memory performance are purpose-built for this architecture.
    
8.  **Plan for temporal versioning and provenance from day one.** Retrofitting time-travel queries and audit trails onto an existing graph is extremely painful.
