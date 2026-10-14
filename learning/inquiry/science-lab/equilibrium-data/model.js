(function(root,factory){const M=factory();if(typeof module==='object'&&module.exports)module.exports=M;else root.EquilibriumData=M;})(globalThis,()=>{
 'use strict';
 // Transcribed and visually checked: Dong-A chemistry p.113; Chunjae p.114.
 // Keep each publisher's rounded table intact instead of forcing exact K.
 const sets={a:{label:'자료 A',temperature:'25 ℃',rows:[{id:'Ⅰ',initial:[.0800,0],eq:[.0125,.0337]},{id:'Ⅱ',initial:[.0400,.0300],eq:[.0141,.0430]},{id:'Ⅲ',initial:[0,.0700],eq:[.0169,.0616]}]},b:{label:'자료 B',temperature:'같은 온도',rows:[{id:'Ⅰ',initial:[.0600,0],eq:[.0107,.0246]},{id:'Ⅱ',initial:[0,.0400],eq:[.0125,.0337]},{id:'Ⅲ',initial:[.0600,.0200],eq:[.0141,.0429]}]}};
 const formulas={simple:{label:'[N₂O₄] / [NO₂]',unit:'',power:1,factor:1},coefficient:{label:'[N₂O₄] / (2[NO₂])',unit:'',power:1,factor:2},square:{label:'[N₂O₄] / [NO₂]²',unit:'M⁻¹',power:2,factor:1}};
 function calculate(set='a',basis='eq',formula='simple'){
  if(!sets[set]||!['initial','eq'].includes(basis)||!formulas[formula])throw new RangeError('Unknown data selection');
  const f=formulas[formula],values=sets[set].rows.map(r=>r[basis][0]===0?null:r[basis][1]/(f.factor*r[basis][0]**f.power));
  const finite=values.filter(v=>v!==null),mean=finite.length?finite.reduce((s,v)=>s+v,0)/finite.length:null;
  return{values,mean,min:finite.length?Math.min(...finite):null,max:finite.length?Math.max(...finite):null,spread:finite.length===3&&mean>0?(Math.max(...finite)-Math.min(...finite))/mean:null,consistent:finite.length===3&&mean>0&&(Math.max(...finite)-Math.min(...finite))/mean<.01};
 }
 return{sets,formulas,calculate};
});
