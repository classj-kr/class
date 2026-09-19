const {edit,replace:r,apply}=require('./science-scope-patch.cjs');
edit('scripts/audit_science_curriculum.cjs',s=>{
 s=r(s,'<span>([^<]+)<\\/span>','<span>([\\s\\S]*?)<\\/span>');
 s=r(s,'title:m[3],catalogLine','title:clean(m[3].split(\'<small\')[0]),catalogLine');
 s=r(s,"if(process.argv[2]==='apps'){","if(require.main===module){\nif(process.argv[2]==='apps'){");
 return r(s,'module.exports=data;','}\nmodule.exports=data;');
});
edit('scripts/build-science-grade-map.cjs',s=>r(s,"const original=fs.readFileSync(lab+'index.html','utf8');","const original=fs.readFileSync(lab+'index.html','utf8');\nif(original.includes('grade-navigation.js'))throw Error('Initial migration already applied. Use scripts/sync-science-catalog.cjs --apply to synchronize the current map.');"));
edit('docs/science-lab-audit-2026-09-20/current-review.cjs',s=>s.replaceAll('전자기와 양자의 전기장·전위; 전기장 방향 및 단위 예시 정정','전자기와 양자의 전기장·전위; 전기장 방향 교정, 축전기 에너지 저장/방출 정성 모형'));
apply();
