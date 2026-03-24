---
title: "Vector Similarity Search at Scale for AI Agent Memory Retrieval"
description: "Source: TensorBlue 2025 Comparison, Firecrawl 2026 Guide"
date: "2025-12-19"
category: "AI Agent Memory Systems"
author: "QorSync AI Research Team"
readTime: "13 min read"
published: true
---

# Vector Similarity Search at Scale for AI Agent Memory Retrieval

## Deep Comparison: pgvector vs Pinecone vs Weaviate vs Qdrant vs Milvus vs ChromaDB

* * *

## 1\. Architecture Overview

| Database | Language | Deployment Model | Index Types | License |
| --- | --- | --- | --- | --- |
| **pgvector** | C (Postgres extension) | Self-hosted / Managed Postgres | HNSW, IVFFlat | PostgreSQL License |
| **Pinecone** | Proprietary | Managed SaaS only | Proprietary (serverless) | Proprietary |
| **Weaviate** | Go | Self-hosted / Cloud / BYOC | HNSW + ACORN, Flat, Dynamic | BSD-3 |
| **Qdrant** | Rust | Self-hosted / Cloud / Hybrid | HNSW, Sparse Inverted Index | Apache 2.0 |
| **Milvus** | Go + C++ | Self-hosted / Zilliz Cloud | HNSW, IVF\_FLAT, IVF\_PQ, DiskANN, GPU CAGRA | Apache 2.0 |
| **ChromaDB** | Rust core (Python API) | Embedded / Self-hosted / Cloud (early) | HNSW | Apache 2.0 |

* * *

## 2\. Query Latency Benchmarks

### At 1M Vectors (768 dimensions)

| Database | P95 Latency | P99 Latency | Notes |
| --- | --- | --- | --- |
| **Qdrant** | 30-40 ms | ~1 ms (small datasets, optimized) | Rust engine; best raw single-node latency |
| **Pinecone** | 40-50 ms | 7 ms (claimed) | Serverless auto-tuned |
| **Milvus** | 50-80 ms | <30 ms P95 | Strong with GPU acceleration |
| **Weaviate** | 50-70 ms | ~50 ms on 768-dim | ACORN filtering adds minimal overhead |
| **pgvector** | Sub-100 ms | Varies with config | Competitive at this scale with HNSW |
| **ChromaDB** | Fast for single requests | Degrades under concurrency | 23 sec avg at 100 concurrent vs pgvector’s 9.8 sec |

