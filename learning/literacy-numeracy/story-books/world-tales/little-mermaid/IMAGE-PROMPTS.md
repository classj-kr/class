# 제미나이 그림 프롬프트

이 책은 하나의 이야기를 8개의 장(챕터)으로 나눠 담았고, 펼침면은 모두
16개예요. 펼침면 하나에 그림이 한 장씩 들어갑니다.
그림이 펼침면 전체 폭을 가득 채우고, 그 아래에 이야기가 왼쪽·오른쪽으로 나뉘어 들어갑니다.

아래 프롬프트를 제미나이에 그대로 넣어서 생성한 뒤, 파일명을 정확히 맞춰서
`images/` 폴더에 저장하면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보여요.)

> **⚠️ 다시 그려 주실 것 (2026-08-28 점검)**
> - `04-witch` — 글에는 **검은 물이 소용돌이치고 해골처럼 생긴 산호가 늘어선** 무서운 길이라 되어 있는데, 그림은 알록달록 예쁜 수정 동굴입니다. 어둡고 으스스하게(다만 무섭지 않게) 다시 그려 주세요.

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
bold clean outlines, saturated storybook colors, luminous underwater blues and
warm harbour golds, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a coral palace deep under
the sea, a storm-tossed ship, a moonlit shore, a witch's dark grotto and a bright
seaside kingdom, expressive faces, wide panoramic composition, beautiful and
never frightening.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
The little mermaid: a young mermaid with long pale hair, a silvery tail and a
curious open face, later a barefoot girl in a simple gown. The sea king: a broad
bearded merman with a crown of shells. The grandmother: an elderly mermaid with
pearls in her hair. The five elder sisters: mermaids of different colours. The
sea witch: a tall figure with drifting dark hair and octopus arms, drawn as
strange and grand rather than horrid. The prince: a young man in a blue coat.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a young mermaid sitting on a rock at the surface of a moonlit sea gazing toward distant harbour lights, her tail catching the moonlight, coral towers glimmering deep below her, beautiful and wistful. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 바닷속 궁전

| 파일명 | 장면 |
|---|---|
| `images/01-palace.webp` | A coral palace deep under a luminous sea where a bearded sea king sits among six mermaid daughters and an elderly mermaid tells stories, fish drifting through the towers, magical and warm. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 바다 깊은 곳에 궁전이 하나 있었습니다. 산호로 지은 궁전이었지요. 바다 임금님이 그곳을 다스렸습니다. 임금님에게는 딸이 여섯 있었지요. 그중 막내가 제일 어렸습니다. 노래는 여섯 중에서 가장 잘했지요. / 오른쪽: 저녁이면 할머니가 이야기를 들려주었습니다. 바다 위 세상 이야기였지요. 거기엔 커다란 배가 다닌단다. 땅에는 나무가 자라고.〕 |
| `images/01-palace-2.webp` | Elder mermaids returning to a coral palace with tales while the youngest listens enviously, and then the same young mermaid rising through blue water toward the shimmering surface, hopeful. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 열다섯 살이 되면 올라가도 된단다. 언니들이 해마다 차례로 물 위에 올라갔지요. 그러고는 돌아와 이야기를 들려주었습니다. 등대가 반짝이더라. / 오른쪽: 그렇게 몇 해가 지나 드디어 막내 차례가 왔습니다. 할머니가 머리를 곱게 매만져 주었지요. 머리에 진주도 꽂아 주었습니다. 조심히 다녀오너라. 막내는 위로, 위로 올라갔지요. 그러고는 물 밖으로 살며시 얼굴을 내밀었습니다.〕 |

## 2장 · 폭풍우 치던 밤

| 파일명 | 장면 |
|---|---|
| `images/02-storm.webp` | A festive ship at night with lanterns and music where a young prince stands at the rail, and the same ship moments later heaving in a rising storm with a mast splitting, dramatic. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 눈앞에 큰 배 한 척이 있었습니다. 뱃전에 등불이 환하게 켜져 있었지요. 갑판에서는 잔치가 한창이었습니다. 음악이 물 위로 흘러왔지요. 사람들 사이에 한 젊은이가 서 있었습니다. 오늘이 그 젊은이의 생일이라고 했지요. / 오른쪽: 인어공주는 눈을 떼지 못했습니다. 그렇게 밤이 깊어 갔지요. 그런데 바람이 갑자기 달라졌습니다. 먹구름이 몰려오고 파도가 배를 번쩍 들어 올렸지요. 우지끈.〕 |
| `images/02-storm-2.webp` | A storm-tossed sea where a mermaid catches a sinking young man and holds his head above the waves through the night, dawn light beginning to break on the horizon, moving and heroic. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 배가 크게 기울었습니다. 사람들이 하나둘 물에 빠졌지요. 인어공주는 눈으로 젊은이를 찾았습니다. 파도 사이로 그 모습이 보였지요. 이미 정신을 잃은 뒤였습니다. 몸이 천천히 가라앉고 있었지요. / 오른쪽: 인어공주가 힘껏 헤엄쳐 갔습니다. 두 팔로 그를 받쳤지요. 그러고는 머리를 물 위로 들어 올렸습니다. 파도가 밤새 사납게 몰아쳤지요. 그래도 인어공주는 손을 놓지 않았습니다. 동이 틀 무렵에야 물결이 잦아들었지요.〕 |

