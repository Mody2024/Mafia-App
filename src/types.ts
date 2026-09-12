export type Language = 'en' | 'ar';

export type GameState =
  | 'HOME'
  | 'PLAYER_SETUP'
  | 'GAME_READY'
  | 'NIGHT_INTRO'
  | 'MAFIA_IDENTIFICATION'
  | 'MAFIA_ACTION'
  | 'MAFIA_TRANSITION'
  | 'DETECTIVE_IDENTIFICATION'
  | 'DETECTIVE_ACTION'
  | 'DETECTIVE_TRANSITION'
  | 'DOCTOR_IDENTIFICATION'
  | 'DOCTOR_ACTION'
  | 'MORNING_TRANSITION'
  | 'MORNING_RESULT'
  | 'DAY_DISCUSSION'
  | 'DAY_VOTING'
  | 'VOTE_RESULT'
  | 'ELIMINATION'
  | 'VICTORY';

export type RoleActionType = 'eliminate' | 'investigate' | 'protect' | 'custom';
export type RoleTargetType = 'living_other' | 'living_any';
export type RoleResultType = 'none' | 'affiliation' | 'status';

export interface RoleDefinition {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  nightOrder: number;
  actionType: RoleActionType;
  targetType: RoleTargetType;
  resultType: RoleResultType;
  description: {
    en: string;
    ar: string;
  };
}

export interface Player {
  id: string;
  name: string;
  isAlive: boolean;
  eliminatedInRound?: number;
  eliminatedReason?: 'mafia' | 'vote' | 'other';
}

export interface SecretRoles {
  mafiaPlayerId: string | null;
  detectivePlayerId: string | null;
  doctorPlayerId: string | null;
}

export interface NightTargets {
  mafiaTarget: string | null;
  detectiveTarget: string | null;
  doctorTarget: string | null;
}

export type TieBehavior = 'no_elimination' | 'revote' | 'both_eliminated';

export interface GameSettings {
  language: Language;
  transitionDelay: 5 | 6 | 7; // in seconds
  soundEffects: boolean;
  ambientAudio: boolean;
  masterVolume: number; // 0.0 to 1.0
  discussionMinutes: number; // e.g. 3, 5, 7, 10
  tieBehavior: TieBehavior;
  customLogoUrl: string | null;
  enableDetective: boolean;
  enableDoctor: boolean;
  hapticFeedback: boolean;
}

export interface VoteRecord {
  voterId: string;
  targetId: string;
}

export type VictoryTeam = 'citizens' | 'mafia' | null;

export interface ChronicleEntry {
  id: string;
  round: number;
  phase: 'night' | 'day' | 'system';
  type: 'night_kill' | 'doctor_save' | 'vote_elimination' | 'tie_vote' | 'game_start' | 'kill' | 'save' | 'investigate' | 'vote' | 'system';
  titleEn?: string;
  titleAr?: string;
  descriptionEn: string;
  descriptionAr: string;
  involvedPlayerNames?: string[];
  timestamp: number;
}

export interface SavedRoster {
  id: string;
  name: string;
  playerNames: string[];
  savedAt: number;
}

export interface MatchStats {
  round: number;
  eliminatedPlayersHistory: Array<{
    playerId: string;
    playerName: string;
    round: number;
    phase: 'night' | 'day';
    savedByDoctor?: boolean;
  }>;
}
