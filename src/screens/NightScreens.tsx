import React, { useState } from 'react';
import { Player, Language } from '../types';
import { translations } from '../i18n';
import { CardButton } from '../components/CardButton';
import { PlayerCard } from '../components/PlayerCard';
import { RolePrompt } from '../components/RolePrompt';
import { GoldDivider } from '../components/GoldDivider';
import { soundManager } from '../sound';

// -------------------------------------------------------------
// 1. NIGHT INTRO SCREEN
// -------------------------------------------------------------
interface NightIntroScreenProps {
  round: number;
  onProceed: () => void;
  language: Language;
}

export const NightIntroScreen: React.FC<NightIntroScreenProps> = ({
  round,
  onProceed,
  language
}) => {
  const t = translations[language];

  return (
    <div className="flex flex-col items-center justify-between min-h-[80vh] py-8 px-4 max-w-md mx-auto text-center animate-fadeIn">
      <div className="my-auto flex flex-col items-center">
        {/* Closed Eyes Emblem with gold aura */}
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full bg-[#1b100a] border-2 border-[#c59b27] flex items-center justify-center shadow-[0_0_30px_rgba(197,155,39,0.25)]">
            <span className="text-5xl select-none">🌙</span>
          </div>
          <div className="absolute -inset-2 rounded-full border border-dashed border-[#c59b27]/30 animate-spin [animation-duration:35s]" />
        </div>

        <span className="text-xs uppercase tracking-widest text-[#c59b27] font-semibold mb-1">
          {language === 'ar' ? `الليلة رقم ${round}` : `Night Phase #${round}`}
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-black text-[#f5d77f] tracking-wide mb-3">
          {t.nightTitle}
        </h1>

        <div className="p-4 bg-[#21140e] border border-[#c59b27]/40 rounded-sm max-w-xs shadow-lg">
          <p className="font-serif text-sm sm:text-base text-[#fbf7ee] leading-relaxed font-bold">
            "{t.closeEyesPrompt}"
          </p>
        </div>

        <p className="text-xs text-[#a89078] italic mt-4 max-w-xs">
          {language === 'ar'
            ? 'تأكد أن جميع اللاعبين مغمضو الأعين ولا ينظرون للهاتف قبل المتابعة.'
            : 'Ensure all players have their eyes firmly shut and heads lowered before proceeding.'}
        </p>
      </div>

      <div className="w-full max-w-xs mt-6">
        <CardButton
          variant="gold"
          size="lg"
          fullWidth
          onClick={() => {
            soundManager.playMafiaWake();
            onProceed();
          }}
          className="shadow-[0_0_20px_rgba(197,155,39,0.3)]"
        >
          {t.beginNightPhase} →
        </CardButton>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. MAFIA IDENTIFICATION SCREEN (Night 1)
// -------------------------------------------------------------
interface MafiaIdentificationScreenProps {
  livingPlayers: Player[];
  onConfirmIdentity: (playerId: string) => void;
  language: Language;
}

export const MafiaIdentificationScreen: React.FC<MafiaIdentificationScreenProps> = ({
  livingPlayers,
  onConfirmIdentity,
  language
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const t = translations[language];

  return (
    <div className="flex flex-col min-h-[85vh] py-4 px-3 sm:px-6 max-w-lg mx-auto w-full animate-fadeIn">
      <RolePrompt
        roleId="mafia"
        title={t.mafiaWakeTitle}
        subtitle={language === 'ar' ? 'المافيا تفتح أعينها بسرية' : 'Mafia opens eyes silently'}
        instruction={t.selectYourName}
      />

      <GoldDivider variant="diamond" className="my-2.5" />

      {/* Living Player selection for Mafia self-identification */}
      <div className="grid grid-cols-2 gap-2.5 my-auto max-h-[52vh] overflow-y-auto pr-1">
        {livingPlayers.map((player, idx) => (
          <PlayerCard
            key={player.id}
            player={player}
            isSelected={selectedId === player.id}
            onSelect={() => setSelectedId(player.id)}
            cardIndex={idx}
          />
        ))}
      </div>

      <GoldDivider variant="simple" className="my-3" />

      <CardButton
        variant="gold"
        size="lg"
        fullWidth
        disabled={!selectedId}
        onClick={() => {
          if (selectedId) {
            onConfirmIdentity(selectedId);
          }
        }}
      >
        {t.confirmIdentity} →
      </CardButton>
    </div>
  );
};

// -------------------------------------------------------------
// 3. MAFIA ACTION SCREEN
// -------------------------------------------------------------
interface MafiaActionScreenProps {
  mafiaPlayerId: string;
  livingPlayers: Player[];
  onConfirmTarget: (targetId: string) => void;
  language: Language;
}

export const MafiaActionScreen: React.FC<MafiaActionScreenProps> = ({
  mafiaPlayerId,
  livingPlayers,
  onConfirmTarget,
  language
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const t = translations[language];

  // Mafia cannot select themselves to eliminate
  const validTargets = livingPlayers.filter((p) => p.id !== mafiaPlayerId);

  return (
    <div className="flex flex-col min-h-[85vh] py-4 px-3 sm:px-6 max-w-lg mx-auto w-full animate-fadeIn">
      <RolePrompt
        roleId="mafia"
        title={t.mafiaWakeTitle}
        subtitle={language === 'ar' ? 'اختر ضحيتك لهذه الليلة' : 'Select your target in silence'}
        instruction={t.mafiaEliminatePrompt}
      />

      <GoldDivider variant="diamond" className="my-2.5" />

      <div className="grid grid-cols-2 gap-2.5 my-auto max-h-[52vh] overflow-y-auto pr-1">
        {validTargets.map((player, idx) => (
          <PlayerCard
            key={player.id}
            player={player}
            isSelected={selectedTargetId === player.id}
            onSelect={() => setSelectedTargetId(player.id)}
            cardIndex={idx}
          />
        ))}
      </div>

      <GoldDivider variant="simple" className="my-3" />

      <CardButton
        variant="primary"
        size="lg"
        fullWidth
        disabled={!selectedTargetId}
        onClick={() => {
          if (selectedTargetId) {
            onConfirmTarget(selectedTargetId);
          }
        }}
      >
        {t.confirmAndSleep} 🌙
      </CardButton>
    </div>
  );
};

// -------------------------------------------------------------
// 4. DETECTIVE IDENTIFICATION SCREEN
// -------------------------------------------------------------
interface DetectiveIdentificationScreenProps {
  livingPlayers: Player[];
  onConfirmIdentity: (playerId: string) => void;
  language: Language;
}

export const DetectiveIdentificationScreen: React.FC<DetectiveIdentificationScreenProps> = ({
  livingPlayers,
  onConfirmIdentity,
  language
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const t = translations[language];

  return (
    <div className="flex flex-col min-h-[85vh] py-4 px-3 sm:px-6 max-w-lg mx-auto w-full animate-fadeIn">
      <RolePrompt
        roleId="detective"
        title={t.detectiveWakeTitle}
        subtitle={language === 'ar' ? 'المحقق يفتح عينيه بسرية' : 'Detective opens eyes in silence'}
        instruction={t.selectYourName}
      />

      <GoldDivider variant="diamond" className="my-2.5" />

      <div className="grid grid-cols-2 gap-2.5 my-auto max-h-[52vh] overflow-y-auto pr-1">
        {livingPlayers.map((player, idx) => (
          <PlayerCard
            key={player.id}
            player={player}
            isSelected={selectedId === player.id}
            onSelect={() => setSelectedId(player.id)}
            cardIndex={idx}
          />
        ))}
      </div>

      <GoldDivider variant="simple" className="my-3" />

      <CardButton
        variant="gold"
        size="lg"
        fullWidth
        disabled={!selectedId}
        onClick={() => {
          if (selectedId) {
            onConfirmIdentity(selectedId);
          }
        }}
      >
        {t.confirmIdentity} →
      </CardButton>
    </div>
  );
};

// -------------------------------------------------------------
// 5. DETECTIVE ACTION SCREEN (with Private Secret Inspection)
// -------------------------------------------------------------
interface DetectiveActionScreenProps {
  detectivePlayerId: string;
  mafiaPlayerId: string | null;
  livingPlayers: Player[];
  onFinished: (targetId: string) => void;
  language: Language;
}

export const DetectiveActionScreen: React.FC<DetectiveActionScreenProps> = ({
  detectivePlayerId,
  mafiaPlayerId,
  livingPlayers,
  onFinished,
  language
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [revealedResult, setRevealedResult] = useState<'MAFIA' | 'INNOCENT' | null>(null);
  const t = translations[language];

  // Detective cannot inspect themselves
  const validTargets = livingPlayers.filter((p) => p.id !== detectivePlayerId);

  const handleInspect = () => {
    if (!selectedTargetId) return;
    const isMafia = selectedTargetId === mafiaPlayerId;
    if (isMafia) {
      soundManager.playTensionPulse();
      soundManager.haptic(50);
    } else {
      soundManager.playMysticChime();
      soundManager.haptic(25);
    }
    setRevealedResult(isMafia ? 'MAFIA' : 'INNOCENT');
  };

  const handleNextAndConceal = () => {
    if (!selectedTargetId) return;
    onFinished(selectedTargetId);
  };

  // If inspection already triggered, show strict private result
  if (revealedResult) {
    const inspectedPlayer = livingPlayers.find((p) => p.id === selectedTargetId);

    return (
      <div className="flex flex-col items-center justify-between min-h-[85vh] py-6 px-4 max-w-md mx-auto text-center animate-fadeIn">
        <div className="my-auto w-full">
          <div className="w-16 h-16 rounded-full bg-[#172033] border-2 border-[#c59b27] flex items-center justify-center text-3xl mx-auto mb-3 shadow-[0_0_20px_rgba(197,155,39,0.3)]">
            🔍
          </div>

          <h3 className="font-serif text-sm uppercase tracking-widest text-[#c59b27] mb-1">
            {t.investigationResult}
          </h3>

          <p className="text-xs text-[#c7b095] mb-4">
            {language === 'ar' ? 'فحص المشتبه به:' : 'Inspected Citizen:'}{' '}
            <strong className="text-[#f5d77f]">{inspectedPlayer?.name}</strong>
          </p>

          <GoldDivider variant="diamond" className="my-3" />

          {/* Private Result Badge */}
          <div
            className={`p-6 rounded-sm border-2 my-4 shadow-xl ${
              revealedResult === 'MAFIA'
                ? 'bg-[#3d0f17] border-[#ff6b6b] text-[#ffdddd]'
                : 'bg-[#152e1b] border-[#55b868] text-[#d4f7d4]'
            }`}
          >
            <span className="text-3xl block mb-2">
              {revealedResult === 'MAFIA' ? '☠️' : '⚖️'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-black tracking-widest uppercase">
              {revealedResult === 'MAFIA' ? t.targetIsMafia : t.targetIsInnocent}
            </h2>
          </div>

          <div className="p-3 bg-[#1e140d] border border-[#c59b27]/40 rounded-xs text-start mt-4">
            <p className="text-xs text-[#fca5a5] font-semibold flex items-center gap-1.5">
              <span>🔒</span> {t.secretResultNotice}
            </p>
          </div>
        </div>

        <div className="w-full max-w-xs mt-6">
          <CardButton
            variant="gold"
            size="lg"
            fullWidth
            onClick={handleNextAndConceal}
          >
            {t.nextSleep} 🌙
          </CardButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[85vh] py-4 px-3 sm:px-6 max-w-lg mx-auto w-full animate-fadeIn">
      <RolePrompt
        roleId="detective"
        title={t.detectiveWakeTitle}
        subtitle={language === 'ar' ? 'افحص المشتبه به لمعرفة هويته' : 'Select a citizen to inspect under secrecy'}
        instruction={t.detectiveInvestigatePrompt}
      />

      <GoldDivider variant="diamond" className="my-2.5" />

      <div className="grid grid-cols-2 gap-2.5 my-auto max-h-[52vh] overflow-y-auto pr-1">
        {validTargets.map((player, idx) => (
          <PlayerCard
            key={player.id}
            player={player}
            isSelected={selectedTargetId === player.id}
            onSelect={() => setSelectedTargetId(player.id)}
            cardIndex={idx}
          />
        ))}
      </div>

      <GoldDivider variant="simple" className="my-3" />

      <CardButton
        variant="gold"
        size="lg"
        fullWidth
        disabled={!selectedTargetId}
        onClick={handleInspect}
      >
        🔍 {t.inspectTarget}
      </CardButton>
    </div>
  );
};

// -------------------------------------------------------------
// 6. DOCTOR IDENTIFICATION SCREEN
// -------------------------------------------------------------
interface DoctorIdentificationScreenProps {
  livingPlayers: Player[];
  onConfirmIdentity: (playerId: string) => void;
  language: Language;
}

export const DoctorIdentificationScreen: React.FC<DoctorIdentificationScreenProps> = ({
  livingPlayers,
  onConfirmIdentity,
  language
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const t = translations[language];

  return (
    <div className="flex flex-col min-h-[85vh] py-4 px-3 sm:px-6 max-w-lg mx-auto w-full animate-fadeIn">
      <RolePrompt
        roleId="doctor"
        title={t.doctorWakeTitle}
        subtitle={language === 'ar' ? 'الطبيب يفتح عينيه بسرية' : 'Doctor awakens in silence'}
        instruction={t.selectYourName}
      />

      <GoldDivider variant="diamond" className="my-2.5" />

      <div className="grid grid-cols-2 gap-2.5 my-auto max-h-[52vh] overflow-y-auto pr-1">
        {livingPlayers.map((player, idx) => (
          <PlayerCard
            key={player.id}
            player={player}
            isSelected={selectedId === player.id}
            onSelect={() => setSelectedId(player.id)}
            cardIndex={idx}
          />
        ))}
      </div>

      <GoldDivider variant="simple" className="my-3" />

      <CardButton
        variant="gold"
        size="lg"
        fullWidth
        disabled={!selectedId}
        onClick={() => {
          if (selectedId) {
            onConfirmIdentity(selectedId);
          }
        }}
      >
        {t.confirmIdentity} →
      </CardButton>
    </div>
  );
};

// -------------------------------------------------------------
// 7. DOCTOR ACTION SCREEN
// -------------------------------------------------------------
interface DoctorActionScreenProps {
  livingPlayers: Player[];
  onConfirmTarget: (targetId: string) => void;
  language: Language;
}

export const DoctorActionScreen: React.FC<DoctorActionScreenProps> = ({
  livingPlayers,
  onConfirmTarget,
  language
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const t = translations[language];

  return (
    <div className="flex flex-col min-h-[85vh] py-4 px-3 sm:px-6 max-w-lg mx-auto w-full animate-fadeIn">
      <RolePrompt
        roleId="doctor"
        title={t.doctorWakeTitle}
        subtitle={language === 'ar' ? 'قدم الترياق لحماية أحد اللاعبين' : 'Administer the antidote to protect tonight'}
        instruction={t.doctorProtectPrompt}
      />

      <GoldDivider variant="diamond" className="my-2.5" />

      <div className="grid grid-cols-2 gap-2.5 my-auto max-h-[52vh] overflow-y-auto pr-1">
        {livingPlayers.map((player, idx) => (
          <PlayerCard
            key={player.id}
            player={player}
            isSelected={selectedTargetId === player.id}
            onSelect={() => setSelectedTargetId(player.id)}
            cardIndex={idx}
          />
        ))}
      </div>

      <GoldDivider variant="simple" className="my-3" />

      <CardButton
        variant="primary"
        size="lg"
        fullWidth
        disabled={!selectedTargetId}
        onClick={() => {
          if (selectedTargetId) {
            onConfirmTarget(selectedTargetId);
          }
        }}
      >
        {t.confirmAndSleep} 🌙
      </CardButton>
    </div>
  );
};
