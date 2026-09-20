document.addEventListener('DOMContentLoaded', () => {
    const modeButtons = [...document.querySelectorAll('[data-mode]')];
    const controlArea = document.getElementById('controlArea');
    const predictionArea = document.getElementById('predictionArea');
    const predictionLegend = document.getElementById('predictionLegend');
    const methodHint = document.getElementById('methodHint');
    const checkBtn = document.getElementById('checkBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const labelA = document.getElementById('labelA');
    const labelB = document.getElementById('labelB');
    const valueA = document.getElementById('valueA');
    const valueB = document.getElementById('valueB');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const stageBadge = document.getElementById('stageBadge');
    const mainGroup = document.getElementById('mainGroup');
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');

    /* -------------------------------------------------------------- data */
    const EARTH_AGE = 4600;                          // million years
    // Ages in millions of years, era, and what happened.
    const EVENTS = {
        earth: { label: '지구 탄생', age: 4600, era: '선캄브리아 시대', what: '뜨거운 돌덩이가 식어 굳음' },
        life: { label: '최초의 생명', age: 3500, era: '선캄브리아 시대', what: '바다의 세균 같은 단세포 생물' },
        oxygen: { label: '산소가 늘어남', age: 2400, era: '선캄브리아 시대', what: '광합성 세균이 공기에 산소를 쌓기 시작' },
        eukaryote: { label: '핵 있는 세포', age: 1800, era: '선캄브리아 시대', what: '핵과 미토콘드리아를 가진 큰 세포' },
        multi: { label: '다세포 생물', age: 600, era: '선캄브리아 시대 끝', what: '말랑한 몸의 여러 세포 동물' },
        cambrian: { label: '껍데기 동물 폭발', age: 541, era: '고생대 시작', what: '단단한 껍데기와 뼈를 가진 동물이 갑자기 늘어남' },
        plants: { label: '육상 식물', age: 470, era: '고생대', what: '식물이 물 밖 땅으로 올라옴' },
        amphibian: { label: '양서류', age: 370, era: '고생대', what: '네발 동물이 땅으로 올라옴' },
        dino: { label: '공룡 출현', age: 230, era: '중생대', what: '중생대의 주인이 되는 큰 파충류' },
        flower: { label: '꽃 피는 식물', age: 130, era: '중생대', what: '속씨식물이 나타나 퍼짐' },
        kpg: { label: '공룡 멸종', age: 66, era: '신생대 시작', what: '소행성 충돌 뒤 공룡이 사라지고 포유류의 시대' },
        human: { label: '사람 속 등장', age: 2.8, era: '신생대', what: '돌 도구를 쓰는 호모 속' },
        sapiens: { label: '호모 사피엔스', age: 0.3, era: '신생대', what: '지금의 사람' },
    };
    const dayOf = age => 365 * (1 - age / EARTH_AGE);          // day of the one-year calendar, 0 = Jan 1 0:00
    const MONTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const ERAS = [
        { name: '선캄브리아', from: 4600, to: 541, color: '#4a5a63' }, { name: '고생대', from: 541, to: 252, color: '#7fd48a' },
        { name: '중생대', from: 252, to: 66, color: '#ffb347' }, { name: '신생대', from: 66, to: 0, color: '#dc2626' },
    ];
    const PERIODS = [
        ['에디아카라', 600, 541, '#4a5a63'], ['캄브리아', 541, 485, '#7fd48a'], ['오르도비스', 485, 444, '#6cc47a'], ['실루리아', 444, 419, '#7fd48a'], ['데본', 419, 359, '#6cc47a'],
        ['석탄', 359, 299, '#7fd48a'], ['페름', 299, 252, '#6cc47a'], ['트라이아스', 252, 201, '#ffb347'], ['쥐라', 201, 145, '#f4a261'], ['백악', 145, 66, '#ffb347'],
        ['고제3기', 66, 23, '#dc2626'], ['신제3기', 23, 2.6, '#f28b7a'], ['제4기', 2.6, 0, '#dc2626'],
    ];

    // The five great extinctions and today: share of species lost.
    const EXTINCTIONS = {
        ord: { label: '오르도비스기 말', age: 445, loss: 85, cause: '빙하기가 와서 바다가 얼고 해수면이 크게 내려갔습니다', victims: '삼엽충·완족류의 많은 무리', recovery: '수백만 년' },
        dev: { label: '데본기 말', age: 372, loss: 75, cause: '바다의 산소가 모자라고 기후가 바뀌었습니다', victims: '갑옷을 두른 물고기와 산호초', recovery: '수백만 년' },
        perm: { label: '페름기 말', age: 252, loss: 96, cause: '시베리아에서 대규모 화산이 터져 기후가 더워지고 바다가 산성이 되었습니다', victims: '삼엽충 완전 멸종, 바다 생물 대부분', recovery: '약 1,000만 년 넘게' },
        tri: { label: '트라이아스기 말', age: 201, loss: 80, cause: '대규모 화산 활동으로 기후가 바뀌었습니다', victims: '많은 양서류·파충류, 조개류', recovery: '수백만 년' },
        cret: { label: '백악기 말', age: 66, loss: 76, cause: '소행성이 멕시코 칙술루브에 떨어져 어둠과 추위가 왔고 화산 활동도 겹쳤습니다', victims: '공룡(새 빼고)·익룡·암모나이트', recovery: '약 1,000만 년' },
    };
    // marine diversity through time, drawn as a shape from the fossil record (relative)
    const DIVERSITY_CURVE = [[541, 0.05], [520, 0.2], [500, 0.3], [470, 0.45], [446, 0.5], [444, 0.3], [430, 0.4], [400, 0.5], [373, 0.5], [371, 0.35], [340, 0.45], [300, 0.5], [260, 0.55], [253, 0.55], [251, 0.14], [240, 0.2], [220, 0.35], [202, 0.4], [200, 0.28], [180, 0.35], [150, 0.45], [100, 0.6], [67, 0.7], [65, 0.45], [50, 0.55], [20, 0.8], [0, 1.0]];

    // A hundred plants of up to five kinds; a blight takes the commonest kind.
    const FORESTS = {
        even: { label: '다섯 종 고루', hint: '20개체씩', counts: [20, 20, 20, 20, 20] },
        two: { label: '두 종 반씩', hint: '50 · 50', counts: [50, 50, 0, 0, 0] },
        dominant: { label: '한 종이 대부분', hint: '90 · 4 · 3 · 2 · 1', counts: [90, 4, 3, 2, 1] },
        mono: { label: '한 종만 (밭)', hint: '100', counts: [100, 0, 0, 0, 0] },
    };
    const SPECIES_COLOR = ['#7fd48a', '#ffb347', '#0284c7', '#7c3aed', '#dc2626'];
    const SPECIES_NAME = ['가', '나', '다', '라', '마'];

    const state = { mode: 'calendar', event: 'life', extinction: 'perm', forest: 'even', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const fmtN = n => Math.round(n).toLocaleString('ko-KR');
    const fmtAge = ma => ma >= 100 ? `${(ma / 100).toFixed(1).replace(/\.0$/, '')}억 년 전` : ma > 0 ? `${fmtN(ma * 100)}만 년 전` : '지금';
    const jong = w => { const c = w.charCodeAt(w.length - 1); return c >= 0xac00 && c <= 0xd7a3 ? (c - 0xac00) % 28 : -1; };
    const pEun = w => jong(w) > 0 ? '은' : '는', pIga = w => jong(w) > 0 ? '이' : '가';
    // 로/으로 after a number read aloud: 영·삼·육 take 으로, the rest 로
    const roOf = txt => '036'.includes(String(txt).trim().slice(-1)) ? '으로' : '로';
    function dateText(day, withTime = false) {
        if (day >= 365) return '12월 31일 밤 12시 (지금)';
        let d = Math.floor(day), m = 0;
        while (d >= MONTHS[m]) { d -= MONTHS[m]; m += 1; }
        const frac = day - Math.floor(day), hh = Math.floor(frac * 24), mm = Math.floor((frac * 24 - hh) * 60);
        return `${m + 1}월 ${d + 1}일${withTime ? ` ${hh}시 ${String(mm).padStart(2, '0')}분` : ''}`;
    }
    const eraOf = age => ERAS.find(e => age <= e.from && age > e.to) || ERAS[ERAS.length - 1];

    /* ------------------------------------------------------------ models */
    function analyse() {
        if (state.mode === 'calendar') {
            const ev = EVENTS[state.event], day = dayOf(ev.age);
            const verdict = day < 181 ? 'early' : day < 304 ? 'mid' : day < dayOf(66) ? 'late' : 'end';
            return { kind: 'calendar', ev, day, verdict };
        }
        if (state.mode === 'extinction') {
            const ex = EXTINCTIONS[state.extinction];
            return { kind: 'extinction', ex, verdict: ex.loss < 50 ? 'low' : ex.loss < 90 ? 'mid' : 'high' };
        }
        const f = FORESTS[state.forest];
        const target = f.counts.indexOf(Math.max(...f.counts));
        const remaining = 100 - f.counts[target];
        const simpson = arr => { const n = arr.reduce((s, v) => s + v, 0); return n ? 1 - arr.reduce((s, v) => s + (v / n) ** 2, 0) : 0; };
        const after = f.counts.map((v, i) => i === target ? 0 : v);
        return { kind: 'diversity', f, target, remaining, before: simpson(f.counts), afterIdx: simpson(after), after, verdict: remaining >= 80 ? 'most' : remaining >= 35 ? 'half' : 'gone' };
    }
    const runSeconds = () => 7;

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }

    function buildControls() {
        if (state.mode === 'calendar') {
            controlArea.innerHTML = pickRow('사건', 'event', Object.entries(EVENTS).map(([k, v]) => ({ value: k, label: v.label, hint: fmtAge(v.age) })), state.event, 3);
        } else if (state.mode === 'extinction') {
            controlArea.innerHTML = pickRow('멸종', 'extinction', Object.entries(EXTINCTIONS).map(([k, v]) => ({ value: k, label: v.label, hint: v.age ? fmtAge(v.age) : '' })), state.extinction, 3);
        } else {
            controlArea.innerHTML = pickRow('숲의 생물 구성 (모두 100개체)', 'forest', Object.entries(FORESTS).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint })), state.forest, 4);
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_CAL = [{ value: 'early', label: '1월 ~ 6월' }, { value: 'mid', label: '7월 ~ 10월' }, { value: 'late', label: '11월 ~ 12월 25일' }, { value: 'end', label: '12월 26일 ~ 31일' }];
    const PRED_EXT = [{ value: 'low', label: '절반 이하' }, { value: 'mid', label: '70 ~ 85 %' }, { value: 'high', label: '90 % 넘게' }];
    const PRED_DIV = [{ value: 'most', label: '80 % 남음' }, { value: 'half', label: '절반쯤 남음' }, { value: 'gone', label: '거의 사라짐 (20 % 이하)' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'calendar' ? PRED_CAL : state.mode === 'extinction' ? PRED_EXT : PRED_DIV;
        predictionLegend.textContent = state.mode === 'calendar' ? `46억 년을 1년으로 줄이면 '${EVENTS[state.event].label}'은 달력의 언제일까요?`
            : state.mode === 'extinction' ? `${EXTINCTIONS[state.extinction].label}에 생물 종의 몇 %가 사라졌을까요?`
                : `'${FORESTS[state.forest].label}' 숲에 가장 많은 종을 죽이는 병이 돌면 얼마나 남을까요?`;
        predictionArea.className = `prediction-buttons${list.length === 3 ? ' three' : ''}`;
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    function renderCalendar(a) {
        const { ev, day } = a;
        const p = state.progress;
        const now = p * day;
        const X0 = 20, X1 = 440, Y = 70, H = 30;
        const xOf = d => X0 + d / 365 * (X1 - X0);
        let out = '';
        ERAS.forEach(e => {
            const x1 = xOf(dayOf(e.from)), x2 = xOf(dayOf(e.to));
            out += `<rect class="era" fill="${e.color}" x="${x1.toFixed(1)}" y="${Y}" width="${(x2 - x1).toFixed(1)}" height="${H}"/>`;
            if (x2 - x1 > 60) out += `<text class="era-text" x="${((x1 + x2) / 2).toFixed(1)}" y="${Y + H / 2 + 3}" text-anchor="middle">${e.name} 시대 — 세균과 작은 생물만</text>`;
        });
        let acc = 0;
        MONTHS.forEach((len, m) => { const x = xOf(acc); out += `<line class="tick" x1="${x.toFixed(1)}" y1="${Y + H}" x2="${x.toFixed(1)}" y2="${Y + H + 5}"/><text class="axis-text" x="${(xOf(acc + len / 2)).toFixed(1)}" y="${Y + H + 16}" text-anchor="middle">${m + 1}월</text>`; acc += len; });
        out += `<line class="tick" x1="${X1}" y1="${Y + H}" x2="${X1}" y2="${Y + H + 5}"/>`;
        out += `<text class="small-label" x="${X0}" y="${Y - 24}">1월 1일 0시: 지구 탄생</text>`;
        out += `<text class="small-label" x="${X1}" y="${Y - 24}" text-anchor="end">12월 31일 밤 12시: 지금</text>`;
        out += `<text class="small-label" x="${X1}" y="${Y - 11}" text-anchor="end">초록 고생대(11/18~) · 노랑 중생대(12/12~) · 분홍 신생대(12/26~)</text>`;
        // the marker walks across the year to the event
        const mx = xOf(now);
        out += `<line class="marker" x1="${mx.toFixed(1)}" y1="${Y - 6}" x2="${mx.toFixed(1)}" y2="${Y + H + 6}"/>`;
        out += `<polygon class="marker-head" points="${mx.toFixed(1)},${Y - 6} ${(mx - 5).toFixed(1)},${Y - 13} ${(mx + 5).toFixed(1)},${Y - 13}"/>`;
        const passedMa = EARTH_AGE * now / 365;
        out += `<text class="gen-text" x="20" y="136">${dateText(now, p >= 1 && day > 363)} — 지구 나이 ${fmtAge(EARTH_AGE - passedMa).replace(' 전', '')}${p >= 1 ? '' : ' (넘어가는 중)'}</text>`;
        out += `<text class="trait-text" x="20" y="154">달력의 하루 = 1,260만 년 · 한 시간 = 52.5만 년 · 1분 = 8,750년</text>`;
        if (p >= 1) {
            out += `<text class="trait-text" style="fill:#d97706" x="20" y="174">${ev.label} (${fmtAge(ev.age)}) — ${ev.what}</text>`;
            out += `<text class="trait-text" x="20" y="190">${ev.era} · 남은 날: ${(365 - day) < 1 ? `${((365 - day) * 24).toFixed(1)}시간` : `${Math.round(365 - day)}일`}</text>`;
        } else {
            out += `<text class="trait-text" x="20" y="174">${eraOf(EARTH_AGE - passedMa).name} 시대를 지나는 중</text>`;
        }
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${ev.label}: ${dateText(day, day > 363)}` : `${ev.label} (${fmtAge(ev.age)})은 달력의 언제?`}</text>`;
        out += `<text class="note-text" x="20" y="208">1년 = 46억 년, 1월 1일 0시에 지구가 태어나고 12월 31일 밤 12시가 지금</text>`;
        return out;
    }

    // the last 600 million years stretched out
    function graphCalendar(a) {
        const X0 = 40, X1 = 440, Y = 56, H = 22, PY = 84, PH = 20;
        const xOf = age => X0 + (600 - age) / 600 * (X1 - X0);
        let out = `<text class="axis-title" x="${X0}" y="18">마지막 6억 년만 늘려 보기 — 달력으로는 11월 13일부터 12월 31일까지</text>`;
        [[600, '선캄브리아 끝', '#4a5a63'], [541, '고생대', '#7fd48a'], [252, '중생대', '#ffb347'], [66, '신생대', '#dc2626']].forEach(([from, name, color], i, arr) => {
            const to = arr[i + 1] ? arr[i + 1][0] : 0;
            const x1 = xOf(from), x2 = xOf(to);
            out += `<rect class="era" fill="${color}" x="${x1.toFixed(1)}" y="${Y}" width="${(x2 - x1).toFixed(1)}" height="${H}"/>`;
            if (x2 - x1 > 36) out += `<text class="era-text" x="${((x1 + x2) / 2).toFixed(1)}" y="${Y + H / 2 + 3}" text-anchor="middle">${name}</text>`;
        });
        PERIODS.forEach(([name, from, to, color]) => {
            const x1 = xOf(from), x2 = xOf(to);
            out += `<rect class="era" fill="${color}" opacity=".7" x="${x1.toFixed(1)}" y="${PY}" width="${(x2 - x1).toFixed(1)}" height="${PH}"/>`;
            if (x2 - x1 >= name.length * 8) out += `<text class="era-text" x="${((x1 + x2) / 2).toFixed(1)}" y="${PY + PH / 2 + 3}" text-anchor="middle">${name}</text>`;
        });
        for (let age = 600; age >= 0; age -= 100) { out += `<line class="tick" x1="${xOf(age).toFixed(1)}" y1="${PY + PH}" x2="${xOf(age).toFixed(1)}" y2="${PY + PH + 5}"/><text class="axis-text" x="${xOf(age).toFixed(1)}" y="${PY + PH + 17}" text-anchor="middle">${age ? `${age / 100}억 년 전` : '지금'}</text>`; }
        const { ev } = a;
        if (ev.age <= 600) {
            const x = xOf(ev.age);
            out += `<line class="marker" x1="${x.toFixed(1)}" y1="${Y - 8}" x2="${x.toFixed(1)}" y2="${PY + PH + 4}"/>`;
            out += `<text class="axis-text" style="fill:#d97706" x="${clamp(x, X0 + 40, X1 - 40).toFixed(1)}" y="${Y - 12}" text-anchor="middle">${ev.label} ${fmtAge(ev.age)}</text>`;
        } else {
            out += `<text class="axis-text" style="fill:#d97706" x="${X0}" y="${Y - 12}">${ev.label}(${fmtAge(ev.age)})은 이 눈금보다 훨씬 앞 — 선캄브리아 시대</text>`;
        }
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${PY + PH + 40}" text-anchor="middle">위 줄은 시대, 아래 줄은 기 — 경계는 대개 많은 생물이 사라진 자리</text>`;
        out += `<text class="small-label" x="${((X0 + X1) / 2).toFixed(1)}" y="${PY + PH + 56}" text-anchor="middle">에디아카라 · 캄브리아 · 오르도비스 · 실루리아 · 데본 · 석탄 · 페름 · 트라이아스 · 쥐라 · 백악 · 고제3기 · 신제3기 · 제4기</text>`;
        return out;
    }

    // a hundred species in a grid; the extinction takes its share
    function renderExtinction(a) {
        const { ex } = a;
        const p = state.progress;
        const dying = clamp(p / 0.55, 0, 1), recovering = clamp((p - 0.6) / 0.4, 0, 1);
        const lost = Math.round(ex.loss * dying);
        const back = ex.age > 0 ? Math.round(ex.loss * 0.4 * recovering) : 0;   // partial recovery, new kinds
        const GX = 24, GY = 44, S = 14;
        let out = '';
        // the order the species vanish in is scrambled so it does not sweep like a curtain
        const order = Array.from({ length: 100 }, (_, i) => (i * 37) % 100);
        const goneSet = new Set(order.slice(0, lost));
        const backSet = new Set(order.slice(0, back));
        for (let i = 0; i < 100; i += 1) {
            const cx = GX + (i % 10) * S + S / 2, cy = GY + Math.floor(i / 10) * S + S / 2;
            const gone = goneSet.has(i), reborn = gone && backSet.has(i);
            const threatened = ex.age === 0 && p >= 0.6 && !gone && (i * 7) % 100 < ex.threatened;
            out += `<circle class="dot ${gone && !reborn ? 'gone' : ''} ${reborn ? 'new' : ''}" fill="${reborn ? '#059669' : SPECIES_COLOR[i % 5]}" ${threatened ? 'stroke="#ff7a59" stroke-width="2"' : ''} cx="${cx}" cy="${cy}" r="5"/>`;
        }
        out += `<text class="small-label" x="${GX}" y="${GY + 10 * S + 12}">종 100가지 · 흐린 점은 사라진 종${back ? ' · 초록은 새로 생긴 종' : ''}</text>`;
        // facts
        const IX = 232;
        const wrap = (txt, n) => txt.match(new RegExp(`.{1,${n}}`, 'g')) || [txt];
        out += `<text class="trait-text" x="${IX}" y="46">${ex.age ? fmtAge(ex.age) : '1500년 이후 ~ 지금'}</text>`;
        let y = 62;
        out += `<text class="small-label" x="${IX}" y="${y}">원인</text>`; y += 13;
        wrap(ex.cause, 20).forEach(ln => { out += `<text class="trait-text" x="${IX}" y="${y}">${ln}</text>`; y += 13; });
        y += 5;
        out += `<text class="small-label" x="${IX}" y="${y}">사라진 것</text>`; y += 13;
        wrap(ex.victims, 20).forEach(ln => { out += `<text class="trait-text" x="${IX}" y="${y}">${ln}</text>`; y += 13; });
        y += 5;
        if (p >= 0.55) {
            out += `<text class="trait-text" style="fill:#d97706" x="${IX}" y="${y}">사라진 종 ${ex.loss} %${ex.age === 0 ? ' (지금까지)' : ''}</text>`; y += 14;
            if (ex.age) out += `<text class="trait-text" x="${IX}" y="${y}">회복에 ${ex.recovery}</text>`;
            else { out += `<text class="trait-text" style="fill:#ff7a59" x="${IX}" y="${y}">붉은 테두리: 멸종 위기 ${ex.threatened} %</text>`; y += 13; out += `<text class="trait-text" x="${IX}" y="${y}">속도는 ${ex.rate}</text>`; }
        } else if (p > 0) {
            out += `<text class="trait-text" style="fill:#d97706" x="${IX}" y="${y}">사라지는 중 … ${lost} %</text>`;
        }
        const VERD = { low: '절반 이하', mid: '70~85 %', high: '90 % 넘게' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${ex.label}: 종의 ${ex.loss} %가 사라짐 (${VERD[a.verdict]})` : `${ex.label} — 종의 몇 %가 사라졌을까`}</text>`;
        out += `<text class="note-text" x="20" y="208">${ex.age ? '멸종 뒤 빈자리로 살아남은 무리가 퍼져 나가 새 종이 생기지만 수백만 년이 걸립니다' : '기록된 멸종은 아직 1 %쯤이지만 속도가 자연의 100배 넘고 28 %가 위기입니다'}</text>`;
        return out;
    }

    function graphExtinction(a) {
        const X0 = 50, X1 = 430, Y0 = 150, Y1 = 40;
        const xOf = age => X0 + (541 - age) / 541 * (X1 - X0), yOf = v => Y0 - v * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">바다 생물 종류의 변화 — 화석 기록을 단순하게 그린 모양</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        out += `<text class="axis-text" x="${X0 - 6}" y="${Y1 + 4}" text-anchor="end">많음</text><text class="axis-text" x="${X0 - 6}" y="${Y0 + 4}" text-anchor="end">적음</text>`;
        for (let age = 500; age >= 0; age -= 100) out += `<text class="axis-text" x="${xOf(age).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${age ? `${age / 100}억` : '지금'}</text>`;
        out += `<path class="trace" style="stroke:#0284c7" d="${DIVERSITY_CURVE.map(([age, v], i) => `${i ? 'L' : 'M'}${xOf(age).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ')}"/>`;
        Object.entries(EXTINCTIONS).forEach(([k, ex]) => {
            if (!ex.age) return;
            const x = xOf(ex.age), mine = k === state.extinction;
            out += `<line class="drop-line" style="${mine ? 'stroke:#d97706;stroke-width:2.2;stroke-dasharray:none' : ''}" x1="${x.toFixed(1)}" y1="${Y1}" x2="${x.toFixed(1)}" y2="${Y0}"/>`;
            out += `<text class="axis-text" style="fill:${mine ? '#d97706' : '#dc2626'}" x="${(x + (ex.age > 400 ? 4 : -4)).toFixed(1)}" y="${Y1 + 12 + (k === 'dev' ? 12 : 0)}" text-anchor="${ex.age > 400 ? 'start' : 'end'}">${ex.loss} %</text>`;
        });
        if (state.extinction === 'now') out += `<text class="axis-text" style="fill:#d97706" x="${X1}" y="${Y1 + 28}" text-anchor="end">지금 1 %, 위기 28 %</text>`;
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 30}" text-anchor="middle">몇 년 전 — 붉은 점선이 다섯 번의 대멸종, 숫자는 사라진 종의 비율</text>`;
        return out;
    }

    // a hundred plants; the blight takes the commonest kind, cell by cell
    function renderDiversity(a) {
        const { f, target } = a;
        const p = state.progress;
        const GX = 24, GY = 44, S = 14;
        // lay the kinds out mixed, the same way every time
        const cells = [];
        f.counts.forEach((n, sp) => { for (let k = 0; k < n; k += 1) cells.push(sp); });
        let seed = 12345;
        const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
        for (let i = cells.length - 1; i > 0; i -= 1) { const j = Math.floor(rnd() * (i + 1)); [cells[i], cells[j]] = [cells[j], cells[i]]; }
        const killFrac = clamp(p / 0.8, 0, 1);
        let seen = 0, dead = 0;
        const total = f.counts[target];
        let out = '';
        cells.forEach((sp, i) => {
            const x = GX + (i % 10) * S, y = GY + Math.floor(i / 10) * S;
            let isDead = false;
            if (sp === target) { seen += 1; if (seen <= Math.round(total * killFrac)) { isDead = true; dead += 1; } }
            out += `<rect class="plot ${isDead ? 'dead' : ''}" fill="${SPECIES_COLOR[sp]}" x="${x + 1}" y="${y + 1}" width="${S - 2}" height="${S - 2}" rx="3"/>`;
        });
        out += `<text class="small-label" x="${GX + 5 * S}" y="${GY + 10 * S + 12}" text-anchor="middle">100개체 · 색이 종 · 흐린 칸은 죽음</text>`;
        const IX = 232;
        out += `<text class="trait-text" x="${IX}" y="46">종 수 ${f.counts.filter(v => v).length}가지</text>`;
        out += `<text class="trait-text" x="${IX}" y="62">${f.counts.map((v, i) => v ? `${SPECIES_NAME[i]} ${v}` : '').filter(Boolean).join(' · ')}</text>`;
        out += `<text class="trait-text" x="${IX}" y="84">다양성 지수 ${a.before.toFixed(2)}</text>`;
        out += `<text class="small-label" x="${IX}" y="97">(두 개체를 뽑았을 때 다른 종일 확률)</text>`;
        if (p > 0) {
            out += `<text class="trait-text" style="fill:#ff7a59" x="${IX}" y="120">병이 '${SPECIES_NAME[target]}' 종을 덮침 — ${dead}개체 죽음</text>`;
            out += `<text class="trait-text" style="fill:#d97706" x="${IX}" y="136">남은 개체 ${100 - dead}개체</text>`;
            if (p >= 0.8) { out += `<text class="trait-text" x="${IX}" y="152">남은 종 ${a.after.filter(v => v).length}가지 · 지수 ${a.afterIdx.toFixed(2)}</text>`; }
        } else {
            out += `<text class="trait-text" x="${IX}" y="120">가장 많은 종 '${SPECIES_NAME[target]}'을 덮치는 병이 돌면?</text>`;
        }
        const VERD = { most: '80 % 남음', half: '절반쯤 남음', gone: '거의 사라짐' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${f.label}: ${a.remaining}개체 남음 → ${VERD[a.verdict]}` : `${f.label} 숲 (${f.hint})`}</text>`;
        out += `<text class="note-text" x="20" y="208">종이 여러 가지면 한 종을 덮치는 병이 와도 숲이 이어집니다 — 1845년 아일랜드 감자 흉년, 한 품종만 심었던 탓</text>`;
        return out;
    }

    function graphDiversity(a) {
        const { f } = a;
        const X0 = 60, X1 = 430, Y0 = 150, Y1 = 40;
        const yOf = n => Y0 - n / 100 * (Y0 - Y1);
        const p = state.progress, killFrac = clamp(p / 0.8, 0, 1);
        let out = `<text class="axis-title" x="${X0}" y="18">종마다 몇 개체 — 옅은 막대 처음, 진한 막대 병이 돈 뒤</text>`;
        [0, 25, 50, 75, 100].forEach(n => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(n).toFixed(1)}" x2="${X1}" y2="${yOf(n).toFixed(1)}"/><text class="axis-text" x="${X0 - 6}" y="${(yOf(n) + 3.5).toFixed(1)}" text-anchor="end">${n}</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/>`;
        const step = (X1 - X0) / 5, W = 40;
        f.counts.forEach((n, i) => {
            const x = X0 + i * step + (step - W) / 2;
            const after = i === a.target ? Math.round(n * (1 - killFrac)) : n;
            out += `<rect class="bar" fill="${SPECIES_COLOR[i]}" opacity=".3" x="${x.toFixed(1)}" y="${yOf(n).toFixed(1)}" width="${W}" height="${(Y0 - yOf(n)).toFixed(1)}" rx="2"/>`;
            out += `<rect class="bar" fill="${SPECIES_COLOR[i]}" x="${x.toFixed(1)}" y="${yOf(after).toFixed(1)}" width="${W}" height="${(Y0 - yOf(after)).toFixed(1)}" rx="2"/>`;
            out += `<text class="axis-text" x="${(x + W / 2).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${SPECIES_NAME[i]} 종</text>`;
            if (n) out += `<text class="axis-text" style="fill:#0f172a" x="${(x + W / 2).toFixed(1)}" y="${(yOf(n) - 4).toFixed(1)}" text-anchor="middle">${p >= 0.8 && i === a.target ? `${n} → ${after}` : n}</text>`;
        });
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 32}" text-anchor="middle">다양성 지수 ${a.before.toFixed(2)}${p >= 0.8 ? ` → ${a.afterIdx.toFixed(2)}` : ''} — 고를수록, 종이 많을수록 1에 가까움</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'calendar') {
            const { ev, day } = a;
            return `<div class="data-row"><span class="data-name">사건</span><span class="data-val">${ev.label} — ${ev.what} (${ev.era})</span></div>` +
                `<div class="data-row"><span class="data-name">실제 시간</span><span class="data-val">${fmtAge(ev.age)} · 지구 나이 ${fmtAge(EARTH_AGE - ev.age).replace(' 전', '')}</span></div>` +
                `<div class="data-row"><span class="data-name">달력으로</span><span class="data-val">365일 × (1 − ${ev.age}/${EARTH_AGE}) = ${day.toFixed(2)}일째 → ${dateText(day, day > 363)}</span></div>` +
                `<div class="data-row match"><span class="data-name">시대 경계</span><span class="data-val">고생대 11월 18일 · 중생대 12월 12일 · 신생대 12월 26일 · 사람 속 12월 31일 18시 40분</span></div>`;
        }
        if (a.kind === 'extinction') {
            const { ex } = a;
            return `<div class="data-row"><span class="data-name">때</span><span class="data-val">${ex.label} · ${ex.age ? fmtAge(ex.age) : '1500년 이후'}</span></div>` +
                `<div class="data-row"><span class="data-name">원인</span><span class="data-val">${ex.cause}</span></div>` +
                `<div class="data-row"><span class="data-name">사라진 것</span><span class="data-val">${ex.victims}</span></div>` +
                `<div class="data-row match"><span class="data-name">비율</span><span class="data-val">종의 약 ${ex.loss} %${ex.age ? ` · 회복에 ${ex.recovery}` : ` · 멸종 위기 ${ex.threatened} % · 속도 ${ex.rate}`}</span></div>`;
        }
        const { f } = a;
        return `<div class="data-row"><span class="data-name">숲</span><span class="data-val">${f.label} — ${f.counts.map((v, i) => v ? `${SPECIES_NAME[i]} ${v}개체` : '').filter(Boolean).join(', ')}</span></div>` +
            `<div class="data-row"><span class="data-name">다양성 지수</span><span class="data-val">1 − (각 종 비율)²의 합 = ${a.before.toFixed(2)} (두 개체를 뽑아 다른 종일 확률)</span></div>` +
            `<div class="data-row"><span class="data-name">병</span><span class="data-val">가장 많은 '${SPECIES_NAME[a.target]}' 종 ${f.counts[a.target]}개체를 모두 죽임</span></div>` +
            `<div class="data-row match"><span class="data-name">남은 것</span><span class="data-val">${a.remaining}개체 · ${a.after.filter(v => v).length}종 · 지수 ${a.afterIdx.toFixed(2)}</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'calendar' ? renderCalendar(a) : a.kind === 'extinction' ? renderExtinction(a) : renderDiversity(a);
        graphGroup.innerHTML = a.kind === 'calendar' ? graphCalendar(a) : a.kind === 'extinction' ? graphExtinction(a) : graphDiversity(a);
        stageBadge.textContent = a.kind === 'calendar' ? `${a.ev.label} · ${fmtAge(a.ev.age)}` : a.kind === 'extinction' ? a.ex.label : `${a.f.label} · ${a.f.hint}`;
        methodHint.textContent = a.kind === 'calendar' ? '지구 46억 년을 1년으로 줄이면 하루는 1,260만 년입니다'
            : a.kind === 'extinction' ? '지질 시대의 경계는 대개 많은 생물이 한꺼번에 사라진 자리입니다'
                : '종이 여러 가지로 고루 있을수록 한 가지 재난에 무너지지 않습니다';
        dataNote.innerHTML = noteFor(a);
        return a;
    }

    /* --------------------------------------------------------------- run */
    function tick(dt) {
        state.progress = Math.min(1, state.progress + dt / runSeconds());
        render();
        return state.progress >= 1;
    }

    function stopRun() { running = false; if (frameId) cancelAnimationFrame(frameId); frameId = 0; }

    function frame(stamp) {
        if (!running) return;
        const dt = Math.min(0.05, (stamp - lastStamp) / 1000 || 0);
        lastStamp = stamp;
        if (tick(dt)) { stopRun(); finish(); } else frameId = requestAnimationFrame(frame);
    }

    function startRun() {
        stopRun();
        state.progress = 0;
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function finish() {
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        let s = '';
        if (a.kind === 'calendar') {
            const { ev, day } = a;
            labelA.textContent = '실제'; valueA.textContent = fmtAge(ev.age);
            labelB.textContent = '1년 달력으로'; valueB.textContent = dateText(day, day > 363);
            s = `${ev.label}${pEun(ev.label)} ${fmtAge(ev.age)}의 일입니다. 46억 년을 1년으로 줄이면 하루가 1,260만 년, 한 시간이 52.5만 년이므로 이 일은 ${dateText(day, day > 363)}에 놓입니다. `;
            if (a.verdict === 'early' || a.verdict === 'mid') s += `달력의 앞 열 달 반, 곧 지구 역사의 대부분인 선캄브리아 시대에는 오랫동안 미생물이 주를 이루었지만 후기에 다세포 생물도 나타났습니다. 산소가 늘고 핵 있는 세포가 생기는 데만 수십억 년이 걸렸습니다. `;
            else if (a.verdict === 'late') s += `껍데기와 뼈를 가진 동물이 갑자기 늘어난 고생대의 시작이 11월 18일, 공룡의 중생대 시작이 12월 12일입니다. 우리가 아는 큰 생물들의 역사는 달력의 마지막 한 달 반에 몰려 있습니다. `;
            else s += `공룡이 사라진 신생대의 시작이 12월 26일이고, 사람 속은 12월 31일 저녁 6시 40분, 호모 사피엔스는 밤 11시 26분에야 나타납니다. 사람의 역사는 지구 역사의 마지막 한 시간도 되지 않습니다. `;
            s += `${ev.what}. 지질 시대는 이렇게 화석에 남은 생물의 큰 변화를 기준으로 나눕니다.`;
        } else if (a.kind === 'extinction') {
            const { ex } = a;
            labelA.textContent = '사라진 종'; valueA.textContent = `약 ${ex.loss} %`;
            labelB.textContent = ex.age ? '회복' : '멸종 위기'; valueB.textContent = ex.age ? ex.recovery : `${ex.threatened} %`;
            if (ex.age) {
                s = `${fmtAge(ex.age)} ${ex.label}: ${ex.cause}. 이 때문에 ${ex.victims}${pIga(ex.victims)} 사라져 생물 종의 약 ${ex.loss} %가 없어졌습니다. `;
                if (state.extinction === 'perm') s += `다섯 번 가운데 가장 큰 멸종으로, 바다 생물은 열에 아홉 넘게 사라지고 삼엽충은 완전히 없어졌습니다. `;
                else if (state.extinction === 'cret') s += `지름 10 km쯤의 소행성이 떨어져 먼지가 하늘을 덮고 몇 해 동안 어두워지고 추워졌습니다. 공룡은 사라졌지만 새와 작은 포유류가 살아남아 신생대의 주인이 되었습니다. `;
                s += `멸종 뒤에는 살아남은 무리가 빈자리로 퍼져 나가며 새 종이 생겼지만, 회복에 ${ex.recovery}이 걸렸습니다. 지질 시대의 경계는 대개 이런 자리입니다.`;
            } else {
                s = `1500년 이후 기록된 멸종은 약 900종으로 전체의 1 %쯤입니다. 그러나 사라지는 속도가 화석 기록의 자연스러운 속도보다 100~1,000배 빠르고, 평가된 종의 약 ${ex.threatened} %가 멸종 위기에 있습니다. ${ex.cause}. 이 속도가 이어지면 여섯 번째 대멸종 규모가 될 수 있어, 서식지 보호와 기후 변화 대응 같은 보전 노력이 필요합니다.`;
            }
        } else {
            const { f } = a;
            labelA.textContent = '남은 개체'; valueA.textContent = `${a.remaining}개체 (${a.after.filter(v => v).length}종)`;
            labelB.textContent = '다양성 지수'; valueB.textContent = `${a.before.toFixed(2)} → ${a.afterIdx.toFixed(2)}`;
            s = `${f.label} 숲(${f.hint})에 가장 많은 '${SPECIES_NAME[a.target]}' 종을 죽이는 병이 돌자 ${f.counts[a.target]}개체가 죽고 ${a.remaining}개체가 남았습니다. `;
            if (a.verdict === 'most') s += `종이 다섯 가지로 고루 있어 한 종을 잃어도 나머지 네 종이 숲을 이어 갑니다. `;
            else if (a.verdict === 'half') s += `종이 둘뿐이라 한 종을 잃으면 절반이 사라집니다. `;
            else s += `한 종이 거의 전부인 곳은 그 종을 덮치는 병 한 번에 무너집니다. 1845년 아일랜드는 한 품종의 감자만 심다가 감자 병으로 흉년이 들어 100만 명이 굶어 죽었습니다. `;
            s += `다양성 지수(두 개체를 뽑았을 때 서로 다른 종일 확률)는 ${a.before.toFixed(2) === a.afterIdx.toFixed(2) ? `${a.before.toFixed(2)} 그대로입니다` : `${a.before.toFixed(2)}에서 ${a.afterIdx.toFixed(2)}${roOf(a.afterIdx.toFixed(2))} 바뀌었습니다`}. ${a.afterIdx > a.before ? '남은 열 개체 사이는 고르게 되어 지수는 올랐지만 개체의 90 %를 잃었습니다 — 지수는 고른 정도를 재고 마릿수는 재지 않습니다. ' : ''}종이 많고 고를수록 1에 가깝고, 그런 생태계가 병·가뭄·기후 변화 같은 재난을 잘 견딥니다. 생물 다양성은 종의 수만이 아니라 고른 정도, 종 안의 유전자 다양성, 생태계의 다양성을 함께 말합니다.`;
        }
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        explanation.textContent = s;
    }

    function settingsChanged() {
        stopRun();
        state.progress = 0;
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    modeButtons.forEach(button => button.addEventListener('click', () => {
        state.mode = button.dataset.mode;
        state.prediction = null;
        modeButtons.forEach(item => item.classList.toggle('selected', item === button));
        buildControls();
        buildPrediction();
        checkBtn.textContent = state.mode === 'calendar' ? '달력 넘기기' : state.mode === 'extinction' ? '멸종 일어나기' : '병 돌게 하기';
        stageCaption.textContent = state.mode === 'calendar' ? '1월 1일 0시에 지구가 태어나고 12월 31일 밤 12시가 지금입니다. 노란 표시가 달력을 넘어갑니다.'
            : state.mode === 'extinction' ? '점 하나가 생물 종 하나입니다. 멸종이 일어나면 흐려지고, 뒤에 새로 생긴 종은 초록으로 나타납니다.'
                : '칸 하나가 한 개체, 색이 종입니다. 가장 많은 종을 덮치는 병이 돌면 그 칸들이 흐려집니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { event: 'life', extinction: 'perm', forest: 'even', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'calendar').click();
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

    window.__geoTimeModel = {
        EVENTS, EXTINCTIONS, FORESTS, ERAS, PERIODS, state,
        analyse, render, dayOf, dateText, fmtAge,
        runSeconds,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        set(key, value) { state[key] = value; buildControls(); buildPrediction(); settingsChanged(); },
        setProgress(p) { stopRun(); state.progress = p; render(); },
        runToEnd(dt = 0.25, cap = 5000) {
            stopRun(); state.progress = 0;
            let steps = 0;
            while (!tick(dt) && steps < cap) steps += 1;
            finish();
            return { steps, progress: state.progress };
        },
        tick, finish,
    };

    resetBtn.click();
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
