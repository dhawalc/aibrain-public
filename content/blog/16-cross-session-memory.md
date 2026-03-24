---
title: "Cross-Session Memory for Multi-Model Orchestration Systems"
description: "When orchestrating heterogeneous LLM instances – whether running Llama, Mistral, and Qwen locally via Ollama, or mixing cloud providers like OpenAI and Anthropic – a..."
date: "2025-12-29"
category: "AI Agent Memory Systems"
author: "QorSync AI Research Team"
readTime: "14 min read"
published: true
---

# Cross-Session Memory for Multi-Model Orchestration Systems

## Comprehensive Research Report (2025-2026 Developments)

* * *

## 1\. The Core Problem

When orchestrating heterogeneous LLM instances – whether running Llama, Mistral, and Qwen locally via Ollama, or mixing cloud providers like OpenAI and Anthropic – a fundamental challenge emerges: **no model shares memory with another by default**. Each model invocation is stateless. Context dies when the response ends. When a Llama 3.1 instance reasons about a problem and then a Mistral instance takes over, the accumulated understanding vanishes unless an external memory layer explicitly bridges the gap.

This report covers the current state of shared memory protocols, serialization formats, vector stores, cross-model APIs, and framework-level solutions as of early 2026.

* * *

## 2\. Memory Serialization Formats

### 2.1 JSON/JSONL (Dominant Standard)

JSON remains the universal lingua franca for LLM memory serialization. The MCP Memory Server uses JSONL (one JSON object per line) for its `memory.json` files. LangChain supports serialization and deserialization of memory types to and from JSON. Most frameworks (Mem0, CrewAI, LangGraph) use JSON-based representations internally for memory records.

**Practical pattern**: Memory records typically serialize as JSON objects containing `content`, `metadata` (timestamps, source model, agent\_id), `embedding` (float array), and `scope` (user/agent/session identifiers).

### 2.2 Letta Agent File (.af)

Launched April 2025, Letta’s `.af` format is the first open standard specifically designed for serializing **stateful agents with persistent memory**. An `.af` file packages:  
\- Model configuration (context window limits, model name, embedding model)  
\- Message history with an `in_context` field marking messages within the current window  
\- System prompts  
\- Memory blocks (editable in-context segments for personality and user information)  
\- Tool definitions (source code + JSON schemas)  
\- Tool rules and environment variables

The format enables cross-model portability: an agent built on GPT-4o can be exported as `.af` and imported into a Letta server running Claude or Llama. However, archival memory passages are not yet supported, and cross-framework converters remain on the roadmap. The full schema is defined in the Letta repository.

### 2.3 MemCube (MemOS)

MemOS, developed by researchers from Shanghai Jiao Tong University and Zhejiang University, introduces **MemCube** as a standardized memory encapsulation unit. Each MemCube contains:  
\- **Descriptive metadata**: timestamps, origin signatures, semantic types  
\- **Governance attributes**: access permissions, lifespan policies, priority levels, sensitivity tags, access logging  
\- **Behavioral indicators**: access frequency, context relevance, version lineage

MemCube unifies three memory types: parametric (model weights/LoRA), activation (KV-cache, attention states), and plaintext (documents, knowledge graphs). The system supports transformation pathways between types (e.g., frequently accessed plaintext converts to activation templates; stable knowledge distills into parametric structures).

### 2.4 TOON (Token-Oriented Object Notation)

An emerging format designed to optimize structured data for LLM input, offering minimal syntax, explicit schemas, and significant token savings over JSON. Positioned as a complement to JSON in LLM contexts where token efficiency matters, though adoption remains limited.

### 2.5 Protocol Buffers (A2A Protocol)

Google’s Agent2Agent (A2A) protocol uses Protocol Buffer definitions (`spec/a2a.proto`) as its normative data model, with JSON-RPC, gRPC, and HTTP/REST bindings. Messages consist of `Parts` (text, file references, structured data) and `Artifacts` (task outputs as collections of Parts).

* * *

## 3\. Shared Vector Stores for Cross-Model Memory

