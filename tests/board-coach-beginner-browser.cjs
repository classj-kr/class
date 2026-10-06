'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('../game-hub-server/node_modules/playwright');
const root=path.resolve(__dirname,'..');
async function main(){
  const server=http.createServer((req,res)=>{
    const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);res.end();return;}
      res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'})[path.extname(file)]||'application/octet-stream');res.end(data);});
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}`,errors=[];let browser;
  try{
    browser=await chromium.launch({headless:true,channel:'msedge'});
    for(const game of ['reversi','omok','chess','janggi']){
      const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(`${game}: ${e.message}`));
      await page.addInitScript(()=>{
        window.aiReplies=[];const OriginalWorker=Worker;
        window.Worker=class extends OriginalWorker {
          constructor(...args){super(...args);this.addEventListener('message',event=>aiReplies.push({kind:this.requestKind,...event.data}));}
          postMessage(data,...args){this.requestKind=data.kind;return super.postMessage(data,...args);}
        };
      });
      await page.goto(base+'/learning/games/board-coach/coach.html?game='+game);
      assert.equal(await page.locator('input[name=level]:checked').inputValue(),'beginner');
      assert.match(await page.locator('#setup').innerText(),/처음 배우는 연습 상대/);
      await page.locator('input[name=color][value="2"]').check();await page.locator('#startLearning').click();
      await page.waitForFunction(()=>aiReplies.some(r=>r.kind==='move'),null,{timeout:15000});
      const beginner=await page.evaluate(()=>aiReplies.find(r=>r.kind==='move'));
      assert.equal(beginner.error,undefined);assert.equal(beginner.result.practice,true);assert.equal(beginner.result.nodes,0);
      await page.locator('#hint').click();await page.waitForFunction(()=>aiReplies.some(r=>r.kind==='hint'),null,{timeout:20000});
      const hint=await page.evaluate(()=>aiReplies.find(r=>r.kind==='hint'));
      assert.equal(hint.error,undefined);assert.notEqual(hint.result.practice,true);assert.ok(hint.result.reason.length>10);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
      await page.locator('#newGame').click();await page.locator('input[name=level][value="intermediate"]').check();
      await page.evaluate(()=>{aiReplies=[]});await page.locator('#startLearning').click();
      await page.waitForFunction(()=>aiReplies.some(r=>r.kind==='move'),null,{timeout:15000});
      const intermediate=await page.evaluate(()=>aiReplies.find(r=>r.kind==='move'));
      assert.equal(intermediate.error,undefined);assert.notEqual(intermediate.result.practice,true);
      console.log(`${game}: real beginner worker, stronger hint, level switch and phone layout PASS`);await page.close();
    }
    assert.deepEqual(errors,[]);
  }finally{await browser?.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
