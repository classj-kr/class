(() => {
 const slug=location.pathname.split('/').filter(Boolean).at(-1)==='index.html'?location.pathname.split('/').filter(Boolean).at(-2):location.pathname.split('/').filter(Boolean).at(-1);
 const m=window.scienceCurriculum?.[slug];if(!m)return;
 const assessmentBase=document.currentScript.src;
 const assessment=document.createElement('script');assessment.src=new URL('science-assessment.js?v=59d9c98bf8b1',assessmentBase);
 const loadReview=()=>{const review=document.createElement('script');review.src=new URL('exam-review.js?v=905c433f82bf',assessmentBase);document.body.append(review);};
 assessment.onload=()=>{if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadReview,{once:true});else loadReview();};
 const assessmentContent=document.createElement('script');assessmentContent.src=new URL('assessment-content.js?v=925965f69be2',assessmentBase);
 assessmentContent.onload=assessmentContent.onerror=()=>document.body.append(assessment);
 const loadContent=()=>{const quality=document.createElement('script');quality.src=new URL('question-quality-content.js?v=f00d6ff5e60c',assessmentBase);quality.onload=quality.onerror=()=>document.body.append(assessmentContent);document.body.append(quality);};
 if(m.diagnostic){
  const questions=document.createElement('script');questions.src=new URL('experiment-questions.js?v=91704fa933d4',assessmentBase);
  questions.onload=questions.onerror=loadContent;document.body.append(questions);
 }else loadContent();
 // Load observation panels without injecting an administrative scope banner.
 const base=document.currentScript.src;const extra=document.createElement('script');extra.src=new URL('supplement-extra.js?v=c2779312d820',base);
 const mount=()=>{const supplement=document.createElement('script');supplement.src=new URL('supplement-labs.js?v=c0d59fb6cf8d',base);document.body.append(supplement);if(['measurement','wave-transfer'].includes(slug)){const digital=document.createElement('script');digital.src=new URL('digital-inquiry.js?v=c8669fb3547e',base);document.body.append(digital);}};
 const required=()=>{const script=document.createElement('script');script.src=new URL('required-experiments.js?v=383c9ac310fb',base);script.onload=mount;script.onerror=mount;document.body.append(script);};
 const plants=()=>{const script=document.createElement('script');script.src=new URL('plant-experiments.js?v=dba18a9f1788',base);script.onload=required;script.onerror=required;document.body.append(script);};
 const final=()=>{const script=document.createElement('script');script.src=new URL('required-experiments-final.js?v=0e2f2bbc4a65',base);script.onload=plants;script.onerror=plants;document.body.append(script);};
 const more=()=>{const script=document.createElement('script');script.src=new URL('required-experiments-more.js?v=dff0b84712b5',base);script.onload=final;script.onerror=final;document.body.append(script);};
 const core=()=>{const script=document.createElement('script');script.src=new URL('supplement-core.js?v=7da9e65dfe51',base);script.onload=more;script.onerror=more;document.body.append(script);};
 const optics=()=>{const script=document.createElement('script');script.src=new URL('optics-comparison.js?v=378a50cd935e',base);script.onload=core;document.body.append(script);};
 extra.onload=optics;extra.onerror=optics;const scenes=document.createElement('script');scenes.src=new URL('observation-scenes.js?v=758a78f6414d',base);scenes.onload=()=>document.body.append(extra);const apparatus=document.createElement('script');apparatus.src=new URL('apparatus-scenes.js?v=21bb466fb5ba',base);apparatus.onload=()=>document.body.append(scenes);document.body.append(apparatus);
})();
