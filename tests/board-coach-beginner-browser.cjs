'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('../game-hub-server/node_modules/playwright');
const root=path.resolve(__dirname,'..');
const levels=['beginner','level2','intermediate','level4','advanced'];
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
          constructor(...args){super(...args);this.addEventListener('message',event=>aiReplies.push({kind:this.requestKind,level:this.requestLevel,...event.data}));}
          postMessage(data,...args){this.requestKind=data.kind;this.requestLevel=data.level;return super.postMessage(data,...args);}
        };
      });
      await page.goto(base+'/learning/games/board-coach/coach.html?game='+game);
      assert.equal(await page.locator('input[name=level]:checked').inputValue(),'beginner');
      assert.match(await page.locator('#levelDescription').innerText(),/지금 둘 곳을 골라요/);
      assert.deepEqual(await page.locator('input[name=level]').evaluateAll(inputs=>inputs.map(input=>input.getAttribute('aria-label'))),[1,2,3,4,5].map(n=>'레벨 '+n));
      assert.doesNotMatch(await page.locator('#setup').innerText(),/초급|중급|상급/);
      const buttons=await page.locator('.level-options .option').evaluateAll(labels=>labels.map(label=>{const r=label.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));
      assert.ok(buttons.every(b=>b.width>=44&&b.height>=44&&Math.abs(b.y-buttons[0].y)<1),'all five touch targets fit one row');
      await page.locator('input[name=level]:checked').focus();await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('input[name=level]:checked').inputValue(),'level2');
      assert.match(await page.locator('#levelDescription').innerText(),new RegExp(`^${game==='janggi'?1:2}수 앞까지`));
      await page.keyboard.press('ArrowLeft');
      await page.locator('input[name=color][value="2"]').check();await page.locator('#startLearning').click();
      await page.waitForFunction(()=>aiReplies.some(r=>r.kind==='move'),null,{timeout:15000});
      const beginner=await page.evaluate(()=>aiReplies.find(r=>r.kind==='move'));
      assert.equal(beginner.error,undefined);assert.equal(beginner.result.practice,true);assert.equal(beginner.result.nodes,0);
      assert.equal(beginner.level,'beginner');assert.equal(await page.locator('#levelLabel').innerText(),'레벨 1');
      await page.locator('#hint').click();await page.waitForFunction(()=>aiReplies.some(r=>r.kind==='hint'),null,{timeout:20000});
      const hint=await page.evaluate(()=>aiReplies.find(r=>r.kind==='hint'));
      assert.equal(hint.error,undefined);assert.notEqual(hint.result.practice,true);assert.ok(hint.result.reason.length>10);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
      for(const [index,level] of levels.entries()){
        if(!index)continue;
        await page.locator('#newGame').click();await page.getByRole('radio',{name:'레벨 '+(index+1),exact:true}).check();
        const description=await page.locator('input[name=level]:checked').getAttribute('data-description');
        assert.equal(await page.locator('#levelDescription').innerText(),description);
        const depths={reversi:[null,2,4,5,6],omok:[null,2,3,4,4],chess:[null,2,3,4,4],janggi:[null,1,2,3,3]}[game];
        assert.match(description,new RegExp(`^${depths[index]}수 앞까지`));
        if(index===4&&game!=='reversi')assert.match(description,/레벨 4보다 더 많은 둘 곳/);
        await page.evaluate(()=>{aiReplies=[]});await page.locator('#startLearning').click();
        await page.waitForFunction(()=>aiReplies.some(r=>r.kind==='move'),null,{timeout:15000});
        const reply=await page.evaluate(()=>aiReplies.find(r=>r.kind==='move'));
        assert.equal(reply.error,undefined);assert.notEqual(reply.result.practice,true);assert.equal(reply.level,level);
        assert.equal(await page.locator('#levelLabel').innerText(),'레벨 '+(index+1));
        assert.equal(await page.locator('#retry').isVisible(),false);
      }
      await page.locator('#newGame').click();
      assert.equal(await page.locator('input[name=level]:checked').inputValue(),'advanced');
      if(game==='janggi'){
        const output=path.join(root,'outputs/qa/coach-levels');fs.mkdirSync(output,{recursive:true});
        await page.locator('#setup').evaluate(dialog=>dialog.scrollTop=0);
        await page.screenshot({path:path.join(output,'janggi-levels-mobile.png')});
        await page.setViewportSize({width:1280,height:850});
        await page.screenshot({path:path.join(output,'janggi-levels-desktop.png')});
      }
      console.log(`${game}: five numeric levels, real AI workers, stronger hint, keyboard and phone controls PASS`);await page.close();
    }
    assert.deepEqual(errors,[]);
  }finally{await browser?.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
