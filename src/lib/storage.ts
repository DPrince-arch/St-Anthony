import fs from 'fs';
import path from 'path';
import { Announcement, ParishSettings } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

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
  parishPriest: "Rev. Fr. Vincent Chukwujekwu",
  contactPhone: "+234 803 123 4567",
  contactEmail: "office@stanthonyparish.org",
  bankDetails: {
    bankName: "Zenith Bank Plc",
    accountName: "St. Anthony Catholic Church - Mass Stipend",
    accountNumber: "1018892341",
    note: "Please include your surname as the transfer narration/reference and upload your receipt below."
  },
  massSchedule: [
     { day: "Sunday", times: ["06:30 AM", "09:00 AM", "06:30 PM (Only on last sundays of the month)"] },
    { day: "Monday", times: ["06:30 AM", "06:30 PM"] },
    { day: "Teusday", times: ["06:30 AM"]},
    { day: "Wednesday", times: ["06:30 PM"]},
    { day: "Thursday", times: ["06:30 AM, Followed by Adoration"]},
    { day: "Friday:", times: ["06:30 AM"]},
    { day: "Saturday", times: ["07:00 AM (Memorial of B.V.M)"] }
  ],
  confessionSchedule: "Saturdays after 7:00 AM Mass",
  officeHours: "Monday - Friday: 9:00 AM - 4:00 PM",
  adminPasscode: "anthony2027" // Default admin passcode, can be changed in admin settings
};

// No default announcements — parish staff add real ones via the Admin panel
const defaultAnnouncements: Announcement[] = [];

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

  deleteAnnouncement(id: string): boolean {
    const list = this.getAnnouncements();
    const filtered = list.filter(a => a.id !== id);
    if (filtered.length === list.length) return false;
    fs.writeFileSync(ANNOUNCEMENTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
};
