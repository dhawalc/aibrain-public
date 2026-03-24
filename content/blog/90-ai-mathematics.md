---
title: "AI for Mathematics: 2025-2026 Comprehensive Research Report"
description: "AlphaProof, announced in January 2025 alongside AlphaGeometry 2, represented a landmark achievement in AI mathematics. At the 2024 International Mathematical Olympiad (IMO),..."
date: "2026-03-14"
category: "AI Breakthroughs"
author: "QorSync AI Research Team"
readTime: "9 min read"
published: true
---

# AI for Mathematics: 2025-2026 Comprehensive Research Report

## 1\. AlphaProof (Google DeepMind)

### IMO 2024 Breakthrough

AlphaProof, announced in January 2025 alongside AlphaGeometry 2, represented a landmark achievement in AI mathematics. At the **2024 International Mathematical Olympiad (IMO)**, the combined AlphaProof + AlphaGeometry 2 system solved **4 out of 6 problems**, earning **28 out of 42 points** — equivalent to a **silver medal** performance, just one point shy of gold.

AlphaProof solved two algebra problems and one number theory problem by translating informal mathematical statements into the **Lean 4** formal language and then searching for proofs. Notably, it solved **Problem 6** (the hardest problem on the exam, which only 5 human contestants solved), though it required extended compute time (up to 3 days on some problems).

### Architecture

AlphaProof couples a **Gemini-based language model** (for translating natural language math into formal statements) with an **AlphaZero-style reinforcement learning engine** that searches over proof steps in Lean 4. The system was trained on a massive corpus of formalized mathematics and improved through self-play, generating and verifying millions of proofs. This is significant because it introduced **reinforcement learning from proof verification** — the formal verifier provides a ground-truth reward signal, eliminating hallucination.

### IMO 2025

At the **2025 IMO in Brisbane, Australia** (July 2025), DeepMind entered an updated system. Reports indicate the system achieved **gold medal performance**, solving 5 of 6 problems. This represented a major step forward from the 2024 silver medal, and it was the first time an AI system matched top human competitors at the IMO. The remaining unsolved problem was a combinatorics question — historically a weak area for formal proof search systems.

* * *

## 2\. Lean-Based Theorem Proving

### Lean 4 as the Dominant Formal Language

By 2025, **Lean 4** had established itself as the dominant language for AI-assisted formal mathematics, overtaking Coq, Isabelle, and other proof assistants in terms of AI research activity. Key reasons:

-   **Mathlib4**: The community-maintained mathematical library surpassed **150,000 formalized theorems** by early 2026, covering undergraduate and much graduate-level mathematics.
-   **Tactic mode**: Lean’s tactic framework is naturally suited to LLM-based proof step generation.
-   **Tooling**: The Language Server Protocol integration and VS Code plugin made human-AI collaboration seamless.

### LeanDojo and ReProver

**LeanDojo** (from Caltech/CMU) provided an open-source framework for training neural theorem provers on Lean. Its **ReProver** model demonstrated that relatively modest transformer models, when given access to Lean’s type-checking infrastructure, could prove a meaningful fraction of Mathlib theorems. By late 2025, ReProver-based systems could close approximately **60% of held-out Mathlib goals** — a significant advance from the ~30% benchmarks of 2023.

### Notable Formal Verification Projects

-   **Terence Tao’s PFR Project**: The formalization of the Polynomial Freiman-Ruzsa conjecture (proved by Tao et al. in 2023) was completed in Lean 4 with significant AI assistance for “boring lemma” steps. This became a template for human-AI collaborative formalization.
-   **FLT Regular Primes**: Progress continued on formalizing Fermat’s Last Theorem for regular primes in Lean 4, with AI tools handling routine algebraic manipulations.
-   **Sphere Eversion**: The formalization of sphere eversion was completed, demonstrating AI’s ability to handle topological arguments.

* * *

## 3\. Mathematical Reasoning Models (LLMs)

### Frontier Model Performance

The major LLM families made substantial advances in mathematical reasoning:

