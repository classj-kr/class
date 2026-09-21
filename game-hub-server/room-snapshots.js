const crypto = require("crypto");

const SNAPSHOT_VERSION = 1;
// Node.js timeout handles contain circular internal references. They must never
// be serialized with room state: doing so can abort snapshot persistence and
// take down the shared real-time server during an active game.
const TRANSIENT_ROOM_KEYS = new Set([
  "clients",
  "avalonTimer",
  "blokusTimer",
  "chessTimer",
  "codenamesTimer",
  "drawrelayTimer",
  "expeditionTimer",
  "honeycombTimer",
  "lastcardTimer",
  "bomb77Timer",
  "loveletterTimer",
  "rummikubTimer",
  "gemguildTimer",
  "kingdomtrailsTimer",
  "quizraceBroadcastTimer"
]);

function hashClientToken(value) {
  const token = String(value || "");
  return token ? crypto.createHash("sha256").update(token).digest("hex") : "";
}

function clientMatchesToken(client, clientToken) {
  const expected = client?.meta?.clientTokenHash || hashClientToken(client?.meta?.clientToken);
  const actual = hashClientToken(clientToken);
  if (!expected || !actual || expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
}

// 저장하면 안 되는 값인가. 적어 둔 이름에 더해, 이름이 Timer 로 끝나거나 실제로
// setTimeout 핸들처럼 생긴 것도 거른다. 하나라도 섞이면 그 방은 저장 자체가 실패한다.
function isTransientRoomValue(key, value) {
  if (TRANSIENT_ROOM_KEYS.has(key)) return true;
  if (/Timer$/.test(key)) return true;
  if (typeof value === "function") return true;
  return Boolean(value) && typeof value === "object"
    && typeof value.unref === "function" && typeof value.refresh === "function";
}

function snapshotRoom(room) {
  if (!room || typeof room !== "object" || !room.gameId || !room.roomCode || !room.hostId) return null;
  const state = {};
  for (const [key, value] of Object.entries(room)) {
    if (!isTransientRoomValue(key, value)) state[key] = value;
  }
  const participants = [];
  for (const [playerId, client] of room.clients || []) {
    const clientTokenHash = client?.meta?.clientTokenHash || hashClientToken(client?.meta?.clientToken);
    if (!clientTokenHash) continue;
    participants.push({
      playerId: String(playerId),
      role: String(client?.meta?.role || (playerId === room.hostId ? "host" : "guest")),
      clientTokenHash
    });
  }
  return { version: SNAPSHOT_VERSION, state, participants };
}

function restoreRoom(snapshot, options = {}) {
  if (!snapshot || Number(snapshot.version) !== SNAPSHOT_VERSION) return null;
  const state = snapshot.state;
  if (!state || typeof state !== "object" || !state.gameId || !state.roomCode || !state.hostId) return null;
  const closedReadyState = Number.isInteger(options.closedReadyState) ? options.closedReadyState : 3;
  const clients = new Map();
  for (const participant of Array.isArray(snapshot.participants) ? snapshot.participants : []) {
    const playerId = String(participant?.playerId || "");
    const clientTokenHash = String(participant?.clientTokenHash || "");
    if (!playerId || !/^[a-f0-9]{64}$/i.test(clientTokenHash)) continue;
    clients.set(playerId, {
      readyState: closedReadyState,
      meta: {
        playerId,
        roomKey: `${state.gameId}:${state.roomCode}`,
        role: participant.role === "host" || playerId === state.hostId ? "host" : "guest",
        clientToken: null,
        clientTokenHash,
        disconnectTimer: null
      }
    });
  }
  if (!clients.has(String(state.hostId))) return null;
  return { ...state, clients };
}

module.exports = { clientMatchesToken, hashClientToken, isTransientRoomValue, restoreRoom, snapshotRoom };
