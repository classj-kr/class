import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sitePaths from "../game-hub-server/site-paths.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIP = new Set(["node_modules", "dist", ".git", ".openai", ".wrangler", "tools", "_tools", "_check", "tests", "art-source"]);
const LEAFLET_OPTIONAL = new Set(["images/layers.png", "images/layers-2x.png", "images/marker-icon.png"]);

export function publicUrl(file) {
  let url = "/" + file.replace(/^apps\//, "");
  if (file.startsWith("apps/site/")) url = "/" + path.posix.basename(file);
  if (file.startsWith("learning/inquiry/age-of-exploration/public/")) {
    url = "/learn/world-voyage/" + file.slice("learning/inquiry/age-of-exploration/public/".length);
  }
  return url.endsWith("/index.html") ? url.slice(0, -10) : url;
}

export function references(source, html = false) {
  const found = [];
  const text = source.replace(/<!--[\s\S]*?-->/g, "")
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, "$1</script>");
  if (html) {
    for (const [tag] of text.matchAll(/<(?:a|link|script|img|source|iframe|audio|video)\b[^>]*>/gi)) {
      for (const match of tag.matchAll(/\b(?:href|src)\s*=\s*(["'])(.*?)\1/g)) found.push(match[2]);
    }
  }
  // Match a complete quoted data URI, including any internal SVG url(#filter).
  const css = html ? text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "") : text;
  for (const match of css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi)) {
    found.push((match[1] ?? match[2] ?? match[3]).trim());
  }
  return found.filter(value => value && !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)|[{}<>]|\\/i.test(value));
}

export function auditSiteLinks(root = ROOT) {
  const files = fs.existsSync(path.join(root, "index.html")) ? ["index.html"] : [];
  function walk(directory) {
    for (const entry of fs.readdirSync(path.join(root, directory), { withFileTypes: true })) {
      if (entry.isSymbolicLink() || SKIP.has(entry.name)) continue;
      const file = `${directory}/${entry.name}`;
      // React source is compiled by Vite; its URLs belong to the built application.
      if (file === "learning/literacy-numeracy/arithmetics") continue;
      if (entry.isDirectory()) walk(file);
      else if (/\.(html|css)$/.test(file)) files.push(file);
    }
  }
  for (const directory of ["apps", "learning", "assets"]) {
    if (fs.existsSync(path.join(root, directory))) walk(directory);
  }
  const serverFile = path.join(root, "game-hub-server/server.js");
  const server = fs.existsSync(serverFile) ? fs.readFileSync(serverFile, "utf8") : "";
  const aliases = new Map([...server.matchAll(/\["(\/learning\/games\/[^"]+)", "[^"]+", "([^"]+)"\]/g)].map(match => [match[1], match[2]]));
  function fileFor(url) {
    if (aliases.has(url)) return path.join(root, aliases.get(url));
    if (url.startsWith("/assets/avatars/")) return path.join(root, "apps/classtools/assets/avatars", url.slice(16));
    if (url.startsWith("/learn/world-voyage/")) return path.join(root, "learning/inquiry/age-of-exploration/public", url.slice(19));
    if (sitePaths.SITE_PAGES.includes(url.slice(1) + ".html")) url += ".html";
    if (/^\/learning\/arts\/music-theory\/rhythm-training\/(?:notation|rhythm-notation)\.js$/.test(url)) {
      return path.join(root, "learning/arts/music-theory/ear-training", url.endsWith("/notation.js") ? "notation.js" : "rhythm.js");
    }
    return sitePaths.resolveSitePath(root, url);
  }
  const missing = [], optional = [], urls = new Set();
  let checked = 0;
  for (const file of files) {
    for (const raw of references(fs.readFileSync(path.join(root, file), "utf8"), file.endsWith(".html"))) {
      const url = decodeURIComponent(new URL(raw.replaceAll("&amp;", "&"), "http://local" + publicUrl(file)).pathname);
      checked += 1;
      urls.add(url);
      if (/^\/(?:api|auth|arithmetic)(?:\/|$)/.test(url) || /^\/learning\/(?:arts\/|games\/|inquiry\/|literacy-numeracy\/)?$/.test(url) || url === "/hanguksa" || url === "/learn/world-voyage/socket.io/socket.io.js") continue;
      const target = fileFor(url);
      if (target && [target, target + ".html", path.join(target, "index.html")].some(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile())) continue;
      const item = { file, reference: raw, url };
      // Korea map uses divIcon markers and its own layer controls; these vendor
      // defaults are unused. Keep visible in the report instead of hiding them.
      if (file === "learning/inquiry/korea-map/vendor/leaflet/leaflet.css" && LEAFLET_OPTIONAL.has(raw)) optional.push(item);
      else missing.push(item);
    }
  }
  return { files: files.length, checked, uniqueUrls: urls.size, missing, unusedVendorDefaults: optional };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = auditSiteLinks();
  console.log(JSON.stringify(result, null, 2));
  if (result.missing.length) process.exitCode = 1;
}
