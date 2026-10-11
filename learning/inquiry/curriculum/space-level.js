(function(){
    function init(){
        const S=window.SchoolLevel, topic=window.SpaceTopics?.current(location);
        if(!S||!topic||!S.profile('space-'+topic.id))return;
        const header=document.querySelector('.top-header');S.mount(header);
        const concept=document.getElementById('tab-topic-concepts');
        const oldConcept=[...concept.children];
        const main=document.createElement('div');
        main.className='school-space-content';
        concept.prepend(main);
        function render(){
            const p=S.profile('space-'+topic.id);
            main.innerHTML=S.concepts({...p,subject:''});
            const subject=document.querySelector('.topic-explanation-subject');
            if(subject){subject.textContent=p.subject||'';subject.hidden=!p.subject;}
            else {
                const heading=main.querySelector('.school-concepts h2');
                if(heading&&p.subject){
                    const badge=document.createElement('span');
                    badge.className='topic-explanation-subject';badge.textContent=p.subject;
                    heading.append(badge);
                }
            }
            oldConcept.forEach(n=>n.hidden=!(n.classList.contains('star-properties') || n.classList.contains('stellar-study')&&S.value!=='elementary'));
            window.SpaceQuizBoard?.setSchool(S.value);
        }
        const size=()=>document.documentElement.style.setProperty('--space-header-height','0px');
        new ResizeObserver(size).observe(header);
        S.subscribe(render);render();size();
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
