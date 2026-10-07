'use strict';
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { harness } = require('./learning-records-integration.cjs');
const { inspectLearningRecords } = require('../scripts/inspect-learning-records.cjs');

async function main() {
  const h = await harness();
  const request = async (route, body, user = 1) => {
    const response = await fetch(h.base + '/api/learning-records' + route, {
      headers: { 'Content-Type': 'application/json', 'x-test-user': String(user) },
      ...(body ? { method: 'POST', body: JSON.stringify(body) } : {})
    });
    const data = await response.json();
    assert.equal(response.status, 200, JSON.stringify(data));
    return data;
  };
  const times = [
    ['before', '2026-09-30T14:59:59.999Z', false],
    ['midnight', '2026-09-30T15:00:00.000Z', true],
    ['morning', '2026-10-01T00:00:00.000Z', true],
    ['afternoon', '2026-10-01T05:00:00.000Z', true],
    ['last-millisecond', '2026-10-01T14:59:59.999Z', true],
    ['next-midnight', '2026-10-01T15:00:00.000Z', false],
    ['next-morning', '2026-10-02T00:00:00.000Z', false]
  ];
  try {
    const mathContext = { window: {} };
    require('node:vm').runInNewContext(require('node:fs').readFileSync(require('node:path').join(__dirname, '../learning/literacy-numeracy/math-ox/data.js'), 'utf8'), mathContext);
    const question = mathContext.window.MATH_OX_DATA[0];
    const expected = [], fixtures = [];
    for (const activity of ['math-ox', 'world-tales']) {
      const reading = activity === 'world-tales';
      const href = reading ? '/learning/literacy-numeracy/story-books/world-tales/' : '/learning/literacy-numeracy/math-ox/';
      for (const [label, timestamp, included] of times) {
        const { session } = await request('/sessions', { activity, contentKey: label, contentVersion: 'dates-v1', title: label, href, checkpoint: {} });
        await request(`/sessions/${session.id}/changes`, {
          revision: 0, mutationId: crypto.randomUUID(), checkpoint: {}, progress: { current: 1, total: 2 },
          events: [{ kind: reading ? 'read' : 'answer', questionKey: reading ? label : String(question.id), response: reading ? label : question.answer, snapshot: {} }]
        });
        await h.pool.query('UPDATE learning_record_sessions SET started_at=$2::timestamptz, updated_at=$2::timestamptz WHERE id=$1', [session.id, timestamp]);
        await h.pool.query('UPDATE learning_record_events SET recorded_at=$2::timestamptz WHERE session_id=$1', [session.id, timestamp]);
        fixtures.push({ id: session.id, activity, included });
        if (included) expected.push(session.id);
      }
    }
    const range = 'from=2026-10-01&to=2026-10-01';
    for (const zone of ['UTC', 'Asia/Seoul', 'America/Los_Angeles']) {
      await h.pool.query("SELECT set_config('TimeZone',$1,false)", [zone]);
      const student = await request(`/sessions?${range}`);
      assert.deepEqual(student.sessions.map(s => s.id).sort(), [...expected].sort(), `${zone}: student date filter`);
      for (const activity of [null, 'math-ox', 'world-tales']) {
        const report = await request(`/teacher/report?classId=10:2026:4:1&${range}${activity ? '&activity=' + activity : ''}`, null, 3);
        const wanted = fixtures.filter(f => f.included && (!activity || f.activity === activity));
        assert.deepEqual(report.sessions.map(s => s.id).sort(), wanted.map(f => f.id).sort(), `${zone}: teacher ${activity || 'all'} date filter`);
        for (const session of report.sessions) {
          assert.equal(session.summary[session.activity === 'world-tales' ? 'readCount' : 'firstCorrect'], 1, `${zone}: event summary`);
        }
      }
      const inspected = await inspectLearningRecords(h.pool, { schoolId: 10, academicYear: 2026, grade: 4, classNumber: 1, from: '2026-10-01', to: '2026-10-01' });
      assert.equal(inspected.currentClass.sessions, 8, `${zone}: inspection session dates`);
      assert.equal(inspected.currentClass.answerEvents, 4, `${zone}: inspection answer dates`);
      assert.equal(inspected.currentClass.readEvents, 4, `${zone}: inspection reading dates`);
    }
    // A session may span several days. Select it by the day's event even when
    // its last update is later, and count only the events in the requested day.
    const spanning = fixtures.find(f => f.activity === 'world-tales' && f.included);
    await h.pool.query("UPDATE learning_record_sessions SET updated_at='2026-10-03T00:00:00Z' WHERE id=$1", [spanning.id]);
    await h.pool.query(`INSERT INTO learning_record_events(session_id,kind,question_key,scoring_source,attempt_number,recorded_at)
      VALUES ($1,'read','outside-day','none',1,'2026-10-02T00:00:00Z')`, [spanning.id]);
    await h.pool.query("SELECT set_config('TimeZone','UTC',false)");
    const report = await request(`/teacher/report?classId=10:2026:4:1&${range}`, null, 3);
    assert.equal(report.sessions.find(s => s.id === spanning.id)?.summary.readCount, 1);
    console.log('PASS KST date boundaries: UTC/KST/US databases, student history, teacher all/OX/reading reports, scoped inspection, midnight inclusivity, next-day exclusion, multi-day event summaries.');
  } finally { await h.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
