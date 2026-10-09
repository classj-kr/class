-- School/grade shared dates for publisher pacing rows. Semester and edition stay explicit.
CREATE TABLE IF NOT EXISTS assessment_pacing (
  school_id BIGINT NOT NULL REFERENCES classroom_schools(id) ON DELETE CASCADE,
  academic_year INTEGER NOT NULL,
  grade INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  subject_name TEXT NOT NULL,
  edition_id TEXT NOT NULL,
  entries JSONB NOT NULL DEFAULT '[]'::jsonb,
  revision INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (school_id, academic_year, grade, semester, subject_name)
);
