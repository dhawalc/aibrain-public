---
title: "AI for DevOps and Infrastructure: Advances in 2025-2026"
description: "The 2025-2026 period marks a decisive shift in AI-powered DevOps: the industry has moved from “AI-assisted” tools (co-pilots, suggestion engines) to agentic AI systems that..."
date: "2026-03-11"
category: "AI Breakthroughs"
author: "QorSync AI Research Team"
readTime: "13 min read"
published: true
---

# AI for DevOps and Infrastructure: Advances in 2025-2026

## Comprehensive Research Report

* * *

## 1\. Executive Summary

The 2025-2026 period marks a decisive shift in AI-powered DevOps: the industry has moved from “AI-assisted” tools (co-pilots, suggestion engines) to **agentic AI systems** that autonomously investigate, decide, and act across the software delivery lifecycle. Gartner predicts task-specific AI agent adoption will jump from under 5% in 2025 to 40% by end of 2026. Across the board, organizations report 25-50% faster incident resolution, up to 80% reduction in test cycle times, and significant cost savings – though vendor lock-in and escalating costs remain real concerns, with Gartner warning that over 40% of agentic AI projects may be canceled by 2027 due to unclear business value.

This report covers four domains: AI-powered CI/CD, automated incident response, IaC generation, and AIOps platforms.

* * *

## 2\. AI-Powered CI/CD

### 2.1 Harness AI

Harness has positioned itself as the most comprehensive AI-native DevOps platform, applying AI across the entire software delivery lifecycle.

**Key Agents and Capabilities:**  
\- **DevOps Agent**: Context-aware pipeline management and troubleshooting from natural language prompts  
\- **Test Intelligence**: Reduces test cycle time by up to 80% through AI-powered test selection; generates tests 10x faster with self-healing that cuts test maintenance by 70%  
\- **Autonomous Code Maintenance (ACM)**: Developers express intent in plain language (e.g., “Upgrade the front end from React 15.6 to 16.4”) and the AI handles branching, coding, testing, and iterative refinement until builds pass  
\- **AI Verification and Rollback**: Autonomously connects to observability platforms, discovers relevant metrics/log queries, builds health verification profiles, and triggers automatic rollbacks to last known good version  
\- **Architect Mode**: Conversational tool that designs production-ready delivery pipelines incorporating organizational security, quality, and compliance standards  
\- **FinOps Agent**: Cloud cost optimization with intelligent recommendations  
\- **AppSec Agent**: Security testing, vulnerability detection, and automated fixes

**Real Deployment Results:**  
\- Citi: Reduced deployment time from days to 7 minutes  
\- United Airlines: Accelerated deployments by 75%  
\- Typical outcomes: Up to 90% release time reduction

**Reliability Concern:** Harness’s own 2026 State of DevOps Modernization Report reveals that for very frequent AI coding tool users, 22% of code deployments result in a rollback, hotfix, or customer-impacting incident (vs. 15% for occasional AI users) – underscoring that faster code generation without mature delivery pipelines creates new risks.

### 2.2 CircleCI AI and Chunk Agent

CircleCI’s AI strategy centers on **Chunk**, an autonomous CI/CD agent launched in 2025 that operates continuously in the background.

**Key Capabilities:**  
\- **Flaky Test Detection and Fixing**: Analyzes test history, identifies root causes of flaky tests, and opens PRs with working fixes autonomously  
\- **Autonomous Failure Resolution**: Diagnoses build failures at their source, proposes corrective PRs, and applies validated fixes without manual intervention  
\- **Intelligent Test Selection**: Runs only tests that matter based on code change analysis, skipping redundant work  
\- **Resource Intelligence**: Identifies pipeline bottlenecks and analyzes wasted compute  
\- **Adaptive Learning**: Learns from the codebase’s unique patterns and team preferences over time

**MCP Server Integration:** CircleCI’s Model Context Protocol server enables bidirectional communication with third-party AI agents (integrated with AWS Bedrock AgentCore). IDE-based AI assistants can pull historical test data, surface instability patterns, and suggest fixes in context via the `find_flaky_tests` tool.

**Security Model:** Chunk uses the customer’s own OpenAI or Anthropic API key – code never transfers to CircleCI for training. Read-only repository access only.

**2026 State of Software Delivery Finding:** CircleCI’s report emphasizes that success in the AI era is not determined by how quickly code can be written, but by the ability to validate, integrate, and ship code and recover at scale.

