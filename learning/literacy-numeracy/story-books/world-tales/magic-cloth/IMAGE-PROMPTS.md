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
bold clean outlines, saturated storybook colors, warm woodland and workshop
light, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a German village, a carpenter's shop, a
mill, a forest inn and a family cottage, expressive comic faces, wide panoramic
composition, funny and good-natured.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
The three brothers: the eldest a broad carpenter with sawdust in his hair, the
second a wiry miller dusted with flour, the youngest a small quick lad with a
turner's apron. Their father: an old tailor with spectacles and a tape measure.
The innkeeper: a plump smiling man with restless eyes and a fine waistcoat.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a white cloth spread on a forest floor laden with steaming dishes, a donkey standing behind it, and a wooden cudgel leaning against a tree, dappled green light through leaves, warm and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 집을 나선 삼형제

| 파일명 | 장면 |
|---|---|
| `images/01-leaving.webp` | A poor cottage where an old spectacled tailor with a tape measure speaks earnestly to his three sons, a single goat in the yard, morning light, warm and sober. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 늙은 재봉사가 안경을 밀어 올렸습니다. 실이 자꾸 바늘귀를 비껴갔거든요. 목에는 줄자가 걸려 있었습니다. 그에게는 아들이 셋 있었지요. 집에는 염소 한 마리가 전부였지요. 그 젖으로 온 식구가 먹고살았습니다. / 오른쪽: 어느 날 아버지가 아들들을 불렀습니다. 이대로는 다 굶겠구나. 이제 저마다 기술을 배워 오너라.〕 |
| `images/01-leaving-2.webp` | A village crossroads where three young brothers with bundles embrace and then set off in three different directions while an old tailor waves from a cottage door, hopeful. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 마을 어귀에 세 갈래 길이 있었습니다. 큰아들은 목수에게 가기로 했지요. 둘째는 방앗간으로 가기로 했습니다. 막내는 나무 깎는 일을 배우기로 했지요. 아버지가 문가에서 손을 흔들었습니다. 몇 해 뒤에 다시 모이자꾸나. / 오른쪽: 부디 몸조심하고. 세 형제는 서로를 한 번씩 안았지요. 그러고는 각자 다른 길로 걸어갔습니다. 뒤를 돌아보니 아버지가 아직 서 있었지요. 그렇게 몇 해가 흘렀습니다. 세 형제는 저마다 일을 배웠지요.〕 |

## 2장 · 큰아들의 식탁보

| 파일명 | 장면 |
|---|---|
| `images/02-cloth.webp` | A carpenter's workshop where a master hands a plain white cloth to a broad young man with sawdust in his hair, tools and shavings around, warm light. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 큰아들은 목수 일을 잘 배웠습니다. 어깨가 넓어지고 손이 두꺼워졌지요. 머리에는 늘 톱밥이 앉아 있었습니다. 어느 날 스승이 큰아들을 불렀지요. 이제 집으로 돌아가도 되겠다. / 오른쪽: 보기에는 아주 평범한 천이었지요. 이걸 어디에 씁니까? 펼쳐 놓고 이렇게 말해 보아라.〕 |
| `images/02-cloth-2.webp` | A forest clearing where a broad young man spreads a white cloth on the grass and steaming dishes, bread and wine appear on it out of nowhere, dappled sunlight, delighted. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 숲길을 걷다 배가 고파졌습니다. 큰아들은 문득 그 말이 떠올랐지요. 식탁보를 풀밭에 펼쳤습니다. 펼치고 차려라! / 오른쪽: 고기도 있고 빵도 있었지요. 포도주까지 한 병 놓여 있었습니다. 큰아들은 눈이 휘둥그레졌지요. 고기에서 김이 모락모락 올랐습니다. 큰아들은 손도 안 씻고 달려들었지요. 이걸 가져가면 아버지가 얼마나 기뻐하실까!〕 |

## 3장 · 주막에서 생긴 일

