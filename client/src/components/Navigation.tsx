import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Navigation = () => {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!navRef.current) return;

    // Trigger scrolled state when scrolling past 50px
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top -50px',
      onToggle: (self) => {
        const scrolled = self.isActive;
        setIsScrolled(scrolled);

        if (navRef.current) {
          gsap.to(navRef.current, {
            borderBottomColor: scrolled ? '#C9A227' : 'transparent',
            duration: 0.3,
            overwrite: 'auto',
          });
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-40 border-b border-transparent transition-all duration-300 bg-transparent"
    >
      <div className="container flex items-center justify-between py-4">
        {/* Logo Lockup */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Shashti Logo" className="w-8 h-8 object-contain" />
          <span
            className="text-xl font-bold tracking-widest uppercase text-[#C9A227]"
            style={{
              fontFamily: 'Cinzel Decorative, serif',
            }}
          >
            SHASHTI
          </span>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Why Partner', 'Benefits', 'Categories', 'Contact'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                isScrolled
                  ? 'text-[#C9A227] hover:text-[#3D0A12]'
                  : 'text-[#FBF4E6] hover:text-[#C9A227]'
              }`}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Apply Button */}
        <a
          href="/apply"
          className="pulse-subtle px-6 py-2 border-2 border-[#C9A227] text-[#C9A227] font-semibold rounded-full text-sm tracking-wide uppercase transition-all duration-300 hover:bg-[#C9A227] hover:text-[#3D0A12]"
        >
          Apply Now
        </a>
      </div>
    </nav>
  );
};
