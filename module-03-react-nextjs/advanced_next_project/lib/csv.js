// CSV the way spreadsheets expect it (RFC 4180). The rules that matter for awkward values:
//   1. A cell with a comma, a double quote or a line break goes inside double quotes.
//   2. Inside those quotes, every double quote is written twice.
// So   Gate 2, blue door   →   "Gate 2, blue door"     (one cell, not two)
// and  Tigist "Titi"       →   "Tigist ""Titi"""
// Rows end in CRLF.
const NEEDS_QUOTES = /[",\r\n]/;
// Spreadsheets run a cell that starts with one of these as a formula. Prefixing an apostrophe
// shows it as the text that was typed.
const LOOKS_LIKE_FORMULA = /^[=+\-@\t\r]/;

export function csvCell(value) {
  if (value == null) return '';
  if (typeof value === 'number') return String(value);
  let text = String(value);
  if (LOOKS_LIKE_FORMULA.test(text)) text = `'${text}`;
  return NEEDS_QUOTES.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

// columns: [{ header, cell: (row) => value }]
export function toCsv(columns, rows) {
  const header = columns.map((column) => csvCell(column.header)).join(',');
  const body = rows.map((row) => columns.map((column) => csvCell(column.cell(row))).join(','));
  return [header, ...body].join('\r\n') + '\r\n';
}
