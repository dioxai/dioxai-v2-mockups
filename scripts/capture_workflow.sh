#!/usr/bin/env bash
# Capture 3 screenshots of the workflow builder for the contact sheet.
# Empty state, mid-generation (loading), completed diagram.
# Uses local files via file:// — fast & doesn't depend on Pages cache.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
URL_BASE="file://${ROOT}/workflow-builder/index.html"
OUT="${ROOT}/screenshots"
mkdir -p "$OUT"

CHROMIUM="/opt/homebrew/bin/chromium"
WIDTH=1440
HEIGHT=900

echo "[wb] root = $ROOT"

# 1) Empty state
"$CHROMIUM" --headless=new --disable-gpu --hide-scrollbars --no-sandbox \
  --window-size=${WIDTH},${HEIGHT} \
  --screenshot="$OUT/wb_01_empty.png" \
  "$URL_BASE" >/dev/null 2>&1
echo "[wb] empty state captured"

# 2) Mid-generation — pass a query param that builder.js can react to (we'll add a debug hook)
"$CHROMIUM" --headless=new --disable-gpu --hide-scrollbars --no-sandbox \
  --window-size=${WIDTH},${HEIGHT} \
  --screenshot="$OUT/wb_02_loading.png" \
  "${URL_BASE}?debug=loading" >/dev/null 2>&1
echo "[wb] mid-generation captured"

# 3) Completed diagram — auto-render example #0 (real estate)
"$CHROMIUM" --headless=new --disable-gpu --hide-scrollbars --no-sandbox \
  --window-size=${WIDTH},1500 \
  --virtual-time-budget=4500 \
  --screenshot="$OUT/wb_03_completed.png" \
  "${URL_BASE}?debug=example&ex=0" >/dev/null 2>&1
echo "[wb] completed diagram captured"

ls -la "$OUT"/wb_*.png
