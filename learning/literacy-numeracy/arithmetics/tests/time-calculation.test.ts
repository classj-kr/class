import assert from "node:assert/strict";
import test from "node:test";
import { calculateTimeResult, timeAnswerParts, type TimeValue } from "../lib/time-calculation.ts";

const time = (hours: number, minutes: number, seconds: number): TimeValue => ({ hours, minutes, seconds });

test("60초는 1분, 60분은 1시간으로 올린다", () => {
  assert.deepEqual(calculateTimeResult(time(0, 0, 30), "+", time(0, 0, 30)), time(0, 1, 0));
  assert.deepEqual(calculateTimeResult(time(0, 41, 24), "+", time(0, 41, 30)), time(1, 22, 54));
  assert.deepEqual(calculateTimeResult(time(0, 59, 59), "+", time(0, 59, 59)), time(1, 59, 58));
  assert.deepEqual(calculateTimeResult(time(0, 30, 30), "+", time(0, 29, 30)), time(1, 0, 0));
});

test("시간·분·초 뺄셈의 빌림을 유지한다", () => {
  assert.deepEqual(calculateTimeResult(time(4, 0, 10), "−", time(1, 45, 0)), time(2, 15, 10));
  assert.deepEqual(calculateTimeResult(time(4, 15, 0), "−", time(4, 0, 45)), time(0, 14, 15));
  assert.deepEqual(calculateTimeResult(time(1, 0, 0), "−", time(0, 0, 1)), time(0, 59, 59));
});

test("분·초 덧셈은 시간 답 칸까지 제공하며 표시한 단위로 정답 전체를 표현한다", () => {
  const parts = timeAnswerParts(["minutes", "seconds"], "+");
  assert.deepEqual(parts, ["hours", "minutes", "seconds"]);
  assert.deepEqual(timeAnswerParts(["hours", "minutes"], "+"), ["hours", "minutes"]);
  assert.deepEqual(timeAnswerParts(["minutes", "seconds"], "−"), ["minutes", "seconds"]);
  const units = { hours: 3600, minutes: 60, seconds: 1 };
  for (let leftMinutes = 1; leftMinutes <= 59; leftMinutes++) {
    for (let rightMinutes = 1; rightMinutes <= 59; rightMinutes++) {
      const result = calculateTimeResult(time(0, leftMinutes, 59), "+", time(0, rightMinutes, 59));
      assert.equal(parts.reduce((sum, part) => sum + result[part] * units[part], 0), (leftMinutes + rightMinutes) * 60 + 118);
      assert.ok(result.minutes >= 0 && result.minutes < 60);
      assert.ok(result.seconds >= 0 && result.seconds < 60);
      for (const part of parts) assert.ok(String(result[part]).length <= 2);
    }
  }
});
