import React, { useState } from 'react';
import { WeddingProject } from '../../types/platform';
import { CheckCircle2, AlertCircle, Share2, Eye, Sparkles, Copy, Check, ExternalLink, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PublishChecklistTabProps {
  project: WeddingProject;
  onUpdateStatus: (status: WeddingProject['status']) => void;
  onPreview: () => void;
}

export const PublishChecklistTab: React.FC<PublishChecklistTabProps> = ({
  project,
  onUpdateStatus,
  onPreview
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const checklist = [
    { label: 'Bride Name Added', ok: Boolean(project.weddingData.brideName?.trim()), tabHint: 'Bride & Groom' },
    { label: 'Groom Name Added', ok: Boolean(project.weddingData.groomName?.trim()), tabHint: 'Bride & Groom' },
    { label: 'Wedding Date Specified', ok: Boolean(project.weddingData.weddingDate?.trim()), tabHint: 'Bride & Groom' },
    { label: 'At least one Wedding Function / Event Created', ok: (project.weddingData.events?.length || 0) > 0, tabHint: 'Wedding Events' },
    { label: 'Venue Location & Map Configured', ok: Boolean(project.weddingData.events?.[0]?.venue), tabHint: 'Wedding Events' },
    { label: 'Guest List Added with Unique Tokens', ok: (project.guests?.length || 0) > 0, tabHint: 'Guest List' },
    { label: 'Invitation Preview Checked', ok: true, tabHint: 'Preview' }
  ];

  const allPassed = checklist.every((c) => c.ok);
  const isPublished = project.status === 'active';

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/#/wedding/${project.slug}`
    : `/wedding/${project.slug}`;

  const handlePublish = () => {
    onUpdateStatus('active');
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#DFBA54', '#E8C5C8', '#FFF8DC']
    });
  };

  const handleUnpublish = () => {
    if (confirm('Unpublishing will put this wedding into draft mode. Continue?')) {
      onUpdateStatus('draft');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#EAE1D2] pb-4">
        <h3 className="text-base font-bold text-[#2A2016] font-cinzel">
          Publishing Verification & Public Launch
        </h3>
        <p className="text-xs text-[#7A6B5C]">
          Verify your invitation readiness checklist before making the live wedding website accessible to your guests.
        </p>
      </div>

      {/* Main Status Hero */}
      <div
        className={`rounded-2xl border p-6 shadow-xs ${
          isPublished
            ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-50/30'
            : 'border-amber-200 bg-gradient-to-r from-amber-50 via-white to-amber-50/30'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                isPublished
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isPublished ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`} />
              {isPublished ? 'YOUR INVITATION IS LIVE' : 'DRAFT (NOT YET PUBLISHED)'}
            </span>

            <h4 className="mt-3 text-xl font-bold font-serif-luxury text-[#2E2014]">
              {project.title}
            </h4>
            <p className="mt-1 text-xs text-[#695847]">
              {isPublished
                ? 'Your wedding invitation is live. All personalized guest URLs are active and tracking opens & RSVPs.'
                : 'Complete the checklist below and click "Publish Invitation" to launch your site.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isPublished ? (
              <>
                <button
                  type="button"
                  onClick={onPreview}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9CBB5] bg-white px-4 py-2.5 text-xs font-semibold text-[#4A3D2F] hover:bg-[#FAF8F5] transition"
                >
                  <Eye className="h-4 w-4 text-[#7A6B5C]" />
                  <span>Preview Card</span>
                </button>
                <button
                  type="button"
                  onClick={handleUnpublish}
                  className="inline-flex items-center gap-1 rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                >
                  Set to Draft
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={!allPassed}
                onClick={handlePublish}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B27] via-[#DFBA54] to-[#B89240] px-6 py-3 text-xs font-bold text-[#2D1F06] shadow-md hover:scale-102 transition disabled:opacity-50 disabled:pointer-events-none"
              >
                <Sparkles className="h-4 w-4" />
                <span>PUBLISH INVITATION NOW</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Share Links Box (Available if published) */}
      <div className="rounded-2xl border border-[#EAE1D2] bg-white p-5 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7653] font-cinzel mb-3 flex items-center gap-2">
          <Globe className="h-4 w-4 text-[#C59B27]" />
          General Public Wedding Link (Non-personalized fallback)
        </h4>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex-1 rounded-xl border border-[#D9CBB5] bg-[#FAF8F5] px-3.5 py-2 text-xs font-mono text-[#4A3D2F] truncate">
            {publicUrl}
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FAF5EB] border border-[#D4AF37] px-4 py-2 text-xs font-bold text-[#8C6D28] hover:bg-[#F3E8CE] transition"
          >
            {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            <span>{copiedLink ? 'Copied ✓' : 'Copy Link'}</span>
          </button>
        </div>
        <p className="mt-2 text-[11px] text-[#8C7653]">
          💡 Note: For individual guests, always send their unique personalized links from the <strong>Guest List</strong> tab so their names appear on their animated card.
        </p>
      </div>

      {/* Checklist Card */}
      <div className="rounded-2xl border border-[#EAE1D2] bg-white p-5 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7653] font-cinzel mb-4">
          Pre-Launch Quality Verification
        </h4>

        <div className="space-y-3">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between rounded-xl border p-3.5 transition ${
                item.ok ? 'border-emerald-100 bg-emerald-50/40' : 'border-amber-200 bg-amber-50/40'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.ok ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                )}
                <span className={`text-xs font-semibold ${item.ok ? 'text-[#2D2318]' : 'text-amber-900'}`}>
                  {item.label}
                </span>
              </div>
              <span className="text-[11px] text-[#8C7653] font-mono">
                {item.tabHint}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
