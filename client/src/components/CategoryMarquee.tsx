import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const categories = [
  'Agarbatti & Incense Products',
  'Camphor Products',
  'Kumkum & Turmeric',
  'Pooja Essentials',
  'Religious Accessories',
  'Festival Special Collections',
];

export const CategoryMarquee = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const marqueeContent = marquee.querySelector('.marquee-content') as HTMLDivElement;
    if (!marqueeContent) return;

    // Clone items for seamless loop
    const items = marqueeContent.querySelectorAll('.marquee-item');
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      marqueeContent.appendChild(clone);
    });

    // Calculate width
    const itemWidth = (marqueeContent.querySelector('.marquee-item') as HTMLElement)?.offsetWidth || 0;
    const totalWidth = itemWidth * categories.length;

    // Create infinite scroll animation
    const tl = gsap.timeline({ repeat: -1 });

    tl.to(marqueeContent, {
      x: -totalWidth,
      duration: 40,
      ease: 'none',
      onComplete: () => {
        gsap.set(marqueeContent, { x: 0 });
      },
    });

    animationRef.current = tl;

    // Pause on hover
    const handleMouseEnter = () => {
      setIsPaused(true);
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };

    const handleMouseLeave = () => {
      setIsPaused(false);
      if (animationRef.current) {
        animationRef.current.play();
      }
    };

    marquee.addEventListener('mouseenter', handleMouseEnter);
    marquee.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      marquee.removeEventListener('mouseenter', handleMouseEnter);
      marquee.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return (
    <section className="py-8 bg-[#3D0A12] overflow-hidden">
      <div className="container mb-4">
        <div className="inline-flex items-center gap-3">
          <span className="eyebrow">CATEGORIES AVAILABLE</span>
          <div className="h-px w-8 bg-gradient-to-r from-[#C9A227] to-transparent" />
        </div>
      </div>

      {/* Marquee */}
      <div
        ref={marqueeRef}
        className="relative overflow-hidden"
        style={{ cursor: isPaused ? 'pause' : 'play' }}
      >
        <div className="marquee-content flex gap-4 px-4 will-change-transform">
          {categories.map((category, idx) => (
            <div
              key={idx}
              className="marquee-item flex-shrink-0 group"
            >
              <div className="px-5 py-2.5 rounded-lg border-2 border-[#C9A227] bg-[#5C0F1A] hover:bg-[#74121F] transition-all duration-300 whitespace-nowrap">
                <p className="text-[#E3C567] font-semibold text-sm group-hover:text-[#F3E3B0] transition-colors duration-300">
                  {category}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#3D0A12] to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#3D0A12] to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
};
