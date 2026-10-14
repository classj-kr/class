(function(root){'use strict';
 const specimens=[
  {id:'butterfly',name:'나비',wings:true,legs:true,fins:false,detail:{wings:'몸 양쪽에 날개가 있습니다.',legs:'몸 아래쪽에 가느다란 다리가 있습니다.',fins:'날개가 있으며 지느러미는 없습니다.'}},
  {id:'sparrow',name:'참새',wings:true,legs:true,fins:false,detail:{wings:'몸 옆에 깃털로 덮인 날개가 접혀 있습니다.',legs:'몸 아래로 뻗은 두 다리가 있습니다.',fins:'몸 옆의 접힌 부분은 날개입니다.'}},
  {id:'rabbit',name:'토끼',wings:false,legs:true,fins:false,detail:{wings:'길게 뻗은 귀와 날개를 구별하세요. 토끼에게 날개는 없습니다.',legs:'앞다리와 뒷다리가 있습니다.',fins:'털로 덮인 다리가 있으며 지느러미는 없습니다.'}},
  {id:'tiger',name:'호랑이',wings:false,legs:true,fins:false,detail:{wings:'몸에 날개가 없습니다.',legs:'몸 아래로 뻗은 네 다리가 있습니다.',fins:'다리와 꼬리가 있으며 지느러미는 없습니다.'}},
  {id:'seabream',name:'참돔',wings:false,legs:false,fins:true,detail:{wings:'몸 옆의 얇고 넓은 부분은 날개가 아니라 지느러미입니다.',legs:'지느러미로 헤엄칩니다. 걷는 다리는 없습니다.',fins:'등과 몸 옆, 꼬리 쪽의 지느러미를 살펴보세요.'}},
  {id:'carp',name:'붕어',wings:false,legs:false,fins:true,detail:{wings:'몸 옆의 얇고 넓은 부분은 지느러미입니다.',legs:'몸 아래쪽에 보이는 부분은 다리가 아니라 지느러미입니다.',fins:'등과 몸 아래, 꼬리 쪽에 지느러미가 있습니다.'}},
  {id:'earthworm',name:'지렁이',wings:false,legs:false,fins:false,detail:{wings:'길쭉한 몸에 날개가 없습니다.',legs:'다리 없이 몸을 움직여 이동합니다.',fins:'몸에 지느러미가 없습니다.'}},
  {id:'snake',name:'뱀',wings:false,legs:false,fins:false,detail:{wings:'길쭉한 몸에 날개가 없습니다.',legs:'다리 없이 몸을 움직여 이동합니다.',fins:'비늘은 있지만 지느러미는 없습니다.'}}
 ];
 const rules={wings:{question:'날개가 있는가?',hint:'날개가 접혀 있을 때의 모습도 살펴보세요.'},legs:{question:'다리가 있는가?',hint:'움직일 수 있는지와 다리가 있는지를 구별하세요.'},fins:{question:'지느러미가 있는가?',hint:'몸 옆과 등, 배, 꼬리의 모습을 비교하세요.'}};
 const create=()=>({rule:'wings',selected:'butterfly',answers:{},first:{},checked:false});
 function setRule(s,rule){if(!rules[rule])return false;s.rule=rule;s.answers={};s.checked=false;return true;}
 function select(s,id){if(!specimens.some(p=>p.id===id))return false;s.selected=id;return true;}
 function answer(s,id,value){if(!specimens.some(p=>p.id===id)||typeof value!=='boolean')return false;s.answers[id]=value;s.checked=false;return true;}
 function check(s){const missing=specimens.filter(p=>!(p.id in s.answers)).map(p=>p.id);if(missing.length)return{complete:false,missing};const wrong=specimens.filter(p=>s.answers[p.id]!==p[s.rule]).map(p=>p.id);if(!(s.rule in s.first))s.first[s.rule]={wrong:[...wrong],answers:{...s.answers}};s.checked=true;return{complete:true,wrong};}
 const api={specimens,rules,create,setRule,select,answer,check};if(typeof module!=='undefined')module.exports=api;else root.AnimalClassificationModel=api;
})(typeof window==='undefined'?globalThis:window);
