import { raceWorksheetByRoute } from "../../../lib/arithmetic-worksheets";
import { rankArrivedParticipants } from "../../../lib/arithmetic-race-ranking";

type RaceRow = {
  room_code: string;
  teacher_token: string;
  worksheet_name: string;
  worksheet_route: string;
  seed: number;
  status: string;
  created_at: number;
  started_at: number | null;
};

type ParticipantRow = {
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

function error(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

function roomCode() {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return String(100000 + values[0] % 900000);
}

function publicRace(race: RaceRow) {
  const worksheet = raceWorksheetByRoute(race.worksheet_route);
  return {
    roomCode: race.room_code,
    worksheetName: worksheet ? `${worksheet.grade} · ${worksheet.title}` : race.worksheet_name,
    worksheetRoute: race.worksheet_route,
    seed: race.seed,
    status: race.status,
    createdAt: race.created_at,
    startedAt: race.started_at,
  };
}

function rankedParticipants(rows: ParticipantRow[]) {
  const arrived = rankArrivedParticipants(rows);
  return arrived.map((row, index) => ({
    id: row.id,
    name: row.name,
    correctCount: Number(row.correct_count) || 0,
    totalCount: Number(row.total_count) || 0,
    mistakeCount: Number(row.mistake_count) || 0,
    submittedAt: row.submitted_at,
    rank: index + 1,
  }));
}

type RuntimeEnvironment = { DB: D1Database };

async function runtimeEnvironment() {
  const runtime = await import("cloudflare:workers");
  return runtime.env as unknown as RuntimeEnvironment;
}

async function loadRace(db: D1Database, code: string) {
  return db.prepare("SELECT * FROM arithmetic_races WHERE room_code = ?")
    .bind(code)
    .first<RaceRow>();
}

async function loadParticipants(db: D1Database, code: string) {
  const result = await db.prepare("SELECT * FROM arithmetic_race_participants WHERE room_code = ? ORDER BY joined_at ASC")
    .bind(code)
    .all<ParticipantRow>();
  return result.results ?? [];
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = (url.searchParams.get("room") ?? "").trim();
    const teacherToken = url.searchParams.get("hostToken") ?? url.searchParams.get("teacherToken") ?? "";
    const participantId = url.searchParams.get("participant") ?? "";
    const participantToken = url.searchParams.get("participantToken") ?? "";
    if (!/^\d{6}$/.test(code)) return error("방 번호를 확인하세요.");
    const runtime = await runtimeEnvironment();
    const db = runtime.DB;
    const race = await loadRace(db, code);
    if (!race) return error("없는 방입니다.", 404);
    const participants = await loadParticipants(db, code);
    const ranking = rankedParticipants(participants);

    if (teacherToken) {
      if (teacherToken !== race.teacher_token) return error("교사 권한을 확인하세요.", 403);
      const rankingById = new Map(ranking.map((entry) => [entry.id, entry]));
      return Response.json({
        race: publicRace(race),
        participants: participants.map((row) => ({
          id: row.id,
          name: row.name,
          joinedAt: row.joined_at,
          submittedAt: row.submitted_at,
          correctCount: row.correct_count,
          totalCount: row.total_count,
          mistakeCount: row.mistake_count,
          rank: rankingById.get(row.id)?.rank ?? null,
        })),
        ranking,
      });
    }

    const participant = participants.find((row) => row.id === participantId && row.participant_token === participantToken);
    if (!participant) return error("학생 입장 정보를 확인하세요.", 403);
    return Response.json({
      race: publicRace(race),
      participant: {
        id: participant.id,
        name: participant.name,
        submittedAt: participant.submitted_at,
        correctCount: participant.correct_count,
        totalCount: participant.total_count,
        mistakeCount: participant.mistake_count,
        rank: ranking.find((entry) => entry.id === participant.id)?.rank ?? null,
      },
      ranking: participant.submitted_at ? ranking : [],
    });
  } catch (cause) {
    console.error(cause);
    return error("순위 정보를 불러오지 못했습니다.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as Record<string, unknown>;
    const action = String(payload.action ?? "");
    const runtime = await runtimeEnvironment();
    const db = runtime.DB;

    if (action === "create") {
      const worksheetRoute = String(payload.worksheetRoute ?? "");
      const worksheet = raceWorksheetByRoute(worksheetRoute);
      const name = String(payload.name ?? "").trim().slice(0, 20);
      if (!worksheet) return error("순위 모드에서 사용할 수 없는 학습지입니다.");
      if (!name) return error("이름 정보를 확인하세요.");
      const worksheetName = `${worksheet.grade} · ${worksheet.title}`;
      const hostToken = crypto.randomUUID();
      const participantId = crypto.randomUUID();
      const participantToken = crypto.randomUUID();
      const now = Date.now();
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const code = roomCode();
        try {
          await db.batch([
            db.prepare("INSERT INTO arithmetic_races (room_code, teacher_token, worksheet_name, worksheet_route, seed, status, created_at) VALUES (?, ?, ?, ?, ?, 'waiting', ?)")
              .bind(code, hostToken, worksheetName, worksheet.route, 20260720, now),
            db.prepare("INSERT INTO arithmetic_race_participants (id, room_code, name, participant_token, joined_at) VALUES (?, ?, ?, ?, ?)")
              .bind(participantId, code, name, participantToken, now),
          ]);
          const race = { roomCode: code, worksheetName, worksheetRoute: worksheet.route, seed: 20260720, status: "waiting", createdAt: now, startedAt: null };
          return Response.json({ roomCode: code, hostToken, participantId, participantToken, race }, { status: 201 });
        } catch (cause) {
          if (attempt === 7) throw cause;
        }
      }
    }

    if (action === "join") {
      const code = String(payload.roomCode ?? "").trim();
      const name = String(payload.name ?? "").trim().slice(0, 20);
      if (!/^\d{6}$/.test(code)) return error("방 번호를 확인하세요.");
      if (!name) return error("이름을 입력하세요.");
      const race = await loadRace(db, code);
      if (!race) return error("없는 방입니다.", 404);
      if (race.status !== "waiting") return error("이미 시작한 방입니다.");
      const id = crypto.randomUUID();
      const participantToken = crypto.randomUUID();
      try {
        await db.prepare("INSERT INTO arithmetic_race_participants (id, room_code, name, participant_token, joined_at) VALUES (?, ?, ?, ?, ?)")
          .bind(id, code, name, participantToken, Date.now())
          .run();
      } catch {
        return error("같은 이름이 이미 입장했습니다.", 409);
      }
      return Response.json({ participantId: id, participantToken, race: publicRace(race) }, { status: 201 });
    }

    if (action === "start") {
      const code = String(payload.roomCode ?? "").trim();
      const hostToken = String(payload.hostToken ?? payload.teacherToken ?? "");
      const startedAt = Date.now();
      const result = await db.prepare("UPDATE arithmetic_races SET status = 'running', started_at = ? WHERE room_code = ? AND teacher_token = ? AND status = 'waiting'")
        .bind(startedAt, code, hostToken)
        .run();
      if (!result.meta.changes) return error("방 상태 또는 방장 권한을 확인하세요.", 403);
      return Response.json({ ok: true, startedAt });
    }

    if (action === "submit") {
      const code = String(payload.roomCode ?? "").trim();
      const participantId = String(payload.participantId ?? "");
      const participantToken = String(payload.participantToken ?? "");
      const correctCount = Number(payload.correctCount);
      const totalCount = Number(payload.totalCount);
      if (!Number.isInteger(totalCount) || totalCount < 1 || totalCount > 500 || !Number.isInteger(correctCount) || correctCount < 0 || correctCount > totalCount) return error("채점 결과를 확인하세요.");
      const race = await loadRace(db, code);
      if (!race || race.status !== "running" || !race.started_at) return error("진행 중인 방이 아닙니다.");
      const participant = (await loadParticipants(db, code)).find((row) => row.id === participantId && row.participant_token === participantToken);
      if (!participant) return error("학생 입장 정보를 확인하세요.", 403);
      if (participant.submitted_at !== null) return error("이미 도착했습니다.", 409);

      const wrongCount = totalCount - correctCount;
      const completed = wrongCount === 0;
      const submittedAt = completed ? Date.now() : null;
      const result = completed
        ? await db.prepare("UPDATE arithmetic_race_participants SET submitted_at = ?, correct_count = ?, total_count = ? WHERE id = ? AND room_code = ? AND participant_token = ? AND submitted_at IS NULL")
          .bind(submittedAt, correctCount, totalCount, participantId, code, participantToken)
          .run()
        : await db.prepare("UPDATE arithmetic_race_participants SET mistake_count = CASE WHEN total_count IS NULL THEN ? ELSE mistake_count END, correct_count = ?, total_count = ? WHERE id = ? AND room_code = ? AND participant_token = ? AND submitted_at IS NULL")
          .bind(wrongCount, correctCount, totalCount, participantId, code, participantToken)
          .run();
      if (!result.meta.changes) return error("도착 상태 또는 입장 정보를 확인하세요.", 409);

      const participants = await loadParticipants(db, code);
      const updated = participants.find((row) => row.id === participantId);
      const ranking = rankedParticipants(participants);
      return Response.json({
        completed,
        submittedAt,
        rank: completed ? ranking.find((entry) => entry.id === participantId)?.rank ?? null : null,
        correctCount,
        totalCount,
        wrongCount,
        mistakeCount: Number(updated?.mistake_count) || 0,
      });
    }

    if (action === "delete") {
      const code = String(payload.roomCode ?? "").trim();
      const hostToken = String(payload.hostToken ?? payload.teacherToken ?? "");
      const race = await loadRace(db, code);
      if (!race || race.teacher_token !== hostToken) return error("방장 권한을 확인하세요.", 403);
      await db.batch([
        db.prepare("DELETE FROM arithmetic_race_participants WHERE room_code = ?").bind(code),
        db.prepare("DELETE FROM arithmetic_races WHERE room_code = ? AND teacher_token = ?").bind(code, hostToken),
      ]);
      return Response.json({ ok: true });
    }

    return error("알 수 없는 요청입니다.");
  } catch (cause) {
    console.error(cause);
    return error("순위 모드 요청을 처리하지 못했습니다.", 500);
  }
}
