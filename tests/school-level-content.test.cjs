const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const context={window:{}};
for(const name of ['body-content','space-content','matter-content','map-content'])vm.runInNewContext(fs.readFileSync(`learning/inquiry/curriculum/${name}.js`,'utf8'),context);
const catalog=context.window.SchoolContent;
test('school profiles provide distinct teaching content, an actual question and an explanation',()=>{
  assert.equal(Object.keys(catalog).length,31);
  for(const [topic,levels] of Object.entries(catalog)){
    assert.ok(levels.high,topic+' high');
    const signatures=new Set();
    for(const [level,p] of Object.entries(levels)){
      assert.ok(p.source.length>10,topic+' '+level+' source');
      assert.ok(p.concepts.length&&p.concepts.every(s=>s.length>15));
      assert.ok(p.question.length>20&&p.answer.length>20,topic+' '+level);
      signatures.add(p.concepts.join('')+p.question);
    }
    assert.equal(signatures.size,Object.keys(levels).length,topic+' must change content, not just its label');
  }
});
test('primary matter scope excludes high school equations and orbitals',()=>{
  const elementary=Object.entries(catalog).filter(([id,p])=>id.startsWith('matter-')&&p.elementary).map(([id])=>id);
  assert.deepEqual(elementary,['matter-states','matter-phase']);
  for(const id of ['orbital','config','bond','equilibrium','acid','redox','solution'])assert.equal(catalog['matter-'+id].middle,undefined);
});
test('each map lesson has a specific high school reasoning exercise and primary filtering is explicit',async()=>{
  const {WORLD_LESSONS}=await import('../learning/inquiry/globe/curriculum.mjs');
  const korea={window:{KOREA_GEOGRAPHY:{questions:[]}}};
  vm.runInNewContext(fs.readFileSync('learning/inquiry/korea-map/data/questions.js','utf8'),korea);
  vm.runInNewContext(fs.readFileSync('learning/inquiry/korea-map/data/study-lessons.js','utf8'),korea);
  for(const [kind,list] of [['world',WORLD_LESSONS],['korea',korea.window.KOREA_GEOGRAPHY.lessons]]){
    const prompts=new Set();
    for(const l of list){
      const high=context.window.SchoolMaps.profile(kind,l,'high');
      assert.ok(high.source.includes('고등'),l.id);
      assert.ok(high.question.length>20&&high.answer.length>20,l.id);
      prompts.add(high.question);
      if(context.window.SchoolMaps.available(kind,l.id,'elementary')){
        const low=context.window.SchoolMaps.profile(kind,l,'elementary');
        assert.notEqual(high.question,low.question,l.id);
        assert.ok(low.source.includes('초등')||low.source.includes('5-1'));
      }
    }
    assert.equal(prompts.size,list.length,kind+' does not reuse a generic question across lessons');
  }
});
