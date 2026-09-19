import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const express = require("express");
const { redirectLegacyHosts } = require("./canonical-host.js");

const serverSource = fs.readFileSync(new URL("./server.js", import.meta.url), "utf8");
assert.match(
  serverSource,
  /app\.set\("trust proxy", 1\);[\s\S]*app\.use\(redirectLegacyHosts\);\s*app\.use\(\(req, res, next\) => \{\s*res\.setHeader\("Content-Security-Policy"/,
  "Legacy hosts must be redirected before any other middleware runs.",
);

const app = express();
app.set("trust proxy", 1);
app.use(redirectLegacyHosts);
app.all("*", (req, res) => res.status(200).send("served"));
const server = app.listen(0);
await new Promise((resolve) => server.once("listening", resolve));
const { port } = server.address();

function request(method, host, path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ port, method, path, headers: { Host: host } }, (res) => {
      res.resume();
      res.on("end", () => resolve({ status: res.statusCode, location: res.headers.location }));
    });
    req.on("error", reject);
    req.end();
  });
}

try {
  const cases = [
    ["GET", "joyclass.kr", "/", 301, "https://classj.kr/"],
    ["GET", "joyclass.kr", "/admin/?tab=users", 301, "https://classj.kr/admin/?tab=users"],
    ["GET", "www.joyclass.kr", "/learn/world-voyage/", 301, "https://classj.kr/learn/world-voyage/"],
    ["HEAD", "JoyClass.KR", "/privacy", 301, "https://classj.kr/privacy"],
    ["GET", "songhwaplay.onrender.com", "/terms", 301, "https://classj.kr/terms"],
    ["GET", "joyclass.kr", "//evil.example/x", 301, "https://classj.kr//evil.example/x"],
    ["GET", "joyclass.kr", "/health", 200, undefined],
    ["GET", "songhwaplay.onrender.com", "/health", 200, undefined],
    ["GET", "joyclass.kr", "/api/site/access", 200, undefined],
    ["POST", "joyclass.kr", "/api/auth/google", 200, undefined],
    ["POST", "joyclass.kr", "/", 200, undefined],
    ["GET", "classj.kr", "/", 200, undefined],
    ["GET", "localhost", "/", 200, undefined],
  ];
  for (const [method, host, path, status, location] of cases) {
    const res = await request(method, host, path);
    assert.equal(res.status, status, `${method} ${host}${path} status`);
    assert.equal(res.location, location, `${method} ${host}${path} location`);
  }
} finally {
  server.close();
}

console.log("Canonical host redirect contract passed.");
