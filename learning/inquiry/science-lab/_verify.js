/* Re-verification harness. Loaded into each experiment page and evaluated.
   Returns a list of problems; an empty list means the page passed.
   This file is a testing tool and is not linked from any page. */
(() => {
    const P = [];
    const notes = [];
    const seen = new Set();
    const add = (kind, detail) => {
        // The same fault re-appears on every sweep; report each one once.
        const key = kind + '|' + detail.replace(/^[^:]*:\s*/, '');
        if (seen.has(key) || P.length >= 60) return;
        seen.add(key);
        P.push(kind + ' | ' + detail);
    };

    const modelKey = Object.keys(window).find(k => /^__\w+Model$/.test(k));
    const M = modelKey ? window[modelKey] : null;

    // ---- error capture -----------------------------------------------------
    const errs = [];
    const onErr = e => errs.push(String(e.message || e.reason || e));
    window.addEventListener('error', onErr);
    window.addEventListener('unhandledrejection', onErr);

    // ---- Korean particle rules --------------------------------------------
    const jong = ch => {
        const c = ch.charCodeAt(0);
        if (c < 0xac00 || c > 0xd7a3) return -1;
        return (c - 0xac00) % 28;
    };
    // digits are read aloud, so the particle follows the reading:
    // 영(ㅇ) 일(ㄹ) 이 삼(ㅁ) 사 오 육(ㄱ) 칠(ㄹ) 팔(ㄹ) 구
    const DIGIT_JONG = { '0': 21, '1': 8, '2': 0, '3': 16, '4': 0, '5': 0, '6': 1, '7': 8, '8': 8, '9': 0 };
    // latin letters by their Korean reading
    const LATIN = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 21, G: 0, H: 0, I: 0, J: 8, K: 0, L: 8, M: 4, N: 4, O: 0, P: 0, Q: 0, R: 8, S: 0, T: 0, U: 0, V: 0, W: 0, X: 4, Y: 0, Z: 0 };

    /* A trailing letter is only read as a letter-name ("지층 A는") when it is not
       a unit symbol. "9.8 ℃/km로" is read 킬로미터로, not 엠으로, so units need
       the batchim of their spoken Korean name instead. */
    const UNIT_JONG = {
        m: 0, km: 0, cm: 0, mm: 0, nm: 0, µm: 0, μm: 0,          // 미터
        g: 16, kg: 16, mg: 16,                                    // 그램
        L: 0, mL: 0, l: 0, ml: 0,                                 // 리터
        s: 0, ms: 0,                                              // 초
        N: 4, J: 8, W: 0, V: 0, A: 0, K: 4, Pa: 8, Hz: 0,         // 뉴턴 줄 와트 볼트 암페어 켈빈 파스칼 헤르츠
        kW: 0, kJ: 8, kPa: 8, kHz: 0, cal: 0, kcal: 0,            // 칼로리
        '℃': 0, '%': 0, 'Ω': 16, 'mol': 8,                        // 도 퍼센트 옴 몰(ㄹ)
        C: 21, 'μC': 21, 'µC': 21, nC: 21, pC: 21, mC: 21,          // 쿨롱(ㅇ)
        F: 19, pF: 19, nF: 19, 'μF': 19, 'µF': 19, eV: 0, T: 0,   // 패럿(ㅅ) 전자볼트 테슬라
    };
    const UNIT_RE = new RegExp('(' + Object.keys(UNIT_JONG)
        .sort((a, b) => b.length - a.length)
        .map(u => u.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')$');

    function batchimOf(ch, before) {
        // a unit symbol standing right where the particle attaches
        const tail = (before || '') + ch;
        /* Only read a letter as a unit when a number sits in front of it, or it
           follows a solidus as in "℃/km". A bare "K" after a space is a symbol
           standing for something — carrying capacity, say — and is read 케이,
           not 켈빈, which takes the opposite particle. */
        const um = tail.match(UNIT_RE);
        if (um) {
            const before2 = tail.slice(0, tail.length - um[1].length);
            if (/\d\s?$|\/$/.test(before2)) return UNIT_JONG[um[1]];
        }
        if (/[0-9]/.test(ch)) return DIGIT_JONG[ch];
        if (/[A-Za-z]/.test(ch)) {
            // a lone capital used as a name (지층 A, N극) — lower case mid-word is
            // too ambiguous to judge
            if (!/^[A-Z]$/.test(ch)) return null;
            if (/[A-Za-z]$/.test(before || '')) return null;
            return LATIN[ch] ?? null;
        }
        const j = jong(ch);
        return j < 0 ? null : j;
    }

    const NOUNS_RO = new Set(['통로', '도로', '경로', '진로', '회로', '항로', '선로', '수로', '철로', '가로', '세로', '별로', '따로', '서로', '스스로']);
    function particleScan(text, tag) {
        // hard set: 을/를 and 로/으로 and 와/과 — these are almost never verb endings
        // 로/으로 is safe after Hangul, but 을/를 is not: 부을, 나을, 지을 are
        // ㅅ-irregular verb forms, not particles. Those are checked further down,
        // where only digits, letters and units are considered.
        const re = /(.{0,6}?)([0-9A-Za-z가-힣℃%Ω])(으로|로)(?=[\s.,)]|$)/g;
        let m;
        while ((m = re.exec(text))) {
            const ctx = (m[1] + m[2] + m[3]).trim();
            const b = batchimOf(m[2], m[1]);
            if (b === null) continue;
            const p = m[3];
            // nouns that merely end in 로 (이온 통로, 회로, 경로) are not particles
            if (p === '로' && NOUNS_RO.has(m[2] + '로')) continue;
            // ㄹ (jong 8) takes 로, everything else with batchim takes 으로
            if (p === '로' && b > 0 && b !== 8) add('KOREAN', `${tag}: "${ctx}" should be …${m[2]}으로`);
            if (p === '으로' && (b === 0 || b === 8)) add('KOREAN', `${tag}: "${ctx}" should be …${m[2]}로`);
        }
        // 은/는 and 이/가 after a digit or latin letter only (Hangul is too noisy:
        // 는/은 are also verb and adjective endings)
        const re2 = /(.{0,6}?)([0-9A-Za-z℃%Ω])(은|는|이|가|와|과|을|를)(?=[\s.,)]|$)/g;
        while ((m = re2.exec(text))) {
            const b = batchimOf(m[2], m[1]);
            if (b === null) continue;
            const p = m[3], ctx = (m[1] + m[2] + m[3]).trim();
            /* "1가", "2가" — chemical valence, where 가 is part of the term and
               not a particle. It shows up bracketed after a formula, and also
               standing alone in a table cell; a real particle never occupies a
               line by itself. */
            const prevChar = text.charAt(m.index + m[1].length - 1);
            const lineStart = text.lastIndexOf('\n', m.index) + 1;
            let lineEnd = text.indexOf('\n', m.index);
            if (lineEnd < 0) lineEnd = text.length;
            const line = text.slice(lineStart, lineEnd).trim();
            if (p === '가' && /[0-9]$/.test(m[2]) &&
                (prevChar === '(' || /^[0-9]+(\.[0-9]+)?가$/.test(line) ||
                 /^\s*(이온|양이온|음이온|알코올|산|염기)/.test(text.slice(m.index + m[0].length)))) continue;
            if ((p === '은' || p === '이' || p === '과' || p === '을') && b === 0) add('KOREAN', `${tag}: "${ctx}" wrong particle`);
            if ((p === '는' || p === '가' || p === '와' || p === '를') && b > 0) add('KOREAN', `${tag}: "${ctx}" wrong particle`);
        }
    }

    function textScan(tag) {
        const t = document.body.innerText;
        for (const bad of ['undefined', 'NaN', 'Infinity', '[object', 'null']) {
            if (t.includes(bad)) add('TEXT', `${tag}: page shows "${bad}"`);
        }
        if (/습니다[가-힣]/.test(t)) add('TEXT', `${tag}: sentence runs into the next without a break`);
        if (/\s\./.test(t)) add('TEXT', `${tag}: space before a full stop`);
        // trimmed verb endings — the 섞습고 family
        if (/습(고|며|지만|는데|여|서)/.test(t)) add('TEXT', `${tag}: verb ending was cut ("습고" family)`);
        particleScan(t, tag);
        // explanation paragraphs should end as sentences
        document.querySelectorAll('.explanation, #elementaryExplanation').forEach(e => {
            const s = (e.textContent || '').trim();
            if (s && !/[.!?]$/.test(s)) add('TEXT', `${tag}: explanation does not end with a full stop — "…${s.slice(-24)}"`);
        });
    }

    // ---- geometry ----------------------------------------------------------
    /* Measured with client rects rather than getBBox: getBBox reports an
       element's own untransformed geometry, so a group carrying a transform or a
       dot riding an <animateMotion> path reads as far outside the canvas when it
       is really sitting well inside it. Client rects account for both. They do
       ignore clip-path, so clipped subtrees are skipped as before. */
    function geometry(tag) {
        document.querySelectorAll('svg').forEach(svg => {
            const vb = (svg.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number);
            if (vb.length !== 4) return;
            const [, , W, H] = vb;
            const box = svg.getBoundingClientRect();
            if (!box.width || !box.height) return;              // not laid out
            const sx = W / box.width, sy = H / box.height;
            const toVB = r => ({
                x: (r.left - box.left) * sx, y: (r.top - box.top) * sy,
                width: r.width * sx, height: r.height * sy,
            });
            const texts = [];
            for (const e of svg.querySelectorAll('*')) {
                if (e.closest('[clip-path]')) continue;
                if (e.tagName === 'defs' || e.closest('defs')) continue;
                if (e.tagName === 'g' || e.tagName === 'svg') continue;   // children are checked on their own
                // An element carried by <animateMotion> has no meaningful static
                // position, and SMIL does not advance in a hidden frame; the path
                // it follows is checked as an element in its own right.
                if (e.querySelector && e.querySelector('animateMotion')) continue;
                const cr = e.getBoundingClientRect();
                if (!cr.width && !cr.height) continue;
                const b = toVB(cr);
                if (b.x < -1.5 || b.y < -1.5 || b.x + b.width > W + 1.5 || b.y + b.height > H + 1.5) {
                    add('OVERFLOW', `${tag}: <${e.tagName}> "${(e.textContent || '').trim().slice(0, 20)}" at ` +
                        `[${b.x.toFixed(0)},${b.y.toFixed(0)},${b.width.toFixed(0)},${b.height.toFixed(0)}] outside ${W}x${H}`);
                }
                if (e.tagName === 'text' && (e.textContent || '').trim()) texts.push({ b, t: e.textContent.trim() });
            }
            for (let i = 0; i < texts.length; i++) {
                for (let j = i + 1; j < texts.length; j++) {
                    const a = texts[i].b, c = texts[j].b;
                    const ox = Math.min(a.x + a.width, c.x + c.width) - Math.max(a.x, c.x);
                    const oy = Math.min(a.y + a.height, c.y + c.height) - Math.max(a.y, c.y);
                    if (ox > 1 && oy > 1) {
                        add('OVERLAP', `${tag}: "${texts[i].t.slice(0, 18)}" x "${texts[j].t.slice(0, 18)}" ` +
                            `(${ox.toFixed(1)}x${oy.toFixed(1)}px)`);
                    }
                }
            }
        });
    }

    function sweep(tag) { geometry(tag); textScan(tag); }

    // ---- interactions ------------------------------------------------------
    const btns = [...document.querySelectorAll('button[data-prediction], [data-prediction]')];
    // the run control is #runBtn on most pages but carries other ids on a few,
    // so key off the shared class first
    const runButton = () => document.querySelector('.run-button') || document.getElementById('runBtn');
    const dataBtns = [...document.querySelectorAll('button')].filter(b => {
        if (b.classList.contains('answer-button')) return false;
        return [...b.attributes].some(a => a.name.startsWith('data-'));
    });

    // every data-button must be clickable without throwing, and must change something
    const seenAttr = {};
    dataBtns.forEach(b => {
        const attr = [...b.attributes].find(a => a.name.startsWith('data-')).name;
        (seenAttr[attr] = seenAttr[attr] || []).push(b);
    });

    for (const [attr, list] of Object.entries(seenAttr)) {
        // Put every other group back to its first option. A page like the bulb
        // circuit hides the wiring controls while the magnet mode is showing, so
        // a leftover mode from the previous group makes live buttons look dead.
        for (const [other, olist] of Object.entries(seenAttr)) {
            if (other !== attr && olist[0]) { try { olist[0].click(); } catch (_) { } }
        }
        for (let i = 0; i < list.length; i++) {
            const b = list[i];
            // Park on a different option first, or the button under test looks
            // dead simply because it was already selected.
            const other = list[(i + 1) % list.length];
            if (other !== b) { try { other.click(); } catch (_) { } }
            const before = document.body.innerText;
            const beforeDraw = [...document.querySelectorAll('svg')].map(s => s.innerHTML).join('|');
            try { b.click(); } catch (e) { add('THROW', `click ${attr}="${b.getAttribute(attr)}" threw ${e.message}`); continue; }
            sweep(`${attr}=${b.getAttribute(attr)}`);
            // Compare the drawing too: several pages clear the result panel on a
            // change, which leaves the visible text identical even though the
            // apparatus redrew.
            const drawing = [...document.querySelectorAll('svg')].map(s => s.innerHTML).join('|');
            // A control hidden by whatever mode is currently showing is inert by
            // design, not dead — only judge buttons the reader can actually see.
            /* Some controls take effect at the next run rather than immediately
               — choosing which soil to pour, say. Those still mark themselves
               selected, so a button is only called dead when nothing at all
               responds to it. */
            const marked = /selected|active|on\b/.test(b.className);
            if (attr !== 'data-prediction' && b.offsetParent !== null && !marked &&
                document.body.innerText === before && drawing === beforeDraw && list.length > 1) {
                add('DEAD', `${attr}="${b.getAttribute(attr)}" changed nothing and is not even marked selected`);
            }
        }
    }

    // ranges: min, middle, max
    document.querySelectorAll('input[type="range"]').forEach(r => {
        const lo = Number(r.min || 0), hi = Number(r.max || 100);
        if (!(hi > lo)) { add('RANGE', `#${r.id} has min=${r.min} max=${r.max}`); return; }
        for (const v of [lo, (lo + hi) / 2, hi]) {
            r.value = String(v);
            try { r.dispatchEvent(new Event('input', { bubbles: true })); }
            catch (e) { add('THROW', `#${r.id}=${v} threw ${e.message}`); continue; }
            sweep(`#${r.id}=${v}`);
        }
    });

    // checkboxes and selects
    document.querySelectorAll('input[type="checkbox"]:not(.quiz-options *)').forEach(c => {
        for (const v of [true, false, true]) {
            c.checked = v;
            try { c.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) { add('THROW', `#${c.id} threw ${e.message}`); }
        }
        sweep(`#${c.id}`);
    });

    // run to the end
    if (M && typeof M.runToEnd === 'function') {
        try {
            const r = M.runToEnd();
            if (r && r.steps >= 19000) add('RUN', `runToEnd hit the step ceiling (${r.steps}) — it may never stop`);
            sweep('after-run');
        } catch (e) { add('THROW', `runToEnd threw ${e.message}`); }
    } else if (runButton()) {
        try { runButton().click(); sweep('after-run-click'); }
        catch (e) { add('THROW', `run button threw ${e.message}`); }
    }

    // ---- predictions: every choice must be reachable ------------------------
    /* A prediction the apparatus can never make true is a dead button. The
       verdict usually depends on several controls at once, so sweep a grid over
       all of them rather than only the first group. */
    if (btns.length && M) {
        const el = document.getElementById('predictionResult');
        const axes = [];
        for (const [attr, list] of Object.entries(seenAttr)) {
            if (attr === 'data-prediction') continue;
            axes.push(list.map(b => () => b.click()));
        }
        // Sample by fraction, not by absolute value: a slider's max can depend on
        // another control (meiosis has more stages than mitosis), so min and max
        // are re-read at the moment the value is applied.
        document.querySelectorAll('input[type="range"]').forEach(r => {
            axes.push([0, 0.25, 0.5, 0.75, 1].map(fr => () => {
                const lo = Number(r.min || 0), hi = Number(r.max || 100);
                const st = Number(r.step) || (hi - lo) / 8 || 1;
                let v = lo + (hi - lo) * fr;
                v = Math.min(hi, Math.max(lo, Math.round(v / st) * st));
                r.value = String(v);
                r.dispatchEvent(new Event('input', { bubbles: true }));
            }));
        });
        document.querySelectorAll('input[type="checkbox"]').forEach(c => {
            if (c.closest('.quiz-options')) return;
            axes.push([true, false].map(v => () => { c.checked = v; c.dispatchEvent(new Event('change', { bubbles: true })); }));
        });

        const total = axes.reduce((n, a) => n * a.length, 1);
        const CAP = 240;
        const deadline = Date.now() + 4000;          // never let one page stall the run
        const reached = new Set();
        const tryCombo = idx => {
            axes.forEach((a, k) => a[idx[k]]());
            for (const p of btns) {
                p.click();
                // Only fall back to the run button when the page exposes no
                // check(): on a page that animates, running advances the stage
                // and the verdict read back belongs to a different setting.
                let rb = null;
                if (typeof M.check === 'function') { try { M.check(); } catch (_) { } }
                // runToEnd drives the real loop synchronously; clicking the run
                // button only starts an animation that cannot finish inside this
                // loop, so the verdict would never be written.
                else if (typeof M.runToEnd === 'function') { try { M.runToEnd(); } catch (_) { } }
                else if ((rb = runButton())) { try { rb.click(); } catch (_) { } }
                const t = el ? el.textContent + ' ' + el.className : '';
                if (/맞았|correct/.test(t) && !/다른 결과|틀렸|wrong/.test(t)) reached.add(p.getAttribute('data-prediction'));
                if (rb && /멈추|정지|stop/i.test(rb.textContent)) { try { rb.click(); } catch (_) { } }  // leave playback off
            }
        };
        let tried = 0;
        if (total <= CAP) {
            const idx = axes.map(() => 0);
            for (let n = 0; n < total && Date.now() < deadline; n++) {
                tryCombo(idx); tried++;
                for (let k = axes.length - 1; k >= 0; k--) {
                    if (++idx[k] < axes[k].length) break;
                    idx[k] = 0;
                }
            }
        } else {
            for (let n = 0; n < CAP && Date.now() < deadline; n++) {
                tryCombo(axes.map(a => Math.floor(Math.random() * a.length))); tried++;
            }
        }
        if (reached.size === 0) {
            // nothing was ever confirmed right — the page never tells the student
            add('NO-VERDICT', `the result panel never said whether the prediction was right, ` +
                `across ${tried} settings of ${axes.length} controls`);
        } else {
            /* A prediction that never came out right is usually fine — a wrong
               option a student can pick, or a setting this coarse grid missed.
               Kept aside from the real defects and cross-checked separately
               against each model's own verdicts. */
            for (const p of btns) {
                const v = p.getAttribute('data-prediction');
                if (!reached.has(v)) notes.push(`never-right: "${v}" (${p.textContent.trim().slice(0, 20)})`);
            }
        }
    }

    // ---- quiz ---------------------------------------------------------------
    const cards = [...document.querySelectorAll('.quiz-card')];
    if (!cards.length) add('QUIZ', 'no quiz cards on the page');
    cards.forEach((c, i) => {
        const ans = c.dataset.answer;
        const radios = [...c.querySelectorAll('input[type="radio"]')];
        if (radios.length < 2) { add('QUIZ', `card ${i + 1} has ${radios.length} options`); return; }
        if (!radios.some(r => r.value === ans)) { add('QUIZ', `card ${i + 1} answer "${ans}" is not among ${radios.map(r => r.value).join(',')}`); return; }
        const names = new Set(radios.map(r => r.name));
        if (names.size !== 1) add('QUIZ', `card ${i + 1} radios share ${names.size} different names — they will not group`);
        const why = c.querySelector('.answer-explanation');
        if (!why || !why.textContent.trim()) add('QUIZ', `card ${i + 1} has no explanation`);
        const btn = c.querySelector('.answer-button');
        if (!btn) { add('QUIZ', `card ${i + 1} has no answer button`); return; }
        // Two conventions live in this catalogue: older pages set
        // card.dataset.state, newer ones set a class on .answer-result.
        const verdict = () => {
            const res = c.querySelector('.answer-result');
            return (c.dataset.state || '') + ' ' + res.className + ' ' + res.textContent;
        };
        const RIGHT = /correct|맞았/, WRONG = /wrong|incorrect|다시|틀렸/;
        const wrong = radios.find(r => r.value !== ans);
        radios.forEach(r => r.checked = false);
        wrong.checked = true; btn.click();
        const vw = verdict();
        if (!WRONG.test(vw) || RIGHT.test(vw.replace(/incorrect/g, ''))) {
            add('QUIZ', `card ${i + 1} did not mark a wrong answer wrong (got "${vw.trim().slice(0, 40)}")`);
        }
        radios.forEach(r => r.checked = false);
        radios.find(r => r.value === ans).checked = true; btn.click();
        const vr = verdict();
        if (!RIGHT.test(vr)) add('QUIZ', `card ${i + 1} did not mark the right answer right (got "${vr.trim().slice(0, 40)}")`);
        if (why.hidden && !/block|visible/.test(getComputedStyle(why).display)) {
            add('QUIZ', `card ${i + 1} explanation stayed hidden after answering`);
        }
    });

    // duplicate radio names across cards would let one answer clear another
    const allNames = [...document.querySelectorAll('.quiz-card')].map(c => c.querySelector('input')?.name);
    if (new Set(allNames).size !== allNames.length) add('QUIZ', `quiz cards reuse radio names: ${allNames.join(',')}`);

    // ---- page chrome --------------------------------------------------------
    // Two markup conventions exist: the later pages use .page-header /
    // .method-steps / .meaning-panel, the earliest ones .page-heading / .method.
    if (!document.querySelector('.page-header h1, .page-heading h1')) add('CHROME', 'no page title');
    if (!document.querySelector('.meaning-panel, .meaning, .interpretation')) add('CHROME', 'no meaning panel');
    if (!document.querySelector('a[href="../"]')) add('CHROME', 'no link back to the catalog');
    const title = document.querySelector('title')?.textContent || '';
    if (!title.trim()) add('CHROME', 'empty <title>');
    if (!document.querySelector('meta[name="description"]')?.content?.trim()) add('CHROME', 'no meta description');

    // stylesheets and scripts must all have loaded
    [...document.styleSheets].forEach(s => {
        try { void s.cssRules; } catch (e) { if (s.href && s.href.startsWith(location.origin)) add('ASSET', `stylesheet failed: ${s.href}`); }
    });

    // horizontal scroll on the page itself
    if (document.documentElement.scrollWidth > window.innerWidth + 1) {
        add('LAYOUT', `page scrolls sideways: ${document.documentElement.scrollWidth} > ${window.innerWidth}`);
    }

    window.removeEventListener('error', onErr);
    window.removeEventListener('unhandledrejection', onErr);
    errs.forEach(e => add('ERROR', e));

    return {
        dir: location.pathname.split('/').filter(Boolean)[0] || '(root)',
        model: modelKey || null,
        buttons: Object.fromEntries(Object.entries(seenAttr).map(([k, v]) => [k, v.length])),
        ranges: document.querySelectorAll('input[type="range"]').length,
        quiz: cards.length,
        problems: P,
        notes,
    };
})()
