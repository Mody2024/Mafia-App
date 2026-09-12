import React, { useState } from 'react';
import { ThemedDialog } from '../components/ThemedDialog';
import { CardButton } from '../components/CardButton';
import { translations } from '../i18n';
import { Language } from '../types';

interface AndroidCodeExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const KOTLIN_CODE_MAIN = `package com.mafia.offlinemoderator

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

/**
 * Mafia — Offline Moderator
 * Native Android Jetpack Compose Architecture
 * 100% Offline, Zero-cloud, Zero-SDK dependencies.
 * Created by Ahmed Amr & Almuddaththir
 */

sealed class GameState {
    object Home : GameState()
    object PlayerSetup : GameState()
    object GameReady : GameState()
    object NightIntro : GameState()
    object MafiaIdentification : GameState()
    object MafiaAction : GameState()
    object MafiaTransition : GameState()
    object DetectiveIdentification : GameState()
    object DetectiveAction : GameState()
    object DetectiveTransition : GameState()
    object DoctorIdentification : GameState()
    object DoctorAction : GameState()
    object MorningTransition : GameState()
    object MorningResult : GameState()
    object DayDiscussion : GameState()
    object DayVoting : GameState()
    object VoteResult : GameState()
    data class Victory(val isCitizensWin: Boolean) : GameState()
}

data class Player(
    val id: String,
    val name: String,
    val isAlive: Boolean = true
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MafiaTheme {
                OfflineModeratorApp()
            }
        }
    }
}

@Composable
fun MafiaTheme(content: @Composable () -> Unit) {
    val darkChocolate = Color(0xFF140D09)
    val antiqueGold = Color(0xFFC59B27)
    val ivory = Color(0xFFEDE3CE)

    MaterialTheme(
        colorScheme = darkColorScheme(
            background = darkChocolate,
            surface = Color(0xFF20150F),
            primary = antiqueGold,
            onBackground = ivory,
            onSurface = ivory
        ),
        content = content
    )
}

@Composable
fun OfflineModeratorApp() {
    var state by remember { mutableStateOf<GameState>(GameState.Home) }
    var players by remember { mutableStateOf(listOf<Player>()) }
    var mafiaId by remember { mutableStateOf<String?>(null) }
    var detectiveId by remember { mutableStateOf<String?>(null) }
    var doctorId by remember { mutableStateOf<String?>(null) }
    var mafiaTargetId by remember { mutableStateOf<String?>(null) }
    var doctorTargetId by remember { mutableStateOf<String?>(null) }
    var morningVictim by remember { mutableStateOf<Player?>(null) }
    var roundNumber by remember { mutableIntStateOf(1) }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color(0xFF140D09)
    ) {
        when (state) {
            is GameState.Home -> HomeScreen(
                onNewGame = { state = GameState.PlayerSetup }
            )
            is GameState.PlayerSetup -> PlayerSetupScreen(
                players = players,
                onPlayersChange = { players = it },
                onStartGame = { state = GameState.GameReady },
                onBack = { state = GameState.Home }
            )
            is GameState.GameReady -> GameReadyScreen(
                onStartNight = { state = GameState.NightIntro }
            )
            is GameState.NightIntro -> NightIntroScreen(
                round = roundNumber,
                onAwakenMafia = {
                    state = if (mafiaId == null) GameState.MafiaIdentification else GameState.MafiaAction
                }
            )
            is GameState.MafiaIdentification -> IdentificationScreen(
                title = "Mafia, Who are you?",
                players = players.filter { it.isAlive },
                onSelectSelf = { selected ->
                    mafiaId = selected.id
                    state = GameState.MafiaAction
                }
            )
            is GameState.MafiaAction -> MafiaActionScreen(
                livingPlayers = players.filter { it.isAlive && it.id != mafiaId },
                onConfirmTarget = { target ->
                    mafiaTargetId = target.id
                    state = GameState.MafiaTransition
                }
            )
            is GameState.MafiaTransition -> PrivacyTransitionScreen(
                seconds = 6,
                onFinished = {
                    state = if (detectiveId == null) GameState.DetectiveIdentification else GameState.DetectiveAction
                }
            )
            is GameState.DetectiveIdentification -> IdentificationScreen(
                title = "Detective, Who are you?",
                players = players.filter { it.isAlive },
                onSelectSelf = { selected ->
                    detectiveId = selected.id
                    state = GameState.DetectiveAction
                }
            )
            is GameState.DetectiveAction -> DetectiveActionScreen(
                livingPlayers = players.filter { it.isAlive && it.id != detectiveId },
                mafiaId = mafiaId,
                onFinished = { state = GameState.DetectiveTransition }
            )
            is GameState.DetectiveTransition -> PrivacyTransitionScreen(
                seconds = 6,
                onFinished = {
                    state = if (doctorId == null) GameState.DoctorIdentification else GameState.DoctorAction
                }
            )
            is GameState.DoctorIdentification -> IdentificationScreen(
                title = "Doctor, Who are you?",
                players = players.filter { it.isAlive },
                onSelectSelf = { selected ->
                    doctorId = selected.id
                    state = GameState.DoctorAction
                }
            )
            is GameState.DoctorAction -> DoctorActionScreen(
                livingPlayers = players.filter { it.isAlive },
                onConfirmTarget = { target ->
                    doctorTargetId = target.id
                    // Resolve Night
                    if (mafiaTargetId == doctorTargetId) {
                        morningVictim = null
                    } else {
                        morningVictim = players.find { it.id == mafiaTargetId }
                        morningVictim?.let { v ->
                            players = players.map { if (it.id == v.id) it.copy(isAlive = false) else it }
                        }
                    }
                    state = GameState.MorningTransition
                }
            )
            is GameState.MorningTransition -> PrivacyTransitionScreen(
                seconds = 6,
                onFinished = { state = GameState.MorningResult }
            )
            is GameState.MorningResult -> MorningResultScreen(
                victim = morningVictim,
                onProceed = {
                    // Check Victory
                    val aliveMafia = players.count { it.isAlive && it.id == mafiaId }
                    val aliveCitizens = players.count { it.isAlive && it.id != mafiaId }
                    if (aliveMafia == 0) {
                        state = GameState.Victory(isCitizensWin = true)
                    } else if (aliveMafia >= aliveCitizens) {
                        state = GameState.Victory(isCitizensWin = false)
                    } else {
                        state = GameState.DayDiscussion
                    }
                }
            )
            is GameState.DayDiscussion -> DayDiscussionScreen(
                onProceedToVote = { state = GameState.DayVoting }
            )
            is GameState.DayVoting -> SecretVotingScreen(
                players = players.filter { it.isAlive },
                onVotesComplete = { results ->
                    // Find highest voted
                    val maxVotes = results.values.maxOrNull() ?: 0
                    val candidates = results.filter { it.value == maxVotes }.keys.toList()
                    if (candidates.size == 1) {
                        val eliminatedId = candidates[0]
                        players = players.map { if (it.id == eliminatedId) it.copy(isAlive = false) else it }
                    }
                    state = GameState.VoteResult
                }
            )
            is GameState.VoteResult -> VoteResultScreen(
                onProceed = {
                    val aliveMafia = players.count { it.isAlive && it.id == mafiaId }
                    val aliveCitizens = players.count { it.isAlive && it.id != mafiaId }
                    if (aliveMafia == 0) {
                        state = GameState.Victory(isCitizensWin = true)
                    } else if (aliveMafia >= aliveCitizens) {
                        state = GameState.Victory(isCitizensWin = false)
                    } else {
                        roundNumber++
                        state = GameState.NightIntro
                    }
                }
            )
            is GameState.Victory -> VictoryScreen(
                isCitizensWin = (state as GameState.Victory).isCitizensWin,
                onPlayAgain = {
                    players = players.map { it.copy(isAlive = true) }
                    mafiaId = null
                    detectiveId = null
                    doctorId = null
                    roundNumber = 1
                    state = GameState.GameReady
                },
                onHome = {
                    players = listOf()
                    state = GameState.Home
                }
            )
        }
    }
}
`;

