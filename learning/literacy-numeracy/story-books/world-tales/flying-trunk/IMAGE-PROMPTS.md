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
bold clean outlines, saturated storybook colors, warm night blues and lamp golds,
ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a merchant's town, a night sky, a domed eastern
city, a tall tower and a marketplace, very expressive comic faces, wide panoramic
composition, funny and warm.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
The merchant's son: a cheerful young man in a fine coat that grows shabbier as
the story goes, quick with words. The old friend: a stooped man with spectacles
who gives him the trunk. The princess: a curious girl in a tower room who loves
stories. The king and queen: a stout pair in ceremonial robes, easily impressed.
The townspeople: a lively crowd of market folk.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: an old leather travelling trunk flying high above a moonlit city of domes and minarets, a young man sitting inside it with his hair blown back, stars all around, whimsical and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 다 써 버린 재산

| 파일명 | 장면 |
|---|---|
| `images/01-spend.webp` | A grand merchant house where a cheerful young man in fine clothes treats a crowd of friends to a lavish feast, coins scattered on the table, warm and comic. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 옛날 어느 마을에 큰 장사꾼이 살았습니다. 어찌나 돈이 많은지 은화로 온 거리를 덮을 정도였지요. 그런데 장사꾼이 그만 세상을 떠났습니다. 재산은 모두 외아들에게 돌아갔지요. 아들은 아주 신이 났습니다. 이제 마음껏 써도 되겠구나. / 오른쪽: 아들은 돈을 물 쓰듯 썼습니다. 좋은 옷을 짓고 새 신을 사들였지요. 날마다 사람들에게 한턱을 냈습니다. 자네처럼 훌륭한 사람이 없네! 오늘도 한턱내시지요!〕 |
| `images/01-spend-2.webp` | An emptied house where a young man sits alone on the bare floor while a stooped friend in spectacles carries in a battered leather trunk, rueful and comic. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그런데 재산은 끝이 있었습니다. 몇 해가 지나자 곳간이 텅 비었지요. 집도 팔고 세간도 팔았습니다. 남은 것은 동전 몇 닢뿐이었지요. 친구들도 하나둘 발길을 끊었습니다. / 오른쪽: 아들은 빈방에 혼자 앉아 있었지요. 그때 옛 친구 하나가 찾아왔습니다. 커다랗고 낡은 가죽 가방을 들고 왔지요. 이거라도 쓰게. 짐 쌀 때 필요할 걸세.〕 |

## 2장 · 가방이 날아올랐다

| 파일명 | 장면 |
|---|---|
| `images/02-fly.webp` | An old leather trunk lifting off a bare floor with a startled young man inside, then shooting up out of a chimney into the night, exhilarating and funny. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그런데 쌀 짐이 없었습니다. 가진 것이 하나도 없었으니까요. 아들은 심심해서 가방 안에 들어가 앉았지요. 넓고 푹신해서 앉을 만했습니다. 차라리 내가 짐이 되지 뭐. / 오른쪽: 아들은 장난삼아 자물쇠를 눌러 보았습니다. 딸깍 소리가 났지요. 그 순간 가방이 붕 떠올랐습니다. 어어어! 이게 뭐야! 아들은 눈을 질끈 감았습니다. 가방은 방 안을 한 바퀴 돌았지요. 그러고는 굴뚝으로 쏙 빠져나갔습니다.〕 |
| `images/02-fly-2.webp` | A leather trunk soaring high above moonlit clouds with a delighted young man steering by leaning, tiny towns and rivers far below, stars all around, magical. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 가방은 구름 위까지 솟구쳤습니다. 아래로 마을이 손톱만큼 작아졌지요. 강도 실오라기처럼 보였습니다. 바람이 귓가에서 쌩쌩 울었지요. 아들은 처음에는 겁이 났습니다. 가방 가장자리를 놓칠까 봐 손에 힘을 주었지요. 그러다 차츰 마음이 놓였지요. / 오른쪽: 이거 생각보다 근사한걸? 몸을 앞으로 기울이면 가방도 앞으로 갔습니다. 옆으로 기울이면 옆으로 돌았지요. 아들은 신이 나서 밤하늘을 달렸습니다. 별이 손에 닿을 것 같았지요.〕 |

## 3장 · 낯선 나라의 탑

