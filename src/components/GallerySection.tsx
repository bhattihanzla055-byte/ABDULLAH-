import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { GalleryItem } from '../types/wedding';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === 'Escape') setSelectedIdx(null);
      if (e.key === 'ArrowRight') {
        setSelectedIdx((prev) => (prev !== null ? (prev + 1) % gallery.length : 0));
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIdx((prev) =>
          prev !== null ? (prev - 1 + gallery.length) % gallery.length : 0
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx, gallery.length]);

  return (
    <section id="wedding-gallery-section" className="relative px-4 py-16">
      <div className="mx-auto max-w-4xl text-center">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-cinzel text-xs tracking-[0.3em] text-[#8C7653] uppercase">
            Timeless Moments
          </span>
          <h2 className="font-serif-luxury mt-2 text-3xl text-[#2E241E] sm:text-4xl">
            Memories
          </h2>
          <p className="font-serif-luxury mx-auto mt-2 max-w-md text-sm italic text-[#78634F]">
            Capturing the smiles, promises, and golden glimpses along our journey.
          </p>
          <div className="mx-auto mt-3 flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-[#D4AF37]/50" />
            <span className="text-[#C59B27]">❦</span>
            <span className="h-px w-12 bg-[#D4AF37]/50" />
          </div>
        </motion.div>

        {/* Masonry / Grid Gallery */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
          {gallery.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => setSelectedIdx(index)}
              className="group relative h-44 cursor-pointer overflow-hidden rounded-xl border border-[#D4AF37]/30 bg-[#E8DDD1] shadow-xs transition-all duration-300 hover:shadow-lg sm:h-64"
            >
              <img
                src={item.url}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-[#1A130D]/85 via-[#1A130D]/20 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-4">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/25 backdrop-blur-xs text-white">
                  <Maximize2 className="h-4 w-4" />
                </div>
                <p className="font-serif-luxury text-sm font-medium text-white sm:text-base">
                  {item.title}
                </p>
                {item.caption && (
                  <p className="font-sans-clean line-clamp-1 text-[10px] text-white/80 sm:text-xs">
                    {item.caption}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal with Next / Prev */}
        <AnimatePresence>
          {selectedIdx !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
              onClick={() => setSelectedIdx(null)}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIdx(null);
                }}
                className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
                aria-label="Close image lightbox"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Prev Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIdx((prev) =>
                    prev !== null ? (prev - 1 + gallery.length) % gallery.length : 0
                  );
                }}
                className="absolute left-4 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Image & Caption Display */}
              <div
                className="relative max-h-[85vh] max-w-3xl overflow-hidden rounded-xl border border-[#D4AF37]/50"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.img
                  key={gallery[selectedIdx].id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={gallery[selectedIdx].url}
                  alt={gallery[selectedIdx].title}
                  className="max-h-[75vh] w-auto object-contain"
                  referrerPolicy="no-referrer"
                />

                <div className="bg-[#1F1813] p-4 text-center text-white">
                  <p className="font-serif-luxury text-lg">
                    {gallery[selectedIdx].title}
                  </p>
                  {gallery[selectedIdx].caption && (
                    <p className="font-sans-clean mt-1 text-xs text-[#C5B39E]">
                      {gallery[selectedIdx].caption}
                    </p>
                  )}
                  <p className="font-cinzel mt-2 text-[10px] text-[#A88234]">
                    {selectedIdx + 1} of {gallery.length}
                  </p>
                </div>
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIdx((prev) =>
                    prev !== null ? (prev + 1) % gallery.length : 0
                  );
                }}
                className="absolute right-4 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
