# 한국지리 관광 설명 및 본문 글꼴 개선

- 등록된 체험·관광 장소 308곳의 설명을 모두 개별 집필한 두 문단으로 교체했다. 장소의 구체적 특징을 먼저 소개하고, 현장에서 발견할 장면과 그 의미를 이어 설명한다.
- 데이터의 장소 ID·이름·좌표·분류·관찰 미션·공식 링크·사진은 유지했다. 설명의 문단은 `textContent`로 생성하며 HTML로 해석하지 않는다.
- 사용자가 최종 선택한 KoPubWorld 바탕체를 관광·유물 설명, 개념 본문, 문제·선지·해설·그림 자료에 적용했다. 이 서체를 실제 수능 원본 서체로 지칭하지 않는다.
- 기존 장소별 볼거리 자료를 바탕으로 문장을 다시 썼다. 308개 시설의 운영·전시를 모두 새로 실사하거나 검증한 작업은 아니다. 운영 시간·요금·예약 가능 여부를 새로 단정하지 않았다.

## DMZ박물관 보강 근거

공식 안내에서 전시 구성과 야외 전시를 추가 확인했다.

- [전시공간](https://www.dmzmuseum.com/museum/information/practical/place): 전쟁·분단·생태, 독일 분단 및 통일 전시 구성.
- [야외전시](https://dmzmuseum.com/museum/exhibitions/openair): 이전한 250m 철책과 철책 걷기 공간, 베를린 장벽 및 경계 철책.
- [DMZ 소개](https://www.dmzmuseum.com/museum/dmzinfo): 정전협정과 비무장지대 형성.

## 확인 결과

- 308곳 전부 설명 갱신, 616개 문단 표시, 누락·중복 없음. 설명 외 데이터 보존 확인.
- 실제 경로에서 브라우저의 웹폰트 다운로드 및 렌더링 확인: `KoPubWorldBatang_Pro` / `KoPubWorldBatangPM`, custom font.
- 1440×950 및 390×844에서 DMZ 설명과 문제 화면 확인. 설명 가로 넘침 및 28개 개념 그림 글자의 가로 넘침 없음.
- 모바일 관광창은 사진·지도 다음에 제목과 설명이 자연스럽게 이어지도록 배치했다. 지도와 설명 영역의 세로 겹침도 검사한다.
- `node tests/korea-map-study.cjs` 통과: 28개 개념·195개 문항, 정오답 처리·기록 유지·주제 전환·모바일 흐름.
- `node tests/korea-map-reading.cjs` 통과: 308곳 문단 표시, 실제 웹폰트, 자료 글자 넘침, 모바일 지도·본문 배치.
- 검증 결과와 화면: `outputs/korea-map-reading/verification.json`, `dmz-desktop.png`, `dmz-mobile.png`, `question-desktop.png`, `question-mobile.png`.
