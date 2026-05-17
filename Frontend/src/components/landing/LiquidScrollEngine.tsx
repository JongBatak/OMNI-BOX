"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

import HeroSection from './HeroSection';
import IndependentSocial from './IndependentSocial';
import SocialDataSection from './SocialDataSection';
import VelocityMarquee from './VelocityMarquee';
import CtaSection from './CtaSection';
import EpicFooter from './EpicFooter';
import LaserTransition from './LaserTransition';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);
}

const PATHS = {
  down: {
    start: "M 0 1 C 0.33 1, 0.66 1, 1 1 L 1 1 L 0 1 Z",
    mid: "M 0 0.5 C 0.33 0.2, 0.66 0.8, 1 0.5 L 1 1 L 0 1 Z",
    end: "M 0 0 C 0.33 0, 0.66 0, 1 0 L 1 1 L 0 1 Z",
  }
};

export default function LiquidScrollEngine({ isLoaded = true }: { isLoaded?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    // 1. Initialize ScrollSmoother (Provides buttery smooth scroll for the whole page)
    let smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.5,
      effects: true,
    });

    // Pin the master container. As the user scrolls, execute transitions sequentially.
    const tlMaster = gsap.timeline({
      scrollTrigger: {
        trigger: "#liquid-transition-container",
        start: "top top",
        end: "+=300%", // 3 viewport heights for two full transitions
        scrub: true,
        pin: true,
        anticipatePin: 1
      }
    });

    // 1. Liquid Scroll: Hero -> IndependentSocial
    tlMaster.to(pathRef.current, {
      attr: { d: PATHS.down.mid },
      ease: "power2.in",
      duration: 1
    }).to(pathRef.current, {
      attr: { d: PATHS.down.end },
      ease: "power2.out",
      duration: 1
    });

    // 2. Before/After Slider: IndependentSocial -> SocialDataSection
    tlMaster.fromTo(".after-slider-container",
      { xPercent: 100, x: 0 },
      { xPercent: 0, duration: 2, ease: "none" },
      "+=0.5" // Pause slightly before starting the next transition
    ).fromTo(".after-slider-content",
      { xPercent: -100, x: 0 },
      { xPercent: 0, duration: 2, ease: "none" },
      "<" // Start synchronously
    );

    return () => {
      smoother.kill();
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[#050505] text-white selection:bg-[#0000FF]/30">

      {/* Global Elements (Fixed to viewport, outside of the scroll transform) */}
      <div
        className="fixed inset-0 pointer-events-none z-[9999] mix-blend-overlay opacity-30"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />

      <svg width="0" height="0" className="fixed pointer-events-none">
        <defs>
          <clipPath id="liquid-clip-1" clipPathUnits="objectBoundingBox">
            <path ref={pathRef} d={PATHS.down.start} />
          </clipPath>
        </defs>
      </svg>

      {/* Smooth Scroll Wrapper */}
      <div id="smooth-wrapper">
        <div id="smooth-content">

          {/* ============================== */}
          {/* 1. LIQUID TRANSITION BLOCK     */}
          {/* ============================== */}
          <div id="liquid-transition-container" className="relative w-full h-screen overflow-hidden">
            {/* SLIDE 1: THE HERO */}
            <section className="absolute inset-0 w-full h-full z-10">
              <HeroSection isLoaded={isLoaded} splinePhase="ready" />
            </section>

            {/* SLIDE 2: INDEPENDENT SOCIAL (Reveals over Hero via Clip Path) */}
            <section
              className="absolute inset-0 w-full h-full z-20 bg-white"
              style={{ clipPath: 'url(#liquid-clip-1)' }}
            >
              <IndependentSocial />
            </section>
            {/* SLIDE 3: SOCIAL DATA SECTION (Reveals over Slide 2 via Slider) */}
            <section
              className="after-slider-container absolute inset-0 w-full h-full z-30 overflow-hidden pointer-events-none"
              style={{ transform: 'translateX(100%)' }}
            >
              <LaserTransition />
              {/* The content counter-translates to stay visually static during the slide */}
              <div className="after-slider-content absolute inset-0 w-full h-full pointer-events-auto" style={{ transform: 'translateX(-100%)' }}>
                <SocialDataSection />
              </div>
            </section>
          </div>

          {/* ============================== */}
          {/* 2. NORMAL SCROLL FLOW SECTIONS */}
          {/* ============================== */}

          <section className="relative w-full overflow-hidden">
            <VelocityMarquee />
          </section>

          <section className="relative w-full overflow-hidden bg-[#0a0a0c]">
            <div className="min-h-full flex flex-col">
              <CtaSection />
              <EpicFooter />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
