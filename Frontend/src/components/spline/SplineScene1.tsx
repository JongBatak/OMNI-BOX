'use client';

import dynamic from 'next/dynamic';

type SplineSceneProps = {
  className?: string;
  onLoad?: () => void;
};

const SCENE_URL = 'https://prod.spline.design/hzhnN6d0CDq3rEpF/scene.splinecode';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-white" />,
});

export default function SplineScene1({ className = 'h-full w-full', onLoad }: SplineSceneProps) {
  return (
    <div className={className}>
      <Spline scene={SCENE_URL} className="h-full w-full pointer-events-none" onLoad={onLoad} />
    </div>
  );
}
