// Regenerate evidence tables from the source inventory and manual review records.
// --check verifies source freshness and the checked-in/generated outputs without writing.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'docs/science-lab-audit-2026-09-20');
const inventory = JSON.parse(fs.readFileSync(path.join(out, 'inventory.json'), 'utf8'));
const review = require(path.join(out, 'review-data.cjs'));
const activityReview = require(path.join(out, 'activity-review.cjs'));
const checkOnly = process.argv.includes('--check');
const hash = text => crypto.createHash('sha256').update(text).digest('hex');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const esc = s => String(s).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
const link = (label, file, line) => `[${esc(label)}](<${path.join(root, file).replace(/\\/g, '/')}${line ? ':' + line : ''}>)`;
const ref = line => link(`원문 ${line}행`, inventory.reference, line);
const unitKey = s => s.standards[0].code.slice(0, -3);
function unique(items, title) {assert.equal(new Set(items).size, items.length, `${title} 중복`);}
unique(inventory.apps.map(a=>a.slug), '앱 목록');
unique(review.apps.map(a=>a.slug), '앱 판정');
unique(review.units.map(a=>a.unit), '단원 판정');
unique(activityReview.map(a=>a.id), '탐구활동 판정');
const standards = inventory.sections.flatMap(s=>s.standards);
unique(standards.map(s=>s.code), '성취기준');
const standardsByCode = new Map(standards.map(s=>[s.code,s]));
const units = new Map(review.units.map(u=>[u.unit,u]));
const appsBySlug = new Map(inventory.apps.map(a=>[a.slug,a]));
const sectionByUnit = new Map(inventory.sections.map(s=>[unitKey(s),s]));
assert.deepEqual([...appsBySlug.keys()].sort(), review.apps.map(a=>a.slug).sort());
assert.deepEqual([...sectionByUnit.keys()].sort(), [...units.keys()].sort());
for (const a of review.apps) for (const code of a.codes) assert(standardsByCode.has(code), `없는 코드 ${a.slug}/${code}`);
for (const a of activityReview) {
  const [u,n] = a.id.split('#');
  assert(sectionByUnit.get(u)?.activities[Number(n)-1], `없는 활동 ${a.id}`);
  for (const slug of a.slugs) assert(appsBySlug.has(slug), `없는 앱 ${slug}`);
}
// Inventory must include every direct child app, not just a subset of the catalog.
const directories=fs.readdirSync(path.join(root,inventory.scope),{withFileTypes:true})
  .filter(e=>e.isDirectory()&&fs.existsSync(path.join(root,inventory.scope,e.name,'index.html'))).map(e=>e.name).sort();
assert.deepEqual(directories,[...appsBySlug.keys()].sort(),'카탈로그 밖 앱 폴더 발견');
let syntaxChecked=0;
for(const a of inventory.apps) {
  const nested=fs.readdirSync(path.join(root,inventory.scope,a.slug),{recursive:true}).filter(f=>/\.(js|html)$/.test(f));
  assert.equal(nested.length,a.files.length,`${a.slug} 하위 파일 누락`);
  for(const f of a.files) {
    const source=read(f.name);
    assert.equal(hash(source),f.sha256,`감사 후 소스 변경: ${f.name}`);
    if(f.name.endsWith('.js')) {
      const r=spawnSync(process.execPath,['--check',path.join(root,f.name)],{encoding:'utf8',windowsHide:true});
      assert.equal(r.status,0,`${f.name}: ${r.stderr}`);syntaxChecked++;
    }
  }
}
const referenceLines=read(inventory.reference).split(/\r?\n/);
for(const s of standards) assert(referenceLines[s.line-1].startsWith(`[${s.code}]`),`기준 원문 이동 ${s.code}`);
for(const s of inventory.sections) for(const a of s.activities) assert.equal(referenceLines[a.line-1],a.text,'활동 원문 이동');

const appRows=review.apps.map(r=>{
  const a=appsBySlug.get(r.slug);
  // Capture contextual UI evidence as well as a matching explanatory line.
  const method=a.evidence.find(e=>e.file.endsWith('index.html')&&/<li>/.test(read(e.file).split(/\r?\n/)[e.line-1]));
  const hits=a.evidence.filter(e=>e.text.includes(r.needle)&&!e.text.startsWith('//')&&!e.text.startsWith('/*'));
  const detail=hits.find(e=>e.file.endsWith('app.js'))||hits[0];
  assert(detail,`근거 검색어 미검출: ${r.slug}/${r.needle}`);
  const evidence=[method,detail].filter(Boolean).filter((e,i,arr)=>arr.findIndex(q=>q.file===e.file&&q.line===e.line)===i);
  return {...r,grade:a.grade,title:a.title,evidence,catalogLine:a.catalogLine};
});
const appBySlug=new Map(appRows.map(a=>[a.slug,a]));
const appLink=slug=>{const a=appBySlug.get(slug);return link(`${a.title}(${a.grade}; ${a.action})`,`${inventory.scope}/${slug}/index.html`);};
const unitCandidates = u => appRows.filter(a=>a.codes.some(c=>c.slice(0,-3)===u));
const standardRows=inventory.sections.flatMap(s=>s.standards.map(st=>({...st,unit:unitKey(s),
  candidateApps:appRows.filter(a=>a.codes.includes(st.code)).map(a=>a.slug),
  verdict:appRows.some(a=>a.codes.includes(st.code))?'관련 기능 확인 — 전체 충족 아님':'직접 대응 미확인',
  unitReview:units.get(unitKey(s)).note})));
