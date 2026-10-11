/* Ideal apparatus models. Outputs are simulated, never device measurements. */
(function(root){
 'use strict';
 const base=typeof module==='undefined'?root.scienceInquiryModels:require('./inquiry-models.js');
 const g=9.8,rad=Math.PI/180,limit=(v,a,b)=>Math.min(b,Math.max(a,Number(v)));
 let cache=null;
 function advance(s,h,L){
  const f=([q,w])=>[w,-g/L*Math.sin(q)],a=f(s),b=f(s.map((v,i)=>v+h*a[i]/2)),c=f(s.map((v,i)=>v+h*b[i]/2)),d=f(s.map((v,i)=>v+h*c[i]));
  return s.map((v,i)=>v+h*(a[i]+2*b[i]+2*c[i]+d[i])/6);
 }
 function pendulum(t,L,A){
  const key=L+':'+A,dt=1/240;
  if(cache?.key!==key){const states=[[A,0]];for(let i=0;i<2880;i++)states.push(advance(states.at(-1),dt,L));cache={key,states};}
  const i=Math.min(2880,Math.floor(t/dt));return advance(cache.states[i],t-i*dt,L);
 }
 function model(options={}){
  const {motion='circle',axis='x',sensorMode='raw'}=options;
  const t=limit(options.time??0,0,12),L=limit(options.length??3,1,5),A=limit(options.angle??30,5,60)*rad;
  const position=limit(options.position??1.5,0,2),period=limit(options.period??4,2,6),mount=limit(options.mount??0,-180,180)*rad;
  let x=0,z=0,vx=0,vz=0,ax=0,az=0,ay=0,bodyAngle=0,theta=0,omega=0,duration=12,r;
  if(motion==='swing'){
   [theta,omega]=pendulum(t,L,A);const alpha=-g/L*Math.sin(theta);
   x=L*Math.sin(theta);z=-L*Math.cos(theta);vx=L*omega*Math.cos(theta);vz=L*omega*Math.sin(theta);
   ax=L*(alpha*Math.cos(theta)-omega*omega*Math.sin(theta));az=L*(alpha*Math.sin(theta)+omega*omega*Math.cos(theta));
   bodyAngle=theta; // x follows the tangent; z points toward the pivot.
  }else if(motion==='seesaw'){
   const w=2*Math.PI/period;theta=A*Math.cos(w*t);omega=-A*w*Math.sin(w*t);const alpha=-w*w*theta;
   x=position*Math.cos(theta);z=position*Math.sin(theta);vx=-position*omega*Math.sin(theta);vz=position*omega*Math.cos(theta);
   ax=-position*(alpha*Math.sin(theta)+omega*omega*Math.cos(theta));az=position*(alpha*Math.cos(theta)-omega*omega*Math.sin(theta));bodyAngle=theta;
  }else if(motion==='slide'){
   const incline=limit(options.slope??30,10,45)*rad,a=g*Math.sin(incline),track=6;
   duration=Math.sqrt(2*track/a);const elapsed=Math.min(t,duration),d=.5*a*elapsed*elapsed,v=a*elapsed;
   x=d*Math.cos(incline);z=-d*Math.sin(incline);vx=v*Math.cos(incline);vz=-v*Math.sin(incline);ax=a*Math.cos(incline);az=-a*Math.sin(incline);bodyAngle=-incline;
  }else{
   r=base.acceleration(options);x=r.x;z=motion==='elevator'?r.y:0;vx=r.vx;vz=motion==='elevator'?r.vy:0;ax=r.ax;az=r.az;ay=r.ay;
  }
  const angle=bodyAngle+mount,c=Math.cos(angle),s=Math.sin(angle);
  const project=(a,b)=>({x:a*c+b*s,z:-a*s+b*c,y:ay});
  const linear=project(ax,az),raw=project(ax,az+g),values=sensorMode==='raw'?raw:linear;
  const magnitude=v=>Math.hypot(v.x,v.y,v.z),reading=axis==='magnitude'?magnitude(values):values[axis];
  return{motion,time:Math.min(t,duration),duration,x,z,y:r?.y||0,vx,vz,ax,ay,az,theta,omega,bodyAngle,deviceAngle:angle,length:L,position,linear,raw,reading,
   acceleration:Math.hypot(ax,ay,az),sensor:magnitude(raw),speed:r?.speed??Math.hypot(vx,vz),atEnd:t>=duration};
 }
 function samples(options={},end=12,interval=.1){
  const duration=model(options).duration,stop=Math.min(limit(end,0,12),duration),step=limit(interval,.05,1),rows=[];
  for(let i=0;i*step<=stop+1e-9;i++)rows.push(model({...options,time:Math.min(i*step,stop)}));
  return rows;
 }
 const api={model,samples};if(typeof module!=='undefined')module.exports=api;else root.scienceRideModels=api;
})(typeof window==='undefined'?globalThis:window);
