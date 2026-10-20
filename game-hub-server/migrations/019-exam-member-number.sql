-- 학생 번호를 60번까지로 막았더니 99번 같은 계정이 입장하지 못했다. 번호 범위를 넓힌다.
ALTER TABLE classroom_exam_members DROP CONSTRAINT IF EXISTS classroom_exam_members_number_check;
ALTER TABLE classroom_exam_members ADD CONSTRAINT classroom_exam_members_number_check CHECK (number BETWEEN 1 AND 999);
