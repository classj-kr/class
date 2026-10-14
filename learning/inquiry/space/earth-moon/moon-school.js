/* [4과13-01]: elementary observes the recurring shape, without explaining its orbital cause. */
(function () {
    'use strict';
    const p = window.SchoolContent['space-earth-motion'].elementary;
    p.concepts = ['같은 장소에서 여러 날 달을 관찰하면 달의 모양과 보이는 위치가 달라집니다. 관찰한 날짜·시각·방향과 달의 모양을 함께 기록합니다.', '달은 초승달·상현달·보름달·하현달·그믐달처럼 보이며, 비슷한 모양이 약 한 달 간격으로 반복됩니다.'];
    p.sections = [
        {title:'여러 날 달을 관찰하기',paragraphs:p.concepts},
        {title:'관찰 기록을 나란히 비교하기',paragraphs:[
            '관찰할 때에는 날짜와 시각, 달이 보이는 방향, 달의 모양을 그림이나 사진으로 남깁니다. 여러 날의 기록을 날짜순으로 놓으면 가늘게 보이던 달이 점차 둥글어지고, 보름달 이후 다시 작아지는 모습을 비교할 수 있습니다.',
            '같은 장소와 비슷한 시각에 관찰하면 날에 따른 변화를 비교하기 좋습니다. 구름 때문에 보이지 않은 날에는 날씨와 관찰하지 못한 사실을 기록합니다. 한 번의 관찰보다 여러 날의 기록을 모으면 모양이 반복되는 규칙을 찾기 쉽습니다.'
        ]},
        {title:'지구의 자전과 공전',paragraphs:[
            '지구는 자전축을 중심으로 하루에 한 바퀴씩 서쪽에서 동쪽으로 자전합니다. 햇빛을 받는 쪽은 낮이고 받지 못하는 쪽은 밤입니다. 지구가 자전하면서 한 장소가 햇빛을 받는 쪽과 받지 못하는 쪽을 번갈아 지나므로 낮과 밤이 반복됩니다.',
            '지구는 태양 주위를 일 년에 한 바퀴씩 공전합니다. 계절이 달라지면 같은 시각에 밤하늘에서 볼 수 있는 별자리도 달라집니다. 지구의 하루 동안의 움직임과 일 년 동안의 움직임을 시간의 길이와 함께 구분해 보세요.'
        ]}
    ];
    const rows = [
        ['같은 장소에서 여러 날 달을 관찰하여 모양의 변화를 비교하려 한다. 알맞은 방법은?', ['매일 다른 시각에 보고 시각은 적지 않는다','비슷한 시각에 관찰하고 날짜·방향·모양을 기록한다','보름달을 본 날의 느낌만 쓴다','달이 보이지 않은 날은 모두 그믐달로 적는다'],1,'관찰 조건과 결과를 함께 기록하면 날에 따른 달의 모양과 위치 변화를 비교할 수 있습니다.'],
        ['초승달을 본 뒤 여러 날이 지나 보름달을 보았다. 관찰 기록에서 달의 밝게 보이는 부분은 어떻게 변했는가?', ['점차 넓어졌다','항상 같은 크기였다','점차 좁아졌다','모든 날에 보이지 않았다'],0,'초승달에서 상현달을 거쳐 보름달이 되는 동안 밝게 보이는 부분이 점차 넓어집니다.'],
        ['보름달 이후 여러 날에 걸쳐 나타나는 모양의 순서로 알맞은 것은?', ['보름달 → 초승달 → 상현달','보름달 → 그믐달 → 하현달','보름달 → 하현달 → 그믐달','보름달 → 상현달 → 초승달'],2,'보름달 이후 밝게 보이는 부분이 줄면서 하현달과 그믐달을 차례로 볼 수 있습니다.'],
        ['한 달 동안의 달 관찰 기록에서 찾을 수 있는 규칙은?', ['달은 매일 같은 모양이다','보름달 다음 날 바로 초승달이 된다','달의 모양은 두 번 다시 반복되지 않는다','달의 모양은 일정한 순서로 달라지고 반복된다'],3,'여러 날의 기록을 모아 보면 달의 모양이 변하고 약 한 달 뒤 비슷한 모양으로 되돌아오는 것을 알 수 있습니다.'],
        ['구름이 하늘을 덮어 달을 볼 수 없었다. 관찰 기록으로 가장 알맞은 것은?', ['달이 없어졌다','구름 때문에 달의 모양을 확인하지 못했다','달은 반드시 보름달이었다','달의 크기가 0이 되었다'],1,'관찰하지 못한 까닭을 기록합니다. 구름 때문에 볼 수 없는 경우에는 그날 달의 모양을 관찰 결과로 확정할 수 없습니다.']
    ];
    rows.push(
        ['한 장소에서 낮과 밤이 번갈아 나타나는 까닭은?', ['지구가 하루에 한 바퀴 자전하기 때문이다','태양이 하루마다 꺼졌다 켜지기 때문이다','달이 매일 태양을 가리기 때문이다','지구가 하루에 한 바퀴 공전하기 때문이다'],0,'지구가 자전하면서 한 장소가 햇빛을 받는 쪽과 받지 못하는 쪽을 번갈아 지납니다.'],
        ['지구의 공전을 바르게 설명한 것은?', ['지구가 자전축을 중심으로 한 달에 한 바퀴 돈다','태양이 지구 주위를 일 년에 한 바퀴 돈다','지구가 태양 주위를 일 년에 한 바퀴 돈다','달이 지구 주위를 하루에 한 바퀴 돈다'],2,'지구의 공전은 지구가 태양 주위를 일 년에 한 바퀴 도는 운동입니다.']
    );
    p.questions = rows.map((r,i)=>({id:`moon-observation-e-${String(i+1).padStart(3,'0')}`,revision:1,schoolLevels:['elementary'],cat:i<5?'달 관찰':'지구의 운동',q:r[0],opts:r[1],ans:r[2],exp:r[3]}));
    function init() {
        const S=window.SchoolLevel;
        const labels = {'0':'🌑 달이 거의 보이지 않을 때','45':'🌒 초승달','90':'🌓 상현달','135':'🌔 보름달이 되기 전','180':'🌕 보름달','225':'🌖 보름달이 지난 뒤','270':'🌗 하현달','315':'🌘 그믐달'};
        function update(level) {
            document.querySelectorAll('#phaseChipsGrid button').forEach(b=>{
                b.dataset.originalLabel ||= b.textContent;
                b.textContent = level==='elementary' ? labels[b.dataset.angle] : b.dataset.originalLabel;
            });
            const heading=document.querySelector('.em-phase-selector-title');
            if(heading)heading.textContent=level==='elementary'?'달의 모양 비교':'달의 위상 선택';
            document.querySelector('[aria-label="달의 위상 선택"], [aria-label="달의 모양 비교"]')?.setAttribute('aria-label',level==='elementary'?'달의 모양 비교':'달의 위상 선택');
            document.getElementById('moonPhaseCanvas')?.setAttribute('aria-label',level==='elementary'?'달의 모양과 달 표면의 무늬':'현재 달의 위상과 실제 달 앞면 무늬');
            document.getElementById('emSpeedSlider')?.setAttribute('aria-label','시간 흐름 속도 조절');
            if(level==='elementary')document.querySelector('.em-moon-location-btn[data-observer-location="korea"]')?.click();
        }
        S.subscribe(update);update(S.value);
    }
    document.addEventListener('DOMContentLoaded',init);
})();
