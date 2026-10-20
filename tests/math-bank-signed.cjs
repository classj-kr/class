// 「수학 문제」의 부호가 있는 답(중학교 단원)을 실제 브라우저로 돌린다.
// 부호 단추로 음수 답하기, 자판으로 −를 적기, 음의 분수, 부호가 틀린 답, 답 줄의 표기(−, 위첨자, °C)를 본다.
//   node tests/math-bank-signed.cjs          통과하면 {"ok":true}
//   node tests/math-bank-signed.cjs --shots  outputs/math-bank-review 에 답한 화면을 무손실 WebP로 남긴다
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { harness } = require('./learning-records-integration.cjs');

const SHOTS = process.argv.includes('--shots');
const OUT = path.resolve(__dirname, '../outputs/math-bank-review');
const TO_WEBP = "import io,sys;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert('RGBA');im.save(sys.argv[1],format='WEBP',lossless=True);out=Image.open(sys.argv[1]).convert('RGBA');assert im.size==out.size and im.tobytes()==out.tobytes()";
const URL_PATH = '/learning/literacy-numeracy/math-bank/';
// 부호가 있는 답을 받는 단원(중 1학년 1학기 「정수와 유리수」).
const UNIT = '7-1-2';
const MINUS = '−';

(async () => {
  const h = await harness();
  const browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
  const errors = [];
  if (SHOTS) fs.mkdirSync(OUT, { recursive: true });
  try {
    const context = await browser.newContext({ viewport: { width: 360, height: 760 } });
    await context.route('https://**', (route) => route.abort());
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('dialog', (d) => d.accept());
    await page.goto(h.base + URL_PATH);
    await page.locator('.mb-group').first().waitFor();
    assert.equal(await page.locator('#termSelect option[value="7-1"]').innerText(), '중 1학년 1학기');
    await page.selectOption('#termSelect', '7-1');
    await page.selectOption('#unitSelect', UNIT);
    await page.waitForFunction((id) => new URL(location.href).searchParams.get('unit') === id && document.querySelectorAll('.mb-group').length > 0, UNIT);

    // 단원의 모든 문항을 자리(묶음·단추 차례)와 함께 읽는다.
    const pool = await page.evaluate((unitId) => {
      const B = window.MathBank, unit = B.findUnit(unitId), out = [];
      unit.groups.forEach((group, gi) => {
        let li = 0;
        for (const level of B.LEVELS) {
          const rounds = B.roundCount(unit, group.id, level);
          for (let no = 1; no <= rounds; no += 1, li += 1) {
            for (const it of B.makeRound(unit, group.id, level, no)) {
              out.push({ gi, li, key: it.key, fraction: Boolean(it.fraction), mixed: Boolean(it.mixed), negative: Boolean(it.negative), signed: Boolean(it.signed),
                choice: it.choice ? { answer: it.choice.answer, count: it.choice.options.length, sup: /<sup>/.test(it.choice.options[it.choice.answer]) } : null,
                inputs: it.inputs ? it.inputs.map((i) => ({ answer: i.answer, signed: Boolean(i.signed), decimal: Boolean(i.decimal), unit: i.unit || '' })) : null });
            }
          }
        }
      });
      return out;
    }, UNIT);
    const used = new Set();
    const take = (what, test) => { const item = pool.find((it) => !used.has(it.key) && test(it)); assert.ok(item, '단원에 이런 문항이 없다: ' + what); used.add(item.key); return item; };
    const single = (it) => it.inputs && it.inputs.length === 1 && !it.fraction;
    const open = async (item) => {
      await page.locator('.mb-group').nth(item.gi).locator('.mb-level').nth(item.li).click();
      const card = page.locator(`.mb-item[data-key="${item.key}"]`);
      await card.waitFor();
      return card;
    };
    const back = async () => {
      await page.evaluate(() => window.dispatchEvent(new CustomEvent('sitebackrequest', { bubbles: true, cancelable: true })));
      await page.locator('.mb-group').first().waitFor();
    };
    const done = async (card, right) => {
      await card.locator('.mb-result:not([hidden])').waitFor({ timeout: 10000 });
      await page.waitForFunction(() => !document.getElementById('main').inert);
      assert.equal(await card.evaluate((el) => el.classList.contains('is-right')), right, (right ? '맞아야 한다: ' : '틀려야 한다: ') + await card.locator('.mb-text').innerText());
      return card.locator('.mb-result').innerText();
    };
    const reveal = async (card) => {
      assert.match(await done(card, false), /힌트/);
      assert.doesNotMatch(await card.locator('.mb-result').innerText(), /답: /);
      if (await card.locator('.mb-sign').count()) assert.equal(await card.locator('.mb-sign').first().isEnabled(), true, '힌트를 본 뒤에도 부호를 수정할 수 있다');
      await card.locator('.mb-reveal').click();
      await page.waitForFunction(() => !document.getElementById('main').inert);
      return card.locator('.mb-result').innerText();
    };
    let shots = 0;
    const snap = async (name) => {
      if (!SHOTS) return;
      const png = await page.screenshot({ fullPage: true });
      const result = spawnSync(process.env.PYTHON || 'python', ['-c', TO_WEBP, path.join(OUT, `signed-${shots += 1}-${name}.webp`)], { input: png });
      assert.equal(result.status, 0, 'WebP 저장 실패: ' + String(result.stderr));
    };

    // ① 음의 정수: 부호 단추를 눌러 −로 바꾸고 크기만 적으면 맞다.
    let item = take('답이 음의 정수', (it) => single(it) && it.inputs[0].signed && !it.inputs[0].decimal && it.inputs[0].answer < 0);
    let card = await open(item);
    let sign = card.locator('.mb-sign');
    assert.equal(await sign.count(), 1);
    assert.equal(await sign.innerText(), '+', '처음에는 +');
    await sign.click();
    assert.equal(await sign.innerText(), MINUS);
    await card.locator('.mb-field input').fill(String(-item.inputs[0].answer));
    await card.locator('.mb-primary').click();
    await done(card, true);
    assert.equal(await sign.isDisabled(), true, '답한 뒤에는 부호 단추도 잠긴다');
    await snap('minus-right');
    await back();

    // ② 음의 정수: 오답에는 힌트를 먼저 보이고, 풀이를 요청하면 답 줄에 빼기표(−)를 적는다.
    item = take('답이 음의 정수', (it) => single(it) && it.inputs[0].signed && !it.inputs[0].decimal && it.inputs[0].answer < 0);
    card = await open(item);
    await card.locator('.mb-field input').fill(String(-item.inputs[0].answer));
    await card.locator('.mb-primary').click();
    assert.ok((await reveal(card)).includes('답: ' + MINUS + (-item.inputs[0].answer)), '답 줄에 −가 붙는다');
    await back();

    // ③ 자판으로 -를 직접 적어도 받고, 단추가 그 부호로 바뀐다. 음의 소수.
    item = take('답이 음의 소수', (it) => single(it) && it.inputs[0].signed && it.inputs[0].decimal && it.inputs[0].answer < 0);
    card = await open(item);
    await card.locator('.mb-field input').fill(String(item.inputs[0].answer));
    await card.locator('.mb-primary').click();
    await done(card, true);
    assert.equal(await card.locator('.mb-sign').innerText(), MINUS);
    assert.equal(await card.locator('.mb-field input').inputValue(), String(-item.inputs[0].answer), '칸에는 크기만 남는다');
    await back();

    // ④ 양수 답: +를 그대로 두면 맞고, −로 바꾸면 틀리다.
    item = take('답이 양의 정수', (it) => single(it) && it.inputs[0].signed && !it.inputs[0].decimal && it.inputs[0].answer > 0);
    card = await open(item);
    await card.locator('.mb-field input').fill(String(item.inputs[0].answer));
    await card.locator('.mb-primary').click();
    await done(card, true);
    await back();
    item = take('답이 양의 정수', (it) => single(it) && it.inputs[0].signed && !it.inputs[0].decimal && it.inputs[0].answer > 0);
    card = await open(item);
    await card.locator('.mb-sign').click();
    await card.locator('.mb-field input').fill(String(item.inputs[0].answer));
    await card.locator('.mb-primary').click();
    await done(card, false);
    await card.locator('.mb-sign').click();
    await card.locator('.mb-primary').click();
    assert.match(await done(card, true), /다시 풀어 맞혔어요/);
    await back();

    // ⑤ 음의 분수: 부호 단추는 분수 칸의 왼쪽에 하나만 있다. −로 바꾸고 분자·분모를 적으면 맞다.
    const fractionOf = (it) => it.inputs.slice(-2).map((i) => String(i.answer));
    item = take('답이 음의 분수', (it) => it.fraction && !it.mixed && it.negative);
    card = await open(item);
    sign = card.locator('.mb-sign');
    assert.equal(await sign.count(), 1);
    const [signBox, stackBox] = [await sign.boundingBox(), await card.locator('.mb-fracfield').boundingBox()];
    assert.ok(signBox.x + signBox.width <= stackBox.x + 1, '부호 단추가 분수의 왼쪽에 있다');
    assert.ok(signBox.y + signBox.height > stackBox.y && signBox.y < stackBox.y + stackBox.height, '부호 단추가 분수와 같은 줄에 있다');
    await sign.click();
    let parts = fractionOf(item);
    for (let i = 0; i < 2; i += 1) await card.locator('.mb-field input').nth(i).fill(parts[i]);
    await card.locator('.mb-primary').click();
    await done(card, true);
    await snap('fraction-right');
    await back();

    // ⑥ 음의 분수: 부호를 바꾸지 않으면 틀리고, 답 줄에 −가 붙는다.
    item = take('답이 음의 분수', (it) => it.fraction && !it.mixed && it.negative);
    card = await open(item);
    parts = fractionOf(item);
    for (let i = 0; i < 2; i += 1) await card.locator('.mb-field input').nth(i).fill(parts[i]);
    await card.locator('.mb-primary').click();
    assert.ok((await reveal(card)).includes('답: ' + MINUS + parts.join('/')), '분수 답 줄에 −가 붙는다');
    await snap('fraction-wrong');
    await back();

    // ⑦ 양의 분수에도 부호 단추가 있고(단추가 답의 부호를 알려 주지 않는다), −로 바꾸면 틀리다.
    item = take('답이 양의 분수', (it) => it.fraction && !it.mixed && it.signed && !it.negative);
    card = await open(item);
    await card.locator('.mb-sign').click();
    parts = fractionOf(item);
    for (let i = 0; i < 2; i += 1) await card.locator('.mb-field input').nth(i).fill(parts[i]);
    await card.locator('.mb-primary').click();
    await done(card, false);
    await card.locator('.mb-sign').click();
    await card.locator('.mb-primary').click();
    assert.match(await done(card, true), /다시 풀어 맞혔어요/);
    await back();

    // ⑧ 칸이 여럿인 답: 칸마다 부호 단추가 있고, 한 칸의 부호만 틀려도 틀리다.
    const multi = (it) => it.inputs && !it.fraction && it.inputs.length > 1 && it.inputs.every((i) => i.signed && !i.decimal) && it.inputs.some((i) => i.answer < 0);
    item = take('부호가 있는 칸이 여럿', multi);
    card = await open(item);
    assert.equal(await card.locator('.mb-sign').count(), item.inputs.length);
    for (let i = 0; i < item.inputs.length; i += 1) {
      if (item.inputs[i].answer < 0) await card.locator('.mb-sign').nth(i).click();
      await card.locator('.mb-field input').nth(i).fill(String(Math.abs(item.inputs[i].answer)));
    }
    await card.locator('.mb-primary').click();
    await done(card, true);
    await back();
    item = take('부호가 있는 칸이 여럿', multi);
    card = await open(item);
    for (let i = 0; i < item.inputs.length; i += 1) await card.locator('.mb-field input').nth(i).fill(String(Math.abs(item.inputs[i].answer)));
    await card.locator('.mb-primary').click();
    await done(card, false);
    await snap('multi-wrong');
    for (let i = 0; i < item.inputs.length; i += 1) if (item.inputs[i].answer < 0) await card.locator('.mb-sign').nth(i).click();
    await card.locator('.mb-primary').click();
    assert.match(await done(card, true), /다시 풀어 맞혔어요/);
    await back();

    // ⑨ 고르기의 답에 거듭제곱이 있으면 답 줄에서도 지수가 위첨자로 보인다.
    item = take('답 보기에 거듭제곱이 있는 고르기', (it) => it.choice && it.choice.sup);
    card = await open(item);
    await card.locator('.mb-choice').nth((item.choice.answer + 1) % item.choice.count).click();
    await done(card, false);
    await reveal(card);
    assert.match(await card.locator('.mb-result strong').innerHTML(), /<sup>/, '답 줄의 지수는 위첨자');
    await snap('power-wrong');
    await back();

    // ⑩ 온도의 단위는 수와 띄어 적는다.
    item = take('단위가 °C인 답', (it) => single(it) && it.inputs[0].unit.trim() === '°C');
    card = await open(item);
    await card.locator('.mb-field input').fill(String(Math.abs(item.inputs[0].answer) + 1));
    await card.locator('.mb-primary').click();
    assert.match(await reveal(card), /답: [−]?\d+[ \u00A0]°C/);   // 수와 단위 사이는 줄이 갈리지 않는 빈칸이다

    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true }));
  } finally {
    await browser.close();
    await h.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
