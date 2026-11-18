export type LiturgicalColor = 'green' | 'violet' | 'white' | 'red' | 'rose';

export interface ReadingItem {
  citation: string;
  text: string;
}

export interface PsalmItem {
  citation: string;
  response: string;
  verses: string[];
}

export interface DailyLiturgicalReadings {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  celebrationTitle: string;
  season: 'Advent' | 'Christmas' | 'Lent' | 'Easter' | 'Ordinary Time';
  color: LiturgicalColor;
  colorHex: string;
  rank: 'Solemnity' | 'Feast' | 'Memorial' | 'Optional Memorial' | 'Weekday';
  otherCelebrations?: string[];
  saintOfTheDay?: string;
  saintSummary?: string;
  readings: {
    firstReading: ReadingItem;
    psalm: PsalmItem;
    secondReading?: ReadingItem;
    gospelAcclamation: {
      verse: string;
      citation: string;
      response: string;
    };
    gospel: ReadingItem;
  };
  dataSource?: {
    calendarName: string;
    calendarUrl: string;
    readingsName: string;
    readingsUrl: string;
    translationName: string;
    isNigeriaSpecific: boolean;
  };
  dailyReflection?: {
    author: string;
    text: string;
  };
}

export interface PrayerMysteryDecade {
  number: number;
  title: string;
  scripture: string;
  fruit: string;
}

export interface RosaryMysteryGroup {
  name: string;
  days: string[];
  decades: PrayerMysteryDecade[];
}

export interface LitanyVerse {
  call: string;
  response: string;
}

export type PrayerCategory = 'rosary' | 'litany' | 'devotion' | 'stations' | 'mass' | 'benediction';

export interface Station {
  number: number;
  title: string;
  /** Scripture reference to read or recall at this station. */
  scripture: string;
  reading: string;
  prayer1: string;
  prayer2: string;
  /** The verse of the Stabat Mater sung while moving to the next station. */
  stabatMater: string;
}

export interface StationsOfTheCross {
  opening: string;
  stations: Station[];
  closing: string;
}

/**
 * One line of a prayer that can be shown in English or Latin.
 * - priest: said by the priest or leader (marked ℣.)
 * - people: the congregation's response (marked ℟.)
 * - all: said by everyone together
 * - rubric: an instruction, always shown in English; `la` is ignored
 */
export interface BilingualLine {
  role: 'priest' | 'people' | 'all' | 'rubric';
  en: string;
  la?: string;
}

export interface BilingualSection {
  title: string;
  titleLatin: string;
  lines: BilingualLine[];
}

export interface Prayer {
  id: string;
  title: string;
  category: PrayerCategory;
  subtitle?: string;
  description?: string;
  content?: string;
  verses?: LitanyVerse[];
  mysteries?: RosaryMysteryGroup[];
  stations?: StationsOfTheCross;
  /** Prayers with this set get an English / Latin toggle. */
  bilingual?: BilingualSection[];
}

import type { BookingType } from './bookingCatalog';
export type { BookingType };
export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface Booking {
  id: string;
  referenceCode: string;
  type: BookingType;
  parishionerName: string;
  email: string;
  phone: string;
  // Specific to Mass Intention / Thanksgiving
  intentionType?: 'thanksgiving' | 'repose_soul' | 'birthday' | 'healing' | 'anniversary' | 'special_intention';
  intentionFor?: string;
  requestedDate: string;
  massTime?: string;
  // Specific to Priest Appointment
  appointmentReason?: 'spiritual_direction' | 'confession' | 'counseling' | 'sick_call' | 'other';
  preferredTimeSlot?: string;
  notes?: string;
  /** Type-specific answers (e.g. deceasedName, brideName, amount), keyed by catalog field name. */
  details?: Record<string, string>;
  hasReceipt?: boolean;
  receiptUploadedAt?: string;
  // Admin fields
  status: BookingStatus;
  adminNotes?: string;
  createdAt: string;
}

export interface BookingPagination {
  page: number;
  pageSize: number;
  total: number;
  pages: number;
  statusCounts: Record<BookingStatus, number>;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'urgent' | 'liturgy' | 'society' | 'general';
  content: string;
  isPinned: boolean;
  publishedAt: string;
  expiryDate?: string;
  author: string;
}

export interface ParishSettings {
  churchName: string;
  parishAddress: string;
  parishPriest: string;
  contactPhone: string;
  contactEmail: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    note?: string;
  };
  massSchedule: {
    day: string;
    times: string[];
  }[];
  confessionSchedule: string;
  officeHours: string;
  priestOfficeHours: string;
  adminPasscode: string;
}

/** Settings as exposed to pages and the browser: everything except the admin passcode. */
export type PublicSettings = Omit<ParishSettings, 'adminPasscode'>;
