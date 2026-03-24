---
title: "Episodic Memory Architectures for AI Agents (2025-2026)"
description: "The AI agent memory landscape has matured rapidly between 2025 and 2026, moving from experimental research to production infrastructure. Five dominant approaches have emerged:..."
date: "2025-12-14"
category: "AI Agent Memory Systems"
author: "QorSync AI Research Team"
readTime: "16 min read"
published: true
---

# Episodic Memory Architectures for AI Agents (2025-2026)

## A Comparative Research Report

* * *

## 1\. Executive Summary

The AI agent memory landscape has matured rapidly between 2025 and 2026, moving from experimental research to production infrastructure. Five dominant approaches have emerged: **Mem0** (cloud-first vector+graph hybrid), **Zep/Graphiti** (temporal knowledge graph), **LangMem** (LangChain-native toolkit), **Letta/MemGPT** (OS-inspired self-managing memory), and **custom pgvector+Neo4j** stacks. Each embodies a fundamentally different philosophy about where intelligence in the memory system should reside – in the storage layer, the retrieval layer, or the agent itself.

The short answer on scalability: **Mem0** scales best for most production workloads due to its managed infrastructure, cloud-native architecture, and simplicity of integration. **Zep/Graphiti** scales best for complex relational and temporal reasoning workloads. **Custom pgvector+Neo4j** provides the most control at scale but requires significant engineering investment. The right choice depends on whether your bottleneck is operational complexity, retrieval quality, or architectural flexibility.

* * *

## 2\. Architecture Deep Dives

### 2.1 Mem0

**Philosophy**: Memory as a managed service – extract, consolidate, retrieve with minimal developer overhead.

**Architecture**:  
Mem0 implements a dual-store model combining vector-based semantic search with an optional knowledge graph layer. The pipeline operates in three stages:

1.  **Extraction**: An LLM-driven pipeline dynamically extracts salient facts from conversations, organizing them at user, session, and agent levels in a hierarchical memory model.
2.  **Consolidation**: New memories are reconciled against existing ones. Contradictory information is resolved, duplicates merged, and outdated facts invalidated.
3.  **Retrieval**: Vector similarity search locates relevant memories, with optional graph traversal for entity-relationship queries.

The graph-enhanced variant (Mem0g) adds entity extraction and relationship mapping on top of the base vector store, capturing relational structures without requiring a full temporal knowledge graph.

**Storage backends** (open-source): Qdrant, Chroma, Milvus, pgvector, Redis, Azure AI Search. Graph layer uses Neo4j.

**Key metrics** (from the LOCOMO benchmark, per the Mem0 paper at arXiv:2504.19413):  
\- 26% relative improvement over OpenAI’s memory in LLM-as-Judge scoring  
\- 91% lower p95 latency vs. full-context processing  
\- 90%+ token cost savings vs. processing full conversation history  
\- Graph variant adds approximately 2% additional accuracy over base

**API design**: Three-line integration for basic usage. REST API with hierarchical memory scoping (org > project > user > session > agent). Supports batch operations, versioned APIs with AND/OR filtering logic, and MMR-based reranking.

* * *

### 2.2 Zep / Graphiti

**Philosophy**: Memory as a temporal knowledge graph – facts have lifetimes, and relationships evolve over time.

**Architecture**:  
Zep’s core engine, Graphiti, implements a temporally-aware dynamic knowledge graph G=(N, E, phi) organized into three hierarchical subgraph tiers:

1.  **Episode Subgraph (Ge)**: Non-lossy storage of raw events – messages, JSON documents, transaction snapshots – each annotated with original timestamps. This is the “ground truth” layer.
2.  **Semantic Entity Subgraph (Gs)**: Entities and relationships extracted from episodes via LLM-driven semantic extraction. Each entity is embedded in 1024-dimensional space. Edges carry explicit temporal validity intervals.
3.  **Community Subgraph (Gc)**: Clusters of strongly connected entities detected via label propagation, with iterative map-reduce summarization for high-level context.

The **bi-temporal model** is Zep’s defining innovation. Every edge tracks four timestamps:  
\- `t_valid` and `t_invalid` on timeline T (when facts were actually true)  
\- `t'_created` and `t'_expired` on timeline T’ (when the system ingested/retired the data)

This enables point-in-time queries (“What did the system know at time X about fact Y?”) and historical reasoning.

