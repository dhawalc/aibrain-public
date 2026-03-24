---
title: "AI Chip Design and Custom Silicon: Comprehensive Comparison Report (2026)"
description: "I’ll compile a comprehensive research report based on my knowledge of AI chip developments through early 2025, noting where information is confirmed versus projected."
date: "2026-03-16"
category: "AI Breakthroughs"
author: "QorSync AI Research Team"
readTime: "13 min read"
published: true
---

# AI Chip Design and Custom Silicon: Comprehensive Comparison Report (2026)

I’ll compile a comprehensive research report based on my knowledge of AI chip developments through early 2025, noting where information is confirmed versus projected.

* * *

## 1\. NVIDIA Blackwell Architecture (B200 / B300)

### B200 (Shipping since late 2024)

| Metric | Specification |
| --- | --- |
| **Process** | TSMC 4NP, dual-die design |
| **Transistors** | ~208 billion |
| **FP8 Performance** | 9 PFLOPS (per GB200 system, 2 GPUs + 1 Grace CPU) |
| **FP4 Performance** | 18 PFLOPS (per GB200 system) |
| **HBM3e Memory** | 192 GB per GPU |
| **Memory Bandwidth** | 8 TB/s per GPU |
| **TDP** | ~1000W per GPU |
| **NVLink 5** | 1.8 TB/s bidirectional |
| **Key Feature** | 2nd-gen Transformer Engine with FP4 support |
| **Availability** | Generally available in NVL72 rack-scale systems |

NVIDIA claimed a 4x training speedup and 30x inference speedup over H100 for large language models. The GB200 NVL72 rack integrates 72 GPUs and 36 Grace CPUs into a single liquid-cooled system with up to 13.5 TB of unified HBM3e memory.

### B300 (Announced GTC 2025)

| Metric | Specification |
| --- | --- |
| **HBM3e Memory** | 288 GB per GPU (up from 192 GB) |
| **Memory Bandwidth** | ~12 TB/s (estimated improvement) |
| **FP4 Performance** | Significant uplift over B200 |
| **Form Factor** | GB300 NVL72 rack-scale |
| **Availability** | Expected H2 2025 / early 2026 ramp |

The B300 is an enhanced Blackwell variant, not a new architecture. The key improvement is the move to higher-capacity HBM3e stacks (12-Hi), enabling 288 GB per GPU. Jensen Huang also previewed the **Vera Rubin** architecture (successor to Blackwell) at GTC 2025, expected in 2026-2027.

### Software Ecosystem

CUDA remains the dominant ecosystem. NVIDIA’s moat is not just hardware but the CUDA toolkit, cuDNN, TensorRT, TensorRT-LLM, Triton Inference Server, NeMo, and the broader ecosystem. Virtually all ML frameworks (PyTorch, JAX, etc.) have first-class CUDA support.

**Pricing**: B200 GPUs estimated at $30,000-$40,000 per unit; GB200 NVL72 racks reportedly $2-3 million+.

* * *

## 2\. AMD CDNA 4 / MI400 Series

### MI300X (Shipping, CDNA 3)

| Metric | Specification |
| --- | --- |
| **Process** | TSMC 5nm/6nm chiplet design |
| **HBM3 Memory** | 192 GB |
| **Memory Bandwidth** | 5.3 TB/s |
| **FP8 Performance** | 2.6 PFLOPS |
| **FP16 Performance** | 1.3 PFLOPS |
| **TDP** | 750W |
| **Interconnect** | Infinity Fabric |

The MI300X has gained significant traction with cloud providers (Microsoft Azure, Oracle Cloud) and has been adopted by several hyperscalers for inference workloads due to its large memory capacity.

### MI350 (Announced, CDNA 4 generation)

| Metric | Specification |
| --- | --- |
| **Process** | TSMC 3nm |
| **Expected Performance** | ~35x inference performance over MI300X (AMD’s claim for FP4/FP6) |
| **New data types** | FP4, FP6 support |
| **Availability** | Expected mid-2025 |

### MI400 (CDNA “Next”)

AMD has disclosed that an MI400 series is on the roadmap, expected to follow MI350. Details are sparse, but it is expected to leverage more advanced packaging and potentially HBM4.

**Estimated availability**: Late 2026 or 2027.

### Software Ecosystem

ROCm has improved substantially but still trails CUDA in maturity. PyTorch has official ROCm support. JAX support exists but is less mature. Key pain points remain in library compatibility, debugging tools, and third-party framework support. AMD has invested heavily in closing the gap, including hiring and open-source contributions.

**Pricing**: MI300X is priced competitively below the H100/B200, typically 20-30% less for comparable SKUs.

* * *

## 3\. Google TPU v6 (Trillium)

