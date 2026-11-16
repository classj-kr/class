/* Grade-specific observations. Numerical readings below are explicitly hypothetical,
   not imported measurements or a prediction of a particular real apparatus. */
(() => {
 const line=(x1,y1,x2,y2,color='#64748b',width=4)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
 const label=(text,x,y,color='#173f50',size=16)=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="middle">${text}</text>`;
 const rect=(x,y,w,h,fill)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}"/>`;
 const jar=(x,height,color)=>{
  const top=230-height,glass='observationGlass'+String(x).replace('.','_'),liquid='observationLiquid'+String(x).replace('.','_');
  const marks=[95,120,145,170,195].map((y,i)=>`<path d="M${x+83} ${y} h${i%2?9:15}" stroke="#698695" stroke-width="1.2" opacity=".65"/>`).join('');
  return `<g data-observation-beaker><defs><linearGradient id="${glass}"><stop stop-color="#c2d7e1" stop-opacity=".35"/><stop offset=".22" stop-color="#fff" stop-opacity=".15"/><stop offset=".72" stop-color="#dce9ee" stop-opacity=".16"/><stop offset="1" stop-color="#85a8ba" stop-opacity=".32"/></linearGradient><linearGradient id="${liquid}" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${color}"/><stop offset=".42" stop-color="${color}" stop-opacity=".78"/><stop offset="1" stop-color="${color}"/></linearGradient></defs>`+
   `<ellipse cx="${x+55}" cy="243" rx="63" ry="7" fill="#254754" fill-opacity=".08"/>`+
   `<path d="M${x} 59 L${x+3} 227 Q${x+3} 237 ${x+14} 237 H${x+96} Q${x+107} 237 ${x+107} 227 L${x+110} 59" fill="url(#${glass})" stroke="#7896a5" stroke-width="2"/>`+
   `<path data-observation-liquid d="M${x+6} ${top} Q${x+55} ${top+9} ${x+104} ${top} L${x+101} 225 Q${x+101} 231 ${x+94} 231 H${x+16} Q${x+9} 231 ${x+9} 225 Z" fill="url(#${liquid})"/>`+
   `<ellipse cx="${x+55}" cy="${top}" rx="49" ry="5" fill="${color}" fill-opacity=".7" stroke="#6595a7" stroke-opacity=".65" stroke-width="1"/>`+
   marks+`<path d="M${x+12} 74 L${x+15} 217" stroke="#fff" stroke-opacity=".72" stroke-width="4" stroke-linecap="round"/>`+
   `<ellipse cx="${x+55}" cy="59" rx="55" ry="7" fill="none" stroke="#7e9daa" stroke-width="1.5"/><path d="M${x+16} 234 H${x+94}" stroke="#668c9e" stroke-opacity=".55" stroke-width="1.5"/></g>`;
 };
 const field=(key,title,items)=>({key,title,items:items.map(([value,text])=>({value,text}))});
 const steps=field('stage','관찰 시점',[['before','처음'],['after','변화 뒤']]);

 /* 움직이는 장면: 장면 함수는 (t: 0~1, sec: 지난 초)를 받아 SVG 문자열을 돌려준다.
    t=1 이 멈춘 최종 그림이며, view()의 svg 는 언제나 t=1 그림이다. */
 const clamp=(v,a=0,b=1)=>v<a?a:v>b?b:v;
 const seg=(t,a,b)=>clamp((t-a)/(b-a));
 const ease=t=>t<.5?2*t*t:1-(-2*t+2)**2/2;
 const lerp=(a,b,t)=>a+(b-a)*t;
 const rnd=i=>{const v=Math.sin(i*127.1+311.7)*43758.5453;return v-Math.floor(v);};
 const r1=n=>Math.round(n*10)/10;
 const op=o=>o<.995?` opacity="${Math.max(0,o).toFixed(2)}"`:'';
 const hexMix=(a,b,t)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(lerp(v,B[i],clamp(t))).toString(16).padStart(2,'0')).join('');};
 const tag=(s,x,y,o={})=>(o.opacity!==undefined&&o.opacity<=0)?'':`<text x="${x}" y="${y}" fill="${o.color||'#284651'}" font-size="${o.size||14}" font-weight="${o.weight||600}" text-anchor="${o.anchor||'middle'}"${op(o.opacity??1)} stroke="#fff" stroke-width="3.5" stroke-linejoin="round" paint-order="stroke">${s}</text>`;
 const lead=(x1,y1,x2,y2,o=1)=>o<=0?'':`<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="#7d949c" stroke-width="1.3"${op(o)}/>`;
 const cube=(x,y,s=7,o=1,attr='')=>{
  if(s<.6||o<=0)return '';x=r1(x-s/2);y=r1(y);const h=r1(s/2),q=r1(s*.3),d=r1(s*.75);
  return `<g${attr?' '+attr:''}${op(o)}><path d="M${x} ${y} l${h} ${-q} l${h} ${q} l${-h} ${q} Z" fill="#fff"/><path d="M${x} ${y} l${h} ${q} v${d} l${-h} ${-q} Z" fill="#e3e9ec"/><path d="M${r1(x+s)} ${y} l${-h} ${q} v${d} l${h} ${-q} Z" fill="#c4cfd5"/><path d="M${x} ${y} l${h} ${-q} l${h} ${q} v${d} l${-h} ${q} l${-h} ${-q} Z" fill="none" stroke="#8d9ca4" stroke-width=".7"/></g>`;
 };
 const grain=(x,y,i,o=1)=>`<ellipse data-sand cx="${r1(x)}" cy="${r1(y)}" rx="${(2.2+(i%3)*.8).toFixed(1)}" ry="1.8" fill="${['#a88455','#c4a479','#85765d'][i%3]}" transform="rotate(${Math.round(rnd(i+9)*180)} ${r1(x)} ${r1(y)})"${op(o)}/>`;
 // 비커: 위 가장자리 y, 바닥 y+h, level 은 액체 높이(px)
 function glass(x,y,w,h,o={}){
  const b=y+h,lv=o.level||0,top=r1(b-lv),c=o.color||'#cbe7f0',a=o.alpha??.8;
  let s=`<path d="M${x} ${y+4} V${b-8} Q${x} ${b} ${x+8} ${b} H${x+w-8} Q${x+w} ${b} ${x+w} ${b-8} V${y+4} Z" fill="#eef6f8" fill-opacity=".45"/>`;
  if(lv>.6)s+=`<path${o.attr?' '+o.attr:''} d="M${x+2} ${top} H${x+w-2} V${b-7} Q${x+w-2} ${b-2} ${x+w-8} ${b-2} H${x+8} Q${x+2} ${b-2} ${x+2} ${b-7} Z" fill="${c}" fill-opacity="${a}"/><ellipse cx="${x+w/2}" cy="${top}" rx="${w/2-2}" ry="3" fill="${hexMix(c,'#ffffff',.45)}" fill-opacity="${a}"/>`;
  s+=o.inner||'';
  s+=`<path d="M${x-5} ${y-2} Q${x} ${y-1} ${x} ${y+4} V${b-8} Q${x} ${b} ${x+8} ${b} H${x+w-8} Q${x+w} ${b} ${x+w} ${b-8} V${y+4} Q${x+w} ${y} ${x+w+3} ${y-1}" fill="none" stroke="#6f8f9d" stroke-width="2" stroke-linejoin="round"/>`;
  for(let i=1;i<=3;i++)s+=`<path d="M${x+w-4} ${r1(b-h*i/4)} h-${i%2?7:11}" stroke="#7b98a5" stroke-width="1.1" opacity=".7"/>`;
  return s+`<path d="M${x+6} ${y+10} V${b-12}" stroke="#fff" stroke-opacity=".8" stroke-width="3" stroke-linecap="round"/>`;
 }
 // 올라가는 김(작은 물방울이 보이는 것). amount 0~1
 function wisps(cx,baseY,sec,amount,spread=90,n=6){
  if(amount<=.02)return '';let s='';
  for(let i=0;i<n;i++){const ph=(sec*.55+i/n)%1,x=cx-spread/2+spread*(i+.5)/n+Math.sin(ph*5+i*2)*7,y=baseY-ph*78,o=amount*(1-ph)*Math.min(1,ph*5)*.8;
   s+=`<path d="M${r1(x)} ${r1(y)} q-7 -9 0 -18 q7 -9 0 -18" fill="none" stroke="#b7c9d1" stroke-width="7" stroke-linecap="round"${op(o)}/>`;}
  return s;
 }
 const drop=(x,y,c='#8cc9dc')=>`<path d="M${r1(x)} ${r1(y-5)} Q${r1(x+3.4)} ${r1(y)} ${r1(x)} ${r1(y+3)} Q${r1(x-3.4)} ${r1(y)} ${r1(x)} ${r1(y-5)} Z" fill="${c}"/>`;

 /* ---- 소금과 모래 ---- */
 function saltMixed(){
  let s='<ellipse cx="230" cy="174" rx="150" ry="60" fill="#e8eef0" stroke="#a2b4bb" stroke-width="1.5"/><ellipse cx="230" cy="168" rx="136" ry="48" fill="#fbfcfb" stroke="#c8d3d7"/><path d="M128 150 Q180 126 250 124" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>';
  for(let i=0;i<46;i++){const a=rnd(i+3)*6.283,r=Math.sqrt(rnd(i+71))*.9;s+=grain(230+Math.cos(a)*r*116,170+Math.sin(a)*r*36,i);}
  for(let i=0;i<20;i++){const a=rnd(i+140)*6.283,r=Math.sqrt(rnd(i+190))*.88;s+=cube(230+Math.cos(a)*r*112,166+Math.sin(a)*r*32,7,1,'data-salt-crystal');}
  s+=grain(172,152,1)+cube(288,152,9,1,'data-salt-crystal');
  return s+tag('모래',118,86)+lead(128,92,169,147)+tag('소금',344,86)+lead(334,92,292,146)+tag('섞인 두 고체',230,274);
 }
 function saltDissolve(t,sec){
  const X=150,Y=92,W=160,B=Y+158,surf=B-96,stir=seg(t,.4,.47)*(1-seg(t,.78,.86)),lip=[270,84];
  let inner='',air='';
  const fall=(rel,tx)=>{const f=(t-rel)/.07;return f<1?{x:lerp(lip[0],tx,f),y:lerp(lip[1],surf,f*f),air:true}:null;};
  for(let i=0;i<34;i++){
   const rel=.05+.27*rnd(i+11),tx=lerp(X+14,X+W-14,rnd(i+23)),by=B-5-rnd(i+37)*6;if(t<rel)continue;
   const a=fall(rel,tx);if(a){air+=grain(a.x,a.y,i);continue;}
   const k=ease(seg(t,rel+.07,rel+.21));let y=lerp(surf,by,k)-stir*(8+26*rnd(i+5))*(.6+.4*Math.sin(sec*3+i)),x=clamp(tx+stir*Math.sin(sec*4+i*1.7)*14,X+8,X+W-8);
   inner+=grain(x,y,i);
  }
  for(let i=0;i<14;i++){
   const rel=.06+.26*rnd(i+51),tx=lerp(X+20,X+W-20,rnd(i+61));if(t<rel)continue;
   const size=7*(1-seg(t,.44+.08*rnd(i+81),.8+.06*rnd(i+91)));if(size<.6)continue;
   const a=fall(rel,tx);if(a){air+=cube(a.x,a.y,7,1,'data-salt-crystal');continue;}
   const y=lerp(surf,B-12,seg(t,rel+.07,rel+.42)),x=clamp(tx+stir*Math.sin(sec*4+i)*18,X+10,X+W-10);
   inner+=cube(x,y,size,1,'data-salt-crystal');
  }
  if(stir>0)for(let i=0;i<3;i++)inner+=`<ellipse cx="230" cy="${200+i*14}" rx="${54-i*10}" ry="7" fill="none" stroke="#9cc8d6" stroke-width="1.6" stroke-dasharray="26 18" stroke-dashoffset="${r1(-sec*90*(i%2?1:-1))}"${op(stir*.8)}/>`;
  let s=glass(X,Y,W,158,{level:96,color:'#cfe8f2',alpha:.8,inner})+air;
  const dish=1-seg(t,.38,.46);
  if(dish>0){
   const ang=-38*ease(seg(t,0,.1)),left=Math.round(12*(1-seg(t,.05,.34)));let g='';
   for(let i=0;i<left;i++)g+=i%3?grain(-24+i*4.2,-1+(i%2)*2,i):cube(-24+i*4.2,-3,5);
   s+=`<g transform="translate(300 62) rotate(${r1(ang)})"${op(dish)}><path d="M-40 -5 Q0 18 40 -5" fill="#e8eef0" stroke="#91a5ad" stroke-width="2"/>${g}</g>`;
  }
  if(t>.36){
   const enter=ease(seg(t,.36,.42)),tipX=228+Math.sin(sec*5)*42*stir,tipY=lerp(118,240,enter);
   s+=`<path d="M${r1(tipX+44)} 58 L${r1(tipX)} ${r1(tipY)}" stroke="#9fbcc6" stroke-width="5" stroke-linecap="round"/><path d="M${r1(tipX+43)} 60 L${r1(tipX-1)} ${r1(tipY-2)}" stroke="#eef6f8" stroke-width="1.5"/>`;
  }
  const lab=seg(t,.9,1);
  return s+tag('물',112,172)+lead(120,168,154,168)+tag('물에 녹은 소금',374,124,{opacity:lab})+lead(324,130,294,168,lab)+tag('녹지 않은 모래',374,228,{opacity:lab})+lead(324,232,292,243,lab)+tag('저은 뒤',230,284,{opacity:lab});
 }
 function saltFilter(t,sec){
  const tilt=ease(seg(t,0,.12)),drain=seg(t,.12,.72),pourOn=t>.12&&t<.74;
  const level=t<.12?0:t<.72?seg(t,.12,.3):1-seg(t,.72,1)*.7,L=lerp(157,126,level);
  const filt=26*ease(seg(t,.22,1)),sandFill=seg(t,.15,.7),surfY=272-filt;
  const half=y=>(158-y)/54*49;
  let s='<rect x="300" y="282" width="128" height="10" rx="3" fill="#8b9aa1"/><path d="M398 282 V58" stroke="#8b9aa1" stroke-width="6" stroke-linecap="round"/>';
  s+=glass(188,200,90,72,{level:filt,color:'#bfe3ee',alpha:.85,attr:'data-filtrate'});
  let flow='';
  if(level>.15)for(let i=0;i<2;i++){const ph=t>=1?[.15,.62][i]:(sec*1.5+i/2)%1;flow+=drop(232,229+ph*(surfY-232));}
  s+=`<g data-filtrate-flow>${flow}</g>`;
  s+='<path d="M172 100 L224 164 V222 L236 228 V164 L288 100" fill="#e9f3f6" fill-opacity=".55" stroke="#6f8f9d" stroke-width="2" stroke-linejoin="round"/>';
  s+='<path data-filter-paper d="M180 103 L230 158 L280 103 Q230 112 180 103 Z" fill="#fffcf0" stroke="#c6ba9f" stroke-width="1.4"/><path d="M247 106 L230 156" stroke="#d6cbb0" stroke-width="1.4"/>';
  if(level>0){const hw=half(L);s+=`<path d="M${r1(230-hw)} ${r1(L)} L${r1(230+hw)} ${r1(L)} L230 156 Z" fill="#9fd2e2" fill-opacity=".85"/><ellipse cx="230" cy="${r1(L)}" rx="${r1(hw)}" ry="2.5" fill="#cfeaf2"/>`;}
  if(sandFill>0){s+=`<path d="M215 142 L230 156 L245 142 Q230 147 215 142 Z" fill="#c6b697"${op(sandFill)}/>`;const n=Math.round(22*sandFill);for(let i=0;i<n;i++){const y=153-rnd(i+201)*15*(.4+.6*sandFill);s+=grain(230+(rnd(i+211)*2-1)*half(y)*.8,y,i);}}
  s+='<ellipse cx="230" cy="100" rx="58" ry="9" fill="none" stroke="#6f8f9d" stroke-width="2"/><path d="M398 116 H276" stroke="#8b9aa1" stroke-width="5" stroke-linecap="round"/><rect x="389" y="109" width="18" height="14" rx="3" fill="#6f7f86"/>';
  // 붓는 비커(물대를 따라 따름)
  const ang=35*tilt,ca=Math.cos(ang*Math.PI/180),sa=Math.sin(ang*Math.PI/180),tr=`translate(160 60) rotate(${r1(ang)}) translate(-60 0)`;
  const W=(lx,ly)=>{const px=lx-60;return[160+px*ca-ly*sa,60+px*sa+ly*ca];};
  const yS=t<.12?lerp(92,66,tilt):lerp(66,115,ease(drain));
  s+=`<path transform="${tr}" d="M0 2 V58 Q0 66 8 66 H52 Q60 66 60 58 V2 Z" fill="#eef6f8" fill-opacity=".5"/>`;
  if(drain<1)s+=`<clipPath id="slPourClip"><path transform="${tr}" d="M2 2 V59 Q2 64 7 64 H53 Q58 64 58 59 V2 Z"/></clipPath><rect x="30" y="${r1(yS)}" width="160" height="130" fill="#bfe3ee" fill-opacity=".85" clip-path="url(#slPourClip)"/>`;
  const keep=Math.round(10*(1-sandFill));for(let i=0;i<keep;i++){const [x,y]=W(40+rnd(i+230)*14,59+rnd(i+240)*4);s+=grain(x,y,i);}
  s+=`<path transform="${tr}" d="M0 0 V58 Q0 66 8 66 H52 Q60 66 60 58 V6 Q60 1 66 -1" fill="none" stroke="#6f8f9d" stroke-width="2"/>`;
  s+='<path d="M150 50 L240 128" stroke="#9fbcc6" stroke-width="5" stroke-linecap="round"/><path d="M151 52 L239 128" stroke="#eef6f8" stroke-width="1.4"/>';
  if(pourOn)s+=`<path d="M162 62 L237 128" stroke="#86c3d8" stroke-width="4" stroke-linecap="round" stroke-dasharray="11 6" stroke-dashoffset="${r1(-sec*70)}"${op(seg(t,.12,.16)*(1-seg(t,.7,.74)))}/>`;
  return s+tag('유리 막대',258,46)+lead(228,52,200,93)+tag('거름종이',350,82)+lead(330,88,268,108)+tag('깔때기',120,208)+lead(142,204,222,190)+tag('남은 모래',106,162,{opacity:seg(t,.6,.75)})+lead(140,158,216,146,seg(t,.6,.75))+tag('거른 소금물',233,298);
 }
 function saltEvaporate(t,sec){
  const v=1-ease(seg(t,.1,.86)),heat=seg(t,0,.12)*(1-seg(t,.88,1)*.75),plate=hexMix('#8f9aa0','#e8572a',heat);
  let s=`<defs><radialGradient id="slGlow"><stop offset="0" stop-color="#ff8a3d" stop-opacity=".75"/><stop offset="1" stop-color="#ff8a3d" stop-opacity="0"/></radialGradient><radialGradient id="slDishIn" cx=".5" cy=".35"><stop offset="0" stop-color="#fbfaf5"/><stop offset="1" stop-color="#dcd8cb"/></radialGradient></defs>`;
  s+=`<ellipse cx="230" cy="224" rx="132" ry="18" fill="url(#slGlow)"${op(heat)}/><rect x="117" y="232" width="226" height="38" rx="9" fill="#e3e8eb" stroke="#8a9aa1" stroke-width="1.5"/><rect x="125" y="222" width="210" height="11" rx="4" fill="${plate}" stroke="#6e7b81"/><circle cx="310" cy="251" r="9" fill="#6b7a81"/><path d="M310 251 l5 -6" stroke="#e3e8eb" stroke-width="2"/><circle cx="150" cy="251" r="4" fill="${heat>.3?'#ef4444':'#b9c2c6'}"/>`;
  s+='<path d="M138 168 C141 204 186 222 230 222 C274 222 319 204 322 168 Z" fill="#f1efe8" stroke="#a4aca8" stroke-width="2"/><ellipse cx="230" cy="168" rx="92" ry="26" fill="url(#slDishIn)" stroke="#a4aca8" stroke-width="2"/><path d="M138 168 q-8 -3 -10 -8" fill="none" stroke="#a4aca8" stroke-width="2"/>';
  const crust=seg(t,.55,1);if(crust>0)s+=`<ellipse cx="230" cy="184" rx="62" ry="10" fill="#f8f7f1" stroke="#e1ddd0"${op(crust)}/>`;
  let surfY=186;
  if(v>.02){const rx=lerp(12,80,Math.sqrt(v));surfY=lerp(187,175,v);s+=`<ellipse cx="230" cy="${r1(surfY)}" rx="${r1(rx)}" ry="${r1(rx*.27)}" fill="#c9e6ef" fill-opacity=".9" stroke="#9fcbd8" stroke-width="1.2"/><ellipse cx="${r1(230-rx*.25)}" cy="${r1(surfY-rx*.08)}" rx="${r1(rx*.35)}" ry="${r1(rx*.06)}" fill="#fff" opacity=".6"/>`;}
  for(let i=0;i<24;i++){const a=rnd(i+300)*6.283,rr=Math.sqrt(rnd(i+330)),x=230+Math.cos(a)*rr*58,y=181+Math.sin(a)*rr*7.5,at=.33+.48*(1-rr)+.08*rnd(i+360);
   s+=cube(x,y,lerp(3,7.5,seg(t,at,at+.12)),seg(t,at,at+.06),'data-salt-crystal');}
  const steam=heat*clamp(v*3)*seg(t,.1,.22);
  s+=wisps(230,surfY-8,sec,steam,96);
  return s+tag('물이 증발',230,74,{opacity:steam})+tag('증발 접시',394,150)+lead(356,155,318,162)+tag('가열 장치',394,256)+lead(355,253,344,252)+tag('소금',92,180,{opacity:seg(t,.86,1)})+lead(108,177,184,183,seg(t,.86,1));
 }
 function saltSeparationScene(stage,t=1,sec=0){
  const svg=stage==='mixed'?saltMixed():stage==='dissolve'?saltDissolve(t,sec):stage==='filter'?saltFilter(t,sec):saltEvaporate(t,sec);
  return '<g data-observation-scene="salt-separation" data-stage="'+stage+'">'+svg+'</g>';
 }

 /* ---- 물과 기름: 분별 깔때기 ---- */
 const funnelHalf=y=>{const u=clamp((y-52)/144);return Math.max(4,8*(1-u)+48*Math.sin(Math.PI*u**.7));};
 const funnelBody=(()=>{const L=[],R=[];for(let y=52;y<=196;y+=4){L.push(r1(200-funnelHalf(y))+' '+y);R.unshift(r1(200+funnelHalf(y))+' '+y);}return 'M'+L.join(' L')+' L'+R.join(' L')+' Z';})();
 const funnelVol=(()=>{const c=[0];for(let y=53;y<=200;y++)c.push(c.at(-1)+funnelHalf(y-.5)**2);return y=>{const k=clamp(y-52,0,148),i=Math.floor(k);return c[i]+(c[Math.min(i+1,c.length-1)]-c[i])*(k-i);};})();
 const oilTopFor=(iface,vol)=>{let a=52,b=iface;for(let k=0;k<30;k++){const m=(a+b)/2;if(funnelVol(iface)-funnelVol(m)>vol)a=m;else b=m;}return (a+b)/2;};
 function oilScene(stage,t=1,sec=0){
  const top0=82,if0=118,oilVol=funnelVol(if0)-funnelVol(top0);
  let shake=0,top=top0,iface=if0,emuls=0,drops=[],stopper=1,tap=0,flowOn=false,beakerLv=0;
  const d0=Array.from({length:24},(_,i)=>{const y=lerp(88,186,rnd(i+500));return{x:200+(rnd(i+520)*2-1)*(funnelHalf(y)-7),y,r:2.5+rnd(i+540)*4};});
  if(stage==='mixed'){shake=Math.sin(sec*16)*13*(1-seg(t,.55,.78));emuls=1;iface=top0;drops=d0.map((d,i)=>({...d,x:d.x+Math.sin(sec*9+i)*4*Math.abs(shake)/13,o:1}));}
  else if(stage==='settle'){const g=ease(seg(t,.08,.85));iface=lerp(top0+2,if0,g);top=top0;emuls=1-seg(t,0,.6);
   drops=d0.map((d,i)=>{const dl=.04+.32*rnd(i+560),p=ease(seg(t,dl,dl+.42));return{...d,y:lerp(d.y,top0+4+rnd(i+580)*20,p),o:1-seg(t,dl+.3,dl+.45)};}).filter(d=>d.o>0);}
  else{stopper=1-seg(t,0,.12);tap=seg(t,.1,.2)*(1-seg(t,.86,.94));const fp=ease(seg(t,.18,.88));iface=lerp(if0,193,fp);top=oilTopFor(iface,oilVol);flowOn=tap>.5;beakerLv=34*(funnelVol(iface)-funnelVol(if0))/(funnelVol(193)-funnelVol(if0));}
  let s='<rect x="268" y="288" width="140" height="8" rx="3" fill="#8b9aa1"/><path d="M372 288 V30" stroke="#8b9aa1" stroke-width="6" stroke-linecap="round"/>';
  s+=glass(160,236,80,56,{level:beakerLv,color:'#8ccbe8',alpha:.85});
  if(flowOn)s+=`<path d="M200 249 V${r1(292-beakerLv)}" stroke="#7cbfe0" stroke-width="3.5" stroke-dasharray="9 5" stroke-dashoffset="${r1(-sec*60)}"/>`;
  let body=`<clipPath id="slSepClip"><path d="${funnelBody}"/></clipPath><path d="${funnelBody}" fill="#eef6f8" fill-opacity=".5"/><g clip-path="url(#slSepClip)">`;
  body+=`<rect x="140" y="${r1(iface)}" width="120" height="${r1(200-iface)}" fill="#8ccbe8"/>`;
  if(iface>top+.5)body+=`<rect x="140" y="${r1(top)}" width="120" height="${r1(iface-top)}" fill="#f2cf5b"/><path d="M140 ${r1(iface)} H260" stroke="#d7b143" stroke-width="1.5"/>`;
  if(emuls>0)body+=`<rect x="140" y="${top0}" width="120" height="120" fill="#e7e6b0"${op(emuls*.45)}/>`;
  for(const d of drops)body+=`<circle cx="${r1(d.x)}" cy="${r1(d.y)}" r="${r1(d.r)}" fill="#f4d061" stroke="#d2a92e" stroke-width=".8"${op(d.o)}/>`;
  body+=`<ellipse cx="200" cy="${r1(top)}" rx="${r1(funnelHalf(top)-1)}" ry="3" fill="${iface>top+.5?'#f8e08c':'#b9dff0'}"/></g>`;
  body+=`<path d="${funnelBody}" fill="none" stroke="#6f8f9d" stroke-width="2"/><path d="M${r1(200-funnelHalf(70)+6)} 72 Q${r1(200-funnelHalf(100)+5)} 104 ${r1(200-funnelHalf(140)+8)} 142" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="3" stroke-linecap="round"/>`;
  body+=`<path d="M192 52 V36 M208 52 V36" stroke="#6f8f9d" stroke-width="2"/>`;
  if(stopper>0)body+=`<rect x="190" y="${r1(24-18*(1-stopper))}" width="20" height="14" rx="3" fill="#d6dde0" stroke="#7e97a2"${op(stopper)}/>`;
  body+=`<rect x="197" y="200" width="6" height="48" fill="${flowOn?'#8ccbe8':'#eef6f8'}" stroke="#6f8f9d" stroke-width="1.5"/><rect x="186" y="195" width="28" height="11" rx="4" fill="#e4ecef" stroke="#6f8f9d"/>`;
  body+=`<rect x="176" y="198" width="48" height="5" rx="2.5" fill="#557380" transform="rotate(${r1(90*tap)} 200 200.5)"/>`;
  s+=shake?`<g transform="rotate(${r1(shake)} 200 120)">${body}</g>`:body;
  s+=`<path d="M372 172 H${r1(200+funnelHalf(172)+4)}" stroke="#8b9aa1" stroke-width="5" stroke-linecap="round"/><ellipse cx="200" cy="172" rx="${r1(funnelHalf(172)+4)}" ry="5" fill="none" stroke="#8b9aa1" stroke-width="3"/>`;
  const fin=seg(t,.85,1);
  if(stage==='mixed')s+=tag('기름 방울',96,128,{opacity:fin})+lead(132,128,r1(d0[3].x),r1(d0[3].y),fin);
  else{const my=(top+iface)/2;s+=tag('기름',104,r1(my+5),{opacity:fin})+lead(120,r1(my),r1(200-funnelHalf(my)+4),r1(my),fin);
   if(stage==='settle')s+=tag('물',104,156,{opacity:fin})+lead(114,152,r1(200-funnelHalf(152)+4),152,fin);
   else s+=tag('물',292,272,{opacity:fin})+lead(282,268,242,270,fin);}
  return s+tag('꼭지',126,214)+lead(142,210,184,201);
 }

 /* ---- 공기의 무게 ---- */
 const airCount={same:30,more:44,less:20},airMass={same:500,more:501,less:499};
 function gasScene(air,t=1,sec=0,from=air){
  const n0=airCount[from],n1=airCount[air],jit=(1-seg(t,.88,1))*(t<1?1:0);
  let s='<rect x="150" y="202" width="160" height="7" rx="3" fill="#9aa8ae"/><rect x="138" y="209" width="184" height="50" rx="10" fill="#e2e8ec" stroke="#8a9aa1" stroke-width="1.5"/><rect x="188" y="218" width="84" height="30" rx="4" fill="#d1fae5" stroke="#7fb8a0"/>';
  s+=`<text x="230" y="240" fill="#14532d" font-size="19" font-weight="700" text-anchor="middle" font-family="ui-monospace,Consolas,monospace">${(t<.8?airMass[from]:airMass[air])+' g'}</text>`;
  s+='<path d="M214 66 V74 Q214 84 196 88 Q178 92 178 108 V186 Q178 200 192 200 H268 Q282 200 282 186 V108 Q282 92 264 88 Q246 84 246 74 V66 Z" fill="#e6f3f8" fill-opacity=".6" stroke="#6f8f9d" stroke-width="2"/><path d="M188 110 V182" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-opacity=".85"/>';
  const slot=k=>[lerp(188,272,rnd(k+400)),lerp(100,190,rnd(k+450))];
  for(let k=0;k<Math.max(n0,n1);k++){
   let [x,y]=slot(k),o=1;
   if(k>=n0){const a=.08+.6*(k-n0)/(n1-n0),p=ease(seg(t,a,a+.14));if(p<=0)continue;x=lerp(230,x,p);y=lerp(70,y,p);}
   else if(k>=n1){const a=.06+.6*(k-n1)/(n0-n1),p=seg(t,a,a+.16);if(p>=1)continue;const q=ease(p);if(q<.45){x=lerp(x,230,q/.45);y=lerp(y,78,q/.45);}else if(q<.7){x=lerp(230,262,(q-.45)/.25);y=lerp(78,53,(q-.45)/.25);}else{x=lerp(262,300+(k%3)*9,(q-.7)/.3);y=lerp(53,62-(k%2)*16,(q-.7)/.3);}o=1-seg(p,.75,1);}
   x+=Math.sin(sec*2.3+k)*2.5*jit;y+=Math.cos(sec*2.9+k*1.3)*2.5*jit;
   s+=`<circle cx="${r1(x)}" cy="${r1(y)}" r="3.2" fill="#6aa6c0"${op(o)}/>`;
  }
  const pump=n1>n0?7*Math.abs(Math.sin(Math.PI*5*seg(t,.05,.75))):0,valve=n1<n0?4*seg(t,.03,.08)*(1-seg(t,.72,.78)):0;
  s+=`<path d="M230 ${r1(30+pump)} V42" stroke="#6f8590" stroke-width="4"/><rect x="218" y="${r1(24+pump)}" width="24" height="9" rx="3" fill="#93aeb8" stroke="#6f8590"/><rect x="206" y="40" width="48" height="28" rx="5" fill="#5d7f8c"/><rect x="${r1(254-valve)}" y="47" width="8" height="12" rx="2" fill="#d97706"/>`;
  if(valve>1)for(let i=0;i<3;i++){const ph=(sec*2.4+i/3)%1;s+=`<path d="M${r1(266+ph*26)} ${48+i*6} q5 -3 10 0" fill="none" stroke="#7aa9bd" stroke-width="2"${op(1-ph)}/>`;}
  const act=t<1?seg(t,0,.08)*(1-seg(t,.8,.95)):0;
  return s+tag('공기 넣는 마개',356,28)+lead(306,32,256,42)+tag(n1>n0?'공기 넣기':'공기 빼기',n1>n0?158:356,n1>n0?36:84,{opacity:act})+tag('용기의 부피는 같음',230,290);
 }

 /* ---- 열의 이동 ---- */
 const warmColor=T=>T<50?hexMix('#9fd0ee','#efe2c6',(T-20)/30):hexMix('#efe2c6','#f29a7e',(T-50)/30);
 function thermo(x,top,bulb,T){const h=r1(12+T*1.45);return `<rect x="${x-4}" y="${top}" width="8" height="${bulb-top}" rx="4" fill="#fff" stroke="#9fb2ba"/>${[0,1,2,3,4].map(i=>`<path d="M${x+4} ${r1(bulb-12-i*36.25)} h4" stroke="#9fb2ba"/>`).join('')}<rect x="${x-1.6}" y="${r1(bulb-h)}" width="3.2" height="${h}" fill="#d64545"/><circle cx="${x}" cy="${bulb}" r="6.5" fill="#d64545"/>`;}
 function contactScene(s,t=1,sec=0){
  const after=s.stage==='after',hot=+s.hot,cold=+s.cold,mean=(hot+cold)/2,k=after?(1-Math.exp(-4.5*t))/(1-Math.exp(-4.5)):0;
  const Th=t>=1&&after?mean:lerp(hot,mean,k),Tc=t>=1&&after?mean:lerp(cold,mean,k),flow=after&&t<1?(Th-Tc)/(hot-cold):0;
  let o='<rect x="78" y="96" width="304" height="158" rx="12" fill="#f1e9d8" stroke="#c9b791" stroke-width="2"/>';
  for(let i=0;i<22;i++)o+=`<circle cx="${r1(86+rnd(i+600)*288)}" cy="${r1(rnd(i+620)<.5?101+rnd(i+640)*8:246+rnd(i+640)*5)}" r="1.4" fill="#d9c9a6"/>`;
  o+=`<rect x="98" y="112" width="132" height="130" fill="#eef3f5"/><rect x="230" y="112" width="132" height="130" fill="#eef3f5"/><rect x="100" y="128" width="128" height="112" fill="${warmColor(Th)}" fill-opacity=".85"/><rect x="232" y="128" width="128" height="112" fill="${warmColor(Tc)}" fill-opacity=".85"/>`;
  o+='<path d="M98 112 V242 H362 V112" fill="none" stroke="#7c8b92" stroke-width="3"/><path d="M230 112 V242" stroke="#6b7a81" stroke-width="4.5"/>';
  if(flow>.02)for(let i=0;i<3;i++){const y=160+i*28;o+=`<path d="M198 ${y} q6 -6 12 0 t12 0 t12 0 t12 0 t12 0" fill="none" stroke="#e8743a" stroke-width="3" stroke-dasharray="8 5" stroke-dashoffset="${r1(-sec*40)}"${op(flow)}/><path d="M260 ${y-6} l9 6 -9 6 Z" fill="#e8743a"${op(flow)}/>`;}
  o+=thermo(150,50,226,Th)+thermo(310,50,226,Tc);
  o+=tag(Math.round(Th)+' ℃',150,38,{size:16,color:'#9a3a22'})+tag(Math.round(Tc)+' ℃',310,38,{size:16,color:'#1f5f86'});
  return o+tag('따뜻한 물',164,272)+tag('차가운 물',296,272)+tag('단열 상자',418,88)+lead(400,94,376,104)+(after&&t<.9?tag('시간이 지나는 중',230,300,{opacity:1-seg(t,.8,.9)}):tag(after?'충분한 시간 뒤 같은 온도':'처음 온도 기록',230,300,{opacity:after?seg(t,.9,1):1}));
 }
 const loopPt=(()=>{const x1=182,x2=306,y1=112,y2=232,r=26,segs=[];
  const L=(a,b)=>segs.push({len:Math.hypot(b[0]-a[0],b[1]-a[1]),at:u=>[lerp(a[0],b[0],u),lerp(a[1],b[1],u)]});
  const A=(cx,cy,a0)=>segs.push({len:Math.PI*r/2,at:u=>{const a=(a0+90*u)*Math.PI/180;return[cx+r*Math.cos(a),cy+r*Math.sin(a)];}});
  L([x1,y2-r],[x1,y1+r]);A(x1+r,y1+r,180);L([x1+r,y1],[x2-r,y1]);A(x2-r,y1+r,270);L([x2,y1+r],[x2,y2-r]);A(x2-r,y2-r,0);L([x2-r,y2],[x1+r,y2]);A(x1+r,y2-r,90);
  const total=segs.reduce((a,b)=>a+b.len,0);
  return u=>{let d=clamp(u)*total;for(const g of segs){if(d<=g.len)return g.at(d/g.len);d-=g.len;}return segs.at(-1).at(1);};})();
 function convectionScene(after,t=1,sec=0){
  let s='<rect x="98" y="246" width="264" height="5" rx="2" fill="#9aa5aa"/><path d="M104 248.5 H356" stroke="#6f7b80" stroke-dasharray="2 3"/><path d="M116 251 L100 306 M344 251 L360 306" stroke="#7e8a90" stroke-width="5" stroke-linecap="round"/>';
  s+='<path d="M150 306 V292 Q150 282 165 280 H185 Q200 282 200 292 V306 Z" fill="#e7f1f4" fill-opacity=".8" stroke="#6f8f9d" stroke-width="1.6"/><path d="M152 306 V296 H198 V306 Z" fill="#dbeaf0"/><rect x="169" y="272" width="12" height="9" rx="2" fill="#8a9aa1"/><path d="M175 272 V266" stroke="#5b4a3a" stroke-width="2"/>';
  if(after){const h=seg(t,0,.1)*(1+.12*Math.sin(sec*23)*(t<1?1:0));s+=`<path d="M175 266 Q161 258 166 251 Q171 ${r1(250-4*h)} 175 ${r1(266-20*h)} Q179 ${r1(250-4*h)} 184 251 Q189 258 175 266 Z" fill="#f59e0b"${op(h)}/><path d="M175 265 Q169 259 172 254 L175 ${r1(265-12*h)} L178 254 Q181 259 175 265 Z" fill="#fde68a"${op(h)}/>`;}
  const u=after?ease(seg(t,.1,.8)):0,tint=after?.16*seg(t,.55,1):0;
  let inner='';
  if(tint>0)inner+=`<rect x="122" y="96" width="216" height="148" fill="#9b6cc4"${op(tint)}/>`;
  if(!after)inner+='<ellipse cx="184" cy="238" rx="15" ry="6" fill="#8e5bb5" opacity=".85"/>';
  if(u>0){const pts=[];for(let i=0;i<=90;i++){const v=u*i/90,[x,y]=loopPt(v),[x2,y2]=loopPt(v+.004),len=Math.hypot(x2-x,y2-y)||1,w=4.5*Math.sin(v*38);pts.push(r1(x-(y2-y)/len*w)+' '+r1(y+(x2-x)/len*w));}const d='M'+pts.join(' L');
   inner+=`<path d="${d}" fill="none" stroke="#9b6cc4" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" opacity=".22"/><path d="${d}" fill="none" stroke="#8e5bb5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/>`;}
  if(after&&t<1)for(let i=0;i<7;i++){const p=(sec*.2+i/7)%1;if(p>u)continue;const [x,y]=loopPt(p);inner+=`<circle cx="${r1(x)}" cy="${r1(y)}" r="3.5" fill="#6d3f96"/>`;}
  if(after)for(const p of [.1,.37,.6,.87]){const e=seg(u,p,p+.04);if(e<=0)continue;const [x,y]=loopPt(p),[x2,y2]=loopPt(p+.01),a=Math.atan2(y2-y,x2-x)*180/Math.PI;inner+=`<path d="M-7 -7 L5 0 L-7 7" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(a)})" fill="none" stroke="#5a2f82" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"${op(e)}/>`;}
  s+=glass(120,70,220,176,{level:150,color:'#cfe8f2',alpha:.8,inner});
  if(!after)return s+tag('가열 전',230,48)+tag('물감',84,240)+lead(98,238,166,238);
  const lab=seg(t,.75,.9);
  return s+tag('데워진 물',78,164,{opacity:lab})+lead(112,160,176,160,lab)+tag('내려오는 물',398,180,{opacity:lab})+lead(356,176,312,176,lab)+tag('가열',118,266)+lead(132,264,163,259);
 }
 function radiationScene(after,t=1,sec=0){
  const on=after?seg(t,0,.08):0,warm=after?ease(seg(t,.3,1)):0;
  let s='<defs><radialGradient id="slBulb"><stop offset="0" stop-color="#fff7c2" stop-opacity=".95"/><stop offset="1" stop-color="#fde68a" stop-opacity="0"/></radialGradient></defs>';
  s+=`<ellipse cx="78" cy="276" rx="34" ry="7" fill="#64748b"/><path d="M78 276 V152 L98 128" fill="none" stroke="#64748b" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
  if(on>0)s+=`<circle cx="124" cy="130" r="50" fill="url(#slBulb)"${op(on)}/>`;
  s+=`<circle cx="122" cy="130" r="14" fill="${on>.5?'#fde68a':'#e5e7eb'}" stroke="#a8a29e"/><path d="M92 116 L132 98 V104 L100 120 V140 L132 156 V162 L92 144 Z" fill="#5b6b79"/>`;
  s+='<path d="M296 104 L312 92 H382 L366 104 Z" fill="#535d68"/><path d="M366 104 L382 92 V172 L366 184 Z" fill="#2c333b"/><rect x="296" y="104" width="70" height="80" fill="#39424c"/>';
  if(warm>0)s+=`<rect x="296" y="104" width="70" height="80" fill="#f97316"${op(warm*.16)}/>`;
  if(after)for(let i=0;i<5;i++){const p=ease(seg(t,.02+i*.03,.3+i*.03));if(p<=0)continue;const x0=138,y0=130+(i-2)*7,x1=296,y1=112+i*16,x=lerp(x0,x1,p),y=lerp(y0,y1,p);
   s+=`<path d="M${x0} ${r1(y0)} L${r1(x)} ${r1(y)}" stroke="#f0a20b" stroke-width="3" stroke-linecap="round" stroke-dasharray="14 7" stroke-dashoffset="${r1(-sec*70)}"/>`;
   if(p>.98){const a=Math.atan2(y1-y0,x1-x0)*180/Math.PI;s+=`<path d="M-9 -5 L0 0 L-9 5 Z" transform="translate(${x1-1} ${y1}) rotate(${r1(a)})" fill="#f0a20b"/>`;}}
  s+=`<rect x="332" y="40" width="8" height="124" rx="4" fill="#fff" stroke="#9fb2ba"/><rect x="334.4" y="${r1(160-30-45*warm)}" width="3.2" height="${r1(30+45*warm)}" fill="#d64545"/><circle cx="336" cy="166" r="6.5" fill="#d64545"/>`;
  return s+tag('전등',112,82)+tag('온도계',398,56)+lead(378,52,342,52)+tag(after?'빛을 비춤':'빛을 비추기 전',96,302)+tag(after?'온도가 올라감':'처음 온도',338,214,{opacity:after?seg(t,.85,1):1});
 }

 /* ---- 잎과 녹말 ---- */
 const LEAF='M230 30 C300 60 318 150 290 210 C272 246 248 262 230 268 C212 262 188 246 170 210 C142 150 160 60 230 30 Z';
 function leafScene(light,tested,t=1,sec=0,foilFrom=null){
  // tested 장면의 단계: 은박지 떼기 → 탈색 → 아이오딘 용액 → 녹말 반응
  const green='#7dab64',pale='#ece6bf',brown='#c8a46e',blue='#293e68';
  const anim=tested&&t<1,foil=tested?(anim?1-ease(seg(t,0,.18)):0):(foilFrom!==null&&t<1?ease(t):1);
  const bleach=anim?ease(seg(t,.15,.38)):1,wash=anim?seg(t,.4,.66):1,starch=anim?ease(seg(t,.66,.95)):1;
  const lit={left:light!=='none',right:light==='all'};
  const half=side=>{if(!tested)return green;if(!anim)return lit[side]?blue:brown;if(wash<1)return hexMix(green,pale,bleach);return lit[side]?hexMix(brown,blue,starch):brown;};
  let s=`<defs><clipPath id="slLeaf"><path d="${LEAF}"/></clipPath><linearGradient id="slFoil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1f4f6"/><stop offset=".5" stop-color="#c9d1d6"/><stop offset="1" stop-color="#e3e8eb"/></linearGradient></defs>`;
  s+='<path d="M230 266 V284" stroke="#6f8f55" stroke-width="5" stroke-linecap="round"/>';
  s+=`<g clip-path="url(#slLeaf)"><rect x="135" y="25" width="95" height="245" fill="${half('left')}"/><rect x="230" y="25" width="95" height="245" fill="${half('right')}"/>`;
  if(anim&&wash>0&&wash<1)for(const [x,y] of [[200,92],[262,122],[226,196]])s+=`<circle cx="${x}" cy="${y}" r="${r1(wash*175)}" fill="${brown}" opacity=".92"/>`;
  const vein=tested?'#6b5a3e':'#5f7a4c',edge=tested&&!anim?'#7a6646':'#5d7a48';
  for(let i=0;i<6;i++){const y=74+i*30;s+=`<path d="M230 ${y} Q206 ${y-6} 180 ${y-24} M230 ${y} Q254 ${y-6} 280 ${y-24}" fill="none" stroke="${vein}" stroke-width="1.6" opacity=".45"/>`;}
  s+=`</g><path d="${LEAF}" fill="none" stroke="${edge}" stroke-width="2"/><path d="M230 38 V266" stroke="${tested&&!anim?'#8a7553':'#607550'}" stroke-width="3" stroke-linecap="round"/>`;
  const cover=light==='half'?[232,96]:light==='none'?[128,202]:null,prevCover=foilFrom==='half'?[232,96]:foilFrom==='none'?[128,202]:null;
  const drawFoil=(c,o,dx)=>{let g=`<g transform="translate(${r1(dx)} 0)"${op(o)}><rect x="${c[0]}" y="22" width="${c[1]}" height="252" rx="6" fill="url(#slFoil)" stroke="#9aa5ab"/>`;for(let i=0;i<5;i++)g+=`<path d="M${c[0]+8} ${52+i*46} l${r1(c[1]*.3)} 14 l${r1(c[1]*.3)} -10 l${r1(c[1]*.3)} 12" fill="none" stroke="#fff" stroke-width="1.6" opacity=".7"/>`;return g+'</g>';};
  if(!tested&&foilFrom!==null&&t<1&&prevCover&&(!cover||prevCover[0]!==cover[0]))s+=drawFoil(prevCover,1-ease(t),ease(t)*140);
  if(cover&&foil>0)s+=drawFoil(cover,foil,tested?(1-foil)*150:(foilFrom!==null&&t<1?(1-foil)*140:0));
  if(anim){const dv=seg(t,.36,.4)*(1-seg(t,.64,.68));if(dv>0){const j=Math.min(2,Math.floor(seg(t,.38,.62)*3)),[x,y]=[[200,92],[262,122],[226,196]][j],ph=(sec*2)%1;
   s+=`<g${op(dv)}><rect x="${x-5}" y="${y-74}" width="10" height="46" rx="3" fill="#eef6f8" fill-opacity=".8" stroke="#6f8f9d"/><path d="M${x-2} ${y-30} L${x} ${y-22} L${x+2} ${y-30}" fill="#c8a46e"/><rect x="${x-8}" y="${y-96}" width="16" height="24" rx="7" fill="#b64c3a"/>${drop(x,y-20+ph*16,'#a6763a')}</g>`+tag('아이오딘 용액',x>230?x-80:x+86,y-56,{opacity:dv});}}
  const lab=light==='half'?tag('빛을 받은 부분',86,80)+lead(118,86,186,110)+tag('가린 부분',390,80)+lead(366,86,282,110):light==='all'?tag('빛을 받은 잎',86,80)+lead(118,86,186,110):tag('전체를 가림',390,80)+lead(366,86,300,110);
  return s+lab+tag(tested?'청람색 부분: 녹말 검출':'빛을 가린 부분과 받은 부분 비교',230,302,{opacity:tested?seg(t,.92,1):1});
 }

 const specs={
  'state-change':{
   title:'물이 얼고 다시 녹을 때',codes:['4과10-02'],initial:{phase:'water'},
   fields:[field('phase','물의 상태',[['water','물'],['ice','얼음'],['again','다시 녹인 물']])],
   view(s){const ice=s.phase==='ice';return{svg:jar(175,ice?145:130,ice?'#bfdaf3':'#69b9e4')+line(168,100,290,100,'#d97706',2)+label('처음 물기둥 높이',340,105,'#9b5411',13)+label(ice?'높이가 높아짐':'처음과 같은 높이',230,35)+label('전체 무게: 100 g (모형)',230,270),text:ice?'물이 얼면 물기둥의 높이가 높아져 부피가 늘어납니다. 밖으로 새거나 증발하지 않았다면 전체 무게는 같습니다.':s.phase==='water'?'처음 물의 부피와 전체 무게를 기록합니다. 얼린 뒤, 다시 녹인 뒤와 비교합니다.':'얼음이 녹으면 물기둥의 높이가 낮아져 부피가 줄어듭니다. 다시 녹인 뒤에는 처음 물의 부피로 돌아오며 전체 무게는 같습니다.',note:'물은 얼 때 팽창하므로 밀폐한 유리 용기를 얼리지 마세요.'};}
  },
  gases:{
   title:'같은 부피의 용기에서 공기의 무게 비교',codes:['4과15-01'],initial:{air:'same'},
   fields:[field('air','공기의 양',[['same','공기를 넣고 빼기 전'],['more','공기를 더 넣은 뒤'],['less','공기를 조금 뺀 뒤']])],
   view(s){return{svg:gasScene(s.air),text:s.air==='same'?'용기와 공기를 함께 저울에 올려 처음 무게를 기록합니다.':s.air==='more'?'같은 부피의 용기에 공기를 더 넣으면 전체 무게가 늘어납니다. 공기도 무게가 있음을 알 수 있습니다.':'같은 부피의 용기에서 공기를 빼면 전체 무게가 줄어듭니다. 용기 자체의 무게와 부피는 변하지 않는 조건입니다.',note:''};},
   transition(p,n){return p.air===n.air||n.air==='same'?null:{duration:2600,frame:(t,sec)=>gasScene(n.air,t,sec,p.air)};}
  },
  'mixture-separation':{
   title:'액체 혼합물 분리와 소금 회수',codes:['6과05-01','6과05-02'],initial:{kind:'oil',stage:'mixed'},
   fields:s=>[field('kind','혼합물',[['oil','물과 기름'],['salt','소금과 모래']]),field('stage','분리 과정',s.kind==='oil'?[['mixed','흔든 직후'],['settle','가만히 두기'],['drain','아래층 물을 받아 분리']]:[['mixed','처음'],['dissolve','물에 넣기'],['filter','거르기'],['evaporate','거른 소금물의 물을 증발']])],
   view(s){if(s.kind==='oil'){const drained=s.stage==='drain',mixed=s.stage==='mixed';return{svg:'<g data-observation-scene="oil-water" data-stage="'+s.stage+'">'+oilScene(s.stage)+'</g>',text:mixed?'흔들면 물과 기름이 잠시 흩어져 섞여 보입니다. 가만히 두고 관찰합니다.':drained?'아래층 물을 먼저 받아 내고, 두 층의 경계에서 멈추면 물과 기름을 나눌 수 있습니다.':'가만히 두면 물과 기름이 골고루 섞이지 않고 두 층으로 나뉩니다. 이 성질을 이용해 분리합니다.',note:''};}
    const svg=saltSeparationScene(s.stage);
    return{svg,text:{mixed:'소금과 모래는 서로 섞여도 각각의 성질이 남아 있습니다.',dissolve:'소금은 물에 녹고 모래는 녹지 않습니다. 물에 녹는 성질의 차이를 이용합니다.',filter:'거름종이에는 모래가 남고 소금물은 통과합니다. 소금은 아직 물에 녹아 있으므로 소금 회수가 끝난 것이 아닙니다.',evaporate:'거른 소금물에서 물을 증발시키면 소금이 남습니다. 용해 → 거르기 → 증발 순서로 두 고체를 회수합니다.'}[s.stage]||'물에 녹는 성질의 차이를 이용합니다.',note:'증발과 가열 실험은 교사의 지도 아래 진행하세요.'};},
   transition(p,n){
    if(p.kind!==n.kind||p.stage===n.stage)return null;
    if(n.kind==='oil')return{duration:{mixed:1900,settle:2900,drain:3200}[n.stage],frame:(t,sec)=>'<g data-observation-scene="oil-water" data-stage="'+n.stage+'">'+oilScene(n.stage,t,sec)+'</g>'};
    const duration={dissolve:3400,filter:3600,evaporate:3800}[n.stage];
    return duration?{duration,frame:(t,sec)=>saltSeparationScene(n.stage,t,sec)}:null;
   }
  },
  'heat-transfer':{
   title:'접촉·대류·복사와 단열',codes:['6과07-02','6과07-03','6과07-04'],initial:{kind:'contact',stage:'before',hot:'80',cold:'20',minutes:'15'},
   fields:s=>[field('kind','관찰할 현상',[['contact','두 물체의 접촉'],['convection','물의 대류'],['radiation','빛에 의한 열 이동'],['insulation','단열 비교']]),steps,...(s.kind==='contact'?[field('hot','따뜻한 물의 처음 온도',[['60','60 ℃'],['80','80 ℃']]),field('cold','차가운 물의 처음 온도',[['20','20 ℃'],['40','40 ℃']])]:s.kind==='insulation'?[field('minutes','비교 시간',[['5','5분'],['15','15분'],['30','30분']])]:[])],
   view(s){const after=s.stage==='after';if(s.kind==='contact')return{svg:contactScene(s),text:after?'따뜻한 물의 온도는 내려가고 차가운 물의 온도는 올라갑니다. 열이 온도가 높은 쪽에서 낮은 쪽으로 이동하기 때문입니다.':'온도가 다른 두 물체의 처음 온도를 기록한 뒤 접촉시킵니다.',note:'같은 양의 물과 같은 용기를 사용하며, 주변으로 열이 빠져나가지 않는 조건입니다.'};
    if(s.kind==='convection')return{svg:convectionScene(after),text:after?'아래쪽에서 데워진 물이 올라가고 다른 쪽 물이 내려오며 물이 움직여 열을 옮깁니다. 이런 열 이동을 대류라고 합니다.':'물의 아래쪽을 가열하기 전과 후를 비교합니다. 색과 화살표는 물의 움직임을 보기 쉽게 한 표시입니다.',note:''};
    if(s.kind==='radiation')return{svg:radiationScene(after),text:after?'빛을 받은 물체의 온도가 올라갈 수 있습니다. 빛을 통해 열이 이동하는 것을 복사라고 합니다.':'빛을 비추기 전의 물체 온도를 기록하고, 빛을 받은 뒤와 비교합니다.',note:'강한 광원을 직접 바라보지 마세요.'};
    return window.scienceObservationScenes.insulation(s);},
   transition(p,n){
    if(p.kind!==n.kind||n.stage!=='after')return null;
    if(n.kind==='insulation'){const to=+n.minutes;let from=p.stage==='after'?+p.minutes:0;if(from===to&&p.stage==='after')return null;if(to<from)from=0;
     return{duration:2600,frame:t=>window.scienceObservationScenes.insulation({...n,minutes:String(Math.max(.05,lerp(from,to,ease(t))))}).svg};}
    if(p.stage!=='before')return null;
    if(n.kind==='contact')return{duration:2800,frame:(t,sec)=>contactScene(n,t,sec)};
    if(n.kind==='convection')return{duration:3400,frame:(t,sec)=>convectionScene(true,t,sec)};
    return{duration:2400,frame:(t,sec)=>radiationScene(true,t,sec)};
   }
  },
  'light-shadow':{
   title:'빛의 반사와 굴절 관찰',codes:['6과02-02'],initial:{kind:'mirror',setting:'one'},
   fields:s=>[field('kind','관찰 도구',[['mirror','거울'],['water','공기와 물']]),field('setting','조건',s.kind==='mirror'?[['one','거울 방향 1'],['two','거울 방향 2']]:[['one','물이 없음'],['two','물이 있음']])],
   view(s){if(s.kind==='mirror'){const up=s.setting==='one';return{svg:line(25,140,220,140,'#e49b14',5)+line(220,140,220,up?30:260,'#e49b14',5)+line(185,up?175:105,255,up?105:175,'#64748b',9)+label('거울',300,145)+label('빛 →',75,110),text:'빛이 거울에 부딪힌 뒤 방향을 바꾸어 나아갑니다. 거울의 방향을 바꾸면 반사된 빛이 나아가는 방향도 바뀝니다.',note:''};}
    const water=s.setting==='two';return{svg:rect(40,130,380,130,water?'#bfdef1':'#edf4f8')+line(90,30,220,130,'#e49b14',5)+line(220,130,water?260:389,260,'#e49b14',5)+label(water?'물':'공기',365,230),text:water?'빛이 공기에서 물로 들어갈 때 경계에서 꺾여 나아갑니다. 이런 현상을 굴절이라고 합니다.':'같은 공기 속에서는 빛이 곧게 나아갑니다. 물을 넣었을 때와 경로를 비교합니다.',note:''};}
  },
  photosynthesis:{
   title:'빛과 녹말 검출·광합성 산물의 이용',codes:['9과12-01','9과12-02','9과12-03'],initial:{light:'half',stage:'before'},
   fields:[field('light','빛을 받은 부분',[['all','잎 전체'],['half','잎 절반만'],['none','빛을 받지 않음']]),field('stage','아이오딘 반응 관찰',[['before','처리 전'],['after','준비된 잎의 반응 확인']])],
   view(s){const tested=s.stage==='after';return{svg:leafScene(s.light,tested),text:tested?'빛을 받아 녹말이 만들어진 부분은 아이오딘 용액과 반응하여 청람색을 띱니다. 가린 부분과 비교하여 빛의 필요성을 알아봅니다.':'먼저 잎에 남아 있던 녹말을 없앤 식물을 사용하며, 물·이산화 탄소를 충분히 공급하고 빛 이외의 조건은 같게 합니다. 필요한 전처리를 마친 잎의 반응을 비교하는 모형입니다.',note:'교사가 준비한 잎을 사용하고 알코올을 직접 가열하지 마세요. 식물은 낮과 밤 모두 호흡합니다.'};},
   transition(p,n){
    if(p.stage==='before'&&n.stage==='after')return{duration:3400,frame:(t,sec)=>leafScene(n.light,true,t,sec)};
    if(p.stage==='before'&&n.stage==='before'&&p.light!==n.light)return{duration:800,frame:(t,sec)=>leafScene(n.light,false,t,sec,p.light)};
    return null;
   }
  },
  'acid-base':{
   title:'산성 용액과 염기성 용액을 섞을 때',codes:['6과09-02'],initial:{drops:'0'},
   fields:[field('drops','지시약을 넣은 산성 용액에 염기성 용액 더하기',[['0','더하기 전'],['2','조금 더함'],['4','더 더함'],['6','충분히 더함']])],
   view(s){const colors={'0':'#e6798d','2':'#c58cb9','4':'#a992ca','6':'#72a9cc'};return{svg:jar(175,110+(+s.drops)*5,colors[s.drops])+label('지시약의 색 관찰',230,35),text:'산성 용액에 염기성 용액을 더하면 지시약의 색이 달라질 수 있습니다. 섞기 전과 후의 색을 기록하여 용액의 성질이 변했음을 추리합니다.',note:'지시약의 색은 용액의 종류와 진하기에 따라 달라집니다. 용액을 맛보거나 손으로 만지지 마세요.'};}
  }
 };
 Object.assign(specs,window.scienceSupplementExtensions?.({line,label,rect,jar,field})||{});
 Object.assign(specs,window.scienceCoreExtensions?.({line,label,rect,jar,field},specs)||{});
 const path=location.pathname.split('/').filter(Boolean);const slug=path.at(-1)==='index.html'?path.at(-2):path.at(-1),spec=specs[slug];
 if(!spec||document.getElementById('mbLab')||document.getElementById('rsLab'))return;
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('supplement-labs.css?v=9f9fbafa5533',document.currentScript.src);document.head.append(css);
 const assetBase=new URL('.',document.currentScript.src);
 const section=document.createElement('section');section.className='panel curriculum-supplement';section.setAttribute('aria-label',spec.title);
 const h=document.createElement('h2');h.textContent=spec.title;const controls=document.createElement('div');controls.className='supplement-controls';
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 460 310');svg.setAttribute('role','img');svg.setAttribute('aria-label',spec.title+' 관찰 모형');
 const observation=document.createElement('p');observation.className='supplement-observation';observation.setAttribute('aria-live','polite');
 const note=document.createElement('p');note.className='supplement-guidance';
 const soundControls=document.createElement('div');soundControls.className='supplement-audio';soundControls.hidden=true;
 const listen=document.createElement('button');listen.type='button';listen.className='supplement-listen';listen.textContent='이 조건의 소리 듣기';
 const soundStatus=document.createElement('span');soundStatus.setAttribute('role','status');soundControls.append(listen,soundStatus);
 let audioContext,oscillator,currentGain,audioModel,audioGeneration=0;
 function stopSound(){audioGeneration++;if(oscillator){oscillator.onended=null;try{oscillator.stop();}catch{}oscillator.disconnect();oscillator=null;}currentGain?.disconnect();currentGain=null;listen.disabled=false;soundStatus.textContent='';}
 listen.addEventListener('click',async()=>{
  stopSound();const generation=audioGeneration,model=audioModel;listen.disabled=true;
  try{
   const Context=window.AudioContext||window.webkitAudioContext;if(!Context)throw Error('Audio unavailable');
   audioContext??=new Context();let resumeTimer;
   try{await Promise.race([audioContext.resume(),new Promise((_,reject)=>{resumeTimer=setTimeout(()=>reject(Error('Audio did not start')),2500);})]);}finally{clearTimeout(resumeTimer);}
   if(generation!==audioGeneration)return;if(audioContext.state!=='running')throw Error('Audio is not running');
   const tone=audioContext.createOscillator(),gain=audioContext.createGain(),now=audioContext.currentTime;oscillator=tone;currentGain=gain;
   tone.frequency.value=model.frequency;gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.05*model.amplitude,now+.03);gain.gain.setValueAtTime(.05*model.amplitude,now+.5);gain.gain.linearRampToValueAtTime(0,now+.6);
   tone.connect(gain);gain.connect(audioContext.destination);soundStatus.textContent=' 비교음 재생 중';
   tone.onended=()=>{tone.disconnect();gain.disconnect();if(generation===audioGeneration){oscillator=null;currentGain=null;listen.disabled=false;soundStatus.textContent=' 재생 끝';}};
   tone.start(now);tone.stop(now+.61);
  }catch{if(generation===audioGeneration){stopSound();audioContext?.close().catch(()=>{});audioContext=null;soundStatus.textContent=' 소리를 재생할 수 없습니다. 파형으로 비교해 주세요.';}}
 });
 window.addEventListener('pagehide',()=>{stopSound();audioContext?.close();audioContext=null;});
 const reset=document.createElement('button');reset.type='button';reset.className='supplement-reset';reset.textContent='이 탐구 처음으로';
 const checkpoint=document.createElement('div');checkpoint.className='supplement-check';checkpoint.setAttribute('aria-label','관찰 확인 문제');
 const body=document.createElement('div');body.className='supplement-body';
 const visual=document.createElement('div');visual.className='supplement-visual';visual.append(svg);
 const reading=document.createElement('div');reading.className='supplement-reading';
 const observationHeading=document.createElement('h3');observationHeading.textContent='관찰해 보세요';
 reading.append(observationHeading,observation,soundControls,note,checkpoint);body.append(visual,reading);
 const sources=document.createElement('details');sources.className='supplement-sources';
 const sourceTitle=document.createElement('summary');sourceTitle.textContent='사진 정보';sources.append(sourceTitle);
 section.append(h,controls,body,sources,reset);const anchor=document.querySelector('.meaning-panel,.interpretation,.quiz-section');if(anchor)anchor.before(section);else document.querySelector('main').append(section);
 let state={...spec.initial};
 const questionStates=new Map();
 const assessment=()=>document.querySelector('.quiz-section')?.scienceAssessment;
 // Preserve response identity when apparatus controls redraw the same item.
 function observationQuestion(check){
  const identity=JSON.stringify([check.question,check.choices]);let a=2166136261,b=5381;
  for(const ch of identity){a=Math.imul(a^ch.charCodeAt(0),16777619)>>>0;b=(Math.imul(b,33)^ch.charCodeAt(0))>>>0;}
  return{id:slug+'#observation-'+a.toString(16)+'-'+b.toString(16),question:check.question,choices:check.choices.map((text,i)=>({id:String(i),text})),answer:String(check.answer),why:check.why,feedback:check.feedback};
 }
 let observationBank=null,connectedAssessment=null;
 function connectObservations(controller){
  if(!controller||connectedAssessment===controller)return;
  if(!observationBank){
   const seen=new Set(),pending=[{...spec.initial}],questions=new Map();
   while(pending.length){
    const sample=pending.pop(),fields=typeof spec.fields==='function'?spec.fields(sample):spec.fields;
    for(const f of fields)if(!f.items.some(o=>o.value===sample[f.key]))sample[f.key]=f.items[0].value;
    const key=JSON.stringify(sample);if(seen.has(key))continue;seen.add(key);
    const check=spec.view(sample).check;
    if(check){const q=observationQuestion(check);questions.set(q.id,q);if(!questionStates.has(q.id))questionStates.set(q.id,{...sample});}
    for(const f of fields)for(const o of f.items)pending.push({...sample,[f.key]:o.value});
   }
   observationBank=[...questions.values()];
  }
  // Register every condition's question so a reload also restores responses
  // to modes other than the initially displayed one.
  controller.register(observationBank);connectedAssessment=controller;
 }
 document.addEventListener('science-assessment-ready',()=>render(),{once:true});
 document.querySelector('.quiz-section')?.addEventListener('science-assessment-reset',()=>render());
 document.querySelector('.quiz-section')?.addEventListener('science-review-question',event=>{
  const previous=questionStates.get(event.detail);if(!previous)return;
  state={...previous};render();checkpoint.scrollIntoView({block:'center'});
  const heading=checkpoint.querySelector('h3');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
 });
 // 과정이 있는 조건 변화는 spec.transition(이전, 다음) 또는 result.play 가 돌려준 {duration, frame(t,sec)} 로 재생한다.
 // 재생 중에는 결과 글과 확인 문제를 가리고, 끝나면 최종 그림(result.svg)과 함께 보여 준다.
 const reducedMotion=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 let playFrame=0,playFinish=null;
 function stopPlay(){if(playFrame)cancelAnimationFrame(playFrame);playFrame=0;const finish=playFinish;playFinish=null;finish?.();}
 window.addEventListener('pagehide',stopPlay);
 function render(previous){
  stopSound();stopPlay();
  connectObservations(assessment());
  const fields=typeof spec.fields==='function'?spec.fields(state):spec.fields;
  for(const f of fields)if(!f.items.some(o=>o.value===state[f.key]))state[f.key]=f.items[0].value;
  controls.replaceChildren();for(const f of fields){const set=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=f.title;set.append(legend);for(const o of f.items){const b=document.createElement('button');b.type='button';b.textContent=o.text;b.dataset.supplementChoice=f.key;b.dataset.value=o.value;b.setAttribute('aria-pressed',String(state[f.key]===o.value));b.addEventListener('click',()=>{const before={...state};state[f.key]=o.value;render(before);controls.querySelector(`[data-supplement-choice="${f.key}"][data-value="${o.value}"]`)?.focus({preventScroll:true});});set.append(b);}controls.append(set);}
  const result=spec.view(state);visual.replaceChildren();sources.replaceChildren(sourceTitle);sources.hidden=!result.media;
  section.classList.toggle('has-specimen-photos',Boolean(result.media));
  if(result.media){
   const gallery=document.createElement('div');gallery.className='supplement-specimens';gallery.dataset.count=String(result.media.items.length);
   for(const item of result.media.items){
    const figure=document.createElement('figure'),title=document.createElement('h3');title.textContent=item.name;
    const frame=document.createElement('div');frame.className='supplement-photo-frame';frame.classList.toggle('is-enlarged',result.media.enlarged);
    const img=document.createElement('img');img.src=new URL(item.src,assetBase);img.alt=item.alt;img.decoding='async';if(item.origin)img.style.transformOrigin=item.origin;if(result.media.zoom)img.style.setProperty('--specimen-zoom',String(result.media.zoom));frame.append(img);
    const failure=document.createElement('p');failure.className='supplement-photo-error';failure.textContent='사진을 불러오지 못했습니다. 잠시 후 다시 열어 주세요.';failure.hidden=true;frame.append(failure);
    img.addEventListener('error',()=>{img.hidden=true;failure.hidden=false;});
    const caption=document.createElement('figcaption');caption.textContent=item.caption;
    figure.append(title,frame,caption);gallery.append(figure);
    const credit=document.createElement('p'),link=document.createElement('a');link.href=item.source;link.target='_blank';link.rel='noopener';link.textContent=item.name+' · '+item.author+(item.collection===undefined?' / GeoDIL':item.collection?' / '+item.collection:'');
    const license=document.createElement('a');license.href=item.licenseUrl||'https://creativecommons.org/publicdomain/zero/1.0/';license.target='_blank';license.rel='noopener';license.textContent=item.license||'CC0';credit.append(link,' · ',license);sources.append(credit);
   }
   const mode=document.createElement('p');mode.className='supplement-photo-mode';mode.textContent=result.media.modeLabel||(result.media.enlarged?'실제 표본 사진 · 부분 확대':'실제 표본 사진 · 전체 보기');
   visual.append(gallery,mode);
   const photoInfo=document.createElement('p');photoInfo.textContent=result.media.info||'두 표본의 실제 크기 비율과 화면의 크기는 다릅니다. 확대는 사진의 일부를 크게 보여 줍니다. 숫자와 색칠한 부분은 표본 관리 표시입니다.';sources.append(photoInfo);
  }else{svg.innerHTML=result.svg;visual.append(svg);}
  const play=!result.media&&previous&&JSON.stringify(previous)!==JSON.stringify(state)&&!reducedMotion()?(spec.transition?.(previous,{...state})||result.play||null):null;
  observation.textContent=result.text;note.textContent=result.note;note.hidden=!result.note;
  audioModel=result.audio;soundControls.hidden=!audioModel;
  checkpoint.replaceChildren();if(result.check){
   const q=observationQuestion(result.check),controller=assessment();
   checkpoint.dataset.questionId=q.id;questionStates.set(q.id,{...state});controller?.register([q]);
   const heading=document.createElement('h3');heading.textContent=q.question;const feedback=document.createElement('p');feedback.className='supplement-check-feedback';feedback.setAttribute('aria-live','polite');checkpoint.append(heading);
   function show(record){
    feedback.textContent=record?window.scienceAssessment.feedback(q,record)+(record.correct&&!record.firstCorrect&&q.feedback?.[record.first]?' 처음 선택을 돌아보면: '+q.feedback[record.first]:''):'';
    if(record)feedback.dataset.correct=String(record.correct);else delete feedback.dataset.correct;
    for(const b of checkpoint.querySelectorAll('button')){
     const choice=b.dataset.checkAnswer;b.disabled=!controller||!!record?.correct||!!record?.attempts.includes(choice);
     b.setAttribute('aria-pressed',String(record?.last===choice));
     if(record?.attempts.includes(choice))b.dataset.correct=String(choice===q.answer);else delete b.dataset.correct;
    }
   }
   q.choices.forEach(choice=>{const button=document.createElement('button');button.type='button';button.dataset.checkAnswer=choice.id;button.textContent=choice.text;button.addEventListener('click',()=>{if(!button.disabled&&controller)show(controller.submit(q.id,choice.id));});checkpoint.append(button);});checkpoint.append(feedback);show(controller?.store.evidence(q.id));
  }else delete checkpoint.dataset.questionId;
  checkpoint.hidden=!result.check;
  if(play&&typeof play.frame==='function'){
   const duration=Math.max(300,play.duration||1600),start=performance.now();
   section.dataset.supplementPlaying='true';observation.textContent=play.pending||'변화를 지켜보세요.';checkpoint.hidden=true;
   playFinish=()=>{svg.innerHTML=result.svg;observation.textContent=result.text;checkpoint.hidden=!result.check;delete section.dataset.supplementPlaying;};
   const step=now=>{const elapsed=now-start,t=Math.min(1,elapsed/duration);if(t>=1){playFrame=0;const finish=playFinish;playFinish=null;finish?.();return;}svg.innerHTML=play.frame(t,elapsed/1000);playFrame=requestAnimationFrame(step);};
   svg.innerHTML=play.frame(0,0);playFrame=requestAnimationFrame(step);
  }
 }
 reset.addEventListener('click',()=>{state={...spec.initial};render();});render();
 window.__scienceSupplement={slug,codes:spec.codes,getState:()=>({...state})};
})();
