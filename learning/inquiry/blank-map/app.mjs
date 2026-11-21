import { SETS, POINTS } from './content.mjs?v=20261122-1';
import { LEVELS, AREAS, AREA_PATHS, eligible, newSession, selectPoint, checkAnswer, nextQuestion, retryQuestions } from './session.mjs?v=20261122-1';
const $ = id => document.getElementById(id);
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const params = new URLSearchParams(location.search);
let level = LEVELS[params.get('school')] ? params.get('school') : 'middle';
let area = Object.keys(AREA_PATHS).find(key=>AREA_PATHS[key]===location.pathname) || 'korea';
if (!eligible(SETS,level,area).length) level = 'middle';
let activeSet, session, map, data, geography, markers, leaders, symbols, pins = new Map(), pinLayers = new Map(), fitting;
const returns = { korea:'/learning/inquiry/korea-map/', world:'/learning/inquiry/globe/', history:'/learning/inquiry/globe/history/' };
const origin = AREAS[params.get('from')] ? params.get('from') : area;
const returnURL=new URL(returns[origin],location.origin);
try{const saved=new URL(params.get('return')||'',location.origin);if(saved.origin===location.origin&&Object.values(returns).includes(saved.pathname)){returnURL.pathname=saved.pathname;returnURL.search=saved.search;returnURL.hash=saved.hash;}}catch{}
function updateReturn(){returnURL.searchParams.set('school',level);$('returnMap').href=returnURL.pathname+returnURL.search+returnURL.hash;}
updateReturn();

