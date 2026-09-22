import assert from "node:assert/strict";
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
    const imgResponse = await fetch(`http://127.0.0.1:${port}/assets/images/indexbg.jpg`);
    assert.equal(imgResponse.status, 200);
    assert.equal(imgResponse.headers.get("cache-control"), "public, max-age=31536000, immutable");

    // 3. Test Favicon Cache-Control header
    const icoResponse = await fetch(`http://127.0.0.1:${port}/favicon.ico`);
    assert.equal(icoResponse.status, 200);
    assert.equal(icoResponse.headers.get("cache-control"), "public, max-age=31536000, immutable");

    // 4. Test JavaScript asset Cache-Control header
    const jsResponse = await fetch(`http://127.0.0.1:${port}/assets/sound/music-control.js`);
    assert.equal(jsResponse.status, 200);
    assert.equal(jsResponse.headers.get("cache-control"), "public, max-age=86400");

    console.log("Static Cache Headers Test: OK");
  } finally {
    child.kill();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