| Metric | Specification |
| --- | --- |
| **Generation** | TPU v6e (“Trillium”), announced mid-2024 |
| **Performance** | ~4.7x improvement in peak compute per chip over TPU v5e |
| **HBM** | Significant increase over v5e |
| **Interconnect** | ICI (Inter-Chip Interconnect) for pod-scale training |
| **Availability** | Google Cloud only |
| **Pod Scale** | Up to 256 chips per pod slice |

Google’s TPU strategy focuses on tight integration with its JAX/XLA software stack and Google Cloud infrastructure. TPUs are not sold as discrete chips but consumed as cloud services.

### TPU v6 (Full, non-“e” variant)

A full TPU v6 (beyond the efficiency-focused v6e) has been anticipated but details are limited in public disclosures. Google tends to deploy internally first (for Gemini model training) before making available on Cloud.

### Software Ecosystem

-   **JAX** is the primary framework, with XLA compilation
-   **PyTorch/XLA** provides PyTorch compatibility but adds complexity
-   **Vertex AI** integration for managed training/serving
-   The ecosystem is strong but Google Cloud-locked; no on-premise option

**Pricing**: Competitive on a $/FLOP basis for large-scale training when using committed use discounts. TPU v6e pricing is roughly $1.50-$3.00/chip/hour depending on region and commitment.

* * *

## 4\. Groq LPU (Language Processing Unit)

| Metric | Specification |
| --- | --- |
| **Architecture** | TSP (Tensor Streaming Processor), deterministic dataflow |
| **Process** | 14nm (first generation) |
| **SRAM** | 230 MB on-chip (no HBM) |
| **Key Advantage** | Ultra-low latency inference, deterministic execution |
| **Performance** | ~750 tokens/second per user for Llama-2 70B (demonstrated) |
| **Target** | Inference only (not training) |

Groq’s approach is architecturally unique: a fully deterministic, software-scheduled dataflow processor with no caches, no branch prediction, and no out-of-order execution. This yields extremely predictable, low-latency inference.

### GroqCloud

Groq operates a cloud inference service (GroqCloud) that has demonstrated best-in-class latency for LLM inference. They have served models like Llama 3, Mixtral, and Gemma.

### Limitations

-   **Inference only** – cannot train models
-   **Model size constrained** by SRAM capacity; very large models require multi-chip configurations
-   **14nm process** limits power efficiency compared to leading-edge nodes
-   **Limited availability** – primarily through GroqCloud API

Groq has announced next-generation chips on more advanced process nodes, which would address power efficiency concerns.

**Pricing**: GroqCloud API pricing has been very aggressive, sometimes 5-10x cheaper per token than competitors for supported models.

* * *

## 5\. Cerebras WSE-3 (Wafer-Scale Engine 3)

| Metric | Specification |
| --- | --- |
| **Die Size** | Full wafer (~46,225 mm²) |
| **Transistors** | 4 trillion |
| **Cores** | 900,000 AI-optimized cores |
| **On-chip SRAM** | 44 GB |
| **Memory Bandwidth** | 21 PB/s on-chip |
| **Process** | TSMC 5nm |
| **FP16 Performance** | ~125 PFLOPS (claimed) |
| **System** | CS-3 (with MemoryX and SwarmX) |

Cerebras takes the most radical approach: an entire wafer as a single chip. The WSE-3 eliminates off-chip memory bottlenecks by having 44 GB of on-chip SRAM with enormous aggregate bandwidth.

### Key Developments

-   **Cerebras Inference**: Launched cloud inference service demonstrating 1,800+ tokens/second for Llama 3.1 70B
-   **Training at scale**: Demonstrated training of models up to 100B+ parameters using MemoryX (external memory) and SwarmX (multi-system clustering)
-   **CS-3 System**: A single CS-3 replaces clusters of GPUs for many workloads
-   **IPO Plans**: Cerebras filed for IPO, indicating business traction

### Limitations

-   Extremely expensive per-system cost ($2-5 million estimated per CS-3)
-   Custom software stack (Cerebras SDK), though PyTorch compatibility has improved
-   Limited to Cerebras cloud or on-premise CS-3 systems
-   Yield and manufacturing complexity of wafer-scale chips

* * *

## 6\. Etched Sohu

| Metric | Specification |
| --- | --- |
| **Architecture** | ASIC purpose-built exclusively for Transformer inference |
| **Process** | TSMC 4nm |
| **Key Claim** | 500,000+ tokens/second for Llama 3 70B (8-chip server) |
| **On-chip Memory** | 144 GB HBM3e (per chip) |
| **Approach** | Hardcoded Transformer operations in silicon |

