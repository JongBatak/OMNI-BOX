'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';

type SplineSceneProps = {
  className?: string;
  onLoad?: () => void;
};

const SCENE_URL = 'https://prod.spline.design/hzhnN6d0CDq3rEpF/scene.splinecode';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 w-full h-full bg-transparent" />,
});

export default function SplineScene1({ className = '', onLoad }: SplineSceneProps) {
  const [isMounted, setIsMounted] = useState(false);
  const strictModeRef = useRef(false);

  // 1. Kita buat reference baru untuk menangkap elemen pembungkus Spline
  const scrollInterceptorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!strictModeRef.current) {
      strictModeRef.current = true;
      setIsMounted(true);
    }
    return () => {
      setIsMounted(false);
    };
  }, []);

  // 2. THE SCROLL FIX: Mencegat event scroll mouse sebelum dimakan oleh Spline
  useEffect(() => {
    const container = scrollInterceptorRef.current;
    if (!container || !isMounted) return;

    const handleWheel = (e: WheelEvent) => {
      // Kita biarkan interaksi klik/hover lewat, tapi kalau user nge-scroll (wheel):
      // Paksa browser untuk scroll halaman ke bawah/atas sesuai putaran mouse.
      window.scrollBy({
        top: e.deltaY,
        behavior: 'auto'
      });
    };

    // RAHASIANYA ADA DI { capture: true }
    // Ini memaksa browser menjalankan fungsi kita PERTAMA KALI dari luar ke dalam,
    // sebelum canvas Spline sempat berteriak "Stop, ini scroll buat gue!"
    container.addEventListener('wheel', handleWheel, { capture: true });

    return () => {
      container.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, [isMounted]);

  if (!isMounted) {
    return <div className="absolute inset-0 w-full h-full bg-transparent" />;
  }

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>

      {/* THE ULTIMATE CROPPING HACK + SCROLL INTERCEPTOR */}
      {/* Kita pasang ref-nya di sini biar dia menutupi seluruh area Spline */}
      <div
        ref={scrollInterceptorRef}
        className="absolute -top-[80px] -bottom-[80px] -left-[80px] -right-[80px] spline-watermark-hider"
      >
        <Spline
          scene={SCENE_URL}
          style={{ width: '100%', height: '100%', outline: 'none' }}
          onLoad={onLoad}
        />
      </div>

    </div>
  );
}