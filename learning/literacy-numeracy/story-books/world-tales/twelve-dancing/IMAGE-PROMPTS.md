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
bold clean outlines, saturated storybook colors, silvery moonlight and warm
candle golds, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a castle bedchamber, a staircase
beneath a bed, forests of silver, gold and diamond leaves, an underground lake
and a lantern-lit ballroom, expressive faces, wide panoramic composition,
magical and never frightening.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
The old soldier: a weathered cheerful man with a grey moustache and a patched
coat. The twelve princesses: sisters in matching pale gowns, the eldest proud and
watchful, the youngest small and nervous. The king: a worried man with a heavy
crown. An old woman on the road: a small bent figure with a bundle and a knowing
smile.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: twelve pairs of worn-through dancing shoes lined up outside a bedroom door, a trapdoor glowing faintly beneath a bed, and a silvery forest visible through the opening below, mysterious and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 닳아 버린 신발

| 파일명 | 장면 |
|---|---|
| `images/01-shoes.webp` | A castle bedchamber at dawn with twelve beds in a row and twelve pairs of worn-through dancing shoes on the floor, morning light, puzzling and charming. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 한방에 침대가 나란히 열둘 놓여 있었습니다. 임금님의 열두 공주가 함께 잠드는 방이었지요. 모두 곱고 사이가 좋았습니다. 창가에는 꽃병이 열둘 놓여 있었지요. 밤이면 열두 사람의 숨소리가 고르게 났습니다. 누가 봐도 얌전히 자는 밤이었지요. / 오른쪽: 밤이 되면 문을 밖에서 단단히 잠갔습니다. 임금님이 손수 열쇠를 챙겼지요. 그런데 아침마다 이상한 일이 벌어졌습니다. 방문은 그대로 잠겨 있었지요. 창문도 닫힌 채였습니다. 그런데 신발이 온통 닳아 있었지요. 열두 켤레가 모두 구멍투성이였습니다. 밑창이 종잇장처럼 얇아져 있었지요.〕 |
| `images/01-shoes-2.webp` | A worried king in a heavy crown questioning twelve princesses in pale gowns who all look innocently back at him, a pile of ruined shoes at their feet, comic tension. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 임금님은 그것이 도무지 이해되지 않았습니다. 새 신을 지어 주어도 마찬가지였지요. 하룻밤이면 또 구멍이 났습니다. 대체 밤새 어디를 다녀오는 것이냐? 공주들은 눈을 동그랗게 떴지요. / 오른쪽: 문이 잠겨 있었잖아요. 큰공주가 얌전히 대답했습니다. 임금님은 더 물을 수가 없었지요. 그래도 마음이 놓이지 않았습니다. 밤마다 신발값만 늘어 갔지요. 구두장이가 날마다 성으로 불려 왔습니다.〕 |

## 2장 · 임금님의 방

| 파일명 | 장면 |
|---|---|
| `images/02-decree.webp` | A castle square where a herald reads a proclamation to a murmuring crowd while young princes step forward confidently, banners and sunlight, lively. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 임금님은 마침내 온 나라에 알렸습니다. 전령이 광장에서 큰 소리로 읽었지요. 공주들의 비밀을 알아내는 사람에게 상을 내리겠다. 공주 가운데 하나와 혼인시키겠노라. / 오른쪽: 못 알아내면 이 나라를 떠나야 한다. 조건이 만만치 않았지요. 그래도 나서는 사람이 많았습니다. 이웃 나라 왕자들이 앞다투어 찾아왔지요. 그쯤이야 하룻밤이면 됩니다.〕 |
| `images/02-decree-2.webp` | A princess offering a goblet to a confident prince outside a bedroom door, and the same prince slumped fast asleep in his chair by morning, comic failure. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 첫 번째 왕자가 공주들의 방 앞에 앉았습니다. 문을 열어 두고 밤을 지키기로 했지요. 큰공주가 술 한 잔을 내왔습니다. 밤이 기니 이거라도 드세요. 왕자는 고맙게 받아 마셨지요. 달큼한 냄새가 났습니다. 왕자는 한 방울도 남기지 않았지요. / 오른쪽: 그런데 얼마 안 가 눈이 스르르 감겼습니다. 왕자는 의자에 기대 곯아떨어졌지요. 아침에 깨어 보니 해가 중천이었습니다. 신발은 또 닳아 있었지요. 두 번째 왕자도 세 번째 왕자도 마찬가지였습니다. 다들 사흘 만에 쫓겨났지요.〕 |

## 3장 · 길에서 만난 노파