**Ingestion pipeline**: Extract entities from current + prior 4 messages, generate 1024D embeddings, perform cosine similarity + full-text deduplication against existing nodes, apply a reflexion-inspired hallucination reduction step, and resolve duplicates via LLM comparison.

**Retrieval algorithm** f(alpha) = chi(rho(phi(alpha))) implements:  
\- **Search (phi)**: Three parallel methods – cosine similarity, BM25 full-text, and breadth-first graph traversal  
\- **Reranking (rho)**: Reciprocal Rank Fusion, Maximal Marginal Relevance, episode-mention frequency, node centrality, and cross-encoder LLM scoring  
\- **Construction (chi)**: Formats nodes/edges into text context with temporal validity ranges

**Key metrics** (from the published paper at arXiv:2501.13956):  
\- Deep Memory Retrieval: 94.8% accuracy (vs. MemGPT 93.4%, full-conversation 94.4%)  
\- LongMemEval: +18.5% accuracy improvement with gpt-4o, latency reduced from 28.9s to 2.58s (91% reduction)  
\- Context tokens: 1.6K vs. 115K for full-conversation approach  
\- Excels at temporal reasoning (+48.2%), multi-session (+16.7%), preferences (+77.7%)  
\- Weaker on single-session-assistant queries (-9% to -18%)

* * *

### 2.3 LangMem

**Philosophy**: Memory as a developer toolkit – composable primitives that fit into any agent framework, with LangGraph as the first-class citizen.

**Architecture**:  
LangMem follows a two-layer design separating stateless operations from stateful integrations:

1.  **Core API Layer** (stateless): Functions like `create_memory_manager` and `create_prompt_optimizer` that work with any storage backend. Uses `trustcall` for type-safe memory consolidation.
2.  **Stateful Integration Layer**: Builds on Core API with LangGraph’s `BaseStore` for persistence, providing Store Managers and Memory Tools.

**Memory types**:  
\- **Semantic memory**: Facts and knowledge stored as either Collections (unbounded, searchable documents) or Profiles (structured, schema-enforced documents for quick lookup)  
\- **Episodic memory**: Successful interactions preserved as learning examples capturing situation context, reasoning process, and outcome  
\- **Procedural memory**: Behavioral rules encoded in system prompts that evolve via feedback from a prompt optimizer

**Formation mechanisms**:  
\- **Active (“conscious”)**: In-conversation extraction with immediate context updates (adds latency)  
\- **Background (“subconscious”)**: Post-interaction processing that extracts patterns without impacting real-time responsiveness

**Storage**: Built on LangGraph’s BaseStore with multi-level namespaces (organization > user > application), contextual keys, and template variables for dynamic runtime configuration. Supports direct key-based access, semantic similarity search, and metadata filtering.

**API design**: Functional primitives (`create_memory_manager`, `create_prompt_optimizer`) that compose cleanly. Memory management tools can be given directly to agents for “hot path” usage, or run as background processes.

* * *

### 2.4 Letta (formerly MemGPT)

**Philosophy**: Memory as an operating system – the LLM itself manages its own context, moving data between tiers like an OS manages RAM and disk.

**Architecture**:  
Letta implements the MemGPT paradigm where the agent autonomously manages a three-tier memory hierarchy via function calls:

1.  **Core Memory** (in-context, analogous to RAM): Structured, editable blocks pinned to the context window. Each block has a label, description, value (actual tokens), and character limits. Always visible to the agent. Size-limited but directly readable/writable.
2.  **Recall Memory** (persistent history, analogous to swap): Complete interaction history stored to disk automatically. Searchable and retrievable but not in the active context window. Raw conversation logs.
3.  **Archival Memory** (external knowledge, analogous to disk): Processed, indexed information in external databases (vector or graph). Unlike recall memory, contains semantically organized knowledge. Queried via specialized search tools.

**Self-editing mechanism**: Agents rewrite their own core memory blocks using tools, consolidating important information as conversations progress. “Sleep-time agents” can also modify blocks asynchronously, enabling proactive memory reorganization during idle periods.

**Context management**: When the context window fills, the system employs intelligent eviction (removing approximately 70% of older messages to ensure continuity) and recursive summarization (progressively compressing older messages so recent conversations maintain greater influence).

**Agent loop evolution (V1, 2025-2026)**: Letta transitioned from the original MemGPT architecture (heartbeat-driven, tool-mediated responses) to the Letta V1 architecture. V1 deprecates heartbeats and the `send_message` tool, supporting only native reasoning and direct assistant message generations. This was designed for frontier models like GPT-5 and Claude 4.5 Sonnet.

