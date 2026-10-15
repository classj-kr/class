const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),lab=path.join(root,'learning/inquiry/science-lab'),rows=require('./science-restored-experiments.cjs');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const stages={
 mendeleev:`<p class="intro">원소 카드의 원자량과 만드는 물질을 비교하여 규칙이 드러나는 배열을 만들어 보세요. 카드 19개를 놓고 두 칸은 비워 둡니다.</p><section class="experiment-layout"><h2>원소 카드 배열하기</h2><p class="instruction">카드를 고르고 놓을 칸을 누르세요. 배치한 카드를 고르면 다시 옮기거나 다른 카드와 자리를 바꿀 수 있습니다. 원자량은 왼쪽에서 오른쪽, 위에서 아래로 커지게 하고, 성질이 비슷한 원소는 같은 세로줄에 놓아 보세요.</p><div id="elementBoard" class="element-board" role="group" aria-label="원소 카드 배열판, 세 줄 일곱 칸"></div><div class="toolbar"><button id="checkArrangement" class="primary">배열 확인</button><button id="removeElement" disabled>선택 카드 꺼내기</button><button id="resetExperiment">처음부터</button></div><p id="arrangementStatus" class="status" aria-live="polite">카드의 화학식과 반응성을 비교해 보세요.</p><section id="selectedElement" class="selected-element" aria-live="polite"></section><div class="toolbar"><h3 id="poolCount"></h3><button id="sortCards" aria-pressed="false">남은 카드 원자량순</button></div><div id="elementPool" class="element-pool" role="group" aria-label="아직 배치하지 않은 카드"></div><p class="model-note">카드의 원자량과 물질의 성질을 함께 비교하세요.</p></section>`,
 pasteur:`<p class="intro">배양액은 어디에서 온 미생물 때문에 탁해질까요? 두 플라스크의 조건을 바꾸어 비교해 보세요.</p>
 <section class="experiment-layout"><div class="control-panel"><h2>두 플라스크 비교</h2><p id="preparation" class="instruction"></p><div class="toolbar"><button id="heat" class="primary">두 배양액 끓이고 식히기</button><button id="resetExperiment">처음부터</button></div><fieldset><legend>B의 목 부분</legend><div class="choices"><button data-neck="swan" aria-pressed="true">백조목 유지</button><button data-neck="cut" aria-pressed="false">목 자르기</button><button data-neck="tilt" aria-pressed="false">기울였다 세우기</button><button data-neck="sealed" aria-pressed="false">마개로 밀봉</button></div></fieldset><p class="instruction">같은 종류·양의 배양액, 같은 관찰 시간입니다. 조건을 바꿀 때는 같은 방식으로 준비한 새 시료로 비교를 시작합니다.</p></div>
 <div class="comparison"><section class="sample"><h3>A · 백조목 유지</h3><p id="airA"></p><div id="flaskA"></div><p id="observationA"></p></section><section class="sample"><h3 id="labelB"></h3><p id="airB"></p><div id="flaskB"></div><p id="observationB"></p></section></div><div class="legend"><span>파란 점선: 공기의 출입</span><span>갈색 점: 먼지</span><span>배양액 속 작은 기호: 미생물 확대 표시</span></div><div class="toolbar"><button id="observe" class="primary">시간을 보내 관찰하기</button><span id="timeLabel"></span></div><p id="status" class="status" aria-live="polite"></p><p class="model-note">시간을 줄여 보는 모형입니다. 탁해지는 속도나 미생물 수를 실제 측정값으로 나타내지는 않습니다.</p></section>`,
 'newton-prism':`<p class="intro">프리즘은 빛에 새로운 색을 만들어 넣는 걸까요? 분산, 한 색 재통과, 같은 입사 경로, 빛의 합성을 비교해 보세요.</p><section class="experiment-layout"><div class="control-panel"><h2>빛의 분리와 합성</h2><label>백색광을 만드는 광원 <select id="lightSource"><option value="incandescent">백열전구 손전등</option><option value="rgb">빨강·초록·파랑 LED</option></select></label><div class="tabs" role="group" aria-label="실험 장치"><button data-mode="dispersion" aria-pressed="true">백색광 분산</button><button data-mode="single" aria-pressed="false">한 색만 재통과</button><button data-mode="fixed" aria-pressed="false">같은 입사 경로 비교</button><button data-mode="combine" aria-pressed="false">여러 색 다시 모으기</button></div><div id="singleControls" hidden><label>슬릿으로 고를 색 <select id="selectedColor"><option value="0">빨강</option><option value="1">주황</option><option value="2">노랑</option><option value="3">초록</option><option value="4">파랑</option><option value="5">남색</option><option value="6">보라</option></select></label></div><div id="screenControls" hidden><label>빛을 모으는 도구 <select id="collector"><option value="glass">반원 모양 유리</option><option value="lens">볼록 렌즈</option><option value="cup">물을 담은 둥근 컵</option></select></label><label for="screenPosition">스크린 위치 <output id="screenValue">45</output><input id="screenPosition" type="range" min="40" max="100" step="1" value="45"></label><p class="instruction">여러 색이 한곳에 모일 때까지 스크린을 앞뒤로 움직여 보세요.</p></div><div class="toolbar"><button id="lamp" class="primary" aria-pressed="false">손전등 켜기</button><button id="resetExperiment">처음부터</button></div></div><div id="opticsScene" class="scene"></div><div id="legend" class="legend"></div><div class="screen-observation"><div id="screenSwatch" class="screen-swatch" aria-hidden="true"></div><div><b>스크린 관찰 · 확대</b><p id="observation" aria-live="polite"></p></div></div><p class="model-note" id="opticsNote">빛길과 대표 색을 나타낸 모식도입니다. 빛을 모으는 과정은 이상적으로 나타냈으며, 스크린 눈금은 실제 거리나 도구의 초점 거리 측정값이 아닙니다. 한 색 재통과에서는 선택한 빛에 맞추어 두 번째 프리즘의 위치도 바뀝니다.</p></section>`,
 'infection-prevention':`<p class="intro">물방울과 접촉으로 흔적이 어떻게 옮겨 갈까요? 손을 씻는 방법에 따라서도 비교해 보세요.</p><section class="experiment-layout"><h2>전파 과정과 손 씻기</h2><div class="tabs" role="group" aria-label="실험 고르기"><button data-activity="spray" aria-pressed="true">물방울</button><button data-activity="contact" aria-pressed="false">접촉 놀이</button><button data-activity="wash" aria-pressed="false">손 씻기</button></div>
 <section data-panel="spray"><div class="control-panel"><label for="distance">분무기와 도화지 사이 거리 <output id="distanceValue">50 cm</output><input id="distance" type="range" min="50" max="300" step="50" value="50"></label><p class="instruction">거리를 바꾸면 새 색 도화지로 교체합니다. 분무 세기와 횟수는 같게 유지합니다.</p><div class="toolbar"><button id="spray" class="primary">같은 세기로 두 번 뿌리기</button><button id="newPaper">새 도화지</button></div></div><div id="sprayScene" class="scene light"></div><p id="sprayObservation" class="status" aria-live="polite"></p><p class="model-note">물방울의 도달 모습을 비교하는 모형입니다. 물방울이 닿지 않는 거리를 감염병의 안전거리로 정할 수는 없습니다.</p></section>
 <section data-panel="contact" hidden><div class="control-panel"><p class="instruction">한 차례에 접촉할 두 사람씩 고릅니다. 여기서는 한 사람당 한 번 접촉합니다. 네 차례 뒤 표시가 옮겨 간 경로를 확인하세요.</p><b id="roundValue"></b><p id="pairs" class="pair-list"></p><div class="toolbar"><button id="nextRound" class="primary">세 걸음 이동 · 다음 차례</button><button id="clearPairs">이번 접촉 다시 고르기</button><button id="resetContact">놀이 처음부터</button></div></div><div id="people" class="contact-grid"></div><p id="contactObservation" class="status" aria-live="polite"></p><p class="model-note">붙임딱지를 옮기는 놀이 규칙입니다. 실제로 접촉하면 반드시 감염된다는 뜻은 아닙니다.</p></section>
 <section data-panel="wash" hidden><div class="control-panel"><p class="instruction">악수로 같은 양의 형광 로션을 두 손 모형에 묻힌 뒤, 두 손 모두 30초 동안 씻습니다. 손전등으로 남은 로션을 비교하세요.</p><div class="toolbar"><button id="applyLotion" class="primary">로션 묻혀 악수하기</button><button id="uv" aria-pressed="false">확인용 손전등 켜기</button><button id="wash">두 손을 각각 30초 씻기</button><button id="resetHands">손 씻기 처음부터</button></div></div><div class="comparison"><section class="sample"><h3>A · 흐르는 물</h3><div id="waterHand"></div><p>씻는 시간 30초</p></section><section class="sample"><h3>B · 비누와 흐르는 물</h3><div id="soapHand"></div><p>씻는 시간 30초</p></section></div><p id="washObservation" class="status" aria-live="polite"></p><p class="model-note">초록 흔적은 형광 로션의 모형입니다. 실제 병원체나 감염 확률을 표시한 것이 아닙니다.</p></section></section>`
};
stages.mendeleev=require('./science-mendeleev-stage.cjs')(stages.mendeleev);
Object.assign(stages,require('./science-physics-stages.cjs'));
Object.assign(stages,require('./science-chemistry-stages.cjs'));
Object.assign(stages,require('./science-inquiry-stages.cjs'));
Object.assign(stages,require('./science-evidence-stages.cjs'));
Object.assign(stages,require('./science-structure-stages.cjs'));
Object.assign(stages,require('./science-sensor-stages.cjs'));
stages['telescope-observation']=require('./science-telescope-stage.cjs');
stages['rotating-annulus']=require('./science-annulus-stage.cjs');
stages['sunspot-observation']=require('./science-sunspot-stage.cjs');
stages['protein-interaction']=require('./science-docking-stage.cjs');
stages['air-sampling']=require('./science-air-sampling-stage.cjs');
stages['local-biodiversity']=require('./science-biodiversity-stage.cjs');
Object.assign(stages,require('./science-course-practice-stages.cjs'));
Object.assign(stages,require('./science-solution-stages.cjs'));
stages['acoustic-resonance']=require('./science-acoustic-stage.cjs');
stages.electroplating=require('./science-electroplating-stage.cjs');
stages['leaf-starch']=require('./science-leaf-starch-stage.cjs');
stages['dissolution-mass']=require('./science-dissolution-mass-stage.cjs');
stages['food-web']=require('./science-food-web-stage.cjs');
stages['living-environment']=require('./science-plant-growth-stage.cjs');
stages['yeast-fermentation']=require('./science-fermentation-stage.cjs');
stages['light-interference']=require('./science-light-interference-stage.cjs');
stages['galileo-incline']=require('./science-galileo-stage.cjs');
stages['reaction-pressure']=require('./science-reaction-pressure-stage.cjs');
stages['osmosis-mass']=require('./science-osmosis-mass-stage.cjs');
stages['leaf-classification']=require('./science-leaf-classification-stage.cjs');
stages['animal-classification']=require('./science-animal-classification-stage.cjs');
stages['liquid-heat']=require('./science-liquid-heat-stage.cjs');
stages['phase-mass']=require('./science-phase-mass-stage.cjs');
stages['rotating-disc']=require('./science-rotating-disc-stage.cjs');
stages['quadrat-community']=require('./science-quadrat-community-stage.cjs');
stages['ph-comparison']=require('./science-ph-comparison-stage.cjs');
stages.microbes=require('./science-microbe-observation-stage.cjs');
stages['equilibrium-colour']=require('./science-equilibrium-colour-stage.cjs');
stages['cell-structure']=require('./science-cell-observation-stage.cjs');
stages['strata-correlation']=require('./science-strata-correlation-stage.cjs');
stages['polarized-thin-sections']=require('./science-thin-section-stage.cjs');
stages['crust-thickness']=require('./science-crust-thickness-stage.cjs');
stages['video-motion']=require('./science-video-motion-stage.cjs');
stages['hr-diagram']=require('./science-hr-diagram-stage.cjs');
stages['kepler-data']=require('./science-kepler-data-stage.cjs');
stages['star-elements']=require('./science-element-origin-stage.cjs');
stages['dna-structure']=require('./science-dna-stage.cjs');
stages['seasonal-sky']=require('./science-seasonal-sky-stage.cjs');
stages['equilibrium-data']=require('./science-equilibrium-data-stage.cjs');
stages['minerals-rocks']=require('./science-middle-rocks-stage.cjs');
stages['plate-tectonics']=require('./science-tectonic-data-stage.cjs');
stages['argo-observation']=require('./science-argo-stage.cjs');
stages['satellite-sea-temperature']=require('./science-sst-stage.cjs');
stages['galactic-objects']=require('./science-galactic-stage.cjs');
stages['phase-curves']=require('./science-phase-curves-stage.cjs');
stages['acid-mixing']=require('./science-acid-mixing-stage.cjs');
stages['weather-analysis']=require('./science-weather-analysis-stage.cjs');
stages['catalyst-foam']=require('./science-catalyst-foam-stage.cjs');
stages['iodine-clock']=require('./science-iodine-clock-stage.cjs');
function output(file,body){const normalized=s=>s.replace(/\r\n/g,'\n').replace(/\?v=[\w.-]+/g,'');const old=fs.existsSync(file)?fs.readFileSync(file,'utf8'):null;if(process.argv.includes('--check'))assert.equal(old===null?null:normalized(old),normalized(body));else if(old===null||normalized(old)!==normalized(body)){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,body);}}
for(const row of rows){
 const school=row.defaultContext||(row.codes.every(c=>c.startsWith('10'))?'high-common':row.codes.every(c=>c.startsWith('12'))?'high-elective':null);
 const levelLabel=school==='high-common'?'고(공통)':school==='high-elective'?'고(선택)':row.grade;
 const catalogQuery=school?'school='+school:'grade='+row.grade;
 const quiz=row.questions.map((q,i)=>require('./science-question-revision-utils.cjs').renderQuiz(q,i+1)).join('\n');
 const html=`<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${levelLabel} ${row.title}</title><meta name="description" content="2022 교육과정 · ${row.title}의 조건 조작, 관찰과 객관식 결과 해석"><link rel="stylesheet" href="../experiment-stage.css"><link rel="stylesheet" href="../science-reading.css">${(row.styles||[]).map(src=>`<link rel="stylesheet" href="${src}">`).join('')}<link rel="stylesheet" href="../lab-ui.css"></head><body><main><header class="page-header"><a href="../?${catalogQuery}">← ${levelLabel} 과학 실험</a><h1>${row.title}</h1><div class="grade-tags"><span>${levelLabel}</span><span>${(row.courseContexts?.[row.defaultContext]?.subjects||row.subjects).join(' · ')}</span></div></header>${stages[row.slug]}<details class="quiz-section"><summary class="quiz-heading">결과 해석 문제 <span>${row.questions.length}문제</span></summary>${quiz}</details></main>${row.courseContexts?'<script src="../curriculum-map.js"></script><script src="../app-context.js"></script>':''}${(row.scripts||['model.js','app.js']).map(src=>`<script src="${src}"></script>`).join('')}${row.courseContexts?'':'<script src="../curriculum-map.js"></script>'}<script src="../exam-scope.js"></script><script src="../lab-ui.js"></script></body></html>\n`;
 output(path.join(lab,row.slug,'index.html'),html);
}
const misconceptions={},followups={};for(const row of rows){row.questions.forEach((q,i)=>misconceptions[row.slug+'#q'+(i+1)]={concept:q.concept,feedback:q.feedback});followups[row.slug]=row.followups;}
const circuit=require('./science-circuit-course.cjs');circuit.questions.forEach((q,i)=>misconceptions[circuit.slug+'#q'+(i+5)]={concept:q.concept,feedback:q.feedback});followups[circuit.slug]=circuit.followups;
const rocks=require('./science-rock-specimens-course.cjs');rocks.questions.forEach((q,i)=>misconceptions[rocks.slug+'#q'+(i+1)]={concept:q.concept,feedback:q.feedback});followups[rocks.slug]=rocks.followups;
const fork=require('./science-tuning-fork-course.cjs');fork.questions.forEach((q,i)=>misconceptions[fork.slug+'#q'+(i+1)]={concept:q.concept,feedback:q.feedback});followups[fork.slug]=fork.followups;
const metadata=`/* Authored from the source-reviewed experiment registry. */\n(function(root){const extra=${JSON.stringify({misconceptions,followups},null,2)};if(typeof module!=='undefined'){module.exports=extra;}else{root.scienceExperimentQuestions=extra;}})(typeof window==='undefined'?globalThis:window);\n`;
output(path.join(lab,'experiment-questions.js'),metadata);
console.log(JSON.stringify({apps:rows.map(r=>r.slug),procedures:rows.reduce((n,r)=>n+r.procedures.length,0),baseQuestions:rows.reduce((n,r)=>n+r.questions.length,0),transferQuestions:rows.reduce((n,r)=>n+r.followups.length,0)}));
