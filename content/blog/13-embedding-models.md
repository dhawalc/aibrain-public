---
title: "Embedding Model Selection for Personal Knowledge Bases: Comprehensive Research Report"
description: "Note: There is no “ada-003” model. The lineage is: text-embedding-ada-002 (legacy, 1536d) -> text-embedding-3-small/large (current as of 2025). OpenAI has not released an..."
date: "2025-12-26"
category: "AI Agent Memory Systems"
author: "QorSync AI Research Team"
readTime: "11 min read"
published: true
---

# Embedding Model Selection for Personal Knowledge Bases: Comprehensive Research Report

* * *

## 1\. Model Overview & Specifications

### OpenAI text-embedding-3 Family

| Property | text-embedding-3-small | text-embedding-3-large |
| --- | --- | --- |
| **Max Dimensions** | 1536 | 3072 |
| **Adjustable Dims** | Yes (e.g., 512) | Yes (e.g., 256, 1024) |
| **Max Tokens** | 8191 | 8191 |
| **MTEB Average** | ~62.3 | ~64.6 |
| **Cost (per 1M tokens)** | $0.02 | $0.13 |
| **Multilingual** | Moderate (trained on multilingual data, no explicit focus) |  |
| **API Only** | Yes | Yes |

Note: There is no “ada-003” model. The lineage is: text-embedding-ada-002 (legacy, 1536d) -> text-embedding-3-small/large (current as of 2025). OpenAI has not released an “ada-003.”

**Key strength**: Matryoshka Representation Learning (MRL) allows dimension truncation with graceful quality degradation. You can store 256d vectors for cost-sensitive applications and still get reasonable retrieval.

### Cohere Embed v4

| Property | Value |
| --- | --- |
| **Dimensions** | 1024 (default), adjustable |
| **Max Tokens** | 512 tokens |
| **MTEB Average** | ~66-67 (estimated) |
| **Cost** | ~$0.10 per 1M tokens (API) |
| **Multilingual** | 100+ languages (strongest multilingual of all commercial options) |
| **Open Weights** | No (API only) |
| **Notable Feature** | Input type parameter: `search_document`, `search_query`, `classification`, `clustering` |

Cohere Embed v4 (released late 2024/early 2025) succeeded Embed v3 with improved compression and multilingual handling. It supports **int8 and binary quantization natively**, making it extremely storage-efficient. The input-type differentiation is particularly useful for conversational memory, where queries and stored memories have different structural characteristics.

### Voyage AI (voyage-3 / voyage-3-large / voyage-code-3)

| Property | voyage-3 | voyage-3-large |
| --- | --- | --- |
| **Dimensions** | 1024 | 1024 |
| **Max Tokens** | 32,000 | 32,000 |
| **MTEB Average** | ~67.2 | ~68.0 |
| **Cost (per 1M tokens)** | $0.06 | $0.18 |
| **Multilingual** | Good | Good |
| **Notable** | Long-context retrieval | Top retrieval benchmarks |

Voyage AI was **acquired by Anthropic in early 2025**. Their models consistently rank at or near the top of MTEB leaderboards for retrieval tasks. The 32K token context window is a significant differentiator for conversational memory – you can embed entire conversation threads as single vectors rather than chunking them.

**voyage-code-3** is specialized for code, irrelevant here.

### BGE Family (BAAI)

| Property | bge-large-en-v1.5 | bge-m3 | bge-en-icl |
| --- | --- | --- | --- |
| **Dimensions** | 1024 | 1024 | 4096 |
| **Max Tokens** | 512 | 8192 | 32,768 |
| **MTEB Average** | ~63.6 | ~65+ (multilingual) | ~67+ |
| **Cost** | Free (open-source) | Free | Free |
| **Multilingual** | English only | 100+ languages | English |
| **License** | MIT | MIT | MIT |

BGE-M3 is notable for supporting **dense, sparse (lexical), and ColBERT-style multi-vector retrieval** in a single model. This hybrid approach is extremely effective for conversational memory because:  
\- Dense vectors capture semantic meaning  
\- Sparse vectors capture exact keyword matches (names, dates, specific facts)  
\- ColBERT captures fine-grained token-level interactions

