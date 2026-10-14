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
    const COLOR={H:'#dc2626',He:'#d97706',C:'#9fb6d9',O:'#0284c7',Mg:'#7c3aed',Si:'#c9a35f',Fe:'#e08a5c'};
    const STEPS={
      h:{label:'수소 → 헬륨',fuel:{sym:'H',A:1,n:4,name:'수소'},ash:{sym:'He',A:4,name:'헬륨'}},
      he:{label:'헬륨 → 탄소',fuel:{sym:'He',A:4,n:3,name:'헬륨'},ash:{sym:'C',A:12,name:'탄소'}},
      c:{label:'산소·네온·마그네슘 등의 생성',ash:{sym:'O',A:16,name:'산소'}},
      o:{label:'규소·황 등의 생성',ash:{sym:'Si',A:28,name:'규소'}},
      si:{label:'철족 원소의 생성',ash:{sym:'Fe',A:56,name:'철'}}
    };
    const STARS={
      '1':{label:'태양과 비슷한 질량',hint:'헬륨 핵융합까지 비교',stages:['h','he'],end:'co',endText:'바깥층을 내보내고 탄소·산소가 주성분인 백색왜성을 남깁니다.'},
      '25':{label:'태양보다 훨씬 큰 질량',hint:'연속적인 핵반응 비교',stages:['h','he','c','o','si'],end:'sn',endText:'중심부가 붕괴하여 초신성 폭발로 이어질 수 있으며, 중성자별이나 블랙홀을 남길 수 있습니다.'}
    };
    const ORIGINS={h:{sym:'H',name:'수소',origin:'bigbang'},c:{sym:'C',name:'탄소',origin:'star'},fe:{sym:'Fe',name:'철',origin:'star'},au:{sym:'Au',name:'금',origin:'merger'}};
    const state = {
        mode: 'fusion',
        step: 'h', star: '1', element: 'c',
        progress: 0, prediction: null,
    };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    /* ------------------------------------------------------------ models */
    function analyse() {
        if (state.mode === 'fusion') {
            const st = STEPS[['h','he'].includes(state.step)?state.step:'h'];
            return {kind:'fusion',st,verdict:'yes'};
        }
        if (state.mode === 'mass') {
            const star = STARS[state.star];
            return {kind:'mass',star,verdict:star.end};
        }
        const el = ORIGINS[state.element];
        return { kind: 'origin', el, verdict: el.origin };
    }
    const runSeconds = () => state.mode === 'fusion' ? 6 : state.mode === 'mass' ? 8 : 6;

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }

    function buildControls() {
        if (state.mode === 'fusion') {
            controlArea.innerHTML = pickRow('합쳐지는 원자핵', 'step', Object.entries(STEPS).filter(([k])=>['h','he'].includes(k)).map(([k,v])=>({value:k,label:v.label})), state.step, 3);
        } else if (state.mode === 'mass') {
            controlArea.innerHTML = pickRow('별의 질량', 'star', Object.entries(STARS).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint })), state.star, 4);
        } else {
            controlArea.innerHTML = pickRow('원소', 'element', Object.entries(ORIGINS).map(([k, v]) => ({ value: k, label: `${v.name} ${v.sym}` })), state.element, 3);
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

    const PRED_MASS = [{value:'co',label:'탄소·산소 중심, 백색왜성'},{value:'sn',label:'철 중심, 중심부 붕괴 가능'}];
    const PRED_ORIGIN = [{ value: 'bigbang', label: '빅뱅 직후 몇 분 동안' }, { value: 'star', label: '별의 핵반응·진화 과정' }, { value: 'merger', label: '초신성이나 중성자별 충돌에서' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list=state.mode==='fusion'?[{value:'yes',label:'에너지 방출'},{value:'no',label:'에너지가 전혀 나오지 않음'}]:state.mode==='mass'?PRED_MASS:PRED_ORIGIN;
        predictionLegend.textContent=state.mode==='fusion'?'이 핵융합 과정에서는?':state.mode==='mass'?'이 별에서 생성되는 원소를 예상하세요.':'이 원소의 주요 생성 과정을 고르세요.';
        predictionArea.innerHTML=list.map(o=>'<button type="button" data-prediction="'+o.value+'">'+o.label+'</button>').join('');
        predictionArea.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.prediction=b.dataset.prediction; window.scienceInvalidatePrediction?.();predictionArea.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));}));
    }

    /* ----------------------------------------------------------- visuals */
    const nucR = A => 5 + 2.3 * Math.cbrt(A);
    function nucleus(cx, cy, sym, A, opacity = 1, labelOpacity = opacity) {
        const r = nucR(A);
        let out = `<circle class="nucleus" fill="${COLOR[sym] || '#475569'}" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" opacity="${opacity}"/>`;
        // a few of the protons and neutrons, drawn inside
        const dots = Math.min(7, A);
        for (let k = 0; k < dots; k += 1) {
            const ang = k * 2.4, rr = A === 1 ? 0 : (r - 3) * (0.35 + 0.5 * ((k * 7) % 3) / 2);
            out += `<circle class="${k % 2 ? 'neutron' : 'proton'}" cx="${(cx + rr * Math.cos(ang)).toFixed(1)}" cy="${(cy + rr * Math.sin(ang)).toFixed(1)}" r="1.6" opacity="${opacity}"/>`;
        }
        if (labelOpacity > 0.02) out += `<text class="nucleus-label" x="${cx.toFixed(1)}" y="${(cy + r + 11).toFixed(1)}" text-anchor="middle" opacity="${labelOpacity.toFixed(2)}">${sym}-${A}</text>`;
        return out;
    }

    function render() {
        const a=analyse(),p=state.progress;
        let text='',drawing='',label='';
        if(a.kind==='fusion'){
            const st=a.st;
            drawing=window.ScienceScenes.fusion(a,p);
            text=st.label+' · 核융합 과정에서 에너지가 방출됩니다.'.replace('核','핵');label='핵융합과 에너지';
        }else if(a.kind==='mass'){
            const i=Math.min(a.star.stages.length-1,Math.floor(p*a.star.stages.length));
            const st=STEPS[a.star.stages[i]];
            drawing='<circle cx="200" cy="105" r="68" fill="#f59e0b" opacity=".55"/><circle cx="200" cy="105" r="34" fill="#b45309"/>'+nucleus(200,105,st.ash.sym,st.ash.A);
            text=p>=1?a.star.endText:st.label+' 과정의 모형';label=a.star.label;
        }else{
            drawing='<circle cx="200" cy="100" r="60" fill="#dbeafe"/><text x="200" y="112" text-anchor="middle" fill="#334155" font-size="32">'+a.el.sym+'</text>';
            text=a.el.origin==='bigbang'?'초기 우주에서 주로 수소·헬륨 생성':a.el.origin==='star'?'별 내부와 진화 과정 등에서 생성':'중성자별 충돌 등 무거운 원소의 생성 과정';label=a.el.name+'의 기원';
        }
        mainGroup.innerHTML=drawing+(a.kind==='fusion'?'':'<text x="20" y="28" fill="#334155">'+label+'</text>');
        graphGroup.innerHTML='<text x="20" y="45" fill="#334155">초기 우주 → 별의 형성과 진화 → 원소가 우주로 퍼짐</text><text x="20" y="95" fill="#334155">이 물질들이 모여 태양계와 우리 몸의 재료가 됩니다.</text>';
        if(a.kind==='fusion') graphGroup.innerHTML=window.ScienceScenes.fusionGraph(a);
        stageBadge.textContent=label;methodHint.textContent='태양의 수소 핵융합과 원소의 생성 과정을 연결합니다.';
        dataNote.innerHTML='<p>'+text+'</p><p>단계와 원자핵 그림은 개념을 나타내는 모형입니다. 그림의 크기·시간으로 실제 핵반응량이나 별의 수명을 계산하지 않습니다.</p>';
        if(a.kind==='fusion') dataNote.innerHTML='<p>'+text+'</p><p>'+(state.step==='h'?'여러 반응 단계를 합친 개념 모형입니다. 수소 핵융합 중 일부 양성자가 중성자로 바뀝니다. 양전자·중성미자 등은 그림에서 생략했습니다.':'헬륨 원자핵 세 개가 여러 단계를 거쳐 탄소 원자핵 하나를 만듭니다.')+' 핵자 수는 보존되며, 질량 차이에 해당하는 에너지가 방출됩니다.</p>';
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
        const a=render();resultEmpty.hidden=true;resultContent.hidden=false;
        labelA.textContent='관찰';valueA.textContent=a.kind==='fusion'?'에너지 방출':a.kind==='mass'?{he:'헬륨까지',co:'탄소·산소까지',sn:'철까지 + 초신성'}[a.star.end]:a.el.name;
        labelB.textContent='핵심';valueB.textContent=a.kind==='fusion'?'핵융합':a.kind==='mass'?'질량에 따라 다름':'원소의 기원';
        const answer=a.kind==='fusion'?'yes':a.verdict;predictionResult.textContent=!state.prediction?'다음에는 먼저 예상해 보세요.':state.prediction===answer?'예상이 맞았습니다.':'예상과 다른 결과입니다.';
        explanation.textContent=a.kind==='fusion'?(state.step==='h'?'수소 원자핵 4개가 여러 반응 단계를 거쳐 헬륨 원자핵 1개를 만들며 에너지를 방출합니다.':'헬륨 원자핵 3개가 여러 반응 단계를 거쳐 탄소 원자핵 1개를 만들며 에너지를 방출합니다.'):a.kind==='mass'?'별의 질량에 따라 생성하는 원소와 마지막 모습이 달라집니다. 모형의 진행 시간은 실제 수명이 아닙니다.':'초기 우주에서 주로 수소·헬륨이 생성되었고, 이후 별 내부·진화·폭발·충돌 등의 여러 과정으로 다양한 원소가 만들어져 퍼졌습니다. 특정 원소의 생성 과정은 하나로만 한정되지 않을 수 있습니다.';
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
        checkBtn.textContent = state.mode === 'fusion' ? '합쳐 보기' : state.mode === 'mass' ? '일생 돌려 보기' : '고향 찾기';
        stageCaption.textContent = state.mode === 'fusion' ? '원자핵들이 가까이 다가가 하나로 합쳐지고, 줄어든 질량만큼 빛과 열이 나옵니다.'
            : state.mode === 'mass' ? '별의 속을 잘라 본 그림입니다. 단계가 끝날 때마다 타고 남은 재가 새 중심이 되어 층이 쌓입니다.'
                : '위의 질량비 자료와 원소가 만들어져 이동한 과정을 연결합니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stopRun();});
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { step: 'h', star: '1', element: 'c', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'fusion').click();
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

    window.__starModel = {
        STEPS, STARS, ORIGINS, state,
        analyse, render,
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
        // A new drawing may contain no lifted prose. Clear the previous
        // drawing's copy too; takeRecords below already consumes our own edits.
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
    // The observer sees the app's DOMContentLoaded render; do not run twice.
})();
