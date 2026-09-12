import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, ChronicleEntry, Language } from '../types';
import { translations } from '../i18n';
import { GoldDivider } from './GoldDivider';
import { CardButton } from './CardButton';
import { soundManager } from '../sound';

interface ModeratorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentRound: number;
  players: Player[];
  chronicle: ChronicleEntry[];
  language: Language;
  onAbandonMatch: () => void;
}

type TabType = 'chronicle' | 'roster' | 'soundboard' | 'controls';

export const ModeratorDrawer: React.FC<ModeratorDrawerProps> = ({
  isOpen,
  onClose,
  currentRound,
  players,
  chronicle,
  language,
  onAbandonMatch
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('chronicle');
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const t = translations[language];

  const livingPlayers = players.filter((p) => p.isAlive);
  const deadPlayers = players.filter((p) => !p.isAlive);

  const playSoundEffect = (fn: () => void) => {
    soundManager.init();
    fn();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: language === 'ar' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: language === 'ar' ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="relative w-full max-w-md h-full bg-[#180e09] border-s-2 border-[#c59b27] shadow-[0_0_35px_rgba(0,0,0,0.9)] flex flex-col z-10 overflow-hidden text-start"
          >
            {/* Drawer Header */}
            <div className="p-4 bg-gradient-to-b from-[#2a170e] to-[#1a0e08] border-b border-[#c59b27]/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-serif tracking-widest text-[#c59b27] font-semibold">
                  {language === 'ar' ? `المجلس • الجولة ${currentRound}` : `Council • Round ${currentRound}`}
                </span>
                <h2 className="font-serif text-lg font-bold text-[#f5d77f]">
                  {t.moderatorMenu}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-[#2a170e] border border-[#c59b27]/60 text-[#f5d77f] hover:bg-[#3d2315] flex items-center justify-center text-lg transition-colors cursor-pointer"
                title={t.close}
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-4 border-b border-[#c59b27]/30 bg-[#140b07] text-xs font-serif">
              <button
                type="button"
                onClick={() => setActiveTab('chronicle')}
                className={`py-2.5 px-1 text-center transition-colors border-b-2 ${
                  activeTab === 'chronicle'
                    ? 'border-[#c59b27] text-[#f5d77f] bg-[#22130c] font-bold'
                    : 'border-transparent text-[#9e836b] hover:text-[#ede3ce]'
                }`}
              >
                📜 {language === 'ar' ? 'السجل' : 'Log'}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('roster')}
                className={`py-2.5 px-1 text-center transition-colors border-b-2 ${
                  activeTab === 'roster'
                    ? 'border-[#c59b27] text-[#f5d77f] bg-[#22130c] font-bold'
                    : 'border-transparent text-[#9e836b] hover:text-[#ede3ce]'
                }`}
              >
                ⚖️ {language === 'ar' ? 'الأعضاء' : 'Roster'}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('soundboard')}
                className={`py-2.5 px-1 text-center transition-colors border-b-2 ${
                  activeTab === 'soundboard'
                    ? 'border-[#c59b27] text-[#f5d77f] bg-[#22130c] font-bold'
                    : 'border-transparent text-[#9e836b] hover:text-[#ede3ce]'
                }`}
              >
                🎵 {language === 'ar' ? 'الأصوات' : 'Sounds'}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('controls')}
                className={`py-2.5 px-1 text-center transition-colors border-b-2 ${
                  activeTab === 'controls'
                    ? 'border-[#c59b27] text-[#f5d77f] bg-[#22130c] font-bold'
                    : 'border-transparent text-[#9e836b] hover:text-[#ede3ce]'
                }`}
              >
                ⚙️ {language === 'ar' ? 'التحكم' : 'Controls'}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* 1. CHRONICLE TAB */}
              {activeTab === 'chronicle' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#c59b27]">
                      {t.chronicleTitle}
                    </h3>
                    <span className="text-[10px] text-[#9e836b]">
                      {chronicle.length} {language === 'ar' ? 'أحداث' : 'records'}
                    </span>
                  </div>

                  {chronicle.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-[#c59b27]/30 rounded-xs bg-[#1a0e08]">
                      <span className="text-2xl block mb-2 opacity-50">📜</span>
                      <p className="text-xs text-[#a89078] leading-relaxed">
                        {t.chronicleEmpty}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {chronicle.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3 rounded-xs border text-xs leading-relaxed ${
                            item.type === 'night_kill'
                              ? 'bg-[#290d12] border-[#7d1c2a] text-[#ffdddd]'
                              : item.type === 'doctor_save'
                              ? 'bg-[#0f2415] border-[#296836] text-[#d4f7d4]'
                              : item.type === 'vote_elimination'
                              ? 'bg-[#2a1309] border-[#a04e22] text-[#fceee6]'
                              : 'bg-[#1b100a] border-[#c59b27]/40 text-[#ede3ce]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1 pb-1 border-b border-white/10 text-[10px] font-semibold opacity-75">
                            <span>
                              {item.phase === 'night' ? '🌙 Night' : '☀️ Day'} • R{item.round}
                            </span>
                            <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <h4 className="font-serif font-bold text-sm mb-0.5 text-[#f5d77f]">
                            {language === 'ar' ? item.titleAr : item.titleEn}
                          </h4>
                          <p className="text-xs opacity-90">
                            {language === 'ar' ? item.descriptionAr : item.descriptionEn}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. ROSTER TAB */}
              {activeTab === 'roster' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#55b868]">
                        ✓ {t.aliveCitizens} ({livingPlayers.length})
                      </h3>
                    </div>
                    <div className="space-y-1.5">
                      {livingPlayers.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-2 bg-[#172417] border border-[#3b7d48]/60 rounded-xs text-xs text-[#d7f7db]"
                        >
                          <span className="font-serif font-bold">⚖️ {p.name}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-black/40 border border-[#55b868]/40 rounded-xs font-semibold text-[#55b868]">
                            {language === 'ar' ? 'على قيد الحياة' : 'Alive'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {deadPlayers.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#ff6b6b]">
                          ☠️ {t.fallenCitizens} ({deadPlayers.length})
                        </h3>
                      </div>
                      <div className="space-y-1.5">
                        {deadPlayers.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between p-2 bg-[#2a0e13] border border-[#852533] rounded-xs text-xs text-[#fca5a5] opacity-80"
                          >
                            <span className="font-serif font-bold line-through">
                              {p.name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 bg-black/50 border border-[#ff6b6b]/40 rounded-xs text-[#f87171]">
                              {language === 'ar'
                                ? `غادر بالـ${p.eliminatedInPhase === 'night' ? 'ليل' : 'تصويت'} (جولة ${p.eliminatedInRound || 1})`
                                : `Fallen in ${p.eliminatedInPhase || 'night'} (R${p.eliminatedInRound || 1})`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. SOUNDBOARD TAB */}
              {activeTab === 'soundboard' && (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#c59b27]">
                      {t.soundboardTitle}
                    </h3>
                    <p className="text-xs text-[#a89078] mt-0.5">
                      {t.soundboardDesc}
                    </p>
                  </div>

                  <GoldDivider variant="diamond" className="my-2" />

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => playSoundEffect(() => soundManager.playNightStart())}
                      className="p-3 bg-[#22130c] border border-[#c59b27]/60 hover:border-[#f5d77f] hover:bg-[#341d13] rounded-xs text-start transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="text-xl block mb-1">🔔</span>
                      <span className="font-serif text-xs font-bold text-[#f5d77f] block">
                        {t.soundGong}
                      </span>
                      <span className="text-[10px] text-[#a89078]">
                        {language === 'ar' ? 'ناقوس السكون' : 'Deep Gong'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => playSoundEffect(() => soundManager.playGavelDouble())}
                      className="p-3 bg-[#22130c] border border-[#c59b27]/60 hover:border-[#f5d77f] hover:bg-[#341d13] rounded-xs text-start transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="text-xl block mb-1">🔨</span>
                      <span className="font-serif text-xs font-bold text-[#f5d77f] block">
                        {t.soundGavel}
                      </span>
                      <span className="text-[10px] text-[#a89078]">
                        {language === 'ar' ? 'ضربة مزدوجة' : 'Double Strike'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => playSoundEffect(() => soundManager.playHeartbeat())}
                      className="p-3 bg-[#22130c] border border-[#c59b27]/60 hover:border-[#f5d77f] hover:bg-[#341d13] rounded-xs text-start transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="text-xl block mb-1">💓</span>
                      <span className="font-serif text-xs font-bold text-[#f5d77f] block">
                        {t.soundHeartbeat}
                      </span>
                      <span className="text-[10px] text-[#a89078]">
                        {language === 'ar' ? 'نبض تشويقي' : 'Suspense Pulse'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => playSoundEffect(() => soundManager.playDayAwakening())}
                      className="p-3 bg-[#22130c] border border-[#c59b27]/60 hover:border-[#f5d77f] hover:bg-[#341d13] rounded-xs text-start transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="text-xl block mb-1">🌅</span>
                      <span className="font-serif text-xs font-bold text-[#f5d77f] block">
                        {t.soundDawn}
                      </span>
                      <span className="text-[10px] text-[#a89078]">
                        {language === 'ar' ? 'أجراس الصباح' : 'Dawn Chimes'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => playSoundEffect(() => soundManager.playInspectionPing())}
                      className="p-3 bg-[#22130c] border border-[#c59b27]/60 hover:border-[#f5d77f] hover:bg-[#341d13] rounded-xs text-start transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="text-xl block mb-1">🔍</span>
                      <span className="font-serif text-xs font-bold text-[#f5d77f] block">
                        {t.soundInspect}
                      </span>
                      <span className="text-[10px] text-[#a89078]">
                        {language === 'ar' ? 'فحص المحقق' : 'Secret Reveal'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => playSoundEffect(() => soundManager.playDoctorSave())}
                      className="p-3 bg-[#22130c] border border-[#c59b27]/60 hover:border-[#f5d77f] hover:bg-[#341d13] rounded-xs text-start transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="text-xl block mb-1">🏺</span>
                      <span className="font-serif text-xs font-bold text-[#f5d77f] block">
                        {t.soundHeal}
                      </span>
                      <span className="text-[10px] text-[#a89078]">
                        {language === 'ar' ? 'بريق الترياق' : 'Antidote Shimmer'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => playSoundEffect(() => soundManager.playWhisperWind())}
                      className="p-3 bg-[#22130c] border border-[#c59b27]/60 hover:border-[#f5d77f] hover:bg-[#341d13] rounded-xs text-start transition-all active:scale-95 cursor-pointer col-span-2"
                    >
                      <span className="text-xl inline-block me-2">🌪️</span>
                      <span className="font-serif text-xs font-bold text-[#f5d77f]">
                        {t.soundWind}
                      </span>
                      <span className="text-[10px] text-[#a89078] block">
                        {language === 'ar' ? 'هبوب رياح الليل الغامضة' : 'Desert Night Wind Atmosphere'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* 4. CONTROLS TAB */}
              {activeTab === 'controls' && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#1d110b] border border-[#c59b27]/40 rounded-xs">
                    <h4 className="font-serif text-xs font-bold text-[#f5d77f] mb-1">
                      {language === 'ar' ? 'المباراة الحالية' : 'Current Match'}
                    </h4>
                    <p className="text-xs text-[#a89078]">
                      {language === 'ar'
                        ? `الجولة: ${currentRound} | عدد اللاعبين: ${players.length}`
                        : `Round: ${currentRound} | Total Players: ${players.length}`}
                    </p>
                  </div>

                  {!showAbandonConfirm ? (
                    <CardButton
                      variant="secondary"
                      size="md"
                      fullWidth
                      onClick={() => setShowAbandonConfirm(true)}
                      className="border-[#ff6b6b]/60 text-[#fca5a5] hover:bg-[#331116]"
                    >
                      ⚠️ {language === 'ar' ? 'إنهاء / إعادة ضبط المباراة' : 'End / Reset Match'}
                    </CardButton>
                  ) : (
                    <div className="p-4 bg-[#330f16] border-2 border-[#ff6b6b] rounded-xs space-y-3">
                      <h4 className="font-serif text-sm font-bold text-[#ffdddd]">
                        {t.abandonGameTitle}
                      </h4>
                      <p className="text-xs text-[#fca5a5] leading-relaxed">
                        {t.abandonGamePrompt}
                      </p>
                      <div className="flex gap-2">
                        <CardButton
                          variant="secondary"
                          size="sm"
                          fullWidth
                          onClick={() => setShowAbandonConfirm(false)}
                        >
                          {t.cancel}
                        </CardButton>
                        <CardButton
                          variant="primary"
                          size="sm"
                          fullWidth
                          onClick={() => {
                            setShowAbandonConfirm(false);
                            onClose();
                            onAbandonMatch();
                          }}
                          className="bg-[#991b1b] hover:bg-[#b91c1c] text-white"
                        >
                          {t.abandonConfirm}
                        </CardButton>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Close Action */}
            <div className="p-3 bg-[#140b07] border-t border-[#c59b27]/30">
              <CardButton
                variant="gold"
                size="sm"
                fullWidth
                onClick={onClose}
              >
                {t.close}
              </CardButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
