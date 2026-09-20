(() => {
  'use strict';
  const M = window.ColorMix;
  const $ = selector => document.querySelector(selector);
  const canvas = $('#mixCanvas');
  const ctx = canvas.getContext('2d');
  const state = { mode:'light', values:[100,0,0], separated:false, task:-1, prediction:null, revealed:false, records:[] };
  const saved = { light:[100,0,0], filter:[100,0,0] };
  const remembered = { light:[100,100,100], filter:[100,100,100] };
  let beforeExperiment = null;
  let announceTimer;
  const isExperiment = () => state.task >= 0;

  function buildControls() {
    const mode = M.modes[state.mode];
    $('#channels').innerHTML = mode.names.map((name, index) => `
      <div class="channel" style="--channel:${mode.colors[index]}">
        <div class="channel-heading"><label for="channel${index}"><span class="channel-code">${mode.codes[index]}</span>${name}</label><button type="button" class="channel-switch" data-channel-toggle="${index}" role="switch" aria-checked="false"></button></div>
        <div class="range-row"><input id="channel${index}" data-channel="${index}" type="range" min="0" max="100" step="1" value="${state.values[index]}" aria-describedby="controlHint"><output for="channel${index}" id="channelOutput${index}"></output></div>
      </div>`).join('');
    $('#channels').querySelectorAll('[data-channel]').forEach(input => input.addEventListener('input', () => {
      const index = Number(input.dataset.channel);
      state.values[index] = Number(input.value);
      if (state.values[index] > 0) remembered[state.mode][index] = state.values[index];
      saved[state.mode] = [...state.values];
      render();
    }));
    $('#channels').querySelectorAll('[data-channel-toggle]').forEach(button => button.addEventListener('click', () => {
      const index = Number(button.dataset.channelToggle);
      state.values[index] = state.values[index] > 0 ? 0 : remembered[state.mode][index];
      saved[state.mode] = [...state.values];
      render();
    }));
  }

  function draw() {
    const isLight = state.mode === 'light';
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = isLight ? '#000' : '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const centers = state.separated ? [[180,260],[450,260],[720,260]] : [[360,220],[540,220],[450,365]];
    const radius = state.separated ? 108 : 163;
    ctx.globalCompositeOperation = isLight ? 'lighter' : 'multiply';
    centers.forEach(([x,y], index) => {
      const individual = [0,0,0];
      individual[index] = state.values[index];
      ctx.fillStyle = M.css(M.rgb(state.mode, individual));
      ctx.beginPath(); ctx.arc(x,y,radius,0,Math.PI*2); ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';
    centers.forEach(([x,y], index) => {
      ctx.strokeStyle = isLight ? '#ffffff44' : '#00000038';
      ctx.lineWidth = 1.5;
      ctx.setLineDash(state.values[index] === 0 ? [5,7] : []);
      ctx.beginPath(); ctx.arc(x,y,radius,0,Math.PI*2); ctx.stroke();
    });
    ctx.setLineDash([]);
    const names = M.modes[state.mode].names;
    const labels = state.separated ? [[180,415],[450,415],[720,415]] : [[157,130],[743,130],[450,550]];
    ctx.textAlign = 'center'; ctx.font = '500 22px "Noto Sans KR", "Malgun Gothic", sans-serif';
    ctx.fillStyle = isLight ? '#c5cbd0' : '#434947';
    labels.forEach(([x,y], index) => ctx.fillText(`${names[index]} ${state.values[index]}%`, x,y));
    if (!state.separated) {
      // Center target lies within all three discs. Its pixels match the model output.
      ctx.strokeStyle = isLight ? '#ffffff99' : '#00000080'; ctx.lineWidth = 1;
      [[436,282,442,282],[458,282,464,282],[450,268,450,274],[450,290,450,296]].forEach(line => {
        ctx.beginPath();ctx.moveTo(line[0],line[1]);ctx.lineTo(line[2],line[3]);ctx.stroke();
      });
    }
  }

  function render() {
    const isLight = state.mode === 'light';
    const pending = isExperiment() && !state.revealed;
    const mode = M.modes[state.mode];
    const result = M.rgb(state.mode, state.values);
    const name = M.name(result);
    $('#stage').dataset.mode = state.mode;
    document.querySelectorAll('[data-mode]').forEach(button => {
      if (button.tagName !== 'BUTTON') return;
      button.setAttribute('aria-pressed', String(button.dataset.mode === state.mode));
      button.disabled = isExperiment();
    });
    $('#modeContext').textContent = isLight ? '어두운 곳에 세 조명의 빛을 비춥니다.' : '흰빛이 색 필터를 통과합니다.';
    $('#stageTitle').textContent = isLight ? '빛을 비추는 화면' : '필터를 통과한 빛';
    $('#controlsTitle').textContent = isLight ? '조명의 세기' : '필터의 흡수 정도';
    $('#controlHint').textContent = isExperiment() ? '준비된 조합으로 실험합니다. 자유 실험에서는 직접 조절할 수 있습니다.' : isLight ? '막대를 움직이거나 스위치로 빛을 꺼 보세요.' : '100%는 해당 성분을 모두 거르고, 0%는 그대로 통과시킵니다.';
    $('#allOn').textContent = isLight ? '모두 켜기' : '모두 겹치기';
    $('#allOff').textContent = isLight ? '모두 끄기' : '모두 빼기';
    $('#separateToggle').textContent = state.separated ? '겹쳐 보기' : '따로 보기';
    $('#separateToggle').setAttribute('aria-pressed', String(state.separated));
    $('#separateToggle').disabled = pending;
    $('#resetControls').disabled = isExperiment();
    $('#allOn').disabled = isExperiment();
    $('#allOff').disabled = isExperiment();
    state.values.forEach((value,index) => {
      const input = $(`#channel${index}`), button = $(`[data-channel-toggle="${index}"]`);
      input.value = value; input.disabled = isExperiment();
      input.setAttribute('aria-valuetext', `${value}%`);
      $(`#channelOutput${index}`).textContent = `${value}%`;
      button.setAttribute('aria-checked', String(value > 0));
      button.setAttribute('aria-label', `${mode.names[index]} ${isLight ? '빛' : '필터'} ${value > 0 ? (isLight ? '끄기' : '빼기') : (isLight ? '켜기' : '넣기')}`);
      button.textContent = value > 0 ? (isLight ? '켬' : '넣음') : (isLight ? '끔' : '뺌');
      button.disabled = isExperiment();
    });
    $('#resultChip').hidden = state.separated;
    $('#resultChip').style.backgroundColor = M.css(result);
    $('#resultLabel').textContent = pending ? '아직 겹치지 않았습니다' : state.separated ? '각각의 색' : '세 영역이 겹친 곳';
    $('#resultName').textContent = pending ? '먼저 예상해 보세요' : state.separated ? '떨어져 있으면 섞이지 않아요' : name;
    $('#resultDescription').textContent = state.separated ? '' : isLight ? `빨강 ${state.values[0]} · 초록 ${state.values[1]} · 파랑 ${state.values[2]}` : `통과한 빛: 빨강 ${100-state.values[0]} · 초록 ${100-state.values[1]} · 파랑 ${100-state.values[2]}`;
    $('.remaining-light').hidden = state.separated;
    const components = M.components(state.mode,state.values).map(value => Math.round(value*100));
    $('#componentsTitle').textContent = isLight ? '겹친 곳의 빛 성분' : '겹친 필터를 통과한 빛 성분';
    $('#components').innerHTML = ['빨강','초록','파랑'].map((label,index) => `<div class="component-row"><span>${label}</span><span class="component-track"><i style="width:${components[index]}%;--component:${M.modes.light.colors[index]}"></i></span><span>${components[index]}%</span></div>`).join('');
    $('#modelNote').textContent = isLight ? '각 조명의 최대 세기를 100%로 놓은 모형입니다. 실제 조명과 화면의 색은 다를 수 있습니다.' : '흰빛을 비춘 이상적인 필터 모형입니다. 물감을 섞은 색과는 다를 수 있습니다.';
    $('#observationPrompt').textContent = isLight ? '빨강과 초록을 켠 상태에서 파랑을 조금씩 더해 보세요. 겹친 곳이 어떻게 달라지나요?' : '시안과 노랑 필터를 겹친 상태에서 마젠타 필터를 조금씩 넣어 보세요. 어떤 빛 성분이 줄어드나요?';
    draw();
    const description = `${isLight?'빛':'필터'}: ${mode.names.map((label,index)=>`${label} ${state.values[index]}%`).join(', ')}. ${state.separated ? '따로 놓여 있습니다.' : `겹친 곳은 ${name}입니다.`}`;
    canvas.setAttribute('aria-label',description);
    clearTimeout(announceTimer);
    announceTimer = setTimeout(() => { $('#liveResult').textContent = description; },200);
  }

  function switchMode(mode) {
    state.mode = mode; state.values = [...saved[mode]];
    buildControls(); render();
  }
  document.querySelectorAll('button[data-mode]').forEach(button => button.addEventListener('click', () => switchMode(button.dataset.mode)));
  $('#separateToggle').addEventListener('click', () => { state.separated = !state.separated; render(); });
  function setAll(value) {
    state.values = [value,value,value]; saved[state.mode] = [...state.values]; render();
  }
  $('#allOn').addEventListener('click', () => setAll(100));
  $('#allOff').addEventListener('click', () => setAll(0));
  $('#resetControls').addEventListener('click', () => {
    state.values = [...M.modes[state.mode].defaults]; saved[state.mode] = [...state.values];
    remembered[state.mode] = [100,100,100]; state.separated = false; render();
  });

  function loadExperiment() {
    const task = M.experiments[state.task];
    state.mode = task.mode; state.values = [...task.values]; state.prediction = null;
    state.revealed = false; state.separated = true;
    $('#experimentStep').textContent = `예측 실험 ${state.task+1} / ${M.experiments.length}`;
    $('#experimentTitle').textContent = task.title;
    $('#experimentInstruction').textContent = task.instruction;
    $('#predictionChoices').disabled = false;
    $('#predictionOptions').innerHTML = task.options.map((option,index) => `<label class="prediction-choice"><input type="radio" name="prediction" value="${index}"><span>${option}</span></label>`).join('');
    $('#predictionOptions').querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
      state.prediction = task.options[Number(input.value)]; $('#revealExperiment').disabled = false;
    }));
    $('#experimentFeedback').textContent = '';
    $('#revealExperiment').hidden = false; $('#revealExperiment').disabled = true;
    $('#nextExperiment').hidden = true;
    $('#nextExperiment').textContent = state.task === M.experiments.length-1 ? '실험 기록 보기 →' : '다음 실험 →';
    buildControls(); render();
    $('#experimentTitle').focus({preventScroll:true}); $('#experiment').scrollIntoView({block:'start'});
  }
  function startExperiment() {
    beforeExperiment = {mode:state.mode,values:[...state.values],separated:state.separated};
    state.task = 0; state.records = [];
    $('#experiment').hidden = false; $('#experimentSummary').hidden = true; $('#startExperiment').hidden = true;
    loadExperiment();
  }
  function leaveExperiment() {
    state.task = -1; state.prediction = null; state.revealed = false;
    Object.assign(state,beforeExperiment);
    $('#experiment').hidden = true; $('#startExperiment').hidden = false;
    buildControls(); render();
  }
  $('#startExperiment').addEventListener('click', startExperiment);
  $('#retryExperiment').addEventListener('click', startExperiment);
  $('#exitExperiment').addEventListener('click', () => {leaveExperiment();$('#startExperiment').focus();});
  $('#revealExperiment').addEventListener('click', () => {
    if (state.prediction === null || state.revealed) return;
    const task = M.experiments[state.task];
    state.revealed = true; state.separated = false;
    state.records.push({task,prediction:state.prediction});
    $('#predictionChoices').disabled = true;
    $('#experimentFeedback').textContent = `${state.prediction===task.answer?'예상과 같아요.':`예상은 ${state.prediction}, 관찰한 색은 ${task.answer}입니다.`} ${task.explanation}`;
    $('#revealExperiment').hidden = true; $('#nextExperiment').hidden = false;
    render(); $('#nextExperiment').focus({preventScroll:true});
  });
  $('#nextExperiment').addEventListener('click', () => {
    if (!state.revealed) return;
    if (state.task < M.experiments.length-1) { state.task++; loadExperiment(); return; }
    $('#summaryRows').innerHTML = state.records.map(({task,prediction},index) => `<article class="summary-row"><span class="record-index">0${index+1}</span><div><h3>${task.title}</h3><p>내 예상 <strong>${prediction}</strong><span aria-hidden="true"> → </span>관찰 결과 <strong>${task.answer}</strong></p></div><span class="record-swatch" style="background:${M.css(M.rgb(task.mode,task.values))}" aria-hidden="true"></span></article>`).join('');
    leaveExperiment(); $('#experimentSummary').hidden = false;
    $('#summaryTitle').focus({preventScroll:true}); $('#experimentSummary').scrollIntoView({block:'start'});
  });
  window.addEventListener('sitebackrequest', event => {
    if (!isExperiment()) return;
    event.preventDefault(); leaveExperiment(); $('#startExperiment').focus();
  });
  buildControls(); render();
})();
