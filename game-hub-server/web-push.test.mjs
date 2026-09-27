import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

const require = createRequire(import.meta.url);
const {
  pushSchema, createWebPush, encryptPayload, vapidAuthorization,
  generateVapidKeys, normalizeSubscription
} = require("./web-push.js");

// RFC 8291 5장 예시. 보내는 쪽 열쇠와 소금을 고정하면 결과가 한 글자까지 같아야 한다.
const RFC = {
  plaintext: "When I grow up, I want to be a watermelon",
  auth: "BTBZMqHH6r4Tts7J_aSIgg",
  uaPublic: "BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4",
  uaPrivate: "q1dXpw3UpT5VOmu_cf_v6ih07Aems3njxI-JWgLcM94",
  asPrivate: "yfWPiYE-n46HLnH0KqZOF1fJJU3MYrct3AELtAQ-oRw",
  salt: "DGv6ra1nlYgDCS1FRnbzlw",
  body: "DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27ml"
    + "mlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A_yl95bQpu6cVPT"
    + "pK4Mqgkf1CXztLVBSt2Ks3oZwbuwXPXLWyouBWLVWGNWQexSgSxsj_Qulcy4a-fN"
};

test("encryption matches the RFC 8291 worked example byte for byte", () => {
  const body = encryptPayload(RFC.plaintext, { p256dh: RFC.uaPublic, auth: RFC.auth }, {
    senderPrivateKey: RFC.asPrivate,
    salt: RFC.salt
  });
  // 예시의 Content-Length 는 145 라고 적혀 있지만 실린 본문(192자)은 144 바이트다.
  // 본문 쪽이 맞다: 머리 86 + 글 41 + 끝 표시 1 + 인증 꼬리 16.
  assert.equal(body.length, 144);
  assert.equal(body.toString("base64url"), RFC.body);
});

// 받는 기기가 하는 일. 시험에서만 쓴다.
function decryptAsBrowser(body, uaPrivateB64, uaPublicB64, authB64) {
  const salt = body.subarray(0, 16);
  const idLength = body.readUInt8(20);
  const asPublic = body.subarray(21, 21 + idLength);
  const sealed = body.subarray(21 + idLength);
  const ecdh = crypto.createECDH("prime256v1");
  ecdh.setPrivateKey(Buffer.from(uaPrivateB64, "base64url"));
  const secret = ecdh.computeSecret(asPublic);
  const uaPublic = Buffer.from(uaPublicB64, "base64url");
  const keyInfo = Buffer.concat([Buffer.from("WebPush: info\0"), uaPublic, asPublic]);
  const ikm = Buffer.from(crypto.hkdfSync("sha256", secret, Buffer.from(authB64, "base64url"), keyInfo, 32));
  const cek = Buffer.from(crypto.hkdfSync("sha256", ikm, salt, Buffer.from("Content-Encoding: aes128gcm\0"), 16));
  const nonce = Buffer.from(crypto.hkdfSync("sha256", ikm, salt, Buffer.from("Content-Encoding: nonce\0"), 12));
  const decipher = crypto.createDecipheriv("aes-128-gcm", cek, nonce);
  decipher.setAuthTag(sealed.subarray(sealed.length - 16));
  const padded = Buffer.concat([decipher.update(sealed.subarray(0, sealed.length - 16)), decipher.final()]);
  assert.equal(padded[padded.length - 1], 0x02, "last-record delimiter");
  return padded.subarray(0, padded.length - 1).toString("utf8");
}

function makeBrowserKeys() {
  const ecdh = crypto.createECDH("prime256v1");
  ecdh.generateKeys();
  return {
    p256dh: ecdh.getPublicKey().toString("base64url"),
    privateKey: ecdh.getPrivateKey().toString("base64url"),
    auth: crypto.randomBytes(16).toString("base64url")
  };
}

test("a fresh message decrypts on the receiving side", () => {
  const browser = makeBrowserKeys();
  const text = JSON.stringify({ title: "알림장 · 3학년 2반", body: "내일 준비물: 색연필" });
  const body = encryptPayload(text, browser);
  assert.equal(decryptAsBrowser(body, browser.privateKey, browser.p256dh, browser.auth), text);
});

