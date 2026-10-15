CREATE TABLE IF NOT EXISTS classroom_exams (
  id TEXT PRIMARY KEY,
  owner_id BIGINT NOT NULL REFERENCES classroom_users(id) ON DELETE CASCADE,
  code CHAR(4) NOT NULL UNIQUE CHECK (code ~ '^[0-9]{4}$'),
  title TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes BETWEEN 1 AND 180),
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed')),
  started_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS classroom_exams_owner_idx ON classroom_exams(owner_id, created_at DESC);
CREATE TABLE IF NOT EXISTS classroom_exam_members (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL REFERENCES classroom_exams(id) ON DELETE CASCADE,
  number INTEGER NOT NULL CHECK (number BETWEEN 1 AND 60),
  name TEXT NOT NULL,
  user_id BIGINT REFERENCES classroom_users(id) ON DELETE SET NULL,
  token_hash TEXT NOT NULL,
  submitted_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(exam_id, number)
);
CREATE UNIQUE INDEX IF NOT EXISTS classroom_exam_members_user_idx ON classroom_exam_members(exam_id, user_id) WHERE user_id IS NOT NULL;
CREATE TABLE IF NOT EXISTS classroom_exam_answers (
  exam_id TEXT NOT NULL REFERENCES classroom_exams(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL REFERENCES classroom_exam_members(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  choice INTEGER,
  response TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(member_id, question_id)
);
