const fs = require('node:fs'), path = require('node:path'), Module = require('node:module');
const root = 'E:/webprojects/class';
const file = path.join(root, '.tmp/voyage-interactions-review/check.cjs');
fs.mkdirSync(path.join(__dirname, 'runtime'), {recursive:true});
let source = fs.readFileSync(file, 'utf8')
  .replaceAll('voyage-interactions-review', 'voyage-northeast-review')
  .replaceAll('31487', '31517').replaceAll('31488', '31518');
const start = source.indexOf("  await place({lat:-0.83");
const end = source.indexOf(' }finally');
if (start < 0 || end < start) throw Error('browser harness boundary missing');
source = source.slice(0, start) + `
  const expected=['kyongsong','hoeryong','kaminokuni','tokuyama_ezo','saru_ainu_settlement'];
  assert(await page.evaluate(ids=>ids.every(id=>mapCities.some(c=>c.id===id)),expected),'all new settlements load on the map');
  await place({lat:44,lon:134,mode:'sea'});
  await page.evaluate(()=>{zoom=.65;zoomManuallyAdjusted=true});await delay(900);
  await page.screenshot({path:path.join(out,'northeast-map.jpg')});
  await place({city:'사루강 아이누 취락'});
  await page.waitForFunction("cityInteraction?.placeId==='saru_ainu_settlement'&&!cityActionBtn.disabled");
  await delay(500);await page.screenshot({path:path.join(out,'ainu-map.jpg')});
  await page.click('#cityActionBtn');await page.waitForFunction("mode==='city'&&storyBtn.textContent==='취락 설명'");
  await page.click('#storyBtn');await page.waitForFunction("discoveryView.classList.contains('show')");
  assert(await page.evaluate(()=>discoveryName.textContent==='사루강 아이누 취락 설명'),'settlement description title');
  assert(await page.evaluate(()=>discoveryText.textContent.includes('특정 마을의 이름과 정확한 위치를 복원한 것은 아닙니다')),'representative location clearly explained');
  await page.screenshot({path:path.join(out,'ainu-description.jpg')});
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});
  await page.screenshot({path:path.join(out,'ainu-description-mobile.jpg')});
  assert(errors.length===0,JSON.stringify(errors));
  console.log(JSON.stringify({ok:true,mapSettlements:expected.length,settlementDescription:true,errors}));
` + source.slice(end);
const mod = new Module(__filename, module);mod.filename=__filename;mod.paths=module.paths;mod._compile(source,__filename);
