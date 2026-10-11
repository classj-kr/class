(function(root){
 'use strict';
 const colors=[['빨강','#ff6659'],['주황','#ffae4a'],['노랑','#f7e65e'],['초록','#60e0a5'],['파랑','#50aaff'],['남색','#8083ff'],['보라','#c190ff']];
 function result({mode='dispersion',color=0,screen=70,light=true}={}){
  if(!['dispersion','single','combine'].includes(mode))throw Error('Unknown optical arrangement');
  const selected=Math.max(0,Math.min(6,Math.round(Number(color)||0))),focus=70;
  return {mode,light,color:selected,focus,screen:Number(screen),colors:!light?[]:mode==='single'?[selected]:colors.map((_,i)=>i),white:light&&mode==='combine'&&Number(screen)===focus,spread:mode==='combine'?Math.abs(Number(screen)-focus):50};
 }
 const api={colors,result};if(typeof module!=='undefined')module.exports=api;else root.prismModel=api;
})(typeof window==='undefined'?globalThis:window);
