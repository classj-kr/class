# 제미나이 그림 프롬프트 — 보물섬
명작 소설 트랙의 첫 책입니다. 하나의 이야기를 열여섯 장으로 나눠 담았고, 장마다 그림이 두 장씩(마지막 16장만 세 장) 들어갑니다.
그림이 있는 펼침면은 오른쪽 쪽에 그림 한 장이 들어가고, 그림이 없는 펼침면은 양쪽 쪽에 글만 들어갑니다.
아래 프롬프트를 제미나이에 넣어 생성한 뒤 파일명을 정확히 맞춰 `images/` 폴더에 넣으면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보입니다.)

권장 크기: **가로 4 : 세로 3** 비율, PNG.
그림이 칸을 꽉 채워야 하니 가장자리에 흰 여백이나 테두리를 두지 마세요. 그림이 네 변 끝까지 닿아야 합니다.

**단 표지(`cover.webp`)만 예외 — 세로 2 : 3 비율입니다.** 표지 그림칸은 책을 펼쳤을 때 왼쪽 반쪽 전체를 채우는데,
그 칸 자체가 가로로 넓은 4:3이 아니라 세로로 긴 2:3 모양입니다. 4:3 가로 그림을 넣으면 양옆이 절반 가까이 잘려 나갑니다.

## 공통 스타일 지시문 (모든 프롬프트 앞에 붙여서 쓰세요)

고학년용 명작 소설이라 동화 쪽보다 그림체가 조금 더 사실적입니다.

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

Classic children's adventure novel illustration painted the way the old Korean
children's classics were painted: gouache and watercolor, bold clean outlines, saturated
but slightly muted colors, realistic human proportions with expressive faces,
18th-century English coastal and seafaring setting, dramatic staging and
strong light-and-shadow, no text or letters in the image.
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
Jim Hawkins: a lean boy of about thirteen, tousled brown hair, plain brown
waistcoat over a loose linen shirt, breeches and worn buckled shoes.
Billy Bones (the captain): a huge weather-beaten old sailor in his sixties,
tarry pigtail, an old faded sabre scar across one cheek, blue sea coat,
brass telescope under his arm.
Doctor Livesey: a neat slim gentleman, powdered white wig, black coat with a
crisp white collar, calm steady eyes.
Black Dog: a pale quiet man missing two fingers on his left hand, shabby blue
coat, cutlass at his hip; a pleasant enough face — he is dangerous because he
is calm, not because he looks it.
Blind Pew: a bent old blind man in an enormous ragged hooded sea-cloak far too
big for him, green shade over his eyes, tapping a stick.
Jim's mother: a thin tired woman in a plain apron and white cap.
Long John Silver: a very tall powerful man about fifty, LEFT LEG COMPLETELY
GONE AT THE HIP - the empty left trouser leg is pinned or folded up, there is
NO left foot, NO boot and NO wooden peg on that side. He stands and walks on
his one right leg and a wooden crutch under his left arm. This missing leg is
not a mark of evil, it is a plain fact of the story - the boy has been warned
all his life about "the one-legged sailor", so it must be plainly visible in
every picture he appears in. Broad sun-browned intelligent face, almost always
smiling. On his shoulder sits a small ALL-GREEN parrot the size of a pigeon:
green head, green face, green breast, green back, green wings, green tail.
The only colour that is not green is a narrow band of dusky red on the very
forehead just above the beak. It is a small amazon parrot, NOT a macaw: no
long tail streamers, no red face, no red breast, no blue, no yellow. If any
part of the bird below the eyes is red, it is wrong.
Squire Trelawney: a large loud red-faced gentleman in a fine coat.
Captain Smollett: a compact stern officer in a plain blue naval coat, sharp
eyes, never smiling.
Israel Hands: a lean capable sailor, quiet and watchful, an ordinary face.
Ben Gunn: a gaunt sun-blackened castaway dressed in scraps of goatskin and old
sailcloth pinned together with brass buttons and twigs, wild hair and beard.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format adventure novel cover: Jim Hawkins standing on a windswept clifftop at dusk holding a rolled sea chart, the sea and a distant tall ship behind him, an old sailor's sea chest at his feet, stormy sky, dramatic and inviting adventure-book cover composition. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | A brass ship's compass and a folded old sea chart lying on weathered planking, warm lantern light, quiet closing mood. The chart is blank coastline and soundings only - absolutely NO lettering, NO place names, NO numbers, NO book titles, NO writing of any kind anywhere in the picture. No weapons. |

