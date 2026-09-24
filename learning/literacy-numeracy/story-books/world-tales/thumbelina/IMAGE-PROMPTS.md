# 제미나이 그림 프롬프트

이 책은 하나의 이야기를 8개의 장(챕터)으로 나눠 담았고, 펼침면은 모두
16개예요. 펼침면 하나에 그림이 한 장씩 들어갑니다.
그림이 펼침면 전체 폭을 가득 채우고, 그 아래에 이야기가 왼쪽·오른쪽으로 나뉘어 들어갑니다.

아래 프롬프트를 제미나이에 그대로 넣어서 생성한 뒤, 파일명을 정확히 맞춰서
`images/` 폴더에 저장하면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보여요.)

> **⚠️ 다시 그려 주실 것 (2026-08-28 점검)**
> - `06-swallow` — 두더지가 **컴컴한 굴을 보여 주다가 바닥에 쓰러진 제비에 발이 걸리는** 장면으로. 지금은 이미 건초를 덮어 주는 다음 장면입니다.
> - `07-flight` — 혼인 날짜가 정해져 **엄지 공주가 땅속을 내려다보며 시무룩한** 장면으로. 지금은 이미 제비가 데리러 온 다음 장면입니다.

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
bold clean outlines, saturated storybook colors, luminous garden light seen from
a tiny viewpoint, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a cottage windowsill, a lily
pad and stream, a summer meadow with giant flowers, a field mouse's burrow and a
sunlit land of flower people, expressive faces, wide panoramic composition,
delicate and never frightening.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Thumbelina: a girl the size of a thumb with fair hair and a dress made from a
petal. The lonely woman: a kind older woman in an apron at a cottage window. The
toad: a large warty green toad in a bonnet, comic rather than horrid. Her son:
a slack-jawed young toad. The fish: silvery minnows with bright eyes. The
swallow: a sleek dark bird with a white throat. The field mouse: a stout spectacled
mouse in a shawl. The mole: a plump velvet-black mole in dark glasses. The flower
prince: a small crowned figure with dragonfly wings.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a girl no bigger than a thumb standing inside an open tulip blossom, dew drops the size of her head glittering on the petals, a vast green garden towering around her, delicate and enchanting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 꽃 속에서 태어난 아이

| 파일명 | 장면 |
|---|---|
| `images/01-flower.webp` | A cottage windowsill where a kind older woman plants a barley seed in a pot, and the next day a great tulip-like bud opening as she kisses it, sunlight through the panes, magical and warm. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아이가 없는 부인이 있었습니다. 넓은 집에서 늘 외롭게 지냈지요. 빈 요람이 방 한구석에 그대로 놓여 있었습니다. 어느 날 부인은 마법사를 찾아갔지요. 아주 작아도 좋아요. / 오른쪽: 마법사는 말없이 보리 씨앗 하나를 건넸습니다. 부인은 그것을 화분에 심고 물을 주었지요. 이튿날 아침 싹이 뾰족 텄습니다. 며칠 만에 커다란 꽃봉오리가 맺혔지요. 튤립처럼 생긴 꽃이었습니다. 부인이 그 꽃에 입을 맞추자 꽃잎이 활짝 열렸지요.〕 |
| `images/01-flower-2.webp` | A cottage room where a thumb-sized girl sits inside an open tulip, and a walnut-shell bed with a rose-petal quilt beside a plate of water with floating petals, tiny and enchanting. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 꽃 속에 아이가 앉아 있었습니다. 키가 엄지손가락만 했지요. 어머나, 세상에! 부인은 아이에게 이름을 지어 주었습니다. / 오른쪽: 부인은 호두 껍데기로 침대를 만들어 주었습니다. 이불은 장미 잎, 베개는 제비꽃 꽃잎이었지요. 낮에는 물을 담은 접시 위에서 놀았습니다. 꽃잎을 배 삼아 띄웠지요. 엄지 공주는 노래를 아주 잘했습니다. 그 소리에 집 안이 환해졌지요.〕 |

