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
bold clean outlines, saturated storybook colors, warm candlelight against cold
window blue, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a grand nineteenth-century parlour
with a huge Christmas tree, a toy battlefield on a rug, a snowy forest of
glittering trees, and a kingdom made of sweets, expressive comic faces, wide
panoramic composition, magical and never frightening; the mice are drawn as comic
rather than horrid.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Marie: a girl about 9 in a white nightgown with dark curls, brave and curious.
The nutcracker: a wooden soldier in a red coat and tall black hat, with a
painted moustache and a stiff jaw; later a slim young prince in the same red
coat. Godfather Drosselmeier: a lean old man with an eyepatch and a clockmaker's
tools. Fritz: her rough-and-tumble older brother. The mouse king: a plump mouse
with seven small crowns, comic and blustering.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a wooden nutcracker soldier in a red coat standing guard beneath a candlelit Christmas tree at midnight, tiny mice eyes glinting in the shadows around him, snow at the window beyond, magical and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 크리스마스이브의 선물

| 파일명 | 장면 |
|---|---|
| `images/01-gift.webp` | A grand parlour on Christmas Eve where a huge candlelit tree glows over heaped presents as two children rush in, and a lean old clockmaker with an eyepatch arriving at the door, warm and festive. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 크리스마스이브였습니다. 거실 한가운데 커다란 나무가 서 있었지요. 가지마다 촛불이 켜지고 금박 사과가 대롱대롱 매달렸습니다. 마리와 프리츠는 문밖에서 발을 동동 구르며 기다렸지요. 아직 멀었어요? / 오른쪽: 조금만 더 참으렴. 드디어 문이 활짝 열렸습니다. 나무 아래에 선물이 잔뜩 쌓여 있었지요. 프리츠는 병정 인형을, 마리는 새 인형을 받았습니다. 그때 대부님이 들어오셨지요. 시계를 만드는 분이었습니다. 해마다 신기한 것을 만들어 오시는 분이었지요.〕 |
| `images/01-gift-2.webp` | A clockwork castle with moving figures being wound up as everyone applauds, while a girl kneels apart under the tree holding a wooden nutcracker soldier in a red coat, tender. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 대부님이 커다란 상자를 열었습니다. 안에는 작은 성이 들어 있었지요. 태엽을 감자 성안의 인형들이 움직이기 시작했습니다. 문이 열리고 사람들이 줄줄이 걸어 나왔지요. 우와! / 오른쪽: 그런데 마리만은 다른 것을 보고 있었지요. 나무 아래에 인형이 하나 놓여 있었거든요. 빨간 옷을 입은 병정이었습니다. 턱이 아래위로 딱딱 벌어졌지요. 호두를 까는 인형이었습니다. 얼굴이 좀 우스꽝스러웠지요. 그래도 마리는 그 인형이 제일 마음에 들었습니다.〕 |

## 2장 · 프리츠의 장난

| 파일명 | 장면 |
|---|---|
| `images/02-broken.webp` | A parlour rug where a boy forces an oversized nut into a nutcracker's mouth and its jaw cracks, his sister crying out with hands raised, broken pieces on the floor, comic and sad. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 마리는 그 인형을 안고 이리저리 다녔습니다. 프리츠가 그것을 보고 다가왔지요. 그거 이리 줘 봐. 프리츠는 호두를 한 움큼 가져왔습니다. 그중 제일 큰 것을 골랐지요. 그러고는 인형의 입에 그것을 밀어 넣었습니다. / 오른쪽: 안 돼, 그건 너무 커! 마리가 소리쳤지만 프리츠는 힘껏 눌렀지요. 뚝.〕 |
| `images/02-broken-2.webp` | A girl bandaging a nutcracker's jaw with a handkerchief as an old clockmaker leans down to tell her something, and later the doll laid carefully under the tree with a tiny blanket, tender. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 마리는 인형을 조심스레 안아 들었습니다. 손수건을 풀어 턱을 감아 주었지요. 아프지? 내가 고쳐 줄게. 그 모습을 보고 대부님이 다가왔습니다. / 오른쪽: 먼 나라 왕자였다는 이야기가 있지. 생쥐 왕의 마법에 걸려 저렇게 됐다는구나. 누군가 지켜 주면 마법이 풀린다더라.〕 |

## 3장 · 한밤중의 시계 소리

