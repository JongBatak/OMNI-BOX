'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlowingMenu from '../Animations/FlowingMenu';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MainMenu({ isLoaded = true }: { isLoaded?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useGSAP(() => {
    if (!isLoaded || !buttonRef.current) return;
    
    // Animate button in when loaded
    gsap.fromTo(buttonRef.current, 
      { opacity: 0, scale: 0.5, y: -20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.5 }
    );
    
    // Check when we enter the dark #010310 CTA background
    // We add a class 'dark-section' to CtaSection to track it.
    const darkSections = gsap.utils.toArray('.dark-section-trigger');
    
    darkSections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section as Element,
        start: 'top 5%', // When the dark section reaches top
        end: 'bottom 5%',
        onEnter: () => {
          if (!isOpen && buttonRef.current) {
            gsap.to(buttonRef.current, { backgroundColor: '#FFFFFF', color: '#0000FF', duration: 0.3 });
          }
        },
        onLeaveBack: () => {
          if (!isOpen && buttonRef.current) {
            gsap.to(buttonRef.current, { backgroundColor: '#0000FF', color: '#FFFFFF', duration: 0.3 });
          }
        },
      });
    });
  }, { dependencies: [isLoaded, isOpen] });

  // When isOpen changes, we might want to force the button colors
  useGSAP(() => {
    if (isOpen && buttonRef.current) {
      // Force white on blue when open so it's visible on the dark menu background
      gsap.to(buttonRef.current, { backgroundColor: '#FFFFFF', color: '#0000FF', duration: 0.3 });
    } else if (!isOpen && buttonRef.current) {
      // Reset color based on ScrollTrigger state (which might be tricky without reading its state, 
      // but defaulting to the non-dark section color is usually fine or let ScrollTrigger refresh).
      ScrollTrigger.refresh();
      gsap.to(buttonRef.current, { backgroundColor: '#0000FF', color: '#FFFFFF', duration: 0.3 });
    }
  }, { dependencies: [isOpen] });

  const menuItems = [
    { link: '#', text: 'Dashboard', image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800' },
    { link: '#', text: 'Login', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800' },
    { link: '#', text: 'Purchase', image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=800' },
    { link: '#', text: 'Community Gallery', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <>
      <button 
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-8 right-8 z-[100] w-14 h-14 flex items-center justify-center rounded-full transition-transform hover:scale-105 shadow-xl ${!isLoaded ? 'opacity-0 pointer-events-none' : ''}`}
        style={{ backgroundColor: '#0000FF', color: '#FFFFFF' }}
        aria-label="Toggle Menu"
      >
        <div className="relative w-6 h-6 flex items-center justify-center">
          {/* Burger SVG */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`absolute w-6 h-6 transition-all duration-300 transform ${isOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>

          {/* Close 'X' SVG */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`absolute w-6 h-6 transition-all duration-300 transform ${!isOpen ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </button>

      {/* Conditional Logo for Full-Screen Menu */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <img src="/OmniBoxLogo.png" alt="OmniBox Logo" className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]" />
      </div>

      {/* Top Half-Screen Overlay for Menu */}
      <div 
        className={`fixed top-0 left-0 w-full h-full md:h-[60vh] min-h-[400px] z-90 bg-[#010310] transition-transform duration-700 ease-in-out border-b border-white/10 ${isOpen ? 'translate-y-0 shadow-[0_20px_50px_rgba(0,0,255,0.15)] pointer-events-auto' : '-translate-y-full pointer-events-none'}`}
      >
        <div className="relative w-full h-full overflow-y-auto overflow-x-hidden flex flex-col pt-24 md:pt-20 pb-8">
          <div className="flex-1 w-full h-full">
            <FlowingMenu items={menuItems} bgColor="#010310" textColor="#FFFFFF" marqueeBgColor="#0000FF" marqueeTextColor="#FFFFFF" />
          </div>
        </div>
      </div>

      {/* Optional dark backdrop for the rest of the screen */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[85] transition-opacity duration-500 md:block hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
    </>
  );
}
