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
bold clean outlines, saturated storybook colors, warm rooftop-garden golds
against icy blues and green auroras, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), two attic
windows joined by a rose box, a snowy town square, a summer garden, a robbers'
hall, and a vast palace of ice, expressive faces, wide panoramic composition,
beautiful and never frightening.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Gerda: a small girl with brown braids and a red cloak, stubborn and warm. Kai:
a boy her age with fair hair, cheerful at first and cold-faced later. The
grandmother: an old woman with spectacles who tells stories. The snow queen: a
tall pale woman in white furs, drawn as remote and beautiful rather than wicked.
The robber girl: a fierce dark-haired girl with a knife and a pet reindeer. The
reindeer: a shaggy grey reindeer with kind eyes.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a girl in a red cloak and bare feet walking across a vast frozen plain toward a distant palace of ice, the northern lights arching green and violet above her, tiny and determined, beautiful and cold. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 창가의 장미

| 파일명 | 장면 |
|---|---|
| `images/01-roses.webp` | Two attic windows facing each other across a narrow gap joined by a window box of climbing roses, two children playing beneath, warm rooftop light over a huddled town, charming. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 한 도시의 지붕 밑에 아이 둘이 살았습니다. 게르다와 카이였지요. 두 집이 나란히 붙어 있어 다락 창문이 서로 마주 보았습니다. 두 아이는 창 사이에 나무 상자를 놓고 거기에 장미를 심었지요. 장미는 해마다 잘 피었습니다. 두 아이는 그 아래에 앉아 놀았지요. 겨울이면 창유리에 성에가 하얗게 꼈습니다. / 오른쪽: 동전을 대 보자. 난로에 데운 동전을 유리에 붙이면 동그란 구멍이 뽕 뚫렸지요. 두 아이는 그 구멍으로 서로를 들여다보며 웃었습니다. 저녁이면 할머니가 이야기를 들려주었지요. 두 아이는 할머니 무릎 옆에 나란히 앉았습니다.〕 |
| `images/01-roses-2.webp` | A cosy attic where a spectacled grandmother tells a story by the stove, and a snowflake at the frosted window growing into the shape of a tall pale woman in white furs, eerie but beautiful. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 눈의 여왕 이야기를 아니? 할머니가 창밖을 가리켰습니다. 눈송이가 벌 떼처럼 몰려올 때가 있어. / 오른쪽: 오면 난롯불에 녹여 버릴 거예요. 그날 밤 눈이 세차게 몰아쳤습니다. 바람이 창틀을 덜컹덜컹 흔들었지요. 창유리에 무언가 톡 닿았지요. 아주 커다란 눈송이였습니다. 그 눈송이가 점점 자라나더니 흰옷을 입은 여인의 모습이 되었지요.〕 |

## 2장 · 눈에 박힌 조각

| 파일명 | 장면 |
|---|---|
| `images/02-shard.webp` | A shattering mirror scattering glittering dust across a wide sky, and a rooftop garden where a boy claps a hand to his eye as a girl peers at him anxiously, summer roses around, striking. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아주 오래전 일이었습니다. 못된 요술쟁이가 거울을 하나 만들었지요. 무엇이든 밉게 비추는 거울이었습니다. 고운 것도 흉하게만 보였지요. 그런데 그 거울이 그만 쨍그랑 깨졌습니다. 가루가 바람을 타고 온 세상에 흩어졌지요. 그 가루가 눈에 들어가면 세상이 온통 밉게 보인답니다. / 오른쪽: 어느 여름날이었지요. 카이가 갑자기 소리쳤습니다. 앗, 눈에 뭐가 들어갔어!〕 |
| `images/02-shard-2.webp` | A rooftop garden where a boy kicks over a rose box sneering while a girl stands hurt beside it, and the same boy running off with older children into falling snow, sad and cold. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그날부터 카이가 달라졌습니다. 늘 좋아하던 장미를 보고 인상을 썼지요. 벌레 먹었잖아. 못생겼어. 카이는 상자를 발로 걷어찼습니다. 할머니 이야기도 코웃음을 쳤지요. / 오른쪽: 게르다에게도 차갑게 굴었습니다. 너는 왜 그렇게 유치하니? 게르다는 울음을 꾹 참았지요. 장미 상자는 그대로 마당에 나뒹굴었습니다.〕 |

## 3장 · 사라진 카이

