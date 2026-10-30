import {
  User,
  WeddingProject,
  GuestRecord,
  FamilyMember,
  PlatformOrder,
  ThemePreset,
  ProjectStatus
} from '../types/platform';
import { WeddingData } from '../types/wedding';
import { initialWeddingData } from '../data/weddingData';
import couplePortrait2 from '../assets/images/couple_original_portrait_1789211490264.jpg';

const STORAGE_KEY_USERS = 'nuptia_users_v1';
const STORAGE_KEY_PROJECTS = 'nuptia_wedding_projects_v1';
const STORAGE_KEY_ORDERS = 'nuptia_orders_v1';
const STORAGE_KEY_AUTH = 'nuptia_active_user_v1';

// Seed initial users
const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Platform Owner (Admin)',
    email: 'admin@nuptia.com',
    phone: '+92 300 1122334',
    role: 'admin',
    plan: 'luxury',
    accountStatus: 'active',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'user-tariq',
    name: 'Tariq Malik',
    email: 'tariq@wedding.com',
    phone: '+92 300 5551234',
    role: 'customer',
    plan: 'luxury',
    accountStatus: 'active',
    createdAt: '2026-08-10T14:30:00Z'
  },
  {
    id: 'user-hamza',
    name: 'Hamza Tariq',
    email: 'hamza@wedding.com',
    phone: '+92 321 4445566',
    role: 'customer',
    plan: 'royal',
    accountStatus: 'active',
    createdAt: '2026-08-15T09:15:00Z'
  },
  {
    id: 'user-bilal',
    name: 'Bilal Siddiqui',
    email: 'bilal@wedding.com',
    phone: '+92 333 7778899',
    role: 'customer',
    plan: 'starter',
    accountStatus: 'active',
    createdAt: '2026-08-20T16:45:00Z'
  },
  {
    id: 'user-usman',
    name: 'Usman Ahmed',
    email: 'usman@wedding.com',
    phone: '+92 302 9998877',
    role: 'customer',
    plan: 'royal',
    accountStatus: 'active',
    createdAt: '2026-08-25T11:20:00Z'
  }
];

