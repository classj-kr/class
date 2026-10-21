export type RankableRaceParticipant = {
  name: string;
  submitted_at: number | null;
  correct_count: number | null;
  total_count: number | null;
  mistake_count: number;
};

export type RankableCardParticipant = {
  name: string;
  score?: number;
  correct_count: number | null;
  scored_at?: number | null;
};

// 카드 순위전: 점수가 높은 순, 같으면 많이 맞힌 순, 그래도 같으면 그 점수에 먼저 닿은 순.
export function rankCardParticipants<T extends RankableCardParticipant>(rows: readonly T[]) {
  return [...rows].sort((a, b) =>
    (Number(b.score) || 0) - (Number(a.score) || 0)
    || (Number(b.correct_count) || 0) - (Number(a.correct_count) || 0)
    || (a.scored_at ?? Infinity) - (b.scored_at ?? Infinity)
    || a.name.localeCompare(b.name, "ko"),
  );
}

export function rankArrivedParticipants<T extends RankableRaceParticipant>(rows: readonly T[]) {
  return rows
    .filter((row) => row.submitted_at !== null && row.total_count !== null && row.correct_count === row.total_count)
    .sort((a, b) =>
      (Number(a.mistake_count) || 0) - (Number(b.mistake_count) || 0)
      || (Number(a.submitted_at) || Infinity) - (Number(b.submitted_at) || Infinity)
      || a.name.localeCompare(b.name, "ko"),
    );
}
