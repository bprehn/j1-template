#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_URL="${J1_BASE_URL:-http://localhost:41000}"
OPEN_ON_SUCCESS="false"

if [[ "${1:-}" == "--open" ]]; then
  OPEN_ON_SUCCESS="true"
fi

required_paths=(
  "/"
  "/assets/theme/j1/core/css/themes/unolight/bootstrap.css"
  "/assets/theme/j1/core/css/icon-fonts/mdib.css"
  "/assets/theme/j1/core/css/vendor.css"
  "/assets/theme/j1/core/css/animate.css"
  "/assets/theme/j1/core/js/template.js"
  "/assets/data/panel/index.html"
  "/assets/data/lunr-index.json"
)

failures=0

echo "Checking J1 dev health at ${BASE_URL}"

for path in "${required_paths[@]}"; do
  url="${BASE_URL}${path}"

  # Read response headers only.
  headers="$(curl -sS -I "$url" || true)"

  status="$(printf '%s\n' "$headers" | awk 'BEGIN{code=""} /^HTTP\//{code=$2} END{print code}')"
  ctype="$(printf '%s\n' "$headers" | awk 'BEGIN{IGNORECASE=1} /^Content-Type:/{sub(/\r$/, ""); print $2; exit}')"

  if [[ "$status" != "200" ]]; then
    echo "FAIL  ${path} -> HTTP ${status:-none}"
    failures=$((failures + 1))
    continue
  fi

  # Basic content-type sanity checks for key assets.
  if [[ "$path" == *.css ]] && [[ "$ctype" != text/css* ]]; then
    echo "FAIL  ${path} -> content-type ${ctype:-unknown} (expected text/css)"
    failures=$((failures + 1))
    continue
  fi

  if [[ "$path" == *.js ]] && [[ "$ctype" != application/javascript* && "$ctype" != text/javascript* ]]; then
    echo "FAIL  ${path} -> content-type ${ctype:-unknown} (expected javascript)"
    failures=$((failures + 1))
    continue
  fi

  echo "PASS  ${path}"
done

echo
if [[ "$failures" -eq 0 ]]; then
  echo "Health check passed."
  if [[ "$OPEN_ON_SUCCESS" == "true" ]]; then
    open "$BASE_URL"
    echo "Opened ${BASE_URL}"
  fi
  exit 0
fi

echo "Health check failed with ${failures} issue(s)."
echo "Recommended recovery steps:"
echo "1) Ensure no stale servers are running on ports 40000 and 41000."
echo "2) Run: ./setup-clean-macos.sh"
echo "3) Start: yarn site"
echo "4) Re-run: ./health-check.sh --open"
exit 1
