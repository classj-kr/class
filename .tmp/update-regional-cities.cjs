'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve('learning/inquiry/age-of-exploration');
const read=f=>fs.readFileSync(path.join(root,f),'utf8').replace(/\r\n/g,'\n');
const write=(f,s)=>fs.writeFileSync(path.join(root,f),s);
const json=f=>JSON.parse(read(f));
const save=(f,x)=>write(f,JSON.stringify(x,null,2)+'\n');
const replace=(f,a,b)=>{const s=read(f);if(!s.includes(a))throw Error('Missing target: '+f+' '+a.slice(0,50));write(f,s.replace(a,b));};
const sites=json('data/catalog/regional-sites.json');
sites.settlements=sites.settlements.filter(s=>s.id!=='saru_ainu_settlement');
for(const site of sites.settlements){
 site.artKey=site.id==='tokuyama_ezo'?'tokuyama-ezo':site.id;
 site.interiorImageCaption='역사 자료를 참고한 상상도';
 site.historicalEvidence={status:'attested',attestedByYear:{kyongsong:1398,hoeryong:1434,kaminokuni:1470,tokuyama_ezo:1514}[site.id],basis:site.in1520,sources:site.story.sources};
}
sites.settlements.find(s=>s.id==='kaminokuni').story.sources.push({title:'가미노쿠니정: 가츠야마다테 유적',url:'https://www.town.kaminokuni.lg.jp/hotnews/detail_sp/00000285.html'});
save('data/catalog/regional-sites.json',sites);
const retired={
 buenos_aires:{year:1536,source:'https://buenosaires.gob.ar/gcaba_historico/laciudad/ciudad'},
 original_city_123:{year:1652,source:'https://www.capetown.gov.za/Local%20and%20communities/Heritage-and-the-community/Our-history-and-heritage/What-is-our-history'},
 original_city_000:{year:1545,source:'https://potosi.bo/history/'}
};
const original=json('data/catalog/original-cities.json');
for(const city of original){if(!retired[city.id])continue;city.retired=true;city.displayOnMap=false;city.retiredReason=`도시 성립 ${retired[city.id].year}년: 1520년 도시로 사용하지 않음`;city.historicalEvidence={status:'after-start-year',foundedYear:retired[city.id].year,sources:[retired[city.id].source]};}
save('data/catalog/original-cities.json',original);
const ships=json('data/catalog/ship-origins.json');
for(const id of Object.keys(retired))delete ships.ports[id];
save('data/catalog/ship-origins.json',ships);
replace('public/index.html','<div id="cityInfo"></div>','<div id="cityInfo"><div id="cityContext"></div><div id="cityRest"></div><small id="cityArtCaption"></small></div>');
replace('public/index.html',"function renderCityView(){","const cityContext=document.getElementById('cityContext'),cityRest=document.getElementById('cityRest'),cityArtCaption=document.getElementById('cityArtCaption');\nfunction renderCityView(){");
replace('public/index.html','cityInfo.textContent=catalogCity?.in1520','cityContext.textContent=catalogCity?.in1520');
replace('public/index.html',"openedBookId='';closeLibrary()}\n}","openedBookId='';closeLibrary()}\n  const fatigue=Math.max(0,Number(serverSelf.fatigue)||0);\n  cityRest.textContent=classSettings.paused?'휴식 일시정지':fatigue>0?`휴식 중 · 피로도 ${Math.ceil(fatigue)}% · 자동 회복`:'휴식 완료 · 피로도 0%';\n  cityArtCaption.textContent=catalogCity?.interiorImageCaption||'';\n}");
replace('public/index.html','</style>','#cityRest{margin-top:5px;font-size:14px;font-weight:700;color:#e9f3d5}#cityArtCaption{display:block;margin-top:3px;font-size:10px;color:#cbd5d3}\n</style>');
replace('tests/interaction-recovery-smoke.js',"stopPlayer(p);p.transition=null;p.mode=message.mode==='sea'?'sea':'land';p.currentCityId=null;","stopPlayer(p);p.transition=null;p.mode=message.mode==='sea'?'sea':'land';p.currentCityId=null;\n      if(Number.isFinite(message.fatigue))p.fatigue=Fatigue.clamp(message.fatigue);");
replace('tests/v52-city-interior-unit.js',"const live=cities.filter(c=>!c.retired);\nconst keys=new Set(live.map(c=>c.artKey));","const regional=require('../data/catalog/regional-sites.json').settlements;\nconst live=[...cities.filter(c=>!c.retired),...regional];\nconst keys=new Set([...cities,...regional].filter(c=>c.artKey).map(c=>c.artKey));");
replace('tests/v52-city-interior-unit.js',"assert.equal(keys.size,live.length,'도시마다 그림 이름이 하나씩');","assert.equal(new Set(live.map(c=>c.artKey)).size,live.length,'도시마다 그림 이름이 하나씩');");
replace('tests/original-city-catalog-unit.js',"assert.equal(retired.length, 1, '숨긴 도시는 멕시코 한 곳뿐이어야 함');\nassert.equal(retired[0].name, '멕시코');","assert.deepEqual(retired.map(c=>c.id).sort(),['original_city_024','original_city_123','buenos_aires','original_city_000'].sort(),'중복 도시와 1520년 이후 도시 제외');");
replace('tests/original-city-catalog-unit.js',"assert.equal(live.length, 228, '게임에 나오는 도시는 228곳');","assert.equal(live.length, 225, '시대 검토를 통과한 기존 도시 225곳');");
replace('tests/v83-city-story-unit.js',"const cities = read('data/catalog/original-cities.json').filter((city) => !city.retired);","const knownCities = read('data/catalog/original-cities.json');\nconst cities = knownCities.filter((city) => !city.retired);");
replace('tests/v83-city-story-unit.js',"for (const id of byId.keys()) assert.ok(cities.some","for (const id of byId.keys()) assert.ok(knownCities.some");
replace('tests/v83-city-story-unit.js','const keys = new Set(cities.map','const keys = new Set(knownCities.map');
console.log('Updated historical city data, rest status, and regression checks.');
