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
bold clean outlines, saturated storybook colors, warm golden light, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a forest pond, a castle garden, a grand dining hall and a
bedchamber, very expressive comic faces, wide panoramic composition, funny and
warm, never frightening.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

> **머리 모양까지 적어 두었습니다.** 앞서 옷차림만 적어 두었더니 공주가 장마다
> 딴사람이 되었어요. 첫 장에서는 밤빛 곱슬머리, 밥상 장면에서는 노란 양갈래에
> 커다란 리본, 마지막 장에서는 짧은 검은 머리였습니다. 셋 다 다른 아이였지요.
> 아래 설명을 **한 글자도 빼지 말고** 매번 붙여 넣어 주세요.

```
The princess: a girl about 11 with wavy chestnut-brown hair falling past her
shoulders and a small gold crown, in a bright yellow gown with white lace
trim. Lively and easily annoyed. Her hair colour, her hair length and her
crown must be exactly the same in every picture — never blonde, never in
pigtails, never with a big ribbon.
The frog: a plump green frog with big earnest eyes, drawn as appealing rather
than slimy. He wears NO crown — he only looks like an ordinary frog until the
spell breaks.
The king: a broad older man with a grey beard and a calm steady face, in a
purple robe with a gold crown.
Heinrich: a stout loyal servant with three iron bands around his chest.
Everyone must look like the same person from picture to picture.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a golden ball resting at the edge of a dark forest pond with a small green frog perched beside it, a castle roof visible through the trees, low golden light on the water, charming and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 막내 공주

| 파일명 | 장면 |
|---|---|
| `images/01-ball.webp` | A sunlit forest pond ringed with old lime trees where a girl in a yellow gown tosses a golden ball into the air, castle towers just visible beyond the trees, bright and inviting. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 황금 공 하나가 햇빛을 받아 눈이 부시게 빛났습니다. 막내 공주가 가장 아끼는 물건이었지요. 해님도 그 얼굴을 볼 때면 잠시 걸음을 멈춘다고 할 정도였습니다. 임금님에게는 딸이 여럿 있었지만 그 가운데 막내가 가장 예뻤습니다. 공주는 그 공을 잠잘 때도 머리맡에 두었지요. / 오른쪽: 궁궐 뒤로 나가면 깊은 숲이 있었습니다. 그 숲 한가운데에 오래된 연못이 하나 있었지요. 물이 어찌나 깊은지 바닥이 보이지 않았습니다. 공주는 날마다 그 연못가 보리수 아래에서 놀았습니다. 그늘이 시원하고 물소리가 좋았거든요. 개구리 우는 소리도 심심찮게 들렸습니다.〕 |
| `images/01-ball-2.webp` | A girl in a yellow gown reaching out in dismay as a golden ball splashes into dark pond water, ripples spreading, then sitting on the bank in tears, vivid and lively. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그날도 공주는 공을 높이 던졌다가 받았습니다. 한 번, 두 번, 세 번. 공은 해를 받아 반짝반짝 빛났지요. 공주는 그 빛을 보는 것이 제일 좋았습니다. / 오른쪽: 공이 손끝을 스치고 옆으로 튀었습니다. 데구루루 굴러 연못으로 빠져 버렸지요. 풍덩 소리와 함께 공이 사라졌습니다. 어떡해, 내 공! 공주는 주저앉아 울음을 터뜨렸습니다. 아무리 들여다보아도 물속은 캄캄했지요.〕 |

## 2장 · 연못에서 나온 목소리

| 파일명 | 장면 |
|---|---|
| `images/02-frog.webp` | A pond edge where a plump green frog surfaces among lily pads and speaks to a weeping girl in a yellow gown who recoils in surprise, comic and sweet. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 공주는 한참을 울었습니다. 울어도 공이 떠오르지는 않았지요. 나뭇잎 사이로 저녁 해가 기울었습니다. 이제 곧 어두워질 참이었지요. 그때 물결이 일렁거렸습니다. 무언가가 물 위로 고개를 쏙 내밀었지요. / 오른쪽: 커다란 눈을 가진 개구리 한 마리였습니다. 공주는 깜짝 놀라 뒤로 물러섰습니다. 그런데 개구리가 말을 했지요.〕 |
| `images/02-frog-2.webp` | A frog on a lily pad shaking its head as a girl in yellow kneels at the bank offering her crown and jewels, evening light on the water, funny and pointed. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 공주는 눈물을 닦고 대답했습니다. 공이 연못에 빠졌어. 너무 깊어서 꺼낼 수가 없어. 개구리가 눈을 껌뻑였습니다. 그러고는 짧은 앞발로 물을 툭 쳤지요. / 오른쪽: 대신 약속을 하나 해 주십시오. 공주는 벌떡 일어났습니다. 무엇이든 해 줄게. 보석도 왕관도 줄게!〕 |

## 3장 · 가벼운 약속

| 파일명 | 장면 |
|---|---|
| `images/03-promise.webp` | A frog earnestly making its request at the water's edge while a girl in a yellow gown rolls her eyes and agrees carelessly, the deep forest pond behind them, comic. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 개구리는 물 위에 가만히 떠서 천천히 말했습니다. 저를 친구로 삼아 주십시오. 한 밥상에서 밥을 먹게 해 주십시오. / 오른쪽: 공주는 속으로 코웃음을 쳤습니다. 개구리가 무슨 수로 궁궐까지 오겠나 싶었지요. 연못에서 궁궐까지는 한참 걸어야 했습니다. 개구리 걸음으로는 어림도 없어 보였지요. 공주는 손을 내저었습니다. 그래, 그러자. 얼른 꺼내 오기나 해.〕 |
| `images/03-promise-2.webp` | A frog holding a golden ball in its mouth at the water's edge while a girl snatches it and runs off down a forest path without looking back, the frog calling after her. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 개구리는 물속으로 쏙 들어갔습니다. 한참 뒤 입에 공을 물고 떠올랐지요. 물방울이 등에서 뚝뚝 떨어졌습니다. 개구리는 공을 풀밭 위에 놓아 주었지요. 공주는 공을 얼른 집어 들었습니다. 그러고는 뒤도 돌아보지 않고 달려갔지요. / 오른쪽: 공주님, 저도 데려가 주십시오! 개구리가 뒤에서 소리쳤습니다. 하지만 개구리 걸음으로는 따라갈 수가 없었지요. 공주는 그대로 궁궐로 돌아갔습니다. 그날 밤 공주는 개구리를 까맣게 잊었지요.〕 |

## 4장 · 문을 두드리는 소리

| 파일명 | 장면 |
|---|---|
| `images/04-knock.webp` | A grand dining hall with a royal family at a long table, a girl in yellow freezing with a dropped spoon as knocking sounds come from the tall door, warm candlelight. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이튿날 저녁이었습니다. 온 식구가 커다란 밥상에 둘러앉았지요. 김이 오르는 그릇이 죽 늘어서 있었습니다. 공주는 어제 일을 까맣게 잊고 있었지요. 그때 문에서 소리가 났습니다. / 오른쪽: 이어서 낯익은 목소리가 들려왔지요. 공주님, 문을 열어 주십시오. 공주는 숟가락을 떨어뜨렸습니다.〕 |
| `images/04-knock-2.webp` | A small muddy green frog sitting on a palace threshold as a girl in yellow slams the tall door shut in horror and returns pale to the dinner table, hilarious contrast of scale. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 문을 연 공주는 그대로 얼어붙었습니다. 문턱에 개구리가 앉아 있었으니까요. 밤새 뛰어온 모양이었습니다. 몸에는 흙이 잔뜩 묻어 있었지요. 발끝에는 마른 풀이 붙어 있었습니다. 공주는 문을 쾅 닫고 돌아왔습니다. 얼굴이 하얗게 질렸지요. 문밖에서 또 톡톡 소리가 났습니다. / 오른쪽: 숟가락을 든 손이 덜덜 떨렸습니다. 왜 그러니? 언니가 옆에서 물었지요. 공주는 대답을 하지 못했습니다.〕 |

## 5장 · 임금님의 말

| 파일명 | 장면 |
|---|---|
| `images/05-king.webp` | A dining hall where a girl in yellow reluctantly confesses to a bearded king seated at the head of the table, sisters and courtiers listening, dignified and warm. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 임금님이 딸의 얼굴을 보고 물었습니다. 무슨 일이냐. 무엇이 그리 무서우냐. 공주는 얼른 대답하지 못했습니다. 개구리 이야기를 어떻게 꺼내야 할지 몰랐거든요. / 오른쪽: 거인은 아니고요…… 개구리예요. 임금님이 숟가락을 내려놓았습니다. 언니들은 서로 눈짓을 주고받았지요. 공주는 하는 수 없이 어제 일을 이야기했습니다. 공을 빠뜨린 것부터 약속한 것까지 다 말했습니다. 말하면서도 얼굴이 화끈거렸지요. 그러게 왜 그런 약속을 했을까 싶었습니다.〕 |
| `images/05-king-2.webp` | A bearded king speaking gently but firmly while his daughter looks at her feet, and then the girl reopening the tall door where a patient frog still waits, quiet and moving. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 임금님은 잠시 말이 없었습니다. 그러다 수염을 한 번 쓸고 조용히 입을 열었지요. 네가 한 약속이면 지켜야 하지 않겠느냐. / 오른쪽: 공주는 발끝만 내려다보았습니다. 대꾸할 말이 없었지요. 아버지 말이 옳다는 것을 알고 있었으니까요. 결국 공주는 다시 문으로 갔습니다. 문을 열자 개구리가 그대로 앉아 있었습니다.〕 |

## 6장 · 젖은 발자국

| 파일명 | 장면 |
|---|---|
| `images/06-dinner.webp` | A frog perched on a fine dinner plate eating happily while a girl in yellow leans as far away as her chair allows, the king hiding a smile behind his hand, very funny. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 개구리는 폴짝폴짝 뛰어 들어왔습니다. 의자를 타고 밥상 위까지 올라왔지요. 접시들 사이를 조심조심 지나갔습니다. 공주님 접시를 이리로 밀어 주십시오. 함께 먹기로 하지 않았습니까. 개구리가 눈을 껌뻑였습니다. / 오른쪽: 젖은 발자국이 상보에 콕콕 찍혔지요. 공주는 인상을 잔뜩 찌푸렸습니다. 그래도 임금님이 보고 있어 접시를 슬그머니 밀어 주었지요. 개구리는 아주 맛있게 먹었습니다. 공주는 한 숟가락도 넘기지 못했지요. 언니들은 웃음을 참느라 애를 썼습니다. 임금님만 아무렇지 않게 밥을 드셨지요.〕 |
| `images/06-dinner-2.webp` | A frog patting its full belly on the dinner table while a girl in yellow leaps up protesting and the king clears his throat, then the girl carrying the frog upstairs by one fingertip. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 개구리가 배를 두드렸습니다. 잘 먹었습니다. 이제 자러 갈까요? 뭐라고? / 오른쪽: 개구리랑 한방에서 자라고요? 공주가 소리쳤습니다. 임금님이 헛기침을 했습니다. 공주는 입을 다물 수밖에 없었지요. 약속은 약속이었으니까요. 결국 개구리를 손끝으로 집어 들었습니다.〕 |

## 7장 · 방문 앞에서

| 파일명 | 장면 |
|---|---|
| `images/07-room.webp` | A candlelit bedchamber where a girl in a nightgown lies in a soft canopied bed while a small frog crouches alone in a far corner on cold stone, quiet and tender. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 공주는 방에 들어서자마자 개구리를 내려놓았습니다. 푹신한 잠자리에서 한참 떨어진 구석이었지요. 거기 있어. 절대 올라오지 마. 돌바닥은 손이 시릴 만큼 차가웠습니다. / 오른쪽: 공주는 이불 속에서 눈을 감았습니다. 창밖에서 바람이 스쳐 지나갔지요. 그런데 자꾸 구석 쪽이 마음에 걸렸습니다. 잠이 오지 않았지요. 임금님이 한 말이 자꾸 떠올랐습니다.〕 |
| `images/07-room-2.webp` | A girl kneeling with a candle to gather a shivering little frog gently into both hands and set it beside her pillow, warm candlelight, tender and quiet. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 한참 뒤 공주가 몸을 일으켰습니다. 촛불을 들고 구석으로 가 보았지요. 개구리는 차가운 돌바닥에 웅크리고 있었습니다. 그 작은 몸이 조금씩 떨렸지요. 바닥이 몹시 차가웠던 것입니다. 연못에서 여기까지 온 발도 다 헐어 있었지요. 공주는 한숨을 쉬었습니다. 그러고는 개구리를 두 손으로 감싸 올렸지요. / 오른쪽: ……미안해. 약속은 약속이니까. 개구리는 여전히 아무 말이 없었지요. 공주는 그 등을 손가락으로 살살 쓸어 주었습니다. 공주는 개구리를 베개 옆에 살며시 내려놓았습니다. 손바닥이 따뜻했지요.〕 |

## 8장 · 풀린 마법

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | A bedchamber filling with brilliant light as a frog transforms into a young prince in fine clothes, the girl shielding her eyes then staring in wonder, joyous and magical. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그 순간이었습니다. 방 안이 대낮처럼 환해졌습니다. 공주는 눈이 부셔 두 손으로 얼굴을 가렸지요. 무슨 일이 났나 싶었습니다. 빛이 사라지고 나서야 다시 눈을 떴습니다. 방 안 공기가 달라져 있었지요. 촛불이 저 혼자 흔들렸습니다. / 오른쪽: 개구리가 있던 자리에 젊은이가 서 있었습니다. 눈이 맑고 고운 옷을 입은 왕자였지요. 저는 마법에 걸려 있던 이웃 나라 왕자입니다. 약속을 지켜 주는 사람을 만나야 풀리는 마법이었지요. 공주는 말을 잇지 못했습니다.〕 |
| `images/08-ending-2.webp` | A carriage drawn by eight white horses rolling from a palace gate, a stout servant at the back as three iron bands snap and fall from his chest, joyous and bright. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이튿날 아침이었습니다. 궁궐 앞에 여덟 마리 백마가 끄는 마차가 섰습니다. 마부는 왕자를 어릴 때부터 모신 하인리히라는 사람이었지요. 왕자가 개구리가 되던 날, 가슴이 터질까 봐 쇠테를 둘렀던 사람이지요. / 오른쪽: 그렇게 여러 해를 기다렸습니다. 마차가 달리는데 뒤에서 툭, 툭 소리가 났지요. 왕자가 놀라 물었습니다. 무엇이 부러진 소리냐? 제 가슴을 조이던 쇠테입니다. 이제 필요 없지요. 마차는 환한 길을 달려갔습니다.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
