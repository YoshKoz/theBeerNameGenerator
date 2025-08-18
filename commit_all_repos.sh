#!/usr/bin/env bash
set -euo pipefail
ROOT="/home/yoshkoz/CODING"
echo "Searching for git repositories under $ROOT"
while IFS= read -r gitdir; do
  repo=$(dirname "$gitdir")
  echo
  echo "=== $repo ==="
  # set local identity if missing
  if [ -z "$(git -C "$repo" config user.name 2>/dev/null)" ]; then
    git -C "$repo" config user.name "$(git config --global user.name || echo 'unknown')"
  fi
  if [ -z "$(git -C "$repo" config user.email 2>/dev/null)" ]; then
    git -C "$repo" config user.email "$(git config --global user.email || echo 'unknown@example.com')"
  fi
  echo "User: $(git -C "$repo" config user.name) <$(git -C "$repo" config user.email)>"
  git -C "$repo" status --porcelain --untracked-files=all | sed 's/^/   /' | sed -n '1,200p' || true
  git -C "$repo" add -A || true
  if git -C "$repo" diff --cached --quiet; then
    echo "No changes to commit in $repo"
  else
    msg="Automated snapshot commit: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    if git -C "$repo" commit -m "$msg" --no-verify >/dev/null 2>&1; then
      echo "Committed: $msg"
    else
      echo "Commit failed for $repo"
    fi
  fi

done < <(find "$ROOT" -type d -name .git -prune -print)

echo "Done."
