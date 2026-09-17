# 제미나이 그림 프롬프트 — 흥부전

> **그림 안에 글자가 들어가면 안 됩니다.** 말풍선도, 효과음도, 간판 글씨도요.
> 제미나이가 가끔 영어를 써 넣습니다. 받은 그림에 글자가 보이면 그 장만 다시 만드세요.
> 프롬프트 끝에 `Absolutely no text, no letters, no speech bubbles, no sound effects, no signage anywhere in the image.` 를 덧붙이면 잘 듣습니다.


**소설 틀**이에요. 그림이 있는 펼침면은 오른쪽 쪽 **위쪽**에 그림이 가로로 꽉 차게 들어가고,
그 아래 남는 자리를 글이 채웁니다. 그림이 쪽을 통째로 먹지 않아요.

6장이고 장마다 그림이 3장씩, 여기에 표지와 마지막 장을 더해 모두 **20장**입니다.

프롬프트를 제미나이에 그대로 넣어 만든 뒤, 파일명을 정확히 맞춰 `images/` 폴더에 넣으면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보여요.)

## 비율

| 그림 | 실제 칸 비율 | 요청할 비율 |
|---|---|---|
| 본문 그림 18장 | 1.33 : 1 | **가로 4 : 세로 3** |
| 표지 `cover.webp` | 0.67 : 1 | **세로 2 : 3** (세로로 긴 그림) |
| 마지막 `end.webp` | 1.33 : 1 | **가로 4 : 세로 3** |

> **`end` 그림은 「읽고 나서」 쪽에 들어갑니다.** 쪽 위쪽에 가로로 얹히므로 비율은 아래 표대로면 됩니다.
> 다만 글 분량에 따라 높이가 조금씩 달라지니, **중요한 것은 한가운데에 두고 위아래 가장자리는 여유를 두세요.**

표지 칸은 책을 펼쳤을 때 왼쪽 반쪽을 통째로 채우는 세로 칸이에요. 가로 그림을 넣으면 양옆이 절반 가까이 잘려 나갑니다.

## 공통 스타일 지시문 (모든 프롬프트 앞에 붙여서 쓰세요)

