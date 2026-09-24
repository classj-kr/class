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
bold clean outlines, saturated storybook colors, cool forest greens and warm
indoor golds, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a northern pine forest through
four seasons, a ship's harbour, a decorated parlour and a farmyard, expressive
faces, wide panoramic composition, gentle and warm, never bleak.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
The little fir: a small bright-green fir tree with an expressive, hopeful face
in its branches. The hares: plump brown hares that leap over it. The sunbeams and
wind: drawn as soft warm light and swirling leaves rather than characters. The
children: cheerful children in nightgowns around a decorated tree. The storyteller:
a round grandfather in a knitted vest.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a small fir tree standing alone in a snowy forest clearing under a wide starry sky, larger firs all around, a warm light glowing from a distant farmhouse window, quiet and beautiful. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 빨리 크고 싶어

| 파일명 | 장면 |
|---|---|
| `images/01-small.webp` | A sunlit forest floor where a very small fir tree stands among ferns while plump hares leap right over it, tall pines towering behind, warm green light, sweet and comic. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 숲 한구석에 아주 작은 전나무가 있었습니다. 둘레에는 키 큰 나무들이 서 있었지요. 햇빛은 따뜻하고 바람은 시원했습니다. 새들이 날마다 노래를 불렀지요. 토끼들도 곁을 뛰어다녔습니다. 누가 봐도 좋은 자리였지요. / 오른쪽: 그런데 전나무는 늘 시무룩했습니다. 나는 왜 이렇게 작을까. 토끼들이 전나무를 훌쩍 뛰어넘고 갔지요.〕 |
| `images/01-small-2.webp` | A young fir tree through spring and summer, sunbeams and wind swirling around it while it looks up longingly at tall pines, seasons passing, wistful. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 지금이 제일 좋은 때란다. 바람도 가지를 쓰다듬으며 말했습니다. 어린 나무일 때가 얼마나 즐거운데. 전나무는 그 말이 싫었지요. / 오른쪽: 아직도 저 나무들 발밑이잖아. 봄이 오면 봄을 지나치고, 여름이 오면 여름을 지나쳤습니다. 전나무는 늘 다음만 기다렸지요. 어느새 세 해가 지났습니다. 그동안 전나무는 한 번도 지금이 좋다고 여긴 적이 없었지요.〕 |

## 2장 · 잘려 나간 나무들

| 파일명 | 장면 |
|---|---|
| `images/02-felled.webp` | An autumn forest where woodcutters drag away tall straight trunks and load them on carts, a small fir watching from between fresh stumps, vivid and wistful. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 가을이 되자 숲에 사람들이 왔습니다. 도끼와 톱을 든 나무꾼들이었지요. 숲에 쿵쿵 소리가 울렸습니다. 가장 크고 곧은 나무들이 잘려 나갔지요. 가지가 다 쳐지고 줄기만 남았습니다. 나무꾼들은 그것을 수레에 실었지요. / 오른쪽: 전나무는 잘린 자리를 바라보았습니다. 숲이 훤해진 것이 낯설었지요. 저 나무들은 어디로 가는 거지? 마침 황새가 한 마리 날아왔습니다.〕 |
| `images/02-felled-2.webp` | A stork perched by a small fir tree describing tall ship masts, with a dreamlike vision of a great sailing ship on the sea above them, adventurous and bright. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 거기서 큰 배를 보았지. 돛대가 어찌나 높은지 하늘에 닿을 것 같더구나. 저 나무들이 그 돛대가 된단다. / 오른쪽: 그렇지. 세상 끝까지 간단다. 황새는 날개를 펴고 날아갔습니다. 전나무는 한참을 그 자리에 서 있었지요. 우와, 나도 언젠가 그렇게 되고 싶어!〕 |

## 3장 · 반짝이는 나무들

