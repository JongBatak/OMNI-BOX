"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";
import HeroSection from './HeroSection';
import IndependentSocial from './IndependentSocial';
import SocialDataSection from './SocialDataSection';
import VelocityMarquee from './VelocityMarquee';
import CtaSection from './CtaSection';
import SiteFooter from './SiteFooter';

if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer, useGSAP);
}

const PATHS = {
  down: {
    start: "M 0 1 C 0.33 1, 0.66 1, 1 1 L 1 1 L 0 1 Z",
    mid: "M 0 0.5 C 0.33 0.2, 0.66 0.8, 1 0.5 L 1 1 L 0 1 Z",
    end: "M 0 0 C 0.33 0, 0.66 0, 1 0 L 1 1 L 0 1 Z",
  },
  up: {
    start: "M 0 0 C 0.33 0, 0.66 0, 1 0 L 1 0 L 0 0 Z",
    mid: "M 0 0.5 C 0.33 0.8, 0.66 0.2, 1 0.5 L 1 0 L 0 0 Z",
    end: "M 0 1 C 0.33 1, 0.66 1, 1 1 L 1 0 L 0 0 Z",
  }
};

export default function LiquidScrollEngine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const isAnimating = useRef(false);
  const currentIndex = useRef(0);
  const TOTAL_SLIDES = 5;

  useGSAP(() => {
    gsap.set(sectionsRef.current, { zIndex: 1, clipPath: (i) => `url(#liquid-clip-${i})` });
    gsap.set(sectionsRef.current[0], { zIndex: 5 });

    pathRefs.current.forEach((path, i) => {
      gsap.set(path, { attr: { d: i === 0 ? PATHS.down.end : PATHS.down.start } });
    });

    const gotoSection = (index: number, direction: number) => {
      if (index < 0 || index >= TOTAL_SLIDES || isAnimating.current) return;
      isAnimating.current = true;

      const currentSection = sectionsRef.current[currentIndex.current];
      const targetSection = sectionsRef.current[index];
      const targetPath = pathRefs.current[index];

      gsap.set(sectionsRef.current, { zIndex: 1 });
      gsap.set(currentSection, { zIndex: 2 });
      gsap.set(targetSection, { zIndex: 5 });

      const paths = direction === 1 ? PATHS.down : PATHS.up;

      gsap.set(targetPath, { attr: { d: paths.start } });

      const chars = targetSection?.querySelectorAll(".split-char");
      const staggerEls = targetSection?.querySelectorAll(".entrance-stagger");

      gsap.set(chars, { y: direction === 1 ? 100 : -100, opacity: 0 });
      gsap.set(staggerEls, { y: direction === 1 ? 50 : -50, opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          currentIndex.current = index;
          isAnimating.current = false;
        }
      });

      tl.to(targetPath, {
        attr: { d: paths.mid },
        duration: 0.7,
        ease: "sine.in",
      })
        .to(targetPath, {
          attr: { d: paths.end },
          duration: 0.7,
          ease: "sine.out",
        })
        .to(chars, {
          y: 0,
          opacity: 1,
          stagger: 0.02,
          duration: 0.8,
          ease: "power4.out",
        }, "-=0.7")
        .to(staggerEls, {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out"
        }, "-=0.8");
    };

    const observer = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      wheelSpeed: 1,
      onDown: () => !isAnimating.current && gotoSection(currentIndex.current + 1, 1),
      onUp: () => !isAnimating.current && gotoSection(currentIndex.current - 1, -1),
      tolerance: 20,
      preventDefault: true,
    });

    return () => {
      observer.kill();
    };
  }, { scope: containerRef });

  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span
        key={i}
        className="split-char inline-block will-change-transform"
        style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
      >
        {char}
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full bg-[#050505] overflow-hidden select-none text-white">

      {/* Global Noise Overlay for Editorial Film Aesthetic */}
      <div
        className="fixed inset-0 pointer-events-none z-[9999] mix-blend-overlay opacity-30"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />

      {/* Dynamic SVG ClipPath Definitions */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          {[0, 1, 2, 3, 4].map((i) => (
            <clipPath key={i} id={`liquid-clip-${i}`} clipPathUnits="objectBoundingBox">
              <path ref={(el) => { pathRefs.current[i] = el; }} d={PATHS.down.start} />
            </clipPath>
          ))}
        </defs>
      </svg>

      {/* ============================== */}
      {/* SLIDE 1: THE HERO              */}
      {/* ============================== */}
      <section
        ref={(el) => { sectionsRef.current[0] = el; }}
        className="absolute inset-0 w-full h-full will-change-[clip-path,transform]"
      >
        <HeroSection />
      </section>

      {/* ============================== */}
      {/* SLIDE 2: INDEPENDENT SOCIAL    */}
      {/* ============================== */}
      <section
        ref={(el) => { sectionsRef.current[1] = el; }}
        className="absolute inset-0 w-full h-full will-change-[clip-path,transform] overflow-hidden bg-white"
      >
        <IndependentSocial />
      </section>

      {/* ============================== */}
      {/* SLIDE 3: SOCIAL DATA SECTION   */}
      {/* ============================== */}
      <section
        ref={(el) => { sectionsRef.current[2] = el; }}
        className="absolute inset-0 w-full h-full will-change-[clip-path,transform] overflow-hidden"
      >
        <SocialDataSection />
      </section>

      {/* ============================== */}
      {/* SLIDE 4: VELOCITY MARQUEE      */}
      {/* ============================== */}
      <section
        ref={(el) => { sectionsRef.current[3] = el; }}
        className="absolute inset-0 w-full h-full will-change-[clip-path,transform] overflow-hidden"
      >
        <VelocityMarquee />
      </section>

      {/* ============================== */}
      {/* SLIDE 5: CTA & FOOTER          */}
      {/* ============================== */}
      <section
        ref={(el) => { sectionsRef.current[4] = el; }}
        className="absolute inset-0 w-full h-full will-change-[clip-path,transform] overflow-y-auto bg-[#0a0a0c]"
      >
        <div className="min-h-full flex flex-col">
          <CtaSection />
          <SiteFooter />
        </div>
      </section>

    </div>
  );
}