| 파일명 | 장면 |
|---|---|
| `images/03-tower.webp` | A trunk landing in a wood beside a colourful eastern city of domes and awnings, a young man hiding it under leaves then walking into a busy spice market, lively. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 한참을 날아가자 낯선 도시가 나타났습니다. 지붕이 둥글고 탑이 뾰족한 도시였지요. 가방은 도시 끝 숲에 사뿐히 내려앉았습니다. 아들은 가방을 덤불 속에 숨겼지요. 나뭇잎으로 잘 덮어 두었습니다. 그러고는 거리로 나섰지요. / 오른쪽: 시장에는 낯선 과일과 향신료가 가득했습니다. 아들은 지나가는 사람에게 이것저것 물었지요. 그러다 저 멀리 높다란 탑이 눈에 띄었습니다. 저 탑에는 누가 사나요?〕 |
| `images/03-tower-2.webp` | A market seller pointing up at a tall lone tower rising above the rooftops while a young man listens with a gleam in his eye, colourful stalls around, intriguing. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 저기는 공주님이 계신 곳이오. 점쟁이가 이런 점괘를 냈다지 뭐요. 공주님이 사랑 때문에 마음 아플 거라고요. / 오른쪽: 아들의 눈이 반짝 빛났습니다. 그럼 하늘로는 갈 수 있겠군. 뭐라고요?〕 |

## 4장 · 창문으로 들어가다

| 파일명 | 장면 |
|---|---|
| `images/04-window.webp` | A leather trunk rising to the top of a tall tower at night, a young man climbing in through a half-open window where a princess sleeps on a couch, moonlit and charming. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 밤이 되자 아들은 숲으로 돌아갔습니다. 덤불에서 가방을 꺼냈지요. 그 안에 들어가 자물쇠를 눌렀습니다. 가방이 스르르 떠올랐지요. 아들은 탑 꼭대기로 곧장 올라갔습니다. 창문이 반쯤 열려 있었지요. / 오른쪽: 아들은 창턱을 넘어 살그머니 들어섰습니다. 방 안에는 등불이 하나 켜져 있었지요. 책이 여기저기 펼쳐진 채였습니다. 공주가 긴 의자에서 잠들어 있었습니다. 인기척에 공주가 깜짝 놀라 일어났지요. 누, 누구세요! 공주가 이불을 끌어당겼습니다.〕 |
| `images/04-window-2.webp` | A tower bedroom where a young man bows to a wide-eyed princess sitting up on her couch, a trunk resting by the window, warm lamplight, charming. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아들은 얼른 고개를 숙였습니다. 놀라지 마십시오. 저는 하늘에서 왔습니다. / 오른쪽: 공주님을 뵈러 먼 길을 왔습니다. 공주는 무섭기보다 신기했습니다. 탑에 갇힌 뒤로 손님은 처음이었거든요. 정말요? 하늘은 어떤 곳이에요?〕 |

## 5장 · 이야기를 들려주다

| 파일명 | 장면 |
|---|---|
| `images/05-story.webp` | A tower room where a young man acts out a story with sweeping gestures, kitchen objects sketched magically in the air around him, a princess laughing on the couch, warm lamplight. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아들은 그 자리에 앉아 이야기를 시작했습니다. 부엌 살림들이 다투는 이야기였지요. 바구니가 이렇게 말했습니다. 내가 제일 쓸모 있다고요! / 오른쪽: 성냥은 콧대를 높이며 말했습니다. 불이 없으면 아무것도 못 하잖아요. 아들은 목소리를 바꿔 가며 흉내를 냈지요. 공주는 배를 잡고 웃었습니다. 이렇게 웃어 본 것이 얼마 만인지 몰랐지요.〕 |
| `images/05-story-2.webp` | A trunk arriving at a tower window night after night under different moons, a princess waiting eagerly at the sill each time, warm and romantic. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이야기가 끝나자 창밖이 뿌옇게 밝아 왔습니다. 이제 가야겠습니다. 공주가 얼른 손을 내밀었지요. / 오른쪽: 아들은 그 뒤로 밤마다 탑을 찾아갔습니다. 갈 때마다 새 이야기를 지어냈지요. 어떤 밤에는 웃긴 이야기를 했습니다. 어떤 밤에는 슬픈 이야기를 했지요. 공주는 그 시간을 손꼽아 기다렸습니다. 두 사람은 어느새 아주 가까워졌지요.〕 |

## 6장 · 임금님 앞에서

