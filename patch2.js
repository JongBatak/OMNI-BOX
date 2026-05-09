const fs = require('fs');
const file = 'Frontend/src/components/landing/LoadingOverlay.tsx';
let txt = fs.readFileSync(file, 'utf8');

const oldSVG = `{/* OMNI Word - Converted to exact geometric paths to guarantee perfect lining animations and prevent font-engine breakages */}
          <path className="omni-stroke" d="M 255 240 L 295 240 A 60 60 0 0 1 355 300 L 355 360 A 60 60 0 0 1 295 420 L 255 420 A 60 60 0 0 1 195 360 L 195 300 A 60 60 0 0 1 255 240 Z M 235 300 L 235 360 A 20 20 0 0 0 255 380 L 295 380 A 20 20 0 0 0 315 360 L 315 300 A 20 20 0 0 0 295 280 L 255 280 A 20 20 0 0 0 235 300 Z" fillRule="evenodd" fill="none" stroke="white" strokeWidth="4" />
          <path className="omni-stroke" d="M 445 420 L 445 240 L 495 240 L 545 330 L 595 240 L 645 240 L 645 420 L 605 420 L 605 302 L 545 410 L 485 302 L 485 420 Z" fill="none" stroke="white" strokeWidth="4" />
          <path className="omni-stroke" d="M 735 420 L 735 240 L 785 240 L 835 340 L 835 240 L 875 240 L 875 420 L 825 420 L 775 320 L 775 420 Z" fill="none" stroke="white" strokeWidth="4" />
          <path className="omni-stroke" d="M 965 420 L 965 240 L 1005 240 L 1005 420 Z" fill="none" stroke="white" strokeWidth="4" />`;

const newSVG = `{/* NEW: Premium Motive O (Box), B, and X */}
          <g className="motive-box-wrapper" style={{ transformOrigin: '600px 330px' }}>
            <path className="motive-box box-left" d="M 590 240 L 540 240 L 540 420 L 590 420" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square" />
            <path className="motive-box box-right" d="M 610 240 L 660 240 L 660 420 L 610 420" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square" />
          </g>

          <path className="bx-letter bx-b" d="M 490 396 L 490 504 M 490 396 C 520 396, 520 450, 490 450 C 520 450, 520 504, 490 504" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square" />
          <path className="bx-letter bx-x" d="M 680 396 L 720 504 M 720 396 L 680 504" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square" />

          {/* OMNI Word */}
          <path className="omni-stroke" d="M 255 240 L 295 240 A 60 60 0 0 1 355 300 L 355 360 A 60 60 0 0 1 295 420 L 255 420 A 60 60 0 0 1 195 360 L 195 300 A 60 60 0 0 1 255 240 Z M 235 300 L 235 360 A 20 20 0 0 0 255 380 L 295 380 A 20 20 0 0 0 315 360 L 315 300 A 20 20 0 0 0 295 280 L 255 280 A 20 20 0 0 0 235 300 Z" fillRule="evenodd" fill="none" stroke="white" strokeWidth="4" />
          <path className="omni-stroke" d="M 445 420 L 445 240 L 495 240 L 545 330 L 595 240 L 645 240 L 645 420 L 605 420 L 605 302 L 545 410 L 485 302 L 485 420 Z" fill="none" stroke="white" strokeWidth="4" />
          <path className="omni-stroke" d="M 735 420 L 735 240 L 785 240 L 835 340 L 835 240 L 875 240 L 875 420 L 825 420 L 775 320 L 775 420 Z" fill="none" stroke="white" strokeWidth="4" />
          <path className="omni-stroke" d="M 965 420 L 965 240 L 1005 240 L 1005 420 Z" fill="none" stroke="white" strokeWidth="4" />`;


