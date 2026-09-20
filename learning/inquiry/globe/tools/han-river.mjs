// Detailed main channels come from the local OSM extract used by the Korea map.
// Keep the existing Natural Earth headwater reach above the named Namhan River.
export function buildHanRiver(majorRivers, previous) {
  const channel=name=>{
    const f=majorRivers.features.find(f=>f.properties.name===name);
    if(!f)throw Error(`Missing Han tributary: ${name}`);
    const lines=f.geometry.type==='LineString'?[f.geometry.coordinates]:f.geometry.coordinates;
    return lines.reduce((a,b)=>a.length>b.length?a:b).map(p=>p.slice());
  };
  const south=channel('남한강'),north=channel('북한강'),lower=channel('한강');
  const junction=south.at(-1);
  if(Math.hypot(...north.at(-1).map((v,i)=>v-junction[i]))>.001)throw Error('Han tributaries do not meet');
  if(Math.hypot(...lower[0].map((v,i)=>v-junction[i]))>.001)lower.reverse();
  if(Math.hypot(...lower[0].map((v,i)=>v-junction[i]))>.001)throw Error('Han downstream channel is disconnected');
  const headwater=previous.geometry.coordinates.reduce((a,b)=>a.length>b.length?a:b);
  const target=south[0];let closest={distance:Infinity};
  for(let i=0;i<headwater.length-1;i++){
    const a=headwater[i],b=headwater[i+1],dx=b[0]-a[0],dy=b[1]-a[1];
    const t=Math.max(0,Math.min(1,((target[0]-a[0])*dx+(target[1]-a[1])*dy)/(dx*dx+dy*dy)));
    const distance=Math.hypot(a[0]+t*dx-target[0],a[1]+t*dy-target[1]);
    if(distance<closest.distance)closest={distance,index:i};
  }
  if(closest.distance>.02)throw Error('Cannot safely connect the existing headwater reach');
  const round=line=>line.map(p=>p.map(v=>Math.round(v*10000)/10000));
  return {...previous,properties:{...previous.properties,branches:['남한강','북한강','한강 하류'],source:'OpenStreetMap contributors (ODbL); Natural Earth headwaters'},geometry:{type:'MultiLineString',coordinates:[round(headwater.slice(0,closest.index+1).concat(south)),round(north),round(lower)]}};
}
