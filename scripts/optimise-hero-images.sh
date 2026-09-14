#!/usr/bin/env bash
# Compress large hero JPEGs for faster first paint.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/public/images"

FILES=(
  campus/hero-ellesmere-authentic.jpg
  schools/doha-horizon.jpg
  campus/hero-middle-east.jpg
)

for f in "$FILES"; do
  if [[ ! -f "$f" ]]; then
    echo "Skip missing $f"
    continue
  fi
  echo "Optimising $f ($(du -h "$f" | cut -f1))"
  tmp="/tmp/$(basename "$f")"
  ffmpeg -y -hide_banner -loglevel error -i "$f" -vf "scale='min(1920,iw)':-2" -q:v 4 "$tmp"
  mv "$tmp" "$f"
  echo "  → $(du -h "$f" | cut -f1)"
done

echo "Done."
