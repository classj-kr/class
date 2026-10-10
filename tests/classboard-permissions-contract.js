// Contract test for 학급 알리미 (class board) permissions.
//
// The board is shared: the homeroom teacher posts the daily 알림장 and subject
// teachers (전담) post to the same class board, so every student sees both in
// one place. That sharing makes the write rules the interesting part -- a
// subject teacher must not be able to wipe the homeroom teacher's posts, and
// must only reach classes in their own school.
//
// `pg` is stubbed (no Postgres in CI). The stub also checks that each query's
// $N placeholders match the parameter array it was handed.
const assert = require("node:assert/strict");
const Module = require("node:module");
const path = require("node:path");
const serverDir = path.join(__dirname, "..", "game-hub-server");
const express = require(path.join(serverDir, "node_modules", "express"));

function assertPlaceholderArity(sql, params) {
  const used = new Set();
  for (const match of String(sql).matchAll(/\$(\d+)/g)) used.add(Number(match[1]));
  if (used.size === 0) return;
  const highest = Math.max(...used);
  const given = Array.isArray(params) ? params.length : 0;
  assert.ok(highest <= given, `SQL uses $${highest} but got ${given} parameter(s):\n${sql}`);
  for (let i = 1; i <= highest; i += 1) {
    assert.ok(used.has(i), `SQL skips $${i}:\n${sql}`);
  }
}

// --- world -----------------------------------------------------------------
// user 1: homeroom teacher of class 100 (3학년 2반)
// user 2: subject teacher (전담, 음악) at the same school
// user 3: student in class 100
// user 4: homeroom teacher whose class is recorded ONLY as a '담임 학급' group
//         (no grade/class on classroom_teachers) -- the dashboard opens by groupId
const TEACHERS = {
  1: { school_id: 5, teacher_type: "homeroom", subject_name: null, teacher_name: "담임", academic_year: 2026, grade: 3, class_number: 2 },
  2: { school_id: 5, teacher_type: "전담", subject_name: "음악", teacher_name: "음악쌤" },
  4: { school_id: 5, teacher_type: "homeroom", subject_name: null, teacher_name: "새담임" }
};
const SCHOOL_CLASSES = [
  { id: "100", grade: 3, class_number: 2, teaching: true },
  { id: "101", grade: 4, class_number: 1, teaching: false }
];
const CLASS_ROWS = {
  "100": { id: 100, grade: 3, class_number: 2 },
  "200": { id: 200, grade: 5, class_number: 1 }
};

let sessionRows = [];
let homeroomGroupRows = [];
let existingClassRows = [];
// 학년-반마다 다른 학급 행을 답해야 할 때(자녀가 둘인 학부모) 쓰는 지도.
let existingClassBySlot = {};
let teacherGroups = [];
let studentGroups = [];
let guardianRows = [];
let guardianGroups = [];
let postDeleteRows = [];
let commentDeleteRows = [];
let unreadRows = [];
const deleteAttempts = [];
const insertedPosts = [];
const readMarks = [];

