# 제미나이 그림 프롬프트 — 서유기

하나의 이야기를 열여섯 장으로 나눠 담았고, 장마다 그림이 두 장씩 들어갑니다.
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
children's classics were painted: gouache and watercolor, bold clean outlines, expressive
faces; Tang-dynasty China and the Silk Road westward — Chang'an's tiled
avenues, the Gobi and Taklamakan deserts, oasis towns, the Pamir and Himalaya
ranges, Indian monasteries; and above them a heaven of jade terraces, cloud
staircases, peach orchards and cinnabar furnaces.
Tang dress: round-collared robes, monks' kasaya, court officials in silk with
long sleeves. Rich colour, gold, cloud scrollwork.
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

**손오공을 사람 얼굴의 원숭이로 그려 주세요.** 진짜 원숭이도 아니고 사람도 아닌
중간입니다. 몸은 원숭이인데 자세와 눈빛은 사람입니다. 옷을 입고 있고,
머리에 금테를 둘렀습니다. 3장부터 15장 앞까지 그 금테가 반드시 보여야 하고,
15장 마지막 그림에서만 없어야 합니다. 그것이 이 책의 마지막 한 방입니다.

**저팔계를 웃음거리로만 그리지 마세요.** 얼굴은 돼지이고 배가 나왔지만,
힘이 아주 셉니다. 싸움 장면에서는 제대로 싸우는 모습으로 그려 주세요.

**하늘을 위엄 있게만 그리지 마세요.** 이 소설은 하늘의 관리들을 우습게 그립니다.
옥황상제와 신하들의 얼굴에 당황과 곤혹을 넣어 주세요.

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Sun Wukong: a monkey the size of a small man, golden-brown fur, a sharp
intelligent face, fiery gold-rimmed eyes; a short tunic and a tiger-skin kilt,
and a thin gold band around his head. Carries an iron staff with gold caps.
Tang Sanzang (Xuanzang): a young monk with a serene, slightly helpless face,
a fine kasaya robe, riding a white horse. No weapons, no fighting stance ever.
Zhu Bajie: a pig-headed man with a big belly and a nine-toothed rake; strong
and capable in fights, lazy and hungry everywhere else.
Sha Wujing: a broad grim-faced man with a rope of skulls, a monk's staff; he
carries the entire luggage in every single picture.
The white horse: a fine white horse; in the last picture, a dragon.
The Jade Emperor: an elderly ruler on a jade throne who never looks confident.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: four travellers and a white horse crossing a vast desert dune at sunset, tiny against the sky — a monk on horseback, a monkey striding ahead with a staff on his shoulder, a pig-headed man trudging, and a broad man behind carrying all the luggage; far above them in the clouds, faint, a giant open hand. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | A monkey's hand raised to his own forehead, and nothing there — no band, just fur; behind him a sunrise over mountains. |

## 1장 · 돌에서 난 원숭이

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | A newborn monkey on a mountain summit standing upright on two legs, bowing low toward each of the four directions, two straight beams of light shooting from his eyes up through the clouds. |
| `images/story-01-b.webp` | A great split boulder on a mountain summit with light pouring out of the crack, and a small monkey standing upright in it, eyes blazing. |

## 2장 · 원숭이 왕

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A monkey leaping headfirst through a waterfall, hundreds of other monkeys watching from the rocks. |
| `images/story-02-b.webp` | A feast in a cave hall gone silent, all the monkeys staring at their king, who is sitting on a stone throne crying. |

## 3장 · 재주를 배우다

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | A mountain hermitage courtyard at night: a monkey slipping through a back door while everyone else sleeps. |
| `images/story-03-b.webp` | A monkey standing on a small cloud high above a valley, arms out, plainly delighted with himself. |

## 4장 · 여의봉

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | An undersea palace of coral and pearl: a monkey with both hands on an enormous iron pillar that is glowing, a dragon king watching in dismay. |
| `images/story-04-b.webp` | The underworld's records office: a monkey holding a huge ledger open and crossing out a line with a brush, officials in dark robes helpless around him. |

