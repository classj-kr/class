const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '../learning/inquiry');
function run(context, file) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context, {filename:file});
}
function availability(file, route) {
  const location = new URL('http://localhost/learning/inquiry/' + route);
  const context = {window:{}, URL, URLSearchParams, location,
    document:{readyState:'loading',documentElement:{},addEventListener(){}}};
  location.replace = value => { context.redirect = String(value); };
  run(context, 'curriculum/' + file + '.js');
  return context;
}
test('2022 elementary body scope excludes neural, immune and microscopic scenes', () => {
  const c = availability('body-availability', 'human-body/?school=elementary');
  const b = c.window.BodyAvailability;
  for (const id of ['nervous','homeostasis','immune']) assert.equal(b.supports(id,'elementary'),false);
  assert.equal(b.sceneSupports('digestion','torso','elementary'),true);
  assert.equal(b.sceneSupports('digestion','stomach','elementary'),false);
  assert.equal(b.sceneSupports('circulation','blood','elementary'),false);
  assert.equal(b.sceneSupports('excretion','nephron','elementary'),false);
  assert.equal(b.sceneSupports('skeleton','sarcomere','elementary'),false);
  assert.equal(b.sceneSupports('nervous','pupil','middle'),false);
  assert.equal(b.sceneSupports('nervous','pupil','high'),true);
  assert.equal(availability('body-availability','human-body/nervous/?school=elementary').redirect,
    'http://localhost/learning/inquiry/human-body/?school=elementary');
});
test('direct links respect 2022 astronomy topic boundaries', () => {
  const c = availability('space-availability','space/?school=elementary');
  const supports = c.window.SpaceAvailability.supports;
  for(const id of ['eclipses','star-properties','stellar-life','celestial-sphere'])assert.equal(supports(id,'elementary'),false);
  assert.equal(supports('eclipses','middle'),true);
  assert.equal(supports('stellar-life','middle'),false);
  assert.equal(supports('stellar-life','high'),true);
  assert.equal(availability('space-availability','space/earth-moon/?topic=eclipses&school=elementary').redirect,
    'http://localhost/learning/inquiry/space/?school=elementary');
});
const history = {window:{}};
for (const file of ['history-data','history-bronze','history-school','history-additions','history-atlas','history-questions','history-questions-modern']) {
  run(history, 'korea-map/data/' + file + '.js');
}
const {KOREA_HISTORY, KoreaHistorySchool, HistoryQuestions} = history.window;
test('every available history map has a distinct grade-specific explanation and objective item', () => {
  assert.equal(KOREA_HISTORY.scenes.length,37);
  const ids = new Set(), counts = {elementary:0,middle:0,high:0};
  for (const scene of KOREA_HISTORY.scenes) {
    const explanations = new Set();
    for (const level of Object.keys(counts)) {
      if (!KoreaHistorySchool.available(scene,level)) continue;
      const profile = KoreaHistorySchool.profile(scene,level);
      assert.ok(profile.paragraphs.every(p=>p && p.length>60),scene.id+':'+level);
      const signature = profile.paragraphs.join('\n');
      assert.ok(!explanations.has(signature),scene.id+' grade explanation repeated');
      explanations.add(signature);
      const questions = HistoryQuestions.forLevel(scene.id,level);
      assert.ok(questions.length,scene.id+':'+level+' missing questions');
      for(const q of questions) {
        assert.ok(!ids.has(q.id),q.id);ids.add(q.id);counts[level]++;
        assert.equal(new Set(q.options).size,4,q.id);
        assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,q.id);
        assert.ok(q.explanation.length>15,q.id);
      }
    }
  }
  assert.deepEqual(counts,{elementary:33,middle:37,high:37});
});
test('new atlas markers fit their geographic bounds; division line is latitude 38', () => {
  for(const id of ['prehistoric-sites','hanyang-capital','byeongja-war','liberation-division','democracy-movements']) {
    const s=KOREA_HISTORY.scenes.find(s=>s.id===id), [west,south,east,north]=s.bounds;
    assert.ok(s.marks.length>=3);
    for(const m of s.marks)assert.ok(m.xy[0]>=west&&m.xy[0]<=east&&m.xy[1]>=south&&m.xy[1]<=north,`${id}: ${m.label}`);
  }
  const division=KOREA_HISTORY.scenes.find(s=>s.id==='liberation-division');
  assert.ok(division.lines[0].coords.every(p=>p[1]===38));
});
