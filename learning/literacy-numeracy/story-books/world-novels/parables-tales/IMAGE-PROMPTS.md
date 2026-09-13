# 제미나이 그림 프롬프트

각 이야기마다 그림이 **두 장**이에요 — 도입부(오프닝) 한 장, 결말/반전 장면 한 장.
아래 프롬프트를 제미나이에 그대로 넣어서 생성한 뒤, 파일명을 정확히 맞춰서
`images/` 폴더에 저장하면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보여요.)

> **한 파일 = 한 장면입니다. 앞질러 가지 마세요.**
> 파일마다 뒤에 〔이 쪽에 실린 글〕을 붙여 두었습니다. 그 쪽에 실제로 실리는 글이에요.
> 그림은 **그 글에 나오는 장면만** 그려 주세요. 다음 쪽 이야기를 미리 그리면
> 그림이 글보다 한 칸씩 밀려서 책 전체가 어긋납니다. 실제로 그런 일이 있었어요.
> 장면이 둘 적혀 있으면 둘을 **한 그림 안에** 담아 주세요. 하나만 골라 그리면 안 됩니다.

이 책은 이야기 분량이 모두 짧아서 중간 페이지(`-3.webp`)가 필요한 이야기는 없어요.

권장 크기: 가로 4 : 세로 3 비율, WebP. **단, 표지(`cover.webp`)만 예외 — 세로 2 : 3 비율로 만들어주세요.** 표지 그림칸은 책을 펼쳤을 때 왼쪽 반쪽 전체를 꽉 채우는데, 그 칸 자체가 가로로 넓은 4:3이 아니라 세로로 긴 2:3 모양이에요. 4:3 가로 그림을 넣으면 화면에 꽉 채우려다 양옆이 절반 가까이 잘려나가니 꼭 세로 비율로 따로 생성해주세요.

> **마무리 그림(`end`)은 이제 「읽고 나서」 쪽 오른쪽 위 한 자리에만 쓰입니다.** 따로 있던 마지막 쪽은 없앴어요.
> 칸은 **가로 3 : 세로 2** 그대로입니다. 적어 둔 비율대로 그리면 잘리지 않고 그대로 들어갑니다.


## 공통 스타일 지시문 (모든 프롬프트 앞에 붙여서 사용하세요)

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

Children's picture book illustration, warm watercolor and colored-pencil style,
soft golden lighting, gentle rounded shapes, storybook atmosphere, no text or
letters in the image, consistent warm earthy color palette (parchment, gold,
terracotta, deep brown), Middle Eastern village and countryside setting,
expressive character faces, dynamic staging.
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

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: an old storybook standing upright on a wooden table under warm golden light, a tall wheat sprig and an oil lamp rising beside it, night sky with stars filling the space above, magical and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 이야기 1 · 값비싼 진주

| 파일명 | 장면 |
|---|---|
| `images/story-01-pearl.webp` | A traveling merchant leaning over a humble market stall at dusk, eyes wide with astonishment at a single glowing moonlit pearl resting on a cloth, warm lantern light. |
| `images/story-01-pearl-2.webp` | The same merchant walking away from an empty house and sold belongings, holding the pearl up to the light with a deeply content smile, warm sunset glow. |

## 이야기 2 · 착한 사마리아인

| 파일명 | 장면 |
|---|---|
| `images/story-02-samaritan.webp` | A wounded traveler lying on a rocky mountain road, two passersby in the distance turning away and walking past without stopping, dusty warm daylight, somber mood. |
| `images/story-02-samaritan-2.webp` | A kind traveler kneeling to bandage the wounded man's arm, a donkey waiting nearby, warm compassionate lighting, gentle rescue scene. |

## 이야기 3 · 한밤중에 빵을 빌리러 온 친구

| 파일명 | 장면 |
|---|---|
| `images/story-03-friend.webp` | A man knocking urgently on a neighbor's wooden door at midnight under a starry sky, holding an empty basket, warm lantern glow from a small window. |
| `images/story-03-friend-2.webp` | The sleepy neighbor handing over three loaves of bread through the doorway with a tired but warm smile, moonlit street, cozy resolution. |

## 이야기 4 · 되찾은 은전 한 닢

| 파일명 | 장면 |
|---|---|
| `images/story-04-coin.webp` | A woman kneeling on a floor by candlelight, sweeping under furniture searching intently for something small, warm indoor glow, focused expression. |
| `images/story-04-coin-2.webp` | The same woman joyfully holding up a single silver coin, neighbors gathered smiling around her in a small warm-lit room, celebratory mood. |

## 이야기 5 · 반석 위에 지은 집

| 파일명 | 장면 |
|---|---|
| `images/story-05-house.webp` | Two small houses being built side by side, one on loose sand and one on solid rock, builders at work, warm daytime countryside. |
| `images/story-05-house-2.webp` | A dramatic storm with rain and flooding water sweeping away the sand house while the house on the rock stands firm and unshaken, dramatic warm-toned lighting. |

