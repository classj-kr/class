const {edit,replace,apply}=require('./science-scope-patch.cjs');
edit('tests/science-lab-curriculum-contract.js',s=>replace(replace(s,'data-standards="9과14-02 9과14-03"','data-standards="9과14-01 9과14-02 9과14-03 9과14-04"'),'/전류·전압·저항 — 직렬·병렬/','/전기 회로·정전기·코일/'));
apply();
