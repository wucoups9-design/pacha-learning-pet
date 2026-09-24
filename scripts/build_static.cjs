const { copyFileSync, mkdirSync } = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const files=['index.html','demo/index.html','demo/styles.css','demo/app.js','demo/companion.css','demo/companion.js','assets/pets/doudou-concept-v1.png'];
for(const file of files){const dest=path.join(root,'dist',file);mkdirSync(path.dirname(dest),{recursive:true});copyFileSync(path.join(root,file),dest);}
console.log('Static publish output synchronized.');
