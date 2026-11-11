"use strict";
// Additional originals, authored independently of the accepted 152-model set.
const rows=[
 ['animal-caterpillar','애벌레','crawl'],['animal-cow','소','walk'],
 ['animal-jellyfish','해파리','float'],['animal-rhinoceros-beetle','장수풍뎅이','walk'],
 ['animal-stag-beetle','사슴벌레','walk'],['animal-stingray','가오리','walk'],
 ['animal-triceratops','트리케라톱스','walk'],['drink-banana-milk','바나나우유','hop'],
 ['food-cotton-candy','솜사탕','walk'],['food-french-fries','감자튀김','walk'],
 ['object-treasure-chest','보물상자','hop'],['sport-shuttlecock','셔틀콕','walk'],
 ['theme-gem','보석','walk'],['theme-heart','하트','walk'],['theme-robot','로봇','walk'],
 ['theme-saturn','토성','float'],['vehicle-ufo','UFO','float']
];
module.exports=Object.fromEntries(rows.map(([id,name,motion])=>[id,{id,name,motion,shape:'authored-addition',neck:450,leg:535,depth:.65,cx:320,revision:1,holdArms:true}]));
