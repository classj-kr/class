(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ChaseWorld=factory();})(globalThis,function(){
  'use strict';
  const WIDTH=1600,HEIGHT=1000;
  const points={a:[150,140],b:[500,90],c:[850,100],d:[1320,120],e:[1450,380],f:[1400,730],g:[1120,860],h:[770,900],i:[360,850],j:[130,680],k:[90,410],
    p0:[680,360],p1:[840,300],p2:[1000,390],p3:[1000,570],p4:[840,640],p5:[680,570],p6:[600,470],
    n0:[260,280],n1:[460,250],n2:[540,400],n3:[420,490],n4:[200,470],
    e0:[1130,240],e1:[1300,320],e2:[1250,510],e3:[1130,480],
    s0:[250,610],s1:[440,630],s2:[500,760],s3:[310,740],
    m0:[1110,640],m1:[1300,640],m2:[1220,760],m3:[1000,760],
    hideout:[170,750],jail:[1330,795]};
  const nodes=Object.fromEntries(Object.entries(points).map(([id,[x,y]])=>[id,{id,x,y}]));
  const painted={a:[150,110],b:[500,60],c:[835,65],d:[1310,100],e:[1470,370],f:[1420,735],g:[1120,880],h:[780,910],i:[360,850],j:[130,660],k:[90,400],n0:[258,265],n1:[465,240],n2:[535,390],n3:[425,460],n4:[205,450],p0:[675,350],p1:[835,290],p2:[1000,390],p3:[1000,565],p4:[825,625],p5:[660,560],p6:[600,465],e0:[1120,240],e1:[1310,310],e2:[1250,510],e3:[1120,470],s0:[245,600],s1:[445,615],s2:[495,745],s3:[310,725],m0:[1100,625],m1:[1310,625],m2:[1235,750],m3:[995,750],hideout:[235,800],jail:[1380,900]};
  for(const[id,[x,y]]of Object.entries(painted))Object.assign(nodes[id],{x,y});
  Object.assign(nodes.hideout,{x:265,y:865});
  Object.assign(nodes.jail,{x:1342,y:772.7});
  const edges=[];
  function link(a,b,kind='street'){edges.push({a,b,kind});}
  function route(ids,loop=false,kind='street'){ids=ids.split(' ');for(let i=1;i<ids.length;i++)link(ids[i-1],ids[i],kind);if(loop)link(ids.at(-1),ids[0],kind);}
  route('a b c d e f g h i j k',true);
  route('p0 p1 p2 p3 p4 p5 p6',true,'plaza');
  route('n0 n1 n2 n3 n4',true,'alley');route('a n0');route('n1 b');route('n4 k');route('n2 p0');route('n3 p6');route('c p1');
  route('e0 e1 e2 e3',true,'alley');route('d e0');route('e1 e');route('e0 p2');route('e3 p3');route('e2 e');
  route('s0 s1 s2 s3',true,'park');route('j s0');route('i s3');route('h s2');route('s0 n4');route('s1 n3');route('s1 p5');route('s2 p4');
  route('s0 s2',false,'bridge');
  route('m0 m1 m2 m3',true,'alley');route('e2 m1');route('p3 m0');route('f m1');route('g m2');route('h m3');route('p4 m3');route('i hideout');
  const jailRoad=edges.findIndex(e=>e.a==='f'&&e.b==='g');edges.splice(jailRoad,1);link('f','jail');link('jail','g');
  // Follow the bends painted into the road, including the ends of the wooden bridge.
  // These are walking waypoints, not extra intersections or scenery obstacles.
  function bend(a,b,points){
    const index=edges.findIndex(e=>e.a===a&&e.b===b||e.a===b&&e.b===a),edge=edges.splice(index,1)[0];
    let previous=a;
    points.forEach(([x,y],i)=>{const id=`${a}_${b}_${i}`;nodes[id]={id,x,y};link(previous,id,edge.kind);previous=id;});
    link(previous,b,edge.kind);
  }
  bend('a','b',[[245,65],[390,48]]);
  bend('j','i',[[170,745],[265,825]]);
  bend('s0','s2',[[295,633],[419,704]]);
  bend('m0','m1',[[1170,588]]);
  bend('i','hideout',[[320,858]]);
  const shops=[
    {id:'star',name:'스타박스',x:335,y:355,door:{x:350,y:484},edge:['n3','n4'],area:'광장 서쪽',look:'초록 차양',color:'#3c8464'},
    {id:'ediya',name:'이다야',x:360,y:170,door:{x:370,y:263.5},edge:['n0','n1'],area:'광장 북쪽',look:'파란 지붕',color:'#5a8eba'},
    {id:'giga',name:'기가커피',x:925,y:205,door:{x:918,y:344},edge:['p1','p2'],area:'광장 북쪽',look:'노란 건물',color:'#d4a437'},
    {id:'back',name:'백다방',x:1190,y:365,door:{x:1260,y:472},edge:['e1','e2'],area:'광장 동쪽',look:'빨간 지붕',color:'#b95641'},
    {id:'twosome',name:'투썸플레이트',x:570,y:555,door:{x:562,y:599.5},edge:['s1','p5'],area:'광장 서쪽',look:'분홍 차양',color:'#c9698c'},
    {id:'mac',name:'맥도날도',x:1170,y:680,door:{x:1165,y:760},edge:['m2','m3'],area:'광장 동쪽',look:'빨간 차양',color:'#cc5041'},
    {id:'lotte',name:'놋데리아',x:800,y:770,door:{x:827.5,y:865},edge:['h','m3'],area:'광장 남쪽',look:'파랑·노랑 차양',color:'#377ba2'}
  ];
  // Split a street at each shop entrance, keeping every destination on the walking network.
  for(const shop of shops){const index=edges.findIndex(e=>e.a===shop.edge[0]&&e.b===shop.edge[1]||e.a===shop.edge[1]&&e.b===shop.edge[0]);const edge=edges.splice(index,1)[0];shop.door=project(shop.door,nodes[edge.a],nodes[edge.b]);nodes[shop.id]={id:shop.id,...shop.door};link(edge.a,shop.id,edge.kind);link(shop.id,edge.b,edge.kind);}
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  function project(point,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((point.x-a.x)*dx+(point.y-a.y)*dy)/(dx*dx+dy*dy)));return{x:a.x+t*dx,y:a.y+t*dy};}
  function nearest(point){let best=null;for(const edge of edges){const p=project(point,nodes[edge.a],nodes[edge.b]);const d=distance(p,point);if(!best||d<best.distance)best={...p,edge,distance:d};}return best;}
  function path(from,to,options={}){
    const start=nearest(from),end=nearest(to),graph=new Map(Object.keys(nodes).map(id=>[id,[]])),coords={...nodes,$start:start,$end:end};
    graph.set('$start',[]);graph.set('$end',[]);
    function connect(a,b){const length=distance(coords[a],coords[b]),extra=options.cost?.(coords[a],coords[b])||0,cost=length+Math.max(0,extra);graph.get(a).push({id:b,cost});graph.get(b).push({id:a,cost});}
    for(const e of edges)connect(e.a,e.b);
    for(const id of[start.edge.a,start.edge.b])connect('$start',id);
    for(const id of[end.edge.a,end.edge.b])connect('$end',id);
    if(start.edge===end.edge)connect('$start','$end');
    const cost=new Map([['$start',0]]),previous=new Map(),pending=new Set(graph.keys());
    while(pending.size){let current=null;for(const id of pending)if(current===null||(cost.get(id)??Infinity)<(cost.get(current)??Infinity))current=id;
      if(!Number.isFinite(cost.get(current)))return[];if(current==='$end')break;pending.delete(current);
      for(const next of graph.get(current)){const value=cost.get(current)+next.cost;if(value<(cost.get(next.id)??Infinity)){cost.set(next.id,value);previous.set(next.id,current);}}
    }
    const ids=['$end'];while(ids[0]!=='$start')ids.unshift(previous.get(ids[0]));
    return ids.map(id=>({x:coords[id].x,y:coords[id].y})).filter((p,i,a)=>!i||distance(p,a[i-1])>.01);
  }
  function pathLength(points){return points.slice(1).reduce((sum,p,i)=>sum+distance(points[i],p),0);}
  return{WIDTH,HEIGHT,nodes,edges,shops,distance,nearest,path,pathLength};
});
