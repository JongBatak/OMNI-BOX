'use client';

import { useState } from 'react';
import LoadingOverlay from './LoadingOverlay';
import MainMenu from './MainMenu';
import LiquidScrollEngine from './LiquidScrollEngine';

export type SplineLoadPhase = 'idle' | 'init' | 'ready';

export default function OmniBoxLanding() {
  const [splinePhase, setSplinePhase] = useState<SplineLoadPhase>('idle');
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <main
      className={`relative min-h-screen bg-white ${!loadingComplete ? 'pointer-events-none h-screen overflow-hidden' : 'pointer-events-auto'}`}
    >
      <MainMenu isLoaded={loadingComplete} />
      
      <LoadingOverlay 
        splinePhase={splinePhase}
        onInitSpline={() => setSplinePhase('ready')} // Auto-advance since HeroSection is absent
        onStartHero={() => setLoadingComplete(true)} 
      />

      <div className={`relative ${!loadingComplete ? 'opacity-0' : 'opacity-100 transition-opacity duration-700'}`}>
        {/* Advanced Liquid Scroll Engine */}
        <LiquidScrollEngine />
      </div>
    </main>
  );
}