| 파일명 | 장면 |
|---|---|
| `images/03-midnight.webp` | A dim parlour at midnight where a girl in a nightgown stands as a clock strikes twelve and floorboards gape open, mice pouring out in a wave, comic and thrilling, not horrid. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그날 밤 마리는 도무지 잠이 오지 않았습니다. 마리는 살금살금 거실로 나왔지요. 마룻바닥이 차가워 발끝이 시렸습니다. 촛불은 거의 다 타고 나무만 어둑하게 서 있었습니다. 그때 괘종시계가 울리기 시작했지요. / 오른쪽: 종소리가 어둠 속에서 유난히 크게 울렸지요. 열두 번째 종이 울린 순간이었습니다. 방이 흔들리고 벽에서 사각사각 소리가 났지요. 마리는 나무 뒤로 몸을 숨겼습니다. 마룻바닥 틈이 스르르 벌어졌습니다. 그 틈으로 생쥐들이 쏟아져 나왔지요. 수를 셀 수 없을 만큼 많았습니다.〕 |
| `images/03-midnight-2.webp` | A parlour floor where a plump mouse king with seven tiny crowns leads a mouse horde, and a nutcracker soldier drawing his sword as tin soldiers form ranks and toy cannons roll out, exciting. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 한가운데에 유난히 큰 생쥐가 있었습니다. 머리에 작은 왕관을 여럿 쓰고 있었지요. 생쥐 왕이었습니다. 마리는 저도 모르게 뒷걸음질을 쳤지요. 바로 그때 나무 아래가 움직였습니다. 호두까기 인형이 벌떡 일어선 것이었지요. / 오른쪽: 병정들, 모여라! 인형이 작은 칼을 뽑아 들었습니다. 프리츠의 병정들이 우르르 줄을 섰지요. 둥, 둥, 둥.〕 |

## 4장 · 생쥐 왕과의 싸움

| 파일명 | 장면 |
|---|---|
| `images/04-battle.webp` | A toy battlefield on a parlour rug where tin soldiers fire sugar-plum cannonballs at a mouse horde and a nutcracker faces a crowned mouse king, chaotic and comic. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 병정들이 한 걸음씩 앞으로 나아갔습니다. 대포에서 사탕이 펑펑 튀어나왔지요. 사탕에 맞은 생쥐들이 우수수 넘어졌습니다. 물러서지 마라! 그래도 생쥐들은 자꾸자꾸 몰려왔지요. 병정들이 하나씩 쓰러지면서 줄이 점점 짧아졌습니다. 호두까기 인형이 맨 앞에 나섰지요. / 오른쪽: 마침내 생쥐 왕과 마주 섰습니다. 덤벼라! 두 편이 쨍 하고 부딪쳤지요. 칼과 이빨이 부딪는 소리가 온 거실에 울렸습니다.〕 |
| `images/04-battle-2.webp` | A parlour where a girl hurls her slipper across the room striking a mouse king, the mouse horde scattering into the floorboards, and the girl sinking down dizzy, dramatic and comic. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 끝내 인형이 쿵 넘어졌습니다. 생쥐 왕이 성큼성큼 다가갔지요. 마리는 저도 모르게 몸이 움직였습니다. 신고 있던 신발을 얼른 벗었지요. 저리 가! / 오른쪽: 그것이 생쥐 왕의 머리에 딱 맞았지요. 생쥐들이 놀라 우르르 흩어졌습니다. 마룻바닥 틈으로 순식간에 사라졌지요. 거실이 다시 조용해졌습니다. 마리는 그 자리에 주저앉았지요. 눈앞이 빙글빙글 돌더니 그대로 정신을 잃었습니다.〕 |

## 5장 · 설탕 길

| 파일명 | 장면 |
|---|---|
| `images/05-prince.webp` | A glowing parlour where a slim young prince in a red coat stands before a wondering girl and offers his hand, a small door opening at the base of the Christmas tree, magical. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 눈을 뜨니 사방이 환했습니다. 코끝에 달콤한 냄새가 스쳤지요. 누군가 마리 앞에 서 있었지요. 빨간 옷을 입은 젊은이였습니다. 얼굴이 어쩐지 익숙했지요. 저를 지켜 주셨습니다. / 오른쪽: 당신이… 그 인형이에요? 왕자가 빙그레 웃으며 고개를 숙였습니다. 부러졌던 턱 자리에 흉터 하나 없었지요. 제 나라를 보여 드리고 싶어요.〕 |
| `images/05-prince-2.webp` | A doorway at the foot of a Christmas tree opening into another world of sugar-dusted paths, tin soldiers saluting a returning prince as a girl in a nightgown walks beside him, wondrous. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 문 너머는 전혀 다른 세상이었습니다. 뒤를 돌아보니 거실이 아득히 멀었지요. 발밑이 사각사각하며 반짝였습니다. 설탕을 뿌려 놓은 길이었지요. 이 길을 따라가면 됩니다. / 오른쪽: 길가에는 병정들이 줄지어 서 있었지요. 왕자를 보더니 척 경례를 했습니다. 돌아오셨군요! 오래 기다렸습니다.〕 |

## 6장 · 눈송이가 춤추는 숲

