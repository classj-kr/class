-- 학교 공용 채팅. 학교마다 방 하나, 말한 그대로 저장한다(걸러 내지 않는다).
-- 보존으로 표시한 줄 말고는 3일이 지나면 지운다.
CREATE TABLE IF NOT EXISTS school_chat_messages (
  id BIGSERIAL PRIMARY KEY,
  school_key TEXT NOT NULL,
  user_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL DEFAULT 'student',
  grade INT,
  class_number INT,
  body TEXT NOT NULL,
  preserved BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS school_chat_messages_school_idx ON school_chat_messages (school_key, id DESC);

-- 선생님이 잠시 막은 학생. until 이 지나면 저절로 풀린다.
CREATE TABLE IF NOT EXISTS school_chat_mutes (
  school_key TEXT NOT NULL,
  user_id TEXT NOT NULL,
  until TIMESTAMPTZ NOT NULL,
  muted_by TEXT,
  PRIMARY KEY (school_key, user_id)
);
