# 제미나이 그림 프롬프트 — 몽테크리스토 백작

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
children's classics were painted: gouache and watercolor, bold clean outlines, saturated
but slightly muted colors, realistic human proportions with expressive faces,
France 1815-1839, Marseille harbour, stone prison cells, and the drawing rooms
of Paris, dramatic light and deep shadow, serious mood, no blood or wounds
shown, no text or letters in the image.
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

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Edmond Dantes (young): a healthy open-faced sailor of nineteen, black hair,
sunburnt, plain sailor's jacket, easy smile.
Edmond Dantes (in prison): the same man grown gaunt and pale, long tangled
hair and beard, ragged shirt.
The Count of Monte Cristo: the same man at forty — very pale, black hair, dark
piercing eyes, immaculate black coat and white cravat, calm and still, never
smiling with his eyes.
Abbe Faria: a frail white-haired old priest with a high forehead and brilliant
eyes, in prison rags.
Mercedes: a Catalan girl with black hair and dark eyes, in a simple bright
dress as a girl; later a grave, still-beautiful woman in dark silk.
Danglars: a solid careful man who is always working something out, later a
prosperous banker in a gold-buttoned coat; a respectable-looking man throughout.
Fernand: a lean intense fisherman in a red cap, later a decorated general in a
blue uniform heavy with medals.
Villefort: a rigid pale prosecutor with severe features, always in black.
Haydee: a young Greek woman with dark hair, in embroidered Greek dress.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a pale man in an immaculate black coat standing at a high window at night looking down over the rooftops of Paris, an old iron key in his hand; faint behind him, half in shadow, a barred prison window and the sea. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | An empty stone shore at sunrise with a single white sail already far out on the horizon, a folded letter left on the rock in the foreground. |

## 1장 · 파라온 호가 돌아오다

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | A three-masted merchant ship gliding slowly into Marseille harbour under half sail, a crowd on the quay, a young sailor at the rail with his hat in his hand, a small boat pulling out to meet her. |
| `images/story-01-b.webp` | A dim tavern room at night: three men at a table, one writing a letter with his left hand while the others watch, an oil lamp between them, a lean man in a red cap staring at the paper. |

## 2장 · 약혼식의 손님

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A bright village betrothal feast interrupted: gendarmes filling the doorway, guests half risen, a young sailor standing calmly while a dark-haired girl grips his arm. |
| `images/story-02-b.webp` | A magistrate's study at night: a rigid young prosecutor holding a letter into a candle flame, the paper already burning, a young sailor seated in the background still looking relieved. |

## 3장 · 이프 섬의 열네 해

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | A small stone island fortress rising black out of a night sea, one lantern at the water gate, a boat approaching it. |
| `images/story-03-b.webp` | A dark underground cell: a hole broken through the base of the wall and a frail white-haired old man in rags crawling through it, a gaunt young prisoner staring at him in the lamplight. |

## 4장 · 누가 나를 가두었는가

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A cell by lamplight: the old priest seated on the stone floor counting something off on his fingers, the young man risen to his feet with his back against the wall, stricken, his breath gone. |
| `images/story-04-b.webp` | The same cell later: the old man teaching, sheets of homemade paper spread out, a pen made from a fish bone, both men absorbed, a single shaft of light from a tiny high window. |

## 5장 · 몬테크리스토 섬

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | The old priest dying on his straw bed holding out a yellowed folded paper to the younger man, whose hand is closing over it. |
| `images/story-05-b.webp` | A prison rampart at night: two guards swinging a sewn canvas sack out over a low parapet toward the black sea far below, wind and spray. |

## 6장 · 바다에서

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | Underwater then surface: a man cutting his way out of a sinking canvas sack and striking upward, the dark shape of the island fortress above and behind him. |
| `images/story-06-b.webp` | Inside a rock cave lit by one torch: three opened chests spilling gold coins, gold bars and jewels, a ragged man on his knees before them, his face turned up and laughing. |

## 7장 · 은인을 찾아서

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A shabby roadside inn: a priest in a black cassock holding up a large diamond by candlelight while a greedy innkeeper stares at it, unable to look away. |
| `images/story-07-b.webp` | A Marseille quay in bright afternoon: a brand-new three-masted ship coming in under full sail with fresh paint and new canvas, an old shipowner weeping on the dock, crowds cheering. |

## 8장 · 몽테크리스토 백작

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | Roman carnival at night: crowded street, masks and streamers and torches, a pale man in black standing perfectly still at the centre of the chaos. |
| `images/story-08-b.webp` | A bandits' cave: a rough armed chief snatching off his hat and bowing to a calm man in a black coat who has just walked in, a bewildered young Frenchman being untied behind them. |

## 9장 · 파리의 세 사람

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | A glittering Paris salon: a pale count in black at the centre, a fat banker, a rigid prosecutor and a decorated general all turned toward him, none of them recognising him. |
| `images/story-09-b.webp` | A dark garden by a wall at night: a man lying against the stones and a figure kneeling over him holding a candle up to his own face, the dying man's eyes wide with recognition. |

## 10장 · 야니나에서 온 증언

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | A grand chamber of the House of Peers: a young woman in a plain black dress standing alone and unveiled before the assembly, an old folded deed held out in her hand, a general in medals half risen from his seat, white-faced. |
| `images/story-10-b.webp` | A study late at night: a veiled woman letting her veil fall to reveal an older Mercedes, kneeling before a pale man in black who stands utterly still. |

## 11장 · 결투장의 아침

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | A misty morning clearing in a wood: seconds standing with a pistol case, a young man walking forward and taking off his hat before a pale man in black instead of raising a weapon. |
| `images/story-11-b.webp` | A great town house drawing room: a pale man having stepped out in a worn old sailor's jacket over his fine clothes, and a general in full uniform backing away until he strikes the wall. |

## 12장 · 무너지는 은행

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | A banker's private office in disarray: an open empty safe, ledgers scattered, a fat man clutching a bundle of notes to his chest, clerks visible through the glass door. |
| `images/story-12-b.webp` | A bandit cave: a broken fat man sitting on stone paying a fortune in notes for one small loaf of bread and a bottle of water, a bandit chief looking on impassively. |

## 13장 · 검사장의 집

| 파일명 | 장면 |
|---|---|
| `images/story-13-a.webp` | A packed courtroom: the prisoner in the dock standing and pointing at the prosecutor, the prosecutor gripping the edge of his bench with a bloodless face, the room frozen. |
| `images/story-13-b.webp` | An overgrown garden at dusk: a dishevelled man in a black coat digging aimlessly in the earth with a spade, mud on his sleeves, a pale visitor watching him from the gate. |

## 14장 · 너무 멀리 갔다

| 파일명 | 장면 |
|---|---|
| `images/story-14-a.webp` | An empty prison cell shown to a visitor by lantern light: one wall covered edge to edge with tiny scratched marks, a pale man in black standing before it with his hat in his hands, a bored guide holding the lantern. |
| `images/story-14-b.webp` | A cave chamber on an island turned into a beautiful room: a door opening and a young woman standing alive in the light, a young man falling to his knees in the doorway. |

## 15장 · 기다리고 바라라

| 파일명 | 장면 |
|---|---|
| `images/story-15-a.webp` | A young couple on an island shore reading an open letter together, the sea behind them, morning light. |
| `images/story-15-b.webp` | The deck of a yacht at night far out at sea: a pale man at the rail looking ahead and a young woman in Greek dress standing quietly beside him, stars and a long wake behind. |
