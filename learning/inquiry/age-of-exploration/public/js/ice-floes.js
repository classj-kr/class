(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.VoyageIceFloes=factory()})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const hash=(x,y)=>{let h=(x*374761393+y*668265263)|0;h=(h^(h>>>13))*1274126177|0;return ((h^(h>>>16))>>>0)/4294967296};
  function build({terrain,worldWidth,worldHeight,tile,bounds,day,isSea}){
    const result=[],span=worldWidth*tile,height=worldHeight*tile,rowSize=2*tile;
    const y0=Math.max(0,Math.floor(bounds.top/rowSize)),y1=Math.min(Math.ceil(height/rowSize)-1,Math.ceil(bounds.bottom/rowSize));
    for(let row=y0;row<=y1;row++){
      const y=(row+.5)*rowSize,lat=90-y/height*180;
      if(lat<terrain.ICE_EDGE_MIN.winter-1&&lat>-58)continue;
      // Equal ground distances: polar ice must not become long north/south streaks.
      const cols=Math.max(8,Math.round(worldWidth/2*Math.cos(lat*Math.PI/180))),columnSize=span/cols;
      const first=Math.floor(bounds.left/columnSize),last=Math.min(first+cols-1,Math.ceil(bounds.right/columnSize));
      for(let raw=first;raw<=last;raw++){
        const col=((raw%cols)+cols)%cols,x=(raw+.5)*columnSize;
        const cx=x+(hash(col+11,row+5)-.5)*columnSize*.85,cy=y+(hash(col+7,row+19)-.5)*rowSize*.85;
        const sampleLon=(((cx/span*360)%360)+360)%360-180,sampleLat=90-cy/height*180;
        const density=terrain.seaIceConcentrationAt(sampleLon,sampleLat,day);
        if(density<.04||hash(col,row)>density*.95||!isSea(cx,cy))continue;
        const size=(.22+hash(col+53,row+29)*.40)*(.20+.80*Math.sqrt(density));
        const sides=5+Math.floor(hash(col+17,row+37)*4),angle=hash(col+23,row+43)*Math.PI*2;
        const points=Array.from({length:sides},(_,i)=>{const a=angle+i*Math.PI*2/sides,r=size*(.72+hash(col+i+41,row+31)*.38);return{x:cx+Math.cos(a)*columnSize*r,y:cy+Math.sin(a)*rowSize*r}});
        if(points.some(v=>!isSea(v.x,v.y)))continue;
        result.push({points,density,tint:hash(col+89,row+71)});
      }
    }
    return result;
  }
  return {build};
});
