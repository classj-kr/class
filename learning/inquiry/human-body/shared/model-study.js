/* Observation guidance is attached to a scene, not to a disconnected sidebar. */
(function(){
    'use strict';
    var guides={
        digestion:{
            torso:['입에서 항문까지 이어진 소화관과 소화액을 보내는 기관을 구분합니다.','음식물을 삼킨 뒤 소장과 대장을 지나는 길을 따라가세요. 음식물이 간·쓸개·이자를 직접 지나는지도 확인하세요.'],
            stomach:['위 전체와 위벽의 확대 단면을 연결해 봅니다.','염산을 내는 세포와 펩신의 전구체를 내는 세포를 구분하고, 단백질이 작은 조각으로 나뉘는 위치를 찾으세요.'],
            villi:['소장 주름 → 융털 → 표면의 미세융털 순으로 확대합니다.','포도당·아미노산이 가는 모세혈관과 대부분의 지방이 가는 림프관을 비교하세요.'],
            lab:['시약의 검출 반응과 효소가 작용하는 조건을 구분합니다.','시료·시약을 선택하고 베네딕트 반응의 가열 전후를 비교하세요. 효소 곡선에서는 온도와 pH를 한 번에 하나씩 바꾸세요.']
        },
        circulation:{
            blood:['혈액의 액체 성분과 세포 성분을 구분합니다.','원심분리 전후를 비교하고 적혈구·백혈구·혈소판을 선택해 역할을 연결하세요.'],
            heart:['네 개의 방, 판막, 폐순환과 온몸순환을 연결합니다.','우심실에서 출발해 폐와 좌심방까지, 좌심실에서 출발해 온몸과 우심방까지 따라가세요.']
        },
        respiration:{
            alveoli:['폐포의 공기와 모세혈관의 혈액 사이에서 일어나는 이동을 관찰합니다.','산소와 이산화 탄소가 각각 어느 쪽에서 어느 쪽으로 이동하는지 설명하세요.'],
            exchange:['폐와 온몸 조직에서 기체가 이동하는 방향을 비교합니다.','폐에서는 혈액이 산소를 받고, 조직에서는 산소를 내놓는 이유를 각 장소의 차이와 연결하세요.'],
            motion:['갈비뼈·가로막의 움직임과 가슴 속 부피 변화를 연결합니다.','들이쉬기와 내쉬기를 번갈아 선택해 부피·압력·공기 이동의 관계를 관찰하세요.']
        },
        excretion:{
            torso:['콩팥으로 드나드는 혈관과 오줌이 나가는 관을 구분합니다.','콩팥동맥·콩팥정맥과 오줌관을 각각 선택하세요. 혈액과 오줌이 같은 관을 흐르는지 확인하세요.'],
            urine:['콩팥 → 오줌관 → 방광 → 요도로 이어지는 길을 관찰합니다.','방광이 차는 동안 오줌관의 흐름을 보고 배뇨 전후의 저장량을 비교하세요.'],
            nephron:['혈액과 세뇨관 사이에서 물질이 어느 방향으로 이동하는지 봅니다.','포도당·혈구·분비 물질을 비교하고 여과, 재흡수, 분비를 서로 다른 화살표로 설명하세요.']
        },
        nervous:{
            brain:['뇌의 안쪽 단면에서 대뇌·사이뇌·뇌줄기·소뇌의 위치를 비교합니다.','소뇌가 대뇌의 뒤아래에 있는지, 뇌줄기가 척수로 이어지는지 확인하세요.'],
            response:['반응을 조절하는 중추와 의식적 판단의 유무를 비교합니다.','손 들기·동공 반사·기침·무릎 반사에서 신호를 처리하는 중추를 찾아보세요.'],
            autonomic:['교감신경과 부교감신경이 같은 기관에 미치는 영향을 비교합니다.','두 상태를 바꾸며 동공·심장·소화관의 반응을 각각 기록하세요.'],
            reflex:['자극 → 감각신경 → 중추 → 운동신경 → 반응기의 경로를 봅니다.','신호가 척수를 지나는 길과 뇌로 전달되는 길을 구분하세요.'],
            eye:['눈의 구조와 수정체의 조절을 함께 봅니다.','물체 거리를 바꾸고 수정체 두께와 망막에 맺히는 상의 관계를 관찰하세요.'],
            ear:['소리 진동의 전달 경로와 평형감각 기관을 구분합니다.','귓바퀴부터 달팽이관까지 따라간 뒤 반고리관과 전정의 역할을 비교하세요.'],
            pupil:['밝기에 따른 홍채 근육과 동공 크기의 변화를 관찰합니다.','밝기를 바꿨을 때 동공이 커지는지 작아지는지 예측한 뒤 확인하세요.']
        },
        homeostasis:{
            skin:['체온 조절에서 열 발생과 열 방출을 구분합니다.','기온을 높이거나 낮추고 피부 혈관·땀·떨림을 함께 관찰하세요.'],
            glucose:['혈당량 변화에 따른 호르몬 분비와 간의 작용을 연결합니다.','식사와 운동을 선택해 인슐린·글루카곤의 변화 방향과 혈당 회복을 비교하세요.']
        },
        immune:{
            defense:['선천성 면역과 후천성 면역이 이어지는 과정을 봅니다.','단계를 바꾸며 대식세포, 보조 T세포, B세포와 형질세포의 역할을 연결하세요.'],
            graph:['같은 항원에 대한 첫 반응과 이후 반응을 비교합니다.','1차 노출 뒤 2차 노출을 주고 항체 생성까지의 지연과 반응 크기를 비교하세요.']
        },
        skeleton:{
            joint:['팔꿈치 관절을 중심으로 뼈와 근육의 연결을 관찰합니다.','팔을 굽히고 펼 때 어느 근육이 짧아지고 두꺼워지는지 비교하세요. 힘줄이 뼈에 붙어 있는지도 확인하세요.'],
            sarcomere:['근절이 짧아질 때 필라멘트의 길이와 겹침을 구분합니다.','수축 전후의 A대, I대, H대와 Z선 간격을 비교하세요.']
        }
    };
    function init(){
        var app=location.pathname.split('/').filter(Boolean).slice(-1)[0];
        if(app==='index.html') app=location.pathname.split('/').slice(-2)[0];
        if(!guides[app])return;
        var host=document.getElementById('organDetailCard')||document.getElementById('organFocusCard');
        if(!host)host=document.querySelector('.sidebar-tab-panel');
        if(!host)return;
        var card=document.createElement('details');card.className='model-reading';card.open=true;
        card.innerHTML='<summary>관찰하기</summary><p class="model-purpose"></p><p class="model-task"></p><div class="model-scene-step"><button type="button" data-step="-1">← 이전</button><span></span><button type="button" data-step="1">다음 →</button></div>';
        var sidebarBody=document.querySelector('.sidebar-body');
        if(sidebarBody){
            sidebarBody.insertBefore(card,sidebarBody.firstChild);
            if(host.id==='organDetailCard'||host.id==='organFocusCard'){
                sidebarBody.insertBefore(host,card.nextSibling);
                host.classList.add('model-selected-detail');
                host.hidden=true;
            }
        }else host.parentNode.insertBefore(card,host);
        function update(){
            var buttons=[].slice.call(document.querySelectorAll('.scene-btn'));
            var index=buttons.findIndex(function(b){return b.classList.contains('active');});
            if(index<0)return;
            var key=buttons[index].dataset.scene;
            var aliases={main:app==='skeleton'?'joint':'alveoli',path:'exchange',micro:'sarcomere',macro:'joint',gas:'alveoli',two:'exchange',twoplaces:'exchange',breath:'motion',arm:'joint',sensory:'eye'};
            var g=guides[app][key]||guides[app][aliases[key]];
            if(!g){card.hidden=true;return;}
            card.hidden=false;
            ['.model-purpose','.model-task'].forEach(function(s,i){card.querySelector(s).textContent=g[i];});
            card.querySelector('.model-scene-step span').textContent=(index+1)+' / '+buttons.length+' 장면';
            card.querySelector('[data-step="-1"]').disabled=index===0;
            card.querySelector('[data-step="1"]').disabled=index===buttons.length-1;
        }
        card.addEventListener('click',function(e){
            var step=e.target.closest('[data-step]');if(!step)return;
            var buttons=[].slice.call(document.querySelectorAll('.scene-btn'));
            var i=buttons.findIndex(function(b){return b.classList.contains('active');});
            var next=buttons[i+Number(step.dataset.step)];if(next)next.click();
        });
        document.addEventListener('click',function(e){
            if(e.target.closest('.scene-btn')){
                if(host.classList.contains('model-selected-detail'))host.hidden=true;
                setTimeout(update,0);
            }
            if(e.target.closest('.body-diagram-label,svg [role="button"],.brain-pill-btn,.joint-tag,.skin-tag,.model-band-buttons button'))host.hidden=false;
        });
        document.addEventListener('keydown',function(e){
            if((e.key==='Enter'||e.key===' ')&&e.target.closest('.body-diagram-label,svg [role="button"],.joint-tag,.skin-tag'))host.hidden=false;
        },true);
        requestAnimationFrame(update);
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
