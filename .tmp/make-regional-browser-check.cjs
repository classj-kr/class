const fs=require('node:fs'),path=require('node:path');
const out='.tmp/voyage-regional-rest-review';fs.mkdirSync(out,{recursive:true});
let s=fs.readFileSync('.tmp/voyage-interactions-review/check.cjs','utf8').replaceAll('voyage-interactions-review','voyage-regional-rest-review').replaceAll('31487','31527').replaceAll('31488','31528');
const start=s.indexOf('  await place({lat:-0.83'),end=s.indexOf(' }finally',start);
if(start<0||end<0)throw Error('Browser harness shape changed');
s=s.slice(0,start)+`
  const results=[];
  for(const name of ['가미노쿠니','도쿠야마','경성','회령']){
    const sea=['가미노쿠니','도쿠야마'].includes(name);
    await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
    await place({city:name,mode:sea?'sea':'land',fatigue:80});
    if(sea){
      await page.waitForFunction(name=>portInteraction?.placeName===name&&!missionActionBtn.disabled,{},name);
      await page.click('#missionActionBtn');
    }else{
      await page.waitForFunction(name=>cityInteraction?.placeName===name&&!cityActionBtn.disabled,{},name);
      await page.click('#cityActionBtn');
    }
    await page.waitForFunction(name=>mode==='city'&&!serverSelf.transition&&serverSelf.currentCityName===name&&cityScene.complete&&cityScene.naturalWidth>0,{},name);
    const first=await page.evaluate(()=>serverSelf.fatigue);
    await page.waitForFunction(v=>serverSelf.fatigue<v-2,{},first);
    const state=await page.evaluate(()=>({name:serverSelf.currentCityName,fatigue:serverSelf.fatigue,status:cityRest.textContent,caption:cityArtCaption.textContent,width:cityScene.naturalWidth,src:cityScene.src}));
    assert(state.status.includes('자동 회복'),'rest state visible');assert(state.caption.includes('상상도'),'art caption visible');
    await page.screenshot({path:path.join(out,name+'.jpg')});
    await page.setViewport({width:390,height:844,deviceScaleFactor:1});await delay(150);
    const bounds=await page.evaluate(()=>{const r=cityRest.getBoundingClientRect(),c=document.getElementById('cityCard').getBoundingClientRect();return{restVisible:r.top>=0&&r.bottom<=innerHeight,cardFits:c.left>=0&&c.right<=innerWidth&&c.bottom<=innerHeight}});
    assert(bounds.restVisible&&bounds.cardFits,'mobile rest and buttons fit');
    await page.screenshot({path:path.join(out,name+'-mobile.jpg')});
    await page.click(sea?'#departCityBtn':'#leaveCityBtn');
    await page.waitForFunction(wanted=>mode===wanted&&!serverSelf.transition,{},sea?'sea':'land');
    results.push(state);
  }
  assert(await page.evaluate(()=>!['saru_ainu_settlement','buenos_aires','original_city_123','original_city_000'].some(id=>cityCatalogById.has(id))),'unverified and later cities excluded');
  assert(errors.length===0,JSON.stringify(errors));console.log(JSON.stringify({ok:true,results,mobile:true,errors}));
`+s.slice(end);
fs.writeFileSync(path.join(out,'check.cjs'),s);
