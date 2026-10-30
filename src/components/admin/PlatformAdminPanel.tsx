import React, { useState } from 'react';
import { User, WeddingProject } from '../../types/platform';
import { platformStore } from '../../services/platformStore';
import { initialWeddingData } from '../../data/weddingData';
import {
  Shield,
  Users,
  Heart,
  DollarSign,
  TrendingUp,
  Plus,
  ArrowLeft,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Eye,
  Key
} from 'lucide-react';

interface PlatformAdminPanelProps {
  currentUser: User;
  onExitAdmin: () => void;
  onImpersonateCustomer: (user: User, project: WeddingProject) => void;
}

export const PlatformAdminPanel: React.FC<PlatformAdminPanelProps> = ({
  currentUser,
  onExitAdmin,
  onImpersonateCustomer
}) => {
  const [activeTab, setActiveTab] = useState<'weddings' | 'customers' | 'orders' | 'plans'>('weddings');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // New customer / project modal
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newBrideName, setNewBrideName] = useState('');
  const [newGroomName, setNewGroomName] = useState('');
  const [newPlan, setNewPlan] = useState<'starter' | 'royal' | 'luxury'>('royal');

  const stats = platformStore.getPlatformStats();
  const allProjects = platformStore.getAllProjects();
  const allUsers = platformStore.getAllUsers().filter((u) => u.role === 'customer');
  const allOrders = platformStore.getAllOrders();

  const filteredProjects = allProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.weddingData.brideName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.weddingData.groomName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientEmail || !newBrideName || !newGroomName) return;

    // Create user if not existing
    let user = platformStore.getUserByEmail(newClientEmail);
    if (!user) {
      user = platformStore.registerCustomer(
        newClientName,
        newClientEmail,
        'pass123',
        newPlan
      );
    }

    // Create project
    const project = platformStore.createProject({
      ownerId: user.id,
      ownerName: user.name,
      title: `${newBrideName} & ${newGroomName} Wedding Celebration`,
      slug: `${newBrideName.toLowerCase()}-${newGroomName.toLowerCase()}`,
      status: 'active',
      theme: 'classic-gold',
      greetingTemplate: 'Dear [Guest Name],',
      mainInvitationText:
        'With great pleasure, we invite you to celebrate our wedding. Your presence will make our celebration even more special.',
      closingText: 'We eagerly look forward to welcoming you with warmth and love.',
      weddingData: {
        ...initialWeddingData,
        brideName: newBrideName,
        brideFullName: `${newBrideName} Khan`,
        groomName: newGroomName,
        groomFullName: `${newGroomName} Siddiqui`,
        monogram: `${newBrideName.charAt(0)} & ${newGroomName.charAt(0)}`
      },
      familyMembers: [],
      guests: []
    });

    setIsNewProjectModalOpen(false);
    setNewClientName('');
    setNewClientEmail('');
    setNewBrideName('');
    setNewGroomName('');

    // Immediately switch to the new customer's project
    onImpersonateCustomer(user, project);
  };

  const handleToggleProjectStatus = (projectId: string, currentStatus: WeddingProject['status']) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    platformStore.updateProjectStatus(projectId, nextStatus);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#2C2117]">
      {/* Admin Navbar */}
      <header className="border-b border-[#E3D8C4] bg-[#241A12] text-[#F3ECE0] px-4 py-3.5 sticky top-0 z-30 shadow-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#C59B27] to-[#DFBA54] text-[#241A12] font-bold font-cinzel text-sm">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold font-cinzel text-[#DFBA54] tracking-wider">
                  NUPTIA OWNER ADMIN
                </h1>
                <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                  v2.0 Multi-Client Platform
                </span>
              </div>
              <p className="text-xs text-[#A89886]">
                Super-Admin Control Panel • Manage Clients, Weddings & Subscriptions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsNewProjectModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C59B27] to-[#DFBA54] px-3.5 py-1.5 text-xs font-bold text-[#241A12] shadow-xs hover:brightness-105 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Wedding Project</span>
            </button>

            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#7A6B5C] bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-[#DFBA54] hover:bg-white/10 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to App</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Platform Overview Metric Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-2xl border border-[#E3D8C4] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A68] uppercase font-cinzel">
                Total Revenue
              </span>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold font-serif-luxury text-emerald-800">
              ${stats.totalRevenue.toLocaleString()}
            </p>
            <p className="mt-0.5 text-[11px] text-[#7A6B5C]">Paid client orders</p>
          </div>

          <div className="rounded-2xl border border-[#E3D8C4] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A68] uppercase font-cinzel">
                Weddings
              </span>
              <Heart className="h-4 w-4 text-rose-500" />
            </div>
            <p className="mt-2 text-2xl font-bold font-serif-luxury text-[#2C2117]">
              {stats.totalProjects}
            </p>
            <p className="mt-0.5 text-[11px] text-[#7A6B5C]">
              {stats.activeProjects} published & active
            </p>
          </div>

          <div className="rounded-2xl border border-[#E3D8C4] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A68] uppercase font-cinzel">
                Clients
              </span>
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="mt-2 text-2xl font-bold font-serif-luxury text-[#2C2117]">
              {stats.totalCustomers}
            </p>
            <p className="mt-0.5 text-[11px] text-[#7A6B5C]">Registered couples</p>
          </div>

          <div className="rounded-2xl border border-[#E3D8C4] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A68] uppercase font-cinzel">
                Total Guests
              </span>
              <Sparkles className="h-4 w-4 text-[#C59B27]" />
            </div>
            <p className="mt-2 text-2xl font-bold font-serif-luxury text-[#8C6D28]">
              {stats.totalGuests}
            </p>
            <p className="mt-0.5 text-[11px] text-[#7A6B5C]">Unique links issued</p>
          </div>

          <div className="rounded-2xl border border-[#E3D8C4] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A68] uppercase font-cinzel">
                Invitations Sent
              </span>
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </div>
            <p className="mt-2 text-2xl font-bold font-serif-luxury text-[#2C2117]">
              {stats.totalInvitationsSent}
            </p>
            <p className="mt-0.5 text-[11px] text-[#7A6B5C]">Delivered via WhatsApp</p>
          </div>

          <div className="rounded-2xl border border-[#E3D8C4] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A68] uppercase font-cinzel">
                Open Rate
              </span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold font-serif-luxury text-emerald-700">
              {stats.overallOpenRate}%
            </p>
            <p className="mt-0.5 text-[11px] text-[#7A6B5C]">Guest engagement</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#E3D8C4] pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('weddings')}
            className={`rounded-xl px-4 py-2 text-xs font-bold font-cinzel transition ${
              activeTab === 'weddings'
                ? 'bg-[#241A12] text-[#DFBA54]'
                : 'text-[#695847] hover:bg-white'
            }`}
          >
            All Wedding Projects ({allProjects.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`rounded-xl px-4 py-2 text-xs font-bold font-cinzel transition ${
              activeTab === 'customers'
                ? 'bg-[#241A12] text-[#DFBA54]'
                : 'text-[#695847] hover:bg-white'
            }`}
          >
            Clients / Customers ({allUsers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`rounded-xl px-4 py-2 text-xs font-bold font-cinzel transition ${
              activeTab === 'orders'
                ? 'bg-[#241A12] text-[#DFBA54]'
                : 'text-[#695847] hover:bg-white'
            }`}
          >
            Orders & Revenue ({allOrders.length})
          </button>
        </div>

        {/* TAB 1: ALL WEDDING PROJECTS */}
        {activeTab === 'weddings' && (
          <div className="space-y-4">
            {/* Filter & Search */}
            <div className="rounded-2xl border border-[#E3D8C4] bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A89886]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search weddings by title, slug, bride or groom name..."
                  className="w-full rounded-xl border border-[#D9CBB5] pl-10 pr-3.5 py-2 text-xs text-[#2D2318] focus:outline-none focus:border-[#C59B27]"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-[#D9CBB5] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#4A3D2F]"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active (Published)</option>
                <option value="draft">Draft</option>
                <option value="suspended">Suspended</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-[#E3D8C4] bg-white shadow-xs">
              <table className="w-full text-left text-xs text-[#3D2E1E]">
                <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#8C7653] font-cinzel border-b border-[#E3D8C4]">
                  <tr>
                    <th className="py-3.5 px-4">Wedding Title & Slug</th>
                    <th className="py-3.5 px-3">Owner / Client</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3">Theme</th>
                    <th className="py-3.5 px-3">Guests & RSVPs</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8DC]">
                  {filteredProjects.map((p) => {
                    const owner = platformStore.getUserById(p.ownerId);
                    const attending = p.guests.filter((g) => g.rsvpStatus === 'attending').length;

                    return (
                      <tr key={p.id} className="hover:bg-[#FCFAF6] transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-sm text-[#2A1F15] font-cinzel">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-[#8C7653] font-mono">
                            /{p.slug}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-medium text-[#2A1F15]">
                            {owner?.name || 'Unassigned'}
                          </div>
                          <div className="text-[11px] text-[#7A6B5C]">
                            {owner?.email}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                              p.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : p.status === 'draft'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-xs font-medium text-[#4A3D2F] capitalize">
                            {typeof p.theme === 'string' ? p.theme.replace('-', ' ') : 'Classic Gold'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-[#8C6D28]">
                            {p.guests.length} Guests
                          </div>
                          <div className="text-[11px] text-emerald-700">
                            {attending} Attending
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Impersonate / Open Customer Dashboard */}
                            <button
                              type="button"
                              onClick={() => {
                                if (owner) {
                                  onImpersonateCustomer(owner, p);
                                }
                              }}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#FAF5EB] border border-[#D4AF37] px-2.5 py-1.5 text-xs font-bold text-[#8C6D28] hover:bg-[#F3E8CE]"
                              title="Open Client Dashboard"
                            >
                              <Edit2 className="h-3 w-3" />
                              <span>Manage Dashboard</span>
                            </button>

                            {/* Status toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleProjectStatus(p.id, p.status)}
                              className={`rounded-lg p-1.5 text-xs font-semibold ${
                                p.status === 'active'
                                  ? 'text-amber-700 hover:bg-amber-50'
                                  : 'text-emerald-700 hover:bg-emerald-50'
                              }`}
                              title={p.status === 'active' ? 'Suspend Wedding' : 'Activate Wedding'}
                            >
                              {p.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="rounded-2xl border border-[#E3D8C4] bg-white overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-[#3D2E1E]">
              <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#8C7653] font-cinzel border-b border-[#E3D8C4]">
                <tr>
                  <th className="py-3.5 px-4">Client Name</th>
                  <th className="py-3.5 px-3">Email & Phone</th>
                  <th className="py-3.5 px-3">Plan</th>
                  <th className="py-3.5 px-3">Account Status</th>
                  <th className="py-3.5 px-3">Weddings</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8DC]">
                {allUsers.map((u) => {
                  const userProjects = platformStore.getProjectsByOwner(u.id);

                  return (
                    <tr key={u.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-3.5 px-4 font-bold text-[#2A1F15]">{u.name}</td>
                      <td className="py-3.5 px-3">
                        <div>{u.email}</div>
                        {u.phone && <div className="text-[11px] text-[#7A6B5C] font-mono">{u.phone}</div>}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="rounded bg-[#FAF5EB] px-2 py-0.5 text-xs font-bold text-[#8C6D28] uppercase border border-[#E3D8C4]">
                          {u.plan || 'Royal'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Active
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-[#8C6D28]">
                        {userProjects.length} Project(s)
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {userProjects[0] && (
                          <button
                            type="button"
                            onClick={() => onImpersonateCustomer(u, userProjects[0])}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#241A12] px-2.5 py-1 text-xs font-semibold text-[#DFBA54] hover:bg-[#382B21]"
                          >
                            <span>Open Client View</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: ORDERS & REVENUE */}
        {activeTab === 'orders' && (
          <div className="rounded-2xl border border-[#E3D8C4] bg-white overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-[#3D2E1E]">
              <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#8C7653] font-cinzel border-b border-[#E3D8C4]">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-3">Client</th>
                  <th className="py-3.5 px-3">Package / Plan</th>
                  <th className="py-3.5 px-3">Amount</th>
                  <th className="py-3.5 px-3">Payment Status</th>
                  <th className="py-3.5 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8DC]">
                {allOrders.map((o) => {
                  const client = platformStore.getUserById(o.customerId);

                  return (
                    <tr key={o.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#8C6D28]">{o.id}</td>
                      <td className="py-3.5 px-3 font-medium text-[#2A1F15]">{o.customerName || client?.name || o.customerId}</td>
                      <td className="py-3.5 px-3 uppercase font-semibold text-[#4A3D2F]">{o.plan}</td>
                      <td className="py-3.5 px-3 font-bold text-emerald-800 text-sm">${o.amount}</td>
                      <td className="py-3.5 px-3">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                          ✓ {o.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-[11px] text-[#7A6B5C]">
                        {new Date(o.date).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal: Create Wedding Project */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-[#D9CBB5] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h4 className="text-base font-bold text-[#2A2016] font-cinzel mb-4 pb-2 border-b border-[#EAE1D2]">
              Create New Wedding Invitation Client
            </h4>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                    placeholder="e.g. Tariq Jamil"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                    Client Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                    placeholder="tariq@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                    Bride's Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBrideName}
                    onChange={(e) => setNewBrideName(e.target.value)}
                    className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                    placeholder="e.g. Zainab"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                    Groom's Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newGroomName}
                    onChange={(e) => setNewGroomName(e.target.value)}
                    className="w-full rounded-xl border border-[#D9CBB5] px-3 py-2 text-sm text-[#2D2318] focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                    placeholder="e.g. Bilal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D2F] mb-1">
                  Assigned Subscription Plan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'starter', label: 'Starter ($99)' },
                    { id: 'royal', label: 'Royal ($199)' },
                    { id: 'luxury', label: 'Luxury VIP ($349)' }
                  ].map((pl) => (
                    <button
                      key={pl.id}
                      type="button"
                      onClick={() => setNewPlan(pl.id as any)}
                      className={`rounded-xl border p-2 text-xs font-bold transition ${
                        newPlan === pl.id
                          ? 'border-[#C59B27] bg-[#FAF5EB] text-[#8C6D28]'
                          : 'border-[#D9CBB5] bg-white text-[#5C4D3E]'
                      }`}
                    >
                      {pl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE1D2]">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="rounded-xl border border-[#D9CBB5] px-4 py-2 text-xs font-semibold text-[#5C4D3E] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#C59B27] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#B38A1F]"
                >
                  Create & Launch Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
