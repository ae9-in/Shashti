import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
  color: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Premium Agarbatti',
    category: 'Incense Sticks',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663766304830/AfzBqs9G4jusWvNQdvydBB/agarbatti-product-iTf43RbWgDMQpAEwYqBHxd.webp',
    description: 'Hand-rolled natural incense sticks with authentic sandalwood and floral fragrances',
    color: '#C9A227',
  },
  {
    id: 2,
    name: 'Luxury Kumkum',
    category: 'Pooja Essentials',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663766304830/AfzBqs9G4jusWvNQdvydBB/kumkum-product-HMRLHguUYvtAJG6kUSKw98.webp',
    description: 'Pure turmeric and kumkum collection in ornate traditional containers',
    color: '#E3C567',
  },
  {
    id: 3,
    name: 'Sacred Essentials Set',
    category: 'Complete Pooja Kit',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663766304830/AfzBqs9G4jusWvNQdvydBB/pooja-essentials-T44dG4KzhTya7BpQzXGnBa.webp',
    description: 'Complete pooja essentials including brass vessels, bells, and prayer beads',
    color: '#F3E3B0',
  },
];

export const ProductCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);

  // Carousel rotation animation
  useEffect(() => {
    if (!carouselRef.current) return;

    const cards = carouselRef.current.querySelectorAll('.product-card');
    const totalCards = cards.length;
    const angleStep = 360 / totalCards;

    gsap.to(cards, {
      rotationY: (i) => {
        return i * angleStep + rotationAngle;
      },
      z: (i) => {
        const distance = Math.abs(i - activeIndex);
        const normDistance = distance > totalCards / 2 ? totalCards - distance : distance;
        return Math.cos((normDistance / totalCards) * Math.PI) * 300;
      },
      opacity: (i) => {
        const distance = Math.abs(i - activeIndex);
        const normDistance = distance > totalCards / 2 ? totalCards - distance : distance;
        return normDistance === 0 ? 1 : 0.3;
      },
      scale: (i) => {
        return i === activeIndex ? 1 : 0.85;
      },
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, [rotationAngle, activeIndex]);

  const rotateCarousel = (direction: 'next' | 'prev') => {
    const angleStep = 360 / products.length;
    if (direction === 'next') {
      setRotationAngle((prev) => prev - angleStep);
      setActiveIndex((prev) => (prev + 1) % products.length);
    } else {
      setRotationAngle((prev) => prev + angleStep);
      setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
    }
  };

  const handleDotClick = (targetIndex: number) => {
    if (targetIndex === activeIndex) return;

    const total = products.length;
    let diff = targetIndex - activeIndex;

    if (diff > total / 2) {
      diff -= total;
    } else if (diff < -total / 2) {
      diff += total;
    }

    const angleStep = 360 / total;
    setRotationAngle((prev) => prev - diff * angleStep);
    setActiveIndex(targetIndex);
  };

  // Auto-rotate every 4 seconds (resets timer on manual changes)
  useEffect(() => {
    const timer = setInterval(() => {
      rotateCarousel('next');
    }, 4000);

    return () => clearInterval(timer);
  }, [activeIndex, rotationAngle]);

  return (
    <section ref={containerRef} className="py-20 bg-gradient-to-b from-[#FBF4E6] to-[#F5EDE0]">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="eyebrow">FEATURED PRODUCTS</span>
            <div className="h-px w-8 bg-gradient-to-r from-[#C9A227] to-transparent" />
          </div>
          <h2
            className="text-4xl md:text-5xl font-serif font-bold text-[#3D0A12] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Our Premium Collections
          </h2>
          <p className="text-lg text-[#241108] max-w-2xl mx-auto">
            Explore our curated selection of pooja products, each crafted with premium quality and authentic tradition.
          </p>
        </div>

        {/* 3D Carousel */}
        <div className="flex items-center justify-center gap-8 min-h-96">
          {/* Left Arrow */}
          <button
            onClick={() => rotateCarousel('prev')}
            className="w-12 h-12 rounded-full border-2 border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-white transition-all duration-300 flex items-center justify-center"
          >
            ←
          </button>

          {/* Carousel Container */}
          <div
            ref={carouselRef}
            className="relative w-full max-w-4xl h-96"
            style={{
              perspective: '1200px',
              transformStyle: 'preserve-3d',
            }}
          >
            {products.map((product, idx) => (
              <div
                key={product.id}
                className="product-card absolute w-80 h-80 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <div className="w-full h-full rounded-lg overflow-hidden border-2 border-[#C9A227] bg-white shadow-2xl">
                  {/* Product Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-2/3 object-cover"
                  />

                  {/* Product Info */}
                  <div className="h-1/3 p-4 flex flex-col justify-between bg-white">
                    <div>
                      <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest">
                        {product.category}
                      </p>
                      <h3 className="text-lg font-bold text-[#3D0A12]">{product.name}</h3>
                    </div>
                    <p className="text-xs text-[#241108] line-clamp-2">{product.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => rotateCarousel('next')}
            className="w-12 h-12 rounded-full border-2 border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-white transition-all duration-300 flex items-center justify-center"
          >
            →
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-3 mt-12">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === activeIndex ? 'bg-[#C9A227] w-8' : 'bg-[#E3C567]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
