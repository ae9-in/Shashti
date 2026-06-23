import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lotusRef = useRef<HTMLImageElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    // 1. Draw lotus SVG stroke (1.2s)
    if (lotusRef.current && (lotusRef.current as any).tagName === 'svg') {
      const paths = lotusRef.current.querySelectorAll('path, circle, line');
      paths.forEach((path) => {
        const length = (path as SVGGeometryElement).getTotalLength?.() || 0;
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      paths.forEach((path, idx) => {
        tl.to(
          path,
          {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          idx * 0.05
        );
      });
    }

    // 2. Fade in lotus (parallel with stroke)
    tl.to(
      lotusRef.current,
      {
        opacity: 1,
        duration: 0.6,
      },
      0
    );

    // 3. Letter-by-letter reveal of "SHASHTI" (stagger 0.04s)
    if (wordmarkRef.current) {
      const letters = wordmarkRef.current.querySelectorAll('.letter');
      gsap.set(letters, { opacity: 0, y: 10 });
      
      tl.to(
        letters,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.04,
          ease: 'back.out',
        },
        0.3
      );
    }

    // 4. Progress bar fill (left → right)
    if (progressRef.current) {
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left' });
      tl.to(
        progressRef.current,
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power2.inOut',
        },
        0.2
      );
    }

    // 5. After completion: scale down lotus + wordmark, then mask reveal
    tl.to(
      [lotusRef.current, wordmarkRef.current],
      {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: 'back.in',
      },
      '+=0.3'
    );

    // 6. Mask wipe up (curtain effect)
    tl.to(
      containerRef.current,
      {
        clipPath: 'inset(100% 0 0 0)',
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          setIsVisible(false);
          onComplete();
        },
      },
      '-=0.4'
    );
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #3D0A12 0%, #5C0F1A 100%)',
        clipPath: 'inset(0 0 0 0)',
      }}
    >
      {/* Lotus Icon */}
      <img
        ref={lotusRef}
        src="/logo.png"
        alt="Shashti Logo"
        className="w-24 h-24 mb-8 opacity-0 object-contain"
      />
      {/* Wordmark */}
      <div
        ref={wordmarkRef}
        className="text-center mb-8"
        style={{
          fontFamily: 'Cinzel Decorative, serif',
          fontSize: 'clamp(3rem, 12vw, 5rem)',
          fontWeight: 900,
          letterSpacing: '0.2em',
          color: '#C9A227',
        }}
      >
        {'SHASHTI'.split('').map((letter, idx) => (
          <span key={idx} className="letter inline-block">
            {letter}
          </span>
        ))}
      </div>

      {/* Progress Bar */}
      <div
        ref={progressRef}
        className="h-1 w-32 rounded-full"
        style={{
          background: 'linear-gradient(90deg, #C9A227 0%, #E3C567 100%)',
          transformOrigin: 'left',
        }}
      />
    </div>
  );
};
