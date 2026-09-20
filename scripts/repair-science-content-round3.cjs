const {edit,replace,lab,apply}=require('./science-scope-patch.cjs');
edit(lab+'recrystallise/app.js',s=>{
 s=replace(s,'const hi = Math.max(T1, T2), lo = Math.min(T1, T2);','const hi = T1, lo = T2; // Preserve the selected start and finish; heating is not cooling.');
 s=replace(s,"const verdict = impOut < 1e-9 ? 'pure' : purity >= 90 ? 'slight' : 'dirty';","const verdict = crystals < 1e-9 ? 'none' : impOut < 1e-9 ? 'pure' : purity >= 90 ? 'slight' : 'dirty';");
 s=replace(s,'const i = a.T2 >= T - 1e-9 ? a.impOut : 0;','const i = a.impOut; // Constant-solubility impurity: any excess was already undissolved at the start.');
 s=replace(s,"const VERDICT = { pure: '결정은 100% 순수합니다'","const VERDICT = { none: '주성분 결정이 나오지 않습니다', pure: '모형에서 불순물 없는 결정'");
 s=replace(s,"const SHORT = { pure: '완전히 순수'","const SHORT = { none: '결정 없음', pure: '불순물 없음'");
 s=replace(s,'valueB.textContent = a.totalOut > 0 ?', 'valueB.textContent = a.crystals > 0 ?');
 s=replace(s,"${a.totalOut > 0 ? `${a.crystals.toFixed(1)} ÷ ${a.totalOut.toFixed(1)} = ${a.purity.toFixed(1)}%` : '결정이 나오지 않았습니다'}","${a.crystals > 0 ? `${a.crystals.toFixed(1)} ÷ ${a.totalOut.toFixed(1)} = ${a.purity.toFixed(1)}%` : '주성분 결정 없음 — 순도 비교 대상 없음'}");
 s=replace(s,'s += `${a.T2} ℃로 식히면 ${a.canHold.toFixed(1)} g 만 녹아 있을 수 있으므로 차이인 ${a.crystals.toFixed(1)} g이 결정으로 나옵니다. `;',`if (a.verdict === 'none') {
            explanation.textContent = s + a.T2 + ' ℃에서는 ' + a.canHold.toFixed(1) + ' g까지 녹을 수 있어 새 주성분 결정은 나오지 않습니다. 온도를 그대로 두거나 높이는 것은 냉각 재결정이 아닙니다.' + (a.impOut > 0 ? ' 바닥의 불순물 ' + a.impOut.toFixed(1) + ' g은 처음부터 녹지 않은 것으로, 새로 생긴 주성분 결정이 아닙니다.' : '');
            return;
        }
        s += \`${'${a.T2}'} ℃로 식히면 ${'${a.canHold.toFixed(1)}'} g까지 녹을 수 있으므로 차이인 ${'${a.crystals.toFixed(1)}'} g이 결정으로 나옵니다. \`;`);
 s=replace(s,'그래서 걸러 낸 결정은 100% 순수합니다. 이것이 재결정으로 물질을 정제하는 원리입니다.','이상화한 모형에서는 주성분 결정만 얻습니다. 실제 결정의 순도는 씻기·거르기 등의 조건에도 영향을 받습니다.');
 s=replace(s,'${a.impOut.toFixed(1)} g이 함께 석출됩니다.','${a.impOut.toFixed(1)} g은 처음부터 녹지 않고 남아 있습니다. 이를 미리 거르지 않고 마지막 고체를 함께 모은 조건입니다.');
 return s;
});
edit(lab+'recrystallise/index.html',s=>{
 s=replace(s,'<button type="button" data-prediction="pure">완전히 순수</button>','<button type="button" data-prediction="pure">불순물 없음</button>\n                        <button type="button" data-prediction="none">주성분 결정 없음</button>');
 s=replace(s,'얻은 결정은 얼마나 순수할까요?','주성분 결정과 불순물은 어떻게 될까요?');
 s=replace(s,'석출량과 결정의 순도를 확인합니다.','석출량을 확인하고, 결정이 생겼을 때 순도를 비교합니다.');
 return s;
});
edit(lab+'body-systems/app.js',s=>{
 s=replace(s,'const feO2 = AIR_O2 - d.vo2 / (va * 1000);','const feO2 = AIR_O2 - d.vo2 / (ve * 1000);');
 s=replace(s,'// what is left in the breath we let out','// Mixed expired air; illustrative equal inspired/expired volume approximation.');
 s=replace(s,'피가 온몸을 한 바퀴 도는 데 ${fmt(a.circTime, 0)} 초 · 내쉰 숨의 산소 ${fmt(a.feO2 * 100, 1)} % — 심장과 폐는 실제 빠르기입니다','표시된 호흡·심장 박동은 예시 자료이며 모든 사람의 측정값이 아닙니다');
 s=replace(s,'내쉰 숨의 산소 ${fmt(a.feO2 * 100, 1)} %</span></div>','내쉰 숨의 산소 약 ${fmt(a.feO2 * 100, 1)} % (들숨·날숨 부피를 같게 둔 근사)</span></div>');
 s=replace(s,'숨을 아주 많이 쉬어서 내쉰 숨의 산소가 오히려','이 예시의 환기량을 적용하면 내쉰 숨의 산소 비율은');
 return s;
});
edit(lab+'nutrient-detection/app.js',s=>{
 s=replace(s,"target: 'protein', color: '#8b5cf6'","target: 'protein', color: '#38bdf8'");
 s=replace(s,'물 시험관에서는 붉은 알갱이가 가라앉을 뿐입니다.','지방층이 붉게 물드는지 대조군과 비교합니다. 시약 자체의 붉은색만으로 양성이라고 판단하지 않습니다.');
 return s;
});
edit(lab+'nutrient-detection/index.html',s=>replace(s,'물에는 녹지 않아 물 시험관에서는 붉은 알갱이가 가라앉을 뿐 색이 변하지 않습니다.','지방층이 붉게 물드는지 대조군과 비교해야 합니다. 시약 자체의 붉은색만으로 지방이 검출되었다고 판단하지 않습니다.'));
edit(lab+'living-things/app.js',s=>replace(s,'${eun(BEINGS[state.being].name)} ${HABITATS[state.habitat].label}에서 어떨까요?','${BEINGS[state.being].name}의 대표 서식지와 ${HABITATS[state.habitat].label}을 비교하면?'));
apply();
