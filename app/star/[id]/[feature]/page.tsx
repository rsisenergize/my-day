'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { nakshatras } from '@/data/nakshatras';
import { predictions } from '@/data/predictions';
import { getPredictionIndex, formatDateEN, formatDateTM } from '@/lib/predictionEngine';
import StarField from '@/components/StarField';
import DayQualityBadge from '@/components/DayQualityBadge';
import { useLanguage } from '@/components/LanguageProvider';

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
  const { language } = useLanguage();

  const starId = parseInt(id);
  const star = nakshatras.find(n => n.id === starId);
  const label = featureLabels[feature] || { en: feature, tm: '' };

  useEffect(() => {
    setIsMounted(true);
    const savedDate = localStorage.getItem('myDay_selectedDate');
    if (savedDate) setSelectedDate(new Date(savedDate + 'T00:00:00'));
  }, []);

  if (!isMounted) return <div className="min-h-dvh bg-background"></div>;
  if (!star) return <div className="min-h-dvh flex items-center justify-center text-text-muted bg-background">Star not found</div>;

  const predIndex = getPredictionIndex(star.id - 1, selectedDate);
  const pred = predictions.find(p => p.id === predIndex);

  return (
    <div className="min-h-dvh relative page-enter bg-background">
      <StarField />
      <div className="relative z-10 px-6 pt-16 pb-12 safe-top safe-bottom">
        {/* Header */}
        <div className="relative flex items-center justify-center mb-10 min-h-[44px]">
          <button onClick={() => router.back()} className="absolute left-0 top-0 w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:bg-card-hover transition-colors z-10 shrink-0">
            <ArrowLeft size={20} className="text-text-secondary" />
          </button>
          <div className="text-center px-12 w-full">
            {language === 'en' ? (
              <div className="flex flex-col items-center gap-6">
                <h1 className="text-3xl font-bold font-heading text-foreground tracking-wide">{label.en}</h1>
                <p className="text-xl uppercase tracking-widest text-primary font-bold opacity-90">{star.nameEn}</p>
                <p className="text-lg text-text-muted font-bold">{formatDateEN(selectedDate)}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <h1 className="text-3xl font-bold font-tamil text-foreground tracking-wide">{label.tm}</h1>
                <p className="text-[22px] uppercase tracking-widest text-primary font-bold opacity-90">{star.nameTm}</p>
                <p className="text-xl text-text-muted font-bold font-tamil">{formatDateTM(selectedDate)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {feature === 'prediction' && pred && <PredictionDetail pred={pred} language={language} />}
          {feature === 'work' && <WorkDetail star={star} language={language} />}
          {feature === 'food' && <FoodDetail star={star} language={language} />}
          {feature === 'temple' && <TempleDetail star={star} language={language} />}
          {feature === 'god' && <GodDetail star={star} language={language} />}
          {feature === 'lucky' && <LuckyDetail star={star} language={language} />}
          {feature === 'about' && <AboutDetail star={star} language={language} />}
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

function PredictionDetail({ pred, language }: { pred: (typeof predictions)[0], language: string }) {
  return (
    <div className="space-y-6">
      {/* Main Prediction Details Segment */}
      <SectionCard>
        <div className="flex flex-col items-center gap-6">
          <span className="text-2xl font-bold text-primary font-tamil bg-primary/10 px-6 py-2 rounded-full shadow-sm">{pred.qualityWord}</span>
          {language === 'en' ? (
            <p className="text-lg font-heading text-foreground leading-relaxed text-center">{pred.textEn}</p>
          ) : (
            <p className="text-lg font-bold font-tamil text-foreground leading-relaxed text-center">{pred.textTm}</p>
          )}
        </div>
      </SectionCard>

      {/* Auspicious Time Segment */}
      <SectionCard>
        <div className="flex flex-col items-center gap-6 p-2">
          <div className="flex items-center justify-center">
            {language === 'en' ? (
              <span className="text-lg uppercase tracking-widest text-text-muted font-bold relative after:content-[''] after:block after:w-8 after:h-0.5 after:bg-primary/30 after:mx-auto after:mt-2">Auspicious Time</span>
            ) : (
              <span className="text-lg font-bold font-tamil text-text-muted relative after:content-[''] after:block after:w-8 after:h-0.5 after:bg-primary/30 after:mx-auto after:mt-2">நல்ல நேரம்</span>
            )}
          </div>
          
          <div className="flex flex-col gap-4 w-full max-w-[280px]">
            {language === 'en' ? (
              pred.goodTimeEn.split(',').map((time, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-card-hover border border-border shadow-sm">
                  <p className="text-lg font-bold text-good tracking-wide">{time.trim()}</p>
                </div>
              ))
            ) : (
              pred.goodTimeTm.split(',').map((time, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-card-hover border border-border shadow-sm">
                  <p className="text-lg font-bold font-tamil text-good tracking-wide">{time.trim()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function WorkDetail({ star, language }: { star: (typeof nakshatras)[0], language: string }) {
  return (
    <SectionCard>
      <h3 className="text-center text-xl font-bold font-heading text-foreground mb-6 tracking-wide">
        {language === 'en' ? 'Work Tips' : 'வேலை குறிப்புகள்'}
      </h3>
      <ul className="space-y-4">
        {(language === 'en' ? star.workEn : star.workTm).map((tip, i) => (
          <li key={i} className="flex gap-4 text-center items-center justify-center flex-col bg-card-hover p-4 rounded-xl border border-border">
            <span className="text-primary text-xl -mt-1 -mb-1">❖</span>
            <span className={language === 'en' ? "text-base font-medium text-foreground leading-relaxed" : "text-base font-bold font-tamil text-foreground leading-relaxed"}>
              {tip}
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

function FoodDetail({ star, language }: { star: (typeof nakshatras)[0], language: string }) {
  return (
    <SectionCard>
      <div className="space-y-6">
        <div>
          <div className="flex flex-col items-center justify-center gap-2 mb-4 text-center">
            <div className="w-10 h-10 rounded-full bg-good/10 flex items-center justify-center mb-1">
              <span className="text-good text-xl font-bold">✓</span>
            </div>
            <h3 className={language === 'en' ? "text-xl font-bold font-heading text-good tracking-wide" : "text-xl font-bold font-tamil text-good tracking-wide"}>
              {language === 'en' ? 'Foods to Eat' : 'சாப்பிட வேண்டியவை'}
            </h3>
          </div>
          <ul className="space-y-3">
            {(language === 'en' ? star.foodEatEn : star.foodEatTm).map((f, i) => (
              <li key={i} className={language === 'en' ? "text-center text-base font-medium text-foreground leading-relaxed p-3 bg-card-hover rounded-xl border border-border" : "text-center text-base font-bold font-tamil text-foreground leading-relaxed p-3 bg-card-hover rounded-xl border border-border"}>
                {f}
              </li>
            ))}
          </ul>
        </div>
        
        <Divider />
        
        <div>
          <div className="flex flex-col items-center justify-center gap-2 mb-4 text-center">
            <div className="w-10 h-10 rounded-full bg-careful/10 flex items-center justify-center mb-1">
              <span className="text-careful text-xl font-bold">✕</span>
            </div>
            <h3 className={language === 'en' ? "text-xl font-bold font-heading text-careful tracking-wide" : "text-xl font-bold font-tamil text-careful tracking-wide"}>
              {language === 'en' ? 'Foods to Avoid' : 'தவிர்க்க வேண்டியவை'}
            </h3>
          </div>
          <ul className="space-y-3">
            {(language === 'en' ? star.foodAvoidEn : star.foodAvoidTm).map((f, i) => (
              <li key={i} className={language === 'en' ? "text-center text-base font-medium text-foreground leading-relaxed p-3 bg-card-hover rounded-xl border border-border" : "text-center text-base font-bold font-tamil text-foreground leading-relaxed p-3 bg-card-hover rounded-xl border border-border"}>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionCard>
  );
}

function TempleDetail({ star, language }: { star: (typeof nakshatras)[0], language: string }) {
  return (
    <SectionCard>
      <div className="text-center mb-6">
        {language === 'en' ? (
          <h3 className="text-2xl font-bold font-heading text-primary tracking-wide drop-shadow-sm">{star.templeNameEn}</h3>
        ) : (
          <h3 className="text-2xl font-bold font-tamil text-primary tracking-wide drop-shadow-sm">{star.templeNameTm}</h3>
        )}
      </div>
      <div className="bg-card-hover p-6 rounded-xl border border-border shadow-inner">
        {language === 'en' ? (
          <p className="text-base font-medium text-foreground leading-relaxed text-center">{star.templeDescEn}</p>
        ) : (
          <p className="text-base font-bold font-tamil text-foreground leading-relaxed text-center">{star.templeDescTm}</p>
        )}
      </div>
    </SectionCard>
  );
}

function GodDetail({ star, language }: { star: (typeof nakshatras)[0], language: string }) {
  return (
    <SectionCard>
      <div className="text-center mb-6">
        {language === 'en' ? (
          <h3 className="text-2xl font-bold font-heading text-primary tracking-wide drop-shadow-sm">{star.godNameEn}</h3>
        ) : (
          <h3 className="text-2xl font-bold font-tamil text-primary tracking-wide drop-shadow-sm">{star.godNameTm}</h3>
        )}
      </div>
      <div className="bg-card-hover p-6 rounded-xl border border-border shadow-inner">
        {language === 'en' ? (
           <p className="text-base font-medium text-foreground leading-relaxed text-center">{star.godDescEn}</p>
        ) : (
           <p className="text-base font-bold font-tamil text-foreground leading-relaxed text-center">{star.godDescTm}</p>
        )}
      </div>
    </SectionCard>
  );
}

function LuckyDetail({ star, language }: { star: (typeof nakshatras)[0], language: string }) {
  return (
    <SectionCard>
      <div className="space-y-5">
        <div className="flex flex-col items-center bg-card-hover p-6 rounded-xl border border-border shadow-sm transform transition-transform hover:scale-105">
          <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-2">
            {language === 'en' ? 'Lucky Number' : 'அதிர்ஷ்ட எண்'}
          </p>
          <p className="text-5xl font-bold font-heading text-primary drop-shadow-sm">{star.luckyNumber}</p>
        </div>
        
        <div className="bg-card-hover p-6 rounded-xl border border-border flex flex-col items-center shadow-sm transform transition-transform hover:scale-105">
          <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">
            {language === 'en' ? 'Lucky Color' : 'அதிர்ஷ்ட நிறம்'}
          </p>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full border-4 border-border shadow-md" style={{ background: star.luckyColor }} />
            {language === 'en' ? (
              <p className="text-xl font-bold text-foreground tracking-wide">{star.luckyColorName}</p>
            ) : (
              <p className="text-xl font-bold font-tamil text-foreground">{star.luckyColorNameTm}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card-hover p-6 rounded-xl border border-border flex flex-col items-center text-center justify-center shadow-sm transform transition-transform hover:scale-105">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
              {language === 'en' ? 'Direction' : 'திசை'}
            </p>
            {language === 'en' ? (
              <p className="text-lg font-bold text-foreground tracking-wide">{star.luckyDirection}</p>
            ) : (
              <p className="text-lg font-bold font-tamil text-foreground">{star.luckyDirectionTm}</p>
            )}
          </div>
          <div className="bg-card-hover p-6 rounded-xl border border-border flex flex-col items-center text-center justify-center shadow-sm transform transition-transform hover:scale-105">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
              {language === 'en' ? 'Time' : 'நேரம்'}
            </p>
            <p className="text-lg font-bold text-good">{star.luckyTime}</p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function AboutDetail({ star, language }: { star: (typeof nakshatras)[0], language: string }) {
  return (
    <SectionCard>
      <div className="space-y-8">
        <div>
          {language === 'en' ? (
            <p className="text-base font-medium text-foreground leading-relaxed text-center">{star.aboutEn}</p>
          ) : (
            <p className="text-base font-bold font-tamil text-foreground leading-relaxed text-center">{star.aboutTm}</p>
          )}
        </div>
        
        <Divider />
        
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-card-hover p-4 rounded-xl border border-border flex flex-col items-center text-center shadow-sm">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
              {language === 'en' ? 'Element' : 'பூதம்'}
            </p>
            <p className="text-lg font-bold text-primary">{language === 'en' ? star.element : star.elementTm}</p>
          </div>
          <div className="bg-card-hover p-4 rounded-xl border border-border flex flex-col items-center text-center shadow-sm">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
              {language === 'en' ? 'Ruling Planet' : 'ராசி அதிபதி'}
            </p>
            <p className="text-lg font-bold text-primary">{language === 'en' ? star.planet : star.planetTm}</p>
          </div>
          <div className="bg-card-hover p-4 rounded-xl border border-border flex flex-col items-center text-center shadow-sm">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
              {language === 'en' ? 'Symbol' : 'சின்னம்'}
            </p>
            <p className="text-lg font-bold text-primary leading-snug">{language === 'en' ? star.symbol : star.symbolTm}</p>
          </div>
        </div>

        <Divider />

        <div>
          <div className="mb-4 flex flex-col items-center text-center">
            <h3 className={language === 'en' ? "text-lg font-bold font-heading text-foreground tracking-wider uppercase" : "text-lg font-bold font-tamil text-foreground tracking-wider"}>
              {language === 'en' ? 'Personality Traits' : 'குணாதிசயங்கள்'}
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {(language === 'en' ? star.traits : star.traitsTm).map((trait, i) => (
              <span key={i} className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm font-bold text-primary shadow-sm tracking-wide">
                {trait}
              </span>
            ))}
          </div>
        </div>
        
        <Divider />

        <div>
           <div className="mb-4 flex flex-col items-center text-center">
             <h3 className={language === 'en' ? "text-lg font-bold font-heading text-foreground tracking-wider uppercase" : "text-lg font-bold font-tamil text-foreground tracking-wider"}>
               {language === 'en' ? 'Compatible Stars' : 'ஒத்த நட்சத்திரங்கள்'}
             </h3>
           </div>
           <div className="flex flex-wrap justify-center gap-3">
             {star.compatibleStars.map(cId => {
               const cStar = nakshatras.find(n => n.id === cId);
               return cStar ? (
                 <div key={cId} className="px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 text-sm font-bold text-secondary shadow-sm tracking-wide">
                   <span>{language === 'en' ? cStar.nameEn : cStar.nameTm}</span>
                 </div>
               ) : null;
             })}
           </div>
        </div>
      </div>
    </SectionCard>
  );
}
