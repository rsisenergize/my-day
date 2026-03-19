'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronRight } from 'lucide-react';
import { nakshatras } from '@/data/nakshatras';
import { predictions } from '@/data/predictions';
import { getPredictionIndex, formatDateEN, formatDateTM } from '@/lib/predictionEngine';
import StarField from '@/components/StarField';
import DayQualityBadge from '@/components/DayQualityBadge';

export default function HomePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [birthStar, setBirthStar] = useState<number | null>(null);
  const [dateChanged, setDateChanged] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('myDay_birthStar');
    if (saved) setBirthStar(parseInt(saved));
  }, []);

  if (!isMounted) return <div className="min-h-dvh bg-[#080b18]"></div>;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value + 'T00:00:00');
    setSelectedDate(newDate);
    setDateChanged(true);
    setTimeout(() => setDateChanged(false), 3000);
  };

  const dateInputValue = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

  return (
    <div className="min-h-dvh relative bg-background">
      <StarField />
      <div className="relative z-10 px-6 pt-16 pb-12 safe-top safe-bottom">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold font-(--font-heading) text-foreground tracking-wider mb-2 drop-shadow-sm">
            My Day
          </h1>
          <p className="text-lg font-(--font-tamil) text-secondary tracking-widest uppercase text-xs opacity-90">
            என் நாள்
          </p>
        </div>

        {/* Date Pill */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full bg-card border border-border shadow-sm ${dateChanged ? 'date-changed' : ''}`}>
            <span className="text-sm font-medium text-text-secondary tracking-wide">{formatDateEN(selectedDate)}</span>
            <span className="text-border">|</span>
            <span className="text-sm text-secondary font-(--font-tamil) tracking-wide">{formatDateTM(selectedDate)}</span>
          </div>
          <label className="relative cursor-pointer group">
            <div className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center group-hover:bg-card-hover transition-colors shadow-sm">
              <Calendar size={20} className="text-primary" />
            </div>
            <input
              type="date"
              value={dateInputValue}
              onChange={handleDateChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>

        {/* Instruction */}
        <div className="text-center mb-8 flex flex-col gap-1">
          <span className="text-sm font-(--font-tamil) text-text-muted tracking-wide">உங்கள் நட்சத்திரத்தை தேர்வு செய்க</span>
          <span className="text-xs uppercase tracking-widest text-text-muted">Select your birth star</span>
        </div>

        {/* Star List */}
        <div className="grid gap-3 smooth-scroll">
          {nakshatras.map((star, index) => {
            const predIndex = getPredictionIndex(star.id - 1, selectedDate);
            const pred = predictions.find(p => p.id === predIndex);
            const isBirthStar = birthStar === star.id;

            return (
              <button
                key={star.id}
                onClick={() => {
                  localStorage.setItem('myDay_selectedDate', dateInputValue);
                  router.push(`/star/${star.id}`);
                }}
                className={`row-enter w-full glow-card px-5 py-4 flex items-center gap-5 text-left select-none ${isBirthStar ? 'birth-star-card' : ''}`}
                style={{ animationDelay: `${index * 20}ms` }}
              >
                {/* Star Number */}
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">{star.id}</span>
                </div>

                {/* Star Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold font-(--font-heading) text-foreground truncate tracking-wide">
                    {star.nameEn}
                  </p>
                  <p className="text-sm font-(--font-tamil) text-text-secondary truncate mt-0.5">
                    {star.nameTm}
                  </p>
                </div>

                {/* Quality Badge */}
                {pred && (
                  <div className="shrink-0 hidden min-[360px]:block">
                    <DayQualityBadge qualityWord={pred.qualityWord} qualityType={pred.qualityType} />
                  </div>
                )}

                {/* Chevron */}
                <ChevronRight size={20} className="text-text-muted shrink-0 ml-1" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
