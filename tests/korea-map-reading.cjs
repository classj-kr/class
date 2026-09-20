// Verify all destination prose, loaded reading fonts, and desktop/mobile layout.
const fs = require('node:fs'), path=require('node:path'), http=require('node:http'), assert=require('node:assert/strict');
const puppeteer=require('puppeteer-core');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'outputs/korea-map-reading');
const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(root+path.sep)) {res.writeHead(403).end();return;}
  fs.readFile(file,(e,b)=>{
    if(e){res.writeHead(404).end();return;}
    res.setHeader('Content-Type', {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript; charset=utf-8','.json':'application/json','.geojson':'application/json','.webp':'image/webp','.woff2':'font/woff2'}[path.extname(file)]||'application/octet-stream');
    res.end(b);
  });
});
(async()=>{
  fs.mkdirSync(out,{recursive:true});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  let browser;
  try {
    browser=await puppeteer.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run','--disable-background-networking']});
    const page=await browser.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.setRequestInterception(true);
    page.on('request',r=>r.url().startsWith('http://127.0.0.1:')||r.url().startsWith('data:')?r.continue():r.abort());
    await page.setViewport({width:1440,height:950});
    await page.goto('http://127.0.0.1:'+server.address().port+'/learning/inquiry/korea-map/index.html',{waitUntil:'networkidle0'});
    await page.evaluate(()=>document.fonts.ready);
    const fonts=await page.evaluate(()=>[...document.fonts].map(f=>({family:f.family,status:f.status})));
    assert.ok(fonts.some(f=>f.family==='Korea KoPubWorld Batang'&&f.status==='loaded'),JSON.stringify(fonts));
    await page.click('[data-theme="travel"]');
    await page.evaluate(()=>document.querySelector('.relic-guide').open=true);
    const descriptions=await page.evaluate(()=>{
      const search=document.querySelector('.place-search'), results=[];
      for(const place of window.KOREA_TRAVEL.places){
        search.value=place.name;search.dispatchEvent(new Event('input',{bubbles:true}));
        const button=[...document.querySelectorAll('.relic-list button')].find(b=>b.firstElementChild.textContent===place.emoji+' '+place.name);
        if(!button)throw new Error('Missing place '+place.id);
        button.click();
        const ps=[...document.querySelectorAll('#placeDescription p')];
        results.push({id:place.id,paragraphs:ps.length,correct:ps.map(p=>p.textContent).join('\n\n')===place.description,font:getComputedStyle(ps[0]).fontFamily,overflow:document.querySelector('.place-body').scrollWidth>document.querySelector('.place-body').clientWidth+1});
        document.querySelector('#placeDialog').close();
      }
      return results;
    });
    assert.equal(descriptions.length,308);
    assert.ok(descriptions.every(p=>p.paragraphs===2&&p.correct&&p.font.includes('Korea KoPubWorld Batang')&&!p.overflow));
    const openPlace=async name=>page.evaluate(name=>{
      const search=document.querySelector('.place-search');search.value=name;search.dispatchEvent(new Event('input',{bubbles:true}));
      document.querySelector('.relic-list button').click();
    },name);
    await openPlace('DMZ박물관');
    await page.evaluate(async()=>{const img=document.querySelector('#placePhoto');if(img.src)await img.decode().catch(()=>{});});
    await page.screenshot({path:path.join(out,'dmz-desktop.png')});
    const cdp=await page.createCDPSession();await cdp.send('DOM.enable');await cdp.send('CSS.enable');
    const {root:doc}=await cdp.send('DOM.getDocument');
    const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:doc.nodeId,selector:'#placeDescription p'});
    const rendered=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});
    assert.ok(rendered.fonts.some(f=>f.isCustomFont&&f.glyphCount>0),JSON.stringify(rendered));
    await page.setViewport({width:390,height:844});
    const mobileLayout=await page.evaluate(()=>{
      const side=document.querySelector('.place-side').getBoundingClientRect();
      const body=document.querySelector('.place-body').getBoundingClientRect();
      const route=document.querySelector('.place-route').getBoundingClientRect();
      return {sideBottom:side.bottom,bodyTop:body.top,routeBottom:route.bottom};
    });
    assert.ok(mobileLayout.bodyTop>=mobileLayout.sideBottom-1&&mobileLayout.bodyTop>=mobileLayout.routeBottom,JSON.stringify(mobileLayout));
    await page.evaluate(()=>document.querySelector('#placeName').scrollIntoView({block:'start'}));
    await page.screenshot({path:path.join(out,'dmz-mobile.png')});
    assert.ok(await page.$eval('#placeDescription',el=>el.scrollWidth<=el.clientWidth+1));
    await page.click('#placeClose');
    await page.setViewport({width:1440,height:950});
    await page.click('[data-theme="terrain"]');
    const overflow=await page.evaluate(()=>{
      const results=[];
      for(const l of window.KOREA_GEOGRAPHY.lessons){
        document.querySelector('[data-theme="'+l.topic+'"]').click();
        const select=document.querySelector('#lessonSelect');select.value=l.id;select.dispatchEvent(new Event('change',{bubbles:true}));
        for(const node of document.querySelectorAll('#lessonDiagram svg text')){
          const b=node.getBBox();if(b.x < -1 || b.x+b.width > 521)results.push({id:l.id,text:node.textContent,x:b.x,width:b.width});
        }
      }
      document.querySelector('[data-theme="terrain"]').click();
      return results;
    });
    assert.deepEqual(overflow,[]);
    await page.click('#quickPractice');
    const typography=await page.evaluate(()=>['#questionTitle','.answer-button','.comparison-cell p'].map(selector=>({selector,font:getComputedStyle(document.querySelector(selector)).fontFamily})));
    assert.ok(typography.every(t=>t.font.includes('Korea KoPubWorld Batang')));
    await page.screenshot({path:path.join(out,'question-desktop.png')});
    await page.setViewport({width:390,height:844});
    await page.evaluate(()=>document.querySelector('#questionTitle').scrollIntoView({block:'start'}));
    await page.screenshot({path:path.join(out,'question-mobile.png')});
    assert.deepEqual(errors,[]);
    const report={places:descriptions.length,paragraphs:616,fonts,renderedFonts:rendered.fonts,typography,diagramOverflow:overflow,mobileLayout,errors};
    fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
  } finally {if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
