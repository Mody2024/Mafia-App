import React, { useState, useEffect } from 'react';
import {
  GameState,
  Player,
  SecretRoles,
  NightTargets,
  GameSettings,
  VictoryTeam,
  VoteRecord,
  ChronicleEntry
} from './types';
import { soundManager } from './sound';
import { HomeScreen } from './screens/HomeScreen';
import { PlayerSetupScreen } from './screens/PlayerSetupScreen';
import { GameReadyScreen } from './screens/GameReadyScreen';
import {
  NightIntroScreen,
  MafiaIdentificationScreen,
  MafiaActionScreen,
  DetectiveIdentificationScreen,
  DetectiveActionScreen,
  DoctorIdentificationScreen,
  DoctorActionScreen
} from './screens/NightScreens';
import { PrivacyTransition } from './components/PrivacyTransition';
import { ResultReveal } from './components/ResultReveal';
import { DayDiscussionScreen } from './screens/DayDiscussionScreen';
import { DayVotingScreen } from './screens/DayVotingScreen';
import { VoteResultScreen } from './screens/VoteResultScreen';
import { VictoryScreen } from './screens/VictoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { HowToPlayDialog } from './screens/HowToPlayDialog';
import { AndroidCodeExportDialog } from './screens/AndroidCodeExportDialog';
import { ModeratorDrawer } from './components/ModeratorDrawer';

const DEFAULT_SETTINGS: GameSettings = {
  language: 'en',
  transitionDelay: 6,
  soundEffects: true,
  ambientAudio: false,
  masterVolume: 0.8,
  discussionMinutes: 5,
  tieBehavior: 'no_elimination',
  customLogoUrl: null,
  enableDetective: true,
  enableDoctor: true,
  hapticFeedback: true
};