```
Classic children's literature illustration in the style of 1980s Korean
illustrated classics: gouache and watercolour, bold clean outlines, saturated but
slightly muted colours, realistic human proportions with expressive faces, though
this story allows more comedy than most. Setting is a Joseon-era village in
Jeolla province: a rich brother's tile-roofed compound with granaries and a big
gate, a poor brother's crooked one-room thatched hut on the edge of the fields,
gourd vines over the roof, rice paddies, low hills. Everyone wears period hanbok.
Warm daylight, lantern light at night. No text or letters in the image.
Make every picture EXCITING to look at, like a frame from 1980s-90s Korean TV
animation. Never a flat mid-distance shot with everyone standing in a row.
CAMERA: use a strong angle every time - look up steeply at whoever is powerful,
look down steeply on whoever is small, push right in close on a face at the
moment it changes. Let things break out of the frame: a hand, a tail, a swinging
club, a gourd bigger than the panel. Use deep foreshortening - the fist or the
foot nearest the viewer is huge.
BODIES: cartoon proportions, not realistic ones. Big heads on children, squash
and stretch, whole bodies leaning into what they are doing, fingers splayed,
feet off the ground.
MOTION: speed lines, dust clouds at the feet, impact stars, flying sweat drops,
objects tumbling through the air, hair and clothes streaming.
LIGHT: strong and graphic - hard shadows, warm light from one side, a bright rim
where the light hits, deep saturated darks at night.
Every picture should make a child want to turn the page.
Villains and unkind characters must be FUN to look at - comic, lively and cute,
with big round expressive eyes and big exaggerated expressions. Exaggerate
freely: puffed-up cheeks, enormous grins, comic sweat drops, tiny pupils when
startled, whole body leaning into the gag. But never repulsive - no wrinkled
scowling faces, no warts, no bared yellow teeth, no mean squinting slits, no
ugly caricature. The reader should enjoy watching them and laugh at them, never
be disgusted by them. A greedy character can be adorable; what is wrong with
them shows in what they DO, not in an ugly face.
Two things that keep going wrong. First, PLUMP IS NOT UGLY. A well-fed character
is round AND good-looking: soft round face, smooth clear skin, big bright eyes,
rosy cheeks, glossy hair. Roundness is charm, never the joke. Second, DRAW PEOPLE
YOUNG unless the story says otherwise. Parents of small children are in their
twenties or thirties - smooth faces, thick black hair, no wrinkles, no balding,
no stoop. Only grandparents and village elders are old.
The same goes for monsters and beasts - they must be FUN to look at too, drawn
like the monsters in 1980s-90s Korean TV animation. BOLD, SIMPLE and BOUNCY: big
flat areas of saturated colour, thick clean outlines, rounded cartoon masses,
springy exaggerated poses. Huge fangs, a wide roaring mouth, googly eyes out on
stalks, enormous claws are all GOOD - they read as playful because the shapes are
simple and the colours are bright. A monster may fill the whole frame and roar.
What makes a monster disgusting is not its teeth but its TEXTURE and DETAIL: wet
glistening skin, slime, drool, bristles, veins, swarms of small eyes, finely
segmented insect legs, realistic anatomy. Never draw those. Keep every monster a
big bold cartoon shape that a child would want to draw themselves.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Heungbu: a YOUNG father in his early thirties - he has twelve small children, so
draw him young. Thick black hair in a neat topknot, a smooth unlined face, a warm
open smile. Slim from going hungry, in a much-patched pale hanbok with sleeves
too short and straw sandals. Endlessly good-humoured even when miserable.
Heungbu's wife: a YOUNG mother in her late twenties, pretty and clear-faced with
glossy black hair in a plain bun, slim from going hungry, in faded indigo. She is
sharper and more practical than her husband.
Their many children: eleven or twelve children from toddler to about twelve years
old, always in a swarm, big eyes, patched clothes, thin but bright-faced, comic
and lively.
Nolbu: the elder brother, mid thirties, only a few years older than Heungbu.
Thick black hair, a smooth face, no wrinkles. Stout and well-fed in a good brown
silk hanbok and a black horsehair hat, one hand usually on his belly or pointing.
Comic rather than nasty to look at - a small-minded, greedy, frightened man.
Nolbu's wife: a YOUNG and PRETTY woman in her early thirties. Draw her plump and
beautiful at the same time - a soft round face, smooth skin with no wrinkles, big
bright eyes with long lashes, a small neat nose, rosy cheeks, glossy black hair in
a neat bun with a bright hairpin. She wears fine coloured silk. Being well-fed and
round is part of her charm, never a joke against her - think of a pretty young
mistress of a rich house. Her cheeks puff right up when she is cross and that is
the comedy. A rice paddle is usually in her hand. What is unkind about her shows
only in what she does with it.
The swallows: sleek blue-black-and-white birds with forked tails; one nestling
with a splinted leg wrapped in white thread.
The gourds: enormous pale green gourds, some as big as a person, growing on the
thatch.
```

---

## 표지 — `cover.webp` (세로 2:3)

세로로 긴 표지. 초가지붕을 뒤덮은 커다란 박과 제비.

```
Vertical portrait composition. A crooked little thatched hut seen from the yard,
looking up. Its whole roof is buried under a great tangle of gourd vine, and
three or four enormous pale green gourds hang heavily from it, one nearly as big
as the door. A pair of swallows with forked tails swoops across the top of the
frame against a bright blue summer sky with towering white clouds. At the bottom
of the frame, small, a thin man and his wife stand looking up with their hands on
their heads in astonishment, a swarm of ragged children around their knees. Warm,
green, comic and hopeful.
```

## 본문 18장 (모두 가로 4:3)

### `story-01-a.webp` — 1장 — 형이 아우를 내쫓는다

```
Wide 4:3 scene. Winter, in the gateway of a fine tile-roofed compound. On the
right a stout man in good brown silk stands on the raised threshold pointing away
down the road, chin up, face closed. On the left a thin man in patched clothes
stands in the snow of the lane with a bundle of old clothes under one arm, his
wife and a crowd of small ragged children huddled behind him. Bare branches,
grey-white light, no one shouting - just finality.
```

### `story-01-b.webp` — 1장 — 흥부가 무릎 꿇고 쌀을 빈다

