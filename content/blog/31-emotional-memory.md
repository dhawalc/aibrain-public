---
title: "Emotional Memory in AI Agents: Sentiment-Tagged Episodic Recall and Its Impact on Decision-Making"
description: "Standard LLM-based agents suffer from what the Sentipolis team (CMU/U-Tokyo/RIKEN, January 2026) terms “emotional amnesia”: they fail to carry emotional reactions across time...."
date: "2026-01-13"
category: "AI Agent Memory Systems"
author: "QorSync AI Research Team"
readTime: "10 min read"
published: true
---

# Emotional Memory in AI Agents: Sentiment-Tagged Episodic Recall and Its Impact on Decision-Making

## A Comprehensive Research Report (2024-2026)

* * *

## 1\. The Core Problem: Emotional Amnesia in AI Agents

Standard LLM-based agents suffer from what the Sentipolis team (CMU/U-Tokyo/RIKEN, January 2026) terms **“emotional amnesia”**: they fail to carry emotional reactions across time. An agent insulted in turn 3 shows no lingering irritability in turn 30; repeated positive interactions with a partner accumulate no warmth. This fundamentally breaks the behavioral realism required for realistic social simulation, long-horizon planning, and personalized interaction.

The problem arises because most agent memory systems treat all memories as emotionally neutral factual records. The MemEmo benchmark (February 2026) confirmed this empirically: when six leading memory platforms (Mem0, Letta, MemOS, MemoBase, Mirix, Zep) were evaluated on emotional memory tasks, **none achieved robust performance across extraction, updating, and emotional question-answering**. Mem0’s emotion update accuracy was effectively zero (0.68% on the large dataset). Even the best system (Mirix) scored only 0.5952 overall on the medium dataset.

* * *

## 2\. Theoretical Foundations: Why Emotional Tagging Matters

### 2.1 Neuroscientific Grounding

The design rationale for emotional memory in AI draws directly from neuroscience. Amygdala activation during memory encoding strongly correlates with subsequent recall performance in humans. Emotionally aroused experiences are preferentially consolidated during sleep and recalled more readily. The key insight: **emotional arousal, rather than valence alone, is the primary factor determining which experiences persist in long-term memory**.

This maps to a computational principle: not all information deserves equal storage priority. Emotional tags serve as compressed summaries that persist even when associated episodic details degrade – strong emotional markers survive as **decision-making heuristics** long after contextual specifics fade (Borotschnig, “Emotions in Artificial Intelligence,” May 2025).

### 2.2 Emotion as Adaptive Computation

The survey “Artificial Emotion” (August 2025) frames emotions not as luxuries but as computational necessities, citing Minsky’s formulation: “the question is not whether intelligent machines can have any emotions, but whether machines can be intelligent without any emotion.” The argument is that emotions function as:

-   **Satisficing heuristics** that bypass full situational modeling for fast decisions under uncertainty
-   **Action preconditions** that prime behaviors (fear biases avoidance; joy biases approach) without exhaustive search
-   **Goal re-ranking signals** that adjust exploration-exploitation trade-offs based on internal state
-   **Memory consolidation gates** that determine what experiences deserve durable storage

Yin et al. (2025) extend this through a **teleology-driven affective computing framework**, proposing that affect is fundamentally goal-directed: causal modeling and meta-reinforcement learning let agents infer and adapt to affective concerns over extended timescales.

* * *

## 3\. Architectures: How Emotional Memory Is Being Implemented

### 3.1 ITCMA-S: Consciousness-Based Emotional Memory (Zhang et al., 2024)

The Internal Time-Consciousness Machine Architecture with Social extensions implements a **PAD (Pleasure-Arousal-Dominance)** emotional model tightly integrated with episodic memory. Key mechanisms:

-   **Pleasure (P)**: computed as `tanh(desire) - tanh(pain)`, mapping task rewards/penalties
-   **Arousal (A)**: measures perceptual change intensity between predicted and actual observations
-   **Dominance (D)**: compares predicted versus actual environmental control
-   **Drive equation**: `d^t = d^(t-1) + E * W`, where emotional vector E and weight matrix W combine via Hadamard product to select actions

Emotions emerge from comparing **protention** (predicted future) against **primal impression** (current perception), and emotions retrieved from similar historical episodes refine the agent’s current emotional state before action selection.

