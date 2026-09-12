import React from 'react';

interface GoldDividerProps {
  className?: string;
  variant?: 'diamond' | 'eye' | 'simple';
}

export const GoldDivider: React.FC<GoldDividerProps> = ({
  className = '',
  variant = 'diamond'
}) => {
  return (
    <div className={`flex items-center justify-center gap-3 my-4 w-full ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c59b27]/60 to-[#c59b27]" />
      
      {variant === 'diamond' && (
        <div className="flex items-center gap-1.5 text-[#d4af37] text-xs select-none">
          <span className="opacity-60 text-[9px]">♦</span>
          <span className="font-bold text-sm">♦</span>
          <span className="opacity-60 text-[9px]">♦</span>
        </div>
      )}

      {variant === 'eye' && (
        <div className="flex items-center gap-1 text-[#d4af37] select-none text-xs">
          <span>♠</span>
          <span className="text-sm font-bold text-[#f5d77f]">𓂀</span>
          <span>♠</span>
        </div>
      )}

      {variant === 'simple' && (
        <div className="w-1.5 h-1.5 rotate-45 bg-[#c59b27]" />
      )}

      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#c59b27]/60 to-[#c59b27]" />
    </div>
  );
};
