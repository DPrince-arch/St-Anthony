'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Printer, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  ExternalLink, 
  Church, 
  Calendar, 
  User, 
  Phone, 
  FileText, 
  Megaphone, 
  Settings,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { Booking, Announcement, ParishSettings, BookingStatus } from '@/lib/types';

interface AdminPanelProps {
  bookings: Booking[];
  announcements: Announcement[];
  settings: ParishSettings | null;
  onRefreshData: () => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (val: boolean) => void;
}

export function AdminPanel({
  bookings,
  announcements,
  settings,
  onRefreshData,
  isAdminAuthenticated,
  setIsAdminAuthenticated
}: AdminPanelProps) {
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [adminTab, setAdminTab] = useState<'bookings' | 'altar_sheet' | 'announcements' | 'settings'>('bookings');

  // Bookings Filter
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [bookingFilterType, setBookingFilterType] = useState<string>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<{ image: string; name: string; ref: string } | null>(null);
  const [adminActionLoading, setAdminActionLoading] = useState(false);

  // Altar Sheet Print State
  const [altarDate, setAltarDate] = useState('');

  React.useEffect(() => {
    setAltarDate(new Date().toISOString().split('T')[0]);
  }, []);
  const [altarMassTime, setAltarMassTime] = useState<string>('all');

  // New Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<'urgent' | 'liturgy' | 'society' | 'general'>('general');
  const [annContent, setAnnContent] = useState('');
  const [annPinned, setAnnPinned] = useState(false);
  const [annAuthor, setAnnAuthor] = useState('Parish Secretariat');
  const [creatingAnn, setCreatingAnn] = useState(false);

  // Settings Form State
  const [editBankName, setEditBankName] = useState(settings?.bankDetails.bankName || 'Zenith Bank Plc');
  const [editAccountName, setEditAccountName] = useState(settings?.bankDetails.accountName || 'St. Anthony Catholic Church - Mass Stipend');
  const [editAccountNumber, setEditAccountNumber] = useState(settings?.bankDetails.accountNumber || '1018892341');
  const [editBankNote, setEditBankNote] = useState(settings?.bankDetails.note || '');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Authenticate Admin
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const data = await res.json();

      if (!res.ok || !data.authenticated) {
        throw new Error(data.error || "Incorrect admin passcode");
      }

      setIsAdminAuthenticated(true);
      setPasscode('');
    } catch (err: any) {
      setAuthError(err.message || "Failed to verify admin credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
  };

  // Change Booking Status
  const handleUpdateBookingStatus = async (id: string, newStatus: BookingStatus) => {
    setAdminActionLoading(true);
    try {
      const adminNote = newStatus === 'approved' 
        ? "Stipend verified. Added to liturgical intentions." 
        : newStatus === 'rejected' 
        ? "Unable to verify stipend receipt. Please contact parish office." 
        : "";

      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, adminNotes: adminNote })
      });

      if (res.ok) {
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdminActionLoading(false);
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking record?")) return;
    try {
      const res = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Create Announcement
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    setCreatingAnn(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: annTitle,
          category: annCategory,
          content: annContent,
          isPinned: annPinned,
          author: annAuthor
        })
      });

      if (res.ok) {
        setAnnTitle('');
        setAnnContent('');
        setAnnPinned(false);
        onRefreshData();
        alert("Announcement posted successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingAnn(false);
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Are you sure you want to remove this announcement?")) return;
    try {
      const res = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminPasscode: "anthony2025",
          bankDetails: {
            bankName: editBankName,
            accountName: editAccountName,
            accountNumber: editAccountNumber,
            note: editBankNote
          }
        })
      });

      if (res.ok) {
        setSettingsSuccess(true);
        onRefreshData();
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = bookingFilterStatus === 'all' || b.status === bookingFilterStatus;
    const matchesType = bookingFilterType === 'all' || b.type === bookingFilterType;
    return matchesStatus && matchesType;
  });

  // Intentions for Altar Sheet
  const altarIntentions = bookings.filter(b => {
    const isApproved = b.status === 'approved';
    const matchesDate = b.requestedDate === altarDate;
    const matchesMass = altarMassTime === 'all' || b.massTime === altarMassTime;
    return isApproved && matchesDate && matchesMass;
  });

  // If Not Authenticated, show Login Screen
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200 text-center space-y-5">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto ring-4 ring-amber-300/60 shadow-md">
            <img src="/st-anthony.jpg" alt="St. Anthony of Padua" className="w-full h-full object-cover object-top" />
          </div>

          <div>
            <h2 className="font-serif font-bold text-2xl text-stone-900">Parish Staff Portal</h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Protected area for Rev. Father and Parish Office Secretariat.
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5 text-left">
                Admin Passcode
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter parish passcode..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-center tracking-widest text-lg"
              />
              <p className="text-[11px] text-stone-400 mt-1.5 text-left">
              </p>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl font-serif text-sm font-bold bg-amber-900 text-amber-50 hover:bg-amber-950 active:scale-98 transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>{authLoading ? 'Verifying...' : 'Unlock Admin Portal'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Admin Top Navigation & Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-xs ring-2 ring-amber-400/50 shrink-0">
            <img src="/st-anthony.jpg" alt="St. Anthony of Padua" className="w-full h-full object-cover object-top" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif font-bold text-lg text-stone-900">Parish Secretariat Panel</h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Authorized
              </span>
            </div>
            <p className="text-xs text-stone-500">St. Anthony Catholic Church Administration</p>
          </div>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 justify-between md:justify-end">
          {[
            { id: 'bookings', label: `Bookings (${bookings.length})` },
            { id: 'altar_sheet', label: 'Altar Sheet' },
            { id: 'announcements', label: 'Post Notices' },
            { id: 'settings', label: 'Parish Bank & Setup' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                adminTab === tab.id
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-xl text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors ml-2"
            title="Lock / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SUB-SECTION 1: BOOKINGS & INTENTIONS MANAGER */}
      {adminTab === 'bookings' && (
        <div className="space-y-4">
          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Bookings', count: bookings.length, color: 'text-stone-900', bg: 'bg-white' },
              { label: 'Pending Review', count: bookings.filter(b => b.status === 'pending').length, color: 'text-amber-700', bg: 'bg-amber-50/50' },
              { label: 'Approved & Scheduled', count: bookings.filter(b => b.status === 'approved').length, color: 'text-emerald-700', bg: 'bg-emerald-50/50' },
              { label: 'Rejected', count: bookings.filter(b => b.status === 'rejected').length, color: 'text-red-700', bg: 'bg-red-50/50' }
            ].map((m, idx) => (
              <div key={idx} className={`${m.bg} p-4 rounded-2xl border border-stone-200 shadow-xs`}>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">{m.label}</span>
                <span className={`font-serif font-bold text-2xl sm:text-3xl mt-1 block ${m.color}`}>{m.count}</span>
              </div>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Status:</span>
              {['all', 'pending', 'approved', 'rejected', 'completed'].map(st => (
                <button
                  key={st}
                  onClick={() => setBookingFilterStatus(st)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
                    bookingFilterStatus === st
                      ? 'bg-amber-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Type:</span>
              <select
                value={bookingFilterType}
                onChange={(e) => setBookingFilterType(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1 text-xs font-medium text-stone-800"
              >
                <option value="all">All Types</option>
                <option value="mass_intention">Mass Intentions</option>
                <option value="thanksgiving">Thanksgiving</option>
                <option value="priest_appointment">Priest Appointments</option>
              </select>
            </div>
          </div>

          {/* Bookings List Cards */}
          <div className="space-y-3">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b) => (
                <div 
                  key={b.id} 
                  className={`bg-white rounded-2xl p-5 border transition-all shadow-xs space-y-4 ${
                    b.status === 'pending' ? 'border-amber-300 ring-1 ring-amber-400/20' : 'border-stone-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-stone-100 text-amber-950 border border-stone-200">
                        {b.referenceCode}
                      </span>
                      <span className="text-xs font-semibold text-stone-700 capitalize">
                        {b.type.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[11px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        b.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : b.status === 'pending' 
                          ? 'bg-amber-100 text-amber-800' 
                          : b.status === 'rejected' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-stone-100 text-stone-800'
                      }`}>
                        {b.status}
                      </span>
                      <button
                        onClick={() => handleDeleteBooking(b.id)}
                        className="text-stone-300 hover:text-red-600 p-1 rounded-lg transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-8 space-y-2">
                      <div>
                        <span className="text-xs text-stone-400 block">Parishioner</span>
                        <div className="flex items-center space-x-3 text-sm font-semibold text-stone-900">
                          <span>{b.parishionerName}</span>
                          <a 
                            href={`tel:${b.phone}`} 
                            className="text-xs text-amber-800 hover:underline flex items-center space-x-0.5"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{b.phone}</span>
                          </a>
                        </div>
                      </div>

                      {/* Intention Text */}
                      {b.intentionFor && (
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                          <span className="text-[10px] font-bold uppercase text-stone-500 block">
                            Intention Text:
                          </span>
                          <p className="font-serif text-stone-900 text-sm mt-0.5 leading-relaxed">
                            "{b.intentionFor}"
                          </p>
                        </div>
                      )}

                      {/* Appointment Reason */}
                      {b.appointmentReason && (
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                          <span className="text-[10px] font-bold uppercase text-stone-500 block">
                            Appointment Subject:
                          </span>
                          <p className="text-stone-800 text-xs font-semibold capitalize mt-0.5">
                            {b.appointmentReason.replace('_', ' ')} ({b.preferredTimeSlot})
                          </p>
                          {b.notes && (
                            <p className="text-stone-600 text-xs mt-1 italic">
                              "{b.notes}"
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1 font-sans">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>Mass Date: <strong>{b.requestedDate}</strong></span>
                        </span>
                        {b.massTime && (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>Time: <strong>{b.massTime}</strong></span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Receipt Viewer Column */}
                    <div className="md:col-span-4 bg-stone-50 p-3 rounded-xl border border-stone-200 text-center space-y-2">
                      <span className="text-[10px] font-bold uppercase text-stone-500 block">
                        Payment Transfer Receipt
                      </span>
                      {b.receiptImage ? (
                        <div className="space-y-2">
                          <img
                            src={b.receiptImage}
                            alt="Parishioner Receipt"
                            onClick={() => setSelectedReceipt({ image: b.receiptImage!, name: b.parishionerName, ref: b.referenceCode })}
                            className="w-full h-24 object-cover rounded-lg border border-stone-300 cursor-pointer hover:opacity-90 transition-opacity shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt({ image: b.receiptImage!, name: b.parishionerName, ref: b.referenceCode })}
                            className="w-full py-1 text-xs font-semibold bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100 flex items-center justify-center space-x-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-800" />
                            <span>View Full Receipt</span>
                          </button>
                        </div>
                      ) : (
                        <div className="py-6 text-stone-400 text-xs italic">
                          No receipt attached
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
                    {b.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'approved')}
                        disabled={adminActionLoading}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center space-x-1.5 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Verify Stipend</span>
                      </button>
                    )}

                    {b.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'rejected')}
                        disabled={adminActionLoading}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 text-red-700 hover:bg-red-50 border border-stone-200 transition-colors flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    {b.status === 'approved' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'completed')}
                        disabled={adminActionLoading}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-800 text-white hover:bg-black transition-colors"
                      >
                        Mark as Offered
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
                <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="font-serif font-bold text-lg text-stone-700">No Bookings Found</h3>
                <p className="text-xs text-stone-500 mt-1">There are no bookings matching the selected filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: PRINT ALTAR SHEET */}
      {adminTab === 'altar_sheet' && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                  Mass Date
                </label>
                <input
                  type="date"
                  value={altarDate}
                  onChange={(e) => setAltarDate(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                  Mass Schedule
                </label>
                <select
                  value={altarMassTime}
                  onChange={(e) => setAltarMassTime(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-900"
                >
                  <option value="all">All Scheduled Masses</option>
                  <option value="06:30 AM (Dawn Mass)">06:30 AM (Dawn Mass)</option>
                  <option value="08:30 AM (Family Mass)">08:30 AM (Family Mass)</option>
                  <option value="10:30 AM (High Mass)">10:30 AM (High Mass)</option>
                  <option value="12:00 PM (Midday Mass)">12:00 PM (Midday Mass)</option>
                  <option value="06:00 PM (Evening Mass)">06:00 PM (Evening Mass)</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-900 text-white hover:bg-amber-950 transition-colors shadow-xs flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Altar Sheet for Father</span>
            </button>
          </div>

          {/* Printable Sheet View */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-stone-300 shadow-lg printable-area">
            <div className="text-center border-b-2 border-stone-800 pb-6 mb-6">
              <img
                src="/st-anthony.jpg"
                alt="St. Anthony of Padua"
                className="w-14 h-14 rounded-full object-cover object-top mx-auto mb-2 ring-2 ring-amber-800/40 shadow-xs"
              />
              <h1 className="font-serif font-bold text-2xl sm:text-3xl uppercase tracking-wider text-stone-950">
                St. Anthony Catholic Church
              </h1>
              <p className="text-sm font-serif italic text-stone-600 mt-1">
                Official Mass Intentions Altar List
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs font-sans font-bold text-stone-700 mt-3 uppercase tracking-widest">
                <span>Date: {new Date(altarDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>•</span>
                <span>Schedule: {altarMassTime === 'all' ? 'All Scheduled Masses' : altarMassTime}</span>
              </div>
            </div>

            {altarIntentions.length > 0 ? (
              <div className="space-y-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-stone-300 text-xs font-bold uppercase tracking-wider text-stone-700">
                      <th className="py-2.5 px-3">S/N</th>
                      <th className="py-2.5 px-3">Mass Time</th>
                      <th className="py-2.5 px-3">Parishioner</th>
                      <th className="py-2.5 px-3">Intention Description</th>
                      <th className="py-2.5 px-3 text-right">Ref Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 font-serif text-sm">
                    {altarIntentions.map((intent, idx) => (
                      <tr key={intent.id} className="hover:bg-stone-50">
                        <td className="py-3 px-3 font-sans font-semibold text-stone-400">{idx + 1}</td>
                        <td className="py-3 px-3 font-sans font-semibold text-stone-800 whitespace-nowrap">{intent.massTime}</td>
                        <td className="py-3 px-3 font-semibold text-stone-950">{intent.parishionerName}</td>
                        <td className="py-3 px-3 text-stone-800 leading-relaxed italic">{intent.intentionFor}</td>
                        <td className="py-3 px-3 font-mono text-xs text-stone-500 text-right">{intent.referenceCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pt-8 mt-8 border-t border-stone-300 flex justify-between items-center text-xs text-stone-500 font-sans">
                  <span>Prepared by: Parish Secretariat</span>
                  <span>Celebrant / Priest Signature: _______________________</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-stone-400 font-serif">
                No approved mass intentions found for this selected date and time.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: ANNOUNCEMENTS EDITOR */}
      {adminTab === 'announcements' && (
        <div className="space-y-6">
          {/* Creator Form */}
          <form onSubmit={handleCreateAnnouncement} className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-4">
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Type Out New Parish Announcement
            </h3>
            <p className="text-xs text-stone-500">
              Draft a bulletin announcement. It will be immediately published to the announcements tab for readers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Solemnity of Corpus Christi Procession Notice"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="general">General Parish News</option>
                  <option value="urgent">Urgent / Important Notice</option>
                  <option value="liturgy">Liturgical & Feast Days</option>
                  <option value="society">Societies & Youth</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
                  Publishing Authority
                </label>
                <input
                  type="text"
                  value={annAuthor}
                  onChange={(e) => setAnnAuthor(e.target.value)}
                  placeholder="e.g. Parish Priest, Parish Pastoral Council"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
                Announcement Content / Message *
              </label>
              <textarea
                required
                rows={5}
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                placeholder="Type out the complete details, dates, venue, and instructions for parishioners..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="pinNotice"
                checked={annPinned}
                onChange={(e) => setAnnPinned(e.target.checked)}
                className="w-4 h-4 text-amber-900 rounded border-stone-300 focus:ring-amber-500"
              />
              <label htmlFor="pinNotice" className="text-xs font-semibold text-stone-700 cursor-pointer">
                Pin to top of Announcements (Important notice)
              </label>
            </div>

            <button
              type="submit"
              disabled={creatingAnn}
              className="py-2.5 px-6 rounded-xl font-serif text-sm font-bold bg-amber-900 text-amber-50 hover:bg-amber-950 transition-all shadow-xs flex items-center space-x-2"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>{creatingAnn ? 'Publishing...' : 'Publish Announcement'}</span>
            </button>
          </form>

          {/* Existing Announcements Management */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Active Announcements ({announcements.length})
            </h3>

            <div className="divide-y divide-stone-100">
              {announcements.map((a) => (
                <div key={a.id} className="py-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      {a.isPinned && (
                        <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                          Pinned
                        </span>
                      )}
                      <h4 className="font-serif font-bold text-base text-stone-900">{a.title}</h4>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-1">{a.content}</p>
                    <span className="text-[11px] text-stone-400 mt-1 block">
                      Published by {a.author} on {new Date(a.publishedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteAnnouncement(a.id)}
                    className="text-stone-400 hover:text-red-700 p-2 rounded-lg transition-colors shrink-0"
                    title="Remove announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 4: PARISH SETTINGS & BANK SETUP */}
      {adminTab === 'settings' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Parish Bank Account & Stipend Configuration
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Configure the bank account details displayed on the Mass bookings and Thanksgiving forms.
            </p>
          </div>

          {settingsSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Parish bank details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
                  Bank Name *
                </label>
                <input
                  type="text"
                  required
                  value={editBankName}
                  onChange={(e) => setEditBankName(e.target.value)}
                  placeholder="e.g. Zenith Bank Plc"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
                  Account Name *
                </label>
                <input
                  type="text"
                  required
                  value={editAccountName}
                  onChange={(e) => setEditAccountName(e.target.value)}
                  placeholder="e.g. St. Anthony Catholic Church"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
                  Account Number *
                </label>
                <input
                  type="text"
                  required
                  value={editAccountNumber}
                  onChange={(e) => setEditAccountNumber(e.target.value)}
                  placeholder="1018892341"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono tracking-wider text-base"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
                  Parishioner Instructions Note
                </label>
                <textarea
                  rows={2}
                  value={editBankNote}
                  onChange={(e) => setEditBankNote(e.target.value)}
                  placeholder="Please transfer your Mass stipend and upload your transfer receipt..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="py-2.5 px-6 rounded-xl font-serif text-sm font-bold bg-amber-900 text-amber-50 hover:bg-amber-950 transition-all shadow-xs flex items-center space-x-2"
            >
              <span>{savingSettings ? 'Saving...' : 'Save Bank Details'}</span>
            </button>
          </form>
        </div>
      )}

      {/* RECEIPT LIGHTBOX MODAL */}
      {selectedReceipt && (
        <div 
          onClick={() => setSelectedReceipt(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-amber-900">{selectedReceipt.ref}</span>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  {selectedReceipt.name}'s Receipt
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-stone-400 hover:text-stone-800 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 max-h-[70vh] flex items-center justify-center">
              <img
                src={selectedReceipt.image}
                alt="Bank Transfer Proof"
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-stone-500">
                Verify date, amount, and reference against church account.
              </span>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-white hover:bg-black"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
