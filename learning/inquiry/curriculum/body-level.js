(function () {
    function init() {
        const S = window.SchoolLevel;
        const segments=location.pathname.split('/').filter(Boolean);
        const app=segments[segments.length-1]==='index.html'?segments[segments.length-2]:segments[segments.length-1];
        if (!S || !S.profile('body-'+app)) return;
        S.mount(document.querySelector('.sim-header'));
        const header=document.querySelector('.sim-header');
        new ResizeObserver(()=>document.documentElement.style.setProperty('--body-header-height',header.offsetHeight+'px')).observe(header);
        const title=document.getElementById('organTitle'), desc=document.getElementById('organDesc');
        const subject=document.createElement('p');subject.className='school-subject';
        if(desc)desc.before(subject);
        const quiz=document.getElementById('quizContainer');
        let exercise;
        if(quiz){exercise=document.createElement('div');exercise.className='school-body-exercise';quiz.before(exercise);}
        const simple = [
            ['소장','음식물을 더 소화하고 영양소를 몸속으로 흡수합니다.','소화 효소가 영양소를 작은 물질로 분해하고, 많은 융털이 흡수 표면적을 넓힙니다.','융털의 모세혈관은 포도당·아미노산 등을 받아 간문맥으로 보내고, 림프관은 대부분의 긴 사슬 지방 성분을 운반합니다.'],
            ['위','음식물을 주무르고 소화액과 섞어 소장을 향해 보냅니다.','위액의 펩신은 단백질의 소화를 돕고, 염산은 펩신이 작용하기 좋은 산성 환경을 만듭니다.'],
            ['대장','남은 내용물에서 물을 흡수하고 대변을 만듭니다.','내용물에서 물과 무기 염류의 일부를 흡수합니다. 대부분의 영양소 흡수는 소장에서 일어납니다.'],
            ['식도','입에서 삼킨 음식물을 위로 보냅니다.','벽의 근육이 차례로 수축하는 꿈틀운동으로 음식물을 위로 보냅니다.'],
            ['간','소화를 돕는 쓸개즙을 만듭니다. 음식물이 간 속을 직접 지나가지는 않습니다.','쓸개즙을 만들고 흡수한 영양소를 저장·변환하는 등 여러 일을 합니다.'],
            ['쓸개','간에서 만든 쓸개즙을 저장했다가 소장으로 내보냅니다.','쓸개즙을 저장·농축합니다. 쓸개즙은 지방을 작은 방울로 나누지만 소화 효소는 아닙니다.'],
            ['이자','소화를 돕는 소화액을 소장으로 보냅니다.','이자액에는 여러 영양소를 소화하는 효소가 있습니다. 이자는 혈당량을 조절하는 호르몬도 분비합니다.'],
            ['콩팥','혈액 속 노폐물을 걸러 오줌을 만듭니다.','네프론에서 여과·재흡수·분비를 거쳐 오줌을 만듭니다.'],
            ['방광','오줌을 잠시 저장합니다.','콩팥에서 만들어진 오줌을 저장했다가 요도를 통해 배출합니다.'],
            ['오줌관','콩팥에서 만든 오줌을 방광으로 보냅니다.','콩팥과 방광을 연결합니다. 혈액이 흐르는 혈관과 구별하세요.'],
            ['요도','방광에 모인 오줌이 몸 밖으로 나가는 길입니다.'],
            ['폐포','폐 속에서 산소를 받아들이고 이산화 탄소를 내보내는 곳입니다.','얇은 벽을 사이에 두고 산소는 폐포에서 모세혈관으로, 이산화 탄소는 반대 방향으로 확산합니다.'],
            ['가로막','가슴과 배 사이에 있는 근육입니다. 아래로 내려가면 가슴 속 공간이 넓어집니다.','수축하여 내려가면 가슴우리의 부피가 커지고 압력이 낮아져 들숨이 일어납니다.'],
            ['적혈구','혈액 속에서 산소 운반을 돕습니다.','헤모글로빈이 있어 산소를 운반합니다.'],
            ['백혈구','몸에 들어온 병원체 등에 대응하여 몸을 지킵니다.'],
            ['혈소판','상처에서 피가 멎는 데 관여합니다.'],
            ['혈장','혈액의 액체 성분입니다. 여러 물질을 녹여 운반합니다.'],
            ['소뇌','몸의 균형을 잡고 움직임을 조절하는 데 관여합니다.'],
            ['대뇌','감각 정보를 처리하고 생각하거나 의식적으로 움직이는 데 관여합니다.'],
            ['척수','뇌와 몸 사이의 정보를 전달하고 일부 빠른 반응을 조절합니다.'],
            ['수정체','눈으로 들어오는 빛을 모아 망막에 상이 맺히도록 돕습니다.'],
            ['망막','빛을 받아들여 신호로 바꾸는 세포들이 있습니다.'],
            ['홍채','동공의 크기를 바꾸어 눈에 들어오는 빛의 양을 조절합니다.'],
            ['달팽이관','소리의 진동을 신경 신호로 바꿉니다. 뇌가 이 신호를 받아 소리로 느낍니다.'],
            ['땀샘','땀을 만듭니다. 땀이 증발하면 몸의 열을 내보내는 데 도움이 됩니다.']
        ];
        let text;
        if(desc){text=document.createElement('p');text.className='school-detail';desc.before(text);}
        function selected(){
            if(!desc||!title)return;
            // Specific structures retain their own detail; only whole-organ names use these profiles.
            const name=title.textContent.replace(/^[^가-힣A-Za-z]+/,'').trim();
            const match=simple.find(row=>name===row[0] || name===row[0]+' (소화 기관)');
            const index={elementary:1,middle:2,high:3}[S.value];
            const copy=match?.[index];
            text.hidden=!copy;desc.hidden=!!copy;
            text.textContent=copy||'';
        }
        function render(){
            const p=S.profile('body-'+app);
            subject.textContent=p.subject||'';subject.hidden=!p.subject;
            const concept=document.getElementById('conceptList');
            if(concept)concept.innerHTML=p.concepts.map(t=>'<li>'+S.esc(t)+'</li>').join('');
            const trap=document.getElementById('examTrapList');
            if(trap)trap.innerHTML=S.concepts(p);
            const topic=app==='skeleton'&&quiz?.dataset.quizFor==='muscle'&&S.value==='high'?'muscle':app;
            if(exercise)S.practice(exercise,window.BodyPractice.forLevel(topic,S.value),topic+':'+S.value);
            if(quiz)quiz.hidden=true;
            ['organEnzyme','organPH','organProduct'].forEach(id=>{const item=document.getElementById(id)?.closest('.meter-stat-item');if(item)item.hidden=S.value==='elementary';});
            selected();
        }
        if(desc&&title){const watch=new MutationObserver(selected);[desc,title].forEach(n=>watch.observe(n,{childList:true,subtree:true,characterData:true}));}
        S.subscribe(render);
        document.addEventListener('click',e=>{if(e.target.closest('.scene-btn'))requestAnimationFrame(render);});
        render();
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
