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
  if email_bytes is not None and hasattr(email_bytes, 'lower') and email_bytes.lower() in OLD_EMAILS:
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
  except Exception as e:
    import logging
    logging.error(f"Error in commit_callback: {e}")
