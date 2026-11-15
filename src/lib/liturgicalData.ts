import 'server-only';
import { DailyLiturgicalReadings, LiturgicalColor } from './types';
import { LITURGICAL_COLORS } from './liturgicalColors';

const CALENDAR_API = 'https://litcal.johnromanodorazio.com/api/v5/calendar';
const READINGS_API = 'https://cpbjr.github.io/catholic-readings-api';
const LECTIONARY_METADATA_API = 'https://raw.githubusercontent.com/montanojd/catholic-missal/main';
const SCRIPTURE_API = 'https://bible-api.com';
const SCRIPTURE_TRANSLATION = 'web';
const DATA_REVALIDATE_SECONDS = 60 * 60 * 24;

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
    `${SCRIPTURE_API}/${encodeURIComponent(normalizedReference)}?translation=${SCRIPTURE_TRANSLATION}`,
    { next: { revalidate: DATA_REVALIDATE_SECONDS } }
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
  const response = await fetch(metadataUrl, {
    next: { revalidate: DATA_REVALIDATE_SECONDS }
  });
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

export async function getLiturgicalReadingsForDate(dateStr?: string): Promise<DailyLiturgicalReadings> {
  const date = dateStr ?? new Date().toISOString().slice(0, 10);
  if (!isValidIsoDate(date)) throw new Error('Date must be a valid ISO date in YYYY-MM-DD format.');

  const [calendarResponse, readingsResponse] = await Promise.all([
    fetch(`${CALENDAR_API}?year=${date.slice(0, 4)}&locale=en_US`, {
      next: { revalidate: DATA_REVALIDATE_SECONDS }
    }),
    fetch(`${READINGS_API}/readings/${date.slice(0, 4)}/${date.slice(5)}.json`, {
      next: { revalidate: DATA_REVALIDATE_SECONDS }
    })
  ]);

  if (!calendarResponse.ok) {
    throw new Error(`Liturgical calendar service returned HTTP ${calendarResponse.status}.`);
  }
  if (!readingsResponse.ok) {
    throw new Error(`Daily readings service returned HTTP ${readingsResponse.status}.`);
  }

  const [calendarData, readingsData] = await Promise.all([
    calendarResponse.json() as Promise<CalendarResponse>,
    readingsResponse.json() as Promise<ReadingsResponse>
  ]);

  const dayEvents = calendarData.litcal?.filter(event =>
    event.date?.slice(0, 10) === date && !event.is_vigil_mass && !event.name.toLowerCase().includes('vigil mass')
  ) ?? [];
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
