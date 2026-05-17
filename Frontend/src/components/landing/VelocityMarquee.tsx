'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TextMaskTransition() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Refs layer
  const maskLayerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const animatedBgRef = useRef<HTMLDivElement>(null);
  
  // Refs untuk Memory Cards (Sekarang semua tersentralisasi)
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3TeamRef = useRef<HTMLDivElement>(null);
  
  // Refs untuk teks pendamping (Kiri Bawah)
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const textTeamOldRef = useRef<HTMLDivElement>(null);
  
  // Ref untuk teks transisi final (Tengah Raksasa)
  const textTeamNewRef = useRef<HTMLHeadingElement>(null);
  
  // Refs Fase Akhir
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const manifestoContentRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // ASET VISUAL
  const IMAGES = {
    hero: "./couple.jpg", 
    card1: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop", 
    card2: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop", 
    card3: "./teamwork.jpg", 
  };

  useGSAP(() => {
    // FIX PINNING BRUTAL: Jarak scroll 1500% agar user TERPAKSA nonton sampai habis.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=1500%', // Sangat panjang
        scrub: 1.5, 
        pin: true, 
        pinSpacing: true, // WAJIB ADA AGAR TIDAK BOCOR
        anticipatePin: 1,
      }
    });

    // =========================================
    // FASE 1: THE OMNIBOX MASK ZOOM & HERO
    // =========================================
    tl.to(maskLayerRef.current, {
      scale: 180, 
      autoAlpha: 0, 
      transformOrigin: "50% 50%", 
      ease: 'power3.inOut',
      duration: 2
    }, 0);

    tl.to(heroTextRef.current, { autoAlpha: 1, duration: 1, ease: 'power2.out' }, 2.1);
    tl.to({}, { duration: 1.5 }); // Tahan Hero Text

    // =========================================
    // FASE 2: ENTER THE PREMIUM ANIMATED BACKGROUND
    // =========================================
    tl.to(heroTextRef.current, { autoAlpha: 0, scale: 1.1, duration: 1 });
    // Munculkan background mesh + noise agar tidak "hampa"
    tl.to(animatedBgRef.current, { autoAlpha: 1, duration: 1.5, ease: 'power2.inOut' }, "-=0.5");

    // =========================================
    // FASE 3: SEQUENTIAL CENTER ZOOM-OUT CARDS
    // =========================================
    // Set awal: Semua kartu membesar di tengah
    gsap.set([card1Ref.current, card2Ref.current, card3TeamRef.current], {
      scale: 3, 
      autoAlpha: 0,
      rotate: 0
    });

    // --- SIKLUS CARD 1 ---
    tl.to(card1Ref.current, {
      scale: 1,
      autoAlpha: 1,
      rotate: -2,
      duration: 1.5,
      ease: 'power4.out'
    });
    tl.fromTo(text1Ref.current, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, "-=0.5");
    tl.to({}, { duration: 1.5 }); // Tahan
    tl.to([card1Ref.current, text1Ref.current], { scale: 0.8, autoAlpha: 0, duration: 1, ease: 'power2.in' });

    // --- SIKLUS CARD 2 ---
    tl.to(card2Ref.current, {
      scale: 1,
      autoAlpha: 1,
      rotate: 3,
      duration: 1.5,
      ease: 'power4.out'
    });
    tl.fromTo(text2Ref.current, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, "-=0.5");
    tl.to({}, { duration: 1.5 }); // Tahan
    tl.to([card2Ref.current, text2Ref.current], { scale: 0.8, autoAlpha: 0, duration: 1, ease: 'power2.in' });

    // --- SIKLUS CARD 3 (TEAMWORK) ---
    tl.to(card3TeamRef.current, {
      scale: 1,
      autoAlpha: 1,
      rotate: -1,
      duration: 1.5,
      ease: 'power4.out'
    });
    tl.fromTo(textTeamOldRef.current, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, "-=0.5");
    tl.to({}, { duration: 1.5 }); // Tahan formasi awal Card 3

    // =========================================
    // FASE 4: THE TEAMWORK FULLSCREEN EXPANSION
    // =========================================
    // Buang teks kecilnya
    tl.to(textTeamOldRef.current, { autoAlpha: 0, duration: 0.5 });
    
    // Card 3 meledak menjadi Fullscreen menutupi layar
    tl.to(card3TeamRef.current, {
      width: '100vw',
      height: '100vh',
      maxWidth: 'none',
      borderRadius: '0px',
      rotate: 0,
      duration: 2,
      ease: 'power3.inOut'
    }, "-=0.2");

    // Teks Raksasa "THAT'S WHY WE BUILT" Muncul di Tengah
    tl.fromTo(textTeamNewRef.current, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 1.5, ease: 'power3.out' }, "-=0.5");
    tl.to({}, { duration: 2 }); // Tahan Epik Moment Ini

    // =========================================
    // FASE 5: THE CINEMATIC BLACKOUT & MANIFESTO
    // =========================================
    tl.to(textTeamNewRef.current, { autoAlpha: 0, duration: 0.5 });
    tl.fromTo(darkOverlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 2, ease: 'power2.inOut' }, "-=0.2");

    tl.fromTo(manifestoContentRef.current, 
      { autoAlpha: 0, scale: 0.95 }, 
      { autoAlpha: 1, scale: 1, duration: 2, ease: 'power3.out' }
    );

  }, { scope: containerRef });

  // CSS Style Anti-Error TypeScript untuk efek Kertas Robek
  const tornPaperMaskStyle: React.CSSProperties = {
    maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 70%, transparent 95%), radial-gradient(ellipse 20% 20% at 0% 0%, transparent 80%, black 100%), radial-gradient(ellipse 20% 20% at 100% 0%, transparent 80%, black 100%), radial-gradient(ellipse 20% 20% at 100% 100%, transparent 80%, black 100%), radial-gradient(ellipse 20% 20% at 0% 100%, transparent 80%, black 100%)',
    WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 70%, transparent 95%), radial-gradient(ellipse 20% 20% at 0% 0%, transparent 80%, black 100%), radial-gradient(ellipse 20% 20% at 100% 0%, transparent 80%, black 100%), radial-gradient(ellipse 20% 20% at 100% 100%, transparent 80%, black 100%), radial-gradient(ellipse 20% 20% at 0% 100%, transparent 80%, black 100%)',
    maskComposite: 'source-over' as React.CSSProperties['maskComposite'], 
    WebkitMaskComposite: 'source-over' as string,
  };

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-white overflow-hidden">
      
      {/* ========================================================= */}
      {/* Z-INDEX 0: FULLSCREEN HERO BACKGROUND                     */}
      {/* ========================================================= */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center origin-center z-0"
        style={{ backgroundImage: `url("${IMAGES.hero}")` }}
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <h1 
          ref={heroTextRef}
          className="invisible text-[7vw] md:text-[4.5vw] text-white uppercase font-black text-center leading-[1.1] tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] max-w-[85vw]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Save your priceless <br/>memories in any format
        </h1>
      </div>


      {/* ========================================================= */}
      {/* Z-INDEX 20: PREMIUM ANIMATED MESH & NOISE BACKGROUND      */}
      {/* Ini menggantikan background putih mati menjadi kelas dunia */}
      {/* ========================================================= */}
      <div 
        ref={animatedBgRef}
        className="invisible absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
      >
        {/* Layer 1: Solid Base */}
        <div className="absolute inset-0 bg-[#FAFAFA]" />
        
        {/* Layer 2: Moving Mesh Gradient Blobs (CSS murni, sangat ringan) */}
        <div className="absolute inset-0 opacity-40 mix-blend-multiply blur-[80px]">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-200 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
        </div>

        {/* Layer 3: Film Grain / Noise Overlay (Memberikan tekstur premium) */}
        <div 
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>


      {/* ========================================================= */}
      {/* Z-INDEX 30: THE CENTER ZOOM-OUT TORN PAPER CARDS          */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
        
        {/* CARD 1 */}
        <div 
          ref={card1Ref}
          className="invisible absolute w-[80vw] md:w-[60vw] max-w-[800px] aspect-video bg-gray-200 shadow-[0_30px_80px_rgba(0,0,0,0.15)] flex-shrink-0"
          style={{ backgroundImage: `url("${IMAGES.card1}")`, backgroundSize: 'cover', backgroundPosition: 'center', ...tornPaperMaskStyle } as React.CSSProperties}
        />
        <div ref={text1Ref} className="invisible absolute bottom-[10vh] left-[5vw] md:left-[10vw] max-w-[60vw]">
          <p className="text-xl md:text-3xl font-black uppercase tracking-widest text-[#050505] drop-shadow-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Share your loving memories
          </p>
        </div>

        {/* CARD 2 */}
        <div 
          ref={card2Ref}
          className="invisible absolute w-[80vw] md:w-[60vw] max-w-[800px] aspect-video bg-gray-200 shadow-[0_30px_80px_rgba(0,0,0,0.15)] flex-shrink-0"
          style={{ backgroundImage: `url("${IMAGES.card2}")`, backgroundSize: 'cover', backgroundPosition: 'center', ...tornPaperMaskStyle } as React.CSSProperties}
        />
        <div ref={text2Ref} className="invisible absolute bottom-[10vh] left-[5vw] md:left-[10vw] max-w-[60vw]">
          <p className="text-xl md:text-3xl font-bold uppercase tracking-widest text-[#0000FF] italic drop-shadow-lg" style={{ fontFamily: "'PP Editorial New', serif" }}>
            Capture the subtle moments
          </p>
        </div>

        {/* CARD 3 (TEAMWORK - The one that goes fullscreen) */}
        <div 
          ref={card3TeamRef}
          className="invisible absolute w-[80vw] md:w-[60vw] max-w-[800px] aspect-video bg-gray-200 shadow-[0_30px_80px_rgba(0,0,0,0.15)] flex-shrink-0 flex items-center justify-center"
          style={{ backgroundImage: `url("${IMAGES.card3}")`, backgroundSize: 'cover', backgroundPosition: 'center', ...tornPaperMaskStyle } as React.CSSProperties}
        />
        <div ref={textTeamOldRef} className="invisible absolute bottom-[10vh] left-[5vw] md:left-[10vw] max-w-[60vw]">
          <p className="text-xl md:text-3xl font-black uppercase tracking-widest text-[#050505] drop-shadow-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Show your teamwork and love
          </p>
        </div>

        {/* TEKS FINAL CARD 3 (HANYA MUNCUL SAAT FULLSCREEN) */}
        <h1
          ref={textTeamNewRef}
          className="invisible absolute z-50 text-[7vw] md:text-[5vw] font-black uppercase tracking-tight text-white text-center drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] whitespace-nowrap"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          That&apos;s why we built—
        </h1>

      </div>


      {/* ========================================================= */}
      {/* Z-INDEX 50: DARK OVERLAY & MANIFESTO                      */}
      {/* ========================================================= */}
      <div ref={darkOverlayRef} className="invisible absolute inset-0 bg-[#050505] z-50 pointer-events-none" />

      <div 
        ref={manifestoContentRef}
        className="invisible absolute inset-0 z-[60] flex flex-col items-center justify-center text-white text-center gap-6 pointer-events-auto"
      >
        <h2 className="text-[8vw] md:text-[6vw] font-black tracking-tight flex items-center justify-center gap-x-4 uppercase select-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <span>OMNI</span>
          <span className="text-white/20 font-light">|</span>
          <span className="flex items-center gap-x-4">
            B
            <span onClick={() => router.push('/manifesto')} className="inline-block cursor-pointer hover:scale-110 transition-transform duration-300 group relative">
              <span className="absolute inset-0 bg-[#0000FF] rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity" />
              <svg width="75" height="75" viewBox="0 0 100 100" className="animate-spin text-[#0000FF] relative z-10" style={{ animationDuration: '9s' }}>
                <g stroke="currentColor" strokeWidth="6" strokeLinejoin="round" fill="none">
                  <polygon points="50,15 82,34 82,66 50,85 18,66 18,34" />
                  <line x1="50" y1="15" x2="50" y2="50" /><line x1="82" y1="66" x2="50" y2="50" /><line x1="18" y1="66" x2="50" y2="50" />
                  <line x1="82" y1="34" x2="50" y2="50" /><line x1="18" y1="34" x2="50" y2="50" /><line x1="50" y1="85" x2="50" y2="50" />
                </g>
              </svg>
            </span>
            X
          </span>
        </h2>
        <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-white/40 font-bold animate-pulse">Click the core node to expand</p>
      </div>


      {/* ========================================================= */}
      {/* Z-INDEX 70: THE OMNIBOX MASK (PALING DEPAN DI AWAL)       */}
      {/* ========================================================= */}
      <div ref={maskLayerRef} className="absolute inset-0 z-[70] flex items-center justify-center pointer-events-none origin-center">
        <svg viewBox="0 0 1000 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="omniFormatMask">
              <rect width="100%" height="100%" fill="white" />
              <text x="50%" y="180" textAnchor="middle" fill="black" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '38px', letterSpacing: '0.25em' }}>YOUR OMNI-FORMAT</text>
              <g stroke="black" strokeWidth="14" strokeLinejoin="round" strokeLinecap="round" fill="none">
                <polygon points="500,260 620,330 620,470 500,540 380,470 380,330" />
                <line x1="500" y1="260" x2="500" y2="400" />
                <line x1="620" y1="470" x2="500" y2="400" />
                <line x1="380" y1="470" x2="500" y2="400" />
                <line x1="620" y1="330" x2="500" y2="400" />
                <line x1="380" y1="330" x2="500" y2="400" />
                <line x1="500" y1="540" x2="500" y2="400" />
              </g>
              <circle cx="500" cy="400" r="25" fill="black" />
              <text x="50%" y="620" textAnchor="middle" fill="black" style={{ fontFamily: "'PP Editorial New', serif", fontSize: '110px', letterSpacing: '-0.02em' }}>GALLERY</text>
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="#FFFFFF" mask="url(#omniFormatMask)" />
        </svg>
      </div>

    </section>
  );
}