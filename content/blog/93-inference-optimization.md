---
title: "LLM Inference Optimization Techniques: A Comprehensive Technical Report (2026)"
description: "Speculative decoding accelerates autoregressive generation by using a small, fast draft model to propose multiple candidate tokens, which a larger target model then verifies in..."
date: "2026-03-17"
category: "AI Breakthroughs"
author: "QorSync AI Research Team"
readTime: "18 min read"
published: true
---

# LLM Inference Optimization Techniques: A Comprehensive Technical Report (2026)

* * *

## 1\. SPECULATIVE DECODING

### Core Mechanism

Speculative decoding accelerates autoregressive generation by using a small, fast **draft model** to propose multiple candidate tokens, which a larger **target model** then verifies in a single forward pass. Because verification of N tokens in parallel is roughly as expensive as generating 1 token, accepted speculations come “for free.”

### Key Variants

**Standard Speculative Decoding (Leviathan et al., Chen et al., 2023)**  
\- Draft model generates K candidate tokens (typically K=4-8).  
\- Target model scores all K tokens in one pass.  
\- Tokens are accepted left-to-right using a rejection sampling scheme that **guarantees identical output distribution** to the target model alone.  
\- Typical speedup: 2-3x with no quality loss.

**Medusa (Cai et al., 2024)**  
\- Eliminates the separate draft model entirely.  
\- Adds multiple lightweight “Medusa heads” (extra linear layers) to the target model itself.  
\- Each head predicts a future token at a different position (t+1, t+2, …, t+K).  
\- Uses tree-structured attention to verify multiple candidate continuations simultaneously.  
\- Speedup: 2-3x. Trade-off: requires fine-tuning the Medusa heads (~1-2 hours on the target model’s training distribution).

**EAGLE and EAGLE-2 (Li et al., 2024)**  
\- Uses a lightweight auto-regressive draft head that operates on the target model’s hidden states (feature-level prediction rather than token-level).  
\- EAGLE-2 introduces context-aware dynamic draft tree construction, adjusting speculation depth based on confidence.  
\- Speedup: 3-5x reported on code generation tasks where predictability is high.  
\- Lossless — same distribution guarantee as standard speculative decoding.

**Lookahead Decoding (Fu et al., 2024)**  
\- Generates and verifies n-grams from Jacobi iteration trajectories without any draft model.  
\- Useful when no suitable draft model exists.  
\- Speedup: 1.5-2x, hardware-dependent.

**Staged Speculative Decoding**  
\- Cascaded approach: a tiny model drafts, a medium model filters, the large model verifies.  
\- Useful for very large target models (e.g., 405B) where even the draft phase is expensive.

### 2025-2026 Trajectory

-   **Recurrent draft models**: Mamba-based or state-space draft models that are extremely fast for sequential generation, paired with Transformer target models.
-   **Self-speculative decoding**: Using early-exit layers of the same model as the draft, avoiding separate model management entirely.
-   **Hardware-aware speculation**: Adjusting speculation length K dynamically based on GPU utilization and memory bandwidth.

### Quality Trade-offs

Standard speculative decoding and EAGLE are **mathematically lossless** — output distribution is identical. Medusa with typical acceptance (greedy or top-k tree) can introduce minor distribution shift if the heads are imperfectly trained. In practice, this is negligible for most applications.

* * *

## 2\. QUANTIZATION

### Overview

Quantization reduces model weights (and optionally activations) from FP16/BF16 to lower bit-widths, reducing memory footprint and increasing throughput by leveraging integer arithmetic and reduced memory bandwidth.

### GPTQ (Frantar et al., 2022-2023)

-   **Method**: Post-training weight-only quantization using approximate second-order information (based on Optimal Brain Quantization).
-   **Process**: Quantizes weights column-by-column, using the inverse Hessian to optimally distribute quantization error across remaining weights.
-   **Typical config**: 4-bit weights, 128-group-size (each group of 128 weights shares a scale/zero-point).
-   **Performance**: ~3.5-4x memory reduction vs FP16. Negligible perplexity loss at 4-bit for models >=7B. 3-bit starts showing degradation.
-   **Ecosystem**: Widely supported in AutoGPTQ, Transformers, vLLM, Exllamav2.
-   **Strengths**: Mature, well-understood, good tooling.
-   **Weaknesses**: Quantization is slow (requires calibration dataset, ~30min-2hrs depending on model size). Weight-only — activations remain in FP16.

