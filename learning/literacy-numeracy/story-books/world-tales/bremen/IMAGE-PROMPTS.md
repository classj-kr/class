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
bold clean outlines, saturated storybook colors, warm lantern light against cool
night blue, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), German farmyards, a country road and
a robbers' cottage in the woods, very expressive comic animal faces, wide
panoramic composition, funny and never frightening.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
The donkey: a grey donkey with a drooping lip and tired knees, the leader. The
dog: a shaggy brown hound with grey around his muzzle. The cat: a striped cat
with worn whiskers and a crooked tail. The rooster: a red-combed rooster with
splendid tail feathers. The robbers: three scruffy men in patched coats and
floppy hats, drawn as bumbling and comic, never menacing.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a donkey with a dog on its back, a cat on the dog, and a rooster on top of the cat, all standing on a moonlit country road, a lit cottage window glowing far ahead, funny and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 늙은 당나귀

| 파일명 | 장면 |
|---|---|
| `images/01-donkey.webp` | A dim mill barn where an old grey donkey rests among grain sacks, ears pricked as a miller talks outside the door, dust motes in a shaft of evening light, wistful. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 당나귀는 새벽에 나가 저녁이 되어야 돌아왔습니다. 아주 오랫동안 방앗간 짐을 나른 것이지요. 하루도 거른 날이 없었습니다. 곡식 자루를 등에 지고 방앗간과 장터를 오갔지요. 눈이 오나 비가 오나 마찬가지였습니다. 주인도 그런 당나귀를 아주 아꼈지요. / 오른쪽: 그런데 세월이 흘러 당나귀도 늙었습니다. 다리가 후들거리고 등이 시큰거렸지요. 예전만큼 짐을 지지 못했습니다. 자루 하나를 지고도 몇 번씩 쉬어야 했습니다. 주인의 얼굴이 점점 굳어 갔지요. 어느 날 헛간에서 쉬는데 문밖에서 목소리가 들려왔습니다.〕 |
| `images/01-donkey-2.webp` | A moonlit mill yard where an old grey donkey slips out through a gate onto a country road, throwing back its head to bray at the stars, hopeful and comic. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이제 저놈은 쓸모가 없구나. 먹이만 축내는걸. 당나귀는 귀를 쫑긋 세웠습니다. 가슴이 서늘해졌지요. 그날 밤 잠이 오지 않았습니다. 이대로 있다가는 큰일이 날 것 같았지요. 당나귀는 밤새 뒤척이다 마음을 정했습니다. / 오른쪽: 달이 환한 밤이었지요. 뒤도 돌아보지 않고 큰길로 나섰습니다. 브레멘으로 가자. 거기서 악사가 되면 되지. 당나귀는 목청을 가다듬어 보았습니다.〕 |

## 2장 · 길에서 만난 개

| 파일명 | 장면 |
|---|---|
| `images/02-dog.webp` | A dusty roadside where a shaggy old hound lies panting under a hedge as a grey donkey stops and lowers its head to him, warm morning light, sympathetic. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 한참을 걸었을 때였습니다. 길가에 무언가 늘어져 있었지요. 가까이 가 보니 늙은 사냥개였습니다. 숨을 헐떡이며 겨우 고개만 들었습니다. 털이 여기저기 빠져 있었고 옆구리가 홀쭉했지요. / 오른쪽: 말도 마십시오. 이제 사냥을 못 한다고 주인이 저를 내쫓았지 뭡니까. 어제부터 아무것도 못 먹었습니다. 이 길에서 그냥 이러고 있지요. 당나귀는 한참 개를 내려다보았습니다. 남의 일 같지가 않았지요. 바로 어제 자기 이야기였으니까요.〕 |
| `images/02-dog-2.webp` | A country road where a shaggy hound scrambles up onto its feet barking cheerfully beside a grey donkey, both setting off together, comic and warm. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 당나귀가 앞발로 땅을 툭툭 쳤습니다. 마침 잘됐군. 나와 브레멘에 가서 악사가 되세. 제가요? 저는 짖는 것밖에 못 하는데요. / 오른쪽: 그러다 슬며시 웃었지요. 앞발에 힘을 주고 천천히 몸을 일으켰습니다. 다리가 후들거렸지만 그래도 섰습니다. 멍멍! 이러면 됩니까?〕 |

## 3장 · 고양이와 수탉

