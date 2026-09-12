import React from 'react';
import { ThemedDialog } from '../components/ThemedDialog';
import { CardButton } from '../components/CardButton';
import { GoldDivider } from '../components/GoldDivider';
import { translations } from '../i18n';
import { Language } from '../types';

interface HowToPlayDialogProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const HowToPlayDialog: React.FC<HowToPlayDialogProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const t = translations[language];

  return (
    <ThemedDialog
      isOpen={isOpen}
      onClose={onClose}
      title={t.rulesTitle}
      subtitle={language === 'ar' ? 'دليل المنظم الأوفلاين للعبة الكروت الورقية' : 'Offline Moderator Guide for the Physical Deck'}
      maxWidth="md"
    >
      <div className="space-y-4 text-xs sm:text-sm text-[#ede3ce]">
        {/* Rule 1 */}
        <div className="p-3 bg-[#241710] border border-[#c59b27]/40 rounded-xs">
          <h4 className="font-serif font-bold text-sm text-[#f5d77f] mb-1">
            {t.rule1Title}
          </h4>
          <p className="text-[#c7b095] leading-relaxed">
            {t.rule1Desc}
          </p>
        </div>

        {/* Rule 2 */}
        <div className="p-3 bg-[#241710] border border-[#c59b27]/40 rounded-xs">
          <h4 className="font-serif font-bold text-sm text-[#f5d77f] mb-1">
            {t.rule2Title}
          </h4>
          <p className="text-[#c7b095] leading-relaxed">
            {t.rule2Desc}
          </p>
        </div>

        {/* Rule 3 */}
        <div className="p-3 bg-[#241710] border border-[#c59b27]/40 rounded-xs">
          <h4 className="font-serif font-bold text-sm text-[#f5d77f] mb-1">
            {t.rule3Title}
          </h4>
          <p className="text-[#c7b095] leading-relaxed">
            {t.rule3Desc}
          </p>
        </div>

        {/* Rule 4 */}
        <div className="p-3 bg-[#241710] border border-[#c59b27]/40 rounded-xs">
          <h4 className="font-serif font-bold text-sm text-[#f5d77f] mb-1">
            {t.rule4Title}
          </h4>
          <p className="text-[#c7b095] leading-relaxed">
            {t.rule4Desc}
          </p>
        </div>

        <GoldDivider variant="simple" />

        <div className="text-center">
          <CardButton variant="gold" size="sm" onClick={onClose} fullWidth>
            {t.close}
          </CardButton>
        </div>
      </div>
    </ThemedDialog>
  );
};
