const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'voyage-publish-20260923.json'),'utf8'));
const prefix='learning/inquiry/age-of-exploration/';
const selected=['public/index.html','public/js/place-study-ui.js','data/catalog/discovery-regions.json','lib/study-question-builder.js','lib/study-question-bank.js'];
const hash=v=>crypto.createHash('sha256').update(v.toString('utf8').replace(/\r\n/g,'\n')).digest('hex');
const results=selected.map(file=>{
  const url='https://classj-kr.github.io/class/'+prefix+file+'?verify='+manifest.commit+'-'+Date.now();
  try {
    const body=cp.execFileSync('curl.exe',['-fLsS','--max-time','30','-H','Cache-Control: no-cache',url],{cwd:root,maxBuffer:5*1024*1024});
    const expected=cp.execFileSync('git',['show',manifest.commit+':'+prefix+file],{cwd:root,maxBuffer:5*1024*1024});
    return {file,url,bytes:body.length,match:hash(body)===hash(expected)};
  } catch(e) { return {file,url,match:false,error:e.message}; }
});
const report={commit:manifest.commit,checkedAt:new Date().toISOString(),githubPages:results,allMatch:results.every(r=>r.match)};
fs.writeFileSync(path.join(__dirname,'voyage-published-checks-20260923.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(!report.allMatch)process.exitCode=1;