export default function App() {
  // 1. Settings State (persisted offline in localStorage)
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('mafia_moderator_settings');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
      // Auto-detect Arabic language from device if supported
      const navLang = navigator.language?.toLowerCase() || '';
      if (navLang.startsWith('ar')) {
        return { ...DEFAULT_SETTINGS, language: 'ar' };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  // 2. Modals State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isAndroidCodeOpen, setIsAndroidCodeOpen] = useState(false);
  const [isModeratorDrawerOpen, setIsModeratorDrawerOpen] = useState(false);

  // 3. Core Match State (Memory-Only, strictly never persisted to disk)
  const [gameState, setGameState] = useState<GameState>('HOME');
  const [roundNumber, setRoundNumber] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);

  // Match Chronicle (live events history)
  const [chronicle, setChronicle] = useState<ChronicleEntry[]>([]);

  // Secret Role Identifications (learned during night)
  const [secretRoles, setSecretRoles] = useState<SecretRoles>({
    mafiaPlayerId: null,
    detectivePlayerId: null,
    doctorPlayerId: null
  });

  // Night Targets
  const [nightTargets, setNightTargets] = useState<NightTargets>({
    mafiaTarget: null,
    detectiveTarget: null,
    doctorTarget: null
  });

  // Morning Resolution Cache
  const [morningVictimName, setMorningVictimName] = useState<string | null>(null);
  const [wasSavedByDoctor, setWasSavedByDoctor] = useState(false);

  // Voting Cache
  const [dayVotes, setDayVotes] = useState<VoteRecord[]>([]);

  // Victory Team
  const [winningTeam, setWinningTeam] = useState<VictoryTeam>(null);

  // Add an entry to the chronicle
  const addChronicleEntry = (
    phase: 'night' | 'day' | 'system',
    type: 'kill' | 'save' | 'investigate' | 'vote' | 'system',
    descriptionEn: string,
    descriptionAr: string
  ) => {
    const newEntry: ChronicleEntry = {
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      round: roundNumber,
      phase,
      timestamp: Date.now(),
      type,
      descriptionEn,
      descriptionAr
    };
    setChronicle((prev) => [newEntry, ...prev]);
  };

  // Sync Audio Engine on config change
  useEffect(() => {
    soundManager.updateConfig(
      settings.soundEffects,
      settings.ambientAudio,
      settings.masterVolume
    );
  }, [settings]);

  // Ambient sound management during night phases
  useEffect(() => {
    const isNightPhase = [
      'NIGHT_INTRO',
      'MAFIA_IDENTIFICATION',
      'MAFIA_ACTION',
      'MAFIA_TRANSITION',
      'DETECTIVE_IDENTIFICATION',
      'DETECTIVE_ACTION',
      'DETECTIVE_TRANSITION',
      'DOCTOR_IDENTIFICATION',
      'DOCTOR_ACTION',
      'MORNING_TRANSITION'
    ].includes(gameState);

    if (isNightPhase && settings.ambientAudio) {
      soundManager.startAmbient();
    } else {
      soundManager.stopAmbient();
    }

    return () => {
      soundManager.stopAmbient();
    };
  }, [gameState, settings.ambientAudio]);

  // Save Settings to LocalStorage
  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('mafia_moderator_settings', JSON.stringify(newSettings));
    } catch {
      // ignore
    }
  };

  // Living players selector
  const livingPlayers = players.filter((p) => p.isAlive);

  // Victory Checker
  // Citizens win when no Mafia remain.
  // Mafia win when Mafia count is >= remaining non-Mafia players.
  const checkVictoryCondition = (currentLiving: Player[], currentRoles: SecretRoles): boolean => {
    if (!currentRoles.mafiaPlayerId) return false;

    const isMafiaAlive = currentLiving.some((p) => p.id === currentRoles.mafiaPlayerId);
    const aliveMafiaCount = isMafiaAlive ? 1 : 0;
    const aliveCitizensCount = currentLiving.filter(
      (p) => p.id !== currentRoles.mafiaPlayerId
    ).length;

    if (aliveMafiaCount === 0) {
      setWinningTeam('citizens');
      setGameState('VICTORY');
      addChronicleEntry(
        'system',
        'system',
        'Citizens eliminated all Mafia members and claimed victory!',
        'انتصر المواطنون الشرفاء بعد القضاء على المافيا وعم الأمان المدينة!'
      );
      return true;
    }

    if (aliveMafiaCount >= aliveCitizensCount) {
      setWinningTeam('mafia');
      setGameState('VICTORY');
      addChronicleEntry(
        'system',
        'system',
        'Mafia reached parity with the citizens and took over the Council!',
        'سيطرت المافيا على المجلس بعد تصفية أغلبية المواطنين وأعلنت هيمنتها!'
      );
      return true;
    }

    return false;
  };

  // -------------------------------------------------------------
  // Transition Actions
  // -------------------------------------------------------------

  const handleStartNewGame = () => {
    soundManager.playConfirmation();
    setGameState('PLAYER_SETUP');
  };

  const handleStartNight = () => {
    soundManager.playNightStart();
    setNightTargets({
      mafiaTarget: null,
      detectiveTarget: null,
      doctorTarget: null
    });
    addChronicleEntry(
      'night',
      'system',
      `Round #${roundNumber} Night Phase begins. All citizens sleep.`,
      `بدأت ليلة الجولة رقم ${roundNumber}. نام جميع سكان المدينة.`
    );
    setGameState('NIGHT_INTRO');
  };

  const handleAwakenMafia = () => {
    if (secretRoles.mafiaPlayerId) {
      const isMafiaAlive = livingPlayers.some((p) => p.id === secretRoles.mafiaPlayerId);
      if (isMafiaAlive) {
        setGameState('MAFIA_ACTION');
      } else {
        setGameState('MAFIA_TRANSITION');
      }
    } else {
      setGameState('MAFIA_IDENTIFICATION');
    }
  };

  const handleConfirmMafiaIdentity = (mafiaId: string) => {
    soundManager.playConfirmation();
    setSecretRoles((prev) => ({ ...prev, mafiaPlayerId: mafiaId }));
    setGameState('MAFIA_ACTION');
  };

  const handleConfirmMafiaTarget = (targetId: string) => {
    soundManager.playConfirmation();
    setNightTargets((prev) => ({ ...prev, mafiaTarget: targetId }));
    const victim = players.find((p) => p.id === targetId);
    addChronicleEntry(
      'night',
      'kill',
      `Mafia targeted ${victim?.name || 'a citizen'} under cover of darkness.`,
      `حددت المافيا ${victim?.name || 'مواطناً'} كهدف للاغتيال في الظلام.`
    );
    setGameState('MAFIA_TRANSITION');
  };

  const handleMafiaTransitionComplete = () => {
    if (settings.enableDetective !== false) {
      if (secretRoles.detectivePlayerId) {
        const isDetectiveAlive = livingPlayers.some((p) => p.id === secretRoles.detectivePlayerId);
        if (isDetectiveAlive) {
          setGameState('DETECTIVE_ACTION');
        } else {
          setGameState('DETECTIVE_TRANSITION');
        }
      } else {
        setGameState('DETECTIVE_IDENTIFICATION');
      }
    } else {
      // Detective disabled: proceed directly to doctor phase
      handleDetectiveTransitionComplete();
    }
  };

  const handleConfirmDetectiveIdentity = (detectiveId: string) => {
    soundManager.playConfirmation();
    setSecretRoles((prev) => ({ ...prev, detectivePlayerId: detectiveId }));
    setGameState('DETECTIVE_ACTION');
  };

  const handleConfirmDetectiveTarget = (targetId: string) => {
    soundManager.playConfirmation();
    setNightTargets((prev) => ({ ...prev, detectiveTarget: targetId }));
    const inspected = players.find((p) => p.id === targetId);
    const isTargetMafia = targetId === secretRoles.mafiaPlayerId;
    addChronicleEntry(
      'night',
      'investigate',
      `Detective examined ${inspected?.name} (${isTargetMafia ? 'Mafia' : 'Innocent'}).`,
      `فحص المحقق ${inspected?.name} وتأكد من كونه (${isTargetMafia ? 'مافيا' : 'بريء'}).`
    );
    setGameState('DETECTIVE_TRANSITION');
  };

  const handleDetectiveTransitionComplete = () => {
    if (settings.enableDoctor !== false) {
      if (secretRoles.doctorPlayerId) {
        const isDoctorAlive = livingPlayers.some((p) => p.id === secretRoles.doctorPlayerId);
        if (isDoctorAlive) {
          setGameState('DOCTOR_ACTION');
        } else {
          setGameState('MORNING_TRANSITION');
        }
      } else {
        setGameState('DOCTOR_IDENTIFICATION');
      }
    } else {
      // Doctor disabled: resolve night kill directly without protection
      resolveNightWithoutDoctor();
    }
  };

  const resolveNightWithoutDoctor = () => {
    const { mafiaTarget } = nightTargets;
    if (mafiaTarget) {
      const victim = players.find((p) => p.id === mafiaTarget);
      setMorningVictimName(victim ? victim.name : null);
      setWasSavedByDoctor(false);
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === mafiaTarget
            ? { ...p, isAlive: false, eliminatedInRound: roundNumber, eliminatedReason: 'mafia', eliminatedInPhase: 'night' }
            : p
        )
      );
      addChronicleEntry(
        'night',
        'kill',
        `${victim?.name} fell during the night.`,
        `لقي ${victim?.name} مصرعه أثناء الليل.`
      );
    } else {
      setMorningVictimName(null);
      setWasSavedByDoctor(false);
    }
    setGameState('MORNING_TRANSITION');
  };

  const handleConfirmDoctorIdentity = (doctorId: string) => {
    soundManager.playConfirmation();
    setSecretRoles((prev) => ({ ...prev, doctorPlayerId: doctorId }));
    setGameState('DOCTOR_ACTION');
  };

  const handleConfirmDoctorTarget = (targetId: string) => {
    soundManager.playConfirmation();
    const currentNightTargets = { ...nightTargets, doctorTarget: targetId };
    setNightTargets(currentNightTargets);

    const docPatient = players.find((p) => p.id === targetId);
    addChronicleEntry(
      'night',
      'save',
      `Doctor administered protection to ${docPatient?.name}.`,
      `قدم الطبيب ترياق الحماية لـ ${docPatient?.name}.`
    );

    // Automatic Night Resolution logic
    const { mafiaTarget } = currentNightTargets;
    const doctorTarget = targetId;

    if (mafiaTarget && mafiaTarget === doctorTarget) {
      // Doctor saved the victim!
      setMorningVictimName(null);
      setWasSavedByDoctor(true);
      addChronicleEntry(
        'night',
        'save',
        `Doctor's antidote successfully countered the Mafia assassination!`,
        `أبطل ترياق الطبيب محاولة اغتيال المافيا بنجاح وعاش المستهدف!`
      );
    } else if (mafiaTarget) {
      // Victim eliminated
      const victim = players.find((p) => p.id === mafiaTarget);
      setMorningVictimName(victim ? victim.name : null);
      setWasSavedByDoctor(false);

      setPlayers((prev) =>
        prev.map((p) =>
          p.id === mafiaTarget
            ? { ...p, isAlive: false, eliminatedInRound: roundNumber, eliminatedReason: 'mafia', eliminatedInPhase: 'night' }
            : p
        )
      );
      addChronicleEntry(
        'night',
        'kill',
        `${victim?.name} was eliminated by the Mafia during the night.`,
        `اغتالت المافيا ${victim?.name} في هدوء الليل.`
      );
    } else {
      setMorningVictimName(null);
      setWasSavedByDoctor(false);
    }

    setGameState('MORNING_TRANSITION');
  };

  const handleMorningTransitionComplete = () => {
    setGameState('MORNING_RESULT');
  };

  const handleProceedFromMorningResult = () => {
    const currentLiving = players.filter((p) => p.isAlive);
    const hasWon = checkVictoryCondition(currentLiving, secretRoles);
    if (!hasWon) {
      addChronicleEntry(
        'day',
        'system',
        `Day #${roundNumber} discussion started.`,
        `بدأت جلسة المداولات النهارية للجولة رقم ${roundNumber}.`
      );
      setGameState('DAY_DISCUSSION');
    }
  };

  const handleProceedToVoting = () => {
    soundManager.playConfirmation();
    setGameState('DAY_VOTING');
  };

  const handleAllVotesComplete = (votes: VoteRecord[]) => {
    setDayVotes(votes);
    setGameState('VOTE_RESULT');
  };

  const handleProceedFromVoteResult = (eliminatedIds: string[]) => {
    soundManager.playConfirmation();

    let updatedLiving = livingPlayers;

    if (eliminatedIds.length > 0) {
      const fallen = livingPlayers.filter((p) => eliminatedIds.includes(p.id));
      setPlayers((prev) =>
        prev.map((p) =>
          eliminatedIds.includes(p.id)
            ? { ...p, isAlive: false, eliminatedInRound: roundNumber, eliminatedReason: 'vote', eliminatedInPhase: 'day' }
            : p
        )
      );
      updatedLiving = livingPlayers.filter((p) => !eliminatedIds.includes(p.id));
      addChronicleEntry(
        'day',
        'vote',
        `Council eliminated: ${fallen.map((p) => p.name).join(', ')}.`,
        `أقصى المجلس بتصويت الأغلبية: ${fallen.map((p) => p.name).join(' و ')}.`
      );
    } else {
      addChronicleEntry(
        'day',
        'vote',
        `Council vote concluded with no elimination.`,
        `انتهى تصويت المجلس دون إقصاء أي لاعب.`
      );
    }

    // Check Victory
    const hasWon = checkVictoryCondition(updatedLiving, secretRoles);
    if (!hasWon) {
      setRoundNumber((prev) => prev + 1);
      setGameState('NIGHT_INTRO');
    }
  };

  const handlePlayAgain = () => {
    soundManager.playConfirmation();
    setPlayers((prev) => prev.map((p) => ({ ...p, isAlive: true, eliminatedInRound: undefined, eliminatedReason: undefined, eliminatedInPhase: undefined })));
    setSecretRoles({
      mafiaPlayerId: null,
      detectivePlayerId: null,
      doctorPlayerId: null
    });
    setNightTargets({
      mafiaTarget: null,
      detectiveTarget: null,
      doctorTarget: null
    });
    setChronicle([]);
    setRoundNumber(1);
    setWinningTeam(null);
    setGameState('GAME_READY');
  };

  const handleReturnHome = () => {
    soundManager.playConfirmation();
    setSecretRoles({
      mafiaPlayerId: null,
      detectivePlayerId: null,
      doctorPlayerId: null
    });
    setNightTargets({
      mafiaTarget: null,
      detectiveTarget: null,
      doctorTarget: null
    });
    setWinningTeam(null);
    setRoundNumber(1);
    setChronicle([]);
    setGameState('HOME');
  };

  return (
    <div
      dir={settings.language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#140d09] text-[#ede3ce] font-serif flex flex-col justify-between selection:bg-[#c59b27]/30"
    >
      {/* Universal Top Ambient Bar */}
      <header className="w-full max-w-lg mx-auto flex items-center justify-between px-3 py-2 border-b border-[#c59b27]/30 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#c59b27] text-sm">♦</span>
          <span className="font-bold tracking-wider uppercase text-[#f5d77f]">
            {settings.language === 'ar' ? 'مافيا' : 'MAFIA'}
          </span>
          <span className="text-[10px] text-[#a89078] hidden sm:inline">
            • {settings.language === 'ar' ? 'المنظم الأوفلاين' : 'Offline Moderator'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Language Toggle */}
          <button
            type="button"
            onClick={() => {
              soundManager.playConfirmation();
              handleUpdateSettings({
                ...settings,
                language: settings.language === 'ar' ? 'en' : 'ar'
              });
            }}
            className="text-[11px] px-2 py-0.5 bg-[#1f130b] border border-[#c59b27]/40 hover:border-[#f5d77f] text-[#c7b095] hover:text-[#f5d77f] rounded-xs font-serif cursor-pointer transition-colors"
            title="Switch Language / تبديل اللغة"
          >
            {settings.language === 'ar' ? 'EN' : 'عربي'}
          </button>

          {/* Moderator Chamber Drawer Button */}
          <button
            type="button"
            onClick={() => {
              soundManager.playConfirmation();
              setIsModeratorDrawerOpen(true);
            }}
            className="flex items-center gap-1 px-2 py-0.5 bg-[#2a170d] hover:bg-[#3d2314] border border-[#c59b27]/60 hover:border-[#f5d77f] rounded-xs text-[#f5d77f] text-xs font-serif cursor-pointer transition-colors"
            title={settings.language === 'ar' ? 'غرفة المنظم' : 'Moderator Chamber'}
          >
            <span>📜</span>
            <span className="text-[11px] hidden xs:inline">
              {settings.language === 'ar' ? 'غرفة المنظم' : 'Chamber'}
            </span>
          </button>

          {/* Audio State Icon */}
          <button
            type="button"
            onClick={() => {
              const newSoundState = !settings.soundEffects;
              handleUpdateSettings({ ...settings, soundEffects: newSoundState });
            }}
            className="text-[#c7b095] hover:text-[#f5d77f] p-1 cursor-pointer text-xs"
            title={settings.soundEffects ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {settings.soundEffects ? '🔊' : '🔇'}
          </button>

          {/* Quick Settings Icon */}
          <button
            type="button"
            onClick={() => {
              soundManager.playConfirmation();
              setIsSettingsOpen(true);
            }}
            className="text-[#c7b095] hover:text-[#f5d77f] p-1 cursor-pointer text-xs"
            title="Settings"
          >
            ⚙️
          </button>

          {/* Quick Rules Icon */}
          <button
            type="button"
            onClick={() => {
              soundManager.playConfirmation();
              setIsRulesOpen(true);
            }}
            className="text-[#c7b095] hover:text-[#f5d77f] p-1 cursor-pointer text-xs"
            title="Rules"
          >
            📜
          </button>
        </div>
      </header>

      {/* Main Game Screen Router */}
      <main className="flex-1 flex flex-col justify-center px-2 sm:px-4 py-2">
        {gameState === 'HOME' && (
          <HomeScreen
            customLogoUrl={settings.customLogoUrl}
            language={settings.language}
            onNewGame={handleStartNewGame}
            onHowToPlay={() => setIsRulesOpen(true)}
            onSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {gameState === 'PLAYER_SETUP' && (
          <PlayerSetupScreen
            players={players}
            onPlayersChange={setPlayers}
            onStartGame={() => setGameState('GAME_READY')}
            onBack={() => setGameState('HOME')}
            language={settings.language}
          />
        )}

        {gameState === 'GAME_READY' && (
          <GameReadyScreen
            players={players}
            customLogoUrl={settings.customLogoUrl}
            onStartNight={handleStartNight}
            onBackToSetup={() => setGameState('PLAYER_SETUP')}
            language={settings.language}
          />
        )}

        {gameState === 'NIGHT_INTRO' && (
          <NightIntroScreen
            round={roundNumber}
            onProceed={handleAwakenMafia}
            language={settings.language}
          />
        )}

        {gameState === 'MAFIA_IDENTIFICATION' && (
          <MafiaIdentificationScreen
            livingPlayers={livingPlayers}
            onConfirmIdentity={handleConfirmMafiaIdentity}
            language={settings.language}
          />
        )}

        {gameState === 'MAFIA_ACTION' && secretRoles.mafiaPlayerId && (
          <MafiaActionScreen
            mafiaPlayerId={secretRoles.mafiaPlayerId}
            livingPlayers={livingPlayers}
            onConfirmTarget={handleConfirmMafiaTarget}
            language={settings.language}
          />
        )}

        {gameState === 'MAFIA_TRANSITION' && (
          <PrivacyTransition
            durationSeconds={settings.transitionDelay}
            language={settings.language}
            nextRoleCueSound={() => soundManager.playDetectiveWake()}
            onComplete={handleMafiaTransitionComplete}
          />
        )}

        {gameState === 'DETECTIVE_IDENTIFICATION' && (
          <DetectiveIdentificationScreen
            livingPlayers={livingPlayers}
            onConfirmIdentity={handleConfirmDetectiveIdentity}
            language={settings.language}
          />
        )}

        {gameState === 'DETECTIVE_ACTION' && secretRoles.detectivePlayerId && (
          <DetectiveActionScreen
            detectivePlayerId={secretRoles.detectivePlayerId}
            mafiaPlayerId={secretRoles.mafiaPlayerId}
            livingPlayers={livingPlayers}
            onFinished={handleConfirmDetectiveTarget}
            language={settings.language}
          />
        )}

        {gameState === 'DETECTIVE_TRANSITION' && (
          <PrivacyTransition
            durationSeconds={settings.transitionDelay}
            language={settings.language}
            nextRoleCueSound={() => soundManager.playDoctorWake()}
            onComplete={handleDetectiveTransitionComplete}
          />
        )}

        {gameState === 'DOCTOR_IDENTIFICATION' && (
          <DoctorIdentificationScreen
            livingPlayers={livingPlayers}
            onConfirmIdentity={handleConfirmDoctorIdentity}
            language={settings.language}
          />
        )}

        {gameState === 'DOCTOR_ACTION' && (
          <DoctorActionScreen
            livingPlayers={livingPlayers}
            onConfirmTarget={handleConfirmDoctorTarget}
            language={settings.language}
          />
        )}

        {gameState === 'MORNING_TRANSITION' && (
          <PrivacyTransition
            durationSeconds={settings.transitionDelay}
            language={settings.language}
            nextRoleCueSound={() => soundManager.playMorning()}
            onComplete={handleMorningTransitionComplete}
            subtitleOverride={
              settings.language === 'ar'
                ? 'تتلاشى أصوات الليل الغامضة... وتشرق شمس الصباح على المدينة.'
                : 'The shadows recede... Dawn arrives upon the council.'
            }
          />
        )}

        {gameState === 'MORNING_RESULT' && (
          <ResultReveal
            eliminatedPlayerName={morningVictimName}
            savedByDoctor={wasSavedByDoctor}
            onProceed={handleProceedFromMorningResult}
            proceedButtonText={
              settings.language === 'ar' ? 'بدء نقاش النهار' : 'Convene Council Discussion'
            }
            language={settings.language}
          />
        )}

        {gameState === 'DAY_DISCUSSION' && (
          <DayDiscussionScreen
            round={roundNumber}
            livingPlayers={livingPlayers}
            discussionMinutes={settings.discussionMinutes}
            onProceedToVoting={handleProceedToVoting}
            language={settings.language}
          />
        )}

        {gameState === 'DAY_VOTING' && (
          <DayVotingScreen
            livingPlayers={livingPlayers}
            onVotesComplete={handleAllVotesComplete}
            language={settings.language}
          />
        )}

        {gameState === 'VOTE_RESULT' && (
          <VoteResultScreen
            votes={dayVotes}
            livingPlayers={livingPlayers}
            tieBehavior={settings.tieBehavior}
            onProceed={handleProceedFromVoteResult}
            language={settings.language}
          />
        )}

        {gameState === 'VICTORY' && (
          <VictoryScreen
            winningTeam={winningTeam}
            players={players}
            secretRoles={secretRoles}
            customLogoUrl={settings.customLogoUrl}
            onPlayAgain={handlePlayAgain}
            onReturnHome={handleReturnHome}
            language={settings.language}
          />
        )}
      </main>

      {/* Global Moderator Chamber Drawer */}
      <ModeratorDrawer
        isOpen={isModeratorDrawerOpen}
        onClose={() => setIsModeratorDrawerOpen(false)}
        currentRound={roundNumber}
        players={players}
        chronicle={chronicle}
        language={settings.language}
        onAbandonMatch={handleReturnHome}
      />

      {/* Global Modals */}
      <SettingsScreen
        isOpen={isSettingsOpen}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onClose={() => setIsSettingsOpen(false)}
        onOpenAndroidExport={() => {
          setIsSettingsOpen(false);
          setIsAndroidCodeOpen(true);
        }}
      />

      <HowToPlayDialog
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        language={settings.language}
      />

      <AndroidCodeExportDialog
        isOpen={isAndroidCodeOpen}
        onClose={() => setIsAndroidCodeOpen(false)}
        language={settings.language}
      />
    </div>
  );
}
