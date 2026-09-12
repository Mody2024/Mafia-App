import { RoleDefinition } from './types';

/**
 * Extensible Role Engine for Mafia — Offline Moderator.
 * Defines roles with their order of awakening during night, action type, target constraints, and result reporting.
 * New custom physical deck roles (e.g. Bodyguard, Vigilante, Jester, Silencer) can easily be added here.
 */

export const INITIAL_ROLES: RoleDefinition[] = [
  {
    id: 'mafia',
    name: {
      en: 'Mafia',
      ar: 'المافيا'
    },
    nightOrder: 1,
    actionType: 'eliminate',
    targetType: 'living_other',
    resultType: 'none',
    description: {
      en: 'Wakes first to choose a council member to eliminate.',
      ar: 'تستيقظ أولاً لاختيار أحد أعضاء المجلس لتصفيته.'
    }
  },
  {
    id: 'detective',
    name: {
      en: 'Detective',
      ar: 'المحقق'
    },
    nightOrder: 2,
    actionType: 'investigate',
    targetType: 'living_other',
    resultType: 'affiliation',
    description: {
      en: 'Inspects a player under secrecy to discover if they are Mafia or Innocent.',
      ar: 'يفحص أحد اللاعبين بسرية لمعرفة ما إذا كان مافيا أم بريئاً.'
    }
  },
  {
    id: 'doctor',
    name: {
      en: 'Doctor',
      ar: 'الطبيب'
    },
    nightOrder: 3,
    actionType: 'protect',
    targetType: 'living_any',
    resultType: 'none',
    description: {
      en: 'Administers the sacred antidote to protect one player from tonight\'s attack.',
      ar: 'يقدم الترياق الشافي لحماية أحد اللاعبين من هجوم الليلة.'
    }
  },
  {
    id: 'innocent',
    name: {
      en: 'Innocent Citizen',
      ar: 'مواطن بريء'
    },
    nightOrder: 99,
    actionType: 'custom',
    targetType: 'living_other',
    resultType: 'none',
    description: {
      en: 'Sleeps soundly through the night, voting wisely during the day.',
      ar: 'ينام بسلام طوال الليل، ويشارك بحكمة في تصويت النهار.'
    }
  }
];

export function getRoleById(roleId: string): RoleDefinition | undefined {
  return INITIAL_ROLES.find(r => r.id === roleId);
}
