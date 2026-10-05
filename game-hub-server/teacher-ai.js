'use strict';
// 교사용 AI(제미나이) 연결. 키는 브라우저가 아니라 서버에 계정별로 암호화해 두고,
// 구글에는 서버가 대신 요청한다. 브라우저는 키를 다시 받아 볼 수 없다.
// 교무실 공용 컴퓨터에 키가 남지 않게 하려고 2026-10-06 브라우저 저장에서 옮겼다.
const express = require('express');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const API_ROOT = 'https://generativelanguage.googleapis.com/v1beta';
// 429·500·502·503·504 는 구글 쪽 사정이다. 곧 풀리는 경우가 많다.
const TRANSIENT = new Set([429, 500, 502, 503, 504]);
const MAX_PROMPT_CHARS = 60000;
const GENERATE_LIMIT_PER_MINUTE = 120;
const KEY_PATTERN = /^[A-Za-z0-9._-]{20,200}$/;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isDailyQuota(why) {
  return /per\s*day|PerDay|GenerateRequestsPerDay|daily/i.test(String(why || ''));
}

// 구글이 "27초 뒤에 다시" 하고 알려 주면 그만큼 기다린다.
function retryDelayFrom(why) {
  const text = String(why || '');
  const matched = text.match(/retry(?:Delay)?["'\s:]*([\d.]+)\s*s/i) || text.match(/in\s+([\d.]+)\s*seconds?/i);
  if (!matched) return 0;
  return Math.min(Math.round(Number(matched[1]) * 1000) + 500, 30000);
}

// gemini-3.8-flash 처럼 이름에 박힌 판 번호를 견줄 수 있는 수로 바꾼다.
function modelRank(name) {
  const matched = String(name).match(/gemini-(\d+)(?:\.(\d+))?/i);
  if (!matched) return -1;
  return Number(matched[1]) * 1000 + Number(matched[2] || 0);
}

// 글 다듬는 데에는 가벼운 것으로 넉넉하고, 공짜로 쓸 수 있는 몫도 많다.
function chooseModel(names, exclude) {
  const usable = names
    .map((name) => String(name || '').replace(/^models\//, ''))
    .filter((name) => name && name !== exclude && !/(vision|image|audio|live|embedding|tts|banana|veo|imagen)/i.test(name));
  if (usable.length === 0) return null;
  const flashes = usable.filter((name) => /flash/i.test(name) && !/(preview|exp|thinking|lite)/i.test(name));
  const candidates = flashes.length > 0 ? flashes : usable;
  return candidates.slice().sort((a, b) => modelRank(b) - modelRank(a) || a.length - b.length)[0];
}

// 답의 생김새가 주소마다 다르다. 어느 쪽이든 글자가 담긴 자리를 훑어 모은다.
function extractText(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) return data.output_text;
  const found = [];
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(walk); return; }
    for (const [key, value] of Object.entries(node)) {
      if (key === 'text' && typeof value === 'string') found.push(value);
      else walk(value);
    }
  };
  walk(data);
  return found.join('\n');
}

// 암호화 비밀값. AI_KEY_SECRET 을 서버 환경변수로 두는 것이 바르다. 없으면 DB 주소에서
// 파생한 값을 쓴다 -- DB만 가져가서는 키를 못 읽게 하는 최소한의 울타리다.
function createCipher(secretSource) {
  const key = crypto.createHash('sha256').update(String(secretSource)).digest();
  return {
    seal(plain) {
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      const body = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
      return [iv, cipher.getAuthTag(), body].map((part) => part.toString('base64url')).join('.');
    },
    open(sealed) {
      const [iv, tag, body] = String(sealed || '').split('.').map((part) => Buffer.from(part, 'base64url'));
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(tag);
      return Buffer.concat([decipher.update(body), decipher.final()]).toString('utf8');
    }
  };
}

function createTeacherAi({ pool, requireTeacher, requireDatabase, HttpError, asyncRoute, secret, fetchImpl = globalThis.fetch, warn = console.warn }) {
  const router = express.Router();
  const fail = (code, message, status = 400) => { throw new HttpError(status, code, message); };
  const cipher = createCipher(secret.value);
  if (secret.derived) warn('[teacher-ai] AI_KEY_SECRET 이 없어 DB 주소에서 파생한 값으로 키를 암호화합니다. 서버 환경변수 AI_KEY_SECRET 을 두는 것이 좋습니다.');

  async function initialize() {
    if (pool) await pool.query(fs.readFileSync(path.join(__dirname, 'migrations/008-teacher-ai-keys.sql'), 'utf8'));
  }

  function authHeaders(apiKey, withBody) {
    // 키를 주소 뒤에 붙이면 AQ. 로 시작하는 새 키를 구글이 받지 않고 중간 기록에도 남는다. 머리말로 보낸다.
    const headers = { 'x-goog-api-key': apiKey };
    if (withBody) headers['Content-Type'] = 'application/json';
    return headers;
  }

  async function readError(res) {
    try { return ((await res.json()) || {}).error?.message || ''; } catch (_) { return ''; }
  }

  function failForStatus(status, why) {
    const tail = why ? ' (구글: ' + why + ')' : '';
    if (status === 429) {
      if (isDailyQuota(why)) fail('AI_DAILY_QUOTA', '일일 API 사용 한도에 도달했습니다. 한도가 초기화된 뒤 다시 시도해 주세요.', 429);
      fail('AI_RATE_LIMITED', 'API 요청 한도에 도달했습니다. 잠시 뒤 다시 시도해 주세요.' + tail, 429);
    }
    if (TRANSIENT.has(status)) fail('AI_UPSTREAM_BUSY', '지금 구글 쪽이 붐빕니다. 잠시 뒤에 다시 눌러 주세요.' + tail, 503);
    if (status === 401 || status === 403) fail('AI_KEY_REJECTED', 'API 키 또는 접근 권한을 확인해 주세요.' + tail, 400);
    fail('AI_UPSTREAM_ERROR', '구글이 요청을 받아 주지 않았습니다 (' + status + ')' + (why ? ': ' + why : ''), 502);
  }

  async function listModels(apiKey) {
    const res = await fetchImpl(API_ROOT + '/models', { headers: authHeaders(apiKey, false), signal: AbortSignal.timeout(20000) });
    if (!res.ok) failForStatus(res.status, await readError(res));
    const data = await res.json();
    return Array.isArray(data.models) ? data.models.map((m) => m.name) : [];
  }

  async function callOnce(url, apiKey, body) {
    const res = await fetchImpl(url, { method: 'POST', headers: authHeaders(apiKey, true), body: JSON.stringify(body), signal: AbortSignal.timeout(90000) });
    if (res.ok) return { data: await res.json() };
    return { status: res.status, why: await readError(res) };
  }

  // 붐빌 때는 기다리는 시간을 늘려 가며 다시 넣어 본다. 하루치를 다 썼다면 기다려도 소용없다.
  // 서버 요청 하나가 너무 길어지지 않게 모두 합쳐 40초 안에서만 기다린다.
  async function callWithRetry(url, apiKey, body) {
    let wait = 2000, waited = 0;
    for (let attempt = 1; ; attempt += 1) {
      const result = await callOnce(url, apiKey, body);
      if (result.data || !TRANSIENT.has(result.status) || attempt >= 4) return result;
      if (result.status === 429 && isDailyQuota(result.why)) return result;
      const delay = retryDelayFrom(result.why) || wait;
      if (waited + delay > 40000) return result;
      await sleep(delay); waited += delay; wait *= 2;
    }
  }

  // 주소 둘 중 되는 쪽을 쓴다. 404 는 그 주소가 없다는 뜻, 400 은 보내는 모양이 안 맞는다는 뜻이다.
  async function callGemini(model, apiKey, prompt) {
    const attempts = [
      [API_ROOT + '/interactions', { model, input: prompt, generation_config: { max_output_tokens: 4096 } }],
      [API_ROOT + '/models/' + model + ':generateContent', { contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 4096 } }]
    ];
    let firstWhy = '';
    for (const [url, body] of attempts) {
      const result = await callWithRetry(url, apiKey, body);
      if (result.data) return { data: result.data };
      if (!firstWhy) firstWhy = result.why;
      if (result.status !== 404 && result.status !== 400) failForStatus(result.status, result.why);
    }
    return { data: null, why: firstWhy };
  }

  async function storedKey(userId) {
    const row = (await pool.query('SELECT key_sealed, key_last4, model FROM teacher_ai_keys WHERE user_id = $1', [userId])).rows[0];
    if (!row) return null;
    try { return { apiKey: cipher.open(row.key_sealed), last4: row.key_last4, model: row.model }; }
    catch (_) { fail('AI_KEY_UNREADABLE', '저장된 키를 읽지 못했습니다. 키를 다시 등록해 주세요.', 409); }
  }

  async function rememberModel(userId, model) {
    await pool.query('UPDATE teacher_ai_keys SET model = $2, updated_at = NOW() WHERE user_id = $1', [userId, model]);
  }

  async function pickModel(userId, apiKey, remembered, exclude) {
    if (remembered && remembered !== exclude) return remembered;
    const model = chooseModel(await listModels(apiKey), exclude);
    if (!model) fail('AI_NO_MODEL', '이 키로 쓸 수 있는 모델이 없습니다.', 400);
    await rememberModel(userId, model);
    return model;
  }

  async function ask(userId, stored, prompt) {
    const first = await pickModel(userId, stored.apiKey, stored.model);
    let result;
    try {
      result = await callGemini(first, stored.apiKey, prompt);
    } catch (error) {
      if (error.code !== 'AI_UPSTREAM_BUSY') throw error;
      // 이 모델이 붐빈다. 다른 모델로 한 번만 더.
      const other = await pickModel(userId, stored.apiKey, null, first);
      if (other === first) throw error;
      result = await callGemini(other, stored.apiKey, prompt);
    }
    if (result.data === null) {
      // 구글이 "이건 그만 쓰고 이걸 쓰라"며 이름을 적어 보내기도 한다. 그러면 그대로 따라간다.
      const suggested = /use\s+models\/([A-Za-z0-9._-]+)/i.exec(result.why || '');
      let next;
      if (suggested) { next = suggested[1]; await rememberModel(userId, next); }
      else next = await pickModel(userId, stored.apiKey, null, first);
      result = await callGemini(next, stored.apiKey, prompt);
      if (result.data === null) {
        await rememberModel(userId, null);
        fail('AI_UPSTREAM_ERROR', '구글이 요청을 받아 주지 않았습니다.' + (result.why ? ' 구글이 알려 온 까닭: ' + result.why : ''), 502);
      }
    }
    const text = extractText(result.data);
    if (!text.trim()) {
      const why = result.data?.promptFeedback?.blockReason;
      fail('AI_EMPTY_ANSWER', why ? '답을 받지 못했습니다(' + why + '). 적으신 내용을 바꿔 보세요.' : '답이 비어 있습니다. 활동을 좀 더 자세히 적어 보세요.', 502);
    }
    return text;
  }

  // 한 계정이 1분에 너무 많이 부르지 못하게. 구글 쪽 한도와 별개로 서버를 지키는 선이다.
  const usage = new Map();
  function countGenerate(userId) {
    const now = Date.now();
    const entry = usage.get(userId) || { startedAt: now, count: 0 };
    if (now - entry.startedAt > 60000) { entry.startedAt = now; entry.count = 0; }
    entry.count += 1; usage.set(userId, entry);
    if (usage.size > 5000) usage.delete(usage.keys().next().value);
    if (entry.count > GENERATE_LIMIT_PER_MINUTE) fail('AI_TOO_MANY_REQUESTS', '잠시 뒤에 다시 시도해 주세요.', 429);
  }

  function cleanKey(value) {
    const key = String(value || '').trim();
    if (!key) fail('AI_KEY_REQUIRED', '저장할 API 키를 입력해 주세요.');
    if (!KEY_PATTERN.test(key)) fail('AI_KEY_INVALID', 'API 키 모양이 올바르지 않습니다.');
    return key;
  }

  const status = (row) => ({ registered: Boolean(row), last4: row ? row.last4 : '' });

  router.get('/key', asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireTeacher(req);
    const row = (await pool.query('SELECT key_last4 AS last4 FROM teacher_ai_keys WHERE user_id = $1', [user.id])).rows[0];
    res.json(status(row));
  }));

  router.put('/key', asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireTeacher(req);
    const key = cleanKey(req.body?.key);
    // 구글이 받아 주는 키인지 먼저 본다. 잘못 적은 키를 저장해 두면 다음에 와서야 안다.
    if ((await listModels(key)).length === 0) fail('AI_NO_MODEL', '이 키로 사용할 수 있는 모델이 없습니다.');
    const last4 = key.slice(-4);
    await pool.query(
      `INSERT INTO teacher_ai_keys (user_id, key_sealed, key_last4, model, updated_at)
       VALUES ($1, $2, $3, NULL, NOW())
       ON CONFLICT (user_id) DO UPDATE SET key_sealed = EXCLUDED.key_sealed, key_last4 = EXCLUDED.key_last4, model = NULL, updated_at = NOW()`,
      [user.id, cipher.seal(key), last4]
    );
    res.json({ registered: true, last4 });
  }));

  router.delete('/key', asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireTeacher(req);
    await pool.query('DELETE FROM teacher_ai_keys WHERE user_id = $1', [user.id]);
    res.json({ registered: false, last4: '' });
  }));

  // 적어 둔 키(입력한 것이 있으면 그것)로 구글이 응답하는지만 본다.
  router.post('/check', asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireTeacher(req);
    let key = String(req.body?.key || '').trim();
    if (!key) {
      const stored = await storedKey(user.id);
      if (!stored) fail('AI_KEY_REQUIRED', '확인할 API 키를 입력해 주세요.');
      key = stored.apiKey;
    } else key = cleanKey(key);
    const models = await listModels(key);
    if (models.length === 0) fail('AI_NO_MODEL', '이 키로 사용할 수 있는 모델이 없습니다.');
    res.json({ ok: true, models: models.length });
  }));

  router.post('/generate', asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireTeacher(req);
    const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt : '';
    if (!prompt.trim()) fail('AI_PROMPT_REQUIRED', '요청할 내용이 비어 있습니다.');
    if (prompt.length > MAX_PROMPT_CHARS) fail('AI_PROMPT_TOO_LONG', '요청이 너무 깁니다. 나눠서 보내 주세요.');
    countGenerate(user.id);
    const stored = await storedKey(user.id);
    if (!stored) fail('AI_KEY_REQUIRED', '내 정보의 AI 설정에서 API 키를 등록해 주세요.', 409);
    const text = await ask(user.id, stored, prompt);
    res.json({ text });
  }));

  return { router, initialize };
}

module.exports = { createTeacherAi, createCipher, chooseModel, extractText, retryDelayFrom, isDailyQuota };
