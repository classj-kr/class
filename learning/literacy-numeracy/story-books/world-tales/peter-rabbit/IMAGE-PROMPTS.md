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
bold clean outlines, saturated storybook colors, soft English countryside light,
ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a sandy rabbit burrow under a fir tree, a walled
vegetable garden with frames and tool shed, a lane and a farmhouse, expressive
comic animal faces, wide panoramic composition, funny and never frightening,
full-bleed artwork with NO white border, NO paper edge, NO sketchbook margin.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

> **이미 그려진 그림 열여덟 장을 보고 그대로 옮겨 적은 것입니다.** 상상해서 쓴
> 것이 아니라 화면에 있는 차림을 받아 적었어요. 그러니 이 설명대로 그리면
> 지금 책에 들어가 있는 그림과 어긋나지 않습니다.
>
> 처음에는 "a small brown rabbit in a blue jacket" 정도로만 적혀 있었습니다.
> 그러니 그릴 때마다 피터가 다른 토끼가 되더군요. 한 장에서는 머리 큰 만화
> 토끼, 한 장에서는 몸이 긴 산토끼였습니다. 아저씨는 더 심해서 한 장에서는
> 납작모자에 안경, 한 장에서는 맨머리에 더벅머리였지요.
> 아래 설명을 **한 글자도 빼지 말고** 매번 붙여 넣어 주세요.

```
Peter: a young rabbit with warm golden-brown fur and a cream chest and muzzle,
a ROUND head with big dark eyes and soft pink inner ears, drawn as a cheeky
cartoon child — NOT a lean long-bodied wild hare. He wears a bright blue
jacket with three round yellow buttons, and no trousers. He often lets his
pink tongue stick out. His face and body must look the same in every picture.

His mother: a taller rabbit in a pink polka-dot dress with a white frilled
apron and a matching pink polka-dot bonnet, carrying a wicker basket of
carrots and greens.

Flopsy, Mopsy and Cotton-tail: three smaller rabbits in red hooded cloaks
with the hoods up, cream fronts, neat and quiet.

Mr McGregor: a stout gardener with a flat brown cap, a thick brown moustache
and NO beard, NO spectacles, a round ruddy nose, a mustard-yellow checked
shirt, a brown waistcoat, olive-tan trousers and heavy brown boots (tan work
gloves when he is digging). Comically grumpy, never menacing. Keep the flat
cap and the moustache in EVERY picture — never draw him bare-headed, never
give him a beard or glasses.

A friendly sparrow trio.
```

## 피터가 무엇을 걸치고 있는지 (장면마다 다릅니다)

이야기가 진행되면서 피터는 신발과 웃옷을 차례로 잃습니다. 그림이 그것을 따라가지
않으면 앞뒤가 어긋납니다. 프롬프트에 아래 한 줄을 **꼭 함께** 넣어 주세요.

| 파일 | 피터의 차림 |
|---|---|
| `cover` · `01-warning` · `01-warning-2` · `02-gate` · `02-gate-2` · `03-parsley` · `03-parsley-2` | `wearing his blue jacket and small brown shoes` |
| `04-chase` | `wearing his blue jacket; both little brown shoes are flying off him as he runs` |
| `04-chase-2` · `05-net` | `wearing his blue jacket, but barefoot — his shoes are gone` |
| `05-net-2` · `06-can` · `06-can-2` · `07-escape` · `07-escape-2` · `08-ending` | `no jacket and barefoot — he left the jacket in the net` |
| `08-ending-2` | 피터는 이불 속에 있고, 그의 파란 웃옷과 작은 신발은 **허수아비**가 걸치고 있습니다 |

> 신발은 **토끼 발에 맞는 아주 작은 신**입니다. 어른 장화만 하게 그리면 안 됩니다.

## 그림 가장자리

> 종이 가장자리나 흰 테두리를 그리지 마세요. 그림이 칸을 가득 채워야 합니다.
> 스케치북에 그린 것처럼 위나 옆에 흰 여백이 남으면 책에서 그대로 보입니다.

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a small brown rabbit in a blue jacket squeezing under a wooden garden gate into a lush vegetable garden, cabbages and carrot tops all around, a watering can in the corner, charming and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 그 밭에는 가지 마라

