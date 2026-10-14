(function(root){'use strict';
 const luminosity=(m,solar=4.74)=>10**(.4*(solar-m));
 function regress(points){if(points.length<3)return null;const n=points.length,x=points.reduce((a,p)=>a+p[0],0)/n,y=points.reduce((a,p)=>a+p[1],0)/n;const xx=points.reduce((a,p)=>a+(p[0]-x)**2,0);if(xx<1e-12)return null;const slope=points.reduce((a,p)=>a+(p[0]-x)*(p[1]-y),0)/xx,intercept=y-slope*x;return{slope,intercept,n,rms:Math.sqrt(points.reduce((a,p)=>a+(p[1]-intercept-slope*p[0])**2,0)/n)};}
 function interpolate(curve,x){if(x<curve[0][0]||x>curve.at(-1)[0])return null;for(let i=1;i<curve.length;i++)if(x<=curve[i][0]){const [a,b]=curve[i-1],[c,d]=curve[i];return b+(d-b)*(x-a)/(c-a);}return curve.at(-1)[1];}
 const distance=(modulus,extinction=0)=>10**((modulus-extinction+5)/5);
 function clusterResidual(points,curve,shift,excluded=[]){const values=points.flatMap(([c,m],i)=>{const ref=interpolate(curve,c);return ref===null||excluded.includes(i)?[]:[m-ref-shift]});return{count:values.length,rms:values.length?Math.sqrt(values.reduce((a,x)=>a+x*x,0)/values.length):null,offsets:values.map(v=>v+shift)};}
 function habitable(temperature=5772,radius=1,orbit=1){const light=radius**2*(temperature/5772)**4,inner=.95*Math.sqrt(light),outer=1.67*Math.sqrt(light);return{light,inner,outer,width:outer-inner,flux:light/orbit**2,location:orbit<inner?'inner':orbit>outer?'outer':'zone'};}
 function balance(masses,radius=.04){const x=(masses[0]-masses[2])*radius,y=(masses[1]-masses[3])*radius;return{moment:Math.hypot(x,y),balanced:Math.hypot(x,y)<1e-9,loaded:masses.some(v=>v>0)};}
 function sediment({rpm=600,seconds=0,masses=[1,0,1,0],sealed=false}={}){const b=balance(masses),omega=rpm*2*Math.PI/60,rcf=omega**2*.04/9.80665,allowed=b.balanced&&b.loaded&&sealed;
  const particles=[8,3,1].map((microns,k)=>{const coefficient=2*(microns*1e-6)**2*50/(9*.002);const radii=Array.from({length:18},(_,i)=>Math.min(.06,(.025+i*.03/17)*Math.exp(coefficient*omega**2*(allowed?seconds:0))));return{microns,radii,pelleted:radii.filter(r=>r>=.06).length};});return{...b,allowed,rcf,particles};}
 const valence={C:4,H:1,O:2};
 function moleculeStart(carbons=1){const atoms=[{id:0,element:'C',x:carbons===1?350:280,y:210}],bonds=[];let next=1;
  if(carbons===2){atoms.push({id:next++,element:'C',x:420,y:210});bonds.push([0,1,1]);}
  for(let c=0;c<carbons;c++){const a=atoms[c];for(const angle of carbons===1?[-90,0,90,180]:c===0?[-90,90,180]:[-90,0,90]){const rad=angle*Math.PI/180,id=next++;atoms.push({id,element:'H',x:a.x+90*Math.cos(rad),y:a.y+90*Math.sin(rad)});bonds.push([c,id,1]);}}
  return{atoms,bonds,next,selected:carbons-1,message:'원자를 선택하고 연결을 바꾸세요.'};
 }
 function bondCount(s,id){return s.bonds.reduce((n,b)=>n+(b[0]===id||b[1]===id?b[2]:0),0);}
 function moleculeEdit(s,action,value){const n=JSON.parse(JSON.stringify(s)),atom=n.atoms.find(a=>a.id===n.selected);if(!atom)return n;
  if(action==='remove'){if(atom.element!=='H'){n.message='이 활동에서는 수소 원자를 떼고 C–O 결합을 바꿉니다.';return n;}const parent=n.bonds.find(b=>b.includes(atom.id)&& (b[0]===atom.id||b[1]===atom.id));n.atoms=n.atoms.filter(a=>a.id!==atom.id);n.bonds=n.bonds.filter(b=>b[0]!==atom.id&&b[1]!==atom.id);n.selected=parent[0]===atom.id?parent[1]:parent[0];}
  if(action==='add'){if(bondCount(n,atom.id)>=valence[atom.element]){n.message=atom.element+'의 결합 수가 이미 가득 찼습니다. 수소를 먼저 떼세요.';return n;}if(!['H','O'].includes(value))return n;if(value==='O'&&n.atoms.filter(a=>a.element==='O').length>=2){n.message='이 활동에서는 산소 원자를 두 개까지 연결합니다.';return n;}let best=null;
   for(let i=0;i<24;i++){const angle=i*Math.PI/12,x=atom.x+85*Math.cos(angle),y=atom.y+85*Math.sin(angle);if(x<50||x>650||y<55||y>355)continue;const clearance=Math.min(...n.atoms.map(a=>Math.hypot(x-a.x,y-a.y)));if(!best||clearance>best.clearance)best={x,y,clearance};}
   const id=n.next++;n.atoms.push({id,element:value,x:best.x,y:best.y});n.bonds.push([atom.id,id,1]);n.selected=id;
  }
  if(action==='order'){const bond=n.bonds[+value];if(!bond)return n;const target=bond[2]===1?2:1;const both=bond.slice(0,2).map(id=>n.atoms.find(a=>a.id===id));if(!both.some(a=>a.element==='C')||!both.some(a=>a.element==='O')){n.message='이 활동에서는 C–O 결합만 단일·이중으로 바꿉니다.';return n;}if(both.some(a=>bondCount(n,a.id)+target-bond[2]>valence[a.element])){n.message='이중 결합을 만들 자리가 없습니다. C와 O에 붙은 수소를 먼저 떼세요.';return n;}bond[2]=target;}
  n.message='연결을 바꿨습니다. 각 원자의 결합 수와 구조를 확인하세요.';return n;
 }
 function moleculeInfo(s){const counts={C:0,H:0,O:0};for(const a of s.atoms)counts[a.element]++;const complete=s.atoms.every(a=>bondCount(s,a.id)===valence[a.element]);const neighbors=(id,el,order)=>s.bonds.filter(b=>(b[0]===id||b[1]===id)&&(!order||b[2]===order)).map(b=>s.atoms.find(a=>a.id===(b[0]===id?b[1]:b[0]))).filter(a=>!el||a.element===el);
  let kind='incomplete';if(complete){kind='other';for(const c of s.atoms.filter(a=>a.element==='C')){const double=neighbors(c.id,'O',2),oh=neighbors(c.id,'O',1).filter(o=>neighbors(o.id,'H').length);if(double.length&&oh.length){kind='acid';break;}if(double.length&&neighbors(c.id,'H').length)kind='aldehyde';else if(oh.length&&kind==='other')kind='alcohol';}if(counts.O===0)kind='alkane';}
  const expected={alcohol:[2*counts.C+2,1],aldehyde:[2*counts.C,1],acid:[2*counts.C,2]};if(expected[kind]&&(counts.H!==expected[kind][0]||counts.O!==expected[kind][1]))kind='other';
  const names={alkane:['메테인','에테인'],alcohol:['메탄올','에탄올'],aldehyde:['폼알데하이드','아세트알데하이드'],acid:['폼산','아세트산']};return{counts,complete,kind,name:names[kind]?.[counts.C-1]||(complete?'다른 구조':'조립 중'),formula:Object.entries(counts).filter(([,n])=>n).map(([e,n])=>e+(n===1?'':n)).join(''),missing:s.atoms.reduce((n,a)=>n+valence[a.element]-bondCount(s,a.id),0)};
 }
 const api={luminosity,regress,interpolate,distance,clusterResidual,habitable,balance,sediment,moleculeStart,moleculeEdit,moleculeInfo,bondCount};if(typeof module!=='undefined')module.exports=api;else root.scienceEvidenceModels=api;
})(typeof window==='undefined'?globalThis:window);
