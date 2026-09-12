import React from 'react';
import { LogoEmblem } from '../components/LogoEmblem';
import { CardButton } from '../components/CardButton';
import { GoldDivider } from '../components/GoldDivider';
import { translations } from '../i18n';
import { Language } from '../types';

interface HomeScreenProps {
  customLogoUrl: string | null;
  language: Language;
  onNewGame: () => void;
  onHowToPlay: () => void;
  onSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  customLogoUrl,
  language,
  onNewGame,
  onHowToPlay,
  onSettings
}) => {
  const t = translations[language];

  return (
    <div className="flex flex-col items-center justify-between min-h-[85vh] py-6 px-4 max-w-md mx-auto text-center animate-fadeIn">
      {/* Top Banner / Emblems */}
      <div className="flex flex-col items-center w-full mt-2">
        <div className="relative mb-3">
          <LogoEmblem
            customLogoUrl={customLogoUrl}
            size="lg"
            className="transition-transform hover:scale-105 duration-300"
          />
        </div>

        {/* Brand Titles */}
        <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-widest text-[#f5d77f] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] uppercase mb-1">
          MAFIA • مافيا
        </h1>

        <p className="font-serif text-xs sm:text-sm text-[#c59b27] tracking-wider uppercase font-semibold">
          {t.appSubtitle}
        </p>

        <p className="text-[11px] text-[#a89078] italic mt-1 font-serif">
          {t.offlineNotice}
        </p>

        <GoldDivider variant="eye" className="my-5" />
      </div>

      {/* Main Action Buttons */}
      <div className="w-full space-y-3.5 my-auto max-w-xs">
        <CardButton
          variant="gold"
          size="lg"
          fullWidth
          onClick={onNewGame}
          className="shadow-[0_0_20px_rgba(197,155,39,0.35)]"
        >
          🎴 {t.newGame}
        </CardButton>

        <CardButton
          variant="primary"
          size="md"
          fullWidth
          onClick={onHowToPlay}
        >
          📜 {t.howToPlay}
        </CardButton>

        <CardButton
          variant="secondary"
          size="md"
          fullWidth
          onClick={onSettings}
        >
          ⚙️ {t.settings}
        </CardButton>
      </div>

      {/* Footer Credits */}
      <div className="w-full mt-8 pt-4 border-t border-[#c59b27]/25">
        <div className="flex items-center justify-center gap-2 text-[10px] text-[#c59b27] uppercase tracking-widest mb-1 select-none">
          <span>♠</span>
          <span>♦</span>
          <span>{t.credits}</span>
          <span>♦</span>
          <span>♠</span>
        </div>

        <p className="font-serif text-xs sm:text-sm font-bold text-[#f5d77f] tracking-wide">
          {t.creditsAuthors}
        </p>

        <p className="text-[10px] text-[#856b54] mt-1 font-serif">
          {language === 'ar'
            ? 'تطبيق منظم أوفلاين بنسبة 100% — لا يتطلب إنترنت أو خوادم'
            : '100% Offline Physical Card Companion — Zero Cloud Required'}
        </p>
      </div>
    </div>
  );
};
