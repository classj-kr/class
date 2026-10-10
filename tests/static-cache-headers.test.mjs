import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 18766;
const serverPath = path.join(__dirname, "..", "game-hub-server", "server.js");
const child = spawn(process.execPath, [serverPath], {
  env: {
    ...process.env,
    PORT: String(port),
    DATABASE_URL: "",
    GOOGLE_CLIENT_ID: "",
    TEACHER_EMAILS: "",
    ADMIN_EMAILS: ""
  },
  stdio: ["ignore", "pipe", "pipe"]
});

let stderr = "";
child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/health`);
      if (response.ok) return;
    } catch (_) {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Server did not start. ${stderr}`);
}

(async () => {
  try {
    await waitForServer();

    // 1. Test Audio asset Cache-Control header
    const audioResponse = await fetch(`http://127.0.0.1:${port}/assets/sound/sfx/select.ogg`);
    assert.equal(audioResponse.status, 200);
    assert.equal(audioResponse.headers.get("cache-control"), "public, max-age=31536000, immutable");

    // 2. Test Image asset Cache-Control header
    const imgResponse = await fetch(`http://127.0.0.1:${port}/assets/images/monthly/1.webp`);
    assert.equal(imgResponse.status, 200);
    assert.equal(imgResponse.headers.get("cache-control"), "public, max-age=31536000, immutable");

    // 3. Test Favicon Cache-Control headers
    // 3-1. 이름에 버전이 박힌 아이콘은 내용이 바뀌지 않으므로 오래 둔다. 첫 화면이 부르는 이름을 그대로 쓴다.
    const indexHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
    const versionedIcon = (indexHtml.match(/<link rel="icon" href="(\/assets\/icons\/favicon-[0-9]{8}(?:-v[0-9]+)?[.]webp)"/) || [])[1];
    assert.ok(versionedIcon, "index.html should link a versioned favicon");
    const versionedIconResponse = await fetch(`http://127.0.0.1:${port}${versionedIcon}`);
    assert.equal(versionedIconResponse.status, 200, versionedIcon);
    assert.equal(versionedIconResponse.headers.get("cache-control"), "public, max-age=31536000, immutable");

    // 3-2. 이름이 그대로인 /favicon.webp 는 바꾸면 바로 보이도록 매번 확인하게 한다.
    const iconResponse = await fetch(`http://127.0.0.1:${port}/favicon.webp`);
    assert.equal(iconResponse.status, 200);
    assert.equal(iconResponse.headers.get("cache-control"), "no-cache, must-revalidate");

    // 3-3. 옛 주소(.ico, .png)는 /favicon.webp 로 넘기고, 넘김 자체는 붙잡아 두지 않는다.
    for (const legacyIcon of ["/favicon.ico", "/favicon.png"]) {
      const legacyResponse = await fetch(`http://127.0.0.1:${port}${legacyIcon}`, { redirect: "manual" });
      assert.equal(legacyResponse.status, 302, legacyIcon);
      assert.equal(legacyResponse.headers.get("location"), "/favicon.webp", legacyIcon);
      assert.equal(legacyResponse.headers.get("cache-control"), "no-cache, must-revalidate", legacyIcon);
    }
    const followedResponse = await fetch(`http://127.0.0.1:${port}/favicon.ico`);
    assert.equal(followedResponse.status, 200);
    assert.equal(followedResponse.headers.get("content-type"), "image/webp");

    // 3-4. 크기별 아이콘은 버전 없이도 불리므로 하루만 둔다.
    for (const sizedIcon of ["/favicon-32x32.webp", "/favicon-48x48.webp", "/favicon-192x192.webp", "/apple-touch-icon.webp"]) {
      const sizedResponse = await fetch(`http://127.0.0.1:${port}${sizedIcon}`);
      assert.equal(sizedResponse.status, 200, sizedIcon);
      assert.equal(sizedResponse.headers.get("cache-control"), "public, max-age=86400", sizedIcon);
    }

    // 4. Test JavaScript asset Cache-Control header
    const jsResponse = await fetch(`http://127.0.0.1:${port}/assets/sound/music-control.js`);
    assert.equal(jsResponse.status, 200);
    assert.equal(jsResponse.headers.get("cache-control"), "public, max-age=86400");

    // Relocated apps still serve their legacy public URLs and clean HTML paths.
    for (const directory of ['boards', 'classboard', 'parent']) {
      const redirect = await fetch(`http://127.0.0.1:${port}/${directory}?check=1`, { redirect: 'manual' });
      assert.equal(redirect.status, 308, directory);
      assert.equal(redirect.headers.get('location'), `/${directory}/?check=1`);
      const page = await fetch(`http://127.0.0.1:${port}/${directory}/`);
      assert.equal(page.status, 200, directory);
      assert.match(await page.text(), /<html/i);
      const oldHtml = await fetch(`http://127.0.0.1:${port}/${directory}/index.html`, { redirect: 'manual' });
      assert.equal(oldHtml.headers.get('location'), `/${directory}/`);
    }
    const boardsScript = await fetch(`http://127.0.0.1:${port}/boards/app.js`);
    assert.equal(boardsScript.status, 200);
    assert.equal(await boardsScript.text(), fs.readFileSync(path.join(__dirname, '../apps/boards/app.js'), 'utf8'));
    const avatarName = fs.readdirSync(path.join(__dirname, '../apps/classtools/assets/avatars')).find(name => name.endsWith('.webp'));
    const avatarResponse = await fetch(`http://127.0.0.1:${port}/assets/avatars/${avatarName}`);
    assert.equal(avatarResponse.status, 200);
    assert.equal(avatarResponse.headers.get('content-type'), 'image/webp');

    for (const file of ['privacy.html', 'school-setup.html', 'student-privacy.html', 'support.html', 'terms.html']) {
      const route = `/${file.slice(0, -5)}`;
      const page = await fetch(`http://127.0.0.1:${port}${route}`);
      assert.equal(page.status, 200, route);
      assert.match(await page.text(), /<html/i);
      const legacy = await fetch(`http://127.0.0.1:${port}/${file}?check=1`, { redirect: 'manual' });
      assert.equal(legacy.status, 308, file);
      assert.equal(legacy.headers.get('location'), `${route}?check=1`);
    }
    for (const file of ['naver5fab431f6334045f5b69668ad71fc3c8.html', 'naverc953171c2ff3a730580e7ed2be00700d.html']) {
      const verification = await fetch(`http://127.0.0.1:${port}/${file}`);
      assert.equal(verification.status, 200, file);
      assert.equal((await verification.text()).trim(), `naver-site-verification: ${file}`);
    }

    console.log("Static Cache Headers, Legacy App URLs and Site Pages Test: OK");
  } finally {
    child.kill();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
