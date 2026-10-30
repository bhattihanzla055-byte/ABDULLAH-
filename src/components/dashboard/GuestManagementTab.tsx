import React, { useState, useMemo } from 'react';
import { WeddingProject, GuestRecord, RsvpStatus } from '../../types/platform';
import {
  Users,
  Plus,
  Upload,
  Download,
  Search,
  Copy,
  Check,
  Eye,
  MessageSquare,
  Trash2,
  Edit2,
  RefreshCw,
  Clock,
  Sparkles,
  ExternalLink,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { platformStore } from '../../services/platformStore';

interface GuestManagementTabProps {
  project: WeddingProject;
  onPreviewAsGuest: (guest: GuestRecord) => void;
  onRefreshProject: () => void;
}

export const GuestManagementTab: React.FC<GuestManagementTabProps> = ({
  project,
  onPreviewAsGuest,
  onRefreshProject
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRsvp, setFilterRsvp] = useState<string>('all');
  const [filterOpen, setFilterOpen] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Single Add/Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Partial<GuestRecord> | null>(null);

  // Bulk Import modal state
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [bulkImportResult, setBulkImportResult] = useState<{
    importedCount: number;
    duplicatesCount: number;
  } | null>(null);

  const guests = project.guests || [];

  // Filtered guests
  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const matchesSearch =
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (guest.familyName && guest.familyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (guest.phone && guest.phone.includes(searchQuery)) ||
        (guest.token && guest.token.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRsvp =
        filterRsvp === 'all' ||
        (filterRsvp === 'attending' && guest.rsvpStatus === 'attending') ||
        (filterRsvp === 'not_attending' && guest.rsvpStatus === 'not_attending') ||
        (filterRsvp === 'pending' && guest.rsvpStatus === 'pending');

      const matchesOpen =
        filterOpen === 'all' ||
        (filterOpen === 'opened' && (guest.openCount || 0) > 0) ||
        (filterOpen === 'not_opened' && (!guest.openCount || guest.openCount === 0));

      return matchesSearch && matchesRsvp && matchesOpen;
    });
  }, [guests, searchQuery, filterRsvp, filterOpen]);

  // Construct guest unique URL
  const getGuestUrl = (token: string) => {
    if (typeof window === 'undefined') return `/i/${token}`;
    return `${window.location.origin}/#/i/${token}`;
  };

  const handleCopyLink = (guest: GuestRecord) => {
    const url = getGuestUrl(guest.token);
    navigator.clipboard.writeText(url);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleWhatsAppInvite = (guest: GuestRecord) => {
    const url = getGuestUrl(guest.token);
    const greetingName = guest.name;
    const bride = project.weddingData.brideName;
    const groom = project.weddingData.groomName;
    const date = project.weddingData.weddingDate;
    const venue = project.weddingData.mainVenueName;

    const message = `🌸 *Assalam-o-Alaikum ${greetingName},*\n\nWe are delighted to cordially invite you and your family to celebrate the wedding ceremony of:\n\n✨ *${bride} & ${groom}* ✨\n\n📅 *Date:* ${date}\n📍 *Venue:* ${venue}\n🪑 *Reserved for you:* ${guest.allowedGuests} Guests\n\nPlease click your personalized wedding card link below to open your invitation & view event details:\n\n👉 ${url}\n\nWe would be honored by your gracious presence and heartfelt prayers. ❤️\n\nWarm Regards,\n*${project.weddingData.hostFamilies || 'The Family'}*`;

    let cleanPhone = guest.phone ? guest.phone.replace(/[^0-9]/g, '') : '';
    // If Pakistani phone starts with 03..., replace with 923...
    if (cleanPhone.startsWith('03')) {
      cleanPhone = '92' + cleanPhone.slice(1);
    }

    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');
  };

  const handleOpenAddModal = () => {
    setEditingGuest({
      name: '',
      familyName: '',
      phone: '',
      email: '',
      allowedGuests: 2,
      relationship: 'Friend',
      side: 'both',
      invitationStatus: 'invited',
      rsvpStatus: 'pending',
      attendeeCount: 0,
      invitedEvents: project.weddingData.events.map((e) => e.id),
      personalNote: 'Aapki tashreef aawari hamari khushiyon ko dobala kar degi.'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveGuestModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest || !editingGuest.name?.trim()) return;

    if (editingGuest.id) {
      // Update
      platformStore.updateGuest(project.id, editingGuest.id, editingGuest);
    } else {
      // Create
      platformStore.addGuest(project.id, {
        name: editingGuest.name.trim(),
        familyName: editingGuest.familyName || undefined,
        phone: editingGuest.phone || undefined,
        email: editingGuest.email || undefined,
        allowedGuests: Number(editingGuest.allowedGuests) || 2,
        relationship: editingGuest.relationship || 'Guest',
        side: editingGuest.side || 'both',
        invitationStatus: 'invited',
        rsvpStatus: 'pending',
        attendeeCount: 0,
        invitedEvents: editingGuest.invitedEvents || project.weddingData.events.map((e) => e.id),
        personalNote: editingGuest.personalNote || undefined,
        tableOrEnclosure: editingGuest.tableOrEnclosure || undefined
      });
    }

    setIsEditModalOpen(false);
    setEditingGuest(null);
    onRefreshProject();
  };

  const handleDeleteGuest = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the guest list?`)) {
      platformStore.deleteGuest(project.id, id);
      onRefreshProject();
    }
  };

  const handleRegenerateToken = (id: string) => {
    platformStore.regenerateGuestToken(project.id, id);
    onRefreshProject();
  };

  const handleExportCsv = () => {
    const csvData = platformStore.exportGuestsCsv(project.id);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${project.slug}-guest-invitations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCsvTemplate = () => {
    const template = `Name,Phone,Email,Family,Side,AllowedGuests,Relationship,PersonalNote\nAhmad Khan,+923001234567,ahmad@example.com,Khan Family,groom,2,Friend,Eagerly waiting to see you\nChaudhry Tariq & Family,+923219876543,tariq@example.com,Chaudhry Family,both,5,Uncle,Warm regards\nDr. Salman Tariq,,salman@example.com,,bride,2,Colleague,Congratulations\n`;
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nuptia_guest_list_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProcessBulkImport = () => {
    if (!bulkCsvText.trim()) return;

    // Parse CSV simple parser
    const lines = bulkCsvText.trim().split('\n');
    if (lines.length < 2) return;

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/[^a-z]/g, ''));
    const nameIdx = headers.findIndex((h) => h.includes('name'));
    const phoneIdx = headers.findIndex((h) => h.includes('phone'));
    const emailIdx = headers.findIndex((h) => h.includes('email'));
    const familyIdx = headers.findIndex((h) => h.includes('family'));
    const sideIdx = headers.findIndex((h) => h.includes('side'));
    const guestsIdx = headers.findIndex((h) => h.includes('allowed') || h.includes('guest') || h.includes('seat'));
    const relIdx = headers.findIndex((h) => h.includes('relation'));
    const noteIdx = headers.findIndex((h) => h.includes('note'));

    if (nameIdx === -1) {
      alert('CSV must contain a "Name" column header in the first line.');
      return;
    }

    const itemsToImport: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
      const name = cols[nameIdx];
      if (!name) continue;

      itemsToImport.push({
        name,
        phone: phoneIdx >= 0 ? cols[phoneIdx] : undefined,
        email: emailIdx >= 0 ? cols[emailIdx] : undefined,
        familyName: familyIdx >= 0 ? cols[familyIdx] : undefined,
        side: sideIdx >= 0 && (cols[sideIdx] === 'bride' || cols[sideIdx] === 'groom' || cols[sideIdx] === 'both') ? cols[sideIdx] : 'both',
        allowedGuests: guestsIdx >= 0 ? parseInt(cols[guestsIdx]) || 2 : 2,
        relationship: relIdx >= 0 ? cols[relIdx] : 'Guest',
        personalNote: noteIdx >= 0 ? cols[noteIdx] : undefined
      });
    }

    const result = platformStore.bulkImportGuests(project.id, itemsToImport);
    setBulkImportResult(result);
    onRefreshProject();
    setBulkCsvText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#EAE1D2] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#2A2016] font-cinzel">
              Guest List & Personalized URLs ({guests.length})
            </h3>
            <span className="rounded-full bg-[#FAF5EB] border border-[#D4AF37] px-2.5 py-0.5 text-xs font-bold text-[#8C6D28]">
              {guests.reduce((sum, g) => sum + (g.allowedGuests || 1), 0)} Total Seats
            </span>
          </div>
          <p className="text-xs text-[#7A6B5C]">
            Every guest receives a unique link. When opened, their name appears inside the animated envelope with their reserved seats.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9CBB5] bg-white px-3 py-2 text-xs font-semibold text-[#4A3D2F] hover:bg-[#FAF8F5] transition"
            title="Download full guest list as CSV"
          >
            <Download className="h-3.5 w-3.5 text-[#7A6B5C]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setBulkImportResult(null);
              setIsBulkModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#C59B27]/60 bg-[#FAF6EE] px-3 py-2 text-xs font-semibold text-[#8C6D28] hover:bg-[#F5EEDC] transition"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Bulk CSV Import</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C59B27] to-[#DFBA54] px-4 py-2 text-xs font-bold text-[#2E2008] shadow-xs hover:scale-102 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Single Guest</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="rounded-2xl border border-[#EAE1D2] bg-white p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A89886]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by guest name, phone, family group, or token..."
              className="w-full rounded-xl border border-[#D9CBB5] pl-10 pr-3.5 py-2 text-xs sm:text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[#7A6B5C] flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Filter:
            </span>

            {/* RSVP Filter */}
            <select
              value={filterRsvp}
              onChange={(e) => setFilterRsvp(e.target.value)}
              className="rounded-xl border border-[#D9CBB5] bg-[#FAF8F5] px-2.5 py-1.5 text-xs font-medium text-[#4A3D2F] focus:outline-none focus:border-[#C59B27]"
            >
              <option value="all">All RSVPs</option>
              <option value="attending">Attending (Yes)</option>
              <option value="not_attending">Not Attending (No)</option>
              <option value="pending">RSVP Pending</option>
            </select>

            {/* Open Filter */}
            <select
              value={filterOpen}
              onChange={(e) => setFilterOpen(e.target.value)}
              className="rounded-xl border border-[#D9CBB5] bg-[#FAF8F5] px-2.5 py-1.5 text-xs font-medium text-[#4A3D2F] focus:outline-none focus:border-[#C59B27]"
            >
              <option value="all">All Open Status</option>
              <option value="opened">Opened</option>
              <option value="not_opened">Not Opened</option>
            </select>
          </div>
        </div>
      </div>

      {/* Guest Table */}
      <div className="overflow-hidden rounded-2xl border border-[#EAE1D2] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#3D2E1E]">
            <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#8C7653] font-cinzel border-b border-[#EAE1D2]">
              <tr>
                <th className="py-3.5 px-4">Guest / Family Name</th>
                <th className="py-3.5 px-3">Seats</th>
                <th className="py-3.5 px-3">Side & Contact</th>
                <th className="py-3.5 px-3">Unique Invitation Link</th>
                <th className="py-3.5 px-3">Open Status</th>
                <th className="py-3.5 px-3">RSVP Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#8C7A68] italic">
                    {searchQuery ? 'No guests matching search query.' : 'No guests added yet. Click "+ Add Single Guest" or "Bulk CSV Import".'}
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const url = getGuestUrl(guest.token);
                  const isCopied = copiedId === guest.id;

                  return (
                    <tr key={guest.id} className="hover:bg-[#FCFAF6] transition">
                      {/* Name & Family */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-sm text-[#2A1F15] font-serif-luxury">
                          {guest.name}
                        </div>
                        {guest.familyName && (
                          <div className="text-[11px] text-[#8C7653]">
                            Group: {guest.familyName}
                          </div>
                        )}
                        {guest.personalNote && (
                          <div className="mt-0.5 text-[10px] text-[#7A6B5C] italic truncate max-w-xs" title={guest.personalNote}>
                            💌 "{guest.personalNote}"
                          </div>
                        )}
                      </td>

                      {/* Seats */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center rounded-lg bg-[#FAF5EB] border border-[#EAE1D2] px-2.5 py-1 text-xs font-bold text-[#8C6D28]">
                          {guest.allowedGuests} seats
                        </span>
                      </td>

                      {/* Side & Contact */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1">
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                              guest.side === 'bride'
                                ? 'bg-pink-50 text-pink-700 border border-pink-200'
                                : guest.side === 'groom'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-stone-100 text-stone-700 border border-stone-200'
                            }`}
                          >
                            {guest.side === 'bride' ? 'Bride' : guest.side === 'groom' ? 'Groom' : 'Both'}
                          </span>
                          {guest.relationship && (
                            <span className="text-[11px] text-[#8C7A68]">
                              • {guest.relationship}
                            </span>
                          )}
                        </div>
                        {guest.phone && (
                          <p className="mt-1 text-[11px] font-mono text-[#5C4D3E]">
                            {guest.phone}
                          </p>
                        )}
                      </td>

                      {/* Unique Link & Token */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <code className="rounded bg-[#FAF5EB] px-2 py-1 text-[11px] font-mono font-bold text-[#8C6D28] border border-[#EAE1D2]">
                            {guest.token}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleRegenerateToken(guest.id)}
                            className="rounded p-1 text-[#8C7A68] hover:bg-[#FAF5EB] hover:text-[#C59B27]"
                            title="Regenerate Token"
                          >
                            <RefreshCw className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="mt-1 text-[10px] text-[#8C7A68] font-mono truncate max-w-[150px]">
                          {url}
                        </p>
                      </td>

                      {/* Open Status */}
                      <td className="py-3.5 px-3">
                        {(guest.openCount || 0) > 0 ? (
                          <div className="flex flex-col">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                              <Eye className="h-3.5 w-3.5" />
                              Opened ({guest.openCount}x)
                            </span>
                            {guest.openedAt && (
                              <span className="text-[10px] text-[#8C7A68]">
                                {new Date(guest.openedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#8C7A68]">
                            <Clock className="h-3.5 w-3.5" />
                            Not Opened Yet
                          </span>
                        )}
                      </td>

                      {/* RSVP Status */}
                      <td className="py-3.5 px-3">
                        {guest.rsvpStatus === 'attending' && (
                          <div className="flex flex-col">
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Attending
                            </span>
                            <span className="mt-0.5 text-[10px] font-semibold text-emerald-800">
                              {guest.attendeeCount || guest.allowedGuests} guests confirmed
                            </span>
                          </div>
                        )}
                        {guest.rsvpStatus === 'not_attending' && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
                            <XCircle className="h-3.5 w-3.5" /> Declined
                          </span>
                        )}
                        {guest.rsvpStatus === 'pending' && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                            <Clock className="h-3.5 w-3.5" /> Pending
                          </span>
                        )}
                        {guest.rsvpStatus === 'maybe' && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
                            Maybe
                          </span>
                        )}
                        {guest.rsvpMessage && (
                          <p className="mt-1 text-[10px] text-[#6B5A4B] italic truncate max-w-xs" title={guest.rsvpMessage}>
                            "{guest.rsvpMessage}"
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copy Link */}
                          <button
                            type="button"
                            onClick={() => handleCopyLink(guest)}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                              isCopied
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-[#FAF6EE] text-[#7E6118] hover:bg-[#F5EEDC] border border-[#EAE1D2]'
                            }`}
                            title="Copy Guest Invitation URL"
                          >
                            {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            <span>{isCopied ? 'Copied ✓' : 'Copy Link'}</span>
                          </button>

                          {/* WhatsApp */}
                          <button
                            type="button"
                            onClick={() => handleWhatsAppInvite(guest)}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-xs"
                            title="Send via WhatsApp with personalized message"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>WhatsApp</span>
                          </button>

                          {/* Preview As Guest */}
                          <button
                            type="button"
                            onClick={() => onPreviewAsGuest(guest)}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#D9CBB5] bg-white px-2 py-1.5 text-xs text-[#5C4D3E] hover:bg-[#FAF8F5]"
                            title="Preview exactly how this guest will see the card"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#A88234]" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingGuest({ ...guest });
                              setIsEditModalOpen(true);
                            }}
                            className="rounded p-1.5 text-[#7A6B5C] hover:bg-[#FAF6EE] hover:text-[#2A1F15]"
                            title="Edit Guest"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteGuest(guest.id, guest.name)}
                            className="rounded p-1.5 text-rose-500 hover:bg-rose-50"
                            title="Delete Guest"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Guest Modal */}
      {isEditModalOpen && editingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#D9CBB5] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h4 className="text-base font-bold text-[#2A2016] font-cinzel mb-4 pb-2 border-b border-[#EAE1D2]">
              {editingGuest.id ? 'Edit Guest Invitation' : 'Add New Guest'}
            </h4>

            <form onSubmit={handleSaveGuestModal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                  Guest / Family Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingGuest.name || ''}
                  onChange={(e) => setEditingGuest({ ...editingGuest, name: e.target.value })}
                  className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                  placeholder="e.g. Ahmad Khan OR Chaudhry Aslam & Family"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                    Allowed Seats *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={editingGuest.allowedGuests || 2}
                    onChange={(e) => setEditingGuest({ ...editingGuest, allowedGuests: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none font-bold"
                  />
                  <p className="mt-0.5 text-[10px] text-[#8C7A68]">RSVP limit</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                    Family / Group
                  </label>
                  <input
                    type="text"
                    value={editingGuest.familyName || ''}
                    onChange={(e) => setEditingGuest({ ...editingGuest, familyName: e.target.value })}
                    className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                    placeholder="e.g. Khan Family"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editingGuest.phone || ''}
                    onChange={(e) => setEditingGuest({ ...editingGuest, phone: e.target.value })}
                    className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-xs text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none font-mono"
                    placeholder="+92 300 1234567"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={editingGuest.relationship || ''}
                    onChange={(e) => setEditingGuest({ ...editingGuest, relationship: e.target.value })}
                    className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-xs text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                    placeholder="e.g. Uncle, Friend"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                  Side
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['bride', 'groom', 'both'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditingGuest({ ...editingGuest, side: s as any })}
                      className={`rounded-xl border p-2 font-semibold capitalize ${
                        editingGuest.side === s
                          ? 'border-[#C59B27] bg-[#FAF5EB] text-[#8C6D28]'
                          : 'border-[#D9CBB5] bg-white text-[#5C4D3E]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                  Personal Note / Custom Greeting (Optional)
                </label>
                <textarea
                  rows={2}
                  value={editingGuest.personalNote || ''}
                  onChange={(e) => setEditingGuest({ ...editingGuest, personalNote: e.target.value })}
                  className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-xs text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                  placeholder="Special blessing or personal note displayed on this guest's invitation..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE1D2]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl border border-[#D9CBB5] px-4 py-2 text-xs font-semibold text-[#5C4D3E] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#C59B27] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#B38A1F]"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Import Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-[#D9CBB5] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE1D2]">
              <h4 className="text-base font-bold text-[#2A2016] font-cinzel">
                Bulk Import Guests (CSV / Excel)
              </h4>
              <button
                type="button"
                onClick={handleDownloadCsvTemplate}
                className="inline-flex items-center gap-1 rounded-lg border border-[#D4AF37] bg-[#FAF5EB] px-2.5 py-1 text-xs font-semibold text-[#8C6D28] hover:bg-[#F3E8CE]"
              >
                <Download className="h-3 w-3" />
                <span>Download Sample Template</span>
              </button>
            </div>

            <p className="mt-3 text-xs text-[#695847] leading-relaxed">
              Upload or paste your guest list below. The system validates required fields (<strong>Name</strong>, Phone, Email, Family, Side, AllowedGuests), skips existing duplicates, and automatically generates secure, unique invitation links for each guest.
            </p>

            {bulkImportResult && (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <div>
                  <strong>Successfully imported {bulkImportResult.importedCount} new guests!</strong>
                  {bulkImportResult.duplicatesCount > 0 && (
                    <span className="ml-1 text-amber-800">
                      ({bulkImportResult.duplicatesCount} duplicate names skipped)
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4">
              <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                Paste CSV Data with Headers (or select file):
              </label>
              <textarea
                rows={8}
                value={bulkCsvText}
                onChange={(e) => setBulkCsvText(e.target.value)}
                placeholder="Name,Phone,Email,Family,Side,AllowedGuests&#10;Ahmad Khan,+923001234567,ahmad@example.com,Khan Family,groom,2&#10;Muhammad Usman,+923219876543,,Usman Family,both,4"
                className="w-full rounded-xl border border-[#D9CBB5] p-3 text-xs font-mono text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
              />
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#EAE1D2]">
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-[#8C6D28] hover:underline font-semibold">
                <Upload className="h-3.5 w-3.5" />
                <span>Select file from computer</span>
                <input
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setBulkCsvText(event.target?.result as string || '');
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="rounded-xl border border-[#D9CBB5] px-4 py-2 text-xs font-semibold text-[#5C4D3E] hover:bg-[#FAF8F5]"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={!bulkCsvText.trim()}
                  onClick={handleProcessBulkImport}
                  className="rounded-xl bg-[#C59B27] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#B38A1F] disabled:opacity-50"
                >
                  Import & Generate Links
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
