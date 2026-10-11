(() => {
 const slug=location.pathname.split('/').filter(Boolean).at(-1)==='index.html'?location.pathname.split('/').filter(Boolean).at(-2):location.pathname.split('/').filter(Boolean).at(-1);
 const m=window.scienceCurriculum?.[slug];if(!m)return;
 const assessmentBase=document.currentScript.src;
 const assessment=document.createElement('script');assessment.src=new URL('science-assessment.js?v=c7899ac6b7d7',assessmentBase);
 const loadReview=()=>{const review=document.createElement('script');review.src=new URL('exam-review.js?v=2b7bfaaacadc',assessmentBase);document.body.append(review);};
 assessment.onload=()=>{if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadReview,{once:true});else loadReview();};
 const assessmentContent=document.createElement('script');assessmentContent.src=new URL('assessment-content.js?v=51433a14d4cb',assessmentBase);
 assessmentContent.onload=assessmentContent.onerror=()=>document.body.append(assessment);
 if(m.diagnostic){
  const questions=document.createElement('script');questions.src=new URL('experiment-questions.js?v=ff929130ae8d',assessmentBase);
  questions.onload=questions.onerror=()=>document.body.append(assessmentContent);document.body.append(questions);
 }else document.body.append(assessmentContent);
 // Load observation panels without injecting an administrative scope banner.
 const base=document.currentScript.src;const extra=document.createElement('script');extra.src=new URL('supplement-extra.js?v=c2779312d820',base);
 const mount=()=>{const supplement=document.createElement('script');supplement.src=new URL('supplement-labs.js?v=c0d59fb6cf8d',base);document.body.append(supplement);if(['measurement','wave-transfer'].includes(slug)){const digital=document.createElement('script');digital.src=new URL('digital-inquiry.js?v=c8669fb3547e',base);document.body.append(digital);}};
 const required=()=>{const script=document.createElement('script');script.src=new URL('required-experiments.js?v=cf020f1a07a6',base);script.onload=mount;script.onerror=mount;document.body.append(script);};
 const final=()=>{const script=document.createElement('script');script.src=new URL('required-experiments-final.js?v=0e2f2bbc4a65',base);script.onload=required;script.onerror=required;document.body.append(script);};
 const more=()=>{const script=document.createElement('script');script.src=new URL('required-experiments-more.js?v=dff0b84712b5',base);script.onload=final;script.onerror=final;document.body.append(script);};
 const core=()=>{const script=document.createElement('script');script.src=new URL('supplement-core.js?v=7da9e65dfe51',base);script.onload=more;script.onerror=more;document.body.append(script);};
 const optics=()=>{const script=document.createElement('script');script.src=new URL('optics-comparison.js?v=378a50cd935e',base);script.onload=core;document.body.append(script);};
 extra.onload=optics;extra.onerror=optics;const scenes=document.createElement('script');scenes.src=new URL('observation-scenes.js?v=758a78f6414d',base);scenes.onload=()=>document.body.append(extra);document.body.append(scenes);
})();
