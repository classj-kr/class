/* Ideal spherical unit-density particles, not observations of a real school.
 * Aerodynamic and geometric diameters coincide under these assumptions.
 * The distributions are authored; an optical instrument's real calibration,
 * humidity response and size-dependent inlet efficiency are not modeled. */
(function(root){
 'use strict';
 const diameters=[.5,1,2,4,8,12],sites=['gate','garden','classroom'];
 const distributions={gate:[11000,2600,700,90,12,2],garden:[7000,1800,350,45,7,2],classroom:[8000,2200,430,150,28,5]};
 const defaults=()=>({site:'gate',period:'morning',height:'breathing',pollutant:'pm25',seconds:60,inlet:'open',calibrated:false});
 function normalize(s={}){return{site:sites.includes(s.site)?s.site:'gate',period:s.period==='noon'?'noon':'morning',height:s.height==='low'?'low':'breathing',pollutant:s.pollutant==='pm10'?'pm10':'pm25',seconds:[60,120,180].includes(+s.seconds)?+s.seconds:60,inlet:s.inlet==='filter'?'filter':'open',calibrated:!!s.calibrated};}
 const mass=d=>Math.PI/6*d*d*d*1e-6; // micrograms for density 1 g/cm³
 const volume=seconds=>.5*seconds/60/1000; // 0.5 L/min -> m³
 function sample(raw,elapsed){const s=normalize(raw),t=Math.max(0,Math.min(s.seconds,Number(elapsed)||0)),cutoff=s.pollutant==='pm10'?10:2.5;
  const factor=(s.period==='noon'?s.site==='gate'?.7:1.1:1)*(s.height==='low'?1.25:1),litres=.5*t/60;
  const bins=diameters.map((d,i)=>({diameter:d,count:s.inlet==='filter'?0:Math.floor(distributions[s.site][i]*factor*litres),included:d<=cutoff}));
  const micrograms=bins.reduce((n,b)=>n+(b.included?b.count*mass(b.diameter):0),0),m3=volume(t),concentration=m3?micrograms/m3:null;
  return{elapsed:t,litres,bins,micrograms,concentration,count:bins.reduce((n,b)=>n+(b.included?b.count:0),0),complete:t===s.seconds,valid:t===s.seconds&&s.calibrated&&s.inlet==='open',reason:!s.calibrated?'zero':s.inlet!=='open'?'filter':t<s.seconds?'incomplete':null};
 }
 function compare(a,b){if(!a?.result.valid||!b?.result.valid)return{valid:false,reason:'측정 A와 B를 모두 완료하세요.'};
  const changed=['period','height','pollutant','seconds'].filter(k=>a.conditions[k]!==b.conditions[k]);
  if(changed.length)return{valid:false,reason:'장소의 영향은 측정 항목·시각·높이·시간을 같게 맞춰 비교하세요.',changed};
  if(a.conditions.site===b.conditions.site)return{valid:false,reason:'두 측정의 장소가 같습니다. 다른 장소를 골라 비교하세요.',changed:['site']};
  const difference=b.result.concentration-a.result.concentration;return{valid:true,difference,reason:Math.abs(difference)<.05?'두 측정의 농도가 비슷합니다.':`B가 A보다 ${Math.abs(difference).toFixed(1)} µg/m³ ${difference>0?'높습니다':'낮습니다'}.`};
 }
 const api={defaults,normalize,sample,compare,diameters,mass,volume};if(typeof module!=='undefined')module.exports=api;else root.AirSamplingModel=api;
})(typeof window==='undefined'?globalThis:window);