| 파일명 | 장면 |
|---|---|
| `images/06-snow.webp` | A forest of ice-glazed trees ringing like bells in the wind where snowflakes take the form of dancing figures whirling around a girl and a prince, luminous and magical. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 길은 이내 숲으로 이어졌습니다. 나무마다 얼음이 맺혀 있었지요. 가지가 유리처럼 맑게 반짝였습니다. 바람이 불자 소리가 났지요. 딸랑딸랑. / 오른쪽: 마리는 걸음을 멈추고 귀를 기울였지요. 나뭇가지가 흔들릴 때마다 소리가 조금씩 달랐습니다. 그때 눈이 내리기 시작했습니다. 그런데 어쩐지 이상했지요. 눈송이가 사람처럼 팔을 벌리고 빙글빙글 돌며 춤을 추는 것이었습니다. 어디선가 음악이 흘러 온 숲이 함께 흔들렸지요.〕 |
| `images/06-snow-2.webp` | Dancing snowflakes parting to reveal a river of orange juice where a shell boat pulled by dolphins waits, sugar flowers blooming along the banks, delightful and strange. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 눈송이들이 스르르 길을 열어 주었습니다. 두 사람은 그 사이를 지나갔지요. 숲이 끝나자 넓은 강이 나왔습니다. 그런데 흐르는 것이 물이 아니었지요. 노란 오렌지 주스였습니다. 강가에는 작은 배가 기다리고 있었지요. 조개껍데기로 만든 배였습니다. 돌고래 두 마리가 그 배를 끌었지요. / 오른쪽: 타시지요. 왕자가 손을 내밀어 마리를 배에 태웠습니다. 강 양옆에는 꽃이 흐드러지게 피어 있었습니다. 모두 설탕으로 된 꽃이었지요. 마리는 강물에 손끝을 담갔다가 살짝 핥아 보고는 웃었습니다.〕 |

## 7장 · 과자 나라

| 파일명 | 장면 |
|---|---|
| `images/07-candy.webp` | A city of gingerbread walls, chocolate roofs and almond-paved streets where crowds pour out cheering as a prince returns with a girl beside him, petals in the air, joyous. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 강이 끝나는 곳에 도시가 있었습니다. 집이 모두 과자로 지어져 있었지요. 지붕은 초콜릿이고 담은 생강빵이었습니다. 길에는 아몬드가 깔려 있었지요. 마리는 발끝을 들고 한 바퀴 빙 돌았습니다. 여기가 정말 있는 곳이에요? / 오른쪽: 그때 사람들이 우르르 몰려나왔지요. 왕자님이 돌아오셨다! 머리 위로 꽃잎이 흩날렸습니다. 왕자가 마리의 손을 들어 보이며 말했지요.〕 |
| `images/07-candy-2.webp` | A great square where dancers from chocolate, tea and sugar lands perform in turn and flowers waltz at the end, a prince and a girl watching side by side, festive and warm. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 광장에서 큰 잔치가 열렸습니다. 나라마다 나와서 춤을 보여 주었지요. 먼저 초콜릿 나라 사람들이 나왔습니다. 이어서 차 나라와 사탕 나라도 나왔지요. 마지막에는 꽃들이 나와 한들한들 춤을 췄습니다. 마리는 손이 아프도록 손뼉을 쳤지요. 이렇게 고운 춤은 처음 봐요. / 오른쪽: 잔치가 무르익을 무렵 왕자가 곁에 앉았습니다. 여기서 저와 지내지 않으실래요? 마리는 잠시 생각에 잠겼지요. 집이 떠올랐습니다. 어머니와 프리츠의 얼굴도요.〕 |

## 8장 · 아침의 트리 아래

| 파일명 | 장면 |
|---|---|
| `images/08-morning.webp` | A candy city receding behind a shell boat drifting downstream as a prince waves from the quay and a girl's eyes grow heavy, soft dreamlike light, gentle farewell. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 왕자가 조용히 고개를 끄덕였습니다. 그러실 줄 알았어요. 길을 열어 드리지요. / 오른쪽: 저도요. 마리는 왕자의 손을 오래 잡고 있었습니다. 마리가 배에 오르자 물결이 배를 실어 갔습니다. 과자로 지은 도시가 점점 멀어졌지요. 광장의 불빛이 마지막까지 반짝였습니다.〕 |
| `images/08-morning-2.webp` | A sunlit morning parlour where a girl wakes on the rug beneath the Christmas tree as her mother comes in, and the nutcracker lying there with its jaw whole again, quietly magical. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아침 햇살에 눈을 떴습니다. 마리가 누워 있는 곳은 거실 바닥이었지요. 나무 아래에 이불도 없이 잠들어 있었던 것입니다. 그때 어머니가 들어왔지요. 여기서 잤니? 감기 들라. / 오른쪽: 엄마, 어젯밤에요…… 꿈을 꿨나 보구나. 마리는 얼른 인형을 찾았지요. 인형은 나무 아래 그대로 있었습니다.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
