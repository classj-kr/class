# 제미나이 그림 프롬프트 — 삼총사

하나의 이야기를 열다섯 장으로 나눠 담았고, 장마다 그림이 두 장씩 들어갑니다.
그림이 있는 펼침면은 오른쪽 쪽에 그림 한 장이 들어가고, 그림이 없는 펼침면은 양쪽 쪽에 글만 들어갑니다.
아래 프롬프트를 제미나이에 넣어 생성한 뒤 파일명을 정확히 맞춰 `images/` 폴더에 넣으면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보입니다.)

권장 크기: **가로 4 : 세로 3** 비율, PNG.
그림이 칸을 꽉 채워야 하니 가장자리에 흰 여백이나 테두리를 두지 마세요. 그림이 네 변 끝까지 닿아야 합니다.

**단 표지(`cover.webp`)만 예외 — 세로 2 : 3 비율입니다.** 표지 그림칸은 책을 펼쳤을 때 왼쪽 반쪽 전체를 채우는데,
그 칸 자체가 세로로 긴 2:3 모양입니다. 4:3 가로 그림을 넣으면 양옆이 절반 가까이 잘려 나갑니다.

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
children's classics were painted: gouache and watercolor, bold clean outlines, rich
saturated colors, realistic human proportions with expressive faces, France
1625, wide-brimmed plumed hats, cloaks, rapiers, boots and lace collars,
narrow Paris streets and candlelit rooms, energetic and dashing mood,
sword fights shown as movement and stance, never with blood or injury,
no text or letters in the image.
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
No blood, no wounds and no cruelty shown: when something violent happens,
draw the moment just before or just after it instead.
The artwork must bleed to all four edges of the image: no white or cream
margin, no border, no frame line, no painted paper edge, no matting.
The picture fills the whole canvas corner to corner.

Once more, so it is not missed: this is one painting with NO writing in it.
No title, no caption, no signature, no page number, no letters anywhere.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
D'Artagnan: a wiry, quick-eyed boy of eighteen with dark hair, sunburnt, in a
shabby too-small doublet at first, later in a proper musketeer's uniform.
Athos: a tall grave nobleman of about thirty, pale, beautifully composed, dark
hair, always immaculate however poor.
Porthos: a huge loud man with a curled moustache, gaudy clothes, a magnificent
baldric across his chest.
Aramis: a slim handsome young man with soft manners and downcast eyes, plainer
dress than Porthos, always with a book or a letter near him.
Monsieur de Treville: a lean weathered captain of about fifty with grey hair.
Cardinal Richelieu: a thin composed man in scarlet robes with a pointed beard,
never raising his voice.
Milady: a beautiful fair-haired woman with pale blue eyes, elegant dark gowns.
Rochefort: a tall handsome man dressed in black, a faded old scar at his
temple, calm and courteous.
Constance: a young woman of twenty-five in a modest respectable dress.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: four men standing shoulder to shoulder in a narrow Paris street at dusk with their rapiers crossed high above them, plumed hats and cloaks, three seasoned musketeers and one much younger boy at the end of the line. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | Four hats laid side by side on a table beside four crossed rapiers and a folded letter, warm lamplight, an empty room. |

## 1장 · 가스코뉴에서 온 소년

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | A boy of eighteen riding a comically bony bright-yellow old horse along a country road, sitting very straight and proud, an old rapier at his side, French countryside in spring. |
| `images/story-01-b.webp` | An inn yard: the boy with his sword drawn facing a tall dark gentleman with a scar at his temple who only laughs from a window above, inn servants closing in behind the boy with sticks. |

## 2장 · 총사대장 트레빌

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A crowded courtyard full of musketeers in plumed hats and blue cloaks talking and laughing, a small shabby country boy standing among them looking very out of place. |
| `images/story-02-b.webp` | A staircase landing: the boy colliding with a pale nobleman whose arm is bandaged, the nobleman's face tightening with pain but perfectly polite. |

## 3장 · 하루에 세 번

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | An empty lot behind a convent: three musketeers standing together and a young boy facing them, all realising at once that they have all made the same appointment. |
| `images/story-03-b.webp` | Four against five: a fast sword fight in the open ground, blue cloaks against red, movement and flying capes, the young boy ducking low under a bigger man's swing. |

