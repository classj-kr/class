(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./realtime-world'));else root.ChaseSteering=factory(root.ChaseWorld);})(globalThis,function(W){
  'use strict';
  const adjacent=new Map(Object.keys(W.nodes).map(id=>[id,[]]));
  for(const edge of W.edges){adjacent.get(edge.a).push(edge.b);adjacent.get(edge.b).push(edge.a);}
  const dot=(from,to,input)=>{const length=W.distance(from,to);return length?((to.x-from.x)*input.x+(to.y-from.y)*input.y)/length:0;};
  function create(point){const {edge}=W.nearest(point);return{a:edge.a,b:edge.b,toward:null};}
  function exit(node,input){
    let best=null,score=.15;
    for(const id of adjacent.get(node.id)){const alignment=dot(node,W.nodes[id],input);if(alignment>score){score=alignment;best=id;}}
    return best;
  }
  // Consume distance on connected road segments. Direction chooses an exit at a
  // junction; it never changes the graph or cuts diagonally through a building.
  function advance(player,nav,input,budget){
    for(let steps=0;budget>1e-6&&steps<32;steps++){
      const a=W.nodes[nav.a],b=W.nodes[nav.b];
      const node=W.distance(player,a)<1e-5?a:W.distance(player,b)<1e-5?b:null;
      if(node){
        const next=exit(node,input);if(!next){nav.toward=null;break;}
        nav.a=node.id;nav.b=next;nav.toward=next;
      }else if(!nav.toward){
        const alignment=dot(a,b,input);
        // Starting with a perpendicular input queues a turn at the nearer end.
        // This also covers releasing one key just before pressing the next.
        nav.toward=Math.abs(alignment)<.15?(W.distance(player,a)<W.distance(player,b)?nav.a:nav.b):alignment>0?nav.b:nav.a;
      }else if(dot(player,W.nodes[nav.toward],input)<-.7){
        // A deliberate opposite input reverses immediately, even between nodes.
        nav.toward=nav.toward===nav.a?nav.b:nav.a;
      }
      const target=W.nodes[nav.toward],distance=W.distance(player,target),step=Math.min(budget,distance);
      if(distance<1e-6)break;
      player.x+=(target.x-player.x)*step/distance;player.y+=(target.y-player.y)*step/distance;budget-=step;
    }
  }
  return{create,advance};
});
