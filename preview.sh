#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "→ Building system-design section..."
cd "$ROOT/system-design"
npm run build

echo "→ Assembling _site/..."
cd "$ROOT"
rm -rf _site
mkdir -p _site

# Portfolio static files
cp index.html blog.html dsa.html headshot.jpg _site/ 2>/dev/null || true
cp -r blog dsa-assets _site/ 2>/dev/null || true

# Astro build output under /system-design/
mkdir -p _site/system-design
cp -r system-design/dist/. _site/system-design/

echo "→ Serving at http://localhost:8000"
echo "   Portfolio:     http://localhost:8000/"
echo "   System design: http://localhost:8000/system-design/"
echo ""
cd _site && python3 -m http.server 8000
