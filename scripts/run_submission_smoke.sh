#!/usr/bin/env bash
# Smoke tests for submission API
# Usage: ./scripts/run_submission_smoke.sh [BASE_URL] [SUBMISSION_ID] [FILE_PATH]
# Example: ./scripts/run_submission_smoke.sh http://localhost:3001 cmi71d9eu0001vk3syllj24xi public/uploads/1762259791288-json.txt

BASE_URL=${1:-http://localhost:3001}
SUBMISSION_ID=${2:-cmi71d9eu0001vk3syllj24xi}
FILE_PATH=${3:-public/uploads/1762259791288-json.txt}

echo "Using base URL: $BASE_URL"

echo "\n1) JSON grading PATCH"
curl -v -X PATCH \
  -H "Content-Type: application/json" \
  -d '{"grade":88,"feedback":"Smoke test grade"}' \
  "$BASE_URL/api/submission/$SUBMISSION_ID" || true

echo "\n\n2) Multipart file PATCH"
curl -v -X PATCH \
  -F "file=@$FILE_PATH" \
  "$BASE_URL/api/submission/$SUBMISSION_ID" || true

echo "\nDone."