const oldGsap = `// Initial state: screen is completely empty blue
      gsap.set(q('.omni-stroke'), { strokeDasharray: 3000, strokeDashoffset: 3000, fill: 'transparent' });
      gsap.set(q('.motif-line'), { strokeDasharray: 3000, strokeDashoffset: 3000 });
      gsap.set(q('.bg-gradient-shift'), { backgroundPosition: '0% 0%' });
      gsap.set(q('.progress-val'), { opacity: 0 });
      gsap.set(q('.counter-wrapper'), { opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlayRef.current, { pointerEvents: 'none', display: 'none' });
        },
      });
      
      tlRef.current = tl;

      // 0. The Empty Blue Screen Wait (1.2 seconds)
      tl.to({}, { duration: 1.2 });

      // 1. Converging abstract SVG lines (the OMNI mask & motifs) - ZERO LAG ZONE
      tl.to(q('.motif-line'), {
        strokeDashoffset: 0,
        duration: 3.5,
        stagger: 0.1,
        ease: 'power4.inOut',
      }, 1.2);

      tl.to(q('.omni-stroke'), {
        strokeDashoffset: 0,
        duration: 2.5,
        stagger: 0.15,
        ease: 'expo.inOut',
      }, 1.5);

      // Pop the geometric fill
      tl.to(q('.omni-stroke'), {
        fill: '#FFFFFF',
        stroke: 'transparent',
        duration: 0.8,
        ease: 'power3.out',
      }, 3.5);

      // 2. SVG animation complete. Safe to mount heavy WebGL now.
      const loadingStart = 4.5;

      // Intentionally call \`onInitSpline()\` asynchronously heavily decoupled from GSAP frames
      tl.call(() => {
        setTimeout(() => {
          onInitSpline();
        }, 0);
      }, undefined, loadingStart);

      // Shift Background slowly
      tl.to(q('.bg-gradient-shift'), {
        backgroundPosition: '100% 100%',
        duration: 3.5,
        ease: 'sine.inOut'
      }, loadingStart);

      // Fade in counter 
      tl.to(q('.counter-wrapper'), {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, loadingStart);
      
      tl.to(q('.progress-val'), {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, loadingStart);

      // Counter progress
      tl.to(progress, {
        value: 100,
        duration: 3.0,
        ease: 'expo.inOut',
        onUpdate: () => {
          const el = q('.progress-num')[0];
          if (el) el.textContent = Math.round(progress.value).toString().padStart(3, '0');
        }
      }, loadingStart);

      // 3. THE SPLINE WAIT
      const handoffStart = loadingStart + 3.0;

      // Evaluate the Spline Load Status
      tl.call(() => {
        if (overlayRef.current?.getAttribute('data-spline-phase') !== 'ready') {
          tl.pause();
        }
      }, undefined, handoffStart);

      // Now that we are fully ready, instead of immediately raising the curtain,
      // reverse the SVG linings and OMNI mask back to empty.
      
      tl.to(q('.omni-stroke'), {
        fill: 'transparent',
        stroke: 'rgba(255,255,255,0.7)',
        duration: 0.5,
        ease: 'power2.inOut',
      }, handoffStart + 0.1);

      tl.to(q('.omni-stroke'), {
        strokeDashoffset: 3000,
        duration: 1.5,
        ease: 'power4.inOut',
        stagger: { each: 0.1, from: 'end' }
      }, handoffStart + 0.3);

      tl.to(q('.motif-line'), {
        strokeDashoffset: 3000,
        duration: 1.5,
        ease: 'power4.inOut',
      }, handoffStart + 0.3);

      const hideElementsStart = handoffStart + 1.6;

      // The Handoff - Notifying Hero
      tl.call(() => {
        onStartHero();
      }, undefined, hideElementsStart);

      // Hide elements`;


