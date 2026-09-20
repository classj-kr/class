const fs=require('node:fs');const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'flame-ions/app.js',s=>replace(s,'x="390" y="10" text-anchor="middle">전원 장치','x="390" y="18" text-anchor="middle">전원 장치'));
edit(lab+'lab-ui.js',s=>replace(s,'* Axis labels, object labels, values and scientific shapes are never relocated.','* Bottom axis titles may flow below their graph; plotted ticks, objects and shapes stay put.'));
for(const slug of ['',...Object.keys(require('../learning/inquiry/science-lab/curriculum-map.js'))]){
 const p=lab+(slug?slug+'/':'')+'index.html';edit(p,s=>s.replaceAll('lab-ui.css?v=1','lab-ui.css?v=2'));
}
apply();
