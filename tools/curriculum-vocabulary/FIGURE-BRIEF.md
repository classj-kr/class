# 도식 만들기 지시문 (학기 공통)

그림(AI 그림)으로는 보일 수 없는 낱말 — 수학, 국어 문법·글의 짜임, 과학 과정·원리, 사회 그래프·지구본 — 을 코드로 그린 움직이는 SVG 도식으로 만든다. **먼저 tools/curriculum-vocabulary/GUIDE.md 8장을 읽는다.**

## 본보기 (5-2, 꼭 열어 볼 것)
- `learning/literacy-numeracy/curriculum-vocabulary/figures/kit.js` — FigureKit {C, svg, text, arrow, numberLine, put} 와 맨 위 주석의 약속
- `figures/5-2/math-3.js` 합동(m3-hapdong): 칸별 움직임, 반짝임, 마지막 칸 다시 보기
- `figures/5-2/kor.js` 호응·생략·극본: 낱말 조각(타일)이 움직이는 글자 도식
- `figures/5-2/sci.js` 해풍·대류·전도: 과학 과정
- 칸 글 본보기: `tools/curriculum-vocabulary/5-2/extra/kor-g.json`, `sci-g.json`, `math.json`(beats)

## 만들 것
1. `learning/literacy-numeracy/curriculum-vocabulary/figures/<학기>/<파일>.js` — `put('<학기>/<과목 이름>/<단원 id>/<낱말>', svg(id, body, css))`. 과목 이름은 국어·수학·사회·과학. id 는 학기·과목·단원을 넣어 겹치지 않게(예 `t62-m1-bunmo`).
2. `tools/curriculum-vocabulary/<학기>/extra/<과목 코드>-<글자>.json` — `{ "<단원 id>": { "<낱말>": { "beats": [...], "fig": [...] } } }`. beats 는 무대 아래 칸 글(2~4칸, ~습니다, 쉬운 말, 도식에 보이는 것만, 마지막 칸은 뜻 정리). fig 는 칸마다 도식이 보이는 것 메모(같은 개수, 화면엔 안 나옴). fig 가 있으면 그 낱말은 그림 프롬프트에서 빠진다.
3. index.html 은 고치지 않는다(build.mjs 가 terms.js 에 도식 파일을 자동으로 넣는다).

## 원칙
- 개념이 정확해야 한다(수학 정의, 과학 원리, 사회 사실). 교과서 원문은 `C:\Users\A\AppData\Local\Temp\claude\b89a749c0b55408c\2cfc5fa2-1524-4c0e-95f6-49281813ee76\scratchpad\tb<학기 숫자>\`.
- 그림 안에 문장 금지(짧은 이름표·수·기호만). 글씨는 viewBox 기준 18px 이상. 겹침·잘림 금지.
- 색은 kit 의 C 만. 밝은 바탕, 어두운 글씨, 네온 금지. 뜨거움 C.orange/C.red, 차가움 C.blue.
- 칸마다 무언가 움직인다(옮겨 가기, 이어지기, 채워지기, 펼치기, 돌리기, 반짝이기).
- 지도·지구본이 필요하면 손으로 그린 대륙 모양 금지 — 원·선·띠 같은 도식으로(위도는 원 위의 가로줄처럼), 실제 모양이 꼭 필요하면 저장소의 실제 경계 자료(learning/inquiry/korea-map/data, 지구본 앱 자료)를 쓴다.
- 칸 글 문체는 GUIDE 2장. 아이에게 '헷갈린다'고 말하지 않는다.

## 확인
- `node tools/curriculum-vocabulary/build.mjs <학기>` 통과.
- `node tools/curriculum-vocabulary/shoot-figures.cjs <학기> <과목 이름> <단원 id> E:/webprojects/curriculum-shots/<폴더>` 로 단원마다 찍어(만드는 중인 학기도 찍힌다) 칸별 PNG를 직접 열어 본다. 이 도구는 칸마다 2.2초 뒤를 찍는다. 흠을 고치고 다시 찍는다. 사진은 저장소 밖에만.
- 다른 도우미가 같은 학기의 다른 과목·단원을 동시에 한다. 맡은 파일만 고친다. git add·커밋 금지.
- 끝나면 낱말마다 칸 글과 도식이 보이는 것 한 줄 요약, 스스로 찾아 고친 흠, 남은 걱정.
