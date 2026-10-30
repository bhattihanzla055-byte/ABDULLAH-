import React from 'react';
import { WeddingProject } from '../../types/platform';
import { Users, Send, Eye, CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react';

interface QuickStatsGridProps {
  project: WeddingProject;
}

export const QuickStatsGrid: React.FC<QuickStatsGridProps> = ({ project }) => {
  const guests = project.guests || [];
  const totalGuests = guests.length;

  const totalSeatsAllowed = guests.reduce((acc, g) => acc + (g.allowedGuests || 1), 0);

  const sentCount = guests.filter((g) => g.invitationStatus === 'sent' || g.openCount > 0).length;
  const openedCount = guests.filter((g) => g.openCount > 0).length;

  const attendingGuests = guests.filter((g) => g.rsvpStatus === 'attending');
  const attendingCount = attendingGuests.length;
  const confirmedAttendeesHeadcount = attendingGuests.reduce((acc, g) => acc + (g.attendeeCount || g.allowedGuests || 1), 0);

  const notAttendingCount = guests.filter((g) => g.rsvpStatus === 'not_attending').length;
  const pendingCount = guests.filter((g) => g.rsvpStatus === 'pending').length;

  const openRate = sentCount > 0 ? Math.round((openedCount / sentCount) * 100) : 0;
  const responseRate = totalGuests > 0 ? Math.round(((attendingCount + notAttendingCount) / totalGuests) * 100) : 0;

  const stats = [
    {
      id: 'stat-total-guests',
      label: 'TOTAL GUESTS',
      sublabel: `${totalSeatsAllowed} total seats reserved`,
      value: totalGuests,
      icon: Users,
      color: 'text-[#3D2E1E]',
      bgColor: 'bg-[#FAF5EB]',
      borderColor: 'border-[#E6D7BD]'
    },
    {
      id: 'stat-invitations-sent',
      label: 'INVITATIONS SENT',
      sublabel: `${totalGuests - sentCount} uncontacted`,
      value: sentCount,
      icon: Send,
      color: 'text-[#8C6D28]',
      bgColor: 'bg-[#FDFBF7]',
      borderColor: 'border-[#DFBA54]/40'
    },
    {
      id: 'stat-opened',
      label: 'INVITATIONS OPENED',
      sublabel: `${openRate}% open rate`,
      value: openedCount,
      icon: Eye,
      color: 'text-indigo-700',
      bgColor: 'bg-indigo-50/50',
      borderColor: 'border-indigo-200'
    },
    {
      id: 'stat-attending',
      label: 'ATTENDING (YES)',
      sublabel: `${confirmedAttendeesHeadcount} confirmed guests`,
      value: attendingCount,
      icon: CheckCircle2,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50/50',
      borderColor: 'border-emerald-200'
    },
    {
      id: 'stat-not-attending',
      label: 'NOT ATTENDING (NO)',
      sublabel: 'Declined with regrets',
      value: notAttendingCount,
      icon: XCircle,
      color: 'text-rose-700',
      bgColor: 'bg-rose-50/50',
      borderColor: 'border-rose-200'
    },
    {
      id: 'stat-pending',
      label: 'PENDING RESPONSES',
      sublabel: `${responseRate}% replied so far`,
      value: pendingCount,
      icon: Clock,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50/50',
      borderColor: 'border-amber-200'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            id={item.id}
            className={`rounded-2xl border p-4 shadow-xs transition hover:shadow-md ${item.bgColor} ${item.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-[#7A6B5C] uppercase font-cinzel">
                {item.label}
              </span>
              <Icon className={`h-4 w-4 ${item.color}`} />
            </div>
            <p className={`mt-2 text-2xl sm:text-3xl font-bold font-serif-luxury ${item.color}`}>
              {item.value}
            </p>
            <p className="mt-1 text-[11px] text-[#7A6B5C] truncate">
              {item.sublabel}
            </p>
          </div>
        );
      })}
    </div>
  );
};
