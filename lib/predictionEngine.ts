const REFERENCE_DATE = new Date('2026-03-19');
const TOTAL = 27;

export function getPredictionIndex(starIndex: number, selectedDate: Date): number {
  // starIndex is 0-based (Star 1 = 0, Star 27 = 26)
  // Returns prediction index 1–27
  const msPerDay = 1000 * 60 * 60 * 24;
  const dateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
  const refOnly = new Date(REFERENCE_DATE.getFullYear(), REFERENCE_DATE.getMonth(), REFERENCE_DATE.getDate());
  const dayOffset = Math.round((dateOnly.getTime() - refOnly.getTime()) / msPerDay);

  const raw = ((25 - starIndex + dayOffset) % TOTAL + TOTAL) % TOTAL;
  return raw + 1; // Returns 1 to 27
}

export function formatDateEN(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Tamil month calculation (approximate)
const tamilMonths = [
  'சித்திரை', 'வைகாசி', 'ஆனி', 'ஆடி',
  'ஆவணி', 'புரட்டாசி', 'ஐப்பசி', 'கார்த்திகை',
  'மார்கழி', 'தை', 'மாசி', 'பங்குனி',
];

export function formatDateTM(date: Date): string {
  // Approximate Tamil date
  const month = date.getMonth();
  // Tamil months start roughly mid-April (April 14)
  // Map: Apr 14 = Chithirai 1
  const tamilMonthIndex = (month + 9) % 12; // rough mapping
  const day = date.getDate();
  const year = date.getFullYear() - 1;
  return `${tamilMonths[tamilMonthIndex]} ${day}, ${year}`;
}
