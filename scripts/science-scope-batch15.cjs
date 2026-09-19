const {edit,replace:r,cut,replaceQuiz:q,apply,lab}=require('./science-scope-patch.cjs');
const fn=(s,name,body)=>cut(s,new RegExp('    function '+name+'\\([^)]*\\) \\{[\\s\\S]*?^    \\}','m'),body);
edit(lab+'galaxy-hubble/index.html',s=>{
 s=cut(s,/<p><strong>적색 이동과 후퇴 속도<\/strong>.*?<\/p>/,'<p><strong>적색 이동과 후퇴 속도</strong> 스펙트럼 선의 상대적인 파장 변화 z = Δλ/λ₀를 비교합니다. 우주의 팽창에 의해 빛의 파장이 길어지는 우주론적 적색편이가 나타납니다. 작은 적색편이에서는 v ≈ cz를 사용할 수 있지만, 큰 우주론적 적색편이를 특수상대론의 도플러 식으로 바꾸어 실제 후퇴 속도라고 해석하지 않습니다. 먼 천체의 거리와 후퇴 속도에는 우주론 모형이 필요합니다.</p>');
 s=s.replaceAll('기울기 H₀는 오늘날 약 70 km/s/Mpc이고','이 모형의 비교 기준 H₀는 70 km/s/Mpc이고').replaceAll('d/v = 1/H₀가 은하들이 한 점에서 출발해 지금 자리까지 오는 데 걸린 시간입니다.','d/v = 1/H₀는 현재의 팽창률로 만든 시간 척도입니다. 은하들이 공간 속의 한 점에서 폭발해 퍼졌다는 뜻은 아니며 정확한 우주 나이는 팽창 역사를 고려해야 합니다.');return s;
});
edit(lab+'galaxy-hubble/app.js',s=>{
 s=fn(s,'redshiftModel',`    function redshiftModel() {
        const o=OBJECTS[state.object],z=o.z,track=LINES[o.kind].find(l=>l[2]);
        return {kind:'redshift',o,z,track,lines:LINES[o.kind],verdict:z<0.03?'slow':z<0.3?'mid':'fast'};
    }`);
 s=cut(s,/    const PRED_Z = .*?;/,`    const PRED_Z = [{value:'slow',label:'z < 0.03'},{value:'mid',label:'0.03 ≤ z < 0.3'},{value:'fast',label:'z ≥ 0.3'}];`);
 s=s.replaceAll('${OBJECTS[state.object].name}의 후퇴 속도는?','${OBJECTS[state.object].name}의 적색편이 z 범위는?');
 s=cut(s,/        const \[tn, tl\] = a.track, lamObs[\s\S]*?\n        return out;/,`        const [tn,tl]=a.track,lamObs=tl*(1+zNow),dl=lamObs-tl;
        out += '<text class="trait-text" x="20" y="176">'+tn+' '+tl+' nm → '+fmtN(lamObs,1)+' nm</text>';
        out += '<text class="trait-text" x="20" y="194">z = Δλ/λ₀ = '+fmtN(zNow,4)+'</text>';
        out += '<text class="note-text" x="20" y="210">큰 적색편이를 단순한 속도 공식으로 환산하지 않습니다.</text>';
        return out;`);
 s=fn(s,'graphRedshift',`    function graphRedshift(a) {
        let out='<text class="axis-title" x="30" y="25">같은 스펙트럼 선의 관측 파장 비교</text>';
        for(const [i,o]of Object.values(OBJECTS).entries()){
            const y=50+i*26,w=90*(1+o.z);out+='<rect x="130" y="'+y+'" width="'+w+'" height="14" fill="'+(o===a.o?'#d97706':'#b6c4d0')+'"/><text class="small-label" x="20" y="'+(y+11)+'">'+o.label+'</text><text class="small-label" x="'+(140+w)+'" y="'+(y+11)+'">λ₀의 '+(1+o.z).toFixed(3)+'배</text>';
        }return out;
    }`);
 s=cut(s,/        if \(a.kind === 'redshift'\) \{\n            const \[tn, tl\][\s\S]*?\n        \}/,`        if (a.kind === 'redshift') {
            const [tn,tl]=a.track;
            return '<p>'+a.o.name+': '+tn+' '+tl+' nm → '+fmtN(tl*(1+a.z),1)+' nm, z = '+a.z+'</p><p>스펙트럼 이동을 비교합니다. 우주론적 적색편이를 특수상대론 도플러 속도로 단순 변환하지 않습니다.</p>';
        }`);
 s=cut(s,/        \} else if \(a.kind === 'redshift'\) \{\n            const \[tn, tl\][\s\S]*?\n        \} else \{/,`        } else if (a.kind === 'redshift') {
            const [tn,tl]=a.track;labelA.textContent='적색편이';valueA.textContent='z = '+a.z;
            labelB.textContent='파장 비';valueB.textContent=(1+a.z).toFixed(3)+'배';
            s=tn+'의 실험실 파장 '+tl+' nm와 관측 파장 '+fmtN(tl*(1+a.z),1)+' nm를 비교합니다. 우주의 팽창은 빛의 파장을 늘립니다. 큰 적색편이에서 속도나 거리를 구하려면 우주론 모형을 고려해야 합니다.';
        } else {`);
 return s.replaceAll('오늘날 값 근처','모형 비교값 근처').replaceAll('오늘날 여러 방법으로 잰 값 67~73 km/s/Mpc','이 모형의 비교 구간 67~73 km/s/Mpc');
});
edit(lab+'geologic-time/index.html',s=>{
 s=s.replaceAll('처음 40억 년(선캄브리아 시대)에는 세균 같은 작은 생물뿐이었고','선캄브리아 시대에는 오랫동안 미생물이 주를 이루었으나 후기에 다세포 생물도 나타났고');
 s=cut(s,/<p><strong>여섯 번째 멸종\?<\/strong>.*?<\/p>/,'<p><strong>생물 다양성 보전</strong> 서식지 파괴, 남획, 외래종, 기후 변화 등은 생물 다양성을 위협합니다. 위기 종의 비율과 확인된 멸종 수는 조사 범위·기준 연도에 따라 달라지므로 이 앱에서는 출처 없는 현재 통계로 제시하지 않습니다. 보전의 필요성을 근거와 함께 설명합니다.</p>');
 return q(s,4,['생물 다양성을 위협하는 요인을 줄이는 행동은?', ['서식지를 보호하고 훼손을 줄인다.','모든 종을 무분별하게 포획한다.','외래 생물을 임의로 방생한다.','한 종만 남기고 모두 없앤다.'],'a','서식지 보호와 지속 가능한 이용은 생물 다양성 보전에 기여합니다.']);
});
edit(lab+'titration/index.html',s=>{
 s=s.replaceAll('산의 몰수와 염기의 몰수가 같아지는 지점입니다.','산과 염기가 반응식의 양적 비율에 맞게 반응한 지점입니다. 이 모형의 일양성자산과 일가 염기에서는 몰수가 같습니다.').replaceAll('강산과 강염기는 7이지만','25 ℃에서 강산과 강염기는 약 7이지만');
 return q(s,4,['약산과 강염기의 적정에서 당량점의 pH가 25 ℃에서 7보다 클 수 있는 까닭은?', ['당량점은 무조건 pH 7이어서 불가능하다.','생긴 염의 음이온이 물과 반응하여 OH⁻를 만들기 때문이다.','반응이 전혀 없기 때문이다.','지시약이 모든 염기를 없애기 때문이다.'],'b','당량점은 반응식의 양적 관계로 정합니다. 아세트산 이온의 가수 분해로 당량점의 용액이 염기성을 나타낼 수 있습니다.']);
});
edit(lab+'mole/index.html',s=>s.replaceAll('그 질량이 몰 질량(g)입니다','몰 질량의 단위는 g/mol입니다').replaceAll('1몰의 질량은 화학식량에 g을 붙인 값(몰 질량)입니다.','몰 질량은 질량을 물질량으로 나눈 값이며 보통 g/mol로 나타냅니다.').replaceAll('기체는 종류와 상관없이 0 ℃ 1기압에서 1몰이 22.4 L를 차지합니다.','이상 기체 모형에서 0 ℃, 1기압인 기체 1몰의 부피는 약 22.4 L입니다.').replaceAll('실험실의 시약, 병원의 수액, 음료의 당도가 모두 이 농도로 표시됩니다.','농도에는 여러 표시 방법이 있으며 몰 농도는 그중 하나입니다.'));
edit(lab+'redox/index.html',s=>s.replaceAll('두 금속의 표준 환원 전위 차이가 그대로 전지의 기전력입니다. 같은 금속끼리는 차이가 0이라 전류가 흐르지 않습니다.','표준 상태에서 두 반쪽 반응의 표준 환원 전위 차이로 표준 전지 전위를 구합니다. 이 모형은 같은 금속의 두 전극에 같은 조건을 적용하므로 전위 차가 0입니다. 농도 등이 다르면 같은 금속이어도 전위 차가 생길 수 있습니다.'));
edit(lab+'rock-age/index.html',s=>s.replaceAll('온도나 압력을 아무리 바꿔도 달라지지 않기 때문에','일반적인 지질학적 온도·압력 조건에서 거의 일정하기 때문에').replaceAll('모원소와 딸원소의 양이 같아졌다면 몇 번의 반감기가 지난 것일까요?','처음 딸원소가 없고 외부 출입이 없는 모형에서 모원소와 딸원소 양이 같다면?').replaceAll('그래서 젊은 것에는 ¹⁴C를','그래서 비교적 최근의 생물 유래 유기물에는 ¹⁴C를'));
edit(lab+'magma/index.html',s=>s.replaceAll('실제로 걸리는 시간은 아래 표에 적힌 값입니다.','아래 표의 시간은 크기·점성 등을 고정한 단순 모형의 계산값이며 실제 분출 시간을 예측하지 않습니다.'));
apply();
