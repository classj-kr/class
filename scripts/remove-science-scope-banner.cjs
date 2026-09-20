const {edit,replace,cut,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'exam-scope.js',s=>cut(s,/ const aside=document\.createElement\('aside'\);[\s\S]*? const base=document\.currentScript\.src;/,' // Load observation panels without injecting an administrative scope banner.\n const base=document.currentScript.src;'));
edit('tests/science-all-apps.test.cjs',s=>{
 s=replace(s,"scope:document.querySelector('.exam-scope')?.textContent||''","scopeBanner:!!document.querySelector('.exam-scope'),observationLoader:!!document.querySelector('script[src*=\"supplement-labs.js\"]')");
 return replace(s,"if(!integration.scope.includes('성취기준'))errors.push('missing grade exam scope');","if(integration.scopeBanner)errors.push('removed scope banner reappeared');\n        if(!integration.observationLoader)errors.push('missing observation module loader');");
});
apply();
