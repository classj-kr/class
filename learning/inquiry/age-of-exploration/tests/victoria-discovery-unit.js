'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Terrain=require('../public/js/terrain');
const {createDiscoveryAccess}=require('../lib/discovery-access');
const project=path.resolve(__dirname,'..');
const bytes=fs.readFileSync(path.join(project,'data/world/WORLD.CDS'));
const world=new Uint16Array(bytes.buffer,bytes.byteOffset,bytes.length/2);
Terrain.setNaturalEarthLandMask(fs.readFileSync(path.join(project,'data/world/NATURAL_EARTH_LAND_MASK.bin')));
const point=(lat,lon)=>({x:(lon+180)/360*Terrain.WORLD_PIXEL_W,y:(90-lat)/180*Terrain.WORLD_PIXEL_H});
const raw=require('../data/catalog/discoveries.json').find(d=>d.id==='lake-victoria');
const item={...raw,...point(raw.lat,raw.lon)};
const access=createDiscoveryAccess([item],(x,y)=>Terrain.terrainAtCell(world,x,y),Terrain,3.2);
const allowed=(lat,lon,mode='land')=>{const result=access({...point(lat,lon),mode},item);return result.canUse&&result.distance<=3.2*Terrain.TILE;};
for(const[name,lat,lon]of[['north',.216,33.048],['west',-.936,31.752],['east',-.936,34.2],['south',-2.52,32.76]]){
  const p=point(lat,lon);
  assert.notEqual(Terrain.terrainAtPixel(world,p.x,p.y).type,'sea',name+' approach must actually be land');
  assert.ok(allowed(lat,lon),name+' shore must count as reaching Lake Victoria');
  assert.ok(access({...p,mode:'land'},item).markerPoint,name+' action marker must follow the accessible shore');
}
assert.equal(allowed(-1,33),false,'walking at the lake centre is not a valid arrival');
assert.equal(allowed(-1,36),false,'remote inland point must not count');
assert.equal(allowed(-6,29.5,'sea'),false,'another lake must not count');
assert.equal(allowed(.216,33.048,'city'),false,'city state must not reuse land position');
assert.equal(Terrain.terrainAtPixel(world,item.x,item.y).type,'sea','the lake must remain water');
console.log(JSON.stringify({ok:true,lake:'Victoria',shores:4,remoteRejected:true,markerAtShore:true}));
