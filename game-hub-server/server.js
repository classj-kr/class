const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { spawn } = require("child_process");
const { WebSocketServer, WebSocket } = require("ws");
const LoveLetter = require("./loveletter");
const LastCard = require("./lastcard");
const Bomb77 = require("./bomb77");
const Rummikub = require("./rummikub");
const GemGuild = require("./gemguild");
const CityChase = require("./citychase");
const KingdomTrails = require("./kingdomtrails");
const Blokus = require("./blokus");
const Chess = require("./chess");
const Honeycomb = require("./honeycomb");
const DrawRelay = require("./drawrelay");
const Expedition = require("./expedition");
const Clue = require("./clue");
const Codenames = require("./codenames");
const Dobble = require("./dobble");
const Quizrace = require("./quizrace");
const { createClassroomPlatform } = require("./classroom-platform");
const { redirectLegacyHosts } = require("./canonical-host");
const {
  clientMatchesToken,
  restoreRoom,
  snapshotRoom
} = require("./room-snapshots");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const rooms = new Map();
const classroomPlatform = createClassroomPlatform({
  databaseUrl: process.env.DATABASE_URL,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  teacherEmails: process.env.TEACHER_EMAILS,
  adminEmails: process.env.ADMIN_EMAILS,
  nodeEnv: process.env.NODE_ENV,
  isLiveQuizRaceCode: (code) => rooms.has(`quizrace:${code}`)
});

const PORT = Number(process.env.PORT) || 10000;
const ARITHMETIC_PORT = Number(process.env.ARITHMETIC_PORT) || 10001;
const WORLD_VOYAGE_PORT = Number(process.env.WORLD_VOYAGE_PORT) || 10003;
const ROOM_RECONNECT_GRACE_MS = Math.max(30000, Number(process.env.ROOM_RECONNECT_GRACE_MS) || 120000);
const ROOM_SNAPSHOT_TTL_SECONDS = Math.max(900, Number(process.env.ROOM_SNAPSHOT_TTL_SECONDS) || 10800);
const ROOM_SNAPSHOT_INTERVAL_MS = 2000;
const SITE_ROOT = path.resolve(__dirname, "..");
const WORLD_VOYAGE_PREFIX = "/learn/world-voyage";
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function isSameRequestOrigin(req, origin) {
  if (!origin) return true;
  try {
    return new URL(origin).origin === `${req.protocol}://${req.get("host")}`;
  } catch (_) {
    return false;
  }
}

app.use(redirectLegacyHosts);

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "base-uri 'self'; object-src 'none'; frame-ancestors 'self'");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(self), microphone=(self), geolocation=()");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  const origin = String(req.get("origin") || "").trim();
  const sameOrigin = isSameRequestOrigin(req, origin);
  const isApiRequest = req.path === "/api" || req.path.startsWith("/api/");
  const fetchSite = String(req.get("sec-fetch-site") || "").toLowerCase();

  if (isApiRequest && origin && !sameOrigin) {
    return res.status(403).json({ error: "CROSS_ORIGIN_REQUEST_BLOCKED", message: "허용되지 않은 요청 출처입니다." });
  }
  if (isApiRequest && MUTATING_METHODS.has(req.method) && fetchSite === "cross-site") {
    return res.status(403).json({ error: "CROSS_SITE_REQUEST_BLOCKED", message: "허용되지 않은 요청 출처입니다." });
  }
  if (origin && sameOrigin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.vary("Origin");
  }
  if (req.method === "OPTIONS") {
    if (origin && !sameOrigin) return res.sendStatus(403);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.sendStatus(204);
  }
  next();
});

function startLearningApp(relativeDirectory, port, label) {
  const appDirectory = path.join(SITE_ROOT, relativeDirectory);
  const cliPath = path.join(appDirectory, "node_modules", "vinext", "dist", "cli.js");
  const child = spawn(
    process.execPath,
    [cliPath, "start", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: appDirectory,
      env: { ...process.env, PORT: String(port) },
      stdio: ["ignore", "inherit", "inherit"],
    },
  );

  child.on("exit", (code, signal) => {
    console.error(`${label} stopped (code=${code}, signal=${signal})`);
  });
  return child;
}

function startNodeLearningApp(relativeDirectory, port, label) {
  const appDirectory = path.join(SITE_ROOT, relativeDirectory);
  const child = spawn(
    process.execPath,
    ["server.js"],
    {
      cwd: appDirectory,
      env: { ...process.env, PORT: String(port) },
      stdio: ["ignore", "inherit", "inherit"],
    },
  );

  child.on("exit", (code, signal) => {
    console.error(`${label} stopped (code=${code}, signal=${signal})`);
  });
  return child;
}

function proxyToLearningApp(port, options = {}) {
  return (req, res) => {
    const headers = { ...req.headers, host: `127.0.0.1:${port}` };
    const proxyPath = options.stripPrefix && req.originalUrl.startsWith(options.stripPrefix)
      ? req.originalUrl.slice(options.stripPrefix.length) || "/"
      : req.originalUrl;
    const proxyRequest = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path: options.rewritePath ? options.rewritePath(proxyPath) : proxyPath,
        method: req.method,
        headers,
      },
      (proxyResponse) => {
        res.writeHead(proxyResponse.statusCode || 502, proxyResponse.headers);
        proxyResponse.pipe(res);
      },
    );

    proxyRequest.on("error", () => {
      if (!res.headersSent) {
        res.status(503).send("학습 앱을 준비하고 있습니다. 잠시 후 다시 시도해 주세요.");
      } else {
        res.end();
      }
    });
    req.pipe(proxyRequest);
  };
}

const arithmeticApp = startLearningApp(
  "learning/literacy-numeracy/arithmetics",
  ARITHMETIC_PORT,
  "Arithmetic app",
);
const worldVoyageApp = startNodeLearningApp(
  "learning/inquiry/age-of-exploration",
  WORLD_VOYAGE_PORT,
  "World Voyage app",
);

const stopLearningApps = () => {
  arithmeticApp.kill();
  worldVoyageApp.kill();
};
let shutdownStarted = false;
async function shutdownServer(signal) {
  if (shutdownStarted) return;
  shutdownStarted = true;
  console.log(`Received ${signal}; saving multiplayer rooms before shutdown.`);
  const forcedExit = setTimeout(() => process.exit(0), 8000);
  try {
    await persistAllRoomSnapshots();
  } finally {
    stopLearningApps();
    for (const client of wss.clients) {
      try { client.close(1012, "SERVER_RESTART"); } catch (_) {}
    }
    wss.close();
    server.close(() => {
      clearTimeout(forcedExit);
      process.exit(0);
    });
  }
}
process.once("SIGTERM", () => { void shutdownServer("SIGTERM"); });
process.once("SIGINT", () => { void shutdownServer("SIGINT"); });

const staticAssetOptions = {
  dotfiles: "ignore",
  setHeaders(res, filepath) {
    const ext = path.extname(filepath).toLowerCase();
    if ([".mp3", ".ogg", ".webm", ".m4a", ".wav", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico", ".woff", ".woff2", ".ttf"].includes(ext)) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    } else if ([".css", ".js"].includes(ext)) {
      res.setHeader("Cache-Control", "public, max-age=86400");
    } else if (ext === ".html") {
      res.setHeader("Cache-Control", "no-cache");
    }
  }
};

// The navigation script is deferred, so hide legacy back links before first paint
// to stop them flashing. visibility (not display) keeps their size measurable.
const SITE_BACK_PENDING_TAG = '<script>if(window.self===window.top&&!["/","/index.html"].includes(location.pathname))document.documentElement.classList.add("site-back-pending")</script>'
  + '<style>.site-back-pending :is(a.back,a.back-button,a.back-link,a.home,a.home-link,a.counting-back,a.catalog-back){visibility:hidden!important}</style>';
const SITE_BACK_SCRIPT_TAG = `${SITE_BACK_PENDING_TAG}<script data-site-back-navigation="true" src="/assets/site-back-navigation.js?v=20260926-game-flow" defer></script>`;
const SITE_SFX_SCRIPT_TAG = '<script data-class-game-sfx="true" src="/assets/sound/game-sfx.js?v=20260912-feedback-scope-1" defer></script>';

function sendSiteHtml(req, res, filepath, next) {
  fs.readFile(filepath, "utf8", (error, htmlSource) => {
    if (error) return next(error);

    const htmlWithBackNavigation = htmlSource.includes("/assets/site-back-navigation.js")
      ? htmlSource
      : /<\/head>/i.test(htmlSource)
        ? htmlSource.replace(/<\/head>/i, `  ${SITE_BACK_SCRIPT_TAG}\n</head>`)
        : `${SITE_BACK_SCRIPT_TAG}\n${htmlSource}`;
    const html = htmlWithBackNavigation.includes("/assets/sound/game-sfx.js")
      ? htmlWithBackNavigation
      : /<\/head>/i.test(htmlWithBackNavigation)
        ? htmlWithBackNavigation.replace(/<\/head>/i, `  ${SITE_SFX_SCRIPT_TAG}\n</head>`)
        : `${SITE_SFX_SCRIPT_TAG}\n${htmlWithBackNavigation}`;

    res.setHeader("Cache-Control", "no-cache");
    res.type("html");
    if (req.method === "HEAD") return res.end();
    res.send(html);
  });
}

app.use("/assets/avatars", express.static(path.join(SITE_ROOT, "classtools", "assets", "avatars"), staticAssetOptions));
app.use("/assets", express.static(path.join(SITE_ROOT, "assets"), staticAssetOptions));
app.get("/robots.txt", (_req, res) => {
  res.setHeader("Cache-Control", "no-cache, must-revalidate");
  res.type("text/plain").sendFile(path.join(SITE_ROOT, "robots.txt"));
});
app.get("/sitemap.xml", (_req, res) => {
  res.setHeader("Cache-Control", "no-cache, must-revalidate");
  res.type("application/xml").sendFile(path.join(SITE_ROOT, "sitemap.xml"));
});
app.get("/favicon.ico", (_req, res) => {
  res.setHeader("Cache-Control", "no-cache, must-revalidate");
  res.sendFile(path.join(SITE_ROOT, "favicon.ico"));
});
app.get("/favicon-20260824.ico", (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.sendFile(path.join(SITE_ROOT, "favicon-20260824.ico"));
});
app.get("/favicon-20260824-v2.ico", (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.sendFile(path.join(SITE_ROOT, "favicon-20260824-v2.ico"));
});
app.get("/favicon-20260824-v3.ico", (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.sendFile(path.join(SITE_ROOT, "favicon-20260824-v3.ico"));
});
app.get("/favicon-20260824-v5.ico", (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.sendFile(path.join(SITE_ROOT, "favicon-20260824-v5.ico"));
});
app.get("/favicon-20260824-v6.ico", (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.sendFile(path.join(SITE_ROOT, "favicon-20260824-v6.ico"));
});
app.get("/naverc953171c2ff3a730580e7ed2be00700d.html", (_req, res) => {
  res.setHeader("Cache-Control", "no-cache, must-revalidate");
  res.type("text/plain").send("naver-site-verification: naverc953171c2ff3a730580e7ed2be00700d.html\n");
});
app.get("/favicon.png", (_req, res) => {
  res.setHeader("Cache-Control", "no-cache, must-revalidate");
  res.sendFile(path.join(SITE_ROOT, "favicon.png"));
});
app.use(
  "/assets",
  express.static(path.join(SITE_ROOT, "learning", "literacy-numeracy", "arithmetics", "dist", "client", "assets"), staticAssetOptions),
);
app.use(
  "/fonts",
  express.static(path.join(SITE_ROOT, "learning", "literacy-numeracy", "arithmetics", "dist", "client", "fonts"), staticAssetOptions),
);
app.get("/math-learning-banner.webp", (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.sendFile(
    path.join(
      SITE_ROOT,
      "learning",
      "literacy-numeracy",
      "arithmetics",
      "dist",
      "client",
      "math-learning-banner.webp",
    ),
  );
});
// The Korea map app loads relief/height tiles and photos after the gated page opens.
// Serve these immutable folders before requireSiteAccess so a session check
// cannot turn an image response into login HTML.
for (const folder of ["relief", "dem", "heritage", "travel"]) {
  app.use(
    `/learning/inquiry/korea-map/${folder}`,
    express.static(path.join(SITE_ROOT, "learning", "inquiry", "korea-map", folder), staticAssetOptions),
  );
}
// The four domestic-map apps became tabs of /learning/inquiry/korea-map. Old links
// land on the matching tab; the geography app keeps its own #theme fragment.
for (const [oldFolder, tab] of [["korean-museum", "#heritage"], ["korea-travel-map", "#travel"], ["korea-geography", ""], ["korea-terrain", "#terrain"]]) {
  app.use(`/learning/inquiry/${oldFolder}`, (_req, res) => res.redirect(301, `/learning/inquiry/korea-map/${tab}`));
}
const MAX_ROOM_PLAYERS = {
  setgame: 4,
  nimgame: 2,
  janggi: 2,
  chess: 2,
  omok: 2,
  baduk: 2,
  connect6: 2,
  diamondgame: 3,
  lastcard: 4,
  bomb77: 8,
  loveletter: 4,
  rummikub: 4,
  gemguild: 4,
  citychase: 6,
  kingdomtrails: 4,
  blokus: 4,
  honeycomb: 6,
  drawrelay: 8,
  expedition: 8,
  avalon: 8,
  clue: 6,
  codenames: 5,
  dobble: 8,
  spelling: 61,
  quizrace: 61,
  circulation: 61,
  digestion: 61,
  respiration: 61,
  nervous: 61,
  immune: 61,
  movement: 61,
  excretion: 61,
  temperature: 61
};

const MULTIPLAYER_CONTENT_PATHS = Object.freeze({
  setgame: "/learning/games/setgame/setgame",
  nimgame: "/learning/games/nimgame/nimgame",
  janggi: "/learning/games/janggi/janggi",
  chess: "/learning/games/chess/chess",
  omok: "/learning/games/omok/omok",
  baduk: "/learning/games/baduk/baduk",
  connect6: "/learning/games/connect6/connect6",
  diamondgame: "/learning/games/diamondgame/diamondgame",
  lastcard: "/learning/games/lastcard/lastcard",
  bomb77: "/learning/games/bomb77/bomb77",
  loveletter: "/learning/games/loveletter/loveletter",
  rummikub: "/learning/games/rummikub/rummikub",
  gemguild: "/learning/games/gemguild/gemguild",
  citychase: "/learning/games/citychase/citychase",
  kingdomtrails: "/learning/games/kingdom-trails/kingdom-trails",
  blokus: "/learning/games/blokus/blokus",
  honeycomb: "/learning/games/honeycomb/honeycomb",
  drawrelay: "/learning/games/drawrelay/drawrelay",
  expedition: "/learning/games/expedition/expedition",
  avalon: "/learning/games/avalon/avalon",
  clue: "/learning/games/clue/clue",
  codenames: "/learning/games/codenames/codenames",
  dobble: "/learning/games/dobble/dobble",
  spelling: "/learning/literacy-numeracy/spelling",
  quizrace: "/learning/class-race",
  circulation: "/learning/inquiry/human-body/circulation",
  digestion: "/learning/inquiry/human-body/digestion",
  respiration: "/learning/inquiry/human-body/respiration",
  nervous: "/learning/inquiry/human-body/nervous",
  immune: "/learning/inquiry/human-body/immune",
  movement: "/learning/inquiry/human-body/skeleton",
  excretion: "/learning/inquiry/human-body/excretion",
  temperature: "/learning/inquiry/human-body/homeostasis"
});

const FINISHER_GAMES = new Set(["coinweighing", "hanoitower", "sphinx", "slidingpuzzle", "nonogram"]);

// 3학년 분수②는 예전에 /fraction 에 따로 있었다. 옛 주소로 온 사람은 연산 목록 안의 새 자리로 보낸다.
app.use("/fraction", (req, res) => {
  const query = req.originalUrl.indexOf("?");
  res.redirect(301, "/arithmetic/grade-3-fraction-2" + (query >= 0 ? req.originalUrl.slice(query) : ""));
});
app.use(["/admin", "/schooladmin", "/arithmetic", "/api/arithmetic-race", "/classtools", "/learning", "/learn", "/notice", "/teacher", "/room", "/vote", "/school-election"], classroomPlatform.requireSiteAccess);
app.use("/arithmetic", proxyToLearningApp(ARITHMETIC_PORT));
app.use("/api/arithmetic-race", proxyToLearningApp(ARITHMETIC_PORT));
// 한능검 기출은 정적 페이지가 되었다. 예전 주소로 온 사람은 새 자리로 보낸다.
app.use("/hanguksa", (req, res) => res.redirect(301, "/learning/inquiry/korean-history/"));
app.get(WORLD_VOYAGE_PREFIX, (req, res, next) => {
  if (req.originalUrl.split("?")[0].endsWith("/")) return next();
  const query = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?")) : "";
  res.redirect(308, `${WORLD_VOYAGE_PREFIX}/${query}`);
});
app.use(
  WORLD_VOYAGE_PREFIX,
  proxyToLearningApp(WORLD_VOYAGE_PORT, {
    stripPrefix: WORLD_VOYAGE_PREFIX,
    rewritePath(proxyPath) {
      const [pathname, query = ""] = proxyPath.split("?");
      const cleanPath = pathname === "/teacher" ? "/teacher.html" : pathname;
      return query ? `${cleanPath}?${query}` : cleanPath;
    },
  }),
);

const LEGACY_LEARNING_PATHS = new Map([
  ["/learning/reading", "/learning/literacy-numeracy/reading"],
  ["/learning/basics/idioms", "/learning/literacy-numeracy/classical-chinese-idioms"],
  ["/learning/academics/classical-chinese-idioms", "/learning/literacy-numeracy/classical-chinese-idioms"],
  ["/learning/academics/proverbs", "/learning/literacy-numeracy/proverbs"],
  ["/learning/academics/story-books", "/learning/literacy-numeracy/story-books"],
  ["/learning/simulations/body-explorer", "/learning/inquiry/human-body"],
  ["/learning/academics/body-explorer", "/learning/inquiry/human-body"],
  ["/learning/inquiry/body-explorer", "/learning/inquiry/human-body"],
  ["/learning/training/music-studio", "/learning/arts/music-studio"],
  ["/learning/art", "/learning/arts/art-appreciation/museum/"],
  ["/learning/music/classics", "/learning/arts/music-listening/genres/classical"],
  ["/learning/music/korean", "/learning/arts/music-listening/genres/korean"],
  ["/learning/arts/classical-music", "/learning/arts/music-listening/genres/classical"],
  ["/learning/arts/korean-music", "/learning/arts/music-listening/genres/korean"],
  ["/learning/basics", "/learning/literacy-numeracy"],
  ["/learning/academics", "/learning/inquiry"],
]);
for (const [legacyPath, currentPath] of LEGACY_LEARNING_PATHS) {
  app.use(legacyPath, (req, res) => {
    res.redirect(308, `${currentPath}${req.url}`);
  });
}

app.use(express.json({ limit: "32kb" }));
app.use("/api", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
}, classroomPlatform.router);

for (const [route, file] of [
  ["/privacy", "privacy.html"],
  ["/school-setup", "school-setup.html"],
  ["/student-privacy", "student-privacy.html"],
  ["/support", "support.html"],
  ["/terms", "terms.html"],
]) {
  app.get(route, (req, res, next) => sendSiteHtml(req, res, path.join(SITE_ROOT, file), next));
}

const CLEAN_HTML_ROOTS = ["/admin", "/classboard", "/schooladmin", "/classtools", "/learning", "/notice", "/teacher", "/room", "/vote", "/school-election"];
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();

  let pathname;
  try {
    pathname = decodeURIComponent(req.path);
  } catch (_) {
    return res.status(400).send("잘못된 주소입니다.");
  }

  const isPublicHtmlPath = pathname === "/index.html"
    || CLEAN_HTML_ROOTS.some(root => pathname === root || pathname.startsWith(`${root}/`));
  if (!isPublicHtmlPath) return next();

  if (pathname.endsWith("/index.html")) {
    const cleanPath = pathname.slice(0, -"index.html".length);
    const query = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?")) : "";
    return res.redirect(308, `${cleanPath}${query}`);
  }
  if (pathname.endsWith(".html")) {
    const cleanPath = pathname.slice(0, -".html".length);
    const query = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?")) : "";
    return res.redirect(308, `${cleanPath}${query}`);
  }

  if (!path.extname(pathname) && !pathname.endsWith("/")) {
    const dirCandidate = path.resolve(SITE_ROOT, `.${pathname}`);
    if (dirCandidate.startsWith(`${SITE_ROOT}${path.sep}`) && fs.existsSync(dirCandidate) && fs.statSync(dirCandidate).isDirectory()) {
      const query = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?")) : "";
      return res.redirect(308, `${pathname}/${query}`);
    }
  }

  if (pathname.endsWith("/")) {
    const indexCandidate = path.resolve(SITE_ROOT, `.${pathname}index.html`);
    if (!indexCandidate.startsWith(`${SITE_ROOT}${path.sep}`)) return res.sendStatus(400);
    return fs.stat(indexCandidate, (error, stats) => {
      if (error || !stats.isFile()) return next();
      sendSiteHtml(req, res, indexCandidate, next);
    });
  }

  if (path.extname(pathname)) return next();
  const candidate = path.resolve(SITE_ROOT, `.${pathname}.html`);
  if (!candidate.startsWith(`${SITE_ROOT}${path.sep}`)) return res.sendStatus(400);
  fs.stat(candidate, (error, stats) => {
    if (error || !stats.isFile()) return next();
    sendSiteHtml(req, res, candidate, next);
  });
});

