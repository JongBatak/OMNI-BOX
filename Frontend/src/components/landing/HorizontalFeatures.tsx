'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  "3D VIEW",
  "WEBVIEW COMPILER",
  "PERSONAL TERMINAL"
];

// Clean, geometric, modern SVGs for the background
const SVGs = [
  // 3D VIEW: Isometric Wireframe Cube
  <svg key="svg0" viewBox="0 0 100 100" className="svg-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] max-h-[80vw] stroke-omni-silver/5 fill-transparent" strokeWidth="0.5">
    <path d="M50 15 L85 35 L85 75 L50 95 L15 75 L15 35 Z" />
    <path d="M50 15 L50 55" />
    <path d="M15 35 L50 55 L85 35" />
    <path d="M50 55 L50 95" />
    <circle cx="50" cy="55" r="2" className="fill-omni-silver/20" />
    <circle cx="50" cy="15" r="1.5" className="fill-omni-silver/10" />
    <circle cx="85" cy="35" r="1.5" className="fill-omni-silver/10" />
    <circle cx="15" cy="35" r="1.5" className="fill-omni-silver/10" />
  </svg>,
  // WEBVIEW COMPILER: Geometric Brackets & Code Structure
  <svg key="svg1" viewBox="0 0 100 100" className="svg-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] max-h-[80vw] stroke-omni-silver/5 fill-transparent opacity-0" strokeWidth="0.5">
    <path d="M30 20 L10 50 L30 80" />
    <path d="M70 20 L90 50 L70 80" />
    <path d="M60 15 L40 85" />
    <rect x="42" y="42" width="16" height="16" className="stroke-omni-cyan/10" strokeWidth="0.2" />
    <circle cx="10" cy="50" r="1.5" className="fill-omni-silver/10" />
    <circle cx="90" cy="50" r="1.5" className="fill-omni-silver/10" />
  </svg>,
  // PERSONAL TERMINAL: Command Prompt & Cursor
  <svg key="svg2" viewBox="0 0 100 100" className="svg-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] max-h-[80vw] stroke-omni-silver/5 fill-transparent opacity-0" strokeWidth="0.5">
    <rect x="10" y="20" width="80" height="60" rx="1" />
    <path d="M10 32 L90 32" strokeWidth="0.2" />
    <circle cx="15" cy="26" r="1.5" className="fill-omni-silver/10" />
    <circle cx="20" cy="26" r="1.5" className="fill-omni-silver/10" />
    <circle cx="25" cy="26" r="1.5" className="fill-omni-silver/10" />
    <path d="M20 45 L30 55 L20 65" className="stroke-omni-cyan/20" strokeWidth="1" />
    <line x1="35" y1="65" x2="50" y2="65" className="stroke-omni-cyan/30" strokeWidth="1.5" />
  </svg>
];

export default function HorizontalFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${window.innerWidth * 3}`, // Scroll for 3x screen width
        pin: true,
        pinSpacing: true, // This allows the scroll wheel to push progress
        scrub: 1, // Smooth scrubbing
      }
    });

    // Move the horizontal container
    // We have 3 items. Width is 300%. We move -66.666% to reach the last item.
    tl.to('.h-scroll-container', {
      xPercent: -66.666,
      ease: 'none'
    }, 0);

    // Crossfade Logic (Timeline is 0 to 1 implicitly)
    // SVG 0 fades out, SVG 1 fades in
    tl.to('.svg-0', { opacity: 0, duration: 0.15, ease: 'power2.inOut' }, 0.2);
    tl.to('.svg-1', { opacity: 1, duration: 0.15, ease: 'power2.inOut' }, 0.2);

    // SVG 1 fades out, SVG 2 fades in
    tl.to('.svg-1', { opacity: 0, duration: 0.15, ease: 'power2.inOut' }, 0.55);
    tl.to('.svg-2', { opacity: 1, duration: 0.15, ease: 'power2.inOut' }, 0.55);

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-omni-black text-white">
      
      {/* Background SVGs (Fixed inside pinned container) */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        {SVGs}
      </div>

      {/* Scrolling Content */}
      <div 
        className="h-scroll-container relative z-10 h-full flex items-center"
        style={{ width: `${features.length * 100}%` }} // 300% width
      >
        {features.map((feature, i) => (
          <div key={i} className="h-full w-full flex flex-col items-center justify-center px-10 text-center">
            <h2 className="font-heading font-extrabold text-[12vw] leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 uppercase select-none">
              {feature}
            </h2>
            <p className="mt-8 font-detail italic text-2xl md:text-4xl text-omni-cyan">
              Module {String(i + 1).padStart(2, '0')}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}
