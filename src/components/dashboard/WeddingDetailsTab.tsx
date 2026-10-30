import React, { useState } from 'react';
import { WeddingProject } from '../../types/platform';
import { WeddingData } from '../../types/wedding';
import { Save, Check, User, Heart, Sparkles, Image as ImageIcon } from 'lucide-react';

interface WeddingDetailsTabProps {
  project: WeddingProject;
  onSave: (updatedData: Partial<WeddingData>, title?: string) => void;
}

export const WeddingDetailsTab: React.FC<WeddingDetailsTabProps> = ({ project, onSave }) => {
  const [formData, setFormData] = useState<WeddingData>({ ...project.weddingData });
  const [projectTitle, setProjectTitle] = useState(project.title);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof WeddingData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStoryParagraphChange = (index: number, val: string) => {
    const updated = [...(formData.storyParagraphs || [])];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, storyParagraphs: updated }));
  };

  const handleAddStoryParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      storyParagraphs: [...(prev.storyParagraphs || []), '']
    }));
  };

  const handleRemoveStoryParagraph = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      storyParagraphs: (prev.storyParagraphs || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, projectTitle);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Save bar */}
      <div className="flex items-center justify-between border-b border-[#EAE1D2] pb-4">
        <div>
          <h3 className="text-base font-bold text-[#2A2016] font-cinzel">Wedding Details</h3>
          <p className="text-xs text-[#7A6B5C]">
            Update bride, groom, couple photos, story, and dates. Changes reflect instantly on all guest cards.
          </p>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B27] via-[#DFBA54] to-[#B89240] px-5 py-2.5 text-xs font-bold text-[#2D1F06] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
        >
          {isSaved ? (
            <>
              <Check className="h-4 w-4 text-emerald-800" />
              <span>Saved Successfully! ✓</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Project Title & Monogram */}
      <div className="rounded-2xl border border-[#EAE1D2] bg-white p-5 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7653] font-cinzel mb-4">
          General Celebration Title & Monogram
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
              Celebration Title
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full rounded-xl border border-[#D9CBB5] px-3.5 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
              placeholder="e.g. Ayesha & Hamza Wedding Celebration"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
              Monogram Seal (Initials)
            </label>
            <input
              type="text"
              value={formData.monogram}
              onChange={(e) => handleChange('monogram', e.target.value)}
              className="w-full rounded-xl border border-[#D9CBB5] px-3.5 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none font-cinzel font-bold text-center"
              placeholder="e.g. A & H"
            />
          </div>
        </div>
      </div>

      {/* Bride & Groom side by side */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Bride Card */}
        <div className="rounded-2xl border border-[#EAE1D2] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#F0E8DC]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF5EB] text-[#C59B27]">
              👰
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#2D2318] font-cinzel">Bride Information</h4>
              <p className="text-[11px] text-[#7A6B5C]">Details for the bride and her family</p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                Bride First Name *
              </label>
              <input
                type="text"
                value={formData.brideName}
                onChange={(e) => handleChange('brideName', e.target.value)}
                required
                className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                placeholder="e.g. Ayesha"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                Bride Full Name
              </label>
              <input
                type="text"
                value={formData.brideFullName}
                onChange={(e) => handleChange('brideFullName', e.target.value)}
                className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                placeholder="e.g. Ayesha Kamran Khan"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                Bride Parents & Family
              </label>
              <input
                type="text"
                value={formData.brideParents}
                onChange={(e) => handleChange('brideParents', e.target.value)}
                className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                placeholder="e.g. Daughter of Mr. & Mrs. Kamran Khan"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                Bride Bio / Quote (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.brideBio || ''}
                onChange={(e) => handleChange('brideBio', e.target.value)}
                className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                placeholder="A warm short bio or blessing from the bride..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                Bride Photo URL (Optional)
              </label>
              <input
                type="url"
                value={formData.bridePhoto || ''}
                onChange={(e) => handleChange('bridePhoto', e.target.value)}
                className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-xs text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Groom Card */}
        <div className="rounded-2xl border border-[#EAE1D2] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#F0E8DC]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF5EB] text-[#C59B27]">
              🤵
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#2D2318] font-cinzel">Groom Information</h4>
              <p className="text-[11px] text-[#7A6B5C]">Details for the groom and his family</p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                Groom First Name *
              </label>
              <input
                type="text"
                value={formData.groomName}
                onChange={(e) => handleChange('groomName', e.target.value)}
                required
                className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                placeholder="e.g. Hamza"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                Groom Full Name
              </label>
              <input
                type="text"
                value={formData.groomFullName}
                onChange={(e) => handleChange('groomFullName', e.target.value)}
                className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                placeholder="e.g. Hamza Tariq"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                Groom Parents & Family
              </label>
              <input
                type="text"
                value={formData.groomParents}
                onChange={(e) => handleChange('groomParents', e.target.value)}
                className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                placeholder="e.g. Son of Mr. & Mrs. Tariq Jamil"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                Groom Bio / Quote (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.groomBio || ''}
                onChange={(e) => handleChange('groomBio', e.target.value)}
                className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                placeholder="A warm short bio or note from the groom..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                Groom Photo URL (Optional)
              </label>
              <input
                type="url"
                value={formData.groomPhoto || ''}
                onChange={(e) => handleChange('groomPhoto', e.target.value)}
                className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-xs text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Couple Photo & Intro Wording */}
      <div className="rounded-2xl border border-[#EAE1D2] bg-white p-5 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7653] font-cinzel mb-4">
          Couple Portrait, Main Dates & Subtitles
        </h4>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
              Couple Portrait Photo URL
            </label>
            <input
              type="text"
              value={formData.couplePhoto}
              onChange={(e) => handleChange('couplePhoto', e.target.value)}
              className="w-full rounded-xl border border-[#D9CBB5] px-3.5 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
              placeholder="Image URL or default portrait asset"
            />
            <p className="mt-1 text-[11px] text-[#8C7653]">
              Shown prominently on the couple banner and luxury portrait frame.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
              Main Wedding Date
            </label>
            <input
              type="text"
              value={formData.weddingDate}
              onChange={(e) => handleChange('weddingDate', e.target.value)}
              className="w-full rounded-xl border border-[#D9CBB5] px-3.5 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
              placeholder="e.g. Saturday, 25 December 2026"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
              Save The Date Invitation Subtitle
            </label>
            <input
              type="text"
              value={formData.saveTheDateSubtitle}
              onChange={(e) => handleChange('saveTheDateSubtitle', e.target.value)}
              className="w-full rounded-xl border border-[#D9CBB5] px-3.5 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
              placeholder="Request the honor of your presence as two souls unite under the canopy of grace and love."
            />
          </div>
        </div>
      </div>

      {/* Our Story section */}
      <div className="rounded-2xl border border-[#EAE1D2] bg-white p-5 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7653] font-cinzel mb-4">
          Our Story Section
        </h4>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                Story Title
              </label>
              <input
                type="text"
                value={formData.storyTitle}
                onChange={(e) => handleChange('storyTitle', e.target.value)}
                className="w-full rounded-xl border border-[#D9CBB5] px-3.5 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                placeholder="OUR STORY"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                Story Quote / Tagline
              </label>
              <input
                type="text"
                value={formData.storyQuote}
                onChange={(e) => handleChange('storyQuote', e.target.value)}
                className="w-full rounded-xl border border-[#D9CBB5] px-3.5 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                placeholder="Two hearts, two families, and one beautiful destiny..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A3D2F] mb-2">
              Story Paragraphs
            </label>
            <div className="space-y-2">
              {formData.storyParagraphs?.map((para, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="mt-2 text-xs font-bold text-[#A88234]">{idx + 1}.</span>
                  <textarea
                    rows={2}
                    value={para}
                    onChange={(e) => handleStoryParagraphChange(idx, e.target.value)}
                    className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-xs sm:text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStoryParagraph(idx)}
                    className="mt-2 rounded-lg p-1 text-red-500 hover:bg-red-50 text-xs"
                    title="Remove paragraph"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddStoryParagraph}
              className="mt-2 text-xs font-semibold text-[#8C6D28] hover:underline"
            >
              + Add Another Paragraph
            </button>
          </div>
        </div>
      </div>

      {/* Floating Save button at bottom */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B27] via-[#DFBA54] to-[#B89240] px-6 py-3 text-xs font-bold text-[#2D1F06] shadow-md hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
        >
          {isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span>{isSaved ? 'Changes Saved!' : 'Save All Wedding Details'}</span>
        </button>
      </div>
    </form>
  );
};
