(function(root){
 'use strict';
 const initial=()=>({mode:'concentration',prepared:false,selected:0,reagent:'acid',tubes:[null,null,null,null],cobalt:'empty',bath:'bench',seen:{},pressure:'initial',pressureSeen:[],pending:null});
 // An authored stoichiometric particle example, not measured NO2 data.
 // 8 NO2 + 8 N2O4 (24 NO2 units) at V=1 becomes 6 + 9 at V=1/2.
 // Relative concentrations keep Q/K=1 at the two equilibrium endpoints.
 const pressureData=phase=>{
  const final=phase==='equilibrated',compressed=phase!=='initial',V=compressed?.5:1,no2=final?6:8,n2o4=final?9:8;
  const cNO2=no2/(8*V),cN2O4=n2o4/(8*V);
  return{V,no2,n2o4,cNO2,cN2O4,qOverK:cN2O4/cNO2**2,relativePressure:(no2+n2o4)/(16*V)};
 };
 const colourName={orange:'주황색',yellow:'노란색',pink:'분홍색',purple:'보라색',blue:'파란색',empty:'시료 없음'};
 const initialColour=i=>i%2===0?'orange':'yellow';
 function request(s,action,value){
  if(s.pending)return false;
  if(action==='mode'&&['concentration','pressure','temperature'].includes(value)){s.mode=value;return true;}
  if(action==='select'&&Number.isInteger(value)&&value>=0&&value<4){s.selected=value;return true;}
  if(action==='reagent'&&['acid','base'].includes(value)){s.reagent=value;return true;}
  if(action==='prepare'&&!s.prepared){s.prepared=true;return true;}
  if(action==='add'&&s.prepared&&!s.tubes[s.selected]){s.pending={action,index:s.selected,reagent:s.reagent};return true;}
  if(action==='fill'&&s.cobalt==='empty'){s.cobalt='pink';return true;}
  if(action==='chloride'&&s.cobalt==='pink'&&!s.seen.prepared){s.pending={action};return true;}
  if(action==='bath'&&s.seen.prepared&&['hot','cold'].includes(value)&&s.bath!==value){s.pending={action,bath:value};s.bath=value;return true;}
  if(action==='compress'&&s.pressure==='initial'){s.pressureSeen=['initial'];s.pending={action};return true;}
  if(action==='equilibrate'&&s.pressure==='compressed'){s.pending={action};return true;}
  return false;
 }
 function finish(s){
  const p=s.pending;if(!p)return false;
  if(p.action==='add')s.tubes[p.index]={reagent:p.reagent,colour:p.reagent==='acid'?'orange':'yellow'};
  if(p.action==='chloride'){s.cobalt='purple';s.seen.prepared='purple';}
  if(p.action==='bath'){s.cobalt=p.bath==='hot'?'blue':'pink';s.seen[p.bath]=s.cobalt;}
  if(p.action==='compress'){s.pressure='compressed';s.pressureSeen.push('compressed');}
  if(p.action==='equilibrate'){s.pressure='equilibrated';s.pressureSeen.push('equilibrated');}
  s.pending=null;return true;
 }
 const api={initial,request,finish,colourName,initialColour,pressureData};if(typeof module!=='undefined')module.exports=api;else root.EquilibriumColour=api;
})(typeof window==='undefined'?globalThis:window);