| 파일명 | 장면 |
|---|---|
| `images/03-sleigh.webp` | A snowy town square where children hitch their sleds to passing carts, and a pure white sleigh sweeping in and out through the gate with one boy towed helplessly behind, thrilling. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 겨울 광장이었습니다. 아이들이 썰매를 타고 놀았지요. 지나가는 마차에 몰래 줄을 걸고 끌려다니는 놀이였습니다. 그때 하얀 썰매 한 대가 광장으로 들어왔지요. 눈처럼 희고 커다란 썰매였습니다. 저건 처음 보는데! / 오른쪽: 카이가 얼른 제 썰매 줄을 거기에 걸었지요. 썰매는 광장을 두 바퀴 천천히 돌았습니다. 그러더니 갑자기 성문 밖으로 내달렸지요. 눈보라가 얼굴을 때렸습니다. 카이는 줄을 풀려고 했지만 손이 얼어붙어 꿈쩍도 하지 않았지요.〕 |
| `images/03-sleigh-2.webp` | A snowy plain where a tall pale woman in white furs steps from a sleigh and kisses a boy's forehead, frost spreading over him, the sleigh then racing north under a wide grey sky, beautiful and chilling. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 넓은 들판을 한참 지나서야 썰매가 멈췄습니다. 흰옷을 입은 여인이 천천히 내렸지요. 눈이 부시게 아름다웠지만 어쩐지 서늘했습니다. 입김조차 나오지 않는 얼굴이었지요. 춥지 않니? / 오른쪽: 여인이 한 번 더 입을 맞추자 카이는 게르다를 잊었지요. 할머니도, 다락방도, 장미도 모두 잊었습니다. 게르다라는 이름조차 떠오르지 않았지요. 이제 아무것도 안 무섭지? 네, 하나도요.〕 |

## 4장 · 게르다가 길을 나서다

| 파일명 | 장면 |
|---|---|
| `images/04-journey.webp` | A spring riverbank where a small girl in a red cloak throws her new red shoes into the water asking after her friend, and the shoes drifting back to her feet, hopeful and tender. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 카이는 돌아오지 않았습니다. 겨울이 다 가도록요. 사람들이 고개를 저으며 말했지요. / 오른쪽: 봄이 오자 게르다는 길을 나섰지요. 새로 얻은 빨간 구두를 신고 강가로 갔습니다. 강아, 우리 카이를 아니? 게르다는 구두를 벗어 강물에 던졌지요.〕 |
| `images/04-journey-2.webp` | A boat drifting downriver to a garden full of flowers where an old woman welcomes a girl, and later a single rose blooming through the soil as the girl remembers with a start, dreamlike. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 게르다는 강가에 매인 배에 올랐습니다. 밧줄이 스르르 풀리더니 강물이 배를 실어 갔지요. 배는 한참을 흘러 꽃이 가득한 뜰에 닿았습니다. 한 할머니가 지팡이를 짚고 나왔지요. 어서 오렴, 예쁜 아이야. / 오른쪽: 날마다 맛있는 것을 내주었지요. 그러면서 뜰에 핀 장미는 죄다 감췄습니다. 게르다가 카이를 떠올릴까 봐서요. 그런데 어느 날 담 밑에서 장미 한 송이가 피어났지요. 게르다는 그것을 보고 카이를 기억해 냈습니다. 내가 여기서 뭘 하고 있었지!〕 |

## 5장 · 도둑 소녀

| 파일명 | 장면 |
|---|---|
| `images/05-robber.webp` | A dark forest road where robbers surround a carriage and a fierce dark-haired girl with a knife claims the small traveller for herself, torchlight and shadows, tense but not cruel. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 게르다는 그 길로 다시 떠났습니다. 이내 어두운 숲길로 접어들었지요. 그때 까마귀 한 마리가 나뭇가지에서 내려왔습니다. 북쪽으로 간 아이를 봤어. / 오른쪽: 뭐가 있나 보자! 도둑들이 우르르 몰려들었습니다. 그때 한 아이가 앞으로 나섰지요. 도둑 두목의 딸이었습니다.〕 |
| `images/05-robber-2.webp` | A robbers' hall where a girl sleeps among caged doves and a tethered reindeer as another girl listens to her story, and at dawn cutting the reindeer's rope, warm and surprising. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 방에는 짐승이 잔뜩 있었습니다. 비둘기도 있고 순록도 한 마리 있었지요. 밤에 내 이야기를 들려줘. 게르다는 카이 이야기를 들려주었습니다. / 오른쪽: 눈의 여왕 썰매에 앉아 있었어요. 북쪽 라플란드로 갔지요. 구석에 매여 있던 순록이 고개를 번쩍 들었습니다.〕 |

## 6장 · 북쪽 끝으로

