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
bold clean outlines, saturated storybook colors, warm Mediterranean sunlight, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), ancient Greek palace, olive groves, mountain
hillsides and a reed marsh, expressive comic faces, wide panoramic composition,
funny and never cruel.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
King Midas: a round-faced king in a purple Greek robe and gold crown, easily
flustered, with long donkey ears he tries to hide under a tall pointed cap. The
barber: a thin nervous man with scissors and a comb, bursting with a secret. Pan:
a cheerful goat-legged piper. Apollo: a tall golden-haired figure with a lyre.
The queen and courtiers in white Greek dress.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a crowned king in Greek robes clutching a tall pointed hat over his head while two long donkey ears peek out from beneath it, a grove of whispering reeds in the foreground, comic and inviting, warm Mediterranean light. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 산속의 음악 대결

| 파일명 | 장면 |
|---|---|
| `images/01-contest.webp` | A sunlit Greek mountainside where a goat-legged piper and a golden-haired lyre player prepare to perform before a crowd of nymphs, animals and a seated king, festive. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아주 먼 옛날 그리스에서 있었던 일입니다. 어느 산에서 음악 대결이 열렸지요. 한쪽은 목신 판이었습니다. 다리가 염소 같은 신이었지요. 판은 갈대로 만든 피리를 불었습니다. 다른 한쪽은 아폴론이었지요. / 오른쪽: 머리가 금빛으로 빛나는 신이었습니다. 손에는 하프를 들고 있었지요. 소문을 듣고 사람들이 몰려왔습니다. 숲의 짐승들까지 귀를 기울였지요. 구경꾼 가운데 미다스 임금님도 있었습니다.〕 |
| `images/01-contest-2.webp` | A goat-legged piper leaping and playing a lively reed pipe to a swaying crowd, then a golden-haired figure playing a lyre as everyone sits utterly still, contrast. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 먼저 판이 피리를 불었습니다. 소리가 어찌나 흥겨운지 발이 절로 움직였지요. 사람들이 어깨를 들썩였습니다. 판은 신이 나서 껑충껑충 뛰었지요. 연주가 끝나자 박수가 쏟아졌습니다. 이어서 아폴론이 하프를 켰지요. 이번에는 아무도 움직이지 않았습니다. / 오른쪽: 소리가 너무 고와서 숨도 못 쉬었거든요. 어떤 사람은 눈물을 흘렸지요. 연주가 끝나도 한참 조용했습니다. 둘 다 참 잘하는걸.〕 |

## 2장 · 혼자 다른 대답

| 파일명 | 장면 |
|---|---|
| `images/02-judgment.webp` | A mountain gathering where a mountain god raises the lyre player's hand while everyone nods, and a plump king suddenly leaping up in objection, comic. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이제 심판이 결정을 내릴 차례였습니다. 심판은 그 산의 산신이었지요. 산신은 잠시 생각하더니 손을 들었습니다. 아폴론의 손이었지요. 하프가 더 훌륭하였소. / 오른쪽: 판도 웃으며 축하해 주었지요. 그런데 그때였습니다. 미다스 임금님이 벌떡 일어섰지요. 아니지요!〕 |
| `images/02-judgment-2.webp` | A hushed mountainside where a lyre player regards a stubborn king with a cool level gaze while the crowd stares, comic tension, warm light. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 순간 산속이 조용해졌습니다. 사람들이 임금님을 쳐다보았지요. 저 사람 지금 뭐라는 거야? 임금님은 그래도 물러서지 않았습니다. / 오른쪽: 얼굴에는 아무 표정이 없었습니다. 그런 귀라면 말이오. 차라리 당나귀 귀가 어울리겠군요.〕 |

## 3장 · 아침에 생긴 일

