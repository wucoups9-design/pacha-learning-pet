const { copyFileSync, mkdirSync } = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const files=['index.html','demo/index.html','demo/styles.css','demo/app.js','demo/water-lesson.js','demo/water-lesson.css','demo/companion.css','demo/companion.js','demo/pacha.css','assets/pets/doudou-concept-v1.png','assets/pets/pacha-poses.png','assets/pets/pacha-trot.png'];
for(const file of files){const dest=path.join(root,'dist',file);mkdirSync(path.dirname(dest),{recursive:true});copyFileSync(path.join(root,file),dest);}
console.log('Static publish output synchronized.');
