---
title: "Computer Use and GUI-Interaction AI Agents: State of the Art (2025-2026)"
description: "GUI-interaction AI agents represent a frontier capability where language models directly perceive and manipulate graphical user interfaces — clicking buttons, filling forms,..."
date: "2026-03-04"
category: "AI Breakthroughs"
author: "QorSync AI Research Team"
readTime: "11 min read"
published: true
---

# Computer Use and GUI-Interaction AI Agents: State of the Art (2025-2026)

## Comprehensive Research Report

* * *

## 1\. Overview

GUI-interaction AI agents represent a frontier capability where language models directly perceive and manipulate graphical user interfaces — clicking buttons, filling forms, navigating operating systems, and completing multi-step workflows. This report covers the major systems, benchmarks, reliability data, and practical limitations as of early 2026.

* * *

## 2\. Major Systems and Platforms

### 2.1 Anthropic — Claude Computer Use

**Launch and Evolution:**  
\- Announced October 2024 as a public beta with Claude 3.5 Sonnet.  
\- Claude 3.5 Sonnet (upgraded, Oct 2024) was the first model offered with native computer use capability via the API.  
\- By 2025, Claude 3.7 Sonnet and Claude 4 Sonnet continued to improve computer use, with the feature remaining in beta through early 2026.

**Architecture:**  
\- Claude receives screenshots of the desktop (or browser viewport) and can issue structured tool-use actions: `computer_tool` (mouse clicks, typing, key presses, screenshots), `text_editor_tool`, and `bash_tool`.  
\- The agent loop: Claude sees a screenshot, decides on an action, the action is executed in a sandboxed environment, a new screenshot is taken, and the cycle repeats.  
\- Does NOT use accessibility trees or DOM — it operates purely on pixel-level visual understanding plus coordinate-based actions.

**Supported Actions:**  
\- Mouse movement, left/right/middle click, double-click, drag  
\- Keyboard typing, key combinations (hotkeys)  
\- Screenshot capture at configurable resolution  
\- Cursor position reporting

**Reliability (Benchmarks):**  
\- OSWorld benchmark (Oct 2024 launch): Claude 3.5 Sonnet scored **14.9%** on the full task suite — the highest at the time, versus 7.8% for GPT-4o. With screenshot-only mode (no accessibility tree), the gap was wider.  
\- WebArena-style tasks: Anthropic reported internal evals showing substantial improvements with each model generation but did not publish exact numbers beyond OSWorld.  
\- Anthropic’s own guidance (documentation, 2025): “Computer use is a beta feature. It may be error-prone, especially for complex multi-step tasks. It can be sensitive to screen resolution, UI layout changes, and timing.”

**Practical Limitations:**  
\- Latency: Each action-observe cycle takes seconds (screenshot capture + model inference + action execution). Real-time interaction is not feasible.  
\- Reliability drops sharply with task complexity. Simple form-filling or file operations are relatively reliable; multi-application workflows with conditional logic are brittle.  
\- No persistent memory across sessions by default.  
\- Resolution sensitivity: The model works best at specific resolutions (XGA 1024x768 recommended). Higher resolutions degrade coordinate accuracy.  
\- Security: Anthropic warns about prompt injection risks — malicious content on screen could influence the model’s actions. Must be sandboxed.

### 2.2 OpenAI — GPT-4o and Operator

**GPT-4o Screen Understanding:**  
\- GPT-4o (May 2024) brought strong multimodal vision capabilities, enabling screen understanding.  
\- OpenAI did not initially ship a native “computer use” API equivalent to Anthropic’s, but GPT-4o’s vision was used by third-party frameworks for GUI agents.

**Operator (January 2025):**  
\- OpenAI launched “Operator” as a research preview — an agent that can browse the web autonomously using a built-in browser.  
\- Uses a model internally called CUA (Computer-Using Agent), built on GPT-4o’s vision.  
\- Operator navigates websites, fills forms, makes purchases, books reservations.  
\- Runs in a sandboxed cloud browser; user can watch and intervene in real-time.  
\- Initially available to ChatGPT Pro subscribers ($200/month tier).