* * *

## 3\. Automated Incident Response

### 3.1 PagerDuty AI Agent Suite

In October 2025, PagerDuty launched what it calls the industry’s first end-to-end AI agent suite, with four specialized agents:

**SRE Agent** (Early Access, GA projected Q4 2025):  
\- Detects, triages, and diagnoses incidents  
\- Performs approved remediation actions  
\- Uses memory of past incidents, diagnostics, and knowledge base to improve future responses  
\- Generates self-updating runbooks to prevent recurring issues

**Scribe Agent** (Generally Available):  
\- Transcribes Zoom calls and chat conversations during incidents in real time  
\- Generates structured summaries and status updates in Slack or Microsoft Teams

**Shift Agent** (Generally Available):  
\- Detects and resolves on-call scheduling conflicts automatically  
\- Reduces on-call fatigue

**Insights Agent** (Early Access):  
\- Delivers context-aware answers based on PagerDuty analytics  
\- Provides proactive recommendations to anticipate and prevent issues

**Performance Results:**  
\- Early adopters report up to 50% faster incident resolution  
\- Engineering teams reclaim thousands of innovation hours across all incidents  
\- Over 250 customers adopted PagerDuty’s MCP server within two months of launch

**Real Deployment:** Block (formerly Square) built a PagerDuty MCP extension that automates triage and root cause analysis, now used as a production tool reducing on-call burden.

### 3.2 OpsGenie (Atlassian) – Sunset in Progress

A critical development: Atlassian stopped new sales of OpsGenie on June 4, 2025, with complete shutdown scheduled for April 5, 2027. Customers are being migrated to Jira Service Management. This effectively removes OpsGenie as a competitor in the AI-powered incident response space and benefits PagerDuty, incident.io, and other alternatives.

### 3.3 Datadog Bits AI SRE

Launched December 2025, Datadog’s Bits AI SRE represents the observability vendor’s entry into autonomous incident response:

-   Investigates production alerts and identifies root causes autonomously before on-call engineers begin their response
-   Delivers conclusions directly to collaboration tools (Slack, Teams)
-   Grounded in analysis of thousands of real-world incidents
-   Claims 90% faster root cause identification
-   Tested against 2,000+ customer environments with tens of thousands of investigations completed

**Real Deployment:** DelightRoom reported that “for most cases, the investigation is already taken care of well before our engineers sit down.” Uber Freight’s engineering team uses it to “cut through the noise by instantly surfacing the right context and correlations.”

* * *

## 4\. Infrastructure as Code Generation

### 4.1 Pulumi AI (Neo)

Pulumi’s AI strategy leverages a fundamental architectural advantage: IaC written in real programming languages (Python, TypeScript, Go) rather than domain-specific languages, making it naturally more compatible with LLM-based code generation.

**Pulumi Neo Agent Capabilities:**  
\- Trained on 2+ petabytes of real production infrastructure deployments  
\- **Policy Migration**: Converts security policies from Terraform or CloudFormation using production-proven patterns  
\- **Drift Remediation**: Detects and fixes configuration drift in GPU clusters  
\- **Multi-Cloud Migration**: Converts between AWS, Azure, and GCP infrastructure using production-ready patterns  
\- **AI Workload Management**: Full lifecycle support from pre-training (100,000+ GPU orchestration) through inference (auto-scaling GPU clusters)

**Real Deployment Results:**  
\- Supabase: 1 week to infrastructure readiness for regional expansion; manages 80,000 resources across 16 AWS regions; 43,000+ databases launched daily  
\- Snowflake: Deployment cycles reduced from 1.5 weeks to under 24 hours  
\- BMW: 15,000 developers enabled with self-service access to production-grade infrastructure

### 4.2 Terraform AI (HashiCorp)

HashiCorp’s AI strategy centers on the **Model Context Protocol (MCP)** and the new **Project Infragraph** initiative.

**Terraform MCP Server** (Open Source):  
\- Provides LLMs with real-time access to current Terraform provider documentation, modules, and policies from the Terraform Registry  
\- Ensures AI-generated configurations use accurate, up-to-date information rather than outdated training data  
\- Demonstrated integration with GitHub Copilot at Microsoft Build 2025  
\- Azure Copilot with Terraform integration in public beta