## 3장 · 모래밭에 눕히고

| 파일명 | 장면 |
|---|---|
| `images/03-rescue.webp` | A white beach at sunrise where a mermaid lays a young man on the sand and then hides behind a rock as a girl runs down from a temple, the man waking and looking up at her, bittersweet. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 멀리 흰 모래밭이 보였습니다. 인어공주는 그리로 천천히 헤엄쳤지요. 젊은이를 모래 위에 조심스레 눕혔습니다. 가슴이 오르내리는 것을 보고서야 마음을 놓았지요. 인어공주는 한참을 그 곁에 있었습니다. 그때 멀리서 사람 소리가 났지요. / 오른쪽: 인어공주는 얼른 바위 뒤로 몸을 숨겼습니다. 한 아가씨가 모래밭으로 달려왔지요. 그 소리에 젊은이가 눈을 떴습니다. 그러고는 아가씨를 올려다봤지요. 당신이 저를 구했군요.〕 |
| `images/03-rescue-2.webp` | A coral palace where a listless young mermaid sits apart from her sisters, and then talking earnestly with her grandmother among sea flowers, resolve gathering in her face, quiet and moving. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 인어공주는 아무 말도 하지 못했습니다. 그저 물속으로 돌아왔지요. 그날부터 마음이 이상했습니다. 그렇게 좋아하던 노래도 나오지 않았지요. 언니들이 걱정스레 물었습니다. / 오른쪽: 인어공주는 대답 대신 할머니께 여쭸지요. 사람은 얼마나 사나요? 우리보다 훨씬 짧단다.〕 |

## 4장 · 바다 마녀를 찾아가다

| 파일명 | 장면 |
|---|---|
| `images/04-witch.webp` | A dark swirling trench at the edge of the sea where a young mermaid swims past skeletal corals into a grotto, a tall figure with drifting hair and octopus arms waiting inside, strange and grand. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 바다 끝에 마녀가 살았습니다. 아무도 가지 않는 곳이었지요. 인어공주는 그리로 헤엄쳐 갔습니다. 검은 물이 소용돌이쳤지요. 해골처럼 생긴 산호가 길가에 늘어서 있었습니다. 그래도 인어공주는 멈추지 않았지요. / 오른쪽: 동굴 안에 마녀가 있었습니다. 긴 머리가 물속에서 흐느적거렸지요. 네가 올 줄 알았다. 다리를 갖고 싶은 게지?〕 |
| `images/04-witch-2.webp` | A grotto lit by pale glowing anemones where a sea witch names her price as a young mermaid presses a hand to her own throat, hesitating and then nodding, tense and solemn. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 무엇을 드리면 되나요? 네 목소리를 다오. 바다에서 제일 고운 목소리지. / 오른쪽: 마녀가 한 가지를 더 말했지요. 걸을 때마다 아플 것이다. 칼날 위를 걷는 것처럼.〕 |

## 5장 · 왕자의 곁에서

| 파일명 | 장면 |
|---|---|
| `images/05-legs.webp` | A dawn beach where a mermaid drinks a potion and collapses, waking with two legs on the sand, and a young prince approaching in wonder as she tries to stand, painful and beautiful. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 인어공주는 물 위로 올라가 약을 마셨습니다. 그 순간 온몸이 불에 닿은 듯했지요. 인어공주는 그대로 정신을 잃었습니다. 눈을 뜨니 모래밭이었지요. 꼬리가 감쪽같이 없어져 있었습니다. 인어공주는 제 몸을 몇 번이나 내려다봤지요. 대신 두 다리가 생겨 있었지요. / 오른쪽: 일어서려 하자 발끝이 몹시 아팠습니다. 정말 칼날 위에 선 것 같았지요. 그래도 인어공주는 이를 악물고 일어섰습니다. 그때 저편에서 발소리가 났습니다. 고개를 드니 그 젊은이가 서 있었지요. 어디서 오셨나요?〕 |
| `images/05-legs-2.webp` | A bright palace hall where a silent girl dances gracefully despite pain while a prince watches fondly, courtiers applauding, but his gaze drifting toward the window and the sea, wistful. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 인어공주는 대답할 수 없었습니다. 입을 열어도 소리가 나지 않았지요. 젊은이는 인어공주를 궁으로 데려갔습니다. 고운 옷도 입혀 주었지요. 말을 못 하는 모양이군요. / 오른쪽: 인어공주는 날마다 춤을 췄습니다. 발이 아파도 웃으며 췄지요. 왕자는 인어공주를 늘 곁에 두었습니다. 내 소중한 동무예요.〕 |

