import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

export const StatementBand = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Star pop-in with overshoot on scroll into view
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 70%',
      onEnter: () => {
        if (starsRef.current) {
          const stars = starsRef.current.querySelectorAll('.star');
          gsap.set(stars, { scale: 0, opacity: 0 });
          gsap.to(stars, {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out',
          });
        }
      },
      once: true,
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative pt-24 pb-32 bg-[#3D0A12] overflow-hidden"
      style={{
        backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663766304830/AfzBqs9G4jusWvNQdvydBB/hero-background-DDv3gk4Xw6F4SwcaSDF8Wd.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Red photo-tinting overlays (completely red shader/overlay effect) */}
      <div className="absolute inset-0 bg-[#3D0A12] opacity-45 z-0" />
      <div className="absolute inset-0 bg-[#3D0A12] mix-blend-multiply opacity-65 z-0" />

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 z-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(201, 162, 39, 0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="container relative z-10 flex flex-col items-center text-center space-y-8">
        {/* Main Statement */}
        <div className="space-y-6 max-w-3xl">
          <h2
            className="text-4xl md:text-5xl font-serif font-bold text-[#FBF4E6] leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Only One Exclusive Partner.{' '}
            <span className="text-[#C9A227]">Per Area.</span> Period.
          </h2>

          <p className="text-lg md:text-xl text-[#E3C567] leading-relaxed font-medium">
            We protect your territory so you never compete with another Shashti dealer in your city. Our strict one-partner-per-locality policy ensures you retain 100% of local customer demand, build a robust long-term enterprise, and maximize your profitability.
          </p>
        </div>

        {/* Stars */}
        <div ref={starsRef} className="flex justify-center gap-4 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="star text-[#C9A227]">
              ★
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
