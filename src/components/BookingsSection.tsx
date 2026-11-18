'use client';

import React, { useState, useRef } from 'react';
import {
  CalendarPlus,
  Copy,
  Check,
  UploadCloud,
  X,
  CheckCircle2,
  HeartHandshake,
  Church,
  AlertCircle,
  Search,
  ChevronRight,
  Cake,
  Cross,
  Gem,
  Flower2,
  Flame,
  Wheat,
  HandCoins,
  Sprout,
  HandHeart,
  Coins,
  type LucideIcon,
} from 'lucide-react';
import { BookingType, PublicSettings, Booking } from '@/lib/types';
import {
  BOOKING_GROUPS,
  BookingField,
  BookingGroup,
  BookingSection,
  BookingTypeConfig,
  MASS_SCHEDULE_OPTIONS,
  catalogForSection,
  formatBookingValue,
  getBookingConfig,
  monthOptions,
} from '@/lib/bookingCatalog';
import { addDays, todayInParish } from '@/lib/dates';

interface BookingsSectionProps {
  settings: PublicSettings | null;
  defaultType?: BookingType;
  /** Which page this is: parish bookings, or payments (tithe, levies, donations, offerings). */
  section?: BookingSection;
}

const BOOKING_ICONS: Record<BookingType, LucideIcon> = {
  mass_intention: Church,
  thanksgiving: HeartHandshake,
  birthday_mass: Cake,
  requiem_mass: Cross,
  wedding_mass: Gem,
  funeral: Flower2,
  wake_keep: Flame,
  harvest_thanksgiving: Wheat,
  tithe: HandCoins,
  harvest_levy: Sprout,
  donation: HandHeart,
  offering: Coins,
  priest_appointment: CalendarPlus,
};

const GROUP_LABELS = Object.fromEntries(BOOKING_GROUPS.map(g => [g.id, g.label])) as Record<BookingGroup, string>;

const inputClass =
  'w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden';
const labelClass = 'block text-xs font-bold uppercase text-stone-700 tracking-wider mb-1.5';

const SHRINK_RECEIPTS_ABOVE_BYTES = 500 * 1024;
const MAX_RECEIPT_SIDE_PX = 1600;

/**
 * Downscales large receipt photos in the browser (longest side 1600 px, JPEG) so they
 * upload quickly over mobile data. Keeps the original if anything fails or it isn't smaller.
 */
