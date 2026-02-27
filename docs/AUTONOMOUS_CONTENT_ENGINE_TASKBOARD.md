# Autonomous Content Engine Taskboard

Last updated: 2026-02-27
Owner: QorSync AI (Accel4)

## Status Legend
- `TODO`
- `IN_PROGRESS`
- `BLOCKED`
- `DONE`

## Current Sprint Focus
- Build **agentized MVP** on top of existing scripts.
- Add durable scoring, approvals, and run history.

## Task List
| ID | Task | Status | Priority | Depends On | Definition of Done |
|---|---|---|---|---|---|
| ACE-001 | Public site split and deployment | DONE | P0 | - | Public `/landing` + `/blog` live and stable |
| ACE-002 | Rebrand content to QorSync AI + Accel4 attribution | DONE | P0 | ACE-001 | Brand and messaging updated in landing/blog |
| ACE-003 | Request Demo CTA to direct email | DONE | P0 | ACE-002 | CTA opens `mailto:dhawal.chheda@accel4.com` |
| ACE-004 | Convert pipeline to agent contract format | TODO | P0 | ACE-001 | Each stage has structured input/output schema |
| ACE-005 | Add per-stage quality scoring | TODO | P0 | ACE-004 | Brand/fact/SEO/readability scores stored per run |
| ACE-006 | Create approval packet generator | TODO | P0 | ACE-005 | One markdown/json packet per candidate article |
| ACE-007 | Add run history persistence (DB) | TODO | P0 | ACE-004 | Runs and stage outputs saved in Postgres |
| ACE-008 | Build docs ingestion pipeline for RAG | TODO | P0 | ACE-007 | Product docs indexed and retrievable by chunk |
| ACE-009 | Enforce citation-required drafting | TODO | P0 | ACE-008 | Draft fails if citation coverage below threshold |
| ACE-010 | Fact-check gate with fail/approve states | TODO | P0 | ACE-009 | Fact-check output attached to approval packet |
| ACE-011 | Integrate GA4 and GSC weekly ingestion | IN_PROGRESS | P1 | ACE-007 | Metrics captured to `article_metrics` table |
| ACE-012 | Build refresh-task generator | TODO | P1 | ACE-011 | Decaying pages auto-create refresh tasks |
| ACE-013 | Topic scoring model v1 | TODO | P1 | ACE-011 | New topics ranked by expected impact |
| ACE-014 | Optional CrewAI/LangGraph runtime migration | TODO | P2 | ACE-004..013 | Python runtime parity with same contracts |

## Implementation Notes (Already Done)
- Draft-generation scripts exist under `scripts/`.
- `published: true` gating is active in blog loader.
- Three new system-agnostic published seed posts are live.

## Active Decisions
1. Start with Node orchestration for speed.
2. Keep human approval mandatory until quality proves stable.
3. Keep SAP as one category, not product identity.
4. Use low-cost Postgres path first: local Postgres for dev, Cloud SQL deferred.
5. Keep publishing file-based in this repo (no CMS integration in MVP).
6. Analytics MVP scope: GA4 + GSC only (rank tracker later if needed).
7. Add manual LinkedIn distribution assist on each article via copy button.
8. Keyword strategy weighting locked to:
   - 60% AI/agents/autonomous operations
   - 25% governance/reliability/compliance
   - 15% system-specific integrations

## Open Questions (Need User Input)
1. Share GA4 and GSC credentials/service-account details when ready.
2. Confirm whether LinkedIn copy template should include company page URL/tagging format.

## Work Log
### 2026-02-27
- Completed public split deployment and initial autonomous pipeline scaffold.
- Repositioned copy to QorSync AI with Accel4 attribution.
- Updated demo CTA to email workflow.
- Added this taskboard and master planning docs.
- Locked MVP stack choices for low-cost implementation.
- Added manual LinkedIn copy-post button requirement to execution scope.
- Added analytics discovery and metrics ingestion scripts using Google ADC.
- Captured currently visible GA4/GSC assets and documented setup path.
- Created GA4 property `QorSync AI Public` (`526301790`) and web stream (`G-50B6DD0M9F`).
- Added frontend GA tag wiring via `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Added Search Console URL-prefix property for public URL (pending verification).
- Generated 100 keyword-driven articles via bulk pipeline with publish=true.
- Added author branding pass: Dhawal Chheda bylines, author page, and article schema updates.
- Updated keyword planner to enforce AI-first weighting and validated 500-topic output (300/125/75 split).
