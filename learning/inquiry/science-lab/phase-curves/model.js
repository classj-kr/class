(function(root){
 'use strict';
 const records={
  boil:{title:'물 끓이기 A',kind:'boil',values:[13.3,14.1,16.5,25.4,32.9,41.3,54.2,68.8,85.4,100,100,100,100,100],plateau:[9,13],limits:[0,120],step:20,setup:'물 200 mL · 끓임쪽 · 액체 속 온도계',note:'약 1기압에서 1분 간격으로 관찰한 온도와 상태 자료입니다. 마지막 시각에도 물은 계속 끓고 있습니다.'},
  melt:{title:'얼음 녹이기',kind:'melt',values:[-2.8,-1.8,-1,-.5,-.1,0,0,0,0,.2],plateau:[5,8],limits:[-4,2],step:1,setup:'얼음이 든 100 mL 플라스크 · 찬물 수조 · 액체·얼음 속 온도계',note:'1분 간격의 온도 예시입니다. 0 ℃ 부근에서 얼음과 물이 함께 있는 구간을 찾으세요.'},
  boil2:{title:'물 끓이기 B',kind:'boil',values:[32.3,40.9,48.2,56.4,64.9,77.1,82,88.2,100,100],plateau:[8,9],limits:[0,120],step:20,setup:'100 mL 플라스크에 물 ⅓ · 끓임쪽 2~3개 · 액체 속 온도계',note:'약 1기압의 다른 조건에서 얻은 1분 간격 온도 예시입니다. 마지막 시각이 끓음이 끝난 시각은 아닙니다.'}
 };
 const constants=Object.freeze({mass:.01,waterHeat:4180,iceHeat:2100,fusion:334000,conductance:.3,initial:20});
 const lauricConstants=Object.freeze({mass:.012,liquidHeat:2200,solidHeat:2020,fusion:181000,conductance:.1,initial:70,transition:43.8});
 function lauricCooling(minute,ambient=20){
  const {mass:m,liquidHeat:c,solidHeat:cs,fusion:L,conductance:k,initial:T0,transition:Tf}=lauricConstants,t=Math.max(0,Math.min(22,Number(minute)||0))*60;
  if(ambient===70)return{minute,temperature:70,state:'액체',frozen:0,energyOut:0};
  const begins=m*c/k*Math.log((T0-ambient)/(Tf-ambient)),duration=m*L/(k*(Tf-ambient)),ends=begins+duration;
  if(t<begins){const T=ambient+(T0-ambient)*Math.exp(-k*t/(m*c));return{minute,temperature:T,state:'액체',frozen:0,energyOut:m*c*(T0-T)};}
  if(t<=ends){const f=(t-begins)/duration;return{minute,temperature:Tf,state:'액체 + 고체',frozen:f,energyOut:m*c*(T0-Tf)+m*L*f};}
  const T=ambient+(Tf-ambient)*Math.exp(-k*(t-ends)/(m*cs));return{minute,temperature:T,state:'고체',frozen:1,energyOut:m*c*(T0-Tf)+m*L+m*cs*(Tf-T)};
 }
 function cooling(minute,bath=-15){
  const {mass:m,waterHeat:c,iceHeat:ci,fusion:L,conductance:k,initial:T0}=constants;
  const t=Math.max(0,Math.min(18,Number(minute)||0))*60;
  if(bath===0)return{minute,temperature:T0*Math.exp(-k*t/(m*c)),state:'액체',frozen:0,energyOut:m*c*T0*(1-Math.exp(-k*t/(m*c)))};
  const begins=m*c/k*Math.log((T0-bath)/(-bath)),duration=m*L/(-k*bath),ends=begins+duration;
  if(t<begins){const T=bath+(T0-bath)*Math.exp(-k*t/(m*c));return{minute,temperature:T,state:'액체',frozen:0,energyOut:m*c*(T0-T)};}
  if(t<=ends){const fraction=(t-begins)/duration;return{minute,temperature:0,state:'액체 + 고체',frozen:fraction,energyOut:m*c*T0+m*L*fraction};}
  const T=bath*(1-Math.exp(-k*(t-ends)/(m*ci)));return{minute,temperature:T,state:'고체',frozen:1,energyOut:m*c*T0+m*L-m*ci*T};
 }
 function dataset(id,bath=-15){
  if(id==='lauric')return{title:'로르산 굳히기',kind:'lauric',limits:[20,80],step:10,plateau:bath===70?null:[4,18],setup:'로르산이 든 시험관 · 70 ℃ 중탕 수조 · 온도 센서',note:'로르산의 냉각 모형입니다. 약 44 ℃에서 응고하며, 냉각 시간은 시료의 양과 주변 조건에 따라 달라집니다.',points:Array.from({length:23},(_,minute)=>lauricCooling(minute,bath===70?70:20))};
  if(id==='freeze')return{title:'물 얼리기',kind:'freeze',limits:[-20,20],step:10,plateau:bath<0?[2,14]:null,setup:'시험관 속 물 10 mL · 온도 센서 · 냉각 수조',note:'10 mL 물의 냉각 모형입니다. 수조 온도를 일정하게 두고 용기·센서의 열용량과 과냉각은 생략합니다.',points:Array.from({length:19},(_,minute)=>cooling(minute,bath))};
  const r=records[id]||records.boil;
  return{...r,points:r.values.map((temperature,minute)=>({minute,temperature,state:r.kind==='boil'?(minute>=r.plateau[0]?'액체 + 기체':'액체'):(minute<r.plateau[0]?'고체':minute<=r.plateau[1]?'고체 + 액체':'액체')}))};
 }
 function format(v){return v>0&&v<.05?'0.1 미만':Math.abs(v)<.05?'0.0':v.toFixed(1);}
 function interval(id,bath,start,end){const d=dataset(id,bath);start=Number(start);end=Number(end);if(!d.plateau&&id==='lauric')return{correct:false,text:'70 ℃ 중탕 수조에서는 로르산이 액체로 남습니다. 냉각하려면 시험관을 수조에서 꺼내야 합니다.'};if(!d.plateau)return{correct:false,text:'0 ℃ 수조에서는 물의 온도가 0 ℃에 가까워져도 액체 상태를 유지합니다. 온도가 거의 변하지 않는다는 사실만으로 응고라고 판단할 수 없습니다.'};if(end<=start)return{correct:false,text:'서로 다른 두 시각을 시간 순서대로 골라 주세요.'};const [a,b]=d.plateau,correct=start===a&&end===b;return{correct,text:correct?(id==='lauric'?'4~18분의 측정점에서 액체와 고체가 함께 있고 온도는 43.8 ℃입니다. 응고하는 동안에도 열은 주변 공기로 전달됩니다.':id==='freeze'?'2~14분의 측정점에서 물과 얼음이 함께 있고 온도는 0 ℃입니다. 열은 계속 수조로 빠져나갑니다.':d.kind==='melt'?'5~8분의 측정점에서 얼음과 물이 함께 있고 온도는 약 0 ℃입니다. 받은 열은 얼음을 녹이는 데 쓰입니다.':`${a}~${b}분의 측정점에서 물과 수증기가 함께 있고 온도는 100 ℃입니다. 계속 받은 열은 기화에 쓰입니다.`):(start<a||end>b?'고른 구간에 온도가 변하는 측정점이 포함되어 있습니다. 온도와 상태를 함께 비교하세요.':'온도가 일정한 구간의 일부만 골랐습니다. 관찰한 자료에서 해당 구간의 처음과 마지막 측정점을 찾아보세요.')};}
 const api={records,constants,lauricConstants,cooling,lauricCooling,dataset,format,interval};if(typeof module!=='undefined')module.exports=api;else root.SciencePhaseCurves=api;
})(typeof window==='undefined'?globalThis:window);
