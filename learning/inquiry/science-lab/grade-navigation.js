(() => {
 const entries=[...document.querySelectorAll('.level-entry.available')];
 const schoolButtons=[...document.querySelectorAll('[data-school-filter]')];
 const gradeButtons=[...document.querySelectorAll('[data-grade]')];
 const gradeChoices=document.querySelector('.grade-choices');
 let school='all', grade='전체';
 const gradeSchool=g=>g.startsWith('초')?'elementary':g.startsWith('중')?'middle':null;
 function render(){
  for(const entry of entries) entry.hidden=(school!=='all'&&entry.dataset.school!==school)||(grade!=='전체'&&!entry.dataset.grades.split(' ').includes(grade));
  document.querySelectorAll('.level-cell').forEach(cell=>{cell.hidden=school!=='all'&&![...cell.querySelectorAll('.level-entry')].some(a=>!a.hidden);});
  document.querySelectorAll('.topic-row,.subject-section,.school-section').forEach(section=>{section.hidden=![...section.querySelectorAll('.level-entry')].some(a=>!a.hidden);});
  document.querySelector('.catalog').classList.toggle('school-filtered',school!=='all');
  const foundationTitle=document.querySelector('.foundation-section > h2');
  foundationTitle.textContent=school==='elementary'?'초 · 과학':school==='middle'?'중 · 과학':'초·중 · 과학';
  schoolButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.schoolFilter===school)));
  gradeChoices.hidden=!['elementary','middle'].includes(school);
  gradeButtons.forEach(b=>{
   b.hidden=b.dataset.grade!=='전체'&&gradeSchool(b.dataset.grade)!==school;
   b.setAttribute('aria-pressed',String(b.dataset.grade===grade));
  });
  const url=new URL(location.href);
  school==='all'?url.searchParams.delete('school'):url.searchParams.set('school',school);
  grade==='전체'?url.searchParams.delete('grade'):url.searchParams.set('grade',grade);
  // Old shared URLs must not silently apply the removed course filter.
  url.searchParams.delete('course');
  history.replaceState(null,'',url);
 }
 schoolButtons.forEach(b=>b.addEventListener('click',()=>{school=b.dataset.schoolFilter;grade='전체';render();}));
 gradeButtons.forEach(b=>b.addEventListener('click',()=>{grade=b.dataset.grade;render();}));
 const params=new URLSearchParams(location.search), requestedSchool=params.get('school'), requestedGrade=params.get('grade');
 if(schoolButtons.some(b=>b.dataset.schoolFilter===requestedSchool)) school=requestedSchool;
 else if(requestedGrade==='고1') school='high-common';
 else if(['고2','고3'].includes(requestedGrade)) school='high-elective';
 else if(requestedGrade&&gradeSchool(requestedGrade)) school=gradeSchool(requestedGrade);
 if(gradeButtons.some(b=>b.dataset.grade===requestedGrade)&&gradeSchool(requestedGrade)===school) grade=requestedGrade;
 render();
})();
