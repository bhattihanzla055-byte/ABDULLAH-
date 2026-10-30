import { GuestInvite, WeddingData } from '../types/wedding';
import { GuestRecord } from '../types/platform';

export const DEFAULT_GUEST_INVITES: GuestInvite[] = [
  {
    id: 'invite-1',
    guestName: 'Chaudhry Muhammad Aslam & Family',
    salutation: 'Respected / معزز جناب',
    side: 'both',
    seats: '4',
    invitedEvents: ['mehndi', 'barat', 'walima'],
    personalNote: 'Aapki tashreef aawari hamari khushiyon ko dobala kar degi. We eagerly look forward to welcoming you.',
    tableOrEnclosure: 'Family Enclosure',
    createdAt: new Date().toISOString()
  },
  {
    id: 'invite-2',
    guestName: 'Dr. Salman Tariq & Begum',
    salutation: 'Dear',
    side: 'groom',
    seats: '2',
    invitedEvents: ['barat', 'walima'],
    personalNote: 'Your gracious presence and heartfelt prayers will make our special day truly blessed.',
    tableOrEnclosure: 'VIP Table 3',
    createdAt: new Date().toISOString()
  },
  {
    id: 'invite-3',
    guestName: 'Hamza Ali & Friends',
    salutation: 'Dear',
    side: 'bride',
    seats: '2',
    invitedEvents: ['mehndi', 'barat'],
    personalNote: 'Our celebration would be incomplete without your energy, laughter, and companionship!',
    createdAt: new Date().toISOString()
  }
];

export function getSavedGuestInvites(): GuestInvite[] {
  try {
    const saved = localStorage.getItem('wedding_guest_invites_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_GUEST_INVITES;
}

export const loadGuestInvites = getSavedGuestInvites;

export function saveGuestInvites(invites: GuestInvite[]) {
  try {
    localStorage.setItem('wedding_guest_invites_v1', JSON.stringify(invites));
  } catch {
    // ignore
  }
}

/**
 * Generate a shareable URL containing the invite parameters
 */
export function generateInviteUrl(invite: GuestInvite): string {
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  const params = new URLSearchParams();

  params.set('to', invite.guestName);
  if (invite.salutation) params.set('sal', invite.salutation);
  if (invite.seats) params.set('seats', String(invite.seats));
  if (invite.invitedEvents && invite.invitedEvents.length > 0) {
    params.set('events', invite.invitedEvents.join(','));
  }
  if (invite.personalNote) params.set('note', invite.personalNote);
  if (invite.tableOrEnclosure) params.set('table', invite.tableOrEnclosure);
  if (invite.side) params.set('side', invite.side);

  return `${origin}${pathname}?${params.toString()}`;
}

/**
 * Parse an invitation from URL query parameters
 */
export function parseInviteFromUrl(searchStr?: string): GuestInvite | null {
  if (typeof window === 'undefined') return null;
  const search = searchStr !== undefined ? searchStr : window.location.search;
  const params = new URLSearchParams(search);
  const guestName = params.get('to') || params.get('guest');

  if (!guestName) return null;

  const eventsParam = params.get('events');
  const invitedEvents = eventsParam
    ? eventsParam.split(',').map((s) => s.trim().toLowerCase())
    : ['mehndi', 'barat', 'walima'];

  return {
    id: 'url-invite',
    guestName,
    salutation: params.get('sal') || params.get('salutation') || undefined,
    seats: params.get('seats') || '2',
    invitedEvents,
    personalNote: params.get('note') || undefined,
    tableOrEnclosure: params.get('table') || undefined,
    side: (params.get('side') as any) || 'both',
    createdAt: new Date().toISOString()
  };
}

/**
 * Format a WhatsApp invitation text
 */
export function createWhatsAppInviteMessage(
  invite: GuestInvite,
  data: WeddingData,
  url: string
): string {
  const salutationText = invite.salutation ? `${invite.salutation} ` : '';
  const eventsList = invite.invitedEvents
    .map((e) => {
      if (e === 'mehndi') return '• Mehndi Night (Friday, 24 Dec)';
      if (e === 'barat') return '• Baraat Ceremony (Saturday, 25 Dec)';
      if (e === 'walima') return '• Walima Reception (Sunday, 26 Dec)';
      return `• ${e.toUpperCase()}`;
    })
    .join('\n');

  return `🌸 *بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ* 🌸\n\n*${salutationText}${invite.guestName}*\n\nWith the gracious blessings of our elders, we cordially invite you and your family to celebrate the auspicious wedding ceremony of:\n\n✨ *${data.brideName} & ${data.groomName}* ✨\n(D/o ${data.brideParents} & S/o ${data.groomParents})\n\n📅 *Wedding Celebrations:* 24 – 26 December 2026\n📍 *Venue:* ${data.mainVenueName}, Lahore\n\n🪑 *Reserved For You:* ${invite.seats} Seats\n\n📜 *Invited Events:*\n${eventsList}\n\n${invite.personalNote ? `💌 *Personal Message:* _"${invite.personalNote}"_\n\n` : ''}Kindly click your personalized wedding card link below to open your digital invitation & view all event details:\n\n👉 ${url}\n\n_Your gracious presence and prayers will make our celebrations complete!_\n\nWarm Regards,\n*${data.hostFamilies}*`;
}

export function guestRecordToInvite(guest: GuestRecord): GuestInvite {
  return {
    id: guest.id,
    guestName: guest.name,
    salutation: guest.relationship || undefined,
    side: guest.side,
    seats: guest.allowedGuests || 2,
    invitedEvents: guest.invitedEvents || ['barat'],
    personalNote: guest.personalNote,
    tableOrEnclosure: guest.tableOrEnclosure,
    phone: guest.phone,
    createdAt: guest.createdAt
  };
}
