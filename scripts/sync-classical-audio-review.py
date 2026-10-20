"""Synchronize reviewed recording metadata and publish a candid per-work audit."""
import html
import json
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
ASSETS = ROOT / "learning/arts/music-listening/assets/audio/classical"
DATA = ROOT / "learning/arts/music-listening/data/classical.js"
REPORT = ROOT / "docs/qa/classical-audio"

# These are unresolved findings, not assertions that no suitable recording exists.
PENDING = {
    "05": "현악 원곡 해설과 피아노 편곡이 불일치. 검색 후보 중 합성 연주와 편곡은 제외했으며 현악 실연 대체본 필요.",
    "07": "1923년 녹음·영어 가창·분할 음원 연결본. 독일어 합창과 관현악의 현대 녹음 필요.",
    "10": "1929년 역사적 녹음. 현대 녹음 후보의 연주자와 원본 이용 조건 확인 필요.",
    "12": "관악 편곡 전곡 파일이며 피날레는 7분 30초부터. 관현악 피날레 대체본 필요.",
    "13": "현지 재생 파일 없음. Musopen의 European Archive 후보는 연주자 정보가 불명확하여 채택하지 않음.",
    "16": "1906년 피아노 롤 녹음. 피아노 네 손 실연 또는 해설과 일치하는 판본 필요.",
    "17": "관악 편곡이 관현악·하프 해설과 불일치. 2019년 후보는 편성을 확인하지 못하여 보류.",
    "18": "1933년 역사적 녹음. 같은 정경 악장의 현대 관현악 녹음 필요.",
    "20": "제공처만 알려진 녹음. 연주자·피아노 원곡/관현악 편곡 여부 확인 필요. MIDI 후보는 제외.",
    "21": "연주 단체 미표기. 잉글리시 호른과 관현악의 해당 악장 연주 정보 확인 필요.",
    "22": "1930년 라벨 지휘 녹음. 현대 관현악 대체본 필요. 저비트율·연도 불일치 후보는 보류.",
    "25": "현지 재생 파일 없음. 해설·언어·원곡 및 녹음 이용 조건을 확인한 연주 확보 필요.",
    "26": "현지 재생 파일 없음. 원곡과 녹음의 재사용 조건을 함께 확인한 연주 확보 필요.",
    "30": "현지 재생 파일 없음. 원곡과 녹음의 재사용 조건을 함께 확인한 연주 확보 필요.",
    "31": "기존 오르간 녹음 유지. 실제 악기/음원 제작 방식과 청취 품질 추가 확인 필요.",
    "37": "1919년 녹음. 관현악 전주곡의 현대 실연 대체본 필요.",
    "38": "연주자 미표기. 갈로프 해당 부분·편성·녹음 원본 확인 필요.",
    "39": "취주악 편곡. 현악을 포함하는 관현악 대체본 필요. 짧은 발췌 후보는 전곡 대체로 채택하지 않음.",
    "43": "European Archive 소장 녹음이나 연주 단체 미표기. 녹음 출처와 청취 품질 추가 확인 필요.",
    "44": "기존 역사적 녹음 유지. 피날레 구간과 현대 녹음 대체 후보 추가 확인 필요.",
    "45": "US Army Band 녹음. 원곡 관현악 편성과의 일치 여부 추가 확인 필요.",
    "48": "현지 재생 파일 없음. 합성 연주를 제외한 실연과 재사용 조건 확인 필요.",
    "49": "현지 재생 파일 없음. 합창·관현악 실연의 원곡 및 녹음 재사용 조건 확인 필요.",
}


