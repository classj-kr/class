-- 게시판 글에 붙이는 그림 1장(그림판 PNG·WebP, 플립북 GIF, 사진).
-- 먼저 올려 id를 받고(post_id NULL), 글을 저장할 때 그 글에 묶는다.
CREATE TABLE IF NOT EXISTS learning_board_images (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL REFERENCES learning_boards(id) ON DELETE CASCADE,
  post_id TEXT,
  member_id TEXT,
  mime TEXT NOT NULL,
  size INTEGER NOT NULL,
  data BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY(board_id, post_id) REFERENCES learning_board_posts(board_id, id) ON DELETE CASCADE,
  FOREIGN KEY(board_id, member_id) REFERENCES learning_board_members(board_id, id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS learning_board_images_board_idx ON learning_board_images(board_id);
CREATE UNIQUE INDEX IF NOT EXISTS learning_board_images_post_idx ON learning_board_images(post_id) WHERE post_id IS NOT NULL;
