import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  'Area Exclusivity – Only one preferred partner shop per locality',
  'Exclusive Dealer Pricing & Higher Profit Margins',
  'Priority Product Supply & Faster Deliveries',
  'Premium Product Display Support',
  'Marketing & Promotional Assistance',
  'Dedicated Partner Support Team',
  'New Product Launch Access Before Others',
  'Trusted Brand Recognition',
];

export const WhyPartnerSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!itemsRef.current) return;

    const items = itemsRef.current.querySelectorAll('.benefit-item');

    ScrollTrigger.create({
      trigger: itemsRef.current,
      start: 'top 75%',
      onEnter: () => {
        gsap.set(items, { opacity: 0, y: 40, scale: 0.9 });
        gsap.to(items, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'back.out(1.5)',
        });
      },
      once: true,
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-transparent">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="eyebrow">WHY PARTNER WITH SHASHTI</span>
            <div className="h-px w-8 bg-gradient-to-r from-[#C9A227] to-transparent" />
          </div>
        </div>

        {/* Benefits Grid */}
        <div
          ref={itemsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="benefit-item group p-6 rounded-lg border border-[#E3C567] bg-white/30 hover:bg-white/60 hover:border-[#C9A227] hover:-translate-y-2 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#C9A227]/25 transition-all duration-300 ease-out cursor-pointer"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-[#C9A227] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-[#C9A227]/50 transition-all duration-300">
                <span className="text-[#3D0A12] font-bold text-lg">✓</span>
              </div>

              {/* Text */}
              <p className="text-[#241108] font-medium leading-relaxed">{benefit}</p>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-[#C9A227] to-transparent mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
