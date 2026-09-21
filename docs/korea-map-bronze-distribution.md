# 청동기 유물 분포 지도

- 위치: 역사 메뉴의 첫 장면 `gojoseon-distribution`.
- 목적: 비파형 동검·탁자식 고인돌의 분포를 읽어 고조선 관련 문화를 추론하고, 8조법 및 자료 해석으로 연결한다.
- 원전: [국사편찬위원회 우리역사넷](https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m71_0020_0020_0010_0020), [원전 분포도](https://contents.history.go.kr/data/img/ta/ta_m71/map_019_01.jpg), [비파형 동검](https://contents.history.go.kr/mobile/kc/view.do?levelId=kc_r000300), [8조법](https://contents.history.go.kr/front/tg/view.do?levelId=tg_001_0500).
- 분포 기호는 원전의 권역별 양상을 근사 배치한 개략도이다. 각 기호는 명명된 개별 발굴지의 측량 좌표가 아니며 기호 수는 발굴 수량을 뜻하지 않는다. 박물관의 현재 소장 위치를 출토지로 사용하지 않는다.
- 고조선의 확정 영토나 단일 시점의 국경을 그리지 않는다. 남부의 출토 양상도 표시하며 모든 비파형 동검을 곧바로 고조선 영토의 증거로 취급하지 않는다.
- 동검 사진 `history/bronze-dagger.jpg`는 우리역사넷이 국립중앙박물관 소장 비파형 동검으로 소개한 [사진](https://contents.history.go.kr/data/img/kc/thumb/kc_r000300.jpg)을 변형 없이 보관하며 자료 정보 창에 출처를 표시한다. 고인돌은 기존 유물·유적 자산 `heritage/p02.jpg`를 재사용한다. 새 분포 기호는 코드로 그린 구별용 도형이며 원전 분포도를 통째로 복제하지 않는다.
- 3문항은 위 내용을 바탕으로 작성한 자체 문항이다. 특정 시험의 기출을 복제했다거나 출제 빈도를 집계했다고 표시하지 않는다.
- 기존 28개 영토·사건 지도와 6·25 순서 문항은 유지한다. 이 장면에는 영토 채색을 추가하지 않으며 `history-territories.js` 생성 데이터와 분리한다.
- 설명·문항에는 기존 KoPubWorld Batang 읽기 글꼴을 사용한다. 문제는 기본 노출하며 아코디언·반복 안내 표제를 추가하지 않는다. 상세 출처와 자료 해석 범위는 기존 자료 정보 창에 보관한다.
- 검사: `node tests/korea-map-bronze.cjs`, `node tests/korea-map-history-cleanup.cjs`, `node tests/korea-map-history.cjs`; 기존 영토 및 전쟁 테스트도 회귀 확인한다.
