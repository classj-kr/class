import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const root = path.join(repoRoot, 'learning', 'literacy-numeracy', 'hanja-meaning', 'v2');
const lessons = ['hanja-v2-lessons-01.json', 'hanja-v2-lessons-02.json', 'hanja-v2-lessons-03.json', 'hanja-v2-lessons-04.json', 'hanja-v2-lessons-05.json', 'hanja-v2-lessons-06.json', 'hanja-v2-lessons-07.json'].flatMap((name) => JSON.parse(fs.readFileSync(path.join(import.meta.dirname, name), 'utf8')));
const strokes = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'hanja-strokes.json'), 'utf8'));
for (const entry of fs.readdirSync(path.join(repoRoot, 'learning', 'literacy-numeracy', 'hanja-meaning'), { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === 'v2') continue;
  const page = path.join(repoRoot, 'learning', 'literacy-numeracy', 'hanja-meaning', entry.name, 'index.html');
  if (!fs.existsSync(page)) continue;
  const html = fs.readFileSync(page, 'utf8');
  for (const set of html.matchAll(/<g class="stroke-set" data-character="([^"]+)"[^>]*>([\s\S]*?)<\/g>/g)) {
    if (strokes[set[1]]) continue;
    const paths = [...set[2].matchAll(/<path class="stroke-path" d="([^"]+)"/g)].map((match) => match[1]);
    if (paths.length) strokes[set[1]] = paths;
  }
  const singleCharacter = html.match(/<div class="hanja"[^>]*>([^<])<\/div>/)?.[1];
  if (singleCharacter && !strokes[singleCharacter]) {
    const stage = html.match(/<svg class="stroke-stage"[\s\S]*?<\/svg>/)?.[0] || '';
    const paths = [...stage.matchAll(/<path class="stroke-path"[^>]*d="([^"]+)"/g)].map((match) => match[1]);
    if (paths.length) strokes[singleCharacter] = paths;
  }
}

const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const subjectParticle = (reading) => { const last = [...reading].at(-1)?.charCodeAt(0) || 0; return last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 !== 0 ? '이' : '가'; };
// 같은 소리 다른 한자 낱말이 없는 글자는 훈음을 고르는 문제(type: 'huneum')로 낸다.
const questionPrompt = (lesson, question) => {
  const reading = lesson.characters.find((item) => item.character === question.target)?.reading || '';
  return question.type === 'huneum' ? `${question.target}의 훈과 음으로 알맞은 것은?` : `${question.target}(${reading})${subjectParticle(reading)} 들어가지 않은 말은?`;
};
const formatHunEum = (item) => (item.hunEum || [{ hun: item.meaning, eum: item.reading }]).map((form) => `${escapeHtml(form.hun)} ${escapeHtml(form.eum)}`).join(' / ');

