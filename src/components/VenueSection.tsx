import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Copy, Check } from 'lucide-react';
import { WeddingData } from '../types/wedding';

interface VenueSectionProps {
  data: WeddingData;
}

export const VenueSection: React.FC<VenueSectionProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${data.mainVenueName}, ${data.mainVenueAddress}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="venue-location-section" className="relative px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-cinzel text-xs tracking-[0.3em] text-[#8C7653] uppercase">
            Celebration Destination
          </span>
          <h2 className="font-serif-luxury mt-2 text-3xl text-[#2E241E] sm:text-4xl">
            The Venue
          </h2>
          <div className="mx-auto mt-3 flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-[#D4AF37]/50" />
            <span className="text-[#C59B27]">❦</span>
            <span className="h-px w-12 bg-[#D4AF37]/50" />
          </div>
        </motion.div>

        {/* Venue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="parchment-card mt-8 overflow-hidden rounded-2xl text-left"
        >
          {/* Venue Visual Header */}
          <div className="relative h-48 w-full overflow-hidden bg-gradient-to-r from-[#382B21] to-[#5C4533] sm:h-56">
            <img
              src="https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1000&q=80"
              alt={data.mainVenueName}
              className="h-full w-full object-cover opacity-65"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C140F]/90 via-[#1C140F]/40 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6">
              <span className="inline-block rounded-full bg-[#D4AF37]/90 px-3 py-1 font-cinzel text-[10px] font-semibold tracking-wider text-[#2B1F0D] uppercase">
                Official Location
              </span>
              <h3 className="font-serif-luxury mt-1 text-2xl font-normal text-white sm:text-3xl">
                {data.mainVenueName}
              </h3>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-3 text-[#4A392A]">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#C59B27]" />
              <div>
                <p className="font-sans-clean text-sm font-semibold text-[#2C211B]">
                  {data.mainVenueName}
                </p>
                <p className="font-sans-clean mt-0.5 text-xs text-[#75624E]">
                  {data.mainVenueAddress}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={data.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="get-directions-btn"
                className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37] bg-gradient-to-r from-[#C59B27] via-[#DFBA54] to-[#B89240] px-6 py-2.5 text-xs font-semibold tracking-widest text-[#362608] shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Navigation className="h-4 w-4 text-[#362608]" />
                <span className="font-cinzel uppercase">Get Directions</span>
              </a>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#FAF7F2] px-4 py-2.5 text-xs font-medium text-[#5E4D3C] transition-colors hover:bg-[#F2E5D0]"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Address Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-[#B89240]" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
