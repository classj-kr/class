(function(root){'use strict';const M={
 create:(material='salt')=>({material,on:{beaker:false,paper:false,rod:false},tare:0,zeroed:false,poured:false,progress:0,running:false,before:null,after:null}),
 masses(s){const water=s.material==='salt'?80:50,solute=s.material==='salt'?4:3.5;return{beaker:52+water+(s.poured?solute:0),paper:1+(s.poured?0:solute),rod:12};},
 total(s){const m=this.masses(s);return Object.keys(m).reduce((n,k)=>n+(s.on[k]?m[k]:0),0);},
 reading(s){return Math.round((this.total(s)+.8-s.tare)*10)/10;},
 zero(s){s.tare=this.total(s)+.8;s.zeroed=true;},
 pour(s){if(!s.before)return '용해 전 무게를 먼저 읽으세요.';if(Object.values(s.on).some(Boolean))return '실험 기구를 모두 저울에서 내려놓은 뒤 용질을 넣으세요.';s.poured=true;return '';},
 step(s,delta=.25){if(!s.poured||Object.values(s.on).some(Boolean))return; s.progress=Math.min(1,s.progress+Math.max(0,delta));if(s.progress===1)s.running=false;},
 record(s){if(!s.zeroed)return '저울의 영점을 맞춘 뒤 측정하세요.';const key=s.poured?'after':'before';if(key==='after'&&s.progress<1)return '용질이 완전히 용해된 뒤 무게를 읽으세요.';s[key]={mass:this.reading(s),on:{...s.on},tare:s.tare};return '';},
 compare(s){if(!s.before||!s.after)return '용해 전과 후에 무게를 각각 읽어 비교하세요.';if(s.before.tare!==s.after.tare)return '두 측정 사이에 영점 기준이 달라졌습니다. 빈 저울의 영점을 맞추고 같은 기준에서 다시 비교하세요.';if(!Object.values(s.before.on).every(Boolean)||!Object.values(s.after.on).every(Boolean))return '측정에 빠진 기구가 있습니다. 용해 전후 모두 비커·시약포지·유리 막대와 전체 물질을 포함해 비교하세요.';return '용해 전후의 무게가 같습니다. 눈에 보이지 않게 녹아도 용질이 사라진 것은 아닙니다.';}
};if(typeof module!=='undefined')module.exports=M;if(root)root.ScienceDissolutionMass=M;})(typeof window!=='undefined'?window:null);
