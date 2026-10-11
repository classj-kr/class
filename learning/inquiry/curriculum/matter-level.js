(function(){
    function init(){
        const S=window.SchoolLevel, root=document.getElementById('matterWorkbench');
        if(!S||!root)return;
        S.mount(document.querySelector('.top-header'));
        const explanation=document.createElement('div'), exercise=document.createElement('div');
        explanation.className='school-matter-content';exercise.className='school-matter-content';
        const legacy=document.querySelector('.model-check');
        const dialog=document.createElement('dialog');dialog.className='matter-reading-dialog';
        dialog.setAttribute('aria-labelledby','matterReadingTitle');
        dialog.innerHTML='<header><h2 id="matterReadingTitle"></h2><span class="matter-reading-subject"></span><button type="button" aria-label="학습 창 닫기">닫기</button></header>';
        const readingTitle=dialog.querySelector('h2'),subject=dialog.querySelector('.matter-reading-subject');
        dialog.append(explanation,exercise);document.body.append(dialog);
        dialog.querySelector('button').addEventListener('click',()=>dialog.close());
        dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
        const readingActions=document.createElement('div');readingActions.className='matter-reading-actions';
        for(const [label,mode] of [['설명 보기','lesson'],['확인 문제','practice']]){
            const button=document.createElement('button');button.type='button';button.textContent=label;
            button.setAttribute('aria-haspopup','dialog');
            button.addEventListener('click',()=>{
                explanation.hidden=mode!=='lesson';exercise.hidden=mode!=='practice';
                readingTitle.textContent=mode==='lesson'?'설명':'확인 문제';dialog.showModal();dialog.scrollTop=0;
            });readingActions.append(button);
        }
        document.querySelector('.matter-nav .model-actions').after(readingActions);
        function current(){return root.querySelector('[data-model][aria-pressed="true"]')?.dataset.model;}
        function render(){
            const p=S.profile('matter-'+current());if(!p)return;
            explanation.innerHTML=S.concepts({...p,subject:''});subject.textContent=p.subject||'';
            S.practice(exercise,window.MatterPractice.forLevel(current(),S.value),current()+':'+S.value);
            legacy.hidden=true;
            document.getElementById('modelFacts').hidden=S.value==='elementary';
            document.querySelector('.model-key').hidden=S.value!=='high';
        }
        function change(){
            root.querySelectorAll('[data-model]').forEach(b=>{
                const available=!!S.profile('matter-'+b.dataset.model);
                b.disabled=!available;b.title=available?'':window.SchoolContent['matter-'+b.dataset.model]?.middle?'중등부터 학습하는 내용':'고등 선택과목에서 학습하는 내용';
            });
            root.querySelectorAll('.matter-nav h2').forEach(heading=>{
                let item=heading.nextElementSibling, available=false;
                while(item&&item.tagName!=='H2'){
                    if(item.matches('[data-model]:not(:disabled)'))available=true;
                    item=item.nextElementSibling;
                }
                heading.hidden=!available;
            });
            if(!S.profile('matter-'+current()))root.querySelector('[data-model]:not(:disabled)').click();
            document.querySelectorAll('.nav-tab:not([data-tab="models"])').forEach(b=>b.hidden=S.value==='elementary');
            document.querySelector('.top-header .nav-tabs').hidden=S.value==='elementary';
            if(S.value==='elementary')document.getElementById('tabModelsBtn').click();
            render();
        }
        new MutationObserver(render).observe(document.getElementById('modelTitle'),{childList:true});
        S.subscribe(change);change();
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
