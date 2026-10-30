import React, { useState } from 'react';
import { WeddingProject, User, GuestRecord } from '../../types/platform';
import { Sparkles, Eye, Share2, LogOut, Check, ChevronDown, UserCheck, Shield, ExternalLink } from 'lucide-react';

interface DashboardHeaderProps {
  project: WeddingProject;
  currentUser: User;
  onSelectProject: (projectId: string) => void;
  availableProjects: WeddingProject[];
  onPreviewAsGuest: (guest: GuestRecord) => void;
  onPreviewPublic: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  project,
  currentUser,
  onSelectProject,
  availableProjects,
  onPreviewAsGuest,
  onPreviewPublic,
  onOpenAdmin,
  onLogout
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/#/wedding/${project.slug}`
    : `/wedding/${project.slug}`;

  const handleCopyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getStatusBadge = (status: WeddingProject['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Your Invitation Is Live
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Draft (Not Published)
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600 border border-stone-300">
            Expired
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
            Suspended
          </span>
        );
    }
  };

  return (
    <header className="border-b border-[#E8DFC8] bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: User & Project branding */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#C59B27] to-[#DFBA54] text-white shadow-sm font-cinzel font-bold text-sm">
              {project.weddingData.monogram || '💍'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-[#2A2016] font-cinzel tracking-wide">
                  {project.title}
                </h1>
                {getStatusBadge(project.status)}
              </div>
              <p className="text-xs text-[#7A6B5C]">
                Welcome, <span className="font-semibold text-[#3D3024]">{currentUser.name}</span>
                {currentUser.role === 'admin' && (
                  <span className="ml-1.5 rounded bg-[#C59B27]/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#8C6D28]">
                    Platform Owner
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Project Switcher if multiple projects */}
            {availableProjects.length > 1 && (
              <div className="relative">
                <select
                  value={project.id}
                  onChange={(e) => onSelectProject(e.target.value)}
                  className="rounded-lg border border-[#D9CBB5] bg-[#FAF8F5] px-2.5 py-1.5 text-xs font-medium text-[#4A3D2F] hover:border-[#C59B27] focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  title="Switch Wedding Project"
                >
                  {availableProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.weddingData.brideName} & {p.weddingData.groomName} ({p.status})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Preview as Guest Dropdown */}
            {project.guests.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#C59B27]/60 bg-gradient-to-r from-[#FAF6EE] to-[#FFFDF9] px-3 py-1.5 text-xs font-semibold text-[#7E6118] hover:border-[#C59B27] hover:shadow-xs transition"
                >
                  <UserCheck className="h-3.5 w-3.5 text-[#A88234]" />
                  <span>Preview as Guest</span>
                  <ChevronDown className="h-3 w-3 text-[#A88234]" />
                </button>

                {guestDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-64 rounded-xl border border-[#D9CBB5] bg-white p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95">
                    <p className="px-2.5 py-1 text-[11px] font-semibold text-[#8C7A68] uppercase tracking-wider">
                      Select Guest to Test:
                    </p>
                    <div className="max-h-56 overflow-y-auto space-y-0.5">
                      {project.guests.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            setGuestDropdownOpen(false);
                            onPreviewAsGuest(g);
                          }}
                          className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs hover:bg-[#FAF6EE] transition flex items-center justify-between"
                        >
                          <span className="font-medium text-[#382C21] truncate">{g.name}</span>
                          <span className="text-[10px] text-[#A88234] bg-[#F5EEDC] px-1.5 py-0.5 rounded">
                            {g.allowedGuests} seats
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Preview Public Wedding */}
            <button
              type="button"
              onClick={onPreviewPublic}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9CBB5] bg-white px-3 py-1.5 text-xs font-medium text-[#4A3D2F] hover:bg-[#FAF8F5] transition"
            >
              <Eye className="h-3.5 w-3.5 text-[#7A6B5C]" />
              <span className="hidden sm:inline">Preview Invitation</span>
            </button>

            {/* Copy Public Link */}
            <button
              type="button"
              onClick={handleCopyPublicLink}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9CBB5] bg-white px-3 py-1.5 text-xs font-medium text-[#4A3D2F] hover:bg-[#FAF8F5] transition"
              title="Copy General Public Wedding URL"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Link Copied ✓</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-[#7A6B5C]" />
                  <span className="hidden sm:inline">Copy Link</span>
                </>
              )}
            </button>

            {/* Platform Admin Button (if admin) */}
            {currentUser.role === 'admin' && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2A2016] px-3 py-1.5 text-xs font-semibold text-[#DFBA54] hover:bg-[#3D3024] transition shadow-xs"
              >
                <Shield className="h-3.5 w-3.5 text-[#DFBA54]" />
                <span className="hidden md:inline">Admin Portal</span>
              </button>
            )}

            {/* Logout / Switch User */}
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1 rounded-lg p-1.5 text-[#7A6B5C] hover:bg-[#F3ECE0] hover:text-[#2A2016] transition"
              title="Logout / Switch Account"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
