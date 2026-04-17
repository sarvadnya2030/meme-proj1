#!/usr/bin/env bash
set -euo pipefail

APP_NAME="meme-mirror"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: Docker is not installed. Install Docker first."
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
else
  echo "Error: Docker Compose is not available."
  exit 1
fi

mkdir -p "${PROJECT_DIR}/screenshots" "${PROJECT_DIR}/recordings"

if command -v xhost >/dev/null 2>&1; then
  xhost +local:docker >/dev/null 2>&1 || true
fi

export DISPLAY="${DISPLAY:-:0}"
export MEME_MIRROR_NAME="${MEME_MIRROR_NAME:-OYO}"

cd "${PROJECT_DIR}"
echo "Starting ${APP_NAME} with DISPLAY=${DISPLAY} and MEME_MIRROR_NAME=${MEME_MIRROR_NAME}"
${COMPOSE_CMD} up --build
