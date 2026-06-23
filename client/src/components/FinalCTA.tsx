import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const FinalCTA = () => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Magnetic cursor effect on button
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < 100) {
        const angle = Math.atan2(distY, distX);
        const pullX = Math.cos(angle) * (100 - distance) * 0.3;
        const pullY = Math.sin(angle) * (100 - distance) * 0.3;

        gsap.to(button, {
          x: pullX,
          y: pullY,
          duration: 0.3,
          overwrite: 'auto',
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.3,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-24 bg-[#FBF4E6]"
    >
      <div className="container flex flex-col items-center text-center space-y-8">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-3">
          <span className="eyebrow">LIMITED PARTNER SLOTS AVAILABLE</span>
          <span className="inline-block w-2 h-2 bg-[#B33A2E] rounded-full animate-pulse" />
        </div>

        {/* Headline */}
        <h2
          className="text-4xl md:text-5xl font-serif font-bold text-[#3D0A12]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Apply for Preferred Partnership Today
        </h2>

        {/* CTA Button */}
        <a
          ref={buttonRef}
          href="/apply"
          className="inline-block px-10 py-5 bg-[#C9A227] text-[#3D0A12] font-bold rounded-lg text-lg tracking-wide uppercase transition-all duration-300 hover:bg-[#E3C567] hover:shadow-xl hover:shadow-[#C9A227]/50 active:scale-95"
        >
          Start Your Application
        </a>

        {/* Contact Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 pt-8 border-t border-[#C9A227] mt-8">
          {/* Phone */}
          <a
            href="tel:+919876543210"
            className="flex items-center gap-2 text-[#3D0A12] hover:text-[#C9A227] transition-colors duration-300"
          >
            <span className="text-[#C9A227]">📞</span>
            <span className="font-semibold">+91 98765 43210</span>
          </a>

          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-[#C9A227]" />

          {/* Email */}
          <a
            href="mailto:sales@shashti.in"
            className="flex items-center gap-2 text-[#3D0A12] hover:text-[#C9A227] transition-colors duration-300"
          >
            <span className="text-[#C9A227]">✉️</span>
            <span className="font-semibold">sales@shashti.in</span>
          </a>

          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-[#C9A227]" />

          {/* Website */}
          <a
            href="https://www.shashti.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#3D0A12] hover:text-[#C9A227] transition-colors duration-300"
          >
            <span className="text-[#C9A227]">🌐</span>
            <span className="font-semibold">www.shashti.in</span>
          </a>
        </div>
      </div>
    </section>
  );
};
