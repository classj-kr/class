'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../learning/literacy-numeracy/story-books');
let count = 0;
for (const activity of ['korea-tales', 'world-tales', 'world-novels']) {
  for (const key of fs.readdirSync(path.join(root, activity))) {
    const file = path.join(root, activity, key, 'app.js');
    if (!fs.existsSync(file)) continue;
    let source = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    const marker = source.indexOf('/* Common account-based book progress and response history. */');
    if (marker >= 0) source = source.slice(0, marker);
    for (const token of ['function paint(', 'function goTo(index)', 'function initQuiz()', 'QUIZ_ORDER', 'QUIZ_WRONG']) {
      if (!source.includes(token)) throw new Error(`Unsupported book ${file}: ${token}`);
    }
    const picked = source.includes('const QUIZ_PICKED');
    const pickedMap = source.includes('const QUIZ_PICKED = {}');
    source = source.replace(/^const LANG_KEY = .*\n/m, '')
      .replace(/^const readLang = .*\n/m, '').replace(/^const saveLang = .*\n/m, '')
      .replace(/let LANG = \(HAS_EN && readLang\(\) === 'en'\) \? 'en' : 'ko';/, "let LANG = 'ko';")
      .replace(/^\s*saveLang\(LANG\);\n/m, '\n');
    if (source.includes('localStorage')) throw new Error('Unconverted device storage: ' + file);
    if (!source.includes('let LANG')) source += "\nlet LANG = 'ko'; const HAS_EN = false; const langBtn = null; const QZ = () => QUIZ; function applyLang() {}\n";
    source += `
/* Common account-based book progress and response history. */
{
  let hooks = null;
  const visited = new Set();
  const originalPaint = paint;
  const originalGoTo = goTo;
  function locationRecord() {
    const p = PAGES[current];
    return { kind: p.kind, chapter: p.chIndex ?? null, offset: p.left?.[0] ?? p.left?.a ?? 0, art: p.beat?.art || null, part: p.part ?? null, index: current };
  }
  function pageKey() {
    const p = locationRecord();
    return [LANG, p.kind, p.chapter, p.offset, p.art, p.part].join(':');
  }
  function snapshot() {
    return { lang: LANG, location: locationRecord(), visited: [...visited],
      orders: QUIZ_ORDER, picked: ${picked ? 'QUIZ_PICKED' : 'QUIZ_DONE'},
      wrong: ${pickedMap ? 'Object.fromEntries(Object.entries(QUIZ_WRONG).map(([key, set]) => [key, [...set]]))' : picked ? 'QUIZ_WRONG.map(set => [...set])' : 'QUIZ_WRONG'} };
  }
  function lock(value) { document.getElementById('book').inert = value; if (langBtn) langBtn.disabled = value; }
  goTo = function (index) { if (hooks?.canAct()) originalGoTo(index); };
  paint = function () {
    originalPaint();
    if (!hooks) return;
    const p = PAGES[current], key = pageKey();
    let event;
    if (['chapter', 'spread'].includes(p.kind) && !visited.has(key)) {
      visited.add(key);
      event = { kind: 'read', questionKey: key, response: '페이지 열기', snapshot: { title: document.title, language: LANG, location: locationRecord() } };
    }
    hooks.changed(event);
  };
  initQuiz = function () {
    spreadEl.querySelectorAll('.quiz-item').forEach(item => {
      const qi = Number(item.dataset.qindex), q = QZ()[qi];
      item.querySelectorAll('.quiz-choice').forEach(button => button.addEventListener('click', async () => {
        if (!hooks?.canAct() || item.classList.contains('graded')) return;
        const chosen = Number(button.dataset.choice), correct = chosen === q.answer;
        ${pickedMap ? "if (correct) QUIZ_PICKED[QK(qi)] = chosen; else wrongOf(qi).add(chosen);" : picked ? "if (correct) QUIZ_PICKED[qi] = chosen; else QUIZ_WRONG[qi].add(chosen);" : "if (correct) QUIZ_DONE[QK(qi)] = true; else { const wrong = QUIZ_WRONG[QK(qi)] || (QUIZ_WRONG[QK(qi)] = []); if (!wrong.includes(chosen)) wrong.push(chosen); }"}
        await hooks.answer({ kind: 'answer', questionKey: LANG + ':' + qi, response: q.choices[chosen], correct,
          snapshot: { prompt: q.q, choices: q.choices, language: LANG } });
      }));
    });
  };
  connectBookRecords({
    activity: '${activity}', key: '${key}', title: document.title, snapshot, lock,
    restore(cp) {
      LANG = cp.lang === 'en' && HAS_EN ? 'en' : 'ko';
      ${pickedMap ? "Object.assign(QUIZ_PICKED, cp.picked); Object.assign(QUIZ_WRONG, Object.fromEntries(Object.entries(cp.wrong).map(([key, values]) => [key, new Set(values)]))); Object.assign(QUIZ_ORDER, cp.orders);" : picked ? "QUIZ_PICKED.splice(0, QUIZ_PICKED.length, ...cp.picked); cp.wrong.forEach((values, i) => { QUIZ_WRONG[i].clear(); values.forEach(v => QUIZ_WRONG[i].add(v)); }); QUIZ_ORDER.splice(0, QUIZ_ORDER.length, ...cp.orders);" : "Object.assign(QUIZ_DONE, cp.picked); Object.assign(QUIZ_WRONG, cp.wrong); Object.assign(QUIZ_ORDER, cp.orders);"}
      cp.visited.forEach(key => visited.add(key));
      if (typeof applyLang === 'function') applyLang(); ${source.includes('function rebuildPages()') ? 'rebuildPages();' : 'buildPages();'}
      const loc = cp.location;
      const index = PAGES.findIndex(p => p.kind === loc.kind &&
        (loc.art ? p.beat?.art === loc.art : loc.chapter != null ? p.chIndex === loc.chapter && (p.left?.[0] ?? p.left?.a ?? 0) <= loc.offset && (p.right?.[1] ?? p.right?.b ?? p.left?.[1] ?? p.left?.b ?? Infinity) > loc.offset : (p.part ?? null) === loc.part));
      current = index >= 0 ? index : Math.min(loc.index || 0, PAGES.length - 1);
      originalPaint();
    },
    repaint: originalPaint,
    connect(value) { hooks = value; originalPaint(); }
  });
}
`;
    fs.writeFileSync(file, source);
    const htmlFile = path.join(root, activity, key, 'index.html');
    let html = fs.readFileSync(htmlFile, 'utf8');
    if (!html.includes('/assets/learning-book.js')) html = html.replace(/<script src="app\.js[^"\n]*"><\/script>/, '<script src="/assets/learning-records.js?v=20261001-1"></script>\n    <script src="/assets/learning-book.js?v=20261002-1"></script>\n    <script src="app.js?v=20261002-common-records"></script>');
    fs.writeFileSync(htmlFile, html); count++;
  }
}
console.log(`Connected ${count} book readers.`);