**Performance**: 100% task completion on Alfworld (trained), 96% untrained, versus 91% for fine-tuned GPT-2 baselines. Critically, **ablation without the emotion/drive module dropped performance to 60 +/- 16%** – demonstrating that the emotional component accounts for roughly 36-40 percentage points of task success.

### 3.2 Sentipolis: Emotion-Memory Coupling for Social Simulation (January 2026)

Sentipolis implements three interlocking mechanisms:

**Dual-speed emotion dynamics**:  
\- Fast updates after each conversational turn for immediate emotional reactions  
\- Slow updates during reflection phases (triggered when cumulative poignancy exceeds 150), integrating retrieved memories for longer-horizon mood shifts  
\- Exponential decay with 120-minute half-life: `s(t+dt) = s(t) * 2^(-dt/T_half)`

**Emotion-memory coupling**: When memories are created, they are tagged with the agent’s current PAD state. During retrieval, these emotion tags resurface affectively relevant experiences, ensuring emotionally salient encounters preferentially influence future behavior.

**Semantic enrichment**: Rather than exposing raw PAD coordinates to the LLM, the system performs k-nearest-neighbor matching against 264,705 human PAD datapoints from the MSP-Podcast Corpus, mapping continuous states to categorical emotion labels and generating vivid descriptions for prompting.

**Performance results**:  
| Metric | Improvement |  
|--------|------------|  
| Emotional continuity | +150-222% |  
| Communication quality | +4-70% |  
| Empathy | +20-33% (high-capacity models) |  
| Believability | +35-85% (high-capacity models) |

A critical finding: **believability increases for higher-capacity models but can drop for smaller ones** (-7-26% for GPT-4o-mini), suggesting emotional statefulness requires sufficient model capacity to modulate appropriately rather than over-express.

Network-level analysis showed weighted reciprocity >0.87, community modularity of ~0.22, and temporal stability (NMI) >0.75 – characteristics of human social networks emerging without explicit enforcement.

### 3.3 Self-Reflective Emotional RAG

Referenced in the “Artificial Emotion” survey, this system assigns autobiographical memories **both semantic vectors and 128-dimensional emotion embeddings**, enabling emotion-weighted retrieval. **Performance jumped from 0.375 to 0.500 accuracy on behavioral metrics** – a 33% improvement from adding emotional dimensions to retrieval.

### 3.4 CraniMem: Neurocognitive Gated Memory (March 2026)

CraniMem computes utility scores as: `BaseUtility = 1/3 * (Importance + Surprise + Emotion)`

The RAS-inspired gating mechanism filters inputs by semantic relevance to agent goals before they reach memory. High-utility traces undergo consolidation into a knowledge graph; low-utility items are pruned.

**Benchmark results** (HotpotQA with Qwen2.5-7B): F1=0.312 (CraniMem) vs. 0.198 (Mem0) vs. 0.068 (Vanilla RAG). Under noise injection, CraniMem’s performance drop was only 0.011 versus 0.027 for Vanilla RAG – demonstrating that utility-gated memory (including emotional signals) provides robust distraction resistance.

### 3.5 SNARC: Salience-Gated Memory for Practical Agent Systems

SNARC implements a five-dimensional salience scoring system operating in under 10ms without LLM invocation:

-   **Surprise**: tool transition frequency analysis
-   **Novelty**: seen-before set lookups
-   **Arousal**: error/warning keyword detection
-   **Reward**: success/build/test signal detection
-   **Conflict**: recent result contradiction checks

Architecture: Tier 0 (last 50 observations, FIFO) -> Tier 1 (salience-gated, 7-day decay) -> Tier 2 (consolidated patterns, 0.05/day decay) -> Tier 3 (human-confirmed, permanent). The design philosophy: “you don’t remember every step, but you remember the one where you tripped.”

### 3.6 Google Titans: Surprise as Memory Signal (January 2025)

While not explicitly an “emotional” system, Titans implements the same computational principle via a **surprise metric**: the gradient of the neural network with respect to input in associative memory loss. High-surprise inputs trigger prioritized storage; routine inputs are discarded.

A **momentum mechanism** balances momentary surprise with past surprise context, ensuring contextually relevant subsequent tokens are captured even if individually unsurprising.

**Performance**: outperformed all baselines including GPT-4 on BABILong benchmarks despite far fewer parameters, scaling to 2M+ token context windows.

* * *

