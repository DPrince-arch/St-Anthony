import 'server-only';
import { cacheLife } from 'next/cache';
import { DailyLiturgicalReadings, LiturgicalColor } from './types';
import { LITURGICAL_COLORS } from './liturgicalColors';

const CALENDAR_API = 'https://litcal.johnromanodorazio.com/api/v5/calendar';
const READINGS_API = 'https://cpbjr.github.io/catholic-readings-api';
const LECTIONARY_METADATA_API = 'https://raw.githubusercontent.com/montanojd/catholic-missal/main';
const SCRIPTURE_API = 'https://bible-api.com';
const SCRIPTURE_TRANSLATION = 'web';

interface CalendarEvent {
  date: string;
  name: string;
  color?: string[];
  grade_lcl?: string;
  grade?: number;
  liturgical_season_lcl?: string;
  readings?: {
    first_reading?: unknown;
    responsorial_psalm?: unknown;
    second_reading?: unknown;
    gospel_acclamation?: unknown;
    gospel?: unknown;
  };
  is_vigil_mass?: boolean;
}

interface CalendarResponse {
  litcal?: CalendarEvent[];
}

interface ReadingsResponse {
  date?: string;
  readings?: {
    firstReading?: string;
    psalm?: string;
    secondReading?: string;
    gospelAcclamation?: string;
    gospel?: string;
  };
  usccbLink?: string;
}

interface ScriptureResponse {
  text?: string;
  verses?: { text: string }[];
  translation_name?: string;
}

interface AcclamationMetadata {
  daily_readings?: Record<string, {
    daily_readings?: Record<string, {
      readings?: {
        gospel_acclamation?: {
          citation?: string;
        };
      };
    }>;
  }>;
}

const VALID_COLORS: Record<string, LiturgicalColor> = {
  green: 'green',
  violet: 'violet',
  purple: 'violet',
  white: 'white',
  red: 'red',
  rose: 'rose',
  pink: 'rose'
};