**Project Infragraph** (Announced HashiConf 2025):  
\- Lays foundation for agentic AI to provision Infrastructure as Code  
\- Aims to make the unified control plane accessible to IT team members with varying programming expertise  
\- Represents HashiCorp’s path toward autonomous infrastructure management

**2026 Updates:**  
\- New Terraform “power” for Kiro (Amazon’s AI IDE)  
\- Open HashiCorp Agent Skills for AI assistants  
\- Native monorepo support, Stack component configurations, migration tooling

### 4.3 Spacelift Saturnhead AI

Launched April 2025, Spacelift’s Saturnhead AI is an enterprise-grade AI assistant for infrastructure operations:

-   Analyzes infrastructure run logs in real time and provides natural-language explanations
-   Explains what happened, why it occurred, and what steps to take
-   Supports Terraform, OpenTofu, CloudFormation, and Pulumi
-   Continuous drift detection with automated policy-driven remediation
-   Available in Spacelift’s enterprise edition

* * *

## 5\. AIOps Platforms

### 5.1 Dynatrace Davis AI – Third Generation Platform

Dynatrace’s Davis AI represents the most mature causal AI engine in the observability space, now in its third generation.

**Architecture – Hypermodal AI:**  
\- **Causal AI**: Deterministic root cause analysis (not probabilistic) through automatic dependency analysis via “Smartscape” topology  
\- **Predictive AI**: Forecasts potential incidents before they occur  
\- **Generative AI (Davis CoPilot)**: Natural language interface for analytics, workflow creation, and dashboard generation

**Scale:** Analyzes more than 3 million problems accurately every 24 hours.

**Key Capabilities:**  
\- Automated remediation in complex multi-team scenarios  
\- Live debugger scaling to thousands of simultaneous developer sessions  
\- Petabyte-per-day log management with up to 10 years retention  
\- Agentic AI for preventive operations across ITOps, SRE, Platform Engineering, DevSecOps

**Real Deployments:**  
\- TELUS: “Cut incident resolution times dramatically – going from detection to pull requests in a matter of minutes”  
\- Air France-KLM: AI and predictive capabilities cited as a key differentiator for rapid problem resolution

**Limitation:** Requires full ecosystem commitment. OpenTelemetry is supported but secondary – much of Davis’s capability is lost without full platform adoption. Proprietary DQL query language creates significant barriers.

### 5.2 Datadog – Bits AI Suite

Datadog’s Bits AI has evolved into a comprehensive autonomous operations suite:

**Core Components:**  
\- **Bits AI SRE**: Autonomous alert investigation and root cause identification (90% faster)  
\- **Bits AI Dev Agent**: Code-level fixes for identified issues  
\- **Bits AI Security Analyst**: Automated security incident response  
\- **Watchdog**: Continuous anomaly detection across infrastructure metrics, traces, and logs

**LLM Observability (Launched June 2025):**  
\- AI Agent Monitoring for tracking agentic AI application behavior  
\- LLM Experiments for model evaluation and fine-tuning  
\- Hallucination rate tracking, token usage cost monitoring, prompt toxicity detection  
\- GPU Monitoring and AI Guard for production security

**Adoption:** Over 2,000 enterprise customers using Bits AI as of 2026.

**Cost Concern:** Datadog’s pricing is already complex; Bits AI adds continuous analysis expenses. The autonomous AI deepens vendor lock-in significantly – it is designed to analyze Datadog data, query Datadog metrics, and keep users within the ecosystem.

### 5.3 New Relic – AI and Applied Intelligence

New Relic has paired its mature AIOps engine with generative AI capabilities and delivered measurable results documented in its 2026 AI Impact Report.

**Capabilities:**  
\- **Natural Language to NRQL**: Translates plain language queries (50+ languages) into NRQL via GPT-4 integration  
\- **Predictive Alerting**: NRQL Predictions and Predictive Alerting now Generally Available – forecasts anomalies using ML on time-series data  
\- **MCP Server** (Public Preview, November 2025): Exposes observability as a toolset that AI agents can call using standardized protocol

**Quantified Results from 2026 AI Impact Report:**  
\- 27% less alert noise for AI users (46% noisy-alert rate vs. 70%+ without AI)  
\- 2X higher alert correlation rate  
\- 25% faster issue resolution across 2025  
\- During peak periods: AI teams averaged 26.75 minutes per issue vs. 50.23 minutes (23-minute advantage)  
\- 80% higher shipping frequency; up to 453 deployments per day during high-velocity periods (5X increase)  
\- Engineers without AI lose approximately 33% of their week to system disruptions and alert noise

