const fs=require('node:fs'),path=require('node:path');
const sharp=require('C:/Users/A/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const source='C:/Users/A/.codex/generated_images/01a0bd67-c0ab-7960-91ad-345fd72cc016';
const dest='learning/inquiry/age-of-exploration/public/assets/cities/1520';
const assets={kaminokuni:'exec-288f76a6-668a-4783-9c86-ab0fb5d54660.png','tokuyama-ezo':'exec-e7f47707-5365-4799-ba11-44672db99e5c.png',kyongsong:'exec-dccdf8ae-55e0-4f38-84be-930152b9ff40.png',hoeryong:'exec-422562a3-824e-4782-980e-02baad25d20a.png'};
(async()=>{for(const [key,file] of Object.entries(assets)){const target=path.join(dest,key+'.webp');if(fs.existsSync(target))throw Error('Asset already exists: '+target);await sharp(path.join(source,file)).webp({quality:84}).toFile(target);const meta=await sharp(target).metadata();console.log(JSON.stringify({key,width:meta.width,height:meta.height,bytes:fs.statSync(target).size}));}})().catch(e=>{console.error(e);process.exitCode=1});
