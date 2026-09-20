import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const data=new URL('../learning/inquiry/globe/data/',import.meta.url);
test('climate tile pyramid covers the world at every advertised zoom',()=>{
  const grid=JSON.parse(fs.readFileSync(new URL('atlas-climate.json',data),'utf8'));
  assert.equal(grid.step,.1);
  assert.equal(grid.tiles.tileSize,256);
  assert.equal(grid.tiles.maxzoom,5);
  for(let z=0;z<=grid.tiles.maxzoom;z++)for(let x=0;x<2**z;x++)for(let y=0;y<2**z;y++){
    const name=grid.tiles.path.replace('{z}',z).replace('{x}',x).replace('{y}',y);
    const png=fs.readFileSync(new URL(name,data));
    assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a',name);
    assert.equal(png.readUInt32BE(16),256,name);
    assert.equal(png.readUInt32BE(20),256,name);
    assert.equal(png[25],6,'RGBA tiles preserve transparent ocean cells: '+name);
  }
});
