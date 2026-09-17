'use strict';
const { io } = require('socket.io-client');
const assert = require('node:assert/strict');
const { openRaceRoom } = require('./_rooms');
const BASE = process.env.TEST_URL || 'http://127.0.0.1:3000';
function connect() { return io(BASE, { transports: ['websocket'], forceNew: true, reconnection: false, timeout: 7000 }); }
function once(socket, event, predicate = () => true, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { socket.off(event, on); reject(new Error(`timeout:${event}`)); }, timeout);
    function on(data) { if (!predicate(data)) return; clearTimeout(timer); socket.off(event, on); resolve(data); }
    socket.on(event, on);
  });
}
function ack(socket, event, payload = {}) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`ack:${event}`)), 9000);
    socket.emit(event, payload, (data) => { clearTimeout(timer); resolve(data); });
  });
}

(async () => {
  const teacher = connect();
  const student = connect();
  await Promise.all([once(teacher, 'connect'), once(student, 'connect')]);
  const created = await openRaceRoom(ack, teacher);
  const roomCode = created.roomCode;
  const published = await ack(teacher, 'teacherPublishArrivalRace', {
    targetPlaceId: 'nile_delta',
    startPlaceIds: ['alexandria', 'istanbul', 'genoa', 'london']
  });
  assert.equal(published.ok, true, published.error);
  const joined = await ack(student, 'joinClass', { roomCode, name: '크림학생' });
  assert.equal(joined.ok, true, joined.error);
  const chosen = await ack(student, 'chooseStartCity', { optionId: 'alexandria' });
  assert.equal(chosen.ok, true, chosen.error);
  const started = await ack(teacher, 'teacherStartArrivalRace');
  assert.equal(started.ok, true, started.error);
  const port = await once(student, 'snapshot', (snapshot) => snapshot.portInteraction?.placeId === 'alexandria' && snapshot.you.mode === 'sea');
  const landed = await ack(student, 'useCatalogPort', { placeId: port.portInteraction.placeId });
  assert.equal(landed.ok, true, landed.error);
  // 바다에서 입항하면 곧장 도시 안으로 들어가므로, 도시 밖으로 걸어 나와야 육지 도착지에 닿는다.
  await once(student, 'snapshot', (snapshot) => snapshot.you.mode === 'city' && !snapshot.you.transition);
  const walkedOut = await ack(student, 'leaveCity', {});
  assert.equal(walkedOut.ok, true, walkedOut.error);
  const quiz = await once(student, 'snapshot', (snapshot) => snapshot.progress?.finalQuizStatus === 'answering', 20000);
  assert.equal(quiz.progress.status, 'inProgress');
  const answers = published.mission.finalQuiz.questions.map((question) => question.answerIndex);
  const submitted = await ack(student, 'submitFinalQuiz', { answers });
  assert.equal(submitted.ok, true, submitted.error);
  const done = await once(student, 'snapshot', (snapshot) => snapshot.progress?.status === 'completed', 12000);
  assert.equal(done.progress.finishRank, 1);
  assert.equal(done.progress.finalCorrectCount, 3);
  assert.equal(published.mission.targetPlace.name, '나일강 삼각주');
  console.log(JSON.stringify({ ok: true, target: published.mission.targetPlace.name, rank: done.progress.finishRank, score: done.progress.finalCorrectCount }));
  teacher.disconnect();
  student.disconnect();
})().catch((error) => { console.error(error); process.exit(1); });