## 2장 · 두꺼비가 데려간 밤

| 파일명 | 장면 |
|---|---|
| `images/02-toad.webp` | A moonlit cottage window where a large warty toad in a bonnet lifts a walnut-shell bed with a sleeping tiny girl, and carries it down to a muddy stream where a slack-jawed young toad waits, comic. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 어느 밤 창문이 조금 열려 있었습니다. 그 틈으로 두꺼비 한 마리가 폴짝 들어왔지요. 커다랗고 축축한 두꺼비였습니다. 두꺼비는 호두 침대를 들여다봤지요. 우리 아들 신붓감이로구나. / 오른쪽: 엄지 공주는 잠든 채로 아무것도 몰랐지요. 그러고는 개울가 진흙 집으로 갔지요. 얘야, 이것 보렴.〕 |
| `images/02-toad-2.webp` | A wide stream at sunrise where a tiny girl sits weeping alone on a floating lily pad surrounded by open water, silvery shapes moving beneath the surface, lonely and beautiful. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 두꺼비는 넓은 잎을 하나 골랐습니다. 개울 한가운데 떠 있는 잎이었지요. 거기에 엄지 공주를 살짝 올려놓았습니다. 여기 있으면 못 도망가지. 두꺼비는 집을 꾸미러 가 버렸지요. 잎 위에는 엄지 공주만 남았습니다. / 오른쪽: 이윽고 아침 해가 떠올랐지요. 눈을 떠 보니 사방이 온통 물이었습니다. 엄지 공주는 그만 울음을 터뜨렸지요. 엄마, 집에 가고 싶어요.〕 |

## 3장 · 개울을 따라

| 파일명 | 장면 |
|---|---|
| `images/03-fish.webp` | An underwater view of silvery minnows gnawing through a lily pad stem while a tiny girl claps from above, the pad breaking free and drifting downstream, joyful and bright. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 작은 물고기들이 하나둘 모여들었습니다. 모두 엄지 공주를 올려다봤지요. 울음소리를 물속에서 다 듣고 있었던 것입니다. 저 아이를 도와주자. 물고기들이 잎의 줄기를 물었지요. 그러고는 작은 이빨로 갉기 시작했습니다. / 오른쪽: 사각, 사각. 한참 만에 줄기가 툭 끊어졌지요. 잎이 스르르 떠내려가기 시작했습니다. 엄지 공주는 손뼉을 쳤지요.〕 |
| `images/03-fish-2.webp` | A lily pad skimming downstream pulled by a butterfly tethered with a ribbon belt, a tiny girl steering with wide eyes as green banks slide past in bright sunlight, delightful. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그때 하얀 나비 한 마리가 날아왔습니다. 잎 위에 사뿐 내려앉았지요. 엄지 공주는 허리띠를 풀어 한쪽을 나비에게 매었습니다. 우리 같이 가 줄래? 나비가 더듬이를 살랑 흔들었습니다. 나비가 날개를 활짝 폈지요. / 오른쪽: 그러자 잎이 훨씬 빨라졌습니다. 물살이 옆으로 쏜살같이 지나갔지요. 개울은 갈수록 넓어졌지요. 양옆으로 푸른 풀밭이 시원하게 펼쳐졌습니다. 엄지 공주에게는 모두 처음 보는 것투성이였지요. 무섭기도 하고 신기하기도 했습니다.〕 |

## 4장 · 여름 들판의 하루

