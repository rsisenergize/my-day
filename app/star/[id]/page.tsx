'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase, UtensilsCrossed, Landmark, Sparkles, Star, Moon } from 'lucide-react';
import { nakshatras } from '@/data/nakshatras';
import { predictions } from '@/data/predictions';
import { getPredictionIndex, formatDateEN } from '@/lib/predictionEngine';
import StarField from '@/components/StarField';
import DayQualityBadge from '@/components/DayQualityBadge';
import Toast from '@/components/Toast';

const features = [
  { key: 'work', icon: Briefcase, labelEn: 'Work & Career', labelTm: 'வேலை & தொழில்' },
  { key: 'food', icon: UtensilsCrossed, labelEn: 'Food Guide', labelTm: 'உணவு வழிகாட்டி' },
  { key: 'temple', icon: Landmark, labelEn: 'Temple to Visit', labelTm: 'கோயில் தரிசனம்' },
  { key: 'god', icon: Sparkles, labelEn: 'God to Pray', labelTm: 'வழிபட வேண்டிய கடவுள்' },
  { key: 'lucky', icon: Star, labelEn: 'Lucky Details', labelTm: 'அதிர்ஷ்ட விவரங்கள்' },
  { key: 'about', icon: Moon, labelEn: 'About This Star', labelTm: 'இந்த நட்சத்திரம் பற்றி' },
];

export default function StarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isMounted, setIsMounted] = useState(false);

  const starId = parseInt(id);
  const star = nakshatras.find(n => n.id === starId);

  useEffect(() => {
    setIsMounted(true);
    const savedDate = localStorage.getItem('myDay_selectedDate');
    if (savedDate) {
      setSelectedDate(new Date(savedDate + 'T00:00:00'));
    }
  }, []);

  const handleSetBirthStar = useCallback(() => {
    if (star) {
      localStorage.setItem('myDay_birthStar', String(star.id));
      setShowToast(true);
    }
  }, [star]);

  if (!isMounted) return <div className="min-h-dvh bg-[#080b18]"></div>;
  if (!star) return <div className="min-h-dvh flex items-center justify-center text-[#a8afd4] bg-[#080b18]">Star not found</div>;

  const predIndex = getPredictionIndex(star.id - 1, selectedDate);
  const pred = predictions.find(p => p.id === predIndex);

  return (
    <div className="min-h-dvh relative page-enter bg-background">
      <StarField />
      <div className="relative z-10 px-6 pt-16 pb-12 safe-top safe-bottom">
        {/* Header */}
        <div className="relative flex items-center justify-center mb-8 min-h-[44px]">
          <button
            onClick={() => router.back()}
            className="absolute left-0 w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card-hover transition-colors shadow-sm z-10"
          >
            <ArrowLeft size={20} className="text-text-secondary" />
          </button>
          <div className="text-center px-12 w-full">
            <h1 className="text-3xl font-bold font-(--font-heading) text-foreground tracking-wide truncate">{star.nameEn}</h1>
            <p className="text-base font-(--font-tamil) text-text-secondary tracking-wide truncate mt-0.5">{star.nameTm}</p>
          </div>
        </div>

        {/* Date Pill & Actions */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <span className="px-5 py-2 rounded-full bg-card border border-border text-sm text-text-secondary font-medium tracking-wide shadow-sm">
            {formatDateEN(selectedDate)}
          </span>
          <button
            onClick={handleSetBirthStar}
            className="px-5 py-2 rounded-full border border-secondary text-sm text-secondary hover:bg-secondary/10 transition-colors shadow-sm flex items-center gap-2"
          >
            <Star size={14} className="fill-secondary" />
            Set as my birth star
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Prediction Preview Card (Now in Grid) */}
          {pred && (
            <button
              onClick={() => router.push(`/star/${star.id}/prediction`)}
              className="card-enter glow-card p-6 flex flex-col items-center text-center gap-2 min-h-[140px] justify-center hover:scale-[1.02] transition-transform"
            >
              <div className="flex flex-col items-center gap-0.5 mb-2">
                <span className="text-[13px] font-semibold tracking-wide text-foreground">Daily Prediction</span>
                <span className="text-[8px] text-border tracking-tighter leading-none">|</span>
                <span className="text-[11px] font-(--font-tamil) tracking-wide text-text-secondary opacity-80">தினசரி பலன்</span>
              </div>
              <div className="scale-90 origin-center -mb-2 mt-1">
                <DayQualityBadge qualityWord={pred.qualityWord} qualityType={pred.qualityType} />
              </div>
            </button>
          )}
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.key}
                onClick={() => router.push(`/star/${star.id}/${feature.key}`)}
                className="card-enter glow-card p-6 flex flex-col items-center text-center gap-3 min-h-[140px] justify-center hover:scale-[1.02] transition-transform"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-card-hover border border-border flex items-center justify-center mb-1">
                  <Icon size={22} className="text-primary opacity-90" />
                </div>
                <p className="text-sm font-semibold tracking-wide text-foreground">{feature.labelEn}</p>
                <p className="text-xs font-(--font-tamil) tracking-wide text-text-secondary opacity-80">{feature.labelTm}</p>
              </button>
            );
          })}
        </div>
      </div>

      {showToast && <Toast message="✨ Birth star saved!" onClose={() => setShowToast(false)} />}
    </div>
  );
}
