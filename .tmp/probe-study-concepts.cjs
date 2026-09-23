const fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'../learning/inquiry/age-of-exploration');
const groups=require(path.join(base,'lib/study-concepts'));
const pool=JSON.parse(fs.readFileSync(path.join(__dirname,'study-content-analysis.json')));
const lines=text=>String(text||'').split(/(?<=[.!?])\s+|\n+/).map(s=>s.trim()).filter(s=>s.length>=8);
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const has=(text,term)=>new RegExp('(?<![가-힣A-Za-z])'+escape(term)+'(?=$|[^가-힣A-Za-z]|[은는이가을를에의와과도만로입였인일으들])','u').test(text);
function candidates(item){
  const found=[];
  for(const line of lines(item.text)){
    for(const group of groups)for(const word of group){
      if(item.name.includes(word)||!has(line,word))continue;
      const alternatives=group.filter(w=>w!==word&&!has(line,w));
      if(alternatives.length>=3)found.push({word,line,choices:[word,...alternatives.slice(0,3)]});
    }
    for(const m of line.matchAll(/(?<![\d,])\d+(?:\.\d+)?(?:만|천|백)?(?:\s*년|세기|킬로미터|미터|센티미터|개|명|층|톤)/g))if(!m[0].startsWith('1520'))found.push({word:m[0],line,numeric:true});
  }
  return found.filter((c,i)=>found.findIndex(x=>x.word===c.word)===i);
}
const result=pool.map(p=>({...p,candidates:candidates(p)}));
const missing=result.filter(p=>p.candidates.length<3);
fs.writeFileSync(path.join(__dirname,'study-concept-missing.json'),JSON.stringify(missing.map(({id,name,text,candidates})=>({id,name,text,candidates})),null,2));
console.log({total:pool.length,covered:pool.length-missing.length,missing:missing.length});
console.log(missing.map(({id,name,text,candidates})=>({id,name,text,words:candidates.map(c=>c.word)})));
