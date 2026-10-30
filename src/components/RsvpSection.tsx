import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, CheckCircle2, AlertCircle, Users, Send } from 'lucide-react';
import { WeddingData, RsvpSubmission, GuestInvite } from '../types/wedding';

interface RsvpSectionProps {
  data: WeddingData;
  guestInvite?: GuestInvite | null;
  onRsvpSubmitted?: (submission: {
    attending: 'yes' | 'no';
    numberOfGuests: number;
    message: string;
    emailOrPhone: string;
  }) => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ data, guestInvite, onRsvpSubmitted }) => {
  const [guestName, setGuestName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [maxSeatsAllowed, setMaxSeatsAllowed] = useState(6);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(
    data.events.map((e) => e.id)
  );
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submittedRsvp, setSubmittedRsvp] = useState<RsvpSubmission | null>(null);

  // Sync with guest invite when passed
  useEffect(() => {
    if (guestInvite) {
      setGuestName(guestInvite.guestName);
      const parsedSeats = parseInt(String(guestInvite.seats), 10);
      if (!isNaN(parsedSeats) && parsedSeats > 0) {
        setNumberOfGuests(parsedSeats);
        setMaxSeatsAllowed(parsedSeats);
      }
      if (guestInvite.invitedEvents && guestInvite.invitedEvents.length > 0) {
        setSelectedEvents(guestInvite.invitedEvents);
      }
    }
  }, [guestInvite]);

  // Check if RSVP was previously submitted in this browser
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wedding_rsvp_submission');
      if (saved) {
        setSubmittedRsvp(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleEventToggle = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (attending === 'yes' && selectedEvents.length === 0) {
      setError('Please select at least one ceremony you plan to attend');
      return;
    }

    setError(null);

    const submission: RsvpSubmission = {
      id: Date.now().toString(),
      guestName: guestName.trim(),
      email: emailOrPhone.trim(),
      attending,
      numberOfGuests: attending === 'yes' ? numberOfGuests : 0,
      eventsAttending: attending === 'yes' ? selectedEvents : [],
      message: message.trim(),
      submittedAt: new Date().toLocaleDateString()
    };

    try {
      localStorage.setItem('wedding_rsvp_submission', JSON.stringify(submission));
      setSubmittedRsvp(submission);
    } catch {
      setSubmittedRsvp(submission);
    }

    if (onRsvpSubmitted) {
      onRsvpSubmitted({
        attending,
        numberOfGuests: attending === 'yes' ? numberOfGuests : 0,
        message: message.trim(),
        emailOrPhone: emailOrPhone.trim()
      });
    }
  };

  const handleResetRsvp = () => {
    setSubmittedRsvp(null);
    localStorage.removeItem('wedding_rsvp_submission');
  };

  return (
    <section id="rsvp-section" className="relative px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-cinzel text-xs tracking-[0.3em] text-[#8C7653] uppercase">
            Your Presence Is Our Present
          </span>
          <h2 className="font-serif-luxury mt-2 text-3xl text-[#2E241E] sm:text-4xl">
            Kindly RSVP
          </h2>
          <p className="font-serif-luxury mx-auto mt-2 max-w-md text-sm italic text-[#78634F]">
            Please honor us with your response so we may reserve your seat with joy and care.
          </p>
          <div className="mx-auto mt-3 flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-[#D4AF37]/50" />
            <Heart className="h-3.5 w-3.5 fill-[#B91C1C] text-[#B91C1C]" />
            <span className="h-px w-12 bg-[#D4AF37]/50" />
          </div>
        </motion.div>

        {/* Form or Confirmation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="parchment-card mt-8 rounded-2xl p-6 text-left sm:p-8"
        >
          <AnimatePresence mode="wait">
            {submittedRsvp ? (
              /* Success Confirmation */
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-4 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF5EB] text-emerald-600 border border-[#D4AF37]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-serif-luxury mt-4 text-2xl font-medium text-[#2E221B]">
                  Thank You, {submittedRsvp.guestName}!
                </h3>
                <p className="font-sans-clean mt-2 text-xs text-[#6F5D4B]">
                  {submittedRsvp.attending === 'yes'
                    ? `Your RSVP for ${submittedRsvp.numberOfGuests} guest(s) has been lovingly received. We cannot wait to celebrate with you!`
                    : 'We will deeply miss you, but thank you warmly for letting us know and keeping us in your prayers!'}
                </p>

                <div className="mt-6 inline-block rounded-xl border border-[#D4AF37]/30 bg-[#FAF7F2] p-4 text-left text-xs text-[#524233]">
                  <p>
                    <span className="font-semibold text-[#8C7653]">Status:</span>{' '}
                    {submittedRsvp.attending === 'yes' ? 'Attending' : 'Regretfully Unable'}
                  </p>
                  {submittedRsvp.attending === 'yes' && (
                    <p className="mt-1">
                      <span className="font-semibold text-[#8C7653]">Guests:</span>{' '}
                      {submittedRsvp.numberOfGuests}
                    </p>
                  )}
                  {submittedRsvp.message && (
                    <p className="mt-1 italic">
                      <span className="font-semibold text-[#8C7653]">Note:</span> “
                      {submittedRsvp.message}”
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleResetRsvp}
                    className="text-xs font-medium text-[#B89240] underline hover:text-[#8E6E27]"
                  >
                    Need to update your response? Click here
                  </button>
                </div>
              </motion.div>
            ) : (
              /* RSVP Form */
              <form key="form" onSubmit={handleSubmit} className="space-y-5">
                {guestInvite && (
                  <div className="rounded-xl border border-[#D4AF37]/60 bg-[#FAF3E1] p-3 text-left">
                    <span className="text-[10px] font-cinzel font-bold tracking-wider text-[#9E7A2F] uppercase block">
                      Personalized RSVP Confirmation
                    </span>
                    <p className="font-serif-luxury text-sm font-semibold text-[#2C211B] mt-0.5">
                      Welcome, {guestInvite.salutation ? `${guestInvite.salutation} ` : ''}{guestInvite.guestName}!
                    </p>
                    <p className="text-[11px] text-[#6E5742] mt-0.5">
                      We have cordially reserved <strong>{guestInvite.seats} seats</strong> in your honor. Please let us know if you will be gracing us with your presence.
                    </p>
                  </div>
                )}

                {/* Guest Name */}
                <div>
                  <label
                    htmlFor="guest-name"
                    className="block font-cinzel text-xs font-semibold tracking-wider text-[#63513F] uppercase"
                  >
                    Your Full Name *
                  </label>
                  <input
                    id="guest-name"
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Dr. Salman & Family"
                    className="mt-1.5 w-full rounded-xl border border-[#D4AF37]/40 bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#2C211B] placeholder-[#A89886] focus:border-[#C59B27] focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  />
                </div>

                {/* Email / WhatsApp Number */}
                <div>
                  <label
                    htmlFor="contact-info"
                    className="block font-cinzel text-xs font-semibold tracking-wider text-[#63513F] uppercase"
                  >
                    Phone / WhatsApp or Email
                  </label>
                  <input
                    id="contact-info"
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="e.g. +92 300 1234567 or email@example.com"
                    className="mt-1.5 w-full rounded-xl border border-[#D4AF37]/40 bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#2C211B] placeholder-[#A89886] focus:border-[#C59B27] focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  />
                </div>

                {/* Attending Toggle Buttons */}
                <div>
                  <label className="block font-cinzel text-xs font-semibold tracking-wider text-[#63513F] uppercase">
                    Will You Attend? *
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      id="attending-yes-btn"
                      onClick={() => setAttending('yes')}
                      className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold tracking-wider transition-all ${
                        attending === 'yes'
                          ? 'border-[#C59B27] bg-[#F5EBD7] text-[#3D2D1B] shadow-xs'
                          : 'border-[#D4AF37]/30 bg-[#FAF8F5] text-[#786450] hover:bg-[#F2ECE2]'
                      }`}
                    >
                      <Heart className="h-3.5 w-3.5 fill-[#B91C1C] text-[#B91C1C]" />
                      <span>Joyfully Accept</span>
                    </button>

                    <button
                      type="button"
                      id="attending-no-btn"
                      onClick={() => setAttending('no')}
                      className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold tracking-wider transition-all ${
                        attending === 'no'
                          ? 'border-[#8C7653] bg-[#EFE9DF] text-[#382C20] shadow-xs'
                          : 'border-[#D4AF37]/30 bg-[#FAF8F5] text-[#786450] hover:bg-[#F2ECE2]'
                      }`}
                    >
                      <span>Regretfully Decline</span>
                    </button>
                  </div>
                </div>

                {/* Conditional Fields if Attending */}
                {attending === 'yes' && (
                  <>
                    {/* Number of Guests */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="guest-count"
                          className="font-cinzel text-xs font-semibold tracking-wider text-[#63513F] uppercase"
                        >
                          Total Attending Guests
                        </label>
                        <span className="flex items-center gap-1 font-sans-clean text-xs text-[#96773B]">
                          <Users className="h-3.5 w-3.5" />
                          {numberOfGuests} {numberOfGuests === 1 ? 'Guest' : 'Guests'}
                        </span>
                      </div>
                      <select
                        id="guest-count"
                        value={numberOfGuests}
                        onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                        className="mt-1.5 w-full rounded-xl border border-[#D4AF37]/40 bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#2C211B] focus:border-[#C59B27] focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                      >
                        {Array.from({ length: Math.max(1, maxSeatsAllowed) }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Which Events */}
                    <div>
                      <label className="block font-cinzel text-xs font-semibold tracking-wider text-[#63513F] uppercase">
                        Events You Plan To Attend
                      </label>
                      <div className="mt-2 space-y-2">
                        {data.events.map((event) => (
                          <label
                            key={event.id}
                            className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#D4AF37]/25 bg-[#FAF8F5] p-2.5 text-xs text-[#423223] transition-colors hover:bg-[#F4ECE0]"
                          >
                            <input
                              type="checkbox"
                              checked={selectedEvents.includes(event.id)}
                              onChange={() => handleEventToggle(event.id)}
                              className="h-4 w-4 rounded-sm border-[#C59B27] text-[#C59B27] focus:ring-[#C59B27]"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold">{event.name}</span>
                              <span className="text-[11px] text-[#7A6753]">
                                {event.date}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Message */}
                <div>
                  <label
                    htmlFor="rsvp-message"
                    className="block font-cinzel text-xs font-semibold tracking-wider text-[#63513F] uppercase"
                  >
                    Warm Wishes / Dietary Notes (Optional)
                  </label>
                  <textarea
                    id="rsvp-message"
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share any blessings, food preferences, or note for the couple..."
                    className="mt-1.5 w-full rounded-xl border border-[#D4AF37]/40 bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#2C211B] placeholder-[#A89886] focus:border-[#C59B27] focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  id="send-rsvp-btn"
                  className="w-full flex items-center justify-center gap-2 rounded-full border border-[#D4AF37] bg-gradient-to-r from-[#C59B27] via-[#DFBA54] to-[#B89240] py-3 text-sm font-semibold tracking-widest text-[#372608] shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send className="h-4 w-4 text-[#372608]" />
                  <span className="font-cinzel uppercase">Send RSVP</span>
                </button>
              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