-   **OpenAI o1 and o3**: The o1 model (released late 2024) and o3 (early 2025) introduced **chain-of-thought at test time** (inference-time compute scaling). On the **MATH benchmark**, o1 achieved ~94% and o3 pushed beyond 96%. On the **2024 AMC/AIME**, o3 scored at approximately the 99th percentile of human test-takers.
-   **OpenAI o3-mini and o4-mini**: Smaller reasoning models that maintained strong math performance at lower cost. o4-mini (2025) achieved ~93% on MATH.
-   **Claude 3.5 Opus, Claude Sonnet 4, Claude Opus 4**: Anthropic’s models showed strong mathematical reasoning, with Claude Opus 4 (2025) reaching ~92% on MATH and demonstrating improved ability to produce multi-step proofs.
-   **Gemini 2.0 and 2.5 Pro**: Google’s models, benefiting from integration with formal tools, achieved competitive MATH scores and demonstrated novel capabilities in “tool-integrated reasoning” where the model calls symbolic math engines mid-generation.
-   **DeepSeek-R1 and DeepSeek-V3**: The Chinese lab’s open-weight models achieved remarkable math performance, with DeepSeek-R1 reaching ~97% on MATH, rivaling closed-source models. DeepSeek-R1 used large-scale reinforcement learning on reasoning tasks.

### FrontierMath Benchmark

Epoch AI’s **FrontierMath** benchmark (released late 2024) provided hundreds of original, research-level mathematics problems across number theory, algebra, analysis, and combinatorics. As of early 2025:  
\- Frontier models solved only **~2-5%** of FrontierMath problems.  
\- By early 2026, with reasoning models (o3, Gemini 2.5 Pro with extended thinking), this rose to an estimated **~10-25%** on various subsets.  
\- This benchmark revealed that while AI excels at competition-level math, **research-level mathematics remains largely unsolved** by current systems.

### MathArena and Competition Benchmarks

The **MathArena** project tracked AI performance on live math competitions. By early 2026:  
\- Top reasoning models (o3, DeepSeek-R1) consistently achieved **AIME qualifier** level performance.  
\- On Putnam problems, AI systems could solve approximately 3-4 out of 12 problems, roughly equivalent to a median participant.

* * *

## 4\. Novel Theorem Proving by AI

### Has AI Proven Genuinely Novel Theorems?

**Yes, but with important caveats.** Several milestones:

1.  **AlphaProof’s IMO Solutions (2024-2025)**: While IMO problems are known to have solutions, AlphaProof generated proofs that were **novel in their proof strategy** — the system found approaches that differed from the official solutions and, in some cases, were considered elegant by mathematicians.
    
2.  **FunSearch (DeepMind, 2024)**: Published in Nature, FunSearch used LLMs in an evolutionary loop to discover new solutions to the **cap set problem** in extremal combinatorics. It found constructions that **exceeded the best known human results** for certain parameter ranges. This was arguably the first case of an LLM contributing to genuinely new mathematical knowledge published in a top journal.
    
3.  **Automated Conjecture Generation**: Several systems demonstrated the ability to generate and then prove novel (if minor) lemmas:  
    \- **LeanAgent** (2025): An autonomous system that explored Lean’s Mathlib, identified gaps, formulated conjectures, and proved novel lemmas that were accepted into Mathlib. These were mostly “utility lemmas” rather than deep results, but they were genuinely new.  
    \- **MCTS-based conjecture systems**: Systems using Monte Carlo Tree Search over algebraic structures generated novel identities in combinatorics and algebra, some of which were verified and published.
    
4.  **Knot Theory Results**: In 2024-2025, AI systems (building on DeepMind’s earlier Nature 2022 work with Davies et al.) discovered new relationships between knot invariants. Some of these constituted genuinely novel mathematical insights, subsequently verified by human mathematicians and published.
    
5.  **AI-Assisted Proofs in Published Papers**: By 2025-2026, a growing number of published mathematics papers acknowledged AI assistance. While the AI was not the sole author, it contributed proof steps, found counterexamples, or verified complex calculations that humans found intractable to check manually.
    

* * *

## 5\. Formal Verification

### State of the Art

Formal verification using AI advanced significantly:

-   **Autoformalization**: The dream of automatically translating informal mathematics (textbooks, papers) into formal Lean/Coq code made real progress. Google’s systems and open-source projects could autoformalize undergraduate-level proofs with ~70-80% accuracy (measured by compilability), though research-level mathematics remained challenging.
    
-   **Draft-Sketch-Prove Paradigm**: The most effective approach by 2025-2026 was a pipeline: (1) LLM generates an informal proof sketch, (2) a translation model converts to formal Lean, (3) a tactic-level prover fills gaps, (4) Lean’s kernel verifies the result. This “best of both worlds” approach leveraged LLM creativity and formal rigor.
    
-   **Industrial Adoption**: Beyond pure mathematics, formal verification with AI assistance saw adoption in:
    
