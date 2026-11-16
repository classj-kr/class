document.addEventListener('DOMContentLoaded', () => {
    const kindButtons = [...document.querySelectorAll('[data-kind]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const m1Range = document.getElementById('m1Range');
    const m2Range = document.getElementById('m2Range');
    const v1Range = document.getElementById('v1Range');
    const m1Output = document.getElementById('m1Output');
    const m2Output = document.getElementById('m2Output');
    const v1Output = document.getElementById('v1Output');
    const checkBtn = document.getElementById('checkBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const valueA = document.getElementById('valueA');
    const valueB = document.getElementById('valueB');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const stageBadge = document.getElementById('stageBadge');
    const mainGroup = document.getElementById('mainGroup');
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');

    const TRACK_Y = 160, X0 = 30, PX_PER_M = 38, TRACK_M = 10.4;
    // 수레는 길이 1.4 m로 그려 궤도 위에서 또렷이 보이게 한다(충돌 결과 속도와는 무관).
    const CART_M = 1.4, CART_H = 40, WHEEL_R = 7;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const START1 = 0.4, START2 = 5.4;
    const GRAPH = { x0: 96, x1: 424 };
    const E_OF = { elastic: 1, partial: 0.5, stick: 0 };
    const KIND_NAME = { elastic: '탄성 충돌', partial: '비탄성 충돌', stick: '완전비탄성 충돌' };

    let kind = 'elastic';
    let prediction = null;
    let sim = null, running = false, frameId = 0, lastStamp = 0;
    let revealed = false;   // 충돌시킨 뒤에만 결과 표와 충돌 뒤 막대를 보인다

    const m1 = () => Number(m1Range.value);
    const m2 = () => Number(m2Range.value);
    const v1 = () => Number(v1Range.value);

    function analyse(k = kind, M1 = m1(), M2 = m2(), V1 = v1(), V2 = 0) {
        const e = E_OF[k];
        // one-dimensional collision with restitution e
        const after1 = ((M1 - e * M2) * V1 + (1 + e) * M2 * V2) / (M1 + M2);
        const after2 = ((M2 - e * M1) * V2 + (1 + e) * M1 * V1) / (M1 + M2);
        const pBefore = M1 * V1 + M2 * V2;
        const pAfter = M1 * after1 + M2 * after2;
        const kBefore = 0.5 * M1 * V1 * V1 + 0.5 * M2 * V2 * V2;
        const kAfter = 0.5 * M1 * after1 * after1 + 0.5 * M2 * after2 * after2;
        const verdict = after1 > 0.02 ? 'forward' : after1 < -0.02 ? 'back' : 'stop';
        return { e, kind: k, m1: M1, m2: M2, v1: V1, v2: V2, after1, after2,
                 pBefore, pAfter, kBefore, kAfter, lost: kBefore - kAfter,
                 lostPct: kBefore > 0 ? ((kBefore - kAfter) / kBefore) * 100 : 0, verdict };
    }

    function freshSim(a = analyse()) {
        return { t: 0, x1: START1, x2: START2, v1: a.v1, v2: a.v2, hit: false, tHit: 0, flash: 0, done: false };
    }

    // Advance both carts, stopping exactly at the moment of contact.
    function step(s, dt, a) {
        let left = dt;
        for (let guard = 0; guard < 4 && left > 1e-9; guard += 1) {
            let move = left;
            if (!s.hit) {
                const gap = s.x2 - (s.x1 + CART_M);
                const closing = s.v1 - s.v2;
                if (closing > 1e-9) {
                    const tc = gap / closing;
                    if (tc <= left) move = Math.max(0, tc);
                }
            }
            s.x1 += s.v1 * move;
            s.x2 += s.v2 * move;
            s.t += move;
            left -= move;
            if (!s.hit && s.x2 - (s.x1 + CART_M) <= 1e-9) {
                s.v1 = a.after1; s.v2 = a.after2; s.hit = true; s.tHit = s.t; s.flash = 0.35;
            } else if (move === 0) break;
        }
        if (s.flash > 0) s.flash = Math.max(0, s.flash - dt);
        if (s.x1 < -0.1 || s.x2 + CART_M > TRACK_M + 0.1 || s.t > 8) s.done = true;
        return s.done;
    }

    const px = m => X0 + m * PX_PER_M;

    // 실제 역학 수레: 몸통, 질량만큼 얹은 추, 굴러가는 바퀴, 맞닿는 쪽 범퍼
    function cart(xm, mass, which, kindKey) {
        const x0 = px(xm), w = CART_M * PX_PER_M;
        const bodyBottom = TRACK_Y - WHEEL_R * 2 + 3, top = bodyBottom - CART_H;
        const one = which === 'one';
        const fill = one ? '#2f86a6' : '#c7773e', dark = one ? '#1d5a72' : '#8c4f22', light = one ? '#7cc0d8' : '#eab48a';
        let g = `<g data-scene-key="cart-${which}">`;
        // 범퍼(수레 1은 앞쪽=오른쪽, 수레 2는 뒤쪽=왼쪽)
        const bw = 5, bx = one ? x0 + w - bw : x0;
        const bodyX = one ? x0 : x0 + bw;
        g += `<rect x="${bodyX.toFixed(1)}" y="${top}" width="${(w - bw).toFixed(1)}" height="${CART_H}" rx="5" fill="${fill}" stroke="${dark}" stroke-width="1.4"/>`;
        g += `<rect x="${(bodyX + 3).toFixed(1)}" y="${top + 3}" width="${(w - bw - 6).toFixed(1)}" height="6" rx="3" fill="${light}" opacity=".75"/>`;
        g += `<rect x="${bodyX.toFixed(1)}" y="${bodyBottom - 7}" width="${(w - bw).toFixed(1)}" height="7" rx="2" fill="${dark}" opacity=".55"/>`;
        if (kindKey === 'elastic') {
            // 용수철 범퍼
            const sx = one ? bx : bx + bw, dir = one ? 1 : -1, cy = top + CART_H / 2;
            g += `<path d="M${sx.toFixed(1)} ${cy - 9} l${dir * 3} 3 l${-dir * 3} 3 l${dir * 3} 3 l${-dir * 3} 3 l${dir * 3} 3 l${-dir * 3} 3" fill="none" stroke="#64748b" stroke-width="1.6"/>`;
            g += `<rect x="${(one ? bx + bw - 2 : bx).toFixed(1)}" y="${cy - 11}" width="2" height="22" fill="#64748b"/>`;
        } else {
            // 고무 범퍼(비탄성) / 찍찍이(완전비탄성)
            const fillB = kindKey === 'stick' ? '#a16207' : '#334155';
            g += `<rect x="${bx.toFixed(1)}" y="${top + 8}" width="${bw}" height="${CART_H - 16}" rx="1.5" fill="${fillB}"/>`;
            if (kindKey === 'stick') for (let yy = top + 10; yy < top + CART_H - 9; yy += 3) g += `<line x1="${bx.toFixed(1)}" y1="${yy}" x2="${(bx + bw).toFixed(1)}" y2="${yy + 1.5}" stroke="#fde68a" stroke-width=".8"/>`;
        }
        // 질량만큼 쌓은 추(1 kg에 한 개)
        const bk = 8.5, gap = 1.5, rowW = mass * bk + (mass - 1) * gap;
        const bxs = bodyX + (w - bw - rowW) / 2;
        for (let i = 0; i < mass; i += 1) {
            g += `<rect x="${(bxs + i * (bk + gap)).toFixed(1)}" y="${top - 10}" width="${bk}" height="10" rx="1.5" fill="#a8b4c2" stroke="#526072" stroke-width="1"/>`;
        }
        g += `<text class="cart-mass" x="${(bodyX + (w - bw) / 2).toFixed(1)}" y="${top + 27}" text-anchor="middle">${mass} kg</text>`;
        // 바퀴: 굴러간 거리만큼 돈다
        const turn = ((xm * PX_PER_M) / WHEEL_R) * 180 / Math.PI;
        for (const f of [0.24, 0.76]) {
            const cx = x0 + w * f, cy = TRACK_Y - WHEEL_R;
            g += `<g transform="translate(${cx.toFixed(1)} ${cy}) rotate(${turn.toFixed(1)})"><circle r="${WHEEL_R}" fill="#26333c" stroke="#8aa0ab" stroke-width="1.2"/><path d="M-4.5 0H4.5M0 -4.5V4.5" stroke="#c7d7df" stroke-width="1.2"/><circle r="1.6" fill="#e2e8f0"/></g>`;
        }
        g += `<text class="cart-name" x="${(x0 + w / 2).toFixed(1)}" y="${TRACK_Y + 34}" text-anchor="middle">수레 ${one ? 1 : 2}</text>`;
        return g + '</g>';
    }

    function arrow(cx, y, v, cls) {
        if (Math.abs(v) < 0.03) return `<text class="small-label" x="${cx.toFixed(1)}" y="${y + 4}" text-anchor="middle">정지</text>`;
        const len = Math.min(52, 10 + Math.abs(v) * 9) * Math.sign(v);
        const tip = cx + len;
        return `<line class="vel-arrow ${cls}" x1="${cx.toFixed(1)}" y1="${y}" x2="${tip.toFixed(1)}" y2="${y}"/>` +
               `<path class="vel-arrow ${cls}" d="M${(tip - Math.sign(v) * 6).toFixed(1)},${y - 5} L${tip.toFixed(1)},${y} L${(tip - Math.sign(v) * 6).toFixed(1)},${y + 5}"/>`;
    }

    function renderMain(a, s) {
        let body = '';
        // 알루미늄 궤도: 레일, 받침 다리, 1 m 눈금
        const tx0 = px(0) - 8, tx1 = px(TRACK_M) + 8;
        body += `<rect class="rail" x="${tx0}" y="${TRACK_Y}" width="${tx1 - tx0}" height="8" rx="2"/>`;
        body += `<line class="rail-groove" x1="${tx0 + 4}" y1="${TRACK_Y + 3}" x2="${tx1 - 4}" y2="${TRACK_Y + 3}"/>`;
        for (const lx of [tx0 + 14, (tx0 + tx1) / 2, tx1 - 14]) body += `<path class="rail-leg" d="M${lx - 6} ${TRACK_Y + 19}L${lx} ${TRACK_Y + 8}L${lx + 6} ${TRACK_Y + 19}"/>`;
        for (let m = 0; m <= TRACK_M; m += 1) {
            body += `<line class="track-tick" x1="${px(m).toFixed(1)}" y1="${TRACK_Y + 8}" x2="${px(m).toFixed(1)}" y2="${TRACK_Y + 13}"/>`;
        }
        body += cart(s.x1, a.m1, 'one', a.kind);
        body += cart(s.x2, a.m2, 'two', a.kind);
        const top = TRACK_Y - WHEEL_R * 2 + 3 - CART_H - 10;
        body += arrow(px(s.x1 + CART_M / 2), top - 14, s.v1, 'one');
        body += arrow(px(s.x2 + CART_M / 2), top - 36, s.v2, 'two');
        if (s.flash > 0) {
            const k = 1 - s.flash / 0.35, cx = px(s.x1 + CART_M), cy = TRACK_Y - 30;
            const r = 8 + k * 26, op = (s.flash / 0.35).toFixed(2);
            body += `<circle class="flash" cx="${cx.toFixed(1)}" cy="${cy}" r="${r.toFixed(1)}" opacity="${op}"/>`;
            for (let i = 0; i < 6; i += 1) {
                const ang = -Math.PI / 2 + (i - 2.5) * 0.45, r1 = r + 3, r2 = r + 10;
                body += `<line class="flash" x1="${(cx + Math.cos(ang) * r1).toFixed(1)}" y1="${(cy + Math.sin(ang) * r1).toFixed(1)}" x2="${(cx + Math.cos(ang) * r2).toFixed(1)}" y2="${(cy + Math.sin(ang) * r2).toFixed(1)}" opacity="${op}"/>`;
            }
        }
        let out = `<g clip-path="url(#trackClip)">${body}</g>`;
        out += `<text class="part-label" x="20" y="24">${KIND_NAME[a.kind]} · e = ${a.e}</text>`;
        const tone = s.hit ? '#059669' : '#b45309';
        out += `<text class="phase-text" fill="${tone}" x="440" y="24" text-anchor="end">${s.hit ? '충돌 뒤' : '충돌 전'} · ${s.t.toFixed(2)} 초</text>`;
        out += `<text class="read-text" x="230" y="224" text-anchor="middle">수레 1 ${s.v1.toFixed(2)} m/s · 수레 2 ${s.v2.toFixed(2)} m/s</text>`;
        window.scienceScene.render(mainGroup,out);
    }

    function waiting(y) {
        return `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${y + 4}" text-anchor="end">충돌 후</text>` +
               `<rect class="bar-slot" x="${GRAPH.x0}" y="${y - 7}" width="${GRAPH.x1 - GRAPH.x0}" height="15" rx="3"/>` +
               `<text class="small-label" x="${GRAPH.x0 + 8}" y="${y + 4}">충돌시키면 나타납니다</text>`;
    }

    function bar(y, label, value, max, colour, unit, showValue = true) {
        const w = max > 0 ? ((value / max) * (GRAPH.x1 - GRAPH.x0)) : 0;
        let out = `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${y + 4}" text-anchor="end">${label}</text>`;
        out += `<rect class="bar" x="${GRAPH.x0}" y="${y - 7}" width="${Math.max(1, w).toFixed(1)}" height="15" rx="3" fill="${colour}" opacity=".85"/>`;
        const flip = GRAPH.x0 + w > GRAPH.x1 - 70;
        if (showValue) out += `<text class="bar-text" style="fill:${flip ? '#ffffff' : colour}" x="${(GRAPH.x0 + w + (flip ? -6 : 6)).toFixed(1)}" y="${y + 4}"${flip ? ' text-anchor="end"' : ''}>${value.toFixed(2)} ${unit}</text>`;
        return out;
    }

    function renderGraph(a, s = sim) {
        // 충돌 뒤 막대는 부딪친 순간부터 자라나고, 그 전에는 비어 있다
        const grow = revealed ? 1 : (s && s.hit ? Math.min(1, (s.t - s.tHit) / 0.7) : 0);
        const eased = 1 - (1 - grow) ** 3;
        const pMax = Math.max(a.pBefore, a.pAfter) * 1.18 || 1;
        const kMax = Math.max(a.kBefore, a.kAfter) * 1.18 || 1;
        let out = '';
        out += `<text class="axis-title" x="20" y="26">두 수레 운동량 합 — 외부 충격량 무시</text>`;
        out += bar(50, '충돌 전', a.pBefore, pMax, '#059669', '');
        out += grow > 0 ? bar(76, '충돌 후', a.pAfter * eased, pMax, '#059669', '', grow >= 1) : waiting(76);
        const pLine = GRAPH.x0 + (a.pBefore / pMax) * (GRAPH.x1 - GRAPH.x0);
        out += `<line class="keep-line" x1="${pLine.toFixed(1)}" y1="36" x2="${pLine.toFixed(1)}" y2="90"/>`;

        out += `<text class="axis-title" x="20" y="118">운동 에너지 (J) — 탄성 충돌에서만 보존</text>`;
        out += bar(142, '충돌 전', a.kBefore, kMax, '#d97706', 'J');
        out += grow > 0 ? bar(168, '충돌 후', a.kAfter * eased, kMax, a.lost > 1e-9 ? '#ea580c' : '#d97706', 'J', grow >= 1) : waiting(168);
        const kLine = GRAPH.x0 + (a.kBefore / kMax) * (GRAPH.x1 - GRAPH.x0);
        out += `<line class="keep-line" x1="${kLine.toFixed(1)}" y1="128" x2="${kLine.toFixed(1)}" y2="182"/>`;
        if (grow < 1) {
            // 아직 충돌 전
        } else if (a.lost > 1e-9) {
            out += `<text class="lost-text" x="${GRAPH.x1}" y="192" text-anchor="end">${a.lost.toFixed(2)} J (${a.lostPct.toFixed(0)}%)이 소리·열로</text>`;
        } else {
            out += `<text class="keep-text" x="${GRAPH.x1}" y="192" text-anchor="end">줄어든 에너지가 없습니다</text>`;
        }
        window.scienceScene.render(graphGroup,out);
    }

    function render() {
        const a = analyse();
        if (!sim) sim = freshSim(a);
        renderMain(a, sim);
        renderGraph(a);
        m1Output.textContent = `${a.m1} kg`;
        m2Output.textContent = `${a.m2} kg`;
        v1Output.textContent = `${a.v1.toFixed(1)} m/s`;
        stageBadge.textContent = revealed ? `${KIND_NAME[a.kind]} · ${VERDICT[a.verdict]}` : KIND_NAME[a.kind];
        if (!revealed) { window.scienceScene.render(dataNote, ''); return a; }
        window.scienceScene.render(dataNote,`<div class="data-row"><span class="data-name">충돌 뒤 속도</span><span class="data-val">수레 1 ${a.after1.toFixed(2)} m/s · 수레 2 ${a.after2.toFixed(2)} m/s</span></div>` +
            `<div class="data-row"><span class="data-name">운동량</span><span class="data-val">${a.pBefore.toFixed(2)} → ${a.pAfter.toFixed(2)} kg·m/s (차이 ${Math.abs(a.pAfter - a.pBefore).toExponential(1)})</span></div>` +
            `<div class="data-row"><span class="data-name">운동 에너지</span><span class="data-val">${a.kBefore.toFixed(2)} → ${a.kAfter.toFixed(2)} J</span></div>` +
            `<div class="data-row"><span class="data-name">반발 계수</span><span class="data-val">(${a.after2.toFixed(2)} − ${sn(a.after1)}) ÷ ${a.v1.toFixed(1)} = ${a.e}</span></div>` +
            `<div class="data-row match"><span class="data-name">수레 1</span><span class="data-val">${VERDICT[a.verdict]}</span></div>`);
        return a;
    }

    const VERDICT = { forward: '계속 앞으로', stop: '그 자리에 선다', back: '뒤로 튕긴다' };
    // a bounced-back speed is negative, and "1×-2.00" needs brackets to read
    const sn = v => (v < 0 ? `(−${Math.abs(v).toFixed(2)})` : v.toFixed(2));

    function stopRun() { running = false; if (frameId) cancelAnimationFrame(frameId); frameId = 0; }

    function tick(dt) {
        const a = analyse();
        const done = step(sim, dt, a);
        render();
        return done;
    }

    function frame(stamp) {
        if (!running) return;
        const dt = Math.min(0.04, (stamp - lastStamp) / 1000 || 0);
        lastStamp = stamp;
        if (tick(dt)) { stopRun(); finish(); } else frameId = requestAnimationFrame(frame);
    }

    function startRun() {
        stopRun();
        revealed = false;
        sim = freshSim(analyse());
        if (reduceMotion?.matches) {
            let n = 0; while (!step(sim, 1 / 120, analyse()) && n < 4000) n += 1;
            finish(); return;
        }
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function finish() {
        revealed = true;
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        valueA.textContent = `${a.after1.toFixed(2)} / ${a.after2.toFixed(2)} m/s`;
        valueB.textContent = a.lost > 1e-9 ? `${a.kAfter.toFixed(2)} J (${a.lostPct.toFixed(0)}% 감소)` : `${a.kAfter.toFixed(2)} J (보존)`;
        predictionResult.textContent = !prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        let s = `충돌 전 운동량은 ${a.m1}×${a.v1.toFixed(1)} = ${a.pBefore.toFixed(2)} kg·m/s 입니다. `;
        s += `충돌 뒤 ${a.m1}×${sn(a.after1)} + ${a.m2}×${sn(a.after2)} = ${a.pAfter.toFixed(2)} kg·m/s로 정확히 같습니다. `;
        s += `외부 충격량을 무시한 두 수레계에서 운동량 합이 보존됩니다. `;
        if (a.lost > 1e-9) {
            s += `반면 운동 에너지는 ${a.kBefore.toFixed(2)} J 에서 ${a.kAfter.toFixed(2)} J로 ${a.lostPct.toFixed(0)}% 줄었습니다. ` +
                 `줄어든 ${a.lost.toFixed(2)} J은 충돌 소리와 열, 수레의 변형으로 바뀐 것이지 사라진 것이 아닙니다. `;
        } else {
            s += `탄성 충돌이라 운동 에너지도 ${a.kBefore.toFixed(2)} J 그대로 보존되었습니다. `;
        }
        if (a.verdict === 'back') {
            s += `수레 1의 질량 ${a.m1} kg이 e×m₂ = ${(a.e * a.m2).toFixed(1)} kg보다 작아 충돌 뒤 속도가 음수가 되었습니다. 그래서 뒤로 튕겨 나옵니다.`;
        } else if (a.verdict === 'stop') {
            s += `수레 1의 질량이 e×m₂ = ${(a.e * a.m2).toFixed(1)} kg과 같아 충돌 뒤 속도가 정확히 0이 되었습니다. 가진 운동량을 모두 넘겨주고 그 자리에 섭니다.`;
        } else if (a.kind === 'stick') {
            s += `완전비탄성이라 두 수레가 붙어 ${a.after1.toFixed(2)} m/s로 함께 갑니다. 이때 운동 에너지가 가장 많이 줄어듭니다.`;
        } else {
            s += `수레 1의 질량이 e×m₂ = ${(a.e * a.m2).toFixed(1)} kg보다 커서 충돌 뒤에도 앞으로 나아갑니다.`;
        }
        explanation.textContent = s;
    }

    function changed() {
        stopRun();
        revealed = false;
        sim = freshSim(analyse());
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    [m1Range, m2Range, v1Range].forEach(el => el.addEventListener('input', changed));
    kindButtons.forEach(button => button.addEventListener('click', () => {
        kind = button.dataset.kind;
        kindButtons.forEach(item => item.classList.toggle('selected', item === button));
        changed();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        m1Range.value = '2'; m2Range.value = '2'; v1Range.value = '3';
        prediction = null;
        predictionButtons.forEach(item => item.classList.remove('selected'));
        stageCaption.textContent = '이 모형은 외부 충격량을 무시하므로 두 수레의 운동량 합이 충돌 전후 같습니다. 운동 에너지는 그렇지 않습니다.';
        kindButtons.find(b => b.dataset.kind === 'elastic').click();
    });

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

    window.__collideModel = {
        TRACK_Y, X0, PX_PER_M, CART_M, START1, START2, E_OF, analyse, freshSim, step, render, check: finish,
        setKind(k) { kindButtons.find(b => b.dataset.kind === k).click(); },
        setM1(v) { m1Range.value = String(v); changed(); },
        setM2(v) { m2Range.value = String(v); changed(); },
        setV1(v) { v1Range.value = String(v); changed(); },
        runToEnd(dt = 1 / 120, cap = 4000) {
            stopRun(); sim = freshSim(analyse());
            let n = 0; while (!tick(dt) && n < cap) n += 1;
            finish(); return { steps: n, t: sim.t, hit: sim.hit };
        },
        getSim: () => sim, tick,
    };

    resetBtn.click();
});
