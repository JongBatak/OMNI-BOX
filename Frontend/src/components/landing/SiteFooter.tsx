"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  cursorRef?: React.RefObject<{
    expand: () => void;
    collapse: () => void;
  }>;
}

// The OMNI BOX mechanical logo SVG (same geometry as LoadingOverlay)
const OmniBoxLogo = () => (
  <svg viewBox="-120 -120 240 240" className="w-full h-full overflow-visible">
    <defs>
      <linearGradient id="footerPlateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1A2035" />
        <stop offset="100%" stopColor="#04060A" />
      </linearGradient>
      <filter id="footerCoreGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <g id="footer-plate">
        <path
          d="M -37.56 -70.63 A 80 80 0 0 1 37.56 -70.63 L 21.12 -39.73 L 8 -39.73 L 0 -22 L -8 -39.73 L -21.12 -39.73 Z"
          fill="url(#footerPlateGrad)"
          stroke="#3A0088"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M 8 -39.73 L 0 -22 L -8 -39.73"
          fill="none"
          stroke="#00F0FF"
          strokeWidth="1.5"
          filter="url(#footerCoreGlow)"
        />
        <path d="M -20 -60 Q 0 -65 20 -60" fill="none" stroke="#7000FF" strokeWidth="1" opacity="0.4" />
      </g>
    </defs>
    <circle cx="0" cy="0" r="100" fill="#030408" />
    <circle r="88" fill="none" stroke="#00F0FF" strokeWidth="1" strokeDasharray="70 22.15" transform="rotate(15)" opacity="0.6" />
    <circle r="93" fill="none" stroke="#7000FF" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.8" />
    <use href="#footer-plate" transform="rotate(0)" />
    <use href="#footer-plate" transform="rotate(60)" />
    <use href="#footer-plate" transform="rotate(120)" />
    <use href="#footer-plate" transform="rotate(180)" />
    <use href="#footer-plate" transform="rotate(240)" />
    <use href="#footer-plate" transform="rotate(300)" />
    <circle r="28" fill="none" stroke="#4A00E0" strokeWidth="1" strokeDasharray="3 4" opacity="0.8" />
    <polygon points="0,-10 8.66,-5 8.66,5 0,10 -8.66,5 -8.66,-5" fill="#00D2FF" filter="url(#footerCoreGlow)" />
  </svg>
);

// Mountain SVG silhouettes
const Mountains = () => (
  <svg
    viewBox="0 0 1440 400"
    preserveAspectRatio="none"
    className="absolute bottom-0 left-0 w-full h-[60%] pointer-events-none"
  >
    {/* Back range - darker, taller */}
    <path
      className="footer-mountain-back will-change-transform"
      d="M0 400 L0 280 L120 180 L200 220 L300 120 L400 200 L480 160 L560 100 L650 180 L720 80 L800 160 L880 120 L960 60 L1040 140 L1120 100 L1200 160 L1280 80 L1360 140 L1440 120 L1440 400 Z"
      fill="#0a0e18"
    />
    {/* Mid range */}
    <path
      className="footer-mountain-mid will-change-transform"
      d="M0 400 L0 320 L100 260 L180 290 L280 220 L380 280 L460 240 L540 200 L620 260 L700 180 L780 240 L860 210 L940 160 L1020 230 L1100 190 L1180 240 L1260 170 L1340 220 L1440 200 L1440 400 Z"
      fill="#0d1220"
    />
    {/* Front range - lightest, lowest */}
    <path
      className="footer-mountain-front will-change-transform"
      d="M0 400 L0 340 L140 300 L240 330 L340 280 L440 320 L520 290 L600 260 L700 310 L780 260 L860 290 L940 250 L1040 300 L1120 270 L1200 310 L1300 260 L1380 290 L1440 280 L1440 400 Z"
      fill="#111827"
    />
  </svg>
);

export default function Footer({ cursorRef }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!footerRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      });

      // Mountains rise from below
      const backMountain = footerRef.current.querySelector(".footer-mountain-back");
      const midMountain = footerRef.current.querySelector(".footer-mountain-mid");
      const frontMountain = footerRef.current.querySelector(".footer-mountain-front");

      if (backMountain) {
        tl.fromTo(backMountain, { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 0);
      }
      if (midMountain) {
        tl.fromTo(midMountain, { y: 150, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 0.1);
      }
      if (frontMountain) {
        tl.fromTo(frontMountain, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 0.2);
      }

      // Logo rises from behind the mountains like a sun
      if (logoRef.current) {
        tl.fromTo(
          logoRef.current,
          { y: 200, scale: 0.5, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" },
          0.1
        );
      }

      // OMNI | BOX title fades in
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
          0.5
        );
      }

      // Meta row fades in last
      if (metaRef.current) {
        tl.fromTo(
          metaRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: "power2.out" },
          0.7
        );
      }
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Ambient glow behind the logo */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "50vw",
          height: "50vw",
          maxWidth: "600px",
          maxHeight: "600px",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(0,240,255,0.06) 0%, rgba(112,0,255,0.03) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Logo rising like a sun */}
      <div
        ref={logoRef}
        className="relative z-10 w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 mb-8 will-change-transform"
        style={{
          animation: "spin 30s linear infinite",
        }}
      >
        <OmniBoxLogo />
      </div>

      {/* OMNI | BOX title */}
      <div ref={titleRef} className="relative z-10 text-center mb-16 will-change-transform">
        <h2
          className="text-white text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter"
          style={{ fontFamily: "var(--font-inter, 'Arial Black', sans-serif)" }}
        >
          OMNI <span className="text-white/20">|</span> BOX
        </h2>
        <p className="text-white/30 text-xs md:text-sm tracking-[0.4em] mt-4 font-mono uppercase">
          True Autonomy Through Design
        </p>
      </div>

      {/* Mountains SVG */}
      <Mountains />

      {/* Bottom meta row — sits on top of mountains */}
      <div
        ref={metaRef}
        className="absolute bottom-0 left-0 right-0 z-20 px-8 pb-6 will-change-transform"
      >
        <div className="border-t border-white/10 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p
              className="text-[11px] text-white/20 tracking-[0.3em] font-mono uppercase"
              style={{ fontFamily: "'Courier New', monospace" }}
            >
              © 2025 OMNIBOX SYSTEMS — ALL RIGHTS RESERVED
            </p>
            <nav className="flex gap-8">
              {["Terms", "Privacy", "Contact"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[11px] tracking-[0.25em] text-white/30 hover:text-[#00F0FF] transition-colors duration-300 font-mono uppercase"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}