(function(root){'use strict';
 const create=()=>({wavelength:532,separation:.2,distance:1,slit:false,alignment:'both',power:false,span:20,left:0,right:5.3,intervals:2});
 const spacing=s=>s.wavelength*1e-6*s.distance*1000/s.separation;
 const sinc=x=>Math.abs(x)<1e-10?1:Math.sin(x)/x;
 function intensity(s,x){if(!s.power)return 0;if(!s.slit)return Math.exp(-x*x/(2*.8*.8));if(s.alignment==='blocked')return 0;
  const theta=x/(s.distance*1000),beta=Math.PI*.02*theta/(s.wavelength*1e-6),envelope=sinc(beta)**2;
  return envelope*(s.alignment==='one'?.25:Math.cos(Math.PI*x/spacing(s))**2);
 }
 function configure(s,key,v){const enums={wavelength:[532,650],separation:[.1,.2,.3],distance:[.5,1,1.5,2],span:[10,20,40],alignment:['both','one','blocked'],intervals:[1,2,3,4,5]};
  if(enums[key]){if(!enums[key].includes(v))return false;}else if(['power','slit'].includes(key)){if(typeof v!=='boolean')return false;}else if(['left','right'].includes(key)){if(!Number.isFinite(v)||Math.abs(v)>s.span)return false;}else return false;
  s[key]=v;if(['wavelength','separation','distance','alignment','slit'].includes(key))s.power=false;if(key==='span'){s.left=Math.max(-v,Math.min(v,s.left));s.right=Math.max(-v,Math.min(v,s.right));}return true;
 }
 function measure(s){if(!s.power||!s.slit||s.alignment!=='both')return{valid:false,reason:'setup'};const d=spacing(s),a=s.left/d,b=s.right/d;
  if(Math.abs(s.right-s.left)<.1)return{valid:false,reason:'same'};
  if(Math.abs(a-Math.round(a))>.07||Math.abs(b-Math.round(b))>.07||intensity(s,s.left)<.025||intensity(s,s.right)<.025)return{valid:false,reason:'positions'};
  const n=Math.abs(Math.round(b)-Math.round(a));if(s.intervals!==n)return{valid:false,reason:'intervals',actual:n};
  return{valid:true,spacing:Math.abs(s.right-s.left)/n,theoretical:d,intervals:n};
 }
 const api={create,configure,spacing,intensity,measure};if(typeof module!=='undefined')module.exports=api;else root.LightInterferenceModel=api;
})(typeof window==='undefined'?globalThis:window);
