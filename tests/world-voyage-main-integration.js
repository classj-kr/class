const assert = require("node:assert/strict");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { io } = require("../learning/inquiry/age-of-exploration/node_modules/socket.io-client");
const WebSocket = require("../game-hub-server/node_modules/ws");

const ROOT = path.resolve(__dirname, "..");
const PORT = 18765;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const server = spawn(process.execPath, ["server.js"], {
  cwd: path.join(ROOT, "game-hub-server"),
  env: {
    ...process.env,
    PORT: String(PORT),
    ARITHMETIC_PORT: "18766",
    HANGUKSA_PORT: "18767",
    WORLD_VOYAGE_PORT: "18768",
    NODE_ENV: "test",
    DATABASE_URL: "",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let output = "";
server.stdout.on("data", chunk => { output += chunk.toString(); });
server.stderr.on("data", chunk => { output += chunk.toString(); });

async function waitFor(url, timeoutMs = 60000) {
  const startedAt = Date.now();
  let lastResponse = "";
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      lastResponse = `${response.status} ${await response.text()}`;
    } catch (_) {}
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  throw new Error(`Timed out waiting for ${url}\nLast response: ${lastResponse}\n${output}`);
}

function connectSocketIo(transports = ["polling"]) {
  return new Promise((resolve, reject) => {
    const socket = io(BASE_URL, {
      path: "/learn/world-voyage/socket.io",
      transports,
      forceNew: true,
      reconnection: false,
      timeout: 10000,
    });
    socket.once("connect", () => resolve(socket));
    socket.once("connect_error", reject);
  });
}

function connectNativeWebSocket() {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(`ws://127.0.0.1:${PORT}`);
    socket.once("open", () => resolve(socket));
    socket.once("error", reject);
  });
}

(async () => {
  try {
    await waitFor(`${BASE_URL}/health`);

    const voyagePage = await waitFor(`${BASE_URL}/learn/world-voyage/`, 10000);
    const voyageHtml = await voyagePage.text();
    assert.match(voyageHtml, /\/learn\/world-voyage\/socket\.io\/socket\.io\.js/);

    const catalog = await waitFor(`${BASE_URL}/learn/world-voyage/api/mission-catalog`);
    assert.ok(Array.isArray((await catalog.json()).places));

    const teacher = await waitFor(`${BASE_URL}/learn/world-voyage/teacher`);
    assert.match(await teacher.text(), /도착 경주 현황판/);

    const htmlRedirect = await fetch(`${BASE_URL}/learning/games/omok/omok.html`, {
      redirect: "manual",
    });
    assert.equal(htmlRedirect.status, 308);
    assert.equal(htmlRedirect.headers.get("location"), "/learning/games/omok/omok");

    const cleanHtml = await waitFor(`${BASE_URL}/learning/games/omok/omok`);
    assert.match(await cleanHtml.text(), /오목/);

    const socketIo = await connectSocketIo();
    socketIo.close();

    // 학생 화면처럼 폴링으로 붙은 뒤 웹소켓으로 올라가야 한다. 폴링에 머물면 여러 명일 때 배가 끊긴다.
    const upgraded = await connectSocketIo(["polling", "websocket"]);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("voyage socket stayed on polling")), 5000);
      if (upgraded.io.engine.transport.name === "websocket") { clearTimeout(timer); return resolve(); }
      upgraded.io.engine.once("upgrade", () => { clearTimeout(timer); resolve(); });
    });
    const rooms = await new Promise(resolve => upgraded.emit("createRoom", { roomType: "free" }, resolve));
    assert.equal(rooms.ok, true);
    upgraded.close();

    const websocketOnly = await connectSocketIo(["websocket"]);
    websocketOnly.close();

    const nativeSocket = await connectNativeWebSocket();
    nativeSocket.close();

    console.log("world-voyage-main-integration: ok");
  } finally {
    server.kill("SIGTERM");
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