**Source**: [TensorBlue 2025 Comparison](https://tensorblue.com/blog/vector-database-comparison-pinecone-weaviate-qdrant-milvus-2025), [Firecrawl 2026 Guide](https://www.firecrawl.dev/blog/best-vector-databases)

### At 10M Vectors

| Database | Observed QPS | Notes |
| --- | --- | --- |
| **Qdrant** | 8,000-15,000 (with quantization) | 4x RPS improvement in recent versions |
| **Milvus** | 10,000-20,000 | Fastest indexing time; GPU acceleration available |
| **Pinecone** | 5,000-10,000 | Consistent with auto-scaling |
| **Weaviate** | 3,000-8,000 | Additional overhead from graph features |
| **pgvector** | Competitive but requires tuning | Index builds consume significant RAM |

### At 50M-100M Vectors

This is where databases diverge dramatically:

| Database | Performance at 50M+ | 100M+ Viability |
| --- | --- | --- |
| **Milvus** | Purpose-built for this scale; proven at billions | Excellent – designed for billion-scale |
| **Pinecone** | Proven at billions with serverless | Excellent – auto-scales transparently |
| **pgvectorscale** | 471 QPS at 99% recall (50M) – 11.4x better than Qdrant | Hits walls beyond 100M; relational storage model limits |
| **Qdrant** | 41.47 QPS at 99% recall (50M) | Performance degrades; best under 50M per node |
| **Weaviate** | Reports needing more memory/compute above 100M | Viable with enterprise cloud; needs careful sizing |
| **ChromaDB** | Not designed for this scale | Not viable – single-node focus |

**Key finding**: pgvectorscale with DiskANN and Statistical Binary Quantization achieves P95 latency 28x lower than Pinecone s1 pods at 99% recall on 50M vectors. However, Postgres’s 8KB page storage model and memory-intensive index builds become limiting factors beyond 100M. Source: [Firecrawl 2026](https://www.firecrawl.dev/blog/best-vector-databases)

* * *

## 3\. Throughput (QPS)

### VectorDBBench Standard Results (8-core, 32GB host)

The [VectorDBBench](https://github.com/zilliztech/VectorDBBench) project provides standardized comparisons across 15 test cases. Key findings from 2025-2026 runs:

-   **Milvus/Zilliz Cloud**: Led in indexing speed and maintained strong QPS at moderate dimensions. Performance drops with higher-dimensional embeddings (1536+).
-   **Qdrant**: Highest RPS and lowest latencies in most scenarios at 1M-10M scale. Claims 4x RPS improvements over previous versions on deep-image-96 dataset.
-   **Elasticsearch**: 10x slower indexing than Qdrant at 10M+ vectors (5.5 hours vs 32 minutes).
-   **Weaviate**: “Improved the least since the last benchmark run” per Qdrant’s benchmarks. However, Weaviate’s own Search Mode benchmarks show +17% Success@1 improvement.
-   **Pinecone**: In Cohere 10M streaming tests, maintained higher QPS and recall throughout the write cycle. Performance improved significantly after ingestion completion.

**Source**: [Qdrant Benchmarks](https://qdrant.tech/benchmarks/single-node-speed-benchmark/), [VectorDBBench GitHub](https://github.com/zilliztech/VectorDBBench)

* * *

## 4\. Hybrid Search (Vector + Full-Text)

This is a critical dimension for AI agent memory, where you need both semantic similarity (finding conceptually related memories) and keyword precision (matching specific entities, dates, tool names).

| Database | BM25/Full-Text | Hybrid Approach | Fusion Method | Maturity |
| --- | --- | --- | --- | --- |
| **Weaviate** | Native BM25F (field-weighted) | Single `hybrid()` API call | RRF or custom weights | Most mature – BlockMax WAND (GA 2025) makes keyword side 10x faster |
| **Milvus** | Native Sparse-BM25 (since 2.5) | Multi-vector search combining dense + sparse | RRF, Weighted | Strong – 30x faster than Elasticsearch on BM25 queries (6ms vs 200ms at 1M vectors) |
| **Qdrant** | Sparse inverted index (since v1.9) | Named vectors: dense HNSW + sparse index | DBSF (score-aware fusion) | Good – server-side IDF since v1.15.2 |
| **Pinecone** | Sparse-dense vectors | Combined sparse+dense in single query | Built-in fusion | Good for simple cases; less configurable |
| **pgvector** | PostgreSQL tsvector/tsquery | Separate queries combined in SQL | Manual (application-level RRF) | Functional but not integrated; no single-query hybrid |
| **ChromaDB** | Basic metadata + full-text search | Where filters + text matching | None (basic) | Limited – not production-grade hybrid |

### Hybrid Search Quality Benchmarks (Weaviate Search Mode)

| Dataset | Success@1 | Recall@5 | nDCG@10 |
| --- | --- | --- | --- |
| BEIR Natural Questions | 0.43 | 0.70 | 0.61 |
| BEIR SciFact | 0.58 | 0.79 | 0.71 |
| BEIR FiQA | 0.45 | 0.43 | 0.45 |

Weaviate’s Search Mode showed +5% to +24% improvement over standard hybrid search across 12 IR benchmarks.

**For AI agent memory**: Hybrid search is essential. Agent memories contain both semantic content (“the user prefers Python”) and precise identifiers (“tool:code\_executor”, “session:abc123”). Weaviate and Milvus lead here.

**Sources**: [Weaviate Hybrid Search](https://weaviate.io/hybrid-search), [Weaviate Search Mode Benchmarking](https://weaviate.io/blog/search-mode-benchmarking), [Milvus Full Text Search](https://milvus.io/docs/full-text-search.md), [Qdrant Hybrid Search](https://qdrant.tech/articles/hybrid-search/)

* * *

## 5\. Metadata Filtering Performance

Filtering is the “Achilles heel” of vector search. AI agents need to filter by user\_id, session\_id, timestamp ranges, memory type, and tool context – often eliminating 90-99% of candidates.

### Filtering Strategies by Database

| Database | Strategy | Behavior Under Restrictive Filters |
| --- | --- | --- |
| **Qdrant** | Adaptive query planner (brute-force or graph filtering based on selectivity) | Maintains stable latency; HNSW with 0.1 ratio filter shows similar latency to unfiltered |
| **Weaviate** | ACORN (default since v1.34) – multi-hop expansion + random seed entrypoints | Up to 10x improvement with low-correlation filters; ranked #2 on Qdrant’s benchmark |
| **Milvus** | Pre-filtering with bitset + partition key | Fast for high-cardinality attributes; partition key enables O(1) tenant isolation |
| **Pinecone** | Single-stage integrated filtering | 50% selective filter: 57ms; 1% filter: 51.6ms (35% faster than unfiltered 79ms on 1.2M vectors) |
| **pgvector** | Post-filtering (no filter push-down into index scan) | “Difference between 50ms and 5 seconds” – iterative scans in 0.8.0 help but fundamental limitation remains |
| **ChromaDB** | Where-clause metadata filtering | Basic; no advanced query planning |

**Critical finding**: Engines with in-algorithm filtering (Qdrant, Pinecone, Weaviate ACORN) actually get faster under restrictive filters because they prune the search space. Post-filter systems (pgvector, LanceDB, OpenSearch) spike to 200-300ms P95 under filtering. Source: [The Achilles Heel of Vector Search: Filters](https://yudhiesh.github.io/2025/05/09/the-achilles-heel-of-vector-search-filters/)

**Filtered QPS comparison at 10% selectivity**:  
\- Pinecone-p2: ~600 QPS (from ~800 unfiltered)  
\- Zilliz-AUTOINDEX: ~700 QPS (from ~750 unfiltered)  
\- pgvector-HNSW: QPS dips below unfiltered (post-filter overhead)  
\- OpenSearch-HNSW: QPS dips similarly

* * *

## 6\. Cost Analysis at Scale

### Managed Service Costs (Monthly Estimates, 1536 dimensions)

| Scale | Pinecone Serverless | Weaviate Cloud | Qdrant Cloud | Zilliz Cloud (Milvus) | pgvector (Managed Postgres) | ChromaDB |
| --- | --- | --- | --- | --- | --- | --- |
| **1M vectors** | ~$15-25 | ~$45 (minimum) | Free (1GB tier) | Free tier / ~$20 | $10-30 (small instance) | Free (self-hosted) |
| **10M vectors** (5M queries/mo) | ~$64 | ~$85 | ~$102 (AWS, no quantization) | ~$89 (serverless) / $114 (dedicated) | ~$100-200 (self-hosted AWS) | Free but single-node only |
| **100M vectors** | ~$200-400 storage + significant read costs | Enterprise pricing (contact sales) | ~$660+ self-hosted AWS | $500-1000 self-hosted / Enterprise managed | $300-500 (r6g.2xlarge+) | Not viable |

### Pricing Models Breakdown

**Pinecone Serverless**:  
\- Storage: $0.33/GB/month  
\- Read Units: $8.25 per 1M reads  
\- Write Units: $2.00 per 1M writes  
\- Tipping point for self-hosting: ~60-80M queries/month

**Zilliz Cloud (Milvus)**:  
\- Serverless: $4 per 1M vCUs  
\- Storage: $0.04/GB/month (standardized Jan 2026)  
\- DiskANN advantage: 10x more vectors on SSD vs RAM, dramatically lowering cost at 100M+  
\- Tiered storage: 87% storage cost reduction announced

**Weaviate Cloud**:  
\- $25 per 1M vector dimensions/month  
\- $45/month minimum  
\- Predictable pricing – no penalty for query spikes

**Qdrant Cloud**:  
\- Free: 1GB forever  
\- Managed: Starting $0.014/hour  
\- Compute + Memory + Storage billed hourly

### Self-Hosting Cost Crossover

Below 50M vectors: Managed SaaS is cheaper due to hidden DevOps costs.  
Above 50-100M vectors: Self-hosting becomes economical if you have Kubernetes expertise.  
At 1B+ vectors: Milvus self-hosted with DiskANN on commodity hardware is the most cost-effective.

**Sources**: [Rahul Kolekar Pricing Comparison 2026](https://rahulkolekar.com/vector-db-pricing-comparison-pinecone-weaviate-2026/), [Pinecone Pricing](https://www.pinecone.io/pricing/estimate/), [Zilliz Pricing](https://zilliz.com/pricing), [Qdrant Pricing](https://qdrant.tech/pricing/), [Weaviate Pricing](https://weaviate.io/pricing)

* * *

## 7\. Operational Complexity

| Database | Deployment Effort | Scaling Model | Key Operational Concerns |
| --- | --- | --- | --- |
| **pgvector** | **Lowest** (existing Postgres) | Vertical only (single-node) | Index builds consume 10+ GB RAM on production DB; no horizontal scaling; HNSW rebuilds cause lock contention; IVFFlat clusters degrade over time requiring periodic rebuilds |
| **Pinecone** | **Lowest** (zero-ops SaaS) | Automatic serverless | No infrastructure to manage; vendor lock-in; limited configuration control; no self-hosting option |
| **ChromaDB** | **Low** (pip install, embedded) | Single-node only | Prototyping only; no production HA; no horizontal scaling; experimental distributed mode |
| **Qdrant** | **Low-Medium** (single binary, Docker) | Manual sharding + replication | Compact Rust binary; simple Docker deployment; snapshot-based backups; manual scaling decisions |
| **Weaviate** | **Medium** (Docker/Kubernetes) | Horizontal with replication | Good documentation; module system adds complexity; BYOC option reduces ops burden |
| **Milvus** | **High** (Kubernetes required for distributed) | Full horizontal (disaggregated compute/storage) | Requires etcd + MinIO/S3 + Pulsar/Kafka; multiple microservices; steep learning curve; powerful but complex |

### Self-Hosted Kubernetes Complexity

Milvus Distributed on Kubernetes is the most operationally demanding: you must manage etcd clusters, object storage (MinIO), message queues (Pulsar), and the Milvus services themselves. This requires engineers who understand Kubernetes networking, persistent volume claims, and pod disruption budgets. However, Zilliz Cloud eliminates this entirely.

Qdrant and Weaviate sit in the middle: Docker deployment is straightforward, and both offer Helm charts for Kubernetes.

pgvector requires zero additional infrastructure – it is your existing PostgreSQL database. This is its strongest operational argument and why many teams start here.

**Source**: [Scaling Vector Search: Self-Hosted vs Managed](https://medium.com/@aefselinates/scaling-vector-search-my-hands-on-comparison-of-self-hosted-and-managed-solutions-8efb68fe8c8e), [The Case Against pgvector](https://alex-jacobs.com/posts/the-case-against-pgvector/)

* * *

## 8\. Quantization & Memory Optimization

Quantization is critical for cost control at 100M+ scale:

| Database | Binary Quantization | Scalar Quantization | Product Quantization | Memory Reduction |
| --- | --- | --- | --- | --- |
| **Qdrant** | Yes + 1.5-bit, 2-bit, asymmetric (2025) | Yes (float32 -> uint8) | No | 4-8x (scalar), 32x (binary), 40x speedup with binary |
| **Milvus** | Yes | Yes | Yes (IVF\_PQ, GPU CAGRA) | Up to 32x; DiskANN moves vectors to SSD |
| **pgvector** | Yes (up to 64K dims) | Yes (halfvec for half-precision) | No | 2-4x with halfvec; 32x with binary |
| **Weaviate** | Yes (BQ) | Yes (SQ) | Yes (PQ) | Configurable per collection |
| **Pinecone** | Automatic (internal) | Automatic | Automatic | Transparent to user |
| **ChromaDB** | No (limited) | No (limited) | No | Relies on HNSW defaults |

**Source**: [Qdrant Quantization](https://qdrant.tech/documentation/guides/quantization/), [pgvector GitHub](https://github.com/pgvector/pgvector)

* * *

## 9\. AI Agent Memory: Architecture Recommendations

Modern AI agent memory systems require:  
\- **Episodic memory**: Conversation turns, tool calls, observations (high write volume, temporal queries)  
\- **Semantic memory**: Facts, user preferences, learned patterns (hybrid search critical)  
\- **Procedural memory**: Successful strategies, tool usage patterns (metadata-heavy filtering)

Production approaches combine dense vector search + sparse BM25 keyword matching + metadata filtering (timestamps, user IDs, topics) + cross-encoder reranking, while adding semantic caching to cut costs on repeated queries. Source: [AI Agent Memory Architecture](https://www.letsdatascience.com/blog/ai-agent-memory-architecture)

* * *

## 10\. Recommendations by Scale

### 1M Vectors (Startup / Single-Agent)

**Best choice: pgvector** or **Qdrant**

pgvector wins if you already run PostgreSQL – zero additional infrastructure, sub-100ms latency, and your metadata lives alongside your vectors. Qdrant wins if you need better filtering performance and want a dedicated vector engine with a small footprint.

### 10M Vectors (Production Multi-Agent System)

**Best choice: Weaviate** or **Qdrant Cloud**

At this scale, hybrid search becomes essential for agent memory quality. Weaviate’s native BM25F + ACORN filtering makes it the strongest choice for retrieval quality. Qdrant Cloud offers the best pure vector performance if hybrid search is handled at the application layer. Pinecone is compelling if you want zero-ops.

### 100M Vectors (Enterprise Agent Platform)

**Best choice: Milvus/Zilliz Cloud** or **Pinecone Enterprise**

Milvus is purpose-built for this scale with DiskANN, GPU acceleration (50x faster search with CAGRA), and disaggregated storage/compute. Zilliz Cloud removes the operational burden. Pinecone Enterprise offers proven billion-scale with zero ops but at premium cost and vendor lock-in. pgvectorscale is surprisingly competitive at 50M (471 QPS at 99% recall) but hits architectural walls beyond 100M.

### 1B+ Vectors (Massive-Scale Platform)

**Best choice: Milvus** (self-hosted with GPU) or **Pinecone Enterprise**

Only Milvus and Pinecone have proven production deployments at billion-scale. Milvus with 8 DGX H100 GPUs can build an index of 635M 1024-dim vectors in 56 minutes (vs 6.22 days on CPU). Zilliz Cloud’s tiered storage delivers 87% storage cost reduction at this scale.

* * *

## Summary Matrix

| Criterion | pgvector | Pinecone | Weaviate | Qdrant | Milvus | ChromaDB |
| --- | --- | --- | --- | --- | --- | --- |
| Latency (1M) | Good | Good | Good | Best | Good | Good (single-request) |
| Throughput (10M+) | Moderate | High | Moderate | High | Highest | Poor |
| Hybrid Search | Weak | Basic | Best | Good | Strong | Basic |
| Filtering | Weak (post-filter) | Strong | Strong (ACORN) | Best | Strong | Basic |
| Cost (10M) | Lowest | $64/mo | $85/mo | $102/mo | $89-114/mo | Free |
| Cost (100M) | $300-500/mo | $400+/mo | Enterprise | $660+/mo | $500-1000/mo | N/A |
| Ops Complexity | Lowest | Zero-ops | Medium | Low | High | Lowest |
| Max Proven Scale | ~50-100M | Billions | ~100M | ~50M per node | Billions | ~10M |
| GPU Acceleration | No | N/A (managed) | No | Yes (indexing) | Yes (50x search) | No |
| Agent Memory Fit | Good start | Good (managed) | Best (hybrid) | Good (filtering) | Best (scale) | Prototyping only |

* * *

## Sources

-   [Firecrawl: Best Vector Databases in 2026](https://www.firecrawl.dev/blog/best-vector-databases)
-   [TensorBlue: Vector Database Comparison 2025](https://tensorblue.com/blog/vector-database-comparison-pinecone-weaviate-qdrant-milvus-2025)
-   [Qdrant: Single Node Speed Benchmark](https://qdrant.tech/benchmarks/single-node-speed-benchmark/)
-   [Qdrant: Filtered Search Benchmark](https://qdrant.tech/benchmarks/filtered-search-intro/)
-   [VectorDBBench (GitHub)](https://github.com/zilliztech/VectorDBBench)
-   [The Achilles Heel of Vector Search: Filters](https://yudhiesh.github.io/2025/05/09/the-achilles-heel-of-vector-search-filters/)
-   [The Case Against pgvector](https://alex-jacobs.com/posts/the-case-against-pgvector/)
-   [Rahul Kolekar: Vector DB Pricing Comparison 2026](https://rahulkolekar.com/vector-db-pricing-comparison-pinecone-weaviate-2026/)
-   [Weaviate: Search Mode Benchmarking](https://weaviate.io/blog/search-mode-benchmarking)
-   [Weaviate: ACORN Filtered Search](https://weaviate.io/blog/speed-up-filtered-vector-search)
-   [Milvus: Full-Text Search Docs](https://milvus.io/docs/full-text-search.md)
-   [Milvus: GPU CAGRA Optimization](https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md)
-   [NVIDIA GPU Acceleration for Milvus](https://thenewstack.io/how-nvidia-gpu-acceleration-supercharged-milvus-vector-database/)
-   [Zilliz Cloud Pricing](https://zilliz.com/pricing)
-   [Pinecone Pricing Estimator](https://www.pinecone.io/pricing/estimate/)
-   [Weaviate Pricing](https://weaviate.io/pricing)
-   [Qdrant Pricing](https://qdrant.tech/pricing/)
-   [Qdrant: Hybrid Search with Query API](https://qdrant.tech/articles/hybrid-search/)
-   [LiquidMetal AI: Vector Comparison](https://liquidmetal.ai/casesAndBlogs/vector-comparison/)
-   [pgvector 0.8.0 Release](https://www.postgresql.org/about/news/pgvector-080-released-2952/)
-   [pgvectorscale Benchmarks](https://www.tigerdata.com/blog/pgvector-vs-qdrant)
-   [ChromaDB Performance Docs](https://docs.trychroma.com/guides/deploy/performance)
-   [Shakudo: Top 9 Vector Databases March 2026](https://www.shakudo.io/blog/top-9-vector-databases)
-   [VDBBench 1.0 Announcement](https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md)
-   [Hybrid Search for RAG: BM25, SPLADE, and Vector Search](https://blog.premai.io/hybrid-search-for-rag-bm25-splade-and-vector-search-combined/)
-   [AI Agent Memory Architecture](https://www.letsdatascience.com/blog/ai-agent-memory-architecture)
-   [Mem0: Production-Ready AI Agents with Long-Term Memory](https://arxiv.org/pdf/2504.19413)