### AWQ (Activation-aware Weight Quantization, Lin et al., 2023-2024)

-   **Method**: Observes that a small fraction (~1%) of weight channels are disproportionately important because they process large-magnitude activations. AWQ scales these salient channels up before quantization, protecting them.
-   **Process**: Per-channel scaling factors derived from activation statistics, followed by standard round-to-nearest quantization.
-   **Typical config**: 4-bit, group-size 128.
-   **Performance**: Slightly better quality than GPTQ at the same bit-width (especially for smaller models). Faster quantization process.
-   **Ecosystem**: AutoAWQ, vLLM (first-class support), TensorRT-LLM.
-   **Strengths**: Fast quantization, good quality, hardware-friendly (simpler dequant kernels).
-   **Weaknesses**: Marginal advantage over GPTQ narrows for very large models.

### GGUF (llama.cpp format, Gerganov et al., evolving)

-   **Method**: Not a single quantization algorithm but a container format with multiple quantization types (Q2\_K through Q8\_0, various IQ types for importance-based quantization).
-   **Key innovation**: “K-quants” use per-block (typically 256 weights) scale factors with mixed precision — important blocks get more bits.
-   **IQ (Importance-based Quantization)**: Uses Fisher information or similar metrics to allocate bits non-uniformly. IQ2\_XS achieves usable quality at ~2.5 bits per weight.
-   **Typical configs**:
-   Q4\_K\_M: Good balance of quality and size (~4.8 bpw effective).
-   Q5\_K\_M: Near-lossless for most tasks (~5.5 bpw).
-   Q3\_K\_M: Noticeable degradation, acceptable for casual use (~3.9 bpw).
-   IQ4\_XS: Slightly better than Q4\_K\_M at slightly fewer bits.
-   **Performance**: Optimized for CPU inference (AVX2, AVX-512, ARM NEON). GPU offloading supported via CUDA, Metal, Vulkan, SYCL.
-   **Ecosystem**: llama.cpp, Ollama, KoboldCpp, LM Studio.
-   **Strengths**: Best CPU performance. Flexible mixed-precision. Massive community. Runs on consumer hardware.
-   **Weaknesses**: Less throughput than GPTQ/AWQ on pure GPU workloads due to format overhead.

### HQQ (Half-Quadratic Quantization, Badri & Shaji, 2023-2024)

-   **Method**: Formulates quantization as a half-quadratic optimization problem, alternating between optimizing the quantized weights and an auxiliary variable.
-   **Key advantage**: Zero-shot — no calibration data needed. Very fast quantization (minutes, not hours).
-   **Typical config**: 4-bit and 2-bit variants. Can be combined with low-rank adapters for quality recovery.
-   **Performance**: Competitive with GPTQ/AWQ at 4-bit. At 2-bit, combined with LoRA fine-tuning, it can maintain reasonable quality.
-   **Ecosystem**: HQQ library, Transformers integration.
-   **Strengths**: No calibration data. Extremely fast. Good for rapid experimentation.
-   **Weaknesses**: Slightly less mature tooling. Kernel support less universal than GPTQ/AWQ.

### Emerging Quantization Approaches (2025-2026)

**QuIP# and QuIP-sharp**: Uses vector quantization with lattice codebooks (E8 lattice). Achieves 2-bit quantization with quality rivaling 4-bit RTN. Computationally expensive to decode but pushing the frontier.

**FP8 and FP4 (Hardware-native)**:  
\- NVIDIA Hopper (H100) and Blackwell (B200) GPUs natively support FP8 (E4M3 and E5M2).  
\- FP8 training and inference becoming standard for large-scale serving (2x throughput vs FP16 with minimal quality loss).  
\- Blackwell adds FP4 support — early results show competitive quality for inference.

**AQLM (Additive Quantization for Language Models)**: Multi-codebook quantization achieving strong results at 2-bit.

### Quantization Quality Summary

