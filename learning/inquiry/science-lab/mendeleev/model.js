(function(root){
 'use strict';
 // 2022 MiraeN inquiry 1, pp. 27, 75, 77. Rounded activity masses and fictional symbols.
 const data=[
  ['Na',23,0,['Na₂O','NaCl'],'물과 격렬하게 반응'],['L',24,1,['LO','LCl₂'],'물과 잘 반응'],['M',27,2,['M₂O₃','MCl₃'],''],['Si',28,3,['SiO₂','SiH₄'],''],['A',31,4,['AH₃','ACl₃'],''],['D',32,5,['H₂D','Cl₂D','Na₂D'],''],['Cl',35,6,['HCl','NaCl'],'나트륨과 격렬하게 반응'],
  ['K',39,0,['K₂O','KCl'],'물과 격렬하게 반응'],['Q',40,1,['QO','QCl₂'],'물과 잘 반응'],['E',75,4,['EH₃','ECl₃'],''],['G',79,5,['H₂G','Cl₂G','Na₂G'],''],['Br',80,6,['HBr','NaBr'],'나트륨과 잘 반응'],
  ['Rb',85,0,['Rb₂O','RbCl'],'물과 격렬하게 반응'],['R',87,1,['RO','RCl₂'],'물과 잘 반응'],['T',115,2,['T₂O₃','TCl₃'],''],['X',118,3,['XO₂','XH₄'],''],['Z',122,4,['ZH₃','ZCl₃'],''],['J',125,5,['H₂J','Cl₂J','Na₂J'],''],['I',127,6,['HI','NaI'],'']
 ];
 const cards=data.map(([id,mass,family,compounds,reaction])=>({id,mass,family,compounds,reaction}));
 const byId=Object.fromEntries(cards.map(c=>[c.id,c]));
 function place(slots,id,index){
  if(slots.length!==21||!byId[id]||!Number.isInteger(index)||index<0||index>=21)throw Error('Invalid placement');
  const next=slots.slice(),old=next.indexOf(id),displaced=next[index];
  if(old>=0)next[old]=displaced;next[index]=id;return next;
 }
 function evaluate(slots){
  if(slots.length!==21)throw Error('Expected three rows of seven');
  const ids=slots.filter(Boolean);if(ids.some(id=>!byId[id])||new Set(ids).size!==ids.length)throw Error('Invalid or duplicated card');
  const orderConflicts=[],familyConflicts=[];
  for(let row=0;row<3;row++){
   const positions=Array.from({length:7},(_,col)=>row*7+col).filter(i=>slots[i]);
   for(let j=1;j<positions.length;j++)if(byId[slots[positions[j-1]]].mass>byId[slots[positions[j]]].mass)orderConflicts.push([positions[j-1],positions[j]]);
  }
  for(let col=0;col<7;col++){
   const positions=[col,col+7,col+14].filter(i=>slots[i]);
   if(new Set(positions.map(i=>byId[slots[i]].family)).size>1)familyConflicts.push(col);
   for(let j=1;j<positions.length;j++)if(byId[slots[positions[j-1]]].mass>byId[slots[positions[j]]].mass)orderConflicts.push([positions[j-1],positions[j]]);
  }
  return {placed:ids.length,remaining:cards.length-ids.length,empty:slots.flatMap((id,i)=>id?[]:[i]),orderConflicts,familyConflicts,complete:ids.length===cards.length&&!orderConflicts.length&&!familyConflicts.length};
 }
 const api={cards,place,evaluate};if(typeof module!=='undefined')module.exports=api;else root.mendeleevModel=api;
})(typeof window==='undefined'?globalThis:window);
