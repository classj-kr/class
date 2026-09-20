const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'required-experiments-final.js',s=>{for(const sequence of ['수성 → 금성 → 지구 → 화성','금성 → 수성 → 지구 → 화성','수성 → 금성 → 화성 → 지구','목성 → 토성 → 천왕성 → 해왕성','토성 → 목성 → 천왕성 → 해왕성','목성 → 토성 → 해왕성 → 천왕성'])s=replace(s,sequence,sequence.replaceAll(' → ','·'));return s;});
edit(lab+'exam-scope.js',s=>replace(s,'required-experiments-final.js?v=2','required-experiments-final.js?v=3'));
apply();
