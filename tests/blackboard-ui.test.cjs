const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs/promises');
const { pathToFileURL } = require('node:url');
const { chromium } = require('../game-hub-server/node_modules/playwright');
let browser;
const url = pathToFileURL(path.resolve(__dirname, '../classtools/blackboard.html')).href;
const output = path.resolve(__dirname, '../outputs/blackboard');
test.before(async () => {
  browser = await chromium.launch({headless:true, ...(process.platform === 'win32' ? {channel:'msedge'} : {})});
  await fs.mkdir(output,{recursive:true});
});
test.after(async () => { await browser?.close(); });
async function setup() {
  const context = await browser.newContext({viewport:{width:1280,height:900},acceptDownloads:true});
  const page = await context.newPage(), errors = [];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await page.waitForFunction(()=>document.querySelector('#board').width > 500 && window.ClassJBrush);
  return {context,page,errors};
}
async function menuAction(page,id) {
  if (!(await page.locator('#moreMenu').evaluate(el=>el.open))) await page.locator('#moreBtn').click();
  await page.locator('#'+id).click();
}
async function simulate(page, pointerType, points, pressure=0.5) {
  return page.evaluate(({pointerType,points,pressure})=>{
    const c=document.querySelector('#board'),r=c.getBoundingClientRect();
    const capture=c.setPointerCapture;
    c.setPointerCapture=()=>{}; // Synthetic events have no browser-owned active pointer.
    for(let i=0;i<points.length;i++){
      const p=points[i], type=i===0?'pointerdown':i===points.length-1?'pointerup':'pointermove';
      const e=new PointerEvent(type,{pointerId:7,pointerType,isPrimary:true,button:0,buttons:type==='pointerup'?0:1,pressure,clientX:r.left+p[0],clientY:r.top+p[1],bubbles:true,cancelable:true});
      Object.defineProperty(e,'timeStamp',{value:p[2]});
      c.dispatchEvent(e);
    }
    c.setPointerCapture=capture;
    return c.toDataURL();
  },{pointerType,points,pressure});
}
test('identical paths give identical ink for mouse, touch and varying pen pressure',async()=>{
  const images=[];
  for(const [type,pressure] of [['mouse',0.5],['touch',1],['pen',0.03]]){
    const {context,page,errors}=await setup();
    const points=Array.from({length:100},(_,i)=>[150+i*5,220+100*Math.sin(i/20),1000+i*10]);
    images.push(await simulate(page,type,points,pressure));
    assert.deepEqual(errors,[]);
    await context.close();
  }
  assert.equal(images[0],images[1]);assert.equal(images[1],images[2]);
});
test('speed does not affect ink and spatial sampling remains stable',async()=>{
  const {context,page,errors}=await setup();
  const result=await page.evaluate(()=>{
    function image(duration,count) {
      const c=document.createElement('canvas');c.width=800;c.height=600;
      const points=Array.from({length:count},(_,i)=>({x:(100+600*i/(count-1))/800,y:0.5,time:1000+duration*i/(count-1)}));
      ClassJBrush.draw(c.getContext('2d'),{tool:'pen',width:24,color:'#ffffff',points},800,600);
      return c.getContext('2d').getImageData(0,0,800,600).data;
    }
    const slow=image(2400,145),fast=image(240,145),normal=image(800,49),dense=image(800,193);
    const thickness=(data,x)=>{let n=0;for(let y=0;y<600;y++)if(data[(y*800+x)*4+3]>127)n++;return n;};
    let diff=0,area=0;
    for(let i=3;i<normal.length;i+=4){diff+=Math.abs(normal[i]-dense[i]);area+=normal[i];}
    return {same:slow.every((v,i)=>v===fast[i]),slow:thickness(slow,400),fast:thickness(fast,400),tip:thickness(slow,694),start:thickness(slow,101),diff:diff/area};
  });
  assert.equal(result.same,true,JSON.stringify(result));
  assert.ok(result.tip <= result.slow,JSON.stringify(result));
  assert.ok(result.start <= result.slow,JSON.stringify(result));
  assert.ok(result.diff < 0.08,JSON.stringify(result));
  assert.deepEqual(errors,[]);await context.close();
});
test('real mouse, eraser, undo clear, reload, export and narrow layout',async()=>{
  const {context,page,errors}=await setup();
  const box=await page.locator('#board').boundingBox();
  await page.mouse.move(box.x+100,box.y+100);await page.mouse.down();
  await page.mouse.move(box.x+500,box.y+200,{steps:50});await page.mouse.up();
  const drawn=await page.locator('#board').evaluate(c=>c.toDataURL());
  await page.locator('#eraserBtn').click();
  await page.mouse.move(box.x+300,box.y+100);await page.mouse.down();
  await page.mouse.move(box.x+300,box.y+250,{steps:30});await page.mouse.up();
  assert.notEqual(await page.locator('#board').evaluate(c=>c.toDataURL()),drawn);
  await page.locator('#undoBtn').click();
  assert.equal(await page.locator('#board').evaluate(c=>c.toDataURL()),drawn);
  page.on('dialog',d=>d.accept());
  await menuAction(page,'clearBtn');await page.locator('#undoBtn').click();
  assert.equal(await page.locator('#board').evaluate(c=>c.toDataURL()),drawn);
  await page.reload();await page.waitForFunction(()=>document.querySelector('#board').width>500);
  assert.equal(await page.locator('#board').evaluate(c=>c.toDataURL()),drawn);
  const downloadPromise=page.waitForEvent('download');await menuAction(page,'saveBtn');
  await (await downloadPromise).saveAs(path.join(output,'export.png'));
  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(()=>document.querySelector('#board').width<500);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.ok((await page.locator('#board').boundingBox()).height>350);
  assert.deepEqual(errors,[]);await context.close();
});
test('brush handwriting visual specimen',async()=>{
  const {context,page,errors}=await setup();
  const paths=[
    Array.from({length:80},(_,i)=>[170+50*Math.cos(-Math.PI/2+i/79*Math.PI*2),180+44*Math.sin(-Math.PI/2+i/79*Math.PI*2)]),
    [[105,264],[142,262],[195,264],[238,260]],[[170,264],[170,300],[168,334]],
    [[290,142],[334,140],[333,190],[287,194],[291,246],[341,245]],[[383,132],[384,219],[380,331]],
    [[482,144],[480,223]],[[541,140],[540,224]],[[481,180],[540,179]],[[480,222],[540,222]],
    [[591,133],[590,190],[587,242]],[[591,182],[636,181]],[[487,267],[486,321],[539,323],[590,319]]
  ];
  for(const path of paths) {
    const points=[];
    let time=1000;
    for(let i=1;i<path.length;i++){
      const a=path[i-1],b=path[i],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/2));
      if(i===1)points.push([a[0]+240,a[1]+100,time]);
      for(let j=1;j<=n;j++){time+=7;points.push([a[0]+(b[0]-a[0])*j/n+240,a[1]+(b[1]-a[1])*j/n+100,time]);}
    }
    await simulate(page,'mouse',points);
  }
  await page.screenshot({path:path.join(output,'brush-handwriting.png')});
  const comparison=await page.evaluate(()=>{
    const strokes=JSON.parse(localStorage.getItem('classj-blackboard-v1'));
    const board=document.querySelector('#board').getBoundingClientRect();
    const c=document.createElement('canvas');c.width=1100;c.height=720;
    const ctx=c.getContext('2d');ctx.fillStyle='#f5f4f0';ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle='#252925';ctx.font='600 21px sans-serif';ctx.fillText('동일한 글씨 궤적 · 보정 전 / 후',45,42);
    ctx.font='600 24px sans-serif';ctx.fillText('보정 전',55,184);ctx.fillText('보정 후',55,529);
    ctx.fillStyle='#d8dcd6';ctx.fillRect(45,350,1010,1);
    for(const [correction,dy] of [[false,-150],[true,195]]) {
      ctx.save();ctx.translate(0,dy);
      for(const stroke of strokes) ClassJBrush.draw(ctx,{...stroke,color:'#232925',correction},board.width,board.height);
      ctx.restore();
    }
    return c.toDataURL('image/png').split(',')[1];
  });
  await fs.writeFile(path.join(output,'correction-comparison.png'),Buffer.from(comparison,'base64'));
  assert.deepEqual(errors,[]);await context.close();
});

