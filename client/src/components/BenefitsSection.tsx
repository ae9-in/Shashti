import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { HandshakeIcon, TruckIcon, MapPinIcon, GrowthArrowIcon } from './SVGAssets';

gsap.registerPlugin(ScrollTrigger);

const benefitCards = [
  {
    title: 'Exclusive Territory Protection',
    description: 'We appoint only one preferred partner in a designated area, ensuring reduced competition and increased customer reach.',
    icon: 'shield',
  },
  {
    title: 'Attractive Dealer Margins',
    description: 'Special wholesale rates designed to maximize your profitability.',
    icon: 'growth',
  },
  {
    title: 'Registration & Partner Maintenance Support',
    description: 'Complete onboarding assistance, product guidance, stock management support, and regular business reviews.',
    icon: 'handshake',
  },
  {
    title: 'Reliable Product Supply',
    description: 'Consistent availability of pooja products to help you serve customers without interruption.',
    icon: 'truck',
  },
];

export const BenefitsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsContainerRef.current) return;

    const cards = cardsContainerRef.current.querySelectorAll('.benefit-card');

    ScrollTrigger.create({
      trigger: cardsContainerRef.current,
      start: 'top 60%',
      onEnter: () => {
        // Choreographed entrance from alternating directions
        const directions = [
          { x: -100, y: 0 }, // left
          { x: 0, y: 100 }, // bottom
          { x: 0, y: 100 }, // bottom
          { x: 100, y: 0 }, // right
        ];

        gsap.set(cards, { opacity: 0, x: 0, y: 0 });

        cards.forEach((card, idx) => {
          const direction = directions[idx] || { x: 0, y: 0 };
          gsap.set(card, { x: direction.x, y: direction.y, opacity: 0 });

          gsap.to(card, {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: idx * 0.15,
            ease: 'back.out',
          });
        });
      },
      once: true,
    });
  }, []);

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'shield':
        return (
          <svg
            viewBox="0 0 100 120"
            className="w-8 h-8 text-[#FBF4E6]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M50 10 L20 30 L20 60 Q20 90 50 110 Q80 90 80 60 L80 30 Z" />
            <line x1="50" y1="40" x2="50" y2="85" />
          </svg>
        );
      case 'growth':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-8 h-8 text-[#FBF4E6]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 80 L80 20" />
            <path d="M80 20 L70 20 L80 10" />
            <path d="M20 60 Q40 50 60 40 Q70 35 80 20" fill="none" />
          </svg>
        );
      case 'handshake':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-8 h-8 text-[#FBF4E6]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 45 L25 35 L35 40 L40 30 L45 35 L50 25" />
            <path d="M85 45 L75 35 L65 40 L60 30 L55 35 L50 25" />
            <line x1="45" y1="40" x2="55" y2="40" strokeWidth="3" />
          </svg>
        );
      case 'truck':
        return (
          <svg
            viewBox="0 0 100 80"
            className="w-8 h-8 text-[#FBF4E6]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="25" y="25" width="50" height="30" />
            <rect x="10" y="35" width="15" height="20" />
            <circle cx="20" cy="60" r="5" />
            <circle cx="70" cy="60" r="5" />
            <line x1="10" y1="35" x2="10" y2="55" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-[#FBF4E6]"
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="eyebrow">PREFERRED PARTNER BENEFITS</span>
            <div className="h-px w-8 bg-gradient-to-r from-[#C9A227] to-transparent" />
          </div>
        </div>

        {/* Cards Grid */}
        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefitCards.map((card, idx) => (
            <div
              key={idx}
              className="benefit-card group p-8 rounded-lg border-2 border-[#C9A227] bg-[#F5EDE0] hover:shadow-xl hover:shadow-[#C9A227]/20 transition-all duration-300 cursor-pointer"
            >
              {/* Icon Badge */}
              <div className="w-16 h-16 rounded-full bg-[#3D0A12] flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:shadow-lg group-hover:shadow-[#C9A227]/50 transition-all duration-300">
                {renderIcon(card.icon)}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[#3D0A12] mb-3">{card.title}</h3>

              {/* Description */}
              <p className="text-[#241108] text-sm leading-relaxed">{card.description}</p>

              {/* Hover underline */}
              <div className="h-1 bg-gradient-to-r from-[#C9A227] to-transparent mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
