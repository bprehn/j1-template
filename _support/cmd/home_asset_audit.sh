#!/usr/bin/env bash
set -euo pipefail

# Audit asset references on a rendered page and print non-200/304 responses.
# Usage: ./_support/cmd/home_asset_audit.sh [page_url]
# Example: ./_support/cmd/home_asset_audit.sh http://127.0.0.1:40000/

PAGE_URL="${1:-http://127.0.0.1:40000/}"
TMP_REFS="/tmp/homepage_assets_used.txt"

curl -fsSL "$PAGE_URL" \
  | grep -oE '/assets[^" )]+' \
  | sed -E "s/[\"']$//" \
  | sort -u > "$TMP_REFS"

count=$(wc -l < "$TMP_REFS")
echo "asset_refs=$count"

while IFS= read -r path; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "${PAGE_URL%/}${path}")
  if [[ "$code" != "200" && "$code" != "304" ]]; then
    echo "$code $path"
  fi
done < "$TMP_REFS"
