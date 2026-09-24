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
bold clean outlines, saturated storybook colors, silvery moonlight and warm
ballroom candlelight, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a forest lake, pine woods
and a grand palace ballroom, expressive faces, wide panoramic composition,
beautiful and never frightening.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Odette: a gentle girl in a white feathered dress with a small crown, who becomes
a white swan by day. Prince Siegfried: an earnest young man in a blue doublet
with a crossbow. Odile: a girl in black who looks almost exactly like Odette but
smiles too sharply. Rothbart: a tall figure in a dark feathered cloak, drawn as a
grand owl-like shape rather than a monster.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a white swan gliding on a moonlit forest lake, its reflection subtly shaped like a dancing girl, dark pines all around and a distant castle glowing, ethereal and beautiful. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 스무 살 생일

| 파일명 | 장면 |
|---|---|
| `images/01-birthday.webp` | A sunny castle courtyard birthday feast with garlands, musicians and dancing villagers, a queen drawing her son aside at dusk, warm festive colours. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 궁궐 마당에 깃발이 걸리고 악사들이 모였습니다. 지크프리트 왕자가 스무 살이 되던 날이었지요. 큰 잔치가 열렸습니다. 북소리가 담을 넘어 마을까지 울렸지요. 마을 사람들이 춤을 추었지요. 왕자도 친구들과 어울려 웃었습니다. / 오른쪽: 해가 기울 무렵이었습니다. 어머니가 왕자를 조용히 불렀지요. 이제 어른이 되었으니 할 일이 있다. 내일 무도회를 열 것이다.〕 |
| `images/01-birthday-2.webp` | A troubled young prince slipping away from a feast with a crossbow and walking into moonlit pine woods where a bright lake appears ahead, quiet and beautiful. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 정해 놓고 고르는 게 무슨 뜻이 있을까요. 왕자는 마음이 답답했습니다. 잔치 소리도 귀에 들어오지 않았지요. 왕자는 조용히 자리를 빠져나왔습니다. 벽에 걸린 활을 챙겼지요. / 오른쪽: 왕자는 숲으로 걸어 들어갔습니다. 발밑에서 낙엽이 바스락거렸지요. 어디선가 부엉이가 울었습니다. 해가 지고 달이 떠올랐지요. 나무 사이가 점점 어두워졌습니다. 그런데 앞쪽이 어쩐지 환했지요. 나뭇가지를 헤치자 커다란 호수가 나타났습니다.〕 |

## 2장 · 호수의 백조들

| 파일명 | 장면 |
|---|---|
| `images/02-lake.webp` | A moonlit forest lake where a flock of white swans glides silently, a prince raising his crossbow among the pines, silver and magical. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 달빛이 호수 위에 가득 내려앉아 있었습니다. 물이 은처럼 반짝였지요. 그 위를 하얀 백조 떼가 미끄러지고 있었습니다. 소리 하나 나지 않았지요. 왕자는 숨을 죽이고 바라보았습니다. 이렇게 고운 광경은 처음이었지요. / 오른쪽: 왕자는 저도 모르게 활을 들었습니다. 시위를 팽팽히 당겼지요. 그런데 바로 그 순간이었습니다. 백조 한 마리가 물가로 올라섰지요. 그러더니 깃털이 스르르 벗겨졌습니다. 왕자는 활을 툭 떨어뜨렸지요. 시위가 붕 하고 울었습니다.〕 |
| `images/02-lake-2.webp` | A swan stepping ashore and transforming into a girl in a white feathered dress with a small crown as a startled prince drops his crossbow, magical. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 백조가 있던 자리에 아가씨가 서 있었습니다. 하얀 깃털 옷을 입고 있었지요. 머리에는 작은 관을 쓰고 있었습니다. 아가씨가 두 손을 내밀었지요. 쏘지 마세요. / 오른쪽: 왕자는 활을 툭 떨어뜨렸습니다. 입이 다물어지지 않았지요. 당신은…… 누구십니까? 아가씨는 잠시 말이 없었습니다.〕 |

## 3장 · 오데트의 사연

