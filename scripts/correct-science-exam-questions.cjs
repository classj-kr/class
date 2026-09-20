const {edit,replaceQuiz,apply,lab}=require('./science-scope-patch.cjs');
const corrections=require('../docs/science-lab-audit-2026-09-20/exam-question-corrections.cjs');
for(const [slug,n,...q]of corrections)edit(lab+slug+'/index.html',s=>replaceQuiz(s,n,q));
apply();
console.log(corrections.length+' reviewed question corrections');
