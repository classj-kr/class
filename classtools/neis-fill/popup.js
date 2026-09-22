(() => {
    const { parseStudents, neisBytes } = window.ClassjNeisParse;
    const raw = document.getElementById('raw');
    const parsed = document.getElementById('parsed');
    const list = document.getElementById('list');
    const inspectBtn = document.getElementById('inspect-btn');
    const fillBtn = document.getElementById('fill-btn');
    const status = document.getElementById('status');
    const result = document.getElementById('result');
    const tech = document.getElementById('tech');
    const techBody = document.getElementById('tech-body');
    const only = document.getElementById('only');
    const undoBtn = document.getElementById('undo-btn');
    const clearBtn = document.getElementById('clear-btn');
    const skipTitle = document.getElementById('skip-title');
    const skipTitleWrap = document.getElementById('skip-title-wrap');

    // 붙여넣은 글은 브라우저를 닫으면 지워지는 저장소에 둔다(학생 개인정보).
    const store = chrome.storage.session || chrome.storage.local;

    let students = [];
    let problems = [];
    let meta = {};             // 붙여넣은 글 맨 위 표시줄(칸·학기·과목). 화면 조건과 대조한다.
    let armedUntil = 0;
    let lastBefore = null;     // 마지막 채우기 직전 값들. 되돌리기에 쓴다.
    let frameId = null;        // 살펴보기에서 고른 틀

    function setStatus(text, isError) {
        status.textContent = text;
        status.className = 'status' + (isError ? ' error' : '');
    }

    function li(text, bad) {
        const el = document.createElement('li');
        el.textContent = text;
        if (bad) el.className = 'bad';
        return el;
    }

    function render() {
        const r = parseStudents(raw.value);
        students = r.students;
        problems = r.problems;
        meta = r.meta || {};
        const tag = [meta.area, meta.semester, meta.subject].filter(Boolean).join(' · ');
        parsed.textContent = students.length ? students.length + '명' + (tag ? ' · ' + tag : '') : (raw.value.trim() ? '학생을 못 읽었습니다. "1번 이름" 줄이 있어야 합니다.' : '');
        list.replaceChildren(
            ...problems.map(p => li(p, true)),
            ...students.map(s => li(s.number + '번 ' + s.name + ' · ' + s.text.length + '자, ' + neisBytes(s.text) + '바이트'))
        );
        // 살펴보기는 글이 없어도 된다(화면 구조만 읽는다). 채우기는 학생 글이 있어야 한다.
        inspectBtn.disabled = false;
        fillBtn.disabled = students.length === 0;
        disarm();
    }

    function disarm() {
        armedUntil = 0;
        fillBtn.classList.remove('armed');
        fillBtn.textContent = '채우기';
    }

    raw.addEventListener('input', () => {
        render();
        store.set({ raw: raw.value });
    });
    only.addEventListener('input', disarm);
    document.querySelectorAll('input[name="mode"]').forEach(el => el.addEventListener('change', disarm));

    function chosen() {
        const no = only.value.trim();
        if (!no) return students;
        const picked = students.filter(s => String(parseInt(s.number, 10)) === String(parseInt(no, 10)));
        if (!picked.length) throw new Error(no + '번 학생이 목록에 없습니다.');
        return picked;
    }

    // 나이스 탭인지 본다. 시험용 모의 화면(localhost)도 허용한다.
    async function neisTab() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.url) throw new Error('현재 탭을 읽지 못했습니다. 나이스 탭에서 눌러 주세요.');
        let host = '';
        try { host = new URL(tab.url).hostname; } catch (e) { host = ''; }
        if (!(host.endsWith('.neis.go.kr') || host === 'neis.go.kr' || host === 'localhost' || host === '127.0.0.1')) {
            throw new Error('이 탭은 나이스가 아닙니다(' + (host || tab.url.slice(0, 40)) + '). 나이스 학기말종합의견 화면 탭에서 눌러 주세요.');
        }
        return tab;
    }

    function koreanError(e) {
        const m = e && e.message ? e.message : String(e);
        if (/Cannot access|must request permission|cannot be scripted|chrome:\/\//i.test(m)) return '이 화면에는 넣을 수 없습니다. 나이스 탭에서 눌러 주세요.';
        if (/No tab with id|Frame with ID|No frame/i.test(m)) return '화면이 바뀌어 다시 찾아야 합니다. 「화면 살펴보기」부터 다시 눌러 주세요.';
        return m;
    }

    async function runInPage(mode, targets, oneFrame) {
        const tab = await neisTab();
        const target = { tabId: tab.id };
        if (oneFrame && frameId != null) target.frameIds = [frameId];
        else target.allFrames = true;
        await chrome.scripting.executeScript({ target, world: 'MAIN', files: ['page.js'] });
        const results = await chrome.scripting.executeScript({
            target,
            world: 'MAIN',
            func: (arr, opts) => (window.__classjNeis ? window.__classjNeis.run(arr, opts) : null),
            args: [targets, { mode, roster: students, skipTitle: skipTitle.checked }]
        });
        return results.filter(r => r && r.result).map(r => Object.assign({ frameId: r.frameId }, r.result));
    }

    // 팝업이 닫혔다 열려도 마지막 결과를 화면에서 되찾는다.
    async function fetchLast() {
        const tab = await neisTab();
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true },
            world: 'MAIN',
            func: () => (window.__classjNeis ? { busy: window.__classjNeis.busy(), last: window.__classjNeis.last() } : null)
        });
        return results.filter(r => r && r.result).map(r => Object.assign({ frameId: r.frameId }, r.result));
    }

    function pickFrame(frames) {
        return frames.slice().sort((a, b) => ((b.matched || []).length - (a.matched || []).length) || ((b.textareas || 0) - (a.textareas || 0)))[0] || null;
    }

    function apiLine(best) {
        const a = best.api;
        if (!a || !a.available) return '실행기: 없음. 화면 글 칸으로만 넣고, 실행기 자료는 확인하지 못합니다.';
        const bits = ['실행기: 있음'];
        if (a.grid) {
            bits.push('목록 ' + a.grid.rows + '줄·' + a.grid.cols + '열, 이름 열 ' + (a.grid.nameCol ? '찾음' : '못 찾음') + ', 번호 열 ' + (a.grid.noCol ? '찾음' : '못 찾음')
                + ', 종합의견 열 ' + (a.grid.textCol ? '찾음(' + a.grid.textHow + ')' : '못 찾음'));
            if (a.grid.colNames && a.grid.colNames.length) bits.push('열 이름: ' + a.grid.colNames.join(', '));
            bits.push('이름 열=' + (a.grid.nameColName || '?') + ', 번호 열=' + (a.grid.noColName || '?')
                + (a.grid.noCands && a.grid.noCands.length ? ' (번호 후보: ' + a.grid.noCands.join(', ') + ')' : '')
                + ', 종합의견 열=' + (a.grid.textColName || '?'));
        }
        if (a.checked) bits.push('화면으로 넣은 ' + a.checked + '명 가운데 자료 일치 ' + a.agreed + '명, 실행기로 다시 넣음 ' + a.fixed + '명');
        if (a.filled || a.same) bits.push('화면 밖 줄을 실행기로 넣음 ' + a.filled + '명' + (a.same ? ', 이미 같음 ' + a.same + '명' : ''));
        if (a.ctrlChecked) bits.push('글 칸 컨트롤 확인 ' + a.ctrlChecked + '명 가운데 일치 ' + a.ctrlAgreed + '명, 다시 넣음 ' + a.ctrlFixed + '명');
        if (a.blocked && a.blocked.length) bits.push('실행기가 거부: ' + a.blocked.join(', '));
        if (a.strays && a.strays.length) bits.push('주의, 엉뚱한 줄에 든 글: ' + a.strays.join('; '));
        return bits.concat(a.notes || []).join('\n');
    }

    const norm = (s) => String(s || '').replace(/\s+/g, '').replace(/[()（）·]/g, '');
    const semNo = (s) => { const m = String(s || '').match(/\d/); return m ? m[0] : ''; };

    // 나이스 조건 줄을 한 줄로: "2026학년도 2학기 6학년 2반 · 교과(목) 국어"
    function filtersLine(f) {
        if (!f) return '못 읽음';
        const bits = [];
        if (f.year) bits.push(f.year.replace(/학년도$/, '') + '학년도');
        if (f.semester) bits.push(f.semester.replace(/학기$/, '') + '학기');
        if (f.grade) bits.push(f.grade.replace(/학년$/, '') + '학년');
        if (f.klass) bits.push(f.klass.replace(/반$/, '') + '반');
        if (f.subject) bits.push('· 교과(목) ' + f.subject);
        return bits.length ? bits.join(' ') : '못 읽음';
    }

    // 붙여넣은 글의 과목·학기와 화면 조건이 다르면 그 까닭. 국어 글이 수학 칸에 들어가는 실수를 막는다.
    function mismatch(f) {
        if (!f) return '';
        if (meta.subject && f.subject && norm(meta.subject) !== norm(f.subject)) {
            return '붙여넣은 글은 「' + meta.subject + '」 것인데 화면의 교과(목)은 「' + f.subject + '」입니다. 넣지 않았습니다. 나이스에서 과목을 바꿔 조회하거나, 도우미에서 그 과목 글을 다시 복사하세요.';
        }
        if (meta.semester && f.semester && semNo(meta.semester) && semNo(f.semester) && semNo(meta.semester) !== semNo(f.semester)) {
            return '붙여넣은 글은 ' + semNo(meta.semester) + '학기 것인데 화면은 ' + semNo(f.semester) + '학기입니다. 넣지 않았습니다.';
        }
        return '';
    }

    // 상태 줄 끝에 붙이는 과목 확인: "화면 과목 국어(글과 같음)" / "화면 과목 국어(글은 수학!)" / "글에 과목 표시 없음"
    function subjectNote(f) {
        if (!f || !f.subject) return meta.subject ? ' 화면 과목을 못 읽어 「' + meta.subject + '」 글인지 대조하지 못했습니다.' : '';
        if (!meta.subject) return ' 화면 과목 ' + f.subject + '(글에 과목 표시 없음).';
        return ' 화면 과목 ' + f.subject + (norm(meta.subject) === norm(f.subject) ? '(글과 같음).' : '(글은 ' + meta.subject + '!).');
    }

    function showReport(best, mode, isUndo) {
        result.replaceChildren();
        tech.hidden = false;
        techBody.textContent = best
            ? ['주소: ' + best.url,
               (best.frame === 'top' ? '바깥 화면' : '안쪽 틀') + ', 글 칸 ' + best.textareas + '개, 훑은 횟수 ' + best.scans + ', 스크롤 ' + (best.scrollable ? best.scrolls + '번' : '없음') + (best.namelessRows ? ', 이름 없는 줄 ' + best.namelessRows + '개' : ''),
               '화면 제목: ' + ((best.titles || []).join(' / ') || '못 찾음') + (best.titleOk ? ' (학기말종합의견 맞음)' : ''),
               '화면 조건: ' + filtersLine(best.filters) + (meta.subject || meta.semester ? ' / 글: ' + [meta.area, meta.semester, meta.subject].filter(Boolean).join(' · ') : ''),
               best.sample ? '칸 위치: ' + best.sample.textarea.join(' < ') + (best.sample.maxLength > 0 ? ' (최대 ' + best.sample.maxLength + '자)' : '') : '',
               apiLine(best)].filter(Boolean).join('\n')
            : '';
        if (!best || (best.textareas === 0 && best.matched.length === 0)) {
            setStatus('이 화면에서 글 칸을 찾지 못했습니다. 나이스 학기말종합의견 화면에서 조회를 누른 뒤 다시 해 주세요.', true);
            return;
        }
        const okCount = best.matched.filter(m => m.ok && !m.note).length;
        const flagged = best.matched.length - okCount;
        const strays = best.api && best.api.strays && best.api.strays.length;
        if (mode === 'inspect' && students.length === 0) {
            setStatus('글 칸 ' + best.textareas + '개를 찾았습니다. 학생 글을 붙여넣으면 이름을 대조합니다.' + subjectNote(best.filters) + ' 아직 아무것도 바꾸지 않았습니다.', best.textareas === 0);
        } else if (mode === 'inspect') {
            const bad = mismatch(best.filters);
            setStatus('글 칸 ' + best.textareas + '개, 이름이 맞는 줄 ' + best.matched.length + '개'
                + (flagged ? ', 확인할 줄 ' + flagged + '개' : '')
                + (best.skipped.length ? ', 넣지 않을 학생 ' + best.skipped.length + '명' : '')
                + (best.unmatched.length ? ', 화면에 없는 학생 ' + best.unmatched.length + '명' : '') + '.' + subjectNote(best.filters) + ' 아직 아무것도 바꾸지 않았습니다.'
                + (bad ? ' 이대로 채우기를 누르면 넣지 않습니다.' : ''),
                best.matched.length === 0 || !!bad);
        } else if (isUndo) {
            setStatus(okCount + '명을 원래 글로 되돌렸습니다. 저장하지 않으면 나이스에는 아무 변화도 없습니다.', okCount === 0);
        } else {
            setStatus(okCount + '명 채움' + (flagged ? ', ' + flagged + '명은 확인 필요' : '')
                + (best.skipped.length ? ', 넣지 않은 학생 ' + best.skipped.length + '명' : '')
                + (best.unmatched.length ? ', 못 찾은 학생 ' + best.unmatched.length + '명' : '')
                + (strays ? '. 주의: 엉뚱한 줄에 든 글이 있습니다. 화면 정보를 보세요' : '')
                + '. 화면을 훑어본 뒤 나이스에서 저장 단추를 누르세요.', okCount === 0 || !!strays);
        }
        best.matched.forEach(m => {
            const bits = [m.number + '번 ' + m.name];
            if (mode === 'inspect') bits.push(m.existing ? '이미 ' + m.existing + '자 있음' : '비어 있음');
            else bits.push((m.ok ? '넣음' : '실패') + (m.after == null ? '' : ' ' + m.after + '자') + (m.method === 'api' ? ' (실행기)' : ''));
            if (m.model && mode !== 'inspect') bits.push('자료 ' + m.model);
            if (m.note) bits.push(m.note);
            result.append(li(bits.join(' · '), !m.ok || !!m.note));
        });
        best.skipped.forEach(s => result.append(li(s, true)));
        best.unmatched.forEach(u => result.append(li('화면에서 못 찾음: ' + u, true)));
        best.rowNotes.forEach(n => result.append(li('화면 줄(이름 ' + (n.names.join(',') || '없음') + ', 번호 ' + (n.numbers.join(',') || '없음') + '): ' + n.why, true)));
    }

    function rememberUndo(best) {
        const restorable = best.matched.filter(m => m.touched && m.before != null);
        lastBefore = restorable.length ? restorable.map(m => ({ number: m.number, name: m.name, text: m.before })) : null;
        undoBtn.hidden = !lastBefore;
    }

    async function go(mode, targets, isUndo) {
        inspectBtn.disabled = fillBtn.disabled = undoBtn.disabled = true;
        setStatus(mode === 'inspect' ? '화면을 살펴보는 중…' : (isUndo ? '되돌리는 중…' : '채우는 중… 끝날 때까지 나이스 화면을 건드리지 마세요.'));
        try {
            let frames;
            if (mode === 'inspect') {
                frames = await runInPage('inspect', targets, false);
                const best = pickFrame(frames);
                if (best) frameId = best.frameId;
                if (best && best.busy) { setStatus('아직 넣는 중입니다. 잠시 뒤 다시 열어 주세요.', true); return; }
                showReport(best, 'inspect', false);
                return;
            }
            // 넣기 전에 한 번 살펴보아 틀(frame)을 고른다. 그 틀에만 넣는다.
            const look = pickFrame(await runInPage('inspect', targets, false));
            if (!look || (look.textareas === 0 && look.matched.length === 0)) { showReport(look, 'inspect', false); return; }
            frameId = look.frameId;
            // 글의 과목·학기와 화면 조건이 다르면 넣지 않는다(되돌리기는 예외: 원래 글로 되돌리는 것이므로).
            const bad = isUndo ? '' : mismatch(look.filters);
            if (bad) { showReport(look, 'inspect', false); setStatus(bad, true); return; }
            frames = await runInPage(mode, targets, true);
            const best = frames[0] || null;
            if (best && best.busy) { setStatus('아직 넣는 중입니다. 잠시 뒤 다시 열어 주세요.', true); return; }
            if (best && best.blocked === 'title') {
                skipTitleWrap.hidden = false;
                setStatus('이 화면 제목에서 「학기말종합의견」을 찾지 못해 넣지 않았습니다. 찾은 제목: ' + (best.titles.join(' / ') || '없음')
                    + '. 정말 학기말종합의견 화면이면 「화면 제목 검사 건너뛰기」를 켜고 다시 누르세요.', true);
                return;
            }
            showReport(best, mode, isUndo);
            if (best && !isUndo) rememberUndo(best);
            if (isUndo) { lastBefore = null; undoBtn.hidden = true; }
        } catch (e) {
            console.error(e);
            setStatus('실패: ' + koreanError(e), true);
        } finally {
            inspectBtn.disabled = false;
            fillBtn.disabled = students.length === 0;
            undoBtn.disabled = false;
        }
    }

    inspectBtn.addEventListener('click', () => {
        disarm();
        // 글을 아직 안 붙였으면 빈 목록으로 화면만 읽는다.
        try { go('inspect', students.length ? chosen() : [], false); } catch (e) { setStatus(e.message, true); }
    });

    fillBtn.addEventListener('click', () => {
        const mode = document.querySelector('input[name="mode"]:checked').value;
        let targets;
        try { targets = chosen(); } catch (e) { setStatus(e.message, true); return; }
        if (Date.now() > armedUntil) {
            armedUntil = Date.now() + 8000;
            fillBtn.classList.add('armed');
            fillBtn.textContent = (mode === 'append' ? '정말 이어쓰기 ' : '정말 덮어쓰기 ') + targets.length + '명';
            setStatus('한 번 더 누르면 나이스 칸에 넣습니다. 이름을 대조해 넣고, 저장은 하지 않습니다.');
            return;
        }
        disarm();
        go(mode, targets, false);
    });

    undoBtn.addEventListener('click', () => {
        if (!lastBefore) return;
        disarm();
        go('overwrite', lastBefore, true);
    });

    clearBtn.addEventListener('click', async () => {
        raw.value = '';
        await store.remove('raw');
        render();
        result.replaceChildren();
        tech.hidden = true;
        lastBefore = null;
        undoBtn.hidden = true;
        setStatus('지웠습니다.');
    });

    (async () => {
        try {
            const saved = await store.get('raw');
            if (saved && saved.raw) raw.value = saved.raw;
        } catch (e) { /* 저장소 없음 */ }
        render();
        // 팝업을 닫았다 열었을 때, 화면에 남은 마지막 결과를 되찾는다.
        try {
            const frames = await fetchLast();
            const busyFrame = frames.find(f => f.busy);
            if (busyFrame) { setStatus('아직 넣는 중입니다. 잠시 뒤 다시 열어 주세요.'); return; }
            const withLast = frames.filter(f => f.last && f.last.result);
            if (withLast.length) {
                const f = withLast.sort((a, b) => b.last.at - a.last.at)[0];
                frameId = f.frameId;
                const best = Object.assign({ frameId: f.frameId }, f.last.result);
                showReport(best, best.mode, false);
                rememberUndo(best);
                setStatus('마지막 채우기 결과입니다. ' + status.textContent);
            }
        } catch (e) { /* 나이스 탭이 아니거나 아직 아무것도 안 넣었다 */ }
    })();
})();
