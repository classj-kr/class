export type TimePart = "hours" | "minutes" | "seconds";
export type TimeValue = Record<TimePart, number>;

export function calculateTimeResult(
  left: TimeValue,
  operator: "+" | "−",
  right: TimeValue,
): TimeValue {
  const toSeconds = (time: TimeValue) => time.hours * 3600 + time.minutes * 60 + time.seconds;
  const total = toSeconds(left) + (operator === "+" ? 1 : -1) * toSeconds(right);
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function timeAnswerParts(parts: readonly TimePart[], operator: "+" | "−"): TimePart[] {
  // 분·초 덧셈은 올림 여부와 관계없이 시간 답 칸을 제공한다.
  return operator === "+" && !parts.includes("hours")
    ? ["hours", ...parts]
    : [...parts];
}
