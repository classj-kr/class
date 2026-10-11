(function(root){
 'use strict';const R=8.314462618,Kw=1e-14;
 // Concentrations in mol/L. Solve charge balance, including water, even after buffer exhaustion.
 function solvePH(charge){let lo=-1,hi=15;for(let i=0;i<100;i++){const p=(lo+hi)/2,h=10**(-p);if(charge(h)>0)lo=p;else hi=p;}return(lo+hi)/2;}
 function buffer(well,drops){
  const buffered='DEF'.includes(well),acid='BE'.includes(well),base='CF'.includes(well),count=acid||base?Number(drops):0,V=.01+count*.00005,ka=10**(-7.21);
  const total=buffered?.001/V:0,initialBase=buffered?.001*ka/(ka+1e-7):0,Na=(initialBase+(base?count*.00005:0))/V,Cl=acid?count*.00005/V:0;
  return solvePH(h=>h+Na-Cl-Kw/h-total*ka/(ka+h));
 }
 function salt(name,C=.1){
  if(name==='NaCl')return 7;
  if(name==='NH4Cl'){const ka=Kw/1.8e-5;return solvePH(h=>h+C*h/(ka+h)-C-Kw/h);}
  const ka=6.2e-10;return solvePH(h=>h+C-Kw/h-C*ka/(ka+h));
 }
 function gas(sample,head=0){
  const molar={A:32,B:44,C:58}[sample],n=.01,T=298.15,air=101.3,vapor=3.17,p=air-vapor-Number(head)*.0980665,mass=n*molar,volume=n*R*T/p;
  return {before:150,after:150-mass,mass,volume,pressure:p,air,vapor,T,molar:mass*R*T/(p*volume)};
 }
 function sugar(m,mode,t){
  const mass=Number(m)*.5*342,bound=mode==='heat'?100+.512*m:-1.86*m,rate=(mode==='heat'?.4:.2)*500/(500+mass),onset=Math.abs(bound-20)/rate;
  let temperature=mode==='heat'?Math.min(bound,20+rate*t):Math.max(bound,20-rate*t);
  const transformed=t>onset?Math.min(.25,(t-onset)*.001):0;
  if(transformed)temperature=mode==='heat'?100+.512*m/(1-transformed):-1.86*m/(1-transformed);
  return {mass,bound,temperature,onset,phase:t<onset?'liquid':mode==='heat'?'boiling':'freezing',transformed};
 }
 function hess(kind){const dh={dissolve:-44.5,neutralize:-57.3,direct:-101.8}[kind],mass=kind==='dissolve'?104:204,q=-dh*.1,delta=q*1000/(mass*4.2);return {dh,q,mass,delta,temperature:25+delta};}
 function beans(mode,t){
  const f=Math.max(0,Math.min(500,t))/500;
  if(mode==='sensors')return {dry:{co2:400+18*f,temperature:25+.025*f},germinating:{co2:400+900*f,temperature:25+.9*(1-Math.exp(-2*f))}};
  if(mode==='respirometer')return {water:0,koh:f,dry:.02*f};
  return {living:25+2*(1-Math.exp(-2*f)),boiled:25};
 }
 const api={R,solvePH,buffer,salt,gas,sugar,hess,beans};if(typeof module!=='undefined')module.exports=api;else root.scienceChemistry=api;
})(typeof window==='undefined'?globalThis:window);
