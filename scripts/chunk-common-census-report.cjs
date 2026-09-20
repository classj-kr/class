const {edit,replace,apply}=require('./science-scope-patch.cjs');
edit('scripts/build-common-experiment-census.cjs',s=>replace(s,"else{edit(path,()=>text);apply();}",`else{
 let current=fs.readFileSync(path,'utf8').replace(/\\r\\n/g,'\\n');
 if(current.length<1000&&!text.startsWith(current)){edit(path,()=>text.split('\\n').slice(0,18).join('\\n')+'\\n');apply();current=fs.readFileSync(path,'utf8').replace(/\\r\\n/g,'\\n');}
 if(current!==text&&text.startsWith(current)){
  const {spawnSync}=require('node:child_process');const lines=text.trimEnd().split('\\n');let count=current.trimEnd().split('\\n').length;
  // Preserve blank lines after the prefix as part of the append.
  count=current.split('\\n').length-1;
  for(let i=count;i<lines.length;i+=8){const chunk=lines.slice(i,i+8);const patch='*** Begin Patch\\n*** Update File: E:/webprojects/class/'+path+'\\n@@\\n '+lines[i-1]+'\\n'+chunk.map(x=>'+'+x).join('\\n')+'\\n*** End of File\\n*** End Patch';const result=spawnSync('C:/Users/A/AppData/Local/OpenAI/Codex/bin/cdef5aaf3e41ab53/codex.exe',['--codex-run-as-apply-patch',patch],{encoding:'utf8',windowsHide:true});assert.equal(result.status,0,result.stderr||result.stdout);}
 }else if(current!==text){edit(path,()=>text);apply();}
 assert.equal(fs.readFileSync(path,'utf8').replace(/\\r\\n/g,'\\n'),text);
}`));
apply();