## 5장 · 하늘을 뒤집다

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | A heavenly peach orchard: a monkey lying along a branch eating, cores dropping through the clouds below. |
| `images/story-05-b.webp` | A heavenly banquet eaten bare before the guests arrived — emptied dishes, a tipped wine jar, serving maids asleep across the floor — and one small figure going out through the gate with a jar under each arm. |

## 6장 · 손바닥 다섯 손가락

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | A vast open palm seen from above with a tiny monkey standing on it, and five enormous pillars rising at the edge of the world in the distance. |
| `images/story-06-b.webp` | A bare mountain with a paper charm on the summit and one monkey's head and one arm protruding from the rock at its foot, moss and grass grown over him. |

## 7장 · 삼장법사

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A court in Chang'an: an emperor asking a question of a hall full of officials, everyone looking at the floor, one young monk stepping forward. |
| `images/story-07-b.webp` | A monk kneeling at the foot of a mountain, peeling a charm from the rock; the rock beginning to crack open. |

## 8장 · 머리테

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | A roadside: a monkey shooting away on a cloud in one direction, and a monk sitting alone on a rock with the horse, doing nothing. |
| `images/story-08-b.webp` | A monkey on the ground clutching his head with both hands, a thin gold band biting into his brow; a monk standing a few steps away reciting, uncomfortable about it. |

## 9장 · 저팔계와 사오정

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | A village bedroom at night: a pig-headed man with a rake reeling backwards from a monkey who has just thrown off the bride's quilt, the door splintering behind him. |
| `images/story-09-b.webp` | A wide river crossing: all four travellers on the bank, the broad grim one shouldering the entire load while the others carry nothing. |

## 10장 · 백골 요괴

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | A mountain path: a young woman with a food basket approaching a monk, and behind her a monkey with his staff already raised and his eyes narrowed. |
| `images/story-10-b.webp` | The same path afterwards: a pile of white bones on the ground, a monk pointing angrily down the road, a monkey bowing three times before leaving. |

## 11장 · 화염산

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | A mountain range on fire for as far as the eye can see, red rock and flame, four travellers halted at a distance with their sleeves over their faces. |
| `images/story-11-b.webp` | A palm-leaf fan being swung once and a wall of flame going out along an entire ridge, rain already starting behind it. |

## 12장 · 진짜와 가짜

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | Two identical monkeys with identical staffs mid-fight in the air, impossible to tell apart, onlookers below at a complete loss. |
| `images/story-12-b.webp` | A great hall where a seated buddha reaches out one hand toward the two identical monkeys, and everyone else — kings, judges, immortals — stands back. |

## 13장 · 여든한 가지 어려움

| 파일명 | 장면 |
|---|---|
| `images/story-13-a.webp` | A palace hall where a monkey stands before a throne holding open his own robe with several red shapes in his hands, the king recoiling; children being led out safely at the back. |
| `images/story-13-b.webp` | A defeated monster on the ground turning back into an ordinary animal, and a heavenly official descending on a cloud to collect it, entirely unembarrassed. |

## 14장 · 글자 없는 경전

| 파일명 | 장면 |
|---|---|
| `images/story-14-a.webp` | A bottomless boat on a wide river with four travellers aboard, and a body floating past in the current that has the monk's own face. |
| `images/story-14-b.webp` | A monastery courtyard: scroll cases open on a table and the pages inside completely blank, four travellers staring at them. |

## 15장 · 머리테가 사라지다

| 파일명 | 장면 |
|---|---|
| `images/story-15-a.webp` | Scriptures spread out to dry on flat rocks by a river, one scroll's corner torn away and stuck to the stone. |
| `images/story-15-b.webp` | A monkey with one hand on his own forehead and an astonished face, the gold band simply gone; a monk beside him smiling. |

## 해설 · 읽고 나서 (16장이던 그림)

| 파일명 | 장면 |
|---|---|
| `images/story-16-a.webp` | The four travellers walking away from the viewer along a mountain road, each one a completely different shape and gait, the luggage still on the last one's back. |
| `images/story-16-b.webp` | A single monk walking alone across a desert at sunrise with a pack and a staff, footprints trailing behind him and no companions anywhere, the way the real journey happened. |
