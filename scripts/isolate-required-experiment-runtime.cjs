const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'required-experiments.js',s=>{
 s=replace(s,"if(typeof window!=='undefined'){","if(typeof window!=='undefined')(()=>{");
 if(!s.endsWith('}\n'))throw Error('Unexpected end');return s.slice(0,-2)+'})();\n';
});
apply();
