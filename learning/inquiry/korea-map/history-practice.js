(function () {
  'use strict';
  let dialog, opener;
  function open(scene) {
    const S=window.SchoolLevel, items=window.HistoryQuestions.forLevel(scene.id,S.value);
    if(!items.length)return;
    opener=document.activeElement;
    dialog?.remove();
    dialog=document.createElement('dialog');dialog.className='history-practice-dialog';
    const heading=document.createElement('header'), title=document.createElement('h2'), close=document.createElement('button');
    title.id='historyPracticeTitle';title.textContent=scene.title;
    dialog.setAttribute('aria-labelledby',title.id);
    close.type='button';close.className='history-button';close.textContent='닫기';close.setAttribute('aria-label','문제 닫기');
    close.addEventListener('click',()=>dialog.close());
    heading.append(title,close);
    const host=document.createElement('div');
    dialog.append(heading,host);document.body.append(dialog);
    S.practice(host,items,`history:${scene.id}:${S.value}`);
    dialog.addEventListener('close',()=>{if(opener?.isConnected)opener.focus({preventScroll:true});});
    dialog.showModal();close.focus();
  }
  window.SchoolLevel?.subscribe(()=>{if(dialog?.open)dialog.close();});
  window.KoreaHistoryPractice={open};
})();
