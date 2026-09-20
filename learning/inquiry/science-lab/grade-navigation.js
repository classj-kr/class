(() => {
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
  const review=document.getElementById('examReviewLink');if(review){review.hidden=['고2','고3'].includes(grade);review.href='exam-review.html'+(grade!=='전체'?'?grade='+encodeURIComponent(grade):'');}
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
