// 연산 순위전 팀전. 팀 이름은 네 연산 기호에서 따온다.
export const RACE_TEAMS = [
  { name: "더하기팀", symbol: "+", hue: 4 },
  { name: "빼기팀", symbol: "−", hue: 214 },
  { name: "곱하기팀", symbol: "×", hue: 146 },
  { name: "나누기팀", symbol: "÷", hue: 32 },
] as const;

export const RACE_TEAM_COUNTS = [2, 3, 4] as const;

export function raceTeamCount(value: unknown) {
  const count = Number(value);
  return (RACE_TEAM_COUNTS as readonly number[]).includes(count) ? count : null;
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
export function fillRaceTeams(rows: readonly TeamMember[], teamCount: number) {
  const sizes = Array.from({ length: teamCount }, (_, index) => rows.filter((row) => row.team === index).length);
  const changes: Array<{ id: string; team: number }> = [];
  for (const row of rows) {
    if (row.team !== null && row.team !== undefined && row.team < teamCount) continue;
    const team = sizes.indexOf(Math.min(...sizes));
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
