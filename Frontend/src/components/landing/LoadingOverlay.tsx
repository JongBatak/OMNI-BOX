'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplineLoadPhase } from './OmniBoxLanding';

type LoadingOverlayProps = {
  splinePhase: SplineLoadPhase;
  onInitSpline: () => void;
  onStartHero: () => void;
};

export default function LoadingOverlay({
  splinePhase,
  onInitSpline,
  onStartHero,
}: LoadingOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(overlayRef);
      const progress = { value: 0 };

      // Initial state: screen is completely empty blue
      gsap.set(q('.omni-stroke'), { strokeDasharray: 3000, strokeDashoffset: 3000, fill: 'transparent' });
      gsap.set(q('.motif-line'), { strokeDasharray: 3000, strokeDashoffset: 3000 });
      gsap.set(q('.bg-gradient-shift'), { backgroundPosition: '0% 0%' });
      gsap.set(q('.progress-val'), { opacity: 0 });
      gsap.set(q('.counter-wrapper'), { opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlayRef.current, { pointerEvents: 'none', display: 'none' });
        },
      });
      
      tlRef.current = tl;

      // 0. The Empty Blue Screen Wait (1.2 seconds)
      tl.to({}, { duration: 1.2 });

      // 1. Converging abstract SVG lines (the OMNI mask & motifs) - ZERO LAG ZONE
      tl.to(q('.motif-line'), {
        strokeDashoffset: 0,
        duration: 3.5,
        stagger: 0.1,
        ease: 'power4.inOut',
      }, 1.2);

      tl.to(q('.omni-stroke'), {
        strokeDashoffset: 0,
        duration: 2.5,
        stagger: 0.15,
        ease: 'expo.inOut',
      }, 1.5);

      // Pop the geometric fill
      tl.to(q('.omni-stroke'), {
        fill: '#FFFFFF',
        stroke: 'transparent',
        duration: 0.8,
        ease: 'power3.out',
      }, 3.5);

      // 2. SVG animation complete. Safe to mount heavy WebGL now.
      const loadingStart = 4.5;

      // Intentionally call `onInitSpline()` asynchronously heavily decoupled from GSAP frames
      tl.call(() => {
        setTimeout(() => {
          onInitSpline();
        }, 0);
      }, undefined, loadingStart);

      // Shift Background slowly
      tl.to(q('.bg-gradient-shift'), {
        backgroundPosition: '100% 100%',
        duration: 3.5,
        ease: 'sine.inOut'
      }, loadingStart);

      // Fade in counter 
      tl.to(q('.counter-wrapper'), {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, loadingStart);
      
      tl.to(q('.progress-val'), {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, loadingStart);

      // Counter progress
      tl.to(progress, {
        value: 100,
        duration: 3.0,
        ease: 'expo.inOut',
        onUpdate: () => {
          const el = q('.progress-num')[0];
          if (el) el.textContent = Math.round(progress.value).toString().padStart(3, '0');
        }
      }, loadingStart);

      // 3. THE SPLINE WAIT
      const handoffStart = loadingStart + 3.0;

      // Evaluate the Spline Load Status
      tl.call(() => {
        if (overlayRef.current?.getAttribute('data-spline-phase') !== 'ready') {
          tl.pause();
        }
      }, undefined, handoffStart);

      // Now that we are fully ready, instead of immediately raising the curtain,
      // reverse the SVG linings and OMNI mask back to empty.
      
      tl.to(q('.omni-stroke'), {
        fill: 'transparent',
        stroke: 'rgba(255,255,255,0.7)',
        duration: 0.5,
        ease: 'power2.inOut',
      }, handoffStart + 0.1);

      tl.to(q('.omni-stroke'), {
        strokeDashoffset: 3000,
        duration: 1.5,
        ease: 'power4.inOut',
        stagger: { each: 0.1, from: 'end' }
      }, handoffStart + 0.3);

      tl.to(q('.motif-line'), {
        strokeDashoffset: 3000,
        duration: 1.5,
        ease: 'power4.inOut',
      }, handoffStart + 0.3);

      const hideElementsStart = handoffStart + 1.6;

      // The Handoff - Notifying Hero
      tl.call(() => {
        onStartHero();
      }, undefined, hideElementsStart);

      // Hide elements
      tl.to(q('.counter-wrapper'), {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.inOut',
      }, hideElementsStart);

      // Smooth Curtain Rise
      tl.to(overlayRef.current, {
        yPercent: -100,
        duration: 1.5,
        ease: 'power4.inOut',
      }, hideElementsStart + 0.2);
      
    },
    { scope: overlayRef } 
  );

  // Automatically resume the curtain rise if we paused for the WebGL load
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.setAttribute('data-spline-phase', splinePhase);
    }
    
    if (splinePhase === 'ready' && tlRef.current && tlRef.current.paused()) {
      tlRef.current.play();
    }
  }, [splinePhase]);

  return (
    <div ref={overlayRef} data-spline-phase="idle" className="fixed inset-0 z-50 pointer-events-auto overflow-hidden will-change-transform bg-[#0000FF]">
      {/* Background Gradient */}
      <div 
        className="bg-gradient-shift absolute w-full h-full inset-0 bg-linear-to-br from-[#0000FF] via-[#0000FF] to-[#FFFFFF] origin-top"
        style={{ backgroundSize: '150% 150%', willChange: 'transform, background-position' }}
      />

      {/* SVG Outline Mask and Motifs */}
      <div className="svg-wrapper absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[75vw] pointer-events-none will-change-transform z-20">
        
        <svg viewBox="0 0 1200 600" className="w-full h-auto overflow-visible drop-shadow-2xl">
          {/* Top Antique Floral/Baroque Motif */}
          <g transform="translate(600, 100)">
            {/* Center Emblem */}
            <path className="motif-line" d="M 0 -30 C 15 -10, 30 -5, 40 10 C 30 25, 15 30, 0 50 C -15 30, -30 25, -40 10 C -30 -5, -15 -10, 0 -30 Z" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            <path className="motif-line" d="M 0 0 C 5 5, 10 15, 0 30 C -5 15, -10 5, 0 0 Z" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            
            {/* Main Sweeping Vines */}
            <path className="motif-line" d="M 45 10 C 150 10, 200 -40, 300 -40 C 400 -40, 450 30, 550 30 C 600 30, 630 10, 610 -10 C 590 -30, 560 -10, 570 15 C 580 40, 620 30, 650 0" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
            <path className="motif-line" d="M -45 10 C -150 10, -200 -40, -300 -40 C -400 -40, -450 30, -550 30 C -600 30, -630 10, -610 -10 C -590 -30, -560 -10, -570 15 C -580 40, -620 30, -650 0" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>

            {/* Inner Flourish Leaves */}
            <path className="motif-line" d="M 200 -12 C 220 -40, 260 -50, 280 -25 C 290 -10, 280 5, 260 5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
            <path className="motif-line" d="M -200 -12 C -220 -40, -260 -50, -280 -25 C -290 -10, -280 5, -260 5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>

            <path className="motif-line" d="M 450 20 C 470 -10, 510 -20, 530 5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
            <path className="motif-line" d="M -450 20 C -470 -10, -510 -20, -530 5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
            
            {/* Dewdrop Accents */}
            <circle cx="270" cy="-10" r="3" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" className="motif-line" />
            <circle cx="-270" cy="-10" r="3" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" className="motif-line" />
            <circle cx="650" cy="0" r="2" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" className="motif-line" />
            <circle cx="-650" cy="0" r="2" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" className="motif-line" />
          </g>

          {/* OMNI Word - Converted to exact geometric paths to guarantee perfect lining animations and prevent font-engine breakages */}
          <path className="omni-stroke" d="M 255 240 L 295 240 A 60 60 0 0 1 355 300 L 355 360 A 60 60 0 0 1 295 420 L 255 420 A 60 60 0 0 1 195 360 L 195 300 A 60 60 0 0 1 255 240 Z M 235 300 L 235 360 A 20 20 0 0 0 255 380 L 295 380 A 20 20 0 0 0 315 360 L 315 300 A 20 20 0 0 0 295 280 L 255 280 A 20 20 0 0 0 235 300 Z" fillRule="evenodd" fill="none" stroke="white" strokeWidth="4" />
          <path className="omni-stroke" d="M 445 420 L 445 240 L 495 240 L 545 330 L 595 240 L 645 240 L 645 420 L 605 420 L 605 302 L 545 410 L 485 302 L 485 420 Z" fill="none" stroke="white" strokeWidth="4" />
          <path className="omni-stroke" d="M 735 420 L 735 240 L 785 240 L 835 340 L 835 240 L 875 240 L 875 420 L 825 420 L 775 320 L 775 420 Z" fill="none" stroke="white" strokeWidth="4" />
          <path className="omni-stroke" d="M 965 420 L 965 240 L 1005 240 L 1005 420 Z" fill="none" stroke="white" strokeWidth="4" />

          {/* Bottom Antique Floral/Baroque Motif (Mirrored) */}
          <g transform="translate(600, 500) scale(1, -1)">
             <path className="motif-line" d="M 0 -30 C 15 -10, 30 -5, 40 10 C 30 25, 15 30, 0 50 C -15 30, -30 25, -40 10 C -30 -5, -15 -10, 0 -30 Z" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            <path className="motif-line" d="M 0 0 C 5 5, 10 15, 0 30 C -5 15, -10 5, 0 0 Z" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <path className="motif-line" d="M 45 10 C 150 10, 200 -40, 300 -40 C 400 -40, 450 30, 550 30 C 600 30, 630 10, 610 -10 C 590 -30, 560 -10, 570 15 C 580 40, 620 30, 650 0" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
            <path className="motif-line" d="M -45 10 C -150 10, -200 -40, -300 -40 C -400 -40, -450 30, -550 30 C -600 30, -630 10, -610 -10 C -590 -30, -560 -10, -570 15 C -580 40, -620 30, -650 0" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
            <path className="motif-line" d="M 200 -12 C 220 -40, 260 -50, 280 -25 C 290 -10, 280 5, 260 5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
            <path className="motif-line" d="M -200 -12 C -220 -40, -260 -50, -280 -25 C -290 -10, -280 5, -260 5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
            <path className="motif-line" d="M 450 20 C 470 -10, 510 -20, 530 5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
            <path className="motif-line" d="M -450 20 C -470 -10, -510 -20, -530 5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
            <circle cx="270" cy="-10" r="3" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" className="motif-line" />
            <circle cx="-270" cy="-10" r="3" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" className="motif-line" />
            <circle cx="650" cy="0" r="2" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" className="motif-line" />
            <circle cx="-650" cy="0" r="2" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" className="motif-line" />
          </g>
        </svg>
      </div>

      {/* Counter Component */}
      <div className="counter-wrapper absolute bottom-12 right-12 z-10 flex gap-4 items-end will-change-transform">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFFFFF]/60 mb-1 mix-blend-difference">
          Initiating Platform
        </span>
        <div className="progress-val font-mono text-[#FFFFFF] text-2xl sm:text-3xl mix-blend-difference">
          <span className="progress-num font-light">000</span>
          <span className="opacity-50 text-xl">%</span>
        </div>
      </div>
    </div>
  );
}