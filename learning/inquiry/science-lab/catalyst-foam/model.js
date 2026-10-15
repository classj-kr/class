(function(g){'use strict';const modes={ki:{ki:[false,true],soap:[true,true]},control:{ki:[false,false],soap:[true,true]},'no-soap':{ki:[true,true],soap:[true,false]}};
// Dimensionless scene choreography only. No fitted kinetics or measured foam volumes.
function snapshot(mode,progress){if(!modes[mode])throw RangeError('unknown comparison');const p=Math.max(0,Math.min(1,Number.isFinite(progress)?progress:0)),r=modes[mode];return{mode,progress:p,rows:r.ki.map((ki,i)=>({ki,soap:r.soap[i],peroxideML:10,soapML:r.soap[i]?1:0,waterML:r.soap[i]?0:1,foam:p===0||!r.soap[i]?0:ki?190*(1-Math.exp(-4*p)):10*p,bubbleActivity:p===0?0:ki?1:.08}))};}
const api={modes,snapshot};if(typeof module!=='undefined')module.exports=api;else g.CatalystFoamModel=api;
})(typeof window!=='undefined'?window:globalThis);
