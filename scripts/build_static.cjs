const { copyFileSync, mkdirSync } = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const files=['index.html','demo/index.html','demo/styles.css','demo/app.js','demo/water-lesson.js','demo/water-lesson.css','demo/companion.css','demo/companion.js','demo/pacha.css','assets/pets/doudou-concept-v1.png','assets/pets/pacha-poses.png','assets/pets/pacha-trot.png'];
files.push('assets/video/pacha-park-story-v2.mp4','assets/video/pacha-park-poster-v2.jpg');
files.push('demo/game.js','demo/game.css','assets/pets/pacha-room-v1.png');
files.push('demo/beginner.js','demo/beginner.css');
files.push('assets/video/pacha-gravity-v1.mp4','assets/video/pacha-gravity-poster-v1.jpg');
files.push('assets/video/pacha-buoyancy-v1.mp4','assets/video/pacha-buoyancy-poster-v1.jpg');
for(const file of files){const dest=path.join(root,'dist',file);mkdirSync(path.dirname(dest),{recursive:true});copyFileSync(path.join(root,file),dest);}
console.log('Static publish output synchronized.');
