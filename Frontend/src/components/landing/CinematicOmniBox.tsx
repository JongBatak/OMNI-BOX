'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';

export default function CinematicOmniBox() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const coreNodeRef = useRef<HTMLDivElement>(null);
  const blackoutRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleHoverStart = () => {
    if (isTransitioning) return;
    setIsHovered(true);
  };

  const handleHoverEnd = () => {
    if (isTransitioning) return;
    setIsHovered(false);
  };

  const handleClick = () => {
    if (isTransitioning || !coreNodeRef.current || !blackoutRef.current) return;
    setIsTransitioning(true);
    setIsHovered(false);

    const coreRect = coreNodeRef.current.getBoundingClientRect();
    const centerX = coreRect.left + coreRect.width / 2;
    const centerY = coreRect.top + coreRect.height / 2;

    // Center the blackout div precisely on the node
    gsap.set(blackoutRef.current, {
      x: centerX,
      y: centerY,
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      opacity: 1,
      display: 'block'
    });

    // Cinematic Blackout transition
    gsap.to(blackoutRef.current, {
      scale: 150, // Massive scale to cover any viewport
      duration: 1.5,
      ease: 'power4.inOut',
      onComplete: () => {
        router.push('/manifesto');
      }
    });
  };

  // The actual mechanical plate path from LoadingOverlay
  const mechanicalPlateD = "M -37.56 -70.63 A 80 80 0 0 1 37.56 -70.63 L 21.12 -39.73 L 8 -39.73 L 0 -22 L -8 -39.73 L -21.12 -39.73 Z";

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden select-none"
    >
      
      {/* Blackout Overlay - Starts hidden and scaled to 0 */}
      <div 
        ref={blackoutRef}
        className="fixed top-0 left-0 w-[5vw] h-[5vw] rounded-full bg-black z-50 pointer-events-none hidden will-change-transform"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      <div 
        className="relative z-10 flex items-center justify-center font-heading font-black text-6xl md:text-8xl lg:text-9xl tracking-tighter text-[#e2e8f0] cursor-pointer"
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        onClick={handleClick}
      >
        
        {/* Left Side: OMNI */}
        <motion.div 
          className="flex items-center will-change-transform"
          animate={{ x: isHovered && !isTransitioning ? -15 : 0 }}
          transition={{ ease: "backOut", duration: 0.6 }}
        >
          <motion.span 
            className="will-change-transform"
            animate={{ letterSpacing: isHovered && !isTransitioning ? "0.05em" : "0em" }}
            transition={{ ease: "backOut", duration: 0.6 }}
          >
            OMNI
          </motion.span>
        </motion.div>

        {/* Separator Line */}
        <motion.span 
          className="mx-4 md:mx-6 lg:mx-8 text-[#00f0ff]/30 font-sans font-light will-change-transform"
          animate={{ opacity: isTransitioning ? 0 : 1 }}
        >
          |
        </motion.span>

        {/* Right Side: B + Core Node + X */}
        <motion.div
          className="flex items-center will-change-transform"
          animate={{ x: isHovered && !isTransitioning ? 15 : 0 }}
          transition={{ ease: "backOut", duration: 0.6 }}
        >
          <motion.span
            className="will-change-transform"
            animate={{ letterSpacing: isHovered && !isTransitioning ? "0.05em" : "0em" }}
            transition={{ ease: "backOut", duration: 0.6 }}
          >
            B
          </motion.span>

          {/* THE CORE NODE (Replaces the 'O' in BOX) */}
          <motion.div
            ref={coreNodeRef}
            role="button"
            aria-label="Navigate to Manifesto"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
            className="relative flex items-center justify-center mx-1 md:mx-2 lg:mx-3 will-change-transform outline-none"
            style={{ width: "1.0em", height: "1.0em" }}
            animate={{ scale: isHovered && !isTransitioning ? 1.8 : 1 }}
            transition={{ ease: "backOut", duration: 0.6 }} 
          >
            {/* The Text that appears on hover (Does not rotate) */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              animate={{ 
                opacity: isHovered && !isTransitioning ? 1 : 0, 
                scale: isHovered ? 1 : 0.5 
              }}
              transition={{ ease: "backOut", duration: 0.5 }}
            >
              <div className="flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-full w-[75%] h-[75%] border border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <span className="text-[0.09em] font-sans font-bold tracking-[0.15em] text-white text-center leading-[1.2] opacity-90">
                  CLICK TO SEE
                </span>
                <span className="text-[0.09em] font-sans font-black tracking-widest text-[#00f0ff] text-center uppercase opacity-100 mt-[2%]">
                  MANIFESTO
                </span>
              </div>
            </motion.div>

            {/* Infinite Spin Loop */}
            <motion.div
              className="w-full h-full will-change-transform"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              <svg viewBox="-100 -100 200 200" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="corePlateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1A2035" />
                    <stop offset="100%" stopColor="#04060A" />
                  </linearGradient>
                  
                  {/* Dynamic Glow Filter */}
                  <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation={isHovered ? "8" : "3"} result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  
                  <g id="core-plate">
                    <path d={mechanicalPlateD} fill="url(#corePlateGrad)" stroke="#3A0088" strokeWidth="1" strokeLinejoin="round" />
                    <path d="M 8 -39.73 L 0 -22 L -8 -39.73" fill="none" stroke="#00F0FF" strokeWidth="1.5" filter="url(#nodeGlow)" />
                    <path d="M -20 -60 Q 0 -65 20 -60" fill="none" stroke="#7000FF" strokeWidth="1" opacity="0.4" />
                  </g>
                </defs>

                {/* Base Core Shell */}
                <circle cx="0" cy="0" r="100" fill="#030408" className="transition-all duration-500" style={{ filter: isHovered ? "drop-shadow(0 0 20px rgba(0,240,255,0.4))" : "none" }} />
                
                {/* Structural Rings */}
                <circle r="88" fill="none" stroke="#00F0FF" strokeWidth="1.5" strokeDasharray="70 22.15" transform="rotate(15)" opacity="0.8" />
                <circle r="93" fill="none" stroke="#7000FF" strokeWidth="1" strokeDasharray="4 4" opacity="0.8" />
                
                {/* 6x Geometric Plates */}
                <use href="#core-plate" transform="rotate(0)" />
                <use href="#core-plate" transform="rotate(60)" />
                <use href="#core-plate" transform="rotate(120)" />
                <use href="#core-plate" transform="rotate(180)" />
                <use href="#core-plate" transform="rotate(240)" />
                <use href="#core-plate" transform="rotate(300)" />
                
                {/* Center Accents */}
                <circle r="28" fill="none" stroke="#4A00E0" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.8" />
                <motion.polygon 
                  points="0,-10 8.66,-5 8.66,5 0,10 -8.66,5 -8.66,-5" 
                  fill="#00D2FF" 
                  filter="url(#nodeGlow)"
                  animate={{ scale: isHovered ? 1.5 : 1 }}
                  transition={{ ease: "backOut", duration: 0.4 }}
                />
              </svg>
            </motion.div>
          </motion.div>

          <motion.span
            className="will-change-transform"
            animate={{ letterSpacing: isHovered && !isTransitioning ? "0.05em" : "0em" }}
            transition={{ ease: "backOut", duration: 0.6 }}
          >
            X
          </motion.span>
        </motion.div>
        
      </div>
      
    </section>
  );
}
