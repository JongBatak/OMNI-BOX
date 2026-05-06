'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const cards = [
  { title: 'INTERACTIVE 3D VIEW', image: 'https://images.unsplash.com/photo-1542382122-731470ce224a?auto=format&fit=crop&q=80&w=800' },
  { title: 'SEMANTIC INDEXING', image: 'https://images.unsplash.com/photo-1518712918804-b21703ce53ff?auto=format&fit=crop&q=80&w=800' },
  { title: 'REAL-TIME METRICS', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' },
  { title: 'NEURAL ROUTING', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800' },
  { title: 'GLOBAL SYNC', image: 'https://images.unsplash.com/photo-1550537687-c9a0c270ba39?auto=format&fit=crop&q=80&w=800' },
];

// Gandakan 4x agar loop sempurna dan tidak terpotong
const loopCards = [...cards, ...cards, ...cards, ...cards];

const tickerItems = [
  "✦ FAST SYNC", "✦ 3D SUPPORT", "✦ NEURAL ROUTING", "✦ SECURE ENCRYPTION", "✦ GLOBAL ACCESS"
];
const loopTicker = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

export default function VelocityMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const topTl = useRef<gsap.core.Timeline | null>(null);
  const bottomTl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    const topInner = document.querySelector('.marquee-top-inner') as HTMLElement;
    const bottomInner = document.querySelector('.marquee-bottom-inner') as HTMLElement;

    // 1. BASE ANIMATION: Sangat pelan saat tidak di-scroll
    topTl.current = gsap.timeline({ repeat: -1 })
      .fromTo(topInner, 
        { xPercent: 0 }, 
        { xPercent: -25, ease: 'none', duration: 45, force3D: true }
      );

    bottomTl.current = gsap.timeline({ repeat: -1 })
      .fromTo(bottomInner, 
        { xPercent: -25 }, 
        { xPercent: 0, ease: 'none', duration: 45, force3D: true }
      );

    // 2. THE AGENCY VELOCITY ENGINE (Dual Tween Overwrite)
    const proxy = { speed: 1 };

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        let velocity = self.getVelocity();
        let direction = self.direction; // 1 (bawah), -1 (atas)

        // Sensitivitas dinaikkan (dibagi 150) agar lebih responsif terhadap scroll kecil
        let targetSpeed = 1 + Math.abs(velocity / 150);
        
        // Limit dinaikkan ke 6x agar bisa melesat kencang layaknya WGB
        targetSpeed = gsap.utils.clamp(1, 10, targetSpeed);

        // A. Tween Akselerasi Instan (Overwrite = true langsung membunuh pengereman)
        gsap.to(proxy, {
          speed: targetSpeed * direction,
          duration: 0.15, // Sangat cepat merespons jari
          ease: "power3.out",
          overwrite: true, 
          onUpdate: () => {
            topTl.current?.timeScale(proxy.speed);
            bottomTl.current?.timeScale(proxy.speed);
          }
        });

        // B. Tween Pengereman Otomatis (Dengan Delay)
        // Ini rahasianya: Tween ini akan terus di-reset oleh Tween A selama user masih scroll.
        // Begitu user berhenti scroll selama 0.1 detik, pengereman halus ini baru berjalan.
        gsap.to(proxy, {
          speed: 1, // Kembali ke kecepatan normal maju
          duration: 1.2, // Pengereman sangat panjang dan elegan
          ease: "expo.out", // Easing termahal untuk efek licin
          delay: 0.1, 
          overwrite: "auto",
          onUpdate: () => {
            topTl.current?.timeScale(proxy.speed);
            bottomTl.current?.timeScale(proxy.speed);
          }
        });
      }
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full bg-[#f8f9fa] overflow-hidden flex flex-col z-20 border-t border-gray-200">
      
      {/* --- MARQUEE ATAS (FEATURE CARDS) --- */}
      <div className="w-full overflow-hidden flex relative border-b border-gray-200">
        
        {/* Efek Fade Out di Ujung Layar */}
        <div className="absolute inset-y-0 left-0 w-[80px] md:w-[150px] z-10 pointer-events-none bg-gradient-to-r from-[#f8f9fa] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[80px] md:w-[150px] z-10 pointer-events-none bg-gradient-to-l from-[#f8f9fa] to-transparent" />

        <div className="marquee-top-inner flex flex-nowrap w-max will-change-transform">
          {loopCards.map((card, idx) => (
            // Disesuaikan ukurannya agar lebih massive dan tegas
            <div key={idx} className="w-[80vw] sm:w-[350px] md:w-[450px] flex-shrink-0 flex flex-col border-r border-gray-200 bg-white group cursor-pointer">
              <div className="h-[280px] md:h-[380px] w-full bg-gray-100 overflow-hidden relative">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="absolute inset-0 w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                />
              </div>
              {/* Box Biru */}
              <div className="h-[70px] md:h-[90px] w-full bg-[#0000FF] flex items-center justify-center transition-colors duration-500">
                <span className="text-white font-bold tracking-[0.15em] text-xs md:text-sm uppercase">
                  {card.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MARQUEE BAWAH (RUNNING TEXT TICKER) --- */}
      <div className="relative w-full overflow-hidden h-[90px] md:h-[130px] bg-[#0000FF] flex items-center">
        
        <div 
          className="marquee-bottom-inner flex flex-nowrap w-max items-center h-full relative z-10 will-change-transform"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)'
          }}
        >
          {loopTicker.map((text, i) => (
            <span 
              key={i} 
              className="text-white font-sans font-black text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter mx-8 md:mx-12 whitespace-nowrap opacity-95"
            >
              {text}
            </span>
          ))}
        </div>
        
      </div>

    </section>
  );
}