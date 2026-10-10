(function(){
    function init(){
        const S=window.SchoolLevel, root=document.getElementById('matterWorkbench');
        if(!S||!root)return;
        S.mount(document.querySelector('.top-header'));
        const explanation=document.createElement('div'), exercise=document.createElement('div');
        explanation.className='school-matter-content';exercise.className='school-matter-content';
        document.querySelector('.model-inspector').prepend(explanation);
        const legacy=document.querySelector('.model-check');legacy.after(exercise);
        function current(){return root.querySelector('[data-model][aria-pressed="true"]')?.dataset.model;}
        function render(){
            const p=S.profile('matter-'+current());if(!p)return;
            explanation.innerHTML=S.concepts(p);
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
            if(S.value==='elementary')document.getElementById('tabModelsBtn').click();
            render();
        }
        new MutationObserver(render).observe(document.getElementById('modelTitle'),{childList:true});
        S.subscribe(change);change();
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