| 파일명 | 장면 |
|---|---|
| `images/06-reindeer.webp` | A reindeer bounding away from a robbers' camp with a small girl on its back, a fierce girl waving a scarf behind, and then a vast treeless snowfield under dancing green and violet auroras, breathtaking. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이 아이를 라플란드까지 데려다줘. 도둑 소녀가 순록에게 말했습니다. 그러고는 게르다에게 제 장화를 신겨 주었지요. 빵과 고기도 한 덩이씩 챙겨 주었습니다. 내 이불은 못 준다. / 오른쪽: 순록이 달리기 시작했습니다. 숲을 지나 벌판으로 나갔지요. 나무가 점점 줄어들더니 눈만 끝없이 이어졌습니다. 밤이 되자 하늘이 춤을 추었지요. 초록빛과 보랏빛이 너울너울 흘렀습니다. 게르다는 순록의 목을 꼭 끌어안았습니다.〕 |
| `images/06-reindeer-2.webp` | A tiny turf hut on the tundra where a wise woman speaks to a reindeer and a small girl, and then the reindeer racing on toward a distant glimmering palace of ice, hopeful and vast. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 가는 길에 오두막 두 곳에 들렀습니다. 라플란드 아주머니와 핀란드 아주머니였지요. 순록이 숨을 몰아쉬며 부탁했습니다. 이 아이에게 힘을 좀 주세요. 열 사람 몫의 힘이면 좋겠어요. / 오른쪽: 이 아이는 이미 힘이 있어. 맨발로 여기까지 왔잖니. 그게 무엇보다 센 힘이지.〕 |

## 7장 · 얼음 궁전

| 파일명 | 장면 |
|---|---|
| `images/07-ice-palace.webp` | A vast empty palace of ice with soundless halls where a small girl walks alone, and in the great hall a frozen lake with a pale boy sitting on it arranging shards of ice, stark and beautiful. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 순록이 궁전 앞에 게르다를 내려 주었습니다. 여기부터는 혼자 가야 해. 게르다는 홀로 걸어 들어갔지요. 바람이 칼처럼 얼굴을 스쳤습니다. 발밑에서 눈이 뽀드득뽀드득 소리를 냈지요. / 오른쪽: 방마다 얼음뿐이었지요. 발소리 말고는 아무 소리도 나지 않았습니다. 숨을 내쉬면 하얀 김이 천장까지 올라갔지요. 가장 큰 홀 한가운데에 얼어붙은 호수가 있었지요. 그 위에 카이가 혼자 앉아 있었습니다. 얼음 조각을 이리저리 맞추면서요.〕 |
| `images/07-ice-palace-2.webp` | A frozen hall where a girl throws her arms around a pale boy and her tears fall on his chest, ice melting and colour returning to his face as he blinks awake, deeply moving. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 카이야! 게르다가 소리쳐 불렀지만 카이는 돌아보지 않았습니다. 게르다는 달려가 카이를 와락 끌어안았지요. 나야, 게르다야. / 오른쪽: 뜨거운 눈물이 카이의 가슴에 떨어졌습니다. 그러자 가슴에 박혀 있던 얼음 조각이 스르르 녹아내렸지요. 카이의 눈이 깜박였습니다. 게르다… 너 왜 여기 있어?〕 |

## 8장 · 다시 여름

| 파일명 | 장면 |
|---|---|
| `images/08-home.webp` | Two children riding a reindeer south as snow thins into green grass, meeting a taller robber girl on the road, all laughing together, spring light and relief. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 두 아이는 손을 꼭 잡고 궁전을 나왔습니다. 문밖에 순록이 그대로 기다리고 있었지요. 셋은 남쪽을 향해 달렸습니다. 달릴수록 눈이 점점 얇아졌지요. 이윽고 눈 사이로 파릇한 풀이 보이기 시작했습니다. / 오른쪽: 오래 흰 눈만 보다가 초록을 보니 눈이 다 시렸지요. 가는 길에 도둑 소녀도 다시 만났습니다. 전보다 키가 훌쩍 커져 있었지요. 찾았구나! 셋은 마주 보고 한참을 웃었습니다. 까마귀도 다시 만나 돌아가는 길이 짧게 느껴졌지요.〕 |
| `images/08-home-2.webp` | A familiar attic where a grandmother reads by the window as two grown-taller children sit down in their old chairs, the rose box blooming outside in full summer sun, warm and complete. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 드디어 두 아이가 살던 도시에 닿았습니다. 마침 종소리가 뎅뎅 울리고 있었지요. 두 아이는 익숙한 다락 계단을 한 칸씩 올라갔습니다. 계단이 예전처럼 삐걱삐걱 울었지요. 문을 여니 모든 것이 그대로였지요. 할머니가 창가에 앉아 책을 읽고 계셨습니다. / 오른쪽: 창밖 나무 상자에는 장미가 활짝 피어 있었지요. 두 아이는 예전처럼 의자에 나란히 앉았습니다. 그런데 앉고 보니 몸이 훌쩍 커져 있었지요. 우리 많이 컸네.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
