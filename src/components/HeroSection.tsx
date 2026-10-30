import React from 'react';
import { motion } from 'motion/react';
import { WeddingData, GuestInvite } from '../types/wedding';

interface HeroSectionProps {
  data: WeddingData;
  guestInvite?: GuestInvite | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ data, guestInvite }) => {
  return (
    <section
      id="hero-invitation-section"
      className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 py-16 text-center"
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(245,235,215,0.6)_0%,_transparent_75%)]" />

      {/* Outer Card Arch Frame */}
      <div className="relative mx-auto w-full max-w-xl rounded-t-[120px] rounded-b-2xl border border-[#D4AF37]/40 bg-gradient-to-b from-[#FFFFFF] via-[#FDFBF7] to-[#F9F5EC] p-6 shadow-xl shadow-[#8C7653]/10 sm:p-10">
        {/* Inner Gold Foil Inset Border */}
        <div className="rounded-t-[110px] rounded-b-xl border border-[#D4AF37]/30 p-6 sm:p-8">
          {/* Top Traditional Islamic / Elegant Blessing Calligraphy Ornament */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-6 flex flex-col items-center"
          >
            {/* Traditional Bismillah / Blessing Monogram */}
            <div className="mb-2 font-serif text-lg tracking-widest text-[#B89240] opacity-90">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <p className="font-cinzel text-[11px] tracking-[0.3em] text-[#8A7352] uppercase">
              In The Name Of Allah, The Most Gracious, The Most Merciful
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="text-[#C59B27] text-sm">✦</span>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
          </motion.div>

          {/* Families Invitation Lead */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-cinzel text-xs font-semibold tracking-[0.25em] text-[#7A6345] uppercase sm:text-sm"
          >
            Together With Their Families
          </motion.p>

          {/* Bride and Groom Names (Visual Centerpiece) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="my-6 space-y-2"
          >
            <h1 className="font-serif-luxury text-4xl font-normal tracking-wide text-[#2C211B] sm:text-5xl md:text-6xl">
              {data.brideName}
            </h1>
            <p className="font-sans-clean text-xs text-[#8A755D]">
              {data.brideParents}
            </p>

            <div className="py-2 flex items-center justify-center gap-4">
              <span className="h-px w-16 bg-[#D4AF37]/40" />
              <span className="font-script text-3xl font-medium text-[#B89240] sm:text-4xl">
                &
              </span>
              <span className="h-px w-16 bg-[#D4AF37]/40" />
            </div>

            <h2 className="font-serif-luxury text-4xl font-normal tracking-wide text-[#2C211B] sm:text-5xl md:text-6xl">
              {data.groomName}
            </h2>
            <p className="font-sans-clean text-xs text-[#8A755D]">
              {data.groomParents}
            </p>
          </motion.div>

          {/* Personalized Guest Welcome Card */}
          {guestInvite && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="my-6 rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-r from-[#FFFDF9] via-[#FAF4E6] to-[#FFFDF9] p-5 text-center shadow-lg shadow-[#D4AF37]/15 ring-2 ring-[#D4AF37]/30"
            >
              <div className="flex items-center justify-center gap-2 text-[10px] font-cinzel font-bold tracking-[0.25em] text-[#967537] uppercase">
                <span>✦</span>
                <span>Cordially & Warmly Invited</span>
                <span>✦</span>
              </div>
              <h3 className="font-serif-luxury mt-1.5 text-2xl font-bold text-[#2A1F17] sm:text-3xl">
                {guestInvite.salutation ? `${guestInvite.salutation} ` : ''}
                {guestInvite.guestName}
              </h3>
              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-xs text-[#705844]">
                <span className="rounded-md bg-[#FAF0D8] px-3 py-1 font-semibold text-[#8A6A27] border border-[#E0D0AB]">
                  🪑 {guestInvite.seats} Seats Reserved
                </span>
                {guestInvite.tableOrEnclosure && (
                  <span className="rounded-md bg-white px-3 py-1 font-medium text-[#7A624C] border border-[#E5DBC7]">
                    📍 {guestInvite.tableOrEnclosure}
                  </span>
                )}
                {guestInvite.side && guestInvite.side !== 'both' && (
                  <span className="rounded-md bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[#8C6F42] border border-[#E5DBC7]">
                    {guestInvite.side === 'bride' ? "Bride's Side" : "Groom's Side"}
                  </span>
                )}
              </div>
              {guestInvite.personalNote && (
                <div className="mt-3.5 border-t border-[#D4AF37]/30 pt-3">
                  <p className="font-serif-luxury text-xs sm:text-sm italic leading-relaxed text-[#5F4B39] max-w-md mx-auto">
                    “{guestInvite.personalNote}”
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Couple Portrait / Exact Natural Image with Zero Cropping */}
          {data.couplePhoto && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto my-6 max-w-sm sm:max-w-md overflow-hidden rounded-xl border-2 border-[#D4AF37] p-1.5 shadow-2xl ring-1 ring-[#D4AF37]/50 bg-gradient-to-b from-[#FBF8F2] to-[#F5EEDD]"
            >
              <img
                src={data.couplePhoto}
                alt={`${data.brideName} and ${data.groomName}`}
                className="w-full h-auto rounded-lg block shadow-inner"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 rounded-xl border border-white/30 pointer-events-none" />
            </motion.div>
          )}

          {/* Cordial Invitation Request */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto max-w-md space-y-3"
          >
            <p className="font-serif-luxury text-lg italic text-[#4A3D33] sm:text-xl">
              Request the pleasure of your company at their wedding celebration
            </p>
            <p className="font-sans-clean text-xs tracking-wider text-[#7A6753]">
              {data.saveTheDateSubtitle}
            </p>
          </motion.div>

          {/* Date & Monogram Ribbon */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 pt-6 border-t border-[#D4AF37]/30 flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-3 rounded-full bg-[#FAF5EC] px-5 py-1.5 border border-[#D4AF37]/40 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#C59B27]" />
              <span className="font-cinzel text-xs font-semibold tracking-widest text-[#5A4529] uppercase">
                {data.weddingDate}
              </span>
              <span className="h-2 w-2 rounded-full bg-[#C59B27]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
