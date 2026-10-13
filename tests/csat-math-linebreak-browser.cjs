// 평가원·수능 기출의 모든 문항을 실제 화면(app.js)으로 띄워, 수식에 빈칸 없이 붙은 글(조사·문장부호·여는 괄호)이
// 수식과 다른 줄로 갈라진 곳과, 카드·쪽이 화면보다 넓어진 곳을 찾는다. 풀이는 접은 채로 한 번, 펼친 채로 한 번 본다.
// 실제 서버처럼 뒤로가기·효과음·exam-typography.css 태그를 끼워 글꼴까지 같게 한다(글꼴이 다르면 줄이 다르게 꺾인다).
//   node tests/csat-math-linebreak-browser.cjs                  320,360,390,560,1280px
//   node tests/csat-math-linebreak-browser.cjs 360,768          너비를 골라서
// 한 줄보다 넓어 app.js 가 풀어 둔 덩이(.math-glue.is-loose)에서 갈라진 것은 어쩔 수 없는 것으로 보고 목록만 보인다.
// 그 밖에 갈라진 곳이나 너비 넘침이 하나라도 있으면 종료 코드 1.
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { harness } = require('./learning-records-integration.cjs');

const ROOT = path.resolve(__dirname, '..');
const widths = (process.argv[2] || '320,360,390,560,1280').split(',').map(Number);

const serverSource = fs.readFileSync(path.join(ROOT, 'game-hub-server/server.js'), 'utf8');
const serverTag = (name) => serverSource.match(new RegExp('const ' + name + " = (['`])([\\s\\S]*?)\\1;?\\r?\\n"))[2];
const SITE_TAGS = [
  serverTag('SITE_BACK_SCRIPT_TAG').replace('${SITE_BACK_PENDING_TAG}', serverTag('SITE_BACK_PENDING_TAG')),
  serverTag('SITE_SFX_SCRIPT_TAG'),
  serverTag('SITE_EXAM_TYPOGRAPHY_TAG')
];

function measure() {
  const visible = (node) => { const aid = (node.nodeType === 1 ? node : node.parentElement).closest('.aid-body'); return !(aid && aid.hidden); };
  const name = (card) => card.querySelector('.item-src').textContent;
  const blocks = new WeakMap();
  const blockOf = (node) => {
    let el = node.parentElement;
    while (el && !blocks.has(el) && getComputedStyle(el).display.startsWith('inline')) el = el.parentElement;
    if (el && !blocks.has(el)) blocks.set(el, el);
    return el && blocks.get(el);
  };
  const charRect = (text, index) => { const range = document.createRange(); range.setStart(text, index); range.setEnd(text, index + 1); return range.getClientRects()[0]; };
  const list = document.getElementById('list');
  const cards = [...list.children];
  const split = [], past = [];
  let pairs = 0;
  for (const card of cards) {
    // 눈에 보이는 차례대로: 수식 밖의 글 마디와 수식(.katex) 덩이.
    const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode(node) {
        if (node.nodeType === 1) return node.classList.contains('katex') ? NodeFilter.FILTER_ACCEPT : node.closest('.katex') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
        return node.parentElement.closest('.katex') ? NodeFilter.FILTER_REJECT : node.data ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    const leaves = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) leaves.push(node);
    leaves.forEach((formula, i) => {
      if (formula.nodeType !== 1 || formula.closest('.katex-display') || !visible(formula)) return;
      const bases = formula.querySelectorAll('.katex-html .base');
      if (!bases.length) return;
      const first = bases[0].getBoundingClientRect(), last = bases[bases.length - 1].getBoundingClientRect();
      const loose = Boolean(formula.closest('.math-glue.is-loose'));
      const after = leaves[i + 1], before = leaves[i - 1];
      if (after && after.nodeType === 3 && !/^\s/.test(after.data) && blockOf(after) === blockOf(formula)) {
        pairs += 1;
        const rect = charRect(after, 0);
        if (rect && rect.left < last.left + 0.5 && rect.top - last.top > last.height / 2) split.push({ card: name(card), side: '뒤', text: after.data.slice(0, 8).trim(), loose });
      }
      if (before && before.nodeType === 3 && !/\s$/.test(before.data) && blockOf(before) === blockOf(formula)) {
        pairs += 1;
        const rect = charRect(before, before.length - 1);
        if (rect && first.left < rect.left + 0.5 && first.top - rect.top > rect.height / 2) split.push({ card: name(card), side: '앞', text: before.data.slice(-8).trim(), loose });
      }
    });
    // 카드(보기 안에서는 보기 단추) 테두리를 넘은 것. 옆으로 굴리는 상자 안은 굴리는 상자만 본다.
    const cardRect = card.getBoundingClientRect();
    for (const el of card.querySelectorAll('.base, .math-glue, .choice, img, .note-box, .proof-box, .katex-display, .note-box ul')) {
      if (!visible(el)) continue;
      const scroller = el.closest('.katex-display, .note-box ul');
      if (scroller && scroller !== el) continue;
      const rect = el.getBoundingClientRect();
      if (!rect.width) continue;
      const choice = el.closest('.choice');
      const box = choice && choice !== el ? choice.getBoundingClientRect() : cardRect;
      if (rect.right > box.right + 0.5 || rect.left < box.left - 0.5) past.push({ card: name(card), what: el.className, by: Math.round(Math.max(rect.right - box.right, box.left - rect.left) * 10) / 10 });
    }
  }
  const listWidth = list.getBoundingClientRect().width;
  return {
    cards: cards.length, pairs, split, past,
    wide: cards.filter((card) => card.getBoundingClientRect().width > listWidth + 0.5).map(name),
    page: document.documentElement.scrollWidth, screen: window.innerWidth
  };
}

