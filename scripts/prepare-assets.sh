#!/usr/bin/env bash
# ==============================================================================
# CSE 2205 - Asset Preparation Script
# Converts PPTX to PDF, generates thumbnails, and optimizes note scans.
# Run from repository root: ./scripts/prepare-assets.sh
# ==============================================================================

set -euo pipefail

SLIDES_SRC="./slides_input"
SLIDES_PDF_DIR="./public/assets/slides/pdf"
SLIDES_PPTX_DIR="./public/assets/slides/pptx"
SLIDES_THUMB_DIR="./public/assets/slides/thumbs"
NOTES_PDF_DIR="./public/assets/notes/pdf"
NOTES_THUMB_DIR="./public/assets/notes/thumbs"

mkdir -p "$SLIDES_PDF_DIR" "$SLIDES_PPTX_DIR" "$SLIDES_THUMB_DIR" "$NOTES_PDF_DIR" "$NOTES_THUMB_DIR"

echo "=== CSE 2205 Asset Preparation ==="

# 1. Convert any PPTX in root or input to PDF via LibreOffice (if installed)
if command -v soffice &>/dev/null; then
  echo "Converting PPTX decks to PDF..."
  soffice --headless --convert-to pdf --outdir "$SLIDES_PDF_DIR" *.pptx 2>/dev/null || true
else
  echo "[Info] LibreOffice (soffice) not found in PATH. Place pre-converted PDFs in $SLIDES_PDF_DIR"
fi

# 2. Generate WebP thumbnails (first slide/page)
if command -v pdftoppm &>/dev/null && command -v cwebp &>/dev/null; then
  echo "Generating thumbnails..."
  for pdf in "$SLIDES_PDF_DIR"/*.pdf; do
    if [ -f "$pdf" ]; then
      base=$(basename "$pdf" .pdf)
      pdftoppm -f 1 -l 1 -r 75 -png "$pdf" "/tmp/${base}_thumb"
      cwebp -q 80 "/tmp/${base}_thumb-1.png" -o "$SLIDES_THUMB_DIR/${base}.webp" 2>/dev/null || true
      rm -f "/tmp/${base}_thumb-1.png"
    fi
  done
else
  echo "[Info] pdftoppm or cwebp not installed. SVG/CSS fallback thumbnails will be used."
fi

echo "Asset preparation completed successfully!"
