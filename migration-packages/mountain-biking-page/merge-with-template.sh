#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <template.adoc> <content-only.adoc> <output.adoc>"
  exit 1
fi

TEMPLATE="$1"
CONTENT="$2"
OUTPUT="$3"

SITE_ROOT="packages/400_theme_site"

resolve_existing_path() {
  local path="$1"

  if [[ -f "$path" ]]; then
    echo "$path"
    return 0
  fi

  if [[ "$path" != /* && -f "$SITE_ROOT/$path" ]]; then
    echo "$SITE_ROOT/$path"
    return 0
  fi

  echo "$path"
}

resolve_output_path() {
  local path="$1"
  local dir

  if [[ "$path" == /* ]]; then
    echo "$path"
    return 0
  fi

  dir="$(dirname "$path")"
  if [[ -d "$dir" ]]; then
    echo "$path"
    return 0
  fi

  if [[ "$path" == pages/* || "$path" == assets/* ]]; then
    echo "$SITE_ROOT/$path"
    return 0
  fi

  echo "$path"
}

TEMPLATE="$(resolve_existing_path "$TEMPLATE")"
CONTENT="$(resolve_existing_path "$CONTENT")"
OUTPUT="$(resolve_output_path "$OUTPUT")"

if [[ ! -f "$TEMPLATE" ]]; then
  echo "Template not found: $TEMPLATE"
  exit 1
fi

if [[ ! -f "$CONTENT" ]]; then
  echo "Content file not found: $CONTENT"
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT")"

# Keep template front matter and header up to (and including) the Page content marker.
awk '1; /^\/\/ Page content/{print "// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"; exit}' "$TEMPLATE" > "$OUTPUT"

# Append the mountain biking content block from content-only file.
echo "" >> "$OUTPUT"
cat "$CONTENT" >> "$OUTPUT"

echo "Wrote merged page: $OUTPUT"
