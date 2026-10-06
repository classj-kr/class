# 시집(Poetry) 154편 전편 수채화 삽화 제작 프롬프트 및 규격

이 문서는 시집(poetry) 감상 메뉴의 **154편 전편의 수채화 삽화 제작 프롬프트 및 규격**을 정리한 문서입니다.
현재 154편 전편의 수채화 삽화 생성, WebP 변환, 개별 `poem.js` 등록 및 뷰어 배치가 **100% 완료**되었습니다.

---

## 1. 이미지 규격 및 배치 규칙

* **규격**: **1:1 정방형 (1024×1024)**, `WebP` 포맷 (품질 85 권장)
* **저장 경로**: `learning/literacy-numeracy/story-books/poetry/poems/<id>/illustration.webp`
* **코드 등록**: 각 시의 `poems/<id>/poem.js` 파일 내 `poem` 객체에 `"illustration": "poems/<id>/illustration.webp"` 추가
* **스타일 특징**:
  * 맑고 은은한 한국적 수채화 & 과슈 (`Classic gentle picture-book watercolor & gouache`)
  * 종이 질감과 자연스럽게 녹아드는 비네팅 가장자리 (`soft vignette edges naturally fading into off-white background`)
  * **절대 금지 (`Strict Negative`)**: 글자, 한자, 간판, 텍스트 일체 금지 (`entirely wordless, textless, no letters, no watermark`), 각진 사각 테두리 금지 (`no harsh borders, no rectangular frame`)

---

## 2. 미완료 22편 프롬프트 목록

### 제56권: 이미지로 그린 마음 (모더니즘 & 감각시)

#### 1. 김광균 — 추일서정 (`gwanggyun-chuil`)
* **장면**: 메마른 가을 들판, 가느다란 미루나무(포플라나무) 가지와 뒹구는 낙엽, 구불구불한 흙길 저 멀리 흰 연기를 내뿜으며 달리는 증기기관차, 언덕 위에 서서 가을 풍경을 바라보는 고독한 인물
* **프롬프트**:
```text
Classic gentle modernist picture-book watercolor & gouache illustration. Autumn countryside landscape with tall, slender bare poplar trees with leafless branches. A winding dirt path stretches across the dry grassland into soft golden sunlight. In the distant plain, a vintage steam train runs puffing white steam. Crisp autumn wind swirls dry golden leaves across the air. A solitary figure stands on a grassy knoll, looking out over the vast autumn scenery. Poetic, melancholic modernist atmosphere, soft gold, ochre and pale blue watercolor tones, soft organic vignette edges fading naturally, entirely wordless, textless, no letters, no watermark.
```

#### 2. 유치환 — 깃발 (`chihwan-gitbal`)
* **장면**: 아득하고 푸른 바다를 향해 높은 깃대 끝에서 힘차게 나부끼는 순백의 깃발(손수건), 눈부신 햇살과 푸른 파도, 닿을 수 없는 이상향을 향한 애달픈 비상
* **프롬프트**:
```text
Classic gentle picture-book watercolor & gouache illustration. A solitary tall flagpole standing on a seaside cliff overlooking a vast deep blue ocean. A pure white flag fluttered gracefully and passionately by the sea breeze, waving like a handkerchief toward the endless horizon. Brilliant sunlight glistening on the gentle blue waves below, soft clouds in the azure sky. Poetic longing and noble aspiration, crisp blue, white, and sea-green watercolor palette, soft organic vignette edges, entirely wordless, textless, no letters, no watermark.
```

#### 3. 유치환 — 생명의 서 (`chihwan-saengmyeong`)
* **장면**: 끝없는 아라비아 사막의 모래 언덕, 이글거리는 태양 아래 고독하지만 결연하게 홀로 서 있는 여행자의 실루엣, 생명의 본질을 마주하는 굳센 기상
* **프롬프트**:
```text
Classic gentle picture-book watercolor & gouache illustration. An expansive, vast golden desert with rolling sand dunes stretching to the far horizon under a blazing yet poetic sun. A solitary noble wanderer in simple traveling robes stands firmly on the crest of a high dune, looking into the endless expanse with solemn resolve. Sublime solitary atmosphere, warm golden sand, terracotta, and soft dusty blue sky tones, delicate brushwork, soft organic vignette edges, entirely wordless, textless, no letters, no watermark.
```

---

