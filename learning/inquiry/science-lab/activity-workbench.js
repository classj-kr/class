(() => {
 'use strict';
 const $=id=>document.getElementById(id),rows=window.scienceActivities,models=window.scienceActivityModels,extensions=window.scienceActivityExtensions;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const defaultState=tool=>extensions?.specs[tool]?extensions.defaults(tool):tool==='pasteur'?{neck:'swan',boiled:'yes',day:'0'}:tool==='prism'?{stage:'dispersion',color:'0',screen:'0'}:{slots:Array(12).fill(''),guesses:{}};
 const defaults=()=>({state:{},hypothesis:'',conclusion:'',records:[]});
 let active=null,book=defaults();const memory=new Map();
 const key=id=>'science-activity-v1:'+id;
 function validated(raw,tool){
  const b=defaults();b.state=defaultState(tool);if(!raw||typeof raw!=='object')return b;
  for(const k of ['hypothesis','conclusion'])b[k]=typeof raw[k]==='string'?raw[k].slice(0,12000):'';
  if(extensions?.specs[tool]){b.state=extensions.validate(tool,raw.state);}else if(tool==='periodic'){
   const allowed=new Set(models.elements.map(e=>e.symbol));
   if(Array.isArray(raw.state?.slots))b.state.slots=b.state.slots.map((_,i)=>[6,7].includes(i)?'':allowed.has(raw.state.slots[i])?raw.state.slots[i]:'');
   for(const k of ['6mass','6oxide','7mass','7oxide'])if(typeof raw.state?.guesses?.[k]==='string')b.state.guesses[k]=raw.state.guesses[k].slice(0,80);
  }else{
   const allowed=tool==='pasteur'?{neck:['swan','cut','tilt','sealed'],boiled:['yes','no'],day:['0','1','2','3','4']}:{stage:['dispersion','single','combine'],color:['0','1','2'],screen:Array.from({length:91},(_,i)=>String(i-45))};
   for(const [k,values]of Object.entries(allowed))if(values.includes(String(raw.state?.[k])))b.state[k]=String(raw.state[k]);
  }
  if(Array.isArray(raw.records))b.records=raw.records.filter(r=>r&&typeof r.summary==='string'&&typeof r.conditions==='string').slice(0,100).map(r=>({conditions:r.conditions.slice(0,2000),summary:r.summary.slice(0,5000),...(r.inputs?{inputs:extensions?.specs[tool]?extensions.validate(tool,r.inputs):r.inputs}:{})}));
  return b;
 }
 const options=(values,current)=>values.map(([value,label])=>`<option value="${esc(value)}"${String(value)===String(current)?' selected':''}>${esc(label)}</option>`).join('');
 const select=(key,label,values)=>`<label>${label}<select data-control="${key}">${options(values,book.state[key])}</select></label>`;
 function catalog(){
  const query=$('search').value.trim().toLocaleLowerCase(),group=$('group').value,scope=$('scope').value;
  const found=rows.filter(r=>(!group||r.group===group)&&(!query||`${r.id} ${r.unit} ${r.text}`.toLocaleLowerCase().includes(query))&&(scope!=='new'||r.tool)&&(scope!=='missing'||(!r.tool&&!r.slugs.length)));
  $('count').textContent=`${found.length} / ${rows.length}개 활동 · 새 탐구 도구 ${rows.filter(r=>r.tool).length}개 · 대응 구현 확인 필요 ${rows.filter(r=>!r.slugs.length&&!r.tool).length}개`;
  $('activities').innerHTML=found.map(r=>`<div class="activity"><div class="meta">${esc(r.group)} · ${esc(r.id)}</div><p>${esc(r.text)}</p>${r.tool?`<button type="button" data-open="${esc(r.id)}">${esc(r.title)} 열기</button><p class="note">${esc(r.remaining)}</p>`:r.slugs.length?r.slugs.map(s=>`<a href="${esc(s)}/">${esc(s)} →</a>`).join(''):'<p class="note">이 활동의 대응 구현은 아직 확인되지 않았습니다.</p>'}${!r.tool&&r.slugs.length?`<p class="note">${esc(r.status)} · ${esc(r.note)}</p>`:''}</div>`).join('');
 }
 function captureDraft(){if(!active)return;book.hypothesis=$('hypothesis').value;book.conclusion=$('conclusion').value;memory.set(active.id,book);}
 function open(id,focus=true){
  const row=rows.find(r=>r.id===id&&r.tool);if(!row)return;
  captureDraft();active=row;let saved;try{saved=JSON.parse(localStorage.getItem(key(id))||'null');}catch{}
  book=memory.get(id)||validated(saved,row.tool);$('workbench').hidden=false;$('catalog').open=false;
  $('activityCode').textContent=row.group+' · '+row.id;$('activityTitle').textContent=row.title;
  $('activitySource').textContent='활동 근거: '+row.source.label+' · '+row.remaining;
  $('hypothesis').value=book.hypothesis;$('conclusion').value=book.conclusion;$('notice').textContent='';
  history.replaceState(null,'','?activity='+encodeURIComponent(id));renderLab();renderRecords();if(focus)$('activityTitle').focus();
 }
 function renderLab(){
  $('record').disabled=false;
  if(extensions?.specs[active.tool]){
   const spec=extensions.specs[active.tool];
   const controls=spec.controls.map(c=>c.type==='select'?select(c.key,c.label,c.options):'<label>'+esc(c.label)+(c.type==='textarea'?'<textarea rows="5" data-control="'+c.key+'">'+esc(book.state[c.key])+'</textarea>':'<input type="'+c.type+'" data-control="'+c.key+'" value="'+esc(book.state[c.key])+'"'+(c.type==='number'?' min="'+c.min+'" max="'+c.max+'" step="'+c.step+'" required':'')+'>')+'</label>').join('');
   $('lab').innerHTML='<section class="procedure"><h3>준비와 탐구 순서</h3><ol>'+spec.steps.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol></section><div class="controls extended">'+controls+'</div><p class="note">좁은 화면에서는 실험 그림을 가로로 밀어 볼 수 있습니다.</p><div class="scene" id="scene" tabindex="0"></div><p id="observation" role="status"></p><div id="measurements"></div><p class="note" id="modelNote"></p>';
   $('lab').querySelectorAll('[data-control]').forEach(el=>el.addEventListener('input',()=>{const c=spec.controls.find(c=>c.key===el.dataset.control);book.state[c.key]=c.type==='number'?Number(el.value):el.value;draw();}));draw();return;
  }
  if(active.tool==='periodic'){
   $('lab').innerHTML='<p>원자량의 증가와 산화물의 성질을 함께 이용해 카드를 배열하세요. 성질이 비슷한 원소는 같은 세로줄에 놓습니다. 원자량은 현대값을 반올림했고, 산화물은 조성 비교를 위한 실험식입니다. 역사적 표 전체의 복제는 아닙니다.</p><div class="periodic" id="periodic"></div><button type="button" id="arrangementCheck">배열 검토</button><p role="status" id="arrangementResult"></p><details><summary>예측 뒤 실제 원소와 비교하기</summary><p>빈칸 A에는 갈륨(Ga, 약 69.7, Ga₂O₃), B에는 저마늄(Ge, 약 72.6, GeO₂)이 대응합니다. 멘델레예프는 원자량과 성질로 빈자리를 남겼고 현대 주기율표는 원자 번호로 배열합니다. 단순 질량 순서에는 예외가 있으므로 성질도 함께 확인해야 합니다.</p></details>';
   drawGrid();$('arrangementCheck').onclick=()=>{$('arrangementResult').textContent=models.periodic(book.state.slots).message;};return;
  }
  const controls=active.tool==='pasteur'?
   select('neck','비교 플라스크', [['swan','백조목 유지'],['cut','목을 잘라 개방'],['tilt','먼지에 배양액 접촉 후 세움'],['sealed','입구 완전 밀폐']])+select('boiled','비교 배양액의 사전 처리',[['yes','가열 처리'],['no','가열하지 않음']])+select('day','관찰 시점',[0,1,2,3,4].map(x=>[x,x+'일'])):
   select('stage','실험 단계',[['dispersion','1. 흰빛 분산'],['single','2. 한 색을 둘째 프리즘에 통과'],['combine','3. 여러 색 다시 모으기']])+select('color','슬릿으로 고를 빛',[['0','빨강'],['1','초록'],['2','파랑']])+'<label>합성 실험의 스크린 위치 (0에서 겹침)<input type="range" min="-45" max="45" value="'+book.state.screen+'" data-control="screen"><output id="screenValue">'+book.state.screen+'</output></label>';
  $('lab').innerHTML='<div class="controls">'+controls+'</div><p class="note">좁은 화면에서는 그림을 가로로 밀어 장치 전체를 볼 수 있습니다.</p><div class="scene" id="scene" tabindex="0" aria-label="가로로 스크롤할 수 있는 실험 그림"></div><p id="observation"></p><div id="measurements"></div><p class="note" id="modelNote"></p>';
  $('lab').querySelectorAll('[data-control]').forEach(el=>{el.addEventListener(el.type==='range'?'input':'change',()=>{book.state[el.dataset.control]=el.value;draw();});});draw();
 }
 function drawGrid(){
  const choices=models.elements.slice().sort((a,b)=>a.symbol.localeCompare(b.symbol));
  $('periodic').innerHTML=book.state.slots.map((symbol,i)=>{
   if([6,7].includes(i))return`<div class="slot unknown"><strong>미발견 빈칸 ${i===6?'A':'B'}</strong><label>예상 원자량<input data-guess="${i}mass" value="${esc(book.state.guesses[i+'mass']||'')}" maxlength="80"></label><label>예상 산화물식<input data-guess="${i}oxide" value="${esc(book.state.guesses[i+'oxide']||'')}" maxlength="80"></label></div>`;
   const e=models.elements.find(e=>e.symbol===symbol);return`<div class="slot"><label>${Math.floor(i/3)+1}행 ${i%3+1}열<select data-slot="${i}">${options([['','카드 선택'],...choices.map(e=>[e.symbol,e.symbol+' '+e.name])],symbol)}</select></label><p>${e?'원자량 '+e.mass+'<br>산화물 '+e.oxide:'원소 카드를 골라 놓으세요.'}</p></div>`;
  }).join('');
  $('periodic').querySelectorAll('[data-slot]').forEach(el=>el.onchange=()=>{const slot=+el.dataset.slot,symbol=el.value;book.state.slots=book.state.slots.map((old,i)=>i===slot?symbol:old===symbol?'':old);drawGrid();$('arrangementResult').textContent='배열이 바뀌었습니다. 다시 검토하세요.';$('periodic').querySelector(`[data-slot="${slot}"]`).focus();});
  $('periodic').querySelectorAll('[data-guess]').forEach(el=>el.oninput=()=>{book.state.guesses[el.dataset.guess]=el.value;});
 }
 function guessesText(){return [6,7].map(i=>`빈칸 ${i===6?'A':'B'}: 예상 원자량 ${book.state.guesses[i+'mass']||'미기록'}, 산화물 ${book.state.guesses[i+'oxide']||'미기록'}`).join(' / ');}
 function current(){return extensions?.specs[active.tool]?extensions.specs[active.tool].run(book.state):active.tool==='periodic'?{summary:models.periodic(book.state.slots).message+' · '+guessesText()}:models[active.tool](book.state);}
 function conditionsText(){
  const s=book.state;
  if(extensions?.specs[active.tool])return extensions.specs[active.tool].controls.map(c=>c.label+': '+(c.type==='select'?c.options.find(o=>o[0]===s[c.key])?.[1]:s[c.key])).join(' · ');
  if(active.tool==='periodic')return s.slots.map((x,i)=>`${Math.floor(i/3)+1}행 ${i%3+1}열: ${x||'빈칸'}`).join(' · ');
  if(active.tool==='pasteur')return `${{swan:'백조목 유지',cut:'목을 잘라 개방',tilt:'먼지에 접촉 후 세움',sealed:'입구 완전 밀폐'}[s.neck]} · ${s.boiled==='yes'?'가열 처리':'미가열'} · ${s.day}일째`;
  return `${{dispersion:'흰빛 분산',single:'단색광 재통과',combine:'여러 색 합성'}[s.stage]}${s.stage==='single'?' · '+['빨강','초록','파랑'][+s.color]:s.stage==='combine'?' · 스크린 위치 '+s.screen:''}`;
 }
 function draw(){
  let result;try{if([...$('lab').querySelectorAll('input[type="number"]')].some(el=>!el.validity.valid))throw Error('숫자 입력 범위를 확인하세요.');result=current();$('record').disabled=false;}catch(e){$('scene').innerHTML='';$('measurements').innerHTML='';$('modelNote').textContent='';$('observation').textContent=e.message;$('record').disabled=true;return;}$('scene').innerHTML=result.svg;$('observation').textContent=result.summary;$('modelNote').textContent=result.note;
  if(result.headers){$('measurements').innerHTML='<div class="table-scroll"><table><caption>현재 조건의 관찰·분석</caption><thead><tr>'+result.headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+result.rows.map(r=>'<tr>'+r.map(v=>'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';}
  if(active.tool==='prism'){
   $('screenValue').textContent=book.state.screen;$('lab').querySelector('[data-control="color"]').disabled=book.state.stage!=='single';$('lab').querySelector('[data-control="screen"]').disabled=book.state.stage!=='combine';
   $('measurements').innerHTML='<div class="table-scroll"><table><caption>꼭지각 60°·최소 편향 조건의 계산 예시</caption><thead><tr><th>색</th><th>가정한 굴절률</th><th>최소 편향각</th></tr></thead><tbody>'+result.values.rays.map(r=>`<tr><td>${r.name}</td><td>${r.n}</td><td>${r.delta.toFixed(2)}°</td></tr>`).join('')+'</tbody></table></div>';
  }
 }
 function renderRecords(){
  $('records').innerHTML=book.records.length?'<table><caption>내 관찰·분석 기록</caption><thead><tr><th>차례</th><th>조건</th><th>관찰·해석</th><th>관리</th></tr></thead><tbody>'+book.records.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r.conditions)}</td><td>${esc(r.summary)}</td><td><button type="button" data-remove="${i}" aria-label="${i+1}번 기록 삭제">삭제</button></td></tr>`).join('')+'</tbody></table>':'';
 }
 $('record').onclick=()=>{if(book.records.length>=100){$('notice').textContent='이 활동에는 100개까지 기록할 수 있습니다.';return;}book.records.push({conditions:conditionsText(),summary:current().summary,inputs:JSON.parse(JSON.stringify(book.state))});renderRecords();$('notice').textContent='현재 조건과 결과를 기록했습니다. 저장 버튼으로 보관할 수 있습니다.';};
 $('records').onclick=e=>{const b=e.target.closest('[data-remove]');if(b){book.records.splice(+b.dataset.remove,1);renderRecords();}};
 $('save').onclick=()=>{captureDraft();try{localStorage.setItem(key(active.id),JSON.stringify(book));$('notice').textContent='이 브라우저에 저장했습니다.';}catch{$('notice').textContent='브라우저에 저장할 수 없습니다. 기록 내려받기를 이용하세요.';}};
 $('download').onclick=()=>{captureDraft();const data={activity:active.id,title:active.title,curriculum:'2022',kind:'모형·입력 자료 탐구 기록 (자료 출처는 기록별 확인)',source:active.source,...book};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=active.id.replace('#','-')+'-탐구기록.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 $('reset').onclick=()=>{book=validated(null,active.tool);memory.set(active.id,book);try{localStorage.removeItem(key(active.id));}catch{}$('hypothesis').value='';$('conclusion').value='';renderLab();renderRecords();$('notice').textContent='이 활동의 조건과 기록을 초기화했습니다.';};
 for(const group of [...new Set(rows.map(r=>r.group))])$('group').add(new Option(group,group));
 for(const id of ['search','group','scope'])$(id).addEventListener(id==='search'?'input':'change',catalog);
 $('activities').onclick=e=>{const b=e.target.closest('[data-open]');if(b)open(b.dataset.open);};catalog();open(new URLSearchParams(location.search).get('activity'),false);
})();
