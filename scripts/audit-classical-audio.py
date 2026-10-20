"""Collect source evidence and original audio without lossy recompression."""
import argparse
import hashlib
import html
import json
import pathlib
import re
import subprocess
import time
import urllib.parse
import urllib.request
import urllib.error

ROOT = pathlib.Path(__file__).resolve().parents[1]
WORK = ROOT / "outputs" / "qa" / "classical-audio"
WORK.mkdir(parents=True, exist_ok=True)
API = "https://commons.wikimedia.org/w/api.php"


def request(url):
    req = urllib.request.Request(url, headers={"User-Agent": "ClassJ-AudioAudit/1.0 (educational audio source verification)"})
    for attempt in range(4):
        try:
            return urllib.request.urlopen(req, timeout=90)
        except urllib.error.HTTPError as error:
            if error.code not in (429, 503) or attempt == 3:
                raise
            time.sleep(max(10, int(error.headers.get("Retry-After", "30"))))


def api(**params):
    with request(API + "?" + urllib.parse.urlencode({"format": "json", **params})) as response:
        return json.load(response)


def clean(value):
    return html.unescape(re.sub("<[^>]+>", "", str(value))).strip()


def info(titles):
    result = api(action="query", prop="imageinfo", iiprop="url|size|sha1|mime|extmetadata", titles="|".join(titles))
    rows = []
    for page in result.get("query", {}).get("pages", {}).values():
        image = (page.get("imageinfo") or [{}])[0]
        meta = image.get("extmetadata", {})
        rows.append({
            "title": page["title"], "url": image.get("url", "").split("?")[0],
            "page": image.get("descriptionurl"), "size": image.get("size"), "sourceSha1": image.get("sha1"),
            "mime": image.get("mime"),
            **{key: clean(meta.get(key, {}).get("value", "")) for key in
               ["ImageDescription", "Artist", "DateTimeOriginal", "LicenseShortName", "LicenseUrl", "UsageTerms", "Attribution", "Credit"]}
        })
    return rows


def save(name, data):
    (WORK / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def probe(file):
    return json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries",
        "format=duration,size,bit_rate:stream=codec_name,sample_rate,channels", "-of", "json", str(file)]))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=["baseline", "search", "info", "history", "download", "page"])
    parser.add_argument("values", nargs="*")
    args = parser.parse_args()
    if args.mode == "baseline":
        credits = (ROOT / "learning/arts/music-listening/assets/audio/classical/AUDIO_CREDITS.md").read_text(encoding="utf-8")
        rows = []
        for block in re.split(r"(?m)(?=^- \d\d )", credits)[1:]:
            match = re.match(r"- (\d\d) (.+?) — `(.+?)`", block)
            if not match:
                continue
            no, title, file = match.groups()
            urls = re.findall(r"https://commons\.wikimedia\.org/wiki/([^\s]+)", block)
            rows.append({"no": no, "work": title, "file": file,
                         "sourceTitles": [urllib.parse.unquote(url).replace("_", " ") for url in urls],
                         "before": probe(ROOT / "learning/arts/music-listening/assets/audio/classical" / file)})
        save("baseline.json", rows)
        sources = []
        titles = list(dict.fromkeys(title for row in rows for title in row["sourceTitles"]))
        for start in range(0, len(titles), 10):
            sources.extend(info(titles[start:start+10]))
            time.sleep(1)
        save("original-source-metadata.json", sources)
        print(json.dumps({"pieces":len(rows), "sources":len(sources)}))
    elif args.mode == "search":
        output = []
        for query in args.values:
            result = api(action="query", list="search", srnamespace=6, srlimit=25, srsearch=query)
            matches = [{"title": row["title"], "snippet":clean(row["snippet"])} for row in result.get("query", {}).get("search", [])]
            output.append({"query":query,"matches":matches})
            time.sleep(1)
        filename = "search-" + hashlib.sha256("|".join(args.values).encode()).hexdigest()[:10] + ".json"
        save(filename, output)
        print(json.dumps({"saved": filename, "queries": len(output)}, ensure_ascii=False))
    elif args.mode == "info":
        rows=info(args.values)
        filename="info-"+hashlib.sha256("|".join(args.values).encode()).hexdigest()[:10]+".json"
        save(filename, rows)
        print(json.dumps({"saved": filename, "files": len(rows)}, ensure_ascii=False))
    elif args.mode == "page":
        for url in args.values:
            filename = "page-" + hashlib.sha256(url.encode()).hexdigest()[:10] + ".html"
            with request(url) as response:
                (WORK / filename).write_bytes(response.read())
            print(json.dumps({"url": url, "saved": filename}), flush=True)
    elif args.mode == "history":
        result=api(action="query", prop="imageinfo", iiprop="url|size|sha1|timestamp|comment",
                   iilimit=10, titles="|".join(args.values))
        filename="history-"+hashlib.sha256("|".join(args.values).encode()).hexdigest()[:10]+".json"
        save(filename,result)
        print(json.dumps({"saved":filename}))
    elif args.mode == "download":
        # A reviewed JSON plan names the exact source and local destination.
        plan=json.loads(pathlib.Path(args.values[0]).read_text(encoding="utf-8"))
        for row in plan:
            if pathlib.Path(row["file"]).name != row["file"] or row["file"] in (".", ".."):
                raise ValueError("Download destination must be a filename")
            target=WORK/"originals"/row["file"]
            target.parent.mkdir(exist_ok=True)
            if not target.exists():
                temporary=target.with_suffix(target.suffix+".part")
                with request(row["url"]) as response:
                    temporary.write_bytes(response.read())
                temporary.replace(target)
                time.sleep(6)
            if row.get("sourceSha1") and hashlib.sha1(target.read_bytes()).hexdigest() != row["sourceSha1"]:
                raise ValueError("Source SHA-1 mismatch: "+row["file"])
            row["downloadSha256"]=hashlib.sha256(target.read_bytes()).hexdigest()
            row["downloadProbe"]=probe(target)
            save("downloaded-"+pathlib.Path(args.values[0]).name,plan)
            print(json.dumps({"file":row["file"],"bytes":target.stat().st_size}),flush=True)
