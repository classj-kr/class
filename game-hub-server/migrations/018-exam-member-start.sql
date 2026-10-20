-- 학생마다 "시작"을 누른 때부터 제한시간을 잰다. 교사가 한꺼번에 시작하던 시험은 그 시각을 학생 시작 시각으로 옮긴다.
ALTER TABLE classroom_exam_members ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;
UPDATE classroom_exam_members m SET started_at = e.started_at
  FROM classroom_exams e
  WHERE m.exam_id = e.id AND m.started_at IS NULL AND e.started_at IS NOT NULL;
