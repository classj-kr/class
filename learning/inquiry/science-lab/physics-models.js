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
 function filmThickness(y,seconds){return (130+950*clamp(y,0,1))*Math.exp(-Math.max(0,seconds)/14);}
 function filmColor(d,light){
  const wavelengths={red:650,green:530,blue:460};
  if(light!=='white'){const v=Math.round(255*filmIntensity(d,wavelengths[light]));return light==='red'?`rgb(${v},0,0)`:light==='green'?`rgb(0,${v},0)`:`rgb(0,0,${v})`;}
  return `rgb(${[650,530,460].map(w=>Math.round(255*filmIntensity(d,w))).join(',')})`;
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
