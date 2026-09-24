# 제미나이 그림 프롬프트 — 왕자와 거지

하나의 이야기를 열다섯 장으로 나눠 담았고, 장마다 그림이 두 장씩 들어갑니다.
그림이 있는 펼침면은 오른쪽 쪽에 그림 한 장이 들어가고, 그림이 없는 펼침면은 양쪽 쪽에 글만 들어갑니다.
아래 프롬프트를 제미나이에 넣어 생성한 뒤 파일명을 정확히 맞춰 `images/` 폴더에 넣으면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보입니다.)

권장 크기: **가로 4 : 세로 3** 비율, PNG.
그림이 칸을 꽉 채워야 하니 가장자리에 흰 여백이나 테두리를 두지 마세요. 그림이 네 변 끝까지 닿아야 합니다.

**단 표지(`cover.webp`)만 예외 — 세로 2 : 3 비율입니다.**

## 공통 스타일 지시문 (모든 프롬프트 앞에 붙여서 쓰세요)

```
A SINGLE PAINTING ONLY. This is one picture, not a page from a book.
Every surface in it is blank: no title, no caption, no signature, no page
number, no speech balloon, no sign, no label, no writing on any book, map,
paper, banner or wall. There are no letters of any alphabet anywhere in the
picture, and no borders or panels around it. The picture fills the whole
canvas edge to edge.

MEDIUM - this matters as much as the scene: a hand-painted illustration in
gouache and watercolour on textured paper. Visible brush strokes, washes that
pool and dry unevenly, soft painterly edges where one colour meets another,
ink line work over the paint, the grain of the paper showing through. The look
of a painted plate in an old hardbound children's classic. This is paint on
paper, not a drawing made on a screen: no flat cel shading, no even digital
fills, no glossy highlights, no animation-still look.

Every picture in this book must look as if one person painted them all on the
same day with the same brushes and the same paints: the same line weight, the
same palette, the same way of drawing a face. A character keeps the same face,
the same build, the same age and the same clothes from one picture to the
next, so a child turning the page knows at once that it is the same person.

Classic children's literature illustration painted the way the old Korean
children's classics were painted: gouache and watercolor, bold clean outlines, rich Tudor
colors, realistic proportions with expressive faces, London in 1547: narrow
timbered lanes and crowded alleys on one side, palace halls with tapestries
and torchlight on the other; ruffs, doublets and hose; dramatic light and deep
shadow; no blood or wounds shown, no text or letters in the image.
Every person in this book has a clear, even, good-looking face: smooth skin,
straight teeth, calm bright eyes, a mouth at rest - the ordinary face of a
neighbour. This holds for the cruel ones too. Draw the cruel ones as handsome,
well-kept people you would trust on sight; what is frightening about them is
only what their hands are doing and how they stand. When one of them is angry,
the mouth is open in a shout and the brows are down, and that is all.
A person's body is drawn only as the story describes it and never as a sign of
character: beauty is not goodness here, and plainness is not badness.
Draw the moment in motion, not a posed portrait: catch people mid-stride,
mid-swing, mid-turn, mid-shout, cloth and hair and dust still moving. Faces
are big and expressive. Pick the most interesting instant in the scene and
stage it so a child wants to look at it for a while.
The artwork must bleed to all four edges of the image: no white or cream
margin, no border, no frame line, no painted paper edge, no matting.
The picture fills the whole canvas corner to corner.

Once more, so it is not missed: this is one painting with NO writing in it.
No title, no caption, no signature, no page number, no letters anywhere.
```

**두 아이는 반드시 똑같은 얼굴로 그려 주세요.** 머리 색, 눈, 키, 이목구비가 완전히 같아야 하고,
오직 옷차림과 몸가짐만 다르게 그려 주세요. 그것이 이 이야기의 전부입니다.

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Tom Canty: a thin boy of about nine with untidy brown hair, in rags at
first, later in stiff royal clothes he plainly does not know how to wear.
Prince Edward: exactly the same face — same hair, same eyes, same height — but
upright and used to being obeyed; velvet, a gold chain, a short sword at his hip.
Miles Hendon: a tall sunburnt swordsman of about thirty in a worn but once-fine
doublet, easy-going, always with a hand near his hilt.
John Canty: a big man in a labourer's coat, an unremarkable face, a cudgel
in his hand; frightening because of what he is about to do, not how he looks.
Henry VIII: a large, heavy old king propped among cushions, richly dressed,
a tired, swollen, dignified face - a sick man who is still a king.
The Yorkshire man: a thin farmer with a quiet, steady, sorrowful face.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: two boys with exactly the same face on either side of a palace gate's iron bars — one inside in velvet and gold, one outside barefoot in rags — each with a hand on the bars, looking straight at the other; London rooftops and a grey river beyond. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | An old man leaning on a stick before palace railings at dusk, a barefoot boy beside him with his face pressed to the bars, both looking in. |

