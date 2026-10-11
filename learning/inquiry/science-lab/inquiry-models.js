/* Pure models for source-reviewed inquiry experiments. */
(function(root){
 'use strict';
 const clamp=(n,a,b)=>Math.min(b,Math.max(a,Number(n)));
 const complement=s=>s.replace(/[ATGC]/g,c=>({A:'T',T:'A',G:'C',C:'G'})[c]);
 const materials={cotton:{name:'솜',k:.04},paper:{name:'종이',k:.10},sand:{name:'마른 모래',k:.30}};
 function insulation({initial=70,room=20,minutes=0,thickness=2,volume=50}={}){
  // Illustrative dry-material conductivities (not measured specimen data).
  return Object.entries(materials).map(([id,m])=>{
   const conductance=m.k*.012/(clamp(thickness,.5,5)/100)+.04;
   const temperature=room+(initial-room)*Math.exp(-conductance*clamp(minutes,0,60)*60/(clamp(volume,10,100)*4.18));
   return {id,name:m.name,k:m.k,temperature,conductance};
  });
 }
 function doppler({frequency=440,speed=10,direction='toward',time=0}={}){
  const c=343,u=clamp(speed,0,40)*(direction==='toward'?1:direction==='away'?-1:0),f=clamp(frequency,200,1000);
  return {source:f,observed:f*c/(c-u),wavelength:(c-u)/f,period:(c-u)/(c*f),velocity:u,time};
 }
 function acceleration({motion='circle',speed=4,radius=4,time=0}={}){
  const v=clamp(speed,1,8),r=clamp(radius,2,12),t=clamp(time,0,12),g=9.8;
  if(motion==='circle'){
   const angle=v/r*t,ax=-v*v/r*Math.cos(angle),ay=-v*v/r*Math.sin(angle);
   return {x:r*Math.cos(angle),y:r*Math.sin(angle),vx:-v*Math.sin(angle),vy:v*Math.cos(angle),ax,ay,az:0,a:v*v/r,sensor:Math.hypot(g,v*v/r),speed:v};
  }
  if(motion==='elevator'){
   const a=v/2,az=t<2?a:t<10?0:t<12?-a:0;
   const height=t<2?.5*a*t*t:t<10?v*(t-1):9*v+v*(t-10)-.5*a*(t-10)**2;
   return {x:0,y:height,vx:0,vy:t<2?a*t:t<10?v:Math.max(0,v-a*(t-10)),ax:0,ay:0,az,a:Math.abs(az),sensor:Math.abs(g+az),speed:t<2?a*t:t<10?v:Math.max(0,v-a*(t-10))};
  }
  return {x:v*t,y:0,vx:v,vy:0,ax:0,ay:0,az:0,a:0,sensor:g,speed:v};
 }
 function dnaStart(){return {template:'TACGGAACCTTG',fork:0,leading:Array(12).fill(null),lagging:Array(12).fill(null),primed:[],replaced:false,joined:false,message:'복제분기점을 열어 주형 가닥을 드러내세요.'};}
 function dnaAction(old,action,base){
  const s=JSON.parse(JSON.stringify(old));
  const done=()=>s.fork===12&&s.leading.every(Boolean)&&s.lagging.every(Boolean);
  if(action==='open'){
   if(s.fork===12)s.message='모든 주형이 드러났습니다.';
   else if(s.leading.slice(0,s.fork).some(x=>!x)||s.lagging.slice(0,s.fork).some(x=>!x))s.message='지금 열린 구간의 두 가닥 합성을 먼저 마치세요.';
   else {s.fork+=4;s.message='네 염기쌍이 더 열렸습니다. 새 조각이 시작될 곳에 프라이머가 필요합니다.';}
  }else if(action==='prime'){
   const part=s.fork/4-1;
   if(part<0)s.message='주형 가닥을 먼저 드러내세요.';
   else if(s.primed.includes(part))s.message='이 구간에는 프라이머가 놓여 있습니다.';
   else {
    if(!part)for(const i of [0,1])s.leading[i]={base:complement(s.template[i]).replace('T','U'),rna:true};
    for(const i of [s.fork-1,s.fork-2])s.lagging[i]={base:s.template[i].replace('T','U'),rna:true};
    s.primed.push(part);s.message='보라색은 RNA 프라이머입니다. 새 DNA는 프라이머의 3′ 끝에서 자랍니다.';
   }
  }else if(['leading','lagging'].includes(action)){
   const part=s.fork/4-1;
   if(!s.primed.includes(part)){s.message='새 가닥을 시작할 프라이머가 필요합니다.';return s;}
   const indices=Array.from({length:s.fork},(_,i)=>i);if(action==='lagging')indices.reverse();
   const i=indices.find(i=>!s[action][i]);
   if(i===undefined){s.message='이 가닥은 열린 구간까지 합성되었습니다.';return s;}
   const expected=action==='leading'?complement(s.template[i]):s.template[i];
   if(base!==expected){s.message='주형과 상보적인 염기가 아닙니다. A–T, G–C 짝을 확인하세요.';return s;}
   s[action][i]={base,rna:false};s.message=(action==='leading'?'선도':'지연')+' 가닥의 3′ 끝에 '+base+'가 붙었습니다. 합성 방향은 5′→3′입니다.';
  }else if(action==='replace'){
   if(!done())s.message='두 가닥을 끝까지 합성한 다음 프라이머를 제거·치환하세요.';
   else {for(const name of ['leading','lagging'])for(const x of s[name]){x.rna=false;x.base=x.base.replace('U','T');}s.replaced=true;s.message='RNA 프라이머가 DNA로 바뀌었습니다. 조각 사이의 끊긴 연결은 남아 있습니다.';}
  }else if(action==='join'){
   if(!s.replaced)s.message='프라이머 제거·DNA 치환을 먼저 마쳐야 합니다.';
   else {s.joined=true;s.message='각 딸 DNA는 부모 가닥 하나와 새 가닥 하나로 이루어졌습니다.';}
  }
  return s;
 }
 const aaNames={F:'페닐알라닌',L:'류신',S:'세린',Y:'타이로신','*':'종결',C:'시스테인',W:'트립토판',P:'프롤린',H:'히스티딘',Q:'글루타민',R:'아르지닌',I:'아이소류신',M:'메싸이오닌',T:'트레오닌',N:'아스파라진',K:'라이신',V:'발린',A:'알라닌',D:'아스파트산',E:'글루탐산',G:'글라이신'};
 const aa='FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
 const codons={};let ci=0;for(const a of 'UCAG')for(const b of 'UCAG')for(const c of 'UCAG')codons[a+b+c]=aa[ci++];
 function translate(rna,steps=Infinity,{cellFree=false}={}){
  const seq=String(rna).toUpperCase().replace(/\s/g,'');
  if(!seq||seq.length>90||!/^[AUCG]+$/.test(seq))return {error:'A, U, G, C로 이루어진 1~90개의 염기를 입력하세요.'};
  const start=cellFree?0:seq.indexOf('AUG');
  if(start<0)return {seq,start,protein:[],reads:[],stopped:false,message:'개시코돈 AUG가 없어 번역이 시작되지 않았습니다.'};
  const reads=[],protein=[];let stopped=false;
  for(let i=start;i+2<seq.length&&reads.length<steps;i+=3){const triplet=seq.slice(i,i+3),amino=codons[triplet];reads.push({index:i,codon:triplet,amino,name:aaNames[amino]});if(amino==='*'){stopped=true;break;}protein.push(amino);}
  return {seq,start,reads,protein,stopped,template:complement(seq.replaceAll('U','T')),message:stopped?'종결코돈에 도달하여 폴리펩타이드가 방출됩니다.':reads.length?'다음 코돈으로 이동하며 사슬을 늘립니다.':'개시코돈에서 번역을 시작할 준비가 되었습니다.'};
 }
 function cross(mother='Rr',father='RY'){
  const children=[];for(const m of mother)for(const f of father){const male=f==='Y';const genes=male?m+'Y':[m,f].sort().join('');children.push({genes,male,affected:male?m==='r':genes==='rr',carrier:!male&&genes==='Rr'});}
  return {children,affected:children.filter(c=>c.affected).length/4,sonsAffected:children.filter(c=>c.male&&c.affected).length/2,daughtersAffected:children.filter(c=>!c.male&&c.affected).length/2};
 }
 const family=[{id:'I-1',sex:'M',affected:false,answer:'RY'}, {id:'I-2',sex:'F',affected:false,answer:'Rr'},
  {id:'II-1',sex:'M',affected:true,parents:['I-1','I-2'],answer:'rY'}, {id:'II-2',sex:'F',affected:false,parents:['I-1','I-2'],answer:'Rr'},
  {id:'II-3',sex:'M',affected:true,answer:'rY'}, {id:'III-1',sex:'F',affected:true,parents:['II-2','II-3'],answer:'rr'}, {id:'III-2',sex:'M',affected:false,parents:['II-2','II-3'],answer:'RY'}];
 function pedigreeCheck(answers){
  return family.map(p=>({id:p.id,ok:answers[p.id]===p.answer,reason:!answers[p.id]?'유전자형을 아직 선택하지 않았습니다.':p.sex==='M'?'남자의 X는 어머니에게서, Y는 아버지에게서 옵니다.':p.id==='I-2'?'형질이 나타난 아들의 X와 이 사람의 표현형을 함께 보세요.':p.id==='II-2'?'형질이 나타난 딸은 부모 양쪽에서 r을 하나씩 받아야 합니다.':'표현형과 부모에게 받을 수 있는 대립유전자를 함께 보세요.'}));
 }
 function chromosome(kind){const n=kind==='X'?9:kind==='Y'?23:Number(kind);return {kind,length:92-n*2.45,centromere:kind==='X'?.43:kind==='Y'?.27:[.46,.35,.25,.40][n%4],bands:[.12+(n%3)*.025,.30+(n%4)*.022,.60+(n%5)*.025,.87]};}
 function karyotypeStart(sample='XX'){
  const kinds=[...Array.from({length:22},(_,i)=>String(i+1)),sample==='XY'?'Y':'X'];
  if(sample==='trisomy')kinds.push('21');
  // Labels are assigned after shuffling: they must not reveal chromosome numbers.
  const shuffled=kinds.map((kind,i)=>({kind,order:(i*13+7)%29})).sort((a,b)=>a.order-b.order);
  const cards=shuffled.map(({kind},i)=>({id:'c'+i,kind,...chromosome(kind)}));
  return {sample,cards,slots:Object.fromEntries([...Array.from({length:22},(_,i)=>String(i+1)),'X'].map(k=>[k,[]]))};
 }
 function placeChromosome(old,id,slot){
  const s=JSON.parse(JSON.stringify(old));if(!s.cards.some(c=>c.id===id)||!(slot in s.slots))throw Error('Unknown chromosome or slot');
  for(const k of Object.keys(s.slots))s.slots[k]=s.slots[k].filter(c=>c!==id);
  s.slots[slot].push(id);return s;
 }
 function karyotypeCheck(s){
  const misplaced=[];for(const [slot,ids]of Object.entries(s.slots))for(const id of ids){const c=s.cards.find(c=>c.id===id);if((c.kind==='Y'?'X':c.kind)!==slot)misplaced.push(id);}
  const placed=Object.values(s.slots).flat().length;
  return {total:23+s.cards.length,placed,misplaced,complete:placed===s.cards.length&&!misplaced.length,autosomes:44+(s.sample==='trisomy'?1:0),sex:s.sample==='XY'?'XY':'XX'};
 }
 const discPositions=[[0,-65],[62,-20],[40,53],[-40,53],[-62,-20]];
 function antibiotic({time=0,dose=1,spacing='apart',sampleSet=0}={}){
  // Anonymous, explicitly simulated extracts; no claim about any real food's efficacy.
  const widths=[[0,2,5,3,7],[0,3,4,4,6],[0,2.5,4.5,3.5,6.5]][clamp(sampleSet,0,2)];
  const observed=time>=24;
  const discs=widths.map((w,i)=>({label:i?'추출액 '+String.fromCharCode(64+i):'증류수',width:observed?w*Math.sqrt(clamp(dose,.5,2)):0,x:discPositions[i][0]*(spacing==='close'?.45:1),y:discPositions[i][1]*(spacing==='close'?.45:1)}));
  // Scene scale: 3 pixels/mm; disk radius is 3 mm. Overlap is geometric.
  const overlap=observed&&discs.some((d,i)=>discs.slice(i+1).some(e=>Math.hypot(d.x-e.x,d.y-e.y)<(6+d.width+e.width)*3));
  return {observed,overlap,discs};
 }
 function waterWave({length=40,depth=10,amplitude=.03,time=0,z=0,x=0}={}){
  const L=clamp(length,5,200),h=clamp(depth,1,100),a=clamp(amplitude,.01,.05),k=2*Math.PI/L,w=Math.sqrt(9.81*k*Math.tanh(k*h)),level=clamp(z,-h,0),phase=k*x-w*time;
  const rx=a*Math.cosh(k*(level+h))/Math.sinh(k*h),ry=a*Math.sinh(k*(level+h))/Math.sinh(k*h);
  return {L,h,a,k,w,speed:w/k,period:2*Math.PI/w,ratio:h/L,type:h/L>.5?'심해파':h/L<.05?'천해파':'전이파',rx,ry,dx:-rx*Math.sin(phase),dy:ry*Math.cos(phase),surface:a*Math.cos(phase)};
 }
 function silverStart(sample='glucose'){return {sample,stage:0,turns:0,message:'질산 은 수용액부터 넣으세요.'};}
 function silverAction(old,action){
  const s={...old};const expected=['silver','ammonia','ammonia','sample','base','roll'][Math.min(s.stage,5)];
  if(action!==expected){s.message=['질산 은 수용액이 필요합니다.','암모니아수를 더하며 변화를 관찰하세요.','앙금이 없어질 때까지 암모니아수를 조금 더 넣는 단계입니다.','가상 시료를 넣으세요.','염기성 조건을 준비하세요.','바이알을 굴려 벽의 변화를 관찰하세요.'][Math.min(s.stage,5)];return s;}
  if(action==='roll'){s.turns=Math.min(4,s.turns+1);s.message=s.sample==='glucose'?'바이알 벽에 은이 석출되어 붙습니다. 포도당은 산화되고 은 이온은 환원됩니다.':'물 대조군에서는 같은 조건에서 은거울이 관찰되지 않습니다.';}
  else{s.stage++;s.message=['','질산 은 수용액을 넣었습니다.','갈색 산화 은 앙금이 나타났습니다.','앙금이 녹아 은 암모니아 착이온을 포함한 용액이 되었습니다.','시료를 넣었습니다.','염기성 조건을 준비했습니다.'][s.stage];}
  return s;
 }
 function nylonStart(){return {layers:false,film:0,pulled:0,broken:false,message:'서로 섞이지 않는 두 용액의 층을 만드세요.'};}
 function nylonAction(old,action,speed='steady'){
  const s={...old};if(action==='layer'){s.layers=true;s.film=1;s.message='위는 다이아민 수용액, 아래는 산 염화물의 유기 용액입니다. 경계에서 얇은 고분자 막이 생겼습니다.';}
  else if(!s.layers)s.message='두 용액의 층을 먼저 만드세요.';
  else if(action==='wait'){s.film=1;s.broken=false;s.message='경계로 단위체가 공급되어 막이 다시 생겼습니다.';}
  else if(action==='pull'){
   if(!s.film)s.message='경계에 막이 다시 생길 때까지 기다리세요.';
   else if(speed==='fast'){s.broken=true;s.film=0;s.message='이 모형에서는 공급보다 빨리 당겨 실이 끊어졌습니다. 경계에서 막을 다시 만든 뒤 속도를 낮추세요.';}
   else{s.pulled++;s.film=speed==='slow'?1:.5;s.broken=false;s.message='경계에서 생긴 나일론을 감아 올렸습니다. 새 경계에서 막이 이어서 생깁니다.';}
  }
  return s;
 }
 function condensation(chain){const units=chain.filter(x=>x==='amine'||x==='chloride');if(units.length!==chain.length||units.some((u,i)=>i&&u===units[i-1]))return {valid:false};return {valid:true,units:units.length,bonds:Math.max(0,units.length-1),hcl:Math.max(0,units.length-1),amineEnds:units.length?[units[0],units.at(-1)].filter(u=>u==='amine').length:0,chlorideEnds:units.length?[units[0],units.at(-1)].filter(u=>u==='chloride').length:0};}
 const api={materials,insulation,doppler,acceleration,complement,dnaStart,dnaAction,codons,aaNames,translate,cross,family,pedigreeCheck,chromosome,karyotypeStart,placeChromosome,karyotypeCheck,antibiotic,waterWave,silverStart,silverAction,nylonStart,nylonAction,condensation};
 if(typeof module!=='undefined')module.exports=api;else root.scienceInquiryModels=api;
})(typeof window==='undefined'?globalThis:window);
