-- 듣기평가 음원. 시험당 MP3 하나. 시험 목록 조회(SELECT *)가 무거워지지 않도록 따로 둔다.
CREATE TABLE IF NOT EXISTS classroom_exam_audio (
  exam_id TEXT PRIMARY KEY REFERENCES classroom_exams(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  data BYTEA NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE classroom_exams ADD COLUMN IF NOT EXISTS audio_bytes INTEGER;
