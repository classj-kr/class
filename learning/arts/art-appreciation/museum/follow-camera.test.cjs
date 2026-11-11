const test=require('node:test'),assert=require('node:assert/strict');
const {position,constrainPlayer}=require('./follow-camera.js');
test('entrance retreat keeps the camera in front of the wall',()=>{
  assert.deepEqual(position({x:0,z:3.75},0),{x:0,z:6.35,distance:2.6});
  const camera=position({x:0,z:6.5},0);assert.equal(camera.z,6.65);assert.ok(camera.distance<.85);
});
test('camera avoids the entrance piers while keeping the view aligned',()=>{
  const p={x:3.2,z:4.9},yaw=Math.PI/4,c=position(p,yaw);
  assert.ok(c.distance<2.6);assert.ok(c.z<=5.21+1e-9);
  assert.ok(Math.abs((c.x-p.x)-(c.z-p.z))<1e-9);
});
test('player cannot enter the solid entrance piers',()=>{
  for(const side of [-1,1]){const p={x:side*4.5,z:5.7};constrainPlayer(p);assert.ok(p.z<=5.13||p.z>=6.27);}
});
test('all room edges and headings retain wall clearance',()=>{
  let cases=0;
  for(let x=-4.85;x<=4.85;x+=.485)for(let z=-28.6;z<=6.501;z+=.45)for(let d=0;d<32;d++){
    const p={x,z};constrainPlayer(p);const c=position(p,d*Math.PI/16);
    assert.ok(c.x>=-5.430001&&c.x<=5.430001&&c.z>=-29.580001&&c.z<=6.650001);
    assert.ok(c.distance>=0&&c.distance<=2.600001);
    for(const side of [-1,1]){const px=side*c.x;assert.ok(!(px>3.360001&&px<6.039999&&c.z>5.210001&&c.z<6.189999));}
    cases++;
  }
  assert.ok(cases>45000);
});
