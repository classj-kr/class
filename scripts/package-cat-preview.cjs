"use strict";

// A portable review copy: double-clicking the resulting HTML needs no server,
// CDN, or file fetches. Keep the maintained sources in apps/avatar-lab/.
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const lab = path.join(root, "apps/avatar-lab");
const read = file => fs.readFileSync(file, "utf8");
const inlineScript = file => `<script>${read(file).replace(/<\/script/gi, "<\\/script")}</script>`;
let html = read(path.join(lab, "index.html"));
html = html.replace('<link rel="stylesheet" href="style.css">', `<style>${read(path.join(lab, "style.css"))}</style>`);
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, file) => inlineScript(path.resolve(lab, file)));
for (const key of ["animal-cat", "food-ramen", "food-donut", "fruit-banana", "vehicle-helicopter", "object-umbrella"]) {
  html = html.replaceAll(`models/${key}.glb`, `data:model/gltf-binary;base64,${fs.readFileSync(path.join(lab, `models/${key}.glb`)).toString("base64")}`);
  html = html.replaceAll(`../classtools/assets/avatars/${key}.webp`, `data:image/webp;base64,${fs.readFileSync(path.join(root, `apps/classtools/assets/avatars/${key}.webp`)).toString("base64")}`);
}
html = html.replace('href="../../"', 'href="#"');
const output = path.join(root, "outputs/avatar-lab/cat-preview.html");
fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(output, html);
fs.writeFileSync(path.join(root,"outputs/avatar-lab/avatars-preview.html"),html);
console.log(output + " (" + fs.statSync(output).size + " bytes)");
