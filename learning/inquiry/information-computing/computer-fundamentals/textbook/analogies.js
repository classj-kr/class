(() => {
"use strict";
const ns="http://www.w3.org/2000/svg";
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const txt=(x,y,s,size=18,color="#263f38")=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" fill="'+color+'">'+esc(s)+'</text>';
const paper=(x,y,color="#fffdf6",mark="")=>'<g transform="translate('+x+' '+y+')"><rect width="50" height="63" rx="3" fill="'+color+'" stroke="#748a7d" stroke-width="2"/><path d="M10 16h30M10 25h22M10 34h27" stroke="#b2bdb0" stroke-width="3"/>'+txt(12,53,mark,15)+'</g>';
const person=(x,y,scale=1,shirt="#d49648")=>'<g transform="translate('+x+' '+y+') scale('+scale+')"><path d="M13 96q1-37 34-37t34 37" fill="'+shirt+'" stroke="#43584d" stroke-width="2"/><path d="M27 91l-14 27 36 4M68 91l16 26-25 8" fill="none" stroke="#bc8761" stroke-width="12" stroke-linecap="round"/><path d="M37 66v-9h20v9" fill="#dfa57a"/><ellipse cx="47" cy="34" rx="24" ry="28" fill="#efbf92"/><path d="M23 35Q15 2 44 4q32-6 29 29L60 20 30 23z" fill="#34413a"/><circle cx="39" cy="35" r="2" fill="#26352d"/><circle cx="55" cy="35" r="2" fill="#26352d"/><path d="M40 47q7 5 14-1" fill="none" stroke="#935c47" stroke-width="2"/></g>';
const desk=(x,y,w=260)=>'<g transform="translate('+x+' '+y+')"><path d="M8 23v88M'+(w-8)+' 23v88" stroke="#725541" stroke-width="13"/><path d="M0 0h'+w+'l10 18H-10z" fill="#e0bd88" stroke="#896b4e" stroke-width="2"/><rect x="-10" y="18" width="'+(w+20)+'" height="10" fill="#b68b59"/></g>';
const cabinet=(x,y)=>'<g transform="translate('+x+' '+y+')"><path d="M0 0h135v170H0z" fill="#648a7b" stroke="#35564a" stroke-width="3"/><path d="M0 0l16-14h135L135 0M135 0v170l16-14V-14" fill="#82a28f" stroke="#35564a" stroke-width="2"/><rect x="12" y="17" width="111" height="61" rx="3" fill="#d9e5d6" stroke="#557464" stroke-width="2"/><rect x="12" y="94" width="111" height="61" rx="3" fill="#d9e5d6" stroke="#557464" stroke-width="2"/><path d="M52 32h30M52 109h30" stroke="#557464" stroke-width="5" stroke-linecap="round"/>'+txt(38,62,"자료",17)+txt(38,140,"보관",17)+'</g>';
const svg=(inner,label,box="0 0 900 520")=>'<svg xmlns="'+ns+'" viewBox="'+box+'" role="img" aria-label="'+esc(label)+'" style="font-family:KoPubWorld Batang,Batang,serif"><defs><marker id="analogy-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10" fill="none" stroke="#628578" stroke-width="2"/></marker></defs>'+inner+'</svg>';
function workshop(){
 let team="";
 for(let i=0;i<6;i++){const x=490+i*53;team+=person(x,65,.52,i%2?"#779e8c":"#7c9faa");}
 return svg('<path d="M22 290H878v198H22z" fill="#edf1e6"/><path d="M22 290H878" stroke="#d5decb" stroke-width="2"/>'+
 '<g data-analogy-zone="cpu">'+person(113,64,1.05)+desk(72,186,248)+paper(240,127,"#fffdf6","×3")+
 txt(58,37,"CPU · 숙련 작업자",24)+'</g>'+
 '<g data-analogy-zone="gpu">'+team+desk(473,138,350)+
 Array.from({length:6},(_,i)=>'<rect x="'+(488+i*54)+'" y="137" width="31" height="25" rx="2" fill="'+["#be6263","#d4a94b","#679b7b","#be6263","#d4a94b","#679b7b"][i]+'" stroke="#506b5e"/>').join("")+
 txt(474,37,"GPU · 여러 작업자 팀",24)+'</g>'+
 '<path d="M370 341Q410 230 283 211M458 341Q460 250 605 191" fill="none" stroke="#628578" stroke-width="3" stroke-dasharray="7 5" marker-end="url(#analogy-arrow)"/>'+
 '<g data-analogy-zone="ram">'+desk(242,382,332)+paper(265,323,"#fffdf6","A")+paper(328,313,"#f7e0b8","B")+paper(392,325,"#d8e7df","C")+paper(457,314,"#fffdf6","D")+txt(226,511,"RAM · 지금 쓸 자료를 펼치는 작업대",22)+'</g>'+
 '<g data-analogy-zone="ssd">'+cabinet(702,302)+txt(673,511,"SSD · 자료 보관 서랍장",22)+'</g>'+
 '<path d="M686 381H595" fill="none" stroke="#628578" stroke-width="3" marker-end="url(#analogy-arrow)" marker-start="url(#analogy-arrow)"/>'+txt(603,363,"읽기·저장",16),
 "한 작업실에서 CPU는 숙련 작업자, GPU는 같은 종류의 일을 나누는 여섯 작업자, RAM은 서류가 펼쳐진 작업대, SSD는 자료가 보관된 서랍장으로 그렸습니다.");
}
function bookmark(){
 const lines=(x,y)=>Array.from({length:6},(_,i)=>'<path d="M'+x+' '+(y+i*18)+'h90" stroke="#a9b7a5" stroke-width="3"/>').join("");
 return svg('<g data-analogy-zone="book"><path d="M42 116q92-32 173 0v206q-93-28-173 0z" fill="#faf4df" stroke="#7b7257" stroke-width="3"/><path d="M215 116q92-32 173 0v206q-85-27-173 0z" fill="#fffaf0" stroke="#7b7257" stroke-width="3"/><path d="M215 116v205" stroke="#c9bea0" stroke-width="3"/>'+lines(75,156)+lines(252,156)+'<path d="M299 91h32v122l-16-16-16 16z" fill="#bb624d"/>'+txt(106,57,"책과 책갈피",26)+txt(78,372,"책은 책장에 그대로",22)+txt(73,405,"책갈피는 다시 펼칠 위치 표시",19)+'</g>'+
 '<path d="M414 219h56" stroke="#628578" stroke-width="3" marker-end="url(#analogy-arrow)"/>'+
 '<g data-analogy-zone="web"><rect x="504" y="108" width="340" height="218" rx="12" fill="#fffdf6" stroke="#547366" stroke-width="3"/><path d="M504 152h340" stroke="#b2c5b3" stroke-width="2"/><rect x="522" y="119" width="284" height="24" rx="7" fill="#e8eedf"/>'+txt(531,136,"https://library.example/books/7",13)+'<path d="M816 117l4 9 10 1-8 7 2 10-8-5-9 5 2-10-7-7 10-1z" fill="#d2a148"/><rect x="527" y="172" width="73" height="86" fill="#bad6c5"/>'+lines(622,180)+txt(556,294,"서버에서 받은 페이지",18)+txt(563,57,"웹페이지와 북마크",26)+txt(551,372,"내용은 서버에서 다시 받음",22)+txt(568,405,"북마크에는 주소를 기록",19)+'</g>'+
 '<g data-analogy-zone="missing"><path d="M84 455h732" stroke="#d5dccc" stroke-width="2"/>'+txt(127,488,"책이 없어지면 책갈피만으로 읽을 수 없듯, 페이지가 사라지면 주소만 남아도 열 수 없습니다.",17)+'</g>',
 "왼쪽은 책에 끼운 붉은 책갈피, 오른쪽은 웹 주소를 별표로 저장한 브라우저입니다. 책갈피와 북마크 모두 다시 찾을 위치를 표시하며 내용을 복사하지 않습니다.");
}
function stampShop(){
 return svg('<path d="M30 300h840v164H30z" fill="#edf1e6"/>'+
 '<g data-analogy-zone="input">'+paper(75,147,"#fffdf6","●")+paper(132,165,"#f7e0b8","▲")+txt(48,73,"입력 · Input",25)+txt(40,265,"주문과 무늬를 받음",20)+'</g>'+
 '<g data-analogy-zone="process">'+person(337,87,.92)+desk(292,208,204)+'<rect x="308" y="190" width="69" height="19" fill="#d6a068"/><path d="M335 188v-27q13-14 25 0v27" fill="#7d6652"/>'+txt(293,73,"처리 · Processing",25)+'</g>'+
 '<g data-analogy-zone="output"><rect x="617" y="154" width="152" height="98" rx="4" fill="#fffcf4" stroke="#768a76" stroke-width="3"/><circle cx="656" cy="198" r="20" fill="#b86150"/><path d="M704 219l20-40 21 40z" fill="#678d7a"/>'+txt(612,73,"출력 · Output",25)+txt(600,297,"완성한 무늬를 보여 줌",20)+'</g>'+
 '<path d="M198 185h68M507 185h85" stroke="#628578" stroke-width="3" marker-end="url(#analogy-arrow)"/>'+
 '<g data-analogy-zone="storage"><g transform="translate(0 0) scale(.68)">'+cabinet(931,470)+'</g>'+txt(347,392,"저장 · Storage",24)+txt(322,426,"완성본을 나중에 쓰도록 보관",20)+'</g>'+
 '<path d="M694 308v23" stroke="#628578" stroke-width="3" marker-end="url(#analogy-arrow)"/>',
 "도장 공방이 주문과 무늬를 받고, 정해진 규칙으로 도장을 찍고, 완성본을 보여 주며, 나중에 사용할 완성본을 서랍에 보관합니다.");
}
const specifications={
workshop:{title:"컴퓨터를 작업실에 비유하면",image:workshop,views:{
all:["네 역할을 한 그림에서 보기","CPU는 여러 종류의 명령을 처리하는 숙련 작업자, GPU는 비슷한 계산을 많은 자료에 나누어 수행하는 작업자 팀에 비유할 수 있습니다. RAM은 지금 쓸 자료를 펼친 작업대이고, SSD는 나중에도 꺼낼 자료를 보관하는 서랍장입니다."],
cpu:["CPU · 여러 종류의 일을 처리하는 숙련 작업자","중앙 처리 장치(CPU · Central Processing Unit)는 프로그램의 명령을 실행합니다. 작업자가 지시서를 읽고 계산하거나 조건에 따라 다음 일을 고르듯, 다양한 명령과 작업 흐름을 처리합니다."],
gpu:["GPU · 비슷한 일을 나누어 하는 여러 작업자","그래픽 처리 장치(GPU · Graphics Processing Unit)는 많은 자료에 비슷한 계산을 나누어 수행하는 데 알맞습니다. 여러 작업자가 각자 맡은 칸을 같은 규칙으로 칠하는 모습에 비유할 수 있습니다. 그림 처리 외의 계산에도 쓰입니다."],
ram:["RAM · 지금 쓸 자료를 펼친 작업대","주기억 장치(RAM · Random Access Memory)는 실행 중 필요한 명령과 자료를 잠시 둡니다. 작업대가 넓으면 여러 자료를 함께 펼치기 쉽습니다. 그러나 작업대 자체가 계산하거나 자료를 영구 보관하지는 않습니다."],
ssd:["SSD · 자료를 보관하는 서랍장","반도체 저장 장치(SSD · Solid State Drive)는 파일을 보관합니다. 서랍에서 자료를 꺼내 작업대에 펼치고, 바뀐 내용을 다시 보관하는 모습을 읽기와 저장에 대응시킬 수 있습니다."]
},limits:"실제 RAM의 작업 내용은 전원이 끊기면 사라집니다. 종이 작업대와 다른 점입니다. CPU도 여러 코어로 일을 나눌 수 있고, GPU가 모든 작업에서 더 빠른 것은 아닙니다.",zoom:{all:"0 0 900 535",cpu:"30 0 360 300",gpu:"454 0 415 283",ram:"208 293 404 240",ssd:"650 276 226 256"}},
bookmark:{title:"책갈피와 북마크",image:bookmark,views:{
all:["내용과 위치를 구별하기","책갈피는 책의 내용을 따로 복사하지 않습니다. 북마크(Bookmark)도 웹페이지를 다시 찾을 주소를 기록합니다."],
book:["책갈피는 ‘어디를 펼칠지’ 표시","책갈피가 있어도 책이 없으면 그 내용을 읽을 수 없습니다. 책갈피를 버린다고 책의 내용까지 지워지는 것도 아닙니다."],
web:["북마크는 ‘어디로 접속할지’ 기록","북마크를 열면 기록된 웹 주소로 이동합니다. 내용을 파일로 내려받아 보관하는 것과 다릅니다. 북마크를 삭제해도 서버의 웹페이지는 그대로입니다."],
missing:["주소가 남아 있어도 페이지가 없을 수 있음","페이지가 삭제되거나 주소가 바뀌거나 접근 권한이 없어지면, 북마크만으로 내용을 열 수 없습니다."]
},limits:"책갈피가 끼워진 페이지와 달리, 같은 웹 주소의 내용은 사이트 운영자가 바꿀 수 있습니다. 북마크는 저장 당시의 내용을 그대로 보존하지 않습니다.",zoom:{all:"0 0 900 520",book:"20 45 394 382",web:"490 45 370 382",missing:"45 435 820 78"}},
stamp:{title:"도장 공방에서 생각해 보기",image:stampShop,views:{
all:["받고 → 규칙을 적용하고 → 보여 주고 → 보관하기","주문과 무늬를 받는 일은 입력, 규칙대로 도장을 찍는 일은 처리, 완성본을 보여 주는 일은 출력, 다음에 쓰도록 보관하는 일은 저장에 비유할 수 있습니다."],
input:["입력 · Input","공방이 받은 무늬가 달라지면 만들 결과도 달라집니다. 컴퓨터도 입력한 숫자·글자·그림 등을 처리합니다."],
process:["처리 · Processing","공방에서 같은 무늬를 받아도 찍는 색이나 규칙을 바꾸면 결과가 달라집니다. 컴퓨터는 프로그램에 정해진 규칙을 적용합니다."],
output:["출력 · Output","완성한 무늬를 보여 주는 일에 해당합니다. 컴퓨터는 화면이나 소리 등으로 처리 결과를 나타냅니다."],
storage:["저장 · Storage","보여 준 완성본을 보관함에도 넣어 두는 일입니다. 컴퓨터에서도 화면에 결과가 나타났다는 사실과 저장되었다는 사실은 다릅니다."]
},limits:"그림은 역할을 이해하기 위한 비유입니다. 컴퓨터는 사람이 뜻을 알아서 판단하는 대신 프로그램의 명령을 실행하며, 자료를 복사해도 종이처럼 원본이 닳거나 없어지지는 않습니다.",zoom:{all:"0 0 900 520",input:"25 55 195 245",process:"269 55 251 268",output:"572 55 246 268",storage:"301 335 447 187"}}
};
delete specifications.bookmark.views.missing;
const labels={all:"전체",cpu:"CPU",gpu:"GPU",ram:"RAM",ssd:"SSD",book:"책갈피",web:"북마크",missing:"페이지가 없으면",input:"입력",process:"처리",output:"출력",storage:"저장"};
function render(host,type){
 const spec=specifications[type];if(!spec)return;
 const section=document.createElement("section");section.className="picture-analogy";section.dataset.analogy=type;
 section.innerHTML='<h3>'+spec.title+'</h3><div class="analogy-controls" role="group" aria-label="비유에서 살펴볼 역할">'+Object.keys(spec.views).map(key=>'<button type="button" data-analogy-part="'+key+'" aria-pressed="'+(key==="all")+'">'+labels[key]+'</button>').join("")+'</div><figure class="analogy-scene">'+spec.image()+'</figure><div class="analogy-explanation" aria-live="polite"><h4></h4><p></p></div><p class="analogy-limit"><strong>실제 컴퓨터에서는</strong> '+spec.limits+'</p>';
 const drawing=section.querySelector("svg");
 const narrow=window.matchMedia("(max-width:540px)");
 let active="all";
 const update=key=>{
  section.dataset.part=key;active=key;
  const small=narrow.matches&&key==="all";section.dataset.mobile=String(small);
  section.querySelectorAll("[data-analogy-zone]").forEach(zone=>{zone.removeAttribute("transform");zone.style.display="";});
  drawing.querySelectorAll(":scope > path").forEach(path=>path.style.display=small?"none":"");
  section.querySelectorAll("[data-analogy-part]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.analogyPart===key)));
  section.querySelectorAll("[data-analogy-zone]").forEach(zone=>zone.classList.toggle("analogy-muted",key!=="all"&&zone.dataset.analogyZone!==key));
  const mobile={
   workshop:{box:"0 0 450 1040",parts:{cpu:"translate(35 0)",gpu:"translate(-440 285)",ram:"translate(-200 260)",ssd:"translate(-552 500)"}},
   bookmark:{box:"0 0 430 860",parts:{web:"translate(-480 430)"}},
   stamp:{box:"0 0 440 970",parts:{input:"translate(100 -30)",process:"translate(-190 220)",output:"translate(-492 517)",storage:"translate(-303 500)"}}
  };
  if(small){
   for(const [part,transform] of Object.entries(mobile[type].parts))section.querySelector('[data-analogy-zone="'+part+'"]')?.setAttribute("transform",transform);
   const missing=section.querySelector('[data-analogy-zone="missing"]');if(missing)missing.style.display="none";
  }
  drawing.setAttribute("viewBox",small?mobile[type].box:(key==="all"?spec.zoom.all:spec.zoom[key]));
  section.querySelector("h4").textContent=spec.views[key][0];
  section.querySelector(".analogy-explanation p").textContent=spec.views[key][1];
 };
 section.querySelectorAll("button").forEach(button=>button.addEventListener("click",()=>update(button.dataset.analogyPart)));
 narrow.addEventListener("change",()=>update(active));
 host.append(section);update("all");
}
window.COMPUTER_PICTURE_ANALOGIES={render};
document.querySelectorAll("[data-picture-analogy]").forEach(host=>render(host,host.dataset.pictureAnalogy));
})();