// Seed initial wedding projects
const INITIAL_PROJECTS: WeddingProject[] = [
  {
    id: 'wedding-malaika-abdullah',
    ownerId: 'user-tariq',
    ownerName: 'Tariq Malik',
    slug: 'malaika-abdullah',
    title: 'Malaika & Abdullah Wedding Celebration',
    status: 'active',
    theme: 'classic-gold',
    greetingTemplate: 'Dear [Guest Name],',
    mainInvitationText:
      'With great pleasure, we invite you to celebrate the royal union of our beloved children. Your gracious presence and prayers will make our celebration complete.',
    closingText: 'We eagerly look forward to welcoming you with warmth and love.',
    weddingData: {
      ...initialWeddingData
    },
    familyMembers: [
      {
        id: 'fm-1',
        name: 'Mr. & Mrs. Tariq Mahmood Malik',
        relationship: 'Parents of the Bride',
        side: 'bride',
        displayOrder: 1,
        visible: true
      },
      {
        id: 'fm-2',
        name: 'Mr. & Mrs. Farooq Ahmed Siddiqui',
        relationship: 'Parents of the Groom',
        side: 'groom',
        displayOrder: 2,
        visible: true
      },
      {
        id: 'fm-3',
        name: 'Zaid & Daniyal Malik',
        relationship: 'Brothers of the Bride',
        side: 'bride',
        displayOrder: 3,
        visible: true
      },
      {
        id: 'fm-4',
        name: 'Aimen & Fatima Siddiqui',
        relationship: 'Sisters of the Groom',
        side: 'groom',
        displayOrder: 4,
        visible: true
      },
      {
        id: 'fm-5',
        name: 'Dadi Jan & Nana Abu',
        relationship: 'Elders & Grandparents',
        side: 'bride',
        displayOrder: 5,
        visible: true
      }
    ],
    guests: [
      {
        id: 'guest-1',
        weddingId: 'wedding-malaika-abdullah',
        token: '8xK92LmP',
        name: 'Muhammad Ahmad',
        familyName: 'Ahmad Family',
        phone: '+92 300 1234567',
        email: 'ahmad@example.com',
        allowedGuests: 2,
        relationship: 'Family Friend',
        side: 'groom',
        invitationStatus: 'sent',
        rsvpStatus: 'attending',
        attendeeCount: 2,
        rsvpMessage: 'Very excited to celebrate with you all! Congratulations!',
        invitedEvents: ['mehndi', 'barat', 'walima'],
        personalNote: 'Aapki tashreef aawari hamari khushiyon ko dobala kar degi.',
        tableOrEnclosure: 'VIP Table 2',
        openedAt: '2026-09-18T14:20:00Z',
        openCount: 3,
        createdAt: '2026-09-01T10:00:00Z'
      },
      {
        id: 'guest-2',
        weddingId: 'wedding-malaika-abdullah',
        token: 'ahmad-khan-x82k',
        name: 'Ahmad Khan & Family',
        familyName: 'Khan Family',
        phone: '+92 301 9876543',
        email: 'ahmad.khan@example.com',
        allowedGuests: 5,
        relationship: 'Uncle',
        side: 'both',
        invitationStatus: 'sent',
        rsvpStatus: 'attending',
        attendeeCount: 4,
        rsvpMessage: 'Duas and best wishes for the couple! We will be there on Barat and Walima.',
        invitedEvents: ['barat', 'walima'],
        personalNote: 'Your gracious presence and heartfelt prayers will make our special day truly blessed.',
        tableOrEnclosure: 'Family Enclosure 1',
        openedAt: '2026-09-17T11:10:00Z',
        openCount: 2,
        createdAt: '2026-09-01T10:05:00Z'
      },
      {
        id: 'guest-3',
        weddingId: 'wedding-malaika-abdullah',
        token: 'salman-tariq-7q1',
        name: 'Dr. Salman Tariq & Begum',
        familyName: 'Tariq Family',
        phone: '+92 321 5556677',
        email: 'salman.tariq@example.com',
        allowedGuests: 2,
        relationship: 'Colleague',
        side: 'groom',
        invitationStatus: 'sent',
        rsvpStatus: 'attending',
        attendeeCount: 2,
        rsvpMessage: 'Delighted to attend!',
        invitedEvents: ['mehndi', 'barat', 'walima'],
        personalNote: 'Heartiest congratulations from our family.',
        tableOrEnclosure: 'Doctors Lounge',
        openedAt: '2026-09-18T09:30:00Z',
        openCount: 1,
        createdAt: '2026-09-02T11:00:00Z'
      },
      {
        id: 'guest-4',
        weddingId: 'wedding-malaika-abdullah',
        token: 'ali-raza-9v4',
        name: 'Ali Raza',
        phone: '+92 333 4443322',
        email: 'ali.raza@example.com',
        allowedGuests: 1,
        relationship: 'University Friend',
        side: 'bride',
        invitationStatus: 'sent',
        rsvpStatus: 'pending',
        attendeeCount: 0,
        invitedEvents: ['mehndi', 'barat'],
        openedAt: '2026-09-18T18:05:00Z',
        openCount: 1,
        createdAt: '2026-09-02T11:05:00Z'
      },
      {
        id: 'guest-5',
        weddingId: 'wedding-malaika-abdullah',
        token: 'usman-ahmed-3k8',
        name: 'Usman Ahmed & Family',
        familyName: 'Ahmed Family',
        phone: '+92 302 7776655',
        email: 'usman.ahmed@example.com',
        allowedGuests: 4,
        relationship: 'Cousin',
        side: 'both',
        invitationStatus: 'sent',
        rsvpStatus: 'not_attending',
        attendeeCount: 0,
        rsvpMessage: 'So sorry we will be traveling abroad, but our heartiest prayers are with both of you!',
        invitedEvents: ['mehndi', 'barat', 'walima'],
        openedAt: '2026-09-16T15:45:00Z',
        openCount: 2,
        createdAt: '2026-09-03T12:00:00Z'
      },
      {
        id: 'guest-6',
        weddingId: 'wedding-malaika-abdullah',
        token: 'sara-ahmed-5m2',
        name: 'Sara Ahmed',
        phone: '+92 345 8889900',
        allowedGuests: 2,
        relationship: 'School Friend',
        side: 'bride',
        invitationStatus: 'invited',
        rsvpStatus: 'pending',
        attendeeCount: 0,
        invitedEvents: ['mehndi'],
        openCount: 0,
        createdAt: '2026-09-03T12:10:00Z'
      },
      {
        id: 'guest-7',
        weddingId: 'wedding-malaika-abdullah',
        token: 'bilal-family-2n9',
        name: 'Family of Bilal',
        familyName: 'Bilal Family',
        phone: '+92 311 2233445',
        allowedGuests: 4,
        relationship: 'Close Family',
        side: 'groom',
        invitationStatus: 'sent',
        rsvpStatus: 'attending',
        attendeeCount: 3,
        rsvpMessage: 'Mubarak ho! We are counting down the days!',
        invitedEvents: ['mehndi', 'barat', 'walima'],
        openedAt: '2026-09-17T20:15:00Z',
        openCount: 4,
        createdAt: '2026-09-04T10:00:00Z'
      },
      {
        id: 'guest-8',
        weddingId: 'wedding-malaika-abdullah',
        token: 'hassan-family-6p3',
        name: 'Family of Hassan',
        familyName: 'Hassan Family',
        phone: '+92 300 9988776',
        allowedGuests: 3,
        relationship: 'Neighbors',
        side: 'both',
        invitationStatus: 'sent',
        rsvpStatus: 'attending',
        attendeeCount: 3,
        rsvpMessage: 'Looking forward to the delicious feast and celebrations.',
        invitedEvents: ['walima'],
        openedAt: '2026-09-18T12:30:00Z',
        openCount: 2,
        createdAt: '2026-09-04T10:15:00Z'
      }
    ],
    createdAt: '2026-08-10T14:30:00Z',
    updatedAt: '2026-09-18T16:00:00Z'
  },
  {
    id: 'wedding-ayesha-hamza',
    ownerId: 'user-hamza',
    ownerName: 'Hamza Tariq',
    slug: 'ayesha-hamza',
    title: 'Ayesha & Hamza Wedding',
    status: 'active',
    theme: 'royal-burgundy',
    greetingTemplate: 'Dear [Guest Name],',
    mainInvitationText:
      'With great pleasure, we invite you to celebrate the wedding of Ayesha & Hamza. Your presence will make our celebration even more special.',
    closingText: 'We would be deeply honored by your gracious presence and prayers.',
    weddingData: {
      ...initialWeddingData,
      brideName: 'Ayesha',
      brideFullName: 'Ayesha Kamran Khan',
      brideParents: 'Daughter of Mr. & Mrs. Kamran Jamil Khan',
      brideBio: 'A passionate graphic designer with a heart full of warmth and creativity.',
      groomName: 'Hamza',
      groomFullName: 'Hamza Tariq',
      groomParents: 'Son of Mr. & Mrs. Tariq Jamil',
      groomBio: 'An adventurous entrepreneur who believes that life is best shared together.',
      monogram: 'A & H',
      weddingDate: 'Saturday, 16 January 2027',
      weddingTime: '7:30 PM onwards',
      weddingIsoDateTime: '2027-01-16T19:30:00',
      saveTheDateSubtitle: 'Two souls unite in sacred vows of love, respect, and devotion.',
      hostFamilies: 'The Khan & Jamil Families',
      mainVenueName: 'The Nishat Grand Ballroom',
      mainVenueAddress: 'Abdul Haque Road, Johar Town, Lahore',
      googleMapsUrl: 'https://maps.google.com/?q=The+Nishat+Hotel+Johar+Town+Lahore',
      storyTitle: 'A LOVE WRITTEN IN THE STARS',
      storyQuote: 'From laughter over coffee to promises that will last a lifetime.',
      events: [
        {
          id: 'dholki',
          name: 'DHOLKI & MAYUN',
          subtitle: 'Songs of Joy, Laughter & Golden Haldi',
          date: 'Thursday, 14 January 2027',
          isoDate: '2027-01-14T19:00:00',
          time: '7:00 PM onwards',
          venue: 'The Khan Residence Garden',
          address: 'Phase 5, DHA Lahore',
          mapUrl: 'https://maps.google.com/?q=DHA+Phase+5+Lahore',
          description: 'A cozy evening of Dholki songs, mustard yellow hues, and traditional snacks.',
          dressCode: 'Traditional Yellows & Floral Attire',
          themeColor: '#D97706'
        },
        {
          id: 'mehndi',
          name: 'MEHNDI RAAS',
          subtitle: 'Henna Night & Vibrant Dances',
          date: 'Friday, 15 January 2027',
          isoDate: '2027-01-15T18:30:00',
          time: '6:30 PM onwards',
          venue: 'Faletti’s Hotel Crystal Lawn',
          address: '24 Egerton Road, Lahore',
          mapUrl: 'https://maps.google.com/?q=Falettis+Hotel+Lahore',
          description: 'Colorful beats, high energy performances, and authentic henna art.',
          dressCode: 'Vibrant Festive Green & Magenta',
          themeColor: '#059669'
        },
        {
          id: 'barat',
          name: 'BARAAT & NIKKAH',
          subtitle: 'The Royal Union & Sacred Vows',
          date: 'Saturday, 16 January 2027',
          isoDate: '2027-01-16T19:30:00',
          time: '7:30 PM onwards',
          venue: 'The Nishat Grand Ballroom',
          address: 'Johar Town, Lahore',
          mapUrl: 'https://maps.google.com/?q=The+Nishat+Hotel+Johar+Town+Lahore',
          description: 'Nikkah ceremony followed by dinner with family and friends.',
          dressCode: 'Royal Burgundy & Traditional Formal',
          themeColor: '#8E1624'
        },
        {
          id: 'walima',
          name: 'WALIMA BANQUET',
          subtitle: 'Blessings & Reception',
          date: 'Sunday, 17 January 2027',
          isoDate: '2027-01-17T20:00:00',
          time: '8:00 PM onwards',
          venue: 'Royal Palm Golf Club Lawn',
          address: 'Canal Bank Road, Lahore',
          mapUrl: 'https://maps.google.com/?q=Royal+Palm+Lahore',
          description: 'Hosted with warm hearts by the groom’s parents.',
          dressCode: 'Black Tie & Elegant Pastels',
          themeColor: '#B82E3E'
        }
      ]
    },
    familyMembers: [
      {
        id: 'f-ah-1',
        name: 'Mr. & Mrs. Kamran Jamil Khan',
        relationship: 'Parents of the Bride',
        side: 'bride',
        displayOrder: 1,
        visible: true
      },
      {
        id: 'f-ah-2',
        name: 'Mr. & Mrs. Tariq Jamil',
        relationship: 'Parents of the Groom',
        side: 'groom',
        displayOrder: 2,
        visible: true
      }
    ],
    guests: [
      {
        id: 'g-ah-1',
        weddingId: 'wedding-ayesha-hamza',
        token: '7Hk92LmX',
        name: 'Ahmad Khan',
        phone: '+92 300 2345678',
        allowedGuests: 2,
        relationship: 'Close Friend',
        side: 'groom',
        invitationStatus: 'sent',
        rsvpStatus: 'attending',
        attendeeCount: 2,
        rsvpMessage: 'Mubarak Hamza bhai! Will definitely be there.',
        invitedEvents: ['mehndi', 'barat', 'walima'],
        openedAt: '2026-09-18T16:00:00Z',
        openCount: 2,
        createdAt: '2026-09-05T10:00:00Z'
      },
      {
        id: 'g-ah-2',
        weddingId: 'wedding-ayesha-hamza',
        token: 'ali-raza-def456',
        name: 'Ali Raza',
        phone: '+92 321 8765432',
        allowedGuests: 2,
        relationship: 'Colleague',
        side: 'both',
        invitationStatus: 'sent',
        rsvpStatus: 'pending',
        attendeeCount: 0,
        invitedEvents: ['barat', 'walima'],
        openCount: 1,
        openedAt: '2026-09-17T18:20:00Z',
        createdAt: '2026-09-05T10:10:00Z'
      },
      {
        id: 'g-ah-3',
        weddingId: 'wedding-ayesha-hamza',
        token: 'usman-ghi789',
        name: 'Muhammad Usman',
        phone: '+92 333 1122445',
        allowedGuests: 3,
        relationship: 'Cousin',
        side: 'groom',
        invitationStatus: 'sent',
        rsvpStatus: 'attending',
        attendeeCount: 3,
        invitedEvents: ['dholki', 'mehndi', 'barat', 'walima'],
        openCount: 3,
        openedAt: '2026-09-18T10:00:00Z',
        createdAt: '2026-09-05T10:20:00Z'
      },
      {
        id: 'g-ah-4',
        weddingId: 'wedding-ayesha-hamza',
        token: 'sara-jkl012',
        name: 'Sara Ahmed',
        phone: '+92 345 9988112',
        allowedGuests: 2,
        relationship: 'Bride Cousin',
        side: 'bride',
        invitationStatus: 'invited',
        rsvpStatus: 'pending',
        attendeeCount: 0,
        invitedEvents: ['mehndi', 'barat'],
        openCount: 0,
        createdAt: '2026-09-06T12:00:00Z'
      }
    ],
    createdAt: '2026-08-15T09:15:00Z',
    updatedAt: '2026-09-18T15:00:00Z'
  },
  {
    id: 'wedding-maryam-bilal',
    ownerId: 'user-bilal',
    ownerName: 'Bilal Siddiqui',
    slug: 'maryam-bilal',
    title: 'Maryam & Bilal Wedding',
    status: 'active',
    theme: 'emerald-luxury',
    greetingTemplate: 'Dear [Guest Name],',
    mainInvitationText:
      'In the name of Allah, the Most Beneficent, the Most Merciful. You are cordially invited to celebrate the wedding reception of Maryam & Bilal.',
    closingText: 'Your heartfelt prayers and company are our most cherished gifts.',
    weddingData: {
      ...initialWeddingData,
      brideName: 'Maryam',
      brideFullName: 'Maryam Nawaz',
      brideParents: 'Daughter of Mr. & Mrs. Nawaz Sharif Bhatti',
      groomName: 'Bilal',
      groomFullName: 'Bilal Siddiqui',
      groomParents: 'Son of Mr. & Mrs. Tariq Siddiqui',
      monogram: 'M & B',
      weddingDate: 'Friday, 12 February 2027',
      mainVenueName: 'PC Crystal Ballroom',
      mainVenueAddress: 'G.O.R. 1, Lahore',
      events: [
        {
          id: 'nikkah',
          name: 'NIKKAH & CELEBRATION',
          subtitle: 'The Sacred Union',
          date: 'Friday, 12 February 2027',
          isoDate: '2027-02-12T18:00:00',
          time: '6:00 PM onwards',
          venue: 'Badshahi Mosque & PC Ballroom',
          address: 'Lahore, Pakistan',
          mapUrl: 'https://maps.google.com/?q=Badshahi+Mosque+Lahore',
          description: 'Sacred Nikkah ceremony at Badshahi Mosque followed by dinner banquet.',
          dressCode: 'Emerald & Gold Formals',
          themeColor: '#1B5E43'
        },
        {
          id: 'walima',
          name: 'WALIMA RECEPTION',
          subtitle: 'Celebration Banquet',
          date: 'Saturday, 13 February 2027',
          isoDate: '2027-02-13T19:30:00',
          time: '7:30 PM onwards',
          venue: 'PC Crystal Ballroom',
          address: 'Lahore',
          mapUrl: 'https://maps.google.com/?q=Pearl+Continental+Lahore',
          description: 'An evening of celebration and gratitude.',
          themeColor: '#2B8361'
        }
      ]
    },
    familyMembers: [],
    guests: [
      {
        id: 'g-mb-1',
        weddingId: 'wedding-maryam-bilal',
        token: 'guest-mb-1',
        name: 'Hassan Raza & Family',
        allowedGuests: 4,
        side: 'both',
        invitationStatus: 'sent',
        rsvpStatus: 'attending',
        attendeeCount: 4,
        invitedEvents: ['nikkah', 'walima'],
        openCount: 2,
        createdAt: '2026-09-08T10:00:00Z'
      }
    ],
    createdAt: '2026-08-20T16:45:00Z',
    updatedAt: '2026-09-17T11:00:00Z'
  },
  {
    id: 'wedding-sara-usman',
    ownerId: 'user-usman',
    ownerName: 'Usman Ahmed',
    slug: 'sara-usman',
    title: 'Sara & Usman Wedding (Draft)',
    status: 'draft',
    theme: 'soft-rose',
    greetingTemplate: 'Dear [Guest Name],',
    mainInvitationText:
      'With great joy and gratitude, we invite you to celebrate the union of Sara & Usman.',
    closingText: 'We would be honored by your presence.',
    weddingData: {
      ...initialWeddingData,
      brideName: 'Sara',
      brideFullName: 'Sara Tariq',
      groomName: 'Usman',
      groomFullName: 'Usman Ahmed',
      monogram: 'S & U',
      weddingDate: 'Saturday, 27 March 2027'
    },
    familyMembers: [],
    guests: [],
    createdAt: '2026-08-25T11:20:00Z',
    updatedAt: '2026-08-25T11:20:00Z'
  }
];