**bge-en-icl** supports in-context learning for embeddings, where you provide few-shot examples to customize retrieval behavior at inference time – powerful for personalized knowledge bases.

### Nomic Embed (Nomic AI)

| Property | nomic-embed-text-v1 | nomic-embed-text-v1.5 |
| --- | --- | --- |
| **Dimensions** | 768 | 768 (MRL: 64-768) |
| **Max Tokens** | 8192 | 8192 |
| **MTEB Average** | ~62.4 | ~62.3 |
| **Cost** | Free (open-source) / API available | Free / API |
| **Multilingual** | English-focused | English-focused |
| **License** | Apache 2.0 | Apache 2.0 |

Nomic Embed was the **first fully open-source (code + weights + training data) embedding model** to outperform OpenAI ada-002. V1.5 added Matryoshka support. Good balance of quality and efficiency, but lags behind top-tier models. The 8192 context window is adequate for most conversational chunks.

### E5 Family (Microsoft)

| Property | e5-large-v2 | e5-mistral-7b-instruct | multilingual-e5-large-instruct |
| --- | --- | --- | --- |
| **Dimensions** | 1024 | 4096 | 1024 |
| **Max Tokens** | 512 | 32,768 | 512 |
| **MTEB Average** | ~61.5 | ~66.6 | ~61.1 (multilingual) |
| **Cost** | Free (open-source) | Free | Free |
| **Multilingual** | English | English | 100+ languages |
| **License** | MIT | MIT | MIT |
| **Parameters** | 335M | 7B | 560M |

**e5-mistral-7b-instruct** was a breakthrough: an LLM-based embedding model achieving near-SOTA results. However, at 7B parameters, inference cost is substantially higher than smaller encoder models. Requires GPU infrastructure.

### Other Notable Models (2025)

| Model | Dims | MTEB Avg | Notable |
| --- | --- | --- | --- |
| **Jina Embeddings v3** | 1024 (MRL) | ~65 | 8K context, task-specific LoRA adapters |
| **GTE-Qwen2** (Alibaba) | 1536-4096 | ~67+ | LLM-based, strong multilingual |
| **mxbai-embed-large** (Mixedbread) | 1024 | ~64.7 | Binary quantization support |
| **Snowflake Arctic Embed L** | 1024 | ~64.2 | Open-source, retrieval-focused |
| **NV-Embed-v2** (NVIDIA) | 4096 | ~69+ | Topped MTEB in late 2024, requires heavy GPU |

* * *

## 2\. Benchmark Comparison (MTEB / BEIR)

### MTEB Overall Leaderboard (as of early 2025, retrieval-focused tasks)

| Rank | Model | MTEB Avg (Retrieval) | Notes |
| --- | --- | --- | --- |
| 1 | NV-Embed-v2 | ~69.1 | 7B params, impractical for personal use |
| 2 | voyage-3-large | ~68.0 | API, excellent cost-performance |
| 3 | GTE-Qwen2-7B | ~67.8 | Open-source, needs GPU |
| 4 | Cohere Embed v4 | ~67.0 | API, best multilingual |
| 5 | bge-en-icl | ~67.0 | Open-source, in-context learning |
| 6 | voyage-3 | ~67.2 | API, best value commercial |
| 7 | e5-mistral-7b | ~66.6 | Open-source, 7B params |
| 8 | text-embedding-3-large | ~64.6 | API, cheapest at scale |
| 9 | Jina v3 | ~65.0 | Open weights |
| 10 | Snowflake Arctic Embed L | ~64.2 | Open-source |

### BEIR Retrieval Benchmark (nDCG@10 averages)

BEIR is the most relevant benchmark for knowledge base retrieval. Key results:

| Model | BEIR Avg nDCG@10 | Best Domain |
| --- | --- | --- |
| voyage-3-large | ~57.5 | Cross-domain retrieval |
| Cohere Embed v4 | ~56.8 | Multilingual queries |
| bge-en-icl | ~56.0 | With few-shot examples |
| text-embedding-3-large | ~54.8 | General purpose |
| bge-m3 (hybrid) | ~55.5 | When using dense+sparse fusion |

