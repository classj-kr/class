const {edit,replace:r,cut,replaceQuiz:q,apply,lab}=require('./science-scope-patch.cjs');
const touch=slug=>edit(lab+slug+'/index.html',s=>cut(s,/app\.js\?v=(\d+)/,(_,n)=>`app.js?v=${+n+1}`));
edit(lab+'density-buoyancy/index.html',s=>{
 s=s.replaceAll('기준: 50 mL에서 100 kPa · 온도 일정 · 기체 입자 수 일정','기준 부피 50 mL · 온도 일정 · 기체 입자 수 일정').replaceAll('뜰 때 잠긴 부피의 비율은 두 밀도의 비와 같습니다.','');
 s=cut(s,/<p><strong>보일 법칙<\/strong>.*?<\/p>/,'<p><strong>압력과 부피</strong> 온도와 기체의 양이 일정할 때 부피가 줄면 압력이 커집니다. 좁은 공간에서 입자가 벽에 충돌하는 횟수가 많아지기 때문입니다.</p>');
 s=q(s,2,['밀도가 0.8 g/cm³인 균일한 물체를 물(1.0 g/cm³)에 넣으면?', ['가라앉는다.','일부가 물 위로 뜬다.','반드시 물에 녹는다.','질량이 없어진다.'],'b','이 모형에서는 물체의 밀도가 물보다 작으므로 일부가 물 위로 뜹니다.']);
 s=q(s,4,['온도와 기체의 양을 일정하게 하고 부피를 줄이면 압력은?', ['작아진다.','항상 같다.','커진다.','반드시 0이 된다.'],'c','기체 입자가 더 좁은 공간에서 벽에 더 자주 충돌하므로 압력이 커집니다.']);return s;
});
edit(lab+'density-buoyancy/app.js',s=>{
 s=cut(s,/        \/\/ where each fluid's float\/sink boundary[\s\S]*?(?=        stageBadge.textContent)/,`        graphGroup.innerHTML = '<text x="20" y="50" fill="#334155" font-size="16">물체와 액체의 밀도를 비교하세요.</text><text x="20" y="90" fill="#334155" font-size="16">물체의 밀도가 더 작으면 뜹니다.</text>';
        dataNote.innerHTML = '<p>질량 ' + mass() + ' g ÷ 부피 ' + vol() + ' cm³ = 밀도 ' + b.rhoObj.toFixed(3) + ' g/cm³</p><p>액체의 밀도: ' + b.rhoFl.toFixed(2) + ' g/cm³</p>';
`);
 s=r(s,'${p.toFixed(0)} kPa</text>','${v < V0 ? "기준보다 높은 압력" : "기준 압력"}</text>');
 s=cut(s,/        const pMax = 550;[\s\S]*?(?=        gasVolOutput.textContent)/,`        graphGroup.innerHTML = '<text x="20" y="50" fill="#334155" font-size="16">온도와 기체의 양을 일정하게 합니다.</text><text x="20" y="90" fill="#334155" font-size="16">부피 감소 → 압력 증가</text><text x="20" y="130" fill="#334155" font-size="16">부피 증가 → 압력 감소</text>';
        dataNote.innerHTML = '<p>부피: ' + v + ' mL</p><p>입자 수는 그대로입니다. 부피를 줄이면 벽과의 충돌이 잦아집니다.</p>';
        stageBadge.textContent = v + ' mL · ' + (v < V0 ? '기준보다 높은 압력' : '기준 압력');
`);
 s=r(s,"labelB.textContent = b.state === 'float' ? '잠긴 정도' : '결과';","labelB.textContent = '결과';");
 s=r(s,"valueB.textContent = b.state === 'float' ? `${(b.frac * 100).toFixed(0)} %`","valueB.textContent = b.state === 'float' ? '뜸'");
 s=cut(s,/            explanation.textContent = b.state === 'float'[\s\S]*?;\n/,`            explanation.textContent = b.state === 'float' ? '물체의 밀도가 액체보다 작아 뜹니다.' : b.state === 'neutral' ? '물체와 액체의 밀도가 같아 액체 속에 머무릅니다.' : '물체의 밀도가 액체보다 커서 가라앉습니다.';
`);
 s=r(s,"labelB.textContent = '압력 × 부피';","labelB.textContent = '기체의 양';");
 s=r(s,'valueA.textContent = `${p.toFixed(0)} kPa`;','valueA.textContent = v < V0 ? "기준보다 높음" : "기준과 같음";');
 s=r(s,'valueB.textContent = `${(p * v).toFixed(0)}`;','valueB.textContent = "일정";');
 s=r(s,"predictionResult.textContent = '부피를 줄이면 압력이 그만큼 커집니다.';","predictionResult.textContent = '부피를 줄이면 압력이 커집니다.';");
 s=cut(s,/            explanation.textContent = `온도가 일정하면 P V가.*?;/,'            explanation.textContent = "온도와 기체의 양이 일정할 때, 부피를 줄이면 입자가 벽에 더 자주 충돌하므로 압력이 커집니다.";');return s;
});touch('density-buoyancy');
edit(lab+'motion-energy/index.html',s=>{
 s=cut(s,/<p><strong>등가속도 운동<\/strong>.*?<\/p>/,'<p><strong>속력이 증가하는 운동</strong> 수레가 빗면을 내려올 때 같은 시간 간격으로 기록한 점 사이가 점점 벌어집니다. 속력–시간 그래프에서는 속력이 커지는 모습을 확인합니다.</p>');
 s=q(s,1,['빗면을 내려오는 수레를 같은 시간 간격으로 찍었더니 점 사이가 점점 벌어졌습니다. 알 수 있는 것은?', ['속력이 감소한다.','멈춰 있다.','속력이 증가한다.','질량이 증가한다.'],'c','같은 시간 동안 이동한 거리가 길어지므로 속력이 증가한 것입니다.']);return s;
});
edit(lab+'motion-energy/app.js',s=>{
 s=cut(s,/, hint: `가속도 \$\{\(G \* Math.sin\(d \* Math.PI \/ 180\)\).toFixed\(2\)\} m\/s²`/);
 s=cut(s,/        out \+= `<text class="part-label" x="380" y="40">가속도.*?;\n/);
 s=cut(s,/        out \+= `<text class="note-text" x="\$\{gx\(a.tRamp \/ 2\).*?;\n/);
 s=s.replaceAll('등가속도 운동','속력이 증가하는 운동');
 s=cut(s,/            return `<div class="data-row"><span class="data-name">가속도[\s\S]*?;\n/,`            return '<p>같은 시간 간격의 점 사이: ' + (gaps.length >= 2 ? gapText(gaps) : '기록 간격을 줄여 비교하세요') + '</p><p>빗면에서는 속력이 증가하고, 마찰 없는 평평한 곳에서는 속력이 일정합니다.</p>';
`);
 s=cut(s,/            const gapSentence = gaps.length >= 2[\s\S]*?(?=            return;)/,`            explanation.textContent = '같은 시간 간격의 점 사이가 벌어지면 속력이 증가한 것입니다. 마찰 없는 평평한 곳에서는 운동 방향의 알짜힘이 없어 속력이 일정하고 점 사이 거리도 같습니다.';
`);return s;
});touch('motion-energy');
edit(lab+'gravity-motion/index.html',s=>{
 s=cut(s,/<button[^>]*data-mode="orbit"[^>]*>[\s\S]*?<\/button>/);
 s=cut(s,/<p><strong>뉴턴의 대포알과 인공위성<\/strong>.*?<\/p>/,'<p><strong>달의 운동</strong> 달은 지구의 중력을 받아 운동 방향이 계속 바뀌면서 지구 주위를 공전합니다.</p>');
 s=s.replaceAll('두 공 떨어뜨리기, 뉴턴의 대포알, 달걀 떨어뜨리기 가운데 하나를 고릅니다.','두 공 떨어뜨리기와 달걀 떨어뜨리기 가운데 하나를 고릅니다.').replaceAll('높이·속력·방향, 던지는 속력, 바닥의 종류를 정합니다.','높이·속력·방향과 바닥의 종류를 정합니다.').replaceAll('어느 공이 먼저 닿을지, 대포알이 어디까지 갈지, 달걀이 받는 힘이 무게의 몇 배일지 예상합니다.','어느 공이 먼저 닿을지, 어느 바닥에서 평균 충격력이 작은지 예상합니다.').replaceAll('시작해서 공과 대포알의 길, 달걀이 받는 힘을 확인합니다.','시작해서 공의 길과 달걀이 받는 힘을 확인합니다.');
 s=cut(s,/content="같은 높이에서 놓은 공과 던진 공이 언제 땅에 닿는지 견주고,[^"]*"/,'content="자유 낙하와 수평으로 던진 물체의 운동을 비교하고 충격 시간과 평균 힘의 관계를 확인하는 통합과학 모형"');
 s=q(s,2,['지구 주위를 공전하는 달에 대한 설명으로 옳은 것은?', ['중력을 전혀 받지 않는다.','지구의 중력을 받아 운동 방향이 계속 바뀐다.','중력은 달을 멈춰 세우기만 한다.','달은 스스로 빛을 내서 돈다.'],'b','달은 지구의 중력을 받으며 운동 방향이 계속 바뀌어 공전합니다.']);
 s=s.replaceAll('어떤 바닥에 떨어져도 같습니다.','같은 조건에서 튀어 오르지 않고 정지하면 같습니다.').replaceAll('힘은 작아집니다.','평균 힘은 작아집니다.');return s;
});touch('gravity-motion');
edit(lab+'recrystallise/index.html',s=>{
 s=s.replaceAll('용해도 곡선의 세로 간격이 그대로 석출량입니다.','물 100 g의 포화 용액을 식힐 때, 용해도 곡선의 세로 간격이 석출량(g)입니다.').replaceAll('녹인 온도와 식힌 온도의 용해도 차이에 물의 양을 곱하면 나옵니다. 용해도 곡선의 세로 간격이 곧 석출량입니다.','처음 포화 용액에서 석출량(g)은 용해도 차이 × 물의 질량(g) ÷ 100입니다. 물이 증발하지 않는다고 가정합니다.').replaceAll('불순물은 원래 양이 적습니다. 식혀도 그 온도의 용해도보다 적으면','불순물의 양이 적고, 식힌 온도에서도 불순물의 용해도보다 적으면');
 s=q(s,4,['처음과 나중 온도가 같은 두 실험에서 각각 포화 용액을 만듭니다. 물의 질량을 2배로 하면 석출량은? (물의 증발 없음)', ['변하지 않는다.','절반이다.','2배이다.','반드시 0이다.'],'c','같은 용해도 차이에서 석출량은 물의 질량에 비례하므로 2배입니다. 이 사실만으로 불순물의 양이나 결정 순도까지 판단할 수는 없습니다.']);return s;
});
edit(lab+'cell-osmosis/index.html',s=>{
 s=q(s,1,['이 모형에서 양파 표피 세포에는 있고 적혈구에는 없는 구조는?', ['세포막','세포벽','물','세포질'],'b','양파 표피 세포에는 세포벽이 있으나 적혈구에는 없습니다. 양파 비늘잎의 표피에는 보통 엽록체가 없고, 성숙한 사람 적혈구에는 핵이 없으므로 모든 식물·동물 세포를 똑같이 설명하면 안 됩니다.']);
 s=s.replaceAll('물은 농도가 낮은 쪽에서 높은 쪽으로 세포막을 통해 이동합니다.','이 모형에서는 막을 통과하지 못하는 용질의 농도가 낮은 쪽에서 높은 쪽으로 물이 순이동합니다.');return s;
});
apply();
