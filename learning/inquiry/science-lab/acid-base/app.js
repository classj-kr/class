document.addEventListener('DOMContentLoaded', () => {
    const solutionButtons = [...document.querySelectorAll('[data-solution]')];
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const dipButton = document.getElementById('dipButton');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const redResult = document.getElementById('redResult');
    const blueResult = document.getElementById('blueResult');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const solutionBadge = document.getElementById('solutionBadge');
    const beaker = document.getElementById('beaker');
    const solutionStopTop = document.getElementById('solutionStopTop');
    const solutionStopBottom = document.getElementById('solutionStopBottom');
    const redWrap = document.getElementById('litmusRedWrap');
    const blueWrap = document.getElementById('litmusBlueWrap');
    // The dip motion is applied to the inner <svg>, not the wrapping div: in
    // testing, a transform set directly on .litmus-wrap never took visual
    // effect (confirmed via getBoundingClientRect — the div's own box stayed
    // put while its child svg moved fine under an identical transform), so
    // the svg is the element that actually carries the motion.
    const redSvg = redWrap.querySelector('.litmus-svg');
    const blueSvg = blueWrap.querySelector('.litmus-svg');
    const redChangeClipRect = document.getElementById('redChangeClipRect');
    const blueChangeClipRect = document.getElementById('blueChangeClipRect');
    const solutionSurface = document.getElementById('solutionSurface');
    const solutionRect = document.getElementById('solutionRect');

    const STRIP_TOP = 4, STRIP_BOTTOM = 216, STRIP_HEIGHT = STRIP_BOTTOM - STRIP_TOP;
    // How much further the strip sinks on "dip", as a fraction of its own
    // height. Applied as a JS-computed px transform (not a CSS percentage —
    // percentage translateY on an aspect-ratio-sized box proved unreliable
    // here) so it stays the single source of truth for both the visual dip
    // motion and the wetted-fraction math below.
    const DIP_DEPTH = .14;

    let dipTimers = [];
    function clearDipTimers() {
        dipTimers.forEach(id => clearTimeout(id));
        dipTimers = [];
    }
    function resetStripReveal(clipRect) {
        clipRect.setAttribute('y', '216');
        clipRect.setAttribute('height', '0');
    }
    // Only the part of the strip that actually goes under the liquid should
    // change color — the dry part above the surface stays as it was. y/height
    // default to the full strip (for callers that don't pass them), but dip()
    // always computes the real wetted fraction below.
    function revealStripChange(clipRect, y = STRIP_TOP, height = STRIP_HEIGHT) {
        clipRect.setAttribute('y', String(y));
        clipRect.setAttribute('height', String(height));
    }

    // Measures the dip offset (px) and how far the strip actually sinks below
    // the liquid surface (as a 0..1 fraction of its own length), from real
    // rendered geometry rather than a guessed constant, so both the motion
    // and the color boundary line up with where the strip visually crosses
    // the surface. Must be called BEFORE the dip transform is applied (reads
    // the rest-position box, then adds the known dip offset analytically).
    function measureDip(wrap) {
        const wrapRect = wrap.getBoundingClientRect();
        const offsetPx = wrapRect.height * DIP_DEPTH;
        const dippedBottom = wrapRect.bottom + offsetPx;
        const submergedPx = dippedBottom - solutionRect.getBoundingClientRect().top;
        const fraction = Math.max(0, Math.min(1, submergedPx / wrapRect.height));
        return { offsetPx, fraction };
    }

    // Color and clarity here match the actual observed appearance of each
    // liquid (same classification as the 색깔·투명도 관찰 lesson before this
    // one), not an arbitrary palette. Vinegar, salt water and sugar water are
    // all genuinely colorless and transparent — same as plain water — which
    // is exactly why sight alone can't tell them apart; that's the reason an
    // indicator is needed at all. Opacity does the transparent/cloudy work:
    // low opacity lets the dark backdrop show through (see-through), high
    // opacity blocks it (milky/opaque).
    const SOLUTIONS = {
        vinegar: { label: '식초', type: 'acid', appearance: '무색 · 투명',
            top: '#6ec8eb', topOpacity: .5, bottom: '#3c96c3', bottomOpacity: .62 },
        lemon: { label: '레몬즙', type: 'acid', appearance: '노란색 · 불투명',
            top: '#f2d64e', topOpacity: .86, bottom: '#dfb636', bottomOpacity: .92 },
        soap: { label: '비눗물', type: 'base', appearance: '흰색 · 불투명',
            top: '#f5f7f8', topOpacity: .82, bottom: '#dfe6e8', bottomOpacity: .88 },
        cleaner: { label: '유리세정제', type: 'base', appearance: '파란색 · 투명',
            top: '#6fb8f2', topOpacity: .5, bottom: '#2f7dcf', bottomOpacity: .65 },
    };
    const TYPE_LABEL = { acid: '산성', base: '염기성' };

    // "은/는" varies with whether the preceding syllable has a batchim
    // (final consonant) — 식초는 vs 소금물은. Every solution label gets
    // interpolated into these sentences, so this can't be hardcoded.
    function topicParticle(word) {
        const code = word.charCodeAt(word.length - 1);
        if (code < 0xac00 || code > 0xd7a3) return '는';
        return (code - 0xac00) % 28 === 0 ? '는' : '은';
    }

    let selectedSolution = null;
    let prediction = null;

    function selectSolution(key) {
        selectedSolution = key;
        const data = SOLUTIONS[key];
        solutionButtons.forEach(btn => btn.classList.toggle('selected', btn.dataset.solution === key));
        solutionStopTop.setAttribute('stop-color', data.top);
        solutionStopTop.setAttribute('stop-opacity', data.topOpacity);
        solutionStopBottom.setAttribute('stop-color', data.bottom);
        solutionStopBottom.setAttribute('stop-opacity', data.bottomOpacity);
        solutionBadge.textContent = `${data.label} (${data.appearance})`;
        beaker.classList.add('has-solution');
        renderBand();
        renderData();
        clearResult();
    }

    /* --------------------------------- 산성·염기성 분류 띠와 표 */
    /* 초등 6학년에서 배우는 것은 pH 숫자가 아니라 지시약으로 무리를 나누는
       일입니다. 그래서 눈금이 아니라 두 칸에 용액을 늘어놓고, 지금 고른 것을
       도드라지게 합니다. */
    const ZONES = [
        { type: 'acid',    name: '산성',   hint: '푸른 리트머스 → 붉게', fill: '#fee2e2', text: '#b91c1c' },
        { type: 'base',    name: '염기성', hint: '붉은 리트머스 → 푸르게', fill: '#dbeafe', text: '#1d4ed8' },
    ];

    function renderBand() {
        const X0 = 18, W = 424, TOP = 30, H = 96;
        const zoneW = W / ZONES.length;
        let out = `<text class="band-title" x="${X0}" y="18">지시약으로 나누어 본 네 가지 용액</text>`;
        ZONES.forEach((z, i) => {
            const x = X0 + i * zoneW;
            out += `<rect class="zone-band" x="${x}" y="${TOP}" width="${zoneW - 4}" height="${H}" rx="9" fill="${z.fill}"/>`;
            out += `<text class="zone-name" style="fill:${z.text}" x="${x + (zoneW - 4) / 2}" y="${TOP + 18}" text-anchor="middle">${z.name}</text>`;
            out += `<text class="zone-hint" x="${x + (zoneW - 4) / 2}" y="${TOP + 32}" text-anchor="middle">${z.hint}</text>`;

            const members = Object.entries(SOLUTIONS).filter(([, d]) => d.type === z.type);
            members.forEach(([key, d], k) => {
                const cy = TOP + 44 + k * 24;
                const isNow = key === selectedSolution;
                out += `<rect class="sol-chip${isNow ? ' now' : ''}" x="${x + 14}" y="${cy}" width="${zoneW - 32}" height="20" rx="7"/>`;
                out += `<text class="sol-name${isNow ? ' now' : ''}" x="${x + (zoneW - 4) / 2}" y="${cy + 14}" text-anchor="middle">${d.label}</text>`;
            });
        });
        out += `<text class="band-note" x="${X0}" y="${TOP + H + 18}">용액의 색만으로 판단하지 않고 리트머스 종이의 변화를 확인합니다.</text>`;
        graphGroup.innerHTML = out;
    }

    function renderData() {
        if (!selectedSolution) {
            dataNote.innerHTML =
                `<div class="data-row"><span class="data-name">고른 용액</span><span class="data-val">아직 고르지 않았습니다</span></div>` +
                `<div class="data-row"><span class="data-name">알아볼 것</span><span class="data-val">리트머스 종이 두 장이 어떻게 바뀌는지</span></div>` +
                `<div class="data-row"><span class="data-name">나누는 무리</span><span class="data-val">산성 · 염기성</span></div>`;
            return;
        }
        const d = SOLUTIONS[selectedSolution];
        const acid = d.type === 'acid', base = d.type === 'base';
        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">고른 용액</span><span class="data-val">${d.label}</span></div>` +
            `<div class="data-row"><span class="data-name">겉보기</span><span class="data-val">${d.appearance}</span></div>` +
            `<div class="data-row"><span class="data-name">푸른 리트머스 종이</span><span class="data-val">${acid ? '붉게 바뀝니다' : '그대로입니다'}</span></div>` +
            `<div class="data-row"><span class="data-name">붉은 리트머스 종이</span><span class="data-val">${base ? '푸르게 바뀝니다' : '그대로입니다'}</span></div>` +
            `<div class="data-row match"><span class="data-name">어느 무리인가</span><span class="data-val">${TYPE_LABEL[d.type]}</span></div>` +
            `<div class="data-row"><span class="data-name">같은 무리의 용액</span><span class="data-val">${Object.values(SOLUTIONS).filter(x => x.type === d.type).map(x => x.label).join(' · ')}</span></div>`;
    }

    function clearResult() {
        clearDipTimers();
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        redWrap.classList.remove('dipping');
        blueWrap.classList.remove('dipping');
        redSvg.style.transform = '';
        blueSvg.style.transform = '';
        resetStripReveal(redChangeClipRect);
        resetStripReveal(blueChangeClipRect);
        stageCaption.textContent = selectedSolution
            ? '리트머스 종이를 담가 확인해 보세요.'
            : '용액을 고르고 리트머스 종이를 담가 보세요.';
    }

    function dip() {
        if (!selectedSolution) {
            stageCaption.textContent = '먼저 확인할 용액을 골라 주세요.';
            return;
        }
        clearDipTimers();
        const data = SOLUTIONS[selectedSolution];
        const type = data.type;

        // The real litmus rule: acid turns blue paper red (red paper stays
        // red); base turns red paper blue (blue paper stays blue); neutral
        // changes neither.
        const redChanges = type === 'base';
        const blueChanges = type === 'acid';

        // Measure how much of the strip is actually underwater BEFORE moving
        // it (the transform we're about to apply would otherwise contaminate
        // the rest-position box this reads).
        const { offsetPx, fraction } = measureDip(redWrap);
        const revealHeight = fraction * STRIP_HEIGHT;
        const revealY = STRIP_BOTTOM - revealHeight;

        // Dip: both strips move down into the solution, the surface ripples
        // on contact, the colour spreads up from the wetted tip partway
        // through the dip, then the strips lift back out.
        redSvg.style.transform = `translateY(${offsetPx}px)`;
        blueSvg.style.transform = `translateY(${offsetPx}px)`;
        redWrap.classList.add('dipping');
        blueWrap.classList.add('dipping');
        solutionSurface.classList.remove('rippling');
        void solutionSurface.offsetWidth;
        solutionSurface.classList.add('rippling');

        dipTimers.push(setTimeout(() => {
            if (redChanges) revealStripChange(redChangeClipRect, revealY, revealHeight); else resetStripReveal(redChangeClipRect);
            if (blueChanges) revealStripChange(blueChangeClipRect, revealY, revealHeight); else resetStripReveal(blueChangeClipRect);
        }, 380));

        dipTimers.push(setTimeout(() => {
            redWrap.classList.remove('dipping');
            blueWrap.classList.remove('dipping');
            redSvg.style.transform = '';
            blueSvg.style.transform = '';

            redResult.textContent = redChanges ? '푸르게 변함' : '그대로';
            blueResult.textContent = blueChanges ? '붉게 변함' : '그대로';
            resultEmpty.hidden = true;
            resultContent.hidden = false;

            predictionResult.textContent = !prediction
                ? '다음에는 결과를 먼저 예상해 보세요.'
                : prediction === type ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';

            const particle = topicParticle(data.label);
            stageCaption.textContent = `${data.label}${particle} ${TYPE_LABEL[type]} 용액입니다.`;
            if (type === 'acid') {
                explanation.textContent = `${data.label}${particle} 산성이라 푸른 리트머스 종이가 붉게 변하고, 붉은 리트머스 종이는 그대로입니다.`;
            } else if (type === 'base') {
                explanation.textContent = `${data.label}${particle} 염기성이라 붉은 리트머스 종이가 푸르게 변하고, 푸른 리트머스 종이는 그대로입니다.`;
            }
        }, 780));
    }

    solutionButtons.forEach(button => button.addEventListener('click', () => selectSolution(button.dataset.solution)));
    // 용액을 고르기 전에도 무리 나눔은 보여 줍니다. 고르고 나서야 그리면
    // 처음 연 사람은 빈 칸을 보게 됩니다.
    renderBand();
    renderData();
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    dipButton.addEventListener('click', dip);

    function shuffleQuizOptions(card) {
        const optionGroup = card.querySelector('.quiz-options');
        const options = Array.from(optionGroup.children);
        for (let index = options.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [options[index], options[randomIndex]] = [options[randomIndex], options[index]];
        }
        optionGroup.append(...options);
    }

    document.querySelectorAll('.quiz-card').forEach(card => {
        shuffleQuizOptions(card);
        const answerButton = card.querySelector('.answer-button');
        const answerResult = card.querySelector('.answer-result');
        const answerExplanation = card.querySelector('.answer-explanation');
        answerButton.addEventListener('click', () => {
            const selected = card.querySelector('input:checked');
            if (!selected) {
                delete card.dataset.state;
                answerResult.textContent = '답을 먼저 선택하세요.';
                return;
            }
            const correct = selected.value === card.dataset.answer;
            card.dataset.state = correct ? 'correct' : 'incorrect';
            answerResult.textContent = correct ? '맞았습니다.' : '다시 생각해 보세요.';
            answerExplanation.hidden = !correct;
            if (!correct) {
                selected.checked = false;
                selected.disabled = true;
                answerResult.textContent = '다시 생각하고 다른 답을 골라보세요.';
            }
        });
    });

    clearResult();
});

