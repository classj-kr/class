export type TimePart = "hours" | "minutes" | "seconds";
export type TimeValue = Record<TimePart, number>;

export function calculateTimeResult(
  left: TimeValue,
  operator: "+" | "−",
  right: TimeValue,
  parts: readonly TimePart[],
): TimeValue {
  const toSeconds = (time: TimeValue) => time.hours * 3600 + time.minutes * 60 + time.seconds;
  const total = toSeconds(left) + (operator === "+" ? 1 : -1) * toSeconds(right);
  const showHours = parts.includes("hours");
  return {
    hours: showHours ? Math.floor(total / 3600) : 0,
    minutes: Math.floor((showHours ? total % 3600 : total) / 60),
    seconds: total % 60,
  };
}

export function timeAnswerMaxLength(part: TimePart) {
  return part === "minutes" ? 3 : 2;
}
