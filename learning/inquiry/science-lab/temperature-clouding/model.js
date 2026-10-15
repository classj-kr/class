(function(root){'use strict';
 const modes={sulfur:{title:'황 생성 · ×표 관찰',reagentA:'0.1 M Na₂S₂O₃',reagentB:'0.5 M HCl',volumeA:50,volumeB:10,total:60,solid:'황',colour:'#eee6b9'},laser:{title:'탄산 칼슘 생성 · 레이저 투과',reagentA:'0.1 M CaCl₂',reagentB:'0.1 M NaHCO₃',volumeA:20,volumeB:20,total:40,solid:'탄산 칼슘',colour:'#f0f2ed'}};
 const baths=['얼음물','실온의 물','더운물'];
 // Dimensionless visual sequencing, not measured kinetics or a temperature calibration.
 function snapshot(mode,progress,prepared=true,started=true){if(!modes[mode])throw Error('Unknown procedure');started=prepared&&started;const p=Number.isFinite(+progress)?Math.max(0,Math.min(1,+progress)):0,m=modes[mode],mix=started?(p>=.12?1:Math.max(0,(p-.04)/.08)):0;
  return{mode,progress:p,mix,rows:baths.map((bath,i)=>{const endpoint=[1,.7,.42][i],q=started?Math.max(0,Math.min(1,(p-.12)/(endpoint-.12))):0;return{bath,volume:prepared?m.volumeA+mix*m.volumeB:0,sourceVolume:prepared?m.volumeB*(1-mix):0,cloud:q,visible:1-q,endpoint:started&&p>=endpoint,mixed:mix>=1};})};}
 function liquidSurface(volume){const v=Math.max(0,Math.min(100,Number(volume)||0));let lo=0,hi=150;for(let i=0;i<40;i++){const h=(lo+hi)/2,area=140*h-.32*h*h;if(area<(140*150-.32*150*150)*v/100)lo=h;else hi=h;}return 268-(lo+hi)/2;}
 const api={modes,baths,snapshot,liquidSurface};if(typeof module!=='undefined')module.exports=api;else root.TemperatureCloudingModel=api;
})(typeof window==='undefined'?globalThis:window);
