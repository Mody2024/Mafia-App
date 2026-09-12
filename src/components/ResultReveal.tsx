import React, { useEffect } from 'react';
import { CardButton } from './CardButton';
import { GoldDivider } from './GoldDivider';
import { soundManager } from '../sound';

interface ResultRevealProps {
  eliminatedPlayerName: string | null;
  savedByDoctor?: boolean;
  onProceed: () => void;
  proceedButtonText: string;
  language: 'en' | 'ar';
}

export const ResultReveal: React.FC<ResultRevealProps> = ({
  eliminatedPlayerName,
  savedByDoctor = false,
  onProceed,
  proceedButtonText,
  language
}) => {
  useEffect(() => {
    if (eliminatedPlayerName) {
      soundManager.playElimination();
    } else {
      soundManager.playMorning();
    }
  }, [eliminatedPlayerName]);

  const hasVictim = Boolean(eliminatedPlayerName);

  return (
    <div className="flex flex-col items-center justify-center max-w-md w-full mx-auto my-4 p-5 sm:p-6 bg-gradient-to-b from-[#24160f] via-[#1a0f09] to-[#120a06] border-2 border-[#c59b27] rounded-sm shadow-[0_10px_35px_rgba(0,0,0,0.85)] animate-crack">
      {/* Top Emblem / Status Graphic */}
      <div className="mb-4">
        {hasVictim ? (
          <div className="w-20 h-20 rounded-full bg-[#400f17] border-2 border-[#d9534f] flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(217,83,79,0.4)] animate-pulse">
            ☠️
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-[#1b2b1b] border-2 border-[#c59b27] flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(197,155,39,0.3)]">
            ☀️
          </div>
        )}
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-center text-[#f5d77f]">
        {hasVictim
          ? language === 'ar'
            ? 'سقوط ضحية في الظلمات'
            : 'Fallen in the Shadows'
          : language === 'ar'
          ? 'صباح هادئ بدون ضحايا'
          : 'A Peaceful Dawn'}
      </h2>

      <GoldDivider variant="diamond" className="my-3" />

      {/* Main Announcement Message */}
      <div className="my-4 text-center px-3">
        {hasVictim ? (
          <div className="space-y-3">
            <div className="p-4 bg-[#321217] border border-[#a83232] rounded-sm shadow-inner">
              <p className="text-xs uppercase tracking-widest text-[#e89090] mb-1">
                {language === 'ar' ? 'اللاعب المستبعد' : 'Eliminated Player'}
              </p>
              <h3 className="font-serif text-2xl font-bold text-[#ffdddd] tracking-wider">
                {eliminatedPlayerName}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#c7b095] italic">
              {language === 'ar'
                ? 'فارق الحياة في ظلمات ليلة البارحة ولن يشارك في نقاش المجلس.'
                : 'Fell victim to the shadows last night and will no longer participate in council voting.'}
            </p>

            {/* Physical Card Instruction */}
            <div className="p-3 bg-[#1e140d] border border-[#c59b27]/60 rounded-xs text-start">
              <div className="flex items-center gap-2 text-[#f5d77f] text-xs font-bold uppercase tracking-wider mb-1">
                <span>🎴</span>
                <span>
                  {language === 'ar' ? 'تعليمات الكرت الورقي' : 'Physical Card Rule'}
                </span>
              </div>
              <p className="text-xs text-[#ede3ce] leading-relaxed">
                {language === 'ar'
                  ? `يجب على اللاعب (${eliminatedPlayerName}) كشف كرته الورقي الحقيقي الآن أمام المجلس وفقاً لقوانين لعبتكم.`
                  : `Instruct ${eliminatedPlayerName} to reveal their real physical role card now according to your house rules.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 bg-[#1b2b1a] border border-[#488248] rounded-sm shadow-inner">
              <h3 className="font-serif text-xl font-bold text-[#d4f7d4]">
                {language === 'ar'
                  ? 'لم يُقتل أحد في هذه الليلة!'
                  : 'No One Perished Last Night!'}
              </h3>
              {savedByDoctor && (
                <p className="text-xs text-[#9fd49f] mt-1 italic">
                  {language === 'ar'
                    ? 'تدخلت العناية الطبية بنجاح وتم إنقاذ الهدف المستهدف.'
                    : 'A timely antidote or divine intervention shielded the targeted citizen.'}
                </p>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#a89078] italic">
              {language === 'ar'
                ? 'جميع أعضاء المجلس استيقظوا سالمين ويستعدون لنقاش النهار.'
                : 'All council members have survived to greet the morning sun.'}
            </p>
          </div>
        )}
      </div>

      <GoldDivider variant="simple" className="my-3" />

      {/* Button to proceed */}
      <CardButton
        variant="gold"
        size="lg"
        fullWidth
        onClick={onProceed}
        className="mt-2"
      >
        {proceedButtonText}
      </CardButton>
    </div>
  );
};
