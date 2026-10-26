ALTER TABLE learning_boards ADD COLUMN IF NOT EXISTS likes_enabled BOOLEAN NOT NULL DEFAULT TRUE;
CREATE TABLE IF NOT EXISTS learning_board_likes (
  board_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  actor_key TEXT NOT NULL,
  member_id TEXT,
  PRIMARY KEY(post_id, actor_key),
  FOREIGN KEY(board_id, post_id) REFERENCES learning_board_posts(board_id, id) ON DELETE CASCADE,
  FOREIGN KEY(board_id, member_id) REFERENCES learning_board_members(board_id, id) ON DELETE CASCADE,
  CHECK ((member_id IS NULL AND actor_key = 'teacher') OR (member_id IS NOT NULL AND actor_key = member_id))
);
CREATE INDEX IF NOT EXISTS learning_board_likes_board_idx ON learning_board_likes(board_id);
