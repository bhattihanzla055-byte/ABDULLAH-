import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, HeartHandshake, Utensils, MapPin, Clock, Calendar, Navigation } from 'lucide-react';
import { WeddingEvent, GuestInvite } from '../types/wedding';
import { getGoogleCalendarUrl } from '../utils/calendar';

interface EventsSectionProps {
  events: WeddingEvent[];
  guestInvite?: GuestInvite | null;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events, guestInvite }) => {
  const getEventIcon = (id: string) => {
    switch (id) {
      case 'mehndi':
        return <Sparkles className="h-6 w-6 text-[#D97706]" />;
      case 'barat':
        return <HeartHandshake className="h-6 w-6 text-[#B91C1C]" />;
      case 'walima':
        return <Utensils className="h-6 w-6 text-[#047857]" />;
      default:
        return <Sparkles className="h-6 w-6 text-[#B89240]" />;
    }
  };

  return (
    <section id="wedding-events-section" className="relative px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-cinzel text-xs tracking-[0.3em] text-[#8C7653] uppercase">
            Wedding Itinerary
          </span>
          <h2 className="font-serif-luxury mt-2 text-3xl text-[#2E241E] sm:text-4xl">
            Ceremonies & Celebrations
          </h2>
          <p className="font-serif-luxury mx-auto mt-2 max-w-md text-sm italic text-[#78634F]">
            We look forward to celebrating each precious milestone together with your laughter and prayers.
          </p>
          <div className="mx-auto mt-3 flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-[#D4AF37]/50" />
            <span className="text-[#C59B27]">✦</span>
            <span className="h-px w-12 bg-[#D4AF37]/50" />
          </div>
        </motion.div>

        {/* Timeline Cards */}
        <div className="mt-12 space-y-8">
          {events.map((event, index) => {
            const calUrl = getGoogleCalendarUrl(
              event.name,
              `${event.subtitle || ''} - ${event.description}. Venue: ${event.venue}, ${event.address}`,
              event.address,
              event.isoDate
            );

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                className="parchment-card group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-xl sm:p-8"
              >
                {/* Top subtle color indicator line */}
                <div
                  className="absolute top-0 inset-x-0 h-1"
                  style={{ backgroundColor: event.themeColor || '#D4AF37' }}
                />

                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  {/* Event Details Left */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF5EB] border border-[#D4AF37]/40 shadow-xs">
                        {getEventIcon(event.id)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-cinzel text-lg font-bold tracking-wider text-[#2A2019] sm:text-xl">
                            {event.name}
                          </h3>
                          {guestInvite && (
                            guestInvite.invitedEvents.includes(event.id) ? (
                              <span className="rounded-full bg-[#FAF0D4] border border-[#D4AF37] px-2.5 py-0.5 text-[10px] font-bold text-[#8A6A27] shadow-2xs">
                                ✓ You Are Warmly Invited
                              </span>
                            ) : (
                              <span className="rounded-full bg-gray-100 border border-gray-300 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                                Family Gathering
                              </span>
                            )
                          )}
                        </div>
                        {event.subtitle && (
                          <p className="font-serif-luxury text-xs italic text-[#7A6450]">
                            {event.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="font-sans-clean text-xs leading-relaxed text-[#5F4E3E] max-w-lg">
                      {event.description}
                    </p>

                    {event.dressCode && (
                      <div className="inline-block rounded-md bg-[#FAF5EB] px-2.5 py-1 text-[11px] text-[#7A624A] border border-[#D4AF37]/30">
                        <span className="font-cinzel font-semibold">Dress Code: </span>
                        {event.dressCode}
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Timing & Location Grid */}
                <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[#D4AF37]/20 pt-4 sm:grid-cols-2">
                  <div className="flex items-start gap-2.5 text-xs text-[#524234]">
                    <Calendar className="h-4 w-4 shrink-0 text-[#B89240]" />
                    <div>
                      <p className="font-semibold">{event.date}</p>
                      <p className="flex items-center gap-1 text-[#786450]">
                        <Clock className="h-3 w-3" /> {event.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#524234]">
                    <MapPin className="h-4 w-4 shrink-0 text-[#B89240]" />
                    <div>
                      <p className="font-semibold">{event.venue}</p>
                      <p className="text-[#786450]">{event.address}</p>
                    </div>
                  </div>
                </div>

                {/* Event Action Buttons */}
                <div className="mt-5 flex flex-wrap items-center gap-3 pt-3 border-t border-[#D4AF37]/15">
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-[#FAF7F2] px-3.5 py-1.5 text-xs font-medium text-[#4D3D2C] transition-colors hover:bg-[#F3E7D3]"
                  >
                    <Navigation className="h-3 w-3 text-[#B89240]" />
                    <span>View Map & Directions</span>
                  </a>

                  <a
                    href={calUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-[#FAF7F2] px-3.5 py-1.5 text-xs font-medium text-[#4D3D2C] transition-colors hover:bg-[#F3E7D3]"
                  >
                    <Calendar className="h-3 w-3 text-[#B89240]" />
                    <span>Add to Calendar</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
