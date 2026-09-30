const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../game-hub-server/node_modules/playwright');
(async () => {
  const spec = JSON.parse(fs.readFileSync('output/phonics-full-audit/art-v4-bounds.json', 'utf8'));
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const page = await browser.newPage({ viewport: { width: 720, height: 1500 } });
    await page.route('**/app.js?*', async route => {
      const response = await route.fetch();
      const source = await response.text();
      const marker = source.lastIndexOf('  renderDashboard();');
      await route.fulfill({ response, body: source.slice(0, marker) + '  window.renderPictureReview = cleanSpriteUrl;\n' + source.slice(marker) });
    });
    await page.goto('http://127.0.0.1:8765/learning/literacy-numeracy/phonics/');
    await page.evaluate(async spec => {
      const bank = window.PHONICS_CURRICULUM.wordBank;
      const words = ['full','pop','dim','chin','snore','tallest','useless','neutral','disagree','weakness','yes','chore'];
      const pairs = [['sit','dim'], ['kiss','chin'], ['bed','snore'], ['faster','tallest'], ['run','weakness'], ['dip','chore']];
      const gallery = document.createElement('main');
      gallery.id = 'style-review';
      gallery.style.cssText = 'width:660px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;background:white;padding:18px;color:#222;font:14px Arial';
      for (const title of ['기존 원본', '이전 교정본', '원본 참고 재제작']) {
        const heading = document.createElement('strong'); heading.textContent = title; gallery.append(heading);
      }
      for (const [reference, word] of pairs) {
        const b = spec.boxes[words.indexOf(word)];
        const newPicture = {file:'assets/images/phonics-reviewed-scenes-v4.webp',crop:[b[0]/spec.size[0],b[1]/spec.size[1],(b[2]-b[0])/spec.size[0],(b[3]-b[1])/spec.size[1]]};
        const oldSpecs = [[60,46,313,334],[370,13,707,338],[732,13,1072,343],[27,354,330,691],[366,350,711,695],[736,349,1070,694],[17,701,347,1040],[350,709,733,1040],[734,707,1077,1032],[17,1045,354,1412],[404,1061,691,1408],[733,1044,1075,1417]];
        const o = oldSpecs[words.indexOf(word)];
        const oldPicture = {file:'assets/images/phonics-reviewed-scenes-v3.webp',crop:[o[0]/1086,o[1]/1448,(o[2]-o[0])/1086,(o[3]-o[1])/1448]};
        for (const [label,picture] of [[reference,bank[reference].picture],[word,oldPicture],[word,newPicture]]) {
          const card = document.createElement('div');
          const img = document.createElement('img'); img.width = 180; img.height = 180;
          img.src = await window.renderPictureReview(picture);
          await img.decode();
          const caption = document.createElement('div'); caption.textContent = label;
          card.append(img,caption); gallery.append(card);
        }
      }
      document.body.replaceChildren(gallery);
    }, spec);
    await page.locator('#style-review').screenshot({path:path.resolve('output/phonics-picture-review/style-comparison-v4.png')});
    console.log('Saved reference / previous / replacement comparison using the production image renderer.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