## 4장 · 하나는 모두를 위하여

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | Four men at a tavern table with their hands and rapier hilts joined together over the middle of the table, a single candle, four very different faces. |
| `images/story-04-b.webp` | A cramped lodging doorway at night: a frightened middle-aged shopkeeper wringing his hat, telling his story to the young man, a single lamp between them. |

## 5장 · 왕비의 심부름

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | A dark Paris street: a young man driving off two attackers from a woman with his sword, the woman pressed against a wall clutching a bundle. |
| `images/story-05-b.webp` | A palace chamber: a queen seated alone with her face in her hands, one lady-in-waiting kneeling beside her, an empty jewel case open on the table. |

## 6장 · 런던으로 가는 길

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | An inn yard at dawn: three riders galloping out through the gate while the huge musketeer stays behind squaring up to a stranger, hand on hilt. |
| `images/story-06-b.webp` | A country road at sunrise: a lone rider low over his horse's neck galloping away from a distant inn without looking back, empty fields all round him, dust rising behind. |

## 7장 · 이틀 반

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A magnificent English study: a duke opening a glass case and stopping dead, the diamond ornament in his hands, two of the studs plainly missing. |
| `images/story-07-b.webp` | A locked workroom: a jeweller bent over his bench with tools and a lamp, working through the night, twelve diamond studs laid out before him. |

## 8장 · 무도회의 밤

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | A crowded ballroom: the queen entering pale but upright, the crowd parting, the diamond studs bright on her shoulder, the king starting toward her. |
| `images/story-08-b.webp` | The cardinal in scarlet standing very still holding a small open box with two diamond studs in it, his face giving nothing away, the king staring at him. |

## 9장 · 밀라디

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | A candlelit drawing room: a beautiful fair-haired woman turning sharply, her sleeve fallen from her shoulder, a young man across the room frozen at what he has seen. |
| `images/story-09-b.webp` | A quiet room afterwards: a pale nobleman with an untouched glass in his hand telling something very old and very heavy, the young man listening without moving. |

## 10장 · 생제르베 요새의 내기

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | A ruined bastion on a battlefield: four men calmly eating breakfast at a table laid on the parapet with a servant pouring wine, muskets propped in a row beside them. |
| `images/story-10-b.webp` | The same men a moment later: two still seated eating while the other two fire over the wall, and a boulder being levered off the parapet onto the slope below. |

## 11장 · 종이 한 장

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | A lonely inn at night: a man in a cloak pressed against the wall beside a lit window and a stovepipe, listening, snow or rain falling. |
| `images/story-11-b.webp` | A stopped carriage on a dark road: a cloaked man lowering the scarf from his face at the window, the woman inside recoiling in the seat, a folded paper in her hand. |

## 12장 · 수도원의 밤

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | A convent parlour at dusk: two women together at a window, one of them looking down at riders approaching the gate and recognising them with relief. |
| `images/story-12-b.webp` | The same room minutes later: four men in the doorway, one of them kneeling to hold a woman fallen against a chair, a nun standing back with her hands to her mouth. |

## 13장 · 재판

| 파일명 | 장면 |
|---|---|
| `images/story-13-a.webp` | A bare riverside room at night: six men standing in a half circle around a seated woman, one lamp on the table, each face grave; a hooded man in red standing apart at the back. |
| `images/story-13-b.webp` | Dawn mist on a riverbank: four men walking away side by side without looking at each other, their long shadows behind them. |

## 14장 · 추기경 앞에서

| 파일명 | 장면 |
|---|---|
| `images/story-14-a.webp` | A dim study with a single candle: the cardinal in scarlet seated reading a paper aloud, a young man standing before the desk with his hat in his hands, refusing to look away. |
| `images/story-14-b.webp` | Close on the desk: the cardinal holding a folded paper into the candle flame while sliding a freshly written commission across the table, the young man's hand not yet reaching for it. |

## 15장 · 흩어지는 네 사람

| 파일명 | 장면 |
|---|---|
| `images/story-15-a.webp` | Four men around a table with a single sheet of paper in the middle, the eldest writing a name in the blank space while the other three watch. |
| `images/story-15-b.webp` | A courtyard of young recruits seen from a doorway, and a young captain in a musketeer's cloak watching them from the step, older now, one hand on the doorframe. |
