/* Source-based kinematic illustration, not a numerical fluid-dynamics solver. */
(function(root){
 'use strict';
 const rotations={off:'회전 없음',slow:'느리게',wave:'중간',fast:'빠르게'};
 function initial(){return{filled:false,ice:false,heat:false,tracer:false,material:'pollen',rotation:'off',time:0,running:false,compare:false};}
 function condition(s){
  const contrast=Number(s.ice)+Number(s.heat);
  return !s.filled?'dry':!contrast?'uniform':s.rotation==='off'?'overturning':s.rotation==='slow'?'axisymmetric':s.rotation==='wave'?'wave':'irregular';
 }
 function change(s,key,value){
  if(['ice','heat','tracer'].includes(key)&&!s.filled)return{state:s,message:'세 원통에 먼저 물을 채우세요.'};
  if(key==='running'&&!s.filled)return{state:s,message:'물을 채운 뒤 관찰을 시작하세요.'};
  const state={...s,[key]:value};
  if(['ice','heat','rotation','material'].includes(key)){state.time=0;state.running=false;}
  return{state,message:''};
 }
 function point(s,index,time=s.time){
  const kind=condition(s),a0=index*2.399963229728653,r0=.33+((index*37)%100)/100*.47;
  if(kind==='dry'||kind==='uniform')return{r:r0,a:a0};
  if(kind==='overturning')return{r:.28+(r0-.28)*Math.exp(-.022*time),a:a0};
  if(kind==='axisymmetric')return{r:.29+(r0-.29)*Math.exp(-.004*time),a:a0+.085*time};
  const a=a0+(kind==='wave'?.135:.18)*time,develop=1-Math.exp(-time/5),lane=((index*37)%100)/100-.5;
  let wave=.07*Math.sin(3*(a-.022*time));
  if(kind==='irregular')wave+=.035*Math.sin(5*a+.12*time)+.022*Math.cos(2*a-.17*time);
  return{r:.565+lane*.25+develop*wave,a};
 }
 function xy(p){return{x:p.r*Math.cos(p.a),y:-p.r*Math.sin(p.a)};}
 const descriptions={dry:'세 원통에 물을 채우고 안쪽 냉각·바깥쪽 가열 조건을 정하세요.',uniform:'안팎 온도차가 없는 비교 조건입니다. 수조와 함께 도는 시점에서 물과 표지가 함께 움직이는 정상 상태를 나타냅니다.',overturning:'표면의 표지는 바깥쪽에서 안쪽으로 모입니다. 옆면 보기에서 바닥 쪽 물의 반대 흐름도 확인하세요.',axisymmetric:'표지가 안쪽으로 접근하면서 거의 원형을 이루어 흐릅니다. 회전 세기만 바꾸어 다음 조건과 비교하세요.',wave:'회전 방향을 따라 흐르는 표지의 경로가 안팎으로 굽어집니다. 일정한 온도차에서 회전 없는 조건과 비교하세요.',irregular:'흐름의 굽이와 모양이 일정하게 반복되지 않는 대표 사례입니다. 굽이 개수나 속력의 실측값은 아닙니다.'};
 const api={initial,change,condition,point,xy,rotations,descriptions};if(typeof module!=='undefined')module.exports=api;else root.scienceAnnulus=api;
})(typeof window==='undefined'?globalThis:window);
