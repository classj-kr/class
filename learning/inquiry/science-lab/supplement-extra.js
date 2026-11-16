
/* Curriculum observations, not photographs, patient data, or real measurements.
   Each panel draws its final picture synchronously; a change of condition then
   replays the physical process inside the panel's own svg and settles on that
   same final picture. */
(function(){
 const f=n=>Math.round(n*10)/10;
 const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 const seg=(t,a,b)=>clamp((t-a)/(b-a));
 const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
 const lerp=(a,b,t)=>a+(b-a)*t;
 const rnd=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);};
 const op=o=>String(Math.round(clamp(o)*100)/100);
 const fade=(o,inner)=>o>=1?inner:o<=0?'':'<g opacity="'+op(o)+'">'+inner+'</g>';
 const T=(s,x,y,o={})=>'<text x="'+f(x)+'" y="'+f(y)+'" text-anchor="'+(o.anchor||'middle')+'" fill="'+(o.color||'#284651')+'" font-size="'+(o.size||14)+'"'+(o.weight?' font-weight="'+o.weight+'"':'')+'>'+s+'</text>';
 const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
 const mix=(a,b,t)=>{const A=hex(a),B=hex(b);return 'rgb('+A.map((v,i)=>Math.round(lerp(v,B[i],clamp(t)))).join(',')+')';};
 const starPath=(x,y,r)=>{let d='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r*.45:r;d+=(i?'L':'M')+f(x+Math.cos(a)*q)+' '+f(y+Math.sin(a)*q);}return d+'Z';};

 /* Replay driver: view() returns the settled svg plus a marker; after the shared
    renderer has inserted it, the change from the previously shown condition is
    played with requestAnimationFrame and the settled svg is restored at the end. */
 const animate=(()=>{
  let pending=null,queued=false,raf=0;const shown=new Map();
  const live=()=>typeof document!=='undefined'&&typeof requestAnimationFrame==='function';
  function flush(){
   queued=false;const p=pending;pending=null;if(!p)return;
   const svg=document.querySelector('.curriculum-supplement .supplement-visual > svg');
   const marker=svg&&svg.querySelector('[data-sx-key]');
   if(!marker||marker.getAttribute('data-sx-key')!==encodeURIComponent(p.key))return;
   const prev=shown.get(p.slug);shown.set(p.slug,{key:p.key,state:p.state});
   if(!prev||prev.key===p.key)return;
   if(raf)cancelAnimationFrame(raf);raf=0;
   const obs=document.querySelector('.curriculum-supplement .supplement-observation');
   const reduce=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
   if(reduce){if(obs)obs.style.opacity='';return;}
   const settled=svg.innerHTML,mark=marker.outerHTML,start=performance.now(),duration=p.duration||1800;
   if(obs){obs.style.transition='opacity .3s';obs.style.opacity='0';}
   const step=now=>{
    const t=clamp((now-start)/duration);
    if(t<1){let html;try{html=p.frame(prev.state,t);}catch{html=null;}
     if(html==null){svg.innerHTML=settled;raf=0;if(obs)obs.style.opacity='1';return;}
     svg.innerHTML=html+mark;raf=requestAnimationFrame(step);}
    else{svg.innerHTML=settled;raf=0;if(obs)obs.style.opacity='1';}
   };
   raf=requestAnimationFrame(step);
  }
  return (slug,state,spec)=>{
   if(!live())return '';
   pending={slug,state:{...state},...spec};
   if(!queued){queued=true;Promise.resolve().then(flush);}
   return '<g data-sx-key="'+encodeURIComponent(spec.key)+'"></g>';
  };
 })();

 /* ---------- 암석의 순환 ---------- */
 function scienceRockProcess(process,p=1) {
  const text=(s,x,y,o=1)=>fade(o,'<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="#284651" font-size="14">'+s+'</text>');
  const arrow=(x,y)=>'<path d="M'+x+' '+y+' h22 m-7 -5 7 5 -7 5" fill="none" stroke="#5f8189" stroke-width="2.5"/>';
  const shape='M8 34 L28 12 84 8 112 28 117 97 98 118 29 121 6 102 Z';
  const grains=Array.from({length:42},(_,i)=>{const x=(i%7)*19-8+(Math.floor(i/7)%2)*8,y=Math.floor(i/7)*23-2;
   return '<path d="M'+x+' '+y+' l18 -3 7 13 -10 14 -17 -6 Z" fill="'+['#d9c8b2','#a89e94','#eee6d8','#606969','#c6b2a0'][i%5]+'" stroke="#7b7b70" stroke-width=".7"/>';}).join('');
  const layers=Array.from({length:6},(_,i)=>'<path d="M0 '+(i*24)+' Q45 '+(i*24-15)+' 70 '+(i*24+1)+' T130 '+(i*24-4)+' v15 Q77 '+(i*24+27)+' 40 '+(i*24+10)+' T0 '+(i*24+15)+' Z" fill="'+['#d9d5c7','#696f70','#b8a294'][i%3]+'"/>').join('');
  const sandGrain=(i,dy=0)=>'<ellipse cx="'+(8+(i*31)%112)+'" cy="'+f(30+(i*47)%90+dy)+'" rx="'+(2+i%3)+'" ry="2" fill="'+['#ac8460','#d4b98a','#89785d'][i%3]+'"/>';
  const sand=Array.from({length:80},(_,i)=>sandGrain(i)).join('');
  const rock=(x,kind,id,lo=.55)=>'<g transform="translate('+x+' 78)'+(kind==='compacted'?' scale(1 .76)':'')+'"><defs><clipPath id="rockProcess'+id+'"><path d="'+shape+'"/></clipPath></defs><path d="'+shape+'" fill="#b9aa92"/><g clip-path="url(#rockProcess'+id+')">'+(kind==='bands'?layers:kind==='transition'?grains+'<g opacity="'+op(lo)+'">'+layers+'</g>':kind==='compacted'?'<path d="M0 25 H130 M0 65 H130 M0 105 H130" stroke="#a88e70" stroke-width="18" opacity=".45"/>'+sand:kind==='sand'?sand:grains)+'</g><path d="'+shape+'" fill="none" stroke="#777c75" stroke-width="1.6"/></g>';
  const magma=(x,glow=0)=>'<g transform="translate('+x+' 78)"><path d="'+shape+'" fill="url(#rockMagma)" stroke="#a84d36" stroke-width="1.5"/><path d="M18 78 Q28 30 68 62 T104 34 M24 101 Q65 75 101 94" fill="none" stroke="#ffd784" stroke-width="5" opacity="'+op(.55+.3*glow)+'"/></g>';
  const a1=seg(p,0,.15),a2=seg(p,.62,.78),r3=ease(seg(p,.7,1));
  let svg='<defs><linearGradient id="rockMagma" x2=".6" y2="1"><stop stop-color="#ffcc6b"/><stop offset=".55" stop-color="#e88b49"/><stop offset="1" stop-color="#ba4f38"/></linearGradient></defs>'+text('처음',77,38)+text('변화 과정',230,38)+text('변화 뒤',383,38)+fade(a1,arrow(139,146))+fade(a2,arrow(294,146));
  if(process==='cool'){
   const c=ease(seg(p,.1,.75));
   const crystals=[[195,122],[239,161],[262,112],[214,168],[248,132],[222,100],[268,158]].map(([x,y],i)=>{const k=ease(seg(c,i*.09,i*.09+.45));if(k<=0)return '';const cx=x+5,cy=y+3;return '<path transform="translate('+cx+' '+cy+') scale('+f(k*100)/100+') translate('+(-cx)+' '+(-cy)+')" d="M'+x+' '+y+' l10 -7 9 12 -7 12 -13 -5 Z"/>';}).join('');
   svg+=magma(15,Math.sin(p*Math.PI*6)*.5+.5)+magma(168,1-c)+'<g transform="translate(168 78)"><path d="'+shape+'" fill="#6f625a" opacity="'+op(.28*c)+'"/></g><g fill="#d9d0c0" stroke="#8b796e">'+crystals+'</g>'+fade(r3,rock(321,'grain','cool'))+text('마그마',77,231)+text('식으면서 결정이 생김',230,231)+text('굳은 화성암',383,231,r3)+text('알갱이가 맞물린 내부를 확대한 모형',230,282,r3);
  }
  if(process==='deposit'){
   const fall=Array.from({length:80},(_,i)=>{const d=.04+(i%10)*.045,k=ease(seg(p,d,d+.32));return k>0?sandGrain(i,-(1-k)*130):'';}).join('');
   const press=seg(p,.5,.7),squeeze=Math.sin(seg(p,.5,1)*Math.PI*3)*3;
   svg+='<g transform="translate(15 78)"><path d="'+shape+'" fill="#e6f1f3"/>'+sand+'</g>'+
    '<g transform="translate(168 78)"><defs><clipPath id="rockFall"><path d="'+shape+'"/></clipPath></defs><path d="'+shape+'" fill="'+mix('#e6f1f3','#cdbb9f',seg(p,.55,1))+'"/><g clip-path="url(#rockFall)">'+fall+'</g><path d="'+shape+'" fill="none" stroke="#777c75" stroke-width="1.6"/></g>'+
    fade(press,'<path transform="translate(0 '+f(squeeze)+')" d="M230 62 v27 m-5 -6 5 6 5 -6" fill="none" stroke="#876950" stroke-width="3"/><path transform="translate(0 '+f(-squeeze)+')" d="M230 216 v-24 m-5 6 5 -6 5 6" fill="none" stroke="#876950" stroke-width="3"/>')+
    fade(r3,rock(321,'compacted','cement'))+text('운반되어 쌓인 퇴적물',77,231)+text('눌리고 서로 붙음',230,231)+text('굳은 퇴적암',383,231,r3)+text('알갱이 사이가 치밀해지고 굳는 과정',230,282,r3);
  }
  if(process==='change'){
   const c=ease(seg(p,.08,.75)),beat=Math.sin(p*Math.PI*8)*(1-p)*4;
   svg+=rock(15,'grain','old')+'<ellipse cx="230" cy="143" rx="'+f(66+beat)+'" ry="'+f(64+beat)+'" fill="#ef8a5a" opacity="'+op(.12+.12*c)+'"/>'+
    '<g transform="translate(230 143) scale(1 '+f((1-.08*c)*100)/100+') translate(-230 -143)">'+rock(168,'transition','changing',.55*c)+'</g>'+
    fade(r3,rock(321,'bands','changed'))+'<g fill="none" stroke="#b66947" stroke-width="2.5"><path transform="translate(0 '+f(Math.max(0,beat))+')" d="M230 57 v30 m-6 -7 6 7 6 -7"/><path transform="translate(0 '+f(-Math.max(0,beat))+')" d="M230 218 v-23 m-6 7 6 -7 6 7"/></g>'+
    text('이미 있던 암석',77,231)+text('열과 압력 · 녹지 않음',230,231)+text('성질이 바뀐 변성암',383,231,r3)+text('줄무늬가 나타나는 예 · 모든 변성암이 같지는 않음',230,282,r3);
  }
  if(process==='melt'){
   const c=ease(seg(p,.08,.75)),k=1-.55*c;
   svg+=rock(15,'grain','solid')+fade(1-c,rock(168,'grain','melting'))+fade(.25+.75*c,magma(168,Math.sin(p*Math.PI*5)*.5+.5))+
    '<path transform="translate(220 128) scale('+f(k*100)/100+') translate(-220 -128)" d="M198 108 l38 -10 18 31 -35 28 -24 -16 Z" fill="#9a9589" stroke="#6c7370"/>'+
    fade(r3,magma(321))+text('고체 암석',77,231)+text('녹기 시작한 암석',230,231)+text('마그마',383,231,r3)+text('녹음은 고체 상태의 변성과 다름',230,282,r3);
  }
  return '<g data-observation-scene="rock-process" data-process="'+process+'">'+svg+'</g>';
 }

 /* ---------- 줄기의 물 이동 ---------- */
 function scienceStemWater(after,p=after?1:0) {
  const label=(t,x,y)=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="#284651" font-size="14">'+t+'</text>';
  const vessels=Array.from({length:9},(_,i)=>{const a=i*Math.PI*2/9,x=332+44*Math.cos(a),y=139+42*Math.sin(a),k=ease(seg(p,.45+i*.04,.75+i*.025));return '<ellipse data-vessel cx="'+f(x)+'" cy="'+f(y)+'" rx="5" ry="7" fill="'+(k>=1?'#c84d66':k<=0?'#82a574':mix('#82a574','#c84d66',k))+'"/>';}).join('');
  const climb=ease(seg(p,0,.7)),level=182+6*climb;
  return '<g data-observation-scene="stem-water" data-stained="'+(p>0)+'"><defs><linearGradient id="stemGreen"><stop stop-color="#75924f"/><stop offset=".45" stop-color="#d1df9c"/><stop offset="1" stop-color="#789a51"/></linearGradient></defs>'+
  '<path d="M119 238 Q115 169 123 57 L145 57 Q137 171 141 238 Z" fill="url(#stemGreen)" stroke="#6b8c51" stroke-width="1.5"/>'+
  '<path d="M128 110 Q73 109 68 70 Q110 65 129 101 M138 84 Q169 38 203 54 Q195 88 138 93" fill="#7faa62" stroke="#4e8154" stroke-width="1.5"/>'+
  '<path d="M126 106 L82 82 M139 86 L189 60" stroke="#d2dda0" fill="none" stroke-width="1.5"/>'+
  (p>=1?'<path data-stain-track d="M126 232 Q122 164 130 68 M135 232 Q130 170 137 69" stroke="#c84d66" stroke-width="3" fill="none"/>':p>0?['M126 232 Q122 164 130 68','M135 232 Q130 170 137 69'].map(d=>'<path d="'+d+'" pathLength="1" stroke-dasharray="'+f(climb*100)/100+' 2" stroke="#c84d66" stroke-width="3" fill="none"/>').join(''):'')+
  '<path d="M78 '+f(level)+' Q131 '+f(level-5)+' 182 '+f(level)+' V250 H78 Z" fill="#e9b5bf" fill-opacity=".65"/><path d="M72 151 V252 Q72 259 80 259 H180 Q188 259 188 252 V151 M72 158 h116" fill="none" stroke="#72909b" stroke-width="2"/>'+
  '<path d="M81 167 v72" stroke="white" stroke-width="4" opacity=".7"/>'+
  '<path d="M147 122 L245 90" stroke="#819ba3" stroke-dasharray="4 4" fill="none"/>'+
  '<ellipse cx="332" cy="139" rx="71" ry="67" fill="#e7edc4" stroke="#6d8d58" stroke-width="5"/><ellipse cx="332" cy="139" rx="56" ry="52" fill="#f5f5de" stroke="#b1c487"/>'+vessels+
  label('색소 물에 꽂은 줄기',130,286)+label('가로로 자른 면 · 확대',332,39)+(p>=1?label('일부 통로만 붉게 물듦',332,240):p<=0?label('아직 붉게 물들지 않음',332,240):label('물이 올라가는 중',332,240))+
  '</g>';
 }

 /* ---------- 잎에 맺히는 이슬 ---------- */
 function scienceDewScene(p=1) {
  const leaf='M61 217 Q101 55 383 65 Q386 254 129 260 Z';
  const drops=[[124,178,10],[161,133,7],[189,199,13],[231,119,9],[263,171,12],[316,116,11],[292,211,7],[154,228,6],[345,166,7],[204,157,5]];
  const vapor=p<1?Array.from({length:16},(_,i)=>{const x=70+i*21+rnd(i)*10,y0=40+rnd(i+30)*30,y1=150+rnd(i+60)*60,k=(p*1.4+rnd(i+90))%1;return '<circle cx="'+f(x+Math.sin(k*6+i)*6)+'" cy="'+f(lerp(y0,y1,k))+'" r="2.4" fill="#8fbfd6" opacity="'+op(.6*(1-p)*Math.sin(k*Math.PI))+'"/>';}).join(''):'';
  return '<g data-observation-scene="dew"><defs><linearGradient id="dewLeaf" x2=".8" y2="1"><stop stop-color="#b4ca78"/><stop offset=".55" stop-color="#739b50"/><stop offset="1" stop-color="#486e3b"/></linearGradient><radialGradient id="dewDrop" cx=".32" cy=".25" r=".8"><stop stop-color="#f7ffff" stop-opacity=".95"/><stop offset=".32" stop-color="#d6f3e5" stop-opacity=".75"/><stop offset=".8" stop-color="#749f87" stop-opacity=".35"/><stop offset="1" stop-color="#e4faf1" stop-opacity=".9"/></radialGradient><clipPath id="dewSurface"><path d="'+leaf+'"/></clipPath></defs>'+
  '<path d="'+leaf+'" fill="url(#dewLeaf)" stroke="#5a7d48" stroke-width="2"/><g clip-path="url(#dewSurface)"><path d="M46 270 L368 82 M133 229 L114 151 M180 199 L170 112 M232 161 L230 88 M281 128 L291 77 M150 217 L230 240 M205 181 L288 212 M258 145 L343 175" fill="none" stroke="#d6df9d" stroke-width="2" opacity=".7"/>'+
  drops.map(([x,y,R],i)=>{const r=f(R*ease(seg(p,.15+rnd(i)*.4,.55+rnd(i)*.4))*100)/100;return '<g data-surface-drop><ellipse cx="'+(x+1)+'" cy="'+(y+4)+'" rx="'+r+'" ry="'+f(r*.75)+'" fill="#284f38" opacity=".25"/><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="url(#dewDrop)" stroke="#d5f3e7" stroke-width="1"/><ellipse cx="'+f(x-r*.3)+'" cy="'+f(y-r*.4)+'" rx="'+f(r*.28)+'" ry="'+f(r*.16)+'" fill="white" opacity=".95"/></g>';}).join('')+
  '</g>'+vapor+'<text x="230" y="28" text-anchor="middle" fill="#284651" font-size="14">차가워진 잎 표면에 맺힌 물방울</text><text x="230" y="299" text-anchor="middle" fill="#284651" font-size="14">공기 중에 떠 있거나 비처럼 떨어지는 물이 아님</text></g>';
 }

 /* ---------- 혈액형 판정 ---------- */
 const bloodType={가:'A',나:'O',다:'AB',라:'B'};
 function immuneScene(s,p){
  const type=bloodType[s.sample],after=s.stage==='after';
  let svg='<defs><radialGradient id="sxWellShade" cx=".42" cy=".38" r=".72"><stop offset=".7" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#6f8590" stop-opacity=".35"/></radialGradient></defs>'+
   '<rect x="22" y="68" width="416" height="188" rx="18" fill="#f5f7f8" stroke="#b9c4c9" stroke-width="2"/>';
  ['A','B'].forEach((ag,k)=>{
   const x=125+k*210,y=163,clump=type.includes(ag),reagent=ag==='A'?'#bcd3ef':'#f2e3a0';
   svg+='<circle cx="'+x+'" cy="'+y+'" r="79" fill="#e2e8eb"/><circle cx="'+x+'" cy="'+y+'" r="72" fill="'+reagent+'"/>';
   if(after){
    const drop=seg(p,0,.28),spread=ease(seg(p,.3,.55)),cl=clump?ease(seg(p,.55,1)):0;
    if(p>=.28){
     svg+='<circle cx="'+x+'" cy="'+y+'" r="'+f(10+62*spread)+'" fill="#c2414b" opacity="'+op(.62-.12*spread-.4*cl)+'"/>';
     for(let i=0;i<44;i++){
      const ur=60*Math.sqrt(rnd(i+k*7)),ua=Math.PI*2*rnd(i+100),ux=x+Math.cos(ua)*ur,uy=y+Math.sin(ua)*ur;
      const g=i%5,ga=g*1.31+.4,gr=g===4?0:34,gx=x+Math.cos(ga)*gr,gy=y+Math.sin(ga)*gr,jr=9*Math.sqrt(rnd(i+200)),ja=Math.PI*2*rnd(i+300);
      const sx=x+(rnd(i+400)-.5)*12,sy=y+(rnd(i+500)-.5)*12;
      let cx=lerp(sx,ux,spread),cy=lerp(sy,uy,spread);cx=lerp(cx,gx+Math.cos(ja)*jr,cl);cy=lerp(cy,gy+Math.sin(ja)*jr,cl);
      svg+='<circle cx="'+f(cx)+'" cy="'+f(cy)+'" r="4.3" fill="#a92f39"/><circle cx="'+f(cx)+'" cy="'+f(cy)+'" r="1.7" fill="#d9626a"/>';
     }
    }
    if(p<.3){
     const down=ease(seg(p,0,.1)),up=seg(p,.22,.3),tipY=lerp(80,122,down)-up*40,dx=x+44;
     svg+='<g opacity="'+op(1-up)+'"><path d="M'+(dx-5)+' '+f(tipY-44)+' h10 v38 l-3 6 h-4 l-3 -6 Z" fill="#e7f1f5" fill-opacity=".8" stroke="#7896a5" stroke-width="1.5"/><rect x="'+(dx-7)+'" y="'+f(tipY-58)+'" width="14" height="16" rx="6" fill="#d06a4b"/><path d="M'+(dx-3)+' '+f(tipY-20)+' h6 v12 l-2 4 h-2 l-2 -4 Z" fill="#c2414b"/></g>';
     if(drop>.4&&p<.28){const k=seg(p,.12,.28);svg+='<ellipse cx="'+f(lerp(dx,x,k))+'" cy="'+f(lerp(tipY+6,y,k))+'" rx="5" ry="6.5" fill="#c2414b"/>';}
    }
    if(p>.3&&p<.58){const a=(p-.3)*30,bx=x+Math.cos(a)*28,by=y+Math.sin(a)*22;svg+='<path d="M'+f(bx)+' '+f(by)+' L'+f(bx+14)+' '+f(by-56)+'" stroke="#c9a46a" stroke-width="5" stroke-linecap="round"/>';}
   }
   svg+='<circle cx="'+x+'" cy="'+y+'" r="72" fill="url(#sxWellShade)"/>'+T('항'+ag+' 시약',x,54);
   const word=!after?'반응 전':p>=1?(clump?'응집 있음':'응집 없음'):'';
   if(word)svg+=T(word,x,284,{size:15,color:after&&clump?'#9b2c35':'#284651'});
  });
  svg+='<path d="M219 112 h22 v74 a11 11 0 0 1 -22 0 Z" fill="#f4f8fa" stroke="#7896a5" stroke-width="1.6"/><path d="M220.5 '+f(150+(after?Math.min(1,p*4)*8:0))+' h19 v36 a9.5 9.5 0 0 1 -19 0 Z" fill="#b3313c"/><rect x="216" y="106" width="28" height="8" rx="3" fill="#7896a5"/>'+T('표본 '+s.sample,230,284);
  return svg;
 }

 /* ---------- 밀물과 썰물 ---------- */
 const shore=x=>x<=300?262-62*x/300:x<=370?200-50*(x-300)/70:150-5*(x-370)/90;
 function tideScene(level,phase,word,final){
  let water='M0 310 L0 '+f(level+3*Math.sin(phase));
  for(let x=10;x<=460;x+=10)water+=' L'+x+' '+f(level+3*Math.sin(x/23+phase));
  water+=' L460 310 Z';
  let mud='M0 310';for(let x=0;x<=300;x+=20)mud+=' L'+x+' '+f(shore(x));mud+=' L312 205 L370 310 Z';
  let land='M0 310';for(let x=0;x<=460;x+=10)land+=' L'+x+' '+f(shore(x));land+=' L460 310 Z';
  const ripples=[40,90,140,190,240,280].map(x=>'<path d="M'+x+' '+f(shore(x)+9)+' q8 -4 16 0 t16 0" fill="none" stroke="#6b5d4e" stroke-width="1.2" opacity=".55"/>').join('');
  const holes=[128,152,186,206,226,262,290].map(x=>'<ellipse cx="'+x+'" cy="'+f(shore(x)+4)+'" rx="3" ry="1.6" fill="#3f352c" opacity=".7"/>').join('');
  const crabs=[172,242,284].map((x,i)=>{const o=clamp((level-shore(x)-2)/14);if(o<=0)return '';const y=shore(x)-3,w=Math.sin(phase*2+i)*2;return '<g opacity="'+op(o)+'"><ellipse cx="'+f(x+w)+'" cy="'+f(y)+'" rx="6" ry="4" fill="#c45a3b"/><path d="M'+f(x+w-6)+' '+f(y)+' l-4 -4 M'+f(x+w+6)+' '+f(y)+' l4 -4 M'+f(x+w-4)+' '+f(y+3)+' l-4 3 M'+f(x+w+4)+' '+f(y+3)+' l4 3" stroke="#9e4329" stroke-width="1.4"/></g>';}).join('');
  const bx=130,gy=shore(bx),by=Math.min(level+6,gy),ground=clamp((level+6-gy)/6),tilt=-11.7*ground;
  const boat='<g transform="rotate('+f(tilt)+' '+bx+' '+f(by)+')"><path d="M'+(bx-34)+' '+f(by-12)+' H'+(bx+34)+' L'+(bx+24)+' '+f(by)+' H'+(bx-24)+' Z" fill="#c9733f" stroke="#8a4d2a" stroke-width="1.5"/><path d="M'+bx+' '+f(by-12)+' V'+f(by-52)+'" stroke="#6b4b33" stroke-width="2.5"/><path d="M'+(bx+2)+' '+f(by-50)+' L'+(bx+28)+' '+f(by-18)+' H'+(bx+2)+' Z" fill="#f4efe2" stroke="#b9ad93"/></g>';
  const ticks=Array.from({length:9},(_,i)=>{const y=76+i*20;return '<path d="M64 '+y+' h'+(i%2?6:10)+'" stroke="#5c6a72" stroke-width="1.3"/>';}).join('');
  let svg='<defs><linearGradient id="tideSky" x2="0" y2="1"><stop stop-color="#e3f1f9"/><stop offset="1" stop-color="#f7fbfc"/></linearGradient><linearGradient id="tideSea" x2="0" y2="1"><stop stop-color="#86bad6"/><stop offset="1" stop-color="#4f8db3"/></linearGradient></defs>'+
   '<rect width="460" height="310" fill="url(#tideSky)"/><path d="'+water+'" fill="url(#tideSea)" opacity=".92"/>'+
   '<path d="'+land+'" fill="#dcc596"/><path d="'+mud+'" fill="#857463"/>'+ripples+holes+crabs+
   [392,414,438].map(x=>'<path d="M'+x+' '+f(shore(x))+' l-4 -12 M'+x+' '+f(shore(x))+' l0 -14 M'+x+' '+f(shore(x))+' l4 -12" stroke="#6f9a4c" stroke-width="2"/>').join('')+
   boat+'<rect x="56" y="64" width="8" height="'+f(shore(60)-62)+'" fill="#b08a5c" stroke="#7d6040"/>'+ticks+
   '<path d="M47 150 H75 M47 238 H75" stroke="#2e5f7a" stroke-width="2.5"/>'+
   T('같은 기준 기둥',90,40);
  if(word)svg+=T(word,330,40,{color:'#2e5f7a'})+'<path d="M386 '+(word==='물이 빠짐'?'30 v14 m-5 -6 5 6 5 -6':'44 v-14 m-5 6 5 -6 5 6')+'" fill="none" stroke="#2e5f7a" stroke-width="2"/>';
  if(final==='high')svg+=T('물에 잠긴 갯벌',250,190,{color:'#f4fbff'});
  if(final==='low')svg+=T('드러난 갯벌',240,190);
  return svg;
 }

 /* ---------- 식물 세포 ---------- */
 function cellScene(part,p){
  const hl='#c87124',pulse=p<1?Math.sin(p*Math.PI*4)*(1-p):0;
  const sw=(k,base)=>f(base*(part===k?1+.6*Math.abs(pulse):1));
  const anchor={wall:[160,244],membrane:[178,226],nucleus:[300,196]}[part],to=[230,274],lk=ease(seg(p,.15,.65));
  let svg='<rect x="-40" y="38" width="138" height="202" rx="10" fill="#f3f6e6" stroke="#bcd09a" stroke-width="10"/><rect x="362" y="38" width="138" height="202" rx="10" fill="#f3f6e6" stroke="#bcd09a" stroke-width="10"/>'+
   '<rect x="110" y="38" width="240" height="202" rx="10" fill="#f1f5dc" stroke="'+(part==='wall'?hl:'#8fae6a')+'" stroke-width="'+sw('wall',12)+'"/>'+
   '<rect x="142" y="70" width="140" height="132" rx="34" fill="#e3eff3" opacity=".8"/>'+
   Array.from({length:22},(_,i)=>'<circle cx="'+f(132+rnd(i)*196)+'" cy="'+f(60+rnd(i+40)*160)+'" r="'+f(1.3+rnd(i+80)*1.5)+'" fill="#a9bd7c" opacity=".7"/>').join('')+
   '<rect x="124" y="52" width="212" height="174" rx="6" fill="none" stroke="'+(part==='membrane'?hl:'#7fa99f')+'" stroke-width="'+sw('membrane',3)+'"/>'+
   '<ellipse cx="300" cy="170" rx="'+sw('nucleus',22)+'" ry="'+sw('nucleus',26)+'" fill="'+(part==='nucleus'?hl:'#a99ac9')+'"/><circle cx="306" cy="164" r="6" fill="'+(part==='nucleus'?'#8c4c16':'#7f6fa6')+'"/>';
  if(lk>0)svg+='<path d="M'+anchor[0]+' '+anchor[1]+' L'+f(lerp(anchor[0],to[0],lk))+' '+f(lerp(anchor[1],to[1],lk))+'" stroke="'+hl+'" stroke-width="2"/><circle cx="'+anchor[0]+'" cy="'+anchor[1]+'" r="3.5" fill="'+hl+'"/>';
  svg+=fade(seg(p,.55,1),T({wall:'세포벽',membrane:'세포막',nucleus:'핵'}[part],230,292,{size:16}));
  return svg;
 }

 /* ---------- 잎에서 나가는 물 ---------- */
 function leafBagScene(p){
  const bag='M230 214 C160 212 120 180 122 120 C124 66 168 46 230 46 C292 46 336 66 338 120 C340 180 300 212 230 214 Z';
  const leaves=[[230,100,-90],[204,108,-150],[256,104,-30],[200,148,-165],[262,146,-15],[208,184,-150],[254,182,-30]];
  const leafSvg=leaves.map(([x,y,a])=>{const r=a*Math.PI/180,cx=x+Math.cos(r)*24,cy=y+Math.sin(r)*24;return '<ellipse cx="'+f(cx)+'" cy="'+f(cy)+'" rx="25" ry="10" transform="rotate('+a+' '+f(cx)+' '+f(cy)+')" fill="#7aa95c" stroke="#4e8154" stroke-width="1.3"/><path d="M'+x+' '+y+' L'+f(x+Math.cos(r)*46)+' '+f(y+Math.sin(r)*46)+'" stroke="#c9dca0" stroke-width="1.2"/>';}).join('');
  const drops=Array.from({length:30},(_,i)=>{const a=i/30*Math.PI*2,k=.86+rnd(i)*.08,x=230+Math.cos(a)*101*k,y=128+Math.sin(a)*78*k;if(y>200)return '';const d=rnd(i+50)*.55,s=ease(seg(p,d,d+.4)),r=(2.4+rnd(i+70)*2.2)*s;return s>0?'<circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(r)+'" fill="#a9d3e8" stroke="#5f9fc2" stroke-width=".8"/><circle cx="'+f(x-r*.3)+'" cy="'+f(y-r*.35)+'" r="'+f(r*.3)+'" fill="#fff"/>':'';}).join('');
  const vapor=p>0&&p<1?Array.from({length:14},(_,i)=>{const [lx,ly,a]=leaves[i%leaves.length],r=a*Math.PI/180,sx=lx+Math.cos(r)*30,sy=ly+Math.sin(r)*30,ang=Math.atan2(sy-128,sx-230),ex=230+Math.cos(ang)*92,ey=128+Math.sin(ang)*70,k=(p*2.2+i/14)%1;return '<circle cx="'+f(lerp(sx,ex,k))+'" cy="'+f(lerp(sy,ey,k))+'" r="2" fill="#8fbfd6" opacity="'+op(.7*Math.sin(k*Math.PI))+'"/>';}).join(''):'';
  let svg='<path d="M178 238 H282 L272 292 H188 Z" fill="#c9825a"/><rect x="172" y="228" width="116" height="12" rx="4" fill="#b5704b"/><ellipse cx="230" cy="232" rx="54" ry="4" fill="#6b4a33"/>'+
   '<path d="M230 232 V100" stroke="#5f8f4a" stroke-width="6" stroke-linecap="round"/>'+leafSvg+vapor+
   '<path d="'+bag+'" fill="#e8f3f8" fill-opacity=".3" stroke="#86aabd" stroke-width="1.8"/><path d="'+bag+'" fill="#ffffff" opacity="'+op(.28*ease(seg(p,.2,1)))+'"/>'+drops+
   '<path d="M150 90 Q144 120 152 160" stroke="#fff" stroke-width="4" fill="none" opacity=".7"/><rect x="221" y="208" width="18" height="9" rx="3" fill="#e2b33c"/>'+
   '<path d="M338 92 L362 80" stroke="#819ba3"/>'+T('투명 봉지',398,84);
  if(p>=1)svg+='<path d="M334 150 L362 150" stroke="#819ba3"/>'+T('물방울',392,155);
  return svg;
 }

 /* ---------- 소리의 전달 ---------- */
 function soundScene(s,t){
  const string=s.kind==='string',on=s.condition==='on',amplitude=(string?on:!on)?1:.22,done=t>=1;
  const arc=(x,y,r,o,color='#398c9b')=>{const a=Math.min(.62,Math.asin(Math.min(1,60/r)));return '<path d="M'+f(x+Math.cos(-a)*r)+' '+f(y+Math.sin(-a)*r)+' A'+f(r)+' '+f(r)+' 0 0 1 '+f(x+Math.cos(a)*r)+' '+f(y+Math.sin(a)*r)+'" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-linecap="round" opacity="'+op(o)+'"/>';};
  let svg=T('같은 소리 · 듣는 곳에서의 차이',230,27,{size:15});
  if(string){
   const pt=u=>on?[95+270*u,120]:[(1-u)*(1-u)*95+2*(1-u)*u*230+u*u*365,(1-u)*(1-u)*120+2*(1-u)*u*239+u*u*120];
   svg+='<path d="M42 81 L95 96 V145 L42 160 Z M418 81 L365 96 V145 L418 160 Z" fill="#e3d2b4" stroke="#937e62" stroke-width="2"/><ellipse cx="42" cy="120.5" rx="7" ry="39.5" fill="#f3e8d3" stroke="#937e62" stroke-width="1.5"/><ellipse cx="418" cy="120.5" rx="7" ry="39.5" fill="#f3e8d3" stroke="#937e62" stroke-width="1.5"/>'+
    '<path d="'+(on?'M95 120 H365':'M95 120 Q230 239 365 120')+'" fill="none" stroke="#937e62" stroke-width="2"/>'+T('말하기',67,65)+T('듣기',393,65)+T(on?'팽팽한 실':'느슨한 실',230,on?192:160);
   if(!done){
    for(let k=0;k<3;k++){const u=t*2.1-k*.32;if(u<0||u>1)continue;const a=on?1:1-.78*u,[x,y]=pt(u);svg+='<circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(5+5*a)+'" fill="#398c9b" opacity="'+op(.18*a+.05)+'"/><circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(2+2.5*a)+'" fill="#2f7f8e" opacity="'+op(.3+.6*a)+'"/>';}
    for(let k=0;k<3;k++){const r=((t*3+k/3)%1);svg+=arc(4,120,14+r*20,(1-r)*.9*(t<.6?1:seg(.8-t,0,.2)),'#7a6a52');}
   }else svg+=arc(4,120,22,.8,'#7a6a52')+arc(4,120,32,.6,'#7a6a52');
   const recv=done?1:seg(t,.45,.62);
   if(recv>0)svg+=arc(424,120,10,recv*(.25+.75*amplitude))+arc(424,120,20,recv*(.15+.7*amplitude))+arc(424,120,30,recv*(.1+.6*amplitude));
  }else{
   svg+='<path d="M52 105 h20 l28 -23 v76 l-28 -23 h-20 Z" fill="#76919e"/><rect x="211" y="40" width="34" height="26" fill="#cfd8dc" stroke="#9aa9b0"/><rect x="211" y="178" width="34" height="5" fill="#9aa9b0"/>'+
    (on?'<rect x="215" y="66" width="25" height="112" fill="#a4cada" stroke="#648998"/><path d="M227.5 66 v112" stroke="#648998"/>':'<path d="M215 66 l45 -19 v112 l-45 19 Z" fill="#e1eef1" stroke="#648998"/>')+
    T(on?'닫힌 창문':'열린 창문',230,198)+T('듣는 곳',380,114)+'<circle cx="396" cy="146" r="15" fill="#f1d3b6" stroke="#b58c6a" stroke-width="1.5"/><path d="M383 146 q-6 -1 -6 6 q0 6 6 5" fill="#f1d3b6" stroke="#b58c6a" stroke-width="1.5"/><path d="M381 133 q15 -12 30 2" fill="none" stroke="#5c4636" stroke-width="5" stroke-linecap="round"/>';
   const rs=done?[34,74,150,215]:Array.from({length:4},(_,k)=>((t*1.8+k/4)%1)*270+14);
   for(const r of rs){const past=100+r>215,o=(1-r/320)*(past?amplitude:1)*(done?1:Math.min(1,r/30));if(100+r>372)continue;svg+=arc(100,120,r,o);}
  }
  svg+=T('전달된 진동의 크기 비교',230,226)+'<path d="M80 260 H380" fill="none" stroke="#c1cdd1" stroke-width="1"/>';
  const n=done?180:Math.round(180*seg(t,.35,1));
  if(n>1)svg+='<path d="'+Array.from({length:n+1},(_,i)=>(i?'L':'M')+f(80+i*300/180)+' '+f(260-Math.sin(i*Math.PI/15)*22*amplitude)).join(' ')+'" fill="none" stroke="#398c9b" stroke-width="2.5"/>';
  return '<g data-observation-scene="sound" data-relative-amplitude="'+amplitude+'">'+svg+'</g>';
 }

 /* ---------- 연주 시차 ---------- */
 const parallaxYs=d=>d==='near'?150:105;
 function parallaxScene(a,ys,s,done){
  const cx=230,cy=262,rx=125,ry=28,ex=cx+rx*Math.cos(a),ey=cy+ry*Math.sin(a);
  const hit=(px,py,y)=>px+(230-px)*(y-py)/(ys-py);
  let svg='<defs><radialGradient id="sxSun"><stop stop-color="#fff3b0"/><stop offset=".6" stop-color="#f6c24a"/><stop offset="1" stop-color="#e59a2c"/></radialGradient></defs>'+
   '<rect x="15" y="18" width="430" height="58" rx="8" fill="#1d3150"/>'+
   Array.from({length:19},(_,i)=>'<circle cx="'+f(28+i*22.5+rnd(i)*9)+'" cy="'+f(27+rnd(i+20)*40)+'" r="'+f(1+rnd(i+40)*1.3)+'" fill="#ffffff" opacity="'+op(.6+rnd(i+60)*.4)+'"/>').join('')+
   T('먼 배경 별',62,70,{color:'#e2ebf6'});
  svg+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="none" stroke="#9fb4c4" stroke-width="1.6"/>'+
   '<circle cx="105" cy="262" r="6" fill="#fff" stroke="#287daa" stroke-width="1.5"/><circle cx="355" cy="262" r="6" fill="#fff" stroke="#287daa" stroke-width="1.5"/>'+
   '<circle cx="230" cy="262" r="13" fill="url(#sxSun)"/>'+T('태양',230,226)+T('처음',105,295)+T('6개월 뒤',355,295);
  if(done&&s.position==='right'){
   const gx=hit(105,262,45);
   svg+='<path d="M105 262 L'+f(hit(105,262,76))+' 76" stroke="#d6b04a" stroke-width="1.5" stroke-dasharray="5 5" opacity=".6"/>'+
    '<path d="'+starPath(gx,45,8)+'" fill="none" stroke="#f2c84b" stroke-width="1.3" opacity=".75"/>'+
    '<path d="M'+f(gx-12)+' 58 H'+f(hit(355,262,45)+12)+' m6 -4 -6 4 6 4" fill="none" stroke="#f2c84b" stroke-width="1.5"/>';
  }
  const X=hit(ex,ey,45);
  svg+='<path d="M'+f(ex)+' '+f(ey)+' L'+f(hit(ex,ey,76))+' 76" stroke="#d29a1e" stroke-width="2"/><path d="M'+f(hit(ex,ey,76))+' 76 L'+f(X)+' 45" stroke="#f2c84b" stroke-width="1.2" stroke-dasharray="3 3"/>'+
   '<path d="'+starPath(X,45,9)+'" fill="#f7d24f" stroke="#fff4c4" stroke-width=".8"/>'+
   '<path d="'+starPath(230,ys,9)+'" fill="#f2b632" stroke="#a8761a" stroke-width=".8"/>'+T(s.distance==='near'?'가까운 별':'더 먼 별',244,ys+5,{anchor:'start'})+
   '<circle cx="'+f(ex)+'" cy="'+f(ey)+'" r="8" fill="#2f7fb5" stroke="#fff" stroke-width="1.5"/><path d="M'+f(ex-4)+' '+f(ey-2)+' q3 -3 6 0 q-1 4 -5 3 Z" fill="#6fb36a"/>'+T('지구',ex,ey-14,{color:'#1f5f88'});
  return svg;
 }
 function nebulaScene(t){
  return '<defs><radialGradient id="sxNeb1"><stop stop-color="#f4b4c8" stop-opacity=".9"/><stop offset="1" stop-color="#f4b4c8" stop-opacity="0"/></radialGradient><radialGradient id="sxNeb2"><stop stop-color="#9fc4ef" stop-opacity=".85"/><stop offset="1" stop-color="#9fc4ef" stop-opacity="0"/></radialGradient></defs>'+
   '<rect x="20" y="30" width="420" height="240" rx="10" fill="#1d2a45"/>'+
   '<ellipse cx="'+f(190+8*(1-t))+'" cy="140" rx="'+f(130*(.7+.3*t))+'" ry="'+f(85*(.7+.3*t))+'" fill="url(#sxNeb1)" opacity="'+op(t)+'"/><ellipse cx="'+f(275-8*(1-t))+'" cy="160" rx="'+f(110*(.7+.3*t))+'" ry="'+f(75*(.7+.3*t))+'" fill="url(#sxNeb2)" opacity="'+op(t)+'"/>'+
   '<ellipse cx="205" cy="178" rx="60" ry="12" transform="rotate(-8 205 178)" fill="#2a2333" opacity="'+op(.35*t)+'"/><ellipse cx="290" cy="172" rx="42" ry="9" transform="rotate(6 290 172)" fill="#2a2333" opacity="'+op(.3*t)+'"/>'+
   Array.from({length:14},(_,i)=>'<circle cx="'+f(40+rnd(i)*380)+'" cy="'+f(45+rnd(i+9)*210)+'" r="1.4" fill="#fff" opacity=".8"/>').join('')+
   T('기체와 티끌',230,255,{color:'#e8eef8'});
 }
 function clusterScene(t){
  return '<rect x="20" y="30" width="420" height="240" rx="10" fill="#1d2a45"/>'+
   Array.from({length:60},(_,i)=>{const r=Math.sqrt(i)*13,a=i*2.4,k=ease(seg(t,i/60*.7,i/60*.7+.3));return k>0?'<circle cx="'+f(230+Math.cos(a)*r*1.25)+'" cy="'+f(140+Math.sin(a)*r)+'" r="'+f((1.4+rnd(i)*2)*k)+'" fill="'+['#fff7d6','#dfeaff','#ffe2b0'][i%3]+'"/>':'';}).join('')+
   fade(seg(t,.7,1),T('별의 무리',230,255,{color:'#e8eef8'}));
 }

 /* ---------- 날씨 ---------- */
 function fogScene(p){
  const k=ease(p);
  return '<defs><linearGradient id="sxFogSky" x2="0" y2="1"><stop stop-color="#dbe7ee"/><stop offset="1" stop-color="#eef3f5"/></linearGradient></defs><rect width="460" height="310" fill="url(#sxFogSky)"/>'+
   '<path d="M0 210 Q90 150 190 200 T460 180 V260 H0 Z" fill="#a9bfa8"/><rect y="240" width="460" height="70" fill="#9dbd7f"/>'+
   [[80,240,30],[140,244,24],[330,242,28],[395,240,32]].map(([x,y,r])=>'<rect x="'+(x-4)+'" y="'+(y-26)+'" width="8" height="28" fill="#7a5b3f"/><circle cx="'+x+'" cy="'+(y-26-r*.6)+'" r="'+r+'" fill="#5f8f4f"/>').join('')+
   '<path d="M205 244 V214 L235 192 L265 214 V244 Z" fill="#e9d9bf" stroke="#9b8466"/><rect x="226" y="222" width="14" height="22" fill="#9b6b45"/>'+
   [[110,232,170,20],[300,226,180,22],[220,250,240,18],[60,212,120,14],[380,208,120,14]].map(([x,y,rx,ry],i)=>'<ellipse cx="'+f(x-(1-k)*(40+i*10))+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="#ffffff" opacity="'+op(.72*k)+'"/>').join('')+
   fade(seg(p,.6,1),T('지표 가까운 공기 중',230,35));
 }
 function cloudScene(p){
  const puffs=[[180,92,26],[214,80,32],[252,86,30],[286,98,22],[152,104,18],[232,106,26],[300,108,16]];
  return '<defs><linearGradient id="sxCloudSky" x2="0" y2="1"><stop stop-color="#bcdcf1"/><stop offset="1" stop-color="#eef6fb"/></linearGradient></defs><rect width="460" height="310" fill="url(#sxCloudSky)"/>'+
   '<path d="M0 262 Q110 236 230 258 T460 250 V310 H0 Z" fill="#9dbd7f"/>'+
   [150,230,310].map((x,i)=>{const o=p<1?.75*Math.sin(Math.min(1,p*1.4)*Math.PI):.4,dy=p<1?(p*120+i*20)%40:0;return '<path d="M'+x+' '+f(240-dy)+' q-8 -20 0 -40 t0 -40" fill="none" stroke="#e08a52" stroke-width="2.5" stroke-dasharray="6 5" opacity="'+op(o)+'"/><path d="M'+(x-6)+' '+f(166-dy)+' l6 -8 6 8" fill="none" stroke="#e08a52" stroke-width="2.5" opacity="'+op(o)+'"/>';}).join('')+
   puffs.map(([x,y,r],i)=>{const k=ease(seg(p,.2+i*.07,.6+i*.06));return k>0?'<circle cx="'+x+'" cy="'+y+'" r="'+f(r*k)+'" fill="#ffffff" stroke="#c9d8e2" stroke-width="1.2"/>':'';}).join('')+
   fade(seg(p,.7,1),'<rect x="150" y="104" width="152" height="14" rx="7" fill="#ffffff"/>')+
   fade(seg(p,.7,1),T('높은 공기 중',230,35));
 }
 function windScene(s,p){
  const right=s.direction==='right',hx=right?90:370,lx=right?370:90,sg=right?1:-1;
  const dots=(cx,n,seed)=>Array.from({length:n},(_,i)=>{const r=Math.sqrt(rnd(i+seed))*62,a=rnd(i+seed+50)*Math.PI*2;return '<circle cx="'+f(cx+Math.cos(a)*r)+'" cy="'+f(150+Math.sin(a)*72)+'" r="3" fill="#7d9bb0" opacity=".55"/>';}).join('');
  const len=ease(seg(p,0,.6)),x0=230-70*sg,x1=x0+140*sg*len;
  const angle=lerp(78,6,ease(seg(p,.15,.75)))+(p<1?Math.sin(p*Math.PI*10)*6*(1-p):0);
  const sock=(right?'':'scale(-1 1) ')+'rotate('+f(angle)+')';
  let svg='<rect y="252" width="460" height="58" fill="#c9dbb5"/>'+
   '<ellipse cx="'+hx+'" cy="150" rx="72" ry="82" fill="#f7dccd" opacity=".7"/><ellipse cx="'+lx+'" cy="150" rx="72" ry="82" fill="#d8e7f3" opacity=".7"/>'+
   dots(hx,26,1)+dots(lx,8,300);
  if(p<1)svg+=Array.from({length:12},(_,i)=>{const k=(p*1.5+i/12)%1,x=lerp(hx+40*sg,lx-40*sg,k),y=95+(i*37)%115;return '<circle cx="'+f(x)+'" cy="'+f(y)+'" r="3.4" fill="#34749b" opacity="'+op(.8*Math.sin(k*Math.PI))+'"/>';}).join('');
  if(len>.05)svg+='<path d="M'+x0+' 150 H'+f(x1-12*sg*len)+'" stroke="#34749b" stroke-width="8" stroke-linecap="round"/><path d="M'+f(x1)+' 150 l'+(-20*sg)+' -15 v30 Z" fill="#34749b"/>';
  svg+='<path d="M230 252 V200" stroke="#6c7a80" stroke-width="3"/><g transform="translate(230 202) '+sock+'"><path d="M0 -8 L46 -4 V4 L0 8 Z" fill="#e8673c"/><path d="M15 -6.7 V6.7 M31 -5.3 V5.3" stroke="#fff" stroke-width="5"/></g>'+
   T(right?'고기압':'저기압',90,135,{size:17,weight:700})+T(right?'저기압':'고기압',370,135,{size:17,weight:700})+fade(seg(p,.55,1),T('바람이 부는 방향',230,185));
  return svg;
 }

 window.scienceSupplementExtensions=({line,label,rect,jar,field})=>({
 immune:{
  title:'항A·항B 시약으로 미지 혈액형 판정',codes:['12생과02-06'],initial:{sample:'가',stage:'before',answer:'unknown'},
  fields:[field('sample','가상 표본',[['가','표본 가'],['나','표본 나'],['다','표본 다'],['라','표본 라']]),field('stage','반응 관찰',[['before','시약 넣기 전'],['after','두 시약의 반응 확인']]),field('answer','나의 판정',[['unknown','아직 판정하지 않음'],['A','A형'],['B','B형'],['AB','AB형'],['O','O형']])],
  view(s){const type=bloodType[s.sample],after=s.stage==='after';let svg=immuneScene(s,1);
   svg+=animate('immune',s,{key:s.sample+'|'+s.stage,duration:after?3000:600,frame:(from,t)=>after&&(from.stage!=='after'||from.sample!==s.sample)?immuneScene(s,t):fade(t,immuneScene(s,1))});
   return{svg,text:!after?'응집 여부는 시약 반응 뒤 판정합니다. 각 표본에 항A·항B 시약을 각각 반응시켜 비교하세요.':s.answer==='unknown'?'항A에만 응집하면 A형, 항B에만 응집하면 B형, 모두 응집하면 AB형, 모두 응집하지 않으면 O형입니다. 관찰 결과로 판정해 보세요.':s.answer===type?'판정이 맞았습니다. 표본 '+s.sample+'는 '+type+'형입니다. 해당 항원과 항체 사이의 특이적 반응을 근거로 설명하세요.':'판정을 다시 확인하세요. 한 시약만 보지 말고 항A·항B의 응집 여부를 함께 비교합니다.',note:'실제 혈액은 취급하지 마세요. 수혈 가능 여부는 혈액형만으로 결정하지 않습니다.'};}
 },
 'stars-universe':{
  title:'연주 시차와 우리은하 관찰',codes:['9과15-01','9과15-02'],initial:{kind:'parallax',distance:'near',position:'left',object:'galaxy'},
  fields:s=>[field('kind','관찰 주제',[['parallax','연주 시차'],['galaxy','우리은하·성운·성단']]),...(s.kind==='parallax'?[field('distance','별까지 거리',[['near','가까운 별'],['far','더 먼 별']]),field('position','지구의 관측 위치',[['left','처음 위치'],['right','6개월 뒤 반대쪽']])]:[field('object','관찰 대상',[['galaxy','우리은하'],['nebula','성운'],['cluster','성단']])])],
  view(s){if(s.kind==='parallax'){const toA=s.position==='left'?Math.PI:0,ys=parallaxYs(s.distance);
    const svg=parallaxScene(toA,ys,s,true)+animate('stars-universe',s,{key:'p|'+s.distance+'|'+s.position,duration:2600,frame:(from,t)=>{
     if(from.kind!=='parallax')return fade(t,parallaxScene(toA,ys,s,true));
     const e=ease(t),fromA=from.position==='left'?Math.PI:0;
     const a=fromA===toA?toA:toA===0?Math.PI-Math.PI*e:-Math.PI*e;
     return parallaxScene(a,lerp(parallaxYs(from.distance),ys,e),s,false);}});
    return{svg,text:'지구가 공전하여 관측 위치가 달라지면 가까운 별은 먼 배경 별에 대해 위치가 달라 보입니다. 같은 관측 간격에서 가까운 별일수록 이 변화가 큽니다. 연주 시차는 6개월 간격 최대 각도 차이의 절반입니다.',note:'별이 움직여서가 아니라 지구의 관측 위치가 달라져 별의 위치가 달라 보입니다.'};}
   const scene=t=>s.object==='galaxy'?fade(t,window.scienceObservationScenes.galaxy()):s.object==='nebula'?nebulaScene(t):clusterScene(t);
   const svg=scene(1)+animate('stars-universe',s,{key:'g|'+s.object,duration:s.object==='galaxy'?800:2000,frame:(from,t)=>scene(t)});
   return{svg,text:s.object==='galaxy'?'우리은하는 중심부가 두드러진 원반 모양의 막대 나선 은하이며, 태양계는 중심에서 떨어진 원반에 있습니다. 원반의 지름은 대략 10만 광년 규모입니다.':s.object==='nebula'?'성운은 우주 공간에 있는 기체와 티끌이 모여 있는 것입니다. 별이 모인 성단과 구별합니다.':'성단은 별들이 무리를 이루고 있는 것입니다. 성운의 기체·티끌과 구별합니다.',note:s.object==='galaxy'?'막대·나선팔·원반의 형태를 구별하는 모식도입니다. 나선팔의 수·크기와 태양계 위치를 정밀하게 재현한 지도는 아닙니다.':''};}
 },
 microscope:{
  title:'식물 세포의 구조와 기관의 연결',codes:['6과11-01','6과11-02'],initial:{kind:'cell',part:'wall',stage:'before'},
  fields:s=>[field('kind','관찰 주제',[['cell','식물 세포'],['stem','줄기의 물 이동'],['leaf','잎에서 나가는 물']]),...(s.kind==='cell'?[field('part','구조 이름',[['wall','세포벽'],['membrane','세포막'],['nucleus','핵']])]:[field('stage','관찰 시점',[['before','처음'],['after','시간이 지난 뒤']])])],
  view(s){
   if(s.kind==='cell')return{svg:cellScene(s.part,1)+animate('microscope',s,{key:'c|'+s.part,duration:1400,frame:(from,t)=>from.kind==='cell'?cellScene(s.part,t):fade(t*1.5,cellScene(s.part,t))}),text:'식물은 세포로 이루어져 있습니다. 세포벽, 세포막, 핵의 위치와 이름을 구별합니다. 세포막은 세포벽 안쪽에 있습니다.',note:'실제 양파 표피의 세포막은 세포벽에 붙어 있어 따로 구별하기 어려울 수 있습니다.'};
   const after=s.stage==='after';if(s.kind==='starch')return{svg:'<ellipse cx="140" cy="150" rx="70" ry="100" fill="'+(after?'#293e68':'#82ac69')+'"/><ellipse cx="330" cy="150" rx="70" ry="100" fill="'+(after?'#b9a47b':'#82ac69')+'"/>'+label('빛을 받은 잎',140,35)+label('빛을 가린 잎',330,35),text:after?'준비된 잎에 아이오딘 용액을 떨어뜨리면 빛을 받은 잎에서 청람색 반응이 나타납니다. 잎에서 녹말이 만들어졌음을 알아봅니다.':'남아 있던 녹말을 없앤 식물에서 빛을 받은 잎과 가린 잎을 비교합니다. 물 등 빛 이외의 조건은 같게 합니다.',note:'교사가 준비한 잎을 사용하고 알코올을 직접 가열하지 마세요. 잎에서 만들어진 양분은 다른 기관으로 옮겨져 쓰이거나 저장됩니다.'};
   const grow=(draw)=>(from,t)=>from.kind===s.kind&&from.stage!==s.stage&&after?draw(t):fade(t*1.6,draw(after?1:0));
   if(s.kind==='stem')return{svg:scienceStemWater(after)+animate('microscope',s,{key:'s|'+s.stage,duration:after?2800:600,frame:grow(p=>scienceStemWater(after,p))}),text:after?'색소 물에 꽂아 둔 줄기의 일부가 물들어 있습니다. 줄기가 물의 이동 통로임을 추리할 수 있습니다. 뿌리에서 흡수한 물은 줄기를 지나 잎으로 이동합니다.':'절단한 줄기를 색소 물에 꽂은 처음 모습과 시간이 지난 뒤의 모습을 비교합니다.',note:'줄기와 단면은 통로의 위치를 보여 주는 확대 모형입니다. 색소 물은 줄기 전체가 아니라 일부 통로를 물들입니다.'};
   const svg=leafBagScene(after?1:0)+animate('microscope',s,{key:'l|'+s.stage,duration:after?2800:600,frame:grow(leafBagScene)});
   return{svg,text:after?'잎에서 수증기로 나간 물이 봉지 안쪽에 물방울로 맺힐 수 있습니다. 잎이 있는 가지와 없는 가지를 같은 조건에서 비교하면 잎의 역할을 추리하는 데 도움이 됩니다.':'마른 투명 봉지로 잎이 있는 가지를 감싼 처음 모습과 시간이 지난 뒤를 비교합니다.',note:'봉지는 처음에 말라 있어야 합니다. 흙에서 증발한 물이 들어가지 않도록 조건을 같게 하세요.'};}
 },
 'weather-watch':{
  title:'이슬·안개·구름과 기압에 따른 바람',codes:['6과06-02','6과06-03'],initial:{kind:'dew',direction:'right'},
  fields:s=>[field('kind','관찰 주제',[['dew','이슬'],['fog','안개'],['cloud','구름'],['wind','기압과 바람']]),...(s.kind==='wind'?[field('direction','고기압이 있는 쪽',[['right','왼쪽에 고기압'],['left','오른쪽에 고기압']])]:[])],
  view(s){
   const scene={dew:scienceDewScene,fog:fogScene,cloud:cloudScene,wind:p=>windScene(s,p)}[s.kind];
   const svg=scene(1)+animate('weather-watch',s,{key:s.kind+(s.kind==='wind'?'|'+s.direction:''),duration:s.kind==='wind'?2600:2400,frame:(from,t)=>scene(t)});
   if(s.kind==='wind')return{svg,text:'이 학년에서는 공기가 고기압에서 저기압 쪽으로 이동하여 바람이 분다는 관계를 알아봅니다. 일반적으로 고기압 부근은 맑고, 저기압 부근은 구름과 비가 나타나기 쉽습니다.',note:'실제 바람은 지구의 자전과 지형에도 영향을 받습니다.'};
   if(s.kind==='dew')return{svg,text:'공기 중의 수증기가 차가워진 잎 표면에서 물방울로 변해 맺힌 모습입니다. 물방울은 잎 위에 붙어 있으며, 공기 중에 떠 있는 안개와 다릅니다.',note:'잎 표면과 물방울을 확대한 모형입니다.'};
   return{svg,text:'수증기가 작은 물방울로 변한 모습을 비교합니다. 이슬은 물체 표면에 맺히며, 안개는 지표 가까운 공기 중에, 구름은 높은 공기 중에 떠 있습니다. 구름에는 작은 얼음 알갱이가 포함되기도 합니다.',note:''};}
 },
 'land-sea':{
  title:'바닷물 높이의 변화와 갯벌',codes:['4과06-03'],initial:{water:'high'},
  fields:[field('water','같은 바닷가 관찰',[['high','바닷물이 높을 때'],['low','바닷물이 낮을 때']])],
  view(s){const high=s.water==='high',to=high?150:238;
   const svg=tideScene(to,0,'',s.water)+animate('land-sea',s,{key:s.water,duration:2800,frame:(from,t)=>{const a=from.water==='high'?150:238;return tideScene(lerp(a,to,ease(t)),t*9,high?'물이 들어옴':'물이 빠짐','');}});
   return{svg,text:high?'밀물 때 바닷물이 들어와 높아지면 갯벌이 물에 잠깁니다. 같은 장소의 기준 기둥과 비교합니다.':'썰물 때 바닷물이 빠져나가 낮아지면 갯벌이 드러납니다. 갯벌은 여러 생물의 서식지이며 바닷가 생태계를 지키는 데 중요합니다.',note:'갯벌을 방문할 때는 물이 들어오는 시간과 현장 안전 안내를 확인하세요.'};}
 },
 'sound-vibration':{
  title:'소리의 전달과 소음 줄이기',codes:['4과07-03'],initial:{kind:'string',condition:'on'},
  fields:s=>[field('kind','관찰 상황',[['string','실 전화기'],['noise','같은 소리의 소음 줄이기']]),field('condition','비교 조건',s.kind==='string'?[['on','실을 팽팽하게'],['off','실을 느슨하게']]:[['on','창문을 닫음'],['off','창문을 열음']])],
  view(s){const base=window.scienceObservationScenes.sound(s);
   return{...base,svg:soundScene(s,1)+animate('sound-vibration',s,{key:s.kind+'|'+s.condition,duration:2600,frame:(from,t)=>soundScene(s,t)})};}
 },
 'rock-layers':{
  title:'화석의 특징으로 과거 환경 추리하기',codes:['6과01-03'],initial:{fossil:'shell',focus:'whole'},
  fields:[field('fossil','실제 화석 표본',[['shell','바다 조개 화석'],['leaf','나뭇잎 화석']]),field('focus','관찰 초점',[['whole','전체 보기'],['detail','특징 확대']])],

  view(s){const shell=s.fossil==='shell';const item=shell?{
   name:'바다 조개 화석',src:'assets/observations/shell-fossil.webp',author:'Ghedoghedo',source:'https://commons.wikimedia.org/wiki/File:Amussiopecten_pasinii.JPG',alt:'암석에 남아 있는 부채 모양 조개와 방사상으로 뻗은 굴곡',caption:'사진 왼쪽의 부채 모양과 길게 뻗은 굴곡을 관찰하세요.',origin:'25% 42%'
  }:{
   name:'나뭇잎 화석',src:'assets/observations/leaf-fossil.webp',author:'The Utahraptor (Raptor)',source:'https://commons.wikimedia.org/wiki/File:Leaf_Fossil.jpg',alt:'암석 표면에 남은 갈색 나뭇잎의 윤곽과 중앙에서 갈라지는 잎맥',caption:'잎의 윤곽 안에서 가운데 잎맥과 양옆으로 갈라지는 잎맥을 찾아보세요.',origin:'50% 48%'
  };
  Object.assign(item,{collection:'',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/'});
  return{media:{items:[item],enlarged:s.focus==='detail',zoom:1.8,info:'서로 다른 실제 화석 표본입니다. 표본의 실제 크기 비율과 화면의 크기는 다릅니다. 사진은 크기 조정·JPEG 압축을 했으며, 확대 시 화면에서 일부가 잘려 보입니다.'},text:shell?'껍데기 모양이 남은 바다 조개 화석은 이 지층이 만들어질 당시 바다 환경이었을 가능성을 뒷받침합니다. 화석이 옮겨져 쌓였을 가능성 등도 함께 살핍니다.':'잎의 모양과 잎맥이 남아 있습니다. 과거에 식물이 살았다는 증거이며, 어떤 식물인지와 다른 화석·지층 자료를 함께 보면 환경을 더 구체적으로 추리할 수 있습니다.',note:'화석 하나만으로 당시의 모든 환경을 알 수는 없습니다. 여러 자료를 함께 비교합니다.'};}
 },
 'minerals-rocks':{
  title:'암석의 생성 과정과 순환',codes:['9과09-03'],initial:{process:'cool'},
  fields:[field('process','어떤 과정이 일어났나요?',[['cool','마그마가 식음'],['deposit','퇴적물이 쌓여 굳음'],['change','높은 열과 압력을 받음'],['melt','암석이 녹음']])],
  view(s){const svg=scienceRockProcess(s.process)+animate('minerals-rocks',s,{key:s.process,duration:2800,frame:(from,t)=>scienceRockProcess(s.process,t)});return{svg,text:{cool:'마그마가 식어 굳으면 화성암이 됩니다. 현무암·유문암·화강암·반려암을 생성 조건과 관련지어 비교합니다.',deposit:'퇴적물이 쌓이고 굳어 퇴적암이 됩니다. 이암·사암·역암·석회암을 관찰합니다. 지표의 암석이 부서지고 이동하여 퇴적물이 될 수 있습니다.',change:'암석이 녹지 않은 상태에서 높은 열과 압력으로 성질이 바뀌면 변성암이 됩니다. 편암·편마암·대리암·규암이 있습니다.',melt:'암석이 녹으면 마그마가 될 수 있습니다. 식음·퇴적·변성·녹음 등의 과정을 거치며 암석이 순환합니다. 반드시 정해진 한 순서만 따르는 것은 아닙니다.'}[s.process],note:'암석은 색과 무늬뿐 아니라 알갱이와 생성 과정도 함께 살펴 구분합니다.'};}
 }
 });
})();