| 파일명 | 장면 |
|---|---|
| `images/01-warning.webp` | A sandy burrow under a great fir tree where a rabbit mother in apron and cap takes up a basket while four young rabbits listen, warm morning light, charming. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아주 커다란 전나무가 한 그루 있었습니다. 그 뿌리 밑 모랫굴에 토끼 식구가 살았지요. 아기 토끼는 모두 넷이었습니다. 플롭시, 몹시, 코튼테일, 그리고 피터였지요. 앞의 셋은 말을 잘 들었습니다. 피터만 유난히 말썽꾸러기였지요. / 오른쪽: 어느 아침 어머니가 바구니를 들었습니다. 빵을 사러 가려는 참이었지요. 얘들아, 들판에서 놀아라. 길가에서 놀아도 좋고.〕 |
| `images/01-warning-2.webp` | A rabbit mother warning four young rabbits gravely at a burrow mouth, three nodding and one in a blue jacket gazing off toward a distant garden wall, comic and telling. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 왜요, 엄마? 어머니의 얼굴이 조금 어두워졌습니다. 거기서 너희 아버지가 크게 혼이 났단다. / 오른쪽: 세 남매는 얌전히 고개를 끄덕였지요. 그런데 피터는 딴 데를 보고 있었습니다. 어머니가 나가자 셋은 들판으로 갔지요. 피터만 자리에 남아 있었습니다. 눈이 자꾸 밭 쪽으로 갔거든요. 어머니 말이 오히려 더 궁금하게 만들었지요.〕 |

## 2장 · 대문 밑으로

| 파일명 | 장면 |
|---|---|
| `images/02-gate.webp` | Three tidy rabbits picking blackberries in a lane while a rabbit in a blue jacket squeezes under a wooden garden gate into rows of lettuces, lush and exciting. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 세 남매는 들판으로 나갔습니다. 길가에서 검은딸기를 따 먹었지요. 입가가 새까매지도록 먹었습니다. 그동안 피터는 반대쪽으로 달렸지요. 곧장 맥그리거 아저씨네 밭으로 갔습니다. 밭은 나무 대문으로 막혀 있었지요. / 오른쪽: 그런데 대문 밑에 틈이 하나 있었습니다. 토끼 한 마리가 지나갈 만했지요. 피터는 몸을 납작하게 했습니다. 그러고는 쏙 하고 안으로 들어갔지요. 눈앞이 온통 초록이었습니다. 이렇게 넓은 밭은 처음이었지요.〕 |
| `images/02-gate-2.webp` | A rabbit in a blue jacket happily devouring lettuces, French beans and radishes in a sunlit vegetable garden, his tummy round, funny and lush. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 우와, 이게 다 먹을 거잖아! 피터는 눈이 휘둥그레졌습니다. 상추가 줄줄이 심겨 있었지요. 강낭콩도 무도 있었습니다. 피터는 상추부터 우적우적 먹었지요. / 오른쪽: 깍지째 아삭아삭 씹어 먹었습니다. 마지막으로 무를 뽑아 먹었지요. 배가 볼록해졌습니다. 그런데 어쩐지 속이 이상했지요. 너무 많이 먹었던 모양입니다.〕 |

## 3장 · 배가 아파서

| 파일명 | 장면 |
|---|---|
| `images/03-parsley.webp` | A rabbit in a blue jacket clutching his round tummy and wandering toward a cucumber frame, then rounding a corner to face a huge boot, comic tension. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 배가 슬슬 아파 왔습니다. 피터는 배를 문질렀지요. 파슬리를 좀 먹으면 나을 텐데. 어머니가 그렇게 말한 적이 있었거든요. 피터는 파슬리를 찾아 나섰습니다. / 오른쪽: 그런데 모퉁이를 도는 순간이었지요. 눈앞에 커다란 장화가 있었습니다. 고개를 드니 맥그리거 아저씨였지요. 무릎을 꿇고 양배추를 심던 참이었지요. 손에는 흙이 잔뜩 묻어 있었습니다. 두 눈이 딱 마주쳤지요. 피터는 그대로 얼어붙었습니다.〕 |
| `images/03-parsley-2.webp` | A vegetable garden where a stout gardener leaps up shaking a rake as a rabbit in a blue jacket bolts away between cabbage rows, hilarious motion. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 둘은 그대로 얼어붙었습니다. 피터도 놀라고 아저씨도 놀랐지요. 먼저 정신을 차린 것은 아저씨였습니다. 아저씨가 벌떡 일어났지요. 이 도둑놈아! 게 섰거라! / 오른쪽: 아저씨가 갈퀴를 흔들며 쫓아왔지요. 거기 서지 못해! 피터는 죽을힘을 다해 달렸습니다.〕 |

