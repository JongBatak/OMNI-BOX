'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagicRings from '../Animations/MagicRings';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CtaSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(containerRef);

    // SVG Motif Drawing Animation
    gsap.fromTo(q('.cta-svg-path'),
      { strokeDasharray: 200, strokeDashoffset: 200 },
      { 
        strokeDashoffset: 0, 
        duration: 3, 
        ease: 'power3.inOut',
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
        }
      }
    );

    // Stagger fade up for Pricing Cards
    gsap.fromTo(q('.pricing-card'),
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 50%',
        }
      }
    );

    // Subtle parallax for cards inside the pinned container
    gsap.to(q('.card-pro'), {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      }
    });

    gsap.to(q('.card-standard'), {
      yPercent: -5,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      }
    });

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="panel dark-section-trigger relative z-30 min-h-screen w-full bg-[#010310] flex flex-col items-center justify-center p-8 md:p-16 overflow-hidden perspective-1000"
    >
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <MagicRings 
          color="#0000FF" 
          colorTwo="#FFFFFF"
          ringCount={8} 
          lineThickness={0.8}
        />
      </div>

      {/* Top Area: Headline & Button */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center mb-24 mt-12 flex flex-col items-center">
        <h2 className="text-5xl md:text-7xl font-sans font-black tracking-tighter text-white mb-8 leading-none">
          UNLEASH YOUR <br/> <span className="text-[#0000FF] mix-blend-lighten">OMNI SPACE</span>
        </h2>
        
        <button className="group relative overflow-hidden rounded-full bg-[#0000FF] px-12 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,255,0.5)]">
          <span className="relative z-10">Start Now</span>
          <div className="absolute inset-0 z-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
        </button>
      </div>

      {/* Bottom Area: Pricing Grid */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        {/* FREE TIER */}
        <div className="pricing-card card-standard relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:border-white/30 hover:bg-white/10">
          <div className="mb-8">
            <h3 className="text-[#0000FF] text-xs font-black tracking-[0.2em] uppercase mb-4">Node 01 // Basic</h3>
            <div className="text-white text-5xl font-black tracking-tight mb-2">Free</div>
            <p className="text-white/50 text-sm">Initiate your footprint.</p>
          </div>
          <ul className="space-y-4 mb-10 text-white/70 text-sm font-medium">
            <li className="flex items-center gap-3">
              <span className="text-[#0000FF]">●</span> Basic Storage Node
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#0000FF]">●</span> Standard Sync Speed
            </li>
            <li className="flex items-center gap-3 opacity-50">
              <span className="text-white/20">○</span> No 3D Rendering
            </li>
          </ul>
        </div>

        {/* PRO TIER */}
        <div className="pricing-card card-pro relative overflow-hidden rounded-[2rem] border border-[#0000FF]/50 bg-[#0000FF]/10 p-10 md:p-12 backdrop-blur-2xl transition-all duration-500 hover:border-[#0000FF] hover:bg-[#0000FF]/20 hover:shadow-[0_0_50px_rgba(0,0,255,0.15)] transform-gpu scale-105 z-10">
          {/* Subtle Pro Glow */}
          <div className="absolute -inset-20 bg-[#0000FF]/20 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="relative z-10 mb-8">
            <h3 className="text-white text-xs font-black tracking-[0.2em] uppercase mb-4 flex justify-between">
              Node 02 // Prime
              <span className="bg-[#0000FF] px-2 py-1 rounded-full text-[10px] leading-none">POPULAR</span>
            </h3>
            <div className="text-white text-6xl font-black tracking-tight mb-2">$12<span className="text-2xl text-white/50">/mo</span></div>
            <p className="text-[#0000FF]/80 text-sm">Expand your dimension.</p>
          </div>
          <ul className="relative z-10 space-y-4 mb-10 text-white text-sm font-medium tracking-wide">
            <li className="flex items-center gap-3">
              <span className="text-[#0000FF] drop-shadow-[0_0_8px_rgba(0,0,255,1)]">●</span> Advanced Compiler
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#0000FF] drop-shadow-[0_0_8px_rgba(0,0,255,1)]">●</span> Ultra-fast Global Sync
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#0000FF] drop-shadow-[0_0_8px_rgba(0,0,255,1)]">●</span> Interactive 3D Models
            </li>
          </ul>
          <button className="relative z-10 w-full rounded-2xl border border-[#0000FF] bg-[#0000FF]/10 py-4 font-bold uppercase tracking-wider text-white transition-all hover:bg-[#0000FF]">
            Deploy Pro Node
          </button>
        </div>

        {/* ENTERPRISE TIER */}
        <div className="pricing-card card-standard relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:border-white/30 hover:bg-white/10">
          <div className="mb-8">
            <h3 className="text-[#0000FF]/50 text-xs font-black tracking-[0.2em] uppercase mb-4">Node 03 // Apex</h3>
            <div className="text-white text-5xl font-black tracking-tight mb-2">Custom</div>
            <p className="text-white/50 text-sm">Infinite architecture.</p>
          </div>
          <ul className="space-y-4 mb-10 text-white/70 text-sm font-medium">
            <li className="flex items-center gap-3">
              <span className="text-[#0000FF]">●</span> Military-grade Encryption
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#0000FF]">●</span> Unlimited Global Access
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#0000FF]">●</span> Dedicated Infrastructure
            </li>
          </ul>
        </div>
        
      </div>
    </section>
  );
}
