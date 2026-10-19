// Move labels, never the geographic point. Each displaced label keeps a leader.
export function placeLabels(items, width, height, blocked = []) {
  const occupied = blocked.slice(), gap = 6;
  const overlap = (a,b) => Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)) * Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
  return items.map(item => {
    const {x,y,w,h,region} = item;
    const candidates = region ? [[-w/2,-h/2]] : [[-w/2,-h-9],[10,-h/2],[-w-10,-h/2],[-w/2,10]];
    for(const distance of [h+16,2*h+24,3*h+30]) candidates.push([-w/2,-h-distance],[12,-h-distance],[-w-12,-h-distance],[-w/2,distance],[12,distance],[-w-12,distance]);
    let best;
    const consider = ([dx,dy]) => {
      const px=Math.max(gap,Math.min(width-w-gap,x+dx)),py=Math.max(gap,Math.min(height-h-gap,y+dy));
      const rect={x:px,y:py,w,h};
      const covered=occupied.reduce((n,r)=>n+overlap({x:px-gap/2,y:py-gap/2,w:w+gap,h:h+gap},r),0);
      const distance=Math.hypot(px-x+w/2,py-y+h/2);
      if(!best||covered<best.covered||(covered===best.covered&&distance<best.distance))best={...rect,covered,distance};
    };
    candidates.forEach(consider);
    if(best.covered>0){
      // A growing explanation card can be taller than all nearby candidates.
      // Search obstacle edges across the viewport before accepting overlap.
      const xs=[gap,width-w-gap,x-w/2],ys=[gap,height-h-gap,y-h/2];
      for(const r of occupied){xs.push(r.x-w-gap,r.x+r.w+gap);ys.push(r.y-h-gap,r.y+r.h+gap);}
      for(const px of xs)for(const py of ys)consider([px-x,py-y]);
    }
    occupied.push(best);
    const dx=best.x-x,dy=best.y-y;
    return {dx,dy,lineX:Math.max(dx,Math.min(0,dx+w)),lineY:Math.max(dy,Math.min(0,dy+h))};
  });
}
