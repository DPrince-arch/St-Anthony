import 'server-only';
import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import { getLiturgicalReadingsForDate } from './liturgicalData';
import { Announcement, ParishSettings, PublicSettings } from './types';

// Single server-side data layer: parish settings and announcements live in
// JSON files under /data; bookings live in Supabase (see supabase.ts);
// liturgical readings come from public APIs (see liturgicalData.ts).

const DATA_DIR = path.join(process.cwd(), 'data');
const ANNOUNCEMENTS_FILE = path.join(DATA_DIR, 'announcements.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

const defaultSettings: ParishSettings = {
  churchName: "St. Anthony Catholic Church",
  parishAddress: "AIT Road, Alagbado, Lagos",
  parishPriest: "Rev. Fr. Vincent Chukwujekwu",
  contactPhone: "08065625941",
  contactEmail: "saccalagbado.com",
  bankDetails: {
    bankName: "Zenith Bank Plc",
    accountName: "St. Anthony Catholic Church - Mass Stipend",
    accountNumber: "1018892341",
    note: "Please include your surname as the transfer narration/reference and upload your receipt below."
  },
  massSchedule: [
    { day: "Sunday", times: ["06:30 AM", "09:00 AM", "06:30 PM (Only on last sundays of the month)"] },
    { day: "Monday", times: ["06:30 AM", "06:30 PM"] },
    { day: "Teusday", times: ["06:30 AM"] },
    { day: "Wednesday", times: ["06:30 PM"] },
    { day: "Thursday", times: ["06:30 AM, Followed by Adoration"] },
    { day: "Friday:", times: ["06:30 AM"] },
    { day: "Saturday", times: ["07:00 AM (Memorial of B.V.M)"] }
  ],
  confessionSchedule: "Saturdays after 7:00 AM Mass",
  officeHours: "Monday, Tuesday, Wednesday, Friday: 8:00 AM - 3:00 PM",
  priestOfficeHours: "Monday, Wednesday, Friday: 10:00 AM - 3:00 PM",
  adminPasscode: "anthony2027" // Default admin passcode, can be changed in admin settings
};

// Reads a JSON file, creating it with the fallback value if it doesn't exist yet.
function readJson<T>(file: string, fallback: T): T {
  if (!fs.existsSync(file)) {
    writeJson(file, fallback);
    return fallback;
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return fallback;
  }
}

function writeJson(file: string, value: unknown) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2), 'utf-8');
}

// Settings

function getSettings(): ParishSettings {
  return readJson(SETTINGS_FILE, defaultSettings);
}

function withoutPasscode(settings: ParishSettings): PublicSettings {
  const publicSettings: Partial<ParishSettings> = { ...settings };
  delete publicSettings.adminPasscode;
  return publicSettings as PublicSettings;
}

export function getPublicSettings(): PublicSettings {
  return withoutPasscode(getSettings());
}

export function updateSettings(changes: Partial<PublicSettings>): PublicSettings {
  const updated = { ...getSettings(), ...changes };
  writeJson(SETTINGS_FILE, updated);
  return withoutPasscode(updated);
}

export function isAdminPasscode(passcode: unknown): boolean {
  return typeof passcode === 'string' && passcode !== '' && passcode === getSettings().adminPasscode;
}

/** True when the request carries `Authorization: Bearer <admin passcode>`. */
export function isAdminRequest(request: Request): boolean {
  const authorization = request.headers.get('authorization');
  return isAdminPasscode(authorization?.startsWith('Bearer ') ? authorization.slice(7) : '');
}

// Announcements

export function getAnnouncements(): Announcement[] {
  return readJson<Announcement[]>(ANNOUNCEMENTS_FILE, []);
}

export function createAnnouncement(announcement: Omit<Announcement, 'id' | 'publishedAt'>): Announcement {
  const created: Announcement = {
    ...announcement,
    id: `ann-${Date.now()}`,
    publishedAt: new Date().toISOString()
  };
  writeJson(ANNOUNCEMENTS_FILE, [created, ...getAnnouncements()]);
  return created;
}

export function deleteAnnouncement(id: string): boolean {
  const list = getAnnouncements();
  const remaining = list.filter(a => a.id !== id);
  if (remaining.length === list.length) return false;
  writeJson(ANNOUNCEMENTS_FILE, remaining);
  return true;
}

// Liturgical readings

/** Readings (or an error message) for a date. Cached across requests (see liturgicalData.ts) and deduped within a request. */
export const getReadings = cache(getLiturgicalReadingsForDate);
