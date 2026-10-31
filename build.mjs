import fs from 'node:fs/promises';
await fs.mkdir('dist',{recursive:true});
for(const name of ['index.html','app.js'])await fs.copyFile(name,'dist/'+name);
console.log('Built Cell Studio with public model and decoder URLs');
