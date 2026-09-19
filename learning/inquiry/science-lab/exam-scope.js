(() => {
 const slug=location.pathname.split('/').filter(Boolean).at(-1)==='index.html'?location.pathname.split('/').filter(Boolean).at(-2):location.pathname.split('/').filter(Boolean).at(-1);
 const m=window.scienceCurriculum?.[slug];if(!m)return;
 const aside=document.createElement('aside');aside.className='exam-scope';aside.setAttribute('aria-label','시험 대비 범위');
 const title=document.createElement('strong');title.textContent=`${m.grade} · ${m.subjects.join(' / ')} 시험 대비`;
 const line=document.createElement('p');line.textContent='관련 성취기준: '+m.codes.join(', ');
 const note=document.createElement('p');note.className='scope-note';note.textContent='관련 기준의 일부를 연습하는 모형입니다. 학년은 앱 편성이며, 학교·교과서의 시험 범위가 우선입니다. 모형 관찰은 실제 실험·측정을 모두 대신하지 않습니다.';
 const back=document.createElement('a');back.href='../?grade='+encodeURIComponent(m.grades[0]);back.textContent=m.grades[0]+' 시험 대비 목록 →';
 aside.append(title,line,note,back);document.querySelector('.page-header,.page-heading')?.after(aside);
 const base=document.currentScript.src;const extra=document.createElement('script');extra.src=new URL('supplement-extra.js?v=1',base);
 const mount=()=>{const supplement=document.createElement('script');supplement.src=new URL('supplement-labs.js?v=2',base);document.body.append(supplement);};
 extra.onload=mount;extra.onerror=mount;document.body.append(extra);
})();
