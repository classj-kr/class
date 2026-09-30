import { raceWorksheetByRoute } from "../../../lib/arithmetic-worksheets";
import { rankArrivedParticipants } from "../../../lib/arithmetic-race-ranking";
import { raceStore, type ParticipantRow, type RaceRow } from "../../../lib/arithmetic-race-store";

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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = (url.searchParams.get("room") ?? "").trim();
    const teacherToken = url.searchParams.get("hostToken") ?? url.searchParams.get("teacherToken") ?? "";
    const participantId = url.searchParams.get("participant") ?? "";
    const participantToken = url.searchParams.get("participantToken") ?? "";
    if (!/^\d{6}$/.test(code)) return error("방 번호를 확인하세요.");
    const store = await raceStore();
    const race = await store.race(code);
    if (!race) return error("없는 방입니다.", 404);
    const participants = await store.participants(code);
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
    const store = await raceStore();

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
        const opened = await store.openRace({
          room_code: code,
          teacher_token: hostToken,
          worksheet_name: worksheetName,
          worksheet_route: worksheet.route,
          seed: 20260720,
          status: "waiting",
          created_at: now,
          started_at: null,
        }, {
          id: participantId,
          room_code: code,
          name,
          participant_token: participantToken,
          joined_at: now,
          submitted_at: null,
          correct_count: null,
          total_count: null,
          mistake_count: 0,
        });
        if (!opened) continue;
        const race = { roomCode: code, worksheetName, worksheetRoute: worksheet.route, seed: 20260720, status: "waiting", createdAt: now, startedAt: null };
        return Response.json({ roomCode: code, hostToken, participantId, participantToken, race }, { status: 201 });
      }
      return error("빈 방 번호를 찾지 못했습니다. 잠시 후 다시 시도하세요.", 503);
    }

    if (action === "join") {
      const code = String(payload.roomCode ?? "").trim();
      const name = String(payload.name ?? "").trim().slice(0, 20);
      if (!/^\d{6}$/.test(code)) return error("방 번호를 확인하세요.");
      if (!name) return error("이름을 입력하세요.");
      const race = await store.race(code);
      if (!race) return error("없는 방입니다.", 404);
      if (race.status !== "waiting") return error("이미 시작한 방입니다.");
      const id = crypto.randomUUID();
      const participantToken = crypto.randomUUID();
      const joined = await store.joinRace({
        id,
        room_code: code,
        name,
        participant_token: participantToken,
        joined_at: Date.now(),
        submitted_at: null,
        correct_count: null,
        total_count: null,
        mistake_count: 0,
      });
      if (!joined) return error("같은 이름이 이미 입장했습니다.", 409);
      return Response.json({ participantId: id, participantToken, race: publicRace(race) }, { status: 201 });
    }

    if (action === "start") {
      const code = String(payload.roomCode ?? "").trim();
      const hostToken = String(payload.hostToken ?? payload.teacherToken ?? "");
      const startedAt = Date.now();
      const started = await store.startRace(code, hostToken, startedAt);
      if (!started) return error("방 상태 또는 방장 권한을 확인하세요.", 403);
      return Response.json({ ok: true, startedAt });
    }

    if (action === "submit") {
      const code = String(payload.roomCode ?? "").trim();
      const participantId = String(payload.participantId ?? "");
      const participantToken = String(payload.participantToken ?? "");
      const correctCount = Number(payload.correctCount);
      const totalCount = Number(payload.totalCount);
      if (!Number.isInteger(totalCount) || totalCount < 1 || totalCount > 500 || !Number.isInteger(correctCount) || correctCount < 0 || correctCount > totalCount) return error("채점 결과를 확인하세요.");
      const race = await store.race(code);
      if (!race || race.status !== "running" || !race.started_at) return error("진행 중인 방이 아닙니다.");
      const participant = (await store.participants(code)).find((row) => row.id === participantId && row.participant_token === participantToken);
      if (!participant) return error("학생 입장 정보를 확인하세요.", 403);
      if (participant.submitted_at !== null) return error("이미 도착했습니다.", 409);

      const wrongCount = totalCount - correctCount;
      const completed = wrongCount === 0;
      const submittedAt = completed ? Date.now() : null;
      const recorded = await store.recordAttempt({
        roomCode: code,
        participantId,
        participantToken,
        correctCount,
        totalCount,
        wrongCount,
        submittedAt,
      });
      if (!recorded) return error("도착 상태 또는 입장 정보를 확인하세요.", 409);

      const participants = await store.participants(code);
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
      const race = await store.race(code);
      if (!race || race.teacher_token !== hostToken) return error("방장 권한을 확인하세요.", 403);
      await store.closeRace(code, hostToken);
      return Response.json({ ok: true });
    }

    return error("알 수 없는 요청입니다.");
  } catch (cause) {
    console.error(cause);
    return error("순위 모드 요청을 처리하지 못했습니다.", 500);
  }
}