| Method | Bits | Calibration | Quality (vs FP16) | Best For |
| --- | --- | --- | --- | --- |
| GPTQ | 4 | Yes (slow) | ~99% | GPU serving |
| AWQ | 4 | Yes (fast) | ~99% | GPU serving, vLLM |
| GGUF Q4\_K\_M | ~4.8 | No | ~98-99% | Local/CPU+GPU |
| GGUF Q5\_K\_M | ~5.5 | No | ~99.5% | Quality-sensitive local |
| HQQ | 4 | No | ~98-99% | Rapid iteration |
| GPTQ/AWQ | 3 | Yes | ~95-97% | Memory-constrained |
| GGUF IQ2 | ~2.5 | No | ~90-93% | Extreme compression |
| FP8 | 8 | No | ~99.9% | Datacenter, H100/B200 |

* * *

## 3\. KV-CACHE OPTIMIZATION

The key-value cache stores past attention states and grows linearly with sequence length and batch size. For long contexts and high concurrency, KV-cache is the dominant memory bottleneck.

### PagedAttention (Kwon et al., 2023 — vLLM)

-   **Problem**: Traditional KV-cache allocates contiguous memory per sequence, leading to massive internal fragmentation (60-80% memory waste in naive implementations).
-   **Solution**: Inspired by OS virtual memory, PagedAttention stores KV-cache in non-contiguous fixed-size blocks (“pages”). A block table maps logical KV positions to physical memory blocks.
-   **Benefits**:
-   Near-zero memory waste (fragmentation reduced to <4%).
-   Enables memory sharing across sequences (e.g., shared prompt prefix in beam search or parallel sampling).
-   Copy-on-write semantics for efficient branching.
-   2-4x increase in serving throughput (more concurrent requests fit in memory).
-   **Status in 2026**: Universally adopted. vLLM, TensorRT-LLM, SGLang, and others all use paged KV-cache.

### Multi-head Latent Attention (MLA) — DeepSeek

-   **Origin**: Introduced in DeepSeek-V2 (May 2024), refined in DeepSeek-V3 and R1.
-   **Mechanism**: Instead of caching separate K and V tensors for each attention head (standard MHA), MLA compresses KV into a low-rank latent representation:
-   KV pairs are jointly compressed into a low-dimensional latent vector c\_t.
-   At inference time, K and V are reconstructed from c\_t via learned up-projection matrices.
-   The up-projection matrices are absorbed into the query/output projections during inference, so reconstruction is “free.”
-   **KV-cache reduction**: 5-13x smaller KV-cache compared to standard MHA, depending on the compression ratio.
-   **Quality**: Matches or exceeds standard MHA + GQA quality because the model is trained with MLA from scratch.
-   **Impact**: Enables extremely long contexts (128K+) with manageable memory. DeepSeek-V3’s 671B MoE model with MLA requires dramatically less KV-cache than a comparable dense model with MHA.
-   **Trade-off**: Cannot be retrofitted to existing models — requires training from scratch with MLA architecture.

### Grouped-Query Attention (GQA) and Multi-Query Attention (MQA)

-   **MQA** (Shazeer, 2019): All heads share one K and one V. Massive KV-cache reduction but some quality loss.
-   **GQA** (Ainslie et al., 2023): Groups of heads share K/V. Interpolates between MHA and MQA. Llama 2 70B, Llama 3, Mistral, and most modern models use GQA.
-   **KV-cache reduction**: GQA with 8 KV groups on a 32-head model = 4x reduction.

### KV-Cache Quantization

-   Quantizing cached K/V values to FP8 or INT8 (from FP16) halves KV-cache memory.
-   vLLM and TensorRT-LLM support KV-cache quantization.
-   Quality impact: minimal for FP8, slight degradation for INT4 KV-cache on long sequences.

### KV-Cache Eviction and Compression

**StreamingLLM / Attention Sinks**: Keep only a “sink” window (first few tokens) and a rolling window of recent tokens. Enables infinite-length generation but loses access to middle context.

**H2O (Heavy-Hitter Oracle)**: Dynamically evicts less important KV entries based on cumulative attention scores.

**Scissorhands / FastGen**: Similar eviction strategies with different heuristics.

**Cross-layer KV sharing**: Some 2025-era architectures share KV-cache across adjacent layers, reducing cache by 2-4x with minimal quality loss.

* * *

## 4\. CONTINUOUS BATCHING

### The Problem with Static Batching