| 파일명 | 장면 |
|---|---|
| `images/03-odette.webp` | A lakeside at night where a girl in white tells her story to a kneeling prince, other swans watching from the water, tender and hushed. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 제 이름은 오데트입니다. 저 백조들은 모두 제 친구들이지요. 로트바르트라는 자가 마법을 걸었어요. / 오른쪽: 왕자는 가슴이 먹먹해졌습니다. 마법을 푸는 길은 없습니까? 오데트가 고개를 들었지요.〕 |
| `images/03-odette-2.webp` | A prince clasping a swan-girl's hands at a moonlit lakeside while a vast dark winged shadow passes over the pines behind them, tender and ominous. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 왕자는 오데트의 손을 잡았습니다. 제가 그 사람이 되겠습니다. 내일 밤 궁궐에서 무도회가 열립니다. / 오른쪽: 정말 그래 주시겠어요? 그때 숲 위로 검은 그림자가 스쳤습니다. 커다란 날개 소리가 났지요. 오데트는 화들짝 놀라 물러섰습니다.〕 |

## 4장 · 검은 옷의 아가씨

| 파일명 | 장면 |
|---|---|
| `images/04-ball.webp` | A grand candlelit ballroom where princesses curtsey in turn while a distracted prince watches the doorway and his mother frowns, glittering and festive. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이튿날 저녁이 되었습니다. 궁궐 무도회장이 촛불로 환했지요. 악사들이 자리를 잡았습니다. 여러 나라의 아가씨들이 차례로 인사했지요. 저마다 곱게 차려입고 있었습니다. / 오른쪽: 오데트가 오기만 기다렸습니다. 어머니가 눈살을 찌푸렸지요. 어서 한 사람을 고르지 않고. 왕자는 대답하지 않았습니다.〕 |
| `images/04-ball-2.webp` | A girl in a black gown entering a ballroom with a tall dark-cloaked figure behind her, a joyful prince rushing to dance with her, dramatic and glittering. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 검은 옷을 입은 아가씨가 들어섰습니다. 뒤에는 검은 망토를 두른 사람이 서 있었지요. 아가씨의 얼굴을 보고 왕자는 벌떡 일어났습니다. 오데트와 똑같은 얼굴이었거든요. 오데트! 와 주셨군요! / 오른쪽: 하지만 왕자는 알아채지 못했습니다. 두 사람은 손을 잡고 춤을 추었지요. 악사들이 빠른 곡을 켰습니다. 검은 옷자락이 빙글빙글 돌았지요. 사람들이 손뼉을 치며 둘러섰습니다. 검은 망토를 두른 사람만 웃지 않았지요.〕 |

## 5장 · 창밖의 백조

| 파일명 | 장면 |
|---|---|
| `images/05-window.webp` | A hushed ballroom where a prince raises his hand and announces his betrothal to a girl in black while a dark-cloaked figure laughs behind them, dramatic. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 왕자는 밤이 깊도록 춤을 추었습니다. 다른 아가씨는 눈에 들어오지도 않았지요. 이윽고 왕자가 손을 들었습니다. 악사들이 연주를 멈췄지요. 무도회장이 조용해졌습니다. 사람들이 왕자를 쳐다보았지요. / 오른쪽: 왕자는 큰 소리로 말했지요. 모두 들으십시오. 저는 이분과 혼인하겠습니다!〕 |
| `images/05-window-2.webp` | A white swan-girl pressing against a tall ballroom window in anguish as guests turn, the prince ashen-faced and the black-gowned girl gone, powerful contrast. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그 순간 창밖에서 흰 그림자가 스쳤습니다. 사람들이 일제히 창을 보았지요. 유리창에 오데트가 매달려 있었습니다. 두 손으로 창을 두드리고 있었지요. 얼굴이 눈물에 젖어 있었습니다. 왕자의 얼굴이 하얗게 질렸지요. 검은 옷 아가씨를 돌아보았습니다. 그 자리에는 아무도 없었지요. / 오른쪽: 검은 망토도 함께 사라졌습니다. 내가…… 내가 무슨 짓을 한 거지. 왕자는 그 자리에 주저앉을 뻔했지요. 창밖에서는 날갯짓 소리가 났습니다.〕 |

## 6장 · 속은 왕자

