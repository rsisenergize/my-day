'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronRight } from 'lucide-react';
import { nakshatras } from '@/data/nakshatras';
import { predictions } from '@/data/predictions';
import { getPredictionIndex, formatDateEN, formatDateTM } from '@/lib/predictionEngine';
import StarField from '@/components/StarField';
import DayQualityBadge from '@/components/DayQualityBadge';
import { useLanguage } from '@/components/LanguageProvider';

export default function HomePage() {
  const router = useRouter();
  const [birthStar, setBirthStar] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateChanged, setDateChanged] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('myDay_birthStar');
    if (saved) setBirthStar(parseInt(saved));
  }, []);

  if (!isMounted) return <div className="min-h-dvh bg-background"></div>;

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
        <div className="text-center mb-8 flex flex-col items-center">
          <h1 className="text-4xl font-bold font-heading text-foreground tracking-wider mb-8 drop-shadow-sm">My Day Astro</h1>
          <div className="flex flex-col items-center gap-4 relative group w-full">
            <span className="text-xl font-bold text-foreground tracking-wide">{formatDateEN(selectedDate)}</span>
            <span className="text-xl font-bold text-foreground font-tamil tracking-wide">{formatDateTM(selectedDate)}</span>
            <input
              type="date"
              value={dateInputValue}
              onChange={handleDateChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
          </div>
        </div>

        {/* Instruction */}
        <div className="text-center mt-10 mb-10 flex flex-col gap-2">
          {language === 'en' ? (
            <span className="text-lg font-bold uppercase tracking-widest text-foreground block">Select your birth star</span>
          ) : (
            <span className="text-xl font-bold font-tamil text-foreground tracking-wide block">உங்கள் நட்சத்திரத்தை தேர்வு செய்க</span>
          )}
        </div>

        {/* Star List */}
        <div className="grid gap-4 smooth-scroll">
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
                className={`row-enter w-full glow-card px-6 py-5 flex items-center justify-between text-left select-none relative overflow-hidden ${isBirthStar ? 'birth-star-card' : ''}`}
                style={{ animationDelay: `${index * 20}ms` }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-primary w-6 text-center shrink-0">{star.id}</span>
                  <span className={language === 'en' ? "text-xl font-bold font-heading text-foreground" : "text-xl font-bold font-tamil text-foreground"}>
                    {language === 'en' ? star.nameEn : star.nameTm}
                  </span>
                </div>
                {pred && (
                  <span className={language === 'en' ? "text-sm font-bold font-heading text-primary bg-primary/10 px-4 py-1.5 rounded-full whitespace-nowrap" : "text-[15px] font-bold font-tamil text-primary bg-primary/10 px-4 py-1.5 rounded-full whitespace-nowrap"}>
                    {pred.qualityWord}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