| 파일명 | 장면 |
|---|---|
| `images/03-four.webp` | A village lane where a grumpy striped cat with worn whiskers sits hunched on a wall as a donkey and hound stop to talk to it, sunny and comic. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 둘이 나란히 걷다 보니 어느새 낮이 되었습니다. 길가 돌담 위에 고양이가 앉아 있었지요. 얼굴이 잔뜩 찌푸려져 있었습니다. 사흘은 굶은 얼굴이었지요. 수염도 여기저기 빠져 있었습니다. 자네는 또 왜 그런가? / 오른쪽: 이가 다 빠져서 쥐를 못 잡는다고 구박을 받네요. 이제 저는 갈 곳도 없습니다. 그럼 자네도 함께 가세. 밤 노래는 자네가 제일이지. 고양이가 눈을 껌뻑였습니다.〕 |
| `images/03-four-2.webp` | A farmyard fence where a red-combed rooster crows dramatically, then flapping down to join a donkey, hound and cat walking away together down a lane, lively and funny. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 셋이 마을을 지나갈 때였습니다. 어느 집 담장 위에서 수탉이 목이 터져라 울고 있었지요. 해도 이미 중천인데 무슨 일인가 싶었습니다. 무슨 일로 그리 우나? 내일 잔칫상에 오른다지 뭡니까! 마지막으로 실컷 울어나 보려고요. / 오른쪽: 그렇게 좋은 목청을 두고 잔칫상이라니, 말도 안 되지. 우리와 함께 가세. 자네 목소리면 어디서든 먹고살겠어. 수탉은 잠시 망설였습니다.〕 |

## 4장 · 숲속의 불빛

| 파일명 | 장면 |
|---|---|
| `images/04-light.webp` | A dark forest at night where a donkey and hound settle under a tree, a cat on a branch and a rooster high at the treetop pointing a wing toward a distant glimmer, atmospheric. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 해가 지고 넷은 숲에서 밤을 맞았습니다. 브레멘은 아직 한참 멀었지요. 하루 만에 닿을 거리가 아니었습니다. 당나귀와 개는 커다란 나무 밑에 자리를 잡았습니다. 고양이는 가지에 올라갔고, 수탉은 더 높이 날아올랐지요. / 오른쪽: 수탉은 꼭대기에서 습관처럼 사방을 둘러보았습니다. 자던 곳에서 늘 하던 일이었지요. 그러다 갑자기 소리쳤습니다. 저기 저기! 불빛이 보여요!〕 |
| `images/04-light-2.webp` | Four animals creeping through undergrowth toward a small cottage with one glowing window in a forest clearing, the donkey rearing to peer over the high sill, exciting. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 넷은 불빛을 따라 걸었습니다. 나뭇가지가 자꾸 얼굴을 스쳤지요. 발밑에서 마른 잎이 바스락거렸습니다. 한참을 헤치고 나아가자 숲이 트였습니다. 빈터 한가운데 작은 오두막이 서 있었지요. 창문 하나가 아주 환했습니다. 넷은 몸을 낮추고 살금살금 다가갔습니다. / 오른쪽: 안에서 웃음소리가 새어 나왔습니다. 그런데 창턱이 꽤 높았지요. 고양이와 수탉은 어림도 없었습니다. 내가 볼 테니 자네들은 좀 기다리게.〕 |

## 5장 · 도둑들의 밥상

| 파일명 | 장면 |
|---|---|
| `images/05-robbers.webp` | Seen through a cottage window, three scruffy robbers feasting at a laden table with sacks of loot in the corner, a donkey's eyes peering over the sill, comic and enticing. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 방 안에는 사내 셋이 있었습니다. 상다리가 휘도록 차려 놓고 먹는 중이었지요. 고기며 빵이며 술이며 상 위에 가득했습니다. 구석에는 묵직한 자루가 몇 개 쌓여 있었지요. 한눈에 보아도 도둑들이었습니다. 뭐가 보이나? / 오른쪽: 먹을 게 산더미야. 당나귀가 침을 꼴깍 삼켰습니다. 저 정도면 우리 넷도 배부르게 먹겠는걸.〕 |
| `images/05-robbers-2.webp` | Four animals stacking themselves one on top of another beneath a lit cottage window — donkey, hound, cat and rooster — wobbling comically, moonlight, hilarious. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 넷은 창 밑에 모여 머리를 맞댔습니다. 어떻게 하면 저들을 쫓아낼지 궁리했지요. 문을 두드려 볼까, 뒤로 돌아가 볼까 말이 오갔습니다. 다들 좋은 수가 떠오르지 않았습니다. 한참 만에 당나귀가 좋은 수를 냈습니다. / 오른쪽: 넷은 곧바로 자리를 잡았습니다. 당나귀가 앞발을 창턱에 올렸지요. 그 등에 개가 올라섰습니다. 개 등에는 고양이가, 고양이 등에는 수탉이 올라섰습니다. 넷이 겹겹이 쌓이자 창문 높이가 딱 맞았지요. 하나, 둘, 셋!〕 |

## 6장 · 창가에 선 넷

