"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Footer from "./SiteFooter";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
function CustomCursor({
  cursorAPI,
}: {
  cursorAPI: React.MutableRefObject<{
    expand: () => void;
    collapse: () => void;
  }>;
}) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);
  const expandedRef = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      const speed = expandedRef.current ? 0.1 : 0.18;
      currentRef.current.x += (posRef.current.x - currentRef.current.x) * speed;
      currentRef.current.y += (posRef.current.y - currentRef.current.y) * speed;

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

  // Expose expand/collapse
  cursorAPI.current = {
    expand: () => {
      expandedRef.current = true;
      if (ringRef.current && dotRef.current && textRef.current) {
        gsap.to(ringRef.current, { width: 96, height: 96, borderColor: "#0000FF", duration: 0.4, ease: "power3.out" });
        gsap.to(dotRef.current, { opacity: 0, duration: 0.2 });
        gsap.to(textRef.current, { opacity: 1, duration: 0.3, delay: 0.1 });
      }
    },
    collapse: () => {
      expandedRef.current = false;
      if (ringRef.current && dotRef.current && textRef.current) {
        gsap.to(ringRef.current, { width: 32, height: 32, borderColor: "rgba(0,0,255,0.5)", duration: 0.4, ease: "power3.out" });
        gsap.to(dotRef.current, { opacity: 1, duration: 0.2 });
        gsap.to(textRef.current, { opacity: 0, duration: 0.15 });
      }
    },
  };

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-[#0000FF]"
        style={{ width: 8, height: 8 }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border flex items-center justify-center"
        style={{
          width: 32,
          height: 32,
          borderColor: "rgba(0,0,255,0.5)",
          borderWidth: 1.5,
        }}
      >
        <span
          ref={textRef}
          className="text-[7px] tracking-[0.15em] text-[#0000FF] font-mono uppercase opacity-0 select-none"
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          INITIATE
        </span>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   NOISE OVERLAY
───────────────────────────────────────────── */
function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9990]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.05,
        mixBlendMode: "overlay",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   SCENE 1 — THE MANIFESTO DROP
───────────────────────────────────────────── */
function Scene1() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !nameRef.current || !manifestoRef.current || !wrapRef.current) return;

      gsap.set(wrapRef.current, { scale: 2, filter: "blur(20px)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 1,
        },
      });

      // Phase 1: scale & unblur
      tl.to(wrapRef.current, {
        scale: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
      });

      // Brief pause
      tl.to({}, { duration: 0.3 });

      // Phase 2: split off screen
      tl.to(
        nameRef.current,
        {
          xPercent: -130,
          opacity: 0,
          duration: 1.2,
          ease: "power3.inOut",
        },
        "split"
      );
      tl.to(
        manifestoRef.current,
        {
          xPercent: 130,
          opacity: 0,
          duration: 1.2,
          ease: "power3.inOut",
        },
        "split"
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="pin-section h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden"
    >
      <div
        ref={wrapRef}
        className="text-center leading-none select-none"
        style={{
          fontFamily: "'Arial Black', 'Helvetica Neue', Impact, sans-serif",
          fontWeight: 900,
        }}
      >
        <div
          ref={nameRef}
          className="text-white block"
          style={{
            fontSize: "clamp(48px, 10vw, 140px)",
            letterSpacing: "-0.03em",
            lineHeight: 0.9,
          }}
        >
          A NAME.
        </div>
        <div
          ref={manifestoRef}
          className="block mt-2"
          style={{
            fontSize: "clamp(40px, 8.5vw, 120px)",
            letterSpacing: "-0.02em",
            color: "#0000FF",
            lineHeight: 0.9,
          }}
        >
          A MANIFESTO.
        </div>
      </div>

      {/* Corner labels */}
      <span
        className="absolute top-8 left-8 text-[10px] tracking-[0.4em] text-white/20 font-mono uppercase"
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        OMNIBOX / SEQUENCE_01
      </span>
      <span
        className="absolute bottom-8 right-8 text-[10px] tracking-[0.4em] text-[#0000FF]/40 font-mono uppercase"
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        SCROLL TO REVEAL ↓
      </span>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SCENE 2 — 3D ETYMOLOGY ILLUSION
───────────────────────────────────────────── */
function Scene2() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const omniboxRef = useRef<HTMLDivElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);
  const omniRevealRef = useRef<HTMLDivElement>(null);
  const boxRevealRef = useRef<HTMLDivElement>(null);
  const omniLineRef = useRef<SVGLineElement>(null);
  const boxLineRef = useRef<SVGLineElement>(null);
  const omniNodeRef = useRef<HTMLDivElement>(null);
  const boxNodeRef = useRef<HTMLDivElement>(null);
  const splitRowRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodesRowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Initial states
      gsap.set([omniRevealRef.current, boxRevealRef.current], {
        rotateX: 90,
        opacity: 0,
        transformOrigin: "center bottom",
      });
      gsap.set(splitRowRef.current, { opacity: 0 });
      gsap.set(svgRef.current, { opacity: 0 });
      gsap.set([omniNodeRef.current, boxNodeRef.current], { opacity: 0, y: 20 });
      gsap.set(nodesRowRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=350%",
          pin: true,
          scrub: 1,
        },
      });

      // Phase 1: split OMNIBOX top/bottom
      tl.to(topHalfRef.current, {
        y: -80,
        opacity: 0,
        duration: 1,
        ease: "power3.inOut",
      });
      tl.to(
        bottomHalfRef.current,
        {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: "power3.inOut",
        },
        "<"
      );
      tl.to(omniboxRef.current, { opacity: 0, duration: 0.3 }, "<0.7");

      // Phase 2: rotate in OMNI / BOX
      tl.to(splitRowRef.current, { opacity: 1, duration: 0.2 });
      tl.to(
        [omniRevealRef.current, boxRevealRef.current],
        {
          rotateX: 0,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(1.2)",
          stagger: 0.15,
        },
        "-=0.1"
      );

      // Phase 3: SVG lines draw
      tl.to({}, { duration: 0.3 });
      tl.to(svgRef.current, { opacity: 1, duration: 0.4 });

      // Animate SVG lines via drawSVG
      if (omniLineRef.current && boxLineRef.current) {
        tl.fromTo(
          [omniLineRef.current, boxLineRef.current],
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 1, stagger: 0.1, ease: "power2.inOut" },
          "-=0.2"
        );
      }

      // Phase 4: nodes appear
      tl.to(nodesRowRef.current, { opacity: 1, duration: 0.3 });
      tl.to(
        [omniNodeRef.current, boxNodeRef.current],
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
        },
        "-=0.1"
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="pin-section h-screen w-full bg-[#050505] flex flex-col items-center justify-center overflow-hidden relative"
    >
      {/* OMNIBOX full word (top/bottom halves clipped) */}
      <div
        ref={omniboxRef}
        className="relative select-none"
        style={{
          fontFamily: "'Arial Black', 'Helvetica Neue', Impact, sans-serif",
          fontWeight: 900,
          fontSize: "clamp(60px, 12vw, 160px)",
          letterSpacing: "-0.03em",
          color: "#FFFFFF",
          lineHeight: 1,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Top half */}
        <div
          ref={topHalfRef}
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: "inset(0 0 50% 0)" }}
        >
          OMNIBOX
        </div>
        {/* Bottom half */}
        <div
          ref={bottomHalfRef}
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: "inset(50% 0 0 0)" }}
        >
          OMNIBOX
        </div>
        {/* Spacer */}
        <div style={{ opacity: 0 }}>OMNIBOX</div>
      </div>

      {/* Split row: OMNI — BOX */}
      <div
        ref={splitRowRef}
        className="flex items-end justify-center gap-16 md:gap-32 w-full px-8"
        style={{ perspective: "800px" }}
      >
        {/* OMNI */}
        <div
          ref={omniRevealRef}
          className="text-center"
          style={{
            fontFamily: "'Arial Black', 'Helvetica Neue', Impact, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(48px, 9vw, 120px)",
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          OMNI
        </div>

        {/* Separator */}
        <div
          className="text-[#0000FF]/30 select-none"
          style={{
            fontSize: "clamp(36px, 6vw, 80px)",
            fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
            fontWeight: 900,
            alignSelf: "center",
            lineHeight: 1,
          }}
        >
          /
        </div>

        {/* BOX */}
        <div
          ref={boxRevealRef}
          className="text-center"
          style={{
            fontFamily: "'Arial Black', 'Helvetica Neue', Impact, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(48px, 9vw, 120px)",
            color: "#0000FF",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          BOX
        </div>
      </div>

      {/* SVG Lines */}
      <svg
        ref={svgRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Line from OMNI down */}
        <line
          ref={omniLineRef}
          x1="390"
          y1="500"
          x2="390"
          y2="680"
          stroke="#0000FF"
          strokeWidth="1"
          opacity="0.7"
        />
        {/* Line from BOX down */}
        <line
          ref={boxLineRef}
          x1="1050"
          y1="500"
          x2="1050"
          y2="680"
          stroke="#0000FF"
          strokeWidth="1"
          opacity="0.7"
        />
      </svg>

      {/* Definition nodes */}
      <div
        ref={nodesRowRef}
        className="absolute bottom-[8%] left-0 w-full flex justify-around px-8 md:px-24"
      >
        {/* Node 1 */}
        <div
          ref={omniNodeRef}
          className="rounded border border-white/10 p-4 md:p-6 max-w-[280px]"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <p
            className="text-[#0000FF] text-[10px] tracking-[0.4em] mb-2 font-mono uppercase"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            OMNI — adj.
          </p>
          <p
            className="text-[15px] font-bold text-white mb-1"
            style={{ fontFamily: "'Arial Black', sans-serif", letterSpacing: "-0.01em" }}
          >
            UNIVERSAL
          </p>
          <p
            className="text-[11px] text-white/40 leading-relaxed"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            All-encompassing. Without boundaries. A layer that exists everywhere simultaneously.
          </p>
        </div>

        {/* Node 2 */}
        <div
          ref={boxNodeRef}
          className="rounded border border-[#0000FF]/20 p-4 md:p-6 max-w-[280px]"
          style={{
            background: "rgba(0,0,255,0.04)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <p
            className="text-[#0000FF] text-[10px] tracking-[0.4em] mb-2 font-mono uppercase"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            BOX — n.
          </p>
          <p
            className="text-[15px] font-bold text-white mb-1"
            style={{ fontFamily: "'Arial Black', sans-serif", letterSpacing: "-0.01em" }}
          >
            CONTAINER
          </p>
          <p
            className="text-[11px] text-white/40 leading-relaxed"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            The foundational environment. A hyper-secure perimeter holding infinite possibilities.
          </p>
        </div>
      </div>

      {/* Corner label */}
      <span
        className="absolute top-8 left-8 text-[10px] tracking-[0.4em] text-white/20 font-mono uppercase"
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        OMNIBOX / SEQUENCE_02
      </span>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SCENE 3 — WIREFRAME PARALLAX (unpinned)
───────────────────────────────────────────── */
function Scene3() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Parallax: text scrolls up slowly
      gsap.to(textRef.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Cube scales up and rotates
      gsap.fromTo(
        cubeRef.current,
        { rotateX: -10, rotateY: -20, scale: 0.6, opacity: 0.3 },
        {
          rotateX: 15,
          rotateY: 30,
          scale: 1.6,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden py-32"
      style={{
        background: "radial-gradient(ellipse at center, #030310 0%, #050505 70%)",
      }}
    >
      {/* Background massive text */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <span
          className="text-white/[0.04] select-none text-center leading-none"
          style={{
            fontFamily: "'Arial Black', 'Helvetica Neue', Impact, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(80px, 16vw, 220px)",
            letterSpacing: "-0.04em",
            whiteSpace: "nowrap",
          }}
        >
          BEYOND
          <br />
          THE GRID
        </span>
      </div>

      {/* Foreground large text */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 text-center"
        style={{ zIndex: 10 }}
      >
        <p
          className="text-[10px] tracking-[0.5em] text-[#0000FF]/60 font-mono uppercase mb-4"
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          BEYOND THE GRID
        </p>
        <p
          className="text-white/60 text-sm max-w-xs text-center leading-loose"
          style={{ fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: "0.1em" }}
        >
          THE INFRASTRUCTURE THAT EXISTS<br />
          BETWEEN ALL SYSTEMS
        </p>
      </div>

      {/* Isometric Wireframe Cube SVG */}
      <svg
        ref={cubeRef}
        viewBox="0 0 400 400"
        fill="none"
        className="relative z-20"
        style={{
          width: "min(70vw, 500px)",
          height: "min(70vw, 500px)",
          transformStyle: "preserve-3d",
          filter: "drop-shadow(0 0 30px rgba(0,0,255,0.3))",
        }}
      >
        {/* Isometric cube face — top */}
        <polygon
          points="200,60 340,140 200,220 60,140"
          fill="none"
          stroke="#0000FF"
          strokeWidth="1"
          opacity="0.8"
        />
        {/* Left face */}
        <polygon
          points="60,140 200,220 200,340 60,260"
          fill="rgba(0,0,255,0.04)"
          stroke="#0000FF"
          strokeWidth="1"
          opacity="0.6"
        />
        {/* Right face */}
        <polygon
          points="340,140 200,220 200,340 340,260"
          fill="rgba(0,0,255,0.06)"
          stroke="#0000FF"
          strokeWidth="1"
          opacity="0.6"
        />
        {/* Inner grid lines — top face */}
        <line x1="200" y1="60" x2="200" y2="220" stroke="#0000FF" strokeWidth="0.5" opacity="0.3" />
        <line x1="60" y1="140" x2="340" y2="140" stroke="#0000FF" strokeWidth="0.5" opacity="0.3" />
        <line x1="130" y1="100" x2="270" y2="180" stroke="#0000FF" strokeWidth="0.5" opacity="0.2" />
        <line x1="270" y1="100" x2="130" y2="180" stroke="#0000FF" strokeWidth="0.5" opacity="0.2" />
        {/* Vertical edges */}
        <line x1="200" y1="220" x2="200" y2="340" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.2" />
        {/* Corner dots */}
        {[
          [200, 60], [340, 140], [200, 220], [60, 140],
          [200, 340], [60, 260], [340, 260],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="3"
            fill="#0000FF"
            opacity="0.9"
          />
        ))}
        {/* Glow circle */}
        <circle cx="200" cy="200" r="150" fill="none" stroke="#0000FF" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.15" />
      </svg>

      {/* Corner label */}
      <span
        className="absolute top-8 left-8 text-[10px] tracking-[0.4em] text-white/20 font-mono uppercase"
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        OMNIBOX / SEQUENCE_03
      </span>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ROOT MANIFESTO COMPONENT
───────────────────────────────────────────── */
export default function Manifesto() {
  const cursorAPI = useRef<{ expand: () => void; collapse: () => void }>({
    expand: () => { },
    collapse: () => { },
  });

  return (
    <>
      <style>{`
        * { cursor: none !important; }
        html { scroll-behavior: auto; }
        body { background: #050505; overflow-x: hidden; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <NoiseOverlay />
      <CustomCursor cursorAPI={cursorAPI} />

      <main>
        <Scene1 />
        <Scene2 />
        <Scene3 />
        <Footer cursorRef={cursorAPI} />
      </main>
    </>
  );
}