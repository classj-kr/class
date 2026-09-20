'use strict';
const {edit,replace,cut,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'life-cycle/app.js',s=>{
 const start=s.indexOf('const STAGE_PATHS = {'),end=s.indexOf('\nfunction drawFoodChain',start);
 if(start<0||end<0)throw Error('life drawing anchors');
 s=s.slice(0,start)+`function drawStages(g) {
    const a=analyse(), art=window.lifeObservationArt;
    g.innerHTML=art.scene(state.animal,a.step);
    const [title,description]=art.features[state.animal][a.step];
    $('lifeFeature').innerHTML='<h3>'+title+'</h3><p>'+description+'</p><p class="life-food"><span>먹이</span> '+a.stage.eat+'</p>';
    $('lifeStages').innerHTML=a.animal.stages.map((stage,i)=>'<button type="button" data-life-step="'+i+'" aria-pressed="'+(i===a.step)+'">'+art.scene(state.animal,i,true)+'<span>'+stage.n+'</span></button>').join('');
    $('lifeCycleNote').textContent='어른이 번식하면 다음 세대의 한살이가 이어집니다.';
}
`+s.slice(end);
 s=replace(s,`function render() {
    const m = $('mainGroup'), gr = $('graphGroup');
    m.textContent = ''; gr.textContent = '';
    drawStages(m); drawFoodChain(gr);
    updateReadout();
}`,`let lastRenderKey='';
function render() {
    const key=[state.animal,state.step,state.prediction,state.checked].join(':');
    if(key!==lastRenderKey){
        lastRenderKey=key;
        const m=$('mainGroup'),gr=$('graphGroup');
        gr.textContent='';
        drawStages(m);drawFoodChain(gr);updateReadout();
    }
    const a=analyse(),done=elapsedDays();
    $('lifeProgress').value=done/a.total;
    $('lifeDay').textContent='성장 기간 예시'+' · '+Math.round(done)+' / '+a.total+'일';
}`);
 s=replace(s,"'어른이 되면 끝'","'번식하여 다음 세대로 이어짐'");
 s=replace(s,"['이 단계에 머무는 날',","['이 단계의 기간 예시',");
 s=replace(s,"${a.total}일`;","${a.total}일 (예시)`;");
 s=replace(s,'dt / (n * 1.6)','dt / (n * 4)');
 s=replace(s,"let last = 0;",`const motionButton=$('lifeMotionBtn');
let motionPaused=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function setMotionPaused(paused){
    motionPaused=paused;
    document.querySelector('.life-stage').classList.toggle('life-motion-paused',paused);
    motionButton.textContent=paused?'움직임 재생':'움직임 멈추기';
    motionButton.setAttribute('aria-pressed',String(paused));
}
motionButton.addEventListener('click',()=>setMotionPaused(!motionPaused));
$('lifeStages').addEventListener('click',e=>{
    const button=e.target.closest('[data-life-step]');
    if(!button)return;
    const range=$('stageRange');range.value=button.dataset.lifeStep;
    range.dispatchEvent(new Event('input',{bubbles:true}));
});
setMotionPaused(motionPaused);
let last = 0;`);
 return s;
});
edit(lab+'life-cycle/index.html',s=>{
 s=replace(s,'life-visual.css?v=5','life-visual.css?v=6');
 s=replace(s,'걸리는 날수는 따뜻한 봄철을 기준으로 삼았습니다','성장 기간은 예시이며, 종류와 온도에 따라 달라집니다.');
 s=replace(s,'<span>어른이 되기까지</span>','<span>어른이 되기까지 · 기간 예시</span>');
 const start=s.indexOf('                <div class="stage-views">'),end=s.indexOf('\n                <div class="stage-readout"',start);
 if(start<0||end<0)throw Error('life markup anchors');
 s=s.slice(0,start)+`                <div class="stage-views life-observation">
                    <div class="life-focus">
                        <svg class="main-svg" viewBox="0 0 200 200" role="img" aria-label="선택한 성장 단계의 생김새와 움직임" aria-describedby="lifeFeature"><g id="mainGroup"></g></svg>
                        <div id="lifeFeature" class="life-feature"></div>
                    </div>
                    <div class="life-motion-control"><span>행동 관찰 · 성장 과정은 압축 재생</span><button id="lifeMotionBtn" type="button" aria-pressed="false">움직임 멈추기</button></div>
                    <div id="lifeStages" class="life-stages" aria-label="성장 단계 선택"></div>
                    <div class="life-timeline"><progress id="lifeProgress" max="1" value="0" aria-label="예시 성장 기간"></progress><span id="lifeDay"></span></div>
                    <p id="lifeCycleNote" class="life-cycle-note"></p>
                    <details class="life-food-chain"><summary>먹이 관계 비교</summary><svg class="graph-svg" viewBox="0 0 460 196" aria-label="먹이가 되는 생물에서 먹는 생물로 이어지는 먹이 사슬"><g id="graphGroup"></g></svg></details>
                </div>
`+s.slice(end);
 s=replace(s,'    <script src="app.js?', '    <script src="life-observation-art.js?v=1"></script>\n    <script src="app.js?');
 return s;
});
edit(lab+'life-cycle/life-visual.css',s=>s+`
/* Biological observations: one detailed specimen, then selectable stages. */
.life-stage .life-focus {display:grid;grid-template-columns:minmax(180px,1.1fr) minmax(160px,1fr);gap:22px;align-items:center;}
.life-stage .life-focus .main-svg{width:100%;max-width:320px;min-width:0;margin:auto;}
.life-stage .life-feature h3 {font-size:18px;line-height:1.4;margin:0 0 12px;color:#254c39;}
.life-stage .life-feature p {font-size:16px;line-height:1.75;margin:0 0 12px;word-break:keep-all;}
.life-stage .life-food {padding-top:10px;border-top:1px solid #dae5d6;}
.life-food span {color:#607667;margin-right:8px;}
.life-motion-control{display:flex;justify-content:space-between;gap:12px;align-items:center;color:#526b5f;font-size:14px;}
.life-motion-control button{min-height:44px;min-width:108px;padding:8px 12px;border:1px solid #a7bdb0;border-radius:9px;color:#325d46;background:#fff;font:inherit;cursor:pointer;}
.life-stage .life-stages{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;}
.life-stage .life-stages:has(button:nth-child(3):last-child){grid-template-columns:repeat(3,minmax(0,1fr));}
.life-stages button{position:relative;min-width:0;border:1px solid #cbd8cc;border-radius:12px;background:#fff;color:#33483a;padding:7px;font:inherit;font-size:14px;cursor:pointer;}
.life-stages button:not(:last-child)::after{content:'→';position:absolute;right:-12px;top:42%;z-index:1;color:#667d6b;background:#fff;border-radius:50%;}
.life-stages button[aria-pressed=true]{border:2px solid #518362;background:#f0f6e9;padding:6px;}
.life-stages .miniature{display:block;width:100%;max-height:84px;margin:auto;}
.life-stages button span{display:block;min-height:40px;align-content:center;line-height:1.35;}
.life-timeline{display:flex;gap:14px;align-items:center;font-size:14px;color:#526b5f;}
.life-timeline progress{flex:1;min-width:60px;height:6px;accent-color:#638957;}
.life-stage .life-cycle-note{margin:0;color:#526b5f;font-size:15px;line-height:1.6;}
.life-food-chain summary{min-height:44px;align-content:center;cursor:pointer;color:#325d46;font-size:15px;}
.life-food-chain .graph-svg{max-width:460px;}
.life-specimen{overflow:visible;}
.life-wing{transform-box:view-box;transform-origin:100px 96px;animation:life-wingbeat .8s ease-in-out infinite;}
.life-hover{animation:life-hover 3s ease-in-out infinite;}
.life-crawl{animation:life-crawl 5s ease-in-out infinite alternate;}
.life-chew{transform-box:fill-box;transform-origin:20% 60%;animation:life-chew 1.2s ease-in-out infinite;}
.life-proleg{transform-box:fill-box;transform-origin:50% 0;animation:life-leg 1.6s ease-in-out infinite alternate;}
.life-proleg.leg-1{animation-delay:-.8s;}
.life-mantis{transform-box:fill-box;transform-origin:50% 100%;animation:life-sway 4s ease-in-out infinite;}
.life-foreleg{transform-box:fill-box;transform-origin:50% 50%;animation:life-grasp 3s ease-in-out infinite;}
.life-swim{animation:life-swim 4s ease-in-out infinite alternate;}
.life-tail{transform-box:view-box;transform-origin:101px 102px;animation:life-tail .65s ease-in-out infinite alternate;}
.life-kick{transform-box:fill-box;transform-origin:0 50%;animation:life-grasp 1.3s ease-in-out infinite;}
.life-hop{transform-box:fill-box;transform-origin:50% 100%;animation:life-hop 4s ease-in-out infinite;}
.life-peck-head{transform-box:view-box;transform-origin:94px 104px;animation:life-peck 3s ease-in-out infinite;}
.life-motion-paused [data-life-motion],.life-motion-paused .life-proleg,.miniature [data-life-motion],.miniature .life-proleg{animation-play-state:paused!important;}
@keyframes life-wingbeat{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.28)}}
@keyframes life-hover{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes life-crawl{from{transform:translateX(-10px)}to{transform:translateX(8px)}}
@keyframes life-chew{0%,50%,100%{transform:rotate(0)}25%,75%{transform:rotate(8deg)}}
@keyframes life-leg{from{transform:rotate(-12deg)}to{transform:rotate(16deg)}}
@keyframes life-sway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
@keyframes life-grasp{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.75)}}
@keyframes life-swim{from{transform:translateX(-7px)}to{transform:translateX(7px)}}
@keyframes life-tail{from{transform:rotate(-10deg)}to{transform:rotate(10deg)}}
@keyframes life-hop{0%,55%,100%{transform:translateY(0) scaleY(1)}62%{transform:scaleY(.85)}76%{transform:translateY(-16px) scaleY(1.07)}90%{transform:translateY(0) scaleY(.9)}}
@keyframes life-peck{0%,45%,100%{transform:rotate(0)}60%,76%{transform:rotate(-50deg)}68%,84%{transform:rotate(-38deg)}}
@media(min-width:821px) and (max-width:1100px){.life-stage .life-focus{gap:14px;}.life-stage .life-feature h3{font-size:17px;}}
@media(max-width:600px){.life-stage .life-focus{grid-template-columns:1fr;}.life-stage .life-focus .main-svg{max-width:230px;}.life-stage .life-stages{gap:6px;}}
`);
apply();
