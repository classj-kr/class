-- 교사용 AI(제미나이) 키. 계정마다 하나, 서버 비밀값으로 암호화해 둔다.
CREATE TABLE IF NOT EXISTS teacher_ai_keys (
  user_id BIGINT PRIMARY KEY REFERENCES classroom_users(id) ON DELETE CASCADE,
  key_sealed TEXT NOT NULL,
  key_last4 TEXT NOT NULL,
  model TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