function answer(sql, params) {
  const text = String(sql);
  if (text.includes("FROM classroom_sessions s")) return { rows: sessionRows };

  // getGuardianChildren(). 학생 조회 가지보다 먼저 봐야 한다 -- 이 질의의 UNION
  // 뒷부분도 school_students/classroom_classes 를 짚어서 거기 먼저 걸린다.
  if (text.includes("guardian1_email") && text.includes("classroom_schools sc")) {
    return { rows: guardianRows };
  }

  // requireTeacher's registration probe
  if (text.includes("classroom_teachers t") && text.includes("sc.enabled = TRUE")) {
    const registration = TEACHERS[Number(params?.[0])];
    return { rows: registration ? [registration] : [] };
  }
  // classboardScope's teacher lookup (by user id or registered google email)
  if (text.includes("FROM classroom_teachers t") && text.includes("LOWER(t.google_email)")) {
    const t = TEACHERS[Number(params?.[0])];
    return { rows: t ? [t] : [] };
  }
  // classIdFromHomeroomGroup: a homeroom assignment that lives only in teacher_groups
  // (the student membership predicate also mentions group_type = 'homeroom', so key
  //  on the teacher_user_id clause that only this lookup has)
  if (text.includes("g.teacher_user_id = $1 AND g.group_type = 'homeroom'")) {
    return { rows: Number(params?.[0]) === 4 ? homeroomGroupRows : [] };
  }
  if (text.includes("SELECT id FROM classroom_classes") && text.includes("academic_year = $2 AND grade = $3")) {
    const slot = existingClassBySlot[`${params?.[2]}-${params?.[3]}`];
    if (slot) return { rows: [{ id: slot }] };
    return { rows: existingClassRows };
  }
  // classboardScope's school-wide class list (subject teacher / admin)
  if (text.includes("EXISTS") && text.includes("school_master_timetable m")) {
    return { rows: SCHOOL_CLASSES.map(c => ({
      id: c.id, grade: c.grade, class_number: c.class_number, teaching: c.teaching
    })) };
  }
  // userClassId -> homeroom teacher's own assignment
  if (text.includes("FROM classroom_teachers") && text.includes("grade IS NOT NULL")) {
    return { rows: Number(params?.[0]) === 1
      ? [{ school_id: 5, academic_year: 2026, grade: 3, class_number: 2, teacher_name: "담임" }]
      : [] };
  }
  if (text.includes("INSERT INTO classroom_classes")) return { rows: [{ id: 100 }] };
  if (text.includes("FROM school_students s") && text.includes("JOIN classroom_classes c")) {
    return { rows: Number(params?.[0]) === 3 ? [{ id: 100 }] : [] };
  }
  // single-class lookup used to label the scope
  if (text.includes("SELECT id, grade, class_number FROM classroom_classes WHERE id")) {
    const row = CLASS_ROWS[String(params?.[0])];
    return { rows: row ? [row] : [] };
  }
  if (text.includes("FROM classroom_classes WHERE id") && text.includes("teacher_user_id")) {
    return { rows: Number(params?.[1]) === 1 ? [{ ok: 1 }] : [] };
  }
  // classboardBoards: groups a teacher runs, or groups a student belongs to
  if (text.includes("FROM teacher_groups g") && text.includes("g.teacher_user_id = $1")) {
    return { rows: teacherGroups };
  }
  // 학부모: 소속이 자녀의 명단 줄에서 나온다.
  if (text.includes("FROM teacher_groups g") && text.includes("guardian1_email")) {
    return { rows: guardianGroups };
  }
  if (text.includes("FROM teacher_groups g") && text.includes("JOIN school_students ss")) {
    return { rows: studentGroups };
  }
  if (text.includes("INSERT INTO classroom_classboard_posts")) {
    insertedPosts.push(params);
    return { rows: [{ id: 7 }] };
  }
  if (text.includes("INSERT INTO classroom_classboard_reads")) {
    readMarks.push(params);
    return { rows: [] };
  }
  if (text.includes("classroom_classboard_reads r")) return { rows: unreadRows };
  if (text.includes("DELETE FROM classroom_classboard_posts")) {
    deleteAttempts.push({ sql: text, params });
    return { rows: postDeleteRows, rowCount: postDeleteRows.length };
  }
  if (text.includes("DELETE FROM classroom_classboard_comments")) {
    deleteAttempts.push({ sql: text, params });
    return { rows: commentDeleteRows, rowCount: commentDeleteRows.length };
  }
  return { rows: [], rowCount: 0 };
}

