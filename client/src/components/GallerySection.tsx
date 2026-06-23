import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

interface GalleryImage {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    title: 'Premium Agarbatti Collection',
    category: 'Incense',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663766304830/AfzBqs9G4jusWvNQdvydBB/agarbatti-product-iTf43RbWgDMQpAEwYqBHxd.webp',
    description: 'Hand-rolled natural incense sticks with authentic fragrances of pure sandalwood and fresh florals, designed for daily rituals and prayers.',
  },
  {
    id: 2,
    title: 'Luxury Kumkum & Turmeric',
    category: 'Essentials',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663766304830/AfzBqs9G4jusWvNQdvydBB/kumkum-product-HMRLHguUYvtAJG6kUSKw98.webp',
    description: 'Pure, organic turmeric and vibrant kumkum powder stored in traditional, hand-crafted brass and ceramic ornate containers.',
  },
  {
    id: 3,
    title: 'Sacred Pooja Essentials',
    category: 'Complete Kit',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663766304830/AfzBqs9G4jusWvNQdvydBB/pooja-essentials-T44dG4KzhTya7BpQzXGnBa.webp',
    description: 'A complete devotional set featuring heavy brass oil lamps, prayer bells, camphor burners, and high-grade spiritual accessories.',
  },
  {
    id: 4,
    title: 'Hero Display Setup',
    category: 'Showcase',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663766304830/AfzBqs9G4jusWvNQdvydBB/hero-background-DDv3gk4Xw6F4SwcaSDF8Wd.webp',
    description: 'An elegant presentation of Shashti\'s flagship pooja products arranged for home temples, festival gatherings, and exclusive retail spaces.',
  },
];

export const GallerySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryImage | null>(null);

  // Scroll-triggered image reveals
  useEffect(() => {
    if (!galleryRef.current) return;

    const images = galleryRef.current.querySelectorAll('.gallery-item');

    images.forEach((img) => {
      gsap.set(img, { opacity: 0, y: 60, scale: 0.95 });

      gsap.to(img, {
        scrollTrigger: {
          trigger: img,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.3,
          markers: false,
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-[#F5EDE0] to-[#FBF4E6]"
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="eyebrow">VISUAL SHOWCASE</span>
            <div className="h-px w-8 bg-gradient-to-r from-[#C9A227] to-transparent" />
          </div>
          <h2
            className="text-4xl md:text-5xl font-serif font-bold text-[#3D0A12] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Premium Product Gallery
          </h2>
          <p className="text-lg text-[#241108] max-w-2xl mx-auto">
            Explore our curated collection of pooja products, each crafted with premium quality and authentic tradition.
          </p>
        </div>

        {/* Gallery Grid */}
        <div
          ref={galleryRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {galleryImages.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="gallery-item group relative overflow-hidden rounded-lg border-2 border-[#C9A227] h-72 cursor-pointer"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest mb-2">
                    {item.category}
                  </p>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-[#E3C567] line-clamp-2">{item.description}</p>
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#C9A227] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#C9A227] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Lightbox / Detail Pop-out */}
        <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <DialogContent className="max-w-3xl bg-[#FBF4E6] border-2 border-[#C9A227] p-6 text-[#241108]">
            <DialogTitle className="sr-only">{selectedItem?.title}</DialogTitle>
            <DialogDescription className="sr-only">
              {selectedItem?.description || "Product Details"}
            </DialogDescription>
            {selectedItem && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="relative overflow-hidden rounded-lg border-2 border-[#C9A227] h-80 bg-white">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-4 flex flex-col justify-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
                    {selectedItem.category}
                  </span>
                  <h3
                    className="text-2xl font-serif font-bold text-[#3D0A12] leading-tight"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {selectedItem.title}
                  </h3>
                  <div className="h-px w-12 bg-[#C9A227]" />
                  <p className="text-sm text-[#241108]/90 leading-relaxed font-medium">
                    {selectedItem.description}
                  </p>
                  <div className="pt-4">
                    <a
                      href="/apply"
                      className="inline-block px-6 py-2.5 bg-[#C9A227] text-[#3D0A12] font-semibold rounded-lg hover:bg-[#E3C567] text-xs uppercase tracking-wider transition-all duration-300"
                    >
                      Inquire for Partnership
                    </a>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-lg text-[#241108] mb-6">
            Ready to partner with Shashti and access our complete product range?
          </p>
          <a
            href="/apply"
            className="inline-block px-8 py-4 bg-[#C9A227] text-[#3D0A12] font-bold rounded-lg hover:bg-[#E3C567] transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A227]/50 active:scale-95"
          >
            START YOUR PARTNERSHIP JOURNEY
          </a>
        </div>
      </div>
    </section>
  );
};