| 파일명 | 장면 |
|---|---|
| `images/03-inn.webp` | An inn common room in uproar as a white cloth on a table fills with steaming dishes, guests gaping and a plump innkeeper staring with gleaming eyes, comic. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 해가 지자 큰아들은 주막에 들었습니다. 주인은 배가 나오고 웃음이 헤픈 사람이었지요. 손님들이 저녁을 시켰습니다. 그런데 큰아들만 아무것도 시키지 않았지요. 저는 제 것이 있습니다. / 오른쪽: 펼치고 차려라! 음식이 상 위에 그득 차려졌지요. 주막이 발칵 뒤집혔습니다. 주인의 눈이 반짝반짝 빛났지요. 참으로 놀라운 물건이올시다.〕 |
| `images/03-inn-2.webp` | A candlelit inn room where an innkeeper swaps a folded cloth for an identical one beside a sleeping man, then a cottage yard where the cloth lies flat and empty, comic dismay. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 주인은 그날 밤 잠을 자지 않았습니다. 창고를 뒤져 비슷한 천을 찾아냈지요. 색도 크기도 꼭 같았습니다. 주인은 살금살금 방으로 들어갔지요. 큰아들은 곤히 자고 있었습니다. 주인은 식탁보를 슬쩍 바꿔치기했지요. 이튿날 큰아들은 아무것도 모른 채 떠났습니다. / 오른쪽: 집에 닿자 온 식구가 마당으로 나왔지요. 큰아들은 자랑스럽게 천을 펼쳤습니다. 펼치고 차려라! 그런데 아무 일도 일어나지 않았지요. 큰아들은 천을 몇 번이나 다시 접었다 폈습니다.〕 |

## 4장 · 둘째의 당나귀

| 파일명 | 장면 |
|---|---|
| `images/04-donkey.webp` | A mill yard where a miller hands a donkey's halter to a flour-dusted young man, and gold coins pouring from the donkey's mouth onto a spread cloth, astonishing. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이듬해에는 둘째가 집으로 향했습니다. 온몸에 밀가루가 뽀얗게 묻어 있었지요. 방앗간 주인이 헤어질 때 말했습니다. 자네에게 줄 것이 있네. 주인은 당나귀 한 마리를 끌고 나왔지요. 보기에는 흔한 당나귀였습니다. / 오른쪽: 보자기를 밑에 깔고 말해 보게. 브리클레브리트, 하고 말이야. 둘째는 고개를 갸웃했습니다. 그래도 시키는 대로 해 보았지요.〕 |
| `images/04-donkey-2.webp` | A young man showing off gold coins from a donkey in an inn yard while the innkeeper watches greedily, then a stable at night with donkeys being switched, comic. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 둘째는 신이 나서 당나귀를 몰았습니다. 해가 지자 그 주막에 들었지요. 주인이 반갑게 맞았습니다. 먼 길 오시느라 고생하셨겠소. / 오른쪽: 그러고는 마당에서 금화를 쏟아 보였습니다. 주인은 눈이 뒤집혔지요. 그날 밤 마구간에서 당나귀가 바뀌었습니다. 이튿날 둘째도 빈손으로 집에 닿았지요. 아버지는 한숨만 쉬었습니다.〕 |

## 5장 · 막내의 자루

| 파일명 | 장면 |
|---|---|
| `images/05-sack.webp` | A woodturner's workshop where an old master hands a worn sack to a small quick lad, wood shavings curling on the floor, warm and secretive. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 한편 막내는 나무 깎는 일을 배웠습니다. 형들 소식은 편지로 들었지요. 막내는 곰곰이 생각했습니다. 두 번 다 그 주막이란 말이지. 무언가 짚이는 것이 있었지요. 막내는 나무를 깎으며 생각을 굴렸습니다. 대팻밥이 발밑에 소복이 쌓였지요. / 오른쪽: 이윽고 돌아갈 날이 되었습니다. 스승이 낡은 자루 하나를 내주었지요. 이 안에 몽둥이가 들어 있단다. 누가 네 것을 빼앗으려 하거든 말이다.〕 |
| `images/05-sack-2.webp` | A small quick lad shouldering a worn sack with a knowing grin and walking to a forest inn at sunset where a plump innkeeper greets him warmly, comic. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 막내는 자루를 어깨에 멨습니다. 그러고는 빙그레 웃었지요. 마침 잘됐구나. 막내는 형들이 묵었던 그 주막으로 향했습니다. 일부러 그 길을 골랐지요. / 오른쪽: 주인이 여느 때처럼 반갑게 맞았지요. 어서 오시오. 방이 넉넉하외다. 주인의 눈이 자루로 먼저 갔지요. 막내는 못 본 척했습니다.〕 |

## 6장 · 자루 속의 몽둥이

