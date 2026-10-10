// Keep science audit screenshots lossless without saving intermediate PNG files.
const sharp = require('sharp');

module.exports = async function screenshotWebp(target, file, options = {}) {
  if (typeof file === 'object') { options = file; file = options.path; }
  if (!file.endsWith('.webp')) throw new Error('Science screenshots must use .webp');
  const bytes = await target.screenshot({...options, path: undefined, type: 'png'});
  await sharp(bytes).webp({lossless: true, effort: 6}).toFile(file);
};
