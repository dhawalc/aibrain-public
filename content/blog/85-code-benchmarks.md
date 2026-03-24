---
title: "Code Generation Model Benchmarks: State of the Art (as of early-mid 2025)"
description: "My training data has a cutoff of approximately May 2025. I do not have access to live internet or real-time leaderboards. Everything below reflects the landscape as of that..."
date: "2026-03-09"
category: "AI Breakthroughs"
author: "QorSync AI Research Team"
readTime: "10 min read"
published: true
---

# Code Generation Model Benchmarks: State of the Art (as of early-mid 2025)

## Important Note on Data Recency

My training data has a cutoff of approximately May 2025. I do not have access to live internet or real-time leaderboards. Everything below reflects the landscape as of that cutoff. For the very latest numbers (late 2025 through March 2026), you should consult the live leaderboards directly (links provided at the end).

* * *

## 1\. SWE-Bench Family

SWE-Bench evaluates models on real GitHub issues from popular Python repositories, requiring models to generate patches that pass existing test suites.

### SWE-Bench Full

The original dataset of ~2,294 tasks. Historically very difficult, with early agents scoring in single digits.

### SWE-Bench Lite

A curated subset of 300 tasks designed to be more tractable and reduce noise.

### SWE-Bench Verified

A human-validated subset of ~500 tasks introduced in late 2024 to address concerns about ambiguous or under-specified problems in the original set.

**Leading Results (as of ~Q1-Q2 2025):**

| System / Model | SWE-Bench Verified | SWE-Bench Lite | Notes |
| --- | --- | --- | --- |
| Claude 3.5 Sonnet (via coding agents) | ~49-53% | ~45-50% | With agentic scaffolding (e.g., SWE-agent, Aider) |
| Claude 3.7 Sonnet | ~55-62% | ~50-55% | Significant jump with extended thinking |
| OpenAI o1 / o3 variants | ~48-55% | ~45-50% | Strong with chain-of-thought reasoning |
| GPT-4o | ~38-45% | ~35-42% | Solid baseline but surpassed by reasoning models |
| Gemini 2.5 Pro | ~55-65% | ~50-55% | Google’s strongest coding model as of early 2025 |
| DeepSeek-V3 / R1 | ~42-52% | ~40-48% | Open-weight leader; R1 with reasoning stronger |

**Key Trends:**  
\- Agentic scaffolding matters enormously. The same base model can vary by 15-25 percentage points depending on the agent framework (SWE-agent, Moatless, Agentless, OpenHands, etc.).  
\- The “verified” split became the de facto standard after concerns that Lite and Full included many ambiguous or impossible tasks.  
\- Top systems crossed the 60% mark on Verified by early 2025, up from ~13% when SWE-Bench launched in late 2023.

* * *

## 2\. HumanEval and HumanEval+

HumanEval (164 Python function-completion problems, introduced by OpenAI in 2021) is now largely **saturated** as a discriminative benchmark.

**Approximate Scores (pass@1, as of early 2025):**

| Model | HumanEval | HumanEval+ |
| --- | --- | --- |
| Claude 3.7 Sonnet | ~93-95% | ~87-90% |
| GPT-4o | ~90-92% | ~85-88% |
| Gemini 2.5 Pro | ~92-95% | ~88-91% |
| DeepSeek-V3 | ~88-90% | ~82-85% |
| DeepSeek-R1 | ~90-93% | ~85-88% |
| Llama 3.1 405B | ~80-85% | ~74-78% |
| Qwen2.5-Coder-32B | ~85-90% | ~78-83% |

**Assessment:** HumanEval is effectively solved. Most frontier models score above 90%. HumanEval+ (from the EvalPlus project) adds more rigorous test cases and is slightly more discriminative, but also approaching saturation. This benchmark no longer meaningfully differentiates top models.

* * *

## 3\. MBPP (Mostly Basic Python Programming)

