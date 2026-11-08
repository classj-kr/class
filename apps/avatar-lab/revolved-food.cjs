"use strict";
// A full rotational volume, with radius and height measured from the original
// food silhouette. The face follows this continuous surface across its layers.
module.exports=function revolvedFood(THREE,k,id,parent,offset){
 const source=require('./rotational-profiles.json')[id];if(!source)return null;
 const rows=[...source].reverse(),P=[],I=[],colors=[],n=64;
 const colorAt=py=>id==='food-hamburger'?(py<225?'#e5a656':py<245?'#b94b2c':py<267?'#8b9f44':py<285?'#efc851':py<350?'#77472d':'#e3a159'):id==='food-macaron'?(py<235?'#eb9db6':py<255?'#cb748e':py<294?'#f8cad7':'#e794af'):(py>462&&py<511?'#ed98ad':py>388&&py<465?'#f7cfdb':py>286&&py<319?'#ec9eb0':py<270?'#fff0ed':'#f7d592');
 const levels=[[rows[0][0]+1,320,320],...rows,[rows.at(-1)[0]-1,320,320]];
 for(const [py,left,right] of levels){const cx=((left+right)/2-320)*.005,r=(right-left)*.0025,c=new THREE.Color(colorAt(py)).convertSRGBToLinear();for(let i=0;i<n;i++){const a=i/n*Math.PI*2;P.push(cx+Math.cos(a)*r-offset.x,(580-py)*.005-offset.y,Math.sin(a)*r-offset.z);colors.push(c.r,c.g,c.b);}}
 for(let row=0;row<levels.length-1;row++)for(let i=0;i<n;i++){const a=row*n+i,b=row*n+(i+1)%n,c=a+n,d=b+n;I.push(a,c,d,a,d,b);}
 if(id==='food-birthday-cake')for(let i=0;i<P.length;i+=3){
  const x=P[i]+offset.x,y=P[i+1]+offset.y,z=P[i+2]+offset.z;
  if(z<=0)continue;
  const px=x/.005+320,py=580-y/.005,t=Math.sqrt(((px-320)/119)**2+((py-347)/97)**2);
  if(t>=1.35)continue;
  const fade=Math.max(0,Math.min(1,(1.35-t)/.29)),weight=fade*fade*(3-2*fade);
  // Sculpt the face opening into the same closed cake surface. Following the
  // upper/lower tier step through the cheeks kinked the face in side views.
  const front=.99-.075*(x/.70)**2;
  P[i+2]=z+(front-z)*weight-offset.z;
 }
 const geo=k.geometry(P,I);geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));const material=k.solid('FoodLayers','#ffffff');material.userData.preserveVertexColor=true;
 return k.mesh('ContinuousFoodBody',geo,material,parent);
};