**Key benchmark finding**: On LoCoMo, Letta agents achieved 74.0% accuracy using simple file storage, exceeding Mem0’s self-reported 68.5% for its graph variant. Their research concluded that “simpler tools are more likely to be in the training data of an agent and therefore more likely to be used effectively.”

**Production deployment**: REST API-based agent microservices with database backends, persistence, and state management. Available as Letta Cloud (managed) or self-hosted.

* * *

### 2.5 Custom pgvector + Neo4j

**Philosophy**: Full architectural control – choose exactly the right storage primitives for your use case without framework lock-in.

**Architecture**:  
The canonical pattern pairs PostgreSQL/pgvector for vector-based semantic search with Neo4j for graph-based relational reasoning:

**pgvector layer** (semantic/episodic store):

`CREATE TABLE memory (   id SERIAL PRIMARY KEY,   content TEXT NOT NULL,   embedding vector(1536),   metadata JSONB,   created_at TIMESTAMP DEFAULT NOW() );`

-   HNSW indexing for sub-100M vector datasets (95%+ recall, higher memory)
-   IVFFlat for 100M+ vectors (more memory-efficient, tunable accuracy)
-   ACID guarantees, mature operational tooling, single-database simplicity
-   Handles semantic similarity, temporal decay patterns, metadata filtering

**Neo4j layer** (relational/entity store):  
\- POLE+O entity model (Person, Object, Location, Event, Organization)  
\- Temporal validity windows on facts and relationships  
\- Bi-directional indexing, Cypher queries for complex traversal  
\- Community detection and entity clustering

**Neo4j Labs agent-memory library** (released 2025-2026) provides:  
\- Short-term memory: session-based conversation history with semantic search  
\- Long-term memory: POLE+O entities with temporal validity, vector embeddings  
\- Reasoning memory: traces of agent decisions linked to triggering messages  
\- Integration with LangChain, Pydantic AI, LlamaIndex, OpenAI Agents, CrewAI

**Constitutional Graph Pattern** (advanced): A 6-layer ontology (Foundation > Vision > Strategy > Tactics > Execution > Track) with immutability constraints, referential integrity, deduplication, and authority verification gates. Reported zero hallucination errors and zero duplicate writes over 2 months in a 91-node production graph.

**Scalability profile**:  
\- pgvector handles up to approximately 1M vectors well; beyond 10M, dedicated vector databases (Milvus, Qdrant) achieve 10-100x faster queries  
\- Neo4j scales to billions of nodes with proper sharding and Aura enterprise  
\- The combination covers “95% of AI apps” per practitioner reports, with the escape hatch to specialized databases for extreme scale

* * *

## 3\. Scalability Comparison for Million-Entry Knowledge Bases

| Dimension | Mem0 | Zep/Graphiti | LangMem | Letta/MemGPT | pgvector+Neo4j |
| --- | --- | --- | --- | --- | --- |
| **Vector scale** | Managed (Qdrant/cloud) | Neo4j native + embeddings | Depends on chosen store | Depends on backend | pgvector to ~10M; swap to Milvus/Qdrant beyond |
| **Graph scale** | Optional Neo4j | Neo4j core (temporal KG) | N/A (no native graph) | Optional archival backend | Neo4j Aura to billions |
| **Ingestion throughput** | Cloud-optimized; 186M API calls/quarter | Incremental graph updates; community extension reduces cost | Stateless extraction; scales horizontally | Agent-driven; bound by LLM call rate | Postgres bulk inserts; Neo4j batch import |
| **Query latency (p95)** | Low (managed infra) | 0.68-1.31s IQR (vs. 6-9s baseline) | Depends on store | Depends on backend | pgvector <100ms; Neo4j Cypher varies |
| **Token efficiency** | 90%+ savings vs. full context | 1.6K tokens vs. 115K full context | Configurable extraction | Core memory sized; archival on-demand | Manual context assembly |
| **Horizontal scaling** | Cloud-native, auto-scales | Managed cloud or self-hosted Neo4j cluster | Via LangGraph deployment | REST microservices | Postgres replicas + Neo4j Aura cluster |

**Bottom line on million-entry scale**: Mem0’s managed infrastructure handles this transparently – you do not manage the scaling yourself. Zep/Graphiti can handle it but requires careful Neo4j tuning. pgvector+Neo4j gives you the most control but requires the most operational expertise. LangMem and Letta delegate scaling to whatever storage backend you choose.

