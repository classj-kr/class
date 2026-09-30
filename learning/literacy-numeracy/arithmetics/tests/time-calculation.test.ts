import assert from "node:assert/strict";
import test from "node:test";
import { calculateTimeResult, timeAnswerMaxLength, type TimePart, type TimeValue } from "../lib/time-calculation.ts";

const time = (hours: number, minutes: number, seconds: number): TimeValue => ({ hours, minutes, seconds });

test("분·초 문제는 60분을 넘는 정답도 분으로 유지한다", () => {
  const parts: TimePart[] = ["minutes", "seconds"];
  assert.deepEqual(calculateTimeResult(time(0, 41, 24), "+", time(0, 41, 30), parts), time(0, 82, 54));
  assert.deepEqual(calculateTimeResult(time(0, 59, 59), "+", time(0, 59, 59), parts), time(0, 119, 58));
  assert.deepEqual(calculateTimeResult(time(0, 30, 30), "+", time(0, 29, 30), parts), time(0, 60, 0));
});

test("시간 칸이 있는 문제는 올림과 빌림을 유지한다", () => {
  const parts: TimePart[] = ["hours", "minutes", "seconds"];
  assert.deepEqual(calculateTimeResult(time(1, 41, 24), "+", time(1, 41, 30), parts), time(3, 22, 54));
  assert.deepEqual(calculateTimeResult(time(4, 0, 10), "−", time(1, 45, 0), parts), time(2, 15, 10));
  assert.deepEqual(calculateTimeResult(time(4, 15, 0), "−", time(4, 0, 45), parts), time(0, 14, 15));
});

test("표시하는 시간 단위만으로 원래 계산값을 복원할 수 있고 정답이 입력칸에 들어간다", () => {
  const units = { hours: 3600, minutes: 60, seconds: 1 };
  for (const parts of [["minutes", "seconds"], ["hours", "minutes", "seconds"]] as TimePart[][]) {
    for (let leftMinutes = 1; leftMinutes <= 59; leftMinutes++) {
      for (let rightMinutes = 1; rightMinutes <= 59; rightMinutes++) {
        const result = calculateTimeResult(time(0, leftMinutes, 59), "+", time(0, rightMinutes, 59), parts);
        assert.equal(parts.reduce((sum, part) => sum + result[part] * units[part], 0), (leftMinutes + rightMinutes) * 60 + 118);
        for (const part of parts) assert.ok(String(result[part]).length <= timeAnswerMaxLength(part));
      }
    }
  }
});
