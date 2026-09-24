# 제미나이 그림 프롬프트 — 타임 머신

하나의 이야기를 열두 장으로 나눠 담았고, 장마다 그림이 두 장씩 들어갑니다.
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
proportions with expressive faces. Two worlds: late-Victorian London in the
1890s — a panelled dining room with a coal fire, gaslight, a cluttered
workshop of brass, ivory and quartz; and the year 802,701 — a warm overgrown
parkland of unfamiliar flowers, huge ruined stone halls half swallowed by
green, and a weathered white sphinx on a bronze pedestal.
No blood or wounds shown. No text or letters in the image.
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

**엘로이를 귀엽게만 그리지 마세요.** 예쁘고 작고 부드럽게 그리되,
그 얼굴에 **아무 생각도 담기지 않은 느낌**이 있어야 합니다. 그것이 이 책에서 제일 무서운 부분입니다.

**몰록을 괴물로 그리지 마세요.** 흰 살갗에 큰 눈, 굽은 등 — 어둠에 맞게 바뀐 사람으로 그려 주세요.
사람의 손과 사람의 얼굴이어야 합니다. 그래야 10장이 통합니다.

**빛의 방향으로 두 세계를 나눠 주세요.** 지상은 위에서 오는 밝고 따뜻한 빛,
지하와 몰록 장면은 성냥불 하나에서 오는 아래쪽 빛으로 그려 주세요.

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
The Time Traveller: a wiry Englishman of about forty, pale, high forehead,
in a tweed suit; from chapter 3 onward increasingly torn, dust-covered and bruised,
his hair going grey by the end.
The dinner guests: half a dozen Victorian gentlemen in evening dress.
The Time Machine: a saddle mounted on a frame of nickel, ivory and brass with
two crystal-and-quartz bars and two small levers in front of the seat.
The Eloi: slender people about four feet tall, curling hair, delicate chins,
very large soft eyes, faces beautiful and blank; loose purple and pink tunics,
bare feet. Adults look like children.
Weena: one of the Eloi, distinguished only by always being near him and by
carrying flowers.
The Morlocks: white-skinned stooping people with colourless hair and huge
lidless eyes, human hands; they shield their faces from any light.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a man on a strange brass and crystal machine mid-journey, the world around him blurred into streaks — a dark blue sky with the sun drawn as a band of fire across it, buildings rising and falling as smears on either side; his face lit and rigid. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | An empty Victorian workshop with the doors standing open, a bare patch of floor where something heavy used to stand, dust in the light. |

## 1장 · 목요일 저녁의 손님들

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | A Victorian dining room after dinner: gentlemen in evening dress in armchairs around a coal fire, the host leaning forward mid-argument, hands describing something in the air. |
| `images/story-01-b.webp` | A close view of a small brass-and-ivory model on a table, one man's finger just leaving a tiny lever, the model already going indistinct at the edges. |

## 2장 · 이레 뒤

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A dining room doorway: a dust-covered limping man in a torn coat, grey at the temples, no shoes; every guest at the table turned toward him and frozen. |
| `images/story-02-b.webp` | The same man cleaned up and in fresh clothes, sitting by the fire beginning to speak, the others leaning in. |

## 3장 · 출발

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | A workshop interior seen from the saddle of the machine: the wall clock's hands spinning into a blur, everything else starting to smear. |
| `images/story-03-b.webp` | A man sprawled on wet grass in a hailstorm beside an overturned machine, one arm over his head. |

## 4장 · 하얀 스핑크스

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A huge weathered white sphinx on a bronze pedestal standing over a meadow of strange flowers, its face pitted with age, looking down at a small man. |
| `images/story-04-b.webp` | Slender four-foot people in coloured tunics crowding around a tall Victorian man, laughing, one of them hanging a chain of flowers around his neck. |

## 5장 · 엘로이

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | The inside of a vast ruined hall, half its roof gone and green growing through: low tables heaped with unfamiliar fruit, small people eating and laughing, no work of any kind anywhere. |
| `images/story-05-b.webp` | A man sitting alone on a hillside at evening writing in a notebook, the beautiful ruined landscape below him. |

## 6장 · 기계가 사라지다

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | An empty patch of trampled grass at night with a man on his knees running his hands over it. |
| `images/story-06-b.webp` | The base of the sphinx by daylight: two bronze panels set into the pedestal, and drag marks in the turf running straight up to them. |

## 7장 · 위나

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A river: a man wading out to lift a small limp figure from the current, and on the bank a dozen others watching without moving. |
| `images/story-07-b.webp` | A small Eloi woman pushing two flowers into the pocket of a man's ragged coat, the man looking down at her. |

## 8장 · 우물

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | A round bronze-rimmed well set flush in a grassy slope, a man kneeling with his ear to the rim, wind visibly moving his hair upward out of it. |
| `images/story-08-b.webp` | Half-dark before dawn among ruins: a pale stooping figure caught mid-turn, one hand up against the light, its face just visible — clearly human. |

## 9장 · 땅 아래

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | Looking straight down a deep shaft with iron rungs set in the wall, a man far down it, the circle of daylight small above. |
| `images/story-09-b.webp` | A vast underground machine hall by the light of a single match held up: great machines turning, and pale figures all around with their arms across their eyes. |

## 10장 · 두 종족

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | A man sitting alone on a ruined step at night, thinking, the sleeping halls behind him and a bronze well cover in the foreground. |
| `images/story-10-b.webp` | A split composition: above, a Victorian street with well-dressed people; below, the same city's underground — furnaces, tunnels, and workers who never see the sun. |

## 11장 · 숲의 불

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | Inside a huge ruined hall of green porcelain: rows of broken display cases, a fossil skeleton, books collapsing into dust, a man lifting an iron bar out of a case. |
| `images/story-11-b.webp` | A forest fire at night: a man running with an iron bar, pale figures blundering blindly between the trees away from the light, smoke everywhere. |

## 12장 · 더 먼 곳

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | A cold beach under a huge dull red sun fixed low in the sky, a still oily sea, black lichen on the rocks, and one enormous crab-like shape at the water's edge; a small machine and a man on it. |
| `images/story-12-b.webp` | A dining room table with two withered flowers lying on the cloth, and a doctor holding one up to the lamp, his face changed. |
