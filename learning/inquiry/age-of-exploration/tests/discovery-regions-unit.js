'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Terrain=require('../public/js/terrain'),GeoMotion=require('../public/js/geo-motion');
const {createDiscoveryAccess}=require('../lib/discovery-access');
const regions=require('../data/catalog/discovery-regions.json').regions;
const base=path.resolve(__dirname,'..'),buffer=fs.readFileSync(path.join(base,'data/world/WORLD.CDS'));
const world=new Uint16Array(buffer.buffer,buffer.byteOffset,buffer.length/2);
Terrain.setNaturalEarthLandMask(fs.readFileSync(path.join(base,'data/world/NATURAL_EARTH_LAND_MASK.bin')));
const point=(lat,lon)=>({x:(lon+180)/360*Terrain.WORLD_PIXEL_W,y:(90-lat)/180*Terrain.WORLD_PIXEL_H});
const items=require('../data/catalog/discoveries.json').filter(d=>d.discoveryArea?.type==='region').map(d=>({...d,...point(d.lat,d.lon)}));
assert.equal(items.length,19);assert.deepEqual(items.map(d=>d.id).sort(),Object.keys(regions).sort());
const nearby=createDiscoveryAccess(items,(x,y)=>Terrain.terrainAtCell(world,x,y),Terrain,3.2);
const radius=3.2*Terrain.TILE;
function allowed(id,lat,lon,mode='land',transition=null){const r=nearby({...point(lat,lon),mode,transition},items.find(d=>d.id===id));return r.canUse&&r.distance<=radius;}
for(const item of items){
  assert.ok(allowed(item.id,item.lat,item.lon,item.reach==='any'?'sea':'land'),item.name+' marker remains accessible');
  assert.equal(allowed(item.id,0,0),false,item.name+' excludes remote points');
  assert.equal(allowed(item.id,item.lat,item.lon,'city'),false,'city interior does not count');
  assert.equal(allowed(item.id,item.lat,item.lon,'land',{}),false,'transitions must finish');
  if(item.reach==='land')assert.equal(allowed(item.id,item.lat,item.lon,'sea'),false,'sailing does not complete an inland region');
}
const distant={alps:[47,13],andes:[-33,-70],sahara:[26,-5],'rocky-mountains':[43.8,-110.8],'gobi-desert':[44,102],'ural-mountains':[65,60],himalayas:[29.5,81],'tibetan-plateau':[33,85],'namib-desert':[-24.5,15]};
for(const[id,[lat,lon]]of Object.entries(distant)){
  const item=items.find(d=>d.id===id),p=point(lat,lon);
  assert.ok(GeoMotion.greatCircleDistancePixels(p.x,p.y,item.x,item.y,Terrain.WORLD_PIXEL_W,Terrain.WORLD_PIXEL_H)>radius,'point must reproduce old radius failure: '+id);
  assert.ok(allowed(id,lat,lon),'distant part of same region: '+id);
  assert.equal(nearby({...p,mode:'land'},item).markerPoint,undefined,'the region marker stays fixed while its action is available throughout the region');
}
for(const[id,lat,lon]of[['alps',48.8,2.3],['andes',-20,-55],['sahara',5,13],['gobi-desert',39.9,116.4],['himalayas',27.2,78],['namib-desert',-24.5,10]]){
  assert.equal(allowed(id,lat,lon),false,'nearby country or ocean is not the region: '+id);
}
// Generalized polygons must not turn visible water into an on-foot arrival area.
const wet=createDiscoveryAccess(items,()=>({type:'sea'}),Terrain,3.2);
assert.equal(wet({...point(47,13),mode:'land'},items.find(d=>d.id==='alps')).distance,Infinity);
console.log(JSON.stringify({ok:true,regions:items.length,distantLocations:Object.keys(distant).length,remoteAndWrongModeRejected:true}));
