import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const BrandStatement = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<SVGSVGElement>(null);

  // Parallax background
  useEffect(() => {
    if (!bgRef.current) return;

    gsap.to(bgRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 0.3,
        markers: false,
      },
      y: -80,
      ease: 'none',
    });
  }, []);

  // Rotating seal
  useEffect(() => {
    if (!sealRef.current) return;

    gsap.to(sealRef.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: 'none',
      transformOrigin: '50% 50%',
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #3D0A12 0%, #5C0F1A 100%)',
      }}
    >
      {/* Parallax Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(201, 162, 39, 0.3) 0%, transparent 70%)',
        }}
      />

      <div className="container relative z-10 flex flex-col items-center text-center space-y-12">
        {/* Main Quote */}
        <h2
          className="text-4xl md:text-5xl font-serif font-bold text-[#FBF4E6] max-w-2xl"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Your Trusted Partner for{' '}
          <span className="text-[#C9A227]">Divine Products.</span>
        </h2>

        {/* Rotating Seal */}
        <svg
          viewBox="0 0 120 120"
          className="w-24 h-24 text-[#C9A227]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Rotating outer frame */}
          <g ref={sealRef}>
            {/* Outer circle */}
            <circle cx="60" cy="60" r="55" />
            
            {/* Inner circle */}
            <circle cx="60" cy="60" r="45" />
            
            {/* Decorative points */}
            {[...Array(8)].map((_, i) => {
              const angle = (i * 360) / 8;
              const rad = (angle * Math.PI) / 180;
              const x1 = 60 + 50 * Math.cos(rad);
              const y1 = 60 + 50 * Math.sin(rad);
              const x2 = 60 + 58 * Math.cos(rad);
              const y2 = 60 + 58 * Math.sin(rad);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>

          {/* Static center Om symbol - perfectly aligned and enlarged */}
          <text
            x="60"
            y="65"
            textAnchor="middle"
            dominantBaseline="central"
            fill="currentColor"
            className="font-bold"
            style={{ fontSize: '45px', fontFamily: 'Cinzel, Georgia, serif' }}
          >
            ॐ
          </text>
        </svg>

        {/* Supporting Text */}
        <p className="text-lg text-[#E3C567] max-w-xl leading-relaxed">
          Shashti has been the trusted name in premium pooja products for generations. We partner with
          dedicated retailers who share our commitment to quality and customer service.
        </p>
      </div>
    </section>
  );
};