function controls() {
  $('levels').innerHTML = Object.entries(LEVELS).map(([id,name])=>`<button type="button" data-level="${id}" aria-pressed="${id===level}" ${eligible(SETS,id,area).length?'':'disabled title="이 범위의 초등 활동은 없습니다."'}>${name}</button>`).join('');
  $('areas').innerHTML = Object.entries(AREAS).filter(([id])=>eligible(SETS,level,id).length).map(([id,name])=>`<button type="button" data-area="${id}" aria-pressed="${id===area}">${name}</button>`).join('');
  const choices = eligible(SETS,level,area);
  $('activitySet').innerHTML = choices.map(s=>`<option value="${s.id}">${s.title}</option>`).join('');
  updateReturn();
}
function syncURL() {
  const url = new URL(location.href);
  url.searchParams.set('school',level); url.searchParams.set('area',area); url.searchParams.set('activity',activeSet.id);
  history.replaceState(null,'',url);
}
function start(id, questions) {
  activeSet = eligible(SETS,level,area).find(s=>s.id===id) || eligible(SETS,level,area)[0];
  session = newSession(activeSet,questions);
  $('activitySet').value = activeSet.id;
  $('band').textContent = activeSet.band;
  $('result').hidden = true; $('task').hidden = false;
  // Symbols are shuffled once per run. Answers are keyed by place, never by letter.
  const ids = [...new Set(session.questions.flatMap(q=>q.points))];
  for(let i=ids.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}
  symbols = Object.fromEntries(ids.map((id,i)=>[id,String.fromCharCode(65+i)]));
  syncURL(); renderQuestion();
}
function tableHTML(rows) {
  return `<table class="material-table"><caption class="set-label">판단 자료</caption><tbody>${rows.map(([a,b])=>`<tr><th scope="row">${esc(a)}</th><td>${esc(b)}</td></tr>`).join('')}</tbody></table>`;
}
function chartHTML(chart) {
  const x=i=>34+i*20, ty=t=>176-(t+10)*3, ry=r=>176-r*.42;
  const lines = [0,10,20,30,40].map(t=>`<line x1="28" y1="${ty(t)}" x2="267" y2="${ty(t)}" stroke="#dce5de"/><text x="24" y="${ty(t)+4}" text-anchor="end">${t}</text>`).join('');
  const bars=chart.rain.map((r,i)=>`<rect x="${x(i)-5}" y="${ry(r)}" width="10" height="${176-ry(r)}" fill="#75a9c1"/>`).join('');
  const points=chart.temperature.map((t,i)=>`${x(i)},${ty(t)}`).join(' ');
  const right=[0,100,200,300].map(r=>`<text x="272" y="${ry(r)+4}">${r}</text>`).join('');
  const ticks=chart.temperature.map((_,i)=>`<text x="${x(i)}" y="193" text-anchor="middle">${i+1}</text>`).join('');
  const desc=chart.temperature.map((t,i)=>`${i+1}월 ${t}도, ${chart.rain[i]}밀리미터`).join('; ');
  return `<figure class="climate-figure"><svg viewBox="0 0 306 220" role="img" aria-label="월별 기온과 강수량 그래프"><desc>${esc(desc)}</desc><g font-family="system-ui,sans-serif" font-size="10" fill="#3b5954"><text x="7" y="15">°C</text><text x="273" y="15">mm</text>${lines}${bars}${right}<polyline points="${points}" fill="none" stroke="#b24c3c" stroke-width="2.5"/>${ticks}<text x="270" y="193">월</text><line x1="56" y1="210" x2="74" y2="210" stroke="#b24c3c" stroke-width="2.5"/><text x="79" y="214">기온</text><rect x="154" y="203" width="10" height="11" fill="#75a9c1"/><text x="170" y="214">강수량</text></g></svg><figcaption>기후 특징을 비교하기 위한 학습용 모형 자료</figcaption></figure>`;
}
function renderQuestion() {
  const q=session.questions[session.at];
  $('progress').textContent=`${session.at+1} / ${session.questions.length}`;
  $('questionTitle').textContent=q.prompt;
  $('stimulus').innerHTML=q.table?tableHTML(q.table):q.chart?chartHTML(q.chart):'';
  $('instruction').textContent=q.mode==='order'?`지도에서 ${q.answer.length}곳을 순서대로 고르세요.`:q.mode==='multi'?`지도에서 ${q.answer.length}곳을 고르세요.`:'지도에서 기호를 누르고 확인하세요.';
  $('feedback').textContent=''; $('feedback').className='feedback';
  $('hint').hidden=true; $('hint').textContent=q.hint;
  $('hintButton').hidden=false; $('hintButton').setAttribute('aria-expanded','false');
  $('checkButton').hidden=false; $('nextButton').hidden=true;
  renderMap(q); renderSelection();
}
function renderMap(q) {
  const domestic = area==='korea';
  document.querySelector('.workspace').dataset.mapShape=domestic?'portrait':'landscape';
  // Keep the geographic projection stable while resizing; switch only between domestic/world sets.
  const crs=domestic?L.CRS.EPSG3857:L.CRS.EPSG4326;
  if (!map || map.options.crs!==crs) {
    if(map)map.remove();
    map=L.map('map',{crs,zoomControl:false,attributionControl:true,worldCopyJump:false,minZoom:domestic?3:-2,maxZoom:domestic?10:6,zoomSnap:.25}).setView(domestic?[37.5,128]:[0,0],domestic?5:1);
    L.control.zoom({position:'bottomleft',zoomInTitle:'지도 확대',zoomOutTitle:'지도 축소'}).addTo(map);
    map.attributionControl.setPrefix(false); map.attributionControl.addAttribution('<a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noopener">Natural Earth</a>');
    geography=L.layerGroup().addTo(map); leaders=L.layerGroup().addTo(map); markers=L.layerGroup().addTo(map);
    map.on('zoomend moveend',layoutPins);
  }
  geography.clearLayers(); markers.clearLayers(); leaders.clearLayers(); pins.clear();pinLayers.clear();
  const osm='© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';
  map.attributionControl.removeAttribution(osm);
  if(domestic&&activeSet.rivers)map.attributionControl.addAttribution(osm);
  const base=domestic?data.korea:data.world;
  L.geoJSON(base,{interactive:false,style:{color:'#81988b',weight:1,fillColor:'#fbfaf1',fillOpacity:1,stroke:!activeSet.historic}}).addTo(geography);
  if(!domestic){
    L.polyline([[0,-180],[0,180]],{interactive:false,color:'#8babae',weight:1,dashArray:'5 7'}).addTo(geography);
  }
  if(activeSet.rivers){
    L.geoJSON(data.rivers,{filter:f=>activeSet.rivers.includes(f.properties.name),interactive:false,style:{color:'#518faa',weight:2.5}}).addTo(geography);
  }
  if(activeSet.mountains){
    L.geoJSON(data.mountains,{interactive:false,style:{color:'#a79569',weight:2,fillColor:'#d5c393',fillOpacity:.7}}).addTo(geography);
  }
  for(const id of q.points){
    const [,lon,lat]=POINTS[id];
    const icon=L.divIcon({className:'map-pin-shell',html:`<button type="button" class="map-pin" data-point="${id}" aria-label="지점 ${symbols[id]}" aria-pressed="false">${symbols[id]}</button>`,iconSize:[44,44],iconAnchor:[22,22]});
    const marker=L.marker([lat,lon],{icon,keyboard:false}).addTo(markers);
    const button=marker.getElement().querySelector('button');
    L.DomEvent.disableClickPropagation(button);
    button.addEventListener('click',()=>{session=selectPoint(session,id);renderSelection();if(!session.solved){$('feedback').textContent='';$('feedback').className='feedback';}});
    pins.set(id,button);
    pinLayers.set(id,marker);
  }
  fitting=activeSet.bounds || (domestic?[[32.7,124.1],[42.6,131.4]]:[[-83,-178],[81,180]]);
  fit();
  $('mapCaption').textContent=activeSet.mountains?'갈색: 산맥':activeSet.rivers?'파란 선: 주요 하천':'';
  $('mapCaption').hidden=!$('mapCaption').textContent;
}
function fit(){if(map&&fitting){map.invalidateSize();map.fitBounds(fitting,{paddingTopLeft:[35,55],paddingBottomRight:[35,42],animate:false});layoutPins();}}
function layoutPins(){
  if(!leaders)return;leaders.clearLayers();
  const occupied=[],size=map.getSize();
  const offsets=[[0,0]];
  for(const r of [52,80,110,145])for(let a=0;a<8;a++)offsets.push([Math.cos(a*Math.PI/4)*r,Math.sin(a*Math.PI/4)*r]);
  for(const [id,marker]of pinLayers){
    const p=map.latLngToContainerPoint(marker.getLatLng());
    // Do not drag off-screen points back into the viewport when the user pans.
    if(p.x < -22 || p.x > size.x+22 || p.y < -22 || p.y > size.y+22)continue;
    let chosen=offsets.find(([dx,dy])=>{const x=p.x+dx,y=p.y+dy;return x>25&&x<size.x-25&&y>62&&y<size.y-40&&occupied.every(o=>Math.hypot(o.x-x,o.y-y)>49);})||[0,0];
    const [dx,dy]=chosen,el=marker.getElement();el.style.marginLeft=`${dx-22}px`;el.style.marginTop=`${dy-22}px`;occupied.push({x:p.x+dx,y:p.y+dy});
    if(dx||dy){
      L.polyline([marker.getLatLng(),map.containerPointToLatLng([p.x+dx,p.y+dy])],{interactive:false,color:'#537c72',weight:1.4}).addTo(leaders);
      L.circleMarker(marker.getLatLng(),{interactive:false,radius:3,color:'#285b51',weight:1,fillOpacity:1}).addTo(leaders);
    }
  }
}
function renderSelection(){
  const q=session.questions[session.at];
  for(const [id,button]of pins){
    const selected=session.selected.includes(id);
    button.classList.toggle('selected',selected); button.setAttribute('aria-pressed',String(selected));
    button.querySelector('.order')?.remove();
    if(q.mode==='order'&&selected)button.insertAdjacentHTML('beforeend',`<span class="order">${session.selected.indexOf(id)+1}</span>`);
  }
  $('selection').innerHTML=session.selected.length?session.selected.map((id,i)=>`<span class="selected-token">${q.mode==='order'?`${i+1}. `:''}${symbols[id]}</span>`).join(q.mode==='order'?'<span aria-hidden="true">→</span>':''):'선택 전';
  $('checkButton').disabled=session.selected.length!==q.answer.length;
}
$('checkButton').addEventListener('click',()=>{
  const checked=checkAnswer(session);session=checked.state;
  if(checked.status==='wrong'){
    $('feedback').className='feedback wrong';$('feedback').textContent='다시 살펴보세요. 선택을 바꾸거나 힌트를 볼 수 있어요.';return;
  }
  if(checked.status!=='correct')return;
  const q=session.questions[session.at];
  $('feedback').className='feedback correct';$('feedback').textContent='맞았어요. '+q.explanation;
  for(const [id,button]of pins){
    button.disabled=true;
    if(q.answer.includes(id)){button.classList.add('correct');button.insertAdjacentHTML('beforeend',`<span class="pin-name">${esc(POINTS[id][0])}</span>`);}
  }
  $('checkButton').hidden=true;$('hintButton').hidden=true;$('hint').hidden=true;
  $('nextButton').hidden=false;$('nextButton').textContent=session.at===session.questions.length-1?'활동 마치기':'다음';$('nextButton').focus();
});
$('nextButton').addEventListener('click',()=>{
  if(!session.solved)return;
  if(session.at===session.questions.length-1){showResult();return;}
  session=nextQuestion(session);renderQuestion();$('questionTitle').focus();
});
function showResult(){
  $('task').hidden=true;$('result').hidden=false;
  const first=session.results.filter(r=>r.firstTry).length, retry=retryQuestions(session);
  $('result').innerHTML=`<h2 id="resultTitle" tabindex="-1">활동을 마쳤어요</h2><p class="result-score">${first} / ${session.questions.length}</p><p class="result-copy">처음에 맞힌 과제예요.${retry.length?` 다시 살펴본 ${retry.length}개를 한 번 더 연습해 보세요.`:' 모든 위치를 정확하게 찾았어요.'}</p><div class="result-actions">${retry.length?'<button class="primary" id="retryWrong">다시 살펴본 과제만</button>':''}<button id="restart">전체 다시 하기</button><button id="nextSet">다음 활동</button></div>`;
  $('retryWrong')?.addEventListener('click',()=>start(activeSet.id,retry));
  $('restart').addEventListener('click',()=>start(activeSet.id));
  $('nextSet').addEventListener('click',()=>{const list=eligible(SETS,level,area);start(list[(list.findIndex(s=>s.id===activeSet.id)+1)%list.length].id);});
  $('resultTitle').focus();
}
$('hintButton').addEventListener('click',()=>{$('hint').hidden=!$('hint').hidden;$('hintButton').setAttribute('aria-expanded',String(!$('hint').hidden));});
$('fitMap').addEventListener('click',fit);
$('activitySet').addEventListener('change',()=>{if(data)start($('activitySet').value);});
$('levels').addEventListener('click',e=>{const next=e.target.closest('[data-level]')?.dataset.level;if(!data||!next||next===level||!eligible(SETS,next,area).length)return;level=next;controls();start();});
function navigateArea(next){const url=new URL(location.href);url.pathname=AREA_PATHS[next];url.searchParams.set('area',next);url.searchParams.set('school',level);url.searchParams.delete('activity');location.assign(url.pathname+url.search);}
$('areas').addEventListener('click',e=>{const next=e.target.closest('[data-area]')?.dataset.area;if(!data||!next||next===area)return;navigateArea(next);});
controls();
try {
  const response=await fetch(new URL('./map-data.json?v=20261122-1',import.meta.url));if(!response.ok)throw new Error(response.status);
  data=await response.json();start(params.get('activity'));
  new ResizeObserver(()=>fit()).observe(document.querySelector('.map-stage'));
} catch(error) {
  $('task').hidden=true;
  document.querySelector('.map-stage').insertAdjacentHTML('beforeend','<p class="load-error" role="alert">지도를 불러오지 못했어요. 새로고침해 주세요.</p>');
  console.error('Blank map load failed',error);
}