test("the VAPID signature verifies with the published public key", () => {
  const keys = generateVapidKeys();
  const header = vapidAuthorization("https://fcm.googleapis.com/fcm/send/abc", keys, "https://classj.kr", 1_700_000_000_000);
  const match = /^vapid t=([^.]+)\.([^.]+)\.([^,]+), k=(.+)$/.exec(header);
  assert.ok(match, header);
  const [, h, c, s, k] = match;
  assert.equal(k, keys.publicKey);
  const claims = JSON.parse(Buffer.from(c, "base64url").toString());
  assert.deepEqual(claims, { aud: "https://fcm.googleapis.com", exp: 1_700_000_000 + 43200, sub: "https://classj.kr" });
  const pub = Buffer.from(keys.publicKey, "base64url");
  const verifyKey = crypto.createPublicKey({
    format: "jwk",
    key: { kty: "EC", crv: "P-256", x: pub.subarray(1, 33).toString("base64url"), y: pub.subarray(33).toString("base64url") }
  });
  assert.ok(crypto.verify("sha256", Buffer.from(`${h}.${c}`), { key: verifyKey, dsaEncoding: "ieee-p1363" }, Buffer.from(s, "base64url")));
});

test("only real push services are accepted as endpoints", () => {
  const keys = makeBrowserKeys();
  const ok = (endpoint) => normalizeSubscription({ endpoint, keys });
  assert.ok(ok("https://fcm.googleapis.com/fcm/send/xyz"));
  assert.ok(ok("https://web.push.apple.com/QGa8"));
  assert.ok(ok("https://updates.push.services.mozilla.com/wpush/v2/gAAA"));
  assert.ok(ok("https://wns2-pn1p.notify.windows.com/w/?token=abc"));
  // 서버가 남의 주소나 내부망을 두드리게 하는 주소는 모두 거절.
  assert.equal(ok("http://fcm.googleapis.com/fcm/send/xyz"), null);
  assert.equal(ok("https://fcm.googleapis.com.evil.example/x"), null);
  assert.equal(ok("https://evilfcm.googleapis.com/x"), null);
  assert.equal(ok("https://localhost/x"), null);
  assert.equal(ok("https://169.254.169.254/latest"), null);
  assert.equal(ok("https://fcm.googleapis.com:8443/x"), null);
  assert.equal(ok("https://user@fcm.googleapis.com/x"), null);
  // 열쇠 모양이 틀린 것도.
  assert.equal(normalizeSubscription({ endpoint: "https://fcm.googleapis.com/x", keys: { p256dh: "abc", auth: keys.auth } }), null);
  assert.equal(normalizeSubscription({ endpoint: "https://fcm.googleapis.com/x", keys: { p256dh: keys.p256dh, auth: "abc" } }), null);
});

async function withDb(run) {
  const db = new PGlite();
  try {
    await db.exec(`CREATE TABLE classroom_users (id BIGSERIAL PRIMARY KEY, email TEXT)`);
    for (const statement of pushSchema) await db.query(statement);
    await db.exec(`INSERT INTO classroom_users (email) VALUES ('a@x'), ('b@x'), ('c@x')`);
    await run(db);
  } finally {
    await db.close();
  }
}

