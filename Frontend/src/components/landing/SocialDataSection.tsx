'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SocialDataSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(sectionRef);
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
        end: 'top 20%',
        scrub: 1.5,
      }
    });

    // Data points floating up
    tl.fromTo(q('.data-point'), 
      { y: 100, opacity: 0, rotateX: -45 },
      { y: 0, opacity: 1, rotateX: 0, stagger: 0.1, duration: 1, ease: 'power3.out' }
    );

    // Architectural SVG lines
    gsap.fromTo(q('.social-svg-line'),
      { strokeDasharray: 100, strokeDashoffset: 100 },
      { 
        strokeDashoffset: 0, 
        duration: 2, 
        ease: 'power3.inOut',
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        }
      }
    );

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="panel relative min-h-screen w-full bg-[#FFFFFF] py-32 px-8 md:px-24 border-t border-[#0000FF]/10 overflow-hidden z-20 flex items-center">
      
      {/* Largo Studio SVG Motifs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
        <svg className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="20%" y1="0" x2="20%" y2="100%" stroke="#0000FF" strokeWidth="1" pathLength="100" className="social-svg-line" fill="none" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#0000FF" strokeWidth="1" pathLength="100" className="social-svg-line" fill="none" strokeDasharray="4 4" />
          <line x1="80%" y1="0" x2="80%" y2="100%" stroke="#0000FF" strokeWidth="1" pathLength="100" className="social-svg-line" fill="none" />
          
          <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#0000FF" strokeWidth="1" pathLength="100" className="social-svg-line" fill="none" />
          <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#0000FF" strokeWidth="1" pathLength="100" className="social-svg-line" fill="none" />
        </svg>

        {/* Reticle crosses */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path d="M 19% 30% L 21% 30% M 20% 28% L 20% 32%" stroke="#0000FF" strokeWidth="1.5" pathLength="100" className="social-svg-line" fill="none" />
          <path d="M 79% 30% L 81% 30% M 80% 28% L 80% 32%" stroke="#0000FF" strokeWidth="1.5" pathLength="100" className="social-svg-line" fill="none" />
          <path d="M 19% 70% L 21% 70% M 20% 68% L 20% 72%" stroke="#0000FF" strokeWidth="1.5" pathLength="100" className="social-svg-line" fill="none" />
          <path d="M 79% 70% L 81% 70% M 80% 68% L 80% 72%" stroke="#0000FF" strokeWidth="1.5" pathLength="100" className="social-svg-line" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-16 justify-between">
        
        <div className="w-full md:w-1/3">
          <h2 className="font-['Inter',sans-serif] text-4xl md:text-6xl font-black tracking-tight text-[#0000FF] uppercase mb-8">
            Aggregate<br />The Noise.
          </h2>
          <p className="text-[#0000FF]/60 text-lg leading-relaxed max-w-sm">
            We pull in fragmented signals across platforms—Twitter, Instagram, GitHub, Hashnode—and unify them into a cohesive digital echo.
          </p>
        </div>

        <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8 perspective-1000">
          
          <div className="data-point border border-[#0000FF]/20 bg-white p-8 hover:bg-[#0000FF]/5 transition-colors duration-300">
            <div className="text-[10px] font-bold tracking-widest text-[#0000FF]/40 uppercase mb-4 [writing-mode:vertical-lr] rotate-180">Node 01</div>
            <div className="text-5xl font-black text-[#0000FF] tracking-tighter mb-2">24.8K</div>
            <div className="text-sm font-semibold text-[#0000FF]/60 uppercase">Interactions Synced</div>
          </div>

          <div className="data-point border border-[#0000FF]/20 bg-white p-8 hover:bg-[#0000FF]/5 transition-colors duration-300 transform-gpu translate-y-12">
            <div className="text-[10px] font-bold tracking-widest text-[#0000FF]/40 uppercase mb-4 [writing-mode:vertical-lr] rotate-180">Node 02</div>
            <div className="text-5xl font-black text-[#0000FF] tracking-tighter mb-2">99.9%</div>
            <div className="text-sm font-semibold text-[#0000FF]/60 uppercase">Uptime Reliability</div>
          </div>

          <div className="data-point border border-[#0000FF]/20 bg-white p-8 hover:bg-[#0000FF]/5 transition-colors duration-300">
            <div className="text-[10px] font-bold tracking-widest text-[#0000FF]/40 uppercase mb-4 [writing-mode:vertical-lr] rotate-180">Node 03</div>
            <div className="text-5xl font-black text-[#0000FF] tracking-tighter mb-2">1.2M</div>
            <div className="text-sm font-semibold text-[#0000FF]/60 uppercase">Data Points Logged</div>
          </div>

          <div className="data-point border border-[#0000FF]/20 bg-white p-8 hover:bg-[#0000FF]/5 transition-colors duration-300 transform-gpu translate-y-12">
            <div className="text-[10px] font-bold tracking-widest text-[#0000FF]/40 uppercase mb-4 [writing-mode:vertical-lr] rotate-180">Node 04</div>
            <div className="text-5xl font-black text-[#0000FF] tracking-tighter mb-2">OS-INT</div>
            <div className="text-sm font-semibold text-[#0000FF]/60 uppercase">Open Source Intelligence</div>
          </div>

        </div>

      </div>
    </section>
  );
}
