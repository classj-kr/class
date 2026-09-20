// Tessellate a geographic raster instead of stretching entire latitude strips.
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.VoyageProjectedRaster=factory()})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function draw(ctx,image,project,width,height,screenWidth,screenHeight,step=8){
    const columns=Math.ceil(width/step),rows=Math.ceil(height/step),points=[];
    for(let y=0;y<=rows;y++){const row=[];for(let x=0;x<=columns;x++)row.push(project(Math.min(width,x*step),Math.min(height,y*step)));points.push(row)}
    let patches=0;
    function triangle(sx,sy,sw,sh,a,b,c,second){
      ctx.save();
      // Map each source triangle onto the corresponding triangle on the globe.
      const ox=second?b.x+c.x-a.x:a.x,oy=second?b.y+c.y-a.y:a.y;
      const xx=second?a.x-c.x:b.x-a.x,xy=second?a.y-c.y:b.y-a.y;
      const yx=second?a.x-b.x:c.x-a.x,yy=second?a.y-b.y:c.y-a.y;
      ctx.transform(xx/sw,xy/sw,yx/sh,yy/sh,ox,oy);
      ctx.beginPath();ctx.moveTo(second?sw:0,0);ctx.lineTo(sw,second?sh:0);ctx.lineTo(0,sh);ctx.closePath();ctx.clip();
      ctx.drawImage(image,sx,sy,sw,sh,0,0,sw,sh);ctx.restore();
    }
    for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){
      const a=points[y][x],b=points[y][x+1],c=points[y+1][x],d=points[y+1][x+1],v=[a,b,c,d];
      if(v.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<-9000))continue;
      if(Math.max(...v.map(p=>p.x))<0||Math.min(...v.map(p=>p.x))>screenWidth||Math.max(...v.map(p=>p.y))<0||Math.min(...v.map(p=>p.y))>screenHeight)continue;
      const sx=x*step,sy=y*step,sw=Math.min(step,width-sx),sh=Math.min(step,height-sy);
      triangle(sx,sy,sw,sh,a,b,c,false);triangle(sx,sy,sw,sh,d,b,c,true);patches++;
    }
    return patches;
  }
  return {draw};
});