def main():
    manifest_path = ASSETS / "recordings.json"
    records = json.loads(manifest_path.read_text(encoding="utf-8"))
    records["40"]["license"] = "EFF Open Audio License v1"
    records["40"]["licenseUrl"] = "https://web.archive.org/web/20070208085151/http://www.eff.org/IP/Open_licenses/20010421_eff_oal_1.0.html"
    text = DATA.read_text(encoding="utf-8")
    for no in ("14", "27", "40", "50"):
        row = records[no]
        audio = {
            "file": row["file"], "performer": row["performer"],
            "license": row["license"], "revision": row["outputSha256"][:12],
        }
        if no == "50":
            audio["note"] = "1924년 초연의 재즈 밴드 편성으로 연주한 2018년 실황입니다."
        replacement = f"  '{no}': {json.dumps(audio, ensure_ascii=False)},"
        text, count = re.subn(rf"^  '{no}': \{{.*\}},$", lambda _: replacement, text, flags=re.M)
        assert count == 1, no
    DATA.write_text(text, encoding="utf-8")
    manifest_path.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    js = """const fs=require('node:fs'),vm=require('node:vm'),c={window:{}};
vm.runInNewContext(fs.readFileSync('learning/arts/music-listening/data/classical.js','utf8'),c);
process.stdout.write(JSON.stringify(c.window.CLASSICAL_DATA.pieces));"""
    pieces = json.loads(subprocess.check_output(["node", "-e", js], cwd=ROOT))
    credits = (ASSETS / "AUDIO_CREDITS.md").read_text(encoding="utf-8").replace("2026-10-20 음원 점검", "2026-10-21 음원 점검")
    for no in ("14", "27", "40", "50"):
        row = records[no]
        title = next(p["title"] for p in pieces if p["no"] == no)
        block = (f"- {no} {title} — `{row['file']}`\n"
                 f"  연주: {row['performer']}\n  라이선스: {row['license']}\n"
                 f"  {row['sourcePage']}\n")
        if row["licenseUrl"]:
            block += f"  {row['licenseUrl']}\n"
        block += f"  {row['reason']}\n\n"
        credits, count = re.subn(rf"^- {no} .*?(?=^- \d\d |^## |\Z)", lambda _: block, credits, flags=re.M | re.S)
        assert count == 1, no
    credits = re.split(r"## (?:못 찾았거나 뺀 곡|확인이 남은 곡)", credits)[0] + """## 확인이 남은 곡

전체 50곡의 확인 범위와 미해결 항목은 `docs/qa/classical-audio/review.json` 및
`review.html`에 기록합니다. 파일 검사 통과는 실제 청음이나 음악적 일치의 확인을 뜻하지 않습니다.
연주자·편성·판본·원곡과 녹음의 이용 조건이 확인되지 않은 후보는 채택하지 않았습니다.
공식 영상은 다운로드하거나 추출하여 재게시하지 않았습니다.
"""
    (ASSETS / "AUDIO_CREDITS.md").write_text(credits, encoding="utf-8")

    technical_path = ROOT / "outputs/qa/classical-audio/technical-verification.json"
    technical = json.loads(technical_path.read_text(encoding="utf-8")) if technical_path.exists() else []
    by_no = {row["no"]: row for row in technical}
    rows = []
    for piece in pieces:
        no = piece["no"]
        record = records.get(no)
        audio = piece.get("audio") or {}
        rows.append({
            "no": no, "title": piece["title"],
            "status": "source-restored-or-replaced" if record else "pending",
            "recording": record,
            "currentAudio": audio,
            "technicalVerification": by_no.get(no),
            "listeningReview": "not-performed",
            "remaining": PENDING.get(no, "실제 청음에 의한 음색·잡음·연주 품질 확인은 미실시."),
        })
    browser_path = ROOT / "outputs/qa/classical-audio/browser-verification.json"
    report = {
        "date": "2026-10-21", "scope": "음악 감상 클래식 목록 50곡",
        "complete": False, "total": len(rows), "sourceRestoredOrReplaced": len(records),
        "pendingSourceReview": len(PENDING), "listeningReview": "not-performed",
        "limitations": [
            "청음 검증 미실시. 디코딩·재생·해시 검사는 음질의 주관적 평가가 아님.",
            "교체·원본 복원 수는 해설 일치와 음질 검증 완료 수가 아님.",
            "라이선스 표기는 제공 페이지의 표시를 기록한 것이며 권리 전반의 독립적 법률 검토가 아님.",
        ], "browserVerification": json.loads(browser_path.read_text(encoding="utf-8")) if browser_path.exists() else None,
        "pieces": rows,
    }
    REPORT.mkdir(parents=True, exist_ok=True)
    (REPORT / "review.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    esc = lambda value: html.escape(str(value), quote=True)
    table = "".join(
        f"<tr><td>{r['no']}</td><th>{esc(r['title'])}</th>"
        f"<td>{'원본 복원/교체' if r['recording'] else '보류'}</td>"
        f"<td>{esc(r['currentAudio'].get('performer', '파일 없음'))}</td>"
        f"<td>{esc(r['remaining'])}</td>"
        f"<td>{'<a href=' + chr(34) + esc(r['recording']['sourcePage']) + chr(34) + '>제공 페이지</a>' if r['recording'] else '미확정'}</td></tr>"
        for r in rows
    )
    page = f"""<!doctype html><html lang="ko"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>클래식 음원 검증 기록</title>
<style>body{{font:16px/1.6 system-ui;margin:24px;color:#193c32}}table{{border-collapse:collapse;width:100%}}td,th{{padding:12px;border:1px solid #ccd6d0;text-align:left;vertical-align:top}}thead{{background:#e7f2eb}}a{{color:#17664f}}.scroll{{overflow:auto}}</style>
<h1>클래식 음원 검증 기록 · 2026-10-21</h1>
<p>50곡 중 {len(records)}곡 원본 복원 또는 교체. {len(PENDING)}곡의 음원 확인·교체가 남아 있습니다.</p>
<p><strong>전체 검증 완료가 아닙니다. 실제 청음은 수행하지 못했습니다.</strong>
파일 디코딩·해시·브라우저 재생 검사와 음악적 품질 검증은 구분합니다.</p>
<p><a href="review.json">파일별 검사 결과와 원본 해시(JSON)</a></p>
<div class="scroll"><table><thead><tr><th>번호</th><th>곡</th><th>작업</th><th>현재 연주</th><th>남은 확인</th><th>근거</th></tr></thead><tbody>{table}</tbody></table></div></html>"""
    (REPORT / "review.html").write_text(page, encoding="utf-8")
    # Attribution is available separately; it does not interrupt the lesson.
    blocks = re.findall(r"^- (\d\d) (.*?)(?=^- \d\d |^## |\Z)", credits, re.M | re.S)
    items = []
    for no, block in blocks:
        record = records.get(no)
        if record:
            body = f"{record['performer']} · {record['license']}"
            link = record["sourcePage"]
            license_link = record.get("licenseUrl")
            method = "제공 파일 그대로 사용" if record["method"] == "original-bytes" else "무손실 원본을 OGG Vorbis로 변환"
            content = f"{esc(body)}. {method}. <a href=\"{esc(link)}\">제공 페이지</a>"
            if license_link:
                content += f' · <a href="{esc(license_link)}">이용 조건</a>'
            if no == "40":
                content += " · (O) Richard Wagner; Ulm Philharmonic; James Allen Gähres. EFF Open Audio License v1."
        else:
            content = "<br>".join(
                f'<a href="{esc(line.strip())}">제공 페이지</a>' if line.strip().startswith("https://") else esc(line.strip())
                for line in block.splitlines()[1:] if line.strip()
            )
        title = next(p["title"] for p in pieces if p["no"] == no)
        items.append(f'<section id="recording-{no}"><h2>{no} {esc(title)}</h2><p>{content}</p></section>')
    (ASSETS / "credits.html").write_text(
        '<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>녹음·이용 정보</title><style>body{max-width:800px;margin:32px auto;padding:0 20px;font:16px/1.6 system-ui;color:#193c32}h2{font-size:19px}section{padding:12px 0;border-bottom:1px solid #ddd}a{color:#17664f}</style>'
        '<h1>녹음·이용 정보</h1>' + "".join(items) + "</html>", encoding="utf-8")
    print(f"{len(rows)} pieces; {len(records)} restored/replaced; {len(PENDING)} pending; listening not performed")


if __name__ == "__main__":
    main()
