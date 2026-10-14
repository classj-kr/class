(function(root){
 'use strict';
 const standard={
  create:()=>({mass:0,pan:false,tared:false,weighed:false,dissolved:false,transferred:false,rinses:0,volume:0,mixed:false,eye:'level'}),
  display:s=>(s.dissolved?0:s.mass)+(s.pan&&!s.tared?2:0),
  concentration:s=>s.transferred&&s.rinses>=3&&s.mixed&&s.volume>0?s.mass/58.5/(s.volume/1000):null,
  valid:s=>s.tared&&s.mass>0&&s.dissolved&&s.transferred&&s.rinses>=3&&Math.abs(s.volume-100)<.05&&s.mixed&&s.eye==='level',
  rinse(s){if(!s.transferred||s.mixed||s.rinses>=3||s.volume>85)return false;s.rinses++;s.volume+=5;return true;},
  add(s,ml){if(!s.transferred||s.mixed)return false;s.volume=Math.min(110,Math.round((s.volume+ml)*10)/10);return true;}
 };
 const dilution={
  create:()=>({kind:'acid',samples:[{name:'A',c:.1,remaining:100}],selected:0,aliquot:10,pending:null,buffer686:false,buffer4:false,buffer918:false,clean:true,portion:null,readings:{}}),
  pH(c,kind='acid'){const major=(c+Math.hypot(c,2e-7))/2,log=-Math.log10(major);return kind==='acid'?log:14-log;},
  pipette(s){const a=s.samples.at(-1);if(s.pending||s.samples.length>=9||a.remaining<s.aliquot)return false;a.remaining-=s.aliquot;s.pending={c:a.c*s.aliquot/100,volume:s.aliquot,filled:false};return true;},
  fill(s){if(!s.pending)return false;s.pending.volume=100;s.pending.filled=true;return true;},
  mix(s){if(!s.pending?.filled)return false;s.samples.push({name:String.fromCharCode(65+s.samples.length),c:s.pending.c,remaining:100});s.selected=s.samples.length-1;s.pending=null;s.portion=null;return true;},
  sample(s){const a=s.samples[s.selected];if(a.remaining<30)return false;a.remaining-=30;s.portion=s.selected;return true;},
  measure(s){if(!s.buffer686||!s.buffer4||!s.buffer918||!s.clean||s.portion!==s.selected)return null;const p=this.pH(s.samples[s.selected].c,s.kind);s.readings[s.selected]=p;s.clean=false;return p;}
 };
 const vinegar={
  create:()=>({protocol:'direct',prepared:false,indicator:false,filled:false,tip:false,initial:null,delivered:0,mixed:true,recorded:false,trials:[]}),
  sampleVolume:s=>s.protocol==='direct'?30:20,
  stockVolume:s=>s.protocol==='direct'?3:2,
  equivalent(s){return .925*this.stockVolume(s)/.1;},
  reading:s=>2+s.delivered,
  // Weak-acid charge balance is internal only. The general chemistry route does not show a titration curve.
  pH(s){const vol=(this.sampleVolume(s)+s.delivered)/1000,Ca=.925*this.stockVolume(s)/1000/vol,Na=.1*s.delivered/1000/vol;let lo=-14,hi=0;
   for(let n=0;n<70;n++){const log=(lo+hi)/2,H=10**log,f=H+Na-1e-14/H-Ca*1.8e-5/(1.8e-5+H);if(f>0)hi=log;else lo=log;}return -(lo+hi)/2;
  },
  color(s){if(!s.indicator)return 'clear';if(!s.mixed&&s.delivered>0)return 'local';const p=this.pH(s);return p<8.2?'clear':p<9.5?'faint':'strong';},
  add(s,ml){if(!s.prepared||!s.indicator||!s.tip||s.initial===null)return false;s.delivered=Math.min(48,Math.round((s.delivered+ml)*100)/100);s.mixed=false;return true;},
  record(s,final){if(s.initial===null||s.recorded||!s.mixed||this.color(s)!=='faint'||Math.abs(Number(final)-this.reading(s))>.025||s.trials.length>=3)return false;s.trials.push({initial:s.initial,final:Number(final),used:Number(final)-s.initial});s.recorded=true;return true;},
  concentration(s){if(!s.trials.length)return null;return .1*s.trials.reduce((n,r)=>n+r.used,0)/s.trials.length/this.stockVolume(s);}
 };
 const api={standard,dilution,vinegar};if(typeof module!=='undefined')module.exports=api;else root.ScienceSolutionPractice=api;
})(typeof window==='undefined'?globalThis:window);
