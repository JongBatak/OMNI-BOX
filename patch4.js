const fs = require('fs');

const content = `
'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TextMaskTransition() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Refs layer
  const maskLayerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);

  // Panel Refs
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentsRef = useRef<(HTMLDivElement | null)[]>([]);

  const router = useRouter();

  // ASET VISUAL
  const IMAGES = {
    hero: "./couple.jpg", 
    card1: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop", 
    card2: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop", 
    card3: "./teamwork.jpg", 
  };

  const panelsData = [
    { id: '01', title: 'Share your loving memories', image: IMAGES.card1, desc: 'Any format, anywhere' },
    { id: '02', title: 'Capture the subtle moments', image: IMAGES.card2, desc: 'With precision' },
    { id: '03', title: 'Show your teamwork and love', image: IMAGES.card3, desc: 'Build together' }
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: \\\`+=\\\${(panelsData.length * 100 + 100)}%\\\`,
        scrub: 1, 
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      }
    });

    // =========================================
    // FASE 1: THE OMNIBOX MASK ZOOM & HERO
    // =========================================
    tl.to(maskLayerRef.current, {
      scale: 180, 
      autoAlpha: 0, 
      transformOrigin: "50% 50%", 
      ease: 'power3.inOut',
      duration: 2
    }, 0);

    tl.to(heroTextRef.current, { autoAlpha: 1, duration: 1, ease: 'power2.out' }, 2.1);
    tl.to(heroTextRef.current, { autoAlpha: 0, scale: 1.1, duration: 1 }, 4);

    // =========================================
    // FASE 2: CLIP-PATH REVEAL (FLOEMA STYLE)
    // =========================================
    panelsRef.current.forEach((panel, i) => {
      if (!panel) return;
      const content = contentsRef.current[i];
      
      if (i === 0) {
        tl.fromTo(panel, 
          { clipPath: 'inset(70% 35% 10% 35% round 20px)', autoAlpha: 0 },
          { clipPath: 'inset(0% 0% 0% 0% round 0px)', autoAlpha: 1, duration: 2, ease: 'power3.inOut' }
        );
      } else {
        tl.fromTo(panel, 
           { clipPath: 'inset(70% 35% 10% 35% round 20px)' },
           { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 2, ease: 'power3.inOut' }
        );
      }
      
      if (content) {
        tl.fromTo(content, 
          { y: 50, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' },
          "-=0.5"
        );
      }
      
      // Tahan efek tiap transisi selesai
      tl.to({}, { duration: 1.5 });
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-white overflow-hidden">
      
      {/* ========================================================= */}
      {/* Z-INDEX 0: FULLSCREEN HERO BACKGROUND                     */}
      {/* ========================================================= */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center origin-center z-0"
        style={{ backgroundImage: \\\`url("\\\${IMAGES.hero}")\\\` }}
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none bg-black/40">
        <h1 
          ref={heroTextRef}
          className="invisible text-[7vw] md:text-[4.5vw] text-white uppercase font-black text-center leading-[1.1] tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] max-w-[85vw]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Save your priceless <br/>memories in any format
        </h1>
      </div>

      {/* ========================================================= */}
      {/* Z-INDEX 20+: FLOEMA CLIP-PATH PANELS                      */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {panelsData.map((data, index) => (
          <div 
            key={data.id}
            ref={(el) => { panelsRef.current[index] = el; }}
            className="absolute inset-0 w-full h-full"
            style={{ 
              zIndex: 20 + index * 10,
              opacity: index === 0 ? 0 : 1, // Panel 1 diatur JS mulai dari opacity 0
              clipPath: index > 0 ? 'inset(70% 35% 10% 35% round 20px)' : 'inset(70% 35% 10% 35% round 20px)' 
            }}
          >
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: \\\`url("\\\${data.image}")\\\` }}
            />
            <div className="absolute inset-0 bg-black/30" />
            
            <div 
              ref={(el) => { contentsRef.current[index] = el; }}
              className="absolute inset-0 flex flex-col items-center justify-center text-white text-center invisible p-8"
            >
              <p className="text-xl md:text-2xl tracking-[0.3em] uppercase mb-4 opacity-80 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {data.id} &mdash; {data.desc}
              </p>
              <h2 className="text-[5vw] md:text-[4vw] font-black uppercase tracking-tight drop-shadow-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {data.title}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* Z-INDEX 70: THE OMNIBOX MASK (PALING DEPAN DI AWAL)       */}
      {/* ========================================================= */}
      <div ref={maskLayerRef} className="absolute inset-0 z-[70] flex items-center justify-center pointer-events-none origin-center">
        <svg viewBox="0 0 1000 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="omniFormatMask">
              <rect width="100%" height="100%" fill="white" />
              <text x="50%" y="180" textAnchor="middle" fill="black" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '38px', letterSpacing: '0.25em' }}>YOUR OMNI-FORMAT</text>
              <g stroke="black" strokeWidth="14" strokeLinejoin="round" strokeLinecap="round" fill="none">
                <polygon points="500,260 620,330 620,470 500,540 380,470 380,330" />
                <line x1="500" y1="260" x2="500" y2="400" />
                <line x1="620" y1="470" x2="500" y2="400" />
                <line x1="380" y1="470" x2="500" y2="400" />
                <line x1="620" y1="330" x2="500" y2="400" />
                <line x1="380" y1="330" x2="500" y2="400" />
                <line x1="500" y1="540" x2="500" y2="400" />
              </g>
              <circle cx="500" cy="400" r="25" fill="black" />
              <text x="50%" y="620" textAnchor="middle" fill="black" style={{ fontFamily: "'PP Editorial New', serif", fontSize: '110px', letterSpacing: '-0.02em' }}>GALLERY</text>
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="#FFFFFF" mask="url(#omniFormatMask)" />
        </svg>
      </div>

    </section>
  );
}
\`

fs.writeFileSync('/home/Zarchy/projekakhir/Frontend/src/components/landing/VelocityMarquee.tsx', content);

