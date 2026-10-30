import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Share2, MailOpen, Check } from 'lucide-react';
import { WeddingData } from '../types/wedding';

interface FooterSectionProps {
  data: WeddingData;
  onReplayEnvelope: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  data,
  onReplayEnvelope
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `💍 Wedding Invitation: You are warmly invited to celebrate the marriage of ${data.brideName} & ${data.groomName}! ✨\n\nDate: ${data.weddingDate}\nVenue: ${data.mainVenueName}\n\nView the interactive invitation card here: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <footer
      id="wedding-footer-section"
      className="relative border-t border-[#D4AF37]/30 bg-[#FAF6EE] px-4 py-16 text-center"
    >
      <div className="mx-auto max-w-xl">
        {/* Monogram Crest */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#D4AF37] bg-white shadow-md"
        >
          <span className="font-cinzel text-sm font-bold text-[#A88234]">
            {data.monogram}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 space-y-3"
        >
          <h2 className="font-cinzel text-xs font-bold tracking-[0.25em] text-[#8C7653] uppercase sm:text-sm">
            We Can't Wait To Celebrate With You
          </h2>

          <p className="font-serif-luxury text-base italic text-[#594738] sm:text-lg">
            Your presence will make our special day even more memorable.
          </p>

          <div className="my-4 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-[#D4AF37]/50" />
            <Heart className="h-4 w-4 fill-[#B91C1C] text-[#B91C1C]" />
            <span className="h-px w-16 bg-[#D4AF37]/50" />
          </div>

          <h3 className="font-serif-luxury text-3xl font-medium text-[#2E221B] sm:text-4xl">
            {data.brideName} & {data.groomName}
          </h3>

          <p className="font-cinzel text-[11px] tracking-widest text-[#947D60] uppercase">
            Thank You For Being Part Of Our Celebration
          </p>
        </motion.div>

        {/* Action Buttons: WhatsApp Share & Replay Envelope */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            type="button"
            id="share-whatsapp-btn"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-2 rounded-full border border-[#25D366] bg-[#25D366]/10 px-5 py-2.5 text-xs font-semibold text-[#128C7E] transition-colors hover:bg-[#25D366]/20"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share on WhatsApp</span>
          </button>

          <button
            type="button"
            id="copy-link-btn"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/60 bg-white px-5 py-2.5 text-xs font-semibold text-[#544332] shadow-xs transition-colors hover:bg-[#FAF5EB]"
          >
            {copiedLink ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-[#B89240]" />
                <span>Copy Invite Link</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="replay-envelope-btn"
            onClick={onReplayEnvelope}
            className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/60 bg-[#FAF5EB] px-5 py-2.5 text-xs font-semibold text-[#4A3927] transition-colors hover:bg-[#F2E5D0]"
          >
            <MailOpen className="h-3.5 w-3.5 text-[#B89240]" />
            <span>Replay Opening Animation</span>
          </button>
        </motion.div>

        <p className="mt-12 text-[10px] text-[#A69584]">
          Crafted with love for the wedding of {data.brideName} & {data.groomName}
        </p>
      </div>
    </footer>
  );
};
