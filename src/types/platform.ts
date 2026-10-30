import { WeddingData, WeddingEvent, GalleryItem, GuestWish } from './wedding';

export type UserRole = 'admin' | 'customer';
export type AccountStatus = 'active' | 'suspended';
export type ProjectStatus = 'active' | 'draft' | 'expired' | 'suspended';
export type PlanTier = 'starter' | 'royal' | 'luxury';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  plan: PlanTier;
  accountStatus: AccountStatus;
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string; // e.g. "Parents of the Bride", "Brothers", "Grandparents", "Paternal Uncle"
  side: 'bride' | 'groom';
  displayOrder: number;
  visible: boolean;
}

export type InvitationStatus = 'invited' | 'sent' | 'pending';
export type RsvpStatus = 'attending' | 'not_attending' | 'maybe' | 'pending';

export interface GuestRecord {
  id: string;
  weddingId: string;
  token: string; // unique secure token e.g. "8xK92LmP" or "ahmad-khan-x82k"
  name: string; // e.g. "Muhammad Ahmad" or "Ahmad Khan & Family"
  familyName?: string;
  phone?: string;
  email?: string;
  allowedGuests: number; // max attendees allowed (e.g. 2, 4)
  relationship?: string; // e.g. "College Friend", "Uncle", "Colleague"
  side: 'bride' | 'groom' | 'both';
  invitationStatus: InvitationStatus;
  rsvpStatus: RsvpStatus;
  attendeeCount: number;
  rsvpMessage?: string;
  invitedEvents: string[]; // event IDs e.g. ['mehndi', 'barat', 'walima']
  personalNote?: string;
  tableOrEnclosure?: string;
  openedAt?: string;
  openCount: number;
  createdAt: string;
}

export type ThemePreset =
  | 'classic-gold'
  | 'royal-burgundy'
  | 'emerald-luxury'
  | 'soft-rose'
  | 'minimal-ivory';

export interface ThemeConfig {
  id: ThemePreset;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgTone: string;
  cardBg: string;
  waxColor: string;
  envelopeBg: string;
  description: string;
}

export interface WeddingProject {
  id: string;
  ownerId: string;
  ownerName: string;
  slug: string; // e.g. "malaika-abdullah", "ayesha-hamza"
  title: string;
  status: ProjectStatus;
  theme: ThemePreset;
  
  // Custom personalized invitation wording
  greetingTemplate: string; // default: "Dear [Guest Name],"
  mainInvitationText: string; // default: "You are cordially invited to celebrate our special day."
  closingText: string; // default: "We would be honored by your presence."
  customWording?: {
    greeting?: string;
    mainInvitation?: string;
    closing?: string;
  };

  weddingData: WeddingData;
  familyMembers: FamilyMember[];
  guests: GuestRecord[];
  
  createdAt: string;
  updatedAt: string;
}

export interface PlatformOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  weddingId: string;
  weddingTitle: string;
  plan: PlanTier;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'refunded';
  date: string;
}
