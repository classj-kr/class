ALTER TABLE learning_boards ADD COLUMN IF NOT EXISTS comments_enabled BOOLEAN NOT NULL DEFAULT TRUE;
CREATE TABLE IF NOT EXISTS learning_board_comments (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  member_id TEXT,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 500),
  revision INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY(board_id, post_id) REFERENCES learning_board_posts(board_id, id) ON DELETE CASCADE,
  FOREIGN KEY(board_id, member_id) REFERENCES learning_board_members(board_id, id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS learning_board_comments_post_idx ON learning_board_comments(board_id, post_id, created_at, id);
