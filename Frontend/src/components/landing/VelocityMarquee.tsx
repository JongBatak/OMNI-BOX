'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
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
  fontClass: string;
  textClass: string;
}

const SECTIONS: SectionData[] = [
  {
    number: '01',
    label: 'Intro',
    tagline: 'Your Storage',
    headline: 'Save your priceless memories in any format',
    bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=75&w=1200&auto=format&fit=crop',
    labelColor: '#FFFFFF',
    fontClass: 'var(--font-inter)',
    textClass: 'uppercase font-black tracking-tight',
  },
  {
    number: '02',
    label: 'Loving Memories',
    tagline: 'Nostalgia',
    headline: 'Share your loving memories',
    bgImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=75&w=1200&auto=format&fit=crop',
    labelColor: '#E25822',
    fontClass: 'var(--font-playfair)',
    textClass: 'italic font-bold tracking-wide drop-shadow-[0_4px_12px_rgba(226,88,34,0.3)]',
  },
  {
    number: '03',
    label: 'Sharing Love',
    tagline: 'Connection',
    headline: 'Capture the subtle moments',
    bgImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=75&w=1200&auto=format&fit=crop',
    labelColor: '#0047AB',
    fontClass: 'var(--font-syne)',
    textClass: 'uppercase font-extrabold tracking-tight',
  },
  {
    number: '04',
    label: 'Teamwork',
    tagline: 'Collaboration',
    headline: 'Show your teamwork and love',
    bgImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=75&w=1200&auto=format&fit=crop',
    labelColor: '#006400',
    fontClass: 'var(--font-inter)',
    textClass: 'font-semibold tracking-wide',
  },
  {
    number: '05',
    label: 'OmniBox',
    tagline: 'The Core',
    headline: 'THAT\'S WHY WE BUILT—',
    bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=75&w=1200&auto=format&fit=crop',
    labelColor: '#0000FF',
    fontClass: 'var(--font-bebas)',
    textClass: 'uppercase tracking-[0.2em] font-normal',
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
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressLineRef = useRef<HTMLDivElement>(null);

  const maskLayerRef = useRef<HTMLDivElement>(null);

  // Keep track of which section is currently active
  const activeSectionIndex = useRef<number>(-1);

  useGSAP(() => {
    const bgEls = bgRefs.current.filter(Boolean) as HTMLDivElement[];
    const contentEls = contentRefs.current.filter(Boolean) as HTMLDivElement[];
    const panelEls = panelRefs.current.filter(Boolean) as HTMLDivElement[];
    const badgeEls = badgeRefs.current.filter(Boolean) as HTMLDivElement[];
    const ribbonEl = ribbonRef.current;
    const containerEl = containerRef.current;

    if (!ribbonEl || !containerEl) return;

    // 1. Setup the main scrubbed timeline for the scrolling ribbon and mask
    const master = gsap.timeline({
      scrollTrigger: {
        trigger: containerEl,
        start: 'top top',
        end: () => `+=${(ribbonEl.scrollHeight - window.innerHeight) * 3.5}px`,
        scrub: 0.8,
        pin: true,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
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

    if (progressLineRef.current) {
      master.to(progressLineRef.current, {
        width: '100%',
        ease: 'none',
        duration: 2.5,
      }, 1.0);
    }

    // 2. Setup independent text and badge animations

    // Initial state
    contentEls.forEach((el) => {
      if (el) gsap.set(el.children, { opacity: 0, y: 40, filter: 'blur(8px)' });
    });
    badgeEls.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, y: 20 });
    });

    // Function to handle switching texts independent of scrub
    const showTextAndBadge = (index: number) => {
      if (activeSectionIndex.current === index) return; // Already active

      // Animate OUT current
      if (activeSectionIndex.current !== -1) {
        const oldIdx = activeSectionIndex.current;
        const oldContent = contentEls[oldIdx];
        const oldBadge = badgeEls[oldIdx];

        if (oldContent && oldBadge) {
          gsap.to(oldBadge, { opacity: 0, y: -20, ease: 'power2.in', duration: 0.3 });
          gsap.to(oldContent.querySelectorAll('.animate-target'), {
            opacity: 0, y: -40, filter: 'blur(8px)', ease: 'power2.in', duration: 0.3
          });
        }
      }

      // Animate IN new
      if (index !== -1) {
        const newContent = contentEls[index];
        const newBadge = badgeEls[index];

        if (newContent && newBadge) {
          gsap.to(newBadge, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.5, delay: 0.1 });
          gsap.to(newContent.querySelectorAll('.animate-target'), {
            opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.5, delay: 0.1
          });
        }
      }

      activeSectionIndex.current = index;
    };
    // We use the master timeline's progress to determine which section should be active
    // This allows the text to trigger as a specific point in the animation is reached, 
    // but the text animation itself plays independently at normal speed.
    ScrollTrigger.create({
      trigger: containerEl,
      start: 'top top',
      end: () => `+=${(ribbonEl.scrollHeight - window.innerHeight) * 3.5}px`,
      onUpdate: (self) => {
        const progress = self.progress;

        // Define thresholds based on the master timeline's duration (total 3.5s)
        // Mask animation is 0 to 1.0. Ribbon scroll is 1.0 to 3.5.

        if (progress <= 0.10) {
          showTextAndBadge(-1);
        } else if (progress > 0.10 && progress < 0.30) {
          showTextAndBadge(0);
        } else if (progress >= 0.30 && progress < 0.50) {
          showTextAndBadge(1);
        } else if (progress >= 0.50 && progress < 0.70) {
          showTextAndBadge(2);
        } else if (progress >= 0.70 && progress < 0.90) {
          showTextAndBadge(3);
        } else if (progress >= 0.90) {
          showTextAndBadge(4);
        }
      }
    });

  }, { scope: containerRef });

  return (
    <>
      <Navbar />

      <div ref={containerRef} className="relative h-screen w-full bg-[#0a0a0c] overflow-hidden">

        {/* Fixed Badge Container */}
        <div className="absolute top-[42%] left-20 md:left-32 z-[150] pointer-events-none">
          {SECTIONS.map((section, idx) => (
            <div key={idx} ref={(el) => { badgeRefs.current[idx] = el; }} className="absolute -top-10 opacity-0">
              <div className="px-5 py-2 rounded-full border border-white/20 backdrop-blur-md bg-black/40 text-white text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 shadow-2xl">
                <svg className="w-3 h-3" style={{ color: section.labelColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
                {section.label}
              </div>
            </div>
          ))}
        </div>

        <div ref={ribbonRef} className="absolute top-0 left-0 w-full flex flex-col will-change-transform">
          {SECTIONS.map((section, index) => {
            const isEdge = index === 0 || index === SECTIONS.length - 1;
            const panelHeightClass = isEdge ? 'h-screen' : 'h-[80vh]';
            const bgHeightClass = isEdge ? 'h-[130vh] -top-[15vh]' : 'h-[130vh] -top-[20vh]';

            return (
              <div key={section.number} ref={(el) => { panelRefs.current[index] = el; }} className={`relative w-full ${panelHeightClass} overflow-hidden select-none`}>
                <div ref={(el) => { bgRefs.current[index] = el; }} className={`absolute w-full left-0 will-change-transform overflow-hidden ${bgHeightClass}`}>
                  <Image
                    src={section.bgImage}
                    alt={section.headline}
                    fill
                    sizes="100vw"
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    quality={75}
                    className="object-cover"
                  />
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

              {/* The God-Tier Dynamic Headline */}
              <h2
                className={`animate-target text-white text-center max-w-5xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] will-change-[transform,opacity,filter] ${section.fontClass} ${section.textClass}`}
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

        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 z-[100] mix-blend-difference pointer-events-none px-4 md:px-0">
          <div ref={progressLineRef} className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: '0%' }} />
        </div>

        {/* Z-INDEX 70: THE OMNIBOX MASK (PALING DEPAN DI AWAL) */}
        <div ref={maskLayerRef} className="absolute inset-0 z-[70] flex items-center justify-center pointer-events-none origin-center">
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