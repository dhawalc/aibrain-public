# Demand Engine Plan (Traffic -> Demos)

Last updated: 2026-03-04

## Objective
- Drive qualified traffic to the public site.
- Convert traffic into demo requests with measurable attribution.

## Implemented Foundations
- Source-tagged demo CTA links with UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`).
- GA lead event on demo CTA click (`generate_lead`).
- Canonical metadata on landing, blog, and article pages.
- RSS feed (`/rss.xml`) and LLM crawler hint file (`/llms.txt`).
- Sitemap quality control: excludes templated posts, capped by `SITEMAP_MAX_POSTS`.
- Article-level `noindex` for templated/fallback-style content.

## Channel Strategy
1. Search (SEO)
- Focus indexing on non-templated, high-intent pages.
- Publish fewer but deeper pillar pages with real examples and citations.
- Build internal links from pillar pages to supporting implementation guides.

2. LLM Discovery
- Maintain `/llms.txt` with best pages only.
- Keep article schema and author identity consistent.
- Reduce repetitive/near-duplicate posts that hurt citation trust.

3. Distribution
- Push each curated post to LinkedIn (founder + company page).
- Repurpose into short threads/checklists linking back to the article URL with UTMs.
- Submit RSS feed to relevant aggregators/newsletters.

4. Conversion
- Route CTAs to a dedicated demo URL (`NEXT_PUBLIC_DEMO_URL`) such as Calendly.
- Keep fallback mailto if no booking URL is configured.
- Track lead clicks with GA event + UTM source.

## Weekly Operating Cadence
1. Monday
- Review GSC + GA metrics.
- Select top 3 topics by business intent.

2. Tuesday-Thursday
- Draft 3 articles.
- Human review for factual quality and differentiation.
- Publish only approved pages.

3. Friday
- Distribute all published pages on LinkedIn.
- Record demo clicks by source and top landing pages.

## KPI Targets (first 30 days)
- Indexed high-quality pages: 20-40
- Organic impressions: +100% baseline
- Demo CTA click-through (session -> click): >= 1.5%
- Demo requests (click -> booked/qualified): >= 15%

## Non-Negotiables
- No bulk publishing of templated pages.
- Every published page must have clear unique value and practical depth.
- Keep human approval before publishing.
