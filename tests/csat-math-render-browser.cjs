// 평가원·수능 기출의 모든 문항을 진짜 브라우저에서 화면과 같은 차례로 그려, 수식이 깨진 곳을 찾는다.
// tools/check-math.mjs 는 글을 KaTeX에 넣어 보기만 하므로, 브라우저가 HTML로 읽으며 생기는 일(태그로 먹히는 <,
// 수식 밖으로 새는 \명령)과 auto-render 의 실제 동작은 여기서 본다. 풀이(help)도 펼쳐서 함께 본다.
//   node tests/csat-math-render-browser.cjs            깨진 곳이 하나라도 있으면 종료 코드 1
//   node tests/csat-math-render-browser.cjs 2025-09    한 회차만
const path = require('node:path');
const fs = require('node:fs');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'learning/literacy-numeracy/csat-math');
const only = process.argv[2];

(async () => {
  const app = express();
  app.use('/api', (_req, res) => res.status(404).json({ error: 'NOT_IN_TEST' }));
  app.use(express.static(ROOT));
  const server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const exams = fs.readdirSync(path.join(APP, 'data/exams')).filter((f) => f.endsWith('.js')).map((f) => f.replace(/\.js$/, '')).filter((e) => !only || e === only).sort();
  let browser;
  let broken = 0, total = 0;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const page = await browser.newPage();
    await page.goto(base + '/learning/literacy-numeracy/csat-math/');
    await page.waitForFunction(() => typeof window.renderMathInElement === 'function', null, { timeout: 30000 });
    for (const exam of exams) {
      const report = await page.evaluate(async (exam) => {
        await new Promise((resolve) => { const s = document.createElement('script'); s.src = 'data/exams/' + exam + '.js?sweep=' + Date.now(); s.onload = resolve; s.onerror = resolve; document.head.appendChild(s); });
        const part = (window.CSAT_MATH_PART || {})[exam] || [];
        const CIRCLED = ['①', '②', '③', '④', '⑤'];
        const out = [];
        for (const p of part) {
          // app.js buildCard 와 같은 자리에 같은 방법(innerHTML)으로 넣는다. 풀이는 펼친 채로.
          const fields = [];
          const add = (name, html) => { const el = document.createElement('div'); el.innerHTML = html; fields.push([name, el]); };
          add('body', '<p>' + p.body + '</p>');
          (p.note || []).forEach((line, i) => add('note[' + i + ']', '<li>' + line + '</li>'));
          if (p.bodyAfter) add('bodyAfter', p.bodyAfter);
          (p.choices || []).forEach((c, i) => add('choices[' + i + ']', '<span>' + CIRCLED[i] + '</span><span>' + c + '</span>'));
          if (p.help) add('help', p.help);
          const issues = [];
          for (const [name, el] of fields) {
            document.body.appendChild(el);
            window.renderMathInElement(el, {
              delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }],
              preProcess: (math) => (/\\(int|iint|iiint|oint|sum|prod|lim|bigcap|bigcup)(?![a-zA-Z])/.test(math) && !math.includes('\\displaystyle') && !math.includes('\\textstyle')) ? '\\displaystyle ' + math : math,
              throwOnError: false
            });
            for (const e of el.querySelectorAll('.katex-error')) issues.push(name + ': KaTeX 오류 ' + (e.getAttribute('title') || '').slice(0, 120) + ' ⟨' + e.textContent.slice(0, 80) + '⟩');
            // 수식 밖에 남은 TeX 조각: 구분자, \명령, ^{ _{
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.parentElement.closest('.katex, .katex-error') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
            let text = '';
            for (let n = walker.nextNode(); n; n = walker.nextNode()) text += n.nodeValue + ' ';
            const leak = text.match(/\\[()[\]]|\\[a-zA-Z]{2,}|[\^_]\{/);
            if (leak) issues.push(name + ': 수식 밖에 TeX 가 보임 ⟨' + text.slice(Math.max(0, leak.index - 30), leak.index + 40).trim() + '⟩');
            el.remove();
          }
          if (p.figure) {
            const ok = await fetch('assets/figures/' + p.figure, { method: 'HEAD' }).then((r) => r.ok, () => false);
            if (!ok) issues.push('figure: 그림 파일이 없음 ' + p.figure);
          }
          out.push({ id: p.id, issues });
        }
        return out;
      }, exam);
      for (const r of report) {
        total += 1;
        if (!r.issues.length) continue;
        broken += 1;
        console.log('\n' + r.id);
        for (const line of r.issues) console.log('  ' + line);
      }
    }
    console.log(`\n${exams.length}회차 ${total}문항을 그려 보았습니다. 깨진 문항 ${broken}개.`);
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
  process.exit(broken ? 1 : 0);
})().catch((error) => { console.error(error); process.exit(2); });
