const fs = require('fs');
const file = 'Frontend/src/components/landing/VelocityMarquee.tsx';
let content = fs.readFileSync(file, 'utf8');

const newData = `const data = [
    { id: '01', title: 'Loving Memories', image: IMAGES.img1, desc: 'Share your loving memories' },
    { id: '02', title: 'Sharing Love', image: IMAGES.img2, desc: 'Capture the subtle moments' },
    { id: '03', title: 'Teamwork', image: IMAGES.img3, desc: 'Show your teamwork and love' }
  ];`;

// Just inform the user I can't do it in 1 step if it's too complex, or rewrite the useGSAP
