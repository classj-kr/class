import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = relativePath => fs.readFileSync(path.join(root, relativePath), "utf8");

test("site pages receive one shared icon-only back control", () => {
  const server = read("game-hub-server/server.js");
  const navigation = read("assets/site-back-navigation.js");

  assert.match(server, /SITE_BACK_SCRIPT_TAG[\s\S]*site-back-navigation\.js/);
  assert.match(server, /SITE_SFX_SCRIPT_TAG[\s\S]*sound\/game-sfx\.js/);
  assert.match(server, /SITE_SFX_SCRIPT_TAG = '<script[^']*src="\/assets\/sound\/game-sfx\.js\?v=\d{8}-[\w-]+"/);
  assert.match(server, /htmlWithBackNavigation\.includes\("\/assets\/sound\/game-sfx\.js"\)/);
  assert.match(server, /sendSiteHtml\(req, res, indexCandidate, next\)/);
  assert.match(server, /sendSiteHtml\(req, res, candidate, next\)/);
  assert.match(server, /"\/classboard"/);

  assert.match(navigation, /aria-label="뒤로 가기"/);
  assert.match(navigation, /width: 44px/);
  assert.match(navigation, /height: 44px/);
  assert.match(navigation, /border-radius: 50%/);
  assert.doesNotMatch(navigation, />\s*메인\s*</);
});

test("back control climbs from an active game to its lobby first", () => {
  const navigation = read("assets/site-back-navigation.js");
  const lobby = read("assets/network/multiplayer-lobby.js");

  assert.match(navigation, /new CustomEvent\("sitebackrequest"/);
  // The lobby always handles the request itself: it leaves the room, then an active
  // game reloads into its lobby and the lobby steps back to the site home.
  assert.match(
    lobby,
    /this\._boundSiteBack = event => \{\s*const playing = typeof this\.options\.isGameActive === "function"\s*\? this\.options\.isGameActive\(\) : this\.started;\s*event\.preventDefault\(\);\s*this\.destroy\(\);\s*if \(playing\) location\.reload\(\);\s*else location\.href = "\/";\s*\};/
  );
  assert.match(lobby, /window\.addEventListener\("sitebackrequest", this\._boundSiteBack\)/);
  assert.match(lobby, /leaveButton\.dataset\.siteBackLegacy = "true"/);
});

test("sound controls collapse into a top-right speaker with vertical sliders", () => {
  const control = read("assets/sound/music-control.js");
  const styles = read("assets/sound/music-control.css");

  assert.match(control, /unified-audio-menu-toggle/);
  assert.match(control, /unified-audio-panel[^>]*hidden/);
  assert.match(styles, /right: max\(12px, env\(safe-area-inset-right\)\)/);
  assert.match(styles, /writing-mode: vertical-lr/);
  assert.match(styles, /\.unified-audio-panel\[hidden\]/);
});

test("space activities no longer link to the retired space hub", () => {
  for (const activity of ["solar-system", "constellations", "earth-moon"]) {
    const html = read(`learning/inquiry/space/${activity}/index.html`);
    assert.doesNotMatch(html, /우주 관찰 메인/);
    assert.doesNotMatch(html, /space-home-btn/);
  }
});
