import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const museum=path.join(root,'learning/arts/art-appreciation/museum');
const out=path.join(root,'outputs/qa/avatar-lab/compression-20261111/draco');
await fs.mkdir(out,{recursive:true});
let html=await fs.readFile(path.join(museum,'index.html'),'utf8');
html=html.replace('<head>','<head>\n<base href="/learning/arts/art-appreciation/museum/">');
html=html.replace('<script src="/apps/avatar-lab/museum-preview.js"></script>',[
 '<script src="/tools/avatar-optimizer/node_modules/three/examples/js/loaders/DRACOLoader.js"></script>',
 '<script src="/tools/avatar-optimizer/museum-crowd.js"></script>',
].join('\n'));
await fs.writeFile(path.join(out,'museum-crowd.html'),html);
const files=['index.html','museum.js','styles.css','art-data.js','vendor/three.min.js','vendor/GLTFLoader.js'];
const sources={};for(const f of files)sources[f]=crypto.createHash('sha256').update(await fs.readFile(path.join(museum,f))).digest('hex');
await fs.writeFile(path.join(out,'museum-source-hashes.json'),JSON.stringify(sources,null,2));
console.log('Created local harness using unchanged museum scripts/styles/data. Open /outputs/qa/avatar-lab/compression-20261111/draco/museum-crowd.html?avatars=preview');