for (const directory of ["admin", "classboard", "classtools", "css", "js", "learning", "notice", "schooladmin", "teacher", "room", "vote", "school-election"]) {
  app.use(`/${directory}`, express.static(path.join(SITE_ROOT, directory), staticAssetOptions));
}

const museumClasses = new Map();
const parkClasses = new Map();
const roomSnapshotFingerprints = new Map();
const roomRestorePromises = new Map();

function safeSend(socket, payload) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
}

function cleanToken(value, maxLength = 40) {
  return String(value || "").trim().slice(0, maxLength);
}

function roomKey(gameId, roomCode) {
  return `${gameId}:${roomCode}`;
}

function roomSnapshotFingerprint(snapshot) {
  return crypto.createHash("sha256").update(JSON.stringify(snapshot)).digest("hex");
}

async function persistRoomSnapshot(room, force = false) {
  if (!room) return false;
  const key = roomKey(room.gameId, room.roomCode);
  const snapshot = snapshotRoom(room);
  if (!snapshot) return false;
  const fingerprint = roomSnapshotFingerprint(snapshot);
  if (!force && roomSnapshotFingerprints.get(key) === fingerprint) return true;
  roomSnapshotFingerprints.set(key, fingerprint);
  try {
    return await classroomPlatform.saveMultiplayerRoomSnapshot({
      roomKey: key,
      gameId: room.gameId,
      roomCode: room.roomCode,
      snapshot,
      ttlSeconds: ROOM_SNAPSHOT_TTL_SECONDS
    });
  } catch (error) {
    roomSnapshotFingerprints.delete(key);
    console.error(`Failed to persist multiplayer room ${key}:`, error);
    return false;
  }
}

async function persistAllRoomSnapshots() {
  await Promise.allSettled([...rooms.values()].map(room => persistRoomSnapshot(room, true)));
}

async function restorePersistedRoom(gameId, roomCode) {
  const key = roomKey(gameId, roomCode);
  if (rooms.has(key)) return rooms.get(key);
  if (roomRestorePromises.has(key)) return roomRestorePromises.get(key);

  const restorePromise = (async () => {
    try {
      const record = await classroomPlatform.loadMultiplayerRoomSnapshot(key);
      if (!record || record.game_id !== gameId || record.room_code !== roomCode) return null;
      if (rooms.has(key)) return rooms.get(key);
      const restored = restoreRoom(record.snapshot, { closedReadyState: WebSocket.CLOSED });
      if (!restored || restored.gameId !== gameId || restored.roomCode !== roomCode) return null;
      if (restored.bomb77 && restored.bomb77.rulesVersion !== Bomb77.RULES_VERSION) {
        Bomb77.resetToLobby(restored.bomb77, "게임 규칙이 업데이트되었습니다. 방장이 다시 시작해 주세요.");
      }
      rooms.set(key, restored);
      roomSnapshotFingerprints.set(key, roomSnapshotFingerprint(record.snapshot));
      if (restored.expedition) expeditionSchedule(restored);
      if (restored.drawrelay) scheduleDrawRelayDeadline(restored);
      console.log(`Restored multiplayer room ${key} from PostgreSQL.`);
      return restored;
    } catch (error) {
      console.error(`Failed to restore multiplayer room ${key}:`, error);
      return null;
    } finally {
      roomRestorePromises.delete(key);
    }
  })();

  roomRestorePromises.set(key, restorePromise);
  return restorePromise;
}

function removeRoom(key) {
  rooms.delete(key);
  roomSnapshotFingerprints.delete(key);
  void classroomPlatform.deleteMultiplayerRoomSnapshot(key).catch(error => {
    console.error(`Failed to delete multiplayer room snapshot ${key}:`, error);
  });
}

function museumBroadcast(classKey) {
  const museumClass = museumClasses.get(classKey);
  if (!museumClass) return;
  const visitors = [...museumClass.clients.values()].map(socket => socket.meta.museumVisitor).filter(Boolean);
  for (const socket of museumClass.clients.values()) safeSend(socket, { type: "MUSEUM_STATE", visitors });
}

function leaveMuseum(socket) {
  const visitor = socket.meta.museumVisitor;
  if (!visitor) return;
  const museumClass = museumClasses.get(visitor.classKey);
  if (museumClass) {
    museumClass.clients.delete(visitor.userId);
    if (museumClass.clients.size) museumBroadcast(visitor.classKey);
    else museumClasses.delete(visitor.classKey);
  }
  socket.meta.museumVisitor = null;
}

function safeMuseumPosition(room, x, z) {
  let nextX = Math.max(-1.9, Math.min(1.9, Number(x) || 0));
  let nextZ = Math.max(-28.2, Math.min(6.1, Number(z) || 5.8));
  return { x:nextX, z:nextZ };
}

function parkBroadcast(classKey) {
  const parkClass = parkClasses.get(classKey);
  if (!parkClass) return;
  const visitors = [...parkClass.clients.values()].map(socket => socket.meta.parkVisitor).filter(Boolean);
  for (const socket of parkClass.clients.values()) safeSend(socket, { type: "PARK_STATE", visitors });
}

function leavePark(socket) {
  const visitor = socket.meta.parkVisitor;
  if (!visitor) return;
  const parkClass = parkClasses.get(visitor.classKey);
  if (parkClass) {
    parkClass.clients.delete(visitor.userId);
    if (parkClass.clients.size) parkBroadcast(visitor.classKey);
    else parkClasses.delete(visitor.classKey);
  }
  socket.meta.parkVisitor = null;
}

const PARK_ZONE_OBSTACLES = [
  {x:9,z:-17.75,r:2.94},{x:-7.5,z:-19.5,r:2.94},{x:19.375,z:-6.875,r:2.94},{x:-19.375,z:-6.875,r:2.94},
  {x:0,z:-21.25,r:2.94},{x:0,z:50,hx:20,hz:30},{x:52,z:0,r:13.68},{x:0,z:14,r:2.94},{x:0,z:-13.75,r:2.94}
];

function safeParkPosition(x, z) {
  let nextX = Number(x) || 0, nextZ = Number(z) || 0;
  const radius = Math.hypot(nextX, nextZ);
  if (radius > 85) { const scale = 85 / radius; nextX *= scale; nextZ *= scale; }
  for (const obstacle of PARK_ZONE_OBSTACLES) {
    const dx = nextX - obstacle.x, dz = nextZ - obstacle.z;
    if (obstacle.hx != null) {
      if (Math.abs(dx) < obstacle.hx && Math.abs(dz) < obstacle.hz) {
        const pushX = obstacle.hx - Math.abs(dx), pushZ = obstacle.hz - Math.abs(dz);
        if (pushX < pushZ) nextX = obstacle.x + (Math.sign(dx) || 1) * obstacle.hx;
        else nextZ = obstacle.z + (Math.sign(dz) || 1) * obstacle.hz;
      }
      continue;
    }
    const d = Math.hypot(dx, dz);
    if (d < obstacle.r) { const scale = obstacle.r / (d || 1); nextX = obstacle.x + (dx || .01) * scale; nextZ = obstacle.z + (dz || .01) * scale; }
  }
  return { x: nextX, z: nextZ };
}

function loveLetterBroadcast(room) {
  if (!room?.loveletter) return;
  for (const [id, client] of room.clients) {
    safeSend(client, {
      type: "LOVELETTER_STATE",
      state: LoveLetter.stateFor(room.loveletter, id)
    });
  }
  scheduleLoveLetterTimeout(room);
}

function loveLetterError(socket, message) {
  safeSend(socket, { type: "LOVELETTER_ERROR", message });
}

function scheduleLoveLetterTimeout(room) {
  clearTimeout(room?.loveletterTimer);
  const game = room?.loveletter;
  if (!game || game.phase !== "playing" || !game.turnDeadline) return;
  const expectedAction = game.actionNumber;
  const wait = Math.max(50, game.turnDeadline - Date.now());
  room.loveletterTimer = setTimeout(() => {
    if (rooms.get(roomKey(room.gameId, room.roomCode)) !== room) return;
    if (game.phase !== "playing" || game.actionNumber !== expectedAction) return;
    LoveLetter.autoPlay(game);
    loveLetterBroadcast(room);
  }, wait);
  room.loveletterTimer.unref?.();
}

function clueBroadcast(room) {
  if (!room?.clue) return;
  for (const [id, client] of room.clients) {
    safeSend(client, {
      type: "CLUE_STATE",
      state: Clue.stateFor(room.clue, id)
    });
  }
}

function clueError(socket, message) {
  safeSend(socket, { type: "CLUE_ERROR", message });
}

function lastCardBroadcast(room) {
  if (!room?.lastcard) return;
  for (const [id, client] of room.clients) {
    safeSend(client, {
      type: "LASTCARD_STATE",
      state: LastCard.stateFor(room.lastcard, id)
    });
  }
  scheduleLastCardTimeout(room);
}

function lastCardError(socket, message) {
  safeSend(socket, { type: "LASTCARD_ERROR", message });
}

function scheduleLastCardTimeout(room) {
  clearTimeout(room?.lastcardTimer);
  const game = room?.lastcard;
  if (!game || game.phase !== "playing" || !game.turnDeadline) return;
  const expectedAction = game.actionNumber;
  const wait = Math.max(50, game.turnDeadline - Date.now());
  room.lastcardTimer = setTimeout(() => {
    if (rooms.get(roomKey(room.gameId, room.roomCode)) !== room) return;
    if (game.phase !== "playing" || game.actionNumber !== expectedAction) return;
    const activeId = game.players[game.turnIndex]?.id;
    if (activeId) LastCard.drawAndPass(game, activeId, undefined, true);
    lastCardBroadcast(room);
  }, wait);
  room.lastcardTimer.unref?.();
}

function bomb77Broadcast(room) {
  if (!room?.bomb77) return;
  for (const [id, client] of room.clients) {
    safeSend(client, {
      type: "BOMB77_STATE",
      state: Bomb77.stateFor(room.bomb77, id)
    });
  }
  scheduleBomb77Timeout(room);
}

function bomb77Error(socket, message) {
  safeSend(socket, { type: "BOMB77_ERROR", message });
}

function scheduleBomb77Timeout(room) {
  clearTimeout(room?.bomb77Timer);
  const game = room?.bomb77;
  if (!game || !["playing", "roundEnd"].includes(game.phase)) return;
  const deadline = game.phase === "roundEnd" ? game.roundDeadline : game.turnDeadline;
  if (!deadline) return;
  const expectedAction = game.actionNumber;
  const expectedPhase = game.phase;
  room.bomb77Timer = setTimeout(() => {
    if (rooms.get(roomKey(room.gameId, room.roomCode)) !== room) return;
    if (game.phase !== expectedPhase || game.actionNumber !== expectedAction) return;
    if (game.phase === "roundEnd") Bomb77.nextRound(game);
    else Bomb77.autoPlay(game);
    bomb77Broadcast(room);
  }, Math.max(50, deadline - Date.now()));
  room.bomb77Timer.unref?.();
}

function rummikubBroadcast(room) {
  if (!room?.rummikub) return;
  for (const [id, client] of room.clients) {
    safeSend(client, {
      type: "RUMMIKUB_STATE",
      state: Rummikub.stateFor(room.rummikub, id)
    });
  }
  scheduleRummikubTimeout(room);
}

function rummikubError(socket, message) {
  safeSend(socket, { type: "RUMMIKUB_ERROR", message });
}

function scheduleRummikubTimeout(room) {
  clearTimeout(room?.rummikubTimer);
  const game = room?.rummikub;
  if (!game || game.phase !== "playing" || !game.turnDeadline) return;
  const expectedRevision = game.revision;
  const wait = Math.max(50, game.turnDeadline - Date.now());
  room.rummikubTimer = setTimeout(() => {
    if (rooms.get(roomKey(room.gameId, room.roomCode)) !== room) return;
    if (game.phase !== "playing" || game.revision !== expectedRevision) return;
    const activeId = game.players[game.turnIndex]?.id;
    if (activeId) Rummikub.draw(game, activeId);
    rummikubBroadcast(room);
  }, wait);
  room.rummikubTimer.unref?.();
}

function gemGuildBroadcast(room) {
  if (!room?.gemguild) return;
  for (const [id, client] of room.clients) {
    safeSend(client, {
      type: "GEMGUILD_STATE",
      state: GemGuild.stateFor(room.gemguild, id)
    });
  }
  scheduleGemGuildTimeout(room);
}

function gemGuildError(socket, message) {
  safeSend(socket, { type: "GEMGUILD_ERROR", message });
}

function cityChaseBroadcast(room) {
  if (!room?.citychase) return;
  for (const [id, client] of room.clients) {
    safeSend(client, {
      type: "CITYCHASE_STATE",
      state: CityChase.stateFor(room.citychase, id)
    });
  }
}

function cityChaseError(socket, message) {
  safeSend(socket, { type: "CITYCHASE_ERROR", message });
}

function scheduleGemGuildTimeout(room) {
  clearTimeout(room?.gemguildTimer);
  const game = room?.gemguild;
  if (!game || game.phase !== "playing" || !game.turnDeadline) return;
  const expectedRevision = game.revision;
  const wait = Math.max(50, game.turnDeadline - Date.now());
  room.gemguildTimer = setTimeout(() => {
    if (rooms.get(roomKey(room.gameId, room.roomCode)) !== room) return;
    if (game.phase !== "playing" || game.revision !== expectedRevision) return;
    GemGuild.autoPlay(game);
    gemGuildBroadcast(room);
  }, wait);
  room.gemguildTimer.unref?.();
}

function kingdomTrailsBroadcast(room) {
  if (!room?.kingdomtrails) return;
  for (const [id, client] of room.clients) {
    safeSend(client, {
      type: "KINGDOMTRAILS_STATE",
      state: KingdomTrails.stateFor(room.kingdomtrails, id)
    });
  }
  scheduleKingdomTrailsTimeout(room);
}

function kingdomTrailsError(socket, message) {
  safeSend(socket, { type: "KINGDOMTRAILS_ERROR", message });
}

function scheduleKingdomTrailsTimeout(room) {
  clearTimeout(room?.kingdomtrailsTimer);
  const game = room?.kingdomtrails;
  if (!game || game.phase !== "playing" || !game.turnDeadline) return;
  const expectedRevision = game.revision;
  const wait = Math.max(50, game.turnDeadline - Date.now());
  room.kingdomtrailsTimer = setTimeout(() => {
    if (rooms.get(roomKey(room.gameId, room.roomCode)) !== room) return;
    if (game.phase !== "playing" || game.revision !== expectedRevision) return;
    KingdomTrails.autoPlace(game);
    kingdomTrailsBroadcast(room);
  }, wait);
  room.kingdomtrailsTimer.unref?.();
}

function blokusBroadcast(room) {
  if (!room?.blokus) return;
  for (const [id, client] of room.clients) {
    safeSend(client, {
      type: "BLOKUS_STATE",
      state: Blokus.stateFor(room.blokus, id)
    });
  }
  scheduleBlokusTimeout(room);
}

function blokusError(socket, message) {
  safeSend(socket, { type: "BLOKUS_ERROR", message });
}

function scheduleBlokusTimeout(room) {
  clearTimeout(room?.blokusTimer);
  const game = room?.blokus;
  if (!game || game.phase !== "playing" || !game.turnDeadline) return;
  const expectedRevision = game.revision;
  const wait = Math.max(50, game.turnDeadline - Date.now());
  room.blokusTimer = setTimeout(() => {
    if (rooms.get(roomKey(room.gameId, room.roomCode)) !== room) return;
    if (game.phase !== "playing" || game.revision !== expectedRevision) return;
    Blokus.skipTurn(game);
    blokusBroadcast(room);
  }, wait);
  room.blokusTimer.unref?.();
}

function chessBroadcast(room) {
  if (!room?.chess) return;
  const now = Date.now();
  for (const [id, client] of room.clients) {
    safeSend(client, {
      type: "CHESS_STATE",
      state: Chess.stateFor(room.chess, id, now)
    });
  }
  scheduleChessTimeout(room);
}

function chessError(socket, message) {
  safeSend(socket, { type: "CHESS_ERROR", message });
}

function scheduleChessTimeout(room) {
  clearTimeout(room?.chessTimer);
  const game = room?.chess;
  if (!game || game.phase !== "playing" || !game.turnStartedAt || !game.position) return;
  const remaining = game.clocks[game.position.turn];
  if (!Number.isFinite(remaining)) return;
  const expectedRevision = game.revision;
  const wait = Math.max(50, game.turnStartedAt + remaining - Date.now());
  room.chessTimer = setTimeout(() => {
    if (rooms.get(roomKey(room.gameId, room.roomCode)) !== room) return;
    if (game.phase !== "playing" || game.revision !== expectedRevision) return;
    const result = Chess.timeout(game);
    if (result.ok) chessBroadcast(room);
    else scheduleChessTimeout(room);
  }, wait);
  room.chessTimer.unref?.();
}

function honeycombBroadcast(room) {
  if (!room?.honeycomb) return;
  for (const [id, client] of room.clients) {
    safeSend(client, {
      type: "HONEYCOMB_STATE",
      state: Honeycomb.stateFor(room.honeycomb, id)
    });
  }
  scheduleHoneycombTimeout(room);
}

function honeycombError(socket, message) {
  safeSend(socket, { type: "HONEYCOMB_ERROR", message });
}

// 차례 제한시간은 서버가 재야 조작할 수 없다. 다음 배치·패스가 오면 다시 예약한다.
function scheduleHoneycombTimeout(room) {
  clearTimeout(room?.honeycombTimer);
  const game = room?.honeycomb;
  if (!game || game.phase !== "playing" || !game.turnDeadline) return;
  const expectedRevision = game.revision;
  const wait = Math.max(50, game.turnDeadline - Date.now());
  room.honeycombTimer = setTimeout(() => {
    if (rooms.get(roomKey(room.gameId, room.roomCode)) !== room) return;
    if (game.phase !== "playing" || game.revision !== expectedRevision) return;
    Honeycomb.skipTurn(game);
    honeycombBroadcast(room);
  }, wait);
  room.honeycombTimer.unref?.();
}

function codenamesBroadcast(room) {
  if (!room?.codenames) return;
  for (const [id, client] of room.clients) {
    safeSend(client, {
      type: "CODENAMES_STATE",
      state: Codenames.stateFor(room.codenames, id)
    });
  }
  scheduleCodenamesTimeout(room);
}

function codenamesError(socket, message) {
  safeSend(socket, { type: "CODENAMES_ERROR", message });
}

function scheduleCodenamesTimeout(room) {
  clearTimeout(room?.codenamesTimer);
  const game = room?.codenames;
  if (!game || game.phase !== "playing" || !game.turnDeadline) return;
  const expectedAction = game.actionNumber;
  const wait = Math.max(50, game.turnDeadline - Date.now());
  room.codenamesTimer = setTimeout(() => {
    if (rooms.get(roomKey(room.gameId, room.roomCode)) !== room) return;
    if (game.phase !== "playing" || game.actionNumber !== expectedAction) return;
    Codenames.timeoutTurn(game);
    codenamesBroadcast(room);
  }, wait);
  room.codenamesTimer.unref?.();
}

function dobbleBroadcast(room) {
  if (!room?.dobble) return;
  for (const [id, client] of room.clients) {
    safeSend(client, {
      type: "DOBBLE_STATE",
      state: Dobble.stateFor(room.dobble, id)
    });
  }
  scheduleDobblePenaltyEnd(room);
}

// 오답 페널티는 시간이 지나면 저절로 풀린다. 그런데 모두가 잠겨 있으면 아무도 행동을
// 못 해 방송할 일도 없으므로, 페널티가 끝나는 순간에 서버가 깨어나 상태를 다시 보낸다.
function scheduleDobblePenaltyEnd(room) {
  clearTimeout(room?.dobbleTimer);
  const game = room?.dobble;
  if (!game || game.phase !== "playing") return;
  const endsAt = Dobble.nextPenaltyEndsAt(game);
  if (!endsAt) return;
  const expectedAction = game.actionNumber;
  room.dobbleTimer = setTimeout(() => {
    if (rooms.get(roomKey(room.gameId, room.roomCode)) !== room) return;
    if (game.phase !== "playing" || game.actionNumber !== expectedAction) return;
    dobbleBroadcast(room);
  }, Math.max(50, endsAt - Date.now()));
  room.dobbleTimer.unref?.();
}

