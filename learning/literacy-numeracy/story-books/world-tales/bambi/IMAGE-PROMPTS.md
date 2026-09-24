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
bold clean outlines, saturated storybook colors, green forest light shifting
through four seasons, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a central European forest,
a wide meadow, a winter thicket and a stream, expressive gentle animal faces,
wide panoramic composition, warm and never gory.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Bambi: a spotted fawn with long legs and huge dark eyes, growing into a young
stag. His mother: a slender doe with a calm watchful face. Feline: a lively young
doe with a white throat. Gobo: a small weak fawn. Thumper the hare: a plump brown
hare with twitching ears. The old stag: a great grey-muzzled deer with wide
antlers who appears and disappears without a sound.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a spotted fawn standing on thin legs in a sunlit forest thicket, its mother's head lowered protectively beside it, ferns and wildflowers all around, shafts of green light, tender and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 태어난 아침

| 파일명 | 장면 |
|---|---|
| `images/01-birth.webp` | A hidden forest thicket of tall ferns where a newborn spotted fawn wobbles on thin legs while its mother licks it clean, soft green light, tender. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 깊은 숲 한가운데 덤불이 우거진 곳이 있었습니다. 고사리가 무성해서 아무도 들여다볼 수 없었지요. 어느 여름날 아침 그곳에서 새끼 노루가 태어났습니다. 이름은 밤비였지요. 온몸에 하얀 점이 박혀 있었습니다. 눈이 크고 까맸지요. 코끝은 까맣고 촉촉했습니다. / 오른쪽: 다리는 가늘어 나뭇가지 같았습니다. 일어서려다 자꾸 미끄러졌지요. 어미가 밤비를 정성껏 핥아 주었습니다. 한참 만에 밤비가 겨우 일어섰지요. 네 다리가 후들후들 떨렸습니다. 어미는 그것을 가만히 지켜보았지요. 덤불 사이로 아침 햇살이 들어왔습니다.〕 |
| `images/01-birth-2.webp` | A plump hare, magpies and squirrels peeking through ferns at a newborn fawn nestled beside its mother, dappled sunlight, warm and charming. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 소문은 금세 숲에 퍼졌습니다. 이웃들이 하나둘 구경을 왔지요. 토끼 아저씨가 제일 먼저 왔습니다. 코를 씰룩거리며 밤비를 들여다보았지요. 어머, 벌써 눈을 떴네! / 오른쪽: 다람쥐는 나무를 오르내리며 구경했지요. 밤비는 그 소리를 다 들었습니다. 아직 무슨 뜻인지는 몰랐지요. 그저 어미 곁에 바싹 붙어 있었습니다. 해가 나뭇잎 사이로 어른거렸지요. 밤비는 그대로 잠이 들었습니다.〕 |

## 2장 · 넓은 풀밭

| 파일명 | 장면 |
|---|---|
| `images/02-meadow.webp` | A narrow forest path opening onto a vast sunlit meadow, a fawn gazing up at the huge sky while its mother blocks his way with her body, exhilarating. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 며칠이 지나자 밤비는 제법 잘 걸었습니다. 어느 아침 어미가 말했지요. 오늘은 풀밭에 가 보자꾸나. / 오른쪽: 끝없는 풀밭이 펼쳐져 있었지요. 하늘이 통째로 내려앉은 것 같았습니다. 우아, 하늘이 이렇게 넓어요? 밤비는 당장 뛰어나가려 했지요.〕 |
| `images/02-meadow-2.webp` | A doe standing tall at a treeline with ears turned and nose lifted while a fawn bounds heedlessly out into the grass, butterflies rising, joyful and anxious. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 풀밭에서는 늘 조심해야 한단다. 숲과는 아주 다른 곳이거든. 여기서는 몸을 숨길 데가 없어. / 오른쪽: 그다음에 나가는 거란다. 밤비는 고개를 끄덕였지요. 그런데 풀밭을 보자 그 말을 잊었습니다. 밤비는 그냥 뛰쳐나갔지요.〕 |

## 3장 · 숲의 친구들

