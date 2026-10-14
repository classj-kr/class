/* Equimolar strong acid/base model at 25 C; indicator colour is qualitative. */
(function(root){
 const concentration=.05,Kw=1e-14;
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const rgb=h=>h.match(/[a-f\d]{2}/gi).map(v=>parseInt(v,16));
 const blend=(a,b,f)=>'#'+rgb(a).map((v,i)=>Math.round(v+(rgb(b)[i]-v)*f).toString(16).padStart(2,'0')).join('');
 function colour(pH,mode,indicator){
  if(!indicator)return {hex:'#e6f1f3',name:'무색'};
  if(mode==='phenol'){const f=clamp((pH-8.2)/1.8,0,1);return {hex:blend('#e6f1f3','#cf387b',f),name:f===0?'무색':f<.35?'옅은 붉은색':'붉은색'};}
  const stops=[[1,'#c74465'],[4,'#b15989'],[6,'#7960a8'],[7,'#6866a6'],[8,'#4d78b4'],[10,'#289386'],[12,'#b5ae3c'],[13,'#c3b541']];
  const hi=stops.findIndex(s=>s[0]>=pH),i=hi<0?stops.length-1:Math.max(1,hi),a=stops[i-1],b=stops[i];
  return {hex:blend(a[1],b[1],clamp((pH-a[0])/(b[0]-a[0]),0,1)),name:pH<3?'붉은색':pH<6?'붉은 보라색':pH<7.5?'보라색':pH<9?'푸른색':pH<11?'초록색':'노란색'};
 }
 function solve({mode='cabbage',start='acid',titrant='opposite',volume=0,indicator=false}={}){
  const initial=mode==='phenol'?2:20,max=mode==='phenol'?5:30,added=clamp(Number(volume)||0,0,max),sign=start==='acid'?1:-1,total=initial+added;
  const acid=concentration*((start==='acid'?initial:0)+(titrant==='opposite'&&start==='base'?added:0))/1000;
  const base=concentration*((start==='base'?initial:0)+(titrant==='opposite'&&start==='acid'?added:0))/1000;
  const delta=(acid-base)/(total/1000),radical=Math.sqrt(delta*delta+4*Kw),h=delta>=0?(delta+radical)/2:2*Kw/(radical-delta),pH=-Math.log10(h);
  return {mode,start,titrant,indicator,initial,max,added,total,acidMoles:acid,baseMoles:base,waterMolesFormed:Math.min(acid,base),h,oh:Kw/h,pH,...colour(pH,mode,indicator)};
 }
 const api={solve,colour,concentration,Kw};if(typeof module!=='undefined')module.exports=api;else root.AcidMixingModel=api;
})(typeof window==='undefined'?globalThis:window);
