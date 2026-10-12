(function(root){'use strict';
 const specimens=[
  {id:'carbon',name:'흑연',formula:'C',M:12,atoms:'C 12.0',phase:'solid',color:'#3d4954'},
  {id:'salt',name:'염화 나트륨',formula:'NaCl',M:58.5,atoms:'Na 23.0 · Cl 35.5',phase:'solid',color:'#f4f7f8'},
  {id:'magnesium',name:'마그네슘',formula:'Mg',M:24.3,atoms:'Mg 24.3',phase:'metal',color:'#a5b8c5'},
  {id:'water',name:'물',formula:'H₂O',M:18,atoms:'H 1.0 · O 16.0',phase:'liquid',density:1},
  {id:'ethanol',name:'에탄올',formula:'C₂H₅OH',M:46,atoms:'C 12.0 · H 1.0 · O 16.0',phase:'liquid',density:.79},
  {id:'copper',name:'구리',formula:'Cu',M:63.5,atoms:'Cu 63.5',phase:'metal',color:'#ba6d47'},
  {id:'glucose',name:'포도당',formula:'C₆H₁₂O₆',M:180,atoms:'C 12.0 · H 1.0 · O 16.0',phase:'solid',color:'#f0f3f0'}
 ];
 const goals=[.1,.5,1],steps=[10,1,.1,.01],round=x=>Math.round(x*100)/100;
 const create=()=>({sample:'carbon',goal:.5,mass:0,pan:false,power:false,level:false,tare:0,settled:true,step:1,calculation:false,results:{},attempts:[]});
 const specimen=s=>specimens.find(r=>r.id===s.sample),container=s=>specimen(s).phase==='liquid'?42:8,target=s=>round(specimen(s).M*s.goal);
 function select(s,id){if(!specimens.some(r=>r.id===id))return false;Object.assign(s,{sample:id,mass:0,pan:false,tare:0,settled:true,calculation:false});return true;}
 function goal(s,n){if(!goals.includes(n))return false;s.goal=n;s.calculation=false;return true;}
 function gross(s){return s.pan?round(container(s)+s.mass):0;}
 function reading(s){return s.power&&s.level&&s.settled?round(gross(s)-s.tare):null;}
 function place(s){if(s.pan)return false;s.pan=true;s.settled=false;return true;}
 function settle(s){s.settled=true;}
 function zero(s){if(!s.power)return{ok:false,reason:'power'};if(!s.level)return{ok:false,reason:'level'};if(!s.settled)return{ok:false,reason:'settle'};s.tare=gross(s);return{ok:true};}
 function change(s,amount){if(!s.pan)return{ok:false,reason:'container'};if(!Number.isFinite(amount))return{ok:false,reason:'amount'};const next=round(s.mass+amount);if(next<0)return{ok:false,reason:'empty'};if(next+container(s)>500)return{ok:false,reason:'capacity'};s.mass=next;s.settled=false;return{ok:true};}
 function check(s){let reason=!s.pan?'container':!s.power?'power':!s.level?'level':!s.settled?'settle':null;const display=reading(s),expected=target(s);if(!reason&&Math.abs(s.tare-container(s))>.001)reason=s.tare>container(s)?'loaded-tare':'container-mass';if(!reason&&Math.abs(s.mass-expected)>.001)reason=s.mass<expected?'too-little':'too-much';const result={sample:s.sample,goal:s.goal,mass:s.mass,display,expected,moles:s.mass/specimen(s).M,ok:!reason,reason};s.attempts.push({...result});if(result.ok)s.results[s.sample+'@'+s.goal]={...result};return result;}
 const api={specimens,goals,steps,create,specimen,container,target,select,goal,gross,reading,place,settle,zero,change,check};if(typeof module!=='undefined')module.exports=api;else root.MoleWeighingModel=api;
})(typeof window==='undefined'?globalThis:window);