const activityById=new Map(activityReview.map(a=>[a.id,a]));
const activityRows=inventory.sections.flatMap(s=>s.activities.map((a,i)=>{
  const id=unitKey(s)+'#'+(i+1),r=activityById.get(id);
  return {...a,id,unit:unitKey(s),status:r?.status||'미확인',candidateApps:r?.slugs||[],
    note:r?.note||'102개 앱의 조작·설명 대조에서 이 활동을 직접 수행하는 기능은 확인하지 못함. 관련 단원 앱 존재와는 별도 판정.',
    unitReview:units.get(unitKey(s)).note};
}));
const countBy=(rows,key)=>rows.reduce((acc,r)=>(acc[r[key]]=(acc[r[key]]||0)+1,acc),{});
const counts={apps:appRows.length,sourceFiles:inventory.apps.flatMap(a=>a.files).length,syntaxChecked,
  units:inventory.sections.length,standards:standardRows.length,activities:activityRows.length,
  appActions:countBy(appRows,'action'),standardVerdicts:countBy(standardRows,'verdict'),activityVerdicts:countBy(activityRows,'status')};
const common='정적 교육과정 대조표입니다. 관련 기능/모의활동 존재는 성취기준 완전 충족, 실제 실험 대체, 브라우저 동작·수치 정확성 보증을 뜻하지 않습니다. 타학년 앱은 그대로 수업에 사용 가능하다는 판정이 아닙니다.\n';
let appsMd='# 앱 102개 전수 판정\n\n'+common+'\n';
appsMd+='| # | 앱·현재 표시 | 주요 조치 | 관련 기준 | 확인 기능 | 남은 범위·조치 | 코드 근거 |\n|---|---|---|---|---|---|---|\n';
appRows.forEach((a,i)=>{
  const codes=a.codes.map(c=>link(c,inventory.reference,standardsByCode.get(c).line)).join(', ');
  appsMd+=`| ${i+1} | ${appLink(a.slug)} | ${a.action} | ${codes} | ${esc(a.observed)} | ${esc(a.gap)} | ${a.evidence.map(e=>link(`${path.basename(e.file)}:${e.line}`,e.file,e.line)).join(', ')} |\n`;
});
let standardsMd='# 성취기준 473개 역방향 대조\n\n'+common+'\n‘직접 대응 미확인’은 이 실험실 안의 기능 판정이며 사이트 전체에 콘텐츠가 없다는 뜻이 아닙니다. 조사·토론·설계 성취기준은 앱 추가보다 활동지·협업/기록 기능이 적합할 수 있습니다.\n';
let activitiesMd='# 탐구활동 261개 역방향 대조\n\n'+common+'\n모의활동: 해당 관찰·조작의 핵심 모형 존재. 부분: 소재/일부 단계만. 타학년: 다른 학년·과목 앱에 관련 기능만 존재. 미확인: 직접 수행 기능 미확인. 원문의 탐구활동 제시는 앱 제작 의무 목록이나 별도 성취기준으로 계산하지 않습니다.\n';
for(const s of inventory.sections) {
  const u=unitKey(s),intro=`\n## ${u} ${s.title}\n\n${units.get(u).note}\n\n`;
  standardsMd+=intro+'| 기준 | 원문 | 판정·관련 앱 |\n|---|---|---|\n';
  for(const st of standardRows.filter(x=>x.unit===u)) standardsMd+=`| ${link(st.code,inventory.reference,st.line)} | ${esc(st.text)} | ${st.verdict}${st.candidateApps.length?' / '+st.candidateApps.map(appLink).join(', '):''} |\n`;
  activitiesMd+=intro+'| 활동·원문 | 판정 | 관련 앱 | 개별 검토 |\n|---|---|---|---|\n';
  for(const a of activityRows.filter(x=>x.unit===u)) activitiesMd+=`| ${a.id} ${esc(a.text)} (${ref(a.line)}) | ${a.status} | ${a.candidateApps.map(appLink).join(', ')||'—'} | ${esc(a.note)} |\n`;
}
const report={date:'2026-09-20',method:'manual static feature-to-curriculum crosswalk; not runtime/scientific numerical certification',
  scope:'MOE book 9 science; elementary 3–6, middle, common/general/career/convergence high-school courses; science-lab 102 catalog apps',
  excluded:'MOE book 20 specialized science; other subjects; other site apps; browser/device QA; all numerical-model validation',
  reference:{file:inventory.reference,sha256:hash(read(inventory.reference))},catalog:{file:inventory.scope+'/index.html',sha256:hash(read(inventory.scope+'/index.html'))},
  counts,apps:appRows,standards:standardRows,activities:activityRows,
  parserNotes:['본문 성취기준 구간만 계수. 해설의 중복·범위표기 제외.','해설 3575행의 10과탐02-01-03은 별도 기준으로 세지 않음. 본문 기준은 10과탐2-01-03.'],
  limitations:['학년군(초3~4/5~6,중1~3)과 앱의 특정 학년표시를 구분. 원문만으로 학기 배치 확정하지 않음.',
    '고교 과목별 선택 이수를 구분. 고2~3 표시만으로 모든 진로선택 수식이 허용된다고 보지 않음.',
    '조작형 모형/선택형 퀴즈를 실측·설계·발표·실천 성취와 동일시하지 않음.',
    '본문과 해설의 범위 제한을 우선 검토. UI 밖의 내부 계산식 존재만으로 범위초과 판정하지 않음.']};
const outputs={'apps.md':appsMd,'standards.md':standardsMd,'activities.md':activitiesMd,'audit.json':JSON.stringify(report,null,2)+'\n'};
for(const [name,content] of Object.entries(outputs)) {
  const target=path.join(out,name);
  if(checkOnly) assert.equal(fs.readFileSync(target,'utf8'),content,`보고서 갱신 필요: ${name}`);
  else fs.writeFileSync(target,content);
}
console.log(JSON.stringify({mode:checkOnly?'verified':'generated',...counts},null,2));