const newGsap = `// Initial state: screen is completely empty blue
      gsap.set(q('.omni-stroke'), { strokeDasharray: 3000, strokeDashoffset: 3000, fill: 'transparent' });
      gsap.set(q('.motif-line'), { strokeDasharray: 3000, strokeDashoffset: 3000 });
      gsap.set(q('.motive-box'), { strokeDasharray: 3000, strokeDashoffset: 3000 });
      gsap.set(q('.bx-letter'), { strokeDasharray: 3000, strokeDashoffset: 3000 });
      gsap.set(q('.bg-gradient-shift'), { backgroundPosition: '0% 0%' });
      gsap.set(q('.progress-val'), { opacity: 0 });
      gsap.set(q('.counter-wrapper'), { opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlayRef.current, { pointerEvents: 'none', display: 'none' });
        },
      });
      
      tlRef.current = tl;

      // 0. The Empty Blue Screen Wait
      tl.to({}, { duration: 0.5 });

      // 1. Draw Motifs & Premium Motive O
      tl.to(q('.motif-line'), {
        strokeDashoffset: 0,
        duration: 3.0,
        stagger: 0.1,
        ease: 'power4.inOut',
      }, 0.5);

      tl.to(q('.motive-box'), {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power3.inOut',
      }, 0.5);

      // 2. Open the Box to reveal OMNI
      tl.to(q('.box-left'), {
        x: -420,
        duration: 2.0,
        ease: 'power4.inOut'
      }, 2.2);

      tl.to(q('.box-right'), {
        x: 420,
        duration: 2.0,
        ease: 'power4.inOut'
      }, 2.2);

      // 3. Draw OMNI while box opens
      tl.to(q('.omni-stroke'), {
        strokeDashoffset: 0,
        duration: 2.0,
        stagger: 0.1,
        ease: 'expo.inOut',
      }, 2.5);

      // OMNI Geometric Fill Pop
      tl.to(q('.omni-stroke'), {
        fill: '#FFFFFF',
        stroke: 'transparent',
        duration: 0.8,
        ease: 'power3.out',
      }, 4.0);

      // 4. Box moves down, closes back, and OMNI disappears
      tl.to(q('.omni-stroke'), {
        strokeDashoffset: 3000,
        fill: 'transparent',
        duration: 1.0,
        ease: 'power3.inOut'
      }, 5.5);

      tl.to(q('.box-left'), {
        x: 0,
        duration: 1.5,
        ease: 'power4.inOut'
      }, 5.5);

      tl.to(q('.box-right'), {
        x: 0,
        duration: 1.5,
        ease: 'power4.inOut'
      }, 5.5);

      tl.to(q('.motive-box-wrapper'), {
        y: 120,    
        scale: 0.6,
        duration: 1.5,
        ease: 'power4.inOut'
      }, 5.5);

      // 5. Draw B and X on the sides
      tl.to(q('.bx-letter'), {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out'
      }, 6.5);

      // 6. Fill / Bold all to reveal "B [box] X"
      tl.to(q('.motive-box, .bx-letter'), {
        strokeWidth: 10,
        duration: 0.8,
        ease: 'power2.out'
      }, 7.5);

      // 7. Load Data & Spline Wait starts here
      const loadingStart = 8.5;

      // Intentionally call \`onInitSpline()\` asynchronously
      tl.call(() => {
        setTimeout(() => {
          onInitSpline();
        }, 0);
      }, undefined, loadingStart);

      // Shift Background slowly
      tl.to(q('.bg-gradient-shift'), {
        backgroundPosition: '100% 100%',
        duration: 3.5,
        ease: 'sine.inOut'
      }, loadingStart);

      // Fade in counter 
      tl.to(q('.counter-wrapper'), {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, loadingStart);
      
      tl.to(q('.progress-val'), {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, loadingStart);

      // Counter progress
      tl.to(progress, {
        value: 100,
        duration: 3.0,
        ease: 'expo.inOut',
        onUpdate: () => {
          const el = q('.progress-num')[0];
          if (el) el.textContent = Math.round(progress.value).toString().padStart(3, '0');
        }
      }, loadingStart);

      // 8. THE SPLINE WAIT & HANDOFF
      const handoffStart = loadingStart + 3.0;

      // Evaluate the Spline Load Status
      tl.call(() => {
        if (overlayRef.current?.getAttribute('data-spline-phase') !== 'ready') {
          tl.pause();
        }
      }, undefined, handoffStart);

      // Reverse the B [box] X off screen
      tl.to(q('.motive-box, .bx-letter'), {
        strokeWidth: 4,
        duration: 0.5,
        ease: 'power2.inOut',
      }, handoffStart + 0.1);

      tl.to(q('.motive-box, .bx-letter'), {
        strokeDashoffset: 3000,
        duration: 1.5,
        ease: 'power4.inOut',
      }, handoffStart + 0.3);

      tl.to(q('.motif-line'), {
        strokeDashoffset: 3000,
        duration: 1.5,
        ease: 'power4.inOut',
      }, handoffStart + 0.3);

      const hideElementsStart = handoffStart + 1.6;

      // The Handoff - Notifying Hero
      tl.call(() => {
        onStartHero();
      }, undefined, hideElementsStart);

      // Hide elements`;

txt = txt.replace(oldSVG, newSVG);
txt = txt.replace(oldGsap, newGsap);
fs.writeFileSync(file, txt);
console.log('patched successfully');
