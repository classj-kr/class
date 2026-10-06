-- 수행평가 계획. 학교·학년도·학년·학기·교과마다 하나, 같은 학교 교사가 함께 본다.
-- items: [{ domain, standards: [{ code, text }], element, levels, criteria: [{ label, text }] }]
CREATE TABLE IF NOT EXISTS assessment_plans (
  id BIGSERIAL PRIMARY KEY,
  school_id BIGINT NOT NULL REFERENCES classroom_schools(id) ON DELETE CASCADE,
  academic_year INTEGER NOT NULL,
  grade INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  subject_name TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_by BIGINT REFERENCES classroom_users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (school_id, academic_year, grade, semester, subject_name)
);
