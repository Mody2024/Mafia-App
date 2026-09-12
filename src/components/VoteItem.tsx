import React from 'react';

interface VoteItemProps {
  playerName: string;
  votes: number;
  totalVotesCast: number;
  isHighest: boolean;
  isTied: boolean;
  isEliminated?: boolean;
}

export const VoteItem: React.FC<VoteItemProps> = ({
  playerName,
  votes,
  totalVotesCast,
  isHighest,
  isTied,
  isEliminated = false
}) => {
  const percentage = totalVotesCast > 0 ? (votes / totalVotesCast) * 100 : 0;

  return (
    <div
      className={`relative p-3 rounded-xs border transition-all duration-200 overflow-hidden ${
        isHighest
          ? isTied
            ? 'bg-[#2d1b10] border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.25)]'
            : 'bg-[#3b1218] border-[#e05b63] shadow-[0_0_15px_rgba(224,91,99,0.35)]'
          : 'bg-[#1a100a] border-[#c59b27]/30'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5 z-10 relative">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-sm sm:text-base text-[#ede3ce]">
            {playerName}
          </span>
          {isHighest && (
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-xs ${
                isTied
                  ? 'bg-[#c59b27] text-[#140b07]'
                  : 'bg-[#b82631] text-[#fff]'
              }`}
            >
              {isTied ? 'Tied Accused ⚖️' : 'Highest Accused ☠️'}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1">
          <span className="font-mono text-base font-bold text-[#f5d77f]">
            {votes}
          </span>
          <span className="text-[11px] text-[#a89078]">
            ({percentage.toFixed(0)}%)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-[#120a06] border border-[#c59b27]/20 rounded-full overflow-hidden p-[1px]">
        <div
          className={`h-full transition-all duration-700 ease-out rounded-full ${
            isHighest
              ? isTied
                ? 'bg-gradient-to-r from-[#997519] to-[#f5d77f]'
                : 'bg-gradient-to-r from-[#8a1c22] via-[#cf3843] to-[#f87171]'
              : 'bg-gradient-to-r from-[#5a3e1c] to-[#997519]'
          }`}
          style={{ width: `${Math.max(percentage, 2)}%` }}
        />
      </div>
    </div>
  );
};
