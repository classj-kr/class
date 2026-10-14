(function () {
    'use strict';
    function init() {
        const S=window.SchoolLevel, panel=document.getElementById('tabPanel_blood');
        if(!S || !panel)return;
        const descriptions={
            elementary:[['혈액이 운반하는 것','폐에서 받아들인 산소와 소장에서 흡수한 영양소는 혈액을 통해 온몸으로 이동합니다. 몸에서 생긴 이산화 탄소와 노폐물도 혈액을 따라 이를 내보내는 기관으로 이동합니다.']],
            middle:[['혈장','혈액의 액체 성분으로 대부분 물입니다. 영양소·이산화 탄소·노폐물 등 여러 물질을 운반합니다.'],['적혈구','가운데가 오목한 원반 모양이며 성숙한 사람의 적혈구에는 핵이 없습니다. 헤모글로빈이 산소를 운반합니다.'],['백혈구','핵이 있으며 몸에 침입한 병원체에 대응합니다. 일부 백혈구는 세균 등을 잡아먹는 식세포 작용을 합니다.'],['혈소판','작은 세포 조각으로, 상처 부위에서 혈액이 응고하여 피가 멎는 과정에 관여합니다.']],
            high:[['혈장과 혈구','혈액을 응고시키지 않고 원심분리하면 위쪽에는 혈장, 아래쪽에는 주로 적혈구가 모이고 그 사이에 백혈구·혈소판의 얇은 층이 생깁니다. 혈장의 비율은 대략 55%이며 사람과 상태에 따라 달라집니다.'],['산소 운반과 조직의 교환','적혈구의 헤모글로빈은 폐에서 산소와 결합하고 조직에서 산소를 내놓습니다. 혈장은 영양소와 노폐물 등을 운반합니다. 혈액 성분마다 운반하거나 수행하는 역할이 다릅니다.'],['방어와 혈액 응고','백혈구는 다양한 방어 작용을 하고 혈소판은 혈액 응고에 관여합니다. 원심분리된 층의 두께는 부피 비율이며, 그것만으로 개별 세포의 크기나 수를 같다고 판단해서는 안 됩니다.']]
        };
        function render(){
            const elementary=S.value==='elementary';
            const bloodScene=document.querySelector('[data-scene="blood"]');
            if(bloodScene)bloodScene.hidden=elementary;
            document.querySelector('[data-tab="focus"]').textContent='관찰과 조작';
            panel.innerHTML='<div class="school-lesson">'+descriptions[S.value].map(([title,text])=>'<section class="school-concepts"><h2>'+title+'</h2><p>'+text+'</p></section>').join('')+'</div>';
            if(S.value==='elementary'){
                const active=document.querySelector('.scene-btn.active');
                if(active?.dataset.scene==='blood')document.querySelector('[data-scene="heart"]').click();
                if(document.querySelector('[data-tab="blood"].active'))document.querySelector('[data-tab="focus"]').click();
            }
        }
        window.CirculationLearning={guide:function(scene){return S.value==='elementary'&&scene==='heart'?['심장에서 나간 혈액이 폐와 온몸을 지나 다시 돌아오는 길을 관찰합니다.','심장 박동을 바꾸며 혈액이 이동하는 빠르기를 비교하세요. 폐에서 받아들인 산소가 온몸으로 가는 길도 찾아보세요.']:null;}};
        S.subscribe(render);render();
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
