# Autonomous Content Pipeline

This repo includes a minimal autonomous content pipeline for SEO/blog growth.

## Scripts

- `npm run trends:scan`
  - Pulls SAP/ERP/enterprise-AI trending topics from Google News RSS.
  - Writes `data/trends.json`.

- `npm run article:generate -- --topic "Your Topic"`
  - Generates one draft markdown article in `content/blog`.
  - Uses OpenAI when `OPENAI_API_KEY` is set.
  - Falls back to a deterministic template when no API key exists.
  - Drafts are `published: false` by default.

- `npm run pipeline:run`
  - Reads `data/trends.json` and generates multiple draft articles.

## Publishing workflow

1. Run trend scan.
2. Run pipeline/article generation.
3. Human edit for quality and factual accuracy.
4. Flip `published: false` -> `published: true` in frontmatter.
5. Commit and deploy.

## Environment Variables

- `OPENAI_API_KEY` (optional)
- `OPENAI_MODEL` (optional, default: `gpt-5-mini`)

## Notes

- Keep a human-in-the-loop review before publishing.
- Add plagiarism/compliance checks before scaling to high volume.