## 4\. The Emotion-Memory Processing Pipeline

Synthesizing across the architectures above, a general pipeline emerges:

**Stage 1 – Appraisal and Tagging**: Incoming experiences are appraised along emotional dimensions (valence, arousal, surprise, importance). This can be done via LLM scoring (CraniMem), heuristic keyword detection (SNARC), PAD computation from goal-state discrepancy (ITCMA-S), or gradient-based surprise (Titans).

**Stage 2 – Gated Storage**: Experiences exceeding salience thresholds are written to persistent memory with their emotional tags. High-valence events go to slow-decay buffers; low-salience traces fade quickly. This creates the asymmetric retention expected from affective cognition.

**Stage 3 – Emotion-Weighted Retrieval**: When current context requires memory access, retrieval combines semantic similarity with emotional resonance. Sentipolis re-surfaces emotionally tagged memories; Self-Reflective Emotional RAG uses 128-dimensional emotion embeddings alongside semantic vectors.

**Stage 4 – Emotional Fusion**: Retrieved historical emotions are fused with current need-based emotions to produce an integrated emotional state. The pseudocode from Borotschnig (2025): `CompleteSituation -> RetrieveMostSimilarFromHistory -> RetrieveEmotionTags -> FuseEmotions`.

**Stage 5 – Emotion-Modulated Action**: The fused emotional state modulates action selection – fear biases avoidance, anticipation biases exploration, frustration triggers strategy switching.

* * *

## 5\. Quantitative Evidence: Does Emotional Tagging Improve Performance?

| System | Metric | Baseline | With Emotion | Improvement |
| --- | --- | --- | --- | --- |
| ITCMA-S | Task completion (Alfworld) | 60% (no drive) | 96-100% | +36-40pp |
| Sentipolis | Emotional continuity | Baseline | +150-222% | Dramatic |
| Sentipolis | Believability (GPT-5.2) | Baseline | +35-85% | Substantial |
| Self-Reflective Emotional RAG | Behavioral accuracy | 0.375 | 0.500 | +33% |
| CraniMem | F1 (noisy HotpotQA) | 0.068 (RAG) / 0.198 (Mem0) | 0.312 | +58-359% |
| Titans | BABILong reasoning | GPT-4 baselines | Outperformed all | With fewer params |

The ITCMA-S ablation is the most compelling single data point: removing the emotion module from an otherwise identical architecture reduced task completion by ~40 percentage points, demonstrating that emotional drive is not mere decoration but a core computational mechanism.

* * *

## 6\. The MemEmo Benchmark: Current State of the Art (February 2026)

The MemEmo benchmark represents the first systematic evaluation of emotional memory capabilities. Its HLME framework tests three dimensions:

-   **Emotional Information Extraction (EIE)**: classification accuracy, intensity measurement, slot extraction F1
-   **Emotional Memory Update (EMU)**: update decision accuracy, intensity delta tracking, memory stability score
-   **Emotional Question Answering (EQA)**: QA accuracy on historical emotional states, evidence grounding F1

**Key findings across six systems**:  
\- Best overall: Mirix (0.5952 medium / 0.4633 large)  
\- Worst overall: Mem0 (0.3574 medium / 0.3836 large)  
\- No system achieved robust performance across all three tasks  
\- Mem0 operates in effectively “read-only or append-only mode” for emotions (0.68% update accuracy)  
\- MemoBase’s aggressive compression produces a memory stability score of just 0.37 (vs. 0.98 for Mirix)  
\- Systems universally struggle to track emotionally associated events from the distant past

The benchmark reveals that **emotional memory remains a largely unsolved problem in production agent memory systems**, despite its demonstrated importance for agent performance.

* * *

## 7\. Open Challenges and Research Frontiers

**Capacity-dependent emotion modulation**: Sentipolis showed that smaller models over-express emotions rather than modulating them appropriately, reducing believability. Emotional memory architectures may require minimum model capacity thresholds.

**Emotion-norm tension**: Emotion-aware agents in Sentipolis showed mildly reduced adherence to social norms – a “human-like tension between emotion-driven behavior and rule compliance” that mirrors real human social dynamics but poses alignment challenges.

**Bounded emotional architecture**: The “Artificial Emotion” survey advocates preserving emergent affect within explicit safety constraints – transparent emotion mechanisms that prevent user deception while enabling genuine adaptive benefit.

