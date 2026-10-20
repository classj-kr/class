-- 문항 그림. PDF에서 잘라 낸 그림(무손실 WebP)을 문항의 image 칸이 id로 가리킨다.
CREATE TABLE IF NOT EXISTS classroom_exam_images (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL REFERENCES classroom_exams(id) ON DELETE CASCADE,
  mime TEXT NOT NULL,
  data BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS classroom_exam_images_exam_idx ON classroom_exam_images(exam_id);