## 이야기 6 · 포도원 일꾼들의 품삯

| 파일명 | 장면 |
|---|---|
| `images/story-06-vineyard.webp` | A vineyard owner greeting idle workers in a village square at different times of day, golden late-afternoon light, warm harvest atmosphere. |
| `images/story-06-vineyard-2.webp` | Workers lined up receiving equal coins from the vineyard owner at sunset, some looking surprised and murmuring, others calm and satisfied, warm evening light. |

## 이야기 7 · 돌아온 둘째 아들

| 파일명 | 장면 |
|---|---|
| `images/story-07-son.webp` | A ragged young man sitting alone among pigs in a muddy pen, hungry and thoughtful, distant golden sunset over dry fields. |
| `images/story-07-son-2.webp` | A father running down a dusty road with open arms to embrace his returning son, warm golden light, joyful emotional reunion. |

## 이야기 8 · 가라지 씨앗

| 파일명 | 장면 |
|---|---|
| `images/story-08-weeds.webp` | A worried farmer and field hand looking down at young wheat sprouts mixed with unfamiliar weeds in a sunlit field, warm morning light. |
| `images/story-08-weeds-2.webp` | Harvest day in the same field: heavy-headed wheat carried toward the barn in armfuls while stiff empty-eared weeds are tied into a separate bundle, workers glancing at each other in surprise, warm harvest-time glow. |

## 이야기 9 · 땅에 묻은 한 달란트

| 파일명 | 장면 |
|---|---|
| `images/story-09-talent.webp` | A nervous servant digging a hole in the ground at night to bury a small pouch of coins, moonlit courtyard, anxious expression. |
| `images/story-09-talent-2.webp` | Two joyful servants presenting doubled coin pouches to a pleased master, while a third servant stands ashamed holding his single unopened pouch, warm indoor lighting. |

## 이야기 10 · 끈질긴 과부

| 파일명 | 장면 |
|---|---|
| `images/story-10-widow.webp` | A determined elderly widow standing before an unimpressed judge at his bench, pleading with clasped hands, warm dim courtroom light. |
| `images/story-10-widow-2.webp` | The same judge throwing up his hands in exasperated surrender while the widow smiles with quiet triumph, warm afternoon light. |

## 이야기 11 · 영리한 청지기

| 파일명 | 장면 |
|---|---|
| `images/story-11-steward.webp` | A worried manager sitting at a desk with ledgers and scrolls, deep in thought about his uncertain future, dim warm study light. |
| `images/story-11-steward-2.webp` | The same manager smiling and reducing a debt on a scroll for a grateful visitor, warm candlelight, clever confident expression. |

## 이야기 12 · 용서할 줄 모르는 종

| 파일명 | 장면 |
|---|---|
| `images/story-12-servant.webp` | A relieved servant kneeling before a king who gestures forgiveness with an open hand, a torn debt scroll on the floor, warm golden throne room. |
| `images/story-12-servant-2.webp` | The same servant harshly grabbing a coworker by the collar demanding payment on a dusty street, cold contrasting light, tense dramatic mood. |

## 이야기 13 · 포도원을 노린 소작농들

| 파일명 | 장면 |
|---|---|
| `images/story-13-tenants.webp` | Angry tenant farmers driving off a landowner's messenger at the gate of a lush vineyard, tense confrontation, warm late-afternoon light. |
| `images/story-13-tenants-2.webp` | The landowner arriving with guards to confront the tenants amid the vineyard, stern expression, dramatic golden evening light. |

## 이야기 14 · 기름을 준비한 다섯 처녀

| 파일명 | 장면 |
|---|---|
| `images/story-14-lamps.webp` | Ten young women sitting with oil lamps in the dark waiting outside a decorated gate, some lamps glowing brightly, others dim, moonlit night. |
| `images/story-14-lamps-2.webp` | Five women with bright lamps joyfully entering a lit doorway to a feast while five others stand outside a closed door in the dark, poignant warm-cool contrast. |

## 이야기 15 · 혼인 잔치에 초대받은 사람들

| 파일명 | 장면 |
|---|---|
| `images/story-15-wedding.webp` | Royal servants inviting ordinary people from a busy street into a grand decorated banquet hall, warm festive lighting, joyful chaos. |
| `images/story-15-wedding-2.webp` | A king pointing questioningly at one improperly dressed guest at a long feast table full of joyful guests, warm banquet hall glow, dramatic focus. |

## 이야기 16 · 곳간을 더 크게 지은 부자

| 파일명 | 장면 |
|---|---|
| `images/story-16-barn.webp` | A wealthy farmer standing proudly before overflowing grain sacks and a half-built larger barn, golden harvest fields behind him, warm satisfied expression. |
| `images/story-16-barn-2.webp` | The same barn standing finished and full under a quiet night sky, no one present, an empty chair beside it, still and reflective moonlit mood. |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- "-2" 파일이 진짜 이야기의 핵심 장면을 담당하니, 시간이 부족하면 이 그림들부터 먼저 만드는 걸 추천해요.
