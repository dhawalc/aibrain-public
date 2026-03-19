# SEO Phase 2 Master Plan

Last compiled: 2026-03-19

## Critical Fix (Do Before Anything Else)

**Email capture is broken.** The `EmailCapture` component at `components/email-capture.tsx` saves to localStorage only. Emails are captured and silently discarded. Connect to Loops.so (free tier), Mailchimp, or ConvertKit immediately.

## Phase 2 Priorities (Ordered by Impact)

### Week 1: Fix Infrastructure

1. **Connect email capture to real email platform** (Loops.so free tier recommended)
2. **Fix broken internal links** in multi-agent-execution-playbook.md (links to unpublished slugs)
3. **Fix truncated slug** — agent-orchestration-for-enterprise-workflows-implementation-bluepri.md
4. **Add GA4 events**: tool_started, tool_completed, article_read_depth_75
5. **Add Organization schema** with sameAs for LinkedIn
6. **Add revalidate = 3600** to blog index, homepage, author page
7. **Deploy Cloudflare CDN** (free tier) in front of Cloud Run

### Week 2: Content — Comparison Articles (Biggest Gap)

Write these 5 comparison articles (the site has ZERO comparison content):
1. AI Agents vs RPA (very high volume)
2. Agentic AI vs Traditional Automation
3. AI Agents vs Copilots
4. HITL vs Human-on-the-Loop
5. BPM vs Workflow Automation vs AI Agents

### Week 3: Content — Glossary + Definitions

Write these definitional pages (capture AI Overviews and featured snippets):
1. What Is Agentic AI?
2. What Is Human-in-the-Loop?
3. What Is Workflow Orchestration?
4. What Is Agentic Process Automation (APA)?

### Week 4: Content — Industry Verticals

Write department/industry-specific pages (highest conversion intent):
1. AI Agents for Finance (accounts payable, treasury)
2. AI Agents for HR (onboarding, approvals)
3. AI Agents for Procurement (PO routing, vendor management)
4. AI Workflow for Healthcare (prior auth, HIPAA)
5. AI Governance for Manufacturing

### Month 2: Tools

Build these tools (ranked by impact):
1. Process Automation Opportunity Scorer — "which process should I automate first?"
2. Approval Bottleneck Cost Calculator — what delays cost you
3. RPA vs Agentic AI Suitability Scorer — input process, get recommendation
4. AI Governance Compliance Checker — SOC2/SOX/HIPAA/GDPR readiness
5. Build vs Buy AI Automation Decision Tool

### Month 2: Conversion Optimization

1. Build 7-email nurture sequence (day 0, 3, 7, 10, 14, 17, 21)
2. Replace "Request Demo" with 3-tier CTA ladder: See It Work / Run Your Numbers / Get Custom Demo
3. Add exit intent popup on homepage (governance checklist download)
4. Deploy chatbot (Crisp free tier) with 4-question qualification flow
5. Build interactive product tour (Arcade $32/mo)
6. Create a pricing/investment page
7. Build composite narrative case studies

### Month 2-3: AI Search Optimization (AEO)

1. **Name your frameworks** — "QorSync Risk-Tiered Approval Architecture (RTAA)"
2. **Add answer capsules** — 40-60 word direct answers after every H2
3. **Create glossary page** at /glossary defining all key concepts
4. **Open-source risk tiering framework** on GitHub as a named standard
5. **Seed Reddit discussions** in r/artificial, r/devops, r/sysadmin, r/MachineLearning
6. **Publish on DEV.to** — all 13 articles with canonical tags
7. **Create llms-full.txt** — full article content for LLM RAG retrieval

### Month 2-3: Link Building

1. Submit PRs to 7 GitHub Awesome lists
2. Email IAPP for governance resources listing
3. Submit VentureBeat guest post
4. Register on Qwoted as expert source
5. Outreach to 10+ "best AI tools" roundup pages
6. Package risk tiering framework as arXiv white paper

### Month 3: Original Research

Launch "State of Enterprise AI Governance 2026" survey:
- 100-200 responses via LinkedIn + Reddit
- Publish as gated PDF + ungated executive summary
- Pitch pre-release data to VentureBeat, InformationWeek, CIO.com

## Key Metrics to Track

| Metric | Tool | Target |
|---|---|---|
| Organic sessions | GA4 | 500/month by month 3 |
| Email subscribers | Email platform | 200 by month 3 |
| Tool completions | GA4 events | 50/month |
| Demo requests | GA4 | 5/month |
| Indexed pages | GSC | All 17 articles + 3 tools |
| Copilot citations | Bing Webmaster Tools | Appear for target queries |
| Backlinks | Ahrefs/GSC | 50+ referring domains by month 3 |

## Technical SEO Corrections

- FAQPage schema is RESTRICTED to gov/health sites — skip it
- HowTo schema is DEPRECATED — skip it
- Sitemap lastModified using new Date() is wrong — use actual content dates
- 5 thin articles still published (under 400 words) — expand or noindex
- Add Cache-Control headers for static pages
- Consider Cloudflare CDN (free) in front of Cloud Run

## Research Reports Available

Full detailed reports from research agents saved in agent output files:
- Content gaps: 30 next articles prioritized
- Technical SEO: CWV, schema, internal linking, CDN, freshness
- Backlinks: 20+ resource pages, guest post targets, podcast outreach
- Conversion: Landing page, email sequences, chatbot, pricing, retargeting
- AI Search (AEO): LLM citation mechanics, brand mentions, named frameworks
- Next tools: 10 tools ranked with full specs
- Growth hacks: 15 zero-budget tactics ranked