test('pen and eraser sizes stay independent across drawing, switching and reload',async()=>{
  const {context,page,errors}=await setup();
  const slider=page.locator('#sizeRange');
  assert.equal(await slider.inputValue(),'8');
  await slider.fill('6');
  await page.locator('#eraserBtn').click();
  assert.equal(await page.locator('#sizeLabel').textContent(),'지우개 크기');
  assert.equal(await slider.inputValue(),'64');
  assert.equal(await slider.getAttribute('max'),'160');
  await slider.fill('96');
  const box=await page.locator('#board').boundingBox();
  await page.mouse.move(box.x+300,box.y+200);
  const cursor=await page.locator('#eraserCursor').boundingBox();
  assert.ok(Math.abs(cursor.width-96*Math.min(box.width,box.height)/600)<1);
  await simulate(page,'mouse',[[300,200,1000],[340,200,1020]]);
  await page.locator('#penBtn').click();
  assert.equal(await slider.inputValue(),'6');
  assert.equal(await slider.getAttribute('max'),'40');
  assert.equal(await page.locator('#eraserCursor').isVisible(),false);
  await simulate(page,'touch',[[200,300,1000],[240,300,1020]]);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('classj-blackboard-v1')));
  assert.equal(saved[0].eraserDiameter,96);
  assert.equal(saved[1].width,6);
  await page.reload();await page.waitForFunction(()=>document.querySelector('#board').width>500);
  assert.equal(await slider.inputValue(),'6');
  await page.locator('#eraserBtn').click();
  assert.equal(await slider.inputValue(),'96');
  const erased=await page.evaluate(()=>{
    return [undefined,96].map(eraserDiameter=>{
      const c=document.createElement('canvas');c.width=800;c.height=600;
      const ctx=c.getContext('2d');ctx.fillRect(0,0,800,600);
      ClassJBrush.draw(ctx,{tool:'eraser',width:14,eraserDiameter,points:[{x:.5,y:.5}]},800,600);
      const pixels=ctx.getImageData(0,300,800,1).data;
      let count=0;
      for(let i=3;i<pixels.length;i+=4)if(pixels[i]<128)count++;
      return count;
    });
  });
  assert.deepEqual(erased,[28,96]); // Existing saved strokes retain their previous footprint.
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.deepEqual(errors,[]);await context.close();
});

