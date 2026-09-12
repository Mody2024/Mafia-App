import React, { useState, useEffect } from 'react';
import { Player, Language, SavedRoster } from '../types';
import { translations } from '../i18n';
import { CardButton } from '../components/CardButton';
import { GoldDivider } from '../components/GoldDivider';
import { ThemedDialog } from '../components/ThemedDialog';
import { soundManager } from '../sound';

interface PlayerSetupScreenProps {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  onStartGame: () => void;
  onBack: () => void;
  language: Language;
}

export const PlayerSetupScreen: React.FC<PlayerSetupScreenProps> = ({
  players,
  onPlayersChange,
  onStartGame,
  onBack,
  language
}) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // For Editing
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editedName, setEditedName] = useState('');

  // For Saved Rosters
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [rosterSaveName, setRosterSaveName] = useState('');
  const [savedRosters, setSavedRosters] = useState<SavedRoster[]>(() => {
    try {
      const stored = localStorage.getItem('mafia_saved_rosters');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [rosterSuccessNotice, setRosterSuccessNotice] = useState<string | null>(null);

  const t = translations[language];

  useEffect(() => {
    try {
      localStorage.setItem('mafia_saved_rosters', JSON.stringify(savedRosters));
    } catch {
      // ignore
    }
  }, [savedRosters]);

  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newPlayerName.trim();

    if (!trimmed) {
      setErrorMsg(t.emptyNameError);
      return;
    }

    if (players.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg(t.duplicateNameError);
      return;
    }

    if (players.length >= 10) {
      setErrorMsg(t.maxPlayersNotice);
      return;
    }

    soundManager.playCardFlip();

    const newPlayer: Player = {
      id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      isAlive: true
    };

    onPlayersChange([...players, newPlayer]);
    setNewPlayerName('');
    setErrorMsg(null);
  };

  const handleRemovePlayer = (id: string) => {
    soundManager.playConfirmation();
    onPlayersChange(players.filter((p) => p.id !== id));
  };

  const handleMovePlayer = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= players.length) return;
    soundManager.playCardFlip();
    const updated = [...players];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onPlayersChange(updated);
  };

  const openEditDialog = (player: Player) => {
    setEditingPlayer(player);
    setEditedName(player.name);
  };

  const saveEditedPlayer = () => {
    if (!editingPlayer) return;
    const trimmed = editedName.trim();

    if (!trimmed) {
      setErrorMsg(t.emptyNameError);
      return;
    }

    if (
      players.some(
        (p) => p.id !== editingPlayer.id && p.name.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setErrorMsg(t.duplicateNameError);
      return;
    }

    soundManager.playConfirmation();
    onPlayersChange(
      players.map((p) => (p.id === editingPlayer.id ? { ...p, name: trimmed } : p))
    );
    setEditingPlayer(null);
    setEditedName('');
    setErrorMsg(null);
  };

  const handleQuickAddPreset = (count: number) => {
    soundManager.playConfirmation();
    const sampleNamesAr = ['كريم', 'يوسف', 'سارة', 'عمر', 'نادية', 'طارق', 'مريم', 'أحمد', 'ليلى', 'خالد'];
    const sampleNamesEn = ['Alexander', 'Sophia', 'Lucas', 'Emma', 'Oliver', 'Mia', 'Noah', 'Ava', 'Ethan', 'Isabella'];
    const source = language === 'ar' ? sampleNamesAr : sampleNamesEn;

    const chosen = source.slice(0, count).map((name, i) => ({
      id: `p_preset_${i + 1}_${Date.now()}`,
      name,
      isAlive: true
    }));

    onPlayersChange(chosen);
    setErrorMsg(null);
  };

  const handleSaveCurrentRoster = () => {
    if (players.length < 4) {
      setErrorMsg(t.minPlayersNotice);
      return;
    }
    const nameToUse = rosterSaveName.trim() || (language === 'ar' ? `مجموعة ${savedRosters.length + 1}` : `Squad ${savedRosters.length + 1}`);
    const newRoster: SavedRoster = {
      id: `roster_${Date.now()}`,
      name: nameToUse,
      playerNames: players.map((p) => p.name),
      savedAt: Date.now()
    };

    setSavedRosters([newRoster, ...savedRosters.filter((r) => r.name !== nameToUse)]);
    setRosterSaveName('');
    setRosterSuccessNotice(t.rosterSavedSuccess);
    setTimeout(() => setRosterSuccessNotice(null), 3000);
  };

  const handleLoadSavedRoster = (roster: SavedRoster) => {
    soundManager.playConfirmation();
    const loadedPlayers: Player[] = roster.playerNames.map((name, idx) => ({
      id: `p_saved_${idx}_${Date.now()}`,
      name,
      isAlive: true
    }));
    onPlayersChange(loadedPlayers);
    setShowRosterModal(false);
  };

  const handleDeleteSavedRoster = (id: string) => {
    soundManager.playConfirmation();
    setSavedRosters(savedRosters.filter((r) => r.id !== id));
  };

  const isValidCount = players.length >= 4 && players.length <= 10;

  return (
    <div className="flex flex-col min-h-[85vh] py-4 px-3 sm:px-6 max-w-lg mx-auto w-full animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-1">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f5d77f] tracking-wide uppercase">
          {t.playerSetup}
        </h2>
        <p className="text-xs text-[#a89078] mt-0.5">
          {language === 'ar'
            ? 'حدد أسماء اللاعبين الجالسين (4 إلى 10) ورتب مقاعدهم حول الطاولة.'
            : 'Enter names of players seated around the table (4 to 10) and arrange seats.'}
        </p>
      </div>

      <GoldDivider variant="diamond" className="my-2" />

      {/* Roster Tools Bar */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-serif font-bold text-[#c59b27]">
            {t.playersCount}:
          </span>
          <span
            className={`font-mono text-xs px-2 py-0.5 rounded-xs font-bold border ${
              isValidCount
                ? 'bg-[#1e2f1e] text-[#78d689] border-[#387844]'
                : 'bg-[#331114] text-[#ff8080] border-[#8a242c]'
            }`}
          >
            {players.length} / 10
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowRosterModal(true)}
            className="px-2.5 py-1 text-xs bg-[#22130c] border border-[#c59b27]/60 hover:border-[#f5d77f] text-[#f5d77f] rounded-xs font-serif cursor-pointer transition-colors"
          >
            👥 {t.savedRosters}
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAddPlayer} className="flex gap-2 mb-2">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => {
            setNewPlayerName(e.target.value);
            if (errorMsg) setErrorMsg(null);
          }}
          disabled={players.length >= 10}
          placeholder={t.playerNamePlaceholder}
          maxLength={20}
          className="flex-1 bg-[#140b07] border border-[#c59b27]/60 text-[#fbf7ee] px-3 py-2 text-sm rounded-xs focus:outline-none focus:border-[#f5d77f] placeholder-[#7d6752] disabled:opacity-40"
        />

        <CardButton
          type="submit"
          variant="gold"
          size="sm"
          disabled={players.length >= 10 || !newPlayerName.trim()}
        >
          + {t.addPlayer}
        </CardButton>
      </form>

      {/* Preset Chips */}
      <div className="flex items-center gap-1.5 mb-2 overflow-x-auto py-0.5 text-xs">
        <span className="text-[10px] text-[#a89078] font-serif uppercase tracking-wider shrink-0">
          {language === 'ar' ? 'ملء سريع:' : 'Quick Presets:'}
        </span>
        {[4, 6, 8, 10].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleQuickAddPreset(num)}
            className="px-2 py-0.5 bg-[#1a0f0a] border border-[#c59b27]/40 hover:border-[#c59b27] text-[#c59b27] hover:text-[#f5d77f] rounded-xs cursor-pointer text-[11px]"
          >
            {num} {language === 'ar' ? 'لاعبين' : 'P'}
          </button>
        ))}
      </div>

      {/* Error / Validation Warning */}
      {errorMsg && (
        <div className="p-2 mb-2 bg-[#381015] border border-[#e55353] text-[#fca5a5] text-xs text-center rounded-xs">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Players List with Seat Reordering */}
      <div className="flex-1 overflow-y-auto max-h-[46vh] space-y-1.5 pr-1 my-1">
        {players.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-[#c59b27]/30 rounded-xs bg-[#170e09]">
            <p className="text-sm text-[#a89078] italic mb-3">
              {language === 'ar'
                ? 'لا يوجد لاعبون مضافون حتى الآن. أضف أسماء أصدقائك أو اختر ملء سريع.'
                : 'No players added yet. Enter names or select a quick preset.'}
            </p>
            <CardButton
              variant="secondary"
              size="sm"
              onClick={() => handleQuickAddPreset(6)}
            >
              ⚡ {language === 'ar' ? 'إضافة 6 لاعبين تجريبيين' : 'Fill 6 Test Players'}
            </CardButton>
          </div>
        ) : (
          players.map((player, idx) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-2 bg-[#20150f] border border-[#c59b27]/40 hover:border-[#c59b27] rounded-xs transition-colors"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-serif text-xs text-[#c59b27] w-6 text-center font-bold">
                  #{idx + 1}
                </span>
                <span className="font-serif text-sm sm:text-base font-bold text-[#ede3ce] truncate">
                  {player.name}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* Reorder Up */}
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMovePlayer(idx, 'up')}
                  className="w-7 h-7 text-xs text-[#c7b095] hover:text-[#f5d77f] border border-[#c59b27]/30 hover:border-[#c59b27] disabled:opacity-20 rounded-xs flex items-center justify-center cursor-pointer"
                  title={t.moveUp}
                >
                  ▲
                </button>

                {/* Reorder Down */}
                <button
                  type="button"
                  disabled={idx === players.length - 1}
                  onClick={() => handleMovePlayer(idx, 'down')}
                  className="w-7 h-7 text-xs text-[#c7b095] hover:text-[#f5d77f] border border-[#c59b27]/30 hover:border-[#c59b27] disabled:opacity-20 rounded-xs flex items-center justify-center cursor-pointer"
                  title={t.moveDown}
                >
                  ▼
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => openEditDialog(player)}
                  className="w-7 h-7 text-xs text-[#c7b095] hover:text-[#f5d77f] border border-[#c59b27]/30 hover:border-[#c59b27] rounded-xs flex items-center justify-center cursor-pointer"
                  title={t.editPlayer}
                >
                  ✏️
                </button>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemovePlayer(player.id)}
                  className="w-7 h-7 text-xs text-[#f87171] hover:text-[#ff9999] border border-[#f87171]/30 hover:border-[#f87171] rounded-xs flex items-center justify-center cursor-pointer"
                  title={t.removePlayer}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <GoldDivider variant="simple" className="my-2.5" />

      {/* Footer Nav Buttons */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <CardButton variant="secondary" size="md" onClick={onBack}>
          ← {language === 'ar' ? 'الرئيسية' : 'Home'}
        </CardButton>

        <CardButton
          variant="gold"
          size="md"
          disabled={!isValidCount}
          onClick={() => {
            soundManager.playConfirmation();
            onStartGame();
          }}
          className={isValidCount ? 'shadow-[0_0_15px_rgba(197,155,39,0.4)]' : ''}
        >
          {t.startGame} →
        </CardButton>
      </div>

      {/* Edit Player Modal */}
      <ThemedDialog
        isOpen={Boolean(editingPlayer)}
        onClose={() => setEditingPlayer(null)}
        title={t.editPlayer}
        maxWidth="sm"
        showActions
        cancelText={t.cancel}
        confirmText={t.confirm}
        onConfirm={saveEditedPlayer}
      >
        <div className="space-y-3">
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            maxLength={20}
            className="w-full bg-[#140b07] border border-[#c59b27] text-[#ede3ce] px-3 py-2 text-sm rounded-xs focus:outline-none"
          />
        </div>
      </ThemedDialog>

      {/* Saved Rosters Management Modal */}
      <ThemedDialog
        isOpen={showRosterModal}
        onClose={() => setShowRosterModal(false)}
        title={t.savedRosters}
        maxWidth="md"
      >
        <div className="space-y-4">
          {/* Save Current Roster Section */}
          <div className="p-3 bg-[#170e09] border border-[#c59b27]/40 rounded-xs space-y-2">
            <h4 className="font-serif text-xs font-bold text-[#f5d77f] uppercase tracking-wider">
              {t.saveRoster}
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={rosterSaveName}
                onChange={(e) => setRosterSaveName(e.target.value)}
                placeholder={t.enterRosterName}
                maxLength={25}
                className="flex-1 bg-[#100905] border border-[#c59b27]/60 text-xs px-2.5 py-1.5 text-[#ede3ce] rounded-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveCurrentRoster}
                disabled={players.length < 4}
                className="px-3 py-1.5 bg-[#c59b27] text-[#140b07] font-bold text-xs rounded-xs hover:bg-[#f5d77f] disabled:opacity-40 cursor-pointer"
              >
                💾 {language === 'ar' ? 'حفظ' : 'Save'}
              </button>
            </div>
            {rosterSuccessNotice && (
              <p className="text-xs text-[#78d689] font-serif">
                ✓ {rosterSuccessNotice}
              </p>
            )}
          </div>

          {/* List of Saved Rosters */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {savedRosters.length === 0 ? (
              <p className="text-xs text-[#a89078] italic text-center py-4">
                {language === 'ar'
                  ? 'لا توجد مجموعات محفوظة حالياً. احفظ تشكيلة أصدقائك لاسترجاعها بنقرة واحدة لاحقاً.'
                  : 'No saved groups yet. Save your group to reload with 1 tap!'}
              </p>
            ) : (
              savedRosters.map((roster) => (
                <div
                  key={roster.id}
                  className="p-3 bg-[#1d110b] border border-[#c59b27]/40 rounded-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <h5 className="font-serif text-sm font-bold text-[#f5d77f]">
                      {roster.name} ({roster.playerNames.length} {language === 'ar' ? 'لاعب' : 'players'})
                    </h5>
                    <p className="text-[11px] text-[#a89078] truncate max-w-xs mt-0.5">
                      {roster.playerNames.join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleLoadSavedRoster(roster)}
                      className="px-2.5 py-1 bg-[#2a170e] hover:bg-[#3d2315] border border-[#c59b27] text-[#f5d77f] text-xs rounded-xs font-serif cursor-pointer"
                    >
                      {language === 'ar' ? 'تحميل' : 'Load'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSavedRoster(roster.id)}
                      className="px-2 py-1 text-[#f87171] hover:text-[#ff9999] border border-[#f87171]/30 rounded-xs text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-[#c59b27]/30 text-end">
            <CardButton
              variant="secondary"
              size="sm"
              onClick={() => setShowRosterModal(false)}
            >
              {t.close}
            </CardButton>
          </div>
        </div>
      </ThemedDialog>
    </div>
  );
};
