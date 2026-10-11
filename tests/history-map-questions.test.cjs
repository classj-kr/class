const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const context={window:{}};
vm.createContext(context);
for(const name of ['history-data','history-bronze','history-school','history-additions','history-atlas','history-questions','history-questions-modern','history-reading-questions','history-map-questions']){
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../learning/inquiry/korea-map/data',name+'.js'),'utf8'),context);
}
const {KOREA_HISTORY,HistoryQuestions}=context.window;
test('all high questions have valid map references, distinct options and versioned answers',()=>{
  const coordinates=new Set(KOREA_HISTORY.scenes.flatMap(s=>s.marks.map(m=>JSON.stringify(m.xy))));
  const seen=new Set();let count=0;
  for(const scene of KOREA_HISTORY.scenes)for(const q of HistoryQuestions.forLevel(scene.id,'high')){
    count++;assert.ok(!seen.has(q.id));seen.add(q.id);
    assert.equal(q.revision,q.id==='history-goguryeo-fifth-high-02'?3:2);assert.equal(new Set(q.options).size,5);
    assert.ok(q.answer>=0&&q.answer<q.options.length);
    assert.ok(q.explanation.length>50);
    assert.ok(q.map.points.length>=2);
    const [w,s,e,n]=q.map.bounds;
    assert.ok(w<e&&s<n);
    for(const p of q.map.points){
      assert.ok(coordinates.has(JSON.stringify(p.xy)),q.id);
      assert.ok(p.xy[0]>=w&&p.xy[0]<=e&&p.xy[1]>=s&&p.xy[1]<=n,q.id);
    }
    const labels=new Set(q.map.points.map(p=>p.label));
    for(const text of [q.question,...q.options])for(const m of text.matchAll(/\(([가-마])\)/g))assert.ok(labels.has(m[1]),q.id+':'+m[1]);
  }
  assert.equal(count,74);
});
test('Balhae tasks require route endpoints and capital locations',()=>{
  const [routes,capital]=HistoryQuestions.forLevel('balhae','high');
  assert.equal(routes.map.routes.length,2);
  assert.deepEqual(Array.from(routes.map.points,p=>Array.from(p.xy)),[[126.9,41.8],[130.57,42.86],[120.75,37.82],[136.0556,35.6455]]);
  assert.match(routes.options[routes.answer],/발해관/);
  assert.match(routes.options[routes.answer],/고구려 계승/);
  assert.match(capital.options[capital.answer],/당과 우호/);
  assert.match(capital.explanation,/문왕/);
});

test('Goguryeo evidence question connects the Chungju stele to its map location',()=>{
  const q=HistoryQuestions.forLevel('goguryeo-fifth','high')[1];
  const scene=KOREA_HISTORY.scenes.find(s=>s.id==='goguryeo-fifth');
  assert.equal(q.revision,3);
  assert.deepEqual(Array.from(q.map.points[2].xy),Array.from(scene.marks[4].xy));
  assert.match(q.question,/매금/);
  assert.match(q.options[q.answer],/남한강/);
  assert.match(q.explanation,/충주 고구려비/);
});
