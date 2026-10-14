const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../game-hub-server/node_modules/playwright');
(async () => {
  const output = path.resolve('outputs/phonics-full-audit');
  const proposed = JSON.parse(fs.readFileSync(path.join(output, 'proposed-bounds.json'), 'utf8'));
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
    await page.route('**/app.js?*', async route => {
      const response = await route.fetch();
      const text = await response.text();
      const index = text.lastIndexOf('  renderDashboard();');
      await route.fulfill({ response, body: text.slice(0, index) + '  window.cleanSpriteUrl = cleanSpriteUrl;\n' + text.slice(index) });
    });
    await page.goto('http://127.0.0.1:8765/learning/literacy-numeracy/phonics/');
    const words = await page.evaluate(() => Object.keys(window.PHONICS_CURRICULUM.wordBank));
    for (let start = 0; start < words.length; start += 48) {
      await page.evaluate(async ({ words, proposed }) => {
        const gallery = document.createElement('div');
        gallery.id = 'audit';
        gallery.style.cssText = 'display:grid;grid-template-columns:repeat(6,1fr);gap:8px;background:white;padding:12px;color:black;font:14px Arial';
        for (const word of words) {
          const item = window.PHONICS_CURRICULUM.wordBank[word];
          const p = { ...item.picture };
          if (!p.crop) {
            const spec = proposed[p.file.split('/').pop()];
            const b = spec.boxes[p.index];
            p.crop = [b[0]/spec.size[0], b[1]/spec.size[1], (b[2]-b[0])/spec.size[0], (b[3]-b[1])/spec.size[1]];
          }
          const card = document.createElement('div');
          card.style.cssText = 'min-height:188px;border:1px solid #ddd;padding:4px';
          const image = document.createElement('img');
          image.width = 152; image.height = 152;
          image.src = await window.cleanSpriteUrl(p);
          const label = document.createElement('div');
          label.textContent = word + ' · ' + item.korean;
          card.append(image, label);
          if (item.pictureNote) {
            const note = document.createElement('div');
            note.style.cssText = 'font-size:12px;color:#555;margin-top:4px';
            note.textContent = item.pictureNote;
            card.append(note);
          }
          gallery.append(card);
        }
        document.body.replaceChildren(gallery);
      }, { words: words.slice(start, start + 48), proposed });
      const number = String(Math.floor(start / 48) + 1).padStart(2, '0');
      await page.locator('#audit').screenshot({ path: path.join(output, 'page-' + number + '.png') });
    }
    console.log('Rendered all ' + words.length + ' words on 15 audit pages.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