export function isValidIsoDate(date: string): boolean {
  const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00Z`) : null;
  return Boolean(parsedDate && !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === date);
}

function mapRank(event: CalendarEvent): DailyLiturgicalReadings['rank'] {
  const grade = (event.grade_lcl ?? '').toLowerCase();
  if (grade.includes('solemnity') || event.grade === 6 || event.grade === 7) return 'Solemnity';
  if (grade.includes('feast') || event.grade === 4 || event.grade === 5) return 'Feast';
  if (grade.includes('optional memorial') || event.grade === 2) return 'Optional Memorial';
  if (grade.includes('memorial') || event.grade === 3) return 'Memorial';
  return 'Weekday';
}

function mapSeason(label: string | undefined): DailyLiturgicalReadings['season'] {
  const season = (label ?? '').toLowerCase();
  if (season.includes('advent')) return 'Advent';
  if (season.includes('christmas')) return 'Christmas';
  if (season.includes('lent')) return 'Lent';
  if (season.includes('easter')) return 'Easter';
  if (season.includes('ordinary')) return 'Ordinary Time';
  throw new Error('The calendar API returned an unsupported liturgical season.');
}

function mapColor(colors: string[] | undefined): LiturgicalColor {
  const color = colors?.map(value => VALID_COLORS[value.toLowerCase()]).find(Boolean);
  if (!color) throw new Error('The calendar API did not return a supported liturgical color.');
  return color;
}

function makeReading(citation: string, text: string) {
  return { citation, text };
}

function getCitation(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

async function fetchScripturePart(reference: string): Promise<ScriptureResponse> {
  const normalizedReference = reference
    .replace(/\u00a0/g, ' ')
    .replace(/[–—]/g, '-')
    .replace(/:\s+/g, ':')
    .replace(/(?<=\d)[a-z]/gi, '')
    .replace(/\s+and\s+/gi, ',')
    .replace(/^cf\.?\s*/i, '')
    .trim();
  const response = await fetch(
    `${SCRIPTURE_API}/${encodeURIComponent(normalizedReference)}?translation=${SCRIPTURE_TRANSLATION}`
  );
  if (!response.ok) {
    throw new Error(`Scripture text service could not resolve "${normalizedReference}" (HTTP ${response.status}).`);
  }

  const scripture = await response.json() as ScriptureResponse;
  if (!scripture.text?.trim() || scripture.translation_name !== 'World English Bible') {
    throw new Error(`Scripture text service returned no World English Bible text for "${normalizedReference}".`);
  }
  return scripture;
}

async function fetchScripture(citation: string): Promise<{ text: string; verses: string[] }> {
  const alternatives = citation.split(/\s+or\s+/i).map(option => option.trim()).filter(Boolean);
  const passages = await Promise.all(alternatives.map(async alternative => {
    const parts = alternative.split(';').map(part => part.trim()).filter(Boolean);
    const expandedParts = parts.map((part, index) => {
      if (index === 0 || !/^\d+:\d/.test(part)) return part;
      const previousBook = parts[index - 1].match(/^((?:[1-3]\s+)?[A-Za-z][A-Za-z\s]*?)\s+\d+:/)?.[1];
      return previousBook ? `${previousBook} ${part}` : part;
    });
    const results = await Promise.all(expandedParts.map(fetchScripturePart));
    return {
      text: results.map(result => result.text?.trim()).filter(Boolean).join('\n\n'),
      verses: results.flatMap(result => result.verses?.map(verse => verse.text.trim()).filter(Boolean) ?? [])
    };
  }));
  return {
    text: passages.map((passage, index) =>
      passages.length > 1 ? `Alternative ${index + 1}:\n${passage.text}` : passage.text
    ).join('\n\n'),
    verses: passages.flatMap(passage => passage.verses)
  };
}

async function fetchAcclamationCitation(date: string): Promise<string> {
  const dateParts = date.split('-');
  const month = Number(dateParts[1]);
  const monthName = new Date(Date.UTC(Number(dateParts[0]), month - 1, 1))
    .toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })
    .toLowerCase();
  const metadataUrl = `${LECTIONARY_METADATA_API}/${dateParts[0]}_${dateParts[1]}_${monthName}.json`;
  const response = await fetch(metadataUrl);
  if (!response.ok) {
    throw new Error(`Lectionary metadata service returned HTTP ${response.status} for ${date}.`);
  }

  const metadata = await response.json() as AcclamationMetadata;
  const rawCitation = metadata.daily_readings?.[date]?.daily_readings?.[date]?.readings?.gospel_acclamation?.citation;
  if (!rawCitation) return '';

  return rawCitation
    .replace(/^\s*(?:alleluia|gospel acclamation)\s*/i, '')
    .replace(/^\s*(?:see|cf\.?)\s*/i, '')
    .trim();
}

// The whole year's calendar (~0.5 MB) is the slowest call, so it is cached on its own
// and shared by every date in that year. Only the fields we use are kept.
// Failures are returned (not thrown) so the real message survives the cache boundary.
async function fetchCalendarEvents(year: string): Promise<{ events: CalendarEvent[] } | { error: string }> {
  'use cache';
  try {
    const response = await fetch(`${CALENDAR_API}?year=${year}&locale=en_US`);
    if (!response.ok) throw new Error(`Liturgical calendar service returned HTTP ${response.status}.`);
    const calendar = await response.json() as CalendarResponse;
    cacheLife('days');
    return {
      events: (calendar.litcal ?? []).map(({ date, name, color, grade_lcl, grade, liturgical_season_lcl, readings, is_vigil_mass }) =>
        ({ date, name, color, grade_lcl, grade, liturgical_season_lcl, readings, is_vigil_mass })
      )
    };
  } catch (error) {
    cacheLife('seconds');
    return { error: errorMessage(error) };
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load liturgical readings.';
}

async function fetchDailyReadings(date: string): Promise<ReadingsResponse> {
  const response = await fetch(`${READINGS_API}/readings/${date.slice(0, 4)}/${date.slice(5)}.json`);
  if (!response.ok) {
    throw new Error(`Daily readings service returned HTTP ${response.status}.`);
  }
  return response.json() as Promise<ReadingsResponse>;
}

export type ReadingsResult =
  | { readings: DailyLiturgicalReadings; error: null }
  | { readings: null; error: string };

/**
 * Full readings for a YYYY-MM-DD date. Successful results are cached for a day per date;
 * failures for only a few seconds, so the next request retries.
 */
export async function getLiturgicalReadingsForDate(date: string): Promise<ReadingsResult> {
  'use cache';
  try {
    const readings = await buildReadings(date);
    cacheLife('days');
    return { readings, error: null };
  } catch (error) {
    console.error(`Failed to load liturgical readings for ${date}:`, error);
    cacheLife('seconds');
    return { readings: null, error: errorMessage(error) };
  }
}

async function buildReadings(date: string): Promise<DailyLiturgicalReadings> {
  if (!isValidIsoDate(date)) throw new Error('Date must be a valid ISO date in YYYY-MM-DD format.');

  const [calendar, readingsData] = await Promise.all([
    fetchCalendarEvents(date.slice(0, 4)),
    fetchDailyReadings(date)
  ]);
  if ('error' in calendar) throw new Error(calendar.error);
  const calendarEvents = calendar.events;

  const dayEvents = calendarEvents.filter(event =>
    event.date?.slice(0, 10) === date && !event.is_vigil_mass && !event.name.toLowerCase().includes('vigil mass')
  );
  const event = dayEvents.sort((left, right) => (right.grade ?? 0) - (left.grade ?? 0))[0];
  if (!event) throw new Error(`No Roman calendar event was returned for ${date}.`);
  if (readingsData.date !== date || !readingsData.readings) {
    throw new Error(`Daily readings service returned no readings for ${date}.`);
  }

  const usccbUrl = new URL(readingsData.usccbLink ?? '');
  if (usccbUrl.protocol !== 'https:' || usccbUrl.hostname !== 'bible.usccb.org') {
    throw new Error('Daily readings service returned an invalid USCCB source link.');
  }

  const calendarReadings = event.readings ?? {};
  const providedReadings = readingsData.readings;
  const citation = (apiCitation: string | undefined, calendarCitation: unknown) =>
    apiCitation?.trim() || getCitation(calendarCitation);
  const firstReading = citation(providedReadings.firstReading, calendarReadings.first_reading);
  const psalm = citation(providedReadings.psalm, calendarReadings.responsorial_psalm);
  const secondReading = citation(providedReadings.secondReading, calendarReadings.second_reading);
  let acclamation = citation(providedReadings.gospelAcclamation, calendarReadings.gospel_acclamation);
  const gospel = citation(providedReadings.gospel, calendarReadings.gospel);
  const color = mapColor(event.color);

  if (!firstReading || !psalm || !gospel) {
    throw new Error(`Daily readings service returned incomplete reading references for ${date}.`);
  }

  if (!acclamation) {
    try {
      acclamation = await fetchAcclamationCitation(date);
    } catch (error) {
      console.error(`Unable to resolve Gospel Acclamation citation for ${date}:`, error);
    }
  }

  const [firstReadingText, psalmText, secondReadingText, acclamationText, gospelText] = await Promise.all([
    fetchScripture(firstReading),
    fetchScripture(psalm),
    secondReading ? fetchScripture(secondReading) : undefined,
    acclamation ? fetchScripture(acclamation) : undefined,
    fetchScripture(gospel)
  ]);
  const season = mapSeason(event.liturgical_season_lcl);

  return {
    date,
    dayOfWeek: new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }),
    celebrationTitle: event.name,
    otherCelebrations: dayEvents.filter(calendarEvent => calendarEvent !== event).map(calendarEvent => calendarEvent.name),
    season,
    color,
    colorHex: LITURGICAL_COLORS[color].hex,
    rank: mapRank(event),
    readings: {
      firstReading: makeReading(firstReading, firstReadingText.text),
      psalm: {
        citation: psalm,
        response: '',
        verses: psalmText.verses
      },
      secondReading: secondReading && secondReadingText ? makeReading(secondReading, secondReadingText.text) : undefined,
      gospelAcclamation: {
        verse: acclamationText?.text ?? '',
        citation: acclamation,
        response: season === 'Lent'
          ? 'Praise to you, Lord Jesus Christ.'
          : 'Alleluia, alleluia.'
      },
      gospel: makeReading(gospel, gospelText.text)
    },
    dataSource: {
      calendarName: 'General Roman Calendar (community API)',
      calendarUrl: 'https://litcal.johnromanodorazio.com/',
      readingsName: 'Daily readings citations (USCCB-linked)',
      readingsUrl: usccbUrl.toString(),
      translationName: 'World English Bible (public domain)',
      isNigeriaSpecific: false
    }
  };
}
