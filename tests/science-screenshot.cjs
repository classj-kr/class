// Keep science audit screenshots lossless without saving intermediate PNG files.
const sharp = require('sharp');
const fs = require('node:fs/promises');

async function writeArtifact(file, bytes) {
  for (let attempt = 0; ; attempt++) {
    try { await fs.writeFile(file, bytes); break; }
    catch (error) {
      if (attempt === 2 || !['EBUSY', 'EPERM', 'EINVAL', 'UNKNOWN'].includes(error.code)) throw error;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

module.exports = async function screenshotWebp(target, file, options = {}) {
  if (typeof file === 'object') { options = file; file = options.path; }
  if (!file.endsWith('.webp')) throw new Error('Science screenshots must use .webp');
  const bytes = await target.screenshot({...options, path: undefined, type: 'png'});
  const webp = await sharp(bytes).webp({lossless: true, effort: 6}).toBuffer();
  // Use Node's Windows file handling; libvips can reject an existing capture
  // while an indexer briefly holds it. Do not discard a failed capture silently.
  await writeArtifact(file, webp);
};
module.exports.writeArtifact = writeArtifact;