**Computational overhead**: CraniMem required 112.4 seconds per turn versus Mem0’s 10.4 seconds. The emotion-processing pipeline adds substantial latency that must be addressed for production deployment.

**Functional versus phenomenal emotion**: The field remains divided on whether agents need genuine subjective experience or merely functional analogs. The emerging consensus (as expressed in the 2025 “Artificial Emotion” survey) is that “bounded emotional architecture” – functional emotion without claims to phenomenal experience – is both achievable and sufficient for most applications.

**Missing benchmarks**: MemEmo is the first emotional memory benchmark (February 2026), indicating how nascent this evaluation landscape is. Comprehensive multi-modal, multi-session emotional memory benchmarks are urgently needed.

* * *

## 8\. Practical Implementation Guidance

For practitioners looking to add emotional memory to agent systems today:

1.  **Start with salience gating**: Even simple surprise/arousal heuristics (like SNARC’s 10ms scoring) dramatically improve memory quality by filtering routine events.
    
2.  **Tag memories with PAD or dimensional emotion vectors**: Sentipolis demonstrated that continuous PAD states with semantic enrichment outperform raw numeric coordinates.
    
3.  **Implement dual-speed dynamics**: Fast emotional reactions per turn plus slow mood integration during reflection phases produces the most naturalistic behavior.
    
4.  **Use emotion-weighted retrieval**: Adding emotion embeddings alongside semantic vectors (as in Self-Reflective Emotional RAG) provides a 33%+ improvement with modest implementation cost.
    
5.  **Apply exponential decay**: Emotional states should fade toward neutrality over time (Sentipolis uses 120-minute half-life), preventing emotional “lock-in.”
    
6.  **Ensure sufficient model capacity**: Emotional statefulness improves performance for capable models but can degrade it for smaller ones.
    

* * *

Sources:  
\- [Emotions in Artificial Intelligence (Borotschnig, May 2025)](https://arxiv.org/html/2505.01462v2)  
\- [Artificial Emotion: Theories and Debates (August 2025)](https://arxiv.org/html/2508.10286v2)  
\- [Sentipolis: Emotion-Aware Agents for Social Simulations (January 2026)](https://arxiv.org/abs/2601.18027)  
\- [MemEmo: Evaluating Emotion in Memory Systems of Agents (February 2026)](https://arxiv.org/html/2602.23944)  
\- [CraniMem: Cranial Inspired Gated and Bounded Memory (March 2026)](https://arxiv.org/abs/2603.15642)  
\- [Memory in the Age of AI Agents (December 2025)](https://arxiv.org/abs/2512.13564)  
\- [AI Meets Brain: Memory Systems Survey (December 2025)](https://arxiv.org/html/2512.23343v1)  
\- [ITCMA: Generative Agent Based on Computational Consciousness (March 2024)](https://arxiv.org/html/2403.20097v2)  
\- [A-MEM: Agentic Memory for LLM Agents (February 2025)](https://arxiv.org/abs/2502.12110)  
\- [Titans: Learning to Memorize at Test Time (January 2025)](https://arxiv.org/abs/2501.00663)  
\- [Titans + MIRAS: Helping AI Have Long-Term Memory (Google Research Blog)](https://research.google/blog/titans-miras-helping-ai-have-long-term-memory/)  
\- [Enhancing Memory Retrieval via LLM-Trained Cross Attention Networks (Frontiers, 2025)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1591618/full)  
\- [Human-Like Remembering and Forgetting in LLM Agents (HAI 2024)](https://dl.acm.org/doi/10.1145/3765766.3765803)  
\- [SNARC: Salience-Gated Memory for Claude Code](https://github.com/dp-web4/snarc)  
\- [Agent Memory Paper List (Survey Companion)](https://github.com/Shichun-Liu/Agent-Memory-Paper-List)  
\- [Survey on Memory Mechanism of LLM-based Agents (ACM TOIS)](https://dl.acm.org/doi/10.1145/3748302)  
\- [Mem0: Production-Ready AI Agents with Long-Term Memory](https://arxiv.org/abs/2504.19413)  
\- [Emotions in the Loop: Affective Computing for Emotional Support (May 2025)](https://arxiv.org/html/2505.01542v1)  
\- [Retrieval-Augmented Emotion Reasoning (ACL 2025)](https://aclanthology.org/2025.findings-acl.590.pdf)
