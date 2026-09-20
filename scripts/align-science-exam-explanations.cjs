const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit('tests/science-exam-corrections.test.cjs',s=>s.replaceAll('[6]','[5]').replace('/酸素|산소/','/산소/'));
edit(lab+'weather-watch/index.html',s=>{
 s=replace(s,'<strong>기온이 가장 높은 때는 낮 12시가 아닙니다</strong> 해는 12시에 가장 높이 뜨지만, 그 뒤로도 한동안 들어오는 햇빛이 나가는 열보다 많습니다. 그래서 기온은 오후 2시쯤에 가장 높고, 가장 낮은 때는 밤새 식은 끝인 해 뜨기 직전입니다.','<strong>태양 고도와 최고 기온은 구별합니다</strong> 이 모형의 맑은 날에는 태양이 가장 높아진 뒤에도 지표가 더 데워져 오후에 최고 기온이 나타납니다. 실제 최고·최저 기온의 시각은 구름·바람 등 날씨에 따라 달라지므로 관측 자료로 확인합니다.');
 s=replace(s,'땅은 빨리 데워지고 빨리 식지만 바다는 아주 천천히 바뀝니다. 바람의 방향이 하루에 두 번 뒤집히는 것은 이 차이 때문입니다.','다른 큰 바람이 약한 이 해륙풍 모형에서는 땅과 바다의 온도 변화 차이로 낮과 밤의 바람 방향이 달라집니다.');
 s=replace(s,'<strong>바닷바람과 뭍바람</strong> 낮에는','<strong>바닷바람과 뭍바람</strong> 다른 큰 바람이 약한 조건에서 낮에는');return s;
});
edit(lab+'force-motion/app.js',s=>replace(s,'움직이던 물체는 같은 속력으로 움직입니다.','움직이던 물체는 같은 속력과 방향으로 움직입니다.'));
edit(lab+'body-systems/app.js',s=>{
 s=replace(s,'mg/분을 걸렀다가 모두 되찾습니다','mg/분을 거른 뒤 재흡수합니다 (정상 조건 모형)');
 s=replace(s,'mg/분을 모두 되찾아 오줌으로는 내보내지 않습니다.','mg/분을 재흡수하는 정상 조건 모형입니다. 실제 재흡수량은 혈당 등 조건에 따라 달라집니다.');return s;
});
edit(lab+'earth-system/app.js',s=>{
 s=replace(s,"lines: ['화산이 터져 화산재와', '이산화 황이 하늘을 덮고', '햇빛을 가려 몇 해 동안', '기온이 내려감']", "lines: ['성층권의 이산화황에서', '황산염 에어로졸이 생성됨', '햇빛 일부를 반사하여', '일시적 냉각에 기여함']");
 s=replace(s,'const t = p * tau * 1.1;                       // the dyed water is gone a little before the end\n        const dyed = clamp(1 - t / tau, 0, 1);','const t = p * tau; // One mean residence time, not complete replacement.\n        const dyed = Math.exp(-t / tau); // Constant-volume, completely mixed illustrative reservoir.');
 s=replace(s,"${p === 0 ? '처음 물 100 %' : dyed > 0 ? `처음 물 ${Math.round(dyed * 100)} %` : '모두 새 물'}",'처음 물 ${Math.round(dyed * 100)} %');
 s=replace(s,"지난 시간 ${fmtTime(Math.min(t, tau))}${t >= tau ? ' — 다 바뀜' : ''}",'지난 시간 ${fmtTime(t)}');
 s=replace(s,'${r.label}의 물은 ${fmtTime(tau)} 만에 모두 바뀜','${r.label} 평균 체류 시간 ${fmtTime(tau)}');
 s=replace(s,"labelB.textContent = '모두 바뀌는 데'","labelB.textContent = '평균 체류 시간'");
 s=replace(s,'화살표 숫자는 한 해에 옮겨 가는 물 (천 km³) · 나가는 양 = 들어오는 양이어서 각 곳의 물은 거의 일정','물 흐름: 천 km³/년 · 탱크는 완전 혼합 예시 · 평균 체류 시간 뒤에도 처음 물이 남음');
 s=replace(s,'체류 시간은 평균적 추정치입니다.</p>','체류 시간은 평균적 추정치입니다. 탱크는 유입·유출량이 같고 물이 완전히 섞이는 예시로, 평균 체류 시간이 지나도 처음 물의 약 37%가 남습니다. 실제 저장소의 혼합과 이동 경로는 다릅니다.</p>');
 s=replace(s,'양이 적고 드나듦이 많아 아주 빨리 바뀝니다. 그래서 공기 속 물에 섞인 오염 물질은 곧 비로 씻겨 내립니다.','양에 비해 드나듦이 많아 평균 체류 시간이 짧습니다. 오염 물질이 제거되는 정도는 물질의 성질과 다른 과정에도 영향을 받습니다.');return s;
});
edit('docs/science-lab-audit-2026-09-20/exam-readiness.md',s=>replace(s,'## 검증 방법과 경계','문항과 연결된 기존 안내도 함께 맞췄다. 날씨 시각을 고정된 법칙으로 단정하지 않고, 힘의 평형에서는 방향도 일정함을 명시했다. 물 순환 탱크는 평균 체류 시간을 완전 교체 시간으로 표현하던 오류를 수정하여 완전 혼합 예시에서는 처음 물의 약 37%가 남게 했다. 평균 체류 시간의 해석은 [USGS 물 수지 자료](https://water.usgs.gov/watercensus/AdHocComm/Background/WaterBudgets-FoundationsforEffectiveWater-ResourcesandEnvironmentalManagement.pdf)와 대조했다.\n\n## 검증 방법과 경계'));
apply();
