import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const allowed = new Map([['/','index.html'],['/index.html','index.html'],['/style.css','style.css'],['/app.mjs','app.mjs'],['/engine.mjs','engine.mjs'],['/assets/network/multiplayer-lobby.css','../../../assets/network/multiplayer-lobby.css']]);
export function createPreview() {
  return http.createServer(async (req,res) => {
    const file = allowed.get(new URL(req.url,'http://localhost').pathname);
    if(!file) { res.writeHead(404).end('Not found'); return; }
    try {
      const body = await readFile(new URL(file,import.meta.url));
      res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'});
      res.end(body);
    } catch { res.writeHead(500).end('Unable to load preview'); }
  });
}
if(process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const server=createPreview();
  server.listen(4317,'127.0.0.1',()=>console.log('Night Gallery preview: http://127.0.0.1:4317'));
  server.on('error',error=>{console.error(error.message);process.exitCode=1;});
}
