import React from 'react';
import { Player, Language } from '../types';
import { translations } from '../i18n';
import { CardButton } from '../components/CardButton';
import { GoldDivider } from '../components/GoldDivider';
import { LogoEmblem } from '../components/LogoEmblem';

interface GameReadyScreenProps {
  players: Player[];
  customLogoUrl: string | null;
  onStartNight: () => void;
  onBackToSetup: () => void;
  language: Language;
}

export const GameReadyScreen: React.FC<GameReadyScreenProps> = ({
  players,
  customLogoUrl,
  onStartNight,
  onBackToSetup,
  language
}) => {
  const t = translations[language];

  return (
    <div className="flex flex-col items-center justify-between min-h-[85vh] py-6 px-4 max-w-md mx-auto text-center animate-fadeIn">
      {/* Top Graphic */}
      <div className="flex flex-col items-center w-full">
        <LogoEmblem customLogoUrl={customLogoUrl} size="md" />

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f5d77f] tracking-wide uppercase mt-3 mb-1">
          {t.gameReady}
        </h2>

        <p className="text-xs text-[#c7b095] italic font-serif">
          {language === 'ar'
            ? 'تجهيز مجلس اللعبة وتوزيع الكروت الحقيقية'
            : 'Assembling the council for the trial of shadows'}
        </p>

        <GoldDivider variant="diamond" className="my-4" />
      </div>

      {/* Critical Physical Card Reminder Box */}
      <div className="w-full bg-gradient-to-b from-[#381119] via-[#2a0c13] to-[#1a070b] border-2 border-[#c59b27] p-5 rounded-sm shadow-[0_8px_25px_rgba(0,0,0,0.8)] my-auto text-start">
        <div className="flex items-center gap-2 mb-2 text-[#f5d77f]">
          <span className="text-xl">🎴</span>
          <h3 className="font-serif text-base sm:text-lg font-bold tracking-wide">
            {t.physicalCardReminderTitle}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#ede3ce] leading-relaxed mb-3">
          {t.physicalCardReminderBody}
        </p>

        <div className="p-2.5 bg-[#140508] border border-[#c59b27]/40 rounded-xs flex items-center gap-2">
          <span className="text-[#f5d77f] text-sm">⚠️</span>
          <p className="text-[11px] text-[#fca5a5] font-semibold">
            {t.physicalCardWarning}
          </p>
        </div>

        {/* Players in this council */}
        <div className="mt-4 pt-3 border-t border-[#c59b27]/30">
          <p className="text-[11px] text-[#a89078] uppercase tracking-wider mb-1.5">
            {language === 'ar' ? 'أعضاء المجلس المشاركون:' : 'Council Members Seated:'}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {players.map((p) => (
              <span
                key={p.id}
                className="text-xs px-2 py-0.5 bg-[#1f1008] border border-[#c59b27]/40 text-[#fbf7ee] rounded-xs font-serif"
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="w-full space-y-2.5 mt-6 max-w-xs">
        <CardButton
          variant="gold"
          size="lg"
          fullWidth
          onClick={onStartNight}
          className="shadow-[0_0_20px_rgba(197,155,39,0.35)]"
        >
          🌙 {t.startNight}
        </CardButton>

        <CardButton
          variant="secondary"
          size="sm"
          fullWidth
          onClick={onBackToSetup}
        >
          ← {language === 'ar' ? 'تعديل اللاعبين' : 'Edit Players'}
        </CardButton>
      </div>
    </div>
  );
};