## 1장 · 같은 날에 태어난 아이 둘

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | A cramped Tudor alley room with straw on the floor and several people sleeping on it; a thin boy sitting by a rushlight listening to an old priest read from a book. |
| `images/story-01-b.webp` | The same boy playing king among alley children on a rubbish heap, a bent barrel hoop on his head for a crown, the other children kneeling and laughing. |

## 2장 · 궁전 문 앞에서

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A palace gate: a guard flinging a ragged boy backward into the road while a richly dressed boy with the same face runs toward the bars from inside, furious. |
| `images/story-02-b.webp` | A royal chamber: two boys of identical face sitting on the floor talking eagerly over a tray of food, the vast room empty around them. |

## 3장 · 옷을 바꿔 입다

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | Two boys side by side before a tall mirror having swapped clothes, both staring at the reflection, unable to tell which is which. |
| `images/story-03-b.webp` | A sick king propped in an enormous bed, courtiers kneeling around, a small boy in royal clothes standing before him white with terror. |

## 4장 · 존 캔티의 손

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A rainy Tudor street at night: a huge coarse man dragging a boy by the arm, the boy resisting and shouting, passers-by looking away. |
| `images/story-04-b.webp` | A dark room full of sleeping bodies on straw: a woman kneeling with a candle held close to a boy's face, studying him, her own face full of doubt. |

## 5장 · 마일스 헨든

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | A jeering crowd in a lane backing away from a tall sunburnt soldier who has stepped between them and a small ragged boy, one hand resting on his sword hilt, the blade still sheathed. |
| `images/story-05-b.webp` | A cheap inn room: a boy seated at the table with absurd dignity while the swordsman kneels and then sits down again, half amused, half indulgent. |

## 6장 · 왕이 된 톰

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | A dressing ceremony: a dozen attendants passing a single shirt hand to hand toward a small boy standing on a stool, plainly wretched. |
| `images/story-06-b.webp` | A hall of judgement: a boy on the throne leaning forward and speaking, a woman and a little girl below him lowering their stockings while the court stares. |

## 7장 · 도둑들의 굴

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A ruined barn at night with a fire in the middle and a rough crowd of vagabonds around it, a boy sitting apart at the edge of the light. |
| `images/story-07-b.webp` | A gaunt farmer turning his shoulder toward the firelight to show his back to the others; the boy staring, the men gone silent. |

## 8장 · 다시 만난 헨든

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | A country road: the swordsman cutting a boy free from a hut doorway where a wild-eyed old hermit has bound him. |
| `images/story-08-b.webp` | A great hall: a woman standing beside a smug younger brother, saying she does not know the travel-worn man in the doorway, her face rigid. |

## 9장 · 감옥에서 본 것

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | A crowded prison room of straw and stone: old men in the remains of monks' habits, two quiet women tending a sick prisoner, a boy watching from a corner. |
| `images/story-09-b.webp` | A pillory yard: a man tied for a whipping, and a boy breaking free of the guards and running forward with his arm raised, shouting. |

## 10장 · 대관식 날

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | Westminster Abbey packed with peers, the Archbishop lifting the crown above a small boy's head, everything gold and candlelight. |
| `images/story-10-b.webp` | The same instant from the back of the nave: a barefoot boy in rags walking up the centre aisle, every head turning, guards starting toward him. |

## 11장 · 증거가 있어야 합니다

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | The two identical boys standing face to face before the throne, the whole court unable to tell them apart, the crown held between them. |
| `images/story-11-b.webp` | A boy explaining eagerly with his hands while a courtier hurries off; in the corner an armour chest standing open. |

## 12장 · 왕 앞에 앉은 사람

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | A magnificent presence chamber: a shabby travel-worn man dropping into a chair in front of the throne, the entire court frozen in horror. |
| `images/story-12-b.webp` | The young king coming down from the dais with his hand out, the man rising, courtiers falling back on both sides. |

## 13장 · 톰 캔티의 자리

| 파일명 | 장면 |
|---|---|
| `images/story-13-a.webp` | A palace room: a boy in a distinctive robe kneeling before the king, who has a hand on his shoulder. |
| `images/story-13-b.webp` | A poor woman in a doorway holding her son, who is now finely dressed, both crying, two older girls behind them. |

## 14장 · 왕이 된 뒤

| 파일명 | 장면 |
|---|---|
| `images/story-14-a.webp` | A council chamber: a boy king at the head of the table asking a question while grey-bearded councillors exchange uneasy looks. |
| `images/story-14-b.webp` | A small private room in the palace: the young king, a scarred soldier in a fine cloak and a boy in a distinctive robe sitting close together talking and laughing, no attendants anywhere. |

## 15장 · 궁전 창문

| 파일명 | 장면 |
|---|---|
| `images/story-15-a.webp` | An old white-haired man in a distinctive robe walking slowly along a riverside path in late afternoon, leaning on a stick. |
| `images/story-15-b.webp` | The old man and a barefoot boy standing together at the palace railings, the old man talking, the boy looking through the bars. |
