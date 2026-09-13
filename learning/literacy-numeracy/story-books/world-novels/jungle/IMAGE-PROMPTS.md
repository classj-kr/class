# 제미나이 그림 프롬프트 — 정글북

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
children's classics were painted: gouache and watercolor, bold clean outlines, accurate
animal anatomy with expressive faces; central India — the Seeonee hills, sal
and teak forest, red laterite rock, the Waingunga river, a ruined sandstone
city swallowed by fig roots; and a walled farming village of mud and thatch
with buffalo, cattle and a great banyan tree in the square.
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

**마을 사람들을 무지하거나 우스꽝스럽게 그리지 마세요.**
이 마을은 밭을 갈고 물소를 치며 사는 보통 사람들의 마을입니다.
옷차림과 살림을 그 지역의 것으로 정확하게, 그리고 품위 있게 그려 주세요.
허풍을 떠는 사람은 사냥꾼 벌데오 한 사람뿐이고, 그것도 그 사람의 성격이지 마을의 성격이 아닙니다.
메수아는 아이를 잃은 어머니이고, 이 이야기에서 모글리에게 가장 다정한 사람입니다.

**짐승을 사람처럼 그리지 마세요.** 두 발로 서게 하거나 옷을 입히지 말고,
표정만 살려서 진짜 늑대, 진짜 곰, 진짜 표범으로 그려 주세요.

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Mowgli: an Indian boy, nine in the early chapters, eleven or twelve in the middle,
and seventeen at the end;
brown skin, long black hair, no clothes at first and a simple cloth later;
scars on his arms; he always looks directly at whoever he faces.
Mother Wolf (Raksha): a large grey she-wolf, scarred, very steady eyes.
Akela: an old grey wolf, white at the muzzle, many old scars.
Baloo: a big sleepy brown bear, sitting more often than standing.
Bagheera: a black panther, sleek, the rosettes just visible in strong light.
Kaa: an enormous rock python, thirty feet, patterned brown and gold.
Shere Khan: a big tiger who carries one foreleg badly.
Messua: an Indian village woman of about thirty-five in a plain sari.
Buldeo: a village hunter with an old matchlock gun and a big moustache.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: an Indian boy of about twelve crouched on a moonlit rock at the edge of a jungle clearing, wolves gathered in the darkness behind and below him, a black panther beside him; the boy looking straight out of the picture. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | A boy walking away down a path between green fields toward a village at dawn, and at the treeline behind him a single wolf sitting and watching. |

## 1장 · 밤에 온 아기

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | Evening at a cave mouth in the Seeonee hills: a big male wolf stretching, a jackal cringing at a distance with a bone. |
| `images/story-01-b.webp` | A naked toddler standing in the moonlight at the mouth of the cave, one hand out, looking up at a wolf twice his height; the wolf twisted mid-spring, checking himself. |

## 2장 · 굴 앞에 선 호랑이

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A tiger's head and shoulders filling a narrow cave mouth, unable to get further in; inside, only two eyes shining in the dark. |
| `images/story-02-b.webp` | Inside the cave: a she-wolf standing over a human baby among four wolf cubs, her head lowered and her teeth bared toward the entrance. |

## 3장 · 회의 바위

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | A wide flat rock under a full moon crowded with forty wolves, a naked child standing alone in the middle of them, an old grey wolf on the highest point. |
| `images/story-03-b.webp` | A black panther stepping up onto the edge of the rock with a freshly killed bull lying on the ground below, the wolves turning toward it. |

## 4장 · 정글의 법

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A big brown bear teaching: a boy of nine sitting in front of him reciting, the bear's paw raised; forest floor, dappled light. |
| `images/story-04-b.webp` | A boy staring calmly into the eyes of a full-grown wolf that turns its head away from him, a black panther watching the two of them from a rock. |

## 5장 · 반다르로그

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | Monkeys crowding the branches around a boy sitting alone high in a tree, all of them talking at once. |
| `images/story-05-b.webp` | Seen from above the canopy: a boy being carried at speed through the treetops by two monkeys, and a kite wheeling in the sky above him. |

## 6장 · 차가운 굴

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | A ruined red sandstone city swallowed by jungle — collapsed domes, fig roots splitting the walls, a dry tank — swarming with monkeys. |
| `images/story-06-b.webp` | An enormous old rock python stretched along a warm rock beside his freshly shed skin, a black panther and a big brown bear speaking to him from a careful distance. |

## 7장 · 붉은 꽃

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A boy crouched outside a village wall at night looking through a doorway at a clay fire pot glowing inside a hut. |
| `images/story-07-b.webp` | The same boy in the jungle feeding dry twigs into a pot of embers, his face lit orange, watching it with total concentration. |

## 8장 · 무리가 갈라지다

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | The council rock at night in uproar, wolves on their feet snarling at each other, a tiger's head visible at the lower edge of the rock. |
| `images/story-08-b.webp` | A boy standing upright holding a burning branch, wolves backing away in a ring around him, a tiger crouched flat at his feet. |

## 9장 · 마을

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | A village gate at morning: a wild-looking boy sitting in the dust, villagers gathered at a careful distance, and one woman pushing forward through them. |
| `images/story-09-b.webp` | Evening under a great banyan tree: villagers seated in a circle listening to a hunter with an old matchlock telling a story, and one boy at the edge plainly not believing a word. |

## 10장 · 물소 떼

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | A boy lying full length on the back of a buffalo in a wide pasture, the herd grazing around him, the jungle a dark wall on the horizon. |
| `images/story-10-b.webp` | The edge of the pasture at dusk: a grey wolf standing just clear of the trees and a boy walking toward it with both arms out. |

## 11장 · 협곡

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | A narrow ravine between sheer rock walls seen from above, a tiger asleep on the floor of it, and a boy looking down from the rim. |
| `images/story-11-b.webp` | Two hundred buffalo pouring into the head of the ravine in a wall of horns and dust, seen from the rim. |

## 12장 · 쫓겨나다

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | A hunter flat on his back on the ravine floor with a grey wolf standing over him, and a boy kneeling nearby working a tiger skin loose with his bare hands. |
| `images/story-12-b.webp` | A closed village gate at sunset, figures on the wall above throwing stones, and a boy standing in the road below with a rolled skin over his shoulder, stones landing around him, not moving. |

## 13장 · 붉은 개

| 파일명 | 장면 |
|---|---|
| `images/story-13-a.webp` | Deer, boar and peafowl all streaming north through the forest at night, away from something. |
| `images/story-13-b.webp` | A boy sitting in front of the coiled head of an enormous python in a cave, the two of them talking, everything very still. |

## 14장 · 강 위의 싸움

| 파일명 | 장면 |
|---|---|
| `images/story-14-a.webp` | A cliff face hung with hundreds of wild bee combs above a river, a boy leaping out from the top of it toward the water far below. |
| `images/story-14-b.webp` | Dawn on a river bank after the fight: an old grey wolf lying still with a young man kneeling beside him, mist on the water. |

## 15장 · 봄의 달음질

| 파일명 | 장면 |
|---|---|
| `images/story-15-a.webp` | A young man standing alone on a hilltop at dawn looking down at cultivated fields and a village, jungle behind him. |
| `images/story-15-b.webp` | The council rock at evening: a young man kneeling with both hands on the face of an old half-blind bear, a black panther and a python beside them. |
