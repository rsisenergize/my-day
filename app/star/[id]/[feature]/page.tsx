'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { nakshatras } from '@/data/nakshatras';
import { predictions } from '@/data/predictions';
import { getPredictionIndex, formatDateEN } from '@/lib/predictionEngine';
import StarField from '@/components/StarField';
import DayQualityBadge from '@/components/DayQualityBadge';

const featureLabels: Record<string, { en: string; tm: string }> = {
  prediction: { en: 'Daily Prediction', tm: 'தினசரி பலன்' },
  work: { en: 'Work & Career', tm: 'வேலை & தொழில்' },
  food: { en: 'Food Guide', tm: 'உணவு வழிகாட்டி' },
  temple: { en: 'Temple to Visit', tm: 'கோயில் தரிசனம்' },
  god: { en: 'God to Pray', tm: 'வழிபட வேண்டிய கடவுள்' },
  lucky: { en: 'Lucky Details', tm: 'அதிர்ஷ்ட விவரங்கள்' },
  about: { en: 'About This Star', tm: 'இந்த நட்சத்திரம் பற்றி' },
};

export default function FeatureDetailPage({ params }: { params: Promise<{ id: string; feature: string }> }) {
  const { id, feature } = use(params);
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isMounted, setIsMounted] = useState(false);

  const starId = parseInt(id);
  const star = nakshatras.find(n => n.id === starId);
  const label = featureLabels[feature] || { en: feature, tm: '' };

  useEffect(() => {
    setIsMounted(true);
    const savedDate = localStorage.getItem('myDay_selectedDate');
    if (savedDate) setSelectedDate(new Date(savedDate + 'T00:00:00'));
  }, []);

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
          <button onClick={() => router.back()} className="absolute left-0 top-0 w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:bg-card-hover transition-colors z-10 shrink-0">
            <ArrowLeft size={20} className="text-text-secondary" />
          </button>
          <div className="text-center px-12 w-full">
            <h1 className="text-2xl font-bold font-(--font-heading) text-foreground tracking-wide">{label.en}</h1>
            <p className="text-sm font-(--font-tamil) text-text-secondary tracking-wide mt-0.5">{label.tm}</p>
            <div className="mt-3 flex flex-col items-center gap-0.5">
              <p className="text-[11px] uppercase tracking-widest text-text-muted font-bold opacity-80">{star.nameEn}</p>
              <p className="text-[11px] text-text-muted">{formatDateEN(selectedDate)}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {feature === 'prediction' && pred && <PredictionDetail pred={pred} />}
          {feature === 'work' && <WorkDetail star={star} />}
          {feature === 'food' && <FoodDetail star={star} />}
          {feature === 'temple' && <TempleDetail star={star} />}
          {feature === 'god' && <GodDetail star={star} />}
          {feature === 'lucky' && <LuckyDetail star={star} />}
          {feature === 'about' && <AboutDetail star={star} />}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="glow-card p-6 card-enter shadow-sm">{children}</div>;
}

function Divider() {
  return <div className="w-full h-px bg-border my-6 opacity-50" />;
}

function PredictionDetail({ pred }: { pred: (typeof predictions)[0] }) {
  return (
    <SectionCard>
      <div className="mb-6 flex justify-center">
        <DayQualityBadge qualityWord={pred.qualityWord} qualityType={pred.qualityType} />
      </div>
      <p className="text-[17px] font-(--font-heading) text-foreground leading-relaxed mb-5 text-justify">{pred.textEn}</p>
      <p className="text-sm font-(--font-tamil) text-text-secondary leading-relaxed mb-8 text-justify opacity-90">{pred.textTm}</p>
      
      {/* Professional Timing Alignment */}
      <div className="bg-card-hover border border-border rounded-xl p-5 mb-2 shadow-inner">
        <div className="flex items-center gap-2 mb-4 justify-center">
          <span className="text-xs uppercase tracking-widest text-text-muted font-bold">Auspicious Time</span>
          <span className="text-border">|</span>
          <span className="text-xs font-(--font-tamil) text-text-muted">நல்ல நேரம்</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="text-center p-3 rounded-lg bg-background border border-border shadow-sm flex flex-col justify-center">
             <p className="text-xs text-text-muted mb-2 uppercase tracking-widest">English</p>
             <div className="space-y-1.5">
               {pred.goodTimeEn.split(',').map((time, i) => (
                 <p key={i} className="text-sm font-semibold text-good">{time.trim()}</p>
               ))}
             </div>
           </div>
           <div className="text-center p-3 rounded-lg bg-background border border-border shadow-sm flex flex-col justify-center">
             <p className="text-xs text-text-muted mb-2 font-(--font-tamil)">தமிழ்</p>
             <div className="space-y-1.5">
               {pred.goodTimeTm.split(',').map((time, i) => (
                 <p key={i} className="text-sm font-(--font-tamil) text-good opacity-90">{time.trim()}</p>
               ))}
             </div>
           </div>
        </div>
      </div>
    </SectionCard>
  );
}