### 제57권: 자연에 기댄 마음 (청록파 & 서정주)

#### 4. 박목월 — 나그네 (`mogwol-nageune`)
* **장면**: 강나루 건너 밀밭 길을 붉은 저녁노을 속에서 외줄기 길 따라 유유히 걸어가는 삿갓 쓴 나그네, 남도 삼백 리의 완만한 산자락과 주막 마을
* **프롬프트**:
```text
Classic gentle Korean picture-book watercolor & gouache illustration. A tranquil traditional Korean countryside at sunset. Across a peaceful river ferry landing, a single traveler with a traditional bamboo hat (satgat) and walking staff strolls along a gentle path winding through golden wheat fields. Distant rolling green hills, warm peach and crimson evening glow in the sky, peaceful rustic thatched cottage roofs in the distance. Lyrical, nostalgic, peaceful Korean mood, soft warm watercolor wash, vignette edges, entirely wordless, textless, no letters, no watermark.
```

#### 5. 조지훈 — 승무 (`jihun-seungmu`)
* **장면**: 얇은 사 하이얀 고깔을 숙여 쓰고 순백의 긴 장삼 소매를 허공에 부드럽게 날리며 고요히 춤추는 무용수의 단아한 춤사위, 고즈넉한 사찰 마당과 은은한 달빛
* **프롬프트**:
```text
Classic gentle Korean picture-book watercolor & gouache illustration. A graceful traditional Seungmu dance performance in a moonlit courtyard of an ancient Korean Buddhist temple. A dancer wearing a delicate white pointed cowl and long flowing white silk sleeves (jangsam) leaps gently, fluttering the long sleeves into the calm night air. Serene curved temple eaves in the soft blue moonlight, gentle fallen leaves, transcendent peace and lyrical sorrow, soft ink and pure white watercolor tones, vignette edges, entirely wordless, textless, no letters, no watermark.
```

#### 6. 박두진 — 해 (`dujin-hae`)
* **장면**: 칠흑 같은 어둠을 뚫고 붉은 산봉우리 위로 눈부시게 솟아오르는 이글이글한 아침 해, 푸른 초원에서 평화롭게 함께 뛰노는 사슴과 칡범, 찬란한 희망의 생명력
* **프롬프트**:
```text
Classic gentle picture-book watercolor & gouache illustration. A majestic sunrise bursting over grand mountain peaks. A vibrant, glowing golden-red sun rises into the morning sky, casting warm golden rays over verdant green hills and rolling valleys. In the lush morning meadow below, deer and peaceful wild animals run joyfully together under the morning light. Radiant optimism, celebratory poetic energy, rich coral, emerald, and golden watercolor washes, soft vignette edges, entirely wordless, textless, no letters, no watermark.
```

#### 7. 서정주 — 국화 옆에서 (`jeongju-gukhwa`)
* **장면**: 늦가을 고즈넉한 돌담 아래 소박하게 피어난 한 송이 노란 국화, 찬 서리와 밤이슬을 이겨내고 의연히 피어난 꽃, 곁을 스치는 가을바람
* **프롬프트**:
```text
Classic gentle Korean picture-book watercolor & gouache illustration. A quiet, contemplative autumn garden by a traditional Korean stone wall. A single, beautifully bloomed yellow chrysanthemum stands elegant and resilient, with tiny morning frost dewdrops clinging to its delicate petals. Soft golden autumn sunlight filtering through fallen yellow leaves, peaceful rustic serenity, mature contemplation, muted earthy ochre and soft amber watercolor tones, soft organic vignette edges, entirely wordless, textless, no letters, no watermark.
```

#### 8. 서정주 — 추천사 (`jeongju-chucheonsa`)
* **장면**: 연둣빛 버드나무 가지에 매달린 그네를 타고 고운 한복 자락을 펄럭이며 푸른 하늘과 바다를 향해 힘차게 솟구쳐 오르는 여인(춘향)의 뒷모습
* **프롬프트**:
```text
Classic gentle Korean picture-book watercolor & gouache illustration. A young woman in a vibrant traditional Korean hanbok swinging high up on a rope swing hung from a grand weeping willow tree. Her colorful skirts flutter dramatically against the wide open turquoise sky and fluffy clouds. Looking out toward a distant sparkling blue sea without coral reef boundaries, soaring free from earthly limits. Dynamic, uplifting, poetic freedom, fresh spring watercolor palette of soft green, azure, and pastel pink, vignette edges, entirely wordless, textless, no letters, no watermark.
```

