---
title: "Neo4j + pgvector Hybrid Architecture for AI Agent Memory"
description: "AI agents require memory systems that can handle two fundamentally different retrieval patterns: semantic similarity search (finding conceptually related information) and..."
date: "2025-12-30"
category: "AI Agent Memory Systems"
author: "QorSync AI Research Team"
readTime: "19 min read"
published: true
---

# Neo4j + pgvector Hybrid Architecture for AI Agent Memory

## A Comprehensive Production Guide (2024–2026)

* * *

## 1\. Introduction and Rationale

AI agents require memory systems that can handle two fundamentally different retrieval patterns: **semantic similarity search** (finding conceptually related information) and **structural relationship traversal** (navigating connections between entities). No single database excels at both. The hybrid architecture combining Neo4j (graph) with pgvector (vector search in PostgreSQL) has emerged as a production-proven pattern for agent memory systems between 2024 and 2026.

**Why hybrid rather than a single store?**

-   Vector databases retrieve by meaning but lose structural context. Asking “what does the user prefer?” works; asking “what preferences influenced which decisions?” does not.
-   Graph databases capture relationships but cannot perform approximate nearest-neighbor search over high-dimensional embeddings efficiently.
-   PostgreSQL with pgvector provides vector search co-located with relational data, ACID guarantees, and mature operational tooling — a significant advantage over standalone vector databases.

* * *

## 2\. When to Store Data in Graph vs. Vector Store

### 2.1 Decision Framework

| Signal | Store in Neo4j (Graph) | Store in pgvector (Vector) |
| --- | --- | --- |
| **Data has named relationships** | Entity-relationship triples (User OWNS Project, Agent COMPLETED Task) | No |
| **Query requires path traversal** | Multi-hop reasoning (“find all tasks blocked by this dependency”) | No |
| **Data is unstructured text** | No (store reference node only) | Embeddings of conversations, documents, agent reasoning traces |
| **Query is “find similar to X”** | No | Semantic search over past interactions, similar code snippets |
| **Data has temporal ordering** | Event chains, causal sequences | Time-windowed embedding retrieval |
| **Data is a fact or attribute** | Entity properties on graph nodes | Only if semantic retrieval is needed |
| **Access pattern is known/structured** | Cypher queries with fixed patterns | No |
| **Access pattern is open-ended/natural language** | No | Embedding-based retrieval |

### 2.2 Concrete Data Placement

**Neo4j stores:**  
\- Agent identity and capability graphs  
\- User profile entities and preference relationships  
\- Task dependency graphs and execution histories  
\- Knowledge graph triples extracted from conversations  
\- Session-to-session continuity links  
\- Tool call chains and their causal relationships

**pgvector stores:**  
\- Conversation turn embeddings (OpenAI, Cohere, or local model output)  
\- Document chunk embeddings for RAG  
\- Agent reasoning trace embeddings  
\- Summarized episode embeddings (compressed memory)  
\- Code snippet embeddings for retrieval

**Both (dual-written with references):**  
\- Episode summaries: text + embedding in pgvector, episode node with relationships in Neo4j  
\- Entity mentions: embedding in pgvector for fuzzy matching, canonical entity in Neo4j for resolution

### 2.3 The “Graph-Anchored Vector” Pattern (2025)

This pattern, popularized by LangGraph and LlamaIndex production deployments, stores a lightweight anchor node in Neo4j that references the pgvector row:

`Neo4j Node: (:Memory {id: "mem_abc123", type: "episode", timestamp: ..., pgvector_id: "vec_abc123"}) -[:INVOLVES]->(:Entity {name: "User Preference"}) -[:FOLLOWS]->(:Memory {id: "mem_abc122"})  pgvector Row: id: "vec_abc123", embedding: [0.12, -0.34, ...], content: "User said they prefer...", neo4j_id: "mem_abc123"`

This allows graph traversal to find structurally relevant memories, then fetch full content and embeddings from pgvector, or vice versa.

* * *

## 3\. Unified Query Interface Architecture

### 3.1 Query Router Design

The query router is the central component that decides whether to query Neo4j, pgvector, or both, and how to merge results.

