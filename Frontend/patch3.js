const fs = require('fs');
const file = 'src/components/landing/VelocityMarquee.tsx';
let txt = fs.readFileSync(file, 'utf8');

// 1. Ganti useRef bagian image wipe
const refsOld = `  // Image Sequence Refs (For the wipe effect)
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);
  const image3TeamRef = useRef<HTMLDivElement>(null);`;
const refsNew = `  // Image Sequence Refs (For the wipe effect)
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);
  const image3TeamRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);`;
txt = txt.replace(refsOld, refsNew);

// 2. Ganti animasi FASE 2
const phase2Old = `    // =========================================
    // FASE 2: THE EDITORIAL WIPE SEQUENCE
    // =========================================
    
    // Initial Setup: Images are clipped to nothing from the bottom up. Texts are hidden below the line.
    gsap.set([image1Ref.current, image2Ref.current, image3TeamRef.current], {
      clipPath: 'inset(100% 0% 0% 0%)',
      autoAlpha: 1 // They need to be visible to be clipped
    });
    
    gsap.set([text1Ref.current, text2Ref.current, textTeamOldRef.current], { y: 50, autoAlpha: 0 });
    gsap.set([tag1Ref.current, tag2Ref.current, tag3Ref.current], { autoAlpha: 0, y: 10 });


    // --- SCENE 1: Loving Memories ---
    // Wipe Image 1 up
    tl.to(image1Ref.current, { clipPath: 'inset(0% 0% 0% 0%)', duration: 2, ease: 'power3.inOut' });
    // Animate Progress Bar (0 to 33%)
    tl.to(progressFillRef.current, { scaleX: 0.33, duration: 2, ease: 'power3.inOut' }, "<");
    
    // Show Tag 1 and Text 1
    tl.to(tag1Ref.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.5");
    tl.to(text1Ref.current, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' }, "-=0.5");
    
    tl.to({}, { duration: 2 }); // Hold Scene 1
    
    // Hide Tag 1 and Text 1
    tl.to([tag1Ref.current, text1Ref.current], { autoAlpha: 0, y: -20, duration: 0.8 });


    // --- SCENE 2: Subtle Moments ---
    // Wipe Image 2 over Image 1
    tl.to(image2Ref.current, { clipPath: 'inset(0% 0% 0% 0%)', duration: 2, ease: 'power3.inOut' });
    // Animate Progress Bar (33% to 66%)
    tl.to(progressFillRef.current, { scaleX: 0.66, duration: 2, ease: 'power3.inOut' }, "<");
    
    // Show Tag 2 and Text 2
    tl.to(tag2Ref.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.5");
    tl.to(text2Ref.current, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' }, "-=0.5");
    
    tl.to({}, { duration: 2 }); // Hold Scene 2
    
    // Hide Tag 2 and Text 2
    tl.to([tag2Ref.current, text2Ref.current], { autoAlpha: 0, y: -20, duration: 0.8 });


    // --- SCENE 3: Teamwork ---
    // Wipe Image 3 over Image 2
    tl.to(image3TeamRef.current, { clipPath: 'inset(0% 0% 0% 0%)', duration: 2, ease: 'power3.inOut' });
    // Animate Progress Bar (66% to 100%)
    tl.to(progressFillRef.current, { scaleX: 1, duration: 2, ease: 'power3.inOut' }, "<");
    
    // Show Tag 3 and Text 3
    tl.to(tag3Ref.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.5");
    tl.to(textTeamOldRef.current, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' }, "-=0.5");
    
    tl.to({}, { duration: 1.5 }); // Hold Scene 3

    // Hide UI elements for the finale
    tl.to([textTeamOldRef.current, tag3Ref.current, progressBarRef.current], { autoAlpha: 0, duration: 0.8 });
    
    // Reveal Giant Final Text
    tl.fromTo(textTeamNewRef.current, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 1.5, ease: 'power3.out' });
    tl.to({}, { duration: 2 }); // Hold Epic Finale`;