```
Wide 4:3 scene. Winter, snow on the ground, at Nolbu's gate at dusk. On the left
Heungbu kneels in the snow in worn white clothes, hands pressed together,
tears on his face, pleading. On the right, framed in the half-open gate, Nolbu
stands with arms folded, scowling down at him, warm lamplight and the smell of
cooking rice behind him inside. Cold blue-grey light, no one else present.
```

### `story-01-c.webp` — 1장 — 반대쪽 뺨을 내민다

```
Wide 4:3 scene. The same doorway a moment later. The thin man has carefully
tucked the rice grains into the breast of his jacket with one hand, and is
turning his head to offer the other cheek, eyes hopefully closed, a small
embarrassed smile. The sister-in-law has frozen mid-swing, the paddle stopped in
the air, her face gone completely blank. Kitchen smoke, bright morning.
```

### `story-02-a.webp` — 2장 — 처마 밑에 제비 한 쌍이 날아든다

```
Wide 4:3 scene. Spring. The eaves of the crooked hut. A pair of sleek swallows
wheel in under the thatch toward a half-built mud nest; below in the yard the
thin man stands looking up with both hands raised as if welcoming guests, his
face delighted, while his wife shades her eyes beside him. Fresh green willow,
soft blue sky, warm light.
```

### `story-02-b.webp` — 2장 — 다리 부러진 새끼 제비를 실로 싸매 준다

```
Wide 4:3 scene. Inside the little room. The thin man sits cross-legged holding a
tiny nestling swallow in one cupped palm, winding fine white thread around a
splint on its leg with enormous concentration, tongue between his teeth. His wife
holds the thread spool; three children crowd in close with their chins almost on
his hands. A snake's tail disappearing out the door in the background. Warm lamp
light, everything very small and careful.
```

### `story-02-c.webp` — 2장 — 이듬해 봄, 제비가 박씨를 물어다 준다

```
Wide 4:3 scene. The yard in spring. A swallow banks away upward on the right,
having just dropped something; in the centre the thin man is crouched picking a
single large seed off the swept dirt, holding it up between finger and thumb
against the light, squinting at strange markings on its shell. His wife leans
over his shoulder. Blossom petals in the air, bright clear morning.
```

### `story-03-a.webp` — 3장 — 부부가 마주 잡고 박을 탄다

```
Wide 4:3 scene. The yard. A gourd as big as a barrel sits on a straw mat, and the
husband and wife kneel on either side of it working a long two-man saw back and
forth, both leaning into it, sweat flying, mouths open in a work-song. The
children crowd around in a ring, some plugging their ears, all wide-eyed. Bright
midday, dust and sawdust in the sun.
The gourd is a smooth, perfectly round white-green bottle gourd (Korean bak), not a ribbed pumpkin.
Its stem end points straight at Heungbu's knees, and the saw cuts across the middle,
halfway between the stem end and the far end.
```

### `story-03-b.webp` — 3장 — 박에서 쌀이 쏟아진다

```
Wide 4:3 scene of joy. The gourd has split open and white rice is pouring out of
it in an impossible flood, heaping across the whole yard. The children have thrown
themselves into it up to their waists, laughing and flinging handfuls in the air.
The husband and wife stand holding each other's arms, crying openly. Golden light,
white rice, motion everywhere.
The split gourd halves are smooth round bottle-gourd shells with no stem or knob drawn on them.
```

### `story-03-c.webp` — 3장 — 목수들이 사흘 만에 새 집을 짓는다

```
Wide 4:3 scene. A building site full of activity. Carpenters raise a ridge beam
with ropes, others fit roof tiles, someone planes a pillar; the frame of a fine
new house stands where the hut was. On the left the thin man stands in the middle
of it all with his arms hanging, completely overwhelmed, while a child tugs his
sleeve. Warm timber colours, blue sky, cheerful chaos.
```

### `story-04-a.webp` — 4장 — 놀부가 흥부 집에 쳐들어와 캐묻는다

```
Wide 4:3 scene. Inside the fine new house. On the right the stout brother sits
bolt upright on a cushion with both fists on his knees, leaning forward,
interrogating; his eyes are darting around at the new beams and the folding
screen. On the left the thin brother sits telling the story with open hands, still
guileless and eager to please. A tray of food untouched between them. Rich warm
interior.
```

