const path = require("node:path");

const VERSIONED_ICONS = [
  "favicon-20260824.webp", "favicon-20260824-v2.webp", "favicon-20260824-v3.webp",
  "favicon-20260824-v5.webp", "favicon-20260824-v6.webp"
];
const SIZED_ICONS = [
  "favicon-32x32.webp", "favicon-48x48.webp", "favicon-192x192.webp", "apple-touch-icon.webp"
];

function registerSiteIcons(app, siteRoot) {
  const icons = [
    ["favicon.webp", "no-cache, must-revalidate"],
    ...VERSIONED_ICONS.map(name => [name, "public, max-age=31536000, immutable"]),
    ...SIZED_ICONS.map(name => [name, "public, max-age=86400"])
  ];
  for (const [name, cacheControl] of icons) {
    // Keep bookmarked and cached root URLs working after the files move.
    app.get([`/assets/icons/${name}`, `/${name}`], (_req, res) => {
      res.setHeader("Cache-Control", cacheControl);
      res.sendFile(path.join(siteRoot, "assets", "icons", name));
    });
  }
  const legacyIcons = ["favicon.ico", "favicon.png",
    ...VERSIONED_ICONS.map(name => name.replace(/\.webp$/, ".ico"))];
  for (const name of legacyIcons) {
    app.get(`/${name}`, (_req, res) => {
      res.setHeader("Cache-Control", "no-cache, must-revalidate");
      res.redirect(302, "/favicon.webp");
    });
  }
}

module.exports = { registerSiteIcons };
