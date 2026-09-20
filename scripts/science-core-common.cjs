const {edit,replace,apply,lab,quiz}=require('./science-scope-patch.cjs');
edit(lab+'supplement-core.js',s=>{
 s=replace(s,"const check=(question,choices,answer,why)=>({question,choices,answer,why});","const check=(question,choices,answer,why)=>{const shift=[...question].reduce((n,c)=>n+c.charCodeAt(0),0)%choices.length;return{question,choices:choices.slice(shift).concat(choices.slice(0,shift)),answer:String((+answer-shift+choices.length)%choices.length),why};};");
 s=replace(s,"9+(i%4)*2,9,['#eee6d9'","(s.detail==='grain'?15:9)+(i%4)*2,s.detail==='grain'?15:9,['#eee6d9'");
 return s;
});
apply();
