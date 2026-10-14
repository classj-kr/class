"""고등 사회·과학 성취기준·성취수준 원문을 내려받아 글만 뽑아 references/moe/local-source에 둔다.

출처: 국가교육과정정보센터(NCIC) 성취수준 자료실. 2022 개정 교육과정의
성취기준 문장과 성취수준 서술이 그대로 담겨 있어, 교과서에서 실제로 쓰는
말이 무엇인지 재는 잣대가 된다. (공공누리 제2유형: 출처표시·상업적 이용 금지·변경 금지)
"""
import io
import os
import re
import sys
import urllib.request

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'references/moe/local-source')

# 글번호와 파일이름은 NCIC 성취수준 게시판(/bbs/standard/)에서 딴 것이다
DOCUMENTS = [
    ('social_common', 783, '1725500488646', '고등학교 사회과 공통과목(통합사회) 성취수준'),
    ('hist', 782, '1725500456188', '고등학교 역사과 공통과목(한국사) 성취수준'),
    ('sci_common', 779, '1725500122727', '고등학교 과학과 공통과목(통합과학·과학탐구실험) 성취수준'),
    ('social_elect', 1404, '202507220408257041', '고등학교 사회과 선택과목(경제·정치와 법·사회문화·지리 등) 성취수준'),
    ('hist_elect', 1399, '202507220409188091', '고등학교 역사과 선택과목 성취수준'),
    ('sci_elect', 1400, '202507220413167391', '고등학교 과학과 선택과목(물리·화학·생명·지구) 성취수준'),
]
URL = 'https://ncic.re.kr/bbs/download.do?articleIdx={idx}&fileName={name}.pdf'


def tidy(text):
    text = re.sub(r'[·․…]{3,}', '\n', text)                       # 목차 점선
    text = re.sub(r'(?:[가-힣] ){3,}[가-힣]',                       # 조판으로 벌어진 글자
                  lambda m: m.group(0).replace(' ', ''), text)
    return text


def main():
    from pypdf import PdfReader
    os.makedirs(OUT, exist_ok=True)
    for tag, idx, name, title in DOCUMENTS:
        pdf = os.path.join(OUT, f'{tag}.pdf')
        if not os.path.exists(pdf):
            print(f'내려받는 중: {title}')
            urllib.request.urlretrieve(URL.format(idx=idx, name=name), pdf)
        pages = PdfReader(pdf).pages
        text = []
        for page in pages:
            try:
                text.append(page.extract_text() or '')
            except Exception:
                pass
        body = tidy('\n'.join(text))
        with io.open(os.path.join(OUT, f'{tag}.txt'), 'w', encoding='utf-8') as stream:
            stream.write(body)
        print(f'  {tag}: {len(pages)}쪽 {len(body)}자')


if __name__ == '__main__':
    main()
