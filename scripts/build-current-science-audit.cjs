// Reproducible current reports, separate from the pre-correction snapshot.
// All report writes are applied via apply_patch; --check is strictly read-only.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const reportEdits=require('./science-scope-patch.cjs');
const root=path.resolve(__dirname,'..'),lab='learning/inquiry/science-lab',out='docs/science-lab-audit-2026-09-20';
const inventory=require('./audit_science_curriculum.cjs');
const map=require('../'+lab+'/curriculum-map.js');
const review=require('../'+out+'/current-review.cjs');
const oldActivities=require('../'+out+'/activity-review.cjs');
const overrides=require('../'+out+'/current-activity-overrides.cjs');
const read=p=>fs.readFileSync(path.join(root,p),'utf8').replace(/\r\n/g,'\n');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const esc=s=>String(s).replaceAll('|','\\|').replace(/\r?\n/g,' ');
const link=(s,p,line)=>`[${esc(s)}](<${path.join(root,p).replaceAll('\\','/')}${line?':'+line:''}>)`;
const ref=n=>link('원문 '+n+'행',inventory.reference,n);
const appLink=slug=>link(map[slug].grade+' '+map[slug].title,lab+'/'+slug+'/index.html');
const unitKey=s=>s.standards[0].code.slice(0,-3);
const sections=inventory.sections,standards=sections.flatMap(s=>s.standards),codes=new Set(standards.map(s=>s.code));
assert.equal(inventory.apps.length,104);assert.equal(review.length,104);assert.equal(sections.length,112);assert.equal(standards.length,473);
assert.deepEqual(review.map(r=>r.slug).sort(),Object.keys(map).sort());assert.equal(new Set(review.map(r=>r.slug)).size,104);
const directories=fs.readdirSync(path.join(root,lab),{withFileTypes:true}).filter(d=>d.isDirectory()&&fs.existsSync(path.join(root,lab,d.name,'index.html'))).map(d=>d.name).sort();
assert.deepEqual(directories,Object.keys(map).sort());
for(const [slug,m]of Object.entries(map)){assert(m.codes.length);for(const c of m.codes)assert(codes.has(c),slug+':'+c);const a=inventory.apps.find(a=>a.slug===slug);assert.equal(a.grade,m.grade);assert.equal(a.title,m.title);}
const byCode=c=>Object.keys(map).filter(slug=>map[slug].codes.includes(c));
const activityMap=new Map(oldActivities.map(r=>[r.id,{...r,slugs:[...r.slugs]}]));for(const r of overrides)activityMap.set(r.id,r);
const activities=sections.flatMap(s=>s.activities.map((a,i)=>{
 const id=unitKey(s)+'#'+(i+1),r=activityMap.get(id);
 const slugs=r?.slugs||[];for(const slug of slugs)assert(map[slug],id+': '+slug);
 let note=r?.note||'이 원문 활동에 직접 대응하는 구현을 확인하지 못했다. 관련 단원 앱이 있다는 이유만으로 연결하지 않는다.';
 if(r&&!overrides.some(o=>o.id===id))note=note.replace(/심화/g,'별도 과목').replace(/학년 조정 필요\./g,'학년은 현재 앱 표기를 확인한다.');
 return{id,text:a.text,line:a.line,slugs,status:r?.status||'직접연결없음',note};
}));
assert.equal(activities.length,261);for(const r of overrides)assert(activities.some(a=>a.id===r.id),'Unknown activity '+r.id);
const sources=fs.readdirSync(path.join(root,lab),{recursive:true}).filter(p=>/\.(?:js|html|css)$/.test(p)).map(p=>lab+'/'+p.replaceAll('\\','/')).sort();
sources.push(out+'/school-device-check.md',out+'/exam-readiness.md',out+'/exam-question-corrections.cjs','scripts/build-science-exam-meta.cjs',inventory.reference,out+'/common-experiment-census.md','scripts/build-common-experiment-census.cjs',out+'/digital-inquiry-review.cjs',out+'/required-gap-review.cjs',out+'/required-core-review.cjs',out+'/current-review.cjs',out+'/current-activity-overrides.cjs',out+'/activity-review.cjs','scripts/audit_science_curriculum.cjs','scripts/build-current-science-audit.cjs');
const manifest={scope:'current app scope and partial mappings; not curriculum completion',apps:104,questions:416,units:112,standards:473,activities:261,linkedStandards:standards.filter(s=>byCode(s.code).length).length,unlinkedStandards:standards.filter(s=>!byCode(s.code).length).length,unlinkedActivities:activities.filter(a=>!a.slugs.length).length,sources:sources.map(p=>({path:p,sha256:hash(read(p))}))};
const intro='# 현재 교정본 — 학년별 시험 대비 전수 점검\n\n초3~중3·고1 공통과목의 개념·자료 해석 확인 문제 241개와 기존 30개 문항 정정은 [시험 대비 점검 결과](exam-readiness.md)를 확인한다. 아래 표는 실험 앱의 부분 연결이며, 별도 확인 문제의 제공 여부와 구분한다.\n\n기본·심화 구분 없이 학년과 고교 수강 과목으로 편성했다. 기존 102개 앱과 필수 관찰용 신규 2개 앱을 대상으로 했다. 교육과정 학년군은 학교별 진도와 다를 수 있으므로 학교의 시험 범위가 우선이다.\n\n**연결은 일부 내용의 대응이며 단원·성취기준 전체 충족률이 아니다. 모의 관찰, 설명 그림, 실제 실험·측정·설계 활동을 구분한다.**\n\n교정 전 inventory.json/apps.md/standards.md/activities.md는 보존한다. 현재 자료는 current-* 파일이며 `node scripts/build-current-science-audit.cjs --check`로 현 소스와의 일치를 검사한다.\n\n';
const reports={};
reports['current-apps.md']=intro+'## 104개 앱별 현재 판정\n\n| 앱 | 관련 성취기준 | 현재 지원·교정 | 남는 경계 |\n|---|---|---|---|\n'+review.map(r=>`| ${appLink(r.slug)} | ${map[r.slug].codes.join(', ')} | ${esc(r.current)} | ${esc(r.boundary)} |`).join('\n')+'\n';
reports['current-standards.md']=intro+'## 473개 성취기준에서 앱으로 역방향 확인\n\n앱이 연결되지 않은 기준도 모두 남겼다. 연결된 경우에도 해당 기준의 일부 개념·관찰만 지원할 수 있다.\n\n| 성취기준·원문 | 내용 | 현재 부분 연결 앱 |\n|---|---|---|\n'+standards.map(s=>`| ${s.code} · ${ref(s.line)} | ${esc(s.text)} | ${byCode(s.code).map(appLink).join('<br>')||'직접 연결 없음'} |`).join('\n')+'\n';
reports['current-units.md']=intro+'## 112개 단원별 연결 현황\n\n| 단원·원문 | 기준 수 | 앱 연결이 있는 기준 수 | 현재 관련 앱 | 해석 |\n|---|---|---|---|---|\n'+sections.map(s=>{const slugs=[...new Set(s.standards.flatMap(t=>byCode(t.code)))];return`| ${unitKey(s)} ${esc(s.title)} · ${ref(s.line)} | ${s.standards.length} | ${s.standards.filter(t=>byCode(t.code).length).length} | ${slugs.map(appLink).join('<br>')||'직접 연결 없음'} | ${slugs.length?'부분 연결; 개별 기준·활동 표의 빈 항목을 확인':'이 단원의 앱 대응은 확인되지 않음'} |`;}).join('\n')+'\n';
reports['current-activities.md']=intro+'## 261개 탐구활동의 구현 범위\n\n활동별 기존 수작업 연결을 기준으로 교정의 영향을 검토하고 변경 항목을 명시적으로 갱신했다. 타학년·타과목 앱은 같은 학년의 시험 준비를 대신하는 것으로 세지 않는다. `모의활동`도 실제 실험 수행의 완료 판정은 아니다.\n\n| 활동·원문 | 탐구활동 | 판정 | 관련 앱 | 범위·경계 |\n|---|---|---|---|---|\n'+activities.map(a=>`| ${a.id} · ${ref(a.line)} | ${esc(a.text)} | ${a.status} | ${a.slugs.map(appLink).join('<br>')||'—'} | ${esc(a.note)} |`).join('\n')+'\n';
reports['current-manifest.json']=JSON.stringify(manifest,null,2)+'\n';
reports['current-summary.md']=intro+'## 결과\n\n- 104개 앱에 학년·과목·관련 기준을 연결했다. 기존 408문항과 신규 8문항의 정답 확인 동작을 회귀 검사한다.\n- 기존 공통 탐구에 더해 23개 앱 경로에서 필수 성취내용의 누락을 보완했다(기존 21개·신규 2개). 관찰 확인 문제도 추가했다. 그림·정성 모형·가상 자료와 실제 실험은 구분했다.\n- '+manifest.linkedStandards+'개 기준에 부분 연결이 있고, '+manifest.unlinkedStandards+'개 기준은 직접 연결이 없다. 탐구활동 '+manifest.unlinkedActivities+'개는 직접 연결을 확인하지 못했다. 이 수는 교육과정 충족률이 아니다.\n- 추가 필수 탐구: 기존 앱에 24개 실험 패널과 디지털 측정 도구를 연결하고 조건별 관찰 기록과 확인 문제를 추가했다. [추가 구현 범위](required-gap.md)와 [공통과목 134개 활동 최종 대조](common-experiment-census.md)를 확인한다.\n- 전자석: 초6 circuit-bulbs. 전구/저항의 직렬·병렬: 중2 ohms-law. 태양 고도·그림자·계절: 초6 seasons.\n\n## 이번 보완과 남는 경계\n\n- 이번 보완: 생물 관찰, 용해량·진하기, 산/염기의 물질 반응, 물의 상태 변화, 거울·렌즈, 세포·분열·효소, 자유 낙하, 코일·발전, 공통과목 중화 등. [필수 내용 보완 상세](required-core.md)에서 범위·근거·경계를 확인한다.\n- 남는 경계: 실제 생물·암석 표본, 현미경·센서·저울 실측, 천체 관측 프로그램, 장치 제작·실험 설계·연속 관찰은 모형을 클릭하는 것으로 완료되지 않는다.\n- 전 학년: 실제 도구 제작, 실험 설계·측정·장기 관찰·자료 조사·토론·발표는 모형 조작만으로 완료되지 않는다.\n- 통합과학·선택과목·탐구실험·융합/환경/사회 관련 과목 전체 단원을 104개 앱이 모두 제공하는 것은 아니다. 전체 빈 항목은 역방향 표에 남겼다.\n\n## 현재 자료\n\n- '+link('앱별 104개 교정·경계',out+'/current-apps.md')+'\n- '+link('473개 성취기준 역방향표',out+'/current-standards.md')+'\n- '+link('112개 단원 연결표',out+'/current-units.md')+'\n- '+link('261개 탐구활동 판정',out+'/current-activities.md')+'\n- '+link('소스 SHA-256 목록',out+'/current-manifest.json')+'\n\n## 내용 정정에 추가 확인한 자료\n\n면역 기억·백신은 [CDC 백신 원리](https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-1-principles-of-vaccination.html), 전자 영역은 [Purdue VSEPR 설명](https://www.chem.purdue.edu/gchelp/vsepr/rules.html), 발효의 NAD⁺ 재생은 [TU Delft 생화학 교재](https://interactivetextbooks.tudelft.nl/biochemistry/content/Chapter_7_Metabolism.html)를 참고했다. 우주론적 적색편이와 특수상대론 속도의 혼동은 [UCLA 도플러 설명](https://www.astro.ucla.edu/~wright/doppler.htm) 및 [NASA 적색편이 설명](https://science.nasa.gov/asset/webb/what-is-cosmological-redshift/)과 대조했다. 교육과정 연결의 근거는 로컬 교육부 원문이다.\n';
const cli='C:/Users/A/AppData/Local/OpenAI/Codex/bin/cdef5aaf3e41ab53/codex.exe';
function patch(p){for(let i=0;i<3;i++){const r=spawnSync(cli,['--codex-run-as-apply-patch',p],{encoding:'utf8',windowsHide:true});if(r.status===0)return;if(!/Failed to write file/.test(r.stdout+r.stderr))throw Error(r.stdout+r.stderr);}throw Error('write locked');}
for(const [name,text]of Object.entries(reports)){
 const file=out+'/'+name,absolute=path.join(root,file).replaceAll('\\','/');
 if(process.argv.includes('--check')){assert.equal(read(file),text,'Stale current audit '+file);continue;}
 if(fs.existsSync(absolute)){if(read(file)!==text&&process.argv.includes('--refresh'))reportEdits.edit(file,()=>text);else assert.equal(read(file),text,'Generated report differs; use --refresh after inspecting source changes '+file);continue;}
 if(text.length<12000){patch('*** Begin Patch\n*** Add File: '+absolute+'\n'+text.trimEnd().split('\n').map(x=>'+'+x).join('\n')+'\n*** End Patch');assert.equal(read(file),text);continue;}
 const lines=text.trimEnd().split('\n');let previous='';
 for(let i=0;i<lines.length;i+=12){const chunk=lines.slice(i,i+12);patch('*** Begin Patch\n'+(i?'*** Update File: '+absolute+'\n@@\n '+previous+'\n':'*** Add File: '+absolute+'\n')+chunk.map(x=>'+'+x).join('\n')+(i?'\n*** End of File':'')+'\n*** End Patch');previous=chunk.at(-1);}
 assert.equal(read(file),text,file);console.log('Generated '+file);
}
if(process.argv.includes('--refresh')&&!process.argv.includes('--check')){process.argv.push('--apply');reportEdits.apply();}
console.log(JSON.stringify({apps:104,units:112,standards:473,activities:261,linkedStandards:manifest.linkedStandards,unlinkedStandards:manifest.unlinkedStandards,unlinkedActivities:manifest.unlinkedActivities,sourceFiles:manifest.sources.length,check:process.argv.includes('--check')}));
