'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────────────────────
// DATA (OMNIBOX ASSETS & TYPOGRAPHY)
// ─────────────────────────────────────────────────────────────
interface SectionData {
  number: string;
  label: string;
  tagline: string;
  headline: string;
  bgImage: string;
  labelColor: string;
  fontClass: string; // Dynamic font injection
  textClass: string; // Specific styling for the headline
}

const SECTIONS: SectionData[] = [
  {
    number: '01',
    label: 'Intro',
    tagline: 'Your Storage',
    headline: 'Save your priceless memories in any format',
    bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Gallery
    labelColor: '#FFFFFF', // Clean White
    fontClass: 'font-serif',
    textClass: 'font-light tracking-wide',
  },
  {
    number: '02',
    label: 'Loving Memories',
    tagline: 'Nostalgia',
    headline: 'Share your loving memories',
    bgImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop', // Couple
    labelColor: '#E25822', // Warm Orange
    fontClass: 'font-serif',
    textClass: 'font-light tracking-wide italic',
  },
  {
    number: '03',
    label: 'Sharing Love',
    tagline: 'Connection',
    headline: 'Capture the subtle moments',
    bgImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop', // Subtlety
    labelColor: '#0047AB', // Cool Blue
    fontClass: 'font-serif',
    textClass: 'font-light tracking-wide',
  },
  {
    number: '04',
    label: 'Teamwork',
    tagline: 'Collaboration',
    headline: 'Show your teamwork and love',
    bgImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop', // Teamwork
    labelColor: '#006400', // Deep Green
    fontClass: 'font-serif',
    textClass: 'font-light tracking-wide italic',
  },
  {
    number: '05',
    label: 'OmniBox',
    tagline: 'The Core',
    headline: 'THAT\'S WHY WE BUILT—',
    bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop', // Deep space/engineering vibe for finale
    labelColor: '#0000FF', // OmniBox Blue
    fontClass: 'font-serif',
    textClass: 'font-light tracking-[0.2em] uppercase',
  },
];

// ─────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 md:px-10 py-4 pointer-events-none mix-blend-difference text-white">
      <div className="pointer-events-auto flex items-center gap-2">
        <span className="text-xl font-black tracking-widest select-none var(--font-syne)">
          OMNI<span className="text-white/40 font-light mx-1">|</span>BOX
        </span>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN ENGINE COMPONENT
