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
bold clean outlines, saturated storybook colors, warm firelight, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a small European woodcutter's cottage and surrounding
forest, very expressive comic faces, wide panoramic composition, funny and
good-natured.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
The woodcutter: a lovable young man with thick tousled brown hair (full hair, not bald), cute friendly round face, expressive eyebrows, orange linen shirt, teal vest, brown trousers, and boots. Very expressive comic acting.
His wife: a pretty young woman with a sweet round face, rosy cheeks, soft wavy auburn hair tied with a blue ribbon, wearing a lavender folk dress and clean white apron.
The forest spirit: a tiny, adorable leaf fairy figure with emerald leaves for hair and a warm magical golden/green glow.
The magic sausage: a plump, coiled, sizzling roasted link sausage with magical sparkling wisps.
The cottage cat: a cute chubby orange tabby cat.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a cosy cottage kitchen at evening where a startled couple stare at an enormous sausage floating in the air above their supper table, firelight glowing, comic and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 숲에서 만난 손님

| 파일명 | 장면 |
|---|---|
| `images/01-spirit.webp` | A one-room cottage at a forest edge and a burly woodcutter raising his axe before a great oak deep in the woods, shafts of green light, warm and rustic. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 나무꾼 부부의 집은 방 하나짜리 오두막이었습니다. 숲가에 겨우 지붕만 얹은 집이었지요. 가진 것은 거의 없었습니다. 그래도 두 사람은 사이가 좋았지요. 나무꾼은 아침마다 도끼를 메고 숲으로 갔습니다. 아내는 집에서 죽을 끓였지요. / 오른쪽: 그날도 나무꾼은 숲 깊이 들어갔습니다. 아주 커다란 참나무가 눈에 띄었지요. 저것이면 겨우내 땔감이 되겠구나. 나무꾼은 도끼를 번쩍 들었습니다.〕 |
| `images/01-spirit-2.webp` | A small glowing spirit with leafy hair appearing from behind a great oak while a startled woodcutter lowers his axe and steps back, gentle wonder. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 빛 속에 아주 작은 사람이 있었습니다. 머리카락이 나뭇잎 같았지요. 숲의 정령이었습니다. 정령이 손을 내밀며 말했지요. 그 나무는 내 집이라오. / 오른쪽: 그, 그러지요. 다른 나무를 베면 되니까요. 나무꾼은 한 걸음 물러섰지요. 가슴이 쿵쿵 뛰었습니다. 이런 것은 난생처음 보았으니까요.〕 |

## 2장 · 소원 세 가지

| 파일명 | 장면 |
|---|---|
| `images/02-wishes.webp` | A glowing forest spirit holding up three fingers before an astonished woodcutter, then vanishing leaving only shafts of light in the trees, magical. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 정령이 환하게 웃었습니다. 고맙소. 그 보답으로 소원 세 가지를 들어주겠소. / 오른쪽: 그렇소. 다만 세 번뿐이오. 잘 생각해서 쓰시오. 나무꾼이 다시 물으려는 참이었습니다.〕 |
| `images/02-wishes-2.webp` | A woodcutter abandoning his axe and sprinting home down a woodland path, then bursting through a cottage door as his wife drops her spoon, comic energy. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 나무꾼은 한참을 멍하니 서 있었습니다. 그러다 갑자기 정신이 들었지요. 세 가지라니! 이거 큰일 났네. / 오른쪽: 나뭇가지에 얼굴이 긁히는 줄도 몰랐습니다. 숨이 턱까지 차올랐지요. 오두막 문을 벌컥 열었습니다. 여보! 여보!〕 |

## 3장 · 저녁 밥상 앞에서

