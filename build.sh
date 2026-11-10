#!/usr/bin/env bash
# Regenera js/app.bundle.js a partir de los módulos de js/ (requiere Node.js).
# Uso: ./build.sh
set -e
cd "$(dirname "$0")"
npx --yes esbuild@0.24.0 js/app.js --bundle --format=iife --target=es2020 --legal-comments=none \
  --banner:js="/* GAFI Analizador · bundle generado desde js/app.js (no editar a mano; ver README) */" \
  --outfile=js/app.bundle.js
echo "Listo: js/app.bundle.js"
