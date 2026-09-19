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
bold clean outlines, saturated storybook colors, warm autumn woodland light, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a medieval animal court in a forest clearing, a
fox's burrow, a farmyard and a river bank, animals dressed in simple medieval
clothes, very expressive comic faces, wide panoramic composition, funny and
never cruel.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Reynard the fox: a lean red fox with a knowing grin, a small green cloak and
restless paws. King Noble the lion: a broad golden lion in a crown, slow and
grand. Isengrim the wolf: a big grey wolf in a dented helmet, always furious.
Bruin the bear: a huge brown bear with a honey-stained muzzle. Tibert the cat: a
small striped cat with a nervous tail. Grimbart the badger: a stout badger in a
scholar's cap.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a sly red fox standing calmly in the centre of a woodland clearing court, a lion king on a mossy throne above and animals crowded on all sides, autumn leaves falling, witty and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 임금님의 부름

| 파일명 | 장면 |
|---|---|
| `images/01-court.webp` | A woodland clearing court where a crowned lion sits on a mossy throne surrounded by animals in medieval dress, one conspicuous empty seat in the front row, autumn light. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 숲속 나라의 임금님은 사자 노블이었습니다. 갈기가 금빛으로 빛나는 사자였지요. 해마다 가을이 되면 큰 재판이 열렸습니다. 억울한 일이 있으면 누구나 말할 수 있었지요. 올해도 넓은 풀밭에 짐승들이 모였습니다. 작은 쥐부터 커다란 곰까지 빙 둘러앉았지요. / 오른쪽: 임금님이 이끼 낀 바위에 올라앉았습니다. 자, 할 말이 있는 자는 나오너라. 그런데 딱 한 자리가 비어 있었지요. 앞줄 가운데 자리였습니다.〕 |
| `images/01-court-2.webp` | An angry grey wolf in a dented helmet standing to accuse before a lion king in a woodland court, animals murmuring around, comic and lively. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 늑대 이젠그림이 벌떡 일어났습니다. 찌그러진 투구를 쓴 늑대였지요. 임금님, 제 말씀부터 들어 주십시오. 저 여우가 제 집 닭을 다 물어 갔습니다! / 오른쪽: 제 새끼들 앞에서 저를 놀리기까지 했지요. 짐승들이 웅성거렸습니다. 임금님은 턱을 쓰다듬었지요. 흠, 또 그 여우로군.〕 |

## 2장 · 쏟아지는 고발

| 파일명 | 장면 |
|---|---|
| `images/02-accusations.webp` | An uproarious animal court where a bear with a swollen nose and a cat with a bandaged tail both shout complaints at once, animals leaning in, comic chaos. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 늑대가 말을 마치자 여기저기서 앞발이 올라왔습니다. 먼저 곰 브라운이 일어섰지요. 코가 퉁퉁 부어 있었습니다. 저 좀 보십시오! 꿀을 얻는다고 갔다가 이 꼴이 됐습니다. / 오른쪽: 이번에는 고양이 티베르가 나섰습니다. 꼬리에 붕대를 감고 있었지요. 저는 쥐를 잡으러 갔다가요. 덫에 걸려 밤새 매달려 있었습니다!〕 |
| `images/02-accusations-2.webp` | A lion king raising a paw for silence in a noisy woodland court full of hens, rabbits and moles all complaining at once, then a hush with nobody volunteering, comic. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 닭들도 몰려나와 꼬꼬댁거렸습니다. 토끼도 두더지도 할 말이 있었지요. 온 숲이 여우 이야기로 들끓었습니다. 임금님이 앞발을 크게 들었지요. 조용, 조용! / 오른쪽: 임금님은 이맛살을 찌푸렸지요. 본인 말도 들어 봐야 하지 않겠느냐. 그 여우를 당장 데려오너라.〕 |

## 3장 · 곰이 다녀오다

