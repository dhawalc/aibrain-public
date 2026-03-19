# Domain Cutover Runbook

Last updated: 2026-03-04

## Candidate domains (low-cost first-year style TLDs)
- qorsync.online
- qorsync.website
- qorsync.shop
- qorsync.store
- qorsync.space
- getqorsync.online
- runqorsync.online

## Notes
- Sub-$1 pricing is typically first-year promo only; renewals are higher.
- Buy whichever has the best first-year + renewal combo at checkout.

## After purchase: connect domain to Cloud Run
1. Create domain mapping:
```bash
gcloud run domain-mappings create \
  --service aibrain-public \
  --domain YOUR_DOMAIN \
  --region us-central1
```

2. Add DNS records shown by Cloud Run in your registrar DNS panel.

3. Update service env vars so canonical/sitemap/llms point to your domain:
```bash
gcloud run services update aibrain-public \
  --region us-central1 \
  --update-env-vars NEXT_PUBLIC_SITE_URL=https://YOUR_DOMAIN,GSC_SITE_URL=https://YOUR_DOMAIN/
```

4. Re-submit in Search Console and request indexing:
- `https://YOUR_DOMAIN/landing`
- `https://YOUR_DOMAIN/blog`
- `https://YOUR_DOMAIN/sitemap.xml`

5. Verify:
```bash
curl -sS https://YOUR_DOMAIN/robots.txt
curl -sS https://YOUR_DOMAIN/sitemap.xml | head
curl -sS https://YOUR_DOMAIN/llms.txt | head
```
