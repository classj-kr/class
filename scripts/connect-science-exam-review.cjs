const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit('scripts/build-science-exam-meta.cjs',s=>{
 s=replace(s,'code:s.code,line:s.line,text:s.text','code:s.code,line:s.line');
 s=replace(s,"const scienceExamUnits='+JSON.stringify(units,null,2)","(() => { const scienceExamUnits='+JSON.stringify(units)");
 s=replace(s,"else window.scienceExamUnits=scienceExamUnits;\\n'", "else window.scienceExamUnits=scienceExamUnits; })();\\n'");return s;
});
edit(lab+'index.html',s=>replace(s,'        </section>\n        <section class="catalog"','            <a class="exam-catalog-link" href="exam-review.html" id="examReviewLink">개념·실험 해석 문제 풀기 →</a>\n        </section>\n        <section class="catalog"'));
edit(lab+'index.html',s=>replace(s,'    <link rel="stylesheet" href="lab-ui.css?v=2">','    <link rel="stylesheet" href="lab-ui.css?v=2">\n    <link rel="stylesheet" href="exam-review.css?v=1">'));
edit(lab+'grade-navigation.js',s=>replace(s,"  const url=new URL(location.href);", "  const review=document.getElementById('examReviewLink');if(review){review.hidden=['고2','고3'].includes(grade);review.href='exam-review.html'+(grade!=='전체'?'?grade='+encodeURIComponent(grade):'');}\n  const url=new URL(location.href);"));
edit(lab+'exam-scope.js',s=>replace(s,' // Load observation panels'," if(m.grades.some(g=>['초3','초4','초5','초6','중1','중2','중3','고1'].includes(g))){const review=document.createElement('script');review.src=new URL('exam-review.js?v=1',document.currentScript.src);document.body.append(review);}\n // Load observation panels"));
edit('scripts/sync-science-catalog.cjs',s=>replace(s,'apply();',"edit(lab+'exam-review.html',s=>cache(s,lab));\napply();"));
apply();