const phase2New = `    // =========================================
    // FASE 2: THE EDITORIAL WIPE SEQUENCE (FLOEMA STYLE)
    // =========================================
    
    // Setup for images: Only the first image is fully visible, others begin as small inset rounded cards at the bottom
    gsap.set(panelsRef.current.slice(1), {
      clipPath: 'inset(70% 35% 10% 35% round 20px)'
    });
    
    gsap.set([text1Ref.current, text2Ref.current, textTeamOldRef.current], { y: 50, autoAlpha: 0 });
    gsap.set([tag1Ref.current, tag2Ref.current, tag3Ref.current], { autoAlpha: 0, y: 10 });


    // --- SCENE 1: Loving Memories (Panel 0/Img 1) Start visible ---
    // Show Tag 1 and Text 1
    tl.to(tag1Ref.current, { autoAlpha: 1, y: 0, duration: 0.5 });
    tl.to(text1Ref.current, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' }, "-=0.5");
    tl.to(progressFillRef.current, { scaleX: 0.33, duration: 1, ease: 'power3.inOut' }, "<");
    
    tl.to({}, { duration: 2 }); // Hold Scene 1 (Panel 0 text)
    
    // Hide Tag 1 and Text 1
    tl.to([tag1Ref.current, text1Ref.current], { autoAlpha: 0, y: -20, duration: 0.8 });


    // --- SCENE 2: Subtle Moments (Panel 1/Img 2 expands) ---
    tl.to(progressFillRef.current, { scaleX: 0.66, duration: 2, ease: 'power3.inOut' }, "<");
    tl.to(panelsRef.current[1], { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 2, ease: 'power3.inOut' }, "<");
    
    // Show Tag 2 and Text 2
    tl.to(tag2Ref.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.5");
    tl.to(text2Ref.current, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' }, "-=0.5");
    
    tl.to({}, { duration: 2 }); // Hold Scene 2
    
    // Hide Tag 2 and Text 2
    tl.to([tag2Ref.current, text2Ref.current], { autoAlpha: 0, y: -20, duration: 0.8 });


    // --- SCENE 3: Teamwork (Panel 2/Img 3 expands) ---
    tl.to(progressFillRef.current, { scaleX: 1, duration: 2, ease: 'power3.inOut' }, "<");
    tl.to(panelsRef.current[2], { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 2, ease: 'power3.inOut' }, "<");
    
    // Show Tag 3 and Text 3
    tl.to(tag3Ref.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.5");
    tl.to(textTeamOldRef.current, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' }, "-=0.5");
    
    tl.to({}, { duration: 1.5 }); // Hold Scene 3

    // Hide UI elements for the finale
    tl.to([textTeamOldRef.current, tag3Ref.current, progressBarRef.current], { autoAlpha: 0, duration: 0.8 });
    
    // Reveal Giant Final Text
    tl.fromTo(textTeamNewRef.current, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 1.5, ease: 'power3.out' });
    tl.to({}, { duration: 2 }); // Hold Epic Finale`;

txt = txt.replace(phase2Old, phase2New);

// 3. Ganti JSX Images
const jsxOld = `{/* ========================================================= */}
      {/* Z-INDEX 30-32: THE WIPE SEQUENCE IMAGES                   */}
      {/* ========================================================= */}
      {/* Stacked carefully. Lower z-index renders first. Higher z-index wipes over it. */}
      
      <div 
        ref={image1Ref}
        className="invisible absolute inset-0 w-full h-full bg-cover bg-center z-[30]"
        style={{ backgroundImage: \`url("\${IMAGES.img1}")\` }}
      />
      <div 
        ref={image2Ref}
        className="invisible absolute inset-0 w-full h-full bg-cover bg-center z-[31]"
        style={{ backgroundImage: \`url("\${IMAGES.img2}")\` }}
      />
      <div 
        ref={image3TeamRef}
        className="invisible absolute inset-0 w-full h-full bg-cover bg-center z-[32]"
        style={{ backgroundImage: \`url("\${IMAGES.img3}")\` }}
      />`;

const jsxNew = `{/* ========================================================= */}
      {/* Z-INDEX 30-32: THE WIPE SEQUENCE IMAGES (FLOEMA STYLE)  */}
      {/* ========================================================= */}
      {/* Panel rendering setup */}
      
      <div className="absolute inset-0 z-[30] pointer-events-none">
        <div 
          ref={el => { if (el) panelsRef.current[0] = el; }}
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: \`url("\${IMAGES.img1}")\` }}
        />
        <div 
          ref={el => { if (el) panelsRef.current[1] = el; }}
          className="absolute inset-0 w-full h-full bg-cover bg-center z-[31]"
          style={{ backgroundImage: \`url("\${IMAGES.img2}")\` }}
        />
        <div 
          ref={el => { if (el) panelsRef.current[2] = el; }}
          className="absolute inset-0 w-full h-full bg-cover bg-center z-[32]"
          style={{ backgroundImage: \`url("\${IMAGES.img3}")\` }}
        />
      </div>`;

txt = txt.replace(jsxOld, jsxNew);

fs.writeFileSync(file, txt);
