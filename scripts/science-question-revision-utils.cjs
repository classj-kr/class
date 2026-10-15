const revisions=require('./science-question-quality.cjs');
const checks={
 'mendeleev@evidence-transfer':['mendeleev#q1','mendeleev#q4'],
 'speaker-lab@control':['speaker-lab#q1'],
 'wireless-power@distance':['wireless-power#q1','wireless-power#q3'],
 'magnetic-brake@upward':['magnetic-brake#q3'],
 'transistor-speaker@frequency':[],
 'soap-film@wavelength':['soap-film#q3'],
 'soap-film@height':['soap-film#q1','soap-film#q4'],
 'polarization@unknown':['polarization#q4'],
 'electron-slits@spacing':[],
 'electron-slits@path':['electron-slits#q1','electron-slits#q4'],
 'gas-identification@head':['gas-identification#q2'],
 'sugar-phase@mass':['sugar-phase#q1','sugar-phase#q2'],
 'buffer-solution@not-seven':['buffer-solution#q3']
};
const detail={
 'mendeleev#q2':{concept:'원자량 순서와 화합물 비율의 동시 적용',wrong:['X의 세로줄은 맞지만 P와 Cl의 원자량 대소 관계를 거꾸로 적용했습니다.','P의 가로 위치는 맞지만 HX·NaX의 결합 비율을 PH₃·PCl₃와 같은 계열로 분류했습니다.']},
 'mendeleev#q3':{concept:'두 배열 조건으로 미지 원소 후보 검토',wrong:['원자량 범위만 확인하고 같은 세로줄에서 반복되는 산화물의 1:2 비율을 빠뜨렸습니다.','산화물 비율은 맞지만 원자량 40과 75 사이에 놓인다는 조건을 빠뜨렸습니다.']},
 'cell-structure#q1':{concept:'동물·식물 세포의 공통 구조',wrong:['동물 구강 상피에도 세포벽이 있다고 판단했습니다. 세포막과 세포벽을 구별해 보세요.','두 세포 모두 세포벽과 엽록체를 갖는다고 판단했습니다. 동물 구강 상피에는 세포벽이 없고 양파 비늘줄기 표피에서는 보통 엽록체가 관찰되지 않습니다.']},
 'cell-structure#q2':{concept:'세포 경계와 내부 막의 구별',wrong:['핵을 둘러싸는 막을 세포 바깥의 형태를 지지하는 구조와 혼동했습니다.','액포를 둘러싸는 막을 세포 바깥의 형태를 지지하는 구조와 혼동했습니다.']},
 'cell-structure#q3':{concept:'배율과 시야의 관계',wrong:['배율을 높이면 더 넓은 범위가 보인다고 판단했습니다. 확대할수록 시야 범위는 좁아집니다.','시야에 들어오는 세포 수는 줄지만 한 세포의 보이는 크기는 커집니다.']},
 'cell-structure#q4':{concept:'식물 세포 부위에 따른 차이',wrong:['세포벽의 존재와 핵의 관찰을 서로 양립할 수 없는 조건으로 판단했습니다. 두 구조를 같은 세포에서 관찰할 수 있습니다.','엽록체가 보이지 않는다는 사실만으로 동물 세포라고 판단했습니다. 식물의 모든 부위 세포가 엽록체를 갖는 것은 아닙니다.']},
 'lens-image#q1':{concept:'물체 위치 변화와 실상 위치',wrong:['물체가 2f 바깥에 있었을 때의 상 위치를 그대로 선택했습니다.','실상의 위치를 물체와 같은 쪽으로 판단했습니다.','실상의 위치를 물체와 같은 쪽으로 판단했습니다.']},
 'lens-image#q2':{concept:'초점 안쪽의 확대 허상',wrong:['초점 바깥의 거꾸로 된 실상과 혼동한 응답입니다.','오목 렌즈의 축소 허상과 혼동한 응답입니다.','멀리 놓은 물체의 거꾸로 된 축소 실상과 혼동한 응답입니다.']},
 'lens-image#q3':{concept:'볼록·오목 렌즈의 허상 비교',wrong:['두 렌즈의 확대·축소 관계를 반대로 적용했습니다.','실제 물체의 바로 선 축소상을 볼록 렌즈의 상으로 분류했습니다.','실제 물체의 바로 선 확대상을 오목 렌즈의 상으로 분류했습니다.']},
 'lens-image#q4':{concept:'초점의 점광원과 평행 광선',wrong:['평행하게 들어온 빛이 초점에 모이는 경우와 반대로 진행하는 경우를 혼동했습니다.','물체가 2f에 있을 때의 상 위치를 초점의 물체에 적용했습니다.','볼록 렌즈의 초점에서 나온 광선이 퍼진다고 판단했습니다.']},
 'refraction#q2':{concept:'매질과 굴절 방향',wrong:['공기와 물의 굴절 방향을 반대로 적용했습니다.','물에서 공기로 나갈 때에도 법선 쪽으로 꺾인다고 판단했습니다.','공기에서 물로 들어갈 때에도 법선에서 멀어진다고 판단했습니다.']},
 'refraction#q3':{concept:'입사각의 기준은 법선',wrong:['수면과 이루는 각을 입사각으로 선택했습니다.','수면과 이루는 각을 두 배 한 값을 선택했습니다.','수면과 법선 사이의 각을 입사각으로 선택했습니다.']}
};
function revise(old,e){
 const answer=Math.min(old.answer,e.wrong.length),choices=e.wrong.slice();choices.splice(answer,0,e.correct);
 const feedback={};let w=0;
 choices.forEach((choice,i)=>{if(i!==answer){feedback[i]=(e.misconceptions||detail[e.id]?.wrong)?.[w++]||`첫 선택에서는 “${choice}”로 판단했습니다.`;}});
 return{...old,question:e.question,q:e.question,choices,answer,why:e.why,concept:detail[e.id]?.concept||e.concept||old.concept,feedback,checks:checks[e.id]||old.checks};
}
function reviseTransfer(q){const e=revisions.transfer.find(e=>e.id===q.id);return e?revise(q,e):q;}
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function renderQuiz(q,n){return `<article class="quiz-card" data-answer="${'abcd'[q.answer]}">\n<h3>${esc(q.question||q.q)}</h3>\n<div class="quiz-options">\n${q.choices.map((c,j)=>`<label><input type="radio" name="q${n}" value="${'abcd'[j]}"> ${esc(c)}</label>`).join('\n')}\n</div>\n<button class="answer-button" type="button">정답 확인</button>\n<p class="answer-result" aria-live="polite"></p>\n<p class="answer-explanation" hidden>${esc(q.why)}</p>\n</article>`;}
module.exports={revise,reviseTransfer,renderQuiz};
