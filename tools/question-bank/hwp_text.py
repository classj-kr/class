# -*- coding: utf-8 -*-
"""한글(hwp 5.x) 문서에서 글과 수식 스크립트를 읽어 낸다. 문제은행의 유형 분석에 쓴다.

    python tools/question-bank/hwp_text.py 문서.hwp            글을 화면에 찍는다
    python tools/question-bank/hwp_text.py 폴더 --out 나갈폴더   폴더 안 hwp를 모두 txt로 바꾼다

hwp는 OLE 묶음이고, 본문은 BodyText/Section* 에 압축된 레코드 줄로 들어 있다.
문단 글(PARA_TEXT) 안의 제어 문자 자리에 수식·표·그림이 걸려 있고, 그 내용은 뒤따르는 레코드에 있다.
수식은 한글 수식 편집기 스크립트 그대로 [수식: …] 로, 표와 그림은 [표] [그림] 표시로 남긴다.
배포용(ViewText)·암호 문서는 읽지 못한다고 알린다. 읽어 낸 글은 저작물이므로 저장소에 올리지 않는다.
"""
import os
import sys
import zlib
import struct

import olefile

TAG_PARA_HEADER, TAG_PARA_TEXT, TAG_CTRL_HEADER, TAG_EQEDIT = 66, 67, 71, 88
# 문단 글 안에서 한 칸만 차지하는 제어 문자. 나머지 32 미만은 여덟 칸을 차지한다.
SINGLE = {0, 10, 13, 24, 25, 26, 27, 28, 29, 30, 31}
# 여덟 칸 가운데 뒤따르는 CTRL_HEADER 레코드가 없는 것(글자처럼 흐르는 제어).
INLINE = {4, 5, 6, 7, 8, 9, 19, 20}
SLOT = "￼"


def records(data):
    pos = 0
    while pos + 4 <= len(data):
        head = struct.unpack_from("<I", data, pos)[0]
        pos += 4
        tag, level, size = head & 0x3FF, (head >> 10) & 0x3FF, (head >> 20) & 0xFFF
        if size == 0xFFF:
            size = struct.unpack_from("<I", data, pos)[0]
            pos += 4
        yield tag, level, data[pos:pos + size]
        pos += size


def para_text(payload):
    units = struct.unpack("<%dH" % (len(payload) // 2), payload[:len(payload) // 2 * 2])
    out, i = [], 0
    while i < len(units):
        code = units[i]
        if code >= 32:
            out.append(chr(code))
            i += 1
        elif code in SINGLE:
            out.append("\n" if code == 10 else " " if code in (30, 31) else "-" if code == 24 else "")
            i += 1
        else:
            out.append("\t" if code == 9 else "" if code in INLINE else SLOT)
            i += 8
    return "".join(out)


def section_text(data):
    paras = []       # {"level", "raw", "slots"}: raw 의 제어 자리(SLOT)를 slots 로 채워 찍는다
    stack = []       # 열려 있는 문단의 차례 번호(수준순)
    ctrl_owner = {}  # 제어 수준 -> (문단 번호, 몇 번째 자리)
    for tag, level, payload in records(data):
        if tag == TAG_PARA_HEADER:
            while stack and paras[stack[-1]]["level"] >= level:
                stack.pop()
            paras.append({"level": level, "raw": "", "slots": []})
            stack.append(len(paras) - 1)
        elif tag == TAG_PARA_TEXT and stack:
            paras[stack[-1]]["raw"] = para_text(payload)
        elif tag == TAG_CTRL_HEADER and stack:
            # 이 제어가 속한 문단: 수준이 낮은 가장 가까운 문단.
            owner = next((p for p in reversed(stack) if paras[p]["level"] < level), None)
            if owner is None:
                continue
            ctrl_id = payload[:4][::-1].decode("latin-1", "replace")
            paras[owner]["slots"].append({"tbl ": "[표]", "gso ": "[그림]", "eqed": "[수식]"}.get(ctrl_id, ""))
            ctrl_owner[level] = (owner, len(paras[owner]["slots"]) - 1)
        elif tag == TAG_EQEDIT:
            where = ctrl_owner.get(level - 1)
            if where and len(payload) >= 6:
                count = struct.unpack_from("<H", payload, 4)[0]
                script = payload[6:6 + count * 2].decode("utf-16-le", "replace")
                paras[where[0]]["slots"][where[1]] = "[수식: " + " ".join(script.split()) + "]"
    lines = []
    for para in paras:
        out, k = [], 0
        for ch in para["raw"]:
            if ch == SLOT:
                out.append(para["slots"][k] if k < len(para["slots"]) else "")
                k += 1
            else:
                out.append(ch)
        text = "".join(out).strip()
        if text:
            lines.append(text)
    return "\n".join(lines)


def hwp_to_text(path):
    ole = olefile.OleFileIO(path)
    try:
        header = ole.openstream("FileHeader").read()
        flags = struct.unpack_from("<I", header, 36)[0]
        names = ["/".join(n) for n in ole.listdir()]
        if flags & 2:
            raise ValueError("암호가 걸린 문서")
        if any(n.startswith("ViewText") for n in names) and not any(n.startswith("BodyText") for n in names):
            raise ValueError("배포용 문서")
        sections = sorted((n for n in names if n.startswith("BodyText/Section")), key=lambda n: int(n.rsplit("Section", 1)[1]))
        parts = []
        for name in sections:
            data = ole.openstream(name).read()
            if flags & 1:
                data = zlib.decompress(data, -15)
            parts.append(section_text(data))
        return "\n".join(p for p in parts if p)
    finally:
        ole.close()


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    src = argv[1]
    out_dir = argv[argv.index("--out") + 1] if "--out" in argv else None
    if os.path.isfile(src):
        sys.stdout.reconfigure(encoding="utf-8")
        print(hwp_to_text(src))
        return 0
    done = failed = 0
    for folder, _dirs, files in os.walk(src):
        for name in files:
            if not name.lower().endswith(".hwp"):
                continue
            path = os.path.join(folder, name)
            target = os.path.join(out_dir, os.path.relpath(path, src))[:-4] + ".txt"
            os.makedirs(os.path.dirname(target), exist_ok=True)
            try:
                text = hwp_to_text(path)
                with open(target, "w", encoding="utf-8") as handle:
                    handle.write(text)
                done += 1
            except Exception as error:  # 못 읽는 문서는 까닭을 남기고 넘어간다.
                with open(target + ".못읽음", "w", encoding="utf-8") as handle:
                    handle.write(str(error))
                failed += 1
    print("읽음 %d, 못 읽음 %d" % (done, failed))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