`┌─────────────────────────────────────────────┐ │              Agent Query Layer               │ │                                              │ │  "What did the user say about deployment     │ │   that relates to the CI/CD pipeline?"       │ └──────────────────┬──────────────────────────┘                    │                    ▼ ┌─────────────────────────────────────────────┐ │             Query Classifier                 │ │                                              │ │  Analyzes query intent:                      │ │  - Semantic similarity → pgvector            │ │  - Relationship traversal → Neo4j            │ │  - Hybrid (both signals) → Fan-out + merge   │ └────┬─────────────────┬──────────────────┬───┘      │                 │                  │      ▼                 ▼                  ▼ ┌─────────┐    ┌──────────────┐    ┌───────────┐ │ pgvector │    │   Neo4j      │    │  Fan-out  │ │  Path    │    │   Path       │    │  + Merge  │ └─────────┘    └──────────────┘    └───────────┘`

### 3.2 Query Classification Strategies

**Strategy 1: Rule-Based Classification (lowest latency, simplest)**

`class QueryRouter:     GRAPH_SIGNALS = [         "related to", "connected to", "caused by", "depends on",         "who", "which team", "what project", "hierarchy",         "path between", "influenced", "blocked by"     ]     VECTOR_SIGNALS = [         "similar to", "like", "about", "regarding",         "find conversations", "search for", "what was said"     ]      def classify(self, query: str) -> QueryTarget:         graph_score = sum(1 for s in self.GRAPH_SIGNALS if s in query.lower())         vector_score = sum(1 for s in self.VECTOR_SIGNALS if s in query.lower())          if graph_score > 0 and vector_score > 0:             return QueryTarget.HYBRID         elif graph_score > vector_score:             return QueryTarget.GRAPH         elif vector_score > graph_score:             return QueryTarget.VECTOR         else:             return QueryTarget.HYBRID  # default to both when uncertain`

**Strategy 2: Embedding-Based Classification (moderate latency, higher accuracy)**

Maintain a small classifier trained on labeled queries. In production (per Zep AI’s 2025 architecture), this is often a fine-tuned small model (distilbert-sized) that classifies query intent in under 5ms.

**Strategy 3: LLM-Based Classification (highest latency, highest accuracy)**

Use a fast small LLM (Haiku-class) to classify the query. Only suitable when the overall latency budget is 500ms+. Not recommended for sub-100ms retrieval paths.

### 3.3 Unified Query Interface Implementation

`from dataclasses import dataclass from typing import List, Optional import asyncio  @dataclass class MemoryResult:     id: str     content: str     score: float           # normalized 0-1     source: str            # "graph", "vector", or "hybrid"     metadata: dict     relationships: Optional[List[dict]] = None  class UnifiedMemoryStore:     def __init__(self, neo4j_driver, pg_pool, embedder, router):         self.neo4j = neo4j_driver         self.pg = pg_pool         self.embedder = embedder         self.router = router      async def query(self, query: str, top_k: int = 10) -> List[MemoryResult]:         target = self.router.classify(query)          if target == QueryTarget.VECTOR:             return await self._vector_query(query, top_k)         elif target == QueryTarget.GRAPH:             return await self._graph_query(query, top_k)         else:             # Fan-out: execute both in parallel             vector_task = self._vector_query(query, top_k)             graph_task = self._graph_query(query, top_k)             vector_results, graph_results = await asyncio.gather(                 vector_task, graph_task             )             return self._merge_results(vector_results, graph_results, top_k)      async def _vector_query(self, query: str, top_k: int) -> List[MemoryResult]:         embedding = await self.embedder.embed(query)         rows = await self.pg.fetch("""             SELECT id, content, metadata, neo4j_id,                    1 - (embedding <=> $1::vector) AS score             FROM memories             WHERE 1 - (embedding <=> $1::vector) > 0.3             ORDER BY embedding <=> $1::vector             LIMIT $2         """, embedding, top_k)         return [MemoryResult(             id=r["id"], content=r["content"],             score=r["score"], source="vector",             metadata=r["metadata"]         ) for r in rows]      async def _graph_query(self, query: str, top_k: int) -> List[MemoryResult]:         # Extract entities from query for graph lookup         entities = await self._extract_entities(query)         results = []         async with self.neo4j.session() as session:             for entity in entities:                 records = await session.run("""                     MATCH (e:Entity {name: $name})-[r*1..3]-(m:Memory)                     RETURN m.id AS id, m.summary AS content,                            m.timestamp AS ts,                            collect(type(r[0])) AS rel_types,                            1.0 / (1 + duration.between(m.timestamp, datetime()).days) AS recency_score                     ORDER BY recency_score DESC                     LIMIT $limit                 """, name=entity, limit=top_k)                 for record in records:                     results.append(MemoryResult(                         id=record["id"], content=record["content"],                         score=record["recency_score"], source="graph",                         metadata={"relationships": record["rel_types"]}                     ))         return results[:top_k]      def _merge_results(self, vector: List, graph: List, top_k: int) -> List:         """Reciprocal Rank Fusion (RRF) merge"""         scores = {}         k = 60  # RRF constant          for rank, r in enumerate(vector):             scores[r.id] = scores.get(r.id, 0) + 1.0 / (k + rank + 1)         for rank, r in enumerate(graph):             scores[r.id] = scores.get(r.id, 0) + 1.0 / (k + rank + 1)          all_results = {r.id: r for r in vector + graph}         ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)          merged = []         for rid, score in ranked[:top_k]:             result = all_results[rid]             result.score = score             result.source = "hybrid"             merged.append(result)         return merged`

