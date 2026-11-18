/**
 * Every kind of booking and payment the parish accepts, described as data.
 * Shared by the forms (what to ask), the API (what to validate and store)
 * and the admin panel (how to label what was submitted).
 *
 * Payments (tithe, levies, donations, offerings) are stored and verified exactly like
 * bookings: a record with a bank-transfer receipt that the parish office approves.
 * They are shown on their own page, /payments.
 */

import { todayInParish } from './dates';

export const BOOKING_TYPES = [
  'mass_intention',
  'thanksgiving',
  'birthday_mass',
  'requiem_mass',
  'wedding_mass',
  'funeral',
  'wake_keep',
  'harvest_thanksgiving',
  'priest_appointment',
  'tithe',
  'harvest_levy',
  'donation',
  'offering',
] as const;

export type BookingType = (typeof BOOKING_TYPES)[number];

/** Which page a booking type appears on. */
export type BookingSection = 'bookings' | 'payments';

export type BookingGroup = 'masses' | 'rites' | 'offerings' | 'pastoral' | 'dues' | 'giving';

export const BOOKING_GROUPS: { id: BookingGroup; label: string; section: BookingSection }[] = [
  { id: 'masses', label: 'Masses', section: 'bookings' },
  { id: 'rites', label: 'Weddings & Funerals', section: 'bookings' },
  { id: 'offerings', label: 'Offerings', section: 'bookings' },
  { id: 'pastoral', label: 'Pastoral', section: 'bookings' },
  { id: 'dues', label: 'Tithes & Levies', section: 'payments' },
  { id: 'giving', label: 'Donations & Offerings', section: 'payments' },
];

export function sectionOfGroup(group: BookingGroup): BookingSection {
  return BOOKING_GROUPS.find(g => g.id === group)!.section;
}

/** Booking fields stored in their own database columns. Any other field name goes into `details`. */
export const CORE_FIELDS = [
  'intentionType',
  'intentionFor',
  'massTime',
  'appointmentReason',
  'preferredTimeSlot',
  'notes',
] as const;

export type CoreField = (typeof CORE_FIELDS)[number];

export function isCoreField(name: string): name is CoreField {
  return (CORE_FIELDS as readonly string[]).includes(name);
}

export interface BookingField {
  /** A core column name (see CORE_FIELDS) or a key in the booking's `details`. */
  name: string;
  label: string;
  kind: 'text' | 'textarea' | 'select' | 'date' | 'time' | 'month' | 'amount' | 'massSchedule';
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  /** Span both columns of the form grid. */
  full?: boolean;
  /** For date fields: the date must not be in the future (e.g. date of death). */
  pastOnly?: boolean;
}

export interface BookingTypeConfig {
  id: BookingType;
  group: BookingGroup;
  title: string;
  subtitle: string;
  description: string;
  /** Whether a bank-transfer receipt must, may, or need not be attached. */
  receipt: 'required' | 'optional' | 'none';
  receiptHelp?: string;
  dateLabel: string;
  /** The date is when something already happened (e.g. a payment), so it is today or earlier. */
  pastDate?: boolean;
  fields: BookingField[];
  submitLabel: string;
  referencePrefix: string;
  /** Shown after a successful submission. */
  nextSteps: string;
}

export const MASS_SCHEDULE_OPTIONS = [
  'Sunday, 06:30 AM',
  'Sunday, 09:00 AM',
  'Sunday, 06:30 PM (Only on last Sundays of the month)',
  'Monday, 06:30 AM',
  'Monday, 06:30 PM',
  'Tuesday, 06:30 AM',
  'Wednesday, 06:30 PM',
  'Thursday, 06:30 AM (Followed by Adoration)',
  'Friday, 06:30 AM',
  'Saturday, 07:00 AM (Memorial of B.V.M)',
].map(value => ({ value, label: value }));

const INTENTION_TYPE_OPTIONS = [
  { value: 'thanksgiving', label: 'Thanksgiving for God’s Blessings' },
  { value: 'repose_soul', label: 'Repose of the Soul (RIP / Departed)' },
  { value: 'birthday', label: 'Birthday Thanksgiving' },
  { value: 'healing', label: 'Divine Healing & Quick Recovery' },
  { value: 'anniversary', label: 'Wedding / Ordination Anniversary' },
  { value: 'special_intention', label: 'Special / Private Intention' },
];

