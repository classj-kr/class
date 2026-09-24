# 제미나이 그림 프롬프트

이 책은 하나의 이야기를 8개의 장(챕터)으로 나눠 담았고, 펼침면은 모두
16개예요. 펼침면 하나에 그림이 한 장씩 들어갑니다.
그림이 펼침면 전체 폭을 가득 채우고, 그 아래에 이야기가 왼쪽·오른쪽으로 나뉘어 들어갑니다.

아래 프롬프트를 제미나이에 그대로 넣어서 생성한 뒤, 파일명을 정확히 맞춰서
`images/` 폴더에 저장하면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보여요.)

> **한 파일 = 한 장면입니다. 앞질러 가지 마세요.**
> 파일마다 뒤에 〔이 쪽에 실린 글〕을 붙여 두었습니다. 그 쪽에 실제로 실리는 글이에요.
> 그림은 **그 글에 나오는 장면만** 그려 주세요. 다음 쪽 이야기를 미리 그리면
> 그림이 글보다 한 칸씩 밀려서 책 전체가 어긋납니다. 실제로 그런 일이 있었어요.
> 장면이 둘 적혀 있으면 둘을 **한 그림 안에** 담아 주세요. 하나만 골라 그리면 안 됩니다.

권장 크기: **본문 그림은 가로 2 : 세로 1 비율**(가로로 아주 길쭉한 모양)로 만들어 주세요, WebP. 펼침면 전체 폭을 채우는 자리라 이렇게 길어야 잘리지 않아요. **표지(`cover.webp`)는 세로 2 : 3 비율**, 마무리(`end.webp`)는 가로 3 : 세로 2 정도면 됩니다.

> **마무리 그림(`end`)은 이제 「읽고 나서」 쪽 오른쪽 위 한 자리에만 쓰입니다.** 따로 있던 마지막 쪽은 없앴어요.
> 칸은 **가로 3 : 세로 2** 그대로입니다. 적어 둔 비율대로 그리면 잘리지 않고 그대로 들어갑니다.


본문 그림칸은 마지막 장까지 모두 같은 비율입니다. 어느 장이든 똑같이
2:1로 만들면 되고, 따로 신경 쓸 것이 없어요.

## 공통 스타일 지시문 (모든 프롬프트 앞에 붙여서 사용하세요)

