import React, { useState, useRef } from 'react';
import { GameSettings, Language, TieBehavior } from '../types';
import { translations } from '../i18n';
import { LogoEmblem } from '../components/LogoEmblem';
import { CardButton } from '../components/CardButton';
import { GoldDivider } from '../components/GoldDivider';
import { soundManager } from '../sound';

interface SettingsScreenProps {
  isOpen: boolean;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
  onOpenAndroidExport: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onClose,
  onOpenAndroidExport
}) => {
  if (!isOpen) return null;

  const [localSettings, setLocalSettings] = useState<GameSettings>({ ...settings });
  const [pendingLogo, setPendingLogo] = useState<string | null>(null);
  const [logoSaveSuccess, setLogoSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[localSettings.language];

  const handleLanguageChange = (lang: Language) => {
    soundManager.playConfirmation();
    setLocalSettings((prev) => ({ ...prev, language: lang }));
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        alert(
          localSettings.language === 'ar'
            ? 'يرجى اختيار صورة بصيغة PNG أو JPG أو WebP.'
            : 'Please select a PNG, JPG, or WebP image.'
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPendingLogo(result);
        setLogoSaveSuccess(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmLogoSave = () => {
    if (pendingLogo) {
      soundManager.playConfirmation();
      setLocalSettings((prev) => ({ ...prev, customLogoUrl: pendingLogo }));
      setPendingLogo(null);
      setLogoSaveSuccess(true);
      setTimeout(() => setLogoSaveSuccess(false), 2500);
    }
  };

  const handleResetDefaultLogo = () => {
    soundManager.playConfirmation();
    setPendingLogo(null);
    setLocalSettings((prev) => ({ ...prev, customLogoUrl: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setLogoSaveSuccess(false);
  };

  const handleSaveAll = () => {
    soundManager.updateConfig(
      localSettings.soundEffects,
      localSettings.ambientAudio,
      localSettings.masterVolume
    );
    onUpdateSettings(localSettings);
    onClose();
  };

  const testAudioChime = () => {
    soundManager.playGavel();
    setTimeout(() => soundManager.playMysticChime(), 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#1a110a] border-2 border-[#c59b27] shadow-[0_10px_35px_rgba(0,0,0,0.9)] p-4 sm:p-6 rounded-xs my-auto">
        {/* Diamond Corner Accents */}
        <span className="absolute top-2 left-2 text-[#c59b27] text-xs">♦</span>
        <span className="absolute top-2 right-2 text-[#c59b27] text-xs">♦</span>
        <span className="absolute bottom-2 left-2 text-[#c59b27] text-xs">♦</span>
        <span className="absolute bottom-2 right-2 text-[#c59b27] text-xs">♦</span>

        {/* Title */}
        <div className="text-center mb-2">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#f5d77f] tracking-wide">
            {t.settingsTitle}
          </h2>
          <p className="text-xs text-[#a89078]">{t.offlineNotice}</p>
        </div>

        <GoldDivider variant="diamond" className="my-2.5" />

        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1 text-xs sm:text-sm">
          {/* 1. Language */}
          <div className="p-3 bg-[#241710] border border-[#c59b27]/40 rounded-xs">
            <h3 className="font-serif font-bold text-[#f5d77f] mb-2">
              {t.languageLabel}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`py-2 px-3 text-xs font-serif font-bold tracking-wider rounded-xs border transition-all cursor-pointer ${
                  localSettings.language === 'en'
                    ? 'bg-[#c59b27] text-[#140b07] border-[#f5d77f]'
                    : 'bg-[#180f0a] text-[#c7b095] border-[#c59b27]/40 hover:border-[#c59b27]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('ar')}
                className={`py-2 px-3 text-xs font-serif font-bold tracking-wider rounded-xs border transition-all cursor-pointer ${
                  localSettings.language === 'ar'
                    ? 'bg-[#c59b27] text-[#140b07] border-[#f5d77f]'
                    : 'bg-[#180f0a] text-[#c7b095] border-[#c59b27]/40 hover:border-[#c59b27]'
                }`}
              >
                العربية
              </button>
            </div>
          </div>

          {/* 2. Special Roles & Rules Toggles */}
          <div className="p-3 bg-[#241710] border border-[#c59b27]/40 rounded-xs">
            <h3 className="font-serif font-bold text-[#f5d77f] mb-2">
              ⚖️ {t.rulesConfig}
            </h3>
            <div className="space-y-2.5">
              <label className="flex items-center justify-between cursor-pointer py-1 border-b border-[#c59b27]/20">
                <div>
                  <span className="text-xs font-serif font-semibold text-[#ede3ce] block">
                    🔍 {t.enableDetective}
                  </span>
                  <span className="text-[10px] text-[#a89078] block">
                    {localSettings.language === 'ar'
                      ? 'تمكين مرحلة المحقق ليلاً للكشف عن هوية المشتبه بهم.'
                      : 'Include the Detective phase at night to investigate identities.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.enableDetective ?? true}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setLocalSettings((prev) => ({ ...prev, enableDetective: checked }));
                  }}
                  className="w-4 h-4 accent-[#c59b27]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 border-b border-[#c59b27]/20">
                <div>
                  <span className="text-xs font-serif font-semibold text-[#ede3ce] block">
                    💉 {t.enableDoctor}
                  </span>
                  <span className="text-[10px] text-[#a89078] block">
                    {localSettings.language === 'ar'
                      ? 'تمكين مرحلة الطبيب ليلاً لحماية أحد المواطنين من الاغتيال.'
                      : 'Include the Doctor phase at night to protect a player from assassination.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.enableDoctor ?? true}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setLocalSettings((prev) => ({ ...prev, enableDoctor: checked }));
                  }}
                  className="w-4 h-4 accent-[#c59b27]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <span className="text-xs font-serif font-semibold text-[#ede3ce] block">
                    📳 {t.hapticFeedback}
                  </span>
                  <span className="text-[10px] text-[#a89078] block">
                    {localSettings.language === 'ar'
                      ? 'اهتزاز لمسي هادئ عند اختيار البطاقات وانتهاء التوقيت.'
                      : 'Subtle device vibration on card selections and timer milestones.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.hapticFeedback ?? true}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setLocalSettings((prev) => ({ ...prev, hapticFeedback: checked }));
                    if (checked) soundManager.haptic(35);
                  }}
                  className="w-4 h-4 accent-[#c59b27]"
                />
              </label>
            </div>
          </div>

          {/* 3. Audio & Volume */}
          <div className="p-3 bg-[#241710] border border-[#c59b27]/40 rounded-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif font-bold text-[#f5d77f]">
                🎵 {t.soundEffectsLabel} & {t.masterVolumeLabel}
              </h3>
              <button
                type="button"
                onClick={testAudioChime}
                className="px-2 py-0.5 text-[11px] bg-[#331c10] border border-[#c59b27] text-[#f5d77f] rounded-xs font-serif hover:bg-[#482816] cursor-pointer"
              >
                🔔 {localSettings.language === 'ar' ? 'اختبار الصوت' : 'Test Sound'}
              </button>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-xs text-[#ede3ce]">{t.soundEffectsLabel}</span>
                <input
                  type="checkbox"
                  checked={localSettings.soundEffects}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setLocalSettings((prev) => ({ ...prev, soundEffects: checked }));
                    soundManager.updateConfig(
                      checked,
                      localSettings.ambientAudio,
                      localSettings.masterVolume
                    );
                  }}
                  className="w-4 h-4 accent-[#c59b27]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-xs text-[#ede3ce]">{t.ambientAudioLabel}</span>
                <input
                  type="checkbox"
                  checked={localSettings.ambientAudio}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setLocalSettings((prev) => ({ ...prev, ambientAudio: checked }));
                    soundManager.updateConfig(
                      localSettings.soundEffects,
                      checked,
                      localSettings.masterVolume
                    );
                  }}
                  className="w-4 h-4 accent-[#c59b27]"
                />
              </label>

              {/* Volume Slider */}
              <div className="pt-2">
                <div className="flex justify-between text-[11px] text-[#c7b095] mb-1">
                  <span>{t.masterVolumeLabel}</span>
                  <span className="font-mono">{Math.round(localSettings.masterVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={localSettings.masterVolume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    setLocalSettings((prev) => ({ ...prev, masterVolume: vol }));
                    soundManager.updateConfig(
                      localSettings.soundEffects,
                      localSettings.ambientAudio,
                      vol
                    );
                  }}
                  className="w-full accent-[#c59b27]"
                />
              </div>
            </div>
          </div>

          {/* 4. Night Transition Settings */}
          <div className="p-3 bg-[#241710] border border-[#c59b27]/40 rounded-xs">
            <h3 className="font-serif font-bold text-[#f5d77f] mb-2">
              🌙 {t.nightSettingsTitle}
            </h3>

            {/* Transition Delay */}
            <div>
              <label className="block text-xs text-[#c7b095] mb-1.5 font-semibold">
                {t.transitionDelayLabel}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([5, 6, 7] as const).map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => {
                      soundManager.playConfirmation();
                      setLocalSettings((prev) => ({ ...prev, transitionDelay: sec }));
                    }}
                    className={`py-1.5 px-2 text-xs font-serif font-bold rounded-xs border cursor-pointer ${
                      localSettings.transitionDelay === sec
                        ? 'bg-[#c59b27] text-[#140b07] border-[#f5d77f]'
                        : 'bg-[#180f0a] text-[#c7b095] border-[#c59b27]/40 hover:border-[#c59b27]'
                    }`}
                  >
                    {sec} {localSettings.language === 'ar' ? 'ثوانٍ' : 'Seconds'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Day Settings */}
          <div className="p-3 bg-[#241710] border border-[#c59b27]/40 rounded-xs">
            <h3 className="font-serif font-bold text-[#f5d77f] mb-3">
              ☀️ {t.daySettingsTitle}
            </h3>

            {/* Discussion Timer */}
            <div className="mb-3">
              <label className="block text-xs text-[#c7b095] mb-1.5 font-semibold">
                {t.discussionDurationLabel}
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 3, 5, 7, 10].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      soundManager.playConfirmation();
                      setLocalSettings((prev) => ({ ...prev, discussionMinutes: mins }));
                    }}
                    className={`py-1.5 text-xs font-serif font-bold rounded-xs border cursor-pointer ${
                      localSettings.discussionMinutes === mins
                        ? 'bg-[#c59b27] text-[#140b07] border-[#f5d77f]'
                        : 'bg-[#180f0a] text-[#c7b095] border-[#c59b27]/40 hover:border-[#c59b27]'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Tie Vote Resolution */}
            <div className="pt-2 border-t border-[#c59b27]/20">
              <label className="block text-xs text-[#c7b095] mb-1.5 font-semibold">
                {t.tieBehaviorLabel}
              </label>
              <div className="space-y-1.5">
                {(
                  [
                    { key: 'no_elimination', label: t.tieNoElimination },
                    { key: 'revote', label: t.tieRevote },
                    { key: 'both_eliminated', label: t.tieBoth }
                  ] as { key: TieBehavior; label: string }[]
                ).map(({ key, label }) => (
                  <label
                    key={key}
                    className={`flex items-center gap-2.5 p-2 rounded-xs border cursor-pointer transition-all ${
                      localSettings.tieBehavior === key
                        ? 'bg-[#3b2314] border-[#c59b27] text-[#f5d77f]'
                        : 'bg-[#180f0a] border-[#c59b27]/30 text-[#c7b095] hover:border-[#c59b27]/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tieBehavior"
                      checked={localSettings.tieBehavior === key}
                      onChange={() => {
                        soundManager.playConfirmation();
                        setLocalSettings((prev) => ({ ...prev, tieBehavior: key }));
                      }}
                      className="accent-[#c59b27]"
                    />
                    <span className="text-xs font-serif">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 6. App Logo Customization */}
          <div className="p-3 bg-[#241710] border border-[#c59b27]/40 rounded-xs">
            <h3 className="font-serif font-bold text-[#f5d77f] mb-1">
              👁️ {t.appLogoTitle}
            </h3>
            <p className="text-[11px] text-[#a89078] mb-3">
              {localSettings.language === 'ar'
                ? 'خصص شعار المجلس المصري أو ارفع رمز عشيرتك (PNG/JPG/WebP) محلياً بدون إنترنت.'
                : 'Customize the Egyptian Council emblem with your custom clan badge (PNG/JPG/WebP) stored locally offline.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Preview */}
              <div className="flex flex-col items-center">
                <p className="text-[10px] text-[#a89078] uppercase mb-1">{t.logoPreview}</p>
                <LogoEmblem
                  customLogoUrl={pendingLogo || localSettings.customLogoUrl}
                  size="md"
                />
              </div>

              {/* Actions */}
              <div className="flex-1 w-full space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleLogoFileChange}
                  className="hidden"
                />

                <CardButton
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => fileInputRef.current?.click()}
                >
                  📁 {t.uploadLogo}
                </CardButton>

                {pendingLogo && (
                  <CardButton
                    variant="gold"
                    size="sm"
                    fullWidth
                    onClick={handleConfirmLogoSave}
                  >
                    ✓ {t.confirmLogoSave}
                  </CardButton>
                )}

                {localSettings.customLogoUrl && (
                  <CardButton
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={handleResetDefaultLogo}
                  >
                    ↺ {t.resetDefaultLogo}
                  </CardButton>
                )}

                {logoSaveSuccess && (
                  <p className="text-[11px] text-[#86efac] text-center font-bold">
                    ✓ {localSettings.language === 'ar' ? 'تم حفظ الشعار بنجاح!' : 'Emblem saved successfully!'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 7. Android Kotlin Code View */}
          <div className="p-3 bg-[#1e130c] border border-[#c59b27]/60 rounded-xs text-center">
            <h4 className="font-serif text-xs font-bold text-[#f5d77f] mb-1">
              📱 {t.androidCodeExport}
            </h4>
            <p className="text-[11px] text-[#a89078] mb-2.5">
              {localSettings.language === 'ar'
                ? 'عرض وتحميل كود Kotlin الكامل لنظام Android Studio.'
                : 'Inspect and download the full Android Jetpack Compose Kotlin implementation.'}
            </p>
            <CardButton variant="secondary" size="sm" onClick={onOpenAndroidExport}>
              {localSettings.language === 'ar' ? 'عرض كود أندرويد' : 'View Android Code'}
            </CardButton>
          </div>
        </div>

        <GoldDivider variant="simple" className="my-3" />

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <CardButton variant="secondary" size="sm" onClick={onClose}>
            {t.close}
          </CardButton>
          <CardButton variant="gold" size="sm" onClick={handleSaveAll}>
            {t.saveSettings}
          </CardButton>
        </div>
      </div>
    </div>
  );
};
