import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart } from 'lucide-react';
import { WeddingData, GuestInvite } from '../types/wedding';
import { weddingAudio } from '../utils/audioSynth';

interface OpeningEnvelopeProps {
  data: WeddingData;
  guestInvite?: GuestInvite | null;
  onOpenComplete: () => void;
}

export const OpeningEnvelope: React.FC<OpeningEnvelopeProps> = ({
  data,
  guestInvite,
  onOpenComplete
}) => {
  const [animationPhase, setAnimationPhase] = useState<
    'closed' | 'zooming' | 'flap-opening' | 'card-rising' | 'transitioning'
  >('closed');

  React.useEffect(() => {
    if (data.youtubeVideoId) {
      weddingAudio.setYoutubeVideoId(data.youtubeVideoId);
    }
    weddingAudio.setupYouTubePlayer();
  }, [data.youtubeVideoId]);

  const handleOpen = () => {
    if (animationPhase !== 'closed') return;

    // Start background music seamlessly on user gesture
    weddingAudio.play().catch(() => {});

    // Phase 1: Zoom in slightly
    setAnimationPhase('zooming');

    setTimeout(() => {
      // Phase 2: Flap opens
      setAnimationPhase('flap-opening');

      // Trigger celebratory golden confetti & rose petal burst
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F3E5AB', '#E8C5C8', '#FFF8DC', '#C59B27'],
        disableForReducedMotion: true
      });
    }, 600);

    setTimeout(() => {
      // Phase 3: Card rises out of envelope
      setAnimationPhase('card-rising');

      // Second burst as card reaches top
      confetti({
        particleCount: 30,
        spread: 90,
        origin: { y: 0.45 },
        colors: ['#D4AF37', '#E8C5C8', '#FFFFFF'],
        disableForReducedMotion: true
      });
    }, 1400);

    setTimeout(() => {
      // Phase 4: Screen fades into main invitation
      setAnimationPhase('transitioning');
    }, 2800);

    setTimeout(() => {
      onOpenComplete();
    }, 3400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <motion.div
      id="opening-screen-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: animationPhase === 'transitioning' ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#FAF7F2] px-4 py-8"
      role="region"
      aria-label="Wedding invitation opening screen"
    >
      {/* Soft Luxury Wedding Background Elements */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(243,235,218,0.7)_0%,_rgba(250,247,242,0.95)_70%)]" />

      {/* Elegant Decorative Corner Frames */}
      <div className="pointer-events-none absolute top-4 left-4 h-20 w-20 border-t-2 border-l-2 border-[#D4AF37]/40 md:top-8 md:left-8 md:h-28 md:w-28" />
      <div className="pointer-events-none absolute top-4 right-4 h-20 w-20 border-t-2 border-r-2 border-[#D4AF37]/40 md:top-8 md:right-8 md:h-28 md:w-28" />
      <div className="pointer-events-none absolute bottom-4 left-4 h-20 w-20 border-b-2 border-l-2 border-[#D4AF37]/40 md:bottom-8 md:left-8 md:h-28 md:w-28" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-20 w-20 border-b-2 border-r-2 border-[#D4AF37]/40 md:bottom-8 md:right-8 md:h-28 md:w-28" />

      {/* Floating Gentle Glow Behind Envelope */}
      <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-[#EBD8B7]/35 blur-3xl md:h-96 md:w-96" />

      {/* Main Interactive Invitation Envelope Card */}
      <div className="relative z-20 flex w-full max-w-sm flex-col items-center sm:max-w-md">
        {/* Header Invitation Text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: animationPhase === 'transitioning' ? 0 : 1,
            y: 0
          }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 text-center"
        >
          {/* Header Invitation Text */}
          {guestInvite ? (
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="font-cinzel text-xs tracking-[0.3em] text-[#8C7653] uppercase sm:text-sm"
              >
                A Special Invitation For
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-serif-luxury mt-2 text-2xl tracking-wide text-[#2D1F15] sm:text-3xl font-bold drop-shadow-xs"
              >
                <span className="relative inline-block px-4 py-1">
                  <span className="absolute inset-0 rounded-xl bg-[#DFBA54]/15 blur-sm" />
                  <span className="relative text-[#3A2A19]">
                    {guestInvite.salutation ? `${guestInvite.salutation} ` : ''}
                    {guestInvite.guestName}
                  </span>
                </span>
              </motion.h2>

              <p className="font-cinzel text-[11px] tracking-[0.25em] text-[#8C7653] uppercase mt-2">
                You Are Cordially Invited
              </p>
              <h1 className="font-serif-luxury text-lg tracking-wide text-[#3D312A] mt-0.5">
                To Celebrate The Wedding Of
              </h1>
              <div className="mx-auto mt-2 flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-[#D4AF37]/50" />
                <span className="font-script text-2xl text-[#B89240]">
                  {data.brideName} & {data.groomName}
                </span>
                <span className="h-px w-8 bg-[#D4AF37]/50" />
              </div>

              <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/60 bg-[#FAF3E1]/90 px-3 py-1 text-xs font-semibold text-[#8A6C30]">
                <span>🪑 {guestInvite.seats} Seats Specially Reserved In Your Honor</span>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-cinzel text-xs tracking-[0.25em] text-[#8C7653] uppercase sm:text-sm">
                You Are Cordially Invited
              </p>
              <h1 className="font-serif-luxury mt-2 text-2xl tracking-wide text-[#3D312A] sm:text-3xl">
                To Celebrate Our Wedding
              </h1>
              <div className="mx-auto mt-2 flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-[#D4AF37]/50" />
                <span className="font-script text-2xl text-[#B89240]">
                  {data.brideName} & {data.groomName}
                </span>
                <span className="h-px w-8 bg-[#D4AF37]/50" />
              </div>
            </div>
          )}
        </motion.div>

        {/* 3D Envelope Interactive Object */}
        <motion.div
          id="wedding-envelope"
          tabIndex={0}
          role="button"
          aria-label="Click to open wedding invitation envelope"
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          animate={
            animationPhase === 'closed'
              ? {
                  y: [0, -6, 0],
                  scale: 1,
                  boxShadow: '0 20px 40px -10px rgba(100, 75, 45, 0.15)'
                }
              : animationPhase === 'zooming'
              ? { scale: 1.05, y: -5 }
              : { scale: 1.04, y: 0 }
          }
          transition={{
            y: { repeat: animationPhase === 'closed' ? Infinity : 0, duration: 4, ease: 'easeInOut' },
            scale: { duration: 0.5 }
          }}
          whileHover={animationPhase === 'closed' ? { scale: 1.03, y: -8 } : {}}
          whileTap={animationPhase === 'closed' ? { scale: 0.98 } : {}}
          className="group relative h-[250px] w-[320px] cursor-pointer select-none rounded-xl sm:h-[280px] sm:w-[360px]"
          style={{ perspective: 1200 }}
        >
          {/* Envelope Pocket Base (Cream / Ivory Texture + Gold Border) */}
          <div className="absolute inset-0 overflow-hidden rounded-xl border border-[#D4AF37]/50 bg-gradient-to-b from-[#FBF9F5] to-[#F3EDE2] shadow-2xl shadow-[#8C7653]/15">
            {/* Subtle Diagonal Envelope Fold Lines */}
            <svg
              className="absolute inset-0 h-full w-full opacity-35"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 360 280"
              preserveAspectRatio="none"
            >
              <line x1="0" y1="280" x2="180" y2="150" stroke="#C59B27" strokeWidth="1.2" strokeDasharray="4 2" />
              <line x1="360" y1="280" x2="180" y2="150" stroke="#C59B27" strokeWidth="1.2" strokeDasharray="4 2" />
              <polygon points="0,280 180,150 360,280" fill="rgba(240, 230, 215, 0.4)" />
            </svg>

            {/* Gold Corner Filigrees */}
            <div className="absolute top-2 left-2 text-[10px] text-[#D4AF37]/60 font-serif">✦</div>
            <div className="absolute top-2 right-2 text-[10px] text-[#D4AF37]/60 font-serif">✦</div>
            <div className="absolute bottom-2 left-2 text-[10px] text-[#D4AF37]/60 font-serif">✦</div>
            <div className="absolute bottom-2 right-2 text-[10px] text-[#D4AF37]/60 font-serif">✦</div>
          </div>

          {/* Inner Invitation Card that slides upwards */}
          <motion.div
            id="inner-invitation-card"
            initial={{ y: 20, opacity: 0.8 }}
            animate={
              animationPhase === 'closed' || animationPhase === 'zooming'
                ? { y: 20, opacity: 0.8 }
                : animationPhase === 'flap-opening'
                ? { y: -30, opacity: 1 }
                : { y: -195, opacity: 1, scale: 1.05 }
            }
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-3 right-3 top-3 z-10 rounded-xl border-2 border-[#D4AF37]/80 bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF9] to-[#FAF5EB] p-3.5 text-center shadow-2xl"
          >
            <div className="border border-[#D4AF37]/40 rounded-lg p-2.5 sm:p-3 bg-white/60 text-center">
              {guestInvite ? (
                <>
                  <p className="font-serif-luxury text-xs italic font-bold text-[#8C6D28]">
                    Dear {guestInvite.salutation ? `${guestInvite.salutation} ` : ''}{guestInvite.guestName},
                  </p>
                  <p className="font-cinzel text-[9px] tracking-wider text-[#7A6B5C] uppercase mt-1">
                    With great pleasure, we invite you to celebrate the wedding of
                  </p>
                  <h2 className="font-script text-2xl text-[#B89240] my-0.5">
                    {data.brideName} & {data.groomName}
                  </h2>
                  <p className="font-serif-luxury text-[10px] italic text-[#6E5946]">
                    "Your presence will make our celebration even more special."
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1 rounded-md border border-[#D4AF37]/60 bg-[#FAF3E1]/90 px-2 py-0.5 text-[10px] font-bold text-[#8A6C30]">
                    <span>🪑 {guestInvite.seats} Seats Specially Reserved</span>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-cinzel text-[10px] tracking-widest text-[#96784A] uppercase">
                    The Wedding Celebration
                  </p>
                  <h2 className="font-serif-luxury mt-0.5 text-lg font-medium text-[#2C231E] sm:text-xl">
                    {data.brideName} & {data.groomName}
                  </h2>
                </>
              )}

              <div className="mx-auto my-1.5 flex items-center justify-center gap-1.5">
                <span className="h-px w-5 bg-[#D4AF37]/40" />
                <Heart className="h-2.5 w-2.5 fill-[#B91C1C] text-[#B91C1C]" />
                <span className="h-px w-5 bg-[#D4AF37]/40" />
              </div>
              <p className="font-sans-clean text-[11px] font-semibold text-[#6E5946]">
                {data.weddingDate}
              </p>
              <p className="font-cinzel text-[9px] tracking-wider text-[#A38B6D] uppercase">
                {data.mainVenueName}
              </p>
            </div>
          </motion.div>

          {/* Envelope Flap (Top Triangular Fold) */}
          <motion.div
            id="envelope-flap"
            initial={{ rotateX: 0 }}
            animate={
              animationPhase === 'closed' || animationPhase === 'zooming'
                ? { rotateX: 0 }
                : { rotateX: -180, zIndex: 0 }
            }
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            style={{
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d'
            }}
            className="absolute top-0 right-0 left-0 z-20 h-[140px] drop-shadow-md"
          >
            <svg
              className="h-full w-full"
              viewBox="0 0 360 140"
              preserveAspectRatio="none"
            >
              <polygon
                points="0,0 360,0 180,140"
                fill="#F7F2E8"
                stroke="#C59B27"
                strokeWidth="1.2"
              />
              <line
                x1="0"
                y1="0"
                x2="180"
                y2="140"
                stroke="#D4AF37"
                strokeWidth="1"
                opacity="0.6"
              />
              <line
                x1="360"
                y1="0"
                x2="180"
                y2="140"
                stroke="#D4AF37"
                strokeWidth="1"
                opacity="0.6"
              />
            </svg>
          </motion.div>

          {/* Royal Wax Seal with Monogram */}
          <AnimatePresence>
            {(animationPhase === 'closed' || animationPhase === 'zooming') && (
              <motion.div
                id="envelope-wax-seal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{
                  scale: 1.4,
                  opacity: 0,
                  filter: 'blur(4px)',
                  transition: { duration: 0.3 }
                }}
                className="absolute top-[105px] left-1/2 z-30 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:top-[125px]"
              >
                {/* Gold/Burgundy Wax Seal Disc */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#871F2B] via-[#A82A3A] to-[#69141E] shadow-xl ring-2 ring-[#D4AF37]/80">
                  {/* Wax organic edge indentations */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#F3E5AB]/40 opacity-70" />
                  <span className="font-cinzel text-xs font-bold tracking-widest text-[#F9E8B2] drop-shadow">
                    {data.monogram}
                  </span>
                  {/* Gentle shine animation */}
                  <div className="pointer-events-none absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white/40 blur-[1px]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Front Envelope Pocket Facade Over Inner Card */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[150px] overflow-hidden rounded-b-xl">
            <svg
              className="h-full w-full"
              viewBox="0 0 360 150"
              preserveAspectRatio="none"
            >
              <polygon
                points="0,150 180,20 360,150"
                fill="#FAF6EE"
                stroke="#C59B27"
                strokeWidth="1.2"
              />
              <polygon
                points="0,150 180,45 360,150"
                fill="#F3ECE0"
                opacity="0.5"
              />
            </svg>
          </div>
        </motion.div>

        {/* CTA "OPEN INVITATION" Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: animationPhase === 'transitioning' ? 0 : 1,
            y: 0
          }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-col items-center"
        >
          <button
            type="button"
            id="open-invitation-btn"
            onClick={handleOpen}
            disabled={animationPhase !== 'closed'}
            className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-[#D4AF37] bg-gradient-to-r from-[#C59B27] via-[#DFBA54] to-[#B89240] px-8 py-3.5 text-sm font-semibold tracking-widest text-[#372608] shadow-lg shadow-[#D4AF37]/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#D4AF37]/40 active:scale-95 disabled:pointer-events-none disabled:opacity-70"
          >
            {/* Shimmer sweep animation */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

            <Sparkles className="h-4 w-4 text-[#422B05] transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-cinzel tracking-[0.2em] uppercase">
              {animationPhase === 'closed' ? 'Open Invitation' : 'Opening...'}
            </span>
          </button>

          <p className="mt-3 font-serif-luxury text-xs italic text-[#7C6952]">
            Tap the envelope or button to unfold the celebration
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
