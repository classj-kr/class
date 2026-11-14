'use strict';
// Only learning evidence is projected. Preferences, selected menus, presence,
// room entry and browser navigation never become learning activity.
const crypto = require('node:crypto');
const catalog = require('../assets/learning-record-catalog');
const items = new Map(catalog.map(row => [row.id, row]));
const SOURCE_APPS = ['typing', 'handwriting', 'korean-history', 'computer-literacy', 'korea-map',
  'ear-training', 'music-studio', 'museum', 'park', 'geoboard', 'number-models', 'fraction-board',
  'graph-studio', 'sliding-puzzle', 'nonogram', 'minesweeper'];
const count = value => Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
// JSONB changes object-key order. Compare semantic content, so a server restart
// or another device cannot turn an unchanged saved value into a new activity.
const hash = value => crypto.createHash('sha256').update(JSON.stringify(value, (_key,row) =>
  row && typeof row === 'object' && !Array.isArray(row)
    ? Object.fromEntries(Object.keys(row).sort().map(key=>[key,row[key]])) : row)).digest('hex');

function storageEvidence({ app, item, value }) {
  const rows = [], v = object(value), base = items.get(app);
  if (!base) return rows;
  const add = (key, title, response, evidence, progress = 1, complete = false, recordedAt) => {
    if (progress > 0) rows.push({ activity: app, key: `${app}:${item}:${key}`, title: `${base.label}${title ? ' · ' + title : ''}`,
      response, fingerprint: hash(evidence), progress: Math.min(100000, Math.floor(progress)), complete, recordedAt });
  };
  if (app === 'typing' && item === 'typing-records-v1') {
    for (const [key, row] of Object.entries(v)) {
      if (!row || typeof row !== 'object') continue;
      const n = count(row?.completions);
      add(key, row.stage || ({ words: '낱말', sentences: '문장', position: '자리 연습' }[row.mode] || '연습'),
        [`누적 완료 ${n}회`, ...(row.bestSpeed ? [`최고 ${count(row.bestSpeed)}타/분`] : []),
          ...(row.bestAccuracy != null ? [`최고 정확도 ${count(row.bestAccuracy)}%`] : [])].join(' · '),
        row, n, true, row.lastDate);
    }
  } else if (app === 'handwriting' && (item === 'draft' || item.startsWith('round-'))) {
    const cells = Object.values(object(v.cells)).flatMap(value => Array.isArray(value) ? value : []);
    const written = cells.filter(cell => Array.isArray(cell) && cell.some(stroke => Array.isArray(stroke) ? stroke.length > 0 : stroke?.points?.length > 0)).length;
    add('writing', String(v.text || '').slice(0, 50), `${written}칸 쓰기`, { text: v.text, cells: v.cells }, written);
  } else if (app === 'korean-history' && item === 'hanguksa-done') {
    const answers = Object.entries(v).filter(([, result]) => ['right', 'wrong'].includes(result)).sort(([a],[b])=>a.localeCompare(b));
    add('answers', '저장된 풀이', `풀이 ${answers.length}문항 · 현재 정답 ${answers.filter(([, r]) => r === 'right').length}문항`, answers, answers.length);
  } else if (app === 'computer-literacy' && item.startsWith('computer-literacy:') && v.completed === true) {
    add(item, item.split(':').at(-1), `차시 완료 · ${count(v.score)}문항 정답`, v, 1, true, v.updatedAt);
  } else if (app === 'korea-map' && item === 'classj-korea-geography-progress-v2') {
    add('answers', '지도 문제', `누적 ${count(v.total)}회 응답 · ${count(v.correct)}회 정답`,
      { total: v.total, correct: v.correct, items: v.items }, count(v.total));
  } else if (app === 'ear-training' && item === 'saved') {
    for (const [key, table] of Object.entries(object(v.stats))) {
      const values = Object.values(object(table));
      const total = values.reduce((sum, row) => sum + count(row?.total), 0);
      const right = values.reduce((sum, row) => sum + count(row?.right), 0);
      add(key, '듣고 응답하기', `누적 ${total}회 응답 · ${right}회 정답`, table, total);
    }
  } else if (app === 'music-studio' && item === 'practice') {
    add('practice', '연주 연습', `${count(v.count)}회 연습`, v, count(v.count));
  } else if (app === 'museum' && item === 'finaleRooms') {
    const completed = Object.keys(v).filter(key => v[key] === true).sort();
    add('rooms', '전시실 관찰', `${completed.length}개 전시실 관찰 완료`, completed, completed.length, completed.length >= 5);
  } else if (app === 'park' && item === 'finaleStamp' && value === true) {
    add('stamp', '관찰 활동', '야외 미술관 관찰 완료', true, 1, true);
  } else if (['sliding-puzzle', 'nonogram', 'minesweeper'].includes(app) && item.startsWith('best-') && count(v.time) > 0) {
    add(item, item.slice(5), `퍼즐 완료${v.moves ? ` · ${count(v.moves)}번 이동` : ''}`, v, 1, true);
  } else if (app === 'geoboard' && item === 'board') {
    const bands = Object.values(object(v.scenes)).flatMap(rows => Array.isArray(rows) ? rows : [])
      .map(band => band?.points).filter(points => Array.isArray(points) && points.length >= 2);
    add('board', '도형 구성', `${bands.length}개 도형 구성`, bands, bands.length);
  } else if (app === 'number-models' && item === 'board') {
    const scenes = Object.entries(object(v.scenes)).sort(([a],[b])=>a.localeCompare(b)).map(([mode, row]) => [mode, row?.counts, row?.example, row?.done]);
    const changed = Object.values(object(v.comparisons)).some(rows=>Array.isArray(rows) && rows.length > 0) ||
      scenes.some(([mode, values, example, done]) => example || done || JSON.stringify(values) !== JSON.stringify(mode === 'whole' ? [0,1,2,3] : [1,2,3,0]));
    if (changed) add('board', '수 구성', '수 모형을 구성하고 저장함', { scenes, comparisons: v.comparisons });
  } else if (app === 'fraction-board' && item === 'board' && Array.isArray(v.cards)) {
    const cards = v.cards.filter(c => c && Array.isArray(c.cells)).map(c => ({ shape: c.shape, denominator: c.denominator, cells: c.cells }));
    const initial = [{shape:'bar',denominator:8,cells:[0,1,2]}];
    if (cards.length && JSON.stringify(cards) !== JSON.stringify(initial)) add('board', '분수 표현', cards.map(c => `${c.cells.length}/${c.denominator}`).join(' · '), cards);
  } else if (app === 'graph-studio' && item === 'current' && Array.isArray(v.functions)) {
    const project = state => ({functions:state.functions.filter(Boolean).map(f => ({expression:f.expression,params:f.params})),
      ghosts:state.ghosts || [], analysis:state.analysis});
    const core = require('../learning/literacy-numeracy/math-tools/graph-studio/graph-core');
    const work = project(v);
    if (hash(work) !== hash(project(core.initialState()))) add('current', v.title || '그래프 구성', `${v.functions.length}개 함수 탐구`, work);
  } else if (app === 'graph-studio' && item === 'scenes' && Array.isArray(value)) {
    for (const scene of value) if (scene?.id && scene.state) add(String(scene.id), scene.state.title || '그래프 구성', '그래프 작품 저장', scene.state, 1, false, scene.savedAt);
  }
  return rows;
}

