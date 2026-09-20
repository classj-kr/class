const {edit,replace,apply}=require('./science-scope-patch.cjs');
edit('docs/science-lab-audit-2026-09-20/required-gap.md',s=>{
 s=replace(s,'기존 15개 앱에 18개 실험 패널','기존 18개 앱에 24개 실험 패널');
 s=replace(s,'| 고1 | 온실효과 강화 직후와 새 평형의 지구 열수지 | earth-system |','| 고1 | 온실효과 강화 직후와 새 평형의 지구 열수지 | earth-system |\n| 초4 | 태양계 행성 모형 구성 | night-sky |\n| 중1 | 고체 재료의 위치별 열전도 비교 | specific-heat |\n| 고1 | 수소·헬륨·혼합 광원의 선스펙트럼 | star-elements |\n| 고1 | 먹이·공간과 개체군 변동 | earth-system |\n| 고1 | 핵산·단백질 검출 및 작동 대조 | cell-membrane |\n| 고1 | 같은 족 원소 비교의 변인 통제·설계 | periodic-bonding |');
 s=replace(s,'원문 활동 19개에 대응하지만','원문 활동 25개에 대응하지만');
 s=replace(s,'18개 실험, 153개 조건, 459개','24개 실험, 200개 조건, 600개');
 s+= '\n## 직접 측정과 최종 전수 대조\n\n고1 measurement에는 기기 시계 시간·실제 자 보정 길이 측정, 고1 measurement와 중2 wave-transfer에는 합성 신호/마이크 파형 분석·기록·내려받기를 추가했다. 마이크는 학생의 요청과 브라우저 권한 후에만 사용하며, 중지·대기 취소·화면 이탈 시 종료한다. 오디오는 저장·업로드하지 않는다. 마이크 측정은 HTTPS 및 입력 장치가 필요하다.\n\n`tests/science-digital-inquiry.test.cjs`는 측정·보정·내려받기·권한 거부/취소·장치 종료를 검사한다. 자동화는 가상 마이크이므로 실제 Chromebook/iPad 하드웨어 측정 품질을 검증했다고 세지 않는다.\n\n[공통과목 134개 활동 최종 대조](common-experiment-census.md)에 118개 연결과 16개 별도 활동을 전부 기재했다. 원문에 실험이 명시된 29개에는 학년군 내 구현 연결이 있다. 모든 성취기준·선택과목·실물 수업을 완료했다는 뜻은 아니다.\n';return s;
});
edit('scripts/build-current-science-audit.cjs',s=>{
 s=replace(s,"out+'/digital-inquiry-review.cjs',", "out+'/common-experiment-census.md','scripts/build-common-experiment-census.cjs',out+'/digital-inquiry-review.cjs',");
 s=replace(s,'[추가 구현 범위](required-gap.md)를 확인한다.','[추가 구현 범위](required-gap.md)와 [공통과목 134개 활동 최종 대조](common-experiment-census.md)를 확인한다.');return s;
});
apply();
