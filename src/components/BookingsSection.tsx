'use client';

import React, { useState, useRef } from 'react';
import { 
  CalendarPlus, 
  Copy, 
  Check, 
  UploadCloud, 
  X, 
  CheckCircle2, 
  Clock, 
  HeartHandshake, 
  Church, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { BookingType, ParishSettings, Booking } from '@/lib/types';

interface BookingsSectionProps {
  settings: ParishSettings | null;
  defaultType?: BookingType;
  onBookingSuccess?: (booking: Booking) => void;
}

export function BookingsSection({ settings, defaultType = 'mass_intention', onBookingSuccess }: BookingsSectionProps) {
  const [bookingType, setBookingType] = useState<BookingType>(defaultType);

  React.useEffect(() => {
    if (defaultType) {
      setBookingType(defaultType);
    }
  }, [defaultType]);
  const [copiedBank, setCopiedBank] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [parishionerName, setParishionerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [requestedDate, setRequestedDate] = useState('');

  React.useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setRequestedDate(tomorrow.toISOString().split('T')[0]);
  }, []);
  const [massTime, setMassTime] = useState('06:30 AM (Dawn Mass)');
  const [intentionType, setIntentionType] = useState<'thanksgiving' | 'repose_soul' | 'birthday' | 'healing' | 'anniversary' | 'special_intention'>('thanksgiving');
  const [intentionFor, setIntentionFor] = useState('');
  const [appointmentReason, setAppointmentReason] = useState<'spiritual_direction' | 'confession' | 'counseling' | 'sick_call' | 'other'>('spiritual_direction');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('10:00 AM - 11:00 AM');
  const [notes, setNotes] = useState('');
  
  // Receipt Image Upload State
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bankDetails = settings?.bankDetails || {
    bankName: "Zenith Bank Plc",
    accountName: "St. Anthony Catholic Church - Mass Stipend",
    accountNumber: "1018892341",
    note: "Please transfer your Mass stipend and upload your payment transfer receipt below."
  };

  const handleCopyAccount = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(bankDetails.accountNumber);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2500);
    }
  };

  // Handle receipt image upload and convert to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file (PNG, JPG, JPEG, WebP) of your transfer receipt.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Receipt image size must be under 5MB.");
      return;
    }

    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setReceiptImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeReceipt = () => {
    setReceiptImage(null);
    setReceiptFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      if (!parishionerName.trim() || !phone.trim() || !requestedDate) {
        throw new Error("Please complete all required fields (Name, Phone, and Date).");
      }

      if ((bookingType === 'mass_intention' || bookingType === 'thanksgiving') && !intentionFor.trim()) {
        throw new Error("Please describe the intention for the Mass or Thanksgiving.");
      }

      if ((bookingType === 'mass_intention' || bookingType === 'thanksgiving') && !receiptImage) {
        throw new Error("Please upload a screenshot or photo of your transfer receipt before submitting.");
      }

      const payload = {
        type: bookingType,
        parishionerName,
        phone,
        email,
        requestedDate,
        massTime: bookingType !== 'priest_appointment' ? massTime : undefined,
        intentionType: bookingType !== 'priest_appointment' ? intentionType : undefined,
        intentionFor: bookingType !== 'priest_appointment' ? intentionFor : undefined,
        appointmentReason: bookingType === 'priest_appointment' ? appointmentReason : undefined,
        preferredTimeSlot: bookingType === 'priest_appointment' ? preferredTimeSlot : undefined,
        notes,
        receiptImage: receiptImage || undefined
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit booking.");
      }

      setSuccessBooking(data.data);
      onBookingSuccess?.(data.data);

      // Reset fields
      setIntentionFor('');
      setNotes('');
      removeReceipt();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Booking Type Switcher */}
      <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-xs border border-stone-200">
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'mass_intention', label: 'Mass Intention', icon: Church },
            { id: 'thanksgiving', label: 'Thanksgiving', icon: HeartHandshake },
            { id: 'priest_appointment', label: 'Priest Appointment', icon: CalendarPlus }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = bookingType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setBookingType(tab.id as BookingType);
                  setErrorMessage('');
                }}
                className={`py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 ${
                  isSelected
                    ? 'bg-amber-900 text-amber-50 shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CHURCH BANK DETAILS CARD (For Mass Intentions & Thanksgiving) */}
      {bookingType !== 'priest_appointment' && (
        <div className="bg-gradient-to-br from-amber-900 via-amber-950 to-stone-900 rounded-2xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
          {/* Subtle gold watermark */}
          <Church className="absolute -right-8 -bottom-8 w-44 h-44 text-white/5 pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-800/80 pb-4 mb-5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-amber-400/60 shadow-xs shrink-0">
                <img src="/st-anthony.jpg" alt="St. Anthony of Padua" className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Official Parish Stipend Account
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl mt-0.5">
                  {bankDetails.bankName}
                </h3>
              </div>
            </div>
            <span className="text-xs bg-amber-800/80 text-amber-100 px-3 py-1 rounded-full border border-amber-600/50 self-start sm:self-center">
              Direct Bank Transfer
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-amber-200/80 block">Account Name</span>
              <p className="font-semibold text-sm sm:text-base text-amber-50 tracking-wide mt-0.5">
                {bankDetails.accountName}
              </p>
            </div>

            <div>
              <span className="text-xs text-amber-200/80 block">Account Number</span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="font-mono font-bold text-xl sm:text-2xl tracking-widest text-white">
                  {bankDetails.accountNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 transition-colors flex items-center space-x-1 text-xs"
                  title="Copy Account Number"
                >
                  {copiedBank ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedBank ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-amber-200/70 mt-4 pt-3 border-t border-amber-800/60 font-sans">
            ℹ️ {bankDetails.note || "Please transfer your stipend from your banking app, take a screenshot of the receipt, and upload it in the form below."}
          </p>
        </div>
      )}

      {/* BOOKING FORM */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            {bookingType === 'mass_intention' && "Book a Mass Intention"}
            {bookingType === 'thanksgiving' && "Book a Thanksgiving Mass Offering"}
            {bookingType === 'priest_appointment' && "Schedule Appointment with Father"}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {bookingType === 'mass_intention' && "Submit your Mass intention to be offered at the Altar of God by the parish priest."}
            {bookingType === 'thanksgiving' && "Give thanks to God for His benevolence, family blessings, and anniversaries."}
            {bookingType === 'priest_appointment' && "Request a spiritual direction, counseling, or confession session with our parish priests."}
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Parishioner Personal Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
              Your Full Name *
            </label>
            <input
              type="text"
              required
              value={parishionerName}
              onChange={(e) => setParishionerName(e.target.value)}
              placeholder="e.g. Bro. Augustine Adeleke"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
              Phone Number (WhatsApp) *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +234 803 000 0000"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parishioner@example.com"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* SPECIFIC FIELDS: Mass Intention & Thanksgiving */}
        {bookingType !== 'priest_appointment' && (
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
                  Type of Intention *
                </label>
                <select
                  value={intentionType}
                  onChange={(e) => setIntentionType(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="thanksgiving">Thanksgiving for God's Blessings</option>
                  <option value="repose_soul">Repose of the Soul (RIP / Departed)</option>
                  <option value="birthday">Birthday Thanksgiving</option>
                  <option value="healing">Divine Healing & Quick Recovery</option>
                  <option value="anniversary">Wedding / Ordination Anniversary</option>
                  <option value="special_intention">Special / Private Intention</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
                  Requested Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
                  Preferred Mass Schedule *
                </label>
                <select
                  value={massTime}
                  onChange={(e) => setMassTime(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="06:30 AM (Dawn Mass)">06:30 AM (Morning Dawn Mass)</option>
                  <option value="08:30 AM (Family Mass)">08:30 AM (Family & Children Mass)</option>
                  <option value="10:30 AM (High Mass)">10:30 AM (High / Choral Mass)</option>
                  <option value="12:00 PM (Midday Mass)">12:00 PM (Midday Weekday Mass)</option>
                  <option value="06:00 PM (Evening Mass)">06:00 PM (Evening / Youth Mass)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
                Intention Details (To be announced at Mass) *
              </label>
              <textarea
                required
                rows={3}
                value={intentionFor}
                onChange={(e) => setIntentionFor(e.target.value)}
                placeholder="e.g. In thanksgiving to God Almighty for safe delivery of a baby boy to the Adeleke family... OR: For the repose of the soul of late Mrs. Mary Okafor (RIP)..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            {/* RECEIPT UPLOAD (User Request: "ask for the user to upload a reciept") */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider">
                Upload Bank Transfer Receipt *
              </label>
              <p className="text-xs text-stone-500">
                Please attach the screenshot or photo of your payment to the parish account above.
              </p>

              {!receiptImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-amber-700 bg-stone-50 hover:bg-amber-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all group"
                >
                  <UploadCloud className="w-10 h-10 text-stone-400 group-hover:text-amber-800 mx-auto mb-2 transition-colors" />
                  <p className="text-xs sm:text-sm font-semibold text-stone-700 group-hover:text-amber-900">
                    Click to browse or drop transfer receipt here
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Supports PNG, JPG, JPEG, WebP (Max 5MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative rounded-2xl border border-stone-200 bg-stone-50 p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    {/* Thumbnail */}
                    <img
                      src={receiptImage}
                      alt="Uploaded transfer receipt"
                      className="w-14 h-14 object-cover rounded-lg border border-stone-200 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-stone-800 truncate">
                        {receiptFileName || "Transfer_Receipt.jpg"}
                      </p>
                      <span className="text-[10px] text-emerald-700 font-medium flex items-center space-x-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready to attach</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeReceipt}
                    className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
                    title="Remove receipt"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SPECIFIC FIELDS: Priest Appointment */}
        {bookingType === 'priest_appointment' && (
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
                  Reason for Appointment *
                </label>
                <select
                  value={appointmentReason}
                  onChange={(e) => setAppointmentReason(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="spiritual_direction">Spiritual Direction & Guidance</option>
                  <option value="confession">Sacrament of Reconciliation (Confession)</option>
                  <option value="counseling">Family / Marriage / Personal Counseling</option>
                  <option value="sick_call">Sick Call / Anointing of the Sick</option>
                  <option value="other">Other Pastoral Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
                  Preferred Time Slot *
                </label>
                <select
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM (Morning Office)</option>
                  <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                  <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                  <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM (Afternoon Office)</option>
                  <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5">
                Additional Notes / Confidential Details (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share any brief context or let Father know if this is an urgent pastoral emergency..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl font-serif text-base font-bold bg-amber-900 text-amber-50 hover:bg-amber-950 active:scale-98 transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {submitting ? (
            <span>Transmitting to Parish Office...</span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 text-amber-300" />
              <span>
                {bookingType === 'mass_intention' && "Confirm & Submit Mass Intention"}
                {bookingType === 'thanksgiving' && "Submit Thanksgiving Booking"}
                {bookingType === 'priest_appointment' && "Request Appointment with Priest"}
              </span>
            </>
          )}
        </button>
      </form>

      {/* SUCCESS CONFIRMATION MODAL */}
      {successBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Booking Received
              </span>
              <h3 className="font-serif font-bold text-2xl text-stone-900 mt-2">
                Praise be to God!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Your request has been registered in the parish secretariat database.
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <span className="text-stone-500">Reference Code:</span>
                <span className="font-mono font-bold text-sm text-amber-900">{successBooking.referenceCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Parishioner:</span>
                <span className="font-semibold text-stone-800">{successBooking.parishionerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Date:</span>
                <span className="font-semibold text-stone-800">{successBooking.requestedDate}</span>
              </div>
              {successBooking.massTime && (
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Mass Schedule:</span>
                  <span className="font-semibold text-stone-800">{successBooking.massTime}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                <span className="text-stone-500">Status:</span>
                <span className="font-bold text-amber-800 uppercase text-[10px] bg-amber-100 px-2 py-0.5 rounded-full">
                  Pending Verification
                </span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500">
              The parish secretary will review your uploaded bank receipt, confirm the stipend, and include your intention on Father's altar list.
            </p>

            <button
              onClick={() => setSuccessBooking(null)}
              className="w-full py-2.5 rounded-xl font-semibold text-sm bg-stone-900 text-white hover:bg-black transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
