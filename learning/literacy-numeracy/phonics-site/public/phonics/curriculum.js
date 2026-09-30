(() => {
  const unitSpecs = [
    ["alphabet", "1. 알파벳과 짧은 모음", "1–34 · 글자와 소리, CVC 읽기", "violet", `
a /ă/|a|ant,apple,ax,map,mat,man,cat,cap
m /m/|m|map,mat,man,ham,ram,mop,mom,jam
s /s/|s|sun,sit,sock,sat,cats,maps,cups,kiss
t /t/|t|tap,ten,top,ant,mat,sit,hat,cat
VC/CVC 합성|a,m,s,t|am,at,mat,sat
p /p/|p|pan,pig,pop,pin,nap,cup,cap,rip
f /f/|f|fan,fin,fun,fox,fish,frog,leaf,roof
i /ĭ/|i|in,pin,sit,pig,fin,did,fish,milk
n /n/: 처음과 끝|n|nap,in,pin,fan,man,pan,fin,tin
CVC 연습: a, i|a,i|sat,pin,mat,pig,tap,sit,fin,pan
비음화 a: an, am|an,am|fan,ham,ram,man,pan,jam,clam,hand
o /ŏ/: 처음과 가운데|o|on,not,top,pot,mop,mom,hot,pop
d /d/: 처음과 끝|d|dad,did,dim,dip,dot,nod,sad,mad
c /k/|c|cat,cap,cot,cup,cats,rock,lock,clock
u /ŭ/|u|up,sun,cup,gum,bus,run,rug,luck
g /g/|g|gum,gap,dog,pig,rug,leg,log,frog
b /b/|b|bat,bed,bus,web,box,black,ball,bug
e /ĕ/|e|ten,bed,hen,red,leg,web,jet,vet
짧은 모음 전체 복습|a,e,i,o,u|cat,hen,pig,dog,sun,bed,fox,cup
-s /s/|s|cats,maps,cups,hats,rocks,books,roofs,clocks
s /z/|s|dogs,pigs,beds,webs,bells,hands,rams,moms
k /k/|k|kid,kit,kiss,milk,rock,lock,luck,skin
h /h/|h|hat,hen,hot,ham,hand,hill,house,horse
r /r/ 1|r|rat,red,run,ram,rip,rock,rug,roof
r /r/ 2|r|rip,rock,rug,ram,frog,roof,red,drum
l /l/ 1|l|leg,lip,log,leaf,milk,lock,clock,ball
l /l/ 2 · al|al,l|lamp,lock,luck,apple,leaf,milk,plum,pal
w /w/: 처음과 자음군|w|web,win,wag,swim,twin,swam,swell,twig
j /j/|j|jam,jet,jog,jump,jar,jeep,jelly,jacket
y /y/|y|yam,yes,yet,yak,yoyo,yarn,yogurt,yellow
x /ks/|x|box,fox,six,ax,ox,wax,mix,fix
qu /kw/|qu|quiz,quit,quack,queen,quilt,quill,squid,square
v /v/|v|van,vet,vivid,vase,vest,five,oven,seven
z /z/|z|zip,zap,zigzag,zoo,zebra,zero,maze,quiz`],
    ["review", "2. 짧은 모음과 긴 단어", "35–41 · 복습, 자음군, 긴 단어", "coral", `
짧은 a 복습|a|cat,hand,stamp,black,rat,mat,cap,bat
짧은 i 복습|i,n|fish,milk,skin,spin,pig,sit,pin,fin
짧은 o 복습|o|frog,pond,stop,clock,dog,hot,rock,log
a·i·o 섞어 읽기|a,i,o|black,spin,clock,cat,pig,dog,stamp,fish
짧은 u 복습|u|drum,plum,jump,sun,fun,cup,gum,rug
짧은 e 복습|e|step,desk,blend,bed,hen,red,leg,web
짧은 모음 전체 복습|a,e,i,o,u|cat,fish,frog,drum,step,black,spin,clock`],
    ["digraphs", "3. 두 글자 한 소리", "42–53 · sh, th, ch, wh, ph, ng, nk", "blue", `
FLSZ 끝 글자 겹치기|ff,ll,ss,zz|cliff,bell,mess,hill,ball,kiss,buzz,puff
-all, -oll, -ull|all,oll,ull|ball,doll,bull,tall,roll,full,wall,fall
ck /k/|ck|duck,sock,rock,back,check,lock,clock,jacket
sh /sh/|sh|fish,ship,shop,shell,dish,wish,brush,shut
유성 th /ð/|th|this,that,then,them,mother,father,brother,feather
무성 th /θ/|th|thin,bath,moth,thumb,three,thick,teeth,path
ch /ch/|ch|chin,chip,lunch,bench,chick,much,rich,chop
wh /w/|wh|what,when,where,which,why,whale,wheel,whistle
ph /f/|ph|phone,photo,graph,dolphin,elephant,trophy,alphabet,sphere
ng /ŋ/|ng|ring,king,song,wing,hang,long,sing,bang
nk /ŋk/|nk|pink,sink,bank,ink,trunk,drink,wink,tank
이중자 전체 복습|ck,sh,th,ch,wh,ph,ng,nk|check,ship,thin,chin,whale,phone,ring,pink`],
    ["vce", "4. 매직 e와 부드러운 c·g", "54–62 · VCe, c /s/, g /j/", "gold", `
a_e /ā/|a_e|cake,game,lake,gate,cape,wave,maze,vase
i_e /ī/|i_e|bike,kite,five,nine,time,line,dive,smile
o_e /ō/|o_e|home,nose,rose,bone,cone,rope,note,stone
VCe 복습 1 · e_e /ē/|e_e,a_e,i_e,o_e|these,theme,complete,cake,bike,home,stone,rose
u_e /ū, yū/|u_e|cube,tube,mule,cute,flute,tune,huge,dune
VCe 전체 복습|a_e,i_e,o_e,u_e|brave,smile,stone,cake,bike,home,cube,flute
ce /s/|ce|race,ice,space,face,mice,place,nice,fence
g /j/: e, i, y 앞|g|cage,huge,stage,page,giant,giraffe,orange,large
VCe 예외와 복습|vce|have,give,come,love,done,none,some,live`],
    ["syllables", "5. 긴 단어 읽기", "63–68 · 어미, 음절, 합성어", "green", `
-es|es|wishes,boxes,dishes,buses,foxes,roses,classes,brushes
-ed|ed|jumped,filled,wanted,helped,played,painted,kicked,landed
-ing|ing|jumping,resting,helping,running,singing,reading,painting,sleeping
음절 나누기|syllable|sunset,rabbit,napkin,picnic,kitten,magnet,basket,insect
합성어와 닫힌 두 음절|compound,closed|sunset,catfish,backpack,bathtub,rabbit,napkin,picnic,kitten
열린 음절과 닫힌 음절|open,closed,n|no,robot,tulip,music,pilot,tiger,lemon,hotel`],
    ["endings", "6. 단어 끝 철자", "69–76 · tch, dge, y, -le", "pink", `
tch /ch/|tch|catch,watch,match,patch,witch,hutch,fetch,stitch
dge /j/|dge|badge,bridge,edge,fudge,judge,hedge,wedge,fridge
tch·dge 복습|tch,dge|patch,fudge,edge,catch,badge,witch,bridge,watch
긴 모음 VCC|ild,old,ind,olt,ost|child,cold,find,wild,colt,gold,kind,most
y /ī/|y|my,fly,cry,sky,try,shy,dry,why
y /ē/|y|happy,sunny,baby,puppy,funny,city,candy,body
-le 음절|le|table,little,puzzle,candle,apple,bottle,turtle,castle
단어 끝 규칙 복습|tch,dge,y,le,ild|candle,puppy,witch,table,badge,child,happy,puzzle`],
    ["rcontrolled", "7. R이 바꾸는 모음", "77–83 · ar, or, er, ir, ur", "violet", `
ar /ar/|ar|car,farm,star,park,arm,jar,card,shark
or·ore /or/|ore,or|fork,corn,shore,horse,storm,porch,snore,chore
ar·or·ore 복습|ar,ore,or|park,shark,storm,short,shore,star,corn,farm
er /er/|er|fern,herd,term,germ,clerk,perch,serve,verb
ir·ur /er/|ir,ur|bird,girl,turn,shirt,skirt,turtle,nurse,purse
/er/ 철자 선택|er,ir,ur,or|fern,clerk,bird,shirt,turn,nurse,worm,world
R 통제 모음 복습|ar,or,er,ir,ur|farm,storm,bird,shark,shore,fern,shirt,turn`],
    ["longteams", "8. 긴 모음 조합", "84–88 · ai, ee, oa, igh", "coral", `
ai·ay /ā/|ai,ay|rain,train,play,snail,mail,gray,day,tray
ee·ea·ey /ē/|ee,ea,ey|tree,feet,key,green,leaf,beach,monkey,honey
oa·ow·oe /ō/|oa,ow,oe|boat,snow,toe,coach,road,goat,window,hoe
ie·igh /ī/|ie,igh|pie,night,light,bright,tie,high,right,sigh
긴 모음 조합 복습|ai,ee,ea,oa,igh|snail,green,coach,bright,train,beach,boat,night`],
    ["vowelteams", "9. 다른 모음 조합", "89–98 · oo, aw, oi, ow, 묵음", "blue", `
u·oo /ʊ/|u,oo|put,bull,full,book,foot,cook,wood,good
oo /ū/|oo|moon,food,noodle,spoon,room,boot,pool,zoo
ew·ui·ue /ū/|ew,ui,ue|chew,fruit,blue,screw,suit,glue,juice,clue
모음 조합 복습 2|oo,ew,ui,ue|book,moon,chew,fruit,blue,screw,suit,food
au·aw·augh /aw/|augh,au,aw|haul,saw,caught,yawn,paw,sauce,daughter,straw
ea /ĕ/ · a /ŏ/|ea,a|head,bread,dead,feather,wash,want,swan,watch
oi·oy /oi/|oi,oy|coin,boy,toy,point,oil,soil,joy,annoy
ou·ow /ow/|ou,ow|out,cow,brown,cloud,house,mouse,down,owl
모음 조합·이중모음 복습|oi,oy,ou,ow|point,joy,cloud,brown,coin,toy,out,cow
묵음 kn /n/ · wr /r/ · -mb /m/|kn,wr,mb|knee,write,thumb,knife,wrist,lamb,comb,knock`],
    ["affixes", "10. 접두사와 접미사", "99–106 · -s, -er, un-, re-, dis-", "green", `
접미사 -s·-es|es,s|cats,boxes,wishes,dogs,foxes,roses,maps,cups
-er·-est|est,er|faster,fastest,smaller,bigger,biggest,hotter,tallest,shortest
-ly|ly|slowly,quickly,kindly,softly,loudly,quietly,happily,sadly
-less·-ful|less,ful|helpful,careless,hopeful,fearless,useful,useless,colorful,harmless
접두사 un-|un|unfair,unlock,unsafe,unhappy,untie,unwrap,unplug,uncover
접두사 pre-·re-|pre,re|preview,preheat,preschool,prepay,redo,replay,restart,rebuild
접두사 dis-|dis|dislike,disconnect,dishonest,disagree,disappear,disobey,discolor,disorder
접사 복습|un,pre,dis,re|unhappy,unlock,preview,preheat,replay,restart,dislike,disagree`],
    ["changes", "11. 접미사 철자 변화", "107–110 · 겹치기, e·y 변화", "gold", `
자음 겹치기: -ed·-ing|ed,ing|planned,clapped,skipped,dragged,running,swimming,hopping,stopping
자음 겹치기: -er·-est|est,er|bigger,biggest,hotter,faster,fastest,smaller,tallest,shortest
끝 e 빼기|drop-e|making,riding,hoped,baking,smiling,closing,using,waved
y를 i로 바꾸기|y-to-i|cried,happier,happiest,tried,carried,dried,easier,busiest`],
    ["rare", "12. 드문 철자와 묵음", "111–118 · ough, c·g, gn·gh·silent t", "pink", `
ar·or /er/|ar,or|dollar,doctor,collar,actor,sailor,mirror,sugar,calendar
air·are·ear /air/|air,are,ear|chair,care,bear,hair,pair,fair,square,pear
ear /ear/|ear|hear,near,year,ear,dear,clear,gear,tear
긴 a의 드문 철자|eigh,aigh,ei,ey,ea|vein,eight,they,sleigh,reindeer,grey,steak,straight
긴 u의 드문 철자|ew,eu,ue,ou|few,feud,rescue,soup,neutral,fuel,statue,group
ough /aw, ō/|ough|bought,thought,dough,brought,fought,sought,doughnut,though
신호 모음: c /s/ · g /j/|c,g|city,germ,giant,center,cell,giraffe,gym,gem
ch /sh, k/ · gn /n/ · gh /g/ · 묵음 t|ch,gn,gh,t|chef,school,gnome,listen,chorus,character,sign,ghost`],
    ["morphology", "13. 확장 접사", "119–128 · -tion, -ture, -ness, bi-", "violet", `
-sion·-tion|sion,tion|vision,action,station,mission,nation,vacation,mansion,lotion
-ture|ture|picture,nature,future,adventure,creature,furniture,capture,mixture
-er·-or·-ist|er,or,ist|teacher,actor,artist,farmer,singer,sailor,dentist,scientist
-ish|ish|childish,greenish,selfish,foolish,pinkish,ticklish,sheepish,feverish
-y|y|rainy,salty,windy,sunny,cloudy,snowy,messy,sleepy
-ness|ness|kindness,darkness,sadness,happiness,softness,brightness,sickness,weakness
-ment|ment|payment,movement,enjoyment,excitement,agreement,improvement,amazement,treatment
-able·-ible|able,ible|readable,visible,possible,washable,edible,flexible,breakable,comfortable
bi-·tri-·uni-|bi,tri,uni|bicycle,triangle,unicorn,binoculars,tricycle,uniform,bilingual,tripod
확장 접사 복습|suffix,prefix|careless,preview,kindness,readable,bicycle,rainy,payment,teacher`]
  ];

  const parseRows = (text) => text.trim().split("\n").map((line) => {
    const [title, focusText, wordText] = line.trim().split("|");
    return { title, focus: focusText.split(","), words: wordText.split(",") };
  });

  const atlases = [
    ["assets/images/phonics-reviewed-scenes-v3.webp", "full,pop,dim,chin,snore,tallest,useless,neutral,disagree,weakness,yes,chore", 3, 4],
    ["assets/images/alphabet-late-atlas.webp", "lip,hill,house,jar,jeep,jelly,jacket,yak,yoyo,yarn,yogurt,yellow,wax,mix,fix,queen,quilt,quill,squid,square,vase,vest,five,oven,seven,zoo,zebra,zero,pizza,maze", 6, 5],
    ["assets/images/lesson-w-h-atlas.webp", "water,wall,wolf,worm,well,horse", 3, 2],
    ["assets/images/lesson-w-position-atlas.webp", "swim,twin,swam,swell,twig,wave", 3, 2],
    ["assets/images/lesson-42-flsz-atlas.webp", "cliff,bell,mess,buzz,puff,dress", 3, 2],
    ["assets/images/lesson-43-all-atlas.webp", "doll,bull,tall,roll,full,duck", 3, 2],
    ["assets/images/lesson-27-43-corrections-atlas.webp", "pal,fall", 2, 1],
    ["assets/images/lesson-44-45-atlas.webp", "back,neck,check,shell,ship,shop", 3, 2],
    ["assets/images/lesson-45-sh-atlas.webp", "dish,wish,brush,shut,shark,shoe", 3, 2],
    ["assets/images/lesson-46-th-atlas.webp", "this,that,then,them,mother,father", 3, 2],
    ["assets/images/lesson-47-th-atlas.webp", "brother,feather,thin,bath,moth,thumb", 3, 2],
    ["assets/images/lesson-47-48-atlas.webp", "three,thick,teeth,path,chin,chip", 3, 2],
    ["assets/images/lesson-48-ch-atlas.webp", "lunch,bench,chick,much,rich,chop", 3, 2],
    ["assets/images/lesson-49-wh-atlas.webp", "what,when,where,which,why,whale,wheel,whistle", 4, 2],
    ["assets/images/lesson-50-wh-ph-atlas.webp", "whip,phone,graph,whale,photo,dolphin", 3, 2],
    ["assets/images/lesson-50-ph-extra-atlas.webp", "elephant,trophy,alphabet,orphan,nephew,sphere", 3, 2],
    ["assets/images/lesson-51-ng-atlas.webp", "ring,king,song,wing,hang,long", 3, 2],
    ["assets/images/lesson-51-ng-extra-atlas.webp", "sing,bang,thing,string,swing,spring", 3, 2],
    ["assets/images/lesson-52-nk-atlas.webp", "pink,sink,bank,ink,trunk,drink", 3, 2],
    ["assets/images/lesson-52-nk-extra-atlas.webp", "wink,tank,junk,blink,think,honk", 3, 2],
    ["assets/images/lesson-54-vce-a-atlas.webp", "cake,game,lake,gate,cape,wave", 3, 2],
    ["assets/images/lesson-55-vce-i-atlas.webp", "bike,kite,nine,time,line,dive", 3, 2],
    ["assets/images/lesson-56-vce-o-atlas.webp", "smile,home,nose,rose,bone,cone", 3, 2],
    ["assets/images/lesson-57-vce-review-atlas.webp", "rope,note,stone,these,theme,complete", 3, 2],
    ["assets/images/lesson-58-vce-u-atlas.webp", "cube,tube,mule,cute,flute,tune", 3, 2],
    ["assets/images/lesson-60-ce-atlas.webp", "race,ice,space,face,mice,place", 3, 2],
    ["assets/images/lesson-60-ce-extra-atlas.webp", "nice,fence,dance,prince,slice,once", 3, 2],
    ["assets/images/lesson-61-ge-atlas.webp", "cage,huge,stage,page,giant,giraffe", 3, 2],
    ["assets/images/lesson-62-vce-exception-a-atlas.webp", "orange,large,have,give,come,love", 3, 2],
    ["assets/images/lesson-62-vce-exception-b-atlas.webp", "done,none,some,live,brave,dune", 3, 2],
    ["assets/images/lesson-63-es-atlas.webp", "wishes,boxes,dishes,buses,foxes,roses,classes,brushes", 4, 2],
    ["assets/images/lesson-64-ed-atlas.webp", "jumped,filled,wanted,helped,played,painted,kicked,landed", 4, 2],
    ["assets/images/lesson-65-ing-atlas.webp", "jumping,resting,helping,running,singing,reading,painting,sleeping", 4, 2],
    ["assets/images/lesson-66-syllable-atlas.webp", "sunset,rabbit,napkin,picnic,kitten,magnet,basket,insect", 4, 2],
    ["assets/images/lesson-67-compound-atlas.webp", "sunset,rabbit,catfish,backpack,bathtub,hotdog,football,cupcake", 4, 2],
    ["assets/images/lesson-68-open-closed-atlas.webp", "no,robot,tulip,music,pilot,tiger,lemon,hotel", 4, 2],
    ["assets/images/lesson-69-tch-atlas.webp", "catch,watch,match,patch,witch,hutch,fetch,stitch", 4, 2],
    ["assets/images/lesson-70-dge-atlas.webp", "badge,bridge,edge,fudge,judge,hedge,wedge,fridge", 4, 2],
    ["assets/images/lesson-72-vcc-atlas.webp", "child,cold,find,wild,old,gold,kind,most", 4, 2],
    ["assets/images/lesson-73-y-long-i-atlas.webp", "my,fly,cry,sky,try,shy,dry,why", 4, 2],
    ["assets/images/lesson-74-y-long-e-atlas.webp", "happy,sunny,baby,puppy,funny,city,candy,body", 4, 2],
    ["assets/images/lesson-75-le-atlas.webp", "table,little,puzzle,candle,apple,bottle,turtle,castle", 4, 2],
    ["assets/images/lesson-77-ar-atlas.webp", "car,farm,star,park,arm,jar,card,shark", 4, 2],
    ["assets/images/lesson-78-or-atlas.webp", "fork,corn,shore,horse,storm,porch,short,north", 4, 2],
    ["assets/images/lesson-80-er-atlas.webp", "fern,herd,term,germ,clerk,perch,serve,verb", 4, 2],
    ["assets/images/lesson-81-ir-ur-atlas.webp", "bird,girl,turn,shirt,skirt,first,nurse,purse", 4, 2],
    ["assets/images/lesson-84-ai-ay-atlas.webp", "rain,train,play,snail,mail,chain,day,tray", 4, 2],
    ["assets/images/lesson-85-ee-ea-ey-atlas.webp", "tree,feet,key,green,leaf,beach,monkey,honey", 4, 2],
    ["assets/images/lesson-86-oa-ow-oe-atlas.webp", "boat,snow,toe,coach,road,goat,window,hoe", 4, 2],
    ["assets/images/lesson-87-ie-igh-atlas.webp", "pie,night,light,bright,tie,high,right,sigh", 4, 2],
    ["assets/images/lesson-89-short-oo-atlas.webp", "put,book,foot,cook,look,wood,good,hook", 4, 2],
    ["assets/images/lesson-90-long-oo-atlas.webp", "moon,food,noodle,spoon,room,boot,pool,zoo", 4, 2],
    ["assets/images/lesson-91-ew-ui-ue-atlas.webp", "chew,fruit,blue,screw,suit,glue,juice,clue", 4, 2],
    ["assets/images/lesson-93-aw-atlas.webp", "haul,saw,caught,yawn,paw,sauce,daughter,straw", 4, 2],
    ["assets/images/lesson-94-ea-a-atlas.webp", "head,bread,wash,dead,feather,weather,want,swan", 4, 2],
    ["assets/images/lesson-95-oi-oy-atlas.webp", "coin,boy,toy,point,oil,soil,joy,annoy", 4, 2],
    ["assets/images/lesson-96-ou-ow-atlas.webp", "out,cow,brown,cloud,house,mouse,down,owl", 4, 2],
    ["assets/images/lesson-98-silent-atlas.webp", "knee,write,thumb,knife,wrist,lamb,comb,knock", 4, 2],
    ["assets/images/lesson-100-comparison-atlas.webp", "faster,fastest,smaller,bigger,biggest,hotter,taller,shortest", 4, 2],
    ["assets/images/lesson-101-ly-atlas.webp", "slowly,quickly,kindly,softly,loudly,quietly,happily,sadly", 4, 2],
    ["assets/images/lesson-102-less-ful-atlas.webp", "helpful,careless,hopeful,fearless,useful,useless,colorful,painful", 4, 2],
    ["assets/images/lesson-103-un-atlas.webp", "unfair,unlock,unsafe,unhappy,untie,unwrap,unplug,uncover", 4, 2],
    ["assets/images/lesson-104-pre-re-atlas.webp", "preview,redo,replay,restart,preheat,rebuild,reread,repaint", 4, 2],
    ["assets/images/lesson-105-dis-atlas.webp", "dislike,disconnect,dishonest,disagree,disappear,disobey,discolor,disorder", 4, 2],
    ["assets/images/lesson-107-double-atlas.webp", "hopped,running,planned,stopped,clapped,swimming,skipped,dragged", 4, 2],
    ["assets/images/lesson-109-drop-e-atlas.webp", "making,riding,hoped,baking,smiling,closing,using,waved", 4, 2],
    ["assets/images/lesson-110-y-i-atlas.webp", "cried,happier,happiest,tried,carried,dried,easier,busiest", 4, 2],
    ["assets/images/lesson-111-ar-or-schwa-atlas.webp", "dollar,doctor,collar,actor,sailor,mirror,motor,visitor", 4, 2],
    ["assets/images/lesson-112-air-atlas.webp", "chair,care,bear,hair,pair,fair,square,pear", 4, 2],
    ["assets/images/lesson-113-ear-atlas.webp", "hear,near,year,ear,dear,clear,gear,tear", 4, 2],
    ["assets/images/lesson-114-rare-a-atlas.webp", "vein,eight,they,sleigh,reindeer,grey,weigh,neighbor", 4, 2],
    ["assets/images/lesson-115-rare-u-atlas.webp", "few,feud,rescue,soup,neutral,fuel,statue,group", 4, 2],
    ["assets/images/lesson-116-ough-atlas.webp", "bought,thought,dough,brought,fought,sought,rough,though", 4, 2],
    ["assets/images/lesson-117-soft-cg-atlas.webp", "city,germ,giant,center,cell,giraffe,gym,gem", 4, 2],
    ["assets/images/lesson-118-rare-silent-atlas.webp", "chef,school,gnome,listen,chorus,character,sign,light", 4, 2],
    ["assets/images/lesson-119-sion-tion-atlas.webp", "vision,action,station,mission,nation,vacation,mansion,lotion", 4, 2],
    ["assets/images/lesson-120-ture-atlas.webp", "picture,nature,future,adventure,creature,furniture,capture,mixture", 4, 2],
    ["assets/images/lesson-121-occupations-atlas.webp", "teacher,actor,artist,farmer,singer,sailor,dentist,scientist", 4, 2],
    ["assets/images/lesson-122-ish-atlas.webp", "childish,greenish,selfish,foolish,pinkish,ticklish,sheepish,feverish", 4, 2],
    ["assets/images/lesson-123-y-atlas.webp", "rainy,salty,windy,sunny,cloudy,snowy,messy,sleepy", 4, 2],
    ["assets/images/lesson-124-ness-atlas.webp", "kindness,darkness,sadness,happiness,softness,brightness,sickness,weakness", 4, 2],
    ["assets/images/lesson-125-ment-atlas.webp", "payment,movement,enjoyment,excitement,agreement,improvement,amazement,treatment", 4, 2],
    ["assets/images/lesson-126-able-ible-atlas.webp", "readable,visible,possible,washable,edible,flexible,breakable,comfortable", 4, 2],
    ["assets/images/lesson-127-prefix-number-atlas.webp", "bicycle,triangle,unicorn,binoculars,tricycle,uniform,bilingual,tripod", 4, 2],
    ["assets/images/phonics-corrections-atlas.webp", "harmless,preschool,prepay,world,doughnut,ghost", 3, 2],
    ["assets/images/phonics-audit-extra-atlas.webp", "clam,colt,sugar,calendar,steak,straight", 3, 2],
    ["assets/images/lesson-f-b-atlas.webp", "leaf,roof,ball", 3, 1],
    ["assets/images/lesson-n-o-atlas.webp", "tin,pot,mop,mom", 2, 2],
    ["assets/images/lesson-d-atlas.webp", "dad,did,dim,dip,dot,nod,sad,mad", 4, 2],
    ["assets/images/n-position-atlas.webp", "noodle,knee,napkin,on,in,skin", 3, 2],
    ["assets/images/alphabet-atlas-01.webp", "ant,apple,ax,map,mat,man,sun,sit,sock,tap,ten,top,pan,pig,pop,fan,fin,fun,in,pin,net,nut,nap,hot,log,ox,dog,dad,dot,cat,cap,cot,up,cup,gum,gap", 6, 6],
    ["assets/images/alphabet-atlas-02.webp", "at,sat,ham,ram,on,not,did,bat,bus,bug,bed,pet,hen,cats,maps,cups,dogs,pigs,beds,kid,kit,kiss,hat,rat,red,run,rip,rock,rug,leg,lips,lamp,lock,luck,web,win", 6, 6],
    ["assets/images/alphabet-atlas-03.webp", "wag,jam,jet,jog,yam,yes,yet,box,fox,six,quiz,quit,quack,van,vet,vivid,zip,zap,zigzag,fish,milk,grin,frog,pond,stop,black,hand,stamp,spin,clock,drum,plum,jump,step,desk,blend", 6, 6]
  ].map(([file, words, columns, rows]) => ({ file, words: words.split(","), columns, rows }));

  // Bounds measured against the original artwork, not an assumed equal grid.
  // Each rectangle is [left, top, right, bottom] in the stated reference size.
  const reviewedPictureBounds = {
    "alphabet-atlas-01.webp": {"size":[1254,1254],"boxes":[[37,38,218,208],[250,38,410,211],[479,16,586,220],[640,45,827,214],[838,74,1051,215],[1093,7,1189,229],[30,243,208,426],[260,234,392,434],[463,247,609,434],[641,242,792,431],[836,295,1030,383],[1055,247,1223,432],[16,448,211,642],[241,464,424,647],[447,449,595,651],[607,459,837,640],[836,467,1028,640],[1046,434,1221,654],[31,663,202,843],[256,676,401,834],[411,669,586,830],[632,681,781,830],[807,668,1044,844],[1054,706,1221,844],[14,881,208,1032],[238,862,424,1051],[454,857,609,1051],[640,844,786,1055],[880,844,989,988],[1045,858,1214,1055],[18,1074,194,1217],[210.00000000000003,1064,448,1239],[482,1070,579,1217],[635,1078,801,1224],[819,1084,1011,1221],[1024,1103,1235,1201]]},
    "lesson-75-le-atlas.webp": {"size":[1672,941],"boxes":[[50,85,420,427],[469,142,843,430],[873,90,1254,457],[1315,51,1591,466],[67,473,397,855],[529,479,715,864],[836,553,1186,868],[1229,470,1639,888]]},
    "alphabet-atlas-02.webp": {"size":[1254,1254],"boxes":[[40,55,221.00000000000003,218],[267,14,411,224],[441,53,640,214.99999999999997],[647,25,839,233],[849.9999999999999,45,1026,233],[1056,42,1238,234],[20,232.00000000000003,230,453],[232.00000000000003,255,451,424.99999999999994],[451.99999999999994,266,667,443],[672,279,838,429.99999999999994],[843,258,1033,444],[1080,246,1242,449],[26,460,197,660],[221.00000000000003,470,444,661],[440,471,642,660],[647,477,833,662],[835.0000000000001,451,1063,668],[1058,486.00000000000006,1241,665],[22,705,245,869],[282,666,405,882],[446.99999999999994,686,619,864],[626,683.0000000000001,835.0000000000001,867],[834,707,1025,851],[1037,712,1245,854.9999999999999],[33,895,225,1044],[247,880,418,1063],[433,891,603,1050],[623,890,815,1055],[822,889.0000000000001,1035,1053],[1058,868,1178,1051],[32,1083,230,1210],[263,1056,401,1244],[444,1056,590,1234],[653,1058,800.9999999999999,1235],[823,1059,1031,1246],[1056,1053,1201,1240]]},
    "lesson-n-o-atlas.webp": {"size":[1254,1254],"boxes":[[167,73,523,573],[637,89,1232,562],[101,600,538,1196],[740,600,1135,1209]]},
    "alphabet-atlas-03.webp": {"size":[1254,1254],"boxes":[[36,21,221,219],[240,22,420,223],[420,54,654,212],[678,12,825,223],[869,31,1046,207],[1085,25,1240,223],[15,225,199,445],[215,247,418,440],[459,227,627,440],[663,283,815,385],[856,244,1048,436],[1071,234,1232,445],[16,460,207,661],[207,483,420,654],[440,445,631,667],[643,456,841,662],[871,445,1031,667],[1036,469,1227,662],[5,672,204,859],[214,685,414,845],[449,677,595,858],[654,667,812,862],[848,681,1020,862],[1043,676,1252,854],[15,862,167,1054],[223,862,396,1054],[425,862,578,1046],[639.0000000000001,874.0000000000001,800.9999999999999,1046],[830,862,1023,1054],[1055,864,1235,1054],[18,1054,193,1243],[231,1061,394,1240],[436,1054,588,1252],[624,1056,805,1240],[836,1062,1014,1249],[1057,1059,1233,1236]]},
    "lesson-85-ee-ea-ey-atlas.webp": {"size":[1774,887],"boxes":[[38,15,443,426],[496,59,850,399],[927,51,1276,412],[1330,42,1717,434],[89,464,397,815],[444,443,887,853],[925,443,1275,848],[1364,444,1696,850]]},
    "lesson-f-b-atlas.webp": {"size":[2172,724],"boxes":[[131,57,694,663],[724,99,1449,649],[1562,96,2098,635]]},
    "n-position-atlas.webp": {"size":[1536,1024],"boxes":[[70,128,512,455],[657,41,937,486],[1083,20,1436,512],[81,517,460,977],[535,581,984,967],[1047,527,1500,983]]},
    "lesson-d-atlas.webp": {"size":[1774,887],"boxes":[[64,0,414,459],[470,20,860,459],[965,29,1260,441],[1332,0,1774,459],[132,549,314,728],[498,459,830,887],[968,459,1249,885],[1377,459,1654,887]]},
    "phonics-audit-extra-atlas.webp": {"size":[1536,1024],"boxes":[[22,128,484,402],[571,12,942,470],[1069,78,1466,447],[59,552,484,922],[524,626,1011,930],[1024,532,1536,991]]},
    "lesson-89-short-oo-atlas.webp": {"size":[1774,887],"boxes":[[60,1,446,452],[492,71,887,438],[988,41,1229,449],[1320,1,1709,452],[88,452,426,878],[486,509,889,855],[935,452,1240,877],[1387,452,1614,856]]},
    "lesson-42-flsz-atlas.webp": {"size":[1536,1024],"boxes":[[47,24,512,531],[594,64,929,510],[1014,114,1536,525],[82,582,470,916],[547,604,977,958],[1034,556,1474,986]]},
    "alphabet-late-atlas.webp": {"size":[1536,1024],"boxes":[[53,58,256,182],[277,74,523,204],[533,18,768,213],[826,22,965,214],[1022,40,1272,214],[1287,34,1497,214],[44,214,256,404],[289,219,526,410],[569,232,762,404],[803,222,1020,405],[1056,217,1234,407],[1285,217,1454,410],[86,410,229,604],[291,410,509,603],[543,427,744,593],[809,410,988,604],[1037,423,1254,600],[1315,410,1463,604],[48,604,236,791],[315,613,481,794],[564,604,717,794],[801,611,977,794],[1036,604,1250,792],[1288,609,1464,794],[30,800,271,974],[275,794,521,995],[540,794,751,994],[800,794,985,992],[1024,799,1257,989],[1280,802,1488,995]]},
    "lesson-w-h-atlas.webp": {"size":[1536,1024],"boxes":[[137,80,437,476],[564,81,989,460],[1023,58,1440,477],[91,628,480,882],[542,512,943,978],[1056,512,1468,976]]},
    "lesson-27-43-corrections-atlas.webp": {"size":[1774,887],"boxes":[[182,58,735,806],[980,37,1686,821]]},
    "lesson-w-position-atlas.webp": {"size":[1536,1024],"boxes":[[21,122,531,451],[632,43,957,486],[1030,37,1509,512],[38,551,547,979],[641,518,930,966],[1024,553,1484,978]]},
    "lesson-43-all-atlas.webp": {"size":[1536,1024],"boxes":[[132,140,489,545],[571,88,992,545],[1103,7,1410,545],[71,612,496,927],[628,578,909,956],[1075,594,1423,959]]},
    "lesson-44-45-atlas.webp": {"size":[1536,1024],"boxes":[[180,28,396,512],[553,54,971,478],[1096,99,1434,456],[70,544,462,938],[527,529,933,960],[1024,561,1480,945]]},
    "lesson-45-sh-atlas.webp": {"size":[1536,1024],"boxes":[[65,117,512,460],[639,37,937,512],[1050,63,1477,496],[135,549,409,961],[540,556,1023,901],[1036,585,1463,940]]},
    "lesson-46-th-atlas.webp": {"size":[1536,1024],"boxes":[[87,56,484,482],[543,19,992,499],[994,121,1535,482],[62,560,564,960],[606,512,943,994],[1053,512,1452,993]]},
    "lesson-47-th-atlas.webp": {"size":[1536,1024],"boxes":[[138,12,487,512],[610,19,948,509],[1176,18,1343,505],[65,536,507,1001],[557,566,1024,951],[1087,533,1463,960]]},
    "lesson-47-48-atlas.webp": {"size":[1536,1024],"boxes":[[78,54,519,471],[546,112,1018,454],[1062,120,1474,433],[60,510,548,964],[608,506,960,967],[1050,562,1468,929]]},
    "lesson-48-ch-atlas.webp": {"size":[1536,1024],"boxes":[[52,115,513,459],[572,102,1024,496],[1122,55,1427,492],[20,524,519,959],[547,522,954,957],[983,548,1528,955]]},
    "lesson-49-wh-atlas.webp": {"size":[1774,887],"boxes":[[62,27,394,430],[455,80,887,395],[902,98,1317,390],[1364,52,1717,443],[35,453,416,862],[448,484,880,809],[929,491,1267,832],[1362,532,1732,802]]},
    "lesson-50-wh-ph-atlas.webp": {"size":[1536,1024],"boxes":[[65,78,512,464],[634,53,913,482],[1039,121,1438,471],[59,526,512,919],[580,528,995,977],[1034,534,1454,963]]},
    "lesson-50-ph-extra-atlas.webp": {"size":[1536,1024],"boxes":[[91,54,489,481],[580,69,959,490],[1040,110,1490,474],[179,512,378,983],[616,512,915,994],[1103,585,1411,922]]},
    "lesson-51-ng-atlas.webp": {"size":[1536,1024],"boxes":[[112,104,455,436],[552,7,978,512],[1039,51,1508,512],[53,550,494,935],[558,512,946,998],[977,721,1500,835]]},
    "lesson-51-ng-extra-atlas.webp": {"size":[1536,1024],"boxes":[[144,55,512,512],[614,86,977,512],[1063,121,1407,500],[78,624,512,917],[544,543,1005,954],[1104,560,1324,928]]},
    "lesson-52-nk-atlas.webp": {"size":[1536,1024],"boxes":[[100,87,477,487],[535,85,960,502],[1046,61,1482,479],[131,563,450,949],[539,522,962,960],[1117,512,1403,948]]},
    "lesson-52-nk-extra-atlas.webp": {"size":[1536,1024],"boxes":[[113,36,451,489],[529,121,972,473],[1024,60,1520,503],[100,526,458,975],[523,512,1002,982],[1067,530,1458,980]]},
    "lesson-54-vce-a-atlas.webp": {"size":[1536,1024],"boxes":[[68,98,501,475],[524,126,1019,465],[1024,93,1525,476],[52,538,508,942],[555,537,954,929],[1023,554,1498,937]]},
    "lesson-55-vce-i-atlas.webp": {"size":[1536,1024],"boxes":[[63,125,550,490],[601,38,979,512],[1127,139,1430,438],[94,572,444,930],[512,562,970,928],[994,547,1531,960]]},
    "lesson-56-vce-o-atlas.webp": {"size":[1536,1024],"boxes":[[160,55,474,509],[547,100,1003,506],[1074,75,1391,512],[177,538,448,932],[583,550,949,912],[1072,542,1386,939]]},
    "lesson-57-vce-review-atlas.webp": {"size":[1536,1024],"boxes":[[81,112,511,463],[570,78,964,470],[1047,95,1462,452],[71,511,506,959],[527,511,962,957],[1000,564,1494,946]]},
    "lesson-58-vce-u-atlas.webp": {"size":[1536,1024],"boxes":[[146,109,466,438],[586,114,974,437],[1084,30,1450,477],[131,537,447,957],[516,561,993,955],[1060,512,1452,967]]},
    "lesson-61-ge-atlas.webp": {"size":[1536,1024],"boxes":[[56,120,512,479],[540,44,1005,470],[1028,65,1487,482],[59,555,491,920],[566,482,927,973],[1095,482,1401,959]]},
    "lesson-62-vce-exception-b-atlas.webp": {"size":[1536,1024],"boxes":[[71,122,535,434],[584,39,945,455],[1046,118,1493,467],[22,512,537,951],[551,512,863,955],[963,595,1509,945]]},
    "lesson-60-ce-atlas.webp": {"size":[1536,1024],"boxes":[[66,76,539,512],[594,124,967,496],[1024,62,1452,512],[101,536,470,927],[523,556,974,918],[1024,554,1435,951]]},
    "lesson-60-ce-extra-atlas.webp": {"size":[1536,1024],"boxes":[[81,50,529,511],[548,109,1028,479],[1060,65,1442,512],[111,512,436,978],[576,545,997,951],[1061,580,1427,933]]},
    "lesson-62-vce-exception-a-atlas.webp": {"size":[1536,1024],"boxes":[[123,123,445,472],[523,104,1030,474],[1090,71,1401,512],[29,564,517,862],[532,512,1024,930],[1072,578,1401,937]]},
    "lesson-63-es-atlas.webp": {"size":[1774,887],"boxes":[[91,80,393,421],[494,113,846,412],[930,106,1261,416],[1315,127,1715,419],[66,458,385,821],[476,466,830,805],[871,482,1300,830],[1326,520,1703,803]]},
    "lesson-64-ed-atlas.webp": {"size":[1536,1024],"boxes":[[28,60,347,480],[389,75,756,502],[766,99,1142,487],[1152,88,1511,483],[30,538,352,930],[402,584,766,956],[768,547,1087,940],[1103,666,1536,944]]},
    "lesson-65-ing-atlas.webp": {"size":[1774,887],"boxes":[[96,36,376,426],[457,64,854,426],[905,50,1293,418],[1394,70,1661,427],[63,443,410,838],[494,445,781,828],[886,446,1266,846],[1330,462,1769,868]]},
    "lesson-66-syllable-atlas.webp": {"size":[1774,887],"boxes":[[36,51,443,439],[498,8,765,448],[906,71,1304,441],[1304,49,1774,448],[52,448,371,855],[510,468,789,827],[897,448,1241,835],[1335,494,1718,838]]},
    "lesson-67-compound-atlas.webp": {"size":[1774,887],"boxes":[[17,35,443,456],[520,0,817,462],[893,117,1354,416],[1388,44,1749,449],[28,505,435,846],[481,515,884,848],[945,491,1279,844],[1389,472,1698,868]]},
    "lesson-68-open-closed-atlas.webp": {"size":[1536,1024],"boxes":[[112,38,328,512],[430,52,748,512],[825,71,1086,512],[1153,89,1511,512],[104,530,319,976],[411,562,740,972],[819,588,1072,954],[1109,562,1495,964]]},
    "lesson-69-tch-atlas.webp": {"size":[1672,941],"boxes":[[95,19,418,457],[500,23,786,459],[865.9999999999999,59,1229,452],[1276,90,1633,453],[65,457,381,920],[441,490,849,882],[873,474,1243,895],[1260,501,1651,910]]},
    "lesson-70-dge-atlas.webp": {"size":[1774,887],"boxes":[[62,62,399,417],[430,109,914,429],[921,69,1304,425],[1369,69,1707,423],[0,443,443,850],[458,492,895,827],[895,520,1262,828],[1330,443,1721,848]]},
    "lesson-72-vcc-atlas.webp": {"size":[1536,1024],"boxes":[[83,97,371,485],[384,106,768,492],[798,121,1116,480],[1116,107,1505,497],[88,529,323,924],[379,601,737,897],[761,533,1107,929],[1150,583,1505,903]]},
    "lesson-73-y-long-i-atlas.webp": {"size":[1536,1024],"boxes":[[70,48,350,485],[428,112,768,452],[838,82,1117,487],[1166,81,1499,486],[39,525,357,956],[416,510,734,961],[802,564,1109,951],[1142,510,1502,958]]},
    "lesson-74-y-long-e-atlas.webp": {"size":[1774,887],"boxes":[[86,52,381,443],[463,80,876,437],[970,80,1223,439],[1362,80,1690,428],[64,471,402,832],[458,457,887,825],[913,492,1298,837],[1372,444,1654,838]]},
    "lesson-77-ar-atlas.webp": {"size":[1774,887],"boxes":[[18,104,427,396],[448,75,888,408],[943,61,1288,405],[1323,66,1774,416],[95,443,390,817],[527,462,789,834],[975,463,1231,830],[1321,492,1763,799]]},
    "lesson-78-or-atlas.webp": {"size":[1774,887],"boxes":[[74,22,393,411],[509,11,840,420],[891,20,1330,426],[1386,22,1749,412],[22,443,432,826],[443,443,887,856],[1007,455,1203,838],[1375,482,1710,833]]},
    "lesson-80-er-atlas.webp": {"size":[1774,887],"boxes":[[28,20,449,443],[460,60,909,443],[916,44,1329,443],[1360,58,1727,435],[37,449,431,869],[449,473,923,841],[978,443,1299,860],[1346,443,1677,858]]},
    "lesson-81-ir-ur-atlas.webp": {"size":[1774,887],"boxes":[[39,32,408,433],[541,9,766,435],[882,1,1329,435],[1343,47,1729,405],[22,499,420,802],[456,440,822,867],[967,435,1161,877],[1300,452,1772,847]]},
    "phonics-corrections-atlas.webp": {"size":[1536,1024],"boxes":[[14,73,486,477],[512,63,1024,450],[1031,62,1510,453],[50,537,456,951],[540,547,966,952],[1042,531,1490,959]]},
    "lesson-84-ai-ay-atlas.webp": {"size":[1774,887],"boxes":[[39,27,433,440],[443,84,890,464],[893,76,1379,448],[1384,87,1744,432],[40,501,417,794],[443,478,836,839],[870,464,1303,868],[1326,515,1753,831]]},
    "lesson-114-rare-a-atlas.webp": {"size":[1774,887],"boxes":[[69,51,384,414],[465,121,875,346],[944,85,1282,409],[1330,107,1713,405],[75,443,330,841],[457,482,851,798],[898,517,1271,802],[1280,479,1774,829]]},
    "lesson-86-oa-ow-oe-atlas.webp": {"size":[1536,1024],"boxes":[[30,94,401,495],[433,86,765,485],[861,85,1110,503],[1150,59,1502,518],[14,568,401,962],[418,525,737,957],[778,557,1123,931],[1161,551,1482,972]]},
    "lesson-87-ie-igh-atlas.webp": {"size":[1774,887],"boxes":[[13,79,438,392],[443,15,897,436],[968,16,1258,436],[1319,21,1754,418],[124,443,327,860],[436,436,885,873],[902,494,1292,820],[1330,452,1711,867]]},
    "lesson-90-long-oo-atlas.webp": {"size":[1672,941],"boxes":[[21,69,424,458],[446,122,857,459],[895,68,1309,459],[1332,113,1621,465],[26,471,439,905],[448,492,813,863],[828,528,1251,863],[1251,483,1672,884]]},
    "lesson-91-ew-ui-ue-atlas.webp": {"size":[1536,1024],"boxes":[[71,69,384,493],[411,113,798,484],[819,94,1172,482],[1258,129,1459,467],[69,512,378,951],[481,526,684,946],[822,546,1062,943],[1118,532,1500,935]]},
    "lesson-93-aw-atlas.webp": {"size":[1672,941],"boxes":[[54,48,445,469],[475,61,833,465],[847,87,1259,461],[1289,69,1606,465],[81,486,403,877],[435,543,792,856],[846,470,1214,894],[1321,489,1553,881]]},
    "lesson-94-ea-a-atlas.webp": {"size":[1672,941],"boxes":[[65,92,397,471],[418,108,830,466],[838,68,1221,471],[1285,92,1588,471],[32,508,379,859],[453,486,802,866],[832,478,1237,893],[1245,521,1664,885]]},
    "lesson-95-oi-oy-atlas.webp": {"size":[1536,1024],"boxes":[[99,148,343,432],[468,37,664,478],[785,63,1082,469],[1157,64,1445,488],[102,554,299,935],[383,604,749,931],[768,512,1073,906],[1189,523,1478,959]]},
    "lesson-96-ou-ow-atlas.webp": {"size":[1774,887],"boxes":[[81,21,436,443],[482,29,874,435],[930,51,1308,443],[1330,175,1747,396],[40,470,450,851],[525,463,845,833],[948,458,1230,839],[1324,455,1745,858]]},
    "lesson-98-silent-atlas.webp": {"size":[1774,887],"boxes":[[65,0,387,423],[468,10,870,438],[958,32,1276,386],[1364,19,1714,405],[62,448,340,866],[469,444,838,861],[899,448,1254,828],[1327,445,1724,873]]},
    "lesson-100-comparison-atlas.webp": {"size":[1536,1024],"boxes":[[6,95,399,451],[412,107,844,431],[844,202,1147,435],[1152,144,1515,431],[0,589,417,873],[434,640,792,869],[803,494,1119,914],[1188,517,1483,906]]},
    "lesson-101-ly-atlas.webp": {"size":[1536,1024],"boxes":[[62,148,365,386],[392,133,764,412],[769,52,1160,440],[1203,30,1502,462],[27,479,380,939],[441,489,706,947],[793,477,1105,955],[1185,477,1473,960]]},
    "lesson-102-less-ful-atlas.webp": {"size":[1536,1024],"boxes":[[16,47,417,489],[417,37,762,515],[774,50,1132,515],[1155,35,1506,503],[12,525,403,975],[403,584,768,950],[777,525,1118,996],[1158,515,1482,986]]},
    "lesson-103-un-atlas.webp": {"size":[1693,929],"boxes":[[0,80,481,470],[506,92,911,460],[913,21,1298,470],[1364,52,1632,470],[0,516,472,912],[472,470,873,929],[882,498,1272,912],[1272,489,1693,929]]},
    "lesson-104-pre-re-atlas.webp": {"size":[1536,1024],"boxes":[[15,89,389,495],[389,106,781,495],[786,117,1146,481],[1152,110,1534,486],[4,495,383,945],[383,505,742,931],[742,520,1116,963],[1118,509,1528,975]]},
    "lesson-105-dis-atlas.webp": {"size":[1536,1024],"boxes":[[31,51,359,499],[384,204,778,377],[790,31,1081,491],[1143,73,1536,496],[28,539,302,957],[341,499,732,979],[768,578,1097,961],[1097,574,1528,972]]},
    "lesson-107-double-atlas.webp": {"size":[1774,887],"boxes":[[65,8,324,421],[515,22,799,413],[908,23,1295,417],[1338,24,1732,421],[20,427,341,850],[428,513,887,833],[963,422,1235,837],[1316,422,1721,835]]},
    "lesson-109-drop-e-atlas.webp": {"size":[1774,887],"boxes":[[11,10,404,436],[484,0,788,443],[887,30,1254,425],[1285,0,1774,443],[53,443,341,887],[443,443,862,875],[928,443,1307,887],[1382,443,1646,887]]},
    "lesson-110-y-i-atlas.webp": {"size":[1536,1024],"boxes":[[60,66,330,494],[375,66,750,485],[768,70,1152,484],[1152,44,1499,503],[37,522,354,981],[369,515,733,997],[735,512,1094,1000],[1094,524,1529,1000]]},
    "lesson-111-ar-or-schwa-atlas.webp": {"size":[1774,887],"boxes":[[6,65,442,356],[538,17,807,434],[917,102,1290,361],[1330,21,1751,437],[78,443,302,851],[496,443,794,852],[913,486,1258,813],[1356,443,1720,865]]},
    "lesson-112-air-atlas.webp": {"size":[1536,1024],"boxes":[[54,93,368,507],[415,65,755,514],[776,94,1099,512],[1133,97,1507,507],[43,568,341,924],[358,550,776,934],[807,601,1106,921],[1166,553,1428,933]]},
    "lesson-113-ear-atlas.webp": {"size":[1774,887],"boxes":[[80,32,399,438],[489,141,849,370],[920,41,1276,435],[1432,74,1652,396],[73,450,421,875],[525,460,784,834],[917,466,1235,826],[1330,453,1723,868]]},
    "lesson-115-rare-u-atlas.webp": {"size":[1774,887],"boxes":[[50,144,434,345],[500,34,845,433],[925,6,1371,433],[1377,142,1737,432],[83,445,373,860],[514,462,806,842],[947,447,1244,853],[1330,453,1741,855]]},
    "lesson-116-ough-atlas.webp": {"size":[1774,887],"boxes":[[98,43,368,419],[482,26,835,419],[888,122,1271,400],[1332,50,1718,416],[27,461,453,830],[453,484,886,831],[900,504,1293,846],[1320,460,1736,873]]},
    "lesson-117-soft-cg-atlas.webp": {"size":[1774,887],"boxes":[[14,45,443,409],[504,66,834,384],[910,20,1325,434],[1395,84,1686,373],[40,484,408,833],[522,443,817,856],[887,480,1325,856],[1394,491,1698,815]]},
    "lesson-118-rare-silent-atlas.webp": {"size":[1774,887],"boxes":[[105,25,390,418],[477,52,887,426],[910,25,1256,438],[1358,60,1643,418],[56,486,471,840],[540,442,828,851],[919,454,1245,851],[1325,448,1692,864]]},
    "lesson-119-sion-tion-atlas.webp": {"size":[1774,887],"boxes":[[25,34,440,439],[468,49,819,442],[890,36,1330,443],[1344,32,1748,443],[17,454,431,855],[443,448,882,872],[887,456,1328,860],[1336,463,1734,859]]},
    "lesson-120-ture-atlas.webp": {"size":[1536,1024],"boxes":[[78,100,385,467],[396,75,760,493],[764,146,1097,491],[1097,98,1459,507],[61,516,390,928],[391,539,746,914],[756,524,1085,933],[1088,531,1452,936]]},
    "lesson-121-occupations-atlas.webp": {"size":[1774,887],"boxes":[[94,39,421,421],[507,46,864,415],[930,70,1241,412],[1332,50,1676,427],[111,443,405,824],[474,443,860,842],[974,443,1273,830],[1323,443,1682,847]]},
    "lesson-122-ish-atlas.webp": {"size":[1536,1024],"boxes":[[9,70,382,485],[413,97,715,460],[734,109,1194,487],[1209,56,1517,482],[42,550,330,928],[358,571,798,951],[807,523,1010,966],[1038,512,1536,1002]]},
    "lesson-123-y-atlas.webp": {"size":[1536,1024],"boxes":[[16,40,388,517],[395,150,766,511],[768,58,1152,517],[1152,35,1520,517],[28,532,377,951],[386,537,756,919],[768,552,1148,979],[1151,580,1518,971]]},
    "lesson-124-ness-atlas.webp": {"size":[1619,971],"boxes":[[24,94,405,484],[419,85,809,485],[809,87,1204,485],[1209,90,1619,485],[22,500,405,894],[412,500,809,893],[809,501,1204,893],[1210,501,1606,892]]},
    "lesson-125-ment-atlas.webp": {"size":[1536,1024],"boxes":[[53,65,393,489],[439,69,702,466],[757,62,1122,498],[1146,89,1460,476],[52,540,389,925],[413,571,749,910],[760,570,1115,947],[1121,532,1479,951]]},
    "lesson-126-able-ible-atlas.webp": {"size":[1536,1024],"boxes":[[42,55,406,509],[409,56,768,511],[768,56,1122,510],[1127,55,1476,512],[39,512,404,937],[409,512,768,939],[768,512,1118,941],[1118,512,1478,942]]},
    "lesson-127-prefix-number-atlas.webp": {"size":[1536,1024],"boxes":[[42,162,419,489],[446,158,768,486],[807,89,1144,488],[1152,228,1521,502],[39,548,379,917],[456,512,737,911],[779,517,1127,946],[1160,541,1437,932]]},
    "phonics-reviewed-scenes-v3.webp": {"size":[1086,1448],"boxes":[[60,46,313,334],[370,13,707,338],[732,13,1072,343],[27,354,330,691],[366,350,711,695],[736,349,1070,694],[17,701,347,1040],[350,709,733,1040],[734,707,1077,1032],[17,1045,354,1412],[404,1061,691,1408],[733,1044,1075,1417]]}
  };
  const atlasPicture = (atlas, index) => {
    const reviewed = reviewedPictureBounds[atlas.file.split("/").pop()];
    const box = reviewed?.boxes[index];
    const crop = box && [box[0] / reviewed.size[0], box[1] / reviewed.size[1],
      (box[2] - box[0]) / reviewed.size[0], (box[3] - box[1]) / reviewed.size[1]];
    return { file: atlas.file, index, columns: atlas.columns, rows: atlas.rows, ...(crop ? { crop } : {}) };
  };
  const pictureFor = (word) => {
    const individualPictures = { nose: "nose-reviewed.webp", yet: "yet-reviewed.webp", drink: "drink-reviewed.webp" };
    if (individualPictures[word]) return { file: "assets/images/" + individualPictures[word], index: 0, columns: 1, rows: 1, crop: [0, 0, 1, 1] };
    if (word === "square") return { file: "assets/images/phonics-reviewed-scenes-v3.webp", index: 0, columns: 1, rows: 1, crop: [0, 0, 1, 1], diagram: "square" };

    const pictureAliases = { am: "man", at: "house", gray: "grey", hopping: "hopped", stopping: "stopped" };
    const lookupWord = pictureAliases[word] || word;
    for (const atlas of atlases) {
      const index = atlas.words.indexOf(lookupWord);
      if (index >= 0) return atlasPicture(atlas, index);
    }
    if (word.endsWith("s") && word.length > 2) {
      const singular = word.slice(0, -1);
      for (const atlas of atlases) {
        const index = atlas.words.indexOf(singular);
        if (index >= 0) return { ...atlasPicture(atlas, index), repeat: 2 };
      }
    }
    return null;
  };

  const stages = unitSpecs.map(([id, title, subtitle, color], index) => ({
    id, title, subtitle, color, order: index + 1
  }));

  const koreanGlosses = {
    ant: "개미", apple: "사과", ax: "도끼", map: "지도", mat: "매트", man: "남자",
    ham: "햄", ram: "숫양", mop: "대걸레", mom: "엄마", jam: "잼", sun: "해",
    sit: "앉다", sock: "양말", sat: "앉았다", cats: "고양이들", maps: "지도들",
    cups: "컵들", kiss: "입맞춤", tap: "두드리다", ten: "열", top: "꼭대기",
    hat: "모자", cat: "고양이", at: "~에", pan: "프라이팬", pig: "돼지", pop: "펑 터지다",
    pin: "핀", nap: "낮잠", cup: "컵", cap: "모자", rip: "찢다", fan: "선풍기",
    fin: "지느러미", fun: "재미", fox: "여우", fish: "물고기", frog: "개구리",
    leaf: "잎", roof: "지붕", in: "안에", did: "했다", milk: "우유", tin: "깡통",
    on: "위에", not: "아니다", pot: "냄비", hot: "뜨거운", dad: "아빠", dim: "어두운",
    dip: "담그다", dot: "점", nod: "끄덕이다", sad: "슬픈", mad: "화난", cot: "아기 침대",
    rock: "바위", lock: "자물쇠", clock: "시계", up: "위로", gum: "껌", bus: "버스",
    run: "달리다", rug: "깔개", luck: "행운", gap: "틈", dog: "개", leg: "다리",
    log: "통나무", bat: "야구 방망이", bed: "침대", web: "거미줄", box: "상자",
    black: "검은색", ball: "공", bug: "벌레", hen: "암탉", red: "빨간색", jet: "제트기",
    vet: "수의사", dogs: "개들", pigs: "돼지들", beds: "침대들", kid: "아이",
    kit: "구급상자", skin: "피부", hand: "손", hill: "언덕", house: "집", horse: "말",
    rat: "쥐", drum: "북", lip: "입술", lamp: "램프", plum: "자두", blend: "섞다",
    win: "이기다", wag: "흔들다", water: "물", wall: "벽", wolf: "늑대", worm: "지렁이",
    swim: "수영하다", twin: "쌍둥이", swam: "수영했다", swell: "큰 파도", twig: "잔가지", wave: "파도",
    cliff: "절벽", bell: "종", mess: "어질러진 것", buzz: "윙윙거리다", puff: "훅 불기",
    doll: "인형", bull: "황소", tall: "키가 큰", roll: "구르다", full: "가득 찬", duck: "오리",
    back: "등", neck: "목", check: "확인 표시", shell: "조개껍데기", ship: "배", shop: "가게",
    dish: "접시", wish: "소원", brush: "솔", shut: "닫다", shark: "상어", shoe: "신발",
    this: "이것", that: "저것", then: "그다음", them: "그들을", mother: "엄마", father: "아빠",
    brother: "형제", feather: "깃털", thin: "얇은", bath: "목욕", moth: "나방", thumb: "엄지손가락",
    three: "셋", thick: "두꺼운", teeth: "치아", path: "길", chin: "턱", chip: "칩",
    lunch: "점심", bench: "벤치", chick: "병아리", much: "많은 양", rich: "부유한", chop: "썰다",
    whip: "채찍", phone: "전화기", graph: "그래프", whale: "고래", photo: "사진", dolphin: "돌고래",
    elephant: "코끼리", trophy: "트로피", alphabet: "알파벳", orphan: "고아", nephew: "조카", sphere: "구",
    ring: "반지", king: "왕", song: "노래", wing: "날개", hang: "걸다", long: "긴",
    sing: "노래하다", bang: "쾅 소리", thing: "것", string: "끈", swing: "그네", spring: "용수철",
    pink: "분홍색", sink: "싱크대", bank: "은행", ink: "잉크", trunk: "큰 가방", drink: "마시다",
    wink: "윙크하다", tank: "탱크", junk: "잡동사니", blink: "눈을 깜박이다", think: "생각하다", honk: "빵빵 울리다",
    cake: "케이크", game: "게임", lake: "호수", gate: "문", cape: "망토",
    bike: "자전거", kite: "연", nine: "아홉", time: "시간", line: "선", dive: "다이빙하다", smile: "미소",
    home: "집", nose: "코", rose: "장미", bone: "뼈", cone: "원뿔", rope: "밧줄", note: "메모", stone: "돌",
    these: "이것들", theme: "주제", complete: "완성하다", cube: "정육면체", tube: "통", mule: "노새",
    cute: "귀여운", flute: "플루트", tune: "조율하다", dune: "모래 언덕", brave: "용감한",
    race: "경주", ice: "얼음", space: "우주", face: "얼굴", mice: "생쥐들", place: "자리", nice: "친절한", fence: "울타리",
    dance: "춤추다", prince: "왕자", slice: "조각", once: "한 번", cage: "우리", huge: "거대한",
    stage: "무대", page: "쪽", giant: "거인", giraffe: "기린", orange: "오렌지", large: "큰",
    have: "가지다", give: "주다", come: "오다", love: "사랑", done: "끝난", none: "아무것도 없음", some: "조금", live: "살다",
    well: "우물", jog: "천천히 달리다", jump: "뛰다", jar: "병", jeep: "지프",
    jelly: "젤리", jacket: "재킷", yam: "고구마", yes: "네", yet: "아직", yak: "야크",
    yoyo: "요요", yarn: "털실", yogurt: "요구르트", yellow: "노란색", six: "여섯",
    ox: "황소", wax: "밀랍", mix: "섞다", fix: "고치다", quiz: "퀴즈", quit: "그만두다",
    quack: "꽥꽥 울다", queen: "여왕", quilt: "누비이불", quill: "깃펜", squid: "오징어",
    square: "정사각형", van: "승합차", vivid: "선명한", vase: "꽃병", vest: "조끼",
    five: "다섯", oven: "오븐", seven: "일곱", zip: "지퍼", zap: "찌릿", zigzag: "지그재그",
    zoo: "동물원", zebra: "얼룩말", zero: "영", maze: "미로", stamp: "도장",
    spin: "돌다", pond: "연못", stop: "멈추다", step: "걸음", desk: "책상",
    napkin: "냅킨", noodle: "국수", knee: "무릎"
  };

  Object.assign(koreanGlosses, {
    wishes: "소원들", boxes: "상자들", dishes: "접시들", buses: "버스들", foxes: "여우들", roses: "장미들", classes: "학급들", brushes: "솔들",
    jumped: "뛰었다", filled: "채웠다", wanted: "원했다", helped: "도왔다", played: "놀았다", painted: "그렸다", kicked: "찼다", landed: "착륙했다",
    jumping: "뛰는 중", resting: "쉬는 중", helping: "돕는 중", running: "달리는 중", singing: "노래하는 중", reading: "읽는 중", painting: "그리는 중", sleeping: "자는 중",
    sunset: "일몰", rabbit: "토끼", picnic: "소풍", kitten: "새끼 고양이", magnet: "자석", basket: "바구니", insect: "곤충",
    catfish: "메기", backpack: "책가방", bathtub: "욕조", hotdog: "핫도그", football: "축구공", cupcake: "컵케이크",
    no: "아니요", robot: "로봇", tulip: "튤립", music: "음악", pilot: "조종사", tiger: "호랑이", lemon: "레몬", hotel: "호텔",
    catch: "잡다", watch: "손목시계", match: "짝", patch: "헝겊 조각", witch: "마녀", hutch: "토끼장", fetch: "물어오다", stitch: "바느질 한 땀",
    badge: "배지", bridge: "다리", edge: "가장자리", fudge: "퍼지", judge: "판사", hedge: "생울타리", wedge: "쐐기", fridge: "냉장고",
    child: "아이", cold: "추운", find: "찾다", wild: "야생의", old: "나이 든", gold: "금", kind: "친절한", most: "대부분",
    my: "나의", fly: "파리", cry: "울다", sky: "하늘", try: "시도하다", shy: "수줍은", dry: "마른", why: "왜",
    happy: "행복한", sunny: "화창한", baby: "아기", puppy: "강아지", funny: "우스운", city: "도시", candy: "사탕", body: "몸",
    table: "탁자", little: "작은", puzzle: "퍼즐", candle: "양초", bottle: "병", turtle: "거북이", castle: "성"
  });
  Object.assign(koreanGlosses, {
    car: "자동차", farm: "농장", star: "별", park: "공원", arm: "팔", jar: "병", card: "카드", shark: "상어",
    fork: "포크", corn: "옥수수", shore: "물가", storm: "폭풍", porch: "현관", short: "짧은", north: "북쪽",
    fern: "양치식물", herd: "동물 떼", term: "기간", germ: "세균", clerk: "점원", perch: "앉다", serve: "나르다", verb: "동사",
    bird: "새", girl: "소녀", turn: "돌다", shirt: "셔츠", skirt: "치마", first: "첫째", nurse: "간호사", purse: "손가방", her: "그녀의", word: "단어",
    rain: "비", train: "기차", play: "놀다", snail: "달팽이", mail: "우편", chain: "사슬", day: "낮", tray: "쟁반",
    tree: "나무", feet: "발들", key: "열쇠", green: "초록색", beach: "해변", monkey: "원숭이", honey: "꿀",
    boat: "배", snow: "눈", toe: "발가락", coach: "코치", road: "도로", goat: "염소", window: "창문", hoe: "괭이",
    pie: "파이", night: "밤", light: "빛", bright: "밝은", tie: "넥타이", high: "높은", right: "오른쪽", sigh: "한숨 쉬다",
    put: "놓다", book: "책", foot: "발", cook: "요리하다", look: "보다", wood: "나무", good: "좋은", hook: "갈고리",
    moon: "달", food: "음식", spoon: "숟가락", room: "방", boot: "장화", pool: "수영장",
    chew: "씹다", fruit: "과일", blue: "파란색", screw: "나사", suit: "정장", glue: "풀", juice: "주스", clue: "단서",
    haul: "끌다", saw: "톱", caught: "잡았다", yawn: "하품", paw: "동물 발", sauce: "소스", daughter: "딸", straw: "빨대",
    head: "머리", bread: "빵", wash: "씻다", dead: "죽은", weather: "날씨", want: "원하다", swan: "백조",
    coin: "동전", boy: "소년", toy: "장난감", point: "가리키다", oil: "기름", soil: "흙", joy: "기쁨", annoy: "짜증나게 하다",
    out: "밖으로", cow: "소", brown: "갈색", cloud: "구름", mouse: "생쥐", down: "아래로", owl: "부엉이",
    write: "쓰다", knife: "칼", wrist: "손목", lamb: "어린 양", comb: "빗", knock: "두드리다"
  });

  Object.assign(koreanGlosses, {
    faster: "더 빠른", fastest: "가장 빠른", smaller: "더 작은", bigger: "더 큰", biggest: "가장 큰", hotter: "더 뜨거운", taller: "더 키 큰", shortest: "가장 짧은",
    slowly: "천천히", quickly: "빠르게", kindly: "친절하게", softly: "부드럽게", loudly: "큰 소리로", quietly: "조용히", happily: "행복하게", sadly: "슬프게",
    helpful: "도움이 되는", careless: "부주의한", hopeful: "희망에 찬", fearless: "두려움 없는", useful: "쓸모 있는", useless: "쓸모없는", colorful: "알록달록한", painful: "아픈",
    unfair: "불공평한", unlock: "잠금을 풀다", unsafe: "안전하지 않은", unhappy: "행복하지 않은", untie: "풀다", unwrap: "포장을 풀다", unplug: "플러그를 빼다", uncover: "덮개를 벗기다",
    preview: "미리 보기", redo: "다시 하다", replay: "다시 재생하다", restart: "다시 시작하다", preheat: "미리 데우다", rebuild: "다시 짓다", reread: "다시 읽다", repaint: "다시 칠하다",
    dislike: "싫어하다", disconnect: "연결을 끊다", dishonest: "정직하지 않은", disagree: "동의하지 않다", disappear: "사라지다", disobey: "따르지 않다", discolor: "색이 바래다", disorder: "어지러움",
    hopped: "깡충 뛰었다", planned: "계획했다", stopped: "멈췄다", clapped: "박수쳤다", swimming: "수영하는 중", skipped: "줄넘기했다", dragged: "끌었다",
    making: "만드는 중", riding: "타는 중", hoped: "바랐다", baking: "굽는 중", smiling: "웃는 중", closing: "닫는 중", using: "사용하는 중", waved: "손을 흔들었다",
    cried: "울었다", happier: "더 행복한", happiest: "가장 행복한", tried: "시도했다", carried: "날랐다", dried: "말렸다", easier: "더 쉬운", busiest: "가장 바쁜",
    dollar: "달러", doctor: "의사", collar: "목걸이", actor: "배우", sailor: "선원", mirror: "거울", motor: "모터", visitor: "방문객",
    chair: "의자", care: "돌보다", bear: "곰", hair: "머리카락", pair: "한 쌍", fair: "놀이 장터", square: "정사각형", pear: "배",
    hear: "듣다", near: "가까운", year: "해", ear: "귀", dear: "소중한", clear: "맑은", gear: "톱니바퀴", tear: "눈물",
    vein: "정맥", eight: "여덟", they: "그들", sleigh: "썰매", reindeer: "순록", grey: "회색", weigh: "무게를 재다", neighbor: "이웃",
    few: "조금의", feud: "다툼", rescue: "구조하다", soup: "수프", neutral: "중립적인", fuel: "연료", statue: "조각상", group: "무리",
    bought: "샀다", thought: "생각했다", dough: "반죽", brought: "가져왔다", fought: "싸웠다", sought: "찾았다", rough: "거친", though: "비록"
  });

  Object.assign(koreanGlosses, {
    center: "가운데", cell: "세포", gym: "체육관", gem: "보석", chef: "요리사", school: "학교", gnome: "난쟁이", listen: "듣다", chorus: "합창", character: "등장인물", sign: "표지판", light: "빛",
    vision: "시야", action: "행동", station: "역", mission: "임무", nation: "나라", vacation: "휴가", mansion: "대저택", lotion: "로션",
    picture: "그림", nature: "자연", future: "미래", adventure: "모험", creature: "생물", furniture: "가구", capture: "잡다", mixture: "혼합물",
    teacher: "선생님", artist: "예술가", farmer: "농부", singer: "가수", dentist: "치과 의사", scientist: "과학자",
    childish: "아이 같은", greenish: "초록빛의", selfish: "이기적인", foolish: "어리석은", pinkish: "분홍빛의", ticklish: "간지럼 타는", sheepish: "멋쩍은", feverish: "열이 나는",
    rainy: "비 오는", salty: "짠", windy: "바람 부는", cloudy: "흐린", snowy: "눈 오는", messy: "어지러운", sleepy: "졸린",
    kindness: "친절함", darkness: "어둠", sadness: "슬픔", happiness: "행복", softness: "부드러움", brightness: "밝음", sickness: "아픔", weakness: "약함",
    payment: "지불", movement: "움직임", enjoyment: "즐거움", excitement: "신남", agreement: "동의", improvement: "향상", amazement: "놀라움", treatment: "치료",
    readable: "읽을 수 있는", visible: "보이는", possible: "가능한", washable: "씻을 수 있는", edible: "먹을 수 있는", flexible: "잘 휘는", breakable: "깨질 수 있는", comfortable: "편안한",
    bicycle: "자전거", triangle: "삼각형", unicorn: "유니콘", binoculars: "쌍안경", tricycle: "세발자전거", uniform: "제복", bilingual: "두 언어를 쓰는", tripod: "삼각대"
  });

  Object.assign(koreanGlosses, {
    am: "~이다",
    hats: "모자들", rocks: "바위들", books: "책들", roofs: "지붕들", clocks: "시계들",
    webs: "거미줄들", bells: "종들", hands: "손들", rams: "숫양들", moms: "엄마들"
  });

  Object.assign(koreanGlosses, {
    what: "무엇", when: "언제", where: "어디", which: "어느 것", wheel: "바퀴", whistle: "호루라기",
    pal: "친구", fall: "가을", harmless: "해가 없는", preschool: "유치원", prepay: "미리 지불하다",
    world: "세계", doughnut: "도넛", ghost: "유령",
    clam: "대합조개", colt: "망아지", sugar: "설탕", calendar: "달력", steak: "스테이크", straight: "곧은",
    gray: "회색", hopping: "깡충 뛰는 중", stopping: "멈추는 중", tallest: "가장 키 큰", snore: "코를 골다", chore: "집안일"
  });

  const childTitleFor = (title, order) => {
    if (order === 57) return "e–e 소리와 a–e·i–e·o–e 복습";
    if (order === 59) return "끝 e 긴 모음 전체 복습";
    const exact = {
      "l /l/ 2 · al": "l 소리 2 · al 단어",
      "wh /w/": "wh로 시작하는 /w/ 소리",
      "ph /f/": "ph가 만드는 /f/ 소리",
      "VCe 복습 1 · e_e /ē/": "e–e 소리와 긴 모음 복습",
      "ough /aw, ō/": "ough의 /aw/·/ō/ 소리",
      "VC/CVC 합성": "소리를 이어 짧은 단어 읽기",
      "CVC 연습: a, i": "a·i가 들어간 짧은 단어 읽기",
      "비음화 a: an, am": "an·am 단어 읽기",
      "FLSZ 끝 글자 겹치기": "짧은 모음 뒤 끝 글자 겹치기",
      "-all, -oll, -ull": "all·oll·ull로 끝나는 단어",
      "-s /s/": "끝 s가 또렷하게 나는 단어",
      "s /z/": "끝 s가 부드럽게 나는 단어",
      "VCe 전체 복습": "끝 e가 있는 긴 모음 복습",
      "VCe 예외와 복습": "끝 e 규칙과 예외 복습",
      "긴 모음 VCC": "자음 두 개 앞의 긴 모음",
      "ce /s/": "끝 ce에서 c가 /s/로 나는 단어",
      "ea /ĕ/ · a /ŏ/": "짧게 나는 ea와 w 뒤의 a",
      "g /j/: e, i, y 앞": "e·i·y 앞의 g 소리",
      "y /ī/": "한 음절 끝의 y 소리",
      "y /ē/": "두 음절 끝의 y 소리",
      "/er/ 철자 선택": "같은 소리의 er·ir·ur·w+or 고르기",
      "oo /ū/": "길게 나는 oo 소리",
      "묵음 kn /n/ · wr /r/ · -mb /m/": "kn은 k, wr은 w, -mb는 끝 b가 소리 나지 않아요",
      "음절 나누기": "긴 단어를 음절로 나누어 읽기",
      "합성어와 닫힌 두 음절": "합성어와 닫힌 두 음절 단어 구별하기",
      "열린 음절과 닫힌 음절": "모음으로 끝나는 음절과 자음으로 끝나는 음절",
      "-es": "끝에 es가 붙은 단어",
      "-ed": "끝 ed의 세 가지 소리",
      "-ing": "하고 있는 일을 나타내는 ing",
      "접미사 -s·-es": "하나보다 많을 때 붙이는 s·es",
      "-er·-est": "비교할 때 붙이는 er·est",
      "-ly": "방법을 나타내는 ly",
      "-less·-ful": "없음과 가득함을 나타내는 less·ful",
      "접두사 un-": "반대 뜻을 만드는 un",
      "접두사 pre-·re-": "미리·다시를 뜻하는 pre·re",
      "접두사 dis-": "반대·떨어짐을 뜻하는 dis",
      "-sion·-tion": "명사를 만드는 sion·tion",
      "-ture": "명사를 만드는 ture",
      "-er·-or·-ist": "사람을 나타내는 er·or·ist",
      "-ish": "비슷함을 나타내는 ish",
      "-y": "성질을 나타내는 y",
      "-ness": "상태를 나타내는 ness",
      "-ment": "결과·상태를 나타내는 ment",
      "-able·-ible": "할 수 있음을 나타내는 able·ible",
      "bi-·tri-·uni-": "숫자를 나타내는 bi·tri·uni",
      "신호 모음: c /s/ · g /j/": "e·i·y 앞에서 달라지는 c와 g",
      "ch /sh, k/ · gn /n/ · gh /g/ · 묵음 t": "ch·gn·gh의 드문 소리와 묵음 t"
    };
    if (exact[title]) return exact[title];
    return title
      .replace(/([a-z]+)_e/gi, "$1–e")
      .replace(/\s*\/[^/]+\//g, " 소리")
      .replace(/\bVCe\b/g, "끝 e 규칙")
      .replace(/\bVCC\b/g, "모음·자음·자음")
      .replace(/\bCVC\b/g, "짧은 단어")
      .replace(/\s+/g, " ")
      .trim();
  };

  const activityTypeFor = (order, title) => {
    if (title === "VC/CVC 합성") return "blend";
    if (title === "-s /s/" || title === "s /z/") return "pattern";
    if (/음절|합성어|긴 단어/.test(title)) return "syllable";
    if (/접두사|접미사|접사|자음 겹치기|끝 e 빼기|y를 i로/.test(title) || order >= 119) return "word-parts";
    if (/복습|섞어 읽기|철자 선택/.test(title)) return "review";
    if (order <= 34) return "sound";
    return "pattern";
  };

  const activityCopy = {
    sound: { label: "새 소리", instruction: "단어를 듣고 같은 그림과 글자를 고르세요." },
    blend: { label: "소리 잇기", instruction: "낱소리를 차례로 이은 뒤 완성된 단어를 고르세요." },
    review: { label: "누적 복습", instruction: "지금까지 배운 소리를 떠올리며 들은 단어를 고르세요." },
    pattern: { label: "읽기 규칙", instruction: "오늘의 글자 규칙을 확인하고 들은 단어를 고르세요." },
    syllable: { label: "긴 단어 읽기", instruction: "단어를 작은 소리 덩어리로 나누어 읽고 고르세요." },
    "word-parts": { label: "단어 조각", instruction: "낱말의 앞뒤 조각과 철자 변화를 살펴보고 고르세요." }
  };

  const segmentWord = (word, focus) => {
    const patterns = focus.flatMap((item) => item.replace(/^-/, "").split("_")).filter(Boolean).sort((a, b) => b.length - a.length);
    const parts = [];
    for (let index = 0; index < word.length;) {
      const pattern = patterns.find((item) => item.length > 1 && word.startsWith(item, index));
      if (pattern) {
        parts.push(pattern);
        index += pattern.length;
      } else {
        parts.push(word[index]);
        index += 1;
      }
    }
    return parts;
  };

  // First meaning describes the reviewed illustration; other common meanings
  // remain available instead of being silently replaced by the pictured sense.
  const reviewedMeanings = {
  "cap": [
    "챙 있는 모자",
    "뚜껑"
  ],
  "mat": [
    "매트",
    "깔개"
  ],
  "jam": [
    "잼",
    "교통 체증",
    "꽉 끼다"
  ],
  "kiss": [
    "입맞춤",
    "입맞추다"
  ],
  "tap": [
    "수도꼭지",
    "가볍게 두드리다"
  ],
  "top": [
    "팽이",
    "꼭대기",
    "맨 위의"
  ],
  "pop": [
    "펑 터지다",
    "튀다",
    "대중음악"
  ],
  "pin": [
    "핀",
    "핀으로 고정하다"
  ],
  "fan": [
    "부채",
    "선풍기",
    "팬(애호가)"
  ],
  "fish": [
    "물고기",
    "낚시하다"
  ],
  "tin": [
    "깡통",
    "주석"
  ],
  "dip": [
    "담그다",
    "살짝 내려가다"
  ],
  "mad": [
    "화난",
    "제정신이 아닌"
  ],
  "cot": [
    "간이침대",
    "아기 침대"
  ],
  "rock": [
    "바위",
    "흔들다",
    "록 음악"
  ],
  "lock": [
    "자물쇠",
    "잠그다"
  ],
  "gum": [
    "껌",
    "잇몸"
  ],
  "run": [
    "달리다",
    "작동하다",
    "운영하다"
  ],
  "log": [
    "통나무",
    "기록"
  ],
  "bat": [
    "박쥐",
    "야구 방망이"
  ],
  "web": [
    "거미줄",
    "웹(인터넷)"
  ],
  "box": [
    "상자",
    "권투하다"
  ],
  "bug": [
    "벌레",
    "프로그램 오류"
  ],
  "kid": [
    "아이",
    "새끼 염소",
    "농담하다"
  ],
  "kit": [
    "구급상자",
    "도구 세트"
  ],
  "skin": [
    "피부",
    "과일 껍질"
  ],
  "swell": [
    "큰 파도",
    "부풀다",
    "붓다"
  ],
  "jar": [
    "병",
    "단지"
  ],
  "yam": [
    "고구마(미국식 용법)",
    "얌(참마류)"
  ],
  "yet": [
    "아직",
    "벌써",
    "하지만"
  ],
  "wax": [
    "밀랍",
    "왁스"
  ],
  "fix": [
    "고치다",
    "고정하다"
  ],
  "quilt": [
    "누비이불",
    "누비천"
  ],
  "square": [
    "정사각형",
    "광장",
    "제곱"
  ],
  "vest": [
    "조끼",
    "러닝셔츠(영국식)"
  ],
  "zip": [
    "지퍼",
    "지퍼를 잠그다"
  ],
  "stamp": [
    "우표",
    "도장",
    "발을 구르다"
  ],
  "step": [
    "계단 한 단",
    "걸음",
    "단계"
  ],
  "blend": [
    "섞다",
    "혼합"
  ],
  "puff": [
    "훅 불기",
    "한 모금의 연기"
  ],
  "roll": [
    "구르다",
    "두루마리",
    "작은 빵"
  ],
  "fall": [
    "가을",
    "떨어지다",
    "넘어지다"
  ],
  "back": [
    "등",
    "뒤",
    "돌아가다"
  ],
  "check": [
    "확인 표시",
    "확인하다"
  ],
  "ship": [
    "배",
    "물건을 보내다"
  ],
  "shop": [
    "가게",
    "물건을 사다"
  ],
  "shell": [
    "조개껍데기",
    "단단한 껍질"
  ],
  "dish": [
    "접시",
    "요리"
  ],
  "wish": [
    "소원",
    "바라다"
  ],
  "brush": [
    "솔",
    "붓",
    "솔질하다"
  ],
  "thin": [
    "가는",
    "얇은",
    "마른"
  ],
  "chip": [
    "전자 칩",
    "감자칩",
    "작은 조각"
  ],
  "rich": [
    "부유한",
    "풍부한"
  ],
  "chop": [
    "썰다",
    "잘게 자르다"
  ],
  "phone": [
    "전화기",
    "전화하다"
  ],
  "ring": [
    "반지",
    "고리",
    "울리다"
  ],
  "bank": [
    "은행",
    "강둑"
  ],
  "trunk": [
    "큰 여행 가방",
    "나무의 몸통",
    "코끼리의 코",
    "자동차 짐칸"
  ],
  "sink": [
    "싱크대",
    "가라앉다"
  ],
  "drink": [
    "마시다",
    "음료"
  ],
  "tank": [
    "탱크",
    "액체 저장 탱크"
  ],
  "game": [
    "게임",
    "경기"
  ],
  "cape": [
    "망토",
    "곶(바다로 튀어나온 땅)"
  ],
  "wave": [
    "파도",
    "손을 흔들다"
  ],
  "line": [
    "낚싯줄",
    "선",
    "줄",
    "대사"
  ],
  "smile": [
    "미소",
    "미소 짓다"
  ],
  "rose": [
    "장미",
    "올랐다(rise의 과거형)"
  ],
  "cone": [
    "원뿔",
    "교통용 안전 표지",
    "아이스크림 콘"
  ],
  "note": [
    "메모",
    "음표",
    "주목하다"
  ],
  "complete": [
    "완성하다",
    "완전한"
  ],
  "tube": [
    "속이 빈 관",
    "튜브"
  ],
  "tune": [
    "곡",
    "가락",
    "조율하다"
  ],
  "race": [
    "경주",
    "경쟁하다"
  ],
  "space": [
    "우주",
    "공간"
  ],
  "face": [
    "얼굴",
    "마주하다"
  ],
  "place": [
    "자리",
    "장소",
    "놓다"
  ],
  "nice": [
    "친절한",
    "좋은"
  ],
  "cage": [
    "동물 우리",
    "새장"
  ],
  "stage": [
    "무대",
    "단계"
  ],
  "page": [
    "쪽",
    "페이지"
  ],
  "orange": [
    "오렌지",
    "주황색"
  ],
  "love": [
    "사랑",
    "사랑하다"
  ],
  "live": [
    "살다",
    "생방송의(발음 다름)"
  ],
  "some": [
    "몇몇의",
    "약간의"
  ],
  "classes": [
    "학급들",
    "수업들"
  ],
  "painted": [
    "그렸다",
    "색칠했다"
  ],
  "painting": [
    "그리는 중",
    "그림"
  ],
  "watch": [
    "손목시계",
    "보다",
    "지켜보다"
  ],
  "match": [
    "짝",
    "성냥",
    "경기",
    "어울리다"
  ],
  "patch": [
    "헝겊 조각",
    "덧대다"
  ],
  "catch": [
    "잡다",
    "받다"
  ],
  "fetch": [
    "물어오다",
    "가져오다"
  ],
  "stitch": [
    "바느질 한 땀",
    "꿰매다"
  ],
  "bridge": [
    "다리(건너는 구조물)",
    "연결하다"
  ],
  "judge": [
    "판사",
    "판단하다"
  ],
  "cold": [
    "추운",
    "차가운",
    "감기"
  ],
  "find": [
    "찾다",
    "발견하다"
  ],
  "kind": [
    "친절한",
    "종류"
  ],
  "fly": [
    "파리",
    "날다"
  ],
  "dry": [
    "마른",
    "말리다"
  ],
  "funny": [
    "우스운",
    "이상한"
  ],
  "table": [
    "탁자",
    "표"
  ],
  "little": [
    "작은",
    "조금의"
  ],
  "park": [
    "공원",
    "주차하다"
  ],
  "arm": [
    "팔",
    "무장시키다"
  ],
  "card": [
    "카드",
    "놀이용 카드"
  ],
  "fork": [
    "포크",
    "갈림길"
  ],
  "short": [
    "짧은",
    "키가 작은"
  ],
  "term": [
    "기간",
    "학기",
    "용어"
  ],
  "germ": [
    "세균",
    "싹"
  ],
  "perch": [
    "새가 앉다",
    "횃대"
  ],
  "serve": [
    "음식을 내다",
    "돕다",
    "서브하다"
  ],
  "turn": [
    "돌다",
    "돌리다",
    "차례"
  ],
  "nurse": [
    "간호사",
    "간호하다"
  ],
  "train": [
    "기차",
    "훈련하다"
  ],
  "play": [
    "놀다",
    "연주하다",
    "연극"
  ],
  "mail": [
    "우편",
    "우편으로 보내다"
  ],
  "day": [
    "낮",
    "하루",
    "날"
  ],
  "key": [
    "열쇠",
    "건반",
    "핵심"
  ],
  "coach": [
    "코치",
    "지도하다",
    "장거리 버스"
  ],
  "light": [
    "빛",
    "전등",
    "가벼운"
  ],
  "bright": [
    "밝은",
    "영리한"
  ],
  "tie": [
    "넥타이",
    "묶다",
    "무승부"
  ],
  "right": [
    "오른쪽",
    "옳은",
    "권리"
  ],
  "book": [
    "책",
    "예약하다"
  ],
  "foot": [
    "발",
    "피트(길이 단위)"
  ],
  "cook": [
    "요리하다",
    "요리사"
  ],
  "room": [
    "방",
    "공간"
  ],
  "boot": [
    "부츠",
    "장화",
    "컴퓨터를 켜다"
  ],
  "pool": [
    "수영장",
    "물웅덩이"
  ],
  "blue": [
    "파란색",
    "우울한"
  ],
  "screw": [
    "나사",
    "나사로 조이다"
  ],
  "suit": [
    "정장",
    "어울리다"
  ],
  "glue": [
    "풀",
    "붙이다"
  ],
  "saw": [
    "톱",
    "보았다(see의 과거형)"
  ],
  "straw": [
    "빨대",
    "짚"
  ],
  "head": [
    "머리",
    "우두머리"
  ],
  "point": [
    "가리키다",
    "점",
    "점수"
  ],
  "oil": [
    "기름",
    "기름을 치다"
  ],
  "mouse": [
    "생쥐",
    "컴퓨터 마우스"
  ],
  "down": [
    "아래로",
    "솜털"
  ],
  "comb": [
    "빗",
    "빗질하다"
  ],
  "clear": [
    "맑은",
    "분명한",
    "치우다"
  ],
  "care": [
    "돌보다",
    "주의",
    "걱정"
  ],
  "bear": [
    "곰",
    "참다",
    "견디다"
  ],
  "fair": [
    "놀이 장터",
    "공정한",
    "박람회"
  ],
  "dear": [
    "소중한",
    "편지에서 친애하는"
  ],
  "gear": [
    "톱니바퀴",
    "장비"
  ],
  "tear": [
    "눈물",
    "찢다(발음 다름)"
  ],
  "few": [
    "소수의",
    "거의 없는"
  ],
  "feud": [
    "오랜 다툼",
    "불화"
  ],
  "neutral": [
    "중립적인"
  ],
  "thought": [
    "생각했다",
    "생각"
  ],
  "sought": [
    "찾으려 했다",
    "찾았다"
  ],
  "though": [
    "비록 ~이지만",
    "하지만"
  ],
  "center": [
    "가운데",
    "중심",
    "센터"
  ],
  "cell": [
    "세포",
    "작은 방"
  ],
  "character": [
    "등장인물",
    "성격",
    "문자"
  ],
  "sign": [
    "표지판",
    "신호",
    "서명하다"
  ],
  "vision": [
    "시력",
    "시야",
    "미래상"
  ],
  "mission": [
    "임무",
    "사명"
  ],
  "nation": [
    "나라",
    "국민"
  ],
  "picture": [
    "그림",
    "사진"
  ],
  "nature": [
    "자연",
    "본성"
  ],
  "capture": [
    "잡다",
    "사진에 담다"
  ],
  "childish": [
    "유치한",
    "아이 같은"
  ],
  "weakness": [
    "약함",
    "약점"
  ],
  "agreement": [
    "동의",
    "합의",
    "협약"
  ],
  "treatment": [
    "치료",
    "대우",
    "처리"
  ],
  "uniform": [
    "제복",
    "일정한"
  ]
};
  const pictureNotes = {
  "am": "예: I am Sam. 나는 샘이에요.",
  "at": "예: at home — 집에",
  "yet": "예: Not yet. 아직 아니에요.",
  "zero": "바구니 안의 물건이 0개예요.",
  "thin": "왼쪽 연필이 가늘어요.",
  "thick": "책이 두꺼워요.",
  "chin": "손가락이 턱을 가리켜요.",
  "theme": "예: 이번 공연의 주제는 밤이에요.",
  "place": "식사할 자리예요.",
  "most": "사과의 대부분이 왼쪽에 있어요.",
  "my": "예: my body — 나의 몸",
  "verb": "run(달리다)처럼 동작을 나타내는 말이에요.",
  "short": "왼쪽 연필이 짧아요.",
  "smaller": "왼쪽 블록이 더 작아요.",
  "bigger": "오른쪽 공이 더 커요.",
  "biggest": "오른쪽 선물이 가장 커요.",
  "hotter": "오른쪽 음료가 더 뜨거워요.",
  "shortest": "오른쪽 연필이 가장 짧아요.",
  "unfair": "한 아이만 쿠키를 많이 받았어요.",
  "dishonest": "과자를 숨기고 사실대로 말하지 않아요.",
  "neutral": "어느 편도 들지 않아요.",
  "disagree": "서로 가고 싶은 방향이 달라요.",
  "few": "오리가 몇 마리만 있어요.",
  "though": "예: Though it rains, I go out. 비가 오지만 밖에 나가요.",
  "near": "두 블록이 가까이 있어요.",
  "possible": "예: 블록으로 다리를 만들 수 있어요.",
  "readable": "글을 읽을 수 있어요.",
  "visible": "연이 눈에 보여요.",
  "edible": "먹을 수 있는 과일이에요.",
  "breakable": "장식품은 떨어뜨리면 깨질 수 있어요."
};
  const wordBank = {};
  const lessons = [];
  let lessonNumber = 0;

  unitSpecs.forEach(([stageId, , , , rows]) => {
    parseRows(rows).forEach((row, stageIndex) => {
      lessonNumber += 1;
      row.words.forEach((word) => {
        if (!wordBank[word]) {
          const meanings = reviewedMeanings[word] || [koreanGlosses[word] || ""];
          wordBank[word] = { scene: "", korean: meanings.join(" · "), meanings,
            pictureMeaning: meanings[0], pictureNote: pictureNotes[word] || "", hint: `${row.title} 예시 단어`, picture: pictureFor(word) };
          if (["classes", "wishes"].includes(word)) wordBank[word].picture.repeat = 2;
        }
      });
      const activityType = activityTypeFor(lessonNumber, row.title);
      const displayTitle = childTitleFor(row.title, lessonNumber);
      const uniquePictureWords = [...new Set(row.words.filter((word) => wordBank[word]?.picture))];
      lessons.push({
        stageId,
        id: lessonNumber === 1 ? "s1-l1" : `ufli-${String(lessonNumber).padStart(3, "0")}`,
        order: lessonNumber,
        stageOrder: stageIndex + 1,
        title: displayTitle,
        sourceTitle: row.title,
        activityType,
        activityLabel: activityCopy[activityType].label,
        instruction: activityCopy[activityType].instruction,
        questionCount: Math.min(8, uniquePictureWords.length),
        focus: row.focus,
        review: [],
        words: row.words,
        sentence: `${row.words[0]} · ${row.words[1]} · ${row.words[2]}`,
        note: activityCopy[activityType].instruction,
        blend: row.words.slice(0, 3).map((word) => ({ parts: segmentWord(word, row.focus), answer: word })),
        dictation: row.words.slice(0, 3)
      });
    });
  });

  window.PHONICS_CURRICULUM = {
    version: 6,
    framework: "UFLI Foundations 공개 scope and sequence 기반",
    stages,
    lessons,
    wordBank
  };
})();
