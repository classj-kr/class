(() => {
 const slug=location.pathname.split('/').filter(Boolean).at(-1)==='index.html'?location.pathname.split('/').filter(Boolean).at(-2):location.pathname.split('/').filter(Boolean).at(-1);
 const m=window.scienceCurriculum?.[slug];if(!m)return;
 const assessmentBase=document.currentScript.src;
 const assessment=document.createElement('script');assessment.src=new URL('science-assessment.js?v=924433ac08a4',assessmentBase);
 const loadReview=()=>{const review=document.createElement('script');review.src=new URL('exam-review.js?v=83bb118e45c3',assessmentBase);document.body.append(review);};
 assessment.onload=()=>{if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadReview,{once:true});else loadReview();};
 const assessmentContent=document.createElement('script');assessmentContent.src=new URL('assessment-content.js?v=e04d3903a843',assessmentBase);
 assessmentContent.onload=assessmentContent.onerror=()=>document.body.append(assessment);
 const loadContent=()=>{const quality=document.createElement('script');quality.src=new URL('question-quality-content.js?v=676d6fb796ad',assessmentBase);quality.onload=quality.onerror=()=>document.body.append(assessmentContent);document.body.append(quality);};
 if(m.diagnostic){
  const questions=document.createElement('script');questions.src=new URL('experiment-questions.js?v=f1e414684433',assessmentBase);
  questions.onload=questions.onerror=loadContent;document.body.append(questions);
 }else loadContent();
 // Load observation panels without injecting an administrative scope banner.
 if(window.scienceAppContext?.standaloneApparatus)return;
 const base=document.currentScript.src;const extra=document.createElement('script');extra.src=new URL('supplement-extra.js?v=658a9c23eb40',base);
 const mount=()=>{const supplement=document.createElement('script');supplement.src=new URL('supplement-labs.js?v=d53425a7c380',base);document.body.append(supplement);if(['measurement','wave-transfer'].includes(slug)){const digital=document.createElement('script');digital.src=new URL('digital-inquiry.js?v=20c79923170f',base);document.body.append(digital);}};
 const required=()=>{const script=document.createElement('script');script.src=new URL('required-experiments.js?v=c78f841911a2',base);script.onload=mount;script.onerror=mount;document.body.append(script);};
 const plants=()=>{const script=document.createElement('script');script.src=new URL('plant-experiments.js?v=4276daf3315f',base);script.onload=required;script.onerror=required;document.body.append(script);};
 const final=()=>{const script=document.createElement('script');script.src=new URL('required-experiments-final.js?v=0e2f2bbc4a65',base);script.onload=plants;script.onerror=plants;document.body.append(script);};
 const more=()=>{const script=document.createElement('script');script.src=new URL('required-experiments-more.js?v=e41c07e3716d',base);script.onload=final;script.onerror=final;document.body.append(script);};
 const core=()=>{const script=document.createElement('script');script.src=new URL('supplement-core.js?v=54eecdebc7ab',base);script.onload=more;script.onerror=more;document.body.append(script);};
 const optics=()=>{const script=document.createElement('script');script.src=new URL('optics-comparison.js?v=cca247704390',base);script.onload=core;document.body.append(script);};
 extra.onload=optics;extra.onerror=optics;const scenes=document.createElement('script');scenes.src=new URL('observation-scenes.js?v=fe41e517f9e3',base);scenes.onload=()=>document.body.append(extra);const apparatus=document.createElement('script');apparatus.src=new URL('apparatus-scenes.js?v=1999a63d40ee',base);apparatus.onload=()=>document.body.append(scenes);document.body.append(apparatus);
})();