Etched is a startup that has taken the most aggressive specialization approach: burning the Transformer architecture directly into silicon, eliminating the overhead of general-purpose compute. The Sohu chip does one thing – Transformer inference – but does it at extreme throughput.

### Key Claims (as of announcements)

-   10x+ better performance/$ than NVIDIA B200 for Transformer inference
-   Supports any model that is a Transformer (various sizes)
-   8-chip Sohu server claimed to outperform 160 H100 GPUs

### Risks

-   **Architecture lock-in**: If the field moves beyond Transformers (e.g., state-space models, RWKV, next-gen architectures), Sohu becomes obsolete
-   **Startup risk**: Pre-revenue as of last public information
-   **Software ecosystem**: Nascent; must build tooling from scratch
-   **Availability**: Announced but limited shipping information

* * *

## 7\. MatX

| Metric | Detail |
| --- | --- |
| **Founded by** | Former Google TPU engineers |
| **Focus** | Custom AI inference accelerator |
| **Approach** | Highly efficient ASIC for LLM inference |
| **Status** | Stealth/early-stage as of last reports |

MatX has been relatively secretive. Founded by engineers from the Google TPU team, the company is building custom silicon optimized for large language model inference. Limited public specifications are available.

Key differentiator is reportedly extreme memory bandwidth efficiency and cost-optimized inference, targeting the growing demand for cheap, high-throughput LLM serving.

* * *

## 8\. Intel Gaudi 3

| Metric | Specification |
| --- | --- |
| **Process** | TSMC 5nm |
| **FP8 Performance** | 1,835 TFLOPS |
| **HBM2e Memory** | 128 GB |
| **Memory Bandwidth** | 3.7 TB/s |
| **TDP** | ~600W |
| **Ethernet Networking** | 24x 200GbE RoCE built-in |
| **Key Feature** | Native Ethernet networking (no proprietary interconnect) |

### Context

Intel acquired Habana Labs (Gaudi’s designer) in 2019. Gaudi 3 represents a significant leap from Gaudi 2 (roughly 2x FP8 performance and 1.5x memory bandwidth).

### Software Ecosystem

-   **Intel Gaudi Software Suite** with PyTorch integration
-   **Hugging Face Optimum Habana** for easy model deployment
-   Growing but significantly behind CUDA and even ROCm in breadth
-   Intel has struggled with software ecosystem adoption

### Market Position

-   Gaudi 3 targets price/performance: significantly cheaper than H100/B200
-   Adopted by some cloud providers (AWS “dl2” instances for Gaudi 2; Gaudi 3 expected to follow)
-   Intel’s AI accelerator division has faced strategic uncertainty, with reports of potential restructuring

**Pricing**: Gaudi 3 is priced aggressively, estimated at $15,000-$20,000 per chip, significantly below NVIDIA equivalents.

* * *

## 9\. Notable Startup Chips

| Company | Chip/Product | Approach | Status |
| --- | --- | --- | --- |
| **Tenstorrent** | Wormhole, Grayskull, Black Hole | RISC-V based AI accelerator, open-source philosophy | Shipping dev hardware; Jim Keller-led |
| **SambaNova** | SN40L (Cardinal) | Reconfigurable Dataflow Architecture | Available as cloud/on-prem service |
| **d-Matrix** | Corsair | Digital in-memory compute for inference | Early production |
| **Mythic** | M1076 | Analog compute for edge AI | Shipping for edge/embedded |
| **Graphcore** | IPU (Bow) | Massively parallel processor for AI | Acquired by SoftBank in 2024 |
| **Luminous/Lightmatter** | Envise | Photonic AI accelerator | Research/early commercial stage |
| **Rain AI** | NPU | Neuromorphic analog compute | Pre-production |
| **Positron AI** | (unnamed) | Inference-optimized ASIC | Early stage, founded by former Meta engineers |

### Tenstorrent (Noteworthy)

Led by legendary chip architect Jim Keller, Tenstorrent uses a RISC-V based approach with open-source tooling. Their roadmap includes advanced chips on 3nm+ nodes. They have secured significant funding and partnerships (Hyundai, Samsung). Their open-source ethos is a deliberate contrast to NVIDIA’s proprietary ecosystem.

* * *

## 10\. Comprehensive Comparison Matrix

