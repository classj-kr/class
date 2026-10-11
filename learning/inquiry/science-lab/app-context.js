/* Select course scope before apparatus and assessment initialization. */
(() => {
 const parts=location.pathname.split('/').filter(Boolean),slug=parts.at(-1)==='index.html'?parts.at(-2):parts.at(-1);
 const app=window.scienceCurriculum?.[slug];if(!app?.courseContexts)return;
 const requested=new URLSearchParams(location.search).get('school');
 const school=Object.hasOwn(app.courseContexts,requested)?requested:app.defaultContext;
 const context=app.courseContexts[school],label=school==='high-common'?'고(공통)':'고(선택)';
 window.scienceAppContext={...context,school,slug};
 const header=document.querySelector('.page-header'),back=header.querySelector('a');
 back.href='../?school='+school;back.textContent='← '+label+' 과학 실험';
 header.querySelector('.grade-tags').replaceChildren(...[label,...context.subjects].map(text=>{const span=document.createElement('span');span.textContent=text;return span;}));
 document.title=label+' '+app.title;
 const intro=document.querySelector('.intro');if(intro)intro.textContent=context.intro;
 for(const [i,card]of [...document.querySelectorAll('.quiz-card')].entries()){
  card.dataset.questionId=slug+'#q'+(i+1);
  if(!context.questionNumbers.includes(i+1))card.remove();
 }
 document.querySelector('.quiz-heading span').textContent=context.questionNumbers.length+'문제';
})();