test("sending delivers to every device, drops gone devices, and keeps one key pair", async () => {
  await withDb(async (db) => {
    const phoneA = makeBrowserKeys();
    const tabletA = makeBrowserKeys();
    const phoneB = makeBrowserKeys();
    const delivered = [];
    const statusFor = new Map();
    const fakeFetch = async (url, init) => {
      delivered.push({ url, init });
      return { status: statusFor.get(url) || 201 };
    };
    const push = createWebPush({ pool: db, subject: "https://classj.kr", fetchImpl: fakeFetch, log: { warn() {} } });

    const key1 = await push.publicKey();
    const key2 = await createWebPush({ pool: db, subject: "x" }).publicKey();
    assert.equal(key1, key2, "a second server instance must reuse the stored key pair");

    const sub = (name, k) => ({ endpoint: `https://fcm.googleapis.com/fcm/send/${name}`, keys: { p256dh: k.p256dh, auth: k.auth } });
    assert.equal(await push.saveSubscription(1, sub("phoneA", phoneA), "UA"), true);
    assert.equal(await push.saveSubscription(1, sub("tabletA", tabletA), "UA"), true);
    assert.equal(await push.saveSubscription(2, sub("phoneB", phoneB), "UA"), true);
    assert.equal(await push.saveSubscription(2, { endpoint: "https://localhost/x", keys: sub("x", phoneB).keys }), false);

    statusFor.set("https://fcm.googleapis.com/fcm/send/tabletA", 410);
    const messages = new Map([
      ["1", { title: "알림장 · 3학년 2반", body: "내일 체육복", url: "/classboard/?board=class:7" }],
      ["2", { title: "알림장 · 3학년 2반 · 둘째", body: "내일 체육복", url: "/classboard/?board=class:7" }]
    ]);
    const result = await push.sendToUsers(messages);
    assert.deepEqual(result, { sent: 2, removed: 1, failed: 0 });

    const toPhoneA = delivered.find(d => d.url.endsWith("/phoneA"));
    assert.equal(toPhoneA.init.headers["Content-Encoding"], "aes128gcm");
    assert.match(toPhoneA.init.headers.Authorization, new RegExp(`k=${key1}$`));
    const opened = JSON.parse(decryptAsBrowser(toPhoneA.init.body, phoneA.privateKey, phoneA.p256dh, phoneA.auth));
    assert.deepEqual(opened, messages.get("1"));
    const toPhoneB = delivered.find(d => d.url.endsWith("/phoneB"));
    assert.equal(JSON.parse(decryptAsBrowser(toPhoneB.init.body, phoneB.privateKey, phoneB.p256dh, phoneB.auth)).title, "알림장 · 3학년 2반 · 둘째");

    const left = await db.query("SELECT endpoint FROM classroom_push_subscriptions ORDER BY endpoint");
    assert.deepEqual(left.rows.map(r => r.endpoint.split("/").pop()), ["phoneA", "phoneB"]);
  });
});

test("the same device signed in by someone else changes owner instead of doubling", async () => {
  await withDb(async (db) => {
    const push = createWebPush({ pool: db, subject: "x", fetchImpl: async () => ({ status: 201 }) });
    const device = makeBrowserKeys();
    const sub = { endpoint: "https://web.push.apple.com/shared-ipad", keys: { p256dh: device.p256dh, auth: device.auth } };
    await push.saveSubscription(1, sub);
    await push.saveSubscription(3, sub);
    const rows = await db.query("SELECT user_id FROM classroom_push_subscriptions");
    assert.equal(rows.rows.length, 1);
    assert.equal(String(rows.rows[0].user_id), "3");
    // 예전 주인에게는 더 이상 가지 않는다.
    assert.deepEqual(await push.sendToUsers(new Map([["1", { title: "t", body: "b", url: "/" }]])), { sent: 0, removed: 0, failed: 0 });
  });
});

test("a device that keeps failing is dropped on the twentieth failure, not before", async () => {
  await withDb(async (db) => {
    const push = createWebPush({ pool: db, subject: "x", fetchImpl: async () => ({ status: 500 }), log: { warn() {} } });
    const device = makeBrowserKeys();
    await push.saveSubscription(1, { endpoint: "https://fcm.googleapis.com/fcm/send/flaky", keys: { p256dh: device.p256dh, auth: device.auth } });
    const one = new Map([["1", { title: "t", body: "b", url: "/" }]]);
    for (let i = 0; i < 19; i += 1) await push.sendToUsers(one);
    assert.equal((await db.query("SELECT failure_count FROM classroom_push_subscriptions")).rows[0].failure_count, 19);
    await push.sendToUsers(one);
    assert.equal((await db.query("SELECT COUNT(*)::INT AS n FROM classroom_push_subscriptions")).rows[0].n, 0);
  });
});

test("each person keeps at most ten devices", async () => {
  await withDb(async (db) => {
    const push = createWebPush({ pool: db, subject: "x" });
    for (let i = 0; i < 12; i += 1) {
      const device = makeBrowserKeys();
      await push.saveSubscription(1, { endpoint: `https://fcm.googleapis.com/fcm/send/d${i}`, keys: { p256dh: device.p256dh, auth: device.auth } });
    }
    const rows = await db.query("SELECT endpoint FROM classroom_push_subscriptions WHERE user_id = 1");
    assert.equal(rows.rows.length, 10);
    assert.ok(!rows.rows.some(r => r.endpoint.endsWith("/d0")), "the oldest device goes first");
  });
});