| 파일명 | 장면 |
|---|---|
| `images/03-christmas.webp` | A snowy forest where woodcutters carry off small young firs while sparrows chatter to a waiting fir tree, cold blue light, curious. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 겨울이 되자 나무꾼들이 또 왔습니다. 이번에는 큰 나무를 베지 않았지요. 작고 어린 나무들만 골라 갔습니다. 전나무보다도 어린 나무들이었지요. 전나무는 그것이 이상했습니다. 마침 참새들이 가지에 내려앉았지요. / 오른쪽: 저 나무들은 또 어디로 가니? 참새들이 서로 재잘거렸습니다. 우리가 마을에서 봤어!〕 |
| `images/03-christmas-2.webp` | A vision above a snowy forest of a warm parlour window glowing with a decorated tree full of candles and gilded apples, a small fir gazing up longingly, magical. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 따뜻한 방 한가운데 서 있더라. 금색 사과랑 촛불을 잔뜩 달고 있더라! 사람들이 둘레에서 노래를 불렀어. / 오른쪽: 얼른, 얼른 나를 데려가 줘! 바람이 지나가며 말했습니다. 지금 여기가 좋다니까.〕 |

## 4장 · 드디어 온 날

| 파일명 | 장면 |
|---|---|
| `images/04-cut.webp` | A snowy clearing at dawn where a woodcutter sizes up a young fir tree and swings his axe, the tree tipping over into deep snow, dramatic and bittersweet. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이듬해 겨울이 왔습니다. 눈이 소복이 쌓인 아침이었지요. 도끼 소리가 바로 곁에서 났습니다. 나무꾼이 전나무 앞에 섰지요. 이 녀석이 딱 좋겠군. / 오른쪽: 그래도 두려움보다 설렘이 더 컸습니다. 드디어 내 차례구나! 도끼가 밑동을 내리쳤지요. 전나무는 눈밭 위로 쓰러졌습니다. 흰 눈이 푹 하고 튀어 올랐지요.〕 |
| `images/04-cut-2.webp` | A cart carrying a fir tree away from a snowy forest toward a village with chimney smoke, then people carrying it in through a warm lit door, hopeful and bright. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 전나무는 수레에 실렸습니다. 수레가 덜컹거리며 움직였지요. 숲이 점점 멀어졌습니다. 친구 나무들도 작아졌지요. 전나무는 뒤를 한 번도 돌아보지 않았습니다. 앞만 보며 마을을 기다렸지요. / 오른쪽: 수레가 어느 집 앞에 멈췄지요. 사람들이 전나무를 안고 안으로 들어갔습니다. 방 안은 따뜻하고 환했지요. 전나무는 가슴이 부풀었습니다. 참새들이 말하던 그 방이 틀림없었지요. 이제 곧 촛불이 켜질 참이었습니다.〕 |

## 5장 · 가장 빛나던 저녁

| 파일명 | 장면 |
|---|---|
| `images/05-decorated.webp` | A warm parlour where people decorate a fir tree with gilded apples, paper flowers and sweets, setting a great star on top, cosy and expectant. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 전나무는 방 한가운데에 세워졌습니다. 통에 모래를 채워 단단히 받쳐 주었지요. 사람들이 상자를 가져왔습니다. 가지마다 금색 사과가 달렸지요. 종이꽃과 사탕도 매달렸습니다. 초록 가지가 알록달록해졌지요. / 오른쪽: 꼭대기에는 커다란 별이 얹혔습니다. 전나무는 가지가 뻐근할 지경이었지요. 그래도 기뻐서 견딜 수가 없었습니다. 오늘 밤 무슨 일이 벌어질까? 해가 지고 방이 어둑해졌지요. 전나무는 숨을 죽이고 기다렸습니다.〕 |
| `images/05-decorated-2.webp` | A parlour where a fir tree blazes with candles as children in nightgowns rush in clapping and dance around it, family gathered, radiant and joyful. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이윽고 촛불이 하나씩 켜졌습니다. 가지마다 불빛이 반짝였지요. 문이 활짝 열렸습니다. 아이들이 손뼉을 치며 뛰어들어 왔지요. 우와, 정말 예쁘다! / 오른쪽: 노래를 부르고 선물을 나누었지요. 전나무는 이보다 좋은 날이 없다고 생각했습니다. 내일도 이렇겠지. 모레도, 그다음 날도.〕 |

## 6장 · 생쥐들에게 들려준 이야기