### 3.1 The Embedding Compatibility Problem

The fundamental challenge: **every embedding model creates its own unique vector space**. A 768-dimensional vector from BERT has no meaningful relationship to a 768-dimensional vector from a T5 model, even for identical concepts. For a shared vector store to work across heterogeneous models, all participants must agree on the embedding model, dimensionality, and normalization.

**2025 breakthrough**: Orthogonal Procrustes transformation can now translate embeddings between different models (GPT, BERT, proprietary APIs) with >0.9 cosine similarity to native embeddings, partially addressing the interoperability gap.

**Practical solution**: Most production systems standardize on a single embedding model (e.g., `text-embedding-3-small` from OpenAI, or `nomic-embed-text` via Ollama locally) regardless of which LLM generates or consumes the memories.

### 3.2 Vector Database Landscape (2025-2026)

| Database | Key 2025-2026 Development | Multi-Agent Relevance |
| --- | --- | --- |
| **Qdrant** | 4-bit quantization, Qdrant Edge for on-device retrieval, relevance feedback for agent workflows | Agent-native retrieval, hybrid/multimodal pipelines |
| **ChromaDB** | Rust-core rewrite delivering 4x faster writes/queries, enhanced garbage collection | Default for CrewAI; concurrency issues with parallel crews |
| **Milvus** | Production-grade distributed vector search | Mature multi-tenant support |
| **pgvector** | PostgreSQL-native; used by LangGraph’s PostgresStore | Joins relational + vector in one DB |
| **LanceDB** | CrewAI’s new default (replacing ChromaDB), stored at `.crewai/memory` | Better concurrency than ChromaDB |

Mem0 alone supports 22+ vector stores (Qdrant, Pinecone, ChromaDB, PGVector, etc.) plus 5+ graph databases (Neo4j, Memgraph, Kuzu, Neptune).

### 3.3 Graph-Based Memory Stores

**Zep/Graphiti**: A temporal knowledge graph engine that stores entities and relationships with bi-temporal validity tracking (event time and ingestion time). Each edge carries four timestamps: `t'_created`, `t'_expired`, `t_valid`, `t_invalid`. Retrieval at P95 latency of 300ms combines semantic embeddings, BM25 keyword search, and graph traversal. Outperforms MemGPT on Deep Memory Retrieval benchmarks with up to 18.5% accuracy improvement.

**Cognee**: Combines vector search, graph databases, and cognitive science approaches. Its MCP integration allows Claude, GPT-4, and local Llama models to all talk to the same Cognee instance through a shared protocol. Running 1M+ pipelines/month in production at 70+ companies.

* * *

## 4\. Cross-Model Memory APIs

### 4.1 Mem0: The Universal Memory Layer

Mem0 (raised $24M, October 2025) provides the most model-agnostic memory API. Core operations:

`# Works identically regardless of underlying LLM memory.add(messages, user_id="alice", agent_id="researcher") memory.search("What does Alice prefer?", user_id="alice") memory.get_all(user_id="alice")`

**Cross-model mechanics**: Memory is stored externally in the vector/graph store. Any LLM (OpenAI, Anthropic, Ollama/local) can write to and read from the same memory layer. Scoping via `user_id`, `agent_id`, and `run_id` enables both isolation and sharing. Mem0 uses LLM calls to extract and consolidate memories, but the stored memories are model-independent text/embeddings.

**Ollama integration**: Mem0 runs fully locally with Ollama for both embeddings (`nomic-embed-text`) and LLM (`llama3.1`), meaning the entire memory pipeline can operate without any cloud dependency.

**Graph memory**: Entity-relationship extraction creates structured knowledge representations stored in Neo4j or other graph databases, enabling semantic querying across agents.

### 4.2 LangGraph: Checkpointers + Stores

LangGraph separates two concerns:

**Checkpointers** (short-term, thread-scoped): Persist conversation state per thread. Backends: InMemorySaver, PostgresSaver, MongoDBSaver, RedisSaver. Auto-propagate to child subgraphs. Thread cleanup via `checkpointer.delete_thread(thread_id)`.

