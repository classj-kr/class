#!/bin/bash
# 채우기 도우미가 사본에 쓴 c.js를 원본에 옮겨 검사하고, 새 문항만 펼쳐 찍는다.
#   bash tools/question-bank/intake.sh <단원> <사본 math-bank 폴더> [찍을 줄 범위: 1,60] [갈래 글자: c]
set -e
unit="$1"; from="$2"; range="${3:-1,400}"; part="${4:-c}"
here="$(cd "$(dirname "$0")/../.." && pwd)"
dest="$here/learning/literacy-numeracy/math-bank/units/${unit}${part}.js"
cp "$from/units/${unit}${part}.js" "$dest"
node "$here/tools/question-bank/tryseeds.cjs" "$unit"
node "$here/tools/question-bank/shapes.cjs" "$unit"
(cd "$here" && node --test tests/math-bank-units.test.cjs 2>&1 | grep -E "^ℹ (pass|fail)|AssertionError" | head -6)
ids=$(grep -oE "\b[TH]\('[a-z0-9-]+'" "$dest" | sed -E "s/[TH]\('//; s/'//" | paste -sd'|')
node "$here/tools/question-bank/dump.cjs" "$unit" | grep -E "^==|\[($ids)\]" | cut -c1-300 | sed -n "${range}p"
node "$here/tools/question-bank/dump.cjs" "$unit" | tail -1
