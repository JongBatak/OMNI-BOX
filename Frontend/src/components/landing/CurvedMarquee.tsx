'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function CurvedMarquee() {
  const textPathRef = useRef<SVGTextPathElement>(null);

  useGSAP(() => {
    if (!textPathRef.current) return;

    // Smooth infinite scroll along the SVG path
    gsap.fromTo(textPathRef.current, 
      { attr: { startOffset: "0%" } },
      {
        attr: { startOffset: "-100%" },
        duration: 30,
        ease: 'none',
        repeat: -1,
      }
    );
  });

  const phrase = "OMNIBOX CLOUD INFRASTRUCTURE • ";
  const marqueeText = Array(20).fill(phrase).join("");

  return (
    <section className="relative w-full bg-white py-32 md:py-48 flex justify-center items-center overflow-hidden z-20">
      <svg 
        viewBox="0 0 1000 300" 
        className="w-[200vw] md:w-[150vw] lg:w-full h-auto text-[#0000FF] drop-shadow-sm"
      >
        <path 
          id="marquee-curve"
          d="M -500 300 C 0 50, 1000 50, 1500 300" 
          fill="transparent" 
          stroke="none"
        />
        <text className="font-sans font-black text-4xl md:text-5xl tracking-[0.2em] uppercase" fill="currentColor">
          <textPath 
            ref={textPathRef} 
            href="#marquee-curve" 
            startOffset="0%"
          >
            {marqueeText}
          </textPath>
        </text>
      </svg>
    </section>
  );
}