// ─────────────────────────────────────────────────────────────
export default function FloemaStylePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressLineRef = useRef<HTMLDivElement>(null);

  const maskLayerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const bgEls = bgRefs.current.filter(Boolean) as HTMLDivElement[];
    const contentEls = contentRefs.current.filter(Boolean) as HTMLDivElement[];
    const panelEls = panelRefs.current.filter(Boolean) as HTMLDivElement[];
    const ribbonEl = ribbonRef.current;
    const containerEl = containerRef.current;

    if (!ribbonEl || !containerEl) return;

    const master = gsap.timeline({
      scrollTrigger: {
        trigger: containerEl,
        start: 'top top',
        end: () => `+=${(ribbonEl.scrollHeight - window.innerHeight) * 3.5}px`, // Increased multipliers to account for the beginning zoom duration
        scrub: 0.1,
        pin: true,
        invalidateOnRefresh: true,
      },
    });



    if (maskLayerRef.current) {
      master.to(maskLayerRef.current, {
        scale: 180,
        autoAlpha: 0,
        transformOrigin: "50% 50%",
        ease: 'power3.inOut',
        duration: 1.0
      }, 0);
    }



    master.to(ribbonEl, {
      y: () => -(ribbonEl.scrollHeight - window.innerHeight),
      ease: 'none',
      duration: 2.5,
    }, 1.0);

    const p = 0.15;

    bgEls.forEach((bgEl, i) => {
      const panelEl = panelEls[i];
      if (!panelEl) return;

      master.fromTo(bgEl, {
        y: () => {
          const T_i = panelEl.offsetTop;
          return -T_i * (1 - p);
        },
      }, {
        y: () => {
          const T_i = panelEl.offsetTop;
          const maxScroll = ribbonEl.scrollHeight - window.innerHeight;
          return (maxScroll - T_i) * (1 - p);
        },
        ease: 'none',
        duration: 2.5,
      }, 1.0);
    });

    // Hide content text for sections 1+ initially; section 0 is visible from the start
    contentEls.forEach((contentEl, idx) => {
      if (idx > 0 && contentEl) {
        gsap.set(contentEl.children, {
          opacity: 0,
          y: 60,
          filter: 'blur(12px)',
        });
      }
    });

    // Section 0: visible initially, fade out as we scroll into section 1
    if (contentEls[0]) {
      master.to(contentEls[0].children, {
        opacity: 0,
        y: -60,
        filter: 'blur(12px)',
        stagger: 0.05,
        ease: 'power1.inOut',
        duration: 0.40,
      }, 1.2);
    }

    // Section 1: fade in once its image is centered, fade out before section 2
    if (contentEls[1]) {
      master.to(contentEls[1].children, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.05,
        ease: 'power1.inOut',
        duration: 0.35,
      }, 1.55);
      master.to(contentEls[1].children, {
        opacity: 0,
        y: -60,
        filter: 'blur(12px)',
        stagger: 0.05,
        ease: 'power1.inOut',
        duration: 0.35,
      }, 1.90);
    }

    // Section 2
    if (contentEls[2]) {
      master.to(contentEls[2].children, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.05,
        ease: 'power1.inOut',
        duration: 0.35,
      }, 2.10);
      master.to(contentEls[2].children, {
        opacity: 0,
        y: -60,
        filter: 'blur(12px)',
        stagger: 0.05,
        ease: 'power1.inOut',
        duration: 0.35,
      }, 2.45);
    }

    // Section 3
    if (contentEls[3]) {
      master.to(contentEls[3].children, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.05,
        ease: 'power1.inOut',
        duration: 0.35,
      }, 2.65);
      master.to(contentEls[3].children, {
        opacity: 0,
        y: -60,
        filter: 'blur(12px)',
        stagger: 0.05,
        ease: 'power1.inOut',
        duration: 0.35,
      }, 3.00);
    }

    // Section 4 (finale): fade in and stay
    if (contentEls[4]) {
      master.to(contentEls[4].children, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.05,
        ease: 'power1.inOut',
        duration: 0.40,
      }, 3.20);
    }

    if (progressLineRef.current) {
      master.to(progressLineRef.current, {
        width: '100%',
        ease: 'none',
        duration: 2.5,
      }, 1.0);
    }
  }, { scope: containerRef });

  return (
    <>
      <Navbar />

      <div ref={containerRef} className="relative h-screen w-full bg-white overflow-hidden">

        <div ref={ribbonRef} className="absolute top-0 left-0 w-full flex flex-col will-change-transform">

          {SECTIONS.map((section, index) => {
            const isEdge = index === 0 || index === SECTIONS.length - 1;
            const panelHeightClass = isEdge ? 'h-screen' : 'h-[80vh]';
            const bgHeightClass = isEdge ? 'h-[130vh] -top-[15vh]' : 'h-[130vh] -top-[20vh]';

            return (
              <div
                key={section.number}
                ref={(el) => { panelRefs.current[index] = el; }}
                className={`relative w-full ${panelHeightClass} overflow-hidden select-none`}
              >
                <div
                  ref={(el) => { bgRefs.current[index] = el; }}
                  className={`absolute w-full left-0 will-change-transform overflow-hidden ${bgHeightClass}`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${section.bgImage}")` }}
                  />
                  {/* Subtle darkening for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60 z-[1]" />
                </div>

              </div>
            );
          })}
        </div>

        {/* OVERLAY TEXT (Fixed to Viewport, animated by GSAP) */}
        <div className="absolute inset-0 pointer-events-none z-[10]">
          {SECTIONS.map((section, index) => (
            <div
              key={`content-${section.number}`}
              ref={(el) => { contentRefs.current[index] = el; }}
              className="absolute inset-0 flex flex-col items-center justify-center px-6"
            >
              {/* Side Indicators */}
              <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white/60 text-sm font-bold tracking-widest select-none pointer-events-none will-change-[transform,opacity,filter] var(--font-inter)">
                {section.number}
              </div>

              <div className="absolute left-8 top-[60%] flex flex-col items-center gap-4 text-white/60 select-none pointer-events-none will-change-[transform,opacity,filter]">
                <div className="w-[1px] h-12 bg-white/40" />
                <span className="text-[10px] tracking-[0.3em] font-bold uppercase origin-left -rotate-90 whitespace-nowrap mt-20 var(--font-inter)">
                  {section.tagline}
                </span>
              </div>

              {/* Dynamic Tag Indicator */}
              <div className="px-5 py-2 rounded-full border border-white/20 backdrop-blur-md bg-black/40 text-white text-[12px] font-bold tracking-widest uppercase mb-6 flex items-center gap-3 select-none pointer-events-none will-change-[transform,opacity,filter] var(--font-inter) shadow-lg">
                <svg className="w-3.5 h-3.5" style={{ color: section.labelColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                </svg>
                {section.label}
              </div>

              {/* The God-Tier Dynamic Headline */}
              <h2
                className={`text-white text-center max-w-5xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] will-change-[transform,opacity,filter] ${section.fontClass} ${section.textClass}`}
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                  lineHeight: '1.1'
                }}
              >
                {section.headline}
              </h2>
            </div>
          ))}
        </div>

        {/* Center Progress Line */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[2px] bg-white/10 z-100 mix-blend-difference pointer-events-none px-4 md:px-0">
          <div
            ref={progressLineRef}
            className="h-full bg-white will-change-[width] shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{ width: '0%' }}
          />
        </div>

        {/* Z-INDEX 70: THE OMNIBOX MASK (PALING DEPAN DI AWAL) */}
        <div ref={maskLayerRef} className="absolute inset-0 z-70 flex items-center justify-center pointer-events-none origin-center">
          <svg viewBox="0 0 1000 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <mask id="omniFormatMask">
                <rect width="100%" height="100%" fill="white" />
                <text x="50%" y="220" textAnchor="middle" fill="black" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '38px', letterSpacing: '0.25em' }}>YOUR OMNI-FORMAT</text>
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
                <text x="50%" y="640" textAnchor="middle" fill="black" style={{ fontFamily: "'PP Editorial New', serif", fontSize: '90px', letterSpacing: '-0.02em' }}>GALLERY</text>
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="white" mask="url(#omniFormatMask)" />
          </svg>
        </div>
      </div>
    </>
  );
}