* * *

## 4\. Production Readiness Assessment

| Factor | Mem0 | Zep/Graphiti | LangMem | Letta/MemGPT | pgvector+Neo4j |
| --- | --- | --- | --- | --- | --- |
| **Maturity** | Most mature; SOC 2 compliant | Production-tested; enterprise customers | SDK stage; waitlisted managed service | Transitioning V1 architecture | Battle-tested components individually |
| **Managed offering** | Mem0 Cloud (SaaS, VPC, air-gapped) | Zep Cloud | LangGraph Cloud (memory integrated) | Letta Cloud (developing) | N/A (self-managed) |
| **Self-hosted** | Open-source core | Graphiti open-source (Apache 2.0) | Fully open-source | Fully open-source (Apache 2.0) | Fully self-hosted |
| **Enterprise features** | RBAC, audit trails, compliance | JWT auth, data purges | Namespace-based isolation | User ID tracking | Whatever you build |
| **Deployment options** | SaaS, private VPC, K8s, air-gapped | Cloud or self-hosted | LangGraph Cloud or self-hosted | Cloud or self-hosted | Full self-hosted control |
| **Framework integrations** | CrewAI, Flowise, Langflow, AWS Agent SDK | LangChain, Flowise, custom | LangGraph native; any storage backend | REST API (framework-agnostic) | LangChain, Pydantic AI, LlamaIndex, CrewAI, OpenAI Agents |

* * *

## 5\. API Design Comparison

**Mem0** – Simplest integration path:

`from mem0 import Memory m = Memory() m.add("User prefers dark mode", user_id="alice") results = m.search("UI preferences", user_id="alice")`

Three-line minimum integration. Hierarchical scoping (org/project/user/session/agent). REST API with batch operations.

**Zep** – Graph-oriented query interface:

`from zep_cloud.client import Zep client = Zep(api_key="...") client.memory.add(session_id="s1", messages=[...]) results = client.memory.search(session_id="s1", text="query", search_type="mmr")`

Search returns temporal context with validity ranges. Configurable retrieval parameters. Cypher queries available for advanced use.

**LangMem** – Functional primitives:

`from langmem import create_memory_manager manager = create_memory_manager(model, schemas=[...]) memories = manager.invoke({"messages": conversation})`

Composable functions that work with any storage. Agent-facing tools for hot-path memory operations. Background managers for async extraction.

**Letta** – Agent-as-memory-manager:

`from letta import create_client client = create_client() agent = client.create_agent(memory=ChatMemory(persona="...", human="...")) response = agent.send_message("Hello") # Agent self-manages its own memory via tool calls`

Memory management is implicit – the agent decides what to remember/forget. REST API for production deployment.

**pgvector+Neo4j** – Direct database operations:

`# pgvector cursor.execute("SELECT content FROM memory ORDER BY embedding <=> %s LIMIT 5", [query_vec]) # Neo4j session.run("MATCH (e:Entity)-[r]->(t:Entity) WHERE e.name = $name RETURN r, t", name="alice")`

Maximum flexibility, minimum abstraction. You own every query pattern.

* * *

## 6\. Self-Hosted vs. Cloud

| System | Self-Hosted Viability | Cloud Offering | Recommendation |
| --- | --- | --- | --- |
| **Mem0** | Good (open-source core, but graph memory may require paid tier) | Best-in-class managed service | Cloud for production; self-hosted for experimentation |
| **Zep** | Strong (Graphiti is fully open-source Apache 2.0) | Zep Cloud for managed deployment | Self-hosted viable; cloud for enterprise scale |
| **LangMem** | Full (SDK is completely open-source) | Via LangGraph Cloud (waitlisted) | Self-hosted with LangGraph, or standalone |
| **Letta** | Full (open-source Apache 2.0) | Letta Cloud (still developing) | Self-hosted currently more mature than cloud |
| **pgvector+Neo4j** | Native (these are self-hosted databases) | Supabase/Neon for pgvector, Neo4j Aura for graph | Self-hosted for control; managed DB services for convenience |

* * *

## 7\. Community Adoption and Ecosystem

