# Analytics + Search Console Setup

This project ingests performance data using Google APIs and Application Default Credentials (ADC).

## What is already configured
- ADC with required scopes has been authenticated.
- Quota project is set to `aibrain-ceo-live-20260218`.
- Required APIs are enabled:
  - `analyticsadmin.googleapis.com`
  - `analyticsdata.googleapis.com`
  - `searchconsole.googleapis.com`

## Commands
1. Discover available GA4 and Search Console assets:
```bash
npm run analytics:discover
```
Output file:
- `data/analytics-discovery.json`

2. Ingest metrics snapshot (last 7 days by default):
```bash
npm run metrics:ingest -- --days 7
```
Output file:
- `data/metrics/YYYY-MM-DD.json`

## Required environment variables
Set in `.env.local`:
```bash
GA4_PROPERTY_ID=<ga4_property_id>
GSC_SITE_URL=<search_console_site_url>
GCP_QUOTA_PROJECT=aibrain-ceo-live-20260218
```

## Current account discovery snapshot (2026-02-27)
GA4 properties currently visible:
- `368810901` (`ketofusionhub`)
- `485910382` (`accel4academy`)

Search Console sites currently visible:
- `sc-domain:chainsync.info`
- `https://chainsync-340970450219.us-central1.run.app/`

These do **not** currently include the public site URL (`https://aibrain-public-kra76e62ga-uc.a.run.app`).

## To finish full metrics ingestion for this site
1. Create/select a GA4 property for the public site and set `GA4_PROPERTY_ID`.
2. Add the public site as a Search Console property and set `GSC_SITE_URL`.
3. Re-run `npm run metrics:ingest`.

## Notes
- Metrics ingestion gracefully runs even if one source is not configured.
- Missing source configs are reported in command output.
