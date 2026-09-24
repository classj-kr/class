# 제미나이 그림 프롬프트

이 책은 하나의 이야기를 8개의 장(챕터)으로 나눠 담았고, 펼침면은 모두
16개예요. 펼침면 하나에 그림이 한 장씩 들어갑니다.
그림이 펼침면 전체 폭을 가득 채우고, 그 아래에 이야기가 왼쪽·오른쪽으로 나뉘어 들어갑니다.

아래 프롬프트를 제미나이에 그대로 넣어서 생성한 뒤, 파일명을 정확히 맞춰서
`images/` 폴더에 저장하면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보여요.)

> **⚠️ 다시 그려 주실 것 (2026-08-28 점검)**
> - `03-genie` — **캄캄한 동굴에 갇힌 알라딘이 손을 비비다 반지에서 지니가 나오는** 장면이어야 합니다. 지금은 집 안에서 램프의 지니가 나오는 그림이라 바로 다음 장(`03-genie-2`)과 똑같습니다.
> - `03-genie` — 알라딘이 **청바지에 야구모자, 운동화** 차림입니다. 다른 장처럼 아라비아 옷(흰 바지, 조끼, 작은 모자)으로 그려 주세요.

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
ambers, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a bustling Middle Eastern market city,
a jewelled underground cave, a palace of domes and fountains, and open desert,
expressive comic faces, wide panoramic composition, adventurous and never
frightening.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Aladdin: a scruffy cheerful boy about 13 in a patched tunic and sash, later in
fine embroidered robes. His mother: a tired kind woman in a worn headscarf. The
sorcerer: a tall man in dark travelling robes with a pointed beard and darting
eyes, drawn as comically sinister. The genie: an enormous smiling figure of blue
smoke with folded arms. The princess: a lively young woman in silks. The sultan:
a round jolly man with an enormous turban.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a battered brass oil lamp resting on a stone ledge in a treasure cave, threads of golden smoke curling from its spout, jewels and coins glittering in the dark beyond, and a domed city skyline glimpsed through the cave mouth above, magical and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 낯선 아저씨

| 파일명 | 장면 |
|---|---|
| `images/01-stranger.webp` | A bustling desert-city street of awnings and spice stalls where a scruffy boy loafs on a wall, and a tall stranger in dark travelling robes approaching his humble doorway, warm gold light. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 옛날 어느 도시에 알라딘이 살았습니다. 아버지는 일찍 세상을 떠났지요. 알라딘은 어머니와 둘이 살았습니다. 살림이 몹시 어려웠지요. 그런데도 알라딘은 날마다 놀기만 했습니다. 어머니는 그때마다 한숨을 쉬었지요. / 오른쪽: 그러던 어느 날 낯선 아저씨가 찾아왔습니다. 먼 나라 옷차림이었지요. 내가 네 삼촌이란다. 오랜만에 고향에 왔지.〕 |
| `images/01-stranger-2.webp` | A market where a stranger buys a boy fine clothes and food, and the two walking far out past the city into a barren rocky valley under a wide sky, ominous but bright. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그런데 아저씨는 돈을 척척 냈습니다. 고기며 과일을 잔뜩 사 왔지요. 알라딘에게 새 옷도 사 주었습니다. 내일 좋은 곳에 가자꾸나. / 오른쪽: 이튿날 둘은 성 밖으로 나갔습니다. 한참을 걷고 또 걸었지요. 집도 사람도 보이지 않았습니다. 이윽고 메마른 바위산에 이르렀지요. 아저씨가 걸음을 뚝 멈췄습니다.〕 |

## 2장 · 닫혀 버린 돌문

| 파일명 | 장면 |
|---|---|
| `images/02-cave.webp` | A rocky valley where the ground splits open at a sorcerer's word revealing a stair, and below a vast cavern heaped with jewels and gold, a boy descending wide-eyed, magical and dazzling. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아저씨가 품에서 이상한 가루를 꺼내 뿌렸습니다. 그러고는 주문 같은 말을 중얼거렸지요. 그러자 땅이 쩍 갈라졌습니다. 흙먼지가 뽀얗게 일었지요. 아래로 계단이 보였지요. / 오른쪽: 다른 것은 절대 만지지 마라. 아저씨가 반지를 하나 끼워 줬지요. 이건 너를 지켜 주는 반지다.〕 |
| `images/02-cave-2.webp` | A cave stair where a boy holds up his arm for help as a sorcerer above demands the lamp first, then flings powder and the ground grinds shut, the boy sealed in darkness, dramatic. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 알라딘은 램프를 찾아 두리번거렸습니다. 구석에 낡은 램프 하나가 놓여 있었지요. 알라딘은 그것을 품에 넣고 돌아섰습니다. 가는 길에 보석도 몇 개 주머니에 넣었지요. 이윽고 계단 밑에 이르렀습니다. / 오른쪽: 램프를 먼저 올려라! 먼저 올라가고 드릴게요. 그 순간 아저씨의 얼굴이 일그러졌지요.〕 |

