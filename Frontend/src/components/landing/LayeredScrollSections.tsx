'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import LiquidTextReveal from './LiquidTextReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const mockSections = [
  {
    id: 1,
    accent: "01",
    title: "BEYOND STORAGE",
    detail: "Experience the next evolution of cloud infrastructure.",
    subtitle: "A NEW DIMENSION OF DIGITAL OWNERSHIP",
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=1920",
    color: "bg-[#010310]"
  },
  {
    id: 2,
    accent: "02",
    title: "PURE PERFORMANCE",
    detail: "Built on WebGL for zero-latency interactions.",
    subtitle: "NATIVE COMPILATION AT THE EDGE",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920",
    color: "bg-[#0b1a38]"
  },
  {
    id: 3,
    accent: "03",
    title: "GLOBAL NETWORK",
    detail: "Your data, distributed safely across the globe.",
    subtitle: "DECENTRALIZED ARCHITECTURE",
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=1920",
    color: "bg-[#13141a]"
  }
];

export default function LayeredScrollSections() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const panels = gsap.utils.toArray<HTMLElement>('.parallax-panel');
    
    panels.forEach((panel, i) => {
      // Pin all panels for the native curtain reveal
      ScrollTrigger.create({
        trigger: panel,
        start: 'top top',
        pin: true, 
        pinSpacing: false,
      });

      // Subtle parallax on the background image
      const img = panel.querySelector('.parallax-bg');
      if (img) {
        gsap.fromTo(img, 
          { yPercent: 0 },
          {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            }
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full">
      {mockSections.map((section, index) => (
        <section 
          key={section.id}
          className={`parallax-panel relative h-screen w-full overflow-hidden flex items-center justify-center ${section.color}`}
          style={{ zIndex: index + 10 }}
        >
          {/* Parallax Background */}
          <div className="absolute inset-0 w-full h-[115%] -top-[15%]">
            <img 
              src={section.image} 
              alt={section.title}
              className="parallax-bg w-full h-full object-cover opacity-40 mix-blend-screen"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/80" />
          </div>

          {/* Decorative Background Accent */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <h1 className="font-accent text-[30vw] leading-none text-white select-none">
              {section.accent}
            </h1>
          </div>

          {/* Content */}
          <div className="relative z-20 container mx-auto px-6 md:px-12 text-center flex flex-col items-center">
            <p className="font-sans text-omni-cyan tracking-[0.3em] text-xs md:text-sm uppercase mb-4 opacity-80">
              <LiquidTextReveal text={section.subtitle} delay={0.2} />
            </p>
            
            <h2 className="font-heading font-extrabold text-5xl md:text-8xl lg:text-[10rem] leading-none tracking-tighter text-white mb-6 uppercase drop-shadow-[0_0_30px_rgba(0,240,255,0.2)]">
              <LiquidTextReveal text={section.title} delay={0.4} />
            </h2>
            
            <p className="font-detail italic text-xl md:text-3xl text-omni-silver max-w-3xl font-light">
              <LiquidTextReveal text={section.detail} delay={0.6} />
            </p>
          </div>
        </section>
      ))}
    </div>
  );
}
