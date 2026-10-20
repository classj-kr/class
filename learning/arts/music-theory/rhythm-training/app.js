(() => {
    'use strict';
    const C = window.RhythmTrainer, $ = id => document.getElementById(id);
    const storageKey = 'rhythm-training-room-v1';
    const syncCheck = new URLSearchParams(location.search).get('syncCheck') === '1';
    let requestedSeed = new URLSearchParams(location.search).get('seed');
    let syncMode = 'sound';
    const syncResults = new Map();
    let audio, chart, run = null, raf = 0, heads = [], lines = [], mode = 'solo', scoreColumns = 0;
    let room = null, credentials = null, pendingResult = null, polling = false, starting = false, loading = false;
    let lastRound = '', streak = 0, pressedTimer = 0;
    let question = null, answered = false, selectedCells = new Set();
    let tempoLevel = null;
    let completedPerformance = null;
    const listening = () => !syncCheck && mode === 'solo' && $('activity').value !== 'tap';
    const nodes = new Set();
    const linePositions = new WeakMap();
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const feedbackColors = { perfect: '#8ce4c4', miss: '#ffa0a6', wrong: '#ffa0a6' };
    function resetFeedback() {
        delete $('pad').dataset.judgment;
        delete $('feedback').dataset.judgment;
        document.querySelector('.play-area').style.removeProperty('--hit-color');
        $('tapEffects').getAnimations({ subtree: true }).forEach(animation => animation.cancel());
    }
    function burst(event, kind) {
        const pad = $('pad'), effects = $('tapEffects');
        const rect = pad.getBoundingClientRect();
        const pointer = event?.type === 'pointerdown';
        effects.style.left = (pointer ? event.clientX - rect.left : rect.width / 2) + 'px';
        effects.style.top = (pointer ? event.clientY - rect.top : rect.height / 2) + 'px';
        effects.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
        if (reducedMotion.matches) return;
        effects.querySelectorAll('.tap-ring').forEach((ring, index) => {
            if (index && kind !== 'perfect') return;
            ring.animate([{ opacity: .8, transform: 'translate(-50%,-50%) scale(.35)' },
                { opacity: 0, transform: 'translate(-50%,-50%) scale(2.5)' }],
            { duration: 420, delay: index * 65, easing: 'cubic-bezier(.15,.6,.3,1)' });
        });
        effects.querySelectorAll('.tap-spark').forEach((spark, index) => {
            const angle = index * Math.PI / 4, distance = kind === 'perfect' ? 75 : 46;
            spark.animate([{ opacity: .95, transform: 'translate(-50%,-50%) scale(1)' },
                { opacity: 0, transform: `translate(${Math.cos(angle) * distance}px,${Math.sin(angle) * distance}px) scale(.2)` }],
            { duration: kind === 'perfect' ? 450 : 280, easing: 'ease-out' });
        });
    }
    function feedback(kind, event) {
        if (syncCheck) return;
        const messages = { perfect: '맞았어요!', miss: '박자가 지났어요', wrong: '박자 위치가 달라요' };
        $('feedback').textContent = messages[kind]; $('feedback').dataset.judgment = kind;
        $('pad').dataset.judgment = kind;
        document.querySelector('.play-area').style.setProperty('--hit-color', feedbackColors[kind]);
        $('combo').textContent = streak > 1 ? `${streak} COMBO` : '';
        if (!reducedMotion.matches) {
            $('feedback').getAnimations().forEach(animation => animation.cancel());
            $('feedback').animate([{ transform: 'scale(1.16)', opacity: .65 }, { transform: 'scale(1)', opacity: 1 }], { duration: 180, easing: 'ease-out' });
            if (streak > 1) {
                $('combo').getAnimations().forEach(animation => animation.cancel());
                $('combo').animate([{ transform: 'translateY(5px) scale(1.15)' }, { transform: 'translateY(0) scale(1)' }], { duration: 180 });
            }
        }
        if (kind !== 'miss') burst(event, kind);
    }
    const config = () => C.settings({ level: $('level').value, bpm: $('bpm').value });
    const seed = () => requestedSeed !== null && /^\d{1,10}$/.test(requestedSeed) && Number(requestedSeed) <= 0xffffffff
        ? Number(requestedSeed) : crypto.getRandomValues(new Uint32Array(1))[0];
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
        if (!audio) {
            const Context = window.AudioContext || window.webkitAudioContext;
            if (!Context) throw new Error('이 브라우저에서 소리를 재생할 수 없어요. 다른 브라우저로 열어 주세요.');
            audio = new Context({ latencyHint: 'interactive' });
        }
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
    function heardTime(performanceTime = performance.now()) {
        const stamp = audio.getOutputTimestamp?.();
        if (stamp?.performanceTime > 0 && stamp.contextTime > 0) return stamp.contextTime + (performanceTime - stamp.performanceTime) / 1000;
        return audio.currentTime - (audio.outputLatency || 0) - Math.max(0, performance.now() - performanceTime) / 1000;
    }
    function inputClock(event) {
        const now = performance.now(), eventTime = Number(event?.timeStamp);
        const at = eventTime > 0 && eventTime <= now && now - eventTime < 1000 ? eventTime : now;
        return { time: run ? heardTime(at) - run.startAt : 0, queueMs: Math.round((now - at) * 1000) / 1000 };
    }
    function silence() { for (const node of nodes) { try { node.stop(); } catch (_) {} } nodes.clear(); }
    function renderScore() {
        heads = []; lines = [];
        $('score').replaceChildren();
        scoreColumns = $('score').clientWidth >= 620 ? 4 : 2;
        const ns = 'http://www.w3.org/2000/svg';
        let system, offset = 0, targetIndex = 0;
        chart.bars.forEach((bar, index) => {
            const firstInLine = index % scoreColumns === 0;
            if (firstInLine) {
                system = document.createElementNS(ns, 'svg');
                system.setAttribute('class', 'rhythm score-system');
                system.setAttribute('role', 'img');
                system.setAttribute('aria-label', `${index + 1}~${Math.min(index + scoreColumns, chart.bars.length)}마디 리듬`);
                $('score').append(system); offset = 0;
            }
            const first = index === 0, left = first ? 44 : 18;
            const svg = RhythmNotation.render(bar, { meter: first ? '4/4' : null, left, beatWidth: 52, beatGap: 6 });
            const width = svg.viewBox.baseVal.width;
            if (!firstInLine) svg.querySelector('.rhythm-bar:not(.is-end)').remove();
            const end = svg.querySelector('.is-end');
            end.classList.remove('is-end');
            if (index === chart.bars.length - 1) {
                const thin = end.cloneNode(); thin.setAttribute('x1', width - 16); thin.setAttribute('x2', width - 16);
                svg.append(thin); end.classList.add('is-end');
            }
            const measure = document.createElementNS(ns, 'g');
            measure.setAttribute('class', 'score-measure');
            measure.setAttribute('transform', `translate(${offset} 0)`);
            measure.dataset.bar = String(index + 1);
            const highlight = document.createElementNS(ns, 'rect');
            for (const [key, value] of Object.entries({ class: 'measure-highlight', x: 10, y: 16, width: width - 21, height: 66 })) highlight.setAttribute(key, value);
            measure.append(highlight, ...svg.childNodes);
            const line = document.createElementNS(ns, 'line');
            line.setAttribute('class', 'playhead'); line.setAttribute('y1', '16'); line.setAttribute('y2', '82'); line.style.display = 'none';
            line.dataset.onset = String(left + 12);
            let position = 0;
            const anchors = RhythmNotation.notate(bar).map(note => {
                const point = [position, left + 12 + position * 52 + Math.floor(position + .000001) * 6];
                position += RhythmNotation.VALUES[note.v].beats;
                return point;
            });
            const nextOnThisLine = index + 1 < chart.bars.length && (index + 1) % scoreColumns !== 0;
            anchors.push([4, nextOnThisLine ? width - 21 + 30 : width - 11]);
            linePositions.set(line, anchors);
            measure.append(line); system.append(measure); lines.push(line);
            offset += width - 21;
            system.setAttribute('viewBox', `0 11 ${offset + 21} 75`);
            let cells = index * 48, attackTime = 0, attackIndex = 0;
            const noteHeads = [...measure.querySelectorAll('.rhythm-head')]; let headIndex = 0;
            RhythmNotation.notate(bar).forEach((note, noteIndex, written) => {
                if (!note.rest) {
                    const node = noteHeads[headIndex++];
                    if (!(noteIndex && written[noteIndex - 1].tie && !written[noteIndex - 1].rest)) {
                        attackTime = cells / 12 * 60 / chart.bpm; attackIndex = targetIndex++;
                    }
                    heads.push({ node, time: attackTime, index: attackIndex });
                }
                cells += RhythmNotation.VALUES[note.v].cells;
            });
        });
        if (completedPerformance?.chart === chart) {
            paintMarks(chart.duration + 60 / chart.bpm, completedPerformance.result, false);
            describeMarks(completedPerformance.result);
        }
    }
    function buildListening() {
        answered = false; selectedCells = new Set();
        $('beatGrid').replaceChildren(); $('barChoices').replaceChildren();
        $('listeningFeedback').textContent = '';
        $('listeningFeedback').removeAttribute('data-correct');
        $('listeningAnswer').replaceChildren(); $('listeningAnswer').hidden = true;
        $('beatGrid').hidden = !question.grid; $('barChoices').hidden = !question.bars;
        $('listeningPrompt').textContent = question.grid
            ? '리듬을 듣고, 소리가 시작하는 자리를 모두 골라 주세요.'
            : '리듬을 듣고, 같은 리듬의 악보를 골라 주세요.';
        if (question.grid) {
            const cells = question.grid.cells, perBeat = cells / 4;
            $('beatGrid').style.setProperty('--cells', String(cells));
            for (let cell = 0; cell < cells; cell++) {
                const button = document.createElement('button');
                button.type = 'button'; button.dataset.cell = String(cell);
                button.className = 'beat-cell' + (cell % perBeat === 0 ? ' is-beat' : '');
                button.textContent = cell % perBeat === 0 ? String(cell / perBeat + 1) : '·';
                button.setAttribute('aria-label', `${Math.floor(cell / perBeat) + 1}박의 ${cell % perBeat + 1}번째 자리`);
                button.setAttribute('aria-pressed', 'false');
                button.addEventListener('click', () => {
                    if (run || starting || answered) return;
                    if (selectedCells.has(cell)) selectedCells.delete(cell); else selectedCells.add(cell);
                    button.setAttribute('aria-pressed', String(selectedCells.has(cell)));
                });
                $('beatGrid').append(button);
            }
        }
        if (question.bars) question.bars.list.forEach((bar, index) => {
            const button = document.createElement('button');
            button.type = 'button'; button.className = 'bar-choice'; button.dataset.index = String(index);
            button.setAttribute('aria-label', `${index + 1}번 악보`);
            const number = document.createElement('span'); number.textContent = String(index + 1);
            button.append(number, RhythmNotation.render(bar, { meter: '4/4' }));
            button.addEventListener('click', () => { if (!run && !starting && !answered) gradeListening(index === question.bars.answer, index); });
            $('barChoices').append(button);
        });
    }
    function submitListening() {
        if (!question?.grid || answered || run || starting) return;
        const want = question.grid.answer;
        gradeListening(want.length === selectedCells.size && want.every(cell => selectedCells.has(cell)));
    }
    function gradeListening(correct, picked = -1) {
        // Explicit cues work for every attempt, including repeated wrong answers.
        window.ClassGameSfx?.play(correct ? 'success' : 'error');
        if (!correct) {
            if (question.bars && picked >= 0) $('barChoices').children[picked].classList.add('wrong');
            $('listeningFeedback').textContent = '아직 아니에요. 다시 듣고 답해 보세요.';
            $('listeningFeedback').dataset.correct = 'false';
            controls(); return;
        }
        revealListening(true, picked);
    }
    function revealListening(correct, picked = -1, manual = false) {
        answered = true;
        if (question.grid) for (const button of $('beatGrid').children) {
            const cell = Number(button.dataset.cell), want = question.grid.answer.includes(cell);
            button.classList.add(want ? selectedCells.has(cell) ? 'right' : 'missed' : selectedCells.has(cell) ? 'wrong' : 'empty');
        }
        if (question.bars) for (const [index, button] of [...$('barChoices').children].entries()) {
            button.classList.remove('right', 'wrong', 'dim');
            button.classList.add(index === question.bars.answer ? 'right' : index === picked ? 'wrong' : 'dim');
        }
        $('listeningFeedback').textContent = manual ? '정답을 확인하고 다음 문제에 도전해 보세요.' : '맞았어요!';
        if (manual) $('listeningFeedback').removeAttribute('data-correct');
        else $('listeningFeedback').dataset.correct = String(correct);
        const caption = document.createElement('p'); caption.textContent = '정답';
        $('listeningAnswer').replaceChildren(caption, RhythmNotation.render(question.rhythm.bar, { meter: '4/4' }));
        $('listeningAnswer').hidden = false; controls();
    }
    function renderLessons() {
        for (const [index, lesson] of RhythmLessons.lessons.filter(lesson => lesson.body).entries()) {
            const card = document.createElement('details'); card.className = 'lesson-card';
            const title = document.createElement('summary'); title.textContent = `${index + 1}. ${lesson.title}`; card.append(title);
            for (const text of lesson.body) { const p = document.createElement('p'); p.textContent = text; card.append(p); }
            const examples = document.createElement('div'); examples.className = 'lesson-examples';
            for (const example of lesson.examples || []) {
                const bar = example.pattern.split(/\s+/).map(token => ({ v: token.replace('-', ''), rest: token.startsWith('-') }));
                const button = document.createElement('button'); button.type = 'button';
                const label = document.createElement('span'); label.textContent = `${example.caption} · 듣기`;
                button.append(label, RhythmNotation.render(bar, { meter: '4/4' }));
                button.addEventListener('click', () => void previewBar(bar)); examples.append(button);
            }
            card.append(examples);
            const actions = document.createElement('div'); actions.className = 'lesson-actions';
            for (const [activity, text] of [['tap', '악보 보고 치기'], ['grid', '듣고 맞히기']]) {
                const button = document.createElement('button'); button.type = 'button'; button.textContent = text;
                button.addEventListener('click', () => {
                    $('activity').value = activity; $('level').value = String(lesson.level); $('length').value = '1';
                    $('lessonDetails').open = false; fresh();
                }); actions.append(button);
            }
            card.append(actions); $('lessonList').append(card);
        }
    }
    async function previewBar(bar) {
        if (run || starting) return;
        const previous = chart;
        chart = C.fromBars(config(), [bar]); renderScore();
        try { await play(true); if (run) run.restoreChart = previous; }
        catch (error) { chart = previous; renderScore(); notice(error.message); }
    }
    function fresh() {
        updateTempoRange(true);
        resetFeedback();
        if (syncCheck) {
            question = null;
            chart = C.fromBars({ level: 0, bpm: 80 }, syncMode === 'subdivision'
                ? Array.from({ length: 2 }, () => Array.from({ length: 16 }, () => ({ v: 's' })))
                : Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => ({ v: 'q' }))));
        } else if (listening()) {
            question = RhythmQuestions.make(config().level, $('activity').value);
            chart = C.fromBars(config(), [question.rhythm.bar], seed());
            buildListening();
        } else {
            question = null;
            chart = C.chart(config(), seed(), mode === 'class' ? 8 : Number($('length').value));
        }
        renderScore(); $('result').hidden = true;
        $('feedback').textContent = ''; $('combo').textContent = '';
        $('phase').textContent = ''; $('barCount').textContent = `${chart.bars.length}마디 · 4/4박자`;
        showPractice(true); controls();
    }
    function updateTempoRange(useInitial = false) {
        const level = Number($('level').value), range = C.tempoRange(level);
        if (useInitial && tempoLevel !== level && mode === 'solo' && !syncCheck && !room && (level === 3 || level === 7)) {
            $('bpm').value = String(Math.min(Number($('bpm').value), range.initial));
        }
        $('bpm').min = String(range.min); $('bpm').max = String(range.max);
        $('bpm').value = String(C.settings({ level, bpm: $('bpm').value }).bpm);
        $('bpmValue').value = $('bpm').value;
        $('bpmLimits').textContent = `${range.min}–${range.max} BPM`;
        tempoLevel = level;
    }
    function controls() {
        updateTempoRange();
        const busy = Boolean(run || starting);
        $('configFields').disabled = busy || Boolean(room && (!room.me.host || room.phase === 'running'));
        for (const id of ['listen', 'start', 'shuffle', 'retry']) $(id).disabled = busy;
        $('stop').hidden = !busy;
        $('soloTab').disabled = busy || Boolean(room);
        $('classTab').disabled = busy;
        $('leave').disabled = busy;
        $('ready').disabled = busy || room?.phase === 'running' || Boolean(pendingResult);
        $('roomStart').disabled = busy || room?.phase === 'running' || !room?.participants.length || room.participants.some(p => !p.ready);
        $('activityFields').hidden = mode !== 'solo';
        $('lengthFields').hidden = mode !== 'solo' || listening();
        $('lessonDetails').hidden = mode !== 'solo';
        $('lessonDetails').querySelectorAll('button').forEach(button => { button.disabled = busy; });
        $('listeningPanel').querySelectorAll('button').forEach(button => { button.disabled = busy || answered; });
        $('showAnswer').hidden = answered;
        $('listen').textContent = listening() ? '리듬 듣기' : '먼저 듣기';
        $('start').hidden = listening() && Boolean(question?.bars) && !answered;
        $('start').textContent = listening() ? (answered ? '다음 문제' : '정답 확인') : '연습 시작';
        $('shuffle').textContent = listening() ? '새 문제' : '새 리듬';
        if (syncCheck) {
            $('configFields').hidden = true; $('listen').hidden = true; $('shuffle').hidden = true; $('lessonDetails').hidden = true;
            document.querySelector('.topbar nav').hidden = true;
            for (const id of ['syncSound', 'syncVisual', 'syncSubdivide']) $(id).disabled = busy;
            $('start').textContent = syncMode === 'sound' ? '소리 확인 시작' : syncMode === 'visual' ? '화면 확인 시작' : '16분 입력 확인 시작';
        }
        document.body.classList.toggle('playing', busy);
    }
    function setMode(next) {
        mode = next; notice('');
        for (const [id, value] of [['soloTab', 'solo'], ['classTab', 'class']]) {
            $(id).classList.toggle('selected', mode === value); $(id).setAttribute('aria-pressed', String(mode === value));
        }
        $('soloControls').hidden = mode !== 'solo'; $('roomEntry').hidden = mode !== 'class' || Boolean(room);
        $('roomControls').hidden = !room; $('ranking').hidden = !room;
        if (!room) fresh();
        showPractice(!room?.me.host);
        $('retry').hidden = mode !== 'solo'; controls();
    }
    function showPractice(visible) {
        $('score').hidden = !visible || listening() || syncCheck && syncMode !== 'visual';
        $('beats').hidden = !visible || syncCheck && syncMode !== 'visual';
        $('pad').hidden = !visible || listening();
        $('listeningPanel').hidden = !visible || !listening();
        document.querySelector('.feedback-row').hidden = !visible || listening() || syncCheck;
    }
    async function play(demo = false, roundId = '') {
        if (run || starting) return;
        starting = true; controls();
        try {
            await unlock(); silence();
            completedPerformance = null;
            const beat = 60 / chart.bpm, startAt = audio.currentTime + .18 + beat * 4;
            run = { demo, roundId, startAt, taps: [], result: C.judge(chart, []), nextMiss: 0, lastBeat: -99,
                input: { keydowns: 0, keyups: 0, repeats: 0, ignoredFocus: 0, outside: 0 }, keys: [], clocks: [], queue: [], audioPlan: [] };
            // Queue the entire short exercise on the audio rendering thread before
            // drawing. A slow or hidden page must never drop a metronome click.
            for (let click = -4; (!syncCheck || syncMode !== 'visual') && click < chart.bars.length * 4; click += syncCheck && syncMode === 'subdivision' && click >= 0 ? .25 : 1) {
                const at = startAt + click * beat;
                sound(at, click % 4 === 0);
                run.audioPlan.push({ kind: 'metronome', beat: click, time: at - startAt });
            }
            if (demo) for (const target of chart.targets) {
                sound(startAt + target, false, true);
                run.audioPlan.push({ kind: 'rhythm', beat: target / beat, time: target });
            }
            resetFeedback();
            streak = 0; renderScore(); $('result').hidden = true; $('combo').textContent = '';
            $('feedback').textContent = '4';
            (listening() ? $('stop') : $('pad')).focus({ preventScroll: true });
            if (innerWidth <= 620) document.querySelector('.play-area').scrollIntoView({ block: 'start' });
            raf = requestAnimationFrame(frame);
        } finally { starting = false; controls(); }
    }
    function frame() {
        if (!run) return;
        if (audio.state !== 'running') { void finish(true); notice('소리가 중단되어 연주를 멈췄어요. 다시 시작해 주세요.'); return; }
        const beat = 60 / chart.bpm;
        const time = heardTime() - run.startAt;
        const currentBeat = Math.floor(time / beat);
        if (currentBeat !== run.lastBeat) {
            run.clocks.push({ beat: currentBeat, outputGapMs: Math.round((audio.currentTime - heardTime()) * 1000),
                outputLatencyMs: Math.round((audio.outputLatency || 0) * 1000), baseLatencyMs: Math.round((audio.baseLatency || 0) * 1000) });
            [...$('beats').children].forEach((dot, i) => dot.classList.toggle('active', i === ((currentBeat % 4) + 4) % 4));
            run.lastBeat = currentBeat;
            if (time < 0) { $('phase').textContent = '준비 박자'; $('feedback').textContent = String(Math.min(4, -currentBeat)); }
            else { $('phase').textContent = run.demo ? '듣는 중' : '연주 중'; if (currentBeat === 0 && !run.taps.length) $('feedback').textContent = ''; }
        }
        if (!run.demo) expireMisses(time);
        if (time >= 0 && time < chart.duration) {
            const bar = Math.floor(time / beat / 4);
            $('barCount').textContent = `${bar + 1} / ${chart.bars.length}마디`;
            $('score').querySelectorAll('.score-measure').forEach((node, index) => node.classList.toggle('active', index === bar));
            lines.forEach((line, index) => { line.style.display = index === bar ? '' : 'none'; });
            const within = time / beat % 4, x = C.playheadX(linePositions.get(lines[bar]), within);
            lines[bar].setAttribute('x1', String(x)); lines[bar].setAttribute('x2', String(x));
            paintMarks(time);
        }
        if (time > chart.duration + beat / 4) { void finish(false); return; }
        raf = requestAnimationFrame(frame);
    }
    function paintMarks(time, result = run?.result, demo = run?.demo) {
        if (syncCheck || !result) return;
        for (const head of heads) {
            const mark = result.marks.find(m => Math.abs(m.time - head.time) < .001);
            head.node?.classList.toggle('hit', demo ? time >= head.time : mark?.points === 1);
            head.node?.classList.toggle('missed', !demo && (mark?.hit && mark.points === 0 && time >= head.time
                || !mark?.hit && time > head.time + C.connectionWindow(chart, head.index, 'late')));
        }
    }
    function expireMisses(time) {
        let missed = false;
        while (run.nextMiss < chart.targets.length && chart.targets[run.nextMiss] + C.connectionWindow(chart, run.nextMiss, 'late') < time) {
            if (!run.result.marks[run.nextMiss].hit) missed = true;
            run.nextMiss++;
        }
        if (missed) { streak = 0; feedback('miss'); }
    }
    function tap(event, clock = inputClock(event)) {
        // Capture the audio-clock position before rendering. Input feedback is silent:
        // speaker/Bluetooth output delay must not produce a second, late tapping beat.
        const time = clock.time;
        $('pad').classList.add('pressed'); clearTimeout(pressedTimer);
        pressedTimer = setTimeout(() => $('pad').classList.remove('pressed'), 100);
        if (!run || run.demo || listening()) { if (!listening()) burst(event); return 'inactive'; }
        if (time < -C.noteWindow(chart, 0, 'early') || time > chart.duration + 60 / chart.bpm / 4 || run.taps.length >= 512) { run.input.outside++; return 'outside'; }
        run.queue.push(clock.queueMs);
        expireMisses(time);
        run.taps.push(time);
        const { result: after, inputs } = C.analyze(chart, run.taps);
        const input = inputs[inputs.length - 1];
        run.result = after;
        if (input.accepted) {
            const mark = after.marks[input.target];
            const previous = after.marks.slice(0, after.marks.indexOf(mark));
            streak = mark.points !== 1 ? 0 : previous.length && previous[previous.length - 1].points !== 1 ? 1 : streak + 1;
            feedback(mark.points === 1 ? 'perfect' : 'wrong', event);
            if (!syncCheck) $('feedback').textContent = `맞음 · ${notePosition(mark.time)}`;
        } else {
            streak = 0; feedback('wrong', event);
            if (!syncCheck) $('feedback').textContent = input.target >= 0 ? `박자 오류 · ${notePosition(chart.targets[input.target])}` : '추가 입력';
        }
        paintMarks(time);
        return 'recorded';
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
        resetFeedback();
        [...$('beats').children].forEach(dot => dot.classList.remove('active'));
        lines.forEach(line => { line.style.display = 'none'; });
        $('score').querySelectorAll('.score-measure').forEach(node => node.classList.remove('active'));
        controls();
        $('phase').textContent = interrupted ? '연주를 멈췄어요' : ended.demo ? '듣기 완료' : '연습 완료';
        $('feedback').textContent = ''; $('combo').textContent = '';
        if (!ended.demo && !interrupted && !syncCheck) {
            const result = C.judge(chart, ended.taps);
            completedPerformance = { chart, result };
            paintMarks(chart.duration + 60 / chart.bpm, result, false);
            describeMarks(result);
            $('accuracy').textContent = result.accuracy + '%'; $('perfect').textContent = result.perfect;
            $('hitRate').textContent = `음표 적중률 ${(100 * result.hits / result.marks.length).toFixed(1)}% · 입력 ${ended.taps.length}회 / 음표 ${result.marks.length}개`;
            $('misses').textContent = result.misses; $('timingWrong').textContent = result.timingWrong; $('extras').textContent = result.extras; $('result').hidden = false;
            renderJudgmentDetails(ended, result);
        }
        if (!ended.demo) timingReport(ended, interrupted);
        if (ended.restoreChart) { chart = ended.restoreChart; renderScore(); $('barCount').textContent = `${chart.bars.length}마디 · 4/4박자`; }
        if (ended.roundId && credentials) { pendingResult = { roundId: ended.roundId, taps: ended.taps, interrupted }; saveRoom(); await submitResult(); }
    }
    function notePosition(time) {
        const value = time * chart.bpm / 60;
        return `${Math.floor(value / 4) + 1}마디 ${(value % 4 + 1).toFixed(2)}박`;
    }
    function markDescription(mark) {
        if (!mark.hit) return '입력 기록 없음';
        const ms = Number((mark.error * 1000).toFixed(1));
        return `${mark.points === 1 ? '맞음' : '박자 오류'} · ${ms < 0 ? '빠름' : '늦음'} ${Math.abs(ms)}ms`;
    }
    function describeMarks(result) {
        for (const head of heads) {
            const mark = result.marks[head.index];
            let title = head.node.querySelector('title');
            if (!title) { title = document.createElementNS('http://www.w3.org/2000/svg', 'title'); head.node.append(title); }
            title.textContent = `${notePosition(mark.time)} · ${markDescription(mark)}`;
        }
    }
    function renderJudgmentDetails(ended, result) {
        const body = $('judgmentRows'); body.replaceChildren();
        $('judgmentDetails').open = false;
        const input = ended.input;
        $('inputCaptureSummary').textContent = `받은 스페이스바 누름 ${input.keydowns - input.repeats}회 · 뗌 ${input.keyups}회 · 전체 연주 입력 ${ended.taps.length}회`;
        const excluded = [input.repeats && `길게 누른 반복 ${input.repeats}회`, input.ignoredFocus && `설정·버튼 조작 ${input.ignoredFocus}회`, input.outside && `연습 구간 밖 ${input.outside}회`].filter(Boolean);
        $('inputExcluded').textContent = excluded.length ? `연주에서 제외: ${excluded.join(' · ')}` : '';
        $('inputExcluded').hidden = !excluded.length;
        function row(position, received, reason, kind, index) {
            const tr = document.createElement('tr'); tr.dataset.reason = kind;
            if (index !== undefined) tr.dataset.target = String(index + 1);
            for (const value of [position, received, reason]) { const td = document.createElement('td'); td.textContent = value; tr.append(td); }
            body.append(tr);
        }
        result.marks.forEach((mark, index) => {
            const ms = Number((mark.error * 1000).toFixed(1));
            const received = mark.hit ? `#${mark.input + 1} · ${ms >= 0 ? '+' : ''}${ms}ms` : '—';
            const window = `허용 −${Math.round(C.noteWindow(chart, index, 'early') * 1000)}~+${Math.round(C.noteWindow(chart, index, 'late') * 1000)}ms`;
            row(notePosition(mark.time), received, !mark.hit ? '입력 기록 없음' : mark.points === 1 ? '맞음' : `박자 오류 (${window})`, !mark.hit ? 'missing' : mark.points === 1 ? 'hit' : 'timing', index);
        });
        C.trace(chart, ended.taps).forEach((input, index) => {
            if (input.target < 0) row(notePosition(input.time), `#${index + 1}`, '추가 입력', 'extra');
        });
    }
    function timingReport(ended, interrupted) {
        const result = C.judge(chart, ended.taps), beat = 60 / chart.bpm;
        const inputs = C.trace(chart, ended.taps);
        const nearestErrors = inputs.map(input => [input.nearest, Math.round((input.time - chart.targets[input.nearest]) / beat * 1000) / 1000]);
        const report = { version: '20261021-space-capture', bpm: chart.bpm, level: chart.level, seed: chart.seed, interrupted,
            syncMode: syncCheck ? syncMode : null,
            targets: chart.targets.length, taps: ended.taps.length, input: ended.input,
            accuracy: result.accuracy, hits: result.hits, played: result.played, misses: result.misses, extras: result.extras, timingWrong: result.timingWrong,
            targetBeats: chart.targets.map(time => Math.round(time / beat * 1000) / 1000),
            tapBeats: ended.taps.map(time => Math.round(time / beat * 1000) / 1000), nearestErrors,
            tapJudgments: inputs.map((input, index) => ({ input: index + 1, target: input.target < 0 ? null : input.target + 1,
                nearestTarget: input.nearest + 1, accepted: input.accepted, reason: input.reason,
                errorMs: input.target < 0 ? null : Math.round(input.error * 1000) })),
            keyEvents: ended.keys, queueMs: ended.queue, clocks: ended.clocks, audioPlan: ended.audioPlan };
        if (syncCheck && !interrupted) {
            // A comparison of observed timing, never an automatic latency correction.
            // Ignore the first four exercise beats to let the player settle into tempo.
            const errors = inputs.filter(input => chart.targets[input.nearest] >= beat * 4).map(input => input.error / beat).sort((a, b) => a - b);
            const percentile = fraction => errors.length ? errors[Math.round((errors.length - 1) * fraction)] : null;
            const median = errors.length >= 8 ? (errors[Math.floor((errors.length - 1) / 2)] + errors[Math.ceil((errors.length - 1) / 2)]) / 2 : null;
            report.syncTiming = { inputs: inputs.length, expected: chart.targets.length, measured: errors.length, medianBeats: median,
                spreadBeats: median === null ? null : percentile(.9) - percentile(.1) };
            syncResults.set(syncMode, report.syncTiming);
            $('syncResults').replaceChildren();
            for (const [kind, values] of syncResults) {
                const line = document.createElement('p');
                const shift = values.medianBeats === null ? '측정할 입력이 부족해요' : `${values.medianBeats < 0 ? '빠름' : '늦음'} ${Math.abs(values.medianBeats).toFixed(3)}박 · 흔들림 ${values.spreadBeats.toFixed(3)}박`;
                line.textContent = `${kind === 'sound' ? '소리만' : kind === 'visual' ? '화면만' : '16분 입력'}: ${values.inputs}/${values.expected}회 입력 · ${shift}`;
                $('syncResults').append(line);
            }
            $('phase').textContent = '동기 확인 완료';
        }
        // Keep only this exercise's Space events, locally, so a reload cannot erase
        // the evidence. No other keys or identifying information are recorded.
        const serialized = JSON.stringify(report);
        try { sessionStorage.setItem('rhythm-training-last-run-v1', serialized); } catch (_) {}
        console.info('RHYTHM_TIMING_REPORT ' + serialized);
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
        $('roomHint').textContent = state.me.host ? '모두 준비하면 시작해 주세요. 점수, 평균 오차 순으로 순위를 매겨요.' : '준비를 누르면 선생님이 시작할 때 네 박을 듣고 연주해요.';
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
    for (const [id, kind] of [['syncSound', 'sound'], ['syncVisual', 'visual'], ['syncSubdivide', 'subdivision']]) action(id, () => {
        if (!syncCheck || run || starting) return;
        syncMode = kind;
        document.body.classList.toggle('sync-sound', kind !== 'visual');
        for (const [button, value] of [['syncSound', 'sound'], ['syncVisual', 'visual'], ['syncSubdivide', 'subdivision']]) $(button).setAttribute('aria-pressed', String(kind === value));
        $('syncInstruction').textContent = kind === 'sound'
            ? '소리만 듣습니다. 준비 소리 4번 뒤, 다섯 번째 소리부터 매 박마다 스페이스바를 16번 눌러 주세요. 맞음·틀림 표시는 나오지 않습니다.'
            : kind === 'visual' ? '소리가 나오지 않습니다. 준비 표시 4번 뒤, 움직이는 선이 각 음표의 중심에 올 때마다 스페이스바를 16번 눌러 주세요.'
                : '준비 소리 4번 뒤 빠른 16분음표 소리 32번이 나옵니다. 빠른 소리가 날 때마다 스페이스바를 한 번씩 눌러 주세요. 악보와 맞음·틀림 표시는 나오지 않습니다.';
        fresh();
    });
    action('start', () => listening() ? (answered ? fresh() : submitListening()) : play());
    action('retry', () => play()); action('listen', () => play(true));
    action('showAnswer', () => { if (listening() && !answered && !run && !starting) revealListening(false, -1, true); });
    action('shuffle', () => { requestedSeed = null; fresh(); }); action('stop', () => finish(true));
    for (const id of ['level', 'bpm', 'activity', 'length']) $(id).addEventListener('input', () => { updateTempoRange(id === 'level'); if (!room) fresh(); });
    $('pad').addEventListener('pointerdown', event => { if (!event.isPrimary || event.button !== 0) return; event.preventDefault(); tap(event); });
    $('pad').addEventListener('click', event => { if (event.detail === 0) tap(event); });
    function recordSpace(event, clock) {
        if (!run || run.demo) return null;
        const entry = { type: event.type, time: clock.time, queueMs: clock.queueMs, repeat: event.repeat, disposition: '' };
        if (run.keys.length < 4096) run.keys.push(entry);
        return entry;
    }
    // Capture at the window before focused children can stop propagation. This
    // records browser-delivered events; it cannot observe a physical key the OS
    // or keyboard never delivers to the browser.
    window.addEventListener('keydown', event => {
        if (event.code !== 'Space' || event.altKey || event.ctrlKey || event.metaKey) return;
        const clock = inputClock(event), entry = recordSpace(event, clock);
        if (run && !run.demo) { run.input.keydowns++; if (event.repeat) run.input.repeats++; }
        if (event.target.closest('input,select,textarea,a,button:not(#pad),summary,.judgment-scroll,[contenteditable=true]')) {
            if (run && !run.demo) run.input.ignoredFocus++;
            if (entry) entry.disposition = 'control';
            return;
        }
        event.preventDefault();
        if (listening()) {
            if (!event.repeat && !run && !starting) void play(true).catch(error => notice(error.message));
            return;
        }
        if (event.repeat) { if (entry) entry.disposition = 'repeat'; return; }
        const disposition = tap(event, clock);
        if (entry) entry.disposition = disposition;
    }, true);
    window.addEventListener('keyup', event => {
        if (event.code !== 'Space' || !run || run.demo) return;
        run.input.keyups++;
        const entry = recordSpace(event, inputClock(event));
        if (entry) entry.disposition = 'release';
    }, true);
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
        const link = new URL('/room/', location.origin); link.searchParams.set('code', credentials.code);
        try { await navigator.clipboard.writeText(link.href); notice('초대 링크를 복사했어요.'); }
        catch (_) { notice('초대 주소: ' + link.href); }
    });
    const submitButton = document.createElement('button'); submitButton.id = 'submitRetry'; submitButton.className = 'secondary'; submitButton.hidden = true; submitButton.textContent = '결과 다시 보내기';
    $('ranking').before(submitButton); action('submitRetry', submitResult);
    $('name').value = window.CLASS_PLAYER_NAME || '';
    for (let i = 0; i < 8; i++) { const spark = document.createElement('i'); spark.className = 'tap-spark'; $('tapEffects').append(spark); }
    if (syncCheck) {
        document.body.classList.add('sync-check', 'sync-sound');
        $('syncPanel').hidden = false;
        $('syncInstruction').textContent = '소리만 듣습니다. 준비 소리 4번 뒤, 다섯 번째 소리부터 매 박마다 스페이스바를 16번 눌러 주세요. 맞음·틀림 표시는 나오지 않습니다.';
    }
    renderLessons(); fresh();
    const code = syncCheck ? null : new URLSearchParams(location.search).get('room');
    if (code && /^\d{4}$|^\d{6}$/.test(code)) { $('code').value = code; if(code.length===6){$('code').maxLength=6;$('code').pattern='[0-9]{6}';} setMode('class'); }
    try {
        const saved = JSON.parse(sessionStorage.getItem(storageKey));
        if (!syncCheck && saved?.token && /^\d{4}$|^\d{6}$/.test(saved.code) && (!code || saved.code === code)) {
            credentials = { token: saved.token, code: saved.code }; pendingResult = saved.pendingResult || null;
            setMode('class'); if (pendingResult) void submitResult(); void poll();
        }
    } catch (_) {}
    const entryName = String(new URLSearchParams(location.search).get('name') || '').trim().slice(0, 20);
    if (code && /^\d{4}$/.test(code) && entryName && !credentials) {
        $('name').value = entryName; $('join').disabled = true;
        void api('/rooms/' + code + '/join', { name: entryName }).then(acceptRoom)
            .catch(error => notice(error.message)).finally(() => { $('join').disabled = false; });
    }
    void api('/session').then(data => { $('create').hidden = !data.isTeacher; $('teacherHint').hidden = data.isTeacher; }).catch(() => {});
    let resizeFrame = 0;
    new ResizeObserver(() => {
        if ($('score').clientWidth > 0 && ($('score').clientWidth >= 620 ? 4 : 2) !== scoreColumns) {
            cancelAnimationFrame(resizeFrame);
            resizeFrame = requestAnimationFrame(renderScore);
        }
    }).observe($('score'));
    setInterval(poll, 1200);
})();