async function shrinkReceipt(file: File): Promise<File> {
  if (file.size <= SHRINK_RECEIPTS_ABOVE_BYTES) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_RECEIPT_SIDE_PX / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext('2d');
    if (!context) return file;
    context.fillStyle = '#ffffff'; // transparent PNG areas become white, not black
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.82));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.jpg`, { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

function fieldOptions(field: BookingField, today: string) {
  if (field.kind === 'massSchedule') return MASS_SCHEDULE_OPTIONS;
  if (field.kind === 'month') return monthOptions(today);
  return field.options;
}

/** Starting values for a booking type's own fields: the first choice of each dropdown, else blank. */
function defaultValues(config: BookingTypeConfig, today: string): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of config.fields) {
    // A month defaults to the current one; it is listed after the two months ahead.
    const options = fieldOptions(field, today);
    values[field.name] = (field.kind === 'month' ? options?.[2] : options?.[0])?.value ?? '';
  }
  return values;
}

function FieldInput({
  field,
  value,
  onChange,
  today,
}: {
  field: BookingField;
  value: string;
  onChange: (value: string) => void;
  today: string;
}) {
  const id = `booking-${field.name}`;
  const options = fieldOptions(field, today);
  const label = `${field.label}${field.required ? ' *' : ''}`;

  let control: React.ReactNode;
  if (options) {
    control = (
      <select id={id} required={field.required} value={value} onChange={e => onChange(e.target.value)} className={inputClass}>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    );
  } else if (field.kind === 'textarea') {
    control = (
      <textarea
        id={id}
        required={field.required}
        rows={3}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={inputClass}
      />
    );
  } else {
    control = (
      <input
        id={id}
        type={field.kind === 'amount' ? 'text' : field.kind}
        inputMode={field.kind === 'amount' ? 'numeric' : undefined}
        pattern={field.kind === 'amount' ? '[0-9]+(\\.[0-9]{1,2})?' : undefined}
        title={field.kind === 'amount' ? 'Numbers only, e.g. 10000' : undefined}
        max={field.kind === 'date' && field.pastOnly ? today : undefined}
        required={field.required}
        value={value}
        onChange={e => onChange(field.kind === 'amount' ? e.target.value.replace(/[^\d.]/g, '') : e.target.value)}
        placeholder={field.placeholder}
        className={inputClass}
      />
    );
  }

  return (
    <div className={field.full ? 'sm:col-span-2' : undefined}>
      <label htmlFor={id} className={labelClass}>{label}</label>
      {control}
      {field.help && <p className="text-[11px] text-stone-500 mt-1">{field.help}</p>}
    </div>
  );
}

const SECTION_TEXT: Record<BookingSection, {
  all: string;
  listHeading: string;
  search: string;
  received: string;
  sent: string;
}> = {
  bookings: {
    all: 'All Bookings',
    listHeading: 'Parish Bookings',
    search: 'Search bookings...',
    received: 'Booking Received',
    sent: 'request has been sent to the parish office',
  },
  payments: {
    all: 'All Payments',
    listHeading: 'Parish Payments',
    search: 'Search payments...',
    received: 'Payment Recorded',
    sent: 'payment has been sent to the parish office for verification',
  },
};

/** Bookings are for a coming date (default: tomorrow); payments record a past one (default: today). */
function initialDate(config: BookingTypeConfig, today: string) {
  return config.pastDate ? today : addDays(today, 1);
}

export function BookingsSection({ settings, defaultType = 'mass_intention', section = 'bookings' }: BookingsSectionProps) {
  const today = todayInParish();
  const text = SECTION_TEXT[section];
  const sectionCatalog = catalogForSection(section);
  const sectionGroups = BOOKING_GROUPS.filter(group => group.section === section);
  const [bookingType, setBookingType] = useState<BookingType>(defaultType);
  const [values, setValues] = useState(() => defaultValues(getBookingConfig(defaultType), today));
  const [requestedDate, setRequestedDate] = useState(() => initialDate(getBookingConfig(defaultType), today));
  const [syncedDefaultType, setSyncedDefaultType] = useState(defaultType);
  const [selectedGroup, setSelectedGroup] = useState<'all' | BookingGroup>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Details shared by every booking type, kept when switching types.
  const [parishionerName, setParishionerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Receipt Image Upload State
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const receiptPreviewUrl = useRef<string | null>(null);
  const formPanelRef = useRef<HTMLDivElement>(null);

  const selectType = (type: BookingType) => {
    const next = getBookingConfig(type);
    setBookingType(type);
    setValues(defaultValues(next, today));
    setRequestedDate(initialDate(next, today));
    setErrorMessage('');
  };

  // Follow ?type= changes (e.g. navigating between booking links) without an effect.
  if (defaultType !== syncedDefaultType) {
    setSyncedDefaultType(defaultType);
    selectType(defaultType);
  }

  React.useEffect(() => () => {
    if (receiptPreviewUrl.current) URL.revokeObjectURL(receiptPreviewUrl.current);
  }, []);

  const config = getBookingConfig(bookingType);
  const ActiveIcon = BOOKING_ICONS[bookingType];

  const query = searchQuery.trim().toLowerCase();
  const filteredTypes = sectionCatalog.filter(item =>
    (selectedGroup === 'all' || item.group === selectedGroup) &&
    (!query || item.title.toLowerCase().includes(query) || item.subtitle.toLowerCase().includes(query))
  );

  const setReceiptAttachment = (file: File | null) => {
    if (receiptPreviewUrl.current) URL.revokeObjectURL(receiptPreviewUrl.current);
    receiptPreviewUrl.current = file ? URL.createObjectURL(file) : null;
    setReceiptPreview(receiptPreviewUrl.current);
    setReceiptFile(file);
  };

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

  // Keep the receipt as a file so the API can upload it to object storage.
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      alert("Please upload an image file (PNG, JPG, JPEG, WebP) of your transfer receipt.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Receipt image size must be under 5MB.");
      return;
    }

    setReceiptFileName(file.name);
    setReceiptAttachment(await shrinkReceipt(file));
  };

  const removeReceipt = () => {
    setReceiptAttachment(null);
    setReceiptFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectFromList = (type: BookingType) => {
    selectType(type);
    // On phones the form sits below the list, so bring it into view.
    if (window.matchMedia('(max-width: 1023px)').matches) {
      formPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      if (!parishionerName.trim() || !phone.trim() || !requestedDate) {
        throw new Error(`Please complete all required fields (Name, Phone, and ${config.dateLabel}).`);
      }
      const missing = config.fields.find(field => field.required && !values[field.name]?.trim());
      if (missing) {
        throw new Error(`Please fill in: ${missing.label}.`);
      }
      if (config.receipt === 'required' && !receiptFile) {
        throw new Error("Please upload a screenshot or photo of your transfer receipt before submitting.");
      }

      const formData = new FormData();
      formData.append('type', bookingType);
      formData.append('parishionerName', parishionerName);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('requestedDate', requestedDate);
      for (const field of config.fields) {
        if (values[field.name]) formData.append(field.name, values[field.name]);
      }
      if (receiptFile && config.receipt !== 'none') formData.append('receipt', receiptFile);

      const res = await fetch('/api/bookings', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit. Please try again.");
      }

      setSuccessBooking(data.data);
      setValues(defaultValues(config, today));
      removeReceipt();
    } catch (err) {
      setErrorMessage((err instanceof Error && err.message) || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Category Pills & Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[{ id: 'all' as const, label: text.all }, ...sectionGroups].map(group => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedGroup === group.id
                    ? 'bg-amber-900 text-amber-50 shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {group.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder={text.search}
              aria-label={text.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Booking Directory */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white rounded-2xl border border-stone-200 p-3 shadow-xs">
            <h3 className="text-xs uppercase font-bold tracking-wider text-stone-400 px-3 py-2">
              {text.listHeading} ({filteredTypes.length})
            </h3>
            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
              {filteredTypes.map(item => {
                const Icon = BOOKING_ICONS[item.id];
                const isSelected = bookingType === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectFromList(item.id)}
                    aria-current={isSelected ? 'true' : undefined}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-900 text-white shadow-xs font-semibold'
                        : 'hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-300' : 'text-stone-400'}`} />
                      <div className="min-w-0">
                        <span className="font-serif text-sm leading-snug block">{item.title}</span>
                        <p className={`text-xs mt-0.5 line-clamp-1 font-normal ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-200' : 'text-stone-300'}`} />
                  </button>
                );
              })}
              {filteredTypes.length === 0 && (
                <p className="px-3 py-6 text-center text-xs text-stone-500">Nothing matches your search.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Active Booking Form */}
        <div ref={formPanelRef} className="lg:col-span-8 scroll-mt-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
            {/* Booking Title Header */}
            <div className="border-b border-stone-100 pb-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 px-2 py-0.5 rounded-sm bg-amber-50 border border-amber-200/50">
                {GROUP_LABELS[config.group]}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2 flex items-center gap-2.5">
                <ActiveIcon className="w-6 h-6 text-amber-800 shrink-0" />
                <span>{config.title}</span>
              </h2>
              <p className="text-sm font-serif italic text-amber-900/80 mt-1">{config.subtitle}</p>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">{config.description}</p>
            </div>

            {/* CHURCH BANK DETAILS (for bookings that take a payment) */}
            {config.receipt !== 'none' && (
              <div className="bg-linear-to-br from-amber-900 via-amber-950 to-stone-900 rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
                <Church className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 pointer-events-none" />

                <div className="flex items-center space-x-3 border-b border-amber-800/80 pb-3 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-amber-400/60 shadow-xs shrink-0">
                    <img src="/st-anthony.jpg" alt="St. Anthony of Padua" className="w-full h-full object-cover object-top" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                      Official Parish Account
                    </span>
                    <h3 className="font-serif font-bold text-lg sm:text-xl">{bankDetails.bankName}</h3>
                  </div>
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
                      <span className="font-mono font-bold text-xl tracking-widest text-white">
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
                  ℹ️ {config.receipt === 'optional'
                    ? config.receiptHelp
                    : section === 'payments' || !bankDetails.note
                      ? "Please transfer from your banking app, take a screenshot of the receipt, and upload it below."
                      : bankDetails.note}
                </p>
              </div>
            )}

            {errorMessage && (
              <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Your details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="booking-name" className={labelClass}>Your Full Name *</label>
                <input
                  id="booking-name"
                  type="text"
                  required
                  value={parishionerName}
                  onChange={(e) => setParishionerName(e.target.value)}
                  placeholder="e.g. Bro. Augustine Adeleke"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="booking-phone" className={labelClass}>Phone Number (WhatsApp) *</label>
                <input
                  id="booking-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +234 803 000 0000"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="booking-email" className={labelClass}>Email Address (Optional)</label>
                <input
                  id="booking-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parishioner@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Booking-specific details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
              <div>
                <label htmlFor="booking-date" className={labelClass}>{config.dateLabel} *</label>
                <input
                  id="booking-date"
                  type="date"
                  required
                  min={config.pastDate ? undefined : today}
                  max={config.pastDate ? today : undefined}
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              {config.fields.map(field => (
                <FieldInput
                  key={`${bookingType}-${field.name}`}
                  field={field}
                  today={today}
                  value={values[field.name] ?? ''}
                  onChange={value => setValues(prev => ({ ...prev, [field.name]: value }))}
                />
              ))}
            </div>

            {/* RECEIPT UPLOAD */}
            {config.receipt !== 'none' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider">
                  Upload Bank Transfer Receipt {config.receipt === 'required' ? '*' : '(Optional)'}
                </label>
                <p className="text-xs text-stone-500">
                  Attach a screenshot or photo of your payment to the parish account above.
                </p>

                {!receiptFile ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-stone-300 hover:border-amber-700 bg-stone-50 hover:bg-amber-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all group"
                  >
                    <UploadCloud className="w-10 h-10 text-stone-400 group-hover:text-amber-800 mx-auto mb-2 transition-colors" />
                    <p className="text-xs sm:text-sm font-semibold text-stone-700 group-hover:text-amber-900">
                      Tap to choose your transfer receipt
                    </p>
                    <p className="text-[11px] text-stone-400 mt-1">
                      Supports PNG, JPG, JPEG, WebP (Max 5MB)
                    </p>
                  </button>
                ) : (
                  <div className="relative rounded-2xl border border-stone-200 bg-stone-50 p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      {receiptPreview && (
                        <img
                          src={receiptPreview}
                          alt="Uploaded transfer receipt"
                          className="w-14 h-14 object-cover rounded-lg border border-stone-200 shrink-0"
                        />
                      )}
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
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
                  <span>{config.submitLabel}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION MODAL */}
      {successBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="booking-success-title" className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {text.received}
              </span>
              <h3 id="booking-success-title" className="font-serif font-bold text-2xl text-stone-900 mt-2">
                Praise be to God!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Your {getBookingConfig(successBooking.type).title.toLowerCase()} {text.sent}.
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <span className="text-stone-500">Reference Code:</span>
                <span className="font-mono font-bold text-sm text-amber-900">{successBooking.referenceCode}</span>
              </div>
              <div className="flex justify-between items-center gap-3">
                <span className="text-stone-500">Parishioner:</span>
                <span className="font-semibold text-stone-800 text-right">{successBooking.parishionerName}</span>
              </div>
              <div className="flex justify-between items-center gap-3">
                <span className="text-stone-500">{getBookingConfig(successBooking.type).dateLabel}:</span>
                <span className="font-semibold text-stone-800">{successBooking.requestedDate}</span>
              </div>
              {successBooking.details?.amount && (
                <div className="flex justify-between items-center gap-3">
                  <span className="text-stone-500">Amount:</span>
                  <span className="font-semibold text-stone-800">
                    {formatBookingValue(successBooking.type, 'amount', successBooking.details.amount)}
                  </span>
                </div>
              )}
              {successBooking.massTime && (
                <div className="flex justify-between items-center gap-3">
                  <span className="text-stone-500">Time:</span>
                  <span className="font-semibold text-stone-800 text-right">{successBooking.massTime}</span>
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
              {getBookingConfig(successBooking.type).nextSteps}
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
