const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../learning/inquiry');
const w={KOREA_GEOGRAPHY:{questions:[]}},c=vm.createContext({window:w});
for(const f of ['curriculum/map-content.js','curriculum/map-advanced.js','curriculum/map-practice.js','korea-map/data/questions.js','korea-map/data/study-lessons.js','korea-map/data/exam-lessons.js','korea-map/data/exam-questions.js','korea-map/study-visuals.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
const lessons=w.KOREA_GEOGRAPHY.lessons.filter(l=>l.topic==='transport');
const cases=['elementary','middle','high'].flatMap(level=>lessons.filter(l=>w.SchoolMaps.available('korea',l.id,level)).map(l=>({level,lesson:l.id,questions:w.MapPractice.pool('korea',l,w.KOREA_GEOGRAPHY.questions,level)})));
test('actual transport pools for all three school levels exclude the obsolete international-freight tasks',()=>{
  assert.deepEqual(cases.map(x=>[x.level,x.lesson,x.questions.length]),[
    ['elementary','transport-mode',2],['middle','transport-mode',4],['middle','transport-axis',3],['high','transport-mode',2],['high','transport-axis',2]
  ]);
  for(const row of cases)for(const q of row.questions){
    assert.doesNotMatch(JSON.stringify(q),/먼 나라|외국|대륙 간|국제 화물|수출|철광석/,`${row.level}:${q.id}`);
    if(q.id!=='transport-01')assert.ok(q.revision>=2,q.id);
    assert.ok(q.marks?.length||q.diagram,q.id);
  }
  for(const l of lessons){
    assert.doesNotMatch(JSON.stringify(l),/국제 화물|외국|반도체|industry-22|transport-02|transport-05/);
    const host={classList:{toggle(){}},innerHTML:''};w.KoreaVisuals.render(host,l);
    assert.doesNotMatch(host.innerHTML,/국제 화물/);
  }
  const app=fs.readFileSync(path.join(root,'korea-map/app.js'),'utf8');
  assert.match(app,/return allQuestions\(\)\.filter\(\(question\) => question\.topic === currentTheme\)/);
});
test('domestic road/rail cost and city identity are both needed for the answer',()=>{
  const q=w.KoreaExam.pool('transport-mode')[1];
  const numbers=s=>s.match(/\d+(?:\.\d+)?/g).map(Number);
  const [near,far]=numbers(q.stimulus.rows[0][1]);
  const [roadFixed,roadRate]=numbers(q.stimulus.rows[1][1]);
  const [railFixed,railRate]=numbers(q.stimulus.rows[2][1]);
  assert.ok(roadFixed+roadRate*near<railFixed+railRate*near);
  assert.ok(roadFixed+roadRate*far>railFixed+railRate*far);
  assert.equal(q.options[q.answer],'부산');
  assert.deepEqual(JSON.parse(JSON.stringify(q.marks[2])),{label:'C',lat:35.12,lng:129.04});
  assert.match(q.stimulus.note,/가정/);
});
test('commute eligibility and consumption outflow use different measures',()=>{
  const q=w.KoreaExam.pool('transport-axis')[1];
  const rows=q.stimulus.rows.map(r=>({label:r[0],time:r[1].match(/\d+/g).map(Number),share:r[2].match(/\d+/g).map(Number)}));
  const newCommute=rows.filter(r=>r.time[0]>60&&r.time[1]<=60);
  const outflow=rows.slice().sort((a,b)=>(b.share[1]-b.share[0])-(a.share[1]-a.share[0]))[0];
  assert.equal(newCommute.map(r=>r.label).join(','),'B');assert.equal(outflow.label,'C');
  assert.equal(q.options[q.answer],'천안 · 대전');
  const branch=w.KoreaExam.pool('transport-axis')[0];
  assert.equal(branch.options[branch.answer],'B · 남서쪽');
  assert.deepEqual(JSON.parse(JSON.stringify(branch.marks[1])),{label:'B',lat:36.62,lng:127.33});
});
if(process.argv.includes('--export'))fs.writeFileSync(path.resolve(__dirname,'../tmp/korea-transport-cases.json'),JSON.stringify(cases,null,2));
