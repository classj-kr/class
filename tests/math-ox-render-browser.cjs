// 통합 수학 앱에서 기존 OX의 모든 물음·풀이를 그려 수식과 로컬 글꼴을 검사한다.
//   node tests/math-ox-render-browser.cjs               깨진 곳이나 바깥 요청이 하나라도 있으면 종료 코드 1
//   node tests/math-ox-render-browser.cjs --dump=파일    문항별로 그려진 HTML과 수식 크기를 적어 둔다(KaTeX 판을 바꿀 때 앞뒤를 견준다)
const path = require('node:path');
const fs = require('node:fs');
const vm = require('node:vm');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'learning/literacy-numeracy/math-ox');
const PAGE = '/learning/literacy-numeracy/math-bank/';
const C = require('../learning/literacy-numeracy/math-bank/concept-ox.js');
const dumpPath = (process.argv.find((a) => a.startsWith('--dump=')) || '').slice(7);

// 실제 서버(game-hub-server/server.js 의 sendSiteHtml)가 학습 쪽마다 끼워 넣는 것. 이것들이 부르는 것도 바깥으로 나가면 안 된다.
const SITE_TAGS = '<script data-site-back-navigation="true" src="/assets/site-back-navigation.js" defer></script>'
  + '<script data-class-game-sfx="true" src="/assets/sound/game-sfx.js" defer></script>'
  + '<link rel="stylesheet" href="/assets/exam-typography.css">';

const dataSource = fs.readFileSync(path.join(APP, 'data.js'), 'utf8');
const dataContext = { window: {} };
vm.runInNewContext(dataSource, dataContext);
const items = dataContext.window.MATH_OX_DATA;

const problems = [];
// 역슬래시를 하나만 쓰면 명령이 사라진다(\times 는 탭과 imes, \div 는 div). KaTeX 는 대개 오류 없이 글자로 그려 버리므로 원본에서 찾는다.
dataSource.split(/\r?\n/).forEach((line, i) => {
  for (const run of line.matchAll(/\\+/g)) {
    if (run[0].length % 2 && line[run.index + run[0].length] !== '"') problems.push(`data.js ${i + 1}째 줄: 역슬래시가 하나뿐임 ⟨${line.slice(run.index, run.index + 14)}⟩`);
  }
});

