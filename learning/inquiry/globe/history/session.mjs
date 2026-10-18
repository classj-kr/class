// Map coordinates below are a layout adapter for an atlas figure, not geographic
// coordinates. Keeping the atlas projection avoids invented historical borders.
export const inverseMercator=y=>Math.atan(Math.sinh(y*Math.PI/180))*180/Math.PI;
export function figurePoint(crop,point){const [x0,y0,x1,y1]=crop;return [(point[0]-(x0+x1)/2)/(x1-x0)*100,inverseMercator(((y0+y1)/2-point[1])/(x1-x0)*100)];}
export function figureCorners(crop){const [x0,y0,x1,y1]=crop;return [[x0,y0],[x1,y0],[x1,y1],[x0,y1]].map(p=>figurePoint(crop,p));}
export function shuffle(items,random=Math.random){const copy=items.slice();for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
export function createAttempt(question,random=Math.random){return {id:question.id,choices:shuffle(question.choices.map((text,index)=>({text,index})),random),tried:[],solved:false,revealed:false,firstCorrect:null};}
export function answerAttempt(attempt,question,index){
  if(!Number.isInteger(index)||index<0||index>=question.choices.length||attempt.solved||attempt.revealed||attempt.tried.includes(index))return attempt;
  const correct=index===question.answer;
  return {...attempt,tried:[...attempt.tried,index],solved:correct,firstCorrect:attempt.firstCorrect??correct};
}
export function revealAttempt(attempt){return {...attempt,revealed:true,firstCorrect:attempt.firstCorrect??false};}
export function shouldShowSolution(attempt){return attempt.solved||attempt.revealed;}
export function recordAttempt(saved,attempt){return {...saved,[attempt.id]:{attempts:(saved[attempt.id]?.attempts||0)+1,mastered:attempt.firstCorrect===true&&!attempt.revealed}};}
export const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
