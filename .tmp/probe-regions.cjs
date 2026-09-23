const fs=require('node:fs'),path=require('node:path');const base=path.resolve(__dirname,'../learning/inquiry/age-of-exploration');
const T=require(path.join(base,'public/js/terrain')),data=fs.readFileSync(path.join(base,'data/world/WORLD.CDS')),world=new Uint16Array(data.buffer,data.byteOffset,data.length/2);
T.setNaturalEarthLandMask(fs.readFileSync(path.join(base,'data/world/NATURAL_EARTH_LAND_MASK.bin')));
const point=(lat,lon)=>({x:(lon+180)/360*T.WORLD_PIXEL_W,y:(90-lat)/180*T.WORLD_PIXEL_H});
const items=require(path.join(base,'data/catalog/discoveries.json')).filter(d=>d.discoveryArea?.type==='region').map(d=>({...d,...point(d.lat,d.lon)}));
const access=require(path.join(base,'lib/discovery-access')).createDiscoveryAccess(items,(x,y)=>T.terrainAtCell(world,x,y),T,3.2);
const additional={alps:[47,13],andes:[-33,-70],sahara:[26,-5],'rocky-mountains':[43.8,-110.8],'gobi-desert':[44,102],'ural-mountains':[65,60],himalayas:[29.5,81],'tibetan-plateau':[33,85],'namib-desert':[-24.5,15]};
for(const d of items){for(const[which,[lat,lon]]of Object.entries({marker:[d.lat,d.lon],...(additional[d.id]?{distant:additional[d.id]}:{})})){const p={...point(lat,lon),mode:'land'},r=access(p,d);console.log(JSON.stringify({id:d.id,which,lat,lon,terrain:T.terrainAtPixel(world,p.x,p.y).type,allowed:r.canUse&&r.distance<=T.TILE*3.2,distance:r.distance}));}}
