"""구글 글꼴을 받아 우리 서버(assets/fonts/google)에 둔다.

학생 브라우저가 fonts.googleapis.com·fonts.gstatic.com 을 부르지 않도록, 쪽들은
assets/fonts/google/<글꼴>.css 를 건다. 이 도구는 그 CSS 와 woff2 조각을 만든다.

    python scripts/build-google-fonts.py            # 모든 글꼴을 다시 받는다
    python scripts/build-google-fonts.py inter      # 한 글꼴만

- 한글 글꼴은 구글이 글자 묶음(unicode-range)마다 조각을 나눠 준다. 조각을 모두 받아 두면
  브라우저는 쪽에 나온 글자의 조각만 받는다.
- 파일 이름은 내용의 해시다. 서버가 woff2 를 1년 immutable 로 내보내므로, 내용이 바뀌면
  이름도 바뀌어야 한다. CSS 를 다시 만들면 쪽의 ?v= 도 올린다.
- 굵기는 쪽이 부르던 그대로 따로따로 적는다. 가변 글꼴이라도 400·600·700 만 부른 쪽은
  650 을 700 으로 그렸으므로, 굵기를 400~700 으로 합치거나 안 부른 굵기를 더하면 글자가
  달라진다. 그래서 굵기 묶음이 여럿인 글꼴은 묶음마다 CSS 를 따로 만든다
  (noto-serif-kr-400-600.css). 묶음이 하나뿐인 글꼴은 이름만 쓴다(inter.css).
- 새 글꼴·굵기가 필요하면 FAMILIES 에 더하고 다시 돌린다.
"""
import hashlib, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "fonts", "google")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
GF = "https://raw.githubusercontent.com/google/fonts/main/"

# 이름: (구글 글꼴 이름, 굵기 묶음들(None 이면 굵기 없이), 저작권 파일 주소)
FAMILIES = {
    "gowun-batang": ("Gowun Batang", [(400, 700)], GF + "ofl/gowunbatang/OFL.txt"),
    "noto-serif-kr": ("Noto Serif KR", [(400, 500, 600, 700), (400, 500, 700), (400, 600, 700), (400, 600), (600, 700)],
                      GF + "ofl/notoserifkr/OFL.txt"),
    "roboto-slab": ("Roboto Slab", [(400, 500, 700)], GF + "apache/robotoslab/LICENSE.txt"),
    "noto-sans-kr": ("Noto Sans KR", [(400, 500, 600, 700, 800), (400, 500, 600, 700), (400, 500, 700), (400, 500, 700, 900)],
                     GF + "ofl/notosanskr/OFL.txt"),
    "dm-serif-display": ("DM Serif Display", None, GF + "ofl/dmserifdisplay/OFL.txt"),
    "gowun-dodum": ("Gowun Dodum", None, GF + "ofl/gowundodum/OFL.txt"),
    "nunito": ("Nunito", [(700, 800, 900)], GF + "ofl/nunito/OFL.txt"),
    "inter": ("Inter", [(400, 500, 600, 700, 800, 900)], GF + "ofl/inter/OFL.txt"),
    "outfit": ("Outfit", [(500, 700, 800)], GF + "ofl/outfit/OFL.txt"),
    # 아이콘 글꼴: 한 가지 모양(24·400·채우지 않음)만 둔다. 아이콘 이름이 글자로 잠깐 보이지 않게
    # display=swap 을 붙이지 않는다(구글 기본값 그대로).
    "material-symbols-outlined": ("Material Symbols Outlined", "opsz,wght,FILL,GRAD@24,400,0,0",
                                  "https://raw.githubusercontent.com/google/material-design-icons/master/LICENSE"),
}


def css_name(slug, weights):
    sets = FAMILIES[slug][1]
    if isinstance(sets, list) and len(sets) > 1:
        return slug + "-" + "-".join(map(str, weights)) + ".css"
    return slug + ".css"


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def build(slug):
    name, sets, license_url = FAMILIES[slug]
    folder = os.path.join(OUT, slug)
    os.makedirs(folder, exist_ok=True)
    family = name.replace(" ", "+")
    if sets is None:
        requests = [(None, family + "&display=swap")]
    elif isinstance(sets, str):
        requests = [(None, family + ":" + sets)]
    else:
        requests = [(w, family + ":wght@" + ";".join(map(str, w)) + "&display=swap") for w in sets]
    names = {}  # gstatic 주소 → 우리 파일 이름
    versions = set()
    for weights, query in requests:
        css = get("https://fonts.googleapis.com/css2?family=" + query).decode("utf-8")
        # 구글이 글꼴 판을 바꾸는 동안에는 요청마다 옛 판(v31)·새 판(v32)이 섞여 온다. 섞이면 멈춘다.
        versions |= set(re.findall(r"fonts\.gstatic\.com/s/[^/]+/(v\d+)/", css))
        if len(versions) > 1:
            sys.exit(f"{slug}: 구글이 판을 섞어 준다 {sorted(versions)} — 조금 뒤에 다시 돌린다")

        def local(m):
            url = m.group(1)
            if url not in names:
                data = get(url)
                file = hashlib.sha1(data).hexdigest()[:16] + ".woff2"
                path = os.path.join(folder, file)
                if not os.path.exists(path):
                    open(path, "wb").write(data)
                names[url] = file
            return f"url({slug}/{names[url]})"

        css = re.sub(r"url\((https://fonts\.gstatic\.com/[^)]+)\)", local, css)
        css = re.sub(r"/\*.*?\*/\s*", "", css, flags=re.S)  # 구글이 붙인 글자 묶음 이름 주석
        css = re.sub(r"\s*\n\s*", "", css).replace("@font-face", "\n@font-face").replace("}.", "}\n.").strip()
        out = css_name(slug, weights) if weights else slug + ".css"
        head = f"/* {name}: 구글 글꼴을 우리 서버에 둔 것. scripts/build-google-fonts.py 로 만든다. */\n"
        open(os.path.join(OUT, out), "w", encoding="utf-8", newline="\n").write(head + css + "\n")
        print(f"{out:44s} 규칙 {css.count('@font-face'):4d}")
    used = set(names.values())
    for f in os.listdir(folder):
        if f.endswith(".woff2") and f not in used:
            os.remove(os.path.join(folder, f))
    lic = get(license_url)
    open(os.path.join(folder, "OFL.txt" if "OFL" in license_url else "LICENSE.txt"), "wb").write(lic)
    size = sum(os.path.getsize(os.path.join(folder, f)) for f in used)
    print(f"  {slug}: 파일 {len(used)}개 {size / 1e6:.2f} MB")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    for slug in sys.argv[1:] or FAMILIES:
        build(slug)
