"use strict";

// 휴대폰 알림 보내기.
//
// 브라우저 알림은 우리 서버가 휴대폰에 바로 보내지 못한다. 브라우저를 만든 회사가
// 운영하는 배달 창구(구글·애플·모질라·마이크로소프트)에 맡기면 그쪽이 휴대폰까지
// 가져다준다. 다른 길이 없어 '바깥 서버 금지'의 예외다. 대신 맡기는 글은 받는
// 기기만 풀 수 있게 암호로 싸서 보낸다(RFC 8291). 창구는 내용을 못 읽는다.
//
// 라이브러리 없이 node:crypto 로만 짠다. 계산이 표준 예시와 한 글자까지 같은지는
// web-push.test.mjs 가 RFC 8291 부록 A 의 값으로 확인한다.

const crypto = require("node:crypto");

const RECORD_SIZE = 4096;
// 창구가 받는 크기는 4096 바이트까지. 머리 86 + 인증 꼬리 16 + 끝 표시 1 을 빼면
// 글은 넉넉히 3000 바이트 안에서 끊는다.
const MAX_PLAINTEXT_BYTES = 3000;

// 사용자가 보내 준 주소로 서버가 요청을 보내므로, 아무 주소나 받으면 서버가 남의
// 서버(또는 우리 내부망)를 두드리는 심부름꾼이 된다. 알려진 배달 창구만 받는다.
const PUSH_SERVICE_HOSTS = [
  /^fcm\.googleapis\.com$/,
  /^android\.googleapis\.com$/,
  /^([a-z0-9-]+\.)*push\.services\.mozilla\.com$/,
  /^([a-z0-9-]+\.)*push\.apple\.com$/,
  /^([a-z0-9-]+\.)*notify\.windows\.com$/
];

