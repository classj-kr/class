(function(root){'use strict';
 const rows=[['alkaid','알카이드',-18.55,-9.40,24.19],['mizar','미자르',-13.63,-5.23,20.79],['alioth','알리오즈',-13.77,-3.31,20.96],['megrez','메그레즈',-13.40,-.90,20.71],['phecda','페크다',-15.09,.41,20.55],['merak','메라크',-13.10,3.40,20.36],['dubhe','두베',-17.31,4.34,33.21]];
 const stars=rows.map(([id,name,...position],i)=>({id,name,number:i+1,position})),edges=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]];
 const dot=(a,b)=>a.reduce((s,n,i)=>s+n*b[i],0),norm=a=>Math.hypot(...a),scale=(a,k)=>a.map(n=>n*k),sub=(a,b)=>a.map((n,i)=>n-b[i]),add=(a,b)=>a.map((n,i)=>n+b[i]),unit=a=>scale(a,1/norm(a)),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const forward=unit(stars.reduce((a,s)=>add(a,s.position),[0,0,0])),right=scale(unit(cross([0,0,1],forward)),-1),up=unit(cross(right,forward)),centre=[-10,0,17],clusterCentre=scale(stars.reduce((a,s)=>add(a,s.position),[0,0,0]),1/stars.length),D=Math.PI/180;
 function create(){return{points:stars.map(s=>[...s.position]),selected:0,view:'earth',focus:'stars',yaw:-35,pitch:15,equal:false,rays:true};}
 function apply(s,i,p){if(!Number.isInteger(i)||i<0||i>=stars.length||!Array.isArray(p)||p.length!==3||p.some(n=>!Number.isFinite(n)||Math.abs(n)>50)||norm(p)<.1)return false;s.points[i]=[...p];return true;}
 const point=(s,i)=>s.points[i]?(s.equal?scale(unit(s.points[i]),30):[...s.points[i]]):null;
 function basis(yaw,pitch){const c=Math.cos(yaw*D),t=Math.sin(yaw*D),cp=Math.cos(pitch*D),sp=Math.sin(pitch*D),r=add(scale(right,c),scale(forward,-t)),f=add(scale(forward,c),scale(right,t));return{right:r,up:add(scale(up,cp),scale(f,-sp)),forward:add(scale(f,cp),scale(up,sp))};}
 function project(p,s){if(s.view==='earth'){const z=dot(p,forward);return z>.1?{x:dot(p,right)/z,y:dot(p,up)/z,depth:z}:null;}const b=basis(s.yaw,s.pitch),v=sub(p,s.focus==='stars'?clusterCentre:centre);return{x:dot(v,b.right),y:dot(v,b.up),depth:dot(v,b.forward)};}
 const api={stars,edges,dot,norm,scale,sub,add,unit,cross,forward,right,up,centre,clusterCentre,create,apply,point,basis,project,distance:(a,b)=>norm(sub(a,b))};if(typeof module!=='undefined')module.exports=api;else root.ConstellationSpace=api;
})(typeof window==='undefined'?globalThis:window);
