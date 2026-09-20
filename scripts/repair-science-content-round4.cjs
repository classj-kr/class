const {edit,replace,cut,lab,apply}=require('./science-scope-patch.cjs');
edit(lab+'state-change/state-visual.css',s=>s+`\n/* Tablet sidebar: keep whole Korean choice words and spread scale labels. */
.prediction-buttons.three { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.prediction-buttons button { word-break: keep-all; }
#phaseControls .range-scale { display: flex; justify-content: space-between; gap: 10px; }
#phaseControls .range-scale span { flex: 0 1 auto; word-break: keep-all; }
`);
edit(lab+'state-change/app.js',s=>{
 s=replace(s,'x="${gx((T1 + T2) / 2).toFixed(1)}" y="${(gy(0) - 15).toFixed(1)}" text-anchor="middle">얼음이 녹는 동안','x="${gx(T1).toFixed(1)}" y="${(gy(0) - 30).toFixed(1)}" text-anchor="start">얼음이 녹는 동안');
 s=cut(s,/        const flip = px > \(G.x0 \+ G.x1\) \/ 2;\n        out \+= `<text class="op-text"[\s\S]*?지금 \$\{temp\}℃<\/text>`;/,'        // The selected temperature is already shown in the adjacent readout; no overlapping SVG label.');
 return s;
});
edit(lab+'state-change/index.html',s=>replace(s,'state-visual.css?v=10','state-visual.css?v=11'));
edit(lab+'gravity-motion/app.js',s=>{
 s=replace(s,'const p = EGG_M * v, F = p / dt, W = EGG_M * G;','const p = EGG_M * v, W = EGG_M * G, netF = p / dt, F = netF + W;');
 s=replace(s,'// equals h / d','// Contact force includes weight: F/W = h/d + 1.');
 s=replace(s,'return { h, d, v, dt, p, F, W, ratio,','return { h, d, v, dt, p, F, netF, W, ratio,');
 s=replace(s,'멈출 때 힘 × 시간(충격량)은 어느 바닥이든 같음','멈출 때 알짜힘 × 시간은 같음 · 바닥의 힘에서 중력을 빼서 계산');
 s=replace(s,'네 바닥 모두 충격량(힘 × 시간)은','네 바닥 모두 알짜힘의 충격량은');
 s=replace(s,'충격량 ${fmt2(a.p)} N·s ÷ 시간 = 평균','운동량 변화 ${fmt2(a.p)} N·s ÷ 시간 + 무게 = 바닥의 평균 힘');
 s=replace(s,'배 = 높이 ÷ 들어간 깊이)','배 = 높이 ÷ 들어간 깊이 + 1)');
 s=replace(s,'멈출 때의 충격량(힘 × 시간)은 운동량 변화와 같아','멈출 때 알짜힘의 충격량은 운동량 변화와 같아');
 s=replace(s,'멈추는 시간이 ${dts} ms이니 평균 힘은 ${Fs} N','멈추는 시간이 ${dts} ms이니 바닥의 평균 힘은 운동량 변화 ÷ 시간에 무게를 더한 ${Fs} N');
 s=replace(s,'이 배수는 떨어진 높이를 들어간 깊이로 나눈 값과 같습니다.','이 배수는 떨어진 높이를 들어간 깊이로 나눈 값에 1을 더한 값입니다.');
 s=replace(s,'멈추는 시간이 ${Math.round(soft.dt / hard.dt)}배 길어지면 힘은 그만큼 작아집니다.','멈추는 시간이 길어질수록 받는 힘이 줄어듭니다.');
 s=replace(s,'껍데기가 견디는 약 ${BREAK_N} N을 넘어 깨졌습니다.','이 모형에서 가정한 파손 기준 ${BREAK_N} N을 넘어 깨짐으로 표시했습니다.');
 s=replace(s,'${BREAK_N} N보다 작아 깨지지 않았습니다.','이 모형의 파손 기준 ${BREAK_N} N 이하라 깨지지 않음으로 표시했습니다. 실제 달걀은 껍데기·방향·접촉 면적 등에 따라 다릅니다.');
 return s;
});
apply();