// Seed initial orders
const INITIAL_ORDERS: PlatformOrder[] = [
  {
    id: 'ord-1001',
    customerId: 'user-tariq',
    customerName: 'Tariq Malik',
    customerEmail: 'tariq@wedding.com',
    weddingId: 'wedding-malaika-abdullah',
    weddingTitle: 'Malaika & Abdullah Wedding Celebration',
    plan: 'luxury',
    amount: 149,
    currency: 'USD',
    status: 'paid',
    date: '2026-08-10T14:35:00Z'
  },
  {
    id: 'ord-1002',
    customerId: 'user-hamza',
    customerName: 'Hamza Tariq',
    customerEmail: 'hamza@wedding.com',
    weddingId: 'wedding-ayesha-hamza',
    weddingTitle: 'Ayesha & Hamza Wedding Celebration',
    plan: 'royal',
    amount: 99,
    currency: 'USD',
    status: 'paid',
    date: '2026-08-15T09:20:00Z'
  },
  {
    id: 'ord-1003',
    customerId: 'user-bilal',
    customerName: 'Bilal Siddiqui',
    customerEmail: 'bilal@wedding.com',
    weddingId: 'wedding-maryam-bilal',
    weddingTitle: 'Maryam & Bilal Wedding Celebration',
    plan: 'starter',
    amount: 49,
    currency: 'USD',
    status: 'paid',
    date: '2026-08-20T16:50:00Z'
  },
  {
    id: 'ord-1004',
    customerId: 'user-usman',
    customerName: 'Usman Ahmed',
    customerEmail: 'usman@wedding.com',
    weddingId: 'wedding-sara-usman',
    weddingTitle: 'Sara & Usman Wedding Celebration',
    plan: 'royal',
    amount: 99,
    currency: 'USD',
    status: 'paid',
    date: '2026-08-25T11:25:00Z'
  }
];

