# QorSync AI Public

Public-facing landing and blog service for QorSync AI, an Accel4 product.

## Scope

This service is intentionally public and independent from the private QorSync AI application.

- Public routes:
  - `/landing`
  - `/blog`
  - `/blog/[slug]`
  - Blog articles include a `Copy LinkedIn Post` helper button for manual posting.
- Private app remains separate behind Google auth.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000/landing and http://localhost:3000/blog.

## Environment variables

Create `.env.local`:

```bash
NEXT_PUBLIC_DEMO_EMAIL=dhawal.chheda@accel4.com
NEXT_PUBLIC_SITE_URL=https://<your-public-service-url>
OPENAI_API_KEY=<optional>
OPENAI_MODEL=gpt-5-mini
GA4_PROPERTY_ID=
GSC_SITE_URL=
GCP_QUOTA_PROJECT=aibrain-ceo-live-20260218
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

## Content model

Blog posts live under `content/blog/*.md` (or `.mdx`) and must include:

```yaml
---
title: "..."
description: "..."
date: "2026-02-27"
category: "Agentic Automation & Orchestration"
author: "QorSync AI Team"
readTime: "8 min read"
published: true
---
```

Only `published: true` posts are rendered.

## SEO

- `app/sitemap.ts` emits landing/blog/post URLs
- `app/robots.ts` publishes robots policy and sitemap

## Autonomous content pipeline

See [AUTONOMOUS_CONTENT_PIPELINE.md](./AUTONOMOUS_CONTENT_PIPELINE.md).

Execution planning and active status:
- [docs/AUTONOMOUS_CONTENT_ENGINE_MASTER_PLAN.md](./docs/AUTONOMOUS_CONTENT_ENGINE_MASTER_PLAN.md)
- [docs/AUTONOMOUS_CONTENT_ENGINE_TASKBOARD.md](./docs/AUTONOMOUS_CONTENT_ENGINE_TASKBOARD.md)
- [docs/SESSION_BOOTSTRAP_PROTOCOL.md](./docs/SESSION_BOOTSTRAP_PROTOCOL.md)

Quick commands:

```bash
npm run trends:scan
npm run pipeline:run
npm run article:generate -- --topic "Human-in-the-loop approval architecture"
npm run keywords:plan -- --count 100
npm run articles:bulk -- --count 100 --publish true
npm run analytics:discover
npm run metrics:ingest -- --days 7
```

Generated articles default to `published: false`.

## Deploy to Cloud Run

```bash
gcloud run deploy aibrain-public \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```
