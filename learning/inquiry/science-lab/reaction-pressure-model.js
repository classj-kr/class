(function(root){'use strict';
 const R=8.314462618,T=298.15,P0=101.325,Mg=.1/24.305,HCl=.02,limit=Math.min(Mg,HCl/2),duration=60;
 const recipes={magnesium:{mass:.1,acidM:1,acidML:20,flask:200},acid:{mass:.4,acidM:.2,acidML:50,flask:250}};
 const recipe=s=>recipes[s?.recipe]||recipes.magnesium;
 const maximum=s=>Math.min(recipe(s).mass/24.305,recipe(s).acidM*recipe(s).acidML/2000);
 const create=(id='magnesium')=>{if(!recipes[id])throw Error('Unknown reagent recipe');return{recipe:id,flask:recipes[id].flask,range:250,assembled:false,connected:false,acquiring:false,injected:false,closed:false,time:0,gas:0,samples:[],leaks:[]};};
 // The time profile is an authored finite-duration comparison curve, not a
 // measured Mg rate law. Stoichiometry and P=nRT/V are independently conserved.
 const extent=(t,s)=>maximum(s)*(1-(1-Math.max(0,Math.min(duration,t))/duration)**3);
 const remaining=s=>{const r=recipe(s),used=s.injected?extent(s.time,s):0;return{magnesium:Math.max(0,r.mass-used*24.305),acid:Math.max(0,r.acidM*r.acidML/1000-2*used),formedGas:used};};
 const pressure=s=>P0+s.gas*R*T/((s.flask-recipe(s).acidML)/1000);
 function reading(s){if(!s.connected)return{value:null,reason:'disconnected'};const value=pressure(s);return value>s.range?{value:null,reason:'range'}:{value,reason:null};}
 function record(s){if(!s.acquiring)return;const row={time:s.time,sealed:s.closed,...reading(s)};if(s.samples.at(-1)?.time===s.time)s.samples[s.samples.length-1]=row;else s.samples.push(row);}
 function configure(s,key,value){if(s.assembled)return false;if(key==='flask'&&[200,250,400].includes(value)||key==='range'&&[120,250].includes(value)){s[key]=value;return true;}return false;}
 function assemble(s){if(s.assembled)return false;s.assembled=true;return true;}
 function connect(s,on=true){if(!s.assembled)return false;s.connected=Boolean(on);if(s.injected)record(s);return true;}
 function acquire(s){if(!s.connected||s.acquiring||s.injected)return false;s.acquiring=true;return true;}
 function inject(s){if(!s.acquiring||s.injected)return false;s.injected=true;s.time=0;record(s);return true;}
 function valve(s,closed){if(!s.injected)return false;const wasClosed=s.closed;s.closed=Boolean(closed);if(!s.closed){s.gas=0;if(wasClosed)s.leaks.push(s.time);}record(s);return true;}
 function advance(s,dt){if(!s.injected||!Number.isFinite(dt)||dt<=0||s.time>=duration)return false;const next=Math.min(duration,s.time+dt);if(s.closed)s.gas+=extent(next,s)-extent(s.time,s);else s.gas=0;s.time=next;record(s);return true;}
 function average(s,start,end){if(!(end>start))return{valid:false,reason:'interval'};if(s.time<end)return{valid:false,reason:'pending'};const a=s.samples.find(r=>Math.abs(r.time-start)<1e-8&&r.value!==null),b=s.samples.find(r=>Math.abs(r.time-end)<1e-8&&r.value!==null);if(!a||!b)return{valid:false,reason:'missing'};if(s.samples.some(r=>r.time>=start&&r.time<=end&&r.value===null))return{valid:false,reason:'missing'};if(s.leaks.some(t=>t>=start&&t<=end)||s.samples.some(r=>r.time>=start&&r.time<=end&&!r.sealed))return{valid:false,reason:'leak'};return{valid:true,start,end,delta:b.value-a.value,rate:(b.value-a.value)/(end-start)};}
 const api={R,T,P0,Mg,HCl,limit,duration,recipes,recipe,maximum,remaining,create,extent,pressure,reading,configure,assemble,connect,acquire,inject,valve,advance,average};if(typeof module!=='undefined')module.exports=api;else root.ReactionPressureModel=api;
})(typeof window==='undefined'?globalThis:window);
