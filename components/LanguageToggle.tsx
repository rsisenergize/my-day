'use client';

import { useLanguage } from './LanguageProvider';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <div className="absolute top-6 right-6 z-50 flex items-center bg-card shadow-sm border border-border rounded-full p-1 cursor-pointer hover:shadow-md transition-shadow" onClick={toggleLanguage}>
      <div className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${language === 'en' ? 'bg-primary text-white shadow-sm scale-100' : 'text-text-muted hover:text-foreground scale-95'}`}>
        EN
      </div>
      <div className={`px-4 py-1.5 rounded-full text-xs font-bold font-tamil transition-all duration-300 ${language === 'tm' ? 'bg-primary text-white shadow-sm scale-100' : 'text-text-muted hover:text-foreground scale-95'}`}>
        தமிழ்
      </div>
    </div>
  );
}