| 파일명 | 장면 |
|---|---|
| `images/03-cloak.webp` | A country roadside where a weathered old soldier with a patched coat carries a heavy bundle for a small bent old woman, warm afternoon light, kindly. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그 무렵 늙은 병사 하나가 그 나라를 지났습니다. 전쟁에서 다쳐 이제는 싸울 수 없는 몸이었지요. 갈 곳도 없고 돈도 없었습니다. 길을 걷다 짐을 인 노파를 만났지요. 노파는 몹시 힘들어 보였습니다. 병사는 얼른 다가갔지요. / 오른쪽: 제가 들어 드리겠습니다. 병사는 노파의 짐을 대신 들었습니다. 한참을 함께 걸었지요. 마을 어귀에 닿자 노파가 걸음을 멈췄습니다.〕 |
| `images/03-cloak-2.webp` | An old woman handing a worn grey cloak to an astonished soldier at a village gate, then the road empty behind him, magical and warm. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 성에 가서 공주들의 비밀을 알아내 보게. 병사는 손을 저었습니다. 왕자들도 못 한 일을 제가 어떻게 합니까. / 오른쪽: 마시는 척만 하고 몰래 버리게. 노파는 보따리에서 무언가를 꺼냈습니다. 낡은 잿빛 망토였지요. 이걸 걸치면 아무에게도 보이지 않는다네.〕 |

## 4장 · 마시지 않은 술

| 파일명 | 장면 |
|---|---|
| `images/04-wine.webp` | A castle hall where courtiers snigger at an old soldier volunteering before the king, and later a princess bringing him a goblet outside a bedroom door, candlelight. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 병사는 성으로 갔습니다. 제가 한번 해 보겠습니다. 신하들이 코웃음을 쳤지요. / 오른쪽: 저녁이 되자 병사는 좋은 옷을 얻어 입었습니다. 공주들의 방 앞에 자리를 잡았지요. 밤이 깊어 갈 무렵이었습니다. 큰공주가 술잔을 들고 나왔지요. 편히 주무시라고 가져왔어요.〕 |
| `images/04-wine-2.webp` | An old soldier pretending to drink while wine trickles into his collar, then lying down snoring loudly as princesses peep out from a doorway, comic and sly. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 병사는 노파의 말을 떠올렸습니다. 잔을 입에 대고 마시는 시늉만 했지요. 술은 몰래 옷깃 뒤로 흘려보냈습니다. 잘 마셨습니다. 이제 좀 졸리는군요. 병사는 자리에 누웠지요. 그러고는 코를 드르렁드르렁 골았습니다. / 오른쪽: 자는 척을 아주 잘했지요. 방 안에서 소곤거리는 소리가 들렸습니다. 저 사람도 잠들었어. 거봐, 늙은 병사가 뭘 하겠어.〕 |

## 5장 · 잠든 척

| 파일명 | 장면 |
|---|---|
| `images/05-trapdoor.webp` | A bedchamber where princesses dress in fine gowns and dancing shoes as a bed slides aside to reveal a glowing staircase descending into the earth, magical. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 공주들이 침대에서 일어났습니다. 장롱에서 고운 옷을 꺼내 입었지요. 새 무도화도 하나씩 신었습니다. 막내 공주만 어쩐지 머뭇거렸지요. 언니, 오늘은 그만두면 안 될까? / 오른쪽: 큰공주가 웃으며 손을 저었습니다. 저렇게 코를 고는데 무슨 걱정이니. 큰공주가 제 침대를 툭 쳤지요.〕 |
| `images/05-trapdoor-2.webp` | A faint outline of a cloaked figure treading on a princess's hem on a glowing underground staircase, the youngest princess turning in alarm, magical and tense. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 병사는 얼른 일어났습니다. 노파가 준 망토를 걸쳤지요. 그러자 제 손도 보이지 않았습니다. 병사는 살금살금 계단으로 갔지요. 막내 공주 바로 뒤를 따랐습니다. 그런데 그만 치맛자락을 밟고 말았지요. 막내 공주가 화들짝 놀랐습니다. / 오른쪽: 큰공주가 뒤를 돌아보았지요. 아무도 없잖니. 못에 걸렸겠지. 막내 공주는 자꾸 뒤를 돌아봤지요. 그래도 계단은 계속 아래로 이어졌습니다.〕 |

## 6장 · 은과 금과 다이아몬드 숲

