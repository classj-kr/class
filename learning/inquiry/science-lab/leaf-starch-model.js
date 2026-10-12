(function(root){'use strict';const M={
 create:()=>({cover:'whole',initial:'clear',exposed:false,plucked:false,heated:false,decolored:false,rinsed:false,tested:false,skip:false}),
 starch(s,leaf,half){return s.initial==='retained'||(s.exposed&&(leaf==='A'||s.cover==='none'||s.cover==='half'&&half==='left'));},
 apply(s,action){const fail=t=>t;
  if(action==='expose'){s.exposed=true;return '';}
  if(action==='pluck'){if(!s.exposed)return fail('빛을 비춘 두 잎을 먼저 비교하세요.');s.plucked=true;return '';}
  if(action==='water'){if(!s.plucked)return fail('두 잎을 따고 가림막을 벗기세요.');s.heated=true;return '';}
  if(action==='ethanol'){if(!s.heated)return fail('두 잎을 먼저 뜨거운 물에 넣으세요.');s.decolored=true;s.rinsed=false;s.tested=false;s.skip=false;return '';}
  if(action==='skip'){if(!s.heated)return fail('두 잎을 먼저 뜨거운 물에 넣으세요.');s.skip=true;return '';}
  if(action==='rinse'){if(!s.decolored&&!s.skip)return fail('에탄올을 물중탕하여 잎의 초록색을 빼세요.');s.rinsed=true;return '';}
  if(action==='iodine'){if(!s.rinsed)return fail('두 잎을 따뜻한 물에 헹구고 접시에 놓으세요.');s.tested=true;return '';}
  throw Error('Unknown leaf step '+action);
 },
 result(s){if(!s.tested)return null;if(!s.decolored)return {readable:false,text:'초록색 색소가 남아 반응 색을 비교하기 어렵습니다. 탈색한 뒤 다시 확인하세요.'};const colors=['A','B'].map(leaf=>['left','right'].map(half=>this.starch(s,leaf,half)?'청람색':'황갈색'));return {readable:true,colors,text:s.initial==='retained'?'빛을 가린 부분도 청람색입니다. 처음부터 남아 있던 녹말과 이번에 만든 녹말을 이 결과만으로 구별하기 어렵습니다.':s.cover==='whole'?'빛을 받은 A는 청람색, 가린 B는 황갈색입니다. 두 잎이 받은 빛과 녹말 반응을 비교하세요.':s.cover==='half'?'B의 빛을 받은 절반만 청람색입니다. 같은 잎에서 가린 부분과 받은 부분을 비교하세요.':'두 잎 모두 빛을 받아 청람색입니다. 빛의 영향을 알아보려면 빛을 가린 조건도 필요합니다.'};}
};if(typeof module!=='undefined')module.exports=M;if(root)root.ScienceLeafStarch=M;})(typeof window!=='undefined'?window:null);