## 3장 · 램프의 지니

| 파일명 | 장면 |
|---|---|
| `images/03-genie.webp` | A pitch-dark cave where a boy rubs his hands in despair and a ring glows, smoke swirling into a genie, and then the boy suddenly standing in his own doorway as his mother rushes out, joyful. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 동굴 안은 캄캄했습니다. 알라딘은 그렇게 이틀을 갇혀 있었지요. 배도 고프고 무섭기도 했습니다. 알라딘은 저도 모르게 두 손을 싹싹 비볐지요. 그런데 손가락의 반지가 스르르 빛났습니다. 연기가 뭉게뭉게 피어올랐지요. / 오른쪽: 부르셨습니까, 주인님. 반지의 지니였습니다. 저를 밖으로 내보내 주세요!〕 |
| `images/03-genie-2.webp` | A humble room where a woman polishes an old lamp and an enormous smiling blue genie billows out filling the space, the mother tumbling backwards, a boy stepping forward, comic and magical. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그런데 집에는 먹을 것이 하나도 없었습니다. 어머니가 알라딘이 가져온 램프를 꺼냈지요. 이거라도 닦아서 팔자. 천으로 문지르는 순간이었습니다. / 오른쪽: 연기 속에서 커다란 지니가 나타났습니다. 무엇이든 말씀만 하십시오. 어머니는 놀라 뒤로 넘어졌지요. 알라딘이 앞으로 나섰습니다.〕 |

## 4장 · 공주를 만나다

| 파일명 | 장면 |
|---|---|
| `images/04-princess.webp` | A city street cleared for a royal procession where a boy peeks from behind a wall as a curtained litter passes and the veil lifts for an instant, sunlight and colour, charming. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그날부터 알라딘의 집은 넉넉해졌습니다. 그러던 어느 날 거리가 소란했지요. 공주님이 지나가신다! / 오른쪽: 이윽고 가마가 지나갔습니다. 그때 휘장이 살짝 들렸지요. 알라딘은 그만 그 자리에 얼어붙었습니다. 그날 밤 도무지 잠이 오지 않았지요.〕 |
| `images/04-princess-2.webp` | A palace hall where a woman in a worn headscarf presents a tray of blazing jewels to an astonished sultan, and a great procession of camels and gift-bearers filling the street outside, spectacular. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이튿날 어머니는 궁궐로 갔습니다. 보석을 담은 쟁반을 들고서요. 동굴에서 알라딘이 가져온 것들이었지요. 쟁반을 본 임금님은 눈이 휘둥그레졌습니다. 이런 보석은 처음 보는군. / 오른쪽: 소식을 들은 알라딘은 얼른 지니를 불렀지요. 좋은 옷과 말이 필요해요. 선물도 잔뜩요.〕 |

## 5장 · 하룻밤 사이에

| 파일명 | 장면 |
|---|---|
| `images/05-palace.webp` | A sultan naming his condition in a palace hall, and next morning a vast jewelled palace standing where an empty lot had been, the whole court crowding the windows in astonishment, dazzling. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 임금님이 혼인을 허락했습니다. 다만 한 가지를 요구했지요. 공주가 살 궁전이 있어야 하네. 내 궁궐 맞은편에 말이야. / 오른쪽: 그날 밤 알라딘은 램프를 문질렀지요. 이튿날 아침이었습니다. 임금님이 창을 열자 눈앞이 온통 반짝였지요. 어제까지 빈터였던 곳이었습니다. 커다란 궁전이 떡하니 서 있었지요. 기둥마다 보석이 박혀 있었습니다. 임금님은 한참을 그 자리에 서 있었지요.〕 |
| `images/05-palace-2.webp` | A grand wedding filling a city with music and lanterns, and far away a dark-robed sorcerer hearing the news at a caravan stop and packing to travel, threatening and comic. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 혼례가 크게 열렸습니다. 온 도시가 함께 잔치를 벌였지요. 알라딘과 공주는 사이좋게 잘 지냈습니다. 알라딘은 어려운 이들을 부지런히 도왔지요. 그래서 사람들이 그를 무척 좋아했습니다. 그렇게 몇 해가 흘렀지요. / 오른쪽: 그런데 먼 나라의 마법사도 그 소문을 들었습니다. 동굴에 알라딘을 가둔 바로 그 사람이었지요. 그놈이 살아 있었단 말인가! 램프도 가졌겠구나.〕 |

