(function(root){
 'use strict';
 // Same ideal heat input, no container heat capacity or heat loss.
 // The oil/water specific-heat ratio 0.47 is from the reviewed textbook graph.
 const heat={water:4180,oil:4180*.47};
 function create(){return{mass:{water:100,oil:100},power:{water:10,oil:10},probe:{water:'liquid',oil:'liquid'},prepared:false,connected:false,running:false,time:0,samples:[]};}
 function configure(s,key,value){if(s.prepared)return false;if(key==='mass'&&[100,200].includes(value))s.mass.oil=value;else if(key==='power'&&[10,20].includes(value))s.power.oil=value;else return false;return true;}
 function place(s,liquid,position){if(s.time||s.running||!['water','oil'].includes(liquid)||!['liquid','bottom','air'].includes(position))return false;s.probe[liquid]=position;if(s.connected)s.samples=[sample(s,0)];return true;}
 function temperature(s,liquid,time=s.time){return 20+s.power[liquid]*time/(s.mass[liquid]/1000*heat[liquid]);}
 function sample(s,time){return{time,...Object.fromEntries(['water','oil'].map(k=>[k,s.probe[k]==='liquid'?temperature(s,k,time):null]))};}
 function prepare(s){if(s.prepared)return false;s.prepared=true;return true;}
 function connect(s){if(!s.prepared||s.time)return false;s.connected=true;s.samples=[sample(s,0)];return true;}
 function start(s){if(!s.prepared||!s.connected||s.time>=300)return false;s.running=true;return true;}
 function pause(s){s.running=false;}
 function advance(s,seconds){if(!s.running||!Number.isFinite(seconds)||seconds<=0)return false;const end=Math.min(300,s.time+seconds);for(let t=Math.floor(s.time)+1;t<=end;t++)s.samples.push(sample(s,t));s.time=end;if(end===300)s.running=false;return true;}
 function valid(s){return s.connected&&s.probe.water==='liquid'&&s.probe.oil==='liquid';}
 function fair(s){return valid(s)&&s.mass.water===s.mass.oil&&s.power.water===s.power.oil;}
 const api={heat,create,configure,place,temperature,sample,prepare,connect,start,pause,advance,valid,fair};if(typeof module!=='undefined')module.exports=api;else root.scienceLiquidHeat=api;
})(typeof window==='undefined'?globalThis:window);
