(function () {
    function init() {
        const S = window.SchoolLevel;
        const segments=location.pathname.split('/').filter(Boolean);
        const app=segments[segments.length-1]==='index.html'?segments[segments.length-2]:segments[segments.length-1];
        if (!S || !S.profile('body-'+app)) return;
        S.mount(document.querySelector('.model-navigation')||document.querySelector('.sim-header'));
        const header=document.querySelector('.sim-header');
        if(header&&!header.hidden)new ResizeObserver(()=>document.documentElement.style.setProperty('--body-header-height',header.offsetHeight+'px')).observe(header);
        const title=document.getElementById('organTitle'), desc=document.getElementById('organDesc');
        const subject=document.createElement('p');subject.className='school-subject';
        if(desc)desc.before(subject);
        const quiz=document.getElementById('quizContainer');
        const oldConcept=document.getElementById('conceptList');
        const lesson=document.createElement('div');lesson.className='body-lesson';
        if(oldConcept){oldConcept.hidden=true;oldConcept.closest('.meter-card')?.setAttribute('hidden','');}
        const dialog=document.createElement('dialog');dialog.className='body-explanation-dialog';
        dialog.setAttribute('aria-labelledby','bodyExplanationTitle');
        dialog.innerHTML='<header><h2 id="bodyExplanationTitle">설명</h2><span class="body-explanation-subject"></span><button type="button" aria-label="설명 닫기">닫기 ×</button></header>';
        dialog.append(lesson);document.body.append(dialog);
        const close=dialog.querySelector('button');close.addEventListener('click',()=>dialog.close());
        dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
        const explain=document.createElement('button');explain.type='button';explain.className='body-explanation-button';explain.textContent='설명 보기';explain.setAttribute('aria-haspopup','dialog');
        // The joint model predates the shared tab layout. Give it the same two
        // views while retaining the original controls and their event handlers.
        if(!document.querySelector('.sidebar-tabs')){
            const sidebar=document.querySelector('.sim-sidebar'),body=sidebar.querySelector('.sidebar-body');
            const bar=document.createElement('div');bar.className='sidebar-tabs';
            bar.innerHTML='<button type="button" class="sidebar-tab-btn active" data-tab="focus">모형</button><button type="button" class="sidebar-tab-btn" data-tab="quiz">문제</button>';
            const focus=document.createElement('div');focus.id='tabPanel_focus';focus.className='sidebar-tab-panel';
            const questions=document.createElement('div');questions.id='tabPanel_quiz';questions.className='sidebar-tab-panel';questions.style.display='none';
            focus.append(...body.childNodes);
            if(quiz){const oldCard=quiz.closest('.meter-card');questions.append(quiz);if(oldCard&&!oldCard.childElementCount)oldCard.remove();}
            body.append(focus,questions);sidebar.prepend(bar);
            bar.addEventListener('click',event=>{
                const button=event.target.closest('[data-tab]');if(!button)return;
                bar.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===button));
                focus.style.display=button.dataset.tab==='focus'?'':'none';
                questions.style.display=button.dataset.tab==='quiz'?'':'none';
            });
        }
        const tabs=document.querySelector('.sidebar-tabs');
        const focusPanel=document.getElementById('tabPanel_focus');
        const focusButton=tabs?.querySelector('[data-tab="focus"]'),quizButton=tabs?.querySelector('[data-tab="quiz"]');
        const controls=document.querySelector('.sim-header-right');
        if(controls)controls.append(explain);
        else if(focusPanel)focusPanel.prepend(explain);
        else document.querySelector('.model-navigation').append(explain);
        const references=document.createElement('div');references.className='body-reference-sections';dialog.append(references);
        const extraControls=[];
        tabs?.querySelectorAll('[data-tab]').forEach(button=>{
            if(['focus','quiz'].includes(button.dataset.tab))return;
            button.classList.add('body-reference-tab');
            if(button.dataset.tab==='traps')return;
            const panel=document.getElementById('tabPanel_'+button.dataset.tab);if(!panel)return;
            if(panel.querySelector('input,select,button')){
                const scene=button.dataset.forScene||(button.dataset.tab==='lab'?'lab':'');
                panel.classList.add('body-extra-controls');focusPanel.append(panel);
                extraControls.push({panel,scene});
                if(app==='nervous'){
                    const details=document.createElement('details');details.className='body-reference';details.dataset.reference=button.dataset.tab;
                    const summary=document.createElement('summary');summary.textContent=button.textContent;details.append(summary);
                    const content=document.createElement('div');content.className='body-reference-content';details.append(content);
                    panel.querySelectorAll('.sensory-card,.meter-card:has(table)').forEach(card=>content.append(card));
                    if(content.childElementCount)references.append(details);
                }
            }else{
                const details=document.createElement('details');details.className='body-reference';
                const summary=document.createElement('summary');summary.textContent=button.textContent;
                panel.classList.add('body-reference-content');details.append(summary,panel);references.append(details);
                details.dataset.reference=button.dataset.tab;
            }
        });
        function updateMode(){
            const question=!!quizButton?.classList.contains('active');
            document.body.classList.toggle('body-question-view',question);
            focusButton.textContent='모형';quizButton.textContent='문제';
            [focusButton,quizButton].forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('active'))));
            const scene=document.querySelector('.scene-btn.active')?.dataset.scene;
            extraControls.forEach(({panel,scene:scenes})=>panel.hidden=question||!!scenes&&!scenes.split(',').includes(scene));
            window.dispatchEvent(new Event('resize'));
        }
        tabs?.addEventListener('click',event=>{
            const button=event.target.closest('[data-tab]');if(!button)return;
            if(button.classList.contains('body-reference-tab')){
                event.stopImmediatePropagation();focusButton.click();
            }
            requestAnimationFrame(updateMode);
        },true);
        document.addEventListener('click',event=>{if(event.target.closest('.scene-btn'))requestAnimationFrame(updateMode);});
        explain.addEventListener('click',()=>{render();dialog.showModal();dialog.scrollTop=0;close.focus({preventScroll:true});});
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
            const copy=(app==='excretion'&&window.ExcretionLearning?.detail(name))||match?.[index];
            text.hidden=!copy;desc.hidden=!!copy;
            text.textContent=copy||'';
        }
        function render(){
            const p=S.profile('body-'+app);
            subject.textContent=p.subject||'';subject.hidden=!p.subject;
            lesson.innerHTML=S.concepts({...p,subject:''});window.LessonVisuals?.decorate(lesson,'body-'+app,S.value);
            // The short recap repeats the full chapter. Keep its diagrams and
            // authored unique details in one reading sequence.
            const sections=lesson.querySelectorAll('.school-concepts');
            if(sections.length>1){
                const first=sections[0],full=sections[1];
                first.querySelectorAll(':scope > p').forEach(n=>n.remove());
                first.querySelector('h2')?.remove();
                const paragraphs=full.querySelectorAll(':scope > p');
                const diagrams=full.querySelectorAll(':scope > .lesson-visual');
                (paragraphs[0]||full.querySelector('h2')).after(...first.childNodes);
                if(paragraphs.length)paragraphs[paragraphs.length-1].after(...diagrams);
                first.remove();
            }
            dialog.querySelector('.body-explanation-subject').textContent=p.subject||'';
            references.querySelectorAll('.body-reference').forEach(details=>{
                const button=tabs.querySelector('[data-tab="'+details.dataset.reference+'"]');
                details.querySelector('summary').textContent=button.textContent;
                details.hidden=S.value==='elementary'&&!(app==='excretion'&&details.dataset.reference==='table');
            });
            const trap=document.getElementById('examTrapList');
            if(trap)trap.hidden=true;
            const topic=app==='skeleton'&&quiz?.dataset.quizFor==='muscle'&&S.value==='high'?'muscle':app;
            if(exercise)S.practice(exercise,window.BodyPractice.forLevel(topic,S.value),topic+':'+S.value);
            if(quiz)quiz.hidden=true;
            ['organEnzyme','organPH','organProduct'].forEach(id=>{const item=document.getElementById(id)?.closest('.meter-stat-item');if(item)item.hidden=S.value==='elementary';});
            selected();
            updateMode();
        }
        if(desc&&title){const watch=new MutationObserver(selected);[desc,title].forEach(n=>watch.observe(n,{childList:true,subtree:true,characterData:true}));}
        S.subscribe(render);
        document.addEventListener('click',e=>{if(e.target.closest('.scene-btn'))requestAnimationFrame(render);});
        render();
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
