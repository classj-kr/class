(() => {
"use strict";
const id = new URLSearchParams(location.search).get("lesson");
const entry = (window.COMPUTER_LESSON_INDEX || []).find(x => x.id === id);
const data = window.COMPUTER_EDITION_DATA?.[id];
if (!entry || !data) return;
const key = "classj:textbook:" + id + ":v1";
const questions = [data.labCheck, ...data.apply.fields, ...data.checks];
const fresh = () => ({version:1, labUsed:false, answers:questions.map(() => ({selected:null, attempts:0, solved:false, firstCorrect:false})), completed:false});
let progress = fresh();
try {
 const saved = JSON.parse(localStorage.getItem(key) || "null");
 if (saved?.version === 1 && Array.isArray(saved.answers) && saved.answers.length === questions.length) {
  progress.labUsed = saved.labUsed === true;
  progress.answers = saved.answers.map((a,i) => ({
   selected: Number.isInteger(a?.selected) && a.selected >= 0 && a.selected < questions[i].options.length ? a.selected : null,
   attempts: Number.isInteger(a?.attempts) && a.attempts > 0 ? a.attempts : 0,
   solved: a?.solved === true && a.attempts > 0,
   firstCorrect: a?.firstCorrect === true && a.attempts > 0
  }));
 }
} catch (_) {}
const node = (tag, cls, text) => { const el=document.createElement(tag); if(cls)el.className=cls; if(text!==undefined)el.textContent=text; return el; };
const root = node("main", "edition-shell");
root.id="edition";
const header=node("header","edition-header");
const back=node("a","edition-back","←"); back.href="../"; back.setAttribute("aria-label","차시 목록");
header.append(back,node("h1","",entry.number+"차시. "+entry.title));
const count=node("span","edition-progress"); count.id="editionProgress"; count.setAttribute("aria-live","polite");header.append(count);
const nav=node("nav","edition-nav"); nav.setAttribute("aria-label","차시 학습 단계");
const pages={};
const labels={read:"본문",lab:"실습",apply:"적용",check:"확인"};
Object.entries(labels).forEach(([name,label])=>{
 const button=node("button","",label);button.type="button";button.dataset.page=name;button.setAttribute("aria-controls","edition-"+name);nav.append(button);
 const page=node("section","edition-page");page.id="edition-"+name;page.hidden=true;pages[name]=page;
 button.addEventListener("click",()=>{if(location.hash!=="#"+name)location.hash=name;else show(name);});
});
root.append(header,nav,...Object.values(pages));
document.body.append(root);
document.body.classList.add("computer-edition");
document.querySelector(".app-bar").hidden=true;
document.querySelector(".lesson-shell").hidden=true;
document.getElementById("courseDialog").hidden=true;
const notice=node("p","edition-save-note");
notice.hidden=true;
root.append(notice);
const seen=new Set();
function bilingual(text) {
 const fragment=document.createDocumentFragment();
 const terms=[...data.terms].sort((a,b)=>b[0].length-a[0].length);
 let rest=text;
 while(rest.length){
  let match=null;
  for(const term of terms){
   if(seen.has(term[0]))continue;
   const at=rest.indexOf(term[0]);
   if(at>=0 && (!match || at<match.at))match={term,at};
  }
  if(!match){fragment.append(rest);break;}
  fragment.append(rest.slice(0,match.at));
  const mark=node("span","edition-term",match.term[0]+"("+match.term[1]+")");
  fragment.append(mark);seen.add(match.term[0]);rest=rest.slice(match.at+match.term[0].length);
 }
 return fragment;
}
const reading=node("article","edition-reading");
reading.append(node("h2","",data.case));
data.body.forEach(text=>{const p=node("p");p.append(bilingual(text));reading.append(p);});
const glossary=node("dl","edition-glossary");
data.terms.forEach(([ko,en,definition])=>{
 const row=node("div"); const dt=node("dt","",ko);dt.append(node("span","",en));row.append(dt,node("dd","",definition));glossary.append(row);
});
reading.append(glossary);
pages.read.append(reading);
function nextButton(page,target,text){
 const wrap=node("div","edition-page-end");const button=node("button","",text);button.type="button";button.addEventListener("click",()=>location.hash=target);wrap.append(button);page.append(wrap);
}
nextButton(pages.read,"lab","실습으로");
pages.lab.append(node("h2","","실습"),node("p","edition-task",data.lab));
const lab=node("div","edition-lab");lab.id="editionLab";
["conceptParts","conceptVisual","conceptDiagram"].forEach(name=>{
 const existing=document.getElementById(name);
 if(existing?.childNodes.length)lab.append(existing);
});
pages.lab.append(lab);
const labNote=node("p","edition-note","화면 속 기기와 기록은 실습 모형입니다. 실습 조작 상태는 다시 열면 초기화되고, 답 확인 기록은 이 브라우저에 저장됩니다.");
pages.lab.append(labNote);
const recordLab=event=>{
 if(!event.target.closest("button,input,select,[role=button],[draggable=true],canvas"))return;
 if(!progress.labUsed){progress.labUsed=true;save();}
};
["click","input","change","pointerup","keydown"].forEach(event=>lab.addEventListener(event,recordLab));
pages.apply.append(node("h2","","새 상황에 적용하기"),node("p","edition-scenario",data.apply.scenario));
const table=node("table","edition-evidence");
const caption=node("caption","","상황 기록");table.append(caption);
const tbody=node("tbody");
data.apply.rows.forEach(([label,evidence])=>{const tr=node("tr");const th=node("th","",label);th.scope="row";tr.append(th,node("td","",evidence));tbody.append(tr);});
table.append(tbody);pages.apply.append(table);
pages.check.append(node("h2","","확인 문제"));
const feedbacks=[];
function orderFor(index,length){
 // Stable across reloads; stored selections always use the original option index.
 let seed=[...id].reduce((s,c)=>Math.imul(s,31)+c.charCodeAt(0),index+17)>>>0;
 const order=Array.from({length},(_,i)=>i);
 for(let i=length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[order[i],order[j]]=[order[j],order[i]];}
 return order;
}
function question(q,index,parent,label){
 const form=node("form","edition-question");form.dataset.question=index;
 const fieldset=node("fieldset");const legend=node("legend");legend.append(node("small","edition-question-label",label),document.createTextNode(q.text));fieldset.append(legend);
 orderFor(index,q.options.length).forEach(canonical=>{
  const choice=node("label","edition-option");const radio=node("input");
  radio.type="radio";radio.name="edition-q"+index;radio.value=canonical;radio.checked=progress.answers[index].selected===canonical;
  radio.addEventListener("change",()=>{
   progress.answers[index].selected=canonical;
   feedbacks[index].textContent="";
   save();
  });
  choice.append(radio,node("span","",q.options[canonical][0]));fieldset.append(choice);
 });
 const feedback=node("p","edition-feedback");feedback.setAttribute("aria-live","polite");feedbacks[index]=feedback;
 const button=node("button","edition-submit","답 확인");button.type="submit";
 form.append(fieldset,button,feedback);parent.append(form);
 form.addEventListener("submit",event=>{
  event.preventDefault();
  const a=progress.answers[index];
  if(a.selected===null){feedback.textContent="답을 하나 선택하세요.";return;}
  if(index===0&&!progress.labUsed){feedback.textContent="위 실습에서 조건을 바꾸거나 실행한 뒤 답을 확인하세요.";return;}
  const correct=a.selected===q.answer;
  if(a.attempts===0)a.firstCorrect=correct;
  a.attempts++;
  if(correct)a.solved=true;
  feedback.dataset.correct=String(correct);
  feedback.textContent=(correct?"맞습니다. ":"다시 판단해 보세요. ")+q.options[a.selected][1];
  save();update();
 });
 if(progress.answers[index].solved){
  feedback.textContent="이전에 해결한 문항입니다. "+q.options[q.answer][1];
  feedback.dataset.correct="true";
 }
}
question(data.labCheck,0,pages.lab,"실습 확인");
nextButton(pages.lab,"apply","적용으로");
data.apply.fields.forEach((q,i)=>question(q,i+1,pages.apply,"적용 "+(i+1)));
nextButton(pages.apply,"check","확인 문제로");
data.checks.forEach((q,i)=>question(q,i+3,pages.check,"문제 "+(i+1)));
const result=node("p","edition-result");result.setAttribute("aria-live","polite");pages.check.append(result);
const footer=node("div","edition-page-end");
const reset=node("button","edition-reset","이 차시 기록 지우기");reset.type="button";
reset.addEventListener("click",()=>{
 if(!confirm("이 차시의 새 교재 답 확인 기록을 지울까요?"))return;
 progress=fresh();save();location.reload();
});
footer.append(reset);
const index=(window.COMPUTER_LESSON_INDEX||[]).findIndex(x=>x.id===id);
const next=(window.COMPUTER_LESSON_INDEX||[])[index+1];
const link=node("a","edition-next",next?"다음 차시 →":"차시 목록 →");link.href=next?"?lesson="+next.id:"../";footer.append(link);
pages.check.append(footer);
function completedGroups(){
 return [progress.labUsed&&progress.answers[0].solved,progress.answers.slice(1,3).every(a=>a.solved),progress.answers.slice(3).every(a=>a.solved)];
}
function save(){
 progress.completed=completedGroups().every(Boolean);
 try{localStorage.setItem(key,JSON.stringify(progress));}
 catch(_){notice.hidden=false;notice.textContent="이 브라우저에서는 기록을 저장할 수 없습니다. 현재 화면의 실습과 답 확인은 계속할 수 있습니다.";}
}
function update(){
 const groups=completedGroups();
 count.textContent=groups.filter(Boolean).length+" / 3";
 [...nav.children].forEach(button=>{
  const group={lab:0,apply:1,check:2}[button.dataset.page];
  button.textContent=labels[button.dataset.page]+(group!==undefined&&groups[group]?" ✓":"");
 });
 root.querySelectorAll(".edition-question").forEach((form,i)=>form.dataset.solved=String(progress.answers[i].solved));
 const first=progress.answers.slice(3).filter(a=>a.firstCorrect).length;
 result.textContent="실습 확인 "+(groups[0]?"완료":"미완료")+" · 적용 "+(groups[1]?"완료":"미완료")+" · 확인 문제 "+progress.answers.slice(3).filter(a=>a.solved).length+"/2. 확인 문제 첫 답 정답 "+first+"/2.";
}
function show(name){
 const active=pages[name]?name:"read";
 Object.entries(pages).forEach(([key,page])=>page.hidden=key!==active);
 [...nav.children].forEach(button=>{
  if(button.dataset.page===active)button.setAttribute("aria-current","page");
  else button.removeAttribute("aria-current");
 });
 if(active==="lab")requestAnimationFrame(()=>window.dispatchEvent(new Event("resize")));
 window.scrollTo(0,0);
}
window.addEventListener("hashchange",()=>show(location.hash.slice(1)));
update();show(location.hash.slice(1));
})();