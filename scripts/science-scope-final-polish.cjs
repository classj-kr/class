const {edit,replace:r,cut,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'geologic-time/app.js',s=>{
 s=cut(s,/^        now: \{ label: '지금 \(인류 시대\)'[^\n]*\n/m,'');
 return s.replaceAll('선캄브리아 시대에는 세균 같은 작은 생물뿐이었습니다.','선캄브리아 시대에는 오랫동안 미생물이 주를 이루었지만 후기에 다세포 생물도 나타났습니다.');
});
edit(lab+'supplement-labs.js',s=>s.replaceAll("label('열 이동 →',230,265)","line(185,180,280,180,'#64748b',6)+label(after?'충분한 시간 뒤 같은 온도':'접촉하여 열이 이동',230,265)").replaceAll('빛 이외의 조건은 같게 합니다.','물·이산화 탄소를 충분히 공급하고 빛 이외의 조건은 같게 합니다.'));
edit(lab+'supplement-extra.js',s=>{
 s=r(s,"['leaf','잎에서 나가는 물']","['leaf','잎에서 나가는 물'],['starch','잎에서 만들어진 양분']");
 s=r(s,"   const after=s.stage==='after';if(s.kind==='stem')",`   const after=s.stage==='after';if(s.kind==='starch')return{svg:'<ellipse cx="140" cy="150" rx="70" ry="100" fill="'+(after?'#293e68':'#82ac69')+'"/><ellipse cx="330" cy="150" rx="70" ry="100" fill="'+(after?'#b9a47b':'#82ac69')+'"/>'+label('빛을 받은 잎',140,35)+label('빛을 가린 잎',330,35),text:after?'준비된 잎에 아이오딘 용액을 떨어뜨리면 빛을 받은 잎에서 청람색 반응이 나타납니다. 잎에서 녹말이 만들어졌음을 알아봅니다.':'남아 있던 녹말을 없앤 식물에서 빛을 받은 잎과 가린 잎을 비교합니다. 물 등 빛 이외의 조건은 같게 합니다.',note:'교사가 안전하게 전처리한 잎의 반응을 비교하는 모형이며, 실제 관찰이나 실험 절차 전체를 대신하지 않습니다. 알코올을 직접 가열하지 않습니다. 잎에서 만들어진 양분은 다른 기관으로 옮겨져 쓰이거나 저장됩니다.'};if(s.kind==='stem')`);
 return s;
});
apply();