MBPP contains ~974 crowd-sourced Python programming problems. Like HumanEval, it is approaching saturation for frontier models.

**Approximate Scores (pass@1):**

| Model | MBPP | MBPP+ (EvalPlus) |
| --- | --- | --- |
| Claude 3.7 Sonnet | ~88-92% | ~78-82% |
| GPT-4o | ~86-90% | ~76-80% |
| Gemini 2.5 Pro | ~89-92% | ~79-83% |
| DeepSeek-V3 | ~84-88% | ~73-77% |
| Qwen2.5-Coder-32B | ~83-87% | ~72-76% |

**Assessment:** Similar to HumanEval – useful historically, but no longer the cutting edge of evaluation. MBPP+ from EvalPlus is somewhat more challenging but still not the benchmark where meaningful differentiation happens.

* * *

## 4\. LiveCodeBench

LiveCodeBench was introduced to address contamination concerns by continuously collecting new competitive programming problems from platforms like LeetCode, Codeforces, and AtCoder, with strict time-based cutoffs.

**Approximate Scores (as of early 2025, pass@1):**

| Model | LiveCodeBench (Easy+Medium) | LiveCodeBench (Hard) |
| --- | --- | --- |
| Claude 3.7 Sonnet (extended thinking) | ~75-82% | ~30-40% |
| OpenAI o3-mini (high) | ~78-85% | ~35-45% |
| Gemini 2.5 Pro | ~76-83% | ~32-42% |
| DeepSeek-R1 | ~70-78% | ~28-38% |
| GPT-4o | ~60-68% | ~15-22% |

**Key Insight:** LiveCodeBench’s hard problems remain genuinely challenging. The gap between reasoning models (o3, Claude with extended thinking) and standard models (GPT-4o) is much larger here than on HumanEval/MBPP, suggesting it measures a different and arguably more important capability. Contamination resistance through temporal cutoffs is a significant methodological advantage.

* * *

## 5\. BigCodeBench

BigCodeBench (from BigCode / the BIGCODE project) focuses on practical, library-heavy coding tasks – calling APIs, using pandas, numpy, matplotlib, etc. It evaluates whether models can write code that uses real-world libraries correctly.

**Two variants:**  
\- **BigCodeBench-Complete:** Function completion with full docstrings.  
\- **BigCodeBench-Instruct:** Natural language instruction to code.

**Approximate Scores (as of early 2025):**

| Model | Complete | Instruct |
| --- | --- | --- |
| Claude 3.7 Sonnet | ~60-65% | ~55-60% |
| GPT-4o | ~58-63% | ~52-57% |
| Gemini 2.5 Pro | ~59-64% | ~54-59% |
| DeepSeek-V3 | ~52-57% | ~47-52% |
| Qwen2.5-Coder-32B | ~50-55% | ~44-49% |

**Assessment:** BigCodeBench remains meaningfully unsaturated and tests practical skills (library usage, API calls) that HumanEval and MBPP do not. This makes it one of the more valuable benchmarks for assessing “real coding” ability.

* * *

## 6\. Aider Polyglot Benchmark

