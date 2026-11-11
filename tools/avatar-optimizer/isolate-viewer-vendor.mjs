import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../../outputs/avatar-release');
for(const name of ['index.html','collection.html','collection-review.html']){
 const p=path.join(root,'apps/avatar-lab',name);let html=await fs.readFile(p,'utf8');
 html=html.replaceAll('../../learning/arts/art-appreciation/museum/vendor/three.min.js','/apps/avatar-lab/vendor/three.min.js?v=r128').replaceAll('../../learning/arts/art-appreciation/museum/vendor/GLTFLoader.js','/apps/avatar-lab/vendor/GLTFLoader.js?v=r128');
 await fs.writeFile(p,html);
}
