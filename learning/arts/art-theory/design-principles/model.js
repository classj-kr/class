(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.DesignPrinciples=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const specs={
 balance:{title:'균형',note:'도형의 전체 면적은 같습니다. 크기가 다른 배치에서는 큰 원 하나와 작은 원 세 개를 비교합니다.',prompt:'어느 쪽으로 무게가 쏠려 보이나요? 오른쪽 묶음을 옮기며 빈 공간도 함께 보세요. 균형은 좌우를 똑같이 만드는 방법 외에도 찾을 수 있습니다.'},
 rhythm:{title:'반복과 리듬',note:'원의 개수·크기와 맨 처음·끝 위치는 같습니다. 가운데 원들의 간격만 바뀝니다.',prompt:'왼쪽부터 원을 하나씩 따라가 보세요. 일정한 간격과 넓고 좁은 간격의 반복은 각각 어떤 흐름을 만드나요?'},
 emphasis:{title:'강조',note:'왼쪽 위부터 오른쪽으로 1~4번, 아래 줄은 5~7번입니다. 선택한 원의 크기와 색만 바뀝니다.',prompt:'어느 원이 먼저 눈에 들어오나요? 크기만 바꿔 본 뒤, 크기를 되돌리고 색만 바꿔 비교해 보세요.'}
};
const defaults=study=>({balance:{layout:'mirror',shift:0},rhythm:{pattern:'even',amount:60},emphasis:{target:4,size:100,contrast:0}}[study]);
const limits={shift:[-45,45],amount:[0,100],target:[1,7],size:[100,180],contrast:[0,100]};
function change(state,key,value){
 if(!(key in state))throw new RangeError('Unknown control');
 if(limits[key]){const [min,max]=limits[key];if(!Number.isFinite(Number(value)))throw new RangeError('Invalid value');value=Math.max(min,Math.min(max,Math.round(Number(value))));}
 else if(!(key==='layout'?['mirror','varied']:['even','alternate','growing']).includes(value))throw new RangeError('Unknown choice');
 return {...state,[key]:value};
}
function objects(study,state){
 const dot=(x,y,r=18,fill='rgb(83,107,91)')=>({x,y,r,fill});
 if(study==='balance'){
  const x=270+state.shift;
  return state.layout==='mirror'?[dot(110,112,36),dot(110,228,36),dot(x,112,36),dot(x,228,36)]:[dot(110,170,36*Math.sqrt(2)),... [96,170,244].map(y=>dot(x,y,36*Math.sqrt(2/3)))];
 }
 if(study==='rhythm'){
  let x=50;const a=state.amount/100;
  const gaps=Array.from({length:6},(_,i)=>280/6*(state.pattern==='alternate'?1+(i%2===0?-1:1)*a*.4:state.pattern==='growing'?1+(i-2.5)/2.5*a*.45:1));
  return [dot(x,170,12),...gaps.map(gap=>{x+=gap;return dot(x,170,12)})];
 }
 const positions=[[82,120],[154,120],[226,120],[298,120],[118,220],[190,220],[262,220]];
 const blend=[83,107,91].map((v,i)=>Math.round(v+([188,88,44][i]-v)*state.contrast/100));
 return positions.map(([x,y],index)=>dot(x,y,index===state.target-1?18*state.size/100:18,index===state.target-1?`rgb(${blend.join(',')})`:'rgb(83,107,91)'));
}
function equivalent(study,a,b){return JSON.stringify(objects(study,a))===JSON.stringify(objects(study,b));}
function describe(study,s){
 if(study==='balance')return (s.layout==='mirror'?'같은 크기':'다른 크기')+' · '+(s.shift===0?'처음 위치':s.shift<0?'안쪽 '+Math.abs(s.shift):'바깥쪽 '+s.shift);
 if(study==='rhythm')return ({even:'일정한 간격',alternate:'넓고 좁게 번갈아',growing:'점점 넓은 간격'}[s.pattern])+(s.pattern==='even'?'':' · 차이 '+s.amount);
 return s.target+'번 · 크기 '+s.size+'% · 색 차이 '+s.contrast;
}
return {specs,defaults,change,objects,equivalent,describe};
});
