const test=require('node:test');
const assert=require('node:assert/strict');
require('../learning/inquiry/space/earth-moon/observer-marker.js');
const {frame}=globalThis.EarthObserver;
const dot=(a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0);
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);

test('gaze remains tangent to Earth and matches the northern/southern sky view',()=>{
    for(const latitude of [37.5,0,90,-35,-90])for(const meridian of [0,Math.PI/2]) {
        const f=frame(latitude,meridian);
        for(const vector of [f.up,f.forward,f.side])close(dot(vector,vector),1);
        close(dot(f.forward,f.up),0);close(dot(f.side,f.up),0);close(dot(f.forward,f.side),0);
        assert.equal(f.direction,latitude<0?'북쪽':'남쪽');
        if(Math.abs(latitude)<90)assert.ok(latitude<0?f.forward[1]>0:f.forward[1]<0);
        const [x,y,z]=f.side, [a,b,c]=f.up;
        [y*c-z*b,z*a-x*c,x*b-y*a].forEach((v,i)=>close(v,f.forward[i]));
    }
});

test('eastward daily rotation carries the standing observer and gaze together',()=>{
    const f=frame(37.5,0);
    for(const hour of [0,6,12,18]) {
        const angle=hour*Math.PI/12;
        const rotate=([x,y,z])=>[x*Math.cos(angle)+z*Math.sin(angle),y,-x*Math.sin(angle)+z*Math.cos(angle)];
        close(dot(rotate(f.up),rotate(f.forward)),0);
        close(rotate(f.forward)[1],f.forward[1]);
    }
});