## 4장 · 맨발로 달리다

| 파일명 | 장면 |
|---|---|
| `images/04-chase.webp` | A garden chase where a rabbit in a blue jacket sprints between cabbages and potato rows, tiny shoes flying off behind him, a gardener pounding after with a rake, comic motion. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 피터는 양배추밭으로 뛰어들었습니다. 커다란 잎 사이를 헤치고 달렸지요. 그러다 신발 한 짝이 벗겨졌습니다. 뒤를 돌아볼 새도 없었지요. 이어서 감자밭을 가로질렀습니다. 거기서 나머지 한 짝도 잃었지요. / 오른쪽: 이제 맨발이었습니다. 그래도 오히려 잘 달릴 수 있었지요. 뒤에서 아저씨의 발소리가 쿵쿵 났습니다. 이놈, 어디로 갔느냐!〕 |
| `images/04-chase-2.webp` | A gooseberry bush under a net where a rabbit is caught fast by his jacket buttons, struggling with tears in his eyes as a shadow approaches, funny and touching. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 피터는 몸을 숨길 곳을 찾았습니다. 마침 까치밥나무가 눈에 띄었지요. 위에 그물이 씌워져 있었습니다. 피터는 그 밑으로 뛰어들었지요. 몸을 웅크리고 숨을 죽였습니다. / 오른쪽: 웃옷 단추가 그물에 걸린 것이었습니다. 피터는 이리저리 버둥거렸지요. 그럴수록 더 단단히 걸렸습니다. 눈에서 눈물이 핑 돌았지요. 발소리가 점점 가까워졌지요. 피터는 눈을 꼭 감았습니다.〕 |

## 5장 · 마지막 힘을 다해

| 파일명 | 장면 |
|---|---|
| `images/05-net.webp` | Three sparrows fluttering encouragement around a tangled rabbit who twists free, leaving his empty blue jacket hanging in the gooseberry net, funny and heartening. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그때 참새 세 마리가 날아왔습니다. 피터 둘레를 빙빙 돌며 짹짹거렸지요. 힘내! 조금만 더! 포기하면 안 돼! / 오른쪽: 툭, 하고 단추가 떨어졌습니다. 피터는 그물에서 빠져나왔지요. 푸른 웃옷은 그물에 그대로 걸려 있었습니다. 아깝지만 돌아볼 새가 없었지요. 피터는 다시 달아났지요. 참새들이 뒤에서 응원해 주었습니다.〕 |
| `images/05-net-2.webp` | A dim tool shed where a rabbit dives into a metal watering can and sinks into cold water inside, only his ears showing, comic and miserable. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 눈앞에 낡은 창고가 보였습니다. 문이 조금 열려 있었지요. 피터는 그 안으로 뛰어들었습니다. 안은 어둑하고 흙냄새가 났지요. 숨을 곳을 급히 찾았습니다. 커다란 물뿌리개가 눈에 띄었지요. / 오른쪽: 피터는 그 안으로 쏙 들어갔습니다. 그런데 안에 물이 고여 있었지요. 차가운 물에 온몸이 젖었습니다. 나오고 싶었지만 참았지요. 밖에서 발소리가 들렸거든요.〕 |

## 6장 · 물뿌리개 속에서

