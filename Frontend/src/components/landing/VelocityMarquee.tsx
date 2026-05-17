'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TextMaskTransition() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Refs untuk urutan layer
  const maskLayerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const whiteGradientRef = useRef<HTMLDivElement>(null);
  
  // Refs untuk Memory Cards (Torn Paper)
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3TeamRef = useRef<HTMLDivElement>(null);
  
  // Refs untuk teks di Card 3 (Transisi)
  const textTeamOldRef = useRef<HTMLHeadingElement>(null);
  const textTeamNewRef = useRef<HTMLHeadingElement>(null);
  
  // Refs untuk Fase Akhir
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const manifestoContentRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // ASET VISUAL
  const IMAGES = {
    hero: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop", // Fullscreen Gallery
    card1: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop", // Camera
    card2: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop", // Interaction
    card3: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop", // Teamwork (The one that goes fullscreen)
  };

  useGSAP(() => {
    // Timeline utama yang mengunci layar (pin: true)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=800%', // Scroll track sangat panjang untuk menampung semua seksi
        scrub: 1.5, 
        pin: true, 
      }
    });

    // =========================================
    // FASE 1: THE OMNIBOX MASK ZOOM & HERO REVEAL
    // =========================================
    tl.to(maskLayerRef.current, {
      scale: 180, 
      autoAlpha: 0, 
      transformOrigin: "50% 50%", 
      ease: 'power3.inOut',
      duration: 2
    }, 0);

    // Tahan bentar biar user baca teks Hero di background
    tl.to({}, { duration: 0.8 });

    // =========================================
    // FASE 2: ENTER THE MEMORY SECTION (White Gradient)
    // =========================================
    tl.to(heroTextRef.current, { opacity: 0, y: -30, duration: 1 }, "+=0");
    tl.to(whiteGradientRef.current, { opacity: 1, duration: 1.5, ease: 'power2.inOut' }, "-=0.5");

    // =========================================
    // FASE 3: STAGGERED TORN PAPER CARDS REVEAL
    // =========================================
    tl.fromTo(card1Ref.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }, "+=0.2");
    tl.fromTo(card2Ref.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }, "-=0.6");
    tl.fromTo(card3TeamRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }, "-=0.6");

    // Tahan bentar biar user nikmatin kolase foto
    tl.to({}, { duration: 1.5 });

    // =========================================
    // FASE 4: THE TEAMWORK FULLSCREEN EXPANSION
    // =========================================
    // Hilangkan Card 1 & 2 ke atas
    tl.to([card1Ref.current, card2Ref.current], { y: -100, opacity: 0, duration: 1, ease: 'power2.in' });
    
    // Transisi Card 3 menjadi Fullscreen
    tl.to(card3TeamRef.current, {
      width: '100vw',
      height: '100vh',
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      rotate: 0,
      borderRadius: '0px',
      margin: 0,
      padding: 0,
      transform: 'none',
      duration: 1.8,
      ease: 'power3.inOut'
    }, "-=0.5");

    // Ganti kalimat di bawah gambar Teamwork
    tl.to(textTeamOldRef.current, { opacity: 0, duration: 0.5 }, "-=1.5");
    tl.fromTo(textTeamNewRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "-=0.5");

    // Tahan gambar Teamwork raksasa sejenak
    tl.to({}, { duration: 1.2 });

    // =========================================
    // FASE 5: THE CINEMATIC BLACKOUT & MANIFESTO
    // =========================================
    tl.to(textTeamNewRef.current, { opacity: 0, duration: 0.5 });
    tl.fromTo(darkOverlayRef.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: 'power2.inOut' }, "-=0.2");

    tl.fromTo(manifestoContentRef.current, 
      { opacity: 0, scale: 0.95 }, 
      { opacity: 1, scale: 1, duration: 2, ease: 'power3.out' }
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
    <section 
      ref={containerRef} 
      className="relative h-screen w-full bg-white overflow-hidden"
    >
      
      {/* ========================================================= */}
      {/* Z-INDEX 0: FULLSCREEN HERO BACKGROUND                     */}
      {/* ========================================================= */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center origin-center z-0"
        style={{ backgroundImage: `url("${IMAGES.hero}")` }}
      />

      {/* Hero Text yang langsung terlihat di atas gambar saat mask terbuka */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <h1 
          ref={heroTextRef}
          className="text-[8vw] md:text-[5vw] text-white uppercase font-black text-center leading-[0.9] tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] max-w-[80vw]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Save your priceless <br/>memories in any format
        </h1>
      </div>


      {/* ========================================================= */}
      {/* Z-INDEX 20: WHITE GRADIENT OVERLAY (Untuk seksi "Memory") */}
      {/* ========================================================= */}
      <div 
        ref={whiteGradientRef}
        className="absolute inset-0 z-20 opacity-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), #FFFFFF 40%)' }}
      />


      {/* ========================================================= */}
      {/* Z-INDEX 30: THE TORN PAPER CARDS & TEXTS                  */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-30 pointer-events-none px-[40px] md:px-[120px] pt-32 pb-16 flex flex-col justify-between">
        
        {/* ROW ATAS: Kiri (Card 1) & Kanan (Card 2) */}
        <div className="w-full flex justify-between items-start gap-12 relative">
          
          {/* Card 1 Kiri */}
          <div ref={card1Ref} className="w-[40%] max-w-[400px] flex flex-col gap-4">
            <div 
              className="w-full aspect-[16/10] bg-gray-200 shadow-2xl rotate-3"
              style={{ backgroundImage: `url("${IMAGES.card1}")`, backgroundSize: 'cover', backgroundPosition: 'center', ...tornPaperMaskStyle } as any}
            />
            <p className="text-sm md:text-base font-bold uppercase tracking-widest text-[#050505] text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Share your loving memories
            </p>
          </div>

          {/* Card 2 Kanan */}
          <div ref={card2Ref} className="w-[40%] max-w-[400px] flex flex-col gap-4 mt-20">
            <div 
              className="w-full aspect-[4/3] bg-gray-200 shadow-2xl -rotate-2"
              style={{ backgroundImage: `url("${IMAGES.card2}")`, backgroundSize: 'cover', backgroundPosition: 'center', ...tornPaperMaskStyle } as any}
            />
            <p className="text-sm md:text-base font-bold uppercase tracking-widest text-[#0000FF] italic text-center" style={{ fontFamily: "'PP Editorial New', serif" }}>
              Capture the subtle moments
            </p>
          </div>
        </div>

        {/* ROW BAWAH: Card 3 Teamwork (Tengah Bawah) */}
        {/* Note: Elemen ini di-set absolute di bawah agar gampang dianimasikan jadi fullscreen */}
      </div>

      {/* Card 3 (Teamwork) dibikin terpisah dari flow grid agar mudah expand ke 100vw 100vh */}
      <div 
        ref={card3TeamRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[60%] max-w-[600px] aspect-[21/9] z-40 flex flex-col items-center justify-center pointer-events-none"
      >
        <div 
          className="absolute inset-0 bg-gray-200 shadow-[0_40px_80px_rgba(0,0,0,0.2)] -rotate-1"
          style={{ backgroundImage: `url("${IMAGES.card3}")`, backgroundSize: 'cover', backgroundPosition: 'center', ...tornPaperMaskStyle } as any}
        />
        
        {/* Teks Original (Awal) */}
        <h3 
          ref={textTeamOldRef}
          className="absolute -bottom-12 text-sm md:text-lg font-bold uppercase tracking-widest text-black/80 text-center drop-shadow-md whitespace-nowrap"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Show your teamwork and love
        </h3>

        {/* Teks Baru (Muncul pas fullscreen) */}
        <h1
          ref={textTeamNewRef}
          className="absolute z-50 text-[6vw] md:text-[4vw] font-black uppercase tracking-tight text-white text-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] whitespace-nowrap"
          style={{ fontFamily: "'Space Grotesk', sans-serif", opacity: 0 }}
        >
          The same way we built—
        </h1>
      </div>


      {/* ========================================================= */}
      {/* Z-INDEX 50: DARK OVERLAY & MANIFESTO                      */}
      {/* ========================================================= */}
      <div ref={darkOverlayRef} className="absolute inset-0 bg-[#050505] opacity-0 z-50 pointer-events-none" />

      <div 
        ref={manifestoContentRef}
        className="absolute opacity-0 inset-0 z-[60] flex flex-col items-center justify-center text-white text-center gap-6 pointer-events-auto"
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
              {/* OMNIBOX TEXT MASK */}
              <text x="50%" y="180" textAnchor="middle" fill="black" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '50px', letterSpacing: '0.25em' }}>OMNIBOX</text>
              {/* LOGO MASK */}
              <g stroke="black" strokeWidth="14" strokeLinejoin="round" strokeLinecap="round" fill="none">
                {/* Outer Hexagon / Isometrik Kotak Frame */}
                <polygon points="500,260 620,330 620,470 500,540 380,470 380,330" />
                
                {/* Garis Struktur Interior Pembentuk Kubus 3D */}
                <line x1="500" y1="260" x2="500" y2="400" />
                <line x1="620" y1="470" x2="500" y2="400" />
                <line x1="380" y1="470" x2="500" y2="400" />
                
                {/* Jaringan facet tambahan untuk mempertegas siluet wireframe premium */}
                <line x1="620" y1="330" x2="500" y2="400" />
                <line x1="380" y1="330" x2="500" y2="400" />
                <line x1="500" y1="540" x2="500" y2="400" />
              </g>
              <circle cx="500" cy="400" r="25" fill="black" />
              {/* FORMATS TEXT MASK */}
              <text x="50%" y="620" textAnchor="middle" fill="black" style={{ fontFamily: "'PP Editorial New', serif", fontSize: '110px', letterSpacing: '-0.02em' }}>FORMATS</text>
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="#FFFFFF" mask="url(#omniFormatMask)" />
        </svg>
      </div>

    </section>
  );
}