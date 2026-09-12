import React, { useEffect, useState } from 'react';
import { translations } from '../i18n';
import { Language } from '../types';
import { soundManager } from '../sound';

interface PrivacyTransitionProps {
  durationSeconds: number;
  language: Language;
  onComplete: () => void;
  nextRoleCueSound?: () => void;
  subtitleOverride?: string;
}

export const PrivacyTransition: React.FC<PrivacyTransitionProps> = ({
  durationSeconds,
  language,
  onComplete,
  nextRoleCueSound,
  subtitleOverride
}) => {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const t = translations[language];

  useEffect(() => {
    setSecondsLeft(durationSeconds);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (nextRoleCueSound) {
            nextRoleCueSound();
          }
          onComplete();
          return 0;
        }
        soundManager.playTick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [durationSeconds, onComplete, nextRoleCueSound]);

  const progressPercentage = ((durationSeconds - secondsLeft) / durationSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-[#0c0705] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
      {/* Mystical vignette & eye closing animation */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full border border-[#c59b27]/30 flex items-center justify-center animate-pulse">
          <div className="w-20 h-20 rounded-full border-2 border-[#c59b27] flex items-center justify-center bg-[#150c08] shadow-[0_0_25px_rgba(197,155,39,0.2)]">
            {/* Eye closing silhouette */}
            <svg
              viewBox="0 0 100 100"
              className="w-12 h-12 text-[#c59b27]"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                d="M 10 50 Q 50 15 90 50 Q 50 85 10 50 Z"
                strokeLinecap="round"
                className="opacity-60"
              />
              <ellipse
                cx="50"
                cy="50"
                rx="14"
                ry={Math.max(1.5, (secondsLeft / durationSeconds) * 14)}
                fill="#c59b27"
                className="transition-all duration-700 ease-in-out"
              />
            </svg>
          </div>
        </div>

        {/* Outer orbital rings */}
        <div className="absolute -inset-3 rounded-full border border-dashed border-[#c59b27]/20 animate-spin [animation-duration:30s]" />
      </div>

      <h2 className="font-serif text-2xl font-bold text-[#f5d77f] tracking-widest uppercase mb-2">
        {t.privacyTransitionTitle}
      </h2>

      <p className="text-xs sm:text-sm text-[#a89078] max-w-xs mb-8 leading-relaxed font-serif">
        {subtitleOverride || t.passingModeratorNotice}
      </p>

      {/* Countdown Ring / Display */}
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <div className="flex items-center gap-2">
          <span className="text-4xl font-serif font-bold text-[#f5d77f] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {secondsLeft}
          </span>
          <span className="text-xs text-[#c59b27] uppercase tracking-wider font-semibold">
            {t.secondsRemaining}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-[#20150e] border border-[#c59b27]/40 rounded-full overflow-hidden p-[1px]">
          <div
            className="h-full bg-gradient-to-r from-[#997519] via-[#c59b27] to-[#f5d77f] transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          if (nextRoleCueSound) nextRoleCueSound();
          onComplete();
        }}
        className="mt-10 text-[11px] text-[#8c6f55] hover:text-[#f5d77f] transition-colors uppercase tracking-widest cursor-pointer underline underline-offset-4"
      >
        {language === 'ar' ? 'تخطي الانتظار (نقرة المنظم) ⏩' : 'Skip Wait (Moderator Tap) ⏩'}
      </button>
    </div>
  );
};
