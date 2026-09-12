import React, { useState, useEffect } from 'react';
import { CardButton } from './CardButton';
import { soundManager } from '../sound';

interface TimerProps {
  initialMinutes: number;
  onTimeUp?: () => void;
  onSkip?: () => void;
  language: 'en' | 'ar';
}

export const Timer: React.FC<TimerProps> = ({
  initialMinutes,
  onTimeUp,
  onSkip,
  language
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [initialDuration, setInitialDuration] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const dur = initialMinutes * 60;
    setTotalSeconds(dur);
    setInitialDuration(dur);
    setIsRunning(false);
  }, [initialMinutes]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            setIsRunning(false);
            soundManager.playTimerWarning();
            onTimeUp?.();
            return 0;
          }
          if (prev === 10) {
            soundManager.playTimerWarning();
          } else if (prev <= 15) {
            soundManager.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, totalSeconds, onTimeUp]);

  const toggleTimer = () => {
    soundManager.playConfirmation();
    setIsRunning(!isRunning);
  };

  const addTime = (seconds: number) => {
    soundManager.playConfirmation();
    setTotalSeconds((prev) => {
      const next = prev + seconds;
      if (next > initialDuration) setInitialDuration(next);
      return next;
    });
  };

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isCritical = totalSeconds > 0 && totalSeconds <= 30;
  const progress = initialDuration > 0 ? (totalSeconds / initialDuration) : 0;
  const strokeDashoffset = 283 * (1 - progress);

  return (
    <div className={`flex flex-col items-center justify-center p-5 bg-gradient-to-b from-[#221610] to-[#170e09] border-2 rounded-sm shadow-[0_8px_24px_rgba(0,0,0,0.7)] max-w-sm w-full mx-auto my-3 transition-colors ${
      isCritical ? 'border-[#ff5c5c] animate-tension' : 'border-[#c59b27]'
    }`}>
      {/* Antique circular stopwatch header with SVG ring */}
      <div className="relative flex items-center justify-center w-40 h-40 rounded-full bg-[#140b07] shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_0_15px_rgba(197,155,39,0.2)] mb-4">
        {/* SVG Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#26160e"
            strokeWidth="5"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={isCritical ? '#ff5c5c' : '#c59b27'}
            strokeWidth="5"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Diamond tick marks */}
        <span className="absolute top-1.5 text-[10px] text-[#c59b27] z-10">♦</span>
        <span className="absolute bottom-1.5 text-[10px] text-[#c59b27] z-10">♦</span>
        <span className="absolute left-2 text-[10px] text-[#c59b27] z-10">♦</span>
        <span className="absolute right-2 text-[10px] text-[#c59b27] z-10">♦</span>

        {/* Digital Time readout */}
        <div className="text-center z-10">
          <span
            className={`font-mono text-3xl sm:text-4xl font-bold tracking-widest ${
              isCritical ? 'text-[#ff5c5c]' : 'text-[#f5d77f]'
            }`}
          >
            {formattedTime}
          </span>
          <p className="text-[10px] uppercase tracking-wider text-[#a89078] mt-0.5">
            {isRunning ? (language === 'ar' ? 'النقاش جارٍ' : 'Debate Active') : (language === 'ar' ? 'متوقف' : 'Paused')}
          </p>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 w-full">
        <CardButton
          variant={isRunning ? 'secondary' : 'gold'}
          size="sm"
          onClick={toggleTimer}
          className="min-w-[95px]"
        >
          {isRunning ? (language === 'ar' ? '⏸️ إيقاف' : '⏸️ Pause') : (language === 'ar' ? '▶️ بدء' : '▶️ Start')}
        </CardButton>

        <CardButton
          variant="secondary"
          size="sm"
          onClick={() => addTime(30)}
        >
          +30s
        </CardButton>

        <CardButton
          variant="secondary"
          size="sm"
          onClick={() => addTime(60)}
        >
          +1m
        </CardButton>

        {onSkip && (
          <CardButton
            variant="secondary"
            size="sm"
            onClick={() => {
              soundManager.playConfirmation();
              onSkip();
            }}
          >
            {language === 'ar' ? 'تخطي ⏩' : 'Skip ⏩'}
          </CardButton>
        )}
      </div>
    </div>
  );
};