**Reliability:**  
\- OpenAI reported that on WebVoyager benchmark, their CUA model achieved around **58.1%** task success rate (a web-navigation benchmark, not full OS-level).  
\- On OSWorld, GPT-4o without accessibility tree scored approximately **7-8%** (Oct 2024 data), significantly behind Claude.  
\- Operator was described as best for “simple, well-defined web tasks” — booking a restaurant, ordering from a specific store, filling repetitive forms.

**Practical Limitations:**  
\- Web-only (Operator does not control the desktop OS).  
\- Frequently hands control back to the user for sensitive actions (login, payment).  
\- Struggles with CAPTCHAs, complex multi-tab workflows, and sites with heavy JavaScript rendering.  
\- Latency similar to Claude computer use — multiple seconds per action.

### 2.3 Google DeepMind — Project Mariner and Gemini

**Project Mariner (December 2024):**  
\- Google announced Project Mariner, a Chrome extension powered by Gemini 2.0 that can navigate and interact with websites.  
\- Operates within a Chrome tab; user watches the agent work in real-time.  
\- Research prototype, limited availability.

**Gemini 2.0 and Screen Understanding:**  
\- Gemini 2.0 Flash and Pro models have native multimodal understanding including screenshots.  
\- Google has invested in “visual grounding” — the model can output bounding boxes and coordinates for UI elements.

**Reliability:**  
\- On WebVoyager, Google reported Mariner achieving around **83.5%** task success — the highest published number on that benchmark, though WebVoyager is a relatively controlled web benchmark.  
\- No published OSWorld numbers for Mariner/Gemini.

### 2.4 Open Source — Browser Use, Open Interpreter, and Others

**Browser-Use (browser-use):**  
\- Open-source Python library (GitHub: browser-use/browser-use) that enables LLM-driven browser automation.  
\- Uses Playwright for browser control; sends screenshots or DOM/accessibility tree to any LLM backend (Claude, GPT-4o, Gemini, local models).  
\- Supports vision-based and DOM-based interaction modes.  
\- Very popular in 2025; became a standard building block for web agent prototypes.  
\- Reliability depends heavily on the backend LLM and task complexity. Community reports 40-70% success on straightforward web tasks with Claude or GPT-4o backends.

**Open Interpreter:**  
\- Open-source project that gives LLMs the ability to execute code and interact with the local OS.  
\- “OS mode” (experimental): Uses vision models to see the screen and control mouse/keyboard, similar to Claude computer use but model-agnostic.  
\- Primarily code-execution focused; GUI interaction is a secondary capability.  
\- Reliability for GUI tasks is lower than dedicated computer-use systems — it is better suited for command-line and code-execution workflows.

**Other Notable Projects:**  
\- **LaVague**: Open-source web agent framework using LLMs + Selenium, focused on natural language web automation.  
\- **AgentQ (MultiOn)**: Commercial web agent with self-correction and MCTS-based planning. Claimed high scores on WebArena.  
\- **SeeAct (OSU NLP, 2024)**: Research framework for visual web agents using set-of-mark prompting on screenshots.  
\- **UFO (Microsoft, 2024)**: UI-Focused Agent for Windows OS interaction, using GPT-4V for visual grounding.  
\- **OmniParser (Microsoft, 2024-2025)**: Screen parsing model that converts UI screenshots into structured representations. Open-sourced; used as a preprocessing step for GUI agents.  
\- **OS-Atlas (2025)**: Foundation action model for GUI grounding across platforms (Windows, macOS, Linux, Android, web). Trained on large-scale GUI interaction data.

* * *

## 3\. Benchmarks

### 3.1 OSWorld

