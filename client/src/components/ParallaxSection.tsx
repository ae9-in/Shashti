import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ParallaxSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Layer parallax effects
    const layers = [
      { ref: layer1Ref, speed: 0.5 },
      { ref: layer2Ref, speed: 0.3 },
      { ref: layer3Ref, speed: 0.1 },
    ];

    layers.forEach(({ ref, speed }) => {
      if (!ref.current) return;

      gsap.to(ref.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 0.3,
          markers: false,
        },
        y: () => {
          const height = ref.current?.offsetHeight || 0;
          return height * speed;
        },
        ease: 'none',
      });
    });

    // Content fade-in
    if (contentRef.current) {
      gsap.set(contentRef.current, { opacity: 0, y: 40 });
      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.2,
          markers: false,
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 overflow-hidden bg-gradient-to-b from-[#FBF4E6] to-[#F5EDE0]"
    >
      {/* Parallax layers */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Layer 1 - Background pattern */}
        <div
          ref={layer1Ref}
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, #C9A227 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Layer 2 - Accent shapes */}
        <div
          ref={layer2Ref}
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{
            background: 'linear-gradient(135deg, #C9A227, #E3C567)',
            filter: 'blur(60px)',
          }}
        />

        {/* Layer 3 - Secondary shapes */}
        <div
          ref={layer3Ref}
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
          style={{
            background: 'linear-gradient(135deg, #3D0A12, #C9A227)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Content */}
      <div ref={contentRef} className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="eyebrow">PARTNERSHIP BENEFITS</span>
            <div className="h-px w-8 bg-gradient-to-r from-[#C9A227] to-transparent" />
          </div>

          <h2
            className="text-4xl md:text-5xl font-serif font-bold text-[#3D0A12]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Why Choose Shashti Partnership
          </h2>

          <p className="text-lg text-[#241108] leading-relaxed">
            Our preferred partner program offers exclusive benefits designed to help your business thrive. From premium
            product access to dedicated support, we ensure your success.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            {[
              { title: 'Exclusive Territory', desc: 'Protected market area for your business' },
              { title: 'Premium Margins', desc: 'Competitive pricing with healthy profits' },
              { title: '24/7 Support', desc: 'Dedicated partner success team' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg border-2 border-[#C9A227] bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
              >
                <h3 className="font-bold text-[#3D0A12] mb-2">{item.title}</h3>
                <p className="text-sm text-[#241108]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
