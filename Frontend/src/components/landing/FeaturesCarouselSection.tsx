'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplineScene2 from '@/components/spline/SplineScene2';

gsap.registerPlugin(ScrollTrigger);

const features = [
  'Supports 3D model file formats',
  'Has its own compiler',
  'Lightning Fast Synchronization',
  'Military-Grade Encryption',
  'Global Seamless Access',
];

export default function FeaturesCarouselSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(trackRef.current, {
        xPercent: -100 * (features.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${features.length * 520}`,
          scrub: 1,
          pin: true,
          snap: 1 / (features.length - 1),
          invalidateOnRefresh: true,
        },
      });

      gsap.from('.feature-card', {
        y: 36,
        opacity: 0,
        stagger: 0.16,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-white">
      <div className="absolute inset-0 -z-10 opacity-75">
        <SplineScene2 className="h-full w-full" />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-white/15 via-blue-100/45 to-white/75" />

      <div className="relative z-10 flex min-h-screen flex-col justify-center">
        <div className="container mx-auto px-6">
          <p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Core Experience
          </p>
          <h2 className="mx-auto mb-12 max-w-3xl text-center text-4xl font-black text-blue-950 md:text-5xl">
            Interactive Feature Carousel
          </h2>

          <div className="overflow-hidden">
            <div ref={trackRef} className="flex w-full">
              {features.map((feature) => (
                <article
                  key={feature}
                  className="feature-card mx-2 flex min-h-88 w-full shrink-0 flex-col rounded-3xl border border-blue-300/45 bg-white/65 p-8 backdrop-blur-md"
                >
                  <div className="mb-6 h-20 w-20 rounded-2xl border border-blue-300/45 bg-blue-50/80" />
                  <h3 className="text-2xl font-bold text-blue-900">{feature}</h3>
                  <p className="mt-4 max-w-md text-blue-800/80">
                    Built to keep your data fluid, secure, and available across every product workflow.
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
