import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { initialWeddingData } from './data/weddingData';
import { WeddingData, GuestInvite } from './types/wedding';
import { WeddingProject, User, GuestRecord } from './types/platform';
import { platformStore } from './services/platformStore';
import { PetalsAndSparklesCanvas } from './components/PetalsAndSparklesCanvas';
import { OpeningEnvelope } from './components/OpeningEnvelope';
import { HeroSection } from './components/HeroSection';
import { DateCountdownSection } from './components/DateCountdownSection';
import { EventsSection } from './components/EventsSection';
import { VenueSection } from './components/VenueSection';
import { CoupleSection } from './components/CoupleSection';
import { OurStorySection } from './components/OurStorySection';
import { FamilyInvitationSection } from './components/FamilyInvitationSection';
import { GallerySection } from './components/GallerySection';
import { RsvpSection } from './components/RsvpSection';
import { WishesSection } from './components/WishesSection';
import { FooterSection } from './components/FooterSection';
import { FloatingMusicButton } from './components/FloatingMusicButton';
import { CustomizeDrawer } from './components/CustomizeDrawer';
import { GuestInviteManagerModal } from './components/GuestInviteManagerModal';
import { CustomerDashboard } from './components/dashboard/CustomerDashboard';
import { PlatformAdminPanel } from './components/admin/PlatformAdminPanel';
import {
  parseInviteFromUrl,
  loadGuestInvites,
  generateInviteUrl,
  guestRecordToInvite
} from './utils/inviteHelper';
import {
  UserPlus,
  Sparkles,
  X,
  Share2,
  Check,
  LayoutDashboard,
  Shield,
  Heart,
  ChevronDown,
  Eye,
  ExternalLink,
  Crown
} from 'lucide-react';

export type AppViewMode = 'invitation' | 'dashboard' | 'admin';