* * *

## 4\. Production Deployment Patterns for Sub-100ms Retrieval

### 4.1 Latency Budget Breakdown

For a 100ms total budget, the allocation for a hybrid query:

| Component | Budget | Technique |
| --- | --- | --- |
| Query classification | 2–5ms | Rule-based router, pre-compiled patterns |
| Embedding generation | 15–30ms | Local model (ONNX runtime) or cached embeddings |
| pgvector query | 10–25ms | HNSW index, connection pooling, prepared statements |
| Neo4j query | 15–35ms | Indexed properties, query plan caching, bolt protocol |
| Result merge | 2–5ms | Pre-allocated buffers, RRF with early termination |
| Network overhead | 5–10ms | Co-located services, Unix domain sockets where possible |

### 4.2 pgvector Optimization for Sub-100ms

**Index configuration (2025 best practices):**

`-- HNSW index: preferred for query latency CREATE INDEX ON memories USING hnsw (embedding vector_cosine_ops) WITH (m = 24, ef_construction = 200);  -- At query time, tune ef_search for latency vs recall SET hnsw.ef_search = 100;  -- default 40; 100 gives ~98% recall  -- For datasets > 5M rows, use IVFFlat with nprobe tuning CREATE INDEX ON memories USING ivfflat (embedding vector_cosine_ops) WITH (lists = 1000); SET ivfflat.probes = 10;`

**Connection pooling (critical for latency):**

`# PgBouncer config for memory workload pool_mode = transaction default_pool_size = 50 min_pool_size = 10 reserve_pool_size = 5 server_idle_timeout = 300`

**Partitioning strategy for large datasets:**

`-- Partition by agent_id for multi-agent systems CREATE TABLE memories (     id UUID PRIMARY KEY,     agent_id UUID NOT NULL,     embedding vector(1536),     content TEXT,     created_at TIMESTAMPTZ DEFAULT NOW() ) PARTITION BY HASH (agent_id);  CREATE TABLE memories_p0 PARTITION OF memories FOR VALUES WITH (modulus 4, remainder 0); CREATE TABLE memories_p1 PARTITION OF memories FOR VALUES WITH (modulus 4, remainder 1); CREATE TABLE memories_p2 PARTITION OF memories FOR VALUES WITH (modulus 4, remainder 2); CREATE TABLE memories_p3 PARTITION OF memories FOR VALUES WITH (modulus 4, remainder 3);`

### 4.3 Neo4j Optimization for Sub-100ms

**Index strategy:**

