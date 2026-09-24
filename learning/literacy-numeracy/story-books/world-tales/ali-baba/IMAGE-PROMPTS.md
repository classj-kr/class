# 제미나이 그림 프롬프트

이 책은 하나의 이야기를 7개의 장(챕터)으로 나눠 담았고, 펼침면은 모두
14개예요. 펼침면 하나에 그림이 한 장씩 들어갑니다.
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
bold clean outlines, saturated storybook colors, warm desert gold and lamp-lit
courtyards, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a rocky desert cliff, a treasure
cave, a Middle Eastern town of flat roofs and courtyards, and rows of great oil
jars, expressive comic faces, wide panoramic composition, adventurous and never
gruesome.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Ali Baba: a wiry modest woodcutter with a short beard and a patched robe.
Kasim: his plump older brother in fine silks, greedy and loud. Morgiana: a quick
sharp-eyed young servant with her sleeves rolled up, the real hero. The robber
captain: a tall man with a scar and a red sash, drawn as theatrical rather than
frightening. The thirty-nine robbers: figures glimpsed in cloaks and turbans.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a great stone door standing half open in a desert cliff face with golden light and heaped treasure spilling from within, a single lamp on the sand before it and forty hoofprints leading away, mysterious and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 열려라 참깨

| 파일명 | 장면 |
|---|---|
| `images/01-cave.webp` | A rocky desert hillside where a woodcutter with three donkeys scrambles up a tree as a great dust cloud and riders approach, tense and cinematic. 〔이 쪽에 실린 글 (1/14) — 그림에 글자는 넣지 마세요. 왼쪽: 도끼 한 자루와 당나귀 세 마리. 알리바바의 살림은 그것이 전부였습니다. 형 카심은 같은 마을에서 제일가는 부자였지요. 형제라도 사는 모습이 아주 달랐습니다. 그날도 알리바바는 새벽에 산으로 나무를 하러 갔지요. 한창 도끼질을 하는데 멀리서 먼지가 뽀얗게 일었습니다. / 오른쪽: 두두두두. 말발굽 소리가 땅을 울리며 점점 가까워졌지요. 알리바바는 얼른 나무 위로 기어올랐습니다. 숨을 죽이고 내려다보니 말 탄 사람들이 몰려오고 있었지요.〕 |
| `images/01-cave-2.webp` | Forty masked riders dismounting before a sheer cliff as their captain raises a hand and the rock splits open revealing golden light, sacks carried inside, dramatic and magical. 〔이 쪽에 실린 글 (2/14) — 그림에 글자는 넣지 마세요. 왼쪽: 알리바바는 손가락을 꼽아 수를 세었습니다. 모두 마흔 명이었지요. 하나같이 천으로 얼굴을 가리고 있었습니다. 등에는 묵직한 자루를 하나씩 지고 있었지요. 이윽고 두목으로 보이는 사내가 앞으로 나섰습니다. 사내는 커다란 바위 앞에 우뚝 섰지요. / 오른쪽: 열려라, 참깨! 그러자 바위가 쩍 하고 갈라졌습니다. 도적들이 줄줄이 안으로 들어갔지요. 한참 뒤에 다들 빈손으로 나왔습니다.〕 |

## 2장 · 보물이 가득한 동굴

| 파일명 | 장면 |
|---|---|
| `images/02-treasure.webp` | A cave interior blazing with heaped gold coins, rolls of silk and jewels where a modest woodcutter stands frozen in awe, sunlight spilling in from the open rock door behind, dazzling. 〔이 쪽에 실린 글 (3/14) — 그림에 글자는 넣지 마세요. 왼쪽: 도적들이 멀리 사라진 뒤였습니다. 알리바바는 조심조심 나무에서 내려왔지요. 한참을 나무 뒤에서 망설였습니다. 그러다 큰맘 먹고 바위 앞에 섰지요. / 오른쪽: 안으로 들어선 알리바바는 눈이 부셨지요. 금화가 산처럼 쌓여 있었습니다. 비단이며 보석도 가득했지요. 알리바바는 눈을 몇 번이나 비볐습니다. 이걸 다 어디서 가져왔을까.〕 |
| `images/02-treasure-2.webp` | A cave mouth where a woodcutter loads three sacks onto donkeys and covers them with firewood, and a modest home where his wife stares at spilled gold coins, warm lamplight. 〔이 쪽에 실린 글 (4/14) — 그림에 글자는 넣지 마세요. 왼쪽: 알리바바는 금화만 조금 담기로 했습니다. 자루 세 개에 나눠 담아 당나귀 등에 실었지요. 그 위에는 나뭇짐을 수북이 덮었습니다. 닫혀라, 참깨. 바위가 다시 붙었지요. 알리바바는 뒤도 돌아보지 않고 산을 내려왔습니다. / 오른쪽: 집에 온 알리바바가 자루를 풀자 아내는 눈이 휘둥그레졌습니다. 이걸 다 세어 봐야겠어요. 세지 말고 그냥 묻어 둡시다.〕 |

