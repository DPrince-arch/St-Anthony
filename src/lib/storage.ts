import fs from 'fs';
import path from 'path';
import { Booking, Announcement, ParishSettings } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const ANNOUNCEMENTS_FILE = path.join(DATA_DIR, 'announcements.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Initial Default Settings
const defaultSettings: ParishSettings = {
  churchName: "St. Anthony Catholic Church",
  parishAddress: "124 St. Anthony Way, Archdiocese of Lagos / Abuja / London",
  parishPriest: "Rev. Fr. Emmanuel Anthony, SDB",
  assistantPriest: "Rev. Fr. Jude Mary, OCD",
  contactPhone: "+234 803 123 4567",
  contactEmail: "office@stanthonyparish.org",
  bankDetails: {
    bankName: "Zenith Bank Plc",
    accountName: "St. Anthony Catholic Church - Mass Stipend",
    accountNumber: "1018892341",
    note: "Please include your surname as the transfer narration/reference and upload your receipt below."
  },
  massSchedule: [
    { day: "Sunday", times: ["06:30 AM (Dawn Mass)", "08:30 AM (Family Mass)", "10:30 AM (High Mass)", "06:00 PM (Youth Mass)"] },
    { day: "Monday - Friday", times: ["06:30 AM (Morning Mass)", "12:00 PM (Midday Mass)", "06:30 PM (Evening Mass)"] },
    { day: "Saturday", times: ["07:00 AM (Memorial of B.V.M)", "06:00 PM (Sunday Vigil Mass)"] }
  ],
  confessionSchedule: "Saturdays after 7:00 AM Mass, and Wednesdays from 5:00 PM to 6:15 PM.",
  officeHours: "Tuesday - Friday: 9:00 AM - 4:00 PM (Father's Office: Wednesdays & Thursdays by appointment)",
  adminPasscode: "anthony2025" // Default admin passcode, can be changed in admin settings
};

// Initial Sample Announcements
const defaultAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "Solemn Feast of St. Anthony of Padua - 9 Days Novena",
    category: "liturgy",
    content: "The annual Novena in honor of our great patron saint, St. Anthony of Padua, commences this Friday. Each evening begins with Exposition of the Blessed Sacrament at 5:30 PM followed by Rosary, Novena prayers, and Holy Mass. Parishioners are encouraged to submit their petition slips at the parish office.",
    isPinned: true,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Parish Pastoral Council"
  },
  {
    id: "ann-2",
    title: "Notice on Mass Intentions & Stipend Receipts",
    category: "urgent",
    content: "Parishioners booking for Sunday Masses are reminded to book at least 48 hours in advance so the parish secretary can print the intentions for Father's altar list. Please ensure you transfer to the official parish account and upload a clear screenshot of your receipt.",
    isPinned: true,
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Parish Secretariat"
  },
  {
    id: "ann-3",
    title: "Catholic Youth Organization (CYO) General Meeting",
    category: "society",
    content: "All youth and young adults of St. Anthony Parish are invited to the monthly fellowship and planning meeting this Sunday immediately after the 8:30 AM Mass at the Parish Hall. Breakfast will be served.",
    isPinned: false,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    author: "CYO Executive Committee"
  },
  {
    id: "ann-4",
    title: "Society of St. Vincent de Paul - Food & Clothing Drive",
    category: "general",
    content: "The St. Vincent de Paul society will be collecting non-perishable food items, toiletries, and gently used clothing for underprivileged families in our neighborhood. Donations can be dropped off at the SVDP basket by the church foyer.",
    isPinned: false,
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    author: "SSVP President"
  }
];

