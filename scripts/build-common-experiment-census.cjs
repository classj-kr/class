// Explicit scope exceptions, never silently treating surveys as completed experiments.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {edit,apply}=require('./science-scope-patch.cjs'),inventory=require('./audit_science_curriculum.cjs');
const map=require('../learning/inquiry/science-lab/curriculum-map.js');
const reviews=new Map([...require('../docs/science-lab-audit-2026-09-20/activity-review.cjs'),...require('../docs/science-lab-audit-2026-09-20/current-activity-overrides.cjs')].map(r=>[r.id,r]));
const outside={
 '4과08#1':'감염 과정·예방법 탐구: 보건 조사 활동, 이번 실험 보완에서 제외',
 '4과11#2':'지진 피해 사례 조사·대처 방법: 자료 조사 활동',
 '6과16#1':'진로 탐구',
 '9과01#1':'자율 탐구 문제 선정·계획서: 특정 필수 실험이 아닌 탐구 설계 활동',
 '9과02#2':'생물다양성 보전 놀이',
 '9과07#1':'실제 망원경 야외 관측: 앱 내 모형으로 관측 완료 처리하지 않음',
 '9과07#2':'태양계 자료 수집·분석',
 '9과15#3':'우주탐사 계획 수립',
 '9과17#1':'기후변화 자료 검색·분석: 고1 모형을 중3 완료로 세지 않음',
 '9과18#2':'실시간 외부 해양 자료 분석: 실험 모형과 별도',
 '9과22#1':'재해 사례 빅데이터 분석',
 '9과22#2':'홍보자료 제작',
 '9과23#1':'직업 탐색',
 '9과23#2':'미래 과학 직업 토의',
 '10통과1-03#1':'환경·사회경제적 피해 조사 및 대책 수립',
 '10통과2-03#3':'로봇 사례 분석·개선안 고안'
};
const rows=inventory.sections.filter(s=>/^(4과|6과|9과|10통과)/.test(s.standards[0].code)).flatMap(s=>s.activities.map((a,i)=>({id:s.standards[0].code.slice(0,-3)+'#'+(i+1),...a})));
assert.equal(rows.length,134);for(const id of Object.keys(outside))assert(rows.some(r=>r.id===id));
const compatible=(id,slug)=>{const m=map[slug];return /^4과/.test(id)?m.grades.some(g=>['초3','초4'].includes(g)):/^6과/.test(id)?m.grades.some(g=>['초5','초6'].includes(g)):/^9과/.test(id)?m.level==='middle':m.grades.includes('고1');};
const unresolved=rows.filter(r=>!outside[r.id]&&!reviews.get(r.id)?.slugs.some(s=>compatible(r.id,s)));
assert.deepEqual(unresolved,[],'A common-course activity has no grade-compatible implementation link');
const experiments=rows.filter(r=>r.text.includes('실험'));assert.equal(experiments.length,29);assert(experiments.every(r=>!outside[r.id]));
const path='docs/science-lab-audit-2026-09-20/common-experiment-census.md';
const esc=s=>String(s).replaceAll('|','\\|').replace(/\s+/g,' ');
const text='# 공통과목 실험 최종 대조 — 2026-09-20\n\n'
 +'## 판정 범위\n\n초3~중3 과학과 고1 통합과학1·2의 원문 탐구 활동 **134개 전부**를 대조했다. 그중 원문에 ‘실험’이 명시된 **29개는 모두 해당 학년군 앱에 대응 구현이 있다.** 실험이라는 단어가 없는 관찰·측정·모형 활동도 표에서 누락하지 않았다.\n\n'
 +'134개 중 **118개는 학년군에 맞는 부분 구현·모형·직접 측정 연결**, **16개는 조사·토의·야외 관측 등의 별도 활동**이다. 이 숫자는 필수 실험 개수나 성취기준 전체 충족률이 아니다. 원문 탐구 활동을 모두 법정 필수 실험으로 간주하지 않았다.\n\n'
 +'이번 보완: 기존 추가 패널 18개에서 **24개**로 확장(스펙트럼·개체군·검출 원리·동족 원소 실험 설계·중1 열전도·초4 태양계 모형 추가). 길이·시간 직접 측정, 합성 신호/마이크 파형 분석, 기록 내려받기도 제공한다. 전자석은 초6 circuit-bulbs, 전구/저항 직렬·병렬은 중2 ohms-law, 태양 고도·그림자는 초6 seasons에 있다.\n\n'
 +'**앱에서 모형을 조작하는 기능을 채운 것과 실물 수업을 완료하는 것은 다르다.** 표본·현미경 관찰, 장치 제작, 실물 저울·온도 센서 측정, 장기 천체 관측은 여전히 실제 수업에서 수행해야 한다. 분류 기준 만들기·자유 설계처럼 정해진 선택지 이상의 활동은 현재 부분 구현이다. 고2·고3 선택과목 및 과학탐구실험 전체 완료 판정은 이 공통과목 결론에 포함하지 않는다.\n\n'
 +'## 전체 활동 대조표\n\n| 원문 활동 | 내용 | 학년군 내 연결 앱 | 지원 범위 / 별도 활동 |\n|---|---|---|---|\n'
 +rows.map(r=>{const v=reviews.get(r.id),slugs=(v?.slugs||[]).filter(s=>compatible(r.id,s));return '| '+r.id+' · [원문 '+r.line+'행](<E:/webprojects/class/'+inventory.reference+':'+r.line+'>) | '+esc(r.text)+' | '+(outside[r.id]?'—':slugs.map(s=>'['+map[s].grade+' '+map[s].title+'](<E:/webprojects/class/learning/inquiry/science-lab/'+s+'/index.html>)').join('<br>'))+' | '+esc(outside[r.id]||v.status+': '+v.note)+' |';}).join('\n')
 +'\n\n## 재검증\n\n- `node scripts/build-common-experiment-census.cjs --check`: 원문 활동 모집단·명시적 별도 활동·학년군 연결·보고서 일치 검사. 연결만으로 기능의 충분성을 자동 인증하는 검사가 아니다.\n- `tests/science-required-experiments.test.cjs`: 24개 추가 패널의 200개 조건·600개 정답/오답, 기록·초기화·화면 폭 검사.\n- `tests/science-final-models.test.cjs`: 스펙트럼 선·개체군 변동·대조 실패·변인 통제·열전도 독립 불변식.\n- `tests/science-digital-inquiry.test.cjs`: 길이 보정·시간·신호 분석·기록 파일·마이크 거부/취소/중지/화면 이탈. 자동화의 마이크는 가상 장치이며 실제 기기 음향 품질을 검증한 것은 아니다.\n- 기존 104개 앱·416문항과 필수 보완 23개 경로는 기존 회귀 검사로 별도 확인한다.\n- Chrome에서 1366×768, 1024×768, 820×1024, 768×1024 화면을 검사한다. 실제 ChromeOS·iPad Safari 하드웨어 검증이나 배포 완료라는 뜻은 아니다.\n\n## 추가 과학·기술 근거\n\n- [NIST 수소 선 자료](https://www.physics.nist.gov/PhysRefData/Handbook/Tables/hydrogentable1.htm), [NIST 헬륨 선 자료](https://www.physics.nist.gov/PhysRefData/Handbook/Tables/heliumtable2.htm): 대표선 위치. 표시 선은 일부이며 상대 세기는 생략.\n- [FDA 검출 기술 원리](https://www.fda.gov/consumers/consumer-updates/covid-19-test-basics): 핵산과 단백질 검출 구분. 실제 검사 지침·진단용 앱이 아니다.\n- [MDN Web Audio 파형](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatTimeDomainData), [마이크 권한과 보안 조건](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia).\n\n교육과정 원문은 수정·삭제하지 않았다. 배포·커밋은 이 작업에서 수행하지 않았다.\n';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8').replace(/\r\n/g,'\n'),text);else{
 let current=fs.readFileSync(path,'utf8').replace(/\r\n/g,'\n');
 if(current.length<1000&&!text.startsWith(current)){edit(path,()=>text.split('\n').slice(0,18).join('\n')+'\n');apply();current=fs.readFileSync(path,'utf8').replace(/\r\n/g,'\n');}
 if(current!==text&&text.startsWith(current)){
  const {spawnSync}=require('node:child_process');const lines=text.trimEnd().split('\n');let count=current.trimEnd().split('\n').length;
  // Preserve blank lines after the prefix as part of the append.
  count=current.split('\n').length-1;
  for(let i=count;i<lines.length;i+=8){const chunk=lines.slice(i,i+8);const patch='*** Begin Patch\n*** Update File: E:/webprojects/class/'+path+'\n@@\n'+lines.slice(Math.max(0,i-3),i).map(x=>' '+x).join('\n')+'\n'+chunk.map(x=>'+'+x).join('\n')+'\n*** End of File\n*** End Patch';const result=spawnSync('C:/Users/A/AppData/Local/OpenAI/Codex/bin/cdef5aaf3e41ab53/codex.exe',['--codex-run-as-apply-patch',patch],{encoding:'utf8',windowsHide:true});assert.equal(result.status,0,result.stderr||result.stdout);}
 }else if(current!==text){edit(path,()=>text);apply();}
 assert.equal(fs.readFileSync(path,'utf8').replace(/\r\n/g,'\n'),text);
}
console.log(JSON.stringify({activities:rows.length,explicitExperiments:experiments.length,linked:rows.length-Object.keys(outside).length,separate:Object.keys(outside).length,unresolved:unresolved.length}));
