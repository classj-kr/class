(() => {
const node=typeof module!=='undefined';
const units=node?require('./exam-bank-meta.js'):window.scienceExamUnits;
const extra=node?require('./exam-bank-interpretation.js'):window.scienceExamInterpretation;
const raw=node?['elementary','middle','high'].map(s=>require('./exam-bank-'+s+'.js')):[window.scienceExamElementary,window.scienceExamMiddle,window.scienceExamHigh];
const questions=[...raw,extra.rows].flatMap(s=>s.split('\n')).map(line=>{
 const [id,question,correct,wrong1,wrong2,why]=line.split('|'),code=id.split('@')[0],unit=code.slice(0,-3),meta=units[unit];
 if(!meta||!question||!correct||!wrong1||!wrong2||!why)throw Error('Invalid exam row '+id);
 const choices=[correct,wrong1,wrong2];
 let seed=2166136261;for(const ch of id)seed=Math.imul(seed^ch.charCodeAt(0),16777619)>>>0;
 const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return seed>>>0;};
 for(let i=choices.length-1;i>0;i--){const j=random()%(i+1);[choices[i],choices[j]]=[choices[j],choices[i]];}
 return{id,code,unit,grade:meta.grade,host:meta.host,question,choices,answer:choices.indexOf(correct),why,data:extra.data[id]||null};
});
function forApp(slug,map){const app=map[slug];if(!app)return[];return questions.filter(q=>app.grades.includes(q.grade)&&(q.host===slug||app.codes.includes(q.code)));}
const api={units,questions,forApp,grades:['초3','초4','초5','초6','중1','중2','중3','고1']};
if(node)module.exports=api;else window.scienceExamBank=api;
})();
