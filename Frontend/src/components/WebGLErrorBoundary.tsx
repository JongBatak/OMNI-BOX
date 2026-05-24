'use client';
import React from 'react';

export class WebGLErrorBoundary extends React.Component<
  { fallback?: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("WebGL/Spline Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-center p-4">
          <span className="text-xs font-bold tracking-[0.3em] text-red-500 mb-2">RENDER ERROR</span>
          <span className="text-[10px] tracking-[0.1em] text-black/50">3D Asset failed to load.</span>
        </div>
      );
    }
    return this.props.children;
  }
}
