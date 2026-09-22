// 나이스 화면 안(페이지 세계)에서 도는 부분. 팝업이 chrome.scripting 으로 주입한다.
//
// 두 갈래로 넣는다.
//  1) 화면 글 칸(textarea): 학생 이름 글자와 글 칸이 같은 줄에 놓였는지로 줄을 찾아 값을 넣고 blur 를 흘린다.
//     나이스 실행기(엑스빌더6)의 글 칸은 input/change 가 아니라 blur 때 화면 값을 자기 값으로 받아들인다.
//  2) 실행기 자료(cpr): 실행기가 노출돼 있으면 목록(Grid)의 셀 값을 직접 써서 화면 밖 줄까지 채우고,
//     1)로 넣은 값이 실행기 자료에도 들어갔는지 확인한다. 실행기 이름은 공개된 것만 쓰고 없으면 건너뛴다.
// 넣기 전에 화면을 한 바퀴 훑어(살펴보기) 같은 학생이 두 줄에 걸리면 그 학생은 넣지 않는다.
// 저장은 절대 누르지 않는다.
(function () {
    // 판 번호. page.js 를 고칠 때마다 manifest.json 의 version 과 함께 올린다.
    // 확장을 새로 읽어도 이미 열린 나이스 화면에는 먼저 들어간 스크립트가 남는다. 판이 다르면 새 판이 갈아 끼우고,
    // 같으면 그대로 둔다(넣는 중인 상태와 마지막 결과를 지키려고). 넣는 중이면 갈아 끼우지 않는다.
    const VERSION = '0.3.0';
    const prev = window.__classjNeis;
    if (prev && prev.version === VERSION) return;
    if (prev && typeof prev.busy === 'function' && prev.busy()) return;

    const state = { running: false, last: (prev && typeof prev.last === 'function') ? (prev.last() || null) : null };

    const squash = (s) => String(s == null ? '' : s).replace(/\s+/g, '');
    const uniq = (arr) => Array.from(new Set(arr));
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const intStr = (v) => String(parseInt(String(v).trim(), 10));
    const keyOf = (s) => intStr(s.number) + '|' + squash(s.name);

    // 나이스 셈법: 한글 3바이트, 줄바꿈은 넉넉히 2바이트.
    function neisBytes(text) {
        let n = 0;
        const enc = new TextEncoder();
        for (const ch of String(text || '')) n += ch === '\n' ? 2 : (ch === '\r' ? 0 : enc.encode(ch).length);
        return n;
    }

    function isShown(el) {
        if (typeof el.checkVisibility === 'function' && !el.checkVisibility({ visibilityProperty: true, opacityProperty: false })) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
    }

    function shownTextareas() {
        return Array.from(document.querySelectorAll('textarea')).filter(isShown);
    }

    function commonAncestor(els) {
        let a = els[0];
        for (const b of els.slice(1)) {
            while (a && a !== document.body && !a.contains(b)) a = a.parentElement;
        }
        return a || document.body;
    }

    function scrollParent(el) {
        for (let p = el && el.parentElement; p; p = p.parentElement) {
            const cs = getComputedStyle(p);
            if (/(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight + 2) return p;
        }
        return null;
    }

    function ancestorUp(el, n) {
        let e = el;
        for (let i = 0; i < n && e.parentElement && e.parentElement !== document.body; i += 1) e = e.parentElement;
        return e;
    }

    // 이름 글자를 찾을 범위. 화면 전체를 훑지 않는다(전체 순회가 나이스 화면을 멈추게 한 사례가 있다).
    function scopeOf(areas) {
        if (areas.length > 1) return commonAncestor(areas);
        const ta = areas[0];
        return ta.closest('[role="grid"], .cl-grid, table, form') || scrollParent(ta) || ancestorUp(ta, 8);
    }

    // 글 조각을 텍스트 노드 하나하나 따로 모은다. 셀 사이가 붙어 "1김두리조회" 가 되지 않게.
    // textarea 안 글(예전 종합의견)은 이름 대조에서 뺀다.
    function leafTexts(root) {
        const out = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                const p = node.parentElement;
                if (!p) return NodeFilter.FILTER_REJECT;
                const tag = p.tagName;
                if (tag === 'TEXTAREA' || tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
                return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
        });
        let n;
        while ((n = walker.nextNode())) out.push({ text: n.nodeValue.trim(), el: n.parentElement });
        root.querySelectorAll('input').forEach(inp => {
            const type = (inp.type || 'text').toLowerCase();
            if (type !== 'text' && type !== 'search') return;
            if (!inp.value || !inp.value.trim() || !isShown(inp)) return;
            out.push({ text: inp.value.trim(), el: inp });
        });
        return out;
    }

    function chainOf(el, depth) {
        const out = [];
        for (let e = el; e && e !== document.body && out.length < depth; e = e.parentElement) {
            const cls = typeof e.className === 'string' ? e.className.trim().split(/\s+/).filter(Boolean).slice(0, 3) : [];
            out.push(e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (cls.length ? '.' + cls.join('.') : ''));
        }
        return out;
    }

    function indexByName(list) {
        const byName = new Map();
        list.forEach(s => {
            const k = squash(s.name);
            if (!byName.has(k)) byName.set(k, []);
            byName.get(k).push(s);
        });
        return byName;
    }

    // 화면 제목 후보(참고용, 화면 정보에만 보인다). 어느 화면인지는 교사가 알고 있으므로 이것으로 막지 않는다.
    // 목록·줄·탭 이름표 안의 글자는 뺀다(아래 탭 줄에도 열린 화면 이름이 적혀 있다).
    function screenTitles() {
        const out = [];
        const els = document.querySelectorAll('[role="heading"], h1, h2, h3, .app-tit, .neis-main-tit, .app-tit .cl-text, .neis-main-tit .cl-text, .h3 .cl-text');
        els.forEach(el => {
            if (!isShown(el)) return;
            if (el.closest('[role="grid"], [role="row"], [role="tab"], [role="tablist"], .cl-grid')) return;
            const t = (el.textContent || '').trim();
            if (t && t.length <= 30) out.push(t);
        });
        return uniq(out).slice(0, 12);
    }

    // 조건 줄(학년도·학기·학년·반·교과(목))의 값. 이름표 글자와 같은 높이에서 오른쪽으로 가장 가까운 입력 칸의 값을 읽는다.
    // 팝업이 붙여넣은 글의 과목·학기와 대조해 다른 과목 칸에 넣는 실수를 막는 데 쓴다. 못 읽어도 넣기 자체는 막지 않는다.
    const FILTER_KEYS = [['학년도', 'year'], ['교과(목)', 'subject'], ['교과목', 'subject'], ['과목', 'subject'], ['학기', 'semester'], ['학년', 'grade'], ['반', 'klass']];
    function fieldValue(el) {
        if (el.tagName === 'SELECT') { const o = el.options[el.selectedIndex]; return o ? o.text.trim() : ''; }
        if (el.tagName === 'INPUT') return (el.value || '').trim();
        const inp = el.querySelector('input');
        if (inp && inp.value) return inp.value.trim();
        return (el.textContent || '').trim();
    }
    function readFilters() {
        const out = {};
        try {
            const labels = [];
            for (const l of leafTexts(document.body)) {
                if (l.el.tagName === 'INPUT') continue;
                const t = squash(l.text).replace(/^[*＊]+/, '');
                const hit = FILTER_KEYS.find(([k]) => k === t);
                if (!hit) continue;
                if (l.el.closest('[role="grid"], [role="row"], [role="tab"], [role="tablist"], [role="tree"], [role="menu"], .cl-grid')) continue;
                if (!isShown(l.el)) continue;
                labels.push({ key: hit[1], rect: l.el.getBoundingClientRect() });
            }
            if (!labels.length) return out;
            const fields = Array.from(document.querySelectorAll('input, select, [role="combobox"]')).filter(isShown).map(el => ({ el, rect: el.getBoundingClientRect() }));
            for (const lb of labels) {
                if (out[lb.key]) continue;
                const mid = (lb.rect.top + lb.rect.bottom) / 2;
                const right = fields
                    .filter(f => f.rect.left >= lb.rect.right - 2 && f.rect.top <= mid && f.rect.bottom >= mid && f.rect.left - lb.rect.right < 260)
                    .sort((a, b) => a.rect.left - b.rect.left)[0];
                if (!right) continue;
                const v = fieldValue(right.el);
                if (v) out[lb.key] = v;
            }
        } catch (e) { /* 조건 줄을 못 읽어도 넣기에는 지장 없다 */ }
        return out;
    }

    // 지금 화면에 있는 textarea 마다 같은 줄에 놓인 이름·번호 글자를 모은다.
    // 번호는 이름 왼쪽에서 가장 가까운 숫자 하나만 본다(글자 수 표시 같은 다른 숫자에 속지 않게).
    const NUMBER = /^(?:\d{1,2}\s*\/\s*)?(\d{1,3})$/;
    function scan(roster) {
        const byName = indexByName(roster);
        const areas = shownTextareas();
        if (!areas.length) return [];
        const sc = scrollParent(areas[0]);
        const leaves = leafTexts(scopeOf(areas)).filter(l => isShown(l.el));
        const nameLeaves = leaves.filter(l => byName.has(squash(l.text)));
        const numberLeaves = leaves.filter(l => NUMBER.test(l.text)).map(l => ({ el: l.el, text: l.text.match(NUMBER)[1] }));
        return areas.map(ta => {
            let rowEl = ta.closest('[role="row"], .cl-grid-row, tr');
            if (rowEl && rowEl.querySelectorAll('textarea').length > 1) rowEl = null;   // 줄이 아니라 바깥 표다
            const b = ta.getBoundingClientRect();
            const inRow = (l) => {
                if (rowEl) return rowEl.contains(l.el);
                const r = l.el.getBoundingClientRect();
                const mid = (r.top + r.bottom) / 2;
                return r.height > 0 && mid >= b.top && mid <= b.bottom;
            };
            const names = nameLeaves.filter(inRow);
            let numbers = [];
            if (names.length === 1) {
                const nx = names[0].el.getBoundingClientRect().left;
                const left = numberLeaves.filter(inRow).filter(l => l.el.getBoundingClientRect().right <= nx + 2)
                    .sort((p, q) => q.el.getBoundingClientRect().right - p.el.getBoundingClientRect().right);
                if (left.length) numbers = [intStr(left[0].text)];
            }
            const vrow = (rowEl && rowEl.dataset && rowEl.dataset.vrowindex) ? String(rowEl.dataset.vrowindex) : null;
            const y = b.top + window.scrollY + (sc ? sc.scrollTop : 0);   // 목록 안 절대 위치. 스크롤해도 같은 줄이면 같다.
            return { ta, rowEl, vrow, y, names: uniq(names.map(l => squash(l.text))), numbers };
        });
    }

    // 두 번 훑었을 때 같은 줄인지. 줄 번호 표시가 있으면 그것으로, 없으면 위치가 거의 같으면 같은 줄로 본다.
    function sameRow(a, b) {
        if (a.vrow != null && b.vrow != null) return a.vrow === b.vrow;
        return Math.abs(a.y - b.y) < 24;
    }

    // 한 줄에 어느 학생이 놓였는지 정한다. 이름이 으뜸, 번호가 보이면 번호도 맞아야 한다.
    function decide(row, byName) {
        if (row.names.length === 0) return { student: null, why: '이름 없음' };
        if (row.names.length > 1) return { student: null, why: '한 줄에 이름이 여럿: ' + row.names.join(', ') };
        const cands = byName.get(row.names[0]) || [];
        const byNo = cands.filter(s => row.numbers.includes(intStr(s.number)));
        if (byNo.length === 1) return { student: byNo[0], why: '' };
        if (cands.length === 1) {
            if (row.numbers.length === 0) return { student: cands[0], why: '' };
            return { student: null, why: row.names[0] + ': 이름은 같은데 번호가 다름(화면 ' + row.numbers.join('/') + ', 목록 ' + cands[0].number + ')' };
        }
        return { student: null, why: '동명이인인데 번호로 못 가름: ' + row.names[0] };
    }

    function alreadyHas(before, text) {
        const b = squash(before), t = squash(text);
        return !!t && b.includes(t);
    }

    function targetText(before, text, mode) {
        if (mode === 'append' && before.trim()) return before.replace(/\s+$/, '') + ' ' + text;
        return text;
    }

    // 화면 글 칸에 값을 넣는다. 넣은 뒤 blur 를 흘려야 실행기가 값을 받아들인다.
    function put(ta, target) {
        if (!ta.isConnected) return { ok: false, method: '', why: '칸이 화면에서 사라짐' };
        if (ta.readOnly || ta.disabled) return { ok: false, method: '', why: '읽기 전용 칸(잠긴 화면)' };
        if (ta.maxLength > 0 && target.length > ta.maxLength) return { ok: false, method: '', why: '칸의 최대 글자 수(' + ta.maxLength + ')를 넘어 넣지 않음' };
        ta.focus({ preventScroll: true });
        let method = 'setter';
        if (document.activeElement === ta) {
            method = 'insertText';
            ta.select();
            try { document.execCommand('insertText', false, target); } catch (e) { /* 아래에서 값으로 판정 */ }
        }
        if (ta.value !== target) {
            method = 'setter';
            const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
            setter.call(ta, target);
            ta.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: target }));
        }
        ta.dispatchEvent(new Event('change', { bubbles: true }));
        ta.blur();
        ta.dispatchEvent(new FocusEvent('blur', { bubbles: false }));
        return { ok: ta.value === target, method, why: '' };
    }

    function verifyDom(ta, target) {
        if (!ta.isConnected) return { ok: false, gone: true, why: '칸이 화면에서 사라짐' };
        const after = ta.value;
        if (after === target) return { ok: true, why: '' };
        if (target.startsWith(after) && after.length < target.length) return { ok: false, why: '뒤가 잘림(' + after.length + '자만 남음)' };
        return { ok: false, why: '넣은 값과 칸의 값이 다름' };
    }

    // ── 실행기(cpr) 길 ─────────────────────────────────────────────────────────
    function platform() {
        try {
            const c = window.cpr;
            if (!c || !c.core || !c.core.Platform || !c.core.Platform.INSTANCE) return null;
            return c.core.Platform.INSTANCE;
        } catch (e) { return null; }
    }
    function isGrid(x) { try { return !!(window.cpr.controls.Grid && x instanceof window.cpr.controls.Grid); } catch (e) { return false; } }
    function isTextAreaCtrl(x) { try { return !!(window.cpr.controls.TextArea && x instanceof window.cpr.controls.TextArea); } catch (e) { return false; } }

    function controlsAt(el) {
        const P = platform();
        if (!P || typeof P.findControlsAt !== 'function') return [];
        const r = el.getBoundingClientRect();
        try { return P.findControlsAt(r.left + r.width / 2, r.top + r.height / 2) || []; } catch (e) { return []; }
    }

    // 보이는 화면(앱)들 안의 보이는 목록 컨트롤. 판단할 수 없으면 넣지 않는다(엉뚱한 자료에 쓰지 않으려고).
    function visibleGrids(notes) {
        const P = platform();
        if (!P || typeof P.getAllRunningAppInstances !== 'function') return [];
        let apps = [];
        try { apps = P.getAllRunningAppInstances() || []; } catch (e) { return []; }
        const out = [];
        let skipped = 0;
        for (const app of apps) {
            try {
                if (app.state != null && /CLOS|DISPOS|STOP|DESTROY/i.test(String(app.state))) { skipped += 1; continue; }
                const c = app.getContainer && app.getContainer();
                if (!c || typeof c.isShowing !== 'function' || !c.isShowing()) { skipped += 1; continue; }
                const fn = c.getAllRecursiveChildren || c.getAllRecusiveChildren;
                const kids = fn ? (fn.call(c, true) || []) : [];
                for (const k of kids) {
                    if (!isGrid(k)) continue;
                    if (typeof k.isShowing !== 'function' || !k.isShowing()) { skipped += 1; continue; }
                    out.push(k);
                }
            } catch (e) { skipped += 1; }
        }
        if (skipped) notes.push('판단 못 해 건너뛴 화면·목록 ' + skipped + '개');
        return out;
    }

    function gridColumns(grid) {
        const names = new Set();
        try { const ds = grid.dataSet; if (ds && typeof ds.getColumnNames === 'function') ds.getColumnNames().forEach(n => names.add(String(n))); } catch (e) { /* 다음 방법 */ }
        try {
            const d = grid.detail;
            if (d && typeof d.getCellIndices === 'function') d.getCellIndices().forEach(ci => { const col = d.getColumn(ci); if (col && col.columnName) names.add(String(col.columnName)); });
        } catch (e) { /* 다음 방법 */ }
        try {
            const row = grid.getRow && grid.getRow(0);
            const data = row && row.getRowData && row.getRowData();
            if (data && typeof data === 'object') Object.keys(data).forEach(n => names.add(n));
        } catch (e) { /* 없음 */ }
        return Array.from(names);
    }

    // 글 칸 컨트롤이 붙은 열. 둘 이상이면 어느 것인지 몰라 null.
    function textColumnsByControl(grid) {
        const out = [];
        try {
            const d = grid.detail;
            if (!d || typeof d.getCellIndices !== 'function') return out;
            for (const ci of d.getCellIndices()) {
                const col = d.getColumn(ci);
                if (col && col.columnName && isTextAreaCtrl(col.control)) out.push({ name: String(col.columnName), control: col.control });
            }
        } catch (e) { /* 모름 */ }
        return out;
    }

    function cellValue(grid, i, col) {
        try { const v = grid.getCellValue(i, col); return v == null ? '' : String(v); } catch (e) { return null; }
    }

    function rowDeleted(grid, i) {
        try {
            const st = grid.getRowState(i);
            return /DELETE/i.test(String(st)) || (window.cpr.data && window.cpr.data.tabledata && window.cpr.data.tabledata.RowState
                && (st === window.cpr.data.tabledata.RowState.DELETED || st === window.cpr.data.tabledata.RowState.INSERTDELETED));
        } catch (e) { return false; }
    }

    // 목록의 어느 열이 이름·번호·종합의견인지 값으로 알아낸다(열 이름은 나이스 판마다 다를 수 있으니 값으로 본다).
    // 번호 열은 줄마다 값이 다른 열만 후보다. 학년·반처럼 늘 같은 값인 열이 번호 열로 잡히면 동명이인이 뒤바뀐다.
    function readGrid(grid, roster, byName, filledSamples) {
        let rowCount = 0;
        try { rowCount = grid.getRowCount(); } catch (e) { return null; }
        if (!rowCount) return null;
        const cols = gridColumns(grid);
        if (!cols.length) return null;
        const numbers = new Set(roster.map(s => intStr(s.number)));
        const stats = [];
        for (const col of cols) {
            let nameHits = 0, noHits = 0, bad = false;
            const seen = new Set();
            for (let i = 0; i < rowCount; i += 1) {
                const v = cellValue(grid, i, col);
                if (v == null) { bad = true; break; }
                seen.add(v);
                if (byName.has(squash(v))) nameHits += 1;
                if (/^\d{1,3}$/.test(v.trim()) && numbers.has(intStr(v))) noHits += 1;
            }
            if (!bad) stats.push({ col, nameHits, noHits, distinct: seen.size });
        }
        const nameCands = stats.filter(s => s.nameHits > 0).sort((a, b) => b.nameHits - a.nameHits);
        if (!nameCands.length) return { rowCount, cols: cols.length, colNames: cols, nameCol: null };
        const nameCol = nameCands[0].col;
        // 번호 열: 값이 거의 다 다르고(중복이 줄 수의 1할 미만) 학생 번호와 겹치는 열. 동점이면 정하지 않는다.
        const noAll = stats.filter(s => s.col !== nameCol && s.noHits > 0).sort((a, b) => b.noHits - a.noHits);
        const noCands = noAll.filter(s => (rowCount - s.distinct) <= Math.floor(rowCount / 10));
        let noCol = null;
        if (noCands.length === 1 || (noCands.length > 1 && noCands[0].noHits > noCands[1].noHits)) noCol = noCands[0].col;
        else if (noCands.length > 1) {
            // 동점: 그 열들이 모든 줄에서 같은 값이면 어느 것을 써도 같으니 첫 열을 쓴다.
            // 실제 나이스 학기말종합의견 목록에는 번호 값을 든 열이 둘(stdntInfo, stdntCn) 있다.
            const top = noCands.filter(s => s.noHits === noCands[0].noHits);
            let same = true;
            for (let i = 0; i < rowCount && same; i += 1) {
                const v0 = intStr(cellValue(grid, i, top[0].col));
                for (const s of top.slice(1)) { if (intStr(cellValue(grid, i, s.col)) !== v0) { same = false; break; } }
            }
            if (same) noCol = top[0].col;
        }
        let textCol = null;
        let textHow = '';
        let textControl = null;
        if (filledSamples.length) {
            // 화면 글 칸으로 이미 넣은 값이 어느 열에 들어갔는지로 알아낸다. 가장 믿을 만한 방법이다.
            for (const col of cols) {
                if (col === nameCol || col === noCol) continue;
                let match = 0;
                for (const s of filledSamples) {
                    for (let i = 0; i < rowCount; i += 1) {
                        if (squash(cellValue(grid, i, nameCol)) !== squash(s.name)) continue;
                        if (cellValue(grid, i, col) === s.target) match += 1;
                    }
                }
                if (match > 0) { textCol = col; textHow = '넣은 값이 들어간 열'; break; }
            }
        }
        const byCtrl = textColumnsByControl(grid);
        if (!textCol && byCtrl.length === 1) { textCol = byCtrl[0].name; textHow = '글 칸 컨트롤'; }
        if (textCol) { const hit = byCtrl.find(c => c.name === textCol); if (hit) textControl = hit.control; }
        return {
            rowCount, cols: cols.length, colNames: cols, nameCol, nameHits: nameCands[0].nameHits, noCol, textCol, textHow, textControl, textCtrlCount: byCtrl.length,
            // 진단용: 번호 열 후보마다 맞은 수, 서로 다른 값의 수, 앞 세 줄의 값. 동점이라 못 정했는지 볼 수 있다.
            noCands: noAll.map(s => s.col + '(' + s.noHits + '맞음/' + s.distinct + '가지: ' + [0, 1, 2].filter(i => i < rowCount).map(i => cellValue(grid, i, s.col)).join(',') + ')')
        };
    }

    // 종합의견 열 컨트롤의 길이 한계(있으면). lengthUnit 이 바이트 계열이면 바이트로 잰다.
    function overLimit(ctrl, text) {
        try {
            if (!ctrl) return '';
            const max = Number(ctrl.maxLength);
            if (!(max > 0)) return '';
            const unit = String(ctrl.lengthUnit || '').toLowerCase();
            const n = unit && unit !== 'char' ? neisBytes(text) : Array.from(text).length;
            return n > max ? '한계(' + max + (unit && unit !== 'char' ? '바이트' : '자') + ')를 넘음: ' + n : '';
        } catch (e) { return ''; }
    }

    // ── 본 작업 ───────────────────────────────────────────────────────────────
    async function run(targets, opts) {
        opts = opts || {};
        if (state.running) return { busy: true };
        state.running = true;
        try {
            return await work(targets, opts);
        } finally {
            state.running = false;
        }
    }

    async function work(targets, opts) {
        const mode = opts.mode || 'inspect';                     // 'inspect' | 'overwrite' | 'append'
        const roster = (opts.roster && opts.roster.length) ? opts.roster : targets;   // 동명이인 판단은 전체 명단으로
        const byName = indexByName(roster);
        const targetKeys = new Set(targets.map(keyOf));
        const targetOf = new Map(targets.map(s => [keyOf(s), s]));
        const done = new Map();       // 학생 key → 결과
        const rowNotes = [];          // 이름은 잡혔는데 학생을 못 정한 줄
        let namelessRows = 0;
        const excluded = new Map();   // 두 줄에 걸린 학생 key → 까닭
        let sc = null;
        let startTop = 0;
        let sample = null;
        let scans = 0;
        let scrolls = 0;

        const titles = screenTitles();   // 참고용
        const filters = readFilters();   // 학년도·학기·학년·반·교과(목). 팝업이 글의 학기·과목과 대조해 다르면 넣지 않는다.

        // 0) 한 바퀴 훑기: 학생마다 화면에서 몇 줄에 걸리는지 센다. 두 줄이면 넣지 않는다.
        const rowsByKey = new Map();      // 학생 key → 그 학생으로 판정된 줄들
        const seenNameless = [];
        const scrollScan = async (onRows) => {
            for (let guard = 0; guard < 120; guard += 1) {
                const rows = scan(roster);
                scans += 1;
                if (!sc && rows.length) { sc = scrollParent(rows[0].ta); startTop = sc ? sc.scrollTop : 0; }
                if (!sample && rows.length) sample = { textarea: chainOf(rows[0].ta, 8), maxLength: rows[0].ta.maxLength };
                const stop = onRows(rows);
                if (stop || !sc) break;
                const beforeTop = sc.scrollTop;
                sc.scrollTop = beforeTop + Math.max(80, sc.clientHeight * 0.8);
                scrolls += 1;
                await sleep(250);
                if (sc.scrollTop === beforeTop) break;
            }
        };
        await scrollScan((rows) => {
            for (const row of rows) {
                const d = decide(row, byName);
                if (!d.student) {
                    if (row.names.length) rowNotes.push({ names: row.names, numbers: row.numbers, why: d.why });
                    else if (!seenNameless.some(r => sameRow(r, row))) { seenNameless.push(row); namelessRows += 1; }
                    continue;
                }
                const k = keyOf(d.student);
                if (!rowsByKey.has(k)) rowsByKey.set(k, []);
                const seen = rowsByKey.get(k);
                if (!seen.some(r => sameRow(r, row))) seen.push(row);
                if (mode === 'inspect' && targetKeys.has(k) && !done.has(k)) {
                    done.set(k, { number: d.student.number, name: d.student.name, note: d.why, ta: row.ta, before: row.ta.value, existing: row.ta.value.length, method: '', ok: true });
                }
            }
            return false;
        });
        for (const [k, seen] of rowsByKey) if (seen.length > 1) excluded.set(k, '같은 이름이 화면에 ' + seen.length + '줄이라 넣지 않음');
        if (sc) sc.scrollTop = startTop;

        // 1) 화면 글 칸. 한 줄 넣을 때마다 화면을 새로 훑는다. 보이는 줄만 그리는 화면은 넣는 사이에
        //    줄을 다시 그리므로, 한 회차에 모아 둔 참조를 그대로 쓰면 끊긴 칸을 만진다.
        if (mode !== 'inspect') {
            // 지금 화면에서, 없으면 스크롤하며, 아직 안 넣은 학생 줄 하나를 찾는다.
            const findNext = async () => {
                let found = null;
                await scrollScan((rows) => {
                    for (const row of rows) {
                        const d = decide(row, byName);
                        if (!d.student) continue;
                        const k = keyOf(d.student);
                        if (!targetKeys.has(k) || done.has(k) || excluded.has(k)) continue;
                        found = { row, d, k };
                        return true;
                    }
                    return false;             // 이 화면엔 더 없다. 스크롤한다.
                });
                return found;
            };
            let pending = await findNext();
            for (let guard = 0; guard < 400 && pending; guard += 1) {
                const { row, d, k } = pending;
                // 넣기 직전에 그 줄을 다시 읽어 아직 같은 학생인지 확인한다(줄이 다시 그려졌을 수 있다).
                const fresh = scan(roster).find(r => r.ta === row.ta);
                scans += 1;
                const dd = fresh ? decide(fresh, byName) : null;
                const before = row.ta.value;
                const entry = { number: d.student.number, name: d.student.name, note: d.why, ta: row.ta, before, existing: before.length, method: '', ok: false, why: '' };
                const text = targetOf.get(k).text;
                if (!dd || !dd.student || keyOf(dd.student) !== k) {
                    entry.why = '넣기 직전에 줄이 바뀌어 넣지 않음';
                } else if (mode === 'append' && alreadyHas(before, text)) {
                    entry.ok = true; entry.model = '이미 있음'; entry.after = before.length; entry.target = null;
                } else {
                    entry.target = targetText(before, text, mode);
                    const r = put(row.ta, entry.target);
                    entry.method = r.method;
                    if (r.why) { entry.why = r.why; entry.target = null; }
                    else {
                        await sleep(30);
                        const v = verifyDom(row.ta, entry.target);
                        entry.ok = v.ok; entry.why = v.why; entry.gone = !!v.gone;
                        entry.after = row.ta.isConnected ? row.ta.value.length : null;
                    }
                }
                done.set(k, entry);
                pending = await findNext();
            }
            if (sc) sc.scrollTop = startTop;
        }

        // 2) 실행기 자료. 목록이면 셀 값을 직접 확인하고, 화면에 없어 못 넣은 학생은 여기서 넣는다.
        const api = { available: !!platform(), grid: null, checked: 0, agreed: 0, fixed: 0, filled: 0, same: 0, blocked: [], strays: [], ctrlChecked: 0, ctrlAgreed: 0, ctrlFixed: 0, notes: [] };
        if (api.available) {
            try {
                let grid = null;
                const firstTa = shownTextareas()[0];
                if (firstTa) {
                    firstTa.scrollIntoView({ block: 'center' });     // 좌표로 찾는 것이라 칸이 화면 안에 보여야 한다
                    grid = controlsAt(firstTa).find(isGrid) || null;
                }
                const cands = grid ? [grid] : visibleGrids(api.notes);
                const filledSamples = Array.from(done.values()).filter(e => e.ok && e.target != null).map(e => ({ name: e.name, target: e.target }));
                const found = [];
                for (const g of cands) {
                    const info = readGrid(g, roster, byName, filledSamples);
                    if (info && info.nameCol) found.push({ g, info });
                }
                let best = null;
                // 글 칸 자리에서 찾은 목록, 넣은 값이 들어간 열이 확인된 목록, 또는 명단의 절반 이상이 이름 열에 있는 유일한 목록만 믿는다.
                const trusted = (f) => grid || f.info.textHow === '넣은 값이 들어간 열' || f.info.nameHits * 2 >= roster.length;
                if (found.length === 1 && trusted(found[0])) best = found[0];
                else if (found.length > 1) {
                    const sure = found.filter(f => f.info.textHow === '넣은 값이 들어간 열');
                    if (sure.length === 1) best = sure[0];
                    else api.notes.push('이름 열이 있는 목록이 ' + found.length + '개라 어느 것인지 몰라 실행기로는 넣지 않음');
                } else if (found.length === 1) {
                    api.notes.push('목록을 하나 찾았지만 종합의견 목록이라고 확인되지 않아 실행기로는 넣지 않음');
                }
                if (!best) {
                    if (!api.notes.length) api.notes.push(cands.length ? '이름 열이 있는 목록을 못 찾음' : '보이는 목록 없음');
                } else {
                    const { g, info } = best;
                    api.grid = {
                        rows: info.rowCount, cols: info.cols, nameCol: !!info.nameCol, noCol: !!info.noCol, textCol: !!info.textCol, textHow: info.textHow || '', textCtrlCount: info.textCtrlCount,
                        colNames: info.colNames || [], nameColName: info.nameCol || '', noColName: info.noCol || '', textColName: info.textCol || '', noCands: info.noCands || []
                    };
                    if (!info.textCol) {
                        api.notes.push(info.textCtrlCount > 1 ? '글 칸 열이 ' + info.textCtrlCount + '개라 종합의견 열을 못 정함' : '종합의견 열을 못 정해 실행기로는 넣지 않음');
                    } else {
                        // 목록에서 학생마다 줄을 찾는다. 두 줄이면 건드리지 않는다.
                        const gridRows = new Map();   // key → [rowIndex]
                        for (let i = 0; i < info.rowCount; i += 1) {
                            if (rowDeleted(g, i)) continue;
                            const row = { names: [], numbers: [] };
                            const nm = squash(cellValue(g, i, info.nameCol));
                            if (byName.has(nm)) row.names.push(nm);
                            if (info.noCol) { const no = cellValue(g, i, info.noCol); if (/^\d{1,3}$/.test(String(no).trim())) row.numbers.push(intStr(no)); }
                            const d = decide(row, byName);
                            if (!d.student) continue;
                            const k = keyOf(d.student);
                            if (!gridRows.has(k)) gridRows.set(k, []);
                            gridRows.get(k).push(i);
                        }
                        for (const [k, idx] of gridRows) {
                            if (idx.length > 1 && !excluded.has(k)) excluded.set(k, '목록 자료에 같은 학생이 ' + idx.length + '줄이라 넣지 않음');
                        }
                        for (const [k, idx] of gridRows) {
                            if (!targetKeys.has(k) || excluded.has(k)) continue;
                            const i = idx[0];
                            const s = targetOf.get(k);
                            const cur = cellValue(g, i, info.textCol);
                            if (cur == null) continue;
                            if (done.has(k)) {
                                const e = done.get(k);
                                if (mode === 'inspect' || e.target == null) continue;
                                api.checked += 1;
                                if (cur === e.target) { api.agreed += 1; e.model = '일치'; e.ok = true; e.why = ''; continue; }
                                if (!e.ok && !e.gone) { e.model = '불일치'; continue; }   // 화면이 자르거나 거부한 값은 억지로 넣지 않는다
                                const lim = overLimit(info.textControl, e.target);
                                if (lim) { e.model = '불일치'; e.ok = false; e.why = lim; continue; }
                                let ok = false;
                                try { ok = g.setCellValue(i, info.textCol, e.target); } catch (err) { ok = false; }
                                if (cellValue(g, i, info.textCol) === e.target) { api.fixed += 1; e.model = '실행기로 넣음'; e.ok = true; e.why = ''; }
                                else { e.model = '불일치'; e.ok = false; e.why = (e.why ? e.why + '; ' : '') + '실행기 자료에 안 들어감' + (ok ? '' : '(거부)'); }
                                continue;
                            }
                            // 화면에서 못 찾은 학생: 실행기로 넣는다.
                            const entry = { number: s.number, name: s.name, note: '', ta: null, before: cur, existing: cur.length, method: 'api', ok: false, why: '' };
                            if (mode === 'inspect') { entry.ok = true; entry.model = '실행기에서 찾음'; done.set(k, entry); continue; }
                            if (mode === 'append' && alreadyHas(cur, s.text)) { entry.ok = true; entry.model = '이미 있음'; entry.after = cur.length; api.same += 1; done.set(k, entry); continue; }
                            entry.target = targetText(cur, s.text, mode);
                            if (cur === entry.target) { entry.ok = true; entry.model = '이미 같음'; entry.after = cur.length; api.same += 1; done.set(k, entry); continue; }
                            const lim = overLimit(info.textControl, entry.target);
                            if (lim) { entry.why = lim; api.blocked.push(s.number + '번'); done.set(k, entry); continue; }
                            let ok = false;
                            try { ok = g.setCellValue(i, info.textCol, entry.target); } catch (err) { ok = false; }
                            const after = cellValue(g, i, info.textCol);
                            entry.after = after == null ? null : after.length;
                            if (after === entry.target) { entry.ok = true; entry.model = '실행기로 넣음'; api.filled += 1; }
                            else { entry.why = ok ? '실행기 자료 값이 다름' : '실행기가 거부(검사에 걸림)'; api.blocked.push(s.number + '번'); }
                            done.set(k, entry);
                        }
                        // 엉뚱한 줄에 들어간 글이 없는지: 목표 글과 같은 값이 그 학생 줄이 아닌 곳에 있으면 알린다.
                        if (mode !== 'inspect') {
                            const targetsByText = new Map();
                            for (const e of done.values()) if (e.target) targetsByText.set(e.target, keyOf(e));
                            for (let i = 0; i < info.rowCount; i += 1) {
                                const v = cellValue(g, i, info.textCol);
                                if (!v || !targetsByText.has(v)) continue;
                                const k = targetsByText.get(v);
                                const idx = gridRows.get(k) || [];
                                if (!idx.includes(i)) api.strays.push((i + 1) + '째 줄에 ' + k.split('|')[0] + '번 학생 글');
                            }
                            try { g.redraw(); } catch (e) { /* 그리기는 실행기가 알아서 */ }
                        }
                    }
                }
                // 목록이 아니면(낱개 글 칸) 글 칸 컨트롤의 값으로 확인한다.
                if (!best && mode !== 'inspect') {
                    for (const e of done.values()) {
                        if (!e.ta || e.target == null || !e.ta.isConnected) continue;
                        e.ta.scrollIntoView({ block: 'center' });
                        const ctrl = controlsAt(e.ta).find(isTextAreaCtrl);
                        if (!ctrl) continue;
                        api.ctrlChecked += 1;
                        let v = null;
                        try { v = ctrl.value; } catch (err) { v = null; }
                        if (v === e.target) { api.ctrlAgreed += 1; e.model = '일치'; continue; }
                        if (!e.ok) { e.model = '불일치'; continue; }
                        try { ctrl.value = e.target; } catch (err) { /* 아래에서 판정 */ }
                        try { v = ctrl.value; } catch (err) { v = null; }
                        if (v === e.target) { api.ctrlFixed += 1; e.model = '실행기로 넣음'; }
                        else { e.model = '불일치'; e.ok = false; e.why = (e.why ? e.why + '; ' : '') + '실행기 값이 다름'; }
                    }
                }
            } catch (e) {
                api.notes.push('실행기 확인 중 오류: ' + (e && e.message ? e.message : e));
            }
        }

        const seenNotes = new Set();
        const notes = rowNotes.filter(n => {
            const k = n.names.join(',') + '|' + n.numbers.join(',') + '|' + n.why;
            if (seenNotes.has(k)) return false;
            seenNotes.add(k);
            return true;
        });
        const matched = Array.from(done.values()).map(e => ({
            number: e.number, name: e.name, ok: !!e.ok, existing: e.existing, after: e.after == null ? null : e.after,
            before: e.before, touched: e.target != null || e.method === 'api', method: e.method || '', model: e.model || '',
            note: [e.note, e.why].filter(Boolean).join('; ')
        }));
        const skipped = Array.from(excluded).filter(([k]) => targetKeys.has(k)).map(([k, why]) => (targetOf.get(k).number + '번 ' + targetOf.get(k).name + ': ' + why));
        const unmatched = targets.filter(s => !done.has(keyOf(s)) && !excluded.has(keyOf(s))).map(s => s.number + '번 ' + s.name);
        const result = {
            version: VERSION,
            url: location.href,
            frame: window === window.top ? 'top' : 'iframe',
            mode,
            titles,
            filters,
            textareas: shownTextareas().length,
            scans,
            scrolls,
            scrollable: !!sc,
            hasCpr: api.available,
            api,
            sample,
            namelessRows,
            matched,
            skipped,
            unmatched,
            rowNotes: notes.slice(0, 40)
        };
        if (mode !== 'inspect') state.last = { at: Date.now(), result };
        return result;
    }

    window.__classjNeis = {
        version: VERSION,
        run,
        scan,
        leafTexts,
        last: () => state.last,
        busy: () => state.running,
        _debug: { readGrid, decide, indexByName, cellValue, screenTitles, readFilters, visibleGrids, controlsAt }
    };
})();
