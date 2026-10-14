/* Authored virtual sampling areas; neither a field census nor regional flora.
 * Five reference specimens are distinguished by combined vegetative/reproductive traits.
 * Counts mean observed specimen positions, not genets of clonal plants. */
(function(root){
 'use strict';
 const species={
  clover:{name:'토끼풀',latin:'Trifolium repens',growth:'herb',leaf:'three',feature:'잎자루 끝에 작은 잎 3장 · 둥근 흰 꽃차례',leafNote:'한 잎자루 끝에 작은 잎 3장이 모여 있습니다.',flowerNote:'작은 흰 꽃들이 둥글게 모입니다.'},
  plantain:{name:'질경이',latin:'Plantago asiatica',growth:'herb',leaf:'basal',feature:'땅 가까이 모인 넓은 잎 · 뚜렷한 5~7개 잎맥',leafNote:'잎 밑에서 시작한 굵은 잎맥이 끝 쪽으로 나란히 휘어집니다.',flowerNote:'가늘고 긴 꽃줄기 위에 작은 꽃이 촘촘히 붙습니다.'},
  foxtail:{name:'강아지풀',latin:'Setaria viridis',growth:'herb',leaf:'linear',feature:'가늘고 긴 잎 · 까끄라기가 있는 원기둥 꽃차례',leafNote:'줄기에서 가늘고 긴 잎이 뻗고 잎맥이 나란합니다.',flowerNote:'원기둥 모양 꽃차례의 작은 이삭들 사이에 까끄라기가 있습니다.'},
  ginkgo:{name:'은행나무',latin:'Ginkgo biloba',growth:'woody',leaf:'fan',feature:'목질 줄기 · 부채꼴 잎 · 둘씩 갈라지는 잎맥',leafNote:'부채꼴로 퍼진 잎 안에서 잎맥이 반복해 둘로 갈라집니다.',flowerNote:'꽃잎이 있는 꽃이 아닙니다. 이 관찰에서는 잎과 줄기로 비교합니다.'},
  hibiscus:{name:'무궁화',latin:'Hibiscus syriacus',growth:'woody',leaf:'lobed',feature:'목질 줄기 · 대개 세 갈래 잎 · 톱니 모양 잎 가장자리',leafNote:'이 표본의 잎은 세 갈래로 얕게 갈라지고 가장자리에 톱니가 있습니다.',flowerNote:'꽃잎 5장이 펼쳐지고 가운데에 암술대와 수술통이 보입니다.'}
 };
 const areas={garden:['clover','plantain','foxtail','ginkgo','hibiscus','clover','plantain','foxtail','clover','plantain','foxtail','hibiscus'],lawn:['clover','clover','plantain','foxtail','clover','clover','plantain','foxtail','clover','clover','plantain','foxtail']};
 const defaults=()=>({area:'garden',period:'morning',effort:12});
 function specimens(area){return(areas[area]||areas.garden).map((kind,i)=>({id:area+'-'+i,kind,index:i}));}
 function candidates(growth,leaf){return Object.entries(species).filter(([,s])=>(!growth||s.growth===growth)&&(!leaf||s.leaf===leaf)).map(([id])=>id);}
 function summary(records){const counts={};for(const r of Object.values(records))counts[r.kind]=(counts[r.kind]||0)+1;return{count:Object.keys(records).length,richness:Object.keys(counts).length,counts};}
 function compare(a,b){if(!a||!b)return{valid:false,reason:'두 구역에서 관찰을 마치면 비교할 수 있습니다.'};
  if(!a.complete||!b.complete)return{valid:false,reason:'관찰하지 않은 표본이 남아 있습니다. 두 구역을 끝까지 관찰하세요.'};
  if(a.period!==b.period||a.effort!==b.effort)return{valid:false,reason:'두 구역의 관찰 시각과 관찰 시간을 같게 맞추세요.'};
  return{valid:true,reason:`화단 ${a.richness}종 · 잔디밭 ${b.richness}종을 관찰했습니다. 관찰 표본 수와 종 수를 구별하세요.`};
 }
 const api={species,areas,defaults,specimens,candidates,summary,compare};if(typeof module!=='undefined')module.exports=api;else root.LocalBiodiversityModel=api;
})(typeof window==='undefined'?globalThis:window);
