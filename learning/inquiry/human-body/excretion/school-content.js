(function () {
    'use strict';
    const S = window.SchoolLevel;
    if (!S) return;
    // Elementary scope checked against the collected 2022 Science 5-1,
    // unit 4 textbook, pp. 96–97 (PDF 51_4_과학PDF__c08e6d87.pdf).
    const elementaryParts = {
        kidneyRight: ['오른쪽 콩팥', '혈액에서 노폐물을 걸러 오줌을 만듭니다. 콩팥은 몸의 양쪽에 하나씩 있습니다.'],
        kidneyLeft: ['왼쪽 콩팥', '혈액에서 노폐물을 걸러 오줌을 만듭니다. 노폐물이 걸러진 혈액은 다시 온몸으로 흐릅니다.'],
        renalArtery: ['콩팥으로 들어가는 혈액', '몸에서 생긴 노폐물이 혈액에 실려 콩팥으로 옵니다.'],
        renalVein: ['콩팥에서 나오는 혈액', '콩팥에서 노폐물이 걸러진 혈액은 혈관을 따라 다시 온몸으로 갑니다.'],
        ureterR: ['오줌관', '콩팥에서 만든 오줌을 방광으로 보내는 통로입니다.'],
        bladder: ['방광', '오줌을 잠시 모아 둡니다. 오줌을 만드는 곳은 콩팥입니다.'],
        urethra: ['요도', '방광에 모인 오줌이 몸 밖으로 나가는 통로입니다.']
    };
    const primaryGuides = {
        torso: ['콩팥·오줌관·방광·요도의 위치와 역할을 알아봅니다.', '이름표를 눌러 오줌이 만들어지는 곳과 모이는 곳을 찾아보세요.'],
        urine: ['콩팥에서 만들어진 오줌이 몸 밖으로 나가는 길을 따라갑니다.', '방광에 오줌이 모이는 모습을 보고, ‘배뇨하기’를 눌러 나가는 길을 확인하세요.']
    };
    function table(headers, rows) {
        return '<table class="excretion-study-table"><thead><tr>' + headers.map(h => '<th scope="col">' + S.esc(h) + '</th>').join('') + '</tr></thead><tbody>' + rows.map(row => '<tr>' + row.map((cell, i) => '<' + (i ? 'td' : 'th scope="row"') + '>' + S.esc(cell) + '</' + (i ? 'td' : 'th') + '>').join('') + '</tr>').join('') + '</tbody></table>';
    }
    const panels = {
        elementary: {
            label: '기관과 역할', title: '오줌은 어디에서 만들어져 나갈까요?',
            content: '<ol class="excretion-route"><li><strong>콩팥</strong><p>혈액에서 노폐물을 걸러 오줌을 만듭니다.</p></li><li><strong>오줌관</strong><p>오줌을 콩팥에서 방광으로 보냅니다.</p></li><li><strong>방광</strong><p>오줌을 잠시 모아 둡니다.</p></li><li><strong>요도</strong><p>오줌이 몸 밖으로 나가는 길입니다.</p></li></ol>',
            note: '콩팥은 오줌을 만들고, 방광은 오줌을 모아 둡니다. 두 기관의 역할을 구별해 보세요.'
        },
        middle: {
            label: '여과와 재흡수', title: '혈액 속 물질은 모두 오줌이 될까요?',
            content: table(['물질', '여과액에', '최종 오줌에'], [['혈구·큰 단백질', '거의 없음', '거의 없음'], ['포도당', '있음', '정상 상태에서 거의 없음'], ['물', '있음', '일부가 배출됨'], ['요소', '있음', '배출됨']]),
            note: '포도당은 여과되지만 세뇨관에서 혈액으로 재흡수됩니다. 혈구와 큰 단백질은 정상 상태에서 거의 여과되지 않습니다.'
        },
        high: {
            label: '성분 농도 비교', title: '여과·재흡수와 농도 변화',
            content: table(['성분', '혈장 (%)', '여과액 (%)', '오줌 (%)'], [['단백질', '7.5', '0', '0'], ['포도당', '0.1', '0.1', '0'], ['요소', '0.03', '0.03', '2.00'], ['무기 염류', '0.9', '0.9', '1.2']]),
            note: '이 표의 요소 농도는 약 67배 높아집니다. 물이 재흡수되면서 농도가 높아지는 것이며, 요소의 양이 67배 늘었다는 뜻은 아닙니다.',
            detail: '자료 해석용 예시 값입니다. 실제 농도는 수분 섭취와 몸의 상태에 따라 달라집니다.'
        }
    };
    window.ExcretionLearning = {
        guide(scene) { return S.value === 'elementary' ? primaryGuides[scene] : null; },
        detail(name) {
            const entry = Object.values(elementaryParts).find(item => item[0] === name);
            return S.value === 'elementary' && entry ? entry[1] : null;
        },
        part(item) {
            if (S.value !== 'elementary') return item;
            const copy = elementaryParts[item.id];
            return copy ? Object.assign({}, item, { text: copy[0], desc: copy[1] }) : null;
        }
    };
    function render() {
        const p = panels[S.value];
        document.querySelector('[data-tab="table"]').textContent = p.label;
        const panel = document.getElementById('excretionComparison');
        panel.innerHTML = '<h2>' + S.esc(p.title) + '</h2>' + p.content + '<p class="excretion-study-note">' + S.esc(p.note) + '</p>' + (p.detail ? '<p class="excretion-study-note">' + S.esc(p.detail) + '</p>' : '');
        document.getElementById('hydrationSlider').previousElementSibling.textContent = S.value === 'elementary' ? '마신 물의 양' : '수분 섭취량 (오줌 농도)';
        const nephron = document.querySelector('.scene-btn[data-scene="nephron"]');
        if (nephron) {
            nephron.hidden = S.value === 'elementary';
            if (nephron.hidden && nephron.classList.contains('active')) document.querySelector('.scene-btn[data-scene="torso"]').click();
        }
        // A hidden advanced control must not carry its old value into a simpler model.
        if (S.value !== 'high') {
            ['bpSlider', 'adhSlider'].forEach(id => {
                const input = document.getElementById(id);
                input.value = id === 'bpSlider' ? '120' : '50';
                input.dispatchEvent(new Event('input', { bubbles: true }));
            });
        }
    }
    // Subscribe before the shared guidance initializes so its scene count is up to date.
    S.subscribe(render);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