---

### 제58권: 맞서는 마음 (김수영 & 신동엽)

#### 9. 김수영 — 풀 (`suyeong-pul`)
* **장면**: 세찬 비바람이 몰아치는 너른 들판에서 바람에 몸을 눕히면서도 질기게 다시 일어서는 푸른 풀잎들의 파도, 비 갠 뒤 햇살을 맞이하는 강인한 생명력
* **프롬프트**:
```text
Classic gentle picture-book watercolor & gouache illustration. A wide expanse of lush green wild grasses rippling across an open windy field. Dark stormy rain clouds part to reveal a gentle ray of warm sunlight. The resilient grass blades bend gracefully with the strong wind yet rise back up with enduring vitality. Atmospheric, poetic resilience, dynamic wind motion, rich emerald greens, stormy blue-grey and soft sunlit amber watercolor wash, soft organic vignette edges, entirely wordless, textless, no letters, no watermark.
```

#### 10. 김수영 — 눈 (`suyeong-nun`)
* **장면**: 새벽녘 마당 가득 소복소복 하얗게 쌓인 첫눈, 맑고 차가운 새벽 공기 속에서 마당에 서서 깨끗한 눈을 바라보며 깊은 숨을 들이쉬는 청년 시인의 고요한 모습
* **프롬프트**:
```text
Classic gentle picture-book watercolor & gouache illustration. A peaceful early winter dawn in a quiet courtyard covered in untouched, pristine pure white snow. A solitary young Korean poet in a dark coat stands in the snow, gazing thoughtfully at the immaculate white ground in the quiet morning stillness. Faint pale lavender and rosy twilight dawn sky, quiet crisp winter air, poetic purity and moral conscience, soft white and muted navy watercolor tones, vignette edges, entirely wordless, textless, no letters, no watermark.
```

#### 11. 김수영 — 폭포 (`suyeong-pokpo`)
* **장면**: 높은 수직의 검은 암벽에서 한 치의 망설임도 없이 곧게 떨어져 내리는 웅장한 폭포수, 하얗게 부서지는 물보라와 푸른 소(沼), 곧고 곧은 선비의 기개
* **프롬프트**:
```text
Classic gentle picture-book watercolor & gouache illustration. A grand vertical waterfall plummeting straight down from a steep, rugged dark cliff without hesitation. Pure white rushing water cascading dramatically into a clear deep mountain pool below, creating delicate misty water spray. Towering pine trees framing the rocky heights under a clear sky. Fearless, upright, and uncompromising spirit, dynamic vertical energy, cool slate grey, foamy white, and deep pine-green watercolor washes, vignette edges, entirely wordless, textless, no letters, no watermark.
```

#### 12. 김수영 — 어느 날 고궁을 나오면서 (`suyeong-gogung`)
* **장면**: 고색창연한 궁궐 돌담길을 빠져나와 회색빛 현대 서울 거리로 접어드는 시인의 고뇌에 찬 뒷모습, 사소한 일에 분개하던 소시민적 자책과 고독
* **프롬프트**:
```text
Classic gentle picture-book watercolor & gouache illustration. A thoughtful, solitary intellectual in 1960s attire walking out of the gates of an ancient Korean palace with old weathered stone walls into the quiet vintage city street. The man walks with his head slightly bowed in self-reflection and contemplative solitude. Melancholic twilight atmosphere, warm palace tiles contrasting with cool city tones, honest self-examination, soft muted earthy and sepia watercolor palette, vignette edges, entirely wordless, textless, no letters, no watermark.
```

#### 13. 신동엽 — 껍데기는 가라 (`dongyeop-kkeopdegi`)
* **장면**: 거센 봄바람에 마른 껍질과 티끌들은 날아가고, 비옥하고 따뜻한 흙가슴 대지 위에 순수하고 맑은 두 소년 소녀(아사달과 아사녀)가 마주 서 있는 평화로운 광경
* **프롬프트**:
```text
Classic gentle Korean picture-book watercolor & gouache illustration. A symbolic scene on a rolling, sun-drenched hill under a brilliant spring sky. Dry straw husks and dark shadows are blown away by a fresh spring wind, revealing lush, fertile brown earth. Two peaceful youths in simple traditional white garments stand gently hand-in-hand in the center of pure nature, surrounded by early spring sprouts. Pure, solemn, and hopeful atmosphere, warm earth tones, fresh spring greens, and azure sky watercolor wash, vignette edges, entirely wordless, textless, no letters, no watermark.
```

