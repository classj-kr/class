/* Explicit gameplay motion helpers. No background DOM observer or repeated render effects. */
(() => {
  'use strict';
  const active = new Set();
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animate(element, frames, duration = 260, cleanup = () => {}) {
    if (!element?.animate || reduced()) { cleanup(); return null; }
    const animation = element.animate(frames, { duration, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both' });
    const task = { cancel() { animation.cancel(); finish(); } };
    function finish() { if (!active.delete(task)) return; cleanup(); animation.cancel(); }
    active.add(task); animation.finished.then(finish, finish);
    return animation;
  }
  function cancel() { for (const task of [...active]) task.cancel(); }
  function appear(element) { return animate(element, [{transform:'scale(.55)',opacity:.3},{transform:'scale(1)',opacity:1}], 220); }
  function flip(element, oldClass) {
    if (reduced()) return;
    const old = element.cloneNode(true);old.className = oldClass;old.setAttribute('aria-hidden','true');old.style.pointerEvents='none';element.after(old);
    animate(old,[{transform:'scaleX(1)'},{transform:'scaleX(0)'}],150,()=>old.remove());
    animate(element,[{transform:'scaleX(0)',offset:0},{transform:'scaleX(0)',offset:.5},{transform:'scaleX(1)',offset:1}],300);
  }
  function travel(element, from) {
    if (!element || !from || reduced()) return;
    const to=element.getBoundingClientRect();if(!to.width||!from.width)return;
    if(Math.abs(from.left-to.left)<1&&Math.abs(from.top-to.top)<1&&Math.abs(from.width-to.width)<1)return;
    const ghost=element.cloneNode(true);ghost.removeAttribute('id');ghost.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
    ghost.dataset.motionGhost='true';ghost.setAttribute('aria-hidden','true');ghost.style.cssText+=`;position:fixed;left:${to.left}px;top:${to.top}px;width:${to.width}px;height:${to.height}px;margin:0;z-index:1000;pointer-events:none;transform-origin:top left;`;
    const computed=getComputedStyle(element);for(const property of computed)if(property.startsWith('--'))ghost.style.setProperty(property,computed.getPropertyValue(property));
    document.body.append(ghost);const previous=element.style.visibility;element.style.visibility='hidden';
    animate(ghost,[{transform:`translate(${from.left-to.left}px,${from.top-to.top}px) scale(${from.width/to.width},${from.height/to.height})`},{transform:'translate(0,0) scale(1)'}],340,()=>{ghost.remove();element.style.visibility=previous;});
  }
  function captureCards(root=document) {
    cancel();
    return {cards:new Map([...root.querySelectorAll('#hand [data-card-id]')].map(e=>[e.dataset.cardId,e.getBoundingClientRect()])),players:new Map([...root.querySelectorAll('[data-player-id]')].map(e=>[e.dataset.playerId,e.getBoundingClientRect()])),deck:root.querySelector('#deckVisual')?.getBoundingClientRect()};
  }
  function cards(previous,next,before,topId,field) {
    if (!previous || previous.phase!=='playing' || next.actionNumber!==previous.actionNumber+1 || previous.round!==next.round) return;
    const top=next[field],oldTop=previous[field];
    if(top&&top.id!==oldTop?.id) travel(document.getElementById(topId)?.firstElementChild,before.cards.get(top.id)||before.players.get(previous.turnPlayerId));
    for(const el of document.querySelectorAll('#hand [data-card-id]')) travel(el,before.cards.get(el.dataset.cardId)||before.deck);
  }
  addEventListener('resize',cancel);
  window.ClassGameMotion={animate,appear,flip,travel,captureCards,cards,cancel};
})();