## 3장 · 형의 욕심

| 파일명 | 장면 |
|---|---|
| `images/03-brother.webp` | A wealthy courtyard where a woman examines a measuring bowl and finds a gold coin stuck to the wax on its base, and her plump husband storming off to confront his brother, comic greed. 〔이 쪽에 실린 글 (5/14) — 그림에 글자는 넣지 마세요. 왼쪽: 카심의 아내는 어쩐지 이상했습니다. 가난한 집이 대체 뭘 잰다는 거지? 그래서 됫박 바닥에 몰래 밀랍을 발라 두었지요. / 오른쪽: 이 금이 대체 어디서 났느냐! 알리바바는 끝내 숨기지 못했지요. 있었던 일을 하나도 빠짐없이 말했습니다. 나도 그 동굴에 데려가라.〕 |
| `images/03-brother-2.webp` | A treasure cave where a plump man in silks frantically stuffs sacks with gold, then hammers on the sealed rock door shouting wrong words, panic on his face, comic and tense. 〔이 쪽에 실린 글 (6/14) — 그림에 글자는 넣지 마세요. 왼쪽: 이튿날 카심이 산으로 갔습니다. 노새를 열 마리나 끌고 갔지요. 열려라, 참깨! 바위가 쩍 갈라졌습니다. 안으로 들어간 카심은 그만 정신이 나갔지요. 자루마다 금을 그득그득 퍼 담았습니다. / 오른쪽: 이제 다 됐다. 그런데 나가려는 순간 주문이 떠오르지 않았지요. 열려라, 보리!〕 |

## 4장 · 표시된 대문

| 파일명 | 장면 |
|---|---|
| `images/04-chalk.webp` | A desert road at night where a woodcutter leads laden donkeys home, and a courtyard where a quick-eyed young servant takes charge with her sleeves rolled up, calm and capable. 〔이 쪽에 실린 글 (7/14) — 그림에 글자는 넣지 마세요. 왼쪽: 카심은 끝내 돌아오지 못했습니다. 이튿날 알리바바가 산으로 갔지요. 동굴 앞에서 형을 찾아 겨우 집으로 모셔 왔습니다. 형수는 그 자리에 주저앉아 울었지요. 집안이 발칵 뒤집혔습니다. / 오른쪽: 형네 집 하녀인데 눈치가 아주 빨랐지요. 소문이 나면 큰일 납니다. 제가 알아서 하겠어요.〕 |
| `images/04-chalk-2.webp` | A town alley at dawn where a young servant notices a chalk mark on her gate, then swiftly chalking the same mark on every door down the street, clever and lively. 〔이 쪽에 실린 글 (8/14) — 그림에 글자는 넣지 마세요. 왼쪽: 한편 도적들은 시신이 사라진 것을 알았습니다. 동굴을 아는 자가 또 있구나. 도적 하나가 마을로 내려갔지요. 이 집 저 집 다니며 이리저리 수소문했습니다. / 오른쪽: 이튿날 아침 모르지아나가 물을 길러 나왔지요. 표시를 보고는 걸음을 뚝 멈췄습니다. '이게 왜 여기 있지?' 모르지아나는 얼른 분필을 가져왔지요. 그러고는 온 동네 대문에 똑같은 표시를 그렸습니다. 스무 집, 서른 집이 되었지요.〕 |

## 5장 · 마당의 항아리 마흔 개

| 파일명 | 장면 |
|---|---|
| `images/05-jars.webp` | A courtyard at dusk where a disguised oil merchant unloads thirty-nine enormous jars from mules while a kind householder welcomes him in, warm lamplight, quietly ominous. 〔이 쪽에 실린 글 (9/14) — 그림에 글자는 넣지 마세요. 왼쪽: 그날 밤 도적들은 헛걸음을 했습니다. 똑같은 표시가 온 동네에 있었으니까요. 어느 집이란 말이냐! 결국 두목이 직접 나섰지요. 이번에는 표시를 하지 않았습니다. / 오른쪽: 이제 됐다. 며칠 뒤 알리바바의 집에 손님이 찾아왔습니다. 기름 장수 차림이었지요. 하룻밤만 묵게 해 주십시오.〕 |
| `images/05-jars-2.webp` | A moonlit courtyard of huge jars where a young servant leans toward one and a whispered voice comes from inside, her eyes widening as she answers in a low tone, gripping. 〔이 쪽에 실린 글 (10/14) — 그림에 글자는 넣지 마세요. 왼쪽: 밤이 깊었습니다. 모르지아나가 등잔에 불을 켜려는데 기름이 떨어져 있었지요. 마당 항아리에서 좀 덜어 오자. 모르지아나가 항아리에 다가갔습니다. / 오른쪽: 모르지아나는 숨이 딱 멎었습니다. 그래도 목소리를 낮춰 짐짓 대답했지요. 아직이다. 기다려라. 예, 알겠습니다.〕 |