```
Children's picture book illustration, bright cheerful cartoon-animation style,
bold clean outlines, saturated storybook colors, luminous northern light, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), Nordic castle, seashore, forest and cave settings,
expressive faces, wide panoramic composition, beautiful and never frightening.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Elisa: a gentle determined girl about 12 with long dark hair and a simple linen
dress, later a plain gown. Her eleven brothers: princes with golden circlets who
turn into large white swans by day. The false queen: a tall woman in a black and
purple gown with cold eyes. The king of the neighbouring land: a kind young man
with a short beard and a green cloak.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: eleven white swans wheeling across an evening sky above a young girl standing on a seashore with a bundle of nettles in her arms, the low sun turning the water gold, beautiful and wistful. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 열한 명의 오빠

| 파일명 | 장면 |
|---|---|
| `images/01-family.webp` | A sunny castle courtyard where eleven boy princes in golden circlets play with a small laughing girl on their shoulders, warm and joyful. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 궁궐 뜰에 금관 열한 개가 나란히 반짝였습니다. 왕자 열한 명이 저마다 쓰고 다니는 것이었지요. 막내는 엘리사라는 공주였습니다. 어머니는 일찍 세상을 떠났습니다. 그래도 남매는 사이가 아주 좋았지요. 오빠들은 하루 종일 동생을 데리고 놀았습니다. / 오른쪽: 번갈아 업고 궁궐을 돌아다녔지요. 글씨도 가르쳐 주고 노래도 불러 주었습니다. 엘리사는 오빠들이 세상에서 제일 좋았지요. 뜰에는 늘 웃음소리가 났습니다. 그런 날이 오래갈 줄 알았지요. 하지만 그렇지 않았습니다. 어느 날부터 궁궐 공기가 달라졌거든요.〕 |
| `images/01-family-2.webp` | A tall woman in black and purple robes whispering to a king while eleven princes stand apart, and a small girl being sent away in a cart, cold and ominous. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그런데 임금님이 새 왕비를 맞았습니다. 왕비는 키가 크고 눈이 차가웠지요. 겉으로는 아이들에게 웃어 주었습니다. 속으로는 아주 다른 생각을 했지요. 저 아이들만 없으면 이 나라는 다 내 것인데. / 오른쪽: 저 아이들이 버릇이 없습니다. 보기만 해도 머리가 아픕니다. 임금님은 차츰 아이들을 멀리하게 되었지요. 엘리사는 시골집으로 보내졌습니다. 오빠들은 궁궐에 남았지요.〕 |

## 2장 · 백조가 된 오빠들

| 파일명 | 장면 |
|---|---|
| `images/02-swans.webp` | Eleven great white swans rising from a castle and circling three times before flying toward the sea, empty princes' beds below, dramatic and moving. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 어느 날 아침이었습니다. 궁궐이 이상하게 조용했지요. 왕자들의 방이 텅 비어 있었습니다. 침대는 손도 대지 않은 채였지요. 사람들이 온 궁궐을 뒤졌습니다. 금관 열한 개만 나란히 놓여 있었지요. / 오른쪽: 그때 창밖에서 커다란 새 울음소리가 났습니다. 하늘에 하얀 새 열한 마리가 날고 있었지요. 목이 길고 날개가 넓은 백조들이었습니다. 백조들은 궁궐을 세 바퀴 돌았지요. 그러고는 바다 쪽으로 사라졌습니다. 울음소리가 오래도록 하늘에 남았습니다.〕 |
| `images/02-swans-2.webp` | A grown girl turned away at a castle gate by a cold queen, then setting out alone along a road toward the distant sea, wistful and determined. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 엘리사는 시골집에서 그 소식을 들었습니다. 오빠들이 백조가 되었다니요? 엘리사는 그날부터 잠을 이루지 못했지요. 열다섯 살이 되던 해였습니다. 엘리사는 궁궐로 돌아가기로 했지요. / 오른쪽: 저런 아이는 내 딸이 아니다. 엘리사는 궁궐 밖으로 쫓겨났지요. 갈 곳이 없었습니다. 엘리사는 오빠들을 찾기로 했지요. 백조들이 날아간 바다 쪽으로 걸었습니다.〕 |

## 3장 · 몇 해 만의 만남

| 파일명 | 장면 |
|---|---|
| `images/03-reunion.webp` | A rocky sea islet at sunset where a travel-worn girl watches eleven white swans descending from a golden sky, waves breaking below, beautiful. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 엘리사는 몇 날 며칠을 걸었습니다. 숲을 지나고 들을 지났지요. 나무 열매를 따 먹으며 버텼습니다. 발이 부르트고 옷이 해졌지요. 마침내 바닷가에 닿았습니다. 짠 바람이 얼굴을 때렸지요. / 오른쪽: 해가 뉘엿뉘엿 넘어갈 무렵이었지요. 하늘에서 하얀 것들이 내려왔습니다. 백조 열한 마리였지요. 날개 소리가 파도 소리보다 컸습니다. 엘리사는 벌떡 일어났습니다. 가슴이 터질 것 같았지요.〕 |
| `images/03-reunion-2.webp` | Eleven swans transforming into young princes as the sun sets on a rocky islet, embracing a weeping girl, deeply emotional golden light. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 해가 물속으로 넘어갔습니다. 그 순간 백조들의 깃털이 벗겨졌지요. 오빠들의 모습이 드러났습니다. 엘리사는 그대로 달려갔지요. 오빠! / 오른쪽: 오빠들이 동생을 끌어안았습니다. 우리는 해가 뜨면 다시 백조가 된단다. 밤에만 사람으로 돌아올 수 있어.〕 |

## 4장 · 꿈에 나타난 노인

| 파일명 | 장면 |
|---|---|
| `images/04-nettles.webp` | Eleven swans carrying a girl across the sea in a great woven net, and a dream of a white-robed elder speaking to her in a forest cave, magical. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 오빠들은 엘리사를 큰 그물에 태웠습니다. 백조가 되어 바다 건너로 데려갔지요. 숲속 동굴에 자리를 잡았습니다. 그날 밤 엘리사는 꿈을 꾸었지요. 꿈에 흰옷을 입은 노인이 나타났습니다. 오빠들을 구하고 싶으냐? / 오른쪽: 쐐기풀로 옷 열한 벌을 지어 입히거라. 그러면 마법이 풀린단다. 다만 다 지을 때까지 한마디도 해서는 안 된다.〕 |
| `images/04-nettles-2.webp` | A girl in a cave weaving shirts from green nettles by firelight, her hands red and blistered, princes gathered around her in concern, quiet determination. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 동굴 앞에 정말 쐐기풀이 자라 있었습니다. 엘리사는 곧바로 그것을 뜯었지요. 손이 불에 덴 듯 따가웠습니다. 금세 물집이 잡혔지요. 손등이 벌겋게 부어올랐습니다. 그래도 엘리사는 멈추지 않았습니다. 풀을 발로 밟아 실을 뽑았지요. 그 실로 옷을 엮기 시작했습니다. / 오른쪽: 밤이 되어 오빠들이 돌아왔지요. 해가 지자 백조가 사람이 된 것이었습니다. 엘리사, 손이 왜 이러니?〕 |

## 5장 · 낯선 임금님

| 파일명 | 장면 |
|---|---|
| `images/05-king.webp` | A young king on horseback pausing at a cave mouth where a silent girl looks up from her weaving, hounds and hunters behind, mossy forest light. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 어느 날 이웃 나라 임금님이 사냥을 나왔습니다. 사냥개들이 동굴 쪽으로 달려갔지요. 임금님도 그 뒤를 따랐습니다. 동굴 안에 웬 소녀가 앉아 있었지요. 말없이 풀을 엮고 있었습니다. 임금님은 걸음을 멈췄지요. 개들도 짖기를 그쳤습니다. / 오른쪽: 그대는 누구요? 어찌 이런 곳에 있소? 엘리사는 아무 대답도 할 수 없었습니다. 그저 눈으로만 사정을 말했지요.〕 |
| `images/05-king-2.webp` | A king lifting a silent girl clutching a bundle of nettles onto his horse and riding to a castle where servants offer her fine clothes, gentle and warm. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 임금님은 그 눈을 오래 들여다보았습니다. 나쁜 사람의 눈이 아니었지요. 이런 곳에 둘 수는 없소. 임금님은 소녀를 말에 태웠습니다. 그러고는 제 성으로 데려갔지요. 엘리사는 쐐기풀 뭉치를 꼭 끌어안았습니다. / 오른쪽: 그것만은 놓을 수 없었으니까요. 성에서는 고운 옷을 내주었지요. 따뜻한 밥도 차려 주었습니다. 그래도 엘리사는 웃지 않았지요. 밤이면 방에 틀어박혀 옷을 엮었습니다.〕 |

## 6장 · 오해

| 파일명 | 장면 |
|---|---|
| `images/06-accused.webp` | A stone castle room at night where a girl weaves nettles by moonlight, and outside courtiers whispering as she slips out the gate, tense and sad. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 성에서도 엘리사는 밤마다 쐐기풀을 엮었습니다. 방문을 닫고 혼자 앉아 있었지요. 가져온 쐐기풀이 다 떨어졌습니다. 엘리사는 밤중에 몰래 성을 나갔지요. 성 밖 들판에서 풀을 뜯어 왔습니다. 그 모습을 본 사람이 있었지요. / 오른쪽: 저 아가씨가 밤마다 어디를 다니는 거지? 소문은 금세 부풀었습니다. 마녀가 틀림없어.〕 |
| `images/06-accused-2.webp` | A girl shaking her head silently before a troubled king and accusing courtiers, then locked in a stone tower with her bundle of nettles thrown in after her, sad. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 마침내 그 말이 임금님 귀에까지 들어갔습니다. 신하들이 엘리사를 끌고 왔지요. 밤마다 무엇을 하였느냐? 엘리사는 입을 열 수 없었습니다. 한마디만 해도 오빠들이 죽으니까요. 엘리사는 그저 고개를 저었지요. / 오른쪽: 임금님도 어쩔 수가 없었습니다. 엘리사는 그길로 탑에 갇히고 말았지요. 사람들이 쐐기풀 뭉치도 함께 던져 넣었습니다. 저것이나 실컷 만지라지. 사람들은 그렇게 비웃었습니다. 임금님만은 밤새 잠을 이루지 못했습니다.〕 |

## 7장 · 마지막 한 벌

| 파일명 | 장면 |
|---|---|
| `images/07-finish.webp` | A tower room at dawn where a girl finishes the tenth nettle shirt and starts the eleventh, guards opening the door, tense and urgent. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 엘리사는 오히려 잘되었다고 생각했지요. 쐐기풀이 곁에 있었으니까요. 갇힌 방에서도 손을 놀리지 않았지요. 밤새 실을 뽑고 옷을 엮었습니다. 열 벌이 완성되었지요. 이제 마지막 한 벌만 남았습니다. 손끝이 갈라져 피가 배어 나왔지요. / 오른쪽: 그런데 창밖이 뿌옇게 밝아 왔지요. 소매 한쪽을 미처 다 엮지 못했습니다. 문이 열리고 사람들이 들어왔지요. 엘리사는 옷 열한 벌을 품에 안았습니다. 그러고는 광장으로 끌려 나갔지요. 손은 여전히 실을 놓지 않았습니다. 걸어가면서도 소매를 엮었습니다.〕 |
| `images/07-finish-2.webp` | A town square where a girl flings woven nettle shirts over eleven descending swans that transform into princes mid-air, the crowd falling back astonished, bright. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 광장에는 사람들이 가득했습니다. 엘리사는 옷을 놓지 않았지요. 사람들이 저마다 손가락질을 했습니다. 그때 하늘에서 소리가 났습니다. 사람들이 고개를 들었지요. / 오른쪽: 엘리사는 옷을 하나씩 던져 씌웠지요. 옷이 닿는 순간 깃털이 벗겨졌습니다. 백조들이 차례차례 사람이 되었지요. 왕자들이 광장에 내려섰습니다. 사람들이 술렁였지요. 이게 대체 무슨 일이야! 광장이 발칵 뒤집혔지요.〕 |

## 8장 · 되찾은 말

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | Eleven princes reunited in a sunlit square, the youngest with one white swan wing instead of an arm smiling and shrugging, their sister beside him, joyful. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그런데 막내 오빠만은 좀 달랐습니다. 한쪽 팔이 백조 날개로 남아 있었지요. 소매를 다 엮지 못했기 때문입니다. 엘리사는 미안해서 어쩔 줄 몰랐지요. 막내 오빠가 웃으며 어깨를 으쓱했지요. 하얀 날개가 햇빛에 반짝였습니다. / 오른쪽: 괜찮아. 이 정도면 훌륭하지. 오히려 멋있지 않니? 엘리사는 그제야 마음이 놓였지요. 이제 말을 해도 되는 것이었습니다. 엘리사는 오랫동안 참았던 말을 꺼냈지요.〕 |
| `images/08-ending-2.webp` | A king bowing over a girl's hands in a hushed square, and then a great feast in a castle hall with twelve siblings side by side, joyful celebration. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 광장이 조용해졌습니다. 오빠들이 그동안의 일을 이야기했지요. 새어머니의 마법 이야기도, 동생이 왜 말을 못 했는지도 밝혔지요. 사람들은 고개를 숙였지요. 엘리사를 마녀라 부른 것이 부끄러웠습니다. 임금님이 엘리사에게 다가왔지요. / 오른쪽: 그러고는 두 손을 잡고 고개를 숙였습니다. 내가 그대를 몰라보았소. 그날 성에서는 큰 잔치가 열렸지요. 열두 남매가 나란히 앉았습니다. 엘리사는 오랜만에 소리 내어 웃었답니다.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
