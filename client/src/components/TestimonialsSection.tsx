import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  id: number;
  name: string;
  city: string;
  role: string;
  quote: string;
  metric: string;
  avatar: string | { initials: string; color: string };
  color: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    city: 'Bangalore',
    role: 'Retail Shop Owner',
    quote:
      'Partnering with Shashti transformed my business. The exclusive territory protection and premium margins helped me grow revenue by 45% in the first year.',
    metric: '+45% Revenue Growth',
    avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663766304830/AfzBqs9G4jusWvNQdvydBB/partner-success-1-PbqMc7DahbHYxxMhmpYdF9.webp',
    color: '#C9A227',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    city: 'Mumbai',
    role: 'Wholesale Distributor',
    quote:
      'The dedicated support team and priority product supply have been game-changers. I can now serve my customers without any stock interruptions.',
    metric: '99% Stock Availability',
    avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663766304830/AfzBqs9G4jusWvNQdvydBB/partner-success-2-cHEBwQaVTfVuES45aXSWXg.webp',
    color: '#E3C567',
  },
  {
    id: 3,
    name: 'Amit Patel',
    city: 'Delhi',
    role: 'New Business Partner',
    quote:
      'As a newcomer to this business, Shashti\'s onboarding and marketing support gave me the confidence to succeed. I\'ve already expanded to 3 locations.',
    metric: '3 Store Expansion',
    avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663766304830/AfzBqs9G4jusWvNQdvydBB/partner-success-3-G6xfSazWHdKtPR4Gcqgaig.webp',
    color: '#F3E3B0',
  },
];

export const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState<{ [key: number]: boolean }>({});

  // Animate cards on scroll into view
  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll('.testimonial-card');

    ScrollTrigger.create({
      trigger: cardsRef.current,
      start: 'top 60%',
      onEnter: () => {
        gsap.set(cards, { opacity: 0, y: 50, rotationX: -20 });
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out',
          perspective: 1000,
        });
      },
      once: true,
    });
  }, []);

  // Animate avatars with floating effect
  useEffect(() => {
    const avatars = document.querySelectorAll('.testimonial-avatar');
    avatars.forEach((avatar, idx) => {
      gsap.to(avatar, {
        y: -10,
        duration: 3 + idx * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  }, []);

  const toggleFlip = (id: number) => {
    const card = document.querySelector(`[data-card-id="${id}"]`) as HTMLElement;
    if (!card) return;

    const isFlipped = !flipped[id];
    setFlipped({ ...flipped, [id]: isFlipped });

    gsap.to(card, {
      rotationY: isFlipped ? 180 : 0,
      duration: 0.6,
      ease: 'back.out',
    });
  };

  return (
    <section ref={sectionRef} className="py-20 bg-[#FBF4E6]">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="eyebrow">SUCCESS STORIES</span>
            <div className="h-px w-8 bg-gradient-to-r from-[#C9A227] to-transparent" />
          </div>
          <h2
            className="text-4xl md:text-5xl font-serif font-bold text-[#3D0A12] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Trusted by Preferred Partners Across India
          </h2>
          <p className="text-lg text-[#241108] max-w-2xl mx-auto">
            Real success stories from our exclusive partner network. Click any card to discover their journey.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          style={{ perspective: '1000px' }}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              data-card-id={testimonial.id}
              className="testimonial-card h-96 cursor-pointer"
              onClick={() => toggleFlip(testimonial.id)}
              style={{
                transformStyle: 'preserve-3d',
                transform: flipped[testimonial.id] ? 'rotationY(180deg)' : 'rotationY(0deg)',
              }}
            >
              {/* Front of card */}
              <div
                className="absolute inset-0 p-8 rounded-lg border-2 border-[#C9A227] bg-white flex flex-col items-center justify-center text-center space-y-4"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                {/* Avatar */}
                <div className="testimonial-avatar w-20 h-20 rounded-full overflow-hidden border-2 border-[#C9A227]">
                  {typeof testimonial.avatar === 'string' && testimonial.avatar.startsWith('http') ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center font-bold text-2xl text-white"
                      style={{ backgroundColor: testimonial.color }}
                    >
                      {typeof testimonial.avatar === 'string' ? testimonial.avatar : testimonial.avatar.initials}
                    </div>
                  )}
                </div>

                {/* Name & Role */}
                <div>
                  <h3 className="text-xl font-bold text-[#3D0A12]">{testimonial.name}</h3>
                  <p className="text-sm text-[#C9A227] font-semibold">{testimonial.role}</p>
                  <p className="text-xs text-[#241108]">{testimonial.city}</p>
                </div>

                {/* Metric */}
                <div className="pt-4 border-t border-[#E3C567] w-full">
                  <p className="text-2xl font-bold text-[#C9A227]">{testimonial.metric}</p>
                  <p className="text-xs text-[#241108] mt-1">Key Achievement</p>
                </div>

                {/* Click hint */}
                <p className="text-xs text-[#C9A227] pt-2">Click to read story</p>
              </div>

              {/* Back of card */}
              <div
                className="absolute inset-0 p-8 rounded-lg border-2 border-[#C9A227] bg-gradient-to-br from-[#3D0A12] to-[#5C0F1A] flex flex-col justify-between text-white overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                {/* Background image overlay */}
                {typeof testimonial.avatar === 'string' && testimonial.avatar.startsWith('http') && (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                  />
                )}
                {/* Quote */}
                <div className="space-y-4 relative z-10">
                  <svg
                    className="w-8 h-8 text-[#C9A227]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.5-5-7-5m14 0c-3 0-7 3.75-7 5v8c0 7 4 8 7 8z" />
                  </svg>
                  <p className="text-sm leading-relaxed italic drop-shadow">{testimonial.quote}</p>
                </div>

                {/* Footer */}
                <div className="border-t border-[#C9A227] pt-4 relative z-10">
                  <p className="text-xs text-[#E3C567] font-semibold drop-shadow">{testimonial.name}</p>
                  <p className="text-xs text-[#C9A227] drop-shadow">{testimonial.city}</p>
                  <p className="text-xs text-[#C9A227] mt-1 drop-shadow">Click to flip back</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <p className="text-[#241108] mb-4">Ready to join our network of successful partners?</p>
          <a
            href="/apply"
            className="inline-block px-8 py-3 bg-[#C9A227] text-[#3D0A12] font-bold rounded-lg hover:bg-[#E3C567] transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A227]/50"
          >
            Start Your Partnership Today
          </a>
        </div>
      </div>

      <style>{`
        .testimonial-card {
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .testimonial-card[data-flipped="true"] {
          transform: rotateY(180deg);
        }

        @media (prefers-reduced-motion: reduce) {
          .testimonial-card {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
};
