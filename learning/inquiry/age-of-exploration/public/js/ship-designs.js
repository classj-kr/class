(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.VoyageShips = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Map-scale illustrations of regional sailing traditions, not exact replicas.
  // Appearance only: physics, collision radius and race rewards are independent.
  const DESIGNS = Object.freeze({
    galleon: { name: '갤리온', region: '대표 원양항', hull: '#633c2a', deck: '#d6ae71', sail: '#f4e5bd', accent: '#a44633', length: 28, width: 8, cabin: 10, gunports: true,
      masts: [[15,26,19,'square'],[1,37,26,'square'],[-16,28,19,'lateen']] },
    cog: { name: '코그', region: '북유럽 연안항', hull: '#765334', deck: '#cfa875', sail: '#e9d8ad', accent: '#577b85', length: 20, width: 8, cabin: 4, squareBow: true,
      masts: [[1,29,27,'square']] },
    coaster: { name: '연안 범선', region: '이베리아 연안항', hull: '#997149', deck: '#d7b986', sail: '#f1e5c6', accent: '#ab784f', length: 19, width: 5, cabin: 2,
      masts: [[1,25,26,'lateen']] },
    canoe: { name: '대형 카누', region: '아메리카 현지 해안', hull: '#805534', deck: '#c19763', sail: '#e1cfa1', accent: '#a86741', length: 28, width: 4.5, cabin: 0, canoe: true,
      masts: [] },
    caravel: { name: '카라벨', region: '이베리아·대서양', hull: '#885331', deck: '#d1a471', sail: '#f5e6c1', accent: '#a74835', length: 23, width: 7, cabin: 5,
      masts: [[5,29,25,'lateen'],[-10,23,20,'lateen']] },
    carrack: { name: '카락', region: '서유럽·북유럽', hull: '#624331', deck: '#c49a68', sail: '#eee4ca', accent: '#496f8b', length: 24, width: 9, cabin: 8,
      masts: [[13,23,17,'square'],[0,34,25,'square'],[-15,24,15,'lateen']] },
    galley: { name: '갤리선', region: '지중해', hull: '#9a5938', deck: '#d8b57d', sail: '#f1dcab', accent: '#ad4935', length: 28, width: 5, cabin: 3, oars: true,
      masts: [[7,29,28,'lateen'],[-13,20,19,'lateen']] },
    dhow: { name: '다우', region: '이슬람권·인도양', hull: '#82512e', deck: '#d1a06a', sail: '#f6e1ac', accent: '#3b938b', length: 26, width: 6, cabin: 4,
      masts: [[5,32,32,'lateen'],[-13,21,19,'lateen']] },
    junk: { name: '정크선', region: '중국·베트남', hull: '#6b382c', deck: '#c89764', sail: '#c87b4d', accent: '#af4337', length: 23, width: 9, cabin: 6, squareBow: true,
      masts: [[11,25,18,'fan'],[-4,34,25,'fan'],[-17,21,15,'fan']] },
    hanseon: { name: '한선', region: '한국', hull: '#6c4930', deck: '#cfab77', sail: '#dcb581', accent: '#517d84', length: 23, width: 9, cabin: 4, squareBow: true,
      masts: [[7,30,19,'woven'],[-10,24,16,'woven']] },
    wasen: { name: '일본 연안선', region: '일본', hull: '#b0804b', deck: '#e0bd8a', sail: '#f5edd9', accent: '#566d85', length: 25, width: 7, cabin: 5,
      masts: [[2,34,28,'striped']] },
    jong: { name: '종선', region: '동남아시아', hull: '#885536', deck: '#cda76e', sail: '#d6ad69', accent: '#66866b', length: 26, width: 8, cabin: 5,
      masts: [[9,31,26,'tilted'],[-11,26,22,'tilted']] },
    coastal: { name: '아프리카 연안 돛배', region: '서아프리카', hull: '#614831', deck: '#b58d5b', sail: '#d9b97e', accent: '#b67145', length: 24, width: 5, cabin: 0,
      masts: [[1,28,29,'lateen']] },
    balsa: { name: '발사 뗏목선', region: '안데스 해안', hull: '#9b7b47', deck: '#d5b87a', sail: '#dbbf87', accent: '#9e6242', length: 20, width: 11, cabin: 2, raft: true,
      masts: [[2,29,25,'woven']] }
  });
  const REGION_TYPES = Object.freeze({
    '이베리아':'caravel', '프랑스':'carrack', '네덜란드':'carrack', '브리튼':'carrack',
    '독일':'carrack', '동유럽':'carrack', '북유럽':'carrack', '이탈리아':'galley', '발칸':'galley',
    '북아프리카':'dhow', '흑해':'dhow', '근동':'dhow', '중동':'dhow', '중앙아시아':'dhow',
    '인도':'dhow', '서아프리카':'coastal', '동아프리카':'dhow',
    '동남아시아':'jong', '동북아시아':'junk', '서인도제도':'caravel',
    '중앙아메리카':'caravel', '남동아메리카':'caravel', '남서아메리카':'balsa'
  });
  function validType(type) { return Object.hasOwn(DESIGNS, type); }
  function forPort(city = {}) {
    if (validType(city.shipType)) return city.shipType;
    if (city.countryCode === 'KR') return 'hanseon';
    if (city.countryCode === 'JP') return 'wasen';
    if (city.countryCode === 'VN') return 'junk';
    const region = city.originalRegion || city.region;
    if (region === '서아프리카' && ['PT','ES'].includes(city.countryCode)) return 'caravel';
    return REGION_TYPES[region] || 'caravel';
  }
  function design(type) { return DESIGNS[validType(type) ? type : 'caravel']; }
  function selection(roomType, mission, progress, resolveCity = () => null) {
    if (roomType !== 'race' || !mission || !progress) return null;
    let start;
    if (mission.kind === 'arrivalRace' && progress.selectedStartPlaceId) {
      start = mission.startOptions?.find(o => o.startPlace?.id === progress.selectedStartPlaceId)?.startPlace;
    } else if (mission.kind === 'startChoiceSet' && progress.selectedMissionId) {
      start = mission.startOptions?.find(o => o.id === progress.selectedMissionId)?.startPlace;
    }
    if (!start) return null;
    const city = resolveCity(start.id) || start;
    const type = forPort(city);
    const scale = Number(city.shipScale);
    return { type, originId: start.id, originName: start.name || '', name: design(type).name,
      scale: Number.isFinite(scale) ? Math.max(.8, Math.min(1.15,scale)) : 1 };
  }

  // Project a small 3-D wooden ship into eight map bearings. Masts stay vertical
  // while hulls turn; rotating a flat picture would put the sails on their side.
  function paint(ctx, type, direction) {
    const d = design(type), angle = direction * Math.PI / 4, c = Math.cos(angle), s = Math.sin(angle);
    const project = ([x,y,z=0]) => [x*c+y*s, (x*s-y*c)*.58-z*.86];
    const depth = ([x,y]) => x*s-y*c;
    const mix = (a,b,t) => a.map((v,i)=>v+(b[i]-v)*t);
    const edge = '#30291f';
    function path(points) { ctx.beginPath(); points.map(project).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y)); }
    function poly(points, fill, stroke=edge, width=.9) {
      path(points); ctx.closePath(); ctx.fillStyle=fill; ctx.fill();
      if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}
    }
    function line(points, color=edge, width=.8) { path(points);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke(); }
    function box(x,y,w,l,z,h,color) {
      const top=[[x-w/2,y-l/2,z+h],[x+w/2,y-l/2,z+h],[x+w/2,y+l/2,z+h],[x-w/2,y+l/2,z+h]];
      const faces=top.map((a,i)=>[a,top[(i+1)%4],[...top[(i+1)%4].slice(0,2),z],[a[0],a[1],z]]);
      faces.sort((a,b)=>depth(a[0])+depth(a[1])-depth(b[0])-depth(b[1]));
      for(const f of faces)poly(f,color);
      poly(top,d.deck);
    }
    ctx.lineJoin='round';ctx.lineCap='round';
    const L=d.length,W=d.width;
    if(d.oars)for(const sign of [-1,1])for(let y=-16;y<=15;y+=5){
      line([[sign*W,y,0],[sign*(W+10),y-4,-1]],'#342b22',2.2);
      line([[sign*(W+6),y-3,-1],[sign*(W+10),y-4,-1]],'#ddbd87',1.6);
    }
    let rim=d.squareBow ? [[-W*.65,L,1],[W*.65,L,1],[W,L*.5,0],[W,-L*.75,1],[W*.7,-L,4],[-W*.7,-L,4],[-W,-L*.75,1],[-W,L*.5,0]]
      : [[0,L,3],[W*.65,L*.7,1],[W,L*.2,0],[W*.85,-L*.7,1],[W*.6,-L,4],[-W*.6,-L,4],[-W*.85,-L*.7,1],[-W,L*.2,0],[-W*.65,L*.7,1]];
    if(d.raft) {
      for(let x=-W;x<=W;x+=3.8)box(x,0,3.5,L*2-Math.abs(x)*.35,-3,3,d.hull);
      for(const y of [-12,11])line([[-W,y,.5],[W,y,.5]],edge,1.3);
    } else {
      const bottom=rim.map(([x,y])=>[x*.72,y*.87,-5]);
      poly(bottom,'#382c24');
      const faces=rim.map((a,i)=>({points:[a,rim[(i+1)%rim.length],bottom[(i+1)%rim.length],bottom[i]],depth:(depth(a)+depth(rim[(i+1)%rim.length]))/2})).sort((a,b)=>a.depth-b.depth);
      for(const f of faces)poly(f.points,d.hull);
      poly(rim,d.deck);
      for(let x=-W*.65;x<=W*.65;x+=3.2)line([[x,-L*.7,1],[x,L*.58,1]],'#ab815666',.6);
      path(rim);ctx.closePath();ctx.strokeStyle='#edc98d';ctx.lineWidth=1.4;ctx.stroke();
      // Stern cabin and long bow spar distinguish the ocean-going hulls.
      if(d.cabin)box(0,-L*.65,W*1.35,L*.3,2,d.cabin,d.hull);
      if(['galleon','caravel','carrack','dhow','galley'].includes(type))line([[0,L-4,2],[0,L+7,5]],'#5c4029',1.8);
      if(type==='jong')line([[0,L,3],[0,L+2,10]],d.accent,2);
      if(type==='galleon') {
        box(0,-L*.77,W*1.25,6,10,5,d.hull);
        for(const side of [-1,1])for(let y=-12;y<=14;y+=6)box(side*W*.9,y,1.2,2.2,-2,2,'#28251f');
      }
      if(d.canoe) {
        for(let y=-17;y<=16;y+=6){
          line([[-W*.85,y,1],[W*.85,y,1]],'#e4bd83',1.8);
          const side=y%2===0?1:-1;
          line([[0,y,3],[side*(W+8),y-4,-1]],'#e7c28c',1.4);
          box(0,y,2.4,2.4,1,2.5,'#806342');
        }
        box(0,-3,4,5,1,2,'#b59661');
      }
      if(type==='wasen')poly([[-W,-L*.82,8],[0,-L*.86,11],[W,-L*.82,8],[W,-L*.5,8],[-W,-L*.5,8]],d.accent);
      if(type==='hanseon')line([[W*.7,-L*.8,3],[W*1.4,-L-7,-1]],'#d6b27d',2);
    }
    // Rigging and sails are sorted by their mast's map depth.
    const masts=[...d.masts].sort((a,b)=>depth([0,a[0]])-depth([0,b[0]]));
    for(const [y,h,w,rig] of masts){
      line([[0,y,1],[0,y,h+2]],'#443322',1.7);
      line([[0,y,h],[W*.8,y-7,1]],'#e2c99d99',.6);
      line([[0,y,h],[-W*.8,y+6,1]],'#e2c99d99',.6);
      let trim=(rig==='lateen'?Math.PI/2:0)+.3;
      // Trim sails slightly in an edge-on bearing, preserving their silhouette.
      if(Math.abs(Math.cos(trim)*c+Math.sin(trim)*s)<.45)trim+=.6;
      const u=[Math.cos(trim),Math.sin(trim)];
      const point=(span,z,billow=0)=>[span*u[0]+billow*(-u[1]),y+span*u[1]+billow*u[0],z];
      let shape;
      if(rig==='lateen')shape=[point(-w*.56,h),point(w*.57,h-7),point(w*.4,6)];
      else if(rig==='fan')shape=[point(-w*.43,h-5),point(w*.18,h+1),point(w*.6,h-3),point(w*.68,8),point(-w*.37,6)];
      else if(rig==='tilted')shape=[point(-w*.48,h-5),point(w*.48,h),point(w*.42,11),point(-w*.52,6)];
      else shape=[point(-w*.5,h-2),point(w*.5,h-2),point(w*.58,h-17,2),point(0,h-19,3),point(-w*.58,h-17,2)];
      const projected=shape.map(project),ys=projected.map(p=>p[1]);
      const grad=ctx.createLinearGradient(0,Math.min(...ys),0,Math.max(...ys));
      grad.addColorStop(0,'#fff0cf');grad.addColorStop(.24,d.sail);grad.addColorStop(1,rig==='fan'?'#a95638':'#bc9d6e');
      poly(shape,grad,'#644b31',.75);
      line([shape[0],shape[1]],'#60472e',1.25);
      if(rig==='fan')for(let k=1;k<=5;k++){const t=k/6;line([mix(shape[0],shape[4],t),mix(shape[2],shape[3],t)],'#633d29',.9)}
      else if(rig==='lateen')for(const t of [.32,.62])line([mix(shape[0],shape[1],t),mix(shape[0],shape[2],t)],'#9f815457',.65);
      else for(let k=1;k<=4;k++){
        const t=k/5;
        line([mix(shape[0],shape[1],t),mix(shape[shape.length-1],shape[2],t)],rig==='striped'?'#87776199':'#9d794455',.65);
      }
      const flagBase=[0,y,h+2];
      poly([flagBase,[4,y-1,h+1],[0,y,h-1]],d.accent,edge,.5);
    }
  }
  const sprites=new Map();
  function draw(ctx,type,dir,x,y,scale=1,options={}) {
    type=validType(type)?type:'caravel';
    dir=Number.isFinite(dir)?((Math.round(dir)%8)+8)%8:0;
    ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
    if(options.moving){
      ctx.save();ctx.rotate(dir*Math.PI/4);ctx.strokeStyle='#b9edf096';ctx.lineWidth=1.3;
      for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-4-i*2,18+i*5);ctx.quadraticCurveTo(0,21+i*5,4+i*2,18+i*5);ctx.stroke()}
      ctx.restore();
    }
    ctx.fillStyle='#041b2855';ctx.beginPath();ctx.ellipse(0,3,19,8,0,0,Math.PI*2);ctx.fill();
    if(options.mine){ctx.strokeStyle='#f6df91bb';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,3,22,10,0,0,Math.PI*2);ctx.stroke()}
    const key=type+':'+dir;let sprite=sprites.get(key);
    if(!sprite&&typeof document!=='undefined'){
      sprite=document.createElement('canvas');sprite.width=288;sprite.height=264;
      const s=sprite.getContext('2d');s.scale(3,3);s.translate(48,58);paint(s,type,dir);sprites.set(key,sprite);
    }
    if(sprite){ctx.imageSmoothingEnabled=true;ctx.drawImage(sprite,-48,-58,96,88)}else paint(ctx,type,dir);
    ctx.restore();
  }
  return { designs: DESIGNS, validType, design, forPort, selection, draw };
});
