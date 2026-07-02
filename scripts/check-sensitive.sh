#!/usr/bin/env bash
# Fails the build if sensitive content leaks into the site.
set -euo pipefail

TARGET_DIR="${1:-dist}"

if [ ! -d "$TARGET_DIR" ]; then
  echo "check-sensitive: target directory '$TARGET_DIR' does not exist" >&2
  exit 1
fi

DENYLIST=(
  "ed@engelking.me"
  "pay-expectations"
)

found=0
for term in "${DENYLIST[@]}"; do
  if grep -R -l -F -- "$term" "$TARGET_DIR" >/dev/null 2>&1; then
    echo "check-sensitive: found denylisted term '$term' in $TARGET_DIR" >&2
    grep -R -l -F -- "$term" "$TARGET_DIR" >&2
    found=1
  fi
done

if [ "$found" -ne 0 ]; then
  echo "check-sensitive: FAILED — sensitive content found in $TARGET_DIR" >&2
  exit 1
fi

echo "check-sensitive: OK — no denylisted terms found in $TARGET_DIR"
