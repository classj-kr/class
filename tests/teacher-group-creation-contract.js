// 학급·그룹 개설에 고를 것이 나오는지 본다.
//
// "개설이 안 된다"는 신고는 늘 같은 모양으로 온다 — 드롭다운에 '직접 입력'만
// 남는다. 후보는 전교생 명단에서 오고, 명단은 학년도로 갈라져 있다. 그래서
// 서버가 어느 해를 보는지, 화면이 그 해를 함께 보내는지, 못 받아 왔을 때 까닭을
// 보여 주는지 세 가지를 검사한다. Postgres 가 없어 `pg` 를 스텁으로 갈아끼운다.
const assert = require("node:assert/strict");
const Module = require("node:module");
const path = require("node:path");
const fs = require("node:fs");
const root = path.join(__dirname, "..");
const serverDir = path.join(root, "game-hub-server");
const express = require(path.join(serverDir, "node_modules", "express"));

// 6학년 2반·4반에 학생이 하나씩. 7번 계정은 6학년 4반 담임.
const SCHOOL_ID = 5;
const THIS_YEAR = new Date().getFullYear();
let sessionRows = [{ id: 7, email: "teacher@example.kr", display_name: "담임", role: "teacher" }];
let teacherRows = [{ user_id: 7, school_id: SCHOOL_ID, active: true }];
let studentRows = [
  { school_id: SCHOOL_ID, academic_year: THIS_YEAR, grade: 6, class_number: 2 },
  { school_id: SCHOOL_ID, academic_year: THIS_YEAR, grade: 6, class_number: 4 }
];
let groupRows = [];
let inserted = [];

function answer(sql, params) {
  const text = String(sql);
  if (!Array.isArray(params)) return { rows: [], rowCount: 0 };
  if (text.includes("FROM classroom_sessions s")) return { rows: sessionRows, rowCount: sessionRows.length };
  // 교직원 등록 찾기. 스텁은 문장이 실제로 묻는 것만 답한다 — 이메일로 찾는
  // 갈래가 문장에서 빠지면 스텁도 이메일로 찾아 주지 않아야, 그 갈래를 지웠을 때
  // 검사가 짖는다.
  if (text.includes("FROM classroom_teachers t") && text.includes("sc.enabled = TRUE")) {
    const asksEmail = text.includes("LOWER(t.google_email) = $2");
    const email = asksEmail ? String(params[1] || "").toLowerCase() : "";
    const hit = teacherRows.filter((row) => row.active
      && (String(row.user_id) === String(params[0])
          || (email && String(row.google_email || "").toLowerCase() === email)));
    return { rows: hit, rowCount: hit.length };
  }
  if (text.includes("SELECT DISTINCT grade, class_number FROM school_students")) {
    const hit = studentRows.filter((row) => row.school_id === params[0] && row.academic_year === params[1]);
    const uniq = new Map(hit.map((row) => [`${row.grade}-${row.class_number}`, row]));
    return { rows: [...uniq.values()], rowCount: uniq.size };
  }
  if (text.trim().startsWith("SELECT 1 FROM school_students")) {
    const hit = studentRows.filter((row) => row.school_id === params[0] && row.academic_year === params[1]
      && row.grade === params[2] && row.class_number === params[3]);
    return { rows: hit.slice(0, 1), rowCount: Math.min(hit.length, 1) };
  }
  if (text.includes("FROM school_roster_columns")) return { rows: [], rowCount: 0 };

  // 담임 학급 그룹 자동 만들기
  if (text.includes("SELECT t.school_id, t.grade, t.class_number")) {
    const hit = teacherRows.filter((row) => String(row.user_id) === String(params[0]) && row.active
      && row.grade != null && row.class_number != null
      && (row.academic_year === params[1] || row.academic_year == null));
    return { rows: hit.slice(0, 1), rowCount: Math.min(hit.length, 1) };
  }
  // ON CONFLICT (teacher_user_id, academic_year, group_name) 을 쓰면 그 세 칸에
  // 걸린 UNIQUE 가 없어 Postgres 가 오류를 낸다. 진짜처럼 스텁도 거절한다.
  if (text.includes("INSERT INTO teacher_groups") && text.includes("ON CONFLICT")) {
    const error = new Error("there is no unique or exclusion constraint matching the ON CONFLICT specification");
    error.code = "42P10";
    throw error;
  }
  // 담임 배정이 바뀌어 저절로 만든 옛 학급 그룹 치우기
  if (text.includes("DELETE FROM teacher_groups") && text.includes("auto_homeroom")) {
    const stale = (row) => row.academic_year === params[1] && row.group_type === "homeroom"
      && row.auto_homeroom && (params[2] == null || row.group_name !== params[2]);
    const before = groupRows.length;
    groupRows = groupRows.filter((row) => !stale(row));
    return { rows: [], rowCount: before - groupRows.length };
  }
  if (text.includes("INSERT INTO teacher_groups")) {
    const auto = text.includes("auto_homeroom");
    inserted.push({ school_id: params[0], teacher_user_id: params[1], academic_year: params[2], group_name: params[3], group_type: auto ? "homeroom" : params[4], grade: auto ? params[4] : params[5], class_number: auto ? params[5] : params[6] });
    const row = inserted[inserted.length - 1];
    groupRows.push({ ...row, id: inserted.length, sort_order: 0, student_count: 0, auto_homeroom: auto });
    return { rows: [{ id: inserted.length }], rowCount: 1 };
  }
  if (text.includes("FROM teacher_groups") && text.includes("group_name = $3")) {
    const hit = groupRows.filter((row) => row.academic_year === params[1] && row.group_name === params[2]);
    return { rows: hit.slice(0, 1), rowCount: Math.min(hit.length, 1) };
  }
  if (text.includes("FROM teacher_groups g")) {
    const hit = groupRows.filter((row) => row.academic_year === params[1] && row.school_id === params[2]
      && (row.group_type !== 'homeroom'
        || (row.auto_homeroom ? teacherRows.some(t => t.active && t.school_id === row.school_id && t.grade === row.grade && t.class_number === row.class_number)
          : studentRows.some(s => s.school_id === row.school_id && s.academic_year === row.academic_year && s.grade === row.grade && s.class_number === row.class_number))));
    return { rows: hit, rowCount: hit.length };
  }
  return { rows: [], rowCount: 0 };
}

