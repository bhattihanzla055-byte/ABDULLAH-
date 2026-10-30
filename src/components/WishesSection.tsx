import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Send, MessageSquareHeart } from 'lucide-react';
import { GuestWish } from '../types/wedding';

interface WishesSectionProps {
  initialWishes: GuestWish[];
}

export const WishesSection: React.FC<WishesSectionProps> = ({ initialWishes }) => {
  const [wishes, setWishes] = useState<GuestWish[]>(initialWishes);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  // Load user submitted wishes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wedding_guest_wishes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWishes([...parsed, ...initialWishes]);
        }
      }
    } catch {
      // ignore
    }
  }, [initialWishes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newWish: GuestWish = {
      id: Date.now().toString(),
      name: name.trim(),
      relation: relation.trim() || 'Well Wisher',
      message: message.trim(),
      timestamp: 'Just now'
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);

    try {
      const saved = localStorage.getItem('wedding_guest_wishes');
      const parsed = saved ? JSON.parse(saved) : [];
      localStorage.setItem('wedding_guest_wishes', JSON.stringify([newWish, ...parsed]));
    } catch {
      // ignore
    }

    setName('');
    setRelation('');
    setMessage('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3500);
  };

  return (
    <section id="guest-wishes-section" className="relative px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-cinzel text-xs tracking-[0.3em] text-[#8C7653] uppercase">
            Blessings Wall
          </span>
          <h2 className="font-serif-luxury mt-2 text-3xl text-[#2E241E] sm:text-4xl">
            Send Your Wishes ❤️
          </h2>
          <p className="font-serif-luxury mx-auto mt-2 max-w-md text-sm italic text-[#78634F]">
            Leave your warm duas and love for the beginning of our new chapter together.
          </p>
          <div className="mx-auto mt-3 flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-[#D4AF37]/50" />
            <Heart className="h-3.5 w-3.5 fill-[#B91C1C] text-[#B91C1C]" />
            <span className="h-px w-12 bg-[#D4AF37]/50" />
          </div>
        </motion.div>

        {/* Wishes Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="parchment-card mt-8 rounded-2xl p-6 text-left sm:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="wish-name"
                  className="block font-cinzel text-[11px] font-semibold tracking-wider text-[#63513F] uppercase"
                >
                  Your Name *
                </label>
                <input
                  id="wish-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ayesha & Tariq"
                  className="mt-1 w-full rounded-xl border border-[#D4AF37]/40 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C211B] placeholder-[#A89886] focus:border-[#C59B27] focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                />
              </div>

              <div>
                <label
                  htmlFor="wish-relation"
                  className="block font-cinzel text-[11px] font-semibold tracking-wider text-[#63513F] uppercase"
                >
                  Relation / Friend (Optional)
                </label>
                <input
                  id="wish-relation"
                  type="text"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  placeholder="e.g. Bride's Cousin, College Friend"
                  className="mt-1 w-full rounded-xl border border-[#D4AF37]/40 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C211B] placeholder-[#A89886] focus:border-[#C59B27] focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="wish-message"
                className="block font-cinzel text-[11px] font-semibold tracking-wider text-[#63513F] uppercase"
              >
                Your Message / Dua *
              </label>
              <textarea
                id="wish-message"
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your prayers, blessings and congratulatory message..."
                className="mt-1 w-full rounded-xl border border-[#D4AF37]/40 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C211B] placeholder-[#A89886] focus:border-[#C59B27] focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {success ? (
                <span className="text-xs text-emerald-700 font-medium">
                  ✨ Blessing posted with love!
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                id="submit-wish-btn"
                className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37] bg-gradient-to-r from-[#C59B27] via-[#DFBA54] to-[#B89240] px-5 py-2 text-xs font-semibold tracking-wider text-[#352509] shadow-sm transition-transform hover:scale-105"
              >
                <Send className="h-3 w-3" />
                <span className="font-cinzel uppercase">Post Blessing</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Existing Wishes Cards List */}
        <div className="mt-8 space-y-4 text-left">
          {wishes.map((w, index) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="parchment-card rounded-xl border border-[#D4AF37]/25 p-5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF5EB] text-[#C59B27] border border-[#D4AF37]/30">
                    <MessageSquareHeart className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-serif-luxury text-base font-semibold text-[#2C211B]">
                      {w.name}
                    </span>
                    {w.relation && (
                      <span className="ml-2 font-sans-clean text-[11px] text-[#8A755E]">
                        ({w.relation})
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-sans-clean text-[10px] text-[#A69584]">
                  {w.timestamp}
                </span>
              </div>
              <p className="font-serif-luxury mt-3 text-xs italic leading-relaxed text-[#564535] sm:text-sm">
                “{w.message}”
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
