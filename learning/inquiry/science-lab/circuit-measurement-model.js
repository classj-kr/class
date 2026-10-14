(function(root){
 const defaults=()=>({wiring:'series',volts:6,r1:200,r2:100,meter:'voltage',connection:'parallel',target:'r1',closed:false});
 function analyse(s){
  if(!['series','parallel'].includes(s.wiring)||![s.volts,s.r1,s.r2].every(Number.isFinite)||s.volts<0||s.r1<=0||s.r2<=0)throw new RangeError('Invalid circuit conditions');
  const resistance=s.wiring==='series'?s.r1+s.r2:1/(1/s.r1+1/s.r2),current=s.volts/resistance;
  return {whole:{voltage:s.volts,current,resistance},r1:{voltage:s.wiring==='series'?current*s.r1:s.volts,current:s.wiring==='series'?current:s.volts/s.r1,resistance:s.r1},r2:{voltage:s.wiring==='series'?current*s.r2:s.volts,current:s.wiring==='series'?current:s.volts/s.r2,resistance:s.r2}};
 }
 function connection(s){return s.meter==='current'?(s.connection==='series'?'ready':'short'):(s.connection==='parallel'?'ready':'open');}
 function reading(s){const status=connection(s);return{status:status==='ready'?(s.closed?'measured':'off'):status,value:s.closed&&status==='ready'?analyse(s)[s.target][s.meter]:null,unit:s.meter==='current'?'A':'V'};}
 const conditionKey=s=>[s.volts,s.r1,s.r2].join('|');
 const create=()=>({conditions:null,series:{},parallel:{}});
 function capture(book,s){const r=reading(s);if(r.status!=='measured')return false;const key=conditionKey(s);if(book.conditions!==key){book.conditions=key;book.series={};book.parallel={};}book[s.wiring][s.target+'-'+s.meter]=r.value;return true;}
 const complete=rows=>['r1','r2','whole'].every(t=>['voltage','current'].every(m=>Number.isFinite(rows[t+'-'+m])));
 const api={defaults,analyse,connection,reading,conditionKey,create,capture,complete};
 if(typeof module!=='undefined')module.exports=api;else root.scienceCircuitMeasurement=api;
})(typeof window==='undefined'?globalThis:window);
