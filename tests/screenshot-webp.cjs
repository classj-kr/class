const assert=require('node:assert/strict');
const fs=require('node:fs');
const {spawnSync}=require('node:child_process');
const convert=`import io, sys
from PIL import Image
original = Image.open(io.BytesIO(sys.stdin.buffer.read())).convert('RGBA')
output = io.BytesIO()
original.save(output, 'WEBP', lossless=True, exact=True, method=3)
decoded = Image.open(io.BytesIO(output.getvalue())).convert('RGBA')
assert decoded.size == original.size
assert decoded.tobytes() == original.tobytes()
sys.stdout.buffer.write(output.getvalue())
`;

module.exports=async function screenshotWebp(target,{path,...options}){
 assert.ok(path.endsWith('.webp'),'Capture path must end in .webp');
 const input=await target.screenshot({...options,type:'png'});
 const result=spawnSync(process.env.PYTHON||'python',['-c',convert],{input:Buffer.from(input),maxBuffer:64*1024*1024,windowsHide:true});
 if(result.error)throw result.error;
 assert.equal(result.status,0,result.stderr.toString());
 fs.writeFileSync(path,result.stdout);
};