**Stores** (long-term, cross-thread): Organize data in namespace tuples like `(user_id, "memories")`. Support semantic search via embeddings. Any agent in any thread can access shared stores if given the right namespace. Backends: PostgresStore, RedisStore.

**Multi-model relevance**: LangGraph is model-agnostic. Different nodes in a graph can use different models (e.g., Haiku for classification, Opus for synthesis) while sharing the same state and stores. The centralized state acts as shared memory accessible to all nodes.

### 4.3 CrewAI: Unified Memory with Scoping

CrewAI’s 2025 rewrite replaced four separate memory types with a single `Memory` class featuring:  
\- **Hierarchical scope tree**: filesystem-like paths (e.g., `/project/alpha`, `/agent/researcher`)  
\- **Composite scoring**: blends semantic similarity (`1/(1+distance)`), recency decay (`0.5^(age_days/half_life_days)`), and importance (0-1)  
\- **LLM analysis on save**: auto-infers scope, categories, importance  
\- **Memory consolidation**: >0.85 cosine similarity triggers LLM decision (keep/update/delete/insert)  
\- **MemorySlice**: read-only or read-write access across multiple non-contiguous scopes

**Multi-model support**: CrewAI supports any LLM; different agents in a crew can use different models while sharing the crew-level `Memory` instance. Supports Ollama embeddings natively.

### 4.4 Letta: OS-Inspired Memory Tiers

Letta implements three tiers inspired by computer architecture:  
\- **Core Memory**: small block living in the context window (like RAM), editable via `core_memory_append` and `core_memory_replace` tools  
\- **Recall Memory**: searchable conversation history outside context (like disk cache)  
\- **Archival Memory**: long-term storage queried via tool calls (like cold storage)

The LLM itself decides what to retain, retrieve, and forget. Letta is fully model-agnostic (recommended: Opus 4.5, GPT-5.2). The `.af` format enables exporting an agent’s complete memory state and loading it on a different model.

* * *

## 5\. Framework-Level Multi-Model Memory Sharing

### 5.1 How LangGraph Handles It

LangGraph’s graph-based architecture naturally supports heterogeneous models. A typical pattern:

1.  **Shared state graph**: All nodes read/write to the same TypedDict state
2.  **Per-node model assignment**: Node A uses `gpt-4o`, Node B uses `claude-opus-4-5`, Node C uses local Llama via Ollama
3.  **Cross-thread stores**: Long-term memories in PostgresStore accessible across all threads and models
4.  **MongoDB checkpointer**: Production-grade persistence enabling cross-session continuity

The key insight: **the state graph IS the shared memory**. No special protocol needed because all nodes operate on the same state object, serialized by the checkpointer between steps.

### 5.2 How CrewAI Handles It

CrewAI’s approach is crew-level memory sharing:

1.  Pass `memory=True` or a configured `Memory` instance to `Crew()`
2.  All agents in the crew share this memory (backed by LanceDB, or Mem0 for production)
3.  Individual agents can maintain private scopes via `memory.scope("/agent/researcher")`
4.  Different agents can use different LLMs while accessing the same memory pool

**CrewAI + Mem0 integration**: For production, CrewAI recommends replacing its built-in memory with Mem0, which provides cross-session persistence, intelligent extraction, and user-scoped memory that survives across crew executions.

### 5.3 How AutoGen / AG2 Handles It

AutoGen (v0.4+, 2025) uses asynchronous messaging with event-driven and request/response patterns. Agents share knowledge through structured dialogues (two-agent chats, group chats, sequential conversations, nested chat patterns). Memory sharing occurs via conversation history passed between agents rather than a dedicated shared memory store, though external memory can be integrated.

### 5.4 How OpenAI Agents SDK Handles It

Sessions provide persistent memory within an agent loop. Handoffs enable task delegation between agents with context transfer. However, the SDK is optimized for OpenAI models, and long-term persistence requires supplementary solutions like Mem0. The Conversations API provides durable threads with replayable state.

