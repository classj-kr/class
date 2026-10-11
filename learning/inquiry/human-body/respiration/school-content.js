(function () {
    function init() {
        const S=window.SchoolLevel, panel=document.getElementById('tabPanel_gas');
        if(!S || !panel)return;
        const original=panel.innerHTML;
        function update() {
            const primary=S.value==='elementary';
            document.querySelector('[data-tab="gas"]').textContent=primary?'호흡기관의 역할':'기체 성분 비교';
            panel.innerHTML=primary?'<div class="school-lesson"><section class="school-concepts"><h2>공기가 지나가는 길</h2><p>들이마신 공기는 코에서 기관과 기관지를 지나 폐로 들어갑니다. 숨을 내쉴 때에는 반대 방향으로 나갑니다.</p></section><section class="school-concepts"><h2>폐와 가로막</h2><p>폐는 공기 속 산소를 받아들이고 몸에서 생긴 이산화 탄소를 내보냅니다. 가로막은 폐 아래에 있는 근육입니다. 들숨과 날숨에 따라 가로막의 위치와 폐의 크기가 달라집니다.</p></section></div>':original;
            const pressure=document.getElementById('statPressure');
            if(pressure)pressure.parentElement.hidden=primary;
            const volume=document.getElementById('statVolume');
            if(volume)volume.previousElementSibling.textContent=primary?'가슴 속 공간:':'흉강 부피:';
        }
        window.RespirationLearning={guide(scene){return S.value==='elementary'&&scene==='breath'?['숨을 들이쉴 때와 내쉴 때 폐와 가로막의 움직임을 관찰합니다.','들이쉬기·내쉬기를 누르며 폐와 풍선이 커지는 때를 비교하세요.']:null;}};
        S.subscribe(update);update();
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
