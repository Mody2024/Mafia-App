import React, { useState } from 'react';
import { Player, VoteRecord, Language } from '../types';
import { translations } from '../i18n';
import { CardButton } from '../components/CardButton';
import { PlayerCard } from '../components/PlayerCard';
import { GoldDivider } from '../components/GoldDivider';
import { soundManager } from '../sound';

interface DayVotingScreenProps {
  livingPlayers: Player[];
  onVotesComplete: (votes: VoteRecord[]) => void;
  language: Language;
}

export const DayVotingScreen: React.FC<DayVotingScreenProps> = ({
  livingPlayers,
  onVotesComplete,
  language
}) => {
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [collectedVotes, setCollectedVotes] = useState<VoteRecord[]>([]);
  const [isInterimConcealed, setIsInterimConcealed] = useState(false);

  const t = translations[language];
  const currentVoter = livingPlayers[currentVoterIndex];

  // Candidates for this voter (cannot vote for self)
  const validCandidates = livingPlayers.filter((p) => p.id !== currentVoter?.id);

  const handleUnlockBallot = () => {
    soundManager.playConfirmation();
    setIsUnlocked(true);
    setSelectedTargetId(null);
  };

  const handleCastVote = () => {
    if (!selectedTargetId || !currentVoter) return;

    soundManager.playConfirmation();

    const newRecord: VoteRecord = {
      voterId: currentVoter.id,
      targetId: selectedTargetId
    };

    const updated = [...collectedVotes, newRecord];
    setCollectedVotes(updated);

    // Immediately hide private vote!
    setSelectedTargetId(null);
    setIsUnlocked(false);

    if (currentVoterIndex + 1 < livingPlayers.length) {
      setIsInterimConcealed(true);
    } else {
      // All voters done
      soundManager.playVoteReveal();
      onVotesComplete(updated);
    }
  };

  const handleAdvanceToNextVoter = () => {
    soundManager.playConfirmation();
    setIsInterimConcealed(false);
    setCurrentVoterIndex((prev) => prev + 1);
  };

  // Safe Interim Concealment between passes
  if (isInterimConcealed) {
    const nextPlayer = livingPlayers[currentVoterIndex + 1];

    return (
      <div className="flex flex-col items-center justify-between min-h-[85vh] py-8 px-4 max-w-md mx-auto text-center animate-fadeIn">
        <div className="my-auto">
          <div className="w-16 h-16 rounded-full bg-[#1b2b1b] border-2 border-[#55b868] flex items-center justify-center text-3xl mx-auto mb-4">
            ✓
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#f5d77f] mb-1">
            {t.voteRecorded}
          </h2>

          <p className="text-xs text-[#a89078] max-w-xs mx-auto mb-6">
            {t.passToNextPlayer}
          </p>

          <GoldDivider variant="diamond" className="my-4" />

          {nextPlayer && (
            <div className="p-4 bg-[#20150e] border border-[#c59b27] rounded-sm max-w-xs mx-auto shadow-lg">
              <span className="text-[10px] uppercase tracking-wider text-[#a89078] block mb-1">
                {t.passPhoneTo}
              </span>
              <h3 className="font-serif text-xl font-bold text-[#f5d77f]">
                {nextPlayer.name}
              </h3>
            </div>
          )}
        </div>

        <div className="w-full max-w-xs mt-6">
          <CardButton
            variant="gold"
            size="lg"
            fullWidth
            onClick={handleAdvanceToNextVoter}
          >
            {language === 'ar' ? 'التالي ←' : 'Proceed →'}
          </CardButton>
        </div>
      </div>
    );
  }

  // Gate Screen: device is passed to current voter
  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-between min-h-[85vh] py-8 px-4 max-w-md mx-auto text-center animate-fadeIn">
        <div className="my-auto w-full">
          <div className="w-16 h-16 rounded-full bg-[#241710] border-2 border-[#c59b27] flex items-center justify-center text-3xl mx-auto mb-4 shadow-[0_0_20px_rgba(197,155,39,0.3)]">
            🗳️
          </div>

          <span className="text-xs uppercase tracking-widest text-[#c59b27] font-semibold">
            {t.dayVotingTitle} ({currentVoterIndex + 1}/{livingPlayers.length})
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f5d77f] tracking-wide mt-2 mb-4">
            {t.passPhoneTo}
          </h2>

          {/* Target Voter Card */}
          <div className="p-5 bg-gradient-to-b from-[#3b1912] to-[#24100b] border-2 border-[#c59b27] rounded-sm max-w-xs mx-auto shadow-xl">
            <span className="text-[10px] text-[#f5d77f] uppercase tracking-wider font-semibold block mb-1">
              {language === 'ar' ? 'عضو المجلس الحالي' : 'Active Council Voter'}
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#fbf7ee]">
              {currentVoter?.name}
            </h3>
          </div>

          <p className="text-xs text-[#a89078] italic mt-4 max-w-xs mx-auto">
            {language === 'ar'
              ? 'تأكد أن صاحب الاسم هو وحده من يمسك الهاتف وينظر إلى الشاشة.'
              : 'Ensure only the designated voter is holding the device and looking at the screen.'}
          </p>
        </div>

        <div className="w-full max-w-xs mt-6">
          <CardButton
            variant="gold"
            size="lg"
            fullWidth
            onClick={handleUnlockBallot}
            className="shadow-[0_0_15px_rgba(197,155,39,0.35)]"
          >
            {t.iAmReady}
          </CardButton>
        </div>
      </div>
    );
  }

  // Active Ballot Screen
  return (
    <div className="flex flex-col min-h-[85vh] py-4 px-3 sm:px-6 max-w-lg mx-auto w-full animate-fadeIn">
      <div className="text-center mb-1">
        <span className="text-xs uppercase tracking-wider text-[#c59b27] px-2 py-0.5 bg-[#1f120a] border border-[#c59b27]/30 rounded-xs inline-block">
          {language === 'ar' ? 'ورقة اقتراع:' : 'Secret Ballot:'}{' '}
          <strong className="text-[#f5d77f]">{currentVoter?.name}</strong>
        </span>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#f5d77f] tracking-wide mt-2">
          {t.votePrompt}
        </h3>
      </div>

      <GoldDivider variant="diamond" className="my-2" />

      {/* Living candidates for voting */}
      <div className="grid grid-cols-2 gap-2.5 my-auto max-h-[52vh] overflow-y-auto pr-1">
        {validCandidates.map((player, idx) => (
          <PlayerCard
            key={player.id}
            player={player}
            isSelected={selectedTargetId === player.id}
            onSelect={() => setSelectedTargetId(player.id)}
            cardIndex={idx}
          />
        ))}
      </div>

      <GoldDivider variant="simple" className="my-2.5" />

      <CardButton
        variant="primary"
        size="lg"
        fullWidth
        disabled={!selectedTargetId}
        onClick={handleCastVote}
      >
        🔒 {t.confirmVote}
      </CardButton>
    </div>
  );
};
