const fs = require('node:fs'), path = require('node:path'), { fork } = require('node:child_process');
const assert = require('node:assert/strict');
const project = path.resolve(__dirname, '..');
if (process.argv.includes('--server')) {
  const Module = require('node:module'), file = path.join(project, 'server.js'), mod = new Module(file, module);
  mod.filename = file; mod.paths = Module._nodeModulePaths(project);
  mod._compile(fs.readFileSync(file, 'utf8') + '\nserver.on("listening",()=>process.send({port:server.address().port}));', file);
} else {
  const { io } = require(path.join(project, 'node_modules/socket.io-client'));
  const temp = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'voyage-load-'));
  const child = fork(__filename, ['--server'], { env: { ...process.env, PORT: '0', DATA_DIR: temp }, silent: true });
  let logs = ''; child.stdout.on('data', d => logs += d); child.stderr.on('data', d => logs += d);
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const ack = (s, event, data={}) => new Promise((resolve, reject) => s.timeout(20000).emit(event, data, (e,r) => e ? reject(e) : r?.ok === false ? reject(Error(r.error)) : resolve(r)));
  const clients = [], measures = [];
  (async () => {
    try {
      const port = await new Promise((resolve,reject) => { child.once('message', m => resolve(m.port)); child.once('exit', () => reject(Error(logs))); });
      for (let i=0; i<33; i++) {
        const s=io(`http://127.0.0.1:${port}`, { autoConnect:false, transports:['polling'], reconnection:false });
        clients.push(s); await new Promise((r,j)=>{s.once('connect',r);s.once('connect_error',j);s.connect()});
        const measure={last:0,maxGap:0,snapshots:0,moving:0}; measures.push(measure);
        s.on('snapshot', snap=>{const now=Date.now();if(measure.last)measure.maxGap=Math.max(measure.maxGap,now-measure.last);measure.last=now;measure.snapshots++;if(snap.you.moving)measure.moving++;});
      }
      const room=await ack(clients[0],'createRoom',{roomType:'free'});
      await Promise.all(clients.map((s,i)=>ack(s,'joinClass',{roomCode:room.roomCode,name:`검수${i}`,hostToken:i===0?room.hostToken:undefined})));
      await ack(clients[0],'hostStartFree'); await delay(500);
      for(const s of clients)s.emit('input',{left:true}); await delay(3000);
      console.log('MANUAL', JSON.stringify({clients:clients.length,maxGap:Math.max(...measures.map(m=>m.maxGap)),movingClients:measures.filter(m=>m.moving>0).length}));
      for(const s of clients)s.emit('input',{});
      await delay(500); measures.forEach(m=>{m.maxGap=0;m.snapshots=0;m.moving=0;});
      // Separate nearby destination cells so route sharing cannot hide the load.
      for(let i=0;i<clients.length;i++) clients[i].emit('setTarget',{x:(120+i*.15+180)/360*40000,y:(90+5)/180*20000});
      clients.at(-1).emit('stop');
      await delay(10000);
      const result={clients:clients.length,targets:measures.map(m=>({maxGap:m.maxGap,snapshots:m.snapshots,moving:m.moving}))};
      console.log('TARGET',JSON.stringify({clients:clients.length,maxGap:Math.max(...measures.map(m=>m.maxGap)),movingClients:measures.filter(m=>m.moving>0).length}));
      assert(measures.every(m=>m.maxGap < 750), '33 destinations must not stall movement snapshots');
      assert(measures.slice(0,-1).every(m=>m.moving > 0), 'all other students must sail');
      assert.equal(measures.at(-1).moving, 0, 'stop must invalidate a pending route');
    } finally {clients.forEach(s=>s.disconnect());child.kill();}
  })().catch(e=>{console.error(e,logs);process.exitCode=1});
}
