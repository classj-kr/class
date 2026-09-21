const fs=require('node:fs');
const root='learning/inquiry/age-of-exploration/';
const replace=(s,from,to)=>{if(!s.includes(from))throw Error('Missing: '+from);return s.replace(from,to);};
const edit=(file,fn)=>{const p=root+file;fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n')));};
edit('public/teacher.html',s=>{
 s=replace(s,'<label>미션 종류<select id="missionKind"><option value="study">장소 탐험 · 설명 읽고 세 문제</option><option value="hunt">바다 동물 만나기</option></select></label><p id="huntNote" class="muted" hidden>만날 동물과 바다는 게임이 알아서 고릅니다. 낼 때마다 달라집니다.</p>','');
 s=replace(s,'<div id="arriveRows"><label>도착지 지역<select id="targetRegion"></select></label><label>도착 도시·지형<select id="target"></select></label></div>','');
 s=s.split('\n').filter(line=>!['const ORIGINAL_REGION_ORDER=','const LANDMARK_REGION_ORDER=','const CATEGORY_ORDER=','function landmarkRegion(','function appendLandmarks(','function renderTargetOptions(','function syncMissionKind(',"$('missionKind').onchange="].some(prefix=>line.startsWith(prefix))).join('\n');
 const old=s.split('\n').find(line=>line.startsWith('async function loadCatalog()'));
 s=replace(s,old,"async function loadCatalog(){const r=await fetch('/learn/world-voyage/api/mission-catalog?v=85');catalog=await r.json();renderStudyChoices();const ports=catalog.places.filter(p=>p.isOriginalCity&&p.canEnterFromSea===true);for(const id of ['start1','start2','start3','start4'])appendOriginalCities($(id),ports,false);$('start1').value='lisbon';$('start2').value='london';$('start3').value='istanbul';$('start4').value='original_city_111'}");
 s=replace(s," const hunt=$('missionKind').value==='hunt',study=$('missionKind').value==='study';\n const payload={startPlaceIds:['start1','start2','start3','start4'].map(id=>$(id).value)};\n if(study){if(!studySelection.length){$('missionError').textContent='학습 장소를 1~5곳 추가하세요.';return;}payload.studyTargets=[...studySelection];}\n else if(hunt)payload.hunt=true;\n else payload.targetPlaceId=$('target').value;"," if(!studySelection.length||studySelection.length>3){$('missionError').textContent='학습 장소를 1~3곳 추가하세요.';return;}\n const payload={startPlaceIds:['start1','start2','start3','start4'].map(id=>$(id).value),studyTargets:[...studySelection]};");
 return s.replaceAll('1~5곳','1~3곳').replaceAll('/5곳','/3곳').replaceAll('studySelection.length>=5','studySelection.length>=3').replaceAll('studySelection.length<5','studySelection.length<3');
});
edit('server.js',s=>replace(s,"keys.length>5||new Set(keys).size!==keys.length)throw Error('도시·발견물을 중복 없이 1~5곳 선택하세요.');","keys.length>3||new Set(keys).size!==keys.length)throw Error('도시·발견물을 중복 없이 1~3곳 선택하세요.');"));
edit('tests/place-study-smoke.js',s=>{
 s=replace(s,"const targets=['city:lisbon','discovery:batur-caldera','discovery:milford-sound','discovery:chocolate-hills','discovery:palawan-underground-river'];","const targets=['city:lisbon','discovery:batur-caldera','discovery:milford-sound'];");
 s=replace(s,'assert.equal(published.mission.studyTargets.length,5);',"assert.equal(published.mission.studyTargets.length,3);assert.deepEqual(published.mission.studyTargets.map(t=>t.key),targets,'only teacher-selected places');assert.ok(!published.mission.hunt,'no automatic animal mission');");
 s=replace(s,"      [targets[4],{lat:10.24,lon:118.925,mode:'sea'}],\n",'');
 s=replace(s,"      [targets[3],{lat:9.82,lon:124.14}],\n",'');
 return s.replaceAll("filter(p=>p.phase==='completed').length,5","filter(p=>p.phase==='completed').length,3").replace('mixedTargets:5','mixedTargets:3');
});
edit('tests/v82-animal-hunt-unit.js',s=>{
 const start=s.indexOf('// 교사 현황판에서 동물 잡기를 고를 수 있어야 한다.');
 const end=s.indexOf('\nconsole.log',start);
 if(start<0||end<0)throw Error('Animal UI assertions not found');
 return s.slice(0,start)+`// 새 교사 미션은 지정한 장소만 사용한다. 기존 동물 자료는 유지한다.
const teacher = fs.readFileSync(path.join(__dirname, '..', 'public', 'teacher.html'), 'utf8');
assert.doesNotMatch(teacher, /id="missionKind"|id="huntNote"|payload\\.hunt|바다 동물 만나기|게임이 알아서 고릅니다/, '별도 동물 모드와 자동 선택 안내를 제거해야 한다');
assert.match(teacher, /studyTargets:\\[\\.\\.\\.studySelection\\]/, '교사가 선택한 장소를 미션으로 전달해야 한다');
`+s.slice(end);
});
edit('PLACE-STUDY-REVIEW.md',s=>s.replace('교사 현황판의 기본 미션은 ‘장소 탐험 · 설명 읽고 세 문제’다.','교사 현황판은 장소 선택으로 통일했다. 별도 미션 종류와 자동 동물 선택 안내는 표시하지 않는다.').replaceAll('1~5','1~3').replaceAll('다섯 곳','세 곳'));
