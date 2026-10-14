/* Qualitative fermentation-tube procedure. Drawing coordinates are not measured gas volumes. */
(function(root){'use strict';
 const create=()=>({phase:'empty',minute:0,trappedAir:false,reagent:'koh',odour:false});
 function configure(s,key,value){if(s.phase!=='empty'||!['trappedAir','reagent'].includes(key))return false;if(key==='trappedAir'&&typeof value!=='boolean'||key==='reagent'&&!['koh','water'].includes(value))return false;s[key]=value;return true;}
 function act(s,action){
  if(action==='prepare'&&s.phase==='empty'){s.phase='prepared';return true;}
  if(action==='step'&&s.phase==='prepared'&&s.minute<20){s.minute+=5;return true;}
  if(action==='odour'&&s.phase==='prepared'&&s.minute>=15){s.odour=true;return true;}
  if(action==='withdraw'&&s.phase==='prepared'&&s.minute>=15&&s.odour){s.phase='withdrawn';return true;}
  if(action==='add'&&s.phase==='withdrawn'){s.phase='reagent';return true;}
  if(action==='tilt'&&s.phase==='reagent'){s.phase='tested';return true;}
  return false;
 }
 function tube(s,id){if(!['A','B','C'].includes(id))throw Error('Unknown fermentation tube');
  const glucose=id!=='A',cotton=id!=='B'&&!s.odour,filled=s.phase!=='empty';
  const co2=filled?(glucose?66:7)*s.minute/20:0,air=filled&&s.trappedAir?24:0;
  // Qualitative authored endpoints, not a fitted kinetic model. No artificial B/C oxygen ranking.
  const remaining=s.phase==='tested'?co2*(s.reagent==='koh'?.08:.82):co2;
  return {id,glucose,cotton,filled,air,pocket:air+remaining,beforePocket:air+co2,co2,
   odour:!s.odour?'아직 확인하지 않음':glucose?'알코올 냄새가 남':'뚜렷한 냄새 변화 없음',
   reaction:s.phase!=='tested'?null:s.reagent==='koh'?'large-decrease':'small-decrease'};
 }
 const api={create,configure,act,tube};if(typeof module!=='undefined')module.exports=api;else root.FermentationModel=api;
})(typeof window==='undefined'?globalThis:window);