---

### 제59권: 존재를 묻는 시 (김춘수 & 천상병 & 황동규)

#### 14. 김춘수 — 꽃 (`chunsu-kkot`)
* **장면**: 어둠 속에서 조심스러운 손길과 다정한 부름을 받아 은은하고 따뜻한 빛을 머금고 피어나는 신비롭고 순결한 꽃 한 송이, 존재의 만남과 의미
* **프롬프트**:
```text
Classic gentle picture-book watercolor & gouache illustration. A poetic, dreamlike scene where a solitary beautiful blossom glows with soft, warm luminescent light amidst a gentle, ethereal pastel background. A delicate hand reaches out gently toward the flower in loving recognition. Tender connection, awakening of meaning and existence, dreamy lavender, soft rose, and pale golden watercolor washes, soft feathered edges melting into off-white background, entirely wordless, textless, no letters, no watermark.
```

#### 15. 김춘수 — 서시 (`chunsu-seosi`)
* **장면**: 깊고 푸른 바닷속을 헤엄치는 은빛 물고기, 눈을 감고 미지의 세계와 존재의 근원을 응시하는 듯한 명상적인 푸른 공간, 투명한 물결의 유영
* **프롬프트**:
```text
Classic gentle picture-book watercolor & gouache illustration. A contemplative, dreamy underwater scene. A slender silver fish glides serenely through deep cobalt and translucent turquoise waters, trailing soft shimmering bubbles of light. Ripples of gentle sunlight filter down from the distant water surface. Meditative introspection, quiet poetic mystery, deep oceanic blues, aquamarine, and silver-white watercolor tones, soft organic vignette edges, entirely wordless, textless, no letters, no watermark.
```

#### 16. 천상병 — 귀천 (`sangbyeong-gwicheon`)
* **장면**: 아름다운 노을빛 하늘로 날아오르는 은빛 새와 맑은 영혼, 이 세상 소풍을 마치고 노을 속으로 미소 지으며 귀향하는 평화롭고 순수한 발걸음
* **프롬프트**:
```text
Classic gentle picture-book watercolor & gouache illustration. A deeply peaceful twilight sky filled with soft golden, apricot, and lavender sunset clouds. A tiny flock of graceful white birds flies serenely toward the glowing evening horizon above quiet grassy hills with blooming wildflowers. A sense of a joyful picnic concluded, transcendent peace and pure gratitude, ethereal storybook atmosphere, soft watercolor washes fading seamlessly into the background, entirely wordless, textless, no letters, no watermark.
```

#### 17. 황동규 — 즐거운 편지 (`dongyu-pyeonji`)
* **장면**: 눈 내리는 겨울날, 따뜻한 등불이 켜진 서재 창가 책상에서 만년필로 정성껏 편지를 쓰는 모습, 창밖으로 소복소복 쌓이는 흰 눈과 언덕
* **프롬프트**:
```text
Classic gentle picture-book watercolor & gouache illustration. A cozy, nostalgic room on a quiet snowy evening. Warm golden lamp light illuminates a wooden writing desk by a frosted window, where a fountain pen rests on handmade writing paper. Outside the window, soft snowflakes fall gently over a quiet snow-covered lane and sleepy houses. Unwavering gentle devotion, warm amber indoor glow contrasting with soft cool blue snowy night, vignette edges, entirely wordless, textless, no letters, no watermark.
```

---

### 제60권: 삶의 애환을 담은 시 (신경림 & 박재삼 & 곽재구 & 기형도)

#### 18. 신경림 — 농무 (`gyeongnim-nongmu`)
* **장면**: 해 질 녘 텅 빈 시골 장터 마당에서 꽹과리와 북을 울리며 흙먼지 속에서 한과 울분을 신명으로 풀어내는 농민들의 역동적인 농악 춤판
* **프롬프트**:
```text
Classic gentle Korean picture-book watercolor & gouache illustration. A dynamic traditional Korean farmers' dance (nongmu) in a rural village square at dusk. Village farmers in simple clothes with headbands joyfully and passionately play gongs (kkwaenggwari) and drums, kicking up golden dust as they dance in a circle. Empty market stalls and weathered roofs behind them under a fiery orange sunset sky. Bittersweet sorrow and vibrant folk spirit, earthy ochre, burnt sienna, and dusk purple watercolor washes, vignette edges, entirely wordless, textless, no letters, no watermark.
```

