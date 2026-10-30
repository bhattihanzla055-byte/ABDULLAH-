import React, { useState } from 'react';
import { WeddingProject, FamilyMember } from '../../types/platform';
import { Users, Plus, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Check, Edit2 } from 'lucide-react';

interface FamilyManagementTabProps {
  project: WeddingProject;
  onSaveFamily: (members: FamilyMember[], traditionalBody?: string, hostFamilies?: string) => void;
}

export const FamilyManagementTab: React.FC<FamilyManagementTabProps> = ({ project, onSaveFamily }) => {
  const [members, setMembers] = useState<FamilyMember[]>([...(project.familyMembers || [])]);
  const [blessingsBody, setBlessingsBody] = useState(project.weddingData.familyBlessingsBody || '');
  const [hostFamilies, setHostFamilies] = useState(project.weddingData.hostFamilies || '');
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const brideSideMembers = members.filter((m) => m.side === 'bride');
  const groomSideMembers = members.filter((m) => m.side === 'groom');

  const commonRelationships = [
    'Parents of the Bride',
    'Parents of the Groom',
    'Brothers',
    'Sisters',
    'Grandparents & Elders',
    'Paternal Uncle & Aunt (Chacha / Taya Jan)',
    'Maternal Uncle & Aunt (Mamu / Khala Jan)',
    'Cousins & Family',
    'Special Family Blessings'
  ];

  const handleOpenAddModal = (side: 'bride' | 'groom') => {
    setEditingMember({
      id: `fm-${Date.now()}`,
      name: '',
      relationship: side === 'bride' ? 'Brothers of the Bride' : 'Brothers of the Groom',
      side,
      displayOrder: members.length + 1,
      visible: true
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name.trim()) return;

    const existingIdx = members.findIndex((m) => m.id === editingMember.id);
    let updated: FamilyMember[];
    if (existingIdx >= 0) {
      updated = [...members];
      updated[existingIdx] = editingMember;
    } else {
      updated = [...members, editingMember];
    }

    setMembers(updated);
    onSaveFamily(updated, blessingsBody, hostFamilies);
    setIsModalOpen(false);
    setEditingMember(null);
    triggerSaved();
  };

  const handleToggleVisible = (id: string) => {
    const updated = members.map((m) => (m.id === id ? { ...m, visible: !m.visible } : m));
    setMembers(updated);
    onSaveFamily(updated, blessingsBody, hostFamilies);
    triggerSaved();
  };

  const handleDelete = (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    onSaveFamily(updated, blessingsBody, hostFamilies);
    triggerSaved();
  };

  const triggerSaved = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleSaveBlessingsText = () => {
    onSaveFamily(members, blessingsBody, hostFamilies);
    triggerSaved();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#EAE1D2] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#2A2016] font-cinzel">Family & Relatives Management</h3>
            {savedFeedback && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                <Check className="h-3 w-3" /> Saved!
              </span>
            )}
          </div>
          <p className="text-xs text-[#7A6B5C]">
            Add parents, siblings, grandparents, and respected elders from both the bride's and groom's families.
          </p>
        </div>
      </div>

      {/* Traditional Blessing Message Card */}
      <div className="rounded-2xl border border-[#EAE1D2] bg-white p-5 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7653] font-cinzel mb-3">
          Elder Blessings & Host Statement
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
              Traditional Invitation Statement (Urdu/English Blessings)
            </label>
            <textarea
              rows={3}
              value={blessingsBody}
              onChange={(e) => setBlessingsBody(e.target.value)}
              className="w-full rounded-xl border border-[#D9CBB5] px-3.5 py-2 text-xs sm:text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
              placeholder="Under the gracious guidance and prayers of our elders, we warmly invite you..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
              Host Family Signature (Invited By)
            </label>
            <input
              type="text"
              value={hostFamilies}
              onChange={(e) => setHostFamilies(e.target.value)}
              className="w-full rounded-xl border border-[#D9CBB5] px-3.5 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
              placeholder="e.g. The Malik & Siddiqui Families"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveBlessingsText}
              className="rounded-xl bg-[#FAF5EB] border border-[#D4AF37] px-4 py-1.5 text-xs font-bold text-[#8C6D28] hover:bg-[#F3E8CE] transition"
            >
              Update Blessing Wording
            </button>
          </div>
        </div>
      </div>

      {/* Bride's & Groom's Family Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bride's Family */}
        <div className="rounded-2xl border border-[#EAE1D2] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0E8DC] mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌸</span>
              <h4 className="text-sm font-bold text-[#2D2318] font-cinzel">Bride's Family</h4>
            </div>
            <button
              type="button"
              onClick={() => handleOpenAddModal('bride')}
              className="inline-flex items-center gap-1 rounded-lg bg-[#FAF5EB] border border-[#D9CBB5] px-2.5 py-1 text-xs font-semibold text-[#8C6D28] hover:bg-[#F3E8CE]"
            >
              <Plus className="h-3 w-3" />
              <span>Add Member</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {brideSideMembers.length === 0 ? (
              <p className="text-xs text-[#8C7A68] italic text-center py-4">
                No individual bride family members added yet.
              </p>
            ) : (
              brideSideMembers.map((member) => (
                <div
                  key={member.id}
                  className={`flex items-center justify-between rounded-xl border p-3 transition ${
                    member.visible
                      ? 'border-[#EAE1D2] bg-[#FAF8F5]'
                      : 'border-dashed border-stone-300 bg-stone-50 opacity-60'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-[#2D2318]">{member.name}</p>
                    <p className="text-[11px] text-[#8C7653] italic font-serif-luxury">{member.relationship}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleVisible(member.id)}
                      className="rounded p-1 text-[#7A6B5C] hover:bg-white"
                      title={member.visible ? 'Hide from card' : 'Show on card'}
                    >
                      {member.visible ? <Eye className="h-3.5 w-3.5 text-emerald-600" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMember(member);
                        setIsModalOpen(true);
                      }}
                      className="rounded p-1 text-[#8C6D28] hover:bg-white"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(member.id)}
                      className="rounded p-1 text-rose-500 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Groom's Family */}
        <div className="rounded-2xl border border-[#EAE1D2] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0E8DC] mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">👑</span>
              <h4 className="text-sm font-bold text-[#2D2318] font-cinzel">Groom's Family</h4>
            </div>
            <button
              type="button"
              onClick={() => handleOpenAddModal('groom')}
              className="inline-flex items-center gap-1 rounded-lg bg-[#FAF5EB] border border-[#D9CBB5] px-2.5 py-1 text-xs font-semibold text-[#8C6D28] hover:bg-[#F3E8CE]"
            >
              <Plus className="h-3 w-3" />
              <span>Add Member</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {groomSideMembers.length === 0 ? (
              <p className="text-xs text-[#8C7A68] italic text-center py-4">
                No individual groom family members added yet.
              </p>
            ) : (
              groomSideMembers.map((member) => (
                <div
                  key={member.id}
                  className={`flex items-center justify-between rounded-xl border p-3 transition ${
                    member.visible
                      ? 'border-[#EAE1D2] bg-[#FAF8F5]'
                      : 'border-dashed border-stone-300 bg-stone-50 opacity-60'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-[#2D2318]">{member.name}</p>
                    <p className="text-[11px] text-[#8C7653] italic font-serif-luxury">{member.relationship}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleVisible(member.id)}
                      className="rounded p-1 text-[#7A6B5C] hover:bg-white"
                      title={member.visible ? 'Hide from card' : 'Show on card'}
                    >
                      {member.visible ? <Eye className="h-3.5 w-3.5 text-emerald-600" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMember(member);
                        setIsModalOpen(true);
                      }}
                      className="rounded p-1 text-[#8C6D28] hover:bg-white"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(member.id)}
                      className="rounded p-1 text-rose-500 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal for Add / Edit Family Member */}
      {isModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#D9CBB5] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h4 className="text-base font-bold text-[#2A2016] font-cinzel mb-4 pb-2 border-b border-[#EAE1D2]">
              {members.some((m) => m.id === editingMember.id) ? 'Edit Relative' : 'Add Family Member'}
            </h4>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                  Full Name / Group *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                  placeholder="e.g. Mr. & Mrs. Tariq Mahmood Malik"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                  Relationship Label
                </label>
                <input
                  type="text"
                  value={editingMember.relationship}
                  onChange={(e) => setEditingMember({ ...editingMember, relationship: e.target.value })}
                  className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                  placeholder="e.g. Parents of the Bride, Brothers, Uncles"
                />
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {commonRelationships.slice(0, 5).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setEditingMember({ ...editingMember, relationship: r })}
                      className="text-[10px] bg-[#FAF5EB] text-[#7A6B5C] px-1.5 py-0.5 rounded border border-[#EAE1D2] hover:bg-[#F3ECE0]"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                  Family Side
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingMember({ ...editingMember, side: 'bride' })}
                    className={`rounded-xl border p-2 text-xs font-semibold transition ${
                      editingMember.side === 'bride'
                        ? 'border-[#C59B27] bg-[#FAF5EB] text-[#8C6D28]'
                        : 'border-[#D9CBB5] bg-white text-[#5C4D3E]'
                    }`}
                  >
                    🌸 Bride's Side
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingMember({ ...editingMember, side: 'groom' })}
                    className={`rounded-xl border p-2 text-xs font-semibold transition ${
                      editingMember.side === 'groom'
                        ? 'border-[#C59B27] bg-[#FAF5EB] text-[#8C6D28]'
                        : 'border-[#D9CBB5] bg-white text-[#5C4D3E]'
                    }`}
                  >
                    👑 Groom's Side
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="fm-visible"
                  checked={editingMember.visible}
                  onChange={(e) => setEditingMember({ ...editingMember, visible: e.target.checked })}
                  className="rounded border-[#D9CBB5] text-[#C59B27] focus:ring-[#C59B27]"
                />
                <label htmlFor="fm-visible" className="text-xs font-medium text-[#4A3D2F]">
                  Visible on public wedding invitation
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE1D2]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[#D9CBB5] px-4 py-2 text-xs font-semibold text-[#5C4D3E] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#C59B27] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#B38A1F]"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
