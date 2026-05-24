"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "./SiteFooter";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// The mechanical plate def from LoadingOverlay.tsx
const complexPlatePaths = (
  <>
    <path d="M -37.56 -70.63 A 80 80 0 0 1 37.56 -70.63 L 21.12 -39.73 L 8 -39.73 L 0 -22 L -8 -39.73 L -21.12 -39.73 Z" fill="url(#bridgeGrad)" stroke="#3A0088" strokeWidth="1" strokeLinejoin="round" />
    <path d="M 8 -39.73 L 0 -22 L -8 -39.73" fill="none" stroke="#00F0FF" strokeWidth="1.5" filter="url(#bridgeGlow)" />
    <path d="M -20 -60 Q 0 -65 20 -60" fill="none" stroke="#7000FF" strokeWidth="1" opacity="0.4" />
  </>
);

// ─────────────────────────────────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────────────────────────────────
const CustomCursor = React.memo(function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      currentRef.current.x += (posRef.current.x - currentRef.current.x) * 0.15;
      currentRef.current.y += (posRef.current.y - currentRef.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-[#00f0ff] w-2 h-2 will-change-transform" />
      <div ref={ringRef} className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border border-[#00f0ff]/50 w-8 h-8 flex items-center justify-center will-change-transform" />
    </>
  );
});

// ─────────────────────────────────────────────────────────────
// SCENE 1: THE BRIDGE & ETYMOLOGY
// ─────────────────────────────────────────────────────────────
const SceneBridge = React.memo(function SceneBridge() {
  const blackoutRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const omniRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Cinematic Blackout Fade
    gsap.to(blackoutRef.current, {
      autoAlpha: 0,
      duration: 2.0,
      ease: "power2.inOut",
      delay: 0.2
    });

    // 2. Anchor Spin & Reveal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%",
        scrub: 1,
        pin: true,
      }
    });

    tl.fromTo(coreRef.current,
      { scale: 1.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "power2.out" }
    );

    tl.fromTo([omniRef.current, boxRef.current],
      { opacity: 0, x: (i) => i === 0 ? 50 : -50, filter: "blur(10px)" },
      { opacity: 1, x: 0, filter: "blur(0px)", duration: 1, ease: "power2.out", stagger: 0.2 },
      "<0.3"
    );

    tl.fromTo(quoteRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1 },
      ">"
    );

    // Fade out everything to go to next scene
    tl.to([coreRef.current, omniRef.current, boxRef.current, quoteRef.current], {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "power2.in"
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden">
      {/* The pure black bridge overlay */}
      <div ref={blackoutRef} className="absolute inset-0 bg-black z-50" />

      {/* Top Tag */}
      <div className="absolute top-12 text-[#00f0ff]/40 text-xs tracking-[0.4em] font-sans font-bold">
        INITIATING PROTOCOL / 001
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="flex items-center justify-center">
          <div ref={omniRef} className="text-white text-5xl md:text-8xl font-black tracking-tighter will-change-transform" style={{ fontFamily: "var(--font-inter)" }}>
            OMNI
          </div>

          <div ref={coreRef} className="relative w-16 h-16 md:w-32 md:h-32 mx-4 md:mx-8 flex items-center justify-center will-change-transform">
            <motion.div className="w-full h-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
              <svg viewBox="-100 -100 200 200" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="bridgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1A2035" />
                    <stop offset="100%" stopColor="#04060A" />
                  </linearGradient>
                  <filter id="bridgeGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <g id="bridge-plate">
                    {complexPlatePaths}
                  </g>
                </defs>
                <circle cx="0" cy="0" r="100" fill="#030408" />
                <circle r="88" fill="none" stroke="#00F0FF" strokeWidth="1" strokeDasharray="70 22.15" transform="rotate(15)" opacity="0.6" />
                <circle r="93" fill="none" stroke="#7000FF" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.8" />
                <use href="#bridge-plate" transform="rotate(0)" />
                <use href="#bridge-plate" transform="rotate(60)" />
                <use href="#bridge-plate" transform="rotate(120)" />
                <use href="#bridge-plate" transform="rotate(180)" />
                <use href="#bridge-plate" transform="rotate(240)" />
                <use href="#bridge-plate" transform="rotate(300)" />
                <circle r="28" fill="none" stroke="#4A00E0" strokeWidth="1" strokeDasharray="3 4" opacity="0.8" />
                <polygon points="0,-10 8.66,-5 8.66,5 0,10 -8.66,5 -8.66,-5" fill="#00D2FF" filter="url(#bridgeGlow)" />
              </svg>
            </motion.div>
          </div>

          <div ref={boxRef} className="text-[#e2e8f0] text-5xl md:text-8xl font-black tracking-tighter will-change-transform" style={{ fontFamily: "var(--font-inter)" }}>
            BOX
          </div>
        </div>
      </div>

      <div ref={quoteRef} className="absolute bottom-32 max-w-2xl text-center px-6 will-change-transform">
        <p className="text-white/60 text-lg md:text-2xl font-serif italic tracking-wide leading-relaxed" style={{ fontFamily: "var(--font-playfair)" }}>
          "Infinite possibilities require a flawless foundation. A paradox of total freedom within unbreakable structure."
        </p>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center opacity-40 animate-pulse">
        <span className="text-[9px] tracking-widest text-white mb-2 font-sans">SCROLL TO ASCEND</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
});

