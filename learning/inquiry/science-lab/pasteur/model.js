(function(root){
 'use strict';
 function result({heated=true,neck='swan',stage=0}={}){
  if(!['swan','cut','tilt','sealed'].includes(neck))throw Error('Unknown flask neck');
  const air=neck!=='sealed',entered=neck==='cut'||neck==='tilt',contaminated=!heated||entered;
  return {air,contaminated,growth:stage>0&&contaminated,dustInBroth:entered,dustInBend:neck==='swan',stage,heated,neck};
 }
 const api={result};if(typeof module!=='undefined')module.exports=api;else root.pasteurModel=api;
})(typeof window==='undefined'?globalThis:window);
