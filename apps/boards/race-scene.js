'use strict';
window.createRaceScene = function(canvas) {
 const ctx=canvas.getContext('2d'), reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const colors=['#6ae8ff','#ffbe6b','#bf9aff','#8bffba','#ff8fb8','#b0c8ff'];
 const stars=Array.from({length:150},(_,i)=>({x:((i*971)%997)/997,y:((i*557)%991)/991,r:i%13===0?1.6:.5+(i%3)*.3}));
 let racers=[],W=0,H=0,phase='idle',progress=0,playTime=0,raf=0,start=0,version='';
 const displayName = r => racers.some(other=>other.id!==r.id&&other.name===r.name)?r.name+' '+r.number+'번':r.name;
 function rounded(x,y,w,h,r,fill,stroke) {ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
 function glow(x,y,r,inner,outer='#0000') {const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,inner);g.addColorStop(1,outer);ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}
 function planet(x,y,r) {
   ctx.save();ctx.translate(x,y);ctx.rotate(-.3);
   glow(0,0,r*1.5,'#647bff24');
   ctx.strokeStyle='#769ce435';ctx.lineWidth=r*.11;ctx.beginPath();ctx.ellipse(0,9,r*1.6,r*.34,0,Math.PI,Math.PI*2);ctx.stroke();
   const g=ctx.createRadialGradient(-r*.38,-r*.42,1,r*.15,r*.2,r*1.2);g.addColorStop(0,'#5f6ccb');g.addColorStop(.38,'#263866');g.addColorStop(.8,'#0b172f');g.addColorStop(1,'#070d22');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
   ctx.save();ctx.beginPath();ctx.arc(0,0,r-.5,0,Math.PI*2);ctx.clip();
   for(let i=-4;i<7;i++){ctx.strokeStyle=i%2?'#a7b5fc13':'#030c262a';ctx.lineWidth=r*.09;ctx.beginPath();ctx.ellipse(-7,i*r*.15,r*1.15,r*.18,0,0,Math.PI*2);ctx.stroke();}ctx.restore();
   ctx.strokeStyle='#839eec82';ctx.lineWidth=r*.045;ctx.beginPath();ctx.ellipse(0,9,r*1.6,r*.34,0,0,Math.PI);ctx.stroke();
   ctx.strokeStyle='#93dcff';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,r,Math.PI*.98,Math.PI*1.52);ctx.stroke();ctx.restore();
 }
 function project(x,z) {
   const depth=Math.pow(Math.max(0,Math.min(1,z)),1.35);
   const middle=W*(.53+.16*depth);
   return {x:middle+x*W*(.51-.43*depth),y:H*(.965-.65*depth),s:1.35-depth*.88};
 }
 function lineOnTrack(x,color,width,alpha=1) {
   ctx.save();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.globalAlpha=alpha;ctx.beginPath();
   for(let j=0;j<=40;j++){const p=project(x,j/40);j?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);}ctx.stroke();ctx.restore();
 }
 function polygon(points,fill,stroke) {ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.8;ctx.stroke();}}
 function ship(x,y,scale,color,angle,boost,seed,t) {
   ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(scale,scale);
   ctx.fillStyle='#0206176b';ctx.beginPath();ctx.ellipse(5,22,35,12,0,0,Math.PI*2);ctx.fill();
   const flicker=phase==='racing'?(Math.sin(t*.035+seed)*.1+1):.9;
   const length=(boost?95:40)*flicker;
   const g=ctx.createLinearGradient(0,9,0,length+26);g.addColorStop(0,'#eaffff');g.addColorStop(.17,color);g.addColorStop(.6,color+'66');g.addColorStop(1,color+'00');
   ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-10,15);ctx.bezierCurveTo(-13,35,-5,length,0,length+24);ctx.bezierCurveTo(5,length,13,35,10,15);ctx.fill();
   glow(0,20,boost?42:22,color+'55');
   polygon([[-8,-18],[-39,22],[-38,31],[-9,17]],'#536886','#bad6ec');
   polygon([[8,-18],[39,22],[38,31],[9,17]],'#25364d','#7595ad');
   polygon([[-12,-6],[-31,21],[-20,18],[-9,0]],color);
   polygon([[12,-6],[31,21],[20,18],[9,0]],color);
   const body=ctx.createLinearGradient(-14,0,15,0);body.addColorStop(0,'#5a748e');body.addColorStop(.36,'#f3faff');body.addColorStop(.5,'#bdd5e3');body.addColorStop(1,'#3e5770');
   polygon([[0,-46],[-13,-6],[-12,22],[0,29],[12,22],[13,-6]],body,'#d0e6f3');
   polygon([[0,-46],[0,29],[12,22],[13,-6]],'#112a4039');
   polygon([[0,-26],[-7,-9],[-5,7],[5,7],[7,-9]],'#071b30','#6eceee');
   const cockpit=ctx.createLinearGradient(-6,-18,6,6);cockpit.addColorStop(0,'#effdff');cockpit.addColorStop(.35,'#46dcff');cockpit.addColorStop(1,'#126aab');
   polygon([[0,-24],[-5,-8],[-3,3],[3,3],[5,-8]],cockpit);
   rounded(-9,17,18,7,2,'#112b40');rounded(-7,22,5,4,1,'#b9ffff');rounded(2,22,5,4,1,'#b9ffff');
   ctx.strokeStyle='#f2ffffbb';ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(0,-41);ctx.lineTo(-10,-6);ctx.stroke();
   ctx.restore();
 }
 function paint(t=0) {
   if(!W||!H)return;
   ctx.clearRect(0,0,W,H);
   const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#071126');bg.addColorStop(.45,'#111330');bg.addColorStop(1,'#041729');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
   glow(W*.67,H*.17,W*.56,'#34377b49');glow(W*.98,H*.6,W*.38,'#07557832');glow(W*.36,H*.48,W*.3,'#5b257e2e');
   stars.forEach((s,i)=>{const dx=phase==='racing'?playTime*(8+s.r*5)/1000:0;const x=(s.x*W-dx+W)%W,y=s.y*H*.84;ctx.fillStyle=i%8===0?'#c5e6ff':'#a6bde07d';ctx.beginPath();ctx.arc(x,y,s.r,0,Math.PI*2);ctx.fill();if(i%26===0){ctx.fillStyle='#ceebff33';ctx.fillRect(x-4,y-.35,8,.7);ctx.fillRect(x-.35,y-4,.7,8);}});
   planet(W*.87,H*.22,Math.min(W*.105,86));
   glow(W*.6,H*.24,48,'#36baff32');
   // Receding track, with curved projected edges rather than chart-like lanes.
   const floor=ctx.createLinearGradient(0,H*.32,0,H);floor.addColorStop(0,'#15205022');floor.addColorStop(.5,'#142f584a');floor.addColorStop(1,'#14516b52');
   const track=[];for(let i=0;i<=40;i++){let p=project(-1,i/40);track.push([p.x,p.y]);}for(let i=40;i>=0;i--){let p=project(1,i/40);track.push([p.x,p.y]);}polygon(track,floor);
   for(const x of [-1,-.96,.96,1]){ctx.save();ctx.shadowColor=x<0?'#796bff':'#5decff';ctx.shadowBlur=14;lineOnTrack(x,x<0?'#8d79ff':'#70e5ff',x===-1||x===1?2.8:1,.7);ctx.restore();}
   [-.66,-.33,0,.33,.66].forEach(x=>lineOnTrack(x,'#87bdcf',.75,.14));
   for(let j=0;j<16;j++){
     const z=((j/16+(phase==='racing'?playTime*.00007:0))%1);
     const a=project(-1,z),b=project(1,z);ctx.strokeStyle='#71adcd1b';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
     for(const side of [-1,1]){const p=project(side,z);ctx.fillStyle=side<0?'#ad95ff':'#7aeaff';ctx.globalAlpha=.3+(1-z)*.6;ctx.fillRect(p.x-2,p.y-2,4+4*(1-z),2);ctx.globalAlpha=1;}
   }
   // Finish gate glows at the vanishing end of the raceway.
   const gate=project(0,.94);ctx.save();ctx.translate(gate.x,gate.y);ctx.strokeStyle='#68deff72';ctx.lineWidth=5;ctx.shadowBlur=16;ctx.shadowColor='#3ce2ff';ctx.beginPath();ctx.ellipse(0,-17,W*.104,48,0,Math.PI,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle='#d7fbff';ctx.lineWidth=1.4;ctx.stroke();ctx.restore();
   const max=Math.max(160,...racers.map(r=>r.score));
   const ordered=racers.map((r,i)=>{
     // The camera follows distance; equal scores stay abreast in their grid row.
     const gridRow=Math.floor(i/6),gridRows=Math.max(1,Math.ceil(racers.length/6)-1);
     const z=.46+.36*r.score/max-gridRow*.2/gridRows;
     const column=[-.16,.16,-.49,.49,-.82,.82][i%6];
     const p=project(column,z);const boosted=phase==='racing'&&r.boost&&progress>.15&&progress<.9;
     return {...p,r,i,z,boosted,column};
   }).sort((a,b)=>b.z-a.z);
   ordered.forEach(p=>{
     const size=(W<500?.5:.7)*p.s*(racers.length>30?.55:p.i<6?1:.58);
     const angle=p.column*.35+.04;
     const dx=phase==='racing'&&!reduce?Math.sin(t*.003+p.i)*1.5:0;
     if(p.boosted){ctx.save();ctx.strokeStyle='#ffe1a076';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(p.x,p.y+3,34*size,50*size,angle,0,Math.PI*2);ctx.stroke();ctx.restore();}
     ship(p.x+dx,p.y,size,p.r.color,angle,p.boosted,p.i,t);
     {
       const label=displayName(p.r);ctx.font='700 '+(p.i>=6?11:W<500?12:14)+'px system-ui';const tw=ctx.measureText(label).width;
       const lx=p.x-tw/2-8,ly=p.y-60*size-12;
       rounded(lx,ly,tw+16,23,5,'#07132dec',p.r.color+'88');ctx.fillStyle='#f3f9ff';ctx.textAlign='center';ctx.fillText(label,p.x,ly+16);
       if(p.boosted){ctx.font='800 12px system-ui';ctx.fillStyle='#ffe09c';ctx.fillText('BOOST',p.x,p.y+85*size);}
     }
   });
   if(phase==='racing'&&!reduce) {
     ctx.save();ctx.globalAlpha=Math.sin(Math.PI*progress)*.45;
     for(let i=0;i<24;i++){const x=(i*137%997)/997*W,y=(i*91%541)/541*H;ctx.strokeStyle=i%2?'#a4ebff':'#d0c0ff';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(x-W*.67)*.07,y+(y-H*.25)*.1);ctx.stroke();}ctx.restore();
   }
   const shade=ctx.createLinearGradient(0,H-125,0,H);shade.addColorStop(0,'#040b1c00');shade.addColorStop(1,'#040b1cf2');ctx.fillStyle=shade;ctx.fillRect(0,H-125,W,125);
 }

 function size() {const r=canvas.getBoundingClientRect();W=r.width;H=r.height;if(!W||!H)return;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(W*d);canvas.height=Math.round(H*d);ctx.setTransform(d,0,0,d,0,0);paint();}
 function tick(t) {
  if(!start)start=t;playTime=t-start;progress=Math.min(1,playTime/4000);
  const ease=progress*progress*(3-2*progress);
  racers.forEach(r=>{r.score=r.from+(r.to-r.from)*ease;});paint(t);
  if(progress<1)raf=requestAnimationFrame(tick);else{phase='idle';paint();}
 }
 const observer=new ResizeObserver(size);observer.observe(canvas);
 return {
  update(state) {
   const nextVersion=state.id+':'+state.index+':'+state.phase+':'+JSON.stringify(state.racers);
   if(version===nextVersion)return;
   const animate=version!==''&&state.phase==='reveal'&&!reduce;
   version=nextVersion;cancelAnimationFrame(raf);
   const previous=new Map(racers.map(r=>[r.id,r.score]));
   racers=(state.racers||[]).map((r,i)=>({...r,color:colors[i%colors.length],from:previous.get(r.id)??r.score,to:r.score,score:animate?(previous.get(r.id)??r.score):r.score}));
   phase=animate?'racing':'idle';start=0;progress=0;playTime=0;
   size();if(animate)raf=requestAnimationFrame(tick);else paint();
  },
  destroy(){cancelAnimationFrame(raf);observer.disconnect();}
 };
};
