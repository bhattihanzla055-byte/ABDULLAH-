export interface WeddingEvent {
  id: string;
  name: string;
  subtitle?: string;
  date: string; // formatted string e.g. "Friday, 24 December 2026"
  isoDate: string; // ISO date for calendar e.g. "2026-12-24T18:00:00"
  time: string; // "6:00 PM onwards"
  venue: string;
  address: string;
  mapUrl: string;
  description: string;
  themeColor?: string;
  dressCode?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  url: string;
  caption?: string;
  category?: string;
}

export interface GuestWish {
  id: string;
  name: string;
  relation?: string;
  message: string;
  timestamp: string;
  avatarSeed?: string;
}

export interface RsvpSubmission {
  id: string;
  guestName: string;
  email?: string;
  phone?: string;
  attending: 'yes' | 'no';
  numberOfGuests: number;
  eventsAttending: string[];
  message?: string;
  submittedAt: string;
}

export interface GuestInvite {
  id: string;
  guestName: string; // e.g. "Chaudhry Muhammad Aslam & Family"
  salutation?: string; // e.g. "Respected", "Dear", "Muhtaram Janab"
  side?: 'bride' | 'groom' | 'both';
  seats: number | string; // e.g. 2, 4, "Family"
  invitedEvents: string[]; // event IDs e.g. ['e1', 'e2', 'e3']
  personalNote?: string;
  tableOrEnclosure?: string;
  phone?: string;
  createdAt: string;
}

export interface WeddingData {
  // Couple Information
  brideName: string;
  brideFullName: string;
  brideParents: string;
  brideBio?: string;
  bridePhoto?: string;

  groomName: string;
  groomFullName: string;
  groomParents: string;
  groomBio?: string;
  groomPhoto?: string;

  couplePhoto: string;
  monogram: string; // e.g. "A & Z"

  // Dates & Countdown
  weddingDate: string; // e.g. "Saturday, 25 December 2026"
  weddingTime: string; // e.g. "7:00 PM"
  weddingIsoDateTime: string; // "2026-12-25T19:00:00"
  saveTheDateSubtitle: string;

  // Traditional Family Inviting Statement
  familyBlessingsTitle: string;
  familyBlessingsBody: string;
  hostFamilies: string;

  // Main Venue
  mainVenueName: string;
  mainVenueAddress: string;
  googleMapsUrl: string;
  embedMapQuery?: string;

  // Story
  storyTitle: string;
  storyQuote: string;
  storyParagraphs: string[];

  // Events Timeline
  events: WeddingEvent[];

  // Gallery
  gallery: GalleryItem[];

  // Wishes
  initialWishes: GuestWish[];

  // Audio / Music
  musicTitle: string;
  musicArtist?: string;
  musicUrl?: string; // Optional custom audio file link
  youtubeUrl?: string;
  youtubeVideoId?: string;
}
