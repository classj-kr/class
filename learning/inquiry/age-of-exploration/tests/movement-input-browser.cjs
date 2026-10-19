const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../../../../game-hub-server/node_modules/playwright');
const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
const input = html.slice(html.indexOf('function sendInput(){'), html.indexOf("canvas.addEventListener('pointerdown',"));
(async () => {
  const browser = await chromium.launch({ headless:true, channel:'msedge' });
  try {
    const page = await browser.newPage();
    await page.setContent('<button id="plus">확대</button><input id="name"><div id="pad"><button data-dir="left">왼쪽</button></div>');
    await page.addScriptTag({ content: `
      const keys={up:false,down:false,left:false,right:false};let mode='sea',joined=true;
      const sent=[],socket={emit:(event,data)=>sent.push({event,data:{...data}})};
      function canTravelNow(){return true}function finalQuizOpen(){return false}
      function clearKeys(){for(const k in keys)keys[k]=false;socket.emit('stop')}
      ${input}
      window.readMovement=()=>({keys:{...keys},sent});
    ` });
    await page.locator('#plus').click(); await page.keyboard.down('ArrowRight');
    assert.equal((await page.evaluate(()=>readMovement())).keys.right,true,'direction keys must work after clicking zoom');
    await page.keyboard.up('ArrowRight');
    await page.locator('#name').focus(); await page.keyboard.press('w');
    assert.equal((await page.evaluate(()=>readMovement())).keys.up,false,'typing must not move the ship');
    await page.locator('#plus').focus(); await page.keyboard.down('ArrowLeft');
    await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
    assert.equal((await page.evaluate(()=>readMovement())).keys.left,false,'leaving the window must release movement');
    await page.keyboard.up('ArrowLeft');
    assert.equal((await page.evaluate(()=>readMovement())).sent.at(-1).data.left,false);
    console.log('movement-input-browser: zoom focus, text editing and lost focus passed');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});