/* 그림 속 문장을 HTML로 내린다. 액자를 벗어나거나 서로 겹치는 글자만 옮기므로
   조건이 바뀌어도 스스로 맞는다. 그림에는 짧은 이름표만 남는다. */
(function () {
    const stageVerdict = document.getElementById('stageVerdict');
    const stageReadout = document.getElementById('stageReadout');
    const stageNote = document.getElementById('stageNote');
    if (!stageReadout) return;
    const pairs = [['mainGroup', '.main-svg'], ['graphGroup', '.graph-svg']]
        .map(([id, sel]) => [document.getElementById(id), document.querySelector(sel)])
        .filter(([g, s]) => g && s);
    if (!pairs.length) return;

    // 그림에서 쓰던 색이 흰 바탕에서는 너무 흐린 경우가 있어, 그런 색은 버리고 기본색을 쓴다.
    function readableOnWhite(c) {
        let r, g, b;
        if (c[0] === '#') {
            let h = c.slice(1);
            if (h.length === 3) h = h.split('').map(x => x + x).join('');
            if (h.length !== 6) return false;
            r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16);
        } else {
            const m = c.match(/[\d.]+/g);
            if (!m || m.length < 3) return false;
            r = +m[0]; g = +m[1]; b = +m[2];
            const a = m.length > 3 ? +m[3] : 1;
            r = a * r + (1 - a) * 255; g = a * g + (1 - a) * 255; b = a * b + (1 - a) * 255;
        }
        const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        const L = 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        return 1.05 / (L + 0.05) >= 3.5;
    }

    function liftProse() {
        const rows = [], notes = [], verdicts = [];
        const takeOut = t => {
            const cls = t.getAttribute('class') || '';let txt = t.textContent.trim();
            if(t.matches('.stat-value')){
                const label=t.previousElementSibling;
                if(label?.matches('.stat-name')&&label.getAttribute('y')===t.getAttribute('y')){txt=label.textContent.trim()+': '+txt;label.remove();}
            }
            if (txt) {
                if (/verdict-text/.test(cls)) verdicts.push(txt);
                else if (/note-text/.test(cls)) notes.push(txt);
                else rows.push({ txt, fill: t.style.fill || '' });
            }
            t.remove();
        };
        pairs.forEach(([g, svg]) => {
            const vb = svg.viewBox.baseVal, W = vb.width, H = vb.height;
            const outside = b => b.x < -0.5 || b.x + b.width > W + 0.5 || b.y + b.height > H + 0.5 || b.y < -0.5;
            [...g.querySelectorAll('text')].forEach(t => {
                const cls = t.getAttribute('class') || '';
                const must = /verdict-text|note-text|prose/.test(cls);
                let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { return; }
                // 눈금 같은 짧은 이름표는 밖으로 내보내면 뜻을 잃는다. 액자 안으로 밀어 넣어 본다.
                if (!must && outside(b) && b.width < W * 0.6 && !t.getAttribute('transform')) {
                    const x = parseFloat(t.getAttribute('x')), y = parseFloat(t.getAttribute('y'));
                    if (!Number.isNaN(x)) {
                        const dx = b.x + b.width > W - 2 ? (W - 2) - (b.x + b.width) : (b.x < 2 ? 2 - b.x : 0);
                        if (dx) { t.setAttribute('x', (x + dx).toFixed(1)); b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); }
                    }
                    if (!Number.isNaN(y)) {
                        const dy = b.y + b.height > H - 1 ? (H - 1) - (b.y + b.height) : (b.y < 1 ? 1 - b.y : 0);
                        if (dy) { t.setAttribute('y', (y + dy).toFixed(1)); b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); }
                    }
                }
                if (must || outside(b)) takeOut(t);
            });
            const items = [...g.querySelectorAll('text')].map(t => {
                let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { b = null; }
                return { t, b, len: t.textContent.trim().length };
            }).filter(o => o.b);
            const drop = new Set();
            for (let i = 0; i < items.length; i += 1) for (let j = i + 1; j < items.length; j += 1) {
                if (drop.has(i) || drop.has(j)) continue;
                const a = items[i].b, c = items[j].b;
                if (Math.min(a.x + a.width, c.x + c.width) - Math.max(a.x, c.x) <= 3) continue;
                if (Math.min(a.y + a.height, c.y + c.height) - Math.max(a.y, c.y) <= 1.5) continue;
                const k = items[i].len >= items[j].len ? i : j;
                if (items[k].len < 8) continue;
                drop.add(k);
            }
            [...drop].sort((x, y) => x - y).forEach(k => takeOut(items[k].t));
        });
        // 옮긴 것이 없는 실행은 우리 자신이 일으킨 메아리다. 그때 지우면 방금 옮긴 글이 사라진다.
        if (!rows.length && !notes.length && !verdicts.length) return;
        if (stageVerdict) stageVerdict.textContent = verdicts.join(' ');
        stageReadout.textContent = '';
        rows.forEach(r => {
            const s = document.createElement('span');
            s.textContent = r.txt;
            if (r.fill && readableOnWhite(r.fill)) s.style.color = r.fill;
            stageReadout.appendChild(s);
        });
        if (stageNote) stageNote.textContent = notes.join(' ');
    }

    // 화면이 다시 그려지면 곧바로 돈다. 옮기는 동안 스스로를 깨우지 않도록 잠근다.
    let busy = false, obs;
    // 글자를 옮기는 것도 화면 변경이라 감시기가 다시 불린다. 그때는 기록이 비어 있으므로
    // 그냥 돌아가야 한다. 그러지 않으면 두 번째 실행이 방금 옮긴 결과를 지운다.
    const run = recs => {
        if (busy || (recs && recs.length === 0)) return;
        busy = true;
        try { liftProse(); } finally { obs.takeRecords(); busy = false; }
    };
    obs = new MutationObserver(run);
    pairs.forEach(([g]) => obs.observe(g, { childList: true, subtree: true }));
    run();
    document.addEventListener('DOMContentLoaded', run);
})();
