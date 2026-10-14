(function(root){
 'use strict';
 // Chunjae 2022 Science Inquiry 1, PDF 21, 22, 79 (printed appendix 78).
 // Values and qualitative descriptions are the activity's rounded card data.
 const rows=[
  ['H',1,'1.0',0,'기체','비금속','큼',['H₂O','HCl']],
  ['Li',3,'7.0',0,'고체','금속','큼',['Li₂O','LiOH']],
  ['Be',4,'9.0',1,'고체','금속','크지 않음',['BeO','Be(OH)₂']],
  ['B',5,'10.8',2,'고체','준금속','큼',['BCl₃','B₂O₃']],
  ['C',6,'12.0',3,'고체','비금속','크지 않음',['CH₄','CO₂']],
  ['N',7,'14.0',4,'기체','비금속','크지 않음',['NO₂','NH₃']],
  ['O',8,'16.0',5,'기체','비금속','큼',['CO₂','H₂O']],
  ['F',9,'19.0',6,'기체','비금속','큼',['NaF','CF₄']],
  ['Na',11,'23.0',0,'고체','금속','큼',['NaCl','NaOH']],
  ['Mg',12,'24.3',1,'고체','금속','큼',['MgO','MgCl₂']],
  ['Al',13,'27.0',2,'고체','금속','크지 않음',['AlCl₃','Al₂O₃']],
  ['Si',14,'28.1',3,'고체','준금속','크지 않음',['SiO₂']],
  ['P',15,'31.0',4,'고체','비금속','크지 않음',['PCl₅','P₂O₅']],
  ['S',16,'32.0',5,'고체','비금속','크지 않음',['SO₂','H₂S']],
  ['Cl',17,'35.5',6,'기체','비금속','크지 않음',['NaCl','HCl']],
  ['K',19,'39.1',0,'고체','금속','큼',['KCl','KNO₃']],
  ['Ca',20,'40.1',1,'고체','금속','큼',['CaO','CaCl₂']]
 ];
 const cards=rows.map(([symbol,number,massLabel,family,state,kind,reactivity,compounds],i)=>({id:'c'+(i+1),symbol,number,massLabel,mass:Number(massLabel),family,state,kind,reactivity,compounds}));
 const byId=Object.fromEntries(cards.map(c=>[c.id,c]));
 const active=[0,...Array.from({length:16},(_,i)=>i+7)];
 function valid(slots){
  if(!Array.isArray(slots)||slots.length!==28)throw Error('Expected four rows of seven');
  const ids=slots.filter(Boolean);
  if(ids.some(id=>!byId[id])||new Set(ids).size!==ids.length||slots.some((id,i)=>id&&!active.includes(i)))throw Error('Invalid or duplicated card');
 }
 function identify(id,symbol){if(!byId[id])throw Error('Unknown card');return byId[id].symbol===symbol;}
 function place(slots,id,index){
  valid(slots);if(!byId[id]||!active.includes(index))throw Error('Invalid placement');
  const next=slots.slice(),previous=next.indexOf(id),displaced=next[index];
  if(previous>=0)next[previous]=displaced;next[index]=id;return next;
 }
 function evaluate(slots){
  valid(slots);const orderConflicts=[],familyConflicts=[];
  // H occupies its source-defined top cell, but is not an alkali-metal family member.
  const hydrogenConflict=!!slots[0]&&byId[slots[0]].symbol!=='H';
  for(let row=0;row<4;row++){
   const positions=active.filter(i=>Math.floor(i/7)===row&&slots[i]);
   for(let j=1;j<positions.length;j++)if(byId[slots[positions[j-1]]].mass>byId[slots[positions[j]]].mass)orderConflicts.push([positions[j-1],positions[j]]);
  }
  for(let col=0;col<7;col++){
   const positions=active.filter(i=>i>=7&&i%7===col&&slots[i]);
   if(positions.some(i=>byId[slots[i]].family!==col||byId[slots[i]].symbol==='H'))familyConflicts.push(col);
   for(let j=1;j<positions.length;j++)if(byId[slots[positions[j-1]]].mass>byId[slots[positions[j]]].mass)orderConflicts.push([positions[j-1],positions[j]]);
  }
  const placed=slots.filter(Boolean).length;
  return {placed,remaining:17-placed,orderConflicts,familyConflicts,hydrogenConflict,complete:placed===17&&!hydrogenConflict&&!orderConflicts.length&&!familyConflicts.length};
 }
 const modern=[...cards,...[['He',2],['Ne',10],['Ar',18]].map(([symbol,number])=>({symbol,number,family:7,kind:'비금속',noble:true}))].sort((a,b)=>a.number-b.number);
 const api={cards,active,identify,place,evaluate,modern};if(typeof module!=='undefined')module.exports=api;else root.mendeleevIdentity=api;
})(typeof window==='undefined'?globalThis:window);