In naive batching, all sequences in a batch must complete before any new sequences are admitted. Short sequences waste compute waiting for long ones (head-of-line blocking). GPU utilization drops as sequences finish at different times.

### Continuous (In-flight) Batching

-   **Mechanism**: Requests are added to and removed from the batch at each iteration (token-by-token granularity).
-   **When a sequence completes**, its slot is immediately filled with a new request.
-   **Result**: GPU utilization stays near 100%. Throughput increases 2-10x over static batching (depending on variance in sequence lengths).

### Implementation Details

-   **Iteration-level scheduling**: The scheduler runs between every decode step, deciding which sequences to run next.
-   **Prefill-decode disaggregation**: Prefill (processing the input prompt) is compute-bound; decode (generating tokens) is memory-bandwidth-bound. Advanced schedulers (Sarathi-Serve, Distserv) separate these phases or chunk prefills to avoid stalling decode.
-   **Chunked prefill**: Long prompts are split into chunks and interleaved with decode steps, preventing prefill latency spikes from blocking ongoing generation.
-   **Priority scheduling**: Some frameworks (SGLang, vLLM v2) support priority queues, preemption, and fairness policies.

### State of the Art (2025-2026)

All major serving frameworks implement continuous batching: vLLM, TensorRT-LLM, SGLang, TGI (Text Generation Inference). It is no longer optional — it is table stakes for production serving.

* * *

## 5\. FLASH ATTENTION VARIANTS

### FlashAttention-1 (Dao et al., 2022)

-   **Core idea**: Tiling-based exact attention that avoids materializing the full N x N attention matrix in HBM (GPU main memory).
-   **Mechanism**: Loads Q, K, V in blocks from HBM to SRAM, computes partial attention in SRAM, writes only the final output back to HBM.
-   **Uses online softmax** (Milakov & Gimelshein) to compute exact softmax incrementally without a second pass.
-   **Result**: 2-4x wall-clock speedup over PyTorch standard attention. Memory from O(N^2) to O(N). Enables much longer sequences.

### FlashAttention-2 (Dao, 2023)

-   **Improvements over FA-1**:
-   Better work partitioning between thread blocks and warps.
-   Parallelism over sequence length (not just batch/heads).
-   Reduced non-matmul FLOPs (softmax, mask application).
-   Causal masking without wasted computation.
-   **Result**: ~2x faster than FA-1. Achieves 50-73% of theoretical peak FLOPS on A100 (vs ~30-50% for FA-1).

### FlashAttention-3 (Dao et al., 2024 — Hopper-specific)

-   Exploits H100’s unique hardware features:
-   **Asynchronous WGMMA (Warpgroup MMA)** instructions for overlapping compute and data movement.
-   **TMA (Tensor Memory Accelerator)** for efficient global-to-shared memory transfers.
-   **Warp specialization**: Producer warps load data while consumer warps compute.
-   **FP8 attention**: Native FP8 tensor cores, with incoherent processing (random orthogonal rotations) to maintain numerical accuracy at FP8.
-   **Result**: 1.5-2x faster than FA-2 on H100. Approaches 75%+ of theoretical peak.

### FlashDecoding and FlashDecoding++

-   **FlashDecoding** (Dao et al., 2023): Optimizes the decode phase (single query attending to long KV-cache) by parallelizing across the KV sequence length. Standard FlashAttention parallelizes over batch and heads, but during decode the inner dimension is just 1 — FlashDecoding adds a split-K strategy.
-   **Result**: 5-8x speedup for long-context decode (e.g., 128K context).

### Other Attention Variants

**Ring Attention** (Liu et al., 2023): Distributes attention computation across multiple devices in a ring topology. Enables near-infinite context lengths by overlapping communication and computation. Foundational for training/serving 1M+ context models.

**Sage Attention and Sage Attention 2**: Uses INT8/FP8 for QK^T computation with adaptive precision, trading minimal quality for 2-3x kernel speedup over FA-2 on supported hardware.

* * *

## 6\. TENSOR PARALLELISM AND DISTRIBUTED SERVING

### Tensor Parallelism (TP)

