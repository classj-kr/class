(function(){
    function init(){
        const S=window.SchoolLevel, topic=window.SpaceTopics?.current(location);
        if(!S||!topic||!S.profile('space-'+topic.id))return;
        const header=document.querySelector('.top-header');S.mount(header);
        const concept=document.getElementById('tab-topic-concepts'), quiz=document.getElementById('tab-quiz');
        const oldConcept=[...concept.children],oldQuiz=[...quiz.children];
        const main=document.createElement('div'), exercise=document.createElement('div');
        main.className='school-space-content';exercise.className='school-space-content';
        concept.prepend(main);quiz.prepend(exercise);
        function render(){
            const p=S.profile('space-'+topic.id);
            main.innerHTML=S.concepts(p);exercise.innerHTML=S.concepts({source:p.source,concepts:[]})+S.question(p);
            oldConcept.forEach(n=>n.hidden=S.value!=='high'&&!n.classList.contains('star-properties'));
            oldQuiz.forEach(n=>n.hidden=S.value!=='high');
        }
        const size=()=>document.documentElement.style.setProperty('--space-header-height',header.offsetHeight+'px');
        new ResizeObserver(size).observe(header);
        S.subscribe(render);render();size();
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
