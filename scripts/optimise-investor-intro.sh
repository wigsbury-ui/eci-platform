#!/usr/bin/env bash
# Optimise Investor_Intro_with_captions.mp4 for the Growth hero.
# Usage: scripts/optimise-investor-intro.sh [path-to-source.mp4]

set -euo pipefail

SRC="${1:-}"
if [[ -z "$SRC" ]]; then
  for candidate in \
    "$HOME/Downloads/Investor_Intro_with_captions.mp4" \
    "/workspace/Downloads/Investor_Intro_with_captions.mp4" \
    "./Investor_Intro_with_captions.mp4"
  do
    if [[ -f "$candidate" ]]; then SRC="$candidate"; break; fi
  done
fi

if [[ -z "$SRC" || ! -f "$SRC" ]]; then
  echo "Source video not found. Pass the path to Investor_Intro_with_captions.mp4" >&2
  exit 1
fi

OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/videos"
mkdir -p "$OUT_DIR"
OUT="$OUT_DIR/investor-intro.mp4"
POSTER="$OUT_DIR/investor-intro-poster.jpg"

echo "Source: $SRC ($(du -h "$SRC" | cut -f1))"
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$SRC" || true

# H.264 + AAC, 1280px wide, CRF 28, faststart for progressive play
ffmpeg -y -i "$SRC" \
  -vf "scale='min(1280,iw)':-2" \
  -c:v libx264 -preset medium -crf 28 -pix_fmt yuv420p \
  -c:a aac -b:a 96k -ac 2 \
  -movflags +faststart \
  "$OUT"

# Poster frame ~1s in
ffmpeg -y -ss 1 -i "$OUT" -frames:v 1 -q:v 3 "$POSTER"

echo "Wrote $OUT ($(du -h "$OUT" | cut -f1))"
echo "Wrote $POSTER"
