// 연산 순위전 대기실에서 방장이 고르는 것: 제한 시간과 팀.
export const RACE_DURATIONS = [60, 120, 180] as const;
export const RACE_DEFAULT_DURATION = 180;

export function raceDuration(value: unknown) {
  const seconds = Number(value);
  return (RACE_DURATIONS as readonly number[]).includes(seconds) ? seconds : null;
}

// 팀 이름은 수학 기호에서 따온다. 앞의 넷은 네 연산, 뒤의 넷은 비교와 퍼센트.
export const RACE_TEAMS = [
  { name: "더하기팀", symbol: "+", hue: 4 },
  { name: "빼기팀", symbol: "−", hue: 214 },
  { name: "곱하기팀", symbol: "×", hue: 146 },
  { name: "나누기팀", symbol: "÷", hue: 32 },
  { name: "같다팀", symbol: "=", hue: 270 },
  { name: "크다팀", symbol: ">", hue: 186 },
  { name: "작다팀", symbol: "<", hue: 322 },
  { name: "퍼센트팀", symbol: "%", hue: 52 },
] as const;

export const RACE_TEAM_COUNTS = [2, 3, 4, 5, 6, 7, 8] as const;

export function raceTeamCount(value: unknown) {
  const count = Number(value);
  return (RACE_TEAM_COUNTS as readonly number[]).includes(count) ? count : null;
}

// 한 팀 인원 상한. 고르지 않으면(null) 제한 없음.
export const RACE_TEAM_SIZES = [2, 3, 4, 5, 6, 8, 10] as const;

export function raceTeamSize(value: unknown) {
  const size = Number(value);
  return (RACE_TEAM_SIZES as readonly number[]).includes(size) ? size : null;
}

export type TeamMember = { id: string; team?: number | null; score?: number; correct_count?: number | null };
export type TeamStanding = { index: number; name: string; symbol: string; hue: number; score: number; size: number; rank: number; memberIds: string[] };

// 팀 점수는 팀원 점수의 합. 같으면 많이 맞힌 팀이 앞선다.
export function raceTeamBoard(rows: readonly TeamMember[], teamCount: number): TeamStanding[] {
  const teams = RACE_TEAMS.slice(0, teamCount).map((team, index) => {
    const members = rows.filter((row) => row.team === index);
    return {
      index, name: team.name, symbol: team.symbol, hue: team.hue,
      score: members.reduce((sum, row) => sum + (Number(row.score) || 0), 0),
      correct: members.reduce((sum, row) => sum + (Number(row.correct_count) || 0), 0),
      size: members.length, rank: 0, memberIds: members.map((row) => row.id),
    };
  });
  const order = [...teams].sort((a, b) => b.score - a.score || b.correct - a.correct || a.index - b.index);
  // 점수와 맞힌 수가 같으면 같은 순위다.
  order.forEach((team, position) => {
    const previous = order[position - 1];
    team.rank = previous && previous.score === team.score && previous.correct === team.correct ? previous.rank : position + 1;
  });
  return teams.map(({ correct: _correct, ...team }) => team);
}

// 팀이 없는 사람을 가장 적은 팀에 넣는다. 출발할 때 아무도 빠지지 않게 한다.
// 한 팀 인원이 정해져 있으면 꽉 찬 팀은 건너뛴다. 자리가 모자라면 남은 사람은 팀 없음으로 둔다(출발 전에 막는다).
export function fillRaceTeams(rows: readonly TeamMember[], teamCount: number, teamSize: number | null = null) {
  const sizes = Array.from({ length: teamCount }, (_, index) => rows.filter((row) => row.team === index).length);
  const changes: Array<{ id: string; team: number }> = [];
  for (const row of rows) {
    if (row.team !== null && row.team !== undefined && row.team < teamCount) continue;
    const open = sizes.filter((size) => teamSize === null || size < teamSize);
    if (!open.length) break;
    const team = sizes.indexOf(Math.min(...open));
    sizes[team] += 1;
    changes.push({ id: row.id, team });
  }
  return changes;
}

// 섞기: 모두를 고르게 나눈다.
export function shuffleRaceTeams(rows: readonly TeamMember[], teamCount: number, random: () => number = Math.random) {
  const order = rows.map((row) => row.id);
  for (let index = order.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [order[index], order[other]] = [order[other], order[index]];
  }
  return order.map((id, position) => ({ id, team: position % teamCount }));
}