const pushSchema = [
  // 서버 열쇠 한 쌍. 바뀌면 받아 둔 기기 주소가 전부 못 쓰게 되므로 한 번 만들어
  // 영구히 쓴다. 환경 변수로 따로 설정할 일이 없도록 데이터베이스에 둔다.
  `CREATE TABLE IF NOT EXISTS classroom_push_keys (
    id SMALLINT PRIMARY KEY CHECK (id = 1),
    public_key TEXT NOT NULL,
    private_key TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  // 알림을 받겠다고 한 기기마다 한 줄. 같은 기기에 다른 사람이 로그인해 다시 켜면
  // 주인이 바뀐다(endpoint 가 기기 하나를 가리킨다).
  `CREATE TABLE IF NOT EXISTS classroom_push_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES classroom_users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_agent TEXT,
    failure_count INTEGER NOT NULL DEFAULT 0,
    last_success_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS classroom_push_subscriptions_user_idx
    ON classroom_push_subscriptions (user_id)`
];

function b64url(buffer) {
  return Buffer.from(buffer).toString("base64url");
}

function fromB64url(value) {
  return Buffer.from(String(value || ""), "base64url");
}

function leftPad32(buffer) {
  if (buffer.length >= 32) return buffer;
  return Buffer.concat([Buffer.alloc(32 - buffer.length), buffer]);
}

function generateVapidKeys() {
  const ecdh = crypto.createECDH("prime256v1");
  ecdh.generateKeys();
  return {
    publicKey: b64url(ecdh.getPublicKey()),
    privateKey: b64url(leftPad32(ecdh.getPrivateKey()))
  };
}

function vapidSigningKey({ publicKey, privateKey }) {
  const pub = fromB64url(publicKey);
  return crypto.createPrivateKey({
    format: "jwk",
    key: {
      kty: "EC",
      crv: "P-256",
      x: b64url(pub.subarray(1, 33)),
      y: b64url(pub.subarray(33, 65)),
      d: b64url(leftPad32(fromB64url(privateKey)))
    }
  });
}

// 창구에 "우리가 보낸 것"임을 밝히는 서명 (RFC 8292).
function vapidAuthorization(endpoint, keys, subject, now = Date.now()) {
  const header = b64url(JSON.stringify({ typ: "JWT", alg: "ES256" }));
  const claims = b64url(JSON.stringify({
    aud: new URL(endpoint).origin,
    exp: Math.floor(now / 1000) + 12 * 60 * 60,
    sub: subject
  }));
  const unsigned = `${header}.${claims}`;
  const signature = crypto.sign("sha256", Buffer.from(unsigned), {
    key: vapidSigningKey(keys),
    dsaEncoding: "ieee-p1363"
  });
  return `vapid t=${unsigned}.${b64url(signature)}, k=${keys.publicKey}`;
}

function hkdf(ikm, salt, info, length) {
  return Buffer.from(crypto.hkdfSync("sha256", ikm, salt, info, length));
}

// RFC 8291: 받는 기기의 공개 열쇠와 비밀값으로만 풀리게 싼다.
// senderPrivateKey 와 salt 는 표준 예시로 시험할 때만 넘긴다. 실제로는 매번 새로 만든다.
function encryptPayload(plaintext, subscriptionKeys, options = {}) {
  const uaPublic = fromB64url(subscriptionKeys.p256dh);
  const authSecret = fromB64url(subscriptionKeys.auth);
  if (uaPublic.length !== 65 || uaPublic[0] !== 0x04) throw new Error("BAD_P256DH");
  if (authSecret.length !== 16) throw new Error("BAD_AUTH");

  const ecdh = crypto.createECDH("prime256v1");
  if (options.senderPrivateKey) ecdh.setPrivateKey(fromB64url(options.senderPrivateKey));
  else ecdh.generateKeys();
  const asPublic = ecdh.getPublicKey();
  const ecdhSecret = ecdh.computeSecret(uaPublic);
  const salt = options.salt ? fromB64url(options.salt) : crypto.randomBytes(16);

  const keyInfo = Buffer.concat([Buffer.from("WebPush: info\0"), uaPublic, asPublic]);
  const ikm = hkdf(ecdhSecret, authSecret, keyInfo, 32);
  const cek = hkdf(ikm, salt, Buffer.from("Content-Encoding: aes128gcm\0"), 16);
  const nonce = hkdf(ikm, salt, Buffer.from("Content-Encoding: nonce\0"), 12);

  const cipher = crypto.createCipheriv("aes-128-gcm", cek, nonce);
  // 0x02: 마지막 조각이라는 표시.
  const sealed = Buffer.concat([
    cipher.update(Buffer.concat([Buffer.from(plaintext), Buffer.from([0x02])])),
    cipher.final(),
    cipher.getAuthTag()
  ]);

  const header = Buffer.alloc(21);
  salt.copy(header, 0);
  header.writeUInt32BE(RECORD_SIZE, 16);
  header.writeUInt8(asPublic.length, 20);
  return Buffer.concat([header, asPublic, sealed]);
}

function isPushServiceEndpoint(endpoint) {
  let url;
  try {
    url = new URL(String(endpoint || ""));
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || url.port || url.username || url.password) return false;
  return PUSH_SERVICE_HOSTS.some((pattern) => pattern.test(url.hostname));
}

// 기기가 알려 준 받는 주소가 쓸 만한지. 저장하기 전에 거른다.
function normalizeSubscription(input) {
  const endpoint = String(input?.endpoint || "").trim();
  const p256dh = String(input?.keys?.p256dh || "").trim();
  const auth = String(input?.keys?.auth || "").trim();
  if (endpoint.length > 2048 || !isPushServiceEndpoint(endpoint)) return null;
  const pub = fromB64url(p256dh);
  if (pub.length !== 65 || pub[0] !== 0x04) return null;
  if (fromB64url(auth).length !== 16) return null;
  return { endpoint, p256dh, auth };
}

// 알림 글은 짧게. 잠금 화면에 두세 줄이면 충분하고, 창구의 크기 한도도 있다.
function clipText(value, maxChars) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > maxChars ? `${text.slice(0, maxChars - 1)}…` : text;
}

function createWebPush({ pool, subject, fetchImpl = globalThis.fetch, log = console }) {
  let keysPromise = null;

  function loadKeys() {
    if (!keysPromise) {
      keysPromise = (async () => {
        const existing = await pool.query("SELECT public_key, private_key FROM classroom_push_keys WHERE id = 1");
        if (existing.rows[0]) {
          return { publicKey: existing.rows[0].public_key, privateKey: existing.rows[0].private_key };
        }
        const fresh = generateVapidKeys();
        // 서버 두 대가 동시에 만들어도 먼저 들어간 한 쌍만 남는다. 그걸 다시 읽는다.
        await pool.query(
          `INSERT INTO classroom_push_keys (id, public_key, private_key) VALUES (1, $1, $2)
           ON CONFLICT (id) DO NOTHING`,
          [fresh.publicKey, fresh.privateKey]
        );
        const saved = await pool.query("SELECT public_key, private_key FROM classroom_push_keys WHERE id = 1");
        return { publicKey: saved.rows[0].public_key, privateKey: saved.rows[0].private_key };
      })().catch((error) => {
        keysPromise = null;
        throw error;
      });
    }
    return keysPromise;
  }

  async function publicKey() {
    return (await loadKeys()).publicKey;
  }

  async function saveSubscription(userId, input, userAgent) {
    const sub = normalizeSubscription(input);
    if (!sub) return false;
    await pool.query(
      `INSERT INTO classroom_push_subscriptions (user_id, endpoint, p256dh, auth, user_agent)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (endpoint) DO UPDATE
         SET user_id = EXCLUDED.user_id, p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth,
             user_agent = EXCLUDED.user_agent, failure_count = 0, updated_at = NOW()`,
      [userId, sub.endpoint, sub.p256dh, sub.auth, clipText(userAgent, 300) || null]
    );
    // 기기를 바꿀 때마다 줄이 쌓이지 않게, 한 사람당 최근 기기 열 대만 남긴다.
    await pool.query(
      `DELETE FROM classroom_push_subscriptions
       WHERE user_id = $1 AND id NOT IN (
         SELECT id FROM classroom_push_subscriptions WHERE user_id = $1
         ORDER BY updated_at DESC, id DESC LIMIT 10
       )`,
      [userId]
    );
    return true;
  }

  async function removeSubscription(userId, endpoint) {
    await pool.query(
      "DELETE FROM classroom_push_subscriptions WHERE user_id = $1 AND endpoint = $2",
      [userId, String(endpoint || "")]
    );
  }

  async function sendOne(sub, body, keys, ttlSeconds) {
    const response = await fetchImpl(sub.endpoint, {
      method: "POST",
      headers: {
        TTL: String(ttlSeconds),
        Urgency: "normal",
        "Content-Type": "application/octet-stream",
        "Content-Encoding": "aes128gcm",
        Authorization: vapidAuthorization(sub.endpoint, keys, subject)
      },
      body: encryptPayload(body, sub),
      signal: AbortSignal.timeout(10000)
    });
    return response.status;
  }

  // 한 사람에게 가는 알림을 그 사람의 기기 전부에 보낸다.
  // messagesByUser: Map(String(userId) → { title, body, url })
  async function sendToUsers(messagesByUser, { ttlSeconds = 24 * 60 * 60 } = {}) {
    const userIds = [...messagesByUser.keys()];
    if (userIds.length === 0) return { sent: 0, removed: 0, failed: 0 };
    const keys = await loadKeys();
    const subs = await pool.query(
      `SELECT id, user_id, endpoint, p256dh, auth FROM classroom_push_subscriptions
       WHERE user_id = ANY($1::BIGINT[])`,
      [userIds]
    );

    const result = { sent: 0, removed: 0, failed: 0 };
    const queue = [...subs.rows];
    // 창구가 여럿이라 한꺼번에 몇 개씩만. 한 반 서른 가구면 금방 끝난다.
    const workers = Array.from({ length: Math.min(6, queue.length) }, async () => {
      while (queue.length > 0) {
        const sub = queue.shift();
        const message = messagesByUser.get(String(sub.user_id));
        if (!message) continue;
        let body = JSON.stringify(message);
        if (Buffer.byteLength(body) > MAX_PLAINTEXT_BYTES) {
          body = JSON.stringify({ ...message, body: clipText(message.body, 200) });
        }
        try {
          const status = await sendOne(sub, body, keys, ttlSeconds);
          if (status >= 200 && status < 300) {
            result.sent += 1;
            await pool.query(
              `UPDATE classroom_push_subscriptions
               SET failure_count = 0, last_success_at = NOW() WHERE id = $1`,
              [sub.id]
            );
          } else if (status === 404 || status === 410) {
            // 알림을 끄거나 앱을 지운 기기. 다시 보낼 까닭이 없다.
            result.removed += 1;
            await pool.query("DELETE FROM classroom_push_subscriptions WHERE id = $1", [sub.id]);
          } else {
            result.failed += 1;
            log.warn?.(`web push ${status} for subscription ${sub.id}`);
            await markFailure(sub.id);
          }
        } catch (error) {
          result.failed += 1;
          log.warn?.(`web push failed for subscription ${sub.id}: ${error.message}`);
          await markFailure(sub.id);
        }
      }
    });
    await Promise.all(workers);
    return result;
  }

  // 창구가 계속 거절하는 기기는 스무 번째에 지운다. 잠깐 끊긴 것까지 지우지 않도록 넉넉히.
  async function markFailure(id) {
    try {
      const bumped = await pool.query(
        `UPDATE classroom_push_subscriptions SET failure_count = failure_count + 1
         WHERE id = $1 RETURNING failure_count`,
        [id]
      );
      if (Number(bumped.rows[0]?.failure_count) >= 20) {
        await pool.query("DELETE FROM classroom_push_subscriptions WHERE id = $1", [id]);
      }
    } catch (error) {
      log.warn?.(`web push failure count not saved for ${id}: ${error.message}`);
    }
  }

  return { publicKey, saveSubscription, removeSubscription, sendToUsers };
}

module.exports = {
  pushSchema,
  createWebPush,
  encryptPayload,
  vapidAuthorization,
  generateVapidKeys,
  isPushServiceEndpoint,
  normalizeSubscription,
  clipText
};
