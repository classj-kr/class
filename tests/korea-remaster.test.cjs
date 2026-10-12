const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../learning/inquiry');
const w={KOREA_GEOGRAPHY:{questions:[]}},ctx=vm.createContext({window:w});
for(const f of ['curriculum/map-content.js','curriculum/map-advanced.js','curriculum/map-practice.js','korea-map/data/questions.js','korea-map/data/study-lessons.js','korea-map/data/exam-lessons.js','korea-map/data/exam-questions.js','korea-map/study-visuals.js','korea-map/exam-figures.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const bank=w.KoreaExam.questions;
test('question evidence takes precedence over map suppression, including the previously missing climate graph',()=>{
  const kind=w.KoreaExamFigures.visualKind;
  assert.equal(kind(bank.find(q=>q.id==='korea-exam-temperature-2')),'graph');
  assert.equal(kind({showMap:false,figure:'relief'}),'figure');
  assert.equal(kind({showMap:false,stimulus:{}}),'none');
  assert.equal(kind({marks:[]}), 'map');
  for(const id of w.KoreaExamFigures.ids){
    const host={classList:{remove(){}},innerHTML:''};
    w.KoreaExamFigures.render(host,id);
    assert.match(host.innerHTML,/<svg[^>]*role="img"[^>]*aria-label="[^"]+"/);
    assert.match(host.innerHTML,/<figcaption>[^<]+<\/figcaption>/);
  }
  assert.ok(bank.every(q=>!q.diagram),'High-school questions must not reuse annotated lesson figures');
});
test('paired measures derive from the actual displayed table values',()=>{
  const get=id=>bank.find(q=>q.id===`korea-exam-${id}`);
  const n=s=>parseFloat(String(s).replaceAll(',',''));
  const age=get('age-1'),[a,b]=age.stimulus.rows.map(r=>r.slice(1).map(n));
  const old=[a[2]/a[0],b[2]/b[0]], dependency=[(a[0]+a[2])/a[1],(b[0]+b[2])/b[1]];
  assert.ok(old[0]>old[1] && dependency[0]<dependency[1]);
  assert.equal(age.options[age.answer],'노령화 지수 낮음 · 총부양비 높음');
  const industry=get('port-industry-2'),[c,d]=industry.stimulus.rows.map(r=>r.slice(1).map(n));
  assert.ok(c[1]>d[1] && c[0]*c[1]<d[0]*d[1]);
  assert.equal(industry.options[industry.answer],'비중은 갑, 종사자 수는 을이 크다');
});
test('every high-school concept has supplied evidence, distinct answers, explanation and a rendered visual',()=>{
  assert.equal(w.KOREA_GEOGRAPHY.lessons.length,39);assert.equal(bank.length,78);
  assert.equal(new Set(bank.map(q=>q.id)).size,78);
  for(const l of w.KOREA_GEOGRAPHY.lessons){
    const pool=w.MapPractice.pool('korea',l,w.KOREA_GEOGRAPHY.questions,'high');assert.equal(pool.length,2,l.id);
    assert.ok(w.KoreaExam.notes[l.id].paragraphs.length>=2,l.id);
    if(l.id!=='temperature')assert.equal(w.KoreaExam.notes[l.id].spotNotes.length,l.spots.length,l.id);
    for(const q of pool){
      assert.equal(q.lesson,l.id);assert.ok(q.figure||q.diagram||q.marks?.length||q.stimulus||q.graph,q.id);
      assert.equal(new Set(q.options).size,q.options.length,q.id);
      assert.ok(q.options[q.answer]&&q.explanation.length>45,q.id);
      if(q.marks)for(const m of q.marks)assert.ok(m.lat>=30&&m.lat<44&&m.lng>122&&m.lng<136,q.id);
      if(q.diagram)assert.ok(w.KOREA_GEOGRAPHY.lessons.some(x=>x.id===q.diagram),q.id);
      if(q.figure)assert.ok(w.KoreaExamFigures.ids.includes(q.figure),q.id);
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
  assert.equal((25-(-5)),30);assert.match(answer('temperature-1'),/A 갑·B 을/);
  assert.ok(780/1200>750/1500);assert.match(answer('monsoon-1'),/갑이 더 높다/);
  assert.ok(30/10>25/25);assert.ok(40/60<50/50);assert.equal(answer('age-1'),'노령화 지수 낮음 · 총부양비 높음');
  assert.equal((300000*.2)/(100000*.3),2);assert.match(answer('age-2'),/을.*2배/);
  assert.ok(20000*.4<60000*.2 && .4/.1>.2/.1);assert.match(answer('port-industry-2'),/비중은 갑, 종사자 수는 을/);
  assert.ok(120/400>100/500 && 120*100/6000<100*100/2500);assert.match(answer('farming-2'),/경지율이 높지만.*좁다/);
  assert.equal((80*.2)/(20*.4),2);assert.match(answer('energy-2'),/을.*두 배/);
  assert.equal(100000*.2,20000);assert.equal(40000*.25,10000);assert.match(answer('division-1'),/갑→을.*2만/);
  assert.equal(-100-(-300),200);assert.match(answer('migration-1'),/사회적 증가에도 총인구가 감소/);
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
