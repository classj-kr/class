'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Icons=require('../public/js/city-icons');
const catalog=require('../lib/mission-catalog');
const cities=catalog.publicCatalog().places.filter(c=>c.isOriginalCity);
for(const city of cities){
  const icon=Icons.appearance(city);
  assert.ok(Icons.styles[icon.culture], city.name);
  assert.equal(icon.port,catalog.hasVerifiedSeaAccess(city),city.name+' anchor must match verified entry');
  const small=Icons.metrics(city,.45),large=Icons.metrics(city,3);
  assert.ok(large.scale>small.scale);
  assert.ok(Number.isFinite(large.top)&&large.right>large.left);
}
for(const name of ['아테네','튀니스','리마']) assert.equal(Icons.appearance(cities.find(c=>c.name===name)).port,false,name);
for(const [name,culture] of [['서울','korean'],['교토','japanese'],['베이징','chinese'],['라사','tibetan'],['하르호린','steppe'],['그레이트짐바브웨','african']])assert.equal(Icons.appearance(cities.find(c=>c.name===name)).culture,culture,name);
const town=Icons.metrics({originalCitySize:2}),capital=Icons.metrics({originalCitySize:3});
assert.ok(capital.right-capital.left>town.right-town.left,'Large cities need a wider footprint');
assert.ok(capital.top<town.top);
assert.equal(Icons.appearance({access:'port',canEnterFromSea:true,verifiedSeaAccess:false}).port,false);
assert.equal(Icons.appearance({access:'port'}).port,false);
// Exercise every architecture through the drawing API without a browser.
let balance=0;
const ctx=new Proxy({save(){balance++},restore(){balance--}},{get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>(o[k]=v,true)});
for(const culture of Object.keys(Icons.styles))for(const size of [1,2,3])for(const port of [false,true])Icons.draw(ctx,{iconCulture:culture,originalCitySize:size,canEnterFromSea:port},50,50,1,true);
assert.equal(balance,0,'Canvas state must be restored');
// Two colocated cities still draw two buildings, even though one name is culled.
const html=fs.readFileSync(require('node:path').join(__dirname,'../public/index.html'),'utf8');
const renderer=html.slice(html.indexOf('function drawCityLabels('),html.indexOf('function medalText('));
const drawn=[],labels=[];
const context={mapCities:[{id:'a',name:'Town A',originalIndex:1,cityPoint:{x:100,y:100}},{id:'b',name:'Town B',originalIndex:2,cityPoint:{x:100,y:100}}],activeMission:{targetPlace:{id:'b'}},zoom:1,screenPoint:(x,y)=>({x,y}),VoyageCityIcons:{metrics:Icons.metrics,draw:(...args)=>drawn.push({id:args[1].id,selected:args[5]})},ctx:{save(){},restore(){},measureText:()=>({width:45}),strokeText(){},fillText:t=>labels.push(t)}};
vm.runInNewContext(renderer+';drawCityLabels(800,600,0,0)',context);
assert.equal(drawn.length,2);
assert.deepEqual(drawn[1],{id:'b',selected:true});
assert.deepEqual(labels,['Town B']);
console.log(JSON.stringify({ok:true,cities:cities.length,cultures:Object.keys(Icons.styles).length,ports:cities.filter(c=>Icons.appearance(c).port).length,overlapKeepsIcons:true}));
