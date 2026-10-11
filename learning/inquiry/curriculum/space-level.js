(function(){
    function init(){
        const S=window.SchoolLevel, topic=window.SpaceTopics?.current(location);
        if(!S||!topic||!S.profile('space-'+topic.id))return;
        const header=document.querySelector('.top-header');S.mount(header);
        const concept=document.getElementById('tab-topic-concepts');
        const oldConcept=[...concept.children];
        const supplemental=concept.querySelector('.stellar-study');
        if(supplemental){
            supplemental.classList.add('topic-supplement');
            document.getElementById('topic-study').append(supplemental);
        }
        const main=document.createElement('div');
        main.className='school-space-content';
        concept.prepend(main);
        function render(){
            const p=S.profile('space-'+topic.id);
            main.innerHTML=S.concepts(p);
            oldConcept.forEach(n=>n.hidden=!(n.classList.contains('star-properties') || n.classList.contains('stellar-study')&&S.value!=='elementary'));
            window.SpaceQuizBoard?.setSchool(S.value);
        }
        const size=()=>document.documentElement.style.setProperty('--space-header-height',header.offsetHeight+'px');
        new ResizeObserver(size).observe(header);
        S.subscribe(render);render();size();
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
