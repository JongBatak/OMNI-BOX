'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplineScene1 from '../spline/SplineScene1';
import { SplineLoadPhase } from './OmniBoxLanding';

type HeroSectionProps = {
  isLoaded: boolean;
  splinePhase: SplineLoadPhase;
  onSplineLoad?: () => void;
};

export default function HeroSection({ isLoaded, splinePhase, onSplineLoad }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!isLoaded) return;

    const q = gsap.utils.selector(sectionRef);
    const tl = gsap.timeline();

    // 1. Sidebar Reveal
    tl.to(q('.hero-side-nav'), { xPercent: 100, opacity: 1, duration: 1.5, ease: 'power4.out' }, "+=0.4");

    // 2. The Spline Object Entrance
    tl.fromTo(q('.hero-spline-bg'),
      { scale: 0.85, autoAlpha: 0, rotationY: -10 },
      { scale: 1, autoAlpha: 1, rotationY: 0, duration: 2.5, ease: 'expo.out' },
      "-=1.0"
    );

    // 3. Editorial Typography Reveal (Smooth Circle Mask Reveal ala the "WORK" video)
    // We use clipPath to create an expanding circle effect.
    tl.fromTo(q('.hero-word'),
      {
        // Start with a circle mask completely closed in the center
        clipPath: "circle(0% at 50% 50%)",
        autoAlpha: 0 // Optional: keep it hidden initially just in case
      },
      {
        // Expand the circle to cover the entire text
        clipPath: "circle(150% at 50% 50%)",
        autoAlpha: 1,
        duration: 2.0, // A bit longer for that luxurious, smooth feel
        stagger: 0.2, // Staggering the lines makes it feel more dynamic
        ease: 'power3.inOut' // Smooth acceleration and deceleration
      },
      "-=2.0"
    );

    // 4. Architectural SVG Lines
    tl.fromTo(q('.hero-svg-line'),
      { strokeDasharray: 100, strokeDashoffset: 100 },
      { strokeDashoffset: 0, duration: 2.5, ease: 'power3.inOut', stagger: 0.1 },
      "-=1.5"
    );

    // 5. Scroll Indicator
    tl.fromTo(q('.scroll-indicator'),
      { autoAlpha: 0, y: -15 },
      { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power2.out' },
      "-=0.5"
    );

    // Animasi Grid
    gsap.to(q('.cyber-grid'), {
      backgroundPosition: '100px 100px',
      duration: 20,
      repeat: -1,
      ease: 'none'
    });

    // Ambient Mouse Glow 
    if (glowRef.current) {
      const xTo = gsap.quickTo(glowRef.current, "x", { duration: 0.8, ease: "power3.out" });
      const yTo = gsap.quickTo(glowRef.current, "y", { duration: 0.8, ease: "power3.out" });

      const handleMouseMove = (e: MouseEvent) => {
        xTo(e.clientX - 300);
        yTo(e.clientY - 300);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }

  }, { dependencies: [isLoaded], scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative h-screen w-full bg-[#050505] overflow-hidden z-10">

      {/* BACKGROUNDS */}
      <div
        className="cyber-grid absolute inset-0 w-full h-full z-[0] opacity-[0.10] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      <div
        ref={glowRef}
        className="ambient-glow absolute top-0 left-0 w-[600px] h-[600px] bg-[#0000FF] rounded-full blur-[180px] opacity-[0.08] pointer-events-none z-[1] will-change-transform"
      />

      <div
        className="absolute inset-0 pointer-events-none z-[2] mix-blend-overlay opacity-[0.06]"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />

      <div className="absolute inset-0 w-full h-full z-[3]">

        {/* 3D SPLINE OBJECT */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[80%] z-10 pointer-events-none">
          <div className="hero-spline-bg invisible absolute inset-0 w-full h-full will-change-transform">
            {splinePhase !== 'idle' && (
              <div className="w-full h-full pointer-events-auto">
                <SplineScene1 onLoad={onSplineLoad} />
              </div>
            )}
          </div>
        </div>

        {/* TYPOGRAPHY (EDITORIAL / LUXURY) */}
        <div className="absolute inset-y-0 left-0 w-full md:w-[65%] z-20 flex flex-col justify-center pl-[60px] md:pl-[100px] lg:pl-[140px] pointer-events-none">
          <h1
            className="flex flex-col gap-1 text-[10.5vw] md:text-[8.5vw] uppercase leading-[0.95] relative"
            style={{
              fontFamily: "'PP Editorial New', 'Playfair Display', 'Cormorant Garamond', 'Times New Roman', serif",
              fontWeight: 400,
              letterSpacing: "-0.01em"
            }}
          >
            <span className="block pb-4"> {/* Removed overflow-hidden to allow clip-path to breathe */}
              {/* Added pb-4 padding to the word itself to prevent clipping of descenders with the new mask */}
              <span className="hero-word block will-change-transform text-[#FAFAFA] pb-2">
                A SPACE FOR
              </span>
            </span>

            <span className="block pb-4 relative"> {/* Removed overflow-hidden */}
              <span
                className="hero-word block will-change-transform text-[#0000FF] italic pr-4 pb-2"
                style={{
                  textShadow: '0 0 10px rgba(0,0,255,0.4), 0 0 25px rgba(0,0,255,0.2)'
                }}
              >
                YOUR DIGITAL
              </span>
            </span>

            <span className="block pb-4"> {/* Removed overflow-hidden */}
              <span className="hero-word block will-change-transform text-[#FAFAFA]/40 pb-2">
                FOOTPRINT
              </span>
            </span>
          </h1>
        </div>

      </div>

      {/* ARCHITECTURAL OVERLAYS */}
      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden opacity-30">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <line x1="0" y1="12%" x2="100%" y2="12%" stroke="rgba(255,255,255,0.15)" strokeWidth="1" pathLength="100" className="hero-svg-line" fill="none" />
          <line x1="0" y1="88%" x2="100%" y2="88%" stroke="rgba(255,255,255,0.15)" strokeWidth="1" pathLength="100" className="hero-svg-line" fill="none" />
          <line x1="92%" y1="0" x2="92%" y2="100%" stroke="rgba(255,255,255,0.15)" strokeWidth="1" pathLength="100" className="hero-svg-line" fill="none" />
        </svg>

        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path d="M 91% 11% L 93% 11% M 92% 10% L 92% 14%" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" pathLength="100" className="hero-svg-line" fill="none" />
          <path d="M 91% 87% L 93% 87% M 92% 86% L 92% 90%" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" pathLength="100" className="hero-svg-line" fill="none" />
        </svg>
      </div>

      {/* SIDEBAR & SCROLL */}
      <nav className="hero-side-nav absolute left-0 top-0 h-full w-[80px] md:w-[120px] border-r border-white/5 z-40 bg-[#050505]/60 backdrop-blur-md flex flex-col items-center py-10 -translate-x-full opacity-0 will-change-transform -ml-[80px] md:-ml-[120px]">
        <div className="font-sans font-black text-xl md:text-2xl tracking-tighter text-[#0000FF]">
          OMNI
        </div>
        <div className="mt-16 space-y-2">
          <div className="w-8 h-px bg-[#0000FF]/50" />
          <div className="w-4 h-px bg-[#0000FF]/50" />
        </div>
      </nav>

      <div className="scroll-indicator invisible absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </div>

    </section>
  );
}