class FakePool {
  async query(sql, params) { return answer(sql, params); }
  async connect() { return { query: async (s, p) => answer(s, p), release() {} }; }
  on() {}
  async end() {}
}

const originalLoad = Module._load;
Module._load = function stubbedLoad(request, parent, isMain) {
  if (request === "pg") return { Pool: FakePool };
  return originalLoad.call(this, request, parent, isMain);
};
const platformPath = path.join(serverDir, "classroom-platform.js");
delete require.cache[require.resolve(platformPath)];
const { createClassroomPlatform } = require(platformPath);
const platform = createClassroomPlatform({ databaseUrl: "postgres://stub/stub", googleClientId: "", teacherEmails: "", adminEmails: "" });

const app = express();
app.use(express.json());
app.use("/api", platform.router);
app.use((error, _req, res, _next) => res.status(error.status || 500).json({ code: error.code, message: error.message }));

(async () => {
  await platform.initialize();
  const server = app.listen(0);
  await new Promise((r) => server.once("listening", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const get = (url) => fetch(base + url, { headers: { Cookie: "class_session=stub" } });

  try {
    // 1. 명단에 학생이 있으면 그 학급이 후보로 온다.
    const body = await (await get(`/api/teacher/available-groups?year=${THIS_YEAR}`)).json();
    assert.equal(body.homerooms.length, 2, "명단에 있는 학급이 후보로 와야 한다.");
    assert.equal(body.homerooms.map((room) => room.label).join(" "), "6학년 2반 6학년 4반");
    assert.equal(body.homerooms[0].name, "6-2", "그룹 이름은 학년-반 모양이어야 한다.");

    // 2. 학년도가 어긋나면 후보가 비는 자리가 바로 여기다.
    const otherYear = await (await get(`/api/teacher/available-groups?year=${THIS_YEAR - 1}`)).json();
    assert.equal(otherYear.homerooms.length, 0, "다른 해를 물으면 그 해의 명단만 봐야 한다.");

    // 3. 교직원 등록이 없으면 403 이고, 화면은 그 말을 그대로 보여 줄 수 있어야 한다.
    teacherRows = [];
    const blocked = await get(`/api/teacher/available-groups?year=${THIS_YEAR}`);
    assert.equal(blocked.status, 403, "교직원이 아니면 막아야 한다.");
    const message = (await blocked.json()).message;
    assert.ok(message && message.length > 0, "막을 때는 까닭을 함께 보내야 한다.");

    // 3-1. user_id 가 아직 안 붙은 줄(관리자가 이메일로만 올려 둔 계정)도
    //      교직원으로 봐야 한다. user_id 는 그 계정이 새로 구글 로그인을 해야
    //      채워지고, UNIQUE 라서 여러 학교에 등록된 사람은 한 줄에만 붙는다.
    teacherRows = [{
      user_id: null, google_email: "teacher@example.kr", school_id: SCHOOL_ID,
      active: true, grade: 6, class_number: 4, academic_year: null
    }];
    const byEmail = await get(`/api/teacher/available-groups?year=${THIS_YEAR}`);
    assert.equal(byEmail.status, 200, "이메일로만 등록된 교직원도 열람할 수 있어야 한다.");
    assert.equal((await byEmail.json()).homerooms.length, 2,
      "이메일로 찾은 교직원도 자기 학교의 학급을 봐야 한다.");

    // 4. 담임인데 학년도가 비어 있는 옛 줄도 학급 그룹을 받아야 한다.
    teacherRows = [{ user_id: 7, school_id: SCHOOL_ID, active: true, grade: 6, class_number: 4, academic_year: null }];
    groupRows = [];
    inserted = [];
    await get(`/api/teacher/groups?year=${THIS_YEAR}`);
    assert.equal(inserted.length, 1, "학년도가 비어 있어도 담임 학급 그룹은 만들어져야 한다.");
    assert.equal(inserted[0].group_name, "6-4");
    assert.equal(inserted[0].academic_year, THIS_YEAR, "그룹은 지금 보고 있는 해로 만들어야 한다.");

    // 4-1. 담임 배정을 6-4 → 6-2 로 바꾸면 저절로 만든 6-4 카드는 사라져야 한다.
    //      교사가 직접 가져온 학급(자동 표시 없음)은 남아야 한다.
    studentRows.push({ school_id: SCHOOL_ID, academic_year: THIS_YEAR, grade: 6, class_number: 1 });
    groupRows.push({ id: 99, school_id: SCHOOL_ID, teacher_user_id: 7, group_name: "6-1", group_type: "homeroom", grade: 6, class_number: 1, academic_year: THIS_YEAR, sort_order: 0, student_count: 0, auto_homeroom: false });
    teacherRows = [{ user_id: 7, school_id: SCHOOL_ID, active: true, grade: 6, class_number: 2, academic_year: THIS_YEAR }];
    const switched = await (await get(`/api/teacher/groups?year=${THIS_YEAR}`)).json();
    const names = switched.groups.map((g) => g.group_name).sort().join(" ");
    assert.equal(names, "6-1 6-2", "옛 담임 반 그룹은 치우고, 새 반과 직접 가져온 반만 남아야 한다.");

    // 5. 개설할 때 보낸 학년·반과 학년도가 그대로 저장돼야 한다.
    groupRows = [];
    inserted = [];
    const created = await fetch(base + "/api/teacher/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: "class_session=stub" },
      body: JSON.stringify({ groupName: "6-2", groupType: "homeroom", grade: 6, classNumber: 2, year: THIS_YEAR })
    });
    assert.equal(created.status, 200, "학급 그룹을 만들 수 있어야 한다.");
    const savedGroup = inserted[inserted.length - 1];
    assert.equal(savedGroup.grade, 6, "학년을 빼고 저장하면 그 반 학생이 붙지 않는다.");
    assert.equal(savedGroup.class_number, 2, "반을 빼고 저장하면 그 반 학생이 붙지 않는다.");
    assert.equal(savedGroup.academic_year, THIS_YEAR);

    // 5-1. 교직원이면 담임이든 전담이든 아무 그룹이나 열 수 있어야 한다.
    //      담임 학급이 없는 전담 교사로 바꾸고 세 학급을 잇달아 연다.
    teacherRows = [{ user_id: 7, school_id: SCHOOL_ID, active: true, grade: null, class_number: null, academic_year: THIS_YEAR, teacher_type: "전담" }];
    groupRows = [];
    inserted = [];
    for (const name of ["6-2", "6-4"]) {
      const made = await fetch(base + "/api/teacher/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: "class_session=stub" },
        body: JSON.stringify({ groupName: name, groupType: "homeroom", grade: 6, classNumber: Number(name.split("-")[1]), year: THIS_YEAR })
      });
      assert.equal(made.status, 200, `전담 교사도 ${name} 을 열 수 있어야 한다.`);
    }
    assert.equal(inserted.length, 2, "교직원이면 그룹을 여럿 열 수 있어야 한다.");

    // 5-2. 명단에 없는 학급은 거절해야 한다. 그런 그룹에는 붙을 학생이 없다.
    const notInRoster = await fetch(base + "/api/teacher/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: "class_session=stub" },
      body: JSON.stringify({ groupName: "3-9", groupType: "homeroom", grade: 3, classNumber: 9, year: THIS_YEAR })
    });
    assert.equal(notInRoster.status, 400, "명단에 없는 학급은 가져올 수 없어야 한다.");
    assert.equal(inserted.length, 2, "거절한 그룹이 저장되면 안 된다.");

    // 5-3. 같은 이름을 두 번 누르면 같은 그룹을 돌려준다.
    const twice = await fetch(base + "/api/teacher/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: "class_session=stub" },
      body: JSON.stringify({ groupName: "6-2", groupType: "homeroom", grade: 6, classNumber: 2, year: THIS_YEAR })
    });
    assert.equal((await twice.json()).existed, true, "같은 이름으로 두 번 누르면 있던 그룹을 줘야 한다.");
    assert.equal(inserted.length, 2, "같은 그룹이 둘 생기면 안 된다.");

    // 6. 화면 쪽: 학년도를 함께 보내고, 못 받아 왔으면 까닭을 보여 준다.
    const portal = fs.readFileSync(path.join(root, "apps/classtools", "index.html"), "utf8");
    assert.match(portal, /available-groups\?year=\$\{portalYear\}/,
      "교사 포털이 보는 학년도를 함께 보내야 한다. 안 보내면 명단과 다른 해를 볼 수 있다.");
    assert.doesNotMatch(portal, /available-groups'\)\.catch\(\(\) => null\)/,
      "후보를 못 받아 온 까닭을 삼키면 화면에는 '고를 것이 없음'으로만 보인다.");
    assert.match(portal, /id="modal-group-notice"/,
      "왜 고를 것이 없는지 적을 자리가 있어야 한다.");
    assert.match(portal, /availableError = err\.message/,
      "서버가 보낸 까닭을 그대로 보여 줘야 한다.");

    // 7. 갈래 목록은 학교 명단에 실제로 있는 열에서 만들어야 한다.
    assert.doesNotMatch(portal, /<option value="club" selected>/,
      "갈래를 화면에 박아 두면 그 학교에 없는 열이 목록에 뜬다.");
    assert.match(portal, /function populateTypeOptions\(\)/,
      "갈래 목록을 명단의 열에서 만들어야 한다.");
    assert.match(portal, /availableData\.columns \|\| \[\]\)\.forEach\(\(col, index\)/,
      "명단의 열마다 갈래 하나를 만들어야 한다.");
    assert.match(portal, /classNumber: homeroomMatch \? Number\(homeroomMatch\[2\]\) : null/,
      "담임 학급을 만들 때는 학년·반을 함께 보내야 한다.");
    assert.match(portal, /year: portalYear/,
      "그룹을 만들 때도 보고 있는 학년도로 만들어야 한다.");

    // 8. 담임은 자기 학급이 기본으로 하나 있다. 그 카드가 저장된 이름('6-4')
    //    말고 읽는 이름('6학년 4반')으로 보여야 한다.
    assert.match(portal, /const groupLabel = /,
      "학급 그룹은 읽는 이름으로 보여야 한다.");

    // 9. 이 화면에는 --text-main/--text-muted 가 정의돼 있지 않다. 대체색 없이
    //    쓰면 어두운 카드 위에 어두운 글씨가 얹혀 아무것도 안 보인다.
    assert.doesNotMatch(portal, /var\(--text-main\)|var\(--text-muted\)/,
      "정의되지 않은 색 이름을 대체색 없이 쓰면 글씨가 사라진다.");

    console.log("Teacher group creation contract: OK");
  } finally {
    server.close();
    Module._load = originalLoad;
  }
})();