| Metric | Mem0 | Zep/Graphiti | LangMem | Letta/MemGPT | pgvector | Neo4j |
| --- | --- | --- | --- | --- | --- | --- |
| **GitHub stars** | ~48K | ~20K (Graphiti) | ~1.3K | ~11K+ (Letta repo) | ~14K | ~14K |
| **Funding** | $24M Series A (YC, Basis Set, Peak XV) | $500K seed (YC) | Part of LangChain ($25M+ Series A) | $10M seed (Felicis, $70M valuation) | Open-source (Postgres ecosystem) | Public company (NYSE: NEO) |
| **Production adoption** | Fortune 500 companies; AWS exclusive memory provider; 186M API calls/quarter (Q3 2025) | Enterprise customers; 25K weekly PyPI downloads; 30x usage spike in summer 2025 | Within LangGraph ecosystem (~600-800 companies by end 2025) | Growing; Letta Code, Letta Evals released | Ubiquitous in Postgres shops | Dominant graph database |
| **Framework integration** | CrewAI, Flowise, Langflow, AWS Agent SDK | LangChain, Flowise | LangGraph native | Framework-agnostic REST API | Every major ORM/framework | LangChain, LlamaIndex, all major frameworks |
| **Academic papers** | arXiv:2504.19413 (April 2025) | arXiv:2501.13956 (January 2025) | Part of LangChain docs | Original MemGPT paper (NeurIPS 2023) | N/A (infrastructure) | N/A (infrastructure) |

* * *

## 8\. Benchmark Summary Table

| Benchmark | Mem0 | Zep | Letta | Notes |
| --- | --- | --- | --- | --- |
| **LoCoMo (LLM-as-Judge)** | 26% improvement over OpenAI | N/A | 74.0% (filesystem) | Mem0 benchmark; Letta challenged methodology |
| **Deep Memory Retrieval** | N/A | 94.8% | 93.4% (as MemGPT baseline) | Zep benchmark |
| **LongMemEval** | N/A | +18.5% accuracy, 91% latency reduction | N/A | Zep benchmark |
| **LoCoMo (independent)** | ~58-66% | ~85% | ~83.2% | Third-party benchmarks (DEV Community, 2026) |

A critical caveat: Letta’s own research found that “current memory benchmarks may not be very meaningful” as standalone evaluations. Agent memory effectiveness depends more on the agent’s ability to use retrieval tools than on the retrieval mechanism itself.

* * *

## 9\. Architectural Decision Framework

**Choose Mem0 when**: You want the fastest path to production, prefer managed infrastructure, need multi-tenant memory isolation, or are building on frameworks that integrate natively (CrewAI, AWS Agent SDK). Best for teams that want memory as a service rather than memory as an engineering project.

**Choose Zep/Graphiti when**: Your use case requires temporal reasoning (“What changed between Tuesday and Friday?”), complex entity relationships, or bi-temporal audit trails. Best for enterprise workflows with structured business data that must be synthesized with conversational history.

**Choose LangMem when**: You are already invested in the LangChain/LangGraph ecosystem, want composable memory primitives, or need procedural memory (prompt optimization from experience). Best for teams that want fine-grained control over memory formation while staying within a familiar framework.

**Choose Letta/MemGPT when**: You want the agent itself to manage memory, need the LLM-as-OS paradigm, or are building agents that must reason about their own knowledge gaps. Best for research-oriented teams and novel agent architectures.

**Choose custom pgvector+Neo4j when**: You need full architectural control, have specific compliance requirements that preclude third-party services, need to integrate with existing Postgres/Neo4j infrastructure, or require custom retrieval algorithms. Best for teams with strong database engineering capabilities.

* * *

## 10\. Which Approach Scales Best?

For **operational scalability** (handling millions of memories with minimal engineering effort): **Mem0** wins. Its managed cloud infrastructure, SOC 2 compliance, and proven enterprise deployment (Fortune 500, AWS partnership) make it the lowest-friction path. API calls grew from 35M to 186M per quarter in 2025 without reported scaling issues.

For **retrieval quality at scale** (maintaining accuracy as knowledge bases grow): **Zep/Graphiti** wins. The temporal knowledge graph’s three-tier structure (episodes, semantic entities, communities) with hybrid retrieval (cosine + BM25 + graph traversal) and sophisticated reranking provides the most robust retrieval as complexity increases. The community subgraph specifically addresses the “forest for the trees” problem at scale.

For **architectural scalability** (adapting the memory system as requirements evolve): **Custom pgvector+Neo4j** wins. You can swap index types (HNSW to IVF), add specialized vector databases, introduce caching layers (Redis), or change graph schemas without being constrained by a framework’s abstraction boundaries.

