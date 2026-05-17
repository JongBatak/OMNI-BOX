"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  cursorRef: React.RefObject<{
    expand: () => void;
    collapse: () => void;
  }>;
}

const MechO = () => (
  <svg
    viewBox="-150 -150 300 300"
    fill="none"
    className="inline-block h-[0.85em] w-[0.85em] relative bottom-[0.05em] mx-[0.02em]"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="plateGradFooter" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1A2035" />
        <stop offset="100%" stopColor="#04060A" />
      </linearGradient>
      <filter id="coreGlowFooter" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <g id="mech-plate">
        <path
          d="M -37.56 -70.63 A 80 80 0 0 1 37.56 -70.63 L 21.12 -39.73 L 8 -39.73 L 0 -22 L -8 -39.73 L -21.12 -39.73 Z"
          fill="url(#plateGradFooter)"
          stroke="#3A0088"
          strokeWidth="1"
        />
        <path
          d="M 8 -39.73 L 0 -22 L -8 -39.73"
          fill="none"
          stroke="#00F0FF"
          strokeWidth="1.5"
          filter="url(#coreGlowFooter)"
        />
      </g>
    </defs>
    <circle cx="0" cy="0" r="100" fill="#030408" />
    <circle
      r="88"
      fill="none"
      stroke="#00F0FF"
      strokeWidth="1"
      strokeDasharray="70 22.15"
      opacity="0.6"
      style={{ animation: "spin 10s linear infinite" }}
    />
    <circle
      r="93"
      fill="none"
      stroke="#7000FF"
      strokeWidth="0.5"
      strokeDasharray="4 4"
      opacity="0.8"
      style={{ animation: "spin 15s linear infinite reverse" }}
    />
    <use href="#mech-plate" transform="rotate(0)" />
    <use href="#mech-plate" transform="rotate(60)" />
    <use href="#mech-plate" transform="rotate(120)" />
    <use href="#mech-plate" transform="rotate(180)" />
    <use href="#mech-plate" transform="rotate(240)" />
    <use href="#mech-plate" transform="rotate(300)" />
    <circle r="28" fill="none" stroke="#4A00E0" strokeWidth="1" strokeDasharray="3 4" opacity="0.8" />
    <polygon points="0,-10 8.66,-5 8.66,5 0,10 -8.66,5 -8.66,-5" fill="#00D2FF" filter="url(#coreGlowFooter)" />
  </svg>
);

export default function Footer({ cursorRef }: FooterProps) {
  const footerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const letters = ["M", "N", "I", "B", "O", "X"];

  useGSAP(
    () => {
      if (!footerRef.current) return;

      // Set initial states
      lettersRef.current.forEach((el) => {
        if (el) gsap.set(el, { y: "110%", opacity: 0 });
      });
      if (svgWrapRef.current) {
        gsap.set(svgWrapRef.current, { scale: 0, opacity: 0 });
      }

      // ScrollTrigger reveal
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 85%",
        onEnter: () => {
          if (hasAnimated.current) return;
          hasAnimated.current = true;

          const tl = gsap.timeline();

          // Stagger letters in
          lettersRef.current.forEach((el, i) => {
            if (!el) return;
            tl.to(
              el,
              {
                y: "0%",
                opacity: 1,
                duration: 0.9,
                ease: "power4.out",
              },
              i * 0.07
            );
          });

          // SVG bounces in
          if (svgWrapRef.current) {
            tl.to(
              svgWrapRef.current,
              {
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: "back.out(1.7)",
              },
              0.3
            );
          }
        },
      });

      // Hover: expand letter spacing
      const onEnter = () => {
        if (wordRef.current) {
          gsap.to(wordRef.current, {
            letterSpacing: "0.08em",
            duration: 0.6,
            ease: "power3.out",
          });
        }
        cursorRef.current?.expand();
      };

      const onLeave = () => {
        if (wordRef.current) {
          gsap.to(wordRef.current, {
            letterSpacing: "0em",
            duration: 0.6,
            ease: "power3.out",
          });
        }
        cursorRef.current?.collapse();
      };

      const el = footerRef.current;
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);

      return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      className="relative min-h-screen bg-[#050505] flex flex-col justify-between overflow-hidden px-8 pt-24 pb-10"
    >
      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.05,
          mixBlendMode: "overlay",
        }}
      />

      {/* Top label */}
      <div className="flex justify-between items-start mb-8">
        <span
          className="text-[10px] tracking-[0.4em] text-white/30 font-mono uppercase"
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          OMNIBOX / SYSTEM_TERMINUS
        </span>
        <span
          className="text-[10px] tracking-[0.4em] text-[#0000FF]/50 font-mono uppercase"
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          EST. 2025 — ∞
        </span>
      </div>

      {/* Giant word */}
      <div className="flex-1 flex items-center justify-center">
        <div
          ref={wordRef}
          className="relative flex items-baseline leading-none select-none"
          style={{
            fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(60px, 14vw, 180px)",
            letterSpacing: "0em",
          }}
        >
          {/* M */}
          <span
            className="overflow-hidden inline-block"
            style={{ color: "#FFFFFF" }}
          >
            <span
              ref={(el) => {
                lettersRef.current[0] = el;
              }}
              className="inline-block"
            >
              M
            </span>
          </span>

          {/* The "O" from OMNI — rendered as SVG */}
          <span className="overflow-hidden inline-block" style={{ display: "inline-flex", alignItems: "baseline" }}>
            <div
              ref={svgWrapRef}
              className="inline-block"
              style={{ display: "inline-flex", alignItems: "baseline" }}
            >
              <MechO />
            </div>
          </span>

          {/* N */}
          <span
            className="overflow-hidden inline-block"
            style={{ color: "#FFFFFF" }}
          >
            <span
              ref={(el) => {
                lettersRef.current[1] = el;
              }}
              className="inline-block"
            >
              N
            </span>
          </span>

          {/* I */}
          <span
            className="overflow-hidden inline-block"
            style={{ color: "#FFFFFF" }}
          >
            <span
              ref={(el) => {
                lettersRef.current[2] = el;
              }}
              className="inline-block"
            >
              I
            </span>
          </span>

          {/* B */}
          <span
            className="overflow-hidden inline-block"
            style={{ color: "#0000FF" }}
          >
            <span
              ref={(el) => {
                lettersRef.current[3] = el;
              }}
              className="inline-block"
            >
              B
            </span>
          </span>

          {/* O */}
          <span
            className="overflow-hidden inline-block"
            style={{ color: "#FFFFFF" }}
          >
            <span
              ref={(el) => {
                lettersRef.current[4] = el;
              }}
              className="inline-block"
            >
              O
            </span>
          </span>

          {/* X */}
          <span
            className="overflow-hidden inline-block"
            style={{ color: "#FFFFFF" }}
          >
            <span
              ref={(el) => {
                lettersRef.current[5] = el;
              }}
              className="inline-block"
            >
              X
            </span>
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 pt-6 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                className="text-[11px] tracking-[0.25em] text-white/30 hover:text-[#0000FF] transition-colors duration-300 font-mono uppercase"
                style={{ fontFamily: "'Courier New', monospace" }}
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Ambient blue glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vh] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(0,0,255,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </footer>
  );
}