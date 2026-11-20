"""cdn.jsdelivr.net 에서 받던 글꼴·라이브러리를 우리 서버(assets/vendor/<이름>@<버전>)에 둔다.

학생 브라우저가 바깥 서버를 부르지 않도록 쪽들은 assets/vendor 의 파일을 건다. 경로에 버전이
들어가 있어 내용이 바뀔 일이 없다(버전을 올리면 새 폴더가 생긴다).

    python scripts/build-vendor-assets.py

- 파일은 jsdelivr 원본 그대로 둔다. KaTeX 처럼 쪽에 integrity(sha384)가 붙은 파일은 받은 뒤 값을 맞춰 본다.
- Pretendard CSS 는 글꼴 주소를 같은 폴더의 woff2 로 고치고, 옛 브라우저용 woff 대신 woff2 만 둔다.
- KaTeX CSS 는 integrity 가 맞도록 손대지 않는다. 글꼴은 woff2 만 둔다(브라우저는 woff2 를 먼저 고른다).
- jszip 은 jsdelivr 가 ES 모듈로 묶어 준 판(+esm)을 그대로 받는다.
"""
import base64, hashlib, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "vendor")
CDN = "https://cdn.jsdelivr.net/"
PRETENDARD = CDN + "gh/orioncactus/pretendard@v1.3.9/"

# 내려받을 파일: (저장할 경로, 주소)
FILES = [
    ("katex@0.16.11/katex.min.css", CDN + "npm/katex@0.16.11/dist/katex.min.css"),
    ("katex@0.16.11/katex.min.js", CDN + "npm/katex@0.16.11/dist/katex.min.js"),
    ("katex@0.16.11/contrib/auto-render.min.js", CDN + "npm/katex@0.16.11/dist/contrib/auto-render.min.js"),
    ("katex@0.16.11/LICENSE", CDN + "npm/katex@0.16.11/LICENSE"),
    ("pdfjs-dist@4.10.38/build/pdf.min.mjs", CDN + "npm/pdfjs-dist@4.10.38/build/pdf.min.mjs"),
    ("pdfjs-dist@4.10.38/build/pdf.worker.min.mjs", CDN + "npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs"),
    ("pdfjs-dist@4.10.38/LICENSE", CDN + "npm/pdfjs-dist@4.10.38/LICENSE"),
    ("xlsx@0.18.5/xlsx.full.min.js", CDN + "npm/xlsx@0.18.5/dist/xlsx.full.min.js"),
    ("xlsx@0.18.5/LICENSE", CDN + "npm/xlsx@0.18.5/LICENSE"),
    ("pdf-lib@1.17.1/pdf-lib.min.js", CDN + "npm/pdf-lib@1.17.1/dist/pdf-lib.min.js"),
    ("pdf-lib@1.17.1/LICENSE.md", CDN + "npm/pdf-lib@1.17.1/LICENSE.md"),
    ("jszip@3.10.1/jszip.esm.js", CDN + "npm/jszip@3.10.1/+esm"),
    ("jszip@3.10.1/LICENSE.markdown", CDN + "npm/jszip@3.10.1/LICENSE.markdown"),
    ("pretendard@1.3.9/LICENSE", PRETENDARD + "LICENSE"),
]

# 쪽에 붙어 있는 integrity 값(원본과 같은지 맞춰 본다)
INTEGRITY = {
    "katex@0.16.11/katex.min.css": "sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+",
    "katex@0.16.11/katex.min.js": "sha384-7zkQWkzuo3B5mTepMUcHkMB5jZaolc2xDwL6VFqjFALcbeS9Ggm/Yr2r3Dy4lfFg",
    "katex@0.16.11/contrib/auto-render.min.js": "sha384-43gviWU0YVjaDtb/GhzOouOXtZMP/7XUzwPTstBeZFe/+rCMvRwr4yROQP43s0Xk",
}


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def save(rel, data):
    path = os.path.join(OUT, *rel.split("/"))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "wb").write(data)
    return len(data)


def pretendard_css(rel, url):
    """글꼴 주소를 같은 폴더의 woff2/<이름> 으로 고치고 woff 는 뺀다."""
    css = get(url).decode("utf-8")
    base = url.rsplit("/", 1)[0] + "/"
    total = 0

    def fix(m):
        nonlocal total
        name = m.group(1).rsplit("/", 1)[1]
        total += save(os.path.dirname(rel) + "/woff2/" + name, get(urllib.parse.urljoin(base, m.group(1))))
        return f"url(woff2/{name}) format('{m.group(2)}')"

    import urllib.parse
    # 가변 글꼴은 format('woff2-variations') 로 적혀 있다.
    css = re.sub(r"url\(['\"]?([^'\")]+\.woff2)['\"]?\)\s*format\(['\"](woff2(?:-variations)?)['\"]\)", fix, css)
    css = re.sub(r",\s*url\(['\"]?[^'\")]+\.woff['\"]?\)\s*format\(['\"]woff['\"]\)", "", css)
    css = re.sub(r"/\*# sourceMappingURL=[^*]*\*/\s*", "", css)  # 지도 파일은 두지 않는다
    if ".woff)" in css or "packages/" in css:
        sys.exit("Pretendard CSS 를 다 고치지 못했다: " + rel)
    save(rel, css.encode("utf-8"))
    return total


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    for rel, url in FILES:
        data = get(url)
        if rel in INTEGRITY:
            got = "sha384-" + base64.b64encode(hashlib.sha384(data).digest()).decode()
            if got != INTEGRITY[rel]:
                sys.exit(f"integrity 가 다르다: {rel}")
        print(f"{rel:48s} {save(rel, data) / 1024:7.0f} KB")
    css = get(CDN + "npm/katex@0.16.11/dist/katex.min.css").decode("utf-8")
    fonts = sorted(set(re.findall(r"url\(fonts/([^)]+\.woff2)\)", css)))
    size = sum(save("katex@0.16.11/fonts/" + f, get(CDN + "npm/katex@0.16.11/dist/fonts/" + f)) for f in fonts)
    print(f"{'katex@0.16.11/fonts (woff2 ' + str(len(fonts)) + '개)':48s} {size / 1024:7.0f} KB")
    for rel, path in [("pretendard@1.3.9/static/pretendard.css", "dist/web/static/pretendard.css"),
                      ("pretendard@1.3.9/variable/pretendardvariable.min.css", "dist/web/variable/pretendardvariable.min.css")]:
        print(f"{rel:48s} {pretendard_css(rel, PRETENDARD + path) / 1024:7.0f} KB (글꼴 포함)")
