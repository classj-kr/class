const fs = require("node:fs");
const path = require("node:path");

const GAME_PAGE_ALIASES = [
  ["shape-crossing", "traverse"], ["spot-match", "dobble"],
  ["code-words", "codenames"], ["manor-mystery", "clue"],
  ["court-deduction", "loveletter"], ["quest-deduction", "avalon"],
  ["number-tiles", "rummikub"], ["pattern-trio", "setgame"],
  ["number-code", "davincicode"], ["corner-blocks", "blokus"],
].map(([name, folder]) => [`/learning/games/${name}`, `/learning/games/${folder}/${folder}`]);

function cleanMenuPath(value) {
  return value.replace(/\/index\.html$/, "").replace(/\.html$/, "").replace(/\/+$/, "");
}

function isWithinPath(requestPath, rootPath) {
  return requestPath === rootPath || requestPath.startsWith(`${rootPath}/`);
}

const siteRoot = path.join(__dirname, "..");
const home = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
const hub = home.slice(home.indexOf('<div id="hubContent"'), home.indexOf('<script src="https://accounts.google.com/gsi/client"'));
const mathCatalog = fs.readFileSync(path.join(siteRoot, "learning/literacy-numeracy/math-tools/index.html"), "utf8");
const menuPaths = [...(hub + mathCatalog).matchAll(/<a\b[^>]*\bhref="([^"]+)"[^>]*>/g)]
  .filter(([tag]) => !/\bdata-(?:always-open|access-catalog)=/.test(tag))
  .map(([, href]) => cleanMenuPath(`/${href.split(/[?#]/, 1)[0].replace(/^\//, "")}`))
  .filter(href => href === "/arithmetic" || /^\/(?:learning|learn)\//.test(href))
  .sort((first, second) => second.length - first.length);
const individualMenuPaths = new Set(menuPaths);

function canonicalMenuPath(value) {
  const clean = cleanMenuPath(value);
  const alias = GAME_PAGE_ALIASES.find(([, legacy]) => isWithinPath(clean, legacy));
  return alias ? alias[0] + clean.slice(alias[1].length) : clean;
}

function homeMenuForRequest(value) {
  const requestPath = canonicalMenuPath(value);
  return menuPaths.find(menuPath => isWithinPath(requestPath, menuPath)) || "";
}

function gameMenuForAssetRoot(value) {
  if (!/^\/learning\/games\/[^/]+$/.test(value)) return "";
  const folder = value.slice(value.lastIndexOf("/") + 1);
  return homeMenuForRequest(`${value}/${folder}`);
}

function isMenuDisabled(value, disabledPaths) {
  const requestPath = canonicalMenuPath(value);
  const owner = homeMenuForRequest(requestPath);
  return disabledPaths.some(value => {
    const disabledPath = canonicalMenuPath(value);
    return individualMenuPaths.has(disabledPath)
      ? owner === disabledPath
      : isWithinPath(requestPath, disabledPath);
  });
}

module.exports = { GAME_PAGE_ALIASES, canonicalMenuPath, gameMenuForAssetRoot, homeMenuForRequest, individualMenuPaths, isMenuDisabled };