The Aider polyglot benchmark, maintained by Paul Gauthier (creator of the Aider coding assistant), tests models’ ability to edit existing code across multiple languages (Python, JavaScript, TypeScript, Java, C#, C++, Go, Rust, Ruby, PHP, etc.). It measures both code generation and the ability to follow edit-format instructions.

**Approximate Scores (as of early 2025):**

| Model | Aider Polyglot (% correct) |
| --- | --- |
| Claude 3.7 Sonnet | ~72-78% |
| Claude 3.5 Sonnet (Oct 2024) | ~65-70% |
| GPT-4o | ~58-63% |
| Gemini 2.5 Pro | ~65-72% |
| DeepSeek-V3 | ~55-60% |
| DeepSeek-R1 | ~60-68% |
| Qwen2.5-Coder-32B | ~48-53% |

**Key Insight:** This benchmark consistently showed Claude models (particularly 3.5 Sonnet and 3.7 Sonnet) outperforming competitors by a notable margin, especially on the “diff” and “whole file” edit formats. It is one of the few benchmarks that tests multi-language editing capability rather than just Python generation. Its practical relevance is high since it mimics real coding assistant workflows.

* * *

## 7\. Other Notable Benchmarks

### MATH / AIME / Competition Math

While not strictly “code generation,” many code models are evaluated on mathematical reasoning since it correlates with algorithmic coding ability.  
\- OpenAI o3 and Gemini 2.5 Pro led on AIME 2024/2025 problems.  
\- Claude 3.7 Sonnet with extended thinking was competitive.

### CRUXEval

Tests code reasoning (predicting outputs, predicting inputs). Mid-range difficulty; somewhat correlated with but distinct from generation ability.

### CanAICode

Community-maintained leaderboard focusing on practical coding tasks. Generally tracks the same rankings as the above benchmarks.

### CodeContests

Google DeepMind’s competitive programming dataset. Very hard; even top models solve only a fraction without extensive sampling.

### MultiPL-E

Multi-language translation of HumanEval. Useful for assessing non-Python languages but inherits HumanEval’s saturation issues.

* * *

## 8\. Composite Leaderboard (Approximate, Early-Mid 2025)

Ranking models across all major benchmarks, weighted toward the more discriminative ones (SWE-Bench Verified, LiveCodeBench Hard, BigCodeBench, Aider Polyglot):

| Tier | Models | Strengths |
| --- | --- | --- |
| **Tier 1** | Claude 3.7 Sonnet, Gemini 2.5 Pro, OpenAI o3/o3-mini | Top across multiple benchmarks; strong on both reasoning-heavy and practical tasks |
| **Tier 2** | GPT-4o, DeepSeek-R1, Claude 3.5 Sonnet (Oct 2024) | Very capable but not consistently at the very top of all benchmarks |
| **Tier 3** | DeepSeek-V3, Qwen2.5-Coder-32B, Llama 3.1 405B | Best open-weight models; competitive on easier benchmarks, gap widens on harder ones |
| **Tier 4** | Smaller open models (Qwen2.5-Coder-7B, CodeLlama, StarCoder2, etc.) | Useful for local deployment and specific tasks; significant capability gap on complex tasks |

* * *

## 9\. Methodology Critiques

### Saturation

HumanEval and MBPP are effectively solved. Continuing to report scores on them is misleading since they no longer differentiate frontier models. Yet many papers still headline these numbers.

### Contamination

This is the single biggest threat to benchmark validity. Models trained on massive internet corpora inevitably see benchmark problems (or very similar ones) during training. LiveCodeBench’s temporal cutoff approach is the most robust mitigation, but even it faces challenges if models are trained on data from after the cutoff.

### Agentic Scaffolding Confounds

SWE-Bench results are heavily dependent on the agent framework, not just the model. Reporting “Model X achieves Y% on SWE-Bench” without specifying the agent is almost meaningless. The same model can vary by 20+ percentage points. This makes fair comparison difficult.

### Lack of Standardized Evaluation Conditions

-   Temperature settings, number of attempts (pass@1 vs pass@k), token budgets, and system prompts all vary between evaluations.
-   Self-reported scores from model providers are often not independently reproducible.
-   “With extended thinking” or “with reasoning” vs. without is often not clearly distinguished.

### Narrow Language Coverage

Most benchmarks are heavily Python-centric. Aider Polyglot and MultiPL-E are exceptions, but even they do not cover the full breadth of real-world programming (embedded systems, infrastructure-as-code, shell scripting, SQL, etc.).

### Static vs. Interactive Evaluation

Most benchmarks evaluate one-shot or few-shot generation. Real-world coding is interactive – developers iterate, debug, read error messages, and refine. SWE-Bench with agentic scaffolding is the closest to this, but most benchmarks still evaluate static completion.

### Specification Quality

Many benchmark problems are under-specified. EvalPlus (HumanEval+, MBPP+) and SWE-Bench Verified attempted to address this, but it remains a systemic issue.

* * *

## 10\. Do Benchmarks Correlate with Real-World Coding Ability?

**The short answer: partially, and it depends on the benchmark.**

**Benchmarks that correlate relatively well:**  
\- **SWE-Bench Verified** – real GitHub issues, real codebases, real test suites. The closest proxy to “can this model fix a real bug or implement a real feature.”  
\- **Aider Polyglot** – tests code editing in realistic formats across multiple languages.  
\- **BigCodeBench** – tests practical library usage that developers actually do daily.

**Benchmarks that correlate less well:**  
\- **HumanEval / MBPP** – too easy, too narrow (isolated function completion), and potentially contaminated.  
\- **Competitive programming benchmarks** (LiveCodeBench hard, CodeContests) – algorithmic ability is a component of real-world coding, but most professional programming does not involve competitive-programming-style problems. A model that excels at Codeforces hard problems may still struggle with practical software engineering tasks.

**The gap between benchmarks and reality:**  
1\. **Multi-file reasoning** – most benchmarks test single-file or single-function generation. Real codebases span thousands of files.  
2\. **Long-context understanding** – reading and understanding large existing codebases is critical but poorly measured.  
3\. **Debugging and iteration** – real development involves back-and-forth cycles.  
4\. **Requirements interpretation** – real specs are ambiguous; benchmarks have (relatively) clear specifications.  
5\. **Tool use** – real developers use LSPs, debuggers, search tools, documentation. Benchmarks rarely account for tool-assisted generation.

**Industry consensus as of early 2025:** No single benchmark captures real-world coding ability. The best approach is a composite of SWE-Bench Verified (for software engineering), BigCodeBench (for practical library usage), Aider Polyglot (for multi-language editing), and LiveCodeBench (for algorithmic reasoning), while acknowledging that all of these still miss important dimensions.

* * *

## 11\. Live Leaderboard Links (for latest 2026 data)

Since my data cuts off around May 2025 and you are asking about March 2026, I recommend checking these live sources:

-   **SWE-Bench:** https://www.swebench.com/
-   **LiveCodeBench:** https://livecodebench.github.io/
-   **BigCodeBench:** https://bigcode-bench.github.io/
-   **Aider Polyglot:** https://aider.chat/docs/leaderboards/
-   **EvalPlus (HumanEval+, MBPP+):** https://evalplus.github.io/
-   **Chatbot Arena Coding:** https://lmarena.ai/ (filter by “coding” category)
-   **CanAICode:** https://huggingface.co/spaces/mike-ravkine/can-ai-code-results

* * *

## Summary

**What we know with confidence (as of training cutoff):**  
\- The top tier of code generation models as of early 2025 consisted of Claude 3.7 Sonnet, Gemini 2.5 Pro, and OpenAI’s o3 family, with no single model dominating all benchmarks.  
\- Open-weight models (DeepSeek-R1/V3, Qwen2.5-Coder) narrowed the gap significantly but still trailed on the hardest tasks.  
\- HumanEval and MBPP are no longer useful for differentiating frontier models.  
\- SWE-Bench Verified, LiveCodeBench, BigCodeBench, and Aider Polyglot are the most informative benchmarks as of 2025.  
\- Benchmark scores are necessary but not sufficient indicators of real-world coding utility. The correlation is moderate at best, and critical dimensions (multi-file reasoning, debugging, long-context understanding) remain under-measured.

**What I cannot confirm (would require live data from late 2025 through March 2026):**  
\- Whether newer model releases (Claude 4.x, GPT-5, Gemini 2.x updates, new open-weight models) have shifted the leaderboard.  
\- Whether new benchmarks have emerged to address the critiques above.  
\- Exact current scores on any of these benchmarks.

For the most current March 2026 numbers, the live leaderboard links above are your best resource.
