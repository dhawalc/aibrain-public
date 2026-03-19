#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

SLEEP_SECONDS="${ENGINE_SLEEP_SECONDS:-1800}"

while true; do
  bash scripts/engine-cycle.sh || true
  sleep "$SLEEP_SECONDS"
done
