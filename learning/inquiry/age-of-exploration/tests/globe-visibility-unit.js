'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const page=fs.readFileSync(path.join(__dirname,'../public/index.html'),'utf8');
const source=page.slice(page.indexOf('function globeScreenPoint('),page.indexOf('\nstartGlobeMap();'));
const SPAN=40000,MAP_H=20000;
function projectWith(map,lon,lat){
  const context={globeMap:map,MAP_H,mapLonAt:x=>((x/SPAN*360)%360+360)%360-180};
  vm.runInNewContext(source,context);
  return context.globeScreenPoint((lon+180)/360*SPAN,(90-lat)/180*MAP_H);
}
const hidden=p=>p.x===-99999&&p.y===-99999;
// Reproduced at 55.96 S, 0.17 W: these distant locations can have valid screen
// coordinates despite lying behind the globe. Projection alone is insufficient.
let projected=0,checked;
const map={_camera:{transform:{isLocationOccluded:ll=>(checked=ll,true)}},project(){projected++;return{x:40,y:60};}};
assert.ok(hidden(projectWith(map,72.58,23.03)),'Ahmedabad must not leak onto the Southern Ocean');
assert.ok(Math.abs(checked.lng-72.58)<1e-8&&Math.abs(checked.lat-23.03)<1e-8);
assert.equal(projected,0,'Do not project a hidden location');
map._camera.transform.isLocationOccluded=()=>false;
assert.deepEqual({...projectWith(map,18.42,-33.93)},{x:40,y:60},'Visible Cape Town keeps its projected position');
assert.deepEqual({...projectWith(map,179.9,-55)},{x:40,y:60},'Visible points near the date line are not angle-clipped');
map.project=()=>({x:NaN,y:Infinity});
assert.ok(hidden(projectWith(map,0,-55)),'Invalid projections must not reach canvas');
assert.ok(hidden(projectWith(map,NaN,-55)));
// Fallback for a future library without the bundled transform: only a point on
// the visible surface returns to its own coordinates through unproject().
const fallback={project:()=>({x:80,y:90}),unproject:()=>({lng:72.58,lat:-55.96})};
assert.ok(hidden(projectWith(fallback,72.58,23.03)));
fallback.unproject=()=>({lng:180.1,lat:-55});
assert.deepEqual({...projectWith(fallback,-179.9,-55)},{x:80,y:90},'Equivalent wrapped longitude stays visible');
fallback.unproject=()=>({lng:NaN,lat:-55});
assert.ok(hidden(projectWith(fallback,0,-55)));
console.log(JSON.stringify({ok:true,hiddenBeforeProjection:true,visibleCitiesPreserved:true,dateLine:true,invalidCoordinates:true,publicApiFallback:true}));
