const fs = require('fs');
const file = 'Frontend/src/components/landing/VelocityMarquee.tsx';
let content = fs.readFileSync(file, 'utf8');

// Tambahkan ref untuk array panel floema
const importsAndRefs = content.replace(
  `  // Initial Setup: Images are clipped to nothing from the bottom up. Texts are hidden below the line.`,
  `  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);\n  // Initial Setup: Images are clipped to nothing from the bottom up. Texts are hidden below the line.`
);

// Ganti logika animasi FASE 2
const gsapAnimStart = content.indexOf('    // =========================================\n    // FASE 2: THE EDITORIAL WIPE SEQUENCE');
const gsapAnimEnd = content.indexOf('    // =========================================\n    // FASE 3: THE CINEMATIC BLACKOUT & MANIFESTO');

const newGsapAnim = `    // =========================================
    // FASE 2: THE EDITORIAL WIPE SEQUENCE (FLOEMA STYLE)
    // =========================================
    
    // Initial Setup: Semua panel ditumpuk (absolute). Panel pertama full, berikutnya inset.
    gsap.set(panelsRef.current.slice(1), {
      clipPath: 'inset(70% 35% 10% 35% round 20px)'
    });
    
    // Texts setup
    const texts = [text1Ref.current, text2Ref.current, textTeamOldRef.current];
    const tags = [tag1Ref.current, tag2Ref.current, tag3Ref.current];
    gsap.set(texts, { y: 50, autoAlpha: 0 });
    gsap.set(tags, { autoAlpha: 0, y: 10 });

    // Tampilkan panel 0 (Gambar 1)
    tl.to(tag1Ref.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.5");
    tl.to(text1Ref.current, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' }, "-=0.5");
    tl.to({}, { duration: 2 }); // Tahan Scene 1
    tl.to([tag1Ref.current, text1Ref.current], { autoAlpha: 0, y: -20, duration: 0.8 });

    // Scene 2: Panel 1 expand
    tl.to(progressFillRef.current, { scaleX: 0.5, duration: 2, ease: 'power3.inOut' }, "<");
    tl.to(panelsRef.current[1], {
      clipPath: 'inset(0% 0% 0% 0% round 0px)',
      duration: 2,
      ease: 'power3.inOut'
    }, "<");

    tl.to(tag2Ref.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.5");
    tl.to(text2Ref.current, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' }, "-=0.5");
    tl.to({}, { duration: 2 }); // Tahan Scene 2
    tl.to([tag2Ref.current, text2Ref.current], { autoAlpha: 0, y: -20, duration: 0.8 });

    // Scene 3: Panel 2 expand
    tl.to(progressFillRef.current, { scaleX: 1, duration: 2, ease: 'power3.inOut' }, "<");
    tl.to(panelsRef.current[2], {
      clipPath: 'inset(0% 0% 0% 0% round 0px)',
      duration: 2,
      ease: 'power3.inOut'
    }, "<");

    tl.to(tag3Ref.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.5");
    tl.to(textTeamOldRef.current, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' }, "-=0.5");
    tl.to({}, { duration: 1.5 }); // Tahan Scene 3

    // Sembunyikan UI elements
    tl.to([textTeamOldRef.current, tag3Ref.current, progressBarRef.current], { autoAlpha: 0, duration: 0.8 });
    
    // Reveal Giant Final Text
    tl.fromTo(textTeamNewRef.current, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 1.5, ease: 'power3.out' });
    tl.to({}, { duration: 2 }); // Tahan Epic Finale

`;

// Ganti struktur JSX gambar
const jsxStart = content.indexOf('{/* Z-INDEX 30-32: THE WIPE SEQUENCE IMAGES                   */}');
const jsxEnd = content.indexOf('{/* ========================================================= */\n      {/* Z-INDEX 40: PROGRESS BAR UI & EDITORIAL TEXTS             */}');

const newJsx = `{/* Z-INDEX 30-32: THE WIPE SEQUENCE IMAGES (FLOEMA STYLE)  */}
      {/* ========================================================= */}
      
      <div className="absolute inset-0 z-[30] pointer-events-none">
        <div 
          ref={el => panelsRef.current[0] = el}
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: \`url("\${IMAGES.img1}")\` }}
        />
        <div 
          ref={el => panelsRef.current[1] = el}
          className="absolute inset-0 w-full h-full bg-cover bg-center z-[31]"
          style={{ backgroundImage: \`url("\${IMAGES.img2}")\` }}
        />
        <div 
          ref={el => panelsRef.current[2] = el}
          className="absolute inset-0 w-full h-full bg-cover bg-center z-[32]"
          style={{ backgroundImage: \`url("\${IMAGES.img3}")\` }}
        />
      </div>

      `;

let newContent = content.substring(0, gsapAnimStart) + newGsapAnim + content.substring(gsapAnimEnd);
newContent = newContent.substring(0, newContent.indexOf('{/* Z-INDEX 30-32: THE WIPE SEQUENCE IMAGES                   */}')) + newJsx + newContent.substring(newContent.indexOf('{/* ========================================================= */\n      {/* Z-INDEX 40: PROGRESS BAR UI & EDITORIAL TEXTS             */}'));

// Inject panelsRef decl
newContent = newContent.replace('const image3TeamRef = useRef<HTMLDivElement>(null);', 'const image3TeamRef = useRef<HTMLDivElement>(null);\n  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);');

fs.writeFileSync(file, newContent);
console.log("Berhasil memodifikasi transisi Floema.");
