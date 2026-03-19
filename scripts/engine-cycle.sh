#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

COUNT="${ENGINE_COUNT:-12}"
KNOWLEDGE_LIMIT="${ENGINE_KNOWLEDGE_LIMIT:-1200}"
KEYWORD_COUNT="${ENGINE_KEYWORD_COUNT:-400}"
QUOTA_PROJECT="${GCP_QUOTA_PROJECT:-aibrain-ceo-live-20260218}"
ACCOUNT="${GCP_ACCOUNT:-dhawal.chheda@gmail.com}"
PROJECT="${GCP_PROJECT:-aibrain-ceo-live-20260218}"
LOG_FILE="$ROOT_DIR/logs/engine-cycle.log"
LOCK_FILE="$ROOT_DIR/logs/engine-cycle.lock"

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] skipped: lock held" >> "$LOG_FILE"
  exit 0
fi

run_step() {
  local label="$1"
  local timeout_seconds="$2"
  shift 2
  echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] step_start=$label timeout=${timeout_seconds}s"
  if ! timeout "$timeout_seconds" "$@"; then
    echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] step_failed=$label"
    return 1
  fi
  echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] step_ok=$label"
}

{
  echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] cycle start count=$COUNT"

  run_step "trends_scan" 120 node scripts/trend-finder.mjs --limit 25 || true
  run_step "keywords_plan" 180 node scripts/keywords-plan.mjs --count "$KEYWORD_COUNT"
  run_step "agents_ingest" 240 node scripts/agents/ingest-docs.mjs --limit "$KNOWLEDGE_LIMIT"
  run_step "topic_score" 180 node scripts/agents/topic-scoring.mjs
  run_step "agents_run" 1200 node scripts/agents/run-autonomous-pipeline.mjs --topics-file data/topic-priority.json --count "$COUNT" --auto-publish true --skip-existing true
  run_step "refresh_queue" 180 node scripts/agents/build-refresh-queue.mjs
  RUNS_CREATED="$(node --input-type=module -e "import fs from 'fs'; const p='data/runs/latest-summary.json'; let n=0; try { const j=JSON.parse(fs.readFileSync(p,'utf-8')); n=(j.runs||[]).length; } catch {} process.stdout.write(String(n));")"
  echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] runs_created=$RUNS_CREATED"
  if [ "$RUNS_CREATED" = "0" ]; then
    echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] no new runs; skipping build/deploy"
    echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] cycle complete"
    exit 0
  fi

  run_step "build" 1800 npx --yes next build

  run_step "gcloud_set_account" 60 gcloud config set account "$ACCOUNT"
  run_step "gcloud_set_project" 60 gcloud config set project "$PROJECT"
  run_step "cloud_run_deploy" 3600 gcloud run deploy aibrain-public --source . --region us-central1 --allow-unauthenticated

  TOKEN="$(gcloud auth application-default print-access-token)"
  run_step "sitemap_submit" 120 curl -sS -X PUT "https://searchconsole.googleapis.com/webmasters/v3/sites/sc-domain%3Aqorsync.online/sitemaps/https%3A%2F%2Fqorsync.online%2Fsitemap.xml" \
    -H "Authorization: Bearer $TOKEN" \
    -H "x-goog-user-project: $QUOTA_PROJECT" \
    -H "Content-Length: 0" >/dev/null

  echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] cycle complete"
} >> "$LOG_FILE" 2>&1