function WorkDetail({ star }: { star: (typeof nakshatras)[0] }) {
  return (
    <SectionCard>
      <h3 className="text-xl font-(--font-heading) text-foreground mb-5 tracking-wide">Work Tips</h3>
      <ul className="space-y-4 mb-2">
        {star.workEn.map((tip, i) => (
          <li key={i} className="flex gap-4 text-base text-text-secondary leading-relaxed">
            <span className="text-primary mt-1 shrink-0">❖</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
      <Divider />
      <h3 className="text-base font-(--font-tamil) text-secondary mb-4 tracking-wide">வேலை குறிப்புகள்</h3>
      <ul className="space-y-4">
        {star.workTm.map((tip, i) => (
          <li key={i} className="flex gap-4 text-[15px] font-(--font-tamil) text-text-secondary leading-relaxed opacity-90">
            <span className="text-primary mt-1 shrink-0">❖</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

function FoodDetail({ star }: { star: (typeof nakshatras)[0] }) {
  return (
    <>
      <SectionCard>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-good text-xl">✓</span>
          <h3 className="text-lg font-(--font-heading) text-good tracking-wide">Foods to Eat</h3>
          <span className="text-border ml-1 mr-1">|</span>
          <h3 className="text-sm font-(--font-tamil) text-good opacity-80">சாப்பிட வேண்டியவை</h3>
        </div>
        <ul className="space-y-3 mb-4">
          {star.foodEatEn.map((f, i) => (
            <li key={i} className="text-base text-text-secondary leading-relaxed">• {f}</li>
          ))}
        </ul>
        <ul className="space-y-3">
          {star.foodEatTm.map((f, i) => (
            <li key={i} className="text-sm font-(--font-tamil) text-text-muted leading-relaxed">• {f}</li>
          ))}
        </ul>
      </SectionCard>
      <SectionCard>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-careful text-xl">✕</span>
          <h3 className="text-lg font-(--font-heading) text-careful tracking-wide">Foods to Avoid</h3>
          <span className="text-border ml-1 mr-1">|</span>
          <h3 className="text-sm font-(--font-tamil) text-careful opacity-80">தவிர்க்க வேண்டியவை</h3>
        </div>
        <ul className="space-y-3 mb-4">
          {star.foodAvoidEn.map((f, i) => (
            <li key={i} className="text-base text-text-secondary leading-relaxed">• {f}</li>
          ))}
        </ul>
        <ul className="space-y-3">
          {star.foodAvoidTm.map((f, i) => (
            <li key={i} className="text-sm font-(--font-tamil) text-text-muted leading-relaxed">• {f}</li>
          ))}
        </ul>
      </SectionCard>
    </>
  );
}

function TempleDetail({ star }: { star: (typeof nakshatras)[0] }) {
  return (
    <SectionCard>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-(--font-heading) text-secondary tracking-wide mb-2 drop-shadow-sm">{star.templeNameEn}</h3>
        <p className="text-base font-(--font-tamil) text-text-secondary opacity-90">{star.templeNameTm}</p>
      </div>
      <div className="bg-card-hover p-5 rounded-xl border border-border">
        <p className="text-[17px] text-text-primary leading-relaxed mb-5 text-justify">{star.templeDescEn}</p>
        <p className="text-[15px] font-(--font-tamil) text-text-secondary leading-relaxed text-justify opacity-90">{star.templeDescTm}</p>
      </div>
    </SectionCard>
  );
}

function GodDetail({ star }: { star: (typeof nakshatras)[0] }) {
  return (
    <SectionCard>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-(--font-heading) text-secondary tracking-wide mb-2 drop-shadow-sm">{star.godNameEn}</h3>
        <p className="text-base font-(--font-tamil) text-text-secondary opacity-90">{star.godNameTm}</p>
      </div>
      <div className="bg-card-hover p-5 rounded-xl border border-border">
        <p className="text-[17px] text-text-primary leading-relaxed mb-5 text-justify">{star.godDescEn}</p>
        <p className="text-[15px] font-(--font-tamil) text-text-secondary leading-relaxed text-justify opacity-90">{star.godDescTm}</p>
      </div>
    </SectionCard>
  );
}

function LuckyDetail({ star }: { star: (typeof nakshatras)[0] }) {
  return (
    <SectionCard>
      <div className="space-y-6">
        <div className="flex flex-col items-center bg-card-hover p-5 rounded-xl border border-border">
          <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Lucky Number / அதிர்ஷ்ட எண்</p>
          <p className="text-4xl font-bold font-(--font-heading) text-primary drop-shadow-sm">{star.luckyNumber}</p>
        </div>
        
        <div className="bg-card-hover p-5 rounded-xl border border-border flex flex-col items-center">
          <p className="text-xs text-text-muted uppercase tracking-widest mb-3">Lucky Color / அதிர்ஷ்ட நிறம்</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-border shadow-md" style={{ background: star.luckyColor }} />
            <div className="text-left">
              <p className="text-base font-semibold text-foreground tracking-wide">{star.luckyColorName}</p>
              <p className="text-sm font-(--font-tamil) text-text-secondary opacity-90">{star.luckyColorNameTm}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card-hover p-5 rounded-xl border border-border flex flex-col items-center text-center">
            <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2 line-clamp-1">Direction / திசை</p>
            <p className="text-sm font-semibold text-foreground tracking-wide mb-1">{star.luckyDirection}</p>
            <p className="text-xs font-(--font-tamil) text-text-secondary opacity-90">{star.luckyDirectionTm}</p>
          </div>
          <div className="bg-card-hover p-5 rounded-xl border border-border flex flex-col items-center text-center justify-center">
            <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2 line-clamp-1">Time / நேரம்</p>
            <p className="text-sm font-bold text-good">{star.luckyTime}</p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function AboutDetail({ star }: { star: (typeof nakshatras)[0] }) {
  return (
    <div className="space-y-6">
      <SectionCard>
        <p className="text-[17px] text-text-primary leading-relaxed mb-6 text-justify">{star.aboutEn}</p>
        <Divider />
        <p className="text-[15px] font-(--font-tamil) text-text-secondary leading-relaxed text-justify opacity-90">{star.aboutTm}</p>
      </SectionCard>
      
      <SectionCard>
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-border/50 pb-5">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-widest mb-1 font-semibold">Element</p>
              <p className="text-[11px] font-(--font-tamil) text-text-muted">பூதம்</p>
            </div>
            <p className="text-base font-semibold text-primary text-right max-w-[50%]">{star.element}</p>
          </div>
          <div className="flex items-center justify-between border-b border-border/50 pb-5">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-widest mb-1 font-semibold">Ruling Planet</p>
              <p className="text-[11px] font-(--font-tamil) text-text-muted">ராசி அதிபதி</p>
            </div>
            <p className="text-base font-semibold text-primary text-right max-w-[50%]">{star.planet}</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-widest mb-1 font-semibold">Symbol</p>
              <p className="text-[11px] font-(--font-tamil) text-text-muted">சின்னம்</p>
            </div>
            <p className="text-base font-semibold text-primary text-right max-w-[50%] leading-snug">{star.symbol}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="mb-6 flex flex-col gap-1">
          <p className="text-sm text-foreground uppercase tracking-widest font-semibold">Personality Traits</p>
          <p className="text-xs font-(--font-tamil) text-text-muted">குணாதிசயங்கள்</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {star.traits.map((trait, i) => (
            <span key={i} className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-[13px] font-medium text-primary shadow-sm tracking-wide">
              {trait}
            </span>
          ))}
        </div>
      </SectionCard>
      
      <SectionCard>
        <div className="mb-6 flex flex-col gap-1">
          <p className="text-sm text-foreground uppercase tracking-widest font-semibold">Compatible Stars</p>
          <p className="text-xs font-(--font-tamil) text-text-muted">ஒத்த நட்சத்திரங்கள்</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {star.compatibleStars.map(cId => {
            const cStar = nakshatras.find(n => n.id === cId);
            return cStar ? (
              <div key={cId} className="px-4 py-2 rounded-lg bg-secondary/10 border border-secondary/30 text-[13px] font-medium text-secondary shadow-sm tracking-wide">
                <span>{cStar.nameEn}</span>
              </div>
            ) : null;
          })}
        </div>
      </SectionCard>
    </div>
  );
}
