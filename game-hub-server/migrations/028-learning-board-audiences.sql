-- 게시판을 어느 학급·그룹 학생에게 보여 줄지. 고른 것이 없으면 방번호로만 들어온다.
-- group_id 는 teacher_groups.id 다. 지워진 카드는 읽을 때 이어지지 않으므로 그냥 무시된다.
CREATE TABLE IF NOT EXISTS learning_board_audiences (
  board_id TEXT NOT NULL REFERENCES learning_boards(id) ON DELETE CASCADE,
  group_id BIGINT NOT NULL,
  PRIMARY KEY (board_id, group_id)
);
CREATE INDEX IF NOT EXISTS learning_board_audiences_group_idx ON learning_board_audiences(group_id);
