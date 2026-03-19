'use client';

export default function DayQualityBadge({ qualityWord, qualityType }: { qualityWord: string; qualityType: 'good' | 'average' | 'careful' }) {
  const colorMap = {
    good: { bg: 'rgba(120, 232, 184, 0.15)', text: '#78e8b8', dot: '#78e8b8' },
    average: { bg: 'rgba(232, 201, 122, 0.15)', text: '#e8c97a', dot: '#e8c97a' },
    careful: { bg: 'rgba(232, 120, 120, 0.15)', text: '#e87878', dot: '#e87878' },
  };

  const colors = colorMap[qualityType];

  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
      style={{ background: colors.bg, color: colors.text }}
    >
      <span className="w-2 h-2 rounded-full" style={{ background: colors.dot }} />
      {qualityWord}
    </span>
  );
}