* * *

## 6\. Emerging Protocols and Standards (2025-2026)

### 6.1 Model Context Protocol (MCP) for Memory

MCP, donated to the Linux Foundation (AAIF) in December 2025, provides the infrastructure for shared context. MCP Memory Servers give LLMs long-term memory through standardized tool interfaces. Multiple AI agents (Claude, GPT-4, local Llama) can talk to the same memory server. The MCP memory server uses JSONL serialization.

**Context-Aware MCP (CA-MCP)**: A January 2026 research paper proposes a Shared Context Store (SCS) that acts as a centralized blackboard for multi-server coordination. The central LLM seeds the SCS with structured JSON (goals, constraints, execution outlines), then MCP servers operate as stateful reactors that read from and write to the shared context autonomously. Performance: 67.8% faster execution, 60% fewer LLM calls on TravelPlanner benchmarks.

### 6.2 Agent2Agent Protocol (A2A)

Google’s A2A (April 2025, now at v0.3 with gRPC support) enables agents to discover capabilities, negotiate interaction modalities, and manage collaborative tasks. State management uses `contextId` (groups related tasks/messages) and `taskId` (tracks individual work units). Tasks progress through lifecycle states (`working`, `completed`, `failed`, etc.) with polling, streaming, and push notification update mechanisms.

A2A is designed for agents that **don’t share memory, tools, or context** – it enables collaboration through opaque message passing rather than shared state. This is complementary to, not a replacement for, shared memory approaches.

### 6.3 Memory Interchange Protocol (MIP) – Planned

MemOS has announced plans for a Memory Interchange Protocol (MIP) to define standard formats, compatibility rules, and trust mechanisms for cross-model/app memory transmission. As of early 2026, **MIP remains prospective rather than implemented**, but the specification aims to facilitate collaborative knowledge transfer among agents using the MemCube abstraction.

### 6.4 Memory as a Service (MaaS)

A 2025 research framework proposing memory decoupled from agents and exposed as independently callable, dynamically composable service modules:  
\- **Memory Containers**: package data with access policy metadata  
\- **Memory Routing Layer**: semantically determines which memory modules to invoke  
\- **Permission Control**: dynamic authorization incorporating not just *who* but *why*  
\- **Injective Services**: unidirectional memory provision between entities  
\- **Exchange-Based Services**: multidirectional memory access via temporary trusted execution environments

The paper identifies MCP and A2A as rudimentary implementations, arguing the field needs “foundational standards analogous to HTTP/HTML in the web world.”

### 6.5 Collaborative Memory (ICML 2025)

A framework for multi-user, multi-agent environments using bipartite graphs for access control:  
\- **User-Agent Graph** and **Agent-Resource Graph** evolve over time  
\- Dual memory tiers: private (user-isolated) and shared (cross-user)  
\- Each memory fragment carries immutable provenance metadata (creation timestamp, originating user, contributing agents, accessed resources)  
\- Access constraint: agents can only retrieve fragments where all contributing agents and resources fall within their current permissions

* * *

## 7\. Multi-Agent Memory Architecture: The Computer Architecture Perspective

A March 2026 paper frames multi-agent memory using hardware parallels:

| Computer Architecture | Agent Memory Analog |
| --- | --- |
| I/O Layer | Interfaces ingesting text, audio, images, network calls |
| Cache Layer | Compressed context, recent tool calls, KV caches |
| Memory Layer | Vector DBs, graph DBs, document stores |

**Critical protocol gaps identified**:  
1\. **Agent cache sharing protocol**: No principled way to share cached artifacts across agents (analogous to cache transfers in multiprocessors)  
2\. **Memory access control**: No standard for read-only vs read-write permissions, access granularity (document, chunk, record), or scope restrictions  
3\. **Consistency**: The “largest conceptual gap” – how concurrent reads and writes should behave across semantic, heterogeneous memory artifacts

* * *

## 8\. Intrinsic Memory Agents: Heterogeneous Memory by Design

