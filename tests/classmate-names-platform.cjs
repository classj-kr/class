// /api/me/classmates: 학생은 자기 반, 담임 교사는 맡은 반의 이름을 성을 떼고 받는다.
// 반이 없는 교사는 자기 이름만, 로그인 안 하면 401. (교과서 단어·순위전의 「한 아이」 자리에 쓰인다)
'use strict';

const assert = require('node:assert/strict');
const Module = require('node:module');
const { PGlite } = require('../game-hub-server/node_modules/@electric-sql/pglite');
const express = require('../game-hub-server/node_modules/express');
const { request } = require('../game-hub-server/node_modules/playwright');

async function main() {
  const db = new PGlite();
  let queue = Promise.resolve();
  const lease = async () => {
    const previous = queue;
    let release;
    queue = new Promise(resolve => { release = resolve; });
    await previous;
    return release;
  };
  const query = async (sql, params) => {
    const result = params ? await db.query(sql, params) : (await db.exec(sql)).at(-1);
    return { ...result, rows: result?.rows || [], rowCount: result?.rows?.length || result?.affectedRows || 0 };
  };
  class Pool {
    on() {}
    async query(sql, params) { const release = await lease(); try { return await query(sql, params); } finally { release(); } }
    async connect() { const release = await lease(); return { query, release, on() {} }; }
  }
  class OAuth2Client {
    async verifyIdToken({ idToken }) {
      assert.match(idToken, /^fixture-[a-z0-9-]+$/);
      return { getPayload: () => ({ sub: idToken, email: `${idToken}@fixture.invalid`, email_verified: true, name: idToken, hd: 'fixture.invalid' }) };
    }
  }
  const originalLoad = Module._load;
  let platform;
  try {
    Module._load = function (name, ...args) {
      if (name === 'pg') return { Pool };
      if (name === 'google-auth-library') return { OAuth2Client };
      return originalLoad.call(this, name, ...args);
    };
    const { createClassroomPlatform } = require('../game-hub-server/classroom-platform');
    platform = createClassroomPlatform({ databaseUrl: 'postgres://isolated/test', googleClientId: 'fixture' });
  } finally { Module._load = originalLoad; }
  await platform.initialize();
  const year = new Date().getFullYear();
  await query(`INSERT INTO classroom_schools(id,name,google_domain) VALUES (10,'검증학교','fixture.invalid');
    INSERT INTO classroom_teachers(school_id,teacher_name,google_email,teacher_type,academic_year,grade,class_number)
    VALUES (10,'한담임','fixture-homeroom@fixture.invalid','담임',${year},3,2),
           (10,'남궁교과','fixture-subject@fixture.invalid','교과',${year},NULL,NULL);
    INSERT INTO school_students(school_id,academic_year,grade,class_number,student_number,roster_name,student_email) VALUES
      (10,${year},3,2,'1','김가람','fixture-pupil-1@fixture.invalid'),
      (10,${year},3,2,'2','이나래','fixture-pupil-2@fixture.invalid'),
      (10,${year},3,2,'3','박다온','fixture-pupil-3@fixture.invalid'),
      (10,${year},3,3,'1','최다른반','fixture-pupil-9@fixture.invalid');`);

  const app = express();
  app.use(express.json());
  app.use('/api', platform.router);
  const server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const as = async (who) => {
    const context = await request.newContext({ baseURL: base });
    if (who) {
      const login = await context.post('/api/auth/google', { data: { credential: `fixture-${who}` } });
      assert.equal(login.status(), 200, await login.text());
    }
    const response = await context.get('/api/me/classmates');
    const out = { status: response.status(), body: response.status() === 200 ? await response.json() : null };
    await context.dispose();
    return out;
  };
  try {
    const pupil = await as('pupil-1');
    assert.equal(pupil.status, 200);
    assert.equal(pupil.body.self, '가람');
    assert.deepEqual([...pupil.body.names].sort(), ['가람', '나래', '다온'], '자기 반 이름만, 성을 떼고');
    const homeroom = await as('homeroom');
    assert.equal(homeroom.body.self, '담임');
    assert.deepEqual([...homeroom.body.names].sort(), ['가람', '나래', '다온'], '담임은 맡은 반');
    const subject = await as('subject');
    assert.equal(subject.body.self, '교과', '네 글자 이름은 앞 두 글자(복성)를 뗀다');
    assert.deepEqual(subject.body.names, [], '반이 없는 교사는 자기 이름만');
    assert.equal((await as(null)).status, 401, '로그인 안 하면 받지 못한다');
    console.log('반 이름: 학생·담임·반 없는 교사·둘러보기 네 경우 확인');
  } finally {
    server.close();
    await db.close();
  }
}

main().catch(error => { console.error(error); process.exit(1); });
