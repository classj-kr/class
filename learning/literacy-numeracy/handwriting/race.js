(async function () {
  'use strict';
  const $ = (id) => document.getElementById(id),
    A = window.HandwritingApp;
  const initialCode = new URLSearchParams(location.search).get('room') || '';
  const roomOnly = location.pathname.includes('/race') || Boolean(initialCode);
  if (!roomOnly) return;
  document.body.classList.add('room-only');
  $('roomPanel').hidden = false;
  // 순위전 공용 음악(대기 화면 한 곡, 쓰는 동안 무작위). 방장 기기에서만 기본으로 들린다.
  const musicScript = document.createElement('script');
  musicScript.src = '/assets/sound/race-music.js?v=20261106-1';
  document.head.append(musicScript);
  const playMusic = (kind, host = true) => window.RaceMusic?.set(kind, { host });
  musicScript.onload = () => playMusic('lobby');
  await A.ready;
  let code = '',
    token = '',
    state = null,
    pollTimer,
    shownRound = '',
    busy = false,
    failures = 0,
    previousLock = null,
    isTeacher = false;
  const status = (message) => ($('roomStatus').textContent = message);
  async function api(path, body) {
    const r = await fetch('/api/handwriting' + path, {
      method: body === undefined ? 'GET' : 'POST',
      cache: 'no-store',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(Error(data.message || '방에 연결하지 못했어요.'), { status: r.status });
    return data;
  }
  // 글감: 직접 넣기, 또는 속담·한자성어·관용어에서 무작위로(writing-texts.js)
  const banks = window.HANDWRITING_TEXTS || {};
  function pickText() {
    const list = banks[$('raceSource').value];
    if (!Array.isArray(list) || !list.length) return;
    const others = list.filter(([t]) => t !== $('raceText').value);
    $('raceText').value = (others.length ? others : list)[Math.floor(Math.random() * (others.length || list.length))][0];
  }
  $('raceSource').onchange = () => {
    const bank = $('raceSource').value !== 'custom';
    $('raceAnother').hidden = !bank;
    if (bank) pickText();
  };
  $('raceAnother').onclick = pickText;
  const settings = () => ({ text: $('raceText').value.trim(), phase: $('raceMode').value });
  function setLock(value) {
    if (previousLock !== value) {
      A.lock(value);
      previousLock = value;
    }
  }
  function render(s) {
    state = s;
    const host = s.me.host,
      plays = s.me.plays,
      writing = s.phase === 'writing',
      results = s.phase === 'results';
    document.body.classList.toggle('round-writing', writing);
    playMusic(writing ? 'race' : 'lobby', host);
    $('roomEntry').hidden = true;
    $('roomLobby').hidden = false;
    $('roomSettings').hidden = !host;
    $('spectateRow').hidden = true;
    for (const id of ['raceText', 'raceMode', 'raceSource', 'raceAnother']) $(id).disabled = writing;
    $('codeLabel').textContent = s.code;
    $('roomPhase').textContent = writing ? '함께 쓰는 중' : results ? '이번 판 결과' : '입장·준비';
    $('readyButton').hidden = host || writing;
    $('readyButton').textContent = s.me.ready ? '준비 취소' : '준비';
    $('startRound').hidden = !host || writing;
    $('stopRound').hidden = !host || !writing;
    $('submitRound').hidden = !plays || !writing || s.me.status === '제출 완료';
    $('roomHelp').textContent = writing
      ? `${Math.max(0, Math.ceil((s.deadline - Date.now()) / 1000))}초 남음`
      : results
        ? '점수(모양 × 획순)로 순위'
        : '모두 준비하면 시작합니다.';
    if (!state || s.phase !== document.body.dataset.roomPhase) {
      $('rankingDetails').open = !writing;
      document.body.dataset.roomPhase = s.phase;
    }
    $('rankList').replaceChildren(
      ...s.participants.map((p) => {
        const li = document.createElement('li');
        li.classList.toggle('mine', p.id === s.me.id);
        const name = document.createElement('strong');
        name.textContent = (p.rank ? `${p.rank}위 · ` : '') + p.name + (p.host ? ' (방장)' : '');
        const detail = document.createElement('span');
        // 다음 판 준비를 누른 학생은 "준비 완료"가 먼저, 지난 판 점수는 아래 작은 글씨로 남긴다.
        detail.textContent = !writing && !p.host && p.ready ? '준비 완료' : p.result ? `${p.result.score}점` : p.status;
        if (p.result) {
          const small = document.createElement('small');
          small.textContent = (detail.textContent === '준비 완료' ? `지난 판 ${p.result.score}점 · ` : '') + `모양 ${p.result.shape}% · ` + (p.result.order ? '획순 통과' : `획순 ${p.result.passed}/${p.result.total}글자`);
          detail.append(small);
        }
        li.append(name, detail);
        return li;
      }),
    );
    const showBoard = Boolean(s.roundId) && (writing || results);
    $('workspace').style.display = showBoard ? 'block' : 'none';
    document.body.classList.toggle('room-active', showBoard);
    if (showBoard) {
      if (shownRound !== s.roundId) {
        shownRound = s.roundId;
        A.useRound(s.config.text, s.config.phase, s.code + '-' + s.roundId);
        previousLock = null;
      }
      setLock(!plays || !writing || s.me.status === '제출 완료');
    }
    if (!host) {
      $('raceText').value = s.config.text;
      $('raceMode').value = s.config.phase;
    }
  }
  function poll() {
    clearTimeout(pollTimer);
    if (!code) return;
    pollTimer = setTimeout(
      async () => {
        if (!document.hidden) {
          try {
            render(await api('/rooms/' + code));
            failures = 0;
            status('');
          } catch (e) {
            status(e.message);
            if (e.status === 403 || e.status === 404) {
              setLock(true);
              return;
            }
            failures++;
          }
        }
        poll();
      },
      Math.min(10000, 2000 + failures * 2000),
    );
  }
  function enter(data, newCode) {
    code = newCode;
    token = data.token;
    A.store.set('ticket-' + code, { token });
    history.replaceState(null, '', '?room=' + code);
    render(data.state);
    status('');
    poll();
  }
  async function action(fn) {
    if (busy) return;
    busy = true;
    try {
      await fn();
      status('');
    } catch (e) {
      status(e.message);
    } finally {
      busy = false;
    }
  }
  // 방번호는 메인 화면 방번호 입력에서 ?room= 으로 넘어온다.
  function join(value) {
    action(async () => {
      const saved = A.store.get('ticket-' + value);
      if (saved?.token) {
        token = saved.token;
        try {
          enter({ token, state: await api('/rooms/' + value) }, value);
          return;
        } catch (e) {
          if (e.status !== 403 && e.status !== 404) throw e;
          token = '';
          A.store.remove('ticket-' + value);
        }
      }
      enter(await api('/rooms/' + value + '/join', {}), value);
    });
  }
  $('createRoom').onclick = () =>
    action(async () => {
      const data = await api('/rooms', { ...settings(), spectate: isTeacher && $('spectateInput').checked });
      enter(data, data.state.code);
    });
  $('readyButton').onclick = () =>
    action(async () => render(await api('/rooms/' + code + '/ready', { ready: !state.me.ready })));
  $('startRound').onclick = () => action(async () => render(await api('/rooms/' + code + '/start', settings())));
  $('stopRound').onclick = () => action(async () => render(await api('/rooms/' + code + '/stop', {})));
  $('submitRound').onclick = () =>
    action(async () => {
      if (!confirm('이번 판의 글씨를 제출할까요? 제출 후에는 고칠 수 없어요.')) return;
      render(await api('/rooms/' + code + '/result', { roundId: state.roundId, cells: A.cells() }));
    });
  $('leaveRoom').onclick = () =>
    action(async () => {
      if (state?.me.host && !confirm('방을 닫으면 모두의 순위전이 끝나요. 방을 닫을까요?')) return;
      await api('/rooms/' + code + '/leave', {}).catch(() => {});
      clearTimeout(pollTimer);
      A.store.remove('ticket-' + code);
      code = '';
      token = '';
      state = null;
      shownRound = '';
      previousLock = null;
      A.exitRound();
      playMusic('lobby');
      document.body.classList.remove('room-active');
      $('workspace').style.display = 'none';
      $('roomLobby').hidden = true;
      $('roomEntry').hidden = false;
      $('roomSettings').hidden = false;
      $('spectateRow').hidden = !isTeacher;
      history.replaceState(null, '', location.pathname);
    });
  $('roomInputTest').onclick = () => $('testInput').click();
  // 방 만들기는 누구나. 관전 옵션은 교사에게만.
  $('roomSettings').hidden = false;
  try {
    isTeacher = Boolean((await api('/session')).isTeacher);
    $('spectateRow').hidden = !isTeacher;
  } catch (e) {
    status(e.message);
  }
  if (/^\d{4}$/.test(initialCode)) join(initialCode);
})();
