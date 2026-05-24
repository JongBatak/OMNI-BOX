'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';
import { WebGLErrorBoundary } from '../WebGLErrorBoundary';

type SplineSceneProps = {
  className?: string;
};

// Leave this empty and paste your Spline URL later.
const SCENE_URL = 'https://prod.spline.design/eus0EBM0eISGcze6/scene.splinecode';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#0000FF]/5" />,
});

export default function SplineScene2({ className = 'h-full w-full' }: SplineSceneProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <div className="relative h-full w-full">
        {!isMobile && isVisible && SCENE_URL ? (
          <WebGLErrorBoundary>
            <Spline scene={SCENE_URL} className="h-full w-full" />
          </WebGLErrorBoundary>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-4 text-center text-xs font-medium tracking-[0.12em] text-white/85">
            SPLINE SCENE 2 PLACEHOLDER
          </div>
        )}
      </div>

      <style suppressHydrationWarning>{`
        .spline-watermark,
        .spline-watermark-container,
        .spline-watermark-wrapper,
        a[href*="spline.design"],
        a[href*="spline"] {
          opacity: 0 !important;
          pointer-events: none !important;
          visibility: hidden !important;
          display: none !important;
        }
      `}</style>
    </div>
  );
}
