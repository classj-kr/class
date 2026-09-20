(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.VoyageCityIcons = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Stylized architecture, not a reconstruction of individual monuments.
  const STYLES = {
    mediterranean: ['지중해·이베리아', '#edd6a3', '#bd684c'],
    european: ['서유럽', '#e0c9a0', '#687d91'],
    northern: ['북유럽', '#d2b68a', '#994d42'],
    eastern: ['동유럽', '#eee0bc', '#729780'],
    islamic: ['서아시아·북아프리카', '#e9cf9b', '#60a29c'],
    indian: ['인도', '#e6bb84', '#c77b55'],
    southeast: ['동남아시아', '#e9c786', '#c49042'],
    chinese: ['중국', '#e4be90', '#b65f45'],
    korean: ['한국', '#e9ddbd', '#617e85'],
    japanese: ['일본', '#eee5ca', '#667b89'],
    sahel: ['서아프리카 사헬', '#cc9767', '#ad7049'],
    african: ['아프리카 내륙', '#b68a62', '#d2b778'],
    swahili: ['동아프리카 해안', '#e7dec0', '#6c9b91'],
    american: ['중앙아메리카', '#d7c59b', '#9a9b71'],
    andean: ['안데스', '#c8b99c', '#a77753'],
    steppe: ['중앙아시아 초원', '#e8dabc', '#a97655'],
    tibetan: ['티베트', '#eee1c3', '#aa5140']
  };
  const REGIONS = {
    '이베리아': 'mediterranean', '이탈리아': 'mediterranean', '발칸': 'mediterranean',
    '프랑스': 'european', '네덜란드': 'european', '독일': 'european', '브리튼': 'european',
    '북유럽': 'northern', '동유럽': 'eastern', '북아프리카': 'islamic',
    '흑해': 'islamic', '근동': 'islamic', '중동': 'islamic', '중앙아시아': 'islamic',
    '인도': 'indian', '동남아시아': 'southeast', '동북아시아': 'chinese',
    '서아프리카': 'african', '동아프리카': 'swahili', '서인도제도': 'mediterranean',
    '중앙아메리카': 'american', '남동아메리카': 'mediterranean', '남서아메리카': 'andean'
  };
  // Region boundaries do not always follow architecture; keep exceptions explicit.
  const OVERRIDES = {
    original_city_085: 'tibetan', original_city_082: 'eastern',
    original_city_138: 'mediterranean', original_city_137: 'mediterranean', original_city_136: 'mediterranean',
    original_city_135: 'sahel', original_city_132: 'sahel', original_city_131: 'sahel',
    original_city_130: 'sahel', original_city_129: 'sahel', original_city_128: 'sahel',
    original_city_120: 'african', original_city_114: 'african',
    original_city_113: 'sahel', sennar: 'sahel', harar: 'islamic',
    original_city_007: 'andean'
  };
  function appearance(city = {}) {
    let culture = STYLES[city.iconCulture] ? city.iconCulture : OVERRIDES[city.id];
    if (!culture) culture = ({ KR: 'korean', JP: 'japanese', MN: 'steppe' })[city.countryCode];
    if (!culture) culture = REGIONS[city.originalRegion || city.region] || 'european';
    const size = Math.min(3, Math.max(1, Math.round(Number(city.originalCitySize) || 2)));
    // Use verified access, never coastline proximity or the legacy "port" category.
    return { culture, size, port: city.canEnterFromSea === true && city.verifiedSeaAccess !== false };
  }
  function metrics(city, zoom = 1) {
    const style = appearance(city);
    // Size tiers describe game cities, NOT measured area or modern population.
    // A metropolis expands in footprint as well as height. Limit screen growth to
    // keep harbors readable on phones and preserve nearby coastlines when zoomed in.
    const scale = [0, .78, 1, 1.2][style.size] * Math.max(.72, Math.min(1.4, Math.sqrt(Math.max(.1, zoom))));
    return { ...style, scale, left: -20 * scale, right: (style.port ? 26 : 20) * scale,
      top: -28 * scale, bottom: 10 * scale, labelY: -31 * scale };
  }
  function paint(ctx, style) {
    const [label, wall, roof] = STYLES[style.culture];
    const ink = '#302c29', light = '#fff0cb';
    ctx.lineWidth = 1.15; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    function poly(points, fill, stroke = ink) {
      ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = stroke; ctx.stroke();
    }
    function rect(x, y, w, h, fill = wall) { poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]], fill); }
    function line(points, color = ink, width = 1) {
      ctx.beginPath(); points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke(); ctx.lineWidth = 1.15;
    }
    function dome(x, y, radius, fill = roof) {
      ctx.beginPath(); ctx.arc(x, y, radius, Math.PI, 0); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = ink; ctx.stroke();
    }
    function house(x, y, w = 10, h = 9) {
      rect(x,y-h,w,h); poly([[x-1,y-h],[x+w/2,y-h-5],[x+w+1,y-h]],roof);
      rect(x+w/2-1,y-4,2,4,ink);
    }
    function eaves(x,y,w,color=roof) {
      poly([[x-w/2-2,y-2],[x-w/2+2,y],[x,y-6],[x+w/2-2,y],[x+w/2+2,y-2],[x+w/2,y+3],[x-w/2,y+3]],color);
    }
    // The low stone plinth anchors the footprint at the city's map coordinate.
    ctx.fillStyle = '#07141a55'; ctx.beginPath(); ctx.ellipse(0,5,19,4,0,0,Math.PI*2); ctx.fill();
    poly([[-19,1],[0,-5],[19,1],[14,6],[-14,6]], '#b8a780', '#f4e6bf');
    if(style.size >= 2) { house(-16,2,9,7); house(7,2,9,9); }
    if(style.size >= 3) { house(-18,-4,9,9); house(9,-4,9,11); }
    switch (style.culture) {
      case 'chinese': case 'korean': case 'japanese': {
        rect(-8,-11,16,14); rect(-6,-10,2,13,roof); rect(4,-10,2,13,roof);
        eaves(0,-13,23); rect(-2,-4,4,7,ink);
        if(style.culture !== 'korean') { rect(-5,-19,10,5); eaves(0,-21,15); }
        if(style.culture === 'japanese') line([[0,-27],[0,-24]],light,1.5);
        if(style.culture === 'chinese') line([[-8,-12],[8,-12]],'#edc96b',1.5);
        break;
      }
      case 'islamic': case 'swahili': {
        rect(-9,-10,18,13); dome(0,-10,9); rect(-2,-3,4,6,ink);
        rect(11,-19,3,20); dome(12.5,-19,2.5); line([[12.5,-25],[12.5,-22]],light);
        if(style.culture === 'swahili') { rect(-13,-7,5,10); line([[-8,-8],[8,-8]],light); }
        break;
      }
      case 'eastern': {
        rect(-7,-12,14,15); rect(-4,-17,8,5);
        poly([[-5,-17],[-6,-21],[0,-27],[6,-21],[5,-17]],roof);
        rect(-2,-3,4,6,ink); line([[0,-26],[0,-28]],light); break;
      }
      case 'indian': {
        rect(-9,-8,18,11); poly([[-7,-8],[-5,-15],[-3,-20],[0,-25],[3,-20],[5,-15],[7,-8]],roof);
        for(let y=-7;y>=-17;y-=5) line([[-5,y],[5,y]],light);
        rect(-2,-3,4,6,ink); break;
      }
      case 'southeast': {
        rect(-8,-8,16,11); eaves(0,-10,22); eaves(0,-15,15); eaves(0,-20,9);
        line([[0,-26],[0,-23]],light,1.5); rect(-2,-3,4,6,ink); break;
      }
      case 'sahel': {
        poly([[-12,3],[-10,-13],[-5,-13],[-3,3]],wall);
        poly([[-4,3],[-3,-21],[3,-21],[5,3]],wall);
        poly([[4,3],[6,-13],[11,-13],[13,3]],wall);
        for(let y=-16;y<0;y+=5) line([[-5,y],[5,y]],roof,2);
        rect(-1,-3,3,6,ink); break;
      }
      case 'african': {
        rect(-9,-8,18,11); poly([[-12,-8],[0,-21],[12,-8]],roof);
        line([[0,-18],[-5,-9]],light); rect(-2,-3,4,6,ink);
        if(style.size===3) poly([[-17,4],[-17,-2],[17,-2],[17,4]],wall);
        break;
      }
      case 'american': {
        for(let i=0;i<4;i++) rect(-13+i*3,-2-i*5,26-i*6,5,wall);
        rect(-4,-24,8,7,roof); line([[0,-17],[0,2]],light,2); break;
      }
      case 'andean': {
        rect(-13,-9,26,12); house(-7,1,14,13);
        line([[-13,-5],[13,-5]],roof); line([[-11,0],[-11,-5]],roof); break;
      }
      case 'steppe': {
        rect(-11,-7,22,10); dome(0,-7,11,wall); rect(-2,-3,4,6,roof);
        line([[-10,-6],[10,-6]],roof,2); line([[0,-18],[0,-22]],roof); break;
      }
      case 'tibetan': {
        poly([[-12,3],[-9,-17],[9,-17],[12,3]],wall); rect(-7,-22,14,6,roof);
        rect(-2,-4,4,7,ink); for(const x of [-6,0,6]) rect(x-1,-13,2,3,ink); break;
      }
      default: {
        house(-7,3,14,14);
        if(style.culture==='mediterranean') {
          rect(4,-20,5,22); rect(3,-23,7,4,roof); rect(5,-17,2,4,ink);
        } else if(style.culture==='northern') {
          poly([[-10,-11],[0,-26],[10,-11]],roof); line([[0,-22],[0,-12]],light);
        } else {
          rect(-4,-20,8,17); poly([[-6,-20],[0,-28],[6,-20]],roof); rect(-1,-17,2,4,light);
        }
      }
    }
    if(style.port) {
      // Draw an anchor, not a font glyph: consistent shape on every device.
      ctx.beginPath(); ctx.arc(18,2,8,0,Math.PI*2); ctx.fillStyle='#103945'; ctx.fill();
      ctx.strokeStyle='#9fe5ef'; ctx.lineWidth=1; ctx.stroke();
      ctx.beginPath(); ctx.arc(18,-2,1.5,0,Math.PI*2); ctx.stroke();
      line([[18,-.5],[18,7]],'#d4f7fa',1.5); line([[15,1],[21,1]],'#d4f7fa',1.5);
      ctx.beginPath(); ctx.moveTo(13.5,3); ctx.quadraticCurveTo(14,6.5,18,7);
      ctx.quadraticCurveTo(22,6.5,22.5,3); ctx.strokeStyle='#d4f7fa'; ctx.lineWidth=1.5; ctx.stroke();
      line([[13.5,5],[13.5,3],[15,3.5]],'#d4f7fa'); line([[21,3.5],[22.5,3],[22.5,5]],'#d4f7fa');
    }
  }
  const sprites = new Map();
  function draw(ctx, city, x, y, zoom = 1, selected = false) {
    const m = metrics(city, zoom);
    ctx.save(); ctx.translate(Math.round(x), Math.round(y)); ctx.scale(m.scale,m.scale);
    if(selected) {
      ctx.fillStyle='#ffdf7529'; ctx.strokeStyle='#ffdf75'; ctx.lineWidth=1.6;
      ctx.beginPath(); ctx.ellipse(0,2,22,9,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    }
    // Cache by appearance, not city: no new bitmap allocations during map movement.
    const key = `${m.culture}:${m.size}:${m.port}`;
    let sprite = sprites.get(key);
    if(!sprite && typeof document !== 'undefined') {
      sprite=document.createElement('canvas'); sprite.width=192; sprite.height=144;
      const s=sprite.getContext('2d'); s.scale(3,3); s.translate(28,32); paint(s,m); sprites.set(key,sprite);
    }
    if(sprite) { ctx.imageSmoothingEnabled=true; ctx.drawImage(sprite,-28,-32,64,48); }
    else paint(ctx,m);
    ctx.restore(); return m;
  }
  return { appearance, metrics, draw, styles: STYLES };
});
