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
Children's picture book illustration, classic 1970s-80s World Masterpiece Theater (세계명작극장) 2D cel animation style,
bold clean outlines, saturated storybook colors, flat cel shading with warm soft lighting,
ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles,
European fairytale settings (French port town stone houses, rustic country cottage with brick fireplace, snow-covered forest, enchanted gothic castle with rose gardens),
very expressive comic cartoon faces, cute proportions, humorous and heartwarming acting,
ABSOLUTELY NO REALISTIC PHOTOREALISM, NO 3D CGI RENDER, NO HANDSOME 8-HEAD-TALL ROMANCE NOVEL MANHWA.
CRITICAL MANDATE: ABSOLUTELY NO REALISTIC LION, NO NATIONAL GEOGRAPHIC SAFARI ANIMAL DOCUMENTARY!
The Beast MUST be a 100% charming, whimsical, funny, and lovable 2D cartoon fairytale creature!
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
[CHARACTERS - 02-rose.webp 기준 완벽 일치]
- 벨 (Belle): Exact design from 02-rose.webp. A sweet, humble young girl (around 12-14 years old), dark brown hair braided in neat twin braids with small red ribbon ties, sweet innocent round face with big expressive cartoon eyes. Wears a forest-green dress with white pinafore apron (or warm deep-blue hooded cloak when traveling in the snow). Loves books, courageous and gentle.
- 야수 (The Beast): A pure 2D cartoon fairytale character! (NEVER a realistic documentary lion!). An oversized, clumsy, fluffy bear-lion magical creature with cute rounded horns, warm golden-brown fur, a comical fluffy mane, and big, gentle, expressive cartoon puppy-dog eyes! Very human-like comic acting (shy, flustered, awkward, tenderhearted, holding a tiny teacup delicately). Wears a royal blue velvet coat with gold embroidery and white lace cravat.
- 아버지 (The Merchant Father): Exact design from 02-rose.webp. Dapper European gentleman wearing a brown fedora hat, neatly trimmed grey beard and moustache, kind smiling eyes, warm brown trench overcoat with a leather crossbody messenger bag.
- 두 언니 (The Two Elder Sisters): Exact design from 02-rose.webp. Older sister 1: wine-red hair with pink hair ribbon, wearing a frilly pink rococo dress. Older sister 2: wavy ginger-orange hair with blue hair ribbon, wearing a frilly sky-blue rococo dress. Comical, vain, overdramatic cartoon expressions.
- 변신이 풀린 왕자 (The Transformed Prince): A humble, sweet-faced young boy prince (around 13-15 years old, NOT an 8-head tall adult romance model!). Round friendly face, wavy brown hair, warm gentle eyes identical to the Beast's kind eyes, humble grateful smile. Wears a handsome blue royal tunic with gold trim.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a single red rose under a glass dome on a stone table in a grand candlelit hall, a large shaggy silhouette in the shadows behind and a girl in a blue cloak at the doorway, warm and mysterious, never scary. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 장사꾼의 세 딸

| 파일명 | 장면 |
|---|---|
| `images/01-family.webp` | A fine merchant house where two showily dressed sisters admire themselves before a mirror while a plain-dressed girl reads by the window, warm domestic light, comic contrast. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 옛날 어느 항구 도시에 큰 장사꾼이 살았습니다. 배를 여러 척 가진 부자였지요. 그에게는 딸이 셋 있었습니다. 집에는 늘 손님이 드나들었지요. 위의 두 딸은 옷이며 보석 이야기만 했습니다. 거울 앞을 떠나는 일이 없었지요. / 오른쪽: 막내는 이름이 벨이었습니다. 벨은 늘 책을 끼고 살았지요. 언니들은 벨을 답답해했습니다. 책만 봐서 뭐 하니. 그러다 시집도 못 간다.〕 |
| `images/01-family-2.webp` | A modest country cottage where two sisters wail over lost finery while a plain-dressed girl calmly kneads bread at the hearth and their father watches, warm firelight, tender. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그러던 어느 해였습니다. 아버지의 배가 폭풍을 만나 모두 가라앉았습니다. 창고에 쌓아 둔 물건도 남지 않았지요. 큰 집을 팔고 시골로 옮겨 가야 했습니다. 식구들은 낡은 오두막에 짐을 풀었지요. 두 언니는 방바닥에 주저앉아 울었습니다. / 오른쪽: 방이 하나뿐이라 셋이 나란히 누워야 했지요. 우린 이제 어떻게 살아요! 벨만은 아무 말 없이 소매를 걷어붙였지요. 아궁이에 불을 지피고 빵을 구웠습니다.〕 |

