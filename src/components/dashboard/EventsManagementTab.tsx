import React, { useState } from 'react';
import { WeddingProject } from '../../types/platform';
import { WeddingEvent } from '../../types/wedding';
import { Calendar, Plus, Edit2, Trash2, ArrowUp, ArrowDown, MapPin, Clock, Shirt, Sparkles, Check } from 'lucide-react';

interface EventsManagementTabProps {
  project: WeddingProject;
  onSaveEvents: (events: WeddingEvent[]) => void;
}

export const EventsManagementTab: React.FC<EventsManagementTabProps> = ({ project, onSaveEvents }) => {
  const [events, setEvents] = useState<WeddingEvent[]>([...project.weddingData.events]);
  const [editingEvent, setEditingEvent] = useState<WeddingEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Template suggestions
  const eventTemplates = [
    { name: 'ENGAGEMENT CEREMONY', subtitle: 'Ring Ceremony & High Tea', themeColor: '#C06B78', dressCode: 'Semi-Formal Chic' },
    { name: 'DHOLKI & MAYUN', subtitle: 'Traditional Songs, Haldi & Laughter', themeColor: '#D97706', dressCode: 'Festive Mustard & Yellows' },
    { name: 'MEHNDI CELEBRATION', subtitle: 'Henna Night & Vibrant Dances', themeColor: '#059669', dressCode: 'Traditional Greens & Pinks' },
    { name: 'NIKKAH CEREMONY', subtitle: 'The Sacred Vows & Solemnization', themeColor: '#1B5E43', dressCode: 'White, Gold & Formal' },
    { name: 'BARAT PROCESSION', subtitle: 'The Grand Wedding & Feast', themeColor: '#8E1624', dressCode: 'Royal Traditional / Black Tie' },
    { name: 'WALIMA RECEPTION', subtitle: 'Family Banquet & Reception', themeColor: '#1E3A8A', dressCode: 'Modern Royal Pastels' },
    { name: 'QAWWALI / SUFI NIGHT', subtitle: 'Soulful Music & Bonfire', themeColor: '#581C87', dressCode: 'Velvet & Winter Festive' }
  ];

  const handleOpenAddModal = (template?: typeof eventTemplates[0]) => {
    const newEvent: WeddingEvent = {
      id: `evt-${Date.now()}`,
      name: template ? template.name : 'MEHNDI CELEBRATION',
      subtitle: template ? template.subtitle : 'An Evening of Henna & Folk Songs',
      date: 'Friday, 24 December 2026',
      isoDate: '2026-12-24T19:00:00',
      time: '7:00 PM Onwards',
      venue: 'The Grand Ballroom',
      address: 'Gulberg III, Lahore',
      mapUrl: 'https://maps.google.com/?q=Lahore',
      description: 'We warmly welcome you to join our joyful festivities with family and friends.',
      dressCode: template ? template.dressCode : 'Traditional Festive',
      themeColor: template ? template.themeColor : '#D97706'
    };
    setEditingEvent(newEvent);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    const existingIdx = events.findIndex((ev) => ev.id === editingEvent.id);
    let updated: WeddingEvent[];
    if (existingIdx >= 0) {
      updated = [...events];
      updated[existingIdx] = editingEvent;
    } else {
      updated = [...events, editingEvent];
    }

    setEvents(updated);
    onSaveEvents(updated);
    setIsModalOpen(false);
    setEditingEvent(null);
    triggerSaved();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this event?')) {
      const updated = events.filter((ev) => ev.id !== id);
      setEvents(updated);
      onSaveEvents(updated);
      triggerSaved();
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= events.length) return;

    const updated = [...events];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    setEvents(updated);
    onSaveEvents(updated);
    triggerSaved();
  };

  const triggerSaved = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#EAE1D2] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#2A2016] font-cinzel">
              Wedding Functions & Events ({events.length})
            </h3>
            {savedFeedback && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                <Check className="h-3 w-3" /> Saved!
              </span>
            )}
          </div>
          <p className="text-xs text-[#7A6B5C]">
            Add ceremonies (Mehndi, Barat, Walima, Dholki, etc.). Events appear on cards in the exact order below.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenAddModal()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C59B27] to-[#DFBA54] px-4 py-2.5 text-xs font-bold text-[#2E2008] shadow-xs hover:scale-102 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Event</span>
        </button>
      </div>

      {/* Quick Add Preset Bar */}
      <div className="rounded-xl border border-[#EAE1D2] bg-[#FAF8F5] p-3.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C7653] font-cinzel mb-2">
          ⚡ Quick Add Pre-configured Ceremonies:
        </p>
        <div className="flex flex-wrap gap-2">
          {eventTemplates.map((tmpl) => (
            <button
              key={tmpl.name}
              type="button"
              onClick={() => handleOpenAddModal(tmpl)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9CBB5] bg-white px-2.5 py-1.5 text-xs font-medium text-[#4A3D2F] hover:border-[#C59B27] hover:bg-[#FFFDF9] transition"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: tmpl.themeColor }}
              />
              <span>+ {tmpl.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="group rounded-2xl border border-[#EAE1D2] bg-white p-4 sm:p-5 shadow-xs transition hover:border-[#C59B27]/50 hover:shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-3">
                {/* Order and Color Badge */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white font-bold font-cinzel text-xs shadow-xs"
                  style={{ backgroundColor: event.themeColor || '#C59B27' }}
                >
                  #{index + 1}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-bold text-[#2A2016] font-cinzel">
                      {event.name}
                    </h4>
                    {event.subtitle && (
                      <span className="text-xs text-[#8C7653] italic font-serif-luxury">
                        — {event.subtitle}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5C4D3E]">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#8C6D28]">
                      <Calendar className="h-3.5 w-3.5" />
                      {event.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#7A6B5C]" />
                      {event.time}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                      {event.venue}
                    </span>
                    {event.dressCode && (
                      <span className="inline-flex items-center gap-1 text-[11px] bg-[#FAF5EB] text-[#8C6D28] px-2 py-0.5 rounded-full border border-[#EAE1D2]">
                        <Shirt className="h-3 w-3" />
                        {event.dressCode}
                      </span>
                    )}
                  </div>

                  {event.description && (
                    <p className="mt-2 text-xs text-[#6B5A4B] line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 self-end sm:self-center">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, 'up')}
                  className="rounded-lg p-1.5 text-[#7A6B5C] hover:bg-[#FAF6EE] disabled:opacity-30 disabled:pointer-events-none"
                  title="Move Up"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={index === events.length - 1}
                  onClick={() => handleMove(index, 'down')}
                  className="rounded-lg p-1.5 text-[#7A6B5C] hover:bg-[#FAF6EE] disabled:opacity-30 disabled:pointer-events-none"
                  title="Move Down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent({ ...event });
                    setIsModalOpen(true);
                  }}
                  className="rounded-lg p-1.5 text-[#8C6D28] hover:bg-[#FAF6EE]"
                  title="Edit Event"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(event.id)}
                  className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50"
                  title="Delete Event"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-[#D9CBB5] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h4 className="text-base font-bold text-[#2A2016] font-cinzel mb-4 pb-2 border-b border-[#EAE1D2]">
              {events.some((e) => e.id === editingEvent.id) ? 'Edit Wedding Event' : 'Add New Wedding Event'}
            </h4>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.name}
                  onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                  className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                  placeholder="e.g. MEHNDI NIGHT"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                  Subtitle / Theme
                </label>
                <input
                  type="text"
                  value={editingEvent.subtitle || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, subtitle: e.target.value })}
                  className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                  placeholder="e.g. Henna, Songs & Festive Celebrations"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                    Event Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                    placeholder="e.g. Friday, 24 December 2026"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                    Start Time / Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                    placeholder="e.g. 7:00 PM onwards"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                  Venue Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.venue}
                  onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                  className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                  placeholder="e.g. Pearl Continental Crystal Ballroom"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                  Venue Address
                </label>
                <input
                  type="text"
                  value={editingEvent.address}
                  onChange={(e) => setEditingEvent({ ...editingEvent, address: e.target.value })}
                  className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                  placeholder="e.g. Shahrah-e-Quaid-e-Azam, Lahore"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  value={editingEvent.mapUrl}
                  onChange={(e) => setEditingEvent({ ...editingEvent, mapUrl: e.target.value })}
                  className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-xs text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                  placeholder="https://maps.google.com/?q=..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                    Dress Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingEvent.dressCode || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, dressCode: e.target.value })}
                    className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-xs text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                    placeholder="e.g. Traditional Festive Green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                    Accent Theme Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editingEvent.themeColor || '#C59B27'}
                      onChange={(e) => setEditingEvent({ ...editingEvent, themeColor: e.target.value })}
                      className="h-8 w-12 rounded cursor-pointer border border-[#D9CBB5]"
                    />
                    <input
                      type="text"
                      value={editingEvent.themeColor || '#C59B27'}
                      onChange={(e) => setEditingEvent({ ...editingEvent, themeColor: e.target.value })}
                      className="w-full rounded-xl border border-[#D9CBB5] px-3 py-1.5 text-xs text-[#2D2318]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                  Description / Special Note
                </label>
                <textarea
                  rows={2}
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-xs text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                  placeholder="A short welcoming note regarding the ceremony..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE1D2]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[#D9CBB5] px-4 py-2 text-xs font-semibold text-[#5C4D3E] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#C59B27] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#B38A1F]"
                >
                  Save Function
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