function createActivityWriter({ pool, membershipSql }) {
  async function record(user, entry, options = {}) {
    const activity = items.get(entry.activity);
    if (!pool || !activity || !user?.id) return null;
    const db = await pool.connect();
    try {
      await db.query('BEGIN');
      // Serializing on the account also makes duplicate delivery and imports safe.
      await db.query('SELECT id FROM classroom_users WHERE id=$1 FOR UPDATE', [user.id]);
      const m = (await db.query(membershipSql, [user.id, user.email || ''])).rows[0];
      if (!m) { await db.query('ROLLBACK'); return null; }
      const recordedAt = options.recordedAt ? new Date(options.recordedAt) : new Date();
      if (!Number.isFinite(recordedAt.getTime())) { await db.query('ROLLBACK'); return null; }
      const day = new Date(recordedAt.getTime() + 32400000).toISOString().slice(0, 10);
      const schoolYear = Number(day.slice(0,4)) - (Number(day.slice(5,7)) < 3 ? 1 : 0);
      if (options.imported && schoolYear !== m.academic_year) { await db.query('ROLLBACK'); return null; }
      if (options.sourceKey) {
        const previous = (await db.query('SELECT fingerprint FROM learning_record_source_state WHERE user_id=$1 AND source_key=$2', [user.id, options.sourceKey])).rows[0];
        if (previous?.fingerprint === options.fingerprint) { await db.query('COMMIT'); return null; }
      }
      const contentKey = `${entry.context || entry.activity}:${day}`.slice(0, 512);
      let row = (await db.query(`SELECT * FROM learning_record_sessions WHERE user_id=$1 AND activity=$2 AND content_key=$3
        AND content_version='activity-v1' AND school_id=$4 AND academic_year=$5 AND grade=$6 AND class_number=$7 ORDER BY started_at LIMIT 1`,
      [user.id, entry.activity, contentKey, m.school_id, m.academic_year, m.grade, m.class_number])).rows[0];
      // Historical recovery cannot append an older/equal snapshot over evidence
      // already captured for that source/day (also safe across projection upgrades).
      if (row && options.imported && options.sourceKey && recordedAt <= new Date(row.updated_at)) {
        await db.query(`INSERT INTO learning_record_source_state(user_id,source_key,fingerprint) VALUES($1,$2,$3)
          ON CONFLICT(user_id,source_key) DO UPDATE SET fingerprint=EXCLUDED.fingerprint`, [user.id,options.sourceKey,options.fingerprint]);
        await db.query('COMMIT'); return row.id;
      }
      if (!row) row = (await db.query(`INSERT INTO learning_record_sessions
        (id,user_id,school_id,academic_year,grade,class_number,student_number,student_name,activity,content_key,content_version,title,href,started_at,updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'activity-v1',$11,$12,$13,$13) RETURNING *`,
      [crypto.randomUUID(),user.id,m.school_id,m.academic_year,m.grade,m.class_number,m.student_number,m.student_name,
        entry.activity,contentKey,String(entry.title || activity.label).slice(0,160),activity.href,recordedAt])).rows[0];
      const mutation = entry.eventId || crypto.randomUUID(), payloadHash = hash(entry);
      const seen = (await db.query('SELECT payload_hash FROM learning_record_mutations WHERE session_id=$1 AND mutation_id=$2', [row.id,mutation])).rows[0];
      if (seen) {
        if (seen.payload_hash !== payloadHash) throw new Error('Activity event ID reused');
        await db.query('COMMIT'); return row.id;
      }
      const kind = entry.kind || 'activity', question = String(entry.questionKey || entry.activity).slice(0,160);
      const attempt = (await db.query('SELECT COUNT(*)::int AS n FROM learning_record_events WHERE session_id=$1 AND kind=$2 AND question_key=$3', [row.id,kind,question])).rows[0].n + 1;
      const correct = kind === 'answer' && typeof entry.correct === 'boolean' ? entry.correct : null;
      const snapshot = { title: entry.title || activity.label, ...(entry.snapshot || {}), ...(options.imported ? { imported: true, timestampBasis: 'last-saved' } : {}) };
      await db.query(`INSERT INTO learning_record_events(session_id,kind,question_key,response,snapshot,correct,scoring_source,attempt_number,recorded_at)
        VALUES($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8,$9)`, [row.id,kind,question,JSON.stringify(entry.response ?? '활동 수행'),JSON.stringify(snapshot),correct,correct === null ? 'none' : entry.scoringSource === 'server' ? 'server' : 'activity',attempt,recordedAt]);
      await db.query(`UPDATE learning_record_sessions SET progress_current=$2, progress_total=$3,
        status=CASE WHEN $4 THEN 'completed' ELSE status END,
        completed_at=CASE WHEN $4 THEN COALESCE(completed_at,$5) ELSE completed_at END,
        updated_at=GREATEST(updated_at,$5),revision=revision+1 WHERE id=$1`,
      [row.id,entry.progress ?? row.progress_current + 1,entry.total ?? row.progress_total,Boolean(entry.complete),recordedAt]);
      await db.query('INSERT INTO learning_record_mutations(session_id,mutation_id,payload_hash) VALUES($1,$2,$3)', [row.id,mutation,payloadHash]);
      if (options.sourceKey) await db.query(`INSERT INTO learning_record_source_state(user_id,source_key,fingerprint) VALUES($1,$2,$3)
        ON CONFLICT(user_id,source_key) DO UPDATE SET fingerprint=EXCLUDED.fingerprint`, [user.id,options.sourceKey,options.fingerprint]);
      await db.query('COMMIT'); return row.id;
    } catch (error) { await db.query('ROLLBACK'); throw error; } finally { db.release(); }
  }
  async function captureStorage(user, row, imported = false) {
    // Best scores recover older evidence; current puzzle rounds have explicit
    // play/completion events, including rounds that did not beat a best score.
    if (!imported && ['sliding-puzzle','nonogram','minesweeper'].includes(row.app)) {
      for (const e of storageEvidence(row)) await pool.query(`INSERT INTO learning_record_source_state(user_id,source_key,fingerprint)
        VALUES($1,$2,$3) ON CONFLICT(user_id,source_key) DO UPDATE SET fingerprint=EXCLUDED.fingerprint`, [user.id,e.key,e.fingerprint]);
      return;
    }
    for (const e of storageEvidence(row)) {
      const saved = Date.parse(row.updated_at), own = Date.parse(e.recordedAt);
      const recordedAt = Number.isFinite(own) && own <= saved ? new Date(own) : Number.isFinite(saved) ? new Date(saved) : null;
      // Unknown historical dates must never be presented as today's work.
      if (imported && (!recordedAt || recordedAt.getTime() > Date.now())) continue;
      await record(user, { ...e, context: `saved:${hash(e.key)}`,
      snapshot: { source: 'saved-progress', summary: e.response, ...(imported ? { note: '이전 누적 기록 · 마지막 저장 시점' } : {}) } },
      { sourceKey: e.key, fingerprint: e.fingerprint, recordedAt: imported ? recordedAt : undefined, imported });
    }
  }
  async function importStored() {
    if (!pool) return;
    const rows = (await pool.query(`SELECT s.*,u.email FROM user_storage s JOIN classroom_users u ON u.id=s.user_id WHERE s.app=ANY($1::text[])`, [SOURCE_APPS])).rows;
    for (const row of rows) await captureStorage({ id: row.user_id, email: row.email }, row, true);
  }
  return { record, captureStorage, importStored };
}
module.exports = { storageEvidence, SOURCE_APPS, createActivityWriter };