**Important caveat**: Standard benchmarks use formal queries against document corpora. Conversational memory retrieval involves informal, context-dependent queries (e.g., “what did I say about the Python project last week?”) which are structurally different from benchmark queries. Models that handle **asymmetric retrieval** (short informal query vs. longer stored passage) tend to perform better in practice than benchmarks suggest.

* * *

## 3\. Analysis by Selection Criteria

### A. Retrieval Accuracy for Conversational Memory

Conversational memory has unique requirements:  
\- **Asymmetric queries**: Short/informal queries against longer stored conversations  
\- **Temporal context**: “Last week”, “recently”, “that time when…”  
\- **Entity-centric**: “What did Sarah say about X?”  
\- **Mixed formality**: Casual language in queries, varied formality in stored content  
\- **Context dependency**: Queries often lack standalone meaning

**Top picks for conversational memory:**

1.  **Voyage-3 / Voyage-3-large** – 32K context means you can embed entire conversation sessions as single vectors, preserving conversational flow. Anthropic’s acquisition signals continued investment.
    
2.  **Cohere Embed v4** – The `search_query` vs `search_document` input type distinction directly addresses asymmetric retrieval. The model learns different representations for queries vs. documents.
    
3.  **BGE-M3 (hybrid mode)** – Dense+sparse fusion catches both semantic similarity AND exact entity matches. When someone asks “what did I discuss with John about Kubernetes?”, the sparse component catches “John” and “Kubernetes” while the dense component handles semantic matching.
    
4.  **bge-en-icl** – In-context learning lets you provide examples of your retrieval pattern: “Given a query like X, the relevant memory is Y.” This personalization is uniquely powerful for individual knowledge bases.
    

### B. Dimensionality & Storage

For a personal knowledge base, storage costs matter:

| Model | Dims | Bytes/Vector (float32) | Vectors per GB |
| --- | --- | --- | --- |
| nomic-embed-text-v1.5 @128d | 128 | 512 | ~2.1M |
| text-embedding-3-small @256d | 256 | 1024 | ~1.05M |
| bge-m3 (dense) | 1024 | 4096 | ~262K |
| text-embedding-3-large @1024d | 1024 | 4096 | ~262K |
| voyage-3 | 1024 | 4096 | ~262K |
| NV-Embed-v2 | 4096 | 16384 | ~65K |

**Practical recommendation**: For personal knowledge bases with <1M vectors, 1024d is fine. For multi-million vector collections, use MRL models (OpenAI, Nomic, Jina) truncated to 256-512d, or Cohere’s native binary quantization (128 bytes per 1024d vector).

### C. Multilingual Support

| Tier | Models | Languages | Quality |
| --- | --- | --- | --- |
| **Tier 1** | Cohere Embed v4, BGE-M3 | 100+ | Excellent cross-lingual retrieval |
| **Tier 2** | multilingual-e5-large-instruct, Jina v3 | 100+ | Good, but lower overall quality |
| **Tier 3** | text-embedding-3-large, voyage-3 | Multilingual but English-optimized | Adequate for common languages |
| **Tier 4** | Nomic, Snowflake Arctic | English-focused | Poor for non-English |

If the knowledge base is multilingual or you need cross-lingual retrieval (query in English, retrieve content in another language), **Cohere Embed v4** or **BGE-M3** are the clear choices.

### D. Cost Per Token (API Models)

| Model | Cost per 1M tokens | Cost for 1B tokens | Free Tier |
| --- | --- | --- | --- |
| text-embedding-3-small | $0.02 | $20 | No |
| text-embedding-3-large | $0.13 | $130 | No |
| voyage-3 | $0.06 | $60 | 200M tokens free |
| voyage-3-large | $0.18 | $180 | 200M tokens free |
| Cohere Embed v4 | ~$0.10 | ~$100 | 1000 calls/month free |
| Open-source models | $0 (API) | $0 (+ infra cost) | N/A |

