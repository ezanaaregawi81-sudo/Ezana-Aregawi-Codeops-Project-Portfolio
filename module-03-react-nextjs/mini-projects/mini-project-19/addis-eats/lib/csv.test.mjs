// npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { csvCell, toCsv } from './csv.js';

// Reads CSV back into cells, independently of csv.js, the way a spreadsheet opening the file would.
function readCsv(text) {
  const rows = [[]];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') inQuotes = false;
      else cell += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') {
      rows.at(-1).push(cell);
      cell = '';
    } else if (c === '\r' && text[i + 1] === '\n') {
      rows.at(-1).push(cell);
      rows.push([]);
      cell = '';
      i++;
    } else cell += c;
  }
  rows.pop();
  return rows;
}

const columns = [
  { header: 'Customer', cell: (r) => r.name },
  { header: 'Notes', cell: (r) => r.notes },
  { header: 'Total (ETB)', cell: (r) => r.total },
];

test('a comma stays inside one cell', () => {
  assert.equal(csvCell('Gate 2, blue door'), '"Gate 2, blue door"');
  const rows = readCsv(toCsv(columns, [{ name: 'Selam', notes: 'Gate 2, blue door', total: 627 }]));
  assert.deepEqual(rows[1], ['Selam', 'Gate 2, blue door', '627']);
});

test('a quotation mark is doubled and survives the round trip', () => {
  assert.equal(csvCell('Tigist "Titi" Alemu'), '"Tigist ""Titi"" Alemu"');
  const rows = readCsv(toCsv(columns, [{ name: 'Tigist "Titi" Alemu', notes: '', total: 1010 }]));
  assert.deepEqual(rows[1], ['Tigist "Titi" Alemu', '', '1010']);
});

test('both at once, plus a line break', () => {
  const notes = 'Call "Dawit", not the office,\nthen wait at the gate';
  const rows = readCsv(toCsv(columns, [{ name: 'Dawit', notes, total: 0 }]));
  assert.equal(rows.length, 2);
  assert.deepEqual(rows[1], ['Dawit', notes, '0']);
});

test('formula-looking text comes out as text, numbers stay numbers', () => {
  assert.equal(csvCell('=SUM(A1:A9)'), "'=SUM(A1:A9)");
  assert.equal(csvCell('-cash only'), "'-cash only");
  assert.equal(csvCell(-5), '-5');
});
