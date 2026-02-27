# Autonomous Content Engine Master Plan

## 1) Purpose
Build a near-autonomous SEO/content system for **QorSync AI (an Accel4 product)** that continuously:
1. Finds opportunities.
2. Produces high-quality draft content.
3. Enforces brand + factual guardrails.
4. Publishes with human approval.
5. Learns from performance data.

This document is the canonical implementation plan for future sessions.

## 2) Product/Brand Constraints
- Brand: **QorSync AI**.
- Parent company attribution: **An Accel4 Product**.
- Positioning: **Autonomous Enterprise Operations** (system-agnostic), not SAP-only.
- Governance: human-in-the-loop for publish and high-risk claims.
- Quality: factual, evidence-backed, no hype/overclaim language.

## 3) Current State (As of 2026-02-27)
Completed baseline:
- Public site split into standalone repo/service: `/home/dhawal/aibrain-public`.
- Public routes live: `/landing`, `/blog`, `/blog/[slug]`.
- Blog data layer with `published: true` gating.
- Trend scan + draft generation scripts exist.
- Draft-only default publishing behavior exists.
- Cloud Run service deployed publicly: `aibrain-public`.

Current limitation:
- Pipeline is still script-based and linear; no persistent learning loop or scoring DB yet.

## 4) Recommended Architecture (MVP-first)
### 4.1 Orchestration Layer
Keep current Node orchestration initially (fastest delivery):
- `scripts/trend-finder.mjs`
- `scripts/content-pipeline.mjs`
- `scripts/article-generator.mjs`

Then evolve to agent contracts using JSON handoff files.

### 4.2 Agent Contract Layer (v1 in Node)
Agents (modular scripts/services):
1. `trend_scout`
2. `keyword_hunter`
3. `content_strategist`
4. `research_summarizer`
5. `article_writer`
6. `seo_optimizer`
7. `brand_editor`
8. `fact_checker`
9. `publisher`
10. `performance_analyst`

Each agent should accept/return structured payloads (`topic_id`, `confidence`, `citations`, `scores`, `next_action`).

### 4.3 Knowledge/RAG Layer
Use Postgres + `pgvector` (Supabase-compatible):
- Indexed corpora: product docs, release notes, approved blog posts, implementation guides.
- Retrieval required during writing + fact-check steps.
- Minimum requirement: article sections must map to cited source chunks.

### 4.4 Governance Layer
Hard publish gates:
- Relevance score >= threshold.
- Brand compliance pass.
- Fact-check pass with citations.
- SEO quality pass.
- Human approval for final publish.

### 4.5 Feedback Layer
Weekly ingestion from:
- Google Search Console.
- GA4.
- Rank tracker (optional phase 2).

Use feedback to trigger:
- Content refresh tasks.
- Topic prioritization updates.
- Prompt/policy tuning.

## 5) Phase Plan
## Phase 0 - Foundation (Done)
- Public site + blog + draft pipeline live.

## Phase 1 - Agentized MVP (In Progress)
Goals:
- Break monolithic script flow into agent contracts.
- Add quality scoring and approval artifacts.
- Add DB for task/history state.

Deliverables:
- `docs/agent-contracts.md`
- `scripts/agents/*`
- `data/runs/<run_id>.json` with stage scores
- Approval summary email payload

## Phase 2 - Knowledge + Quality Hardening
Goals:
- Production RAG grounding.
- Strict citation + fact-check workflow.

Deliverables:
- Ingestion pipeline for docs into vector store.
- Required citation checks in writer/editor.
- Hallucination guard rails.

## Phase 3 - Feedback + Optimization Loop
Goals:
- Closed loop from published performance to planning.

Deliverables:
- GSC/GA4 ingestion job.
- Refresh queue generator.
- Topic scoring model v1.

## Phase 4 - Runtime Upgrade (Optional)
Goal:
- Move orchestration to CrewAI/LangGraph if complexity requires.

Deliverables:
- Equivalent contract-compatible runtime in Python.
- Same gates, same data model, same approval flow.

## 6) Data Model (Minimum)
Tables/collections needed:
1. `topics`
- `id`, `title`, `source`, `trend_score`, `intent`, `status`.

2. `content_runs`
- `run_id`, `topic_id`, `stage`, `input_ref`, `output_ref`, `score`, `status`, `timestamp`.

3. `articles`
- `slug`, `title`, `category`, `published`, `quality_score`, `citation_score`, `created_at`.

4. `article_metrics`
- `slug`, `date`, `impressions`, `clicks`, `ctr`, `position`, `sessions`, `conversions`.

5. `refresh_tasks`
- `id`, `slug`, `reason`, `priority`, `status`.

## 7) Quality Rubric
Score range: 0-100.
- Brand fit: 20
- Factuality/citations: 30
- SEO structure: 20
- Readability/usefulness: 20
- Novelty/topic differentiation: 10

Publish policy:
- `<80`: block
- `80-89`: requires manual rewrite approval
- `>=90`: eligible for standard approval flow

## 8) Operations Runbook
Daily:
1. Run trend scan.
2. Generate candidate topics.
3. Draft 2-5 articles.
4. Run quality gates and create approval packet.

Weekly:
1. Pull GSC/GA4 metrics.
2. Generate refresh queue.
3. Tune prompts/scoring thresholds.

Monthly:
1. Evaluate category performance.
2. Rebalance content mix.
3. Archive low-value topics.

## 9) Risks and Mitigations
1. Hallucinations
- Mitigation: required citations + fact-check gate.

2. Brand drift
- Mitigation: strict brand editor and forbidden-phrase rules.

3. SEO spam signal risk
- Mitigation: capped volume, high editorial standards, topical clustering.

4. Tool/API outages
- Mitigation: retries, fallback providers, cached trend inputs.

## 10) Definition of Done (Engine MVP)
MVP is complete when:
1. End-to-end run creates drafts with per-stage scoring artifacts.
2. Human approval packet is generated automatically.
3. Publish remains draft-only unless explicitly approved.
4. Weekly analytics refresh creates actionable refresh tasks.
5. All of the above documented and reproducible from repo scripts.

## 11) Source of Truth Files
- Master plan: `docs/AUTONOMOUS_CONTENT_ENGINE_MASTER_PLAN.md`
- Active task list: `docs/AUTONOMOUS_CONTENT_ENGINE_TASKBOARD.md`
- Session resume protocol: `docs/SESSION_BOOTSTRAP_PROTOCOL.md`

If context is lost in future sessions, start by reading those three files.

## 12) MVP Stack Decisions (Locked)
1. Storage/runtime history: Postgres-first with minimal-cost setup.
2. Development DB: local Postgres.
3. Cloud DB: defer paid Cloud SQL; use low/near-zero cost option until traffic justifies upgrade.
4. Publishing flow: repo-file based publishing (no CMS integration in MVP).
5. Analytics loop: GA4 + GSC first; external rank tracker deferred.
