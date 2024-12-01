import React, { useEffect } from 'react';

export const GradientBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const interactive = document.querySelector('.interactive') as HTMLElement;
      if (interactive) {
        const { clientX, clientY } = event;
        interactive.style.transform = `translate(${clientX}px, ${clientY}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="gradient-bg fixed inset-0">
        <svg 
          viewBox="0 0 100vw 100vw"
          xmlns="http://www.w3.org/2000/svg"
          className="noiseBg absolute inset-0"
        >
          <filter id="noiseFilterBg">
            <feTurbulence 
              type="fractalNoise"
              baseFrequency="0.6"
              stitchTiles="stitch"
            />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#noiseFilterBg)"
          />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="svgBlur">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix 
                in="blur" 
                mode="matrix" 
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" 
                result="goo" 
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div className="gradients-container">
          <div className="g1"></div>
          <div className="g2"></div>
          <div className="g3"></div>
          <div className="g4"></div>
          <div className="g5"></div>
          <div className="interactive"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};