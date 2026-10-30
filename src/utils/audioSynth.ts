/**
 * Ambient Wedding Music & YouTube Player Manager
 * Supports:
 * 1. Seamless YouTube background playback for wedding songs (e.g. Wedding Sehra)
 * 2. Custom MP3 audio element playback
 * 3. Soft Web Audio API romantic acoustic harp/piano synthesizer fallback
 */

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

class WeddingAudioManager {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private listeners: Set<(playing: boolean) => void> = new Set();
  private customUrl: string = '';
  private youtubeVideoId: string = 'HD4UtsmAV4Y'; // Default to user requested song
  private ytPlayer: any = null;
  private isYtReady: boolean = false;
  private isYtLoading: boolean = false;
  private pendingPlay: boolean = false;

  constructor() {
    this.initYouTubeApi();
  }

  public subscribe(fn: (playing: boolean) => void) {
    this.listeners.add(fn);
    fn(this.isPlaying);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isPlaying));
  }

  public setCustomUrl(url: string) {
    this.customUrl = url;
    if (this.audioElement && this.isPlaying) {
      this.stop();
      this.play();
    }
  }

  public setYoutubeVideoId(id: string) {
    if (this.youtubeVideoId === id) return;
    this.youtubeVideoId = id;
    if (this.ytPlayer && this.isYtReady) {
      try {
        this.ytPlayer.loadVideoById(id);
        if (!this.isPlaying) {
          this.ytPlayer.pauseVideo();
        }
      } catch (e) {
        console.warn('Error loading new YouTube video ID:', e);
      }
    }
  }

  private initYouTubeApi() {
    if (typeof window === 'undefined') return;

    if (window.YT && window.YT.Player) {
      this.setupYouTubePlayer();
      return;
    }

    if (!document.getElementById('youtube-iframe-api')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevReady) prevReady();
      this.setupYouTubePlayer();
    };
  }

  public setupYouTubePlayer(containerId = 'youtube-player-hidden-container') {
    if (typeof window === 'undefined' || !window.YT || !window.YT.Player) return;
    if (this.ytPlayer) return;

    let el = document.getElementById(containerId);
    if (!el) {
      el = document.createElement('div');
      el.id = containerId;
      // Position off-screen or invisible but accessible for audio
      el.style.position = 'fixed';
      el.style.bottom = '-9999px';
      el.style.left = '-9999px';
      el.style.width = '200px';
      el.style.height = '200px';
      el.style.opacity = '0.01';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '-999';
      document.body.appendChild(el);
    }

    try {
      this.ytPlayer = new window.YT.Player(containerId, {
        height: '200',
        width: '200',
        videoId: this.youtubeVideoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          loop: 1,
          playlist: this.youtubeVideoId,
          modestbranding: 1,
          playsinline: 1,
          rel: 0
        },
        events: {
          onReady: (event: any) => {
            this.isYtReady = true;
            try {
              event.target.setVolume(85);
            } catch {
              // ignore
            }
            if (this.pendingPlay) {
              this.pendingPlay = false;
              this.play();
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING === 1
            if (event.data === 1) {
              this.isPlaying = true;
              this.notify();
            } else if (event.data === 2 || event.data === 0) {
              // Paused or Ended
              this.isPlaying = false;
              this.notify();
            }
          },
          onError: (err: any) => {
            console.warn('YouTube Player encountered an error, falling back:', err);
            // If YouTube is blocked by user's network or adblocker, fallback to synth
            if (this.isPlaying) {
              this.playWebAudioFallback();
            }
          }
        }
      });
    } catch (err) {
      console.warn('Could not initialize YouTube Player:', err);
    }
  }

  public async play(): Promise<void> {
    // 1. First priority: YouTube Song ("Wedding Sehra")
    if (this.youtubeVideoId) {
      if (!this.isYtReady || !this.ytPlayer) {
        this.pendingPlay = true;
        this.initYouTubeApi();
        // Temporarily activate synth until YouTube starts so guest hears music immediately
        this.playWebAudioFallback();
        return;
      }

      try {
        // Stop any running synth fallback
        this.stopWebAudioFallback();
        this.ytPlayer.playVideo();
        this.isPlaying = true;
        this.notify();
        return;
      } catch (e) {
        console.warn('YouTube playVideo failed:', e);
      }
    }

    // 2. Second priority: Custom MP3 audio element if provided
    if (this.customUrl) {
      try {
        if (!this.audioElement) {
          this.audioElement = new Audio(this.customUrl);
          this.audioElement.loop = true;
        }
        await this.audioElement.play();
        this.isPlaying = true;
        this.notify();
        return;
      } catch (err) {
        console.warn('Custom audio failed, falling back to gentle synth:', err);
      }
    }

    // 3. Third priority: Web Audio API Synthesizer
    this.playWebAudioFallback();
  }

  public stop() {
    this.isPlaying = false;
    this.pendingPlay = false;

    if (this.ytPlayer && this.isYtReady) {
      try {
        this.ytPlayer.pauseVideo();
      } catch {
        // ignore
      }
    }

    if (this.audioElement) {
      this.audioElement.pause();
    }

    this.stopWebAudioFallback();
    this.notify();
  }

  public toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  public setVolume(level: number) {
    if (this.ytPlayer && this.isYtReady) {
      try {
        this.ytPlayer.setVolume(Math.max(0, Math.min(100, level)));
      } catch {
        // ignore
      }
    }
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, level / 100));
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private stopWebAudioFallback() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private async playWebAudioFallback() {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioContextClass();
      }
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      this.isPlaying = true;
      this.notify();
      this.startAmbientArpeggio();
    } catch (e) {
      console.warn('Web Audio error:', e);
      this.isPlaying = false;
      this.notify();
    }
  }

  /**
   * Generates a romantic, soothing musical progression
   * Chords: Fmaj9 -> Cmaj7 -> Dm9 -> Bbmaj7
   */
  private startAmbientArpeggio() {
    if (!this.ctx || this.timerId !== null) return;

    const chords: number[][] = [
      [174.61, 261.63, 329.63, 349.23, 440.0, 523.25], // F major 9
      [196.0, 246.94, 293.66, 392.0, 493.88, 587.33], // G major 7
      [146.83, 220.0, 261.63, 349.23, 440.0, 523.25], // D minor 9
      [233.08, 293.66, 349.23, 466.16, 587.33, 698.46] // Bb major 7
    ];

    let chordIdx = 0;
    let step = 0;

    const playNote = () => {
      if (!this.isPlaying || !this.ctx) return;
      try {
        const chord = chords[chordIdx % chords.length];
        const freq = chord[step % chord.length];
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 0.999, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.045, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + 3.0);
        osc2.stop(now + 3.0);

        step++;
        if (step % chord.length === 0) {
          chordIdx++;
        }
      } catch (err) {
        console.warn('Synth note error:', err);
      }
    };

    playNote();
    this.timerId = window.setInterval(playNote, 620);
  }
}

export const weddingAudio = new WeddingAudioManager();
