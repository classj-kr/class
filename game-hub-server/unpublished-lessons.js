const path = require('node:path');

// Withdraw the unfinished art course, including old lesson URLs and assets.
const UNPUBLISHED_ROOT = '/learning/arts/art-theory';

function hideUnpublishedLessons(req, res, next) {
  let pathname;
  try {
    pathname = path.posix.normalize(decodeURIComponent(req.path).replace(/\\/g, '/')).toLowerCase();
  } catch (_) {
    return res.status(400).type('text').send('잘못된 주소입니다.');
  }
  if (pathname !== UNPUBLISHED_ROOT && !pathname.startsWith(`${UNPUBLISHED_ROOT}/`)) return next();
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  return res.status(404).type('text').send('현재 제공하지 않는 수업입니다.');
}

module.exports = { hideUnpublishedLessons };
