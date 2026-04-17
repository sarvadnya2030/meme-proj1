#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="${ROOT_DIR}/dist"

rm -rf "${DIST_DIR}"
mkdir -p "${DIST_DIR}" "${DIST_DIR}/memes"

cp "${ROOT_DIR}/index.html" "${DIST_DIR}/index.html"
cp "${ROOT_DIR}/styles.css" "${DIST_DIR}/styles.css"
cp "${ROOT_DIR}/app.js" "${DIST_DIR}/app.js"
cp -r "${ROOT_DIR}/memes/." "${DIST_DIR}/memes/"