## 6장 · 모르지아나의 춤

| 파일명 | 장면 |
|---|---|
| `images/06-dance.webp` | A courtyard where a young servant pours steaming oil into row after row of jars and robbers come tumbling out hopping and yelping, scrambling over the wall, comic mayhem, no blood. 〔이 쪽에 실린 글 (11/14) — 그림에 글자는 넣지 마세요. 왼쪽: 모르지아나는 서두르지 않았습니다. 기름이 든 항아리로 가서 기름을 크게 한 솥 펐지요. 그러고는 부엌에서 팔팔 끓였습니다. 부글부글. 김이 천장까지 올라갔지요. 모르지아나는 그 솥을 들고 마당으로 나왔습니다. / 오른쪽: 그러고는 항아리마다 뜨거운 기름을 부었지요. 안에서 소란이 일었습니다. 으악, 뜨거워! 도적들이 항아리에서 뛰쳐나와 껑충껑충 뛰었지요. 그러고는 담을 넘어 뿔뿔이 달아났습니다. 지붕에 있던 두목도 그 소리에 놀라 몸을 숨겼지요.〕 |
| `images/06-dance-2.webp` | A lamplit dining room where a young servant dances with a dagger at her sash before a smiling guest, drums beating, family clapping, tension hidden under celebration. 〔이 쪽에 실린 글 (12/14) — 그림에 글자는 넣지 마세요. 왼쪽: 이튿날 두목이 또 찾아왔습니다. 이번에는 장사꾼 차림이었지요. 두목은 알리바바의 아들과 슬슬 친해졌습니다. 그러다 저녁 초대까지 받았지요. 그런데 상을 차리던 모르지아나가 그 얼굴을 보았습니다. / 오른쪽: 모르지아나는 곰곰이 생각하다 무릎을 쳤지요. 식사 자리에서였습니다. 모르지아나가 나서서 춤을 추겠다고 청했지요. 둥, 둥, 둥. 북소리에 맞춰 빙글빙글 돌았습니다. 허리에는 작은 단검을 차고 있었지요. 춤이 손님 앞에서 뚝 멈추더니 옷자락을 스치듯 젖혔습니다.〕 |

## 7장 · 정체가 드러나다

| 파일명 | 장면 |
|---|---|
| `images/07-revealed.webp` | A dining room where a young servant flings back a guest's robe revealing a hidden sword, the man leaping up to find neighbours blocking the doorway, dramatic and satisfying. 〔이 쪽에 실린 글 (13/14) — 그림에 글자는 넣지 마세요. 왼쪽: 그 순간 손님의 옷 안이 드러났습니다. 허리에 커다란 칼이 숨겨져 있었지요. 주인님, 이분을 보십시오! 모르지아나가 소리쳤습니다. / 오른쪽: 아들이 들고 있던 잔을 떨어뜨렸습니다. 두목이 벌떡 일어나 문으로 달아나려 했습니다. 그런데 문 앞에 사람들이 빽빽이 서 있었지요. 이웃들이 지키고 있었던 것입니다. 모르지아나가 춤을 추기 전에 미리 불러 둔 것이었지요.〕 |
| `images/07-revealed-2.webp` | A courtyard where a grateful householder takes a young servant's hands before the family, and later villagers receiving gold to dig a well and mend a road, warm and generous. 〔이 쪽에 실린 글 (14/14) — 그림에 글자는 넣지 마세요. 왼쪽: 알리바바는 한참 동안 말이 없었습니다. 그러고는 모르지아나를 바라봤지요. 자네가 우리 집을 다 살렸네. 이제 종이 아닐세. / 오른쪽: 얼마 뒤 알리바바는 다시 동굴로 갔습니다. 이번에는 아들과 함께였지요. 가져온 금은 마을 사람들에게 고루 나누었습니다. 그 돈으로 우물을 파고 무너진 길도 고쳤지요. 다만 주문만은 아무에게도 알리지 않았습니다. 그 집만 아는 말로 남았지요.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
