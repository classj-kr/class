# 제미나이 그림 프롬프트 — 엄마 찾아 삼만리

하나의 이야기를 열한 장으로 나눠 담았고, 장마다 그림이 두 장씩 들어갑니다.
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
children's classics were painted: gouache and watercolor, bold clean outlines, realistic
child proportions with expressive faces; the 1880s — the port and stone
alleys of Genoa; the crowded steerage deck of an emigrant steamship; the
broad new avenues of Buenos Aires; the endless flat pampas; the dry scrubland
and ox-cart trails of northern Argentina; and the Andes foothills at Salta.
Working clothes of the period. No blood or wounds shown.
No text or letters in the image.
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

**거리감이 이 책의 전부입니다.** 장이 넘어갈 때마다 배경이 더 멀고 더 낯설어져야 합니다.
1~2장은 지중해의 돌과 붉은 기와, 3장은 좁고 어두운 배 밑바닥, 4~5장은 끝이 없는 평지,
6~8장은 마르고 뜨거운 땅과 높아지는 산. 그리고 마르코는 장마다 조금씩 더 여위고
옷이 낡아 있어야 합니다.

**가난한 이민자를 불쌍한 구경거리로 그리지 마세요.** 삼등실 사람들은 다 자기 사정이
있어서 배를 탄 사람들입니다. 얼굴에 저마다 다른 표정을 넣어 주세요.

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Marco: a thirteen-year-old Italian boy, dark hair, a serious set face; a
jacket and cap that get visibly more worn as the book goes on; one small bag.
He never begs and never looks pathetic — he looks determined and tired.
Marco's mother: a woman of about thirty-five; seen healthy in chapter 1, and
in chapters 9-11 very thin and grey, then slowly recovering.
Marco's father: a hospital worker of about forty-five, careworn.
The ox-cart drivers: weathered men of mixed Spanish, Italian and Indigenous
descent — draw them as individuals, competent and matter-of-fact.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a boy alone at the rail of a big steamship at dusk with a small bag at his feet, looking forward at open ocean; behind him the whole crowded steerage deck, and far astern the last of the Italian coast. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | A quay at Genoa in summer light with a gangway down and two figures walking off it, and two men on the quay starting forward. |

## 1장 · 떠난 어머니

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | The port of Genoa in the 1880s: an emigrant steamship at the quay and hundreds of people with bundles going up the gangway, families saying goodbye below. |
| `images/story-01-b.webp` | A small Genoese kitchen: a boy of thirteen at a table with a stack of letters spread out in front of him, counting the dates. |

## 2장 · 가겠습니다

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | The same kitchen at night: a boy standing and speaking, a father seated with his hands over his face, an older brother in the doorway. |
| `images/story-02-b.webp` | A quayside shipping office: a small boy at the counter asking a busy clerk about the cheapest passage while dockers push past him, a stub of pencil and a scrap of paper in his hand. |

## 3장 · 스물일곱 날

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | The steerage deck below the waterline: three tiers of bunks against the bulkheads, no portholes, dozens of people of all ages, each face different. |
| `images/story-03-b.webp` | The open deck at night: a boy sitting alone against a ventilator with his knees up, ocean beyond the rail, no land anywhere. |

## 4장 · 부에노스아이레스

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A wide new avenue in Buenos Aires crowded with people and carriages, new brick houses and scaffolding running away to the horizon, a small boy standing still in the middle of the pavement with a bag, looking up. |
| `images/story-04-b.webp` | A train window looking out on the pampas: absolutely flat grassland to the horizon, no tree, no house, one line of telegraph poles. |

## 5장 · 코르도바

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | A colonial-era street in Córdoba with white walls and a church tower, a boy going from door to door asking. |
| `images/story-05-b.webp` | A yard where a line of ox carts is being loaded for a long journey, a boy talking up to the wagon-master. |

## 6장 · 소달구지 길

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | A line of high-wheeled ox carts crawling across dry scrub under a huge sky, a boy walking beside the lead team in the dust. |
| `images/story-06-b.webp` | A camp at night: carts drawn up, a fire, people of several backgrounds sitting round it, one old man talking to a boy. |

## 7장 · 투쿠만

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A doorway in Tucumán: a boy holding onto the doorframe having just been told something, a servant standing in the door. |
| `images/story-07-b.webp` | A dusty road at dawn with a man handing a boy the reins of a horse, the man's hand on the boy's shoulder. |

## 8장 · 살타

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | The road rising into the Andes foothills, thin dry air, cactus and red rock, a boy on a tired horse. |
| `images/story-08-b.webp` | A hallway in a Salta house: a boy at the foot of a staircase looking up, an owner speaking to him quietly. |

## 9장 · 그 방

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | A closed door at the top of stairs with a boy standing in front of it, hand not yet on the handle. |
| `images/story-09-b.webp` | A dim bedroom: a very thin woman half risen from the bed with both hands on a boy's face, people crowding into the doorway behind. |

## 10장 · 수술

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | A bedside: a doctor with a bag on one side, a boy holding a woman's hand on the other, the woman looking at the boy. |
| `images/story-10-b.webp` | Weeks later in the same sickroom: a very thin woman in a shawl taking a few unsteady steps toward the window with her son's arm under hers, the shutters open at last and light on the floor. |

## 11장 · 돌아가는 길

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | The steerage deck again on the voyage home, a woman and a boy sitting side by side on a hatch cover, talking. |
| `images/story-11-b.webp` | Genoa quay: a man and a young man standing among the crowd, both looking hard at the gangway; the man's hat in his hands. |
