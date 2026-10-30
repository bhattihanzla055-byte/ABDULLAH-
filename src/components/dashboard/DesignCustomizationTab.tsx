import React, { useState } from 'react';
import { WeddingProject, ThemeConfig } from '../../types/platform';
import { themePresets } from '../../data/themes';
import { Palette, Check, Sparkles, MessageSquare } from 'lucide-react';

interface DesignCustomizationTabProps {
  project: WeddingProject;
  onSaveTheme: (theme: ThemeConfig, wording?: WeddingProject['customWording']) => void;
}

export const DesignCustomizationTab: React.FC<DesignCustomizationTabProps> = ({
  project,
  onSaveTheme
}) => {
  const [selectedThemeId, setSelectedThemeId] = useState<string>(project.theme.id);
  const [customWording, setCustomWording] = useState(
    project.customWording || {
      greeting: 'Dear {guest_name},',
      mainInvitation: 'With great pleasure and gratitude, we invite you to celebrate our wedding.',
      closing: 'Your gracious presence and prayers will make our celebration complete.'
    }
  );
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSelectTheme = (preset: ThemeConfig) => {
    setSelectedThemeId(preset.id);
    onSaveTheme(preset, customWording);
    triggerSaved();
  };

  const handleSaveWording = (e: React.FormEvent) => {
    e.preventDefault();
    const currentTheme = themePresets.find((t) => t.id === selectedThemeId) || project.theme;
    onSaveTheme(currentTheme, customWording);
    triggerSaved();
  };

  const triggerSaved = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#EAE1D2] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#2A2016] font-cinzel">
              Design, Theme & Invitation Wording
            </h3>
            {savedFeedback && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                <Check className="h-3 w-3" /> Saved!
              </span>
            )}
          </div>
          <p className="text-xs text-[#7A6B5C]">
            Select from luxury handcrafted royal wedding color themes and customize default invitation greetings.
          </p>
        </div>
      </div>

      {/* Preset Themes Grid */}
      <div className="rounded-2xl border border-[#EAE1D2] bg-white p-5 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7653] font-cinzel mb-4 flex items-center gap-2">
          <Palette className="h-4 w-4 text-[#C59B27]" />
          Choose Wedding Invitation Theme Preset
        </h4>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {themePresets.map((preset) => {
            const isSelected = selectedThemeId === preset.id;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectTheme(preset)}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-[#C59B27] bg-[#FFFBF0] shadow-md ring-2 ring-[#C59B27]'
                    : 'border-[#EAE1D2] bg-[#FAF8F5] hover:border-[#C59B27]/50 hover:bg-white'
                }`}
              >
                {/* Theme color swatch preview */}
                <div className="w-full h-14 rounded-xl overflow-hidden mb-3 border border-[#EAE1D2] flex">
                  <div className="flex-1 h-full" style={{ backgroundColor: preset.bgTone }} />
                  <div className="flex-1 h-full" style={{ backgroundColor: preset.envelopeBg }} />
                  <div className="flex-1 h-full" style={{ backgroundColor: preset.primaryColor }} />
                  <div className="flex-1 h-full" style={{ backgroundColor: preset.accentColor }} />
                </div>

                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-[#2D2318] font-cinzel">
                    {preset.name}
                  </span>
                  {isSelected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C59B27] text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-[#7A6B5C] line-clamp-2">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Invitation Wording Customization */}
      <div className="rounded-2xl border border-[#EAE1D2] bg-white p-5 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7653] font-cinzel mb-4 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#C59B27]" />
          Personalized Envelope Invitation Wording
        </h4>

        <form onSubmit={handleSaveWording} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
              Guest Greeting (Use <code className="bg-[#FAF5EB] px-1 py-0.5 rounded text-[#8C6D28] font-bold">"{'{'}guest_name{'}'}"</code> to insert guest name)
            </label>
            <input
              type="text"
              value={customWording.greeting}
              onChange={(e) => setCustomWording({ ...customWording, greeting: e.target.value })}
              className="w-full rounded-xl border border-[#D9CBB5] px-3.5 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
              placeholder="Dear {guest_name},"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
              Main Invitation Message
            </label>
            <textarea
              rows={2}
              value={customWording.mainInvitation}
              onChange={(e) => setCustomWording({ ...customWording, mainInvitation: e.target.value })}
              className="w-full rounded-xl border border-[#D9CBB5] px-3.5 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
              placeholder="With great pleasure and gratitude, we invite you to celebrate our wedding."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
              Closing Blessing Statement
            </label>
            <input
              type="text"
              value={customWording.closing}
              onChange={(e) => setCustomWording({ ...customWording, closing: e.target.value })}
              className="w-full rounded-xl border border-[#D9CBB5] px-3.5 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
              placeholder="Your gracious presence and prayers will make our celebration complete."
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-xl bg-[#C59B27] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#B38A1F] transition"
            >
              Save Custom Wording
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