**Limitation:** The AI experience feels “more bolted on than built in” – the co-pilot and AIOps layers operate side by side rather than as one unified system, reflecting incremental modernization of a legacy platform.

* * *

## 6\. Cross-Cutting Analysis

### 6.1 The MCP Protocol as Universal Connector

A defining technical trend of 2025-2026 is the adoption of the **Model Context Protocol (MCP)** across essentially every major DevOps vendor:  
\- PagerDuty: Remote MCP server (GA), 250+ customers in two months  
\- CircleCI: MCP server integrated with AWS Bedrock AgentCore  
\- HashiCorp: Terraform MCP server (open source)  
\- New Relic: MCP server (public preview)  
\- Dynatrace, Datadog: MCP integrations underway

MCP is becoming the standard interface through which AI agents interact with DevOps tooling, enabling multi-tool orchestration across the delivery pipeline.

### 6.2 Cost Savings and ROI

| Metric | Value | Source |
| --- | --- | --- |
| Average TCO reduction | 31% | Deloitte 2025 Technology Cost Survey |
| Release cycle reduction | 67% | Forrester 2024 State of DevOps |
| Deployment speed improvement | Up to 50% | Industry composite |
| Cloud waste (addressable) | 30-35% of cloud spend | Industry analysts |
| Test cycle time reduction | Up to 80% | Harness Test Intelligence |
| Incident resolution improvement | 25-50% faster | PagerDuty, New Relic reports |

### 6.3 Reliability Concerns

The data reveals a tension: AI-accelerated development creates new reliability risks when delivery infrastructure does not mature at the same pace.

-   Harness 2026 report: 22% of deployments by heavy AI coding tool users result in rollbacks or incidents
-   Gartner: Over 40% of agentic AI projects may be canceled by 2027 due to escalating costs
-   Vendor lock-in deepens as AI systems become tightly coupled to proprietary data formats and platforms
-   Autonomous remediation without human oversight remains a concern for regulated industries

### 6.4 Market Trajectory

-   AI infrastructure spending reached $47.4 billion in H1 2026 (97% YoY increase)
-   IDC forecasts $500 billion in total AI infrastructure spend
-   91% of global technology decision-makers plan to increase IT spending (Forrester)
-   Gartner predicts 33% of enterprise software will include agentic AI by 2028 (up from <1% in 2024)

* * *

## 7\. Summary Table: Platform Comparison

| Platform | Domain | AI Model | Key Differentiator | Maturity |
| --- | --- | --- | --- | --- |
| Harness AI | CI/CD | Multi-agent suite | Full lifecycle coverage, ACM | GA (agents in various stages) |
| CircleCI Chunk | CI/CD | Autonomous agent | Flaky test auto-fix, BYOK model | GA |
| PagerDuty AI | Incident Response | 4-agent suite | SRE Agent with memory, MCP server | Mixed (GA + Early Access) |
| Pulumi Neo | IaC Generation | Agentic AI | Code-native languages, 2PB training corpus | GA |
| Terraform MCP | IaC Generation | MCP protocol | Registry-grounded generation, open source | GA |
| Spacelift Saturnhead | IaC Operations | AI assistant | Multi-tool support, drift remediation | GA (Enterprise) |
| Dynatrace Davis | AIOps | Hypermodal (Causal+Predictive+Generative) | Deterministic root cause, 3M problems/day | GA (3rd gen) |
| Datadog Bits AI | AIOps | Multi-agent suite | Autonomous SRE + LLM Observability | GA |
| New Relic AI | AIOps | Applied Intelligence + GenAI | Quantified impact data, predictive alerting | GA |

* * *

## 8\. Key Takeaways

1.  **Agentic AI is the defining paradigm shift.** Every major vendor has moved from suggestion-based co-pilots to autonomous agents that investigate, decide, and act. The 2025-2026 period is when this transition reached production readiness.
    
2.  **MCP is the emerging standard.** The Model Context Protocol has become the universal integration layer, enabling AI agents to orchestrate across multiple DevOps tools in a standardized way.
    
3.  **Measurable ROI exists but comes with caveats.** New Relic’s 2026 Impact Report provides the most rigorous public data: 25% faster resolution, 27% less alert noise, 80% higher deployment frequency. However, these gains require mature delivery pipelines – without them, faster coding leads to more incidents.
    
