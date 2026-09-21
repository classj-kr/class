const fs=require('node:fs');
const sharp=require('C:/Users/A/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root='learning/inquiry/age-of-exploration/';
const replace=(s,from,to)=>{if(!s.includes(from))throw Error('Missing: '+from);return s.replace(from,to);};
function edit(file,fn){const p=root+file;fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n')));}
(async()=>{
 await sharp('C:/Users/A/.codex/generated_images/01a0bd67-c0ab-7960-91ad-345fd72cc016/exec-231201da-b536-4127-97a3-c28ee9732691.png').webp({quality:88,alphaQuality:100}).toFile(root+'public/assets/weather/cloud-soft-atlas-v1.webp');
 edit('public/index.html',s=>{
  s=replace(s,"/assets/weather/cloud_original_12frames.png?v=58","/assets/weather/cloud-soft-atlas-v1.webp?v=1");
  s=replace(s,'// 해류는 바다 물결 애니메이션으로, 바람은 원작 CLOUD.CDS의 구름 애니메이션으로 구분한다.','// 해류는 수면 물결로, 바람은 실제 항해 풍향을 따라 움직이는 부드러운 구름으로 구분한다.');
  s=replace(s,'const WIND_CLOUD_CELL_W=620,WIND_CLOUD_CELL_H=360,WIND_CLOUD_FRAME_W=160,WIND_CLOUD_FRAME_H=60,WIND_CLOUD_SEQUENCE_FRAMES=6,WIND_VISUAL_FLOW_RATE=5.6,WIND_CLOUD_FRAME_MS=64;','const WIND_CLOUD_CELL_W=760,WIND_CLOUD_CELL_H=460,WIND_CLOUD_FRAME_W=768,WIND_CLOUD_FRAME_H=512,WIND_CLOUD_VARIANTS=4,WIND_VISUAL_FLOW_RATE=3.2;');
  const start=s.indexOf('function drawWindClouds('),end=s.indexOf('\nfunction drawHuntAnimal(',start);
  if(start<0||end<0)throw Error('Cloud renderer bounds missing');
  s=s.slice(0,start)+`function drawWindClouds(cw,ch,left,top,now=performance.now()){
  if(mode!=='sea'||choiceModalActive()||!windCloudAtlas.complete||!windCloudAtlas.naturalWidth)return;
  const viewW=viewSpanX,viewH=viewSpanY,cellsX=Math.ceil(SPAN/WIND_CLOUD_CELL_W),c0x=Math.floor((left-WIND_CLOUD_CELL_W)/WIND_CLOUD_CELL_W),c1x=Math.ceil((left+viewW+WIND_CLOUD_CELL_W)/WIND_CLOUD_CELL_W),c0y=Math.max(0,Math.floor((top-WIND_CLOUD_CELL_H)/WIND_CLOUD_CELL_H)),c1y=Math.min(Math.ceil(MAP_H/WIND_CLOUD_CELL_H)-1,Math.ceil((top+viewH+WIND_CLOUD_CELL_H)/WIND_CLOUD_CELL_H));
  ctx.save();ctx.globalCompositeOperation='source-over';ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  for(let cy=c0y;cy<=c1y;cy++)for(let rawCx=c0x;rawCx<=c1x;rawCx++){
    const cx=((rawCx%cellsX)+cellsX)%cellsX,baseX=wrapX((cx+hashUnit(cx,cy,11)*.88+.06)*WIND_CLOUD_CELL_W),baseY=Math.max(25,Math.min(MAP_H-25,(cy+hashUnit(cx,cy,23)*.82+.09)*WIND_CLOUD_CELL_H)),wind=CDS95Wind.windAtPixel(baseX,baseY,classGameMinutes);
    if(wind.strength<.12)continue;
    // The same wind vector drives ship speed and cloud travel. No sideways bob or frame flicker.
    const speed=.94+hashUnit(cx,cy,37)*.12,track=560+hashUnit(cx,cy,41)*430,phase=(hashUnit(cx,cy,53)+now*.000015*WIND_VISUAL_FLOW_RATE*speed*(.18+wind.strength))%1,travel=(phase-.5)*track,x=wrapX(baseX+wind.x*travel),y=Math.max(18,Math.min(MAP_H-18,baseY+wind.y*travel)),screen=flowScreenPoint({x,y},left,top);
    if(screen.x<-240||screen.x>cw+240||screen.y<-160||screen.y>ch+160)continue;
    const variant=Math.floor(hashUnit(cx,cy,67)*WIND_CLOUD_VARIANTS),sx=(variant%2)*WIND_CLOUD_FRAME_W,sy=Math.floor(variant/2)*WIND_CLOUD_FRAME_H,w=(230+hashUnit(cx,cy,71)*105)*Math.max(.74,Math.min(1.22,zoom*.72)),h=w*(WIND_CLOUD_FRAME_H/WIND_CLOUD_FRAME_W),edgeFade=Math.sin(Math.PI*phase)**.65;
    ctx.globalAlpha=(.40+.26*wind.strength)*edgeFade;
    ctx.drawImage(windCloudAtlas,sx,sy,WIND_CLOUD_FRAME_W,WIND_CLOUD_FRAME_H,screen.x-w/2,screen.y-h/2,w,h);
  }
  ctx.restore();
}
`+s.slice(end);
  return s;
 });
 edit('server.js',s=>replace(s,"windCloudAnimation: 'original-CLOUD.CDS-12-frame-sprite'","windCloudAnimation: 'soft-alpha-cloud-atlas-wind-driven'"));
 edit('tests/v42-choice-responsiveness-unit.js',s=>replace(s,"if(mode!=='sea'||choiceModalActive()||!windCloudAtlas.complete)return","if(mode!=='sea'||choiceModalActive()||!windCloudAtlas.complete||!windCloudAtlas.naturalWidth)return"));
 edit('tests/v54-original-map-wind-visual-unit.js',s=>s.replace('WIND_VISUAL_FLOW_RATE=5\\.6','WIND_VISUAL_FLOW_RATE=3\\.2').replace('assert.match(html,/WIND_CLOUD_FRAME_MS=64/);','assert.doesNotMatch(html,/WIND_CLOUD_FRAME_MS|WIND_CLOUD_SEQUENCE_FRAMES/);').replace('windVisualFlowRate:5.6,cloudFrameMs:64','windVisualFlowRate:3.2,continuousCloudTravel:true'));
})();