`-- Composite index for memory lookups CREATE INDEX memory_lookup FOR (m:Memory) ON (m.agent_id, m.type, m.timestamp);  -- Full-text index for entity resolution CREATE FULLTEXT INDEX entity_search FOR (e:Entity) ON EACH [e.name, e.aliases];  -- Uniqueness constraint (also creates index) CREATE CONSTRAINT memory_id FOR (m:Memory) REQUIRE m.id IS UNIQUE;`

**Query plan caching:**

Pre-compile frequently used Cypher patterns using parameterized queries. Neo4j caches execution plans for parameterized queries, avoiding re-planning overhead.

**Bolt protocol tuning:**

`# Neo4j driver configuration for low latency driver = GraphDatabase.driver(     uri,     auth=(user, password),     max_connection_pool_size=100,     connection_acquisition_timeout=5.0,  # seconds     max_transaction_retry_time=5.0,     connection_timeout=5.0,     # Keep connections warm     keep_alive=True, )`

### 4.4 Caching Layer Architecture

`┌──────────────────────────────────────────────────────┐ │                   Agent Process                       │ │                                                       │ │  ┌─────────────────────────────────────────────────┐ │ │  │  L1 Cache: In-Process LRU (< 1ms)              │ │ │  │  - Recent query results                          │ │ │  │  - Hot entity embeddings                         │ │ │  │  - Pre-computed subgraph snapshots               │ │ │  └────────────────────┬────────────────────────────┘ │ │                       │ miss                          │ │  ┌────────────────────▼────────────────────────────┐ │ │  │  L2 Cache: Redis/Valkey (1-3ms)                 │ │ │  │  - Shared across agent instances                 │ │ │  │  - Session-scoped memory snapshots               │ │ │  │  - Pre-computed graph neighborhoods              │ │ │  └────────────────────┬────────────────────────────┘ │ │                       │ miss                          │ │  ┌────────────────────▼────────────────────────────┐ │ │  │  L3: Database Query (10-35ms)                   │ │ │  │  - pgvector ANN search                           │ │ │  │  - Neo4j Cypher traversal                        │ │ │  └─────────────────────────────────────────────────┘ │ └──────────────────────────────────────────────────────┘`

**Redis caching pattern for graph neighborhoods:**

`async def get_entity_neighborhood(self, entity_id: str, depth: int = 2):     cache_key = f"neighborhood:{entity_id}:{depth}"      # L2 cache check     cached = await self.redis.get(cache_key)     if cached:         return json.loads(cached)      # Query Neo4j     async with self.neo4j.session() as session:         result = await session.run("""             MATCH path = (e:Entity {id: $id})-[*1..$depth]-(connected)             RETURN path         """, id=entity_id, depth=depth)         neighborhood = serialize_paths(result)      # Cache with TTL based on entity volatility     ttl = 300 if is_stable_entity(entity_id) else 60     await self.redis.setex(cache_key, ttl, json.dumps(neighborhood))     return neighborhood`

* * *

## 5\. Data Synchronization and Consistency Guarantees

### 5.1 The Dual-Write Problem

Writing to both Neo4j and pgvector creates a consistency challenge: if one write succeeds and the other fails, the stores diverge. Production systems use one of three patterns.

### 5.2 Pattern 1: PostgreSQL as Source of Truth + Async Graph Sync

This is the most common production pattern (used by Zep, Mem0, and custom implementations at scale).

`Write Path:   Agent → PostgreSQL (pgvector) → [commit] → CDC/WAL → Neo4j Sync Worker  Read Path:   Agent → Query Router → { pgvector (ACID consistent)                           { Neo4j (eventually consistent, lag < 1s typical)`

**Implementation using PostgreSQL LISTEN/NOTIFY:**