| 파일명 | 장면 |
|---|---|
| `images/03-ears.webp` | A palace bedchamber where a horrified king stares into a bronze mirror at long furry donkey ears sprouting from his head, clapping his hands over his mouth, hilarious. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이튿날 아침이었습니다. 임금님은 늘 하던 대로 거울 앞에 앉았지요. 그런데 무언가 이상했습니다. 머리 위로 길쭉한 것이 솟아 있었지요. 임금님은 손을 뻗어 만져 보았습니다. 털이 보송보송했지요. / 오른쪽: 틀림없는 당나귀 귀였습니다. 이, 이게 무슨 일이야! 임금님은 소리를 지를 뻔했지요. 얼른 두 손으로 입을 막았습니다.〕 |
| `images/03-ears-2.webp` | A king jamming on an enormous pointed cap and striding out of his chamber, wearing it at meals and even in bed while courtiers whisper, very comic. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 임금님은 옷장을 뒤졌습니다. 커다랗고 뾰족한 모자를 찾아냈지요. 그것을 푹 눌러썼습니다. 귀가 겨우 감춰졌지요. 임금님은 그제야 방문을 열었습니다. 거울을 몇 번이나 다시 봤지요. / 오른쪽: 그날부터 모자를 한 번도 벗지 않았지요. 밥을 먹을 때도 쓰고 있었습니다. 잠을 잘 때도 쓰고 있었지요. 신하들이 고개를 갸웃했습니다. 임금님이 요즘 모자를 참 좋아하시네.〕 |

## 4장 · 이발사만은 알았다

| 파일명 | 장면 |
|---|---|
| `images/04-barber.webp` | A locked palace room where a barber lifts a king's enormous cap and freezes wide-eyed at the donkey ears beneath, scissors trembling in his hand, hilarious. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그렇게 몇 달이 지났습니다. 아무리 그래도 머리는 깎아야 했지요. 임금님은 이발사를 불렀습니다. 문을 걸어 잠그고 둘만 남았지요. 자, 모자를 벗겨라. / 오른쪽: 그러고는 그 자리에 굳어 버렸지요. 눈이 접시만 해졌습니다. 가위를 든 손이 부들부들 떨렸지요. 이, 이건……〕 |
| `images/04-barber-2.webp` | A trembling barber bowing repeatedly to a glaring king, then walking home down a sunlit street clutching his tools with sweat on his brow, comic. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이 일을 누구에게든 말하면 안 된다. 말하면 큰일 날 줄 알아라. 예, 예! 절대로 말하지 않겠습니다! / 오른쪽: 등에 식은땀이 흘렀습니다. 집으로 가는 길이 어찌나 먼지 몰랐지요. 그런데 그날 밤부터 이상했습니다. 입이 자꾸 근질근질했거든요. 그 말이 목구멍까지 올라왔지요. 이발사는 자꾸 헛기침만 했습니다.〕 |

## 5장 · 참을 수 없는 말

| 파일명 | 장면 |
|---|---|
| `images/05-itch.webp` | A cramped village house where a gaunt barber tosses in bed with both hands clamped over his mouth while his worried wife leans over him, candle guttering, comic misery. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이발사는 밥을 먹다가도 그 생각이 났습니다. 숟가락을 들면 귀가 떠올랐지요. 잠을 자려고 누우면 더 또렷해졌습니다. 말하고 싶다. 딱 한 번만 말하고 싶다. / 오른쪽: 두 손으로 입을 틀어막았습니다. 아내가 걱정스레 물었지요. 여보, 무슨 일 있어요? 이발사는 고개만 저었습니다. 목구멍까지 말이 차올랐지요. 이발사는 이불을 더 꽉 끌어당겼습니다.〕 |
| `images/05-itch-2.webp` | A gaunt barber refusing a friend's cup in a tavern with tight lips, then sitting hollow-eyed at his own table, months passing, comic and pitiable. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 친구가 술을 권해도 마찬가지였습니다. 이발사는 입을 꾹 다물었지요. 한 잔만 마셔도 말이 나올 것 같았거든요. 자네 요즘 왜 그러나? 아, 아무것도 아닐세. / 오른쪽: 그런데 배만 자꾸 불룩해졌습니다. 못 한 말이 그 안에 쌓이는 것 같았지요. 이러다 내가 병이 나겠구나. 아무한테도 말 못 한다면 어쩌지.〕 |

## 6장 · 땅에 대고 외친 말

