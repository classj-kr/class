document.addEventListener('DOMContentLoaded', () => {
    const conditionButtons = [...document.querySelectorAll('[data-cond]')];
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const growButton = document.getElementById('growBtn');
    const resetButton = document.getElementById('resetBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const resultGerm = document.getElementById('resultGerm');
    const resultStage = document.getElementById('resultStage');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const dayBadge = document.getElementById('dayBadge');
    const plantGroup = document.getElementById('plantGroup');
    const labelGroup = document.getElementById('labelGroup');
    const sunGroup = document.getElementById('sunGroup');
    const sunBeams = document.getElementById('sunBeams');
    const airZone = document.querySelector('.air-zone');
    const potGroup = document.getElementById('potGroup');
    const compareTable = document.getElementById('compareTable');

    const COND_LABELS = {
        water: { on: '준다', off: '주지 않음', name: '물' },
        warm:  { on: '따뜻함', off: '차가움', name: '알맞은 온도' },
        air:   { on: '통한다', off: '막힘', name: '공기' },
        light: { on: '비춘다', off: '어두움', name: '빛' },
    };

    const SOIL_Y = 180;
    const SEED = { x: 262, y: 232 };
    // 투명 화분에 심은 콩 세 알: 이름표는 오른쪽 콩에만 붙인다. 앞의 수는 자라기 시작하는 때의 차이
    const SEEDS = [{ x: 118, y: 226, lag: 0.05, k: 0.86 }, { x: 188, y: 236, lag: 0.025, k: 0.9 }, { x: SEED.x, y: SEED.y, lag: 0, k: 1 }];
    const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const records = {};   // 학생이 실제로 관찰한 조건별 결과
    let finished = false;
    const GROW_SECONDS = 9;         // display seconds for a full run
    const TOTAL_DAYS = 10;

    let conditions = { water: true, warm: true, air: true, light: true };
    let prediction = null;
    let progress = 0;
    let growing = false;
    let rafId = null, lastT = null;

    // Germination needs water, a suitable temperature and air. Light is
    // deliberately excluded: seeds sprout in the dark, and treating light as
    // required is the misconception this experiment exists to correct.
    const germinates = () => conditions.water && conditions.warm && conditions.air;
    const missingConditions = () =>
        ['water', 'warm', 'air'].filter(k => !conditions[k]).map(k => COND_LABELS[k].name);

    const clamp01 = v => Math.max(0, Math.min(1, v));

    // Korean particles depend on whether the preceding syllable ends in a
    // consonant: 물이/공기가, 물과/공기와. The condition names are assembled
    // into sentences at runtime, so these can't be written inline.
    function hasBatchim(word) {
        const code = word.charCodeAt(word.length - 1);
        if (code < 0xac00 || code > 0xd7a3) return false;
        return (code - 0xac00) % 28 !== 0;
    }
    const subjectParticle = w => (hasBatchim(w) ? '이' : '가');
    // Joins a list the way Korean does: 물과 공기, 물과 알맞은 온도와 공기.
    function joinAnd(words) {
        return words.reduce((acc, w, i) =>
            i === 0 ? w : `${acc}${hasBatchim(words[i - 1]) ? '과' : '와'} ${w}`, '');
    }

    function stageName(p) {
        if (p < 0.02) return '씨 그대로';
        if (p < 0.2) return '물을 빨아들임';
        if (p < 0.45) return '뿌리가 남';
        if (p < 0.75) return '떡잎이 남';
        return '본잎이 남';
    }

    function buildBeams() {
        let out = '';
        for (let i = 0; i < 6; i += 1) {
            const a = (200 + i * 22) * Math.PI / 180;
            const x1 = 380 + 27 * Math.cos(a), y1 = 44 + 27 * Math.sin(a);
            const x2 = 380 + 38 * Math.cos(a), y2 = 44 + 38 * Math.sin(a);
            out += `<line class="sun-beam" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
        }
        sunBeams.innerHTML = out;
    }

    // 콩 한 알의 그림. p는 0~1 (자란 정도), k는 크기 배율, label이면 부분 이름을 붙인다
    function plantMarkup(sd, p, lit) {
        const { x, y, k } = sd;
        const leafFill = lit ? '#5fb85f' : '#dedc9c', leafEdge = lit ? '#3f8a43' : '#b9b77a';
        const stemStroke = lit ? '#4f9e52' : '#cfd292';
        const swell = 1 + 0.5 * clamp01(p / 0.2);
        const rootLen = clamp01((p - 0.2) / 0.3) * 48 * k;
        const shoot = clamp01((p - 0.38) / 0.37);               // 0: 흙 속, 1: 다 자람
        const stemMax = (lit ? (y - SOIL_Y) + 58 : (y - SOIL_Y) + 92) * k;
        const stemLen = shoot * stemMax;
        const hook = 1 - clamp01((p - 0.6) / 0.12);              // 흙을 뚫을 때는 고개를 숙인 갈고리 모양
        const cot = clamp01((p - 0.62) / 0.16);
        const trueLeaf = clamp01((p - 0.8) / 0.2);
        let out = '';
        // 뿌리: 아래로 뻗고, 길어지면 곁뿌리
        if (rootLen > 0.5) {
            const ry = y + 9 + rootLen;
            out += `<path class="root" d="M${x},${y + 8} C${x - 5},${(y + 8 + rootLen * .4).toFixed(1)} ${x + 6},${(y + 8 + rootLen * .7).toFixed(1)} ${x - 2},${ry.toFixed(1)}"/>`;
            if (rootLen > 24) {
                const side = clamp01((rootLen - 24) / 30);
                out += `<path class="root thin" d="M${x - 1},${y + 26} q-8,4 ${(-16 * side).toFixed(1)},${(14 * side).toFixed(1)}"/>`;
                out += `<path class="root thin" d="M${x + 2},${y + 36} q8,3 ${(15 * side).toFixed(1)},${(13 * side).toFixed(1)}"/>`;
                out += `<path class="root thin" d="M${x},${y + 48} q-6,4 ${(-11 * side).toFixed(1)},${(11 * side).toFixed(1)}"/>`;
            }
        }
        // 줄기: 처음엔 갈고리로 흙을 밀고 올라오고, 흙 위에서 곧게 선다
        let topX = x, topY = y - 6;
        if (stemLen > 0.5) {
            topY = y - 6 - stemLen;
            const bend = 14 * hook * k;
            topX = x + bend * 0.6;
            out += `<path class="stem" style="stroke:${stemStroke}" d="M${x},${y - 4} C${x},${(y - 4 - stemLen * .5).toFixed(1)} ${(x + bend).toFixed(1)},${(topY - 4 * hook).toFixed(1)} ${topX.toFixed(1)},${(topY + 6 * hook).toFixed(1)}"/>`;
            // 떡잎: 콩 껍질이 열리며 두 장이 벌어진다
            const cw = (5 + 14 * cot) * k, ch = (4.5 + 6.5 * cot) * k, spread = 0.25 + 0.75 * cot, ang = 30 * (1 - cot);
            const cy = topY + 6 * hook;
            out += `<ellipse class="leaf" style="fill:${leafFill};stroke:${leafEdge}" cx="${(topX - cw * spread).toFixed(1)}" cy="${cy.toFixed(1)}" rx="${cw.toFixed(1)}" ry="${ch.toFixed(1)}" transform="rotate(${(-ang).toFixed(1)} ${(topX - cw * spread).toFixed(1)} ${cy.toFixed(1)})"/>`;
            out += `<ellipse class="leaf" style="fill:${leafFill};stroke:${leafEdge}" cx="${(topX + cw * spread).toFixed(1)}" cy="${cy.toFixed(1)}" rx="${cw.toFixed(1)}" ry="${ch.toFixed(1)}" transform="rotate(${ang.toFixed(1)} ${(topX + cw * spread).toFixed(1)} ${cy.toFixed(1)})"/>`;
            if (trueLeaf > 0.02) {
                const w = 16 * trueLeaf * k, h = 8.5 * trueLeaf * k, ly = topY - 20 * trueLeaf * k;
                out += `<path class="stem" style="stroke:${stemStroke}" d="M${topX.toFixed(1)},${topY.toFixed(1)} L${topX.toFixed(1)},${ly.toFixed(1)}"/>`;
                out += `<ellipse class="leaf" style="fill:${leafFill};stroke:${leafEdge}" cx="${(topX - w * .8).toFixed(1)}" cy="${ly.toFixed(1)}" rx="${w.toFixed(1)}" ry="${h.toFixed(1)}" transform="rotate(-24 ${(topX - w * .8).toFixed(1)} ${ly.toFixed(1)})"/>`;
                out += `<ellipse class="leaf" style="fill:${leafFill};stroke:${leafEdge}" cx="${(topX + w * .8).toFixed(1)}" cy="${ly.toFixed(1)}" rx="${w.toFixed(1)}" ry="${h.toFixed(1)}" transform="rotate(24 ${(topX + w * .8).toFixed(1)} ${ly.toFixed(1)})"/>`;
                topY = ly;
            }
        }
        // 콩: 물을 빨아들이면 부풀고, 뿌리가 나면 껍질이 갈라진다. 떡잎이 흙 위로 올라가면 빈 껍질만 작게 남는다
        const coat = 1 - 0.45 * clamp01((p - 0.62) / 0.2);
        const bw = 12 * swell * k * coat, bh = 8.5 * swell * k * coat;
        const beanCol = p > 0.02 ? '#c79a5b' : '#d8b878';
        out += `<path class="seed-body" style="fill:${beanCol}" d="M${(x - bw).toFixed(1)},${y} C${(x - bw).toFixed(1)},${(y - bh * 1.25).toFixed(1)} ${(x + bw).toFixed(1)},${(y - bh * 1.25).toFixed(1)} ${(x + bw).toFixed(1)},${y} C${(x + bw).toFixed(1)},${(y + bh * 1.1).toFixed(1)} ${(x + bw * .2).toFixed(1)},${(y + bh * .55).toFixed(1)} ${x},${(y + bh * .6).toFixed(1)} C${(x - bw * .2).toFixed(1)},${(y + bh * .55).toFixed(1)} ${(x - bw).toFixed(1)},${(y + bh * 1.1).toFixed(1)} ${(x - bw).toFixed(1)},${y} Z"/>`;
        out += `<ellipse cx="${x}" cy="${(y + bh * .35).toFixed(1)}" rx="${(bw * .28).toFixed(1)}" ry="${(bh * .16).toFixed(1)}" fill="#6b4a2b" opacity=".7"/>`;
        if (p >= 0.2) out += `<path d="M${(x - bw * .7).toFixed(1)},${(y - bh * .5).toFixed(1)} q${(bw * .4).toFixed(1)},${(bh * .5).toFixed(1)} ${(bw * .9).toFixed(1)},${(bh * .2).toFixed(1)}" stroke="#7a5532" stroke-width="1.3" fill="none"/>`;
        return { out, topX, topY, stemLen, rootLen, trueLeaf };
    }

    function renderPlant(now = performance.now()) {
        const lit = conditions.light, ok = germinates();
        let out = '';
        let main = null;
        SEEDS.forEach((sd, i) => {
            const p = ok ? clamp01((progress - sd.lag) / (1 - sd.lag)) : 0;
            const m = plantMarkup(sd, p, lit);
            out += m.out;
            if (i === SEEDS.length - 1) main = m;
        });
        // 물을 준 흙에서 콩 쪽으로 스며드는 물방울 (처음 이틀)
        if (ok && growing && progress < 0.22 && !reduceMotion()) {
            SEEDS.forEach((sd, i) => {
                for (let k = 0; k < 3; k += 1) {
                    const ph = ((now / 700) + k / 3 + i * .17) % 1, ang = k * 2.1 + i;
                    const r = 30 * (1 - ph);
                    out += `<circle cx="${(sd.x + r * Math.cos(ang)).toFixed(1)}" cy="${(sd.y + r * Math.sin(ang) * .7).toFixed(1)}" r="2.4" fill="#7cc3ec" opacity="${(0.9 * (1 - ph * .6)).toFixed(2)}"/>`;
                }
            });
        }
        plantGroup.innerHTML = out;

        // Part names appear only once there is a part to point at.
        let labels = '';
        const p = ok ? progress : 0;
        if (p >= 0.8 && main) {
            const x = SEED.x, LX = x + 52;
            const topY = main.topY;
            labels += `<line class="part-line" x1="${x + 18}" y1="${topY.toFixed(1)}" x2="${LX - 4}" y2="${topY.toFixed(1)}"/>`;
            labels += `<text class="part-label" data-part="leaf" x="${LX}" y="${(topY + 5).toFixed(1)}">잎</text>`;
            const midY = SOIL_Y - 16;
            labels += `<line class="part-line" x1="${x + 4}" y1="${midY.toFixed(1)}" x2="${LX - 4}" y2="${midY.toFixed(1)}"/>`;
            labels += `<text class="part-label" x="${LX}" y="${(midY + 5).toFixed(1)}">줄기</text>`;
            const rootY = SEED.y + 10 + main.rootLen * .7;
            labels += `<line class="part-line root-line" x1="${x + 6}" y1="${rootY.toFixed(1)}" x2="${LX - 4}" y2="${rootY.toFixed(1)}"/>`;
            labels += `<text class="part-label" data-part="root" style="fill:#fff7e6" x="${LX}" y="${(rootY + 5).toFixed(1)}">뿌리</text>`;
        }
        labelGroup.innerHTML = labels;
    }

    // 화분 흙: 물을 주면 짙고 촉촉하게, 안 주면 옅고 갈라지게. 차가우면 서리와 파란 온도계
    function renderPot() {
        const wet = conditions.water, warm = conditions.warm;
        let out = '';
        out += `<path d="M76 ${SOIL_Y} L344 ${SOIL_Y} L334 296 L86 296 Z" fill="${wet ? 'url(#soilGrad)' : 'url(#drySoilGrad)'}"/>`;
        for (let i = 0; i < 70; i += 1) {
            const fx = Math.sin(i * 12.9898) * 43758.5453, fy = Math.sin(i * 78.233) * 12345.678;
            const u = fx - Math.floor(fx), v = fy - Math.floor(fy);
            const yy = SOIL_Y + 6 + v * 108, half = 132 - (yy - SOIL_Y) * 0.075;
            out += `<circle cx="${(210 + (u - 0.5) * 2 * half).toFixed(1)}" cy="${yy.toFixed(1)}" r="${(1 + (i % 3) * .7).toFixed(1)}" fill="${wet ? '#2e1f15' : '#a8865f'}" opacity=".55"/>`;
        }
        if (!wet) out += `<path d="M110 ${SOIL_Y + 1} l8 10 l-4 9 M222 ${SOIL_Y + 1} l-6 12 l7 8 M300 ${SOIL_Y + 1} l5 9 l-6 10" stroke="#7d5f40" stroke-width="1.6" fill="none"/>`;
        out += `<path d="M78 ${SOIL_Y} Q210 ${SOIL_Y - 5} 342 ${SOIL_Y}" stroke="${wet ? '#3b2a1d' : '#9d7f59'}" stroke-width="2" fill="none"/>`;
        if (!warm) out += `<g fill="#ffffff" opacity=".85">${[96, 140, 176, 230, 268, 318].map((x, i) => `<path d="M${x} ${SOIL_Y - 2} l3 -5 l3 5 l-3 5 z" transform="rotate(${i * 25} ${x + 3} ${SOIL_Y - 2})"/>`).join('')}</g>`;
        // 온도계 (화분 오른쪽에 꽂혀 있음)
        const lvl = warm ? 0.7 : 0.15, col = warm ? '#dc2626' : '#2563eb';
        out += `<rect x="362" y="172" width="10" height="104" rx="5" fill="#f8fafc" stroke="#64748b" stroke-width="1.4"/><rect x="365" y="${(272 - 90 * lvl).toFixed(1)}" width="4" height="${(90 * lvl + 4).toFixed(1)}" rx="2" fill="${col}"/><circle cx="367" cy="282" r="8" fill="${col}" stroke="#64748b" stroke-width="1.2"/>`;
        out += `<text class="stage-label" style="fill:${col}" x="372" y="162" text-anchor="middle">${warm ? '따뜻함' : '차가움'}</text>`;
        potGroup.innerHTML = out;
    }

    function renderEnvironment() {
        sunGroup.classList.toggle('dark', !conditions.light);
        airZone.classList.toggle('no-air', !conditions.air);
        conditionButtons.forEach(btn => {
            const key = btn.dataset.cond;
            const on = conditions[key];
            btn.classList.toggle('on', on);
            btn.classList.toggle('off', !on);
            btn.querySelector('.cond-state').textContent = on ? COND_LABELS[key].on : COND_LABELS[key].off;
        });
        dayBadge.textContent = dayText();
    }

    const dayText = () => `${Math.floor(progress * TOTAL_DAYS + 1e-9)}일째`;
    function render() { renderEnvironment(); renderPot(); renderPlant(); renderCompare(); renderData(); }

    /* ------------------------------- 조건을 하나씩 뺐을 때를 견주는 표 */
    /* 대조 실험의 결과를 한자리에 모아 놓은 것입니다. 물·온도·공기 가운데
       하나만 빠져도 싹이 트지 않지만, 빛은 빠져도 싹이 틉니다 — 그 한 줄이
       이 실험에서 가장 놀라운 대목이라 따로 표시합니다. */
    const CASES = [
        { key: null,    name: '모두 갖춤' },
        { key: 'water', name: '물만 빼면' },
        { key: 'warm',  name: '온도만 낮추면' },
    ];
    const wouldGerminate = key => {
        const c = { water: true, warm: true, air: true, light: true };
        if (key) c[key] = false;
        return c.water && c.warm && c.air;
    };
    // which row matches what is set right now
    function currentCase() {
        const off = ['water', 'warm'].filter(k => !conditions[k]);
        if (off.length === 0) return null;
        return off.length === 1 ? off[0] : 'other';
    }

    function renderCompare() {
        window.scienceScene.render(graphGroup, '');
        const keys = Object.keys(records);
        compareTable.hidden = keys.length === 0;
        if (!keys.length) return;
        const now = `${conditions.water ? 1 : 0}${conditions.warm ? 1 : 0}`;
        const NAMES = { '11': '물을 주고 따뜻하게', '01': '물을 주지 않고 따뜻하게', '10': '물을 주고 차갑게', '00': '물을 주지 않고 차갑게' };
        compareTable.innerHTML = `<table><thead><tr><th>조건</th><th>열흘 뒤</th></tr></thead><tbody>` +
            ['11', '01', '10', '00'].filter(k => records[k] !== undefined).map(k => `<tr class="${k === now ? 'now' : ''}"><td>${NAMES[k]}</td><td class="${records[k] ? 'yes' : 'no'}">${records[k] ? '싹이 텄습니다' : '싹이 트지 않았습니다'}</td></tr>`).join('') +
            `</tbody></table><p>한 번에 한 가지만 바꾸고 나머지는 똑같이 두어야 무엇 때문인지 알 수 있습니다.</p>`;
    }

    function renderData() {
        const need = ['water', 'warm'];
        const missing = need.filter(k => !conditions[k]).map(k => COND_LABELS[k].name);
        if (!finished) { window.scienceScene.render(dataNote, ''); return; }
        window.scienceScene.render(dataNote,['water', 'warm'].map(k =>
                `<div class="data-row"><span class="data-name">${COND_LABELS[k].name}</span>` +
                `<span class="data-val">${conditions[k] ? COND_LABELS[k].on : COND_LABELS[k].off}</span></div>`).join('') +
            `<div class="data-row"><span class="data-name">싹트는 데 필요한 것</span><span class="data-val">물 · 알맞은 온도 (나머지 조건은 같게 둠)</span></div>` +
            `<div class="data-row${germinates() ? ' match' : ''}"><span class="data-name">지금 모자란 것</span>` +
            `<span class="data-val">${missing.length ? missing.join(' · ') : '없음 — 물과 알맞은 온도를 갖추었습니다'}</span></div>` +
            `<div class="data-row"><span class="data-name">지난 날수</span><span class="data-val">${germinates() ? `${dayText()} · ${stageName(progress)}` : `${dayText()} · 변화 없음`}</span></div>`);
    }

    function frame(now) {
        const t = now / 1000;
        const dt = lastT === null ? 1 / 60 : Math.min(1 / 20, t - lastT);
        lastT = t;
        if (growing && progress < 1) {
            progress = Math.min(1, progress + dt / (germinates() ? GROW_SECONDS : GROW_SECONDS * 0.45));
        }
        if (growing && progress >= 1) finish();
        render();
        updateLiveResult();
        if (growing && progress < 1) { rafId = requestAnimationFrame(frame); }
        else { rafId = null; lastT = null; growing = false; growButton.textContent = '며칠 두고 관찰하기'; }
    }

    function updateLiveResult() {
        if (resultContent.hidden) return;
        if (!germinates()) { resultGerm.textContent = progress >= 1 ? '싹트지 않음' : '지켜보는 중'; resultStage.textContent = progress >= 1 ? '변화 없음' : dayText(); return; }
        resultGerm.textContent = progress > 0.38 ? '싹틈' : '지켜보는 중';
        resultStage.textContent = stageName(progress);
    }

    function startGrowing() {
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        finished = false;
        predictionResult.textContent = '';
        explanation.textContent = '';
        growing = true;
        growButton.textContent = '지켜보는 중…';
        stageCaption.textContent = '하루하루 지나는 동안 콩이 어떻게 되는지 지켜보세요.';
        if (reduceMotion()) { progress = 1; finish(); render(); updateLiveResult(); growing = false; growButton.textContent = '며칠 두고 관찰하기'; return; }
        if (rafId === null) { lastT = null; rafId = requestAnimationFrame(frame); }
    }

    function finish() {
        if (finished) return;
        finished = true;
        const ok = germinates();
        records[`${conditions.water ? 1 : 0}${conditions.warm ? 1 : 0}`] = ok;
        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : (prediction === 'yes') === ok ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        if (!ok) {
            const missing = missingConditions(), joined = joinAnd(missing), last = missing[missing.length - 1];
            stageCaption.textContent = `열흘이 지나도 ${joined}${subjectParticle(last)} 없어서 콩이 싹트지 않았습니다.`;
            explanation.textContent = `이 실험은 다른 조건을 같게 두고 물과 온도를 비교합니다. 지금은 ${joined}${subjectParticle(last)} 없습니다.`;
            return;
        }
        stageCaption.textContent = conditions.light
            ? '물과 알맞은 온도가 있어 콩이 싹텄습니다. 콩이 불고, 뿌리가 먼저 나온 뒤 떡잎과 잎이 올라왔습니다.'
            : '빛이 없어도 씨는 싹틉니다. 다만 잎이 초록색이 되지 못합니다.';
        explanation.textContent = conditions.light
            ? '물과 알맞은 온도가 갖추어진 조건에서 씨가 싹텄습니다. 뿌리와 싹, 잎이 나타나는 모습을 순서대로 관찰합니다.'
            : '빛은 싹트는 데 필요한 조건이 아니므로 씨는 싹텄습니다. 다만 빛을 못 받아 잎이 노랗고 줄기만 가늘고 길게 자랍니다.';
    }

    function resetAll() {
        growing = false;
        progress = 0;
        finished = false;
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastT = null; }
        growButton.textContent = '며칠 두고 관찰하기';
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        stageCaption.textContent = '조건을 정하고 관찰을 시작해 보세요.';
        render();
    }

    conditionButtons.forEach(button => button.addEventListener('click', () => {
        conditions[button.dataset.cond] = !conditions[button.dataset.cond];
        resetAll();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    growButton.addEventListener('click', () => { if (!growing) startGrowing(); });
    resetButton.addEventListener('click', resetAll);

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

    window.__seedModel = {
        germinates, missingConditions, stageName,
        setConditions(c) { conditions = { ...conditions, ...c }; resetAll(); },
        conditions: () => ({ ...conditions }),
        setProgress(p) { progress = clamp01(p); if (progress >= 1 && !resultContent.hidden) finish(); render(); updateLiveResult(); },
        progress: () => progress,
        SOIL_Y, SEED,
    };

    buildBeams();
    resetAll();
});
