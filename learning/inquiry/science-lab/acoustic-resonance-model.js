(function(root){
 'use strict';
 const speed=343,correction=.006;
 const M={speed,correction,
  create:(mode='tube')=>({mode,frequency:mode==='tube'?1000:2300,position:mode==='tube'?.03:.3,powered:false,measured:false,records:[],phase:0}),
  wavelength:s=>speed/s.frequency,
  amplitude(s){if(!s.powered)return 0;const k=2*Math.PI/this.wavelength(s);return s.mode==='tube'?1/Math.sqrt(1+Math.pow(Math.cos(k*(s.position+correction))/.09,2)):Math.abs(Math.cos(k*(.3-s.position)));},
  locations(s){const wave=this.wavelength(s),out=[];if(s.mode==='tube'){for(let n=0;n<8;n++){const x=(2*n+1)*wave/4-correction;if(x>.015&&x<.65)out.push(x);}}else{for(let n=0;n<8;n++){const x=.3-(2*n+1)*wave/4;if(x>=0)out.push(x);}}return out;},
  record(s){if(!s.powered||!s.measured)return '먼저 소리를 발생시키고 진동수를 측정하세요.';if(s.records.length>=3)return '세 위치를 비교하거나 필요 없는 값을 지우세요.';if(s.records.some(r=>Math.abs(r.position-s.position)<.002))return '같은 위치가 이미 표에 있습니다. 다른 위치를 찾으세요.';s.records.push({position:Math.round(s.position*1000)/1000,amplitude:this.amplitude(s)});return '';},
  result(s){if(s.records.length!==3)return {error:'서로 이웃한 세 위치를 찾아 표에 넣으세요.'};if(s.records.some(r=>s.mode==='tube'?r.amplitude<.9:r.amplitude>.07))return {error:s.mode==='tube'?'소리 크기가 가장 큰 위치인지 앞뒤로 조금 움직여 확인하세요.':'소리 크기가 가장 작은 위치인지 앞뒤로 조금 움직여 확인하세요.'};const p=s.records.map(r=>r.position).sort((a,b)=>a-b),a=p[1]-p[0],b=p[2]-p[1],target=this.wavelength(s)/2;if(Math.abs(a-target)>.0021||Math.abs(b-target)>.0021)return {error:'중간 위치를 건너뛰지 않았는지 확인하세요. 이웃한 위치의 간격을 비교합니다.'};const wavelength=s.mode==='tube'?2*b:a+b;return {wavelength,speed:s.frequency*wavelength,gaps:[a,b]};}
 };
 if(typeof module!=='undefined')module.exports=M;
 if(root)root.ScienceAcoustic=M;
})(typeof window!=='undefined'?window:null);