| 파일명 | 장면 |
|---|---|
| `images/06-attic.webp` | Servants stripping decorations from a fir tree and dragging it up to a dim dusty attic to lean among boxes, one shaft of light from a small window, quiet and lonely. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그런데 잔치는 하룻밤으로 끝났습니다. 이튿날 아침 사람들이 들어왔지요. 금색 사과도 종이꽃도 떼어 냈습니다. 꼭대기 별도 내려놓았습니다. 가지에는 촛농만 남았지요. / 오른쪽: 아무도 그것을 줍지 않았지요. 계단을 올라 어두운 다락방에 놓았습니다. 먼지 낀 상자들 틈이었지요. 전나무는 그래도 마음을 놓았습니다. 곧 다시 꾸며 주겠지.〕 |
| `images/06-attic-2.webp` | A dim dusty attic where a bare fir tree drops needles and two mice sit attentively at its base looking up, tender and quiet. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 하지만 아무도 오지 않았습니다. 하루가 가고 이레가 갔지요. 다락방은 늘 어둡고 조용했습니다. 전나무는 점점 목이 말랐지요. 가지에서 바늘잎이 하나둘 떨어졌습니다. / 오른쪽: 이건 뭐지? 나무 냄새가 나네. 생쥐들은 전나무 밑동에 앉았습니다. 어디서 왔어? 이야기 좀 해 줘.〕 |

## 7장 · 뒤늦게 떠오른 것

| 파일명 | 장면 |
|---|---|
| `images/07-memory.webp` | An attic where a fir tree tells stories to gathered mice, and behind it a soft translucent memory of a sunlit summer forest with hares and dew, gentle and moving. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 전나무는 이야기를 시작했습니다. 내가 살던 곳은 아주 넓은 숲이었어. 아침이면 햇빛이 가지를 데워 주었지. / 오른쪽: 토끼들도 있었어. 내가 하도 작아서 훌쩍 뛰어넘고 다녔지. 그때는 그게 그렇게 분하더니.〕 |
| `images/07-memory-2.webp` | A fir tree alone in a dim attic gazing at snow falling past a small window, mice gone, dust motes in a beam of light, quiet and moving. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그때가…… 참 좋았구나. 전나무는 조용히 말했습니다. 나는 왜 그걸 몰랐을까. / 오른쪽: 그 뒤로는 다시 오지 않았습니다. 다락방은 또 조용해졌지요. 작은 창밖으로 눈이 내리고 있었습니다. 전나무는 그 눈을 오래 바라보았지요. 그렇게 겨울이 다 갔습니다. 전나무는 점점 마르고 바스락거렸지요.〕 |

## 8장 · 마당에 나온 날

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | An attic door opening onto spring light, a fir tree carried down and laid in a sunny farmyard where green shoots and a small sapling grow nearby, hopeful and warm. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 봄이 되자 다락문이 열렸습니다. 환한 빛이 쏟아져 들어왔지요. 사람들이 전나무를 들고 내려갔습니다. 전나무는 마당으로 옮겨졌지요. 오랜만에 햇빛이 가지에 내려앉았습니다. 바람도 다시 가지를 스쳤지요. / 오른쪽: 전나무는 눈을 가늘게 떴습니다. 마당 한구석에는 파란 싹이 돋아 있었지요. 어린 나무 한 그루가 자라고 있었습니다. 옛날의 저를 보는 것 같았지요. 전나무는 그 나무를 물끄러미 보았습니다. 그 나무도 어서 크고 싶어 할까 싶었지요.〕 |
| `images/08-ending-2.webp` | A spring farmyard where a fir tree lies in the sun and a child pins its old star to her coat while children run and laugh, quiet and hopeful. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 마당에서는 아이들이 놀고 있었습니다. 한 아이가 무언가를 주웠지요. 전나무 꼭대기에 달렸던 별이었습니다. 아이는 그것을 가슴에 달았지요. 이거 진짜 예쁘다! / 오른쪽: 아이들이 웃으며 마당을 뛰어다녔습니다. 전나무는 그 소리를 들었지요. 햇빛이 참 따뜻했습니다. 전나무는 눈을 감고 조용히 생각했지요. 마음이 이상하게 편안했습니다. 다음에 다시 자란다면.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
