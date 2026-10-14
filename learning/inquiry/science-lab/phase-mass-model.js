(function(root){
 'use strict';
 // A source-example bottle + contents mass, not a universal mass of olive oil.
 const dryMass=13.5;
 function create(){return{filled:false,frozen:false,position:'bench',zeroed:false,water:0,markedBefore:false,markedAfter:false,before:null,after:null};}
 function prepare(s){if(s.filled)return false;s.filled=true;return true;}
 function zero(s){if(s.position==='scale')return false;s.zeroed=true;return true;}
 function mark(s){if(!s.filled||s.position!=='bench')return false;if(s.frozen)s.markedAfter=true;else s.markedBefore=true;return true;}
 function reading(s){return(s.position==='scale'&&s.filled?dryMass+s.water:0)+(s.zeroed?0:.2);}
 function weigh(s){if(!s.filled||s.position!=='bench')return false;s.position='scale';const result={mass:+reading(s).toFixed(1),wet:s.water>0,zeroed:s.zeroed,marked:s.frozen?s.markedAfter:s.markedBefore};result.valid=!result.wet&&result.zeroed&&result.marked;s[s.frozen?'after':'before']=result;return true;}
 function remove(s){if(s.position!=='scale')return false;s.position='bench';return true;}
 function cool(s){if(s.position!=='bench'||!s.before?.valid||s.frozen)return false;s.position='bath';s.frozen=true;return true;}
 function retrieve(s){if(s.position!=='bath')return false;s.position='bench';s.water=.3;return true;}
 function wipe(s){if(!s.frozen||s.position!=='bench')return false;s.water=0;return true;}
 function validComparison(s){return!!(s.before?.valid&&s.after?.valid&&s.markedBefore&&s.markedAfter);}
 const api={dryMass,create,prepare,zero,mark,reading,weigh,remove,cool,retrieve,wipe,validComparison};if(typeof module!=='undefined')module.exports=api;else root.sciencePhaseMass=api;
})(typeof window==='undefined'?globalThis:window);
