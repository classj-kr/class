const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const express = require('../game-hub-server/node_modules/express');
const {APP_DIRECTORIES, resolveSitePath} = require('../game-hub-server/site-paths');

// Exercise the production routing block, including its redirect order. A plain
// static server misses collisions between a sibling .html page and asset folder.
function createCleanHtmlApp() {
  const SITE_ROOT = path.resolve(__dirname, '..');
  const source = fs.readFileSync(path.join(SITE_ROOT, 'game-hub-server/server.js'), 'utf8');
  const start = source.indexOf('const CLEAN_HTML_ROOTS =');
  const end = source.indexOf('\nconst museumClasses =', start);
  if (start < 0 || end < start) throw new Error('Production clean HTML routing block not found');
  const app = express();
  vm.runInNewContext(source.slice(start, end), {
    app, fs, path, express, SITE_ROOT, APP_DIRECTORIES, resolveSitePath,
    staticAssetOptions: {},
    sendSiteHtml: (_req, res, file, next) => res.sendFile(file, error => error && next(error)),
  }, {filename: 'production-clean-html-routing.js'});
  app.use('/assets', express.static(path.join(SITE_ROOT, 'assets')));
  return app;
}

module.exports = {createCleanHtmlApp};