| 파일명 | 장면 |
|---|---|
| `images/04-summer.webp` | A tree branch high above a meadow where a large beetle presents a tiny girl to a crowd of other beetles who inspect her with disapproval, comic snobbery, dappled leaf light. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그때 갑자기 커다란 그림자가 졌습니다. 풍뎅이 한 마리가 쏜살같이 내려온 것이었지요. 풍뎅이는 엄지 공주를 낚아채 나무 위로 데려갔습니다. 참 예쁜 아이로구나. 풍뎅이는 자랑하려고 친구들을 불러 모았지요. 풍뎅이들이 우르르 몰려왔습니다. / 오른쪽: 그런데 다들 고개를 저었지요. 다리가 두 개밖에 없잖아. 더듬이도 없고.〕 |
| `images/04-summer-2.webp` | A summer meadow where a tiny girl weaves a grass bed and drinks dew from a flower, and the same meadow in first snow with flakes bigger than she is, her shivering among bare stems, tender and stark. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 엄지 공주는 넓은 들판에 홀로 남았습니다. 그해 여름 내내 혼자 지냈지요. 풀잎을 엮어 침대를 만들고 꽃에서 꿀을 얻어먹었습니다. 아침이면 잎에 맺힌 이슬을 마셨지요. 나비와 새들이 곧 친구가 되었습니다. 낮에는 민들레 홀씨를 잡으러 뛰어다녔지요. / 오른쪽: 그런데 이내 가을이 왔지요. 꽃이 하나둘 시들고 새들도 하나씩 떠나갔습니다. 이윽고 첫눈이 내렸지요. 엄지 공주는 마른 잎을 뒤집어썼습니다. 눈송이 하나가 엄지 공주보다 컸습니다. 몸이 꽁꽁 얼어붙어 걸음도 잘 떼지 못했지요.〕 |

## 5장 · 들쥐 아주머니의 집

| 파일명 | 장면 |
|---|---|
| `images/05-mouse.webp` | A cosy underground burrow lined with stored grain where a stout spectacled field mouse in a shawl welcomes a tiny shivering girl inside, lamplight and warmth, homely and kind. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 엄지 공주는 들판을 헤매다 작은 굴 하나를 찾았습니다. 떨리는 손으로 문을 두드렸지요. 실례합니다… 들쥐 아주머니가 문을 열고 나왔습니다. / 오른쪽: 굴 안은 아늑하고 따뜻했지요. 곡식이 천장까지 가득 쌓여 있었습니다. 엄지 공주는 오랜만에 배불리 밥을 먹었지요. 집안일을 도우면 된단다. 저녁엔 이야기도 들려주고.〕 |
| `images/05-mouse-2.webp` | A burrow parlour where a plump velvet-black mole in dark glasses sits stiffly while a tiny girl sings, the field mouse beaming approval and the girl looking quietly trapped, warm lamplight. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 어느 날 아주머니가 들뜬 얼굴로 말했습니다. 이웃이 놀러 오신단다. 아주 부자인 두더지님이야. / 오른쪽: 땅속이 최고지요. 해니 꽃이니 다 쓸데없어요. 아주머니가 시켜 엄지 공주가 노래를 불렀습니다. 두더지는 그 노래를 아주 마음에 들어 했지요.〕 |

## 6장 · 다친 제비

| 파일명 | 장면 |
|---|---|
| `images/06-swallow.webp` | A long dark underground tunnel where a mole nudges a fallen swallow aside with his foot, and later a tiny girl returning alone with an armful of hay to cover the bird, tender. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 며칠 뒤 두더지가 제 굴을 보여 주었습니다. 길고 컴컴한 통로가 끝없이 이어졌지요. 흙냄새가 코를 찔렀습니다. 그러다 무언가에 발이 걸렸습니다. 새 한 마리가 바닥에 쓰러져 있었지요. 제비로군. 죽었나 보오. / 오른쪽: 두더지는 그것을 발로 툭 밀쳤습니다. 엄지 공주는 그 자리에 걸음을 멈췄지요. 가슴이 아파 견딜 수가 없었습니다. 여름 내내 함께 놀던 새들이 떠올랐지요. 그날 밤 엄지 공주는 몰래 그 굴로 갔지요. 건초를 한 아름 안고 가 제비를 덮어 주었습니다. 그러고는 가슴에 살며시 귀를 대 보았지요.〕 |
| `images/06-swallow-2.webp` | A dark tunnel where a swallow opens its eyes under a heap of hay as a tiny girl kneels beside it with a water drop, soft glow, deeply tender. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 쿵, 쿵. 심장이 뛰고 있었습니다! 살아 있어요! / 오른쪽: 고마워요, 작은 아가씨. 저는 얼어서 떨어졌던 거예요. 봄이 오면 저는 떠나요.〕 |