-   **Cryptography**: Verifying correctness of cryptographic protocol implementations.
-   **Software verification**: Amazon, Microsoft, and others used AI-assisted formal methods for critical systems.
-   **Hardware verification**: Chip designers used AI-powered formal tools to verify circuit designs.

### Key Tools

-   **LeanCopilot**: An AI assistant within the Lean 4 IDE that suggests next tactic steps, proves subgoals, and searches for relevant lemmas. By 2025, it could close ~40-50% of routine proof obligations automatically.
-   **Sagredo** (proposed/prototyped): A conversational proof assistant that maintains dialogue with mathematicians, asking clarifying questions and suggesting proof directions.

* * *

## 6\. IMO Performance Timeline

| Year | System | Result | Notes |
| --- | --- | --- | --- |
| 2019 | N/A | Baseline | IMO Grand Challenge proposed |
| 2022 | Various | ~0-1 problems | Early neural provers |
| 2024 | AlphaProof + AlphaGeometry 2 | **4/6 (Silver medal, 28/42 pts)** | First medal-level AI performance |
| 2025 | AlphaProof (updated) | **5/6 (Gold medal level)** | Matched top human competitors |

The **IMO Grand Challenge** — to build an AI that wins gold at the IMO — was effectively achieved in 2025, roughly 5-7 years ahead of most expert predictions from 2019.

* * *

## 7\. Automated Conjecture Generation

Several notable systems emerged:

-   **FunSearch** (DeepMind): Used LLMs + evolutionary search to find new mathematical constructions. Extended beyond cap sets to bin packing and other optimization problems.
-   **Ramanujan Machine** (Technion): Continued generating conjectured formulas for mathematical constants, with several subsequently proved.
-   **AI Mathematician** (various academic groups): Systems that alternate between conjecture generation (pattern-finding over mathematical data) and conjecture proving (formal verification). By 2025, these systems produced novel but modest results — new combinatorial identities, polynomial inequalities, and sequence relationships.
-   **GNoME-inspired approaches**: Borrowing from materials science (where DeepMind’s GNoME predicted novel crystals), similar generate-and-filter pipelines were applied to mathematical structures.

* * *

## 8\. Key Challenges and Limitations (as of early 2026)

1.  **Research-level mathematics remains hard**: FrontierMath shows that original, open-ended mathematical research is far beyond current AI. Solving known competition problems differs fundamentally from posing and solving new research questions.
    
2.  **Combinatorics gap**: AI systems consistently struggle with combinatorics, which requires creative construction rather than algebraic manipulation. This was the weak point at both IMO 2024 and 2025.
    
3.  **Formalization bottleneck**: Only a small fraction of published mathematics has been formalized, limiting training data for formal proof systems.
    
4.  **Hallucination in informal reasoning**: LLMs still produce plausible-sounding but incorrect proofs in informal settings. Formal verification catches these, but adds computational cost.
    
5.  **Interpretability**: AI-generated proofs, especially from RL-based systems, can be correct but opaque — offering little mathematical insight.
    

* * *

## 9\. Summary of Notable Achievements

| Achievement | System | Date | Significance |
| --- | --- | --- | --- |
| IMO Silver medal | AlphaProof | Jul 2024 | First medal-level AI at IMO |
| Novel cap set constructions | FunSearch | Jan 2024 (Nature) | First LLM contribution to new math published in Nature |
| IMO Gold medal level | AlphaProof (v2) | Jul 2025 | Matched top human competitors |
| MATH benchmark >96% | o3, DeepSeek-R1 | 2025 | Near-saturation of standard benchmarks |
| Novel Mathlib lemmas | LeanAgent | 2025 | Autonomous discovery and formalization |
| \>150K formalized theorems | Mathlib4 community | 2025-2026 | Growing foundation for AI training |
| FrontierMath ~10-25% | o3, Gemini 2.5 | Early 2026 | Research-level math still largely unsolved |

* * *

## 10\. Outlook

The period 2025-2026 established that AI systems can **match top human competitors on well-defined mathematical problems** (competition math, formalization of known results) and can **contribute modestly to new mathematical knowledge** (novel constructions, utility lemmas, conjecture generation). However, deep, creative mathematical research — formulating new theories, identifying important conjectures, and producing proofs that advance human understanding — remains a predominantly human activity. The most promising near-term paradigm is **human-AI collaboration**, where mathematicians use AI tools to explore, verify, and formalize, while providing the conceptual direction and mathematical taste that AI currently lacks.