test('correction switch affects new strokes only and survives reload',async()=>{
  const {context,page,errors}=await setup();
  const toggle=page.locator('#correctionBtn');
  const points=[[200,180,1000],[240,180,1020],[300,180,1040],[320,200,1060]];
  await simulate(page,'mouse',points);
  const corrected=await page.locator('#board').evaluate(c=>c.toDataURL());
  await page.locator('#undoBtn').click();
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-pressed'),'false');
  await simulate(page,'mouse',points);
  assert.notEqual(await page.locator('#board').evaluate(c=>c.toDataURL()),corrected);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('classj-blackboard-v1'))[0].correction),false);
  await page.reload();await page.waitForFunction(()=>document.querySelector('#board').width>500);
  assert.equal(await toggle.getAttribute('aria-pressed'),'false');
  const before=await page.locator('#board').evaluate(c=>c.toDataURL());
  await toggle.click();
  assert.equal(await page.locator('#board').evaluate(c=>c.toDataURL()),before);
  assert.deepEqual(errors,[]);await context.close();
});

async function dispatchContacts(page, events) {
  await page.evaluate(events=>{
    const c=document.querySelector('#board'),r=c.getBoundingClientRect(),capture=c.setPointerCapture;
    c.setPointerCapture=()=>{};
    for(const item of events){
      const {type='pointermove',id=7,pointerType='touch',x=300,y=250,width=1,height=1,isPrimary=true}=item;
      const event=new PointerEvent(type,{pointerId:id,pointerType,isPrimary,button:0,buttons:type==='pointerup'?0:1,width,height,clientX:r.left+x,clientY:r.top+y,bubbles:true,cancelable:true});
      c.dispatchEvent(event);
    }
    c.setPointerCapture=capture;
    return new Promise(resolve=>requestAnimationFrame(resolve));
  },events);
}
const savedStrokes=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('classj-blackboard-v1')||'[]'));
const inkImage=page=>page.locator('#board').evaluate(c=>c.toDataURL());
test('palm erases while pen stays selected; one undo restores the gesture and pen resumes',async()=>{
  const {context,page,errors}=await setup();
  await simulate(page,'mouse',Array.from({length:91},(_,i)=>[100+i*5,260,1000+i*10]));
  const before=await inkImage(page);
  await dispatchContacts(page,[
    {type:'pointerdown',x:300,y:210,width:76,height:48},
    {x:300,y:290,width:76,height:48}
  ]);
  assert.equal(await page.locator('#gestureStatus').textContent(),'손바닥으로 지우는 중');
  assert.equal(await page.locator('#eraserCursor').isVisible(),true);
  assert.equal(await page.locator('#penBtn').getAttribute('aria-pressed'),'true');
  await dispatchContacts(page,[{type:'pointerup',x:300,y:290}]);
  const erased=await inkImage(page);
  assert.notEqual(erased,before);
  let strokes=await savedStrokes(page);
  assert.deepEqual(strokes.map(s=>s.tool),['pen','eraser']);
  assert.equal(strokes[1].gesture,'palm');
  assert.equal(await page.locator('#gestureStatus').isVisible(),false);
  assert.equal(await page.locator('#sizeRange').inputValue(),'8');
  await page.locator('#undoBtn').click();
  assert.equal(await inkImage(page),before);
  await page.locator('#redoBtn').click();
  assert.equal(await inkImage(page),erased);
  await simulate(page,'touch',[[500,400,1000],[550,400,1050]]);
  strokes=await savedStrokes(page);
  assert.equal(strokes.at(-1).tool,'pen');
  assert.equal(strokes.at(-1).width,8);
  assert.deepEqual(errors,[]);await context.close();
});
test('contact growing into a palm discards tentative ink; ordinary finger keeps writing',async()=>{
  const {context,page,errors}=await setup();
  await dispatchContacts(page,[
    {type:'pointerdown',x:100,y:100,width:8,height:8},
    {x:110,y:110,width:12,height:12},
    {x:112,y:112,width:58,height:48},
    {x:150,y:150,width:60,height:48},
    {type:'pointerup',x:150,y:150}
  ]);
  assert.deepEqual((await savedStrokes(page)).map(s=>s.tool),['eraser']);
  assert.equal(await page.locator('#board').evaluate(c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3&&v>0)),false);
  await dispatchContacts(page,[
    {type:'pointerdown',x:200,y:200,width:28,height:28},
    {x:300,y:200,width:28,height:28},
    {type:'pointerup',x:300,y:200}
  ]);
  assert.equal((await savedStrokes(page)).at(-1).tool,'pen');
  assert.deepEqual(errors,[]);await context.close();
});
test('palm preempts a held pen and resumes without a bridge across the erased interval',async()=>{
  const {context,page,errors}=await setup();
  await dispatchContacts(page,[
    {type:'pointerdown',id:11,pointerType:'pen',x:100,y:130},
    {id:11,pointerType:'pen',x:200,y:130},
    {type:'pointerdown',id:22,isPrimary:false,x:410,y:300,width:75,height:50},
    {id:11,pointerType:'pen',x:300,y:130},
    {id:22,isPrimary:false,x:450,y:300,width:75,height:50},
    {type:'pointerup',id:22,isPrimary:false,x:450,y:300},
    {id:11,pointerType:'pen',x:500,y:130},
    {id:11,pointerType:'pen',x:550,y:130},
    {type:'pointerup',id:11,pointerType:'pen',x:550,y:130}
  ]);
  const strokes=await savedStrokes(page);
  assert.deepEqual(strokes.map(s=>s.tool),['pen','eraser','pen']);
  const box=await page.locator('#board').boundingBox();
  assert.ok(Math.abs(strokes[0].points.at(-1).x*box.width-200)<1);
  assert.ok(Math.abs(strokes[2].points[0].x*box.width-500)<1);
  assert.equal(await page.locator('#penBtn').getAttribute('aria-pressed'),'true');
  assert.deepEqual(errors,[]);await context.close();
});
test('two contacts erase without area data and remain erasing until both are lifted',async()=>{
  const {context,page,errors}=await setup();
  await simulate(page,'mouse',[[100,260,1000],[550,260,1100]]);
  const before=await inkImage(page);
  await dispatchContacts(page,[
    {type:'pointerdown',id:1,x:280,y:220},
    {id:1,x:285,y:220},
    {type:'pointerdown',id:2,isPrimary:false,x:320,y:220},
    {id:1,x:280,y:290},
    {id:2,isPrimary:false,x:320,y:290},
    {type:'pointerup',id:1,x:280,y:290},
    {id:2,isPrimary:false,x:340,y:320},
    {type:'pointerup',id:2,isPrimary:false,x:340,y:320}
  ]);
  const strokes=await savedStrokes(page);
  assert.deepEqual(strokes.map(s=>s.tool),['pen','eraser']);
  assert.equal(strokes[1].gesture,'multi');
  assert.ok(strokes[1].points.some(p=>p.break));
  assert.notEqual(await inkImage(page),before);
  await page.locator('#undoBtn').click();
  assert.equal(await inkImage(page),before);
  await dispatchContacts(page,[
    {type:'pointerdown',id:3,x:400,y:400,width:80,height:60},
    {type:'pointercancel',id:3,x:400,y:400}
  ]);
  assert.equal(await page.locator('#gestureStatus').isVisible(),false);
  await simulate(page,'mouse',[[500,450,1000],[550,450,1100]]);
  assert.equal((await savedStrokes(page)).at(-1).tool,'pen');
  assert.deepEqual(errors,[]);await context.close();
});

