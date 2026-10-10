// Count curriculum activity entries, independently of the number of apps.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const inventory=require('./audit_science_curriculum.cjs');
const reviews=new Map([...require('../docs/science-lab-audit-2026-09-20/activity-review.cjs'),...require('../docs/science-lab-audit-2026-09-20/current-activity-overrides.cjs')].map(r=>[r.id,r]));
const map=require('../learning/inquiry/science-lab/curriculum-map.js');
const groups=['초3~4 과학','초5~6 과학','중1~3 과학','고교 통합과학1·2','고교 과학탐구실험1·2','고교 선택과목'];
const groupFor=code=>groups[/^4과/.test(code)?0:/^6과/.test(code)?1:/^9과/.test(code)?2:/^10통과/.test(code)?3:/^10과탐/.test(code)?4:5];
const rows=inventory.sections.flatMap(s=>s.activities.map((a,i)=>{
 const id=s.standards[0].code.slice(0,-3)+'#'+(i+1),review=reviews.get(id),slugs=review?.slugs||[];
 for(const slug of slugs)assert(map[slug],id+': unknown app');
 return{id,group:groupFor(id),unit:s.title,line:a.line,text:a.text.replace(/^•\s*/,''),slugs,status:slugs.length?review.status:'연결 없음',note:review?.note||'현재 활동 연결표에 대응 구현의 근거가 없다. 전체 저장소에 기능이 없다는 단정은 아니다.'};
}));
// Independently enumerate all bullet entries inside the source's activity blocks.
let active=false;const sourceLines=[];
fs.readFileSync(path.join(root,inventory.reference),'utf8').split(/\r?\n/).forEach((line,i)=>{
 if(line.includes('<탐구 활동>')){active=true;return;}
 if(/^\(가\)|^\(나\)|^\(\d+\)/.test(line))active=false;
 if(active&&/^•/.test(line))sourceLines.push(i+1);
});
assert.deepEqual(rows.map(r=>r.line),sourceLines,'Source activity entries were omitted or duplicated');
assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);
const summary=groups.map(group=>{const selected=rows.filter(r=>r.group===group);return{group,activities:selected.length,linked:selected.filter(r=>r.slugs.length).length,unlinked:selected.filter(r=>!r.slugs.length).length};});
const statuses={};for(const row of rows)statuses[row.status]=(statuses[row.status]||0)+1;
const total={activities:rows.length,linked:rows.filter(r=>r.slugs.length).length,unlinked:rows.filter(r=>!r.slugs.length).length};
const link=(label,file,line)=>`[${label}](<${path.join(root,file).replaceAll('\\','/')}${line?':'+line:''}>)`;
const esc=s=>String(s).replaceAll('|','\\|').replace(/\s+/g,' ');
const lines=[
 '# 필수실험 포함 여부 재점검 — 2026-10-11','',
 '**전체 포함으로 판정할 수 없다. 104는 앱 수이고, 아래 261은 2022 개정 과학과 원문의 `<탐구 활동>` 항목 수다. 서로 다른 단위다.**','',
 '기존 연결 기록을 교육과정 활동 단위로 다시 집계했다. 176개에 관련 앱 링크가 있지만 부분 구현·모형·타학년 연결이 포함된다. 85개에는 연결 기록이 없다. 이번 집계는 기능을 새로 전수 실행하거나 내용의 충분성을 인증한 결과가 아니다.','',
 '| 범위 | 명시된 탐구활동 | 관련 앱 연결 기록 | 연결 없음 |','|---|---:|---:|---:|',
 ...summary.map(g=>`| ${g.group} | ${g.activities} | ${g.linked} | ${g.unlinked} |`),
 `| 합계 | ${total.activities} | ${total.linked} | ${total.unlinked} |`,'',
 '연결 기록의 기존 판정: '+Object.entries(statuses).map(([s,n])=>s+' '+n+'개').join(', ')+'. ‘직접측정’도 전체 활동 절차의 완료를 뜻하지 않는다.','',
 '## 기존 결론에서 빠진 범위','',
 '- 기존 `common-experiment-census.md`는 초3~중3·통합과학1·2의 134개만 다룬다. 고교 공통과목인 과학탐구실험1·2의 16개가 그 범위에 없다.','- 과학탐구실험1·2는 16개 중 13개에 연결 기록이 없고, 연결된 3개도 기존 판정이 모두 ‘부분’이다. 따라서 고교 공통과목까지 전부 채웠다는 결론도 성립하지 않는다.','- 기존의 ‘실험’ 29개는 활동 문장에 해당 문자열이 있는 행을 센 것이다. 필수성의 분류나 전체 실험 수 산정 방식으로 사용할 수 없다. 관찰·측정·모형 제작·자료 분석·설계도 검토해야 한다.','- 기존 공통과목 표의 별도 활동 16개는 구현 검토에서 따로 분류했던 항목이다. 교육과정에서 제외하거나 필수성이 없다고 판정한 항목이 아니다. 현재 전체 연결표의 176개와 기존 표의 118개는 집계 범위와 별도 활동 처리 방식이 다르다.','',
 '## 이 수치의 경계','',
 '261개는 각 과목의 명시된 활동 항목을 중복 주제도 과목별로 각각 센 값이다. 손으로 수행하는 실험만의 수가 아니며, 출판사별 교과서의 모든 탐구나 성취기준·해설에 서술된 모든 활동을 독립 실험으로 세분한 값도 아니다. 초1~2 통합교과는 이 별책 9 집계에 포함되지 않는다.','',
 '**사용자 지정 범위: 2022 개정 교육과정만 구현·검증한다.** 근거는 [교육부 고시](https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=141&boardSeq=93458&lev=0&search=)의 과학과 교육과정이다. 고교 선택과목은 모든 학생이 동일하게 이수하는 공통과목과 구분한다.','',
 '## 과학탐구실험1·2의 16개 활동','',
 '| 활동·원문 | 탐구활동 | 기존 연결 | 남는 내용 |','|---|---|---|---|',
 ...rows.filter(r=>r.group===groups[4]).map(r=>`| ${link(r.id,inventory.reference,r.line)} | ${esc(r.text)} | ${r.slugs.join(', ')||'없음'} (${r.status}) | ${esc(r.note)} |`),'',
 '## 연결 근거가 없는 85개 활동','',
 '아래 항목은 이번 앱 범위의 누락·미연결 검토 목록이다. 다른 과목 앱에 비슷한 기능이 있다는 이유로 자동 충족 처리하지 않는다.','',
 '| 범위 | 활동·원문 | 탐구활동 |','|---|---|---|',
 ...rows.filter(r=>!r.slugs.length).map(r=>`| ${r.group} | ${link(r.id,inventory.reference,r.line)} | ${esc(r.text)} |`),'',
 '## 다시 검증할 기준','',
 '앱 단위가 아니라 활동별로 학년·과목·교육과정 판본, 교과서 원문 위치, 실험 목적과 통제 변인, 조작·측정·기록·분석·결론 절차, 관련 문항, 구현 위치와 남는 부분을 기록한다. 현재 제공된 모형과 학생이 직접 설계·실측해야 하는 활동을 구별한다. 연결만으로 ‘완료’ 처리하지 않는다.','',
 '재현: `node scripts/build-science-activity-coverage.cjs --check`. 261개 원문 활동의 위치가 기존 추출 목록과 일치하는지 독립적인 블록 순회로 확인하며, 보고서·JSON 재집계 결과도 비교한다.',''
];
const output='docs/science-lab-audit-2026-10-11';
const reports={'activity-coverage.md':lines.join('\n'),'activity-coverage.json':JSON.stringify({date:'2026-10-11',basis:inventory.reference,scope:'2022 curriculum listed inquiry activities; link records are not completion',apps:inventory.apps.length,total,summary,statuses,rows},null,2)+'\n'};
for(const [name,content]of Object.entries(reports)){const file=path.join(root,output,name);if(process.argv.includes('--check'))assert.equal(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'),content);else fs.writeFileSync(file,content);}
console.log(JSON.stringify({apps:inventory.apps.length,total,summary,statuses}));
