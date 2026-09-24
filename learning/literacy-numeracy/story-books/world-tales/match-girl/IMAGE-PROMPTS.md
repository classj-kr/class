# 제미나이 그림 프롬프트

이 책은 하나의 이야기를 7개의 장(챕터)으로 나눠 담았고, 펼침면은 모두
14개예요. 펼침면 하나에 그림이 한 장씩 들어갑니다.
그림이 펼침면 전체 폭을 가득 채우고, 그 아래에 이야기가 왼쪽·오른쪽으로 나뉘어 들어갑니다.

아래 프롬프트를 제미나이에 그대로 넣어서 생성한 뒤, 파일명을 정확히 맞춰서
`images/` 폴더에 저장하면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보여요.)

> **⚠️ 다시 그려 주실 것 (2026-08-28 점검)**
> - `06-grandmother` — 아이가 **신발을 신고 있습니다**. 글에서는 슬리퍼를 잃어버려 맨발입니다.
> - `06-grandmother` — 할머니 옷이 **한복 저고리**처럼 보입니다. 덴마크 이야기이니 유럽식 숄과 앞치마로.

> **한 파일 = 한 장면입니다. 앞질러 가지 마세요.**
> 파일마다 뒤에 〔이 쪽에 실린 글〕을 붙여 두었습니다. 그 쪽에 실제로 실리는 글이에요.
> 그림은 **그 글에 나오는 장면만** 그려 주세요. 다음 쪽 이야기를 미리 그리면
> 그림이 글보다 한 칸씩 밀려서 책 전체가 어긋납니다. 실제로 그런 일이 있었어요.
> 장면이 둘 적혀 있으면 둘을 **한 그림 안에** 담아 주세요. 하나만 골라 그리면 안 됩니다.

권장 크기: **본문 그림은 가로 2 : 세로 1 비율**(가로로 아주 길쭉한 모양)로 만들어 주세요, WebP. 펼침면 전체 폭을 채우는 자리라 이렇게 길어야 잘리지 않아요. **표지(`cover.webp`)는 세로 2 : 3 비율**, 마무리(`end.webp`)는 가로 3 : 세로 2 정도면 됩니다.

> **마무리 그림(`end`)은 이제 「읽고 나서」 쪽 오른쪽 위 한 자리에만 쓰입니다.** 따로 있던 마지막 쪽은 없앴어요.
> 칸은 **가로 3 : 세로 2** 그대로입니다. 적어 둔 비율대로 그리면 잘리지 않고 그대로 들어갑니다.


본문 그림칸은 마지막 장까지 모두 같은 비율입니다. 어느 장이든 똑같이
2:1로 만들면 되고, 따로 신경 쓸 것이 없어요.

## 공통 스타일 지시문 (모든 프롬프트 앞에 붙여서 사용하세요)

