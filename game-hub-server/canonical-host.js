// 옛 주소(joyclass.kr, Render 기본 주소)로 들어온 화면 요청을 classj.kr 의 같은 자리로 보낸다.
// API 와 상태 확인은 넘기지 않는다. 옛 주소로 열어 둔 탭은 새로 고치기 전까지 옛 세션으로
// API 를 계속 부르는데, 넘기면 다른 출처가 되어 막힌다. Render 상태 확인은 기본 주소로 들어온다.
const CANONICAL_ORIGIN = "https://classj.kr";
const LEGACY_HOSTS = new Set(["joyclass.kr", "www.joyclass.kr", "songhwaplay.onrender.com"]);

function canonicalRedirectUrl(req) {
  if (!LEGACY_HOSTS.has(String(req.hostname || "").toLowerCase())) return null;
  if (req.method !== "GET" && req.method !== "HEAD") return null;
  if (req.path === "/health" || req.path === "/api" || req.path.startsWith("/api/")) return null;
  const pathAndQuery = String(req.originalUrl || "").startsWith("/") ? req.originalUrl : "/";
  return `${CANONICAL_ORIGIN}${pathAndQuery}`;
}

function redirectLegacyHosts(req, res, next) {
  const target = canonicalRedirectUrl(req);
  if (target) return res.redirect(301, target);
  next();
}

module.exports = { CANONICAL_ORIGIN, LEGACY_HOSTS, canonicalRedirectUrl, redirectLegacyHosts };
