const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {extraHeadings}=require('../scripts/science-textbook-headings.cjs');
const page=(id,n)=>JSON.parse(fs.readFileSync('tmp/science-audit-2026-10-11/'+id+'.json','utf8')).pages.find(p=>p.pdfPage===n).text;
test('2022 publisher headings survive 준비해요, wrapped titles and 만들기/나타내기 endings',()=>{
 for(const[id,n,title]of [
  ['4af7d0cddcc4b985',7,'물체를 밀거나 당길 때의 현상 관찰하기'],
  ['4af7d0cddcc4b985',9,'수평 잡기로 물체의 무게 비교하기'],
  ['36a65a1c78e4145a',7,'온도나 압력에 따른 기체의 부피 변화 관찰하기'],
  ['d21b11d92195a717',5,'여러 가지 물체를 이용해 소리 내기'],
  ['22578837da73a2b3',5,'전자기 유도 현상을 이용한 무선 충전기 만들기'],
  ['ada6483ae9f3eafd',3,'스톱 모션으로 생식세포 형성 과정 나타내기'],
  ['279be25ef56d430f',3,'농도와 삼투 현상의 관계를 찾기 위한 실험 설계하고 수행하기'],
  ['ddcc57290fbbe04a',3,'센서를 활용하여 반응 속도를 측정하는 실험을 설계하고 수행하기']
 ])assert(extraHeadings(page(id,n)).some(r=>r.title===title),id+' page '+n);
});
test('heading recovery leaves ordinary prose, numbered steps and unscoped title-like text out',()=>{
 assert.deepEqual(extraHeadings('안내\n컵으로 악기 만들기\n정리'),[]);
 assert.deepEqual(extraHeadings('준비물\n1. 컵으로 악기 만들기\n• 소리 내기\n물체가 떨린다.'),[]);
 const rows=extraHeadings('탐구\n물체의 소리를\n비교하기\n탐구');assert.equal(rows[0].title,'물체의 소리를 비교하기');assert(rows.every(r=>!('implemented' in r)));
 const gas=extraHeadings(page('36a65a1c78e4145a',7));assert(!gas.some(r=>r.title==='관찰하기'));assert(!gas.some(r=>r.title.startsWith('함께 해')));
});
