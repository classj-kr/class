const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname,'../learning/inquiry/korea-map');
const context = {window:{}};
vm.createContext(context);
for (const name of ['history-data','history-school','history-territories','history-imjin','history-point-lessons']) {
  vm.runInContext(fs.readFileSync(path.join(root,'data',name+'.js'),'utf8'),context);
}
const {KOREA_HISTORY, KOREA_HISTORY_TERRITORIES, KoreaHistorySchool, HistoryPointLessons} = context.window;
const base = KOREA_HISTORY.scenes.find(s=>s.id==='imjin');
const stages = KOREA_HISTORY_TERRITORIES.scenes.imjin;
const scene = (stage, level='high') => KoreaHistorySchool.scene({...base,...stage.lesson},level);

test('invasion and recapture have separate years, routes and Pyongyang explanations',()=>{
  assert.deepEqual(Array.from(stages,s=>s.id),['1592','1593','1597-1598']);
  assert.equal(base.defaultTerritory,'1592');
  assert.ok(stages.every(s=>s.dateNote.includes('1592')));
  const first=scene(stages[0]), second=scene(stages[1]);
  assert.ok(first.marks.some(m=>m.label==='평양 함락(1592)'));
  assert.ok(!first.marks.some(m=>m.label.includes('탈환')));
  assert.ok(first.routes.every(r=>/일본군.*1592/.test(r.label)));
  const recapture=second.marks.find(m=>m.label==='평양성 탈환(1593)');
  assert.match(HistoryPointLessons.get('imjin',recapture,'high','1593').basic,/조선.*명/);
  assert.match(second.routes[0].label,/명군.*1593/);
  assert.ok(second.routes[0].coords[0][1]>second.routes[0].coords.at(-1)[1]);
  assert.ok(!second.marks.some(m=>m.label.includes('1592')));
  assert.ok(scene(stages[2]).marks.every(m=>/1597|1598/.test(m.label)));
  // Distinct losses and victories at the same place must not share the 1592 explanation.
  const jinju=second.marks.find(m=>m.label.includes('진주'));
  assert.match(HistoryPointLessons.get('imjin',jinju,'high','1593').basic,/함락/);
});

test('each school level has visible targets, fitting bounds and explanations for every stage',()=>{
  for(const level of ['elementary','middle','high']) for(const stage of stages) {
    const s=scene(stage,level), [w,south,e,n]=s.bounds;
    assert.ok(s.marks.length>=2);
    assert.equal(KoreaHistorySchool.profile(s,level).paragraphs.length,1);
    for(const p of [...s.marks.map(m=>m.xy),...s.routes.flatMap(r=>r.coords)]){
      assert.ok(p[0]>=w && p[0]<=e && p[1]>=south && p[1]<=n,`${level}/${stage.id}: ${p}`);
    }
    for(const m of s.marks) assert.ok(HistoryPointLessons.get('imjin',m,level,stage.id),m.label);
  }
  assert.equal(scene(stages[0],'elementary').routes.length,1);
  assert.equal(scene(stages[0],'high').routes.length,2);
  assert.ok(scene(stages[0],'elementary').marks.some(m=>m.label.includes('곽재우')));
  assert.ok(scene(stages[0]).marks.some(m=>m.label.includes('정문부')));
  assert.ok(scene(stages[0]).marks.some(m=>m.label.includes('조헌')));
});

test('canonical point indices used by the existing question bank remain stable',()=>{
  assert.equal(base.marks.length,8);
  assert.equal(base.marks[2].label,'평양성 탈환(1593)');
  assert.equal(base.marks[5].label,'한산도 · 이순신');
  assert.equal(base.marks[6].label,'명량(1597)');
  assert.equal(base.marks[7].label,'노량(1598)');
});
