(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.TuningForkModel=api;})(typeof globalThis==='object'?globalThis:this,()=>{
 'use strict';
 const initial=()=>({held:false,contact:'none',amplitude:0,elapsed:0,strikes:0,observed:[],last:null});
 const rates={none:.32,paper:.7,water:1.8};
 function observe(s,contact){const moving=s.amplitude>.025,kind=contact||s.contact;return{kind,moving,amplitude:s.amplitude,sound:moving,paperMoves:kind==='paper'&&moving,waterMoves:kind==='water'&&moving,handStops:kind==='hand'&&moving};}
 function step(state,action,value){const s={...state,observed:state.observed.slice()};
  if(action==='reset')return initial();
  if(action==='hold'){s.held=true;return s;}
  if(!s.held)return s;
  if(action==='strike'){if(!['weak','strong'].includes(value)||s.contact!=='none')return s;s.amplitude=value==='strong'?.85:.42;s.elapsed=0;s.strikes++;s.last=observe(s,'none');return s;}
  if(action==='contact'){if(!['none','paper','water','hand'].includes(value))return s;s.contact=value;s.last=observe(s,value);if(value!=='none'){s.observed.push({...s.last,strike:s.strikes});if(value==='hand')s.amplitude=0;}return s;}
  if(action==='tick'){if(!Number.isFinite(value)||value<0)return s;s.elapsed+=value;s.amplitude*=Math.exp(-(rates[s.contact]||.32)*value);if(s.amplitude<.025)s.amplitude=0;return s;}
  return s;
 }
 function displacement(s){return s.amplitude*Math.sin(2*Math.PI*2*s.elapsed);}
 function comparisons(s){return ['paper','water','hand'].map(kind=>({kind,still:s.observed.some(r=>r.kind===kind&&!r.moving),moving:s.observed.some(r=>r.kind===kind&&r.moving)}));}
 return{initial,step,observe,displacement,comparisons,rates,toneHz:440};
});