## 6장 · 혼인 잔치

| 파일명 | 장면 |
|---|---|
| `images/06-wedding.webp` | A ship's deck where a prince speaks earnestly to a silent girl who presses her hands to her chest unable to answer, and a harbour crowded with welcoming crowds ahead, aching. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 어느 날 왕자가 말했습니다. 이웃 나라에 가야 해요. 혼인 이야기가 오간답니다. / 오른쪽: 인어공주는 가슴이 쿵 뛰었습니다. '그건 저예요.' 하지만 말할 수 없었지요. 손짓으로도 도무지 전할 수가 없었습니다.〕 |
| `images/06-wedding-2.webp` | A harbour where a prince recognises a princess with joy, and a great wedding feast on a ship at night where a silent girl stands smiling among the celebrations, alone in the crowd, deeply moving. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이웃 나라 공주가 앞으로 나왔습니다. 그 얼굴을 본 왕자가 걸음을 뚝 멈췄지요. 당신이었군요! 바로 그 바닷가의 아가씨였습니다. 왕자는 무척 기뻐했지요. / 오른쪽: 그날로 혼인이 정해졌습니다. 온 나라가 잔치를 벌였지요. 인어공주도 그 자리에 있었습니다. 웃는 얼굴로 조용히 서 있었지요. 아무도 그 마음을 알지 못했습니다. 그렇게 밤이 깊어 갔지요.〕 |

## 7장 · 해 뜨기 전에

| 파일명 | 장면 |
|---|---|
| `images/07-dagger.webp` | A ship at midnight where five short-haired mermaids rise from the waves holding out a knife to their sister at the rail, moonlight on the water, urgent and sorrowful. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 한밤중이었습니다. 물결 사이로 언니들이 얼굴을 내밀었지요. 그런데 머리가 모두 짧게 잘려 있었습니다. 마녀에게 머리를 주고 얻었어. / 오른쪽: 해가 뜨기 전에 해야 해. 그러면 다시 인어가 된단다. 인어공주는 말없이 단검을 받았습니다. 그러고는 천막 안으로 들어갔지요.〕 |
| `images/07-dagger-2.webp` | A ship cabin where a girl stands over a sleeping couple and lowers the knife, then on deck flinging it far into the sea as the eastern sky turns red with sunrise, quiet and profound. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 인어공주는 오래도록 서 있었습니다. 왕자의 얼굴을 가만히 내려다봤지요. 아주 편안해 보였습니다. 단검을 쥔 손이 천천히 내려갔지요. '이 사람이 행복하면 됐어.' / 오른쪽: 그러고는 뱃전에 섰지요. 단검을 힘껏 바다로 던졌습니다. 풍덩. 물결이 그것을 삼켰지요. 동쪽 하늘이 붉게 물들기 시작했습니다.〕 |

## 8장 · 바람이 된 인어공주

| 파일명 | 장면 |
|---|---|
| `images/08-air.webp` | A sunrise sea where a girl dissolves into light and rises weightless above the waves, met by shimmering translucent air-spirits in the morning sky, luminous and hopeful. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 인어공주는 바다로 몸을 던졌습니다. 그런데 몸이 가라앉지 않았지요. 오히려 깃털처럼 가벼워졌습니다. 몸이 위로, 위로 떠올랐지요. 햇살이 몸을 그대로 통과했습니다. / 오른쪽: 인어공주는 저도 모르게 소리를 냈지요. 목소리가 돌아와 있었던 것입니다. 주위에 빛나는 것들이 떠 있었지요. 바람처럼 가벼운 존재들이었습니다. 우리는 바람의 아이들이야.〕 |
| `images/08-air-2.webp` | A ship at sunrise where a prince searches the deck and gazes out to sea as an unseen breeze stirs his hair, and above, translucent figures drifting up into a bright sky, tender and consoling. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 인어공주는 아래를 내려다봤습니다. 저 밑으로 배가 보였지요. 왕자가 갑판에 나와 주위를 두리번거리고 있었습니다. 어디로 갔을까. 인어공주는 바람이 되어 그 곁을 스쳤지요. 왕자의 머리카락이 살랑 흔들렸습니다. / 오른쪽: 왕자는 바다를 오래 바라봤지요. 무언가 알 것도 같았습니다. 인어공주는 하늘로 올라갔지요. 바람의 아이들과 나란히 말입니다. 그 뒤로 바닷바람이 불면 사람들은 인어공주를 떠올렸답니다.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
