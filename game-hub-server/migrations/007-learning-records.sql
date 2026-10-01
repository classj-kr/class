CREATE TABLE IF NOT EXISTS learning_record_sessions (
  id UUID PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES classroom_users(id) ON DELETE CASCADE,
  school_id BIGINT NOT NULL REFERENCES classroom_schools(id),
  academic_year INTEGER NOT NULL,
  grade INTEGER NOT NULL,
  class_number INTEGER NOT NULL,
  student_number TEXT NOT NULL,
  student_name TEXT NOT NULL,
  activity TEXT NOT NULL,
  content_key TEXT NOT NULL,
  content_version TEXT NOT NULL,
  title TEXT NOT NULL,
  href TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  revision INTEGER NOT NULL DEFAULT 0,
  checkpoint JSONB NOT NULL DEFAULT '{}',
  progress_current INTEGER NOT NULL DEFAULT 0,
  progress_total INTEGER,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS learning_record_active_content
  ON learning_record_sessions(user_id, activity, content_key, content_version) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS learning_record_student_date ON learning_record_sessions(user_id, updated_at DESC, id);
CREATE INDEX IF NOT EXISTS learning_record_class_date ON learning_record_sessions(school_id, academic_year, grade, class_number, updated_at DESC);
CREATE TABLE IF NOT EXISTS learning_record_events (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES learning_record_sessions(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('answer', 'read', 'self-assessment', 'hint')),
  question_key TEXT NOT NULL,
  response JSONB,
  snapshot JSONB NOT NULL DEFAULT '{}',
  correct BOOLEAN,
  scoring_source TEXT NOT NULL CHECK (scoring_source IN ('server', 'activity', 'none')),
  attempt_number INTEGER NOT NULL,
  duration_ms INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS learning_record_event_session ON learning_record_events(session_id, id);
CREATE TABLE IF NOT EXISTS learning_record_mutations (
  session_id UUID NOT NULL REFERENCES learning_record_sessions(id) ON DELETE CASCADE,
  mutation_id UUID NOT NULL,
  payload_hash TEXT NOT NULL,
  PRIMARY KEY(session_id, mutation_id)
);