| 파일명 | 장면 |
|---|---|
| `images/06-hole.webp` | A barber with a spade hurrying to a riverside reed bed at dusk, checking that nobody is around and digging a deep hole in the earth, comic secrecy. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 어느 날 이발사가 벌떡 일어났습니다. 좋은 생각이 떠올랐거든요. 사람한테 말하지 말라고 했지. 땅한테 말하면 되지 않겠나. / 오른쪽: 사방을 둘러보았습니다. 지나가는 사람은 하나도 없었지요. 이발사는 땅을 팠습니다. 제법 깊은 구덩이가 생겼지요. 그러고는 구덩이에 얼굴을 처박았습니다. 흙냄새가 코를 찔렀지요. 심장이 쿵쿵 뛰었습니다. 이발사는 크게 숨을 들이켰지요.〕 |
| `images/06-hole-2.webp` | A barber shouting into a hole among towering reeds at dusk, then filling it in and walking home light-footed, comic relief, golden light. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이발사는 목청껏 소리쳤습니다. 임금님 귀는 당나귀 귀! 임금님 귀는 당나귀 귀라고! / 오른쪽: 발로 꼭꼭 밟기까지 했습니다. 손바닥에 흙이 잔뜩 묻었지요. 이발사는 그것도 모르고 씩 웃었습니다. 이제 아무도 모르겠지. 집에 돌아오는 발걸음이 가벼웠지요.〕 |

## 7장 · 온 나라에 퍼진 노래

| 파일명 | 장면 |
|---|---|
| `images/07-reeds.webp` | A wide riverside marsh where tall reeds bend in the wind and travellers on the bank stop to listen with astonished faces, golden afternoon. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 얼마 뒤 그 자리에 갈대가 자랐습니다. 쑥쑥 자라 사람 키만큼 커졌지요. 누렇게 여문 이삭이 달렸습니다. 어느 날 강가에 바람이 불었지요. 갈대들이 서걱서걱 흔들렸습니다. / 오른쪽: 그런데 그 소리가 이상했지요. 가만 들으면 이렇게 들렸습니다. 임금님 귀는 당나귀 귀…… 임금님 귀는 당나귀 귀……〕 |
| `images/07-reeds-2.webp` | Crowds gathering at a reed marsh as the wind repeats the secret, then market stalls buzzing and children singing it, a pale barber bolting his door, comic. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 사람들이 갈대밭으로 몰려들었습니다. 바람이 불 때마다 같은 소리가 났지요. 이제는 누구나 알아들을 수 있었습니다. 임금님 귀가 당나귀 귀라고? 그래서 그 모자를 쓰신 거였구나! / 오른쪽: 장터에서도 그 이야기뿐이었습니다. 아이들은 노래로 만들어 불렀지요. 이발사는 그 소리를 듣고 얼굴이 하얘졌습니다. 이를 어쩌면 좋아. 이발사는 방문을 걸어 잠갔지요. 밖에서 아이들 노랫소리가 들려왔습니다. 이발사는 두 귀를 막았지요.〕 |

## 8장 · 모자를 벗은 날

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | A king sitting alone before a mirror with his cap removed, looking at his donkey ears, then rising with the cap in his hand, quiet and thoughtful. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 임금님도 결국 그 소문을 들었습니다. 신하가 조심조심 알려 주었지요. 임금님은 모자를 더 눌러썼습니다. 그러고는 방으로 들어가 문을 닫았지요. 한참을 나오지 않았지요. 신하들은 문밖에서 기다렸습니다. / 오른쪽: 임금님은 거울 앞에 앉았지요. 모자를 벗고 제 귀를 보았습니다. 이제 와서 감춘들 무슨 소용인가. 온 나라가 다 아는 것을.〕 |
| `images/08-ending-2.webp` | A palace courtyard where a king walks out bareheaded showing his donkey ears, the crowd bursting into laughter and the king laughing along, warm sunny relief. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 임금님은 모자를 쓰지 않고 마당으로 나갔습니다. 당나귀 귀가 훤히 드러났지요. 사람들이 깜짝 놀라 뒷걸음질을 쳤습니다. 한동안 아무도 말을 못 했지요. 임금님이 먼저 귀를 쓱 만졌습니다. 보기보다 잘 들린다네. / 오른쪽: 그러다 누군가 웃음을 터뜨렸습니다. 웃음은 금세 온 마당에 번졌지요. 임금님도 함께 웃었습니다. 어차피 다 아는 것을, 뭐 하러 숨겼나. 그날 임금님은 마음이 참 편했지요. 이발사도 그제야 방문을 열었습니다.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