function dobbleError(socket, message) {
  safeSend(socket, { type: "DOBBLE_ERROR", message });
}

// 결정 마감이 걸려 있으면 그때 깨어나 아직 안 정한 사람을 귀환시킨다.
// 시간을 클라이언트가 재면 조작할 수 있으므로 서버가 주인이다.
function expeditionSchedule(room) {
  clearTimeout(room?.expeditionTimer);
  const game = room?.expedition;
  if (!game || game.phase !== "deciding" || !game.decideUntil) return;
  const wait = Math.max(50, game.decideUntil - Date.now());
  room.expeditionTimer = setTimeout(() => {
    if (rooms.get(roomKey(room.gameId, room.roomCode)) !== room) return;
    if (Expedition.decideTimedOut(game)) expeditionBroadcast(room);
  }, wait);
  room.expeditionTimer.unref?.();
}

function expeditionBroadcast(room) {
  if (!room?.expedition) return;
  expeditionSchedule(room);
  for (const [id, client] of room.clients) {
    safeSend(client, {
      type: "EXPEDITION_STATE",
      state: Expedition.stateFor(room.expedition, id)
    });
  }
}

function expeditionError(socket, message) {
  safeSend(socket, { type: "EXPEDITION_ERROR", message });
}

function drawRelayBroadcast(room) {
  if (!room?.drawrelay) return;
  for (const [id, client] of room.clients) {
    safeSend(client, {
      type: "DRAWRELAY_STATE",
      state: DrawRelay.stateFor(room.drawrelay, id)
    });
  }
  scheduleDrawRelayDeadline(room);
}

function drawRelayError(socket, message) {
  safeSend(socket, { type: "DRAWRELAY_ERROR", message });
}

function scheduleDrawRelayDeadline(room) {
  clearTimeout(room?.drawrelayTimer);
  const game = room?.drawrelay;
  if (!game || game.phase !== "playing") return;
  const expectedStep = game.step;
  const delay = Math.max(20, game.deadline - Date.now() + 800);
  room.drawrelayTimer = setTimeout(() => {
    if (game.phase !== "playing" || game.step !== expectedStep) return;
    for (const player of game.players) {
      if (game.pending[player.id]) continue;
      const submission = game.actionType === "draw" ? { strokes: [] } : { text: "시간 초과" };
      DrawRelay.submit(game, player.id, submission);
    }
    drawRelayBroadcast(room);
  }, delay);
  room.drawrelayTimer.unref?.();
}

function spellingPublicState(room) {
  const game = room?.spelling;
  if (!game) return null;

  const finishers = game.players
    .filter(player => game.results[player.id])
    .map(player => ({
      id: player.id,
      name: player.name,
      score: game.results[player.id].score,
      elapsedMs: game.results[player.id].elapsedMs
    }))
    .sort((a, b) => b.score - a.score || a.elapsedMs - b.elapsedMs || a.name.localeCompare(b.name, "ko"))
    .map((player, index) => ({ ...player, rank: index + 1 }));
  const rankingById = new Map(finishers.map(player => [player.id, player]));

  return {
    phase: game.phase,
    sessionId: game.sessionId,
    questionIds: game.phase === "lobby" ? [] : game.questionIds,
    startedAt: game.startedAt,
    participants: game.players.map(player => ({
      id: player.id,
      name: player.name,
      status: rankingById.has(player.id) ? "finished" : game.phase === "lobby" ? "waiting" : "playing"
    })),
    rankings: finishers
  };
}

function spellingBroadcast(room) {
  const state = spellingPublicState(room);
  if (!state) return;
  for (const client of room.clients.values()) {
    safeSend(client, { type: "SPELLING_STATE", state });
  }
}

function spellingError(socket, message) {
  safeSend(socket, { type: "SPELLING_ERROR", message });
}

// 공용 학급 순위전. 어느 앱이든 교사가 문제 묶음을 통째로 보내고, 서버는 점수와 시간만 매긴다.
// 학급 순위전의 채점·모둠·순위는 quizrace.js 가 맡는다.
const avatarFileCache = new Map();
function quizraceAvatarExists(key) {
  if (!avatarFileCache.has(key)) {
    avatarFileCache.set(key, fs.existsSync(path.join(SITE_ROOT, "classtools", "assets", "avatars", key)));
  }
  return avatarFileCache.get(key);
}

function quizracePublicState(room) {
  return room?.quizrace ? Quizrace.publicState(room.quizrace) : null;
}

function quizraceSendQuestions(room, playerId) {
  const socket = room.clients.get(playerId);
  if (socket) safeSend(socket, Quizrace.questionsPayload(room.quizrace, playerId));
}

function quizraceBroadcast(room) {
  if (room.quizraceBroadcastTimer) {
    clearTimeout(room.quizraceBroadcastTimer);
    room.quizraceBroadcastTimer = null;
  }
  room.quizraceBroadcastAt = Date.now();
  const state = quizracePublicState(room);
  if (!state) return;
  // 서른 명에게 같은 글을 보내므로 한 번만 글자로 바꾼다.
  const text = JSON.stringify({ type: "QUIZRACE_STATE", state });
  for (const client of room.clients.values()) {
    if (client && client.readyState === WebSocket.OPEN) client.send(text);
  }
}

// 경기 중에는 답이 한꺼번에 몰린다. 0.15초 안에 들어온 답은 한 번의 알림으로 묶는다.
const QUIZRACE_BROADCAST_GAP_MS = 150;
function quizraceBroadcastSoon(room) {
  if (room.quizraceBroadcastTimer) return;
  const wait = QUIZRACE_BROADCAST_GAP_MS - (Date.now() - (room.quizraceBroadcastAt || 0));
  if (wait <= 0) {
    quizraceBroadcast(room);
    return;
  }
  room.quizraceBroadcastTimer = setTimeout(() => {
    room.quizraceBroadcastTimer = null;
    quizraceBroadcast(room);
  }, wait);
}

function quizraceError(socket, message) {
  safeSend(socket, { type: "QUIZRACE_ERROR", message });
}

function circulationPublicState(room) {
  const game = room?.circulation;
  if (!game) return null;

  const finishers = game.players
    .filter(player => game.results[player.id])
    .map(player => ({
      id: player.id,
      name: player.name,
      score: game.results[player.id].score,
      elapsedMs: game.results[player.id].elapsedMs
    }))
    .sort((a, b) => b.score - a.score || a.elapsedMs - b.elapsedMs || a.name.localeCompare(b.name, "ko"))
    .map((player, index) => ({ ...player, rank: index + 1 }));
  const rankingById = new Map(finishers.map(player => [player.id, player]));

  return {
    phase: game.phase,
    sessionId: game.sessionId,
    startedAt: game.startedAt,
    participants: game.players.map(player => ({
      id: player.id,
      name: player.name,
      status: rankingById.has(player.id) ? "finished" : game.phase === "lobby" ? "waiting" : "playing"
    })),
    rankings: finishers
  };
}

function circulationBroadcast(room) {
  const state = circulationPublicState(room);
  if (!state) return;
  for (const client of room.clients.values()) {
    safeSend(client, { type: "CIRCULATION_STATE", state });
  }
}

function circulationError(socket, message) {
  safeSend(socket, { type: "CIRCULATION_ERROR", message });
}

function digestionPublicState(room) {
  const game = room?.digestion;
  if (!game) return null;

  const finishers = game.players
    .filter(player => game.results[player.id])
    .map(player => ({
      id: player.id,
      name: player.name,
      score: game.results[player.id].score,
      elapsedMs: game.results[player.id].elapsedMs
    }))
    .sort((a, b) => b.score - a.score || a.elapsedMs - b.elapsedMs || a.name.localeCompare(b.name, "ko"))
    .map((player, index) => ({ ...player, rank: index + 1 }));
  const rankingById = new Map(finishers.map(player => [player.id, player]));

  return {
    phase: game.phase,
    sessionId: game.sessionId,
    startedAt: game.startedAt,
    participants: game.players.map(player => ({
      id: player.id,
      name: player.name,
      status: rankingById.has(player.id) ? "finished" : game.phase === "lobby" ? "waiting" : "playing"
    })),
    rankings: finishers
  };
}

function digestionBroadcast(room) {
  const state = digestionPublicState(room);
  if (!state) return;
  for (const client of room.clients.values()) {
    safeSend(client, { type: "DIGESTION_STATE", state });
  }
}

function digestionError(socket, message) {
  safeSend(socket, { type: "DIGESTION_ERROR", message });
}

function respirationPublicState(room) {
  const game = room?.respiration;
  if (!game) return null;

  const finishers = game.players
    .filter(player => game.results[player.id])
    .map(player => ({
      id: player.id,
      name: player.name,
      score: game.results[player.id].score,
      elapsedMs: game.results[player.id].elapsedMs
    }))
    .sort((a, b) => b.score - a.score || a.elapsedMs - b.elapsedMs || a.name.localeCompare(b.name, "ko"))
    .map((player, index) => ({ ...player, rank: index + 1 }));
  const rankingById = new Map(finishers.map(player => [player.id, player]));

  return {
    phase: game.phase,
    sessionId: game.sessionId,
    startedAt: game.startedAt,
    participants: game.players.map(player => ({
      id: player.id,
      name: player.name,
      status: rankingById.has(player.id) ? "finished" : game.phase === "lobby" ? "waiting" : "playing"
    })),
    rankings: finishers
  };
}

function respirationBroadcast(room) {
  const state = respirationPublicState(room);
  if (!state) return;
  for (const client of room.clients.values()) {
    safeSend(client, { type: "RESPIRATION_STATE", state });
  }
}

function respirationError(socket, message) {
  safeSend(socket, { type: "RESPIRATION_ERROR", message });
}

function nervousPublicState(room) {
  const game = room?.nervous;
  if (!game) return null;

  const finishers = game.players
    .filter(player => game.results[player.id])
    .map(player => ({
      id: player.id,
      name: player.name,
      score: game.results[player.id].score,
      elapsedMs: game.results[player.id].elapsedMs
    }))
    .sort((a, b) => b.score - a.score || a.elapsedMs - b.elapsedMs || a.name.localeCompare(b.name, "ko"))
    .map((player, index) => ({ ...player, rank: index + 1 }));
  const rankingById = new Map(finishers.map(player => [player.id, player]));

  return {
    phase: game.phase,
    sessionId: game.sessionId,
    startedAt: game.startedAt,
    participants: game.players.map(player => ({
      id: player.id,
      name: player.name,
      status: rankingById.has(player.id) ? "finished" : game.phase === "lobby" ? "waiting" : "playing"
    })),
    rankings: finishers
  };
}

function nervousBroadcast(room) {
  const state = nervousPublicState(room);
  if (!state) return;
  for (const client of room.clients.values()) {
    safeSend(client, { type: "NERVOUS_STATE", state });
  }
}

function nervousError(socket, message) {
  safeSend(socket, { type: "NERVOUS_ERROR", message });
}

function immunePublicState(room) {
  const game = room?.immune;
  if (!game) return null;

  const finishers = game.players
    .filter(player => game.results[player.id])
    .map(player => ({
      id: player.id,
      name: player.name,
      score: game.results[player.id].score,
      elapsedMs: game.results[player.id].elapsedMs
    }))
    .sort((a, b) => b.score - a.score || a.elapsedMs - b.elapsedMs || a.name.localeCompare(b.name, "ko"))
    .map((player, index) => ({ ...player, rank: index + 1 }));
  const rankingById = new Map(finishers.map(player => [player.id, player]));

  return {
    phase: game.phase,
    sessionId: game.sessionId,
    startedAt: game.startedAt,
    participants: game.players.map(player => ({
      id: player.id,
      name: player.name,
      status: rankingById.has(player.id) ? "finished" : game.phase === "lobby" ? "waiting" : "playing"
    })),
    rankings: finishers
  };
}

function immuneBroadcast(room) {
  const state = immunePublicState(room);
  if (!state) return;
  for (const client of room.clients.values()) {
    safeSend(client, { type: "IMMUNE_STATE", state });
  }
}

function immuneError(socket, message) {
  safeSend(socket, { type: "IMMUNE_ERROR", message });
}

function movementPublicState(room) {
  const game = room?.movement;
  if (!game) return null;

  const finishers = game.players
    .filter(player => game.results[player.id])
    .map(player => ({
      id: player.id,
      name: player.name,
      score: game.results[player.id].score,
      elapsedMs: game.results[player.id].elapsedMs
    }))
    .sort((a, b) => b.score - a.score || a.elapsedMs - b.elapsedMs || a.name.localeCompare(b.name, "ko"))
    .map((player, index) => ({ ...player, rank: index + 1 }));
  const rankingById = new Map(finishers.map(player => [player.id, player]));

  return {
    phase: game.phase,
    sessionId: game.sessionId,
    startedAt: game.startedAt,
    participants: game.players.map(player => ({
      id: player.id,
      name: player.name,
      status: rankingById.has(player.id) ? "finished" : game.phase === "lobby" ? "waiting" : "playing"
    })),
    rankings: finishers
  };
}

function movementBroadcast(room) {
  const state = movementPublicState(room);
  if (!state) return;
  for (const client of room.clients.values()) {
    safeSend(client, { type: "MOVEMENT_STATE", state });
  }
}

function movementError(socket, message) {
  safeSend(socket, { type: "MOVEMENT_ERROR", message });
}

function excretionPublicState(room) {
  const game = room?.excretion;
  if (!game) return null;

  const finishers = game.players
    .filter(player => game.results[player.id])
    .map(player => ({
      id: player.id,
      name: player.name,
      score: game.results[player.id].score,
      elapsedMs: game.results[player.id].elapsedMs
    }))
    .sort((a, b) => b.score - a.score || a.elapsedMs - b.elapsedMs || a.name.localeCompare(b.name, "ko"))
    .map((player, index) => ({ ...player, rank: index + 1 }));
  const rankingById = new Map(finishers.map(player => [player.id, player]));

  return {
    phase: game.phase,
    sessionId: game.sessionId,
    startedAt: game.startedAt,
    participants: game.players.map(player => ({
      id: player.id,
      name: player.name,
      status: rankingById.has(player.id) ? "finished" : game.phase === "lobby" ? "waiting" : "playing"
    })),
    rankings: finishers
  };
}

function excretionBroadcast(room) {
  const state = excretionPublicState(room);
  if (!state) return;
  for (const client of room.clients.values()) {
    safeSend(client, { type: "EXCRETION_STATE", state });
  }
}

function excretionError(socket, message) {
  safeSend(socket, { type: "EXCRETION_ERROR", message });
}

function temperaturePublicState(room) {
  const game = room?.temperature;
  if (!game) return null;

  const finishers = game.players
    .filter(player => game.results[player.id])
    .map(player => ({
      id: player.id,
      name: player.name,
      score: game.results[player.id].score,
      elapsedMs: game.results[player.id].elapsedMs
    }))
    .sort((a, b) => b.score - a.score || a.elapsedMs - b.elapsedMs || a.name.localeCompare(b.name, "ko"))
    .map((player, index) => ({ ...player, rank: index + 1 }));
  const rankingById = new Map(finishers.map(player => [player.id, player]));

  return {
    phase: game.phase,
    sessionId: game.sessionId,
    startedAt: game.startedAt,
    participants: game.players.map(player => ({
      id: player.id,
      name: player.name,
      status: rankingById.has(player.id) ? "finished" : game.phase === "lobby" ? "waiting" : "playing"
    })),
    rankings: finishers
  };
}

function temperatureBroadcast(room) {
  const state = temperaturePublicState(room);
  if (!state) return;
  for (const client of room.clients.values()) {
    safeSend(client, { type: "TEMPERATURE_STATE", state });
  }
}

function temperatureError(socket, message) {
  safeSend(socket, { type: "TEMPERATURE_ERROR", message });
}

const BODY_EXPLORER_STAGE_COUNT = 10;

function createBodyExplorerGame() {
  return {
    phase: "lobby",
    sessionId: "",
    startedAt: 0,
    players: [],
    results: {},
    progress: {}
  };
}

function trackBodyExplorerProgress(game, playerId, message) {
  if (game.phase !== "running") return "현재 진행 중인 탐험이 없습니다.";
  if (cleanToken(message.sessionId, 80) !== game.sessionId) return "현재 탐험의 진행 기록이 아닙니다.";
  if (!game.players.some(player => player.id === playerId)) return "참가 학생만 진행 기록을 보낼 수 있습니다.";

  const stageIndex = Number(message.stageIndex);
  if (!Number.isInteger(stageIndex) || stageIndex < 0 || stageIndex >= BODY_EXPLORER_STAGE_COUNT) {
    return "관문 번호가 올바르지 않습니다.";
  }
  if (typeof message.firstTry !== "boolean") return "관문 결과 형식이 올바르지 않습니다.";

  game.progress ||= {};
  const current = game.progress[playerId] || { nextStageIndex: 0, score: 0 };
  if (stageIndex < current.nextStageIndex) return null;
  if (stageIndex !== current.nextStageIndex) return "앞 관문부터 차례대로 완료해야 합니다.";

  game.progress[playerId] = {
    nextStageIndex: current.nextStageIndex + 1,
    score: current.score + (message.firstTry ? 1 : 0)
  };
  return null;
}

function verifiedBodyExplorerScore(game, playerId) {
  const progress = game.progress?.[playerId];
  return progress?.nextStageIndex === BODY_EXPLORER_STAGE_COUNT ? progress.score : null;
}

const AVALON_TEAM_SIZES = {
  5: [2, 3, 2, 3, 3], 6: [2, 3, 4, 3, 4], 7: [2, 3, 3, 4, 4],
  8: [3, 4, 4, 5, 5]
};
const AVALON_EVIL_COUNTS = { 5: 2, 6: 2, 7: 3, 8: 3 };
// 원정대 제안·투표는 교실에서 직접 토의한 뒤 화면에 반영하는 경우가 많아
// 코드네임즈와 같은 여유 있는 제한시간을 준다.
const AVALON_TURN_SECONDS = 60;

function recommendedAvalonSettings(count) {
  if (count === 7) return { percival: true, morgana: true, mordred: false, oberon: true };
  if (count === 8) return { percival: true, morgana: true, mordred: true, oberon: false };
  return { percival: false, morgana: false, mordred: false, oberon: false };
}

function normalizeAvalonSettings(count, settings) {
  const normalized = {
    percival: !!settings?.percival,
    morgana: !!settings?.morgana,
    mordred: !!settings?.mordred,
    oberon: !!settings?.oberon
  };
  const evilSpecialLimit = Math.max(0, (AVALON_EVIL_COUNTS[count] || 1) - 1);
  const selectedEvil = ["morgana", "mordred", "oberon"].filter(role => normalized[role]);
  selectedEvil.slice(evilSpecialLimit).forEach(role => { normalized[role] = false; });
  return normalized;
}

function normalizeAvalonCharacterStyle(value) {
  return value === "male" || value === "female" ? value : "random";
}

