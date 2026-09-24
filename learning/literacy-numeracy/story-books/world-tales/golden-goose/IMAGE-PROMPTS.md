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
bold clean outlines, saturated storybook colors, warm village daylight, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a German forest, a village street, an inn and a castle
courtyard, very expressive comic faces, wide panoramic composition, funny and
never mean.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

> **머리 빛깔과 옷을 못 박아 두었습니다.** 옷차림만 적어 두면 그릴 때마다
> 딴사람이 됩니다. 다른 책에서 실제로 그런 일이 있었어요 — 공주가 한 장에서는
> 밤빛 곱슬머리, 다음 장에서는 노란 양갈래였지요.
> 아래 설명을 **한 글자도 빼지 말고** 매번 붙여 넣어 주세요.

```
Dummling: a cheerful youngest brother about 14 with tousled reddish-brown hair,
in a patched brown jerkin over a cream shirt and brown knee breeches, kind and
unbothered by teasing.
The two elder brothers: a tall proud one and a stout smug one, both in plainer
country clothes.
The little grey man: a small old man with a long white beard sitting on a stump.
The princess: a girl in a fine gown who never smiles.
Villagers who get stuck, in this order: the three innkeeper's daughters (blue,
yellow and red dresses), then the priest in black, then the baker in a white
apron and chef's hat, then two farmers. All comically flailing.
Everyone must look like the same person from picture to picture — same hair,
same clothes, same face.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a long comical line of people stuck one behind another — a young man carrying a golden goose at the front, then girls, a priest and a baker — all trailing down a village street, absurd and delightful. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 숲에 간 큰형

| 파일명 | 장면 |
|---|---|
| `images/01-eldest.webp` | A German cottage where a mother packs fine bread and wine for a tall proud son heading out with an axe while a patched-coat youngest brother watches, warm morning light. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 큰아들은 키가 크고 힘이 셌습니다. 둘째는 몸집이 좋고 말솜씨가 좋았지요. 한집에 아들이 셋이었습니다. 막내는 어느 쪽도 아니었지요. 식구들은 막내를 늘 얕보았습니다. / 오른쪽: 어느 날 큰아들이 나무를 하러 숲에 갔습니다. 어머니는 고소한 빵을 구워 주었지요. 단지에 포도주도 가득 담아 주었습니다. 힘든 일이니 든든히 먹어야지. 큰아들은 어깨를 으쓱하며 집을 나섰습니다. 숲에는 아침 햇살이 비껴들고 있었지요.〕 |
| `images/01-eldest-2.webp` | A forest clearing where a proud young man waves away a small bearded old man on a stump, then winces clutching his arm as his axe slips, comic consequence. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 큰아들이 도끼를 내려놓고 앉았습니다. 그때 작은 노인이 다가왔지요. 수염이 허리까지 내려온 노인이었습니다. 배가 몹시 고픕니다. / 오른쪽: 내 것도 모자란데 무슨 소리요. 노인은 아무 말 없이 돌아섰지요. 큰아들은 다시 도끼를 들었습니다. 그런데 첫 번째 내리치는 순간 손이 미끄러졌지요. 큰아들은 팔을 다치고 말았습니다.〕 |

## 2장 · 둘째도 마찬가지

| 파일명 | 장면 |
|---|---|
| `images/02-second.webp` | A forest path where a stout smug young man with bread and wine brushes past a small bearded old man sitting on a stump without looking, comic. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이튿날은 둘째 아들이 숲으로 갔습니다. 역시 좋은 빵과 포도주를 챙겨 갔지요. 형은 운이 나빴을 뿐이야. 둘째는 콧노래를 부르며 걸었습니다. 숲에 들어서자 나무 그늘이 시원했지요. / 오른쪽: 어제와 똑같은 자리에 앉아 있었지요. 배가 몹시 고픕니다. 조금만 나눠 주시겠습니까?〕 |
| `images/02-second-2.webp` | A young man hopping on one foot clutching his toes as a felled tree lies the wrong way, and then two brothers lying groaning in a cottage bed, comic. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 노인은 조용히 자리를 떴습니다. 둘째는 다시 도끼질을 시작했지요. 그런데 얼마 되지 않아 일이 났습니다. 베던 나무가 엉뚱한 쪽으로 넘어간 것이었지요. 둘째는 발등을 찧고 말았습니다. 아이고, 내 발! / 오른쪽: 둘째도 절뚝거리며 집으로 돌아왔습니다. 이제 방에는 두 형이 나란히 앓아누웠지요. 어머니는 한숨을 쉬었습니다. 이 일을 어쩌면 좋아. 방에서 앓는 소리가 번갈아 났지요. 장작은 하나도 남지 않았습니다.〕 |

## 3장 · 막내가 나서다

| 파일명 | 장면 |
|---|---|
| `images/03-share.webp` | A cottage where a mother hands a patched-coat youngest son a hard crust and sour beer while two brothers snigger from bed, and the son setting off cheerfully into a sunny forest. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 제가 나무를 하러 가겠어요. 형들이 이불 속에서 코웃음을 쳤습니다. 네가? 도끼나 들 줄 알아? / 오른쪽: 어머니는 딱딱하게 굳은 빵을 싸 주었습니다. 마실 것은 시어 버린 맥주뿐이었지요. 막내는 그것을 들고 기분 좋게 나섰습니다. 이거면 넉넉하지요. 숲에 도착하자 새들이 지저귀었습니다. 막내는 소매를 걷고 나무를 살폈지요.〕 |
| `images/03-share-2.webp` | A sunny forest clearing where a patched-coat young man spreads a cloth to share with a small bearded old man, the hard crust becoming a fine loaf and the beer becoming wine, magical. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 점심때가 되자 노인이 또 나타났습니다. 배가 몹시 고픕니다. 조금만 나눠 주시겠습니까? / 오른쪽: 그런데 딱딱하던 빵이 고운 빵으로 바뀌어 있었지요. 신 맥주는 향긋한 포도주가 되어 있었습니다. 막내는 눈을 동그랗게 떴지요. 노인은 빙그레 웃기만 했습니다. 두 사람은 나란히 앉아 배불리 먹었습니다. 이야기도 도란도란 나누었지요.〕 |

## 4장 · 금빛 깃털

| 파일명 | 장면 |
|---|---|
| `images/04-goose.webp` | An old man pointing to a gnarled tree while a young man swings his axe, the tree crashing down to reveal a hollow stump with something glittering inside, expectant. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 식사를 마친 노인이 자리에서 일어났습니다. 마음씨가 곱군요. 저 나무를 베어 보십시오. / 오른쪽: 한참 만에 나무가 우지끈 넘어갔지요. 밑동이 훤히 드러났습니다. 그런데 그 속이 텅 비어 있었지요. 안쪽에서 무언가가 반짝였습니다. 막내는 허리를 굽혀 들여다보았습니다. 손을 넣어 조심조심 더듬어 보았지요.〕 |
| `images/04-goose-2.webp` | A hollow stump revealing a goose with feathers of shining gold, a young man lifting it out in astonishment, then carrying it toward a village inn at dusk, magical. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 밑동 안에 거위 한 마리가 앉아 있었습니다. 깃털이 온통 금빛으로 빛났지요. 세상에, 이런 거위가 다 있나! 막내가 두 손으로 거위를 안아 올렸습니다. 거위는 얌전히 안겨 있었지요. 돌아보니 노인은 이미 사라지고 없었습니다. / 오른쪽: 막내는 거위를 안고 숲을 나섰지요. 해가 기울어 어둑해지고 있었습니다. 그날 밤은 주막에서 묵기로 했지요. 주막 앞에 이르자 사람들이 쳐다보았습니다. 금빛 거위가 어스름 속에서도 반짝였거든요.〕 |

## 5장 · 손이 붙어 버렸다

| 파일명 | 장면 |
|---|---|
| `images/05-stuck.webp` | An inn room at night where a girl tugs helplessly at a golden goose with her hand stuck fast while her sister grabs her arm and sticks too, hilariously comic. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 주막집에는 딸이 셋 있었습니다. 세 딸은 금빛 깃털을 보고 눈이 휘둥그레졌지요. 막내가 방으로 들어가 잠든 뒤였습니다. 큰딸이 살금살금 다가갔습니다. 딱 한 개만 뽑아 볼까? / 오른쪽: 그러자 손이 딱 붙어 버렸지요. 아무리 당겨도 떨어지지 않았습니다. 발로 벽을 밀며 힘을 썼지요. 그래도 손은 꿈쩍하지 않았습니다. 언니, 왜 그래?〕 |
| `images/05-stuck-2.webp` | Three sisters stuck one behind another to a golden goose flailing and shrieking all night, and in the morning being towed out the inn door by an oblivious young man, hilarious. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 셋째 딸까지 달려와 언니들을 잡았습니다. 결과는 뻔했지요. 셋이 줄줄이 매달리고 말았습니다. 이거 안 떨어져! 안 떨어진다니까! / 오른쪽: 이튿날 아침 막내가 눈을 떴습니다. 거위를 안고 방을 나섰지요. 뒤에 무엇이 딸려 오는지도 몰랐습니다. 세 자매는 종종걸음으로 끌려갔습니다. 치맛자락이 문지방에 걸렸지요. 셋은 우르르 넘어질 뻔했습니다. 저기요! 좀 서 봐요! 하지만 막내에게는 들리지 않았지요.〕 |

## 6장 · 줄줄이 따라온 사람들

| 파일명 | 장면 |
|---|---|
| `images/06-parade.webp` | A village street with an absurd chain of people stuck together — a young man with a golden goose, three girls, a priest and a baker — shuffling along while onlookers howl with laughter. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 막내는 거위를 안고 마을 길을 걸었습니다. 뒤에는 세 자매가 줄줄이 딸려 왔지요. 길가 사람들이 배를 잡고 웃었습니다. 그때 신부님이 그 광경을 보았지요. 얘들아, 그게 무슨 꼴이냐! / 오른쪽: 그러자 신부님도 그대로 붙어 버렸지요. 이, 이게 어찌 된 일이냐! 마침 지나가던 빵집 아저씨가 신부님을 잡아당겼습니다. 빵집 아저씨도 붙었지요.〕 |
| `images/06-parade-2.webp` | A long absurd human chain tripping over each other on a country road behind a cheerful young man carrying a golden goose, dust and flailing arms, riotously funny. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 밭에서 일하던 농부 둘도 달려왔습니다. 저 사람들 좀 떼어 줍시다! 두 사람도 그대로 붙고 말았지요. 이제 줄이 마을 길만큼 길어졌습니다. 앞에서 막내가 걸으면 뒤가 우르르 따라갔지요. / 오른쪽: 발 좀 맞춰요! 사람들은 서로 발이 엉켜 넘어졌습니다. 넘어져도 손은 떨어지지 않았지요. 막내는 거위만 안고 성큼성큼 걸었습니다. 뒤가 어떻게 되는지는 알지도 못했습니다. 거위만 품 안에서 꽥 하고 울었지요. 막내는 그 소리에 씩 웃었습니다.〕 |

## 7장 · 웃지 않는 공주

| 파일명 | 장면 |
|---|---|
| `images/07-princess.webp` | A castle hall where jesters and acrobats perform desperately before a solemn unsmiling princess while the king sighs on his throne, comic and a little sad. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그 무렵 어느 나라 임금님에게 큰 걱정이 있었습니다. 공주가 태어나서 한 번도 웃지 않았기 때문이지요. 임금님은 온갖 재주꾼을 불러들였습니다. 광대도 오고 곡예사도 왔지요. 그래도 공주는 눈썹 하나 움직이지 않았습니다. 임금님은 마침내 온 나라에 알렸습니다. / 오른쪽: 내 딸을 웃게 하는 사람에게 상을 내리겠다. 많은 사람이 성으로 몰려왔지요. 우스운 옷을 입고 재주를 부렸습니다. 하지만 공주의 얼굴은 그대로였지요. 임금님은 날마다 한숨을 쉬었습니다.〕 |
| `images/07-princess-2.webp` | A castle window where a solemn princess suddenly bursts into helpless laughter at the ridiculous human chain shuffling past below, courtiers astonished, joyous and bright. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그날 성 앞 큰길로 그 이상한 행렬이 지나갔습니다. 앞에서는 젊은이가 금빛 거위를 안고 걸었지요. 뒤에는 사람들이 줄줄이 매달려 있었습니다. 팔은 이쪽으로, 다리는 저쪽으로 뻗었지요. 누가 봐도 우스운 모습이었습니다. 마침 공주가 창가에 서 있었습니다. / 오른쪽: 공주는 그 행렬을 물끄러미 보았지요. 입가가 조금씩 씰룩거렸습니다. 그러더니 마침내 참지 못했지요. 푸하하하!〕 |

## 8장 · 손이 떨어지던 날

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | A castle courtyard where the stuck people spring apart in relief and stare at their hands, then everyone bursting into laughter, the princess laughing at the window, joyous. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 공주가 웃자 놀라운 일이 벌어졌습니다. 붙어 있던 손들이 툭툭 떨어진 것이었지요. 세 자매도 신부님도 자유가 되었습니다. 빵집 아저씨는 제 손을 들여다보았지요. 농부 둘은 서로 얼굴을 마주 보았습니다. 이게 대체 무슨 일이야? / 오른쪽: 사람들은 어리둥절해서 서로를 쳐다보았습니다. 그러다 하나둘 웃기 시작했지요. 길에 있던 사람들도 모두 따라 웃었습니다. 성 창가에서는 공주가 아직도 웃고 있었지요. 임금님은 그 소리를 듣고 달려 나왔습니다.〕 |
| `images/08-ending-2.webp` | A young man releasing a golden goose toward a sunlit forest as it spreads shining wings, the king and laughing princess watching from a courtyard, warm celebration. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 임금님이 막내를 불렀습니다. 자네가 내 딸을 웃게 했구나. 약속대로 상을 주겠네. 무엇을 바라는가? / 오른쪽: 제 것이 아니니까요. 임금님은 껄껄 웃으며 고개를 끄덕였습니다. 막내는 숲으로 가서 거위를 놓아주었지요. 거위는 날개를 펴고 날아갔습니다. 막내는 그 뒤로 성에서 잘 지냈답니다. 형들도 나중에는 막내를 달리 보게 되었지요.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