## 1장 · 벤보 여관의 손님

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | An old scarred sailor in a faded blue coat hauling a heavy sea chest on a handcart up a coastal road toward a small stone inn, grey sea and cliffs behind him, a boy watching from the inn doorway. |
| `images/story-01-b.webp` | Inside a firelit inn: the huge drunken old sailor half risen from his bench with an open clasp-knife flat on his palm, while a slim neat gentleman in a powdered wig sits perfectly calm and unmoved across the table, other villagers frozen in the background. |

## 2장 · 검은 개가 찾아오다

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A fight bursting out inside a small inn: Black Dog - a quiet man in a shabby BROWN coat, no hat, two fingers missing on his left hand - bolting for the door with a hand on his shoulder; NO blood, NO wound, NO red anywhere on him or on the floor. Billy Bones, the big old sailor in the BLUE sea coat, swings after him with a cutlass; a chair topples, a boy is pressed against the wall. |
| `images/story-02-b.webp` | The old sailor collapsed on the inn floor, the boy kneeling beside him, the doctor in the powdered wig crouching to examine him, the boy's mother standing behind with her hands to her mouth, cold winter light through the window. |

## 3장 · 검은 딱지

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | A hunched blind old man in an enormous ragged hooded cloak, a green shade over his eyes, gripping a boy's wrist with terrible strength on a foggy coastal road, his stick raised, thick fog swallowing the road behind him. |
| `images/story-03-b.webp` | The old sailor slumped back in his chair by the fire, a small round paper blackened on one side lying open in his palm, his face stricken; the boy standing frozen beside him, the inn door still swinging open onto the fog. |

## 4장 · 뱃사람의 궤짝

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A boy and his mother by candlelight in a low attic room, an opened sea chest between them spilling out a brass compass, silver cups, coins, two old pistols and a folded suit of good clothes, both faces tense and listening. |
| `images/story-04-b.webp` | Night on a foggy coastal road: mounted revenue officers charging with pistols raised while ragged pirates scatter into the fog, a boy and his mother crouched hidden under a small stone bridge in the foreground. |

## 5장 · 플린트 선장의 지도

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | Three men around a candlelit study table in a country house: a boy, a neat doctor in a powdered wig, and a large excited squire, an old sea chart with three red crosses unrolled between them. |
| `images/story-05-b.webp` | A boy sitting bolt upright in a strange grand bed near midnight, blankets thrown back, fists knotted in the sheet, a guttering candle throwing his shadow up the wall. |

## 6장 · 브리스톨의 외다리 요리사

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | A busy 18th-century Bristol dockside crowded with tall ships, barrels and sailors, a boy with a bundle walking wide-eyed through the crowd. |
| `images/story-06-b.webp` | Inside a bright harbour tavern: a huge one-legged man on a crutch turning with a warm broad smile to greet a boy, a green parrot on his shoulder; in the background a quiet pale man slips out through the door unnoticed. |

## 7장 · 히스파니올라 호

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A tense cabin conference by lamplight: a stern captain standing very straight and speaking plainly, a red-faced squire half risen in anger, a calm doctor seated between them, a boy listening at the door. |
| `images/story-07-b.webp` | A three-masted schooner under full sail leaving harbour at dawn, sailors singing on the forecastle, a boy at the rail looking back at the receding land. |

## 8장 · 짐이 엿들은 말

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | Night on deck seen from inside a big apple barrel: the boy curled in the dark among a few apples, the round rim above him, and just outside the barrel the one-legged cook seated talking with two sailors by lantern light. |
| `images/story-08-b.webp` | A lookout's cry at dusk — sailors rushing to the rail, a low dark island with two hills and a higher misty peak rising out of the sea ahead. |

