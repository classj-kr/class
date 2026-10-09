CREATE TABLE IF NOT EXISTS school_textbook_selections (
  school_id BIGINT NOT NULL REFERENCES classroom_schools(id) ON DELETE CASCADE,
  academic_year INTEGER NOT NULL CHECK (academic_year BETWEEN 2000 AND 2100),
  grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 6),
  subject_name TEXT NOT NULL,
  edition_id TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (school_id, academic_year, grade, subject_name)
);
