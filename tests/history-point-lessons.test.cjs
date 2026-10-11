const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'../learning/inquiry/korea-map');
const context={window:{}};
vm.createContext(context);
for(const name of ['history-data','history-bronze','history-school','history-additions','history-atlas','history-territories','history-war','history-point-lessons']) {
  vm.runInContext(fs.readFileSync(path.join(root,'data',name+'.js'),'utf8'),context);
}
const {KOREA_HISTORY,KOREA_HISTORY_TERRITORIES,HistoryPointLessons,KoreaHistorySchool}=context.window;
test('every offered point has its own explanation, including filtered primary points and war stages',()=>{
  let baseCount=0,variantCount=0;
  for(const base of KOREA_HISTORY.scenes) {
    const states=[base,...(KOREA_HISTORY_TERRITORIES.scenes[base.id]||[]).filter(s=>s.lesson?.marks)];
    baseCount+=base.marks.length;
    for(const state of states) {
      if(state!==base)variantCount+=state.lesson.marks.length;
      for(const school of ['elementary','middle','high']) {
        if(!KoreaHistorySchool.available(base,school))continue;
        const scene=KoreaHistorySchool.scene({...base,...state.lesson},school);
        for(const mark of scene.marks) {
          const row=HistoryPointLessons.get(base.id,mark,school,state.id);
          assert.ok(row,`${base.id}/${state.id}/${school}/${mark.label}`);
          assert.ok(row.paragraphs.every(t=>t.length>35),mark.label);
          assert.equal(row.paragraphs.length,school==='elementary'?1:2);
          if(row.image)assert.ok(fs.existsSync(path.join(root,row.image.src)));
        }
      }
    }
  }
  assert.equal(baseCount,143);assert.equal(variantCount,18);
});
test('a war point changes its explanation with the selected date',()=>{
  const before=HistoryPointLessons.get('korean-war',{label:'서울'},'high','1950');
  const armistice=HistoryPointLessons.get('korean-war',{label:'서울'},'high','1953');
  assert.match(before.basic,/전쟁 발발 전/);
  assert.match(armistice.basic,/정전 당시/);
  assert.notEqual(before.basic,armistice.basic);
});
test('Chungju includes the correct photograph and avoids a fabricated construction year',()=>{
  const row=HistoryPointLessons.get('goguryeo-fifth',{label:'충주 고구려비'},'high');
  assert.equal(row.image.src,'heritage/g04.webp');
  assert.match(row.basic,/남한강/);
  assert.match(row.connection,/고구려와 신라/);
  assert.match(row.connection,/매금/);
  assert.doesNotMatch(row.connection,/475.*(건립|세웠)/);
  assert.match(row.stepsLabel,/위치 비교/);
});
