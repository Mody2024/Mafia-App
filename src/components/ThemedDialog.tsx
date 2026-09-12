import React from 'react';
import { CardButton } from './CardButton';
import { GoldDivider } from './GoldDivider';

interface ThemedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
  cancelText?: string;
  showActions?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ThemedDialog: React.FC<ThemedDialogProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  confirmText,
  onConfirm,
  cancelText,
  showActions = false,
  maxWidth = 'md'
}) => {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-[#1b120c] text-[#ede3ce] border-2 border-[#c59b27] shadow-[0_10px_35px_rgba(0,0,0,0.9)] p-5 sm:p-6 rounded-sm`}
      >
        {/* Decorative corner ornaments */}
        <span className="absolute top-2 left-2 text-[#c59b27] text-xs select-none">♦</span>
        <span className="absolute top-2 right-2 text-[#c59b27] text-xs select-none">♦</span>
        <span className="absolute bottom-2 left-2 text-[#c59b27] text-xs select-none">♦</span>
        <span className="absolute bottom-2 right-2 text-[#c59b27] text-xs select-none">♦</span>

        {/* Dialog Header */}
        <div className="text-center mb-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#f5d77f] tracking-wide">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#a89078] mt-1 font-serif">
              {subtitle}
            </p>
          )}
        </div>

        <GoldDivider variant="diamond" className="my-3" />

        {/* Content */}
        <div className="my-4 max-h-[70vh] overflow-y-auto pr-1 text-sm leading-relaxed">
          {children}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-[#c59b27]/30">
            {cancelText && (
              <CardButton variant="secondary" size="sm" onClick={onClose}>
                {cancelText}
              </CardButton>
            )}
            {confirmText && onConfirm && (
              <CardButton variant="gold" size="sm" onClick={onConfirm}>
                {confirmText}
              </CardButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
