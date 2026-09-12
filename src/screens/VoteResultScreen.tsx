import React, { useEffect } from 'react';
import { Player, VoteRecord, TieBehavior, Language } from '../types';
import { translations } from '../i18n';
import { CardButton } from '../components/CardButton';
import { GoldDivider } from '../components/GoldDivider';
import { VoteItem } from '../components/VoteItem';
import { soundManager } from '../sound';

interface VoteResultScreenProps {
  votes: VoteRecord[];
  livingPlayers: Player[];
  tieBehavior: TieBehavior;
  onProceed: (eliminatedPlayerIds: string[]) => void;
  language: Language;
}

export const VoteResultScreen: React.FC<VoteResultScreenProps> = ({
  votes,
  livingPlayers,
  tieBehavior,
  onProceed,
  language
}) => {
  const t = translations[language];

  useEffect(() => {
    soundManager.playGavel();
    soundManager.haptic(60);
  }, []);

  // 1. Tally votes per living player
  const voteCounts: Record<string, number> = {};
  livingPlayers.forEach((p) => {
    voteCounts[p.id] = 0;
  });

  votes.forEach((v) => {
    if (voteCounts[v.targetId] !== undefined) {
      voteCounts[v.targetId] += 1;
    }
  });

  // Sort players by vote count descending
  const sortedPlayers = [...livingPlayers].sort(
    (a, b) => (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0)
  );

  const maxVotes = sortedPlayers.length > 0 ? voteCounts[sortedPlayers[0].id] : 0;
  const topCandidates = sortedPlayers.filter((p) => voteCounts[p.id] === maxVotes && maxVotes > 0);
  const isTie = topCandidates.length > 1;

  // Determine who will be eliminated based on tie behavior
  let eliminatedPlayerIds: string[] = [];
  let outcomeMessage = '';

  if (maxVotes === 0) {
    outcomeMessage = language === 'ar' ? 'لم يتم تسجيل أي أصوات صالحة.' : 'No valid votes recorded.';
  } else if (!isTie) {
    eliminatedPlayerIds = [topCandidates[0].id];
    outcomeMessage = `${topCandidates[0].name} ${t.eliminationNotice}`;
  } else {
    // Tie occurred
    if (tieBehavior === 'no_elimination') {
      eliminatedPlayerIds = [];
      outcomeMessage = t.tieResolvedNoElimination;
    } else if (tieBehavior === 'both_eliminated') {
      eliminatedPlayerIds = topCandidates.map((c) => c.id);
      outcomeMessage = `${t.tieDetected} ${t.tieResolvedBoth} (${topCandidates.map((c) => c.name).join(', ')})`;
    } else {
      // Revote
      eliminatedPlayerIds = [];
      outcomeMessage = `${t.tieDetected} ${t.tieResolvedRevote}`;
    }
  }

  const eliminatedPlayers = livingPlayers.filter((p) => eliminatedPlayerIds.includes(p.id));

  return (
    <div className="flex flex-col min-h-[85vh] py-4 px-3 sm:px-6 max-w-lg mx-auto w-full animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f5d77f] tracking-wide uppercase">
          {t.voteResultTitle}
        </h2>
        <p className="text-xs text-[#a89078] mt-0.5">{t.voteSummary}</p>
      </div>

      <GoldDivider variant="diamond" className="my-2.5" />

      {/* Outcome Banner */}
      <div
        className={`p-3.5 rounded-sm border-2 text-center mb-3 shadow-lg ${
          eliminatedPlayers.length > 0
            ? 'bg-[#3b1218] border-[#d9534f]'
            : 'bg-[#20150e] border-[#c59b27]'
        }`}
      >
        <span className="text-2xl block mb-1">
          {eliminatedPlayers.length > 0 ? '⚖️ ☠️' : '🕊️'}
        </span>
        <h3 className="font-serif text-base sm:text-lg font-bold text-[#fbf7ee]">
          {outcomeMessage}
        </h3>

        {/* Physical Card Instruction */}
        {eliminatedPlayers.length > 0 && (
          <div className="mt-3 p-2 bg-[#17080a] border border-[#d9534f]/50 rounded-xs text-start">
            <p className="text-xs text-[#fca5a5] font-serif leading-relaxed">
              🎴 <strong>{language === 'ar' ? 'كشف الكرت الورقي:' : 'Physical Card Reveal:'}</strong>{' '}
              {language === 'ar'
                ? `اطلبوا من (${eliminatedPlayers.map((p) => p.name).join(' و ')}) كشف كرته الورقي الحقيقي الآن أمام الجميع.`
                : `Instruct ${eliminatedPlayers.map((p) => p.name).join(' & ')} to reveal their physical card now per your house rules.`}
            </p>
          </div>
        )}
      </div>

      {/* Vote Bars Tally */}
      <div className="space-y-2 my-auto max-h-[44vh] overflow-y-auto pr-1">
        {sortedPlayers.map((player) => {
          const count = voteCounts[player.id] || 0;
          const isHighest = count === maxVotes && maxVotes > 0;

          return (
            <VoteItem
              key={player.id}
              playerName={player.name}
              votes={count}
              totalVotesCast={votes.length}
              isHighest={isHighest}
              isTied={isTie && isHighest}
              isEliminated={eliminatedPlayerIds.includes(player.id)}
            />
          );
        })}
      </div>

      <GoldDivider variant="simple" className="my-3" />

      {/* Proceed Button */}
      <CardButton
        variant="gold"
        size="lg"
        fullWidth
        onClick={() => onProceed(eliminatedPlayerIds)}
        className="shadow-[0_0_18px_rgba(197,155,39,0.35)]"
      >
        {t.proceedToNight} 🌙
      </CardButton>
    </div>
  );
};