for (const [index, lesson] of lessons.entries()) {
  const number = index + 1;
  const slug = String(number).padStart(3, '0');
  const next = number < lessons.length ? String(number + 1).padStart(3, '0') : null;
  const strokeSets = lesson.characters.map((item, itemIndex) => {
    const paths = (strokes[item.character] || []).map((d) => `<path class="stroke-path" d="${escapeHtml(d)}"/>`).join('');
    if (!paths) throw new Error(`${lesson.term}: ${item.character} 획순 데이터가 없습니다.`);
    return `<g class="stroke-set" data-character="${item.character}"${itemIndex ? ' hidden' : ''}>${paths}</g>`;
  }).join('');
  const characterButtons = lesson.characters.map((item, itemIndex) => `<button class="character-button" data-character="${item.character}" aria-pressed="${itemIndex === 0}">${item.character}</button>`).join('');
  const explanations = lesson.characters.map((item) => {
    const examples = item.examples || [];
    const renderExamples = (items) => items.map((example) => `<li><strong>${escapeHtml(example[0])} <span>${escapeHtml(example[1])}</span></strong><p>${escapeHtml(example[2])}</p></li>`).join('');
    const exampleItems = renderExamples(examples);
    return `<article class="meaning-card"><h2><span>${item.character}</span>${formatHunEum(item)}</h2><p>${escapeHtml(item.explanation)}</p>${examples.length ? `<ul class="example-list">${exampleItems}</ul>` : ''}</article>`;
  }).join('');
  const questions = lesson.questions.map((question, questionIndex) => {
    const choices = question.options.map((option, optionIndex) => {
      const sentence = escapeHtml(option[2]).replace(`{{${escapeHtml(option[0])}}}`, `<u>${escapeHtml(option[0])}</u>`);
      return `<button class="choice" data-index="${optionIndex}">${['①','②','③','④'][optionIndex]} ${sentence}</button>`;
    }).join('');
    return `<article class="question" data-answer="${question.answer}" data-note="${escapeHtml(question.note)}"><h2><span>${questionIndex + 1}</span>${questionPrompt(lesson, question)}</h2><div class="choices">${choices}</div><p class="feedback" aria-live="polite"></p></article>`;
  }).join('');
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${lesson.term} | 韓字</title><style>
@font-face{font-family:KleeHanja;src:url("../../../../../assets/fonts/klee-one/KleeOne-SemiBold.ttf") format("truetype");font-display:swap}:root{--paper:#f7f5ef;--card:#fffdf8;--ink:#202630;--muted:#68717a;--line:#d8d4ca;--blue:#245f8d;--soft:#eaf2f7;--good:#226847;--bad:#a43d36}*{box-sizing:border-box}body{margin:0;min-width:320px;color:var(--ink);background:#ded8ca url("../../assets/hanja-background.webp") center/cover fixed no-repeat;font-family:"Noto Serif KR","Batang",serif}body:before{content:"";position:fixed;inset:0;background:rgba(247,245,239,.82);pointer-events:none}.page{position:relative;width:min(1060px,100%);min-height:100svh;margin:auto;padding:14px clamp(16px,3vw,36px) 30px}.topbar{min-height:44px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line)}.topbar a{min-height:44px;display:inline-flex;align-items:center;color:var(--blue);font:700 14px system-ui,sans-serif;text-decoration:none}.lesson-no{color:var(--muted);font:700 13px system-ui,sans-serif}.hero{display:grid;grid-template-columns:minmax(240px,1fr) 210px;gap:22px;align-items:center;padding:14px 0}.term{display:flex;align-items:center;gap:18px}.term strong{font:600 clamp(54px,8vw,86px) KleeHanja,serif}.term h1{margin:0;font-size:25px}.term p{margin:5px 0 0;color:var(--muted)}.stroke-panel{display:grid;grid-template-columns:120px 1fr;gap:8px;align-items:center}.stroke-stage{width:120px;height:120px;border:1px solid var(--line);background:rgba(255,255,255,.75)}.stroke-guide{stroke:#d8d4ca;stroke-width:.6;fill:none}.stroke-set[hidden]{display:none}.stroke-path{stroke:#202630;stroke-width:3;fill:none;stroke-linecap:round;stroke-linejoin:round}.character-buttons{display:grid;gap:6px}.character-button,.play,.primary,.secondary{min-height:44px;border:1px solid var(--line);border-radius:7px;background:var(--card);font-weight:800}.character-button[aria-pressed=true]{color:white;background:var(--blue)}.play{color:var(--blue)}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.meaning-card{padding:12px 14px;border:1px solid var(--line);border-radius:9px;background:rgba(255,253,248,.96)}.meaning-card h2{display:flex;align-items:center;gap:10px;margin:0 0 5px;font-size:18px}.meaning-card h2 span{color:var(--blue);font:600 28px KleeHanja,serif}.meaning-card p{margin:0;line-height:1.55}.example-list{display:grid;gap:7px;margin:12px 0 0;padding:0;list-style:none}.example-list li{padding-top:7px;border-top:1px solid #e4e0d7}.example-list strong{font-size:15px}.example-list strong span{color:var(--blue);font-family:KleeHanja,serif}.example-list li p{margin-top:2px;color:#4e5863;font-size:14px}.actions{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}.primary,.next-link{min-height:46px;padding:0 20px;color:white;background:var(--blue);border:0;border-radius:8px;font:800 15px system-ui,sans-serif}.quiz[hidden],.lesson[hidden]{display:none}.quiz-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding-top:14px}.question{padding:14px;border:1px solid var(--line);border-radius:9px;background:rgba(255,253,248,.96)}.question h2{margin:0 0 10px;font-size:18px;line-height:1.4}.question h2 span{display:inline-grid;place-items:center;width:30px;height:30px;margin-right:8px;border:1px solid var(--ink);border-radius:50%;font:700 14px system-ui,sans-serif}.choices{display:grid;gap:6px}.choice{min-height:48px;padding:8px 10px;border:1px solid transparent;border-radius:7px;background:transparent;color:var(--ink);font:inherit;text-align:left}.choice:hover{background:var(--soft)}.choice.wrong{color:var(--bad);border-color:var(--bad)}.choice.correct{color:var(--good);border-color:var(--good);background:#eaf5ee}.feedback{min-height:23px;margin:8px 0 0;line-height:1.45}.secondary,.next-link{display:inline-flex;align-items:center;justify-content:center;padding:0 16px;color:var(--blue);background:var(--card);border:1px solid var(--line);text-decoration:none}.next-link{color:white;background:var(--blue);border:0}@media(max-width:720px){.hero{grid-template-columns:1fr}.stroke-panel{grid-template-columns:120px minmax(0,1fr)}.cards,.quiz-grid{grid-template-columns:1fr}.term strong{font-size:58px}}
</style></head><body><main class="page"><header class="topbar"><a href="../">차시 목록</a><span class="lesson-no">${number} / ${lessons.length}</span></header><section class="lesson" id="lesson"><div class="hero"><div class="term"><strong>${lesson.characters.map((item) => item.character).join(' · ')}</strong><div><h1>${lesson.characters.map((item) => escapeHtml(item.reading)).join(' · ')}</h1><p>${lesson.characters.map((item) => formatHunEum(item)).join(' · ')}</p></div></div><div class="stroke-panel"><svg class="stroke-stage" viewBox="0 0 110 110"><path class="stroke-guide" d="M55 0V110M0 55H110M0 0L110 110M110 0L0 110"/>${strokeSets}</svg><div class="character-buttons">${characterButtons}<button class="play">획순 보기</button></div></div></div><div class="cards">${explanations}</div><div class="actions"><button class="primary" id="startQuiz">문제 풀기</button></div></section><section class="quiz" id="quiz" hidden><div class="quiz-grid">${questions}</div><div class="actions"><button class="secondary" id="backLesson">설명 보기</button>${next ? `<a class="next-link" href="../${next}/">다음 차시</a>` : ''}</div></section></main><script>
(()=>{const lesson=document.querySelector('#lesson'),quiz=document.querySelector('#quiz'),sets=[...document.querySelectorAll('.stroke-set')],charButtons=[...document.querySelectorAll('.character-button')],play=document.querySelector('.play');let active=sets[0],timer=null;function select(c){sets.forEach(s=>s.toggleAttribute('hidden',s.dataset.character!==c));active=sets.find(s=>s.dataset.character===c);charButtons.forEach(b=>b.setAttribute('aria-pressed',b.dataset.character===c));reset()}function reset(){clearInterval(timer);[...active.querySelectorAll('.stroke-path')].forEach(p=>{p.style.transition='none';p.style.strokeDasharray='';p.style.strokeDashoffset=''})}charButtons.forEach(b=>b.onclick=()=>select(b.dataset.character));play.onclick=()=>{reset();const ps=[...active.querySelectorAll('.stroke-path')];ps.forEach(p=>{const n=p.getTotalLength();p.style.strokeDasharray=n;p.style.strokeDashoffset=n});let i=0;const draw=()=>{if(i>=ps.length){clearInterval(timer);return}ps[i].style.transition='stroke-dashoffset .45s ease';ps[i].style.strokeDashoffset=0;i++};draw();timer=setInterval(draw,500)};document.querySelector('#startQuiz').onclick=()=>{lesson.hidden=true;quiz.hidden=false};document.querySelector('#backLesson').onclick=()=>{quiz.hidden=true;lesson.hidden=false};document.querySelectorAll('.question').forEach(q=>{const answer=Number(q.dataset.answer),buttons=[...q.querySelectorAll('.choice')],feedback=q.querySelector('.feedback'),box=q.querySelector('.choices');for(let i=buttons.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[buttons[i],buttons[j]]=[buttons[j],buttons[i]]}buttons.forEach((b,i)=>{b.firstChild.nodeValue='①②③④'[i]+b.firstChild.nodeValue.slice(1);box.append(b)});buttons.forEach(b=>b.onclick=()=>{if(Number(b.dataset.index)!==answer){b.classList.add('wrong');b.disabled=true;feedback.textContent='다시 생각해 보세요.';return}b.classList.add('correct');buttons.forEach(x=>x.disabled=true);feedback.textContent='맞았습니다. '+q.dataset.note})})})();
</script></body></html>`;
  const out = path.join(root, slug);
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'index.html'), html, 'utf8');
}
console.log(`Built ${lessons.length} Hanja v2 pilot lessons.`);