| 파일명 | 장면 |
|---|---|
| `images/03-friends.webp` | Two young fawns chasing each other through tall meadow grass that parts like waves, butterflies scattering, summer flowers everywhere, joyful. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 풀밭에는 다른 사슴들도 나와 있었습니다. 밤비 또래도 있었지요. 팔리네라는 어린 노루였습니다. 목에 하얀 무늬가 있었지요. 안녕! 너도 오늘 처음 왔니? / 오른쪽: 온종일 뛰어다니며 놀았지요. 나 잡아 봐라! 풀이 밤비의 키만큼 자라 있었습니다. 뛰어다니면 풀이 파도처럼 갈라졌지요. 나비들이 놀라 날아올랐습니다.〕 |
| `images/03-friends-2.webp` | A meadow edge where a hare sits bolt upright, squirrels chatter overhead and three fawns rest side by side in the grass, warm sunlight, tender. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 풀밭에는 이웃이 많았습니다. 토끼는 늘 귀를 쫑긋 세우고 있었지요. 조금만 소리가 나도 벌떡 일어섰습니다. 다람쥐는 나무 위에서 수다를 떨었지요. 오늘은 도토리가 잘 여물었어! / 오른쪽: 몸이 약해 금방 숨이 찼지요. 조금만 쉬었다 하자, 응? 밤비와 팔리네는 걸음을 늦췄습니다. 셋은 나란히 풀밭에 엎드렸지요.〕 |

## 4장 · 늙은 사슴

| 파일명 | 장면 |
|---|---|
| `images/04-old-stag.webp` | A hushed meadow where a great grey-muzzled stag with wide antlers steps soundlessly out of the treeline, every animal turning to look, awe-struck stillness. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 어느 날이었습니다. 풀밭이 갑자기 조용해졌지요. 새들도 울음을 그쳤습니다. 어른 사슴들이 모두 고개를 들었지요. 숲 가장자리에서 무언가가 걸어 나왔습니다. 아주 커다란 사슴이었지요. 뿔이 나뭇가지처럼 넓게 뻗어 있었습니다. 주둥이 둘레가 잿빛이었지요. / 오른쪽: 그런데 발소리가 하나도 나지 않았습니다. 풀도 흔들리지 않았지요. 밤비는 숨을 죽이고 바라보았습니다. 이런 사슴은 처음이었지요. 저분이 누구예요?〕 |
| `images/04-old-stag-2.webp` | An old stag looking down at a small fawn who cannot meet his gaze, then vanishing silently between misty trunks, quietly majestic. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 늙은 사슴이 밤비 앞에 멈춰 섰습니다. 한참 동안 내려다보았지요. 밤비는 고개를 들 수가 없었습니다. 이윽고 늙은 사슴이 입을 열었지요. / 오른쪽: 늘 어미 곁에만 있었으니까요. 늙은 사슴은 더 묻지 않았지요. 그 말만 남기고 숲으로 사라졌습니다. 왔을 때처럼 소리 없이 갔지요. 그날부터 밤비는 그 말이 자꾸 떠올랐습니다. 자면서도 그 목소리가 들렸지요.〕 |

## 5장 · 첫눈

| 파일명 | 장면 |
|---|---|
| `images/05-winter.webp` | A snow-covered forest where a fawn touches its nose to fresh snow in wonder then bounds about leaving tracks, its mother watching, bright winter light. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 여름이 가고 가을이 왔습니다. 나뭇잎이 붉게 물들었지요. 그러다 어느 날 아침이었습니다. 숲이 온통 하얗게 변해 있었지요. 밤비는 처음 보는 것에 코를 대 보았습니다. 차가워요! / 오른쪽: 밤비는 깜짝 놀라 뒤로 물러섰지요. 어미가 빙그레 웃었습니다. 눈이란다. 겨울이 온 거야. 밤비는 눈밭을 폴짝폴짝 뛰어다녔지요. 발자국이 뒤로 죽 이어졌습니다. 어미도 오랜만에 웃었지요.〕 |
| `images/05-winter-2.webp` | Deer stripping bark from trees in deep snow at blue winter dusk, a doe nudging her share toward her fawn, beautiful and sober. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그런데 겨울은 생각보다 길었습니다. 눈이 자꾸 쌓여 갔지요. 풀은 눈 밑에 파묻혔습니다. 먹을 것이 몹시 귀해졌지요. 사슴들은 나무껍질을 벗겨 먹었습니다. 밤비도 이빨로 껍질을 뜯었지요. / 오른쪽: 어미는 자기 몫을 자꾸 밤비 쪽으로 밀어 주었지요. 어미의 등뼈가 도드라져 보였습니다. 어머니는요? 나는 배부르단다.〕 |

