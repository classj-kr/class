const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'supplement-core.js',s=>{
 s=replace(s,"svg+=label('산 부피 →',315,285)+label('혼합 뒤 온도',310,35);","for(const a of values)svg+=label(String(a),point(a)[0],258,'#173f50',11);for(const value of [20,24,28])svg+=label(String(value),176,234-(value-20)*22,'#173f50',11);svg+=label('산 부피 (mL) →',315,289)+label('혼합 뒤 온도 (℃)',310,35);");
 return replace(s,' return result;\n}',`
 add('density-buoyancy',{
  title:'순수한 물질의 녹는점·끓는점 비교',codes:['9과08-01'],initial:{kind:'melt',sample:'A',amount:'one',step:'before'},
  fields:[field('kind','가열 관찰',[['melt','녹는점 비교'],['boil','끓는점 비교']]),field('sample','가상 순수 물질',[['A','물질 A'],['B','물질 B']]),field('amount','같은 물질의 양',[['one','기준 양'],['two','두 배의 양']]),field('step','관찰 구간',[['before','상태 변화 전'],['during','상태 변화 중'],['after','상태 변화 후']])],
  view(s){const melt=s.kind==='melt',point=melt?(s.sample==='A'?20:40):(s.sample==='A'?80:100),stage={before:0,during:1,after:2}[s.step],temperature=point+[-20,0,20][stage];let svg=line(60,255,410,255)+line(60,255,60,35);const points=[[70,230],[170,155],[290,155],[395,60]];for(let i=0;i<3;i++)svg+=line(...points[i],...points[i+1],i===stage?'#d18b37':'#83abb5',5);svg+=label(point+' ℃',110,140)+label('가열 순서 →',280,290)+label('현재 '+temperature+' ℃',295,35);return{svg,text:s.step==='during'?'상태가 변하는 동안 온도가 '+point+' ℃로 일정한 구간이 나타납니다. 이 값은 모형 물질 '+s.sample+'의 '+(melt?'녹는점':'끓는점')+'입니다. 같은 압력에서 같은 순수 물질은 양이 달라도 이 온도가 같습니다.':s.step==='before'?'같은 압력에서 가상 순수 물질을 가열합니다. 물질 종류와 양을 바꿔 온도가 일정한 구간을 비교합니다.':'상태 변화가 끝나고 계속 가열하면 온도가 다시 올라갑니다. 물질 A와 B는 서로 다른 녹는점·끓는점을 가진 모형으로, 이런 특성을 물질 구별에 이용할 수 있습니다.',note:'A·B는 관찰 자료 해석용 가상 물질이며 실제 시약이나 측정 자료가 아닙니다. 온도는 설명용 설정값입니다. 양이 달라지면 필요한 열량·시간은 달라질 수 있어 가열 순서 축은 같은 실제 시간을 뜻하지 않습니다. 혼합물·압력 변화에는 그대로 적용하지 않습니다.',check:check('같은 압력에서 순수한 물질의 양만 늘리면 녹는점은?',['같다','항상 두 배가 된다','항상 0 ℃가 된다'],'0','녹는점·끓는점은 같은 조건에서 물질을 구별하는 특성입니다. 양에 따른 가열 시간과 구별합니다.')};}
 });
 return result;
}`);
});
const row='density-buoyancy|중2 순수한 가상 물질 A/B와 양을 바꾸어 녹는점·끓는점의 일정 구간 비교|같은 압력의 가상 자료. 실제 시약·가열 시간·측정값 아님';
for(const file of ['required-core-review.cjs','current-review.cjs'])edit('docs/science-lab-audit-2026-09-20/'+file,s=>{const lines=s.split('\n'),i=lines.findIndex(l=>l.startsWith('density-buoyancy|'));if(i>=0)lines[i]=row;else lines.splice(lines.length-2,0,row);return lines.join('\n');});
edit('tests/science-supplement-models.test.cjs',s=>replace(s,'Object.keys(specs).length,35','Object.keys(specs).length,36'));
edit('tests/science-required-core.test.cjs',s=>s.replaceAll('22 repaired','23 repaired').replace('Object.keys(specs).length,22','Object.keys(specs).length,23'));
edit('scripts/build-current-science-audit.cjs',s=>replace(s,'22개 앱 경로','23개 앱 경로').replace('기존 20개·신규 2개','기존 21개·신규 2개'));
apply();
