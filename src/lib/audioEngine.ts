/**
 * Procedural audio engine using Web Audio API.
 * No external files needed — all sounds synthesized in real-time.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientGain: GainNode | null = null;
let ambientOscs: OscillatorNode[] = [];
let _muted = false;
let _ambientPlaying = false;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.4;
    masterGain.connect(ctx.destination);
    ambientGain = ctx.createGain();
    ambientGain.gain.value = 0;
    ambientGain.connect(masterGain);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function getMaster(): GainNode {
  getCtx();
  return masterGain!;
}

// ─── Mute / Volume ────────────────────────────────────────

export function isMuted(): boolean {
  return _muted;
}

export function setMuted(muted: boolean): void {
  _muted = muted;
  if (masterGain) {
    masterGain.gain.setTargetAtTime(muted ? 0 : 0.4, ctx!.currentTime, 0.1);
  }
  localStorage.setItem('olider_muted', muted ? '1' : '0');
}

export function initMuteState(): boolean {
  _muted = localStorage.getItem('olider_muted') === '1';
  return _muted;
}

// ─── Basic synth helpers ──────────────────────────────────

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3,
  detune = 0,
) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(volume, c.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(getMaster());
  osc.start(c.currentTime);
  osc.stop(c.currentTime + duration + 0.05);
}

function playNoise(duration: number, volume = 0.1, highpass = 1000) {
  const c = getCtx();
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = c.createBufferSource();
  source.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = highpass;
  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(getMaster());
  source.start();
}

// ─── Sound Effects ────────────────────────────────────────

/** UI click / hover */
export function sfxClick() {
  playTone(800, 0.08, 'sine', 0.15);
}

/** Choice button hover */
export function sfxHover() {
  playTone(600, 0.05, 'sine', 0.08);
}

/** When player selects a choice */
export function sfxChoiceSelect() {
  const c = getCtx();
  const t = c.currentTime;
  playTone(440, 0.15, 'triangle', 0.2);
  setTimeout(() => playTone(660, 0.12, 'triangle', 0.15), 80);
}

/** New event card appears */
export function sfxNewEvent() {
  playNoise(0.3, 0.06, 2000);
  playTone(220, 0.4, 'sawtooth', 0.08);
  setTimeout(() => playTone(330, 0.3, 'sine', 0.12), 100);
}

/** Result panel appears — positive shimmer */
export function sfxResult() {
  playTone(523, 0.3, 'sine', 0.15);
  setTimeout(() => playTone(659, 0.25, 'sine', 0.12), 100);
  setTimeout(() => playTone(784, 0.2, 'sine', 0.10), 200);
}

/** Stat goes dangerously low */
export function sfxDanger() {
  playTone(150, 0.4, 'sawtooth', 0.15);
  setTimeout(() => playTone(120, 0.5, 'sawtooth', 0.12), 150);
  playNoise(0.3, 0.08, 500);
}

/** Achievement unlocked */
export function sfxAchievement() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, 'sine', 0.18 - i * 0.03), i * 100);
  });
}

/** Game over — defeat */
export function sfxDefeat() {
  const notes = [440, 370, 311, 220];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.5, 'sawtooth', 0.12), i * 200);
  });
  setTimeout(() => playNoise(1.0, 0.1, 300), 600);
}

/** Game over — victory */
export function sfxVictory() {
  const notes = [523, 659, 784, 1047, 1319];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.4, 'sine', 0.2 - i * 0.02), i * 150);
  });
  setTimeout(() => {
    playTone(1047, 0.8, 'triangle', 0.15);
    playTone(1319, 0.8, 'triangle', 0.12);
    playTone(1568, 0.8, 'triangle', 0.10);
  }, 800);
}

/** Start game — dramatic low tone */
export function sfxStartGame() {
  playTone(110, 0.6, 'sawtooth', 0.1);
  playTone(165, 0.5, 'triangle', 0.08, 5);
  setTimeout(() => playTone(220, 0.4, 'sine', 0.12), 200);
  setTimeout(() => playTone(330, 0.3, 'sine', 0.15), 400);
}

// ─── Ambient Drone ────────────────────────────────────────

export function startAmbient() {
  if (_ambientPlaying) return;
  const c = getCtx();
  _ambientPlaying = true;

  // Deep drone with slow beating
  const freqs = [55, 82.5, 110, 165];
  const types: OscillatorType[] = ['sine', 'sine', 'triangle', 'sine'];

  ambientOscs = freqs.map((freq, i) => {
    const osc = c.createOscillator();
    osc.type = types[i];
    osc.frequency.value = freq;
    osc.detune.value = Math.random() * 6 - 3; // slight detuning for warmth
    osc.connect(ambientGain!);
    osc.start();
    return osc;
  });

  // Fade in
  ambientGain!.gain.setTargetAtTime(0.06, c.currentTime, 2);
}

export function stopAmbient() {
  if (!_ambientPlaying) return;
  _ambientPlaying = false;
  if (ambientGain && ctx) {
    ambientGain.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
  }
  setTimeout(() => {
    ambientOscs.forEach(o => { try { o.stop(); } catch {} });
    ambientOscs = [];
  }, 2000);
}

export function isAmbientPlaying(): boolean {
  return _ambientPlaying;
}
