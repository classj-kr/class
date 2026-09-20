const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'exam-scope.js',s=>replace(s,'supplement-core.js?v=1','supplement-core.js?v=2'));
edit('scripts/build-current-science-audit.cjs',s=>s.replace('기존 416문항','기존 408문항과 신규 8문항').replace('## 여전히 별도 학습이 필요한 대표 항목','## 이번 보완과 남는 경계'));
edit('tests/science-required-core.test.cjs',s=>replace(s," const numberOfParticles=r=>", " for(const kind of ['melt','boil'])for(const sample of ['A','B']){const a=view('density-buoyancy',{kind,sample,amount:'one',step:'during'}),b=view('density-buoyancy',{kind,sample,amount:'two',step:'during'});assert.equal(a.text,b.text);assert.match(a.text,/온도가 .*일정한 구간/);}\n const numberOfParticles=r=>"));
apply();
