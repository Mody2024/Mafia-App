import React from 'react';
import { soundManager } from '../sound';

interface CardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const CardButton: React.FC<CardButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  onClick,
  disabled,
  children,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      soundManager.playConfirmation();
      onClick?.(e);
    }
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-serif tracking-wider uppercase transition-all duration-200 cursor-pointer disabled:cursor-not-allowed select-none active:scale-[0.98] outline-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base font-medium'
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-b from-[#5c1320] via-[#430c16] to-[#2b070e] text-[#fbf7ee] border-2 border-[#c59b27] hover:border-[#f3d87f] shadow-[0_4px_12px_rgba(0,0,0,0.6)] hover:shadow-[0_0_15px_rgba(197,155,39,0.35)] disabled:opacity-40 disabled:border-[#6a5323] disabled:from-[#241316] disabled:to-[#170a0c]',
    gold:
      'bg-gradient-to-b from-[#e5be53] via-[#c59b27] to-[#997519] text-[#1a0f07] font-bold border border-[#fdf3c9] hover:from-[#f3d87f] hover:to-[#b08722] shadow-[0_4px_15px_rgba(0,0,0,0.7)] hover:shadow-[0_0_20px_rgba(229,190,83,0.5)] disabled:opacity-40 disabled:from-[#6b582a] disabled:to-[#433618]',
    secondary:
      'bg-gradient-to-b from-[#2a1b13] to-[#19100a] text-[#ede3ce] border border-[#c59b27]/60 hover:border-[#c59b27] hover:bg-[#342218] shadow-[0_3px_10px_rgba(0,0,0,0.5)] disabled:opacity-40',
    danger:
      'bg-gradient-to-b from-[#7e1919] to-[#450d0d] text-[#ffe6e6] border border-[#d9534f] hover:border-[#ff7a77] hover:from-[#941c1c] shadow-[0_4px_12px_rgba(0,0,0,0.6)] disabled:opacity-40'
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {/* Subtle corner diamond glyphs for card deck feel */}
      <span className="absolute top-1 left-1.5 text-[8px] opacity-50 text-[#c59b27] select-none">♦</span>
      <span className="absolute bottom-1 right-1.5 text-[8px] opacity-50 text-[#c59b27] select-none">♦</span>
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};
