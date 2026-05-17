'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AggregateSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(sectionRef);

    // 1. Reveal Animation for the entire grid
    gsap.fromTo(
      q('.data-card'),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      }
    );

    // 2. Number Counter Animation
    q('.counter-number').forEach((el) => {
      const targetValue = parseFloat(el.getAttribute('data-value') || '0');
      const suffix = el.getAttribute('data-suffix') || '';

      gsap.fromTo(el,
        { innerHTML: 0 },
        {
          innerHTML: targetValue,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
          // Format the number on update to add back decimals and suffixes
          onUpdate: function () {
            let val = Number(this.targets()[0].innerHTML).toFixed(1);
            // Remove decimal if it's .0 for cleaner look on whole numbers
            if (val.endsWith('.0')) val = val.slice(0, -2);
            this.targets()[0].innerHTML = val + suffix;
          }
        }
      );
    });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#f8f9fa] text-[#050505] py-32 px-[40px] md:px-[80px] lg:px-[120px] overflow-hidden flex flex-col justify-center"
    >

      {/* Subtle Background Noise for Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />

      <div className="max-w-[1400px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        {/* LEFT COLUMN: Main Typography & Context */}
        <div className="lg:col-span-5 flex flex-col justify-center pr-0 lg:pr-10">
          <div className="data-card mb-8">
            <h2
              className="text-[10vw] md:text-[6vw] lg:text-[4.5vw] uppercase leading-[0.9] tracking-tighter"
              style={{ fontFamily: "'PP Editorial New', 'Playfair Display', serif" }}
            >
              <span className="block text-[#0000FF] italic pr-2">AGGREGATE</span>
              <span className="block font-black font-sans text-[#050505]">THE NOISE.</span>
            </h2>
          </div>

          <p className="data-card text-lg md:text-xl text-[#050505]/70 leading-relaxed font-medium">
            We pull in fragmented signals across platforms Twitter, Instagram, GitHub, Hashnode and unify them into a cohesive digital echo.
            <br /><br />
            OmniBox doesn't just store data. It <span className="text-[#0000FF] font-bold">synthesizes</span> your entire footprint into actionable intelligence.
          </p>
        </div>

        {/* RIGHT COLUMN: The Data Grid (Bento Style) */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Card 1 */}
          <div className="data-card bg-white rounded-3xl p-8 lg:p-10 border border-black/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,255,0.1)] transition-shadow duration-500 group relative overflow-hidden">
            {/* Hover Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0000FF]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#0000FF]/10 transition-colors duration-500" />
            <div className="text-[10px] font-bold tracking-[0.2em] text-black/30 uppercase mb-4">Node 01</div>
            <h3 className="text-5xl lg:text-6xl font-black text-[#0000FF] tracking-tighter mb-2 font-sans flex items-baseline">
              <span className="counter-number" data-value="24.8" data-suffix="K">0</span>
            </h3>
            <p className="text-sm md:text-base font-bold uppercase tracking-widest text-[#050505]">Interactions Synced</p>
          </div>

          {/* Card 2 */}
          <div className="data-card bg-white rounded-3xl p-8 lg:p-10 border border-black/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,255,0.1)] transition-shadow duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0000FF]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#0000FF]/10 transition-colors duration-500" />
            <div className="text-[10px] font-bold tracking-[0.2em] text-black/30 uppercase mb-4">Node 02</div>
            <h3 className="text-5xl lg:text-6xl font-black text-[#050505] tracking-tighter mb-2 font-sans flex items-baseline">
              <span className="counter-number" data-value="99.9" data-suffix="%">0</span>
            </h3>
            <p className="text-sm md:text-base font-bold uppercase tracking-widest text-[#050505]/60">Uptime Reliability</p>
          </div>

          {/* Card 3 */}
          <div className="data-card bg-white rounded-3xl p-8 lg:p-10 border border-black/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,255,0.1)] transition-shadow duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0000FF]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#0000FF]/10 transition-colors duration-500" />
            <div className="text-[10px] font-bold tracking-[0.2em] text-black/30 uppercase mb-4">Node 03</div>
            <h3 className="text-5xl lg:text-6xl font-black text-[#050505] tracking-tighter mb-2 font-sans flex items-baseline">
              <span className="counter-number" data-value="1.2" data-suffix="M">0</span>
            </h3>
            <p className="text-sm md:text-base font-bold uppercase tracking-widest text-[#050505]/60">Data Points Logged</p>
          </div>

          {/* Card 4 - Highlighted */}
          <div className="data-card bg-[#050505] rounded-3xl p-8 lg:p-10 border border-white/10 shadow-2xl hover:-translate-y-2 transition-transform duration-500 group relative overflow-hidden">
            {/* Subtle animated gradient background for the dark card */}
            <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-[#0000FF] to-transparent mix-blend-screen" />

            <div className="relative z-10">
              <div className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-4">Node 04</div>
              <h3 className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-2 font-sans italic">
                OS-INT
              </h3>
              <p className="text-sm md:text-base font-bold uppercase tracking-widest text-white/70">Open Source Intelligence</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}