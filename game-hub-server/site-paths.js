const path = require('node:path');

const APP_DIRECTORIES = Object.freeze([
  'admin', 'boards', 'classboard', 'classtools', 'notice', 'parent',
  'room', 'schooladmin', 'school-election', 'teacher', 'vote',
]);
const SITE_PAGES = Object.freeze([
  'privacy.html', 'school-setup.html', 'student-privacy.html', 'support.html', 'terms.html',
]);

// Public URLs stay unchanged while application sources live under apps/.
function resolveSitePath(siteRoot, pathname) {
  if (pathname.includes('\\') || pathname.split('/').includes('..')) return null;
  const relative = pathname.replace(/^\/+/, '');
  if (SITE_PAGES.includes(relative)) return path.join(siteRoot, 'apps', 'site', relative);
  const directory = relative.split('/')[0];
  const base = APP_DIRECTORIES.includes(directory) ? path.join(siteRoot, 'apps') : siteRoot;
  const candidate = path.resolve(base, relative);
  const inside = path.relative(base, candidate);
  if (inside.startsWith('..') || path.isAbsolute(inside)) return null;
  return candidate;
}

module.exports = { APP_DIRECTORIES, SITE_PAGES, resolveSitePath };
