(function(root){'use strict';
 const C=.1,K=1.8e-5,KW=1e-14;
 const specimens=[{id:'hcl',name:'염산',formula:'HCl',kind:'strong-acid'},{id:'acetic',name:'아세트산 수용액',formula:'CH₃COOH',kind:'weak-acid'},{id:'naoh',name:'수산화 나트륨 수용액',formula:'NaOH',kind:'strong-base'},{id:'ammonia',name:'암모니아수',formula:'NH₃',kind:'weak-base'}];
 const buffers=[{id:'neutral',name:'pH 6.86 표준 용액',pH:6.86},{id:'acid',name:'pH 4.00 표준 용액',pH:4},{id:'base',name:'pH 9.18 표준 용액',pH:9.18}];
 function theory(id){const row=specimens.find(r=>r.id===id);if(!row)return null;const weak=row.kind.startsWith('weak'),base=row.kind.endsWith('base'),ion=weak?2*K*C/(K+Math.sqrt(K*K+4*K*C)):(C+Math.sqrt(C*C+4*KW))/2,h=base?KW/ion:ion,oh=KW/h;return{pH:-Math.log10(h),h,oh,ion,ionized:weak?ion/C:1,weak,base};}
 const create=()=>({selected:'neutral',immersed:false,clean:true,entryClean:true,settled:false,calibration:[],readings:{},calculated:false,attempts:[],last:null});
 function select(s,id){if(s.immersed)return{ok:false,reason:'lift'};if(![...specimens,...buffers].some(r=>r.id===id))return{ok:false,reason:'unknown'};s.selected=id;s.last=null;return{ok:true};}
 function rinse(s){if(s.immersed)return{ok:false,reason:'lift'};s.clean=true;s.last=null;return{ok:true};}
 function immerse(s){if(s.immersed)return{ok:false,reason:'immersed'};s.entryClean=s.clean;s.clean=false;s.immersed=true;s.settled=false;s.last=null;return{ok:true};}
 function settle(s){if(!s.immersed)return false;s.settled=true;return true;}
 function lift(s){s.immersed=false;s.settled=false;s.last=null;return{ok:true};}
 function conditions(s){if(!s.immersed)return'immerse';if(!s.settled)return'stabilize';if(!s.entryClean)return'rinse';return null;}
 function calibrate(s){const error=conditions(s);if(error)return{ok:false,reason:error};if(s.calibration.length===3)return{ok:false,reason:'calibrated'};if(s.selected!==buffers[s.calibration.length].id)return{ok:false,reason:'buffer-order'};s.calibration.push(s.selected);s.last={pH:buffers.find(b=>b.id===s.selected).pH,type:'buffer'};return{ok:true,complete:s.calibration.length===3};}
 function measure(s){const error=conditions(s)||(s.calibration.length<3?'calibrate':null)||(!theory(s.selected)?'sample':null);if(error){s.attempts.push({id:s.selected,valid:false,reason:error});s.last=null;return{ok:false,reason:error};}const expected=theory(s.selected),reading=Number(expected.pH.toFixed(2));s.readings[s.selected]={pH:reading};s.last={pH:reading,type:'sample'};s.attempts.push({id:s.selected,valid:true,pH:reading});return{ok:true,pH:reading};}
 function calculate(s){if(!Object.keys(s.readings).length)return false;s.calculated=true;return true;}
 const api={C,K,KW,specimens,buffers,theory,create,select,rinse,immerse,settle,lift,calibrate,measure,calculate};if(typeof module!=='undefined')module.exports=api;else root.PhComparisonModel=api;
})(typeof window==='undefined'?globalThis:window);
