import React, { useEffect } from 'react';
import { Player, SecretRoles, VictoryTeam, Language } from '../types';
import { translations } from '../i18n';
import { CardButton } from '../components/CardButton';
import { GoldDivider } from '../components/GoldDivider';
import { LogoEmblem } from '../components/LogoEmblem';
import { soundManager } from '../sound';

interface VictoryScreenProps {
  winningTeam: VictoryTeam;
  players: Player[];
  secretRoles: SecretRoles;
  customLogoUrl: string | null;
  onPlayAgain: () => void;
  onReturnHome: () => void;
  language: Language;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  winningTeam,
  players,
  secretRoles,
  customLogoUrl,
  onPlayAgain,
  onReturnHome,
  language
}) => {
  const t = translations[language];
  const isCitizens = winningTeam === 'citizens';

  useEffect(() => {
    if (isCitizens) {
      soundManager.playCitizenVictory();
    } else {
      soundManager.playMafiaVictory();
    }
  }, [isCitizens]);

  const getRoleLabel = (playerId: string) => {
    if (playerId === secretRoles.mafiaPlayerId) {
      return language === 'ar' ? 'مافيا ☠️' : 'Mafia ☠️';
    }
    if (playerId === secretRoles.detectivePlayerId) {
      return language === 'ar' ? 'محقق 🔍' : 'Detective 🔍';
    }
    if (playerId === secretRoles.doctorPlayerId) {
      return language === 'ar' ? 'طبيب 🏺' : 'Doctor 🏺';
    }
    return language === 'ar' ? 'مواطن بريء ⚖️' : 'Innocent ⚖️';
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[85vh] py-6 px-4 max-w-md mx-auto text-center animate-fadeIn">
      {/* Top Banner & Laurels */}
      <div className="w-full flex flex-col items-center">
        <LogoEmblem customLogoUrl={customLogoUrl} size="md" />

        <div className="my-3">
          <span className="text-4xl block mb-1">
            {isCitizens ? '🏛️ ⚖️' : '👑 🗡️'}
          </span>

          <h1
            className={`font-serif text-2xl sm:text-3xl font-black tracking-widest uppercase mb-1 ${
              isCitizens ? 'text-[#f5d77f]' : 'text-[#f87171]'
            }`}
          >
            {isCitizens ? t.citizensWinTitle : t.mafiaWinTitle}
          </h1>

          <p className="text-xs sm:text-sm text-[#ede3ce] italic max-w-xs mx-auto leading-relaxed">
            {isCitizens ? t.citizensWinDesc : t.mafiaWinDesc}
          </p>
        </div>

        <GoldDivider variant="diamond" className="my-3" />
      </div>

      {/* Role Revelation Board for post-match enjoyment */}
      <div className="w-full bg-[#1b120c] border border-[#c59b27]/60 rounded-sm p-4 my-auto shadow-xl text-start">
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#c59b27]/30">
          <span className="text-[11px] font-serif uppercase tracking-wider text-[#c59b27] font-bold">
            {language === 'ar' ? 'كشف هويات المجلس:' : 'Council Identities Revealed:'}
          </span>
          <span className="text-[10px] text-[#a89078]">
            {language === 'ar' ? 'وفقاً للبطاقات' : 'Match Roster'}
          </span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {players.map((p) => {
            const role = getRoleLabel(p.id);
            const isMafia = p.id === secretRoles.mafiaPlayerId;

            return (
              <div
                key={p.id}
                className={`flex items-center justify-between p-2 rounded-xs border text-xs ${
                  isMafia
                    ? 'bg-[#330f16] border-[#e05b63] text-[#fca5a5]'
                    : 'bg-[#18100a] border-[#c59b27]/30 text-[#ede3ce]'
                }`}
              >
                <span className="font-serif font-bold">
                  {p.name} {!p.isAlive && '☠️'}
                </span>
                <span className="font-semibold tracking-wider uppercase text-[10px] px-2 py-0.5 bg-black/40 rounded-xs">
                  {role}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2.5 mt-6 max-w-xs">
        <CardButton
          variant="gold"
          size="lg"
          fullWidth
          onClick={onPlayAgain}
          className="shadow-[0_0_18px_rgba(197,155,39,0.35)]"
        >
          🔄 {t.playAgain}
        </CardButton>

        <CardButton
          variant="secondary"
          size="md"
          fullWidth
          onClick={onReturnHome}
        >
          🏠 {t.returnHome}
        </CardButton>
      </div>
    </div>
  );
};
