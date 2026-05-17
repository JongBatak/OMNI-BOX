'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function LaserTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hotspotRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animasi cahaya (hotspot) yang naik turun secara perlahan dan elegan
    gsap.to(hotspotRef.current, {
      y: '120vh',
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut' // Smooth acceleration and deceleration
    });
  }, []);

  return (
    <div
      ref={containerRef}
      // Lebarkan container biar glow-nya gak kepotong, posisikan persis di tengah garis transisi
      className="absolute top-0 left-0 bottom-0 z-50 pointer-events-none flex items-center justify-center w-[300px] -translate-x-1/2"
    >

      {/* THE CORE EDGE: Garis super tipis (1px), memudar di ujung atas dan bawah */}
      <div className="relative w-[1px] h-full bg-gradient-to-b from-transparent via-white/40 to-transparent">

        {/* ========================================= */}
        {/* LUXURY GLOW LAYERS (No more cheap lasers) */}
        {/* ========================================= */}

        {/* Glow 1: Pendaran biru yang padat di dekat garis utama */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[30px] bg-[#0000FF] blur-[15px] opacity-40 mix-blend-screen" />

        {/* Glow 2: Aura biru/violet yang menyebar luas dan sangat tipis ke sekeliling */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[150px] bg-[#0000FF] blur-[60px] opacity-15 mix-blend-screen" />

        {/* ========================================= */}
        {/* THE REFRACTION HOTSPOT (The magical touch)  */}
        {/* ========================================= */}

        {/* Bias cahaya yang bergerak naik turun, seolah-olah ada lampu menyorot tepi layar */}
        <div
          ref={hotspotRef}
          className="absolute left-1/2 -translate-x-1/2 w-[2px] h-[25vh] top-[-10vh] mix-blend-screen"
          style={{
            // Gradien putih terang di tengah, memudar jadi biru di ujungnya
            background: 'linear-gradient(to bottom, transparent, rgba(0,0,255,0.5), #FFFFFF, rgba(0,0,255,0.5), transparent)',
            boxShadow: '0 0 15px #FFFFFF, 0 0 40px #0000FF',
          }}
        />

      </div>
    </div>
  );
} 