const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'../learning/inquiry/korea-map');
const context={window:{}};vm.createContext(context);
for(const file of ['history-data','history-bronze','history-school','history-additions','history-atlas','history-questions','history-questions-modern','history-reading-questions','history-map-questions','history-local-maps']){
  vm.runInContext(fs.readFileSync(path.join(root,'data',file+'.js'),'utf8'),context);
}
test('every close-range history map and its question have geographic context',()=>{
  for(const scene of context.window.KOREA_HISTORY.scenes.filter(s=>s.localDetail)){
    const data=context.window.HISTORY_LOCAL_MAPS[scene.id];assert.ok(data,scene.id);
    assert.ok(data.wall.length>100);assert.deepEqual(data.wall[0],data.wall.at(-1));
    assert.ok(data.streams.some(line=>line.length>20));
    assert.ok(fs.existsSync(path.join(root,data.relief.src.split('?')[0])));
    const reliefMeta=JSON.parse(fs.readFileSync(path.join(root,'history/hanyang/relief.json'),'utf8'));
    assert.deepEqual(Array.from(data.relief.bounds),reliefMeta.bounds);
    const [w,s,e,n]=data.relief.bounds;
    assert.ok(scene.bounds[0]>w&&scene.bounds[1]>s&&scene.bounds[2]<e&&scene.bounds[3]<n);
    for(const q of context.window.HistoryQuestions.forLevel(scene.id,'high')){
      assert.equal(q.map.localMap,scene.id);assert.deepEqual(q.map.bounds,scene.bounds);
    }
  }
});
test('Hanyang points remain inside the city wall and retain east-west ordering',()=>{
  const scene=context.window.KOREA_HISTORY.scenes.find(s=>s.id==='hanyang-capital');
  const ring=context.window.HISTORY_LOCAL_MAPS[scene.id].wall;
  function inside([x,y]){let result=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){
    const [xi,yi]=ring[i],[xj,yj]=ring[j];
    if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)result=!result;
  }return result;}
  scene.marks.forEach(mark=>assert.ok(inside(mark.xy),mark.label));
  const [palace,shrine,altar]=scene.marks;
  assert.ok(altar.xy[0]<palace.xy[0]&&palace.xy[0]<shrine.xy[0]);
});
