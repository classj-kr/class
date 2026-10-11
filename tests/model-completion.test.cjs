const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'../learning/inquiry');
function run(c,p){vm.runInNewContext(fs.readFileSync(path.join(root,p),'utf8'),c,{filename:p});}
const c={window:{ExamData:require('../learning/inquiry/human-body/shared/exam-data.js')},document:{addEventListener(){}}};
for(const group of ['body','matter','space'])for(const kind of ['content','lessons'])run(c,`curriculum/${group}-${kind}.js`);
for(const file of ['body-practice','matter-practice','model-supplements','matter-transfer'])run(c,`curriculum/${file}.js`);
run(c,'space/earth-moon/moon-school.js');
const w=c.window;
test('supplements retain original identities and provide valid four-choice table questions',()=>{
 const seen=new Map();let additions=0;
 for(const [topic,levels] of Object.entries(w.SchoolContent)){
  const group=topic.split('-')[0];if(!['body','matter'].includes(group))continue;
  const key=topic.slice(group.length+1),api=group==='body'?w.BodyPractice:w.MatterPractice;
  for(const level of Object.keys(levels)){
   const bank=api.forLevel(key,level);
   assert.ok(bank.some(q=>/-(01|001)$/.test(q.id)||!q.id.includes('transfer')),topic);
   if(group==='matter')assert.equal(bank.length,3,`${topic}/${level}`);
   assert.equal(new Set(bank.map(q=>q.id)).size,bank.length,`${topic}/${level}`);
   for(const q of bank){
    const signature=JSON.stringify([q.question,q.options,q.answer]);
    if(seen.has(q.id))assert.equal(seen.get(q.id),signature,q.id);else seen.set(q.id,signature);
    assert.equal(q.options.length,4,q.id);assert.equal(new Set(q.options).size,4,q.id);
    assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,q.id);
    if(q.table)assert.ok(q.table.rows.every(r=>r.length===q.table.headers.length),q.id);
    if(q.id.includes('transfer-01'))additions++;
   }
  }
 }
 assert.equal(additions,21);
});
test('elementary moon questions cover observations and Earth motion without secondary geometry',()=>{
 const p=w.SchoolContent['space-earth-motion'].elementary;
 assert.equal(p.questions.length,7);
 assert.ok(p.sections.some(s=>s.title.includes('자전')));
 assert.ok(!/이각|삭망월|항성월|본그림자|반그림자|위상각/.test(JSON.stringify(p)));
 assert.equal(new Set(p.questions.map(q=>q.id)).size,7);
});
test('supplement files are actually connected before consumers on their pages',()=>{
 for(const topic of ['digestion','circulation','respiration','excretion','nervous','homeostasis','immune','skeleton']){
  const s=fs.readFileSync(path.join(root,`human-body/${topic}/index.html`),'utf8');
  assert.ok(s.indexOf('model-supplements.js')>s.indexOf('body-practice.js'));
  assert.ok(s.indexOf('model-supplements.js')<s.indexOf('body-level.js'));
 }
 for(const [page,file,consumer] of [['periodic-table','matter-transfer.js','matter-level.js'],['space/earth-moon','moon-school.js','space-level.js'],['korea-map','history-reading-questions.js','history-practice.js']]){
  const s=fs.readFileSync(path.join(root,page,'index.html'),'utf8');
  assert.equal(s.split(file).length,2,page);assert.ok(s.indexOf(file)<s.indexOf(consumer),page);
 }
});
test('city population values reproduce official source rows with explicit dates and units',()=>{
 const g={window:{}};run(g,'korea-map/data/geo-data.js');
 const cities=g.window.KOREA_GEOGRAPHY.themes.population.circles;
 const source=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../docs/model-map-review-2026-10-11/completion/population-source.json'),'utf8'));
 assert.equal(cities.length,37);assert.equal(cities.filter(x=>x.region==='south').length,30);
 for(const city of cities){
  const row=source.cities.find(x=>x.name===city.name);assert.ok(row,city.name);
  assert.equal(city.population,row.population,city.name);assert.equal(city.period,row.period,city.name);
  assert.ok(Math.abs(city.pop-city.population/10000)<0.051,city.name);
 }
 assert.equal(cities.find(x=>x.name==='남포').population,310864);
 assert.equal(cities.find(x=>x.name==='서울').period,'2025-12');
});
