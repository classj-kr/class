(function(root){
 'use strict';
 const data={
  concentration:{rows:[{id:'a',stock:1,water:1.5,before:.02,after:.01,seconds:47},{id:'b',stock:1.5,water:1,before:.03,after:.015,seconds:28},{id:'c',stock:2,water:.5,before:.04,after:.02,seconds:21},{id:'d',stock:2.5,water:0,before:.05,after:.025,seconds:15}],reagent:2.5,limit:50},
  temperature:{rows:[{id:'a',temperature:4,seconds:36},{id:'b',temperature:25,seconds:24},{id:'c',temperature:65,seconds:6}],stock:2,reagent:2,limit:40}
 };
 function row(mode,index){return data[mode]?.rows[index]||null;}
 function snapshot(mode,time){if(!data[mode])throw Error('Unknown comparison');const t=Math.max(0,Math.min(data[mode].limit,Number.isFinite(+time)?+time:0));return{mode,time:t,rows:data[mode].rows.map(r=>({...r,changed:t>=r.seconds,clock:Math.min(t,r.seconds),reciprocal:1/r.seconds})),complete:data[mode].rows.every(r=>t>=r.seconds)};}
 function dilution(stock,water,reagent=2.5){const v=+stock,w=+water,z=+reagent;if(![v,w,z].every(Number.isFinite)||v<=0||w<0||z<0)throw Error('Invalid volume');return{before:.05*v/(v+w),after:.05*v/(v+w+z),volume:v+w+z};}
 const api={data,row,snapshot,dilution};if(typeof module!=='undefined')module.exports=api;else root.IodineClockModel=api;
})(typeof window==='undefined'?globalThis:window);
