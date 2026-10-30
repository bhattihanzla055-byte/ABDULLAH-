import { WeddingData } from '../types/wedding';
import couplePhotoUrl from '../assets/images/couple_original_portrait_1789211490264.jpg';

export const initialWeddingData: WeddingData = {
  // Couple Information
  brideName: 'Malaika',
  brideFullName: 'Malaika Malik',
  brideParents: 'Daughter of Mr. & Mrs. Tariq Mahmood Malik',
  brideBio: 'An architect with an eye for harmony, elegance, and warm laughter. Ready to build a forever home filled with love.',

  groomName: 'Abdullah',
  groomFullName: 'Abdullah Ahmed',
  groomParents: 'Son of Mr. & Mrs. Farooq Ahmed Siddiqui',
  groomBio: 'A software director with a passion for soulful music, quiet evenings, and boundless adventures with his favorite person.',

  couplePhoto: couplePhotoUrl,
  monogram: 'M & A',

  // Dates & Countdown
  weddingDate: 'Saturday, 25 December 2026',
  weddingTime: '7:00 PM onwards',
  weddingIsoDateTime: '2026-12-25T19:00:00',
  saveTheDateSubtitle: 'Request the honor of your presence as two souls unite under the canopy of grace and love.',

  // Traditional Family Inviting Statement
  familyBlessingsTitle: 'WITH THE BLESSINGS OF OUR FAMILIES',
  familyBlessingsBody:
    'Under the gracious guidance and prayers of our elders, we warmly invite you and your family to witness and celebrate the sacred union of our beloved children. Your presence and heartfelt prayers will make our celebrations truly complete.',
  hostFamilies: 'The Malik & Siddiqui Families',

  // Main Venue
  mainVenueName: 'The Royal Palm Golf & Country Club',
  mainVenueAddress: '52 Canal Bank Road, Cantt, Lahore, Punjab, Pakistan',
  googleMapsUrl: 'https://maps.google.com/?q=Royal+Palm+Golf+and+Country+Club+Lahore',
  embedMapQuery: 'Royal Palm Golf and Country Club Lahore',

  // Story
  storyTitle: 'OUR STORY',
  storyQuote: 'Two hearts, two families, and one beautiful destiny written in the stars.',
  storyParagraphs: [
    'Our paths first crossed on a crisp autumn evening through mutual friends. What began as a simple conversation over spiced Kashmiri chai soon turned into hours of shared dreams, inside jokes, and an unspoken knowing that our souls had known each other forever.',
    'Over the years, across distant flights, family gatherings, and countless everyday moments, our respect and love only deepened. In December 2025, during a tranquil sunset overlooking the hills, Abdullah asked the question that made both our families burst into tears of joy.',
    'Now, hand in hand, surrounded by the warmth of our loved ones, we step into the most sacred and joyous chapter of our lives together.'
  ],

  // Events Timeline
  events: [
    {
      id: 'mehndi',
      name: 'MEHNDI CELEBRATION',
      subtitle: 'An Evening of Henna, Folk Songs & Vibrant Colors',
      date: 'Thursday, 24 December 2026',
      isoDate: '2026-12-24T18:30:00',
      time: '6:30 PM Onwards',
      venue: 'The Grand Marquee, Royal Palm',
      address: '52 Canal Bank Road, Lahore',
      mapUrl: 'https://maps.google.com/?q=Royal+Palm+Golf+and+Country+Club+Lahore',
      description: 'Join us for a joyous night of lively Dholak beats, traditional dance performances, and vibrant yellow & marigold hues.',
      dressCode: 'Vibrant Festive (Yellows, Pinks & Greens)',
      themeColor: '#D97706'
    },
    {
      id: 'barat',
      name: 'BARAT & NIKKAH',
      subtitle: 'The Sacred Vows & Main Wedding Ceremony',
      date: 'Friday, 25 December 2026',
      isoDate: '2026-12-25T19:00:00',
      time: '7:00 PM Onwards (Nikkah at 8:15 PM)',
      venue: 'Crystal Ballroom, Pearl Continental',
      address: 'Shahrah-e-Quaid-e-Azam, G.O.R. - I, Lahore',
      mapUrl: 'https://maps.google.com/?q=Pearl+Continental+Hotel+Lahore',
      description: 'The solemn Nikkah solemnization followed by an exquisite royal dinner. Your presence in blessing the couple is our greatest honor.',
      dressCode: 'Formal Traditional / Black Tie (Gold, Ivory & Burgundy)',
      themeColor: '#B91C1C'
    },
    {
      id: 'walima',
      name: 'WALIMA RECEPTION',
      subtitle: 'The Blessed Feast & Family Reception',
      date: 'Saturday, 26 December 2026',
      isoDate: '2026-12-26T19:30:00',
      time: '7:30 PM Onwards',
      venue: 'The Royal Lawn & Pavilion, DHA Golf Club',
      address: 'Sector J, Phase 6, DHA Lahore',
      mapUrl: 'https://maps.google.com/?q=DHA+Golf+Club+Lahore',
      description: 'Hosted with deepest gratitude by the groom’s family to celebrate our first evening as husband and wife.',
      dressCode: 'Modern Royal Pastels & Formal Attire',
      themeColor: '#047857'
    }
  ],

  // Gallery
  gallery: [
    {
      id: 'g1',
      title: 'The Royal Wedding Portrait',
      caption: 'Two souls united in grace, tradition, and timeless love',
      url: couplePhotoUrl
    },
    {
      id: 'g2',
      title: 'A Glimpse of Joy',
      caption: 'Laughter that fills the quietest rooms',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'g3',
      title: 'Traditional Henna Art',
      caption: 'Intricate blessings woven in henna',
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'g4',
      title: 'Under the Golden Hour',
      caption: 'Every step guided by grace',
      url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'g5',
      title: 'Our Families United',
      caption: 'Two legacies becoming one family',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'g6',
      title: 'Eternal Vows',
      caption: 'Ready for our forever journey',
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80'
    }
  ],

  // Pre-seeded Wishes
  initialWishes: [
    {
      id: 'w1',
      name: 'Uncle Usman & Family',
      relation: 'Bride’s Uncle',
      message: 'May Allah bless this beautiful union with endless love, peace, and prosperity. Malaika, you will always be our shining princess!',
      timestamp: '2 hours ago'
    },
    {
      id: 'w2',
      name: 'Hamza & Sarah',
      relation: 'Groom’s Best Friends',
      message: 'Could not be happier for you both! Abdullah found his soulmate, and Malaika is truly an angel. Counting down the days to dance on the Mehndi!',
      timestamp: '5 hours ago'
    },
    {
      id: 'w3',
      name: 'Dadi Jan (Grandmother)',
      relation: 'Grandmother',
      message: 'Thousands of prayers and duas for my dearest children. May your home be filled with barakah, joy, and laughter forever.',
      timestamp: '1 day ago'
    }
  ],

  // Music details
  musicTitle: 'Wedding Sehra',
  musicArtist: 'Mazhar Rahi & Fiza Ali',
  youtubeVideoId: 'HD4UtsmAV4Y',
  youtubeUrl: 'https://youtu.be/HD4UtsmAV4Y?si=x2F0jtVE26WUOG7O',
  musicUrl: '' // Supports custom MP3 if needed
};
