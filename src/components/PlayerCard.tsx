import React from 'react';
import { motion } from 'motion/react';
import { Player } from '../types';
import { soundManager } from '../sound';

interface PlayerCardProps {
  player: Player;
  isSelected?: boolean;
  onSelect?: (player: Player) => void;
  disabled?: boolean;
  disabledReason?: string;
  showRoleBadge?: string | null;
  votesCount?: number;
  className?: string;
  cardIndex?: number;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isSelected = false,
  onSelect,
  disabled = false,
  disabledReason,
  showRoleBadge,
  votesCount,
  className = '',
  cardIndex = 0
}) => {
  const suits = ['♠', '♦', '♣', '♥'];
  const suit = suits[cardIndex % suits.length];

  const handleCardClick = () => {
    if (!disabled && onSelect) {
      soundManager.playCardFlip();
      onSelect(player);
    }
  };

  const isEliminated = !player.isAlive;

  return (
    <motion.div
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      onClick={handleCardClick}
      className={`relative group flex flex-col justify-between p-3.5 sm:p-4 rounded-xs transition-all duration-200 select-none ${
        disabled
          ? 'opacity-40 cursor-not-allowed bg-[#18110b] border border-[#3b2719]'
          : 'cursor-pointer hover:-translate-y-0.5'
      } ${
        isSelected
          ? 'bg-gradient-to-b from-[#3d1f14] via-[#2a150c] to-[#1c0e07] border-2 border-[#f5d77f] shadow-[0_0_18px_rgba(245,215,127,0.4)]'
          : isEliminated
          ? 'bg-[#150d09] border border-[#4a1818]/60 opacity-60'
          : 'bg-gradient-to-b from-[#241710] to-[#180f0a] border border-[#c59b27]/50 hover:border-[#f5d77f] shadow-[0_4px_12px_rgba(0,0,0,0.5)]'
      } ${className}`}
    >
      {/* Corner suit & card index */}
      <div className="flex items-center justify-between text-xs text-[#c59b27] opacity-80 mb-2">
        <span className="font-serif text-sm">{suit}</span>
        {isEliminated ? (
          <span className="text-[10px] text-[#e06666] tracking-wider uppercase font-semibold">
            ☠️ Fallen
          </span>
        ) : isSelected ? (
          <span className="text-[10px] bg-[#c59b27] text-[#1a0f07] px-1.5 py-0.5 rounded-xs font-bold uppercase tracking-wider">
            ✓ Chosen
          </span>
        ) : (
          <span className="text-[11px] opacity-60">#{cardIndex + 1}</span>
        )}
      </div>

      {/* Player Name */}
      <div className="my-1.5 text-center">
        <h3
          className={`font-serif text-base sm:text-lg font-bold tracking-wide break-words ${
            isEliminated
              ? 'line-through text-[#8f7564]'
              : isSelected
              ? 'text-[#fbf7ee]'
              : 'text-[#ede3ce]'
          }`}
        >
          {player.name}
        </h3>

        {disabledReason && (
          <p className="text-[11px] text-[#e28787] mt-1 italic">{disabledReason}</p>
        )}
      </div>

      {/* Role Badge (if revealed/permitted) */}
      {showRoleBadge && (
        <div className="mt-2 text-center">
          <span className="inline-block text-[10px] tracking-wider uppercase px-2 py-0.5 bg-[#4c121c] border border-[#c59b27] text-[#f7eed7] font-semibold">
            {showRoleBadge}
          </span>
        </div>
      )}

      {/* Votes counter badge if voting tally is active */}
      {typeof votesCount === 'number' && (
        <div className="mt-2 pt-1 border-t border-[#c59b27]/30 flex items-center justify-between text-xs">
          <span className="text-[#a89078]">Votes:</span>
          <span className="font-bold text-[#f5d77f] text-sm">{votesCount}</span>
        </div>
      )}

      {/* Inner fine gold frame */}
      <div className="absolute inset-1 pointer-events-none border border-[#c59b27]/20 rounded-xs" />
    </motion.div>
  );
};