-   **Mechanism**: Splits individual weight matrices across GPUs. Each GPU holds a shard of every layer.
-   **For linear layers**: Split along the output dimension (column parallel) or input dimension (row parallel). Each GPU computes a partial result; an all-reduce synchronizes.
-   **Communication overhead**: One all-reduce per layer (2 per Transformer block). Requires fast interconnect (NVLink, NVSwitch).
-   **Scaling**: Effective up to 8 GPUs within a single node. Beyond 8, communication overhead degrades efficiency.
-   **Use case**: Serving a single model that doesn’t fit on one GPU. Reduces per-token latency (vs pipeline parallelism).

### Pipeline Parallelism (PP)

-   **Mechanism**: Different layers assigned to different GPUs. Data flows through GPUs sequentially.
-   **Lower communication**: Only activations at layer boundaries (point-to-point, not all-reduce).
-   **Weakness**: Pipeline bubbles reduce utilization unless micro-batching is used aggressively.
-   **Use case**: Multi-node serving where inter-node bandwidth is limited.

### Expert Parallelism (EP)

-   **For MoE models**: Different experts placed on different GPUs.
-   **Communication**: All-to-all dispatch of tokens to expert-hosting GPUs.
-   **Vital for**: DeepSeek-V3 (256 experts), Mixtral, and other MoE models.
-   **Combined with TP**: Typically TP within expert, EP across experts.

### Sequence Parallelism (SP)

-   Partitions the sequence dimension across GPUs for non-attention operations (LayerNorm, dropout).
-   Complements TP by distributing operations that TP doesn’t parallelize.

### Practical TP Configurations (2026)

| Model Size | GPUs Needed (FP16) | GPUs Needed (4-bit) | Recommended Parallelism |
| --- | --- | --- | --- |
| 7-8B | 1 (A100-80G) | 1 (RTX 3090 24G) | None needed |
| 13B | 1 (A100-80G) | 1 (RTX 4090 24G) | None or TP=2 |
| 34-40B | 2x A100 | 1 (A100 80G, 4-bit) | TP=2 |
| 70B | 4x A100 | 1-2 (A100 80G, 4-bit) | TP=4 |
| 405B | 8x H100 | 4x A100 (4-bit) | TP=8 or TP+PP |
| 671B MoE | 8x H100 | 2-4x H100 (FP8) | TP+EP |

* * *

## 7\. LOCAL LLM SERVING: OLLAMA vs vLLM vs llama.cpp

### llama.cpp

**What it is**: A C/C++ inference engine optimized for running quantized models on consumer hardware (CPU, Apple Silicon, NVIDIA GPU, AMD GPU via Vulkan/ROCm).

**Strengths**:  
\- Best-in-class CPU performance (highly optimized AVX2/AVX-512/NEON kernels).  
\- Excellent Apple Silicon support (Metal backend, unified memory).  
\- GGUF quantization ecosystem (widest range of quant options: Q2 through Q8, IQ variants).  
\- Low overhead, minimal dependencies.  
\- Partial GPU offloading (offload N layers to GPU, rest on CPU).  
\- Speculative decoding support.  
\- Grammar-constrained generation (GBNF grammars for structured output).  
\- Server mode with OpenAI-compatible API.

**Weaknesses**:  
\- Single-user optimized (batching support exists but less sophisticated than vLLM).  
\- Lower throughput than vLLM for multi-user GPU serving.  
\- No PagedAttention (though memory-mapped KV-cache exists).

**Best for**: Single-user local inference, CPU-only machines, Apple Silicon Macs, mixed CPU+GPU setups, memory-constrained environments.

**Performance examples (2026-era hardware)**:  
\- Llama 3.1 8B Q4\_K\_M on M3 Max (48GB): ~50-70 tokens/sec generation.  
\- Llama 3.1 70B Q4\_K\_M on M3 Ultra (192GB): ~15-20 tokens/sec.  
\- Llama 3.1 8B Q4\_K\_M on RTX 4090: ~100-130 tokens/sec (full GPU offload).

### Ollama

**What it is**: A user-friendly wrapper around llama.cpp (and increasingly, other backends) that provides a Docker-like experience for running LLMs.

**Strengths**:  
\- Simplest setup: `ollama run llama3.1` and you’re running.  
\- Model library (pull pre-quantized models by name).  
\- Automatic GPU detection and offloading.  
\- REST API and growing ecosystem of GUI frontends (Open WebUI, etc.).  
\- Modelfile system for customization (system prompts, parameters, adapters).  
\- Concurrent request handling (multiplexing).  
\- Cross-platform (macOS, Linux, Windows).

