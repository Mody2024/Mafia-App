import React from 'react';
import { Player, Language } from '../types';
import { translations } from '../i18n';
import { CardButton } from '../components/CardButton';
import { GoldDivider } from '../components/GoldDivider';
import { Timer } from '../components/Timer';

interface DayDiscussionScreenProps {
  round: number;
  livingPlayers: Player[];
  discussionMinutes: number;
  onProceedToVoting: () => void;
  language: Language;
}

export const DayDiscussionScreen: React.FC<DayDiscussionScreenProps> = ({
  round,
  livingPlayers,
  discussionMinutes,
  onProceedToVoting,
  language
}) => {
  const t = translations[language];

  return (
    <div className="flex flex-col min-h-[85vh] py-4 px-3 sm:px-6 max-w-lg mx-auto w-full animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-1">
        <span className="text-xs uppercase tracking-widest text-[#c59b27] font-semibold">
          {language === 'ar' ? `اليوم رقم ${round}` : `Day Phase #${round}`}
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f5d77f] tracking-wide uppercase">
          {t.dayDiscussionTitle}
        </h2>
        <p className="text-xs text-[#a89078] mt-0.5">
          {language === 'ar'
            ? 'يتشاور أعضاء المجلس بحرية لكشف المشتبه بهم قبل بدء الاقتراع السري.'
            : 'The council deliberates to identify suspects before casting secret ballots.'}
        </p>
      </div>

      <GoldDivider variant="diamond" className="my-2" />

      {/* Discussion Timer */}
      <Timer
        initialMinutes={discussionMinutes}
        onTimeUp={() => {}}
        onSkip={onProceedToVoting}
        language={language}
      />

      {/* Living Council Members Roster */}
      <div className="my-3 p-3 bg-[#20150e] border border-[#c59b27]/40 rounded-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-serif text-[#c59b27] uppercase tracking-wider font-semibold">
            {t.livingCitizensCount}
          </span>
          <span className="text-xs font-bold bg-[#140a06] px-2 py-0.5 border border-[#c59b27]/40 text-[#f5d77f] rounded-xs">
            {livingPlayers.length}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          {livingPlayers.map((p) => (
            <span
              key={p.id}
              className="text-xs px-2.5 py-1 bg-[#180f0a] border border-[#c59b27]/50 text-[#ede3ce] rounded-xs font-serif"
            >
              ⚖️ {p.name}
            </span>
          ))}
        </div>
      </div>

      <GoldDivider variant="simple" className="my-2" />

      {/* Proceed to Voting Button */}
      <CardButton
        variant="gold"
        size="lg"
        fullWidth
        onClick={onProceedToVoting}
        className="mt-auto shadow-[0_0_18px_rgba(197,155,39,0.35)]"
      >
        🗳️ {t.proceedToVoting} →
      </CardButton>
    </div>
  );
};