| 파일명 | 장면 |
|---|---|
| `images/06-noise.webp` | A cottage interior in chaos as a window bursts inward and four animals tumble through, three robbers flinging up their arms and fleeing, chairs and dishes flying, riotously comic. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 넷이 한꺼번에 목청을 높였습니다. 히히힝! 멍멍! 야옹! 꼬끼오! 어찌나 요란한지 숲이 다 울렸습니다. 새들이 놀라 날아올랐지요. 그러고는 넷이 그대로 창으로 쏟아져 들어갔습니다. / 오른쪽: 도둑들은 숟가락을 내던지고 튀어 올랐지요. 의자가 넘어지고 접시가 굴렀습니다. 괴, 괴물이다! 살려 줘!〕 |
| `images/06-noise-2.webp` | A cottage where four animals feast happily around a laden table by firelight, and then settling to sleep in their own corners, warm and contented. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 도둑들이 숲 저편으로 달아났습니다. 발소리가 한참 들리다 이내 조용해졌지요. 넷은 서로를 마주 보았습니다. 그러고는 누가 먼저랄 것도 없이 상 앞에 둘러앉았습니다. 어찌나 배가 고팠던지요. 넷은 상 위의 것을 남김없이 먹어 치웠습니다. / 오른쪽: 몇 달 만에 배가 불렀지요. 당나귀는 배를 두드리며 웃었습니다. 이제 좀 살 것 같군. 넷은 불을 끄고 저마다 편한 자리를 찾았습니다. 당나귀는 마당 두엄 위에, 개는 문 뒤에, 고양이는 아궁이 앞에, 수탉은 지붕에 자리를 잡았지요.〕 |

## 7장 · 다시 온 도둑

| 파일명 | 장면 |
|---|---|
| `images/07-return.webp` | A dark cottage kitchen where a robber gropes toward two glowing points he takes for embers, a striped cat crouched in the hearth with eyes gleaming, tense and comic. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 한밤중이었습니다. 숲에 숨어 있던 도둑들이 수군거렸지요. 오두막 쪽이 캄캄해진 지 한참이었습니다. 불도 꺼졌는데 그냥 갈 텐가? 자루가 아직 저 안에 있잖나. / 오른쪽: 부엌은 캄캄했습니다. 도둑은 더듬더듬 아궁이를 찾았지요. 등불을 켜려면 불씨가 필요했으니까요. 그때 어둠 속에서 불씨 두 개가 반짝였습니다. 도둑은 반가운 마음에 성냥을 갖다 댔지요. 그런데 그것은 불씨가 아니라 고양이의 눈이었습니다. 고양이가 어둠 속에서 눈을 번쩍 떴지요.〕 |
| `images/07-return-2.webp` | A comic chase through a cottage — a robber clawed by a cat, bitten by a hound at the back door, kicked by a donkey in the yard, a rooster crowing from the roof, moonlit and funny. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 야옹! 고양이가 앞발로 얼굴을 할퀴었습니다. 도둑이 비명을 지르며 뒷문으로 달아났지요. 그런데 하필 문 앞에 개가 엎드려 있었습니다. 개가 다리를 콱 물었지요. 도둑은 펄쩍 뛰어 마당으로 굴러 나갔습니다. / 오른쪽: 당나귀가 뒷발로 힘껏 걷어찼습니다. 도둑이 담 너머로 붕 날아갔지요. 그 소리에 잠이 깬 수탉이 지붕에서 외쳤습니다. 도둑은 엉덩방아를 찧고 그대로 뛰었습니다. 꼬끼오!〕 |

## 8장 · 브레멘은 못 갔지만

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | A forest camp where a terrified robber recounts his ordeal with wild gestures to two disbelieving companions, imagined monsters sketched faintly behind him, very comic. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 도둑은 두목에게 달려가 벌벌 떨며 말했습니다. 저 집에는 무서운 것들이 잔뜩 있습니다! 마귀할멈이 손톱으로 얼굴을 할퀴었고요. 문가에서는 칼 든 자가 다리를 찔렀습니다. / 오른쪽: 게다가 지붕에서 재판관이 잡아가라고 소리쳤습니다! 두목은 고개를 절레절레 저었습니다. 그런 집은 그냥 두는 게 낫겠군.〕 |
| `images/08-ending-2.webp` | A cosy woodland cottage in morning light with a well and vegetable patch, the four animals looking it over contentedly, and at dusk all four singing together on the doorstep, joyful and homey. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아침이 되었습니다. 넷은 오두막을 천천히 둘러보았지요. 지붕도 튼튼하고 부엌도 넓었습니다. 뜰에는 우물이 있고 그 옆에 텃밭도 있었습니다. 헛간에는 마른 짚까지 쌓여 있었지요. 넷에게 꼭 맞는 집이었습니다. 브레멘은 뭐, 다음에 가지. / 오른쪽: 여기가 더 좋은걸. 당나귀가 그렇게 말하자 셋이 모두 고개를 끄덕였습니다. 넷은 그 집에서 오래오래 함께 살았습니다. 저녁마다 네 목소리가 숲에 울려 퍼졌지요. 지나가던 사람들은 그 소리를 듣고 걸음을 멈추었답니다.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
