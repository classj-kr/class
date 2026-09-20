const BASE = new URL('./data/', import.meta.url);
export const CLIMATE_COLORS = {A:'#39b982',B:'#e8bb65',C:'#eaa5a4',D:'#739bd0',E:'#d5d0e5'};
export const CLIMATE_LEGEND = [['#39b982','열대'],['#e8bb65','건조'],['#eaa5a4','온대'],['#739bd0','냉대'],['#d5d0e5','한대']];
export const DENSITY_LEGEND = [['#f2efb2','0–25 미만'],['#d5d776','25–100 미만'],['#efa55f','100–300 미만'],['#dc6b55','300–1,000 미만'],['#a33b63','1,000 이상'],['#75818d','자료 없음']];
const PLATE_COLORS = ['match',['get','LABEL'],'Convergent Boundary','#ffad78','Divergent Boundary','#65dfd5','Transform Boundary','#caadff','#b6bdc6'];
export async function installAtlasLayers(map, onPick) {
  const empty={type:'FeatureCollection',features:[]};
  const before='highlight-fill';
  map.addSource('atlas-countries',{type:'geojson',data:empty});
  map.addLayer({id:'atlas-density',type:'fill',source:'atlas-countries',layout:{visibility:'none'},paint:{'fill-color':['case',['==',['get','density'],null],'#75818d',['step',['coalesce',['get','density'],0],'#f2efb2',25,'#d5d776',100,'#efa55f',300,'#dc6b55',1000,'#a33b63']],'fill-opacity':.77}},before);
  map.addSource('atlas-plates',{type:'geojson',data:empty});
  map.addLayer({id:'atlas-plates-line',type:'line',source:'atlas-plates',layout:{visibility:'none'},paint:{'line-color':PLATE_COLORS,'line-width':2.3}},'labels-1');
  map.addSource('atlas-spots',{type:'geojson',data:empty});
  map.addLayer({id:'atlas-spots-ring',type:'circle',source:'atlas-spots',paint:{'circle-radius':9,'circle-color':'#9cf4cd','circle-opacity':.15,'circle-stroke-color':'#cbffe2','circle-stroke-width':1.2}});
  map.addLayer({id:'atlas-spots-dot',type:'circle',source:'atlas-spots',paint:{'circle-radius':7,'circle-color':'#245146'}});
  map.addLayer({id:'atlas-spots-number',type:'symbol',source:'atlas-spots',layout:{'text-field':['to-string',['+',['get','index'],1]],'text-font':['Pretendard','Noto Sans KR','Malgun Gothic','sans-serif'],'text-size':11,'text-allow-overlap':true},paint:{'text-color':'#ecfff4','text-halo-color':'#123e37','text-halo-width':1.5}});
  const cached=new Map();
  async function load(id){
    if(!cached.has(id)) cached.set(id,(async()=>{
      const response=await fetch(new URL(`atlas-${id==='density'?'countries':id}.json?v=20260920-18`,BASE));
      if(!response.ok)throw Error('지도 자료를 불러오지 못했습니다.');
      const json=await response.json();
      if(id==='climate') {
        const canvas=climateCanvas(json);
        map.addSource('atlas-climate',{type:'image',url:canvas.toDataURL(),coordinates:[[-180,85.05112878],[180,85.05112878],[180,-85.05112878],[-180,-85.05112878]]});
        map.addLayer({id:'atlas-climate-fill',type:'raster',source:'atlas-climate',layout:{visibility:'none'},paint:{'raster-opacity':.7,'raster-resampling':'nearest','raster-fade-duration':0}},before);
      } else map.getSource(id==='density'?'atlas-countries':'atlas-plates').setData(json);
    })().catch(error=>{cached.delete(id);throw error;}));
    return cached.get(id);
  }
  let generation=0,active=null;
  map.on('click',event=>{
    const spots=map.queryRenderedFeatures(event.point,{layers:['atlas-spots-ring']});
    if(spots.length){onPick({text:spots[0].properties.why,spot:Number(spots[0].properties.index)});return;}
    if(active==='density') {
      const [feature]=map.queryRenderedFeatures(event.point,{layers:['atlas-density']});
      if(feature){const p=feature.properties;onPick({text:`${p.name} · ${p.density==null?'자료 없음':Number(p.density).toLocaleString('ko-KR',{maximumFractionDigits:1})+'명/육지 km²'} · 2023년 국가·지역 평균`});}
    }
  });
  return {
    async show(id){
      const version=++generation; active=null;
      for(const layer of ['atlas-density','atlas-climate-fill','atlas-plates-line'])if(map.getLayer(layer))map.setLayoutProperty(layer,'visibility','none');
      if(!id)return;
      await load(id);if(version!==generation)return;
      active=id;
      map.setLayoutProperty({density:'atlas-density',climate:'atlas-climate-fill',plates:'atlas-plates-line'}[id],'visibility','visible');
    },
    spots(list){map.getSource('atlas-spots').setData({type:'FeatureCollection',features:list.map((s,index)=>({type:'Feature',properties:{name:s.name,why:s.why,index},geometry:{type:'Point',coordinates:s.at}}))});},
  };
}
export function decodeClimate(grid){
  const cells=new Uint8Array(grid.width*grid.height); let offset=0;
  for(const match of grid.runs.matchAll(/([^0-9a-z])([0-9a-z]+)/g)){
    const count=parseInt(match[2],36);cells.fill(match[1].charCodeAt(0),offset,offset+count);offset+=count;
  }
  if(offset!==cells.length)throw Error('기후 격자 길이가 맞지 않습니다.');
  return cells;
}
function climateCanvas(grid){
  const cells=decodeClimate(grid),canvas=document.createElement('canvas');canvas.width=canvas.height=1024;
  const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(1024,1024);
  const colors=Object.fromEntries(Object.entries(CLIMATE_COLORS).map(([k,h])=>[k.charCodeAt(0),[1,3,5].map(i=>parseInt(h.slice(i,i+2),16))]));
  for(let y=0;y<1024;y++){
    const lat=Math.atan(Math.sinh(Math.PI*(1-2*(y+.5)/1024)))*180/Math.PI;
    const row=Math.min(grid.height-1,Math.max(0,Math.floor((90-lat)/grid.step)));
    for(let x=0;x<1024;x++){
      const color=colors[cells[row*grid.width+Math.floor((x+.5)*grid.width/1024)]];
      if(color)pixels.data.set([...color,255],(y*1024+x)*4);
    }
  }
  ctx.putImageData(pixels,0,0);return canvas;
}
