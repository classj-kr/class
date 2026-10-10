// Hash children before their loaders so a shared-panel change reaches every app.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab');
const digest=s=>crypto.createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex').slice(0,12);
function synchronize(base=root,write=false){
 const changed=[],cache=new Map(),visiting=new Set();
 function visit(file){
  if(cache.has(file))return cache.get(file);
  if(visiting.has(file))throw Error('Asset dependency cycle: '+file);
  visiting.add(file);const original=fs.readFileSync(file,'utf8');let text=original;
  const version=(url)=>{const relative=url.split('?')[0];if(/^(?:https?:|\/\/|data:)/.test(relative))return url;const child=path.resolve(path.dirname(file),relative);if(!fs.existsSync(child)||!fs.statSync(child).isFile())throw Error('Missing asset: '+file+' -> '+url);const source=child.startsWith(base+path.sep)&&/\.(?:js|css)$/.test(child)?visit(child):fs.readFileSync(child,'utf8');return relative+'?v='+digest(source);};
  if(file.endsWith('.js'))text=text.replace(/(['"])([.\w/-]+\.(?:js|css)\?v=[\w.-]+)\1/g,(_,quote,url)=>quote+version(url)+quote);
  if(file.endsWith('.html'))text=text.replace(/((?:src|href)=["'])([^"']+\.(?:js|css)(?:\?v=[\w.-]+)?)(["'])/g,(_,prefix,url,suffix)=>prefix+version(url)+suffix);
  visiting.delete(file);cache.set(file,text);if(text!==original){changed.push(path.relative(base,file).replaceAll('\\','/'));if(write)fs.writeFileSync(file,text);}return text;
 }
 const files=fs.readdirSync(base,{recursive:true}).filter(p=>/\.(?:html|js|css)$/.test(p));for(const p of files)visit(path.join(base,p));return changed;
}
module.exports={synchronize,digest};
if(require.main===module){const changed=synchronize(root,process.argv.includes('--write'));console.log(JSON.stringify({changed:changed.length,files:changed}));if(process.argv.includes('--check')&&changed.length)process.exitCode=1;}
