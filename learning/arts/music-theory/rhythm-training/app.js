(() => {
    'use strict';
    const C = window.RhythmTrainer, $ = id => document.getElementById(id);
    const storageKey = 'rhythm-training-room-v1';
    let audio, chart, run = null, raf = 0, pageIndex = -1, heads = [], lines = [], mode = 'solo';
    let room = null, credentials = null, pendingResult = null, polling = false, starting = false, loading = false;
    let lastRound = '', streak = 0, pressedTimer = 0;
    const nodes = new Set();
    const config = () => C.settings({ level: $('level').value, bpm: $('bpm').value });
    const seed = () => crypto.getRandomValues(new Uint32Array(1))[0];
    const notice = message => { $('notice').textContent = message; $('notice').hidden = !message; };
    function saveRoom() {
        try { if (credentials) sessionStorage.setItem(storageKey, JSON.stringify({ ...credentials, pendingResult })); else sessionStorage.removeItem(storageKey); } catch (_) {}
    }
    async function api(path, body) {
        const response = await fetch('/api/rhythm-training' + path, {
            method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(credentials ? { Authorization: 'Bearer ' + credentials.token } : {}) },
            ...(body === undefined ? {} : { body: JSON.stringify(body) })
        });
        let data;
        try { data = await response.json(); } catch (_) { throw new Error('서버에 연결하지 못했어요. 로그인 상태를 확인해 주세요.'); }
        if (!response.ok) throw Object.assign(new Error(data.message || '요청을 처리하지 못했어요.'), { status: response.status });
        return data;
    }
    const roomApi = (action = '', body) => api('/rooms/' + credentials.code + action, body);
    function action(id, fn) {
        $(id).addEventListener('click', async () => {
            if (loading) return;
            loading = true;
            try { notice(''); await fn(); } catch (error) { notice(error.message); }
            finally { loading = false; controls(); }
        });
    }
    async function unlock() {
        if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'interactive' });
        await audio.resume();
        if (audio.state !== 'running') throw new Error('화면의 소리 켜기 버튼을 다시 눌러 주세요.');
    }
    function sound(time, accent = false, tap = false) {
        if (!audio || audio.state !== 'running') return;
        const osc = audio.createOscillator(), gain = audio.createGain();
        osc.type = tap ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(tap ? 460 : accent ? 1100 : 780, time);
        gain.gain.setValueAtTime(.0001, time);
        gain.gain.exponentialRampToValueAtTime(tap ? .23 : .11, time + .003);
        gain.gain.exponentialRampToValueAtTime(.0001, time + .055);
        osc.connect(gain); gain.connect(audio.destination); osc.start(time); osc.stop(time + .06);
        nodes.add(osc); osc.onended = () => { nodes.delete(osc); osc.disconnect(); gain.disconnect(); };
    }
    function heardTime() {
        const stamp = audio.getOutputTimestamp?.();
        if (stamp?.performanceTime > 0 && stamp.contextTime > 0) return stamp.contextTime + (performance.now() - stamp.performanceTime) / 1000;
        return audio.currentTime - (audio.outputLatency || 0);
    }
    function silence() { for (const node of nodes) { try { node.stop(); } catch (_) {} } nodes.clear(); }
    function renderScore(page = 0) {
        pageIndex = page; heads = []; lines = [];
        $('score').replaceChildren();
        chart.bars.slice(page * 4, page * 4 + 4).forEach((bar, index) => {
            const card = document.createElement('div'); card.className = 'bar';
            const number = document.createElement('span'); number.className = 'bar-number'; number.textContent = `${page * 4 + index + 1}마디`;
            const svg = RhythmNotation.render(bar, { meter: '4/4', label: `${page * 4 + index + 1}마디 리듬` });
            svg.style.width = '100%';
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('class', 'playhead'); line.setAttribute('y1', '16'); line.setAttribute('y2', '82'); line.style.display = 'none';
            svg.append(line); lines.push(line);
            let beat = (page * 4 + index) * 4;
            const noteHeads = [...svg.querySelectorAll('.rhythm-head')]; let headIndex = 0;
            bar.forEach(note => {
                if (!note.rest) heads.push({ node: noteHeads[headIndex++], time: beat * 60 / chart.bpm });
                beat += C.VALUES[note.v];
            });
            card.append(number, svg); $('score').append(card);
        });
    }
    function fresh() {
        chart = C.chart(config(), seed()); renderScore(); $('result').hidden = true;
        $('feedback').textContent = '준비됐나요?'; $('combo').textContent = '';
        $('phase').textContent = '악보를 보고 두드려요'; $('barCount').textContent = '8마디 · 4/4박자';
    }
    function controls() {
        const busy = Boolean(run || starting);
        $('configFields').disabled = busy || Boolean(room && (!room.me.host || room.phase === 'running'));
        for (const id of ['listen', 'start', 'shuffle', 'retry']) $(id).disabled = busy;
        $('stop').hidden = !busy;
        $('soloTab').disabled = busy || Boolean(room);
        $('classTab').disabled = busy;
        $('leave').disabled = busy;
        $('ready').disabled = busy || room?.phase === 'running' || Boolean(pendingResult);
        $('roomStart').disabled = busy || room?.phase === 'running' || !room?.participants.length || room.participants.some(p => !p.ready);
        document.body.classList.toggle('playing', busy);
    }
    function setMode(next) {
        mode = next; notice('');
        for (const [id, value] of [['soloTab', 'solo'], ['classTab', 'class']]) {
            $(id).classList.toggle('selected', mode === value); $(id).setAttribute('aria-pressed', String(mode === value));
        }
        $('soloControls').hidden = mode !== 'solo'; $('roomEntry').hidden = mode !== 'class' || Boolean(room);
        $('roomControls').hidden = !room; $('ranking').hidden = !room;
        showPractice(!room?.me.host);
        $('retry').hidden = mode !== 'solo'; controls();
    }
    function showPractice(visible) {
        for (const id of ['score', 'beats', 'pad']) $(id).hidden = !visible;
        document.querySelector('.feedback-row').hidden = !visible;
    }
    async function play(demo = false, roundId = '') {
        if (run || starting) return;
        starting = true; controls();
        try {
            await unlock(); silence();
            const beat = 60 / chart.bpm, startAt = audio.currentTime + .18 + beat * 4;
            run = { demo, roundId, startAt, taps: [], nextClick: -4, nextTarget: 0, lastBeat: -99 };
            streak = 0; renderScore(); $('result').hidden = true; $('combo').textContent = '';
            $('feedback').textContent = '네 박 뒤에 시작해요';
            $('pad').focus({ preventScroll: true });
            if (innerWidth <= 620) document.querySelector('.play-area').scrollIntoView({ block: 'start' });
            raf = requestAnimationFrame(frame);
        } finally { starting = false; controls(); }
    }
    function frame() {
        if (!run) return;
        if (audio.state !== 'running') { void finish(true); notice('소리가 중단되어 연주를 멈췄어요. 다시 시작해 주세요.'); return; }
        const beat = 60 / chart.bpm;
        const time = heardTime() - run.startAt;
        // Schedule from the audio clock; rendering never determines sound timing.
        while (run.nextClick < 32 && run.startAt + run.nextClick * beat < audio.currentTime + .15) {
            const at = run.startAt + run.nextClick * beat;
            if (at >= audio.currentTime) sound(at, run.nextClick % 4 === 0);
            run.nextClick++;
        }
        if (run.demo) while (run.nextTarget < chart.targets.length && run.startAt + chart.targets[run.nextTarget] < audio.currentTime + .15) {
            const at = run.startAt + chart.targets[run.nextTarget++];
            if (at >= audio.currentTime) sound(at, false, true);
        }
        const currentBeat = Math.floor(time / beat);
        if (currentBeat !== run.lastBeat) {
            [...$('beats').children].forEach((dot, i) => dot.classList.toggle('active', i === ((currentBeat % 4) + 4) % 4));
            run.lastBeat = currentBeat;
            if (time < 0) { $('phase').textContent = '준비 박자'; $('feedback').textContent = String(Math.min(4, -currentBeat)); }
            else { $('phase').textContent = run.demo ? '리듬을 들어 보세요' : '악보에 맞춰 두드려요'; if (currentBeat === 0) $('feedback').textContent = run.demo ? '듣는 중' : '시작!'; }
        }
        if (time >= 0 && time < chart.duration) {
            const bar = Math.floor(time / beat / 4), page = Math.floor(bar / 4);
            if (page !== pageIndex) renderScore(page);
            $('barCount').textContent = `${bar + 1} / 8마디`;
            [...$('score').children].forEach((node, index) => node.classList.toggle('active', index === bar % 4));
            lines.forEach((line, index) => { line.style.display = index === bar % 4 ? '' : 'none'; });
            const within = time / beat % 4, x = 56 + within * 74 + Math.floor(within) * 10;
            lines[bar % 4].setAttribute('x1', String(x)); lines[bar % 4].setAttribute('x2', String(x));
            paintMarks(time);
        }
        if (time > chart.duration + .15) { void finish(false); return; }
        raf = requestAnimationFrame(frame);
    }
    function paintMarks(time) {
        const result = C.judge(chart, run.taps);
        for (const head of heads) {
            const mark = result.marks.find(m => Math.abs(m.time - head.time) < .001);
            head.node?.classList.toggle('hit', run.demo ? time >= head.time : mark?.hit);
            head.node?.classList.toggle('missed', !run.demo && !mark?.hit && time > head.time + .14);
        }
    }
    function tap() {
        $('pad').classList.add('pressed'); clearTimeout(pressedTimer);
        pressedTimer = setTimeout(() => $('pad').classList.remove('pressed'), 100);
        if (audio?.state === 'running') sound(audio.currentTime, false, true);
        else if (!run) void unlock().then(() => sound(audio.currentTime, false, true)).catch(error => notice(error.message));
        if (!run || run.demo) return;
        const time = heardTime() - run.startAt;
        if (time < -.14 || time > chart.duration + .14 || run.taps.length >= 512) return;
        const before = C.judge(chart, run.taps);
        run.taps.push(time);
        const after = C.judge(chart, run.taps);
        if (after.hits > before.hits) {
            const mark = after.marks.find((m, i) => m.hit && !before.marks[i].hit);
            const previous = after.marks.slice(0, after.marks.indexOf(mark));
            streak = previous.length && !previous[previous.length - 1].hit ? 1 : streak + 1;
            $('feedback').textContent = mark.points === 1 ? '정확해요!' : mark.error < 0 ? '조금 빨라요' : '조금 늦어요';
        } else { streak = 0; $('feedback').textContent = '악보의 치는 자리를 확인해요'; }
        $('combo').textContent = streak > 1 ? `${streak}번 연속` : '';
    }
    async function submitResult() {
        if (!pendingResult || !credentials) return;
        try {
            const state = await roomApi('/result', pendingResult);
            pendingResult = null; saveRoom(); $('submitRetry').hidden = true; updateRoom(state);
        } catch (error) { notice('결과 전송을 완료하지 못했어요. ' + error.message); $('submitRetry').hidden = false; }
    }
    async function finish(interrupted) {
        if (!run) return;
        const ended = run; run = null; cancelAnimationFrame(raf); silence();
        [...$('beats').children].forEach(dot => dot.classList.remove('active'));
        lines.forEach(line => { line.style.display = 'none'; });
        [...$('score').children].forEach(node => node.classList.remove('active'));
        controls();
        $('phase').textContent = interrupted ? '연주를 멈췄어요' : ended.demo ? '듣기 완료' : '연습 완료';
        $('feedback').textContent = interrupted ? '다시 도전해요' : ended.demo ? '이제 직접 두드려 보세요' : '연주 끝!';
        if (!ended.demo && !interrupted) {
            const result = C.judge(chart, ended.taps);
            $('accuracy').textContent = result.accuracy + '%'; $('perfect').textContent = result.perfect;
            $('misses').textContent = result.misses; $('extras').textContent = result.extras; $('result').hidden = false;
        }
        if (ended.roundId && credentials) { pendingResult = { roundId: ended.roundId, taps: ended.taps, interrupted }; saveRoom(); await submitResult(); }
    }
    function updateRoom(state) {
        room = state; $('roomCode').textContent = state.code;
        showPractice(!state.me.host);
        if (state.me.host) {
            $('phase').textContent = state.phase === 'running' ? '학생들이 연주하고 있어요' : state.phase === 'results' ? '이번 판 결과' : '학생들의 입장을 기다려요';
            $('barCount').textContent = `${state.participants.length}명 입장`;
            $('result').hidden = true;
        }
        $('roomEntry').hidden = true; $('roomControls').hidden = false; $('ranking').hidden = false;
        $('ready').hidden = state.me.host; $('roomStart').hidden = !state.me.host;
        $('roomStop').hidden = !state.me.host || state.phase !== 'running';
        $('ready').textContent = state.me.ready ? '준비 완료 · 취소' : '소리 켜고 준비';
        $('roomPhase').textContent = state.phase === 'running' ? '연주 중' : state.phase === 'results' ? '결과' : '입장 중';
        $('roomHint').textContent = state.me.host ? '모두 준비하면 시작해 주세요. 정확도, 평균 오차 순으로 순위를 매겨요.' : '준비를 누르면 선생님이 시작할 때 네 박을 듣고 연주해요.';
        $('players').replaceChildren();
        for (const p of state.participants) {
            const row = document.createElement('li'); row.classList.toggle('me', p.id === state.me.id);
            const rank = document.createElement('span'); rank.className = 'rank'; rank.textContent = p.rank ? p.rank + '위' : '—';
            const name = document.createElement('span'); name.textContent = p.name;
            const status = document.createElement('span'); status.className = 'player-state';
            status.textContent = p.result ? `${p.result.accuracy}% · ${p.result.errorMs === null ? '—' : p.result.errorMs + 'ms'}`
                : state.phase === 'running' ? (p.status === 'interrupted' ? '중단' : p.status === 'playing' ? '연주 중' : '시작 대기')
                : p.ready ? '준비 완료' : p.status === 'interrupted' ? '중단 · 다음 판 준비' : '준비 중';
            row.append(rank, name, status); $('players').append(row);
        }
        if (!state.me.host) { $('level').value = state.config.level; $('bpm').value = state.config.bpm; $('bpmValue').value = state.config.bpm; }
        if (state.phase === 'running' && !state.me.host && state.me.status === 'pending' && lastRound !== state.roundId && !starting && !run) {
            lastRound = state.roundId; void beginRoomRound(state.roundId);
        }
        if (state.phase !== 'running' && run?.roundId) { run.roundId = ''; void finish(true); }
        if (pendingResult && (pendingResult.roundId !== state.roundId || (state.phase !== 'running' && state.me.status === 'interrupted'))) {
            pendingResult = null; saveRoom(); $('submitRetry').hidden = true;
        }
        controls();
    }
    async function beginRoomRound(roundId) {
        let began = false;
        try {
            const data = await roomApi('/begin', { roundId }); began = true; chart = data.chart;
            await play(false, roundId);
        } catch (error) {
            notice(error.message);
            if (began) { pendingResult = { roundId, interrupted: true, taps: [] }; saveRoom(); await submitResult(); }
            else lastRound = '';
        }
    }
    async function poll() {
        if (!credentials || polling) return;
        polling = true;
        try {
            const state = await roomApi();
            // Refreshing a playing tab must never provide a second attempt in the same round.
            if (!run && !starting && !state.me.host && state.me.status === 'playing' && !pendingResult && state.roundId !== lastRound) {
                lastRound = state.roundId; pendingResult = { roundId: state.roundId, interrupted: true, taps: [] }; saveRoom(); await submitResult();
            } else updateRoom(state);
        } catch (error) {
            notice(error.message);
            if (error.status === 403 || error.status === 404) {
                credentials = null; room = null; pendingResult = null; saveRoom();
                if (run) await finish(true); setMode('class'); notice(error.message);
            }
        } finally { polling = false; }
    }
    function acceptRoom(data) {
        credentials = { code: data.state.code, token: data.token }; pendingResult = null; lastRound = '';
        saveRoom(); updateRoom(data.state);
    }
    action('soloTab', () => setMode('solo')); action('classTab', () => setMode('class'));
    action('start', () => play()); action('retry', () => play()); action('listen', () => play(true));
    action('shuffle', fresh); action('stop', () => finish(true));
    for (const id of ['level', 'bpm']) $(id).addEventListener('input', () => { $('bpmValue').value = $('bpm').value; if (!room) fresh(); });
    $('pad').addEventListener('pointerdown', event => { if (!event.isPrimary || event.button !== 0) return; event.preventDefault(); tap(); });
    $('pad').addEventListener('click', event => { if (event.detail === 0) tap(); });
    document.addEventListener('keydown', event => {
        if (event.code !== 'Space' || event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.target.closest('input,select,textarea,a,button:not(#pad),[contenteditable=true]')) return;
        event.preventDefault();
        if (!event.repeat) tap();
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden && run) { void finish(true); notice('다른 화면으로 이동해 연주를 멈췄어요.'); } });
    $('joinForm').addEventListener('submit', async event => {
        event.preventDefault(); if (loading) return; loading = true; $('join').disabled = true;
        try { notice(''); await unlock(); acceptRoom(await api('/rooms/' + $('code').value.trim() + '/join', { name: $('name').value.trim() })); }
        catch (error) { notice(error.message); } finally { loading = false; $('join').disabled = false; }
    });
    action('create', async () => acceptRoom(await api('/rooms', config())));
    action('ready', async () => { await unlock(); sound(audio.currentTime, true); updateRoom(await roomApi('/ready', { ready: !room.me.ready })); });
    action('roomStart', async () => updateRoom(await roomApi('/start', config())));
    action('roomStop', async () => updateRoom(await roomApi('/stop', {})));
    action('leave', async () => { await roomApi('/leave', {}); credentials = null; room = null; pendingResult = null; saveRoom(); setMode('class'); fresh(); });
    action('copy', async () => {
        const link = new URL(location.href); link.search = ''; link.searchParams.set('room', credentials.code);
        try { await navigator.clipboard.writeText(link.href); notice('초대 링크를 복사했어요.'); }
        catch (_) { notice('초대 주소: ' + link.href); }
    });
    const submitButton = document.createElement('button'); submitButton.id = 'submitRetry'; submitButton.className = 'secondary'; submitButton.hidden = true; submitButton.textContent = '결과 다시 보내기';
    $('ranking').before(submitButton); action('submitRetry', submitResult);
    $('name').value = window.CLASS_PLAYER_NAME || '';
    fresh();
    const code = new URLSearchParams(location.search).get('room');
    if (code && /^\d{6}$/.test(code)) { $('code').value = code; setMode('class'); }
    try {
        const saved = JSON.parse(sessionStorage.getItem(storageKey));
        if (saved?.token && /^\d{6}$/.test(saved.code)) {
            credentials = { token: saved.token, code: saved.code }; pendingResult = saved.pendingResult || null;
            setMode('class'); if (pendingResult) void submitResult(); void poll();
        }
    } catch (_) {}
    void api('/session').then(data => { $('create').hidden = !data.isTeacher; $('teacherHint').hidden = data.isTeacher; }).catch(() => {});
    setInterval(poll, 1200);
})();
