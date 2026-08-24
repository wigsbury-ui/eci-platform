#!/usr/bin/env bash
# Optimise brand-licensing video for the Growth investors module.
# Usage: scripts/optimise-brand-licensing.sh [path-to-source.mp4]

set -euo pipefail

SRC="${1:-}"
if [[ -z "$SRC" ]]; then
  for candidate in \
    /tmp/eci-videos/brand-licensing-source.mp4 \
    "$HOME/Downloads/brand-licensing.mp4" \
    "/workspace/inbox/videos/brand-licensing.mp4"
  do
    if [[ -f "$candidate" ]]; then SRC="$candidate"; break; fi
  done
fi

if [[ -z "$SRC" || ! -f "$SRC" ]]; then
  echo "Source video not found." >&2
  exit 1
fi

OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/videos"
mkdir -p "$OUT_DIR"
OUT="$OUT_DIR/brand-licensing.mp4"
POSTER="$OUT_DIR/brand-licensing-poster.jpg"

echo "Source: $SRC ($(du -h "$SRC" | cut -f1))"

# 1280px, CRF 24 (quality-first), AAC 128k, faststart
ffmpeg -y -i "$SRC" \
  -vf "scale='min(1280,iw)':-2" \
  -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -ac 2 \
  -movflags +faststart \
  "$OUT"

ffmpeg -y -ss 1.5 -i "$OUT" -frames:v 1 -q:v 3 -update 1 "$POSTER"

echo "Wrote $OUT ($(du -h "$OUT" | cut -f1))"
echo "Wrote $POSTER"