| 파일명 | 장면 |
|---|---|
| `images/06-forests.webp` | An enchanted underground forest with leaves of pure silver chiming in a breeze, princesses walking through and a branch snapping behind them, dazzling. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 계단이 끝나자 놀라운 곳이 펼쳐졌습니다. 땅 밑인데도 사방이 환했지요. 첫 번째 숲이 나타났습니다. 나뭇잎이 모두 은이었지요. 바람이 불 때마다 짤랑짤랑 소리가 났습니다. 병사는 슬쩍 가지 하나를 꺾었지요. 은잎이 손안에서 서늘했습니다. 병사는 그것을 품속에 넣었지요. / 오른쪽: 뚝, 하는 소리가 울렸습니다. 막내 공주가 걸음을 멈췄지요. 언니, 방금 무슨 소리 안 났어? 쓸데없는 소리 말고 어서 와.〕 |
| `images/06-forests-2.webp` | Two enchanted forests side by side, one with golden leaves and one with diamond leaves blazing like stars, princesses passing through, dazzling and magical. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 두 번째 숲은 나뭇잎이 금이었습니다. 빛을 받아 눈이 부실 지경이었지요. 병사는 여기서도 가지를 꺾었습니다. 또 뚝 소리가 났지요. 막내 공주가 또 뒤를 돌아보았습니다. 세 번째 숲은 잎이 다이아몬드였지요. / 오른쪽: 별처럼 반짝반짝 빛났습니다. 병사는 마지막 가지를 꺾어 품에 넣었지요. 이번에도 소리가 났습니다. 언니, 정말 누가 따라오는 것 같아! 언니들은 웃기만 했지요. 다이아몬드 잎이 발밑에서 반짝였습니다. 막내 공주만 걸음이 자꾸 느려졌지요.〕 |

## 7장 · 호수 건너 무도회장

| 파일명 | 장면 |
|---|---|
| `images/07-ball.webp` | An underground lake with twelve small boats crossing, one riding noticeably low in the water as its oarsman strains, lanterns reflecting, enchanting. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 숲을 지나자 커다란 호수가 나왔습니다. 물이 거울처럼 잔잔했지요. 물가에 작은 배 열두 척이 기다리고 있었습니다. 배마다 젊은이가 하나씩 앉아 있었지요. 공주들이 한 척씩 나누어 탔습니다. 병사는 막내 공주의 배에 몰래 올라탔지요. 배를 젓던 젊은이가 고개를 갸웃했습니다. / 오른쪽: 오늘따라 배가 왜 이렇게 무겁지? 아무리 저어도 나가질 않네. 막내 공주의 얼굴이 어두워졌지요.〕 |
| `images/07-ball-2.webp` | A brilliantly lit underground ballroom where twelve princesses dance all night with their partners, shoes wearing through, a faint cloaked figure watching from a corner. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 호수 건너에는 무도회장이 있었습니다. 창마다 불빛이 환했지요. 안에서 음악 소리가 흘러나왔습니다. 공주들은 신이 나서 뛰어 들어갔지요. 그러고는 밤새 춤을 추었습니다. 돌고 돌고 또 돌았지요. 신발이 닳고 또 닳았습니다. 병사는 구석에서 그 모습을 지켜보았지요. / 오른쪽: 목이 말라 잔을 하나 슬쩍 챙기기도 했습니다. 바닥에 신발 조각이 흩어졌지요. 그래도 공주들은 멈추지 않았습니다. 닭이 울 무렵에야 무도회가 끝났지요. 공주들은 다시 배를 타고 돌아왔습니다. 신발은 벌써 구멍이 나 있었지요.〕 |

## 8장 · 세 개의 가지

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | An old soldier slipping back to his bed and snoring as princesses return at dawn, and later standing before a frowning king in a throne room, tense and comic. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 병사는 공주들보다 먼저 올라왔습니다. 망토를 벗고 다시 누웠지요. 그러고는 코를 골았습니다. 공주들이 돌아와 그것을 보고 안심했지요. 거봐, 아무것도 모르잖아. / 오른쪽: 가는 곳을 하나하나 눈에 담았지요. 사흘째 아침이 되었습니다. 병사는 임금님 앞에 섰지요. 공주님들은 밤마다 땅 밑에서 춤을 춥니다.〕 |
| `images/08-ending-2.webp` | A throne room where an old soldier holds up three branches of silver, gold and diamond leaves, the twelve princesses lowering their eyes, the king rising in astonishment. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 거짓말할 생각 마라. 증거가 있느냐? 병사는 품속에 손을 넣었습니다. 그러고는 가지 세 개를 꺼냈지요. 은과 금과 다이아몬드가 반짝였습니다. 방 안이 술렁였지요. / 오른쪽: 공주들은 그제야 고개를 숙였습니다. 더는 감출 수가 없었지요. 임금님은 병사에게 약속한 상을 내렸습니다. 병사는 큰공주와 혼인했지요. 땅 밑 계단은 그날로 막아 버렸답니다. 공주들의 신발도 이제 닳지 않았지요.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