**Weaknesses**:  
\- Inherits llama.cpp’s throughput limitations for multi-user serving.  
\- Less configurability than raw llama.cpp for power users.  
\- Slightly higher overhead than bare llama.cpp.  
\- Model format limited to GGUF.

**Best for**: Personal use, prototyping, developers wanting quick local LLM access, non-technical users.

### vLLM

**What it is**: A high-throughput serving engine designed for GPU-based production deployment.

**Strengths**:  
\- **PagedAttention**: Near-optimal GPU memory utilization.  
\- **Continuous batching**: Maximizes throughput under concurrent load.  
\- **Quantization support**: AWQ, GPTQ, FP8, and others.  
\- **Tensor parallelism**: Multi-GPU serving out of the box.  
\- **Speculative decoding**: Built-in support.  
\- **OpenAI-compatible API**: Drop-in replacement.  
\- **Structured output**: JSON schema constraints.  
\- **Prefix caching**: Shares KV-cache across requests with common prefixes.  
\- **LoRA serving**: Multiple LoRA adapters served simultaneously.  
\- **Highest throughput**: For GPU-based multi-user serving, vLLM leads.

**Weaknesses**:  
\- GPU-only (no CPU inference).  
\- Higher baseline resource requirements.  
\- More complex setup than Ollama.  
\- GGUF format not natively used (uses HuggingFace formats).

**Best for**: Production serving, multi-user scenarios, maximum GPU throughput, API serving.

**Performance examples**:  
\- Llama 3.1 8B FP16 on A100 80GB: ~2000-4000 tokens/sec aggregate throughput (many concurrent users).  
\- Llama 3.1 70B AWQ-4bit on 2x A100 (TP=2): ~500-1500 tokens/sec aggregate throughput.

### Other Notable Frameworks

**SGLang (2024-2026)**: Competitor to vLLM with RadixAttention (tree-based prefix caching), often matching or exceeding vLLM throughput. Strong for agentic workloads with complex prompt structures.

**TensorRT-LLM**: NVIDIA’s framework. Best absolute performance on NVIDIA hardware but complex setup and NVIDIA-only.

**ExLlamaV2**: Specialized for consumer GPU inference with GPTQ/EXL2 quantization. Very fast single-user GPU inference.

### Decision Matrix

| Scenario | Recommended | Why |
| --- | --- | --- |
| Casual local use, any hardware | Ollama | Easiest setup, good defaults |
| Maximum local quality, Mac | llama.cpp + Q5\_K\_M | Unified memory, high-quality quant |
| Maximum local speed, NVIDIA GPU | llama.cpp or ExLlamaV2 | Full GPU offload, optimized kernels |
| Multi-user production API | vLLM | PagedAttention, continuous batching, TP |
| High-throughput agentic workloads | SGLang | RadixAttention, prefix sharing |
| Constrained memory (8GB VRAM) | Ollama + small model Q4 | Auto-manages offloading |
| Serving 70B+ models | vLLM + TP | Multi-GPU handling, quantization |

* * *

## 8\. THE FASTEST LOCAL SETUP IN 2026

### For a single user with a modern NVIDIA GPU (e.g., RTX 4090 24GB):

1.  **Model choice**: Llama 3.1 8B (or Qwen 2.5 7B, Mistral 7B v0.3) in Q4\_K\_M GGUF.
2.  **Runtime**: llama.cpp with full GPU offload (`-ngl 99`), or Ollama for simplicity.
3.  **Expected performance**: ~100-130 tok/s generation, ~1000+ tok/s prompt processing.
4.  **Enable speculative decoding** with a Q8 0.5B draft model for an additional 1.5-2x speedup on generation.

### For a single user with Apple Silicon (e.g., M3 Max 48GB):

1.  **Model choice**: Llama 3.1 70B Q4\_K\_M (fits in ~40GB unified memory) or 8B Q6\_K for quality.
2.  **Runtime**: Ollama (uses llama.cpp Metal backend).
3.  **Expected performance**: 8B Q6\_K at ~60 tok/s; 70B Q4\_K\_M at ~15-20 tok/s.

### For multi-user API serving:

