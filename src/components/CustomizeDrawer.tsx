import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, X, RotateCcw, Check, Sparkles, UserPlus, Users } from 'lucide-react';
import { WeddingData } from '../types/wedding';

interface CustomizeDrawerProps {
  data: WeddingData;
  onUpdateData: (newData: WeddingData) => void;
  onResetDefaults: () => void;
  onOpenGuestManager?: () => void;
}

export const CustomizeDrawer: React.FC<CustomizeDrawerProps> = ({
  data,
  onUpdateData,
  onResetDefaults,
  onOpenGuestManager
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<WeddingData>(data);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when props change
  React.useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (field: keyof WeddingData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateData(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsOpen(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Settings/Customize Trigger Button */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          type="button"
          id="customize-invitation-btn"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 rounded-full border border-[#D4AF37]/80 bg-white/95 px-3.5 py-2.5 text-xs font-semibold text-[#665039] shadow-lg backdrop-blur-xs transition-all hover:scale-105 hover:bg-[#FAF6EE] active:scale-95"
          title="Edit bride & groom names, date, venue, etc."
        >
          <SlidersHorizontal className="h-4 w-4 text-[#C59B27]" />
          <span className="hidden sm:inline font-cinzel">Customize</span>
        </button>
      </div>

      {/* Slide-over Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="flex h-full w-full max-w-md flex-col bg-[#FAF7F2] shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#D4AF37]/30 bg-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#C59B27]" />
                  <h3 className="font-serif-luxury text-xl font-medium text-[#2E221B]">
                    Customize Invitation
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
                {/* Couple Names */}
                <div className="space-y-3">
                  <h4 className="font-cinzel text-xs font-bold tracking-wider text-[#8A7151] uppercase">
                    1. Couple Information
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-[#524131]">Bride Name</label>
                    <input
                      type="text"
                      value={formData.brideName}
                      onChange={(e) => handleChange('brideName', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A2017]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#524131]">Bride Full Name</label>
                    <input
                      type="text"
                      value={formData.brideFullName}
                      onChange={(e) => handleChange('brideFullName', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A2017]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#524131]">Bride Parents</label>
                    <input
                      type="text"
                      value={formData.brideParents}
                      onChange={(e) => handleChange('brideParents', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A2017]"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-medium text-[#524131]">Groom Name</label>
                    <input
                      type="text"
                      value={formData.groomName}
                      onChange={(e) => handleChange('groomName', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A2017]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#524131]">Groom Full Name</label>
                    <input
                      type="text"
                      value={formData.groomFullName}
                      onChange={(e) => handleChange('groomFullName', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A2017]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#524131]">Groom Parents</label>
                    <input
                      type="text"
                      value={formData.groomParents}
                      onChange={(e) => handleChange('groomParents', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A2017]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#524131]">Monogram (Seal)</label>
                    <input
                      type="text"
                      value={formData.monogram}
                      onChange={(e) => handleChange('monogram', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A2017]"
                    />
                  </div>
                </div>

                {/* Wedding Date & Time */}
                <div className="space-y-3 pt-4 border-t border-[#D4AF37]/20">
                  <h4 className="font-cinzel text-xs font-bold tracking-wider text-[#8A7151] uppercase">
                    2. Wedding Date & Countdown
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-[#524131]">Display Date</label>
                    <input
                      type="text"
                      value={formData.weddingDate}
                      onChange={(e) => handleChange('weddingDate', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A2017]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#524131]">Display Time</label>
                    <input
                      type="text"
                      value={formData.weddingTime}
                      onChange={(e) => handleChange('weddingTime', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A2017]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#524131]">
                      ISO Date (for Countdown Timer)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.weddingIsoDateTime.slice(0, 16)}
                      onChange={(e) =>
                        handleChange('weddingIsoDateTime', `${e.target.value}:00`)
                      }
                      className="mt-1 w-full rounded-lg border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A2017]"
                    />
                  </div>
                </div>

                {/* Venue Details */}
                <div className="space-y-3 pt-4 border-t border-[#D4AF37]/20">
                  <h4 className="font-cinzel text-xs font-bold tracking-wider text-[#8A7151] uppercase">
                    3. Venue & Location
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-[#524131]">Venue Name</label>
                    <input
                      type="text"
                      value={formData.mainVenueName}
                      onChange={(e) => handleChange('mainVenueName', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A2017]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#524131]">Venue Address</label>
                    <textarea
                      rows={2}
                      value={formData.mainVenueAddress}
                      onChange={(e) => handleChange('mainVenueAddress', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A2017]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#524131]">
                      Google Maps URL
                    </label>
                    <input
                      type="text"
                      value={formData.googleMapsUrl}
                      onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A2017]"
                    />
                  </div>
                </div>

                {/* Photos & Music */}
                <div className="space-y-3 pt-4 border-t border-[#D4AF37]/20">
                  <h4 className="font-cinzel text-xs font-bold tracking-wider text-[#8A7151] uppercase">
                    4. Wedding Portrait & Music
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-[#524131]">Wedding Couple Portrait</label>
                    <input
                      type="text"
                      value={formData.couplePhoto}
                      onChange={(e) => handleChange('couplePhoto', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A2017]"
                    />
                  </div>

                  <div className="pt-2 border-t border-[#D4AF37]/20">
                    <label className="block text-xs font-medium text-[#524131]">
                      YouTube Wedding Song URL
                    </label>
                    <input
                      type="text"
                      value={formData.youtubeUrl || ''}
                      placeholder="e.g. https://youtu.be/HD4UtsmAV4Y"
                      onChange={(e) => {
                        const val = e.target.value;
                        const match = val.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                        setFormData((prev) => ({
                          ...prev,
                          youtubeUrl: val,
                          youtubeVideoId: match ? match[1] : (val.length === 11 ? val : prev.youtubeVideoId)
                        }));
                      }}
                      className="mt-1 w-full rounded-lg border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A2017]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#524131]">Song Title</label>
                    <input
                      type="text"
                      value={formData.musicTitle}
                      onChange={(e) => handleChange('musicTitle', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A2017]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#524131]">Song Artist / Singer</label>
                    <input
                      type="text"
                      value={formData.musicArtist || ''}
                      onChange={(e) => handleChange('musicArtist', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A2017]"
                    />
                  </div>
                </div>

                {/* Section 5: Unique Guest Invites & Personalized Forms */}
                {onOpenGuestManager && (
                  <div className="rounded-xl border-2 border-[#D4AF37] bg-gradient-to-br from-[#FFFDF8] via-[#FAF4E5] to-[#F5EED8] p-4 text-left shadow-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#A68332]" />
                      <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#694E27]">
                        Unique Guest Invites (ہر مہمان کا فارم)
                      </h4>
                    </div>
                    <p className="mt-1 font-sans-clean text-xs leading-relaxed text-[#755D44]">
                      Fill out a personalized invitation form for each guest/family with custom seats reserved, specific ceremonies invited to, and a personal message.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onOpenGuestManager();
                      }}
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[#D4AF37] bg-white px-4 py-2 text-xs font-bold text-[#6B5127] shadow-xs hover:bg-[#FAF5EB] transition-all"
                    >
                      <UserPlus className="h-3.5 w-3.5 text-[#C59B27]" />
                      <span>Open Guest Invites Form & Generator</span>
                    </button>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="sticky bottom-0 bg-[#FAF7F2] pt-4 border-t border-[#D4AF37]/30 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={onResetDefaults}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[#D4AF37] bg-gradient-to-r from-[#C59B27] via-[#DFBA54] to-[#B89240] py-2 text-xs font-semibold text-[#372608] shadow-sm hover:scale-[1.02]"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Changes Applied!</span>
                      </>
                    ) : (
                      <span>Apply & Preview</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
