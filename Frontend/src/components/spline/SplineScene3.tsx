'use client';

import dynamic from 'next/dynamic';

type SplineSceneProps = {
  className?: string;
};

const SCENE_URL = 'https://prod.spline.design/FuPCOXidhZVDPBWM/scene.splinecode';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-white/5" />,
});

export default function SplineScene3({ className = 'h-full w-full' }: SplineSceneProps) {
  return (
    <div className={className}>
      <Spline scene={SCENE_URL} className="h-full w-full" />
    </div>
  );
}
