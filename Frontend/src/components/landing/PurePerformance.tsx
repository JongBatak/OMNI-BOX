'use client';

import React from 'react';
import LiquidTextReveal from './LiquidTextReveal';

export default function PurePerformance() {
  return (
    <div className="relative h-full w-full flex items-center justify-center pointer-events-none">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920" 
          alt="Pure Performance"
          className="w-full h-full object-cover opacity-30 mix-blend-screen"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80" />
      </div>

      {/* Decorative Background Accent */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
        <h1 className="font-accent text-[35vw] leading-none text-white select-none">
          02
        </h1>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 md:px-12 text-center flex flex-col items-center">
        <p className="font-sans text-omni-cyan tracking-[0.3em] text-xs md:text-sm uppercase mb-4 opacity-80">
          <LiquidTextReveal text="NATIVE COMPILATION AT THE EDGE" delay={0.2} />
        </p>
        
        <h2 className="font-heading font-extrabold text-[clamp(4rem,10vw,12rem)] leading-none tracking-tighter text-white mb-6 uppercase drop-shadow-[0_0_30px_rgba(0,240,255,0.2)]">
          <LiquidTextReveal text="PURE PERFORMANCE" delay={0.4} />
        </h2>
        
        <p className="font-detail italic text-xl md:text-3xl text-omni-silver max-w-3xl font-light">
          <LiquidTextReveal text="Built on WebGL for zero-latency interactions." delay={0.6} />
        </p>
      </div>
    </div>
  );
}
