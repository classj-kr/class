(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./baduk-rules.js'));
  else root.BadukCoachAI=factory(root.BadukCoachRules);
})(typeof globalThis!=='undefined'?globalThis:this,function(R){
  'use strict';
  const LEVELS=Object.freeze({
    beginner:{name:'레벨 1',depth:1,width:5,nodes:100,ms:180,practice:true},
    level2:{name:'레벨 2',depth:1,width:7,nodes:300,ms:300},
    intermediate:{name:'레벨 3',depth:2,width:8,nodes:1000,ms:650},
    level4:{name:'레벨 4',depth:3,width:10,nodes:2500,ms:1000},
    advanced:{name:'레벨 5',depth:3,width:14,nodes:5000,ms:1500}
  });
  const HINT=Object.freeze({depth:4,width:16,nodes:12000,ms:3000,practice:false});
  // A conservative local eye filter, not a life-and-death solver.
  function ownEye(s,index){
    if(!R.neighbors(index,s.size).every(i=>s.board[i]===s.color))return false;
    const row=Math.floor(index/s.size),col=index%s.size,diagonals=[];
    for(const dr of [-1,1])for(const dc of [-1,1])if(row+dr>=0&&row+dr<s.size&&col+dc>=0&&col+dc<s.size)diagonals.push((row+dr)*s.size+col+dc);
    const friendly=diagonals.filter(i=>s.board[i]===s.color).length;
    return diagonals.length===4?friendly>=3:friendly===diagonals.length;
  }
  function atari(s,color){return R.groups(s.board,s.size,color).filter(g=>g.liberties.length===1);}
  function capturable(s,color){
    return atari(s,color).filter(g=>R.placement(s,g.liberties[0],3-color));
  }
  function influence(s,color){
    const distances=side=>{
      const d=Array(s.board.length).fill(99),queue=[];
      s.board.forEach((v,i)=>{if(v===side){d[i]=0;queue.push(i);}});
      for(let p=0;p<queue.length;p++){const i=queue[p];if(d[i]>=3)continue;for(const n of R.neighbors(i,s.size))if(!s.board[n]&&d[n]>d[i]+1){d[n]=d[i]+1;queue.push(n);}}
      return d;
    };
    const own=distances(color),other=distances(3-color);let value=0;
    for(let i=0;i<own.length;i++)if(!s.board[i]){if(own[i]<other[i])value+=4-own[i];if(other[i]<own[i])value-=4-other[i];}
    return value;
  }
  function evaluate(s,color){
    if(s.ended)return s.winner===0?0:s.winner===color?100000:-100000;
    if(s.scoring){const score=R.preview(s);return (color===1?1:-1)*(score.black-score.white)*35;}
    let value=(s.captures[color-1]-s.captures[2-color])*(s.mode==='capture'?160:10);
    for(const g of R.groups(s.board,s.size)){
      const sign=g.color===color?1:-1;
      value+=sign*(g.stones.length*30+Math.min(g.liberties.length,6)*5-(g.liberties.length===1?g.stones.length*95:0));
    }
    if(s.mode!=='capture')value+=influence(s,color)*3+(color===2?1:-1)*(R.MODES[s.mode].komi||0)*15;
    return value;
  }
  function ranked(s){
    const endangered=capturable(s,s.color),rows=[];
    for(const index of R.legal(s)){
      const next=R.play(s,index),g=R.group(next.board,s.size,index);
      const saved=endangered.filter(old=>old.stones.every(i=>next.board[i]===s.color)&&R.group(next.board,s.size,old.stones[0]).liberties.length>1).reduce((n,g)=>n+g.stones.length,0);
      const immediateLoss=capturable(next,s.color).reduce((n,g)=>Math.max(n,g.stones.length),0);
      const losesGame=s.mode==='capture'&&next.captures[2-s.color]+immediateLoss>=3;
      const center=(s.size-1)/2,central=4-Math.abs(index%s.size-center)-Math.abs(Math.floor(index/s.size)-center);
      const eye=ownEye(s,index)&&!next.captured.length;
      const score=evaluate(next,s.color)+saved*75+next.captured.length*35+central*2-(g.liberties.length===1?80:0)-(eye?180:0);
      rows.push({index,next,score,eye,losesGame});
    }
    rows.sort((a,b)=>b.score-a.score||a.index-b.index);
    const wins=rows.filter(r=>r.next.ended&&r.next.winner===s.color);if(wins.length)return wins;
    let safe=rows.filter(r=>!r.losesGame);if(!safe.length)safe=rows;
    // Keep some placement options in standard play; a player can always pass.
    if(s.mode==='standard'&&(!safe.length||safe.every(r=>r.eye))){
      const next=R.play(s,-1);return [{index:-1,next,score:evaluate(next,s.color)},...safe];
    }
    return safe.length?safe:[{index:-1,next:R.play(s,-1),score:0}];
  }
  function choose(s,level='beginner',options={}){
    if(s.ended||s.scoring)return null;
    const settings={...(LEVELS[level]||LEVELS.beginner),...options},start=Date.now(),stop={},random=options.random||Math.random;
    let nodes=0,depth=1,roots=ranked(s),best=roots[0];
    if(settings.practice){
      const choices=roots.filter(r=>r.score>=best.score-12).slice(0,3);
      best=choices[Math.min(choices.length-1,Math.floor(random()*choices.length))];
    }else{
      function search(position,left,alpha,beta){
        if(++nodes>settings.nodes||Date.now()-start>=settings.ms)throw stop;
        if(!left||position.ended||position.scoring)return evaluate(position,s.color);
        const maximizing=position.color===s.color;let value=maximizing?-Infinity:Infinity;
        for(const row of ranked(position).slice(0,settings.width)){
          const score=search(row.next,left-1,alpha,beta);
          value=maximizing?Math.max(value,score):Math.min(value,score);
          if(maximizing)alpha=Math.max(alpha,value);else beta=Math.min(beta,value);
          if(beta<=alpha)break;
        }
        return value;
      }
      for(let d=2;d<=settings.depth;d++){
        let candidate=best,score=-Infinity;
        try{
          for(const row of roots.slice(0,settings.width)){
            const value=search(row.next,d-1,-Infinity,Infinity)+(row.eye?-180:0);
            if(value>score){score=value;candidate=row;}
          }
          best=candidate;depth=d;
          roots=[best,...roots.filter(r=>r!==best)];
        }catch(error){if(error!==stop)throw error;break;}
      }
    }
    return {index:best.index,reason:explain(s,best.index),depth,nodes};
  }
  const chooseHint=(state,options={})=>choose(state,'advanced',{...HINT,...options});
  function explain(s,index){
    const next=R.play(s,index);if(!next)return '이곳에는 둘 수 없어요.';
    if(index===-1)return next.scoring?'연속 패스로 사석을 확인할 차례예요. 죽은 돌이 확실하지 않으면 대국을 계속하세요.':s.mode!=='standard'?'둘 수 있는 자리가 없어 차례를 넘겨요.':'차례를 넘기는 후보예요. 내 집 안을 채우기 전에 더 둘 곳이 있는지 살펴보세요.';
    const parts=[`${R.coord(index,s.size)}에 두어요.`],g=R.group(next.board,s.size,index);
    if(next.ended&&next.winner===s.color&&s.mode==='capture')parts.push('잡은 돌이 3개 이상이 되어 승리해요.');
    else if(next.captured.length)parts.push(`상대 돌 ${next.captured.length}개의 마지막 활로를 막아 따내요.`);
    const saved=capturable(s,s.color).filter(old=>old.stones.every(i=>next.board[i]===s.color)&&R.group(next.board,s.size,old.stones[0]).liberties.length>1);
    if(saved.length)parts.push(`단수에 몰린 내 돌이 바로 잡힐 위험을 줄여요. ${saved.map(old=>`${R.coord(old.stones[0],s.size)}의 돌 덩어리는 활로가 ${R.group(next.board,s.size,old.stones[0]).liberties.length}곳이에요.`).join(' ')}`);
    const adjacent=R.groups(s.board,s.size,s.color).filter(old=>old.stones.some(i=>R.neighbors(index,s.size).includes(i)));
    if(adjacent.length>1)parts.push(`떨어져 있던 내 돌 ${adjacent.length}덩어리를 연결해요.`);
    const targets=capturable(next,3-s.color);
    if(targets.length)parts.push(`상대 돌 ${targets.reduce((n,g)=>n+g.stones.length,0)}개의 활로가 한 곳인 단수를 만들거나 유지해요.`);
    if(g.liberties.length===1)parts.push(`주의: 둔 돌도 활로가 ${R.coord(g.liberties[0],s.size)} 한 곳뿐이에요. 상대가 잡을 수 있는지 확인하세요.`);
    if(parts.length===1)parts.push(`둔 돌 덩어리의 활로는 ${g.liberties.length}곳이에요. 주변 돌과 연결하고 상대가 끊을 곳도 살펴보세요.`);
    if(next.ended&&next.scores)parts.push(`대국이 끝났어요. 흑 ${next.scores.black}점, 백 ${next.scores.white}점이에요.`);
    return parts.join(' ');
  }
  function opponentView(before,index){
    const next=R.play(before,index);if(!next||next.ended||next.scoring)return null;
    const groups=capturable(next,next.color),targets=groups.flatMap(g=>g.stones);
    return {title:groups.length?'내 돌이 단수예요':'연결과 활로 살피기',
      summary:index===-1?'AI가 패스했어요.':`AI가 ${R.coord(index,next.size)}에 두었어요.${next.captured.length?` 내 돌 ${next.captured.length}개를 잡았어요.`:''}`,
      danger:groups.length?`빨간 테두리의 돌은 활로가 한 곳뿐이에요. ${[...new Set(groups.flatMap(g=>g.liberties))].map(i=>R.coord(i,next.size)).join(', ')}을 살펴보세요.`:'',
      response:groups.length?'활로를 늘리거나 다른 돌과 연결해 보세요. 공격하는 상대 돌을 먼저 잡는 방법도 있어요.':'내 돌의 활로와 끊어진 곳부터 확인해 보세요.',targets,targetLabel:'단수에 몰린 내 돌'};
  }
  function review(s,index){
    const next=R.play(s,index);if(!next||next.scoring||next.ended)return null;
    const danger=capturable(next,s.color);
    if(!danger.length)return null;
    const loss=Math.max(...danger.map(g=>g.stones.length));
    const alternative=ranked(s).find(row=>row.index!==index&&(!row.next.ended||row.next.winner===s.color)&&capturable(row.next,s.color).every(g=>g.stones.length<loss));
    if(!alternative)return null;
    return {alternative:alternative.index,text:`이 수 뒤에 내 돌 ${loss}개가 다음 한 수에 잡힐 수 있어요. ${R.coord(alternative.index,s.size)}은 그 즉시 위험을 줄이는 후보예요. ${explain(s,alternative.index)}`};
  }
  return {LEVELS,HINT,ownEye,atari,capturable,evaluate,choose,chooseHint,explain,opponentView,review};
});
