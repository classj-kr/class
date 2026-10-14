import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const teacherIndexSource = await readFile(new URL("../apps/teacher/index.html", import.meta.url), "utf8");
const noticeIndexSource = await readFile(new URL("../apps/notice/index.html", import.meta.url), "utf8");

test("the notice composer no longer offers a PDF attachment option that silently discarded the actual file and kept only its filename", () => {
  assert.doesNotMatch(teacherIndexSource, /id="nContentType"/);
  assert.doesNotMatch(teacherIndexSource, /id="nPdfFile"/);
  assert.doesNotMatch(teacherIndexSource, /PDF 첨부파일/);
  assert.doesNotMatch(teacherIndexSource, /toggleContentMode/);
  assert.match(teacherIndexSource, /id="nTextBody"/);
});

test("the parent-facing notice list no longer ships a fake example card with a PDF button that only alerts", () => {
  assert.doesNotMatch(noticeIndexSource, /가정통신문 PDF가 열립니다/);
  assert.doesNotMatch(noticeIndexSource, /2026학년도 2학기 학교 가용 안내/);
});
