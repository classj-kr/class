const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'required-experiments.js',s=>{
 s=replace(s,"  let selected=0,state={...specs[0].initial},records=[],last;","  const saved=specs.map(s=>({state:{...s.initial},records:[]}));\n  let selected=0,state={...saved[0].state},records=saved[0].records,last;");
 s=replace(s,"selected=i;state={...v.initial};records=[];render();","saved[selected]={state:{...state},records};selected=i;state={...saved[i].state};records=saved[i].records;render();");
 return s;
});
edit(lab+'exam-scope.js',s=>replace(s,'required-experiments.js?v=1','required-experiments.js?v=2'));
apply();