export default function App() {
  // Store subscription state ticker
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    const unsubscribe = platformStore.subscribe(() => {
      forceUpdate();
    });
    return unsubscribe;
  }, [forceUpdate]);

  // Current logged in user from store
  const currentUser = platformStore.getCurrentUser();
  const allProjects = platformStore.getAllProjects();

  // Active Project Selection
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    if (allProjects.length > 0) return allProjects[0].id;
    return 'wedding-malaika-abdullah';
  });

  const activeProject: WeddingProject =
    platformStore.getProjectById(selectedProjectId) ||
    allProjects[0] || {
      id: 'wedding-default',
      ownerId: 'user-tariq',
      ownerName: 'Tariq Malik',
      title: 'Malaika & Abdullah Wedding Celebration',
      slug: 'malaika-abdullah',
      status: 'active',
      theme: 'classic-gold',
      greetingTemplate: 'Dear [Guest Name],',
      mainInvitationText:
        'With immense joy and gratitude, we invite you to share in our wedding celebrations.',
      closingText: 'Your gracious presence and prayers will make our celebration complete.',
      weddingData: initialWeddingData,
      familyMembers: [],
      guests: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

  // View mode: 'invitation' (Live Card) | 'dashboard' (Client) | 'admin' (Platform Owner)
  const [viewMode, setViewMode] = useState<AppViewMode>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path.includes('/admin') || search.includes('view=admin') || hash === '#admin') {
        return 'admin';
      }
      if (path.includes('/dashboard') || search.includes('view=dashboard') || hash === '#dashboard') {
        return 'dashboard';
      }
    }
    return 'invitation';
  });

  // Active Guest state
  const [activeGuestRecord, setActiveGuestRecord] = useState<GuestRecord | null>(null);
  const [activeGuestInvite, setActiveGuestInvite] = useState<GuestInvite | null>(() => {
    if (typeof window !== 'undefined') {
      return parseInviteFromUrl(window.location.search);
    }
    return null;
  });

  // Check URL for guest token e.g. /i/:token or ?t=token or ?token=token
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    let token = searchParams.get('token') || searchParams.get('t') || searchParams.get('invite');

    if (!token && pathname.includes('/i/')) {
      const parts = pathname.split('/i/');
      if (parts[1]) {
        token = parts[1].split('/')[0];
      }
    }

    if (token) {
      const match = platformStore.getProjectByGuestToken(token);
      if (match) {
        setSelectedProjectId(match.project.id);
        setActiveGuestRecord(match.guest);
        setActiveGuestInvite(guestRecordToInvite(match.guest));
        setViewMode('invitation');

        // Record guest open event
        platformStore.recordGuestOpen(match.project.id, match.guest.id);
      }
    }
  }, []);

  // Listen to popstate / hashchange for back/forward browser navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path.includes('/admin') || search.includes('view=admin') || hash === '#admin') {
        setViewMode('admin');
      } else if (path.includes('/dashboard') || search.includes('view=dashboard') || hash === '#dashboard') {
        setViewMode('dashboard');
      } else {
        setViewMode('invitation');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Sync active guest record to active guest invite
  const handleSelectGuest = (guest: GuestRecord | null) => {
    setActiveGuestRecord(guest);
    if (guest) {
      setActiveGuestInvite(guestRecordToInvite(guest));
      platformStore.recordGuestOpen(activeProject.id, guest.id);
    } else {
      setActiveGuestInvite(null);
    }
    // Replay envelope on guest change
    setIsEnvelopeOpened(false);
  };

  // Guest invites modal & share states
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);

  // Controls the envelope open state
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);

  // Scroll to top when opening completes
  const handleOpenComplete = () => {
    setIsEnvelopeOpened(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReplayEnvelope = () => {
    setIsEnvelopeOpened(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyActiveLink = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    let url = '';

    if (activeGuestRecord) {
      url = `${origin}/i/${activeGuestRecord.token}`;
    } else if (activeGuestInvite) {
      url = generateInviteUrl(activeGuestInvite);
    } else {
      url = `${origin}/`;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      prompt('Copy invitation link:', url);
    }
  };

  // Handle RSVP submission from wedding card
  const handleRsvpSubmitted = (submission: {
    attending: 'yes' | 'no';
    numberOfGuests: number;
    message: string;
    emailOrPhone: string;
  }) => {
    if (activeGuestRecord) {
      platformStore.submitGuestRsvp(activeProject.id, activeGuestRecord.id, {
        attending: submission.attending,
        attendeeCount: submission.numberOfGuests,
        message: submission.message
      });
    }
  };

  const weddingData = activeProject.weddingData;

  // Render Admin View
  if (viewMode === 'admin') {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        <PlatformAdminPanel
          currentUser={currentUser}
          onExitAdmin={() => setViewMode('invitation')}
          onImpersonateCustomer={(user, project) => {
            platformStore.setCurrentUser(user);
            setSelectedProjectId(project.id);
            setViewMode('dashboard');
          }}
        />
      </div>
    );
  }

  // Render Customer Dashboard View
  if (viewMode === 'dashboard') {
    const userProjects = platformStore.getProjectsForUser(currentUser.id);
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        <CustomerDashboard
          project={activeProject}
          currentUser={currentUser}
          availableProjects={userProjects.length > 0 ? userProjects : allProjects}
          onSelectProject={(id) => setSelectedProjectId(id)}
          onPreviewAsGuest={(guest) => {
            handleSelectGuest(guest);
            setViewMode('invitation');
          }}
          onPreviewPublic={() => {
            handleSelectGuest(null);
            setViewMode('invitation');
          }}
          onOpenAdmin={() => setViewMode('admin')}
          onLogout={() => {
            platformStore.loginAs('user-tariq');
            setViewMode('invitation');
          }}
          onRefreshProject={forceUpdate}
        />
      </div>
    );
  }

  // Render Beautiful Live Wedding Invitation (Original Experience Preserved & Enhanced)
  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F2] text-[#2C241D]">
      {/* Floating Rose Petals & Golden Sparkles Background Canvas */}
      <PetalsAndSparklesCanvas density={22} />

      {/* Floating Platform Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-[#D4AF37]/40 bg-[#FAF6EE]/95 px-3 py-2 shadow-xs backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
          {/* Left: Platform Branding & Project Title */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C59B27] text-white shadow-2xs">
              <Crown className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-cinzel text-xs font-bold tracking-wider text-[#3D2E1E]">
                  NUPTIA
                </span>
                <span className="rounded-full bg-[#D4AF37]/20 px-1.5 py-0.2 text-[9px] font-bold text-[#7A5B1E]">
                  PLATFORM
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#7D664D] truncate max-w-[170px] sm:max-w-xs">
                {activeProject.title}
              </p>
            </div>
          </div>

          {/* Center: Guest Simulator Pill (When viewing invitation) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37] bg-white px-3 py-1 text-xs font-medium text-[#5E4723] shadow-2xs hover:bg-[#FAF4E6] transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#C59B27]" />
              <span className="truncate max-w-[140px] sm:max-w-none">
                {activeGuestRecord
                  ? `Guest: ${activeGuestRecord.name}`
                  : activeGuestInvite
                  ? `Guest: ${activeGuestInvite.guestName}`
                  : 'Viewing as: General Visitor'}
              </span>
              <ChevronDown className="h-3 w-3 text-[#A88234]" />
            </button>

            {/* Guest Simulation Dropdown */}
            {isNavDropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 rounded-xl border border-[#D4AF37]/50 bg-white p-2 shadow-xl z-50">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8C7653]">
                  Simulate Personalized Guest URL
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleSelectGuest(null);
                    setIsNavDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                    !activeGuestRecord && !activeGuestInvite
                      ? 'bg-[#FAF3E1] font-bold text-[#8C6D28]'
                      : 'hover:bg-[#FAF8F5] text-[#3D312A]'
                  }`}
                >
                  <span>General Public (No Guest Token)</span>
                  {!activeGuestRecord && !activeGuestInvite && <Check className="h-3 w-3" />}
                </button>

                <div className="my-1 border-t border-[#EAE1D2]" />

                <div className="max-h-48 overflow-y-auto space-y-0.5">
                  {activeProject.guests.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        handleSelectGuest(g);
                        setIsNavDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                        activeGuestRecord?.id === g.id
                          ? 'bg-[#FAF3E1] font-bold text-[#8C6D28]'
                          : 'hover:bg-[#FAF8F5] text-[#3D312A]'
                      }`}
                    >
                      <div className="truncate pr-1">
                        <div>{g.name}</div>
                        <div className="text-[10px] text-[#8C7653]">
                          {g.allowedGuests} seats • {g.relationship || 'Guest'}
                        </div>
                      </div>
                      {activeGuestRecord?.id === g.id && <Check className="h-3 w-3 text-[#C59B27]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: View Switchers (Live Invitation, Customer Dashboard, Platform Admin) */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setViewMode('dashboard')}
              className="inline-flex items-center gap-1 rounded-lg border border-[#D4AF37] bg-gradient-to-r from-[#FAF3E1] to-[#FFFDF9] px-2.5 py-1 text-xs font-bold text-[#6B5127] shadow-2xs hover:bg-[#FAF0D4] transition-all"
              title="Open Customer Wedding Management Dashboard"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-[#C59B27]" />
              <span className="hidden sm:inline">Client Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('admin')}
              className="inline-flex items-center gap-1 rounded-lg border border-[#7D664D]/40 bg-white px-2.5 py-1 text-xs font-medium text-[#4A3D2F] shadow-2xs hover:bg-[#FAF7F2] transition-all"
              title="Platform Owner Admin Portal"
            >
              <Shield className="h-3.5 w-3.5 text-[#8C7653]" />
              <span className="hidden sm:inline">Platform Admin</span>
              <span className="sm:hidden">Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Active Guest Preview Status Bar (When viewing as a specific guest) */}
      {(activeGuestRecord || activeGuestInvite) && (
        <div className="sticky top-[45px] z-40 flex flex-wrap items-center justify-between gap-2 border-b border-[#D4AF37] bg-[#FAF3E1]/95 px-4 py-2 text-xs backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-serif-luxury font-bold text-[#3B2919]">
              Viewing Personalized Card for:{' '}
              {activeGuestRecord
                ? activeGuestRecord.name
                : `${activeGuestInvite?.salutation ? `${activeGuestInvite.salutation} ` : ''}${
                    activeGuestInvite?.guestName
                  }`}
            </span>
            <span className="rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-[#8C6D28] border border-[#D4AF37]/50">
              🪑 {activeGuestRecord ? activeGuestRecord.allowedGuests : activeGuestInvite?.seats || 2} Seats
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyActiveLink}
              className="inline-flex items-center gap-1 rounded-md border border-[#D4AF37] bg-white px-2 py-1 text-[11px] font-medium text-[#6B5127] hover:bg-[#FAF4E8]"
            >
              {copiedLink ? <Check className="h-3 w-3 text-emerald-600" /> : <Share2 className="h-3 w-3" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Guest Link'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectGuest(null)}
              className="rounded-md p-1 text-gray-500 hover:bg-[#E8DCC4]"
              title="Exit guest preview and view default card"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Opening Envelope Screen */}
      <AnimatePresence mode="wait">
        {!isEnvelopeOpened && (
          <OpeningEnvelope
            key="opening-envelope"
            data={weddingData}
            guestInvite={
              activeGuestRecord
                ? guestRecordToInvite(activeGuestRecord)
                : activeGuestInvite
            }
            onOpenComplete={handleOpenComplete}
          />
        )}
      </AnimatePresence>

      {/* Main Wedding Invitation Card (Vertical Scrolling Experience) */}
      {isEnvelopeOpened && (
        <motion.main
          id="main-wedding-invitation"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative z-20 mx-auto max-w-3xl overflow-hidden px-2 py-8 sm:px-6 md:py-12"
        >
          {/* Top Return to Envelope Pill */}
          <div className="mb-4 flex justify-center gap-3">
            <button
              type="button"
              onClick={handleReplayEnvelope}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-white/80 px-3.5 py-1 text-[11px] font-medium text-[#7D664D] shadow-2xs backdrop-blur-xs transition-all hover:bg-[#FAF5EC]"
            >
              <span>✉️ View Envelope Again</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('dashboard')}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37] bg-gradient-to-r from-[#FAF3E1] to-[#FFFDF9] px-3.5 py-1 text-[11px] font-bold text-[#8C6D28] shadow-2xs transition-all hover:shadow-xs"
            >
              <LayoutDashboard className="h-3 w-3 text-[#C59B27]" />
              <span>Customer Dashboard (انتظامی ڈیش بورڈ)</span>
            </button>
          </div>

          {/* 1. Hero Section */}
          <HeroSection
            data={weddingData}
            guestInvite={
              activeGuestRecord
                ? guestRecordToInvite(activeGuestRecord)
                : activeGuestInvite
            }
          />

          {/* 2. Wedding Date & Countdown Section */}
          <DateCountdownSection data={weddingData} />

          {/* 3. Wedding Events Timeline (Mehndi, Barat, Walima) */}
          <EventsSection
            events={weddingData.events}
            guestInvite={
              activeGuestRecord
                ? guestRecordToInvite(activeGuestRecord)
                : activeGuestInvite
            }
          />

          {/* 4. Venue Section */}
          <VenueSection data={weddingData} />

          {/* 5. Couple Section */}
          <CoupleSection data={weddingData} />

          {/* 6. Our Story */}
          <OurStorySection data={weddingData} />

          {/* 7. Family Invitation with Extended Family Support */}
          <FamilyInvitationSection
            data={weddingData}
            familyMembers={activeProject.familyMembers}
          />

          {/* 8. Memories Gallery with Lightbox */}
          <GallerySection gallery={weddingData.gallery} />

          {/* 9. RSVP Section connected to Platform Store */}
          <RsvpSection
            data={weddingData}
            guestInvite={
              activeGuestRecord
                ? guestRecordToInvite(activeGuestRecord)
                : activeGuestInvite
            }
            onRsvpSubmitted={handleRsvpSubmitted}
          />

          {/* 10. Guest Wishes & Blessings */}
          <WishesSection initialWishes={weddingData.initialWishes} />

          {/* 11. Final Section & WhatsApp Sharing */}
          <FooterSection
            data={weddingData}
            onReplayEnvelope={handleReplayEnvelope}
          />
        </motion.main>
      )}

      {/* Floating Audio Controller */}
      <FloatingMusicButton data={weddingData} />

      {/* Floating Customer Dashboard Quick Button */}
      <div className="fixed bottom-24 right-5 z-40">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setViewMode('dashboard')}
          className="flex items-center gap-2 rounded-full border-2 border-[#D4AF37] bg-gradient-to-r from-[#FAF4E5] via-[#FFFFFF] to-[#FAF4E5] px-4 py-2.5 text-xs font-bold text-[#574127] shadow-xl hover:bg-[#FAF0D4] transition-all"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C59B27] text-white">
            <LayoutDashboard className="h-3.5 w-3.5" />
          </div>
          <span className="tracking-wide">Client Dashboard</span>
          <span className="rounded-full bg-[#FAF0D8] border border-[#D4AF37] px-1.5 py-0.2 text-[10px] font-bold text-[#8A6A27]">
            {activeProject.guests.length}
          </span>
        </motion.button>
      </div>

      {/* Customization Drawer for Quick Edits */}
      <CustomizeDrawer
        data={weddingData}
        onUpdateData={(newData) => {
          platformStore.updateWeddingData(activeProject.id, newData);
        }}
        onResetDefaults={() => {
          platformStore.updateWeddingData(activeProject.id, initialWeddingData);
        }}
        onOpenGuestManager={() => setViewMode('dashboard')}
      />
    </div>
  );
}
