# 제미나이 그림 프롬프트

이 책은 하나의 이야기를 8개의 장(챕터)으로 나눠 담았고, 펼침면은 모두
16개예요. 펼침면 하나에 그림이 한 장씩 들어갑니다.
그림이 펼침면 전체 폭을 가득 채우고, 그 아래에 이야기가 왼쪽·오른쪽으로 나뉘어 들어갑니다.

아래 프롬프트를 제미나이에 그대로 넣어서 생성한 뒤, 파일명을 정확히 맞춰서
`images/` 폴더에 저장하면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보여요.)

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
bold clean outlines, saturated storybook colors, warm amber desert light, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a Middle Eastern palace with domes and tiled courtyards,
a bazaar, palm groves and ruined desert halls, expressive comic faces, wide
panoramic composition, funny and adventurous, never frightening.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
The caliph Chasid: a good-natured king with a round beard, a turban and a green
robe, who becomes a tall white stork with an anxious expression. Mansor the
vizier: a lean older man with a grey beard who becomes a second, skinnier stork.
The pedlar: a hunched man with a sly grin and a tray of trinkets. The owl
princess: a small brown owl with enormous gentle eyes. The wizard Kaschnur: a
tall man in dark robes with a pointed beard, comically villainous.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: two white storks standing on a domed palace rooftop at sunset looking out over a Middle Eastern city of minarets and palm trees, a small carved box lying open beside them, warm amber light, magical and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 이상한 가루

| 파일명 | 장면 |
|---|---|
| `images/01-powder.webp` | A tiled palace courtyard where a turbaned king and his lean vizier sit with coffee as a hunched pedlar offers a small carved box, warm amber light and rich carpets. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 바그다드에 하시드라는 임금님이 살았습니다. 마음씨가 좋고 웃기를 잘했지요. 무엇보다 신기한 물건을 좋아했습니다. 오후가 되면 물담배를 피우며 쉬었지요. 그날도 뜰에서 커피를 마시던 참이었습니다. 대신 만소르가 곁에 앉아 있었지요. / 오른쪽: 그때 등짐장수 하나가 찾아왔습니다. 등이 굽고 웃음이 이상한 사람이었지요. 귀한 물건을 가져왔습니다. 장수는 작은 나무 상자를 내밀었습니다.〕 |
| `images/01-powder-2.webp` | A palace chamber where a king and vizier lean over an open box of dark powder and a scroll while a scholar reads the strange writing aloud, lamplight. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 장수가 가고 나서 상자를 열었습니다. 안에는 검은 가루가 담겨 있었지요. 그 옆에 종이가 한 장 있었습니다. 낯선 글자가 빼곡히 적혀 있었지요. 아무도 읽지 못하는 글자였습니다. 임금님은 글을 잘 아는 사람을 불렀지요. / 오른쪽: 그 사람이 한참 들여다보더니 말했습니다. 이건 아주 오래된 글자입니다. 가루를 맡고 주문을 외우면요.〕 |

## 2장 · 절대 웃지 말 것

| 파일명 | 장면 |
|---|---|
| `images/02-warning.webp` | A palace chamber where a scholar reads a warning from a scroll and the vizier looks alarmed while the king waves it off cheerfully, comic tension. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 짐승의 말도 알아듣게 된다는군! 임금님은 신이 나서 손뼉을 쳤습니다. 그런데 종이 아래쪽에 작은 글씨가 있었지요. 글 아는 사람이 그것도 읽어 주었습니다. / 오른쪽: 그러면 다시는 사람이 되지 못한다. 방 안이 조용해졌지요. 만소르가 걱정스러운 얼굴을 했습니다. 임금님, 이건 위험합니다.〕 |
| `images/02-warning-2.webp` | A palace garden pond at dawn where a king and vizier crouch behind reeds watching two white storks wade, an open box in the king's hand, comic secrecy. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 임금님은 그 말을 흘려들었습니다. 웃지만 않으면 되지 않소. 그게 뭐 어렵다고. / 오른쪽: 마침 황새 두 마리가 물가를 거닐고 있었지요. 긴 다리로 성큼성큼 걸었습니다. 저것으로 해 봅시다. 임금님이 상자를 열었지요. 검은 가루가 아침 햇빛에 반짝였습니다.〕 |

## 3장 · 황새가 되어

