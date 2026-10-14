CREATE TABLE IF NOT EXISTS learning_board_races (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL REFERENCES learning_boards(id) ON DELETE CASCADE,
  set_id TEXT NOT NULL,
  state JSONB NOT NULL,
  finished BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY(board_id, set_id) REFERENCES learning_board_sets(board_id, id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS learning_board_races_active_idx
  ON learning_board_races(board_id) WHERE NOT finished;
CREATE INDEX IF NOT EXISTS learning_board_races_history_idx
  ON learning_board_races(board_id, created_at DESC);
