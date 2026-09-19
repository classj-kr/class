const fs = require('node:fs');
for (const slug of process.argv.slice(2)) {
  const dir = 'learning/inquiry/science-lab/' + slug + '/';
  const html = fs.readFileSync(dir + 'index.html', 'utf8');
  console.log('\nAPP ' + slug);
  console.log(html.match(/<div class="grade-tags">[^\n]*/)?.[0]);
  console.log([...html.matchAll(/<(?:h3|legend|p)(?: [^>]*)?>[\s\S]*?<\/(?:h3|legend|p)>/g)]
    .map(m => m[0].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()).join('\n'));
}