`# Write side: single transaction to PostgreSQL async def store_memory(self, memory: Memory):     async with self.pg.transaction() as tx:         # Store content + embedding         await tx.execute("""             INSERT INTO memories (id, agent_id, content, embedding, metadata)             VALUES ($1, $2, $3, $4, $5)         """, memory.id, memory.agent_id, memory.content,              memory.embedding, memory.metadata)          # Queue graph sync event         await tx.execute("""             INSERT INTO graph_sync_queue (memory_id, operation, payload)             VALUES ($1, 'CREATE', $2)         """, memory.id, json.dumps(memory.graph_data))          # Notify sync worker         await tx.execute("NOTIFY graph_sync, $1", memory.id)  # Sync worker: consumes events and writes to Neo4j class GraphSyncWorker:     async def process_event(self, event):         memory_id = event.payload         row = await self.pg.fetchrow(             "SELECT * FROM graph_sync_queue WHERE memory_id = $1",             memory_id         )         try:             await self._write_to_neo4j(row)             await self.pg.execute(                 "UPDATE graph_sync_queue SET synced_at = NOW() WHERE memory_id = $1",                 memory_id             )         except Exception:             await self.pg.execute(                 "UPDATE graph_sync_queue SET retry_count = retry_count + 1 WHERE memory_id = $1",                 memory_id             )`

**Consistency guarantee:** Strong consistency for vector queries (same transaction), eventual consistency for graph queries (typically sub-second lag). Acceptable for most agent memory workloads where graph queries are used for context enrichment rather than authoritative state.

### 5.3 Pattern 2: Transactional Outbox with Debezium (2025)

For stricter consistency requirements, use the transactional outbox pattern with a CDC tool like Debezium reading the PostgreSQL WAL:

`PostgreSQL WAL → Debezium → Kafka → Neo4j Sink Connector`

This guarantees at-least-once delivery to Neo4j. Combined with idempotent Neo4j writes (using MERGE instead of CREATE), this provides effective exactly-once semantics.

`-- Idempotent Neo4j write MERGE (m:Memory {id: $id}) ON CREATE SET m.content = $content, m.timestamp = $timestamp, m.agent_id = $agent_id ON MATCH SET m.content = $content WITH m UNWIND $relationships AS rel MERGE (target:Entity {name: rel.target}) MERGE (m)-[r:RELATES_TO]->(target) SET r.type = rel.type`

### 5.4 Pattern 3: Saga Pattern for Bidirectional Sync

When both stores can be the write origin (e.g., graph enrichment pipelines add relationships that should be reflected in pgvector metadata):

`class MemorySaga:     async def execute(self, memory: Memory):         saga_id = uuid4()          # Step 1: Write to pgvector         try:             pg_result = await self.pg_store.write(memory, saga_id)         except Exception:             return SagaResult.FAILED          # Step 2: Write to Neo4j         try:             neo4j_result = await self.neo4j_store.write(memory, saga_id)         except Exception:             # Compensate: roll back pgvector write             await self.pg_store.compensate(saga_id)             return SagaResult.COMPENSATED          # Step 3: Mark saga complete         await self.saga_log.complete(saga_id)         return SagaResult.COMPLETED`

### 5.5 Consistency Monitoring

`-- Monitor sync lag SELECT     COUNT(*) AS pending_syncs,     MAX(NOW() - created_at) AS max_lag,     AVG(NOW() - created_at) AS avg_lag FROM graph_sync_queue WHERE synced_at IS NULL;`

Set alerting thresholds: warn at 5s lag, page at 30s lag.

* * *

## 6\. Query Routing Strategies in Depth

### 6.1 Static Routing (Compile-Time)

Define explicit routes for known agent operations:

`ROUTE_TABLE = {     "recall_conversation": QueryTarget.VECTOR,     "find_similar_problems": QueryTarget.VECTOR,     "get_task_dependencies": QueryTarget.GRAPH,     "get_user_preferences": QueryTarget.GRAPH,     "contextualize_response": QueryTarget.HYBRID,     "find_related_decisions": QueryTarget.HYBRID, }`

Advantage: zero classification latency. Disadvantage: cannot handle novel query patterns.

### 6.2 Adaptive Routing (Runtime)

Track query performance and adjust routing:

`class AdaptiveRouter:     def __init__(self):         self.performance_log = defaultdict(list)      async def route(self, query: str, query_type: str) -> QueryTarget:         # Start with static route         target = ROUTE_TABLE.get(query_type, QueryTarget.HYBRID)          # Check if we have performance data suggesting a better route         if query_type in self.performance_log:             stats = self.performance_log[query_type]             recent = stats[-100:]  # last 100 queries              # If hybrid queries consistently get results from only one source,             # optimize by routing to that source directly             if target == QueryTarget.HYBRID:                 vector_useful = sum(1 for s in recent if s["vector_contributed"])                 graph_useful = sum(1 for s in recent if s["graph_contributed"])                  if vector_useful < 5 and graph_useful > 80:                     target = QueryTarget.GRAPH                 elif graph_useful < 5 and vector_useful > 80:                     target = QueryTarget.VECTOR          return target`

### 6.3 Speculative Execution with Early Termination

For latency-critical paths, launch both queries speculatively and cancel the slower one if the faster returns sufficient results:

`async def speculative_query(self, query: str, top_k: int, timeout_ms: int = 50):     vector_task = asyncio.create_task(self._vector_query(query, top_k))     graph_task = asyncio.create_task(self._graph_query(query, top_k))      done, pending = await asyncio.wait(         [vector_task, graph_task],         timeout=timeout_ms / 1000,         return_when=asyncio.FIRST_COMPLETED     )      results = []     for task in done:         results.extend(task.result())      if len(results) >= top_k:         for task in pending:             task.cancel()         return results[:top_k]      # Wait for remaining     if pending:         remaining_done, _ = await asyncio.wait(pending, timeout=0.05)         for task in remaining_done:             results.extend(task.result())      return self._merge_results(results, [], top_k)`

* * *

## 7\. Real-World Production Architectures and Case Studies (2024–2026)

### 7.1 Zep AI — Long-Term Memory for AI Assistants (2024–2025)

**Architecture:** Zep is the most prominent production implementation of this hybrid pattern. Their architecture uses PostgreSQL (with pgvector) as the primary store and builds a knowledge graph overlay.

**Key design decisions:**  
\- All raw data lands in PostgreSQL first (source of truth)  
\- A background “graph builder” process extracts entities and relationships from conversation turns using an LLM, writing them to their graph layer  
\- Retrieval combines vector search over conversation episodes with graph traversal over extracted entities  
\- They introduced “Graphiti” (open-sourced in 2024) as their temporal knowledge graph framework specifically for episodic and semantic memory

**Production numbers reported (2025):**  
\- Sub-50ms retrieval for vector-only queries  
\- Sub-100ms for hybrid graph+vector queries  
\- Supports millions of memory episodes per tenant

**Lessons learned:**  
\- Entity resolution (deciding when “John” in one conversation is the same “John” from another) is the hardest problem; they use embedding similarity plus graph neighborhood overlap  
\- Temporal ordering of facts matters enormously — a user’s preference today should override one from six months ago  
\- Graph construction is best done asynchronously; it should never be in the hot path

### 7.2 Mem0 — Memory Layer for LLM Applications (2024–2025)

**Architecture:** Mem0 (formerly EmbedChain) provides a memory layer that supports multiple backend configurations, including Neo4j + vector store combinations.

**Key design decisions:**  
\- Supports pluggable graph stores (Neo4j, FalkorDB) alongside vector stores (pgvector, Qdrant, Pinecone)  
\- Memory operations: `add()`, `search()`, `update()`, `delete()` with automatic routing  
\- Graph is used specifically for entity-relationship extraction; vector store handles semantic search  
\- Deduplication is handled by a combination of embedding similarity thresholds and graph-based entity resolution

**Production pattern:**

`User message → Mem0.add()   → Extract facts (LLM) → Vector store (embedding)   → Extract entities/relations (LLM) → Graph store   → Dedup check against existing memories  Agent query → Mem0.search()   → Vector similarity search   → Graph neighborhood expansion   → Reciprocal rank fusion merge   → Return top-k memories`

### 7.3 LangGraph + LangMem — Stateful Agent Memory (2025)

**Architecture:** LangChain’s LangGraph framework introduced LangMem in early 2025 for long-term agent memory, with explicit support for hybrid retrieval.

