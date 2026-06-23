import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  id: number;
  value: number;
  suffix: string;
  label: string;
  icon: string;
}

const stats: Stat[] = [
  {
    id: 1,
    value: 50,
    suffix: '+',
    label: 'Active Partners',
    icon: 'Users',
  },
  {
    id: 2,
    value: 5,
    suffix: 'M+',
    label: 'Annual Revenue',
    icon: 'TrendingUp',
  },
  {
    id: 3,
    value: 5,
    suffix: '',
    label: 'States Covered',
    icon: 'MapPin',
  },
  {
    id: 4,
    value: 98,
    suffix: '%',
    label: 'Partner Satisfaction',
    icon: 'Star',
  },
];

export const StatsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!statsRef.current) return;

    const statCards = statsRef.current.querySelectorAll('.stat-card');

    statCards.forEach((card, idx) => {
      // Set initial animation state
      gsap.set(card, { opacity: 0, y: 40, scale: 0.95 });

      // Animate card entrance
      gsap.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none',
          markers: false,
        },
      });

      // Animate counter values using ScrollTrigger callback
      const counterEl = card.querySelector('.counter-value');
      if (counterEl) {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 85%',
          onEnter: () => {
            const stat = stats[idx];
            gsap.to(counterEl, {
              textContent: stat.value,
              duration: 2,
              ease: 'power2.out',
              snap: { textContent: 1 },
            });
          },
          once: true,
          markers: false,
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-r from-[#3D0A12] via-[#5C0F1A] to-[#3D0A12] relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1200 600">
          <defs>
            <pattern id="dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="#C9A227" />
            </pattern>
          </defs>
          <rect width="1200" height="600" fill="url(#dots)" />
        </svg>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="eyebrow text-[#E3C567]">BY THE NUMBERS</span>
            <div className="h-px w-8 bg-gradient-to-r from-[#C9A227] to-transparent" />
          </div>
          <h2
            className="text-4xl md:text-5xl font-serif font-bold text-white mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Shashti Partnership Impact
          </h2>
          <p className="text-lg text-[#E3C567] max-w-2xl mx-auto">
            Join a thriving network of successful partners across India
          </p>
        </div>

        {/* Stats Grid */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="stat-card group relative p-8 rounded-lg border-2 border-[#C9A227] bg-gradient-to-br from-[#5C0F1A]/50 to-transparent hover:from-[#5C0F1A]/80 transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A227]/30"
            >
              {/* Icon */}
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon === 'Users' && '👥'}
                {stat.icon === 'TrendingUp' && '📈'}
                {stat.icon === 'MapPin' && '🗺️'}
                {stat.icon === 'Star' && '⭐'}
              </div>

              {/* Counter */}
              <div className="mb-4">
                <div className="text-4xl md:text-5xl font-bold text-[#C9A227] font-serif">
                  <span className="counter-value">0</span>
                  <span className="text-3xl ml-1">{stat.suffix}</span>
                </div>
              </div>

              {/* Label */}
              <p className="text-lg font-semibold text-white">{stat.label}</p>

              {/* Accent line */}
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#C9A227] to-transparent w-0 group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