## 7장 · 제비의 등을 타고

| 파일명 | 장면 |
|---|---|
| `images/07-flight.webp` | A burrow entrance in early spring where a tiny girl steps out to look at the sun with a heavy heart, and a healthy swallow swooping down calling to her, hopeful. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 어느새 겨울이 끝나 갔습니다. 그사이 혼인 날짜가 정해졌지요. 엄지 공주는 마음이 자꾸 무거워졌습니다. 이제 땅속에서 평생 살아야 했거든요. 해도 꽃도 볼 수 없는 곳이었지요. 노래를 불러도 들어 줄 사람이 없을 것 같았습니다. 딱 하루만 더 있었으면. / 오른쪽: 드디어 혼인 전날이 되었습니다. 엄지 공주는 굴 밖으로 나갔지요. 해를 마지막으로 한 번 보려고요. 보리밭 위로 햇살이 쏟아지고 있었습니다. 그때 머리 위에서 소리가 났습니다.〕 |
| `images/07-flight-2.webp` | A swallow soaring high with a tiny girl clinging to its back, fields shrinking below, then crossing forests and a wide blue sea toward a warm land of flowers, exhilarating. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이제 따뜻한 나라로 가요. 함께 가지 않을래요? 엄지 공주는 잠시 망설였지요. 그러고는 천천히 고개를 끄덕였습니다. / 오른쪽: 꽉 잡으세요! 제비가 하늘로 힘차게 솟아올랐지요. 들판이 금세 손바닥만 해졌습니다. 숲과 강을 넘고 넓은 바다도 건넜지요. 갈수록 바람이 따뜻해졌습니다. 코끝에 꽃향기가 스쳤지요.〕 |

## 8장 · 꽃의 나라에서

| 파일명 | 장면 |
|---|---|
| `images/08-prince.webp` | A sunlit ruin of white pillars above a vast flower field where a tiny girl steps toward a great white blossom and finds inside it a small crowned figure with dragonfly wings, both staring, radiant. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 제비가 하얀 기둥 위에 내려앉았습니다. 아래에는 큰 꽃밭이 있었지요. 저기서 마음에 드는 꽃을 고르세요. 엄지 공주가 꽃밭으로 사뿐 내려섰습니다. 그러고는 가장 큰 흰 꽃 앞에 섰지요. / 오른쪽: 꽃잎 사이에 누군가 있었지요. 엄지 공주만 한 사람이었습니다. 머리에 작은 왕관을 쓰고 있었지요. 등에는 잠자리 날개가 달려 있었습니다. 둘은 한참 동안 서로를 바라봤지요. 말을 잇지 못한 채로요.〕 |
| `images/08-prince-2.webp` | A flower field where tiny people lean from every blossom applauding as a girl receives a pair of gossamer wings and flies for the first time, a swallow watching then winging north, joyous. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 저는 이 나라 왕자예요. 꽃마다 우리 사람들이 살지요. 왕자가 손을 내밀었습니다. / 오른쪽: 누군가 날개 한 쌍을 선물로 가져왔지요. 엄지 공주의 등에 그 날개를 달아 주었습니다. 엄지 공주는 처음으로 스스로 날아올랐지요. 제비가 그 모습을 흐뭇하게 지켜봤습니다. 이제 가 볼게요.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
