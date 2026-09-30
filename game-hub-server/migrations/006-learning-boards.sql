CREATE TABLE IF NOT EXISTS learning_boards (
  id TEXT PRIMARY KEY,
  owner_id BIGINT NOT NULL REFERENCES classroom_users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE CHECK (code ~ '^[0-9]{6}$'),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  layout TEXT NOT NULL CHECK (layout IN ('wall', 'columns', 'roster', 'quiz')),
  columns JSONB NOT NULL DEFAULT '[]',
  slots INTEGER NOT NULL DEFAULT 30 CHECK (slots BETWEEN 1 AND 60),
  locked BOOLEAN NOT NULL DEFAULT FALSE,
  closed BOOLEAN NOT NULL DEFAULT FALSE,
  hide_names BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS learning_boards_owner_idx ON learning_boards(owner_id, created_at DESC);
CREATE TABLE IF NOT EXISTS learning_board_members (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL REFERENCES learning_boards(id) ON DELETE CASCADE,
  number INTEGER NOT NULL CHECK (number BETWEEN 1 AND 60),
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  UNIQUE(board_id, number),
  UNIQUE(board_id, id)
);
CREATE TABLE IF NOT EXISTS learning_board_posts (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL REFERENCES learning_boards(id) ON DELETE CASCADE,
  member_id TEXT,
  kind TEXT NOT NULL CHECK (kind IN ('note', 'ox', 'choice')),
  content TEXT NOT NULL,
  link TEXT NOT NULL DEFAULT '',
  column_index INTEGER NOT NULL DEFAULT 0,
  choices JSONB NOT NULL DEFAULT '[]',
  answer INTEGER,
  explanation TEXT NOT NULL DEFAULT '',
  review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'changes')),
  feedback TEXT NOT NULL DEFAULT '',
  revision INTEGER NOT NULL DEFAULT 1,
  hidden BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY(board_id, member_id) REFERENCES learning_board_members(board_id, id) ON DELETE CASCADE,
  UNIQUE(board_id, id)
);
CREATE INDEX IF NOT EXISTS learning_board_posts_board_idx ON learning_board_posts(board_id, created_at);
CREATE TABLE IF NOT EXISTS learning_board_sets (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL REFERENCES learning_boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  questions JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'ready' CHECK (status IN ('ready', 'open', 'closed', 'revealed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(board_id, id)
);
CREATE TABLE IF NOT EXISTS learning_board_answers (
  board_id TEXT NOT NULL,
  set_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  choice INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(set_id, question_id, member_id),
  FOREIGN KEY(board_id, set_id) REFERENCES learning_board_sets(board_id, id) ON DELETE CASCADE,
  FOREIGN KEY(board_id, member_id) REFERENCES learning_board_members(board_id, id) ON DELETE CASCADE
);