## 2장 · 아버지의 선물

| 파일명 | 장면 |
|---|---|
| `images/02-rose.webp` | A cottage doorway where a father in a travelling coat is besieged by two sisters demanding silks and pearls while the youngest asks only for a single rose, morning light. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 몇 해가 지난 어느 날이었습니다. 아버지에게 소식이 하나 왔습니다. 가라앉은 줄 알았던 배 한 척이 돌아왔다는 것이었지요. 아버지는 그 배를 찾으러 먼 길을 떠나게 되었습니다. 잘하면 다시 일어설 수 있을 것 같았지요. 두 언니는 아버지 소매를 붙잡고 졸랐습니다. / 오른쪽: 저는 비단옷이요! 저는 진주 목걸이요! 아버지가 막내를 돌아보았습니다.〕 |
| `images/02-rose-2.webp` | A snowbound forest road at night where a lost traveller leads his horse toward the gates of a vast castle, and inside a warm hall with a laid table and no one present, eerie but inviting. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그런데 항구에 가 보니 배는 이미 남의 손에 넘어간 뒤였습니다. 아버지는 빈손으로 돌아서야 했지요. 돌아오는 길에 그만 눈보라가 몰아쳤습니다. 길이 보이지 않았지요. 말을 이끌고 헤매던 아버지 앞에 커다란 문이 나타났습니다. 문이 저절로 스르르 열렸지요. / 오른쪽: 아주 큰 성이었지요. 안으로 들어가 보니 사람이 하나도 없었습니다. 발소리가 복도에 울렸지요. 그런데 난롯불이 타고 있고 밥상이 차려져 있었지요. 아버지는 배가 고파 밥을 먹고 그날 밤 그곳에서 잤습니다. 아침이 될 때까지 아무도 나타나지 않았지요. 촛불만 밤새 조용히 타올랐습니다.〕 |

## 3장 · 등 뒤의 목소리

| 파일명 | 장면 |
|---|---|
| `images/03-plucked.webp` | A snowy castle garden where roses bloom impossibly in the cold, a traveller freezing mid-reach as a huge shaggy horned figure looms in the archway behind, dramatic but not gory. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이튿날 아침이었습니다. 아버지는 성의 뜰을 지나가다 걸음을 멈췄습니다. 눈이 소복이 쌓인 뜰에 붉은 장미가 활짝 피어 있었거든요. 한겨울인데 어찌 된 일인지 알 수 없었지요. 향기가 뜰 가득 퍼져 있었지요. 아버지는 홀린 듯 장미 앞으로 다가갔습니다. / 오른쪽: 눈 위에 붉은 꽃잎이 몇 장 떨어져 있었습니다. 아버지는 벨의 부탁이 떠올랐습니다. 아, 벨이 바란 게 이거였지.〕 |
| `images/03-plucked-2.webp` | A shaggy horned figure in a velvet coat speaking sternly to a kneeling traveller in a snowy rose garden, and then the man riding home with a single rose held to his chest, sombre. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 돌아보니 털이 북슬북슬한 커다란 짐승이 서 있었습니다. 아버지는 그 자리에 주저앉고 말았습니다. 살려 주십시오. 막내딸이 부탁한 꽃이라 그만……. / 오른쪽: 딸이 오지 않으면 네가 돌아와야 한다. 아버지는 장미를 품에 안고 집으로 돌아왔습니다. 가는 내내 발이 무거웠지요. 딸에게 무슨 말을 해야 할지 알 수 없었습니다. 문을 열자 벨이 달려 나왔습니다. 아버지는 차마 딸의 얼굴을 보지 못했지요.〕 |

## 4장 · 벨이 나서다