| 파일명 | 장면 |
|---|---|
| `images/03-storks.webp` | A king and vizier sniffing dark powder and transforming into two white storks by a pond, legs and necks stretching, feathers sprouting, magical and funny. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 두 사람은 가루를 코에 댔습니다. 그러고는 함께 주문을 외웠지요. 무타보르! 순식간에 몸이 이상해졌습니다. 다리가 쭉 길어졌지요. 목도 길어지고 온몸이 하얘졌습니다. / 오른쪽: 어느새 황새 두 마리가 되어 있었습니다. 이거 참 신기하구려! 두 황새는 물가를 걸어 보았지요. 걸음이 절로 성큼성큼해졌습니다. 두 황새는 신이 나서 웃을 뻔했지요.〕 |
| `images/03-storks-2.webp` | Two newly transformed storks doubled over laughing as a real stork performs a ridiculous high-stepping dance on a pond bank, feathers flying, hilarious. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그때 진짜 황새들이 다가왔습니다. 놀랍게도 그 말이 그대로 들렸지요. 오늘 아침 개구리는 맛이 어떻던가? 그저 그렇더군. / 오른쪽: 한쪽 다리를 높이 들고 뒤뚱거렸습니다. 이보게, 내 춤 솜씨가 어떤가? 그 꼴이 어찌나 우스운지 몰랐지요. 두 황새는 그만 참지 못했습니다.〕 |

## 4장 · 잊어버린 주문

| 파일명 | 장면 |
|---|---|
| `images/04-forgot.webp` | Two storks staring at each other and then at their reflections in a pond in dawning horror, feathers ruffled, comic despair. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 웃음이 그치자 두 황새는 얼어붙었습니다. 만소르의 얼굴이 하얗게 질렸지요. 임금님, 웃으시면 안 되는데요! 임금님도 그제야 정신이 들었습니다. / 오른쪽: 주문이…… 주문이 뭐였지? 아무리 애를 써도 떠오르지 않았습니다. 첫 글자조차 생각나지 않았지요. 두 황새는 서로를 마주 보았습니다. 연못에 비친 것은 여전히 황새였지요.〕 |
| `images/04-forgot-2.webp` | Two storks at a palace window being chased off by servants with brooms, then perched on a domed rooftop looking down at a bustling city, comic and sad. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 두 황새는 궁궐로 날아갔습니다. 창가에 앉아 신하들을 불렀지요. 나다! 임금이다! 하지만 사람들 귀에는 새소리로만 들렸습니다. / 오른쪽: 어디서 새가 들어왔어! 어서 쫓아내라! 두 황새는 지붕 위로 달아났지요. 거기 앉아 저잣거리를 내려다보았습니다. 벌써 다른 임금을 세운다는 말이 돌았지요.〕 |

## 5장 · 폐허의 올빼미

| 파일명 | 장면 |
|---|---|
| `images/05-owl.webp` | A ruined desert hall with broken pillars and moonlight through a collapsed roof, two storks meeting a small brown owl with huge sorrowful eyes, atmospheric and tender. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 갈 곳이 없어진 두 황새는 사막으로 날았습니다. 며칠을 헤매다 낡은 건물을 발견했지요. 기둥이 무너지고 지붕이 뚫린 곳이었습니다. 두 황새는 그 안으로 들어갔지요. 어두운 방에서 흐느끼는 소리가 났습니다. 구석에 작은 올빼미가 웅크리고 있었지요. 눈이 아주 크고 슬퍼 보였습니다. / 오른쪽: 누구세요? 올빼미가 날개로 얼굴을 가렸지요. 먼지가 발밑에서 뽀얗게 일었습니다. 두 황새는 그동안의 일을 이야기했지요. 올빼미가 고개를 끄덕였습니다.〕 |
| `images/05-owl-2.webp` | A small owl telling her story to two storks among ruined pillars in moonlight, then lowering her voice with a hopeful glint, tender and conspiratorial. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 저는 원래 인도 임금님의 딸이랍니다. 카슈누어라는 마법사가 저를 이렇게 만들었지요. 그자에게 시집가지 않겠다고 했거든요. / 오른쪽: 두 황새는 딱한 마음이 들었지요. 그때 올빼미가 목소리를 낮췄습니다. 그런데 좋은 소식이 있어요.〕 |

## 6장 · 엿들은 밤

