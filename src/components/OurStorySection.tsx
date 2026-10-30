import React from 'react';
import { motion } from 'motion/react';
import { WeddingData } from '../types/wedding';

interface OurStorySectionProps {
  data: WeddingData;
}

export const OurStorySection: React.FC<OurStorySectionProps> = ({ data }) => {
  return (
    <section id="our-story-section" className="relative px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-cinzel text-xs tracking-[0.3em] text-[#8C7653] uppercase">
            How It Began
          </span>
          <h2 className="font-serif-luxury mt-2 text-3xl text-[#2E241E] sm:text-4xl">
            {data.storyTitle}
          </h2>
          <div className="mx-auto mt-3 flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-[#D4AF37]/50" />
            <span className="text-[#C59B27]">❦</span>
            <span className="h-px w-12 bg-[#D4AF37]/50" />
          </div>
        </motion.div>

        {/* Story Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="parchment-card mt-8 rounded-2xl p-6 sm:p-10"
        >
          {/* Quote */}
          <p className="font-serif-luxury text-xl italic text-[#96773B] sm:text-2xl">
            “{data.storyQuote}”
          </p>

          <div className="mx-auto my-6 h-px w-24 bg-[#D4AF37]/40" />

          {/* Paragraphs */}
          <div className="space-y-4 font-sans-clean text-xs leading-relaxed text-[#5C4B3C] sm:text-sm">
            {data.storyParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="font-script text-2xl text-[#C59B27]">
              {data.brideName} & {data.groomName}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
