import React, { useState } from 'react';
import { CardButton } from './CardButton';
import { GoldDivider } from './GoldDivider';
import { soundManager } from '../sound';

interface SecretActionScreenProps {
  playerName?: string;
  roleTitle?: string;
  gatePrompt?: string;
  gateButtonText?: string;
  isGated?: boolean;
  children: React.ReactNode;
}

export const SecretActionScreen: React.FC<SecretActionScreenProps> = ({
  playerName,
  roleTitle,
  gatePrompt = 'Pass the phone privately. Tap unlock only when you hold the device.',
  gateButtonText = 'I am holding the device — Unlock',
  isGated = true,
  children
}) => {
  const [isUnlocked, setIsUnlocked] = useState(!isGated);

  const handleUnlock = () => {
    soundManager.playConfirmation();
    setIsUnlocked(true);
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-8 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-[#20150e] border-2 border-[#c59b27] flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(197,155,39,0.3)] mb-4">
          🔒
        </div>

        {roleTitle && (
          <h3 className="font-serif text-lg font-bold text-[#c59b27] uppercase tracking-wider mb-1">
            {roleTitle}
          </h3>
        )}

        {playerName && (
          <div className="my-2 p-3 bg-[#241710] border border-[#c59b27] rounded-sm max-w-xs w-full">
            <p className="text-xs text-[#a89078] uppercase tracking-wider mb-1">
              Designated Voter
            </p>
            <p className="font-serif text-xl font-bold text-[#f5d77f]">
              {playerName}
            </p>
          </div>
        )}

        <p className="text-sm text-[#c7b095] italic max-w-xs mt-3 mb-6">
          {gatePrompt}
        </p>

        <CardButton variant="gold" size="lg" onClick={handleUnlock}>
          {gateButtonText}
        </CardButton>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center animate-fadeIn">
      {playerName && (
        <div className="w-full text-center mb-3">
          <span className="text-xs tracking-wider uppercase text-[#c59b27] px-3 py-1 bg-[#1a0f0a] border border-[#c59b27]/40 rounded-sm">
            Acting: <strong>{playerName}</strong>
          </span>
          <GoldDivider variant="simple" className="my-2" />
        </div>
      )}
      {children}
    </div>
  );
};
