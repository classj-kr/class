const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'lab-ui.js',s=>replace(s,"svg.querySelectorAll('text.axis-title')","svg.querySelectorAll('text.axis-title:not(.figure-caption)')"));
apply();
