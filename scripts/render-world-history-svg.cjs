const fs = require('node:fs');
const sharp = require(process.env.SHARP_MODULE_PATH || 'sharp');
(async () => {
  const [input, output] = process.argv.slice(2);
  const {data, info} = await sharp(fs.readFileSync(input), {limitInputPixels: 50000000,unlimited:true})
    .flatten({background:'#ffffff'}).removeAlpha().raw().toBuffer({resolveWithObject:true});
  await sharp(data,{raw:info}).webp({lossless:true,effort:5}).toFile(output);
  const decoded = await sharp(output).removeAlpha().raw().toBuffer();
  if (!decoded.equals(data)) throw new Error('Lossless WebP pixel verification failed');
  process.stdout.write(JSON.stringify({width:info.width,height:info.height}));
})().catch(e=>{console.error(e);process.exitCode=1;});
