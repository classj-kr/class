import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const batchFiles = ['hanja-v2-lessons-01.json', 'hanja-v2-lessons-02.json', 'hanja-v2-lessons-03.json', 'hanja-v2-lessons-04.json', 'hanja-v2-lessons-05.json', 'hanja-v2-lessons-06.json', 'hanja-v2-lessons-07.json'];
const outputDir = path.join(repoRoot, 'learning', 'literacy-numeracy', 'hanja-meaning', 'v2');
const rawLessons = batchFiles.flatMap((name) => JSON.parse(fs.readFileSync(path.join(repoRoot, 'scripts', name), 'utf8')));

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function jsonForHtml(value) {
  return JSON.stringify(value).replaceAll('<', '\u003c').replaceAll('>', '\u003e').replaceAll('&', '\u0026');
}

function subjectParticle(reading) {
  const last = reading.at(-1);
  if (!last) return '가';
  const code = last.charCodeAt(0) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 ? '이' : '가';
}

const learned = new Set();
const lessons = rawLessons.map((lesson, index) => {
  const characters = [...lesson.term];
  const newCharacters = characters.filter((character) => !learned.has(character));
  characters.forEach((character) => learned.add(character));
  return { ...lesson, number: index + 1, newCharacters };
});

const stageSize = 14;
const stages = Array.from({ length: Math.ceil(lessons.length / stageSize) }, (_, index) => ({
  number: index + 1,
  title: `${index + 1}단계`,
  start: index * stageSize + 1,
  end: Math.min((index + 1) * stageSize, lessons.length)
}));

function getStageLessons(stage) {
  return lessons.filter((lesson) => lesson.number >= stage.start && lesson.number <= stage.end);
}

const stageHtml = stages.map((stage) => {
  const stageLessons = getStageLessons(stage);
  const listId = `stage-list-${stage.number}`;
  const items = stageLessons.map((lesson) => `
          <a class="lesson-item" href="./${String(lesson.number).padStart(3, '0')}/">
            <span class="lesson-number">${String(lesson.number).padStart(3, '0')}</span>
            <span class="lesson-term" aria-label="${escapeHtml(lesson.reading)}">${[...lesson.term].join(' ')}</span>
            <span class="lesson-copy"><strong>${escapeHtml(lesson.reading)}</strong><small>${escapeHtml(lesson.theme)}</small></span>
          </a>`).join('');
  return `
      <section class="stage">
        <div class="stage-head">
          <button class="stage-toggle" type="button" aria-expanded="false" aria-controls="${listId}">${stage.title}</button>
          <a class="stage-quiz" href="./quiz/${String(stage.number).padStart(2, '0')}/">문제 풀기</a>
        </div>
        <ol class="lesson-list" id="${listId}" start="${stage.start}" hidden>${items}
        </ol>
      </section>`;
}).join('');