4.  **Vendor lock-in is the hidden cost.** Autonomous AI systems that are trained on and optimized for proprietary data formats (Datadog, Dynatrace) create deeper lock-in than previous generations of tooling.
    
5.  **The IaC space favors code-native approaches.** Pulumi’s use of real programming languages gives it a structural advantage for AI-generated infrastructure, while HashiCorp is bridging the gap through MCP-based registry grounding for HCL.
    

* * *

Sources:  
\- [PagerDuty AI Agent Suite Launch](https://www.pagerduty.com/?page_id=96831)  
\- [PagerDuty AI Agents - SiliconANGLE](https://siliconangle.com/2025/10/08/pagerduty-debuts-end-end-ai-agents-automate-accelerate-incident-management/)  
\- [Harness AI Unscripted 2025 Announcements](https://www.harness.io/blog/unscripted-2025-announcements)  
\- [Harness AI DevOps Platform](https://www.harness.io/products/harness-ai)  
\- [Harness State of DevOps Modernization 2026](https://www.harness.io/state-of-devops-modernization-2026)  
\- [CircleCI Chunk Agent](https://circleci.com/product/chunk/)  
\- [CircleCI MCP + AWS Agentic AI](https://aws.amazon.com/blogs/awsmarketplace/transform-ci-cd-pipelines-with-circleci-mcp-and-aws-agentic-ai/)  
\- [CircleCI 2026 State of Software Delivery](https://www.prnewswire.com/news-releases/circleci-publishes-2026-state-of-software-delivery-302691131.html)  
\- [Pulumi Superintelligence Infrastructure](https://www.pulumi.com/product/superintelligence-infrastructure/)  
\- [Terraform MCP Server - HashiCorp](https://developer.hashicorp.com/terraform/mcp-server)  
\- [HashiCorp AI-Native Terraform](https://www.efficientlyconnected.com/hashicorp-advances-ai-native-terraform-and-platform-engineering/)  
\- [Spacelift Saturnhead AI Launch](https://spacelift.io/blog/introducing-saturnhead-ai)  
\- [Dynatrace 3rd Gen Platform](https://www.dynatrace.com/news/press-release/dynatrace-3rd-gen-platform/)  
\- [Dynatrace Autonomous AI](https://www.webpronews.com/dynatrace-bets-on-autonomous-ai-to-tame-multi-cloud-complexity-as-enterprise-infrastructure-costs-spiral/)  
\- [Datadog Bits AI SRE Launch](https://www.datadoghq.com/about/latest-news/press-releases/datadog-launches-bits-ai-sre-agent-to-resolve-incidents-faster/)  
\- [Datadog LLM Observability Expansion](https://www.datadoghq.com/about/latest-news/press-releases/datadog-expands-llm-observability-with-new-capabilities-to-monitor-agentic-ai-accelerate-development-and-improve-model-performance/)  
\- [New Relic AI Impact Report 2026](https://newrelic.com/blog/ai/new-relic-ai-impact-report-2026)  
\- [New Relic AI GA Announcement](https://newrelic.com/blog/how-to-relic/nrai-agentic-ga)  
\- [AI-Powered Observability Tools Comparison - Dash0](https://www.dash0.com/comparisons/ai-powered-observability-tools)  
\- [Dynatrace vs Datadog vs New Relic 2026 - CubeAPM](https://cubeapm.com/blog/dynatrace-vs-datadog-vs-new-relic/)  
\- [Top AIOps Platforms 2026 - OpenObserve](https://openobserve.ai/blog/top-10-aiops-platforms/)  
\- [Gartner Strategic Predictions 2026](https://www.gartner.com/en/articles/strategic-predictions-for-2026)  
\- [Forrester Predictions 2026](https://www.forrester.com/blogs/predictions-2026-ai-agents-changing-business-models-and-workplace-culture-impact-enterprise-software/)  
\- [AI Agent Adoption 2026 - Analyst Data](https://joget.com/ai-agent-adoption-in-2026-what-the-analysts-data-shows/)  
\- [DevOps Statistics 2026 - StrongDM](https://www.strongdm.com/blog/devops-statistics)  
\- [Top AI DevOps Tools 2026 - Spacelift](https://spacelift.io/blog/ai-devops-tools)
