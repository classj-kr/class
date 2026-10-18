const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const root = path.resolve(__dirname, '..');
const app = express();
app.get('/api/rhythm-training/session', (_req, res) => res.json({ isTeacher: false }));
app.get('/learning/arts/music-theory/rhythm-training/notation.js', (_req, res) =>
    res.sendFile(path.join(root, 'learning/arts/music-theory/ear-training/notation.js')));
app.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
app.use(express.static(root));
const server = app.listen(Number(process.env.RHYTHM_PREVIEW_PORT || 8766), '127.0.0.1', () => {
    console.log(`Rhythm preview: http://127.0.0.1:${server.address().port}/learning/arts/music-theory/rhythm-training/`);
});
