# 1520년 도시·항구 검토 — 2026-09-20

도시는 실제로 존재했던 거점이어야 한다. 휴식 간격을 맞추기 위해 가상의 도시, 임의의 대표 취락, 후대 도시를 추가하지 않는다. 주민의 생활권·유물이 확인되는 것과 특정 도시·항구가 확인되는 것은 구별한다. 입항하면 기존 피로 회복 규칙이 적용되며, 교역 기능은 아직 구현하지 않았다.

## 이번에 확정한 북방 거점

| 도시 | 근거 | 접근 | 그림 |
|---|---|---|---|
| 경성 | 1398년 지명·만호진, 1403년 읍성 | 육상 | `public/assets/cities/1520/kyongsong.webp` |
| 회령 | 세종대 육진의 회령 진 설치 | 육상 | `public/assets/cities/1520/hoeryong.webp` |
| 가미노쿠니 | 15세기 후반 가츠야마다테, 16세기 교역 거점 | 입항·육상 | `public/assets/cities/1520/kaminokuni.webp` |
| 도쿠야마 | 오다테에 1514년 가키자키씨 입성·도쿠야마로 개칭 | 입항·육상 | `public/assets/cities/1520/tokuyama-ezo.webp` |

도시별 출처는 `data/catalog/regional-sites.json`의 `historicalEvidence`와 `story.sources`에 기록했다. 그림은 built-in `image_gen`으로 각각 생성한 1536×1024 상상도이며 정확한 유적 복원도가 아니다. 후대 마쓰마에성 천수각·현대 항만·유럽 선박 등을 배제하도록 지시했다. 실제 프롬프트는 `data/catalog/regional-city-art-prompts.json`에 보관했다. 원본 PNG에서 WebP 품질 84로 인코딩했다.

## 제외

- 사루강 아이누 취락: 특정 1520년 도시가 아니라 지역 공동체를 대표했던 표시이므로 추가 도시 목록에서 제거. 실제 주민의 역사를 부정하는 의미가 아니다.
- 부에노스아이레스: 첫 건설 1536년, 재건설 1580년. [부에노스아이레스 시정부](https://buenosaires.gob.ar/gcaba_historico/laciudad/ciudad).
- 케이프타운: 유럽계 정착 거점은 1652년 이후. 기존 코이코이 생활권을 케이프타운이라는 도시로 대체하지 않는다. [케이프타운 시정부](https://www.capetown.gov.za/Local%20and%20communities/Heritage-and-the-community/Our-history-and-heritage/What-is-our-history).
- 포토시: 1545년 은광 개발 이후의 광산도시를 1520년에 배치하지 않는다. [포토시 시정부](https://potosi.bo/history/). 선행 거주 흔적과 후대 광산도시는 구분한다.

위 세 기존 도시는 원작 번호·과거 자료를 보존하기 위해 원본 카탈로그에 `retired: true`로 남기되 공개 도시 목록과 출발 항구 목록에서 제외했다. 기존 그림·설명은 보관 자료로만 남긴다.

## 추가하지 않은 지역

- 뉴기니·연해주·사할린의 빈 해안을 임의의 지역 대표 항구로 채우지 않았다. 이번 검토에서는 추가할 특정 1520년 도시·항구의 근거를 확보하지 못했다. 주민·교역이 없었다는 단정이 아니다.
- 파타고니아·마젤란 해협·티에라델푸에고: 카웨스카르·야간 등의 생활권과 야영지를 도시로 바꾸지 않았다. 레이 돈 펠리페·놈브레 데 헤수스는 1584년 건설이므로 제외한다. [칠레 국가기념물위원회](https://www.monumentos.gob.cl/monumentos/monumentos-historicos/ruinas-ciudad-rey-don-felipe-puerto-hambre), [칠레 국립도서관](https://www.memoriachilena.gob.cl/602/w3-article-93784.html), [야간 지역박물관](https://www.museoyaganusi.gob.cl/galeria/yaganes-habitantes-ancestrales-de-cabo-de-hornos).
- 남아메리카 남부 전체에 도시가 없었다고 일반화하지 않는다. 오늘날 산티아고 아래의 잉카 도시 중심지에 관한 연구도 있으나, 이번에는 지도에 추가하지 않았다. [칠레 국립자연사박물관](https://www.mnhn.gob.cl/noticias/santiago-una-ciudad-fundada-sobre-otra-ciudad).

이번 검토는 위 거점과 지역에 한정한다. 원작의 모든 도시가 1520년 기준으로 전수 검증되었다는 뜻은 아니다.

## 검증

- `tests/regional-sites-smoke.js`: 실제 서버에서 네 도시 입장·퇴장, 항구 두 곳 입항·자기 배 정박·재출항, 피로도 감소, 그림 응답, 제외 도시의 공개 목록 미노출.
- 로컬 Chrome: 네 도시에서 실제 버튼 클릭, 그림 로드, 자동 회복 표시, 출항·육상 퇴장. 1440×900 및 390×844 확인. 모바일 버튼은 두 열로 배치해 글자 잘림 수정.
- `npm run check`, 도시 카탈로그·그림·설명·선박·입항 규칙 검증 통과.
- 운영 서버 배포·재시작은 하지 않았다.
