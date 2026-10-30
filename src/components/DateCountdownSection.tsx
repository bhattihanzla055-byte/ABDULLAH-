import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, BellRing, Download } from 'lucide-react';
import { WeddingData } from '../types/wedding';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

interface DateCountdownSectionProps {
  data: WeddingData;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const DateCountdownSection: React.FC<DateCountdownSectionProps> = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(data.weddingIsoDateTime).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [data.weddingIsoDateTime]);

  const googleCalUrl = getGoogleCalendarUrl(
    `Wedding Celebration of ${data.brideName} & ${data.groomName}`,
    `You are cordially invited to celebrate the wedding of ${data.brideName} & ${data.groomName}. Venue: ${data.mainVenueName}, ${data.mainVenueAddress}`,
    data.mainVenueAddress,
    data.weddingIsoDateTime
  );

  const handleDownloadIcs = () => {
    downloadIcsFile(
      `Wedding Celebration of ${data.brideName} & ${data.groomName}`,
      `You are cordially invited to celebrate the wedding of ${data.brideName} & ${data.groomName}. Venue: ${data.mainVenueName}, ${data.mainVenueAddress}`,
      data.mainVenueAddress,
      data.weddingIsoDateTime
    );
  };

  return (
    <section id="date-countdown-section" className="relative px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-cinzel text-xs tracking-[0.3em] text-[#8C7653] uppercase">
            Save The Date
          </span>
          <h2 className="font-serif-luxury mt-2 text-3xl text-[#2E241E] sm:text-4xl">
            The Auspicious Day
          </h2>
          <div className="mx-auto mt-3 flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-[#D4AF37]/50" />
            <span className="text-[#C59B27]">❦</span>
            <span className="h-px w-12 bg-[#D4AF37]/50" />
          </div>
        </motion.div>

        {/* Date & Time Highlight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="parchment-card mt-8 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center gap-2 text-[#99773D]">
              <Calendar className="h-5 w-5 text-[#C59B27]" />
              <span className="font-cinzel text-xs tracking-widest uppercase">Ceremony Date</span>
            </div>

            <p className="font-serif-luxury text-3xl font-medium tracking-wide text-[#2C211B] sm:text-4xl">
              {data.weddingDate}
            </p>

            <div className="flex items-center gap-2 text-sm text-[#735F4C]">
              <Clock className="h-4 w-4 text-[#B89240]" />
              <span>{data.weddingTime}</span>
            </div>
          </div>

          {/* Countdown Clock or Celebration Message */}
          <div className="mt-8 border-t border-[#D4AF37]/25 pt-8">
            {timeLeft.isPast ? (
              <div className="rounded-xl bg-[#FAF5EB] p-4 text-[#4A3B2C] border border-[#D4AF37]/30">
                <p className="font-serif-luxury text-2xl text-[#871F2B]">
                  Happily Ever After Has Begun!
                </p>
                <p className="font-sans-clean mt-1 text-xs text-[#7A6753]">
                  Thank you for keeping {data.brideName} & {data.groomName} in your heartfelt prayers and blessings.
                </p>
              </div>
            ) : (
              <div>
                <p className="font-cinzel mb-4 text-[11px] tracking-[0.25em] text-[#8C7653] uppercase">
                  Counting Down Every Precious Moment
                </p>
                <div className="grid grid-cols-4 gap-2 sm:gap-4">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Minutes', value: timeLeft.minutes },
                    { label: 'Seconds', value: timeLeft.seconds }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#FAF7F2] p-3 shadow-xs"
                    >
                      <span className="font-serif-luxury text-2xl font-semibold text-[#2C211B] sm:text-3xl">
                        {String(item.value).padStart(2, '0')}
                      </span>
                      <span className="font-cinzel mt-1 text-[9px] tracking-wider text-[#8A755D] uppercase sm:text-[10px]">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add to Calendar Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/60 bg-[#FAF5EB] px-4 py-2 text-xs font-semibold tracking-wider text-[#4A3A26] transition-colors hover:bg-[#F2E5D0]"
            >
              <BellRing className="h-3.5 w-3.5 text-[#B89240]" />
              <span className="font-cinzel">Google Calendar</span>
            </a>

            <button
              type="button"
              onClick={handleDownloadIcs}
              className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/60 bg-[#FAF5EB] px-4 py-2 text-xs font-semibold tracking-wider text-[#4A3A26] transition-colors hover:bg-[#F2E5D0]"
            >
              <Download className="h-3.5 w-3.5 text-[#B89240]" />
              <span className="font-cinzel">Apple / Outlook iCal</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