-   **What it measures**: Full OS-level task completion in real desktop environments (Ubuntu, Windows, macOS simulated). Tasks span file management, office applications, web browsing, system settings, multi-app workflows.
-   **Scale**: 369 tasks across diverse OS interactions.
-   **Key results (2024-2025)**:
-   Claude 3.5 Sonnet (computer use): **14.9%** (screenshot-only, Oct 2024)
-   GPT-4o: **7.8%** (screenshot-only)
-   With accessibility tree added: scores roughly double for most models
-   Human performance: estimated **72%+**
-   **Significance**: OSWorld exposed the massive gap between model capability and human reliability for real computer tasks. Even the best models fail >85% of the time on screenshot-only OS tasks.
-   **2025 updates**: Improved models (Claude 3.7 Sonnet, GPT-4.1, Gemini 2.0) have pushed scores into the 20-30% range on screenshot-only mode in community reproductions, but no model has crossed 40% as of early 2026.

### 3.2 WebArena

-   **What it measures**: Web-based task completion on realistic self-hosted web applications (shopping sites, forums, content management, maps, GitLab).
-   **Scale**: 812 tasks requiring multi-step web interaction.
-   **Key results**:
-   Best LLM agents (2024): **~35-40%** success rate
-   With self-correction and search (AgentQ-style): claimed up to **50%+**
-   Human performance: **78%**
-   **Variants**: VisualWebArena (adds visual reasoning tasks), WebArena++ (robustness tests).

### 3.3 WebVoyager

-   **What it measures**: Real-world web navigation across live websites (not sandboxed).
-   **Key results**:
-   Google Mariner: **83.5%** (Dec 2024)
-   OpenAI CUA: **58.1%**
-   Various open-source agents: 40-60%
-   **Caveat**: Live web benchmarks are noisy — websites change, and success can depend on timing, locale, login state, etc.

### 3.4 Other Benchmarks

-   **ScreenSpot**: Evaluates GUI grounding accuracy (can the model click on the correct element?). Best models achieve 80-90% on simple elements, dropping to 50-60% on small or ambiguous targets.
-   **AndroidWorld / AndroidControl**: Mobile device interaction benchmarks. Scores generally lower than web benchmarks due to smaller touch targets and more varied UIs.
-   **GAIA**: General AI assistant benchmark including some computer-use tasks. Models score 40-60% on Level 1 tasks, dropping to <20% on Level 3.
-   **Mind2Web**: Large-scale web agent benchmark. Best models achieve around 50-60% element accuracy.
-   **MiniWob++**: Older, simpler web interaction benchmark. Modern models score 80%+ but tasks are toy-scale.

* * *

## 4\. Visual Grounding for UI Interaction — Research Landscape

### 4.1 Core Challenge

Visual grounding for UI means: given a screenshot and an instruction (“click the Submit button”), the model must identify the exact pixel coordinates or bounding box of the target element. This is the foundation of all screenshot-based GUI agents.

### 4.2 Approaches

**Direct Coordinate Prediction:**  
\- Models like Claude computer use directly output (x, y) coordinates from screenshots.  
\- Accuracy depends on resolution, element size, and visual complexity.  
\- Error rates of 10-30% on coordinate prediction are common, especially for small targets.

**Set-of-Mark Prompting (SoM):**  
\- Overlay numbered markers on interactive elements in the screenshot before sending to the LLM.  
\- The model then references elements by number rather than coordinates.  
\- Significantly improves accuracy (from research by Microsoft and others, 2024).  
\- Used by SeeAct, OmniParser pipelines, and some browser-use implementations.

**Hybrid DOM + Vision:**  
\- Extract the DOM/accessibility tree for structural understanding, use vision for disambiguation.  
\- Generally more reliable than pure vision, but not available for native OS applications.  
\- Most practical production systems use this hybrid approach.

**Specialized Grounding Models:**  
\- OS-Atlas, UGround, SeeClick: Models specifically trained for UI element grounding.  
\- Fine-tuned on large datasets of (screenshot, instruction, coordinate) triples.  
\- Can achieve 80-90%+ grounding accuracy on standard benchmarks, but end-to-end task success remains much lower due to planning and multi-step errors compounding.