## 9장 · 섬이 보이다

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | Treasure Island seen from the sea: grey woods covering the whole island, streaks of yellow sand, three strange hills with the flat-topped Spy-glass rising highest, heavy still air. |
| `images/story-09-b.webp` | A crowded boat grinding onto the beach, a boy leaping over the side and sprinting away toward the trees, the one-legged cook shouting after him from the stern. |

## 10장 · 섬에서의 첫날

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | A hot swampy clearing seen from inside low bushes: the one-legged man leaning on his crutch talking persuasively to an honest sailor who stands with his fists clenched, marsh birds rising in a black cloud behind them. |
| `images/story-10-b.webp` | A boy scrambling away through dense jungle undergrowth in terror, glancing back over his shoulder, thick green shadow all around him. |

## 11장 · 벤 건

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | A gaunt sun-blackened castaway in patched goatskin kneeling with his hands clasped before a startled boy at the edge of a wood, wild hair and beard, brass buttons pinning his rags together. |
| `images/story-11-b.webp` | Seen from the trees: a log blockhouse in a forest clearing with a British flag flying above it, smoke drifting, the sea visible beyond. |

## 12장 · 통나무집의 깃발

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | The one-legged man on his crutch standing at a log stockade fence holding a white flag of truce, calling up to the blockhouse; a stern captain answering through a loophole with a pipe in his hand. |
| `images/story-12-b.webp` | The attack on the blockhouse: pirates swarming over the stockade fence with cutlasses through gunsmoke, defenders firing from the loopholes, a boy in the thick of it. |

## 13장 · 밤바다의 작은 배

| 파일명 | 장면 |
|---|---|
| `images/story-13-a.webp` | Night on black water: a boy in a tiny crude goatskin coracle alongside the dark hull of a schooner, sawing through the taut anchor cable with a knife, lit only by yellow light from the cabin window above. |
| `images/story-13-b.webp` | Morning at sea: the schooner drifting with half-set sails and nobody at the helm, lurching sideways, the boy in his tiny boat rowing desperately toward the bow rope. |

## 14장 · 돛대 위의 결투

| 파일명 | 장면 |
|---|---|
| `images/story-14-a.webp` | A boy at the tilted deck rail hauling down a black pirate flag and flinging it into the sea, a lean sailor sitting against the bulwark watching him, his clothes torn but NO blood, NO bandage and NO wound anywhere on him or on the deck. |
| `images/story-14-b.webp` | High on the mast: a boy braced on the crosstrees aiming two pistols downward, a wounded sailor climbing toward him hand over hand with a long dirk gripped in his teeth, empty blue sea far below. |

## 15장 · 적의 손에

| 파일명 | 장면 |
|---|---|
| `images/story-15-a.webp` | The inside of a dark blockhouse the instant a lamp is lit: a boy frozen just inside the door, pirates lurching awake all around him, the one-legged man seated calmly against the wall with a green parrot screeching on his shoulder. |
| `images/story-15-b.webp` | The one-legged man on his feet roaring down a pirate who has drawn a cutlass, one arm thrown out to shield the boy behind him, the other pirates shrinking back. His GREEN parrot is on his shoulder. |

## 16장 · 보물 구덩이

| 파일명 | 장면 |
|---|---|
| `images/story-16-a.webp` | The one-legged man holding up a small blackened paper disc and laughing at the sullen pirates around him, a torn page on the floor at his feet with no writing visible on it. |
| `images/story-16-b.webp` | A skeleton lying stretched at the foot of a tall tree, arms flung straight above its head and feet pointed together like an arrow, pirates recoiling in horror while the one-legged man calmly holds out a compass. |
| `images/story-16-c.webp` | A wide empty pit in the hillside, grass already grown over its edges, a broken board and a rusted pick lying inside; the pirates staring down into it with dawning fury, the boy and the one-legged man standing apart. |
