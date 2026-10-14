'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const base=path.join(root,'public/assets/maps/natural-earth-v58');
const manifest=JSON.parse(fs.readFileSync(path.join(base,'manifest.json'),'utf8'));
assert.deepEqual({width:manifest.width,height:manifest.height,tileSize:manifest.tileSize,cols:manifest.cols,rows:manifest.rows,format:manifest.format},
  {width:16200,height:8100,tileSize:1024,cols:16,rows:8,format:'webp'});
assert.equal(manifest.sourceRoot,'repository');
assert.equal(manifest.sourceFile,'references/geography/natural-earth-v58/3_no_ice_clouds_16k.jpg');
const source=path.resolve(root,'../../..',manifest.sourceFile);
assert.ok(fs.existsSync(source),'16K source image missing');
assert.equal(fs.statSync(source).size,manifest.sourceBytes);
assert.equal(require('node:crypto').createHash('sha256').update(fs.readFileSync(source)).digest('hex'),manifest.sourceSha256);
assert.ok(manifest.sourceBytes>25_000_000,'source must be the full 16K file, not a preview');
const tiles=fs.readdirSync(path.join(base,'tiles')).filter(f=>/^tile_\d+_\d+\.webp$/.test(f));
assert.equal(tiles.length,128);
// WebP sea tiles are only ~2 KB, so a byte floor no longer tells a real tile from a broken one:
// every tile must be an untruncated WebP whose pixel size is its grid cell.
for(const f of tiles){
  const b=fs.readFileSync(path.join(base,'tiles',f)),[,col,row]=f.match(/^tile_(\d+)_(\d+)/).map(Number);
  assert.equal(b.toString('latin1',0,4)+b.toString('latin1',8,16),'RIFFWEBPVP8 ',`${f} is not a lossy WebP`);
  assert.equal(b.readUInt32LE(4)+8,b.length,`${f} is truncated`);
  assert.deepEqual([b.readUInt16LE(26)&0x3fff,b.readUInt16LE(28)&0x3fff],
    [Math.min(manifest.tileSize,manifest.width-col*manifest.tileSize),Math.min(manifest.tileSize,manifest.height-row*manifest.tileSize)],`${f} has the wrong pixel size`);
}
assert.ok(tiles.reduce((sum,f)=>sum+fs.statSync(path.join(base,'tiles',f)).size,0)>128*10_000,'tiles look blank');
const html=fs.readFileSync(path.join(root,'public/index.html'),'utf8');
assert.match(html,/NATURAL_MAP=Object\.freeze\(\{width:16200,height:8100,tileSize:1024,cols:16,rows:8\}\)/);
assert.match(html,/DESKTOP_MAP_ZOOM=1\.0,MOBILE_MAP_ZOOM_PORTRAIT=\.68,MOBILE_MAP_ZOOM_LANDSCAPE=\.78/);
console.log(JSON.stringify({ok:true,sourceBytes:manifest.sourceBytes,tiles:tiles.length,resolution:[manifest.width,manifest.height]}));
