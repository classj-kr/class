# 과학실험실 공통 화면·시각자료 개선

144개 앱에 공통 화면 디자인을 적용했다. 공통 CSS·JS가 없던 복원 앱 40개에도 연결하고 생성기에 반영했다. 실험 조건과 관찰 화면, 결과 설명, 객관식 문제의 간격·색·글자·선택 상태를 통일했다. 기존 결과 노드를 관찰 영역으로 옮겨 채점 상태와 이벤트를 유지했다.

공유 실험 그림은 앞서 다시 그린 11개에 10개를 추가했다. 침식·해수면·단열 주택·물체 밀기·태양 고도·DNA·에너지 수지·개체군·방출 스펙트럼·행성 모형이다. 연소 검출·진단 원리·식물 생활형 3개는 검증된 관찰 표현을 보존하면서 같은 장치 설명 형식으로 정리했다. 총 24개 렌더러이며, 맹점의 고정 시각 자극은 별도로 유지했다. 해수면 그림은 처음에는 집이 잠기지 않고 육지 얼음이 녹았을 때만 잠기도록 수면과 해안의 높이도 교정했다.

작은 화면은 먼저 그림 전체를 보여 준다. ‘그림 확대’는 같은 SVG를 원래 좌표 크기로 보여 주고 좌우 이동을 허용한다. ‘전체 보기’로 돌아가도 선택과 움직임이 유지된다. 그래프와 장치 글자는 배경 대비에 맞추었고, 어두운 천문 관찰 화면은 밝은 글자를 유지한다. 열전달 온도와 소리 안내 배지의 흐린 글자도 개별 수정했다. 전자의 느린 회전·일시 정지·동작 줄이기 설정도 재검증했다.

## 검증 증거

| 검사 | 결과 | 기록 |
| --- | --- | --- |
| 전체 앱의 모드·범주형 조작·슬라이더 경계와 중간값 | 144앱, 224모드, 1,671조건, 발견 오류 0 | [최종 집계](release/summary-chromium.json), [전체 실행](release-controls.log), [마지막 글자 교정 2앱](label-controls.log) |
| 태블릿 레이아웃 | 144앱, 896조건, 경계·글자·겹침 발견 오류 0 | [검사 결과](release-tablet-layout.json) |
| Chrome·WebKit 반응형 | 각 144앱, 432화면, 실패 0 | [Chrome](devices/presentation-chromium.json), [WebKit](devices/presentation-webkit.json) |
| 마지막 확대 버튼 간격 | 3앱×3폭×2엔진, 실패 0 | [Chrome](final-spacing/presentation-chromium.json), [WebKit](final-spacing/presentation-webkit.json) |
| 배경별 대비·실제 결과 노드 보존·그림 확대와 복귀 | 두 엔진 통과 | [최종 검사](figure-final-tests.log) |
| 공유 실험 패널 25개, 초기·변경·특정 관찰 상태 | 두 엔진 통과; Chrome 장치 캡처 66상태×2폭 | [최종 Chrome](apparatus-final-tests.log), [WebKit 및 확대 검사](presentation-final-tests.log), [캡처 목록](final-panels/screenshots.json) |
| 문항 첫 응답과 재시도·재방문 진단, 공식 분류·필터 | 144앱·145과목 경로·기본 580문항, 두 엔진 통과 | [14개 회귀 검사](regression.log) |
| 추가 탐구 조건·채점, 전자 회전 | 218조건·654응답 및 두 엔진 회전 검사 통과 | [실행 기록](presentation-tests.log) |
| 성취기준·캐시·문항 메타데이터, JS 구문 | 3검사 통과, 167 JS 파일 구문 정상 | [기록](metadata-final.log) |

중간 로그의 실패도 보존했다. `presentation-tests.log`의 최초 확대 테스트는 실제 CSS가 없는 시험용 HTML 때문에 실패했고, 실제 공통 CSS를 적용한 `figure-final-tests.log`에서 두 엔진 모두 통과했다. `presentation-final-tests.log`의 Chrome 중단은 기존 WebP 파일 쓰기 잠금 때문이며 새 출력 경로의 `apparatus-final-tests.log`에서 완료했다. 이 중단을 앱 오류나 최종 통과로 숨기지 않았다.

## 직접 살펴본 화면

- 144앱·224모드의 조작 후 데스크톱 화면: 초기 개선 후 25개 모아보기 전체를 검토했고, 최종 실행 캡처를 [release](release/after-chromium-contacts.json)에 보존했다.
- 모바일 144앱: [16개 모아보기](devices/panels-chromium-contacts.json) 전체를 검토했다. 마지막으로 고친 열전달·소리 화면은 원본 캡처 및 [최종 간격 캡처](final-spacing/)로 다시 확인했다.
- 공유 장치의 초기·변경·특정 관찰 화면: 앞선 64상태 모아보기 전체를 검토했고 해수면의 육지/해상 얼음 2상태를 추가 확인했다. [최종 66상태](final-panels/screenshots.json).
- 예시: [전도성 장치](final-panels/compound-conductivity-initial-1100.webp), [침식](final-panels/erosion-changed-1100.webp), [해수면 초기](final-panels/sea-level-initial-1100.webp), [육지 얼음이 녹은 뒤](final-panels/sea-level-land-melted-1100.webp), [모바일 원자·그래프](final-spacing/periodic-bonding-mobile.webp).

화면 캡처는 무손실 WebP이며 SVG 모형은 코드로 유지했다. 재실행 전후의 캡처는 폴더별 시점이 다르다. [구조화된 변경·검증 범위와 소스 해시](review.json)를 함께 확인한다.

이번 완료 범위는 전체 공통 화면 개선, 명시한 장치 그림 개선 및 실행·화면 검증이다. 144개 앱의 모든 과학 원리를 새로 증명하거나 수집 교과서 전체의 독립 실험 목록을 확정했다는 뜻은 아니다. 2022 교육과정만 대상으로 하며 필수실험 총수는 여전히 미확정이다.
