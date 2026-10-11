const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../learning/inquiry');
const w={KOREA_GEOGRAPHY:{questions:[]}},ctx=vm.createContext({window:w});
for(const f of ['curriculum/map-content.js','curriculum/map-advanced.js','curriculum/map-practice.js','korea-map/data/questions.js','korea-map/data/study-lessons.js','korea-map/data/exam-lessons.js','korea-map/data/exam-questions.js','korea-map/study-visuals.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const bank=w.KoreaExam.questions;
test('every high-school concept has supplied evidence, distinct answers, explanation and a rendered visual',()=>{
  assert.equal(w.KOREA_GEOGRAPHY.lessons.length,39);assert.equal(bank.length,78);
  assert.equal(new Set(bank.map(q=>q.id)).size,78);
  for(const l of w.KOREA_GEOGRAPHY.lessons){
    const pool=w.MapPractice.pool('korea',l,w.KOREA_GEOGRAPHY.questions,'high');assert.equal(pool.length,2,l.id);
    assert.ok(w.KoreaExam.notes[l.id].paragraphs.length>=2,l.id);
    if(l.id!=='temperature')assert.equal(w.KoreaExam.notes[l.id].spotNotes.length,l.spots.length,l.id);
    for(const q of pool){
      assert.equal(q.lesson,l.id);assert.ok(q.diagram||q.marks?.length||q.stimulus||q.graph,q.id);
      assert.equal(new Set(q.options).size,q.options.length,q.id);
      assert.ok(q.options[q.answer]&&q.explanation.length>45,q.id);
      if(q.marks)for(const m of q.marks)assert.ok(m.lat>=30&&m.lat<44&&m.lng>122&&m.lng<136,q.id);
      if(q.diagram)assert.ok(w.KOREA_GEOGRAPHY.lessons.some(x=>x.id===q.diagram),q.id);
    }
    const host={classList:{toggle(){}},innerHTML:''};w.KoreaVisuals.render(host,l);
    assert.ok(/<svg|<table/.test(host.innerHTML),l.id);
  }
});
test('new advanced concepts do not leak into primary or middle-school navigation/pools',()=>{
  for(const l of w.KOREA_GEOGRAPHY.lessons.filter(l=>l.levels)){
    assert.equal(w.SchoolMaps.available('korea',l.id,'elementary'),false,l.id);
    assert.equal(w.SchoolMaps.available('korea',l.id,'middle'),false,l.id);
    assert.equal(w.SchoolMaps.available('korea',l.id,'high'),true,l.id);
  }
  for(const level of ['elementary','middle'])for(const l of w.KOREA_GEOGRAPHY.lessons.filter(l=>w.SchoolMaps.available('korea',l.id,level)))
    assert.ok(w.MapPractice.pool('korea',l,w.KOREA_GEOGRAPHY.questions,level).length,`${level}:${l.id}`);
});
test('independent calculation of case-study denominators and units',()=>{
  const answer=id=>{const q=bank.find(q=>q.id===`korea-exam-${id}`);return q.options[q.answer];};
  assert.equal((25-(-5)),30);assert.match(answer('temperature-1'),/30℃.*추움/);
  assert.ok(780/1200>750/1500);assert.match(answer('monsoon-1'),/갑이 더 높다/);
  assert.equal((20/10)*100,200);assert.equal((10/20)*100,50);assert.equal(answer('age-1'),'갑 200 · 을 50');
  assert.equal((300000*.2)/(100000*.3),2);assert.match(answer('age-2'),/을.*2배/);
  assert.equal(20000*.4,40000*.2);assert.match(answer('port-industry-2'),/같다/);
  assert.equal(100*.6,200*.3);assert.match(answer('farming-2'),/같고/);
  assert.equal((80*.2)/(20*.4),2);assert.match(answer('energy-2'),/을.*두 배/);
  assert.equal(100+80,20+2*80);assert.equal(answer('transport-mode-1'),'x>80');
  assert.equal(100000*.2,20000);assert.equal(40000*.25,10000);assert.match(answer('division-1'),/갑→을.*2만/);
  assert.equal(200-400+1200-900,100);assert.equal(answer('migration-1'),'100명 증가');
  assert.ok(500000*.04>100000*.1);assert.match(answer('migration-2'),/갑은 수가 많고 을은 비율이 높다/);
  assert.equal(200*.6,600*.2);assert.equal(answer('hazards-2'),'두 지역이 같다');
  assert.ok(230-220<195-180&&230>195);assert.match(answer('climate-change-1'),/일수는 을.*기간은 갑/);
  assert.equal(60/200*100,30);assert.equal(60/400*100,15);assert.match(answer('renewal-1'),/30%.*15%/);
});
test('bathymetry uses source-derived ordered bands and keeps every tile in WebP',()=>{
  const data=JSON.parse(fs.readFileSync(path.join(root,'korea-map/data/bathymetry.json'),'utf8'));
  assert.match(JSON.stringify(data),/ETOPO1/);
  assert.deepEqual(data.depthBreaksMetres,[200,2000]);
  const dir=path.join(root,'korea-map/bathymetry');
  const files=fs.readdirSync(dir,{recursive:true}).filter(f=>fs.statSync(path.join(dir,f)).isFile());
  assert.equal(files.length,2756);assert.ok(files.every(f=>f.endsWith('.webp')));
  const css=fs.readFileSync(path.join(root,'korea-map/styles.css'),'utf8');
  assert.deepEqual(data.colors,['#cae6ed','#559ac4','#1e4c82']);
  for(const color of data.colors)assert.ok(css.includes(color));
});
test('all 18 climate charts match the KMA 1991–2020 source extract, including annual statistics',()=>{
  const cw={};const cc=vm.createContext({window:cw});
  vm.runInContext(fs.readFileSync(path.join(root,'korea-map/data/geo-data.js'),'utf8'),cc);
  vm.runInContext(fs.readFileSync(path.join(root,'korea-map/climate-graph.js'),'utf8'),cc);
  const source=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../docs/korea-map-review-2026-10-12/remaster/climate-normals.json'),'utf8'));
  const stations=cw.KOREA_GEOGRAPHY.stations;
  assert.equal(Object.keys(stations).length,18);
  for(const [name,s] of Object.entries(stations)){
    const expected=source.stations[name];
    assert.equal(s.temp.length,12);assert.equal(s.rain.length,12);
    for(const key of ['temp','rain','annualTemp','annualRain','stationId'])assert.equal(JSON.stringify(s[key]),JSON.stringify(expected[key]),`${name}:${key}`);
    const graph=cw.ClimateGraph.build(s,{showName:true});
    assert.equal(Number(graph.avg),expected.annualTemp,name);
    assert.match(graph.svg,/1991–2020/);
  }
  // Claims and ordering used in the paired-station questions must still hold.
  assert.ok(stations['대관령'].temp.every((t,i)=>t<stations['강릉'].temp[i]));
  assert.ok(stations['대관령'].annualRain>stations['강릉'].annualRain);
  assert.equal(stations['강릉'].temp[0]-stations['춘천'].temp[0],5);
  assert.equal(stations['강릉'].temp[7],stations['춘천'].temp[7]);
  assert.ok(stations['중강진'].annualRain<stations['서귀포'].annualRain);
});
if(process.argv.includes('--export'))fs.writeFileSync(path.resolve(__dirname,'../tmp/korea-remaster/qa-cases.json'),JSON.stringify(w.KOREA_GEOGRAPHY.lessons.map(l=>({id:l.id,topic:l.topic,questions:w.KoreaExam.pool(l.id)})),null,2));
