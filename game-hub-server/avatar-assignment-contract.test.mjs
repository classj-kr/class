import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { createRequire } from "node:module";

const here = path.dirname(fileURLToPath(import.meta.url));
const serverSource = fs.readFileSync(path.join(here, "classroom-platform.js"), "utf8");
const hubServerSource = fs.readFileSync(path.join(here, "server.js"), "utf8");
const profileSource = fs.readFileSync(path.join(here, "..", "classtools", "profile.html"), "utf8");
const avatarDirectory = path.join(here, "..", "classtools", "assets", "avatars");
const avatarFiles = fs.readdirSync(avatarDirectory).filter((name) => name.endsWith(".webp")).sort();
const nodeRequire = createRequire(import.meta.url);
const sandbox = {
  module: { exports: {} },
  exports: {},
  __dirname: here,
  console,
  process,
  Buffer,
  setTimeout,
  clearTimeout,
  require(specifier) {
    if (["crypto", "fs", "path"].includes(specifier)) return nodeRequire(`node:${specifier}`);
    if (specifier === "./student-character-style") return nodeRequire(specifier);
    if (specifier === "express") return {};
    if (specifier === "google-auth-library") return { OAuth2Client: class {} };
    if (specifier === "pg") return { Pool: class {} };
    if (specifier === "./reading-bank") return { createReadingBank: () => ({ router: {} }) };
    if (specifier === "./metacognition") return { createMetacognition: () => ({ router: {}, initialize: async () => {} }) };
    if (specifier === "./voting") return { createVoting: () => ({ router: {}, initialize: async () => {}, hasRoomCode: async () => false, hasQuizRaceCode: async () => false }) };
    if (specifier === "./seating") return { createSeating: () => ({ router: {}, initialize: async () => {}, hasRoomCode: async () => false, resolveCode: async () => null }) };
    if (specifier === "./school-election") return { createSchoolElection: () => ({ router: {}, initialize: async () => {}, hasRoomCode: async () => false, resolveCode: async () => null }) };
    throw new Error(`Unexpected dependency: ${specifier}`);
  }
};

vm.createContext(sandbox);
vm.runInContext(serverSource, sandbox, { filename: path.join(here, "classroom-platform.js") });
const platform = sandbox.module.exports;

test("the final avatar catalog contains 152 unique WebP files", () => {
  assert.equal(avatarFiles.length, 152);
  assert.equal(new Set(avatarFiles).size, 152);
  assert.deepEqual([...platform.AVATAR_KEYS].sort(), avatarFiles);
  assert.match(hubServerSource, /app\.use\("\/assets\/avatars"/);
});

test("legacy PNG avatar keys normalize to WebP", () => {
  assert.equal(platform.normalizeAvatarKey("animal-tiger.png"), "animal-tiger.webp");
  assert.equal(platform.normalizeAvatarKey("animal-tiger.webp"), "animal-tiger.webp");
  assert.equal(platform.normalizeAvatarKey("animal-hippopotamus-02.webp"), "animal-hippopotamus.webp");
  assert.equal(platform.normalizeAvatarKey("animal-crocodile-02.webp"), "animal-crocodile.webp");
  assert.equal(platform.normalizeAvatarKey("food-sushi-roll.webp"), "food-gimbap.webp");
});
test("avatar capacity increases at 153 and 305 students", () => {
  assert.equal(platform.avatarCapacity(1), 1);
  assert.equal(platform.avatarCapacity(152), 1);
  assert.equal(platform.avatarCapacity(153), 2);
  assert.equal(platform.avatarCapacity(304), 2);
  assert.equal(platform.avatarCapacity(305), 3);
});

test("avatar change windows follow Korea time", () => {
  assert.equal(platform.avatarChangeWindow(new Date("2026-03-01T03:00:00Z")).period, "first");
  assert.equal(platform.avatarChangeWindow(new Date("2026-07-31T03:00:00Z")).period, "first");
  assert.equal(platform.avatarChangeWindow(new Date("2026-08-01T03:00:00Z")).period, "second");
  assert.equal(platform.avatarChangeWindow(new Date("2026-12-31T03:00:00Z")).period, "second");
  assert.equal(platform.avatarChangeWindow(new Date("2026-02-15T03:00:00Z")).period, null);
});

test("roster save persists a random available avatar without replacing an existing one", () => {
  assert.match(serverSource, /pickRandomAvailableAvatar\(avatarUsageCounts, maximumAvatarUses\)/);
  assert.match(serverSource, /avatar_key = COALESCE\(classroom_students\.avatar_key, EXCLUDED\.avatar_key\)/);
  assert.match(serverSource, /pg_advisory_xact_lock/);
});

test("student profile offers a confirmed, server-enforced avatar change", () => {
  assert.match(serverSource, /router\.patch\("\/student\/avatar"/);
  assert.match(serverSource, /AVATAR_CHANGE_ALREADY_USED/);
  assert.match(serverSource, /AVATAR_UNAVAILABLE/);
  assert.match(profileSource, /id="recommendedAvatars"/);
  assert.match(profileSource, /id="toggleAllAvatars"/);
  assert.match(profileSource, /\/api\/student\/avatar/);
});
