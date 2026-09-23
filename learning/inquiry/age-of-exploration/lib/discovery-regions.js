'use strict';
const ArrivalZones=require('./arrival-zones');
const GeoMotion=require('../public/js/geo-motion');
const {regions}=require('../data/catalog/discovery-regions.json');

function createRegionAccess(id,terrainAtCell,terrain,radius){
  const region=regions[id];if(!region)throw Error('Missing discovery region: '+id);
  const {WORLD_PIXEL_W:width,WORLD_PIXEL_H:height,TILE:tile}=terrain;
  const {bounds,polygons}=region;
  const outerPoints=polygons.flatMap(poly=>poly[0]).map(([lat,lon])=>({x:(lon+180)/360*width,y:(90-lat)/180*height}));
  return (player,canUse)=>{
    const {lat,lon}=ArrivalZones.pixelToLatLon(player.x,player.y,width,height);
    const insideBounds=lat>=bounds.south&&lat<=bounds.north&&lon>=bounds.west&&lon<=bounds.east;
    const inside=insideBounds&&polygons.some(([shell,...holes])=>ArrivalZones.pointInPolygon(lat,lon,shell)&&!holes.some(hole=>ArrivalZones.pointInPolygon(lat,lon,hole)));
    if(inside&&player.mode==='land'&&terrainAtCell(Math.floor(player.x/tile),Math.floor(player.y/tile)).type!=='sea'){
      return {distance:0,canUse};
    }
    // Coastal regions such as Namib may be read from a nearby boat, as before.
    // Land-only mountains never become reachable merely by sailing past them.
    if(player.mode!=='sea'||!canUse)return {distance:Infinity,canUse};
    const latPad=radius/height*180,lonPad=radius/width*360/GeoMotion.MIN_LONGITUDE_SCALE;
    if(lat<bounds.south-latPad||lat>bounds.north+latPad||lon<bounds.west-lonPad||lon>bounds.east+lonPad)return {distance:Infinity,canUse};
    let nearest=Infinity,closest=null;
    for(const point of outerPoints){
      const d=GeoMotion.greatCircleDistancePixels(player.x,player.y,point.x,point.y,width,height);
      if(d<nearest){nearest=d;closest=point;}
    }
    return {distance:nearest,canUse,markerPoint:closest};
  };
}
module.exports={createRegionAccess};
