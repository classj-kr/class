(function(root){'use strict';
 // Constant inertial velocity from the centre, transformed into the paper frame.
 // r_paper(t) = R(-omega*t) r_lab(t); no invented transverse contact force.
 const duration=4,radius=1;
 const trials=[{id:'still',label:'정지',omega:0},{id:'ccw-slow',label:'반시계 · 느리게',omega:Math.PI/24},{id:'ccw-fast',label:'반시계 · 빠르게',omega:Math.PI/12},{id:'cw-slow',label:'시계 · 느리게',omega:-Math.PI/24},{id:'cw-fast',label:'시계 · 빠르게',omega:-Math.PI/12}];
 const rotate=(p,a)=>({x:p.x*Math.cos(a)-p.y*Math.sin(a),y:p.x*Math.sin(a)+p.y*Math.cos(a)});
 function position(id,time){const trial=trials.find(t=>t.id===id);if(!trial||!Number.isFinite(time))throw Error('Invalid trial');const t=Math.min(duration,Math.max(0,time)),lab={x:0,y:radius*t/duration},angle=trial.omega*t;return{lab,paper:rotate(lab,-angle),angle,time:t};}
 function path(id,time,frame='paper'){const t=position(id,time).time;return Array.from({length:81},(_,i)=>position(id,t*i/80)[frame]);}
 const create=()=>({trial:'still',time:0,running:false,prepared:false,results:{}});
 function select(s,id){if(!trials.some(t=>t.id===id))return false;s.trial=id;s.time=0;s.running=false;s.prepared=false;return true;}
 function prepare(s){if(s.running)return false;s.prepared=true;s.time=0;return true;}
 function play(s){if(!s.prepared||s.time>=duration)return false;s.running=!s.running;return true;}
 function advance(s,seconds){if(!s.prepared||!Number.isFinite(seconds)||seconds<=0)return false;s.time=Math.min(duration,s.time+seconds);if(s.time===duration){s.running=false;s.results[s.trial]={trial:s.trial,...position(s.trial,duration)};}return true;}
 const api={duration,radius,trials,rotate,position,path,create,select,prepare,play,advance};if(typeof module!=='undefined')module.exports=api;else root.RotatingDiscModel=api;
})(typeof window==='undefined'?globalThis:window);