### 4.3 Key Research Findings (2025)

-   **Error compounding** is the dominant failure mode: even 90% per-step accuracy yields only 35% success on a 10-step task (0.9^10 = 0.35).
-   **Self-correction** helps but doesn’t solve the problem. Models that can detect and recover from errors improve success rates by 10-20 percentage points.
-   **Planning quality** matters as much as grounding accuracy. Many failures come from choosing the wrong action sequence, not from misclicking.
-   **Resolution and scaling**: Most models work best on screenshots scaled to 1024-1366px width. 4K screenshots degrade performance significantly.
-   **Dynamic content**: Animations, loading spinners, pop-ups, and dynamically rendered content are major failure sources.

* * *

## 5\. Practical Limitations (Cross-Cutting)

| Limitation | Impact | Mitigation |
| --- | --- | --- |
| **Latency** | 2-10 seconds per action cycle | Acceptable for background automation; blocks real-time use |
| **Reliability** | 15-40% on complex OS tasks, 50-80% on simple web tasks | Sandboxing, human-in-the-loop, task decomposition |
| **Error compounding** | Multi-step tasks fail exponentially | Checkpointing, self-correction loops, shorter task chains |
| **Security / prompt injection** | Screen content can manipulate the agent | Sandboxed environments, action filtering, human approval gates |
| **Cost** | High token usage (screenshots are ~1000-2000 tokens each) | Resolution optimization, selective screenshotting |
| **Fragility to UI changes** | Minor layout changes break workflows | DOM-based fallbacks, adaptive re-planning |
| **No persistent state** | Agent forgets context between sessions | External memory systems, session logging |
| **Authentication barriers** | CAPTCHAs, 2FA, cookie walls | Human handoff for auth, pre-authenticated sessions |

* * *

## 6\. Current State Summary (Early 2026)

**What works well:**  
\- Simple, well-defined web tasks (form filling, data extraction, single-site navigation)  
\- Code execution and terminal interaction (Open Interpreter’s strength)  
\- Repetitive workflows with stable UIs  
\- Human-supervised automation where the agent does the tedious work and hands off edge cases

**What remains unreliable:**  
\- Multi-application OS-level workflows (OSWorld-style)  
\- Tasks requiring judgment, ambiguity resolution, or real-world knowledge  
\- Anything involving authentication flows, payment, or sensitive actions without human intervention  
\- Long-horizon tasks (>15-20 steps) without checkpointing

**Trajectory:**  
\- OSWorld scores have roughly doubled from late 2024 to early 2026 (~15% to ~25-30%), but remain far from human-level (~72%).  
\- Web-only benchmarks show faster progress (WebVoyager scores above 80% for best systems).  
\- The gap between “web agent” and “OS agent” reliability remains large — the web has DOM/accessibility affordances that native GUIs lack.  
\- Specialized grounding models (OS-Atlas, OmniParser) are closing the perception gap; the planning and error-recovery gap is now the primary bottleneck.  
\- Commercial deployment is concentrated in narrow, high-value verticals: RPA replacement, QA testing, data entry — where the ROI justifies human oversight costs.

* * *

## 7\. Key Takeaways

1.  **No system is reliable enough for unsupervised general-purpose computer use.** The best models succeed on only ~25-30% of realistic OS-level tasks without human help.
    
2.  **Web agents are significantly ahead of OS agents** due to DOM availability and more constrained action spaces.
    
3.  **Claude computer use remains the most capable screenshot-only OS agent**, but the absolute performance level is still low for production use without guardrails.
    
4.  **The bottleneck has shifted from perception to planning.** Grounding accuracy is reaching 80-90%; it is multi-step reasoning, error recovery, and action planning that now limit end-to-end performance.
    
5.  **Practical deployments in 2025-2026 are narrow and supervised** — the technology augments human workflows rather than replacing them. The most successful pattern is human-in-the-loop automation where the agent handles routine steps and escalates to a human for exceptions.