/** "2026-11" → "November 2026". */
export function monthLabel(yyyyMm: string): string {
  const [year, month] = yyyyMm.split('-').map(Number);
  if (!year || !month) return yyyyMm;
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Choices for a 'month' field, newest first: two months ahead back to a year ago. Value is YYYY-MM. */
export function monthOptions(today: string): { value: string; label: string }[] {
  const [year, month] = today.split('-').map(Number);
  return Array.from({ length: 15 }, (_, i) => {
    const value = new Date(Date.UTC(year, month - 1 + 2 - i, 1)).toISOString().slice(0, 7);
    return { value, label: monthLabel(value) };
  });
}

/** This year, last year and next year (newest first), for annual levies. */
function recentYearOptions(): { value: string; label: string }[] {
  const year = Number(todayInParish().slice(0, 4));
  return [year + 1, year, year - 1].map(y => ({ value: String(y), label: String(y) }));
}

const notesField = (placeholder: string): BookingField => ({
  name: 'notes',
  label: 'Additional Notes (Optional)',
  kind: 'textarea',
  placeholder,
  full: true,
});

const deceasedName: BookingField = {
  name: 'deceasedName',
  label: 'Full Name of the Deceased',
  kind: 'text',
  required: true,
  placeholder: 'e.g. Late Mr. Joseph Chukwuemeka Okafor',
  full: true,
};

const dateOfDeath: BookingField = {
  name: 'dateOfDeath',
  label: 'Date of Death',
  kind: 'date',
  pastOnly: true,
};

const RITES_RECEIPT_HELP =
  'If you have already paid the required fee or deposit, attach the receipt. Otherwise the parish office will contact you with the details.';

export const BOOKING_CATALOG: BookingTypeConfig[] = [
  {
    id: 'mass_intention',
    group: 'masses',
    title: 'Mass Intention',
    subtitle: 'Have a Mass offered for your intention',
    description: 'Submit your Mass intention to be offered at the Altar of God by the parish priest.',
    receipt: 'required',
    dateLabel: 'Requested Date',
    fields: [
      { name: 'intentionType', label: 'Type of Intention', kind: 'select', required: true, options: INTENTION_TYPE_OPTIONS },
      { name: 'massTime', label: 'Preferred Mass', kind: 'massSchedule', required: true },
      {
        name: 'intentionFor',
        label: 'Intention Details (To be announced at Mass)',
        kind: 'textarea',
        required: true,
        full: true,
        placeholder: 'e.g. For the repose of the soul of late Mrs. Mary Okafor (RIP)...',
      },
    ],
    submitLabel: 'Confirm & Submit Mass Intention',
    referencePrefix: 'STA-MASS',
    nextSteps:
      'The parish secretary will confirm your stipend and include your intention on Father’s altar list.',
  },
  {
    id: 'thanksgiving',
    group: 'masses',
    title: 'Thanksgiving',
    subtitle: 'Family blessings, anniversaries & special favours',
    description: 'Give thanks to God for His benevolence, family blessings and anniversaries.',
    receipt: 'required',
    dateLabel: 'Requested Date',
    fields: [
      { name: 'intentionType', label: 'Occasion', kind: 'select', required: true, options: INTENTION_TYPE_OPTIONS },
      { name: 'massTime', label: 'Preferred Mass', kind: 'massSchedule', required: true },
      {
        name: 'intentionFor',
        label: 'Thanksgiving Intention (To be announced at Mass)',
        kind: 'textarea',
        required: true,
        full: true,
        placeholder: 'e.g. In thanksgiving to God Almighty for the safe delivery of a baby boy to the Adeleke family...',
      },
    ],
    submitLabel: 'Submit Thanksgiving Booking',
    referencePrefix: 'STA-THX',
    nextSteps:
      'The parish secretary will confirm your offering and include your thanksgiving on Father’s altar list.',
  },
  {
    id: 'birthday_mass',
    group: 'masses',
    title: 'Birthday Mass',
    subtitle: 'Thank God for another year of life',
    description:
      'Book a Mass in thanksgiving for a birthday. The celebrant’s name will be announced and prayed for at the Mass.',
    receipt: 'required',
    dateLabel: 'Requested Date',
    fields: [
      { name: 'celebrantName', label: 'Name of the Celebrant', kind: 'text', required: true, placeholder: 'e.g. Miss Chiamaka Grace Eze' },
      { name: 'age', label: 'Age Being Celebrated (Optional)', kind: 'text', placeholder: 'e.g. 50th birthday' },
      { name: 'massTime', label: 'Preferred Mass', kind: 'massSchedule', required: true, full: true },
      {
        name: 'intentionFor',
        label: 'Prayer Intention (To be announced at Mass)',
        kind: 'textarea',
        required: true,
        full: true,
        placeholder: 'e.g. In thanksgiving for her 50th birthday, for good health, protection and God’s continued blessings...',
      },
    ],
    submitLabel: 'Submit Birthday Mass Booking',
    referencePrefix: 'STA-BDAY',
    nextSteps: 'The parish secretary will confirm your stipend and add the birthday intention to the altar list.',
  },
  {
    id: 'requiem_mass',
    group: 'masses',
    title: 'Requiem Mass',
    subtitle: 'Mass for the repose of a departed soul',
    description:
      'Request a Requiem Mass for a loved one who has died: for a memorial, an anniversary of death, or as part of funeral rites.',
    receipt: 'required',
    dateLabel: 'Requested Date',
    fields: [
      deceasedName,
      dateOfDeath,
      {
        name: 'massTime',
        label: 'Preferred Mass',
        kind: 'select',
        required: true,
        options: [
          ...MASS_SCHEDULE_OPTIONS,
          { value: 'Special Requiem Mass (time to be agreed)', label: 'Special Requiem Mass (time to be agreed with the parish office)' },
        ],
      },
      {
        name: 'intentionFor',
        label: 'Intention (Optional)',
        kind: 'textarea',
        full: true,
        placeholder: 'e.g. 1st anniversary of death. Eternal rest grant unto him, O Lord...',
      },
    ],
    submitLabel: 'Submit Requiem Mass Request',
    referencePrefix: 'STA-REQ',
    nextSteps:
      'The parish secretary will confirm your stipend. For a special Requiem Mass, the office will contact you to agree a time.',
  },
  {
    id: 'wedding_mass',
    group: 'rites',
    title: 'Wedding Mass',
    subtitle: 'Holy Matrimony celebrated in the parish',
    description:
      'Request a date for your Nuptial Mass. Submitting this form does not confirm the date: the parish office will contact you about marriage preparation, documents and the publication of banns.',
    receipt: 'optional',
    receiptHelp: RITES_RECEIPT_HELP,
    dateLabel: 'Preferred Wedding Date',
    fields: [
      { name: 'groomName', label: 'Groom’s Full Name', kind: 'text', required: true, placeholder: 'e.g. Mr. Emmanuel Tunde Bello' },
      { name: 'brideName', label: 'Bride’s Full Name', kind: 'text', required: true, placeholder: 'e.g. Miss Blessing Ngozi Udeh' },
      { name: 'massTime', label: 'Preferred Time', kind: 'time', required: true },
      {
        name: 'parishOfPartner',
        label: 'Parish of the Other Partner (Optional)',
        kind: 'text',
        placeholder: 'If one partner belongs to another parish',
      },
      notesField('e.g. Expected number of guests, officiating priest, or other requests...'),
    ],
    submitLabel: 'Submit Wedding Mass Request',
    referencePrefix: 'STA-WED',
    nextSteps:
      'The parish office will contact you to begin marriage preparation and confirm the date. Your date is not reserved until then.',
  },
  {
    id: 'funeral',
    group: 'rites',
    title: 'Funeral',
    subtitle: 'Christian burial and funeral rites',
    description:
      'Notify the parish of a death and request funeral rites. Our condolences: the parish office will contact the family to arrange the details with the priest.',
    receipt: 'optional',
    receiptHelp: RITES_RECEIPT_HELP,
    dateLabel: 'Preferred Funeral Date',
    fields: [
      deceasedName,
      dateOfDeath,
      { name: 'massTime', label: 'Preferred Time', kind: 'time', required: true },
      {
        name: 'burialPlace',
        label: 'Place of Interment',
        kind: 'text',
        required: true,
        placeholder: 'e.g. Vaults & Gardens, Ikoyi / family compound, Enugu',
        full: true,
      },
      {
        name: 'relationship',
        label: 'Your Relationship to the Deceased',
        kind: 'text',
        required: true,
        placeholder: 'e.g. Son',
      },
      {
        name: 'society',
        label: 'Parish Society of the Deceased (Optional)',
        kind: 'text',
        placeholder: 'e.g. CWO, CMO, Legion of Mary',
      },
      notesField('Any other details the priest should know...'),
    ],
    submitLabel: 'Submit Funeral Request',
    referencePrefix: 'STA-FUN',
    nextSteps: 'The parish office will contact the family to confirm the funeral arrangements with the priest.',
  },
  {
    id: 'wake_keep',
    group: 'rites',
    title: 'Wake Keep',
    subtitle: 'Vigil prayers for the deceased',
    description:
      'Request a priest or parish society to lead the wake keep (vigil) prayers on the eve of the funeral.',
    receipt: 'optional',
    receiptHelp: RITES_RECEIPT_HELP,
    dateLabel: 'Date of Wake Keep',
    fields: [
      deceasedName,
      { name: 'massTime', label: 'Start Time', kind: 'time', required: true },
      {
        name: 'venue',
        label: 'Venue Address',
        kind: 'text',
        required: true,
        placeholder: 'e.g. 12 Adeola Street, Surulere, Lagos',
        full: true,
      },
      notesField('e.g. Societies to be invited, hymns requested, directions to the venue...'),
    ],
    submitLabel: 'Submit Wake Keep Request',
    referencePrefix: 'STA-WAKE',
    nextSteps: 'The parish office will contact you to confirm who will lead the wake keep prayers.',
  },
  {
    id: 'harvest_thanksgiving',
    group: 'offerings',
    title: 'Harvest Thanksgiving',
    subtitle: 'Bring your harvest offering to the Lord',
    description:
      'Register your family, society or organisation for the parish Harvest Thanksgiving, so your offering can be recognised and prayed for.',
    receipt: 'optional',
    receiptHelp: 'If you have already paid by transfer, attach the receipt. You may also bring your offering on the day.',
    dateLabel: 'Harvest Date',
    fields: [
      {
        name: 'harvestCategory',
        label: 'Giving As',
        kind: 'select',
        required: true,
        options: [
          { value: 'Family', label: 'Family' },
          { value: 'Individual', label: 'Individual' },
          { value: 'Society / Association', label: 'Parish Society / Association' },
          { value: 'Company / Organisation', label: 'Company / Organisation' },
        ],
      },
      { name: 'groupName', label: 'Family / Group Name', kind: 'text', required: true, placeholder: 'e.g. The Adeyemi Family' },
      { name: 'amount', label: 'Offering Amount (₦, Optional)', kind: 'amount', placeholder: 'e.g. 50000' },
      {
        name: 'intentionFor',
        label: 'Thanksgiving Intention (Optional)',
        kind: 'textarea',
        full: true,
        placeholder: 'e.g. In thanksgiving for God’s blessings on our family this year...',
      },
    ],
    submitLabel: 'Register Harvest Offering',
    referencePrefix: 'STA-HARV',
    nextSteps: 'The parish office will record your harvest offering. May God reward your generosity.',
  },
  {
    id: 'priest_appointment',
    group: 'pastoral',
    title: 'Priest Appointment',
    subtitle: 'Confession, counseling & spiritual direction',
    description: 'Request a spiritual direction, counseling or confession session with our parish priests.',
    receipt: 'none',
    dateLabel: 'Preferred Date',
    fields: [
      {
        name: 'appointmentReason',
        label: 'Reason for Appointment',
        kind: 'select',
        required: true,
        options: [
          { value: 'spiritual_direction', label: 'Spiritual Direction & Guidance' },
          { value: 'confession', label: 'Sacrament of Reconciliation (Confession)' },
          { value: 'counseling', label: 'Family / Marriage / Personal Counseling' },
          { value: 'sick_call', label: 'Sick Call / Anointing of the Sick' },
          { value: 'other', label: 'Other Pastoral Consultation' },
        ],
      },
      {
        name: 'preferredTimeSlot',
        label: 'Preferred Time Slot',
        kind: 'select',
        required: true,
        options: [
          { value: '09:00 AM - 10:00 AM', label: '09:00 AM - 10:00 AM (Morning Office)' },
          { value: '10:00 AM - 11:00 AM', label: '10:00 AM - 11:00 AM' },
          { value: '11:30 AM - 12:30 PM', label: '11:30 AM - 12:30 PM' },
          { value: '04:00 PM - 05:00 PM', label: '04:00 PM - 05:00 PM (Afternoon Office)' },
          { value: '05:00 PM - 06:00 PM', label: '05:00 PM - 06:00 PM' },
        ],
      },
      {
        name: 'notes',
        label: 'Additional Notes / Confidential Details (Optional)',
        kind: 'textarea',
        full: true,
        placeholder: 'Share any brief context or let Father know if this is an urgent pastoral emergency...',
      },
    ],
    submitLabel: 'Request Appointment with Priest',
    referencePrefix: 'STA-PRIEST',
    nextSteps: 'The parish office will contact you to confirm the appointment with Father.',
  },

  // ---------------------------------------------------------------------------
  // Payments (shown on /payments)
  // ---------------------------------------------------------------------------
  {
    id: 'tithe',
    group: 'dues',
    title: 'Tithe',
    subtitle: 'Give a tenth to the Lord',
    description:
      'Paid your tithe by bank transfer? Record it here with your receipt so the parish office can update your tithe record.',
    receipt: 'required',
    dateLabel: 'Date of Payment',
    pastDate: true,
    fields: [
      { name: 'amount', label: 'Amount Paid (₦)', kind: 'amount', required: true, placeholder: 'e.g. 10000' },
      { name: 'paymentPeriod', label: 'Tithe for the Month of', kind: 'month', required: true },
      { name: 'titheCardNo', label: 'Tithe Card Number (Optional)', kind: 'text', placeholder: 'If you have one', full: true },
    ],
    submitLabel: 'Record Tithe Payment',
    referencePrefix: 'STA-TITHE',
    nextSteps: 'The parish office will verify your transfer and update your tithe record. God loves a cheerful giver.',
  },
  {
    id: 'harvest_levy',
    group: 'dues',
    title: 'Harvest Levy',
    subtitle: 'Your annual harvest levy',
    description:
      'Record your harvest levy payment for the year, as an individual, a family or a parish society.',
    receipt: 'required',
    dateLabel: 'Date of Payment',
    pastDate: true,
    fields: [
      { name: 'amount', label: 'Amount Paid (₦)', kind: 'amount', required: true, placeholder: 'e.g. 20000' },
      { name: 'levyYear', label: 'Levy for the Year', kind: 'select', required: true, options: recentYearOptions() },
      {
        name: 'payingAs',
        label: 'Paying As',
        kind: 'select',
        required: true,
        options: [
          { value: 'Individual', label: 'Individual' },
          { value: 'Family', label: 'Family' },
          { value: 'Society / Association', label: 'Parish Society / Association' },
        ],
      },
      { name: 'groupName', label: 'Family / Society Name (Optional)', kind: 'text', placeholder: 'e.g. The Adeyemi Family' },
    ],
    submitLabel: 'Record Harvest Levy',
    referencePrefix: 'STA-LEVY',
    nextSteps: 'The parish office will verify your transfer and record your harvest levy. God bless you.',
  },
  {
    id: 'donation',
    group: 'giving',
    title: 'Donation',
    subtitle: 'Support the work of the parish',
    description:
      'Make a free-will donation to the parish. Choose what you would like your gift to support.',
    receipt: 'required',
    dateLabel: 'Date of Payment',
    pastDate: true,
    fields: [
      { name: 'amount', label: 'Amount Donated (₦)', kind: 'amount', required: true, placeholder: 'e.g. 5000' },
      {
        name: 'purpose',
        label: 'Donation Towards',
        kind: 'select',
        required: true,
        options: [
          { value: 'General Parish Needs', label: 'General Parish Needs (where most needed)' },
          { value: 'Church Building & Maintenance', label: 'Church Building & Maintenance' },
          { value: 'Charity & Welfare', label: 'Charity & Welfare (the poor and the sick)' },
          { value: 'Vocations & Seminarians', label: 'Vocations & Seminarians' },
          { value: 'Other', label: 'Other (please say in the notes)' },
        ],
      },
      {
        name: 'dedication',
        label: 'In Memory / Honour of (Optional)',
        kind: 'text',
        placeholder: 'e.g. In loving memory of late Mrs. Grace Okonkwo',
        full: true,
      },
      notesField('Anything else the parish office should know about your gift...'),
    ],
    submitLabel: 'Record Donation',
    referencePrefix: 'STA-DON',
    nextSteps: 'The parish office will verify your transfer. Thank you for your generosity. May God reward you abundantly.',
  },
  {
    id: 'offering',
    group: 'giving',
    title: 'Offering',
    subtitle: 'Sunday, special & second collections',
    description:
      'Could not make it to church, or prefer to give by transfer? Record your offering here.',
    receipt: 'required',
    dateLabel: 'Date of Payment',
    pastDate: true,
    fields: [
      { name: 'amount', label: 'Amount (₦)', kind: 'amount', required: true, placeholder: 'e.g. 2000' },
      {
        name: 'offeringType',
        label: 'Type of Offering',
        kind: 'select',
        required: true,
        options: [
          { value: 'Sunday Offering', label: 'Sunday Offering' },
          { value: 'Second Collection', label: 'Second Collection' },
          { value: 'Special Collection', label: 'Special Collection / Appeal' },
          { value: 'Thanksgiving Offering', label: 'Thanksgiving Offering' },
          { value: 'Other', label: 'Other (please say in the notes)' },
        ],
      },
      notesField('e.g. Offering for Sunday 15th November...'),
    ],
    submitLabel: 'Record Offering',
    referencePrefix: 'STA-OFF',
    nextSteps: 'The parish office will verify your transfer. God loves a cheerful giver.',
  },
];

export function catalogForSection(section: BookingSection): BookingTypeConfig[] {
  return BOOKING_CATALOG.filter(config => sectionOfGroup(config.group) === section);
}

export function getBookingConfig(type: BookingType): BookingTypeConfig {
  // BOOKING_CATALOG has an entry for every BookingType.
  return BOOKING_CATALOG.find(config => config.id === type)!;
}

export function isBookingType(value: unknown): value is BookingType {
  return typeof value === 'string' && (BOOKING_TYPES as readonly string[]).includes(value);
}

/** Display a stored value: amounts with ₦, choices by their label. */
export function formatBookingValue(type: BookingType, key: string, value: string): string {
  const field = getBookingConfig(type).fields.find(f => f.name === key);
  if (field?.kind === 'amount') return `₦${Number(value).toLocaleString('en-NG')}`;
  if (field?.kind === 'month') return monthLabel(value);
  return field?.options?.find(o => o.value === value)?.label ?? value;
}

/** The line read out at Mass for this booking, including who it is for. */
export function altarIntentionText(booking: {
  type: BookingType;
  intentionFor?: string;
  details?: Record<string, string>;
}): string {
  const d = booking.details ?? {};
  const prefix =
    booking.type === 'requiem_mass' && d.deceasedName
      ? `Requiem Mass for the repose of the soul of ${d.deceasedName}.`
      : booking.type === 'birthday_mass' && d.celebrantName
        ? `Birthday thanksgiving for ${d.celebrantName}${d.age ? ` (${d.age})` : ''}.`
        : '';
  return [prefix, booking.intentionFor].filter(Boolean).join(' ');
}

/** Label for a stored detail key, e.g. "deceasedName" → "Full Name of the Deceased". */
export function detailLabel(type: BookingType, key: string): string {
  const field = getBookingConfig(type).fields.find(f => f.name === key);
  return field?.label.replace(/\s*\((Optional|₦, Optional)\)$/, '') ?? key;
}
