# AI Brain Public

Public-facing landing and blog service for AI Brain.

## Scope

This service is intentionally public and independent from the private AI Brain application.

- Public routes:
  - `/landing`
  - `/blog`
  - `/blog/[slug]`
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
NEXT_PUBLIC_PRIVATE_APP_URL=https://aibrain-frontend-375423256919.us-central1.run.app
NEXT_PUBLIC_SITE_URL=https://<your-public-service-url>
OPENAI_API_KEY=<optional>
OPENAI_MODEL=gpt-5-mini
```

## Content model

Blog posts live under `content/blog/*.md` (or `.mdx`) and must include:

```yaml
---
title: "..."
description: "..."
date: "2026-02-27"
category: "SAP Migration"
author: "AI Brain Team"
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

Quick commands:

```bash
npm run trends:scan
npm run pipeline:run
npm run article:generate -- --topic "SAP API governance in 2026"
```

Generated articles default to `published: false`.

## Deploy to Cloud Run

```bash
gcloud run deploy aibrain-public \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```