| 파일명 | 장면 |
|---|---|
| `images/06-parents.webp` | A tower room where a princess happily tells her stout royal parents about a visitor while the king frowns and the queen looks curious, ornate robes, comic. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 어느 날 임금님과 왕비가 탑에 올라왔습니다. 공주가 부쩍 밝아진 것이 궁금했거든요. 공주는 숨기지 못하고 털어놓았지요. 하늘에서 오시는 분이 계세요. 이야기를 어찌나 재미나게 하시는지요. 공주의 얼굴이 환했습니다. / 오른쪽: 임금님은 눈살을 찌푸렸습니다. 왕비는 그래도 궁금해했지요. 이야기를 잘한다고? 우리도 한번 들어 보면 어떨까요.〕 |
| `images/06-parents-2.webp` | A domed throne room where a young man tells a story with animated gestures, the queen dabbing her eyes and the king slapping his knee, courtiers delighted, festive. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그날 저녁 아들이 궁궐로 갔습니다. 임금님과 왕비가 나란히 앉아 있었지요. 신하들도 빙 둘러섰습니다. 아들은 헛기침을 하고 이야기를 시작했지요. 이번에는 아주 긴 이야기였습니다. 홀 안이 물을 끼얹은 듯 조용해졌습니다. / 오른쪽: 이런 재주는 처음 보는구나! 이만한 사윗감이 어디 있겠소! 혼인 날짜가 그 자리에서 정해졌습니다. 공주는 얼굴이 발그레해졌지요. 온 나라가 잔치 준비로 들썩였습니다.〕 |

## 7장 · 혼례 전날 밤

| 파일명 | 장면 |
|---|---|
| `images/07-fireworks.webp` | A young man buying armfuls of fireworks at a lantern-lit market, then loading them into a trunk and rising into the night sky above a glowing city, festive. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 혼례 전날 밤이었습니다. 온 도시에 잔치가 벌어졌지요. 거리마다 등불이 걸리고 북소리가 울렸습니다. 아들은 사람들을 놀래 주고 싶었지요. 기왕이면 하늘에서 해야지. / 오른쪽: 남은 돈을 다 털어 넣었지요. 그것을 가방에 싣고 숲으로 갔습니다. 그러고는 가방을 타고 하늘로 올라갔지요. 도시가 발밑에서 반짝였습니다. 아들은 불꽃에 하나씩 불을 붙였습니다. 심지가 치익 소리를 내며 타들어 갔지요.〕 |
| `images/07-fireworks-2.webp` | A night sky above a domed city bursting with fireworks launched from a flying trunk, crowds below cheering with upturned faces, spectacular and joyful. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 하늘에서 불꽃이 펑펑 터졌습니다. 빨강 파랑 노랑 빛이 쏟아졌지요. 사람들이 고개를 젖히고 환호했습니다. 저게 대체 뭐야! 하늘의 신이 축복을 내리신다! / 오른쪽: 아들은 그것을 흐뭇하게 내려다보았습니다. 가슴이 뿌듯했지요. 불꽃이 다 떨어질 무렵 가방을 내렸습니다. 숲 빈터에 가방을 세워 두었지요. 그러고는 잔치 구경을 하러 마을로 내려갔습니다. 아들은 뒤도 돌아보지 않았지요.〕 |

## 8장 · 하늘을 보는 공주

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | A forest clearing at dawn where only a heap of grey ash remains where a trunk stood, a young man kneeling and sifting it with his hands, quiet and sad. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아들은 밤늦도록 잔치 구경을 했습니다. 사람들이 저마다 하늘 이야기를 하고 있었지요. 아들은 웃음을 참기가 힘들었습니다. 새벽이 되어서야 숲으로 돌아갔지요. 그런데 가방이 있던 자리가 이상했습니다. 가방은 보이지 않았지요. / 오른쪽: 매캐한 냄새가 코를 찔렀습니다. 그 자리에 재만 수북이 남아 있었습니다. 불꽃 하나가 튀어 옮겨붙었던 것이지요. 아들은 그 앞에 털썩 주저앉았습니다. 재를 손으로 헤쳐 보았지요. 남은 것은 아무것도 없었습니다. 자물쇠 조각 하나만 까맣게 남아 있었지요.〕 |
| `images/08-ending-2.webp` | A wandering storyteller telling tales in a village square while glancing at the sky, and far away a princess at a tower window watching empty clouds, wistful. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이제 탑으로 올라갈 방법이 없었습니다. 하늘에서 왔다고 한 사람이었으니까요. 걸어서 궁궐로 갈 수는 없는 노릇이었지요. 아들은 도시를 떠났습니다. 이곳저곳을 떠돌며 이야기를 들려주었지요. 장터에서도 하고 마을 어귀에서도 했습니다. / 오른쪽: 사람들은 그 이야기를 참 좋아했지요. 하지만 아들은 늘 하늘을 올려다보았습니다. 한편 공주는 그 밤 이후로 기다렸습니다. 지금도 탑 창가에서 하늘을 본답니다. 언젠가 저 구름 사이로 가방이 다시 떠오르기를 기다리면서요.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
