// Read-only source inventory. Writes findings under outputs/, never student data.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const base = 'learning/literacy-numeracy/';
const output = path.join(root, 'outputs', 'learning-report-audit-20261001');
const rows = [
  ['story-books/korea-tales', '한국 전래 동화', '읽기', 'memory', '페이지·문제 응답은 화면 메모리, 언어 설정은 기기 저장', '작품·언어·읽던 위치와 문항별 시도 기록이 필요', ['story-books/korea-tales/heungbujeon/app.js']],
  ['story-books/world-tales', '세계 명작 동화', '읽기', 'memory', '페이지·퀴즈 상태는 화면 메모리, 언어 설정은 기기 저장', '작품·언어·읽던 위치와 문항별 시도 기록이 필요', ['story-books/world-tales/red-hood/app.js']],
  ['story-books/world-novels', '세계 명작 소설', '읽기', 'memory', '선택 답·오답 선택은 화면 메모리, 언어 설정은 기기 저장', '작품·장·페이지와 응답을 계정에 저장해야 다른 기기에서 이어짐', ['story-books/world-novels/anne-green-gables/app.js']],
  ['story-books/poetry', '시', '읽기', 'local', '시별 solved·wrong·done을 localStorage에 저장', '언제 어떤 답을 골랐는지와 시 읽던 위치·풀이 순서 추가', ['story-books/poetry/app.js']],
  ['reading', '비문학', '읽기', 'local', '서버는 자습 문항 제공. 복습 대기열·출제 이력·언어는 기기 저장', '현재 자습 화면은 응답을 서버에 보내지 않음. 답안·현재 5문항 세트 저장 필요', ['reading/app.js', 'reading/deck.js']],
  ['sentence-building', '문장 고르기', '문법', 'local', '차시별 완료·최고점과 마지막 차시만 기기에 저장', '현재 문항·선택/배열 답·힌트 사용·각 풀이의 결과 필요', ['sentence-building/app.js']],
  ['spelling', '한글 맞춤법', '문법', 'local', '최고점·차시별 best/total/completedAt·출제 덱을 기기에 저장', '최고점 덮어쓰기 대신 시도별 답안·정오답·소요시간 저장', ['spelling/app.js', 'spelling/question-deck.js']],
  ['idiomatic-expressions', '관용어', '어휘', 'local', '완료 차시 목록을 기기에 저장', '완료 목록만으로 일별 활동이나 실제 오답을 복원할 수 없음', ['idiomatic-expressions/app.js']],
  ['proverbs', '속담', '어휘', 'local', '언어별 완료 차시 목록을 기기에 저장. 첫 시도 점수는 화면에만 표시', '언어·문항·최초 답과 재시도·완료 시각 저장', ['proverbs/app.js']],
  ['classical-chinese-idioms', '한자성어', '어휘', 'local', '안다/모른다와 변경 시각·최고점을 이름 기반 기기 키에 저장', '로그인 학생 ID로 연결. 자기평가와 문제 정답률을 구분', ['classical-chinese-idioms/app.js']],
  ['hanja-meaning', '한자', '어휘', 'memory', '활성 v2 차시·단계 퀴즈는 DOM/메모리 상태, 학습 응답 서버 저장 없음', '348개 차시와 단계 퀴즈에 공통 기록 코드 연결. 반복 정답을 최초 정답으로 집계하지 않기', ['hanja-meaning/index.html', 'hanja-meaning/v2/001/index.html', 'hanja-meaning/v2/quiz/01/index.html']],
  ['phonics', '파닉스', '어휘', 'local', '완료·최고점·소리 점수·별·연속학습·마지막 날짜/차시를 기기에 저장', '듣기 선택과 받아쓰기 입력을 문항별 저장, 현재 차시 중간 진도 복원', ['phonics/app.js']],
  ['vocabulary', '교육부 영단어', '어휘', 'local', '안다/모른다·수정 시각, 철자 오답 수·마지막 입력·설정값을 기기에 저장', '단어 자기평가와 그림/철자 게임을 별도 활동으로 기록. 전체 시도 이력 필요', ['vocabulary/app.js', 'vocabulary/vocabulary-core.js']],
  ['arithmetics', '연산', '수리', 'memory', '일반 학습지는 React 메모리에서 답·채점 관리. 순위전은 별도 방 저장소', '일반 풀이용 서버 기록 필요. 생성 문제의 seed/버전·실제 문제·답을 함께 고정', ['arithmetics/app/arithmetic/add-subtract-1/page.tsx', 'arithmetics/app/components/arithmetic-race-controller.tsx', 'arithmetics/lib/arithmetic-race-store.ts']],
  ['math-ox', '수학 기초 OX', '수리', 'memory', '문항별 answeredState를 화면 메모리에만 유지', '문항 ID·학년·단원·선택 O/X·첫 시도·재시도와 현재 위치 저장', ['math-ox/app.js']],
  ['csat-math', '평가원·수능 기출', '수리', 'local', '문항별 right/wrong 상태만 기기에 저장', '학생이 고른 번호/입력값·실제 풀이 시각·시도 구분 필요', ['csat-math/app.js']],
  ['metacognition', '학습 자기점검', '자기점검', 'mixed', '완료 결과는 PostgreSQL. 진행 중 응답·문항/선택지 순서와 최근 20결과는 기기에도 저장', '중간 저장·서버 이어하기·중복 제출 방지 필요. 기기 저장/다운로드 의존 제거', ['metacognition/app.js']]
];
const extras = [
  ['graph-studio', '그래프 스튜디오', '교사 수업 도구', 'supplement', '칠판 상태와 보관함을 기기에 저장', '문해·수리 학생 진입 17항목에는 없음. 학생 활동으로 사용할 경우 서버 작품 저장 대상으로 포함', ['graph-studio/app.js']],
  ['phonics-site', '독립 배포용 파닉스 사본', '배포 사본', 'supplement', 'public/phonics/app.js도 기기 저장', '현재 홈의 활성 경로는 phonics/. 사본을 배포한다면 같은 서버 저장 변경 반영 필요', ['phonics-site/public/phonics/app.js']]
];
const skipDirs = new Set(['node_modules', '.git', '.next', 'dist', 'assets', 'vendor', 'tests', 'tools', 'data', 'images', 'fonts']);
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) return [];
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return skipDirs.has(entry.name) ? [] : walk(file);
    if (!/\.(?:html|js|ts|tsx)$/.test(entry.name) || /(?:^test[-.]|^verify-|\.test\.|\.spec\.|\.d\.ts$)/.test(entry.name)) return [];
    return [file];
  });
}
function inspect(file) {
  const source = fs.readFileSync(file, 'utf8');
  const lines = source.split(/\r?\n/);
  const evidence = [];
  lines.forEach((line, index) => {
    const kinds = [];
    if (/localStorage|sessionStorage|indexedDB|\bstorage\??\.(?:getItem|setItem)/.test(line)) kinds.push('device-storage');
    if (/\/api\/|new WebSocket|sendBeacon/.test(line)) kinds.push('network-reference');
    if (kinds.length) evidence.push({ line: index + 1, kinds, excerpt: line.trim().slice(0, 230) });
  });
  return { path: path.relative(root, file).replaceAll('\\', '/'), sha256: crypto.createHash('sha256').update(source).digest('hex'), evidence };
}
function inspectArea(row) {
  const [directory, label, area, storage, current, gap, keyFiles] = row;
  const files = walk(path.join(root, base, directory)).map(inspect);
  return { directory: base + directory, label, area, storage, current, gap, crossDeviceResume: false,
    scannedSourceFiles: files.length,
    htmlPages: files.filter(file => file.path.endsWith('.html')).length,
    sourceFilesWithDeviceStorage: files.filter(file => file.evidence.some(e => e.kinds.includes('device-storage'))).length,
    keyFiles: keyFiles.map(file => base + file),
    evidenceFiles: files.filter(file => file.evidence.length || keyFiles.some(key => base + key === file.path)) };
}
const report = {
  title: '문해·수리 학습 기록 점검',
  inspectedAt: new Date().toISOString(),
  method: '현재 작업 트리의 정적 코드 점검. 운영 DB·실사용 기록·배포 상태는 확인하지 않음. 응답 저장과 단순 문항 제공/방 통신을 구분하여 판정.',
  scope: '홈 문해·수리의 활성 17개 진입 항목 + 그래프 도구·독립 파닉스 배포 사본. node_modules/dist/데이터·소재/개발 보조 파일 제외. 한자 활성 경로는 v2.',
  policy: {
    sourceOfTruth: '학생 계정에 연결한 서버 DB',
    devicePersistence: '학생의 학습 기록·답안·진도·개인 설정을 localStorage/sessionStorage/IndexedDB에 보관하지 않음. 실패 시 기기 저장으로 우회하지 않음.',
    resume: '학교 크롬북과 집 PC에서 같은 학생으로 로그인하면 서버가 확인한 마지막 진도를 복원',
    reporting: '학생별·영역별, 기본 오늘, 주간·기간 조회. 인쇄 기능 불필요.',
    future: '학부모는 자기 자녀의 저장된 사실 기록 조회. AI 의견은 교사가 확인·공개한 뒤 제공.'
  },
  activities: rows.map(inspectArea),
  supplemental: extras.map(inspectArea),
  importantFindings: [
    '현재 활성 활동 중 문항·진행 순서를 계정에서 읽어 기기간 이어가는 공통 구현은 확인되지 않음.',
    '비문학 reading-bank에는 pilot start/responses/submit와 응답 조회 구현이 별도로 있지만 현재 자습 app.js는 self-study GET만 사용. 기존 파일럿 API를 현재 자습 기록으로 오인하면 안 됨.',
    '자기점검 studentContext는 classroom_students만 조회. school_students 명단만 있는 학생의 class_id가 비어 교사 요약에서 빠질 수 있어 공통 학생 식별부터 정리해야 함.',
    '자기점검 mine 조회는 최근 20개 요약만 반환하며 응답·진행 중 데이터 복원 API가 아님. 학급 요약도 학생별 최신 1건 중심이라 기간 보고서에 그대로 쓸 수 없음.',
    '연산 순위전은 Cloudflare D1 또는 서버 메모리(6시간 수명) 분기. 이름/참가자 토큰 기반 방 상태이며 일반 학습 기록·학생 계정 장기 이력이 아님.',
    '책 종류의 기기 저장 검색 결과 대부분은 언어/BGM 설정. 이를 읽기 진도·답안 저장으로 집계하지 않음.',
    '수업 순위전/멀티플레이 방 스냅샷이나 총점은 보고서용 문항별 학생 응답 이력을 대체하지 못함.',
    '공통 음악·효과음 코드에도 음량/음소거/재생 위치 등 기기 저장이 있음. 학생 설정까지 기기에 남기지 않는 정책에 맞게 후속 전환 범위에 포함.'
  ],
  serverFirstPlan: [
    { step: 1, work: '공통 학생 식별·활동/영역 카탈로그', detail: '인증된 user_id와 두 명단 체계의 학생·학급 연결. 이름이나 기기 ID를 기록 주키로 쓰지 않음. 콘텐츠와 문항 버전 관리.' },
    { step: 2, work: '서버 활동 세션·응답·중간 진도 API', detail: '활동 시작 때 세션 생성. 답 제출마다 응답과 현재 위치 저장. 문항 세트·순서·생성 seed/버전 또는 문제 스냅샷을 고정. 첫 풀이와 재풀이를 분리.' },
    { step: 3, work: '기기간 이어하기·저장 확인', detail: '진입 시 서버의 미완료 세션 조회. 중복 요청 ID와 revision으로 중복 집계·오래된 탭 덮어쓰기 방지. 저장 완료를 서버 응답 이후에만 표시. 오류는 미저장 표시와 재시도, 기기 영구 저장 없음.' },
    { step: 4, work: '활동별 연결 및 기존 기기 저장 제거', detail: '17개 활동을 공통 API에 연결. 책은 읽던 위치·응답, 문항형은 답안·시도, 자기평가형은 안다/모른다를 별도 기록. 과거 기기 기록은 계정 소유를 추측해 합치지 않으며 정리 정책을 정해 전환.' },
    { step: 5, work: '교사 보고서와 AI 초안', detail: 'Asia/Seoul 기준 일자 집계. 최초 정답·재시도·미완료·기록 없음 구분. 원문항과 응답으로 내려가는 학생별·영역별 조회. 그다음 실제 기록을 근거로 AI 초안 작성.' }
  ],
  acceptanceChecks: [
    '서로 분리된 두 브라우저의 같은 학생 계정으로 진행·응답·순서가 이어지는지 확인',
    '다른 학생·다른 학급 계정에서 기록 조회/수정이 차단되는지 확인',
    '네트워크 실패 시 저장 성공으로 표시하지 않고 브라우저 영구 저장이 생성되지 않는지 확인',
    '두 기기의 동시 수정 및 응답 재전송이 기록을 덮어쓰거나 중복 집계하지 않는지 확인',
    '학생 API 응답 no-store와 서비스워커의 학생 데이터 캐시 제외 확인',
    '새로고침 후 문제 세트·선택지 순서·답안·완료 상태 복원 확인',
    '날짜 경계·재풀이·콘텐츠 버전 변경에서도 보고서 원자료가 유지되는지 확인'
  ],
  serverEvidence: ['game-hub-server/metacognition.js', 'game-hub-server/reading-bank.js', 'game-hub-server/server.js', 'assets/sound/music-control.js', 'assets/sound/game-sfx.js'].map(file => inspect(path.join(root, file)))
};
const counts = {};
for (const row of report.activities) counts[row.storage] = (counts[row.storage] || 0) + 1;
report.summary = { activeEntries: rows.length, groupsByRecordStorage: counts, note: 'memory는 학습 결과가 메모리뿐이라는 뜻이며 언어·음악 설정 등 별도 기기 저장이 없다는 뜻은 아님.' };
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'audit.json'), JSON.stringify(report, null, 2) + '\n');
const escape = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const labels = { memory: '학습 결과 미저장', local: '기기에만 저장', mixed: '서버 + 기기', supplement: '별도 점검' };
const tableRows = items => items.map(row => `<tr><th>${escape(row.label)}<small>${escape(row.area)}</small></th><td>${labels[row.storage]}</td><td>${escape(row.current)}</td><td>${escape(row.gap)}</td><td><details><summary>근거 파일</summary>${row.keyFiles.map(file => `<code>${escape(file)}</code>`).join('')}</details></td></tr>`).join('');
const html = `<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${report.title}</title><style>body{margin:0;background:#f4f6f9;color:#172536;font:16px/1.7 system-ui,'Malgun Gothic',sans-serif}main{max-width:1260px;margin:40px auto;padding:0 24px}h1{font-size:32px}h2{margin-top:40px}p{max-width:900px}.lead{background:#e4f2ea;border-left:5px solid #23824c;padding:20px}.note,small{color:#566578}small{display:block}table{width:100%;border-collapse:collapse;background:white;font-size:14px}th,td{padding:14px;text-align:left;border:1px solid #d9e0e8;vertical-align:top}th{min-width:100px}code{display:block;font-size:11px;overflow-wrap:anywhere;min-width:120px}details{max-width:240px}.scroll{overflow-x:auto}li{margin:10px 0}a{color:#1855b4}</style><main><h1>${report.title}</h1><p class="note">2026-10-01 · 소스 점검 완료 · 실제 저장 방식의 전환은 아직 적용하지 않음</p><p class="lead"><strong>학교 크롬북 → 집 PC, 같은 학생 계정으로 이어하기.</strong><br>학습 기록·답안·진도는 서버만 저장하고 기기에 영구 보관하지 않습니다. 보고서는 같은 서버 기록을 학생별·영역별로 보여줍니다.</p><p>홈 문해·수리의 <strong>17개 활동</strong>을 점검했습니다. 학습 결과가 기기에만 저장되는 활동 ${counts.local}개, 화면 메모리에만 있는 활동 ${counts.memory}개, 서버와 기기에 함께 저장되는 활동 ${counts.mixed}개입니다. 계정 기반의 기기간 중간 이어하기는 공통 구현이 필요합니다.</p><p class="note">${escape(report.method)}</p><h2>활동별 현재 상태</h2><div class="scroll"><table><thead><tr><th>활동 / 영역</th><th>학습 결과 저장</th><th>확인된 내용</th><th>보고서·이어하기에 필요한 보완</th><th>근거</th></tr></thead><tbody>${tableRows(report.activities)}</tbody></table></div><h2>함께 확인한 경로</h2><div class="scroll"><table><tbody>${tableRows(report.supplemental)}</tbody></table></div><h2>설계에 영향을 주는 발견</h2><ul>${report.importantFindings.map(item => `<li>${escape(item)}</li>`).join('')}</ul><h2>구현 순서</h2><ol>${report.serverFirstPlan.map(item => `<li><strong>${escape(item.work)}</strong><br>${escape(item.detail)}</li>`).join('')}</ol><h2>완료 판단 기준</h2><ul>${report.acceptanceChecks.map(item => `<li>${escape(item)}</li>`).join('')}</ul><p><a href="audit.json">파일별 줄 번호와 점검 결과 JSON</a></p></main></html>`;
fs.writeFileSync(path.join(output, 'index.html'), html);
console.log(JSON.stringify({ output: path.relative(root, output), ...report.summary, sourceFiles: report.activities.reduce((sum, row) => sum + row.scannedSourceFiles, 0), perActivity: report.activities.map(({ label, scannedSourceFiles, sourceFilesWithDeviceStorage }) => ({ label, scannedSourceFiles, sourceFilesWithDeviceStorage })) }, null, 2));