| 파일명 | 장면 |
|---|---|
| `images/03-table.webp` | A cottage kitchen where an excited wife in a headscarf paces and gestures while her husband waves his hands calmingly, firelight, lively and comic. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 나무꾼은 숨을 헐떡이며 이야기했습니다. 아내는 듣더니 손뼉을 쳤지요. 세상에! 이런 일이 다 있네요! 큰 집을 달랄까요? / 오른쪽: 금덩이를 들고 어디로 가겠소. 도둑이나 들지. 아내는 방 안을 이리저리 돌았습니다. 나무꾼이 손을 저었지요. 천천히 정합시다.〕 |
| `images/03-table-2.webp` | A cottage supper table with two thin bowls of gruel where a huge sausage suddenly drops onto a plate, the couple frozen mid-spoonful, very funny. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 밥상에는 묽은 죽 두 그릇이 놓였습니다. 늘 먹던 대로였지요. 두 사람은 마주 앉았습니다. 나무꾼이 숟가락을 들었지요. 죽은 오늘도 묽었습니다. 나무꾼이 무심코 중얼거렸지요. / 오른쪽: 아, 소시지 한 줄만 있으면 소원이 없겠구먼. 그 순간이었습니다. 펑 하는 소리가 났지요. 접시 위에 커다란 소시지가 툭 떨어졌습니다. 두 사람은 숟가락을 든 채 얼어붙었지요.〕 |

## 4장 · 아내의 불호령

| 파일명 | 장면 |
|---|---|
| `images/04-scold.webp` | A cottage kitchen where a red-faced wife leaps up jabbing her finger while her husband shrinks back, a huge sausage sitting innocently between them, riotous. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 먼저 정신을 차린 것은 아내였습니다. 얼굴이 순식간에 벌게졌지요. 세상에! 소원 하나를 소시지에 썼단 말이에요? / 오른쪽: 소시지를요? 소시지를! 나무꾼도 얼굴이 붉어졌지요. 그, 그건 실수였소.〕 |
| `images/04-scold-2.webp` | A cottage kitchen in full uproar with pots rattling and a cat fleeing out the door as a couple shout at each other over a sausage, hilariously comic. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 나무꾼도 지지 않았습니다. 그럼 당신은 뭐 하고 있었소! 옆에서 아무 말도 안 했잖소! / 오른쪽: 냄비가 달그락거렸지요. 고양이가 놀라 밖으로 도망쳤습니다. 아내는 계속 소시지 이야기를 했지요. 나무꾼은 귀가 아플 지경이었습니다. 얼굴이 점점 굳어 갔지요. 참는 데도 끝이 있었습니다. 나무꾼의 손이 부들부들 떨렸지요. 귓속에서 윙 소리가 났습니다.〕 |

## 5장 · 코에 붙은 소시지

| 파일명 | 장면 |
|---|---|
| `images/05-nose.webp` | A furious woodcutter shouting as a huge sausage leaps from the plate and sticks fast to his wife's nose, sudden silence in the kitchen, hysterically comic. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아내는 그래도 그치지 않았습니다. 소시지, 소시지, 소시지! 평생 소시지 이야기만 할 거예요! / 오른쪽: 차라리 당신 코에나 붙어 버려라! 말이 끝나기가 무섭게 일이 벌어졌지요. 소시지가 폴짝 날아올랐습니다. 그러고는 아내의 코끝에 딱 붙었지요. 방 안이 갑자기 조용해졌습니다. 두 사람 다 숨을 멈췄지요.〕 |
| `images/05-nose-2.webp` | A wife with a huge sausage stuck to her nose tugging with both hands while her husband pulls too, chairs toppling and bowls rolling, hysterically comic. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아내가 두 눈을 아래로 내리떴습니다. 코끝에 소시지가 대롱대롱 달려 있었지요. 아이고! 이게 무슨 꼴이에요! 아내는 두 손으로 소시지를 잡아당겼습니다. 하지만 꿈쩍도 하지 않았지요. / 오른쪽: 아내는 뒤로, 나무꾼은 앞으로 당겼습니다. 의자가 넘어지고 그릇이 굴렀지요. 그래도 소시지는 그대로였습니다. 오히려 코만 벌겋게 부었지요. 아내는 그만 울음을 터뜨렸습니다. 내 코, 내 코!〕 |

## 6장 · 아무리 해도

