// The one place Addis Eats turns numbers and dates into text. Menu prices, cart totals, the
// kitchen board, the reports and the CSV export all call these, so they can't drift apart.
// Safe on the server and in the browser. Times are pinned to Addis Ababa, so the HTML from the
// server and the hydrated page always print the same thing, wherever either one runs.
export const TIME_ZONE = 'Africa/Addis_Ababa';

const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const short = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

// The way the menu has always written prices: the number, then "ETB". The non-breaking space
// keeps "ETB" on the same line as its number.
//   etb(1235)                    → "1,235 ETB"
//   etb(12300, { compact: true }) → "12.3K ETB"   (chart axis ticks)
export const etb = (amount, { compact = false } = {}) =>
  `${(compact ? short : whole).format(Number(amount) || 0)} ETB`;

const zoned = (options) => new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, ...options });

const FORMATS = {
  full: zoned({ weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), // "Tue 13 Oct, 14:05"
  time: zoned({ hour: '2-digit', minute: '2-digit' }), // "14:05"
  day: zoned({ day: 'numeric', month: 'short' }), // "13 Oct"
  dayYear: zoned({ day: 'numeric', month: 'short', year: 'numeric' }), // "13 Oct 2026"
  // The Addis Ababa calendar day as "2026-10-13", for grouping orders by day.
  key: new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }),
  // "2026-10-13 14:05": what a spreadsheet recognises as a date and time.
  sheet: new Intl.DateTimeFormat('sv-SE', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }),
};

// when(date) → "Tue 13 Oct, 14:05". when(date, 'time') → "14:05". Other formats: see FORMATS.
export const when = (date, format = 'full') => FORMATS[format].format(new Date(date));

const words = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

// relative(date, now) → "4 minutes ago", "in 2 minutes", "yesterday". Pass the same `now` on the
// server and the client (the live stream sends the server's) and both print the same words.
export function relative(date, now = Date.now()) {
  const seconds = (new Date(date) - new Date(now)) / 1000;
  const size = Math.abs(seconds);
  if (size < 45) return seconds > 0 ? 'any moment now' : 'just now';
  if (size < 3600) return words.format(Math.round(seconds / 60), 'minute');
  if (size < 86_400) return words.format(Math.round(seconds / 3600), 'hour');
  return words.format(Math.round(seconds / 86_400), 'day');
}
