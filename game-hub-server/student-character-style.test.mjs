import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

const require = createRequire(import.meta.url);
const { createStudentCharacterStyleResolver } = require("./student-character-style");

test("character styles use the authenticated student's actual roster gender", async t => {
  const db = new PGlite();
  t.after(() => db.close());
  await db.exec(`
    CREATE TABLE school_students (id BIGINT PRIMARY KEY, user_id BIGINT, academic_year INTEGER, gender TEXT);
    CREATE TABLE classroom_classes (id BIGINT PRIMARY KEY, academic_year INTEGER);
    CREATE TABLE classroom_students (id BIGINT PRIMARY KEY, user_id BIGINT, class_id BIGINT, gender TEXT);
    INSERT INTO classroom_classes VALUES (1, 2026), (2, 2025);
    INSERT INTO school_students VALUES
      (1, 21, 2026, '남'), (2, 22, 2026, '여'),
      (3, 25, 2026, NULL), (4, 26, 2026, ''), (5, 27, 2026, 'unknown'),
      (6, 28, 2025, '남'), (7, 29, 2026, '여');
    INSERT INTO classroom_students VALUES
      (1, 23, 1, '남'), (2, 24, 1, '여'),
      (3, 28, 1, '여'), (4, 29, 1, '남');
  `);
  // Authentication is a fixture boundary; roster queries run in real PostgreSQL.
  const resolve = createStudentCharacterStyleResolver({
    pool: db, sessionUser: async request => request.authenticatedUser || null
  });
  const asUser = (id, role = "student") => ({ authenticatedUser: { id, role } });

  await t.test("both genders are read from the school-wide roster", async () => {
    assert.equal(await resolve(asUser(21)), "male");
    assert.equal(await resolve(asUser(22)), "female");
  });
  await t.test("legacy classroom rosters work for both genders", async () => {
    assert.equal(await resolve(asUser(23)), "male");
    assert.equal(await resolve(asUser(24)), "female");
  });
  await t.test("teachers, guests and accounts without a student row use random", async () => {
    assert.equal(await resolve(asUser(10, "teacher")), "random");
    assert.equal(await resolve(asUser(11, "admin")), "random");
    assert.equal(await resolve({}), "random");
    assert.equal(await resolve(asUser(99)), "random");
  });
  await t.test("missing or unknown gender is never guessed", async () => {
    for (const id of [25, 26, 27]) assert.equal(await resolve(asUser(id)), "random");
  });
  await t.test("newest school year wins, with school roster preferred within the same year", async () => {
    assert.equal(await resolve(asUser(28)), "female");
    assert.equal(await resolve(asUser(29)), "female");
  });
  await t.test("student membership still works for an account with a sticky non-student role", async () => {
    assert.equal(await resolve(asUser(22, "guardian")), "female");
  });
  await t.test("client names, account ids and style hints cannot override the session", async () => {
    const forged = { name: "학생이름", userId: 22, gender: "여", characterStyle: "female" };
    assert.equal(await resolve(forged), "random");
    assert.equal(await resolve({ ...forged, ...asUser(21) }), "male");
  });
});

test("local operation without a database stays random", async () => {
  const resolve = createStudentCharacterStyleResolver({
    pool: null, sessionUser: async () => { throw new Error("No database lookup expected"); }
  });
  assert.equal(await resolve({}), "random");
});

test("an unauthenticated guest does not trigger a roster query", async () => {
  const resolve = createStudentCharacterStyleResolver({
    pool: { query() { throw new Error("No student query expected"); } },
    sessionUser: async () => null
  });
  assert.equal(await resolve({ characterStyle: "male" }), "random");
});

test("Avalon uses server identity on create/join and removes the character picker", async () => {
  const server = await readFile(new URL("./server.js", import.meta.url), "utf8");
  const page = await readFile(new URL("../learning/games/avalon/avalon.html", import.meta.url), "utf8");
  assert.doesNotMatch(server, /message\.characterStyle/);
  assert.equal((server.match(/gameId === "avalon" \? await getAvalonCharacterStyle\(\)/g) || []).length, 2);
  assert.match(server, /getStudentCharacterStyle\(request\)\.catch/);
  assert.doesNotMatch(page, /characterPicker|name="characterStyle"|selectedCharacterStyle|캐릭터 스타일을 고른/);
  const publicState = server.slice(server.indexOf("function avalonPublicState("), server.indexOf("function avalonBroadcast("));
  assert.doesNotMatch(publicState, /gender|characterStyle|resolvedCharacterStyle/);
});


test("every male/female role card and repeated-role variant resolves to an existing image", async () => {
  const page = await readFile(new URL("../learning/games/avalon/avalon.html", import.meta.url), "utf8");
  const source = page.slice(page.indexOf("const ROLE_CARD_FILES="), page.indexOf("function renderSecret()"));
  const cardPath = new Function(source + "; return roleCardImagePath;")();
  const roles = ["Merlin", "Percival", "Assassin", "Morgana", "Mordred", "Oberon", "Loyal Servant", "Minion of Mordred"];
  for (const role of roles) {
    const variants = role === "Loyal Servant" ? 4 : role === "Minion of Mordred" ? 2 : 1;
    for (const characterStyle of ["male", "female"]) {
      for (let cardVariant = 1; cardVariant <= variants; cardVariant++) {
        const pathname = cardPath({ role, characterStyle, cardVariant });
        assert.ok(pathname.includes("-" + characterStyle));
        await access(new URL(".." + pathname, import.meta.url));
      }
    }
  }
});