| Chip | Peak TOPS (INT8/FP8) | Memory | Mem BW | TDP | Training | Inference | SW Ecosystem | Est. Price |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **NVIDIA B200** | ~9,000 (FP8) | 192 GB HBM3e | 8 TB/s | ~1000W | Yes | Yes | CUDA (gold standard) | $30-40K |
| **NVIDIA B300** | \>9,000 (FP8) | 288 GB HBM3e | ~12 TB/s | ~1000W+ | Yes | Yes | CUDA | $40-50K (est) |
| **AMD MI300X** | ~2,600 (FP8) | 192 GB HBM3 | 5.3 TB/s | 750W | Yes | Yes | ROCm (improving) | $20-25K |
| **AMD MI350** | TBD (~35x MI300X inf) | TBD | TBD | TBD | Yes | Yes | ROCm | TBD |
| **Google TPU v6e** | ~4.7x v5e | HBM (undisclosed) | High | N/A (cloud) | Yes | Yes | JAX/XLA | ~$2-3/hr (cloud) |
| **Groq LPU** | N/A (latency-opt) | 230 MB SRAM | N/A | ~300W (est) | No | Yes | Groq SDK | Cloud API only |
| **Cerebras WSE-3** | ~125,000 (FP16) | 44 GB SRAM | 21 PB/s on-chip | ~23 kW (system) | Yes | Yes | Cerebras SDK | $2-5M (system) |
| **Etched Sohu** | Claimed 10x B200 (Tx inf) | 144 GB HBM3e | TBD | TBD | No | Transformer only | Nascent | TBD |
| **Intel Gaudi 3** | ~1,835 (FP8) | 128 GB HBM2e | 3.7 TB/s | ~600W | Yes | Yes | Gaudi SW Suite | $15-20K |
| **Tenstorrent** | Varies by config | Varies | Varies | Low | Yes | Yes | Open-source RISC-V | Competitive |

* * *

## 11\. Key Trends and Analysis

### 1\. The Memory Wall is the Defining Challenge

Across all vendors, the limiting factor for LLM workloads is **memory capacity and bandwidth**, not raw compute. This explains why B300’s main improvement is memory (288 GB vs 192 GB), and why Cerebras and Groq emphasize on-chip SRAM. HBM4 (expected 2026) will be the next major enabler.

### 2\. Inference is Diverging from Training

Training remains dominated by NVIDIA (and to a lesser extent, Google TPUs and AMD). But inference – which represents the majority of production AI compute cost – is attracting specialized silicon (Groq, Etched, MatX, d-Matrix). The economics favor specialization because inference workloads are more predictable and can be optimized aggressively.

### 3\. NVIDIA’s Moat Remains Formidable but Not Unassailable

CUDA’s ecosystem advantage is worth years of head start. However:  
\- AMD’s ROCm is improving with major customer wins  
\- Google’s JAX/TPU stack is mature for those in Google Cloud  
\- PyTorch’s compiler stack (torch.compile, Triton language) is becoming more hardware-agnostic  
\- MLIR and OpenXLA are creating hardware abstraction layers

### 4\. The Rise of “Good Enough” Inference

For many production LLM serving workloads, the question is not “what is fastest” but “what is cheapest per token at acceptable latency.” This favors:  
\- Groq for latency-critical applications  
\- AMD MI300X for cost-sensitive GPU inference  
\- Custom ASICs (Etched, MatX) for high-volume serving  
\- Cerebras for batch throughput

### 5\. Chiplet and Advanced Packaging are Standard

AMD pioneered chiplets; now NVIDIA (B200 dual-die), Intel, and others use multi-die designs. TSMC’s CoWoS (Chip-on-Wafer-on-Substrate) packaging is the bottleneck, not fab capacity for leading-edge nodes.

### 6\. Sovereign AI and Geographic Diversification

Export controls on advanced AI chips (particularly to China) have created a market for “compliant” chips and spurred domestic chip development in China (Huawei Ascend 910B/C), Europe, and other regions.

* * *

## 12\. Recommendations by Use Case

| Use Case | Recommended | Rationale |
| --- | --- | --- |
| **Large-scale training (>100B params)** | NVIDIA B200/B300 or Google TPU v6 | Ecosystem maturity, scaling proven |
| **Cost-sensitive training** | AMD MI300X/MI350 | Lower $/FLOP, improving software |
| **Low-latency inference** | Groq LPU | Best-in-class latency |
| **High-throughput inference** | Cerebras CS-3 or Etched Sohu | Extreme throughput per system |
| **Cost-optimized inference** | AMD MI300X or Intel Gaudi 3 | Best $/token for GPU-based inference |
| **Edge / embedded AI** | Specialized edge chips | Power-constrained environments |
| **Maximum flexibility** | NVIDIA (any) | CUDA ecosystem, widest model support |

* * *

## Caveats

This report synthesizes information available through my knowledge cutoff (early-to-mid 2025). Several chips mentioned (MI400, B300, TPU v6 full, Etched Sohu shipping status, MatX details) may have had significant updates between then and March 2026. Performance claims from startups (particularly Etched and Groq next-gen) should be verified against independent benchmarks. Pricing information is approximate and subject to market conditions, volume discounts, and regional variation.
