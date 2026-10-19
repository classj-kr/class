// 「수학 문제」의 모든 회차를 휴대폰 너비(360px)에서 열어, 문항마다 일부러 틀린 답을 넣고 풀이(item.explain)를 펼친 뒤
// 가로로 넘치는 것이 없는지 본다. tests/math-bank-browser.cjs 는 답하기 전의 화면만 재므로, 틀려야 보이는 풀이의 긴 식
// (줄이 갈리지 않는 nb(…) 덩이)이 카드를 넓히는 것은 여기서 잡는다.
// 실제 서버(game-hub-server/server.js 의 sendSiteHtml)가 학습 쪽에 끼우는 태그(뒤로가기·효과음·공용 읽기 글꼴 exam-typography.css)를 똑같이 끼운다.
// 읽기 글꼴은 풀이를 바탕체로 바꾸어 글 너비가 달라진다.
//   node tests/math-bank-explain-browser.cjs                  모든 단원(수십 분). 넘치는 문항이 있으면 목록을 적고 종료 코드 1
//   UNITS=10-1-4 node tests/math-bank-explain-browser.cjs     단원 몇 개만(쉼표로 여럿, 10-1 처럼 학기만 적으면 그 학기 전부)
//   JOBS=4  한꺼번에 여는 쪽 수(기본 4)
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { harness } = require('./learning-records-integration.cjs');

const URL_PATH = '/learning/literacy-numeracy/math-bank/';
const VIEWPORT = { width: 360, height: 760 };
const WANT = (process.env.UNITS || '').split(',').map((s) => s.trim()).filter(Boolean);
const JOBS = Math.max(1, Number(process.env.JOBS) || 4);

// server.js 의 태그 상수를 그대로 읽어 끼운다(판 번호가 바뀌어도 따라간다).
const serverSource = fs.readFileSync(path.resolve(__dirname, '../game-hub-server/server.js'), 'utf8');
const from = serverSource.indexOf('const SITE_BACK_PENDING_TAG'), upto = serverSource.indexOf('\n', serverSource.indexOf('const SITE_EXAM_TYPOGRAPHY_TAG'));
if (from < 0 || upto < from) throw new Error('server.js 에서 SITE_*_TAG 상수를 찾지 못했습니다');
const TAGS = vm.runInNewContext(serverSource.slice(from, upto) + '\n;[SITE_BACK_SCRIPT_TAG, SITE_SFX_SCRIPT_TAG, SITE_EXAM_TYPOGRAPHY_TAG]');
const withSiteTags = (html) => TAGS.reduce((out, tag) => out.replace(/<\/head>/i, `  ${tag}\n</head>`), html);