## 6장 · 혼자 남은 날

| 파일명 | 장면 |
|---|---|
| `images/06-alone.webp` | A doe suddenly alert at a snowy meadow edge, pushing her fawn toward the thicket as distant noise rises, the fawn bolting away, tense. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 어느 겨울 아침이었습니다. 밤비와 어미는 풀밭 가장자리에 있었지요. 그런데 어미가 갑자기 고개를 들었습니다. 귀가 한쪽으로 돌아갔지요. 풀밭 너머가 소란스러웠습니다. 사람들의 소리였지요. 어미는 밤비를 덤불 쪽으로 밀었습니다. / 오른쪽: 달려라! 뒤돌아보지 말고 달려라! 밤비는 그대로 내달렸지요. 숨이 턱에 닿도록 달렸습니다.〕 |
| `images/06-alone-2.webp` | A young deer standing alone in a wide empty snowy clearing looking back, falling snow, quiet and poignant with no violence shown. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 나무들이 옆으로 휙휙 지나갔습니다. 눈이 사방으로 튀었지요. 얼마나 달렸는지 알 수 없었습니다. 다리에 힘이 하나도 남지 않았지요. 한참 뒤 밤비는 걸음을 멈췄지요. 그러고는 뒤를 돌아보았습니다. / 오른쪽: 어미가 보이지 않았지요. 밤비는 어미를 불렀습니다. 하지만 아무 대답도 없었지요. 눈이 조용히 내리고 있었지요. 사방이 하얗기만 했습니다. 밤비는 그 자리에 오래 서 있었지요. 그날 밤비는 처음으로 혼자 밤을 보냈습니다. 덤불 속에서 몸을 웅크렸지요.〕 |

## 7장 · 다시 봄

| 파일명 | 장면 |
|---|---|
| `images/07-spring.webp` | A spring meadow bright with new grass where a young stag with small antlers meets a grown doe, both taller than before, hopeful and warm. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 겨울이 끝나고 눈이 녹았습니다. 땅에서 새싹이 돋아났지요. 숲이 다시 초록으로 물들었습니다. 밤비도 몰라보게 자랐지요. 머리에는 작은 뿔이 돋았습니다. 어느 날 풀밭에서 낯익은 얼굴을 만났지요. 팔리네였습니다. / 오른쪽: 팔리네도 훌쩍 자라 있었지요. 너, 키가 많이 컸구나! 너도 그런걸.〕 |
| `images/07-spring-2.webp` | A young stag pausing at a treeline with ears turned and nose lifted to the wind while a doe watches in surprise, spring meadow beyond, quietly moving. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 팔리네가 풀밭으로 나가려 했습니다. 그런데 밤비가 걸음을 멈췄지요. 잠깐만. / 오른쪽: 한참 만에 밤비가 고개를 끄덕였지요. 이제 됐어. 나가자. 팔리네가 눈을 동그랗게 떴습니다.〕 |

## 8장 · 숲을 걷는 법

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | A deep evening forest where an old stag leads a young one along a hidden path between trunks, long slanting light, quietly majestic. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 어느 저녁이었습니다. 숲이 아주 고요했지요. 해가 나무 사이로 길게 비껴들었지요. 밤비는 혼자 숲길을 걷고 있었습니다. 그때 앞쪽에 무언가가 서 있었지요. 늙은 사슴이었습니다. / 오른쪽: 늙은 사슴은 숲 깊은 곳으로 걸어갔습니다. 밤비도 뒤를 따랐지요. 길도 없는 곳이었습니다. 이윽고 늙은 사슴이 멈춰 섰지요.〕 |
| `images/08-ending-2.webp` | An old stag showing a young stag how to read the wind and the hidden ways, then walking away alone between the trunks as the young stag stands steady, moving. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 늙은 사슴은 말없이 숲 읽는 법을 보여 주었습니다. 바람이 어디서 오는지 알려 주었지요. 어디로 몸을 숨길지도 일러 주었습니다. 사람이 다니는 길도 짚어 주었지요. 밤비는 하나하나 마음에 새겼습니다. / 오른쪽: 어느덧 사방이 어두워졌지요. 늙은 사슴이 밤비를 돌아보았습니다. 이제 혼자서도 다닐 수 있겠구나. 그러고는 조용히 걸어갔지요. 나무 사이로 모습이 사라졌습니다. 밤비는 이제 혼자서도 숲을 걸었지요.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