#### 19. 박재삼 — 추억에서 (`jaesam-chueok`)
* **장면**: 찬 바람 부는 늦은 밤, 어스름한 달빛 아래 생선 광주리를 머리에 이고 지친 발걸음으로 골목길을 걸어 돌아오는 어머니의 애달픈 실루엣
* **프롬프트**:
```text
Classic gentle Korean picture-book watercolor & gouache illustration. A deeply moving, poignant scene in a quiet rural Korean alleyway late at night under a pale moon. A loving mother in a worn traditional apron and shawl walks weary steps homeward, balancing an empty fish basket on her head. Gentle moonlight glimmers on quiet earthen roofs and fallen leaves. Maternal sacrifice and deep familial nostalgia, soft indigo, pale moonlit grey, and warm hearth glow in the distance, vignette edges, entirely wordless, textless, no letters, no watermark.
```

#### 20. 박재삼 — 울음이 타는 가을 강 (`jaesam-gaeulgang`)
* **장면**: 서산으로 넘어가는 붉은 저녁노을이 온 강물을 불태우듯 주홍빛과 금빛으로 물들이고, 강둑 갈대밭에 서서 물끄러미 흐르는 강물을 바라보는 나그네
* **프롬프트**:
```text
Classic gentle Korean picture-book watercolor & gouache illustration. A breathtaking autumn river at sunset, where the entire calm water surface burns with radiant reflections of crimson, vermilion, and deep amber evening sky. Tall golden reeds sway along the quiet riverbank. A solitary figure stands peacefully among the reeds, watching the glowing water flow into the distance. Lyrical sorrow and sublime beauty, rich warm sunset watercolor gradients fading into soft paper edges, entirely wordless, textless, no letters, no watermark.
```

#### 21. 곽재구 — 사평역에서 (`jaegu-sapyeong`)
* **장면**: 함박눈 내리는 밤골 시골 간이역 대합실, 붉게 타오르는 톱밥 난로 주위에 옹기종기 모여 앉아 시린 손을 녹이며 막차를 기다리는 사람들의 따뜻한 숨결
* **프롬프트**:
```text
Classic gentle picture-book watercolor & gouache illustration. Inside a cozy, rustic rural Korean train waiting room on a snowy winter night. A small iron sawdust stove glows with warm orange embers in the center. Humble passengers with scarves and winter coats sit quietly on wooden benches, warming their hands together in quiet companionship. Outside the frosted window panes, heavy snow falls in the blue darkness. Warm human compassion, comforting amber hearth light against deep winter indigo, vignette edges, entirely wordless, textless, no letters, no watermark.
```

#### 22. 기형도 — 빈집 (`gihyeongdo-binjip`)
* **장면**: 늦가을 황혼의 쓸쓸한 빈방, 덧문이 닫히고 바닥에 흩어진 편지들과 촛농 자국, 사랑을 묻어두고 문을 닫고 떠나는 고요하고 비장한 고별의 순간
* **프롬프트**:
```text
Classic gentle modernist picture-book watercolor & gouache illustration. A solitary, quiet empty room at late autumn twilight. A closed wooden window shutter lets in faint slats of cool purple-blue dusk light. On the wooden floor, a single extinguished candle in a ceramic holder with hardened white wax, and faint scattered sheets of paper. Melancholic departure, quiet resignation, poetic farewell to past love, muted mauve, deep navy, and soft dusky grey watercolor washes, vignette edges, entirely wordless, textless, no letters, no watermark.
```

---

## 3. WebP 변환 및 코드 적용 스크립트 (참고용)

이미지가 생성되면 파이썬으로 손쉽게 85 품질의 WebP로 변환하여 배치할 수 있습니다:

```python
from PIL import Image

def process_image(src_jpg_path, poem_id):
    img = Image.open(src_jpg_path)
    dest_path = f"learning/literacy-numeracy/story-books/poetry/poems/{poem_id}/illustration.webp"
    img.save(dest_path, "WEBP", quality=85)
    print(f"Saved {dest_path}")
```