| 파일명 | 장면 |
|---|---|
| `images/03-bear.webp` | A huge brown bear lumbering up to a fox's burrow at the foot of a hill where a lean red fox greets him with a wide friendly grin, autumn woods. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 한참 만에 곰 브라운이 일어섰습니다. 제가 다녀오겠습니다. 저만 한 덩치면 겁먹겠지요. / 오른쪽: 아이고, 마침 잘 오셨네요! 곰은 헛기침을 하고 말했지요. 임금님이 부르신다. 어서 가자.〕 |
| `images/03-bear-2.webp` | A bear jamming his head into a split tree trunk after honey while a fox quietly pulls out the wedge, the trunk snapping shut, bees swirling, hilarious. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 저 나무에 꿀이 가득한데요. 드시고 가시지요. 곰은 재판이고 뭐고 다 잊어버렸습니다. 침이 꿀떡 넘어갔지요. / 오른쪽: 그런데 여우가 슬쩍 쐐기를 뽑았습니다. 틈이 딱 닫혔지요. 어이쿠! 이 여우 놈아! 곰은 발버둥을 쳤지만 소용없었습니다. 여우는 콧노래를 부르며 굴로 들어갔지요. 벌들이 곰의 코를 쏘아 댔습니다.〕 |

## 4장 · 고양이도 다녀오다

| 파일명 | 장면 |
|---|---|
| `images/04-cat.webp` | A bear returning with a more swollen nose, and a striped cat setting off confidently to a fox's burrow where the fox greets him warmly, comic. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 곰은 겨우 빠져나와 돌아왔습니다. 코가 더 부어 있었지요. 임금님이 한숨을 쉬었습니다. 다른 자가 가 보아라. / 오른쪽: 고양이는 꼬리를 세우고 숲으로 갔습니다. 여우가 이번에도 웃으며 맞이했지요. 어서 오세요. 마침 잘 오셨네요. 저 헛간에 쥐가 어찌나 많은지 몰라요.〕 |
| `images/04-cat-2.webp` | A barn doorway at dusk where a striped cat is caught by a rope snare and a farmer runs out with a stick, while a fox strolls away yawning, very funny. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 딱 한 마리만 잡고 가지요. 고양이는 침을 꼴깍 삼켰습니다. 그러고는 헛간으로 뛰어들었지요. 그런데 문턱에 밧줄이 걸려 있었습니다. 올가미가 목에 척 걸렸지요. / 오른쪽: 고양이는 대롱대롱 매달렸습니다. 농부가 몽둥이를 들고 달려 나왔지요. 여우는 그 소리를 뒤로하고 돌아섰습니다. 저런, 안됐군요. 그러고는 낮잠을 자러 갔지요. 헛간에서는 한참 소동이 났습니다.〕 |

## 5장 · 오소리의 설득

| 파일명 | 장면 |
|---|---|
| `images/05-badger.webp` | A stout badger in a scholar's cap volunteering in a woodland court, then arriving at a burrow where a lounging fox eyes him, warm evening woods. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이제 아무도 가려 하지 않았습니다. 그때 오소리 그림바르트가 일어섰지요. 학자 모자를 쓴 오소리였습니다. 제가 가 보겠습니다. / 오른쪽: 여우가 굴 앞에 늘어져 있었지요. 또 무슨 꿀 이야기를 하려나. 오소리는 손을 저었습니다.〕 |
| `images/05-badger-2.webp` | A badger earnestly persuading a fox at a burrow entrance while the fox scratches his chin, then a sly glint in the fox's eye, comic and warm. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 안 가면 온 숲이 너를 잡으러 올 거야. 곰도 고양이도 단단히 벼르고 있고. 여우는 한참 생각했습니다. / 오른쪽: 가서 한번 이야기해 보지 뭐. 오소리는 마음이 놓였습니다. 그런데 여우의 눈이 반짝 빛났지요. 무슨 꿍꿍이가 있는 눈이었습니다.〕 |

## 6장 · 여우의 이야기

