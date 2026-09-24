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
bold clean outlines, saturated storybook colors, warm candlelight and stormy blue
night, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a small tidy castle, a rainy gate, a
towering bed and a breakfast hall, very expressive comic faces, wide panoramic
composition, funny and warm.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
The prince: an earnest young man with short brown hair and blue eyes, in a
blue coat with gold trim and a white cravat, weary from travelling.
The old queen: a small brisk woman in a purple gown and a gold coronet over
grey hair, with very sharp eyes.
The old king: a slim old man with a GREY moustache and NO beard, thinning grey
hair under a small gold crown. In the storm he is in a white nightgown holding
a candle; by day he wears a red robe. He is never a brown-bearded man — keep
the grey moustache and the clean chin in every picture.
The princess: a girl about 16 with wavy golden-blonde hair falling to her
shoulders and blue eyes, polite and tired. On the night she arrives she is
soaked, in a dripping travelling cloak with water running out of her shoes;
in bed she is in a white nightgown; by day she is in a pink gown. Her hair
colour and length stay the same in every picture.
Everyone must look like the same person from picture to picture.
```

> **요와 이불은 마흔 장입니다.** 그림에서는 여덟 장쯤으로 그려져 침대가
> 낮아 보였어요. 방문보다 높아 사다리를 대야 올라갈 만큼 **탑처럼 쌓아**
> 주세요. 사다리도 함께 그려 주시고요.

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: an absurdly tall stack of twenty mattresses and twenty featherbeds towering in a candlelit bedchamber with a tiny ladder leaning against it and a single green pea on the floor beneath, whimsical and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 진짜 공주를 찾아서

| 파일명 | 장면 |
|---|---|
| `images/01-prince.webp` | A wide panorama of travel — ships, mountains, foreign palaces — with a young man in a blue coat journeying from one to the next, hopeful and adventurous. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 옛날 어느 작은 나라에 왕자가 있었습니다. 어느새 결혼할 나이가 되었지요. 임금님과 왕비님은 신붓감을 알아보았습니다. 그런데 왕자에게는 한 가지 바람이 있었지요. 저는 진짜 공주와 결혼하고 싶습니다. / 오른쪽: 왕자는 신붓감을 찾으러 길을 떠났습니다. 배를 타고 바다를 건너기도 했지요. 산을 넘어 먼 나라까지 갔습니다. 공주라는 사람은 어디에나 있었지요. 큰 나라에도 있고 작은 나라에도 있었습니다. 왕자는 그때마다 기대를 걸었지요.〕 |
| `images/01-prince-2.webp` | A weary young man in a worn blue coat sitting by a castle window sighing, his travelling boots worn through, dark clouds gathering outside, melancholy. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그런데 만나 보면 늘 어딘가 미심쩍었습니다. 어떤 공주는 걸음걸이가 이상했지요. 어떤 공주는 말투가 공주 같지 않았습니다. 어떤 공주는 아예 공주가 아니었지요. 왕자는 하나하나 고개를 저었습니다. 그렇게 몇 해가 흘렀습니다. / 오른쪽: 왕자는 결국 빈손으로 집에 돌아왔지요. 옷은 해지고 신은 다 닳았습니다. 왕자는 창가에 앉아 한숨을 쉬었지요. 진짜 공주는 정말 없는 걸까. 그날따라 하늘이 잔뜩 흐렸습니다. 바람도 심상치 않았지요.〕 |

## 2장 · 폭풍우 치는 밤

| 파일명 | 장면 |
|---|---|
| `images/02-storm.webp` | A small castle in a lashing thunderstorm, lightning splitting the sky, an old king in a nightgown carrying a candle to the great gate, dramatic and funny. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그날 밤 무서운 폭풍우가 몰아쳤습니다. 번개가 하늘을 쩍쩍 갈랐지요. 비가 양동이로 붓듯 쏟아졌습니다. 바람에 창문이 덜컹거렸지요. 성 안 사람들은 모두 잠자리에 들었습니다. 등불도 하나둘 꺼졌지요. / 오른쪽: 그때 성문에서 쿵쿵 소리가 났습니다. 천둥소리에 섞여 잘 들리지도 않았지요. 늙은 임금님이 촛불을 들고 나갔습니다. 이 밤중에 누구시오? 무거운 성문이 삐걱 열렸지요. 빗줄기가 안으로 들이쳤습니다.〕 |
| `images/02-storm-2.webp` | A castle gate where an old king holds up a candle to a soaked girl standing in pouring rain, water streaming from her cloak and shoes, comic and pitiable. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 문밖에는 웬 아가씨가 서 있었습니다. 머리에서 발끝까지 물이 뚝뚝 떨어졌지요. 머리카락이 얼굴에 착 달라붙어 있었습니다. 신발에서는 물이 줄줄 흘러나왔지요. 옷자락에서도 빗물이 뚝뚝 떨어졌습니다. 아가씨는 떨리는 목소리로 말했습니다. / 오른쪽: 저는 공주입니다. 하룻밤만 재워 주세요. 임금님은 눈이 휘둥그레졌지요.〕 |

## 3장 · 정말 공주일까

| 파일명 | 장면 |
|---|---|
| `images/03-doubt.webp` | A castle entrance hall where a dripping girl stands in a spreading puddle while servants run for towels and a young prince stares at her, warm candlelight. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아가씨가 현관에 들어섰습니다. 발밑에 금세 물웅덩이가 생겼지요. 몰골이 말이 아니었습니다. 옷에서는 물이 계속 흘러내렸지요. 하인들이 수건을 가지러 뛰어갔습니다. / 오른쪽: 그러고는 아가씨에게서 눈을 떼지 못했지요. 젖은 몰골인데도 어딘가 남달랐거든요. 왕자의 가슴이 두근거렸습니다. 혹시 이번에는…… 왕자는 어머니를 돌아보았습니다. 어서 잠자리를 마련해 드리자고 말하려던 참이었지요.〕 |
| `images/03-doubt-2.webp` | A sharp-eyed old queen in a lace cap looking a dripping girl up and down with folded arms while smiling politely, then heading upstairs alone, comic. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 왕비는 팔짱을 낀 채 바라보기만 했습니다. 눈이 아주 매서웠지요. 저 꼴을 하고 공주라니. 어디 두고 보자. / 오른쪽: 먼 길 오시느라 고생하셨겠어요. 잠자리는 제가 손수 보아 드리지요. 그러고는 아무 말 없이 손님방으로 올라갔습니다. 무언가 생각이 있는 얼굴이었지요. 왕자는 어머니의 뒷모습을 갸웃하며 보았습니다.〕 |

## 4장 · 왕비의 꾀

| 파일명 | 장면 |
|---|---|
| `images/04-pea.webp` | A bedchamber where a small brisk queen strips a bed to the bare boards and places a single green pea in the middle, candlelight, secretive and funny. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 왕비는 손님방으로 들어갔습니다. 문을 꼭 닫고 소매를 걷었지요. 침대 위의 이불과 요를 몽땅 걷어 냈습니다. 나무 바닥만 남을 때까지 치웠지요. 그러고는 주머니에서 무언가를 꺼냈습니다. / 오른쪽: 아주 작고 동그란 콩이었지요. 왕비는 그것을 침대 한가운데에 놓았습니다. 진짜 공주라면 이걸 느낄 테지. 그러고는 하인들을 불렀지요.〕 |
| `images/04-pea-2.webp` | A bedchamber with twenty mattresses and twenty featherbeds stacked to the ceiling above a single pea, a ladder leaning against it, servants gaping, absurd and delightful. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 하인들이 요를 스무 장 날라 왔습니다. 완두콩 위에 한 장씩 차곡차곡 깔았지요. 그다음에는 오리털 이불을 가져오게 했습니다. 그것도 스무 장이었지요. 요 위에 이불을 다시 스무 장 얹었습니다. 침대는 천장에 닿을 듯 높아졌습니다. 방문보다도 훨씬 높았지요. / 오른쪽: 올라가려면 사다리가 있어야 했습니다. 하인들은 서로 얼굴을 마주 보았지요. 왕비는 아주 만족한 얼굴이었습니다. 저길 어떻게 올라가시라고. 사다리가 삐거덕거렸지요.〕 |

## 5장 · 잠 못 이루는 밤

| 파일명 | 장면 |
|---|---|
| `images/05-sleepless.webp` | A girl climbing a tall ladder to the top of a towering stack of bedding, then tossing and turning up there under moonlight, comic and cosy. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아가씨가 방으로 안내되었습니다. 침대를 보고 눈이 둥그레졌지요. 그래도 아무 말도 하지 않았습니다. 사다리를 타고 꼭대기까지 올라갔지요. 왕비가 상냥하게 문을 닫았습니다. / 오른쪽: 아가씨는 이불 속에 몸을 뉘었습니다. 온몸이 노곤했지요. 그런데 도무지 잠이 오지 않았습니다. 등 밑에 뭔가 딱딱한 것이 배겼거든요. 이리 뒤척 저리 뒤척 몸을 돌렸습니다. 어느 쪽으로 누워도 마찬가지였지요.〕 |
| `images/05-sleepless-2.webp` | A sleepless girl sitting up on top of a mountain of bedding lifting the quilts to look, rain on the dark window, and dawn light later, comic and weary. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아가씨는 자리에서 일어나 앉았습니다. 이불을 들춰 보기도 했지요. 하지만 아무것도 보이지 않았습니다. 다시 누워도 그 자리가 배겼지요. 창밖에서는 아직 비가 내렸습니다. 밤은 어찌나 긴지 끝이 없었지요. / 오른쪽: 아가씨는 눈을 감았다 떴다 했습니다. 몸 여기저기가 쑤셔 왔지요. 결국 한숨도 자지 못했습니다. 창밖이 뿌옇게 밝아 올 무렵이었지요. 아가씨는 겨우 사다리를 타고 내려왔습니다. 다리가 후들거렸지요.〕 |

## 6장 · 아침 인사

| 파일명 | 장면 |
|---|---|
| `images/06-morning.webp` | A sunny breakfast hall where a very tired girl politely explains her sleepless night while the old king and queen exchange a knowing glance, warm and funny. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아침 밥상이 차려졌습니다. 왕자도 임금님도 자리에 앉았지요. 아가씨가 눈을 비비며 들어왔습니다. 얼굴이 몹시 피곤해 보였지요. 왕비가 다정하게 물었습니다. / 오른쪽: 아가씨는 잠시 망설였습니다. 거짓말을 하기가 싫었지요. 사실은 한숨도 못 잤어요. 침대에 뭔가 딱딱한 게 있었나 봐요.〕 |
| `images/06-morning-2.webp` | A breakfast table where a prince apologises earnestly and a girl waves it off, while the old queen quietly leaves and returns with her hand closed, warm and expectant. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 왕자는 숟가락을 놓았습니다. 그렇게 잠자리가 불편하셨습니까? 미안합니다. 저희 잘못입니다. / 오른쪽: 왕비는 조용히 자리에서 일어났습니다. 그러고는 방을 나갔지요. 모두 어리둥절해서 그 뒷모습을 보았습니다. 발소리가 복도 저쪽으로 멀어졌지요. 밥상 앞이 조용해졌습니다. 잠시 뒤 왕비가 다시 들어왔지요. 손을 꼭 쥔 채였습니다. 얼굴에는 웃음이 번져 있었지요.〕 |

## 7장 · 스무 장 아래

| 파일명 | 장면 |
|---|---|
| `images/07-reveal.webp` | A breakfast hall where an old queen holds out one small green pea on her open palm and everyone leans in astonished, bright and joyful. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 왕비가 밥상 앞에 섰습니다. 저 침대 밑에 무엇이 있었는지 아십니까? 모두 고개를 저었지요. 왕비는 천천히 손바닥을 폈습니다. 그 위에 작고 동그란 것이 놓여 있었지요. / 오른쪽: 그 위에 요를 스무 장 깔았습니다. 그 위에 이불을 또 스무 장 얹었고요. 사람들이 저마다 웅성거렸습니다. 아가씨도 눈이 동그래졌지요.〕 |
| `images/07-reveal-2.webp` | A prince beaming and proposing across a breakfast table to a blushing girl while the old king claps and the queen smiles knowingly, radiant and warm. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 왕비가 아들을 돌아보았습니다. 요 스무 장, 이불 스무 장 아래였다. 그런데도 이걸 느낀 것이지. / 오른쪽: 그토록 찾아 헤매던 사람이 눈앞에 있었으니까요. 저와 결혼해 주시겠습니까? 왕자의 목소리가 조금 떨렸지요. 방 안이 쥐 죽은 듯 조용해졌습니다. 공주는 얼굴이 발그레해졌지요.〕 |

## 8장 · 그 콩은 지금

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | A wedding feast filling a castle hall with banners, dancing and music, the prince and princess at the centre, joyous and bright. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그날로 두 사람의 혼인이 정해졌습니다. 온 나라에 소식이 퍼졌지요. 성에서는 사흘 동안 잔치가 이어졌습니다. 거리에서는 사람들이 춤을 추었지요. 왕자는 이제 한숨을 쉬지 않았습니다. 공주도 그날 밤에는 푹 잤지요. 이제야 살 것 같아요. / 오른쪽: 공주는 베개에 얼굴을 묻었습니다. 이번에는 요가 딱 한 장뿐이었거든요. 왕비는 며느리를 아주 아꼈습니다. 두 사람은 사이좋게 지냈지요. 그런데 그 완두콩은 어떻게 되었을까요? 버리지 않고 잘 두었답니다. 그냥 두기에는 너무 귀한 콩이었으니까요.〕 |
| `images/08-ending-2.webp` | A quiet museum room where a single pea rests under a glass dome on a small pedestal while visitors and children press close to look, charming and witty. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 완두콩은 유리 상자에 담겼습니다. 그러고는 박물관에 놓였지요. 작은 받침대 위에 얌전히 얹혀 있었습니다. 사람들이 그 앞으로 몰려들었지요. 이게 그 유명한 완두콩이래. / 오른쪽: 유리에 뿌옇게 김이 서렸지요. 지키는 사람이 손수건으로 자꾸 닦았습니다. 아이들은 유리에 코를 대고 들여다보았습니다. 누가 가져가지만 않았다면요. 완두콩은 지금도 그 자리에 있을 것입니다. 사람들은 지금도 그 앞에서 걸음을 멈춘답니다.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
