ALTER TABLE learning_boards DROP CONSTRAINT IF EXISTS learning_boards_layout_check;
ALTER TABLE learning_boards ADD CONSTRAINT learning_boards_layout_check
  CHECK (layout IN ('wall', 'columns', 'roster', 'quiz', 'stacking'));
CREATE TABLE IF NOT EXISTS learning_board_stacking (
  board_id TEXT PRIMARY KEY REFERENCES learning_boards(id) ON DELETE CASCADE,
  state JSONB NOT NULL
);
