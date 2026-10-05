import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const gamesRoot = path.join(root, "learning", "games");
const modeId = /id="(?:joinTab|joinMode|join-tab|join-mode-btn)"/;
const modeButton = /<button\b[^>]*id="(?:joinTab|joinMode|join-tab|join-mode-btn)"[^>]*>([\s\S]*?)<\/button>/i;
const actionButton = /<button\b[^>]*id="(?:joinBtn|join|join-room-btn)"[^>]*>([\s\S]*?)<\/button>/i;

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filepath = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(filepath);
    return entry.isFile() && entry.name.endsWith(".html") ? [filepath] : [];
  });
}

const stripTags = value => value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const lobby = fs.readFileSync(path.join(root, "assets", "network", "multiplayer-lobby.js"), "utf8");
const sharedLobbyScript = /<script\b[^>]*multiplayer-lobby\.js/;
// 로비 단추 문구는 영어로 통일했다(공용 로비가 mount 때 써 넣는다).
const MODE_LABEL = "Join Room";
const ACTION_LABEL = "Join";

test("every multiplayer lobby distinguishes mode selection from joining", () => {
  const audited = [];
  const sharedLobbyPages = [];

  for (const filepath of htmlFiles(gamesRoot)) {
    const html = fs.readFileSync(filepath, "utf8");
    const page = path.relative(root, filepath);
    if (sharedLobbyScript.test(html)) sharedLobbyPages.push(page);
    if (!modeId.test(html)) continue;

    const mode = html.match(modeButton);
    const action = html.match(actionButton);
    assert.ok(mode, `${page}: 방 번호 입력 모드 선택이 필요합니다.`);
    assert.ok(action, `${page}: 실제 참가 버튼이 필요합니다.`);
    assert.notEqual(stripTags(mode[1]), stripTags(action[1]), `${page}: 같은 버튼 문구를 두 번 쓰면 안 됩니다.`);
    // 공용 로비를 기본 id(joinTab·joinBtn)로 쓰는 화면은 mount 때 문구·role·aria-label이 덮어 써진다.
    // 그렇지 않은 화면은 HTML에 직접 적혀 있어야 한다.
    const stamped = sharedLobbyScript.test(html) && /id="joinTab"/.test(mode[0]) && /id="joinBtn"/.test(action[0]);
    assert.ok(stripTags(mode[1]) === MODE_LABEL || stamped, `${page}: 모드 선택 문구는 ‘${MODE_LABEL}’이어야 합니다.`);
    assert.ok(stripTags(action[1]) === ACTION_LABEL || stamped, `${page}: 실제 실행 버튼은 ‘${ACTION_LABEL}’이어야 합니다.`);
    assert.ok(/role="tab"/.test(mode[0]) || stamped, `${page}: 모드 선택은 role="tab"이어야 합니다.`);
    assert.ok(/aria-label="방 번호 입력 방식 선택"/.test(mode[0]) || stamped, `${page}: 모드 선택의 aria-label이 필요합니다.`);
    assert.ok(/aria-label="입력한 방 번호로 참가"/.test(action[0]) || stamped, `${page}: 참가 버튼의 aria-label이 필요합니다.`);
    audited.push(page);
  }

  // 전수 조사: 공용 로비를 싣는 게임 화면은 하나도 빠짐없이 위 검사를 거쳐야 한다.
  assert.ok(audited.length >= 26, `멀티플레이 로비 전수 조사 수가 줄었습니다: ${audited.length}`);
  assert.deepEqual(sharedLobbyPages.filter(page => !audited.includes(page)), [], "공용 로비를 쓰는데 조사에서 빠진 화면이 있습니다.");
});

test("shared lobby prevents duplicate join controls in future games", () => {
  const modeLabel = /joinTab\.textContent = "([^"]+)"/.exec(lobby);
  const actionLabel = /joinButton\.textContent = "([^"]+)"/.exec(lobby);
  assert.equal(modeLabel?.[1], MODE_LABEL);
  assert.equal(actionLabel?.[1], ACTION_LABEL);
  assert.notEqual(modeLabel[1], actionLabel[1], "모드 선택과 실행 버튼 문구가 같으면 안 됩니다.");
  assert.match(lobby, /joinTab\.setAttribute\("role", "tab"\)/);
  assert.match(lobby, /joinTab\.setAttribute\("aria-label", "방 번호 입력 방식 선택"\)/);
  assert.match(lobby, /joinButton\.setAttribute\("aria-label", "입력한 방 번호로 참가"\)/);
  assert.match(lobby, /setAttribute\("aria-selected"/);
});