| 파일명 | 장면 |
|---|---|
| `images/06-cudgel.webp` | An inn table where a lad boasts about his sack while the innkeeper leans in with restless eyes, then the innkeeper creeping into a dark room at midnight, comic tension. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 막내는 저녁을 먹으며 일부러 큰소리를 쳤습니다. 이 자루 말입니까? 세상에서 제일 귀한 게 들었지요. / 오른쪽: 그건 말씀드릴 수 없습니다. 막내는 자루를 툭툭 두드리고 방으로 갔지요. 주인은 그날 밤을 뜬눈으로 기다렸습니다. 자정이 넘자 살금살금 방으로 들어갔지요. 막내는 코를 골고 있었습니다.〕 |
| `images/06-cudgel-2.webp` | A dark inn room where a wooden cudgel leaps from a sack and chases a howling innkeeper around toppling furniture while a grinning lad sits up in bed, hilarious. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 주인이 자루로 손을 뻗었습니다. 바로 그 순간이었지요. 막내가 벌떡 일어나 외쳤습니다. 몽둥아, 자루에서 나와라! 자루가 벌렁 열렸지요. 몽둥이가 튀어나왔습니다. 그러고는 주인의 등을 톡톡 두드렸지요. / 오른쪽: 주인이 방 안을 빙빙 돌며 달아났습니다. 의자가 넘어지고 그릇이 굴렀지요. 몽둥이는 끈질기게 따라다녔습니다. 주인은 살려 달라고 소리쳤지요. 제가 다 잘못했습니다!〕 |

## 7장 · 집으로 가는 길

| 파일명 | 장면 |
|---|---|
| `images/07-return.webp` | An inn yard at night where a cudgel chases an innkeeper who surrenders, guests watching from windows, then the innkeeper opening a storeroom, comic relief. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 주인은 마당까지 쫓겨 나갔습니다. 손님들이 창문으로 내다보았지요. 잘못했소! 다 돌려주겠소! 창고에 다 있소이다! / 오른쪽: 몽둥이가 쏙 들어갔지요. 주인은 숨을 헐떡이며 주저앉았습니다. 그러고는 창고 문을 열었지요. 안에 식탁보가 개켜져 있었습니다. 한쪽에는 그 당나귀도 매여 있었지요. 형들의 물건이 그대로였습니다.〕 |
| `images/07-return-2.webp` | A lad leading a donkey out of an inn gate at dawn with a cloth in his coat and a sack on his shoulder while the innkeeper bows repeatedly, comic and warm. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 막내는 두 가지를 모두 챙겼습니다. 식탁보는 품에 넣었지요. 당나귀는 고삐를 잡았습니다. 자루는 여전히 어깨에 메고 있었지요. 이건 형들에게 보여 줄 선물이지. / 오른쪽: 이튿날 아침 막내는 길을 나섰습니다. 주인은 문밖까지 나와 고개를 숙였지요. 다시는 그런 짓 하지 않겠소. 그러시는 게 좋겠습니다.〕 |

## 8장 · 한 상 가득

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | A cottage yard where a lad arrives leading a donkey, his brothers rushing out amazed, then a white cloth spread on the ground heaped with food, joyous. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 막내가 마을에 들어섰습니다. 당나귀를 끌고 오는 모습이 멀리서도 보였지요. 온 식구가 마당으로 뛰어나왔습니다. 두 형도 달려 나왔지요. 그건 우리 당나귀 아니냐! / 오른쪽: 이것도 찾아왔지요. 두 형은 헛기침만 했습니다. 막내는 마당 한가운데 식탁보를 펼쳤지요. 아버지가 지팡이를 짚고 나왔습니다. 온 식구가 빙 둘러섰지요.〕 |
| `images/08-ending-2.webp` | A cottage yard packed with villagers feasting around a laden white cloth, a donkey shedding gold, an old tailor holding his sons' hands, lanterns and joy. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 당나귀도 옆에서 금화를 쏟아 놓았습니다. 마당이 온통 반짝였지요. 늙은 재봉사는 눈물을 훔쳤습니다. 아들들의 손을 하나씩 잡았지요. 다들 잘 배워 왔구나. / 오른쪽: 누구든 배불리 먹었지요. 아이들은 마당에서 뛰어놀았습니다. 밤늦도록 웃음소리가 끊이지 않았지요. 자루는 처마 밑에 얌전히 걸어 두었습니다. 다시 쓸 일은 없었답니다. 세 형제는 오래오래 넉넉하게 살았지요.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
