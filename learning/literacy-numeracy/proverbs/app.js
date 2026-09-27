"use strict";

const decks = window.PROVERB_BANKS;
const $ = (id) => document.getElementById(id);
const LESSONS = {
ko: [
    ["말의 힘과 소통", "말의 영향·소문·표현 방식", /가는 말|낮말|말 한마디|발 없는 말|아니 땐|말이 씨|아 다르고|입은 비뚤|제 말 하면/],
    ["협력과 관계", "도움·신뢰·편들기·관계", /백지장|고래 싸움|웃는 얼굴|친구|가재|누이|사촌|손뼉|팔은 안으로|믿는 도끼/],
    ["꾸준함과 성장", "작은 노력·연습·성장", /티끌|시작이 반|공든|서당 개|열 번 찍어|천 리 길|가랑비|고생 끝|구슬이 서 말|낙숫물|한 술 밥/],
    ["준비와 신중함", "확인·예방·침착한 준비", /돌다리|소 잃고|아는 길|급할수록|호미로|우물가에서 숭늉|김칫국/],
    ["실수와 실패", "방심·실패·뒤늦은 후회", /원숭이|자라 보고|닭 쫓던|다 된 죽|혹 떼러|산 넘어 산/],
    ["용기와 위기", "위험·도전·위기 대처", /호랑이 굴|정신만 차리면|하늘이 무너져도|바람 앞|구더기 무서워|고양이 목/],
    ["욕심과 이해관계", "욕심·기대·이익과 손해", /배보다 배꼽|꿩 먹고|남의 떡|말 타면|달면 삼키고|물에 빠진 사람|금강산/],
    ["겉모습과 실속", "겉과 속·본질을 보는 눈", /그림의 떡|빈 수레|제 눈에 안경|빛 좋은|수박 겉|눈 가리고|보기 좋은 떡|옷이 날개/],
    ["원인과 결과", "행동·습관이 만드는 결과", /세 살 버릇|누워서 침|바늘 도둑|콩 심은|병 주고|닭 잡아먹고|핑계 없는/],
    ["재능과 겸손", "능력·경험·겸손한 태도", /될성부른|작은 고추|하나를 보면|하룻강아지|올챙이|공자 앞|굼벵이|뛰는 놈|벼는 익을수록|호랑이 없는 골/],
    ["선택과 대안", "목적·방법·대안을 고르는 지혜", /모로 가도|꿩 대신|목마른|구관이 명관|부뚜막의 소금|백문이|우물 안 개구리/],
    ["비교와 한계", "쉬움·어려움·차이를 판단하기", /누워서 떡|도토리|하늘의 별|계란으로|오르지 못할|세월 앞/],
    ["공정과 책임", "잘못·책임·갈등을 대하는 태도", /똥 묻은|사공이 많으면|종로에서|불난 집|지렁이|모난 돌|재주는 곰/],
    ["관찰과 앎", "가까운 사실·배움·깨달음", /등잔 밑|낫 놓고/],
    ["때와 기회", "알맞은 때·뜻밖의 기회", /쇠뿔도|가는 날이|쥐구멍/],
    ["사람과 형편", "사람의 속마음·처지·만남", /가지 많은|내 코|열 길|원수는/]
  ],
  en: [
    ["Effort and growth", "Practice, courage, and steady progress", ["Practice makes perfect.", "Where there is a will, there is a way.", "No pain, no gain.", "Slow and steady wins the race.", "When the going gets tough, the tough get going.", "Fortune favors the bold."]],
    ["Time and opportunity", "Timing, patience, preparation, and change", ["The early bird catches the worm.", "Better late than never.", "Time flies.", "Good things come to those who wait.", "Strike while the iron is hot.", "Prevention is better than cure."]],
    ["Words and knowledge", "Truth, communication, learning, and influence", ["Actions speak louder than words.", "Honesty is the best policy.", "Knowledge is power.", "The pen is mightier than the sword.", "A picture is worth a thousand words.", "Barking dogs seldom bite."]],
    ["Cooperation and community", "Teamwork, friendship, similarity, and customs", ["Two heads are better than one.", "A friend in need is a friend indeed.", "Many hands make light work.", "Birds of a feather flock together.", "Great minds think alike.", "Too many cooks spoil the broth."]],
    ["Careful choices", "Caution, risk, planning, and learning from experience", ["Look before you leap.", "Haste makes waste.", "Curiosity killed the cat.", "Once bitten, twice shy.", "Don't count your chickens before they hatch.", "Don't put all your eggs in one basket."]],
    ["Results and resources", "Gain, loss, saving, limits, and satisfaction", ["Easy come, easy go.", "A penny saved is a penny earned.", "You can't have your cake and eat it too.", "Beggars can't be choosers.", "The grass is always greener on the other side."]],
    ["Hope and well-being", "Hope, healing, joy, invention, and variety", ["Every cloud has a silver lining.", "Time heals all wounds.", "Laughter is the best medicine.", "Necessity is the mother of invention.", "Variety is the spice of life."]],
    ["Family and belonging", "Family ties, home, loyalty, and social customs", ["Absence makes the heart grow fonder.", "Blood is thicker than water.", "Home is where the heart is.", "When in Rome, do as the Romans do.", "Don't bite the hand that feeds you."]],
    ["Values and perspectives", "Judgment, beauty, health, and personal choice", ["Don't judge a book by its cover.", "Beauty is in the eye of the beholder.", "Cleanliness is next to godliness.", "You can lead a horse to water, but you can't make it drink.", "An apple a day keeps the doctor away."]]
  ]
};
let language = "ko", lessonIndex = 0, mode = "study";
let studyBatch = [], studyPosition = 0, quizOrder = [], quizPosition = 0;
let currentChoices = null, correct = 0, attempts = 0, questionHadWrong = false;
let completed = loadCompleted();

