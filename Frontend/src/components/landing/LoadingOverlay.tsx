'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { SplineLoadPhase } from './OmniBoxLanding';

// Register Plugin
gsap.registerPlugin(MorphSVGPlugin);

type LoadingOverlayProps = {
  splinePhase: SplineLoadPhase;
  onInitSpline: () => void;
  onStartHero: () => void;
};

export default function LoadingOverlay({
  splinePhase,
  onInitSpline,
  onStartHero,
}: LoadingOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(overlayRef);
      const progress = { value: 0 };

      // Set dashes ONLY for the paths we want to animate drawing
      const setDash = (selector: string) => {
        const els = q(selector);
        els.forEach((el: any) => {
          if (el.getTotalLength) {
            const len = el.getTotalLength();
            gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
          }
        });
      };

      // 1. Initial Reset - Target specific classes for lining
      setDash('.morph-skel, .omni-letter, .bx-letter, .mech-outline-path');
      gsap.set(q('.motif-line'), { strokeDasharray: 3000, strokeDashoffset: 3000 });
      gsap.set(q('.bg-gradient-shift'), { backgroundPosition: '0% 0%' });
      gsap.set(q('.progress-val, .counter-wrapper'), { opacity: 0 });

      // Hide OMNI, BX, and the fully rendered mechanical core initially
      gsap.set(q('.omni-letter, .bx-letter, .full-mech'), { opacity: 0 });
      gsap.set(q('.bold-target'), { strokeWidth: 2, fill: 'transparent' });

      // The outline group starts visible for the drawing animation
      gsap.set(q('.mech-outline-group'), { opacity: 1 });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlayRef.current, { pointerEvents: 'none', display: 'none' });
        },
      });

      tlRef.current = tl;

      // 0. Wait
      tl.to({}, { duration: 0.8 });

      // 1. Draw the Mechanical Outline AND the Circle skeleton simultaneously
      tl.to(q('.morph-skel, .mech-outline-path'), {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power3.inOut',
      });

      // 2. Fade out the complex mechanical outline just before morphing the shell
      tl.to(q('.mech-outline-group'), { opacity: 0, duration: 0.3 }, "+=0.2");

      // 3. MorphSVG into Premium Square
      tl.to('#skel-left', { morphSVG: "#target-sq-left", duration: 0.8, ease: 'power2.inOut' }, "<");
      tl.to('#skel-right', { morphSVG: "#target-sq-right", duration: 0.8, ease: 'power2.inOut' }, "<");

      // 4. Open Left/Right (Horizontal split) — opens at OMNI row
      tl.to('#box-left-container', { x: 600 - 410, duration: 1.2, ease: 'power4.inOut' }, "+=0.2");
      tl.to('#box-right-container', { x: 600 + 410, duration: 1.2, ease: 'power4.inOut' }, "<");

      // 5. Draw OMNI from Center (Staggered M&N, then O&I)
      tl.to(q('.omni-letter'), { opacity: 1, duration: 0.1 }, "<0.2");
      tl.to(q('.omni-letter'), {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: { from: "center", amount: 0.5 },
        ease: 'power3.out',
      }, "<");

      // 6. Move Down While Open — drop to BOX row (y=490 absolute)
      tl.to(['#box-left-container', '#box-right-container'], {
        y: 490,
        duration: 1.2,
        ease: 'power3.inOut',
      }, "+=0.4");

      // 7. Close Back to Center
      tl.to(['#box-left-container', '#box-right-container'], {
        x: 600,
        duration: 1.2,
        ease: 'power4.inOut',
      }, "+=0.1");

      // 8. Morph Back to Circle AND ignite the full mechanical SVG
      tl.to('#skel-left', { morphSVG: "#target-o-left", duration: 0.8, ease: 'power2.inOut' }, "+=0.2");
      tl.to('#skel-right', { morphSVG: "#target-o-right", duration: 0.8, ease: 'power2.inOut' }, "<");

      // Reveal the fully rendered mechanical SVG (with glow and gradient)
      tl.to(q('.full-mech'), { opacity: 1, duration: 0.8 }, "<0.2");

      // 9. B and X Skin Lines
      tl.to(q('.bx-letter'), { opacity: 1, duration: 0.1 }, "-=0.4");
      tl.to(q('.bx-letter'), {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
      }, "<");

      // 10. Bold Fill (White out the words)
      tl.to(q('.bold-target'), {
        fill: '#FFFFFF',
        strokeWidth: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, "+=0.2");

      // 11. Draw Floral Motifs
      tl.to(q('.motif-line'), {
        strokeDashoffset: 0,
        duration: 2.0,
        stagger: 0.05,
        ease: 'power4.inOut',
      }, "-=0.5");

      // --- Spline Handoff Sequence ---
      const loadingStart = tl.duration();

      tl.call(() => {
        setTimeout(() => {
          onInitSpline();
        }, 0);
      }, undefined, loadingStart);

      tl.to(q('.bg-gradient-shift'), { backgroundPosition: '100% 100%', duration: 3.5, ease: 'sine.inOut' }, loadingStart);
      tl.to(q('.counter-wrapper, .progress-val'), { opacity: 1, duration: 0.5, ease: 'power2.out' }, loadingStart);
      tl.to(progress, {
        value: 100,
        duration: 3.0,
        ease: 'expo.inOut',
        onUpdate: () => {
          const el = q('.progress-num')[0];
          if (el) el.textContent = Math.round(progress.value).toString().padStart(3, '0');
        }
      }, loadingStart);

      const handoffStart = loadingStart + 3.0;

      tl.call(() => {
        if (overlayRef.current?.getAttribute('data-spline-phase') !== 'ready') {
          tl.pause();
        }
      }, undefined, handoffStart);

      // Clean Outro
      tl.to(q('.bold-target'), { fill: 'transparent', strokeWidth: 2, duration: 0.5, ease: 'power2.inOut' }, handoffStart + 0.1);
      tl.to(q('.full-mech'), { opacity: 0, duration: 0.4 }, "<"); // Fade out mech core
      tl.to(q('.omni-letter, .bx-letter, .morph-skel, .motif-line'), {
        strokeDashoffset: (index, target) => target.getTotalLength ? target.getTotalLength() : 3000,
        duration: 1.2,
        ease: 'power4.inOut',
        stagger: { each: 0.05, from: 'end' }
      }, handoffStart + 0.3);

      const hideElementsStart = handoffStart + 1.5;

      tl.call(() => { onStartHero(); }, undefined, hideElementsStart);
      tl.to(q('.counter-wrapper'), { opacity: 0, y: 20, duration: 0.8, ease: 'power3.inOut' }, hideElementsStart);
      tl.to(overlayRef.current, { yPercent: -100, duration: 1.5, ease: 'power4.inOut' }, hideElementsStart + 0.2);

    },
    { scope: overlayRef }
  );

  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.setAttribute('data-spline-phase', splinePhase);
    }
    if (splinePhase === 'ready' && tlRef.current && tlRef.current.paused()) {
      tlRef.current.play();
    }
  }, [splinePhase]);

  return (
    <div ref={overlayRef} data-spline-phase="idle" className="fixed inset-0 z-50 pointer-events-auto overflow-hidden will-change-transform bg-[#0000FF]">
      <div className="bg-gradient-shift absolute w-full h-full inset-0 bg-linear-to-br from-[#0000FF] via-[#0000FF] to-[#FFFFFF] origin-top" style={{ backgroundSize: '150% 150%', willChange: 'transform, background-position' }} />

      <div className="svg-wrapper absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[75vw] pointer-events-none will-change-transform z-20">
        <svg viewBox="0 0 1200 800" className="w-full h-auto overflow-visible drop-shadow-2xl">

          <defs>
            <linearGradient id="plateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1A2035" />
              <stop offset="100%" stopColor="#04060A" />
            </linearGradient>

            <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* The Full Mechanical Plate (used at the end) */}
            <g id="mechanical-plate">
              <path d="M -37.56 -70.63 A 80 80 0 0 1 37.56 -70.63 L 21.12 -39.73 L 8 -39.73 L 0 -22 L -8 -39.73 L -21.12 -39.73 Z" fill="url(#plateGrad)" stroke="#3A0088" strokeWidth="1" strokeLinejoin="round" />
              <path d="M 8 -39.73 L 0 -22 L -8 -39.73" fill="none" stroke="#00F0FF" strokeWidth="1.5" filter="url(#coreGlow)" />
              <path d="M -20 -60 Q 0 -65 20 -60" fill="none" stroke="#7000FF" strokeWidth="1" opacity="0.4" />
            </g>

            {/* The Skeleton Outline Plate (used for drawing animation) */}
            <g id="mechanical-plate-outline">
              <path className="mech-outline-path" d="M -37.56 -70.63 A 80 80 0 0 1 37.56 -70.63 L 21.12 -39.73 L 8 -39.73 L 0 -22 L -8 -39.73 L -21.12 -39.73 Z" fill="none" stroke="#00F0FF" strokeWidth="1" strokeLinejoin="round" />
            </g>

            <clipPath id="left-half-clip">
              <rect x="-150" y="-150" width="150" height="300" />
            </clipPath>
            <clipPath id="right-half-clip">
              <rect x="0" y="-150" width="150" height="300" />
            </clipPath>

            <path id="target-sq-left" d="M 0 -100 L -80 -100 L -100 -80 L -100 80 L -80 100 L 0 100 L 0 85 L -75 85 L -85 75 L -85 -75 L -75 -85 L 0 -85 Z" />
            <path id="target-sq-right" d="M 0 -100 L 80 -100 L 100 -80 L 100 80 L 80 100 L 0 100 L 0 85 L 75 85 L 85 75 L 85 -75 L 75 -85 L 0 -85 Z" />
            <path id="target-o-left" d="M 0 -100 A 100 100 0 0 0 0 100 L -10 100 A 110 110 0 0 1 -10 -100 Z" />
            <path id="target-o-right" d="M 0 -100 A 100 100 0 0 1 0 100 L 10 100 A 110 110 0 0 0 10 -100 Z" />
          </defs>

          {/* Motifs */}
          <g transform="translate(600, 50)">
            <path className="motif-line" d="M 0 -30 C 15 -10, 30 -5, 40 10 C 30 25, 15 30, 0 50 C -15 30, -30 25, -40 10 C -30 -5, -15 -10, 0 -30 Z" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            <path className="motif-line" d="M 0 0 C 5 5, 10 15, 0 30 C -5 15, -10 5, 0 0 Z" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <path className="motif-line" d="M 45 10 C 150 10, 200 -40, 300 -40 C 400 -40, 450 30, 550 30 C 600 30, 630 10, 610 -10 C 590 -30, 560 -10, 570 15 C 580 40, 620 30, 650 0" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
            <path className="motif-line" d="M -45 10 C -150 10, -200 -40, -300 -40 C -400 -40, -450 30, -550 30 C -600 30, -630 10, -610 -10 C -590 -30, -560 -10, -570 15 C -580 40, -620 30, -650 0" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          </g>
          <g transform="translate(600, 740) scale(1, -1)">
            <path className="motif-line" d="M 0 -30 C 15 -10, 30 -5, 40 10 C 30 25, 15 30, 0 50 C -15 30, -30 25, -40 10 C -30 -5, -15 -10, 0 -30 Z" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            <path className="motif-line" d="M 0 0 C 5 5, 10 15, 0 30 C -5 15, -10 5, 0 0 Z" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <path className="motif-line" d="M 45 10 C 150 10, 200 -40, 300 -40 C 400 -40, 450 30, 550 30 C 600 30, 630 10, 610 -10 C 590 -30, 560 -10, 570 15 C 580 40, 620 30, 650 0" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
            <path className="motif-line" d="M -45 10 C -150 10, -200 -40, -300 -40 C -400 -40, -450 30, -550 30 C -600 30, -630 10, -610 -10 C -590 -30, -560 -10, -570 15 C -580 40, -620 30, -650 0" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          </g>

          {/* OMNI Outline Skins */}
          <g transform="translate(0, -60)">
            <path className="omni-letter bold-target" d="M 255 240 L 295 240 A 60 60 0 0 1 355 300 L 355 360 A 60 60 0 0 1 295 420 L 255 420 A 60 60 0 0 1 195 360 L 195 300 A 60 60 0 0 1 255 240 Z M 235 300 L 235 360 A 20 20 0 0 0 255 380 L 295 380 A 20 20 0 0 0 315 360 L 315 300 A 20 20 0 0 0 295 280 L 255 280 A 20 20 0 0 0 235 300 Z" fillRule="evenodd" stroke="white" strokeWidth="2" />
            <path className="omni-letter bold-target" d="M 445 420 L 445 240 L 495 240 L 545 330 L 595 240 L 645 240 L 645 420 L 605 420 L 605 302 L 545 410 L 485 302 L 485 420 Z" stroke="white" strokeWidth="2" />
            <path className="omni-letter bold-target" d="M 735 420 L 735 240 L 785 240 L 835 340 L 835 240 L 875 240 L 875 420 L 825 420 L 775 320 L 775 420 Z" stroke="white" strokeWidth="2" />
            <path className="omni-letter bold-target" d="M 965 420 L 965 240 L 1005 240 L 1005 420 Z" stroke="white" strokeWidth="2" />
          </g>

          {/* BOX Bracket System */}
          <g id="box-left-container" transform="translate(600, 270)">
            <g className="full-mech" clipPath="url(#left-half-clip)">
              <circle cx="0" cy="0" r="100" fill="#030408" />
              <circle r="88" fill="none" stroke="#00F0FF" strokeWidth="1" strokeDasharray="70 22.15" transform="rotate(15)" opacity="0.6" />
              <circle r="93" fill="none" stroke="#7000FF" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.8" />
              <use href="#mechanical-plate" transform="rotate(0)" />
              <use href="#mechanical-plate" transform="rotate(60)" />
              <use href="#mechanical-plate" transform="rotate(120)" />
              <use href="#mechanical-plate" transform="rotate(180)" />
              <use href="#mechanical-plate" transform="rotate(240)" />
              <use href="#mechanical-plate" transform="rotate(300)" />
              <circle r="28" fill="none" stroke="#4A00E0" strokeWidth="1" strokeDasharray="3 4" opacity="0.8" />
              <polygon points="0,-10 8.66,-5 8.66,5 0,10 -8.66,5 -8.66,-5" fill="#00D2FF" filter="url(#coreGlow)" />
            </g>

            {/* The lining animation for the mech core before it morphs */}
            <g className="mech-outline-group" clipPath="url(#left-half-clip)">
              <use href="#mechanical-plate-outline" transform="rotate(0)" />
              <use href="#mechanical-plate-outline" transform="rotate(60)" />
              <use href="#mechanical-plate-outline" transform="rotate(120)" />
              <use href="#mechanical-plate-outline" transform="rotate(180)" />
              <use href="#mechanical-plate-outline" transform="rotate(240)" />
              <use href="#mechanical-plate-outline" transform="rotate(300)" />
            </g>

            <path id="skel-left" className="morph-skel bold-target" d="M 0 -100 A 100 100 0 0 0 0 100 L -10 100 A 110 110 0 0 1 -10 -100 Z" fillRule="evenodd" stroke="white" strokeWidth="2" />
          </g>

          <g id="box-right-container" transform="translate(600, 270)">
            <g className="full-mech" clipPath="url(#right-half-clip)">
              <circle cx="0" cy="0" r="100" fill="#030408" />
              <circle r="88" fill="none" stroke="#00F0FF" strokeWidth="1" strokeDasharray="70 22.15" transform="rotate(15)" opacity="0.6" />
              <circle r="93" fill="none" stroke="#7000FF" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.8" />
              <use href="#mechanical-plate" transform="rotate(0)" />
              <use href="#mechanical-plate" transform="rotate(60)" />
              <use href="#mechanical-plate" transform="rotate(120)" />
              <use href="#mechanical-plate" transform="rotate(180)" />
              <use href="#mechanical-plate" transform="rotate(240)" />
              <use href="#mechanical-plate" transform="rotate(300)" />
              <circle r="28" fill="none" stroke="#4A00E0" strokeWidth="1" strokeDasharray="3 4" opacity="0.8" />
              <polygon points="0,-10 8.66,-5 8.66,5 0,10 -8.66,5 -8.66,-5" fill="#00D2FF" filter="url(#coreGlow)" />
            </g>

            <g className="mech-outline-group" clipPath="url(#right-half-clip)">
              <use href="#mechanical-plate-outline" transform="rotate(0)" />
              <use href="#mechanical-plate-outline" transform="rotate(60)" />
              <use href="#mechanical-plate-outline" transform="rotate(120)" />
              <use href="#mechanical-plate-outline" transform="rotate(180)" />
              <use href="#mechanical-plate-outline" transform="rotate(240)" />
              <use href="#mechanical-plate-outline" transform="rotate(300)" />
            </g>

            <path id="skel-right" className="morph-skel bold-target" d="M 0 -100 A 100 100 0 0 1 0 100 L 10 100 A 110 110 0 0 0 10 -100 Z" fillRule="evenodd" stroke="white" strokeWidth="2" />
          </g>

          {/* B and X — flanking the box (shifted up 80 from original, center y=490) */}
          <path className="bx-letter bold-target" d="M 330 390 L 330 590 L 408 590 C 466 590 492 565 492 538 C 492 514 474 497 446 490 C 472 482 484 464 484 440 C 484 414 460 390 408 390 Z M 372 422 L 404 422 C 436 422 446 435 446 448 C 446 463 436 472 404 472 L 372 472 Z M 372 510 L 407 510 C 444 510 454 522 454 536 C 454 550 444 557 407 557 L 372 557 Z" fillRule="evenodd" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <path className="bx-letter bold-target" d="M 710 390 L 770 390 L 870 590 L 810 590 Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <path className="bx-letter bold-target" d="M 870 390 L 810 390 L 710 590 L 770 590 Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />

        </svg>
      </div>

      <div className="counter-wrapper absolute bottom-12 right-12 z-10 flex gap-4 items-end will-change-transform">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFFFFF]/60 mb-1 mix-blend-difference">
          Initiating Platform
        </span>
        <div className="progress-val font-mono text-[#FFFFFF] text-2xl sm:text-3xl mix-blend-difference">
          <span className="progress-num font-light">000</span>
          <span className="opacity-50 text-xl">%</span>
        </div>
      </div>
    </div>
  );
}