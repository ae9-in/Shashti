import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const mandalaRef = useRef<SVGSVGElement>(null);

  // Text stagger animation on load
  useEffect(() => {
    if (!textBlockRef.current) return;

    const elements = textBlockRef.current.querySelectorAll('.animate-in');
    gsap.set(elements, { opacity: 0, y: 24, filter: 'blur(6px)' });

    gsap.to(elements, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      stagger: 0.08,
      ease: 'power2.out',
      delay: 0.2,
    });
  }, []);

  // Mandala slow rotation
  useEffect(() => {
    if (!mandalaRef.current) return;

    gsap.to(mandalaRef.current, {
      rotation: 360,
      duration: 90,
      repeat: -1,
      ease: 'none',
      transformOrigin: '50% 50%',
    });
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen pt-20 overflow-hidden"
      style={{
        backgroundImage: 'url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay to ensure high text readability on the left */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-transparent z-0" />
      {/* Mandala background */}
      <svg
        ref={mandalaRef}
        viewBox="0 0 200 200"
        className="absolute top-0 right-0 w-96 h-96 opacity-10 text-[#C9A227]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        {/* Outer circle */}
        <circle cx="100" cy="100" r="95" />
        {/* Radiating lines */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12;
          const rad = (angle * Math.PI) / 180;
          const x1 = 100 + 80 * Math.cos(rad);
          const y1 = 100 + 80 * Math.sin(rad);
          const x2 = 100 + 95 * Math.cos(rad);
          const y2 = 100 + 95 * Math.sin(rad);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
        {/* Inner circles */}
        <circle cx="100" cy="100" r="60" />
        <circle cx="100" cy="100" r="40" />
        <circle cx="100" cy="100" r="20" />
      </svg>

      <div className="container relative z-20 grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 items-center min-h-[calc(100vh-80px)]">
        {/* Left: Text Block */}
        <div ref={textBlockRef} className="space-y-6">
          {/* Eyebrow */}
          <div className="animate-in inline-flex items-center gap-3">
            <span className="eyebrow text-[#E3C567]">EXCLUSIVE BUSINESS OPPORTUNITY</span>
            <div className="h-px w-8 bg-gradient-to-r from-[#C9A227] to-transparent" />
          </div>

          {/* Headline */}
          <h1 className="animate-in text-5xl md:text-6xl font-serif font-bold leading-tight text-white drop-shadow-lg">
            Become the Exclusive{' '}
            <span className="text-[#C9A227]">Shashti Partner</span> in Your Area
          </h1>

          {/* Subheading */}
          <p className="animate-in text-lg md:text-xl text-[#F3E3B0] leading-relaxed max-w-lg drop-shadow">
            Join the Shashti Preferred Partner Network and gain exclusive access to premium pooja
            products, special pricing, and dedicated business support.
          </p>

          {/* CTA Button */}
          <div className="animate-in pt-4">
            <a
              href="/apply"
              className="inline-block px-8 py-4 bg-[#C9A227] text-[#3D0A12] font-bold rounded-lg text-lg tracking-wide uppercase transition-all duration-300 hover:bg-[#E3C567] hover:shadow-lg hover:shadow-[#C9A227]/50 active:scale-95"
            >
              Apply for Preferred Partnership
            </a>
          </div>

          {/* Limited slots indicator */}
          <div className="animate-in flex items-center gap-2 text-[#FFB6C1] drop-shadow">
            <span className="inline-block w-2 h-2 bg-[#FFB6C1] rounded-full animate-pulse" />
            <span className="text-sm font-medium">Limited Partner Slots Available</span>
          </div>
        </div>

        {/* Right: Visual Panel with shop image */}
        <div className="animate-in relative w-full flex items-center justify-center p-4 lg:p-6">
          {/* Decorative rotating accent box */}
          <div className="absolute inset-1 lg:inset-2 border-2 border-[#C9A227] rounded-lg rotate-2 scale-[1.01] opacity-25 pointer-events-none" />
          
          {/* Image Container Card - perfectly wrapped to prevent any cropping or letterboxing */}
          <div className="relative w-full max-w-3xl rounded-lg border-2 border-[#C9A227] shadow-2xl overflow-hidden">
            <img
              src="/hero-shop.jpg"
              alt="Shashti Preferred Partner Shop"
              className="w-full h-auto block"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
