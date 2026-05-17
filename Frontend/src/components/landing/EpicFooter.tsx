'use client';

import { useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/* ─────────────────────────────────────────────
   Mechanical "O" SVG Artifact
───────────────────────────────────────────── */
// FIXED: Added | null to the RefObject type to match useRef initialization
const OArtifact = ({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) => (
  <svg
    ref={svgRef}
    viewBox="-150 -150 300 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '0.82em', height: '0.92em', display: 'inline-block', verticalAlign: '-0.1em', overflow: 'visible' }}
  >
    <defs>
      <linearGradient id="plateGradFooter" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1A2035" />
        <stop offset="100%" stopColor="#04060A" />
      </linearGradient>
      <filter id="coreGlowFooter" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="outerGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feColorMatrix in="blur" type="matrix"
          values="0 0 0 0 0   0 0.9 1 0 0   0 0 0 0 1   0 0 0 0.6 0" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <g id="mechanical-plate-footer">
        <path
          d="M -37.56 -70.63 A 80 80 0 0 1 37.56 -70.63 L 21.12 -39.73 L 8 -39.73 L 0 -22 L -8 -39.73 L -21.12 -39.73 Z"
          fill="url(#plateGradFooter)"
          stroke="#3A0088"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M 8 -39.73 L 0 -22 L -8 -39.73"
          fill="none"
          stroke="#00F0FF"
          strokeWidth="1.5"
          filter="url(#coreGlowFooter)"
        />
        <path
          d="M -20 -60 Q 0 -65 20 -60"
          fill="none"
          stroke="#7000FF"
          strokeWidth="1"
          opacity="0.4"
        />
      </g>
    </defs>

    <circle cx="0" cy="0" r="110" fill="none" stroke="#0000FF" strokeWidth="1" opacity="0.08" filter="url(#outerGlow)" />
    <circle cx="0" cy="0" r="100" fill="#030408" />
    <circle cx="0" cy="0" r="98" fill="none" stroke="#0000FF" strokeWidth="0.5" opacity="0.15" />

    <circle
      r="88"
      fill="none"
      stroke="#00F0FF"
      strokeWidth="1"
      strokeDasharray="70 22.15"
      opacity="0.6"
      className="footer-spin-slow"
      style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
    />
    <circle
      r="93"
      fill="none"
      stroke="#7000FF"
      strokeWidth="0.5"
      strokeDasharray="4 4"
      opacity="0.8"
      className="footer-spin-reverse"
      style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
    />

    {[0, 60, 120, 180, 240, 300].map((deg) => (
      <use key={deg} href="#mechanical-plate-footer" transform={`rotate(${deg})`} />
    ))}

    <circle
      r="28"
      fill="none"
      stroke="#4A00E0"
      strokeWidth="1"
      strokeDasharray="3 4"
      opacity="0.8"
      className="footer-pulse-fast"
      style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
    />

    <polygon
      points="0,-10 8.66,-5 8.66,5 0,10 -8.66,5 -8.66,-5"
      fill="#00D2FF"
      filter="url(#coreGlowFooter)"
    />

    {[-80, -50, -20, 10, 40, 70].map((y) => (
      <line
        key={y}
        x1="-100" y1={y} x2="100" y2={y}
        stroke="#00F0FF"
        strokeWidth="0.3"
        opacity="0.04"
      />
    ))}
  </svg>
);

/* ─────────────────────────────────────────────
   Letter wrapper (clip for stagger reveal)
───────────────────────────────────────────── */
const Letter = ({
  char,
  refFn,
}: {
  char: string;
  refFn: (el: HTMLSpanElement | null) => void;
}) => (
  <span className="inline-block overflow-hidden leading-none" style={{ verticalAlign: 'bottom' }}>
    <span ref={refFn} className="footer-letter inline-block leading-none">
      {char}
    </span>
  </span>
);

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
export default function EpicFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const magnetRef = useRef<HTMLDivElement>(null);
  const svgORef = useRef<SVGSVGElement>(null);
  const letterRefs = useRef<HTMLSpanElement[]>([]);

  const addLetterRef = useCallback((el: HTMLSpanElement | null) => {
    if (el && !letterRefs.current.includes(el)) letterRefs.current.push(el);
  }, []);

  /* ── Magnetic hover ── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!magnetRef.current) return;
    const rect = magnetRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.07;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.04;
    gsap.to(magnetRef.current, { x, y, duration: 0.5, ease: 'power3.out' });
  }, []);

  const handleMouseLeave = useCallback(() => {
    gsap.to(magnetRef.current, {
      x: 0, y: 0,
      duration: 1.2,
      ease: 'elastic.out(1, 0.3)',
    });
  }, []);

  /* ── GSAP Animations ── */
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    });

    /* O artifact reveal */
    tl.fromTo(
      '.footer-o-wrap',
      { opacity: 0, scale: 0.4, filter: 'blur(12px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'expo.out' },
    );

    /* Letters stagger up */
    tl.fromTo(
      letterRefs.current,
      { yPercent: 115, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.055, ease: 'expo.out' },
      '<0.15',
    );

    /* Footer meta row */
    tl.fromTo(
      '.footer-meta',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
      '-=0.5',
    );

    /* After reveal: start continuous ring rotations */
    tl.add(() => {
      gsap.to('.footer-spin-slow', {
        rotation: 360,
        duration: 14,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      });
      gsap.to('.footer-spin-reverse', {
        rotation: -360,
        duration: 9,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      });
      gsap.to('.footer-pulse-fast', {
        opacity: 0.2,
        scale: 1.15,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: '50% 50%',
      });
    });

  }, { scope: footerRef });

  const links = [
    { label: 'Terms', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Docs', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  const socials = [
    { label: 'X / Twitter', href: '#' },
    { label: 'GitHub', href: '#' },
    { label: 'Discord', href: '#' },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#030408] overflow-hidden select-none py-20"
    >
      {/* ── Noise texture overlay ── */}
      <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <filter id="footer-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#footer-noise)" />
      </svg>

      {/* ── Top gradient glow ── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #0000FF 30%, #00F0FF 50%, #0000FF 70%, transparent 100%)' }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[80px]"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,0,255,0.12) 0%, transparent 70%)' }}
      />

      {/* ── Main display text ── */}
      <div className="px-4 sm:px-6 lg:px-10 pt-20 pb-4">
        <div
          className="footer-text-zone relative"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div ref={magnetRef} className="inline-block w-full">
            <div
              className="flex items-baseline leading-none whitespace-nowrap"
              style={{
                fontSize: 'clamp(13vw, 17.5vw, 22vw)',
                fontFamily: '"Barlow Condensed", "Arial Black", sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#F0F4FF',
                textTransform: 'uppercase',
              }}
            >
              {/* SVG O */}
              <span className="footer-o-wrap inline-block relative" style={{ opacity: 0 }}>
                <OArtifact svgRef={svgORef} />
              </span>

              {/* M N I */}
              {['M', 'N', 'I'].map((ch, i) => (
                <Letter key={ch + i} char={ch} refFn={addLetterRef} />
              ))}

              {/* Thin vertical divider */}
              <span
                className="inline-block overflow-hidden leading-none mx-[0.06em]"
                style={{ verticalAlign: 'bottom' }}
              >
                <span
                  ref={addLetterRef}
                  className="footer-letter inline-block"
                  style={{
                    width: '2px',
                    height: '0.7em',
                    background: 'linear-gradient(180deg, #0000FF 0%, #00F0FF 100%)',
                    display: 'inline-block',
                    opacity: 0.4,
                    marginBottom: '0.05em',
                  }}
                />
              </span>

              {/* B O X */}
              {['B', 'O', 'X'].map((ch, i) => (
                <Letter key={ch + i} char={ch} refFn={addLetterRef} />
              ))}
            </div>
          </div>

          {/* Subtle tagline under the giant text */}
          <p
            className="footer-meta mt-2 pl-1"
            style={{
              fontFamily: '"IBM Plex Mono", "Courier New", monospace',
              fontSize: 'clamp(10px, 1.1vw, 14px)',
              color: 'rgba(160,170,220,0.45)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              opacity: 0,
            }}
          >
            Cloud · Storage · Development Environment · Est. 2025
          </p>
        </div>
      </div>

      {/* ── Separator ── */}
      <div className="footer-meta mx-4 sm:mx-6 lg:mx-10 border-t border-white/10 mt-8" style={{ opacity: 0 }} />

      {/* ── Footer links row ── */}
      <div
        className="footer-meta flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-4 sm:px-6 lg:px-10 py-8"
        style={{ opacity: 0 }}
      >
        {/* Logo mark */}
        <div className="flex items-center gap-3">
          <span
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 900,
              fontSize: '1.15rem',
              letterSpacing: '0.12em',
              color: 'rgba(240,244,255,0.7)',
              textTransform: 'uppercase',
            }}
          >
            OMNIBOX
          </span>
          <span
            className="px-2 py-0.5 text-[10px] tracking-[0.2em]"
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              border: '1px solid rgba(0,0,255,0.5)',
              color: '#0000FF',
              borderRadius: '2px',
            }}
          >
            BETA
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex flex-wrap gap-x-7 gap-y-2">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '11px',
                letterSpacing: '0.16em',
                color: 'rgba(160,170,220,0.5)',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'color 0.25s',
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Socials */}
        <div className="flex items-center gap-5">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: 'rgba(160,170,220,0.4)',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'color 0.25s',
              }}
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'rgba(160,170,220,0.25)',
          }}
        >
          © {new Date().getFullYear()} OMNIBOX INC.
        </p>
      </div>

      {/* ── Bottom accent line ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,255,0.4) 50%, transparent 100%)' }}
      />
    </footer>
  );
}
