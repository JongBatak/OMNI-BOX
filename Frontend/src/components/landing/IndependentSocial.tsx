'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-[2rem] animate-pulse">
      <span className="text-[10px] font-bold tracking-[0.3em] text-black/30">LOADING ASSETS...</span>
    </div>
  ),
});

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function IndependentSocial() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(containerRef);

    gsap.fromTo(
      q('.reveal-element'),
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        },
      }
    );

    // Animasi Floating untuk panah "Click Me" dibikin sedikit lebih dramatis
    gsap.to(q('.float-arrow'), {
      y: -15,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

  }, { scope: containerRef });

  const FOLDER_SPLINE_URL = "https://prod.spline.design/eus0EBM0eISGcze6/scene.splinecode";

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-screen bg-white text-[#050505] flex flex-col justify-center px-[40px] md:px-[80px] lg:px-[120px] py-20 overflow-hidden relative"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10 h-full max-w-[1400px] mx-auto w-full">

        {/* ========================================= */}
        {/* KOLOM KIRI: TEKS & TIMELINE FITUR HIDUP   */}
        {/* ========================================= */}
        <div className="flex flex-col justify-center">

          <div className="reveal-element mb-8">
            <h2
              className="text-[12vw] md:text-[8vw] lg:text-[5vw] uppercase leading-[0.85] tracking-tighter"
              style={{ fontFamily: "'PP Editorial New', 'Playfair Display', serif" }}
            >
              <span className="block text-[#0000FF] italic pr-2">AN OPEN</span>
              <span className="block font-black font-sans text-[#050505]">NETWORK.</span>
            </h2>
          </div>

          <p className="reveal-element text-base md:text-lg lg:text-xl text-[#050505]/70 max-w-[500px] leading-relaxed font-medium">
            Beyond tracking data, OMNI provides a{' '}
            <span className="text-[#0000FF] font-bold drop-shadow-[0_0_12px_rgba(0,0,255,0.3)]">public timeline</span>.
            Connect with peers, comment on{' '}
            <span className="text-[#0000FF] font-bold drop-shadow-[0_0_12px_rgba(0,0,255,0.3)]">open threads</span>,
            and instantly like or share published assets from your ecosystem. A true hub for an{' '}
            <span className="text-[#0000FF] font-bold drop-shadow-[0_0_12px_rgba(0,0,255,0.3)]">interconnected community</span>.
          </p>

          <div className="mt-12 relative pl-6 border-l-2 border-black/10 flex flex-col gap-8">
            {[
              { title: 'HEART THE BEST', desc: 'Appreciate work at the click of a button.' },
              { title: 'JOIN THE THREAD', desc: 'Comment directly on published logs.' },
              { title: 'SEAMLESS SYNC', desc: 'Share files directly into the network.' }
            ].map((item, index) => (
              <div key={index} className="reveal-element group relative cursor-pointer">
                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-black/20 group-hover:border-[#0000FF] group-hover:bg-[#0000FF] group-hover:shadow-[0_0_12px_rgba(0,0,255,0.6)] transition-all duration-300 ease-out" />
                <div className="transform transition-transform duration-300 group-hover:translate-x-2">
                  <h3 className="font-black text-sm md:text-base tracking-widest uppercase text-[#050505] group-hover:text-[#0000FF] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-black/50 mt-1 font-medium max-w-[300px]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ========================================= */}
        {/* KOLOM KANAN: 3D SPLINE FOLDER AREA        */}
        {/* ========================================= */}
        <div className="reveal-element relative w-full h-[60vh] lg:h-[80vh] min-h-[500px] flex items-center justify-center group flex-col">

          <div className="relative w-full flex-grow overflow-hidden rounded-3xl z-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[#0000FF] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute -top-[80px] -bottom-[80px] -left-[80px] -right-[80px] spline-watermark-hider cursor-grab active:cursor-grabbing">
              <Spline
                scene={FOLDER_SPLINE_URL}
                style={{ width: '100%', height: '100%', outline: 'none', pointerEvents: 'auto' }}
              />
            </div>
          </div>

          {/* THE NEW PERFECT ELEGANT "CLICK ME" INDICATOR */}
          <div className="float-arrow z-30 flex items-center justify-center gap-2 pointer-events-none mt-6 w-full -translate-x-[85px]">

            <span
              className="text-[#0000FF] italic text-[14vw] md:text-[10vw] lg:text-[6.5vw] tracking-tight drop-shadow-[0_0_12px_rgba(0,0,255,0.3)] font-medium leading-none"
              style={{ fontFamily: "'PP Editorial New', 'Playfair Display', serif" }}
            >
              Click Me
            </span>

            {/* SVG Panah Melengkung: Dihitung secara matematis biar mendarat tepat 45 Derajat ke kiri atas */}
            <svg
              width="140"
              height="100"
              viewBox="0 0 140 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#0000FF] opacity-80 mt-4 ml-2"
            >
              {/* Cubic Bezier Path: 
                  Mulai di (10,90). 
                  Melengkung jauh ke kanan (130,90). 
                  Titik kontrol kedua di (80,70) untuk memaksa sudut kedatangan 45 derajat.
                  Berakhir di (30,20) dengan kemiringan tepat 45 derajat ke kiri atas. 
              */}
              <path d="M 10 90 C 130 90, 80 70, 30 20" />

              {/* Kepala panah (Arrowhead) ditarik lurus ke bawah & kanan, menghasilkan sudut tajam 45 derajat tepat di koordinat (30,20) */}
              <polyline points="30 35 30 20 45 20" />
            </svg>

          </div>

        </div>

      </div>
    </div>
  );
}