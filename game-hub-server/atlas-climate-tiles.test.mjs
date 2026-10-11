import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const data=new URL('../learning/inquiry/globe/data/',import.meta.url);

// Lossless WebP: RIFF....WEBP, optionally a VP8X chunk, then a VP8L chunk that opens with 0x2f,
// 14-bit width-1, 14-bit height-1, the alpha_is_used bit and a 3-bit version.
function readLosslessWebp(file,name){
  assert.equal(file.toString('latin1',0,4)+file.toString('latin1',8,12),'RIFFWEBP',name);
  assert.equal(file.readUInt32LE(4),file.length-8,name);
  let canvas;
  for(let at=12;at+8<=file.length;){
    const tag=file.toString('latin1',at,at+4),size=file.readUInt32LE(at+4),body=at+8;
    if(tag==='VP8X')canvas={width:file.readUIntLE(body+4,3)+1,height:file.readUIntLE(body+7,3)+1,alpha:(file[body]&0x10)>0};
    if(tag==='VP8L'){
      const bits=file.readUInt32LE(body+1);
      assert.equal(file[body],0x2f,name);
      assert.equal(bits>>>29,0,name);
      const image={width:(bits&0x3fff)+1,height:(bits>>>14&0x3fff)+1,alpha:(bits>>>28&1)>0};
      if(canvas)assert.deepEqual(canvas,image,name);
      return image;
    }
    at=body+size+(size&1);
  }
  assert.fail('no lossless VP8L chunk: '+name);
}

// The encoder sets alpha_is_used only when some pixel really is transparent, so all-land tiles
// lack it. Find the tiles that sample a no-data (ocean) cell with the same pixel-centre lookup
// as build_climate_tiles.py.
function oceanTiles(grid){
  const cells=new Uint8Array(grid.width*grid.height);
  let at=0;
  for(const [,key,length] of grid.runs.matchAll(/([A-E_])([0-9a-z]+)/g)){
    const end=at+parseInt(length,36);
    if(key==='_')cells.fill(1,at,end);
    at=end;
  }
  assert.equal(at,cells.length);
  const {tileSize,maxzoom}=grid.tiles,count=2**maxzoom,size=tileSize*count,ocean=new Uint8Array(count*count);
  const rows=Int32Array.from({length:size},(_,py)=>{
    const latitude=Math.atan(Math.sinh(Math.PI*(1-2*(py+.5)/size)))*(180/Math.PI);
    return Math.min(grid.height-1,Math.max(0,Math.floor((90-latitude)/grid.step)));
  });
  const cols=Int32Array.from({length:size},(_,px)=>Math.floor((px+.5)*grid.width/size));
  for(let py=0;py<size;py++)for(let px=0;px<size;px++){
    if(cells[rows[py]*grid.width+cols[px]])ocean[Math.floor(px/tileSize)*count+Math.floor(py/tileSize)]=1;
  }
  return (z,x,y)=>{
    const span=count>>z;
    for(let i=x*span;i<(x+1)*span;i++)for(let j=y*span;j<(y+1)*span;j++)if(ocean[i*count+j])return true;
    return false;
  };
}

test('climate tile pyramid covers the world at every advertised zoom',()=>{
  const grid=JSON.parse(fs.readFileSync(new URL('atlas-climate.json',data),'utf8'));
  assert.equal(grid.step,.1);
  assert.equal(grid.tiles.tileSize,256);
  assert.equal(grid.tiles.maxzoom,5);
  const hasOcean=oceanTiles(grid);
  for(let z=0;z<=grid.tiles.maxzoom;z++)for(let x=0;x<2**z;x++)for(let y=0;y<2**z;y++){
    const name=grid.tiles.path.replace('{z}',z).replace('{x}',x).replace('{y}',y);
    const tile=readLosslessWebp(fs.readFileSync(new URL(name,data)),name);
    assert.equal(tile.width,256,name);
    assert.equal(tile.height,256,name);
    // Max-zoom pixels are direct samples, so the match is exact there; lower zooms are resampled.
    if(hasOcean(z,x,y))assert.ok(tile.alpha,'tiles keep ocean cells transparent: '+name);
    else if(z===grid.tiles.maxzoom)assert.ok(!tile.alpha,'land-only tile stays opaque: '+name);
  }
});