1.  **Framework**: vLLM with continuous batching, prefix caching enabled.
2.  **Quantization**: AWQ or FP8 (if H100/B200).
3.  **Hardware**: A100/H100 with TP=2 or TP=4 for 70B models.
4.  **Expected aggregate throughput**: 1000-5000 tok/s depending on concurrency and model size.

* * *

## 9\. COMBINED OPTIMIZATION STACK

The maximum-performance inference stack in 2026 layers multiple optimizations simultaneously:

`Layer 1 (Architecture):     MLA or GQA             → Reduces KV-cache at training time Layer 2 (Quantization):     FP8 or AWQ/GPTQ 4-bit  → Reduces weight memory 2-4x Layer 3 (Attention Kernel): FlashAttention-3 / FA-2 → 2-4x attention speedup Layer 4 (KV-Cache Mgmt):   PagedAttention + quant   → Near-zero waste, 2x capacity Layer 5 (Batching):         Continuous + chunked     → 2-10x throughput Layer 6 (Generation):       Speculative decoding     → 2-3x latency reduction Layer 7 (Parallelism):      TP + EP (for MoE)       → Scale beyond single GPU Layer 8 (Compilation):      torch.compile / CUDA graphs → Reduce kernel launch overhead`

Each layer is largely orthogonal — they compose multiplicatively. A well-optimized stack can achieve **10-50x** better throughput-per-dollar compared to a naive FP16 single-request implementation.

* * *

## 10\. KEY TRADE-OFFS SUMMARY

| Optimization | Speed Gain | Quality Impact | Complexity |
| --- | --- | --- | --- |
| FP8 quantization | 2x | Negligible (<0.1% perplexity) | Low |
| 4-bit weight quant (AWQ/GPTQ) | 3-4x memory, 1.5-2x speed | Minor (<1% perplexity) | Low |
| 2-3 bit quantization | 5-8x memory | Noticeable (3-10% perplexity) | Medium |
| FlashAttention-2/3 | 2-4x attention | None (exact) | Low (drop-in) |
| PagedAttention | 2-4x throughput | None | Low (use vLLM) |
| Continuous batching | 2-10x throughput | None | Low (use vLLM) |
| Speculative decoding | 2-3x latency | None (lossless variants) | Medium |
| KV-cache quantization (FP8) | 2x KV memory | Negligible | Low |
| KV-cache eviction | Infinite context | Lossy for evicted tokens | Medium |
| MLA | 5-13x KV reduction | None (trained with it) | High (architecture change) |
| Tensor parallelism | Linear scaling | None | Medium (need NVLink) |

* * *

## 11\. 2026 OUTLOOK

The frontier of inference optimization continues to push on several axes:

1.  **Sub-4-bit quantization becoming viable**: QuIP#, AQLM, and improved GGUF IQ methods make 2-3 bit practical for many workloads, especially when combined with sparse attention or MoE routing.
    
2.  **Hardware-software co-design**: Blackwell (B200) with FP4 tensor cores, 5th-gen NVLink, and massive HBM3e makes many software optimizations less necessary while enabling new ones. AMD MI300X with 192GB HBM3 offers an alternative high-memory option.
    
3.  **Mixture-of-Experts dominance**: MoE models (DeepSeek-V3, likely Llama 4, Mixtral successors) fundamentally change the optimization landscape — expert parallelism, selective expert loading, and expert caching become critical.
    
4.  **Compilation-first serving**: Ahead-of-time compilation of full model graphs (via torch.compile, XLA, or TensorRT) with static shapes and CUDA graph capture is becoming standard, reducing per-token overhead.
    
5.  **Disaggregated prefill and decode**: Architectures like DistServ separate prefill (compute-bound) onto compute-optimized hardware and decode (memory-bandwidth-bound) onto memory-optimized hardware, improving both latency and throughput.
    

* * *

This report covers the major inference optimization techniques as of 2026. The field moves rapidly, but the fundamental trade-offs — memory vs. compute, latency vs. throughput, quality vs. efficiency — remain the axes along which all optimizations operate. The practical recommendation is clear: use **vLLM or SGLang** for multi-user GPU serving with AWQ/FP8 quantization and continuous batching; use **Ollama (backed by llama.cpp)** for local single-user inference with GGUF quantization. Layer speculative decoding on top for latency-sensitive applications.
