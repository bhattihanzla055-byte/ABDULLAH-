import React, { useState } from 'react';
import { WeddingProject } from '../../types/platform';
import { GalleryItem } from '../../types/wedding';
import { Image as ImageIcon, Music, Plus, Trash2, Check, Sparkles } from 'lucide-react';

interface PhotosAndMusicTabProps {
  project: WeddingProject;
  onSaveMedia: (gallery: GalleryItem[], musicConfig: { youtubeId: string; trackTitle: string }) => void;
}

export const PhotosAndMusicTab: React.FC<PhotosAndMusicTabProps> = ({ project, onSaveMedia }) => {
  const [gallery, setGallery] = useState<GalleryItem[]>([...(project.weddingData.gallery || [])]);
  const [youtubeId, setYoutubeId] = useState(project.weddingData.youtubeVideoId || '2xDzfK8P0vE');
  const [trackTitle, setTrackTitle] = useState(project.weddingData.musicTrackTitle || 'Traditional Shehnai & Sitar');
  const [savedFeedback, setSavedFeedback] = useState(false);

  // New photo input
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState<'nikkah' | 'mehndi' | 'barat' | 'reception' | 'couple'>('couple');

  const popularWeddingMusic = [
    { title: 'Din Shagna Da (Traditional Wedding)', id: '2xDzfK8P0vE' },
    { title: 'Kudmayi (Royal Wedding Version)', id: '1u3Vv639434' },
    { title: 'Tajdar-e-Haram / Sufi Serenade', id: 'a18py61PWbk' },
    { title: 'Classical Sitar & Santoor Raga', id: 'z1mR4E6WkH4' }
  ];

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    const newItem: GalleryItem = {
      id: `photo-${Date.now()}`,
      url: newPhotoUrl.trim(),
      title: newPhotoTitle.trim() || 'Precious Moments',
      caption: 'Celebrating eternal love and companionship',
      category: newPhotoCategory
    };

    const updated = [...gallery, newItem];
    setGallery(updated);
    setNewPhotoUrl('');
    setNewPhotoTitle('');
    onSaveMedia(updated, { youtubeId, trackTitle });
    triggerSaved();
  };

  const handleDeletePhoto = (id: string) => {
    const updated = gallery.filter((p) => p.id !== id);
    setGallery(updated);
    onSaveMedia(updated, { youtubeId, trackTitle });
    triggerSaved();
  };

  const handleSaveMusic = () => {
    onSaveMedia(gallery, { youtubeId, trackTitle });
    triggerSaved();
  };

  const triggerSaved = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#EAE1D2] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#2A2016] font-cinzel">
              Photos & Background Music
            </h3>
            {savedFeedback && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                <Check className="h-3 w-3" /> Saved!
              </span>
            )}
          </div>
          <p className="text-xs text-[#7A6B5C]">
            Manage wedding album memories and the ambient soundtrack played when guests unlock the envelope.
          </p>
        </div>
      </div>

      {/* Background Music Card */}
      <div className="rounded-2xl border border-[#EAE1D2] bg-white p-5 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7653] font-cinzel mb-4 flex items-center gap-2">
          <Music className="h-4 w-4 text-[#C59B27]" />
          Ambient Wedding Music Soundtrack
        </h4>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                Track Title / Description
              </label>
              <input
                type="text"
                value={trackTitle}
                onChange={(e) => setTrackTitle(e.target.value)}
                className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                placeholder="e.g. Traditional Shehnai & Santoor Melody"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                YouTube Video ID (11 Characters)
              </label>
              <input
                type="text"
                value={youtubeId}
                onChange={(e) => setYoutubeId(e.target.value)}
                className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm font-mono text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                placeholder="e.g. 2xDzfK8P0vE"
              />
              <p className="mt-1 text-[11px] text-[#8C7653]">
                Extracted from <code className="bg-[#FAF5EB] px-1 rounded">youtube.com/watch?v=<b>[ID]</b></code>
              </p>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <p className="text-xs font-semibold text-[#695847] mb-2">Or select a popular preset track:</p>
            <div className="flex flex-wrap gap-2">
              {popularWeddingMusic.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setYoutubeId(preset.id);
                    setTrackTitle(preset.title);
                  }}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs transition ${
                    youtubeId === preset.id
                      ? 'border-[#C59B27] bg-[#FAF5EB] text-[#8C6D28] font-semibold'
                      : 'border-[#EAE1D2] bg-[#FAF8F5] text-[#4A3D2F] hover:bg-white'
                  }`}
                >
                  🎵 {preset.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveMusic}
              className="rounded-xl bg-[#C59B27] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#B38A1F]"
            >
              Save Soundtrack
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Photos Card */}
      <div className="rounded-2xl border border-[#EAE1D2] bg-white p-5 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7653] font-cinzel mb-4 flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-[#C59B27]" />
          Wedding Moments Gallery ({gallery.length} Photos)
        </h4>

        {/* Add photo form */}
        <form onSubmit={handleAddPhoto} className="mb-6 rounded-xl border border-[#EAE1D2] bg-[#FAF8F5] p-4">
          <p className="text-xs font-bold text-[#2D2318] mb-3">Add Photo to Gallery</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                Image URL *
              </label>
              <input
                type="url"
                required
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-xs text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                Category
              </label>
              <select
                value={newPhotoCategory}
                onChange={(e) => setNewPhotoCategory(e.target.value as any)}
                className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-xs text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none bg-white"
              >
                <option value="couple">Couple</option>
                <option value="nikkah">Nikkah</option>
                <option value="mehndi">Mehndi</option>
                <option value="barat">Barat</option>
                <option value="reception">Reception</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <input
              type="text"
              value={newPhotoTitle}
              onChange={(e) => setNewPhotoTitle(e.target.value)}
              placeholder="Photo title / caption (e.g. Ring Exchange)"
              className="w-full max-w-sm rounded-xl border border-[#D9CBB5] px-3 py-1.5 text-xs text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-xl bg-[#C59B27] px-4 py-2 text-xs font-bold text-white hover:bg-[#B38A1F] ml-2 shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add to Gallery</span>
            </button>
          </div>
        </form>

        {/* Existing photos preview grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {gallery.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-xl border border-[#EAE1D2] overflow-hidden bg-stone-100 aspect-square shadow-2xs"
            >
              <img
                src={photo.url}
                alt={photo.title || 'Wedding Photo'}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-2 flex flex-col justify-between">
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="self-end rounded-full bg-red-600 p-1 text-white hover:bg-red-700 transition"
                  title="Delete photo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <p className="text-[11px] font-semibold text-white truncate font-serif">
                  {photo.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