| 파일명 | 장면 |
|---|---|
| `images/06-eavesdrop.webp` | A candlelit ruin where dark-robed figures gather around a low table while two storks and an owl press flat behind a broken wall, tense and thrilling. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 셋은 무너진 벽 뒤에 몸을 숨겼습니다. 숨소리도 내지 않았지요. 한밤중이 되자 발소리가 났습니다. 검은 옷을 입은 무리가 들어왔지요. 가운데 앉은 자가 카슈누어였습니다. 수염이 뾰족하고 눈이 매서웠지요. / 오른쪽: 무리는 낮은 상에 둘러앉았습니다. 저마다 그동안 한 일을 늘어놓았지요. 이윽고 카슈누어가 껄껄 웃었습니다. 내 이야기가 제일 재미있을걸.〕 |
| `images/06-eavesdrop-2.webp` | Dark-robed figures laughing around a table as two storks behind a wall stare at each other in sudden realisation, an owl covering their beaks with a wing, thrilling. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 바그다드 임금이 황새가 되어 헤맨다지. 내가 등짐장수로 꾸미고 가루를 팔았거든. 주문이 무어냐고? / 오른쪽: 무타보르! 바로 그거였어! 하마터면 소리를 지를 뻔했습니다. 올빼미가 얼른 날개로 부리를 막아 주었지요. 셋은 모임이 끝나기를 기다렸습니다. 새벽이 되자 무리가 흩어졌지요. 발소리가 하나씩 멀어졌습니다. 셋은 그제야 숨을 크게 내쉬었지요.〕 |

## 7장 · 다시 떠오른 말

| 파일명 | 장면 |
|---|---|
| `images/07-mutabor.webp` | Two storks facing the dawn and transforming back into a king and vizier in a moonlit desert courtyard, feathers scattering into light, triumphant. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 두 황새는 밖으로 나왔습니다. 동쪽 하늘이 조금씩 밝아 오고 있었지요. 둘은 나란히 동쪽을 향해 섰습니다. 그러고는 목소리를 모아 외쳤지요. 무타보르! / 오른쪽: 다리가 줄어들고 부리가 사라졌지요. 두 사람이 예전 모습으로 돌아왔습니다. 임금님은 제 손을 들여다보았지요. 만소르는 그 자리에 주저앉았습니다. 살았습니다, 임금님! 두 사람은 서로를 얼싸안았지요.〕 |
| `images/07-mutabor-2.webp` | An owl transforming into a beautiful princess as a king nods, then three figures seizing a sleeping wizard in a ruined chamber, radiant and triumphant. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그런데 올빼미가 그대로였습니다. 주문으로는 그 마법이 풀리지 않았지요. 올빼미가 조용히 말했습니다. 저를 아내로 맞아 주면 풀린답니다. 임금님은 잠시 생각하다 고개를 끄덕였지요. 그 순간 올빼미의 모습이 달라졌습니다. 깃털이 사라지고 고운 아가씨가 되었지요. / 오른쪽: 아가씨가 제 손을 한참 들여다봤습니다. 몇 해 만인지 몰라요. 세 사람은 마법사가 자는 방으로 갔습니다. 카슈누어는 곤히 잠들어 있었지요. 세 사람이 그자를 붙잡았습니다.〕 |

## 8장 · 궁궐로 돌아가다

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | A joyful Baghdad street where crowds cheer and throw flowers as a returning king, vizier and princess walk to the palace, banners and drums, warm celebration. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 세 사람은 바그다드로 돌아왔습니다. 성문에서 사람들이 걸음을 멈췄지요. 임금님이 살아 돌아오셨다! 소식은 금세 온 도시에 퍼졌습니다. 신하들이 달려 나와 임금님을 맞았지요. 거리마다 사람들이 몰려나왔습니다. / 오른쪽: 북을 치고 꽃을 뿌렸지요. 임금님은 그동안의 일을 다 이야기했습니다. 황새가 되었던 이야기도 빼놓지 않았지요. 사람들이 배를 잡고 웃었습니다. 임금님도 함께 웃었지요. 이제는 웃어도 괜찮았으니까요.〕 |
| `images/08-ending-2.webp` | A palace hall where a king holds up the little box with a rueful grin as servants carry it to a storeroom, the vizier smiling knowingly, warm daylight. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 궁궐에 들어선 임금님이 상자를 꺼냈습니다. 그 검은 가루가 든 상자였지요. 임금님은 그것을 높이 들어 보였습니다. 이건 창고 깊숙이 넣어 두게. 자물쇠도 단단히 채우고. / 오른쪽: 만소르가 빙그레 웃었지요. 임금님이 헛기침을 했습니다. 알았네, 알았어. 제가 말씀드리지 않았습니까.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
