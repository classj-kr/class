from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
RELEASE=ROOT/'outputs/avatar-release'
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs): super().__init__(*args,directory=str(RELEASE),**kwargs)
    def translate_path(self,path):
        candidate=Path(super().translate_path(path))
        if candidate.exists(): return str(candidate)
        return str(ROOT/candidate.relative_to(RELEASE))
    def end_headers(self):
        self.send_header('Cache-Control','no-store')
        super().end_headers()
ThreadingHTTPServer(('127.0.0.1',8768),Handler).serve_forever()
