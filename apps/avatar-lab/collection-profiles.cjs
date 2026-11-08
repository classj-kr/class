"use strict";

// Reviewed against all 152 originals. Values are authoring landmarks in the
// original 640px artwork: neck, upper leg, solid head depth, anatomy and shape.
// Exceptions keep the source anatomy: no invented humanoid feet on cups/snails.
const rows=`
animal-bear|곰|437|526|.70|walk|hood
animal-bee|꿀벌|426|545|.60|walk|hood
animal-butterfly|나비|437|548|.48|walk|wings
animal-cat|고양이|437|531|.70|walk|custom
animal-chick|병아리|455|548|.64|walk|hood
animal-crab|게|448|538|.58|walk|hood
animal-crested-gecko|크레스티드 게코|431|534|.64|walk|hood
animal-crocodile|악어|418|537|.64|walk|hood
animal-deer|사슴|428|530|.61|walk|hood
animal-dog|강아지|431|534|.69|walk|hood
animal-dolphin|돌고래|430|535|.65|walk|hood
animal-dragon|드래곤|429|536|.62|walk|hood
animal-dragonfly|잠자리|382|477|.42|walk|wings
animal-duck|오리|433|539|.65|walk|hood
animal-eagle|독수리|421|540|.60|walk|hood
animal-elephant|코끼리|428|545|.68|walk|hood
animal-flamingo|플라밍고|424|507|.40|walk|hood
animal-fox|여우|430|535|.64|walk|hood
animal-frog|개구리|433|524|.63|walk|hood
animal-giraffe|기린|374|520|.50|walk|hood
animal-hedgehog|고슴도치|464|548|.68|walk|hood
animal-hippopotamus|하마|435|535|.69|walk|hood
animal-kangaroo|캥거루|402|530|.52|walk|hood
animal-koala|코알라|429|535|.68|walk|hood
animal-ladybug|무당벌레|408|538|.60|walk|wings
animal-leopard-gecko|레오파드 게코|420|535|.63|walk|hood
animal-lion|사자|458|537|.75|walk|hood
animal-llama|양|405|544|.55|walk|hood
animal-meerkat|미어캣|379|501|.63|walk|hood
animal-monkey|원숭이|427|538|.68|walk|hood
animal-mouse|생쥐|453|537|.64|walk|hood
animal-octopus|문어|430|580|.67|crawl|tentacles
animal-ostrich|타조|344|471|.45|walk|hood
animal-owl|부엉이|424|536|.64|walk|hood
animal-panda|판다|432|534|.68|walk|hood
animal-peacock|공작|428|540|.48|walk|fan
animal-penguin|펭귄|433|535|.66|walk|hood
animal-praying-mantis|사마귀|416|533|.54|walk|hood
animal-rabbit|토끼|454|541|.49|walk|hood
animal-ratsnake|구렁이|476|542|.68|walk|hood
animal-rhinoceros|코뿔소|421|499|.57|walk|hood
animal-seal|물개|423|532|.68|walk|hood
animal-shark|상어|445|534|.58|walk|hood
animal-sloth|나무늘보|432|540|.61|walk|hood
animal-snail|달팽이|520|580|.68|crawl|shell
animal-squirrel|다람쥐|412|535|.62|walk|hood
animal-tiger|호랑이|435|538|.69|walk|hood
animal-turtle|거북이|429|534|.67|walk|hood
animal-unicorn|유니콘|436|540|.53|walk|hood
animal-viper|살모사|434|540|.61|walk|hood
animal-whale|고래|431|536|.66|walk|hood
animal-wolf|늑대|420|536|.65|walk|hood
award-trophy|트로피|519|545|.52|walk|trophy
drink-bubble-tea|버블티|580|580|.64|hop|cup
food-bingsu|빙수|580|580|.67|hop|bowl
food-birthday-cake|생일 케이크|580|580|.75|hop|cake
food-candy|사탕|433|539|.63|walk|candy
food-cheese|치즈|410|535|.54|walk|box
food-chocolate|초콜릿|440|541|.34|walk|box
food-cookie|쿠키|438|535|.33|walk|disc
food-donut|도넛|440|526|.38|walk|custom
food-dumpling|만두|440|538|.64|walk|round
food-fish-pastry|붕어빵|430|539|.40|walk|fish
food-fried-egg|달걀프라이|427|537|.56|walk|egg
food-gimbap|김밥|445|537|.68|walk|roll
food-hamburger|햄버거|434|537|.77|walk|burger
food-hot-dog|핫도그|538|548|.44|walk|long
food-ice-cream|아이스크림|580|580|.62|hop|cone
food-macaron|마카롱|441|537|.58|walk|macaron
food-pizza|피자|527|547|.23|walk|slice
food-popcorn|팝콘|442|537|.55|walk|bucket
food-pudding|푸딩|440|537|.68|walk|pudding
food-ramen|라멘|464|531|1.3|walk|custom
food-rice-ball|삼각김밥|425|538|.53|walk|round
food-sandwich|샌드위치|529|549|.38|walk|box
food-sushi|초밥|420|535|.65|walk|sushi
food-toast|토스트|440|537|.30|walk|box
food-tteokbokki|떡볶이|580|580|1.20|hop|bowl
fruit-apple|사과|432|537|.70|walk|fruit
fruit-avocado|아보카도|545|553|.55|walk|fruit
fruit-banana|바나나|403|536|.43|walk|custom
fruit-blueberry|블루베리|432|536|.68|walk|fruit
fruit-cherry|체리|580|580|.68|hop|fruit
fruit-grape|포도|427|537|.64|walk|grape
fruit-mango|망고|541|549|.62|walk|fruit
fruit-melon|멜론|425|537|.64|walk|fruit
fruit-orange|오렌지|433|536|.67|walk|fruit
fruit-peach|복숭아|440|539|.64|walk|fruit
fruit-persimmon|감|435|538|.73|walk|fruit
fruit-pineapple|파인애플|451|539|.47|walk|fruit
fruit-strawberry|딸기|479|540|.59|walk|fruit
fruit-watermelon|수박|437|537|.27|walk|slice
game-dice|주사위|442|540|.62|walk|box
object-boot|운동화|471|538|.59|walk|boot
object-camera|카메라|448|540|.49|walk|box
object-eraser|지우개|446|501|.37|walk|box
object-gift|선물|450|527|.55|walk|box
object-key|열쇠|580|580|.18|hop|flat
object-lamp|스탠드|413|537|.61|walk|lamp
object-lock|자물쇠|444|536|.42|walk|box
object-mitten|장갑|510|546|.34|walk|round
object-newspaper|신문|441|538|.16|walk|flat
object-pencil|연필|527|548|.36|walk|long
object-radio|라디오|430|519|.43|walk|box
object-sack|복주머니|447|531|.64|walk|round
object-television|텔레비전|434|514|.52|walk|box
object-umbrella|우산|425|538|.49|walk|custom
object-watch|시계|580|580|.28|hop|flat
sport-baseball|야구공|446|537|.75|walk|ball
sport-basketball|농구공|443|536|.73|walk|ball
sport-bowling|볼링|580|580|.47|hop|bowling
sport-soccer|축구공|440|537|.75|walk|ball
theme-balloons|풍선|454|548|.64|walk|balloons
theme-cactus|선인장|540|548|.50|walk|cactus
theme-cherry-blossom|벚꽃|457|539|.25|walk|flower
theme-cloud|구름|432|537|.55|walk|cloud
theme-clover|클로버|490|542|.22|walk|flower
theme-crown|왕관|443|536|.61|walk|crown
theme-guitar|기타|528|547|.25|walk|guitar
theme-lightning|번개|510|542|.18|walk|flat
theme-maple-leaf|단풍잎|445|537|.18|walk|flower
theme-moon|달|437|537|.29|walk|flat
theme-music-note|음표|437|537|.35|walk|flat
theme-paper-airplane|종이비행기|436|508|.16|walk|paper
theme-rainbow|무지개|420|537|.28|walk|rainbow
theme-rose|장미|443|538|.65|walk|flower
theme-snowman|눈사람|409|580|.64|hop|snowman
theme-star|별|447|538|.38|walk|flower
theme-sun|태양|432|537|.43|walk|flower
theme-sunflower|해바라기|452|538|.32|walk|flower
theme-tulip|튤립|454|539|.50|walk|flower
vegetable-bell-pepper|피망|437|537|.63|walk|fruit
vegetable-broccoli|브로콜리|403|535|.65|walk|cloud
vegetable-carrot|당근|536|548|.43|walk|long
vegetable-corn|옥수수|536|550|.49|walk|corn
vegetable-eggplant|가지|534|548|.50|walk|fruit
vegetable-mushroom|버섯|430|537|.66|walk|mushroom
vegetable-potato|감자|544|551|.63|walk|fruit
vegetable-pumpkin|호박|432|537|.67|walk|fruit
vegetable-radish|무|536|549|.44|walk|long
vegetable-sweet-potato|고구마|537|548|.48|walk|fruit
vegetable-tomato|토마토|435|537|.66|walk|fruit
vehicle-airplane|비행기|409|491|.56|walk|airplane
vehicle-airship|비행선|449|478|.70|walk|airship
vehicle-ambulance|구급차|471|515|.62|walk|box
vehicle-boat|배|580|580|.75|glide|boat
vehicle-fire-truck|소방차|427|518|.53|walk|box
vehicle-helicopter|헬리콥터|422|520|.66|walk|custom
vehicle-hot-air-balloon|열기구|580|580|.71|float|balloon
vehicle-rocket|로켓|580|580|.63|float|rocket
vehicle-submarine|잠수함|527|545|.70|walk|submarine
vehicle-train|기차|580|580|.66|roll|train
`.trim().split("\n");

