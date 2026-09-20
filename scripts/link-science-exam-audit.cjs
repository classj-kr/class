const {edit,replace,apply}=require('./science-scope-patch.cjs');
edit('scripts/build-current-science-audit.cjs',s=>{
 s=replace(s,"sources.push(inventory.reference,", "sources.push(out+'/exam-readiness.md',out+'/exam-question-corrections.cjs','scripts/build-science-exam-meta.cjs',inventory.reference,");
 s=replace(s,"const intro='# 현재 교정본 — 학년별 시험 대비 전수 점검\\n\\n", "const intro='# 현재 교정본 — 학년별 시험 대비 전수 점검\\n\\n초3~중3·고1 공통과목의 개념·자료 해석 확인 문제 241개와 기존 30개 문항 정정은 [시험 대비 점검 결과](exam-readiness.md)를 확인한다. 아래 표는 실험 앱의 부분 연결이며, 별도 확인 문제의 제공 여부와 구분한다.\\n\\n");
 return s;
});
apply();
