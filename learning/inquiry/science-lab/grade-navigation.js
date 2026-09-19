(() => {
 const map=window.scienceCurriculum, buttons=[...document.querySelectorAll('[data-grade]')];
 const entries=[...document.querySelectorAll('.level-entry.available')], select=document.getElementById('courseSelect');
 let grade='전체';
 const subjectNames=[...new Set(Object.values(map).filter(m=>m.level==='high').flatMap(m=>m.subjects))].sort((a,b)=>a.localeCompare(b,'ko'));
 for(const name of subjectNames){const option=document.createElement('option');option.value=name;option.textContent=name;select.append(option);}
 function render(){
  const isHigh=grade.startsWith('고');select.closest('label').hidden=!isHigh;
  let count=0;
  for(const entry of entries){const slug=entry.getAttribute('href').split('/')[0],m=map[slug];entry.hidden=(grade!=='전체'&&!m.grades.includes(grade))||(isHigh&&select.value&&!m.subjects.includes(select.value));if(!entry.hidden)count++;}
  document.querySelectorAll('.level-cell').forEach(cell=>{cell.hidden=grade!=='전체'&&![...cell.querySelectorAll('.level-entry')].some(a=>!a.hidden);});
  document.querySelectorAll('.topic-row,.subject-section').forEach(section=>{section.hidden=![...section.querySelectorAll('.level-entry')].some(a=>!a.hidden);});
  document.querySelector('.catalog').classList.toggle('grade-filtered',grade!=='전체');
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.grade===grade)));
  document.getElementById('gradeCount').textContent=`${grade}${isHigh&&select.value?' · '+select.value:''} ${count}개 실험${count?'':' — 해당 조합의 실험이 없습니다.'}`;
  const url=new URL(location.href);grade==='전체'?url.searchParams.delete('grade'):url.searchParams.set('grade',grade);isHigh&&select.value?url.searchParams.set('course',select.value):url.searchParams.delete('course');history.replaceState(null,'',url);
 }
 buttons.forEach(b=>b.addEventListener('click',()=>{grade=b.dataset.grade;select.value='';render();}));select.addEventListener('change',render);
 const params=new URLSearchParams(location.search);if(buttons.some(b=>b.dataset.grade===params.get('grade')))grade=params.get('grade');if(subjectNames.includes(params.get('course')))select.value=params.get('course');render();
})();