function avalonRoleComposition(count, settings) {
  const evilCount = AVALON_EVIL_COUNTS[count];
  if (!evilCount) return { good: [], evil: [] };
  const good = ["Merlin"];
  const evil = ["Assassin"];
  if (settings.percival && good.length < count - evilCount) good.push("Percival");
  if (settings.morgana && evil.length < evilCount) evil.push("Morgana");
  if (settings.mordred && evil.length < evilCount) evil.push("Mordred");
  if (settings.oberon && evil.length < evilCount) evil.push("Oberon");
  while (good.length < count - evilCount) good.push("Loyal Servant");
  while (evil.length < evilCount) evil.push("Minion of Mordred");
  return { good, evil };
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = crypto.randomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function avalonPublicState(room) {
  const game = room.avalon;
  const roleSummary = avalonRoleComposition(game.players.length, game.settings);
  return {
    phase: game.phase,
    players: game.players.map(player => ({ id: player.id, name: player.name, connected: room.clients.has(player.id) })),
    hostId: room.hostId,
    leaderId: game.players[game.leaderIndex]?.id || null,
    quest: game.quest,
    teamSize: AVALON_TEAM_SIZES[game.players.length]?.[game.quest] || 0,
    selectedTeam: game.selectedTeam,
    proposalVotes: Object.keys(game.proposalVotes).length,
    questVotes: Object.keys(game.questVotes).length,
    rejects: game.rejects,
    results: game.results,
    winner: game.winner,
    settings: game.settings,
    settingsCustomized: game.settingsCustomized,
    recommendedSettings: recommendedAvalonSettings(game.players.length),
    roleSummary,
    turnDeadline: game.turnDeadline || null,
    turnSeconds: AVALON_TURN_SECONDS
  };
}

function avalonBroadcast(room) {
  const payload = { type: "AVALON_STATE", state: avalonPublicState(room) };
  for (const client of room.clients.values()) safeSend(client, payload);
  scheduleAvalonTimeout(room);
}

function avalonNotice(room, message) {
  for (const client of room.clients.values()) safeSend(client, { type: "AVALON_NOTICE", message });
}

function resetAvalonToLobby(game) {
  game.phase = "lobby";
  game.settings = recommendedAvalonSettings(game.players.length);
  game.settingsCustomized = false;
  game.leaderIndex = 0;
  game.quest = 0;
  game.selectedTeam = [];
  game.proposalVotes = {};
  game.questVotes = {};
  game.rejects = 0;
  game.results = [];
  game.winner = null;
  game.assassinId = null;
  game.turnDeadline = null;
  game.players.forEach(player => {
    delete player.role;
    delete player.resolvedCharacterStyle;
    delete player.cardVariant;
  });
}

// 제안 찬반 투표 집계 — 정상 투표든 시간 초과로 채워진 기본값이든 동일하게 처리한다.
function avalonTallyProposal(room) {
  const game = room.avalon;
  const approvals = Object.values(game.proposalVotes).filter(Boolean).length;
  if (approvals > game.players.length / 2) {
    game.phase = "questVote"; game.questVotes = {};
    game.turnDeadline = Date.now() + AVALON_TURN_SECONDS * 1000;
    avalonNotice(room, `원정대가 ${approvals}:${game.players.length - approvals}로 승인되었습니다.`);
  } else {
    game.rejects += 1; game.leaderIndex = (game.leaderIndex + 1) % game.players.length; game.phase = "team";
    game.turnDeadline = Date.now() + AVALON_TURN_SECONDS * 1000;
    avalonNotice(room, `원정대가 ${approvals}:${game.players.length - approvals}로 부결되었습니다.`);
  }
  if (game.rejects >= 5) { game.winner = "evil"; game.phase = "ended"; game.turnDeadline = null; avalonRevealRoles(room); }
}

// 임무 투표 집계 — 위와 동일한 이유로 별도 함수로 분리했다.
function avalonTallyQuest(room) {
  const game = room.avalon;
  const fails = Object.values(game.questVotes).filter(v => !v).length;
  const needed = game.players.length >= 7 && game.quest === 3 ? 2 : 1;
  const success = fails < needed;
  game.results.push({ success, fails }); game.quest += 1; game.rejects = 0;
  const goodWins = game.results.filter(r => r.success).length;
  const evilWins = game.results.filter(r => !r.success).length;
  if (evilWins >= 3) { game.winner = "evil"; game.phase = "ended"; game.turnDeadline = null; avalonRevealRoles(room); }
  else if (goodWins >= 3) { game.phase = "assassination"; game.turnDeadline = Date.now() + AVALON_TURN_SECONDS * 1000; }
  else { game.leaderIndex = (game.leaderIndex + 1) % game.players.length; game.phase = "team"; game.turnDeadline = Date.now() + AVALON_TURN_SECONDS * 1000; }
  avalonNotice(room, success ? `임무 성공! (실패 카드 ${fails}장)` : `임무 실패! (실패 카드 ${fails}장)`);
}

// 시간이 다 되면 그때까지 못 정한 것을 기본값으로 채우고 넘어간다: 원정대 제안은
// 앞에서부터 필요한 인원을 자동으로 채우고, 투표는 안 한 사람을 찬성/성공으로
// 처리하며(게임이 멈추지 않도록), 암살은 무작위 대상을 고른다.
function avalonTimeoutPhase(room) {
  const game = room.avalon;
  if (game.phase === "team") {
    const required = AVALON_TEAM_SIZES[game.players.length][game.quest];
    const leader = game.players[game.leaderIndex];
    game.selectedTeam = game.players.slice(0, required).map(p => p.id);
    game.proposalVotes = {};
    game.phase = "proposalVote";
    game.turnDeadline = Date.now() + AVALON_TURN_SECONDS * 1000;
    avalonNotice(room, `${leader?.name || "리더"}님이 시간 초과로 원정대가 자동 구성되었습니다.`);
  } else if (game.phase === "proposalVote") {
    for (const p of game.players) if (!(p.id in game.proposalVotes)) game.proposalVotes[p.id] = true;
    avalonTallyProposal(room);
  } else if (game.phase === "questVote") {
    for (const id of game.selectedTeam) if (!(id in game.questVotes)) game.questVotes[id] = true;
    avalonTallyQuest(room);
  } else if (game.phase === "assassination") {
    const candidates = game.players.filter(p => p.id !== game.assassinId);
    const target = candidates[crypto.randomInt(candidates.length)];
    if (target) {
      game.winner = target.role === "Merlin" ? "evil" : "good";
      game.phase = "ended";
      game.turnDeadline = null;
      avalonRevealRoles(room);
    }
  }
}

function scheduleAvalonTimeout(room) {
  clearTimeout(room?.avalonTimer);
  const game = room?.avalon;
  if (!game || game.phase === "lobby" || game.phase === "ended" || !game.turnDeadline) return;
  const expectedPhase = game.phase;
  const expectedDeadline = game.turnDeadline;
  const wait = Math.max(50, game.turnDeadline - Date.now());
  room.avalonTimer = setTimeout(() => {
    if (rooms.get(roomKey(room.gameId, room.roomCode)) !== room) return;
    if (game.phase !== expectedPhase || game.turnDeadline !== expectedDeadline) return;
    avalonTimeoutPhase(room);
    avalonBroadcast(room);
  }, wait);
  room.avalonTimer.unref?.();
}

function avalonRevealRoles(room) {
  const roles = room.avalon.players.map(player => ({ name: player.name, role: player.role }));
  for (const client of room.clients.values()) safeSend(client, { type: "AVALON_REVEAL", roles });
}

function buildAvalonRoles(count, settings) {
  const { good, evil } = avalonRoleComposition(count, normalizeAvalonSettings(count, settings));
  return shuffle([...good, ...evil]);
}

function avalonRoleInfo(game, player) {
  const evilRoles = new Set(["Assassin", "Morgana", "Mordred", "Oberon", "Minion of Mordred"]);
  const visible = [];
  if (player.role === "Merlin") {
    game.players.filter(p => evilRoles.has(p.role) && p.role !== "Mordred").forEach(p => visible.push(p.name));
  } else if (player.role === "Percival") {
    game.players.filter(p => p.role === "Merlin" || p.role === "Morgana").forEach(p => visible.push(p.name));
  } else if (evilRoles.has(player.role) && player.role !== "Oberon") {
    game.players.filter(p => p.id !== player.id && evilRoles.has(p.role) && p.role !== "Oberon").forEach(p => visible.push(p.name));
  }
  return {
    role: player.role,
    alignment: evilRoles.has(player.role) ? "evil" : "good",
    visible,
    characterStyle: player.resolvedCharacterStyle,
    cardVariant: player.cardVariant || 1
  };
}

function getKoreaDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.filter(part => part.type !== "literal").map(part => [part.type, part.value])
  );

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}`
  };
}

// Some older pages still link to the physical entry file.  The deployed app
// exposes the home screen at `/`, so normalize that legacy URL before serving
// the page instead of returning Express's "Cannot GET /index.html" response.
app.get("/index.html", (req, res) => {
  res.redirect(308, "/");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(SITE_ROOT, "index.html"));
});

app.get("/health", (req, res) => {
  let connections = 0;
  for (const room of rooms.values()) connections += room.clients.size;
  res.json({
    status: "ok",
    rooms: rooms.size,
    connections
  });
});

app.get("/api/finishers", async (req, res) => {
  const gameId = cleanToken(req.query.gameId, 30);
  if (!FINISHER_GAMES.has(gameId)) {
    return res.status(400).json({ error: "INVALID_GAME" });
  }

  const { date } = getKoreaDateParts();
  try {
    const records = await classroomPlatform.listFinisherRecords(date, gameId);
    return res.json({ date, gameId, records });
  } catch (error) {
    console.error("Failed to read finisher records:", error);
    return res.status(503).json({ error: "FINISHER_STORAGE_UNAVAILABLE" });
  }
});

app.post("/api/finishers", async (req, res) => {
  const gameId = cleanToken(req.body?.gameId, 30);
  const name = cleanToken(req.body?.name, 10);
  const difficulty = cleanToken(req.body?.difficulty, 50);
  const rank = Number(req.body?.rank);

  if (!FINISHER_GAMES.has(gameId)) {
    return res.status(400).json({ error: "INVALID_GAME" });
  }
  if (!/^[가-힣]{2,6}$/.test(name)) {
    return res.status(400).json({ error: "INVALID_NAME" });
  }
  if (!difficulty || difficulty.length > 50) {
    return res.status(400).json({ error: "INVALID_DIFFICULTY" });
  }
  if (!Number.isFinite(rank) || rank < 0 || rank > 10000) {
    return res.status(400).json({ error: "INVALID_RANK" });
  }

  const now = getKoreaDateParts();
  try {
    const records = await classroomPlatform.saveFinisherRecord({
      date: now.date,
      gameId,
      name,
      difficulty,
      rank,
      time: now.time
    });
    return res.json({ ok: true, date: now.date, gameId, records });
  } catch (error) {
    console.error("Failed to save finisher record:", error);
    return res.status(503).json({ error: "FINISHER_STORAGE_UNAVAILABLE" });
  }
});

wss.on("connection", (socket, request) => {
  let playerId = crypto.randomUUID();
  const globalContentLockBypass = classroomPlatform.canBypassGlobalContentLock(request).catch(error => {
    console.error("Failed to resolve WebSocket content-lock bypass:", error);
    return false;
  });
  // 연결할 때 한 번만 물어보고, 방을 만들 때 이 답을 쓴다.
  const teacherSession = classroomPlatform.isTeacherRequest(request).catch(error => {
    console.error("Failed to resolve WebSocket teacher session:", error);
    return false;
  });
  // Only Avalon needs this lookup. Cache it for this authenticated connection.
  let avalonCharacterStylePromise;
  const getAvalonCharacterStyle = () => avalonCharacterStylePromise ||= classroomPlatform
    .getStudentCharacterStyle(request).catch(error => {
      console.error("Failed to resolve Avalon character style:", error);
      return "random";
    });
  socket.isAlive = true;
  socket.on("pong", () => { socket.isAlive = true; });
  socket.meta = {
    playerId,
    roomKey: null,
    role: null,
    clientToken: null,
    clientTokenHash: null,
    disconnectTimer: null
  };

  safeSend(socket, {
    type: "CONNECTED",
    playerId
  });

  socket.on("message", async raw => {
    let message;
    try {
      message = JSON.parse(raw.toString());
    } catch (_) {
      safeSend(socket, { type: "ERROR", message: "잘못된 메시지입니다." });
      return;
    }

    const type = cleanToken(message.type, 30);

    const requestedGameId = type === "CREATE_ROOM" || type === "JOIN_ROOM"
      ? cleanToken(message.gameId, 30)
      : cleanToken(String(socket.meta.roomKey || "").split(":", 1)[0], 30);
    const requestedContentPath = MULTIPLAYER_CONTENT_PATHS[requestedGameId];
    if (requestedContentPath && !await globalContentLockBypass) {
      try {
        if (await classroomPlatform.isContentGloballyDisabled(requestedContentPath)) {
          safeSend(socket, {
            type: "ERROR",
            code: "CONTENT_GLOBALLY_DISABLED",
            message: "The administrator has disabled this game."
          });
          try { socket.close(4003, "CONTENT_GLOBALLY_DISABLED"); } catch (_) {}
          return;
        }
      } catch (error) {
        console.error("Failed to check WebSocket content lock:", error);
        safeSend(socket, {
          type: "ERROR",
          code: "CONTENT_ACCESS_UNAVAILABLE",
          message: "Game access cannot be verified. Try again shortly."
        });
        try { socket.close(1013, "CONTENT_ACCESS_UNAVAILABLE"); } catch (_) {}
        return;
      }
    }

    if (type === "MUSEUM_JOIN") {
      const identity = classroomPlatform.verifyMuseumPresenceTicket(cleanToken(message.ticket, 2048));
      if (!identity) { safeSend(socket, { type: "MUSEUM_AUTH_REQUIRED" }); return; }
      leaveMuseum(socket);
      const museumClass = museumClasses.get(identity.classKey) || { clients: new Map() };
      museumClasses.set(identity.classKey, museumClass);
      const position = safeMuseumPosition("portrait", 0, 5.8);
      socket.meta.museumVisitor = { userId:identity.userId, name:cleanToken(identity.name,12), classKey:identity.classKey, room:"portrait", x:position.x, z:position.z, yaw:0 };
      const oldSocket = museumClass.clients.get(identity.userId);
      if (oldSocket && oldSocket !== socket) { oldSocket.meta.museumVisitor = null; try { oldSocket.close(4003, "REPLACED"); } catch (_) {} }
      museumClass.clients.set(identity.userId, socket); safeSend(socket, { type: "MUSEUM_JOINED", userId: identity.userId }); museumBroadcast(identity.classKey); return;
    }
    if (type === "MUSEUM_MOVE") {
      const visitor = socket.meta.museumVisitor;
      if (!visitor) return;
      const room = ["portrait","nature","story","color","space"].includes(message.room) ? message.room : visitor.room;
      const position = safeMuseumPosition(room, message.x, message.z);
      visitor.room=room; visitor.x=position.x; visitor.z=position.z; visitor.yaw=Number.isFinite(message.yaw) ? Math.max(-6.4,Math.min(6.4,message.yaw)) : visitor.yaw;
      museumBroadcast(visitor.classKey); return;
    }

    if (type === "PARK_JOIN") {
      const identity = classroomPlatform.verifyMuseumPresenceTicket(cleanToken(message.ticket, 2048));
      if (!identity) { safeSend(socket, { type: "MUSEUM_AUTH_REQUIRED" }); return; }
      leavePark(socket);
      const parkClass = parkClasses.get(identity.classKey) || { clients: new Map() };
      parkClasses.set(identity.classKey, parkClass);
      socket.meta.parkVisitor = { userId:identity.userId, name:cleanToken(identity.name,12), classKey:identity.classKey, x:0, z:28, yaw:0 };
      const oldSocket = parkClass.clients.get(identity.userId);
      if (oldSocket && oldSocket !== socket) { oldSocket.meta.parkVisitor = null; try { oldSocket.close(4003, "REPLACED"); } catch (_) {} }
      parkClass.clients.set(identity.userId, socket); safeSend(socket, { type: "PARK_JOINED", userId: identity.userId }); parkBroadcast(identity.classKey); return;
    }
    if (type === "PARK_MOVE") {
      const visitor = socket.meta.parkVisitor;
      if (!visitor) return;
      const position = safeParkPosition(message.x, message.z);
      visitor.x=position.x; visitor.z=position.z; visitor.yaw=Number.isFinite(message.yaw) ? Math.max(-6.4,Math.min(6.4,message.yaw)) : visitor.yaw;
      parkBroadcast(visitor.classKey); return;
    }

    if (type === "CREATE_ROOM") {
      const gameId = cleanToken(message.gameId, 30);
      const roomCode = cleanToken(message.roomCode, 10);
      const clientToken = cleanToken(message.clientToken, 80);
      const resumeOnly = message.resumeOnly === true;
      if (!gameId || !roomCode) {
        safeSend(socket, { type: "ERROR", message: "방 정보가 올바르지 않습니다." });
        return;
      }

      // 학급 순위전은 교사가 여는 판이다. 화면에서 단추를 숨기는 것만으로는
      // 주소를 아는 사람을 못 막으므로 서버에서 한 번 더 본다.
      if (gameId === "quizrace" && !(await teacherSession)) {
        safeSend(socket, { type: "ERROR", message: "학급 순위전은 교사 계정으로만 만들 수 있습니다." });
        return;
      }

      const characterStyle = gameId === "avalon" ? await getAvalonCharacterStyle() : "random";
      if (socket.readyState !== WebSocket.OPEN) return;
      const key = roomKey(gameId, roomCode);
      let existingRoom = rooms.get(key);
      if (!existingRoom) existingRoom = await restorePersistedRoom(gameId, roomCode);
      const previousHost = existingRoom?.clients.get(existingRoom.hostId);
      if (existingRoom && clientToken && clientMatchesToken(previousHost, clientToken)) {
        clearTimeout(previousHost.meta.disconnectTimer);
        if (previousHost !== socket && previousHost.readyState === WebSocket.OPEN) {
          try { previousHost.close(4003, "REPLACED"); } catch (_) {}
        }
        playerId = existingRoom.hostId;
        socket.meta.playerId = playerId;
        socket.meta.roomKey = key;
        socket.meta.role = "host";
        socket.meta.clientToken = clientToken;
        existingRoom.clients.set(playerId, socket);
        safeSend(socket, { type: "ROOM_RESUMED", gameId, roomCode, playerId });
        if (existingRoom.avalon) {
          const player = existingRoom.avalon.players.find(player => player.id === playerId);
          if (player && existingRoom.avalon.phase === "lobby") player.characterStyle = characterStyle;
          avalonBroadcast(existingRoom);
        }
        if (existingRoom.lastcard) lastCardBroadcast(existingRoom);
        if (existingRoom.bomb77) bomb77Broadcast(existingRoom);
        if (existingRoom.loveletter) loveLetterBroadcast(existingRoom);
        if (existingRoom.rummikub) rummikubBroadcast(existingRoom);
        if (existingRoom.gemguild) gemGuildBroadcast(existingRoom);
        if (existingRoom.citychase) cityChaseBroadcast(existingRoom);
        if (existingRoom.kingdomtrails) kingdomTrailsBroadcast(existingRoom);
        if (existingRoom.blokus) blokusBroadcast(existingRoom);
        if (existingRoom.chess) chessBroadcast(existingRoom);
        if (existingRoom.honeycomb) honeycombBroadcast(existingRoom);
        if (existingRoom.drawrelay) drawRelayBroadcast(existingRoom);
        if (existingRoom.expedition) expeditionBroadcast(existingRoom);
        if (existingRoom.clue) clueBroadcast(existingRoom);
        if (existingRoom.codenames) codenamesBroadcast(existingRoom);
        if (existingRoom.dobble) dobbleBroadcast(existingRoom);
        if (existingRoom.spelling) spellingBroadcast(existingRoom);
        if (existingRoom.quizrace) quizraceBroadcast(existingRoom);
        if (existingRoom.circulation) circulationBroadcast(existingRoom);
        if (existingRoom.digestion) digestionBroadcast(existingRoom);
        if (existingRoom.respiration) respirationBroadcast(existingRoom);
        if (existingRoom.nervous) nervousBroadcast(existingRoom);
        if (existingRoom.immune) immuneBroadcast(existingRoom);
        if (existingRoom.movement) movementBroadcast(existingRoom);
        if (existingRoom.excretion) excretionBroadcast(existingRoom);
        if (existingRoom.temperature) temperatureBroadcast(existingRoom);
        return;
      }
      if (resumeOnly) {
        safeSend(socket, { type: "ROOM_NOT_FOUND", gameId, roomCode });
        return;
      }
      if (existingRoom) {
        safeSend(socket, { type: "ROOM_EXISTS", gameId, roomCode });
        return;
      }
      if (gameId === "quizrace" && (await classroomPlatform.hasVotingRoomCode(roomCode)
        || await classroomPlatform.hasSchoolElectionRoomCode(roomCode)
        || await classroomPlatform.hasSeatingRoomCode(roomCode))) {
        safeSend(socket, { type: "ROOM_EXISTS", gameId, roomCode });
        return;
      }

      const room = {
        gameId,
        roomCode,
        hostId: playerId,
        clients: new Map([[playerId, socket]])
      };
      if (gameId === "avalon") {
        room.avalon = {
          phase: "lobby", players: [{ id: playerId, name: cleanToken(message.name, 12) || "방장", characterStyle }],
          settings: recommendedAvalonSettings(1), settingsCustomized: false,
          leaderIndex: 0, quest: 0, selectedTeam: [], proposalVotes: {}, questVotes: {},
          rejects: 0, results: [], winner: null, assassinId: null, turnDeadline: null
        };
      }
      if (gameId === "loveletter") {
        room.loveletter = LoveLetter.createGame(playerId, cleanToken(message.name, 12) || "방장");
      }
      if (gameId === "lastcard") {
        room.lastcard = LastCard.createGame(playerId, cleanToken(message.name, 12) || "방장");
      }
      if (gameId === "bomb77") {
        room.bomb77 = Bomb77.createGame(playerId, cleanToken(message.name, 12) || "방장");
      }
      if (gameId === "rummikub") {
        room.rummikub = Rummikub.createGame(playerId, cleanToken(message.name, 12) || "방장");
      }
      if (gameId === "gemguild") {
        room.gemguild = GemGuild.createGame(playerId, cleanToken(message.name, 12) || "방장");
      }
      if (gameId === "citychase") {
        room.citychase = CityChase.createGame(playerId, cleanToken(message.name, 12) || "방장");
      }
      if (gameId === "kingdomtrails") {
        room.kingdomtrails = KingdomTrails.createGame(playerId, cleanToken(message.name, 12) || "방장");
      }
      if (gameId === "blokus") {
        room.blokus = Blokus.createGame(playerId, cleanToken(message.name, 12) || "방장");
      }
      if (gameId === "chess") {
        room.chess = Chess.createGame(playerId, cleanToken(message.name, 12) || "방장");
      }
      if (gameId === "honeycomb") {
        room.honeycomb = Honeycomb.createGame(playerId, cleanToken(message.name, 12) || "방장");
      }
      if (gameId === "drawrelay") {
        room.drawrelay = DrawRelay.createGame(playerId, cleanToken(message.name, 12) || "방장");
      }
      if (gameId === "expedition") {
        // 학년군은 방장 계정에서 온다. 아무도 화면에서 고를 수 없다.
        room.expedition = Expedition.createGame(
          playerId,
          cleanToken(message.name, 12) || "방장",
          cleanToken(message.theme, 20)
        );
      }
      if (gameId === "clue") {
        room.clue = Clue.createGame(playerId, cleanToken(message.name, 12) || "방장", message.avatarUrl);
      }
      if (gameId === "codenames") {
        room.codenames = Codenames.createGame(playerId, cleanToken(message.name, 12) || "방장");
      }
      if (gameId === "dobble") {
        room.dobble = Dobble.createGame(playerId, cleanToken(message.name, 12) || "방장");
      }
      if (gameId === "spelling") {
        room.spelling = {
          phase: "lobby",
          sessionId: "",
          questionIds: [],
          startedAt: 0,
          players: [],
          results: {}
        };
      }
      if (gameId === "quizrace") {
        room.quizrace = Quizrace.createGame();
      }
      if (gameId === "circulation") {
        room.circulation = createBodyExplorerGame();
      }
      if (gameId === "digestion") {
        room.digestion = createBodyExplorerGame();
      }
      if (gameId === "respiration") {
        room.respiration = createBodyExplorerGame();
      }
      if (gameId === "nervous") {
        room.nervous = createBodyExplorerGame();
      }
      if (gameId === "immune") {
        room.immune = createBodyExplorerGame();
      }
      if (gameId === "movement") {
        room.movement = createBodyExplorerGame();
      }
      if (gameId === "excretion") {
        room.excretion = createBodyExplorerGame();
      }
      if (gameId === "temperature") {
        room.temperature = createBodyExplorerGame();
      }
      rooms.set(key, room);
      socket.meta.roomKey = key;
      socket.meta.role = "host";
      socket.meta.clientToken = clientToken;
      void persistRoomSnapshot(room, true);

      safeSend(socket, {
        type: "ROOM_CREATED",
        gameId,
        roomCode,
        playerId
      });
      if (room.avalon) avalonBroadcast(room);
      if (room.lastcard) lastCardBroadcast(room);
      if (room.bomb77) bomb77Broadcast(room);
      if (room.loveletter) loveLetterBroadcast(room);
      if (room.rummikub) rummikubBroadcast(room);
      if (room.gemguild) gemGuildBroadcast(room);
      if (room.citychase) cityChaseBroadcast(room);
      if (room.kingdomtrails) kingdomTrailsBroadcast(room);
      if (room.blokus) blokusBroadcast(room);
      if (room.chess) chessBroadcast(room);
      if (room.honeycomb) honeycombBroadcast(room);
      if (room.drawrelay) drawRelayBroadcast(room);
      if (room.expedition) expeditionBroadcast(room);
      if (room.clue) clueBroadcast(room);
      if (room.codenames) codenamesBroadcast(room);
      if (room.dobble) dobbleBroadcast(room);
      if (room.spelling) spellingBroadcast(room);
      if (room.quizrace) quizraceBroadcast(room);
      if (room.circulation) circulationBroadcast(room);
      if (room.digestion) digestionBroadcast(room);
      if (room.respiration) respirationBroadcast(room);
      if (room.nervous) nervousBroadcast(room);
      if (room.immune) immuneBroadcast(room);
      if (room.movement) movementBroadcast(room);
      if (room.excretion) excretionBroadcast(room);
      if (room.temperature) temperatureBroadcast(room);
      return;
    }

    if (type === "JOIN_ROOM") {
      const gameId = cleanToken(message.gameId, 30);
      const roomCode = cleanToken(message.roomCode, 10);
      const clientToken = cleanToken(message.clientToken, 80);
      const resumeOnly = message.resumeOnly === true;
      const characterStyle = gameId === "avalon" ? await getAvalonCharacterStyle() : "random";
      if (socket.readyState !== WebSocket.OPEN) return;
      const key = roomKey(gameId, roomCode);
      let room = rooms.get(key);
      if (!room) room = await restorePersistedRoom(gameId, roomCode);

      if (!room) {
        safeSend(socket, { type: "ROOM_NOT_FOUND", gameId, roomCode });
        return;
      }

      const resumeEntry = clientToken
        ? [...room.clients.entries()].find(([, client]) => clientMatchesToken(client, clientToken))
        : null;
      if (resumeEntry) {
        const [resumeId, previousSocket] = resumeEntry;
        clearTimeout(previousSocket.meta.disconnectTimer);
        if (previousSocket !== socket && previousSocket.readyState === WebSocket.OPEN) {
          try { previousSocket.close(4003, "REPLACED"); } catch (_) {}
        }
        playerId = resumeId;
        socket.meta.playerId = playerId;
        socket.meta.roomKey = key;
        socket.meta.role = resumeId === room.hostId ? "host" : "guest";
        socket.meta.clientToken = clientToken;
        room.clients.set(playerId, socket);
        safeSend(socket, { type: "ROOM_RESUMED", gameId, roomCode, playerId });
        if (room.avalon) {
          const player = room.avalon.players.find(player => player.id === playerId);
          if (player && room.avalon.phase === "lobby") player.characterStyle = characterStyle;
          avalonBroadcast(room);
        }
        if (room.lastcard) lastCardBroadcast(room);
        if (room.bomb77) bomb77Broadcast(room);
        if (room.loveletter) loveLetterBroadcast(room);
        if (room.rummikub) rummikubBroadcast(room);
        if (room.gemguild) gemGuildBroadcast(room);
        if (room.citychase) cityChaseBroadcast(room);
        if (room.kingdomtrails) kingdomTrailsBroadcast(room);
        if (room.blokus) blokusBroadcast(room);
        if (room.chess) chessBroadcast(room);
        if (room.honeycomb) honeycombBroadcast(room);
        if (room.drawrelay) drawRelayBroadcast(room);
        if (room.expedition) expeditionBroadcast(room);
        if (room.clue) clueBroadcast(room);
        if (room.codenames) codenamesBroadcast(room);
        if (room.dobble) dobbleBroadcast(room);
        if (room.spelling) spellingBroadcast(room);
        if (room.quizrace) {
          quizraceBroadcast(room);
          if (room.quizrace.phase === "running" && room.quizrace.players.some(player => player.id === playerId)) quizraceSendQuestions(room, playerId);
        }
        if (room.circulation) circulationBroadcast(room);
        if (room.digestion) digestionBroadcast(room);
        if (room.respiration) respirationBroadcast(room);
        if (room.nervous) nervousBroadcast(room);
        if (room.immune) immuneBroadcast(room);
        if (room.movement) movementBroadcast(room);
        if (room.excretion) excretionBroadcast(room);
        if (room.temperature) temperatureBroadcast(room);
        return;
      }
      if (resumeOnly) {
        safeSend(socket, { type: "ROOM_NOT_FOUND", gameId, roomCode });
        return;
      }

      const maxPlayers = MAX_ROOM_PLAYERS[gameId] || 4;
      if (room.clients.size >= maxPlayers) {
        safeSend(socket, { type: "ROOM_FULL", gameId, roomCode });
        return;
      }

      room.clients.set(playerId, socket);
      socket.meta.roomKey = key;
      socket.meta.role = "guest";
      socket.meta.clientToken = clientToken;

      if (room.avalon) {
        if (room.avalon.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 시작한 게임입니다." });
          return;
        }
        room.avalon.players.push({ id: playerId, name: cleanToken(message.name, 12) || `플레이어 ${room.avalon.players.length + 1}`, characterStyle });
        if (!room.avalon.settingsCustomized) {
          room.avalon.settings = recommendedAvalonSettings(room.avalon.players.length);
        }
      }
      if (room.loveletter) {
        if (room.loveletter.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 시작한 게임입니다." });
          return;
        }
        LoveLetter.addPlayer(room.loveletter, playerId, cleanToken(message.name, 12) || `플레이어 ${room.loveletter.players.length + 1}`);
      }
      if (room.lastcard) {
        if (room.lastcard.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 시작한 게임입니다." });
          return;
        }
        LastCard.addPlayer(room.lastcard, playerId, cleanToken(message.name, 12) || `플레이어 ${room.lastcard.players.length + 1}`);
      }
      if (room.bomb77) {
        if (room.bomb77.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 시작한 게임입니다." });
          return;
        }
        Bomb77.addPlayer(room.bomb77, playerId, cleanToken(message.name, 12) || `플레이어 ${room.bomb77.players.length + 1}`);
      }
      if (room.rummikub) {
        if (room.rummikub.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 시작한 게임입니다." });
          return;
        }
        Rummikub.addPlayer(room.rummikub, playerId, cleanToken(message.name, 12) || `플레이어 ${room.rummikub.players.length + 1}`);
      }
      if (room.gemguild) {
        if (room.gemguild.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 시작한 게임입니다." });
          return;
        }
        GemGuild.addPlayer(room.gemguild, playerId, cleanToken(message.name, 12) || `플레이어 ${room.gemguild.players.length + 1}`);
      }
      if (room.citychase) {
        if (room.citychase.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 시작한 게임입니다." });
          return;
        }
        CityChase.addPlayer(room.citychase, playerId, cleanToken(message.name, 12) || `플레이어 ${room.citychase.players.length + 1}`);
      }
      if (room.kingdomtrails) {
        if (room.kingdomtrails.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 시작한 게임입니다." });
          return;
        }
        KingdomTrails.addPlayer(room.kingdomtrails, playerId, cleanToken(message.name, 12) || `플레이어 ${room.kingdomtrails.players.length + 1}`);
      }
      if (room.blokus) {
        if (room.blokus.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 시작한 게임입니다." });
          return;
        }
        Blokus.addPlayer(room.blokus, playerId, cleanToken(message.name, 12) || `플레이어 ${room.blokus.players.length + 1}`);
      }
      if (room.chess) {
        if (room.chess.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 시작한 대국입니다." });
          return;
        }
        Chess.addPlayer(room.chess, playerId, cleanToken(message.name, 12) || "손님");
      }
      if (room.honeycomb) {
        if (room.honeycomb.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 시작한 게임입니다." });
          return;
        }
        Honeycomb.addPlayer(room.honeycomb, playerId, cleanToken(message.name, 12) || `플레이어 ${room.honeycomb.players.length + 1}`);
      }
      if (room.drawrelay) {
        if (room.drawrelay.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 시작한 게임입니다." });
          return;
        }
        DrawRelay.addPlayer(room.drawrelay, playerId, cleanToken(message.name, 12) || `플레이어 ${room.drawrelay.players.length + 1}`);
      }
      if (room.expedition) {
        if (room.expedition.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 시작한 게임입니다." });
          return;
        }
        Expedition.addPlayer(room.expedition, playerId, cleanToken(message.name, 12) || `플레이어 ${room.expedition.players.length + 1}`);
      }
      if (room.clue) {
        if (room.clue.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 시작한 게임입니다." });
          return;
        }
        Clue.addPlayer(room.clue, playerId, cleanToken(message.name, 12) || `플레이어 ${room.clue.players.length + 1}`, message.avatarUrl);
      }
      if (room.codenames) {
        if (room.codenames.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 시작한 게임입니다." });
          return;
        }
        Codenames.addPlayer(room.codenames, playerId, cleanToken(message.name, 12) || `플레이어 ${room.codenames.players.length + 1}`);
      }
      if (room.dobble) {
        if (room.dobble.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 시작한 게임입니다." });
          return;
        }
        Dobble.addPlayer(room.dobble, playerId, cleanToken(message.name, 12) || `플레이어 ${room.dobble.players.length + 1}`);
      }
      if (room.spelling) {
        if (room.spelling.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 시작한 학급 순위전입니다." });
          return;
        }
        const name = cleanToken(message.name, 12);
        if (!/^[가-힣]{2,6}$/.test(name)) {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "메인 화면에서 한글 이름을 먼저 저장하세요." });
          return;
        }
        room.spelling.players.push({ id: playerId, name });
      }
      if (room.quizrace) {
        const name = cleanToken(message.name, 12);
        if (!/^[가-힣]{2,6}$/.test(name)) {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "메인 화면에서 한글 이름을 먼저 저장하세요." });
          return;
        }
        const joined = Quizrace.addPlayer(room.quizrace, playerId, name);
        if (!joined.ok) {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: joined.error });
          return;
        }
        socket.meta.quizraceResume = Boolean(joined.resumed);
      }
      if (room.circulation) {
        if (room.circulation.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 출발한 혈액순환 탐험입니다." });
          return;
        }
        const name = cleanToken(message.name, 12);
        if (!/^[가-힣]{2,6}$/.test(name)) {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "메인 화면에서 한글 이름을 먼저 저장하세요." });
          return;
        }
        room.circulation.players.push({ id: playerId, name });
      }
      if (room.digestion) {
        if (room.digestion.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 출발한 소화 탐험입니다." });
          return;
        }
        const name = cleanToken(message.name, 12);
        if (!/^[가-힣]{2,6}$/.test(name)) {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "메인 화면에서 한글 이름을 먼저 저장하세요." });
          return;
        }
        room.digestion.players.push({ id: playerId, name });
      }
      if (room.respiration) {
        if (room.respiration.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 출발한 호흡 탐험입니다." });
          return;
        }
        const name = cleanToken(message.name, 12);
        if (!/^[가-힣]{2,6}$/.test(name)) {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "메인 화면에서 한글 이름을 먼저 저장하세요." });
          return;
        }
        room.respiration.players.push({ id: playerId, name });
      }
      if (room.nervous) {
        if (room.nervous.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 출발한 신경 탐험입니다." });
          return;
        }
        const name = cleanToken(message.name, 12);
        if (!/^[가-힣]{2,6}$/.test(name)) {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "메인 화면에서 한글 이름을 먼저 저장하세요." });
          return;
        }
        room.nervous.players.push({ id: playerId, name });
      }
      if (room.immune) {
        if (room.immune.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 출발한 면역 탐험입니다." });
          return;
        }
        const name = cleanToken(message.name, 12);
        if (!/^[가-힣]{2,6}$/.test(name)) {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "메인 화면에서 한글 이름을 먼저 저장하세요." });
          return;
        }
        room.immune.players.push({ id: playerId, name });
      }
      if (room.movement) {
        if (room.movement.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 출발한 뼈와 근육 탐험입니다." });
          return;
        }
        const name = cleanToken(message.name, 12);
        if (!/^[가-힣]{2,6}$/.test(name)) {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "메인 화면에서 한글 이름을 먼저 저장하세요." });
          return;
        }
        room.movement.players.push({ id: playerId, name });
      }
      if (room.excretion) {
        if (room.excretion.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 출발한 배설 탐험입니다." });
          return;
        }
        const name = cleanToken(message.name, 12);
        if (!/^[가-힣]{2,6}$/.test(name)) {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "메인 화면에서 한글 이름을 먼저 저장하세요." });
          return;
        }
        room.excretion.players.push({ id: playerId, name });
      }
      if (room.temperature) {
        if (room.temperature.phase !== "lobby") {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "이미 출발한 체온 조절 탐험입니다." });
          return;
        }
        const name = cleanToken(message.name, 12);
        if (!/^[가-힣]{2,6}$/.test(name)) {
          room.clients.delete(playerId);
          socket.meta.roomKey = null;
          socket.meta.role = null;
          safeSend(socket, { type: "ERROR", message: "메인 화면에서 한글 이름을 먼저 저장하세요." });
          return;
        }
        room.temperature.players.push({ id: playerId, name });
      }

      safeSend(socket, {
        type: "ROOM_JOINED",
        gameId,
        roomCode,
        playerId
      });

      const hostSocket = room.clients.get(room.hostId);
      safeSend(hostSocket, {
        type: "PLAYER_JOINED",
        playerId,
        name: cleanToken(message.name, 20)
      });
      if (room.avalon) avalonBroadcast(room);
      if (room.lastcard) lastCardBroadcast(room);
      if (room.bomb77) bomb77Broadcast(room);
      if (room.loveletter) loveLetterBroadcast(room);
      if (room.rummikub) rummikubBroadcast(room);
      if (room.gemguild) gemGuildBroadcast(room);
      if (room.citychase) cityChaseBroadcast(room);
      if (room.kingdomtrails) kingdomTrailsBroadcast(room);
      if (room.blokus) blokusBroadcast(room);
      if (room.chess) chessBroadcast(room);
      if (room.honeycomb) honeycombBroadcast(room);
      if (room.drawrelay) drawRelayBroadcast(room);
      if (room.expedition) expeditionBroadcast(room);
      if (room.clue) clueBroadcast(room);
      if (room.codenames) codenamesBroadcast(room);
      if (room.dobble) dobbleBroadcast(room);
      if (room.spelling) spellingBroadcast(room);
      if (room.quizrace) {
        quizraceBroadcast(room);
        if (socket.meta.quizraceResume) quizraceSendQuestions(room, playerId);
        socket.meta.quizraceResume = false;
      }
      if (room.circulation) circulationBroadcast(room);
      if (room.digestion) digestionBroadcast(room);
      if (room.respiration) respirationBroadcast(room);
      if (room.nervous) nervousBroadcast(room);
      if (room.immune) immuneBroadcast(room);
      if (room.movement) movementBroadcast(room);
      if (room.excretion) excretionBroadcast(room);
      if (room.temperature) temperatureBroadcast(room);
      void persistRoomSnapshot(room, true);
      return;
    }

    if (type === "SPELLING_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.spelling;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        spellingError(socket, "한글 맞춤법 학급에 참가하지 않았습니다.");
        return;
      }

      if (action === "START") {
        if (playerId !== room.hostId) {
          spellingError(socket, "교사 화면에서만 순위전을 시작할 수 있습니다.");
          return;
        }
        if (game.phase !== "lobby") {
          spellingError(socket, "이미 순위전이 진행 중입니다.");
          return;
        }
        if (game.players.length < 1) {
          spellingError(socket, "학생이 한 명 이상 참가해야 합니다.");
          return;
        }
        const questionIds = Array.isArray(message.questionIds)
          ? [...new Set(message.questionIds.map(id => cleanToken(id, 60)).filter(id => /^[a-z0-9_-]+$/i.test(id)))]
          : [];
        if (questionIds.length !== 10) {
          spellingError(socket, "순위전 문항 10개가 필요합니다.");
          return;
        }
        game.phase = "running";
        game.sessionId = crypto.randomUUID();
        game.questionIds = questionIds;
        game.startedAt = Date.now();
        game.results = {};
        spellingBroadcast(room);
        return;
      }

      if (action === "SUBMIT") {
        if (game.phase !== "running") {
          spellingError(socket, "현재 진행 중인 순위전이 없습니다.");
          return;
        }
        if (cleanToken(message.sessionId, 80) !== game.sessionId) {
          spellingError(socket, "현재 순위전의 결과가 아닙니다.");
          return;
        }
        if (!game.players.some(player => player.id === playerId)) {
          spellingError(socket, "참가 학생만 결과를 제출할 수 있습니다.");
          return;
        }
        const score = Number(message.score);
        if (!Number.isInteger(score) || score < 0 || score > 10) {
          spellingError(socket, "점수가 올바르지 않습니다.");
          return;
        }
        if (!game.results[playerId]) {
          game.results[playerId] = {
            score,
            elapsedMs: Math.max(0, Date.now() - game.startedAt)
          };
        }
        if (game.players.length > 0 && game.players.every(player => game.results[player.id])) {
          game.phase = "ended";
        }
        spellingBroadcast(room);
        return;
      }

      if (action === "RESET") {
        if (playerId !== room.hostId) {
          spellingError(socket, "교사 화면에서만 새 순위전을 준비할 수 있습니다.");
          return;
        }
        game.phase = "lobby";
        game.sessionId = "";
        game.questionIds = [];
        game.startedAt = 0;
        game.results = {};
        game.players = game.players.filter(player => room.clients.has(player.id));
        spellingBroadcast(room);
        return;
      }

      spellingError(socket, "알 수 없는 학급 순위전 요청입니다.");
      return;
    }

    if (type === "QUIZRACE_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.quizrace;
      if (!room || !game) {
        quizraceError(socket, "학급 순위전 방에 참가하지 않았습니다.");
        return;
      }
      const result = Quizrace.handleAction(game, {
        playerId,
        isHost: playerId === room.hostId,
        message,
        avatarExists: quizraceAvatarExists
      });
      if (result.error) {
        quizraceError(socket, result.error);
        return;
      }
      if (result.reply) safeSend(socket, result.reply);
      if (result.sendQuestions) game.players.forEach(player => quizraceSendQuestions(room, player.id));
      if (result.sendReviews) {
        game.players.forEach(player => {
          const client = room.clients.get(player.id);
          if (client) safeSend(client, Quizrace.reviewPayload(game, player.id));
        });
      }
      if (result.broadcast) {
        if (result.throttle) quizraceBroadcastSoon(room);
        else quizraceBroadcast(room);
      }
      return;
    }

    if (type === "CIRCULATION_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.circulation;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        circulationError(socket, "혈액순환 학급 탐험에 참가하지 않았습니다.");
        return;
      }

      if (action === "START") {
        if (playerId !== room.hostId) {
          circulationError(socket, "교사 화면에서만 탐험을 출발시킬 수 있습니다.");
          return;
        }
        if (game.phase !== "lobby") {
          circulationError(socket, "이미 탐험이 진행 중입니다.");
          return;
        }
        if (game.players.length < 1) {
          circulationError(socket, "학생이 한 명 이상 참가해야 합니다.");
          return;
        }
        game.phase = "running";
        game.sessionId = crypto.randomUUID();
        game.startedAt = Date.now();
        game.results = {};
        game.progress = {};
        circulationBroadcast(room);
        return;
      }

      if (action === "PROGRESS") {
        const progressError = trackBodyExplorerProgress(game, playerId, message);
        if (progressError) circulationError(socket, progressError);
        return;
      }

      if (action === "SUBMIT") {
        if (game.phase !== "running") {
          circulationError(socket, "현재 진행 중인 탐험이 없습니다.");
          return;
        }
        if (cleanToken(message.sessionId, 80) !== game.sessionId) {
          circulationError(socket, "현재 탐험의 결과가 아닙니다.");
          return;
        }
        if (!game.players.some(player => player.id === playerId)) {
          circulationError(socket, "참가 학생만 결과를 제출할 수 있습니다.");
          return;
        }
        const score = verifiedBodyExplorerScore(game, playerId);
        if (score === null) {
          circulationError(socket, "10개 관문을 모두 완료한 뒤 결과를 제출해 주세요.");
          return;
        }
        if (!game.results[playerId]) {
          game.results[playerId] = {
            score,
            elapsedMs: Math.max(0, Date.now() - game.startedAt)
          };
        }
        if (game.players.length > 0 && game.players.every(player => game.results[player.id])) {
          game.phase = "ended";
        }
        circulationBroadcast(room);
        return;
      }

      if (action === "RESET") {
        if (playerId !== room.hostId) {
          circulationError(socket, "교사 화면에서만 새 탐험을 준비할 수 있습니다.");
          return;
        }
        game.phase = "lobby";
        game.sessionId = "";
        game.startedAt = 0;
        game.results = {};
        game.progress = {};
        game.players = game.players.filter(player => room.clients.has(player.id));
        circulationBroadcast(room);
        return;
      }

      circulationError(socket, "알 수 없는 혈액순환 탐험 요청입니다.");
      return;
    }

    if (type === "DIGESTION_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.digestion;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        digestionError(socket, "소화 학급 탐험에 참가하지 않았습니다.");
        return;
      }

      if (action === "START") {
        if (playerId !== room.hostId) {
          digestionError(socket, "교사 화면에서만 탐험을 출발시킬 수 있습니다.");
          return;
        }
        if (game.phase !== "lobby") {
          digestionError(socket, "이미 탐험이 진행 중입니다.");
          return;
        }
        if (game.players.length < 1) {
          digestionError(socket, "학생이 한 명 이상 참가해야 합니다.");
          return;
        }
        game.phase = "running";
        game.sessionId = crypto.randomUUID();
        game.startedAt = Date.now();
        game.results = {};
        game.progress = {};
        digestionBroadcast(room);
        return;
      }

      if (action === "PROGRESS") {
        const progressError = trackBodyExplorerProgress(game, playerId, message);
        if (progressError) digestionError(socket, progressError);
        return;
      }

      if (action === "SUBMIT") {
        if (game.phase !== "running") {
          digestionError(socket, "현재 진행 중인 탐험이 없습니다.");
          return;
        }
        if (cleanToken(message.sessionId, 80) !== game.sessionId) {
          digestionError(socket, "현재 탐험의 결과가 아닙니다.");
          return;
        }
        if (!game.players.some(player => player.id === playerId)) {
          digestionError(socket, "참가 학생만 결과를 제출할 수 있습니다.");
          return;
        }
        const score = verifiedBodyExplorerScore(game, playerId);
        if (score === null) {
          digestionError(socket, "10개 관문을 모두 완료한 뒤 결과를 제출해 주세요.");
          return;
        }
        if (!game.results[playerId]) {
          game.results[playerId] = {
            score,
            elapsedMs: Math.max(0, Date.now() - game.startedAt)
          };
        }
        if (game.players.length > 0 && game.players.every(player => game.results[player.id])) {
          game.phase = "ended";
        }
        digestionBroadcast(room);
        return;
      }

      if (action === "RESET") {
        if (playerId !== room.hostId) {
          digestionError(socket, "교사 화면에서만 새 탐험을 준비할 수 있습니다.");
          return;
        }
        game.phase = "lobby";
        game.sessionId = "";
        game.startedAt = 0;
        game.results = {};
        game.progress = {};
        game.players = game.players.filter(player => room.clients.has(player.id));
        digestionBroadcast(room);
        return;
      }

      digestionError(socket, "알 수 없는 소화 탐험 요청입니다.");
      return;
    }

    if (type === "RESPIRATION_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.respiration;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        respirationError(socket, "호흡 학급 탐험에 참가하지 않았습니다.");
        return;
      }

      if (action === "START") {
        if (playerId !== room.hostId) {
          respirationError(socket, "교사 화면에서만 탐험을 출발시킬 수 있습니다.");
          return;
        }
        if (game.phase !== "lobby") {
          respirationError(socket, "이미 탐험이 진행 중입니다.");
          return;
        }
        if (game.players.length < 1) {
          respirationError(socket, "학생이 한 명 이상 참가해야 합니다.");
          return;
        }
        game.phase = "running";
        game.sessionId = crypto.randomUUID();
        game.startedAt = Date.now();
        game.results = {};
        game.progress = {};
        respirationBroadcast(room);
        return;
      }

      if (action === "PROGRESS") {
        const progressError = trackBodyExplorerProgress(game, playerId, message);
        if (progressError) respirationError(socket, progressError);
        return;
      }

      if (action === "SUBMIT") {
        if (game.phase !== "running") {
          respirationError(socket, "현재 진행 중인 탐험이 없습니다.");
          return;
        }
        if (cleanToken(message.sessionId, 80) !== game.sessionId) {
          respirationError(socket, "현재 탐험의 결과가 아닙니다.");
          return;
        }
        if (!game.players.some(player => player.id === playerId)) {
          respirationError(socket, "참가 학생만 결과를 제출할 수 있습니다.");
          return;
        }
        const score = verifiedBodyExplorerScore(game, playerId);
        if (score === null) {
          respirationError(socket, "10개 관문을 모두 완료한 뒤 결과를 제출해 주세요.");
          return;
        }
        if (!game.results[playerId]) {
          game.results[playerId] = {
            score,
            elapsedMs: Math.max(0, Date.now() - game.startedAt)
          };
        }
        if (game.players.length > 0 && game.players.every(player => game.results[player.id])) {
          game.phase = "ended";
        }
        respirationBroadcast(room);
        return;
      }

      if (action === "RESET") {
        if (playerId !== room.hostId) {
          respirationError(socket, "교사 화면에서만 새 탐험을 준비할 수 있습니다.");
          return;
        }
        game.phase = "lobby";
        game.sessionId = "";
        game.startedAt = 0;
        game.results = {};
        game.progress = {};
        game.players = game.players.filter(player => room.clients.has(player.id));
        respirationBroadcast(room);
        return;
      }

      respirationError(socket, "알 수 없는 호흡 탐험 요청입니다.");
      return;
    }

    if (type === "NERVOUS_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.nervous;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        nervousError(socket, "신경 학급 탐험에 참가하지 않았습니다.");
        return;
      }

      if (action === "START") {
        if (playerId !== room.hostId) {
          nervousError(socket, "교사 화면에서만 탐험을 출발시킬 수 있습니다.");
          return;
        }
        if (game.phase !== "lobby") {
          nervousError(socket, "이미 탐험이 진행 중입니다.");
          return;
        }
        if (game.players.length < 1) {
          nervousError(socket, "학생이 한 명 이상 참가해야 합니다.");
          return;
        }
        game.phase = "running";
        game.sessionId = crypto.randomUUID();
        game.startedAt = Date.now();
        game.results = {};
        game.progress = {};
        nervousBroadcast(room);
        return;
      }

      if (action === "PROGRESS") {
        const progressError = trackBodyExplorerProgress(game, playerId, message);
        if (progressError) nervousError(socket, progressError);
        return;
      }

      if (action === "SUBMIT") {
        if (game.phase !== "running") {
          nervousError(socket, "현재 진행 중인 탐험이 없습니다.");
          return;
        }
        if (cleanToken(message.sessionId, 80) !== game.sessionId) {
          nervousError(socket, "현재 탐험의 결과가 아닙니다.");
          return;
        }
        if (!game.players.some(player => player.id === playerId)) {
          nervousError(socket, "참가 학생만 결과를 제출할 수 있습니다.");
          return;
        }
        const score = verifiedBodyExplorerScore(game, playerId);
        if (score === null) {
          nervousError(socket, "10개 관문을 모두 완료한 뒤 결과를 제출해 주세요.");
          return;
        }
        if (!game.results[playerId]) {
          game.results[playerId] = {
            score,
            elapsedMs: Math.max(0, Date.now() - game.startedAt)
          };
        }
        if (game.players.length > 0 && game.players.every(player => game.results[player.id])) {
          game.phase = "ended";
        }
        nervousBroadcast(room);
        return;
      }

      if (action === "RESET") {
        if (playerId !== room.hostId) {
          nervousError(socket, "교사 화면에서만 새 탐험을 준비할 수 있습니다.");
          return;
        }
        game.phase = "lobby";
        game.sessionId = "";
        game.startedAt = 0;
        game.results = {};
        game.progress = {};
        game.players = game.players.filter(player => room.clients.has(player.id));
        nervousBroadcast(room);
        return;
      }

      nervousError(socket, "알 수 없는 신경 탐험 요청입니다.");
      return;
    }

    if (type === "IMMUNE_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.immune;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        immuneError(socket, "면역 학급 탐험에 참가하지 않았습니다.");
        return;
      }

      if (action === "START") {
        if (playerId !== room.hostId) {
          immuneError(socket, "교사 화면에서만 탐험을 출발시킬 수 있습니다.");
          return;
        }
        if (game.phase !== "lobby") {
          immuneError(socket, "이미 탐험이 진행 중입니다.");
          return;
        }
        if (game.players.length < 1) {
          immuneError(socket, "학생이 한 명 이상 참가해야 합니다.");
          return;
        }
        game.phase = "running";
        game.sessionId = crypto.randomUUID();
        game.startedAt = Date.now();
        game.results = {};
        game.progress = {};
        immuneBroadcast(room);
        return;
      }

      if (action === "PROGRESS") {
        const progressError = trackBodyExplorerProgress(game, playerId, message);
        if (progressError) immuneError(socket, progressError);
        return;
      }

      if (action === "SUBMIT") {
        if (game.phase !== "running") {
          immuneError(socket, "현재 진행 중인 탐험이 없습니다.");
          return;
        }
        if (cleanToken(message.sessionId, 80) !== game.sessionId) {
          immuneError(socket, "현재 탐험의 결과가 아닙니다.");
          return;
        }
        if (!game.players.some(player => player.id === playerId)) {
          immuneError(socket, "참가 학생만 결과를 제출할 수 있습니다.");
          return;
        }
        const score = verifiedBodyExplorerScore(game, playerId);
        if (score === null) {
          immuneError(socket, "10개 관문을 모두 완료한 뒤 결과를 제출해 주세요.");
          return;
        }
        if (!game.results[playerId]) {
          game.results[playerId] = {
            score,
            elapsedMs: Math.max(0, Date.now() - game.startedAt)
          };
        }
        if (game.players.length > 0 && game.players.every(player => game.results[player.id])) {
          game.phase = "ended";
        }
        immuneBroadcast(room);
        return;
      }

      if (action === "RESET") {
        if (playerId !== room.hostId) {
          immuneError(socket, "교사 화면에서만 새 탐험을 준비할 수 있습니다.");
          return;
        }
        game.phase = "lobby";
        game.sessionId = "";
        game.startedAt = 0;
        game.results = {};
        game.progress = {};
        game.players = game.players.filter(player => room.clients.has(player.id));
        immuneBroadcast(room);
        return;
      }

      immuneError(socket, "알 수 없는 면역 탐험 요청입니다.");
      return;
    }

    if (type === "MOVEMENT_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.movement;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        movementError(socket, "뼈와 근육 학급 탐험에 참가하지 않았습니다.");
        return;
      }

      if (action === "START") {
        if (playerId !== room.hostId) {
          movementError(socket, "교사 화면에서만 탐험을 출발시킬 수 있습니다.");
          return;
        }
        if (game.phase !== "lobby") {
          movementError(socket, "이미 탐험이 진행 중입니다.");
          return;
        }
        if (game.players.length < 1) {
          movementError(socket, "학생이 한 명 이상 참가해야 합니다.");
          return;
        }
        game.phase = "running";
        game.sessionId = crypto.randomUUID();
        game.startedAt = Date.now();
        game.results = {};
        game.progress = {};
        movementBroadcast(room);
        return;
      }

      if (action === "PROGRESS") {
        const progressError = trackBodyExplorerProgress(game, playerId, message);
        if (progressError) movementError(socket, progressError);
        return;
      }

      if (action === "SUBMIT") {
        if (game.phase !== "running") {
          movementError(socket, "현재 진행 중인 탐험이 없습니다.");
          return;
        }
        if (cleanToken(message.sessionId, 80) !== game.sessionId) {
          movementError(socket, "현재 탐험의 결과가 아닙니다.");
          return;
        }
        if (!game.players.some(player => player.id === playerId)) {
          movementError(socket, "참가 학생만 결과를 제출할 수 있습니다.");
          return;
        }
        const score = verifiedBodyExplorerScore(game, playerId);
        if (score === null) {
          movementError(socket, "10개 관문을 모두 완료한 뒤 결과를 제출해 주세요.");
          return;
        }
        if (!game.results[playerId]) {
          game.results[playerId] = {
            score,
            elapsedMs: Math.max(0, Date.now() - game.startedAt)
          };
        }
        if (game.players.length > 0 && game.players.every(player => game.results[player.id])) {
          game.phase = "ended";
        }
        movementBroadcast(room);
        return;
      }

      if (action === "RESET") {
        if (playerId !== room.hostId) {
          movementError(socket, "교사 화면에서만 새 탐험을 준비할 수 있습니다.");
          return;
        }
        game.phase = "lobby";
        game.sessionId = "";
        game.startedAt = 0;
        game.results = {};
        game.progress = {};
        game.players = game.players.filter(player => room.clients.has(player.id));
        movementBroadcast(room);
        return;
      }

      movementError(socket, "알 수 없는 뼈와 근육 탐험 요청입니다.");
      return;
    }

    if (type === "EXCRETION_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.excretion;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        excretionError(socket, "배설 학급 탐험에 참가하지 않았습니다.");
        return;
      }

      if (action === "START") {
        if (playerId !== room.hostId) {
          excretionError(socket, "교사 화면에서만 탐험을 출발시킬 수 있습니다.");
          return;
        }
        if (game.phase !== "lobby") {
          excretionError(socket, "이미 탐험이 진행 중입니다.");
          return;
        }
        if (game.players.length < 1) {
          excretionError(socket, "학생이 한 명 이상 참가해야 합니다.");
          return;
        }
        game.phase = "running";
        game.sessionId = crypto.randomUUID();
        game.startedAt = Date.now();
        game.results = {};
        game.progress = {};
        excretionBroadcast(room);
        return;
      }

      if (action === "PROGRESS") {
        const progressError = trackBodyExplorerProgress(game, playerId, message);
        if (progressError) excretionError(socket, progressError);
        return;
      }

      if (action === "SUBMIT") {
        if (game.phase !== "running") {
          excretionError(socket, "현재 진행 중인 탐험이 없습니다.");
          return;
        }
        if (cleanToken(message.sessionId, 80) !== game.sessionId) {
          excretionError(socket, "현재 탐험의 결과가 아닙니다.");
          return;
        }
        if (!game.players.some(player => player.id === playerId)) {
          excretionError(socket, "참가 학생만 결과를 제출할 수 있습니다.");
          return;
        }
        const score = verifiedBodyExplorerScore(game, playerId);
        if (score === null) {
          excretionError(socket, "10개 관문을 모두 완료한 뒤 결과를 제출해 주세요.");
          return;
        }
        if (!game.results[playerId]) {
          game.results[playerId] = {
            score,
            elapsedMs: Math.max(0, Date.now() - game.startedAt)
          };
        }
        if (game.players.length > 0 && game.players.every(player => game.results[player.id])) {
          game.phase = "ended";
        }
        excretionBroadcast(room);
        return;
      }

      if (action === "RESET") {
        if (playerId !== room.hostId) {
          excretionError(socket, "교사 화면에서만 새 탐험을 준비할 수 있습니다.");
          return;
        }
        game.phase = "lobby";
        game.sessionId = "";
        game.startedAt = 0;
        game.results = {};
        game.progress = {};
        game.players = game.players.filter(player => room.clients.has(player.id));
        excretionBroadcast(room);
        return;
      }

      excretionError(socket, "알 수 없는 배설 탐험 요청입니다.");
      return;
    }

    if (type === "TEMPERATURE_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.temperature;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        temperatureError(socket, "체온 조절 학급 탐험에 참가하지 않았습니다.");
        return;
      }

      if (action === "START") {
        if (playerId !== room.hostId) {
          temperatureError(socket, "교사 화면에서만 탐험을 출발시킬 수 있습니다.");
          return;
        }
        if (game.phase !== "lobby") {
          temperatureError(socket, "이미 탐험이 진행 중입니다.");
          return;
        }
        if (game.players.length < 1) {
          temperatureError(socket, "학생이 한 명 이상 참가해야 합니다.");
          return;
        }
        game.phase = "running";
        game.sessionId = crypto.randomUUID();
        game.startedAt = Date.now();
        game.results = {};
        game.progress = {};
        temperatureBroadcast(room);
        return;
      }

      if (action === "PROGRESS") {
        const progressError = trackBodyExplorerProgress(game, playerId, message);
        if (progressError) temperatureError(socket, progressError);
        return;
      }

      if (action === "SUBMIT") {
        if (game.phase !== "running") {
          temperatureError(socket, "현재 진행 중인 탐험이 없습니다.");
          return;
        }
        if (cleanToken(message.sessionId, 80) !== game.sessionId) {
          temperatureError(socket, "현재 탐험의 결과가 아닙니다.");
          return;
        }
        if (!game.players.some(player => player.id === playerId)) {
          temperatureError(socket, "참가 학생만 결과를 제출할 수 있습니다.");
          return;
        }
        const score = verifiedBodyExplorerScore(game, playerId);
        if (score === null) {
          temperatureError(socket, "10개 관문을 모두 완료한 뒤 결과를 제출해 주세요.");
          return;
        }
        if (!game.results[playerId]) {
          game.results[playerId] = {
            score,
            elapsedMs: Math.max(0, Date.now() - game.startedAt)
          };
        }
        if (game.players.length > 0 && game.players.every(player => game.results[player.id])) {
          game.phase = "ended";
        }
        temperatureBroadcast(room);
        return;
      }

      if (action === "RESET") {
        if (playerId !== room.hostId) {
          temperatureError(socket, "교사 화면에서만 새 탐험을 준비할 수 있습니다.");
          return;
        }
        game.phase = "lobby";
        game.sessionId = "";
        game.startedAt = 0;
        game.results = {};
        game.progress = {};
        game.players = game.players.filter(player => room.clients.has(player.id));
        temperatureBroadcast(room);
        return;
      }

      temperatureError(socket, "알 수 없는 체온 조절 탐험 요청입니다.");
      return;
    }

    if (type === "LASTCARD_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.lastcard;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        lastCardError(socket, "라스트 카드 방에 참가하지 않았습니다.");
        return;
      }

      let result = null;
      if (action === "START") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 게임을 시작할 수 있습니다." };
        else result = LastCard.startMatch(game);
      } else if (action === "PLAY") {
        result = LastCard.playCard(game, playerId, message);
      } else if (action === "DRAW") {
        result = LastCard.drawAndPass(game, playerId);
      } else if (action === "NEW_GAME") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 새 게임을 시작할 수 있습니다." };
        else result = LastCard.startMatch(game);
      } else if (action === "RETURN_LOBBY") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 대기실로 돌아갈 수 있습니다." };
        else result = LastCard.resetToLobby(game);
      } else {
        result = { ok: false, error: "알 수 없는 행동입니다." };
      }

      if (!result.ok) {
        lastCardError(socket, result.error || "행동을 처리하지 못했습니다.");
        return;
      }
      lastCardBroadcast(room);
      return;
    }

    if (type === "BOMB77_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.bomb77;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        bomb77Error(socket, "77 폭탄 방에 참가하지 않았습니다.");
        return;
      }

      let result = null;
      if (action === "START") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 게임을 시작할 수 있습니다." };
        else result = Bomb77.startMatch(game);
      } else if (action === "PLAY") {
        result = Bomb77.playCard(game, playerId, message);
      } else if (action === "NEW_GAME") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 새 게임을 시작할 수 있습니다." };
        else result = Bomb77.startMatch(game);
      } else if (action === "RETURN_LOBBY") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 대기실로 돌아갈 수 있습니다." };
        else result = Bomb77.resetToLobby(game);
      } else {
        result = { ok: false, error: "알 수 없는 행동입니다." };
      }

      if (!result.ok) {
        bomb77Error(socket, result.error || "행동을 처리하지 못했습니다.");
        return;
      }
      bomb77Broadcast(room);
      return;
    }

    if (type === "LOVELETTER_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.loveletter;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        loveLetterError(socket, "궁정 추리 방에 참가하지 않았습니다.");
        return;
      }

      let result = null;
      if (action === "START") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 게임을 시작할 수 있습니다." };
        else result = LoveLetter.startMatch(game);
      } else if (action === "PLAY") {
        result = LoveLetter.play(game, playerId, message);
      } else if (action === "NEXT_ROUND") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 다음 라운드를 시작할 수 있습니다." };
        else result = LoveLetter.nextRound(game);
      } else if (action === "NEW_GAME") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 새 게임을 시작할 수 있습니다." };
        else result = LoveLetter.newGame(game);
      } else if (action === "RETURN_LOBBY") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 대기실로 돌아갈 수 있습니다." };
        else {
          LoveLetter.resetToLobby(game);
          result = { ok: true, reveals: [] };
        }
      } else {
        result = { ok: false, error: "알 수 없는 행동입니다." };
      }

      if (!result.ok) {
        loveLetterError(socket, result.error || "행동을 처리하지 못했습니다.");
        return;
      }
      for (const reveal of result.reveals || []) {
        safeSend(room.clients.get(reveal.playerId), {
          type: "LOVELETTER_REVEAL",
          reveal: {
            title: reveal.title,
            message: reveal.message,
            card: reveal.card
          }
        });
      }
      loveLetterBroadcast(room);
      return;
    }

    if (type === "CLUE_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.clue;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        clueError(socket, "저택 추리 방에 참가하지 않았습니다.");
        return;
      }

      let result = null;
      if (action === "START") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 게임을 시작할 수 있습니다." };
        else result = Clue.startMatch(game);
      } else if (action === "ROLL") {
        result = Clue.roll(game, playerId);
      } else if (action === "MOVE") {
        result = Clue.move(game, playerId, cleanToken(message.target, 8));
      } else if (action === "STAY") {
        result = Clue.stay(game, playerId);
      } else if (action === "SECRET_PASSAGE") {
        result = Clue.secretPassage(game, playerId);
      } else if (action === "SUGGEST") {
        result = Clue.suggest(game, playerId, Number(message.suspect), Number(message.weapon));
      } else if (action === "CHOOSE_CARD") {
        result = Clue.chooseCard(game, playerId, Number(message.card));
      } else if (action === "ACCUSE") {
        result = Clue.accuse(game, playerId, Number(message.suspect), Number(message.weapon), Number(message.room));
      } else if (action === "END_TURN") {
        result = Clue.endTurn(game, playerId);
      } else if (action === "NEW_GAME") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 새 게임을 시작할 수 있습니다." };
        else result = Clue.newGame(game);
      } else if (action === "RETURN_LOBBY") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 대기실로 돌아갈 수 있습니다." };
        else {
          Clue.resetToLobby(game);
          result = { ok: true, reveals: [] };
        }
      } else {
        result = { ok: false, error: "알 수 없는 행동입니다." };
      }

      if (!result.ok) {
        clueError(socket, result.error || "행동을 처리하지 못했습니다.");
        return;
      }
      for (const reveal of result.reveals || []) {
        safeSend(room.clients.get(reveal.playerId), {
          type: "CLUE_REVEAL",
          reveal: {
            title: reveal.title,
            message: reveal.message,
            card: reveal.card
          }
        });
      }
      clueBroadcast(room);
      return;
    }

    if (type === "CODENAMES_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.codenames;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        codenamesError(socket, "낱말 암호 방에 참가하지 않았습니다.");
        return;
      }

      let result;
      if (action === "SET_GRADE") {
        result = playerId === room.hostId
          ? Codenames.setGrade(game, playerId, message.grade)
          : { ok: false, error: "방장만 학년을 바꿀 수 있습니다." };
      } else if (action === "SET_TEAM") {
        result = Codenames.setTeamRole(game, playerId, message.team, message.role);
      } else if (action === "START") {
        result = playerId === room.hostId
          ? Codenames.startGame(game)
          : { ok: false, error: "방장만 게임을 시작할 수 있습니다." };
      } else if (action === "HINT") {
        result = Codenames.giveHint(game, playerId, message.word, message.count);
      } else if (action === "GUESS") {
        result = Codenames.guess(game, playerId, message.cardIndex);
      } else if (action === "END_GUESSING") {
        result = Codenames.endGuessing(game, playerId);
      } else if (action === "NEW_GAME") {
        result = playerId === room.hostId
          ? Codenames.newGame(game)
          : { ok: false, error: "방장만 새 게임을 시작할 수 있습니다." };
      } else if (action === "RETURN_LOBBY") {
        if (playerId === room.hostId) {
          Codenames.resetToLobby(game);
          result = { ok: true };
        } else {
          result = { ok: false, error: "방장만 대기실로 돌아갈 수 있습니다." };
        }
      } else {
        result = { ok: false, error: "알 수 없는 행동입니다." };
      }

      if (!result.ok) {
        codenamesError(socket, result.error || "행동을 처리하지 못했습니다.");
        return;
      }
      codenamesBroadcast(room);
      return;
    }

    if (type === "DOBBLE_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.dobble;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        dobbleError(socket, "도블 방에 참가하지 않았습니다.");
        return;
      }

      let result;
      if (action === "SET_MODE") {
        result = playerId === room.hostId
          ? Dobble.setMode(game, message.mode)
          : { ok: false, error: "방장만 규칙을 바꿀 수 있습니다." };
      } else if (action === "START") {
        result = playerId === room.hostId
          ? Dobble.startGame(game)
          : { ok: false, error: "방장만 게임을 시작할 수 있습니다." };
      } else if (action === "CLAIM") {
        result = Dobble.claim(game, playerId, message.symbolKey);
      } else if (action === "NEW_GAME") {
        result = playerId === room.hostId
          ? Dobble.newGame(game)
          : { ok: false, error: "방장만 새 게임을 시작할 수 있습니다." };
      } else if (action === "RETURN_LOBBY") {
        if (playerId === room.hostId) {
          Dobble.resetToLobby(game);
          result = { ok: true };
        } else {
          result = { ok: false, error: "방장만 대기실로 돌아갈 수 있습니다." };
        }
      } else {
        result = { ok: false, error: "알 수 없는 행동입니다." };
      }

      if (!result.ok) {
        dobbleError(socket, result.error || "행동을 처리하지 못했습니다.");
        // 오답 페널티는 실패한 CLAIM에서도 게임 상태를 바꾸므로, 그 갱신된 상태
        // (myLocked/myLockedMs)를 클라이언트가 받을 수 있도록 이때도 방송한다.
        if (action === "CLAIM") dobbleBroadcast(room);
        return;
      }
      dobbleBroadcast(room);
      return;
    }

    if (type === "AVALON_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.avalon;
      const action = cleanToken(message.action, 30);
      if (!room || !game) return safeSend(socket, { type: "ERROR", message: "원정대 추리 방에 참가하지 않았습니다." });
      const player = game.players.find(p => p.id === playerId);
      if (!player) return;

      if (action === "SETTINGS" && playerId === room.hostId && game.phase === "lobby") {
        game.settings = normalizeAvalonSettings(game.players.length, message.settings);
        game.settingsCustomized = true;
        avalonBroadcast(room);
      } else if (action === "RESET_RECOMMENDED" && playerId === room.hostId && game.phase === "lobby") {
        game.settings = recommendedAvalonSettings(game.players.length);
        game.settingsCustomized = false;
        avalonBroadcast(room);
      } else if (action === "START" && playerId === room.hostId && game.phase === "lobby") {
        if (game.players.length < 5) return safeSend(socket, { type: "ERROR", message: "게임 시작에는 최소 5명이 필요합니다." });
        if (game.players.length > 8) return safeSend(socket, { type: "ERROR", message: "원정대 추리는 최대 8명까지 참여할 수 있습니다." });
        const roles = buildAvalonRoles(game.players.length, game.settings);
        const roleVariantCounts = new Map();
        game.players.forEach((p, index) => {
          p.role = roles[index];
          const variant = (roleVariantCounts.get(p.role) || 0) + 1;
          roleVariantCounts.set(p.role, variant);
          p.cardVariant = variant;
          p.resolvedCharacterStyle = normalizeAvalonCharacterStyle(p.characterStyle) === "random"
            ? (crypto.randomInt(2) === 0 ? "male" : "female")
            : p.characterStyle;
        });
        game.leaderIndex = crypto.randomInt(game.players.length);
        game.phase = "team";
        game.turnDeadline = Date.now() + AVALON_TURN_SECONDS * 1000;
        game.assassinId = game.players.find(p => p.role === "Assassin")?.id || null;
        game.players.forEach(p => safeSend(room.clients.get(p.id), { type: "AVALON_ROLE", info: avalonRoleInfo(game, p) }));
        avalonBroadcast(room);
      } else if (action === "PROPOSE" && game.phase === "team" && game.players[game.leaderIndex]?.id === playerId) {
        const team = Array.isArray(message.team) ? [...new Set(message.team.map(id => cleanToken(id, 60)))] : [];
        const required = AVALON_TEAM_SIZES[game.players.length][game.quest];
        if (team.length !== required || team.some(id => !game.players.some(p => p.id === id))) return safeSend(socket, { type: "ERROR", message: `원정대 ${required}명을 선택하세요.` });
        game.selectedTeam = team; game.proposalVotes = {}; game.phase = "proposalVote";
        game.turnDeadline = Date.now() + AVALON_TURN_SECONDS * 1000;
        avalonBroadcast(room);
      } else if (action === "PROPOSAL_VOTE" && game.phase === "proposalVote" && !(playerId in game.proposalVotes)) {
        game.proposalVotes[playerId] = !!message.approve;
        if (Object.keys(game.proposalVotes).length === game.players.length) avalonTallyProposal(room);
        avalonBroadcast(room);
      } else if (action === "QUEST_VOTE" && game.phase === "questVote" && game.selectedTeam.includes(playerId) && !(playerId in game.questVotes)) {
        const evil = ["Assassin", "Morgana", "Mordred", "Oberon", "Minion of Mordred"].includes(player.role);
        game.questVotes[playerId] = evil ? !!message.success : true;
        if (Object.keys(game.questVotes).length === game.selectedTeam.length) avalonTallyQuest(room);
        avalonBroadcast(room);
      } else if (action === "ASSASSINATE" && game.phase === "assassination" && playerId === game.assassinId) {
        const target = game.players.find(p => p.id === cleanToken(message.targetId, 60));
        if (!target) return;
        game.winner = target.role === "Merlin" ? "evil" : "good"; game.phase = "ended"; game.turnDeadline = null;
        avalonRevealRoles(room);
        avalonBroadcast(room);
      }
      return;
    }

    if (type === "CITYCHASE_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.citychase;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        cityChaseError(socket, "경찰과 도둑 방에 참가하지 않았습니다.");
        return;
      }

      let result;
      if (action === "CHOOSE_SEAT") {
        result = CityChase.chooseSeat(game, playerId, cleanToken(message.team, 12), Number(message.slot));
      } else if (action === "RECOMMEND_SEATS") {
        result = playerId === room.hostId ? CityChase.recommendSeats(game) : { ok: false, error: "방장만 추천 배치를 사용할 수 있습니다." };
      } else if (action === "START") {
        result = playerId === room.hostId ? CityChase.startGame(game) : { ok: false, error: "방장만 게임을 시작할 수 있습니다." };
      } else if (action === "PLACE_SECRETS") {
        result = CityChase.placeSecrets(game, playerId, {
          gems: Array.isArray(message.gems) ? message.gems.map(value => cleanToken(value, 30)) : [],
          undercover: cleanToken(message.undercover, 30)
        });
      } else if (action === "ROLL") {
        result = CityChase.roll(game, playerId);
      } else if (action === "MOVE") {
        result = CityChase.moveToDestination(game, playerId, cleanToken(message.nodeId, 30));
      } else if (action === "HIDE") {
        result = CityChase.hide(game, playerId);
      } else if (action === "PLACE_TRICK") {
        result = CityChase.placeTrick(game, playerId, cleanToken(message.nodeId, 30), cleanToken(message.nextNodeId, 30));
      } else if (action === "PLACE_CHECK") {
        result = CityChase.placeCheck(game, playerId, cleanToken(message.nodeId, 30));
      } else if (action === "CHOOSE") {
        result = CityChase.choosePending(game, playerId, cleanToken(message.choiceId, 30));
      } else if (action === "NEW_GAME") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 새 게임을 시작할 수 있습니다." };
        else if (game.phase !== "ended") result = { ok: false, error: "게임이 끝난 뒤 다시 시작할 수 있습니다." };
        else {
          CityChase.resetToLobby(game);
          result = CityChase.startGame(game);
        }
      } else if (action === "RETURN_LOBBY") {
        result = playerId === room.hostId ? CityChase.resetToLobby(game) : { ok: false, error: "방장만 대기실로 돌아갈 수 있습니다." };
      } else {
        result = { ok: false, error: "알 수 없는 행동입니다." };
      }

      if (!result.ok) {
        cityChaseError(socket, result.error || "행동을 처리하지 못했습니다.");
        return;
      }
      cityChaseBroadcast(room);
      return;
    }

    if (type === "GEMGUILD_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.gemguild;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        gemGuildError(socket, "보석 상단 방에 참가하지 않았습니다.");
        return;
      }

      let result;
      if (action === "START") {
        result = playerId === room.hostId
          ? GemGuild.startGame(game)
          : { ok: false, error: "방장만 게임을 시작할 수 있습니다." };
      } else if (action === "TAKE") {
        result = GemGuild.takeGems(game, playerId, message.gems);
      } else if (action === "RESERVE") {
        result = GemGuild.reserveCard(game, playerId, cleanToken(message.cardId, 40), Number(message.tier));
      } else if (action === "BUY") {
        result = GemGuild.buyCard(game, playerId, cleanToken(message.cardId, 40));
      } else if (action === "PASS") {
        result = GemGuild.passTurn(game, playerId);
      } else if (action === "RETURN_GEMS") {
        result = GemGuild.returnGems(game, playerId, message.gems);
      } else if (action === "CHOOSE_PATRON") {
        result = GemGuild.choosePatron(game, playerId, cleanToken(message.patronId, 40));
      } else if (action === "NEW_GAME") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 새 게임을 시작할 수 있습니다." };
        else if (game.phase !== "ended") result = { ok: false, error: "게임이 끝난 뒤 새 게임을 시작할 수 있습니다." };
        else {
          GemGuild.resetToLobby(game);
          result = GemGuild.startGame(game);
        }
      } else if (action === "RETURN_LOBBY") {
        result = playerId === room.hostId
          ? GemGuild.resetToLobby(game)
          : { ok: false, error: "방장만 대기실로 돌아갈 수 있습니다." };
      } else {
        result = { ok: false, error: "알 수 없는 행동입니다." };
      }

      if (!result.ok) {
        gemGuildError(socket, result.error || "행동을 처리하지 못했습니다.");
        return;
      }
      gemGuildBroadcast(room);
      return;
    }

    if (type === "KINGDOMTRAILS_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.kingdomtrails;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        kingdomTrailsError(socket, "왕국의 길 방에 참가하지 않았습니다.");
        return;
      }

      let result;
      if (action === "START") {
        result = playerId === room.hostId
          ? KingdomTrails.startGame(game)
          : { ok: false, error: "방장만 게임을 시작할 수 있습니다." };
      } else if (action === "PLACE") {
        result = KingdomTrails.placeTile(game, playerId, {
          x: message.x,
          y: message.y,
          rotation: message.rotation,
          claim: cleanToken(message.claim, 16) || null
        });
      } else if (action === "NEW_GAME") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 새 게임을 시작할 수 있습니다." };
        else if (game.phase !== "ended") result = { ok: false, error: "게임이 끝난 뒤 새 게임을 시작할 수 있습니다." };
        else result = KingdomTrails.newGame(game);
      } else if (action === "RETURN_LOBBY") {
        result = playerId === room.hostId
          ? KingdomTrails.resetToLobby(game)
          : { ok: false, error: "방장만 대기실로 돌아갈 수 있습니다." };
      } else {
        result = { ok: false, error: "알 수 없는 행동입니다." };
      }

      if (!result.ok) {
        kingdomTrailsError(socket, result.error || "행동을 처리하지 못했습니다.");
        return;
      }
      kingdomTrailsBroadcast(room);
      return;
    }
    if (type === "RUMMIKUB_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.rummikub;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        rummikubError(socket, "숫자 타일 방에 참가하지 않았습니다.");
        return;
      }

      let result;
      if (action === "START") {
        result = playerId === room.hostId
          ? Rummikub.startGame(game)
          : { ok: false, error: "방장만 게임을 시작할 수 있습니다." };
      } else if (action === "PLAY") {
        result = Rummikub.play(game, playerId, message.groups);
      } else if (action === "DRAW") {
        result = Rummikub.draw(game, playerId);
      } else if (action === "NEW_GAME") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 새 게임을 시작할 수 있습니다." };
        else if (game.phase !== "ended") result = { ok: false, error: "게임이 끝난 뒤 새 게임을 시작할 수 있습니다." };
        else {
          Rummikub.resetToLobby(game);
          result = Rummikub.startGame(game);
        }
      } else if (action === "RETURN_LOBBY") {
        result = playerId === room.hostId
          ? Rummikub.resetToLobby(game)
          : { ok: false, error: "방장만 대기실로 돌아갈 수 있습니다." };
      } else {
        result = { ok: false, error: "알 수 없는 행동입니다." };
      }

      if (!result.ok) {
        rummikubError(socket, result.error || "행동을 처리하지 못했습니다.");
        return;
      }
      rummikubBroadcast(room);
      return;
    }

    if (type === "CHESS_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.chess;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        chessError(socket, "체스 방에 참가하지 않았습니다.");
        return;
      }

      let result;
      if (action === "START") {
        result = playerId === room.hostId
          ? Chess.startGame(game, cleanToken(message.timeControl, 20))
          : { ok: false, error: "방장만 대국을 시작할 수 있습니다." };
      } else if (action === "MOVE") {
        result = Chess.move(
          game,
          playerId,
          cleanToken(message.from, 2),
          cleanToken(message.to, 2),
          cleanToken(message.promotion, 1)
        );
      } else if (action === "RESIGN") {
        result = Chess.resign(game, playerId);
      } else if (action === "OFFER_DRAW") {
        result = Chess.offerDraw(game, playerId);
      } else if (action === "ACCEPT_DRAW") {
        result = Chess.answerDraw(game, playerId, true);
      } else if (action === "DECLINE_DRAW") {
        result = Chess.answerDraw(game, playerId, false);
      } else if (action === "REMATCH") {
        result = Chess.requestRematch(game, playerId);
      } else {
        result = { ok: false, error: "알 수 없는 행동입니다." };
      }

      if (!result.ok) {
        chessError(socket, result.error || "행동을 처리하지 못했습니다.");
        return;
      }
      chessBroadcast(room);
      return;
    }

    if (type === "BLOKUS_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.blokus;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        blokusError(socket, "코너 블록 방에 참가하지 않았습니다.");
        return;
      }

      let result;
      if (action === "START") {
        result = playerId === room.hostId
          ? Blokus.startGame(game)
          : { ok: false, error: "방장만 게임을 시작할 수 있습니다." };
      } else if (action === "PLACE") {
        result = Blokus.place(game, playerId, cleanToken(message.pieceId, 10), message.cells);
      } else if (action === "PASS") {
        result = Blokus.pass(game, playerId);
      } else if (action === "NEW_GAME") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 새 게임을 시작할 수 있습니다." };
        else if (game.phase !== "ended") result = { ok: false, error: "게임이 끝난 뒤 새 게임을 시작할 수 있습니다." };
        else {
          Blokus.resetToLobby(game);
          result = Blokus.startGame(game);
        }
      } else if (action === "RETURN_LOBBY") {
        result = playerId === room.hostId
          ? Blokus.resetToLobby(game)
          : { ok: false, error: "방장만 대기실로 돌아갈 수 있습니다." };
      } else {
        result = { ok: false, error: "알 수 없는 행동입니다." };
      }

      if (!result.ok) {
        blokusError(socket, result.error || "행동을 처리하지 못했습니다.");
        return;
      }
      blokusBroadcast(room);
      return;
    }

    if (type === "HONEYCOMB_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.honeycomb;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        honeycombError(socket, "벌집 블록 방에 참가하지 않았습니다.");
        return;
      }

      let result;
      if (action === "START") {
        result = playerId === room.hostId
          ? Honeycomb.startGame(game)
          : { ok: false, error: "방장만 게임을 시작할 수 있습니다." };
      } else if (action === "PLACE") {
        result = Honeycomb.place(game, playerId, cleanToken(message.pieceId, 10), message.cells);
      } else if (action === "PASS") {
        result = Honeycomb.pass(game, playerId);
      } else if (action === "NEW_GAME") {
        if (playerId !== room.hostId) result = { ok: false, error: "방장만 새 게임을 시작할 수 있습니다." };
        else if (game.phase !== "ended") result = { ok: false, error: "게임이 끝난 뒤 새 게임을 시작할 수 있습니다." };
        else {
          Honeycomb.resetToLobby(game);
          result = Honeycomb.startGame(game);
        }
      } else if (action === "RETURN_LOBBY") {
        result = playerId === room.hostId
          ? Honeycomb.resetToLobby(game)
          : { ok: false, error: "방장만 대기실로 돌아갈 수 있습니다." };
      } else {
        result = { ok: false, error: "알 수 없는 행동입니다." };
      }

      if (!result.ok) {
        honeycombError(socket, result.error || "행동을 처리하지 못했습니다.");
        return;
      }
      honeycombBroadcast(room);
      return;
    }

    if (type === "EXPEDITION_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.expedition;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        expeditionError(socket, "탐사대 방에 참가하지 않았습니다.");
        return;
      }

      let result;
      if (action === "SET_THEME") {
        result = playerId === room.hostId
          ? Expedition.setTheme(game, cleanToken(message.theme, 20))
          : { ok: false, error: "방장만 테마를 바꿀 수 있습니다." };
      } else if (action === "START") {
        result = playerId === room.hostId
          ? Expedition.startMatch(game)
          : { ok: false, error: "방장만 게임을 시작할 수 있습니다." };
      } else if (action === "DECIDE") {
        result = Expedition.decide(game, playerId, cleanToken(message.choice, 10));
      } else if (action === "NEXT_ROUND") {
        result = playerId === room.hostId
          ? Expedition.nextRound(game)
          : { ok: false, error: "방장만 다음 라운드를 시작할 수 있습니다." };
      } else if (action === "NEW_GAME") {
        result = playerId === room.hostId
          ? Expedition.newGame(game)
          : { ok: false, error: "방장만 새 게임을 시작할 수 있습니다." };
      } else if (action === "RETURN_LOBBY") {
        if (playerId === room.hostId) {
          Expedition.resetToLobby(game);
          result = { ok: true };
        } else {
          result = { ok: false, error: "방장만 대기실로 돌아갈 수 있습니다." };
        }
      } else {
        result = { ok: false, error: "알 수 없는 행동입니다." };
      }

      if (!result.ok) {
        expeditionError(socket, result.error || "행동을 처리하지 못했습니다.");
        return;
      }
      expeditionBroadcast(room);
      return;
    }

    if (type === "DRAWRELAY_ACTION") {
      const room = socket.meta.roomKey ? rooms.get(socket.meta.roomKey) : null;
      const game = room?.drawrelay;
      const action = cleanToken(message.action, 30);
      if (!room || !game) {
        drawRelayError(socket, "그림 릴레이 방에 참가하지 않았습니다.");
        return;
      }

      let result;
      if (action === "START") {
        result = playerId === room.hostId
          ? DrawRelay.startGame(game, cleanToken(message.packId, 20))
          : { ok: false, error: "방장만 게임을 시작할 수 있습니다." };
      } else if (action === "SUBMIT_DRAWING") {
        result = DrawRelay.submit(game, playerId, { strokes: message.strokes });
      } else if (action === "SUBMIT_GUESS") {
        result = DrawRelay.submit(game, playerId, { text: message.text });
      } else if (action === "RETURN_LOBBY") {
        result = playerId === room.hostId
          ? DrawRelay.resetToLobby(game)
          : { ok: false, error: "방장만 대기실로 돌아갈 수 있습니다." };
      } else {
        result = { ok: false, error: "알 수 없는 행동입니다." };
      }

      if (!result.ok) {
        drawRelayError(socket, result.error || "행동을 처리하지 못했습니다.");
        return;
      }
      drawRelayBroadcast(room);
      return;
    }

    if (type === "GAME_MESSAGE") {
      const key = socket.meta.roomKey;
      const room = key ? rooms.get(key) : null;
      if (!room) {
        safeSend(socket, { type: "ERROR", message: "참여 중인 방이 없습니다." });
        return;
      }

      const packet = {
        type: "GAME_MESSAGE",
        senderId: playerId,
        payload: message.payload
      };

      // Private packets must be routed on the server, never filtered after broadcast.
      const privateHand = room.gameId === "davincicode" && message.payload?.type === "PRIVATE_HAND";
      if (Object.prototype.hasOwnProperty.call(message, "recipientId") || privateHand) {
        if (socket.meta.role !== "host" || playerId !== room.hostId) return;
        const recipientId = String(privateHand ? message.payload.targetId ?? "" : message.recipientId ?? "");
        const recipient = room.clients.get(recipientId);
        if (recipient && recipientId !== playerId) safeSend(recipient, packet);
        return;
      }

      if (socket.meta.role === "host") {
        for (const [id, client] of room.clients) {
          if (id !== playerId) safeSend(client, packet);
        }
      } else {
        safeSend(room.clients.get(room.hostId), packet);
      }
    }
  });

  socket.on("close", code => {
    leaveMuseum(socket);
    leavePark(socket);
    const key = socket.meta.roomKey;
    if (!key) return;

    const room = rooms.get(key);
    if (!room) return;

    const finishDisconnect = () => {
      const currentRoom = rooms.get(key);
      if (!currentRoom || currentRoom.clients.get(playerId) !== socket) return;

      if (socket.meta.role === "host" || playerId === currentRoom.hostId) {
        clearTimeout(currentRoom.drawrelayTimer);
        clearTimeout(currentRoom.expeditionTimer);
        clearTimeout(currentRoom.honeycombTimer);
        clearTimeout(currentRoom.blokusTimer);
        clearTimeout(currentRoom.loveletterTimer);
        clearTimeout(currentRoom.rummikubTimer);
        clearTimeout(currentRoom.gemguildTimer);
        clearTimeout(currentRoom.kingdomtrailsTimer);
        clearTimeout(currentRoom.lastcardTimer);
        clearTimeout(currentRoom.bomb77Timer);
        clearTimeout(currentRoom.codenamesTimer);
        clearTimeout(currentRoom.dobbleTimer);
        clearTimeout(currentRoom.avalonTimer);
        for (const [id, client] of currentRoom.clients) {
          if (id !== playerId) {
            safeSend(client, {
              type: "ROOM_CLOSED",
              playerId
            });
            try { client.close(4002, "HOST_LEFT"); } catch (_) {}
          }
        }
        removeRoom(key);
        return;
      }

      currentRoom.clients.delete(playerId);
      if (currentRoom.avalon) {
        const gameWasActive = currentRoom.avalon.phase !== "lobby";
        currentRoom.avalon.players = currentRoom.avalon.players.filter(player => player.id !== playerId);
        if (gameWasActive) {
          resetAvalonToLobby(currentRoom.avalon);
          avalonNotice(currentRoom, "플레이어가 나가 게임을 중단하고 대기실로 돌아왔습니다.");
        } else if (!currentRoom.avalon.settingsCustomized) {
          currentRoom.avalon.settings = recommendedAvalonSettings(currentRoom.avalon.players.length);
        }
      }
      if (currentRoom.loveletter) {
        const gameWasActive = currentRoom.loveletter.phase !== "lobby";
        LoveLetter.removePlayer(currentRoom.loveletter, playerId);
        if (gameWasActive) {
          LoveLetter.resetToLobby(currentRoom.loveletter, "플레이어가 나가 게임을 중단하고 대기실로 돌아왔습니다.");
        }
      }
      if (currentRoom.lastcard) {
        const gameWasActive = currentRoom.lastcard.phase !== "lobby";
        LastCard.removePlayer(currentRoom.lastcard, playerId);
        if (gameWasActive) {
          LastCard.resetToLobby(currentRoom.lastcard, "플레이어가 나가 게임을 중단하고 대기실로 돌아왔습니다.");
        }
      }
      if (currentRoom.bomb77) {
        const gameWasActive = currentRoom.bomb77.phase !== "lobby";
        Bomb77.removePlayer(currentRoom.bomb77, playerId);
        if (gameWasActive) {
          Bomb77.resetToLobby(currentRoom.bomb77, "플레이어가 나가 게임을 중단하고 대기실로 돌아왔습니다.");
        }
      }
      if (currentRoom.rummikub) {
        const gameWasActive = currentRoom.rummikub.phase !== "lobby";
        Rummikub.removePlayer(currentRoom.rummikub, playerId);
        if (gameWasActive) {
          Rummikub.resetToLobby(currentRoom.rummikub, "플레이어가 나가 게임을 중단하고 대기실로 돌아왔습니다.");
        }
      }
      if (currentRoom.gemguild) {
        const gameWasActive = currentRoom.gemguild.phase !== "lobby";
        GemGuild.removePlayer(currentRoom.gemguild, playerId);
        if (gameWasActive) {
          GemGuild.resetToLobby(currentRoom.gemguild, "플레이어가 나가 게임을 중단하고 대기실로 돌아왔습니다.");
        }
      }
      if (currentRoom.citychase) {
        const gameWasActive = currentRoom.citychase.phase !== "lobby";
        CityChase.removePlayer(currentRoom.citychase, playerId);
        if (gameWasActive) {
          CityChase.resetToLobby(currentRoom.citychase, "플레이어가 나가 게임을 중단하고 대기실로 돌아왔습니다.");
        }
      }
      if (currentRoom.kingdomtrails) {
        const gameWasActive = currentRoom.kingdomtrails.phase !== "lobby";
        KingdomTrails.removePlayer(currentRoom.kingdomtrails, playerId);
        if (gameWasActive) {
          KingdomTrails.resetToLobby(currentRoom.kingdomtrails, "플레이어가 나가 게임을 중단하고 대기실로 돌아왔습니다.");
        }
      }
      if (currentRoom.blokus) {
        const gameWasActive = currentRoom.blokus.phase !== "lobby";
        Blokus.removePlayer(currentRoom.blokus, playerId);
        if (gameWasActive) {
          Blokus.resetToLobby(currentRoom.blokus, "플레이어가 나가 게임을 중단하고 대기실로 돌아왔습니다.");
        }
      }
      if (currentRoom.chess) {
        if (currentRoom.chess.phase === "playing") {
          Chess.resign(currentRoom.chess, playerId);
        } else if (currentRoom.chess.phase === "lobby") {
          Chess.removePlayer(currentRoom.chess, playerId);
        }
      }
      if (currentRoom.honeycomb) {
        const gameWasActive = currentRoom.honeycomb.phase !== "lobby";
        Honeycomb.removePlayer(currentRoom.honeycomb, playerId);
        if (gameWasActive) {
          Honeycomb.resetToLobby(currentRoom.honeycomb, "플레이어가 나가 게임을 중단하고 대기실로 돌아왔습니다.");
        }
      }
      if (currentRoom.expedition) {
        const gameWasActive = currentRoom.expedition.phase !== "lobby";
        Expedition.removePlayer(currentRoom.expedition, playerId);
        // 탐사 중 인원이 빠지면 남은 사람 수로 정원이 깨지므로 대기실로 되돌린다.
        if (gameWasActive && currentRoom.expedition.players.length < Expedition.MIN_PLAYERS) {
          Expedition.resetToLobby(currentRoom.expedition, "플레이어가 나가 게임을 중단하고 대기실로 돌아왔습니다.");
        }
      }
      if (currentRoom.clue) {
        const gameWasActive = currentRoom.clue.phase !== "lobby";
        Clue.removePlayer(currentRoom.clue, playerId);
        if (gameWasActive && currentRoom.clue.players.length < Clue.MIN_PLAYERS) {
          Clue.resetToLobby(currentRoom.clue, "플레이어가 나가 게임을 중단하고 대기실로 돌아왔습니다.");
        }
      }
      if (currentRoom.codenames) {
        const gameWasActive = currentRoom.codenames.phase !== "lobby";
        Codenames.removePlayer(currentRoom.codenames, playerId);
        if (gameWasActive && !Codenames.canStart(currentRoom.codenames)) {
          Codenames.resetToLobby(currentRoom.codenames, "플레이어가 나가 게임을 중단하고 대기실로 돌아왔습니다.");
        }
      }
      if (currentRoom.dobble) {
        const gameWasActive = currentRoom.dobble.phase !== "lobby";
        Dobble.removePlayer(currentRoom.dobble, playerId);
        if (gameWasActive && !Dobble.canStart(currentRoom.dobble)) {
          Dobble.resetToLobby(currentRoom.dobble, "플레이어가 나가 게임을 중단하고 대기실로 돌아왔습니다.");
        }
      }
      if (currentRoom.drawrelay) {
        const gameWasActive = currentRoom.drawrelay.phase !== "lobby";
        DrawRelay.removePlayer(currentRoom.drawrelay, playerId);
        if (gameWasActive) {
          DrawRelay.resetToLobby(currentRoom.drawrelay, "플레이어가 나가 게임을 중단하고 대기실로 돌아왔습니다.");
        }
      }
      if (currentRoom.spelling) {
        const spelling = currentRoom.spelling;
        if (spelling.phase === "lobby" || !spelling.results[playerId]) {
          spelling.players = spelling.players.filter(player => player.id !== playerId);
        }
        if (spelling.phase === "running" && spelling.players.length > 0 && spelling.players.every(player => spelling.results[player.id])) {
          spelling.phase = "ended";
        }
      }
      if (currentRoom.quizrace) Quizrace.removePlayer(currentRoom.quizrace, playerId);
      if (currentRoom.circulation) {
        const circulation = currentRoom.circulation;
        if (circulation.phase === "lobby" || !circulation.results[playerId]) {
          circulation.players = circulation.players.filter(player => player.id !== playerId);
        }
        if (circulation.phase === "running" && circulation.players.length > 0 && circulation.players.every(player => circulation.results[player.id])) {
          circulation.phase = "ended";
        }
      }
      if (currentRoom.digestion) {
        const digestion = currentRoom.digestion;
        if (digestion.phase === "lobby" || !digestion.results[playerId]) {
          digestion.players = digestion.players.filter(player => player.id !== playerId);
        }
        if (digestion.phase === "running" && digestion.players.length > 0 && digestion.players.every(player => digestion.results[player.id])) {
          digestion.phase = "ended";
        }
      }
      if (currentRoom.respiration) {
        const respiration = currentRoom.respiration;
        if (respiration.phase === "lobby" || !respiration.results[playerId]) {
          respiration.players = respiration.players.filter(player => player.id !== playerId);
        }
        if (respiration.phase === "running" && respiration.players.length > 0 && respiration.players.every(player => respiration.results[player.id])) {
          respiration.phase = "ended";
        }
      }
      if (currentRoom.nervous) {
        const nervous = currentRoom.nervous;
        if (nervous.phase === "lobby" || !nervous.results[playerId]) {
          nervous.players = nervous.players.filter(player => player.id !== playerId);
        }
        if (nervous.phase === "running" && nervous.players.length > 0 && nervous.players.every(player => nervous.results[player.id])) {
          nervous.phase = "ended";
        }
      }
      if (currentRoom.immune) {
        const immune = currentRoom.immune;
        if (immune.phase === "lobby" || !immune.results[playerId]) {
          immune.players = immune.players.filter(player => player.id !== playerId);
        }
        if (immune.phase === "running" && immune.players.length > 0 && immune.players.every(player => immune.results[player.id])) {
          immune.phase = "ended";
        }
      }
      if (currentRoom.movement) {
        const movement = currentRoom.movement;
        if (movement.phase === "lobby" || !movement.results[playerId]) {
          movement.players = movement.players.filter(player => player.id !== playerId);
        }
        if (movement.phase === "running" && movement.players.length > 0 && movement.players.every(player => movement.results[player.id])) {
          movement.phase = "ended";
        }
      }
      if (currentRoom.excretion) {
        const excretion = currentRoom.excretion;
        if (excretion.phase === "lobby" || !excretion.results[playerId]) {
          excretion.players = excretion.players.filter(player => player.id !== playerId);
        }
        if (excretion.phase === "running" && excretion.players.length > 0 && excretion.players.every(player => excretion.results[player.id])) {
          excretion.phase = "ended";
        }
      }
      if (currentRoom.temperature) {
        const temperature = currentRoom.temperature;
        if (temperature.phase === "lobby" || !temperature.results[playerId]) {
          temperature.players = temperature.players.filter(player => player.id !== playerId);
        }
        if (temperature.phase === "running" && temperature.players.length > 0 && temperature.players.every(player => temperature.results[player.id])) {
          temperature.phase = "ended";
        }
      }
      safeSend(currentRoom.clients.get(currentRoom.hostId), {
        type: "PLAYER_LEFT",
        playerId
      });

      if (currentRoom.avalon) avalonBroadcast(currentRoom);
      if (currentRoom.lastcard) lastCardBroadcast(currentRoom);
      if (currentRoom.bomb77) bomb77Broadcast(currentRoom);
      if (currentRoom.loveletter) loveLetterBroadcast(currentRoom);
      if (currentRoom.rummikub) rummikubBroadcast(currentRoom);
      if (currentRoom.gemguild) gemGuildBroadcast(currentRoom);
      if (currentRoom.citychase) cityChaseBroadcast(currentRoom);
      if (currentRoom.kingdomtrails) kingdomTrailsBroadcast(currentRoom);
      if (currentRoom.blokus) blokusBroadcast(currentRoom);
      if (currentRoom.chess) chessBroadcast(currentRoom);
      if (currentRoom.honeycomb) honeycombBroadcast(currentRoom);
      if (currentRoom.drawrelay) drawRelayBroadcast(currentRoom);
      if (currentRoom.expedition) expeditionBroadcast(currentRoom);
      if (currentRoom.clue) clueBroadcast(currentRoom);
      if (currentRoom.codenames) codenamesBroadcast(currentRoom);
      if (currentRoom.dobble) dobbleBroadcast(currentRoom);
      if (currentRoom.spelling) spellingBroadcast(currentRoom);
      if (currentRoom.quizrace) quizraceBroadcast(currentRoom);
      if (currentRoom.circulation) circulationBroadcast(currentRoom);
      if (currentRoom.digestion) digestionBroadcast(currentRoom);
      if (currentRoom.respiration) respirationBroadcast(currentRoom);
      if (currentRoom.nervous) nervousBroadcast(currentRoom);
      if (currentRoom.immune) immuneBroadcast(currentRoom);
      if (currentRoom.movement) movementBroadcast(currentRoom);
      if (currentRoom.excretion) excretionBroadcast(currentRoom);
      if (currentRoom.temperature) temperatureBroadcast(currentRoom);

      if (currentRoom.clients.size === 0) removeRoom(key);
    };

    if (Number(code) === 4000) finishDisconnect();
    else socket.meta.disconnectTimer = setTimeout(finishDisconnect, ROOM_RECONNECT_GRACE_MS);
  });
});

const heartbeatTimer = setInterval(() => {
  for (const client of wss.clients) {
    if (client.isAlive === false) {
      try { client.terminate(); } catch (_) {}
      continue;
    }
    client.isAlive = false;
    try { client.ping(); } catch (_) {}
  }
}, 30000);
heartbeatTimer.unref?.();
const roomSnapshotTimer = setInterval(() => {
  for (const room of rooms.values()) void persistRoomSnapshot(room);
}, ROOM_SNAPSHOT_INTERVAL_MS);
roomSnapshotTimer.unref?.();
wss.on("close", () => {
  clearInterval(heartbeatTimer);
  clearInterval(roomSnapshotTimer);
});

// Clue runs server-authoritative turns with a per-turn deadline. Rather than
// scheduling a precise setTimeout per room (more bookkeeping to leak-proof
// across resets/disconnects), a 1s sweep just checks every live room's
// deadline; Clue.forceTimeout() is a no-op until it actually expires.
const clueTimeoutTimer = setInterval(() => {
  for (const room of rooms.values()) {
    if (!room.clue || room.clue.phase !== "playing") continue;
    const result = Clue.forceTimeout(room.clue);
    if (!result.ok) continue;
    for (const reveal of result.reveals || []) {
      safeSend(room.clients.get(reveal.playerId), {
        type: "CLUE_REVEAL",
        reveal: { title: reveal.title, message: reveal.message, card: reveal.card }
      });
    }
    clueBroadcast(room);
  }
}, 1000);
clueTimeoutTimer.unref?.();

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Classroom Game Hub listening on port ${PORT}`);
  console.log("Finisher records use the classroom PostgreSQL database.");
  void classroomPlatform.initialize();
});
