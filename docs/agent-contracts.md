# Agent Contracts (ACE-004)

This defines the JSON contract used by each autonomous content stage.

## Envelope
Each stage output must contain:

- `run_id`: UUID for pipeline run
- `agent`: one of:
  - `trend_scout`
  - `keyword_hunter`
  - `content_strategist`
  - `research_summarizer`
  - `article_writer`
  - `seo_optimizer`
  - `brand_editor`
  - `fact_checker`
  - `publisher`
  - `performance_analyst`
- `topic_id`: stable topic key
- `timestamp`: ISO timestamp
- `input`: input payload for stage
- `output`: result payload for stage
- `scores`: stage-level confidence/quality
- `next_action`: next stage or `complete`

## Quality/Gate Policy
Publish eligibility requires all of the following:

- Citation score >= 70
- Fact score >= 75
- SEO score >= 70
- Brand score >= 85
- Overall quality >= 80
- At least 3 in-body citation references (`[CIT-x]`)

## Artifacts
Per run:

- `data/runs/<run_id>.json`
- `data/runs/latest-summary.json`
- `data/approvals/<run_id>/approval.json`
- `data/approvals/<run_id>/approval.md`

Published/draft article output:

- `content/blog/<slug>.md`

## Persistence
If `DATABASE_URL` is configured and `pg` is installed:

- `content_runs`
- `content_stage_outputs`
- `knowledge_chunks`
- `article_metrics`

Otherwise all outputs remain file-backed and pipeline still runs.
