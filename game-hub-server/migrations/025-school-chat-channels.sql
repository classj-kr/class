-- 학교 공용 채팅에 채널 이름표를 더한다. 'school' 은 학교 전체방, 'room:<번호>' 는 학생이 만든 방.
-- 나중에 사이트 전체 채널을 더할 때는 이 이름표에 새 값 하나를 쓰면 된다.
ALTER TABLE school_chat_messages ADD COLUMN IF NOT EXISTS channel TEXT NOT NULL DEFAULT 'school';
CREATE INDEX IF NOT EXISTS school_chat_messages_channel_idx ON school_chat_messages (school_key, channel, id DESC);

-- 학생이 만든 방. 번호는 학교 안에서만 겹치지 않으면 된다.
CREATE TABLE IF NOT EXISTS school_chat_rooms (
  school_key TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  owner_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (school_key, code)
);

-- 방에 들어간 사람. 새로 접속해도 들어간 방이 그대로 이어진다.
CREATE TABLE IF NOT EXISTS school_chat_members (
  school_key TEXT NOT NULL,
  code TEXT NOT NULL,
  user_id TEXT NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (school_key, code, user_id)
);
CREATE INDEX IF NOT EXISTS school_chat_members_user_idx ON school_chat_members (school_key, user_id);
