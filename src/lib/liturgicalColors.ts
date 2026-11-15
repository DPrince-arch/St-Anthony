import { LiturgicalColor } from './types';

export const LITURGICAL_COLORS: Record<LiturgicalColor, { name: string; bg: string; text: string; hex: string }> = {
  green: { name: 'Green', bg: 'bg-emerald-700', text: 'text-emerald-100', hex: '#047857' },
  violet: { name: 'Violet', bg: 'bg-purple-800', text: 'text-purple-100', hex: '#6b21a8' },
  white: { name: 'White / Gold', bg: 'bg-amber-600', text: 'text-amber-50', hex: '#d97706' },
  red: { name: 'Red', bg: 'bg-rose-700', text: 'text-rose-100', hex: '#be123c' },
  rose: { name: 'Rose', bg: 'bg-pink-600', text: 'text-pink-100', hex: '#db2777' }
};