// Storage helpers
function loadStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(fallback) ? Array.isArray(parsed) : typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
  }
  return fallback;
}

function saveStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to storage:`, e);
  }
}

// Generate unique, clean alphanumeric token (e.g. "8xK92LmP")
export function generateUniqueToken(prefix?: string): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  if (prefix) {
    const cleanPrefix = prefix
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 10);
    return `${cleanPrefix}-${token.slice(0, 5)}`;
  }
  return token;
}

// Platform Store class
class PlatformStore {
  private users: User[];
  private projects: WeddingProject[];
  private orders: PlatformOrder[];
  private currentUser: User;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.users = loadStorage<User[]>(STORAGE_KEY_USERS, INITIAL_USERS);
    this.projects = loadStorage<WeddingProject[]>(STORAGE_KEY_PROJECTS, INITIAL_PROJECTS);
    this.orders = loadStorage<PlatformOrder[]>(STORAGE_KEY_ORDERS, INITIAL_ORDERS);

    // Initial auth: default to Tariq (customer) or Admin depending on stored preference
    const storedAuthId = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_AUTH) : null;
    const foundUser = storedAuthId ? this.users.find((u) => u.id === storedAuthId) : null;
    this.currentUser = foundUser || this.users[1]; // default Tariq Malik (customer)
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  private persist() {
    saveStorage(STORAGE_KEY_USERS, this.users);
    saveStorage(STORAGE_KEY_PROJECTS, this.projects);
    saveStorage(STORAGE_KEY_ORDERS, this.orders);
    this.notify();
  }

  // --- Auth / User Operations ---
  public getCurrentUser(): User {
    return this.currentUser;
  }

  public setCurrentUser(user: User): void {
    this.currentUser = user;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_AUTH, user.id);
    }
    this.notify();
  }

  public loginAs(userId: string): User | null {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.setCurrentUser(user);
      return user;
    }
    return null;
  }

  public getAllUsers(): User[] {
    return [...this.users];
  }

  public createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...userData
    };
    this.users.unshift(newUser);
    this.persist();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updates };
    if (this.currentUser.id === id) {
      this.currentUser = this.users[index];
    }
    this.persist();
    return this.users[index];
  }

  public getUserById(id: string): User | null {
    return this.users.find((u) => u.id === id) || null;
  }

  public getUserByEmail(email: string): User | null {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  }

  public registerCustomer(
    name: string,
    email: string,
    _password?: string,
    plan: 'starter' | 'royal' | 'luxury' = 'royal'
  ): User {
    const existing = this.getUserByEmail(email);
    if (existing) return existing;

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: 'customer',
      plan,
      accountStatus: 'active',
      createdAt: new Date().toISOString()
    };
    this.users.unshift(newUser);
    this.persist();
    return newUser;
  }

  public getProjectsByOwner(ownerId: string): WeddingProject[] {
    return this.projects.filter((p) => p.ownerId === ownerId);
  }

  public updateProjectStatus(id: string, status: WeddingProject['status']): WeddingProject | null {
    return this.updateProject(id, { status });
  }

  public updateWeddingData(
    id: string,
    updates: Partial<WeddingData>,
    title?: string
  ): WeddingProject | null {
    const project = this.getProjectById(id);
    if (!project) return null;

    const mergedData: WeddingData = {
      ...project.weddingData,
      ...updates
    };

    return this.updateProject(id, {
      weddingData: mergedData,
      title: title || project.title
    });
  }

  public updateTheme(
    id: string,
    theme: any,
    customWording?: any
  ): WeddingProject | null {
    const updates: Partial<WeddingProject> = {
      theme: typeof theme === 'string' ? theme : (theme.id || 'classic-gold')
    };
    if (customWording) {
      if (customWording.greetingTemplate) updates.greetingTemplate = customWording.greetingTemplate;
      if (customWording.mainInvitationText) updates.mainInvitationText = customWording.mainInvitationText;
      if (customWording.closingText) updates.closingText = customWording.closingText;
    }
    return this.updateProject(id, updates);
  }

  public getPlatformStats() {
    const totalProjects = this.projects.length;
    const activeProjects = this.projects.filter((p) => p.status === 'active').length;
    const totalCustomers = this.users.filter((u) => u.role === 'customer').length;
    let totalGuests = 0;
    let totalInvitationsSent = 0;
    let openedGuests = 0;

    for (const p of this.projects) {
      totalGuests += p.guests.length;
      for (const g of p.guests) {
        if (g.invitationStatus === 'sent' || g.openCount > 0) totalInvitationsSent++;
        if (g.openCount > 0) openedGuests++;
      }
    }

    const totalRevenue = this.orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const overallOpenRate = totalGuests > 0 ? Math.round((openedGuests / totalGuests) * 100) : 0;

    return {
      totalProjects,
      activeProjects,
      totalCustomers,
      totalGuests,
      totalInvitationsSent,
      openedGuests,
      totalRevenue,
      overallOpenRate
    };
  }

  public deleteUser(id: string): boolean {
    if (id === 'user-admin') return false; // Prevent deleting master admin
    this.users = this.users.filter((u) => u.id !== id);
    this.persist();
    return true;
  }

  // --- Project Operations ---
  public getAllProjects(): WeddingProject[] {
    return [...this.projects];
  }

  public getProjectsForUser(userId: string): WeddingProject[] {
    const user = this.users.find((u) => u.id === userId);
    if (user && user.role === 'admin') {
      return [...this.projects];
    }
    return this.projects.filter((p) => p.ownerId === userId);
  }

  public getProjectById(id: string): WeddingProject | null {
    return this.projects.find((p) => p.id === id) || null;
  }

  public getProjectBySlug(slug: string): WeddingProject | null {
    return this.projects.find((p) => p.slug.toLowerCase() === slug.toLowerCase()) || null;
  }

  public getProjectByGuestToken(token: string): { project: WeddingProject; guest: GuestRecord } | null {
    for (const project of this.projects) {
      const guest = project.guests.find((g) => g.token.toLowerCase() === token.toLowerCase());
      if (guest) {
        return { project, guest };
      }
    }
    return null;
  }

  public createProject(
    projectData: Omit<WeddingProject, 'id' | 'createdAt' | 'updatedAt' | 'guests' | 'familyMembers'> & {
      guests?: GuestRecord[];
      familyMembers?: FamilyMember[];
    }
  ): WeddingProject {
    const newProject: WeddingProject = {
      id: `wedding-${Date.now()}`,
      guests: projectData.guests || [],
      familyMembers: projectData.familyMembers || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...projectData
    };
    this.projects.unshift(newProject);
    this.persist();
    return newProject;
  }

  public updateProject(id: string, updates: Partial<WeddingProject>): WeddingProject | null {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.projects[index] = {
      ...this.projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.projects[index];
  }

  public deleteProject(id: string): boolean {
    const beforeCount = this.projects.length;
    this.projects = this.projects.filter((p) => p.id !== id);
    if (this.projects.length !== beforeCount) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Guest Operations within a Project ---
  public addGuest(weddingId: string, guestData: Omit<GuestRecord, 'id' | 'weddingId' | 'token' | 'createdAt' | 'openCount'>): GuestRecord | null {
    const project = this.getProjectById(weddingId);
    if (!project) return null;

    const token = generateUniqueToken(guestData.name);
    const newGuest: GuestRecord = {
      id: `guest-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      weddingId,
      token,
      openCount: 0,
      createdAt: new Date().toISOString(),
      ...guestData
    };

    project.guests.unshift(newGuest);
    project.updatedAt = new Date().toISOString();
    this.persist();
    return newGuest;
  }

  public updateGuest(weddingId: string, guestId: string, updates: Partial<GuestRecord>): GuestRecord | null {
    const project = this.getProjectById(weddingId);
    if (!project) return null;

    const gIndex = project.guests.findIndex((g) => g.id === guestId);
    if (gIndex === -1) return null;

    project.guests[gIndex] = {
      ...project.guests[gIndex],
      ...updates
    };
    project.updatedAt = new Date().toISOString();
    this.persist();
    return project.guests[gIndex];
  }

  public deleteGuest(weddingId: string, guestId: string): boolean {
    const project = this.getProjectById(weddingId);
    if (!project) return false;

    const initialLen = project.guests.length;
    project.guests = project.guests.filter((g) => g.id !== guestId);
    if (project.guests.length !== initialLen) {
      project.updatedAt = new Date().toISOString();
      this.persist();
      return true;
    }
    return false;
  }

  public regenerateGuestToken(weddingId: string, guestId: string): string | null {
    const project = this.getProjectById(weddingId);
    if (!project) return null;

    const guest = project.guests.find((g) => g.id === guestId);
    if (!guest) return null;

    guest.token = generateUniqueToken(guest.name);
    project.updatedAt = new Date().toISOString();
    this.persist();
    return guest.token;
  }

  public recordGuestOpen(weddingId: string, guestId: string): void {
    const project = this.getProjectById(weddingId);
    if (!project) return;
    const guest = project.guests.find((g) => g.id === guestId);
    if (!guest) return;

    guest.openCount = (guest.openCount || 0) + 1;
    guest.openedAt = new Date().toISOString();
    if (guest.invitationStatus === 'invited' || guest.invitationStatus === 'pending') {
      guest.invitationStatus = 'sent';
    }
    project.updatedAt = new Date().toISOString();
    this.persist();
  }

  public submitGuestRsvp(
    weddingId: string,
    guestId: string,
    rsvpData: {
      attending: 'yes' | 'no' | 'maybe';
      attendeeCount: number;
      message?: string;
    }
  ): boolean {
    const project = this.getProjectById(weddingId);
    if (!project) return false;
    const guest = project.guests.find((g) => g.id === guestId);
    if (!guest) return false;

    // Enforce allowedGuests cap
    const maxAllowed = guest.allowedGuests || 2;
    const sanitizedCount = rsvpData.attending === 'no' ? 0 : Math.min(Math.max(1, rsvpData.attendeeCount), maxAllowed);

    guest.rsvpStatus = rsvpData.attending === 'yes' ? 'attending' : rsvpData.attending === 'no' ? 'not_attending' : 'maybe';
    guest.attendeeCount = sanitizedCount;
    if (rsvpData.message) {
      guest.rsvpMessage = rsvpData.message;
    }
    project.updatedAt = new Date().toISOString();
    this.persist();
    return true;
  }

  public bulkImportGuests(
    weddingId: string,
    rawList: Array<{
      name: string;
      phone?: string;
      email?: string;
      familyName?: string;
      side?: 'bride' | 'groom' | 'both';
      allowedGuests?: number;
      relationship?: string;
      personalNote?: string;
    }>
  ): { importedCount: number; duplicatesCount: number } {
    const project = this.getProjectById(weddingId);
    if (!project) return { importedCount: 0, duplicatesCount: 0 };

    let importedCount = 0;
    let duplicatesCount = 0;

    const existingNames = new Set(project.guests.map((g) => g.name.toLowerCase().trim()));

    const newGuests: GuestRecord[] = [];

    for (const item of rawList) {
      if (!item.name || !item.name.trim()) continue;
      const cleanName = item.name.trim();

      if (existingNames.has(cleanName.toLowerCase())) {
        duplicatesCount++;
        continue;
      }

      existingNames.add(cleanName.toLowerCase());

      const token = generateUniqueToken(cleanName);
      newGuests.push({
        id: `guest-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        weddingId,
        token,
        name: cleanName,
        familyName: item.familyName || undefined,
        phone: item.phone || undefined,
        email: item.email || undefined,
        allowedGuests: item.allowedGuests && item.allowedGuests > 0 ? item.allowedGuests : 2,
        relationship: item.relationship || 'Guest',
        side: item.side || 'both',
        invitationStatus: 'invited',
        rsvpStatus: 'pending',
        attendeeCount: 0,
        invitedEvents: project.weddingData.events.map((e) => e.id),
        personalNote: item.personalNote || undefined,
        openCount: 0,
        createdAt: new Date().toISOString()
      });
      importedCount++;
    }

    project.guests.unshift(...newGuests);
    project.updatedAt = new Date().toISOString();
    this.persist();

    return { importedCount, duplicatesCount };
  }

  // --- Orders Operations ---
  public getAllOrders(): PlatformOrder[] {
    return [...this.orders];
  }

  public createOrder(orderData: Omit<PlatformOrder, 'id' | 'date'>): PlatformOrder {
    const newOrder: PlatformOrder = {
      id: `ord-${Date.now()}`,
      date: new Date().toISOString(),
      ...orderData
    };
    this.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  // --- CSV Export / Import Helpers ---
  public exportGuestsCsv(weddingId: string): string {
    const project = this.getProjectById(weddingId);
    if (!project) return '';

    const headers = [
      'Name',
      'Phone',
      'Email',
      'Family',
      'Side',
      'AllowedGuests',
      'UniqueToken',
      'PersonalizedLink',
      'OpenStatus',
      'OpenCount',
      'RsvpStatus',
      'AttendeeCount',
      'RsvpMessage'
    ];

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wedding.nuptia.com';

    const rows = project.guests.map((g) => [
      `"${(g.name || '').replace(/"/g, '""')}"`,
      `"${(g.phone || '').replace(/"/g, '""')}"`,
      `"${(g.email || '').replace(/"/g, '""')}"`,
      `"${(g.familyName || '').replace(/"/g, '""')}"`,
      g.side || 'both',
      g.allowedGuests || 2,
      g.token,
      `"${baseUrl}/i/${g.token}"`,
      g.openCount > 0 ? 'Opened' : 'Not Opened',
      g.openCount || 0,
      g.rsvpStatus,
      g.attendeeCount || 0,
      `"${(g.rsvpMessage || '').replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  // Reset to demo defaults
  public resetToDefaults(): void {
    this.users = INITIAL_USERS;
    this.projects = INITIAL_PROJECTS;
    this.orders = INITIAL_ORDERS;
    this.currentUser = INITIAL_USERS[1];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_USERS);
      localStorage.removeItem(STORAGE_KEY_PROJECTS);
      localStorage.removeItem(STORAGE_KEY_ORDERS);
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
    this.notify();
  }
}

export const platformStore = new PlatformStore();
