'use strict';
// 교사용 AI(제미나이) 연결. 키는 브라우저가 아니라 서버에 계정별로 암호화해 두고,
// 구글에는 서버가 대신 요청한다. 브라우저는 키를 다시 받아 볼 수 없다.
// 교무실 공용 컴퓨터에 키가 남지 않게 하려고 2026-10-06 브라우저 저장에서 옮겼다.
const express = require('express');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { readPlanDocument } = require('./plan-document');
const { cleanItems, LEVEL_LABELS } = require('./assessment-plans');

const API_ROOT = 'https://generativelanguage.googleapis.com/v1beta';
// 429·500·502·503·504 는 구글 쪽 사정이다. 곧 풀리는 경우가 많다.
const TRANSIENT = new Set([429, 500, 502, 503, 504]);
const MAX_PROMPT_CHARS = 60000;
const GENERATE_LIMIT_PER_MINUTE = 120;
const KEY_PATTERN = /^[A-Za-z0-9._-]{20,200}$/;
const MAX_PLAN_FILE_BYTES = 20 * 1024 * 1024;
const MAX_TOPICS = 40;
const STANDARDS_DIR = path.join(__dirname, '..', 'classtools', 'assessment-plan', 'data');

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

  // 수행평가(활동) 계획서에서 생활기록부에 쓸 "활동·특성 목록"을 뽑는다. 글로 읽은 문서는 글로,
  // PDF·그림은 그대로 붙여 보낸다. 답은 JSON 한 덩이만 받는다.
  function topicsPrompt(context, documentText) {
    const areaName = { subject: '과목별 학기말 종합의견', activity: '창의적 체험활동 특기사항', behavior: '행동특성 및 종합의견' }[context.area] || '과목별 학기말 종합의견';
    const conditions = [context.grade ? `학년: ${context.grade}학년` : '', context.subject ? `과목(영역): ${context.subject}` : '', context.semester ? `학기: ${context.semester}` : ''].filter(Boolean).join(', ');
    return [
      '너는 초·중·고 교사를 돕는 보조자다. 교사가 올린 수행평가(또는 활동) 계획 문서에서 생활기록부 「' + areaName + '」에 쓸 "활동·특성 목록"을 뽑아라.',
      '한 줄에 하나씩, 학생이 무엇을 했는지가 드러나는 짧은 구(句)로 적는다. 보기: "분수의 덧셈과 뺄셈 계산하기", "직사각형과 삼각형의 넓이 구하기", "실생활 문제를 식으로 나타내고 해결하기".',
      conditions ? '조건: ' + conditions + '. 문서에 여러 과목·학기·학년이 섞여 있으면 조건에 맞는 것만 고르고, 맞는 것이 하나도 없으면 전부 고른 뒤 note 에 그 사실을 적어라.' : '',
      '문서에 없는 내용을 지어내지 말고, 평가 기준(상·중·하)·배점·비율·날짜는 빼라. 같은 활동이 여러 번 나오면 하나로 합쳐라. 최대 ' + MAX_TOPICS + '개.',
      '반드시 아래 모양의 JSON 만 답하라. 다른 말은 쓰지 마라.',
      '{"subject":"문서의 과목 또는 영역","semester":"1학기|2학기|","topics":[{"title":"활동 주제 한 줄","detail":"단원·평가 요소 같은 짧은 메모"}],"note":"알릴 것이 있으면 한 줄"}',
      documentText ? '\n문서 내용:\n' + documentText : ''
    ].filter(Boolean).join('\n');
  }

  function parseTopics(text) {
    const body = String(text || '').replace(/^```(?:json)?/m, '').replace(/```\s*$/m, '');
    const start = body.indexOf('{'), end = body.lastIndexOf('}');
    if (start < 0 || end <= start) fail('AI_TOPICS_UNREADABLE', '문서에서 목록을 읽어 내지 못했습니다. 다른 파일로 다시 해 보세요.', 502);
    let parsed;
    try { parsed = JSON.parse(body.slice(start, end + 1)); } catch (_) { fail('AI_TOPICS_UNREADABLE', '문서에서 목록을 읽어 내지 못했습니다. 다른 파일로 다시 해 보세요.', 502); }
    const clean = (value, max) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
    const topics = (Array.isArray(parsed.topics) ? parsed.topics : [])
      .map((item) => (typeof item === 'string' ? { title: item, detail: '' } : item || {}))
      .map((item) => ({ title: clean(item.title, 120), detail: clean(item.detail, 200) }))
      .filter((item) => item.title)
      .slice(0, MAX_TOPICS);
    return { subject: clean(parsed.subject, 60), semester: clean(parsed.semester, 20), topics, note: clean(parsed.note, 300) };
  }

  async function callGeminiWithParts(model, apiKey, parts) {
    const url = API_ROOT + '/models/' + model + ':generateContent';
    const body = { contents: [{ parts }], generationConfig: { maxOutputTokens: 4096, temperature: 0.2 } };
    const result = await callWithRetry(url, apiKey, body);
    if (result.data) return result.data;
    failForStatus(result.status, result.why);
    return null;
  }

  async function askForTopics(userId, stored, document, context) {
    const parts = document.kind === 'text'
      ? [{ text: topicsPrompt(context, document.text) }]
      : [{ inline_data: { mime_type: document.mime, data: document.base64 } }, { text: topicsPrompt(context, '') }];
    let model = await pickModel(userId, stored.apiKey, stored.model);
    let data;
    try {
      data = await callGeminiWithParts(model, stored.apiKey, parts);
    } catch (error) {
      if (error.code !== 'AI_UPSTREAM_BUSY' && error.code !== 'AI_UPSTREAM_ERROR') throw error;
      const other = await pickModel(userId, stored.apiKey, null, model);
      if (other === model) throw error;
      model = other;
      data = await callGeminiWithParts(model, stored.apiKey, parts);
    }
    const text = extractText(data);
    if (!text.trim()) {
      const why = data?.promptFeedback?.blockReason;
      fail('AI_EMPTY_ANSWER', why ? '답을 받지 못했습니다(' + why + ').' : '문서에서 아무것도 읽어 내지 못했습니다.', 502);
    }
    return { ...parseTopics(text), model };
  }

  // 수행평가 계획 메뉴가 쓰는 성취기준 자료(교과·학년군). 서버도 같은 파일을 읽어 제미나이에 넘긴다.
  const standardsCache = new Map();
  function standardsFor(subjectName, grade) {
    const band = grade <= 2 ? 'e12' : grade <= 4 ? 'e34' : grade <= 6 ? 'e56' : 'm';
    const cacheKey = subjectName + '|' + band;
    if (standardsCache.has(cacheKey)) return standardsCache.get(cacheKey);
    let found = [];
    try {
      const index = JSON.parse(fs.readFileSync(path.join(STANDARDS_DIR, 'index.json'), 'utf8'));
      const subject = index.subjects.find((s) => s.name === subjectName || s.name.split('·').includes(subjectName));
      if (subject && subject.bands[band]) {
        const data = JSON.parse(fs.readFileSync(path.join(STANDARDS_DIR, subject.id + '.json'), 'utf8'));
        for (const domain of data.bands[band].domains) {
          if (subject.name !== subjectName && domain.subjectName !== subjectName) continue;
          for (const st of domain.standards) found.push({ code: st.code, text: st.text, domain: domain.name });
        }
      }
    } catch (_) { found = []; }
    standardsCache.set(cacheKey, found);
    return found;
  }

  function planPrompt(context, standards, documentText) {
    const labels = LEVEL_LABELS[context.levels] || LEVEL_LABELS[3];
    return [
      '너는 초·중학교 교사를 돕는 보조자다. 교사가 올린 수행평가 계획 문서를 나이스 「평가계획(안)」과 같은 틀로 옮겨 적어라.',
      '조건: ' + [context.grade ? context.grade + '학년' : '', context.subject ? '교과 ' + context.subject : '', context.semester ? context.semester + '학기' : ''].filter(Boolean).join(', ') + '. 문서에 다른 학년·교과·학기가 섞여 있으면 조건에 맞는 것만 옮기고, 맞는 것이 없으면 전부 옮기되 note 에 적어라.',
      '항목(item) 하나는 평가 한 건이다. 각 항목에 영역명(domain), 성취기준 코드 목록(codes), 평가요소(element), 단계별 평가결과(criteria)를 적는다.',
      '성취기준 코드는 반드시 아래 목록에서 고른다. 문서에 코드가 없으면 성취기준 문장이나 평가요소가 가장 맞는 코드를 고르고, 정말 맞는 것이 없으면 codes 를 비워 둔다. 목록에 없는 코드를 지어내지 마라.',
      '평가요소는 문서의 표현을 살려 짧은 구(句)로 적는다(보기: "작품 속 인물과 면담하기"). 단계별 평가결과는 문서에 있으면 그대로 옮기고, 없으면 빈 글로 둔다(지어내지 마라).',
      '단계 수는 문서를 따르되 ' + Object.keys(LEVEL_LABELS).join('·') + ' 가운데 하나다. 단계 이름의 기본값은 ' + context.levels + '단계면 ' + labels.join('/') + ' 이다.',
      '반드시 아래 모양의 JSON 만 답하라. 다른 말은 쓰지 마라.',
      '{"items":[{"domain":"영역명","codes":["6국01-04"],"element":"평가요소","levels":3,"criteria":[{"label":"잘함","text":"…"},{"label":"보통","text":"…"},{"label":"노력요함","text":"…"}]}],"note":"알릴 것이 있으면 한 줄"}',
      '성취기준 목록(코드: 영역 / 본문):',
      standards.map((s) => s.code + ': ' + s.domain + ' / ' + s.text).join('\n') || '(목록 없음)',
      documentText ? '\n문서 내용:\n' + documentText : ''
    ].filter(Boolean).join('\n');
  }

  function criteriaPrompt(context) {
    const labels = context.labels;
    return [
      '너는 초·중학교 교사를 돕는 보조자다. 나이스 수행평가 계획의 「단계별 평가결과」 문장을 쓴다.',
      '아래 성취기준과 평가요소에 근거하여 평가기준 문장을 독립적으로 새로 작성한다. 출판사 평가기준을 검색·인용하거나 기억한 문구를 재현하지 않는다. 관찰 가능한 수행의 정확성·완성도·도움의 정도로 단계를 구분한다.',
      '조건: ' + [context.grade ? context.grade + '학년' : '', context.subject ? '교과 ' + context.subject : ''].filter(Boolean).join(', ') + '.',
      '성취기준:\n' + context.standards.map((s) => '[' + s.code + '] ' + s.text).join('\n'),
      context.element ? '평가요소: ' + context.element : '',
      '단계 ' + labels.length + '개(' + labels.join(' / ') + ')마다 한 문장씩 쓴다. 가장 높은 단계는 성취기준을 충분히 도달한 모습, 가장 낮은 단계는 도움을 받아 일부만 하는 모습으로, 단계 사이는 정도의 차이가 또렷하게 드러나게 쓴다.',
      '문장은 "…을 표현한다." "…을 파악한다."처럼 "-ㄴ다/-는다"로 끝나는 보통 서술문으로 쓴다. "…할 수 있다."나 "…함."으로 끝내지 마라. 학생 이름이나 점수·비율·등급 표현은 쓰지 마라. 성취기준과 평가요소에 없는 내용을 더하지 마라. 각 문장은 60자 안팎.',
      '반드시 아래 모양의 JSON 만 답하라. 다른 말은 쓰지 마라.',
      '{"criteria":[' + labels.map((label) => '{"label":"' + label + '","text":"…"}').join(',') + ']}'
    ].filter(Boolean).join('\n');
  }

  function parseJsonAnswer(text, code, message) {
    const body = String(text || '').replace(/^```(?:json)?/m, '').replace(/```\s*$/m, '');
    const start = body.indexOf('{'), end = body.lastIndexOf('}');
    if (start < 0 || end <= start) fail(code, message, 502);
    try { return JSON.parse(body.slice(start, end + 1)); } catch (_) { fail(code, message, 502); }
  }

  async function askJson(userId, stored, parts) {
    let model = await pickModel(userId, stored.apiKey, stored.model);
    let data;
    try {
      data = await callGeminiWithParts(model, stored.apiKey, parts);
    } catch (error) {
      if (error.code !== 'AI_UPSTREAM_BUSY' && error.code !== 'AI_UPSTREAM_ERROR') throw error;
      const other = await pickModel(userId, stored.apiKey, null, model);
      if (other === model) throw error;
      model = other;
      data = await callGeminiWithParts(model, stored.apiKey, parts);
    }
    const answer = extractText(data);
    if (!answer.trim()) {
      const why = data?.promptFeedback?.blockReason;
      fail('AI_EMPTY_ANSWER', why ? '답을 받지 못했습니다(' + why + ').' : '답이 비어 있습니다.', 502);
    }
    return answer;
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

  // 수행평가 계획서(pdf·png/jpg·hwpx·docx·txt)를 올리면 활동 주제 목록을 돌려준다.
  // 파일 본문은 그대로 받고(express.raw), 조건은 주소의 물음표 뒤에 온다.
  router.post('/extract-topics', express.raw({ type: () => true, limit: MAX_PLAN_FILE_BYTES }), asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireTeacher(req);
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) fail('AI_FILE_REQUIRED', '올릴 파일을 고르세요.');
    let fileName = '';
    try { fileName = decodeURIComponent(String(req.get('x-file-name') || '')); } catch (_) { fileName = ''; }
    const document = readPlanDocument(req.body, fileName);
    if (document.kind === 'unsupported') fail('AI_FILE_UNSUPPORTED', document.reason, 415);
    if (document.kind === 'text' && !document.text.trim()) fail('AI_FILE_EMPTY', '문서에 글이 없습니다. 스캔한 문서라면 PDF나 그림으로 올려 주세요.', 422);
    const context = {
      area: String(req.query.area || 'subject').slice(0, 20),
      subject: String(req.query.subject || '').slice(0, 60),
      semester: String(req.query.semester || '').slice(0, 20),
      grade: String(req.query.grade || '').slice(0, 4)
    };
    countGenerate(user.id);
    const stored = await storedKey(user.id);
    if (!stored) fail('AI_KEY_REQUIRED', '내 정보의 AI 설정에서 API 키를 등록해 주세요.', 409);
    const result = await askForTopics(user.id, stored, document, context);
    res.json({ subject: result.subject, semester: result.semester, topics: result.topics, note: result.note, source: document.kind === 'text' ? 'text' : document.mime });
  }));

  // 수행평가 계획서 파일 → 나이스 틀의 항목 목록. 성취기준 코드는 그 교과·학년군 목록에서만 고른다.
  router.post('/extract-plan', express.raw({ type: () => true, limit: MAX_PLAN_FILE_BYTES }), asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireTeacher(req);
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) fail('AI_FILE_REQUIRED', '올릴 파일을 고르세요.');
    let fileName = '';
    try { fileName = decodeURIComponent(String(req.get('x-file-name') || '')); } catch (_) { fileName = ''; }
    const document = readPlanDocument(req.body, fileName);
    if (document.kind === 'unsupported') fail('AI_FILE_UNSUPPORTED', document.reason, 415);
    if (document.kind === 'text' && !document.text.trim()) fail('AI_FILE_EMPTY', '문서에 글이 없습니다. 스캔한 문서라면 PDF나 그림으로 올려 주세요.', 422);
    const context = {
      subject: String(req.query.subject || '').slice(0, 40),
      grade: Number(req.query.grade) || 0,
      semester: Number(req.query.semester) || 0,
      levels: Math.min(5, Math.max(2, Number(req.query.levels) || 3))
    };
    if (!context.subject || !context.grade) fail('PLAN_KEY_INVALID', '교과와 학년을 먼저 고르세요.');
    countGenerate(user.id);
    const stored = await storedKey(user.id);
    if (!stored) fail('AI_KEY_REQUIRED', '내 정보의 AI 설정에서 API 키를 등록해 주세요.', 409);
    const standards = standardsFor(context.subject, context.grade);
    const byCode = new Map(standards.map((s) => [s.code, s]));
    const parts = document.kind === 'text'
      ? [{ text: planPrompt(context, standards, document.text) }]
      : [{ inline_data: { mime_type: document.mime, data: document.base64 } }, { text: planPrompt(context, standards, '') }];
    const parsed = parseJsonAnswer(await askJson(user.id, stored, parts), 'AI_PLAN_UNREADABLE', '문서에서 계획을 읽어 내지 못했습니다. 다른 파일로 다시 해 보세요.');
    const items = cleanItems((Array.isArray(parsed.items) ? parsed.items : []).map((item) => ({
      domain: item?.domain,
      standards: (Array.isArray(item?.codes) ? item.codes : []).map((code) => byCode.get(String(code).trim())).filter(Boolean).map((s) => ({ code: s.code, text: s.text })),
      element: item?.element,
      levels: item?.levels,
      criteria: item?.criteria
    }))).filter((item) => item.element || item.standards.length);
    // 영역명이 비었으면 첫 성취기준의 영역을 쓴다.
    for (const item of items) if (!item.domain && item.standards[0]) item.domain = byCode.get(item.standards[0].code)?.domain || '';
    res.json({ items, note: String(parsed.note || '').slice(0, 300), standardsKnown: standards.length });
  }));

  // 성취기준·평가요소 → 단계별 평가결과 문장 초안.
  router.post('/draft-criteria', asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireTeacher(req);
    const body = req.body || {};
    const levels = Math.min(5, Math.max(2, Number(body.levels) || 3));
    const labels = (Array.isArray(body.labels) && body.labels.length === levels ? body.labels : LEVEL_LABELS[levels]).map((label) => String(label || '').trim().slice(0, 20) || '단계');
    const standards = (Array.isArray(body.standards) ? body.standards : []).slice(0, 8)
      .map((s) => ({ code: String(s?.code || '').slice(0, 16), text: String(s?.text || '').slice(0, 600) })).filter((s) => s.text);
    const element = typeof body.element === 'string' ? body.element.trim().slice(0, 400) : '';
    if (!element.replace(/[\s\u200B-\u200D\u2060\uFEFF]/g, '')) {
      fail('AI_ASSESSMENT_ELEMENT_REQUIRED', '평가요소를 먼저 적어 주세요.');
    }
    countGenerate(user.id);
    const stored = await storedKey(user.id);
    if (!stored) fail('AI_KEY_REQUIRED', '내 정보의 AI 설정에서 API 키를 등록해 주세요.', 409);
    const context = { subject: String(body.subject || '').slice(0, 40), grade: Number(body.grade) || 0, standards, element, labels };
    const parsed = parseJsonAnswer(await askJson(user.id, stored, [{ text: criteriaPrompt(context) }]), 'AI_CRITERIA_UNREADABLE', '평가결과 문장을 받지 못했습니다. 다시 눌러 보세요.');
    const given = Array.isArray(parsed.criteria) ? parsed.criteria : [];
    const criteria = labels.map((label, i) => ({ label, text: String(given[i]?.text || given.find((c) => c?.label === label)?.text || '').replace(/\s+/g, ' ').trim().slice(0, 800) }));
    if (criteria.every((c) => !c.text)) fail('AI_CRITERIA_UNREADABLE', '평가결과 문장을 받지 못했습니다. 다시 눌러 보세요.', 502);
    res.json({ criteria });
  }));

  return { router, initialize };
}

module.exports = { createTeacherAi, createCipher, chooseModel, extractText, retryDelayFrom, isDailyQuota };