function shuffle(items) { const a=[...items]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function key() { return "class-proverb-lessons-" + language; }
function loadCompleted() { try { return new Set(JSON.parse(localStorage.getItem("class-proverb-lessons-" + language) || "[]")); } catch (_) { return new Set(); } }
function lessonFor(item) { const text=item.proverb+" "+item.meaning; const lessons=LESSONS[language]; for(let i=0;i<lessons.length;i++){const matcher=lessons[i][2];if(Array.isArray(matcher)?matcher.includes(item.proverb):matcher.test(text))return i;} return lessons.length-1; }
function lessonItems(index) { return decks[language].filter((item)=>lessonFor(item)===index); }

function renderLessonList() {
  const lessons=LESSONS[language];
  $("completionSummary").textContent=completed.size+" / "+lessons.length+(language==="ko"?" 완료":" complete");
  $("lessonList").replaceChildren(...lessons.map((lesson,index)=>{
    const items=lessonItems(index), button=document.createElement("button"); button.type="button"; button.className="lesson-item";
    button.innerHTML='<span class="lesson-number">'+String(index+1).padStart(2,"0")+'</span><span class="lesson-copy"><strong>'+lesson[0]+'</strong><small>'+lesson[1]+'</small><em>'+items.slice(0,3).map(x=>x.proverb).join(" · ")+'</em></span><span class="lesson-meta">'+items.length+(language==="ko"?"개":"")+(completed.has(index)?'<b>✓ '+(language==="ko"?"완료":"done")+'</b>':"")+'</span>';
    button.addEventListener("click",()=>startLesson(index)); return button;
  }));
}
function prepareLesson() { studyBatch=decks[language].map((_,i)=>i).filter(i=>lessonFor(decks[language][i])===lessonIndex); studyPosition=0; quizOrder=shuffle(studyBatch); quizPosition=0; correct=0; attempts=0; currentChoices=null; }
function startLesson(index){ lessonIndex=index; prepareLesson(); document.body.classList.add("learning-active"); $("lessonToolbar").hidden=true; $("lessonOverview").hidden=true; $("learningShell").hidden=false; $("currentLessonTitle").textContent=(language==="ko"?(index+1)+"차시 · ":"Lesson "+(index+1)+" · ")+LESSONS[language][index][0]; setMode("study"); }
function renderStudy(){ const item=decks[language][studyBatch[studyPosition]], en=language==="en"; $("label").textContent=(studyPosition+1)+" / "+studyBatch.length; $("proverb").textContent=item.proverb; $("literal").textContent=item.literal||""; $("literal").hidden=!item.literal; $("meaning").textContent=item.meaning; if(item.image){$("proverbIllustrationImage").src=item.image;$("proverbIllustrationImage").alt=item.proverb;$("proverbIllustrationFrame").hidden=false;}else $("proverbIllustrationFrame").hidden=true; $("example").textContent=(en?"Example: ":"예: ")+item.example; $("previous").disabled=studyPosition===0; $("next").textContent=studyPosition===studyBatch.length-1?(en?"Lesson quiz":"차시 확인 문제"):(en?"Next proverb":"다음 속담"); }
// 뜻이 비슷해 이 상황에도 들어맞는 속담(proverbs-lookalikes.js)은 오답으로 내지 않는다.
function buildChoices(correctIndex){ const deck=decks[language], lookalikes=deck[correctIndex].lookalikes||[], wrong=shuffle(deck.map((_,i)=>i).filter(i=>i!==correctIndex&&!lookalikes.includes(deck[i].proverb))).slice(0,2), ids=shuffle([correctIndex,...wrong]); return {texts:ids.map(i=>decks[language][i].proverb),answer:ids.indexOf(correctIndex)}; }
function renderQuiz(){ questionHadWrong=false; const idx=quizOrder[quizPosition],item=decks[language][idx],en=language==="en"; currentChoices=buildChoices(idx); $("quizKicker").textContent=(en?"LESSON CHECK ":"차시 확인 ")+(quizPosition+1)+" / "+quizOrder.length; $("quiz-title").hidden=true; $("question").textContent=item.question; $("feedback").textContent=""; $("reviewAnswer").hidden=true; $("nextQuestion").hidden=false; $("nextQuestion").disabled=true; $("nextQuestion").dataset.action="next"; $("nextQuestion").textContent=en?"Next question":"다음 문제"; $("choices").replaceChildren(...currentChoices.texts.map((text,i)=>{const b=document.createElement("button");b.type="button";b.textContent=text;b.addEventListener("click",()=>answer(i,b));return b;})); }
function answer(choice,button){ const buttons=[...$("choices").querySelectorAll("button")]; if(choice!==currentChoices.answer){questionHadWrong=true;button.classList.add("wrong");button.disabled=true;$("feedback").textContent=language==="ko"?"다시 생각해 보세요.":"Try again.";return;} buttons.forEach((b,i)=>{b.disabled=true;if(i===currentChoices.answer)b.classList.add("correct")}); attempts++;if(!questionHadWrong)correct++;$("score").textContent=(language==="ko"?"정답 ":"Correct ")+correct+" / "+attempts;$("feedback").textContent=language==="ko"?"정답! 뜻과 상황을 잘 연결했어요.":"Correct!";$("nextQuestion").disabled=false;$("nextQuestion").textContent=quizPosition===quizOrder.length-1?(language==="ko"?"차시 마무리":"Finish lesson"):(language==="ko"?"다음 문제":"Next question"); }
function completeQuiz(){ completed.add(lessonIndex);localStorage.setItem(key(),JSON.stringify([...completed]));$("quizKicker").textContent=language==="ko"?"차시 학습 완료":"LESSON COMPLETE";$("quiz-title").hidden=false;$("quiz-title").textContent=language==="ko"?"이번 차시를 끝냈어요!":"Great work!";$("question").textContent=quizOrder.length+(language==="ko"?"문제 중 ":" questions, ")+correct+(language==="ko"?"문제를 한 번에 맞혔습니다.":" correct on the first try.");$("choices").replaceChildren();$("feedback").textContent="";$("nextQuestion").disabled=false;$("nextQuestion").dataset.action="overview";$("nextQuestion").textContent=language==="ko"?"차시 목록으로":"Back to lessons"; }
function setMode(next){mode=next;const study=mode==="study";$("studyView").hidden=!study;$("quizView").hidden=study;$("score").hidden=study;document.querySelectorAll(".mode-tab").forEach(b=>{const a=b.dataset.mode===mode;b.classList.toggle("active",a);b.setAttribute("aria-selected",String(a));});study?renderStudy():renderQuiz();}
function showOverview(){ document.body.classList.remove("learning-active"); $("learningShell").hidden=true;$("lessonToolbar").hidden=false;$("lessonOverview").hidden=false;renderLessonList(); }

document.querySelectorAll(".language-tab").forEach(b=>b.addEventListener("click",()=>{language=b.dataset.language;lessonIndex=0;completed=loadCompleted();document.querySelectorAll(".language-tab").forEach(x=>x.classList.toggle("active",x===b));showOverview();}));
document.querySelectorAll(".mode-tab").forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.mode)));
$("backToLessons").addEventListener("click",showOverview);
$("next").addEventListener("click",()=>{if(studyPosition===studyBatch.length-1)setMode("quiz");else{studyPosition++;renderStudy();}});
$("previous").addEventListener("click",()=>{if(studyPosition>0)studyPosition--;renderStudy();});
$("nextQuestion").addEventListener("click",()=>{if($("nextQuestion").dataset.action==="overview")showOverview();else if(quizPosition===quizOrder.length-1)completeQuiz();else{quizPosition++;renderQuiz();}});
$("reviewAnswer").addEventListener("click",()=>{});
// 공용 뒤로가기 단추(assets/site-back-navigation.js)가 눌리면 먼저 물어본다.
// 차시 목록(집)이 아니면 사이트 밖으로 나가지 않고 차시 목록으로만 돌아간다.
window.addEventListener("sitebackrequest",(event)=>{
    if(document.body.classList.contains("learning-active")){event.preventDefault();showOverview();}
});
// 화면 왼쪽 위 화살표는 공용 뒤로가기 단추가 안 떠도 항상 같은 규칙으로 움직인다.
document.querySelector("a.back")?.addEventListener("click",(event)=>{
    if(document.body.classList.contains("learning-active")){event.preventDefault();showOverview();}
});
if(!decks?.ko?.length||!decks?.en?.length)throw new Error("속담 자료를 불러오지 못했습니다.");
renderLessonList();
