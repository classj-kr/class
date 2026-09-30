const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../game-hub-server/node_modules/playwright');
// Start the workspace static server before running:
// python -m http.server 8765 --bind 127.0.0.1

(async () => {
  const output = path.resolve(__dirname, '../output/phonics-picture-review');
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    for (const site of ['phonics', 'phonics-site/public/phonics']) {
      const page = await browser.newPage({ viewport: { width: 1123, height: 850 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      // Expose the real private renderer only in this test's network response.
      await page.route('**/app.js?*', async route => {
        const response = await route.fetch();
        const source = await response.text();
        const marker = source.lastIndexOf('  renderDashboard();');
        assert.ok(marker > 0);
        await route.fulfill({ response, body: source.slice(0, marker) +
          '  window.pictureTest = { cleanSpriteUrl, openLesson, answer: () => activeSoundGameRounds[soundGameState.index].answer };\n' + source.slice(marker) });
      });
      await page.addInitScript(() => {
        speechSynthesis.speak = utterance => { window.lastSpokenWord = utterance.text; };
        window.pictureDrawErrors = [];
        const drawImage = CanvasRenderingContext2D.prototype.drawImage;
        CanvasRenderingContext2D.prototype.drawImage = function(image, ...args) {
          if (args.length === 8 && this.canvas.width === 256) {
            const [sx, sy, sw, sh, dx, dy, dw, dh] = args;
            if (Math.abs(dw / sw - dh / sh) > 0.00001) window.pictureDrawErrors.push('distorted aspect ratio');
            if (Math.min(dx, dy) < 11.99 || Math.max(dx + dw, dy + dh) > 244.01) window.pictureDrawErrors.push('missing padding');
            if (sx < 0 || sy < 0 || sx + sw > image.naturalWidth + 0.01 || sy + sh > image.naturalHeight + 0.01) window.pictureDrawErrors.push('out of bounds');
          }
          return drawImage.call(this, image, ...args);
        };
      });
      await page.goto('http://127.0.0.1:8765/learning/literacy-numeracy/' + site + '/');
      const model = await page.evaluate(() => {
        const data = window.PHONICS_CURRICULUM;
        return {
          bLesson: data.lessons.find(lesson => lesson.sourceTitle.startsWith('b /')).id,
          bat: data.wordBank.bat, top: data.wordBank.top, fan: data.wordBank.fan,
          reviewed: Object.values(data.wordBank).filter(item => item.picture?.crop).length
        };
      });
      assert.deepEqual(model.bat.meanings, ['박쥐', '야구 방망이']);
      assert.equal(model.bat.pictureMeaning, '박쥐');
      assert.equal(model.top.pictureMeaning, '팽이');
      assert.equal(model.fan.pictureMeaning, '부채');
      // The full bat wing extends beyond the old 2/6 right grid boundary.
      assert.ok(model.bat.picture.crop[0] + model.bat.picture.crop[2] > 2 / 6);
      const name = site.startsWith('phonics-site') ? 'standalone' : 'main';
      await page.locator('#stageList [data-lesson="' + model.bLesson + '"]').click();
      let sawBat = false;
      for (let round = 0; round < 8; round++) {
        await page.waitForFunction(() => [...document.querySelectorAll('.sound-choice-picture')]
          .every(el => el.style.backgroundImage.startsWith('url("data:')));
        const bat = page.locator('.sound-choice[data-word="bat"]');
        if (await bat.count()) {
          sawBat = true;
          assert.match(await bat.innerText(), /그림: 박쥐/);
          assert.match(await bat.innerText(), /다른 뜻: 야구 방망이/);
          assert.match(await bat.getAttribute('aria-label'), /그림: 박쥐, 다른 뜻: 야구 방망이/);
          await page.screenshot({ path: path.join(output, name + '-desktop.png'), fullPage: true });
          await page.setViewportSize({ width: 390, height: 844 });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
          await page.screenshot({ path: path.join(output, name + '-mobile.png'), fullPage: true });
          await page.setViewportSize({ width: 1123, height: 850 });
        }
        const answer = await page.evaluate(() => window.lastSpokenWord);
        await page.locator('.sound-choice[data-word="' + answer + '"]').click();
        assert.equal(await page.locator('#soundScore').innerText(), String(round + 1));
        await page.locator('#soundNext').click();
      }
      assert.ok(sawBat, 'The b lesson must actually show and explain bat.');
      assert.match(await page.locator('#soundFeedback').innerText(), /8문제 중 8문제 정답/);
      const completed = await page.evaluate(() => {
        let questions = 0;
        for (const lesson of window.PHONICS_CURRICULUM.lessons) {
          window.pictureTest.openLesson(lesson.id);
          for (let i = 0; i < lesson.questionCount; i++) {
            const answer = window.pictureTest.answer();
            document.querySelector('.sound-choice[data-word="' + answer + '"]').click();
            if (document.getElementById('soundScore').textContent !== String(i + 1)) throw new Error(lesson.id + ' score');
            document.getElementById('soundNext').click();
            questions++;
          }
        }
        return questions;
      });
      assert.equal(completed, 1020);
      // Exercise a long multi-meaning card and its image at narrow phone width.
      await page.setViewportSize({ width: 390, height: 844 });
      await page.evaluate(() => {
        const data = window.PHONICS_CURRICULUM;
        window.pictureTest.openLesson(data.lessons.find(lesson => lesson.words.includes('trunk')).id);
        for (let i = 0; i < 8; i++) {
          if (document.querySelector('.sound-choice[data-word="trunk"]')) break;
          document.querySelector('.sound-choice[data-word="' + window.pictureTest.answer() + '"]').click();
          document.getElementById('soundNext').click();
        }
      });
      assert.match(await page.locator('.sound-choice[data-word="trunk"]').innerText(), /코끼리의 코/);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.waitForFunction(() => [...document.querySelectorAll('.sound-choice-picture')]
        .every(el => el.style.backgroundImage.startsWith('url("data:')));
      await page.screenshot({ path: path.join(output, name + '-meanings-mobile.png'), fullPage: true });
      await page.setViewportSize({ width: 1123, height: 850 });
      // Use the production renderer for a visual contact sheet of every reviewed crop.
      const count = await page.evaluate(async () => {
        const bank = window.PHONICS_CURRICULUM.wordBank;
        const entries = Object.entries(bank).filter(([, item]) => item.picture?.crop);
        const seen = new Set();
        const gallery = document.createElement('div');
        gallery.id = 'review-gallery';
        gallery.style.cssText = 'display:grid;grid-template-columns:repeat(6,1fr);gap:12px;background:white;padding:16px';
        for (const [word, item] of entries) {
          const key = JSON.stringify(item.picture);
          if (seen.has(key)) continue;
          seen.add(key);
          const card = document.createElement('div');
          card.dataset.word = word;
          const img = document.createElement('img');
          img.src = await window.pictureTest.cleanSpriteUrl(item.picture);
          img.width = 152; img.height = 152;
          const label = document.createElement('div');
          label.textContent = word + ' · ' + item.pictureMeaning;
          card.append(img, label); gallery.append(card);
        }
        document.body.replaceChildren(gallery);
        return seen.size;
      });
      assert.ok(count >= 690);
      await page.locator('#review-gallery').screenshot({ path: path.join(output, name + '-reviewed-pictures.png') });
      await page.evaluate(() => {
        const words = ['full','pop','dim','chin','snore','tallest','useless','neutral','disagree','weakness','yes','chore'];
        const gallery = document.getElementById('review-gallery');
        const cards = [...gallery.children];
        gallery.replaceChildren(...words.map(word => cards.find(card => card.dataset.word === word)));
        gallery.style.gridTemplateColumns = 'repeat(3, 1fr)';
        gallery.style.width = '600px';
      });
      await page.locator('#review-gallery').screenshot({ path: path.join(output, name + '-flat-scenes.png') });
      assert.deepEqual(await page.evaluate(() => window.pictureDrawErrors), []);
      assert.deepEqual(errors, []);
      console.log(name + ': all 128 lessons / ' + completed + ' questions, meanings, mobile layout, ' + count + ' reviewed pictures passed');
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