The Intrinsic Memory Agents framework (2025) directly addresses memory for heterogeneous multi-agent systems. Each agent maintains its own **structured JSON memory template** with role-aligned slots (e.g., `domain_expertise`, `current_position`, `proposed_solution`). Key design:

-   **No shared memory between agents**: Each agent’s memory evolves independently through conversation turns
-   **Role divergence**: As conversations continue, agents increasingly diverge in their contextual interpretation based on individual memories
-   **Memory update**: receives previous memory at turn m-1 and agent output at turn m, incorporates new information while preserving historical context
-   **Context construction priority**: (1) initial task description, (2) agent’s structured memory, (3) most recent conversation turns

Results: 38.6% improvement over MetaGPT on PDDL benchmarks; highest token efficiency among tested approaches. The approach uses a generic memory template applicable to new problems without hand-crafted prompts.

* * *

## 9\. Practical Architecture for Ollama Multi-Model Memory Sharing

For a local setup running multiple models via Ollama with shared memory:

**Recommended stack**:  
1\. **Ollama** serving multiple models (set `OLLAMA_MAX_LOADED_MODELS` and `OLLAMA_NUM_PARALLEL`)  
2\. **Mem0** as the memory layer, configured with Ollama for both LLM (`llama3.1`) and embeddings (`nomic-embed-text`)  
3\. **ChromaDB or Qdrant** as the local vector store (Qdrant preferred for concurrent access)  
4\. **Neo4j** (optional) for graph memory / entity relationships  
5\. **LangGraph or CrewAI** as the orchestration framework

**How memory flows**:  
\- Agent A (running Mistral via Ollama) processes a task, Mem0 extracts and stores memories  
\- Agent B (running Llama 3.1 via Ollama) retrieves relevant memories from the same Mem0 store using the same `user_id`  
\- Both agents write to and read from the same vector store using the same embedding model  
\- Cross-session persistence is automatic – memories survive process restarts

**Environment variables for Ollama multi-model**:  
\- `OLLAMA_MAX_LOADED_MODELS`: controls concurrent models in VRAM  
\- `OLLAMA_NUM_PARALLEL`: concurrent requests per model (affects KV cache allocation)

* * *

## 10\. Benchmark Data (2026)

### LoCoMo Benchmark (Long Conversation Memory, 81 Q&A pairs)

| System | Score | Cloud Required |
| --- | --- | --- |
| SuperLocalMemory Mode C | 87.7% | Partial |
| Zep | ~85% | Yes |
| Letta/MemGPT | ~83.2% | Yes |
| SuperLocalMemory Mode A | 74.8% | No |
| Supermemory | ~70% | Yes |
| Mem0 | 58-66% | Yes |

### LongMemEval Benchmark

| System | Accuracy Improvement | Latency |
| --- | --- | --- |
| Zep | +18.5% vs baseline | 90% lower |
| MemOS | +40.43% vs baseline | N/A |
| Hindsight | 91.4% absolute | N/A |

* * *

## 11\. Key Findings and Outlook

**What exists today (early 2026)**:  
\- Mem0, Zep, Letta, CrewAI, and Cognee all provide working cross-session memory for multi-model systems  
\- MCP provides a standardized protocol for connecting any LLM to shared memory servers  
\- Letta’s `.af` format is the first open standard for serializing agent state with memory  
\- All major frameworks support Ollama/local models for fully offline operation  
\- The embedding standardization problem is partially solved via Procrustes transformations

**What remains missing**:  
\- No universal **Memory Interchange Protocol** (MemOS’s MIP remains unimplemented)  
\- No standardized **agent cache sharing protocol** (the multi-processor analogy gap)  
\- No cross-framework **memory consistency model** for concurrent multi-agent access  
\- **Embedding interoperability** still requires either standardizing on one model or applying alignment transformations  
\- A2A deliberately avoids shared memory, meaning inter-organizational agent collaboration cannot leverage shared memory stores

