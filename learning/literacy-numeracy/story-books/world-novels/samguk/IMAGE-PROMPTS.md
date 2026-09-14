# 제미나이 그림 프롬프트 — 삼국지

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
children's classics were painted: gouache and watercolor, bold clean outlines, realistic
proportions with expressive faces; China at the end of the Han dynasty,
around 200 CE — rammed-earth city walls with timber gate towers, tiled
courtyard halls, the Yangtze and its war junks, the loess plains of the north,
the mountain passes into Sichuan.
Han-dynasty dress: cross-collared robes, lamellar armour of iron plates laced
with cord, square-topped official caps, chariots and cavalry with ring-pommel swords
and long ji halberds. No stirrups on saddles before this era's later part.
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

**후한 시대의 옷과 무기로 그려 주세요.** 이 이야기는 흔히 훨씬 나중 시대(명나라)의
옷과 갑옷으로 그려져 왔습니다. 이 책은 백구십 년쯤 전 시대 배경이 아니라
천팔백 년 전 시대 배경입니다. 갑옷은 쇠 미늘을 끈으로 엮은 것이고,
투구에 큰 깃털 장식을 달지 마세요.

**인물을 얼굴색으로 구별하지 마세요.** 관우를 붉은 얼굴로, 장비를 검은 얼굴로 그리는 것은
경극 분장에서 온 관습입니다. 이 책은 사람 얼굴로 그립니다.
관우는 수염이 아주 길고, 장비는 몸집이 크고, 유비는 귀가 크다는 정도까지만 살려 주세요.

**싸움 장면을 통쾌하게만 그리지 마세요.** 16장에서 이 소설이 이름 없는 사람들 이야기를
거의 하지 않는다고 짚었습니다. 전투 장면에는 반드시 이름 없는 병사들을 크게 넣어 주세요.

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Liu Bei: a man of about thirty at first and sixty at the end; long arms, large
ears, a mild face that gives little away. Plain clothes early, imperial robes late.
Guan Yu: very tall, a magnificent long beard reaching his chest, narrow eyes,
green robe over armour, a long-handled blade. An ordinary human skin tone.
Zhang Fei: a huge broad man with a bristling beard and a loud open face,
a long snake-headed spear. An ordinary human skin tone.
Cao Cao: a short, sharp-eyed, quick-moving man; the most competent person in
almost every room; fine dark robes, later imperial dress.
Zhuge Liang: a tall calm scholar of twenty-seven in chapter 6 and fifty-four at
the end; plain white or grey robe, a feather fan, a carriage rather than a horse.
Zhao Yun: a handsome disciplined young cavalryman in white-laced armour.
Sun Quan: a young southern ruler with a square jaw; about the same age as
Zhuge Liang.
Zhou Yu: a strikingly handsome young general of the south, cultured, a lute
sometimes near him.
Sima Yi: a patient, watchful older general who never looks in a hurry.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: three men standing together in a blossoming peach orchard at dawn, seen from slightly below — one tall and long-bearded, one huge and broad, one plain-looking in the middle; behind them, painted small and pale like a distant memory, a burning fleet on a wide river and a mountain pass full of soldiers. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | A wide river at evening with a single empty war junk drifting, and on the far bank the earthworks of an abandoned camp overgrown with grass. |

## 1장 · 무너지는 나라

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | A village yard beside a drought-cracked field: soldiers leading the last ox away to a tax officer's empty cart while a white-haired farmer sinks to the ground, neighbours watching from their doorways. |
| `images/story-01-b.webp` | A crowd of ragged people with yellow cloths tied round their heads gathering at a crossroads, farming tools in their hands rather than weapons. |

## 2장 · 복숭아밭의 세 사람

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A market wall with a recruitment notice pasted on it, a plain-dressed man reading it, a huge bearded man coming up behind him. |
| `images/story-02-b.webp` | Three men kneeling together in a peach orchard with a small offering table between them, petals on the ground. |

## 3장 · 동탁과 열여덟 제후

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | A great city burning at night with columns of refugees leaving through the gates, soldiers driving them along. |
| `images/story-03-b.webp` | A council tent of allied lords: eighteen banners, a long table, everyone seated and nobody volunteering, one man standing up alone. |

