ALTER TABLE learning_record_events DROP CONSTRAINT IF EXISTS learning_record_events_kind_check;
ALTER TABLE learning_record_events ADD CONSTRAINT learning_record_events_kind_check
  CHECK (kind IN ('answer', 'read', 'self-assessment', 'hint', 'activity'));
CREATE TABLE IF NOT EXISTS learning_record_source_state (
  user_id BIGINT NOT NULL REFERENCES classroom_users(id) ON DELETE CASCADE,
  source_key TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  PRIMARY KEY (user_id, source_key)
);
