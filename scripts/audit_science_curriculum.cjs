const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const lab = 'learning/inquiry/science-lab';
const reference = 'references/moe/2022-revised-curriculum/extracted/09-science.txt';
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const clean = s => s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const catalog = read(`${lab}/index.html`);
const apps = [...catalog.matchAll(/<a class="level-entry available"[^>]*href="([^"/]+)\/"[^>]*><b>([^<]+)<\/b><span>([\s\S]*?)<\/span><\/a>/g)].map(m=>{
  const slug=m[1], html=read(`${lab}/${slug}/index.html`);
  const files=fs.readdirSync(path.join(root,lab,slug)).filter(n=>/\.(html|js)$/.test(n)).map(n=>{
    const name=`${lab}/${slug}/${n}`,text=read(name);
    return {name,sha256:crypto.createHash('sha256').update(text).digest('hex'),lines:text.split(/\r?\n/).length};
  });
  const evidence=[];
  for(const f of files){
    read(f.name).split(/\r?\n/).forEach((line,i)=>{
      if(/[가-힣]/.test(line) && !/font-family|aria-hidden/.test(line)) evidence.push({file:f.name,line:i+1,text:clean(line)});
    });
  }
  return {slug,grade:m[2],title:clean(m[3].split('<small')[0]),catalogLine:catalog.slice(0,m.index).split('\n').length,
    description:html.match(/<meta name="description" content="([^"]*)"/)?.[1],
    controls:[...html.matchAll(/<(?:legend|label|li|h3)\b[^>]*>([\s\S]*?)<\/(?:legend|label|li|h3)>/g)].map(m=>clean(m[1])),files,evidence};
});
const sections=[];let current=null,phase='';
read(reference).split(/\r?\n/).forEach((line,i)=>{
 if(/^\(\d+\)\s/.test(line)){current={title:line,line:i+1,standards:[],activities:[],guidance:[]};sections.push(current);phase='standards';}
 if(!current)return;
 if(line.includes('<탐구 활동>'))phase='activities';
 if(/^\(가\)|^\(나\)/.test(line))phase='guidance';
 const m=line.match(/^\[(\d+[가-힣]+\d{1,2}-\d{2}(?:-\d{2})?)\]\s*(.+)/);
 if(m&&phase==='standards')current.standards.push({code:m[1],text:m[2],line:i+1});
 if(phase==='activities'&&/^•/.test(line))current.activities.push({text:line,line:i+1});
 if(phase==='guidance'&&line.trim())current.guidance.push({text:line,line:i+1});
});
const data={scope:lab,reference,apps,sections:sections.filter(s=>s.standards.length)};
if(require.main===module){
if(process.argv[2]==='apps'){
 const start=Number(process.argv[3]||0),end=Number(process.argv[4]||apps.length);
 for(const a of apps.slice(start,end)){
  console.log(`\n${a.slug} | ${a.grade} | ${a.title}\n${a.description}\n조작·질문: ${a.controls.filter(t=>t.length<140).join(' / ')}`);
  const logic=a.evidence.filter(e=>e.file.endsWith('.js')&&!/out \+=|<text|<path|<line|<rect|<circle|<div|<span/.test(e.text));
  console.log('구현: '+logic.slice(0,22).map(e=>`${e.line}:${e.text}`).join('\n'));
 }
}else if(process.argv[2]==='standards'){
 for(const s of data.sections){
  if(process.argv[3]&&!s.standards[0].code.startsWith(process.argv[3]))continue;
  console.log(`\n${s.title}: ${s.standards.map(x=>`${x.line} [${x.code}] ${x.text}`).join('\n')}`);
  console.log(s.activities.map(x=>`${x.line} ${x.text}`).join('\n'));
  console.log(s.guidance.filter(x=>/다루지|제한|한정|정성|정량|중점/.test(x.text)).slice(0,12).map(x=>`${x.line} ${x.text}`).join('\n'));
 }
}else{
 const dest=path.join(root,'docs/science-lab-audit-2026-09-20');fs.mkdirSync(dest,{recursive:true});
 fs.writeFileSync(path.join(dest,'inventory.json'),JSON.stringify(data,null,2)+'\n');
 console.log(JSON.stringify({apps:apps.length,sections:data.sections.length,standards:data.sections.reduce((n,s)=>n+s.standards.length,0),activities:data.sections.reduce((n,s)=>n+s.activities.length,0)}));
}
}
module.exports=data;
