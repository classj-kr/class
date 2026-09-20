const {edit,replace,apply}=require('./science-scope-patch.cjs');
edit('docs/science-lab-audit-2026-09-20/exam-readiness.md',s=>replace(s,'## 검증 방법과 경계','## 크롬북·아이패드 우선 후속 검사\n\n터치 영역을 보완하고 Windows WebKit 터치 입력 및 Chrome 키보드 검사를 추가했다. [기기 우선 검사 범위](school-device-check.md)에서 실제 기기 검사와의 차이를 확인한다.\n\n## 검증 방법과 경계'));
edit('scripts/build-current-science-audit.cjs',s=>replace(s,"sources.push(out+'/exam-readiness.md',","sources.push(out+'/school-device-check.md',out+'/exam-readiness.md',"));apply();
