import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { number: 6, label: 'Curated Product Lines' },
  { number: 1, label: 'Partner Per Area' },
  { number: 100, label: '% Dedicated Support', suffix: '%' },
];

export const TrustStrip = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!statsRef.current) return;

    const statItems = statsRef.current.querySelectorAll('.stat-item');

    ScrollTrigger.create({
      trigger: statsRef.current,
      start: 'top 70%',
      onEnter: () => {
        statItems.forEach((item) => {
          const numberEl = item.querySelector('.stat-number') as HTMLElement;
          if (numberEl) {
            const targetNumber = parseInt(numberEl.dataset.target || '0', 10);
            gsap.to(numberEl, {
              textContent: targetNumber,
              duration: 2,
              snap: { textContent: 1 },
              ease: 'power2.out',
            });
          }
        });
      },
      once: true,
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-[#FBF4E6]"
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="eyebrow">TRUSTED CREDENTIALS</span>
            <div className="h-px w-8 bg-gradient-to-r from-[#C9A227] to-transparent" />
          </div>
        </div>

        {/* Stats Grid */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="stat-item text-center p-8 rounded-lg border-2 border-[#C9A227] bg-white hover:shadow-lg hover:shadow-[#C9A227]/20 transition-all duration-300"
            >
              <div
                className="stat-number text-5xl md:text-6xl font-bold text-[#C9A227] mb-2"
                data-target={stat.number}
              >
                0
              </div>
              <p className="text-[#241108] font-semibold text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
