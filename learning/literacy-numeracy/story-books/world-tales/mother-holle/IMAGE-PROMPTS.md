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
bold clean outlines, saturated storybook colors, warm meadow light and soft
snowfall, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a German farmyard with a stone well,
a sunlit otherworld meadow with a bread oven and an apple tree, and a cosy
cottage, expressive faces, wide panoramic composition, gentle and never
frightening.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
The diligent girl (EXACTLY as in 01-well to 06-gold): about 13, CHESTNUT-BROWN
hair in a short bob tied low at the back, BROWN eyes, round cheeks with a touch
of pink. A PALE GREEN kerchief with tiny white dots knotted under the chin,
a PALE BLUE pinafore dress over a WHITE blouse, a WHITE apron, brown ankle boots.
Calm and willing. In the gold shower she may be dusted gold, but her hair stays
chestnut and her face stays the same — NO auburn wavy hair, NO blue eyes,
NO bare feet.
Mother Holle (EXACTLY as in 05-holle): a very LARGE old woman, a head and a half
taller than the girl, broad and sturdy. GREY hair in a bun on top of her head —
NO headscarf. A wide, warm, toothy grin with big teeth showing. A colourful
striped-and-patterned shawl (red, blue, yellow) over a DARK BLUE dress, a WHITE
apron, sturdy shoes. Always with her HUGE white feather quilt. Warm and
grandmotherly, never witch-like. She is never small and never plain.
The lazy stepsister (EXACTLY as in 07-lazy, but with a pink bow): PLUMP with a
round face, REDDISH-BROWN CURLS, ONE PINK bow on top of her head, a PINK
polka-dot dress with white frills and a white collar, white socks, black shoes.
Smirking or yawning. NO bonnet, NO twin-tails, NO blue bow.
The stepmother (EXACTLY as in 02-fall): thin and sharp-faced, a DARK GREY
headscarf, a grey-brown long-sleeved dress with a BROWN bodice, a patterned
brown apron, brown boots. Angry mouth. NO bun, NO navy dress.
Everyone must look like the same person from picture to picture — same hair,
same clothes, same face.
```

> **열여덟 장 가운데 열다섯 장이 그려졌습니다.** 아직 없는 것은
> `cover.webp` · `end.webp` · `08-ending-2.webp` 셋입니다.
>
> 그려진 그림을 다 견주어 보니 **아이는 처음부터 끝까지 같은 아이**인데,
> 할머니·게으른 딸·새어머니는 장마다 딴사람이 됐습니다. 처음 지시문에
> 아이만 자세히 적고 나머지 셋은 한 줄로 적어 둔 탓입니다. 위에 그림 기준으로
> 못 박았으니, 아래 표의 「다시」 장은 위 설명을 그대로 붙여 다시 뽑으면 됩니다.
>
> | 파일 | 본 결과 |
> |---|---|
> | `01`~`03` 여섯 장 | 아이 · 새어머니 기준. 그대로 둡니다 |
> | `04-apples` `04-apples-2` `05-holle-2` | 아이 그대로. 그대로 둡니다 |
> | `05-holle` | **할머니 기준 그림.** 그대로 둡니다 |
> | `06-gold` | 아이는 맞음. **할머니가 딴사람** — 작고, 머릿수건, 남색 옷 → 다시 |
> | `06-gold-2` | **아이가 딴사람** — 붉은 곱슬머리, 파란 눈, 맨발 → 다시 |
> | `07-lazy` | 딸은 기준 그림인데 **리본만 파랑** → 분홍으로. **새어머니가 딴사람** — 쪽머리, 남색 원피스 → 다시 |
> | `07-lazy-2` | **딸이 딴사람** — 분홍 보닛에 세로 곱슬 → 다시 |
> | `08-ending` | **딸이 딴사람** — 빨간 양갈래에 리본 둘. **할머니도 딴사람** — 작고 머릿수건 → 다시 |
>
> 아이는 `01`~`05`가 다 같으니 그것을 보기로 삼으면 됩니다.

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: an old woman shaking a great feather quilt out of a window in the sky while snow falls onto a sunlit meadow below, a stone well in the foreground, magical and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 우물가의 물레

| 파일명 | 장면 |
|---|---|
| `images/01-well.webp` | A German farmyard where a plain-dressed girl sweeps, draws water and spins by a stone well while a frilly-dressed girl lounges yawning in the doorway, warm afternoon light. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 해도 뜨기 전에 우물가에서 물레 소리가 났습니다. 실을 잣는 아이가 있었지요. 한집에 딸이 둘인데 일은 늘 그 아이 차지였습니다. 하나는 아주머니가 낳은 딸이었지요. 다른 하나는 먼저 세상을 떠난 언니의 딸이었습니다. 두 아이를 대하는 마음이 아주 달랐지요. / 오른쪽: 제 딸은 하루 종일 놀아도 그만이었습니다. 남의 딸은 새벽부터 밤까지 일을 해야 했지요. 물을 긷고 밥을 짓고 마당을 쓸었습니다. 아침상을 물리기도 전에 다음 일이 기다렸지요. 그러고도 우물가에 앉아 실을 자아야 했지요. 손끝이 갈라져도 쉴 수가 없었습니다. 그래도 아이는 군소리 한 번 하지 않았지요.〕 |
| `images/01-well-2.webp` | A girl at a stone well watching her bloodied spindle slip from her fingers into dark water, then running pale-faced to a sharp-faced woman in a doorway, tense. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그날도 아이는 우물가에서 실을 잣고 있었습니다. 한참을 자으니 손끝이 아파 왔지요. 보니 물레가락에 피가 묻어 있었습니다. 빨간 점이 실에까지 배어 있었지요. 아이는 그것을 씻으려고 우물물에 담갔습니다. / 오른쪽: 물레가락이 우물 속으로 쏙 빠져 버렸습니다. 어떡해, 빠졌어! 아이는 우물 속을 들여다보며 발을 동동 굴렀습니다.〕 |

## 2장 · 우물 속으로

| 파일명 | 장면 |
|---|---|
| `images/02-fall.webp` | A sharp-faced woman scolding a girl at a farmhouse door, and the girl then standing on the rim of a dark stone well with her eyes shut, about to jump, dramatic. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 새어머니는 눈을 부라렸습니다. 떨어뜨렸으면 네가 건져 와야지! 찾아오지 않으면 집에 들어올 생각도 하지 마라. / 오른쪽: 아이는 한참 우물 속을 들여다보았습니다. 깊고 컴컴해서 바닥이 보이지 않았지요. 아무리 봐도 물레가락은 보이지 않았습니다. 아이는 눈을 꼭 감았습니다. 그러고는 우물 속으로 뛰어들었지요. 눈앞이 캄캄해졌습니다. 귓가에서 바람 소리가 윙 하고 났지요.〕 |
| `images/02-fall-2.webp` | A girl falling through a dark shaft into a brilliant sunlit meadow full of wildflowers, landing unhurt and getting up to walk, wondrous and bright. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 몸이 아래로 아래로 떨어졌습니다. 한참을 그렇게 떨어졌지요. 그런데 이상하게 무섭지가 않았습니다. / 오른쪽: 햇빛이 쏟아지는 넓은 들판이었습니다. 발밑에는 풀꽃이 가득 피어 있었지요. 어디에도 우물은 보이지 않았습니다. 하늘도 땅도 낯설었지요. 아이는 옷에 묻은 풀잎을 털고 일어났습니다. 그러고는 들판을 걷기 시작했지요. 어디로 가야 할지는 몰랐습니다. 나비가 앞장서듯 팔랑팔랑 날았지요.〕 |

## 3장 · 빵을 꺼내 주세요

| 파일명 | 장면 |
|---|---|
| `images/03-bread.webp` | A meadow with a stone bread oven whose door stands open, smoke curling out, a girl scooping golden loaves onto a paddle with reddened hands, homely and charming. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 한참을 걷는데 어디선가 목소리가 났습니다. 저를 꺼내 주세요! 다 타 버리겠어요! 아이는 걸음을 멈추고 두리번거렸지요. 길가에 빵 굽는 가마가 하나 있었습니다. 문틈으로 연기가 새어 나오고 있었지요. / 오른쪽: 가장자리가 벌써 거뭇해지고 있었지요. 아이는 얼른 주걱을 찾아 들었습니다. 그러고는 빵을 하나하나 꺼냈지요. 가마 안에서 뜨거운 김이 확 올라왔습니다. 뜨거워서 손이 발갛게 익었지만 멈추지 않았지요. 마지막 하나까지 다 꺼냈습니다.〕 |
| `images/03-bread-2.webp` | Golden loaves laid out neatly to cool beside a stone oven while a girl walks on down a sunlit meadow path, warm and satisfying. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 빵을 다 꺼내고 나자 목소리가 다시 났습니다. 고마워요. 하마터면 새까맣게 탈 뻔했어요. 아이는 빵을 가지런히 늘어놓았습니다. 손을 호호 불면서요. / 오른쪽: 그러고는 손을 툭툭 털고 다시 길을 걸었습니다. 뒤에서 고소한 냄새가 따라왔지요. 아이는 조금 기분이 좋아졌습니다. 남을 도우니 마음이 가벼웠지요. 낯선 곳인데도 무섭지가 않았지요. 들판에는 해가 따뜻하게 내리쬐었습니다. 바람에 풀 냄새가 실려 왔지요.〕 |

## 4장 · 사과나무 아래에서

| 파일명 | 장면 |
|---|---|
| `images/04-apples.webp` | A meadow apple tree bowed almost to the ground under its fruit, a girl hugging the trunk and shaking hard as apples rain down on her, bright and lively. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 조금 더 가니 사과나무가 서 있었습니다. 가지가 땅에 닿을 만큼 늘어져 있었지요. 저를 좀 흔들어 주세요. 열매가 너무 무거워서 가지가 부러지겠어요. 아이는 소리 나는 쪽을 올려다보았습니다. / 오른쪽: 그러고는 나무 앞으로 다가갔지요. 두 팔로 줄기를 안고 힘껏 흔들었지요. 사과가 우수수 떨어졌습니다. 머리에도 어깨에도 사과가 부딪혔지요. 아이는 나무가 가벼워질 때까지 흔들었습니다. 팔이 뻐근했지만 그만두지 않았지요. 머리에 나뭇잎이 잔뜩 앉았습니다.〕 |
| `images/04-apples-2.webp` | A girl stacking apples neatly in the grass under a relieved apple tree that lifts its branches, then walking on eating one, a cottage visible far off, satisfying. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아이는 떨어진 사과를 하나하나 주웠습니다. 풀밭에 가지런히 쌓아 놓았지요. 벌레 먹은 것은 따로 골라 두었습니다. 나무가 홀가분한 듯 가지를 폈지요. 잎사귀가 사르르 흔들렸습니다. 이제야 살 것 같네요! / 오른쪽: 고마워요. 조심해서 가세요. 아이는 사과 하나를 얻어 들고 다시 걸었습니다. 아삭아삭 씹으니 참 달았지요. 들판 저쪽에 작은 집이 보이기 시작했습니다. 굴뚝에서 연기가 오르고 있었지요. 아이는 그리로 걸음을 옮겼습니다.〕 |

## 5장 · 홀레 할머니의 집

| 파일명 | 장면 |
|---|---|
| `images/05-holle.webp` | A cottage doorway in a sky-meadow where a large kindly old woman with big teeth welcomes a startled girl, an enormous feather quilt over her arm, warm and magical. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이윽고 아이는 작은 집 앞에 이르렀습니다. 문가에 커다란 할머니가 서 있었지요. 아이가 인사를 하려고 고개를 들었습니다. 할머니는 아이보다 두 배는 커 보였지요. 그런데 할머니의 이가 어찌나 큰지 흠칫 물러섰지요. 할머니가 껄껄 웃었습니다. / 오른쪽: 무서운 얼굴이 아니었지요. 무서워하지 마라. 나는 홀레라고 한단다. 우리 집에서 일해 주지 않겠니?〕 |
| `images/05-holle-2.webp` | A cosy cottage interior with a laid table and a warm bed, and a girl shaking a giant feather quilt at a window as feathers become snow falling on a world far below, magical. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아이는 고개를 끄덕였습니다. 집 안은 깨끗하고 아늑했지요. 홀레 할머니는 밥을 넉넉히 차려 주었습니다. 따뜻한 잠자리도 내주었지요. 아이는 오랜만에 배불리 먹었습니다. 잠자리에 눕자마자 스르르 잠이 들었지요. 이튿날부터 아이는 이불을 털었습니다. / 오른쪽: 창가에서 이불을 힘껏 흔들었지요. 깃털이 눈송이처럼 흩날렸습니다. 아래 세상에는 그때마다 눈이 펑펑 내렸지요. 아이는 그것이 참 신기했습니다. 창밖으로 고개를 내밀고 한참을 내려다보았지요. 저 아래 지붕들이 하얗게 덮여 갔습니다.〕 |

## 6장 · 금빛 소나기

| 파일명 | 장면 |
|---|---|
| `images/06-gold.webp` | A girl sweeping and polishing cheerfully in a cosy sky-cottage, then standing quietly at a window with a wistful face, warm light, tender. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아이는 날마다 부지런히 일했습니다. 이불을 털고 집을 쓸고 그릇을 닦았지요. 홀레 할머니는 아이를 아주 마음에 들어 했습니다. 한 번도 나무라는 일이 없었지요. 오히려 잘한다고 칭찬해 주었습니다. 네 손끝이 참 야무지구나. / 오른쪽: 그런데 얼마 뒤 아이의 마음이 무거워졌습니다. 먹을 것도 넉넉하고 일도 할 만했지요. 그래도 자꾸 집 생각이 났습니다. 아이는 조심스레 입을 열었지요. 할머니, 드릴 말씀이 있어요.〕 |
| `images/06-gold-2.webp` | A great gateway where a girl steps through and a shower of gold pours over her coating her head to foot, then standing glittering beside the familiar farmyard well, joyful. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 홀레 할머니는 고개를 끄덕였습니다. 그럴 줄 알았다. 착하게 일했으니 상을 주마. / 오른쪽: 아이가 문을 지나는 순간이었습니다. 위에서 금빛 소나기가 쏟아졌지요. 금이 머리끝부터 발끝까지 붙었습니다. 잃어버린 물레가락도 여기 있단다. 아이는 온몸이 금빛으로 반짝이는 채로 우물가에 섰습니다. 눈에 익은 마당이었지요.〕 |

## 7장 · 나도 갈래

| 파일명 | 장면 |
|---|---|
| `images/07-lazy.webp` | A farmyard where a gold-covered girl amazes the household, and a frilly-dressed girl then pricking her own finger and hurling a spindle into the well, comic and pointed. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 금빛 아이를 보고 온 집이 뒤집혔습니다. 새어머니의 눈이 번쩍했지요. 아이가 있었던 일을 이야기했습니다. 새어머니는 제 딸을 돌아보았지요. 너도 어서 우물에 들어가 보아라! / 오른쪽: 게으른 딸은 우물가에 앉았습니다. 실을 잣기는 귀찮았지요. 물레는 손도 대지 않았습니다. 가시로 손끝을 찔러 피를 냈지요. 그것을 물레가락에 묻혀 우물에 던졌습니다. 그러고는 눈을 질끈 감고 저도 뛰어들었습니다. 금 받을 생각에 마음이 급했지요.〕 |
| `images/07-lazy-2.webp` | A frilly-dressed girl strolling past a smoking bread oven holding her nose and past a groaning apple tree with her chin in the air, both calling in vain, comic. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 들판에 내려선 딸도 빵 가마를 지났습니다. 저를 꺼내 주세요! 다 타 버리겠어요! 딸은 코를 막고 지나쳤지요. 가마에서 매캐한 냄새가 났습니다. / 오른쪽: 저를 좀 흔들어 주세요! 딸은 들은 척도 하지 않았지요. 팔 아프게 왜 내가 흔들어? 사과는 그대로 매달려 있었지요.〕 |

## 8장 · 문을 지나며

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | A frilly girl sleeping late and flicking a giant quilt half-heartedly while dishes pile up, an old woman watching quietly from the doorway, comic and pointed. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 홀레 할머니 집에서도 마찬가지였습니다. 첫날은 그래도 열심인 척했지요. 금을 받고 싶었으니까요. 그런데 이튿날부터 늦잠을 잤습니다. 이불도 몇 번 툭툭 치고 말았지요. 깃털이 몇 개 날리다 말았습니다. 이만하면 됐지, 뭐. / 오른쪽: 그릇은 쌓이고 방바닥에는 먼지가 앉았지요. 홀레 할머니는 아무 말도 하지 않았습니다. 딸은 낮에도 창가에 앉아 하품만 했습니다. 그저 며칠을 조용히 지켜보았지요. 그러고는 어느 날 딸을 문 앞으로 데려갔습니다. 딸은 드디어 올 것이 왔다며 좋아했지요.〕 |
| `images/08-ending-2.webp` | A great gateway where a girl steps through expecting gold but is drenched in black sticky pitch, standing dismayed by the farmyard well as a rooster crows, comic and pointed. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 딸은 신이 나서 문 앞에 섰습니다. 이제 금이 쏟아질 차례라고 생각했지요. 홀레 할머니가 조용히 말했습니다. 네가 일한 만큼 받아 가거라. / 오른쪽: 그런데 쏟아진 것은 금이 아니었습니다. 시커먼 송진이 머리 위로 주르륵 흘렀지요. 딸은 온몸이 새까맣게 되어 우물가에 섰습니다. 송진은 아무리 씻어도 지워지지 않았답니다. 집 앞 수탉이 그 꼴을 보고 크게 울었지요. 꼬끼오, 더러운 아이가 왔네!〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