| 파일명 | 장면 |
|---|---|
| `images/04-belle.webp` | A cottage room where a father confesses, two sisters point accusingly, and a girl in a blue cloak quietly takes down her coat, a single rose lying on the table, tense and moving. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아버지는 있었던 일을 하나도 빼놓지 않고 털어놓았습니다. 방 안이 조용해졌습니다. 두 언니가 먼저 입을 열었지요. / 오른쪽: 벨은 아무 대꾸도 하지 않았습니다. 그저 아버지 손에 들린 장미를 오래 보았지요. 그러고는 조용히 외투를 걸쳤습니다. 제가 가겠어요. 아버지가 자리에서 벌떡 일어났습니다. 손에 든 지팡이가 바닥에 떨어졌지요.〕 |
| `images/04-belle-2.webp` | A snowy road at dawn where a father and a girl in a blue cloak walk to a vast castle gate that opens by itself, the girl smiling and going in alone, resolute and sad. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 안 된다! 약속은 내가 했으니 내가 가야지. 아버지, 그 꽃을 부탁한 건 저예요. 벨의 목소리는 떨리지 않았습니다. / 오른쪽: 커다란 문이 소리 없이 열렸습니다. 안에서 따뜻한 바람이 흘러나왔지요. 아버지는 딸의 손을 놓지 못했습니다. 손이 자꾸 떨렸습니다. 돌아가세요. 저는 괜찮아요.〕 |

## 5장 · 성에서의 나날

| 파일명 | 장면 |
|---|---|
| `images/05-castle.webp` | A vast castle library with shelves to the ceiling, a fire lit by itself and a window seat, a girl in a blue cloak standing amazed in the doorway, golden light, wondrous. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 벨은 성에서 뜻밖의 대접을 받았습니다. 방문에 이런 글씨가 붙어 있었지요. 벨의 방. 문을 열자 벽을 가득 채운 책이 나타났습니다. 천장까지 닿는 책장이 죽 늘어서 있었지요. 벨은 저도 모르게 소리를 냈습니다. / 오른쪽: 세상에, 이렇게 많은 책은 처음 봐. 창가에는 푹신한 자리가 놓여 있었습니다. 난롯불도 알아서 타올랐지요. 누가 시중드는지는 끝내 보이지 않았습니다. 벨은 그날 밤 책을 읽다가 잠이 들었지요. 무섭던 마음이 조금 가라앉았습니다.〕 |
| `images/05-castle-2.webp` | A candlelit dining hall where a large shaggy figure sits awkwardly on a too-small chair listening to a girl talk about her book, both relaxed and smiling, warm and gentle. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 야수는 저녁마다 밥상에 나타났습니다. 처음에는 벨도 말을 제대로 붙이지 못했지요. 커다란 몸이 작은 의자에 겨우 앉아 있었습니다. 야수도 무슨 말을 할지 몰라 헛기침만 했습니다. 포크가 손에서 자꾸 미끄러졌지요. 오늘…… 그 책은 재미있었습니까? / 오른쪽: 네. 다 읽으면 이야기해 드릴게요. 그렇게 하루가 가고 이틀이 갔습니다. 어느새 두 사람은 밤늦도록 이야기를 나누었지요. 야수는 벨이 웃으면 따라 웃었습니다. 벨은 야수의 눈이 참 슬프다고 생각했습니다. 무서운 얼굴 속에 다른 것이 들어 있는 듯했지요.〕 |

## 6장 · 거울 속의 집

| 파일명 | 장면 |
|---|---|
| `images/06-mirror.webp` | A candlelit room where a girl gazes into a hand mirror showing a sick old man in a distant cottage, her face falling, rich tapestries around, tender and sad. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 어느 날 벨은 방에서 손거울을 하나 찾았습니다. 보고 싶은 곳을 떠올리면 그곳이 비치는 거울이었지요. 벨은 집을 떠올려 보았습니다. 거울에 오두막 방 안이 나타났지요. 아버지가 자리에 누워 앓고 있었습니다. 이불이 반쯤 흘러내려 있었지요. 얼굴이 몹시 여위어 있었지요. / 오른쪽: 벨은 거울을 든 채 한참을 서 있었습니다. 언니들이 아버지 곁을 지키지 않는 것도 보였지요. 아궁이에는 불도 꺼져 있었습니다. 그날 저녁 벨은 야수에게 사정을 말했습니다. 밥상 앞에서 수저를 들지 못했지요. 아버지가 편찮으세요. 벨의 목소리가 잠겼습니다.〕 |
| `images/06-mirror-2.webp` | A large shaggy figure with bowed head giving a mirror and a ring to a girl, and then the same girl appearing in a snowy cottage yard as her father rises from his sickbed, moving. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 야수는 한참 고개를 숙이고 있었습니다. 커다란 손이 조금 떨렸지요. 다녀오십시오. 다만 이레 안에는 돌아와 주십시오. / 오른쪽: 벨은 야수의 눈을 똑바로 보고 말했습니다. 야수는 벨에게 거울과 반지를 주었습니다. 반지를 돌리면 어디로든 갈 수 있다고 했지요. 이튿날 아침 벨은 오두막 마당에 서 있었습니다.〕 |

