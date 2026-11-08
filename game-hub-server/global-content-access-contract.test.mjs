import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const serverSource = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");
const hubServerSource = await readFile(new URL("./server.js", import.meta.url), "utf8");
const indexSource = await readFile(new URL("../index.html", import.meta.url), "utf8");
const backNavigationSource = await readFile(new URL("../assets/site-back-navigation.js", import.meta.url), "utf8");
const mainScriptMatch = indexSource.match(/<script>\s*(\(\(\) => \{[\s\S]*?\}\)\(\);)\s*<\/script>/);

assert.ok(mainScriptMatch, "The home screen's main script must be extractable.");
assert.doesNotThrow(() => new Function(backNavigationSource), "The shared page guard must remain valid JavaScript.");
assert.doesNotThrow(
  () => new Function(mainScriptMatch[1]),
  "The home screen's main script must remain valid JavaScript.",
);

const { isMenuDisabled } = await import("./home-content-paths.js").then(module => module.default);
assert.equal(isMenuDisabled("/learning/games/example/play", ["/learning/games/example"]), true);
assert.equal(isMenuDisabled("/learning/games/example-two", ["/learning/games/example"]), false);
assert.equal(isMenuDisabled("/learning/games/dobble/dobble", ["/learning/games/spot-match"]), true);
assert.equal(isMenuDisabled("/learning/inquiry/globe/history", ["/learning/inquiry/globe"]), false);

assert.match(
  serverSource,
  /CREATE TABLE IF NOT EXISTS site_content_disabled \([\s\S]*content_path TEXT PRIMARY KEY/,
  "Global content locks must be stored independently from per-class settings.",
);
assert.match(
  serverSource,
  /router\.put\("\/admin\/home-content-access"[\s\S]*requireAdmin\(req\)[\s\S]*site_content_disabled/,
  "Only the site administrator may update global content locks.",
);
assert.match(
  serverSource,
  /user\?\.role !== "admin" && requestPath && isGloballyDisabledContent\(requestPath, assetRootPath, globallyDisabledPaths\)[\s\S]*CONTENT_GLOBALLY_DISABLED/,
  "Globally disabled content must block direct requests for non-admin users while allowing the site administrator.",
);
assert.match(
  serverSource,
  /const canManageGlobally = user\?\.role === "admin";[\s\S]*globallyDisabledPaths,[\s\S]*canManageGlobally/,
  "The home access response must expose both global state and administrator capability.",
);

const guestSubmitStart = indexSource.indexOf("guestForm.addEventListener('submit'");
const guestSubmitEnd = indexSource.indexOf("signOutButton.addEventListener", guestSubmitStart);
assert.ok(guestSubmitStart >= 0 && guestSubmitEnd > guestSubmitStart, "The guest submit handler must be extractable.");
const guestSubmitSource = indexSource.slice(guestSubmitStart, guestSubmitEnd);
assert.match(
  guestSubmitSource,
  /await loadClassContentAccess\(\);\s*hubContent\.hidden = false;/,
  "A newly authenticated guest must load and render global locks before the hub is released.",
);
assert.match(
  backNavigationSource,
  /location\.replace\("\/\?content=globally-disabled"\)[\s\S]*setInterval\(enforceGlobalContentAccess, GLOBAL_CONTENT_ACCESS_POLL_MS\)/,
  "Already-open learning pages must poll the global lock and leave disabled content.",
);
assert.match(
  hubServerSource,
  /MULTIPLAYER_CONTENT_PATHS[\s\S]*canBypassGlobalContentLock\(request\)[\s\S]*isContentGloballyDisabled\(requestedContentPath\)[\s\S]*CONTENT_GLOBALLY_DISABLED/,
  "Multiplayer traffic must enforce global locks independently of the browser UI.",
);

const roomLimitsStart = hubServerSource.indexOf("const MAX_ROOM_PLAYERS");
const roomMapsEnd = hubServerSource.indexOf("const FINISHER_GAMES", roomLimitsStart);
assert.ok(roomLimitsStart >= 0 && roomMapsEnd > roomLimitsStart, "Multiplayer lock mappings must be extractable.");
const roomAccessRuntime = new Function(
  `${hubServerSource.slice(roomLimitsStart, roomMapsEnd)}\nreturn { MAX_ROOM_PLAYERS, MULTIPLAYER_CONTENT_PATHS };`,
)();
assert.deepEqual(
  Object.keys(roomAccessRuntime.MULTIPLAYER_CONTENT_PATHS).sort(),
  Object.keys(roomAccessRuntime.MAX_ROOM_PLAYERS).sort(),
  "Every multiplayer game must map to the menu path controlled by the global lock.",
);

assert.match(
  indexSource,
  /id="globalContentAccessButton"[\s\S]*전체 메뉴\/게임 사용 중지 설정/,
  "The home screen must expose a site-administrator control.",
);
assert.match(indexSource, /\u2705 \uC0AC\uC6A9 \uC911\uC9C0 \uBC84\uD2BC \uC120\uD0DD \uB05D\uB0B4\uAE30/,
  "The active administrator control must say that it ends button selection, not that every item is already disabled.");
assert.match(
  indexSource,
  /\.is-global-locked[\s\S]*background: linear-gradient\(135deg, rgba\(53, 58, 61, 0\.97\), rgba\(31, 34, 36, 0\.98\)\)[\s\S]*filter: none !important/,
  "A globally disabled menu must render as a legible, nearly opaque gray card.",
);
assert.doesNotMatch(
  indexSource,
  /filter: grayscale\(100%\) opacity\(/,
  "Disabled menu cards must not fade their text and background with whole-card opacity.",
);
assert.match(
  indexSource,
  /canBypassGlobalContentLock = result\.canManageGlobally === true;[\s\S]*classContentAccessApplies = result\.hasClassAccess === true && !result\.canManage && !canBypassGlobalContentLock;/,
  "The home screen must recognize that the site administrator bypasses global and class menu locks.",
);
assert.match(
  indexSource,
  /const globallyLocked = globallyDisabled && !canBypassGlobalContentLock;[\s\S]*link\.dataset\.globalLocked = String\(globallyLocked\);/,
  "A globally disabled menu must remain clickable for the site administrator while staying blocked for everyone else.",
);
assert.match(
  indexSource,
  /if \(selectedLink\.dataset\.globalLocked === 'true'\) \{\s*event\.preventDefault\(\);/,
  "A globally disabled menu click must be cancelled only when the current viewer cannot bypass it.",
);
assert.match(
  indexSource,
  /api\(global \? '\/api\/admin\/home-content-access' : '\/api\/teacher\/home-content-access',[\s\S]*disabled: nextDisabled/,
  "The administrator edit mode must persist global disabled state.",
);
assert.match(
  indexSource,
  /classList\.toggle\('is-class-locked', classLocked && !showGlobalDisabled\)/,
  "A visible global disabled state must take visual priority over the homeroom lock.",
);

console.log("Global content access contract passed.");