const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>한자 진도표 | 기초학력</title>
<style>
@font-face{font-family:KleeHanja;src:url("../../../../assets/fonts/klee-one/KleeOne-SemiBold.ttf") format("truetype");font-display:swap}:root{--paper:#f7f5ef;--card:#fffdf8;--ink:#202630;--muted:#68717a;--line:#d8d4ca;--blue:#245f8d;--soft:#eaf2f7}*{box-sizing:border-box}body{margin:0;min-width:320px;color:var(--ink);background:#ded8ca url("../assets/hanja-background.webp") center/cover fixed no-repeat;font-family:"Noto Serif KR","Batang",serif}body:before{content:"";position:fixed;inset:0;background:rgba(247,245,239,.84);pointer-events:none}.page{position:relative;width:min(1060px,100%);min-height:100svh;margin:auto;padding:8px clamp(16px,3vw,36px) 32px}.utility{min-height:44px;display:flex;align-items:center;justify-content:space-between;gap:16px}.back{min-height:44px;display:inline-flex;align-items:center;color:var(--blue);font:700 14px system-ui,sans-serif;text-decoration:none}.count{color:var(--muted);font:700 14px system-ui,sans-serif;white-space:nowrap}.stages{display:grid;gap:9px}.stage{overflow:hidden;border:1px solid var(--line);border-radius:9px;background:rgba(255,253,248,.96)}.stage-head{min-height:54px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:8px;padding:4px 8px 4px 0}.stage-toggle{min-height:46px;padding:0 14px;border:0;background:transparent;color:var(--ink);font:800 17px "Noto Serif KR","Batang",serif;text-align:left;cursor:pointer}.stage-toggle:after{content:"⌄";display:inline-block;margin-left:8px;color:var(--muted);font-family:system-ui,sans-serif;transform:rotate(-90deg)}.stage-toggle[aria-expanded=true]:after{transform:rotate(0)}.stage-quiz{min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 16px;border-radius:7px;color:white;background:var(--blue);font:800 14px system-ui,sans-serif;text-decoration:none}.lesson-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin:0;padding:0 10px 10px;list-style:none;border-top:1px solid var(--line)}.lesson-list[hidden]{display:none}.lesson-item{min-height:68px;color:inherit;text-decoration:none;display:grid;grid-template-columns:36px auto minmax(0,1fr);align-items:center;gap:14px;padding:9px 12px;border-bottom:1px solid #e4e0d7;transition:background-color .15s ease}.lesson-item:hover{background:rgba(36,95,141,.05)}.lesson-item:nth-child(odd){border-right:1px solid var(--line)}.lesson-number{color:var(--muted);font:800 12px system-ui,sans-serif}.lesson-term{color:var(--blue);font:600 26px/1.1 KleeHanja,serif;letter-spacing:0.06em;white-space:nowrap}.lesson-copy{min-width:0;display:grid;gap:3px}.lesson-copy strong{font-size:15px;color:var(--ink);line-height:1.3}.lesson-copy small{overflow:hidden;color:var(--muted);font-size:13px;line-height:1.3;text-overflow:ellipsis;white-space:nowrap}.stage-toggle:focus-visible,.stage-quiz:focus-visible,.back:focus-visible,.lesson-item:focus-visible{outline:3px solid #77a9cb;outline-offset:2px}@media(max-width:720px){.lesson-list{grid-template-columns:1fr}.lesson-item:nth-child(odd){border-right:0}}@media(max-width:500px){.lesson-item{grid-template-columns:30px auto minmax(0,1fr);gap:10px;padding:8px}.lesson-term{font-size:22px}.stage-quiz{padding:0 12px}}
</style></head><body><main class="page"><nav class="utility" aria-label="진도표 도구"><span class="count">${lessons.length}차시 · ${learned.size}자</span><a class="back" href="../../../../">학습 홈</a></nav><section class="stages" aria-label="단계별 진도">${stageHtml}</section></main><script>document.querySelectorAll('.stage-toggle').forEach((button)=>button.addEventListener('click',()=>{const list=document.getElementById(button.getAttribute('aria-controls'));const expanded=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!expanded));list.toggleAttribute('hidden',expanded)}));</script></body></html>`;

function createQuizPage(stage) {
  const stageLessons = getStageLessons(stage);
  const quizQuestions = stageLessons.flatMap((lesson) => lesson.questions.map((question) => {
    const character = lesson.characters.find((item) => item.character === question.target);
    const reading = character?.reading || '';
    return {
      target: question.target,
      reading,
      // 같은 소리 다른 한자 낱말이 없는 글자는 훈음을 고르는 문제(type: 'huneum')로 낸다.
      prompt: question.type === 'huneum' ? `${question.target}의 훈과 음으로 알맞은 것은?` : `${question.target}(${reading})${subjectParticle(reading)} 들어가지 않은 말은?`,
      note: question.note,
      options: question.options.map((option, optionIndex) => ({
        word: option[0],
        sentence: option[2],
        correct: optionIndex === question.answer
      }))
    };
  }));
  const data = jsonForHtml(quizQuestions);
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${stage.title} 문제 풀기 | 한자</title><style>
:root{--card:#fffdf8;--ink:#202630;--muted:#68717a;--line:#d8d4ca;--blue:#245f8d;--soft:#eaf2f7;--good:#226847;--bad:#a43d36}*{box-sizing:border-box}body{margin:0;min-width:320px;color:var(--ink);background:#ded8ca url("../../../assets/hanja-background.webp") center/cover fixed no-repeat;font-family:"Noto Serif KR","Batang",serif}body:before{content:"";position:fixed;inset:0;background:rgba(247,245,239,.84);pointer-events:none}.page{position:relative;width:min(860px,100%);min-height:100svh;margin:auto;padding:8px clamp(16px,4vw,34px) 30px}.topbar{min-height:44px;display:flex;align-items:center;justify-content:space-between;gap:16px}.topbar strong{font-size:18px}.back{min-height:44px;display:inline-flex;align-items:center;color:var(--blue);font:800 14px system-ui,sans-serif;text-decoration:none}.status{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:4px 0 8px;color:var(--muted);font:800 14px system-ui,sans-serif}.progress-track{height:7px;overflow:hidden;border-radius:999px;background:#dfe5e8}.progress-bar{display:block;width:0;height:100%;background:var(--blue);transition:width .2s}.card{margin-top:12px;padding:clamp(16px,3vw,24px);border:1px solid var(--line);border-radius:10px;background:rgba(255,253,248,.97)}.question-number{margin:0 0 8px;color:var(--muted);font:800 13px system-ui,sans-serif}.prompt{margin:0 0 16px;font-size:clamp(20px,3vw,25px);line-height:1.45}.choices{display:grid;gap:8px}.choice{min-height:54px;padding:10px 12px;border:1px solid var(--line);border-radius:8px;background:transparent;color:var(--ink);font:inherit;line-height:1.55;text-align:left;cursor:pointer}.choice:hover{background:var(--soft)}.choice:disabled{cursor:default}.choice.correct{color:var(--good);border-color:var(--good);background:#eaf5ee}.choice.wrong{color:var(--bad);border-color:var(--bad);background:#fbeceb}.feedback{min-height:48px;margin:12px 0 0;line-height:1.55}.actions{display:flex;justify-content:flex-end;margin-top:10px}.primary{min-height:46px;padding:0 20px;border:0;border-radius:8px;color:white;background:var(--blue);font:800 15px system-ui,sans-serif;cursor:pointer}.primary[hidden],.card[hidden],.result[hidden]{display:none}.result{margin-top:12px;padding:28px 20px;border:1px solid var(--line);border-radius:10px;background:rgba(255,253,248,.97);text-align:center}.result h1{margin:0 0 8px;font-size:25px}.result-score{margin:8px 0 20px;color:var(--blue);font:800 34px system-ui,sans-serif}.choice:focus-visible,.primary:focus-visible,.back:focus-visible{outline:3px solid #77a9cb;outline-offset:2px}@media(max-width:600px){.card{padding:15px}.choice{min-height:58px}}
</style></head><body><main class="page"><header class="topbar"><strong>${stage.title} 문제 풀기</strong><a class="back" href="../../">진도표</a></header><section id="quiz"><div class="status"><span id="progress"></span><span id="score"></span></div><div class="progress-track" aria-hidden="true"><span class="progress-bar" id="progress-bar"></span></div><article class="card" id="question-card"><p class="question-number" id="question-number"></p><h1 class="prompt" id="prompt"></h1><div class="choices" id="choices"></div><p class="feedback" id="feedback" aria-live="polite"></p><div class="actions"><button class="primary" id="next" type="button" hidden>다음 문제</button></div></article><section class="result" id="result" hidden><h1>${stage.title} 완료</h1><p>이 단계의 문제를 모두 풀었습니다.</p><p class="result-score" id="result-score"></p><button class="primary" id="restart" type="button">다시 풀기</button></section></section></main><script type="application/json" id="quiz-data">${data}</script><script>
const labels=['①','②','③','④'];const source=JSON.parse(document.getElementById('quiz-data').textContent);const card=document.getElementById('question-card');const result=document.getElementById('result');const progress=document.getElementById('progress');const scoreText=document.getElementById('score');const bar=document.getElementById('progress-bar');const questionNumber=document.getElementById('question-number');const prompt=document.getElementById('prompt');const choices=document.getElementById('choices');const feedback=document.getElementById('feedback');const next=document.getElementById('next');let questions=[];let current=0;let score=0;let answered=false;
function shuffle(items){const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
function escapeText(value){return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')}
function sentenceHtml(option){return escapeText(option.sentence).replace('{{'+escapeText(option.word)+'}}','<u>'+escapeText(option.word)+'</u>')}
function start(){questions=shuffle(source).map((question)=>({...question,options:shuffle(question.options)}));current=0;score=0;result.hidden=true;card.hidden=false;show()}
function show(){answered=false;const question=questions[current];progress.textContent=(current+1)+' / '+questions.length;scoreText.textContent='맞힌 문제 '+score;bar.style.width=(current/questions.length*100)+'%';questionNumber.textContent='문제 '+(current+1);prompt.textContent=question.prompt;feedback.textContent='';next.hidden=true;choices.replaceChildren();question.options.forEach((option,index)=>{const button=document.createElement('button');button.type='button';button.className='choice';button.innerHTML=labels[index]+' '+sentenceHtml(option);button.addEventListener('click',()=>answer(index));choices.append(button)})}
function answer(selected){if(answered)return;const question=questions[current];const buttons=[...choices.children];const correct=question.options[selected].correct;if(!correct){buttons[selected].classList.add('wrong');buttons[selected].disabled=true;feedback.textContent='다시 생각해 보세요.';return}answered=true;score+=1;question.options.forEach((option,index)=>{buttons[index].disabled=true;if(option.correct)buttons[index].classList.add('correct')});scoreText.textContent='맞힌 문제 '+score;feedback.textContent='맞았습니다. '+question.note;next.textContent=current===questions.length-1?'결과 보기':'다음 문제';next.hidden=false;next.focus()}
function advance(){current+=1;if(current<questions.length){show();return}card.hidden=true;result.hidden=false;bar.style.width='100%';progress.textContent=questions.length+' / '+questions.length;document.getElementById('result-score').textContent=score+' / '+questions.length;document.getElementById('restart').focus()}
next.addEventListener('click',advance);document.getElementById('restart').addEventListener('click',start);start();
</script></body></html>`;
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'index.html'), html, 'utf8');
for (const stage of stages) {
  const quizDir = path.join(outputDir, 'quiz', String(stage.number).padStart(2, '0'));
  fs.mkdirSync(quizDir, { recursive: true });
  fs.writeFileSync(path.join(quizDir, 'index.html'), createQuizPage(stage), 'utf8');
}
console.log(`Built Hanja v2 progress and ${stages.length} stage quizzes: ${lessons.length} lessons, ${learned.size} characters.`);