const profiles=Object.fromEntries(rows.map(row=>{
  const [id,name,neck,leg,depth,motion,shape]=row.split("|");
  return[id,{id,name,neck:+neck,leg:+leg,depth:+depth,motion,shape,cx:320,armHalf:65,holdArms:false,revision:1}];
}));
function set(id,values){Object.assign(profiles[id],values);}
const held=["animal-frog","animal-hedgehog","animal-meerkat","animal-monkey","animal-mouse","animal-owl","animal-sloth","food-fish-pastry","food-pizza","fruit-avocado","fruit-grape","fruit-mango","fruit-pineapple","object-boot","object-pencil","theme-cactus","theme-clover","theme-guitar","theme-lightning","theme-paper-airplane","vegetable-carrot","vegetable-corn","vegetable-eggplant","vegetable-potato","vegetable-radish","vegetable-sweet-potato","vehicle-airplane","vehicle-airship","vehicle-ambulance","vehicle-submarine"];
for(const id of held)set(id,{holdArms:true});
set('object-mitten',{cx:350,armHalf:40,holdArms:true});
set('theme-balloons',{holdArms:true});
for(const [id,x,y] of [
  ["animal-crested-gecko",403,412],["animal-crocodile",411,409],["animal-dog",438,395],["animal-dolphin",415,414],
  ["animal-dragon",414,427],["animal-fox",205,430],["animal-giraffe",399,460],["animal-kangaroo",395,390],
  ["animal-leopard-gecko",414,350],["animal-lion",419,453],["animal-meerkat",410,463],["animal-monkey",421,330],
  ["animal-seal",420,468],["animal-squirrel",402,251],["animal-tiger",420,451],["animal-unicorn",405,442],
  ["animal-viper",420,412],["animal-wolf",421,390]
])set(id,{tail:{x,y,side:id==="animal-fox"?"left":"right"}});
set("animal-elephant",{cx:310,armHalf:62,holdArms:true});
set('animal-squirrel',{cx:262,neck:418,leg:537,armHalf:69});
set('animal-panda',{neck:400,leg:534});
set("animal-giraffe",{armHalf:45});set("animal-kangaroo",{cx:287,armHalf:51,holdArms:true});
set("animal-ostrich",{cx:290,armHalf:45,holdArms:true});set("animal-flamingo",{armHalf:42,holdArms:true});
set("animal-rabbit",{armHalf:48});set("animal-unicorn",{armHalf:51});
set("animal-butterfly",{wingEllipse:[320,300,144,148],wingTop:180,armHalf:45,holdArms:true});
set("animal-dragonfly",{wingEllipse:[320,307,103,107],wingTop:260,armHalf:33,holdArms:true});
set("animal-ladybug",{wingEllipse:[320,284,160,145],wingTop:360,armHalf:48,holdArms:true});
set("animal-peacock",{wingEllipse:[320,316,121,130],wingTop:60,armHalf:43,holdArms:true});
for(const id of ["animal-tiger","animal-wolf"])set(id,{pattern:"stripes"});
set('animal-crested-gecko',{pattern:'crested',headColor:'#a26738',bodyColor:'#664128'});
set('animal-leopard-gecko',{pattern:'leopard'});
set('animal-giraffe',{pattern:'giraffe'});
set("animal-turtle",{pattern:"shell"});set("animal-bee",{pattern:"bee",holdArms:true});
set("food-fish-pastry",{pattern:"scales"});set("fruit-melon",{pattern:"melon"});
set("fruit-strawberry",{pattern:"seeds"});set("fruit-orange",{pattern:"pores"});
set("fruit-pineapple",{pattern:"pineapple"});set("vegetable-corn",{pattern:"corn"});
set("sport-baseball",{pattern:"baseball"});set("sport-basketball",{pattern:"basketball"});
set("sport-soccer",{pattern:"soccer"});set("game-dice",{pattern:"dice"});
set("food-cookie",{pattern:"chips"});set("food-chocolate",{pattern:"chocolate"});
set("vegetable-pumpkin",{pattern:"pumpkin"});set("fruit-grape",{pattern:"grape"});
set("food-candy",{wrapper:true});
const headColors={
 "animal-bear":"#aa733f","animal-bee":"#e5b63b","animal-butterfly":"#ad72b2","animal-chick":"#ffe69a","animal-crab":"#c6483b","animal-crested-gecko":"#bb7b43","animal-crocodile":"#80a64a","animal-deer":"#b77b4c","animal-dog":"#e7b961","animal-dolphin":"#8da7b4","animal-dragon":"#679349","animal-dragonfly":"#70abb5","animal-duck":"#f4d35e","animal-eagle":"#eeeae0","animal-elephant":"#a7a392","animal-flamingo":"#ee9caf","animal-fox":"#d47839","animal-frog":"#87b64e","animal-giraffe":"#e5bc76","animal-hedgehog":"#9a877d","animal-hippopotamus":"#aaa4b4","animal-kangaroo":"#b87946","animal-koala":"#a2a6b3","animal-ladybug":"#bd4651","animal-leopard-gecko":"#dfb666","animal-lion":"#b97c35","animal-llama":"#eee0bf","animal-meerkat":"#c6a473","animal-monkey":"#ad7e43","animal-mouse":"#6fa6b8","animal-octopus":"#b277ab","animal-ostrich":"#efb6ac","animal-owl":"#9a7449","animal-panda":"#efefdf","animal-peacock":"#387aa4","animal-penguin":"#394448","animal-praying-mantis":"#9bbd60","animal-rabbit":"#efb8c8","animal-ratsnake":"#86ae50","animal-rhinoceros":"#9e9da7","animal-seal":"#9fa9b8","animal-shark":"#6999b8","animal-sloth":"#bc9d7d","animal-snail":"#d5a67c","animal-squirrel":"#b58149","animal-tiger":"#e8ae4b","animal-turtle":"#83ba42","animal-unicorn":"#eeeae0","animal-viper":"#8bad5c","animal-whale":"#5ba7c9","animal-wolf":"#96999d",
 "fruit-avocado":"#88a641","fruit-watermelon":"#85ad4b","fruit-grape":"#9655a5","food-pizza":"#dfac62","food-cookie":"#d6a05b","food-chocolate":"#8b4f30","theme-cherry-blossom":"#ec9db7","theme-clover":"#72a148","theme-maple-leaf":"#e7a033","theme-sunflower":"#e9ba3b","vegetable-corn":"#ecc454"
};
for(const [id,headColor] of Object.entries(headColors))set(id,{headColor});
for(const [id,bodyColor] of Object.entries({"animal-bear":"#a87540","animal-panda":"#383c35","animal-eagle":"#78553c","animal-butterfly":"#b96aaa","animal-crocodile":"#709941","animal-monkey":"#b17c3f","animal-owl":"#96754e","animal-peacock":"#357c9b","animal-koala":"#9ea5b4","animal-lion":"#e1b04c","theme-rose":"#779a3a","theme-sunflower":"#72964b","theme-tulip":"#e7b94b"}))set(id,{bodyColor});
for(const [id,bodyColor] of Object.entries({'animal-bee':'#d6ac3a','animal-ladybug':'#725449','animal-dragonfly':'#70abb5','animal-leopard-gecko':'#dfb666','animal-squirrel':'#b58149','animal-hedgehog':'#be9b89'}))set(id,{bodyColor});
for(const [id,featureTop] of Object.entries({'animal-bee':185,'animal-butterfly':185,'animal-deer':178,'animal-giraffe':155,'animal-ladybug':153,'animal-panda':166,'animal-praying-mantis':148,'fruit-apple':158,'fruit-mango':155,'fruit-melon':134,'fruit-orange':126,'fruit-persimmon':176,'fruit-pineapple':258,'fruit-strawberry':171,'vegetable-bell-pepper':154,'vegetable-carrot':233,'vegetable-eggplant':181,'vegetable-radish':235,'vegetable-tomato':143}))set(id,{featureTop});
// Material regions follow the fruit/root and foliage separately. Dominant
// color sampling can otherwise turn a white radish into a green solid.
for(const [id,headColor] of Object.entries({
 'fruit-apple':'#d34d3e','fruit-blueberry':'#7777a5','fruit-cherry':'#cc4a4b',
 'fruit-mango':'#e9b854','fruit-melon':'#bfd68b','fruit-orange':'#e99a3f',
 'fruit-peach':'#e8a59a','fruit-persimmon':'#e4a14e','fruit-pineapple':'#d7ad54','fruit-strawberry':'#d05b54',
 'vegetable-bell-pepper':'#86a653','vegetable-broccoli':'#6b9854','vegetable-carrot':'#e4a05c',
 'vegetable-eggplant':'#876094','vegetable-potato':'#c3a47c','vegetable-pumpkin':'#dd994e',
 'vegetable-radish':'#eee9d8','vegetable-sweet-potato':'#a7697c','vegetable-tomato':'#ce695a'
}))set(id,{headColor});
for(const id of ['animal-viper','animal-ratsnake']){
 set(id,{motion:'glide',shape:'snake',neck:580,leg:580,holdArms:true,revision:2});
 delete profiles[id].tail;
}
module.exports=profiles;
