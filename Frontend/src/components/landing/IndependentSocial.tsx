'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplineScene2 from '../spline/SplineScene2';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function IndependentSocial() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(sectionRef);

    // Architectural SVG lines
    gsap.fromTo(q('.independent-svg-line'),
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

    // Text stagger reveal
    gsap.fromTo(q('.content-reveal'),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        }
      }
    );

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="panel relative min-h-screen w-full bg-[#FFFFFF] border-t border-[#0000FF]/10 overflow-hidden z-20 flex items-center py-16 md:py-20">
      
      {/* Background Spline Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-x-0 -top-[10%] -bottom-[10%] scale-105 will-change-transform opacity-70 right-[-20%] md:right-[-10%] hidden md:block">
          <SplineScene2 className="h-full w-full ml-auto md:w-3/4 lg:w-2/3" />
        </div>
        <div className="absolute inset-x-0 -top-[10%] -bottom-[10%] scale-105 will-change-transform opacity-40 block md:hidden">
          <SplineScene2 className="h-full w-full" />
        </div>
      </div>

      {/* Largo Studio SVG Motifs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
        <svg className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="10%" y1="0" x2="10%" y2="100%" stroke="#0000FF" strokeWidth="1" pathLength="100" className="independent-svg-line" fill="none" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#0000FF" strokeWidth="1" pathLength="100" className="independent-svg-line" fill="none" strokeDasharray="4 4" />
          <line x1="90%" y1="0" x2="90%" y2="100%" stroke="#0000FF" strokeWidth="1" pathLength="100" className="independent-svg-line" fill="none" />
          
          <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#0000FF" strokeWidth="1" pathLength="100" className="independent-svg-line" fill="none" />
          <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#0000FF" strokeWidth="1" pathLength="100" className="independent-svg-line" fill="none" />
        </svg>

        {/* Reticle crosses */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path d="M 9% 20% L 11% 20% M 10% 18% L 10% 22%" stroke="#0000FF" strokeWidth="1.5" pathLength="100" className="independent-svg-line" fill="none" />
          <path d="M 89% 20% L 91% 20% M 90% 18% L 90% 22%" stroke="#0000FF" strokeWidth="1.5" pathLength="100" className="independent-svg-line" fill="none" />
          <path d="M 9% 80% L 11% 80% M 10% 78% L 10% 82%" stroke="#0000FF" strokeWidth="1.5" pathLength="100" className="independent-svg-line" fill="none" />
          <path d="M 89% 80% L 91% 80% M 90% 78% L 90% 82%" stroke="#0000FF" strokeWidth="1.5" pathLength="100" className="independent-svg-line" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-24 flex flex-col md:flex-row items-center gap-16">
        
        {/* Left Content */}
        <div className="w-full md:w-1/2">
          <h2 className="content-reveal font-['Inter',sans-serif] text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#0000FF] uppercase mb-8 leading-[0.9]">
            An Open <br/> Network.
          </h2>
          <p className="content-reveal text-[#0000FF]/60 text-xl md:text-2xl leading-relaxed max-w-lg mb-12">
            Beyond tracking data, OMNI provides a public timeline. Connect with peers, comment on open threads, and instantly like or share published assets from your ecosystem. A true hub for an interconnected dev community.
          </p>

          <div className="flex flex-col gap-8">
            <div className="content-reveal flex items-center gap-6">
              <div className="w-16 h-16 flex shrink-0 items-center justify-center border border-[#0000FF]/30 rounded-full bg-[#0000FF]/5 text-[#0000FF]">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[#0000FF] uppercase tracking-wide text-lg">Heart the best</h3>
                <p className="text-[#0000FF]/60 text-base mt-1">Appreciate work at the click of a button.</p>
              </div>
            </div>

            <div className="content-reveal flex items-center gap-6">
              <div className="w-16 h-16 flex shrink-0 items-center justify-center border border-[#0000FF]/30 rounded-full bg-[#0000FF]/5 text-[#0000FF]">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[#0000FF] uppercase tracking-wide text-lg">Join the thread</h3>
                <p className="text-[#0000FF]/60 text-base mt-1">Comment directly on published logs.</p>
              </div>
            </div>

            <div className="content-reveal flex items-center gap-6">
              <div className="w-16 h-16 flex shrink-0 items-center justify-center border border-[#0000FF]/30 rounded-full bg-[#0000FF]/5 text-[#0000FF]">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[#0000FF] uppercase tracking-wide text-lg">Seamless Sync</h3>
                <p className="text-[#0000FF]/60 text-base mt-1">Share files directly into the network.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Spline Scene - Removed since it's now in the background */}
      </div>

    </section>
  );
}
