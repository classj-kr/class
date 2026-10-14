// 「수학 문제」 맨 위 드롭다운과 「평가원·수능 기출」 화면이 서로 이어지는지 실제 브라우저로 본다.
// 첫 화면 메뉴에는 「수학 문제」만 있고, 기출은 드롭다운 맨 밑 항목으로 들어간다.
//   node tests/math-bank-menu.cjs          통과하면 {"ok":true}
//   node tests/math-bank-menu.cjs --shots  outputs/math-bank-review 에 두 화면을 무손실 WebP로 남긴다
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { harness } = require('./learning-records-integration.cjs');

const SHOTS = process.argv.includes('--shots');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'outputs/math-bank-review');
const TO_WEBP = "import io,sys;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert('RGBA');im.save(sys.argv[1],format='WEBP',lossless=True);out=Image.open(sys.argv[1]).convert('RGBA');assert im.size==out.size and im.tobytes()==out.tobytes()";
const BANK = '/learning/literacy-numeracy/math-bank/', PAST = '/learning/literacy-numeracy/csat-math/';
const PAST_LABEL = '평가원·수능 기출';

(async () => {
  // 첫 화면 메뉴: 기출로 바로 가는 항목은 없고, 수리 묶음의 공개 범위에는 기출 경로가 그대로 들어 있다(수학 문제와 함께 열리고 닫힌다).
  const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.equal(/<a[^>]*href="learning\/literacy-numeracy\/csat-math\/"/.test(home), false, '첫 화면 메뉴에 기출 항목이 남아 있다');
  assert.match(home, /<a[^>]*href="learning\/literacy-numeracy\/math-bank\/"/);
  assert.match(home, /data-content-paths="[^"]*learning\/literacy-numeracy\/math-bank\/[^"]*learning\/literacy-numeracy\/csat-math\/[^"]*"/);

  const h = await harness();
  const browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
  const errors = [];
  if (SHOTS) fs.mkdirSync(OUT, { recursive: true });
  const snap = async (page, name) => {
    if (!SHOTS) return;
    const result = spawnSync(process.env.PYTHON || 'python', ['-c', TO_WEBP, path.join(OUT, `menu-${name}.webp`)], { input: await page.screenshot() });
    assert.equal(result.status, 0, 'WebP 저장 실패: ' + String(result.stderr));
  };
  try {
    for (const [name, viewport] of [['wide', { width: 1280, height: 800 }], ['phone', { width: 360, height: 760 }]]) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('dialog', (d) => d.accept());

      // 수학 문제: 드롭다운은 학기들 다음, 맨 밑이 기출이다.
      await page.goto(h.base + BANK);
      await page.locator('.mb-group').first().waitFor();
      const labels = await page.locator('#termSelect option').allInnerTexts();
      assert.equal(labels[0], '초 1학년 1학기');
      assert.equal(labels[labels.length - 1], PAST_LABEL);
      assert.ok(labels.slice(0, -1).every((text) => /^(초|중) \d학년 [12]학기$/.test(text)), labels.join(', '));
      await snap(page, name + '-bank-groups');
      await page.locator('.mb-group').first().locator('.mb-level').first().click();
      await page.locator('.mb-item').first().waitFor();
      await snap(page, name + '-bank-round');
      await page.evaluate(() => window.dispatchEvent(new CustomEvent('sitebackrequest', { bubbles: true, cancelable: true })));
      await page.locator('.mb-group').first().waitFor();

      // 맨 밑 항목을 고르면 기출 화면으로 간다. 그 화면에도 같은 드롭다운이 있고 기출이 골라져 있다.
      await Promise.all([page.waitForURL('**' + PAST), page.selectOption('#termSelect', { label: PAST_LABEL })]);
      await page.locator('#term-select').waitFor();
      assert.deepEqual(await page.locator('#term-select option').allInnerTexts(), labels, '두 화면의 드롭다운 항목이 같다');
      assert.equal(await page.locator('#term-select option:checked').innerText(), PAST_LABEL);
      await page.locator('#subject-tabs .subject-tab').first().waitFor();
      await snap(page, name + '-past');

      // 뒤로 돌아오면 수학 문제의 드롭다운은 풀던 학기에 그대로 있다.
      await page.goBack();
      await page.locator('.mb-group').first().waitFor();
      assert.equal(await page.locator('#termSelect option:checked').innerText(), '초 1학년 1학기');

      // 기출 화면에서 학기를 고르면 수학 문제의 그 학기 첫 단원이 열린다.
      await page.goto(h.base + PAST);
      await page.locator('#term-select').waitFor();
      const last = labels[labels.length - 2];
      await Promise.all([page.waitForURL('**' + BANK + '?**'), page.selectOption('#term-select', { label: last })]);
      await page.locator('.mb-group').first().waitFor();
      assert.equal(await page.locator('#termSelect option:checked').innerText(), last);
      const opened = await page.evaluate(() => { const B = window.MathBank, id = new URL(location.href).searchParams.get('unit'), u = B.findUnit(id); return { id, term: u.grade + '-' + u.semester, first: B.units().find((x) => x.grade === u.grade && x.semester === u.semester).id, hasTerm: new URL(location.href).searchParams.has('term') }; });
      assert.equal(opened.id, opened.first, '그 학기의 첫 단원');
      assert.equal(opened.hasTerm, false, '주소에는 단원만 남는다');
      await context.close();
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true }));
  } finally {
    await browser.close();
    await h.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