class FakePool {
  async query(sql, params) {
    assertPlaceholderArity(sql, params);
    return answer(sql, params);
  }
  async connect() {
    return {
      query: async (sql, params) => { assertPlaceholderArity(sql, params); return answer(sql, params); },
      release() {}
    };
  }
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

const platform = createClassroomPlatform({
  databaseUrl: "postgres://stub/stub", googleClientId: "", teacherEmails: "", adminEmails: ""
});

const app = express();
app.use(express.json());
app.use("/api", platform.router);
app.use((error, _req, res, _next) => {
  res.status(error.status || 500).json({ code: error.code, message: error.message });
});

const asHomeroom = () => { sessionRows = [{ id: 1, email: "hr@x.kr", role: "teacher", display_name: "담임" }]; };
const asSubject = () => { sessionRows = [{ id: 2, email: "sub@x.kr", role: "teacher", display_name: "음악쌤" }]; };
const asStudent = () => { sessionRows = [{ id: 3, email: "kid@x.kr", role: "student", display_name: "학생" }]; };
const asGroupOnlyHomeroom = () => { sessionRows = [{ id: 4, email: "new@x.kr", role: "teacher", display_name: "새담임" }]; };

(async () => {
  await platform.initialize();
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const cookie = "class_session=stub";
  const get = (url) => fetch(base + url, { headers: { Cookie: cookie } });
  const post = (url, body) => fetch(base + url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify(body)
  });
  const del = (url) => fetch(base + url, { method: "DELETE", headers: { Cookie: cookie } });

  try {
    // 1. A subject teacher can post at all -- this is what used to fail with
    //    "선생님은 배정된 학급이 없습니다" because they own no homeroom class.
    asSubject();
    insertedPosts.length = 0;
    const subjectPost = await post("/api/classboard/posts", { content: "음악 준비물", classId: "101" });
    assert.equal(subjectPost.status, 200, `Expected 200, got ${subjectPost.status}: ${await subjectPost.clone().text()}`);
    assert.equal(insertedPosts.length, 1, "The subject teacher's post must be stored.");
    // params: (class_id, group_id, author_user_id, content)
    assert.equal(String(insertedPosts[0][0]), "101", "It must land on the class they chose.");
    assert.equal(insertedPosts[0][1], null, "A class post must not also carry a group.");
    assert.equal(insertedPosts[0][2], 2, "The author must be the subject teacher.");

    // 2. They may only post to classes in their own school's list.
    insertedPosts.length = 0;
    const foreign = await post("/api/classboard/posts", { content: "x", classId: "999" });
    assert.equal(foreign.status, 403, "Posting to a class outside the scope must be refused.");
    assert.equal(insertedPosts.length, 0);

    // 3. The homeroom teacher posts to their own class without naming it.
    asHomeroom();
    insertedPosts.length = 0;
    const hrPost = await post("/api/classboard/posts", { content: "알림장" });
    assert.equal(hrPost.status, 200, `Expected 200, got ${hrPost.status}: ${await hrPost.clone().text()}`);
    assert.equal(String(insertedPosts[0][0]), "100", "It must default to their own class.");

    // 3a. 담임 배정이 '내 학급·그룹'의 담임 학급 그룹에만 있는 교사. 대시보드는
    //     그 그룹(groupId)으로 열리는데 게시판은 빈 채였고 글쓰기 칸도 없었다.
    asGroupOnlyHomeroom();
    homeroomGroupRows = [{ school_id: 5, academic_year: 2026, grade: 5, class_number: 1 }];
    existingClassRows = [{ id: 200 }];
    const gb = await get("/api/classboard/boards");
    const gbBody = await gb.json();
    assert.equal(gbBody.boards.length, 1, "그룹으로만 배정된 담임도 자기 반 게시판을 받아야 한다.");
    assert.equal(gbBody.boards[0].label, "5학년 1반", "그룹의 학년·반이 게시판이 된다.");
    assert.equal(gbBody.boards[0].canPost, true, "그 담임은 글을 쓸 수 있어야 한다.");
    insertedPosts.length = 0;
    const gp = await post("/api/classboard/posts", { content: "알림장" });
    assert.equal(gp.status, 200, `Expected 200, got ${gp.status}: ${await gp.clone().text()}`);
    assert.equal(String(insertedPosts[0][0]), "200", "글은 학생이 보는 같은 학급 행에 달려야 한다.");
    homeroomGroupRows = [];
    existingClassRows = [];

    // 3a-2. 같은 담임인데 '담임 학급' 그룹이 자기가 연 그룹 목록으로만 잡히는 경우.
    //       예전에는 교사 게시판 목록이 담임 그룹을 통째로 빼서 게시판이 0개였고,
    //       "담임이 여기 글 어떻게 쓰냐"가 됐다.
    teacherGroups = [{
      id: 56, group_name: "6학년 3반", group_type: "homeroom",
      school_id: 5, academic_year: 2026, grade: 6, class_number: 3
    }];
    existingClassRows = [{ id: 300 }];
    const ob = await get("/api/classboard/boards");
    const obBody = await ob.json();
    assert.equal(obBody.boards.length, 1, "자기가 연 담임 학급 그룹도 게시판이 되어야 한다.");
    assert.equal(obBody.boards[0].kind, "class", "학생이 보는 학급 게시판으로 이어야 한다.");
    assert.equal(obBody.boards[0].label, "6학년 3반");
    assert.equal(obBody.boards[0].canPost, true);
    insertedPosts.length = 0;
    const op = await post("/api/classboard/posts", { content: "알림장" });
    assert.equal(op.status, 200, `Expected 200, got ${op.status}: ${await op.clone().text()}`);
    assert.equal(String(insertedPosts[0][0]), "300", "글은 그 학급 행에 달려야 한다.");
    assert.equal(insertedPosts[0][1], null, "학급 게시판 글에 그룹을 달면 안 된다.");
    teacherGroups = [];
    existingClassRows = [];
    asHomeroom();

    // 3b. 동아리·방과후 게시판. 그룹을 연 교사는 그 게시판에 글을 쓸 수 있고,
    //     글은 학급이 아니라 그룹에 달린다.
    teacherGroups = [{ id: 55, group_name: "오케스트라", group_type: "club" }];
    insertedPosts.length = 0;
    const clubPost = await post("/api/classboard/posts", { content: "합주 안내", board: "group:55" });
    assert.equal(clubPost.status, 200, `Expected 200, got ${clubPost.status}: ${await clubPost.clone().text()}`);
    assert.equal(insertedPosts[0][0], null, "A group post must not carry a class.");
    assert.equal(String(insertedPosts[0][1]), "55", "It must land on the group board.");

    // 3c. 남의 그룹 게시판에는 쓸 수 없다.
    insertedPosts.length = 0;
    const otherGroup = await post("/api/classboard/posts", { content: "x", board: "group:999" });
    assert.equal(otherGroup.status, 403, "Posting to a group you don't run must be refused.");
    assert.equal(insertedPosts.length, 0);
    teacherGroups = [];

    // 4. A subject teacher may not delete someone else's post. The SQL must
    //    carry the author/homeroom condition, not just the class.
    asSubject();
    postDeleteRows = [];
    deleteAttempts.length = 0;
    const badDelete = await del("/api/classboard/posts/7");
    assert.equal(badDelete.status, 403, "Deleting another teacher's post must be refused.");
    // The stub cannot evaluate a WHERE clause, so assert the statement itself
    // still narrows by author/homeroom -- deleting by class alone would let any
    // subject teacher wipe the homeroom teacher's 알림장.
    assert.equal(deleteAttempts.length, 1, "The delete must be attempted once.");
    const deleteSql = deleteAttempts[0].sql;
    assert.match(deleteSql, /author_user_id\s*=\s*\$\d/,
      "The post delete must restrict to the post's author.");
    assert.match(deleteSql, /teacher_user_id\s*=\s*\$\d/,
      "The post delete must also allow that class's homeroom teacher.");

    // 5. When the row does match (own post, or homeroom), the delete succeeds.
    asHomeroom();
    postDeleteRows = [{ id: 7 }];
    const okDelete = await del("/api/classboard/posts/7");
    assert.equal(okDelete.status, 200, "The homeroom teacher may remove a post on their board.");

    // 6. Students cannot post at all.
    asStudent();
    insertedPosts.length = 0;
    const studentPost = await post("/api/classboard/posts", { content: "저요" });
    assert.equal(studentPost.status, 403, "Students must not post to the board.");
    assert.equal(insertedPosts.length, 0);

    // 7. A student's class list is just their own class, and it is read-only.
    const studentClasses = await get("/api/classboard/classes");
    assert.equal(studentClasses.status, 200);
    const sc = await studentClasses.json();
    assert.equal(sc.canPost, false, "Students must not be offered the composer.");
    assert.equal(sc.classes.length, 1, "A student sees exactly their own class.");

    // 8. A subject teacher is offered every class in their school, with the
    //    ones they actually teach first.
    asSubject();
    const subjClasses = await get("/api/classboard/classes");
    const list = await subjClasses.json();
    assert.equal(list.canPost, true);
    assert.equal(list.classes.length, 2, "The subject teacher can switch between classes.");
    assert.equal(list.classes[0].teaching, true, "Classes they teach come first.");

    // 9. A student's board list is their class plus every club / after-school
    //    group they belong to -- the point of the picker.
    asStudent();
    studentGroups = [
      { id: 55, group_name: "오케스트라", group_type: "club" },
      { id: 56, group_name: "방송부", group_type: "afterschool" }
    ];
    unreadRows = [{ board_key: "group:55", unread: "3" }];
    const boardsRes = await get("/api/classboard/boards");
    assert.equal(boardsRes.status, 200);
    const { boards } = await boardsRes.json();
    assert.equal(boards.length, 3, "The student sees their class and both groups.");
    assert.equal(boards[0].kind, "class", "Their own class comes first.");
    assert.deepEqual(
      boards.map(b => b.label),
      ["3학년 2반", "오케스트라", "방송부"],
      "Each board is named for what it is."
    );
    assert.equal(boards[1].typeLabel, "동아리");
    assert.equal(boards[2].typeLabel, "방과후부");
    assert.equal(boards.every(b => b.canPost === false), true, "Students may not post to any board.");

    // 10. Unread counts ride along so the picker can flag boards with new posts.
    assert.equal(boards[1].unreadCount, 3, "The club board reports its unread posts.");
    assert.equal(boards[0].unreadCount, 0, "A board with nothing new stays quiet.");

    // 11. Opening a board marks it read.
    readMarks.length = 0;
    await get("/api/classboard/posts?board=group:55");
    assert.equal(readMarks.length, 1, "Opening a board must record the visit.");
    assert.equal(readMarks[0][1], "group:55", "It must record which board was opened.");

    // 12. A student cannot read a board they don't belong to.
    const foreignBoard = await get("/api/classboard/posts?board=group:777");
    const foreignBody = await foreignBoard.json();
    assert.deepEqual(foreignBody.posts, [], "An unrelated group's board must stay empty.");
    assert.equal(foreignBody.board, null);

    // 13. 그룹 유형 목록은 DB의 CHECK 제약과 정확히 같아야 한다. 전에는 라우트가
    //     'activity'를 받아 주는데 제약에는 없어서, 명단 화면의 '동아리·방과후·셔틀'
    //     선택지로 만든 그룹이 전부 insert 단계에서 터졌다.
    const fs = require("node:fs");
    const platformSource = fs.readFileSync(platformPath, "utf8");
    const constraintTypes = platformSource
      .match(/teacher_groups_group_type_check[\s\S]*?CHECK \(group_type IN \(([^)]*)\)\)/)[1]
      .match(/'([a-z]+)'/g).map(t => t.replace(/'/g, "")).sort();
    const routeTypes = platformSource
      .match(/\[([^\]]*)\]\.includes\(groupType\)/)[1]
      .match(/"([a-z]+)"/g).map(t => t.replace(/"/g, "")).sort();
    assert.deepEqual(routeTypes, constraintTypes,
      "The group-type list the route accepts must match the database CHECK constraint.");

    // 14. 명단 화면이 보내는 유형도 그 목록 안에 있어야 한다.
    const rosterHtml = fs.readFileSync(
      path.join(__dirname, "..", "apps", "classtools", "school-roster.html"), "utf8");
    const typeSelect = rosterHtml.match(/id="newGroupType"[\s\S]*?<\/select>/)[0];
    const offered = [...typeSelect.matchAll(/value="([a-z]+)"/g)].map(m => m[1]);
    assert.ok(offered.length > 0, "The roster must offer group types to pick from.");
    for (const t of offered) {
      assert.ok(constraintTypes.includes(t),
        `The roster offers group type "${t}", which the database would reject.`);
    }
    // 쓰기로 정한 여섯 가지가 모두 있어야 한다.
    for (const t of ["homeroom", "subject", "club", "afterschool", "care", "shuttle"]) {
      assert.ok(offered.includes(t), `그룹 유형 "${t}"를 명단 화면에서 고를 수 있어야 한다.`);
    }

    // 교사용 교실 도구의 개설 창은 갈래를 코드에 박아 두지 않는다. 학교마다
    // 명단의 열이 다르므로, 그 학교에 실제로 있는 열에서 목록을 만든다.
    // 다만 서버로 보내는 갈래 이름은 데이터베이스가 받는 것이어야 한다.
    const hubHtml = fs.readFileSync(
      path.join(__dirname, "..", "apps", "classtools", "index.html"), "utf8");
    const hubSelect = hubHtml.match(/id="modal-group-type"[\s\S]*?<\/select>/)[0];
    assert.doesNotMatch(hubSelect, /<option/,
      "교실 도구가 갈래를 박아 두면 그 학교에 없는 열이 목록에 뜬다.");
    assert.match(hubHtml, /function populateTypeOptions\(\)/,
      "교실 도구는 명단의 열에서 갈래 목록을 만들어야 한다.");
    const hubMap = hubHtml.match(/const COLUMN_TYPE_MAP = \[[\s\S]*?\];/)[0];
    const hubTypes = [...hubMap.matchAll(/'([a-z]+)'\]/g)].map(m => m[1]).concat(["homeroom", "other"]);
    for (const t of hubTypes) {
      assert.ok(constraintTypes.includes(t),
        `교실 도구가 그룹 유형 "${t}"를 보내는데 데이터베이스가 거부한다.`);
    }
    assert.ok(hubTypes.includes("care"), "돌봄 열을 만든 학교는 돌봄반도 개설할 수 있어야 한다.");

    // 그룹 이름 후보는 학교가 등록한 목록에서만 와야 한다. 예시 이름을 채워 넣으면
    // 학교에 없는 이름으로 그룹이 만들어지고 소속 학생이 한 명도 안 잡힌다.
    const availableRoute = platformSource.match(
      /router\.get\("\/teacher\/available-groups"[\s\S]*?\n  \}\)\);/)[0];
    assert.doesNotMatch(availableRoute, /오케스트라|로봇코딩부|축구부|1호차/,
      "개설 목록에 예시 이름을 섞으면 안 된다.");
    assert.match(availableRoute, /readRosterColumns\(schoolId, year\)/,
      "그룹 이름 후보는 학교가 만든 명단 열에서 와야 한다.");

    // 16. 명단 열은 학교가 정의한다. 갈래를 코드에 박아 두면 돌봄이 없는 학교,
    //     걸스카우트가 있는 학교를 담을 수 없다.
    assert.match(platformSource, /CREATE TABLE IF NOT EXISTS school_roster_columns/,
      "명단 열을 담는 표가 있어야 한다.");
    assert.match(platformSource, /slot_count INTEGER NOT NULL DEFAULT 1/,
      "한 학생이 여럿을 가지는 열(방과후)을 위해 칸 수를 저장해야 한다.");

    const rosterJs = rosterHtml;
    assert.doesNotMatch(rosterJs, /schoolSettings\.(clubs|afterschool|care|shuttleSlots)\b/,
      "명단 화면이 갈래를 코드에 박아 두면 안 된다.");
    assert.match(rosterJs, /schoolSettings\.columns/,
      "명단 화면은 학교가 만든 열 목록을 그대로 써야 한다.");

    // 15. 소속 판정은 custom_fields의 '키'가 그룹 이름인 실제 명단 모양을 따라야
    //     한다. 고정된 'club' 키만 보면 어떤 학생도 매칭되지 않는다.
    const memberSql = platformSource.match(/const GROUP_MEMBER_SQL = `[\s\S]*?`;/)[0];

    // 동아리는 전교생을 배정하는 무학년 모임이라 소속이 명단의 사용자 정의 열에서
    // 온다. 학교가 쓰는 두 모양을 모두 받아야 한다.
    assert.match(memberSql, /jsonb_exists\(ss\.custom_fields, g\.group_name\)/,
      "동아리마다 열이 하나씩인 명단({\"오케스트라\":\"O\"})을 인정해야 한다.");
    assert.match(memberSql, /jsonb_each_text\(ss\.custom_fields\)[\s\S]*?f\.value = g\.group_name/,
      "'동아리' 열 하나에 배정한 명단({\"동아리\":\"오케스트라\"})도 인정해야 한다.");

    // 학년·반으로 좁히면 무학년 동아리가 깨진다. homeroom 가지에만 있어야 한다.
    const nonHomeroomBranch = memberSql.split("g.group_type <> 'homeroom'")[1] || "";
    assert.doesNotMatch(nonHomeroomBranch, /ss\.grade|ss\.class_number/,
      "무학년 그룹의 소속을 학년·반으로 좁혀서는 안 된다.");

    assert.doesNotMatch(memberSql, /ILIKE/,
      "Board membership must not fall back to a substring match.");

    // ── 학부모 ──────────────────────────────────────────────────────────
    // 알림장과 가정통신문을 한 곳으로 합치려면 학부모도 자녀 반 게시판을
    // 읽을 수 있어야 한다. 다만 읽기만 한다.
    sessionRows = [{ id: 8, email: "mom@x.kr", role: "user", display_name: "학부모" }];
    guardianRows = [{
      student_id: 21, student_number: "12", student_name: "김철수", academic_year: 2026,
      grade: 5, class_number: 1, school_id: 5, school_name: "테스트초"
    }];
    existingClassRows = [{ id: 200 }];
    guardianGroups = [{ id: 55, group_name: "오케스트라", group_type: "club" }];

    const momBoards = await get("/api/classboard/boards");
    assert.equal(momBoards.status, 200);
    const momBody = await momBoards.json();
    assert.equal(momBody.boards.length, 3,
      "학부모는 가정통신문 칸과 자녀 반, 자녀가 든 그룹 게시판을 받는다.");

    // 가정통신문은 학급 것이 아니다. 업무 담당자가 동아리든 골라 담은 명단이든
    // 원하는 사람에게 보내므로, 우리 반 게시판에 매달지 않고 자기 칸을 둔다.
    assert.equal(momBody.boards[0].kind, "notice", "가정통신문 칸이 맨 앞에 온다.");
    assert.equal(momBody.boards[0].label, "가정통신문",
      "자녀가 하나면 이름을 덧붙이지 않는다.");
    assert.equal(momBody.boards[0].child.studentNumber, "12",
      "어느 아이 앞으로 온 것인지 실려야 그 아이의 통신문을 부를 수 있다.");

    assert.equal(momBody.boards[1].kind, "class");
    assert.equal(momBody.boards[1].id, "200", "학생이 보는 바로 그 학급 게시판이어야 한다.");
    assert.equal(momBody.boards[1].label, "5학년 1반");
    assert.equal(momBody.boards[2].label, "오케스트라",
      "동아리 알림도 학부모가 알아야 한다.");
    assert.equal(momBody.boards.every(b => b.canPost === false), true,
      "학부모는 글을 쓸 수 없다.");

    // 학부모의 댓글은 막는다. 반 전체가 보는 곳이라서.
    const momComment = await post("/api/classboard/posts/7/comments", { content: "감사합니다" });
    assert.equal(momComment.status, 403, "학부모는 댓글도 달 수 없어야 한다.");
    assert.equal((await momComment.json()).error, "READ_ONLY");

    // 자녀가 둘이면 어느 아이 반인지 이름이 붙어야 고를 수 있다.
    guardianRows = [
      { student_id: 21, student_number: "12", student_name: "김철수", academic_year: 2026,
        grade: 5, class_number: 1, school_id: 5, school_name: "테스트초" },
      { student_id: 22, student_number: "3", student_name: "김영희", academic_year: 2026,
        grade: 2, class_number: 4, school_id: 5, school_name: "테스트초" }
    ];
    existingClassBySlot = { "5-1": 200, "2-4": 301 };
    const twoKids = await get("/api/classboard/boards");
    const twoBody = await twoKids.json();
    assert.ok(twoBody.boards[0].label.includes("김철수"),
      `자녀가 둘이면 게시판 이름에 아이 이름이 붙어야 한다. got ${twoBody.boards[0].label}`);
    assert.equal(twoBody.boards.filter(b => b.kind === "notice").length, 2,
      "가정통신문은 아이마다 따로 온다.");
    assert.equal(twoBody.boards.length, 5,
      "아이 둘의 가정통신문 칸 둘 + 반 둘 + 그룹 하나.");
    existingClassBySlot = {};
    guardianRows = [];
    guardianGroups = [];
    existingClassRows = [];

    console.log("Classboard permissions contract: OK");
  } finally {
    server.close();
    Module._load = originalLoad;
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
