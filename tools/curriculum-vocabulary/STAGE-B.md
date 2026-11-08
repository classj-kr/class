# 2단계: 원고에 화면 글 붙이기 (학기 공통 지시문)

낱말 원고(<학기>/<과목>.json)는 다 됐다. 이제 낱말마다 화면에 나올 글을 붙인다. **먼저 tools/curriculum-vocabulary/GUIDE.md 를 끝까지 읽는다.** 본보기는 5-2 의 완성본이다.

## 본보기 (5-2)
- 설명(explain)·영어(en)·한자: `5-2/extra/kor-x.json`, `math-x.json`, `soc-x.json`, `sci-x.json` 의 explain, `5-2/extra/kor.json` 의 en
- 그림 명세: `5-2/extra/soc-a.json` 의 beats·img·imgKo
- 다른 뜻: `5-2/extra/senses-a.json` (kind 다의어/동형어)
- 관련 단어: `5-2/extra/rel-a.json`, `rel-c.json`(see 와 note)
- 오답 후보: `5-2/extra/foils-a.json`
- 실제 화면 데이터: `learning/literacy-numeracy/curriculum-vocabulary/words-5-2.js`

## 맡은 낱말마다 쓸 것

1. **`extra/<내 파일>.json`** — `{ "<단원 id>": { "<낱말>": { ... } } }`
   - `en`: GUIDE 3장. 쓸모 있는 실제 영어 낱말일 때만(없으면 칸을 아예 빼기).
   - `explain`: GUIDE 4장. 첫 줄 `쉬운 뜻:`(영어가 있으면 영어와 이어서), 쪼갤 수 있으면 `낱말 나누기:`, 구체적인 줄 하나 이상(`생활 속 예:` 또는 이름표 없는 장면 줄). 셋 이하.
   - `hanja`: 원고의 hanja 가 null 인데 한 글자씩 풀어야 뜻이 잡히는 한자말이면 `[["印","도장 인"],…]`(쉬운 훈). 보통은 쓰지 않는다.
   - `beats`, `img`, `imgKo`: 그림으로 뜻을 보일 낱말만(GUIDE 8장). 수학 낱말과, 코드 도식으로 그릴 낱말(국어 문법·글 갈래, 과학 과정·원리)은 쓰지 않는다 — 그건 도식 도우미가 따로 한다.
2. **`extra/senses-<내 이름>.json`** — 다른 뜻이 있는 낱말만, GUIDE 5장. kind 꼭 적기. 예문과 그 뜻풀이에 같은 알맹이 낱말 겹침 금지.
3. **`extra/rel-<내 이름>.json`** — GUIDE 6장. 유의어·반의어·상위어·하위어·see(이웃 낱말 견주기, 바탕 말 낱말 가족). 확실한 것만.
4. **`extra/foils-<내 이름>.json`** — GUIDE 7장. 모든 낱말에 3~4개, 같은 과목 같은 학기 목록 안에서, 같은 갈래, 두 번째 정답 금지. 원고 작성자가 "서로를 오답으로 넣지 말라"고 짚은 짝(뜻이 겹치는 낱말)은 넣지 않는다.

파일 꼴: senses·rel·foils 는 맨 바깥에 과목 코드(`{ "soc": { "<단원>": { … } } }`), extra/<과목>.json 은 단원부터.

## 지킬 것
- 원고(<과목>.json)는 고치지 않는다. 다만 원고의 빈칸 문장·예문이 GUIDE 1장을 어기면(정답 노출, 빈칸 옆 몇 글자로 풀림, 예문·뜻 겹침, 사실 오류) 고쳐도 되고, 고친 것을 보고한다.
- 맡은 단원·파일만. 다른 도우미가 같은 학기의 다른 과목·단원을 동시에 쓴다. git add·커밋 금지.
- `node tools/curriculum-vocabulary/build.mjs <학기>` 통과(다른 도우미 몫의 메시지는 무시하되 내 몫은 0곳).
- 끝나면: 맡은 낱말 수, 영어를 넣은 낱말 수, 다른 뜻이 있는 낱말, 그림 대신 도식이 맞겠다고 본 낱말 목록, 원고를 고친 곳.
