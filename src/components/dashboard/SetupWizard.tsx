import React from 'react';
import { WeddingProject } from '../../types/platform';
import { Heart, Check, ArrowRight, Sparkles } from 'lucide-react';

interface SetupWizardProps {
  project: WeddingProject;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onPreview: () => void;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({
  project,
  activeTab,
  onSelectTab,
  onPreview
}) => {
  const isBrideGroomDone = Boolean(project.weddingData.brideName && project.weddingData.groomName);
  const isEventsDone = (project.weddingData.events?.length || 0) > 0;
  const isFamilyDone = (project.familyMembers?.length || 0) > 0 || Boolean(project.weddingData.brideParents);
  const isPhotosMusicDone = Boolean(project.weddingData.couplePhoto);
  const isGuestsDone = (project.guests?.length || 0) > 0;
  const isPreviewDone = true;
  const isPublishDone = project.status === 'active';

  const steps = [
    { id: 'details', step: 1, title: 'Bride & Groom', done: isBrideGroomDone },
    { id: 'events', step: 2, title: 'Wedding Events', done: isEventsDone },
    { id: 'family', step: 3, title: 'Family Details', done: isFamilyDone },
    { id: 'photos-music', step: 4, title: 'Photos & Music', done: isPhotosMusicDone },
    { id: 'guests', step: 5, title: 'Guest List', done: isGuestsDone },
    { id: 'preview-step', step: 6, title: 'Preview', done: isPreviewDone },
    { id: 'publish', step: 7, title: 'Publish Invitation', done: isPublishDone }
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="rounded-2xl border border-[#E6D7BD] bg-gradient-to-r from-[#FCF9F2] via-white to-[#F9F4E8] p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-[#C59B27] fill-[#C59B27]/20" />
            <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#2E2216]">
              Let's Create Your Wedding Invitation
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-[#7A6B5C]">
            Follow these 7 simple steps to personalize and send royal digital wedding cards to all your guests.
          </p>
        </div>

        {/* Completion Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold text-[#4A3D2F]">
              {completedCount} of 7 Completed
            </p>
            <p className="text-[11px] text-[#8C7653] font-mono">{progressPercent}% Ready</p>
          </div>
          <div className="h-3 w-28 overflow-hidden rounded-full bg-[#EADCC7]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#C59B27] to-[#DFBA54] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps Indicator Bar */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {steps.map((s) => {
          const isActive = activeTab === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                if (s.id === 'preview-step') {
                  onPreview();
                } else {
                  onSelectTab(s.id);
                }
              }}
              className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all ${
                isActive
                  ? 'border-[#C59B27] bg-[#FFFBF0] shadow-xs ring-1 ring-[#C59B27]'
                  : s.done
                  ? 'border-emerald-200 bg-white hover:border-[#C59B27]/60'
                  : 'border-[#EAE1D2] bg-white/70 hover:bg-white'
              }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  s.done
                    ? 'bg-emerald-600 text-white'
                    : isActive
                    ? 'bg-[#C59B27] text-white'
                    : 'bg-[#EAE1D2] text-[#695847]'
                }`}
              >
                {s.done ? <Check className="h-3.5 w-3.5" /> : s.step}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-[#8C7A68] uppercase font-cinzel">
                  Step {s.step}
                </p>
                <p className="text-xs font-semibold text-[#2D2318] truncate">{s.title}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
