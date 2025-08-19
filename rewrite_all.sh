#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/yoshkoz/CODING"
CB="/home/yoshkoz/CODING/gitfilter_callback_yoshi_all.py"

# canonical identity
CANON_NAME="Yoshi Tacke"
CANON_EMAIL="77861115+YoshKoz@users.noreply.github.com"

# write python callback
cat > "$CB" <<'PY'
def b(s):
  return s.encode('utf-8') if isinstance(s, str) else s

OLD_EMAILS = set([
  b('y.tacke@outlook.com'),
  b('yoshitacke@outlook.com'),
  b('yoshi.tacke@ziggo.nl'),
  b('yoshkoz@users.noreply.github.com'),
  b('yoshi.tacke@outlook.com'),
])
OLD_NAMES = set([
  b('YoshKoz'), b('Yoshi'), b('Yoshi Tacke')
])
CANON_NAME = b('Yoshi Tacke')
CANON_EMAIL = b('77861115+YoshKoz@users.noreply.github.com')


def match_old(name_bytes, email_bytes):
  if not email_bytes:
    return True
  if email_bytes.lower() in OLD_EMAILS:
    return True
  if name_bytes in OLD_NAMES:
    return True
  return False


def commit_callback(commit):
  try:
    if match_old(commit.author_name, commit.author_email):
      commit.author_name = CANON_NAME
      commit.author_email = CANON_EMAIL
    if match_old(commit.committer_name, commit.committer_email):
      commit.committer_name = CANON_NAME
      commit.committer_email = CANON_EMAIL
  except Exception:
    pass
PY

echo "Wrote callback to $CB"

SUMMARY="/home/yoshkoz/CODING/rewrite-summary-$(date +%s).txt"
: > "$SUMMARY"

# find repos (limit depth to avoid scanning too deep)
mapfile -t GITS < <(find "$ROOT" -maxdepth 3 -type d -name .git -print 2>/dev/null || true)

if [ ${#GITS[@]} -eq 0 ]; then
  echo "No git repositories found under $ROOT" | tee -a "$SUMMARY"
  exit 0
fi

for g in "${GITS[@]}"; do
  repo=$(dirname "$g")
  name=$(basename "$repo")
  echo
  echo "=== Processing: $repo ==="
  echo "Repository: $repo" >> "$SUMMARY"

  if ! git -C "$repo" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Not a git worktree, skipping" | tee -a "$SUMMARY"
    continue
  fi
  if ! git -C "$repo" rev-parse --verify HEAD >/dev/null 2>&1; then
    echo "No commits in $repo, skipping" | tee -a "$SUMMARY"
    continue
  fi

  tmp=$(mktemp -d /tmp/rewrite-${name}.XXXX)
  echo "Cloning $repo -> $tmp"
  git clone --quiet --no-local "$repo" "$tmp"

  echo "Authors BEFORE (original):"
  git -C "$repo" shortlog -sne --all | sed -n '1,50p'
  git -C "$repo" shortlog -sne --all | sed -n '1,50p' >> "$SUMMARY"

  echo "Running git-filter-repo on temp clone ($tmp)"
  if (cd "$tmp" && git filter-repo --force --commit-callback "$CB"); then
    echo "filter-repo succeeded for $repo"
  else
    echo "filter-repo failed for $repo" | tee -a "$SUMMARY"
    rm -rf "$tmp"
    continue
  fi

  echo "Authors AFTER (temp):"
  git -C "$tmp" shortlog -sne --all | sed -n '1,50p'
  git -C "$tmp" shortlog -sne --all | sed -n '1,50p' >> "$SUMMARY"

  origin_url=$(git -C "$repo" remote get-url origin 2>/dev/null || true)
  echo "Original origin: ${origin_url:-<none>}" | tee -a "$SUMMARY"

  # decide push target
  if [ -n "$origin_url" ] && (echo "$origin_url" | grep -qE "github.com[:/].*YoshKoz[/:]"); then
    echo "Origin appears to belong to you; will push rewritten history to that origin"
    git -C "$tmp" remote remove origin >/dev/null 2>&1 || true
    git -C "$tmp" remote add origin "$origin_url"
    # push branches
    for br in $(git -C "$tmp" for-each-ref --format='%(refname:short)' refs/heads); do
      echo "Pushing branch $br to origin"
      if git -C "$tmp" push --force-with-lease origin "$br"; then
        echo "Pushed $name:$br" | tee -a "$SUMMARY"
      else
        echo "Push failed for $name:$br" | tee -a "$SUMMARY"
      fi
    done
    # tags
    if git -C "$tmp" tag -l | grep -q .; then
      git -C "$tmp" push --force-with-lease origin --tags || echo "tag push failed for $name" | tee -a "$SUMMARY"
    fi
    echo "Temporary rewritten clone left at: $tmp" | tee -a "$SUMMARY"
    continue
  fi

  # otherwise attempt to create a private repo under your account and push
  echo "Origin is not your repo or missing. Attempting to create private repo YoshKoz/$name via gh"
  if gh repo create YoshKoz/$name --private --source="$tmp" --remote=origin --push >/home/yoshkoz/CODING/gh-create-${name}.log 2>&1; then
    echo "Created YoshKoz/$name and pushed" | tee -a "$SUMMARY"
    echo "Temporary rewritten clone left at: $tmp" | tee -a "$SUMMARY"
    continue
  else
    echo "gh repo create failed for $name; see /home/yoshkoz/CODING/gh-create-${name}.log" | tee -a "$SUMMARY"
    # leave temp clone for manual handling
    echo "Temporary rewritten clone left at: $tmp (not pushed)" | tee -a "$SUMMARY"
  fi

done

echo "--- Summary ---"
cat "$SUMMARY"

echo "Wrote full summary to $SUMMARY"
