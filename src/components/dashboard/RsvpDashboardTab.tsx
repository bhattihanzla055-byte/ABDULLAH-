import React, { useState } from 'react';
import { WeddingProject, GuestRecord } from '../../types/platform';
import { CheckCircle2, XCircle, Clock, Download, MessageSquare, Heart, Users, Sparkles, Filter } from 'lucide-react';
import { platformStore } from '../../services/platformStore';

interface RsvpDashboardTabProps {
  project: WeddingProject;
}

export const RsvpDashboardTab: React.FC<RsvpDashboardTabProps> = ({ project }) => {
  const [filter, setFilter] = useState<'all' | 'attending' | 'not_attending' | 'with_message'>('all');

  const guests = project.guests || [];
  const attendingGuests = guests.filter((g) => g.rsvpStatus === 'attending');
  const declinedGuests = guests.filter((g) => g.rsvpStatus === 'not_attending');
  const pendingGuests = guests.filter((g) => g.rsvpStatus === 'pending');

  const totalHeadcountConfirmed = attendingGuests.reduce(
    (sum, g) => sum + (g.attendeeCount || g.allowedGuests || 1),
    0
  );

  const guestsWithMessages = guests.filter((g) => Boolean(g.rsvpMessage?.trim()));

  const filteredList = guests.filter((g) => {
    if (filter === 'attending') return g.rsvpStatus === 'attending';
    if (filter === 'not_attending') return g.rsvpStatus === 'not_attending';
    if (filter === 'with_message') return Boolean(g.rsvpMessage?.trim());
    return true;
  });

  const handleExportRsvpCsv = () => {
    const csv = platformStore.exportGuestsCsv(project.id);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${project.slug}-rsvp-responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#EAE1D2] pb-4">
        <div>
          <h3 className="text-base font-bold text-[#2A2016] font-cinzel">
            RSVP Responses & Guest Attendance
          </h3>
          <p className="text-xs text-[#7A6B5C]">
            Live tracking of responses, confirmed attendee counts, and congratulatory messages from loved ones.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportRsvpCsv}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9CBB5] bg-white px-3.5 py-2 text-xs font-semibold text-[#4A3D2F] hover:bg-[#FAF8F5] transition"
        >
          <Download className="h-3.5 w-3.5 text-[#7A6B5C]" />
          <span>Export RSVP Summary (CSV)</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider font-cinzel">
              Confirmed Attending
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-bold font-serif-luxury text-emerald-900">
            {attendingGuests.length} <span className="text-xs font-normal text-emerald-700">invites</span>
          </p>
          <p className="mt-1 text-xs font-semibold text-emerald-800">
            👥 {totalHeadcountConfirmed} Total Headcount
          </p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider font-cinzel">
              Declined (Regrets)
            </span>
            <XCircle className="h-4 w-4 text-rose-600" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-bold font-serif-luxury text-rose-900">
            {declinedGuests.length}
          </p>
          <p className="mt-1 text-xs text-rose-700">
            Unable to attend
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider font-cinzel">
              Awaiting Reply
            </span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-bold font-serif-luxury text-amber-900">
            {pendingGuests.length}
          </p>
          <p className="mt-1 text-xs text-amber-700">
            Follow up recommended
          </p>
        </div>

        <div className="rounded-2xl border border-[#E6D7BD] bg-[#FAF5EB] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8C6D28] uppercase tracking-wider font-cinzel">
              Guest Wishes
            </span>
            <Heart className="h-4 w-4 text-[#C59B27] fill-[#C59B27]" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-bold font-serif-luxury text-[#3D2E1E]">
            {guestsWithMessages.length}
          </p>
          <p className="mt-1 text-xs text-[#8C7653]">
            Messages received
          </p>
        </div>
      </div>

      {/* Guest Wishes Board */}
      {guestsWithMessages.length > 0 && (
        <div className="rounded-2xl border border-[#EAE1D2] bg-gradient-to-br from-[#FFFDF9] to-[#FAF6EE] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
            <h4 className="text-sm font-bold text-[#2A2016] font-cinzel">
              Guest Blessings & Wishes Board ({guestsWithMessages.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {guestsWithMessages.map((guest) => (
              <div
                key={guest.id}
                className="rounded-xl border border-[#EAE1D2] bg-white p-3.5 shadow-xs transition hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#2A1F15] font-serif-luxury">
                    {guest.name}
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold border border-emerald-200">
                    {guest.attendeeCount || guest.allowedGuests} Attending
                  </span>
                </div>
                <p className="text-xs italic text-[#5C4D3E] font-serif leading-relaxed">
                  "{guest.rsvpMessage}"
                </p>
                {guest.rsvpSubmittedAt && (
                  <p className="mt-2 text-[10px] text-[#A89886] text-right">
                    {new Date(guest.rsvpSubmittedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs & Response List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-[#EAE1D2] pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-[#2A2016] text-[#DFBA54]'
                : 'text-[#695847] hover:bg-[#FAF8F5]'
            }`}
          >
            All Guests ({guests.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('attending')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filter === 'attending'
                ? 'bg-emerald-700 text-white'
                : 'text-[#695847] hover:bg-[#FAF8F5]'
            }`}
          >
            Attending ({attendingGuests.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('not_attending')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filter === 'not_attending'
                ? 'bg-rose-700 text-white'
                : 'text-[#695847] hover:bg-[#FAF8F5]'
            }`}
          >
            Declined ({declinedGuests.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('with_message')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filter === 'with_message'
                ? 'bg-[#C59B27] text-white'
                : 'text-[#695847] hover:bg-[#FAF8F5]'
            }`}
          >
            With Note ({guestsWithMessages.length})
          </button>
        </div>

        {/* Detailed responses table */}
        <div className="overflow-hidden rounded-2xl border border-[#EAE1D2] bg-white shadow-xs">
          <table className="w-full text-left text-xs text-[#3D2E1E]">
            <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#8C7653] font-cinzel border-b border-[#EAE1D2]">
              <tr>
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Reserved / Confirmed</th>
                <th className="py-3 px-3">Dietary / Notes</th>
                <th className="py-3 px-4">Message from Guest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-[#8C7A68] italic">
                    No records found for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredList.map((g) => (
                  <tr key={g.id} className="hover:bg-[#FAF8F5]">
                    <td className="py-3 px-4 font-bold text-[#2A1F15]">{g.name}</td>
                    <td className="py-3 px-3">
                      {g.rsvpStatus === 'attending' && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" /> Attending
                        </span>
                      )}
                      {g.rsvpStatus === 'not_attending' && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
                          <XCircle className="h-3 w-3" /> Declined
                        </span>
                      )}
                      {g.rsvpStatus === 'pending' && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                          <Clock className="h-3 w-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#8C6D28]">
                        {g.attendeeCount ? `${g.attendeeCount} confirmed` : '—'}
                      </span>{' '}
                      <span className="text-[#8C7A68]">/ {g.allowedGuests} allowed</span>
                    </td>
                    <td className="py-3 px-3 text-[#5C4D3E]">
                      {g.dietaryRequirements || '—'}
                    </td>
                    <td className="py-3 px-4 text-[#5C4D3E] italic">
                      {g.rsvpMessage || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