| 파일명 | 장면 |
|---|---|
| `images/06-try.webp` | A couple trying butter and cold water on a sausage stuck to a nose, the husband reaching for a knife and the wife shrieking, chaotic and funny. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 두 사람은 온갖 수를 다 써 보았습니다. 먼저 버터를 발라 보았지요. 미끄러워지면 빠질까 싶었거든요. 하지만 소용없었습니다. 다음에는 찬물을 끼얹어 보았지요. 그것도 소용이 없었습니다. / 오른쪽: 나무꾼이 칼을 가져오려 했지요. 그건 안 돼요! 코가 잘리면 어떡해요! 아내가 소리를 질렀습니다. 나무꾼은 칼을 도로 놓았지요.〕 |
| `images/06-try-2.webp` | An exhausted couple slumped on a cottage floor, the wife cradling the sausage on her nose and sniffling while the husband stares at the fire, quiet and tender. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 기진맥진해서 마루에 주저앉았습니다. 숨이 차서 말도 나오지 않았지요. 아내는 코를 감싸 쥐고 훌쩍였습니다. 이대로 어떻게 밖에 나가요. 장에도 못 가고 이웃도 못 만나잖아요. / 오른쪽: 다 제 입에서 나온 말이었으니까요. 방 안이 조용해졌습니다. 난롯불만 타닥타닥 소리를 냈지요. 창밖에서 바람이 훑고 지나갔습니다. 두 사람은 서로를 보지 못했지요. 한참 만에 나무꾼이 입을 열었습니다.〕 |

## 7장 · 마지막 한 가지

| 파일명 | 장면 |
|---|---|
| `images/07-last.webp` | A wife forcing a smile with a sausage on her nose while her husband gazes at her with a softening thoughtful expression, warm firelight, tender. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아내가 코를 감싼 채 고개를 들었습니다. 그러네요. 하나 남았네요. 그럼 큰 집을 달라고 해요. / 오른쪽: 나무꾼은 아내의 얼굴을 물끄러미 보았지요. 코끝에 소시지가 달린 얼굴이었습니다. 웃는데 눈가가 자꾸 젖었지요. 나무꾼은 목이 메었습니다. 평생 저러고 살 것을 생각하니 마음이 아팠지요. 큰 집이 다 무슨 소용인가 싶었습니다. 그건 안 되지.〕 |
| `images/07-last-2.webp` | A woodcutter shaking his head gently and standing up to speak a wish while his wife's eyes fill with tears, cosy firelit cottage, moving. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 금덩이가 있으면 뭐 하겠소. 당신이 그러고 사는데. 아내가 손뼉을 쳤지요. 손이 코끝에 걸려 멈칫했습니다. 아내는 얼른 손을 내렸지요. / 오른쪽: 나무꾼은 고개를 저었습니다. 집은 지금도 있지 않소. 당신 코는 하나뿐이고.〕 |

## 8장 · 다시 죽 한 그릇

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | A sausage dropping off a nose onto a plate as a wife joyfully feels her restored face, then pausing as she realises all the wishes are gone, comic and warm. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아내의 코를 원래대로 돌려주시오. 그 순간 소시지가 툭 떨어졌습니다. 접시 위로 데구루루 굴러갔지요. 아내는 얼른 코를 만져 보았습니다. 멀쩡한 제 코였지요. / 오른쪽: 거울을 들고 이리저리 비춰 봤지요. 내 코가 제일 예뻐요! 그러다 문득 멈춰 섰지요. 소원이 다 없어진 것이었습니다. 큰 집도 금덩이도 없었지요.〕 |
| `images/08-ending-2.webp` | A cottage table at night where a couple share a sausage cut in half over two bowls of gruel, both laughing with heads thrown back, deeply cosy and happy. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 집도 그대로였고 살림도 그대로였습니다. 밥상에는 묽은 죽 두 그릇뿐이었지요. 두 사람은 상 앞에 앉았습니다. 그런데 이상한 일이었지요. 밥상이 어쩐지 푸짐하게 느껴졌습니다. 접시에는 소시지가 그대로 있었으니까요. / 오른쪽: 아내가 그것을 반으로 잘랐습니다. 자, 반씩 먹어요. 두 사람은 소시지를 나누어 먹었지요. 먹다가 서로를 보고 웃음이 터졌습니다.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
