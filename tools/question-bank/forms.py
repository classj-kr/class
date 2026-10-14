# 꼴 목록에서 번호로 꼴을 꺼내 찍는다.  python tools/question-bank/forms.py 3-2-3 기본꼴_1:3,6 심화꼴:22
import io, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
unit = sys.argv[1]
for spec in sys.argv[2:]:
    name, nums = spec.split(':')
    want = set(nums.split(','))
    text = io.open(os.path.join(ROOT, 'references', 'textbooks', '수학', '_분석', unit, name + '.md'), encoding='utf-8').read()
    parts = re.split(r'(?m)^(?=#{2,3} )', text)
    for part in parts:
        m = re.match(r'### (\d+)\.', part)
        if m and m.group(1) in want:
            sys.stdout.buffer.write(('[%s] ' % name + part.strip()[:900] + '\n\n').encode('utf-8'))
