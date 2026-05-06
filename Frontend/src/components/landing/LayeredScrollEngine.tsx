"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function LayeredScrollEngine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      // 1. & 2. Loop through the first 3 sections (Curtain Sections)
      curtainRefs.current.forEach((section) => {
        if (!section) return;

        // The exact GSAP logic requested for the core pinning engine
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          pin: true,
          pinSpacing: false,
        });

        // Internal Parallax (The Polish)
        // Background moves down slightly as the next section covers it
        const bgElement = section.querySelector(".parallax-bg");
        if (bgElement) {
          gsap.to(bgElement, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=100%", // Animates mapped to the 100vh it takes for the next section to cover it
              scrub: true,
            },
          });
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Section 1 - z-10 */}
      <section
        ref={(el) => {
          curtainRefs.current[0] = el;
        }}
        className="relative h-screen w-full z-10 overflow-hidden bg-blue-950"
      >
        {/* Placeholder background image div - oversized to prevent gaps during parallax */}
        <div className="parallax-bg absolute -top-[20%] left-0 h-[120%] w-full bg-blue-900" />
        <div className="relative z-10 flex h-full items-center justify-center text-white text-5xl font-bold tracking-tighter">
          Section 1
        </div>
      </section>

      {/* Section 2 - z-20 */}
      <section
        ref={(el) => {
          curtainRefs.current[1] = el;
        }}
        className="relative h-screen w-full z-20 overflow-hidden bg-black"
      >
        <div className="parallax-bg absolute -top-[20%] left-0 h-[120%] w-full bg-zinc-950" />
        <div className="relative z-10 flex h-full items-center justify-center text-white text-5xl font-bold tracking-tighter">
          Section 2
        </div>
      </section>

      {/* Section 3 - z-30 */}
      <section
        ref={(el) => {
          curtainRefs.current[2] = el;
        }}
        className="relative h-screen w-full z-30 overflow-hidden bg-gray-800"
      >
        <div className="parallax-bg absolute -top-[20%] left-0 h-[120%] w-full bg-gray-900" />
        <div className="relative z-10 flex h-full items-center justify-center text-white text-5xl font-bold tracking-tighter">
          Section 3
        </div>
      </section>

      {/* Section 4 - Standard flow, not pinned */}
      <section className="relative h-screen w-full bg-white z-40 overflow-hidden flex items-center justify-center text-black text-5xl font-bold tracking-tighter shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        Section 4 (Standard Flow)
      </section>
    </div>
  );
}
