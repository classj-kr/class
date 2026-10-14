/* Explicit teaching models; empirical rates and apparatus-specific constants are not universal. */
(function(root){
 'use strict';
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,Number(n)||0));
 const electrolysis={
  create:()=>({solution:'sulfate',filled:false,sealed:true,reversed:false,running:false,charge:0}),
  valid:s=>s.filled&&s.sealed,
  advance(s,d){if(s.running&&this.valid(s)&&s.solution==='sulfate')s.charge=clamp(s.charge+d,0,12);if(s.charge>=12)s.running=false;return s;},
  gases(s){const o=Math.round(s.charge*10)/10,h=o*2;return s.reversed?[{name:'O₂',polarity:'+',amount:o},{name:'H₂',polarity:'−',amount:h}]:[{name:'H₂',polarity:'−',amount:h},{name:'O₂',polarity:'+',amount:o}];}
 };
 const micrometry={
  create:()=>({magnification:100,slide:'calibration',focus:0,angle:8,offset:4,calibrated:false,unit:null,left:35,right:65,prepared:false}),
  unit:mag=>1000/mag,
  calibrate(s,ocular,stage){const good=Math.abs(s.angle)<.1&&Math.abs(s.offset)<.1&&s.focus>=8&&Number(ocular)>0&&Number(stage)>0&&Math.abs(Number(stage)*10/Number(ocular)-this.unit(s.magnification))<.01;s.calibrated=good;s.unit=good?this.unit(s.magnification):null;return good;},
  length:s=>s.calibrated&&s.slide==='cell'&&s.prepared?Math.abs(s.right-s.left)*s.unit:null,
  edges:mag=>[50-80/(1000/mag),50+80/(1000/mag)]
 };
 const pigments={
  names:['카로틴','잔토필','엽록소 a','엽록소 b'],colors:['#e99828','#d4b526','#208b7a','#799b35'],
  // Authored TLC comparison, not extracted empirical Rf values.
  ratios:[.90,.72,.52,.30],
  create:()=>({extracted:false,spots:0,wet:false,level:1,closed:true,progress:0,running:false,removed:false,marked:false,band:2,distance:0,front:0}),
  valid:s=>s.extracted&&s.spots>=5&&!s.wet&&s.level<2&&s.closed,
  advance(s,dt){if(s.running){s.progress=clamp(s.progress+dt,0,1);if(s.progress===1)s.running=false;}return s;},
  front:s=>6*Math.sqrt(s.progress),
  distances(s){return this.ratios.map(r=>r*this.front(s));},
  rf(s,distance,front){const d=Number(distance),f=Number(front);return s.removed&&s.marked&&this.valid(s)&&Number.isFinite(d)&&Number.isFinite(f)&&d>=0&&f>0&&d<=f?d/f:null;}
 };
 const digestion={
  create:()=>({prepared:false,incubated:false,sampled:false,reagent:false,heated:false,enzyme:'active',membrane:'selective'}),
  results(s){return ['saliva','tablet','water'].map((type,i)=>{const digested=s.incubated&&i<2&&(type==='saliva'||s.enzyme==='active');const outside=s.sampled&&digested&&s.membrane==='selective';return{type,digested,inside:!s.prepared?'empty':digested?'brown':'blue',test:!s.sampled?'empty':!s.reagent?'clear':s.heated&&outside?'orange':'cyan',sugarOutside:outside};});}
 };
 const wave={
  create:()=>({mode:'transverse',frequency:1,time:0,running:false,t1:0,t2:0,x1:0,x2:0,period:0}),
  speed:s=>s.mode==='transverse'?2:3,
  duration:s=>4/(s.mode==='transverse'?2:3),
  displacement(s,x,t=s.time){const u=t-x/this.speed(s);return u<0||u>2/s.frequency?0:Math.sin(2*Math.PI*s.frequency*u);},
  advance(s,dt){if(s.running){s.time=clamp(s.time+dt,0,this.duration(s));if(s.time>=this.duration(s))s.running=false;}return s;},
  measuredSpeed:(distance,elapsed)=>Number(distance)>0&&Number(elapsed)>0?Number(distance)/Number(elapsed):null
 };
 const coast={
  heights:{low:1,middle:3,high:5},
  create:()=>({places:{home:'low',school:'middle',field:'high'},built:false,marked:false,level:0,target:0,running:false}),
  place(s,building,position){const old=s.places[building],other=Object.keys(s.places).find(k=>k!==building&&s.places[k]===position);s.places[building]=position;if(other)s.places[other]=old;},
  flooded(s){return s.built?Object.keys(s.places).filter(k=>s.level>this.heights[s.places[k]]+1e-6):[];},
  advance(s,dt){if(s.running){s.level=Math.min(s.target,s.level+dt*.8);if(s.level>=s.target)s.running=false;}return s;}
 };
 const seaLevel={
  create:()=>({prepared:false,marked:false,running:false,time:0,view:'apparatus',tanks:[{temperature:20,mass:600,ice:0},{temperature:20,mass:600,ice:0},{temperature:20,mass:600,ice:60}]}),
  // Constant-density reference and linear thermal expansion for an illustrative 20–42 °C comparison.
  volume:t=>t.mass*(1+.00030*(t.temperature-20)),
  height(t){return this.volume(t)/80;},
  advance(s,dt){if(!s.running||!s.prepared||!s.marked)return s;dt=Math.min(Math.max(0,dt),600-s.time);s.time+=dt;
   s.tanks.forEach((t,i)=>{if(!i)return;const energy=90*dt,meltEnergy=Math.min(t.ice*334,energy*.5),melt=meltEnergy/334,thermal=t.mass*4.18*t.temperature+energy-meltEnergy;t.ice=Math.max(0,t.ice-melt);t.mass+=melt;t.temperature=thermal/(t.mass*4.18);});
   if(s.time>=600)s.running=false;return s;
  }
 };
 const api={clamp,electrolysis,micrometry,pigments,digestion,wave,coast,seaLevel};
 if(typeof module!=='undefined')module.exports=api;else root.ScienceCoursePractice=api;
})(typeof window==='undefined'?globalThis:window);