```
Children's picture book illustration, bright cheerful cartoon-animation style,
bold clean outlines, saturated storybook colors, cold blue snowfall against warm
golden window light, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a nineteenth-century town
street on New Year's Eve, lit windows, a corner between two houses, and warm
imagined interiors, expressive faces, wide panoramic composition, tender and
never grim; the visions in the matchlight are bright and beautiful.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
The girl: a small child about 8 with bare feet, a thin shawl and a bundle of
matches in her apron, drawn with dignity rather than pity. The grandmother: a
warm-faced old woman with silver hair, appearing in the matchlight. Townspeople:
bundled figures hurrying past. Families glimpsed through lit windows.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a small girl in a thin shawl standing in falling snow at a street corner holding a bundle of matches, warm golden light spilling from the windows above her, one match glowing in her hand, tender and moving. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 한 해의 마지막 밤

| 파일명 | 장면 |
|---|---|
| `images/01-street.webp` | A snowy town street at dusk on New Year's Eve where bundled figures hurry home past a small girl holding out matches, nobody turning to look, lit windows above, tender and quiet. 〔이 쪽에 실린 글 (1/14) — 그림에 글자는 넣지 마세요. 왼쪽: 한 해의 마지막 날이었습니다. 아침부터 눈이 펑펑 내려 거리가 온통 하얗게 덮였지요. 사람들은 목도리에 얼굴을 파묻고 걸음을 재촉했습니다. 모두 따뜻한 집으로 돌아가는 길이었지요. 그런데 한 아이만 거리에 남아 있었습니다. 앞치마에 성냥을 한 아름 안은 아이였지요. / 오른쪽: 아침부터 한 갑도 팔지 못했습니다. 성냥 사세요. 아이가 조그맣게 외쳤지요.〕 |
| `images/01-street-2.webp` | A snowy crossing where a huge slipper flies off a small girl's foot as a carriage passes and a boy snatches the other to use as a boat, the girl left barefoot in the snow, poignant. 〔이 쪽에 실린 글 (2/14) — 그림에 글자는 넣지 마세요. 왼쪽: 아이는 신발이 없었습니다. 아침에 나올 때는 큰 슬리퍼를 신고 있었지요. 어머니가 신던 것이라 발보다 한참 컸습니다. 길을 건너다 마차를 피하느라 두 짝이 다 벗겨졌지요. 한 짝은 눈 속으로 사라져 아무리 찾아도 보이지 않았습니다. / 오른쪽: 남은 한 짝은 지나가던 사내아이가 냉큼 주워 들었지요. 이걸로 배를 만들어야지! 아이는 그것을 들고 저만치 달아났습니다. 성냥팔이 아이는 맨발로 눈길을 걸었지요. 발이 새빨갛게 얼어붙었습니다.〕 |

## 2장 · 창문 너머의 저녁상

| 파일명 | 장면 |
|---|---|
| `images/02-window.webp` | A snowy street where a small girl stands on tiptoe at a lit window watching a family feast with a roast goose steaming on the table, her breath fogging the glass, warm inside and cold outside. 〔이 쪽에 실린 글 (3/14) — 그림에 글자는 넣지 마세요. 왼쪽: 거리에는 좋은 냄새가 가득했습니다. 집집마다 저녁을 짓고 있었거든요. 아이는 밝은 창문 앞에 서서 안을 들여다봤지요. 새하얀 상보 위에 그릇이 가지런히 놓여 있었습니다. 한가운데 거위 요리에서 김이 모락모락 올라왔지요. 아이들이 상 앞에서 웃고 떠들었습니다. / 오른쪽: 성냥팔이 아이는 배가 몹시 고팠지요. 아침부터 아무것도 먹지 못했거든요. 그래도 집에는 갈 수 없었습니다. 성냥을 한 갑도 못 팔았으니까요. 이대로 가면 혼날 거야.〕 |
| `images/02-window-2.webp` | A narrow gap between two tall houses where a small girl huddles out of the wind with her knees drawn up, snow gathering on her shawl, one hand fumbling for a match, quiet and moving. 〔이 쪽에 실린 글 (4/14) — 그림에 글자는 넣지 마세요. 왼쪽: 집이라고 해 봐야 지붕 밑 다락방이었습니다. 지붕에 틈이 벌어져 바람이 그대로 들어왔지요. 짚을 뭉쳐 막아 두었지만 소용이 없었습니다. 거기도 골목만큼이나 추웠지요. 아이는 두 집 사이 좁은 골목으로 들어갔습니다. 그곳은 바람이 조금 덜 들었거든요. / 오른쪽: 골목 안쪽은 캄캄하고 조용했지요. 저 멀리서 사람들 웃음소리만 이따금 들려왔습니다. 아이는 벽에 등을 붙이고 웅크려 앉았지요. 무릎을 끌어안고 발을 그 안에 넣었습니다. 그래도 손이 곱아 잘 펴지지 않았지요. 성냥을 하나 켜 볼까.〕 |

## 3장 · 첫 번째 성냥

| 파일명 | 장면 |
|---|---|
| `images/03-stove.webp` | A dark alley where a struck match flares and its light opens into a vision of a great brass stove blazing warm, the girl stretching her bare feet toward it, magical and comforting. 〔이 쪽에 실린 글 (5/14) — 그림에 글자는 넣지 마세요. 왼쪽: 곱은 손이 떨려 성냥개비를 놓칠 뻔했지요. 아이는 성냥 하나를 꺼내 벽에 대고 그었습니다. 치익— 작은 불꽃이 파르르 피어올랐지요. 아이는 두 손을 불꽃 가까이 가져갔습니다. 어찌나 따뜻하던지요. / 오른쪽: 불빛에 아이의 언 볼이 발갛게 물들었지요. 그런데 불빛 속에 무언가가 보였습니다. 커다란 난로였지요. 놋쇠 다리가 반짝이고 문틈으로 불이 활활 타올랐습니다. 아이는 언 발을 앞으로 쭉 뻗었지요. 온몸이 사르르 녹는 것 같았습니다.〕 |
| `images/03-stove-2.webp` | A match burning out to a black stub in a small hand as the vision of a stove vanishes, and a second match flaring against a wall that turns translucent like gauze, magical. 〔이 쪽에 실린 글 (6/14) — 그림에 글자는 넣지 마세요. 왼쪽: 그때 성냥이 다 타 버렸습니다. 불이 툭 꺼지자 난로도 함께 사라졌지요. 손에는 새까맣게 탄 성냥개비만 남아 있었습니다. 바람이 다시 골목으로 밀려들었지요. 아이는 어깨를 옹송그리며 몸을 떨었습니다. 한 개만 더. / 오른쪽: 아이는 성냥을 또 하나 꺼냈지요. 이번에도 벽에 대고 죽 그었습니다. 치익— 불꽃이 벽을 환하게 비췄지요.〕 |

## 4장 · 두 번째 성냥

| 파일명 | 장면 |
|---|---|
| `images/04-feast.webp` | A vision in matchlight of a laid table with white cloth and fine dishes where a roast goose rises from its platter with a knife still in its back and waddles toward the girl, whimsical and warm. 〔이 쪽에 실린 글 (7/14) — 그림에 글자는 넣지 마세요. 왼쪽: 방 안에는 큰 상이 차려져 있었습니다. 새하얀 식탁보 위에 고운 그릇들이 놓여 있었지요. 한가운데에는 노릇하게 구운 거위 요리가 있었습니다. 김이 모락모락 나고 냄새까지 나는 듯했지요. 아이는 꿀꺽 침을 삼켰습니다. 저 거위 한 조각만 있으면. / 오른쪽: 아이가 저도 모르게 중얼거렸지요. 그때 놀라운 일이 벌어졌지요. 거위가 접시에서 벌떡 일어난 것입니다. 등에 나이프를 꽂은 채였지요. 거위는 뒤뚱뒤뚱 걸어 아이 쪽으로 다가왔습니다. 걸음을 뗄 때마다 접시가 달그락거렸지요.〕 |
| `images/04-feast-2.webp` | A cold blank wall as a match dies and snow settles on a small girl's shoulders, distant church bells and glowing windows above, her hand drawing out a third match, quiet and moving. 〔이 쪽에 실린 글 (8/14) — 그림에 글자는 넣지 마세요. 왼쪽: 그 순간 성냥이 꺼졌습니다. 거위도 상도 온데간데없이 사라졌지요. 눈앞에는 차갑고 축축한 벽뿐이었습니다. 아이는 한참 동안 그 벽을 바라봤지요. 눈은 그치지 않고 계속 내렸습니다. 어깨 위에 하얗게 소복이 쌓였지요. / 오른쪽: 골목 밖으로 마차 한 대가 지나갔습니다. 안에서 흘러나온 노랫소리가 금세 멀어졌지요. 멀리서 종소리가 뎅뎅 울렸습니다. 한 해가 저물어 가고 있었지요. 창문마다 불이 환하고 웃음소리가 흘러나왔습니다. 아이는 곱은 손을 입김으로 녹였지요. 아이는 세 번째 성냥을 꺼내 벽에 그었지요.〕 |

## 5장 · 세 번째 성냥

| 파일명 | 장면 |
|---|---|
| `images/05-tree.webp` | A vision of an enormous decorated tree blazing with thousands of candles, and as the match dies the candle flames rising into the night sky to become stars, breathtaking. 〔이 쪽에 실린 글 (9/14) — 그림에 글자는 넣지 마세요. 왼쪽: 이번에는 커다란 나무가 보였습니다. 천장에 닿을 만큼 큰 나무였지요. 가지마다 촛불이 켜져 있었습니다. 몇 천 개는 되어 보였지요. 반짝이는 장식이 가지 끝에서 흔들렸습니다. / 오른쪽: 아이는 저도 모르게 두 손을 뻗었지요. 그러자 성냥이 또 꺼졌습니다. 그런데 촛불만은 사라지지 않았지요. 위로, 위로 자꾸 올라가더니 하늘에 가서 걸렸습니다. 별이 된 것이었지요.〕 |
| `images/05-tree-2.webp` | A night sky with a shooting star trailing light above a huddled girl, a soft memory of an old woman holding her on her knee glowing at the edge of the scene, tender and sad. 〔이 쪽에 실린 글 (10/14) — 그림에 글자는 넣지 마세요. 왼쪽: 그때 별 하나가 긴 빛줄기를 그리며 흘렀습니다. 아이는 할머니가 해 준 말을 떠올렸지요. 별이 떨어지면 말이야. 누군가 하늘로 가는 거란다. / 오른쪽: 우리 아가, 춥지? 아이를 아껴 준 사람은 할머니뿐이었지요. 무릎에 앉혀 주고 노래도 불러 주었습니다. 할머니, 보고 싶어요.〕 |

## 6장 · 마지막 성냥들

| 파일명 | 장면 |
|---|---|
| `images/06-grandmother.webp` | A dark alley blazing bright as a whole handful of matches burn at once, a warm silver-haired grandmother standing in the light with open arms, the girl scrambling up toward her, radiant. 〔이 쪽에 실린 글 (11/14) — 그림에 글자는 넣지 마세요. 왼쪽: 성냥 여러 개가 한꺼번에 타올랐습니다. 좁은 골목이 대낮처럼 환해졌지요. 그 빛 속에 누군가 서 있었습니다. 할머니였지요. 앞치마에서 늘 나던 냄새까지 나는 듯했습니다. 할머니! / 오른쪽: 이번에는 안 사라지실 거죠? 할머니는 예전 그대로 웃고 계셨지요. 저를 데려가 주세요.〕 |
| `images/06-grandmother-2.webp` | A brilliant column of light in a snowy alley where a grandmother gathers a small girl into her arms, the two rising together into a calm bright sky without snow or wind, luminous and peaceful. 〔이 쪽에 실린 글 (12/14) — 그림에 글자는 넣지 마세요. 왼쪽: 아이는 앞치마 속 성냥을 모두 켰습니다. 골목이 눈부시게 밝아졌지요. 성냥 다발이 한꺼번에 타오르며 탁탁 소리를 냈습니다. 할머니의 모습이 점점 또렷해졌습니다. 어느 때보다 크고 환했지요. 할머니가 두 팔을 벌려 아이를 안았습니다. 아이는 스르르 눈을 감았지요. / 오른쪽: 이제 아무 데도 안 가신다고 해 주세요. 그럼, 안 가고말고. 둘은 빛을 따라 위로 올라갔습니다. 눈도 바람도 없는 곳이었지요. 그곳에서는 춥지도 배고프지도 않았습니다.〕 |

## 7장 · 아침이 오고

| 파일명 | 장면 |
|---|---|
| `images/07-morning.webp` | A sunlit alley on New Year's morning where townspeople stop and look down at a small girl seated with her knees drawn up, a scatter of burnt matches beside her, a faint smile on her face, quiet and gentle. 〔이 쪽에 실린 글 (13/14) — 그림에 글자는 넣지 마세요. 왼쪽: 새해 아침이 밝았습니다. 눈은 어느새 그쳐 있었지요. 햇살이 골목 안까지 들어왔습니다. 지나가던 사람들이 걸음을 멈췄지요. 두 집 사이 좁은 자리에 아이가 앉아 있었습니다. 무릎을 안고 벽에 기댄 채였지요. / 오른쪽: 얼굴에는 웃음이 그대로 남아 있었습니다. 옆에는 성냥개비가 잔뜩 흩어져 있었지요. 한 다발이 몽땅 타 버린 것이었습니다. 이 아이가 왜 여기…… 몸을 녹이려 했나 보군.〕 |
| `images/07-morning-2.webp` | Flowers left in a snowy alley corner, and the following winter a woman stopping in the street to open her door and beckon another cold child inside, warm light spilling out, hopeful. 〔이 쪽에 실린 글 (14/14) — 그림에 글자는 넣지 마세요. 왼쪽: 아이가 무엇을 보았는지는 아무도 알지 못했습니다. 난로도, 거위도, 반짝이던 나무도요. 무엇보다 할머니를 만난 것을요. 그날 저녁 그 골목에 꽃이 한 다발 놓였습니다. 누가 두고 갔는지는 아무도 몰랐지요. 지나가던 아이들이 걸음을 늦추고 그 꽃을 보았습니다. / 오른쪽: 그렇게 한 해가 또 지나 이듬해 겨울이 왔습니다. 그날도 눈이 펑펑 내렸지요. 길을 가던 한 아주머니가 문득 걸음을 멈췄습니다. 길가에 성냥을 든 아이가 서 있었거든요. 얘야, 이리 와서 몸 좀 녹이렴.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
