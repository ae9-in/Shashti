import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface InteractiveCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

export const InteractiveCard = ({
  title,
  description,
  icon,
  color,
  delay = 0,
}: InteractiveCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Scroll-triggered entrance
    gsap.set(card, { opacity: 0, y: 40, scale: 0.95 });
    gsap.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out',
      delay,
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.2,
        markers: false,
      },
    });

    // Hover 3D tilt effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!contentRef.current) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * 8;
      const rotateY = ((centerX - x) / centerX) * 8;

      gsap.to(contentRef.current, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      if (!contentRef.current) return;
      gsap.to(contentRef.current, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="relative h-full"
      style={{
        perspective: '1000px',
      }}
    >
      <div
        ref={contentRef}
        className="w-full h-full p-8 rounded-lg border-2 border-[#C9A227] bg-gradient-to-br from-[#FBF4E6] to-[#F5EDE0] hover:shadow-2xl transition-shadow duration-300"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'translateZ(0)',
        }}
      >
        {/* Background accent */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: color }}
        />

        {/* Icon */}
        <div className="relative z-10 mb-4 text-5xl">{icon}</div>

        {/* Content */}
        <div className="relative z-10 space-y-3">
          <h3 className="text-xl font-bold text-[#3D0A12]">{title}</h3>
          <p className="text-sm text-[#241108] leading-relaxed">{description}</p>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};
