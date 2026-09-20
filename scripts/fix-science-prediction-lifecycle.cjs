const fs=require('node:fs'),path=require('node:path');
const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'lab-ui.js',s=>replace(s,'(() => {',`(() => {
 // A verdict belongs to the submitted answer, never to a subsequently edited answer.
 window.scienceInvalidatePrediction=()=>{
  const empty=document.getElementById('resultEmpty'),content=document.getElementById('resultContent'),feedback=document.getElementById('predictionResult');
  if(empty)empty.hidden=false;if(content)content.hidden=true;
  if(feedback){feedback.textContent='';feedback.classList.remove('correct','wrong','incorrect');delete feedback.dataset.correct;}
 };
 document.addEventListener('change',event=>{
  const input=event.target;
  if(!input.matches('.quiz-card input[type="radio"]'))return;
  const card=input.closest('.quiz-card'),feedback=card.querySelector('.answer-result'),why=card.querySelector('.answer-explanation');
  delete card.dataset.state;
  if(feedback){feedback.textContent='';feedback.classList.remove('correct','wrong','incorrect');}
  if(why)why.hidden=true;
 });`));
let handlers=0,builders=0;
for(const slug of fs.readdirSync(lab)){
 const file=lab+slug+'/app.js';if(!fs.existsSync(file)||slug==='circuit-bulbs')continue;
 edit(file,s=>{
  const pattern=/(?:state\.)?prediction\s*=\s*(?:button|b)\.dataset\.prediction;/g;
  const found=[...s.matchAll(pattern)];if(!found.length)return s;if(found.length!==1)throw Error('Review multiple handlers: '+slug);
  const checked=/state\.checked/.test(s);
  s=s.replace(pattern,assignment=>assignment+(checked?' state.checked = false;':'')+' window.scienceInvalidatePrediction?.();');handlers++;
  if(s.includes('function buildPrediction() {')){s=replace(s,'function buildPrediction() {','function buildPrediction() {\n        state.prediction = null;\n        window.scienceInvalidatePrediction?.();');builders++;}
  return s;
 });
}
edit(lab+'geologic-time/app.js',s=>s.replaceAll('80 % 넘게 남음','80 % 남음').replaceAll('마리','개체').replace('remaining >= 75','remaining >= 80'));
console.log({handlers,builders});apply();
