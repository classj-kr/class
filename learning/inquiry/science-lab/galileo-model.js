(function(root){'use strict';
 const G=9.8,L=.4,create=()=>({massA:20,massB:80,angle:5,shapeB:'solid',delay:0,time:0});
 const inertia=(s,id)=>id==='B'&&s.shapeB==='hollow'?2/3:2/5;
 const acceleration=(s,id)=>G*Math.sin(s.angle*Math.PI/180)/(1+inertia(s,id));
 const arrival=(s,id)=>Math.sqrt(2*L/acceleration(s,id))+(id==='B'?s.delay:0);
 const end=s=>Math.max(arrival(s,'A'),arrival(s,'B'));
 function sample(s,id,t=s.time){const elapsed=Math.max(0,t-(id==='B'?s.delay:0)),a=acceleration(s,id),travel=Math.min(Math.sqrt(2*L/a),elapsed);return{position:.5*a*travel*travel,speed:a*travel,arrived:t>=arrival(s,id)-1e-9,started:elapsed>0,mass:s['mass'+id],elapsed:travel};}
 function configure(s,key,value){const options={massA:[20,40,80],massB:[20,40,80],angle:[5,10,15],shapeB:['solid','hollow'],delay:[0,.1,.2]};if(!options[key]?.includes(value))return false;s[key]=value;s.time=0;return true;}
 function seek(s,t){if(!Number.isFinite(t))return false;s.time=Math.max(0,Math.min(end(s),t));return true;}
 const comparison=s=>s.shapeB!=='solid'?'structure':s.delay?'release':s.massA===s.massB?'same':'mass';
 const api={G,L,create,inertia,acceleration,arrival,end,sample,configure,seek,comparison};if(typeof module!=='undefined')module.exports=api;else root.GalileoModel=api;
})(typeof window==='undefined'?globalThis:window);
