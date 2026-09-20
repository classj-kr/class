// Remove only the user-marked catalog chrome; preserve lessons and grade filtering.
const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'index.html',s=>s.split('\n').filter(line=>!line.includes('<h1>과학 실험 · 학년별 시험 대비</h1>')&&!line.includes('class="course-choice"')&&!line.includes('id="gradeCount"')&&!line.includes('class="placement-note"')).join('\n').replace('grade-navigation.css?v=1','grade-navigation.css?v=2'));
edit(lab+'grade-navigation.js',()=>`(() => {
 const map=window.scienceCurriculum;
 const buttons=[...document.querySelectorAll('[data-grade]')];
 const entries=[...document.querySelectorAll('.level-entry.available')];
 let grade='전체';
 function render(){
  for(const entry of entries){
   const slug=entry.getAttribute('href').split('/')[0];
   entry.hidden=grade!=='전체'&&!map[slug].grades.includes(grade);
  }
  document.querySelectorAll('.level-cell').forEach(cell=>{cell.hidden=grade!=='전체'&&![...cell.querySelectorAll('.level-entry')].some(a=>!a.hidden);});
  document.querySelectorAll('.topic-row,.subject-section').forEach(section=>{section.hidden=![...section.querySelectorAll('.level-entry')].some(a=>!a.hidden);});
  document.querySelector('.catalog').classList.toggle('grade-filtered',grade!=='전체');
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.grade===grade)));
  const url=new URL(location.href);
  grade==='전체'?url.searchParams.delete('grade'):url.searchParams.set('grade',grade);
  // Old shared URLs must not silently apply the removed course filter.
  url.searchParams.delete('course');
  history.replaceState(null,'',url);
 }
 buttons.forEach(b=>b.addEventListener('click',()=>{grade=b.dataset.grade;render();}));
 const params=new URLSearchParams(location.search);
 if(buttons.some(b=>b.dataset.grade===params.get('grade')))grade=params.get('grade');
 render();
})();
`);
edit(lab+'grade-navigation.css',s=>s.split('\n').filter(line=>!line.startsWith('.grade-navigation h1')&&!line.startsWith('.course-choice{')&&!line.startsWith('.placement-note{')).join('\n').replace('.grade-choices button,.course-choice select{','.grade-choices button{').replace('.grade-choices button:focus-visible,.course-choice select:focus-visible{','.grade-choices button:focus-visible{'));
edit('tests/science-all-apps.test.cjs',s=>replace(s,"    await catalogPage.locator('#courseSelect').selectOption('화학반응의 세계');\n    assert.equal(await catalogPage.locator('.level-entry:not([hidden])').count(),2);",`    assert.equal(await catalogPage.locator('#courseSelect,#gradeCount,.placement-note,.grade-navigation h1').count(),0);
    await catalogPage.goto(\`http://127.0.0.1:\${server.address().port}/?grade=고1&course=세포와%20물질대사\`);
    assert.equal(new URL(catalogPage.url()).searchParams.has('course'),false);
    const highOneCount=await catalogPage.evaluate(()=>Object.values(window.scienceCurriculum).filter(m=>m.grades.includes('고1')).length);
    assert.equal(await catalogPage.locator('.level-entry:not([hidden])').count(),highOneCount);
    assert(highOneCount>0);`));
apply();
