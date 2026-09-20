const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'required-experiments.js',s=>replace(s,' return specs;'," const more=typeof module!=='undefined'?require('./required-experiments-more.js').requiredMoreModels:window.requiredMoreModels;\n more?.({add,t,r,l,c,f,q,step,modelNote});\n return specs;"));
edit(lab+'exam-scope.js',s=>{
 s=replace(s,' const core=()=>'," const more=()=>{const script=document.createElement('script');script.src=new URL('required-experiments-more.js?v=1',base);script.onload=required;script.onerror=required;document.body.append(script);};\n const core=()=>");
 return replace(s,'script.onload=required;script.onerror=required;document.body.append(script);};\n extra.onload','script.onload=more;script.onerror=more;document.body.append(script);};\n extra.onload');
});
edit('scripts/sync-science-catalog.cjs',s=>replace(s,"'heat-transfer':['6과08-03']","'cell-membrane':['10통과1-02-05'],'heat-transfer':['6과08-03']"));
edit('tests/science-required-experiments.test.cjs',s=>replace(s,'assert.equal(all.length,11);','assert.equal(all.length,18);'));
apply();
