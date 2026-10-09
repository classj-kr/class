import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createAssessmentPlans, cleanItems, planKey, LEVEL_LABELS } = require("./assessment-plans.js");

class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

// 학교 10: 1은 5학년 2반 담임, 6은 5학년 1반 담임, 2는 영어 전담(5·6학년), 5는 교감(반도 과목도 없음,
// 전담 시간표에 3학년 음악만 들어가 있음). 학교 20: 3은 5학년 담임. 4는 등록이 없다.
const TEACHERS = {
  1: { id: 101, school_id: 10, school_name: "가 초등학교", grade: 5, class_number: 2, teacher_name: "교사 하나" },
  6: { id: 106, school_id: 10, school_name: "가 초등학교", grade: 5, class_number: 1, teacher_name: "교사 여섯" },
  2: { id: 102, school_id: 10, school_name: "가 초등학교", grade: null, class_number: null, teacher_name: "교사 둘" },
  5: { id: 105, school_id: 10, school_name: "가 초등학교", grade: null, class_number: null, teacher_name: "교감" },
  3: { id: 103, school_id: 20, school_name: "나 초등학교", grade: 5, class_number: 1, teacher_name: "교사 셋" },
  4: null
};

async function startServer() {
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite();
  await db.exec(`
    CREATE TABLE classroom_schools (id BIGINT PRIMARY KEY);
    INSERT INTO classroom_schools VALUES (10), (20);
    CREATE TABLE classroom_users (id BIGINT PRIMARY KEY, display_name TEXT);
    INSERT INTO classroom_users VALUES (1, '교사 하나'), (2, '교사 둘'), (3, '교사 셋'), (4, '교사 넷'), (5, '교감'), (6, '교사 여섯');
    CREATE TABLE classroom_teachers (id BIGINT PRIMARY KEY, school_id BIGINT, teaching_scope JSONB);
    INSERT INTO classroom_teachers VALUES (101, 10, NULL), (106, 10, NULL), (102, 10, '[{"grade":5,"subject":"영어"},{"grade":6,"subject":"영어"}]'), (105, 10, NULL), (103, 20, NULL);
    CREATE TABLE school_master_timetable (id BIGSERIAL PRIMARY KEY, school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER, day_of_week INTEGER, period INTEGER, subject_name TEXT, teacher_user_id BIGINT);
    INSERT INTO school_master_timetable (school_id, academic_year, grade, class_number, day_of_week, period, subject_name, teacher_user_id) VALUES (10, 2026, 3, 1, 1, 1, '음악', 5), (10, 2025, 4, 1, 1, 1, '미술', 5);
  `);
  const pool = { query: (sql, params) => db.query(sql, params) };
  await db.exec(await (await import('node:fs/promises')).readFile(new URL('./migrations/011-school-textbooks.sql', import.meta.url), 'utf8'));
  const plans = createAssessmentPlans({
    pool, requireDatabase() {}, HttpError, asyncRoute,
    async requireTeacher(req) {
      const who = req.get("x-test-user") || "";
      if (TEACHERS[who] !== undefined) return { id: Number(who) };
      throw new HttpError(401, "AUTH_REQUIRED", "로그인");
    },
    async teacherRegistration(user) { return TEACHERS[user.id]; }
  });
  await plans.initialize();
  await plans.initialize(); // 다시 띄워도 괜찮아야 한다
  const app = express();
  app.use(express.json({ limit: "512kb" }));
  app.use("/api/teacher/assessment-plans", plans.router);
  app.use((error, _req, res, _next) => res.status(error.status || 500).json({ error: error.code || "ERROR", message: error.message }));
  const server = await new Promise((resolve) => { const s = app.listen(0, "127.0.0.1", () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}/api/teacher/assessment-plans`;
  const call = async (method, path, who, body) => {
    const response = await fetch(base + path, {
      method, headers: { "content-type": "application/json", ...(who ? { "x-test-user": who } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    return { status: response.status, body: await response.json() };
  };
  return { call, db, base, close: async () => { server.close(); await db.close(); } };
}

const KEY = { year: 2026, grade: 5, semester: 1, subject: "국어" };
const query = (key) => "?" + new URLSearchParams(key);
const ITEMS = [{ domain: "문학", standards: [{ code: "6국05-05", text: "자신의 경험을 시, 소설, 극, 수필 등 적절한 갈래로 표현한다." }], element: "경험을 시로 표현하기", levels: 3, criteria: [{ label: "잘함", text: "경험을 시로 생생하게 표현한다." }, { label: "보통", text: "경험을 시로 표현한다." }, { label: "노력요함", text: "도움을 받아 경험을 시로 표현한다." }] }];

test('교과서별 목록·진도 시기·학년학기 전체 HWPX: 학교 격리, 교과서 변경, 수정 충돌', async () => {
  const s = await startServer();
  const { resourcesFor, resolveTiming } = require('./assessment-resources');
  const { readZipEntries, readPlanDocument } = require('./plan-document');
  const { inflateRawSync } = require('node:zlib');
  const { crc32 } = require('./assessment-hwpx');
  try {
    const catalog = require('./data/textbooks/assessment-catalog-2022.json').assessments;
    const candidate = catalog.find(a => a.grade === 5 && a.subject === '과학' && a.semester === 1);
    const key={...KEY,subject:'과학'}, editionId=candidate.editionId;
    await s.db.query('INSERT INTO school_textbook_selections(school_id,academic_year,grade,subject_name,edition_id) VALUES($1,$2,$3,$4,$5)',[10,2026,5,'과학',editionId]);
    const resource = (await s.call('GET','/resources'+query(key),'1')).body;
    assert.equal(resource.edition.id,editionId);
    assert.ok(resource.assessments.length);
    assert.ok(resource.assessments.every(a=>a.editionId===editionId && a.grade===5 && (!a.semester || a.semester===1)));
    assert.doesNotMatch(JSON.stringify(resource),/sourceUrl|downloadUrl|sourceFile|criterion|rubric|\.mp3/);
    assert.equal((await s.call('GET','/resources'+query(key),'3')).body.edition,null);
    const lessonId=resource.plans[0].lessons[0].id;
    const pacing={...key,editionId,revision:0,entries:[{lessonId,timing:'4월 2주'}]};
    assert.equal((await s.call('PUT','/pacing','2',pacing)).status,403);
    assert.equal((await s.call('PUT','/pacing','1',{...pacing,entries:[{lessonId:'foreign-row',timing:'3월'}]})).status,400);
    assert.equal((await s.call('PUT','/pacing','1',pacing)).status,200);
    assert.equal((await s.call('PUT','/pacing','1',pacing)).status,409);
    const item={...ITEMS[0],element:'관찰 결과를 근거와 함께 설명하기 <실험>',method:'관찰·서술',assessmentId:candidate.id,assessmentTitle:candidate.title,pacing:{editionId,lessonIds:[lessonId]}};
    assert.equal((await s.call('PUT','','1',{...key,items:[item]})).status,200);
    await s.call('PUT','','1',{...KEY,items:ITEMS});
    await s.call('PUT','','1',{...key,semester:2,items:[{element:'다른 학기 비공개 표식'}]});
    const term=(await s.call('GET','/term?year=2026&grade=5&semester=1','2')).body;
    assert.equal(term.subjects.length,10);
    assert.equal(term.subjects.find(a=>a.subject==='과학').items[0].resolvedTiming,'4월 2주');
    assert.equal(term.subjects.find(a=>a.subject==='영어').missing,true);
    assert.equal((await s.call('GET','/term?year=2026&grade=1&semester=1','1')).body.subjects.length,5);
    const response=await fetch(s.base+'/export.hwpx?year=2026&grade=5&semester=1',{headers:{'x-test-user':'2'}});
    assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'application/hwp+zip');
    const bytes=Buffer.from(await response.arrayBuffer()),entries=readZipEntries(bytes);
    assert.equal(entries.keys().next().value,'mimetype');assert.equal(entries.get('mimetype').method,0);
    const read=n=>{const e=entries.get(n);return(e.method===8?inflateRawSync(e.data):e.data).toString('utf8');};
    assert.equal(read('mimetype'),'application/hwp+zip');
    assert.equal((read('Contents/section0.xml').match(/pageBreak="1"/g)||[]).length,9);
    assert.match(read('Contents/section0.xml'),/&lt;실험&gt;/);
    const content=readPlanDocument(bytes,'plan.hwpx').text;
    for(const expected of ['가 초등학교','국어','영어','관찰·서술','4월 2주','수행평가 계획 미작성'])assert.ok(content.includes(expected),expected);
    assert.doesNotMatch(content,/다른 학기 비공개 표식|https:\/\/|\.mp3/);
    assert.equal(bytes.readUInt32LE(14),crc32(Buffer.from('application/hwp+zip')));
    require('node:fs').mkdirSync('../tmp/assessment-export',{recursive:true});require('node:fs').writeFileSync('../tmp/assessment-export/전과목-검증.hwpx',bytes);
    assert.equal((await fetch(s.base+'/export.hwpx?year=2026&grade=5&semester=1')).status,401);
    await s.call('PUT','/pacing','1',{...pacing,revision:1,entries:[{lessonId,timing:'4월 3주'}]});
    const updated=(await s.call('GET','/term?year=2026&grade=5&semester=1','1')).body;
    assert.equal(updated.subjects.find(a=>a.subject==='과학').items[0].resolvedTiming,'4월 3주');
    assert.equal(resolveTiming({...item,timingMode:'manual',timingText:'5월'},null,'other'),'5월');
    assert.equal(resolveTiming(item,{editionId,entries:pacing.entries},'other'),'');
    assert.equal(resourcesFor(editionId,6,1,'과학').assessments.some(a=>a.grade===5),false);
  } finally { await s.close(); }
});

test("cleanItems: 단계 수에 맞춰 단계 이름을 채우고, 길이와 개수를 자른다", () => {
  const [item] = cleanItems([{ domain: " 문학 ", standards: ["6국05-01", { code: "6국05-02", text: "글 " }, { code: "", text: "" }], element: "인물과 면담하기\r\n", levels: 4, criteria: [{ label: "", text: "잘 함" }, { text: "보통" }] }]);
  assert.deepEqual(item, {
    domain: "문학", standards: [{ code: "6국05-01", text: "" }, { code: "6국05-02", text: "글" }], element: "인물과 면담하기", levels: 4,
    criteria: [{ label: "매우잘함", text: "잘 함" }, { label: "잘함", text: "보통" }, { label: "보통", text: "" }, { label: "노력요함", text: "" }]
  });
  assert.equal(cleanItems([{ levels: 9 }])[0].levels, 5);
  assert.equal(cleanItems([{ levels: 1 }])[0].levels, 2);
  assert.equal(cleanItems([{}])[0].criteria.length, 3);
  assert.deepEqual(cleanItems([{ criteria: [{ label: "A" }, { label: "B" }, { label: "C" }] }])[0].criteria.map((c) => c.label), ["A", "B", "C"]);
  assert.equal(cleanItems(Array.from({ length: 80 }, () => ({}))).length, 60);
  assert.equal(cleanItems("x").length, 0);
  assert.deepEqual(LEVEL_LABELS[2], ["잘함", "노력요함"]);
});

test("planKey: 학년도·학년·학기·교과가 다 맞아야 한다", () => {
  assert.deepEqual(planKey({ year: "2026", grade: "3", semester: "2", subject: " 수학 " }), { year: 2026, grade: 3, semester: 2, subject: "수학" });
  for (const bad of [{ ...KEY, year: 1999 }, { ...KEY, grade: 0 }, { ...KEY, grade: 10 }, { ...KEY, semester: 3 }, { ...KEY, subject: "" }, {}]) assert.equal(planKey(bad), null);
});

test("같은 학년 담임끼리 계획을 함께 보고 고치고, 다른 학교·미등록 교사·손님은 못 본다", async () => {
  const s = await startServer();
  try {
    const empty = await s.call("GET", query(KEY), "1");
    assert.equal(empty.status, 200);
    assert.deepEqual(empty.body, { key: KEY, schoolName: "가 초등학교", canEdit: true, items: [], updatedAt: null, updatedByName: "" });

    const saved = await s.call("PUT", "", "1", { ...KEY, items: ITEMS });
    assert.equal(saved.status, 200, JSON.stringify(saved.body));
    assert.deepEqual(saved.body.items, ITEMS);
    assert.ok(saved.body.updatedAt);

    // 옆 반 담임(같은 학년)이 읽고 고친다.
    const colleague = await s.call("GET", query(KEY), "6");
    assert.deepEqual(colleague.body.items, ITEMS);
    assert.equal(colleague.body.updatedByName, "교사 하나");
    const changed = [...ITEMS, { domain: "읽기", standards: [], element: "글의 짜임 파악하기", levels: 2, criteria: [{ label: "잘함", text: "" }, { label: "노력요함", text: "" }] }];
    assert.equal((await s.call("PUT", "", "6", { ...KEY, items: changed })).status, 200);
    const again = await s.call("GET", query(KEY), "1");
    assert.equal(again.body.items.length, 2);
    assert.equal(again.body.updatedByName, "교사 여섯");

    // 다른 학기·교과는 따로 둔다. 요약은 학년도·학년 안의 교과별 유무.
    assert.equal((await s.call("PUT", "", "1", { ...KEY, semester: 2, subject: "수학", items: [{ element: "분수의 덧셈" }] })).status, 200);
    assert.deepEqual((await s.call("GET", query({ ...KEY, subject: "수학" }), "1")).body.items, []);
    const summary = (await s.call("GET", "/summary?year=2026&grade=5", "6")).body.plans;
    assert.deepEqual(summary.map((p) => [p.semester, p.subject, p.count]), [[1, "국어", 2], [2, "수학", 1]]);

    // 다른 학교에는 보이지 않고, 미등록 교사는 403, 손님은 401.
    assert.deepEqual((await s.call("GET", query(KEY), "3")).body.items, []);
    assert.deepEqual((await s.call("GET", "/summary?year=2026&grade=5", "3")).body.plans, []);
    assert.equal((await s.call("GET", query(KEY), "4")).status, 403);
    assert.equal((await s.call("PUT", "", "4", { ...KEY, items: ITEMS })).status, 403);
    assert.equal((await s.call("GET", query(KEY), "")).status, 401);

    // 열쇠가 틀리면 400.
    assert.equal((await s.call("GET", query({ ...KEY, semester: 3 }), "1")).body.error, "PLAN_KEY_INVALID");
    assert.equal((await s.call("PUT", "", "1", { ...KEY, grade: 0, items: ITEMS })).body.error, "PLAN_KEY_INVALID");
    assert.equal((await s.call("GET", "/summary?year=abc&grade=5", "1")).body.error, "PLAN_KEY_INVALID");
  } finally { await s.close(); }
});

test("나이스처럼: 담임은 자기 학년 전 교과, 전담은 맡은 학년·교과만, 교감은 보기만", async () => {
  const s = await startServer();
  try {
    // 담임은 자기 학년이면 전담이 맡은 영어도 고치고, 다른 학년은 보기만.
    assert.equal((await s.call("PUT", "", "1", { ...KEY, subject: "영어", items: ITEMS })).status, 200);
    const other = await s.call("PUT", "", "1", { ...KEY, grade: 6, items: ITEMS });
    assert.equal(other.status, 403);
    assert.equal(other.body.error, "PLAN_READ_ONLY");
    assert.equal((await s.call("GET", query({ ...KEY, grade: 6 }), "1")).body.canEdit, false);
    assert.deepEqual((await s.call("GET", "/scope?year=2026", "1")).body, { year: 2026, homeroomGrade: 5, pairs: [] });

    // 영어 전담: 5·6학년 영어만. 같은 학년이라도 다른 교과는 보기만.
    assert.equal((await s.call("PUT", "", "2", { ...KEY, grade: 6, subject: "영어", items: ITEMS })).status, 200);
    assert.equal((await s.call("PUT", "", "2", { ...KEY, grade: 5, subject: "영어", items: ITEMS })).status, 200);
    assert.equal((await s.call("PUT", "", "2", { ...KEY, grade: 6, subject: "수학", items: ITEMS })).body.error, "PLAN_READ_ONLY");
    assert.equal((await s.call("PUT", "", "2", { ...KEY, grade: 4, subject: "영어", items: ITEMS })).body.error, "PLAN_READ_ONLY");
    const seen = await s.call("GET", query({ ...KEY, subject: "영어" }), "2");
    assert.equal(seen.body.canEdit, true);
    assert.deepEqual(seen.body.items, ITEMS, "읽기는 학교 전체에 열려 있다");
    assert.equal((await s.call("GET", query(KEY), "2")).body.canEdit, false);
    assert.deepEqual((await s.call("GET", "/scope?year=2026", "2")).body.pairs, [{ grade: 5, subject: "영어" }, { grade: 6, subject: "영어" }]);

    // 교감: 반도 담당 과목도 없으니 보기만. 전담 시간표에 올해 3학년 음악이 있으면 그것만 고친다(작년 것은 아니다).
    assert.equal((await s.call("PUT", "", "5", { ...KEY, items: ITEMS })).body.error, "PLAN_READ_ONLY");
    assert.equal((await s.call("PUT", "", "5", { ...KEY, grade: 3, subject: "음악", items: ITEMS })).status, 200);
    assert.equal((await s.call("PUT", "", "5", { ...KEY, grade: 4, subject: "미술", items: ITEMS })).body.error, "PLAN_READ_ONLY");
    assert.deepEqual((await s.call("GET", "/scope?year=2026", "5")).body, { year: 2026, homeroomGrade: null, pairs: [{ grade: 3, subject: "음악" }] });
    assert.deepEqual((await s.call("GET", "/scope?year=2025", "5")).body.pairs, [{ grade: 4, subject: "미술" }]);
  } finally { await s.close(); }
});
