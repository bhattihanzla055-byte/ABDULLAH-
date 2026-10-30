import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  UserPlus,
  Users,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Edit2,
  Trash2,
  Sparkles,
  MessageCircle,
  Eye,
  CheckSquare,
  Square
} from 'lucide-react';
import { GuestInvite, WeddingData } from '../types/wedding';
import {
  generateInviteUrl,
  createWhatsAppInviteMessage,
  saveGuestInvites
} from '../utils/inviteHelper';

interface GuestInviteManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  weddingData: WeddingData;
  guestInvites: GuestInvite[];
  onUpdateInvites: (newInvites: GuestInvite[]) => void;
  activeGuestInvite: GuestInvite | null;
  onSelectActiveGuest: (invite: GuestInvite | null) => void;
}

export const GuestInviteManagerModal: React.FC<GuestInviteManagerModalProps> = ({
  isOpen,
  onClose,
  weddingData,
  guestInvites,
  onUpdateInvites,
  activeGuestInvite,
  onSelectActiveGuest
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [editingInviteId, setEditingInviteId] = useState<string | null>(null);

  // Form State
  const [guestName, setGuestName] = useState('');
  const [salutation, setSalutation] = useState('Respected / معزز جناب');
  const [customSalutation, setCustomSalutation] = useState('');
  const [side, setSide] = useState<'both' | 'bride' | 'groom'>('both');
  const [seats, setSeats] = useState('2');
  const [invitedEvents, setInvitedEvents] = useState<string[]>([
    'mehndi',
    'barat',
    'walima'
  ]);
  const [personalNote, setPersonalNote] = useState('');
  const [tableOrEnclosure, setTableOrEnclosure] = useState('');
  const [phone, setPhone] = useState('');

  // UI state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setGuestName('');
    setSalutation('Respected / معزز جناب');
    setCustomSalutation('');
    setSide('both');
    setSeats('2');
    setInvitedEvents(['mehndi', 'barat', 'walima']);
    setPersonalNote('');
    setTableOrEnclosure('');
    setPhone('');
    setEditingInviteId(null);
  };

  const handleOpenCreateForm = () => {
    resetForm();
    setActiveTab('form');
  };

  const handleEditInvite = (invite: GuestInvite) => {
    setEditingInviteId(invite.id);
    setGuestName(invite.guestName);
    setSalutation(invite.salutation || 'Respected / معزز جناب');
    setSide(invite.side || 'both');
    setSeats(String(invite.seats || '2'));
    setInvitedEvents(
      invite.invitedEvents && invite.invitedEvents.length > 0
        ? invite.invitedEvents
        : ['mehndi', 'barat', 'walima']
    );
    setPersonalNote(invite.personalNote || '');
    setTableOrEnclosure(invite.tableOrEnclosure || '');
    setPhone(invite.phone || '');
    setActiveTab('form');
  };

  const handleToggleEvent = (eventId: string) => {
    if (invitedEvents.includes(eventId)) {
      if (invitedEvents.length === 1) return; // Must have at least one event
      setInvitedEvents(invitedEvents.filter((id) => id !== eventId));
    } else {
      setInvitedEvents([...invitedEvents, eventId]);
    }
  };

  const handleSaveForm = (e: React.FormEvent, andPreview = false) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const finalSalutation =
      salutation === 'Other' ? customSalutation : salutation;

    let updatedList: GuestInvite[];
    let targetInvite: GuestInvite;

    if (editingInviteId) {
      targetInvite = {
        id: editingInviteId,
        guestName: guestName.trim(),
        salutation: finalSalutation,
        side,
        seats,
        invitedEvents,
        personalNote: personalNote.trim() || undefined,
        tableOrEnclosure: tableOrEnclosure.trim() || undefined,
        phone: phone.trim() || undefined,
        createdAt: new Date().toISOString()
      };
      updatedList = guestInvites.map((inv) =>
        inv.id === editingInviteId ? targetInvite : inv
      );
    } else {
      targetInvite = {
        id: `invite-${Date.now()}`,
        guestName: guestName.trim(),
        salutation: finalSalutation,
        side,
        seats,
        invitedEvents,
        personalNote: personalNote.trim() || undefined,
        tableOrEnclosure: tableOrEnclosure.trim() || undefined,
        phone: phone.trim() || undefined,
        createdAt: new Date().toISOString()
      };
      updatedList = [targetInvite, ...guestInvites];
    }

    onUpdateInvites(updatedList);
    saveGuestInvites(updatedList);

    setFormSuccessMessage(`Invitation for "${targetInvite.guestName}" saved!`);
    setTimeout(() => setFormSuccessMessage(null), 2500);

    if (andPreview) {
      onSelectActiveGuest(targetInvite);
      onClose();
    } else {
      resetForm();
      setActiveTab('list');
    }
  };

  const handleDeleteInvite = (id: string) => {
    const updated = guestInvites.filter((inv) => inv.id !== id);
    onUpdateInvites(updated);
    saveGuestInvites(updated);
    if (activeGuestInvite?.id === id) {
      onSelectActiveGuest(null);
    }
  };

  const handleCopyLink = async (invite: GuestInvite) => {
    const url = generateInviteUrl(invite);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(invite.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
      prompt('Copy your invitation link:', url);
    }
  };

  const handleSendWhatsApp = (invite: GuestInvite) => {
    const url = generateInviteUrl(invite);
    const msg = createWhatsAppInviteMessage(invite, weddingData, url);
    const encoded = encodeURIComponent(msg);
    const cleanPhone = invite.phone ? invite.phone.replace(/[^\d]/g, '') : '';
    const whatsappUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;

    window.open(whatsappUrl, '_blank');
  };

  const filteredInvites = guestInvites.filter((inv) =>
    inv.guestName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSeats = guestInvites.reduce((acc, curr) => {
    const num = parseInt(String(curr.seats), 10);
    return acc + (isNaN(num) ? 2 : num);
  }, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl border-2 border-[#D4AF37] bg-[#FAF7F2] shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#D4AF37]/40 bg-gradient-to-r from-[#FFFFFF] via-[#FAF6ED] to-[#FFFFFF] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37] bg-[#FAF3E1] text-[#9E7A2F]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#2F221A]">
                Guest Invites & Personalized Forms
              </h3>
              <p className="font-sans-clean text-xs text-[#7A6451]">
                ہر مہمان کے لیے الگ دعوتی فارم بھریں، لنک بنائیں اور واٹس ایپ پر بھیجیں
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-[#F2E8D5] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector & Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D4AF37]/30 bg-[#F5EFE4] px-5 py-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'list'
                  ? 'bg-[#C59B27] text-white shadow-sm'
                  : 'bg-white/80 text-[#6C5642] hover:bg-white'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>All Guest Invites ({guestInvites.length})</span>
            </button>

            <button
              type="button"
              onClick={handleOpenCreateForm}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'form' && !editingInviteId
                  ? 'bg-[#C59B27] text-white shadow-sm'
                  : 'bg-white/80 text-[#6C5642] hover:bg-white'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>+ Fill New Invitation Form</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-[#755D46]">
            <span>Total Guests: <strong>{guestInvites.length}</strong></span>
            <span>•</span>
            <span>Reserved Seats: <strong>~{totalSeats}</strong></span>
          </div>
        </div>

        {/* Success Banner */}
        {formSuccessMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2 text-xs font-medium text-emerald-800 flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>{formSuccessMessage}</span>
          </div>
        )}

        {/* Tab 1: Guest List */}
        {activeTab === 'list' && (
          <div className="flex flex-1 flex-col overflow-hidden p-5">
            {/* Search and Action Bar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search guest name (e.g. Chaudhry, Tariq, Salman)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-[#D4AF37]/50 bg-white px-3.5 py-2 text-xs text-[#2A2017] placeholder:text-gray-400 focus:outline-hidden focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
              <button
                type="button"
                onClick={handleOpenCreateForm}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#C59B27] to-[#B89240] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:scale-102 transition-all"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Add Another Guest</span>
              </button>
            </div>

            {/* List items */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {filteredInvites.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#D4AF37]/50 p-8 text-center bg-white/50">
                  <p className="font-serif-luxury text-base text-[#6E5642]">
                    No guest invitations found.
                  </p>
                  <p className="mt-1 text-xs text-[#8A735E]">
                    Click "+ Fill New Invitation Form" to generate a personalized invitation!
                  </p>
                </div>
              ) : (
                filteredInvites.map((invite) => {
                  const isActive = activeGuestInvite?.id === invite.id;
                  return (
                    <div
                      key={invite.id}
                      className={`relative rounded-xl border p-4 transition-all bg-white shadow-xs ${
                        isActive
                          ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40 bg-[#FFFDF9]'
                          : 'border-[#E5DAC3] hover:border-[#D4AF37]/80'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {invite.salutation && (
                              <span className="text-[11px] font-medium text-[#9E7A2F] italic">
                                {invite.salutation}
                              </span>
                            )}
                            <h4 className="font-serif-luxury text-base font-bold text-[#2A1F17]">
                              {invite.guestName}
                            </h4>
                            {isActive && (
                              <span className="rounded-full bg-[#FAF0D4] border border-[#D4AF37] px-2 py-0.5 text-[10px] font-bold text-[#8C6D28]">
                                Currently Previewing
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#695340]">
                            <span className="inline-flex items-center rounded-md bg-[#FAF4E8] px-2 py-0.5 font-medium text-[#7D613E] border border-[#E8DCBF]">
                              🪑 {invite.seats} Seats Reserved
                            </span>

                            {invite.tableOrEnclosure && (
                              <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-amber-800 border border-amber-200">
                                📍 {invite.tableOrEnclosure}
                              </span>
                            )}

                            {invite.side && invite.side !== 'both' && (
                              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A08151]">
                                ({invite.side === 'bride' ? "Bride's Side" : "Groom's Side"})
                              </span>
                            )}
                          </div>

                          {/* Events badges */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {invite.invitedEvents.map((evt) => (
                              <span
                                key={evt}
                                className="rounded-full bg-[#F5EFE0] px-2.5 py-0.5 text-[10px] font-semibold text-[#8C6D28] uppercase border border-[#E0D1B1]"
                              >
                                ✓ {evt}
                              </span>
                            ))}
                          </div>

                          {invite.personalNote && (
                            <p className="pt-1 text-xs italic text-[#705943]">
                              “{invite.personalNote}”
                            </p>
                          )}
                        </div>

                        {/* Actions for this guest */}
                        <div className="flex items-center gap-1.5 pt-1 sm:pt-0">
                          {/* Preview As This Guest */}
                          <button
                            type="button"
                            onClick={() => {
                              onSelectActiveGuest(invite);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#D4AF37] bg-[#FAF3E1] px-2.5 py-1.5 text-xs font-semibold text-[#664E22] hover:bg-[#F3E5C3] transition-all"
                            title="Preview invitation as this guest"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#B89035]" />
                            <span>Preview</span>
                          </button>

                          {/* Copy Link */}
                          <button
                            type="button"
                            onClick={() => handleCopyLink(invite)}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all"
                            title="Copy personalized link"
                          >
                            {copiedId === invite.id ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-semibold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5 text-gray-500" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>

                          {/* WhatsApp Share */}
                          <button
                            type="button"
                            onClick={() => handleSendWhatsApp(invite)}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-500 bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-2xs transition-all"
                            title="Send via WhatsApp"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleEditInvite(invite)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                            title="Edit invite details"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteInvite(invite.id)}
                            className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-700"
                            title="Delete this guest"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Invitation Form */}
        {activeTab === 'form' && (
          <form
            onSubmit={(e) => handleSaveForm(e, false)}
            className="flex flex-1 flex-col overflow-y-auto p-5 space-y-4 text-left"
          >
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2">
              <h4 className="font-cinzel text-xs font-bold tracking-wider text-[#8A7151] uppercase">
                {editingInviteId ? 'Edit Guest Invitation Details' : 'Fill New Guest Invitation Form'}
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="text-xs text-[#9E7A2F] hover:underline"
              >
                ← Back to All Guests
              </button>
            </div>

            {/* Guest Name & Salutation */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-[#4D3A29]">
                  Salutation / Title
                </label>
                <select
                  value={salutation}
                  onChange={(e) => setSalutation(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#D4AF37]/50 bg-white px-3 py-2 text-xs text-[#2A2017]"
                >
                  <option value="Respected / معزز جناب">Respected / معزز جناب</option>
                  <option value="Dear / پیارے">Dear / پیارے</option>
                  <option value="Muhtaram Janab / محترم جناب">Muhtaram Janab / محترم جناب</option>
                  <option value="Honorable / قابل احترام">Honorable / قابل احترام</option>
                  <option value="Bhai & Bhabi">Bhai & Bhabi</option>
                  <option value="Uncle & Auntie">Uncle & Auntie</option>
                  <option value="Doctor Sahib">Doctor Sahib</option>
                  <option value="None">None</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#4D3A29]">
                  Guest / Family Name * <span className="text-red-500">(ضروری)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chaudhry Muhammad Aslam & Family, Mr. & Mrs. Salman"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#D4AF37]/50 bg-white px-3 py-2 text-xs text-[#2A2017] placeholder:text-gray-400 font-medium"
                />
              </div>
            </div>

            {/* Reserved Seats & Side & Table */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-[#4D3A29]">
                  Reserved Seats (نشستیں)
                </label>
                <select
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#D4AF37]/50 bg-white px-3 py-2 text-xs text-[#2A2017]"
                >
                  <option value="1">1 Seat</option>
                  <option value="2">2 Seats (Couple)</option>
                  <option value="3">3 Seats</option>
                  <option value="4">4 Seats</option>
                  <option value="5">5 Seats</option>
                  <option value="6">6 Seats</option>
                  <option value="With Family">With Family / مع اہل خانہ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4D3A29]">
                  Guest Affiliation
                </label>
                <select
                  value={side}
                  onChange={(e) => setSide(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-[#D4AF37]/50 bg-white px-3 py-2 text-xs text-[#2A2017]"
                >
                  <option value="both">Both Families</option>
                  <option value="bride">Bride's Side (لڑکی والے)</option>
                  <option value="groom">Groom's Side (لڑکے والے)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4D3A29]">
                  Table / Enclosure (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Family Lounge, Table 4"
                  value={tableOrEnclosure}
                  onChange={(e) => setTableOrEnclosure(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#D4AF37]/50 bg-white px-3 py-2 text-xs text-[#2A2017]"
                />
              </div>
            </div>

            {/* Events Invited To Checkboxes */}
            <div className="rounded-xl border border-[#D4AF37]/30 bg-white p-3.5 space-y-2">
              <label className="block text-xs font-bold tracking-wider text-[#69513A] uppercase font-cinzel">
                Events Invited To (کس تقریب کے لیے مدعو ہیں)
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  { id: 'mehndi', label: 'Mehndi Night', date: 'Fri, 24 Dec' },
                  { id: 'barat', label: 'Baraat Ceremony', date: 'Sat, 25 Dec' },
                  { id: 'walima', label: 'Walima Reception', date: 'Sun, 26 Dec' }
                ].map((event) => {
                  const isChecked = invitedEvents.includes(event.id);
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => handleToggleEvent(event.id)}
                      className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-all ${
                        isChecked
                          ? 'border-[#D4AF37] bg-[#FFFBF0] text-[#4A3824] shadow-xs'
                          : 'border-gray-200 bg-gray-50 text-gray-400'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="h-4 w-4 text-[#C59B27]" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-400" />
                      )}
                      <div>
                        <p className="text-xs font-bold leading-tight">{event.label}</p>
                        <p className="text-[10px] text-gray-500">{event.date}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personal Note */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-[#4D3A29]">
                  Personal Invitation Message / Note for this Guest (خصوصی پیغام)
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setPersonalNote(
                      'Aapki tashreef aawari hamari khushiyon ko dobala kar degi. We eagerly look forward to welcoming you.'
                    )
                  }
                  className="text-[10px] text-[#A68339] hover:underline"
                >
                  + Use Urdu Template
                </button>
              </div>
              <textarea
                rows={2}
                placeholder="e.g. Aapki tashreef aawari hamaray liye baais-e-musarrat hogi. Looking forward to welcoming you!"
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#D4AF37]/50 bg-white px-3 py-2 text-xs text-[#2A2017]"
              />
            </div>

            {/* Optional Phone for WhatsApp Direct Send */}
            <div>
              <label className="block text-xs font-medium text-[#4D3A29]">
                Guest WhatsApp Phone (Optional - for 1-click send)
              </label>
              <input
                type="text"
                placeholder="e.g. +92 300 1234567 or 03001234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#D4AF37]/50 bg-white px-3 py-2 text-xs text-[#2A2017]"
              />
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-[#FAF7F2] pt-4 border-t border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleSaveForm(e, true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37] bg-[#FAF3E1] px-3.5 py-2 text-xs font-semibold text-[#664E22] hover:bg-[#F3E5C3] shadow-xs"
                >
                  <Eye className="h-3.5 w-3.5 text-[#B89035]" />
                  <span>Save & Preview Card</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37] bg-gradient-to-r from-[#C59B27] via-[#DFBA54] to-[#B89240] px-5 py-2 text-xs font-bold text-[#342407] shadow-sm hover:scale-102 transition-all"
                >
                  <Check className="h-4 w-4" />
                  <span>{editingInviteId ? 'Update Invitation' : 'Save Invitation'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
