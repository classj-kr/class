-- 계정별 작은 저장 공간. 화면(app)마다 항목(item) 이름으로 JSON 값을 둔다.
CREATE TABLE IF NOT EXISTS user_storage (
  user_id BIGINT NOT NULL REFERENCES classroom_users(id) ON DELETE CASCADE,
  app TEXT NOT NULL,
  item TEXT NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, app, item)
);
