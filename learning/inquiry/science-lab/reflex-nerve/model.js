(function(root){
 'use strict';
 const PATHS={
  knee:{label:'무릎 반사',centre:'척수',conscious:false,stimulus:'무릎뼈 아래의 힘줄을 가볍게 두드립니다.',result:'허벅지 앞쪽 근육이 수축하여 아래다리가 펴집니다.',route:['근육의 감각 수용기','감각 신경','척수','운동 신경','허벅지 앞쪽 근육'],detail:['힘줄이 당겨지며 근육 안의 감각 수용기가 늘어남을 감지합니다.','감각 신경이 신호를 척수로 보냅니다.','척수에서 운동 신경으로 신호가 전달됩니다.','운동 신경이 허벅지 앞쪽 근육으로 신호를 보냅니다.','대뇌의 판단을 기다리지 않고 근육이 수축합니다.']},
  leg:{label:'느끼고 다리 들기',centre:'대뇌',conscious:true,stimulus:'눈을 가리고, 무릎 위쪽에 닿는 느낌이 들면 스스로 다리를 듭니다.',result:'닿은 느낌을 인식한 뒤 다리를 펴 올립니다.',route:['피부의 감각 수용기','감각 신경 → 척수','대뇌','척수 → 운동 신경','허벅지 앞쪽 근육'],detail:['무릎 위쪽 피부의 감각 수용기가 접촉을 감지합니다.','감각 신호가 척수를 거쳐 뇌로 올라갑니다.','대뇌에서 닿은 느낌을 인식하고 다리를 들기로 판단합니다.','명령이 척수를 거쳐 운동 신경으로 전달됩니다.','허벅지 앞쪽 근육이 수축하여 아래다리가 펴집니다.']},
  pupil:{label:'동공 반사',centre:'중간뇌',conscious:false,stimulus:'눈에 들어오는 빛이 밝아집니다.',result:'홍채가 동공을 좁혀 눈에 들어오는 빛의 양을 줄입니다.',route:['망막의 시각 수용기','감각 신경','중간뇌','운동 신경','홍채의 근육'],detail:['망막의 시각 수용기가 빛을 감지합니다.','시각 정보를 전달하는 감각 신경으로 신호가 들어갑니다.','중간뇌에서 동공 반응을 조절합니다.','운동 신호가 홍채의 근육으로 전달됩니다.','동공이 작아집니다. 수정체의 두께 변화와 구별하세요.']},
  conscious:{label:'보고 손 들기',centre:'대뇌',conscious:true,stimulus:'신호등에 불이 들어오면 보고 판단하여 손을 듭니다.',result:'신호를 보고 판단한 뒤 팔의 근육이 움직입니다.',route:['망막의 시각 수용기','감각 신경','대뇌','척수 → 운동 신경','팔의 근육'],detail:['망막의 시각 수용기가 신호등의 빛을 감지합니다.','감각 신경을 따라 시각 정보가 전달됩니다.','대뇌가 신호를 인식하고 손을 들기로 판단합니다.','명령이 척수를 거쳐 팔의 운동 신경으로 전달됩니다.','팔의 근육이 수축하여 손을 듭니다.']}
 };
 const BLOCKS=['none','sensory','motor'];
 function analyse(selected='knee',progress=-1,block='none'){
  if(!PATHS[selected]||!BLOCKS.includes(block))throw Error('Invalid reflex condition');
  const limit=block==='sensory'?1.65:block==='motor'?3.65:5,p=Math.max(-1,Math.min(limit,Number(progress))),step=p<0?-1:Math.min(4,Math.floor(p)),blocked=block!=='none'&&p>=limit,complete=p>=limit;
  return{selected,block,progress:p,step,limit,blocked,complete,response:block==='none'?Math.max(0,Math.min(1,p-4)):0,centreReached:p>=2,sensoryReached:p>=2,motorReached:p>=4&&block==='none',path:PATHS[selected]};
 }
 const api={PATHS,BLOCKS,analyse};if(typeof module!=='undefined')module.exports=api;else root.ReflexModel=api;
})(typeof window==='undefined'?globalThis:window);
