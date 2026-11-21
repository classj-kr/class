/* Shared move choreography for online chess and AI lessons. */
(() => {
  'use strict';
  function play(board, previous, move, svg, active = new Set()) {
    if (!move || !previous[move.from]) return null;
    const piece = previous[move.from];
    const capturedAt = move.enPassant ? Math.floor(move.from/8)*8+move.to%8 : move.to, captured = previous[capturedAt];
    const isCapture = captured && captured[0] !== piece[0], sound = () => window.ClassGameSfx?.play(isCapture ? 'capture' : 'stone');
    if (!Element.prototype.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) {sound(); return null;}
    const tasks = [], square = index => board.querySelector(`[data-square="${index}"]`);
    function animate(element, frames, duration, cleanup, delay = 0, easing = 'cubic-bezier(.25,.65,.3,1)') {
      const animation = element.animate(frames, {duration, delay, easing, fill:'both'});
      const task = {animation, cleanup: () => {
        if (!active.delete(task)) return;
        cleanup(); animation.cancel();
      }};
      active.add(task); tasks.push(task);
      animation.finished.then(task.cleanup, task.cleanup);
    }
    const SPIN = 300, POP = 460; // 승격: 끝 칸에 닿은 폰이 떠올라 빛나며 돌고, 돌아선 쪽에서 새 말이 튀어나온다
    function travel(from, to, piece, promotion = false) {
      const origin = square(from), destination = square(to), finalPiece = destination?.querySelector('.piece-svg');
      if (!origin || !finalPiece) return 0;
      const a = origin.getBoundingClientRect(), b = destination.getBoundingClientRect(), dx = a.left-b.left, dy = a.top-b.top;
      let actor = finalPiece;
      if (promotion) {
        destination.insertAdjacentHTML('beforeend', svg(piece, 'moving-ghost'));
        actor = destination.lastElementChild; actor.setAttribute('aria-hidden', 'true');
      }
      destination.classList.add('piece-moving');
      const distance = Math.max(Math.abs(from%8-to%8), Math.abs(Math.floor(from/8)-Math.floor(to/8)));
      const duration = piece[1] === 'N' ? 360 : Math.min(400, 220+distance*25);
      if (promotion) {
        const total = duration+SPIN, shade = 'drop-shadow(0 2px 1px #0006) drop-shadow(0 6px 5px #0007)', ease = 'cubic-bezier(.25,.65,.3,1)';
        animate(actor, [
          {transform:`translate(${dx}px,${dy}px)`, filter:`${shade} brightness(1)`, easing:ease},
          {transform:'translate(0,0)', filter:`${shade} brightness(1)`, offset:duration/total, easing:'ease-out'},
          {transform:'translateY(-14%) scale(1.14)', filter:`${shade} brightness(1.4)`, offset:(duration+SPIN*.4)/total, easing:'ease-in'},
          {transform:'translateY(-14%) scale(1.14) rotateY(90deg)', filter:`${shade} brightness(2.4)`}
        ], total, () => { actor.remove(); destination.classList.remove('piece-moving'); }, 0, 'linear');
        animate(finalPiece, [
          {opacity:0, transform:'translateY(-14%) scale(1.14) rotateY(-90deg)', filter:`${shade} brightness(2.4)`},
          {opacity:1, transform:'translateY(-14%) scale(1.14) rotateY(-90deg)', filter:`${shade} brightness(2.4)`, offset:.01},
          {opacity:1, transform:'translateY(-6%) scale(1.22) rotateY(0deg)', filter:`${shade} brightness(1.5)`, offset:.45},
          {opacity:1, transform:'translateY(0) scale(.94)', filter:`${shade} brightness(1)`, offset:.75},
          {opacity:1, transform:'translateY(0) scale(1)', filter:`${shade} brightness(1)`}
        ], POP, () => {}, total, 'ease-out');
        const burst = document.createElement('span');
        burst.className = 'promotion-burst'; burst.setAttribute('aria-hidden', 'true'); destination.appendChild(burst);
        animate(burst, [{opacity:0, transform:'scale(.3)'}, {opacity:1, transform:'scale(.9)', offset:.25}, {opacity:0, transform:'scale(1.9)'}], 620, () => burst.remove(), total, 'ease-out');
        for (let i = 0; i < 8; i++) {
          const spark = document.createElement('span'), angle = i*Math.PI/4 + Math.PI/8, reach = b.width*(.62 + (i%2)*.16);
          spark.className = 'promotion-spark'; spark.setAttribute('aria-hidden', 'true'); destination.appendChild(spark);
          animate(spark, [
            {opacity:0, transform:'translate(-50%,-50%) scale(.4)'},
            {opacity:1, transform:`translate(calc(-50% + ${Math.cos(angle)*reach*.45}px),calc(-50% + ${Math.sin(angle)*reach*.45}px)) scale(1.2) rotate(45deg)`, offset:.3},
            {opacity:0, transform:`translate(calc(-50% + ${Math.cos(angle)*reach}px),calc(-50% + ${Math.sin(angle)*reach}px)) scale(.3) rotate(140deg)`}
          ], 640, () => spark.remove(), total, 'ease-out');
        }
        setTimeout(() => window.ClassGameSfx?.play('bell'), total);
        return total+POP;
      }
      const frames = [{transform:`translate(${dx}px,${dy}px)`}];
      if (piece[1] === 'N') frames.push({transform:`translate(${Math.abs(dx)>Math.abs(dy)?0:dx}px,${Math.abs(dy)>Math.abs(dx)?0:dy}px) scale(1.08)`, offset:.65});
      frames.push({transform:'translate(0,0)'});
      animate(actor, frames, duration, () => destination.classList.remove('piece-moving'));
      return duration;
    }
    const duration = travel(move.from, move.to, piece, !!move.promotion);
    tasks[0]?.animation.finished.then(sound, () => {});
    if (move.castle) {
      const rank = Math.floor(move.from/8)*8;
      travel(rank+(move.castle==='K'?7:0), rank+(move.castle==='K'?5:3), piece[0]+'R');
    }
    if (isCapture) {
      const target = square(capturedAt);
      target.insertAdjacentHTML('beforeend', svg(captured, 'capture-ghost'));
      const ghost = target.lastElementChild; ghost.setAttribute('aria-hidden', 'true');
      // Keep the victim on the board until the attacker arrives.
      animate(ghost, [{opacity:1,transform:'translateY(0) scale(1)'},{opacity:1,transform:'translateY(-5px) scale(1.12)',offset:.25},{opacity:0,transform:'translateY(-22px) scale(.5)'}], 300, () => ghost.remove(), duration);
      const impact = document.createElement('span');
      impact.className = 'capture-impact'; impact.setAttribute('aria-hidden', 'true'); target.appendChild(impact);
      animate(impact, [{opacity:0,transform:'scale(.6)'},{opacity:1,transform:'scale(1)',offset:.18},{opacity:0,transform:'scale(1.5)'}], 340, () => impact.remove(), duration);
    }
    return {finished:Promise.all(tasks.map(t=>t.animation.finished.catch(()=>{}))), cancel:()=>tasks.forEach(t=>t.cleanup())};
  }
  window.ClassChessMotion = {play};
})();
