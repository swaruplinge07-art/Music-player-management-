/**
 * Audio Engine with dual-backend support:
 * 1. Primary: Standard HTML5 Audio element for MP3 playback.
 * 2. Fallback: Web Audio API Oscillator Synthesizer that seamlessly produces melodic
 *    chords if the network blocks or fails to load external audio URLs.
 */

export type AudioEngineListener = {
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onEnded: () => void;
  onError: (error: string) => void;
  onPlayStateChange: (isPlaying: boolean) => void;
  onFallbackActive: (isUsingSynth: boolean) => void;
};

export class AudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private duration: number = 200;
  private currentTime: number = 0;
  private volume: number = 0.8;
  private isMuted: boolean = false;
  private listener: AudioEngineListener | null = null;

  // Web Audio Synth Fallback variables
  private audioCtx: AudioContext | null = null;
  private synthGain: GainNode | null = null;
  private isSynthActive: boolean = false;
  private synthTimer: number | null = null;
  private synthInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.preload = 'metadata';
      this.audioElement.volume = this.volume;

      this.audioElement.addEventListener('timeupdate', () => {
        if (!this.isSynthActive && this.audioElement) {
          this.currentTime = this.audioElement.currentTime;
          this.duration = this.audioElement.duration || this.duration;
          this.listener?.onTimeUpdate(this.currentTime, this.duration);
        }
      });

      this.audioElement.addEventListener('ended', () => {
        this.isPlaying = false;
        this.listener?.onPlayStateChange(false);
        this.listener?.onEnded();
      });

      this.audioElement.addEventListener('error', () => {
        // Switch to Web Audio Synth fallback gracefully without interrupting user experience
        console.warn('Audio URL playback failed. Activating Web Audio API Synth fallback.');
        this.startSynthFallback();
      });
    }
  }

  public setListener(listener: AudioEngineListener): void {
    this.listener = listener;
  }

  public loadTrack(audioUrl: string, expectedDuration: number): void {
    this.stopSynthFallback();
    this.duration = expectedDuration;
    this.currentTime = 0;

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = audioUrl;
      this.audioElement.load();
    }
  }

  public async play(): Promise<void> {
    this.isPlaying = true;
    this.listener?.onPlayStateChange(true);

    if (this.isSynthActive) {
      this.resumeSynth();
      return;
    }

    if (this.audioElement && this.audioElement.src) {
      try {
        await this.audioElement.play();
      } catch (err) {
        console.warn('HTML5 Audio play failed (CORS or format). Falling back to Web Audio Synth.', err);
        this.startSynthFallback();
      }
    } else {
      this.startSynthFallback();
    }
  }

  public pause(): void {
    this.isPlaying = false;
    this.listener?.onPlayStateChange(false);

    if (this.audioElement) {
      this.audioElement.pause();
    }

    if (this.isSynthActive) {
      this.pauseSynth();
    }
  }

  public seek(seconds: number): void {
    this.currentTime = Math.max(0, Math.min(seconds, this.duration));

    if (this.audioElement && !this.isSynthActive) {
      try {
        this.audioElement.currentTime = this.currentTime;
      } catch (e) {
        console.warn('Seek error on audio element', e);
      }
    }

    this.listener?.onTimeUpdate(this.currentTime, this.duration);
  }

  public setVolume(val: number): void {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
    if (this.synthGain && this.audioCtx) {
      this.synthGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.15, this.audioCtx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.setVolume(this.volume);
    return this.isMuted;
  }

  public isUsingSynth(): boolean {
    return this.isSynthActive;
  }

  // ===================== Web Audio Synth Fallback =====================
  private initAudioContext(): void {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
        this.synthGain = this.audioCtx.createGain();
        this.synthGain.gain.value = this.isMuted ? 0 : this.volume * 0.15;
        this.synthGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private startSynthFallback(): void {
    this.isSynthActive = true;
    this.listener?.onFallbackActive(true);
    this.initAudioContext();
    this.resumeSynth();
  }

  private stopSynthFallback(): void {
    this.isSynthActive = false;
    this.listener?.onFallbackActive(false);
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.synthTimer) {
      clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
  }

  private resumeSynth(): void {
    this.initAudioContext();
    if (!this.synthInterval) {
      // Simulate playback time advance
      this.synthInterval = window.setInterval(() => {
        if (!this.isPlaying) return;
        this.currentTime += 0.5;
        if (this.currentTime >= this.duration) {
          this.currentTime = 0;
          this.pause();
          this.listener?.onEnded();
        } else {
          this.listener?.onTimeUpdate(this.currentTime, this.duration);
        }
      }, 500);
    }

    if (!this.synthTimer) {
      // Play mellow pentatonic arpeggio notes
      const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]; // C, D, E, G, A, C5
      let step = 0;

      this.synthTimer = window.setInterval(() => {
        if (!this.isPlaying || !this.audioCtx || !this.synthGain) return;

        try {
          const osc = this.audioCtx.createOscillator();
          const noteGain = this.audioCtx.createGain();

          osc.type = 'sine';
          const freq = notes[step % notes.length];
          osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

          noteGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
          noteGain.gain.exponentialRampToValueAtTime(0.08, this.audioCtx.currentTime + 0.05);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.6);

          osc.connect(noteGain);
          noteGain.connect(this.synthGain);

          osc.start();
          osc.stop(this.audioCtx.currentTime + 0.65);
          step++;
        } catch {
          // Ignore synth glitch
        }
      }, 700);
    }
  }

  private pauseSynth(): void {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.synthTimer) {
      clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
  }
}