(async () => {
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  // 가짜 기록 서버: 어느 과목을 열든 그 과목 문항을 모두 O 로 답한 기록을 돌려준다(맞힌 것과 틀린 것이 섞인다).
  const sessions = new Map();
  app.get('/api/learning-records/context', (_req, res) => res.json({ mode: 'student', catalog: [] }));
  app.get('/api/learning-records/sessions', (_req, res) => res.json({ sessions: [], nextOffset: null }));
  app.post('/api/learning-records/sessions', (req, res) => {
    const { activity, contentKey, contentVersion, title, href } = req.body;
    const mine = items.filter((q) => q.subject === contentKey);
    const answered = Object.fromEntries(mine.map((q) => [q.id, { selectedChoice: q.answer, isCorrect: true, firstOk: true, revealed: true }]));
    const session = { id: 'sweep-' + sessions.size, activity, title, contentKey, contentVersion, href, status: 'active', revision: 0,
      checkpoint: { answered, unit: '단원 전체' }, progress: { current: mine.length, total: mine.length }, events: [],
      summary: { firstScored: 0, firstCorrect: 0, retryCount: 0, readCount: 0, selfAssessments: 0 } };
    sessions.set(session.id, session);
    res.json({ session });
  });
  app.post('/api/learning-records/sessions/:id/changes', (req, res) => {
    const session = sessions.get(req.params.id);
    if (!session) return res.status(404).json({ error: 'NOT_IN_TEST' });
    Object.assign(session, { checkpoint: req.body.checkpoint, progress: req.body.progress, revision: session.revision + 1 });
    res.json({ session });
  });
  app.use('/api', (_req, res) => res.status(404).json({ error: 'NOT_IN_TEST' }));
  app.get(PAGE, (_req, res) => res.type('html').send(fs.readFileSync(path.join(APP, '../math-bank/index.html'), 'utf8').replace('</head>', SITE_TAGS + '</head>')));
  app.use(express.static(ROOT));
  const server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;

  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const page = await browser.newPage();
    // 바깥 서버를 막고 그린다. 'https://**' 꼴의 글롭은 Playwright 1.63 에서 아무것도 막지 못해 정규식으로 쓴다.
    // 막든 못 막든 우리 서버 밖으로 나가려던 주소는 따로 모아 0건인지 본다.
    await page.route(/^https:\/\//, (route) => route.abort());
    const outside = new Set(), localFailures = new Set(), pageErrors = [];
    page.on('request', (request) => { const url = request.url(); if (!url.startsWith(base + '/') && !/^(data|blob|about):/.test(url)) outside.add(url); });
    page.on('response', (response) => { const url = response.url(); if (url.startsWith(base + '/') && response.status() >= 400 && !url.includes('/api/')) localFailures.add(response.status() + ' ' + url.slice(base.length)); });
    page.on('requestfailed', (request) => { const url = request.url(); if (url.startsWith(base + '/')) localFailures.add('실패 ' + url.slice(base.length)); });
    page.on('pageerror', (error) => pageErrors.push(String(error)));

    await page.goto(base + PAGE + '?unit=3-1-1');
    await page.locator('.mb-ox-start').waitFor();
    const subjects = [...new Set(items.map(q => q.subject))];
    let katexVersion;

    const drawn = {};
    let formulas = 0;
    for (const unitId of [...new Set(C.links.map(link => link[2]))]) {
      const subject = C.linksFor(unitId)[0][0];
      const term = C.findUnit(unitId)?.oxCourse || unitId.split('-').slice(0,2).join('-');
      if (await page.locator('#termSelect').inputValue() !== term) { await page.selectOption('#termSelect', term); await page.waitForFunction(() => !document.getElementById('main').inert); }
      await page.selectOption('#unitSelect', unitId); await page.waitForFunction(() => !document.getElementById('main').inert);
      await page.locator('.mb-ox-start').click();
      await page.waitForFunction(expected => !document.getElementById('main').inert && document.querySelectorAll('.mb-ox-item').length === expected, C.idsFor(unitId).length);
      katexVersion = await page.evaluate(() => window.katex?.version);
      if (!katexVersion) problems.push('KaTeX가 뜨지 않았습니다.');
      await page.evaluate(() => document.fonts.ready);
      const cards = await page.evaluate(() => [...document.querySelectorAll('.mb-ox-item')].map((card) => {
        const issues = [], fields = {}, boxes = [];
        for (const [name, selector] of [['prompt', '.mb-ox-prompt'], ['reason', '.mb-ox-reason']]) {
          const el = card.querySelector(selector);
          if (!el) { issues.push(name + ': 화면에 없음'); continue; }
          fields[name] = el.innerHTML;
          for (const e of el.querySelectorAll('.katex-error')) issues.push(name + ': KaTeX 오류 ' + (e.getAttribute('title') || '').slice(0, 120) + ' ⟨' + e.textContent.slice(0, 80) + '⟩');
          // 수식 밖에 남은 TeX 조각: 구분자($, \( \[), \명령, ^{ _{
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.parentElement.closest('.katex, .katex-error') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
          let text = '';
          for (let n = walker.nextNode(); n; n = walker.nextNode()) text += n.nodeValue + ' ';
          const leak = text.match(/\$|\\[()[\]]|\\[a-zA-Z]{2,}|[\^_]\{/);
          if (leak) issues.push(name + ': 수식 밖에 TeX 가 보임 ⟨' + text.slice(Math.max(0, leak.index - 30), leak.index + 40).trim() + '⟩');
          // 글은 innerHTML 로 그대로 들어가므로 마크다운 강조 표시는 별표째 찍힌다.
          const stars = text.indexOf('**');
          if (stars !== -1) issues.push(name + ': 별표(**)가 글자로 보임 ⟨' + text.slice(Math.max(0, stars - 20), stars + 30).trim() + '⟩');
          for (const k of el.querySelectorAll('.katex')) { const r = k.getBoundingClientRect(); boxes.push([Math.round(r.width * 100) / 100, Math.round(r.height * 100) / 100]); }
        }
        return { id: Number(card.dataset.questionId), issues, fields, boxes };
      }));
      for (const card of cards) {
        if (drawn[card.id]) card.issues.push('같은 문항이 두 번 그려짐');
        drawn[card.id] = { subject, fields: card.fields, boxes: card.boxes };
        formulas += card.boxes.length;
        if (card.issues.length) problems.push(`${subject} ${card.id}번\n  ` + card.issues.join('\n  '));
      }
      await page.evaluate(() => window.dispatchEvent(new CustomEvent('sitebackrequest', { bubbles: true, cancelable: true })));
      await page.locator('.mb-ox-start').waitFor();
    }
    for (const q of items) if (!drawn[q.id]) problems.push(`${q.subject} ${q.id}번: 어느 과목 탭에서도 그려지지 않음`);

    const fonts = await page.evaluate(() => [...document.fonts].filter((f) => /KaTeX/.test(f.family)).map((f) => [f.family.replace(/["']/g, '') + ' ' + f.weight + ' ' + f.style, f.status]));
    const loaded = fonts.filter(([, status]) => status === 'loaded').map(([name]) => name);
    for (const [name, status] of fonts) if (status === 'error') problems.push('글꼴을 받지 못함: ' + name);
    if (formulas && !loaded.length) problems.push('KaTeX 글꼴이 하나도 뜨지 않았습니다.');
    for (const url of outside) problems.push('바깥으로 나간 요청: ' + url);
    for (const line of localFailures) problems.push('우리 서버에서 받지 못함: ' + line);
    for (const line of pageErrors) problems.push('스크립트 오류: ' + line);

    if (dumpPath) fs.writeFileSync(dumpPath, JSON.stringify({ katexVersion, fonts: loaded.sort(), items: drawn }));
    for (const line of problems) console.log('\n' + line);
    console.log(`\nKaTeX ${katexVersion || '없음'} · ${subjects.length}과목 ${Object.keys(drawn).length}문항(자료 ${items.length}개), 수식 ${formulas}개를 그려 보았습니다. 걸린 곳 ${problems.length}개, 바깥으로 나간 요청 ${outside.size}건. 뜬 KaTeX 글꼴 ${loaded.length}개.`);
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
  process.exit(problems.length ? 1 : 0);
})().catch((error) => { console.error(error); process.exit(2); });