| 파일명 | 장면 |
|---|---|
| `images/06-return.webp` | A prince running through dark pines toward a moonlit lake where swan-girls gather, one sitting with bowed head on a rock, urgent and moving. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 왕자는 무도회장을 뛰쳐나갔습니다. 어머니가 부르는 소리도 듣지 못했지요. 궁궐 문을 지나 숲길로 들어섰습니다. 나뭇가지가 얼굴을 때렸지요. 왕자는 달리고 또 달렸습니다. 숨이 턱까지 차올랐지요. 이윽고 호숫가에 이르렀습니다. / 오른쪽: 백조들이 물가에 모여 있었지요. 오데트는 바위에 앉아 고개를 숙이고 있었습니다. 왕자는 조심조심 다가갔지요. 발소리에 오데트가 어깨를 움츠렸습니다. 그래도 고개는 들지 않았지요. 미안합니다. 제가 속았습니다.〕 |
| `images/06-return-2.webp` | A swan-girl looking up in sorrow at a lakeside as wind stirs the water and a vast dark winged shape spreads above the trees, dramatic. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 오데트가 천천히 고개를 들었습니다. 알고 있어요. 그자가 제 얼굴을 딸에게 씌운 거예요. / 오른쪽: 왕자는 숨이 턱 막혔습니다. 그때 호수에 바람이 일었지요. 물결이 크게 출렁였습니다. 숲 위로 검은 날개가 크게 펼쳐졌지요.〕 |

## 7장 · 마주 선 밤

| 파일명 | 장면 |
|---|---|
| `images/07-confront.webp` | A storm-tossed lakeside where a prince steps in front of a swan-girl to face a towering dark-winged figure, feathers and wind swirling, dramatic. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 로트바르트가 두 사람 사이를 가로막았습니다. 검은 깃털이 사방으로 흩날렸지요. 바람이 세게 몰아쳤습니다. 백조들이 놀라 물 위를 맴돌았지요. 물결이 사납게 일었습니다. 달빛이 조각조각 부서졌지요. 이제 그만 돌아가라, 왕자. / 오른쪽: 왕자는 물러서지 않았습니다. 오히려 오데트의 앞을 막아섰지요. 저는 속았습니다. 하지만 한 번 실수했다고요.〕 |
| `images/07-confront-2.webp` | A prince and a swan-girl standing hand in hand with swans gathered around them as a dark-winged figure breaks apart into feathers and mist, dawn breaking. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 오데트가 왕자의 곁으로 다가왔습니다. 그러고는 나란히 섰지요. 두 사람은 손을 맞잡았습니다. 백조들도 물가로 올라와 둘러섰지요. 모두 로트바르트를 마주 보았습니다. 검은 날개가 흔들리기 시작했지요. 깃털이 하나둘 떨어졌습니다. 로트바르트가 소리를 질렀지요. / 오른쪽: 하지만 그 소리는 점점 작아졌습니다. 잡으려 뻗은 손이 허공을 저었지요. 동쪽 하늘이 조금씩 밝아 왔습니다. 이윽고 새벽바람이 불어왔지요.〕 |

## 8장 · 아침 호수

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | A golden sunrise over a calm lake where feathers fall away from swans and young women walk ashore embracing each other, radiant and joyful. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 동쪽 하늘이 붉어졌습니다. 해가 천천히 떠올랐지요. 호수가 금빛으로 물들었습니다. 왕자는 오데트를 돌아보았지요. 이제 곧 백조가 될 시간이었습니다. / 오른쪽: 오데트는 그대로 사람이었습니다. 백조들의 깃털도 하나둘 벗겨졌지요. 아가씨들이 물가로 걸어 나왔습니다. 서로를 얼싸안고 웃었지요. 마법이 풀린 것이었습니다. 왕자의 마음이 거짓이 아니었으니까요.〕 |
| `images/08-ending-2.webp` | A prince and a girl standing together at a sunlit lake edge as mist clears and other young women set off home, distant castle bells, peaceful and radiant. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 오데트가 제 손을 내려다보았습니다. 햇빛이 손등에 따뜻하게 닿았지요. 이제 아침이 무섭지 않네요. 왕자가 그 손을 가만히 잡았습니다. / 오른쪽: 가슴이 벅차서 말이 나오지 않았거든요. 두 사람은 나란히 물가에 섰습니다. 호수 위로 아침 안개가 걷혔지요. 아가씨들은 저마다 집을 찾아 떠났지요. 왕자와 오데트는 마지막까지 남았습니다. 두 사람은 아침 호수를 오래도록 바라보았답니다.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
