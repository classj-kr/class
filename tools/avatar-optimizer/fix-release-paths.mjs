import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../../outputs/avatar-release'),lab=path.join(root,'apps/avatar-lab');
const index=JSON.parse(await fs.readFile(path.join(lab,'collection-index.json'),'utf8'));
for(const a of index.avatars)a.original='/assets/avatars/'+a.id+'.webp';
await fs.writeFile(path.join(lab,'collection-index.json'),JSON.stringify(index,null,2)+'\n');
let s=await fs.readFile(path.join(lab,'collection.js'),'utf8');
s=s.replace("document.querySelector('#original').src=item.original;","document.querySelector('#original').src=item.original+'?v='+item.sourceRevision;");
s=s.replace('img.src=item.original;','img.src=item.original+\'?v=\'+item.sourceRevision;');
await fs.writeFile(path.join(lab,'collection.js'),s);
s=await fs.readFile(path.join(lab,'index.html'),'utf8');
s=s.replace(/\.\.\/classtools\/assets\/avatars\/([a-z0-9-]+)\.webp/g,(_,id)=>'/assets/avatars/'+id+'.webp?v='+index.avatars.find(a=>a.id===id).sourceRevision);
await fs.writeFile(path.join(lab,'index.html'),s);
for(const name of ['index.html','collection.html','collection-review.html']){
 const p=path.join(lab,name);s=await fs.readFile(p,'utf8');s=s.replace(/src="(app|collection|collection-review)\.js(?:\?[^" ]*)?"/g,'src="$1.js?v=20261112-release2"');await fs.writeFile(p,s);
}
console.log('Mapped artwork to public /assets/avatars; versioned UI and artwork URLs.');
