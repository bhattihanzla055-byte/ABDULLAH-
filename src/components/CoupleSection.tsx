import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { WeddingData } from '../types/wedding';

interface CoupleSectionProps {
  data: WeddingData;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({ data }) => {
  return (
    <section id="the-couple-section" className="relative px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-cinzel text-xs tracking-[0.3em] text-[#8C7653] uppercase">
            Two Souls One Journey
          </span>
          <h2 className="font-serif-luxury mt-2 text-3xl text-[#2E241E] sm:text-4xl">
            The Couple
          </h2>
          <div className="mx-auto mt-3 flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-[#D4AF37]/50" />
            <Heart className="h-3.5 w-3.5 fill-[#B91C1C] text-[#B91C1C]" />
            <span className="h-px w-12 bg-[#D4AF37]/50" />
          </div>
        </motion.div>

        {/* Bride & Groom Cards */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Bride Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="parchment-card flex flex-col items-center rounded-2xl p-6 text-center sm:p-8"
          >
            {/* Bride Royal Crest Monogram (No Photo) */}
            <div className="relative mb-6 flex h-32 w-32 items-center justify-center rounded-full border-2 border-[#D4AF37] bg-gradient-to-b from-[#FFFDF9] via-[#FAF4E6] to-[#F3E7CA] p-2 shadow-lg ring-4 ring-[#D4AF37]/20 sm:h-36 sm:w-36">
              <div className="flex h-full w-full items-center justify-center rounded-full border border-dashed border-[#C59B27]/70 bg-gradient-to-tr from-[#FFF9EE] to-[#FFFFFF]">
                <div className="text-center">
                  <span className="block font-serif text-3xl sm:text-4xl font-bold tracking-wider text-[#9E782F] drop-shadow-xs">
                    {data.brideName.charAt(0)}
                  </span>
                  <span className="text-[10px] tracking-[0.2em] text-[#A88849] font-cinzel uppercase block mt-0.5">
                    Bride
                  </span>
                </div>
              </div>
              <div className="pointer-events-none absolute -top-1.5 -right-1.5 text-xs text-[#C59B27]">✦</div>
              <div className="pointer-events-none absolute -bottom-1.5 -left-1.5 text-xs text-[#C59B27]">✦</div>
            </div>

            <span className="font-cinzel text-[10px] tracking-[0.25em] text-[#9E825A] uppercase">
              The Radiant Bride
            </span>
            <h3 className="font-serif-luxury mt-1 text-3xl font-medium text-[#2C211B]">
              {data.brideFullName}
            </h3>
            <p className="font-sans-clean mt-1 text-xs font-medium text-[#7D6B58]">
              {data.brideParents}
            </p>

            {data.brideBio && (
              <p className="font-serif-luxury mt-4 max-w-xs text-sm italic leading-relaxed text-[#5F4E3E]">
                “{data.brideBio}”
              </p>
            )}
          </motion.div>

          {/* Groom Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="parchment-card flex flex-col items-center rounded-2xl p-6 text-center sm:p-8"
          >
            {/* Groom Royal Crest Monogram (No Photo) */}
            <div className="relative mb-6 flex h-32 w-32 items-center justify-center rounded-full border-2 border-[#D4AF37] bg-gradient-to-b from-[#FFFDF9] via-[#FAF4E6] to-[#F3E7CA] p-2 shadow-lg ring-4 ring-[#D4AF37]/20 sm:h-36 sm:w-36">
              <div className="flex h-full w-full items-center justify-center rounded-full border border-dashed border-[#C59B27]/70 bg-gradient-to-tr from-[#FFF9EE] to-[#FFFFFF]">
                <div className="text-center">
                  <span className="block font-serif text-3xl sm:text-4xl font-bold tracking-wider text-[#9E782F] drop-shadow-xs">
                    {data.groomName.charAt(0)}
                  </span>
                  <span className="text-[10px] tracking-[0.2em] text-[#A88849] font-cinzel uppercase block mt-0.5">
                    Groom
                  </span>
                </div>
              </div>
              <div className="pointer-events-none absolute -top-1.5 -right-1.5 text-xs text-[#C59B27]">✦</div>
              <div className="pointer-events-none absolute -bottom-1.5 -left-1.5 text-xs text-[#C59B27]">✦</div>
            </div>

            <span className="font-cinzel text-[10px] tracking-[0.25em] text-[#9E825A] uppercase">
              The Handsome Groom
            </span>
            <h3 className="font-serif-luxury mt-1 text-3xl font-medium text-[#2C211B]">
              {data.groomFullName}
            </h3>
            <p className="font-sans-clean mt-1 text-xs font-medium text-[#7D6B58]">
              {data.groomParents}
            </p>

            {data.groomBio && (
              <p className="font-serif-luxury mt-4 max-w-xs text-sm italic leading-relaxed text-[#5F4E3E]">
                “{data.groomBio}”
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
