export type RaceRow = {
  room_code: string;
  teacher_token: string;
  worksheet_name: string;
  worksheet_route: string;
  seed: number;
  status: string;
  created_at: number;
  started_at: number | null;
};

export type ParticipantRow = {
  id: string;
  room_code: string;
  name: string;
  participant_token: string;
  joined_at: number;
  submitted_at: number | null;
  correct_count: number | null;
  total_count: number | null;
  mistake_count: number;
};

export type AttemptUpdate = {
  roomCode: string;
  participantId: string;
  participantToken: string;
  correctCount: number;
  totalCount: number;
  wrongCount: number;
  submittedAt: number | null;
};

export type RaceStore = {
  race(code: string): Promise<RaceRow | null>;
  participants(code: string): Promise<ParticipantRow[]>;
  openRace(race: RaceRow, host: ParticipantRow): Promise<boolean>;
  joinRace(participant: ParticipantRow): Promise<boolean>;
  startRace(code: string, hostToken: string, startedAt: number): Promise<boolean>;
  recordAttempt(update: AttemptUpdate): Promise<boolean>;
  closeRace(code: string, hostToken: string): Promise<void>;
};

type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results?: T[] }>;
  run(): Promise<{ meta: { changes: number } }>;
};

type D1Database = {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<unknown>;
};

const MEMORY_RACE_LIFETIME = 6 * 60 * 60 * 1000;

function isDuplicateKey(cause: unknown) {
  const message = cause instanceof Error ? cause.message : String(cause);
  return /UNIQUE constraint failed|PRIMARY KEY/i.test(message);
}

export function d1RaceStore(db: D1Database): RaceStore {
  return {
    async race(code) {
      return db.prepare("SELECT * FROM arithmetic_races WHERE room_code = ?")
        .bind(code)
        .first<RaceRow>();
    },
    async participants(code) {
      const result = await db.prepare("SELECT * FROM arithmetic_race_participants WHERE room_code = ? ORDER BY joined_at ASC")
        .bind(code)
        .all<ParticipantRow>();
      return result.results ?? [];
    },
    async openRace(race, host) {
      try {
        await db.batch([
          db.prepare("INSERT INTO arithmetic_races (room_code, teacher_token, worksheet_name, worksheet_route, seed, status, created_at) VALUES (?, ?, ?, ?, ?, 'waiting', ?)")
            .bind(race.room_code, race.teacher_token, race.worksheet_name, race.worksheet_route, race.seed, race.created_at),
          db.prepare("INSERT INTO arithmetic_race_participants (id, room_code, name, participant_token, joined_at) VALUES (?, ?, ?, ?, ?)")
            .bind(host.id, host.room_code, host.name, host.participant_token, host.joined_at),
        ]);
        return true;
      } catch (cause) {
        if (isDuplicateKey(cause)) return false;
        throw cause;
      }
    },
    async joinRace(participant) {
      try {
        await db.prepare("INSERT INTO arithmetic_race_participants (id, room_code, name, participant_token, joined_at) VALUES (?, ?, ?, ?, ?)")
          .bind(participant.id, participant.room_code, participant.name, participant.participant_token, participant.joined_at)
          .run();
        return true;
      } catch {
        return false;
      }
    },
    async startRace(code, hostToken, startedAt) {
      const result = await db.prepare("UPDATE arithmetic_races SET status = 'running', started_at = ? WHERE room_code = ? AND teacher_token = ? AND status = 'waiting'")
        .bind(startedAt, code, hostToken)
        .run();
      return Boolean(result.meta.changes);
    },
    async recordAttempt(update) {
      const result = update.submittedAt === null
        ? await db.prepare("UPDATE arithmetic_race_participants SET mistake_count = CASE WHEN total_count IS NULL THEN ? ELSE mistake_count END, correct_count = ?, total_count = ? WHERE id = ? AND room_code = ? AND participant_token = ? AND submitted_at IS NULL")
          .bind(update.wrongCount, update.correctCount, update.totalCount, update.participantId, update.roomCode, update.participantToken)
          .run()
        : await db.prepare("UPDATE arithmetic_race_participants SET submitted_at = ?, correct_count = ?, total_count = ? WHERE id = ? AND room_code = ? AND participant_token = ? AND submitted_at IS NULL")
          .bind(update.submittedAt, update.correctCount, update.totalCount, update.participantId, update.roomCode, update.participantToken)
          .run();
      return Boolean(result.meta.changes);
    },
    async closeRace(code, hostToken) {
      await db.batch([
        db.prepare("DELETE FROM arithmetic_race_participants WHERE room_code = ?").bind(code),
        db.prepare("DELETE FROM arithmetic_races WHERE room_code = ? AND teacher_token = ?").bind(code, hostToken),
      ]);
    },
  };
}

// Rooms live for one lesson, so the Node deployment keeps them in the running
// process instead of a database the hosting plan does not provide.
export function memoryRaceStore(clock: () => number = Date.now): RaceStore {
  const races = new Map<string, RaceRow>();
  const roster = new Map<string, ParticipantRow[]>();

  function forget() {
    const oldest = clock() - MEMORY_RACE_LIFETIME;
    for (const [code, race] of races) {
      if (race.created_at < oldest) {
        races.delete(code);
        roster.delete(code);
      }
    }
  }

  function member(update: AttemptUpdate) {
    return (roster.get(update.roomCode) ?? []).find((row) =>
      row.id === update.participantId && row.participant_token === update.participantToken);
  }

  return {
    async race(code) {
      const found = races.get(code);
      return found ? { ...found } : null;
    },
    async participants(code) {
      return (roster.get(code) ?? []).map((row) => ({ ...row }));
    },
    async openRace(race, host) {
      forget();
      if (races.has(race.room_code)) return false;
      races.set(race.room_code, { ...race });
      roster.set(race.room_code, [{ ...host }]);
      return true;
    },
    async joinRace(participant) {
      const joined = roster.get(participant.room_code);
      if (!joined || joined.some((row) => row.name === participant.name)) return false;
      joined.push({ ...participant });
      return true;
    },
    async startRace(code, hostToken, startedAt) {
      const race = races.get(code);
      if (!race || race.teacher_token !== hostToken || race.status !== "waiting") return false;
      race.status = "running";
      race.started_at = startedAt;
      return true;
    },
    async recordAttempt(update) {
      const participant = member(update);
      if (!participant || participant.submitted_at !== null) return false;
      if (update.submittedAt === null && participant.total_count === null) participant.mistake_count = update.wrongCount;
      participant.correct_count = update.correctCount;
      participant.total_count = update.totalCount;
      participant.submitted_at = update.submittedAt;
      return true;
    },
    async closeRace(code, hostToken) {
      const race = races.get(code);
      if (!race || race.teacher_token !== hostToken) return;
      races.delete(code);
      roster.delete(code);
    },
  };
}

let resolved: Promise<RaceStore> | null = null;

async function cloudflareRaceStore() {
  try {
    const { env } = await import("cloudflare:workers");
    const db = (env as { DB?: D1Database }).DB;
    return db ? d1RaceStore(db) : null;
  } catch {
    return null;
  }
}

export function raceStore() {
  resolved ??= cloudflareRaceStore().then((store) => {
    if (store) return store;
    console.warn("Cloudflare D1 is unavailable; keeping arithmetic race rooms in memory.");
    return memoryRaceStore();
  });
  return resolved;
}
