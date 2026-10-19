'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../public/index.html'),'utf8');
const source=html.slice(html.indexOf('function discoveryMapPoint('),html.indexOf('function drawStudyTargetMarkers('));
const ctx={
  activeMission:{studyTargets:[{key:'discovery:lake-victoria',name:'빅토리아호'},{key:'city:lisbon',name:'리스본'}]},
  missionProgress:{studyPlaces:[]},
  discoveryPoints:[{id:'lake-victoria',x:100,y:200},{id:'victoria-falls',x:300,y:400}],
  mapCities:[{id:'lisbon',cityPoint:{x:20,y:30}}],
  discoveryInteraction:null,
};
vm.createContext(ctx);vm.runInContext(source,ctx);
let targets=ctx.studyMapTargets();
assert.equal(targets.length,2);
assert.equal(targets[0].key,'discovery:lake-victoria');
assert.equal(targets[0].completed,false);
assert.equal(targets[1].point.x,20);
ctx.discoveryInteraction={id:'lake-victoria',markerPoint:{x:110,y:210}};
ctx.missionProgress={studyPlaces:[{key:'discovery:victoria-falls',phase:'completed'},{key:'discovery:lake-victoria',phase:'quiz'}]};
targets=ctx.studyMapTargets();
assert.equal(targets[0].point.x,110,'use the reachable shoreline marker');
assert.equal(targets[0].completed,false,'a discovery or another Victoria location does not finish this mission');
ctx.missionProgress.studyPlaces[1].phase='completed';
assert.equal(ctx.studyMapTargets()[0].completed,true);
ctx.activeMission=null;
assert.equal(ctx.studyMapTargets().length,0,'clearing the mission removes its markers');
console.log('Mission target identity, shoreline position and completion markers passed');
