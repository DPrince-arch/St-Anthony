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

export interface Prayer {
  id: string;
  title: string;
  category: 'rosary' | 'litany' | 'devotion' | 'stations' | 'mass';
  subtitle?: string;
  description?: string;
  content?: string;
  verses?: LitanyVerse[];
  mysteries?: RosaryMysteryGroup[];
}

export type BookingType = 'mass_intention' | 'thanksgiving' | 'priest_appointment';
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
  adminPasscode: string;
}

/** Settings as exposed to pages and the browser: everything except the admin passcode. */
export type PublicSettings = Omit<ParishSettings, 'adminPasscode'>;
