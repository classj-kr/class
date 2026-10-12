(function(root){'use strict';const M={
 create:()=>({clean:false,wiring:'normal',solution:'copper',gap:'apart',connected:false,immersed:false,powered:false,progress:0,stage:'prepare',washed:false,dried:false}),
 dip(s){if(!s.connected)return '먼저 두 전극을 전원에 연결하세요.';s.immersed=true;s.stage='bath';return '';},
 power(s){if(s.powered){s.powered=false;return '';}if(!s.immersed)return '전극을 용액에 담근 뒤 전원을 켜세요.';if(s.gap==='touch')return '두 금속이 닿아 있습니다. 전원을 끈 채 금속을 분리하세요.';if(s.solution==='water')return '전류가 매우 작고 구리 이온이 없어 구리 도금을 관찰하기 어렵습니다.';s.powered=true;return '';},
 step(s,amount=.2){if(s.powered&&s.immersed&&s.solution==='copper'&&s.gap==='apart')s.progress=Math.min(1,s.progress+Math.max(0,amount));},
 remove(s){if(s.powered)return '전원을 먼저 끄고 펜던트를 꺼내세요.';if(!s.immersed)return '아직 용액에 담그지 않았습니다.';s.immersed=false;s.stage='out';return '';},
 observation(s){if(s.dried){if(s.wiring==='reverse'&&s.progress>0)return '펜던트는 (+)극이어서 산화가 일어났습니다. 구리 석출은 (−)극인 구리판 쪽에서 일어났습니다.';if(s.progress>.8)return s.clean?'씻고 말린 펜던트 표면에 구리층이 남았습니다. 두 전극의 반쪽 반응을 비교하세요.':'기름이 남은 부분에서 도금층이 고르지 않습니다. 표면 세척 조건을 바꾸어 비교하세요.';return '전원을 통한 도금이 충분히 진행되지 않았습니다. 갈색 변화만으로 전기 도금 여부를 판단할 수는 없습니다.';}
  if(s.stage==='out')return s.washed?'세척했습니다. 마른 천으로 물을 닦으세요.':'꺼낸 펜던트를 따뜻한 물로 씻으세요.';
  if(!s.immersed)return '펜던트 표면을 세척한 뒤 전극을 연결하고 용액에 담그세요.';
  if(s.solution==='water')return '구리 이온이 없는 물입니다. 전원을 연결한 것만으로 구리 도금이 되지는 않습니다.';
  if(!s.powered&&s.progress===0)return '철 표면에 갈색 구리가 일부 생깁니다. 전원 없이도 철과 구리 이온의 치환 반응이 일어납니다.';
  if(s.powered)return s.wiring==='normal'?'구리판에서 산화, 펜던트에서 환원이 일어납니다. 표면의 변화를 관찰하세요.':'연결이 반대입니다. (+)극인 펜던트가 산화되고 (−)극인 구리판에서 구리가 석출됩니다.';
  return '전원을 껐습니다. 펜던트를 꺼내 씻고 말린 뒤 표면을 비교하세요.';
 }
};if(typeof module!=='undefined')module.exports=M;if(root)root.SciencePlating=M;})(typeof window!=='undefined'?window:null);
