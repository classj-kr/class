/* Observation guidance is attached to a scene, not to a disconnected sidebar. */
(function(){
    'use strict';
    var guides={
        digestion:{
            torso:['입에서 항문까지 이어진 소화관과 소화액을 보내는 기관을 구분합니다.','음식물을 삼킨 뒤 소장과 대장을 지나는 길을 따라가세요. 음식물이 간·쓸개·이자를 직접 지나는지도 확인하세요.','몸을 앞에서 본 배치도입니다. 이자는 관찰을 위해 드러냈습니다. 이동 시간과 기관 크기는 실제 비율이 아닙니다.'],
            stomach:['위 전체와 위벽의 확대 단면을 연결해 봅니다.','염산을 내는 세포와 펩신의 전구체를 내는 세포를 구분하고, 단백질이 작은 조각으로 나뉘는 위치를 찾으세요.','염산은 효소가 아닙니다. 점과 조각의 수·크기·속도는 작용을 보여 주기 위한 표현입니다.'],
            villi:['소장 주름 → 융털 → 표면의 미세융털 순으로 확대합니다.','포도당·아미노산이 가는 모세혈관과 대부분의 지방이 가는 림프관을 비교하세요.','서로 다른 확대 배율을 한 화면에 놓았습니다. 모든 영양소가 곧바로 간으로 이동하는 것은 아닙니다.'],
            lab:['시약의 검출 반응과 효소가 작용하는 조건을 구분합니다.','시료·시약을 선택하고 베네딕트 반응의 가열 전후를 비교하세요. 효소 곡선에서는 온도와 pH를 한 번에 하나씩 바꾸세요.','효소 곡선은 각 조건에서 새 시료를 비교하는 개략 모형입니다. 이미 열변성된 효소가 냉각하면 되살아난다는 뜻이 아니며, 활성이나 영양소의 양을 정량 측정한 값이 아닙니다.']
        },
        circulation:{
            blood:['혈액의 액체 성분과 세포 성분을 구분합니다.','원심분리 전후를 비교하고 적혈구·백혈구·혈소판을 선택해 역할을 연결하세요.','세포 수와 크기는 관찰하기 쉽게 조정했습니다. 실제 혈액에서는 적혈구가 훨씬 많습니다.'],
            heart:['네 개의 방, 판막, 폐순환과 온몸순환을 연결합니다.','우심실에서 출발해 폐와 좌심방까지, 좌심실에서 출발해 온몸과 우심방까지 따라가세요.','앞에서 본 도식이므로 화면 왼쪽이 몸의 오른쪽입니다. 파란색은 산소가 적은 혈액의 구분색이며 실제 혈액은 붉습니다.']
        },
        respiration:{
            alveoli:['폐포의 공기와 모세혈관의 혈액 사이에서 일어나는 이동을 관찰합니다.','산소와 이산화 탄소가 각각 어느 쪽에서 어느 쪽으로 이동하는지 설명하세요.','입자는 대표 표본입니다. 확산과 혈류를 구분하며, 색이나 수를 실제 농도로 읽지 않습니다.'],
            exchange:['폐와 온몸 조직에서 기체가 이동하는 방향을 비교합니다.','폐에서는 혈액이 산소를 받고, 조직에서는 산소를 내놓는 이유를 각 장소의 차이와 연결하세요.','두 장소는 이어진 순환의 일부입니다. 폐포의 공기와 조직 세포 내부는 서로 다른 공간입니다.'],
            motion:['갈비뼈·가로막의 움직임과 가슴 속 부피 변화를 연결합니다.','들이쉬기와 내쉬기를 번갈아 선택해 부피·압력·공기 이동의 관계를 관찰하세요.','종 모형의 고무막은 가로막에 해당하지만 실제 가로막의 돔 모양과 갈비뼈 운동을 모두 재현하지는 못합니다.']
        },
        excretion:{
            torso:['콩팥으로 드나드는 혈관과 오줌이 나가는 관을 구분합니다.','콩팥동맥·콩팥정맥과 오줌관을 각각 선택하세요. 혈액과 오줌이 같은 관을 흐르는지 확인하세요.','앞에서 본 그림입니다. 등 쪽에 있는 콩팥을 보이도록 나타냈고, 네프론은 따로 확대했습니다.'],
            urine:['콩팥 → 오줌관 → 방광 → 요도로 이어지는 길을 관찰합니다.','방광이 차는 동안 오줌관의 흐름을 보고 배뇨 전후의 저장량을 비교하세요.','오줌은 콩팥에서 만들어지고 방광은 저장합니다. 생성 속도·용량·시간은 관찰용 설정입니다.'],
            nephron:['혈액과 세뇨관 사이에서 물질이 어느 방향으로 이동하는지 봅니다.','포도당·혈구·분비 물질을 비교하고 여과, 재흡수, 분비를 서로 다른 화살표로 설명하세요.','물질 이동 방향을 단순화한 모형입니다. 물은 대부분 재흡수되며, 요소도 일부 재흡수됩니다. 입자 개수는 실제 비율이 아닙니다.']
        },
        nervous:{
            brain:['뇌의 안쪽 단면에서 대뇌·사이뇌·뇌줄기·소뇌의 위치를 비교합니다.','소뇌가 대뇌의 뒤아래에 있는지, 뇌줄기가 척수로 이어지는지 확인하세요.','정중 단면의 개략도입니다. 선택 색은 위치를 구분하는 표시이며 그 부위만 작동한다는 뜻은 아닙니다.'],
            response:['반응을 조절하는 중추와 의식적 판단의 유무를 비교합니다.','손 들기·동공 반사·기침·무릎 반사에서 신호를 처리하는 중추를 찾아보세요.','애니메이션은 신호 경로를 보여 줍니다. 서로 다른 반응의 실제 시간이나 빠르기 순위를 나타내지 않습니다.'],
            autonomic:['교감신경과 부교감신경이 같은 기관에 미치는 영향을 비교합니다.','두 상태를 바꾸며 동공·심장·소화관의 반응을 각각 기록하세요.','길항 작용을 중심으로 단순화했습니다. 모든 기관에서 두 신경이 완전히 대칭으로 작용하는 것은 아닙니다.'],
            reflex:['자극 → 감각신경 → 중추 → 운동신경 → 반응기의 경로를 봅니다.','신호가 척수를 지나는 길과 뇌로 전달되는 길을 구분하세요.','대표적인 회피 반사입니다. 무릎 반사 등 다른 반사는 관여하는 신경세포 수와 연결이 다를 수 있습니다.'],
            eye:['눈의 구조와 수정체의 조절을 함께 봅니다.','물체 거리를 바꾸고 수정체 두께와 망막에 맺히는 상의 관계를 관찰하세요.','광선은 대표 경로만 그렸습니다. 조절·굴절·동공 크기는 서로 구분해서 봅니다.'],
            ear:['소리 진동의 전달 경로와 평형감각 기관을 구분합니다.','귓바퀴부터 달팽이관까지 따라간 뒤 반고리관과 전정의 역할을 비교하세요.','달팽이관은 진동을 신경 신호로 바꾸고, 대뇌는 전달된 신호를 소리로 인식합니다.'],
            pupil:['밝기에 따른 홍채 근육과 동공 크기의 변화를 관찰합니다.','밝기를 바꿨을 때 동공이 커지는지 작아지는지 예측한 뒤 확인하세요.','동공은 빛이 지나는 구멍입니다. 검은 원이 근육 자체가 아니며, 주변 홍채가 크기를 조절합니다.']
        },
        homeostasis:{
            skin:['체온 조절에서 열 발생과 열 방출을 구분합니다.','기온을 높이거나 낮추고 피부 혈관·땀·떨림을 함께 관찰하세요.','수치는 단순화한 조절 모형입니다. 실제 체온은 활동·습도·의복 등 여러 조건의 영향을 받습니다.'],
            glucose:['혈당량 변화에 따른 호르몬 분비와 간의 작용을 연결합니다.','식사와 운동을 선택해 인슐린·글루카곤의 변화 방향과 혈당 회복을 비교하세요.','100 mg/dL는 모형 기준값입니다. 호르몬 표시와 곡선은 변화 관계를 나타내며 개인의 실제 측정값이 아닙니다.']
        },
        immune:{
            defense:['선천성 면역과 후천성 면역이 이어지는 과정을 봅니다.','단계를 바꾸며 대식세포, 보조 T세포, B세포와 형질세포의 역할을 연결하세요.','항원은 면역계가 인식하는 물질입니다. 병원체와 같은 말이 아니며, 실제 면역 과정은 여러 반응이 동시에 일어납니다.'],
            graph:['같은 항원에 대한 첫 반응과 이후 반응을 비교합니다.','1차 노출 뒤 2차 노출을 주고 항체 생성까지의 지연과 반응 크기를 비교하세요.','축과 곡선은 개념적인 비교입니다. 실제 농도·날짜나 모든 백신의 효과를 그대로 예측하는 그래프가 아닙니다.']
        },
        skeleton:{
            joint:['팔꿈치 관절을 중심으로 뼈와 근육의 연결을 관찰합니다.','팔을 굽히고 펼 때 어느 근육이 짧아지고 두꺼워지는지 비교하세요. 힘줄이 뼈에 붙어 있는지도 확인하세요.','굽힘·폄의 기본 길항 관계를 나타냅니다. 실제로 자세를 유지할 때 두 근육이 함께 힘을 내기도 합니다.'],
            sarcomere:['근절이 짧아질 때 필라멘트의 길이와 겹침을 구분합니다.','수축 전후의 A대, I대, H대와 Z선 간격을 비교하세요.','액틴·마이오신 자체의 길이는 변하지 않고 겹침이 커집니다. 근육 전체 운동과 확대된 근절의 배율은 다릅니다.']
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
