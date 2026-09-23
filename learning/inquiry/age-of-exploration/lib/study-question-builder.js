'use strict';
const crypto=require('node:crypto');
const concepts=require('./study-concepts');
const bank=require('./study-question-bank');
const COUNT=3;
function shuffle(values){const copy=[...values];for(let i=copy.length-1;i>0;i--){const j=crypto.randomInt(i+1);[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
const escape=word=>word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function termPattern(word,flags='u'){
  return new RegExp('(?<![가-힣A-Za-z])'+escape(word)+'(?=$|[^가-힣A-Za-z]|까지|부터|처럼|보다|마저|조차|밖에|마다|[은는이가을를에의와과도만로입였인일으들])',flags);
}
function sentences(text){return String(text||'').split(/(?<=[.!?])\s+|\n+/).map(line=>line.trim()).filter(line=>line.length>=8);}
function masked(line,word){
  return line.replace(termPattern(word,'gu'),'(          )')
    .replace(/\(          \)[은는](?=\s|[,.!?])/g,'(          )은/는')
    .replace(/\(          \)[이가](?=\s|[,.!?])/g,'(          )이/가')
    .replace(/\(          \)[을를](?=\s|[,.!?])/g,'(          )을/를')
    .replace(/\(          \)[와과](?=\s|[,.!?])/g,'(          )와/과');
}
function curated(item){
  return (bank[item.id]||[]).map(([passage,answer,alternatives,explanation])=>{
    if(!item.text.includes(explanation))throw Error(item.name+'의 문항 근거와 설명이 일치하지 않습니다.');
    return {prompt:'읽은 설명에 맞는 것은?',passage,answer,choices:[answer,...alternatives],explanation};
  });
}
function candidates(item){
  const result=[];
  for(const line of sentences(item.text)){
    for(const [category,group]of concepts.entries())for(const word of group){
      // A title or a longer word (인도네시아 → 인도) must not reveal or change the answer.
      if(item.name.includes(word)||!termPattern(word).test(line))continue;
      const alternatives=group.filter(other=>other!==word&&!termPattern(other).test(line));
      const passage=masked(line,word);
      if(alternatives.length<3||passage.includes(word))continue;
      result.push({prompt:'읽은 설명의 빈칸에 들어갈 말은?',passage,answer:word,
        choices:[word,...shuffle(alternatives).slice(0,3)],explanation:line,priority:category});
    }
    // Quantities are a last resort, with alternatives in exactly the same unit.
    for(const match of line.matchAll(/(?<![\d,])([1-9]\d*(?:,\d{3})*(?:\.\d+)?)(만|천|백)?(\s*(?:년|세기|킬로미터|미터|센티미터|개|명|층|톤))/g)){
      const answer=match[0];if(answer==='1520년')continue;
      const value=Number(match[1].replaceAll(',','')),decimals=match[1].split('.')[1]?.length||0;
      const step=Math.max(10**-decimals,10**Math.max(-decimals,Math.floor(Math.log10(value))-1));
      const options=[-2,-1,1,2,3,4].map(n=>Number((value+n*step).toFixed(decimals))).filter(n=>n>0&&n!==value);
      const suffix=(match[2]||'')+match[3],format=n=>(match[1].includes(',')?n.toLocaleString('en-US',{maximumFractionDigits:decimals}):String(n))+suffix;
      const choices=[answer,...shuffle([...new Set(options)]).slice(0,3).map(format)];
      if(new Set(choices).size!==4)continue;
      const passage=line.slice(0,match.index)+'(          )'+line.slice(match.index+answer.length);
      if(passage.includes(answer)||item.name.includes(answer))continue;
      result.push({prompt:'읽은 설명의 빈칸에 들어갈 값은?',passage,answer,choices,explanation:line,priority:1000});
    }
  }
  return result.sort((a,b)=>a.priority-b.priority||b.answer.length-a.answer.length);
}
function createQuestions(item,_pool,existing=[]){
  const questions=existing.slice(0,COUNT),options=[...curated(item),...candidates(item)];
  const usedAnswers=new Set(questions.map(q=>q.answer)),usedPassages=new Set(questions.map(q=>q.passage));
  function add(question){
    if(questions.length>=COUNT||usedAnswers.has(question.answer)||usedPassages.has(question.passage))return;
    const {priority,...q}=question;
    questions.push({...q,id:'q'+questions.length,choices:shuffle(q.choices)});
    usedAnswers.add(q.answer);usedPassages.add(q.passage);
  }
  // Curated questions take precedence. General readings cover separate sentences first.
  for(const q of options.filter(q=>q.priority===undefined))add(q);
  for(const q of options)if(!questions.some(old=>old.explanation===q.explanation))add(q);
  // A short reading can have several distinct facts in one sentence. Never ask its title.
  for(const q of options)add(q);
  if(questions.length!==COUNT)throw Error(item.name+'의 설명에 맞는 세 문항이 준비되지 않았습니다.');
  return questions;
}
module.exports={createQuestions};