| 파일명 | 장면 |
|---|---|
| `images/06-trial.webp` | A fox arriving at a woodland court where a wolf bares his teeth and a bear glares, the fox standing calmly with a paw on his heart, comic tension. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이튿날 여우가 재판정에 나타났습니다. 짐승들이 술렁였지요. 늑대가 이를 드러냈습니다. 곰도 고양이도 노려보았지요. 그런데 여우는 조금도 떨지 않았습니다. 오히려 아주 슬픈 얼굴을 했지요. / 오른쪽: 앞발을 가슴에 얹고 말했습니다. 임금님, 저는 억울합니다. 저를 두고 온갖 말이 도는 모양인데요.〕 |
| `images/06-trial-2.webp` | A fox spinning a tale before a lion king who leans forward greedily at the word treasure while a wolf scoffs, animals murmuring, witty. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 저는 임금님을 위해 일하고 있었습니다. 임금님을 노리는 무리가 있거든요. 재판정이 조용해졌습니다. / 오른쪽: 거짓말이 술술 나오는구나! 여우는 눈 하나 깜짝하지 않았지요. 그자들이 숨겨 둔 보물도 제가 압니다.〕 |

## 7장 · 있지도 않은 보물

| 파일명 | 장면 |
|---|---|
| `images/07-treasure.webp` | A fox describing a treasure map with a paw while the lion king listens greedily, then a wolf and a bear floundering chest-deep in a muddy swamp, comic. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 여우는 없는 보물의 자리를 술술 지어냈습니다. 동쪽 늪을 지나면 마른 우물이 있습니다. 그 밑에 금이 궤짝으로 묻혀 있지요. / 오른쪽: 늑대와 곰이 앞장섰지요. 짐승들이 우르르 늪으로 몰려갔습니다. 그런데 늪은 발이 푹푹 빠지는 진창이었지요. 허우적대는 소리가 여기저기서 났습니다. 어이쿠! 여기 아무것도 없는데!〕 |
| `images/07-treasure-2.webp` | A fox with a pilgrim staff bowing to a lion king, then tossing the staff away and strolling whistling over a hill, autumn fields, wry and funny. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그사이 여우는 슬그머니 자리를 떴습니다. 지팡이를 하나 짚고 나섰지요. 저는 순례를 좀 다녀오겠습니다! 잘못을 뉘우치러 가는 길입니다. / 오른쪽: 여우는 공손히 인사를 했지요. 그러고는 언덕을 넘어 사라졌습니다. 고개를 넘자마자 지팡이를 던져 버렸지요. 휴, 이번에도 잘 빠져나왔군. 여우는 콧노래를 부르며 걸었지요. 앞길이 훤했습니다. 볕이 등을 따뜻하게 데웠지요.〕 |

## 8장 · 숲은 여전히

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | Animals searching a swamp until sunset and finding nothing, then a mud-covered wolf storming back to court in fury, comic and vivid. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 짐승들은 해가 질 때까지 늪을 뒤졌습니다. 그런데 금은커녕 돌멩이 하나 없었지요. 마른 우물조차 찾지 못했습니다. 그제야 속은 것을 알았지요. 늑대가 씩씩거리며 돌아왔습니다. / 오른쪽: 그 여우를 다시 잡아 옵시다! 이번에는 제가 벌을 내리겠습니다! 임금님이 둘레를 살펴보았지요.〕 |
| `images/08-ending-2.webp` | A woodland court at day's end where animals avoid each other's eyes, the lion king coughing awkwardly and dismissing them, falling autumn leaves, wry and warm. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 곰은 제 코를 만졌습니다. 고양이는 꼬리를 감췄지요. 오소리는 딴 데를 보았습니다. 아무도 먼저 입을 열지 않았지요. 누가 헛기침을 하자 다들 움찔했습니다. 저, 저는 할 말이 없습니다. / 오른쪽: 지난번 일이 아직 생생했거든요. 재판정에 숨소리 하나 없었지요. 임금님은 헛기침을 했습니다. 오늘은 이만 하자꾸나. 그러고는 재판을 끝냈지요. 짐승들은 하나둘 집으로 돌아갔습니다. 숲에는 낙엽만 사르르 떨어졌지요.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
