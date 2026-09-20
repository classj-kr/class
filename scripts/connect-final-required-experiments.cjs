const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'required-experiments.js',s=>replace(s,' return specs;',' const final=typeof module!==\'undefined\'?require(\'./required-experiments-final.js\').requiredFinalModels:window.requiredFinalModels;\n final?.({add,t,r,l,c,f,q,step,modelNote});\n return specs;'));
edit(lab+'exam-scope.js',s=>{
 s=replace(s,"required-experiments.js?v=2","required-experiments.js?v=3");
 s=replace(s,"document.body.append(supplement);};","document.body.append(supplement);if(['measurement','wave-transfer'].includes(slug)){const digital=document.createElement('script');digital.src=new URL('digital-inquiry.js?v=1',base);document.body.append(digital);}};");
 s=replace(s," const more=", " const final=()=>{const script=document.createElement('script');script.src=new URL('required-experiments-final.js?v=1',base);script.onload=required;script.onerror=required;document.body.append(script);};\n const more=");
 s=replace(s,'script.onload=required;script.onerror=required;document.body.append(script);};\n const core=', 'script.onload=final;script.onerror=final;document.body.append(script);};\n const core=');
 return s;
});
edit('scripts/sync-science-catalog.cjs',s=>replace(s,'for(const [slug,codes]of Object.entries(additions))',"Object.assign(additions,{'star-elements':['10통과1-02-01'],'earth-system':['10통과2-02-02'],'cell-membrane':[...(additions['cell-membrane']||[]),'10통과2-03-01'],'measurement':['10통과1-01-04','10통과2-03-02'],'specific-heat':['9과03-02']});\nObject.assign(titles,{'star-elements':'원소의 기원과 스펙트럼','earth-system':'지구 시스템·개체군과 열수지','measurement':'길이·시간과 디지털 측정','wave-transfer':'파동과 소리 파형 분석','cell-membrane':'세포막·DNA·효소와 검출 원리'});\nfor(const slug of ['measurement','cell-membrane'])map[slug].subjects=[...new Set([...map[slug].subjects,'통합과학2'])];\nfor(const [slug,codes]of Object.entries(additions))"));
edit('tests/science-required-experiments.test.cjs',s=>replace(s,'assert.equal(all.length,18);','assert.equal(all.length,23);'));
edit('docs/science-lab-audit-2026-09-20/current-activity-overrides.cjs',s=>s+"\nfor(const r of require('./digital-inquiry-review.cjs')){const i=module.exports.findIndex(x=>x.id===r.id);if(i<0)module.exports.push(r);else module.exports[i]=r;}\n");
edit('docs/science-lab-audit-2026-09-20/current-review.cjs',s=>s+"\nfor(const slug of ['measurement','wave-transfer']){const r=module.exports.find(x=>x.slug===slug);r.current+='; 디지털 측정: 합성 신호·마이크 파형 분석, 조건별 상대 진폭·주파수 기록·내려받기'+(slug==='measurement'?' 및 실제 자 보정 길이·기기 시계 시간 측정':'');}\n");
edit('scripts/build-current-science-audit.cjs',s=>replace(replace(s,"out+'/required-gap-review.cjs',","out+'/digital-inquiry-review.cjs',out+'/required-gap-review.cjs',"),'기존 앱에 18개 실험 패널을 연결하고','기존 앱에 23개 실험 패널과 디지털 측정 도구를 연결하고'));
apply();
