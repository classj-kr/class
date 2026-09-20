const {edit,replace,apply}=require('./science-scope-patch.cjs');
edit('tests/science-digital-inquiry.test.cjs',s=>replace(replace(s,"return s.active&&s.last?.rms>.15;","return s.active&&s.last&&Math.abs(s.last.rms-.3/Math.sqrt(2))<.015;"),"window.__digitalInquiry.snapshot().last?.rms>.38","Math.abs((window.__digitalInquiry.snapshot().last?.rms||0)-.6/Math.sqrt(2))<.015"));
apply();