(async () => {
  const h = await harness();
  let browser, failed = 0;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const context = await browser.newContext({ viewport: { width: widths[0], height: 900 }, extraHTTPHeaders: { 'x-test-user': '1' } });
    const page = await context.newPage();
    await page.route((url) => url.pathname.endsWith('/csat-math/'), async (route) => {
      const response = await route.fetch();
      let html = await response.text();
      for (const tag of SITE_TAGS) html = html.replace(/<\/head>/i, `  ${tag}\n</head>`);
      await route.fulfill({ response, body: html });
    });
    await page.goto(h.base + '/learning/literacy-numeracy/csat-math/');
    await page.waitForFunction(() => typeof window.renderMathInElement === 'function' && document.querySelector('#exam-select option[value="all"]'), null, { timeout: 30000 });
    await page.selectOption('#exam-select', 'all');
    for (;;) {
      await page.waitForFunction(() => document.querySelector('#list > .item') && !document.getElementById('btn-more').disabled, null, { timeout: 30000 });
      const shown = await page.evaluate(() => (document.getElementById('more-wrap').hidden ? -1 : document.querySelectorAll('#list > .item').length));
      if (shown < 0) break;
      await page.click('#btn-more');
      await page.waitForFunction((n) => document.querySelectorAll('#list > .item').length > n || document.getElementById('more-wrap').hidden, shown, { timeout: 30000 });
    }
    const settle = () => page.evaluate(async () => { await document.fonts.ready; await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const open of [false, true]) {
        // 풀이는 단추를 눌러 여닫는다. 숨은 풀이의 덩이 너비는 펼칠 때 재기 때문이다.
        await page.evaluate((open) => { for (const btn of document.querySelectorAll('#list .aid-btn')) if ((btn.getAttribute('aria-expanded') === 'true') !== open) btn.click(); }, open);
        await settle();
        const r = await page.evaluate(measure);
        const loose = r.split.filter((s) => s.loose), bad = r.split.filter((s) => !s.loose);
        const widthTrouble = r.wide.length + r.past.length + (r.page > r.screen ? 1 : 0);
        console.log(`${String(width).padStart(4)}px 풀이 ${open ? '펼침' : '접음'}: ${r.cards}문항, 수식에 붙은 글 ${r.pairs}곳 중 갈라진 곳 ${bad.length}, 한 줄보다 넓어 풀어 둔 곳 ${loose.length}, 목록보다 넓은 카드 ${r.wide.length}, 쪽 너비 ${r.page}/${r.screen}, 테두리를 넘은 것 ${r.past.length}`);
        for (const s of loose) console.log(`      풀어 둠  ${s.card} ⟨${s.text}⟩`);
        for (const s of bad) console.log(`      갈라짐(${s.side})  ${s.card} ⟨${s.text}⟩`);
        for (const p of r.past) console.log(`      넘침  ${p.card} ${p.what} ${p.by}px`);
        for (const c of r.wide) console.log(`      넓은 카드  ${c}`);
        failed += bad.length + widthTrouble;
      }
    }
  } finally {
    if (browser) await browser.close();
    await h.close();
  }
  console.log(failed ? `\n고칠 곳 ${failed}개.` : '\n갈라진 곳도 너비 넘침도 없습니다.');
  process.exit(failed ? 1 : 0);
})().catch((error) => { console.error(error); process.exit(2); });