**Trajectory**: The field is converging toward Memory as a Service architectures where memory is a first-class, independently deployable resource rather than a component embedded within individual agents. The ICLR 2026 MemAgents workshop signals that agent memory is now recognized as a distinct research area at the intersection of reinforcement learning, memory research, LLMs, and neuroscience.

* * *

## Sources

-   [Collaborative Memory: Multi-User Memory Sharing in LLM Agents (ICML 2025)](https://arxiv.org/html/2505.18279v1)
-   [ICLR 2026 MemAgents Workshop Proposal](https://openreview.net/pdf?id=U51WxL382H)
-   [Memory as a Service (MaaS): Rethinking Contextual Memory](https://arxiv.org/html/2506.22815v1)
-   [MemOS: An Operating System for Memory-Augmented Generation](https://arxiv.org/html/2505.22101v1)
-   [MemOS GitHub (MemTensor)](https://github.com/MemTensor/MemOS)
-   [Intrinsic Memory Agents: Heterogeneous Multi-Agent LLM Systems](https://arxiv.org/abs/2508.08997)
-   [Multi-Agent Memory from a Computer Architecture Perspective](https://arxiv.org/html/2603.10062)
-   [Context-Aware MCP (CA-MCP)](https://arxiv.org/html/2601.11595v2)
-   [A2A Protocol Specification](https://a2a-protocol.org/latest/specification/)
-   [Google A2A Announcement](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)
-   [Zep: Temporal Knowledge Graph Architecture for Agent Memory](https://arxiv.org/abs/2501.13956)
-   [Graphiti GitHub (Zep)](https://github.com/getzep/graphiti)
-   [Mem0 GitHub](https://github.com/mem0ai/mem0)
-   [Letta Agent File (.af) GitHub](https://github.com/letta-ai/agent-file)
-   [Letta Agent File Documentation](https://docs.letta.com/guides/agents/agent-file/)
-   [Letta V1 Agent Architecture](https://www.letta.com/blog/letta-v1-agent)
-   [LangGraph Memory Documentation](https://docs.langchain.com/oss/python/langgraph/add-memory)
-   [LangGraph + MongoDB Long-Term Memory](https://www.mongodb.com/company/blog/product-release-announcements/powering-long-term-memory-for-agents-langgraph)
-   [CrewAI Memory Documentation](https://docs.crewai.com/en/concepts/memory)
-   [CrewAI + Mem0 Integration](https://mem0.ai/blog/crewai-memory-production-setup-with-mem0)
-   [Cognee MCP Integration](https://www.cognee.ai/blog/cognee-news/introducing-cognee-mcp)
-   [Cognee + LangGraph Persistent Memory](https://www.cognee.ai/blog/integrations/langgraph-cognee-integration-build-langgraph-agents-with-persistent-cognee-memory)
-   [5 AI Agent Memory Systems Benchmarked (2026)](https://dev.to/varun_pratapbhardwaj_b13/5-ai-agent-memory-systems-compared-mem0-zep-letta-supermemory-superlocalmemory-2026-benchmark-59p3)
-   [8 AI Agent Memory Frameworks Compared (2026)](https://vectorize.io/articles/best-ai-agent-memory-systems)
-   [Survey of AI Agent Memory Frameworks (Graphlit)](https://www.graphlit.com/blog/survey-of-ai-agent-memory-frameworks)
-   [MCP Memory Server with HPKV](https://hpkv.io/blog/2025/04/mcp-memory-with-hpkv)
-   [OpenAI Agents SDK Session Memory](https://cookbook.openai.com/examples/agents_sdk/session_memory)
-   [Ollama 2025 Updates](https://www.infralovers.com/blog/2025-08-13-ollama-2025-updates/)
-   [Embedding Cross-Model Compatibility (Procrustes)](https://arxiv.org/html/2510.13406)
-   [MCP Specification (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25)
-   [MCP and Multi-Agent AI (2026)](https://onereach.ai/blog/mcp-multi-agent-ai-collaborative-intelligence/)
-   [Agent Memory Paper List Survey](https://github.com/Shichun-Liu/Agent-Memory-Paper-List)
