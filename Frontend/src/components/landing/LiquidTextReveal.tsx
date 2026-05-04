'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface LiquidTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function LiquidTextReveal({ text, className = "", delay = 0 }: LiquidTextRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  
  useGSAP(() => {
    if (!containerRef.current) return;
    
    const words = gsap.utils.toArray('.reveal-word', containerRef.current);
    
    gsap.fromTo(words, 
      { y: "120%", opacity: 0, rotateZ: 2 },
      {
        y: "0%", 
        opacity: 1, 
        rotateZ: 0,
        duration: 1.2, 
        ease: "power4.out", 
        stagger: 0.05,
        delay: delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
        }
      }
    );
  }, { scope: containerRef });

  const words = text.split(' ');

  return (
    <span ref={containerRef} className={`${className} inline-block`}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
            <span className="reveal-word inline-block will-change-transform origin-bottom-left opacity-0 transform-gpu">
              {word}
            </span>
          </span>
          {i < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </span>
  );
}
