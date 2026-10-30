import React, { useState } from 'react';
import { WeddingProject, User, GuestRecord, ThemeConfig } from '../../types/platform';
import { WeddingData, WeddingEvent } from '../../types/wedding';
import { platformStore } from '../../services/platformStore';
import { DashboardHeader } from './DashboardHeader';
import { QuickStatsGrid } from './QuickStatsGrid';
import { SetupWizard } from './SetupWizard';
import { WeddingDetailsTab } from './WeddingDetailsTab';
import { EventsManagementTab } from './EventsManagementTab';
import { FamilyManagementTab } from './FamilyManagementTab';
import { PhotosAndMusicTab } from './PhotosAndMusicTab';
import { GuestManagementTab } from './GuestManagementTab';
import { RsvpDashboardTab } from './RsvpDashboardTab';
import { DesignCustomizationTab } from './DesignCustomizationTab';
import { PublishChecklistTab } from './PublishChecklistTab';
import {
  FileText,
  Calendar,
  Users,
  Image as ImageIcon,
  UserCheck,
  CheckCircle,
  Palette,
  Send,
  Sparkles
} from 'lucide-react';

interface CustomerDashboardProps {
  project: WeddingProject;
  currentUser: User;
  onSelectProject: (projectId: string) => void;
  availableProjects: WeddingProject[];
  onPreviewAsGuest: (guest: GuestRecord) => void;
  onPreviewPublic: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
  onRefreshProject: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  project,
  currentUser,
  onSelectProject,
  availableProjects,
  onPreviewAsGuest,
  onPreviewPublic,
  onOpenAdmin,
  onLogout,
  onRefreshProject
}) => {
  const [activeTab, setActiveTab] = useState<string>('guests');

  const handleSaveWeddingDetails = (updatedData: Partial<WeddingData>, title?: string) => {
    platformStore.updateWeddingData(project.id, updatedData, title);
    onRefreshProject();
  };

  const handleSaveEvents = (events: WeddingEvent[]) => {
    platformStore.updateWeddingData(project.id, { events });
    onRefreshProject();
  };

  const handleSaveFamily = (
    familyMembers: any[],
    traditionalBody?: string,
    hostFamilies?: string
  ) => {
    platformStore.updateProject(project.id, { familyMembers });
    if (traditionalBody || hostFamilies) {
      platformStore.updateWeddingData(project.id, {
        familyBlessingsBody: traditionalBody,
        hostFamilies
      });
    }
    onRefreshProject();
  };

  const handleSaveMedia = (
    gallery: any[],
    musicConfig: { youtubeId: string; trackTitle: string }
  ) => {
    platformStore.updateWeddingData(project.id, {
      gallery,
      youtubeVideoId: musicConfig.youtubeId,
      musicTitle: musicConfig.trackTitle
    });
    onRefreshProject();
  };

  const handleSaveTheme = (
    theme: ThemeConfig,
    wording?: WeddingProject['customWording']
  ) => {
    platformStore.updateTheme(project.id, theme, wording);
    onRefreshProject();
  };

  const handleUpdateStatus = (status: WeddingProject['status']) => {
    platformStore.updateProjectStatus(project.id, status);
    onRefreshProject();
  };

  const tabs = [
    { id: 'guests', label: 'Guest List & URLs', icon: UserCheck, badge: project.guests.length },
    { id: 'rsvp', label: 'RSVP Tracking', icon: CheckCircle, badge: project.guests.filter((g) => g.rsvpStatus === 'attending').length },
    { id: 'details', label: 'Bride & Groom', icon: FileText },
    { id: 'events', label: 'Functions & Events', icon: Calendar, badge: project.weddingData.events.length },
    { id: 'family', label: 'Family & Blessings', icon: Users },
    { id: 'photos-music', label: 'Photos & Music', icon: ImageIcon },
    { id: 'theme', label: 'Themes & Wording', icon: Palette },
    { id: 'publish', label: 'Publish & Share', icon: Send }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2318] flex flex-col font-sans">
      {/* Top Header */}
      <DashboardHeader
        project={project}
        currentUser={currentUser}
        onSelectProject={onSelectProject}
        availableProjects={availableProjects}
        onPreviewAsGuest={onPreviewAsGuest}
        onPreviewPublic={onPreviewPublic}
        onOpenAdmin={onOpenAdmin}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 space-y-6 w-full">
        {/* Quick KPI Stats */}
        <QuickStatsGrid project={project} />

        {/* 7-Step Setup Wizard */}
        <SetupWizard
          project={project}
          activeTab={activeTab}
          onSelectTab={(tabId) => setActiveTab(tabId)}
          onPreview={onPreviewPublic}
        />

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#EAE1D2] pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition font-cinzel ${
                  isActive
                    ? 'bg-[#2A2016] text-[#DFBA54] shadow-sm'
                    : 'bg-white/80 text-[#5C4D3E] hover:bg-white hover:text-[#2A2016] border border-[#EAE1D2]'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#DFBA54]' : 'text-[#8C7653]'}`} />
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono font-bold ${
                      isActive ? 'bg-[#DFBA54] text-[#2A2016]' : 'bg-[#FAF5EB] text-[#8C6D28]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="min-h-[450px]">
          {activeTab === 'guests' && (
            <GuestManagementTab
              project={project}
              onPreviewAsGuest={onPreviewAsGuest}
              onRefreshProject={onRefreshProject}
            />
          )}

          {activeTab === 'rsvp' && <RsvpDashboardTab project={project} />}

          {activeTab === 'details' && (
            <WeddingDetailsTab project={project} onSave={handleSaveWeddingDetails} />
          )}

          {activeTab === 'events' && (
            <EventsManagementTab project={project} onSaveEvents={handleSaveEvents} />
          )}

          {activeTab === 'family' && (
            <FamilyManagementTab project={project} onSaveFamily={handleSaveFamily} />
          )}

          {activeTab === 'photos-music' && (
            <PhotosAndMusicTab project={project} onSaveMedia={handleSaveMedia} />
          )}

          {activeTab === 'theme' && (
            <DesignCustomizationTab project={project} onSaveTheme={handleSaveTheme} />
          )}

          {activeTab === 'publish' && (
            <PublishChecklistTab
              project={project}
              onUpdateStatus={handleUpdateStatus}
              onPreview={onPreviewPublic}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EAE1D2] bg-white py-4 text-center text-xs text-[#8C7A68]">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Powered by <strong>Nuptia Wedding Platform</strong> — Luxury Animated Personalized Digital Wedding Invitations
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPreviewPublic}
              className="text-[#8C6D28] hover:underline"
            >
              Live Wedding Preview
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-[#8C6D28] hover:underline"
            >
              Platform Owner
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