// 한 회차의 문항마다 틀린 답을 화면의 답 칸으로 넣고(고르기 단추·수 칸·부호 단추·식 속 빈칸·부등호 칸·분수 칸), 채점이 끝나기를 기다린다.
// 틀린 답은 맞는 답에서 한 칸만 바꾸어 만들고, 엔진의 채점(B.isCorrect)으로 정말 틀린지 먼저 본다.
async function answerWrong({ unitId, groupId, level, no }) {
  const B = window.MathBank, main = document.getElementById('main');
  const byKey = new Map(B.makeRound(B.findUnit(unitId), groupId, level, no).map((item) => [item.key, item]));
  const notWrong = [];
  const settle = (card) => new Promise((resolve, reject) => {
    const t0 = performance.now();
    const tick = () => {
      if (!main.inert && card.matches('.is-right, .is-wrong')) resolve();
      else if (performance.now() - t0 > 10000) reject(new Error('채점이 끝나지 않음: ' + card.dataset.key));
      else setTimeout(tick, 4);
    };
    tick();
  });
  const RELS = ['<', '<=', '>', '>='];
  for (const card of document.querySelectorAll('.mb-item')) {
    const item = byKey.get(card.dataset.key);
    if (!item) throw new Error('엔진에 없는 문항: ' + card.dataset.key);
    if (item.choice) {
      const buttons = card.querySelectorAll('.mb-choice');
      buttons[(item.choice.answer + 1) % buttons.length].click();
    } else {
      // 맞는 답(부호는 따로): 부호 단추는 칸마다(signed) 또는 분수의 첫 칸(값 전체의 부호)에 붙는다.
      const signedAt = (i) => Boolean(item.inputs[i].signed) || (Boolean(item.signed) && i === 0);
      const right = item.inputs.map((input, i) => {
        if (input.rel) return { sign: '', text: input.answer };
        const negative = item.fraction && item.signed ? i === 0 && item.negative : signedAt(i) && input.answer < 0;
        return { sign: negative ? '-' : '', text: String(Math.abs(input.answer)) };
      });
      const asResponse = (list) => list.map((v) => v.sign + v.text);
      let wrong = null;
      const k = item.inputs.findIndex((input) => !input.rel);
      if (k >= 0) {
        for (const delta of [1, -1, 2, 10, 100]) {
          const value = Math.round((Math.abs(item.inputs[k].answer) + delta) * 1000) / 1000;
          if (value < 0) continue;
          const list = right.map((v, i) => (i === k ? { sign: v.sign, text: String(value) } : v));
          if (!B.isCorrect(item, asResponse(list))) { wrong = list; break; }
        }
      } else {
        const other = RELS.find((rel) => rel !== item.inputs[0].answer);
        wrong = right.map((v, i) => (i === 0 ? { sign: '', text: other } : v));
      }
      if (!wrong) { notWrong.push(card.dataset.key); wrong = right; }
      const form = card.querySelector('form.mb-answer');
      for (const box of form.querySelectorAll('input, select.mb-rel')) {
        const want = wrong[Number(box.dataset.at)];
        box.value = want.text;
        box.dispatchEvent(new Event(box.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
        if (box.dataset.signed) {
          const button = box._sign;
          if (!button) throw new Error('부호 단추가 없는 부호 칸: ' + card.dataset.key);
          if ((button.dataset.sign === '−') !== (want.sign === '-')) button.click();
        }
      }
      form.querySelector('.mb-primary').click();
      await settle(card);
      // 채점한 뒤 앱은 받은 답을 칸과 부호 단추에 다시 그린다. 넣으려던 답과 같아야 칸을 제대로 다룬 것이다.
      for (const box of form.querySelectorAll('input, select.mb-rel')) {
        const want = wrong[Number(box.dataset.at)];
        if (box.value !== want.text || (box.dataset.signed && box._sign.dataset.sign !== (want.sign ? '−' : '+'))) throw new Error('답 칸에 넣은 것이 앱에 그대로 가지 않음: ' + card.dataset.key);
      }
    }
    await settle(card);
    if (!card.classList.contains('is-wrong')) notWrong.push(card.dataset.key);
    else if (item.explain && !card.querySelector('.mb-result:not([hidden])')) throw new Error('풀이가 펼쳐지지 않음: ' + card.dataset.key);
  }
  return notWrong;
}

// 넘침 재기. 문항 목록은 격자(grid)라 한 카드의 줄이 갈리지 않는 덩이가 격자 칸을 넓히면 모든 카드가 함께 넓어진다.
// 그래서 쪽 전체의 넘침은 실제 배치로 재고, 어느 문항이 넓혔는지는 목록을 블록 배치로 바꾸어(카드 너비가 화면에 묶인다) 카드마다 잰다.
async function measure() {
  await document.fonts.ready;
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const root = document.documentElement, viewport = root.clientWidth;
  const page = root.scrollWidth - viewport;
  const cardRight = Math.max(0, ...[...document.querySelectorAll('.mb-item')].map((card) => card.getBoundingClientRect().right)) - viewport;
  document.querySelector('.mb-items').style.display = 'block';
  const clipped = (el) => /^(auto|scroll|hidden|clip)$/.test(getComputedStyle(el).overflowX);
  const items = [];
  for (const card of document.querySelectorAll('.mb-item')) {
    const style = getComputedStyle(card), box = card.getBoundingClientRect();
    const limit = Math.min(viewport, box.right - parseFloat(style.borderRightWidth) - parseFloat(style.paddingRight));
    const over = card.scrollWidth - card.clientWidth;
    // 카드의 글 자리(안쪽 여백 안) 오른쪽 끝을 넘어선 상자 가운데 가장 바깥 것을 범인으로 적는다(풀이의 nb 덩이라면 그 덩이).
    // 상자는 제자리인데 속의 글만 넘치는 것(줄이 갈리지 않는 문단)은 scrollWidth 로 잡는다. 가로 스크롤 상자(표 감싸개) 안은 잘려 보이므로 건너뛴다.
    const culprits = [];
    const walk = (node) => {
      for (const el of node.children) {
        if (el.matches('.mb-sr, input, select, textarea')) continue;
        const r = el.getBoundingClientRect();
        if (r.right > limit + 1) { culprits.push({ el, right: r.right }); continue; }
        if (clipped(el)) continue;
        const before = culprits.length;
        walk(el);
        const inner = r.left + el.clientLeft + el.scrollWidth;
        if (culprits.length === before && el.clientWidth > 0 && inner > limit + 1) culprits.push({ el, right: inner });
      }
    };
    walk(card);
    if (over <= 1 && culprits.length === 0) continue;
    items.push({
      key: card.dataset.key, over: Math.max(over, ...culprits.map((c) => Math.round(c.right - limit))),
      where: culprits.map(({ el }) => (el.closest('.mb-result') ? '풀이' : el.closest('.mb-choices') ? '보기' : el.closest('.mb-answer') ? '답 칸' : el.closest('.mb-figure') ? '그림' : '물음')
        + ' «' + el.textContent.replace(/\s+/g, ' ').trim().slice(0, 70) + '»').slice(0, 2)
    });
  }
  return { page, cardRight: Math.round(cardRight), items };
}

(async () => {
  const h = await harness();
  const browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
  const problems = [], errors = [];
  let rounds = 0, answered = 0;
  const open = async () => {
    const context = await browser.newContext({ viewport: VIEWPORT });
    // 바깥 주소는 모두 막는다. Playwright 1.63 에서 'https://**' 글롭은 아무것도 막지 못하므로 정규식으로 적는다.
    await context.route(/^https?:\/\/(?!127\.0\.0\.1[:/])/, (route) => route.abort());
    await context.route((url) => url.pathname === URL_PATH || url.pathname === URL_PATH + 'index.html', async (route) => {
      const response = await route.fetch();
      const headers = Object.fromEntries(Object.entries(response.headers()).filter(([name]) => !/^(content-length|etag|last-modified)$/i.test(name)));
      await route.fulfill({ response, body: withSiteTags(await response.text()), headers: { ...headers, 'content-type': 'text/html; charset=utf-8' } });
    });
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('dialog', (d) => d.accept());
    await page.goto(h.base + URL_PATH);
    await page.locator('.mb-group').first().waitFor();
    return { context, page };
  };

  try {
    const first = await open();
    const all = await first.page.evaluate(() => window.MathBank.lazy.ids());
    const unitIds = WANT.length ? all.filter((id) => WANT.some((w) => id === w || id.startsWith(w + '-'))) : all;
    if (unitIds.length === 0) throw new Error('UNITS 에 맞는 단원이 없습니다: ' + WANT.join(', '));
    // 끼운 읽기 글꼴이 실제로 풀이에 걸리는지 먼저 본다.
    const linked = await first.page.evaluate(() => [...document.styleSheets].some((s) => /\/assets\/exam-typography\.css/.test(s.href || '')));
    if (!linked) throw new Error('exam-typography.css 가 붙지 않았습니다');

    const queue = unitIds.slice();
    const worker = async (view) => {
      const { page } = view;
      for (let unitId = queue.shift(); unitId; unitId = queue.shift()) {
        const term = unitId.split('-').slice(0, 2).join('-');
        await page.selectOption('#termSelect', term);
        await page.selectOption('#unitSelect', unitId);
        await page.waitForFunction((id) => new URL(location.href).searchParams.get('unit') === id && document.querySelectorAll('.mb-group').length > 0, unitId);
        const groups = await page.evaluate((unitId) => {
          const B = window.MathBank, unit = B.findUnit(unitId);
          return unit.groups.map((group) => ({ id: group.id, rounds: B.LEVELS.flatMap((level) => Array.from({ length: B.roundCount(unit, group.id, level) }, (_, i) => ({ level, no: i + 1 }))) }));
        }, unitId);
        let unitProblems = 0;
        for (let gi = 0; gi < groups.length; gi += 1) {
          for (let li = 0; li < groups[gi].rounds.length; li += 1) {
            const { level, no } = groups[gi].rounds[li];
            const tag = `${unitId} ${groups[gi].id} ${level} ${no}회`;
            await page.locator('.mb-group').nth(gi).locator('.mb-level').nth(li).click();
            await page.locator('.mb-item').first().waitFor();
            const notWrong = await page.evaluate(answerWrong, { unitId, groupId: groups[gi].id, level, no });
            await page.locator('#finish:not([hidden])').waitFor();
            const fontOk = await page.evaluate(() => /Class Exam Batang/.test(getComputedStyle(document.querySelector('.mb-result')).fontFamily));
            if (!fontOk) throw new Error('풀이에 읽기 글꼴이 걸리지 않았습니다: ' + tag);
            const report = await page.evaluate(measure);
            rounds += 1; answered += await page.locator('.mb-item').count();
            for (const key of notWrong) problems.push(`${tag} ${key}: 틀린 답을 만들지 못함`);
            for (const item of report.items) { problems.push(`${tag} ${item.key}: ${item.over}px 넘침 — ${item.where.join(' / ') || '(카드 안 넘침)'}`); unitProblems += 1; }
            if ((report.page > 0 || report.cardRight > 1) && report.items.length === 0) { problems.push(`${tag}: 쪽이 ${Math.max(report.page, report.cardRight)}px 넓어졌는데 범인 문항을 찾지 못함`); unitProblems += 1; }
            await page.evaluate(() => window.dispatchEvent(new CustomEvent('sitebackrequest', { bubbles: true, cancelable: true })));
            await page.locator('.mb-group').first().waitFor();
          }
        }
        console.log(`${unitId}: ${groups.reduce((n, g) => n + g.rounds.length, 0)}회차${unitProblems ? ` — 넘침 ${unitProblems}` : ''}`);
      }
    };
    const views = [first];
    for (let i = 1; i < Math.min(JOBS, unitIds.length); i += 1) views.push(await open());
    await Promise.all(views.map(worker));
    problems.sort();
    for (const line of problems) console.log(line);
    console.log(JSON.stringify({ ok: problems.length === 0 && errors.length === 0, units: unitIds.length, rounds, items: answered, problems: problems.length, errors }));
    if (problems.length || errors.length) process.exitCode = 1;
  } finally {
    await browser.close();
    await h.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