| 파일명 | 장면 |
|---|---|
| `images/06-can.webp` | A dim tool shed where a gardener turns sharply at a sneeze and reaches for a watering can as a soaked rabbit leaps out, hilarious suspense. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 맥그리거 아저씨가 창고로 들어왔습니다. 화분 밑을 하나하나 들춰 보았지요. 피터는 숨도 쉬지 못했습니다. 그런데 코가 간질간질했지요. 참으려고 애를 썼습니다. 하지만 도저히 참을 수가 없었지요. 에취! / 오른쪽: 거기 있었구나! 커다란 손이 물뿌리개로 뻗었지요. 피터는 냅다 뛰어올랐지요. 물뿌리개가 쨍그랑 넘어졌습니다.〕 |
| `images/06-can-2.webp` | Flowerpots crashing down as a gardener trips and a soaked rabbit leaps out a shed window into a wide garden, water dripping from his fur, comic chaos. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 피터는 창문 쪽으로 내달렸습니다. 화분이 우당탕 쏟아졌지요. 아저씨가 발에 걸려 넘어졌습니다. 아이고, 내 허리! / 오른쪽: 피터는 젖은 몸으로 달렸지요. 털에서 물이 뚝뚝 떨어졌습니다. 이번에도 대문이 어디인지 알 수 없었지요. 피터는 잠시 걸음을 멈췄습니다. 숨이 턱까지 차올랐거든요. 그래도 쉴 수는 없었지요. 저 뒤에서 발소리가 쿵쿵 울렸습니다. 피터는 다시 달리기 시작했지요.〕 |

## 7장 · 대문을 찾아서

| 파일명 | 장면 |
|---|---|
| `images/07-escape.webp` | A garden pond with goldfish where a white cat sits motionless on a rock and a rabbit tiptoes past, then spotting a distant wooden gate, tense and hopeful. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 피터는 연못가로 갔습니다. 금붕어 몇 마리가 헤엄치고 있었지요. 그런데 바위 위에 하얀 고양이가 앉아 있었습니다. 꼬리 끝만 살랑살랑 움직였지요. 피터는 그냥 조용히 지나쳤습니다. 고양이와는 얽히지 않는 편이 나았으니까요. 피터는 발소리를 죽였습니다. / 오른쪽: 그러고는 담을 따라 걸었지요. 그러다 저 멀리 나무 대문이 보였지요. 피터의 눈이 번쩍 뜨였습니다. 저기다!〕 |
| `images/07-escape-2.webp` | A rabbit squeezing under a wooden gate and tumbling into open meadow grass, then racing across fields toward a great fir tree, relief and speed. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 뒤에서 아저씨가 또 쫓아왔습니다. 갈퀴를 흔들며 소리를 질렀지요. 피터는 뒤도 돌아보지 않았습니다. 대문 밑 틈이 눈앞에 보였지요. 피터는 몸을 던지듯 빠져나갔습니다. 들판 풀밭 위로 데굴데굴 굴렀지요. / 오른쪽: 그러고는 벌떡 일어나 달렸습니다. 숨이 차도 멈추지 않았지요. 전나무가 보일 때까지 달렸습니다. 굴 앞에 이르자 다리가 풀렸지요. 피터는 그대로 쓰러졌지요. 한동안 일어나지 못했습니다.〕 |

## 8장 · 저녁에 마신 차

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | A cosy burrow where a rabbit mother sighs at a soaked barefoot rabbit and puts him to bed with a spoonful of chamomile tea, warm and tender. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 어머니가 굴 안에서 나왔습니다. 피터를 보고는 한숨을 쉬었지요. 털은 젖고 발은 맨발이었으니까요. 신발도 웃옷도 어디에 두고 온 거니? 피터는 고개를 푹 숙였지요. 발끝만 만지작거렸습니다. / 오른쪽: 어머니는 피터를 안아 자리에 눕혔습니다. 그날 저녁 피터는 몸이 좋지 않았지요. 어머니는 캐모마일 차를 끓였습니다. 한 숟갈 먹고 푹 자거라.〕 |
| `images/08-ending-2.webp` | Three tidy young rabbits feasting on bread, milk and blackberries in a burrow, and outside a garden scarecrow wearing a small blue jacket with tiny shoes on top, funny. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그동안 세 남매는 저녁을 먹었습니다. 빵과 우유와 검은딸기가 나왔지요. 셋은 배불리 먹었습니다. 피터는 그 냄새만 맡았지요. 이불 밖으로 코만 내밀었습니다. 딸기 냄새가 참 달았지요. 조금 억울했지만 어쩔 수 없었지요. 말을 안 들은 값이었으니까요. / 오른쪽: 이튿날 아침이었습니다. 맥그리거 아저씨가 허수아비를 세웠지요. 까마귀를 쫓으려고요. 그 허수아비는 작은 웃옷을 입고 있었습니다. 머리에는 작은 신발이 얹혀 있었지요. 바로 피터가 두고 온 것이었답니다.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