// Initial Sample Bookings
const defaultBookings: Booking[] = [
  {
    id: "book-1",
    referenceCode: "STA-MASS-8921",
    type: "mass_intention",
    parishionerName: "Mrs. Ngozi Okafor",
    email: "ngozi.okafor@example.com",
    phone: "+234 802 345 6789",
    intentionType: "thanksgiving",
    intentionFor: "Thanksgiving for God's blessings and protection upon the Okafor family on their 20th Wedding Anniversary",
    requestedDate: new Date().toISOString().split('T')[0],
    massTime: "08:30 AM (Family Mass)",
    notes: "Family will be present in church",
    receiptImage: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='40%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%230f172a'>ZENITH BANK TRANSFER RECEIPT</text><text x='50%' y='60%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23059669'>SUCCESSFUL - NGN 5,000</text><text x='50%' y='80%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2364748b'>Ref: TXN-9981240192</text></svg>",
    receiptUploadedAt: new Date().toISOString(),
    status: "approved",
    adminNotes: "Stipend verified. Added to 8:30 AM Sunday Mass intentions sheet.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "book-2",
    referenceCode: "STA-MASS-4412",
    type: "mass_intention",
    parishionerName: "Michael & Clara Davies",
    email: "m.davies@example.com",
    phone: "+234 810 998 1122",
    intentionType: "repose_soul",
    intentionFor: "Repose of the soul of late Pa Joseph Davies (RIP). May his soul and the souls of all faithful departed rest in peace.",
    requestedDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    massTime: "06:30 AM (Morning Mass)",
    notes: "1 year memorial remembrance",
    receiptImage: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='40%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%230f172a'>ONLINE BANK RECEIPT</text><text x='50%' y='60%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23059669'>TRANSFER TO ST ANTHONY - NGN 2,000</text><text x='50%' y='80%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2364748b'>Ref: ZEN-33100293</text></svg>",
    receiptUploadedAt: new Date().toISOString(),
    status: "pending",
    createdAt: new Date().toISOString()
  },
  {
    id: "book-3",
    referenceCode: "STA-PRIEST-1092",
    type: "priest_appointment",
    parishionerName: "Theresa Martins",
    email: "theresa.m@example.com",
    phone: "+234 809 777 8899",
    appointmentReason: "spiritual_direction",
    requestedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    preferredTimeSlot: "11:00 AM - 11:30 AM",
    notes: "Requesting spiritual guidance regarding vocation discernment.",
    status: "pending",
    createdAt: new Date().toISOString()
  }
];

export const StorageService = {
  // Settings
  getSettings(): ParishSettings {
    ensureDataDir();
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), 'utf-8');
      return defaultSettings;
    }
    try {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return defaultSettings;
    }
  },

  updateSettings(newSettings: Partial<ParishSettings>): ParishSettings {
    ensureDataDir();
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  },

  // Announcements
  getAnnouncements(): Announcement[] {
    ensureDataDir();
    if (!fs.existsSync(ANNOUNCEMENTS_FILE)) {
      fs.writeFileSync(ANNOUNCEMENTS_FILE, JSON.stringify(defaultAnnouncements, null, 2), 'utf-8');
      return defaultAnnouncements;
    }
    try {
      const data = fs.readFileSync(ANNOUNCEMENTS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return defaultAnnouncements;
    }
  },

  createAnnouncement(announcement: Omit<Announcement, 'id' | 'publishedAt'>): Announcement {
    const list = this.getAnnouncements();
    const newRecord: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      publishedAt: new Date().toISOString()
    };
    list.unshift(newRecord);
    fs.writeFileSync(ANNOUNCEMENTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return newRecord;
  },

  updateAnnouncement(id: string, updates: Partial<Announcement>): Announcement | null {
    const list = this.getAnnouncements();
    const index = list.findIndex(a => a.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    fs.writeFileSync(ANNOUNCEMENTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return list[index];
  },

  deleteAnnouncement(id: string): boolean {
    const list = this.getAnnouncements();
    const filtered = list.filter(a => a.id !== id);
    if (filtered.length === list.length) return false;
    fs.writeFileSync(ANNOUNCEMENTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  },

  // Bookings
  getBookings(): Booking[] {
    ensureDataDir();
    if (!fs.existsSync(BOOKINGS_FILE)) {
      fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(defaultBookings, null, 2), 'utf-8');
      return defaultBookings;
    }
    try {
      const data = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return defaultBookings;
    }
  },

  createBooking(booking: Omit<Booking, 'id' | 'referenceCode' | 'status' | 'createdAt'>): Booking {
    const list = this.getBookings();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = booking.type === 'mass_intention' ? 'STA-MASS' : booking.type === 'thanksgiving' ? 'STA-THX' : 'STA-PRIEST';
    const referenceCode = `${prefix}-${randomNum}`;
    
    const newBooking: Booking = {
      ...booking,
      id: `book-${Date.now()}`,
      referenceCode,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    list.unshift(newBooking);
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return newBooking;
  },

  updateBookingStatus(id: string, status: Booking['status'], adminNotes?: string): Booking | null {
    const list = this.getBookings();
    const index = list.findIndex(b => b.id === id);
    if (index === -1) return null;
    list[index].status = status;
    if (adminNotes !== undefined) {
      list[index].adminNotes = adminNotes;
    }
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return list[index];
  },

  deleteBooking(id: string): boolean {
    const list = this.getBookings();
    const filtered = list.filter(b => b.id !== id);
    if (filtered.length === list.length) return false;
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
};
