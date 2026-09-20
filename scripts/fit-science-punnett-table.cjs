const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'pea-genetics/app.js',s=>replace(s,"mainGroup.closest('svg').setAttribute('viewBox',a.kind", "mainGroup.closest('svg').setAttribute('data-mobile-fit','');\n        mainGroup.closest('svg').setAttribute('viewBox',a.kind"));
edit('scripts/audit-science-layout.cjs',s=>{
 s=replace(s,"   return{overflow:document.documentElement.scrollWidth>innerWidth+1,typography,outside,overlaps};", "   for(const pane of document.querySelectorAll('.figure-viewport'))if(visible(pane)&&pane.scrollWidth>pane.clientWidth+2)outside.push('도식 내부 가로 넘침: '+pane.scrollWidth+'/'+pane.clientWidth);\n   return{overflow:document.documentElement.scrollWidth>innerWidth+1,typography,outside,overlaps};");
 return s;
});
apply();