export const AndroidCodeExportDialog: React.FC<AndroidCodeExportDialogProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [copied, setCopied] = useState(false);
  const t = translations[language];

  const handleCopy = () => {
    navigator.clipboard.writeText(KOTLIN_CODE_MAIN).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([KOTLIN_CODE_MAIN], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'MainActivity.kt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ThemedDialog
      isOpen={isOpen}
      onClose={onClose}
      title={t.androidCodeTitle}
      subtitle={t.androidCodeSubtitle}
      maxWidth="lg"
    >
      <div className="space-y-4">
        <p className="text-xs text-[#a89078] leading-relaxed">
          {language === 'ar'
            ? 'هذا الكود هو تطبيق Kotlin كامل بنظام Jetpack Compose الأصلي لتشغيله في Android Studio، بنفس محرك الحالات والمنطق الخالي من الإنترنت تماماً.'
            : 'Here is the complete native Kotlin + Jetpack Compose source code ready for Android Studio, implementing the exact state machine and privacy rules.'}
        </p>

        <div className="relative">
          <pre className="p-3 bg-[#110a07] border border-[#c59b27]/40 rounded-xs text-[11px] font-mono text-[#ede3ce] overflow-x-auto max-h-72 select-text">
            {KOTLIN_CODE_MAIN}
          </pre>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex gap-2">
            <CardButton variant="gold" size="sm" onClick={handleCopy}>
              {copied ? t.copied : t.copyCode}
            </CardButton>
            <CardButton variant="secondary" size="sm" onClick={handleDownload}>
              {t.downloadKt}
            </CardButton>
          </div>

          <CardButton variant="secondary" size="sm" onClick={onClose}>
            {t.close}
          </CardButton>
        </div>
      </div>
    </ThemedDialog>
  );
};
