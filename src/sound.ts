/**
 * Offline Procedural Audio Engine for Mafia — Offline Moderator
 * Generates all sound effects and ambient soundscapes locally using the Web Audio API.
 * 100% offline, zero network requests, zero remote assets.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private isAmbientPlaying: boolean = false;

  private isSoundEnabled: boolean = true;
  private isAmbientEnabled: boolean = false;
  private masterVolume: number = 0.8;

  constructor() {
    // Lazy AudioContext initialization on first user interaction
  }

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public updateConfig(soundEffects: boolean, ambientAudio: boolean, masterVolume: number) {
    this.isSoundEnabled = soundEffects;
    this.isAmbientEnabled = ambientAudio;
    this.masterVolume = Math.max(0, Math.min(1, masterVolume));

    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isAmbientEnabled ? 0.08 * this.masterVolume : 0, this.ctx.currentTime);
    }

    if (!this.isAmbientEnabled && this.isAmbientPlaying) {
      this.stopAmbient();
    }
  }

  // Helper for master gain
  private getMasterGain(time: number): GainNode | null {
    if (!this.ctx || !this.isSoundEnabled) return null;
    const master = this.ctx.createGain();
    master.gain.setValueAtTime(this.masterVolume, time);
    master.connect(this.ctx.destination);
    return master;
  }

  // 1. Night Start: Deep resonant gong & mysterious night wind
  public playNightStart() {
    this.init();
    if (!this.ctx || !this.isSoundEnabled) return;
    const now = this.ctx.currentTime;
    const master = this.getMasterGain(now);
    if (!master) return;

    // Fundamental gong
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 3.0);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

    osc.connect(gain);
    gain.connect(master);
    osc.start(now);
    osc.stop(now + 3.2);

    // Overtone shimmer
    const overtone = this.ctx.createOscillator();
    const overGain = this.ctx.createGain();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(285, now);
    overtone.frequency.exponentialRampToValueAtTime(140, now + 2.5);

    overGain.gain.setValueAtTime(0.3, now);
    overGain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);

    overtone.connect(overGain);
    overGain.connect(master);
    overtone.start(now);
    overtone.stop(now + 2.6);
  }

  // 2. Mafia Wake: Deep suspenseful minor drone and eerie chime
  public playMafiaWake() {
    this.init();
    if (!this.ctx || !this.isSoundEnabled) return;
    const now = this.ctx.currentTime;
    const master = this.getMasterGain(now);
    if (!master) return;

    // Low mysterious pulse
    const notes = [82.41, 98.0, 123.47]; // E2, G2, B2
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);

      // Filter for dark moody tone
      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      gain.gain.setValueAtTime(0.2, now + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start(now + idx * 0.15);
      osc.stop(now + 2.3);
    });
  }

  // 3. Detective Wake: Crisp inquisitive inspection ping and resonant bell
  public playDetectiveWake() {
    this.init();
    if (!this.ctx || !this.isSoundEnabled) return;
    const now = this.ctx.currentTime;
    const master = this.getMasterGain(now);
    if (!master) return;

    const notes = [440, 659.25, 880]; // A4, E5, A5
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.35, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.2);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 1.3);
    });
  }

  // 4. Doctor Wake: Soothing harmonic healing chime / harp
  public playDoctorWake() {
    this.init();
    if (!this.ctx || !this.isSoundEnabled) return;
    const now = this.ctx.currentTime;
    const master = this.getMasterGain(now);
    if (!master) return;

    const chords = [329.63, 392.0, 493.88, 587.33]; // E4, G4, B4, D5 (Em7 gentle harp)
    chords.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);

      gain.gain.setValueAtTime(0.3, now + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 1.6);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 1.7);
    });
  }

  // 5. Morning: Radiant dawn bell chime
  public playMorning() {
    this.init();
    if (!this.ctx || !this.isSoundEnabled) return;
    const now = this.ctx.currentTime;
    const master = this.getMasterGain(now);
    if (!master) return;

    const dawn = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    dawn.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);

      gain.gain.setValueAtTime(0.35, now + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 2.0);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 2.1);
    });
  }

  // 6. Confirmation: Tactile card snap / wooden click
  public playConfirmation() {
    this.init();
    if (!this.ctx || !this.isSoundEnabled) return;
    const now = this.ctx.currentTime;
    const master = this.getMasterGain(now);
    if (!master) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(master);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // 7. Vote Reveal: Suspenseful sting
  public playVoteReveal() {
    this.init();
    if (!this.ctx || !this.isSoundEnabled) return;
    const now = this.ctx.currentTime;
    const master = this.getMasterGain(now);
    if (!master) return;

    // Quick drum roll pulse
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120 + i * 20, now + i * 0.08);
      gain.gain.setValueAtTime(0.3, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.07);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.08);
    }

    // Final reveal accent
    const sting = this.ctx.createOscillator();
    const stingGain = this.ctx.createGain();
    sting.type = 'sawtooth';
    sting.frequency.setValueAtTime(370, now + 0.35);
    stingGain.gain.setValueAtTime(0.4, now + 0.35);
    stingGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    sting.connect(stingGain);
    stingGain.connect(master);
    sting.start(now + 0.35);
    sting.stop(now + 1.3);
  }

  // 8. Elimination: Heavy gavel thud & crack
  public playElimination() {
    this.init();
    if (!this.ctx || !this.isSoundEnabled) return;
    const now = this.ctx.currentTime;
    const master = this.getMasterGain(now);
    if (!master) return;

    // Heavy bass strike
    const bass = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bass.type = 'sine';
    bass.frequency.setValueAtTime(140, now);
    bass.frequency.exponentialRampToValueAtTime(35, now + 0.4);
    bassGain.gain.setValueAtTime(0.8, now);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    bass.connect(bassGain);
    bassGain.connect(master);
    bass.start(now);
    bass.stop(now + 0.7);

    // Crack noise
    const crack = this.ctx.createOscillator();
    const crackGain = this.ctx.createGain();
    crack.type = 'sawtooth';
    crack.frequency.setValueAtTime(450, now);
    crack.frequency.exponentialRampToValueAtTime(80, now + 0.15);
    crackGain.gain.setValueAtTime(0.5, now);
    crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    crack.connect(crackGain);
    crackGain.connect(master);
    crack.start(now);
    crack.stop(now + 0.25);
  }

  // 9. Mafia Victory: Dark imperial triumph
  public playMafiaVictory() {
    this.init();
    if (!this.ctx || !this.isSoundEnabled) return;
    const now = this.ctx.currentTime;
    const master = this.getMasterGain(now);
    if (!master) return;

    const sequence = [130.81, 155.56, 196.0, 164.81, 196.0, 261.63]; // C3, Eb3, G3, E3, G3, C4
    sequence.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.25);

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now + idx * 0.25);

      gain.gain.setValueAtTime(0.35, now + idx * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.25 + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start(now + idx * 0.25);
      osc.stop(now + idx * 0.25 + 1.0);
    });
  }

  // 10. Citizen Victory: Triumphant royal gold fanfare
  public playCitizenVictory() {
    this.init();
    if (!this.ctx || !this.isSoundEnabled) return;
    const now = this.ctx.currentTime;
    const master = this.getMasterGain(now);
    if (!master) return;

    const sequence = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
    sequence.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.2);

      gain.gain.setValueAtTime(0.4, now + idx * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.2 + 1.2);

      osc.connect(gain);
      gain.connect(master);

      osc.start(now + idx * 0.2);
      osc.stop(now + idx * 0.2 + 1.3);
    });
  }

  public haptic(ms: number = 30) {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch {
        // ignore
      }
    }
  }

  // 11. Heartbeat of Suspense: Low visceral double pulse
  public playHeartbeat() {
    this.init();
    if (!this.ctx || !this.isSoundEnabled) return;
    const now = this.ctx.currentTime;
    const master = this.getMasterGain(now);
    if (!master) return;

    this.haptic(40);

    // Beat 1
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(68, now);
    osc1.frequency.exponentialRampToValueAtTime(38, now + 0.12);
    gain1.gain.setValueAtTime(0.55, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc1.connect(gain1);
    gain1.connect(master);
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Beat 2
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(54, now + 0.18);
    osc2.frequency.exponentialRampToValueAtTime(32, now + 0.32);
    gain2.gain.setValueAtTime(0.4, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(master);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.36);
  }

  // 12. Card Deal / Flip: Crisp tactile paper snap
  public playCardFlip() {
    this.init();
    if (!this.ctx || !this.isSoundEnabled) return;
    const now = this.ctx.currentTime;
    const master = this.getMasterGain(now);
    if (!master) return;

    this.haptic(20);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(master);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  // 13. Timer Tick: Subtle antique grandfather clock tick
  public playTick() {
    this.init();
    if (!this.ctx || !this.isSoundEnabled) return;
    const now = this.ctx.currentTime;
    const master = this.getMasterGain(now);
    if (!master) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.025);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(master);
    osc.start(now);
    osc.stop(now + 0.035);
  }

  // 14. Timer Critical Alert: Urgent dual warning chime
  public playTimerWarning() {
    this.init();
    if (!this.ctx || !this.isSoundEnabled) return;
    const now = this.ctx.currentTime;
    const master = this.getMasterGain(now);
    if (!master) return;

    this.haptic(60);

    const freqs = [880, 1174.66]; // A5, D6
    freqs.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.1);
      gain.gain.setValueAtTime(0.4, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.45);
    });
  }

  // 15. Double Gavel Strike: Council moderator authority
  public playGavelDouble() {
    this.init();
    if (!this.ctx || !this.isSoundEnabled) return;
    const now = this.ctx.currentTime;
    const master = this.getMasterGain(now);
    if (!master) return;

    this.haptic(70);

    [0, 0.28].forEach((offset) => {
      // Deep wood strike
      const strike = this.ctx!.createOscillator();
      const strikeGain = this.ctx!.createGain();
      strike.type = 'sine';
      strike.frequency.setValueAtTime(160, now + offset);
      strike.frequency.exponentialRampToValueAtTime(40, now + offset + 0.2);
      strikeGain.gain.setValueAtTime(0.7, now + offset);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.28);
      strike.connect(strikeGain);
      strikeGain.connect(master);
      strike.start(now + offset);
      strike.stop(now + offset + 0.3);

      // Crack snap
      const crack = this.ctx!.createOscillator();
      const crackGain = this.ctx!.createGain();
      crack.type = 'sawtooth';
      crack.frequency.setValueAtTime(520, now + offset);
      crack.frequency.exponentialRampToValueAtTime(90, now + offset + 0.1);
      crackGain.gain.setValueAtTime(0.45, now + offset);
      crackGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);
      crack.connect(crackGain);
      crackGain.connect(master);
      crack.start(now + offset);
      crack.stop(now + offset + 0.14);
    });
  }

  // 16. Crystal Bell Chime
  public playChime() {
    this.init();
    if (!this.ctx || !this.isSoundEnabled) return;
    const now = this.ctx.currentTime;
    const master = this.getMasterGain(now);
    if (!master) return;

    const freqs = [1046.5, 1318.51, 1567.98]; // C6, E6, G6
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.25, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.3);
    });
  }

  // 17. Desert Night Wind: Eerie ambient gust
  public playWhisperWind() {
    this.init();
    if (!this.ctx || !this.isSoundEnabled) return;
    const now = this.ctx.currentTime;
    const master = this.getMasterGain(now);
    if (!master) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(160, now + 1.2);
    osc.frequency.linearRampToValueAtTime(95, now + 2.4);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(280, now);
    filter.frequency.linearRampToValueAtTime(450, now + 1.2);
    filter.frequency.linearRampToValueAtTime(220, now + 2.4);
    filter.Q.setValueAtTime(3.0, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 1.0);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc.start(now);
    osc.stop(now + 2.5);
  }

  // Ambient Night Drone
  public startAmbient() {
    this.init();
    if (!this.ctx || !this.isAmbientEnabled || this.isAmbientPlaying) return;

    try {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.06 * this.masterVolume, this.ctx.currentTime);

      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc2 = this.ctx.createOscillator();

      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(65.41, this.ctx.currentTime); // C2

      this.ambientOsc2.type = 'triangle';
      this.ambientOsc2.frequency.setValueAtTime(98.0, this.ctx.currentTime); // G2

      this.ambientOsc1.connect(this.ambientGain);
      this.ambientOsc2.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
      this.isAmbientPlaying = true;
    } catch {
      // Audio context might be restricted
    }
  }

  public stopAmbient() {
    if (!this.isAmbientPlaying) return;
    try {
      if (this.ambientOsc1) {
        this.ambientOsc1.stop();
        this.ambientOsc1.disconnect();
        this.ambientOsc1 = null;
      }
      if (this.ambientOsc2) {
        this.ambientOsc2.stop();
        this.ambientOsc2.disconnect();
        this.ambientOsc2 = null;
      }
      if (this.ambientGain) {
        this.ambientGain.disconnect();
        this.ambientGain = null;
      }
    } catch {
      // ignore cleanup errors
    }
    this.isAmbientPlaying = false;
  }

  // Aliases for intuitive component triggers
  public playDayAwakening() {
    this.playMorning();
  }

  public playInspectionPing() {
    this.playDetectiveWake();
  }

  public playDoctorSave() {
    this.playDoctorWake();
  }

  public playTensionPulse() {
    this.playHeartbeat();
  }

  public playMysticChime() {
    this.playChime();
  }

  public playGavel() {
    this.playGavelDouble();
  }
}

export const soundManager = new SoundEngine();
