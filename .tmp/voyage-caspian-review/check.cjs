const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const root='E:/webprojects/class';
fs.mkdirSync(path.join(__dirname,'runtime'),{recursive:true});
let source=fs.readFileSync(path.join(root,'.tmp/voyage-interactions-review/check.cjs'),'utf8')
  .replaceAll('voyage-interactions-review','voyage-caspian-review')
  .replaceAll('31487','31527').replaceAll('31488','31528');
const start=source.indexOf('  await place({lat:-0.83'),end=source.indexOf(' }finally');
if(start<0||end<start)throw Error('harness boundary missing');
source=source.slice(0,start)+`
  await place({lat:40.90,lon:52.87});
  await page.evaluate(()=>{zoom=3.0;zoomManuallyAdjusted=true});
  await page.waitForFunction("discoveryInteraction?.id==='caspian-sea'&&!discoveryActionBtn.disabled");
  await delay(600);await page.screenshot({path:path.join(out,'caspian-shore.jpg')});
  await page.click('#discoveryActionBtn');
  await page.waitForFunction("discoveryView.classList.contains('show')&&discoveryName.textContent.includes('카스피해')");
  await page.click('#discoveryClose');
  const marker=await page.evaluate(()=>{
    const item=discoveryPoints.find(d=>d.id==='caspian-sea'),point=discoveryMapPoint(item);
    return {screen:screenPoint(point.x,point.y,innerWidth,innerHeight),moved:point.x!==item.x||point.y!==item.y};
  });
  assert(marker.moved,'marker must be near the reachable shore');
  await page.mouse.click(marker.screen.x,marker.screen.y);
  await page.waitForFunction("discoveryView.classList.contains('show')&&discoveryName.textContent.includes('카스피해')");
  await page.screenshot({path:path.join(out,'caspian-description.jpg')});
  assert(errors.length===0,JSON.stringify(errors));
  console.log(JSON.stringify({ok:true,reportedCoordinates:true,landDiscoveryButton:true,shoreMarkerClick:true,errors}));
`+source.slice(end);
const mod=new Module(__filename,module);mod.filename=__filename;mod.paths=module.paths;mod._compile(source,__filename);