## 6장 · 사라진 궁전

| 파일명 | 장면 |
|---|---|
| `images/06-swap.webp` | A palace forecourt where a disguised pedlar cries his trade with a cart of shiny new lamps, passersby laughing, and a princess at a high window sending a maid to fetch an old one, ironic and tense. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 마법사는 장사꾼 차림을 했습니다. 수레에 새 램프를 잔뜩 실었지요. 하나같이 반짝반짝 윤이 나는 것들이었습니다. 그러고는 궁전 앞을 오가며 외쳤습니다. 낡은 램프를 새것으로! / 오른쪽: 지나가던 사람들이 깔깔 웃었지요. 아이들이 뒤를 졸졸 따라다녔습니다. 세상에 저런 바보가 있나. 그 소리가 궁전 안까지 들렸습니다. 마침 알라딘은 사냥을 나가고 없었지요. 공주가 창밖을 내다봤습니다.〕 |
| `images/06-swap-2.webp` | An alley where a disguised sorcerer rubs an old lamp and a genie rises, and a returning hunting party finding only bare ground where a jewelled palace stood, the sultan furious, dramatic. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 시녀가 낡은 램프를 내밀었습니다. 마법사가 얼른 그것을 받아 챙겼지요. 그러고는 새 램프를 건네고 돌아섰습니다. 골목으로 들어가 램프를 벅벅 문질렀지요. 곧 지니가 나타났습니다. 이 궁전을 통째로 옮겨라. / 오른쪽: 그날 저녁 알라딘이 사냥에서 돌아왔지요. 그런데 눈앞이 텅 비어 있었습니다. 궁전이 감쪽같이 사라진 것이었지요. 공주도 함께 사라졌습니다. 소식을 들은 임금님이 노발대발했지요.〕 |

## 7장 · 사막 끝의 궁전

| 파일명 | 장면 |
|---|---|
| `images/07-desert.webp` | A desperate young man rubbing a ring as a genie appears, then standing in a vast desert with a jewelled palace shimmering on the far horizon, and creeping over its wall at night, adventurous. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 알라딘은 앞이 캄캄했습니다. 밤새 성 밖을 헤맸지요. 그러다 문득 반지가 생각났습니다. 알라딘은 손가락을 문질렀지요. 그러자 반지의 지니가 나타났습니다. / 오른쪽: 아주 먼 사막 너머입니다. 저를 그리로 보내 주세요. 눈을 뜨니 온통 모래였습니다. 저 멀리 낯익은 궁전이 보였지요.〕 |
| `images/07-desert-2.webp` | A palace bedroom where a princess weeps with relief seeing the young man, and a dining hall where she offers a cup to the sorcerer who drains it and slumps forward asleep, tense and satisfying. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 공주가 알라딘을 보고 울음을 터뜨렸습니다. 어떻게 오셨어요! 저 사람이 램프를 가졌어요. / 오른쪽: 저녁상에 저를 초대하게 해 주세요. 그날 저녁이었지요. 공주가 마법사에게 잔을 권했습니다. 이제 마음을 바꿨어요.〕 |

## 8장 · 다시 돌아온 자리

| 파일명 | 장면 |
|---|---|
| `images/08-return.webp` | A palace room where a young man retrieves the lamp and a genie rises again, and next morning a sultan flinging open his window to see the jewelled palace restored and his daughter waving, joyous. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 알라딘이 마법사의 품에서 램프를 꺼냈습니다. 그러고는 천으로 벅벅 문질렀지요. 지니가 다시 나타났습니다. 오랜만입니다, 주인님. 궁전을 제자리로 돌려주세요. / 오른쪽: 이튿날 아침이 밝았습니다. 임금님이 여느 때처럼 창을 열었지요. 그런데 맞은편에 궁전이 떡하니 서 있었습니다. 며칠째 비어 있던 자리였지요. 임금님은 맨발로 뛰어나갔습니다.〕 |
| `images/08-return-2.webp` | A lamp being locked away in a chest, and a palace with its gates standing open as townspeople come and go receiving grain and help, the young couple among them, warm and generous. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 마법사는 먼 사막에 남겨졌습니다. 알라딘은 램프를 궤짝 깊이 넣어 두었습니다. 이젠 쓸 일이 없겠지요. / 오른쪽: 꼭 필요할 때만요. 알라딘은 궁전 문을 늘 열어 두었지요. 곡식을 나누고 무너진 집도 고쳐 주었습니다. 사람들은 그 이름을 오래 기억했습니다. 램프 때문이 아니라요.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