**Key patterns:**  
\- “Memory schemas” that define what goes to which store  
\- Built-in support for “semantic memory” (vector), “episodic memory” (vector with temporal metadata), and “procedural memory” (graph of tool-use patterns)  
\- Background memory consolidation that periodically summarizes and compresses old memories

### 7.4 Microsoft GraphRAG (2024–2025)

**Architecture:** Microsoft Research’s GraphRAG system demonstrated that graph-structured retrieval significantly outperforms vector-only retrieval for questions requiring synthesis across multiple documents.

**Key finding:** For “global” questions (requiring understanding across an entire corpus), graph-based community detection + summarization outperformed naive vector search by 30-70% on comprehensiveness metrics.

**Hybrid application to agent memory:** Several production implementations (documented on GitHub and in blog posts through 2025) adapted GraphRAG’s approach:  
\- Build a community graph from agent interactions  
\- Use vector search for local/specific recall  
\- Use graph community summaries for broad/synthetic recall

### 7.5 Custom Production Architecture at Scale (Composite of Documented Patterns, 2025–2026)

Based on architectures documented across engineering blogs and conference talks:

`┌─────────────────────────────────────────────────────────────┐ │                     Agent Runtime Layer                       │ │  ┌──────────────────────────────────────────────────────┐   │ │  │  Memory SDK (Python/TypeScript)                       │   │ │  │  - Unified API: store(), recall(), forget()           │   │ │  │  - Query router with adaptive routing                 │   │ │  │  - Client-side LRU cache (L1)                         │   │ │  └──────────────────────┬───────────────────────────────┘   │ │                         │                                     │ │  ┌──────────────────────▼───────────────────────────────┐   │ │  │  Memory Service (gRPC/REST)                           │   │ │  │  - Connection pooling to both stores                  │   │ │  │  - Redis cache layer (L2)                             │   │ │  │  - Rate limiting and tenant isolation                 │   │ │  │  - Observability (OpenTelemetry traces per query)     │   │ │  └─────┬──────────────────────────────────┬─────────────┘   │ │         │                                  │                  │ │  ┌──────▼──────────┐              ┌───────▼────────────┐    │ │  │  PostgreSQL +    │              │  Neo4j Cluster     │    │ │  │  pgvector        │              │                    │    │ │  │                  │   CDC/WAL    │  - 3-node causal   │    │ │  │  - HNSW indexes  │ ──────────► │    cluster          │    │ │  │  - Partitioned   │   (Debezium │  - Read replicas    │    │ │  │    by agent_id   │    + Kafka)  │    for query load   │    │ │  │  - WAL archiving │              │  - APOC for graph   │    │ │  └──────────────────┘              │    algorithms       │    │ │                                    └────────────────────┘    │ │                                                               │ │  ┌──────────────────────────────────────────────────────┐   │ │  │  Background Workers                                    │   │ │  │  - Entity extraction (LLM-powered)                    │   │ │  │  - Memory consolidation (compress old episodes)       │   │ │  │  - Graph enrichment (relationship inference)          │   │ │  │  - Embedding refresh (when model versions change)     │   │ │  └──────────────────────────────────────────────────────┘   │ └─────────────────────────────────────────────────────────────┘`

* * *

## 8\. Operational Concerns

### 8.1 Embedding Model Versioning

When the embedding model changes (e.g., migrating from `text-embedding-ada-002` to `text-embedding-3-large`), all vectors must be recomputed. Production strategy:

`-- Store model version with each embedding ALTER TABLE memories ADD COLUMN embedding_model VARCHAR(64) DEFAULT 'text-embedding-3-large';  -- During migration, maintain both columns temporarily ALTER TABLE memories ADD COLUMN embedding_v2 vector(3072);  -- Background job recomputes embeddings -- Queries route to appropriate column based on model version`

### 8.2 Memory Compaction and TTL

Agent memory grows unboundedly without lifecycle management:

`class MemoryCompactor:     async def compact(self, agent_id: str):         # 1. Find old, low-importance memories         old_memories = await self.pg.fetch("""             SELECT id, content, embedding, metadata             FROM memories             WHERE agent_id = $1               AND created_at < NOW() - INTERVAL '30 days'               AND access_count < 3             ORDER BY created_at ASC             LIMIT 100         """, agent_id)          if not old_memories:             return          # 2. Summarize cluster into single consolidated memory         texts = [m["content"] for m in old_memories]         summary = await self.llm.summarize(texts)         summary_embedding = await self.embedder.embed(summary)          # 3. Replace originals with summary         async with self.pg.transaction() as tx:             await tx.execute("""                 INSERT INTO memories (id, agent_id, content, embedding, metadata)                 VALUES ($1, $2, $3, $4, '{"type": "consolidated"}')             """, uuid4(), agent_id, summary, summary_embedding)              old_ids = [m["id"] for m in old_memories]             await tx.execute(                 "DELETE FROM memories WHERE id = ANY($1)", old_ids             )          # 4. Update graph: merge old memory nodes into consolidated node         await self._consolidate_graph_nodes(old_ids, consolidated_id)`

### 8.3 Monitoring and Observability

Key metrics to track:

| Metric | Target | Alert Threshold |
| --- | --- | --- |
| p50 query latency | <30ms | \>50ms |
| p99 query latency | <100ms | \>200ms |
| Graph sync lag | <1s | \>5s |
| pgvector index recall | \>95% | <90% |
| Cache hit rate (L1+L2) | \>70% | <50% |
| Memory store size per agent | <100K rows | \>500K rows |
| Neo4j relationship density | monitor | sudden spikes |

### 8.4 Multi-Tenancy and Isolation

For SaaS deployments serving multiple agents/customers:

-   **pgvector**: Partition by tenant/agent ID; use Row-Level Security (RLS) policies
-   **Neo4j**: Use separate databases (Neo4j 4.x+) or label-based isolation with RBAC
-   **Cache**: Prefix all Redis keys with tenant ID; use separate Redis databases or clusters for hard isolation

* * *

## 9\. Decision Checklist for Architects

When evaluating whether to adopt this hybrid architecture:

**Adopt the hybrid pattern when:**  
\- Your agent needs both “find similar” and “find connected” retrieval  
\- You have entity relationships that matter for agent reasoning  
\- You need temporal awareness (what happened before/after, causation)  
\- You are already running PostgreSQL (pgvector is an extension, not a new system)  
\- Your team has operational experience with at least one of the two systems

**Stay with vector-only when:**  
\- Your agent memory is purely conversational recall (RAG over past conversations)  
\- You have no meaningful entity relationships to track  
\- Your latency budget cannot accommodate the fan-out pattern  
\- Your team cannot take on Neo4j operational complexity

**Stay with graph-only when:**  
\- Your data is inherently structured (knowledge base, ontology)  
\- Semantic similarity search is not a primary access pattern  
\- Your queries are always expressible as Cypher patterns

* * *

## 10\. Summary of Key Takeaways

1.  **Store structured relationships in Neo4j, unstructured semantics in pgvector.** Use cross-references (the “graph-anchored vector” pattern) to bridge them.
    
2.  **PostgreSQL should be the source of truth.** It provides ACID guarantees. Sync to Neo4j asynchronously via CDC or outbox pattern. Accept eventual consistency for graph queries.
    
3.  **Sub-100ms retrieval is achievable** with HNSW indexes on pgvector, indexed Cypher on Neo4j, two-tier caching (in-process LRU + Redis), and parallel fan-out queries.
    
4.  **Use Reciprocal Rank Fusion (RRF)** to merge results from both stores. It is simple, effective, and parameter-light compared to learned reranking.
    
5.  **Query routing is more important than query execution.** A rule-based router that avoids unnecessary fan-out saves more latency than any single database optimization.
    
6.  **Memory lifecycle management is not optional.** Without compaction and TTL policies, agent memory stores grow unboundedly, degrading both cost and performance.
    
7.  **The production ecosystem has matured significantly.** Zep/Graphiti, Mem0, LangMem, and Microsoft GraphRAG provide tested foundations rather than requiring fully custom implementations.
