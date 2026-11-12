// Shared display order and typing vocabulary. Keys are persistent identities: never renumber them.
(function(root,factory){const catalog=factory();if(typeof module==='object'&&module.exports)module.exports=catalog;else root.ClassAvatarCatalog=catalog;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const groups=Object.freeze([
  {
    "id": "pets",
    "label": "친숙한 동물",
    "category": "animal"
  },
  {
    "id": "wild",
    "label": "숲과 초원의 동물",
    "category": "animal"
  },
  {
    "id": "birds",
    "label": "새",
    "category": "animal"
  },
  {
    "id": "reptiles",
    "label": "파충류와 양서류",
    "category": "animal"
  },
  {
    "id": "sea",
    "label": "바다 친구들",
    "category": "animal"
  },
  {
    "id": "bugs",
    "label": "곤충과 작은 생물",
    "category": "animal"
  },
  {
    "id": "fantasy",
    "label": "공룡과 상상 속 동물",
    "category": "animal"
  },
  {
    "id": "fruit",
    "label": "과일",
    "category": "food"
  },
  {
    "id": "vegetables",
    "label": "채소",
    "category": "food"
  },
  {
    "id": "meals",
    "label": "음식",
    "category": "food"
  },
  {
    "id": "treats",
    "label": "간식과 음료",
    "category": "food"
  },
  {
    "id": "plants",
    "label": "꽃과 식물",
    "category": "object"
  },
  {
    "id": "sky",
    "label": "하늘과 우주",
    "category": "object"
  },
  {
    "id": "vehicles",
    "label": "탈것",
    "category": "object"
  },
  {
    "id": "sports",
    "label": "운동과 놀이",
    "category": "object"
  },
  {
    "id": "everyday",
    "label": "생활 속 물건",
    "category": "object"
  },
  {
    "id": "special",
    "label": "선물과 특별한 소품",
    "category": "object"
  }
].map(Object.freeze));
const items=Object.freeze([
  {
    "key": "animal-cat.webp",
    "name": "고양이",
    "answer": "cat",
    "category": "animal",
    "group": "pets"
  },
  {
    "key": "animal-dog.webp",
    "name": "강아지",
    "answer": "dog",
    "category": "animal",
    "group": "pets"
  },
  {
    "key": "animal-rabbit.webp",
    "name": "토끼",
    "answer": "rabbit",
    "category": "animal",
    "group": "pets"
  },
  {
    "key": "animal-mouse.webp",
    "name": "생쥐",
    "answer": "mouse",
    "category": "animal",
    "group": "pets"
  },
  {
    "key": "animal-hedgehog.webp",
    "name": "고슴도치",
    "answer": "hedgehog",
    "category": "animal",
    "group": "pets"
  },
  {
    "key": "animal-squirrel.webp",
    "name": "다람쥐",
    "answer": "squirrel",
    "category": "animal",
    "group": "pets"
  },
  {
    "key": "animal-cow.webp",
    "name": "소",
    "answer": "cow",
    "category": "animal",
    "group": "pets"
  },
  {
    "key": "animal-llama.webp",
    "name": "양",
    "answer": "sheep",
    "category": "animal",
    "group": "pets"
  },
  {
    "key": "animal-bear.webp",
    "name": "곰",
    "answer": "bear",
    "category": "animal",
    "group": "wild"
  },
  {
    "key": "animal-panda.webp",
    "name": "판다",
    "answer": "panda",
    "category": "animal",
    "group": "wild"
  },
  {
    "key": "animal-koala.webp",
    "name": "코알라",
    "answer": "koala",
    "category": "animal",
    "group": "wild"
  },
  {
    "key": "animal-sloth.webp",
    "name": "나무늘보",
    "answer": "sloth",
    "category": "animal",
    "group": "wild"
  },
  {
    "key": "animal-monkey.webp",
    "name": "원숭이",
    "answer": "monkey",
    "category": "animal",
    "group": "wild"
  },
  {
    "key": "animal-meerkat.webp",
    "name": "미어캣",
    "answer": "meerkat",
    "category": "animal",
    "group": "wild"
  },
  {
    "key": "animal-kangaroo.webp",
    "name": "캥거루",
    "answer": "kangaroo",
    "category": "animal",
    "group": "wild"
  },
  {
    "key": "animal-deer.webp",
    "name": "사슴",
    "answer": "deer",
    "category": "animal",
    "group": "wild"
  },
  {
    "key": "animal-fox.webp",
    "name": "여우",
    "answer": "fox",
    "category": "animal",
    "group": "wild"
  },
  {
    "key": "animal-wolf.webp",
    "name": "늑대",
    "answer": "wolf",
    "category": "animal",
    "group": "wild"
  },
  {
    "key": "animal-lion.webp",
    "name": "사자",
    "answer": "lion",
    "category": "animal",
    "group": "wild"
  },
  {
    "key": "animal-tiger.webp",
    "name": "호랑이",
    "answer": "tiger",
    "category": "animal",
    "group": "wild"
  },
  {
    "key": "animal-elephant.webp",
    "name": "코끼리",
    "answer": "elephant",
    "category": "animal",
    "group": "wild"
  },
  {
    "key": "animal-giraffe.webp",
    "name": "기린",
    "answer": "giraffe",
    "category": "animal",
    "group": "wild"
  },
  {
    "key": "animal-rhinoceros.webp",
    "name": "코뿔소",
    "answer": "rhinoceros",
    "category": "animal",
    "group": "wild"
  },
  {
    "key": "animal-hippopotamus.webp",
    "name": "하마",
    "answer": "hippopotamus",
    "category": "animal",
    "group": "wild"
  },
  {
    "key": "animal-chick.webp",
    "name": "병아리",
    "answer": "chick",
    "category": "animal",
    "group": "birds"
  },
  {
    "key": "animal-duck.webp",
    "name": "오리",
    "answer": "duck",
    "category": "animal",
    "group": "birds"
  },
  {
    "key": "animal-penguin.webp",
    "name": "펭귄",
    "answer": "penguin",
    "category": "animal",
    "group": "birds"
  },
  {
    "key": "animal-owl.webp",
    "name": "부엉이",
    "answer": "owl",
    "category": "animal",
    "group": "birds"
  },
  {
    "key": "animal-eagle.webp",
    "name": "독수리",
    "answer": "eagle",
    "category": "animal",
    "group": "birds"
  },
  {
    "key": "animal-peacock.webp",
    "name": "공작",
    "answer": "peacock",
    "category": "animal",
    "group": "birds"
  },
  {
    "key": "animal-flamingo.webp",
    "name": "플라밍고",
    "answer": "flamingo",
    "category": "animal",
    "group": "birds"
  },
  {
    "key": "animal-ostrich.webp",
    "name": "타조",
    "answer": "ostrich",
    "category": "animal",
    "group": "birds"
  },
  {
    "key": "animal-frog.webp",
    "name": "개구리",
    "answer": "frog",
    "category": "animal",
    "group": "reptiles"
  },
  {
    "key": "animal-turtle.webp",
    "name": "거북이",
    "answer": "turtle",
    "category": "animal",
    "group": "reptiles"
  },
  {
    "key": "animal-crocodile.webp",
    "name": "악어",
    "answer": "crocodile",
    "category": "animal",
    "group": "reptiles"
  },
  {
    "key": "animal-crested-gecko.webp",
    "name": "크레스티드 게코",
    "answer": "crested gecko",
    "category": "animal",
    "group": "reptiles"
  },
  {
    "key": "animal-leopard-gecko.webp",
    "name": "레오파드 게코",
    "answer": "leopard gecko",
    "category": "animal",
    "group": "reptiles"
  },
  {
    "key": "animal-viper.webp",
    "name": "살모사",
    "answer": "viper",
    "category": "animal",
    "group": "reptiles"
  },
  {
    "key": "animal-ratsnake.webp",
    "name": "구렁이",
    "answer": "rat snake",
    "category": "animal",
    "group": "reptiles"
  },
  {
    "key": "animal-dolphin.webp",
    "name": "돌고래",
    "answer": "dolphin",
    "category": "animal",
    "group": "sea"
  },
  {
    "key": "animal-whale.webp",
    "name": "고래",
    "answer": "whale",
    "category": "animal",
    "group": "sea"
  },
  {
    "key": "animal-seal.webp",
    "name": "물개",
    "answer": "seal",
    "category": "animal",
    "group": "sea"
  },
  {
    "key": "animal-shark.webp",
    "name": "상어",
    "answer": "shark",
    "category": "animal",
    "group": "sea"
  },
  {
    "key": "animal-stingray.webp",
    "name": "가오리",
    "answer": "stingray",
    "category": "animal",
    "group": "sea"
  },
  {
    "key": "animal-octopus.webp",
    "name": "문어",
    "answer": "octopus",
    "category": "animal",
    "group": "sea"
  },
  {
    "key": "animal-crab.webp",
    "name": "게",
    "answer": "crab",
    "category": "animal",
    "group": "sea"
  },
  {
    "key": "animal-jellyfish.webp",
    "name": "해파리",
    "answer": "jellyfish",
    "category": "animal",
    "group": "sea"
  },
  {
    "key": "animal-caterpillar.webp",
    "name": "애벌레",
    "answer": "caterpillar",
    "category": "animal",
    "group": "bugs"
  },
  {
    "key": "animal-butterfly.webp",
    "name": "나비",
    "answer": "butterfly",
    "category": "animal",
    "group": "bugs"
  },
  {
    "key": "animal-bee.webp",
    "name": "꿀벌",
    "answer": "bee",
    "category": "animal",
    "group": "bugs"
  },
  {
    "key": "animal-ladybug.webp",
    "name": "무당벌레",
    "answer": "ladybug",
    "category": "animal",
    "group": "bugs"
  },
  {
    "key": "animal-dragonfly.webp",
    "name": "잠자리",
    "answer": "dragonfly",
    "category": "animal",
    "group": "bugs"
  },
  {
    "key": "animal-praying-mantis.webp",
    "name": "사마귀",
    "answer": "praying mantis",
    "category": "animal",
    "group": "bugs"
  },
  {
    "key": "animal-stag-beetle.webp",
    "name": "사슴벌레",
    "answer": "stag beetle",
    "category": "animal",
    "group": "bugs"
  },
  {
    "key": "animal-rhinoceros-beetle.webp",
    "name": "장수풍뎅이",
    "answer": "rhinoceros beetle",
    "category": "animal",
    "group": "bugs"
  },
  {
    "key": "animal-snail.webp",
    "name": "달팽이",
    "answer": "snail",
    "category": "animal",
    "group": "bugs"
  },
  {
    "key": "animal-triceratops.webp",
    "name": "트리케라톱스",
    "answer": "triceratops",
    "category": "animal",
    "group": "fantasy"
  },
  {
    "key": "animal-dragon.webp",
    "name": "드래곤",
    "answer": "dragon",
    "category": "animal",
    "group": "fantasy"
  },
  {
    "key": "animal-unicorn.webp",
    "name": "유니콘",
    "answer": "unicorn",
    "category": "animal",
    "group": "fantasy"
  },
  {
    "key": "fruit-apple.webp",
    "name": "사과",
    "answer": "apple",
    "category": "food",
    "group": "fruit"
  },
  {
    "key": "fruit-strawberry.webp",
    "name": "딸기",
    "answer": "strawberry",
    "category": "food",
    "group": "fruit"
  },
  {
    "key": "fruit-cherry.webp",
    "name": "체리",
    "answer": "cherry",
    "category": "food",
    "group": "fruit"
  },
  {
    "key": "fruit-grape.webp",
    "name": "포도",
    "answer": "grape",
    "category": "food",
    "group": "fruit"
  },
  {
    "key": "fruit-blueberry.webp",
    "name": "블루베리",
    "answer": "blueberry",
    "category": "food",
    "group": "fruit"
  },
  {
    "key": "fruit-peach.webp",
    "name": "복숭아",
    "answer": "peach",
    "category": "food",
    "group": "fruit"
  },
  {
    "key": "fruit-persimmon.webp",
    "name": "감",
    "answer": "persimmon",
    "category": "food",
    "group": "fruit"
  },
  {
    "key": "fruit-orange.webp",
    "name": "오렌지",
    "answer": "orange",
    "category": "food",
    "group": "fruit"
  },
  {
    "key": "fruit-banana.webp",
    "name": "바나나",
    "answer": "banana",
    "category": "food",
    "group": "fruit"
  },
  {
    "key": "fruit-mango.webp",
    "name": "망고",
    "answer": "mango",
    "category": "food",
    "group": "fruit"
  },
  {
    "key": "fruit-pineapple.webp",
    "name": "파인애플",
    "answer": "pineapple",
    "category": "food",
    "group": "fruit"
  },
  {
    "key": "fruit-watermelon.webp",
    "name": "수박",
    "answer": "watermelon",
    "category": "food",
    "group": "fruit"
  },
  {
    "key": "fruit-melon.webp",
    "name": "멜론",
    "answer": "melon",
    "category": "food",
    "group": "fruit"
  },
  {
    "key": "fruit-avocado.webp",
    "name": "아보카도",
    "answer": "avocado",
    "category": "food",
    "group": "fruit"
  },
  {
    "key": "vegetable-carrot.webp",
    "name": "당근",
    "answer": "carrot",
    "category": "food",
    "group": "vegetables"
  },
  {
    "key": "vegetable-radish.webp",
    "name": "무",
    "answer": "radish",
    "category": "food",
    "group": "vegetables"
  },
  {
    "key": "vegetable-potato.webp",
    "name": "감자",
    "answer": "potato",
    "category": "food",
    "group": "vegetables"
  },
  {
    "key": "vegetable-sweet-potato.webp",
    "name": "고구마",
    "answer": "sweet potato",
    "category": "food",
    "group": "vegetables"
  },
  {
    "key": "vegetable-corn.webp",
    "name": "옥수수",
    "answer": "corn",
    "category": "food",
    "group": "vegetables"
  },
  {
    "key": "vegetable-pumpkin.webp",
    "name": "호박",
    "answer": "pumpkin",
    "category": "food",
    "group": "vegetables"
  },
  {
    "key": "vegetable-tomato.webp",
    "name": "토마토",
    "answer": "tomato",
    "category": "food",
    "group": "vegetables"
  },
  {
    "key": "vegetable-bell-pepper.webp",
    "name": "피망",
    "answer": "bell pepper",
    "category": "food",
    "group": "vegetables"
  },
  {
    "key": "vegetable-eggplant.webp",
    "name": "가지",
    "answer": "eggplant",
    "category": "food",
    "group": "vegetables"
  },
  {
    "key": "vegetable-broccoli.webp",
    "name": "브로콜리",
    "answer": "broccoli",
    "category": "food",
    "group": "vegetables"
  },
  {
    "key": "vegetable-mushroom.webp",
    "name": "버섯",
    "answer": "mushroom",
    "category": "food",
    "group": "vegetables"
  },
  {
    "key": "food-fried-egg.webp",
    "name": "달걀프라이",
    "answer": "fried egg",
    "category": "food",
    "group": "meals"
  },
  {
    "key": "food-cheese.webp",
    "name": "치즈",
    "answer": "cheese",
    "category": "food",
    "group": "meals"
  },
  {
    "key": "food-toast.webp",
    "name": "토스트",
    "answer": "toast",
    "category": "food",
    "group": "meals"
  },
  {
    "key": "food-sandwich.webp",
    "name": "샌드위치",
    "answer": "sandwich",
    "category": "food",
    "group": "meals"
  },
  {
    "key": "food-hamburger.webp",
    "name": "햄버거",
    "answer": "hamburger",
    "category": "food",
    "group": "meals"
  },
  {
    "key": "food-hot-dog.webp",
    "name": "핫도그",
    "answer": "hot dog",
    "category": "food",
    "group": "meals"
  },
  {
    "key": "food-pizza.webp",
    "name": "피자",
    "answer": "pizza",
    "category": "food",
    "group": "meals"
  },
  {
    "key": "food-french-fries.webp",
    "name": "감자튀김",
    "answer": "french fries",
    "category": "food",
    "group": "meals"
  },
  {
    "key": "food-gimbap.webp",
    "name": "김밥",
    "answer": "gimbap",
    "category": "food",
    "group": "meals"
  },
  {
    "key": "food-rice-ball.webp",
    "name": "삼각김밥",
    "answer": "rice ball",
    "category": "food",
    "group": "meals"
  },
  {
    "key": "food-sushi.webp",
    "name": "초밥",
    "answer": "sushi",
    "category": "food",
    "group": "meals"
  },
  {
    "key": "food-ramen.webp",
    "name": "라멘",
    "answer": "ramen",
    "category": "food",
    "group": "meals"
  },
  {
    "key": "food-dumpling.webp",
    "name": "만두",
    "answer": "dumpling",
    "category": "food",
    "group": "meals"
  },
  {
    "key": "food-tteokbokki.webp",
    "name": "떡볶이",
    "answer": "tteokbokki",
    "category": "food",
    "group": "meals"
  },
  {
    "key": "food-candy.webp",
    "name": "사탕",
    "answer": "candy",
    "category": "food",
    "group": "treats"
  },
  {
    "key": "food-cotton-candy.webp",
    "name": "솜사탕",
    "answer": "cotton candy",
    "category": "food",
    "group": "treats"
  },
  {
    "key": "food-chocolate.webp",
    "name": "초콜릿",
    "answer": "chocolate",
    "category": "food",
    "group": "treats"
  },
  {
    "key": "food-cookie.webp",
    "name": "쿠키",
    "answer": "cookie",
    "category": "food",
    "group": "treats"
  },
  {
    "key": "food-donut.webp",
    "name": "도넛",
    "answer": "donut",
    "category": "food",
    "group": "treats"
  },
  {
    "key": "food-macaron.webp",
    "name": "마카롱",
    "answer": "macaron",
    "category": "food",
    "group": "treats"
  },
  {
    "key": "food-fish-pastry.webp",
    "name": "붕어빵",
    "answer": "fish pastry",
    "category": "food",
    "group": "treats"
  },
  {
    "key": "food-birthday-cake.webp",
    "name": "생일 케이크",
    "answer": "birthday cake",
    "category": "food",
    "group": "treats"
  },
  {
    "key": "food-ice-cream.webp",
    "name": "아이스크림",
    "answer": "ice cream",
    "category": "food",
    "group": "treats"
  },
  {
    "key": "food-pudding.webp",
    "name": "푸딩",
    "answer": "pudding",
    "category": "food",
    "group": "treats"
  },
  {
    "key": "food-bingsu.webp",
    "name": "빙수",
    "answer": "bingsu",
    "category": "food",
    "group": "treats"
  },
  {
    "key": "food-popcorn.webp",
    "name": "팝콘",
    "answer": "popcorn",
    "category": "food",
    "group": "treats"
  },
  {
    "key": "drink-banana-milk.webp",
    "name": "바나나우유",
    "answer": "banana milk",
    "category": "food",
    "group": "treats"
  },
  {
    "key": "drink-bubble-tea.webp",
    "name": "버블티",
    "answer": "bubble tea",
    "category": "food",
    "group": "treats"
  },
  {
    "key": "theme-tulip.webp",
    "name": "튤립",
    "answer": "tulip",
    "category": "object",
    "group": "plants"
  },
  {
    "key": "theme-rose.webp",
    "name": "장미",
    "answer": "rose",
    "category": "object",
    "group": "plants"
  },
  {
    "key": "theme-cherry-blossom.webp",
    "name": "벚꽃",
    "answer": "cherry blossom",
    "category": "object",
    "group": "plants"
  },
  {
    "key": "theme-sunflower.webp",
    "name": "해바라기",
    "answer": "sunflower",
    "category": "object",
    "group": "plants"
  },
  {
    "key": "theme-clover.webp",
    "name": "클로버",
    "answer": "clover",
    "category": "object",
    "group": "plants"
  },
  {
    "key": "theme-maple-leaf.webp",
    "name": "단풍잎",
    "answer": "maple leaf",
    "category": "object",
    "group": "plants"
  },
  {
    "key": "theme-cactus.webp",
    "name": "선인장",
    "answer": "cactus",
    "category": "object",
    "group": "plants"
  },
  {
    "key": "theme-sun.webp",
    "name": "태양",
    "answer": "sun",
    "category": "object",
    "group": "sky"
  },
  {
    "key": "theme-moon.webp",
    "name": "달",
    "answer": "moon",
    "category": "object",
    "group": "sky"
  },
  {
    "key": "theme-star.webp",
    "name": "별",
    "answer": "star",
    "category": "object",
    "group": "sky"
  },
  {
    "key": "theme-saturn.webp",
    "name": "토성",
    "answer": "saturn",
    "category": "object",
    "group": "sky"
  },
  {
    "key": "theme-cloud.webp",
    "name": "구름",
    "answer": "cloud",
    "category": "object",
    "group": "sky"
  },
  {
    "key": "theme-rainbow.webp",
    "name": "무지개",
    "answer": "rainbow",
    "category": "object",
    "group": "sky"
  },
  {
    "key": "theme-lightning.webp",
    "name": "번개",
    "answer": "lightning",
    "category": "object",
    "group": "sky"
  },
  {
    "key": "theme-snowman.webp",
    "name": "눈사람",
    "answer": "snowman",
    "category": "object",
    "group": "sky"
  },
  {
    "key": "vehicle-train.webp",
    "name": "기차",
    "answer": "train",
    "category": "object",
    "group": "vehicles"
  },
  {
    "key": "vehicle-ambulance.webp",
    "name": "구급차",
    "answer": "ambulance",
    "category": "object",
    "group": "vehicles"
  },
  {
    "key": "vehicle-fire-truck.webp",
    "name": "소방차",
    "answer": "fire truck",
    "category": "object",
    "group": "vehicles"
  },
  {
    "key": "vehicle-boat.webp",
    "name": "배",
    "answer": "boat",
    "category": "object",
    "group": "vehicles"
  },
  {
    "key": "vehicle-submarine.webp",
    "name": "잠수함",
    "answer": "submarine",
    "category": "object",
    "group": "vehicles"
  },
  {
    "key": "theme-paper-airplane.webp",
    "name": "종이비행기",
    "answer": "paper airplane",
    "category": "object",
    "group": "vehicles"
  },
  {
    "key": "vehicle-airplane.webp",
    "name": "비행기",
    "answer": "airplane",
    "category": "object",
    "group": "vehicles"
  },
  {
    "key": "vehicle-helicopter.webp",
    "name": "헬리콥터",
    "answer": "helicopter",
    "category": "object",
    "group": "vehicles"
  },
  {
    "key": "vehicle-hot-air-balloon.webp",
    "name": "열기구",
    "answer": "hot air balloon",
    "category": "object",
    "group": "vehicles"
  },
  {
    "key": "vehicle-airship.webp",
    "name": "비행선",
    "answer": "airship",
    "category": "object",
    "group": "vehicles"
  },
  {
    "key": "vehicle-rocket.webp",
    "name": "로켓",
    "answer": "rocket",
    "category": "object",
    "group": "vehicles"
  },
  {
    "key": "vehicle-ufo.webp",
    "name": "UFO",
    "answer": "ufo",
    "category": "object",
    "group": "vehicles"
  },
  {
    "key": "sport-soccer.webp",
    "name": "축구공",
    "answer": "soccer",
    "category": "object",
    "group": "sports"
  },
  {
    "key": "sport-basketball.webp",
    "name": "농구공",
    "answer": "basketball",
    "category": "object",
    "group": "sports"
  },
  {
    "key": "sport-baseball.webp",
    "name": "야구공",
    "answer": "baseball",
    "category": "object",
    "group": "sports"
  },
  {
    "key": "sport-bowling.webp",
    "name": "볼링",
    "answer": "bowling",
    "category": "object",
    "group": "sports"
  },
  {
    "key": "sport-shuttlecock.webp",
    "name": "셔틀콕",
    "answer": "shuttlecock",
    "category": "object",
    "group": "sports"
  },
  {
    "key": "game-dice.webp",
    "name": "주사위",
    "answer": "dice",
    "category": "object",
    "group": "sports"
  },
  {
    "key": "award-trophy.webp",
    "name": "트로피",
    "answer": "trophy",
    "category": "object",
    "group": "sports"
  },
  {
    "key": "theme-balloons.webp",
    "name": "풍선",
    "answer": "balloons",
    "category": "object",
    "group": "sports"
  },
  {
    "key": "object-pencil.webp",
    "name": "연필",
    "answer": "pencil",
    "category": "object",
    "group": "everyday"
  },
  {
    "key": "object-eraser.webp",
    "name": "지우개",
    "answer": "eraser",
    "category": "object",
    "group": "everyday"
  },
  {
    "key": "object-newspaper.webp",
    "name": "신문",
    "answer": "newspaper",
    "category": "object",
    "group": "everyday"
  },
  {
    "key": "object-lamp.webp",
    "name": "스탠드",
    "answer": "lamp",
    "category": "object",
    "group": "everyday"
  },
  {
    "key": "object-watch.webp",
    "name": "시계",
    "answer": "watch",
    "category": "object",
    "group": "everyday"
  },
  {
    "key": "object-camera.webp",
    "name": "카메라",
    "answer": "camera",
    "category": "object",
    "group": "everyday"
  },
  {
    "key": "object-radio.webp",
    "name": "라디오",
    "answer": "radio",
    "category": "object",
    "group": "everyday"
  },
  {
    "key": "object-television.webp",
    "name": "텔레비전",
    "answer": "television",
    "category": "object",
    "group": "everyday"
  },
  {
    "key": "object-boot.webp",
    "name": "운동화",
    "answer": "boot",
    "category": "object",
    "group": "everyday"
  },
  {
    "key": "object-mitten.webp",
    "name": "장갑",
    "answer": "mitten",
    "category": "object",
    "group": "everyday"
  },
  {
    "key": "object-umbrella.webp",
    "name": "우산",
    "answer": "umbrella",
    "category": "object",
    "group": "everyday"
  },
  {
    "key": "object-key.webp",
    "name": "열쇠",
    "answer": "key",
    "category": "object",
    "group": "everyday"
  },
  {
    "key": "object-lock.webp",
    "name": "자물쇠",
    "answer": "lock",
    "category": "object",
    "group": "everyday"
  },
  {
    "key": "theme-guitar.webp",
    "name": "기타",
    "answer": "guitar",
    "category": "object",
    "group": "everyday"
  },
  {
    "key": "theme-music-note.webp",
    "name": "음표",
    "answer": "music note",
    "category": "object",
    "group": "everyday"
  },
  {
    "key": "object-gift.webp",
    "name": "선물",
    "answer": "gift",
    "category": "object",
    "group": "special"
  },
  {
    "key": "object-sack.webp",
    "name": "복주머니",
    "answer": "sack",
    "category": "object",
    "group": "special"
  },
  {
    "key": "object-treasure-chest.webp",
    "name": "보물상자",
    "answer": "treasure chest",
    "category": "object",
    "group": "special"
  },
  {
    "key": "theme-crown.webp",
    "name": "왕관",
    "answer": "crown",
    "category": "object",
    "group": "special"
  },
  {
    "key": "theme-gem.webp",
    "name": "보석",
    "answer": "gem",
    "category": "object",
    "group": "special"
  },
  {
    "key": "theme-heart.webp",
    "name": "하트",
    "answer": "heart",
    "category": "object",
    "group": "special"
  },
  {
    "key": "theme-robot.webp",
    "name": "로봇",
    "answer": "robot",
    "category": "object",
    "group": "special"
  }
].map(Object.freeze));
const byKey=new Map(items.map((item,index)=>[item.key,{item,index}]));
function get(key){return byKey.get(String(key||'').replace(/\.png$/i,'.webp'))?.item;}
function compareKeys(a,b){const ai=byKey.get(a)?.index??Infinity,bi=byKey.get(b)?.index??Infinity;return ai===bi?String(a).localeCompare(String(b),'en'):ai-bi;}
return Object.freeze({groups,items,get,compareKeys});
});