## 4장 · 조조

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A city ward gate at night with coloured staves hung on the wall beside it, a young official standing there while soldiers hold a well-dressed man. |
| `images/story-04-b.webp` | Farmland being opened by soldiers with ploughs and hoes, weapons stacked in bundles at the field edge, an official on horseback watching. |

## 5장 · 관우, 조조의 진영에 들다

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | A banquet hall: a long-bearded man seated stiffly among richly dressed officers, not touching his cup; the host watching him closely. |
| `images/story-05-b.webp` | A courtyard at dawn: sealed chests stacked neatly, an official seal hanging on a stand, a letter on a table, and the gate standing open. |

## 6장 · 세 번 찾아가다

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | A thatched cottage among bamboo and snow, three horsemen dismounted outside the fence, one of them waiting with his hands folded while the others stamp their feet. |
| `images/story-06-b.webp` | Inside the cottage: a young scholar sketching a map of three regions on a low table with his finger, an older man leaning forward over it. |

## 7장 · 장판교

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A road crowded with tens of thousands of ordinary refugees — carts, bundles, children, old people — moving very slowly, soldiers among them looking back. |
| `images/story-07-b.webp` | A narrow bridge with one enormous man standing alone in the middle of it, spear planted, and a wall of cavalry halted at the far end. |

## 8장 · 적벽

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | A great fleet of war junks chained together side by side across a wide river at night, lanterns along the decks. |
| `images/story-08-b.webp` | Fire ships driving into that fleet before a hard wind, the chained ships burning in a line; small figures in the water and on the banks — put the ordinary soldiers in the foreground. |

## 9장 · 셋으로 나뉘다

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | A city gate standing wide open: a governor walking out alone to hand over his province, the plain-faced lord waiting on horseback with his soldiers, officers watching from the wall above. |
| `images/story-09-b.webp` | A formal hall in Jing province: a long-bearded governor turning away from a southern envoy who is still holding out a marriage proposal, the envoy's face hardening. |

## 10장 · 형주를 잃다

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | Merchant boats going upriver with the crews' robes not quite hiding armour underneath, a river fort ahead unaware. |
| `images/story-10-b.webp` | A small walled town at night with campfires all round it and very few defenders on the walls, one long-bearded figure looking out. |

## 11장 · 이릉

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | A long line of camps stretched for miles through wooded gorges beside a river, seen from a height — the line so long its ends are out of sight. |
| `images/story-11-b.webp` | The same gorges at night with fire running along the whole line, and a small group of horsemen breaking away westward. |

## 12장 · 백제성

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | A sickroom in a river fortress: an old man propped on a couch holding a scholar's hand, a boy standing behind, attendants at the door. |
| `images/story-12-b.webp` | A southern frontier: a chancellor in plain robes appointing local men as officials, the local leaders standing as equals rather than kneeling. |

## 13장 · 북벌

| 파일명 | 장면 |
|---|---|
| `images/story-13-a.webp` | A supply train of porters and odd wooden hand-carts winding along a plank road cut into a cliff face above a gorge. |
| `images/story-13-b.webp` | A military tribunal in a tent: a young officer kneeling, and the chancellor seated with his face turned away and wet. |

## 14장 · 오장원

| 파일명 | 장면 |
|---|---|
| `images/story-14-a.webp` | An army camped on a plain and farming it — soldiers with hoes among barley, tents and banners behind them. |
| `images/story-14-b.webp` | A lamplit tent at night: a thin, exhausted man in a plain robe still reading documents, a bowl of untouched food beside him, dawn showing at the tent flap. |

## 15장 · 그 뒤

| 파일명 | 장면 |
|---|---|
| `images/story-15-a.webp` | A palace banquet in a foreign capital: musicians playing, a group of guests weeping, and one man among them smiling and clapping. |
| `images/story-15-b.webp` | A throne room where a new dynasty's emperor takes the seat while the old one steps down — drawn twice in the same frame, once for each dynasty, identical staging. |

## 해설 · 읽고 나서 (16장이던 그림)

| 파일명 | 장면 |
|---|---|
| `images/story-16-a.webp` | A great crowd portrait: dozens of the story's figures in one composition, each face distinct, generals and scholars and ordinary soldiers mixed together with no one at the centre. |
| `images/story-16-b.webp` | An empty battlefield years later: grass over the earthworks, a farmer ploughing across it, a broken spear shaft turned up by the plough. |
