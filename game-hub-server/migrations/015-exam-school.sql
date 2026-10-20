-- 시험을 학교 단위로 공유하고, 학교 전체 학생이 한 시험에 들어오도록 학년·반으로 자리를 구분한다.
ALTER TABLE classroom_exams ADD COLUMN IF NOT EXISTS school_id BIGINT;
ALTER TABLE classroom_exams ADD COLUMN IF NOT EXISTS owner_name TEXT;
DO $$ BEGIN
  IF to_regclass('classroom_teachers') IS NOT NULL THEN
    UPDATE classroom_exams e SET school_id = t.school_id, owner_name = COALESCE(e.owner_name, t.teacher_name)
      FROM classroom_teachers t
      WHERE e.school_id IS NULL AND t.user_id = e.owner_id AND t.active = TRUE;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS classroom_exams_school_idx ON classroom_exams(school_id, created_at DESC);
ALTER TABLE classroom_exam_members ADD COLUMN IF NOT EXISTS grade INTEGER;
ALTER TABLE classroom_exam_members ADD COLUMN IF NOT EXISTS class_number INTEGER;
ALTER TABLE classroom_exam_members DROP CONSTRAINT IF EXISTS classroom_exam_members_exam_id_number_key;
CREATE UNIQUE INDEX IF NOT EXISTS classroom_exam_members_seat_idx
  ON classroom_exam_members(exam_id, COALESCE(grade, 0), COALESCE(class_number, 0), number);
