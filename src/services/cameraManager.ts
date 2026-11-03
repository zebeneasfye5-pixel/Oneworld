/**
 * Sovereign Camera & Media Manager (Oneworld / ዓለም አንድ)
 * Provides ultra-fast instant zero-latency camera capture, warm-track caching across all houses,
 * automatic gesture-unlock trigger, and voice/touch command execution.
 */

type CommandListener = (command: 'fullscreen' | 'exit_fullscreen' | 'fullbody' | 'standard' | 'start_camera' | 'flip_camera') => void;

class CameraManager {
  private stream: MediaStream | null = null;
  private currentFacing: 'user' | 'environment' = 'user';
  private isAutoArming = false;
  private commandListeners: Set<CommandListener> = new Set();
  private streamListeners: Set<(stream: MediaStream | null) => void> = new Set();

  constructor() {
    this.armAutoStartOnFirstInteraction();
  }

  // Register command listener (e.g. for fullscreen, full-body, flip by command)
  public onCommand(listener: CommandListener) {
    this.commandListeners.add(listener);
    return () => {
      this.commandListeners.delete(listener);
    };
  }

  // Dispatch command from voice, chat or button
  public dispatchCommand(command: 'fullscreen' | 'exit_fullscreen' | 'fullbody' | 'standard' | 'start_camera' | 'flip_camera') {
    this.commandListeners.forEach((listener) => {
      try {
        listener(command);
      } catch (err) {
        console.warn('Command dispatch error:', err);
      }
    });
  }

  // Check voice transcript or text input for spoken/written commands
  public processVoiceOrTextCommand(input: string): boolean {
    const text = input.trim().toLowerCase();
    
    // Fullscreen commands: "ሙሉ ስክሪን", "ስክሪን ሙሉ", "ትልቅ አድርገው", "fullscreen"
    if (
      text.includes('ሙሉ ስክሪን') ||
      text.includes('ስክሪን ሙሉ') ||
      text.includes('ትልቅ አድርገው') ||
      text.includes('fullscreen') ||
      text === '/fullscreen' ||
      text === '/fs'
    ) {
      this.dispatchCommand('fullscreen');
      return true;
    }

    // Exit fullscreen: "መደበኛ", "ውጣ", "ዝጋ", "exit", "normal"
    if (
      text.includes('ሙሉ ስክሪን ዝጋ') ||
      text.includes('ከሙሉ ስክሪን ውጣ') ||
      text.includes('መደበኛ ስክሪን') ||
      text.includes('exit fullscreen') ||
      text.includes('normal screen') ||
      text === '/exit'
    ) {
      this.dispatchCommand('exit_fullscreen');
      return true;
    }

    // Full-body commands: "ሙሉ አካል", "ሙሉ ቁመት", "full body"
    if (
      text.includes('ሙሉ አካል') ||
      text.includes('ሙሉ ቁመት') ||
      text.includes('full body') ||
      text === '/fullbody'
    ) {
      this.dispatchCommand('fullbody');
      return true;
    }

    // Flip camera: "ካሜራ አዙር", "ቀይር", "flip camera"
    if (
      text.includes('ካሜራ አዙር') ||
      text.includes('የኋላ ካሜራ') ||
      text.includes('የፊት ካሜራ') ||
      text.includes('flip camera')
    ) {
      this.dispatchCommand('flip_camera');
      return true;
    }

    // Start camera: "ካሜራ አብራ", "ካሜራ ክፈት", "start camera"
    if (
      text.includes('ካሜራ አብራ') ||
      text.includes('ካሜራ ክፈት') ||
      text.includes('start camera') ||
      text.includes('open camera')
    ) {
      this.dispatchCommand('start_camera');
      return true;
    }

    return false;
  }

  // Automatic trigger on the very first touch/click on the screen to bypass browser autoplay/gesture blocks
  private armAutoStartOnFirstInteraction() {
    if (typeof window === 'undefined') return;

    const handleFirstGesture = async () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);

      if (!this.stream || !this.stream.active) {
        try {
          await this.getOrStartCamera(this.currentFacing);
        } catch {
          // silently ignored if user cancels
        }
      }
    };

    window.addEventListener('pointerdown', handleFirstGesture, { passive: true, once: true });
    window.addEventListener('touchstart', handleFirstGesture, { passive: true, once: true });
    window.addEventListener('click', handleFirstGesture, { passive: true, once: true });
  }

  public getCachedStream(): MediaStream | null {
    if (this.stream && this.stream.active) {
      return this.stream;
    }
    return null;
  }

  public subscribeStream(callback: (stream: MediaStream | null) => void) {
    this.streamListeners.add(callback);
    callback(this.getCachedStream());
    return () => {
      this.streamListeners.delete(callback);
    };
  }

  private notifyStreamListeners() {
    this.streamListeners.forEach((listener) => {
      try {
        listener(this.getCachedStream());
      } catch (e) {
        console.warn(e);
      }
    });
  }

  // Ultra-Fast Camera Acquisition (Zero-latency default driver grab)
  public async getOrStartCamera(facing: 'user' | 'environment' = 'user'): Promise<MediaStream> {
    // 1. If we already have a warm active stream with video tracks, reuse immediately (0ms)!
    if (this.stream && this.stream.active && this.stream.getVideoTracks().length > 0 && this.currentFacing === facing) {
      this.stream.getVideoTracks().forEach((track) => {
        track.enabled = true;
      });
      this.notifyStreamListeners();
      return this.stream;
    }

    // Stop previous tracks if switching front/back
    if (this.stream) {
      this.stream.getVideoTracks().forEach((t) => t.stop());
    }

    let newStream: MediaStream | null = null;

    // Fast Tier 1: Direct capture with ideal resolution to eliminate OS HAL negotiation delays
    try {
      newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
    } catch (e1) {
      console.warn('Fast Tier 1 camera attempt, trying universal fallback:', e1);
      // Fast Tier 2: Universal bare constraint (fastest possible fallback)
      newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
    }

    this.stream = newStream;
    this.currentFacing = facing;
    this.notifyStreamListeners();
    return newStream;
  }

  // Soft-disable video without destroying the hardware driver
  public stopCameraSoft() {
    if (this.stream) {
      this.stream.getVideoTracks().forEach((t) => {
        t.enabled = false;
      });
    }
    this.notifyStreamListeners();
  }

  // Hard stop
  public stopCameraHard() {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    this.notifyStreamListeners();
  }

  public async flipCamera(): Promise<MediaStream> {
    const next = this.currentFacing === 'user' ? 'environment' : 'user';
    return this.getOrStartCamera(next);
  }

  public getCurrentFacing() {
    return this.currentFacing;
  }
}

export const cameraManager = new CameraManager();
