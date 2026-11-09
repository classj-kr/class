/* Ideal models with explicit units. No measured classroom data is synthesized. */
(function(root){
 'use strict';
 const TAU=2*Math.PI,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 function speaker(s,phase=0){
  const connected=!!(s.magnet&&s.stripped&&s.connected&&s.playing),peak=connected?.2*Number(s.turns)*.05*.04:0;
  return {connected,force:peak*Math.sin(phase),peak,frequency:Number(s.frequency),displacement:peak*1600*Math.sin(phase)};
 }
 function wireless(s,phase=0){
  const mutual=300e-6*Math.cos(Number(s.angle)*Math.PI/180)/Math.pow(1+(Number(s.distance)/2)**2,1.5);
  const peak=s.power&&s.signal==='ac'?Math.abs(mutual)*TAU*10000*.2:0;
  return {mutual,peak,voltage:peak*Math.cos(phase),led:peak>1.8};
 }
 function fall(t,{height=1,gamma=0}={}){
  const y=gamma?9.81/gamma*(t+Math.expm1(-gamma*t)/gamma):4.905*t*t;
  return {y:Math.min(height,Math.max(0,y)),v:y>=height?0:gamma?-9.81/gamma*Math.expm1(-gamma*t):9.81*t,landed:y>=height};
 }
 function fallTime(height,gamma){let a=0,b=20;for(let i=0;i<60;i++){const mid=(a+b)/2;if(fall(mid,{height,gamma}).landed)b=mid;else a=mid;}return (a+b)/2;}
 function amplifier(s,phase=0){
  const input=Number(s.amplitude)*Math.sin(phase),limit=Math.max(0,Number(s.supply)/2-.2),gain=10;
  const output=s.mode==='direct'?input:s.power?clamp(-gain*input,-limit,limit):0;
  return {input,output,limit,clipped:s.mode!=='direct'&&!!s.power&&Number(s.amplitude)*gain>limit,gain:s.mode==='direct'?1:s.power?gain:0};
 }
 // Two reflected rays: one phase reversal at the air/film boundary.
 function filmIntensity(d,wavelength){return Math.sin(TAU*1.33*d/wavelength)**2;}
 // The film drains: thin at the top, thickening faster toward the bottom, so the
 // fringes are wide near the top and crowd together lower down.
 function filmThickness(y,seconds){return (130+950*Math.pow(clamp(y,0,1),1.6))*Math.exp(-Math.max(0,seconds)/14);}
 // CIE 1931 colour-matching functions (multi-lobe Gaussian fit, Wyman et al. 2013).
 const lobe=(x,m,a,b)=>{const t=(x-m)/(x<m?a:b);return Math.exp(-.5*t*t);};
 const cmf=[];for(let w=380;w<=720;w+=5)cmf.push([w,1.056*lobe(w,599.8,37.9,31)+.362*lobe(w,442,16,26.7)-.065*lobe(w,501.1,20.4,26.2),.821*lobe(w,568.8,46.9,40.5)+.286*lobe(w,530.9,16.3,31.1),1.217*lobe(w,437,11.8,36)+.681*lobe(w,459,26,13.8)]);
 const ySum=cmf.reduce((s,c)=>s+c[2],0),gamma=v=>{v=clamp(v,0,1);return Math.round(255*(v<=.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-.055));},filmCache=new Map();
 // White light: integrate the two-beam reflectance over the visible spectrum, so the
 // bands follow the real interference colour sequence and fade to pastel when thick.
 function filmColor(d,light){
  const mono={red:[650,[232,74,62]],green:[530,[62,190,96]],blue:[460,[66,112,232]]}[light];
  if(mono){const v=filmIntensity(d,mono[0]);return `rgb(${mono[1].map(c=>Math.round(c*v)).join(',')})`;}
  const key=Math.round(d);if(filmCache.has(key))return filmCache.get(key);
  let X=0,Y=0,Z=0;for(const [w,x,y,z] of cmf){const r=filmIntensity(key,w);X+=r*x;Y+=r*y;Z+=r*z;}
  X*=1.15/ySum;Y*=1.15/ySum;Z*=1.15/ySum;
  // Pull halfway toward grey of equal luminance: the reflected colours are soft, not neon.
  const rgb=[3.2406*X-1.5372*Y-.4986*Z,-.9689*X+1.8758*Y+.0415*Z,.0557*X-.204*Y+1.057*Z].map(v=>Y+.5*(v-Y)).map(gamma),out=`rgb(${rgb.join(',')})`;
  filmCache.set(key,out);return out;
 }
 function polarization(source,angle,filter){
  if(!filter)return 100;
  const axis=source==='A'?0:source==='B'?40:null;
  return axis===null?50:100*Math.cos((Number(angle)-axis)*Math.PI/180)**2;
 }
 function electronDensity(x,{spacing=2,pathKnown=false,slits='two'}={}){
  const a=.38,env=Math.abs(x)<1e-12?1:(Math.sin(Math.PI*a*x)/(Math.PI*a*x))**2;
  return env*(slits==='one'||pathKnown?1:Math.cos(Math.PI*Number(spacing)*x)**2);
 }
 function random(seed){let state=seed>>>0;return()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296;};}
 function electronHit(rng,s){for(let i=0;i<100000;i++){const x=(rng()-.5)*10;if(rng()<electronDensity(x,s))return{x,y:rng()};}throw Error('Electron sampler failed');}
 const api={speaker,wireless,fall,fallTime,amplifier,filmIntensity,filmThickness,filmColor,polarization,electronDensity,random,electronHit};
 if(typeof module!=='undefined')module.exports=api;else root.sciencePhysics=api;
})(typeof window==='undefined'?globalThis:window);