**Infrastructure cost for open-source models**: Running BGE-M3 or bge-large-en-v1.5 on a cloud GPU (e.g., T4) costs roughly $0.20-0.50/hour. For periodic batch embedding of personal notes, this is negligible. For real-time embedding on every chat message, a persistent GPU instance may cost $150-400/month.

For personal knowledge bases with moderate volume (<10M tokens/month), **API costs are trivial** for any provider. The self-hosted open-source path only makes economic sense at scale or when you have privacy requirements.

* * *

## 4\. Recommendations by Use Case

### Primary Recommendation: Conversational AI Memory

**Best overall: Voyage-3** ($0.06/1M tokens)

Rationale:  
\- Top-tier retrieval accuracy (MTEB ~67.2)  
\- 32K token context window handles full conversation threads  
\- Excellent asymmetric retrieval (queries vs. documents)  
\- Anthropic-backed, ensuring longevity and Claude ecosystem integration  
\- Reasonable cost  
\- Good enough multilingual support for most users

**Best open-source: BGE-M3 (hybrid mode)**

Rationale:  
\- Dense+sparse+ColBERT hybrid catches entities AND semantics  
\- 8K context, 100+ languages  
\- Fully self-hostable (privacy preservation)  
\- MIT license  
\- Competitive retrieval accuracy when using score fusion

**Best budget: text-embedding-3-small at 512 dimensions**

Rationale:  
\- $0.02/1M tokens (cheapest commercial option by far)  
\- MRL lets you reduce dimensions without retraining  
\- Good-enough quality for personal use  
\- Simplest API integration

### Decision Matrix

| Priority | Recommended Model | Why |
| --- | --- | --- |
| Maximum retrieval quality | voyage-3-large | Highest BEIR scores among practical models |
| Multilingual knowledge base | Cohere Embed v4 | Best cross-lingual retrieval |
| Privacy / self-hosted | BGE-M3 (hybrid) | Open-source, hybrid retrieval |
| Minimum cost (API) | text-embedding-3-small | $0.02/1M tokens |
| Long conversations as single vectors | voyage-3 | 32K token window |
| Personalized retrieval | bge-en-icl | In-context learning adapts to your patterns |
| Balanced all-around | voyage-3 | Best cost-quality-features ratio |

* * *

## 5\. Architecture Recommendation for Conversational Memory

Beyond model selection, the retrieval architecture matters enormously:

1.  **Hybrid retrieval** (dense + sparse) improves recall by 10-15% over dense-only for entity-rich conversational queries. Use BGE-M3 natively, or combine any dense model with BM25.
    
2.  **Two-stage retrieval**: Use a cheaper/smaller model for initial recall (top-100), then a larger model or cross-encoder for reranking (top-10). Cohere Rerank v3 or a cross-encoder like `bge-reranker-v2-m3` significantly improves precision.
    
3.  **Temporal weighting**: Multiply similarity scores by a recency decay factor. Conversations from yesterday should rank higher than semantically-similar conversations from a year ago, all else being equal.
    
4.  **Metadata filtering**: Store timestamps, conversation participants, and topics as metadata. Filter before vector search to narrow the candidate set.
    
5.  **Chunking strategy**: For conversations, chunk by topic shift or turn-group (3-5 turns) rather than fixed token count. Preserve speaker attribution in chunk text.
    

* * *

## 6\. Summary

For a personal conversational AI knowledge base in 2025-2026:

-   **If using APIs**: **Voyage-3** offers the best balance of retrieval quality, context length, cost, and ecosystem alignment (Anthropic). Use Cohere Embed v4 if multilingual is critical.
-   **If self-hosting**: **BGE-M3** in hybrid mode (dense+sparse fusion) with a reranker provides the best retrieval quality for free, with excellent multilingual support.
-   **If cost-minimizing**: **text-embedding-3-small** at 512 dimensions is remarkably capable for $0.02/1M tokens.
-   **Avoid**: NV-Embed-v2 and other 7B+ parameter models for personal use – the marginal quality gain does not justify the infrastructure cost.
-   **Important**: Pair any embedding model with a reranker and hybrid (dense+BM25) retrieval for best results on conversational memory tasks.