test('finish narrows to the exact endpoint in horizontal, vertical and diagonal strokes',async()=>{
  const {context,page,errors}=await setup();
  const checks=await page.evaluate(()=>{
    return [0,Math.PI/2,Math.PI/4,-Math.PI/4,Math.PI].map(angle=>{
      const t=[Math.cos(angle),Math.sin(angle)],n=[-t[1],t[0]];
      const end=[400,300],length=160;
      const points=Array.from({length:81},(_,i)=>({x:(end[0]-t[0]*length*(1-i/80))/800,y:(end[1]-t[1]*length*(1-i/80))/600,time:i*9}));
      const polygon=ClassJBrush.outline({width:18,points},800,600);
      const section=distance=>{
        const hits=[];
        for(let i=0;i<polygon.length;i++){
          const a=polygon[i],b=polygon[(i+1)%polygon.length];
          const ax=(a[0]-end[0])*t[0]+(a[1]-end[1])*t[1];
          const bx=(b[0]-end[0])*t[0]+(b[1]-end[1])*t[1];
          if(Math.abs(bx-ax)<1e-8)continue;
          const fraction=(-distance-ax)/(bx-ax);
          if(fraction>=0&&fraction<=1)hits.push((a[0]+(b[0]-a[0])*fraction-end[0])*n[0]+(a[1]+(b[1]-a[1])*fraction-end[1])*n[1]);
        }
        return hits.length?Math.max(...hits)-Math.min(...hits):0;
      };
      const tip=polygon[polygon.tipIndex];
      return {angle,hasTip:!!tip,error:tip?Math.hypot(tip[0]-end[0],tip[1]-end[1]):Infinity,body:section(35),nearTip:section(2)};
    });
  });
  for(const result of checks) {
    assert.equal(result.hasTip,true,JSON.stringify(result));
    assert.ok(result.error<0.001,JSON.stringify(result));
    assert.ok(result.body>1 && result.nearTip<result.body*0.4,JSON.stringify(result));
  }
  assert.deepEqual(errors,[]);await context.close();
});

