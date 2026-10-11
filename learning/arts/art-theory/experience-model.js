(function(root){
'use strict';
const colors=[['빨강','#dc3545'],['주황','#f17d27'],['노랑','#f3cd24'],['연두','#9bc33d'],['초록','#25925b'],['청록','#168f93'],['파랑','#248bca'],['남색','#344b9c'],['보라','#8550a2'],['자주','#b53782']].map(([name,hex])=>({name,hex}));
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
function relation(a,b){const distance=Math.min((a-b+10)%10,(b-a+10)%10);return distance===0?'same':distance===1?'near':distance===5?'opposite':'different';}
const related=(index,kind)=>(index+({same:0,near:1,opposite:5}[kind]??0))%10;
function flowerLayout(selected,spacing){
 const amount=clamp(spacing,0,100)/100,chosen=140+selected*130;
 return Array.from({length:5},(_,i)=>{
  const base=140+i*130;
  let target=chosen;
  if(i<selected)target=selected===1?100:100+i*(chosen-190-100)/(selected-1);
  if(i>selected){const count=4-selected,rank=i-selected-1;target=count===1?700:chosen+190+rank*(700-chosen-190)/(count-1);}
  return {x:base+(target-base)*amount,y:303};
 });
}
function linePath(points,tool){if(!points.length)return '';const start=points[0],end=points.at(-1),head=`M${start.x.toFixed(1)} ${start.y.toFixed(1)}`;if(points.length===1)return head+` l0.1 0`;
 if(tool==='straight')return head+` L${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
 if(tool==='zigzag'){const dx=end.x-start.x,dy=end.y-start.y,len=Math.hypot(dx,dy),steps=Math.max(2,Math.round(len/16));let path=head;for(let i=1;i<=steps;i++){const t=i/steps,offset=i===steps?0:(i%2?9:-9);path+=` L${(start.x+dx*t-(dy/(len||1))*offset).toFixed(1)} ${(start.y+dy*t+(dx/(len||1))*offset).toFixed(1)}`;}return path;}
 return head+points.slice(1).map(p=>` L${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('');
}
const api={colors,clamp,relation,related,flowerLayout,linePath};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ArtExperience=api;
})(globalThis);