## 7장 · 늦어 버린 날

| 파일명 | 장면 |
|---|---|
| `images/07-late.webp` | A cottage where a recovering father sits by the fire with his daughter tending him, while two sisters eye her fine dress and ring with envy and cling to her sleeves. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아버지는 벨을 보자 눈에 띄게 기운을 차렸습니다. 며칠 만에 자리에서 일어나 마당까지 나왔지요. 벨은 아버지 곁에서 죽을 끓이고 약을 달였습니다. 집 안에 오랜만에 웃음소리가 났습니다. 아버지는 벨의 손을 놓지 않으려 했지요. 마당에 볕이 잘 드는 날이 이어졌습니다. / 오른쪽: 그런데 두 언니는 속이 편치 않았습니다. 벨의 반지와 옷차림이 자꾸 눈에 밟혔거든요. 조금만 더 있다 가. 며칠쯤 어때서. 언니들은 날마다 벨의 소매를 붙잡았습니다. 벨도 아버지 곁이 좋아 하루하루 미루었지요. 이레가 지난 것도 몰랐습니다.〕 |
| `images/07-late-2.webp` | A girl waking in terror from a dream, checking a mirror that shows a fallen shaggy figure in a snowy rose garden, then turning a ring and appearing in that garden, urgent. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그러다 여드레째 되던 밤이었습니다. 벨은 꿈을 꾸었습니다. 성의 장미밭에 야수가 쓰러져 있는 꿈이었지요. 부르는 소리도 들리는 듯했습니다. / 오른쪽: 벨은 거울을 들여다보았습니다. 손이 덜덜 떨렸지요. 거울 속에 야수가 쓰러져 있었습니다. 벨은 얼른 반지를 돌렸지요. 눈을 뜨니 성의 뜰이었습니다. 벨은 장미밭으로 달려갔습니다. 심장이 터질 것 같았지요. 맨발인 것도 몰랐습니다.〕 |

## 8장 · 성으로 돌아가다

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | A snowy castle rose garden at dawn where a girl cradles a fallen shaggy figure and weeps, roses bright against the snow, deeply moving but never grim. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 야수는 장미 덤불 아래에 쓰러져 있었습니다. 숨소리가 아주 작았지요. 벨은 달려가 야수를 끌어안았습니다. 미안해요. 제가 너무 늦었어요. 야수가 겨우 눈을 떴습니다. 목소리가 바람 소리처럼 작았지요. 털에 서리가 하얗게 앉아 있었습니다. / 오른쪽: 이제 아무 데도 안 갈게요. 벨은 야수의 손을 두 손으로 감쌌습니다. 저는 여기가 제 집이에요. 당신 곁에 있을게요.〕 |
| `images/08-ending-2.webp` | A rose garden bursting with light as a shaggy figure becomes a young man, castle windows lighting up and servants appearing, the girl beside him radiant, joyous. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그 말이 끝나자 뜰에 빛이 쏟아졌습니다. 눈이 부셔 앞이 보이지 않았지요. 빛이 걷히고 벨은 눈을 떴습니다. 야수가 있던 자리에 젊은이가 앉아 있었습니다. 그런데 그 눈이 낯익었지요. 저녁마다 마주 앉던 그 슬픈 눈이었습니다. / 오른쪽: 겉모습만 보지 않는 사람을 만나야 풀리는 마법이었지요. 성의 창마다 불이 켜지고 사람들이 나타났습니다. 오래 멈춰 있던 성이 한꺼번에 깨어난 것이었지요. 벨은 아버지와 언니들을 성으로 불러왔습니다. 두 사람은 그 뜰에서 오래오래 함께 살았답니다.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