test('canvas fills desktop and mobile viewports; floating tools collapse without moving ink',async()=>{
  const {context,page,errors}=await setup();
  for(const size of [{width:1280,height:900},{width:390,height:844}]){
    await page.setViewportSize(size);
    await page.waitForFunction(({width,height})=>{
      const r=document.querySelector('#board').getBoundingClientRect();
      return r.width===width&&r.height===height;
    },size);
    const box=await page.locator('#board').boundingBox();
    assert.deepEqual(box,{x:0,y:0,...size});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),true);
    await simulate(page,'mouse',[[20,20,1000],[120,20,1100],[120,70,1150]]);
    const ink=await inkImage(page);
    await page.locator('#hideToolsBtn').click();
    assert.equal(await page.locator('#toolbar').isVisible(),false);
    assert.equal(await page.locator('#showToolsBtn').isVisible(),true);
    assert.equal(await inkImage(page),ink);
    assert.deepEqual(await page.locator('#board').boundingBox(),box);
    await page.locator('#showToolsBtn').click();
    assert.equal(await page.locator('#toolbar').isVisible(),true);
    assert.equal(await inkImage(page),ink);
    await page.locator('#moreBtn').click();
    const menu=await page.locator('.menu-panel').boundingBox();
    assert.ok(menu.x>=0&&menu.y>=0&&menu.x+menu.width<=size.width);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.menu-panel').isVisible(),false);
  }
  await page.setViewportSize({width:1280,height:900});
  await menuAction(page,'fullscreenBtn');
  await page.waitForFunction(()=>!!document.fullscreenElement);
  await menuAction(page,'fullscreenBtn');
  await page.waitForFunction(()=>!document.fullscreenElement);
  assert.deepEqual(errors,[]);await context.close();
});
