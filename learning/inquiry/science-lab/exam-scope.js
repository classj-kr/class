(() => {
 const slug=location.pathname.split('/').filter(Boolean).at(-1)==='index.html'?location.pathname.split('/').filter(Boolean).at(-2):location.pathname.split('/').filter(Boolean).at(-1);
 const m=window.scienceCurriculum?.[slug];if(!m)return;
 // Load observation panels without injecting an administrative scope banner.
 const base=document.currentScript.src;const extra=document.createElement('script');extra.src=new URL('supplement-extra.js?v=1',base);
 const mount=()=>{const supplement=document.createElement('script');supplement.src=new URL('supplement-labs.js?v=3',base);document.body.append(supplement);};
 const required=()=>{const script=document.createElement('script');script.src=new URL('required-experiments.js?v=1',base);script.onload=mount;script.onerror=mount;document.body.append(script);};
 const core=()=>{const script=document.createElement('script');script.src=new URL('supplement-core.js?v=2',base);script.onload=required;script.onerror=required;document.body.append(script);};
 extra.onload=core;extra.onerror=core;document.body.append(extra);
})();
