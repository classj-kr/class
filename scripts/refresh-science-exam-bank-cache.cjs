// Invalidate previously cached exam data after the content-validity corrections.
const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'exam-review.js',s=>replace(s,"name+'.js?v=3'","name+'.js?v=4'"));
apply();
