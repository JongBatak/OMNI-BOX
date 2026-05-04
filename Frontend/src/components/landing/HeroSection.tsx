'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplineScene1 from '../spline/SplineScene1';
import { SplineLoadPhase } from './OmniBoxLanding';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type HeroSectionProps = {
  isLoaded: boolean;
  splinePhase: SplineLoadPhase;
  onSplineLoad?: () => void;
};

export default function HeroSection({ isLoaded, splinePhase, onSplineLoad }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!isLoaded) return;
    const q = gsap.utils.selector(sectionRef);

    // Sidebar elegant reveal
    gsap.to(q('.hero-side-nav'), {
      xPercent: 100,
      opacity: 1,
      duration: 1.5,
      ease: 'expo.out',
      // Delay to allow the loading curtain to completely rise first
      delay: 1.6
    });

    // Staggered massive text reveal
    // Sliding up seamlessly AFTER the Blue Curtain rises!
    gsap.fromTo(q('.hero-word'), 
      { yPercent: 110, rotateZ: 3 },
      { yPercent: 0, rotateZ: 0, duration: 1.5, stagger: 0.05, ease: 'power4.out', delay: 1.6 }
    );

    // Largo.studio-style Architectutal SVG Line drawing
    gsap.fromTo(q('.hero-svg-line'),
      { strokeDasharray: 100, strokeDashoffset: 100 },
      { strokeDashoffset: 0, duration: 2.5, ease: 'expo.inOut', stagger: 0.1, delay: 1.8 }
    );

    // Parallax effect for Spline background
    gsap.to(q('.hero-spline-bg'), {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

  }, { dependencies: [isLoaded], scope: sectionRef });

  return (
    <section ref={sectionRef} className="panel relative h-screen w-full bg-[#FFFFFF] overflow-hidden text-[#0000FF] z-10 transition-colors duration-500">
      
      {/* 3D Pre-loaded Spline. Only allowed to render & parse AFTER SVG draws (splinePhase !== 'idle') */}
      <div className="hero-spline-wrapper absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out opacity-100">
        <div className="hero-spline-bg absolute inset-x-0 -top-[10%] -bottom-[10%] scale-105 will-change-transform">
          {splinePhase !== 'idle' && (
            <SplineScene1 onLoad={onSplineLoad} />
          )}
          {/* Subtle noise over Spline */}
          <div className="pointer-events-none absolute inset-0 bg-[#0000FF] opacity-[0.03] mix-blend-overlay" />
        </div>
      </div>

      {/* Largo Studio SVG Motifs */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden mix-blend-difference opacity-40">
        <svg className="w-full h-full" preserveAspectRatio="none">
          {/* Top Horizontal framing line */}
          <line x1="0" y1="12%" x2="100%" y2="12%" stroke="#FFFFFF" strokeWidth="1" pathLength="100" className="hero-svg-line" fill="none" />
          {/* Bottom Horizontal framing line */}
          <line x1="0" y1="88%" x2="100%" y2="88%" stroke="#FFFFFF" strokeWidth="1" pathLength="100" className="hero-svg-line" fill="none" />
          {/* Right Vertical framing line */}
          <line x1="92%" y1="0" x2="92%" y2="100%" stroke="#FFFFFF" strokeWidth="1" pathLength="100" className="hero-svg-line" fill="none" />
        </svg>
        
        {/* Corner Accents */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* Top Right Cross */}
          <path d="M 91% 11% L 93% 11% M 92% 10% L 92% 14%" stroke="#FFFFFF" strokeWidth="1.5" pathLength="100" className="hero-svg-line" fill="none" />
          {/* Bottom Right Cross */}
          <path d="M 91% 87% L 93% 87% M 92% 86% L 92% 90%" stroke="#FFFFFF" strokeWidth="1.5" pathLength="100" className="hero-svg-line" fill="none" />
        </svg>
      </div>

      <nav className="hero-side-nav absolute left-0 top-0 h-full w-[80px] md:w-[128px] border-r border-[#0000FF]/20 z-40 bg-white/40 backdrop-blur-md flex flex-col items-center py-10 -translate-x-full opacity-0 will-change-transform -ml-[80px] md:-ml-[128px]">
        <div className="font-['Inter',sans-serif] font-black text-xl md:text-2xl tracking-tighter text-[#0000FF]">
          OMNI
        </div>
        
        <div className="mt-16 space-y-2">
          {/* Sidebar decorative lines */}
          <div className="w-8 h-px bg-[#0000FF]/50" />
          <div className="w-4 h-px bg-[#0000FF]/50" />
        </div>

        {/* Rotated text */}
        <div className="font-bold tracking-widest text-[#0000FF] [writing-mode:vertical-lr] rotate-180 mb-6 text-[10px] opacity-60 mt-auto uppercase">
          SCROLL TO EXPLORE
        </div>
      </nav>

      <div className="hero-text-container relative z-10 flex h-full flex-col justify-center pl-28 md:pl-48 pr-8 pointer-events-none">
        <h1 className="flex flex-col font-['Inter',sans-serif] text-[10vw] md:text-[8.5vw] font-black leading-[0.85] tracking-tighter text-[#0000FF]">
          <span className="block overflow-hidden"><span className="hero-word block will-change-transform transform-gpu origin-bottom-left pointer-events-auto">A SPACE FOR</span></span>
          <span className="block overflow-hidden"><span className="hero-word block will-change-transform transform-gpu origin-bottom-left text-[#0000FF]/80 pointer-events-auto">YOUR DIGITAL</span></span>
          <span className="block overflow-hidden"><span className="hero-word block will-change-transform transform-gpu origin-bottom-left text-[#0000FF]/40 pointer-events-auto">FOOTPRINT.</span></span>
        </h1>
      </div>
      
    </section>
  );
}
