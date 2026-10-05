/* Shared movement paths and timing for online Janggi and AI lessons. */
(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory();
  else root.JanggiMotion=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function route(move){
    const from={x:move.fromX,y:move.fromY},to={x:move.toX,y:move.toY};
    const dx=to.x-from.x,dy=to.y-from.y,sx=Math.sign(dx),sy=Math.sign(dy);
    if(move.type==='horse')return Math.abs(dx)===2?[from,{x:from.x+sx,y:from.y},to]:[from,{x:from.x,y:from.y+sy},to];
    if(move.type==='elephant')return Math.abs(dx)===3?
      [from,{x:from.x+sx,y:from.y},{x:from.x+sx*2,y:from.y+sy},to]:
      [from,{x:from.x,y:from.y+sy},{x:from.x+sx,y:from.y+sy*2},to];
    return [from,to];
  }
  function duration(move){
    const distance=Math.max(Math.abs(move.toX-move.fromX),Math.abs(move.toY-move.fromY));
    return move.type==='elephant'?360:move.type==='horse'?280:Math.min(320,150+distance*28);
  }
  function face(piece){
    if(piece.type==='king')return piece.side==='cho'?'楚':'漢';
    if(piece.type==='soldier')return piece.side==='cho'?'卒':'兵';
    return {rook:'車',cannon:'包',horse:'馬',elephant:'象',guard:'士'}[piece.type];
  }
  function play(piece,board,move,display=(x,y)=>({x,y})){
    if(!piece?.animate||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return null;
    const destination=display(move.toX,move.toY),path=route(move).map(p=>display(p.x,p.y));
    const frames=path.map((p,index)=>({
      transform:`translate(${(p.x-destination.x)*board.clientWidth/9}px, ${(p.y-destination.y)*board.clientHeight/10}px)`,
      offset:index/(path.length-1)
    }));
    const cell=piece.parentElement;
    piece.classList.add('path-moving');cell?.classList.add('motion-cell');
    const travel=duration(move),animation=piece.animate(frames,{duration:travel,easing:'linear'}),animations=[animation];
    let victim=null,impact=null;
    if(move.captured&&cell){
      victim=document.createElement('span');victim.className=`piece ${move.captured.side} ${move.captured.type} capture-ghost`;
      victim.textContent=face(move.captured);victim.setAttribute('aria-hidden','true');cell.appendChild(victim);
      impact=document.createElement('span');impact.className='capture-impact';impact.setAttribute('aria-hidden','true');cell.appendChild(impact);
      animations.push(piece.animate([{transform:'scale(1)'},{transform:'scale(1.12)',offset:.35},{transform:'scale(1)'}],{delay:travel,duration:180,easing:'ease-out'}));
      animations.push(victim.animate([{opacity:1,transform:'translateY(0) scale(1)'},{opacity:1,transform:'translateY(-8px) scale(1.08)',offset:.25},{opacity:0,transform:'translateY(-30px) scale(.45)'}],{delay:travel,duration:320,fill:'forwards',easing:'ease-out'}));
      animations.push(impact.animate([{opacity:0,transform:'scale(.7)'},{opacity:1,offset:.2},{opacity:0,transform:'scale(1.35)'}],{delay:travel,duration:300,fill:'both',easing:'ease-out'}));
    }
    const cleanup=()=>{piece.classList.remove('path-moving');cell?.classList.remove('motion-cell');victim?.remove();impact?.remove();};
    return {animation,finished:Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(cleanup),cancel:()=>{animations.forEach(a=>a.cancel());cleanup();}};
  }
  return {route,duration,face,play};
});