// ─────────────────────────────────────────────────────────────
// SCENE 2: THE PHILOSOPHY (STAR WARS LORE)
// ─────────────────────────────────────────────────────────────
const SceneLore = React.memo(function SceneLore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const repRef = useRef<HTMLDivElement>(null);
  const empRef = useRef<HTMLDivElement>(null);
  const omniRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=400%",
        scrub: 1,
        pin: true,
      }
    });

    // Republic IN
    tl.fromTo(repRef.current, { opacity: 0, y: 100, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1 });
    tl.to({}, { duration: 0.5 }); // pause
    // Republic OUT, Empire IN
    tl.to(repRef.current, { opacity: 0, y: -100, scale: 0.9, duration: 1 });
    tl.fromTo(empRef.current, { opacity: 0, y: 100, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, "<");
    tl.to({}, { duration: 0.5 }); // pause
    // Empire OUT, Omni IN
    tl.to(empRef.current, { opacity: 0, y: -100, scale: 0.9, duration: 1 });
    tl.fromTo(omniRef.current, { opacity: 0, y: 100, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, "<");
    tl.to({}, { duration: 1.0 }); // hold at end

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="h-screen w-full bg-[#030408] relative flex items-center justify-center overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0%,transparent_60%)] pointer-events-none" />

      {/* 1. THE REPUBLIC */}
      <div ref={repRef} className="absolute inset-0 flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto px-8 gap-12 opacity-0 will-change-transform">
        <div className="flex-1 flex justify-center">
          <motion.div
            className="w-64 h-64 md:w-96 md:h-96 opacity-60"
            animate={{ y: [0, -20, 0], opacity: [0.6, 0.8, 0.6] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <div
              className="w-full h-full"
              style={{
                maskImage: `url('/New republic.svg')`,
                WebkitMaskImage: `url('/New republic.svg')`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                backgroundColor: '#00F0FF'
              }}
            />
          </motion.div>
        </div>
        <div className="flex-1 space-y-6">
          <h2 className="text-[#00F0FF] text-sm tracking-[0.4em] font-sans font-bold">I. THE REPUBLIC</h2>
          <h3 className="text-white text-4xl md:text-5xl font-black leading-tight" style={{ fontFamily: "var(--font-inter)" }}><span className="text-[#00F0FF]">Flowing</span> Beautiful <br /><span className="text-[#9B59B6]">Fragile</span></h3>
          <p className="text-white/60 text-xl leading-relaxed font-serif font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
            Idealism without structure. A system that bends to every whim eventually shatters under its own weight. Decentralization without a unifying foundation breeds chaos.
          </p>
        </div>
      </div>

      {/* 2. THE EMPIRE */}
      <div ref={empRef} className="absolute inset-0 flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto px-8 gap-12 opacity-0 will-change-transform">
        <div className="flex-1 flex justify-center">
          <motion.div
            className="w-64 h-64 md:w-96 md:h-96 opacity-60"
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{ rotate: { repeat: Infinity, duration: 40, ease: "linear" }, scale: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
          >
            <div
              className="w-full h-full"
              style={{
                maskImage: `url('/Emblem_of_the_First_Galactic_Empire.svg')`,
                WebkitMaskImage: `url('/Emblem_of_the_First_Galactic_Empire.svg')`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                backgroundColor: '#FF4D4D'
              }}
            />
          </motion.div>
        </div>
        <div className="flex-1 space-y-6">
          <h2 className="text-[#FF4D4D] text-sm tracking-[0.4em] font-sans font-bold">II. THE EMPIRE</h2>
          <h3 className="text-white text-4xl md:text-5xl font-black leading-tight" style={{ fontFamily: "var(--font-inter)" }}><span className="text-[#F1C40F]">Order</span> through <br /><span className="text-[#FF4D4D]">Oppression</span></h3>
          <p className="text-white/60 text-xl leading-relaxed font-serif font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
            A rigid, unyielding monolith. All nodes locked into a dictatorial core. It prevents chaos, but suffocates independence. It is a structure built on fear, incapable of evolution.
          </p>
        </div>
      </div>

      {/* 3. THE OMNI BOX (SEPARATIST) */}
      <div ref={omniRef} className="absolute inset-0 flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto px-8 gap-12 opacity-0 will-change-transform">
        <div className="flex-1 flex justify-center">
          <div className="w-64 h-64 md:w-96 md:h-96 relative flex items-center justify-center">
            <motion.div className="w-full h-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }}>
              <svg viewBox="-100 -100 200 200" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="omniGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1A2035" />
                    <stop offset="100%" stopColor="#04060A" />
                  </linearGradient>
                  <filter id="omniGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <g id="omni-plate">
                    <path d="M -37.56 -70.63 A 80 80 0 0 1 37.56 -70.63 L 21.12 -39.73 L 8 -39.73 L 0 -22 L -8 -39.73 L -21.12 -39.73 Z" fill="url(#omniGrad)" stroke="#00F0FF" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M 8 -39.73 L 0 -22 L -8 -39.73" fill="none" stroke="#00D2FF" strokeWidth="1.5" filter="url(#omniGlow)" />
                  </g>
                </defs>
                <circle cx="0" cy="0" r="100" fill="#030408" />
                <circle r="88" fill="none" stroke="#00F0FF" strokeWidth="1" strokeDasharray="70 22.15" transform="rotate(15)" opacity="0.6" />
                <circle r="93" fill="none" stroke="#7000FF" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.8" />
                <use href="#omni-plate" transform="rotate(0)" />
                <use href="#omni-plate" transform="rotate(60)" />
                <use href="#omni-plate" transform="rotate(120)" />
                <use href="#omni-plate" transform="rotate(180)" />
                <use href="#omni-plate" transform="rotate(240)" />
                <use href="#omni-plate" transform="rotate(300)" />
                <circle r="28" fill="none" stroke="#4A00E0" strokeWidth="1" strokeDasharray="3 4" opacity="0.8" />
                <polygon points="0,-10 8.66,-5 8.66,5 0,10 -8.66,5 -8.66,-5" fill="#00D2FF" filter="url(#omniGlow)" />
              </svg>
            </motion.div>
          </div>
        </div>
        <div className="flex-1 space-y-6">
          <h2 className="text-[#00f0ff] text-sm tracking-[0.4em] font-sans font-bold">III. TRUE AUTONOMY</h2>
          <h3 className="text-white text-4xl md:text-5xl font-black leading-tight" style={{ fontFamily: "var(--font-inter)" }}>The Omni <br /><span className="text-[#00f0ff]">Box</span></h3>
          <p className="text-white/80 text-xl leading-relaxed font-serif font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
            Six independent plates, perfectly balanced. They do not touch. They are not locked by a rigid frame. Yet they orbit a shared, impenetrable core.
          </p>
          <p className="text-white/50 text-base leading-relaxed font-sans mt-4">
            This is the Separatist ideal realized. It takes the mathematical structure of the Empire but shatters the tyranny. It represents decentralized synergy modular freedom bound by a collective foundation.
          </p>
        </div>
      </div>
    </section>
  );
});

// ─────────────────────────────────────────────────────────────
// SCENE 3: THE CALL TO ACTION (CTA)
// ─────────────────────────────────────────────────────────────
const SceneCTA = React.memo(function SceneCTA() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const platesRef = useRef<SVGGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ctaRef.current,
        start: "top top",
        end: "+=150%",
        scrub: 1,
        pin: true,
      }
    });

    // Animate plates pushing outwards and core igniting
    if (platesRef.current) {
      const plates = gsap.utils.toArray(platesRef.current.children) as SVGUseElement[];

      tl.to(plates, {
        x: (i) => Math.cos((i * 60 - 90) * (Math.PI / 180)) * 50,
        y: (i) => Math.sin((i * 60 - 90) * (Math.PI / 180)) * 50,
        duration: 1.5,
        ease: "power2.inOut",
      });
    }

    tl.to(glowRef.current, { r: 150, opacity: 0.8, duration: 1.5, ease: "power2.inOut" }, "<");

    tl.fromTo(textRef.current,
      { opacity: 0, scale: 0.8, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: "back.out(1.2)" },
      "<0.5"
    );

  }, { scope: ctaRef });

  return (
    <section ref={ctaRef} className="h-screen w-full bg-[#050505] relative flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <svg viewBox="-300 -300 600 600" className="w-[80vw] max-w-[800px] opacity-20">
          <defs>
            <linearGradient id="ctaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1A2035" />
              <stop offset="100%" stopColor="#04060A" />
            </linearGradient>
            <filter id="ctaGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <g id="cta-plate">
              <path d="M -37.56 -70.63 A 80 80 0 0 1 37.56 -70.63 L 21.12 -39.73 L 8 -39.73 L 0 -22 L -8 -39.73 L -21.12 -39.73 Z" fill="url(#ctaGrad)" stroke="#00F0FF" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M 8 -39.73 L 0 -22 L -8 -39.73" fill="none" stroke="#00D2FF" strokeWidth="1.5" filter="url(#ctaGlow)" />
            </g>
          </defs>
          <circle cx="0" cy="0" r="100" fill="#030408" />
          <circle r="88" fill="none" stroke="#00F0FF" strokeWidth="1" strokeDasharray="70 22.15" transform="rotate(15)" opacity="0.6" />
          <g ref={platesRef}>
            <use href="#cta-plate" transform="rotate(0)" />
            <use href="#cta-plate" transform="rotate(60)" />
            <use href="#cta-plate" transform="rotate(120)" />
            <use href="#cta-plate" transform="rotate(180)" />
            <use href="#cta-plate" transform="rotate(240)" />
            <use href="#cta-plate" transform="rotate(300)" />
          </g>
          <circle ref={glowRef} r="0" fill="none" stroke="#00D2FF" strokeWidth="2" filter="url(#ctaGlow)" opacity="0" />
        </svg>
      </div>

      <div ref={textRef} className="z-10 text-center flex flex-col items-center will-change-transform">
        <h2 className="text-[#00F0FF] text-sm tracking-[0.5em] font-sans font-bold mb-6">INITIATE CONNECTION</h2>
        <h3 className="text-white text-6xl md:text-8xl font-black tracking-tighter" style={{ fontFamily: "var(--font-inter)" }}>
          STEP INTO<br />THE CORE
        </h3>
        <button className="mt-12 px-12 py-4 border border-[#00F0FF]/40 bg-[#00F0FF]/10 text-white font-sans text-xs tracking-[0.3em] uppercase hover:bg-[#00F0FF]/20 hover:scale-105 transition-all duration-300 backdrop-blur-md">
          Join the Network
        </button>
      </div>
    </section>
  );
});

// ─────────────────────────────────────────────────────────────
// ROOT MANIFESTO COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Manifesto() {
  const [supportsHover, setSupportsHover] = useState(false);

  useEffect(() => {
    setSupportsHover(window.matchMedia('(hover: hover)').matches);
  }, []);

  return (
    <>
      <style>{`
        @media (hover: hover) {
          * { cursor: none !important; }
        }
        html { scroll-behavior: auto; }
        body { background: #050505; overflow-x: hidden; }
      `}</style>

      {supportsHover && <CustomCursor />}

      <main>
        <SceneBridge />
        <SceneLore />
        <SceneCTA />
        <Footer />
      </main>
    </>
  );
}