### `story-04-b.webp` — 4장 — 놀부가 제 손으로 제비 다리를 부러뜨린다

```
Wide 4:3 scene, comic and unpleasant but not graphic. Up a ladder at his own
eaves, the stout brother reaches into a swallow's nest with a nestling in his fat
hand, holding it up to look at it, his tongue out of the corner of his mouth in
concentration, already reaching with the other hand. Show only the intent - the
bird is whole and squawking, wings out. Below, his wife steadies the ladder and
looks up eagerly. Harsh bright noon light. Comic, but nobody is drawn ugly.
```

### `story-04-c.webp` — 4장 — 떠나는 제비들에게 소리친다

```
Wide 4:3 scene. Autumn. The stout brother stands alone in the middle of his big
courtyard with his head thrown all the way back and both hands cupped around his
mouth, bellowing up at a departing line of swallows high in an empty sky. Fallen
leaves blowing around his feet. Servants watch from a doorway, embarrassed. Wide
cold blue sky, one small shouting man.
```

### `story-05-a.webp` — 5장 — 지붕 가득 열두 통의 박

```
Wide 4:3 scene. The rich compound's roof loaded with twelve enormous gourds, far
too many, the beams visibly sagging. Below, the stout brother stands with his
hands spread wide counting them, face split by a greedy grin, his wife beside him
with her hands clasped. Servants on ladders. Late summer, heavy green vines,
bright light, a faint sense of something about to break.
```

### `story-05-b.webp` — 5장 — 박에서 사당패가 나와 밤새 놀고 값을 받아 간다

```
Wide 4:3 scene of noisy comedy. A troupe of travelling entertainers has poured
out of a split gourd and taken over the courtyard: a masked dancer mid-leap, a
drummer, a tightrope walker on a rope strung between the roofs, an acrobat on
someone's shoulders. Lanterns everywhere. In the corner the stout brother is being
presented with a bill by a grinning troupe leader, and his face is falling. Night,
warm lantern colour, wonderful chaos.
```

### `story-05-c.webp` — 5장 — 해질 무렵, 집터에 흙더미만 남는다

```
Wide 4:3 scene. Sunset. Where the fine compound stood there is now a broad mound
of broken tile, fallen beams and dirt, a single gatepost still upright. The stout
brother and his wife and household stand at the edge of it, small, looking at it,
their backs to the viewer. Long red light, dust hanging in the air, crows on the
gatepost. Desolate but not cruel.
```

### `story-06-a.webp` — 6장 — 비 내리는 무너진 집터

```
Wide 4:3 scene. Rain. The family stands in the ruins under a grey downpour, the
stout brother in the front with his hat gone and his fine silk soaked and
clinging, rain running down his face, staring at nothing. His wife holds a mat
over the children. Everything grey-green and streaming. Very quiet.
```

### `story-06-b.webp` — 6장 — 아우의 집 앞에서 걸음을 멈춘다

```
Wide 4:3 scene. A road at dusk before a warm lit house. The stout brother has
stopped some way short of the gate, one foot forward, and is standing quite still
looking at the light in the windows, his hands hanging. His family waits further
back on the road. Blue evening, gold light in the paper windows, a long distance
between him and the door.
```

### `story-06-c.webp` — 6장 — 아우가 형에게 밥상을 차려 준다

```
Wide 4:3 scene. Inside the warm house. The thin brother sets down a full tray of
rice, soup and side dishes in front of his brother, both hands on the tray edge,
smiling as though nothing had ever happened. The stout brother sits with his hands
on his knees looking down at the food, his face working, unable to lift the spoon.
Lamplight, steam rising from the bowls. Quiet and enormous.
```

---

## 마지막 장 — `end.webp` (가로 4:3)

우물가에 걸어 둔 바가지.

```
Wide 4:3 scene. A village well in the morning. A single pale gourd dipper hangs
from a peg on the well frame, worn smooth with use. A passing farmer is lifting it
down to drink; a child waits behind him with her hands out. Beyond, the village
lane and green hills. Ordinary, generous, warm early light.
```
