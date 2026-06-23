import { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { StatementBand } from '@/components/StatementBand';
import { WhyPartnerSection } from '@/components/WhyPartnerSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { CategoryMarquee } from '@/components/CategoryMarquee';
import { TrustStrip } from '@/components/TrustStrip';
import { BrandStatement } from '@/components/BrandStatement';
import { FinalCTA } from '@/components/FinalCTA';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ProductCarousel } from '@/components/ProductCarousel';
import { GallerySection } from '@/components/GallerySection';
import { StatsSection } from '@/components/StatsSection';
import { ParallaxSection } from '@/components/ParallaxSection';
import { Footer } from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    if (showLoader) return;

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    } as any);

    lenisRef.current = lenis;

    // Synchronize ScrollTrigger with Lenis scroll events
    lenis.on('scroll', ScrollTrigger.update);

    // Bind Lenis frame updates to GSAP ticker for unified high-refresh-rate animation updates
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      if (lenis?.destroy) lenis.destroy();
    };
  }, [showLoader]);

  const handleLoaderComplete = () => {
    setShowLoader(false);
  };



  return (
    <div className="min-h-screen bg-[#FBF4E6]">
      {showLoader && <LoadingScreen onComplete={handleLoaderComplete} />}

      <Navigation />

      <main>
        <HeroSection />
        <CategoryMarquee />
        <StatementBand />
        <WhyPartnerSection />
        <ProductCarousel />
        <GallerySection />
        <ParallaxSection />
        <StatsSection />
        <BenefitsSection />
        <TrustStrip />
        <TestimonialsSection />
        <BrandStatement />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}

declare global {
  interface Window {
    gsap?: any;
  }
}