For **cost scalability** (minimizing spend as token volumes grow): **Mem0** reports 90%+ token cost savings vs. full-context approaches. Zep achieves similar efficiency (1.6K vs. 115K tokens). Both dramatically outperform naive approaches, but Mem0’s managed service means you also avoid infrastructure engineering costs.

The overall recommendation for most teams building production agents in 2026: **Start with Mem0 for its operational simplicity and ecosystem integration. Graduate to Zep/Graphiti if you discover that temporal reasoning or complex entity relationships are bottlenecks. Build custom only if you have the engineering team to justify the operational overhead.**

* * *

## Sources

-   [Mem0: Building Production-Ready AI Agents with Scalable Long-Term Memory (arXiv)](https://arxiv.org/abs/2504.19413)
-   [Mem0 raises $24M Series A](https://mem0.ai/series-a)
-   [Mem0 Series A announcement (TechCrunch)](https://techcrunch.com/2025/10/28/mem0-raises-24m-from-yc-peak-xv-and-basis-set-to-build-the-memory-layer-for-ai-apps/)
-   [Mem0 GitHub Repository](https://github.com/mem0ai/mem0)
-   [Zep: A Temporal Knowledge Graph Architecture for Agent Memory (arXiv)](https://arxiv.org/html/2501.13956v1)
-   [Graphiti Hits 20K Stars + MCP Server 1.0](https://blog.getzep.com/graphiti-hits-20k-stars-mcp-server-1-0/)
-   [Graphiti GitHub Repository](https://github.com/getzep/graphiti)
-   [LangMem SDK Documentation](https://langchain-ai.github.io/langmem/)
-   [LangMem Conceptual Guide](https://langchain-ai.github.io/langmem/concepts/conceptual_guide/)
-   [LangMem SDK Launch Blog](https://blog.langchain.com/langmem-sdk-launch/)
-   [LangMem GitHub Repository](https://github.com/langchain-ai/langmem)
-   [Letta (MemGPT) Documentation](https://docs.letta.com/concepts/memgpt/)
-   [Letta Agent Memory Blog](https://www.letta.com/blog/agent-memory)
-   [Benchmarking AI Agent Memory (Letta)](https://www.letta.com/blog/benchmarking-ai-agent-memory)
-   [Rearchitecting Letta’s Agent Loop](https://www.letta.com/blog/letta-v1-agent)
-   [Letta Emerges from Stealth (TechCrunch)](https://techcrunch.com/2024/09/23/letta-one-of-uc-berkeleys-most-anticipated-ai-startups-has-just-come-out-of-stealth/)
-   [Letta GitHub Repository](https://github.com/letta-ai/letta)
-   [Neo4j Agent Memory GitHub Repository](https://github.com/neo4j-labs/agent-memory)
-   [Building Production Agent Memory with Neo4j](https://dev.to/zer0h1ro/building-production-agent-memory-with-neo4j-the-constitutional-graph-pattern-42e6)
-   [PgVector for AI Memory in Production](https://www.ivanturkovic.com/2025/11/16/pgvector-for-ai-memory-in-production-applications/)
-   [AI Agent Memory: Stateful Systems (Redis)](https://redis.io/blog/ai-agent-memory-stateful-systems/)
-   [5 AI Agent Memory Systems Compared (DEV Community)](https://dev.to/varun_pratapbhardwaj_b13/5-ai-agent-memory-systems-compared-mem0-zep-letta-supermemory-superlocalmemory-2026-benchmark-59p3)
-   [Survey of AI Agent Memory Frameworks (Graphlit)](https://www.graphlit.com/blog/survey-of-ai-agent-memory-frameworks)
-   [Graphiti: Knowledge Graph Memory (Neo4j Blog)](https://neo4j.com/blog/developer/graphiti-knowledge-graph-memory/)
-   [Meet Lenny’s Memory: Building Context Graphs (Neo4j)](https://medium.com/neo4j/meet-lennys-memory-building-context-graphs-for-ai-agents-24cb102fb91a)
-   [pgvector 2026 Guide (Instaclustr)](https://www.instaclustr.com/education/vector-database/pgvector-key-features-tutorial-and-pros-and-cons-2026-guide/)
-   [From Beta to Battle-Tested: Letta, Mem0 & Zep (Medium)](https://medium.com/asymptotic-spaghetti-integration/from-beta-to-battle-tested-picking-between-letta-mem0-zep-for-ai-memory-6850ca8703d1)
-   [Best Mem0 Alternatives 2026 (Vectorize)](https://vectorize.io/articles/mem0-alternatives)
